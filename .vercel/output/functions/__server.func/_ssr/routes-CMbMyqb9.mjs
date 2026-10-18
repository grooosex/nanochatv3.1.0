import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as zipSync, n as strToU8, r as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
import { A as ChevronRight, C as FileUp, D as Copy, E as Download, F as ArrowUp, I as ArrowDown, L as AlignJustify, M as ChevronDown, N as Check, O as Clock, P as Bookmark, S as FolderInput, T as Ellipsis, _ as Lock, a as Trash2, b as Folder, c as Sparkles, d as ScanSearch, f as RefreshCw, g as Menu, h as Moon, j as ChevronLeft, k as ChevronUp, l as SlidersHorizontal, m as Pencil, n as WandSparkles, o as Sun, p as Plus, r as Upload, s as Star, t as X, u as Settings, v as LoaderCircle, w as Eye, x as FolderPlus, y as GitBranch } from "../_libs/lucide-react.mjs";
import { A as NOISE_SCHEDULES, B as joinPromptParts, C as FURRY_TAG, D as NAI_HOP_TIMEOUT_MS, E as IMAGE_GEN_TIMEOUT_MS, F as UC, G as __exportAll$1, H as migrateGrokId, I as UNCENSORED_TAG, L as defaultImageParams, M as RESOLUTIONS, N as SAMPLERS, O as NAI_MODELS, P as SENSITIVE_PREFIX, R as defaultPureParams, S as FULLBODY_TAG, T as IMAGE_DRAW_TIMEOUT_MS, U as normalizePureParams, V as mergeLlmParams, W as shortModelLabel, _ as COOLDOWN_MS, a as IMAGE_SHOT_RULES, b as DEFAULT_NAI_BASE, c as fieldPolishHint, d as imageLengthRules, f as imageWriteMaxTokens, g as voicePolishExtra, h as splitChatPrompt, i as IMAGE_MULTI_RULES, j as PLACEHOLDERS, k as NAI_POLL_MS, l as groupFormatHint, m as roleSnapshot, n as FIELD_LABELS, o as chatContextBlock, p as multiInsertInstruction, r as IMAGE_BG_RULES, s as chatImageSystem, u as imageApplyRules, v as DEFAULT_GROK, w as GROK_MODELS$1, x as DEFAULT_STATUS_BAR, y as DEFAULT_LLM_PARAMS, z as emptyCharacter } from "./router-DcqrjO68.mjs";
import { t as Dexie } from "../_libs/dexie.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/idb-CmN-sBDm.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "") {
	return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
function sortHistoryNewestFirst(items) {
	return [...items].sort((a, b) => {
		const dt = (b.createdAt || 0) - (a.createdAt || 0);
		if (dt) return dt;
		return String(b.id || "").localeCompare(String(a.id || ""));
	});
}
function uniqueNumberedName(desired, taken) {
	const base = desired.trim();
	const set = new Set(taken);
	if (!set.has(base)) return base;
	let n = 2;
	while (set.has(`${base}${n}`)) n++;
	return `${base}${n}`;
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function randomSeed() {
	return Math.floor(Math.random() * 2 ** 32);
}
function moveId(ids, id, to) {
	const from = ids.indexOf(id);
	if (from < 0) return ids;
	const next = ids.slice();
	next.splice(from, 1);
	next.splice(Math.max(0, Math.min(next.length, to)), 0, id);
	return next;
}
function indexFromY(rows, y) {
	if (!rows.length) return 0;
	for (let i = 0; i < rows.length; i++) {
		const box = rows[i].getBoundingClientRect();
		if (y < box.top + box.height / 2) return i;
	}
	return rows.length - 1;
}
function nearestScroller(el) {
	let n = el;
	while (n && n !== document.body) {
		const oy = getComputedStyle(n).overflowY;
		if (oy === "auto" || oy === "scroll" || oy === "overlay") return n;
		n = n.parentElement;
	}
	return null;
}
function autoScrollNearEdge(scroller, clientY, edge = 52) {
	const box = scroller.getBoundingClientRect();
	const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
	if (max <= 0) return 0;
	let dy = 0;
	if (clientY < box.top + edge) dy = -Math.min(28, Math.max(3, (box.top + edge - clientY) * .4));
	else if (clientY > box.bottom - edge) dy = Math.min(28, Math.max(3, (clientY - (box.bottom - edge)) * .4));
	if (!dy) return 0;
	const next = Math.max(0, Math.min(max, scroller.scrollTop + dy));
	const applied = next - scroller.scrollTop;
	scroller.scrollTop = next;
	return applied;
}
var PLACEHOLDER_IDS = /* @__PURE__ */ new Set([
	"worldInfoBefore",
	"worldInfoAfter",
	"charDescription",
	"charPersonality",
	"scenario",
	"personaDescription",
	"dialogueExamples",
	"chatHistory",
	"charDepthPrompt",
	"personalityFormat",
	"scenarioFormat"
]);
function rec$1(v) {
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function num$1(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		if (Number.isFinite(n)) return n;
	}
}
function str$1(v) {
	return typeof v === "string" ? v : "";
}
function parseStPresets(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		const o = rec$1(row);
		if (!o) continue;
		if (typeof o.id !== "string" || typeof o.name !== "string") continue;
		out.push({
			id: o.id,
			name: o.name,
			systemPrompt: str$1(o.systemPrompt),
			postHistory: str$1(o.postHistory),
			params: {
				temperature: num$1(o.params && rec$1(o.params)?.temperature),
				topP: num$1(o.params && rec$1(o.params)?.topP),
				frequencyPenalty: num$1(o.params && rec$1(o.params)?.frequencyPenalty),
				presencePenalty: num$1(o.params && rec$1(o.params)?.presencePenalty),
				maxTokens: num$1(o.params && rec$1(o.params)?.maxTokens)
			}
		});
	}
	return out;
}
function isTextCompletion(raw) {
	return typeof raw.input_sequence === "string" || typeof raw.output_sequence === "string" || typeof raw.system_prompt === "string" || Array.isArray(raw.seq);
}
function isCharacterCard(raw) {
	return str$1(raw.spec).startsWith("chara_card") || Boolean(rec$1(raw.data)?.character_book) || Boolean(raw.first_mes);
}
function readPrompt(v) {
	const o = rec$1(v);
	if (!o) return null;
	const identifier = str$1(o.identifier) || str$1(o.name) || uid("p_");
	const content = str$1(o.content) || str$1(o.prompt);
	return {
		identifier,
		name: str$1(o.name) || identifier,
		content,
		marker: o.marker === true,
		role: str$1(o.role).toLowerCase() || "system",
		injectionPosition: num$1(o.injection_position) ?? 0
	};
}
function enabledOrder(raw, prompts) {
	const byId = new Map(prompts.map((p) => [p.identifier, p]));
	const orders = Array.isArray(raw.prompt_order) ? raw.prompt_order : [];
	let order = [];
	for (const entry of orders) {
		const o = rec$1(entry);
		if (!o || !Array.isArray(o.order)) continue;
		if (o.character_id === 1e5 || o.character_id === "100000" || !order.length) order = o.order;
		if (o.character_id === 1e5 || o.character_id === "100000") break;
	}
	if (!order.length) return prompts;
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const row of order) {
		const o = rec$1(row);
		if (!o) continue;
		if (o.enabled === false) continue;
		const id = str$1(o.identifier);
		const p = byId.get(id);
		if (!p || seen.has(id)) continue;
		seen.add(id);
		out.push(p);
	}
	return out;
}
function isPostHistory(p) {
	const id = p.identifier.toLowerCase();
	const name = p.name.toLowerCase();
	return id === "jailbreak" || name.includes("post-history") || name.includes("post history") || p.injectionPosition === 1;
}
function isPlaceholder(p) {
	if (p.marker) return true;
	if (PLACEHOLDER_IDS.has(p.identifier)) return true;
	return false;
}
function parseChatCompletionPreset(raw, fileName) {
	const o = rec$1(raw);
	if (!o) throw new Error("这不是对话补全预设");
	if (isCharacterCard(o)) throw new Error("这是角色卡，不是对话补全预设");
	if (!Array.isArray(o.prompts)) {
		if (isTextCompletion(o)) throw new Error("这不是对话补全预设");
		throw new Error("这不是对话补全预设");
	}
	const enabled = enabledOrder(o, o.prompts.map(readPrompt).filter((p) => Boolean(p))).filter((p) => !isPlaceholder(p) && p.content.trim());
	const systemParts = [];
	const postParts = [];
	for (const p of enabled) if (isPostHistory(p)) postParts.push(p.content.trim());
	else systemParts.push(p.content.trim());
	if (!systemParts.length && !postParts.length) throw new Error("这份预设没有可导入的提示词");
	const stem = fileName.replace(/\.json$/i, "").trim() || "未命名预设";
	return {
		id: uid("st_"),
		name: stem,
		systemPrompt: systemParts.join("\n\n"),
		postHistory: postParts.join("\n\n"),
		params: {
			temperature: num$1(o.temperature),
			topP: num$1(o.top_p) ?? num$1(o.topP),
			frequencyPenalty: num$1(o.frequency_penalty) ?? num$1(o.frequencyPenalty),
			presencePenalty: num$1(o.presence_penalty) ?? num$1(o.presencePenalty),
			maxTokens: num$1(o.openai_max_tokens) ?? num$1(o.max_tokens) ?? num$1(o.maxTokens)
		}
	};
}
function uniquePresetName(desired, existing) {
	return uniqueNumberedName(desired, existing);
}
function macroContext(chat) {
	const chars = chat?.characters ?? [];
	const names = chars.map((c) => c.name.trim()).filter(Boolean);
	const personas = chars.map((c) => c.persona.trim()).filter(Boolean);
	return {
		char: names.join("、"),
		isMulti: Boolean(chat?.isMulti && chars.length > 1),
		scenario: chat?.opening?.trim() ?? "",
		personality: personas.join("\n\n")
	};
}
function substituteMacros(text, ctx) {
	if (!text) return "";
	return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_full, rawKey) => {
		const key = rawKey.trim().toLowerCase().split(":")[0]?.trim() ?? "";
		if (key === "user" || key === "username") return "你";
		if (key === "char" || key === "bot" || key === "character") return ctx.char;
		if (key === "charifnotgroup") return ctx.isMulti ? "" : ctx.char;
		if (key === "scenario") return ctx.scenario;
		if (key === "personality") return ctx.personality;
		return "";
	});
}
function activePreset(settings) {
	const id = settings.stActiveId;
	if (!id) return null;
	return (settings.stPresets ?? []).find((p) => p.id === id) ?? null;
}
function samplerPatch(params, current) {
	return {
		...current,
		temperature: params.temperature ?? current.temperature,
		topP: params.topP ?? current.topP,
		frequencyPenalty: params.frequencyPenalty ?? current.frequencyPenalty,
		presencePenalty: params.presencePenalty ?? current.presencePenalty,
		maxTokens: params.maxTokens ?? current.maxTokens
	};
}
function restoreSampler(snapshot, current) {
	if (!snapshot) return current;
	return {
		...current,
		temperature: snapshot.temperature,
		topP: snapshot.topP,
		frequencyPenalty: snapshot.frequencyPenalty,
		presencePenalty: snapshot.presencePenalty,
		maxTokens: snapshot.maxTokens
	};
}
function presetStyle(settings, task, chat) {
	if (task === "image" || task === "memory" || task === "rewrite") return {};
	const preset = activePreset(settings);
	if (!preset) return {};
	const ctx = macroContext(chat);
	const sys = substituteMacros(preset.systemPrompt, ctx).trim();
	const post = substituteMacros(preset.postHistory, ctx).trim();
	if (task === "chat") return {
		styleExtra: sys || void 0,
		postHistory: post || void 0
	};
	return { styleExtra: [sys, post].filter(Boolean).join("\n\n") || void 0 };
}
/** Chat top-bar: current pick, then starred models that are still listed. */
function chatPickerModels(starred, available, current) {
	const avail = new Set(available);
	const ids = [];
	if (current) ids.push(current);
	for (const id of starred) if (avail.has(id) && !ids.includes(id)) ids.push(id);
	return ids;
}
/** Drop stars that left the catalog. Keep `current` if it is still the active pick. */
function pruneStarred(starred, available, current) {
	const avail = new Set(available);
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const id of starred) {
		if (!id || seen.has(id)) continue;
		if (avail.has(id) || id === current) {
			seen.add(id);
			out.push(id);
		}
	}
	return out;
}
function snapshotLlmAccount(accounts, base, key, starred, model) {
	const b = base.trim();
	if (!b && !key) return accounts;
	return accounts.map((a) => a.base.trim() === b && a.key === key ? {
		...a,
		starred: [...starred],
		model
	} : a);
}
function applyLlmPick(s, id) {
	const keep = s.llmModels.includes(id) ? void 0 : id;
	const llmStarred = pruneStarred(s.llmStarred, s.llmModels, keep);
	return {
		llmModel: id,
		llmStarred,
		chatSource: "api",
		llmAccounts: snapshotLlmAccount(s.llmAccounts ?? [], s.llmBase, s.llmKey, llmStarred, id)
	};
}
var FOLLOW_IMAGE_AI = "__follow__";
var IMAGE_HDR_GROK = "__hdr_grok__";
var IMAGE_HDR_API = "__hdr_api__";
function llmIdentity(base, key) {
	return `${base.trim()}\n${key}`;
}
function isGrokModelId(id) {
	return GROK_MODELS$1.some((m) => m.id === id);
}
function isGrokish(id) {
	return isGrokModelId(id) || id.startsWith("grok-");
}
function imageAiLabel(id) {
	if (!id || id === "__follow__") return "与聊天一致";
	const g = GROK_MODELS$1.find((m) => m.id === id);
	if (g) return g.short;
	return shortModelLabel(id);
}
function grokList() {
	return GROK_MODELS$1.map((m) => m.id);
}
function pushOpt(rows, seen, id, danger = false) {
	if (!id || seen.has(id)) return;
	seen.add(id);
	rows.push(danger ? {
		id,
		danger: true
	} : { id });
}
function imagePickerModels(input) {
	const grok = grokList();
	const grokSet = new Set(grok);
	const apiOn = Boolean(input.llmConnected);
	const api = apiOn ? chatPickerModels(input.llmStarred, input.llmModels, input.llmModel) : [];
	const apiSet = new Set(api);
	const catalog = new Set(input.llmModels);
	const pick = input.imageModelId || "";
	const leftover = pick && pick !== "__follow__" && !grokSet.has(pick) && !apiSet.has(pick) ? pick : "";
	const extraGrok = leftover && isGrokish(leftover) ? leftover : "";
	const extraApi = leftover && !isGrokish(leftover) ? leftover : "";
	const apiDanger = Boolean(extraApi && (!apiOn || !catalog.has(extraApi)));
	const grokDanger = Boolean(extraGrok && !grokSet.has(extraGrok));
	const rows = [];
	const seen = /* @__PURE__ */ new Set();
	pushOpt(rows, seen, FOLLOW_IMAGE_AI);
	const appendGrok = (headed) => {
		const list = extraGrok ? [...grok, extraGrok] : grok;
		if (headed) rows.push({
			id: IMAGE_HDR_GROK,
			header: "Grok"
		});
		for (const id of list) pushOpt(rows, seen, id, id === extraGrok && grokDanger);
	};
	const appendApi = (headed) => {
		const list = extraApi ? [...api, extraApi] : api;
		if (!list.length) return;
		if (headed) rows.push({
			id: IMAGE_HDR_API,
			header: "API"
		});
		for (const id of list) pushOpt(rows, seen, id, id === extraApi && apiDanger);
	};
	if (input.chatSource === "api") {
		appendApi(false);
		appendGrok(true);
	} else {
		appendGrok(false);
		appendApi(true);
	}
	return rows;
}
function applyImageAiPick(current, pick) {
	const pin = current.imageModelPin || null;
	if (!pick || pick === "__follow__") return {
		imageModelId: null,
		imageModelPin: pin
	};
	return {
		imageModelId: pick,
		imageModelPin: isGrokModelId(pick) ? pin : pick
	};
}
function imageWriteFields(imageModelId) {
	const dest = resolveImageWrite(imageModelId);
	if (!dest.split) return {};
	if (dest.via === "grok") return {
		via: "grok",
		grokModelId: dest.grokModelId
	};
	return {
		via: "api",
		model: dest.model
	};
}
function resolveImageWrite(imageModelId) {
	if (!imageModelId) return { split: false };
	if (isGrokModelId(imageModelId)) return {
		split: true,
		via: "grok",
		grokModelId: imageModelId
	};
	return {
		split: true,
		via: "api",
		model: imageModelId
	};
}
var idb_exports = /* @__PURE__ */ __exportAll$1({
	cachedUrl: () => cachedUrl,
	db: () => db,
	defaultSettings: () => defaultSettings,
	deleteImage: () => deleteImage,
	getImage: () => getImage,
	imageUrl: () => imageUrl,
	loadAll: () => loadAll,
	putImage: () => putImage,
	rememberUrl: () => rememberUrl
});
var defaultSettings = () => ({
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
	theme: "light"
});
var HuiyuDB = class extends Dexie {
	chats;
	folders;
	cards;
	appearances;
	favorites;
	favGroups;
	history;
	images;
	kv;
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
			kv: "key"
		});
		this.version(2).stores({ favGroups: "id, parentId, order" });
	}
};
var db = new HuiyuDB();
function parseLlmAccounts(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		if (!row || typeof row !== "object") continue;
		const a = row;
		if (typeof a.id !== "string" || typeof a.name !== "string") continue;
		out.push({
			id: a.id,
			name: a.name,
			base: typeof a.base === "string" ? a.base : "",
			key: typeof a.key === "string" ? a.key : "",
			starred: Array.isArray(a.starred) ? a.starred.filter((id) => typeof id === "string") : void 0,
			model: typeof a.model === "string" ? a.model : void 0
		});
	}
	return out;
}
async function loadAll() {
	const [chats, folders, cards, appearances, favorites, favGroups, history, settingsRow] = await Promise.all([
		db.chats.toArray(),
		db.folders.toArray(),
		db.cards.toArray(),
		db.appearances.toArray(),
		db.favorites.toArray(),
		db.favGroups.toArray(),
		db.history.toArray(),
		db.kv.get("settings")
	]);
	const raw = settingsRow?.value ?? void 0;
	const stPresets = parseStPresets(raw?.stPresets);
	const stActiveId = typeof raw?.stActiveId === "string" && stPresets.some((p) => p.id === raw.stActiveId) ? raw.stActiveId : null;
	return {
		chats,
		folders,
		cards,
		appearances,
		favorites,
		favGroups,
		history,
		settings: {
			...defaultSettings(),
			...raw ?? {},
			grokModelId: migrateGrokId(raw?.grokModelId),
			llmParams: mergeLlmParams(raw?.llmParams),
			llmModels: raw?.llmModels ?? [],
			llmStarred: raw?.llmStarred ?? [],
			llmAccounts: parseLlmAccounts(raw?.llmAccounts),
			stPresets,
			stActiveId,
			stParamSnapshot: stActiveId && raw?.stParamSnapshot ? mergeLlmParams(raw.stParamSnapshot) : null,
			chatSource: raw?.chatSource === "api" && raw?.llmConnected ? "api" : "grok",
			chatImage: raw?.chatImage !== false,
			imageModelId: typeof raw?.imageModelId === "string" ? raw.imageModelId : null,
			imageModelPin: typeof raw?.imageModelPin === "string" ? raw.imageModelPin : null,
			llmIdentity: typeof raw?.llmIdentity === "string" && raw.llmIdentity ? raw.llmIdentity : raw?.llmConnected && raw?.llmBase && raw?.llmKey ? llmIdentity(String(raw.llmBase), String(raw.llmKey)) : ""
		}
	};
}
async function putImage(id, blob) {
	await db.images.put({
		id,
		blob
	});
}
async function getImage(id) {
	return (await db.images.get(id))?.blob ?? null;
}
async function deleteImage(id) {
	await db.images.delete(id);
}
var urlCache = /* @__PURE__ */ new Map();
async function imageUrl(id) {
	if (!id) return null;
	const cached = urlCache.get(id);
	if (cached) return cached;
	const blob = await getImage(id);
	if (!blob) return null;
	const url = URL.createObjectURL(blob);
	urlCache.set(id, url);
	return url;
}
function rememberUrl(id, blob) {
	const prev = urlCache.get(id);
	if (prev) URL.revokeObjectURL(prev);
	const url = URL.createObjectURL(blob);
	urlCache.set(id, url);
	return url;
}
function cachedUrl(id) {
	return id ? urlCache.get(id) ?? null : null;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CMbMyqb9.js
var routes_CMbMyqb9_exports = /* @__PURE__ */ __exportAll({
	a: () => cancelMemory,
	c: () => regenMessage,
	component: () => Home,
	d: () => sendOpening,
	f: () => sendUser,
	i: () => cancelImage,
	l: () => retryMemory,
	n: () => attachImage,
	o: () => editMessage,
	r: () => branchFrom,
	s: () => invalidateMemory,
	t: () => abortChat,
	u: () => runManualMemory
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
function presetNameFrom(params) {
	const t = joinPromptParts(params.promptFront, params.promptMid, params.promptBack).replace(/\s+/g, " ").trim();
	if (!t) return "未命名";
	return t.length > 28 ? t.slice(0, 28) + "…" : t;
}
function migrateFavorite(raw) {
	if (!raw || typeof raw !== "object") return null;
	const f = raw;
	if (!f.id) return null;
	if (f.params && typeof f.name === "string") return {
		id: f.id,
		name: f.name || "未命名",
		params: f.params,
		blobId: f.blobId,
		createdAt: f.createdAt || Date.now(),
		groupId: typeof f.groupId === "string" ? f.groupId : null,
		starred: f.starred === true,
		...typeof f.order === "number" ? { order: f.order } : {}
	};
	return {
		id: f.id || uid("fav_"),
		name: String(f.prompt || "").slice(0, 28) || "未命名",
		params: {
			...defaultPureParams(),
			promptMid: f.prompt || "",
			seed: f.seed ?? null
		},
		blobId: f.blobId,
		createdAt: f.createdAt || Date.now(),
		groupId: null,
		...typeof f.order === "number" ? { order: f.order } : {}
	};
}
function promptPreview(p) {
	if (p.merged) return p.promptMid;
	return joinPromptParts(p.promptFront, p.promptMid, p.promptBack);
}
function baseSettings() {
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
		theme: "light"
	};
}
function rec(v) {
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function str(v, fallback = "") {
	return typeof v === "string" ? v : fallback;
}
function num(v, fallback) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		if (Number.isFinite(n)) return n;
	}
	return fallback;
}
function bool(v, fallback = false) {
	return typeof v === "boolean" ? v : fallback;
}
function isLegacyArchive(raw) {
	const o = rec(raw);
	if (!o) return false;
	if (o.kind === "huiyu-archive") return true;
	if (Array.isArray(o.roles) && !Array.isArray(o.chats)) return true;
	return false;
}
function pickArchiveJson(files) {
	const names = [
		"huiyu.json",
		"data.json",
		"archive.json"
	];
	const entries = Object.entries(files);
	for (const want of names) {
		const hit = entries.find(([k]) => {
			return k.replace(/\\/g, "/").replace(/^\.\//, "").split("/").pop() === want;
		});
		if (hit) return hit[1];
	}
}
function collectPngs(files) {
	const out = /* @__PURE__ */ new Map();
	for (const [path, data] of Object.entries(files)) {
		const base = path.replace(/\\/g, "/").split("/").pop() || "";
		const m = /^(.*)\.png$/i.exec(base);
		if (!m) continue;
		let id = m[1];
		try {
			id = decodeURIComponent(id);
		} catch {}
		if (id) out.set(id, data);
	}
	return out;
}
function blobFromBase64(raw) {
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
function collectEmbeddedImages(raw) {
	const out = /* @__PURE__ */ new Map();
	const images = rec(rec(raw)?.images);
	if (!images) return out;
	for (const [id, val] of Object.entries(images)) {
		if (typeof val !== "string") continue;
		const blob = blobFromBase64(val);
		if (blob) out.set(id, blob);
	}
	return out;
}
function migrateNaiModel(id) {
	const s = str(id);
	if (NAI_MODELS.some((m) => m.id === s)) return s;
	return "nai-diffusion-4-5-full";
}
function migrateSampler(id) {
	const s = str(id);
	if (SAMPLERS.some((m) => m.id === s)) return s;
	return "k_euler_ancestral";
}
function migrateNoise(id) {
	const s = str(id);
	if (NOISE_SCHEDULES.some((m) => m.id === s)) return s;
	return "karras";
}
function extrasFrom(raw) {
	if (!Array.isArray(raw)) return [];
	return raw.map((e, i) => {
		const o = rec(e) || {};
		const body = str(o.body) || str(o.text) || str(o.title);
		return {
			id: str(o.id, `ex_${i}`),
			body,
			...o.applyImage === true ? { applyImage: true } : {},
			...o.emphasize === true ? { emphasize: true } : {}
		};
	});
}
function convertImageParams(raw) {
	const base = defaultImageParams();
	const o = rec(raw);
	if (!o) return base;
	const seedRaw = o.seed;
	let seed = null;
	if (typeof seedRaw === "number" && Number.isFinite(seedRaw)) seed = seedRaw;
	else if (typeof seedRaw === "string" && seedRaw.trim() !== "") {
		const n = Number(seedRaw);
		seed = Number.isFinite(n) ? n : null;
	}
	const characters = Array.isArray(o.characters) ? o.characters.map((c, i) => {
		const ch = rec(c) || {};
		return {
			id: str(ch.id, `char_${i}`),
			name: str(ch.name),
			enabled: ch.enabled !== false,
			prompt: str(ch.prompt),
			uc: str(ch.uc),
			x: num(ch.x, .5),
			y: num(ch.y, .5)
		};
	}) : [];
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
		ucPreset: [
			"heavy",
			"light",
			"human",
			"custom"
		].includes(str(o.ucPreset)) ? o.ucPreset : "heavy",
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
		characters
	};
}
function charactersFromDraft(draft, imageParams) {
	const multi = bool(draft.multi);
	const cast = Array.isArray(draft.cast) ? draft.cast : [];
	const fromCast = (c, i) => {
		const o = rec(c) || {};
		const id = str(o.id, emptyCharacter(i + 1).id);
		const pc = imageParams.characters.find((x) => x.id === id || o.name && x.name === o.name);
		return {
			...emptyCharacter(i + 1),
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
			x: num(o.x ?? pc?.x, .5),
			y: num(o.y ?? pc?.y, .5)
		};
	};
	if (multi && cast.length) return cast.map(fromCast);
	const first = rec(cast[0]);
	const pc = imageParams.characters[0];
	const ch = emptyCharacter(1);
	return [{
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
		x: num(first?.x ?? pc?.x, .5),
		y: num(first?.y ?? pc?.y, .5)
	}];
}
function alignImageChars(params, characters) {
	if (params.characters.length) return {
		...params,
		characters: params.characters.map((pc) => {
			const match = characters.find((c) => c.id === pc.id) || characters.find((c) => c.name && c.name === pc.name);
			return match ? {
				...pc,
				name: pc.name || match.name,
				id: match.id
			} : pc;
		})
	};
	return {
		...params,
		characters: characters.map((c) => ({
			id: c.id,
			name: c.name,
			enabled: c.imageEnabled,
			prompt: c.prompt || c.appearance,
			uc: c.uc,
			x: c.x,
			y: c.y
		}))
	};
}
function convertGenImage(img, createdAt) {
	const o = rec(img) || {};
	const id = str(o.id, uid("img_"));
	return {
		id,
		blobId: str(o.blobId, id),
		prompt: str(o.prompt),
		charTails: void 0,
		negative: str(o.negative),
		seed: num(o.seed, 0),
		model: migrateNaiModel(o.model),
		width: num(o.width, 832),
		height: num(o.height, 1216),
		steps: num(o.steps, 28),
		sampler: migrateSampler(o.sampler),
		status: "done",
		createdAt
	};
}
function convertMessage(m, characters) {
	const o = rec(m) || {};
	const createdAt = num(o.createdAt, Date.now());
	const imagesRaw = Array.isArray(o.images) && o.images.length ? o.images : o.image ? [o.image] : [];
	const speakerId = str(o.speakerId) || void 0;
	const speakerName = str(o.speakerName) || void 0;
	const match = speakerId ? characters.find((c) => c.id === speakerId) : speakerName ? characters.find((c) => c.name === speakerName) : void 0;
	const role = o.role === "user" ? "user" : o.role === "narrator" ? "narrator" : "assistant";
	return {
		id: str(o.id, uid("msg_")),
		role,
		characterId: match?.id ?? speakerId,
		characterName: match?.name || speakerName,
		content: str(o.content, str(o.text)),
		images: imagesRaw.map((img) => convertGenImage(img, createdAt)),
		createdAt
	};
}
function convertRole(role, grokModelId) {
	const o = rec(role) || {};
	const draft = rec(o.draft) || {};
	let imageParams = convertImageParams(o.imageParams);
	if (o.customTagSuggest === false) imageParams = {
		...imageParams,
		tagSuggest: false
	};
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
		memorySnaps: memory ? [{
			covered: memoryUntil,
			text: memory,
			foldAt: memoryUntil
		}] : [],
		characters,
		imageParams,
		messages: Array.isArray(o.messages) ? o.messages.map((m) => convertMessage(m, characters)) : [],
		avatarBlobId: str(o.avatarImageId, str(o.avatarBlobId)) || void 0,
		scrollTop: 0
	};
}
function convertFolder(f, i) {
	const o = rec(f) || {};
	return {
		id: str(o.id, uid("folder_")),
		name: str(o.name, "未命名"),
		starred: bool(o.starred),
		collapsed: bool(o.collapsed),
		order: num(o.order, num(o.sort, i)),
		createdAt: num(o.createdAt, Date.now())
	};
}
function convertPersonaCard(c, i, grokModelId) {
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
		order: i
	};
}
function convertAppearance(c, i) {
	const o = rec(c) || {};
	return {
		id: str(o.id, uid("ap_")),
		name: str(o.name, "未命名"),
		prompt: str(o.prompt),
		order: num(o.order, i),
		createdAt: num(o.createdAt, Date.now())
	};
}
function convertHistory(h) {
	const o = rec(h) || {};
	const params = convertImageParams(o.params);
	const id = str(o.id, uid("hist_"));
	return {
		id,
		blobId: str(o.blobId, str(o.imageId, id)) || void 0,
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
		status: "done"
	};
}
function presetToAppearance(p, i) {
	const o = rec(p) || {};
	const params = convertImageParams(o.params);
	const prompt = str(o.prompt) || params.promptMid || [
		params.promptFront,
		params.promptMid,
		params.promptBack
	].filter(Boolean).join(", ");
	const name = str(o.name);
	if (!name && !prompt) return null;
	return {
		id: str(o.id, uid("preset_")),
		name: name || "未命名预设",
		prompt,
		order: 1e3 + i,
		createdAt: num(o.createdAt, Date.now())
	};
}
function convertLegacyArchive(raw) {
	const o = rec(raw);
	if (!o) throw new Error("无法识别的存档");
	const settingsIn = rec(o.settings);
	const grokModelId = migrateGrokId(str(settingsIn?.grokModel, str(settingsIn?.grokModelId, DEFAULT_GROK)));
	const settings = {
		...baseSettings(),
		grokModelId,
		theme: settingsIn?.theme === "dark" ? "dark" : "light"
	};
	const chats = Array.isArray(o.roles) ? o.roles.map((r) => convertRole(r, grokModelId)) : [];
	const folders = Array.isArray(o.folders) ? o.folders.map(convertFolder) : [];
	const cards = Array.isArray(o.personaCards) ? o.personaCards.map((c, i) => convertPersonaCard(c, i, grokModelId)) : [];
	const appearances = Array.isArray(o.appearanceCards) ? o.appearanceCards.map(convertAppearance) : [];
	const seen = new Set(appearances.map((a) => a.id));
	if (Array.isArray(o.purePresets)) o.purePresets.forEach((p, i) => {
		const a = presetToAppearance(p, i);
		if (a && !seen.has(a.id)) {
			appearances.push(a);
			seen.add(a.id);
		}
	});
	const history = Array.isArray(o.pureHistory) ? o.pureHistory.map(convertHistory) : [];
	const pureParams = o.pureParams ? convertImageParams(o.pureParams) : defaultPureParams();
	const currentId = typeof o.activeRoleId === "string" && chats.some((c) => c.id === o.activeRoleId) ? o.activeRoleId : [...chats].sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null;
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
			hasImages: o.imagesIncluded !== false
		},
		currentId,
		pureParams
	};
}
async function exportArchive(kind) {
	const [chats, folders, cards, appearances, favorites, favGroups, history, settingsRow] = await Promise.all([
		db.chats.toArray(),
		db.folders.toArray(),
		db.cards.toArray(),
		db.appearances.toArray(),
		db.favorites.toArray(),
		db.favGroups.toArray(),
		db.history.toArray(),
		db.kv.get("settings")
	]);
	const dump = {
		version: 1,
		settings: settingsRow?.value ?? {
			grokModelId: "grok-4.6-medium",
			chatSource: "grok",
			llmBase: "",
			llmKey: "",
			llmConnected: false,
			llmModel: "",
			llmModels: [],
			llmStarred: [],
			llmAccounts: [],
			llmParams: {
				temperature: .9,
				topP: 1,
				frequencyPenalty: 0,
				presencePenalty: .4,
				maxTokens: 4096,
				contextTurns: 16
			},
			stPresets: [],
			stActiveId: null,
			stParamSnapshot: null,
			naiKey: "",
			naiBase: "https://api.idlecloud.cc",
			naiConnected: false,
			cooldownUntil: 0,
			chatImage: true,
			theme: "light"
		},
		folders,
		chats,
		cards,
		appearances,
		favorites,
		favGroups,
		history,
		hasImages: kind === "full"
	};
	if (kind === "lite") {
		dump.favorites = (dump.favorites ?? []).map((f) => ({
			...f,
			blobId: void 0
		}));
		dump.history = (dump.history ?? []).map((h) => ({
			...h,
			blobId: void 0
		}));
		downloadBlob(new Blob([JSON.stringify(dump)], { type: "application/json" }), `绘语-无配图-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		return;
	}
	const files = { "huiyu.json": strToU8(JSON.stringify(dump)) };
	const images = await db.images.toArray();
	for (const img of images) {
		const buf = new Uint8Array(await img.blob.arrayBuffer());
		files[`images/${img.id}.png`] = buf;
	}
	const zipped = zipSync(files, { level: 1 });
	downloadBlob(new Blob([zipped], { type: "application/zip" }), `绘语-全部-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
}
async function importArchive(file) {
	const name = file.name.toLowerCase();
	let raw;
	const imageBlobs = /* @__PURE__ */ new Map();
	const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
	if (name.endsWith(".zip") || head[0] === 80 && head[1] === 75) {
		const buf = new Uint8Array(await file.arrayBuffer());
		let unzipped;
		try {
			unzipped = unzipSync(buf);
		} catch {
			throw new Error("无法识别的存档");
		}
		const jsonFile = pickArchiveJson(unzipped);
		if (!jsonFile) throw new Error("无法识别的存档");
		try {
			raw = JSON.parse(strFromU8(jsonFile));
		} catch {
			throw new Error("无法识别的存档");
		}
		for (const [id, data] of collectPngs(unzipped)) imageBlobs.set(id, new Blob([data], { type: "image/png" }));
	} else try {
		raw = JSON.parse(await file.text());
	} catch {
		throw new Error("无法识别的存档");
	}
	for (const [id, blob] of collectEmbeddedImages(raw)) if (!imageBlobs.has(id)) imageBlobs.set(id, blob);
	let dump;
	let currentId;
	let pureParams;
	if (isLegacyArchive(raw)) {
		const loaded = convertLegacyArchive(raw);
		dump = loaded.dump;
		currentId = loaded.currentId;
		pureParams = loaded.pureParams;
	} else {
		dump = raw;
		if (!dump || dump.version !== 1 || !Array.isArray(dump.chats)) throw new Error("无法识别的存档");
	}
	const tables = [
		db.chats,
		db.folders,
		db.cards,
		db.appearances,
		db.favorites,
		db.favGroups,
		db.history,
		db.images,
		db.kv
	];
	await db.transaction("rw", tables, async () => {
		await db.chats.clear();
		await db.folders.clear();
		await db.cards.clear();
		await db.appearances.clear();
		await db.favorites.clear();
		await db.favGroups.clear();
		await db.history.clear();
		await db.images.clear();
		await db.chats.bulkPut(dump.chats ?? []);
		await db.folders.bulkPut(dump.folders ?? []);
		await db.cards.bulkPut(dump.cards ?? []);
		await db.appearances.bulkPut(dump.appearances ?? []);
		await db.favorites.bulkPut((dump.favorites ?? []).map(migrateFavorite).filter(Boolean));
		await db.favGroups.bulkPut((dump.favGroups ?? []).filter((g) => g && typeof g.id === "string"));
		await db.history.bulkPut(dump.history ?? []);
		const prevVal = (await db.kv.get("settings"))?.value ?? void 0;
		const dumpS = dump.settings;
		const merged = {
			...prevVal ?? {},
			...dumpS,
			naiKey: dumpS?.naiKey || prevVal?.naiKey || "",
			llmKey: dumpS?.llmKey || prevVal?.llmKey || "",
			llmAccounts: Array.isArray(dumpS?.llmAccounts) ? dumpS.llmAccounts : prevVal?.llmAccounts ?? [],
			stPresets: Array.isArray(dumpS?.stPresets) ? dumpS.stPresets : prevVal?.stPresets ?? [],
			stActiveId: dumpS?.stActiveId ?? prevVal?.stActiveId ?? null,
			stParamSnapshot: dumpS?.stParamSnapshot ?? prevVal?.stParamSnapshot ?? null
		};
		await db.kv.put({
			key: "settings",
			value: merged
		});
		if (currentId !== void 0) await db.kv.put({
			key: "currentId",
			value: currentId
		});
		if (pureParams) await db.kv.put({
			key: "pureParams",
			value: pureParams
		});
	});
	for (const [id, blob] of imageBlobs) await putImage(id, blob);
}
function cloneChat(chat, nameSuffix = "(副本)") {
	const id = uid("chat_");
	return {
		...structuredClone(chat),
		id,
		name: chat.name ? `${chat.name}${nameSuffix}` : "未命名" + nameSuffix,
		starred: false,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		isDraft: false,
		messages: structuredClone(chat.messages)
	};
}
function naiMeta(model) {
	return NAI_MODELS.find((m) => m.id === model);
}
function naiFamily(model) {
	return naiMeta(model)?.family ?? "v4.5";
}
function naiWire(model) {
	return naiMeta(model)?.wire || model;
}
function joinPrompt(params, grokTail = "") {
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
	if (furry && !/fur dataset/i.test(front) && !/fur dataset/i.test(params.promptMid)) front = joinPromptParts(FURRY_TAG, front);
	if (params.uncensored && !/uncensored/i.test(front)) front = joinPromptParts(front, UNCENSORED_TAG);
	if (params.fullBody && !/full body/i.test(front)) front = joinPromptParts(front, FULLBODY_TAG);
	const mid = joinPromptParts(params.promptMid, grokTail);
	let back = params.promptBack.trim();
	if (params.sensitive && !/rating:\s*sensitive/i.test(back)) back = joinPromptParts(SENSITIVE_PREFIX, back);
	return joinPromptParts(front, mid, back);
}
function varietySigma(w, h) {
	return Math.round(19 * Math.sqrt(w * h / 393216) * 100) / 100;
}
function buildNaiPayload(opts) {
	const { params, grokTail = "", charTails = {}, insertMode = "insert" } = opts;
	const seed = opts.seed ?? params.seed ?? randomSeed();
	const family = naiFamily(params.model);
	const v3 = family === "v3";
	const chars = params.characters.filter((c) => c.enabled);
	const charCaptions = chars.map((c) => ({
		char_caption: [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", "),
		centers: [{
			x: c.x,
			y: c.y
		}]
	}));
	const charUc = chars.map((c) => ({
		char_caption: c.uc.trim(),
		centers: [{
			x: c.x,
			y: c.y
		}]
	}));
	let base = joinPrompt(params, grokTail);
	if (!v3 && insertMode === "legacy" && chars.length) {
		const extra = chars.map((c, i) => {
			const body = [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", ");
			return `char${i + 1}: ${body}`;
		}).join(", ");
		base = [base, extra].filter(Boolean).join(", ");
	}
	const useCoords = params.useCoords;
	const characterPrompts = chars.map((c) => ({
		prompt: [c.prompt.trim(), charTails[c.id] ?? ""].filter(Boolean).join(", "),
		uc: c.uc.trim(),
		center: {
			x: c.x,
			y: c.y
		},
		enabled: true
	}));
	const parameters = {
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
		prefer_brownian: params.sampler.includes("ancestral") || params.sampler.includes("sde")
	};
	if (!v3 && insertMode === "insert") {
		parameters.characterPrompts = characterPrompts;
		parameters.v4_prompt = {
			caption: {
				base_caption: base,
				char_captions: charCaptions
			},
			use_coords: useCoords,
			use_order: true
		};
		parameters.v4_negative_prompt = {
			caption: {
				base_caption: params.negative,
				char_captions: charUc
			},
			legacy_uc: false
		};
	} else if (!v3) {
		parameters.v4_prompt = {
			caption: {
				base_caption: base,
				char_captions: []
			},
			use_coords: false,
			use_order: true
		};
		parameters.v4_negative_prompt = {
			caption: {
				base_caption: params.negative,
				char_captions: []
			},
			legacy_uc: false
		};
	}
	return {
		input: base,
		model: naiWire(params.model),
		action: "generate",
		parameters,
		seed,
		finalPrompt: base,
		characterPrompts
	};
}
function buildIdlecloudBody(built, params, insertMode = "insert", img2img) {
	const body = {
		model: built.model,
		positivePrompt: built.finalPrompt,
		negativePrompt: params.negative,
		width: params.width,
		height: params.height,
		steps: params.steps,
		scale: params.scale,
		sampler: params.sampler,
		seed: built.seed,
		noise_schedule: params.noiseSchedule,
		promptGuidanceRescale: params.cfgRescale,
		sm: false,
		sm_dyn: false,
		autoSmea: false,
		decrisp: params.decrisper,
		variety: params.varietyPlus,
		prefer_brownian: params.sampler.includes("ancestral") || params.sampler.includes("sde"),
		deliberate_euler_ancestral_bug: false,
		legacy: false,
		legacy_uc: false,
		legacy_v3_extend: false,
		use_coords: params.useCoords,
		use_upscale_credits: false
	};
	if (naiFamily(params.model) !== "v3" && insertMode === "insert" && built.characterPrompts.length > 0) {
		body.characterPrompts = built.characterPrompts;
		body.v4_prompt_char_captions = built.characterPrompts.map((c) => ({
			char_caption: c.prompt,
			centers: [{
				x: c.center.x,
				y: c.center.y
			}]
		}));
		body.v4_negative_prompt_char_captions = built.characterPrompts.map((c) => ({
			char_caption: c.uc,
			centers: [{
				x: c.center.x,
				y: c.center.y
			}]
		}));
	}
	if (img2img) {
		body.action = true;
		body.image = img2img.image;
		body.strength = img2img.strength;
		body.noise = img2img.noise;
	}
	return body;
}
function syncCharsFromRole(params, roles, isMulti) {
	if (!isMulti) return {
		...params,
		characters: []
	};
	const next = roles.map((r) => {
		const prev = params.characters.find((c) => c.id === r.id);
		return {
			id: r.id,
			name: r.name,
			enabled: prev ? prev.enabled : r.imageEnabled,
			prompt: prev?.prompt || r.prompt || r.appearance || "",
			uc: prev?.uc || r.uc || "",
			x: prev?.x ?? r.x ?? .5,
			y: prev?.y ?? r.y ?? .5
		};
	});
	return {
		...params,
		characters: next
	};
}
function samplerLabel(id) {
	if (id === "k_euler_ancestral") return "Euler A";
	if (id === "k_euler") return "Euler";
	if (id === "k_dpmpp_2s_ancestral") return "DPM++ 2S A";
	if (id === "k_dpmpp_2m") return "DPM++ 2M";
	if (id === "k_dpmpp_sde") return "DPM++ SDE";
	if (id === "k_dpmpp_2m_sde") return "DPM++ 2M SDE";
	if (id === "ddim_v3") return "DDIM";
	return id;
}
function samplerShort(id) {
	if (id === "k_euler_ancestral") return "Euler A...";
	return samplerLabel(id);
}
function modelLabel(id) {
	return NAI_MODELS.find((m) => m.id === id)?.label ?? id;
}
function modelShort(id) {
	const m = naiMeta(id);
	if (!m) return id;
	if (m.family === "v3") return m.furry ? "F3" : "3";
	if (m.family === "v5") return id.includes("curated") ? "5C" : "5";
	if (m.family === "v4.5") return id.includes("curated") ? "4.5C" : "4.5";
	if (m.family === "v4") return id.includes("curated") ? "4C" : "4";
	return m.label.replace(/^NAI\s+/i, "").replace(/\s*Full$/i, "");
}
var TOP = /* @__PURE__ */ new Set([
	"think",
	"think_nya",
	"think_nya~",
	"game",
	"background",
	"options",
	"option",
	"details",
	"summary",
	"os",
	"disclaimer",
	"safety_check",
	"im_start",
	"im_end",
	"pad",
	"pad_end",
	"censorship_bypass"
]);
function matchTag(s, i) {
	if (s[i] !== "<") return null;
	if (s.startsWith("<!", i)) {
		const end = s.indexOf(">", i + 2);
		return {
			start: i,
			end: end < 0 ? s.length : end + 1,
			name: "!--",
			closing: false
		};
	}
	const slice = s.slice(i);
	const pipe = slice.match(/^<\|([a-zA-Z_][\w-]*)\|>/);
	if (pipe) return {
		start: i,
		end: i + pipe[0].length,
		name: pipe[1].toLowerCase(),
		closing: false
	};
	const close = slice.match(/^<\/([a-zA-Z][\w:~-]*)\s*>/);
	if (close) return {
		start: i,
		end: i + close[0].length,
		name: close[1].toLowerCase(),
		closing: true
	};
	const open = slice.match(/^<([a-zA-Z][\w:~-]*)(?:\s[^>]*)?>/);
	if (open) return {
		start: i,
		end: i + open[0].length,
		name: open[1].toLowerCase(),
		closing: false
	};
	return null;
}
function findClose(s, from, name) {
	let depth = 1;
	let i = from;
	while (i < s.length) {
		const lt = s.indexOf("<", i);
		if (lt < 0) return -1;
		const t = matchTag(s, lt);
		if (!t) {
			i = lt + 1;
			continue;
		}
		if (t.name === name) {
			if (t.closing) {
				depth--;
				if (depth === 0) return t.start;
			} else depth++;
		}
		i = t.end;
	}
	return -1;
}
var CHILDREN = {
	details: /* @__PURE__ */ new Set(["summary"]),
	options: /* @__PURE__ */ new Set(["option"])
};
function nextTopOpen(s, from, parent) {
	const skip = parent ? CHILDREN[parent] : void 0;
	let i = from;
	while (i < s.length) {
		const lt = s.indexOf("<", i);
		if (lt < 0) return -1;
		const t = matchTag(s, lt);
		if (!t) {
			i = lt + 1;
			continue;
		}
		if (!t.closing && TOP.has(t.name) && !skip?.has(t.name)) return t.start;
		i = t.end;
	}
	return -1;
}
function decodeUnicodeEscapes(input) {
	if (!input || !input.includes("\\u")) return input;
	let s = input;
	const hold = s.match(/\\u(?:\{[0-9a-fA-F]{0,5}|[0-9a-fA-F]{0,3})$/);
	const tail = hold ? hold[0] : "";
	if (tail) s = s.slice(0, -tail.length);
	s = s.replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (full, h) => {
		const n = Number.parseInt(h, 16);
		return Number.isFinite(n) && n <= 1114111 ? String.fromCodePoint(n) : full;
	});
	s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_full, h) => String.fromCharCode(Number.parseInt(h, 16)));
	return s + tail;
}
function hideIncomplete(s) {
	const i = s.lastIndexOf("<");
	if (i < 0) return s;
	const tail = s.slice(i);
	if (tail.includes(">")) return s;
	if (tail === "<" || tail === "</" || /^<\/?[a-zA-Z|][\w:~|-]*$/.test(tail) || /^<\|[\w-]*$/.test(tail) || tail === "<!") return s.slice(0, i);
	return s;
}
function stripReplyTags(s) {
	let cur = s;
	let prev = "";
	for (let n = 0; n < 10 && cur !== prev; n++) {
		prev = cur;
		cur = cur.replace(/<[a-zA-Z|][\w:~|-]*\b[^>]*>([\s\S]*?)<\/[a-zA-Z|][\w:~|-]*\s*>/g, "$1");
		cur = cur.replace(/<\/?[a-zA-Z|][\w:~|-]*(?:\s[^>]*)?\/?>/g, "");
		cur = cur.replace(/<\|[\w-]*\|>/g, "");
	}
	return cur.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function tidy(s) {
	return stripReplyTags(s);
}
function detailsParts(inner) {
	const m = inner.match(/^\s*<summary\b[^>]*>([\s\S]*?)<\/summary\s*>/i);
	if (m) return {
		title: tidy(m[1]) || "折叠",
		body: tidy(inner.slice(m[0].length))
	};
	const open = inner.match(/^\s*<summary\b[^>]*>([\s\S]*)$/i);
	if (open) return {
		title: tidy(open[1]) || "折叠",
		body: ""
	};
	return {
		title: "折叠",
		body: tidy(inner)
	};
}
function parseOptions(inner) {
	const out = [];
	const re = /<option\b[^>]*>([\s\S]*?)(?:<\/option\s*>|$)/gi;
	let m;
	while (m = re.exec(inner)) {
		const t = tidy(m[1]);
		if (t) out.push(t);
	}
	if (!out.length) for (const line of tidy(inner).split(/\n+/)) {
		const t = line.trim();
		if (t) out.push(t);
	}
	return out;
}
function thinkTitle(name) {
	return name === "os" ? "内心" : "思考";
}
function sliceInner(s, openEnd, name) {
	const close = findClose(s, openEnd, name);
	const next = nextTopOpen(s, openEnd, name);
	if (close >= 0 && (next < 0 || close <= next)) {
		const t = matchTag(s, close);
		return {
			inner: s.slice(openEnd, close),
			after: t ? t.end : close
		};
	}
	if (next >= 0) return {
		inner: s.slice(openEnd, next),
		after: next
	};
	return {
		inner: s.slice(openEnd),
		after: s.length
	};
}
function parseReplyMarkup(raw) {
	const text = hideIncomplete(decodeUnicodeEscapes(raw || ""));
	const think = [];
	const notes = [];
	const options = [];
	const bodySegs = [];
	let i = 0;
	const pushNote = (title, body) => {
		const t = title.trim() || "折叠";
		const b = body.trim();
		if (!b && !t) return;
		notes.push({
			kind: "note",
			title: t,
			body: b
		});
	};
	while (i < text.length) {
		const lt = text.indexOf("<", i);
		if (lt < 0) {
			bodySegs.push(text.slice(i));
			break;
		}
		if (lt > i) bodySegs.push(text.slice(i, lt));
		const t = matchTag(text, lt);
		if (!t) {
			bodySegs.push(text[lt]);
			i = lt + 1;
			continue;
		}
		if (t.closing || t.name === "!--") {
			i = t.end;
			continue;
		}
		if (!TOP.has(t.name)) {
			const { inner, after } = sliceInner(text, t.end, t.name);
			bodySegs.push(inner);
			i = after;
			continue;
		}
		const { inner, after } = sliceInner(text, t.end, t.name);
		if (t.name === "think" || t.name === "think_nya" || t.name === "think_nya~" || t.name === "os") {
			const body = tidy(inner);
			if (body) think.push({
				kind: "think",
				title: thinkTitle(t.name),
				body
			});
		} else if (t.name === "game") bodySegs.push(inner);
		else if (t.name === "background") pushNote("背景", tidy(inner));
		else if (t.name === "details") {
			const d = detailsParts(inner);
			pushNote(d.title, d.body);
		} else if (t.name === "summary") pushNote("摘要", tidy(inner));
		else if (t.name === "options") options.push(...parseOptions(inner));
		else if (t.name === "option") {
			const o = tidy(inner);
			if (o) options.push(o);
		}
		i = after;
	}
	return {
		body: tidy(bodySegs.join("")),
		folds: [...think, ...notes],
		options
	};
}
function replyStoryText(raw) {
	return parseReplyMarkup(raw).body;
}
function replyContextText(raw) {
	const p = parseReplyMarkup(raw);
	const extra = p.folds.filter((f) => f.kind !== "think").map((f) => f.body).filter(Boolean);
	return [p.body, ...extra].filter(Boolean).join("\n\n");
}
var MEMORY_CHAR_CAP = 3800;
var MEMORY_PARAMS = {
	temperature: .3,
	topP: 1,
	frequencyPenalty: 0,
	presencePenalty: 0,
	maxTokens: 4096
};
function memoryFailReason(e) {
	const err = e;
	if (err?.name === "AbortError") return "已取消";
	const msg = err?.message || "";
	if (msg === "memory-invalid") return "回得太短或不像备忘";
	if (msg === "memory-skip") return "没有可收的对白";
	return msg || "请求失败";
}
function clipMemoryText(text) {
	const t = text.trim();
	if (t.length <= 3800) return t;
	return t.slice(0, MEMORY_CHAR_CAP).replace(/\s+\S*$/, "").trim();
}
function isPlausibleMemory(text) {
	const t = text.trim();
	if (t.length < 24) return false;
	if (/^(好的|收到|ok|done|无|没有|（无）)/i.test(t) && t.length < 80) return false;
	return true;
}
function foldIntervalMessages(contextTurns) {
	return Math.max(4, Math.max(4, contextTurns) - 6) * 2;
}
/** First fold fires one pair before the raw window is full. */
function firstFoldAt(windowMsgs, intervalMsgs) {
	return Math.max(intervalMsgs, windowMsgs - 2);
}
/** How far the current line should be covered if every fold had succeeded. */
function foldCoveredEnd(n, windowMsgs, intervalMsgs) {
	const firstAt = firstFoldAt(windowMsgs, intervalMsgs);
	if (n < firstAt || intervalMsgs < 2) return 0;
	const k = 1 + Math.floor((n - firstAt) / intervalMsgs);
	return Math.min(k * intervalMsgs, n);
}
/** True when memory has reached the target for this length. Opening / too-short is caught up. */
function memoryCaughtUp(n, covered, windowMsgs, intervalMsgs) {
	return covered >= foldCoveredEnd(n, windowMsgs, intervalMsgs);
}
/** Next auto chunk while behind. One interval (or the remaining gap if smaller). */
function nextAutoSlice(n, covered, windowMsgs, intervalMsgs) {
	const needed = foldCoveredEnd(n, windowMsgs, intervalMsgs);
	if (covered >= needed || needed < 2) return null;
	const start = Math.max(0, covered);
	const end = Math.min(needed, start === 0 ? Math.min(intervalMsgs, needed) : start + intervalMsgs);
	if (end - start < 2 || end > n) return null;
	return {
		start,
		end
	};
}
/** Display turns: a user+assistant pair. The opening assistant is the leftover 1. */
function memoryTurnStats(messageCount, covered) {
	return {
		spoken: Math.floor(Math.max(0, messageCount) / 2),
		folded: Math.floor(Math.max(0, covered) / 2)
	};
}
function rewindSnaps(snaps, keepCount) {
	return (snaps ?? []).filter((s) => s.covered <= keepCount && s.covered >= 0);
}
function applySnaps(snaps) {
	const last = snaps[snaps.length - 1];
	return {
		memorySnaps: snaps,
		memory: last?.text ?? "",
		memoryUntil: last?.covered ?? 0,
		memoryFoldAt: last?.foldAt ?? 0
	};
}
function pushSnap(snaps, snap) {
	return [...(snaps ?? []).filter((s) => s.covered < snap.covered), snap];
}
function formatMemoryDialog(messages) {
	return messages.map((m) => {
		const text = (m.role === "user" ? m.content : replyContextText(m.content)).trim();
		if (!text) return "";
		return `${m.role === "user" ? "用户" : m.characterName || "角色"}：${text}`;
	}).filter(Boolean).join("\n");
}
function normalizeChatMemory(c) {
	let snaps = Array.isArray(c.memorySnaps) ? c.memorySnaps.filter((s) => s && typeof s.text === "string" && typeof s.covered === "number") : [];
	if (!snaps.length && c.memory?.trim()) snaps = [{
		covered: Math.max(0, c.memoryUntil || 0),
		text: c.memory,
		foldAt: Math.max(0, c.memoryFoldAt || c.memoryUntil || 0)
	}];
	return {
		...c,
		...applySnaps(snaps)
	};
}
var emptyMemory = () => ({
	memory: "",
	memoryUntil: 0,
	memoryFoldAt: 0,
	memorySnaps: []
});
function settleStuckImages(chat) {
	let dirty = false;
	const messages = chat.messages.map((m) => {
		let imgDirty = false;
		const images = m.images.map((g) => {
			if (g.status === "done" || g.status === "error") return g;
			imgDirty = true;
			return {
				...g,
				status: "error",
				error: "上次生图未完成"
			};
		});
		if (!imgDirty) return m;
		dirty = true;
		return {
			...m,
			images
		};
	});
	return dirty ? {
		...chat,
		messages
	} : chat;
}
function isAbort(e) {
	return (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
}
function imageFailText(e, signal) {
	if (signal?.aborted) return "已取消";
	if (isAbort(e)) return "生图超时";
	return e instanceof Error ? e.message : "生图失败";
}
function prettyImageError(error) {
	const raw = (error ?? "").trim();
	if (!raw) return "生图失败";
	let msg = raw;
	if (raw.startsWith("{")) try {
		const j = JSON.parse(raw);
		if (typeof j.message === "string" && j.message.trim()) msg = j.message.trim();
	} catch {}
	if (/too many concurrent/i.test(msg) || /rate limit/i.test(msg) || /"statusCode"\s*:\s*429/.test(raw)) return "请求太频繁";
	if (/<!doctype|<html|internal server error/i.test(raw)) return "中转站返回了异常页面";
	return msg;
}
function genPhaseLabel(status, error) {
	if (status === "writing") return "写提示词中";
	if (status === "uploading") return "上传中";
	if (status === "generating") return "生图中";
	if (status === "receiving") return "回传中";
	if (status === "error") return prettyImageError(error);
	return "";
}
function sortFavorites(items) {
	return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (b.createdAt || 0) - (a.createdAt || 0));
}
function orderFavorites(items) {
	if (!items.length) return [];
	if (items.every((f) => typeof f.order === "number")) return sortFavorites(items);
	const next = sortHistoryNewestFirst(items).map((f, i) => ({
		...f,
		order: i
	}));
	for (const f of next) db.favorites.put(f);
	return next;
}
function favGroupDescendants(groups, id) {
	const out = /* @__PURE__ */ new Set();
	const walk = (pid) => {
		for (const g of groups) if (g.parentId === pid && !out.has(g.id)) {
			out.add(g.id);
			walk(g.id);
		}
	};
	walk(id);
	return out;
}
function countFavsInGroup(groups, favs, id) {
	let n = favs.filter((f) => f.groupId === id).length;
	for (const g of groups) if (g.parentId === id) n += countFavsInGroup(groups, favs, g.id);
	return n;
}
function tidyFavTree(groups, favs) {
	const byId = new Map(groups.map((g) => [g.id, g]));
	const cleanGroups = groups.map((g) => {
		let parentId = g.parentId && byId.has(g.parentId) && g.parentId !== g.id ? g.parentId : null;
		const seen = /* @__PURE__ */ new Set([g.id]);
		let p = parentId;
		while (p) {
			if (seen.has(p) || !byId.has(p)) {
				parentId = null;
				break;
			}
			seen.add(p);
			p = byId.get(p)?.parentId ?? null;
		}
		return {
			...g,
			name: g.name || "未命名",
			parentId,
			collapsed: g.collapsed !== false,
			order: typeof g.order === "number" ? g.order : 0,
			starred: g.starred === true
		};
	});
	const ids = new Set(cleanGroups.map((g) => g.id));
	return {
		favGroups: cleanGroups,
		favorites: favs.map((f) => ({
			...f,
			groupId: f.groupId && ids.has(f.groupId) ? f.groupId : null
		}))
	};
}
function openFavAncestors(groups, id) {
	if (!id) return groups;
	const byId = new Map(groups.map((g) => [g.id, g]));
	const open = /* @__PURE__ */ new Set();
	let p = id;
	while (p) {
		open.add(p);
		p = byId.get(p)?.parentId ?? null;
	}
	return groups.map((g) => open.has(g.id) ? {
		...g,
		collapsed: false
	} : g);
}
function copyRoleBody(dst, src) {
	return {
		...dst,
		persona: src.persona,
		speech: src.speech,
		appearance: src.appearance,
		lookBlobId: src.lookBlobId,
		personaVoices: src.personaVoices ?? dst.personaVoices,
		extras: src.extras ?? dst.extras
	};
}
function mergeCardCharacters(current, incoming) {
	const next = current.map((ch, i) => incoming[i] ? copyRoleBody(ch, incoming[i]) : ch);
	for (let i = current.length; i < incoming.length; i++) {
		const src = incoming[i];
		if (src) next.push({ ...src });
	}
	return next;
}
var ui0 = () => ({
	tab: "chat",
	sidebar: false,
	connection: false,
	selectMode: false,
	selected: [],
	sortMode: false,
	menuId: null,
	editingChatId: null,
	creating: false,
	previewParams: false,
	saveCardOpen: false,
	saveAppearOpen: false,
	appearTarget: null,
	customPrompt: null,
	confirm: null,
	rename: null,
	moveOpen: false,
	multiCreate: null,
	personalize: null,
	fieldEdit: null,
	polishJob: null,
	extraPromptOpen: false,
	autoPolish: false,
	paramsJump: null,
	llmSettings: false,
	memoryHint: null,
	editUserMsg: null
});
function persistChat(c) {
	if (c.isDraft) return;
	db.chats.put(c);
}
var toastN = 1;
var useApp = create((set, get) => ({
	ready: true,
	settings: defaultSettings(),
	folders: [],
	chats: [],
	cards: [],
	appearances: [],
	favorites: [],
	favGroups: [],
	history: [],
	pureParams: defaultPureParams(),
	currentId: null,
	editBackup: null,
	toasts: [],
	ui: ui0(),
	composerDrafts: {},
	composerShots: {},
	hydrate: async () => {
		const data = await loadAll();
		const [pureRow, currentRow, draftsRow, shotsRow] = await Promise.all([
			db.kv.get("pureParams"),
			db.kv.get("currentId"),
			db.kv.get("composerDrafts"),
			db.kv.get("composerShots")
		]);
		const live = data.chats.filter((c) => !c.isDraft).map((c) => {
			const mapped = {
				...normalizeChatMemory(c),
				grokModelId: migrateGrokId(c.grokModelId),
				imageModelId: c.imageModelId || null,
				imageModelPin: c.imageModelPin || null
			};
			const next = settleStuckImages(mapped);
			if (next !== mapped) persistChat(next);
			return next;
		});
		const settings = {
			...data.settings,
			grokModelId: migrateGrokId(data.settings.grokModelId),
			theme: data.settings.theme === "dark" ? "dark" : "light",
			llmParams: data.settings.llmParams,
			chatSource: data.settings.chatSource === "api" && data.settings.llmConnected ? "api" : "grok"
		};
		const savedId = currentRow?.value || null;
		const currentId = live.some((c) => c.id === savedId) ? savedId : live.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null;
		const lifted = liftImageAi(settings, live, currentId);
		const nextSettings = {
			...settings,
			...lifted
		};
		if (!settings.imageModelId && !settings.imageModelPin && (lifted.imageModelId || lifted.imageModelPin)) db.kv.put({
			key: "settings",
			value: nextSettings
		});
		const favs = orderFavorites((data.favorites ?? []).map(migrateFavorite).filter(Boolean));
		const tree = tidyFavTree(data.favGroups ?? [], favs);
		set({
			ready: true,
			...data,
			settings: nextSettings,
			chats: live,
			favorites: tree.favorites,
			favGroups: tree.favGroups,
			pureParams: normalizePureParams(pureRow?.value ?? defaultPureParams()),
			currentId,
			history: sortHistoryNewestFirst(data.history ?? []),
			composerDrafts: parseComposerDrafts(draftsRow?.value),
			composerShots: parseComposerShots(shotsRow?.value)
		});
	},
	toast: (text) => {
		const id = toastN++;
		set((s) => ({ toasts: [...s.toasts, {
			id,
			text
		}] }));
		setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 1100);
	},
	setUI: (p) => set((s) => ({ ui: {
		...s.ui,
		...p
	} })),
	setTab: (tab) => set((s) => ({ ui: {
		...s.ui,
		tab
	} })),
	setSettings: (p) => {
		const settings = {
			...get().settings,
			...p
		};
		set({ settings });
		db.kv.put({
			key: "settings",
			value: settings
		});
	},
	setGrok: (id) => {
		get().setSettings({ grokModelId: id });
		const cur = get().current();
		if (cur) get().patchChat(cur.id, { grokModelId: id });
	},
	clearImageAi: () => {
		get().setSettings({
			imageModelId: null,
			imageModelPin: null
		});
	},
	current: () => get().chats.find((c) => c.id === get().currentId),
	patchChat: (id, p) => {
		set((s) => ({ chats: s.chats.map((c) => {
			if (c.id !== id) return c;
			const next = typeof p === "function" ? p(c) : {
				...c,
				...p,
				updatedAt: Date.now()
			};
			persistChat(next);
			return next;
		}) }));
	},
	patchParams: (id, p) => {
		if (id === "__pure__") {
			get().setPureParams(p);
			return;
		}
		get().patchChat(id, (c) => ({
			...c,
			imageParams: {
				...c.imageParams,
				...p
			},
			updatedAt: Date.now()
		}));
	},
	setPureParams: (p) => {
		const pureParams = {
			...get().pureParams,
			...p
		};
		set({ pureParams });
		db.kv.put({
			key: "pureParams",
			value: pureParams
		});
	},
	newDraft: () => {
		const id = uid("chat_");
		const grok = get().settings.grokModelId || "grok-4.6-medium";
		const draft = {
			id,
			folderId: null,
			name: "",
			remark: "",
			starred: false,
			order: Date.now(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isDraft: true,
			grokModelId: grok,
			isMulti: false,
			multiMode: "together",
			promptMode: "insert",
			adultBoost: false,
			canGen: true,
			statusBarOn: false,
			statusBar: DEFAULT_STATUS_BAR,
			overview: "",
			opening: "",
			extras: [],
			memory: "",
			memoryUntil: 0,
			memoryFoldAt: 0,
			memorySnaps: [],
			characters: [emptyCharacter(1)],
			imageParams: defaultImageParams(),
			messages: [],
			scrollTop: 0
		};
		set((s) => ({
			chats: [...s.chats, draft],
			currentId: id,
			ui: {
				...s.ui,
				creating: true,
				editingChatId: null,
				sidebar: false,
				tab: "chat",
				menuId: null
			}
		}));
	},
	cancelDraft: () => {
		set((s) => {
			const rest = s.chats.filter((c) => !c.isDraft);
			return {
				chats: rest,
				currentId: rest.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null,
				ui: {
					...s.ui,
					creating: false,
					editingChatId: null
				}
			};
		});
	},
	commitChat: (id) => {
		const c = get().chats.find((x) => x.id === id);
		if (!c) return;
		const name = c.characters.map((ch) => ch.name).filter(Boolean).join("、") || c.name || "未命名";
		const appearance = c.characters[0]?.appearance || "";
		const imageParams = syncCharsFromRole(c.imageParams, c.characters, c.isMulti);
		if (!c.isMulti && !imageParams.promptMid.trim() && appearance) imageParams.promptMid = appearance;
		const next = {
			...c,
			name,
			isDraft: false,
			imageParams,
			updatedAt: Date.now()
		};
		persistChat(next);
		db.kv.put({
			key: "currentId",
			value: id
		});
		set((s) => ({
			chats: s.chats.map((x) => x.id === id ? next : x),
			currentId: id,
			ui: {
				...s.ui,
				creating: false,
				editingChatId: null,
				tab: "chat"
			}
		}));
	},
	openChat: (id, opts) => {
		db.kv.put({
			key: "currentId",
			value: id
		});
		set((s) => ({
			currentId: id,
			ui: {
				...s.ui,
				sidebar: false,
				creating: false,
				editingChatId: opts?.edit ? id : null,
				tab: "chat",
				menuId: null
			}
		}));
	},
	beginEdit: (id) => {
		const c = get().chats.find((x) => x.id === id);
		set({
			editBackup: c ? structuredClone(c) : null,
			currentId: id,
			ui: {
				...get().ui,
				editingChatId: id,
				creating: false,
				sidebar: false,
				tab: "chat",
				menuId: null
			}
		});
	},
	cancelEdit: () => {
		const bak = get().editBackup;
		if (bak) {
			persistChat(bak);
			set((s) => ({
				chats: s.chats.map((c) => c.id === bak.id ? bak : c),
				editBackup: null,
				ui: {
					...s.ui,
					editingChatId: null
				}
			}));
		} else set((s) => ({
			ui: {
				...s.ui,
				editingChatId: null
			},
			editBackup: null
		}));
	},
	addFolder: () => {
		const f = {
			id: uid("fold_"),
			name: "新建文件夹",
			starred: false,
			collapsed: false,
			order: Date.now(),
			createdAt: Date.now()
		};
		db.folders.put(f);
		set((s) => ({ folders: [...s.folders, f] }));
		get().toast("已创建文件夹");
	},
	toggleFolder: (id) => {
		set((s) => {
			const folders = s.folders.map((f) => f.id === id ? {
				...f,
				collapsed: !f.collapsed
			} : f);
			const f = folders.find((x) => x.id === id);
			if (f) db.folders.put(f);
			return { folders };
		});
	},
	deleteSelected: () => {
		const ids = new Set(get().ui.selected);
		const chats = get().chats.filter((c) => !ids.has(c.id));
		const folders = get().folders.filter((f) => !ids.has(f.id));
		const moved = chats.map((c) => c.folderId && ids.has(c.folderId) ? {
			...c,
			folderId: null
		} : c);
		db.chats.bulkPut(moved.filter((c) => !c.isDraft));
		db.chats.bulkDelete([...ids]);
		db.folders.bulkDelete([...ids]);
		set((s) => {
			const composerDrafts = dropDrafts(s.composerDrafts, ids);
			const composerShots = dropShots(s.composerShots, ids);
			db.kv.put({
				key: "composerDrafts",
				value: composerDrafts
			});
			db.kv.put({
				key: "composerShots",
				value: composerShots
			});
			return {
				chats: moved,
				folders,
				currentId: ids.has(s.currentId || "") ? moved[0]?.id ?? null : s.currentId,
				composerDrafts,
				composerShots,
				ui: {
					...s.ui,
					selectMode: false,
					selected: [],
					sortMode: false,
					menuId: null
				}
			};
		});
		get().toast("已删除");
	},
	starSelected: () => {
		const ids = new Set(get().ui.selected);
		const turningOn = get().chats.some((c) => ids.has(c.id) && !c.starred) || get().folders.some((f) => ids.has(f.id) && !f.starred);
		set((s) => {
			return {
				chats: s.chats.map((c) => {
					if (!ids.has(c.id)) return c;
					const next = {
						...c,
						starred: !c.starred,
						updatedAt: Date.now()
					};
					persistChat(next);
					return next;
				}),
				folders: s.folders.map((f) => {
					if (!ids.has(f.id)) return f;
					const next = {
						...f,
						starred: !f.starred
					};
					db.folders.put(next);
					return next;
				}),
				ui: {
					...s.ui,
					selectMode: false,
					selected: []
				}
			};
		});
		get().toast(turningOn ? "已星标并置顶" : "已取消星标");
	},
	moveSelected: (folderId) => {
		const ids = new Set(get().ui.selected);
		set((s) => {
			return {
				chats: s.chats.map((c) => {
					if (!ids.has(c.id)) return c;
					const next = {
						...c,
						folderId,
						updatedAt: Date.now()
					};
					persistChat(next);
					return next;
				}),
				ui: {
					...s.ui,
					selectMode: false,
					selected: [],
					moveOpen: false
				}
			};
		});
		get().toast("已移动");
	},
	copySelected: () => {
		const ids = get().ui.selected;
		const extras = [];
		for (const id of ids) {
			const c = get().chats.find((x) => x.id === id);
			if (!c) continue;
			const copy = cloneChat(c);
			extras.push(copy);
			persistChat(copy);
		}
		set((s) => ({
			chats: [...s.chats, ...extras],
			ui: {
				...s.ui,
				selectMode: false,
				selected: []
			}
		}));
		get().toast(extras.length === 1 ? `已复制「${extras[0].name}」` : "已复制");
	},
	renameItem: (id, name) => {
		set((s) => {
			return {
				chats: s.chats.map((c) => {
					if (c.id !== id) return c;
					const next = {
						...c,
						name,
						characters: c.isMulti ? c.characters : c.characters.map((ch, i) => i === 0 ? {
							...ch,
							name
						} : ch),
						updatedAt: Date.now()
					};
					persistChat(next);
					return next;
				}),
				folders: s.folders.map((f) => {
					if (f.id !== id) return f;
					const next = {
						...f,
						name
					};
					db.folders.put(next);
					return next;
				}),
				cards: s.cards.map((c) => {
					if (c.id !== id) return c;
					const next = {
						...c,
						name
					};
					db.cards.put(next);
					return next;
				}),
				ui: {
					...s.ui,
					rename: null,
					selectMode: false,
					selected: []
				}
			};
		});
		get().toast("已改名");
	},
	reorder: (ids) => {
		const order = new Map(ids.map((id, i) => [id, i]));
		set((s) => {
			return {
				chats: s.chats.map((c) => {
					if (!order.has(c.id)) return c;
					const next = {
						...c,
						order: order.get(c.id)
					};
					persistChat(next);
					return next;
				}),
				folders: s.folders.map((f) => {
					if (!order.has(f.id)) return f;
					const next = {
						...f,
						order: order.get(f.id)
					};
					db.folders.put(next);
					return next;
				}),
				ui: {
					...s.ui,
					sortMode: false,
					selectMode: false,
					selected: []
				}
			};
		});
	},
	saveCard: (chat, name) => {
		const card = {
			id: uid("card_"),
			name,
			isMulti: chat.isMulti,
			overview: chat.overview,
			opening: chat.opening,
			extras: chat.extras,
			statusBarOn: chat.statusBarOn,
			statusBar: chat.statusBar,
			characters: structuredClone(chat.characters),
			grokModelId: chat.grokModelId,
			createdAt: Date.now(),
			order: Date.now()
		};
		db.cards.put(card);
		set((s) => ({
			cards: [...s.cards, card],
			ui: {
				...s.ui,
				saveCardOpen: false
			}
		}));
		get().toast(`已保存角色卡「${name}」`);
	},
	applyCard: (chatId, card, charIndex) => {
		get().patchChat(chatId, (c) => {
			if (c.isMulti && !card.isMulti && charIndex != null) {
				const src = card.characters[0];
				const characters = src ? c.characters.map((ch, i) => i === charIndex ? copyRoleBody(ch, src) : ch) : c.characters;
				return {
					...c,
					characters,
					imageParams: syncCharsFromRole(c.imageParams, characters, c.isMulti),
					updatedAt: Date.now()
				};
			}
			const characters = mergeCardCharacters(c.characters, card.characters);
			return {
				...c,
				isMulti: card.isMulti,
				overview: card.overview,
				opening: card.opening,
				extras: card.extras,
				statusBarOn: card.statusBarOn,
				statusBar: card.statusBar,
				grokModelId: card.grokModelId,
				characters,
				imageParams: syncCharsFromRole(c.imageParams, characters, card.isMulti),
				updatedAt: Date.now()
			};
		});
		get().toast(`已应用「${card.name}」`);
	},
	deleteCard: (id) => {
		db.cards.delete(id);
		const name = get().cards.find((c) => c.id === id)?.name ?? "";
		set((s) => ({ cards: s.cards.filter((c) => c.id !== id) }));
		get().toast(`已删除${name}`);
	},
	reorderCards: (ids) => {
		const order = new Map(ids.map((id, i) => [id, i]));
		set((s) => {
			return { cards: s.cards.map((c) => {
				if (!order.has(c.id)) return c;
				const next = {
					...c,
					order: order.get(c.id)
				};
				db.cards.put(next);
				return next;
			}) };
		});
	},
	saveAppearance: (name, prompt) => {
		const a = {
			id: uid("ap_"),
			name,
			prompt,
			order: Date.now(),
			createdAt: Date.now()
		};
		db.appearances.put(a);
		set((s) => ({
			appearances: [...s.appearances, a],
			ui: {
				...s.ui,
				saveAppearOpen: false
			}
		}));
		get().toast(`已保存角色「${name}」`);
	},
	applyAppearance: (chatId, preset, target) => {
		if (chatId === "__pure__") {
			if (target === "mid") get().setPureParams({ promptMid: preset.prompt });
			else get().setPureParams({ characters: get().pureParams.characters.map((ch) => ch.id === target ? {
				...ch,
				prompt: preset.prompt
			} : ch) });
			return;
		}
		get().patchChat(chatId, (c) => {
			if (target === "mid") return {
				...c,
				imageParams: {
					...c.imageParams,
					promptMid: preset.prompt
				},
				characters: c.isMulti ? c.characters : c.characters.map((ch, i) => i === 0 ? {
					...ch,
					appearance: preset.prompt
				} : ch)
			};
			return {
				...c,
				imageParams: {
					...c.imageParams,
					characters: c.imageParams.characters.map((ch) => ch.id === target ? {
						...ch,
						prompt: preset.prompt
					} : ch)
				},
				characters: c.characters.map((ch) => ch.id === target ? {
					...ch,
					appearance: preset.prompt,
					prompt: preset.prompt
				} : ch)
			};
		});
	},
	deleteAppearance: (id) => {
		db.appearances.delete(id);
		set((s) => ({ appearances: s.appearances.filter((a) => a.id !== id) }));
	},
	reorderAppearances: (ids) => {
		const order = new Map(ids.map((id, i) => [id, i]));
		set((s) => {
			return { appearances: s.appearances.map((a) => {
				if (!order.has(a.id)) return a;
				const next = {
					...a,
					order: order.get(a.id)
				};
				db.appearances.put(next);
				return next;
			}) };
		});
	},
	addFavorite: (blobId) => {
		const hist = blobId ? get().history.find((h) => h.blobId === blobId) : void 0;
		const params = hist?.params ? {
			...structuredClone(hist.params),
			seed: hist.seed,
			seedLocked: true
		} : (() => {
			const p = structuredClone(get().pureParams);
			if (p.seed != null) p.seedLocked = true;
			return p;
		})();
		const loose = get().favorites.filter((f) => !f.groupId);
		const top = loose.reduce((m, f) => Math.min(m, f.order ?? 0), 0);
		const f = {
			id: uid("fav_"),
			name: presetNameFrom(params),
			params,
			blobId,
			createdAt: Date.now(),
			groupId: null,
			starred: false,
			order: loose.length ? top - 1 : 0
		};
		(async () => {
			try {
				await db.favorites.put(f);
				set((s) => ({ favorites: sortFavorites([f, ...s.favorites]) }));
				get().toast("已保存");
			} catch (err) {
				get().toast(err instanceof Error ? err.message : "收藏失败");
			}
		})();
	},
	patchFavorite: (id, p) => {
		const row = get().favorites.find((f) => f.id === id);
		if (!row) return;
		const next = {
			...row,
			...p
		};
		(async () => {
			try {
				await db.favorites.put(next);
				set((s) => ({ favorites: sortFavorites(s.favorites.map((f) => f.id === id ? next : f)) }));
			} catch (err) {
				get().toast(err instanceof Error ? err.message : "收藏更新失败");
			}
		})();
	},
	deleteFavorite: (id) => {
		const row = get().favorites.find((f) => f.id === id);
		set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }));
		db.favorites.delete(id);
		if (row?.blobId && !blobInUse(get(), row.blobId, id)) deleteImage(row.blobId);
		get().toast("已删除");
	},
	reorderFavorites: (ids) => {
		const rank = new Map(ids.map((id, i) => [id, i]));
		const next = sortFavorites(get().favorites.map((f) => rank.has(f.id) ? {
			...f,
			order: rank.get(f.id)
		} : f));
		set({ favorites: next });
		for (const f of next) db.favorites.put(f);
	},
	setFavOrders: (groupOrders, favOrders) => {
		set((s) => {
			return {
				favGroups: s.favGroups.map((g) => {
					if (!(g.id in groupOrders) || groupOrders[g.id] === g.order) return g;
					const next = {
						...g,
						order: groupOrders[g.id]
					};
					db.favGroups.put(next);
					return next;
				}),
				favorites: sortFavorites(s.favorites.map((f) => {
					if (!(f.id in favOrders) || favOrders[f.id] === (f.order ?? 0)) return f;
					const next = {
						...f,
						order: favOrders[f.id]
					};
					db.favorites.put(next);
					return next;
				}))
			};
		});
	},
	addFavGroup: (name) => {
		const title = name.trim() || "未命名";
		const roots = get().favGroups.filter((g) => !g.parentId);
		const top = roots.reduce((m, g) => Math.min(m, g.order), 0);
		const row = {
			id: uid("fg_"),
			name: title,
			parentId: null,
			collapsed: true,
			order: roots.length ? top - 1 : 0,
			starred: false,
			createdAt: Date.now()
		};
		db.favGroups.put(row);
		set((s) => ({ favGroups: [row, ...s.favGroups] }));
	},
	renameFavGroup: (id, name) => {
		const row = get().favGroups.find((g) => g.id === id);
		if (!row) return;
		const next = {
			...row,
			name: name.trim() || "未命名"
		};
		db.favGroups.put(next);
		set((s) => ({ favGroups: s.favGroups.map((g) => g.id === id ? next : g) }));
	},
	toggleFavGroup: (id) => {
		const row = get().favGroups.find((g) => g.id === id);
		if (!row) return;
		const next = {
			...row,
			collapsed: !row.collapsed
		};
		db.favGroups.put(next);
		set((s) => ({ favGroups: s.favGroups.map((g) => g.id === id ? next : g) }));
	},
	deleteFavGroup: (id) => {
		const dropG = /* @__PURE__ */ new Set([id, ...favGroupDescendants(get().favGroups, id)]);
		const dropF = get().favorites.filter((f) => f.groupId && dropG.has(f.groupId));
		set((s) => ({
			favGroups: s.favGroups.filter((g) => !dropG.has(g.id)),
			favorites: s.favorites.filter((f) => !(f.groupId && dropG.has(f.groupId)))
		}));
		for (const gid of dropG) db.favGroups.delete(gid);
		for (const f of dropF) {
			db.favorites.delete(f.id);
			if (f.blobId && !blobInUse(get(), f.blobId)) deleteImage(f.blobId);
		}
		get().toast("已删除");
	},
	moveFavorite: (id, groupId) => {
		const favs = get().favorites;
		if (!favs.find((f) => f.id === id)) return;
		if (groupId && !get().favGroups.some((g) => g.id === groupId)) return;
		const sib = favs.filter((f) => f.id !== id && (f.groupId ?? null) === groupId);
		const top = sib.reduce((m, f) => Math.min(m, f.order ?? 0), 0);
		const groups = openFavAncestors(get().favGroups, groupId);
		if (groups !== get().favGroups) {
			set({ favGroups: groups });
			for (const g of groups) if (!g.collapsed) db.favGroups.put(g);
		}
		get().patchFavorite(id, {
			groupId,
			order: sib.length ? top - 1 : 0
		});
	},
	moveFavGroup: (id, parentId) => {
		const groups = get().favGroups;
		const row = groups.find((g) => g.id === id);
		if (!row) return;
		if (parentId) {
			if (parentId === id || favGroupDescendants(groups, id).has(parentId)) return;
			if (!groups.some((g) => g.id === parentId)) return;
		}
		const sib = groups.filter((g) => g.id !== id && (g.parentId ?? null) === parentId);
		const top = sib.reduce((m, g) => Math.min(m, g.order), 0);
		const moved = {
			...row,
			parentId,
			order: sib.length ? top - 1 : 0
		};
		const next = openFavAncestors(groups.map((g) => g.id === id ? moved : g), parentId);
		set({ favGroups: next });
		for (const g of next) db.favGroups.put(g);
	},
	toggleFavoriteStar: (id) => {
		const row = get().favorites.find((f) => f.id === id);
		if (!row) return;
		const next = {
			...row,
			starred: !row.starred
		};
		db.favorites.put(next);
		set((s) => ({ favorites: s.favorites.map((f) => f.id === id ? next : f) }));
	},
	toggleFavGroupStar: (id) => {
		const row = get().favGroups.find((g) => g.id === id);
		if (!row) return;
		const next = {
			...row,
			starred: !row.starred
		};
		db.favGroups.put(next);
		set((s) => ({ favGroups: s.favGroups.map((g) => g.id === id ? next : g) }));
	},
	setFavoriteThumb: (id, blobId) => {
		const old = get().favorites.find((f) => f.id === id)?.blobId;
		get().patchFavorite(id, { blobId });
		if (old && old !== blobId && !blobInUse(get(), old, id)) deleteImage(old);
		get().toast("已更新配图");
	},
	addHistory: (h) => {
		db.history.put(h);
		set((s) => ({ history: sortHistoryNewestFirst([h, ...s.history]).slice(0, 200) }));
	},
	patchHistory: (id, p) => {
		set((s) => {
			const history = s.history.map((h) => h.id === id ? {
				...h,
				...p
			} : h);
			const row = history.find((h) => h.id === id);
			if (row) db.history.put(row);
			return { history };
		});
	},
	deleteHistory: (id) => {
		const row = get().history.find((h) => h.id === id);
		set((s) => ({ history: s.history.filter((h) => h.id !== id) }));
		db.history.delete(id);
		if (row?.blobId && !blobInUse(get(), row.blobId)) deleteImage(row.blobId);
	},
	setCooldown: (until) => get().setSettings({ cooldownUntil: until }),
	setComposerDraft: (chatId, text) => {
		set((s) => {
			const composerDrafts = { ...s.composerDrafts };
			if (text) composerDrafts[chatId] = text;
			else delete composerDrafts[chatId];
			db.kv.put({
				key: "composerDrafts",
				value: composerDrafts
			});
			return { composerDrafts };
		});
	},
	setComposerShot: (chatId, shot) => {
		set((s) => {
			const composerShots = { ...s.composerShots };
			if (shot?.blobId) composerShots[chatId] = {
				blobId: shot.blobId,
				i2i: shot.i2i
			};
			else delete composerShots[chatId];
			db.kv.put({
				key: "composerShots",
				value: composerShots
			});
			return { composerShots };
		});
	}
}));
function parseComposerDrafts(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out = {};
	for (const [k, v] of Object.entries(raw)) if (k && typeof v === "string" && v) out[k] = v;
	return out;
}
function dropDrafts(drafts, ids) {
	const next = { ...drafts };
	for (const id of ids) delete next[id];
	return next;
}
function parseComposerShots(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out = {};
	for (const [k, v] of Object.entries(raw)) {
		if (!k || !v || typeof v !== "object") continue;
		const row = v;
		if (typeof row.blobId === "string" && row.blobId) out[k] = {
			blobId: row.blobId,
			i2i: row.i2i === true
		};
	}
	return out;
}
function dropShots(shots, ids) {
	const next = { ...shots };
	for (const id of ids) delete next[id];
	return next;
}
function liftImageAi(settings, chats, currentId) {
	if (settings.imageModelId || settings.imageModelPin) return {
		imageModelId: settings.imageModelId ?? null,
		imageModelPin: settings.imageModelPin ?? null
	};
	const hit = [chats.find((c) => c.id === currentId), ...chats].find((c) => c && (c.imageModelId || c.imageModelPin));
	return {
		imageModelId: hit?.imageModelId ?? null,
		imageModelPin: hit?.imageModelPin ?? null
	};
}
function blobInUse(s, blobId, skipFav) {
	if (s.favorites.some((f) => f.blobId === blobId && f.id !== skipFav)) return true;
	if (s.favorites.some((f) => f.params.img2imgBlobId === blobId)) return true;
	if (s.pureParams.img2imgBlobId === blobId) return true;
	if (s.history.some((h) => h.blobId === blobId)) return true;
	if (s.cards.some((card) => card.characters.some((c) => c.lookBlobId === blobId))) return true;
	for (const c of s.chats) {
		if (c.avatarBlobId === blobId) return true;
		if (c.imageParams.img2imgBlobId === blobId) return true;
		if (c.characters.some((ch) => ch.lookBlobId === blobId)) return true;
		for (const m of c.messages) {
			if (m.userImageBlobId === blobId) return true;
			if (m.images.some((g) => g.blobId === blobId)) return true;
		}
	}
	return false;
}
async function saveBlob(blob) {
	const id = uid("img_");
	await putImage(id, blob);
	rememberUrl(id, blob);
	return id;
}
function listedChats(folders, chats) {
	const live = chats.filter((c) => !c.isDraft);
	return {
		foldersSorted: [...folders].sort((a, b) => {
			if (a.starred !== b.starred) return a.starred ? -1 : 1;
			return a.order - b.order;
		}),
		root: live.filter((c) => !c.folderId).sort((a, b) => {
			if (a.starred !== b.starred) return a.starred ? -1 : 1;
			return a.order - b.order;
		}),
		inFolder: (fid) => live.filter((c) => c.folderId === fid).sort((a, b) => {
			if (a.starred !== b.starred) return a.starred ? -1 : 1;
			return a.order - b.order;
		})
	};
}
function fakePureChat(params, grokModelId) {
	return {
		id: "__pure__",
		folderId: null,
		name: "纯生图",
		remark: "",
		starred: false,
		order: -1,
		createdAt: 0,
		updatedAt: 0,
		isDraft: true,
		grokModelId,
		isMulti: false,
		multiMode: "together",
		promptMode: "insert",
		adultBoost: false,
		canGen: true,
		statusBarOn: false,
		statusBar: "",
		overview: "",
		opening: "",
		extras: [],
		memory: "",
		memoryUntil: 0,
		memoryFoldAt: 0,
		memorySnaps: [],
		characters: [],
		imageParams: params,
		messages: [],
		scrollTop: 0
	};
}
async function readJsonError(res, fallback) {
	try {
		return (await res.json()).error || fallback;
	} catch {
		return fallback;
	}
}
var writeChain = Promise.resolve();
function enqueueWrite(fn, signal) {
	const run = () => {
		if (signal?.aborted) {
			const err = /* @__PURE__ */ new Error("Aborted");
			err.name = "AbortError";
			return Promise.reject(err);
		}
		return fn();
	};
	const next = writeChain.then(run, run);
	writeChain = next.then(() => void 0, () => void 0);
	return next;
}
function shouldQueue(task) {
	return task === "memory" || task === "image" || task === "rewrite";
}
function abortError() {
	const err = /* @__PURE__ */ new Error("Aborted");
	err.name = "AbortError";
	return err;
}
async function grokOnceRaw(body, signal) {
	const s = useApp.getState().settings;
	const presetOn = Boolean(s.stActiveId);
	const viaBody = body.via;
	const modelBody = typeof body.model === "string" ? body.model : "";
	const rest = { ...body };
	delete rest.via;
	delete rest.model;
	const via = viaBody === "api" || viaBody === "grok" ? viaBody : s.chatSource;
	const ownParams = rest.params && typeof rest.params === "object" ? rest.params : null;
	const maxFromOwn = typeof ownParams?.maxTokens === "number" ? ownParams.maxTokens : void 0;
	if (via === "api") {
		const model = modelBody || s.llmModel;
		if (!s.llmKey) throw new Error("还没连接对话 API");
		if (!model) throw new Error("还没选择模型");
		const res = await fetch("/api/llm", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				action: "chat",
				baseUrl: s.llmBase,
				apiKey: s.llmKey,
				model,
				...rest,
				params: ownParams ?? s.llmParams,
				stream: false,
				max_tokens: rest.max_tokens ?? maxFromOwn ?? s.llmParams.maxTokens
			}),
			signal
		});
		const data = await res.json();
		if (!res.ok || !data.ok) throw new Error(data.error || `请求失败 ${res.status}`);
		return data.text ?? "";
	}
	const res = await fetch("/api/grok", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...rest,
			stream: false,
			params: ownParams ?? (presetOn && rest.task !== "image" ? s.llmParams : void 0)
		}),
		signal
	});
	const data = await res.json();
	if (!res.ok || !data.ok) throw new Error(data.error || `Grok 请求失败 ${res.status}`);
	return data.text ?? "";
}
async function grokOnce(body, signal) {
	if (shouldQueue(body.task)) return enqueueWrite(() => grokOnceRaw(body, signal), signal);
	return grokOnceRaw(body, signal);
}
function consumeSse(chunk, onDelta, acc) {
	const line = chunk.split("\n").find((l) => l.startsWith("data: "));
	if (!line) return;
	const data = line.slice(6);
	if (data === "[DONE]") return;
	try {
		const j = JSON.parse(data);
		if (j.error) throw new Error(j.error);
		if (j.text) {
			acc.full += j.text;
			onDelta(acc.full);
		}
	} catch (e) {
		if (e instanceof Error && e.message && !e.message.includes("JSON") && e.message !== "Unexpected end of JSON input") throw e;
	}
}
async function grokStream(body, onDelta, signal) {
	const run = () => grokStreamRaw(body, onDelta, signal);
	if (shouldQueue(body.task)) return enqueueWrite(run, signal);
	return run();
}
async function grokStreamRaw(body, onDelta, signal) {
	if (signal?.aborted) throw abortError();
	const s = useApp.getState().settings;
	const api = (body.via === "api" || body.via === "grok" ? body.via : s.chatSource) === "api";
	const presetOn = Boolean(s.stActiveId);
	if (api) {
		if (!s.llmConnected || !s.llmKey) throw new Error("还没连接对话 API");
		if (!s.llmModel && typeof body.model !== "string") throw new Error("还没选择模型");
	}
	const url = api ? "/api/llm" : "/api/grok";
	const ownParams = body.params && typeof body.params === "object" ? body.params : null;
	const maxFromOwn = typeof ownParams?.maxTokens === "number" ? ownParams.maxTokens : void 0;
	const payload = api ? {
		action: "chat",
		baseUrl: s.llmBase,
		apiKey: s.llmKey,
		model: typeof body.model === "string" ? body.model : s.llmModel,
		...body,
		params: ownParams ?? s.llmParams,
		stream: true,
		max_tokens: body.max_tokens ?? maxFromOwn ?? s.llmParams.maxTokens
	} : {
		...body,
		stream: true,
		params: ownParams ?? (presetOn && body.task !== "image" ? s.llmParams : void 0)
	};
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
		signal
	});
	if (!res.ok || !res.body) throw new Error(await readJsonError(res, `请求失败 ${res.status}`));
	const reader = res.body.getReader();
	const dec = new TextDecoder();
	let buf = "";
	const acc = { full: "" };
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buf += dec.decode(value, { stream: true });
		const parts = buf.split("\n\n");
		buf = parts.pop() ?? "";
		for (const p of parts) consumeSse(p, onDelta, acc);
	}
	buf += dec.decode();
	if (buf.trim()) for (const p of buf.split("\n\n")) consumeSse(p, onDelta, acc);
	return acc.full;
}
async function fetchLlmModels(baseUrl, apiKey) {
	const res = await fetch("/api/llm", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			action: "models",
			baseUrl,
			apiKey
		})
	});
	const data = await res.json();
	if (!res.ok || !data.ok) throw new Error(data.error || `连接失败 ${res.status}`);
	return data.models ?? [];
}
var CHAR_KEYS = [
	"name",
	"persona",
	"speech",
	"appearance"
];
function stripRoleOutput(text) {
	let s = (text || "").trim();
	s = s.replace(/^```(?:json|text|markdown)?\s*/i, "").replace(/\s*```$/i, "").trim();
	if (s.startsWith("\"") && s.endsWith("\"") && s.length >= 2) try {
		const q = JSON.parse(s);
		if (typeof q === "string") return q.trim();
	} catch {
		s = s.slice(1, -1).trim();
	}
	return s;
}
function parseObject(raw) {
	const s = stripRoleOutput(raw);
	const start = s.indexOf("{");
	const end = s.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const json = JSON.parse(s.slice(start, end + 1));
		if (json && typeof json === "object" && !Array.isArray(json)) return json;
	} catch {}
	return null;
}
function asText(v) {
	if (typeof v === "string") return v.trim();
	if (v == null) return "";
	return String(v).trim();
}
function parsePolishJson(text) {
	const obj = parseObject(text);
	if (!obj) throw new Error("完善结果解析失败，请再试一次");
	const characters = Array.isArray(obj.characters) ? obj.characters.map((c) => {
		const row = c && typeof c === "object" ? c : {};
		return {
			name: asText(row.name),
			persona: asText(row.persona),
			speech: asText(row.speech),
			appearance: asText(row.appearance)
		};
	}) : void 0;
	return {
		overview: asText(obj.overview),
		opening: asText(obj.opening),
		characters
	};
}
function extractFieldText(text, field) {
	const stripped = stripRoleOutput(text);
	const json = parseObject(stripped);
	if (!json) return stripped;
	if (typeof json[field] === "string" && asText(json[field])) return asText(json[field]);
	const label = {
		persona: "人设",
		speech: "说话方式",
		appearance: "外貌备忘",
		overview: "要求总览",
		opening: "开场场景",
		name: "名字"
	}[field];
	if (label && typeof json[label] === "string" && asText(json[label])) return asText(json[label]);
	const first = Array.isArray(json.characters) ? json.characters[0] : null;
	if (first && typeof first === "object") {
		const v = first[field];
		if (typeof v === "string" && asText(v)) return asText(v);
	}
	if (typeof json.text === "string" && asText(json.text)) return asText(json.text);
	return stripped;
}
function mergeOneChar(c, src) {
	if (!src) return c;
	const nameLocked = Boolean(c.name.trim());
	const appearLocked = Boolean(c.appearance.trim());
	return {
		...c,
		name: nameLocked ? c.name : src.name || c.name,
		persona: src.persona || c.persona,
		speech: src.speech || c.speech,
		appearance: appearLocked ? c.appearance : src.appearance || c.appearance
	};
}
function mergePolish(chat, json) {
	const characters = chat.characters.map((c, i) => mergeOneChar(c, json.characters?.[i]));
	return {
		name: characters.map((c) => c.name).filter(Boolean).join("、") || chat.name,
		overview: json.overview || chat.overview,
		opening: json.opening || chat.opening,
		characters
	};
}
function applyRoleField(chat, field, text, charId) {
	const cleaned = extractFieldText(text, field);
	if (charId) {
		const key = CHAR_KEYS.includes(field) ? field : "persona";
		return {
			...chat,
			characters: chat.characters.map((c) => c.id === charId ? {
				...c,
				[key]: cleaned
			} : c)
		};
	}
	if (field === "overview" || field === "opening" || field === "statusBar") return {
		...chat,
		[field]: cleaned
	};
	return chat;
}
function buildPolishUserContent(chat) {
	const characters = chat.characters.map((c, i) => ({
		index: i + 1,
		name: c.name,
		nameLocked: Boolean(c.name.trim()),
		persona: c.persona,
		speech: c.speech,
		appearance: c.appearance,
		appearanceLocked: Boolean(c.appearance.trim()),
		personaVoices: Boolean(c.personaVoices)
	}));
	const extras = [...chat.extras, ...chat.characters.flatMap((c) => c.extras)].map((e) => e.body.trim()).filter(Boolean);
	return JSON.stringify({
		overview: chat.overview,
		opening: chat.opening,
		isMulti: chat.isMulti,
		characters,
		readOnlyExtras: extras.length ? extras : void 0,
		readOnlyMemory: chat.memory.trim() || void 0,
		locks: {
			filledName: "nameLocked 为 true 的名字必须原样返回",
			filledAppearance: "appearanceLocked 为 true 的外貌必须原样返回，一个 tag 都不要改",
			statusBar: "不要输出 statusBar",
			extras: "不要改新增栏"
		}
	}, null, 2);
}
var OPENING_USER = "（开始场景，请角色先开口）";
var CONTINUE_USER = "用户这轮没有发言。这不是开场，也不是结束。接着上一拍已经发生的事往下演，把场上未完的动作、对话、时间往前推，不要空等用户开口，不要问「你想做什么」。需要用户开口或表态时你可以代写或给出选项。不要复述上一拍，不要跳到无关的新故事。";
function parseUserMarkup(raw) {
	const facts = [];
	const directives = [];
	let s = raw || "";
	s = s.replace(/《([^》]*)》/g, (_, inner) => {
		const t = inner.trim();
		if (t) directives.push(t);
		return " ";
	});
	s = s.replace(/[（(]([^）)]*)[）)]/g, (_, inner) => {
		const t = inner.trim();
		if (t) facts.push(t);
		return " ";
	});
	return {
		facts,
		directives,
		rest: s.replace(/\s+/g, " ").trim(),
		raw
	};
}
function isShortBareCandidate(rest) {
	const t = rest.trim();
	if (!t || t.length > 12) return false;
	if (/[？?！!。，,]/.test(t)) return false;
	return true;
}
function needsMarkupFormat(raw) {
	const t = (raw || "").trim();
	if (!t || t === "（开始场景，请角色先开口）") return false;
	const p = parseUserMarkup(t);
	if (p.facts.length || p.directives.length) return true;
	return isShortBareCandidate(p.rest);
}
function standingDirectives(chat) {
	return [...chat.extras || [], ...(chat.characters || []).flatMap((c) => c.extras || [])].map((e) => e.emphasize ? (e.body || "").trim() : "").filter(Boolean);
}
function chatAuthorBlock(directives) {
	return `【作者指令】${directives.map((d) => `《${d}》`).join(" ")}\n角色听不见、不准念、不准写成「听到指示」。只执行与这轮文笔/剧情有关的；与画图、镜头、构图、tag 有关的忽略（生图会另处理）。`;
}
function imageAuthorBlock(directives) {
	return `作者指令：${directives.map((d) => `《${d}》`).join(" ")}（只执行与画面有关的；文笔/篇幅/怎么写的忽略）`;
}
function formatUserForChat(raw, standing = []) {
	const extra = standing.map((s) => s.trim()).filter(Boolean);
	const t = (raw || "").trim();
	if ((!t || t === "（开始场景，请角色先开口）") && extra.length) return `${!t ? CONTINUE_USER : OPENING_USER}\n\n${chatAuthorBlock(extra)}`;
	if (!t) return CONTINUE_USER;
	if (t === "（开始场景，请角色先开口）") return raw;
	const merged = extra.length ? `${t}${extra.map((d) => `《${d}》`).join("")}` : t;
	if (!needsMarkupFormat(merged)) return raw;
	const p = parseUserMarkup(merged);
	const parts = [];
	if (p.facts.length) parts.push(`【已发生】${p.facts.map((f) => `「${f}」`).join("、")}\n这是本拍必须达成的事实：过程可以写，回复结束时必须已经成立。不是口令。角色不是「听见」这些字；若内容本身是已经说出口的话，她听见的是那句话，不是括号。`);
	if (p.rest) parts.push(`【用户其余原文】${p.rest}\n请判断：像对角色说的话 → 她听见的台词；像动作/场面补充（摸头、抱住、插入）→ 与【已发生】同一规则，短动词优先当动作。`);
	if (p.directives.length) parts.push(`【作者指令】${p.directives.map((d) => `《${d}》`).join(" ")}\n角色听不见、不准念、不准写成「听到指示」。只执行与这轮文笔/剧情有关的；与画图、镜头、构图、tag 有关的忽略（生图会另处理）。`);
	if (p.facts.length && !p.rest) parts.push("本条没有台词。角色只对已经发生的事实做身体和情绪反应，禁止写成听到一句话或听到指示。");
	return parts.join("\n\n");
}
function formatUserForImage(raw, standing = []) {
	const extra = standing.map((s) => s.trim()).filter(Boolean);
	const t = (raw || "").trim();
	if ((!t || t === "（开始场景，请角色先开口）") && !extra.length) return "";
	if (!t || t === "（开始场景，请角色先开口）") return imageAuthorBlock(extra);
	const merged = extra.length ? `${t}${extra.map((d) => `《${d}》`).join("")}` : t;
	if (!needsMarkupFormat(merged)) return `用户：${t}`;
	const p = parseUserMarkup(merged);
	const parts = [];
	if (p.facts.length) parts.push(`用户已发生（镜头里必须是已经发生，不要写成准备、磨蹭或停在入口）：${p.facts.join("；")}`);
	if (p.rest) parts.push(`用户其余：${p.rest}`);
	if (p.directives.length) parts.push(`作者指令：${p.directives.map((d) => `《${d}》`).join(" ")}（只执行与画面有关的；文笔/篇幅/怎么写的忽略）`);
	return parts.join("\n") || `用户：${t}`;
}
function recentSceneForImage(messages, n = 4, standing = []) {
	let lastUser = -1;
	for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === "user") {
		lastUser = i;
		break;
	}
	const slice = messages.slice(-n);
	const offset = messages.length - slice.length;
	return slice.map((m, i) => {
		if (m.role === "user") return formatUserForImage(m.content, offset + i === lastUser ? standing : []);
		if (m.role === "narrator") return m.content ? `旁白：${replyContextText(m.content)}` : "";
		return `${m.characterName || "角色"}：${replyContextText(m.content)}`;
	}).filter(Boolean).join("\n");
}
/** 本镜 = this assistant reply (or override); residual = last 4 bubbles before it. */
function shotAndResidual(messages, msgId, shotOverride, standing = []) {
	const idx = messages.findIndex((m) => m.id === msgId);
	const msg = idx >= 0 ? messages[idx] : void 0;
	const before = idx >= 0 ? messages.slice(0, idx) : messages;
	return {
		shot: (shotOverride ?? (msg ? replyStoryText(msg.content) : "")).trim(),
		residual: recentSceneForImage(before, 4, standing)
	};
}
/** The user's latest line before this reply. Who is on screen looks at this plus 本镜. */
function latestUserBefore(messages, msgId, standing = []) {
	const idx = messages.findIndex((m) => m.id === msgId);
	const before = idx >= 0 ? messages.slice(0, idx) : messages;
	for (let i = before.length - 1; i >= 0; i--) {
		if (before[i].role !== "user") continue;
		const text = formatUserForImage(before[i].content, standing).trim();
		if (text) return text;
	}
	return "";
}
/** Immediate previous assistant/narrator only. Empty if that round has no successful image. */
function previousRoundImagePrompt(messages, msgId) {
	const idx = messages.findIndex((m) => m.id === msgId);
	const from = idx >= 0 ? idx - 1 : messages.length - 1;
	for (let i = from; i >= 0; i--) {
		const m = messages[i];
		if (m.role !== "assistant" && m.role !== "narrator") continue;
		return ([...m.images || []].reverse().find((g) => g.status === "done" && g.prompt)?.prompt || "").trim();
	}
	return "";
}
function escapeRegExp(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function stripSpeakerPrefix(text, names) {
	const list = [...new Set(names.map((n) => (n || "").trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
	let s = text;
	for (let i = 0; i < 6; i++) {
		const next = s.replace(/^\s+/, "");
		let hit = false;
		for (const n of list) {
			const re = new RegExp(`^${escapeRegExp(n)}\\s*[：:]\\s*`);
			if (re.test(next)) {
				s = next.replace(re, "");
				hit = true;
				break;
			}
		}
		if (!hit) return next;
	}
	return s.replace(/^\s+/, "");
}
var QUOTE = /「[^」]*」|『[^』]*』|“[^”]*”|"[^"\n]*"/g;
function splitDialogue(text) {
	const out = [];
	let last = 0;
	for (const m of text.matchAll(QUOTE)) {
		const i = m.index ?? 0;
		if (i > last) out.push({
			kind: "narr",
			text: text.slice(last, i)
		});
		out.push({
			kind: "say",
			text: m[0]
		});
		last = i + m[0].length;
	}
	if (last < text.length) out.push({
		kind: "narr",
		text: text.slice(last)
	});
	return out.filter((p) => p.text);
}
var FACE_KEEP = /[\^:;><]_[^,\s]|_[wWmMoO]_|\\m\/|\^_\^|:_\^|;_;/;
var FORBIDDEN_EXACT = /* @__PURE__ */ new Set([
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
	"children"
]);
var AUTO_TAGS = /* @__PURE__ */ new Set([
	"uncensored",
	"full body",
	"rating:sensitive",
	"rating: sensitive",
	"fur dataset"
]);
function isForbidden(tag) {
	const t = tag.trim().toLowerCase();
	if (!t) return true;
	if (FORBIDDEN_EXACT.has(t)) return true;
	if (/\bartist\s*:/.test(t)) return true;
	if (/^year 202\d$/.test(t)) return true;
	if (/^year_202\d$/.test(t)) return true;
	return false;
}
function unSnake(tag) {
	const t = tag.trim();
	if (t.length < 10 && FACE_KEEP.test(t)) return t;
	return t.replace(/_/g, " ");
}
function splitNaiTags(raw) {
	const out = [];
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
function normKey(tag) {
	return unSnake(tag).replace(/\s+/g, " ").trim().toLowerCase();
}
function sanitizeNaiTags(raw, opts) {
	let s = (raw || "").trim();
	if (!s) return "";
	s = s.replace(/^```(?:json|text|tags)?\s*/i, "").replace(/\s*```$/i, "").trim();
	s = s.replace(/^(?:here are (?:the )?tags:?|tags:?|prompt:?)\s*/i, "");
	s = s.replace(/^["']|["']$/g, "").trim();
	if (s.includes("{") && /"base"\s*:|"chars"\s*:/.test(s)) s = flattenMaybeJson(s);
	const strip = opts?.stripForbidden !== false;
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (let part of splitNaiTags(s)) {
		part = unSnake(part).replace(/\s+/g, " ").trim();
		if (!part) continue;
		if (!/^[-0-9.]+::/.test(part) && !part.startsWith("Text:") && !part.startsWith("source#") && !part.startsWith("target#") && !part.startsWith("mutual#")) part = part.toLowerCase();
		if (strip && isForbidden(part)) continue;
		const key = part.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(part);
	}
	return out.join(", ");
}
/** Pull the Grok-added mid tags out of a stored prompt that may still be the full front+mid+tail+back string. */
function extractGrokTail(stored, params) {
	const cleaned = sanitizeNaiTags(flattenMaybeJson(stored));
	if (!cleaned) return "";
	const drop = /* @__PURE__ */ new Set();
	for (const src of [
		params.promptFront,
		params.promptMid,
		params.promptBack
	]) for (const t of splitNaiTags(src || "")) {
		const k = normKey(t);
		if (k) drop.add(k);
	}
	for (const t of AUTO_TAGS) drop.add(t);
	return splitNaiTags(cleaned).filter((t) => !drop.has(normKey(t)) && !isForbidden(t)).join(", ");
}
function extractJsonObject(raw) {
	let s = (raw || "").trim();
	s = s.replace(/^```(?:json|text|tags)?\s*/i, "").replace(/\s*```$/i, "").trim();
	const start = s.indexOf("{");
	const end = s.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const json = JSON.parse(s.slice(start, end + 1));
		if (json && typeof json === "object" && !Array.isArray(json)) return json;
	} catch {}
	return null;
}
function asTagStr(v) {
	if (v == null) return "";
	if (typeof v === "string") return v;
	if (Array.isArray(v)) return v.map(asTagStr).filter(Boolean).join(", ");
	if (typeof v === "object") return Object.values(v).map(asTagStr).filter(Boolean).join(", ");
	return String(v);
}
function flattenMaybeJson(raw) {
	const json = extractJsonObject(raw);
	if (!json || !("base" in json) && !("chars" in json)) return raw;
	const parts = [asTagStr(json.base)];
	const chars = json.chars;
	if (chars && typeof chars === "object") for (const v of Object.values(chars)) parts.push(asTagStr(v));
	return parts.filter(Boolean).join(", ");
}
function assignCharTags(rawChars, characters) {
	const mapped = {};
	const used = /* @__PURE__ */ new Set();
	const unmatched = [];
	const resolve = (key) => {
		const k = key.trim().toLowerCase();
		if (!k) return void 0;
		const byName = characters.find((c) => !used.has(c.id) && c.name && c.name.toLowerCase() === k);
		if (byName) return byName.id;
		const byId = characters.find((c) => !used.has(c.id) && c.id.toLowerCase() === k);
		if (byId) return byId.id;
		const m = k.match(/^(?:char|character|角色)\s*[_#.\-]?\s*(\d+)$/i);
		if (m) {
			const c = characters[Number(m[1]) - 1];
			if (c && !used.has(c.id)) return c.id;
		}
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
	return {
		mapped,
		leftover: unmatched.join(", ")
	};
}
function resolveAbsentIds(absent, characters) {
	const names = Array.isArray(absent) ? absent.map((x) => String(x || "").trim()).filter(Boolean) : [];
	const ids = [];
	for (const n of names) {
		const k = n.toLowerCase();
		const hit = characters.find((c) => c.name && c.name.toLowerCase() === k) || characters.find((c) => c.id.toLowerCase() === k) || (() => {
			const m = k.match(/^(?:char|character|角色)\s*[_#.\-]?\s*(\d+)$/i);
			return m ? characters[Number(m[1]) - 1] : void 0;
		})();
		if (hit && !ids.includes(hit.id)) ids.push(hit.id);
	}
	return ids;
}
function presenceFromTags(mappedIds, absentIds) {
	if (mappedIds.length) {
		const absent = new Set(absentIds);
		return {
			mode: "exact",
			ids: mappedIds.filter((id) => !absent.has(id))
		};
	}
	if (absentIds.length) return {
		mode: "off",
		ids: absentIds
	};
}
function legacyPresentIds(text, characters) {
	const found = /* @__PURE__ */ new Set();
	const re = /\bchar(?:acter)?\s*(\d+)\s*:/gi;
	let m;
	while (m = re.exec(text)) found.add(Number(m[1]));
	if (!found.size) return void 0;
	const ids = [];
	for (const n of [...found].sort((a, b) => a - b)) {
		const c = characters[n - 1];
		if (c && !ids.includes(c.id)) ids.push(c.id);
	}
	return ids;
}
function readChunks(buf) {
	const view = new DataView(buf);
	if (view.getUint32(0) !== 2303741511 || view.getUint32(4) !== 218765834) throw new Error("不是 PNG");
	const texts = {};
	let offset = 8;
	const u8 = new Uint8Array(buf);
	while (offset + 8 < buf.byteLength) {
		const len = view.getUint32(offset);
		const type = String.fromCharCode(u8[offset + 4], u8[offset + 5], u8[offset + 6], u8[offset + 7]);
		const start = offset + 8;
		const data = u8.slice(start, start + len);
		if (type === "tEXt") {
			const nul = data.indexOf(0);
			if (nul > 0) {
				const key = new TextDecoder().decode(data.slice(0, nul));
				texts[key] = new TextDecoder("latin1").decode(data.slice(nul + 1));
			}
		} else if (type === "iTXt") {
			const nul = data.indexOf(0);
			if (nul > 0) {
				const key = new TextDecoder().decode(data.slice(0, nul));
				let i = nul + 1;
				const compressed = data[i];
				i += 2;
				i = data.indexOf(0, i) + 1;
				i = data.indexOf(0, i) + 1;
				let val;
				if (compressed) val = "";
				else val = new TextDecoder().decode(data.slice(i));
				texts[key] = val;
			}
		} else if (type === "IEND") break;
		offset = start + len + 4;
	}
	return texts;
}
function parseNaiPng(buf) {
	const texts = readChunks(buf);
	const comment = texts.Comment || texts.comment || texts.Description || "";
	const raw = comment || JSON.stringify(texts);
	let json = null;
	try {
		json = JSON.parse(comment);
	} catch {
		json = null;
	}
	const src = json ?? {};
	const v4 = src.v4_prompt?.caption;
	const v4neg = src.v4_negative_prompt?.caption;
	const charCaps = Array.isArray(v4?.char_captions) ? v4.char_captions : [];
	const ucCaps = Array.isArray(v4neg?.char_captions) ? v4neg.char_captions : [];
	const characters = charCaps.map((c, i) => ({
		prompt: String(c?.char_caption || ""),
		uc: String(ucCaps[i]?.char_caption || ""),
		x: Number(c?.centers?.[0]?.x ?? .5),
		y: Number(c?.centers?.[0]?.y ?? .5)
	}));
	return {
		prompt: (v4?.base_caption || src.prompt || texts.prompt || "").toString(),
		uc: (src.uc || src.negative_prompt || "").toString(),
		width: Number(src.width) || void 0,
		height: Number(src.height) || void 0,
		steps: Number(src.steps) || void 0,
		scale: Number(src.scale) || void 0,
		sampler: src.sampler || void 0,
		seed: Number(src.seed) || void 0,
		noiseSchedule: src.noise_schedule || void 0,
		model: src.sm ?? src.model,
		raw,
		characters: characters.length ? characters : void 0
	};
}
async function naiSeedOf(file) {
	try {
		const meta = parseNaiPng(await file.arrayBuffer());
		return meta.seed && meta.seed > 0 ? meta.seed : void 0;
	} catch {
		return;
	}
}
async function compressRef(file, maxEdge = 1024, quality = .85) {
	try {
		const bmp = await createImageBitmap(file);
		const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
		const w = Math.max(1, Math.round(bmp.width * scale));
		const h = Math.max(1, Math.round(bmp.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			bmp.close();
			return file;
		}
		ctx.drawImage(bmp, 0, 0, w, h);
		bmp.close();
		return await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality)) ?? file;
	} catch {
		return file;
	}
}
async function blobRawB64(blob) {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
async function blobDataUrl(id) {
	if (!id) return null;
	const blob = await getImage(id);
	if (!blob) return null;
	return `data:${blob.type || "image/jpeg"};base64,${await blobRawB64(blob)}`;
}
function stripStatus(text) {
	const i = text.lastIndexOf("状态栏:");
	if (i < 0) return {
		body: text.trim(),
		status: ""
	};
	return {
		body: text.slice(0, i).trim(),
		status: text.slice(i).trim()
	};
}
async function decorateVision(chat, msgs) {
	let last = -1;
	for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "user") last = i;
	if (last < 0) return msgs;
	const windowMsgs = chat.messages.slice(0, chat.messages.length);
	const start = Math.max(0, windowMsgs.length - recentWindow());
	const recent = windowMsgs.slice(start);
	let src;
	for (let i = recent.length - 1; i >= 0; i--) if (recent[i].role === "user") {
		src = recent[i];
		break;
	}
	const parts = [{
		type: "text",
		text: msgs[last].content
	}];
	let added = false;
	if (src?.userImageBlobId) {
		const url = await blobDataUrl(src.userImageBlobId);
		if (url) {
			parts.push({
				type: "text",
				text: "下面这张是用户这一轮发来的图。"
			});
			parts.push({
				type: "image_url",
				image_url: { url }
			});
			added = true;
		}
	}
	for (const c of chat.characters) {
		if (!c.lookBlobId) continue;
		const url = await blobDataUrl(c.lookBlobId);
		if (!url) continue;
		const name = c.name.trim() || "角色";
		parts.push({
			type: "text",
			text: `下面这张是${name}的外貌参考，只用来认长相和衣服，不是用户发来的照片。`
		});
		parts.push({
			type: "image_url",
			image_url: { url }
		});
		added = true;
	}
	if (!added) return msgs;
	return msgs.map((m, i) => i === last ? {
		...m,
		content: parts
	} : m);
}
function clampUnit(n, min, max) {
	if (!Number.isFinite(n)) return min;
	return Math.min(max, Math.max(min, n));
}
function recentWindow() {
	const s = useApp.getState().settings;
	return (s.chatSource === "api" ? Math.max(4, s.llmParams.contextTurns) : 20) * 2;
}
function foldWindow() {
	const s = useApp.getState().settings;
	const turns = s.chatSource === "api" ? Math.max(4, s.llmParams.contextTurns) : 20;
	return {
		W: turns * 2,
		I: foldIntervalMessages(turns)
	};
}
function historyMessages(chat, upto) {
	const msgs = chat.messages.slice(0, upto ?? chat.messages.length);
	const start = Math.max(0, msgs.length - recentWindow());
	const recent = msgs.slice(start).filter((m) => m.role !== "narrator" || m.content);
	const standing = standingDirectives(chat);
	let lastUser = -1;
	for (let i = recent.length - 1; i >= 0; i--) if (recent[i].role === "user") {
		lastUser = i;
		break;
	}
	return recent.map((m, i) => ({
		role: m.role === "user" ? "user" : "assistant",
		content: m.role === "user" ? formatUserForChat(m.userImageBlobId && !m.content.trim() ? "用户这轮发来一张图，没有写字。看着这张图回复，不要当成没说话去自己推进剧情。" : m.content, i === lastUser ? standing : []) : stripSpeakerPrefix(replyContextText(m.content), [
			m.characterName,
			chat.name,
			...chat.characters.map((c) => c.name),
			"角色"
		])
	}));
}
async function polishAll(chat, grokModelId, instruction) {
	const style = presetStyle(useApp.getState().settings, "polish", chat);
	const voice = voicePolishExtra(chat);
	const extra = [voice, instruction?.trim() || ""].filter(Boolean).join("\n\n") || void 0;
	return parsePolishJson(await grokOnce({
		task: instruction?.trim() ? "personalize" : "polish",
		grokModelId,
		extraSystem: extra,
		messages: [{
			role: "user",
			content: buildPolishUserContent(chat)
		}],
		...style,
		...voice ? { max_tokens: 6e3 } : {}
	}));
}
async function polishField(chat, grokModelId, field, instruction, charId, onDelta) {
	const char = charId ? chat.characters.find((c) => c.id === charId) : void 0;
	const charIndex = charId ? chat.characters.findIndex((c) => c.id === charId) : -1;
	let current = "";
	if (char && (field === "name" || field === "persona" || field === "speech" || field === "appearance")) current = char[field];
	else if (field === "overview") current = chat.overview;
	else if (field === "opening") current = chat.opening;
	else if (field === "statusBar") current = chat.statusBar;
	const charLabel = char && chat.isMulti ? `角色${charIndex + 1}${char.name ? "「" + char.name + "」" : ""}` : char ? char.name ? `角色「${char.name}」` : "角色" : void 0;
	const voices = field === "persona" && Boolean(char?.personaVoices);
	const payload = {
		task: "field",
		grokModelId,
		extraSystem: fieldPolishHint({
			field,
			instruction,
			current,
			charLabel,
			voices
		}),
		messages: [{
			role: "user",
			content: roleSnapshot(chat)
		}],
		max_tokens: voices ? 4500 : 2e3,
		...presetStyle(useApp.getState().settings, "field", chat)
	};
	if (voices && onDelta) return extractFieldText(await grokStream(payload, (t) => onDelta(stripRoleOutput(t))), field);
	return extractFieldText(await grokOnce(payload), field);
}
async function summarizeMemory(chat, grokModelId, slice, previous, signal, onDelta) {
	const keep = recentWindow();
	const older = slice ?? chat.messages.slice(0, Math.max(0, chat.messages.length - keep));
	if (older.length < 2) throw new Error("memory-skip");
	const dialog = formatMemoryDialog(older);
	if (!dialog.trim()) throw new Error("memory-skip");
	const s = useApp.getState().settings;
	const dest = resolveImageWrite(s.imageModelId);
	const payload = {
		task: "memory",
		grokModelId,
		...imageWriteFields(s.imageModelId),
		params: MEMORY_PARAMS,
		max_tokens: MEMORY_PARAMS.maxTokens,
		messages: [{
			role: "user",
			content: `上一份备忘：\n${previous ?? chat.memory ?? "（无）"}\n\n需要收进去的对白：\n${dialog}`
		}]
	};
	if (!dest.split) payload.grokModelId = grokModelId;
	const clipped = clipMemoryText(await grokStream(payload, (t) => onDelta?.(t), signal));
	if (!isPlausibleMemory(clipped)) throw new Error("memory-invalid");
	return clipped;
}
function nextFoldSlice(chat) {
	const { W, I } = foldWindow();
	return nextAutoSlice(chat.messages.length, chat.memoryUntil || 0, W, I);
}
function imageBrief(chat, opts) {
	const names = chat.characters.map((c) => c.name).filter(Boolean).join("、");
	const format = chat.isMulti && chat.promptMode === "insert" ? multiInsertInstruction(chat.characters, "brief") : chat.isMulti ? "只输出英文 tag 一行，地点写最前。只给在场的人写 char1: ... char2: ...，不在场的整段省略。禁止 JSON，禁止 ENABLED。" : "只输出英文 tag 一行，地点写最前。禁止 JSON。";
	const shot = (opts.shot || "").trim();
	const residual = (opts.residual || opts.last || "").trim();
	const turnUser = chat.isMulti ? `这一轮用户（只用来判断谁在场；姿势、动作、衣服仍只认本镜）：\n${(opts.turnUser || "").trim() || "（无）"}\n\n` : "";
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
function parseImageTagOutput(text, chat) {
	const insert = chat.isMulti && chat.promptMode === "insert";
	const roster = (chat.imageParams.characters.length ? chat.imageParams.characters : chat.characters).map((c) => {
		const role = chat.characters.find((r) => r.id === c.id);
		return {
			id: c.id,
			name: (role?.name || c.name || "").trim()
		};
	});
	const json = extractJsonObject(text);
	if (json && (json.base != null || json.chars != null)) {
		const rawChars = {};
		const src = json.chars && typeof json.chars === "object" ? json.chars : {};
		for (const [k, v] of Object.entries(src)) rawChars[k] = typeof v === "string" ? v : v == null ? "" : JSON.stringify(v);
		const { mapped, leftover } = assignCharTags(rawChars, roster);
		const base = sanitizeNaiTags([String(json.base || ""), leftover].filter(Boolean).join(", "));
		const absent = resolveAbsentIds(json.absent, roster);
		const presence = presenceFromTags(Object.keys(mapped), absent);
		if (!insert) {
			const absentSet = new Set(absent);
			return {
				base: sanitizeNaiTags([base, ...Object.entries(mapped).filter(([id]) => !absentSet.has(id)).map(([, tags]) => tags).filter(Boolean)].filter(Boolean).join(", ")),
				chars: {},
				absent,
				presence
			};
		}
		return {
			base,
			chars: mapped,
			absent,
			presence
		};
	}
	const legacy = chat.isMulti ? legacyPresentIds(text, roster) : void 0;
	return {
		base: sanitizeNaiTags(text.replace(/\n/g, ", ")),
		chars: {},
		absent: [],
		presence: legacy ? {
			mode: "exact",
			ids: legacy
		} : void 0
	};
}
async function writeImageTags(chat, lastText, grokModelId, shotText, prevScene, signal, turnUser) {
	const extra = [
		chat.adultBoost ? "成人提示词加强：开。这是最高优先级之一。对白里的动作、部位、体液必须写成具体真 tag，不要收成 ass focus / naughty face。无关内容仍不要加。只输出标签，不要解释。" : "成人提示词加强：关。对白里看得见的仍写具体真 tag，不要额外堆没写到的器官特写。完全没有性/血腥的场面不要加 nsfw。只输出标签，不要解释。",
		imageLengthRules(chat.imageParams.model, chat.adultBoost),
		chat.isMulti ? IMAGE_MULTI_RULES : "",
		imageApplyRules(chat)
	].filter(Boolean).join("\n\n");
	const imageModelId = useApp.getState().settings.imageModelId;
	const dest = resolveImageWrite(imageModelId);
	const payload = {
		task: "image",
		extraSystem: extra,
		messages: [{
			role: "user",
			content: imageBrief(chat, {
				shot: shotText,
				residual: lastText,
				prevScene,
				turnUser
			})
		}],
		max_tokens: imageWriteMaxTokens(chat.imageParams.model),
		...imageWriteFields(imageModelId)
	};
	if (!dest.split) payload.grokModelId = grokModelId;
	return parseImageTagOutput(await grokOnce(payload, withImageTimeout(signal)), chat);
}
function withImageTimeout(user) {
	const timeout = AbortSignal.timeout(IMAGE_GEN_TIMEOUT_MS);
	return user ? AbortSignal.any([user, timeout]) : timeout;
}
function afterPaint() {
	return new Promise((r) => requestAnimationFrame(() => r()));
}
function sleepMs(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException("Aborted", "AbortError"));
			return;
		}
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			reject(new DOMException("Aborted", "AbortError"));
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function isHopTimeout(e) {
	return e instanceof Error && e.name === "HopTimeout";
}
async function naiHop(body, signal) {
	const hop = AbortSignal.timeout(NAI_HOP_TIMEOUT_MS);
	const combined = signal ? AbortSignal.any([signal, hop]) : hop;
	let res;
	try {
		res = await fetch("/api/nai", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			signal: combined
		});
	} catch (e) {
		if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
		const name = e instanceof Error || e instanceof DOMException ? e.name : "";
		if (name === "AbortError" || name === "TimeoutError") {
			const err = /* @__PURE__ */ new Error("中转站超时，请稍后重试");
			err.name = "HopTimeout";
			throw err;
		}
		throw new Error(imageFailText(e, signal));
	}
	const raw = await res.text();
	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		throw new Error("中转站返回了异常页面");
	}
	if (!data.ok) throw new Error(data.error || "生图失败");
	return data;
}
async function imageFromB64(b64) {
	const bin = atob(b64);
	const arr = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
	const blob = new Blob([arr], { type: "image/png" });
	return {
		blobId: await saveBlob(blob),
		blob
	};
}
async function generateNai(opts) {
	const built = buildNaiPayload({
		params: opts.chat.imageParams,
		grokTail: opts.grokTail,
		charTails: opts.charTails,
		insertMode: opts.chat.promptMode,
		seed: opts.seed
	});
	const blobId = opts.chat.imageParams.img2imgBlobId || opts.turnImageBlobId || "";
	let img2img;
	if (blobId) {
		const blob = await getImage(blobId);
		if (blob) img2img = {
			image: await blobRawB64(blob),
			strength: clampUnit(opts.chat.imageParams.img2imgStrength ?? .7, .01, .99),
			noise: clampUnit(opts.chat.imageParams.img2imgNoise ?? 0, 0, .99)
		};
	}
	const payload = buildIdlecloudBody(built, opts.chat.imageParams, opts.chat.promptMode, img2img);
	opts.onStart?.();
	const finish = async (b64) => {
		opts.onReceiving?.();
		await afterPaint();
		const saved = await imageFromB64(b64);
		return {
			blobId: saved.blobId,
			seed: built.seed,
			prompt: built.finalPrompt,
			blob: saved.blob
		};
	};
	const base = {
		baseUrl: opts.baseUrl,
		apiKey: opts.apiKey
	};
	const started = Date.now();
	const timedOut = () => Date.now() - started >= IMAGE_DRAW_TIMEOUT_MS;
	let submit;
	while (!submit) {
		if (timedOut()) throw new Error("生图超时");
		try {
			submit = await naiHop({
				...base,
				action: "submit",
				payload
			}, opts.signal);
		} catch (e) {
			if (isHopTimeout(e)) continue;
			throw e;
		}
	}
	if (submit.image) return finish(submit.image);
	if (!submit.jobId && !submit.statusUrl && !submit.fileUrl) throw new Error("中转站没有返回任务");
	let statusUrl = submit.statusUrl;
	let fileUrl = submit.fileUrl;
	let v5 = submit.v5;
	while (!timedOut()) {
		if (fileUrl) {
			try {
				const fetched = await naiHop({
					...base,
					action: "fetch",
					fileUrl,
					v5
				}, opts.signal);
				if (fetched.image) return finish(fetched.image);
			} catch (e) {
				if (!isHopTimeout(e)) throw e;
				continue;
			}
			fileUrl = void 0;
		}
		let poll;
		try {
			poll = await naiHop({
				...base,
				action: "poll",
				jobId: submit.jobId,
				statusUrl
			}, opts.signal);
		} catch (e) {
			if (isHopTimeout(e)) continue;
			throw e;
		}
		if (poll.statusUrl) statusUrl = poll.statusUrl;
		if (poll.image) return finish(poll.image);
		if (poll.fileUrl) {
			fileUrl = poll.fileUrl;
			v5 = poll.v5;
			continue;
		}
		const left = IMAGE_DRAW_TIMEOUT_MS - (Date.now() - started);
		if (left <= 0) break;
		await sleepMs(Math.min(NAI_POLL_MS, left), opts.signal);
	}
	throw new Error("生图超时");
}
function parseGroup(text) {
	if (text.split(/<<<(?:CHAR:([^>]+)|NARRATOR)>>>/g).length === 1) return [{
		name: "",
		content: text.trim()
	}];
	const out = [];
	const tokens = text.split(/(<<<CHAR:[^>]+>>>|<<<NARRATOR>>>)/);
	let current = null;
	let buf = "";
	const flush = () => {
		if (current && buf.trim()) out.push({
			...current,
			content: buf.trim()
		});
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
			current = {
				name: "旁白",
				narrator: true
			};
			continue;
		}
		buf += tok;
	}
	flush();
	return out.length ? out : [{
		name: "",
		content: text.trim()
	}];
}
function makeUserMessage(content) {
	return {
		id: uid("m_"),
		role: "user",
		content,
		images: [],
		createdAt: Date.now()
	};
}
function makeAssistantPlaceholder(chat) {
	const names = chat.characters.map((c) => c.name).filter(Boolean);
	return {
		id: uid("m_"),
		role: "assistant",
		characterName: chat.isMulti && chat.multiMode === "together" ? names.join("、") : names[0],
		characterId: chat.characters[0]?.id,
		content: "",
		images: [],
		createdAt: Date.now()
	};
}
function makeImageRecord(partial = {}) {
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
		...partial
	};
}
var aborts = /* @__PURE__ */ new Map();
var busy = /* @__PURE__ */ new Set();
var memoryEpoch = /* @__PURE__ */ new Map();
var memoryBusy = /* @__PURE__ */ new Set();
var memoryAborts = /* @__PURE__ */ new Map();
var imageAborts = /* @__PURE__ */ new Map();
function imageKey(chatId, msgId) {
	return `${chatId}:${msgId}`;
}
function chat(id) {
	return useApp.getState().chats.find((c) => c.id === id);
}
function patch(id, fn) {
	useApp.getState().patchChat(id, fn);
}
function imageOn() {
	return useApp.getState().settings.chatImage !== false;
}
function lastAssist(c) {
	return [...c.messages].reverse().find((m) => m.role === "assistant" || m.role === "narrator");
}
function bumpMemoryEpoch(id) {
	memoryEpoch.set(id, (memoryEpoch.get(id) ?? 0) + 1);
}
async function sendOpening(id) {
	await runReply(id, null, true);
}
async function sendUser(id, text, shot) {
	const t = text.trim();
	abortChat(id);
	const msg = makeUserMessage(t);
	if (shot?.blobId) {
		msg.userImageBlobId = shot.blobId;
		msg.userImageI2i = shot.i2i;
	}
	patch(id, (c) => ({
		...c,
		messages: [...c.messages, msg]
	}));
	await runReply(id, t, false);
}
function abortChat(id) {
	aborts.get(id)?.abort();
	aborts.delete(id);
	for (const [k, ac] of imageAborts) if (k.startsWith(`${id}:`)) {
		ac.abort();
		imageAborts.delete(k);
	}
	invalidateMemory(id);
}
function cancelImage(chatId, msgId) {
	imageAborts.get(imageKey(chatId, msgId))?.abort();
}
function invalidateMemory(id) {
	bumpMemoryEpoch(id);
	memoryAborts.get(id)?.abort();
	memoryAborts.delete(id);
	memoryBusy.delete(id);
	const hint = useApp.getState().ui.memoryHint;
	if (hint?.chatId === id && hint.state === "generating") useApp.getState().setUI({ memoryHint: null });
}
function cancelMemory(id) {
	memoryAborts.get(id)?.abort();
	memoryAborts.delete(id);
	bumpMemoryEpoch(id);
	memoryBusy.delete(id);
	const hint = useApp.getState().ui.memoryHint;
	if (!hint || hint.chatId === id) useApp.getState().setUI({ memoryHint: {
		chatId: id,
		state: "fail",
		error: "已取消"
	} });
}
function retryMemory(id) {
	runMemory(id);
}
async function regenMessage(id, msgId) {
	abortChat(id);
	const c = chat(id);
	if (!c) return;
	const idx = c.messages.findIndex((m) => m.id === msgId);
	if (idx < 0) return;
	const cut = c.messages.slice(0, idx);
	patch(id, (ch) => ({
		...ch,
		messages: cut,
		...applySnaps(rewindSnaps(ch.memorySnaps, cut.length))
	}));
	bumpMemoryEpoch(id);
	await runReply(id, [...cut].reverse().find((m) => m.role === "user")?.content ?? null, cut.length === 0, true);
}
async function branchFrom(id, msgId) {
	const c = chat(id);
	if (!c) return;
	const idx = c.messages.findIndex((m) => m.id === msgId);
	if (idx < 0) return;
	const keep = idx + 1;
	const copy = {
		...structuredClone(c),
		id: uid("chat_"),
		name: `${c.name}(分支)`,
		starred: false,
		isDraft: false,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		messages: structuredClone(c.messages.slice(0, keep)),
		...applySnaps(rewindSnaps(c.memorySnaps, keep))
	};
	useApp.setState((s) => ({
		chats: [...s.chats, copy],
		currentId: copy.id
	}));
	const { db } = await import("../_libs/_.mjs").then((n) => n.o);
	db.chats.put(copy);
	useApp.getState().toast(`已开分支「${copy.name}」`);
}
function applyStream(id, placeholder, full, c0) {
	const { body, status } = stripStatus(full);
	if (c0.isMulti && c0.multiMode === "group") {
		const mapped = parseGroup(full).map((p, i) => ({
			id: i === 0 ? placeholder.id : placeholder.id + "_" + i,
			role: p.narrator ? "narrator" : "assistant",
			characterName: p.narrator ? void 0 : p.name,
			characterId: c0.characters.find((ch) => ch.name === p.name)?.id,
			content: stripStatus(p.content).body,
			images: [],
			createdAt: Date.now()
		}));
		patch(id, (c) => {
			const imgs = c.messages.filter((m) => m.id === placeholder.id || m.id.startsWith(placeholder.id + "_")).flatMap((m) => m.images);
			if (mapped.length && imgs.length) mapped[mapped.length - 1].images = imgs;
			const without = c.messages.filter((m) => m.id !== placeholder.id && !m.id.startsWith(placeholder.id + "_"));
			return {
				...c,
				messages: [...without, ...mapped],
				statusBar: status || c.statusBar
			};
		});
	} else patch(id, (c) => ({
		...c,
		messages: c.messages.map((m) => m.id === placeholder.id ? {
			...m,
			content: body
		} : m),
		statusBar: status || c.statusBar
	}));
}
function ensureWritingImage(id, placeholder) {
	const live = chat(id);
	if (!live) return;
	const target = lastAssist(live) ?? placeholder;
	if (target.images.some((g) => g.status !== "done" && g.status !== "error")) return;
	const img = makeImageRecord({
		model: live.imageParams.model,
		width: live.imageParams.width,
		height: live.imageParams.height,
		steps: live.imageParams.steps,
		sampler: live.imageParams.sampler,
		negative: live.imageParams.negative,
		seed: live.imageParams.seedLocked && live.imageParams.seed != null ? live.imageParams.seed : randomSeed(),
		status: "writing",
		source: "auto"
	});
	patch(id, (ch) => ({
		...ch,
		messages: ch.messages.map((m) => m.id === target.id ? {
			...m,
			images: [...m.images, img]
		} : m)
	}));
}
async function runReply(id, _userText, opening, regen = false) {
	const c0 = chat(id);
	if (!c0) return;
	const grokModelId = useApp.getState().settings.grokModelId;
	const wantImage = imageOn();
	const imageInChat = wantImage && !resolveImageWrite(useApp.getState().settings.imageModelId).split;
	const ctrl = new AbortController();
	aborts.set(id, ctrl);
	busy.add(id);
	const placeholder = makeAssistantPlaceholder(c0);
	patch(id, (c) => ({
		...c,
		messages: [...c.messages, placeholder]
	}));
	const extra = [
		chatContextBlock(c0, { regen }),
		groupFormatHint(c0, imageInChat),
		opening ? "这是开场。根据开场场景，以角色口吻先说第一句。不要以用户身份说话。" : ""
	].filter(Boolean).join("\n\n");
	const live = chat(id);
	const prevScene = previousRoundImagePrompt(live.messages, placeholder.id);
	const hist = historyMessages(live).filter((m) => m.content);
	if (opening && hist.length === 0) hist.push({
		role: "user",
		content: formatUserForChat(OPENING_USER, standingDirectives(live))
	});
	const msgs = await decorateVision(live, hist);
	let raw = "";
	let promptStarted = false;
	let streamFailed = false;
	try {
		raw = await grokStream({
			task: "chat",
			grokModelId,
			extraSystem: extra,
			imageSystem: imageInChat ? chatImageSystem(c0, prevScene) : void 0,
			messages: msgs,
			...presetStyle(useApp.getState().settings, "chat", c0)
		}, (text) => {
			const split = splitChatPrompt(text);
			applyStream(id, placeholder, split.visible, c0);
			if (imageInChat && split.started && !promptStarted) {
				promptStarted = true;
				ensureWritingImage(id, placeholder);
			}
		}, ctrl.signal);
		if (raw) applyStream(id, placeholder, splitChatPrompt(raw).visible, c0);
	} catch (e) {
		if (e.name === "AbortError") return;
		streamFailed = true;
		const split = splitChatPrompt(raw);
		if (!split.visible.trim()) patch(id, (c) => ({
			...c,
			messages: c.messages.map((m) => m.id === placeholder.id ? {
				...m,
				content: m.content || `（回复失败）${e instanceof Error ? e.message : ""}`
			} : m)
		}));
		else applyStream(id, placeholder, split.visible, c0);
	} finally {
		aborts.delete(id);
		busy.delete(id);
	}
	const latest = chat(id);
	if (!latest) return;
	const assist = lastAssist(latest);
	const split = splitChatPrompt(raw);
	const visibleOk = Boolean(split.visible.trim() || assist?.content.trim());
	if (wantImage && assist && visibleOk) {
		if (resolveImageWrite(useApp.getState().settings.imageModelId).split) attachImage(id, assist.id, "rewrite", void 0, void 0, void 0, split.visible);
		else {
			if (promptStarted && !split.started && raw) {
				const again = splitChatPrompt(raw);
				if (again.started) Object.assign(split, again);
			}
			const parsed = split.prompt ? parseImageTagOutput(split.prompt, latest) : null;
			if (Boolean(parsed && (parsed.base || Object.keys(parsed.chars).length)) && parsed) attachImage(id, assist.id, "auto", void 0, void 0, parsed);
			else if (!streamFailed || promptStarted) attachImage(id, assist.id, "rewrite", void 0, void 0, void 0, split.visible);
		}
	}
	if (visibleOk) maybeMemory(id);
}
async function attachImage(id, msgId, mode = "auto", custom, customChars, parsed, shotText) {
	if (!imageOn()) return;
	const c = chat(id);
	if (!c) return;
	const msg = c.messages.find((m) => m.id === msgId);
	if (!msg) return;
	if (msg.images.some((g) => g.status !== "done" && g.status !== "error" && g.status !== "writing")) return;
	const settings = useApp.getState().settings;
	const prev = msg.images.filter((g) => g.prompt).at(-1);
	const writing = msg.images.find((g) => g.status === "writing");
	const needsWrite = !parsed && mode !== "custom" && !(mode === "same" && prev?.prompt);
	const img = writing && (mode === "auto" || mode === "rewrite") ? writing : makeImageRecord({
		model: c.imageParams.model,
		width: c.imageParams.width,
		height: c.imageParams.height,
		steps: c.imageParams.steps,
		sampler: c.imageParams.sampler,
		negative: c.imageParams.negative,
		seed: c.imageParams.seedLocked && c.imageParams.seed != null ? c.imageParams.seed : randomSeed(),
		status: needsWrite ? "writing" : "uploading",
		source: mode
	});
	if (!writing || img.id !== writing.id) {
		if (msg.images.some((g) => g.status !== "done" && g.status !== "error")) return;
		patch(id, (ch) => ({
			...ch,
			messages: ch.messages.map((m) => m.id === msgId ? {
				...m,
				images: [...m.images, img]
			} : m)
		}));
	} else patch(id, (ch) => ({
		...ch,
		messages: ch.messages.map((m) => m.id === msgId ? {
			...m,
			images: m.images.map((g) => g.id === img.id ? {
				...g,
				status: "writing",
				source: mode
			} : g)
		} : m)
	}));
	const setImg = (p) => patch(id, (ch) => ({
		...ch,
		messages: ch.messages.map((m) => m.id === msgId ? {
			...m,
			images: m.images.map((g) => g.id === img.id ? {
				...g,
				...p
			} : g)
		} : m)
	}));
	if (!settings.naiKey) {
		setImg({
			status: "error",
			error: "还没连接 NAI 中转站"
		});
		return;
	}
	const ac = new AbortController();
	const key = imageKey(id, msgId);
	imageAborts.get(key)?.abort();
	imageAborts.set(key, ac);
	try {
		let grokTail = custom ? sanitizeNaiTags(custom, { stripForbidden: false }) : "";
		let charTails = {};
		if (customChars) for (const [k, v] of Object.entries(customChars)) {
			const t = sanitizeNaiTags(v, { stripForbidden: false });
			if (t) charTails[k] = t;
		}
		if (mode !== "custom") {
			if (parsed) {
				grokTail = parsed.base;
				charTails = keepPresentTails(mapCharTails(c, parsed.chars), parsed.presence);
				applyPresence(id, parsed.presence);
			} else if (mode === "same" && prev?.prompt) {
				grokTail = extractGrokTail(prev.prompt, c.imageParams);
				charTails = { ...prev.charTails || {} };
			} else {
				const live = chat(id) ?? c;
				const standing = standingDirectives(live);
				const { shot, residual } = shotAndResidual(live.messages, msgId, shotText, standing);
				const prevScene = previousRoundImagePrompt(live.messages, msgId);
				const tags = await writeImageTags(live, residual, useApp.getState().settings.grokModelId, shot || msg.content, prevScene, ac.signal, latestUserBefore(live.messages, msgId, standing));
				grokTail = tags.base;
				charTails = keepPresentTails(mapCharTails(live, tags.chars), tags.presence);
				applyPresence(id, tags.presence);
			}
		}
		if (!grokTail && !Object.keys(charTails).length) {
			setImg({
				status: "error",
				error: "提示词写失败"
			});
			return;
		}
		setImg({
			status: "uploading",
			prompt: grokTail,
			charTails
		});
		await afterPaint();
		const live = chat(id) ?? c;
		const result = await generateNai({
			chat: live,
			grokTail,
			charTails,
			seed: img.seed,
			apiKey: settings.naiKey,
			baseUrl: settings.naiBase,
			turnImageBlobId: turnI2iBlob(live, msgId),
			signal: ac.signal,
			onStart: () => setImg({ status: "generating" }),
			onReceiving: () => {
				useApp.getState().setCooldown(Date.now() + COOLDOWN_MS);
				setImg({ status: "receiving" });
			}
		});
		setImg({
			status: "done",
			blobId: result.blobId,
			prompt: grokTail,
			charTails,
			seed: result.seed
		});
		const after = chat(id);
		if (after) {
			const firstAssist = after.messages.find((m) => m.role === "assistant" || m.role === "narrator");
			if (firstAssist && firstAssist.id === msgId) patch(id, (ch) => ({
				...ch,
				avatarBlobId: result.blobId
			}));
			else if (!after.avatarBlobId) patch(id, (ch) => ({
				...ch,
				avatarBlobId: result.blobId
			}));
		}
	} catch (e) {
		const err = imageFailText(e, ac.signal);
		setImg({
			status: "error",
			error: err
		});
		if (err !== "已取消") useApp.getState().toast(err);
	} finally {
		if (imageAborts.get(key) === ac) imageAborts.delete(key);
	}
}
function turnI2iBlob(c, msgId) {
	if (c.imageParams.img2imgBlobId) return void 0;
	const idx = c.messages.findIndex((m) => m.id === msgId);
	for (let i = idx - 1; i >= 0; i--) {
		const m = c.messages[i];
		if (m.role === "user") return m.userImageI2i ? m.userImageBlobId : void 0;
	}
}
function mapCharTails(c, chars) {
	const map = {};
	for (const ch of c.imageParams.characters) {
		const roleName = c.characters.find((r) => r.id === ch.id)?.name || "";
		const byId = chars[ch.id];
		const byName = ch.name && chars[ch.name] || roleName && chars[roleName] || "";
		if (byId || byName) map[ch.id] = byId || byName;
	}
	return map;
}
function keepPresentTails(charTails, presence) {
	if (!presence) return charTails;
	if (presence.mode === "exact") {
		const on = new Set(presence.ids);
		const next = {};
		for (const [k, v] of Object.entries(charTails)) if (on.has(k)) next[k] = v;
		return next;
	}
	const off = new Set(presence.ids);
	const next = { ...charTails };
	for (const id of off) delete next[id];
	return next;
}
function applyPresence(id, presence) {
	if (!presence) return;
	patch(id, (ch) => {
		const enabledOf = (slotId) => presence.mode === "exact" ? presence.ids.includes(slotId) : !presence.ids.includes(slotId);
		return {
			...ch,
			characters: ch.characters.map((role) => ({
				...role,
				imageEnabled: enabledOf(role.id)
			})),
			imageParams: {
				...ch.imageParams,
				characters: ch.imageParams.characters.map((x) => ({
					...x,
					enabled: enabledOf(x.id)
				}))
			}
		};
	});
}
function setMemoryHint(chatId, state, extra) {
	if (!state) {
		useApp.getState().setUI({ memoryHint: null });
		return;
	}
	const prev = useApp.getState().ui.memoryHint;
	const keepDraft = state === "generating" && prev?.chatId === chatId ? prev.draft : void 0;
	useApp.getState().setUI({ memoryHint: {
		chatId,
		state,
		error: extra?.error,
		draft: extra?.draft ?? keepDraft
	} });
}
function onMemoryDelta(id) {
	return (t) => {
		const hint = useApp.getState().ui.memoryHint;
		if (hint?.chatId === id && hint.state === "generating") useApp.getState().setUI({ memoryHint: {
			...hint,
			draft: t
		} });
	};
}
async function maybeMemory(id) {
	runMemory(id);
}
async function runMemory(id) {
	const c = chat(id);
	if (!c) return;
	const { W, I } = foldWindow();
	if (memoryCaughtUp(c.messages.length, c.memoryUntil || 0, W, I)) return;
	const slice = nextFoldSlice(c);
	if (!slice) return;
	if (memoryBusy.has(id)) return;
	const nAtStart = c.messages.length;
	const epoch = memoryEpoch.get(id) ?? 0;
	const ctrl = new AbortController();
	memoryAborts.set(id, ctrl);
	memoryBusy.add(id);
	setMemoryHint(id, "generating", { draft: "" });
	try {
		const mem = await summarizeMemory(c, useApp.getState().settings.grokModelId, c.messages.slice(slice.start, slice.end), c.memory, ctrl.signal, onMemoryDelta(id));
		if ((memoryEpoch.get(id) ?? 0) !== epoch) return;
		const live = chat(id);
		if (!live) return;
		if (live.messages.length < slice.end) return;
		const snap = {
			covered: slice.end,
			text: mem,
			foldAt: nAtStart
		};
		patch(id, (ch) => ({
			...ch,
			...applySnaps(pushSnap(ch.memorySnaps, snap))
		}));
		setMemoryHint(id, "ok");
		setTimeout(() => {
			const ui = useApp.getState().ui.memoryHint;
			if (ui?.chatId === id && ui.state === "ok") setMemoryHint(id, null);
		}, 1e3);
	} catch (e) {
		if (e.name === "AbortError") return;
		if ((memoryEpoch.get(id) ?? 0) !== epoch) return;
		setMemoryHint(id, "fail", { error: memoryFailReason(e) });
	} finally {
		if (memoryAborts.get(id) === ctrl) memoryAborts.delete(id);
		memoryBusy.delete(id);
	}
}
async function runManualMemory(id, mode) {
	const c = chat(id);
	if (!c) return false;
	const { W, I } = foldWindow();
	const n = c.messages.length;
	const needed = foldCoveredEnd(n, W, I);
	if (needed < 2) {
		useApp.getState().toast("还不够长，先多聊几轮");
		return false;
	}
	memoryAborts.get(id)?.abort();
	memoryAborts.delete(id);
	memoryBusy.delete(id);
	const epoch = (memoryEpoch.get(id) ?? 0) + 1;
	memoryEpoch.set(id, epoch);
	const ctrl = new AbortController();
	memoryAborts.set(id, ctrl);
	memoryBusy.add(id);
	setMemoryHint(id, "generating", { draft: "" });
	try {
		const grok = useApp.getState().settings.grokModelId;
		const snaps = c.memorySnaps ?? [];
		const delta = onMemoryDelta(id);
		if (mode === "all") {
			const text = await summarizeMemory(c, grok, c.messages.slice(0, needed), "（无）", ctrl.signal, delta);
			patch(id, (ch) => ({
				...ch,
				...applySnaps([{
					covered: needed,
					text,
					foldAt: n
				}])
			}));
		} else if (memoryCaughtUp(n, c.memoryUntil || 0, W, I)) {
			const last = snaps[snaps.length - 1];
			if (!last || last.covered < 2) {
				useApp.getState().toast("还没有可重压的那一截");
				setMemoryHint(id, null);
				return false;
			}
			const prev = snaps[snaps.length - 2];
			const start = prev?.covered ?? 0;
			const text = await summarizeMemory(c, grok, c.messages.slice(start, last.covered), prev?.text ?? "（无）", ctrl.signal, delta);
			patch(id, (ch) => ({
				...ch,
				...applySnaps(pushSnap(ch.memorySnaps, {
					covered: last.covered,
					text,
					foldAt: last.foldAt
				}))
			}));
		} else {
			const start = c.memoryUntil || 0;
			const text = await summarizeMemory(c, grok, c.messages.slice(start, needed), c.memory || "（无）", ctrl.signal, delta);
			patch(id, (ch) => ({
				...ch,
				...applySnaps(pushSnap(ch.memorySnaps, {
					covered: needed,
					text,
					foldAt: n
				}))
			}));
		}
		if ((memoryEpoch.get(id) ?? 0) !== epoch) return false;
		setMemoryHint(id, "ok");
		setTimeout(() => {
			const ui = useApp.getState().ui.memoryHint;
			if (ui?.chatId === id && ui.state === "ok") setMemoryHint(id, null);
		}, 1e3);
		return true;
	} catch (e) {
		if (e.name === "AbortError") return false;
		const reason = memoryFailReason(e);
		useApp.getState().toast(reason === "请求失败" ? "总结失败，旧备忘还在" : `总结失败：${reason}`);
		setMemoryHint(id, "fail", { error: reason });
		return false;
	} finally {
		if (memoryAborts.get(id) === ctrl) memoryAborts.delete(id);
		memoryBusy.delete(id);
	}
}
async function editMessage(id, msgId, text) {
	const c = chat(id);
	if (!c) return;
	const idx = c.messages.findIndex((m) => m.id === msgId);
	if (idx < 0) return;
	const msg = c.messages[idx];
	if (msg.role === "user") {
		abortChat(id);
		bumpMemoryEpoch(id);
		patch(id, (ch) => ({
			...ch,
			messages: [...ch.messages.slice(0, idx), {
				...msg,
				content: text.trim()
			}],
			...applySnaps(rewindSnaps(ch.memorySnaps, idx))
		}));
		await runReply(id, text.trim(), false);
	} else patch(id, (ch) => ({
		...ch,
		messages: ch.messages.map((m) => m.id === msgId ? {
			...m,
			content: text
		} : m)
	}));
}
var ZH_FIX = {
	solo: "单人",
	"1girl": "1个女孩",
	"1boy": "1个男孩",
	"2girls": "2个女孩",
	"multiple girls": "多个女孩",
	breasts: "胸部",
	"looking at viewer": "看向观众",
	"commentary request": "求评论",
	commentary: "评论",
	highres: "高分辨率",
	absurdres: "超高分辨率",
	"open mouth": "张嘴",
	"closed mouth": "闭嘴",
	"large breasts": "巨乳",
	"small breasts": "贫乳",
	"medium breasts": "中等胸部",
	navel: "肚脐",
	panties: "内裤",
	pussy: "小穴",
	penis: "阴茎",
	ass: "臀部",
	nude: "裸体",
	hetero: "男女",
	sex: "性交",
	sitting: "坐着",
	standing: "站立",
	lying: "躺着",
	"cowboy shot": "七分身",
	"upper body": "上半身",
	"full body": "全身",
	"from behind": "从后方",
	"from side": "侧面",
	"from above": "俯视",
	"from below": "仰视",
	"looking back": "回眸",
	"spread legs": "张开腿",
	"animal ears": "兽耳",
	"cat ears": "猫耳",
	tail: "尾巴",
	blush: "脸红",
	smile: "微笑",
	nipples: "乳头",
	uncensored: "无码",
	censored: "有码",
	cum: "精液",
	vaginal: "阴道插入",
	anal: "肛交",
	fellatio: "口交",
	paizuri: "乳交",
	missionary: "传教士",
	doggystyle: "后入",
	"cowgirl position": "骑乘",
	ahegao: "阿黑颜",
	bondage: "捆绑",
	tentacles: "触手",
	"heart-shaped pupils": "爱心瞳",
	"tongue out": "吐舌",
	sweat: "出汗",
	"steaming body": "热气",
	"pussy juice": "爱液",
	"female ejaculation": "潮吹",
	"object insertion": "物体插入",
	"anal object insertion": "肛门物体插入",
	"anus peek": "肛门窥视",
	"after anal": "肛交之后",
	"anal beads": "肛珠",
	"anal tail": "肛尾",
	"anal fingering": "肛门指交",
	anus: "肛门",
	holding: "手持",
	fang: "虎牙",
	"simple background": "简单背景",
	"white background": "白背景",
	original: "原创",
	translated: "已翻译",
	"bad id": "错误ID",
	"bad pixiv id": "错误pixiv ID"
};
var tags = [];
var loaded = false;
var loading = null;
function loadTags() {
	if (loaded) return Promise.resolve();
	if (loading) return loading;
	loading = fetch("/data/tags.json").then((r) => r.json()).then((rows) => {
		tags = rows.map((t) => ({
			...t,
			c: ZH_FIX[t.e] || t.c
		}));
		loaded = true;
	}).catch(() => {
		tags = Object.entries(ZH_FIX).map(([e, c], i) => ({
			e,
			c,
			n: 1e6 - i
		}));
		loaded = true;
	});
	return loading;
}
function lastToken(text, caret) {
	return (text.slice(0, caret).match(/([^,\n]*)$/)?.[1] ?? "").trim();
}
function suggestTags(text, caret, limit = 40) {
	const q = lastToken(text, caret).toLowerCase();
	if (!q) return {
		q,
		total: 0,
		items: []
	};
	const hits = [];
	for (const t of tags) {
		const en = t.e.toLowerCase();
		const zh = t.c;
		if (en.startsWith(q) || en.includes(q) || zh.includes(q)) hits.push(t);
		if (hits.length >= 400) break;
	}
	hits.sort((a, b) => {
		const as = a.e.toLowerCase().startsWith(q) ? 1 : 0;
		const bs = b.e.toLowerCase().startsWith(q) ? 1 : 0;
		if (as !== bs) return bs - as;
		return b.n - a.n;
	});
	return {
		q,
		total: hits.length,
		items: hits.slice(0, limit)
	};
}
function insertTag(text, caret, tag) {
	const left = text.slice(0, caret);
	const right = text.slice(caret);
	const prefix = left.match(/^(.*?)([^,\n]*)$/s)?.[1] ?? left;
	const next = `${prefix}${prefix && !prefix.endsWith("\n") && !/,\s*$/.test(prefix) ? prefix.endsWith(",") ? " " : ", " : ""}${tag}, `;
	return {
		text: next + right.replace(/^\s*,?\s*/, ""),
		caret: next.length
	};
}
function firstChatImageBlob(chat) {
	if (chat.avatarBlobId) return chat.avatarBlobId;
	for (const m of chat.messages ?? []) {
		const hit = m.images?.find((g) => g.status === "done" && g.blobId);
		if (hit?.blobId) return hit.blobId;
	}
}
function IconBtn({ className, children, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex size-10 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-dim/80 active:scale-[0.98]", className),
		...rest,
		children
	});
}
function PrimaryBtn({ className, children, busy, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cn("inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-on-primary shadow-[0_6px_16px_rgb(156_83_72/0.25)] transition hover:bg-primary-hover disabled:opacity-50", className),
		...rest,
		children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), children]
	});
}
function GhostBtn({ className, children, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-[15px] font-medium text-ink transition hover:bg-surface disabled:opacity-50", className),
		...rest,
		children
	});
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[22px] border border-line/80 bg-card p-4 shadow-[0_1px_0_rgb(44_40_36/0.03)]", className),
		children
	});
}
function FieldLabel({ children, hint, sub, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex items-start justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] font-medium text-ink",
					children
				}),
				sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5",
					children: sub
				}) : null,
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-[11px] leading-snug text-muted",
					children: hint
				})
			]
		}), right ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: right
		}) : null]
	});
}
var TextArea = (0, import_react.forwardRef)(function TextArea({ className, ...rest }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		className: cn("min-h-[88px] w-full resize-y rounded-[16px] border border-line bg-surface/60 px-3.5 py-3 text-[14px] leading-relaxed text-ink outline-none placeholder:text-faint focus:border-primary/40 focus:bg-card", className),
		...rest
	});
});
function TextInput({ className, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-full border border-line bg-card px-4 text-[14px] outline-none placeholder:text-faint focus:border-primary/40", className),
		...rest
	});
}
function Switch({ on, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": on,
		"aria-label": label,
		onClick: () => onChange(!on),
		className: cn("relative inline-flex h-7 w-12 shrink-0 items-center overflow-hidden rounded-full p-0.5 transition-colors", on ? "bg-primary" : "bg-line-strong"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-6 rounded-full bg-card shadow-sm transition-transform", on ? "translate-x-5" : "translate-x-0") })
	});
}
function Slider({ value, min, max, step, onChange, disabled }) {
	const track = (0, import_react.useRef)(null);
	const span = max - min || 1;
	const pct = Math.min(100, Math.max(0, (value - min) / span * 100));
	const snap = (raw) => {
		const s = step && step > 0 ? step : 1;
		const n = Math.round(raw / s) * s;
		const clamped = Math.min(max, Math.max(min, n));
		const digits = s < .1 ? 2 : s < 1 ? 1 : 0;
		return Number(clamped.toFixed(digits));
	};
	const fromX = (clientX) => {
		const el = track.current;
		if (!el || disabled) return;
		const r = el.getBoundingClientRect();
		const t = r.width <= 0 ? 0 : (clientX - r.left) / r.width;
		onChange(snap(min + t * span));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: track,
		role: "slider",
		"aria-valuemin": min,
		"aria-valuemax": max,
		"aria-valuenow": value,
		"aria-disabled": disabled || void 0,
		className: cn("relative h-6 w-full touch-none select-none", disabled ? "opacity-40" : "cursor-pointer"),
		onPointerDown: (e) => {
			if (disabled) return;
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			fromX(e.clientX);
		},
		onPointerMove: (e) => {
			if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
			fromX(e.clientX);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line-strong" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary",
				style: { width: `${pct}%` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-card shadow-[0_1px_4px_rgb(44_40_36/0.35)] ring-1 ring-black/10",
				style: { left: `${pct}%` }
			})
		]
	});
}
function ExpandSelect({ value, options, onChange, render, className, align = "center", menu }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const current = options.find((o) => o.id === value);
	const trigger = current?.short ?? current?.label ?? "";
	(0, import_react.useEffect)(() => {
		const fn = (e) => {
			if (!ref.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", fn);
		return () => document.removeEventListener("mousedown", fn);
	}, []);
	const menuSide = menu ?? (align === "left" ? "start" : "center");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: cn("inline-flex h-9 items-center gap-1 rounded-full px-3 text-[14px] font-medium", current?.danger ? "text-danger" : "text-ink", align === "center" ? "justify-center" : "w-full justify-between"),
			children: [render ? render(value, trigger) : trigger, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted transition", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("absolute top-[110%] z-50 min-w-[10rem] overflow-hidden rounded-[20px] border border-line bg-card py-1 shadow-[0_16px_40px_rgb(44_40_36/0.16)]", menuSide === "start" && "left-0", menuSide === "end" && "right-0", menuSide === "center" && (align === "left" ? "left-0 right-0 w-full" : "left-1/2 w-[min(280px,80vw)] -translate-x-1/2")),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[50vh] overflow-auto scroll-thin",
				children: options.map((o) => o.header ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-1.5 text-center text-[12px] font-medium text-good",
					children: o.label
				}, o.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(o.id);
						setOpen(false);
					},
					className: cn("flex w-full items-center gap-2 px-4 py-3 text-left text-[14px]", o.danger && "text-danger", o.id === value ? "bg-dim/70 font-medium" : "hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate",
						children: o.label
					}), o.id === value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("size-4 shrink-0", o.danger ? "text-danger" : "text-primary") })]
				}, o.id))
			})
		})]
	});
}
function ToastHost() {
	const toasts = useApp((s) => s.toasts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-4",
		children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-full bg-good px-4 py-2 text-[13px] text-on-primary shadow-lg",
			style: { animation: "toast-in 180ms ease" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), t.text]
		}, t.id))
	});
}
function Modal({ open, onClose, title, children, wide, hideClose }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[70] flex items-start justify-center px-5 pt-[12vh] pb-[max(16px,env(safe-area-inset-bottom))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0 bg-overlay",
			onClick: onClose,
			"aria-label": "关闭"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative max-h-[calc(100dvh-12vh-16px-env(safe-area-inset-bottom))] w-full overflow-y-auto overscroll-contain rounded-[24px] bg-bg shadow-2xl scroll-thin", wide ? "max-w-lg" : "max-w-sm"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("sticky top-0 z-10 flex items-center bg-bg px-5 pt-5 pb-4", hideClose ? "" : "justify-between"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[18px] font-semibold",
					children: title
				}), !hideClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					onClick: onClose,
					className: "size-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 pb-5",
				children
			})]
		})]
	});
}
function ConfirmHost() {
	const confirm = useApp((s) => s.ui.confirm);
	const setUI = useApp((s) => s.setUI);
	if (!confirm) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: () => setUI({ confirm: null }),
		title: confirm.title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-5 text-[14px] leading-relaxed text-muted",
			children: confirm.body
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: () => setUI({ confirm: null }),
				children: "取消"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
				className: confirm.danger ? "bg-danger hover:bg-danger/90" : "",
				onClick: () => {
					confirm.onOk();
					setUI({ confirm: null });
				},
				children: "确定"
			})]
		})]
	});
}
function useCooldown(until) {
	const [, tick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (until <= Date.now()) return;
		const id = setInterval(() => tick((n) => n + 1), 250);
		return () => clearInterval(id);
	}, [until]);
	return Math.max(0, Math.ceil((until - Date.now()) / 1e3));
}
function Avatar({ url, name, dim, size = 40 }) {
	const ch = (name || "角").slice(0, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden rounded-full bg-dim text-center font-medium text-primary", dim && "opacity-55"),
		style: {
			width: size,
			height: size,
			lineHeight: `${size}px`,
			fontSize: size * .4
		},
		children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: "",
			className: "size-full object-cover"
		}) : ch
	});
}
function useBlobUrl(id) {
	const [url, setUrl] = (0, import_react.useState)(() => cachedUrl(id));
	(0, import_react.useEffect)(() => {
		let gone = false;
		if (!id) {
			setUrl(null);
			return;
		}
		const hit = cachedUrl(id);
		if (hit) {
			setUrl(hit);
			return;
		}
		setUrl(null);
		imageUrl(id).then((u) => {
			if (!gone) setUrl(u);
		});
		return () => {
			gone = true;
		};
	}, [id]);
	return url;
}
function ChatAvatar({ chat, name, size, dim }) {
	const url = useBlobUrl(firstChatImageBlob(chat));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
		url,
		name: name ?? chat.name,
		size,
		dim
	});
}
function ChatModelSelect({ align = "center", className }) {
	const source = useApp((s) => s.settings.chatSource);
	const grok = useApp((s) => s.settings.grokModelId);
	const llmModel = useApp((s) => s.settings.llmModel);
	const starred = useApp((s) => s.settings.llmStarred);
	const available = useApp((s) => s.settings.llmModels);
	const connected = useApp((s) => s.settings.llmConnected);
	if (source === "api") {
		const ids = chatPickerModels(starred, available, llmModel);
		if (!connected || ids.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "inline-flex h-9 items-center rounded-full px-3 text-[14px] font-medium text-muted",
			onClick: () => useApp.getState().setUI({
				connection: true,
				llmSettings: true
			}),
			children: connected ? "去标星模型" : "先连接 API"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
			value: llmModel || ids[0],
			options: ids.map((id) => ({
				id,
				label: id,
				short: shortModelLabel(id)
			})),
			onChange: (id) => useApp.getState().setSettings(applyLlmPick(useApp.getState().settings, id)),
			align,
			className
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
		value: grok,
		options: GROK_MODELS$1.map((m) => ({
			id: m.id,
			label: m.label,
			short: m.short
		})),
		onChange: (id) => useApp.getState().setGrok(id),
		align,
		className
	});
}
function ChatPane({ chat }) {
	const left = useCooldown(useApp((s) => s.settings.cooldownUntil));
	const chatImage = useApp((s) => s.settings.chatImage !== false);
	const memoryHint = useApp((s) => s.ui.memoryHint);
	const editUser = useApp((s) => s.ui.editUserMsg?.chatId === chat.id ? s.ui.editUserMsg : null);
	const scroller = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const [atBottom, setAtBottom] = (0, import_react.useState)(true);
	const draft = useApp((s) => s.composerDrafts[chat.id] ?? "");
	const shot = useApp((s) => s.composerShots[chat.id]);
	const fileRef = (0, import_react.useRef)(null);
	const [shotUrl, setShotUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!shot?.blobId) {
			setShotUrl(null);
			return;
		}
		let dead = false;
		imageUrl(shot.blobId).then((u) => {
			if (!dead) setShotUrl(u);
		});
		return () => {
			dead = true;
		};
	}, [shot?.blobId]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = chat.scrollTop || 0;
		const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
		setAtBottom(bottom);
	}, [chat.id]);
	(0, import_react.useEffect)(() => {
		if (editUser) requestAnimationFrame(() => inputRef.current?.focus());
	}, [editUser?.msgId]);
	const onScroll = () => {
		const el = scroller.current;
		if (!el) return;
		const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
		setAtBottom(bottom);
		useApp.getState().patchChat(chat.id, { scrollTop: el.scrollTop });
	};
	const startUserEdit = (msgId, content) => {
		const backup = editUser ? editUser.backup : draft;
		useApp.getState().setUI({ editUserMsg: {
			chatId: chat.id,
			msgId,
			backup
		} });
		useApp.getState().setComposerDraft(chat.id, content);
		requestAnimationFrame(() => inputRef.current?.focus());
	};
	const cancelUserEdit = () => {
		if (!editUser) return;
		useApp.getState().setComposerDraft(chat.id, editUser.backup);
		useApp.getState().setUI({ editUserMsg: null });
	};
	const send = () => {
		const t = draft;
		if (editUser) {
			const { msgId, backup } = editUser;
			useApp.getState().setUI({ editUserMsg: null });
			useApp.getState().setComposerDraft(chat.id, backup);
			editMessage(chat.id, msgId, t);
			return;
		}
		useApp.getState().setComposerDraft(chat.id, "");
		const pending = shot?.blobId ? {
			blobId: shot.blobId,
			i2i: shot.i2i
		} : void 0;
		useApp.getState().setComposerShot(chat.id, null);
		sendUser(chat.id, t, pending);
	};
	const portrait = chat.imageParams.height >= chat.imageParams.width;
	const { W, I } = foldWindow();
	const memOk = memoryCaughtUp(chat.messages.length, chat.memoryUntil || 0, W, I);
	const memMine = memoryHint?.chatId === chat.id;
	const memGenerating = memMine && memoryHint?.state === "generating";
	const memOkFlash = memMine && memoryHint?.state === "ok";
	const memFail = !memOk && !memGenerating && !memOkFlash;
	const failReason = memMine && memoryHint?.state === "fail" ? memoryHint.error : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex shrink-0 items-center justify-center gap-1 px-2 py-1",
				children: [
					chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
							value: chat.promptMode,
							options: [{
								id: "insert",
								label: "插入版"
							}, {
								id: "legacy",
								label: "原版"
							}],
							onChange: (id) => useApp.getState().patchChat(chat.id, { promptMode: id }),
							menu: "start"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatModelSelect, {}),
					chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
							value: chat.multiMode,
							options: [{
								id: "together",
								label: "多人同聊模式"
							}, {
								id: "group",
								label: "群聊模式"
							}],
							onChange: (id) => useApp.getState().patchChat(chat.id, { multiMode: id }),
							menu: "end"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				onScroll,
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4 scroll-thin",
				children: [chat.messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-6 max-w-md rounded-2xl bg-card px-4 py-4 text-[13px] leading-7 text-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "聊天：在输入框里写完点发送即可。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "生图参数：只作用于当前角色的配图，模型、提示词、分辨率、步数都在那里改。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "纯生图：只出图，不聊天，参数和聊天完全独立。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "顶栏可切换当前用的模型。润色人设、写提示词、聊天回复都用同一个。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								"对 ",
								chat.name || "她",
								" 说点什么。(动作) 是已经发生的事实，《》是给 AI 的指令，角色听不见。"
							]
						})
					]
				}), chat.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
					chat,
					msg: m,
					showImageTray: chatImage && m.role !== "user",
					onUseOption: (t) => {
						useApp.getState().setComposerDraft(chat.id, t);
						requestAnimationFrame(() => inputRef.current?.focus());
					},
					onEditUser: m.role === "user" ? () => startUserEdit(m.id, m.content) : void 0
				}, m.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-bg px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex h-6 items-center gap-1.5 px-0.5 text-[13px] leading-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex h-[22px] items-center gap-1.5 rounded-md border border-line bg-card px-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: cnToggle(portrait),
										onClick: () => {
											if (!portrait) useApp.getState().patchParams(chat.id, {
												width: chat.imageParams.height,
												height: chat.imageParams.width
											});
										},
										children: "竖图"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-faint",
										children: "|"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: cnToggle(!portrait),
										onClick: () => {
											if (portrait) useApp.getState().patchParams(chat.id, {
												width: chat.imageParams.height,
												height: chat.imageParams.width
											});
										},
										children: "横图"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-w-0 flex-1 items-center justify-center",
								children: chatImage ? left > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-danger",
									children: [left, "s"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-good",
									children: "可生图"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "生图已关"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: chat.adultBoost ? "inline-flex h-[22px] items-center rounded-md border border-line px-1.5 font-medium text-ink" : "inline-flex h-[22px] items-center rounded-md border border-line px-1.5 text-muted",
								onClick: () => useApp.getState().patchChat(chat.id, { adultBoost: !chat.adultBoost }),
								children: "成人提示词"
							})
						]
					}),
					memGenerating || memOkFlash || memFail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 px-[52px] pb-1 text-[12px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: memFail ? "min-w-0 flex-1 text-danger" : memOkFlash ? "min-w-0 flex-1 text-good" : "min-w-0 flex-1 text-faint",
							children: memGenerating ? "生成记忆中" : memOkFlash ? "记忆已生成" : failReason ? `记忆生成失败（${failReason}）` : "记忆生成失败"
						}), memGenerating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "shrink-0 text-muted",
							onClick: () => cancelMemory(chat.id),
							children: "取消"
						}) : memFail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "shrink-0 text-muted",
							onClick: () => retryMemory(chat.id),
							children: "重试"
						}) : null]
					}) : null,
					shot?.blobId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 ml-11 flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [shotUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: shotUrl,
								alt: "",
								className: "h-24 w-20 rounded-[14px] object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-20 rounded-[14px] bg-dim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-card text-ink",
								"aria-label": "去掉图片",
								onClick: () => useApp.getState().setComposerShot(chat.id, null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full border px-2.5 py-1 text-[12px] ${shot.i2i ? "border-primary bg-primary text-on-primary" : "border-line text-muted"}`,
							onClick: () => useApp.getState().setComposerShot(chat.id, {
								blobId: shot.blobId,
								i2i: !shot.i2i
							}),
							children: "以图生图"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-9 shrink-0 place-items-center rounded-full text-muted",
								onClick: () => {
									const el = scroller.current;
									if (!el) return;
									if (atBottom) el.scrollTo({
										top: 0,
										behavior: "smooth"
									});
									else el.scrollTo({
										top: el.scrollHeight,
										behavior: "smooth"
									});
								},
								"aria-label": atBottom ? "回到顶部" : "回到底部",
								children: atBottom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5 rotate-180" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								value: draft,
								onChange: (e) => useApp.getState().setComposerDraft(chat.id, e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										send();
									}
								},
								rows: 1,
								placeholder: "",
								className: "max-h-32 min-h-[46px] flex-1 resize-none rounded-full border border-line bg-card px-4 py-3 text-[14px] outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink",
								"aria-label": "添加图片",
								onClick: () => fileRef.current?.click(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file) return;
									compressRef(file, 1024, .85).then(async (blob) => {
										const id = await saveBlob(blob);
										useApp.getState().setComposerShot(chat.id, {
											blobId: id,
											i2i: false
										});
									});
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: send,
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary",
								"aria-label": editUser ? "保存" : "发送",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-5" })
							})
						]
					}),
					editUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-[12px] text-muted",
							onClick: cancelUserEdit,
							children: "取消编辑"
						})
					}) : null
				]
			})
		]
	});
}
function UserShot({ blobId, i2i }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let dead = false;
		imageUrl(blobId).then((u) => {
			if (!dead) setUrl(u);
		});
		return () => {
			dead = true;
		};
	}, [blobId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex max-w-[85%] flex-col items-end",
		children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: "",
			className: "h-28 max-w-full rounded-[14px] object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 w-24 rounded-[14px] bg-dim" }), i2i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[11px] text-muted",
			children: "以图生图"
		}) : null]
	});
}
function jumpParams(section) {
	useApp.getState().setUI({ paramsJump: section });
	useApp.getState().setTab("params");
}
function cnToggle(on) {
	return on ? "px-1 font-medium text-ink" : "px-1 text-muted";
}
function Bubble({ chat, msg, showImageTray, onUseOption, onEditUser }) {
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)(msg.content);
	const editRef = (0, import_react.useRef)(null);
	const generating = msg.role !== "user" && !msg.content;
	const names = [
		msg.characterName,
		chat.name,
		...chat.characters.map((c) => c.name),
		"角色"
	];
	const editingUser = useApp((s) => s.ui.editUserMsg?.msgId === msg.id);
	const startAssistEdit = () => {
		setText(msg.content);
		setEdit(true);
		requestAnimationFrame(() => editRef.current?.focus());
	};
	if (msg.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-col items-end",
		children: [
			msg.userImageBlobId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserShot, {
				blobId: msg.userImageBlobId,
				i2i: msg.userImageI2i
			}) : null,
			msg.content.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("w-fit min-h-[2.75rem] min-w-[5.5rem] max-w-[85%] rounded-[18px] border px-4 py-2.5", editingUser ? "border-primary bg-card" : "border-line bg-card"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "whitespace-pre-wrap text-[14px] leading-relaxed text-ink",
					children: msg.content
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex justify-end gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					onClick: () => onEditUser?.(),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }),
					label: "编辑"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					onClick: () => void branchFrom(chat.id, msg.id),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-3" }),
					label: "开分支"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "mb-2 flex items-center gap-2",
			onClick: () => useApp.getState().beginEdit(chat.id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatAvatar, {
				chat,
				name: msg.characterName || chat.name,
				size: 36
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[16px] font-semibold",
				children: msg.characterName || chat.name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pl-[44px]",
			children: [
				generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-sans text-[14px] text-muted",
					children: ["回复中", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex gap-0.5 pl-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "animate-pulse",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "animate-pulse",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "animate-pulse",
								children: "·"
							})
						]
					})]
				}) : edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					ref: editRef,
					value: text,
					onChange: (e) => setText(e.target.value),
					className: "serif-body min-h-[120px] w-full resize-y bg-transparent text-[16px] leading-relaxed text-narrate outline-none"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyView, {
					text: msg.content,
					names,
					onUseOption
				}),
				edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-7 items-center rounded-full border border-line bg-card px-3 text-[12px] text-muted",
						onClick: () => setEdit(false),
						children: "取消"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-7 items-center rounded-full bg-primary px-3 text-[12px] text-on-primary",
						onClick: () => {
							editMessage(chat.id, msg.id, text);
							setEdit(false);
						},
						children: "保存"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							onClick: () => void regenMessage(chat.id, msg.id),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" }),
							label: "重新生成"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							onClick: () => void branchFrom(chat.id, msg.id),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-3" }),
							label: "开分支"
						}),
						!generating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							onClick: startAssistEdit,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }),
							label: "编辑"
						})
					]
				}),
				(msg.images.length > 0 || showImageTray && !generating) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageBlock, {
					chat,
					msg,
					allowEmpty: Boolean(showImageTray && !generating)
				})
			]
		})]
	});
}
function ReplyView({ text, names, onUseOption }) {
	const parsed = parseReplyMarkup(text);
	const think = parsed.folds.filter((f) => f.kind === "think");
	const notes = parsed.folds.filter((f) => f.kind === "note");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		think.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyFoldRow, { fold: f }, `think-${i}-${f.title}`)),
		parsed.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RpBody, {
			text: parsed.body,
			names
		}) : null,
		notes.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyFoldRow, { fold: f }, `note-${i}-${f.title}`)),
		parsed.options.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-1.5",
			children: parsed.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onUseOption?.(opt),
				className: "block w-full rounded-[16px] border border-line bg-card px-3 py-2 text-left text-[13px] leading-snug text-ink",
				children: opt
			}, i))
		}) : null
	] });
}
function ReplyFoldRow({ fold }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: fold.kind === "think" ? "mb-2" : "mt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "inline-flex items-center gap-1 text-[12px] text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 shrink-0 transition", open ? "" : "-rotate-90") }), fold.title]
		}), open && fold.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-narrate",
			children: fold.body
		}) : null]
	});
}
function RpBody({ text, names }) {
	const { body, status } = stripStatus(stripSpeakerPrefix(text, names));
	const parts = splitDialogue(body);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "serif-body whitespace-pre-wrap text-[16px] text-narrate",
		children: parts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: p.kind === "say" ? "font-semibold italic text-ink" : void 0,
			children: p.text
		}, i))
	}), status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 whitespace-pre-wrap font-sans text-[13px] leading-6 text-ink",
		children: status
	}) : null] });
}
function Mini({ icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "inline-flex h-6 items-center gap-0.5 rounded-full border border-line bg-card px-2 text-[11px] leading-none text-muted",
		children: [icon, label]
	});
}
function ImageBlock({ chat, msg, allowEmpty }) {
	const chatImage = useApp((s) => s.settings.chatImage !== false);
	const done = msg.images.filter((g) => g.status === "done" && g.blobId);
	const pendingImg = msg.images.find((g) => g.status !== "done" && g.status !== "error");
	const pending = Boolean(pendingImg);
	const followLatest = (0, import_react.useRef)(true);
	const prevDone = (0, import_react.useRef)(done.length);
	const [idx, setIdx] = (0, import_react.useState)(() => Math.max(0, done.length - 1));
	const [url, setUrl] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [kick, setKick] = (0, import_react.useState)(null);
	const [flashErr, setFlashErr] = (0, import_react.useState)(null);
	const seenFail = (0, import_react.useRef)("");
	const current = done[idx] ?? done[done.length - 1];
	const busy = kick ?? pendingImg?.source ?? null;
	const locked = pending || Boolean(kick) || !chatImage;
	(0, import_react.useEffect)(() => {
		if (!pending) setKick(null);
	}, [pending]);
	(0, import_react.useEffect)(() => {
		if (done.length > prevDone.current) {
			setIdx(done.length - 1);
			followLatest.current = true;
		} else if (idx >= done.length && done.length > 0) setIdx(done.length - 1);
		prevDone.current = done.length;
	}, [done.length, idx]);
	(0, import_react.useEffect)(() => {
		let gone = false;
		if (current?.blobId) imageUrl(current.blobId).then((u) => {
			if (!gone) setUrl(u);
		});
		else setUrl(null);
		return () => {
			gone = true;
		};
	}, [current?.blobId]);
	const go = (dir) => {
		const n = done.length;
		if (n < 2) return;
		setIdx((i) => {
			const next = (i + dir + n) % n;
			followLatest.current = next === n - 1;
			return next;
		});
	};
	const latest = msg.images.at(-1);
	const lastError = latest?.status === "error" ? latest : void 0;
	const phaseLabel = genPhaseLabel(pendingImg?.status) || (kick === "rewrite" || kick === "auto" ? "写提示词中" : kick ? "上传中" : "");
	(0, import_react.useEffect)(() => {
		if (pending || !lastError || !current?.blobId) {
			if (!lastError) setFlashErr(null);
			return;
		}
		if (seenFail.current === lastError.id) return;
		seenFail.current = lastError.id;
		setFlashErr(genPhaseLabel("error", lastError.error));
		const t = window.setTimeout(() => setFlashErr(null), 2e3);
		return () => window.clearTimeout(t);
	}, [
		pending,
		lastError,
		current?.blobId
	]);
	if (msg.images.length === 0 && !allowEmpty) return null;
	const showFrame = msg.images.length > 0 || pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 text-left text-[11px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jumpParams("model"),
						children: modelLabel(current.model)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jumpParams("size"),
						children: [
							current.width,
							"×",
							current.height
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jumpParams("steps"),
						children: [current.steps, "步"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jumpParams("sampler"),
						children: samplerLabel(current.sampler)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							useApp.getState().patchParams(chat.id, { seed: current.seed });
							jumpParams("seed");
						},
						children: String(current.seed).slice(0, 8)
					}),
					chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-danger",
						onClick: () => jumpParams("chars"),
						children: "多"
					})
				]
			}),
			showFrame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-[18px] bg-dim",
				children: current && url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: url,
						alt: "",
						className: "w-full"
					}), done.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute inset-y-0 left-0 w-1/2",
						onClick: () => go(-1),
						"aria-label": "上一张"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute inset-y-0 right-0 w-1/2",
						onClick: () => go(1),
						"aria-label": "下一张"
					})] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid place-items-center px-4 text-[13px] text-muted",
					style: { aspectRatio: `${chat.imageParams.width} / ${chat.imageParams.height}` },
					children: pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }),
								" ",
								phaseLabel || "准备中"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-primary",
							onClick: () => cancelImage(chat.id, msg.id),
							children: "取消"
						})]
					}) : lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-center text-danger",
						children: genPhaseLabel("error", lastError.error)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-center text-muted",
						children: "还没有配图"
					})
				})
			}) : null,
			flashErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 truncate text-center text-[11px] leading-4 text-danger",
				children: flashErr
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-4 text-[12px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcoBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }),
						label: busy === "same" && phaseLabel ? phaseLabel : "重新生成",
						busy: busy === "same",
						disabled: locked || !current,
						onClick: () => {
							if (busy === "same") {
								cancelImage(chat.id, msg.id);
								return;
							}
							if (locked || !current) return;
							setKick("same");
							attachImage(chat.id, msg.id, "same");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcoBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
						label: (busy === "rewrite" || busy === "auto") && phaseLabel ? phaseLabel : "换提示词生成",
						busy: busy === "rewrite" || busy === "auto",
						disabled: locked,
						onClick: () => {
							if (busy === "rewrite" || busy === "auto") {
								cancelImage(chat.id, msg.id);
								return;
							}
							if (locked) return;
							setKick("rewrite");
							attachImage(chat.id, msg.id, "rewrite");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcoBtn, {
						icon: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
						label: "下载",
						disabled: !current?.blobId,
						onClick: async () => {
							if (!current?.blobId) return;
							const u = await imageUrl(current.blobId);
							if (!u) return;
							downloadBlob(await fetch(u).then((r) => r.blob()), String(current.seed));
							setSaved(true);
							setTimeout(() => setSaved(false), 1e3);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IcoBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }),
						label: busy === "custom" && phaseLabel ? phaseLabel : "自定义修改",
						busy: busy === "custom",
						disabled: !chatImage,
						onClick: () => {
							const src = pendingImg && (pendingImg.prompt || pendingImg.charTails) ? pendingImg : current ?? pendingImg;
							if (!src) return;
							useApp.getState().setUI({ customPrompt: {
								chatId: chat.id,
								msgId: msg.id,
								imgId: src.id,
								text: extractGrokTail(src.prompt, chat.imageParams) || src.prompt || "",
								charTails: { ...src.charTails || {} }
							} });
						}
					})
				]
			})
		]
	});
}
function IcoBtn({ icon, label, onClick, busy, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		disabled: busy ? false : disabled,
		"aria-busy": busy || void 0,
		"aria-label": label,
		className: busy ? "flex w-full min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-primary" : "flex w-full min-w-0 flex-col items-center gap-1 px-1 py-1 text-center disabled:opacity-40",
		children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 shrink-0 animate-spin" }) : icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "max-w-full truncate",
			children: label
		})]
	});
}
function CustomPromptModal() {
	const data = useApp((s) => s.ui.customPrompt);
	const setUI = useApp((s) => s.setUI);
	const chat = useApp((s) => data ? s.chats.find((c) => c.id === data.chatId) : void 0);
	const msg = chat?.messages.find((m) => m.id === data?.msgId);
	const live = msg?.images.find((g) => g.id === data?.imgId);
	const generating = msg?.images.some((g) => g.status !== "done" && g.status !== "error") ?? false;
	const [text, setText] = (0, import_react.useState)(data?.text ?? "");
	const [charTails, setCharTails] = (0, import_react.useState)(data?.charTails ?? {});
	const edited = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		edited.current = false;
		setText(data?.text ?? "");
		setCharTails(data?.charTails ?? {});
	}, [data?.text, data?.imgId]);
	const liveKey = live ? `${live.id}\n${live.prompt}\n${JSON.stringify(live.charTails || {})}` : "";
	(0, import_react.useEffect)(() => {
		if (!chat || !live || edited.current) return;
		if (!live.prompt && !live.charTails) return;
		setText(extractGrokTail(live.prompt, chat.imageParams) || live.prompt || "");
		setCharTails({ ...live.charTails || {} });
	}, [liveKey]);
	if (!data || !chat) return null;
	const insert = chat.isMulti && chat.promptMode === "insert";
	const chars = chat.imageParams.characters;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: () => setUI({ customPrompt: null }),
		title: "自定义修改提示词",
		children: [
			insert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[12px] leading-5 text-muted",
					children: "总提示追加到「正面提示词 · 中」后面，各角色追加到对应角色正面提示词后面。不会写入 ENABLED。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-[13px] font-medium",
					children: "总提示（正面提示词 · 中）"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					className: "min-h-[96px]",
					value: text,
					onChange: (e) => {
						edited.current = true;
						setText(e.target.value);
					}
				}),
				chars.map((ch, i) => {
					const name = (chat.characters.find((c) => c.id === ch.id)?.name || ch.name || "").trim();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 text-[13px] font-medium",
							children: [
								"角色",
								i + 1,
								name ? `:${name}` : "",
								" 正面提示词"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							className: "min-h-[88px]",
							value: charTails[ch.id] ?? "",
							onChange: (e) => {
								edited.current = true;
								setCharTails((prev) => ({
									...prev,
									[ch.id]: e.target.value
								}));
							}
						})]
					}, ch.id);
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				className: "min-h-[160px]",
				value: text,
				onChange: (e) => {
					edited.current = true;
					setText(e.target.value);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "h-12 flex-1 rounded-full border border-line bg-card text-[15px] font-medium",
					onClick: () => setUI({ customPrompt: null }),
					children: "取消"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: generating,
					className: "h-12 flex-[1.2] rounded-full bg-primary text-[15px] font-medium text-on-primary disabled:opacity-40",
					onClick: () => {
						if (generating) return;
						attachImage(data.chatId, data.msgId, "custom", text, insert ? charTails : void 0);
						setUI({ customPrompt: null });
					},
					children: "按这个生成"
				})]
			}),
			generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 w-full text-center text-[13px] text-danger",
				onClick: () => {
					cancelImage(data.chatId, data.msgId);
					setUI({ customPrompt: null });
				},
				children: "取消这次生图"
			}) : null
		]
	});
}
function ConnectionPanel() {
	const open = useApp((s) => s.ui.connection);
	const settings = useApp((s) => s.settings);
	const setUI = useApp((s) => s.setUI);
	const [key, setKey] = (0, import_react.useState)(settings.naiKey);
	const [base, setBase] = (0, import_react.useState)(settings.naiBase || "https://api.idlecloud.cc");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [dl, setDl] = (0, import_react.useState)(false);
	const [apiOpen, setApiOpen] = (0, import_react.useState)(false);
	const llmSettings = useApp((s) => s.ui.llmSettings);
	(0, import_react.useEffect)(() => {
		if (!open || !llmSettings) return;
		setApiOpen(true);
		useApp.getState().setUI({ llmSettings: false });
	}, [open, llmSettings]);
	(0, import_react.useEffect)(() => {
		if (!open) setApiOpen(false);
	}, [open]);
	if (!open) return null;
	const close = () => {
		setApiOpen(false);
		setUI({ connection: false });
	};
	const save = async () => {
		setBusy(true);
		setErr("");
		try {
			const data = await (await fetch("/api/nai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "test",
					baseUrl: base,
					apiKey: key
				})
			})).json();
			if (!data.ok) {
				setErr(data.error || "连接失败");
				useApp.getState().setSettings({
					naiKey: key,
					naiBase: base,
					naiConnected: false
				});
				return;
			}
			useApp.getState().setSettings({
				naiKey: key,
				naiBase: base,
				naiConnected: true
			});
			useApp.getState().toast("已连接");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "连接失败");
		} finally {
			setBusy(false);
		}
	};
	const selectGrok = () => useApp.getState().setSettings({ chatSource: "grok" });
	const selectApi = () => {
		if (!settings.llmConnected) {
			useApp.getState().toast("先连接 API");
			setApiOpen(true);
			return;
		}
		useApp.getState().setSettings({ chatSource: "api" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-50 flex justify-center px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-overlay/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetCard, {
				title: "连接",
				titleExtra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-[13px] text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						on: settings.chatImage !== false,
						onChange: (v) => {
							useApp.getState().setSettings({ chatImage: v });
						},
						label: "生图"
					}), "生图"]
				}),
				onClose: close,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex flex-col items-center gap-2 rounded-[18px] border border-line bg-card py-5",
							onClick: () => setDl(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px]",
								children: "下载存档"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border border-line bg-card py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px]",
									children: "读取存档"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".json,.zip",
									className: "hidden",
									onChange: async (e) => {
										const f = e.target.files?.[0];
										e.target.value = "";
										if (!f) return;
										try {
											await importArchive(f);
											await useApp.getState().hydrate();
											useApp.getState().toast("已读取存档");
											close();
										} catch (err) {
											useApp.getState().toast(err instanceof Error ? err.message : "读取失败");
										}
									}
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: selectGrok,
						className: cn("mb-3 w-full rounded-[18px] border p-4 text-left", settings.chatSource === "grok" ? "border-primary bg-primary-soft" : "border-line bg-card"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 font-medium",
							children: "Grok"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] leading-relaxed text-muted",
							children: "已使用当前 Grok 会员账号，无需再登录。选中后聊天、润色、写提示词都走 Grok。顶栏切换 4.6 / 4.5 均衡、专家、快速。"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						tabIndex: 0,
						onClick: selectApi,
						onKeyDown: (e) => {
							if (e.key === "Enter" || e.key === " ") selectApi();
						},
						className: cn("mb-4 flex w-full items-center gap-3 rounded-[18px] border p-4 text-left", settings.chatSource === "api" ? "border-primary bg-primary-soft" : "border-line bg-card"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "API 连接"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-[12px] text-muted",
								children: settings.llmConnected ? settings.llmModel ? shortModelLabel(settings.llmModel) : "已连接，去设置里选模型" : "未连接。点齿轮填写网址和密钥"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-1",
							onClick: (e) => e.stopPropagation(),
							children: [settings.llmConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5 text-danger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-9 place-items-center rounded-full hover:bg-dim",
								onClick: () => setApiOpen(true),
								"aria-label": "API 设置",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[14px] font-medium",
							children: "NAI 中转站 API Key"
						}), settings.naiConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-[12px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-good",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " 已连接"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-muted",
								onClick: () => {
									useApp.getState().setSettings({
										naiConnected: false,
										naiKey: ""
									});
									setKey("");
								},
								children: "退出"
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						value: key,
						placeholder: "",
						onChange: (e) => setKey(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 mt-1 text-[11px] text-muted",
						children: "进阶档位以上可生成 Key。Key 只保存在你这台设备上。点保存后即可聊天配图和纯生图。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[14px] font-medium",
						children: "中转站地址"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: base,
						onChange: (e) => setBase(e.target.value)
					}),
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[12px] text-danger",
						children: err
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
						className: "mt-4",
						busy,
						onClick: () => void save(),
						children: "保存"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: dl,
				onClose: () => setDl(false),
				title: "下载存档",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-[13px] text-muted",
					children: "全部含配图；无配图可再次点重生。"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
						onClick: () => {
							exportArchive("full");
							setDl(false);
						},
						children: "全部"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						onClick: () => {
							exportArchive("lite");
							setDl(false);
						},
						children: "无配图"
					})]
				})]
			}),
			apiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-20 flex justify-center px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-overlay/40",
					onClick: () => setApiOpen(false),
					"aria-label": "关闭"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiSettingsSheet, { onClose: () => setApiOpen(false) })]
			})
		]
	});
}
function SheetCard({ title, titleExtra, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 flex min-h-0 w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-bg shadow-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2 px-5 pb-3 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[20px] font-semibold",
					children: title
				}),
				titleExtra,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ml-auto",
					onClick: onClose,
					"aria-label": "关闭",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 scroll-hide",
			children
		})]
	});
}
function ApiSettingsSheet({ onClose }) {
	const settings = useApp((s) => s.settings);
	const [url, setUrl] = (0, import_react.useState)(settings.llmBase);
	const [key, setKey] = (0, import_react.useState)(settings.llmKey);
	const [manual, setManual] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [saveOpen, setSaveOpen] = (0, import_react.useState)(false);
	const [saveName, setSaveName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setUrl(settings.llmBase);
		setKey(settings.llmKey);
		setErr("");
	}, [settings.llmBase, settings.llmKey]);
	const connect = async (override) => {
		const u = (override?.url ?? url).trim();
		const k = override?.key ?? key;
		setBusy(true);
		setErr("");
		try {
			const list = await fetchLlmModels(u, k);
			const live = useApp.getState().settings;
			const nextModel = override?.model || live.llmModel || list[0] || "";
			const keepStars = override?.starred ?? live.llmStarred;
			const starred = list.length ? pruneStarred(keepStars, list, nextModel) : [...new Set(keepStars)];
			const nextIdentity = llmIdentity(u, k);
			const prevIdentity = live.llmIdentity || (live.llmConnected ? llmIdentity(live.llmBase, live.llmKey) : "");
			useApp.getState().setSettings({
				llmBase: u,
				llmKey: k,
				llmConnected: true,
				llmModels: list,
				llmModel: nextModel,
				llmStarred: starred,
				chatSource: "api",
				llmAccounts: snapshotLlmAccount(live.llmAccounts ?? [], u, k, starred, nextModel),
				llmIdentity: nextIdentity
			});
			if (prevIdentity && prevIdentity !== nextIdentity) useApp.getState().clearImageAi();
			useApp.getState().toast(override?.toast ?? (list.length ? `已连接 · ${list.length} 个模型` : "已连接，请手填模型名"));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "连接失败");
			useApp.getState().setSettings({
				llmBase: u,
				llmKey: k,
				llmConnected: false
			});
		} finally {
			setBusy(false);
		}
	};
	const disconnect = () => {
		useApp.getState().setSettings({
			llmConnected: false,
			llmKey: "",
			chatSource: "grok"
		});
		setKey("");
		useApp.getState().toast("已断开 API");
	};
	const saveAccount = () => {
		const name = uniqueNumberedName(saveName, (settings.llmAccounts ?? []).map((a) => a.name));
		if (!saveName.trim()) {
			useApp.getState().toast("请输入名称");
			return;
		}
		useApp.getState().setSettings({ llmAccounts: [...settings.llmAccounts ?? [], {
			id: uid("acc_"),
			name,
			base: url.trim(),
			key,
			starred: [...settings.llmStarred],
			model: settings.llmModel
		}] });
		useApp.getState().toast(`已保存（${name}）`);
		setSaveOpen(false);
		setSaveName("");
	};
	const p = settings.llmParams;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetCard, {
		title: "API 设置",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between text-[14px] font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "网址" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[12px] font-normal text-muted",
					onClick: () => {
						if (!url.trim() || !key.trim()) {
							useApp.getState().toast("请填写网址和密钥");
							return;
						}
						setSaveName("");
						setSaveOpen(true);
					},
					children: "保存"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: url,
				placeholder: "https://api.siliconflow.cn/v1",
				onChange: (e) => setUrl(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 mt-1 text-[11px] text-muted",
				children: "OpenAI 兼容。末尾 /v1 即可，不必写到 chat/completions。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountPicker, {
				accounts: settings.llmAccounts ?? [],
				keyValue: key,
				onKeyChange: setKey,
				busy,
				exit: settings.llmConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[12px] text-muted",
					onClick: disconnect,
					children: "退出"
				}) : null,
				onPick: (a) => {
					const s = useApp.getState().settings;
					if (s.llmBase || s.llmKey) useApp.getState().setSettings({ llmAccounts: snapshotLlmAccount(s.llmAccounts ?? [], s.llmBase, s.llmKey, s.llmStarred, s.llmModel) });
					setUrl(a.base);
					setKey(a.key);
					connect({
						url: a.base,
						key: a.key,
						starred: a.starred,
						model: a.model,
						toast: `已应用密钥（${a.name}）`
					});
				},
				onDelete: (id) => useApp.getState().setSettings({ llmAccounts: (settings.llmAccounts ?? []).filter((a) => a.id !== id) })
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[12px] text-danger",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
				className: cn("mt-3", settings.llmConnected && "bg-good hover:bg-good"),
				busy,
				onClick: () => void connect(),
				children: settings.llmConnected ? "已连接 · 重新拉取" : "连接"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 mb-1 text-[14px] font-medium",
				children: "可用模型"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] text-muted",
				children: "列表来自接口。点选即当前模型，星标会进聊天顶栏。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {
				models: settings.llmModels,
				current: settings.llmModel,
				starred: settings.llmStarred,
				connected: settings.llmConnected,
				onPick: (id) => {
					useApp.getState().setSettings(applyLlmPick(settings, id));
				},
				onStar: (id) => {
					const llmStarred = pruneStarred(settings.llmStarred.includes(id) ? settings.llmStarred.filter((x) => x !== id) : [...settings.llmStarred, id], settings.llmModels, settings.llmModel);
					useApp.getState().setSettings({
						llmStarred,
						llmAccounts: snapshotLlmAccount(settings.llmAccounts ?? [], settings.llmBase, settings.llmKey, llmStarred, settings.llmModel)
					});
				}
			}),
			settings.llmConnected && settings.llmModels.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-[13px]",
					children: "手填模型名"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: manual,
						placeholder: "deepseek-ai/DeepSeek-V3.2",
						onChange: (e) => setManual(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "shrink-0 rounded-full bg-primary px-4 text-[13px] text-on-primary",
						onClick: () => {
							const id = manual.trim();
							if (!id) return;
							useApp.getState().setSettings({
								llmModel: id,
								llmModels: [id],
								llmStarred: settings.llmStarred.includes(id) ? settings.llmStarred : [...settings.llmStarred, id]
							});
						},
						children: "使用"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[12px] text-muted",
				children: [
					"当前：",
					settings.llmModel ? shortModelLabel(settings.llmModel) : "未选",
					" · 常用",
					" ",
					pruneStarred(settings.llmStarred, settings.llmModels, settings.llmModel).length
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPresetPicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[14px] font-medium",
					children: "预设"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[12px] text-muted",
					onClick: () => useApp.getState().setSettings({ llmParams: { ...DEFAULT_LLM_PARAMS } }),
					children: "恢复默认"
				})]
			}),
			activePreset(settings) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 text-[11px] text-muted",
				children: ["采样来自：", activePreset(settings)?.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "温度",
				value: p.temperature,
				min: 0,
				max: 2,
				step: .05,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					temperature: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "Top P",
				value: p.topP,
				min: 0,
				max: 1,
				step: .05,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					topP: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "频率惩罚",
				value: p.frequencyPenalty,
				min: 0,
				max: 2,
				step: .05,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					frequencyPenalty: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "存在惩罚",
				value: p.presencePenalty,
				min: 0,
				max: 2,
				step: .05,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					presencePenalty: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "最大回复",
				value: p.maxTokens,
				min: 256,
				max: 32e3,
				step: 256,
				digits: 0,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					maxTokens: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
				label: "上下文（轮）",
				value: p.contextTurns,
				min: 4,
				max: 40,
				step: 1,
				digits: 0,
				onChange: (n) => useApp.getState().setSettings({ llmParams: {
					...p,
					contextTurns: n
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: saveOpen,
				onClose: () => setSaveOpen(false),
				title: "保存账号",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: saveName,
					placeholder: "给这组起个名字",
					onChange: (e) => setSaveName(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") saveAccount();
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
					className: "mt-4",
					onClick: saveAccount,
					children: "保存"
				})]
			})
		]
	});
}
function applyStPreset(preset) {
	const s = useApp.getState().settings;
	const snapshot = s.stParamSnapshot ?? { ...s.llmParams };
	useApp.getState().setSettings({
		stActiveId: preset.id,
		stParamSnapshot: snapshot,
		llmParams: samplerPatch(preset.params, s.llmParams)
	});
	useApp.getState().toast(`已应用预设（${preset.name}）`);
}
function cancelStPreset() {
	const s = useApp.getState().settings;
	useApp.getState().setSettings({
		stActiveId: null,
		stParamSnapshot: null,
		llmParams: restoreSampler(s.stParamSnapshot, s.llmParams)
	});
	useApp.getState().toast("已取消预设");
}
function ChatPresetPicker() {
	const settings = useApp((s) => s.settings);
	const presets = settings.stPresets ?? [];
	const active = activePreset(settings);
	const fileRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)(null);
	const box = (0, import_react.useRef)(null);
	const menu = (0, import_react.useRef)(null);
	const place = () => {
		const el = box.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const width = Math.min(r.width, window.innerWidth - 16);
		const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
		const top = r.bottom + 4;
		const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
		setPos({
			top,
			left,
			width,
			maxH
		});
	};
	const openMenu = () => {
		place();
		setOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (!open) return;
		place();
		let start = null;
		let downOutside = false;
		let moved = false;
		const inChrome = (t) => {
			const n = t;
			return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
		};
		const onDown = (e) => {
			start = {
				x: e.clientX,
				y: e.clientY
			};
			downOutside = !inChrome(e.target);
			moved = false;
		};
		const onMove = (e) => {
			if (!start) return;
			if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
		};
		const onUp = (e) => {
			if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
			start = null;
		};
		window.addEventListener("pointerdown", onDown, true);
		window.addEventListener("pointermove", onMove, true);
		window.addEventListener("pointerup", onUp, true);
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		return () => {
			window.removeEventListener("pointerdown", onDown, true);
			window.removeEventListener("pointermove", onMove, true);
			window.removeEventListener("pointerup", onUp, true);
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
		};
	}, [open]);
	const importFile = async (file) => {
		let raw;
		try {
			raw = JSON.parse(await file.text());
		} catch {
			useApp.getState().toast("无法读取这个文件");
			return;
		}
		try {
			const parsed = parseChatCompletionPreset(raw, file.name);
			const s = useApp.getState().settings;
			const name = uniquePresetName(parsed.name, (s.stPresets ?? []).map((p) => p.name));
			useApp.getState().setSettings({ stPresets: [...s.stPresets ?? [], {
				...parsed,
				name
			}] });
			useApp.getState().toast(`已导入 ${name}，点列表应用`);
		} catch (e) {
			useApp.getState().toast(e instanceof Error ? e.message : "这不是对话补全预设");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 text-[14px] font-medium",
					children: "对话补全预设"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: ".json,application/json",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) importFile(f);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-8 shrink-0 place-items-center text-muted",
					"aria-label": "导入预设",
					onClick: () => fileRef.current?.click(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" })
				}),
				active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-2 text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-good",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), "已应用"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-muted",
						onClick: cancelStPreset,
						children: "取消"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex shrink-0 items-center gap-1 text-[12px] text-danger",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), "未应用"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: box,
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-11 items-center rounded-full border border-line bg-card pl-4 pr-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-w-0 flex-1 truncate text-left text-[13px]",
					onClick: () => open ? setOpen(false) : openMenu(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: active ? "text-ink" : "text-muted",
						children: active ? active.name : "未应用"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-9 shrink-0 place-items-center text-muted",
					"aria-label": open ? "收起预设列表" : "展开预设列表",
					onClick: () => open ? setOpen(false) : openMenu(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 transition", open && "rotate-180") })
				})]
			}), open && pos && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: menu,
				className: "fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
				style: {
					top: pos.top,
					left: pos.left,
					width: pos.width
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-auto overscroll-contain scroll-hide",
					style: { maxHeight: pos.maxH },
					children: presets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-6 text-center text-[13px] text-muted",
						children: "还没有导入的预设"
					}) : presets.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 border-b border-line/70 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]", p.id === active?.id && "text-primary"),
							onClick: () => {
								applyStPreset(p);
								setOpen(false);
							},
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 shrink-0 place-items-center text-danger",
							"aria-label": `删除${p.name}`,
							onClick: () => {
								const s = useApp.getState().settings;
								const was = s.stActiveId === p.id;
								const next = (s.stPresets ?? []).filter((x) => x.id !== p.id);
								if (was) {
									useApp.getState().setSettings({
										stPresets: next,
										stActiveId: null,
										stParamSnapshot: null,
										llmParams: restoreSampler(s.stParamSnapshot, s.llmParams)
									});
									useApp.getState().toast("已取消预设");
								} else useApp.getState().setSettings({ stPresets: next });
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, p.id))
				})
			}), document.body)]
		})]
	});
}
function AccountPicker({ accounts, keyValue, onKeyChange, busy, exit, onPick, onDelete }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)(null);
	const box = (0, import_react.useRef)(null);
	const menu = (0, import_react.useRef)(null);
	const place = () => {
		const el = box.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const width = Math.min(r.width, window.innerWidth - 16);
		const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
		const top = r.bottom + 4;
		const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
		setPos({
			top,
			left,
			width,
			maxH
		});
	};
	const openMenu = () => {
		place();
		setOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (!open) return;
		place();
		let start = null;
		let downOutside = false;
		let moved = false;
		const inChrome = (t) => {
			const n = t;
			return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
		};
		const onDown = (e) => {
			start = {
				x: e.clientX,
				y: e.clientY
			};
			downOutside = !inChrome(e.target);
			moved = false;
		};
		const onMove = (e) => {
			if (!start) return;
			if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
		};
		const onUp = (e) => {
			if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
			start = null;
		};
		window.addEventListener("pointerdown", onDown, true);
		window.addEventListener("pointermove", onMove, true);
		window.addEventListener("pointerup", onUp, true);
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		return () => {
			window.removeEventListener("pointerdown", onDown, true);
			window.removeEventListener("pointermove", onMove, true);
			window.removeEventListener("pointerup", onUp, true);
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2 text-[14px] font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "API 密钥" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-3 text-[12px] font-normal",
					children: [exit, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-muted",
						onClick: () => open ? setOpen(false) : openMenu(),
						children: "账号列表"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				type: "password",
				value: keyValue,
				placeholder: "",
				onChange: (e) => onKeyChange(e.target.value)
			}),
			open && pos && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: menu,
				className: "fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
				style: {
					top: pos.top,
					left: pos.left,
					width: pos.width
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-auto overscroll-contain scroll-hide",
					style: { maxHeight: pos.maxH },
					children: accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-6 text-center text-[13px] text-muted",
						children: "还没有保存的账号"
					}) : accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 border-b border-line/70 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]",
							disabled: busy,
							onClick: () => {
								onPick(a);
								setOpen(false);
							},
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 shrink-0 place-items-center text-danger",
							"aria-label": `删除${a.name}`,
							onClick: () => onDelete(a.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, a.id))
				})
			}), document.body)
		]
	});
}
function ModelPicker({ models, current, starred, connected, onPick, onStar }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [pos, setPos] = (0, import_react.useState)(null);
	const box = (0, import_react.useRef)(null);
	const menu = (0, import_react.useRef)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		const list = t ? models.filter((id) => id.toLowerCase().includes(t)) : models;
		const star = new Set(starred);
		return [...list].sort((a, b) => {
			const as = star.has(a) ? 0 : 1;
			const bs = star.has(b) ? 0 : 1;
			if (as !== bs) return as - bs;
			return a.localeCompare(b);
		});
	}, [
		models,
		q,
		starred
	]);
	const place = () => {
		const el = box.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const width = Math.min(r.width, window.innerWidth - 16);
		const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
		const top = r.bottom + 4;
		const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
		setPos({
			top,
			left,
			width,
			maxH
		});
	};
	const openMenu = () => {
		place();
		setOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (!open) return;
		place();
		let start = null;
		let downOutside = false;
		let moved = false;
		const inChrome = (t) => {
			const n = t;
			return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
		};
		const onDown = (e) => {
			start = {
				x: e.clientX,
				y: e.clientY
			};
			downOutside = !inChrome(e.target);
			moved = false;
		};
		const onMove = (e) => {
			if (!start) return;
			if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
		};
		const onUp = (e) => {
			if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
			start = null;
		};
		window.addEventListener("pointerdown", onDown, true);
		window.addEventListener("pointermove", onMove, true);
		window.addEventListener("pointerup", onUp, true);
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		return () => {
			window.removeEventListener("pointerdown", onDown, true);
			window.removeEventListener("pointermove", onMove, true);
			window.removeEventListener("pointerup", onUp, true);
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 items-center rounded-full border border-line bg-card focus-within:border-primary/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				placeholder: "搜索",
				className: "min-w-0 flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:text-faint",
				onChange: (e) => {
					setQ(e.target.value);
					if (!open) openMenu();
				},
				onFocus: () => {
					if (!open) openMenu();
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "grid size-11 shrink-0 place-items-center",
				"aria-label": open ? "收起模型列表" : "展开模型列表",
				onClick: () => open ? setOpen(false) : openMenu(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted transition", open && "rotate-180") })
			})]
		}), open && pos && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: menu,
			className: "fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
			style: {
				top: pos.top,
				left: pos.left,
				width: pos.width
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto overscroll-contain scroll-hide",
				style: { maxHeight: pos.maxH },
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-center text-[13px] text-muted",
					children: connected ? "没有匹配的模型" : "连接后才会出现列表"
				}) : filtered.map((id) => {
					const on = current === id;
					const star = starred.includes(id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-center gap-1 border-b border-line/70 last:border-0", on && "bg-dim/70"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]",
							onClick: () => {
								onPick(id);
								setOpen(false);
							},
							children: id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 shrink-0 place-items-center",
							onClick: () => onStar(id),
							"aria-label": star ? "取消常用" : "标为常用",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", star ? "fill-primary text-primary" : "text-faint") })
						})]
					}, id);
				})
			})
		}), document.body)]
	});
}
function ParamRow({ label, value, min, max, step, digits = 2, onChange }) {
	const shown = digits === 0 ? String(Math.round(value)) : value.toFixed(digits);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-0.5 flex items-center justify-between text-[13px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted",
				children: shown
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			value,
			min,
			max,
			step,
			onChange
		})]
	});
}
function esc(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function stripEndTag(s, tag) {
	const core = tag.replace(/,\s*$/, "").trim();
	const re = new RegExp(`(?:^|,)?\\s*${esc(core)}\\s*,?\\s*$`, "i");
	let cur = s.trimEnd();
	for (let i = 0; i < 4; i++) {
		const next = cur.replace(re, "").replace(/[,\s]+$/g, "").trimEnd();
		if (next === cur) break;
		cur = next;
	}
	return cur;
}
function appendTag(s, tag) {
	const t = s.trimEnd();
	if (!t) return tag;
	if (t.endsWith(",")) return `${t} ${tag}`;
	return `${t}, ${tag}`;
}
var SENSITIVE_RE = /^\s*rating:\s*sensitive,\s*nsfw,\s*uncensored,\s*/i;
function stripSensitivePrefix(s) {
	return s.replace(SENSITIVE_RE, "").replace(/^\s+/, "");
}
function applyFrontFlags(front, uncensored, fullBody) {
	let s = stripEndTag(stripEndTag(front, FULLBODY_TAG), UNCENSORED_TAG);
	if (uncensored) s = appendTag(s, UNCENSORED_TAG);
	if (fullBody) s = appendTag(s, FULLBODY_TAG);
	return s;
}
function applyBackFlags(back, sensitive) {
	const rest = stripSensitivePrefix(back);
	if (!sensitive) return rest;
	return rest ? `${SENSITIVE_PREFIX} ${rest}` : SENSITIVE_PREFIX;
}
function applyMergedFlags(text, flags) {
	let s = stripSensitivePrefix(text);
	s = applyFrontFlags(s, flags.uncensored, flags.fullBody);
	if (flags.sensitive) s = s ? `${SENSITIVE_PREFIX} ${s}` : SENSITIVE_PREFIX;
	return s;
}
var HOLD_MS$2 = 400;
function buzz() {
	try {
		navigator.vibrate?.(12);
	} catch {}
}
function GripBars$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col items-center justify-center gap-[3.5px] text-current",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" })
		]
	});
}
function LibraryDrawer({ items, onApply, onDelete, onReorder, label = "角色选择", className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [sortMode, setSortMode] = (0, import_react.useState)(false);
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const [holdId, setHoldId] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [liveIds, setLiveIds] = (0, import_react.useState)(null);
	const [pos, setPos] = (0, import_react.useState)(null);
	const box = (0, import_react.useRef)(null);
	const trigger = (0, import_react.useRef)(null);
	const menu = (0, import_react.useRef)(null);
	const list = (0, import_react.useRef)(null);
	const pressTimer = (0, import_react.useRef)(0);
	const press = (0, import_react.useRef)(null);
	const idsRef = (0, import_react.useRef)([]);
	const dragIdRef = (0, import_react.useRef)(null);
	const sortRef = (0, import_react.useRef)(false);
	const savedRef = (0, import_react.useRef)(false);
	const lastY = (0, import_react.useRef)(0);
	const rafRef = (0, import_react.useRef)(0);
	const onReorderRef = (0, import_react.useRef)(onReorder);
	onReorderRef.current = onReorder;
	const display = (liveIds ?? items.map((c) => c.id)).map((id) => items.find((c) => c.id === id)).filter((c) => Boolean(c));
	const persist = () => {
		if (sortRef.current && idsRef.current.length && !savedRef.current) {
			savedRef.current = true;
			onReorderRef.current(idsRef.current);
		}
	};
	const close = () => {
		persist();
		setOpen(false);
		setSortMode(false);
		setPendingDelete(null);
		setDragId(null);
		setHoldId(null);
		setLiveIds(null);
		dragIdRef.current = null;
		sortRef.current = false;
	};
	const place = () => {
		const el = trigger.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const width = Math.min(r.width, window.innerWidth - 16);
		const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
		const top = r.bottom + 4;
		const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
		setPos({
			top,
			left,
			width,
			maxH
		});
	};
	const openMenu = () => {
		savedRef.current = false;
		sortRef.current = false;
		idsRef.current = items.map((c) => c.id);
		setLiveIds(null);
		setSortMode(false);
		setPendingDelete(null);
		setDragId(null);
		place();
		setOpen(true);
	};
	(0, import_react.useEffect)(() => {
		sortRef.current = sortMode;
		if (sortMode) setPendingDelete(null);
	}, [sortMode]);
	(0, import_react.useEffect)(() => {
		if (!sortMode && !dragId) idsRef.current = items.map((c) => c.id);
	}, [
		items,
		sortMode,
		dragId
	]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		place();
		const onOutside = (e) => {
			if (dragIdRef.current) return;
			const t = e.target;
			if (box.current?.contains(t) || menu.current?.contains(t)) return;
			close();
		};
		window.addEventListener("resize", place);
		window.addEventListener("scroll", place, true);
		document.addEventListener("pointerdown", onOutside);
		return () => {
			window.removeEventListener("resize", place);
			window.removeEventListener("scroll", place, true);
			document.removeEventListener("pointerdown", onOutside);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const applyY = (y) => {
			const id = dragIdRef.current;
			if (!id) return;
			const rows = list.current?.querySelectorAll("[data-card-id]");
			if (!rows?.length) return;
			const next = moveId(idsRef.current, id, indexFromY(rows, y));
			if (next.join("\0") === idsRef.current.join("\0")) return;
			idsRef.current = next;
			setLiveIds(next);
		};
		const lockScroller = (on) => {
			const el = nearestScroller(list.current);
			if (el) el.style.touchAction = on ? "none" : "";
		};
		const tick = () => {
			rafRef.current = 0;
			if (!dragIdRef.current) return;
			const scroller = nearestScroller(list.current);
			const dy = scroller ? autoScrollNearEdge(scroller, lastY.current) : 0;
			applyY(lastY.current);
			if (dy) rafRef.current = requestAnimationFrame(tick);
		};
		const onMove = (e) => {
			if (!dragIdRef.current) return;
			e.preventDefault();
			lastY.current = e.clientY;
			const scroller = nearestScroller(list.current);
			const dy = scroller ? autoScrollNearEdge(scroller, e.clientY) : 0;
			applyY(e.clientY);
			if (dy && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
		};
		const onUp = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = 0;
			lockScroller(false);
			if (!dragIdRef.current) return;
			dragIdRef.current = null;
			setDragId(null);
			savedRef.current = true;
			onReorderRef.current(idsRef.current);
		};
		const onTouchMove = (e) => {
			if (!dragIdRef.current) return;
			e.preventDefault();
		};
		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("touchmove", onTouchMove);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		return () => {
			window.clearTimeout(pressTimer.current);
			persist();
		};
	}, []);
	const lockScroller = (on) => {
		const el = nearestScroller(list.current);
		if (el) el.style.touchAction = on ? "none" : "";
	};
	const enterSort = () => {
		const ids = liveIds ?? items.map((c) => c.id);
		idsRef.current = ids;
		savedRef.current = false;
		sortRef.current = true;
		setLiveIds(ids);
		setSortMode(true);
		setHoldId(null);
		setPendingDelete(null);
		buzz();
	};
	const clearPress = () => {
		window.clearTimeout(pressTimer.current);
		press.current = null;
		setHoldId(null);
	};
	const onRowPointerDown = (e, id) => {
		if (sortRef.current) return;
		if (items.length < 2) return;
		if (e.target.closest("[data-row-action]")) return;
		if (e.pointerType === "mouse" && e.button !== 0) return;
		clearPress();
		press.current = {
			id,
			y: e.clientY
		};
		setHoldId(id);
		const endPress = () => {
			window.removeEventListener("pointerup", endPress);
			window.removeEventListener("pointercancel", endPress);
			if (!sortRef.current) clearPress();
		};
		window.addEventListener("pointerup", endPress);
		window.addEventListener("pointercancel", endPress);
		pressTimer.current = window.setTimeout(() => {
			press.current = null;
			enterSort();
		}, HOLD_MS$2);
	};
	const onRowPointerMove = (e) => {
		if (sortRef.current) return;
		const p = press.current;
		if (!p) return;
		if (Math.abs(e.clientY - p.y) + Math.abs(e.movementX) > 12) clearPress();
	};
	const onGripDown = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const ids = liveIds ?? items.map((c) => c.id);
		idsRef.current = ids;
		setLiveIds(ids);
		dragIdRef.current = id;
		setDragId(id);
		lastY.current = e.clientY;
		lockScroller(true);
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-w-0", className),
		ref: box,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-0.5 text-left text-[11px] leading-none text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				ref: trigger,
				type: "button",
				className: "flex h-9 w-full items-center justify-between rounded-full border border-line bg-card px-3 text-[13px]",
				onClick: () => open ? close() : openMenu(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "(无)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 text-muted transition", open && "rotate-180") })]
			}),
			open && pos && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: menu,
				className: "fixed z-[80] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
				style: {
					top: pos.top,
					left: pos.left,
					width: pos.width,
					WebkitUserSelect: "none",
					WebkitTouchCallout: "none",
					userSelect: "none"
				},
				onContextMenu: (e) => e.preventDefault(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: list,
					className: "overflow-auto scroll-thin overscroll-contain",
					style: { maxHeight: pos.maxH },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "block w-full px-2.5 py-1.5 text-left text-[13px] text-muted",
							onClick: close,
							children: "(无)"
						}),
						display.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-card-id": c.id,
							className: cn("flex items-center gap-1 px-2 py-1 select-none hold-none", dragId === c.id && "rounded-lg bg-ink/15 drag-dim", !sortMode && holdId === c.id && "rounded-lg bg-ink/8"),
							style: { touchAction: sortMode ? "pan-y" : "manipulation" },
							onPointerDown: (e) => onRowPointerDown(e, c.id),
							onPointerMove: onRowPointerMove,
							onPointerUp: clearPress,
							onPointerCancel: clearPress,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-[13px] leading-5",
								children: c.name
							}), sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-8 shrink-0 items-center justify-center rounded-md text-ink/55",
								"aria-label": `拖动${c.name}`,
								onPointerDown: (e) => onGripDown(e, c.id),
								style: { touchAction: "none" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripBars$1, {})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-row-action": true,
								className: "h-6 shrink-0 rounded-full bg-primary px-2 text-[11px] leading-none text-on-primary",
								onClick: (e) => {
									e.stopPropagation();
									onApply(c.id);
									close();
								},
								children: "应用"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-row-action": true,
								className: "grid size-6 shrink-0 place-items-center text-danger",
								"aria-label": `删除${c.name}`,
								onClick: (e) => {
									e.stopPropagation();
									setPendingDelete(c.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})] })]
						}, c.id)),
						items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2.5 py-2 text-[12px] text-muted",
							children: "还没有保存的项目"
						}),
						items.length > 1 && !sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 pb-1 pt-0.5 text-[9px] leading-4 text-muted",
							children: "长按进入排序"
						}) : null
					]
				}), pendingDelete && !sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-line bg-card px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[13px]",
						children: [
							"删除「",
							items.find((c) => c.id === pendingDelete)?.name ?? "",
							"」？"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-row-action": true,
							className: "h-8 flex-1 rounded-full bg-dim text-[13px]",
							onClick: () => setPendingDelete(null),
							children: "取消"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-row-action": true,
							className: "h-8 flex-1 rounded-full bg-danger text-[13px] text-white",
							onClick: () => {
								onDelete(pendingDelete);
								setPendingDelete(null);
							},
							children: "删除"
						})]
					})]
				}) : null]
			}), document.body)
		]
	});
}
function scrollJump(jump) {
	const el = document.querySelector(`[data-section="${jump}"]`);
	if (!el) return false;
	let pane = el.parentElement;
	let fallback = null;
	while (pane) {
		const s = getComputedStyle(pane);
		if (/(auto|scroll)/.test(s.overflowY)) {
			if (!fallback) fallback = pane;
			if (pane.scrollHeight > pane.clientHeight + 4) break;
		}
		pane = pane.parentElement;
	}
	if (!pane || !/(auto|scroll)/.test(getComputedStyle(pane).overflowY)) pane = fallback;
	if (!pane) return false;
	const top = el.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop;
	pane.scrollTo({
		top: Math.max(0, top - 6),
		behavior: "smooth"
	});
	if (jump === "seed") {
		const input = el.querySelector("[data-seed-input], input");
		if (input && !input.disabled) {
			input.focus();
			input.select();
		}
	}
	return true;
}
function ParamsPane({ chat, mode = "chat" }) {
	const live = chat.imageParams;
	const [peek, setPeek] = (0, import_react.useState)(null);
	const p = peek ? {
		...peek,
		characters: live.characters,
		useCoords: live.useCoords
	} : live;
	const commit = (partial) => {
		if (mode === "pure") useApp.getState().setPureParams(partial);
		else useApp.getState().patchParams(chat.id, partial);
	};
	const patch = (partial) => {
		if (peek) {
			const { characters, useCoords, ...rest } = partial;
			if (characters !== void 0 || useCoords !== void 0) commit({
				...characters !== void 0 ? { characters } : {},
				...useCoords !== void 0 ? { useCoords } : {}
			});
			if (Object.keys(rest).length) setPeek((prev) => prev ? {
				...prev,
				...rest
			} : prev);
			return;
		}
		commit(partial);
	};
	const v3 = naiFamily(p.model) === "v3";
	const hideSplit = mode === "pure" && p.merged;
	const jump = useApp((s) => s.ui.paramsJump);
	const charLocked = useApp((s) => s.settings.pureCharLocked === true);
	const previewOpen = useApp((s) => s.ui.previewParams);
	const previewRef = (0, import_react.useRef)(null);
	const chatId = chat.id;
	const pickAppearance = (target, a) => {
		if (peek && target === "mid") {
			patch({ promptMid: a.prompt });
			return;
		}
		useApp.getState().applyAppearance(chat.id, a, target);
	};
	const setFlags = (next) => {
		const sensitive = next.sensitive ?? p.sensitive;
		const uncensored = next.uncensored ?? p.uncensored;
		const fullBody = next.fullBody ?? p.fullBody;
		if (p.merged) {
			patch({
				sensitive,
				uncensored,
				fullBody,
				promptMid: applyMergedFlags(p.promptMid, {
					sensitive,
					uncensored,
					fullBody
				})
			});
			return;
		}
		patch({
			sensitive,
			uncensored,
			fullBody,
			promptFront: applyFrontFlags(p.promptFront, uncensored, fullBody),
			promptBack: applyBackFlags(p.promptBack, sensitive)
		});
	};
	(0, import_react.useEffect)(() => {
		if (!jump) return;
		let n = 0;
		let timer = 0;
		const run = () => {
			if (scrollJump(jump)) {
				useApp.getState().setUI({ paramsJump: null });
				return;
			}
			if (++n < 24) timer = window.setTimeout(run, 40);
			else useApp.getState().setUI({ paramsJump: null });
		};
		timer = window.setTimeout(run, 40);
		return () => window.clearTimeout(timer);
	}, [jump]);
	(0, import_react.useEffect)(() => {
		if (!previewOpen) {
			setPeek(null);
			return;
		}
		const fn = (e) => {
			if (!previewRef.current?.contains(e.target)) {
				useApp.getState().setUI({ previewParams: false });
				setPeek(null);
			}
		};
		document.addEventListener("pointerdown", fn);
		return () => document.removeEventListener("pointerdown", fn);
	}, [previewOpen]);
	const resId = `${p.width}x${p.height}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: mode === "pure" ? "mx-auto max-w-lg px-4 pb-10 pt-1" : "mx-auto h-full max-w-lg overflow-y-auto px-4 pb-24 pt-3 scroll-thin",
		children: [
			mode === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px] tracking-[0.16em] text-muted",
							children: "CHAT IMAGE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-2xl",
							children: "聊天配图参数"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageAiPicker, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 mt-1 text-[12px] text-muted",
					children: chat.isDraft ? "正在给这个新角色配图。改完可以切回「聊天」继续写人设，开始后她会先开口。" : "只作用于当前角色。改这里不会动到纯生图。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4",
					"data-preview-params": true,
					ref: previewRef,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex h-12 w-full items-center justify-between rounded-full border border-line bg-card px-4",
						onClick: () => {
							const next = !useApp.getState().ui.previewParams;
							useApp.getState().setUI({ previewParams: next });
							if (!next) setPeek(null);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-[14px]",
							children: chat.name || "当前角色"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[12px] text-muted",
							children: "预览角色参数"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewParamsDrawer, {
						currentId: chatId,
						onPeek: (id) => {
							if (id === chatId) {
								setPeek(null);
								return;
							}
							const src = useApp.getState().chats.find((c) => c.id === id);
							if (!src) return;
							setPeek(structuredClone(src.imageParams));
						},
						onApply: (id) => {
							const src = useApp.getState().chats.find((c) => c.id === id);
							if (!src) return;
							const { characters: _c, useCoords: _u, ...rest } = structuredClone(src.imageParams);
							useApp.getState().patchParams(chatId, {
								...rest,
								img2imgBlobId: rest.img2imgBlobId || "",
								img2imgStrength: rest.img2imgStrength ?? .7,
								img2imgNoise: rest.img2imgNoise ?? 0
							});
							setPeek(null);
							useApp.getState().setUI({ previewParams: false });
							useApp.getState().toast("已套用参数");
						}
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex gap-1.5",
				children: [
					[
						"成人",
						p.sensitive,
						() => setFlags({ sensitive: !p.sensitive })
					],
					[
						"无码",
						p.uncensored,
						() => setFlags({ uncensored: !p.uncensored })
					],
					[
						"全身",
						p.fullBody,
						() => setFlags({ fullBody: !p.fullBody })
					],
					[
						"补全",
						p.tagSuggest,
						() => patch({ tagSuggest: !p.tagSuggest })
					]
				].map(([label, on, fn]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-7 flex-1 rounded-full text-[12px] ${on ? "bg-primary text-on-primary" : "bg-dim text-ink"}`,
					onClick: fn,
					children: label
				}, label))
			}),
			!hideSplit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 mt-3 text-[13px] font-medium",
					children: "正面提示词.前"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
					value: p.promptFront,
					suggest: p.tagSuggest,
					minH: 120,
					onChange: (v) => patch({ promptFront: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 mt-3 flex items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 pb-1.5 text-[13px] font-medium",
							children: "正面提示词.中"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex shrink-0 flex-col items-center gap-0.5 px-1 pb-1 text-[10px] text-muted",
							onClick: () => useApp.getState().setUI({
								saveAppearOpen: true,
								appearTarget: "mid"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "保存角色"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearSelect, {
							className: "min-w-0 flex-1",
							onPick: (a) => pickAppearance("mid", a)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
					value: p.promptMid,
					suggest: p.tagSuggest,
					minH: 208,
					onChange: (v) => patch({ promptMid: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 mt-3 text-[13px] font-medium",
					children: "正面提示词.后"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
					value: p.promptBack,
					suggest: p.tagSuggest,
					minH: 120,
					onChange: (v) => patch({ promptBack: v })
				}),
				mode === "pure" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-2 mt-3 inline-flex h-7 items-center rounded-full border border-line px-3 text-[11px] text-muted",
					onClick: () => patch({
						merged: true,
						promptMid: joinPromptParts(p.promptFront, p.promptMid, p.promptBack),
						promptFront: "",
						promptBack: ""
					}),
					children: "合并成一个提示词"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": true,
					className: "mb-2 inline-flex h-7 items-center rounded-full border border-primary bg-primary px-3 text-[11px] font-medium text-on-primary",
					onClick: () => patch({
						merged: false,
						promptFront: "",
						promptBack: ""
					}),
					children: "合并成一个提示词"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
					value: p.promptMid,
					suggest: p.tagSuggest,
					minH: 208,
					onChange: (v) => patch({ promptMid: v })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-[15px] font-medium",
				children: "负面提示词"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 mt-1 flex gap-1.5",
				children: [
					"heavy",
					"light",
					"human",
					"custom"
				].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-8 rounded-full px-3 text-[13px] ${p.ucPreset === id ? "bg-primary text-on-primary" : "bg-dim text-ink"}`,
					onClick: () => {
						if (id === "custom") patch({ ucPreset: id });
						else patch({
							ucPreset: id,
							negative: UC[id]
						});
					},
					children: id === "heavy" ? "重" : id === "light" ? "轻" : id === "human" ? "人形" : "自定义"
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
				value: p.negative,
				suggest: p.tagSuggest,
				minH: 88,
				onChange: (v) => patch({
					negative: v,
					ucPreset: "custom"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 mt-4 flex items-center justify-between",
				"data-section": "model",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] font-medium",
					children: "模型"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
					value: p.model,
					options: NAI_MODELS.map((m) => ({
						id: m.id,
						label: m.label,
						short: m.label.replace("NAI ", "")
					})),
					onChange: (id) => patch({ model: id }),
					align: "left",
					menu: "end"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				"data-section": "size",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] font-medium",
					children: "分辨率"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
					value: resId,
					options: RESOLUTIONS.map((r) => ({
						id: `${r.w}x${r.h}`,
						label: `${r.label}  ${r.w}×${r.h}`,
						short: `${r.w} × ${r.h}`
					})),
					onChange: (id) => {
						const [w, h] = id.split("x").map(Number);
						patch({
							width: w,
							height: h
						});
					},
					align: "left",
					menu: "end"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img2ImgBox, {
				blobId: p.img2imgBlobId,
				strength: p.img2imgStrength ?? .7,
				noise: p.img2imgNoise ?? 0,
				onFile: async (file) => {
					const seed = await naiSeedOf(file);
					const next = { img2imgBlobId: await saveBlob(await compressRef(file, 1216, .9)) };
					if (p.img2imgStrength == null) next.img2imgStrength = .7;
					if (p.img2imgNoise == null) next.img2imgNoise = 0;
					if (seed != null) next.seed = seed;
					commit(next);
				},
				onClear: () => commit({ img2imgBlobId: "" }),
				onStrength: (n) => commit({ img2imgStrength: n }),
				onNoise: (n) => commit({ img2imgNoise: n })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				"data-section": "sampler",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 text-[13px] font-medium",
						children: "采样器"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
						value: p.sampler,
						options: SAMPLERS.map((s) => ({
							id: s.id,
							label: s.label
						})),
						onChange: (id) => patch({ sampler: id }),
						menu: "end"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 items-center justify-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 text-[13px] font-medium",
						children: "噪声表"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
						value: p.noiseSchedule,
						options: NOISE_SCHEDULES.map((s) => ({
							id: s.id,
							label: s.label
						})),
						onChange: (id) => patch({ noiseSchedule: id }),
						menu: "end"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-section": "steps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
					label: "步数",
					value: p.steps,
					min: 1,
					max: 50,
					locked: p.stepsLocked,
					onLock: (v) => patch({ stepsLocked: v }),
					onChange: (n) => patch({ steps: n })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
				label: "提示词引导",
				value: p.scale,
				min: 0,
				max: 10,
				step: .1,
				locked: p.scaleLocked,
				onLock: (v) => patch({ scaleLocked: v }),
				onChange: (n) => patch({ scale: n })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
				label: "CFG rescale",
				value: p.cfgRescale,
				min: 0,
				max: 1,
				step: .01,
				locked: p.cfgRescaleLocked,
				onLock: (v) => patch({ cfgRescaleLocked: v }),
				onChange: (n) => patch({ cfgRescale: n })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				"data-section": "seed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 text-[13px] font-medium",
						children: "种子"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						inputMode: "numeric",
						"data-seed-input": true,
						value: p.seed ?? "",
						placeholder: "随机",
						disabled: p.seedLocked,
						onChange: (e) => {
							const t = e.target.value.trim();
							patch({ seed: t === "" ? null : Number(t) || 0 });
						},
						className: "h-9 min-w-0 flex-1 rounded-full border border-line bg-card px-3 text-[13px] outline-none disabled:opacity-40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-9 shrink-0 place-items-center rounded-full border border-line",
						onClick: () => patch({ seed: randomSeed() }),
						"aria-label": "随机种子",
						children: "↻"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `grid size-9 shrink-0 place-items-center rounded-full ${p.seedLocked ? "text-primary" : "text-muted"}`,
						onClick: () => patch({ seedLocked: !p.seedLocked }),
						"aria-label": "锁定种子",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSwitch, {
				label: "Variety+",
				hint: "动态跳过 CFG，增加构图变化",
				on: p.varietyPlus,
				onChange: (v) => patch({ varietyPlus: v })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSwitch, {
				label: "Decrisper",
				hint: "减轻过饱和",
				on: p.decrisper,
				onChange: (v) => patch({ decrisper: v })
			}),
			!v3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 mt-4",
				"data-section": "chars",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[15px] font-medium",
							children: "角色提示词 (V4 / V5)"
						}), mode === "pure" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `grid size-9 shrink-0 place-items-center ${charLocked ? "text-primary" : "text-muted"}`,
							onClick: () => useApp.getState().setSettings({ pureCharLocked: !charLocked }),
							"aria-label": "锁定角色",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-[11px] text-muted",
						children: "每个角色独立提示。AI 决定位置时忽略坐标。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex rounded-full bg-dim p-1 text-[13px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `flex-1 rounded-full py-2 ${!p.useCoords ? "bg-card" : ""}`,
							onClick: () => patch({ useCoords: false }),
							children: "AI 决定位置"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `flex-1 rounded-full py-2 ${p.useCoords ? "bg-card" : ""}`,
							onClick: () => patch({ useCoords: true }),
							children: "自定义位置"
						})]
					}),
					p.characters.map((ch, i) => {
						const role = chat.characters.find((c) => c.id === ch.id) ?? chat.characters[i];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharCard, {
							ch,
							index: i,
							name: mode === "pure" ? "" : (role?.name || ch.name || "").trim(),
							suggest: p.tagSuggest,
							useCoords: p.useCoords,
							onChange: (next) => patch({ characters: p.characters.map((x) => x.id === ch.id ? next : x) }),
							onPick: (a) => pickAppearance(ch.id, a),
							onApplyLook: mode === "chat" ? () => {
								const role = chat.characters.find((c) => c.id === ch.id) ?? chat.characters[i];
								if (!role) {
									useApp.getState().toast("没有对应人设");
									return;
								}
								useApp.getState().patchChat(chat.id, (c) => ({
									...c,
									characters: c.characters.map((x) => x.id === role.id ? {
										...x,
										appearance: ch.prompt
									} : x)
								}));
								useApp.getState().toast("已写入外貌备忘");
							} : void 0,
							onRemove: () => useApp.getState().setUI({ confirm: {
								title: "删除角色",
								body: `删除「${ch.name || `角色${i + 1}`}」的提示词栏？`,
								danger: true,
								onOk: () => patch({ characters: p.characters.filter((x) => x.id !== ch.id) })
							} })
						}, ch.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-1 flex items-center gap-1 px-2 py-2 text-[13px] text-primary",
						onClick: () => patch({ characters: [...p.characters, {
							id: uid("c_"),
							name: `角色${p.characters.length + 1}`,
							enabled: true,
							prompt: "",
							uc: "",
							x: .5,
							y: .5
						}] }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " 添加角色"]
					})
				]
			})
		]
	});
}
function CharCard({ ch, index, name, suggest, useCoords, onChange, onPick, onApplyLook, onRemove }) {
	const title = name ? `角色${index + 1}:${name}` : `角色${index + 1}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-3 overflow-visible",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 truncate text-[15px] font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1",
					children: [onRemove && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-8 place-items-center text-danger",
						onClick: onRemove,
						"aria-label": "删除角色",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						on: ch.enabled,
						onChange: (v) => onChange({
							...ch,
							enabled: v
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearSelect, {
					className: "min-w-0 flex-1",
					onPick
				}), onApplyLook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-0 h-9 shrink-0 rounded-full border border-line px-3 text-[13px] text-primary",
					onClick: onApplyLook,
					children: "应用"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[12px] text-muted",
				children: "正面提示词"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
				value: ch.prompt,
				suggest,
				minH: 88,
				onChange: (v) => onChange({
					...ch,
					prompt: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 mt-2 text-[12px] text-muted",
				children: "角色负面 UC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBox, {
				value: ch.uc,
				suggest,
				minH: 72,
				onChange: (v) => onChange({
					...ch,
					uc: v
				})
			}),
			useCoords && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
					label: "X",
					value: ch.x,
					min: 0,
					max: 1,
					step: .01,
					onChange: (n) => onChange({
						...ch,
						x: n
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
					label: "Y",
					value: ch.y,
					min: 0,
					max: 1,
					step: .01,
					onChange: (n) => onChange({
						...ch,
						y: n
					})
				})]
			})
		]
	});
}
function AppearSelect({ className, onPick }) {
	const ordered = useApp((s) => s.appearances).slice().sort((a, b) => a.order - b.order);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryDrawer, {
		className,
		label: "角色选择",
		items: ordered.map((a) => ({
			id: a.id,
			name: a.name
		})),
		onApply: (id) => {
			const a = useApp.getState().appearances.find((x) => x.id === id);
			if (a) onPick(a);
		},
		onDelete: (id) => useApp.getState().deleteAppearance(id),
		onReorder: (ids) => useApp.getState().reorderAppearances(ids)
	});
}
function ImageAiPicker() {
	const source = useApp((s) => s.settings.chatSource);
	const llmModel = useApp((s) => s.settings.llmModel);
	const starred = useApp((s) => s.settings.llmStarred);
	const available = useApp((s) => s.settings.llmModels);
	const connected = useApp((s) => s.settings.llmConnected);
	const imageModelId = useApp((s) => s.settings.imageModelId);
	const rows = imagePickerModels({
		chatSource: source,
		llmStarred: starred,
		llmModels: available,
		llmModel,
		llmConnected: connected,
		imageModelId
	});
	const ids = rows.filter((r) => !r.header).map((r) => r.id);
	const value = imageModelId && ids.includes(imageModelId) ? imageModelId : FOLLOW_IMAGE_AI;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0 pt-1 text-right",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] tracking-[0.16em] text-muted",
				children: "配图 AI"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 inline-flex rounded-full border border-line bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
					value,
					options: rows.map((r) => ({
						id: r.id,
						label: r.header ?? imageAiLabel(r.id),
						short: r.header ?? imageAiLabel(r.id),
						header: Boolean(r.header),
						danger: r.danger
					})),
					onChange: (id) => {
						if (id.startsWith("__hdr_")) return;
						const s = useApp.getState().settings;
						useApp.getState().setSettings(applyImageAiPick(s, id));
					},
					align: "left",
					menu: "end"
				})
			}),
			imageModelId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 max-w-[11rem] text-[11px] leading-4 text-muted",
				children: ["对白用顶栏，提示词用 ", imageAiLabel(imageModelId)]
			}) : null
		]
	});
}
function chatSnippet(c) {
	const lastMsg = [...c.messages].reverse().find((m) => m.content);
	return (c.remark || (lastMsg && lastMsg.role !== "user" ? replyStoryText(lastMsg.content) || lastMsg.content : lastMsg?.content) || c.opening || "新的对话").replace(/\s+/g, " ");
}
function PreviewParamsDrawer({ currentId, onPeek, onApply }) {
	const open = useApp((s) => s.ui.previewParams);
	const { foldersSorted, root, inFolder } = listedChats(useApp((s) => s.folders), useApp((s) => s.chats));
	const [folderId, setFolderId] = (0, import_react.useState)(null);
	const [peekId, setPeekId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setFolderId(null);
			setPeekId(null);
		}
	}, [open]);
	if (!open) return null;
	const folder = folderId ? foldersSorted.find((f) => f.id === folderId) : void 0;
	const list = folderId ? inFolder(folderId) : root;
	const marked = peekId ?? currentId;
	const peekChat = (c) => {
		setPeekId(c.id);
		onPeek(c.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
		children: [folder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex h-10 w-full items-center gap-1 px-3 text-[13px] text-ink",
			onClick: () => setFolderId(null),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: folder.name || "文件夹"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-y-auto scroll-thin overscroll-contain",
			style: { maxHeight: "21rem" },
			children: [
				!folderId && foldersSorted.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-14 w-full items-center gap-3 px-3 text-left",
					onClick: () => setFolderId(f.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center gap-1 text-[14px] font-medium",
								children: [f.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 truncate",
									children: f.name || "文件夹"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[12px] text-muted",
								children: [inFolder(f.id).length, " 项"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted" })
					]
				}, f.id)),
				list.map((c) => {
					const current = c.id === currentId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex h-14 items-center gap-2 px-3", marked === c.id && "bg-dim"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-w-0 flex-1 items-center gap-3 text-left",
							onClick: () => peekChat(c),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatAvatar, {
								chat: c,
								size: 40
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-1 text-[14px] font-medium",
									children: [c.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate",
										children: c.name || "未命名"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[12px] text-muted",
									children: chatSnippet(c)
								})]
							})]
						}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 px-1 text-[12px] text-muted",
							children: "当前"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "shrink-0 px-1 text-[13px] text-primary",
							onClick: () => onApply(c.id),
							children: "应用"
						})]
					}, c.id);
				}),
				!folderId && foldersSorted.length === 0 && root.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-4 text-center text-[12px] text-muted",
					children: "还没有其他角色"
				}),
				folderId && list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-4 text-center text-[12px] text-muted",
					children: "文件夹是空的"
				})
			]
		})]
	});
}
function LabeledSlider({ label, value, min, max, step, locked, onLock, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between text-[13px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 text-muted",
				children: [step && step < 1 ? value.toFixed(step < .1 ? 2 : 1) : value, onLock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: locked ? "text-primary" : "text-muted",
					onClick: () => onLock(!locked),
					"aria-label": "锁定",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			value,
			min,
			max,
			step,
			onChange,
			disabled: locked
		})]
	});
}
function RowSwitch({ label, hint, on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[13px] font-medium",
			children: label
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-muted",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			on,
			onChange
		})]
	});
}
function PromptBox({ value, onChange, suggest, minH }) {
	const ref = (0, import_react.useRef)(null);
	const [hits, setHits] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		loadTags();
	}, []);
	const onPick = (tag) => {
		const el = ref.current;
		const next = insertTag(value, el?.selectionStart ?? value.length, tag);
		onChange(next.text);
		setHits([]);
		requestAnimationFrame(() => {
			el?.focus();
			el?.setSelectionRange(next.caret, next.caret);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			ref,
			value,
			style: { minHeight: minH },
			onChange: (e) => {
				onChange(e.target.value);
				if (!suggest) {
					setHits([]);
					return;
				}
				const caret = e.target.selectionStart ?? e.target.value.length;
				setHits(suggestTags(e.target.value, caret, 8).items);
			}
		}), hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-[14px] border border-line bg-card py-1 shadow-lg",
			children: hits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] hover:bg-dim",
				onMouseDown: (e) => e.preventDefault(),
				onClick: () => onPick(t.e),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.e }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: t.c
				})]
			}, t.e))
		})]
	});
}
function Img2ImgBox({ blobId, strength, noise, onFile, onClear, onStrength, onNoise }) {
	const input = (0, import_react.useRef)(null);
	const [url, setUrl] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!blobId) {
			setUrl(null);
			return;
		}
		let dead = false;
		imageUrl(blobId).then((u) => {
			if (!dead) setUrl(u);
		});
		return () => {
			dead = true;
		};
	}, [blobId]);
	const take = (file) => {
		if (file && (!file.type || file.type.startsWith("image/"))) onFile(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4",
		"data-section": "img2img",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-[13px] font-medium",
				children: "图生图"
			}),
			blobId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-[16px] border border-line bg-dim",
					children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: url,
						alt: "",
						className: "max-h-64 w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 w-full bg-dim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-card/90 text-ink",
						"aria-label": "删除底图",
						onClick: onClear,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 mt-3 text-[13px] font-medium",
					children: "图生图调整"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "强度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: strength.toFixed(2)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					value: strength,
					min: .01,
					max: .99,
					step: .01,
					onChange: onStrength
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 mt-3 flex items-center justify-between text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "噪声" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: noise.toFixed(2)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					value: noise,
					min: 0,
					max: .99,
					step: .01,
					onChange: onNoise
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `flex h-36 w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed text-[13px] text-muted ${over ? "border-primary bg-dim" : "border-line"}`,
				onClick: () => input.current?.click(),
				onDragOver: (e) => {
					e.preventDefault();
					setOver(true);
				},
				onDragLeave: () => setOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setOver(false);
					take(e.dataTransfer.files?.[0]);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" }), "点击或将图像拖放到此处"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: input,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					take(e.target.files?.[0]);
					e.target.value = "";
				}
			})
		]
	});
}
var HOLD_MS$1 = 400;
var drawing = false;
var drawAbort = null;
function cancelPureDraw() {
	drawAbort?.abort();
}
function PurePane() {
	const history = useApp((s) => s.history);
	const left = useCooldown(useApp((s) => s.settings).cooldownUntil);
	const [sheet, setSheet] = (0, import_react.useState)(null);
	const [viewId, setViewId] = (0, import_react.useState)(null);
	const [url, setUrl] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [flipLock, setFlipLock] = (0, import_react.useState)(false);
	const [peekId, setPeekId] = (0, import_react.useState)(null);
	const peek = useApp((s) => peekId ? s.favorites.find((f) => f.id === peekId) : void 0);
	const done = sortHistoryNewestFirst(history.filter((h) => h.status === "done" && h.blobId));
	const found = viewId ? done.findIndex((h) => h.id === viewId) : -1;
	const idx = found >= 0 ? found : 0;
	const item = done[idx];
	const shownBlob = peek?.blobId || item?.blobId;
	(0, import_react.useEffect)(() => {
		let gone = false;
		if (shownBlob) imageUrl(shownBlob).then((u) => {
			if (!gone) setUrl(u);
		});
		else setUrl(null);
		return () => {
			gone = true;
		};
	}, [shownBlob]);
	const go = (dir) => {
		if (peekId) {
			setPeekId(null);
			return;
		}
		const n = done.length;
		if (n < 2) return;
		const next = (idx + dir + n) % n;
		setViewId(done[next].id);
	};
	const closeSheet = () => {
		setSheet(null);
		setFlipLock(true);
	};
	const openSheet = (s) => setSheet(s);
	(0, import_react.useEffect)(() => {
		if (!flipLock) return;
		const stop = (e) => {
			e.stopPropagation();
			e.preventDefault();
		};
		window.addEventListener("click", stop, true);
		const t = window.setTimeout(() => {
			window.removeEventListener("click", stop, true);
			setFlipLock(false);
		}, 400);
		return () => {
			window.clearTimeout(t);
			window.removeEventListener("click", stop, true);
		};
	}, [flipLock]);
	const jump = (section) => {
		useApp.getState().setUI({ paramsJump: section });
		setSheet("params");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full flex-col bg-stage text-on-stage",
		style: {
			background: "#141210",
			color: "#f3eee6"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1",
				children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: url,
						alt: "",
						className: "h-full w-full object-contain"
					}), done.length > 1 && !flipLock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute inset-y-0 left-0 w-1/2",
						onClick: () => go(1),
						"aria-label": "上一张"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute inset-y-0 right-0 w-1/2",
						onClick: () => go(-1),
						"aria-label": "下一张"
					})] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center px-8 text-center text-[13px] text-stage-muted",
					children: "还没有图。先去参数里写提示词，再点绘一张。"
				})
			}),
			item && !peek && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-2 text-[11px] text-stage-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jump("model"),
						children: modelLabel(item.model)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jump("size"),
						children: [
							item.width,
							"×",
							item.height
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jump("steps"),
						children: [item.steps, "步"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jump("sampler"),
						children: samplerLabel(item.sampler)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							useApp.getState().setPureParams({ seed: item.seed });
							jump("seed");
						},
						children: item.seed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: left > 0 ? "text-danger" : "text-good",
						children: left > 0 ? `${left}s` : "可生图"
					})
				]
			}),
			peek && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-2 text-[11px] text-stage-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jump("model"),
						children: modelLabel(peek.params.model)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jump("size"),
						children: [
							peek.params.width,
							"×",
							peek.params.height
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => jump("steps"),
						children: [peek.params.steps, "步"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => jump("sampler"),
						children: samplerLabel(peek.params.sampler)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: peek.params.seed ?? "随机" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: left > 0 ? "text-danger" : "text-good",
						children: left > 0 ? `${left}s` : "可生图"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						className: "text-on-stage",
						onClick: () => openSheet("params"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						className: "text-on-stage",
						onClick: () => openSheet("fav"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
						className: "flex-1",
						busy: Boolean(phase),
						onClick: () => {
							if (phase) {
								cancelPureDraw();
								return;
							}
							drawOne(setPhase, (id) => {
								setPeekId(null);
								setViewId(id);
							});
						},
						children: phase ? "取消" : "绘一张"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						className: "text-on-stage",
						onClick: async () => {
							if (!shownBlob) return;
							const u = await imageUrl(shownBlob);
							if (!u) return;
							downloadBlob(await fetch(u).then((r) => r.blob()), String(peek?.params.seed ?? item?.seed ?? "image"));
							setSaved(true);
							setTimeout(() => setSaved(false), 1e3);
						},
						children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						className: "text-on-stage",
						onClick: () => openSheet("hist"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5" })
					})
				]
			}),
			sheet === "params" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PureParamsSheet, { onClose: closeSheet }),
			sheet === "fav" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavSheet, {
				currentBlob: item?.blobId,
				previewId: peekId,
				onPreview: setPeekId,
				onClose: closeSheet
			}),
			sheet === "hist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistSheet, {
				items: done,
				activeId: item?.id,
				onClose: closeSheet,
				onPreview: (i) => {
					const row = done[i];
					if (row) setViewId(row.id);
					closeSheet();
				}
			})
		]
	});
}
function Sheet({ title, onClose, extra, header, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col justify-end bg-overlay/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "flex-1",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink",
			children: [header ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between gap-2 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[16px] font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [extra, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						"aria-label": "关闭",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
				children
			})]
		})]
	});
}
function GripBars() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col items-center justify-center gap-[3.5px] text-current",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[2px] w-4 rounded-full bg-current" })
		]
	});
}
function byOrder(rows, pick, starredFirst) {
	return [...rows].sort((a, b) => {
		if (starredFirst && Boolean(a.starred) !== Boolean(b.starred)) return a.starred ? -1 : 1;
		return (pick(a.id) ?? a.order ?? 0) - (pick(b.id) ?? b.order ?? 0);
	});
}
function applyPureParams(next) {
	const s = useApp.getState();
	if (s.settings.pureCharLocked) next = {
		...next,
		characters: structuredClone(s.pureParams.characters),
		useCoords: s.pureParams.useCoords
	};
	s.setPureParams({
		...next,
		img2imgBlobId: next.img2imgBlobId || "",
		img2imgStrength: next.img2imgStrength ?? .7,
		img2imgNoise: next.img2imgNoise ?? 0
	});
}
function FavSheet({ currentBlob, previewId, onPreview, onClose }) {
	const favorites = useApp((s) => s.favorites);
	const favGroups = useApp((s) => s.favGroups);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [sortMode, setSortMode] = (0, import_react.useState)(false);
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const [holdId, setHoldId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [move, setMove] = (0, import_react.useState)(null);
	const [naming, setNaming] = (0, import_react.useState)(null);
	const [askDelete, setAskDelete] = (0, import_react.useState)(null);
	const thumbs = useApp((s) => s.settings.favThumbs === true);
	const listRef = (0, import_react.useRef)(null);
	const pressTimer = (0, import_react.useRef)(0);
	const press = (0, import_react.useRef)(null);
	const sortRef = (0, import_react.useRef)(false);
	const draftRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	const lastY = (0, import_react.useRef)(0);
	const rafRef = (0, import_react.useRef)(0);
	const gOrder = (id) => draft?.groups[id];
	const fOrder = (id) => draft?.favs[id];
	const pinStars = !(sortMode && draft);
	const groupsOf = (parentId) => byOrder(favGroups.filter((g) => (g.parentId ?? null) === parentId), gOrder, pinStars);
	const favsOf = (groupId) => byOrder(favorites.filter((f) => (f.groupId ?? null) === groupId), fOrder, pinStars);
	const current = favorites.find((f) => f.id === openId);
	const editing = favorites.find((f) => f.id === editId);
	const saveDraft = () => {
		const d = draftRef.current;
		if (!sortRef.current || !d) return;
		sortRef.current = false;
		useApp.getState().setFavOrders(d.groups, d.favs);
		draftRef.current = null;
		setDraft(null);
		setSortMode(false);
		setDragId(null);
	};
	const close = () => {
		saveDraft();
		onClose();
	};
	(0, import_react.useEffect)(() => {
		sortRef.current = sortMode;
	}, [sortMode]);
	(0, import_react.useEffect)(() => {
		if (!sortMode) return;
		const applyY = (y) => {
			const d = dragRef.current;
			const cur = draftRef.current;
			if (!d || !cur) return;
			const nodes = listRef.current?.querySelectorAll(`[data-drag-lane="${d.lane}"]`);
			if (!nodes?.length) return;
			const ids = Array.from(nodes).map((el) => el.dataset.rowId).filter((id) => Boolean(id));
			const next = moveId(ids, d.id, indexFromY(nodes, y));
			if (next.join("\0") === ids.join("\0")) return;
			const laneGroups = d.lane.startsWith("g:");
			const map = { ...laneGroups ? cur.groups : cur.favs };
			next.forEach((id, i) => {
				map[id] = i;
			});
			const updated = laneGroups ? {
				...cur,
				groups: map
			} : {
				...cur,
				favs: map
			};
			draftRef.current = updated;
			setDraft(updated);
		};
		const tick = () => {
			rafRef.current = 0;
			if (!dragRef.current) return;
			const scroller = nearestScroller(listRef.current);
			const dy = scroller ? autoScrollNearEdge(scroller, lastY.current) : 0;
			applyY(lastY.current);
			if (dy) rafRef.current = requestAnimationFrame(tick);
		};
		const onMove = (e) => {
			if (!dragRef.current) return;
			e.preventDefault();
			lastY.current = e.clientY;
			const scroller = nearestScroller(listRef.current);
			const dy = scroller ? autoScrollNearEdge(scroller, e.clientY) : 0;
			applyY(e.clientY);
			if (dy && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
		};
		const onUp = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = 0;
			const scroller = nearestScroller(listRef.current);
			if (scroller) scroller.style.touchAction = "";
			dragRef.current = null;
			setDragId(null);
		};
		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [sortMode]);
	(0, import_react.useEffect)(() => {
		return () => {
			window.clearTimeout(pressTimer.current);
			if (sortRef.current && draftRef.current) useApp.getState().setFavOrders(draftRef.current.groups, draftRef.current.favs);
		};
	}, []);
	const clearPress = () => {
		window.clearTimeout(pressTimer.current);
		press.current = null;
		setHoldId(null);
	};
	const enterSort = () => {
		if (favorites.length + favGroups.length < 2) return;
		const snap = {
			groups: {},
			favs: {}
		};
		const parents = /* @__PURE__ */ new Set([null]);
		for (const g of favGroups) parents.add(g.parentId ?? null);
		for (const f of favorites) parents.add(f.groupId ?? null);
		for (const p of parents) {
			groupsOf(p).forEach((g, i) => {
				snap.groups[g.id] = i;
			});
			favsOf(p).forEach((f, i) => {
				snap.favs[f.id] = i;
			});
		}
		draftRef.current = {
			groups: { ...snap.groups },
			favs: { ...snap.favs }
		};
		sortRef.current = true;
		setDraft(draftRef.current);
		setSortMode(true);
		setHoldId(null);
		setMenu(null);
		try {
			navigator.vibrate?.(12);
		} catch {}
	};
	const cancelSort = () => {
		sortRef.current = false;
		draftRef.current = null;
		dragRef.current = null;
		setDraft(null);
		setDragId(null);
		setSortMode(false);
	};
	const finishSort = () => {
		saveDraft();
	};
	const onRowPointerDown = (e) => {
		if (sortRef.current) return;
		if (e.target.closest("button")) return;
		if (e.pointerType === "mouse" && e.button !== 0) return;
		clearPress();
		if (favorites.length + favGroups.length < 2) return;
		const id = e.currentTarget.dataset.rowId || "";
		press.current = { y: e.clientY };
		setHoldId(id);
		pressTimer.current = window.setTimeout(enterSort, HOLD_MS$1);
	};
	const onRowPointerMove = (e) => {
		const p = press.current;
		if (!p || sortRef.current) return;
		if (Math.abs(e.clientY - p.y) > 12) clearPress();
	};
	const onGripDown = (e, id, lane) => {
		e.preventDefault();
		e.stopPropagation();
		dragRef.current = {
			id,
			lane
		};
		setDragId(id);
		lastY.current = e.clientY;
		const el = nearestScroller(listRef.current);
		if (el) el.style.touchAction = "none";
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	};
	const openMenu = (el, kind, id) => {
		const r = el.getBoundingClientRect();
		const menuW = 132;
		const menuH = kind === "group" ? 168 : 126;
		let right = window.innerWidth - r.right;
		right = Math.max(8, Math.min(right, window.innerWidth - menuW - 8));
		let top = r.bottom + 4;
		if (top + menuH > window.innerHeight - 8) top = Math.max(8, r.top - menuH - 4);
		setMenu({
			kind,
			id,
			top,
			right
		});
	};
	const fillFav = (fav) => {
		const next = structuredClone(fav.params);
		next.seedLocked = false;
		applyPureParams(next);
		useApp.getState().toast("已填入");
	};
	const rowHandlers = {
		onPointerDown: onRowPointerDown,
		onPointerMove: onRowPointerMove,
		onPointerUp: clearPress,
		onPointerCancel: clearPress,
		onContextMenu: (e) => e.preventDefault()
	};
	const renderGroups = (parentId, depth) => groupsOf(parentId).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-drag-lane": `g:${parentId ?? "root"}`,
		"data-row-id": g.id,
		className: `flex items-center gap-2 py-1.5 select-none ${dragId === g.id ? "bg-ink/10" : ""} ${!sortMode && holdId === g.id ? "bg-ink/5" : ""}`,
		style: {
			marginLeft: depth * 12,
			touchAction: sortMode ? "pan-y" : "manipulation"
		},
		...rowHandlers,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-5 shrink-0 items-center justify-center rounded-full border border-line text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-3" })
					}),
					g.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 truncate text-[15px] font-bold",
						children: g.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-8 shrink-0 items-center justify-center text-muted",
				"aria-label": g.collapsed ? "展开" : "收起",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: () => useApp.getState().toggleFavGroup(g.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 12 12",
					className: `size-3 shrink-0 fill-current transition ${g.collapsed ? "" : "rotate-180"}`,
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 9.2 1.4 3.2h9.2L6 9.2z" })
				})
			}),
			sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-8 shrink-0 items-center justify-center text-ink/55",
				"aria-label": "拖动排序",
				style: { touchAction: "none" },
				onPointerDown: (e) => onGripDown(e, g.id, `g:${parentId ?? "root"}`),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripBars, {})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-8 shrink-0 items-center justify-center text-muted",
				"aria-label": "更多",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: (e) => openMenu(e.currentTarget, "group", g.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			})
		]
	}), !g.collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [renderGroups(g.id, depth + 1), thumbs ? renderThumbs(favsOf(g.id), depth + 1) : favsOf(g.id).map((f) => renderFav(f, depth + 1))] })] }, g.id));
	const renderFav = (f, depth) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-drag-lane": `f:${f.groupId ?? "root"}`,
		"data-row-id": f.id,
		className: `mb-2 flex items-stretch gap-3 rounded-[18px] border border-line bg-card px-3 py-2 select-none ${dragId === f.id ? "bg-ink/15" : ""} ${!sortMode && holdId === f.id ? "bg-ink/8" : ""}`,
		style: {
			marginLeft: depth * 12,
			touchAction: sortMode ? "pan-y" : "manipulation"
		},
		...rowHandlers,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioThumb, {
				blobId: f.blobId,
				w: f.params.width,
				h: f.params.height
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-[72px] min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-0 flex-1 items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-1",
						children: [f.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[14px] text-ink",
							children: f.name
						})]
					})
				}), !sortMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-full border border-line px-2.5 py-0.5 text-[12px] text-ink",
							onPointerDown: (e) => e.stopPropagation(),
							onClick: () => fillFav(f),
							children: "填入"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-7 items-center justify-center text-muted",
							"aria-label": "查看",
							onPointerDown: (e) => e.stopPropagation(),
							onClick: () => setOpenId(f.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-7 items-center justify-center text-muted",
							"aria-label": "编辑",
							onPointerDown: (e) => e.stopPropagation(),
							onClick: () => setEditId(f.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-7 items-center justify-center text-muted",
							"aria-label": "更多",
							onPointerDown: (e) => e.stopPropagation(),
							onClick: (e) => openMenu(e.currentTarget, "fav", f.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
						})
					]
				})]
			}),
			sortMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-8 shrink-0 items-center justify-center text-ink/55",
				"aria-label": "拖动排序",
				style: { touchAction: "none" },
				onPointerDown: (e) => onGripDown(e, f.id, `f:${f.groupId ?? "root"}`),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripBars, {})
			})
		]
	}, f.id);
	const renderThumbs = (rows, depth) => rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 grid grid-cols-4 items-start gap-x-1.5 gap-y-2",
		style: { marginLeft: depth * 12 },
		children: rows.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavThumb, {
			fav: f,
			active: previewId === f.id,
			onPick: () => onPreview(f.id),
			onHold: () => setOpenId(f.id),
			onApply: () => fillFav(f),
			onMenu: (el) => openMenu(el, "fav", f.id)
		}, f.id))
	}) : null;
	if (current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavDetail, {
		fav: current,
		currentBlob,
		onBack: () => setOpenId(null),
		onClose,
		onFill: () => void 0
	});
	const pill = "rounded-full border border-line bg-card px-3 py-1 text-[12px]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			title: "收藏",
			onClose: close,
			header: sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[15px] font-medium text-primary",
						onClick: cancelSort,
						children: "取消"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[15px] font-medium text-primary",
						onClick: finishSort,
						children: "完成"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: close,
						"aria-label": "关闭",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1.5 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 text-[16px] font-semibold",
						children: "收藏"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: thumbs ? "shrink-0 rounded-full bg-danger px-2.5 py-1 text-[12px] text-white" : "shrink-0 rounded-full border border-line bg-card px-2.5 py-1 text-[12px]",
						onClick: () => useApp.getState().setSettings({ favThumbs: !thumbs }),
						children: "缩略图"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "min-w-0 flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: pill,
						onClick: () => setNaming({ name: "" }),
						children: "创建分组"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: pill,
						onClick: () => useApp.getState().addFavorite(currentBlob),
						children: "保存当前"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: close,
						"aria-label": "关闭",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})
				]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: listRef,
				children: [
					renderGroups(null, 0),
					thumbs ? renderThumbs(favsOf(null), 0) : favsOf(null).map((f) => renderFav(f, 0)),
					favorites.length === 0 && favGroups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-10 text-center text-[13px] text-muted",
						children: "还没有收藏。点右上角保存当前参数。"
					})
				]
			})
		}),
		menu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40",
			onClick: () => setMenu(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute w-[132px] overflow-hidden rounded-[14px] border border-line bg-card text-left text-[14px] text-ink shadow-lg",
				style: {
					top: menu.top,
					right: menu.right
				},
				onClick: (e) => e.stopPropagation(),
				children: [
					menu.kind === "group" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "block w-full px-3 py-2.5 text-left",
						onClick: () => {
							const g = favGroups.find((x) => x.id === menu.id);
							setNaming({
								id: menu.id,
								name: g?.name ?? ""
							});
							setMenu(null);
						},
						children: "重命名"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `block w-full px-3 py-2.5 text-left ${menu.kind === "group" ? "border-t border-line" : ""}`,
						onClick: () => {
							if (menu.kind === "fav") useApp.getState().deleteFavorite(menu.id);
							else setAskDelete(menu.id);
							setMenu(null);
						},
						children: "删除"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "block w-full border-t border-line px-3 py-2.5 text-left",
						onClick: () => {
							setMove({
								kind: menu.kind,
								id: menu.id
							});
							setMenu(null);
						},
						children: "移动"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "block w-full border-t border-line px-3 py-2.5 text-left",
						onClick: () => {
							if (menu.kind === "fav") useApp.getState().toggleFavoriteStar(menu.id);
							else useApp.getState().toggleFavGroupStar(menu.id);
							setMenu(null);
						},
						children: "星标"
					})
				]
			})
		}),
		move && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveSheet, {
			move,
			groups: favGroups,
			onClose: () => setMove(null),
			onPick: (parentId) => {
				if (move.kind === "fav") useApp.getState().moveFavorite(move.id, parentId);
				else useApp.getState().moveFavGroup(move.id, parentId);
				setMove(null);
			}
		}),
		naming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameDialog, {
			title: naming.id ? "重命名" : "创建分组",
			value: naming.name,
			onClose: () => setNaming(null),
			onOk: (name) => {
				if (naming.id) useApp.getState().renameFavGroup(naming.id, name);
				else useApp.getState().addFavGroup(name);
				setNaming(null);
			}
		}),
		askDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			text: countFavsInGroup(favGroups, favorites, askDelete) > 0 ? `删除这个分组？里面的 ${countFavsInGroup(favGroups, favorites, askDelete)} 条收藏会一起删掉。` : "删除这个分组？",
			onClose: () => setAskDelete(null),
			onOk: () => {
				useApp.getState().deleteFavGroup(askDelete);
				setAskDelete(null);
			}
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavEdit, {
			fav: editing,
			onClose: () => setEditId(null)
		})
	] });
}
function MoveSheet({ move, groups, onClose, onPick }) {
	const blocked = move.kind === "group" ? /* @__PURE__ */ new Set([move.id, ...favGroupDescendants(groups, move.id)]) : /* @__PURE__ */ new Set();
	const rows = [];
	const walk = (parentId, depth) => {
		for (const g of [...groups].filter((x) => (x.parentId ?? null) === parentId).sort((a, b) => {
			if (Boolean(a.starred) !== Boolean(b.starred)) return a.starred ? -1 : 1;
			return a.order - b.order;
		})) {
			if (blocked.has(g.id)) continue;
			rows.push({
				g,
				depth
			});
			walk(g.id, depth + 1);
		}
	};
	walk(null, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col justify-end bg-overlay/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-8 flex-1",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[70%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[16px] font-semibold",
					children: "移动"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "关闭",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-2 h-11 w-full rounded-full border border-line bg-card text-[14px]",
					onClick: () => onPick(null),
					children: "不放进分组"
				}), rows.map(({ g, depth }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-2 block h-11 rounded-full border border-line bg-card px-4 text-left text-[14px]",
					style: {
						marginLeft: depth * 16,
						width: `calc(100% - ${depth * 16}px)`
					},
					onClick: () => onPick(g.id),
					children: g.name
				}, g.id))]
			})]
		})]
	});
}
function NameDialog({ title, value, onClose, onOk }) {
	const [text, setText] = (0, import_react.useState)(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center bg-overlay/50 px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-[20px] bg-bg p-4 text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-[15px] font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: text,
					autoFocus: true,
					placeholder: "分组名称",
					onChange: (e) => setText(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex justify-end gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[14px] text-muted",
						onClick: onClose,
						children: "取消"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[14px] font-medium text-primary",
						onClick: () => onOk(text),
						children: "确定"
					})]
				})
			]
		})
	});
}
function ConfirmDialog({ text, onClose, onOk }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center bg-overlay/50 px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-[20px] bg-bg p-4 text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[14px] leading-relaxed",
				children: text
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex justify-end gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[14px] text-muted",
					onClick: onClose,
					children: "取消"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[14px] font-medium text-danger",
					onClick: onOk,
					children: "删除"
				})]
			})]
		})
	});
}
function FavEdit({ fav, onClose }) {
	const p = fav.params;
	const [name, setName] = (0, import_react.useState)(fav.name);
	const [front, setFront] = (0, import_react.useState)(p.promptFront);
	const [mid, setMid] = (0, import_react.useState)(p.promptMid);
	const [back, setBack] = (0, import_react.useState)(p.promptBack);
	const [negative, setNegative] = (0, import_react.useState)(p.negative);
	const [chars, setChars] = (0, import_react.useState)(p.characters.map((c) => ({
		id: c.id,
		prompt: c.prompt,
		uc: c.uc
	})));
	const save = () => {
		const params = structuredClone(p);
		params.promptFront = front;
		params.promptMid = mid;
		params.promptBack = back;
		params.negative = negative;
		params.characters = params.characters.map((c) => {
			const hit = chars.find((x) => x.id === c.id);
			return hit ? {
				...c,
				prompt: hit.prompt,
				uc: hit.uc
			} : c;
		});
		useApp.getState().patchFavorite(fav.id, {
			name: name.trim() || "未命名",
			params
		});
		useApp.getState().toast("已保存");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col justify-end bg-overlay/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-8 flex-1",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[78%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 px-4 py-3 text-[16px] font-semibold",
					children: "编辑收藏"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[12px] text-muted",
							children: "标题"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: name,
							onChange: (e) => setName(e.target.value)
						}),
						p.merged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 mt-3 text-[12px] text-muted",
							children: "正面提示词"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: mid,
							onChange: (e) => setMid(e.target.value)
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 mt-3 text-[12px] text-muted",
								children: "正面提示词前"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: front,
								onChange: (e) => setFront(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 mt-3 text-[12px] text-muted",
								children: "正面提示词中"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: mid,
								onChange: (e) => setMid(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 mt-3 text-[12px] text-muted",
								children: "正面提示词后"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: back,
								onChange: (e) => setBack(e.target.value)
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 mt-3 text-[12px] text-muted",
							children: "负面提示词"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: negative,
							onChange: (e) => setNegative(e.target.value)
						}),
						chars.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 mt-3 text-[12px] text-muted",
								children: [
									"角色",
									i + 1,
									" 正面"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: c.prompt,
								onChange: (e) => setChars((rows) => rows.map((x) => x.id === c.id ? {
									...x,
									prompt: e.target.value
								} : x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 mt-3 text-[12px] text-muted",
								children: [
									"角色",
									i + 1,
									" 负面"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: c.uc,
								onChange: (e) => setChars((rows) => rows.map((x) => x.id === c.id ? {
									...x,
									uc: e.target.value
								} : x))
							})
						] }, c.id))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center justify-end gap-3 border-t border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 px-3 text-[14px]",
						onClick: onClose,
						children: "取消"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full bg-ink px-4 text-[14px] font-medium text-bg",
						onClick: save,
						children: "保存修改"
					})]
				})
			]
		})]
	});
}
function FavDetail({ fav, currentBlob, onBack, onClose, onFill }) {
	const [name, setName] = (0, import_react.useState)(fav.name);
	(0, import_react.useEffect)(() => setName(fav.name), [fav.id, fav.name]);
	const p = fav.params;
	const chars = p.characters.filter((c) => c.prompt.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col justify-end bg-overlay/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "flex-1",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "inline-flex items-center gap-1 text-[14px]",
					onClick: onBack,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " 返回"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[13px] text-muted",
						children: "名称"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: name,
						onChange: (e) => setName(e.target.value),
						onBlur: () => {
							const t = name.trim() || "未命名";
							setName(t);
							if (t !== fav.name) useApp.getState().patchFavorite(fav.id, { name: t });
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "h-11 flex-1 rounded-full bg-ink text-[14px] font-medium text-bg",
							onClick: () => {
								const next = structuredClone(fav.params);
								next.seedLocked = false;
								applyPureParams(next);
								useApp.getState().toast("已填入");
								onFill();
							},
							children: "填入"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "h-11 flex-1 rounded-full bg-danger text-[14px] font-medium text-white",
							onClick: () => {
								useApp.getState().deleteFavorite(fav.id);
								onBack();
							},
							children: "删除"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "正面提示词",
						text: promptPreview(p) || "（空）"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "负面提示词",
						text: p.negative || "（空）"
					}),
					chars.length > 0 && chars.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: c.name ? `角色提示词 · ${c.name}` : `角色提示词 ${i + 1}`,
						text: c.prompt
					}), c.uc?.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: c.name ? `角色负面 · ${c.name}` : `角色负面 ${i + 1}`,
						text: c.uc
					}) : null] }, c.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-[12px] leading-5 text-muted",
						children: [
							modelLabel(p.model),
							" · ",
							p.width,
							"×",
							p.height,
							" · ",
							p.steps,
							"步 · ",
							samplerLabel(p.sampler),
							" · 种子 ",
							p.seed ?? "随机",
							p.seedLocked ? "（已锁）" : "",
							" · CFG ",
							p.scale,
							" · 噪声",
							" ",
							NOISE_SCHEDULES.find((n) => n.id === p.noiseSchedule)?.label ?? p.noiseSchedule,
							" · rescale ",
							p.cfgRescale,
							p.varietyPlus ? " · Variety+" : "",
							p.decrisper ? " · Decrisper" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-4 mb-2 h-11 w-full rounded-full border border-line bg-card text-[14px] disabled:opacity-40",
						disabled: !currentBlob,
						onClick: () => {
							if (!currentBlob) return;
							useApp.getState().setFavoriteThumb(fav.id, currentBlob);
						},
						children: "应用当前图片为配图"
					})
				]
			})]
		})]
	});
}
function FavThumb({ fav, active, onPick, onHold, onApply, onMenu }) {
	const [u, setU] = (0, import_react.useState)(null);
	const hold = (0, import_react.useRef)(null);
	const held = (0, import_react.useRef)(false);
	const moved = (0, import_react.useRef)(false);
	const start = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		if (fav.blobId) imageUrl(fav.blobId).then(setU);
		else setU(null);
	}, [fav.blobId]);
	const clear = () => {
		if (hold.current) window.clearTimeout(hold.current);
		hold.current = null;
	};
	const w = fav.params.width > 0 ? fav.params.width : 832;
	const h = fav.params.height > 0 ? fav.params.height : 1216;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `overflow-hidden rounded-[8px] bg-dim ${active ? "ring-2 ring-red-500 ring-offset-1 ring-offset-bg" : ""}`,
			style: { aspectRatio: `${w} / ${h}` },
			onPointerDown: (e) => {
				held.current = false;
				moved.current = false;
				start.current = {
					x: e.clientX,
					y: e.clientY
				};
				clear();
				hold.current = window.setTimeout(() => {
					held.current = true;
				}, HOLD_MS$1);
			},
			onPointerMove: (e) => {
				if (Math.abs(e.clientX - start.current.x) > 10 || Math.abs(e.clientY - start.current.y) > 10) {
					moved.current = true;
					clear();
				}
			},
			onPointerUp: (e) => {
				const was = held.current;
				const skip = moved.current;
				clear();
				held.current = false;
				e.stopPropagation();
				if (skip) return;
				if (was) onHold();
				else onPick();
			},
			onPointerCancel: clear,
			onContextMenu: (e) => e.preventDefault(),
			children: u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: u,
				alt: "",
				className: "size-full object-contain"
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex items-stretch gap-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-w-0 flex-1 whitespace-nowrap rounded-full border border-line py-0.5 text-[10px] leading-tight text-ink",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: (e) => {
					e.stopPropagation();
					onApply();
				},
				children: "应用参数"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex w-5 shrink-0 items-center justify-center text-muted",
				"aria-label": "更多",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: (e) => {
					e.stopPropagation();
					onMenu(e.currentTarget);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3" })
			})]
		})]
	});
}
function Field({ label, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[12px] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "whitespace-pre-wrap rounded-[16px] bg-surface px-3.5 py-3 text-[13px] leading-relaxed",
			children: text
		})]
	});
}
function RatioThumb({ blobId, w, h }) {
	const [u, setU] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (blobId) imageUrl(blobId).then(setU);
		else setU(null);
	}, [blobId]);
	const ratio = w > 0 && h > 0 ? w / h : 832 / 1216;
	const height = 72;
	const width = Math.max(40, Math.min(72, Math.round(height * ratio)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "shrink-0 overflow-hidden rounded-[8px] bg-dim",
		style: {
			width,
			height
		},
		children: u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: u,
			alt: "",
			className: "size-full object-contain"
		}) : null
	});
}
function HistSheet({ items, activeId, onClose, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		title: "历史",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2",
			children: [items.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistCell, {
				item: h,
				active: h.id === activeId,
				onPreview: () => onPreview(i)
			}, h.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-3 py-10 text-center text-[13px] text-muted",
				children: "还没有历史"
			})]
		})
	});
}
function HistCell({ item, active, onPreview }) {
	const [u, setU] = (0, import_react.useState)(null);
	const hold = (0, import_react.useRef)(null);
	const held = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (item.blobId) imageUrl(item.blobId).then(setU);
	}, [item.blobId]);
	const clear = () => {
		if (hold.current) window.clearTimeout(hold.current);
		hold.current = null;
	};
	const onDown = (e) => {
		held.current = false;
		clear();
		hold.current = window.setTimeout(() => {
			held.current = true;
		}, HOLD_MS$1);
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: active ? "relative overflow-hidden rounded-[8px] bg-dim ring-2 ring-red-500 ring-offset-1 ring-offset-bg" : "relative overflow-hidden rounded-[8px] bg-dim",
		onPointerDown: onDown,
		onPointerUp: (e) => {
			const was = held.current;
			clear();
			e.stopPropagation();
			if (was) useApp.getState().deleteHistory(item.id);
			else onPreview();
		},
		onPointerCancel: clear,
		onContextMenu: (e) => e.preventDefault(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-square",
				children: u && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: u,
					alt: "",
					className: "size-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-6 text-[10px] leading-tight text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: modelShort(item.model) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: samplerShort(item.sampler) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "absolute bottom-1 right-1 z-10 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] text-white",
				onClick: (e) => {
					e.stopPropagation();
					const p = item.params;
					if (p) {
						const next = structuredClone(p);
						next.seed = item.seed;
						next.seedLocked = false;
						applyPureParams(next);
					} else useApp.getState().setPureParams({
						model: item.model,
						width: item.width,
						height: item.height,
						steps: item.steps,
						sampler: item.sampler,
						seed: item.seed,
						seedLocked: false,
						negative: item.negative,
						promptMid: item.prompt,
						merged: true,
						img2imgBlobId: ""
					});
					useApp.getState().toast("已应用参数");
				},
				onPointerDown: (e) => e.stopPropagation(),
				onPointerUp: (e) => e.stopPropagation(),
				children: "应用参数"
			})
		]
	});
}
function PureParamsSheet({ onClose }) {
	const chat = fakePureChat(useApp((s) => s.pureParams), useApp((s) => s.settings.grokModelId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-overlay/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif text-[18px]",
					children: "参数设置"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadMeta, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamsPane, {
					chat,
					mode: "pure"
				})]
			})]
		})
	});
}
function ReadMeta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-card text-[13px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" }),
			"看图识参",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/png,image/jpeg,.png,.jpg,.jpeg",
				className: "hidden",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					e.target.value = "";
					if (!file) return;
					try {
						const meta = parseNaiPng(await file.arrayBuffer());
						if (!meta.prompt) {
							useApp.getState().toast("没读到 NovelAI 参数");
							return;
						}
						const p = useApp.getState().pureParams;
						const known = NAI_MODELS.some((m) => m.id === meta.model || m.wire === meta.model);
						const chars = meta.characters?.length ? meta.characters.map((c, i) => ({
							id: p.characters[i]?.id || `c${i}`,
							name: p.characters[i]?.name || `角色${i + 1}`,
							enabled: true,
							prompt: c.prompt,
							uc: c.uc,
							x: c.x,
							y: c.y
						})) : p.characters;
						useApp.getState().setPureParams({
							merged: true,
							promptMid: meta.prompt,
							promptFront: "",
							promptBack: "",
							negative: meta.uc || p.negative,
							width: meta.width || p.width,
							height: meta.height || p.height,
							steps: meta.steps || p.steps,
							scale: meta.scale || p.scale,
							seed: meta.seed ?? p.seed,
							sampler: meta.sampler || p.sampler,
							noiseSchedule: meta.noiseSchedule || p.noiseSchedule,
							model: known ? NAI_MODELS.find((m) => m.id === meta.model || m.wire === meta.model)?.id ?? p.model : p.model,
							characters: chars
						});
						useApp.getState().toast("已识别参数");
					} catch {
						useApp.getState().toast("识别失败，不是带参数的 NAI PNG");
					}
				}
			})
		]
	});
}
async function drawOne(setPhase, showId) {
	const params = useApp.getState().pureParams;
	const settings = useApp.getState().settings;
	if (!settings.naiKey) {
		useApp.getState().toast("还没连接 NAI");
		useApp.getState().setUI({ connection: true });
		return;
	}
	if (drawing) return;
	drawing = true;
	const ac = new AbortController();
	drawAbort = ac;
	const seed = params.seedLocked && params.seed != null ? params.seed : randomSeed();
	setPhase("uploading");
	await afterPaint();
	try {
		const result = await generateNai({
			chat: fakePureChat(params, settings.grokModelId),
			grokTail: "",
			seed,
			apiKey: settings.naiKey,
			baseUrl: settings.naiBase,
			signal: ac.signal,
			onStart: () => setPhase("generating"),
			onReceiving: () => {
				useApp.getState().setCooldown(Date.now() + COOLDOWN_MS);
				setPhase("receiving");
			}
		});
		const rec = {
			id: uid("h_"),
			prompt: result.prompt,
			negative: params.negative,
			seed: result.seed,
			model: params.model,
			width: params.width,
			height: params.height,
			steps: params.steps,
			sampler: params.sampler,
			params: structuredClone(params),
			blobId: result.blobId,
			createdAt: Date.now(),
			status: "done"
		};
		useApp.getState().addHistory(rec);
		showId(rec.id);
	} catch (e) {
		useApp.getState().toast(imageFailText(e, ac.signal));
	} finally {
		if (drawAbort === ac) drawAbort = null;
		drawing = false;
		setPhase(null);
	}
}
function RoleEditor({ chat, mode }) {
	const grok = useApp((s) => s.settings.grokModelId);
	const cards = useApp((s) => s.cards);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [polished, setPolished] = (0, import_react.useState)(false);
	const [charSel, setCharSel] = (0, import_react.useState)(0);
	const [memPick, setMemPick] = (0, import_react.useState)(false);
	const patch = (p) => useApp.getState().patchChat(chat.id, p);
	const char = chat.characters[charSel] ?? chat.characters[0];
	const autoPolish = useApp((s) => s.ui.autoPolish);
	const polishJob = useApp((s) => s.ui.polishJob);
	const busyRef = (0, import_react.useRef)(false);
	const locked = !!busy;
	const memTurns = memoryTurnStats(chat.messages.length, chat.memoryUntil);
	const { W, I } = foldWindow();
	const memOk = memoryCaughtUp(chat.messages.length, chat.memoryUntil || 0, W, I);
	const memReady = foldCoveredEnd(chat.messages.length, W, I) >= 2;
	const memoryHint = useApp((s) => s.ui.memoryHint);
	const memStreaming = memoryHint?.chatId === chat.id && memoryHint.state === "generating";
	const memoryShown = memStreaming && memoryHint.draft != null ? memoryHint.draft : chat.memory;
	const fieldBusyLabel = busy?.kind === "field" ? FIELD_LABELS[busy.key] || busy.key : "";
	const syncChars = (characters, isMulti = chat.isMulti) => patch({
		characters,
		isMulti,
		imageParams: syncCharsFromRole(chat.imageParams, characters, isMulti)
	});
	const runPolish = async (instruction, mark = "all") => {
		if (busyRef.current) return;
		busyRef.current = true;
		setBusy({ kind: mark });
		try {
			const json = await polishAll(useApp.getState().chats.find((c) => c.id === chat.id) ?? chat, grok, instruction);
			useApp.getState().patchChat(chat.id, (c) => {
				const merged = mergePolish(c, json);
				return {
					...c,
					...merged,
					imageParams: syncCharsFromRole(c.imageParams, merged.characters, c.isMulti),
					updatedAt: Date.now()
				};
			});
			setPolished(true);
			useApp.getState().toast(instruction?.trim() ? "已按要求修改" : "已完善设定");
		} catch (e) {
			useApp.getState().toast(e instanceof Error ? e.message : "完善失败");
		} finally {
			busyRef.current = false;
			setBusy(null);
		}
	};
	const runField = async (key, charId, instruction) => {
		if (busyRef.current) return;
		busyRef.current = true;
		setBusy({
			kind: "field",
			key,
			charId
		});
		try {
			const snapshot = useApp.getState().chats.find((c) => c.id === chat.id) ?? chat;
			const text = await polishField(snapshot, grok, key, instruction, charId, (t) => {
				if (key !== "persona") return;
				if (!snapshot.characters.find((c) => c.id === charId)?.personaVoices) return;
				useApp.getState().patchChat(chat.id, (c) => ({
					...applyRoleField(c, key, t, charId),
					updatedAt: Date.now()
				}));
			});
			useApp.getState().patchChat(chat.id, (c) => ({
				...applyRoleField(c, key, text, charId),
				updatedAt: Date.now()
			}));
			useApp.getState().toast(`已更新${FIELD_LABELS[key] || key}`);
		} catch (e) {
			useApp.getState().toast(e instanceof Error ? e.message : "生成失败");
		} finally {
			busyRef.current = false;
			setBusy(null);
		}
	};
	const openPersonalize = (key, charId) => {
		if (locked) return;
		useApp.getState().setUI({ fieldEdit: {
			key,
			charId,
			text: ""
		} });
	};
	(0, import_react.useEffect)(() => {
		if (!autoPolish || mode !== "create") return;
		useApp.getState().setUI({ autoPolish: false });
		runPolish();
	}, [autoPolish]);
	(0, import_react.useEffect)(() => {
		if (!polishJob || polishJob.chatId !== chat.id) return;
		useApp.getState().setUI({ polishJob: null });
		if (polishJob.kind === "field" && polishJob.key) runField(polishJob.key, polishJob.charId, polishJob.instruction);
		else runPolish(polishJob.instruction, "personalize");
	}, [polishJob]);
	const startChat = async () => {
		const name = chat.characters.map((c) => c.name).filter(Boolean).join("、") || chat.name || "未命名";
		useApp.getState().patchChat(chat.id, (c) => ({
			...c,
			name,
			isDraft: false,
			imageParams: syncCharsFromRole(c.imageParams, c.characters, c.isMulti)
		}));
		useApp.getState().commitChat(chat.id);
		if (mode === "create") {
			const { sendOpening } = await import("./chat-actions-BzFvtzjH.mjs");
			sendOpening(chat.id);
		} else useApp.getState().toast("设定已保存");
	};
	const nameBlock = char ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
		label: "名字",
		hint: "可空，让 Grok 起",
		value: char.name,
		placeholder: PLACEHOLDERS.name,
		single: true,
		busy: busy?.kind === "field" && busy.key === "name" && busy.charId === char.id,
		locked,
		onChange: (v) => useApp.getState().patchChat(chat.id, (c) => {
			const characters = c.characters.map((x) => x.id === char.id ? {
				...x,
				name: v
			} : x);
			return {
				...c,
				characters,
				imageParams: {
					...c.imageParams,
					characters: c.imageParams.characters.map((slot) => slot.id === char.id ? {
						...slot,
						name: v
					} : slot)
				},
				updatedAt: Date.now()
			};
		}),
		onRegen: () => runField("name", char.id),
		onPersonal: () => openPersonalize("name", char.id)
	}) : null;
	const overviewBlock = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
		label: "要求总览",
		hint: "可空。写了就是最高优先。例如：回复尽量详尽生动，不要简略。",
		value: chat.overview,
		placeholder: PLACEHOLDERS.overview,
		busy: busy?.kind === "field" && busy.key === "overview",
		locked,
		onChange: (v) => patch({ overview: v }),
		onRegen: () => runField("overview"),
		onPersonal: () => openPersonalize("overview")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto px-4 pb-56 pt-3 scroll-thin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[11px] tracking-[0.14em] text-muted",
				children: mode === "create" ? "NEW ROLE" : "EDIT ROLE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-1 text-[20px] font-semibold",
				children: mode === "create" ? "写下她，再交给 Grok 补全" : "修改设定"
			}),
			mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-[12px] text-muted",
				children: "保存后立刻对之后的对话生效。取消则不改动。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "inline-flex shrink-0 flex-col items-center gap-0.5 px-1 pb-1.5 text-[10px] text-muted",
					onClick: () => useApp.getState().setUI({ saveCardOpen: true }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "保存为角色卡"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardSelect, { onPick: (id) => {
						const card = cards.find((c) => c.id === id);
						if (card) useApp.getState().applyCard(chat.id, card, chat.isMulti ? charSel : void 0);
					} })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2 text-[14px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-5 place-items-center rounded-full border ${chat.isMulti ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-card"}`,
							children: chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] leading-none",
								children: "✓"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "sr-only",
							checked: chat.isMulti,
							onChange: (e) => {
								const on = e.target.checked;
								const characters = on ? chat.characters.length >= 2 ? chat.characters : [...chat.characters, emptyCharacter(2)] : [chat.characters[0] ?? emptyCharacter(1)];
								setCharSel(0);
								syncChars(characters, on);
							}
						}),
						"多人"
					]
				}), chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto inline-flex items-center gap-1 text-[13px] text-muted",
					children: ["人数", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center rounded-full border border-line bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "px-2 py-1",
								onClick: () => {
									const characters = [...chat.characters, emptyCharacter(chat.characters.length + 1)];
									syncChars(characters, true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 text-ink",
								children: chat.characters.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "px-2 py-1",
								disabled: chat.characters.length <= 2,
								onClick: () => {
									const characters = chat.characters.slice(0, -1);
									setCharSel(0);
									syncChars(characters, true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "AI 版本" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatModelSelect, {
					align: "left",
					className: "w-full rounded-full border border-line bg-card"
				})]
			}),
			!chat.isMulti && nameBlock,
			overviewBlock,
			chat.isMulti && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "角色选择" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpandSelect, {
					value: String(charSel),
					options: chat.characters.map((c, i) => ({
						id: String(i),
						label: `角色${i + 1}${c.name ? ":" + c.name : ""}`
					})),
					onChange: (id) => setCharSel(Number(id)),
					align: "left"
				})]
			}),
			char && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: chat.isMulti ? "rounded-[22px] border border-line/80 bg-card/50 p-1" : "",
				children: [
					chat.isMulti && nameBlock,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
						label: "人设",
						hint: "她是谁：性格、职业或身份、口头禅、和我的关系……外貌请写在下面那栏。",
						value: char.persona,
						placeholder: PLACEHOLDERS.persona,
						busy: busy?.kind === "field" && busy.key === "persona" && busy.charId === char.id,
						locked,
						grow: Boolean(char.personaVoices),
						titleExtra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full border px-2 py-0.5 text-[11px] leading-none transition ${char.personaVoices ? "border-primary bg-primary text-on-primary" : "border-primary bg-transparent text-primary"}`,
							disabled: locked,
							onClick: () => patch({ characters: chat.characters.map((c) => c.id === char.id ? {
								...c,
								personaVoices: !c.personaVoices
							} : c) }),
							children: "声部"
						}),
						onChange: (v) => patch({ characters: chat.characters.map((c) => c.id === char.id ? {
							...c,
							persona: v
						} : c) }),
						onRegen: () => runField("persona", char.id),
						onPersonal: () => openPersonalize("persona", char.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
						label: "说话方式",
						hint: "语气、口癖、人称、句子长短。例如：软软的、会把「……」拖长。",
						value: char.speech,
						placeholder: PLACEHOLDERS.speech,
						busy: busy?.kind === "field" && busy.key === "speech" && busy.charId === char.id,
						locked,
						onChange: (v) => patch({ characters: chat.characters.map((c) => c.id === char.id ? {
							...c,
							speech: v
						} : c) }),
						onRegen: () => runField("speech", char.id),
						onPersonal: () => openPersonalize("speech", char.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookRef, {
						blobId: char.lookBlobId,
						onPick: async (file) => {
							const id = await saveBlob(await compressRef(file, 768, .82));
							patch({ characters: chat.characters.map((c) => c.id === char.id ? {
								...c,
								lookBlobId: id
							} : c) });
						},
						onClear: () => patch({ characters: chat.characters.map((c) => c.id === char.id ? {
							...c,
							lookBlobId: ""
						} : c) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
						label: "外貌备忘",
						hint: "用生图提示词书写。发型发色瞳色体型固定服装写这里。其他栏不用再写外貌。",
						value: char.appearance,
						placeholder: PLACEHOLDERS.appearance,
						busy: busy?.kind === "field" && busy.key === "appearance" && busy.charId === char.id,
						locked,
						onChange: (v) => patch({ characters: chat.characters.map((c) => c.id === char.id ? {
							...c,
							appearance: v
						} : c) }),
						onRegen: () => runField("appearance", char.id),
						onPersonal: () => openPersonalize("appearance", char.id)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldBlock, {
				label: "开场场景",
				hint: "现在在哪里、在做什么、气氛如何。",
				value: chat.opening,
				placeholder: PLACEHOLDERS.opening,
				busy: busy?.kind === "field" && busy.key === "opening",
				locked,
				onChange: (v) => patch({ opening: v }),
				onRegen: () => runField("opening"),
				onPersonal: () => openPersonalize("opening")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium",
						children: "状态栏"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] text-muted",
						children: "关掉就折叠。打开后，每句回复末尾都会更新这份状态。开启内容按固定骨架，可改冒号后的描述。"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						on: chat.statusBarOn,
						onChange: (v) => patch({
							statusBarOn: v,
							statusBar: chat.statusBar?.trim() ? chat.statusBar : DEFAULT_STATUS_BAR
						})
					})]
				}), chat.statusBarOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					className: "min-h-[200px] font-mono text-[12px]",
					value: chat.statusBar,
					onChange: (e) => patch({ statusBar: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Extras, {
				extras: chat.extras,
				onChange: (extras) => patch({ extras })
			}),
			mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
						sub: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-[11px] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"（已对话 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-good",
									children: memTurns.spoken
								}),
								" 轮，已总结到第",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-good",
									children: memTurns.folded
								}),
								" 轮）"
							] }), memOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5 text-danger" })]
						}),
						hint: "聊久了会把更早的剧情压成备忘，下一轮当事实用。聊天里看不见。可改、可重总结、可清空。",
						children: "长期记忆"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						className: "min-h-[120px]",
						value: memoryShown,
						placeholder: memStreaming ? "正在总结…" : "还没有长期记忆。对话变长后会自动整理。",
						onChange: (e) => {
							if (memStreaming) return;
							const text = e.target.value;
							const snaps = chat.memorySnaps ?? [];
							const last = snaps[snaps.length - 1];
							patch({
								memory: text,
								memorySnaps: last ? [...snaps.slice(0, -1), {
									...last,
									text
								}] : text ? [{
									covered: chat.memoryUntil || 0,
									text,
									foldAt: chat.memoryFoldAt || 0
								}] : []
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
								className: "h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]",
								onClick: () => useApp.getState().toast("已保存"),
								children: "保存"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
								className: "h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]",
								onClick: () => {
									if (locked) return;
									if (!memReady) {
										useApp.getState().toast("还不够长，先多聊几轮");
										return;
									}
									setMemPick(true);
								},
								children: busy?.kind === "mem" ? "总结中…" : "重新总结"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
								className: "h-10 w-auto min-w-0 flex-1 whitespace-nowrap px-3 text-[13px]",
								onClick: () => {
									invalidateMemory(chat.id);
									patch(emptyMemory());
								},
								children: "清空"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: memPick,
				onClose: () => setMemPick(false),
				title: "重新总结",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-[13px] leading-5 text-muted",
					children: memOk ? "记忆已经齐了。总结到当前只重压最近那一截。" : "记忆还落后。总结到当前会从缺口一次收到位。"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
						disabled: locked || !memReady,
						busy: busy?.kind === "mem",
						onClick: async () => {
							if (locked) return;
							setMemPick(false);
							setBusy({ kind: "mem" });
							if (await runManualMemory(chat.id, "current")) useApp.getState().toast("已总结到当前");
							setBusy(null);
						},
						children: "总结到当前"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						className: "h-11",
						disabled: locked || !memReady,
						onClick: async () => {
							if (locked) return;
							setMemPick(false);
							setBusy({ kind: "mem" });
							if (await runManualMemory(chat.id, "all")) useApp.getState().toast("已全部重新总结");
							setBusy(null);
						},
						children: "全部重新总结"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none h-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4",
				children: [
					mode === "create" && !polished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
						busy: busy?.kind === "all" || busy?.kind === "field",
						disabled: locked && busy?.kind !== "all" && busy?.kind !== "field",
						onClick: () => {
							if (locked) return;
							runPolish();
						},
						children: busy?.kind === "field" ? `完善中(${fieldBusyLabel})` : busy?.kind === "all" ? "完善中" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " 让 Grok 完善设定"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						className: "mt-2",
						disabled: locked,
						onClick: () => void startChat(),
						children: "跳过，开始聊天"
					})] }),
					mode === "create" && polished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
							busy: busy?.kind === "field",
							disabled: locked,
							onClick: () => {
								if (locked) return;
								startChat();
							},
							children: busy?.kind === "field" ? `完善中(${fieldBusyLabel})` : "可以了，开始聊天"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
							className: "mt-2",
							disabled: locked && busy?.kind !== "all",
							onClick: () => void runPolish(),
							children: busy?.kind === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " 完善中"] }) : "让 Grok 完善设定"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
							className: "mt-2",
							disabled: locked && busy?.kind !== "personalize",
							onClick: () => openPersonalize("all"),
							children: busy?.kind === "personalize" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " 完善中"] }) : "让 Grok 个性化修改"
						})
					] }),
					mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
							busy: busy?.kind === "field",
							disabled: locked,
							onClick: () => {
								if (locked) return;
								startChat();
							},
							children: busy?.kind === "field" ? `完善中(${fieldBusyLabel})` : "确认保存"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
							className: "mt-2",
							disabled: locked && busy?.kind !== "all",
							onClick: () => void runPolish(),
							children: busy?.kind === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " 完善中"] }) : "让 Grok 完善设定"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
							className: "mt-2",
							disabled: locked && busy?.kind !== "personalize",
							onClick: () => openPersonalize("all"),
							children: busy?.kind === "personalize" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " 完善中"] }) : "让 Grok 个性化修改"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "mt-2 w-full py-2 text-[13px] text-muted",
							onClick: () => useApp.getState().cancelEdit(),
							children: "取消"
						})
					] }),
					mode === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-2 w-full py-2 text-[13px] text-muted",
						onClick: () => useApp.getState().cancelDraft(),
						children: "取消"
					})
				]
			})
		]
	});
}
function FieldBlock({ label, hint, value, placeholder, onChange, onRegen, onPersonal, busy, locked, single, titleExtra, grow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
			hint,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "grid size-8 place-items-center rounded-full hover:bg-dim disabled:opacity-40",
					onClick: onRegen,
					disabled: locked,
					title: "重新生成",
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4 text-muted" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "grid size-8 place-items-center rounded-full hover:bg-dim disabled:opacity-40",
					onClick: onPersonal,
					disabled: locked,
					title: "个性化",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-muted" })
				})]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [label, titleExtra]
			})
		}), single ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			value,
			placeholder,
			rows: grow ? 12 : 5,
			className: grow ? "min-h-[calc(1.5rem+12*1.625em)]" : "min-h-[calc(1.5rem+5*1.625em)]",
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function LookRef({ blobId, onPick, onClear }) {
	const input = (0, import_react.useRef)(null);
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!blobId) {
			setUrl(null);
			return;
		}
		let dead = false;
		imageUrl(blobId).then((u) => {
			if (!dead) setUrl(u);
		});
		return () => {
			dead = true;
		};
	}, [blobId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center gap-2 px-1",
		children: [
			url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: url,
					alt: "",
					className: "size-16 rounded-[12px] object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-card text-ink",
					"aria-label": "去掉外貌参考",
					onClick: onClear,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "grid size-9 place-items-center rounded-full border border-line text-muted",
				"aria-label": "上传外貌参考",
				onClick: () => input.current?.click(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[12px] text-muted",
				children: "外貌参考，只给聊天看"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: input,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) onPick(file);
					e.target.value = "";
				}
			})
		]
	});
}
function Extras({ extras, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3",
		children: [extras.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[13px] font-medium",
					children: ["新增", i + 1]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full border px-2 py-0.5 text-[11px] leading-none transition ${e.emphasize ? "border-primary bg-primary text-on-primary" : "border-primary bg-transparent text-primary"}`,
							onClick: () => onChange(extras.map((x) => x.id === e.id ? {
								...x,
								emphasize: !x.emphasize
							} : x)),
							children: "强调"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full border px-2 py-0.5 text-[11px] leading-none transition ${e.applyImage ? "border-primary bg-primary text-on-primary" : "border-primary bg-transparent text-primary"}`,
							onClick: () => onChange(extras.map((x) => x.id === e.id ? {
								...x,
								applyImage: !x.applyImage
							} : x)),
							children: "应用到生图"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-danger",
							onClick: () => onChange(extras.filter((x) => x.id !== e.id)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				value: e.body,
				onChange: (ev) => onChange(extras.map((x) => x.id === e.id ? {
					...x,
					body: ev.target.value
				} : x))
			})]
		}, e.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex items-center gap-1 px-2 py-2 text-[13px] text-primary",
			onClick: () => onChange([...extras, {
				id: uid("ex_"),
				body: ""
			}]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " 新增"]
		})]
	});
}
function CardSelect({ onPick }) {
	const ordered = useApp((s) => s.cards).slice().sort((a, b) => a.order - b.order);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryDrawer, {
		className: "flex-1",
		label: "角色卡选择",
		items: ordered.map((c) => ({
			id: c.id,
			name: c.name
		})),
		onApply: onPick,
		onDelete: (id) => useApp.getState().deleteCard(id),
		onReorder: (ids) => useApp.getState().reorderCards(ids)
	});
}
var HOLD_MS = 420;
function Sidebar() {
	const open = useApp((s) => s.ui.sidebar);
	const setUI = useApp((s) => s.setUI);
	const folders = useApp((s) => s.folders);
	const chats = useApp((s) => s.chats);
	const currentId = useApp((s) => s.currentId);
	const ui = useApp((s) => s.ui);
	const theme = useApp((s) => s.settings.theme);
	const { foldersSorted, root, inFolder } = listedChats(folders, chats);
	const [draftOrder, setDraftOrder] = (0, import_react.useState)(null);
	const [draggingId, setDraggingId] = (0, import_react.useState)(null);
	const listRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	const draftRef = (0, import_react.useRef)(null);
	const lastY = (0, import_react.useRef)(0);
	const rafRef = (0, import_react.useRef)(0);
	draftRef.current = draftOrder;
	const visualFolders = draftOrder ? [...foldersSorted].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id)) : foldersSorted;
	const visualRoot = draftOrder ? [...root].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id)) : root;
	const visualIn = (fid) => {
		const list = inFolder(fid);
		if (!draftOrder) return list;
		return [...list].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id));
	};
	const allOrderIds = () => [
		...foldersSorted.map((f) => f.id),
		...foldersSorted.flatMap((f) => inFolder(f.id).map((c) => c.id)),
		...root.map((c) => c.id)
	];
	(0, import_react.useEffect)(() => {
		if (!ui.sortMode) return;
		const applyY = (y) => {
			const d = dragRef.current;
			const draft = draftRef.current;
			if (!d || !draft) return;
			const rows = listRef.current?.querySelectorAll(`[data-drag-group="${d.group}"]`);
			if (!rows?.length) return;
			const groupIds = Array.from(rows).map((el) => el.dataset.rowId).filter((id) => Boolean(id));
			const from = groupIds.indexOf(d.id);
			const to = indexFromY(rows, y);
			if (from < 0 || from === to) return;
			const nextGroup = moveId(groupIds, d.id, to);
			const out = [...draft];
			const slots = groupIds.map((g) => out.indexOf(g));
			nextGroup.forEach((g, i) => {
				if (slots[i] >= 0) out[slots[i]] = g;
			});
			draftRef.current = out;
			setDraftOrder(out);
		};
		const tick = () => {
			rafRef.current = 0;
			if (!dragRef.current) return;
			const el = listRef.current;
			const dy = el ? autoScrollNearEdge(el, lastY.current) : 0;
			applyY(lastY.current);
			if (dy) rafRef.current = requestAnimationFrame(tick);
		};
		const onMove = (e) => {
			if (!dragRef.current) return;
			e.preventDefault();
			lastY.current = e.clientY;
			const el = listRef.current;
			const dy = el ? autoScrollNearEdge(el, e.clientY) : 0;
			applyY(e.clientY);
			if (dy && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
		};
		const onUp = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = 0;
			if (listRef.current) listRef.current.style.touchAction = "";
			if (!dragRef.current) return;
			dragRef.current = null;
			setDraggingId(null);
		};
		const onTouchMove = (e) => {
			if (!dragRef.current) return;
			e.preventDefault();
		};
		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("touchmove", onTouchMove);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [ui.sortMode]);
	const beginDrag = (e, id, group) => {
		e.preventDefault();
		e.stopPropagation();
		dragRef.current = {
			id,
			group
		};
		setDraggingId(id);
		lastY.current = e.clientY;
		if (listRef.current) listRef.current.style.touchAction = "none";
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	};
	const beginSort = () => {
		setDraftOrder(allOrderIds());
		setUI({ sortMode: true });
	};
	const exitSidebar = () => {
		setDraftOrder(null);
		setUI({
			sidebar: false,
			selectMode: false,
			selected: [],
			sortMode: false,
			menuId: null
		});
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-40 flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "relative flex h-full w-[86%] max-w-[360px] flex-col bg-bg shadow-[8px_0_32px_rgb(44_40_36/0.12)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "px-4 pb-2 pt-[calc(env(safe-area-inset-top)+14px)]",
					children: [ui.sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-[15px] font-medium text-primary",
							onClick: () => {
								setDraftOrder(null);
								setUI({ sortMode: false });
							},
							children: "取消"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-[15px] font-medium text-primary",
							onClick: () => {
								useApp.getState().reorder(draftOrder ?? allOrderIds());
								setDraftOrder(null);
								setUI({ sortMode: false });
							},
							children: "完成"
						})]
					}) : ui.selectMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "shrink-0 text-[15px] font-medium text-primary",
								onClick: () => {
									const ids = [...folders.map((f) => f.id), ...chats.filter((c) => !c.isDraft).map((c) => c.id)];
									setUI({ selected: ids });
								},
								children: "全选"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 px-2 text-center text-[14px] text-muted",
								children: [
									"已选择 ",
									ui.selected.length,
									" 项"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "shrink-0 px-2 text-[15px] font-medium text-primary",
								onClick: () => setUI({
									selectMode: false,
									selected: [],
									sortMode: false
								}),
								children: "取消"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								className: "-mr-2",
								onClick: exitSidebar,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 text-left text-[13px] text-muted",
						onClick: beginSort,
						children: "手动排序"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-[22px] tracking-wide",
							children: "绘语"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[12px] text-muted",
							children: "角色与故事"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								className: "text-muted",
								onClick: () => useApp.getState().setSettings({ theme: theme === "dark" ? "light" : "dark" }),
								"aria-label": "切换主题",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								onClick: exitSidebar,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						})]
					}), ui.sortMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[12px] leading-relaxed text-muted",
						children: "文件夹在上、聊天在下。不按横杠时可滑动，拖到边缘会跟着滚。"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: listRef,
					className: cn("flex-1 overflow-y-auto px-4 scroll-thin hold-none", ui.selectMode && !ui.sortMode ? "pb-36" : "pb-6"),
					children: [
						!ui.sortMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-on-primary disabled:opacity-40",
							disabled: ui.selectMode,
							onClick: () => useApp.getState().newDraft(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " 新建聊天"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card text-[14px] disabled:opacity-40",
							disabled: ui.selectMode,
							onClick: () => useApp.getState().addFolder(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-4" }), " 创建文件夹"]
						})] }),
						visualFolders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderRow, {
							id: f.id,
							name: f.name,
							starred: f.starred,
							collapsed: f.collapsed,
							count: inFolder(f.id).length,
							dragging: draggingId === f.id,
							dragGroup: "folders",
							onGripDown: (e) => beginDrag(e, f.id, "folders"),
							children: !f.collapsed && visualIn(f.id).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatRow, {
								id: c.id,
								nested: true,
								active: c.id === currentId,
								dragging: draggingId === c.id,
								dragGroup: `folder:${f.id}`,
								onGripDown: (e) => beginDrag(e, c.id, `folder:${f.id}`)
							}, c.id))
						}, f.id)),
						visualRoot.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatRow, {
							id: c.id,
							active: c.id === currentId,
							dragging: draggingId === c.id,
							dragGroup: "root",
							onGripDown: (e) => beginDrag(e, c.id, "root")
						}, c.id))
					]
				}),
				ui.selectMode && !ui.sortMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 border-t border-line bg-bg px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]",
					children: [ui.selected.filter((id) => chats.some((c) => c.id === id && !c.isDraft)).length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mx-3 mb-2 w-[calc(100%-1.5rem)] rounded-full border border-line bg-card py-2.5 text-[13px] font-medium",
						onClick: () => setUI({ multiCreate: ui.selected.filter((id) => chats.some((c) => c.id === id && !c.isDraft)) }),
						children: "创建多人聊天"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-around",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelAct, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderInput, { className: "size-5" }),
								label: "移动",
								onClick: () => setUI({ moveOpen: true })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelAct, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-5" }),
								label: "复制",
								onClick: () => useApp.getState().copySelected()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelAct, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" }),
								label: "删除",
								danger: true,
								onClick: () => setUI({ confirm: {
									title: "删除所选",
									body: "聊天记录会一起删掉。",
									danger: true,
									onOk: () => useApp.getState().deleteSelected()
								} })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelAct, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-5" }),
								label: "星标",
								onClick: () => useApp.getState().starSelected()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelAct, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5" }),
								label: "重命名",
								disabled: ui.selected.length !== 1,
								onClick: () => {
									const id = ui.selected[0];
									const chat = chats.find((c) => c.id === id);
									const folder = folders.find((f) => f.id === id);
									setUI({ rename: {
										id,
										kind: folder ? "folder" : "chat",
										value: chat?.name || folder?.name || ""
									} });
								}
							})
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "flex-1 bg-overlay/40",
			onClick: exitSidebar
		})]
	});
}
function SelAct({ icon, label, onClick, danger, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled,
		onClick,
		className: cn("flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[11px] font-medium disabled:opacity-30", danger ? "text-danger" : "text-ink"),
		children: [icon, label]
	});
}
function useHold(id) {
	const timer = (0, import_react.useRef)(null);
	const startY = (0, import_react.useRef)(0);
	const held = (0, import_react.useRef)(false);
	const start = (e) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		startY.current = e.clientY;
		held.current = false;
		timer.current = window.setTimeout(() => {
			const ui = useApp.getState().ui;
			if (ui.sortMode || ui.selectMode) return;
			held.current = true;
			useApp.getState().setUI({
				selectMode: true,
				selected: [id],
				menuId: null
			});
		}, HOLD_MS);
	};
	const clear = () => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = null;
	};
	return {
		held,
		onPointerDown: start,
		onPointerUp: clear,
		onPointerCancel: clear,
		onPointerMove: (e) => {
			if (Math.abs(e.clientY - startY.current) > 12) clear();
		},
		onContextMenu: (e) => e.preventDefault()
	};
}
function FolderRow({ id, name, starred, collapsed, count, children, dragging, dragGroup, onGripDown }) {
	const selected = useApp((s) => s.ui.selected.includes(id));
	const selectMode = useApp((s) => s.ui.selectMode);
	const sortMode = useApp((s) => s.ui.sortMode);
	const { held, ...holdH } = useHold(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-row-id": id,
			"data-drag-group": dragGroup,
			...sortMode ? {} : holdH,
			onClick: () => {
				if (held.current) {
					held.current = false;
					return;
				}
				if (sortMode) return;
				if (useApp.getState().ui.selectMode) {
					const cur = useApp.getState().ui.selected;
					useApp.getState().setUI({ selected: selected ? cur.filter((x) => x !== id) : [...cur, id] });
					return;
				}
				useApp.getState().toggleFolder(id);
			},
			className: cn("flex items-center gap-3 rounded-[18px] px-2 py-2.5 hold-none", selected && "bg-dim", dragging && "drag-dim"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-10 items-center justify-center rounded-full border border-line text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-1 text-[15px] font-medium",
						children: [starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate",
							children: name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] text-muted",
						children: [count, " 项"]
					})]
				}),
				selectMode && !sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 shrink-0 place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckBox, { on: selected })
				}) : sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 place-items-center text-muted",
					onPointerDown: onGripDown,
					style: { touchAction: "none" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlignJustify, { className: "size-5" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "›"
				})
			]
		}), children]
	});
}
function ChatRow({ id, active, nested, dragging, dragGroup, onGripDown }) {
	const chat = useApp((s) => s.chats.find((c) => c.id === id));
	const ui = useApp((s) => s.ui);
	const { held, ...holdH } = useHold(id);
	if (!chat) return null;
	const selected = ui.selected.includes(id);
	const lastMsg = [...chat.messages].reverse().find((m) => m.content);
	const last = chat.remark || (lastMsg && lastMsg.role !== "user" ? replyStoryText(lastMsg.content) || lastMsg.content : lastMsg?.content) || chat.opening;
	const menu = ui.menuId === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative mb-0.5", nested && "ml-3"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-row-id": id,
			"data-drag-group": dragGroup,
			...ui.sortMode ? {} : holdH,
			onClick: () => {
				if (held.current) {
					held.current = false;
					return;
				}
				if (ui.sortMode) return;
				if (useApp.getState().ui.selectMode) {
					const cur = useApp.getState().ui.selected;
					useApp.getState().setUI({ selected: selected ? cur.filter((x) => x !== id) : [...cur, id] });
					return;
				}
				useApp.getState().openChat(id);
			},
			className: cn("flex items-center gap-3 rounded-[18px] px-2 py-2 hold-none", active && !ui.selectMode && "bg-dim/70", selected && "bg-dim", dragging && "drag-dim"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatAvatar, {
					chat,
					dim: active && !ui.selectMode
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-1 text-[15px] font-medium",
						children: [chat.starred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 shrink-0 fill-primary text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate",
							children: chat.name || "未命名"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[12px] text-muted",
						children: last || "新的对话"
					})]
				}),
				ui.selectMode && !ui.sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 shrink-0 place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckBox, { on: selected })
				}) : ui.sortMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 place-items-center text-muted",
					onPointerDown: onGripDown,
					style: { touchAction: "none" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlignJustify, { className: "size-5" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "grid size-9 place-items-center text-muted",
					onClick: (e) => {
						e.stopPropagation();
						useApp.getState().setUI({ menuId: menu ? null : id });
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
				})
			]
		}), menu && !ui.selectMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-2 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-line bg-card py-1 shadow-lg",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "block w-full px-4 py-2.5 text-left text-[14px]",
					onClick: () => {
						useApp.getState().setUI({
							menuId: null,
							rename: {
								id,
								kind: "remark",
								value: chat.remark || ""
							}
						});
					},
					children: "修改备注"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "block w-full px-4 py-2.5 text-left text-[14px]",
					onClick: () => {
						useApp.getState().setUI({
							menuId: null,
							sidebar: false
						});
						useApp.getState().beginEdit(id);
					},
					children: "修改设定"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "block w-full px-4 py-2.5 text-left text-[14px] text-danger",
					onClick: () => {
						useApp.getState().setUI({
							menuId: null,
							confirm: {
								title: "删除角色",
								body: `删除「${chat.name}」以及全部聊天记录？`,
								danger: true,
								onOk: () => {
									useApp.getState().setUI({ selected: [id] });
									useApp.getState().deleteSelected();
								}
							}
						});
					},
					children: "删除角色"
				})
			]
		})]
	});
}
function CheckBox({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid size-[22px] shrink-0 place-items-center rounded-full border", on ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-card"),
		children: on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3.5",
			strokeWidth: 3
		})
	});
}
function RenameModal() {
	const rename = useApp((s) => s.ui.rename);
	const setUI = useApp((s) => s.setUI);
	const [val, setVal] = (0, import_react.useState)(rename?.value ?? "");
	(0, import_react.useEffect)(() => setVal(rename?.value ?? ""), [rename?.id, rename?.value]);
	if (!rename) return null;
	const title = rename.kind === "folder" ? "重命名文件夹" : rename.kind === "remark" ? "修改备注" : "修改名称";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[75] flex items-center justify-center bg-overlay p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[24px] bg-bg p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-[16px] font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: val,
					onChange: (e) => setVal(e.target.value),
					className: "h-12 w-full rounded-full border border-line bg-card px-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex-1 py-3 text-muted",
						onClick: () => setUI({ rename: null }),
						children: "取消"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex-1 rounded-full bg-primary py-3 text-on-primary",
						onClick: () => {
							if (rename.kind === "remark") {
								useApp.getState().patchChat(rename.id, { remark: val });
								useApp.getState().toast("备注已更新");
								setUI({ rename: null });
							} else useApp.getState().renameItem(rename.id, val);
						},
						children: "保存"
					})]
				})
			]
		})
	});
}
function App() {
	const hydrate = useApp((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
		loadTags();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
}
function Shell() {
	const tab = useApp((s) => s.ui.tab);
	const creating = useApp((s) => s.ui.creating);
	const editing = useApp((s) => s.ui.editingChatId);
	const currentId = useApp((s) => s.currentId);
	const chat = useApp((s) => s.chats.find((c) => c.id === currentId));
	const editChat = useApp((s) => s.chats.find((c) => c.id === editing));
	const draft = useApp((s) => s.chats.find((c) => c.isDraft && c.id === currentId));
	const theme = useApp((s) => s.settings.theme);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", theme === "dark" ? "#1a1714" : "#F3EEE6");
	}, [theme]);
	let body;
	if (tab === "pure") body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurePane, {});
	else if (creating && draft) body = tab === "params" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamsPane, { chat: draft }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleEditor, {
		chat: draft,
		mode: "create"
	});
	else if (editing && editChat && tab === "chat") body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleEditor, {
		chat: editChat,
		mode: "edit"
	});
	else if (tab === "params") body = chat && !chat.isDraft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamsPane, { chat }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyParams, {});
	else if (chat && !chat.isDraft) body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPane, { chat });
	else body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChat, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex h-full max-w-lg flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center gap-1 px-2 pt-[calc(env(safe-area-inset-top)+8px)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						onClick: () => useApp.getState().setUI({ sidebar: true }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-1 justify-center gap-7 text-[15px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								id: "chat",
								label: "聊天"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								id: "params",
								label: "生图参数"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
								id: "pure",
								label: "纯生图"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						onClick: () => useApp.getState().setUI({ connection: true }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative min-h-0 flex-1 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full",
						children: body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionPanel, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastHost, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmHost, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenameModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomPromptModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveCardModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveAppearModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldEditModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiCreateModal, {})
		]
	});
}
function TabBtn({ id, label }) {
	const on = useApp((s) => s.ui.tab) === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => useApp.getState().setTab(id),
		className: `relative pb-2 ${on ? "font-semibold text-ink" : "text-muted"}`,
		children: [label, on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-ink" })]
	});
}
function EmptyParams() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-6 py-16 text-center text-[13px] text-muted",
		children: "先在侧栏新建一个角色，才能设置聊天配图参数。"
	});
}
function EmptyChat() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center px-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-serif text-2xl",
				children: "还没有开始"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xs text-[13px] leading-6 text-muted",
				children: "点左上角打开侧栏，新建一个角色就能聊。配图会跟着每句回复出来。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-6 rounded-full bg-primary px-6 py-3 text-[14px] text-on-primary",
				onClick: () => useApp.getState().newDraft(),
				children: "新建聊天"
			})
		] })
	});
}
function SaveCardModal() {
	const open = useApp((s) => s.ui.saveCardOpen);
	const chat = useApp((s) => s.current());
	const [name, setName] = (0, import_react.useState)(chat?.name ?? "");
	(0, import_react.useEffect)(() => setName(chat?.name ?? ""), [chat?.name, open]);
	if (!open || !chat) return null;
	const close = () => useApp.getState().setUI({ saveCardOpen: false });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: close,
		title: "保存为角色卡",
		hideClose: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value: name,
			onChange: (e) => setName(e.target.value),
			placeholder: "输入名称",
			autoFocus: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: close,
				children: "取消"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
				onClick: () => useApp.getState().saveCard(chat, name.trim() || chat.name || "未命名"),
				children: "保存"
			})]
		})]
	});
}
function SaveAppearModal() {
	const ui = useApp((s) => s.ui);
	const tab = useApp((s) => s.ui.tab);
	const chat = useApp((s) => s.current());
	const pure = useApp((s) => s.pureParams);
	const [name, setName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => setName(""), [ui.saveAppearOpen]);
	if (!ui.saveAppearOpen) return null;
	const close = () => useApp.getState().setUI({ saveAppearOpen: false });
	const prompt = tab === "pure" ? ui.appearTarget && ui.appearTarget !== "mid" ? pure.characters.find((c) => c.id === ui.appearTarget)?.prompt ?? "" : pure.promptMid : ui.appearTarget && ui.appearTarget !== "mid" ? chat?.imageParams.characters.find((c) => c.id === ui.appearTarget)?.prompt ?? "" : chat?.imageParams.promptMid ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: close,
		title: "保存角色",
		hideClose: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value: name,
			onChange: (e) => setName(e.target.value),
			placeholder: "输入名称",
			autoFocus: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: close,
				children: "取消"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
				disabled: !name.trim(),
				onClick: () => useApp.getState().saveAppearance(name.trim(), prompt),
				children: "保存"
			})]
		})]
	});
}
function FieldEditModal() {
	const field = useApp((s) => s.ui.fieldEdit);
	const [text, setText] = (0, import_react.useState)(field?.text ?? "");
	(0, import_react.useEffect)(() => setText(field?.text ?? ""), [
		field?.text,
		field?.key,
		field?.charId
	]);
	if (!field) return null;
	const isAll = field.key === "all";
	const label = isAll ? "整张卡" : FIELD_LABELS[field.key] || field.key;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: () => useApp.getState().setUI({ fieldEdit: null }),
		title: isAll ? "个性化修改整张卡" : `个性化修改 · ${label}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			value: text,
			placeholder: "写下你的要求",
			onChange: (e) => setText(e.target.value)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
			className: "mt-4",
			onClick: () => {
				const t = text.trim();
				if (!t) {
					useApp.getState().toast("写一点要求");
					return;
				}
				const live = useApp.getState().current();
				if (!live) return;
				useApp.getState().setUI({
					fieldEdit: null,
					polishJob: {
						chatId: live.id,
						kind: isAll ? "personalize" : "field",
						key: isAll ? void 0 : field.key,
						charId: field.charId,
						instruction: t
					}
				});
			},
			children: isAll ? "按这个改" : "改这一栏"
		})]
	});
}
function MoveModal() {
	const open = useApp((s) => s.ui.moveOpen);
	const folders = useApp((s) => s.folders);
	const chats = useApp((s) => s.chats);
	if (!open) return null;
	const { foldersSorted } = listedChats(folders, chats);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: () => useApp.getState().setUI({ moveOpen: false }),
		title: "移动到",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "mb-2 w-full rounded-2xl bg-card px-4 py-3 text-left",
			onClick: () => useApp.getState().moveSelected(null),
			children: "不放进文件夹"
		}), foldersSorted.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "mb-2 w-full rounded-2xl bg-card px-4 py-3 text-left",
			onClick: () => useApp.getState().moveSelected(f.id),
			children: f.name
		}, f.id))]
	});
}
function MultiCreateModal() {
	const ids = useApp((s) => s.ui.multiCreate);
	const chats = useApp((s) => s.chats);
	const [mode, setMode] = (0, import_react.useState)("together");
	const [overview, setOverview] = (0, import_react.useState)("");
	const [opening, setOpening] = (0, import_react.useState)("");
	if (!ids || ids.length < 2) return null;
	const picked = ids.map((id) => chats.find((c) => c.id === id)).filter(Boolean);
	const makeDraft = () => {
		const id = uid("chat_");
		const characters = picked.map((c, i) => {
			return {
				...c.characters[0] ?? emptyCharacter(i + 1),
				id: uid("c_")
			};
		});
		const imageParams = defaultImageParams();
		imageParams.characters = characters.map((c) => ({
			id: c.id,
			name: c.name,
			enabled: true,
			prompt: c.appearance || c.prompt,
			uc: c.uc,
			x: .5,
			y: .5
		}));
		return {
			id,
			folderId: null,
			name: characters.map((c) => c.name).filter(Boolean).join("、"),
			remark: "",
			starred: false,
			order: Date.now(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isDraft: true,
			grokModelId: useApp.getState().settings.grokModelId,
			isMulti: true,
			multiMode: mode,
			promptMode: "insert",
			adultBoost: false,
			canGen: true,
			statusBarOn: false,
			statusBar: DEFAULT_STATUS_BAR,
			overview,
			opening,
			extras: [],
			memory: "",
			memoryUntil: 0,
			memoryFoldAt: 0,
			memorySnaps: [],
			characters,
			imageParams,
			messages: [],
			scrollTop: 0
		};
	};
	const pushDraft = (draft) => {
		useApp.setState((s) => ({
			chats: [...s.chats, draft],
			currentId: draft.id,
			ui: {
				...s.ui,
				multiCreate: null,
				creating: true,
				sidebar: false,
				selectMode: false,
				selected: [],
				tab: "chat",
				autoPolish: false
			}
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open: true,
		onClose: () => useApp.getState().setUI({ multiCreate: null }),
		title: "请设置多人聊天",
		wide: true,
		children: [
			picked.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 text-[13px]",
				children: [
					"角色",
					i + 1,
					"：",
					c.name
				]
			}, c.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-3 text-[13px] font-medium",
				children: "要求总览"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				value: overview,
				onChange: (e) => setOverview(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 mt-3 text-[13px] font-medium",
				children: "开场场景"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				value: opening,
				onChange: (e) => setOpening(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `flex-1 rounded-full py-2 text-[13px] ${mode === "together" ? "bg-primary text-on-primary" : "border border-line"}`,
					onClick: () => setMode("together"),
					children: "多人同聊模式"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `flex-1 rounded-full py-2 text-[13px] ${mode === "group" ? "bg-primary text-on-primary" : "border border-line"}`,
					onClick: () => setMode("group"),
					children: "群聊模式"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, {
				onClick: () => {
					const draft = makeDraft();
					useApp.setState((s) => ({
						chats: [...s.chats, draft],
						currentId: draft.id,
						ui: {
							...s.ui,
							multiCreate: null,
							creating: true,
							sidebar: false,
							selectMode: false,
							selected: [],
							tab: "chat",
							autoPolish: true
						}
					}));
				},
				children: "让 Grok 完善设定"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				className: "mt-2",
				onClick: async () => {
					const draft = makeDraft();
					pushDraft(draft);
					useApp.getState().commitChat(draft.id);
					const { sendOpening } = await import("./chat-actions-BzFvtzjH.mjs");
					sendOpening(draft.id);
				},
				children: "跳过，开始聊天"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-[100dvh] overflow-hidden bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {})
	});
}
//#endregion
export { imageUrl as A, putImage as B, defaultSettings as C, idb_exports as D, getImage as E, moveId as F, samplerPatch as G, rememberUrl as H, nearestScroller as I, uid as J, snapshotLlmAccount as K, parseChatCompletionPreset as L, indexFromY as M, llmIdentity as N, imageAiLabel as O, loadAll as P, presetStyle as R, db as S, downloadBlob as T, resolveImageWrite as U, randomSeed as V, restoreSampler as W, uniquePresetName as X, uniqueNumberedName as Y, applyLlmPick as _, cancelMemory as a, chatPickerModels as b, regenMessage as c, Home as component, sendOpening as d, sendUser as f, applyImageAiPick as g, activePreset as h, cancelImage as i, imageWriteFields as j, imagePickerModels as k, retryMemory as l, FOLLOW_IMAGE_AI as m, attachImage as n, editMessage as o, routes_CMbMyqb9_exports as p, sortHistoryNewestFirst as q, branchFrom as r, invalidateMemory as s, abortChat as t, runManualMemory as u, autoScrollNearEdge as v, deleteImage as w, cn as x, cachedUrl as y, pruneStarred as z };
