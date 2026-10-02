import {
  DEFAULT_GROK,
  DEFAULT_LLM_PARAMS,
  DEFAULT_NAI_BASE,
  DEFAULT_STATUS_BAR,
  NAI_MODELS,
  SAMPLERS,
  NOISE_SCHEDULES,
  defaultImageParams,
  defaultPureParams,
  emptyCharacter,
  migrateGrokId,
} from "./constants.ts";
import type {
  AppearancePreset,
  AppDataDump,
  Character,
  CharacterCard,
  Chat,
  ChatMessage,
  ExtraField,
  Folder,
  GenImage,
  HistoryItem,
  ImageParams,
  NaiModelId,
  NoiseSchedule,
  SamplerId,
  Settings,
} from "./types";
import { uid } from "./utils.ts";

export type LegacyLoad = {
  dump: AppDataDump;
  currentId: string | null;
  pureParams: ImageParams;
};

function baseSettings(): Settings {
  return {
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
    stPresets: [],
    stActiveId: null,
    stParamSnapshot: null,
    naiKey: "",
    naiBase: DEFAULT_NAI_BASE,
    naiConnected: false,
    cooldownUntil: 0,
    chatImage: true,
    theme: "light",
  };
}

function rec(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function isLegacyArchive(raw: unknown): boolean {
  const o = rec(raw);
  if (!o) return false;
  if (o.kind === "huiyu-archive") return true;
  if (Array.isArray(o.roles) && !Array.isArray(o.chats)) return true;
  return false;
}

export function pickArchiveJson(files: Record<string, Uint8Array>): Uint8Array | undefined {
  const names = ["huiyu.json", "data.json", "archive.json"];
  const entries = Object.entries(files);
  for (const want of names) {
    const hit = entries.find(([k]) => {
      const n = k.replace(/\\/g, "/").replace(/^\.\//, "").split("/").pop();
      return n === want;
    });
    if (hit) return hit[1];
  }
  return undefined;
}

export function collectPngs(files: Record<string, Uint8Array>): Map<string, Uint8Array> {
  const out = new Map<string, Uint8Array>();
  for (const [path, data] of Object.entries(files)) {
    const base = path.replace(/\\/g, "/").split("/").pop() || "";
    const m = /^(.*)\.png$/i.exec(base);
    if (!m) continue;
    let id = m[1];
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep */
    }
    if (id) out.set(id, data);
  }
  return out;
}

export function blobFromBase64(raw: string): Blob | null {
  try {
    let b64 = raw.includes("base64,") ? raw.split("base64,").pop() || "" : raw;
    b64 = b64.replace(/\s+/g, "");
    if (b64.length < 32) return null;
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return new Blob([out], { type: "image/png" });
  } catch {
    return null;
  }
}

export function collectEmbeddedImages(raw: unknown): Map<string, Blob> {
  const out = new Map<string, Blob>();
  const o = rec(raw);
  const images = rec(o?.images);
  if (!images) return out;
  for (const [id, val] of Object.entries(images)) {
    if (typeof val !== "string") continue;
    const blob = blobFromBase64(val);
    if (blob) out.set(id, blob);
  }
  return out;
}

function migrateNaiModel(id: unknown): NaiModelId {
  const s = str(id);
  if (NAI_MODELS.some((m) => m.id === s)) return s as NaiModelId;
  return "nai-diffusion-4-5-full";
}

function migrateSampler(id: unknown): SamplerId {
  const s = str(id);
  if (SAMPLERS.some((m) => m.id === s)) return s as SamplerId;
  return "k_euler_ancestral";
}

function migrateNoise(id: unknown): NoiseSchedule {
  const s = str(id);
  if (NOISE_SCHEDULES.some((m) => m.id === s)) return s as NoiseSchedule;
  return "karras";
}

function extrasFrom(raw: unknown): ExtraField[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e, i) => {
    const o = rec(e) || {};
    const body = str(o.body) || str(o.text) || str(o.title);
    return {
      id: str(o.id, `ex_${i}`),
      body,
      ...(o.applyImage === true ? { applyImage: true } : {}),
      ...(o.emphasize === true ? { emphasize: true } : {}),
    };
  });
}

export function convertImageParams(raw: unknown): ImageParams {
  const base = defaultImageParams();
  const o = rec(raw);
  if (!o) return base;
  const seedRaw = o.seed;
  let seed: number | null = null;
  if (typeof seedRaw === "number" && Number.isFinite(seedRaw)) seed = seedRaw;
  else if (typeof seedRaw === "string" && seedRaw.trim() !== "") {
    const n = Number(seedRaw);
    seed = Number.isFinite(n) ? n : null;
  }

  const characters = Array.isArray(o.characters)
    ? o.characters.map((c, i) => {
        const ch = rec(c) || {};
        return {
          id: str(ch.id, `char_${i}`),
          name: str(ch.name),
          enabled: ch.enabled !== false,
          prompt: str(ch.prompt),
          uc: str(ch.uc),
          x: num(ch.x, 0.5),
          y: num(ch.y, 0.5),
        };
      })
    : [];

  return {
    ...base,
    promptFront: str(o.promptFront, base.promptFront),
    promptMid: str(o.promptMid, base.promptMid),
    promptBack: str(o.promptBack, base.promptBack),
    merged: bool(o.merged, bool(o.unifiedPrompt)),
    sensitive: bool(o.sensitive),
    uncensored: bool(o.uncensored, bool(o.noCensor)),
    fullBody: bool(o.fullBody),
    tagSuggest: o.tagSuggest !== false,
    negative: str(o.negative, base.negative),
    ucPreset: ["heavy", "light", "human", "custom"].includes(str(o.ucPreset))
      ? (o.ucPreset as ImageParams["ucPreset"])
      : "heavy",
    model: migrateNaiModel(o.model),
    width: num(o.width, base.width),
    height: num(o.height, base.height),
    sampler: migrateSampler(o.sampler),
    noiseSchedule: migrateNoise(o.noiseSchedule),
    steps: num(o.steps, base.steps),
    scale: num(o.scale ?? o.cfg, base.scale),
    cfgRescale: num(o.cfgRescale, base.cfgRescale),
    seed,
    seedLocked: bool(o.seedLocked),
    stepsLocked: bool(o.stepsLocked),
    scaleLocked: bool(o.scaleLocked, bool(o.cfgLocked)),
    cfgRescaleLocked: bool(o.cfgRescaleLocked),
    varietyPlus: bool(o.varietyPlus),
    decrisper: bool(o.decrisper),
    useCoords: bool(o.useCoords),
    characters,
  };
}

function charactersFromDraft(draft: Record<string, unknown>, imageParams: ImageParams): Character[] {
  const multi = bool(draft.multi);
  const cast = Array.isArray(draft.cast) ? draft.cast : [];
  const fromCast = (c: unknown, i: number): Character => {
    const o = rec(c) || {};
    const id = str(o.id, emptyCharacter(i + 1).id);
    const pc = imageParams.characters.find((x) => x.id === id || (o.name && x.name === o.name));
    const ch = emptyCharacter(i + 1);
    return {
      ...ch,
      id,
      name: str(o.name),
      persona: str(o.persona),
      speech: str(o.speech),
      appearance: str(o.appearance),
      extras: extrasFrom(o.extras),
      personaVoices: bool(o.personaVoices),
      imageEnabled: o.away === true ? false : o.imageEnabled !== false,
      prompt: str(o.prompt, pc?.prompt ?? ""),
      uc: str(o.uc, pc?.uc ?? ""),
      x: num(o.x ?? pc?.x, 0.5),
      y: num(o.y ?? pc?.y, 0.5),
    };
  };

  if (multi && cast.length) return cast.map(fromCast);

  const first = rec(cast[0]);
  const pc = imageParams.characters[0];
  const ch = emptyCharacter(1);
  return [
    {
      ...ch,
      id: str(first?.id, pc?.id || ch.id),
      name: str(draft.name) || str(first?.name),
      persona: str(draft.persona) || str(first?.persona),
      speech: str(draft.speech) || str(first?.speech),
      appearance: str(draft.appearance) || str(first?.appearance),
      extras: extrasFrom(first?.extras),
      personaVoices: bool(first?.personaVoices ?? draft.personaVoices),
      prompt: str(first?.prompt, pc?.prompt ?? ""),
      uc: str(first?.uc, pc?.uc ?? ""),
      x: num(first?.x ?? pc?.x, 0.5),
      y: num(first?.y ?? pc?.y, 0.5),
    },
  ];
}

function alignImageChars(params: ImageParams, characters: Character[]): ImageParams {
  if (params.characters.length) {
    return {
      ...params,
      characters: params.characters.map((pc) => {
        const match = characters.find((c) => c.id === pc.id) || characters.find((c) => c.name && c.name === pc.name);
        return match ? { ...pc, name: pc.name || match.name, id: match.id } : pc;
      }),
    };
  }
  return {
    ...params,
    characters: characters.map((c) => ({
      id: c.id,
      name: c.name,
      enabled: c.imageEnabled,
      prompt: c.prompt || c.appearance,
      uc: c.uc,
      x: c.x,
      y: c.y,
    })),
  };
}

function convertGenImage(img: unknown, createdAt: number): GenImage {
  const o = rec(img) || {};
  const id = str(o.id, uid("img_"));
  return {
    id,
    blobId: str(o.blobId, id),
    prompt: str(o.prompt),
    charTails: undefined,
    negative: str(o.negative),
    seed: num(o.seed, 0),
    model: migrateNaiModel(o.model),
    width: num(o.width, 832),
    height: num(o.height, 1216),
    steps: num(o.steps, 28),
    sampler: migrateSampler(o.sampler),
    status: "done",
    createdAt,
  };
}

function convertMessage(m: unknown, characters: Character[]): ChatMessage {
  const o = rec(m) || {};
  const createdAt = num(o.createdAt, Date.now());
  const imagesRaw = Array.isArray(o.images) && o.images.length ? o.images : o.image ? [o.image] : [];
  const speakerId = str(o.speakerId) || undefined;
  const speakerName = str(o.speakerName) || undefined;
  const match = speakerId
    ? characters.find((c) => c.id === speakerId)
    : speakerName
      ? characters.find((c) => c.name === speakerName)
      : undefined;
  const role: ChatMessage["role"] =
    o.role === "user" ? "user" : o.role === "narrator" ? "narrator" : "assistant";
  return {
    id: str(o.id, uid("msg_")),
    role,
    characterId: match?.id ?? speakerId,
    characterName: match?.name || speakerName,
    content: str(o.content, str(o.text)),
    images: imagesRaw.map((img) => convertGenImage(img, createdAt)),
    createdAt,
  };
}

function convertRole(role: unknown, grokModelId: Chat["grokModelId"]): Chat {
  const o = rec(role) || {};
  const draft = rec(o.draft) || {};
  let imageParams = convertImageParams(o.imageParams);
  if (o.customTagSuggest === false) imageParams = { ...imageParams, tagSuggest: false };
  const characters = charactersFromDraft(draft, imageParams);
  imageParams = alignImageChars(imageParams, characters);
  const memoryObj = rec(o.memory);
  const memory = typeof o.memory === "string" ? o.memory : str(memoryObj?.text);
  const memoryUntil = num(memoryObj?.covered ?? o.memoryUntil, 0);
  const statusBar = str(draft.statusText, str(draft.statusBar));
  return {
    id: str(o.id, uid("chat_")),
    folderId: typeof o.folderId === "string" ? o.folderId : null,
    name: str(o.name, str(draft.name, "未命名")),
    remark: str(o.note, str(o.remark)),
    starred: bool(o.starred),
    order: num(o.order, num(o.sort, 0)),
    createdAt: num(o.createdAt, Date.now()),
    updatedAt: num(o.updatedAt, Date.now()),
    isDraft: false,
    grokModelId,
    isMulti: bool(draft.multi),
    multiMode: draft.chatMode === "group" ? "group" : "together",
    promptMode: draft.promptPack === "split" ? "insert" : "legacy",
    adultBoost: bool(draft.adultPrompt, bool(draft.adultBoost)),
    canGen: o.canGen !== false,
    statusBarOn: bool(draft.statusOn, bool(draft.statusBarOn)),
    statusBar: statusBar || (bool(draft.statusOn) ? DEFAULT_STATUS_BAR : ""),
    overview: str(draft.overview),
    opening: str(draft.scene, str(draft.opening)),
    extras: extrasFrom(draft.extras),
    memory,
    memoryUntil,
    memoryFoldAt: memoryUntil,
    memorySnaps: memory
      ? [{ covered: memoryUntil, text: memory, foldAt: memoryUntil }]
      : [],
    characters,
    imageParams,
    messages: Array.isArray(o.messages) ? o.messages.map((m) => convertMessage(m, characters)) : [],
    avatarBlobId: str(o.avatarImageId, str(o.avatarBlobId)) || undefined,
    scrollTop: 0,
  };
}

function convertFolder(f: unknown, i: number): Folder {
  const o = rec(f) || {};
  return {
    id: str(o.id, uid("folder_")),
    name: str(o.name, "未命名"),
    starred: bool(o.starred),
    collapsed: bool(o.collapsed),
    order: num(o.order, num(o.sort, i)),
    createdAt: num(o.createdAt, Date.now()),
  };
}

function convertPersonaCard(c: unknown, i: number, grokModelId: Chat["grokModelId"]): CharacterCard {
  const o = rec(c) || {};
  const draft = rec(o.draft) || rec(c) || {};
  const characters = charactersFromDraft(draft, defaultImageParams());
  return {
    id: str(o.id, uid("card_")),
    name: str(o.name, str(draft.name, "未命名")),
    isMulti: bool(draft.multi),
    overview: str(draft.overview),
    opening: str(draft.scene, str(draft.opening)),
    extras: extrasFrom(draft.extras),
    statusBarOn: bool(draft.statusOn),
    statusBar: str(draft.statusText, str(draft.statusBar)),
    characters,
    grokModelId,
    createdAt: num(o.createdAt, Date.now()),
    order: i,
  };
}

function convertAppearance(c: unknown, i: number): AppearancePreset {
  const o = rec(c) || {};
  return {
    id: str(o.id, uid("ap_")),
    name: str(o.name, "未命名"),
    prompt: str(o.prompt),
    order: num(o.order, i),
    createdAt: num(o.createdAt, Date.now()),
  };
}

function convertHistory(h: unknown): HistoryItem {
  const o = rec(h) || {};
  const params = convertImageParams(o.params);
  const id = str(o.id, uid("hist_"));
  return {
    id,
    blobId: str(o.blobId, str(o.imageId, id)) || undefined,
    prompt: str(o.prompt, params.promptMid),
    negative: str(o.negative, params.negative),
    seed: num(o.seed, params.seed ?? 0),
    model: migrateNaiModel(o.model ?? params.model),
    width: num(o.width, params.width),
    height: num(o.height, params.height),
    steps: num(o.steps, params.steps),
    sampler: migrateSampler(o.sampler ?? params.sampler),
    params,
    createdAt: num(o.createdAt, Date.now()),
    status: "done",
  };
}

function presetToAppearance(p: unknown, i: number): AppearancePreset | null {
  const o = rec(p) || {};
  const params = convertImageParams(o.params);
  const prompt = str(o.prompt) || params.promptMid || [params.promptFront, params.promptMid, params.promptBack].filter(Boolean).join(", ");
  const name = str(o.name);
  if (!name && !prompt) return null;
  return {
    id: str(o.id, uid("preset_")),
    name: name || "未命名预设",
    prompt,
    order: 1000 + i,
    createdAt: num(o.createdAt, Date.now()),
  };
}

export function convertLegacyArchive(raw: unknown): LegacyLoad {
  const o = rec(raw);
  if (!o) throw new Error("无法识别的存档");
  const settingsIn = rec(o.settings);
  const grokModelId = migrateGrokId(str(settingsIn?.grokModel, str(settingsIn?.grokModelId, DEFAULT_GROK)));
  const settings: Settings = {
    ...baseSettings(),
    grokModelId,
    theme: settingsIn?.theme === "dark" ? "dark" : "light",
  };

  const chats = Array.isArray(o.roles) ? o.roles.map((r) => convertRole(r, grokModelId)) : [];
  const folders = Array.isArray(o.folders) ? o.folders.map(convertFolder) : [];
  const cards = Array.isArray(o.personaCards)
    ? o.personaCards.map((c, i) => convertPersonaCard(c, i, grokModelId))
    : [];
  const appearances = Array.isArray(o.appearanceCards) ? o.appearanceCards.map(convertAppearance) : [];
  const seen = new Set(appearances.map((a) => a.id));
  if (Array.isArray(o.purePresets)) {
    o.purePresets.forEach((p, i) => {
      const a = presetToAppearance(p, i);
      if (a && !seen.has(a.id)) {
        appearances.push(a);
        seen.add(a.id);
      }
    });
  }
  const history = Array.isArray(o.pureHistory) ? o.pureHistory.map(convertHistory) : [];
  const pureParams = o.pureParams ? convertImageParams(o.pureParams) : defaultPureParams();
  const currentId =
    typeof o.activeRoleId === "string" && chats.some((c) => c.id === o.activeRoleId)
      ? o.activeRoleId
      : [...chats].sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null;

  return {
    dump: {
      version: 1,
      settings,
      folders,
      chats,
      cards,
      appearances,
      favorites: [],
      history,
      hasImages: o.imagesIncluded !== false,
    },
    currentId,
    pureParams,
  };
}
