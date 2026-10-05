import { useApp } from "./store";
import type { GrokModelId } from "./types";

async function readJsonError(res: Response, fallback: string) {
  try {
    const j = (await res.json()) as { error?: string };
    return j.error || fallback;
  } catch {
    return fallback;
  }
}

let writeChain = Promise.resolve();

function enqueueWrite<T>(fn: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  const run = () => {
    if (signal?.aborted) {
      const err = new Error("Aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    }
    return fn();
  };
  const next = writeChain.then(run, run);
  writeChain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function shouldQueue(task: unknown) {
  return task === "memory" || task === "image" || task === "rewrite";
}

function abortError() {
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}

async function grokOnceRaw(body: Record<string, unknown>, signal?: AbortSignal) {
  const s = useApp.getState().settings;
  const presetOn = Boolean(s.stActiveId);
  const viaBody = body.via;
  const modelBody = typeof body.model === "string" ? body.model : "";
  const rest = { ...body };
  delete rest.via;
  delete rest.model;
  const via = viaBody === "api" || viaBody === "grok" ? viaBody : s.chatSource;
  const ownParams = rest.params && typeof rest.params === "object" ? (rest.params as Record<string, unknown>) : null;
  const maxFromOwn = typeof ownParams?.maxTokens === "number" ? ownParams.maxTokens : undefined;

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
        max_tokens: (rest.max_tokens as number | undefined) ?? maxFromOwn ?? s.llmParams.maxTokens,
      }),
      signal,
    });
    const data = (await res.json()) as { ok: boolean; text?: string; error?: string };
    if (!res.ok || !data.ok) throw new Error(data.error || `请求失败 ${res.status}`);
    return data.text ?? "";
  }

  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...rest,
      stream: false,
      params: ownParams ?? (presetOn && rest.task !== "image" ? s.llmParams : undefined),
    }),
    signal,
  });
  const data = (await res.json()) as { ok: boolean; text?: string; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || `Grok 请求失败 ${res.status}`);
  return data.text ?? "";
}

export async function grokOnce(body: Record<string, unknown>, signal?: AbortSignal) {
  if (shouldQueue(body.task)) return enqueueWrite(() => grokOnceRaw(body, signal), signal);
  return grokOnceRaw(body, signal);
}

function consumeSse(chunk: string, onDelta: (t: string) => void, acc: { full: string }) {
  const line = chunk.split("\n").find((l) => l.startsWith("data: "));
  if (!line) return;
  const data = line.slice(6);
  if (data === "[DONE]") return;
  try {
    const j = JSON.parse(data) as { text?: string; error?: string };
    if (j.error) throw new Error(j.error);
    if (j.text) {
      acc.full += j.text;
      onDelta(acc.full);
    }
  } catch (e) {
    if (e instanceof Error && e.message && !e.message.includes("JSON") && e.message !== "Unexpected end of JSON input") {
      throw e;
    }
  }
}

export async function grokStream(
  body: Record<string, unknown>,
  onDelta: (t: string) => void,
  signal?: AbortSignal,
) {
  const run = () => grokStreamRaw(body, onDelta, signal);
  if (shouldQueue(body.task)) return enqueueWrite(run, signal);
  return run();
}

async function grokStreamRaw(
  body: Record<string, unknown>,
  onDelta: (t: string) => void,
  signal?: AbortSignal,
) {
  if (signal?.aborted) throw abortError();
  const s = useApp.getState().settings;
  const api = (body.via === "api" || body.via === "grok" ? body.via : s.chatSource) === "api";
  const presetOn = Boolean(s.stActiveId);
  if (api) {
    if (!s.llmConnected || !s.llmKey) throw new Error("还没连接对话 API");
    if (!s.llmModel && typeof body.model !== "string") throw new Error("还没选择模型");
  }

  const url = api ? "/api/llm" : "/api/grok";
  const ownParams = body.params && typeof body.params === "object" ? (body.params as Record<string, unknown>) : null;
  const maxFromOwn = typeof ownParams?.maxTokens === "number" ? ownParams.maxTokens : undefined;
  const payload = api
    ? {
        action: "chat",
        baseUrl: s.llmBase,
        apiKey: s.llmKey,
        model: typeof body.model === "string" ? body.model : s.llmModel,
        ...body,
        params: ownParams ?? s.llmParams,
        stream: true,
        max_tokens: (body.max_tokens as number | undefined) ?? maxFromOwn ?? s.llmParams.maxTokens,
      }
    : {
        ...body,
        stream: true,
        params: ownParams ?? (presetOn && body.task !== "image" ? s.llmParams : undefined),
      };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(await readJsonError(res, `请求失败 ${res.status}`));
  }
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
  if (buf.trim()) {
    for (const p of buf.split("\n\n")) consumeSse(p, onDelta, acc);
  }
  return acc.full;
}

export function modelPayload(id: GrokModelId) {
  return { grokModelId: id };
}

export async function fetchLlmModels(baseUrl: string, apiKey: string) {
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "models", baseUrl, apiKey }),
  });
  const data = (await res.json()) as { ok: boolean; models?: string[]; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || `连接失败 ${res.status}`);
  return data.models ?? [];
}
