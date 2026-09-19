import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  GitBranch,
  Loader2,
  Pencil,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { imageUrl } from "@/lib/idb";
import { modelLabel, samplerLabel } from "@/lib/nai";
import { extractGrokTail } from "@/lib/nai-tags";
import { useApp } from "@/lib/store";
import { downloadBlob, cn } from "@/lib/utils";
import { foldWindow, genPhaseLabel, stripStatus } from "@/lib/engine";
import { memoryCaughtUp } from "@/lib/chat-memory";
import { splitDialogue, stripSpeakerPrefix } from "@/lib/rp-text";
import { parseReplyMarkup, type ReplyFold } from "@/lib/reply-markup";
import type { Chat, ChatMessage, GenImage, ImageGenSource, MultiMode, PromptInsertMode } from "@/lib/types";
import { attachImage, branchFrom, cancelMemory, editMessage, regenMessage, retryMemory, sendUser } from "./chat-actions";
import { ChatModelSelect } from "./ModelSelect";
import { ChatAvatar, ExpandSelect, Modal, TextArea, useCooldown } from "./ui-kit";

export function ChatPane({ chat }: { chat: Chat }) {
  const cooldownUntil = useApp((s) => s.settings.cooldownUntil);
  const left = useCooldown(cooldownUntil);
  const chatImage = useApp((s) => s.settings.chatImage !== false);
  const memoryHint = useApp((s) => s.ui.memoryHint);
  const imageTrayOffer = useApp((s) => s.ui.imageTrayOffer);
  const editUser = useApp((s) => (s.ui.editUserMsg?.chatId === chat.id ? s.ui.editUserMsg : null));
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const draft = useApp((s) => s.composerDrafts[chat.id] ?? "");

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = chat.scrollTop || 0;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(bottom);
  }, [chat.id]);

  useEffect(() => {
    if (editUser) requestAnimationFrame(() => inputRef.current?.focus());
  }, [editUser?.msgId]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(bottom);
    useApp.getState().patchChat(chat.id, { scrollTop: el.scrollTop });
  };

  const startUserEdit = (msgId: string, content: string) => {
    const backup = editUser ? editUser.backup : draft;
    useApp.getState().setUI({ editUserMsg: { chatId: chat.id, msgId, backup } });
    useApp.getState().setComposerDraft(chat.id, content);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const cancelUserEdit = () => {
    if (!editUser) return;
    useApp.getState().setComposerDraft(chat.id, editUser.backup);
    useApp.getState().setUI({ editUserMsg: null });
  };

  const send = () => {
    const t = draft;
    if (editUser) {
      const { msgId, backup } = editUser;
      useApp.getState().setUI({ editUserMsg: null });
      useApp.getState().setComposerDraft(chat.id, backup);
      void editMessage(chat.id, msgId, t);
      return;
    }
    useApp.getState().setComposerDraft(chat.id, "");
    void sendUser(chat.id, t);
  };

  const portrait = chat.imageParams.height >= chat.imageParams.width;
  const lastAssistId = [...chat.messages].reverse().find((m) => m.role !== "user")?.id;
  const { W, I } = foldWindow();
  const memOk = memoryCaughtUp(chat.messages.length, chat.memoryUntil || 0, W, I);
  const memMine = memoryHint?.chatId === chat.id;
  const memGenerating = memMine && memoryHint?.state === "generating";
  const memOkFlash = memMine && memoryHint?.state === "ok";
  const memFail = !memOk && !memGenerating && !memOkFlash;
  const failReason = memMine && memoryHint?.state === "fail" ? memoryHint.error : "";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative flex shrink-0 items-center justify-center gap-1 px-2 py-1">
        {chat.isMulti && (
          <div className="absolute left-2">
            <ExpandSelect<PromptInsertMode>
              value={chat.promptMode}
              options={[
                { id: "insert", label: "插入版" },
                { id: "legacy", label: "原版" },
              ]}
              onChange={(id) => useApp.getState().patchChat(chat.id, { promptMode: id })}
              menu="start"
            />
          </div>
        )}
        <ChatModelSelect />
        {chat.isMulti && (
          <div className="absolute right-2">
            <ExpandSelect<MultiMode>
              value={chat.multiMode}
              options={[
                { id: "together", label: "多人同聊模式" },
                { id: "group", label: "群聊模式" },
              ]}
              onChange={(id) => useApp.getState().patchChat(chat.id, { multiMode: id })}
              menu="end"
            />
          </div>
        )}
      </div>

      <div ref={scroller} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 scroll-thin">
        {chat.messages.length === 0 && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-card px-4 py-4 text-[13px] leading-7 text-primary">
            <p>聊天：在输入框里写完点发送即可。</p>
            <p>生图参数：只作用于当前角色的配图，模型、提示词、分辨率、步数都在那里改。</p>
            <p>纯生图：只出图，不聊天，参数和聊天完全独立。</p>
            <p>顶栏可切换当前用的模型。润色人设、写提示词、聊天回复都用同一个。</p>
            <p className="text-muted">
              对 {chat.name || "她"} 说点什么。(动作) 是已经发生的事实，《》是给 AI 的指令，角色听不见。
            </p>
          </div>
        )}
        {chat.messages.map((m) => (
          <Bubble
            key={m.id}
            chat={chat}
            msg={m}
            showImageTray={
              Boolean(imageTrayOffer && imageTrayOffer.chatId === chat.id && imageTrayOffer.msgId === m.id && lastAssistId === m.id)
            }
            onUseOption={(t) => {
              useApp.getState().setComposerDraft(chat.id, t);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            onEditUser={m.role === "user" ? () => startUserEdit(m.id, m.content) : undefined}
          />
        ))}
      </div>

      <div className="shrink-0 bg-bg px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-1">
        <div className="mb-1.5 flex h-6 items-center gap-1.5 px-0.5 text-[13px] leading-none">
          <div className="inline-flex h-[22px] items-center gap-1.5 rounded-md border border-line bg-card px-1.5">
            <button
              className={cnToggle(portrait)}
              onClick={() => {
                if (!portrait)
                  useApp.getState().patchParams(chat.id, {
                    width: chat.imageParams.height,
                    height: chat.imageParams.width,
                  });
              }}
            >
              竖图
            </button>
            <span className="text-faint">|</span>
            <button
              className={cnToggle(!portrait)}
              onClick={() => {
                if (portrait)
                  useApp.getState().patchParams(chat.id, {
                    width: chat.imageParams.height,
                    height: chat.imageParams.width,
                  });
              }}
            >
              横图
            </button>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            {chatImage ? (
              left > 0 ? (
                <span className="font-medium text-danger">{left}s</span>
              ) : (
                <span className="text-good">可生图</span>
              )
            ) : (
              <span className="text-muted">生图已关</span>
            )}
          </div>
          <button
            className={
              chat.adultBoost
                ? "inline-flex h-[22px] items-center rounded-md border border-line px-1.5 font-medium text-ink"
                : "inline-flex h-[22px] items-center rounded-md border border-line px-1.5 text-muted"
            }
            onClick={() => useApp.getState().patchChat(chat.id, { adultBoost: !chat.adultBoost })}
          >
            成人提示词
          </button>
        </div>
        {memGenerating || memOkFlash || memFail ? (
          <div className="flex items-center gap-2 px-[52px] pb-1 text-[12px]">
            <span className={memFail ? "min-w-0 flex-1 text-danger" : memOkFlash ? "min-w-0 flex-1 text-good" : "min-w-0 flex-1 text-faint"}>
              {memGenerating
                ? "生成记忆中"
                : memOkFlash
                  ? "记忆已生成"
                  : failReason
                    ? `记忆生成失败（${failReason}）`
                    : "记忆生成失败"}
            </span>
            {memGenerating ? (
              <button type="button" className="shrink-0 text-muted" onClick={() => cancelMemory(chat.id)}>
                取消
              </button>
            ) : memFail ? (
              <button type="button" className="shrink-0 text-muted" onClick={() => retryMemory(chat.id)}>
                重试
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <button
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted"
            onClick={() => {
              const el = scroller.current;
              if (!el) return;
              if (atBottom) el.scrollTo({ top: 0, behavior: "smooth" });
              else el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
            }}
            aria-label={atBottom ? "回到顶部" : "回到底部"}
          >
            {atBottom ? <ChevronDown className="size-5 rotate-180" /> : <ArrowDown className="size-5" />}
          </button>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => useApp.getState().setComposerDraft(chat.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder=""
            className="max-h-32 min-h-[46px] flex-1 resize-none rounded-full border border-line bg-card px-4 py-3 text-[14px] outline-none"
          />
          <button
            onClick={send}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary"
            aria-label={editUser ? "保存" : "发送"}
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
        {editUser ? (
          <div className="flex justify-center pt-1">
            <button type="button" className="text-[12px] text-muted" onClick={cancelUserEdit}>
              取消编辑
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function jumpParams(section: string) {
  useApp.getState().setUI({ paramsJump: section });
  useApp.getState().setTab("params");
}

function cnToggle(on: boolean) {
  return on ? "px-1 font-medium text-ink" : "px-1 text-muted";
}

function Bubble({
  chat,
  msg,
  showImageTray,
  onUseOption,
  onEditUser,
}: {
  chat: Chat;
  msg: ChatMessage;
  showImageTray?: boolean;
  onUseOption?: (text: string) => void;
  onEditUser?: () => void;
}) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(msg.content);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const generating = msg.role !== "user" && !msg.content;
  const names = [msg.characterName, chat.name, ...chat.characters.map((c) => c.name), "角色"];
  const editingUser = useApp((s) => s.ui.editUserMsg?.msgId === msg.id);

  const startAssistEdit = () => {
    setText(msg.content);
    setEdit(true);
    requestAnimationFrame(() => editRef.current?.focus());
  };

  if (msg.role === "user") {
    return (
      <div className="mb-4 flex flex-col items-end">
        <div
          className={cn(
            "w-fit max-w-[85%] rounded-[18px] border px-4 py-2.5",
            editingUser ? "border-primary bg-card" : "border-line bg-card",
          )}
        >
          <div className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{msg.content}</div>
        </div>
        <div className="mt-1.5 flex justify-end gap-1.5">
          <Mini onClick={() => onEditUser?.()} icon={<Pencil className="size-3" />} label="编辑" />
          <Mini onClick={() => void branchFrom(chat.id, msg.id)} icon={<GitBranch className="size-3" />} label="开分支" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        className="mb-2 flex items-center gap-2"
        onClick={() => useApp.getState().beginEdit(chat.id)}
      >
        <ChatAvatar chat={chat} name={msg.characterName || chat.name} size={36} />
        <div className="text-[16px] font-semibold">{msg.characterName || chat.name}</div>
      </button>
      <div className="pl-[44px]">
        {generating ? (
          <div className="font-sans text-[14px] text-muted">
            回复中
            <span className="inline-flex gap-0.5 pl-1">
              <i className="animate-pulse">·</i>
              <i className="animate-pulse">·</i>
              <i className="animate-pulse">·</i>
            </span>
          </div>
        ) : edit ? (
          <textarea
            ref={editRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="serif-body min-h-[120px] w-full resize-y bg-transparent text-[16px] leading-relaxed text-narrate outline-none"
          />
        ) : (
          <ReplyView text={msg.content} names={names} onUseOption={onUseOption} />
        )}
        {edit ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="inline-flex h-7 items-center rounded-full border border-line bg-card px-3 text-[12px] text-muted"
              onClick={() => setEdit(false)}
            >
              取消
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-[12px] text-on-primary"
              onClick={() => {
                void editMessage(chat.id, msg.id, text);
                setEdit(false);
              }}
            >
              保存
            </button>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Mini onClick={() => void regenMessage(chat.id, msg.id)} icon={<RefreshCw className="size-3" />} label="重新生成" />
            <Mini onClick={() => void branchFrom(chat.id, msg.id)} icon={<GitBranch className="size-3" />} label="开分支" />
            {!generating && (
              <Mini onClick={startAssistEdit} icon={<Pencil className="size-3" />} label="编辑" />
            )}
          </div>
        )}
        {(msg.images.length > 0 || (showImageTray && !generating)) && (
          <ImageBlock chat={chat} msg={msg} allowEmpty={Boolean(showImageTray && !generating)} />
        )}
      </div>
    </div>
  );
}

function ReplyView({
  text,
  names,
  onUseOption,
}: {
  text: string;
  names: (string | undefined)[];
  onUseOption?: (text: string) => void;
}) {
  const parsed = parseReplyMarkup(text);
  const think = parsed.folds.filter((f) => f.kind === "think");
  const notes = parsed.folds.filter((f) => f.kind === "note");
  return (
    <>
      {think.map((f, i) => (
        <ReplyFoldRow key={`think-${i}-${f.title}`} fold={f} />
      ))}
      {parsed.body ? <RpBody text={parsed.body} names={names} /> : null}
      {notes.map((f, i) => (
        <ReplyFoldRow key={`note-${i}-${f.title}`} fold={f} />
      ))}
      {parsed.options.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {parsed.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onUseOption?.(opt)}
              className="block w-full rounded-[16px] border border-line bg-card px-3 py-2 text-left text-[13px] leading-snug text-ink"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

function ReplyFoldRow({ fold }: { fold: ReplyFold }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={fold.kind === "think" ? "mb-2" : "mt-2"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[12px] text-muted"
      >
        <ChevronDown className={cn("size-3.5 shrink-0 transition", open ? "" : "-rotate-90")} />
        {fold.title}
      </button>
      {open && fold.body ? (
        <div className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-narrate">{fold.body}</div>
      ) : null}
    </div>
  );
}

function RpBody({ text, names }: { text: string; names: (string | undefined)[] }) {
  const stripped = stripSpeakerPrefix(text, names);
  const { body, status } = stripStatus(stripped);
  const parts = splitDialogue(body);
  return (
    <>
      <div className="serif-body whitespace-pre-wrap text-[16px] text-narrate">
        {parts.map((p, i) => (
          <span key={i} className={p.kind === "say" ? "font-semibold italic text-ink" : undefined}>
            {p.text}
          </span>
        ))}
      </div>
      {status ? (
        <div className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-6 text-ink">{status}</div>
      ) : null}
    </>
  );
}

function Mini({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-6 items-center gap-0.5 rounded-full border border-line bg-card px-2 text-[11px] leading-none text-muted"
    >
      {icon}
      {label}
    </button>
  );
}

function ImageBlock({ chat, msg, allowEmpty }: { chat: Chat; msg: ChatMessage; allowEmpty?: boolean }) {
  const chatImage = useApp((s) => s.settings.chatImage !== false);
  const done = msg.images.filter((g) => g.status === "done" && g.blobId);
  const pendingImg = msg.images.find((g) => g.status !== "done" && g.status !== "error");
  const pending = Boolean(pendingImg);
  const followLatest = useRef(true);
  const prevDone = useRef(done.length);
  const [idx, setIdx] = useState(() => Math.max(0, done.length - 1));
  const [url, setUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [kick, setKick] = useState<ImageGenSource | null>(null);
  const current: GenImage | undefined = done[idx] ?? done[done.length - 1];
  const busy = kick ?? pendingImg?.source ?? null;
  const locked = pending || Boolean(kick) || !chatImage;

  useEffect(() => {
    if (!pending) setKick(null);
  }, [pending]);

  useEffect(() => {
    if (done.length > prevDone.current) {
      setIdx(done.length - 1);
      followLatest.current = true;
    } else if (idx >= done.length && done.length > 0) {
      setIdx(done.length - 1);
    }
    prevDone.current = done.length;
  }, [done.length, idx]);

  useEffect(() => {
    let gone = false;
    if (current?.blobId) {
      void imageUrl(current.blobId).then((u) => {
        if (!gone) setUrl(u);
      });
    } else setUrl(null);
    return () => {
      gone = true;
    };
  }, [current?.blobId]);

  const go = (dir: -1 | 1) => {
    const n = done.length;
    if (n < 2) return;
    setIdx((i) => {
      const next = (i + dir + n) % n;
      followLatest.current = next === n - 1;
      return next;
    });
  };

  const lastError = [...msg.images].reverse().find((g) => g.status === "error");
  const phaseLabel =
    genPhaseLabel(pendingImg?.status) ||
    (kick === "rewrite" || kick === "auto" ? "写提示词中" : kick ? "上传中" : "");

  if (msg.images.length === 0 && !allowEmpty) return null;

  return (
    <div className="mt-3">
      {current && (
        <div className="mb-1 flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 text-left text-[11px] text-muted">
          <button onClick={() => jumpParams("model")}>{modelLabel(current.model)}</button>
          <button onClick={() => jumpParams("size")}>
            {current.width}×{current.height}
          </button>
          <button onClick={() => jumpParams("steps")}>{current.steps}步</button>
          <button onClick={() => jumpParams("sampler")}>{samplerLabel(current.sampler)}</button>
          <button
            onClick={() => {
              useApp.getState().patchParams(chat.id, { seed: current.seed });
              jumpParams("seed");
            }}
          >
            {String(current.seed).slice(0, 8)}
          </button>
          {chat.isMulti && (
            <button className="text-danger" onClick={() => jumpParams("chars")}>
              多
            </button>
          )}
        </div>
      )}
      <div className="relative overflow-hidden rounded-[18px] bg-dim">
        {current && url ? (
          <div className="relative">
            <img src={url} alt="" className="w-full" />
            {done.length > 1 && (
              <>
                <button className="absolute inset-y-0 left-0 w-1/2" onClick={() => go(-1)} aria-label="上一张" />
                <button className="absolute inset-y-0 right-0 w-1/2" onClick={() => go(1)} aria-label="下一张" />
              </>
            )}
          </div>
        ) : (
          <div
            className="grid place-items-center px-4 text-[13px] text-muted"
            style={{ aspectRatio: `${chat.imageParams.width} / ${chat.imageParams.height}` }}
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> {phaseLabel || "准备中"}
              </span>
            ) : lastError ? (
              <span className="text-center text-danger">{genPhaseLabel("error", lastError.error)}</span>
            ) : (
              <span className="text-center text-muted">还没有配图</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-4 text-[12px] text-muted">
        <IcoBtn
          icon={<RefreshCw className="size-4" />}
          label={busy === "same" && phaseLabel ? phaseLabel : "重新生成"}
          busy={busy === "same"}
          disabled={locked || !current}
          onClick={() => {
            if (locked || !current) return;
            setKick("same");
            void attachImage(chat.id, msg.id, "same");
          }}
        />
        <IcoBtn
          icon={<Sparkles className="size-4" />}
          label={busy === "rewrite" && phaseLabel ? phaseLabel : "换提示词生成"}
          busy={busy === "rewrite"}
          disabled={locked}
          onClick={() => {
            if (locked) return;
            setKick("rewrite");
            void attachImage(chat.id, msg.id, "rewrite");
          }}
        />
        <IcoBtn
          icon={saved ? <Check className="size-4 text-good" /> : <Download className="size-4" />}
          label="下载"
          disabled={!current?.blobId}
          onClick={async () => {
            if (!current?.blobId) return;
            const u = await imageUrl(current.blobId);
            if (!u) return;
            const blob = await fetch(u).then((r) => r.blob());
            downloadBlob(blob, String(current.seed));
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }}
        />
        <IcoBtn
          icon={<Wand2 className="size-4" />}
          label={busy === "custom" && phaseLabel ? phaseLabel : "自定义修改"}
          busy={busy === "custom"}
          disabled={locked || !current}
          onClick={() => {
            if (!current || locked) return;
            useApp.getState().setUI({
              customPrompt: {
                chatId: chat.id,
                msgId: msg.id,
                imgId: current.id,
                text: extractGrokTail(current.prompt, chat.imageParams) || current.prompt,
                charTails: { ...(current.charTails || {}) },
              },
            });
          }}
        />
      </div>
    </div>
  );
}

function IcoBtn({
  icon,
  label,
  onClick,
  busy,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-label={label}
      className={
        busy
          ? "flex w-full min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-primary"
          : "flex w-full min-w-0 flex-col items-center gap-1 px-1 py-1 text-center disabled:opacity-40"
      }
    >
      {busy ? <Loader2 className="size-4 shrink-0 animate-spin" /> : icon}
      <span className="max-w-full truncate">{label}</span>
    </button>
  );
}

export function CustomPromptModal() {
  const data = useApp((s) => s.ui.customPrompt);
  const setUI = useApp((s) => s.setUI);
  const chat = useApp((s) => (data ? s.chats.find((c) => c.id === data.chatId) : undefined));
  const [text, setText] = useState(data?.text ?? "");
  const [charTails, setCharTails] = useState<Record<string, string>>(data?.charTails ?? {});
  useEffect(() => {
    setText(data?.text ?? "");
    setCharTails(data?.charTails ?? {});
  }, [data?.text, data?.imgId]);
  if (!data || !chat) return null;
  const insert = chat.isMulti && chat.promptMode === "insert";
  const chars = chat.imageParams.characters;
  return (
    <Modal open onClose={() => setUI({ customPrompt: null })} title="自定义修改提示词">
      {insert ? (
        <>
          <p className="mb-3 text-[12px] leading-5 text-muted">
            总提示追加到「正面提示词 · 中」后面，各角色追加到对应角色正面提示词后面。不会写入 ENABLED。
          </p>
          <div className="mb-1 text-[13px] font-medium">总提示（正面提示词 · 中）</div>
          <TextArea className="min-h-[96px]" value={text} onChange={(e) => setText(e.target.value)} />
          {chars.map((ch, i) => (
            <div key={ch.id} className="mt-3">
              <div className="mb-1 text-[13px] font-medium">
                角色{i + 1}
                {ch.name ? `:${ch.name}` : ""} 正面提示词
              </div>
              <TextArea
                className="min-h-[88px]"
                value={charTails[ch.id] ?? ""}
                onChange={(e) => setCharTails((prev) => ({ ...prev, [ch.id]: e.target.value }))}
              />
            </div>
          ))}
        </>
      ) : (
        <TextArea className="min-h-[160px]" value={text} onChange={(e) => setText(e.target.value)} />
      )}
      <div className="mt-4 flex gap-2">
        <button
          className="h-12 flex-1 rounded-full border border-line bg-card text-[15px] font-medium"
          onClick={() => setUI({ customPrompt: null })}
        >
          取消
        </button>
        <button
          className="h-12 flex-[1.2] rounded-full bg-primary text-[15px] font-medium text-on-primary"
          onClick={() => {
            void attachImage(data.chatId, data.msgId, "custom", text, insert ? charTails : undefined);
            setUI({ customPrompt: null });
          }}
        >
          按这个生成
        </button>
      </div>
    </Modal>
  );
}
