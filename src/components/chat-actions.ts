import {
  afterPaint,
  chatContextBlock,
  foldWindow,
  generateNai,
  groupFormatHint,
  historyMessages,
  imageFailText,
  makeAssistantPlaceholder,
  makeImageRecord,
  makeUserMessage,
  nextFoldSlice,
  parseGroup,
  parseImageTagOutput,
  splitChatPrompt,
  stripStatus,
  summarizeMemory,
  writeImageTags,
} from "@/lib/engine";
import { grokStream } from "@/lib/grok-client";
import { sanitizeNaiTags, extractGrokTail } from "@/lib/nai-tags";
import { COOLDOWN_MS } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { shotAndResidual, previousRoundImagePrompt } from "@/lib/user-markup";
import { presetStyle } from "@/lib/st-preset";
import { applySnaps, foldCoveredEnd, memoryCaughtUp, memoryFailReason, pushSnap, rewindSnaps } from "@/lib/chat-memory";
import { chatImageSystem } from "@/lib/prompts";
import { resolveImageWrite } from "@/lib/image-ai";
import type { Chat, ChatMessage, GenImage, ImageGenSource } from "@/lib/types";
import { randomSeed, uid } from "@/lib/utils";

const aborts = new Map<string, AbortController>();
const busy = new Set<string>();
const memoryEpoch = new Map<string, number>();
const memoryBusy = new Set<string>();
const memoryAborts = new Map<string, AbortController>();
const imageAborts = new Map<string, AbortController>();

function imageKey(chatId: string, msgId: string) {
  return `${chatId}:${msgId}`;
}

function chat(id: string) {
  return useApp.getState().chats.find((c) => c.id === id);
}

function patch(id: string, fn: (c: Chat) => Chat) {
  useApp.getState().patchChat(id, fn);
}

function imageOn() {
  return useApp.getState().settings.chatImage !== false;
}

function lastAssist(c: Chat) {
  return [...c.messages].reverse().find((m) => m.role === "assistant" || m.role === "narrator");
}

function bumpMemoryEpoch(id: string) {
  memoryEpoch.set(id, (memoryEpoch.get(id) ?? 0) + 1);
}

export async function sendOpening(id: string) {
  await runReply(id, null, true);
}

export async function sendUser(id: string, text: string) {
  const t = text.trim();
  abortChat(id);
  patch(id, (c) => ({ ...c, messages: [...c.messages, makeUserMessage(t)] }));
  await runReply(id, t, false);
}

export function abortChat(id: string) {
  aborts.get(id)?.abort();
  aborts.delete(id);
  for (const [k, ac] of imageAborts) {
    if (k.startsWith(`${id}:`)) {
      ac.abort();
      imageAborts.delete(k);
    }
  }
  invalidateMemory(id);
}

export function cancelImage(chatId: string, msgId: string) {
  imageAborts.get(imageKey(chatId, msgId))?.abort();
}

export function invalidateMemory(id: string) {
  bumpMemoryEpoch(id);
  memoryAborts.get(id)?.abort();
  memoryAborts.delete(id);
  memoryBusy.delete(id);
  const hint = useApp.getState().ui.memoryHint;
  if (hint?.chatId === id && hint.state === "generating") useApp.getState().setUI({ memoryHint: null });
}

export function cancelMemory(id: string) {
  memoryAborts.get(id)?.abort();
  memoryAborts.delete(id);
  bumpMemoryEpoch(id);
  memoryBusy.delete(id);
  const hint = useApp.getState().ui.memoryHint;
  if (!hint || hint.chatId === id) {
    useApp.getState().setUI({ memoryHint: { chatId: id, state: "fail", error: "已取消" } });
  }
}

export function retryMemory(id: string) {
  void runMemory(id);
}

export async function regenMessage(id: string, msgId: string) {
  abortChat(id);
  const c = chat(id);
  if (!c) return;
  const idx = c.messages.findIndex((m) => m.id === msgId);
  if (idx < 0) return;
  const cut = c.messages.slice(0, idx);
  patch(id, (ch) => ({
    ...ch,
    messages: cut,
    ...applySnaps(rewindSnaps(ch.memorySnaps, cut.length)),
  }));
  bumpMemoryEpoch(id);
  const lastUser = [...cut].reverse().find((m) => m.role === "user");
  await runReply(id, lastUser?.content ?? null, cut.length === 0, true);
}

export async function branchFrom(id: string, msgId: string) {
  const c = chat(id);
  if (!c) return;
  const idx = c.messages.findIndex((m) => m.id === msgId);
  if (idx < 0) return;
  const keep = idx + 1;
  const copy = {
    ...structuredClone(c),
    id: uid("chat_"),
    name: `${c.name}(分支)`,
    starred: false,
    isDraft: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: structuredClone(c.messages.slice(0, keep)),
    ...applySnaps(rewindSnaps(c.memorySnaps, keep)),
  };
  useApp.setState((s) => ({ chats: [...s.chats, copy], currentId: copy.id }));
  const { db } = await import("@/lib/idb");
  void db.chats.put(copy);
  useApp.getState().toast(`已开分支「${copy.name}」`);
}

function applyStream(id: string, placeholder: ChatMessage, full: string, c0: Chat) {
  const { body, status } = stripStatus(full);
  if (c0.isMulti && c0.multiMode === "group") {
    const parts = parseGroup(full);
    const mapped: ChatMessage[] = parts.map((p, i) => ({
      id: i === 0 ? placeholder.id : placeholder.id + "_" + i,
      role: p.narrator ? "narrator" : "assistant",
      characterName: p.narrator ? undefined : p.name,
      characterId: c0.characters.find((ch) => ch.name === p.name)?.id,
      content: stripStatus(p.content).body,
      images: [],
      createdAt: Date.now(),
    }));
    patch(id, (c) => {
      const old = c.messages.filter((m) => m.id === placeholder.id || m.id.startsWith(placeholder.id + "_"));
      const imgs = old.flatMap((m) => m.images);
      if (mapped.length && imgs.length) mapped[mapped.length - 1].images = imgs;
      const without = c.messages.filter((m) => m.id !== placeholder.id && !m.id.startsWith(placeholder.id + "_"));
      return {
        ...c,
        messages: [...without, ...mapped],
        statusBar: status || c.statusBar,
      };
    });
  } else {
    patch(id, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === placeholder.id ? { ...m, content: body } : m)),
      statusBar: status || c.statusBar,
    }));
  }
}

function ensureWritingImage(id: string, placeholder: ChatMessage) {
  const live = chat(id);
  if (!live) return;
  const target = lastAssist(live) ?? placeholder;
  if (target.images.some((g) => g.status !== "done" && g.status !== "error")) return;
  const img = makeImageRecord({
    model: live.imageParams.model,
    width: live.imageParams.width,
    height: live.imageParams.height,
    steps: live.imageParams.steps,
    sampler: live.imageParams.sampler,
    negative: live.imageParams.negative,
    seed:
      live.imageParams.seedLocked && live.imageParams.seed != null
        ? live.imageParams.seed
        : randomSeed(),
    status: "writing",
    source: "auto",
  });
  patch(id, (ch) => ({
    ...ch,
    messages: ch.messages.map((m) => (m.id === target.id ? { ...m, images: [...m.images, img] } : m)),
  }));
}

async function runReply(id: string, _userText: string | null, opening: boolean, regen = false) {
  const c0 = chat(id);
  if (!c0) return;
  const grokModelId = useApp.getState().settings.grokModelId;
  const wantImage = imageOn();
  const imageInChat = wantImage && !resolveImageWrite(useApp.getState().settings.imageModelId).split;
  const ctrl = new AbortController();
  aborts.set(id, ctrl);
  busy.add(id);
  const placeholder = makeAssistantPlaceholder(c0);
  patch(id, (c) => ({ ...c, messages: [...c.messages, placeholder] }));

  const extra = [
    chatContextBlock(c0, { regen }),
    groupFormatHint(c0, imageInChat),
    opening ? "这是开场。根据开场场景，以角色口吻先说第一句。不要以用户身份说话。" : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const live = chat(id)!;
  const prevScene = previousRoundImagePrompt(live.messages, placeholder.id);
  const msgs = historyMessages(live).filter((m) => m.content);
  if (opening && msgs.length === 0) {
    msgs.push({ role: "user", content: "（开始场景，请角色先开口）" });
  }

  let raw = "";
  let promptStarted = false;
  let streamFailed = false;
  try {
    raw = await grokStream(
      {
        task: "chat",
        grokModelId,
        extraSystem: extra,
        imageSystem: imageInChat ? chatImageSystem(c0, prevScene) : undefined,
        messages: msgs,
        ...presetStyle(useApp.getState().settings, "chat", c0),
      },
      (text) => {
        const split = splitChatPrompt(text);
        applyStream(id, placeholder, split.visible, c0);
        if (imageInChat && split.started && !promptStarted) {
          promptStarted = true;
          ensureWritingImage(id, placeholder);
        }
      },
      ctrl.signal,
    );
    if (raw) {
      const split = splitChatPrompt(raw);
      applyStream(id, placeholder, split.visible, c0);
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    streamFailed = true;
    const split = splitChatPrompt(raw);
    if (!split.visible.trim()) {
      patch(id, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === placeholder.id ? { ...m, content: m.content || `（回复失败）${e instanceof Error ? e.message : ""}` } : m,
        ),
      }));
    } else {
      applyStream(id, placeholder, split.visible, c0);
    }
  } finally {
    aborts.delete(id);
    busy.delete(id);
  }

  const latest = chat(id);
  if (!latest) return;
  const assist = lastAssist(latest);
  const split = splitChatPrompt(raw);
  const visibleOk = Boolean(split.visible.trim() || assist?.content.trim());

  if (wantImage && assist && visibleOk) {
    const splitWrite = resolveImageWrite(useApp.getState().settings.imageModelId).split;
    if (splitWrite) {
      void attachImage(id, assist.id, "rewrite", undefined, undefined, undefined, split.visible);
    } else {
      if (promptStarted && !split.started && raw) {
        const again = splitChatPrompt(raw);
        if (again.started) Object.assign(split, again);
      }
      const parsed = split.prompt ? parseImageTagOutput(split.prompt, latest) : null;
      const hasTags = Boolean(parsed && (parsed.base || Object.keys(parsed.chars).length));
      if (hasTags && parsed) {
        void attachImage(id, assist.id, "auto", undefined, undefined, parsed);
      } else if (!streamFailed || promptStarted) {
        void attachImage(id, assist.id, "rewrite", undefined, undefined, undefined, split.visible);
      }
    }
  }

  if (visibleOk) void maybeMemory(id);
}

export async function attachImage(
  id: string,
  msgId: string,
  mode: ImageGenSource = "auto",
  custom?: string,
  customChars?: Record<string, string>,
  parsed?: { base: string; chars: Record<string, string>; absent: string[] },
  shotText?: string,
) {
  if (!imageOn()) return;
  const c = chat(id);
  if (!c) return;
  const msg = c.messages.find((m) => m.id === msgId);
  if (!msg) return;
  if (msg.images.some((g) => g.status !== "done" && g.status !== "error" && g.status !== "writing")) return;
  const settings = useApp.getState().settings;
  const prev = msg.images.filter((g) => g.prompt).at(-1);
  const writing = msg.images.find((g) => g.status === "writing");
  const needsWrite = !parsed && mode !== "custom" && !(mode === "same" && prev?.prompt);
  const img: GenImage =
    writing && (mode === "auto" || mode === "rewrite")
      ? writing
      : makeImageRecord({
          model: c.imageParams.model,
          width: c.imageParams.width,
          height: c.imageParams.height,
          steps: c.imageParams.steps,
          sampler: c.imageParams.sampler,
          negative: c.imageParams.negative,
          seed:
            c.imageParams.seedLocked && c.imageParams.seed != null
              ? c.imageParams.seed
              : randomSeed(),
          status: needsWrite ? "writing" : "uploading",
          source: mode,
        });
  if (!writing || img.id !== writing.id) {
    if (msg.images.some((g) => g.status !== "done" && g.status !== "error")) return;
    patch(id, (ch) => ({
      ...ch,
      messages: ch.messages.map((m) => (m.id === msgId ? { ...m, images: [...m.images, img] } : m)),
    }));
  } else {
    patch(id, (ch) => ({
      ...ch,
      messages: ch.messages.map((m) =>
        m.id === msgId ? { ...m, images: m.images.map((g) => (g.id === img.id ? { ...g, status: "writing", source: mode } : g)) } : m,
      ),
    }));
  }

  const setImg = (p: Partial<GenImage>) =>
    patch(id, (ch) => ({
      ...ch,
      messages: ch.messages.map((m) =>
        m.id === msgId ? { ...m, images: m.images.map((g) => (g.id === img.id ? { ...g, ...p } : g)) } : m,
      ),
    }));

  if (!settings.naiKey) {
    setImg({ status: "error", error: "还没连接 NAI 中转站" });
    return;
  }

  const ac = new AbortController();
  const key = imageKey(id, msgId);
  imageAborts.get(key)?.abort();
  imageAborts.set(key, ac);

  try {
    let grokTail = custom ? sanitizeNaiTags(custom, { stripForbidden: false }) : "";
    let charTails: Record<string, string> = {};
    if (customChars) {
      for (const [k, v] of Object.entries(customChars)) {
        const t = sanitizeNaiTags(v, { stripForbidden: false });
        if (t) charTails[k] = t;
      }
    }
    if (mode !== "custom") {
      if (parsed) {
        grokTail = parsed.base;
        charTails = mapCharTails(c, parsed.chars);
        applyAbsent(id, parsed.absent);
      } else if (mode === "same" && prev?.prompt) {
        grokTail = extractGrokTail(prev.prompt, c.imageParams);
        charTails = { ...(prev.charTails || {}) };
      } else {
        const live = chat(id) ?? c;
        const { shot, residual } = shotAndResidual(live.messages, msgId, shotText);
        const prevScene = previousRoundImagePrompt(live.messages, msgId);
        const tags = await writeImageTags(
          live,
          residual,
          useApp.getState().settings.grokModelId,
          shot || msg.content,
          prevScene,
          ac.signal,
        );
        grokTail = tags.base;
        charTails = mapCharTails(live, tags.chars);
        applyAbsent(id, tags.absent);
      }
    }
    if (!grokTail && !Object.keys(charTails).length) {
      setImg({ status: "error", error: "提示词写失败" });
      return;
    }
    setImg({ status: "uploading", prompt: grokTail, charTails });
    await afterPaint();
    const live = chat(id) ?? c;
    const result = await generateNai({
      chat: live,
      grokTail,
      charTails,
      seed: img.seed,
      apiKey: settings.naiKey,
      baseUrl: settings.naiBase,
      signal: ac.signal,
      onStart: () => setImg({ status: "generating" }),
      onReceiving: () => {
        useApp.getState().setCooldown(Date.now() + COOLDOWN_MS);
        setImg({ status: "receiving" });
      },
    });
    setImg({ status: "done", blobId: result.blobId, prompt: grokTail, charTails, seed: result.seed });
    const after = chat(id);
    if (after) {
      const firstAssist = after.messages.find((m) => m.role === "assistant" || m.role === "narrator");
      if (firstAssist && firstAssist.id === msgId) {
        patch(id, (ch) => ({ ...ch, avatarBlobId: result.blobId }));
      } else if (!after.avatarBlobId) {
        patch(id, (ch) => ({ ...ch, avatarBlobId: result.blobId }));
      }
    }
  } catch (e) {
    const err = imageFailText(e, ac.signal);
    setImg({ status: "error", error: err });
    if (err !== "已取消") useApp.getState().toast(err);
  } finally {
    if (imageAborts.get(key) === ac) imageAborts.delete(key);
  }
}

function mapCharTails(c: Chat, chars: Record<string, string>) {
  const map: Record<string, string> = {};
  for (const ch of c.imageParams.characters) {
    const byId = chars[ch.id];
    const byName = ch.name ? chars[ch.name] : "";
    if (byId || byName) map[ch.id] = byId || byName;
  }
  return map;
}

function applyAbsent(id: string, absent: string[] | undefined) {
  if (!absent?.length) return;
  const off = new Set(absent);
  patch(id, (ch) => ({
    ...ch,
    imageParams: {
      ...ch.imageParams,
      characters: ch.imageParams.characters.map((x) => ({
        ...x,
        enabled: !off.has(x.id) && !off.has(x.name),
      })),
    },
  }));
}

function setMemoryHint(
  chatId: string,
  state: "generating" | "ok" | "fail" | null,
  extra?: { error?: string; draft?: string },
) {
  if (!state) {
    useApp.getState().setUI({ memoryHint: null });
    return;
  }
  const prev = useApp.getState().ui.memoryHint;
  const keepDraft = state === "generating" && prev?.chatId === chatId ? prev.draft : undefined;
  useApp.getState().setUI({
    memoryHint: {
      chatId,
      state,
      error: extra?.error,
      draft: extra?.draft ?? keepDraft,
    },
  });
}

function onMemoryDelta(id: string) {
  return (t: string) => {
    const hint = useApp.getState().ui.memoryHint;
    if (hint?.chatId === id && hint.state === "generating") {
      useApp.getState().setUI({ memoryHint: { ...hint, draft: t } });
    }
  };
}

async function maybeMemory(id: string) {
  void runMemory(id);
}

async function runMemory(id: string) {
  const c = chat(id);
  if (!c) return;
  const { W, I } = foldWindow();
  if (memoryCaughtUp(c.messages.length, c.memoryUntil || 0, W, I)) return;
  const slice = nextFoldSlice(c);
  if (!slice) return;
  if (memoryBusy.has(id)) return;
  const nAtStart = c.messages.length;
  const epoch = memoryEpoch.get(id) ?? 0;
  const ctrl = new AbortController();
  memoryAborts.set(id, ctrl);
  memoryBusy.add(id);
  setMemoryHint(id, "generating", { draft: "" });
  try {
    const mem = await summarizeMemory(
      c,
      useApp.getState().settings.grokModelId,
      c.messages.slice(slice.start, slice.end),
      c.memory,
      ctrl.signal,
      onMemoryDelta(id),
    );
    if ((memoryEpoch.get(id) ?? 0) !== epoch) return;
    const live = chat(id);
    if (!live) return;
    if (live.messages.length < slice.end) return;
    const snap = { covered: slice.end, text: mem, foldAt: nAtStart };
    patch(id, (ch) => ({ ...ch, ...applySnaps(pushSnap(ch.memorySnaps, snap)) }));
    setMemoryHint(id, "ok");
    setTimeout(() => {
      const ui = useApp.getState().ui.memoryHint;
      if (ui?.chatId === id && ui.state === "ok") setMemoryHint(id, null);
    }, 1000);
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    if ((memoryEpoch.get(id) ?? 0) !== epoch) return;
    setMemoryHint(id, "fail", { error: memoryFailReason(e) });
  } finally {
    if (memoryAborts.get(id) === ctrl) memoryAborts.delete(id);
    memoryBusy.delete(id);
  }
}

export async function runManualMemory(id: string, mode: "current" | "all") {
  const c = chat(id);
  if (!c) return false;
  const { W, I } = foldWindow();
  const n = c.messages.length;
  const needed = foldCoveredEnd(n, W, I);
  if (needed < 2) {
    useApp.getState().toast("还不够长，先多聊几轮");
    return false;
  }
  memoryAborts.get(id)?.abort();
  memoryAborts.delete(id);
  memoryBusy.delete(id);
  const epoch = (memoryEpoch.get(id) ?? 0) + 1;
  memoryEpoch.set(id, epoch);
  const ctrl = new AbortController();
  memoryAborts.set(id, ctrl);
  memoryBusy.add(id);
  setMemoryHint(id, "generating", { draft: "" });
  try {
    const grok = useApp.getState().settings.grokModelId;
    const snaps = c.memorySnaps ?? [];
    const delta = onMemoryDelta(id);
    if (mode === "all") {
      const text = await summarizeMemory(c, grok, c.messages.slice(0, needed), "（无）", ctrl.signal, delta);
      patch(id, (ch) => ({ ...ch, ...applySnaps([{ covered: needed, text, foldAt: n }]) }));
    } else if (memoryCaughtUp(n, c.memoryUntil || 0, W, I)) {
      const last = snaps[snaps.length - 1];
      if (!last || last.covered < 2) {
        useApp.getState().toast("还没有可重压的那一截");
        setMemoryHint(id, null);
        return false;
      }
      const prev = snaps[snaps.length - 2];
      const start = prev?.covered ?? 0;
      const text = await summarizeMemory(c, grok, c.messages.slice(start, last.covered), prev?.text ?? "（无）", ctrl.signal, delta);
      patch(id, (ch) => ({
        ...ch,
        ...applySnaps(pushSnap(ch.memorySnaps, { covered: last.covered, text, foldAt: last.foldAt })),
      }));
    } else {
      const start = c.memoryUntil || 0;
      const text = await summarizeMemory(c, grok, c.messages.slice(start, needed), c.memory || "（无）", ctrl.signal, delta);
      patch(id, (ch) => ({
        ...ch,
        ...applySnaps(pushSnap(ch.memorySnaps, { covered: needed, text, foldAt: n })),
      }));
    }
    if ((memoryEpoch.get(id) ?? 0) !== epoch) return false;
    setMemoryHint(id, "ok");
    setTimeout(() => {
      const ui = useApp.getState().ui.memoryHint;
      if (ui?.chatId === id && ui.state === "ok") setMemoryHint(id, null);
    }, 1000);
    return true;
  } catch (e) {
    if ((e as Error).name === "AbortError") return false;
    const reason = memoryFailReason(e);
    useApp.getState().toast(reason === "请求失败" ? "总结失败，旧备忘还在" : `总结失败：${reason}`);
    setMemoryHint(id, "fail", { error: reason });
    return false;
  } finally {
    if (memoryAborts.get(id) === ctrl) memoryAborts.delete(id);
    memoryBusy.delete(id);
  }
}

export async function editMessage(id: string, msgId: string, text: string) {
  const c = chat(id);
  if (!c) return;
  const idx = c.messages.findIndex((m) => m.id === msgId);
  if (idx < 0) return;
  const msg = c.messages[idx];
  if (msg.role === "user") {
    abortChat(id);
    bumpMemoryEpoch(id);
    patch(id, (ch) => ({
      ...ch,
      messages: [...ch.messages.slice(0, idx), { ...msg, content: text.trim() }],
      ...applySnaps(rewindSnaps(ch.memorySnaps, idx)),
    }));
    await runReply(id, text.trim(), false);
  } else {
    patch(id, (ch) => ({
      ...ch,
      messages: ch.messages.map((m) => (m.id === msgId ? { ...m, content: text } : m)),
    }));
  }
}
