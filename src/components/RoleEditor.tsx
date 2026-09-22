import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Check, Download, Loader2, Plus, RefreshCw, Sparkles, Trash2, X } from "lucide-react";
import { DEFAULT_STATUS_BAR, PLACEHOLDERS, emptyCharacter } from "@/lib/constants";
import { polishAll, polishField, foldWindow } from "@/lib/engine";
import { FIELD_LABELS } from "@/lib/prompts";
import { applyRoleField, mergePolish } from "@/lib/role-polish";
import { useApp } from "@/lib/store";
import { syncCharsFromRole } from "@/lib/nai";
import type { Chat, ExtraField } from "@/lib/types";
import { uid } from "@/lib/utils";
import { emptyMemory, foldCoveredEnd, memoryCaughtUp, memoryTurnStats } from "@/lib/chat-memory";
import { invalidateMemory, runManualMemory } from "./chat-actions";
import { ChatModelSelect } from "./ModelSelect";
import { Card, ExpandSelect, FieldLabel, GhostBtn, Modal, PrimaryBtn, Switch, TextArea, TextInput } from "./ui-kit";
import { LibraryDrawer } from "./LibraryDrawer";

type Busy =
  | null
  | { kind: "all" }
  | { kind: "personalize" }
  | { kind: "mem" }
  | { kind: "field"; key: string; charId?: string };

export function RoleEditor({ chat, mode }: { chat: Chat; mode: "create" | "edit" }) {
  const grok = useApp((s) => s.settings.grokModelId);
  const cards = useApp((s) => s.cards);
  const [busy, setBusy] = useState<Busy>(null);
  const [polished, setPolished] = useState(false);
  const [charSel, setCharSel] = useState(0);
  const [memPick, setMemPick] = useState(false);
  const patch = (p: Partial<Chat>) => useApp.getState().patchChat(chat.id, p);
  const char = chat.characters[charSel] ?? chat.characters[0];
  const autoPolish = useApp((s) => s.ui.autoPolish);
  const polishJob = useApp((s) => s.ui.polishJob);
  const busyRef = useRef(false);
  const locked = !!busy;
  const memTurns = memoryTurnStats(chat.messages.length, chat.memoryUntil);
  const { W, I } = foldWindow();
  const memOk = memoryCaughtUp(chat.messages.length, chat.memoryUntil || 0, W, I);
  const memReady = foldCoveredEnd(chat.messages.length, W, I) >= 2;
  const memoryHint = useApp((s) => s.ui.memoryHint);
  const memStreaming = memoryHint?.chatId === chat.id && memoryHint.state === "generating";
  const memoryShown = memStreaming && memoryHint.draft != null ? memoryHint.draft : chat.memory;
  const fieldBusyLabel =
    busy?.kind === "field" ? FIELD_LABELS[busy.key] || busy.key : "";

  const syncChars = (characters: Chat["characters"], isMulti = chat.isMulti) =>
    patch({
      characters,
      isMulti,
      imageParams: syncCharsFromRole(chat.imageParams, characters, isMulti),
    });

  const runPolish = async (instruction?: string, mark: "all" | "personalize" = "all") => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy({ kind: mark });
    try {
      const snapshot = useApp.getState().chats.find((c) => c.id === chat.id) ?? chat;
      const json = await polishAll(snapshot, grok, instruction);
      useApp.getState().patchChat(chat.id, (c) => {
        const merged = mergePolish(c, json);
        return {
          ...c,
          ...merged,
          imageParams: syncCharsFromRole(c.imageParams, merged.characters, c.isMulti),
          updatedAt: Date.now(),
        };
      });
      setPolished(true);
      useApp.getState().toast(instruction?.trim() ? "已按要求修改" : "已完善设定");
    } catch (e) {
      useApp.getState().toast(e instanceof Error ? e.message : "完善失败");
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  };

  const runField = async (key: string, charId?: string, instruction?: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy({ kind: "field", key, charId });
    try {
      const snapshot = useApp.getState().chats.find((c) => c.id === chat.id) ?? chat;
      const text = await polishField(snapshot, grok, key, instruction, charId, (t) => {
        if (key !== "persona") return;
        const ch = snapshot.characters.find((c) => c.id === charId);
        if (!ch?.personaVoices) return;
        useApp.getState().patchChat(chat.id, (c) => ({
          ...applyRoleField(c, key, t, charId),
          updatedAt: Date.now(),
        }));
      });
      useApp.getState().patchChat(chat.id, (c) => ({
        ...applyRoleField(c, key, text, charId),
        updatedAt: Date.now(),
      }));
      useApp.getState().toast(`已更新${FIELD_LABELS[key] || key}`);
    } catch (e) {
      useApp.getState().toast(e instanceof Error ? e.message : "生成失败");
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  };

  const openPersonalize = (key: string, charId?: string) => {
    if (locked) return;
    useApp.getState().setUI({ fieldEdit: { key, charId, text: "" } });
  };

  useEffect(() => {
    if (!autoPolish || mode !== "create") return;
    useApp.getState().setUI({ autoPolish: false });
    void runPolish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPolish]);

  useEffect(() => {
    if (!polishJob || polishJob.chatId !== chat.id) return;
    useApp.getState().setUI({ polishJob: null });
    if (polishJob.kind === "field" && polishJob.key) {
      void runField(polishJob.key, polishJob.charId, polishJob.instruction);
    } else {
      void runPolish(polishJob.instruction, "personalize");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polishJob]);

  const startChat = async () => {
    const name = chat.characters.map((c) => c.name).filter(Boolean).join("、") || chat.name || "未命名";
    useApp.getState().patchChat(chat.id, (c) => ({
      ...c,
      name,
      isDraft: false,
      imageParams: syncCharsFromRole(c.imageParams, c.characters, c.isMulti),
    }));
    useApp.getState().commitChat(chat.id);
    if (mode === "create") {
      const { sendOpening } = await import("./chat-actions");
      void sendOpening(chat.id);
    } else {
      useApp.getState().toast("设定已保存");
    }
  };

  const nameBlock = char ? (
    <FieldBlock
      label="名字"
      hint="可空，让 Grok 起"
      value={char.name}
      placeholder={PLACEHOLDERS.name}
      single
      busy={busy?.kind === "field" && busy.key === "name" && busy.charId === char.id}
      locked={locked}
      onChange={(v) =>
        patch({ characters: chat.characters.map((c) => (c.id === char.id ? { ...c, name: v } : c)) })
      }
      onRegen={() => runField("name", char.id)}
      onPersonal={() => openPersonalize("name", char.id)}
    />
  ) : null;

  const overviewBlock = (
    <FieldBlock
      label="要求总览"
      hint="可空。写了就是最高优先。例如：回复尽量详尽生动，不要简略。"
      value={chat.overview}
      placeholder={PLACEHOLDERS.overview}
      busy={busy?.kind === "field" && busy.key === "overview"}
      locked={locked}
      onChange={(v) => patch({ overview: v })}
      onRegen={() => runField("overview")}
      onPersonal={() => openPersonalize("overview")}
    />
  );

  return (
    <div className="h-full overflow-y-auto px-4 pb-56 pt-3 scroll-thin">
      <div className="mb-1 text-[11px] tracking-[0.14em] text-muted">{mode === "create" ? "NEW ROLE" : "EDIT ROLE"}</div>
      <h1 className="mb-1 text-[20px] font-semibold">
        {mode === "create" ? "写下她，再交给 Grok 补全" : "修改设定"}
      </h1>
      {mode === "edit" && (
        <p className="mb-4 text-[12px] text-muted">保存后立刻对之后的对话生效。取消则不改动。</p>
      )}

      <div className="mb-3 flex items-end gap-2">
        <button
          className="inline-flex shrink-0 flex-col items-center gap-0.5 px-1 pb-1.5 text-[10px] text-muted"
          onClick={() => useApp.getState().setUI({ saveCardOpen: true })}
        >
          <Download className="size-3.5" />
          保存为角色卡
        </button>
        <div className="min-w-0 flex-1">
          <CardSelect
            onPick={(id) => {
              const card = cards.find((c) => c.id === id);
              if (card) useApp.getState().applyCard(chat.id, card, chat.isMulti ? charSel : undefined);
            }}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-[14px]">
        <label className="flex items-center gap-2">
          <span
            className={`grid size-5 place-items-center rounded-full border ${chat.isMulti ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-card"}`}
          >
            {chat.isMulti && <span className="text-[11px] leading-none">✓</span>}
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={chat.isMulti}
            onChange={(e) => {
              const on = e.target.checked;
              const characters = on
                ? chat.characters.length >= 2
                  ? chat.characters
                  : [...chat.characters, emptyCharacter(2)]
                : [chat.characters[0] ?? emptyCharacter(1)];
              setCharSel(0);
              syncChars(characters, on);
            }}
          />
          多人
        </label>
        {chat.isMulti && (
          <span className="ml-auto inline-flex items-center gap-1 text-[13px] text-muted">
            人数
            <span className="inline-flex items-center rounded-full border border-line bg-card">
              <button
                type="button"
                className="px-2 py-1"
                onClick={() => {
                  const characters = [...chat.characters, emptyCharacter(chat.characters.length + 1)];
                  syncChars(characters, true);
                }}
              >
                <ChevronUp className="size-3.5" />
              </button>
              <span className="px-2 text-ink">{chat.characters.length}</span>
              <button
                type="button"
                className="px-2 py-1"
                disabled={chat.characters.length <= 2}
                onClick={() => {
                  const characters = chat.characters.slice(0, -1);
                  setCharSel(0);
                  syncChars(characters, true);
                }}
              >
                <ChevronDown className="size-3.5" />
              </button>
            </span>
          </span>
        )}
      </div>

      <Card className="mb-3">
        <FieldLabel>AI 版本</FieldLabel>
        <ChatModelSelect align="left" className="w-full rounded-full border border-line bg-card" />
      </Card>

      {!chat.isMulti && nameBlock}
      {overviewBlock}

      {chat.isMulti && (
        <Card className="mb-3">
          <FieldLabel>角色选择</FieldLabel>
          <ExpandSelect
            value={String(charSel)}
            options={chat.characters.map((c, i) => ({
              id: String(i),
              label: `角色${i + 1}${c.name ? ":" + c.name : ""}`,
            }))}
            onChange={(id) => setCharSel(Number(id))}
            align="left"
          />
        </Card>
      )}

      {char && (
        <div className={chat.isMulti ? "rounded-[22px] border border-line/80 bg-card/50 p-1" : ""}>
          {chat.isMulti && nameBlock}
          <FieldBlock
            label="人设"
            hint="她是谁：性格、职业或身份、口头禅、和我的关系……外貌请写在下面那栏。"
            value={char.persona}
            placeholder={PLACEHOLDERS.persona}
            busy={busy?.kind === "field" && busy.key === "persona" && busy.charId === char.id}
            locked={locked}
            grow={Boolean(char.personaVoices)}
            titleExtra={
              <button
                type="button"
                className={`rounded-full border px-2 py-0.5 text-[11px] leading-none transition ${
                  char.personaVoices
                    ? "border-primary bg-primary text-on-primary"
                    : "border-primary bg-transparent text-primary"
                }`}
                disabled={locked}
                onClick={() =>
                  patch({
                    characters: chat.characters.map((c) =>
                      c.id === char.id ? { ...c, personaVoices: !c.personaVoices } : c,
                    ),
                  })
                }
              >
                声部
              </button>
            }
            onChange={(v) =>
              patch({ characters: chat.characters.map((c) => (c.id === char.id ? { ...c, persona: v } : c)) })
            }
            onRegen={() => runField("persona", char.id)}
            onPersonal={() => openPersonalize("persona", char.id)}
          />
          <FieldBlock
            label="说话方式"
            hint="语气、口癖、人称、句子长短。例如：软软的、会把「……」拖长。"
            value={char.speech}
            placeholder={PLACEHOLDERS.speech}
            busy={busy?.kind === "field" && busy.key === "speech" && busy.charId === char.id}
            locked={locked}
            onChange={(v) =>
              patch({ characters: chat.characters.map((c) => (c.id === char.id ? { ...c, speech: v } : c)) })
            }
            onRegen={() => runField("speech", char.id)}
            onPersonal={() => openPersonalize("speech", char.id)}
          />
          <FieldBlock
            label="外貌备忘"
            hint="用生图提示词书写。发型发色瞳色体型固定服装写这里。其他栏不用再写外貌。"
            value={char.appearance}
            placeholder={PLACEHOLDERS.appearance}
            busy={busy?.kind === "field" && busy.key === "appearance" && busy.charId === char.id}
            locked={locked}
            onChange={(v) =>
              patch({ characters: chat.characters.map((c) => (c.id === char.id ? { ...c, appearance: v } : c)) })
            }
            onRegen={() => runField("appearance", char.id)}
            onPersonal={() => openPersonalize("appearance", char.id)}
          />
        </div>
      )}

      <FieldBlock
        label="开场场景"
        hint="现在在哪里、在做什么、气氛如何。"
        value={chat.opening}
        placeholder={PLACEHOLDERS.opening}
        busy={busy?.kind === "field" && busy.key === "opening"}
        locked={locked}
        onChange={(v) => patch({ opening: v })}
        onRegen={() => runField("opening")}
        onPersonal={() => openPersonalize("opening")}
      />

      <Card className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium">状态栏</div>
            <div className="mt-0.5 text-[11px] text-muted">
              关掉就折叠。打开后，每句回复末尾都会更新这份状态。开启内容按固定骨架，可改冒号后的描述。
            </div>
          </div>
          <Switch
            on={chat.statusBarOn}
            onChange={(v) =>
              patch({
                statusBarOn: v,
                statusBar: chat.statusBar?.trim() ? chat.statusBar : DEFAULT_STATUS_BAR,
              })
            }
          />
        </div>
        {chat.statusBarOn && (
          <TextArea
            className="min-h-[200px] font-mono text-[12px]"
            value={chat.statusBar}
            onChange={(e) => patch({ statusBar: e.target.value })}
          />
        )}
      </Card>

      <Extras extras={chat.extras} onChange={(extras) => patch({ extras })} />

      {mode === "edit" && (
        <Card className="mb-3">
          <FieldLabel
            sub={
              <span className="flex items-center gap-1.5 text-[11px] text-muted">
                <span>
                  （已对话 <span className="text-good">{memTurns.spoken}</span> 轮，已总结到第{" "}
                  <span className="text-good">{memTurns.folded}</span> 轮）
                </span>
                {memOk ? <Check className="size-3.5 text-good" /> : <X className="size-3.5 text-danger" />}
              </span>
            }
            hint="聊久了会把更早的剧情压成备忘，下一轮当事实用。聊天里看不见。可改、可重总结、可清空。"
          >
            长期记忆
          </FieldLabel>
          <TextArea
            className="min-h-[120px]"
            value={memoryShown}
            placeholder={memStreaming ? "正在总结…" : "还没有长期记忆。对话变长后会自动整理。"}
            onChange={(e) => {
              if (memStreaming) return;
              const text = e.target.value;
              const snaps = chat.memorySnaps ?? [];
              const last = snaps[snaps.length - 1];
              patch({
                memory: text,
                memorySnaps: last
                  ? [...snaps.slice(0, -1), { ...last, text }]
                  : text
                    ? [{ covered: chat.memoryUntil || 0, text, foldAt: chat.memoryFoldAt || 0 }]
                    : [],
              });
            }}
          />
          <div className="mt-2 flex gap-2">
            <GhostBtn
              className="h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]"
              onClick={() => useApp.getState().toast("已保存")}
            >
              保存
            </GhostBtn>
            <GhostBtn
              className="h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]"
              onClick={() => {
                if (locked) return;
                if (!memReady) {
                  useApp.getState().toast("还不够长，先多聊几轮");
                  return;
                }
                setMemPick(true);
              }}
            >
              {busy?.kind === "mem" ? "总结中…" : "重新总结"}
            </GhostBtn>
            <GhostBtn
              className="h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]"
              onClick={() => {
                invalidateMemory(chat.id);
                patch(emptyMemory());
              }}
            >
              清空
            </GhostBtn>
          </div>
        </Card>
      )}

      <Modal open={memPick} onClose={() => setMemPick(false)} title="重新总结">
        <p className="mb-4 text-[13px] leading-5 text-muted">
          {memOk ? "记忆已经齐了。总结到当前只重压最近那一截。" : "记忆还落后。总结到当前会从缺口一次收到位。"}
        </p>
        <div className="flex flex-col gap-2">
          <PrimaryBtn
            disabled={locked || !memReady}
            busy={busy?.kind === "mem"}
            onClick={async () => {
              if (locked) return;
              setMemPick(false);
              setBusy({ kind: "mem" });
              const ok = await runManualMemory(chat.id, "current");
              if (ok) useApp.getState().toast("已总结到当前");
              setBusy(null);
            }}
          >
            总结到当前
          </PrimaryBtn>
          <GhostBtn
            className="h-11"
            disabled={locked || !memReady}
            onClick={async () => {
              if (locked) return;
              setMemPick(false);
              setBusy({ kind: "mem" });
              const ok = await runManualMemory(chat.id, "all");
              if (ok) useApp.getState().toast("已全部重新总结");
              setBusy(null);
            }}
          >
            全部重新总结
          </GhostBtn>
        </div>
      </Modal>

      <div className="pointer-events-none h-4" />
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4">
        {mode === "create" && !polished && (
          <>
            <PrimaryBtn
              busy={busy?.kind === "all" || busy?.kind === "field"}
              disabled={locked && busy?.kind !== "all" && busy?.kind !== "field"}
              onClick={() => {
                if (locked) return;
                void runPolish();
              }}
            >
              {busy?.kind === "field" ? (
                `完善中(${fieldBusyLabel})`
              ) : busy?.kind === "all" ? (
                "完善中"
              ) : (
                <>
                  <Sparkles className="size-4" /> 让 Grok 完善设定
                </>
              )}
            </PrimaryBtn>
            <GhostBtn className="mt-2" disabled={locked} onClick={() => void startChat()}>
              跳过，开始聊天
            </GhostBtn>
          </>
        )}
        {mode === "create" && polished && (
          <>
            <PrimaryBtn
              busy={busy?.kind === "field"}
              disabled={locked}
              onClick={() => {
                if (locked) return;
                void startChat();
              }}
            >
              {busy?.kind === "field" ? `完善中(${fieldBusyLabel})` : "可以了，开始聊天"}
            </PrimaryBtn>
            <GhostBtn className="mt-2" disabled={locked && busy?.kind !== "all"} onClick={() => void runPolish()}>
              {busy?.kind === "all" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> 完善中
                </>
              ) : (
                "让 Grok 完善设定"
              )}
            </GhostBtn>
            <GhostBtn className="mt-2" disabled={locked && busy?.kind !== "personalize"} onClick={() => openPersonalize("all")}>
              {busy?.kind === "personalize" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> 完善中
                </>
              ) : (
                "让 Grok 个性化修改"
              )}
            </GhostBtn>
          </>
        )}
        {mode === "edit" && (
          <>
            <PrimaryBtn
              busy={busy?.kind === "field"}
              disabled={locked}
              onClick={() => {
                if (locked) return;
                void startChat();
              }}
            >
              {busy?.kind === "field" ? `完善中(${fieldBusyLabel})` : "确认保存"}
            </PrimaryBtn>
            <GhostBtn className="mt-2" disabled={locked && busy?.kind !== "all"} onClick={() => void runPolish()}>
              {busy?.kind === "all" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> 完善中
                </>
              ) : (
                "让 Grok 完善设定"
              )}
            </GhostBtn>
            <GhostBtn className="mt-2" disabled={locked && busy?.kind !== "personalize"} onClick={() => openPersonalize("all")}>
              {busy?.kind === "personalize" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> 完善中
                </>
              ) : (
                "让 Grok 个性化修改"
              )}
            </GhostBtn>
            <button
              className="mt-2 w-full py-2 text-[13px] text-muted"
              onClick={() => useApp.getState().cancelEdit()}
            >
              取消
            </button>
          </>
        )}
        {mode === "create" && (
          <button
            className="mt-2 w-full py-2 text-[13px] text-muted"
            onClick={() => useApp.getState().cancelDraft()}
          >
            取消
          </button>
        )}
      </div>
    </div>
  );
}

function FieldBlock({
  label,
  hint,
  value,
  placeholder,
  onChange,
  onRegen,
  onPersonal,
  busy,
  locked,
  single,
  titleExtra,
  grow,
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onRegen: () => void;
  onPersonal: () => void;
  busy?: boolean;
  locked?: boolean;
  single?: boolean;
  titleExtra?: ReactNode;
  grow?: boolean;
}) {
  return (
    <Card className="mb-3">
      <FieldLabel
        hint={hint}
        right={
          <span className="flex gap-1">
            <button
              className="grid size-8 place-items-center rounded-full hover:bg-dim disabled:opacity-40"
              onClick={onRegen}
              disabled={locked}
              title="重新生成"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4 text-muted" />}
            </button>
            <button
              className="grid size-8 place-items-center rounded-full hover:bg-dim disabled:opacity-40"
              onClick={onPersonal}
              disabled={locked}
              title="个性化"
            >
              <Sparkles className="size-4 text-muted" />
            </button>
          </span>
        }
      >
        <span className="inline-flex items-center gap-1.5">
          {label}
          {titleExtra}
        </span>
      </FieldLabel>
      {single ? (
        <TextInput value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <TextArea
          value={value}
          placeholder={placeholder}
          rows={grow ? 12 : 5}
          className={grow ? "min-h-[calc(1.5rem+12*1.625em)]" : "min-h-[calc(1.5rem+5*1.625em)]"}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Card>
  );
}

function Extras({ extras, onChange }: { extras: ExtraField[]; onChange: (e: ExtraField[]) => void }) {
  return (
    <div className="mb-3">
      {extras.map((e, i) => (
        <Card key={e.id} className="mb-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="text-[13px] font-medium">新增{i + 1}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`rounded-full border px-2 py-0.5 text-[11px] leading-none transition ${
                  e.applyImage
                    ? "border-primary bg-primary text-on-primary"
                    : "border-primary bg-transparent text-primary"
                }`}
                onClick={() =>
                  onChange(extras.map((x) => (x.id === e.id ? { ...x, applyImage: !x.applyImage } : x)))
                }
              >
                应用到生图
              </button>
              <button className="text-danger" onClick={() => onChange(extras.filter((x) => x.id !== e.id))}>
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <TextArea
            value={e.body}
            onChange={(ev) => onChange(extras.map((x) => (x.id === e.id ? { ...x, body: ev.target.value } : x)))}
          />
        </Card>
      ))}
      <button
        className="flex items-center gap-1 px-2 py-2 text-[13px] text-primary"
        onClick={() => onChange([...extras, { id: uid("ex_"), body: "" }])}
      >
        <Plus className="size-4" /> 新增
      </button>
    </div>
  );
}

function CardSelect({ onPick }: { onPick: (id: string) => void }) {
  const cards = useApp((s) => s.cards);
  const ordered = cards.slice().sort((a, b) => a.order - b.order);
  return (
    <LibraryDrawer
      className="flex-1"
      label="角色卡选择"
      items={ordered.map((c) => ({ id: c.id, name: c.name }))}
      onApply={onPick}
      onDelete={(id) => useApp.getState().deleteCard(id)}
      onReorder={(ids) => useApp.getState().reorderCards(ids)}
    />
  );
}
