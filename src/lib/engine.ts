import { grokOnce, grokStream } from "./grok-client";
import { chatContextBlock, fieldPolishHint, groupFormatHint, IMAGE_BG_RULES, IMAGE_MULTI_RULES, IMAGE_SHOT_RULES, imageApplyRules, imageLengthRules, imageWriteMaxTokens, multiInsertInstruction, roleSnapshot, splitChatPrompt, statusBarFor, voicePolishExtra } from "./prompts";
import { buildPolishUserContent, extractFieldText, parsePolishJson, stripRoleOutput } from "./role-polish";
import { formatUserForChat } from "./user-markup";
import { stripSpeakerPrefix } from "./rp-text";
import { replyContextText } from "./reply-markup.ts";
import { resolveImageWrite, imageWriteFields } from "./image-ai.ts";
import { buildNaiPayload } from "./nai";
import { sanitizeNaiTags, assignCharTags, extractJsonObject, resolveAbsentIds, presenceFromTags, legacyPresentIds } from "./nai-tags";
import { IMAGE_GEN_TIMEOUT_MS, RECENT_TURNS } from "./constants";
import { saveBlob, useApp } from "./store";
import { presetStyle } from "./st-preset";
import type { Chat, ChatMessage, GenImage, GrokModelId } from "./types";
import { randomSeed, uid } from "./utils";
import { imageFailText } from "./image-status";
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

function historyMessages(chat: Chat, upto?: number) {
  const msgs = chat.messages.slice(0, upto ?? chat.messages.length);
  const start = Math.max(0, msgs.length - recentWindow());
  const recent = msgs.slice(start);
  return recent
    .filter((m) => m.role !== "narrator" || m.content)
    .map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content:
        m.role === "user"
          ? formatUserForChat(m.content)
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

export async function generateNai(opts: {
  chat: Chat;
  grokTail: string;
  charTails?: Record<string, string>;
  seed?: number;
  apiKey: string;
  baseUrl: string;
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
  opts.onStart?.();
  const signal = withImageTimeout(opts.signal);
  let res: Response;
  try {
    res = await fetch("/api/nai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate",
        baseUrl: opts.baseUrl,
        apiKey: opts.apiKey,
        payload: { input: built.input, model: built.model, action: "generate", parameters: built.parameters },
      }),
      signal,
    });
  } catch (e) {
    throw new Error(imageFailText(e, opts.signal));
  }
  let data: { ok: boolean; image?: string; error?: string; status?: number };
  try {
    data = (await res.json()) as { ok: boolean; image?: string; error?: string; status?: number };
  } catch (e) {
    throw new Error(imageFailText(e, opts.signal));
  }
  if (!data.ok || !data.image) throw new Error(data.error || "生图失败");
  opts.onReceiving?.();
  await afterPaint();
  const bin = atob(data.image);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const blob = new Blob([arr], { type: "image/png" });
  const blobId = await saveBlob(blob);
  return { blobId, seed: built.seed, prompt: built.finalPrompt, blob };
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
