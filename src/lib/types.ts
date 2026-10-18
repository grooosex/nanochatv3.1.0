export type TabId = "chat" | "params" | "pure";

export type GrokModelId =
  | "grok-4.7-high"
  | "grok-4.7-medium"
  | "grok-4.7-low"
  | "grok-4.6-high"
  | "grok-4.6-medium"
  | "grok-4.6-low"
  | "grok-4.5-high"
  | "grok-4.5-medium"
  | "grok-4.5-low";

export type NaiModelId =
  | "nai-diffusion-5-full"
  | "nai-diffusion-5-curated"
  | "nai-diffusion-4-5-full"
  | "nai-diffusion-4-5-curated"
  | "nai-diffusion-4-full"
  | "nai-diffusion-4-curated"
  | "nai-diffusion-3"
  | "nai-diffusion-furry-3"
  | "nai-diffusion-4-5-furry"
  | "nai-diffusion-4-furry";

export type SamplerId =
  | "k_euler_ancestral"
  | "k_euler"
  | "k_dpmpp_2s_ancestral"
  | "k_dpmpp_2m"
  | "k_dpmpp_sde"
  | "k_dpmpp_2m_sde"
  | "ddim_v3";

export type NoiseSchedule = "native" | "karras" | "exponential" | "polyexponential";

export type UcPreset = "heavy" | "light" | "human" | "custom";

export type MultiMode = "together" | "group";
export type PromptInsertMode = "insert" | "legacy";

export interface ExtraField {
  id: string;
  body: string;
  applyImage?: boolean;
  emphasize?: boolean;
}

export interface Character {
  id: string;
  name: string;
  persona: string;
  speech: string;
  appearance: string;
  lookBlobId?: string;
  extras: ExtraField[];
  personaVoices?: boolean;
  imageEnabled: boolean;
  prompt: string;
  uc: string;
  x: number;
  y: number;
}

export interface ImageParams {
  promptFront: string;
  promptMid: string;
  promptBack: string;
  merged: boolean;
  sensitive: boolean;
  uncensored: boolean;
  fullBody: boolean;
  tagSuggest: boolean;
  negative: string;
  ucPreset: UcPreset;
  model: NaiModelId;
  width: number;
  height: number;
  sampler: SamplerId;
  noiseSchedule: NoiseSchedule;
  steps: number;
  scale: number;
  cfgRescale: number;
  seed: number | null;
  seedLocked: boolean;
  stepsLocked: boolean;
  scaleLocked: boolean;
  cfgRescaleLocked: boolean;
  varietyPlus: boolean;
  decrisper: boolean;
  useCoords: boolean;
  characters: CharacterPrompt[];
  img2imgBlobId?: string;
  img2imgStrength?: number;
  img2imgNoise?: number;
}

export interface CharacterPrompt {
  id: string;
  name: string;
  enabled: boolean;
  prompt: string;
  uc: string;
  x: number;
  y: number;
}

export type ImageGenSource = "auto" | "same" | "rewrite" | "custom";

export interface GenImage {
  id: string;
  blobId?: string;
  prompt: string;
  charTails?: Record<string, string>;
  negative: string;
  seed: number;
  model: NaiModelId;
  width: number;
  height: number;
  steps: number;
  sampler: SamplerId;
  status: "writing" | "uploading" | "generating" | "receiving" | "done" | "error";
  error?: string;
  source?: ImageGenSource;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "narrator";
  characterId?: string;
  characterName?: string;
  content: string;
  images: GenImage[];
  createdAt: number;
  userImageBlobId?: string;
  userImageI2i?: boolean;
}

export interface MemorySnap {
  covered: number;
  text: string;
  foldAt: number;
}

export interface Chat {
  id: string;
  folderId: string | null;
  name: string;
  remark: string;
  starred: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
  isDraft?: boolean;
  grokModelId: GrokModelId;
  isMulti: boolean;
  multiMode: MultiMode;
  promptMode: PromptInsertMode;
  adultBoost: boolean;
  canGen: boolean;
  statusBarOn: boolean;
  statusBar: string;
  overview: string;
  opening: string;
  extras: ExtraField[];
  memory: string;
  memoryUntil: number;
  memoryFoldAt: number;
  memorySnaps: MemorySnap[];
  characters: Character[];
  imageParams: ImageParams;
  messages: ChatMessage[];
  avatarBlobId?: string;
  scrollTop: number;
  /** @deprecated lifted into Settings.imageModelId */
  imageModelId?: string | null;
  /** @deprecated lifted into Settings.imageModelPin */
  imageModelPin?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  starred: boolean;
  collapsed: boolean;
  order: number;
  createdAt: number;
}

export interface CharacterCard {
  id: string;
  name: string;
  isMulti: boolean;
  overview: string;
  opening: string;
  extras: ExtraField[];
  statusBarOn: boolean;
  statusBar: string;
  characters: Character[];
  grokModelId: GrokModelId;
  createdAt: number;
  order: number;
}

export interface AppearancePreset {
  id: string;
  name: string;
  prompt: string;
  order: number;
  createdAt: number;
}

export interface FavGroup {
  id: string;
  name: string;
  parentId: string | null;
  collapsed: boolean;
  order: number;
  starred?: boolean;
  createdAt: number;
}

export interface FavoriteItem {
  id: string;
  name: string;
  params: ImageParams;
  blobId?: string;
  createdAt: number;
  order?: number;
  groupId?: string | null;
  starred?: boolean;
}

export interface HistoryItem {
  id: string;
  blobId?: string;
  prompt: string;
  negative: string;
  seed: number;
  model: NaiModelId;
  width: number;
  height: number;
  steps: number;
  sampler: SamplerId;
  params: ImageParams;
  createdAt: number;
  status: GenImage["status"];
  error?: string;
}

export type ChatSource = "grok" | "api";

export interface LlmParams {
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxTokens: number;
  contextTurns: number;
}

export interface LlmAccount {
  id: string;
  name: string;
  base: string;
  key: string;
  starred?: string[];
  model?: string;
}

export interface StPresetParams {
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
}

export interface StPreset {
  id: string;
  name: string;
  systemPrompt: string;
  postHistory: string;
  params: StPresetParams;
}

export interface Settings {
  grokModelId: GrokModelId;
  chatSource: ChatSource;
  llmBase: string;
  llmKey: string;
  llmConnected: boolean;
  llmModel: string;
  llmModels: string[];
  llmStarred: string[];
  llmAccounts: LlmAccount[];
  llmParams: LlmParams;
  /** Last successfully connected API account; used to reset 配图 AI on account switch. */
  llmIdentity?: string;
  stPresets: StPreset[];
  stActiveId: string | null;
  stParamSnapshot: LlmParams | null;
  naiKey: string;
  naiBase: string;
  naiConnected: boolean;
  cooldownUntil: number;
  chatImage: boolean;
  /** null/unset = 与聊天一致. Global, not per-chat. */
  imageModelId?: string | null;
  /** Last explicit API pick for 配图 AI; kept at the end of the list on Grok. */
  imageModelPin?: string | null;
  theme: "light" | "dark";
  /** 纯生图收藏是否用缩略图。关掉收藏再打开仍保持。 */
  favThumbs?: boolean;
  /** 纯生图角色栏锁定。收藏/历史应用参数时不覆盖角色。 */
  pureCharLocked?: boolean;
}

export interface AppDataDump {
  version: 1;
  settings: Settings;
  folders: Folder[];
  chats: Chat[];
  cards: CharacterCard[];
  appearances: AppearancePreset[];
  favorites: FavoriteItem[];
  favGroups?: FavGroup[];
  history: HistoryItem[];
  hasImages: boolean;
}
