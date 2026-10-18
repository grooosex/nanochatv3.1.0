import { createFileRoute } from "@tanstack/react-router";
import { systemFor } from "@/lib/prompts";

type Msg = { role: "system" | "user" | "assistant"; content: string | object };

type LlmParams = {
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
};

const SKIP_MODEL =
  /embedding|embed|whisper|tts|rerank|kolors|flux|stable-diffusion|sdxl|sd-3|sd3|image|video|audio|moderation|bge-|jina-|clip|vae|unet|speech|asr|kokoro|fish-speech|sensevoice|hunyuanvideo|cogvideox|wanx|caption/i;

function normalizeBase(raw: string) {
  let u = (raw || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  u = u.replace(/\/+$/, "");
  u = u.replace(/\/chat\/completions$/i, "");
  try {
    const url = new URL(u);
    if (url.pathname === "" || url.pathname === "/") url.pathname = "/v1";
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return u;
  }
}

function openaiError(status: number, text: string) {
  try {
    const j = JSON.parse(text) as { error?: { message?: string } | string; message?: string };
    if (typeof j.error === "string") return j.error;
    if (j.error?.message) return j.error.message;
    if (j.message) return j.message;
  } catch {
    /* ignore */
  }
  return text.slice(0, 400) || `HTTP ${status}`;
}

function sseResponse(upstream: Response) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body?.getReader();
      if (!reader) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "empty stream" })}\n\n`));
        controller.close();
        return;
      }
      const dec = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              continue;
            }
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string }; message?: { content?: string } }[];
              };
              const content = json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.message?.content ?? "";
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
              }
            } catch {
              /* ignore */
            }
          }
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: e instanceof Error ? e.message : "stream error" })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export const Route = createFileRoute("/api/llm")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          action?: "models" | "chat";
          baseUrl?: string;
          apiKey?: string;
          model?: string;
          task?: string;
          extraSystem?: string;
          styleExtra?: string;
          postHistory?: string;
          imageSystem?: string;
          messages?: Msg[];
          stream?: boolean;
          max_tokens?: number;
          params?: LlmParams;
        };
        const base = normalizeBase(body.baseUrl || "");
        const key = (body.apiKey || "").trim();
        if (!base) return Response.json({ ok: false, error: "请填写 API 网址" }, { status: 400 });
        if (!key) return Response.json({ ok: false, error: "请填写 API Key" }, { status: 400 });

        if (body.action === "models") {
          try {
            const r = await fetch(`${base}/models`, {
              headers: { Authorization: `Bearer ${key}` },
            });
            const text = await r.text();
            if (!r.ok) {
              return Response.json({ ok: false, error: openaiError(r.status, text) });
            }
            let raw: { data?: { id?: string }[]; models?: { id?: string }[] } = {};
            try {
              raw = JSON.parse(text) as typeof raw;
            } catch {
              return Response.json({ ok: false, error: "模型列表无法解析" });
            }
            const ids = (raw.data || raw.models || [])
              .map((m) => m.id)
              .filter((id): id is string => typeof id === "string" && id.length > 0 && !SKIP_MODEL.test(id));
            const uniq = [...new Set(ids)].sort((a, b) => a.localeCompare(b));
            return Response.json({ ok: true, models: uniq });
          } catch (e) {
            return Response.json({
              ok: false,
              error: e instanceof Error ? e.message : "无法连接 API",
            });
          }
        }

        const model = (body.model || "").trim();
        if (!model) return Response.json({ ok: false, error: "还没选择模型" }, { status: 400 });
        const task = body.task || "chat";
        const sys = systemFor(task, body.extraSystem, body.styleExtra, body.imageSystem);
        const messages: Msg[] = [{ role: "system", content: sys }, ...(body.messages ?? [])];
        const post = body.postHistory?.trim();
        if (post) messages.push({ role: "system", content: post });
        const p = body.params || {};
        const maxTokens = body.max_tokens ?? p.maxTokens ?? 4096;
        const payload: Record<string, unknown> = {
          model,
          messages,
          stream: Boolean(body.stream),
          temperature: p.temperature ?? 0.9,
          top_p: p.topP ?? 1,
          frequency_penalty: p.frequencyPenalty ?? 0,
          presence_penalty: p.presencePenalty ?? 0,
          max_tokens: maxTokens,
        };

        try {
          const r = await fetch(`${base}/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (!r.ok) {
            const t = await r.text().catch(() => "");
            return Response.json({ ok: false, error: openaiError(r.status, t) }, { status: 500 });
          }
          if (body.stream) return sseResponse(r);
          const json = (await r.json()) as {
            choices?: { message?: { content?: string; reasoning_content?: string; reasoning?: string } }[];
          };
          const msg = json.choices?.[0]?.message;
          let text = (msg?.content || msg?.reasoning_content || msg?.reasoning || "").trim();
          text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
          return Response.json({ ok: true, text });
        } catch (e) {
          return Response.json({
            ok: false,
            error: e instanceof Error ? e.message : "请求失败",
          }, { status: 500 });
        }
      },
    },
  },
});
