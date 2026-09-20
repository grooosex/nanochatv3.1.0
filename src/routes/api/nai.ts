import { createFileRoute } from "@tanstack/react-router";
import { unzipSync } from "fflate";
import { IMAGE_GEN_TIMEOUT_MS } from "@/lib/constants";

export const Route = createFileRoute("/api/nai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          action?: "test" | "generate";
          baseUrl?: string;
          apiKey?: string;
          payload?: unknown;
        };
        const base = (body.baseUrl || "https://api.idlecloud.cc").replace(/\/$/, "");
        const key = (body.apiKey || "").trim();
        if (!key) return Response.json({ ok: false, error: "请填写 NAI API Key" }, { status: 400 });

        if (body.action === "test") {
          try {
            const r = await fetch(`${base}/api/user`, {
              headers: { Authorization: `Bearer ${key}` },
            });
            const text = await r.text();
            if (r.status === 401 || r.status === 403) {
              return Response.json({ ok: false, error: text.slice(0, 300) || `鉴权失败 ${r.status}` });
            }
            if (r.ok || r.status === 404) {
              return Response.json({ ok: true });
            }
            return Response.json({ ok: r.status < 500, error: text.slice(0, 400) || `HTTP ${r.status}` });
          } catch (e) {
            return Response.json({
              ok: false,
              error: e instanceof Error ? e.message : "无法连接中转站",
            });
          }
        }

        try {
          const r = await fetch(`${base}/api/ai/generate-image`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body.payload ?? {}),
            signal: AbortSignal.timeout(IMAGE_GEN_TIMEOUT_MS),
          });
          if (!r.ok) {
            const t = await r.text().catch(() => "");
            return Response.json({
              ok: false,
              error: t.slice(0, 800) || `中转站 ${r.status}`,
              status: r.status,
            });
          }
          const ab = await r.arrayBuffer();
          const u8 = new Uint8Array(ab);
          let png: Uint8Array | null = null;
          if (u8[0] === 0x89 && u8[1] === 0x50) {
            png = u8;
          } else {
            try {
              const files = unzipSync(u8);
              const name = Object.keys(files).find((n) => n.toLowerCase().endsWith(".png"));
              png = name ? files[name] : Object.values(files)[0] ?? null;
            } catch {
              png = u8;
            }
          }
          if (!png) return Response.json({ ok: false, error: "中转站没有返回图片" });
          let binary = "";
          const chunk = 0x8000;
          for (let i = 0; i < png.length; i += chunk) {
            binary += String.fromCharCode(...png.subarray(i, i + chunk));
          }
          const b64 = btoa(binary);
          return Response.json({ ok: true, image: b64 });
        } catch (e) {
          const abort = (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
          return Response.json({
            ok: false,
            error: abort ? "生图超时" : e instanceof Error ? e.message : "生图请求失败",
          });
        }
      },
    },
  },
});
