import { createFileRoute } from "@tanstack/react-router";
import { unzipSync } from "fflate";
import { NAI_HOP_TIMEOUT_MS } from "@/lib/constants";

function normalizeBase(url: string) {
  return (url || "https://api.idlecloud.cc").replace(/\/+$/, "");
}

function absUrl(base: string, url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return normalizeBase(base) + (url.startsWith("/") ? url : `/${url}`);
}

function looksHtml(text: string) {
  const t = text.trimStart().slice(0, 80).toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html") || t.startsWith("<?xml") || t.includes("<title>internal server error");
}

function mapIdlecloudError(status: number, body: string) {
  if (looksHtml(body)) return "中转站返回了异常页面";
  let code = "";
  let msg = "";
  try {
    const j = JSON.parse(body) as { error?: string; message?: string; detail?: string };
    code = String(j.error || "");
    msg = String(j.message || j.detail || "");
  } catch {
    if (body) msg = body.slice(0, 180);
  }
  if (code === "NOVELAI_V5_WEEKLY_QUOTA_EXCEEDED") return "NovelAI V5 本周额度已用完，请改用 V4.5 或等重置";
  if (code === "NOVELAI_V5_BACKEND_QUOTA_EXHAUSTED") return "V5 后端额度暂时耗尽，请稍后或改用 V4.5";
  if (status === 401 || status === 403) return "API Key 无效或档位不够，请重新填写";
  if (status === 402) return "中转站积分不足";
  if (status === 409) return "已有一张图正在生成，请等它完成后再试";
  if (status === 429 || code === "RATE_LIMITED") {
    return msg || "中转站限制 20 秒内只能提交一次生图（聊天配图和纯生图共用），请稍后再试";
  }
  if (status === 504) return "中转站超时，请稍后重试";
  return msg || code || `中转站 ${status}`;
}

function authHeaders(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    Accept: "application/json, application/zip, image/png, */*",
  };
}

type V5Delivery = {
  status_url?: string;
  file_url?: string;
  confirm_url?: string;
  confirmation_required?: boolean;
  sha256?: string;
  size_bytes?: number;
};

type JobJson = {
  job_id?: string;
  id?: string;
  status?: string;
  image_url?: string;
  image?: string;
  error?: string;
  message?: string;
  data?: JobJson;
  v5_delivery?: V5Delivery;
};

function parseJob(text: string): JobJson | null {
  if (!text || looksHtml(text)) return null;
  try {
    const j = JSON.parse(text) as JobJson;
    if (j?.data && typeof j.data === "object" && !j.job_id && !j.image && !j.image_url) return { ...j, ...j.data };
    return j;
  } catch {
    return null;
  }
}

function toB64(png: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < png.length; i += chunk) {
    binary += String.fromCharCode(...png.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function extractPng(u8: Uint8Array) {
  if (u8[0] === 0x89 && u8[1] === 0x50) return u8;
  try {
    const files = unzipSync(u8);
    const name = Object.keys(files).find((n) => n.toLowerCase().endsWith(".png"));
    return name ? files[name] : (Object.values(files)[0] ?? null);
  } catch {
    return null;
  }
}

function imageField(image?: string) {
  if (!image || image.length < 80) return "";
  return image.includes("base64,") ? image.split("base64,").pop() || "" : image;
}

export const Route = createFileRoute("/api/nai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          action?: "test" | "submit" | "poll" | "fetch" | "generate";
          baseUrl?: string;
          apiKey?: string;
          payload?: unknown;
          jobId?: string;
          statusUrl?: string;
          fileUrl?: string;
          v5?: V5Delivery;
        };
        const base = normalizeBase(body.baseUrl || "https://api.idlecloud.cc");
        const key = (body.apiKey || "").trim();
        if (!key) return Response.json({ ok: false, error: "请填写 NAI API Key" }, { status: 400 });

        if (body.action === "test") {
          try {
            const r = await fetch(`${base}/api/user`, {
              headers: { Authorization: `Bearer ${key}` },
            });
            const text = await r.text();
            if (r.status === 401 || r.status === 403) {
              return Response.json({ ok: false, error: mapIdlecloudError(r.status, text) });
            }
            if (r.ok || r.status === 404) return Response.json({ ok: true });
            return Response.json({ ok: r.status < 500, error: mapIdlecloudError(r.status, text) });
          } catch (e) {
            return Response.json({
              ok: false,
              error: e instanceof Error ? e.message : "无法连接中转站",
            });
          }
        }

        const hop = AbortSignal.timeout(NAI_HOP_TIMEOUT_MS);
        try {
          if (body.action === "fetch") {
            if (!body.fileUrl) return Response.json({ ok: false, error: "缺少图片地址" });
            const r = await fetch(absUrl(base, body.fileUrl), { headers: authHeaders(key), signal: hop });
            const u8 = new Uint8Array(await r.arrayBuffer());
            if (!r.ok) return Response.json({ ok: false, error: mapIdlecloudError(r.status, new TextDecoder().decode(u8)) });
            const png = extractPng(u8);
            if (!png) return Response.json({ ok: false, error: "中转站没有返回图片" });
            const v5 = body.v5;
            if (v5?.confirmation_required && v5.confirm_url) {
              try {
                await fetch(absUrl(base, v5.confirm_url), {
                  method: "POST",
                  headers: { ...authHeaders(key), "Content-Type": "application/json" },
                  body: JSON.stringify({ sha256: v5.sha256, size_bytes: v5.size_bytes }),
                });
              } catch {
                /* confirm is optional */
              }
            }
            return Response.json({ ok: true, image: toB64(png) });
          }

          if (body.action === "poll") {
            if (!body.jobId && !body.statusUrl) return Response.json({ ok: false, error: "缺少任务编号" });
            const url = body.statusUrl ? absUrl(base, body.statusUrl) : `${base}/api/get_result/${body.jobId}`;
            const r = await fetch(url, { headers: authHeaders(key), signal: hop });
            const text = await r.text();
            if (!r.ok) return Response.json({ ok: false, error: mapIdlecloudError(r.status, text) });
            if (looksHtml(text)) return Response.json({ ok: false, error: "中转站返回了异常页面" });
            const j = parseJob(text);
            if (!j) return Response.json({ ok: true, pending: true });
            if (j.status === "failed" || (j.error && j.status !== "completed" && !j.image_url && !j.image && !j.v5_delivery?.file_url)) {
              return Response.json({ ok: false, error: j.error || j.message || "生成失败" });
            }
            const inline = imageField(j.image);
            if (inline) return Response.json({ ok: true, image: inline });
            const fileUrl = j.v5_delivery?.file_url || j.image_url;
            if (j.status === "completed" || fileUrl) {
              if (!fileUrl) return Response.json({ ok: true, pending: true, statusUrl: j.v5_delivery?.status_url });
              return Response.json({
                ok: true,
                fileUrl,
                statusUrl: j.v5_delivery?.status_url,
                v5: j.v5_delivery,
              });
            }
            return Response.json({ ok: true, pending: true, statusUrl: j.v5_delivery?.status_url });
          }

          const r = await fetch(`${base}/api/generate_image`, {
            method: "POST",
            headers: { ...authHeaders(key), "Content-Type": "application/json" },
            body: JSON.stringify(body.payload ?? {}),
            signal: hop,
          });
          const u8 = new Uint8Array(await r.arrayBuffer());
          const text = new TextDecoder().decode(u8);
          if (!r.ok) return Response.json({ ok: false, error: mapIdlecloudError(r.status, text) });
          const png = extractPng(u8);
          if (png && (u8[0] === 0x89 || u8[0] === 0x50)) return Response.json({ ok: true, image: toB64(png) });
          if (looksHtml(text)) return Response.json({ ok: false, error: "中转站返回了异常页面" });
          const j = parseJob(text);
          if (!j) return Response.json({ ok: false, error: "中转站返回无法解析" });
          const inline = imageField(j.image);
          if (inline) return Response.json({ ok: true, image: inline });
          if (j.error && !j.job_id && !j.id) return Response.json({ ok: false, error: j.error });
          const fileUrl = j.v5_delivery?.file_url || j.image_url;
          const jobId = j.job_id || j.id;
          if (fileUrl && !jobId) return Response.json({ ok: true, fileUrl, v5: j.v5_delivery });
          if (!jobId && !j.v5_delivery?.status_url) return Response.json({ ok: false, error: "中转站没有返回任务" });
          return Response.json({
            ok: true,
            jobId,
            statusUrl: j.v5_delivery?.status_url,
            fileUrl,
            v5: j.v5_delivery,
          });
        } catch (e) {
          const abort = (e instanceof DOMException || e instanceof Error) && (e.name === "AbortError" || e.name === "TimeoutError");
          return Response.json({
            ok: false,
            error: abort ? "中转站超时，请稍后重试" : e instanceof Error ? e.message : "生图请求失败",
          });
        }
      },
    },
  },
});
