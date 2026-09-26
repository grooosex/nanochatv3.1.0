import type { Chat, GenImage } from "./types";

export function settleStuckImages(chat: Chat): Chat {
  let dirty = false;
  const messages = chat.messages.map((m) => {
    let imgDirty = false;
    const images = m.images.map((g) => {
      if (g.status === "done" || g.status === "error") return g;
      imgDirty = true;
      return { ...g, status: "error" as const, error: "上次生图未完成" };
    });
    if (!imgDirty) return m;
    dirty = true;
    return { ...m, images };
  });
  return dirty ? { ...chat, messages } : chat;
}

function isAbort(e: unknown) {
  return (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
}

export function imageFailText(e: unknown, signal?: AbortSignal) {
  if (signal?.aborted) return "已取消";
  if (isAbort(e)) return "生图超时";
  return e instanceof Error ? e.message : "生图失败";
}

export function prettyImageError(error?: string) {
  const raw = (error ?? "").trim();
  if (!raw) return "生图失败";
  let msg = raw;
  if (raw.startsWith("{")) {
    try {
      const j = JSON.parse(raw) as { message?: unknown };
      if (typeof j.message === "string" && j.message.trim()) msg = j.message.trim();
    } catch {
      /* keep raw */
    }
  }
  if (/too many concurrent/i.test(msg) || /rate limit/i.test(msg) || /"statusCode"\s*:\s*429/.test(raw)) return "请求太频繁";
  if (/<!doctype|<html|internal server error/i.test(raw)) return "中转站返回了异常页面";
  return msg;
}

export function genPhaseLabel(status: GenImage["status"] | null | undefined, error?: string) {
  if (status === "writing") return "写提示词中";
  if (status === "uploading") return "上传中";
  if (status === "generating") return "生图中";
  if (status === "receiving") return "回传中";
  if (status === "error") return prettyImageError(error);
  return "";
}
