import { replyContextText, replyStoryText } from "./reply-markup.ts";

export const OPENING_USER = "（开始场景，请角色先开口）";
export const CONTINUE_USER =
  "用户这轮没有发言。这不是开场，也不是结束。接着上一拍已经发生的事往下演，把场上未完的动作、对话、时间往前推，不要空等用户开口，不要问「你想做什么」。需要用户开口或表态时你可以代写或给出选项。不要复述上一拍，不要跳到无关的新故事。";

export type UserMarkup = {
  facts: string[];
  directives: string[];
  rest: string;
  raw: string;
};

export function parseUserMarkup(raw: string): UserMarkup {
  const facts: string[] = [];
  const directives: string[] = [];
  let s = raw || "";
  s = s.replace(/《([^》]*)》/g, (_, inner: string) => {
    const t = inner.trim();
    if (t) directives.push(t);
    return " ";
  });
  s = s.replace(/[（(]([^）)]*)[）)]/g, (_, inner: string) => {
    const t = inner.trim();
    if (t) facts.push(t);
    return " ";
  });
  const rest = s.replace(/\s+/g, " ").trim();
  return { facts, directives, rest, raw };
}

function isShortBareCandidate(rest: string): boolean {
  const t = rest.trim();
  if (!t || t.length > 12) return false;
  if (/[？?！!。，,]/.test(t)) return false;
  return true;
}

export function needsMarkupFormat(raw: string): boolean {
  const t = (raw || "").trim();
  if (!t || t === OPENING_USER) return false;
  const p = parseUserMarkup(t);
  if (p.facts.length || p.directives.length) return true;
  return isShortBareCandidate(p.rest);
}

export function formatUserForChat(raw: string): string {
  const t = (raw || "").trim();
  if (!t) return CONTINUE_USER;
  if (t === OPENING_USER || !needsMarkupFormat(t)) return raw;
  const p = parseUserMarkup(t);
  const parts: string[] = [];
  if (p.facts.length) {
    parts.push(
      `【已发生】${p.facts.map((f) => `「${f}」`).join("、")}\n这是本拍必须达成的事实：过程可以写，回复结束时必须已经成立。不是口令。角色不是「听见」这些字；若内容本身是已经说出口的话，她听见的是那句话，不是括号。`,
    );
  }
  if (p.rest) {
    parts.push(
      `【用户其余原文】${p.rest}\n请判断：像对角色说的话 → 她听见的台词；像动作/场面补充（摸头、抱住、插入）→ 与【已发生】同一规则，短动词优先当动作。`,
    );
  }
  if (p.directives.length) {
    parts.push(
      `【作者指令】${p.directives.map((d) => `《${d}》`).join(" ")}\n角色听不见、不准念、不准写成「听到指示」。只执行与这轮文笔/剧情有关的；与画图、镜头、构图、tag 有关的忽略（生图会另处理）。`,
    );
  }
  if (p.facts.length && !p.rest) {
    parts.push("本条没有台词。角色只对已经发生的事实做身体和情绪反应，禁止写成听到一句话或听到指示。");
  }
  return parts.join("\n\n");
}

export function formatUserForImage(raw: string): string {
  const t = (raw || "").trim();
  if (!t || t === OPENING_USER) return "";
  const p = parseUserMarkup(t);
  if (!needsMarkupFormat(t)) return `用户：${t}`;
  const parts: string[] = [];
  if (p.facts.length) {
    parts.push(`用户已发生（镜头里必须是已经发生，不要写成准备、磨蹭或停在入口）：${p.facts.join("；")}`);
  }
  if (p.rest) parts.push(`用户其余：${p.rest}`);
  if (p.directives.length) {
    parts.push(
      `作者指令：${p.directives.map((d) => `《${d}》`).join(" ")}（只执行与画面有关的；文笔/篇幅/怎么写的忽略）`,
    );
  }
  return parts.join("\n") || `用户：${t}`;
}

export function recentSceneForImage(
  messages: { role: string; characterName?: string; content: string }[],
  n = 4,
): string {
  return messages
    .slice(-n)
    .map((m) => {
      if (m.role === "user") return formatUserForImage(m.content);
      if (m.role === "narrator") return m.content ? `旁白：${replyContextText(m.content)}` : "";
      return `${m.characterName || "角色"}：${replyContextText(m.content)}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** 本镜 = this assistant reply (or override); residual = last 4 bubbles before it. */
export function shotAndResidual(
  messages: { id: string; role: string; characterName?: string; content: string }[],
  msgId: string,
  shotOverride?: string,
): { shot: string; residual: string } {
  const idx = messages.findIndex((m) => m.id === msgId);
  const msg = idx >= 0 ? messages[idx] : undefined;
  const before = idx >= 0 ? messages.slice(0, idx) : messages;
  return {
    shot: (shotOverride ?? (msg ? replyStoryText(msg.content) : "")).trim(),
    residual: recentSceneForImage(before, 4),
  };
}

/** Immediate previous assistant/narrator only. Empty if that round has no successful image. */
export function previousRoundImagePrompt(
  messages: { id: string; role: string; images?: { status: string; prompt?: string }[] }[],
  msgId: string,
): string {
  const idx = messages.findIndex((m) => m.id === msgId);
  const from = idx >= 0 ? idx - 1 : messages.length - 1;
  for (let i = from; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "assistant" && m.role !== "narrator") continue;
    const img = [...(m.images || [])].reverse().find((g) => g.status === "done" && g.prompt);
    return (img?.prompt || "").trim();
  }
  return "";
}
