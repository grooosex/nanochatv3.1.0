import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Folder as FolderIcon, Lock, Plus, Star, Trash2 } from "lucide-react";
import {
  joinPromptParts,
  NAI_MODELS,
  NOISE_SCHEDULES,
  RESOLUTIONS,
  SAMPLERS,
  UC,
} from "@/lib/constants";
import { applyBackFlags, applyFrontFlags, applyMergedFlags } from "@/lib/prompt-flags";
import { listedChats, useApp } from "@/lib/store";
import { insertTag, loadTags, suggestTags, type Tag } from "@/lib/tags";
import { naiFamily } from "@/lib/nai";
import { replyStoryText } from "@/lib/reply-markup";
import {
  FOLLOW_IMAGE_AI,
  applyImageAiPick,
  imageAiLabel,
  imagePickerModels,
} from "@/lib/image-ai";
import type { AppearancePreset, Chat, CharacterPrompt, ImageParams, NaiModelId, NoiseSchedule, SamplerId, UcPreset } from "@/lib/types";
import { cn, randomSeed, uid } from "@/lib/utils";
import { LibraryDrawer } from "./LibraryDrawer";
import { Card, ChatAvatar, ExpandSelect, Slider, Switch, TextArea } from "./ui-kit";

function scrollJump(jump: string) {
  const el = document.querySelector(`[data-section="${jump}"]`) as HTMLElement | null;
  if (!el) return false;
  let pane: HTMLElement | null = el.parentElement;
  let fallback: HTMLElement | null = null;
  while (pane) {
    const s = getComputedStyle(pane);
    if (/(auto|scroll)/.test(s.overflowY)) {
      if (!fallback) fallback = pane;
      if (pane.scrollHeight > pane.clientHeight + 4) break;
    }
    pane = pane.parentElement;
  }
  if (!pane || !/(auto|scroll)/.test(getComputedStyle(pane).overflowY)) pane = fallback;
  if (!pane) return false;
  const top = el.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop;
  pane.scrollTo({ top: Math.max(0, top - 6), behavior: "smooth" });
  if (jump === "seed") {
    const input = el.querySelector("[data-seed-input], input") as HTMLInputElement | null;
    if (input && !input.disabled) {
      input.focus();
      input.select();
    }
  }
  return true;
}

export function ParamsPane({ chat, mode = "chat" }: { chat: Chat; mode?: "chat" | "pure" }) {
  const live = chat.imageParams;
  const [peek, setPeek] = useState<ImageParams | null>(null);
  const p = peek
    ? { ...peek, characters: live.characters, useCoords: live.useCoords }
    : live;
  const commit = (partial: Partial<ImageParams>) => {
    if (mode === "pure") useApp.getState().setPureParams(partial);
    else useApp.getState().patchParams(chat.id, partial);
  };
  const patch = (partial: Partial<ImageParams>) => {
    if (peek) {
      const { characters, useCoords, ...rest } = partial;
      if (characters !== undefined || useCoords !== undefined) {
        commit({
          ...(characters !== undefined ? { characters } : {}),
          ...(useCoords !== undefined ? { useCoords } : {}),
        });
      }
      if (Object.keys(rest).length) setPeek((prev) => (prev ? { ...prev, ...rest } : prev));
      return;
    }
    commit(partial);
  };
  const family = naiFamily(p.model);
  const v3 = family === "v3";
  const hideSplit = mode === "pure" && p.merged;
  const jump = useApp((s) => s.ui.paramsJump);
  const previewOpen = useApp((s) => s.ui.previewParams);
  const previewRef = useRef<HTMLDivElement>(null);
  const chatId = chat.id;

  const pickAppearance = (target: "mid" | string, a: AppearancePreset) => {
    if (peek && target === "mid") {
      patch({ promptMid: a.prompt });
      return;
    }
    useApp.getState().applyAppearance(chat.id, a, target);
  };

  const setFlags = (next: { sensitive?: boolean; uncensored?: boolean; fullBody?: boolean }) => {
    const sensitive = next.sensitive ?? p.sensitive;
    const uncensored = next.uncensored ?? p.uncensored;
    const fullBody = next.fullBody ?? p.fullBody;
    if (p.merged) {
      patch({
        sensitive,
        uncensored,
        fullBody,
        promptMid: applyMergedFlags(p.promptMid, { sensitive, uncensored, fullBody }),
      });
      return;
    }
    patch({
      sensitive,
      uncensored,
      fullBody,
      promptFront: applyFrontFlags(p.promptFront, uncensored, fullBody),
      promptBack: applyBackFlags(p.promptBack, sensitive),
    });
  };

  useEffect(() => {
    if (!jump) return;
    let n = 0;
    let timer = 0;
    const run = () => {
      if (scrollJump(jump)) {
        useApp.getState().setUI({ paramsJump: null });
        return;
      }
      if (++n < 24) timer = window.setTimeout(run, 40);
      else useApp.getState().setUI({ paramsJump: null });
    };
    timer = window.setTimeout(run, 40);
    return () => window.clearTimeout(timer);
  }, [jump]);

  useEffect(() => {
    if (!previewOpen) {
      setPeek(null);
      return;
    }
    const fn = (e: PointerEvent) => {
      if (!previewRef.current?.contains(e.target as Node)) {
        useApp.getState().setUI({ previewParams: false });
        setPeek(null);
      }
    };
    document.addEventListener("pointerdown", fn);
    return () => document.removeEventListener("pointerdown", fn);
  }, [previewOpen]);

  const resId = `${p.width}x${p.height}`;

  return (
    <div className={mode === "pure" ? "mx-auto max-w-lg px-4 pb-10 pt-1" : "mx-auto h-full max-w-lg overflow-y-auto px-4 pb-24 pt-3 scroll-thin"}>
      {mode === "chat" && (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mt-1 text-[11px] tracking-[0.16em] text-muted">CHAT IMAGE</div>
              <h1 className="font-serif text-2xl">聊天配图参数</h1>
            </div>
            <ImageAiPicker />
          </div>
          <div className="mb-3 mt-1 text-[12px] text-muted">
            {chat.isDraft
              ? "正在给这个新角色配图。改完可以切回「聊天」继续写人设，开始后她会先开口。"
              : "只作用于当前角色。改这里不会动到纯生图。"}
          </div>
          <div className="relative mb-4" data-preview-params ref={previewRef}>
            <button
              className="flex h-12 w-full items-center justify-between rounded-full border border-line bg-card px-4"
              onClick={() => {
                const next = !useApp.getState().ui.previewParams;
                useApp.getState().setUI({ previewParams: next });
                if (!next) setPeek(null);
              }}
            >
              <span className="truncate text-[14px]">{chat.name || "当前角色"}</span>
              <span className="shrink-0 text-[12px] text-muted">预览角色参数</span>
            </button>
            <PreviewParamsDrawer
              currentId={chatId}
              onPeek={(id) => {
                if (id === chatId) {
                  setPeek(null);
                  return;
                }
                const src = useApp.getState().chats.find((c) => c.id === id);
                if (!src) return;
                setPeek(structuredClone(src.imageParams));
              }}
              onApply={(id) => {
                const src = useApp.getState().chats.find((c) => c.id === id);
                if (!src) return;
                const { characters: _c, useCoords: _u, ...rest } = structuredClone(src.imageParams);
                useApp.getState().patchParams(chatId, rest);
                setPeek(null);
                useApp.getState().setUI({ previewParams: false });
                useApp.getState().toast("已套用参数");
              }}
            />
          </div>
        </>
      )}

      <div className="mb-2 flex gap-1.5">
        {(
          [
            ["成人", p.sensitive, () => setFlags({ sensitive: !p.sensitive })],
            ["无码", p.uncensored, () => setFlags({ uncensored: !p.uncensored })],
            ["全身", p.fullBody, () => setFlags({ fullBody: !p.fullBody })],
            ["补全", p.tagSuggest, () => patch({ tagSuggest: !p.tagSuggest })],
          ] as [string, boolean, () => void][]
        ).map(([label, on, fn]) => (
          <button
            key={label}
            type="button"
            className={`h-7 flex-1 rounded-full text-[12px] ${on ? "bg-primary text-on-primary" : "bg-dim text-ink"}`}
            onClick={fn}
          >
            {label}
          </button>
        ))}
      </div>

      {!hideSplit ? (
        <>
          <div className="mb-1 mt-3 text-[13px] font-medium">正面提示词.前</div>
          <PromptBox value={p.promptFront} suggest={p.tagSuggest} minH={120} onChange={(v) => patch({ promptFront: v })} />

          <div className="mb-1 mt-3 flex items-end gap-2">
            <div className="shrink-0 pb-1.5 text-[13px] font-medium">正面提示词.中</div>
            <button
              type="button"
              className="inline-flex shrink-0 flex-col items-center gap-0.5 px-1 pb-1 text-[10px] text-muted"
              onClick={() => useApp.getState().setUI({ saveAppearOpen: true, appearTarget: "mid" })}
            >
              <Download className="size-4" />
              保存角色
            </button>
            <AppearSelect className="min-w-0 flex-1" onPick={(a) => pickAppearance("mid", a)} />
          </div>
          <PromptBox value={p.promptMid} suggest={p.tagSuggest} minH={208} onChange={(v) => patch({ promptMid: v })} />

          <div className="mb-1 mt-3 text-[13px] font-medium">正面提示词.后</div>
          <PromptBox value={p.promptBack} suggest={p.tagSuggest} minH={120} onChange={(v) => patch({ promptBack: v })} />

          {mode === "pure" && (
            <button
              type="button"
              className="mb-2 mt-3 inline-flex h-7 items-center rounded-full border border-line px-3 text-[11px] text-muted"
              onClick={() =>
                patch({
                  merged: true,
                  promptMid: joinPromptParts(p.promptFront, p.promptMid, p.promptBack),
                  promptFront: "",
                  promptBack: "",
                })
              }
            >
              合并成一个提示词
            </button>
          )}
        </>
      ) : (
        <div className="mt-3">
          <button
            type="button"
            aria-pressed
            className="mb-2 inline-flex h-7 items-center rounded-full border border-primary bg-primary px-3 text-[11px] font-medium text-on-primary"
            onClick={() => patch({ merged: false, promptFront: "", promptBack: "" })}
          >
            合并成一个提示词
          </button>
          <PromptBox value={p.promptMid} suggest={p.tagSuggest} minH={208} onChange={(v) => patch({ promptMid: v })} />
        </div>
      )}

      <div className="mt-4 text-[15px] font-medium">负面提示词</div>
      <div className="mb-2 mt-1 flex gap-1.5">
        {(["heavy", "light", "human", "custom"] as UcPreset[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`h-8 rounded-full px-3 text-[13px] ${
              p.ucPreset === id ? "bg-primary text-on-primary" : "bg-dim text-ink"
            }`}
            onClick={() => {
              if (id === "custom") patch({ ucPreset: id });
              else patch({ ucPreset: id, negative: UC[id] });
            }}
          >
            {id === "heavy" ? "重" : id === "light" ? "轻" : id === "human" ? "人形" : "自定义"}
          </button>
        ))}
      </div>
      <PromptBox value={p.negative} suggest={p.tagSuggest} minH={88} onChange={(v) => patch({ negative: v, ucPreset: "custom" })} />

      <div className="mb-3 mt-4 flex items-center justify-between" data-section="model">
        <div className="text-[13px] font-medium">模型</div>
        <ExpandSelect
          value={p.model}
          options={NAI_MODELS.map((m) => ({ id: m.id, label: m.label, short: m.label.replace("NAI ", "") }))}
          onChange={(id) => patch({ model: id as NaiModelId })}
          align="left"
          menu="end"
        />
      </div>
      <div className="mb-3 flex items-center justify-between" data-section="size">
        <div className="text-[13px] font-medium">分辨率</div>
        <ExpandSelect
          value={resId}
          options={RESOLUTIONS.map((r) => ({ id: `${r.w}x${r.h}`, label: `${r.label}  ${r.w}×${r.h}`, short: `${r.w} × ${r.h}` }))}
          onChange={(id) => {
            const [w, h] = id.split("x").map(Number);
            patch({ width: w, height: h });
          }}
          align="left"
          menu="end"
        />
      </div>
      <div className="mb-3 flex items-center gap-2" data-section="sampler">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <div className="shrink-0 text-[13px] font-medium">采样器</div>
          <ExpandSelect
            value={p.sampler}
            options={SAMPLERS.map((s) => ({ id: s.id, label: s.label }))}
            onChange={(id) => patch({ sampler: id as SamplerId })}
            menu="end"
          />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <div className="shrink-0 text-[13px] font-medium">噪声表</div>
          <ExpandSelect
            value={p.noiseSchedule}
            options={NOISE_SCHEDULES.map((s) => ({ id: s.id, label: s.label }))}
            onChange={(id) => patch({ noiseSchedule: id as NoiseSchedule })}
            menu="end"
          />
        </div>
      </div>

      <div data-section="steps">
        <LabeledSlider
          label="步数"
          value={p.steps}
          min={1}
          max={50}
          locked={p.stepsLocked}
          onLock={(v) => patch({ stepsLocked: v })}
          onChange={(n) => patch({ steps: n })}
        />
      </div>
      <LabeledSlider
        label="提示词引导"
        value={p.scale}
        min={0}
        max={10}
        step={0.1}
        locked={p.scaleLocked}
        onLock={(v) => patch({ scaleLocked: v })}
        onChange={(n) => patch({ scale: n })}
      />
      <LabeledSlider
        label="CFG rescale"
        value={p.cfgRescale}
        min={0}
        max={1}
        step={0.01}
        locked={p.cfgRescaleLocked}
        onLock={(v) => patch({ cfgRescaleLocked: v })}
        onChange={(n) => patch({ cfgRescale: n })}
      />

      <div className="mb-3 flex items-center gap-2" data-section="seed">
        <div className="shrink-0 text-[13px] font-medium">种子</div>
        <input
          type="text"
          inputMode="numeric"
          data-seed-input
          value={p.seed ?? ""}
          placeholder="随机"
          disabled={p.seedLocked}
          onChange={(e) => {
            const t = e.target.value.trim();
            patch({ seed: t === "" ? null : Number(t) || 0 });
          }}
          className="h-9 min-w-0 flex-1 rounded-full border border-line bg-card px-3 text-[13px] outline-none disabled:opacity-40"
        />
        <button
          type="button"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line"
          onClick={() => patch({ seed: randomSeed() })}
          aria-label="随机种子"
        >
          ↻
        </button>
        <button
          type="button"
          className={`grid size-9 shrink-0 place-items-center rounded-full ${p.seedLocked ? "text-primary" : "text-muted"}`}
          onClick={() => patch({ seedLocked: !p.seedLocked })}
          aria-label="锁定种子"
        >
          <Lock className="size-4" />
        </button>
      </div>

      <RowSwitch label="Variety+" hint="动态跳过 CFG，增加构图变化" on={p.varietyPlus} onChange={(v) => patch({ varietyPlus: v })} />
      <RowSwitch label="Decrisper" hint="减轻过饱和" on={p.decrisper} onChange={(v) => patch({ decrisper: v })} />

      {!v3 && (
        <div className="mb-8 mt-4" data-section="chars">
          <div className="text-[15px] font-medium">角色提示词 (V4 / V5)</div>
          <div className="mb-2 text-[11px] text-muted">每个角色独立提示。AI 决定位置时忽略坐标。</div>
          <div className="mb-3 flex rounded-full bg-dim p-1 text-[13px]">
            <button
              type="button"
              className={`flex-1 rounded-full py-2 ${!p.useCoords ? "bg-card" : ""}`}
              onClick={() => patch({ useCoords: false })}
            >
              AI 决定位置
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full py-2 ${p.useCoords ? "bg-card" : ""}`}
              onClick={() => patch({ useCoords: true })}
            >
              自定义位置
            </button>
          </div>
          {p.characters.map((ch, i) => {
            const role = chat.characters.find((c) => c.id === ch.id) ?? chat.characters[i];
            return (
            <CharCard
              key={ch.id}
              ch={ch}
              index={i}
              name={(role?.name || ch.name || "").trim()}
              suggest={p.tagSuggest}
              useCoords={p.useCoords}
              onChange={(next) => patch({ characters: p.characters.map((x) => (x.id === ch.id ? next : x)) })}
              onPick={(a) => pickAppearance(ch.id, a)}
              onApplyLook={
                mode === "chat"
                  ? () => {
                      const role = chat.characters.find((c) => c.id === ch.id) ?? chat.characters[i];
                      if (!role) {
                        useApp.getState().toast("没有对应人设");
                        return;
                      }
                      useApp.getState().patchChat(chat.id, (c) => ({
                        ...c,
                        characters: c.characters.map((x) => (x.id === role.id ? { ...x, appearance: ch.prompt } : x)),
                      }));
                      useApp.getState().toast("已写入外貌备忘");
                    }
                  : undefined
              }
              onRemove={() =>
                useApp.getState().setUI({
                  confirm: {
                    title: "删除角色",
                    body: `删除「${ch.name || `角色${i + 1}`}」的提示词栏？`,
                    danger: true,
                    onOk: () => patch({ characters: p.characters.filter((x) => x.id !== ch.id) }),
                  },
                })
              }
            />
            );
          })}
          <button
            type="button"
            className="mt-1 flex items-center gap-1 px-2 py-2 text-[13px] text-primary"
            onClick={() =>
              patch({
                characters: [
                  ...p.characters,
                  {
                    id: uid("c_"),
                    name: `角色${p.characters.length + 1}`,
                    enabled: true,
                    prompt: "",
                    uc: "",
                    x: 0.5,
                    y: 0.5,
                  } satisfies CharacterPrompt,
                ],
              })
            }
          >
            <Plus className="size-4" /> 添加角色
          </button>
        </div>
      )}
    </div>
  );
}

function CharCard({
  ch,
  index,
  name,
  suggest,
  useCoords,
  onChange,
  onPick,
  onApplyLook,
  onRemove,
}: {
  ch: CharacterPrompt;
  index: number;
  name: string;
  suggest: boolean;
  useCoords: boolean;
  onChange: (c: CharacterPrompt) => void;
  onPick: (a: AppearancePreset) => void;
  onApplyLook?: () => void;
  onRemove?: () => void;
}) {
  const title = name ? `角色${index + 1}:${name}` : `角色${index + 1}`;
  return (
    <Card className="mb-3 overflow-visible">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold">{title}</div>
        <div className="flex shrink-0 items-center gap-1">
          {onRemove && (
            <button type="button" className="grid size-8 place-items-center text-danger" onClick={onRemove} aria-label="删除角色">
              <Trash2 className="size-4" />
            </button>
          )}
          <Switch on={ch.enabled} onChange={(v) => onChange({ ...ch, enabled: v })} />
        </div>
      </div>
      <div className="mb-2 flex items-end gap-2">
        <AppearSelect className="min-w-0 flex-1" onPick={onPick} />
        {onApplyLook && (
          <button
            type="button"
            className="mb-0 h-9 shrink-0 rounded-full border border-line px-3 text-[13px] text-primary"
            onClick={onApplyLook}
          >
            应用
          </button>
        )}
      </div>
      <div className="mb-1 text-[12px] text-muted">正面提示词</div>
      <PromptBox value={ch.prompt} suggest={suggest} minH={88} onChange={(v) => onChange({ ...ch, prompt: v })} />
      <div className="mb-1 mt-2 text-[12px] text-muted">角色负面 UC</div>
      <PromptBox value={ch.uc} suggest={suggest} minH={72} onChange={(v) => onChange({ ...ch, uc: v })} />
      {useCoords && (
        <div className="mt-2 grid grid-cols-2 gap-3">
          <LabeledSlider label="X" value={ch.x} min={0} max={1} step={0.01} onChange={(n) => onChange({ ...ch, x: n })} />
          <LabeledSlider label="Y" value={ch.y} min={0} max={1} step={0.01} onChange={(n) => onChange({ ...ch, y: n })} />
        </div>
      )}
    </Card>
  );
}

function AppearSelect({ className, onPick }: { className?: string; onPick: (a: AppearancePreset) => void }) {
  const appearances = useApp((s) => s.appearances);
  const ordered = appearances.slice().sort((a, b) => a.order - b.order);
  return (
    <LibraryDrawer
      className={className}
      label="角色选择"
      items={ordered.map((a) => ({ id: a.id, name: a.name }))}
      onApply={(id) => {
        const a = useApp.getState().appearances.find((x) => x.id === id);
        if (a) onPick(a);
      }}
      onDelete={(id) => useApp.getState().deleteAppearance(id)}
      onReorder={(ids) => useApp.getState().reorderAppearances(ids)}
    />
  );
}

function ImageAiPicker() {
  const source = useApp((s) => s.settings.chatSource);
  const llmModel = useApp((s) => s.settings.llmModel);
  const starred = useApp((s) => s.settings.llmStarred);
  const available = useApp((s) => s.settings.llmModels);
  const connected = useApp((s) => s.settings.llmConnected);
  const imageModelId = useApp((s) => s.settings.imageModelId);
  const rows = imagePickerModels({
    chatSource: source,
    llmStarred: starred,
    llmModels: available,
    llmModel,
    llmConnected: connected,
    imageModelId,
  });
  const ids = rows.filter((r) => !r.header).map((r) => r.id);
  const value = imageModelId && ids.includes(imageModelId) ? imageModelId : FOLLOW_IMAGE_AI;
  return (
    <div className="shrink-0 pt-1 text-right">
      <div className="text-[11px] tracking-[0.16em] text-muted">配图 AI</div>
      <div className="mt-1 inline-flex rounded-full border border-line bg-card">
        <ExpandSelect
          value={value}
          options={rows.map((r) => ({
            id: r.id,
            label: r.header ?? imageAiLabel(r.id),
            short: r.header ?? imageAiLabel(r.id),
            header: Boolean(r.header),
            danger: r.danger,
          }))}
          onChange={(id) => {
            if (id.startsWith("__hdr_")) return;
            const s = useApp.getState().settings;
            useApp.getState().setSettings(applyImageAiPick(s, id));
          }}
          align="left"
          menu="end"
        />
      </div>
      {imageModelId ? (
        <p className="mt-1 max-w-[11rem] text-[11px] leading-4 text-muted">
          对白用顶栏，提示词用 {imageAiLabel(imageModelId)}
        </p>
      ) : null}
    </div>
  );
}

function chatSnippet(c: Chat) {
  const lastMsg = [...c.messages].reverse().find((m) => m.content);
  const last =
    c.remark ||
    (lastMsg && lastMsg.role !== "user" ? replyStoryText(lastMsg.content) || lastMsg.content : lastMsg?.content) ||
    c.opening;
  return (last || "新的对话").replace(/\s+/g, " ");
}

function PreviewParamsDrawer({
  currentId,
  onPeek,
  onApply,
}: {
  currentId: string;
  onPeek: (id: string) => void;
  onApply: (id: string) => void;
}) {
  const open = useApp((s) => s.ui.previewParams);
  const folders = useApp((s) => s.folders);
  const chats = useApp((s) => s.chats);
  const { foldersSorted, root, inFolder } = listedChats(folders, chats);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [peekId, setPeekId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFolderId(null);
      setPeekId(null);
    }
  }, [open]);

  if (!open) return null;

  const folder = folderId ? foldersSorted.find((f) => f.id === folderId) : undefined;
  const list = folderId ? inFolder(folderId) : root;
  const marked = peekId ?? currentId;

  const peekChat = (c: Chat) => {
    setPeekId(c.id);
    onPeek(c.id);
  };

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]">
      {folder && (
        <button
          type="button"
          className="flex h-10 w-full items-center gap-1 px-3 text-[13px] text-ink"
          onClick={() => setFolderId(null)}
        >
          <ChevronLeft className="size-4 shrink-0" />
          <span className="truncate">{folder.name || "文件夹"}</span>
        </button>
      )}
      <div className="overflow-y-auto scroll-thin overscroll-contain" style={{ maxHeight: "21rem" }}>
        {!folderId &&
          foldersSorted.map((f) => (
            <button
              key={f.id}
              type="button"
              className="flex h-14 w-full items-center gap-3 px-3 text-left"
              onClick={() => setFolderId(f.id)}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-primary">
                <FolderIcon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 truncate text-[14px] font-medium">
                  {f.starred && <Star className="size-3 fill-primary text-primary" />}
                  {f.name || "文件夹"}
                </div>
                <div className="text-[12px] text-muted">{inFolder(f.id).length} 项</div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted" />
            </button>
          ))}
        {list.map((c) => {
          const current = c.id === currentId;
          return (
            <div
              key={c.id}
              className={cn("flex h-14 items-center gap-2 px-3", marked === c.id && "bg-dim")}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => peekChat(c)}
              >
                <ChatAvatar chat={c} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 truncate text-[14px] font-medium">
                    {c.starred && <Star className="size-3 fill-primary text-primary" />}
                    {c.name || "未命名"}
                  </div>
                  <div className="truncate text-[12px] text-muted">{chatSnippet(c)}</div>
                </div>
              </button>
              {current ? (
                <span className="shrink-0 px-1 text-[12px] text-muted">当前</span>
              ) : (
                <button
                  type="button"
                  className="shrink-0 px-1 text-[13px] text-primary"
                  onClick={() => onApply(c.id)}
                >
                  应用
                </button>
              )}
            </div>
          );
        })}
        {!folderId && foldersSorted.length === 0 && root.length === 0 && (
          <div className="px-3 py-4 text-center text-[12px] text-muted">还没有其他角色</div>
        )}
        {folderId && list.length === 0 && (
          <div className="px-3 py-4 text-center text-[12px] text-muted">文件夹是空的</div>
        )}
      </div>
    </div>
  );
}

function LabeledSlider({
  label,
  value,
  min,
  max,
  step,
  locked,
  onLock,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  locked?: boolean;
  onLock?: (v: boolean) => void;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-[13px]">
        <span className="font-medium">{label}</span>
        <span className="flex items-center gap-1 text-muted">
          {step && step < 1 ? value.toFixed(step < 0.1 ? 2 : 1) : value}
          {onLock && (
            <button type="button" className={locked ? "text-primary" : "text-muted"} onClick={() => onLock(!locked)} aria-label="锁定">
              <Lock className="size-3.5" />
            </button>
          )}
        </span>
      </div>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} disabled={locked} />
    </div>
  );
}

function RowSwitch({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="text-[11px] text-muted">{hint}</div>}
      </div>
      <Switch on={on} onChange={onChange} />
    </div>
  );
}

function PromptBox({
  value,
  onChange,
  suggest,
  minH,
}: {
  value: string;
  onChange: (v: string) => void;
  suggest?: boolean;
  minH?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [hits, setHits] = useState<Tag[]>([]);
  useEffect(() => {
    void loadTags();
  }, []);
  const onPick = (tag: string) => {
    const el = ref.current;
    const caret = el?.selectionStart ?? value.length;
    const next = insertTag(value, caret, tag);
    onChange(next.text);
    setHits([]);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(next.caret, next.caret);
    });
  };
  return (
    <div className="relative">
      <TextArea
        ref={ref}
        value={value}
        style={{ minHeight: minH }}
        onChange={(e) => {
          onChange(e.target.value);
          if (!suggest) {
            setHits([]);
            return;
          }
          const caret = e.target.selectionStart ?? e.target.value.length;
          setHits(suggestTags(e.target.value, caret, 8).items);
        }}
      />
      {hits.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-[14px] border border-line bg-card py-1 shadow-lg">
          {hits.map((t) => (
            <button
              key={t.e}
              type="button"
              className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] hover:bg-dim"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(t.e)}
            >
              <span>{t.e}</span>
              <span className="text-muted">{t.c}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
