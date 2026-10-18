import { createFileRoute } from "@tanstack/react-router";
import { systemFor } from "@/lib/prompts";

const GROK_MODELS: Record<string, { model: string; effort: string }> = {
  "grok-4.7-high": { model: "grok-4.7", effort: "high" },
  "grok-4.7-medium": { model: "grok-4.7", effort: "medium" },
  "grok-4.7-low": { model: "grok-4.7", effort: "low" },
  "grok-4.6-high": { model: "grok-4.6", effort: "high" },
  "grok-4.6-medium": { model: "grok-4.6", effort: "medium" },
  "grok-4.6-low": { model: "grok-4.6", effort: "low" },
  "grok-4.5-medium": { model: "grok-4.5", effort: "medium" },
  "grok-4.5-high": { model: "grok-4.5", effort: "high" },
  "grok-4.5-low": { model: "grok-4.5", effort: "low" },
};

type Msg = { role: "system" | "user" | "assistant"; content: string | object };

function pickModel(id: string | undefined) {
  return GROK_MODELS[id || ""] ?? GROK_MODELS["grok-4.6-medium"];
}

async function callXai(opts: {
  model: string;
  effort: string;
  messages: Msg[];
  stream: boolean;
  max_tokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false as const, error: "当前环境暂不可用 Grok，请稍后重试。" };
  }
  const payload: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    stream: opts.stream,
    reasoning_effort: opts.effort,
    max_tokens: opts.max_tokens ?? 8192,
    temperature: opts.temperature ?? 0.9,
  };
  if (opts.topP != null) payload.top_p = opts.topP;
  if (opts.frequencyPenalty != null) payload.frequency_penalty = opts.frequencyPenalty;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return { ok: false as const, error: `xAI ${res.status}: ${t.slice(0, 400)}` };
  }
  return { ok: true as const, res };
}

export const Route = createFileRoute("/api/grok")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          task?: string;
          grokModelId?: string;
          stream?: boolean;
          messages?: Msg[];
          extraSystem?: string;
          styleExtra?: string;
          postHistory?: string;
          imageSystem?: string;
          max_tokens?: number;
          params?: {
            temperature?: number;
            topP?: number;
            frequencyPenalty?: number;
            presencePenalty?: number;
            maxTokens?: number;
          };
        };
        const { model, effort } = pickModel(body.grokModelId);
        const task = body.task || "chat";
        const sys = systemFor(task, body.extraSystem, body.styleExtra, body.imageSystem);
        const messages: Msg[] = [{ role: "system", content: sys }, ...(body.messages ?? [])];
        const post = body.postHistory?.trim();
        if (post) messages.push({ role: "system", content: post });
        const p = body.params;

        if (body.stream) {
          const result = await callXai({
            model,
            effort,
            messages,
            stream: true,
            max_tokens: body.max_tokens ?? p?.maxTokens,
            temperature: p?.temperature,
            topP: p?.topP,
            frequencyPenalty: p?.frequencyPenalty,
          });
          if (!result.ok) {
            return Response.json({ ok: false, error: result.error }, { status: 500 });
          }
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              const reader = result.res.body?.getReader();
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
                        choices?: { delta?: { content?: string; reasoning_content?: string } }[];
                      };
                      const content = json.choices?.[0]?.delta?.content ?? "";
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

        const result = await callXai({
          model,
          effort,
          messages,
          stream: false,
          max_tokens: body.max_tokens ?? p?.maxTokens ?? (task === "image" || task === "rewrite" ? 800 : 8192),
          temperature: p?.temperature,
          topP: p?.topP,
          frequencyPenalty: p?.frequencyPenalty,
        });
        if (!result.ok) return Response.json({ ok: false, error: result.error }, { status: 500 });
        const json = (await result.res.json()) as {
          choices?: { message?: { content?: string; reasoning_content?: string; reasoning?: string } }[];
        };
        const msg = json.choices?.[0]?.message;
        let text = (msg?.content || msg?.reasoning_content || msg?.reasoning || "").trim();
        text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        return Response.json({ ok: true, text });
      },
    },
  },
});
