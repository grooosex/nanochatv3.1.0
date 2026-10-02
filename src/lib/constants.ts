import type {
  GrokModelId,
  ImageParams,
  LlmParams,
  NaiModelId,
  NoiseSchedule,
  SamplerId,
  UcPreset,
} from "./types";

export const APP_NAME = "绘语";

export const GROK_MODELS: {
  id: GrokModelId;
  label: string;
  short: string;
  model: string;
  effort: "low" | "medium" | "high";
}[] = [
  { id: "grok-4.6-medium", label: "4.6 均衡", short: "4.6 均衡", model: "grok-4.6", effort: "medium" },
  { id: "grok-4.6-high", label: "4.6 专家", short: "4.6 专家", model: "grok-4.6", effort: "high" },
  { id: "grok-4.6-low", label: "4.6 快速", short: "4.6 快速", model: "grok-4.6", effort: "low" },
  { id: "grok-4.5-medium", label: "4.5 均衡", short: "4.5 均衡", model: "grok-4.5", effort: "medium" },
  { id: "grok-4.5-high", label: "4.5 专家", short: "4.5 专家", model: "grok-4.5", effort: "high" },
  { id: "grok-4.5-low", label: "4.5 快速", short: "4.5 快速", model: "grok-4.5", effort: "low" },
];

export const DEFAULT_GROK: GrokModelId = "grok-4.6-medium";

export function migrateGrokId(id: string | undefined | null): GrokModelId {
  if (id && GROK_MODELS.some((m) => m.id === id)) return id as GrokModelId;
  if (id === "grok-4.6" || id === "grok-4-6") return "grok-4.6-medium";
  if (id === "grok-4.5") return "grok-4.5-medium";
  if (id === "grok-4.5-fast" || id === "grok-4.3" || id === "grok-4.3-low") return "grok-4.5-low";
  if (id === "grok-4.6-fast") return "grok-4.6-low";
  return DEFAULT_GROK;
}

export const DEFAULT_LLM_PARAMS: LlmParams = {
  temperature: 0.9,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0.4,
  maxTokens: 4096,
  contextTurns: 16,
};

export function mergeLlmParams(p?: Partial<LlmParams> | null): LlmParams {
  return { ...DEFAULT_LLM_PARAMS, ...(p ?? {}) };
}

export function shortModelLabel(id: string) {
  if (!id) return "未选模型";
  const i = id.lastIndexOf("/");
  return i >= 0 ? id.slice(i + 1) : id;
}

export const NAI_MODELS: {
  id: NaiModelId;
  label: string;
  family: "v5" | "v4.5" | "v4" | "v3";
  wire?: string;
  furry?: boolean;
}[] = [
  { id: "nai-diffusion-5-full", label: "NAI V5 Full", family: "v5" },
  { id: "nai-diffusion-5-curated", label: "NAI V5 Curated", family: "v5" },
  { id: "nai-diffusion-4-5-full", label: "NAI V4.5 Full", family: "v4.5" },
  { id: "nai-diffusion-4-5-furry", label: "NAI V4.5 Furry", family: "v4.5", wire: "nai-diffusion-4-5-full", furry: true },
  { id: "nai-diffusion-4-5-curated", label: "NAI V4.5 Curated", family: "v4.5" },
  { id: "nai-diffusion-4-full", label: "NAI V4 Full", family: "v4" },
  { id: "nai-diffusion-4-furry", label: "NAI V4 Furry", family: "v4", wire: "nai-diffusion-4-full", furry: true },
  { id: "nai-diffusion-4-curated", label: "NAI V4 Curated", family: "v4", wire: "nai-diffusion-4-curated-preview" },
  { id: "nai-diffusion-3", label: "NAI V3", family: "v3" },
  { id: "nai-diffusion-furry-3", label: "NAI Furry V3", family: "v3", furry: true },
];

export const SAMPLERS: { id: SamplerId; label: string }[] = [
  { id: "k_euler_ancestral", label: "Euler Ancestral" },
  { id: "k_euler", label: "Euler" },
  { id: "k_dpmpp_2s_ancestral", label: "DPM++ 2S Ancestral" },
  { id: "k_dpmpp_2m", label: "DPM++ 2M" },
  { id: "k_dpmpp_sde", label: "DPM++ SDE" },
  { id: "k_dpmpp_2m_sde", label: "DPM++ 2M SDE" },
  { id: "ddim_v3", label: "DDIM" },
];

export const NOISE_SCHEDULES: { id: NoiseSchedule; label: string }[] = [
  { id: "karras", label: "Karras" },
  { id: "native", label: "Native" },
  { id: "exponential", label: "Exponential" },
  { id: "polyexponential", label: "Polyexponential" },
];

export const RESOLUTIONS: { label: string; group: string; w: number; h: number }[] = [
  { label: "竖图 · 长", group: "竖图", w: 704, h: 1472 },
  { label: "竖图 · 中", group: "竖图", w: 832, h: 1216 },
  { label: "竖图 · 大", group: "竖图", w: 1024, h: 1536 },
  { label: "横图 · 小", group: "横图", w: 768, h: 512 },
  { label: "横图 · 中", group: "横图", w: 1216, h: 832 },
  { label: "横图 · 大", group: "横图", w: 1536, h: 1024 },
  { label: "方图 · 小", group: "方图", w: 640, h: 640 },
  { label: "方图 · 中", group: "方图", w: 1024, h: 1024 },
  { label: "方图 · 大", group: "方图", w: 1472, h: 1472 },
];

export const UC: Record<Exclude<UcPreset, "custom">, string> = {
  heavy:
    "lowres, artistic error, film grain, scan, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, dithering, halftone, screentone, multiple views, logo, too many watermarks, negativeXL, negative, negative_hand-neg, extra digits, fewer digits, bad anatomy, bad hands",
  light:
    "lowres, artistic error, scan, worst quality, bad quality, jpeg artifacts, very displeasing, logo, too many watermarks, negativeXL, negative, bad anatomy, bad hands",
  human:
    "lowres, artistic error, scan, worst quality, bad quality, jpeg artifacts, very displeasing, overly naturalistic, logo, too many watermarks, negativeXL, negative, extra digits, bad anatomy",
};

export const DEFAULT_NAI_BASE = "https://api.idlecloud.cc";

export const SENSITIVE_PREFIX = "rating: sensitive, nsfw, uncensored,";
export const UNCENSORED_TAG = "uncensored,";
export const FULLBODY_TAG = "1.5::full body,foot::,";
export const FURRY_TAG = "fur dataset,";

export const DEFAULT_STATUS_BAR = `状态栏:
👤{name}
🧣头发:
👙里衣:
🧦鞋袜:
🔮身体改造:无
🧪身体道具:无
🍐肛门:粉嫩紧闭，从未被进入，微微收缩着
🎟嘴巴:小巧粉唇微微张开
🌸小穴:粉嫩紧致的处女穴
🎀其他部位:
💪🏻体力:精神充沛
❤️健康状态:正常`;

export function joinPromptParts(...parts: string[]) {
  return parts.map((s) => s.trim()).filter(Boolean).join(", ");
}

export function defaultImageParams(): ImageParams {
  return {
    promptFront:
      "1.7::artist:mamezou::, 0.5::kawakami_rokkaku::, 0.8::artist:kojima_saya::, year 2024, year 2025, 0.5::satou kibi::, 0.3::quasarcake::",
    promptMid: "",
    promptBack:
      "rating:sensitive, nsfw, uncensored, masterpiece, highres, absurdres, newest, 4k, extremely detailed, 8k wallpaper, ultra-detailed, cinematic, anime",
    merged: false,
    sensitive: false,
    uncensored: false,
    fullBody: false,
    tagSuggest: true,
    negative: UC.heavy,
    ucPreset: "heavy",
    model: "nai-diffusion-4-5-full",
    width: 832,
    height: 1216,
    sampler: "k_euler_ancestral",
    noiseSchedule: "karras",
    steps: 28,
    scale: 5,
    cfgRescale: 0,
    seed: null,
    seedLocked: false,
    stepsLocked: false,
    scaleLocked: false,
    cfgRescaleLocked: false,
    varietyPlus: false,
    decrisper: false,
    useCoords: false,
    characters: [],
  };
}

export function defaultPureParams(): ImageParams {
  const p = defaultImageParams();
  return {
    ...p,
    merged: true,
    promptMid: joinPromptParts(p.promptFront, p.promptMid, p.promptBack),
  };
}

export function normalizePureParams(p: ImageParams): ImageParams {
  if (p.merged && !p.promptMid.trim() && (p.promptFront.trim() || p.promptBack.trim())) {
    return { ...p, promptMid: joinPromptParts(p.promptFront, p.promptMid, p.promptBack) };
  }
  return p;
}

export function emptyCharacter(index = 1): import("./types").Character {
  return {
    id: `c${index}_${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    persona: "",
    speech: "",
    appearance: "",
    extras: [],
    personaVoices: false,
    imageEnabled: true,
    prompt: "",
    uc: "",
    x: 0.5,
    y: 0.5,
  };
}

export const PLACEHOLDERS = {
  name: "例如 青叶",
  overview: "回复尽量详尽生动，不要简略。",
  persona: "她是谁：性格、职业或身份、口头禅、和我的关系……外貌请写在下面那栏。",
  speech: "语气、口癖、人称、句子长短。例如：软软的、会把「……」拖长。",
  appearance: "1girl, long hair, brown hair, brown eyes, slim, school uniform…",
  opening: "傍晚的便利店门口，刚下过雨。",
};

export const COOLDOWN_MS = 20_000;
export const RECENT_TURNS = 20;
export const IMAGE_GEN_TIMEOUT_MS = 120_000;
export const IMAGE_DRAW_TIMEOUT_MS = 600_000;
export const NAI_HOP_TIMEOUT_MS = 20_000;
export const NAI_POLL_MS = 10_000;
