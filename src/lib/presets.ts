import { defaultPureParams, joinPromptParts } from "./constants";
import type { FavoriteItem, ImageParams } from "./types";
import { uid } from "./utils";

export function presetNameFrom(params: ImageParams) {
  const t = joinPromptParts(params.promptFront, params.promptMid, params.promptBack).replace(/\s+/g, " ").trim();
  if (!t) return "未命名";
  return t.length > 28 ? t.slice(0, 28) + "…" : t;
}

export function migrateFavorite(raw: unknown): FavoriteItem | null {
  if (!raw || typeof raw !== "object") return null;
  const f = raw as Partial<FavoriteItem> & { prompt?: string; seed?: number };
  if (!f.id) return null;
  if (f.params && typeof f.name === "string") {
    return {
      id: f.id,
      name: f.name || "未命名",
      params: f.params,
      blobId: f.blobId,
      createdAt: f.createdAt || Date.now(),
      groupId: typeof f.groupId === "string" ? f.groupId : null,
      starred: f.starred === true,
      ...(typeof f.order === "number" ? { order: f.order } : {}),
    };
  }
  return {
    id: f.id || uid("fav_"),
    name: String(f.prompt || "").slice(0, 28) || "未命名",
    params: { ...defaultPureParams(), promptMid: f.prompt || "", seed: f.seed ?? null },
    blobId: f.blobId,
    createdAt: f.createdAt || Date.now(),
    groupId: null,
    ...(typeof f.order === "number" ? { order: f.order } : {}),
  };
}

export function promptPreview(p: ImageParams) {
  if (p.merged) return p.promptMid;
  return joinPromptParts(p.promptFront, p.promptMid, p.promptBack);
}
