import { grokOnce, grokStream } from "./grok-client";
import { chatContextBlock, fieldPolishHint, groupFormatHint, IMAGE_BG_RULES, IMAGE_MULTI_RULES, IMAGE_SHOT_RULES, imageApplyRules, imageLengthRules, imageWriteMaxTokens, multiInsertInstruction, roleSnapshot, splitChatPrompt, statusBarFor, voicePolishExtra } from "./prompts";
import { buildPolishUserContent, extractFieldText, parsePolishJson, stripRoleOutput } from "./role-polish";
import { formatUserForChat, formatUserImageTurn, standingDirectives } from "./user-markup";
import { stripSpeakerPrefix } from "./rp-text";
import { replyContextText } from "./reply-markup.ts";
import { resolveImageWrite, imageWriteFields } from "./image-ai.ts";
import { buildIdlecloudBody, buildNaiPayload } from "./nai";
import { sanitizeNaiTags, assignCharTags, extractJsonObject, resolveAbsentIds, presenceFromTags, legacyPresentIds } from "./nai-tags";
import { IMAGE_DRAW_TIMEOUT_MS, IMAGE_GEN_TIMEOUT_MS, NAI_HOP_TIMEOUT_MS, NAI_POLL_MS, RECENT_TURNS } from "./constants";
import { getImage } from "./idb";
import { saveBlob, useApp } from "./store";
import { presetStyle } from "./st-preset";
import type { Chat, ChatMessage, GenImage, GrokModelId } from "./types";
import { randomSeed, uid } from "./utils";
import { imageFailText } from "./image-status";
import { blobDataUrl, blobRawB64 } from "./ref-image";
import {
  clipMemoryText,
  foldIntervalMessages,
  formatMemoryDialog,
  isPlausibleMemory,
  MEMORY_PARAMS,
  nextAutoSlice,
} from "./chat-memory";

export function stripStatus(text: string) {
  const i = text.lastIndexOf("状态栏:");
  if (i < 0) return { body: text.trim(), status: "" };
  return { body: text.slice(0, i).trim(), status: text.slice(i).trim() };
}

type VisionPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export async function decorateVision<T extends { role: string; content: string }>(chat: Chat, msgs: T[]): Promise<(Omit<T, "content"> & { content: string | VisionPart[] })[]> {
  let last = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === "user") last = i;
  }
  if (last < 0) return msgs;
  const windowMsgs = chat.messages.slice(0, chat.messages.length);
  const start = Math.max(0, windowMsgs.length - recentWindow());
  const recent = windowMsgs.slice(start);
  let src: ChatMessage | undefined;
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].role === "user") {
      src = recent[i];
      break;
    }
  }
  const parts: VisionPart[] = [{ type: "text", text: msgs[last].content }];
  let added = false;
  if (src?.userImageBlobId) {
    const url = await blobDataUrl(src.userImageBlobId);
    if (url) {
      parts.push({
        type: "text",
        text: "下面这张就是用户这一轮发来的图，也就是现在的画面。用户的字是对着这张图说的。不要把它当成外貌备忘，也不要沿用上一拍的旧动作。",
      });
      parts.push({ type: "image_url", image_url: { url } });
      added = true;
    }
  }
  for (const c of chat.characters) {
    if (!c.lookBlobId) continue;
    const url = await blobDataUrl(c.lookBlobId);
    if (!url) continue;
    const name = c.name.trim() || "角色";
    parts.push({
      type: "text",
      text: `下面这张是${name}的外貌备忘，不是用户这轮发来的图，也不是现在的剧情画面。人设里「外貌备忘」写的就是她；这张图是那一栏的样子，用来认长相、发色瞳色、体型和衣服。剧情里已经换过的衣服或发型，以剧情为准，不要被这张图改回去。`,
    });
    parts.push({ type: "image_url", image_url: { url } });
    added = true;
  }
  if (!added) return msgs;
  return msgs.map((m, i) => (i === last ? { ...m, content: parts } : m));
}

function clampUnit(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function recentWindow() {
  const s = useApp.getState().settings;
  const turns = s.chatSource === "api" ? Math.max(4, s.llmParams.contextTurns) : RECENT_TURNS;
  return turns * 2;
}

export function foldWindow() {
  const s = useApp.getState().settings;
  const turns = s.chatSource === "api" ? Math.max(4, s.llmParams.contextTurns) : RECENT_TURNS;
  return { W: turns * 2, I: foldIntervalMessages(turns) };
}

function userHistoryContent(m: ChatMessage, last: boolean, standing: string[]) {
  if (m.userImageBlobId && last) return formatUserImageTurn(m.content, standing);
  if (m.userImageBlobId && !m.content.trim()) return "用户那一轮发过一张图，没有写字。那一轮已经过去。";
  return formatUserForChat(m.content, standing);
}

function historyMessages(chat: Chat, upto?: number) {
  const msgs = chat.messages.slice(0, upto ?? chat.messages.length);
  const start = Math.max(0, msgs.length - recentWindow());
  const recent = msgs.slice(start).filter((m) => m.role !== "narrator" || m.content);
  const standing = standingDirectives(chat);
  let lastUser = -1;
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].role === "user") {
      lastUser = i;
      break;
    }
  }
  return recent.map((m, i) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content:
        m.role === "user"
          ? userHistoryContent(m, i === lastUser, i === lastUser ? standing : [])
          : stripSpeakerPrefix(replyContextText(m.content), [
              m.characterName,
              chat.name,
              ...chat.characters.map((c) => c.name),
              "角色",
            ]),
    }));
}

export async function polishAll(chat: Chat, grokModelId: GrokModelId, instruction?: string) {
  const style = presetStyle(useApp.getState().settings, "polish", chat);
  const voice = voicePolishExtra(chat);
  const extra = [voice, instruction?.trim() || ""].filter(Boolean).join("\n\n") || undefined;
  const text = await grokOnce({
    task: instruction?.trim() ? "personalize" : "polish",
    grokModelId,
    extraSystem: extra,
    messages: [{ role: "user", content: buildPolishUserContent(chat) }],
    ...style,
    ...(voice ? { max_tokens: 6000 } : {}),
  });
  return parsePolishJson(text);
}

export async function polishField(
  chat: Chat,
  grokModelId: GrokModelId,
  field: string,
  instruction?: string,
  charId?: string,
  onDelta?: (t: string) => void,
) {
  const char = charId ? chat.characters.find((c) => c.id === charId) : undefined;
  const charIndex = charId ? chat.characters.findIndex((c) => c.id === charId) : -1;
  let current = "";
  if (char && (field === "name" || field === "persona" || field === "speech" || field === "appearance")) {
    current = char[field];
  } else if (field === "overview") current = chat.overview;
  else if (field === "opening") current = chat.opening;
  else if (field === "statusBar") current = chat.statusBar;
  const charLabel =
    char && chat.isMulti
      ? `角色${charIndex + 1}${char.name ? "「" + char.name + "」" : ""}`
      : char
        ? char.name
          ? `角色「${char.name}」`
          : "角色"
        : undefined;
  const voices = field === "persona" && Boolean(char?.personaVoices);
  const payload: Record<string, unknown> = {
    task: "field",
    grokModelId,
    extraSystem: fieldPolishHint({ field, instruction, current, charLabel, voices }),
    messages: [{ role: "user", content: roleSnapshot(chat) }],
    max_tokens: voices ? 4500 : 2000,
    ...presetStyle(useApp.getState().settings, "field", chat),
  };
  if (voices && onDelta) {
    const text = await grokStream(payload, (t) => onDelta(stripRoleOutput(t)));
    return extractFieldText(text, field);
  }
  const text = await grokOnce(payload);
  return extractFieldText(text, field);
}

export async function summarizeMemory(
  chat: Chat,
  grokModelId: GrokModelId,
  slice?: ChatMessage[],
  previous?: string,
  signal?: AbortSignal,
  onDelta?: (t: string) => void,
) {
  const keep = recentWindow();
  const older = slice ?? chat.messages.slice(0, Math.max(0, chat.messages.length - keep));
  if (older.length < 2) throw new Error("memory-skip");
  const dialog = formatMemoryDialog(older);
  if (!dialog.trim()) throw new Error("memory-skip");
  const s = useApp.getState().settings;
  const dest = resolveImageWrite(s.imageModelId);
  const payload: Record<string, unknown> = {
    task: "memory",
    grokModelId,
    ...imageWriteFields(s.imageModelId),
    params: MEMORY_PARAMS,
    max_tokens: MEMORY_PARAMS.maxTokens,
    messages: [
      {
        role: "user",
        content: `上一份备忘：\n${previous ?? chat.memory ?? "（无）"}\n\n需要收进去的对白：\n${dialog}`,
      },
    ],
  };
  if (!dest.split) payload.grokModelId = grokModelId;
  const text = await grokStream(payload, (t) => onDelta?.(t), signal);
  const clipped = clipMemoryText(text);
  if (!isPlausibleMemory(clipped)) throw new Error("memory-invalid");
  return clipped;
}

export function nextFoldSlice(chat: Chat) {
  const { W, I } = foldWindow();
  return nextAutoSlice(chat.messages.length, chat.memoryUntil || 0, W, I);
}

function imageBrief(
  chat: Chat,
  opts: { shot?: string; residual?: string; last?: string; prevScene?: string; turnUser?: string },
) {
  const names = chat.characters.map((c) => c.name).filter(Boolean).join("、");
  const insert = chat.isMulti && chat.promptMode === "insert";
  const format = insert
    ? multiInsertInstruction(chat.characters, "brief")
    : chat.isMulti
      ? "只输出英文 tag 一行，地点写最前。只给在场的人写 char1: ... char2: ...，不在场的整段省略。禁止 JSON，禁止 ENABLED。"
      : "只输出英文 tag 一行，地点写最前。禁止 JSON。";
  const shot = (opts.shot || "").trim();
  const residual = (opts.residual || opts.last || "").trim();
  const turnUser = chat.isMulti
    ? `这一轮用户（只用来判断谁在场；姿势、动作、衣服仍只认本镜）：\n${(opts.turnUser || "").trim() || "（无）"}\n\n`
    : "";
  return `角色：${names || "（未命名）"}
外貌已由用户写好，不要重复（含发色瞳色体型种族整套衣服）。
成人提示词加强：${chat.adultBoost ? "开" : "关"}
多人：${chat.isMulti ? "是" : "否"}　插入模式：${chat.promptMode}

${IMAGE_SHOT_RULES}

${IMAGE_BG_RULES}

${chat.isMulti ? `${IMAGE_MULTI_RULES}\n\n` : ""}写法：先抽出本镜里最显眼的动作/部位，写成具体真 tag，不要收成 ass focus、naughty face 这种安全词。空格真 tag，禁止下划线。不要写画师质量词和外貌。
用户已发生的动作优先于角色回里写软了的版本，必须写成已经发生，不要停在入口。
成人开着：把画面写成具体真 tag，不要保守。「不要硬塞」只挡住完全无关的内容。
成人关着：对白里看得见的仍写，不额外堆没写到的特写；完全没有性/血腥则不加 nsfw。
只输出标签，不要解释。

${imageLengthRules(chat.imageParams.model, chat.adultBoost)}

本镜（姿势、镜头、正在做的事只认这段）：
${shot || "（无）"}

${turnUser}${chat.memory.trim() ? `长期记忆（只继承没被推翻的状态，不含地点）：\n${chat.memory.trim()}\n` : ""}残留参考（不要继承已结束的动作/体位/朝向，也不要用它决定谁在场）：
${residual || "（无）"}

上一镜地点（对白看不出人在哪时才用，只借人所在的地方）：
${(opts.prevScene || "").trim() || "（无）"}

${format}`;
}

export function parseImageTagOutput(
  text: string,
  chat: Chat,
): { base: string; chars: Record<string, string>; absent: string[]; presence?: import("./nai-tags").PresenceUpdate } {
  const insert = chat.isMulti && chat.promptMode === "insert";
  const slots = chat.imageParams.characters.length ? chat.imageParams.characters : chat.characters;
  const roster = slots.map((c) => {
    const role = chat.characters.find((r) => r.id === c.id);
    return { id: c.id, name: (role?.name || c.name || "").trim() };
  });

  const json = extractJsonObject(text);
  if (json && (json.base != null || json.chars != null)) {
    const rawChars: Record<string, string> = {};
    const src = json.chars && typeof json.chars === "object" ? (json.chars as Record<string, unknown>) : {};
    for (const [k, v] of Object.entries(src)) {
      rawChars[k] = typeof v === "string" ? v : v == null ? "" : JSON.stringify(v);
    }
    const { mapped, leftover } = assignCharTags(rawChars, roster);
    const base = sanitizeNaiTags([String(json.base || ""), leftover].filter(Boolean).join(", "));
    const absent = resolveAbsentIds(json.absent, roster);
    const presence = presenceFromTags(Object.keys(mapped), absent);
    if (!insert) {
      const absentSet = new Set(absent);
      const extras = Object.entries(mapped)
        .filter(([id]) => !absentSet.has(id))
        .map(([, tags]) => tags)
        .filter(Boolean);
      return { base: sanitizeNaiTags([base, ...extras].filter(Boolean).join(", ")), chars: {}, absent, presence };
    }
    return { base, chars: mapped, absent, presence };
  }

  const legacy = chat.isMulti ? legacyPresentIds(text, roster) : undefined;
  return {
    base: sanitizeNaiTags(text.replace(/\n/g, ", ")),
    chars: {},
    absent: [],
    presence: legacy ? { mode: "exact" as const, ids: legacy } : undefined,
  };
}

export async function writeImageTags(
  chat: Chat,
  lastText: string,
  grokModelId: GrokModelId,
  shotText?: string,
  prevScene?: string,
  signal?: AbortSignal,
  turnUser?: string,
) {
  const extra = [
    chat.adultBoost
      ? "成人提示词加强：开。这是最高优先级之一。对白里的动作、部位、体液必须写成具体真 tag，不要收成 ass focus / naughty face。无关内容仍不要加。只输出标签，不要解释。"
      : "成人提示词加强：关。对白里看得见的仍写具体真 tag，不要额外堆没写到的器官特写。完全没有性/血腥的场面不要加 nsfw。只输出标签，不要解释。",
    imageLengthRules(chat.imageParams.model, chat.adultBoost),
    chat.isMulti ? IMAGE_MULTI_RULES : "",
    imageApplyRules(chat),
  ]
    .filter(Boolean)
    .join("\n\n");
  const imageModelId = useApp.getState().settings.imageModelId;
  const dest = resolveImageWrite(imageModelId);
  const payload: Record<string, unknown> = {
    task: "image",
    extraSystem: extra,
    messages: [{ role: "user", content: imageBrief(chat, { shot: shotText, residual: lastText, prevScene, turnUser }) }],
    max_tokens: imageWriteMaxTokens(chat.imageParams.model),
    ...imageWriteFields(imageModelId),
  };
  if (!dest.split) payload.grokModelId = grokModelId;
  const text = await grokOnce(payload, withImageTimeout(signal));
  return parseImageTagOutput(text, chat);
}

export { genPhaseLabel, imageFailText, prettyImageError, settleStuckImages } from "./image-status";

function withImageTimeout(user?: AbortSignal) {
  const timeout = AbortSignal.timeout(IMAGE_GEN_TIMEOUT_MS);
  return user ? AbortSignal.any([user, timeout]) : timeout;
}

export function afterPaint() {
  return new Promise<void>((r) => requestAnimationFrame(() => r()));
}

type NaiHop = {
  ok?: boolean;
  error?: string;
  image?: string;
  jobId?: string;
  statusUrl?: string;
  fileUrl?: string;
  pending?: boolean;
  v5?: {
    confirm_url?: string;
    confirmation_required?: boolean;
    sha256?: string;
    size_bytes?: number;
  };
};

function sleepMs(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function isHopTimeout(e: unknown) {
  return e instanceof Error && e.name === "HopTimeout";
}

async function naiHop(body: Record<string, unknown>, signal?: AbortSignal): Promise<NaiHop> {
  const hop = AbortSignal.timeout(NAI_HOP_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, hop]) : hop;
  let res: Response;
  try {
    res = await fetch("/api/nai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: combined,
    });
  } catch (e) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const name = e instanceof Error || e instanceof DOMException ? e.name : "";
    if (name === "AbortError" || name === "TimeoutError") {
      const err = new Error("中转站超时，请稍后重试");
      err.name = "HopTimeout";
      throw err;
    }
    throw new Error(imageFailText(e, signal));
  }
  const raw = await res.text();
  let data: NaiHop;
  try {
    data = JSON.parse(raw) as NaiHop;
  } catch {
    throw new Error("中转站返回了异常页面");
  }
  if (!data.ok) throw new Error(data.error || "生图失败");
  return data;
}

async function imageFromB64(b64: string) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const blob = new Blob([arr], { type: "image/png" });
  const blobId = await saveBlob(blob);
  return { blobId, blob };
}

export async function generateNai(opts: {
  chat: Chat;
  grokTail: string;
  charTails?: Record<string, string>;
  seed?: number;
  apiKey: string;
  baseUrl: string;
  turnImageBlobId?: string;
  onStart?: () => void;
  onReceiving?: () => void;
  signal?: AbortSignal;
}) {
  const built = buildNaiPayload({
    params: opts.chat.imageParams,
    grokTail: opts.grokTail,
    charTails: opts.charTails,
    insertMode: opts.chat.promptMode,
    seed: opts.seed,
  });
  const blobId = opts.chat.imageParams.img2imgBlobId || opts.turnImageBlobId || "";
  let img2img: { image: string; strength: number; noise: number } | undefined;
  if (blobId) {
    const blob = await getImage(blobId);
    if (blob) {
      img2img = {
        image: await blobRawB64(blob),
        strength: clampUnit(opts.chat.imageParams.img2imgStrength ?? 0.7, 0.01, 0.99),
        noise: clampUnit(opts.chat.imageParams.img2imgNoise ?? 0, 0, 0.99),
      };
    }
  }
  const payload = buildIdlecloudBody(built, opts.chat.imageParams, opts.chat.promptMode, img2img);
  opts.onStart?.();
  const finish = async (b64: string) => {
    opts.onReceiving?.();
    await afterPaint();
    const saved = await imageFromB64(b64);
    return { blobId: saved.blobId, seed: built.seed, prompt: built.finalPrompt, blob: saved.blob };
  };
  const base = { baseUrl: opts.baseUrl, apiKey: opts.apiKey };
  const started = Date.now();
  const timedOut = () => Date.now() - started >= IMAGE_DRAW_TIMEOUT_MS;
  let submit: NaiHop | undefined;
  while (!submit) {
    if (timedOut()) throw new Error("生图超时");
    try {
      submit = await naiHop({ ...base, action: "submit", payload }, opts.signal);
    } catch (e) {
      if (isHopTimeout(e)) continue;
      throw e;
    }
  }
  if (submit.image) return finish(submit.image);
  if (!submit.jobId && !submit.statusUrl && !submit.fileUrl) throw new Error("中转站没有返回任务");
  let statusUrl = submit.statusUrl;
  let fileUrl = submit.fileUrl;
  let v5 = submit.v5;
  while (!timedOut()) {
    if (fileUrl) {
      try {
        const fetched = await naiHop({ ...base, action: "fetch", fileUrl, v5 }, opts.signal);
        if (fetched.image) return finish(fetched.image);
      } catch (e) {
        if (!isHopTimeout(e)) throw e;
        continue;
      }
      fileUrl = undefined;
    }
    let poll: NaiHop;
    try {
      poll = await naiHop({ ...base, action: "poll", jobId: submit.jobId, statusUrl }, opts.signal);
    } catch (e) {
      if (isHopTimeout(e)) continue;
      throw e;
    }
    if (poll.statusUrl) statusUrl = poll.statusUrl;
    if (poll.image) return finish(poll.image);
    if (poll.fileUrl) {
      fileUrl = poll.fileUrl;
      v5 = poll.v5;
      continue;
    }
    const left = IMAGE_DRAW_TIMEOUT_MS - (Date.now() - started);
    if (left <= 0) break;
    await sleepMs(Math.min(NAI_POLL_MS, left), opts.signal);
  }
  throw new Error("生图超时");
}

export function parseGroup(text: string): { name: string; content: string; narrator?: boolean }[] {
  const parts = text.split(/<<<(?:CHAR:([^>]+)|NARRATOR)>>>/g);
  if (parts.length === 1) return [{ name: "", content: text.trim() }];
  const out: { name: string; content: string; narrator?: boolean }[] = [];
  // split with capturing groups: [pre, name1, body1, name2, body2...]
  // Our regex has one group for CHAR name. NARATOR has no group so undefined.
  const tokens = text.split(/(<<<CHAR:[^>]+>>>|<<<NARRATOR>>>)/);
  let current: { name: string; narrator?: boolean } | null = null;
  let buf = "";
  const flush = () => {
    if (current && buf.trim()) out.push({ ...current, content: buf.trim() });
    buf = "";
  };
  for (const tok of tokens) {
    const char = tok.match(/^<<<CHAR:([^>]+)>>>$/);
    if (char) {
      flush();
      current = { name: char[1].trim() };
      continue;
    }
    if (tok === "<<<NARRATOR>>>") {
      flush();
      current = { name: "旁白", narrator: true };
      continue;
    }
    buf += tok;
  }
  flush();
  return out.length ? out : [{ name: "", content: text.trim() }];
}

export function makeUserMessage(content: string): ChatMessage {
  return { id: uid("m_"), role: "user", content, images: [], createdAt: Date.now() };
}

export function makeAssistantPlaceholder(chat: Chat): ChatMessage {
  const names = chat.characters.map((c) => c.name).filter(Boolean);
  return {
    id: uid("m_"),
    role: "assistant",
    characterName: chat.isMulti && chat.multiMode === "together" ? names.join("、") : names[0],
    characterId: chat.characters[0]?.id,
    content: "",
    images: [],
    createdAt: Date.now(),
  };
}

export function makeImageRecord(partial: Partial<GenImage> = {}): GenImage {
  return {
    id: uid("g_"),
    prompt: "",
    charTails: {},
    negative: "",
    seed: randomSeed(),
    model: "nai-diffusion-4-5-full",
    width: 832,
    height: 1216,
    steps: 28,
    sampler: "k_euler_ancestral",
    status: "uploading",
    createdAt: Date.now(),
    ...partial,
  };
}

export { statusBarFor, historyMessages, groupFormatHint, chatContextBlock, splitChatPrompt };
