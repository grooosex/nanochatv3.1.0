import {
  FULLBODY_TAG,
  FURRY_TAG,
  NAI_MODELS,
  SENSITIVE_PREFIX,
  UNCENSORED_TAG,
  joinPromptParts,
} from "./constants";
import type { CharacterPrompt, ImageParams, NaiModelId } from "./types";
import { randomSeed } from "./utils";

export function naiMeta(model: NaiModelId) {
  return NAI_MODELS.find((m) => m.id === model);
}

export function naiFamily(model: NaiModelId) {
  return naiMeta(model)?.family ?? "v4.5";
}

export function naiWire(model: NaiModelId) {
  return naiMeta(model)?.wire || model;
}

export function supportsChars(model: NaiModelId) {
  const f = naiFamily(model);
  return f === "v4" || f === "v4.5" || f === "v5";
}

export function joinPrompt(params: ImageParams, grokTail = "") {
  const furry = !!naiMeta(params.model)?.furry;

  if (params.merged) {
    let text = params.promptMid.trim();
    if (furry && !/fur dataset/i.test(text)) text = joinPromptParts(FURRY_TAG, text);
    if (params.uncensored && !/uncensored/i.test(text)) text = joinPromptParts(text, UNCENSORED_TAG);
    if (params.fullBody && !/full body/i.test(text)) text = joinPromptParts(text, FULLBODY_TAG);
    if (params.sensitive && !/rating:\s*sensitive/i.test(text)) text = joinPromptParts(SENSITIVE_PREFIX, text);
    return joinPromptParts(text, grokTail);
  }

  let front = params.promptFront.trim();
  if (furry && !/fur dataset/i.test(front) && !/fur dataset/i.test(params.promptMid)) {
    front = joinPromptParts(FURRY_TAG, front);
  }
  if (params.uncensored && !/uncensored/i.test(front)) front = joinPromptParts(front, UNCENSORED_TAG);
  if (params.fullBody && !/full body/i.test(front)) front = joinPromptParts(front, FULLBODY_TAG);
  const mid = joinPromptParts(params.promptMid, grokTail);
  let back = params.promptBack.trim();
  if (params.sensitive && !/rating:\s*sensitive/i.test(back)) back = joinPromptParts(SENSITIVE_PREFIX, back);
  return joinPromptParts(front, mid, back);
}

export function varietySigma(w: number, h: number) {
  return Math.round(19 * Math.sqrt((w * h) / (768 * 512)) * 100) / 100;
}

export function buildNaiPayload(opts: {
  params: ImageParams;
  grokTail?: string;
  charTails?: Record<string, string>;
  insertMode?: "insert" | "legacy";
  seed?: number;
}) {
  const { params, grokTail = "", charTails = {}, insertMode = "insert" } = opts;
  const seed = opts.seed ?? params.seed ?? randomSeed();
  const family = naiFamily(params.model);
  const v3 = family === "v3";
  const chars = params.characters.filter((c) => c.enabled);
  const charCaptions = chars.map((c) => ({
    char_caption: [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", "),
    centers: [{ x: c.x, y: c.y }],
  }));
  const charUc = chars.map((c) => ({
    char_caption: c.uc.trim(),
    centers: [{ x: c.x, y: c.y }],
  }));

  let base = joinPrompt(params, grokTail);
  if (!v3 && insertMode === "legacy" && chars.length) {
    const extra = chars
      .map((c, i) => {
        const body = [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", ");
        return `char${i + 1}: ${body}`;
      })
      .join(", ");
    base = [base, extra].filter(Boolean).join(", ");
  }

  const useCoords = params.useCoords;
  const characterPrompts = chars.map((c) => ({
    prompt: [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", "),
    uc: c.uc.trim(),
    center: { x: c.x, y: c.y },
    enabled: true,
  }));

  const parameters: Record<string, unknown> = {
    params_version: family === "v5" ? 4 : 3,
    width: params.width,
    height: params.height,
    scale: params.scale,
    sampler: params.sampler,
    steps: params.steps,
    n_samples: 1,
    ucPreset: 0,
    qualityToggle: false,
    autoSmea: false,
    dynamic_thresholding: params.decrisper,
    controlnet_strength: 1,
    legacy: false,
    add_original_image: true,
    cfg_rescale: params.cfgRescale,
    noise_schedule: params.noiseSchedule,
    legacy_v3_extend: false,
    skip_cfg_above_sigma: params.varietyPlus ? varietySigma(params.width, params.height) : null,
    use_coords: useCoords,
    legacy_uc: false,
    normalize_coords: true,
    prompt: base,
    negative_prompt: params.negative,
    seed,
    extra_noise_seed: seed,
    prefer_brownian: params.sampler.includes("ancestral") || params.sampler.includes("sde"),
  };

  if (!v3 && insertMode === "insert") {
    parameters.characterPrompts = characterPrompts;
    parameters.v4_prompt = {
      caption: { base_caption: base, char_captions: charCaptions },
      use_coords: useCoords,
      use_order: true,
    };
    parameters.v4_negative_prompt = {
      caption: { base_caption: params.negative, char_captions: charUc },
      legacy_uc: false,
    };
  } else if (!v3) {
    parameters.v4_prompt = {
      caption: { base_caption: base, char_captions: [] },
      use_coords: false,
      use_order: true,
    };
    parameters.v4_negative_prompt = {
      caption: { base_caption: params.negative, char_captions: [] },
      legacy_uc: false,
    };
  }

  return {
    input: base,
    model: naiWire(params.model),
    action: "generate",
    parameters,
    seed,
    finalPrompt: base,
    characterPrompts,
  };
}

export function syncCharsFromRole(
  params: ImageParams,
  roles: { id: string; name: string; appearance: string; imageEnabled: boolean; prompt: string; uc: string; x: number; y: number }[],
  isMulti: boolean,
): ImageParams {
  if (!isMulti) {
    return { ...params, characters: [] };
  }
  const next: CharacterPrompt[] = roles.map((r) => {
    const prev = params.characters.find((c) => c.id === r.id);
    return {
      id: r.id,
      name: r.name,
      enabled: prev ? prev.enabled : r.imageEnabled,
      prompt: prev?.prompt || r.prompt || r.appearance || "",
      uc: prev?.uc || r.uc || "",
      x: prev?.x ?? r.x ?? 0.5,
      y: prev?.y ?? r.y ?? 0.5,
    };
  });
  return { ...params, characters: next };
}

export function samplerLabel(id: string) {
  if (id === "k_euler_ancestral") return "Euler A";
  if (id === "k_euler") return "Euler";
  if (id === "k_dpmpp_2s_ancestral") return "DPM++ 2S A";
  if (id === "k_dpmpp_2m") return "DPM++ 2M";
  if (id === "k_dpmpp_sde") return "DPM++ SDE";
  if (id === "k_dpmpp_2m_sde") return "DPM++ 2M SDE";
  if (id === "ddim_v3") return "DDIM";
  return id;
}

export function samplerShort(id: string) {
  if (id === "k_euler_ancestral") return "Euler A...";
  return samplerLabel(id);
}

export function modelLabel(id: NaiModelId) {
  return NAI_MODELS.find((m) => m.id === id)?.label ?? id;
}

export function modelShort(id: NaiModelId) {
  const m = naiMeta(id);
  if (!m) return id;
  if (m.family === "v3") return m.furry ? "F3" : "3";
  if (m.family === "v5") return id.includes("curated") ? "5C" : "5";
  if (m.family === "v4.5") return id.includes("curated") ? "4.5C" : "4.5";
  if (m.family === "v4") return id.includes("curated") ? "4C" : "4";
  return m.label.replace(/^NAI\s+/i, "").replace(/\s*Full$/i, "");
}
