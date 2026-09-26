/** NovelAI tag cleanup: spaces not underscores, drop quality/artist/age junk. */

import type { ImageParams } from "./types";

const FACE_KEEP = /[\^:;><]_[^,\s]|_[wWmMoO]_|\\m\/|\^_\^|:_\^|;_;/;

const FORBIDDEN_EXACT = new Set([
  "masterpiece",
  "best quality",
  "amazing quality",
  "absurdres",
  "very aesthetic",
  "highres",
  "newest",
  "4k",
  "8k",
  "8k wallpaper",
  "extremely detailed",
  "ultra-detailed",
  "cinematic",
  "no text",
  "worst quality",
  "low quality",
  "artist collaboration",
  "loli",
  "shota",
  "child",
  "teen",
  "underage",
  "toddler",
  "kid",
  "children",
]);

const AUTO_TAGS = new Set(["uncensored", "full body", "rating:sensitive", "rating: sensitive", "fur dataset"]);

function isForbidden(tag: string) {
  const t = tag.trim().toLowerCase();
  if (!t) return true;
  if (FORBIDDEN_EXACT.has(t)) return true;
  if (/\bartist\s*:/.test(t)) return true;
  if (/^year 202\d$/.test(t)) return true;
  if (/^year_202\d$/.test(t)) return true;
  return false;
}

function unSnake(tag: string) {
  const t = tag.trim();
  if (t.length < 10 && FACE_KEEP.test(t)) return t;
  return t.replace(/_/g, " ");
}

export function splitNaiTags(raw: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inWeight = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === ":" && raw[i + 1] === ":") {
      inWeight = !inWeight;
      buf += "::";
      i++;
      continue;
    }
    if (c === "," && !inWeight) {
      if (buf.trim()) out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += c;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function normKey(tag: string) {
  return unSnake(tag).replace(/\s+/g, " ").trim().toLowerCase();
}

export function sanitizeNaiTags(raw: string, opts?: { stripForbidden?: boolean }): string {
  let s = (raw || "").trim();
  if (!s) return "";
  s = s.replace(/^```(?:json|text|tags)?\s*/i, "").replace(/\s*```$/i, "").trim();
  s = s.replace(/^(?:here are (?:the )?tags:?|tags:?|prompt:?)\s*/i, "");
  s = s.replace(/^["']|["']$/g, "").trim();
  if (s.includes("{") && /"base"\s*:|"chars"\s*:/.test(s)) s = flattenMaybeJson(s);

  const strip = opts?.stripForbidden !== false;
  const seen = new Set<string>();
  const out: string[] = [];
  for (let part of splitNaiTags(s)) {
    part = unSnake(part).replace(/\s+/g, " ").trim();
    if (!part) continue;
    if (
      !/^[-0-9.]+::/.test(part) &&
      !part.startsWith("Text:") &&
      !part.startsWith("source#") &&
      !part.startsWith("target#") &&
      !part.startsWith("mutual#")
    ) {
      part = part.toLowerCase();
    }
    if (strip && isForbidden(part)) continue;
    const key = part.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(part);
  }
  return out.join(", ");
}

/** Pull the Grok-added mid tags out of a stored prompt that may still be the full front+mid+tail+back string. */
export function extractGrokTail(stored: string, params: ImageParams): string {
  const cleaned = sanitizeNaiTags(flattenMaybeJson(stored));
  if (!cleaned) return "";
  const drop = new Set<string>();
  for (const src of [params.promptFront, params.promptMid, params.promptBack]) {
    for (const t of splitNaiTags(src || "")) {
      const k = normKey(t);
      if (k) drop.add(k);
    }
  }
  for (const t of AUTO_TAGS) drop.add(t);
  const kept = splitNaiTags(cleaned).filter((t) => !drop.has(normKey(t)) && !isForbidden(t));
  return kept.join(", ");
}

export function extractJsonObject(raw: string): Record<string, unknown> | null {
  let s = (raw || "").trim();
  s = s.replace(/^```(?:json|text|tags)?\s*/i, "").replace(/\s*```$/i, "").trim();
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

function asTagStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(asTagStr).filter(Boolean).join(", ");
  if (typeof v === "object") return Object.values(v).map(asTagStr).filter(Boolean).join(", ");
  return String(v);
}

export function flattenMaybeJson(raw: string): string {
  const json = extractJsonObject(raw);
  if (!json || (!("base" in json) && !("chars" in json))) return raw;
  const parts = [asTagStr(json.base)];
  const chars = json.chars;
  if (chars && typeof chars === "object") {
    for (const v of Object.values(chars as Record<string, unknown>)) parts.push(asTagStr(v));
  }
  return parts.filter(Boolean).join(", ");
}

export function assignCharTags(
  rawChars: Record<string, string>,
  characters: { id: string; name: string }[],
): { mapped: Record<string, string>; leftover: string } {
  const mapped: Record<string, string> = {};
  const used = new Set<string>();
  const unmatched: string[] = [];

  const resolve = (key: string): string | undefined => {
    const k = key.trim().toLowerCase();
    if (!k) return undefined;
    const byName = characters.find((c) => !used.has(c.id) && c.name && c.name.toLowerCase() === k);
    if (byName) return byName.id;
    const byId = characters.find((c) => !used.has(c.id) && c.id.toLowerCase() === k);
    if (byId) return byId.id;
    const m = k.match(/^(?:char|character|角色)\s*[_#.\-]?\s*(\d+)$/i);
    if (m) {
      const c = characters[Number(m[1]) - 1];
      if (c && !used.has(c.id)) return c.id;
    }
    return undefined;
  };

  for (const [key, val] of Object.entries(rawChars)) {
    const tags = sanitizeNaiTags(val);
    if (!tags) continue;
    const id = resolve(key);
    if (id) {
      mapped[id] = tags;
      used.add(id);
    } else unmatched.push(tags);
  }
  return { mapped, leftover: unmatched.join(", ") };
}

export function resolveAbsentIds(
  absent: unknown,
  characters: { id: string; name: string }[],
): string[] {
  const names = Array.isArray(absent) ? absent.map((x) => String(x || "").trim()).filter(Boolean) : [];
  const ids: string[] = [];
  for (const n of names) {
    const k = n.toLowerCase();
    const hit =
      characters.find((c) => c.name && c.name.toLowerCase() === k) ||
      characters.find((c) => c.id.toLowerCase() === k) ||
      (() => {
        const m = k.match(/^(?:char|character|角色)\s*[_#.\-]?\s*(\d+)$/i);
        return m ? characters[Number(m[1]) - 1] : undefined;
      })();
    if (hit && !ids.includes(hit.id)) ids.push(hit.id);
  }
  return ids;
}

export type PresenceUpdate = { mode: "exact"; ids: string[] } | { mode: "off"; ids: string[] };

export function presenceFromTags(mappedIds: string[], absentIds: string[]): PresenceUpdate | undefined {
  if (mappedIds.length) {
    const absent = new Set(absentIds);
    return { mode: "exact", ids: mappedIds.filter((id) => !absent.has(id)) };
  }
  if (absentIds.length) return { mode: "off", ids: absentIds };
  return undefined;
}

export function legacyPresentIds(text: string, characters: { id: string }[]): string[] | undefined {
  const found = new Set<number>();
  const re = /\bchar(?:acter)?\s*(\d+)\s*:/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) found.add(Number(m[1]));
  if (!found.size) return undefined;
  const ids: string[] = [];
  for (const n of [...found].sort((a, b) => a - b)) {
    const c = characters[n - 1];
    if (c && !ids.includes(c.id)) ids.push(c.id);
  }
  return ids;
}
