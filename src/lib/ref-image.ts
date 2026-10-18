import { parseNaiPng } from "./png-meta";
import { getImage } from "./idb";

export async function naiSeedOf(file: Blob): Promise<number | undefined> {
  try {
    const meta = parseNaiPng(await file.arrayBuffer());
    return meta.seed && meta.seed > 0 ? meta.seed : undefined;
  } catch {
    return undefined;
  }
}

export async function compressRef(file: Blob, maxEdge = 1024, quality = 0.85): Promise<Blob> {
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
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    return blob ?? file;
  } catch {
    return file;
  }
}

export async function blobRawB64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function blobDataUrl(id: string | undefined | null): Promise<string | null> {
  if (!id) return null;
  const blob = await getImage(id);
  if (!blob) return null;
  const mime = blob.type || "image/jpeg";
  return `data:${mime};base64,${await blobRawB64(blob)}`;
}
