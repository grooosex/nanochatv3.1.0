import Dexie, { type Table } from "dexie";
import type {
  AppearancePreset,
  CharacterCard,
  Chat,
  FavoriteItem,
  FavGroup,
  Folder,
  HistoryItem,
  LlmAccount,
  Settings,
} from "./types";
import { DEFAULT_GROK, DEFAULT_LLM_PARAMS, DEFAULT_NAI_BASE, migrateGrokId, mergeLlmParams } from "./constants";
import { parseStPresets } from "./st-preset";
import { llmIdentity } from "./image-ai";

export const defaultSettings = (): Settings => ({
  grokModelId: DEFAULT_GROK,
  chatSource: "grok",
  llmBase: "",
  llmKey: "",
  llmConnected: false,
  llmModel: "",
  llmModels: [],
  llmStarred: [],
  llmAccounts: [],
  llmParams: { ...DEFAULT_LLM_PARAMS },
  llmIdentity: "",
  stPresets: [],
  stActiveId: null,
  stParamSnapshot: null,
  naiKey: "",
  naiBase: DEFAULT_NAI_BASE,
  naiConnected: false,
  cooldownUntil: 0,
  chatImage: true,
  imageModelId: null,
  imageModelPin: null,
  theme: "light",
});

class HuiyuDB extends Dexie {
  chats!: Table<Chat, string>;
  folders!: Table<Folder, string>;
  cards!: Table<CharacterCard, string>;
  appearances!: Table<AppearancePreset, string>;
  favorites!: Table<FavoriteItem, string>;
  favGroups!: Table<FavGroup, string>;
  history!: Table<HistoryItem, string>;
  images!: Table<{ id: string; blob: Blob }, string>;
  kv!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super("huiyu");
    this.version(1).stores({
      chats: "id, folderId, order, updatedAt",
      folders: "id, order",
      cards: "id, order",
      appearances: "id, order",
      favorites: "id, createdAt",
      history: "id, createdAt",
      images: "id",
      kv: "key",
    });
    this.version(2).stores({
      favGroups: "id, parentId, order",
    });
  }
}

export const db = new HuiyuDB();

function parseLlmAccounts(raw: unknown): LlmAccount[] {
  if (!Array.isArray(raw)) return [];
  const out: LlmAccount[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const a = row as Partial<LlmAccount>;
    if (typeof a.id !== "string" || typeof a.name !== "string") continue;
    out.push({
      id: a.id,
      name: a.name,
      base: typeof a.base === "string" ? a.base : "",
      key: typeof a.key === "string" ? a.key : "",
      starred: Array.isArray(a.starred) ? a.starred.filter((id): id is string => typeof id === "string") : undefined,
      model: typeof a.model === "string" ? a.model : undefined,
    });
  }
  return out;
}

export async function loadAll() {
  const [chats, folders, cards, appearances, favorites, favGroups, history, settingsRow] = await Promise.all([
    db.chats.toArray(),
    db.folders.toArray(),
    db.cards.toArray(),
    db.appearances.toArray(),
    db.favorites.toArray(),
    db.favGroups.toArray(),
    db.history.toArray(),
    db.kv.get("settings"),
  ]);
  const raw = (settingsRow?.value as Settings | undefined) ?? undefined;
  const stPresets = parseStPresets(raw?.stPresets);
  const stActiveId =
    typeof raw?.stActiveId === "string" && stPresets.some((p) => p.id === raw.stActiveId) ? raw.stActiveId : null;
  const settings = {
    ...defaultSettings(),
    ...(raw ?? {}),
    grokModelId: migrateGrokId(raw?.grokModelId),
    llmParams: mergeLlmParams(raw?.llmParams),
    llmModels: raw?.llmModels ?? [],
    llmStarred: raw?.llmStarred ?? [],
    llmAccounts: parseLlmAccounts(raw?.llmAccounts),
    stPresets,
    stActiveId,
    stParamSnapshot: stActiveId && raw?.stParamSnapshot ? mergeLlmParams(raw.stParamSnapshot) : null,
    chatSource: raw?.chatSource === "api" && raw?.llmConnected ? ("api" as const) : ("grok" as const),
    chatImage: raw?.chatImage !== false,
    imageModelId: typeof raw?.imageModelId === "string" ? raw.imageModelId : null,
    imageModelPin: typeof raw?.imageModelPin === "string" ? raw.imageModelPin : null,
    llmIdentity:
      typeof raw?.llmIdentity === "string" && raw.llmIdentity
        ? raw.llmIdentity
        : raw?.llmConnected && raw?.llmBase && raw?.llmKey
          ? llmIdentity(String(raw.llmBase), String(raw.llmKey))
          : "",
  };
  return { chats, folders, cards, appearances, favorites, favGroups, history, settings };
}

export async function putImage(id: string, blob: Blob) {
  await db.images.put({ id, blob });
}

export async function getImage(id: string) {
  const row = await db.images.get(id);
  return row?.blob ?? null;
}

export async function deleteImage(id: string) {
  await db.images.delete(id);
}

const urlCache = new Map<string, string>();

export async function imageUrl(id: string | undefined | null): Promise<string | null> {
  if (!id) return null;
  const cached = urlCache.get(id);
  if (cached) return cached;
  const blob = await getImage(id);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  return url;
}

export function rememberUrl(id: string, blob: Blob) {
  const prev = urlCache.get(id);
  if (prev) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  return url;
}

export function cachedUrl(id?: string | null) {
  return id ? urlCache.get(id) ?? null : null;
}
