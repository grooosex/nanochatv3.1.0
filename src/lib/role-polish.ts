import type { Chat, Character } from "./types";

export type PolishCharOut = {
  name?: string;
  persona?: string;
  speech?: string;
  appearance?: string;
};

export type PolishJson = {
  overview?: string;
  opening?: string;
  characters?: PolishCharOut[];
};

const CHAR_KEYS = ["name", "persona", "speech", "appearance"] as const;
type CharKey = (typeof CHAR_KEYS)[number];

export function stripRoleOutput(text: string): string {
  let s = (text || "").trim();
  s = s.replace(/^```(?:json|text|markdown)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    try {
      const q = JSON.parse(s) as unknown;
      if (typeof q === "string") return q.trim();
    } catch {
      s = s.slice(1, -1).trim();
    }
  }
  return s;
}

function parseObject(raw: string): Record<string, unknown> | null {
  const s = stripRoleOutput(raw);
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const json = JSON.parse(s.slice(start, end + 1)) as unknown;
    if (json && typeof json === "object" && !Array.isArray(json)) return json as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return null;
}

function asText(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

export function parsePolishJson(text: string): PolishJson {
  const obj = parseObject(text);
  if (!obj) throw new Error("完善结果解析失败，请再试一次");
  const characters = Array.isArray(obj.characters)
    ? obj.characters.map((c) => {
        const row = c && typeof c === "object" ? (c as Record<string, unknown>) : {};
        return {
          name: asText(row.name),
          persona: asText(row.persona),
          speech: asText(row.speech),
          appearance: asText(row.appearance),
        };
      })
    : undefined;
  return {
    overview: asText(obj.overview),
    opening: asText(obj.opening),
    characters,
  };
}

export function extractFieldText(text: string, field: string): string {
  const stripped = stripRoleOutput(text);
  const json = parseObject(stripped);
  if (!json) return stripped;
  if (typeof json[field] === "string" && asText(json[field])) return asText(json[field]);
  const zh: Record<string, string> = {
    persona: "人设",
    speech: "说话方式",
    appearance: "外貌备忘",
    overview: "要求总览",
    opening: "开场场景",
    name: "名字",
  };
  const label = zh[field];
  if (label && typeof json[label] === "string" && asText(json[label])) return asText(json[label]);
  const first = Array.isArray(json.characters) ? json.characters[0] : null;
  if (first && typeof first === "object") {
    const v = (first as Record<string, unknown>)[field];
    if (typeof v === "string" && asText(v)) return asText(v);
  }
  if (typeof json.text === "string" && asText(json.text)) return asText(json.text);
  return stripped;
}

function mergeOneChar(c: Character, src?: PolishCharOut): Character {
  if (!src) return c;
  const nameLocked = Boolean(c.name.trim());
  const appearLocked = Boolean(c.appearance.trim());
  return {
    ...c,
    name: nameLocked ? c.name : src.name || c.name,
    persona: src.persona || c.persona,
    speech: src.speech || c.speech,
    appearance: appearLocked ? c.appearance : src.appearance || c.appearance,
  };
}

export function mergePolish(chat: Chat, json: PolishJson): Pick<Chat, "name" | "overview" | "opening" | "characters"> {
  const characters = chat.characters.map((c, i) => mergeOneChar(c, json.characters?.[i]));
  return {
    name: characters.map((c) => c.name).filter(Boolean).join("、") || chat.name,
    overview: json.overview || chat.overview,
    opening: json.opening || chat.opening,
    characters,
  };
}

export function applyRoleField(chat: Chat, field: string, text: string, charId?: string): Chat {
  const cleaned = extractFieldText(text, field);
  if (charId) {
    const key: CharKey = CHAR_KEYS.includes(field as CharKey) ? (field as CharKey) : "persona";
    return {
      ...chat,
      characters: chat.characters.map((c) => (c.id === charId ? { ...c, [key]: cleaned } : c)),
    };
  }
  if (field === "overview" || field === "opening" || field === "statusBar") {
    return { ...chat, [field]: cleaned };
  }
  return chat;
}

export function buildPolishUserContent(chat: Chat): string {
  const characters = chat.characters.map((c, i) => ({
    index: i + 1,
    name: c.name,
    nameLocked: Boolean(c.name.trim()),
    persona: c.persona,
    speech: c.speech,
    appearance: c.appearance,
    appearanceLocked: Boolean(c.appearance.trim()),
    personaVoices: Boolean(c.personaVoices),
  }));
  const extras = [...chat.extras, ...chat.characters.flatMap((c) => c.extras)]
    .map((e) => e.body.trim())
    .filter(Boolean);
  return JSON.stringify(
    {
      overview: chat.overview,
      opening: chat.opening,
      isMulti: chat.isMulti,
      characters,
      readOnlyExtras: extras.length ? extras : undefined,
      readOnlyMemory: chat.memory.trim() || undefined,
      locks: {
        filledName: "nameLocked 为 true 的名字必须原样返回",
        filledAppearance: "appearanceLocked 为 true 的外貌必须原样返回，一个 tag 都不要改",
        statusBar: "不要输出 statusBar",
        extras: "不要改新增栏",
      },
    },
    null,
    2,
  );
}
