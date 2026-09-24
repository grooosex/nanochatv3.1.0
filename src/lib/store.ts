import { create } from "zustand";
import {
  DEFAULT_GROK,
  DEFAULT_STATUS_BAR,
  defaultImageParams,
  defaultPureParams,
  emptyCharacter,
  migrateGrokId,
  normalizePureParams,
} from "./constants";
import { db, defaultSettings, deleteImage, loadAll, putImage, rememberUrl } from "./idb";
import { cloneChat } from "./archive";
import { syncCharsFromRole } from "./nai";
import type {
  AppearancePreset,
  CharacterCard,
  Chat,
  FavoriteItem,
  Folder,
  GrokModelId,
  HistoryItem,
  ImageParams,
  Settings,
  TabId,
} from "./types";
import { normalizeChatMemory } from "./chat-memory";
import { uid, sortHistoryNewestFirst } from "./utils";
import { migrateFavorite, presetNameFrom } from "./presets";
import { settleStuckImages } from "./image-status";

type Toast = { id: number; text: string };

interface UI {
  tab: TabId;
  sidebar: boolean;
  connection: boolean;
  selectMode: boolean;
  selected: string[];
  sortMode: boolean;
  menuId: string | null;
  editingChatId: string | null;
  creating: boolean;
  previewParams: boolean;
  saveCardOpen: boolean;
  saveAppearOpen: boolean;
  appearTarget: "mid" | string | null;
  customPrompt: { chatId: string; msgId: string; imgId: string; text: string; charTails?: Record<string, string> } | null;
  confirm: { title: string; body: string; danger?: boolean; onOk: () => void } | null;
  rename: { id: string; kind: "chat" | "folder" | "card" | "remark"; value: string } | null;
  moveOpen: boolean;
  multiCreate: string[] | null;
  personalize: { mode: "create" | "edit"; text: string } | null;
  fieldEdit: { key: string; charId?: string; text: string } | null;
  polishJob: {
    chatId: string;
    kind: "personalize" | "field";
    key?: string;
    charId?: string;
    instruction: string;
  } | null;
  extraPromptOpen: boolean;
  autoPolish: boolean;
  paramsJump: string | null;
  llmSettings: boolean;
  memoryHint: { chatId: string; state: "generating" | "ok" | "fail"; error?: string; draft?: string } | null;
  editUserMsg: { chatId: string; msgId: string; backup: string } | null;
}

interface State {
  ready: boolean;
  settings: Settings;
  folders: Folder[];
  chats: Chat[];
  cards: CharacterCard[];
  appearances: AppearancePreset[];
  favorites: FavoriteItem[];
  history: HistoryItem[];
  pureParams: ImageParams;
  currentId: string | null;
  editBackup: Chat | null;
  toasts: Toast[];
  ui: UI;
  composerDrafts: Record<string, string>;
  hydrate: () => Promise<void>;
  toast: (text: string) => void;
  setUI: (p: Partial<UI>) => void;
  setSettings: (p: Partial<Settings>) => void;
  setGrok: (id: GrokModelId) => void;
  clearImageAi: () => void;
  setTab: (t: TabId) => void;
  current: () => Chat | undefined;
  patchChat: (id: string, p: Partial<Chat> | ((c: Chat) => Chat)) => void;
  patchParams: (id: string, p: Partial<ImageParams>) => void;
  setPureParams: (p: Partial<ImageParams>) => void;
  newDraft: () => void;
  cancelDraft: () => void;
  commitChat: (id: string) => void;
  openChat: (id: string, opts?: { edit?: boolean }) => void;
  beginEdit: (id: string) => void;
  cancelEdit: () => void;
  addFolder: () => void;
  toggleFolder: (id: string) => void;
  deleteSelected: () => void;
  starSelected: () => void;
  moveSelected: (folderId: string | null) => void;
  copySelected: () => void;
  renameItem: (id: string, name: string) => void;
  reorder: (ids: string[]) => void;
  saveCard: (chat: Chat, name: string) => void;
  applyCard: (chatId: string, card: CharacterCard, charIndex?: number) => void;
  deleteCard: (id: string) => void;
  reorderCards: (ids: string[]) => void;
  saveAppearance: (name: string, prompt: string) => void;
  applyAppearance: (chatId: string, preset: AppearancePreset, target: "mid" | string) => void;
  deleteAppearance: (id: string) => void;
  reorderAppearances: (ids: string[]) => void;
  addFavorite: (blobId?: string) => void;
  patchFavorite: (id: string, p: Partial<FavoriteItem>) => void;
  deleteFavorite: (id: string) => void;
  setFavoriteThumb: (id: string, blobId: string) => void;
  addHistory: (h: HistoryItem) => void;
  patchHistory: (id: string, p: Partial<HistoryItem>) => void;
  deleteHistory: (id: string) => void;
  setCooldown: (until: number) => void;
  setComposerDraft: (chatId: string, text: string) => void;
}

const ui0 = (): UI => ({
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
  editUserMsg: null,
});

function persistChat(c: Chat) {
  if (c.isDraft) return;
  void db.chats.put(c);
}

let toastN = 1;

export const useApp = create<State>((set, get) => ({
  ready: true,
  settings: defaultSettings(),
  folders: [],
  chats: [],
  cards: [],
  appearances: [],
  favorites: [],
  history: [],
  pureParams: defaultPureParams(),
  currentId: null,
  editBackup: null,
  toasts: [],
  ui: ui0(),
  composerDrafts: {},

  hydrate: async () => {
    const data = await loadAll();
    const [pureRow, currentRow, draftsRow] = await Promise.all([
      db.kv.get("pureParams"),
      db.kv.get("currentId"),
      db.kv.get("composerDrafts"),
    ]);
    const live = data.chats.filter((c) => !c.isDraft).map((c) => {
      const mapped = {
        ...normalizeChatMemory(c),
        grokModelId: migrateGrokId(c.grokModelId),
        imageModelId: c.imageModelId || null,
        imageModelPin: c.imageModelPin || null,
      };
      const next = settleStuckImages(mapped);
      if (next !== mapped) persistChat(next);
      return next;
    });
    const settings = {
      ...data.settings,
      grokModelId: migrateGrokId(data.settings.grokModelId),
      theme: data.settings.theme === "dark" ? ("dark" as const) : ("light" as const),
      llmParams: data.settings.llmParams,
      chatSource: data.settings.chatSource === "api" && data.settings.llmConnected ? ("api" as const) : ("grok" as const),
    };
    const savedId = (currentRow?.value as string) || null;
    const currentId = live.some((c) => c.id === savedId)
      ? savedId
      : live.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null;
    const lifted = liftImageAi(settings, live, currentId);
    const nextSettings = { ...settings, ...lifted };
    if (!settings.imageModelId && !settings.imageModelPin && (lifted.imageModelId || lifted.imageModelPin)) {
      void db.kv.put({ key: "settings", value: nextSettings });
    }
    set({
      ready: true,
      ...data,
      settings: nextSettings,
      chats: live,
      favorites: sortHistoryNewestFirst((data.favorites ?? []).map(migrateFavorite).filter(Boolean) as FavoriteItem[]),
      pureParams: normalizePureParams((pureRow?.value as ImageParams) ?? defaultPureParams()),
      currentId,
      history: sortHistoryNewestFirst(data.history ?? []),
      composerDrafts: parseComposerDrafts(draftsRow?.value),
    });
  },

  toast: (text) => {
    const id = toastN++;
    set((s) => ({ toasts: [...s.toasts, { id, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 1100);
  },

  setUI: (p) => set((s) => ({ ui: { ...s.ui, ...p } })),
  setTab: (tab) => set((s) => ({ ui: { ...s.ui, tab } })),

  setSettings: (p) => {
    const settings = { ...get().settings, ...p };
    set({ settings });
    void db.kv.put({ key: "settings", value: settings });
  },

  setGrok: (id) => {
    get().setSettings({ grokModelId: id });
    const cur = get().current();
    if (cur) get().patchChat(cur.id, { grokModelId: id });
  },

  clearImageAi: () => {
    get().setSettings({ imageModelId: null, imageModelPin: null });
  },

  current: () => get().chats.find((c) => c.id === get().currentId),

  patchChat: (id, p) => {
    set((s) => ({
      chats: s.chats.map((c) => {
        if (c.id !== id) return c;
        const next = typeof p === "function" ? p(c) : { ...c, ...p, updatedAt: Date.now() };
        persistChat(next);
        return next;
      }),
    }));
  },

  patchParams: (id, p) => {
    if (id === "__pure__") {
      get().setPureParams(p);
      return;
    }
    get().patchChat(id, (c) => ({ ...c, imageParams: { ...c.imageParams, ...p }, updatedAt: Date.now() }));
  },

  setPureParams: (p) => {
    const pureParams = { ...get().pureParams, ...p };
    set({ pureParams });
    void db.kv.put({ key: "pureParams", value: pureParams });
  },

  newDraft: () => {
    const id = uid("chat_");
    const grok = get().settings.grokModelId || DEFAULT_GROK;
    const draft: Chat = {
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
      scrollTop: 0,
    };
    set((s) => ({
      chats: [...s.chats, draft],
      currentId: id,
      ui: { ...s.ui, creating: true, editingChatId: null, sidebar: false, tab: "chat", menuId: null },
    }));
  },

  cancelDraft: () => {
    set((s) => {
      const rest = s.chats.filter((c) => !c.isDraft);
      return {
        chats: rest,
        currentId: rest.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null,
        ui: { ...s.ui, creating: false, editingChatId: null },
      };
    });
  },

  commitChat: (id) => {
    const c = get().chats.find((x) => x.id === id);
    if (!c) return;
    const name = c.characters.map((ch) => ch.name).filter(Boolean).join("、") || c.name || "未命名";
    const appearance = c.characters[0]?.appearance || "";
    const imageParams = syncCharsFromRole(c.imageParams, c.characters, c.isMulti);
    if (!c.isMulti && !imageParams.promptMid.trim() && appearance) {
      imageParams.promptMid = appearance;
    }
    const next: Chat = {
      ...c,
      name,
      isDraft: false,
      imageParams,
      updatedAt: Date.now(),
    };
    persistChat(next);
    void db.kv.put({ key: "currentId", value: id });
    set((s) => ({
      chats: s.chats.map((x) => (x.id === id ? next : x)),
      currentId: id,
      ui: { ...s.ui, creating: false, editingChatId: null, tab: "chat" },
    }));
  },

  openChat: (id, opts) => {
    void db.kv.put({ key: "currentId", value: id });
    set((s) => ({
      currentId: id,
      ui: {
        ...s.ui,
        sidebar: false,
        creating: false,
        editingChatId: opts?.edit ? id : null,
        tab: "chat",
        menuId: null,
      },
    }));
  },

  beginEdit: (id) => {
    const c = get().chats.find((x) => x.id === id);
    set({
      editBackup: c ? structuredClone(c) : null,
      currentId: id,
      ui: { ...get().ui, editingChatId: id, creating: false, sidebar: false, tab: "chat", menuId: null },
    });
  },

  cancelEdit: () => {
    const bak = get().editBackup;
    if (bak) {
      persistChat(bak);
      set((s) => ({
        chats: s.chats.map((c) => (c.id === bak.id ? bak : c)),
        editBackup: null,
        ui: { ...s.ui, editingChatId: null },
      }));
    } else {
      set((s) => ({ ui: { ...s.ui, editingChatId: null }, editBackup: null }));
    }
  },

  addFolder: () => {
    const f: Folder = {
      id: uid("fold_"),
      name: "新建文件夹",
      starred: false,
      collapsed: false,
      order: Date.now(),
      createdAt: Date.now(),
    };
    void db.folders.put(f);
    set((s) => ({ folders: [...s.folders, f] }));
    get().toast("已创建文件夹");
  },

  toggleFolder: (id) => {
    set((s) => {
      const folders = s.folders.map((f) => (f.id === id ? { ...f, collapsed: !f.collapsed } : f));
      const f = folders.find((x) => x.id === id);
      if (f) void db.folders.put(f);
      return { folders };
    });
  },

  deleteSelected: () => {
    const ids = new Set(get().ui.selected);
    const chats = get().chats.filter((c) => !ids.has(c.id));
    const folders = get().folders.filter((f) => !ids.has(f.id));
    const moved = chats.map((c) => (c.folderId && ids.has(c.folderId) ? { ...c, folderId: null } : c));
    void db.chats.bulkPut(moved.filter((c) => !c.isDraft));
    void db.chats.bulkDelete([...ids]);
    void db.folders.bulkDelete([...ids]);
    set((s) => {
      const composerDrafts = dropDrafts(s.composerDrafts, ids);
      void db.kv.put({ key: "composerDrafts", value: composerDrafts });
      return {
        chats: moved,
        folders,
        currentId: ids.has(s.currentId || "") ? moved[0]?.id ?? null : s.currentId,
        composerDrafts,
        ui: { ...s.ui, selectMode: false, selected: [], sortMode: false, menuId: null },
      };
    });
    get().toast("已删除");
  },

  starSelected: () => {
    const ids = new Set(get().ui.selected);
    const turningOn = get().chats.some((c) => ids.has(c.id) && !c.starred) || get().folders.some((f) => ids.has(f.id) && !f.starred);
    set((s) => {
      const chats = s.chats.map((c) => {
        if (!ids.has(c.id)) return c;
        const next = { ...c, starred: !c.starred, updatedAt: Date.now() };
        persistChat(next);
        return next;
      });
      const folders = s.folders.map((f) => {
        if (!ids.has(f.id)) return f;
        const next = { ...f, starred: !f.starred };
        void db.folders.put(next);
        return next;
      });
      return { chats, folders, ui: { ...s.ui, selectMode: false, selected: [] } };
    });
    get().toast(turningOn ? "已星标并置顶" : "已取消星标");
  },

  moveSelected: (folderId) => {
    const ids = new Set(get().ui.selected);
    set((s) => {
      const chats = s.chats.map((c) => {
        if (!ids.has(c.id)) return c;
        const next = { ...c, folderId, updatedAt: Date.now() };
        persistChat(next);
        return next;
      });
      return { chats, ui: { ...s.ui, selectMode: false, selected: [], moveOpen: false } };
    });
    get().toast("已移动");
  },

  copySelected: () => {
    const ids = get().ui.selected;
    const extras: Chat[] = [];
    for (const id of ids) {
      const c = get().chats.find((x) => x.id === id);
      if (!c) continue;
      const copy = cloneChat(c);
      extras.push(copy);
      persistChat(copy);
    }
    set((s) => ({
      chats: [...s.chats, ...extras],
      ui: { ...s.ui, selectMode: false, selected: [] },
    }));
    get().toast(extras.length === 1 ? `已复制「${extras[0].name}」` : "已复制");
  },

  renameItem: (id, name) => {
    set((s) => {
      const chats = s.chats.map((c) => {
        if (c.id !== id) return c;
        const next = {
          ...c,
          name,
          characters: c.isMulti
            ? c.characters
            : c.characters.map((ch, i) => (i === 0 ? { ...ch, name } : ch)),
          updatedAt: Date.now(),
        };
        persistChat(next);
        return next;
      });
      const folders = s.folders.map((f) => {
        if (f.id !== id) return f;
        const next = { ...f, name };
        void db.folders.put(next);
        return next;
      });
      const cards = s.cards.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, name };
        void db.cards.put(next);
        return next;
      });
      return { chats, folders, cards, ui: { ...s.ui, rename: null, selectMode: false, selected: [] } };
    });
    get().toast("已改名");
  },

  reorder: (ids) => {
    const order = new Map(ids.map((id, i) => [id, i]));
    set((s) => {
      const chats = s.chats.map((c) => {
        if (!order.has(c.id)) return c;
        const next = { ...c, order: order.get(c.id)! };
        persistChat(next);
        return next;
      });
      const folders = s.folders.map((f) => {
        if (!order.has(f.id)) return f;
        const next = { ...f, order: order.get(f.id)! };
        void db.folders.put(next);
        return next;
      });
      return { chats, folders, ui: { ...s.ui, sortMode: false, selectMode: false, selected: [] } };
    });
  },

  saveCard: (chat, name) => {
    const card: CharacterCard = {
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
      order: Date.now(),
    };
    void db.cards.put(card);
    set((s) => ({ cards: [...s.cards, card], ui: { ...s.ui, saveCardOpen: false } }));
    get().toast(`已保存角色卡「${name}」`);
  },

  applyCard: (chatId, card, charIndex) => {
    get().patchChat(chatId, (c) => {
      if (c.isMulti && !card.isMulti && charIndex != null) {
        const chars = c.characters.map((ch, i) =>
          i === charIndex
            ? {
                ...ch,
                ...card.characters[0],
                id: ch.id,
                extras: card.characters[0]?.extras ?? ch.extras,
              }
            : ch,
        );
        return { ...c, characters: chars };
      }
      return {
        ...c,
        isMulti: card.isMulti,
        overview: card.overview,
        opening: card.opening,
        extras: card.extras,
        statusBarOn: card.statusBarOn,
        statusBar: card.statusBar,
        grokModelId: card.grokModelId,
        characters: structuredClone(card.characters).map((ch, i) => ({
          ...ch,
          id: c.characters[i]?.id ?? ch.id,
        })),
        name: card.isMulti
          ? card.characters.map((x) => x.name).filter(Boolean).join("、")
          : card.characters[0]?.name || card.name,
      };
    });
    get().toast(`已应用「${card.name}」`);
  },

  deleteCard: (id) => {
    void db.cards.delete(id);
    const name = get().cards.find((c) => c.id === id)?.name ?? "";
    set((s) => ({ cards: s.cards.filter((c) => c.id !== id) }));
    get().toast(`已删除${name}`);
  },

  reorderCards: (ids) => {
    const order = new Map(ids.map((id, i) => [id, i]));
    set((s) => {
      const cards = s.cards.map((c) => {
        if (!order.has(c.id)) return c;
        const next = { ...c, order: order.get(c.id)! };
        void db.cards.put(next);
        return next;
      });
      return { cards };
    });
  },

  saveAppearance: (name, prompt) => {
    const a: AppearancePreset = { id: uid("ap_"), name, prompt, order: Date.now(), createdAt: Date.now() };
    void db.appearances.put(a);
    set((s) => ({ appearances: [...s.appearances, a], ui: { ...s.ui, saveAppearOpen: false } }));
    get().toast(`已保存角色「${name}」`);
  },

  applyAppearance: (chatId, preset, target) => {
    if (chatId === "__pure__") {
      if (target === "mid") get().setPureParams({ promptMid: preset.prompt });
      else {
        get().setPureParams({
          characters: get().pureParams.characters.map((ch) =>
            ch.id === target ? { ...ch, prompt: preset.prompt } : ch,
          ),
        });
      }
      return;
    }
    get().patchChat(chatId, (c) => {
      if (target === "mid") {
        return {
          ...c,
          imageParams: { ...c.imageParams, promptMid: preset.prompt },
          characters: c.isMulti
            ? c.characters
            : c.characters.map((ch, i) => (i === 0 ? { ...ch, appearance: preset.prompt } : ch)),
        };
      }
      return {
        ...c,
        imageParams: {
          ...c.imageParams,
          characters: c.imageParams.characters.map((ch) =>
            ch.id === target ? { ...ch, prompt: preset.prompt } : ch,
          ),
        },
        characters: c.characters.map((ch) =>
          ch.id === target ? { ...ch, appearance: preset.prompt, prompt: preset.prompt } : ch,
        ),
      };
    });
  },

  deleteAppearance: (id) => {
    void db.appearances.delete(id);
    set((s) => ({ appearances: s.appearances.filter((a) => a.id !== id) }));
  },

  reorderAppearances: (ids) => {
    const order = new Map(ids.map((id, i) => [id, i]));
    set((s) => {
      const appearances = s.appearances.map((a) => {
        if (!order.has(a.id)) return a;
        const next = { ...a, order: order.get(a.id)! };
        void db.appearances.put(next);
        return next;
      });
      return { appearances };
    });
  },

  addFavorite: (blobId) => {
    const hist = blobId ? get().history.find((h) => h.blobId === blobId) : undefined;
    const params = hist?.params
      ? { ...structuredClone(hist.params), seed: hist.seed, seedLocked: true }
      : (() => {
          const p = structuredClone(get().pureParams);
          if (p.seed != null) p.seedLocked = true;
          return p;
        })();
    const f: FavoriteItem = {
      id: uid("fav_"),
      name: presetNameFrom(params),
      params,
      blobId,
      createdAt: Date.now(),
    };
    void (async () => {
      try {
        await db.favorites.put(f);
        set((s) => ({ favorites: sortHistoryNewestFirst([f, ...s.favorites]) }));
        get().toast("已保存");
      } catch (err) {
        get().toast(err instanceof Error ? err.message : "收藏失败");
      }
    })();
  },

  patchFavorite: (id, p) => {
    const row = get().favorites.find((f) => f.id === id);
    if (!row) return;
    const next = { ...row, ...p };
    void (async () => {
      try {
        await db.favorites.put(next);
        set((s) => ({
          favorites: sortHistoryNewestFirst(s.favorites.map((f) => (f.id === id ? next : f))),
        }));
      } catch (err) {
        get().toast(err instanceof Error ? err.message : "收藏更新失败");
      }
    })();
  },

  deleteFavorite: (id) => {
    const row = get().favorites.find((f) => f.id === id);
    set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }));
    void db.favorites.delete(id);
    if (row?.blobId && !blobInUse(get(), row.blobId, id)) void deleteImage(row.blobId);
    get().toast("已删除");
  },

  setFavoriteThumb: (id, blobId) => {
    const row = get().favorites.find((f) => f.id === id);
    const old = row?.blobId;
    get().patchFavorite(id, { blobId });
    if (old && old !== blobId && !blobInUse(get(), old, id)) void deleteImage(old);
    get().toast("已更新配图");
  },

  addHistory: (h) => {
    void db.history.put(h);
    set((s) => ({ history: sortHistoryNewestFirst([h, ...s.history]).slice(0, 200) }));
  },

  patchHistory: (id, p) => {
    set((s) => {
      const history = s.history.map((h) => (h.id === id ? { ...h, ...p } : h));
      const row = history.find((h) => h.id === id);
      if (row) void db.history.put(row);
      return { history };
    });
  },

  deleteHistory: (id) => {
    const row = get().history.find((h) => h.id === id);
    set((s) => ({ history: s.history.filter((h) => h.id !== id) }));
    void db.history.delete(id);
    if (row?.blobId && !blobInUse(get(), row.blobId)) void deleteImage(row.blobId);
  },

  setCooldown: (until) => get().setSettings({ cooldownUntil: until }),

  setComposerDraft: (chatId, text) => {
    set((s) => {
      const composerDrafts = { ...s.composerDrafts };
      if (text) composerDrafts[chatId] = text;
      else delete composerDrafts[chatId];
      void db.kv.put({ key: "composerDrafts", value: composerDrafts });
      return { composerDrafts };
    });
  },
}));

function parseComposerDrafts(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (k && typeof v === "string" && v) out[k] = v;
  }
  return out;
}

function dropDrafts(drafts: Record<string, string>, ids: Set<string>) {
  const next = { ...drafts };
  for (const id of ids) delete next[id];
  return next;
}

function liftImageAi(
  settings: Settings,
  chats: Chat[],
  currentId: string | null,
): { imageModelId: string | null; imageModelPin: string | null } {
  if (settings.imageModelId || settings.imageModelPin) {
    return {
      imageModelId: settings.imageModelId ?? null,
      imageModelPin: settings.imageModelPin ?? null,
    };
  }
  const cur = chats.find((c) => c.id === currentId);
  const hit = [cur, ...chats].find((c) => c && (c.imageModelId || c.imageModelPin));
  return {
    imageModelId: hit?.imageModelId ?? null,
    imageModelPin: hit?.imageModelPin ?? null,
  };
}

function blobInUse(s: State, blobId: string, skipFav?: string) {
  if (s.favorites.some((f) => f.blobId === blobId && f.id !== skipFav)) return true;
  if (s.history.some((h) => h.blobId === blobId)) return true;
  for (const c of s.chats) {
    if (c.avatarBlobId === blobId) return true;
    for (const m of c.messages) {
      if (m.images.some((g) => g.blobId === blobId)) return true;
    }
  }
  return false;
}

export async function saveBlob(blob: Blob) {
  const id = uid("img_");
  await putImage(id, blob);
  rememberUrl(id, blob);
  return id;
}

export function listedChats(folders: Folder[], chats: Chat[]) {
  const live = chats.filter((c) => !c.isDraft);
  const foldersSorted = [...folders].sort((a, b) => {
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    return a.order - b.order;
  });
  const root = live
    .filter((c) => !c.folderId)
    .sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return a.order - b.order;
    });
  return {
    foldersSorted,
    root,
    inFolder: (fid: string) =>
      live
        .filter((c) => c.folderId === fid)
        .sort((a, b) => {
          if (a.starred !== b.starred) return a.starred ? -1 : 1;
          return a.order - b.order;
        }),
  };
}

export function fakePureChat(params: ImageParams, grokModelId: GrokModelId): Chat {
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
    scrollTop: 0,
  };
}
