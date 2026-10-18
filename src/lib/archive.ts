import { unzipSync, zipSync, strToU8, strFromU8 } from "fflate";
import type { AppDataDump, Chat, FavoriteItem, FavGroup, ImageParams } from "./types";
import { migrateFavorite } from "./presets";
import { db, putImage } from "./idb";
import {
  collectEmbeddedImages,
  collectPngs,
  convertLegacyArchive,
  isLegacyArchive,
  pickArchiveJson,
} from "./legacy-archive";
import { downloadBlob, uid } from "./utils";

export async function exportArchive(kind: "full" | "lite") {
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
  const dump: AppDataDump = {
    version: 1,
    settings: (settingsRow?.value as AppDataDump["settings"]) ?? {
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
        temperature: 0.9,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0.4,
        maxTokens: 4096,
        contextTurns: 16,
      },
      stPresets: [],
      stActiveId: null,
      stParamSnapshot: null,
      naiKey: "",
      naiBase: "https://api.idlecloud.cc",
      naiConnected: false,
      cooldownUntil: 0,
      chatImage: true,
      theme: "light",
    },
    folders,
    chats,
    cards,
    appearances,
    favorites,
    favGroups,
    history,
    hasImages: kind === "full",
  };

  if (kind === "lite") {
    dump.favorites = (dump.favorites ?? []).map((f) => ({ ...f, blobId: undefined }));
    dump.history = (dump.history ?? []).map((h) => ({ ...h, blobId: undefined }));
    const blob = new Blob([JSON.stringify(dump)], { type: "application/json" });
    downloadBlob(blob, `绘语-无配图-${new Date().toISOString().slice(0, 10)}.json`);
    return;
  }

  const files: Record<string, Uint8Array> = {
    "huiyu.json": strToU8(JSON.stringify(dump)),
  };
  const images = await db.images.toArray();
  for (const img of images) {
    const buf = new Uint8Array(await img.blob.arrayBuffer());
    files[`images/${img.id}.png`] = buf;
  }
  const zipped = zipSync(files, { level: 1 });
  downloadBlob(new Blob([zipped as BlobPart], { type: "application/zip" }), `绘语-全部-${new Date().toISOString().slice(0, 10)}.zip`);
}

export async function importArchive(file: File) {
  const name = file.name.toLowerCase();
  let raw: unknown;
  const imageBlobs = new Map<string, Blob>();

  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isZip = name.endsWith(".zip") || (head[0] === 0x50 && head[1] === 0x4b);

  if (isZip) {
    const buf = new Uint8Array(await file.arrayBuffer());
    let unzipped: Record<string, Uint8Array>;
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
    for (const [id, data] of collectPngs(unzipped)) {
      imageBlobs.set(id, new Blob([data as BlobPart], { type: "image/png" }));
    }
  } else {
    try {
      raw = JSON.parse(await file.text());
    } catch {
      throw new Error("无法识别的存档");
    }
  }

  for (const [id, blob] of collectEmbeddedImages(raw)) {
    if (!imageBlobs.has(id)) imageBlobs.set(id, blob);
  }

  let dump: AppDataDump;
  let currentId: string | null | undefined;
  let pureParams: ImageParams | undefined;

  if (isLegacyArchive(raw)) {
    const loaded = convertLegacyArchive(raw);
    dump = loaded.dump;
    currentId = loaded.currentId;
    pureParams = loaded.pureParams;
  } else {
    dump = raw as AppDataDump;
    if (!dump || dump.version !== 1 || !Array.isArray(dump.chats)) throw new Error("无法识别的存档");
  }

  const tables = [db.chats, db.folders, db.cards, db.appearances, db.favorites, db.favGroups, db.history, db.images, db.kv];
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
    await db.favorites.bulkPut((dump.favorites ?? []).map(migrateFavorite).filter(Boolean) as FavoriteItem[]);
    await db.favGroups.bulkPut((dump.favGroups ?? []).filter((g) => g && typeof g.id === "string") as FavGroup[]);
    await db.history.bulkPut(dump.history ?? []);
    const prev = await db.kv.get("settings");
    const prevVal = (prev?.value as AppDataDump["settings"] | undefined) ?? undefined;
    const dumpS = dump.settings;
    const merged = {
      ...((prevVal as object) ?? {}),
      ...dumpS,
      naiKey: dumpS?.naiKey || prevVal?.naiKey || "",
      llmKey: dumpS?.llmKey || prevVal?.llmKey || "",
      llmAccounts: Array.isArray(dumpS?.llmAccounts) ? dumpS.llmAccounts : (prevVal?.llmAccounts ?? []),
      stPresets: Array.isArray(dumpS?.stPresets) ? dumpS.stPresets : (prevVal?.stPresets ?? []),
      stActiveId: dumpS?.stActiveId ?? prevVal?.stActiveId ?? null,
      stParamSnapshot: dumpS?.stParamSnapshot ?? prevVal?.stParamSnapshot ?? null,
    };
    await db.kv.put({ key: "settings", value: merged });
    if (currentId !== undefined) await db.kv.put({ key: "currentId", value: currentId });
    if (pureParams) await db.kv.put({ key: "pureParams", value: pureParams });
  });
  for (const [id, blob] of imageBlobs) await putImage(id, blob);
}

export function cloneChat(chat: Chat, nameSuffix = "(副本)"): Chat {
  const id = uid("chat_");
  return {
    ...structuredClone(chat),
    id,
    name: chat.name ? `${chat.name}${nameSuffix}` : "未命名" + nameSuffix,
    starred: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDraft: false,
    messages: structuredClone(chat.messages),
  };
}
