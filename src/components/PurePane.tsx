import { useEffect, useRef, useState, type PointerEvent as PE, type ReactNode } from "react";
import { Bookmark, Check, ChevronLeft, Clock, Download, ScanSearch, SlidersHorizontal, X } from "lucide-react";
import { parseNaiPng } from "@/lib/png-meta";
import { buildNaiPayload, modelLabel, modelShort, samplerLabel, samplerShort } from "@/lib/nai";
import { COOLDOWN_MS, NAI_MODELS, NOISE_SCHEDULES } from "@/lib/constants";
import { imageUrl } from "@/lib/idb";
import { fakePureChat, useApp } from "@/lib/store";
import { promptPreview } from "@/lib/presets";
import type { FavoriteItem, HistoryItem, ImageParams } from "@/lib/types";
import { afterPaint, generateNai, genPhaseLabel, imageFailText } from "@/lib/engine";
import { downloadBlob, randomSeed, uid, sortHistoryNewestFirst } from "@/lib/utils";
import { ParamsPane } from "./ParamsPane";
import { IconBtn, PrimaryBtn, TextInput, useCooldown } from "./ui-kit";

const HOLD_MS = 400;
let drawing = false;
let drawAbort: AbortController | null = null;

export function cancelPureDraw() {
  drawAbort?.abort();
}

export function PurePane() {
  const history = useApp((s) => s.history);
  const settings = useApp((s) => s.settings);
  const left = useCooldown(settings.cooldownUntil);
  const [sheet, setSheet] = useState<"params" | "fav" | "hist" | null>(null);
  const [idx, setIdx] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [phase, setPhase] = useState<"uploading" | "generating" | "receiving" | null>(null);
  const [flipLock, setFlipLock] = useState(false);
  const followLatest = useRef(true);
  const prevDone = useRef(0);

  const done = sortHistoryNewestFirst(history.filter((h) => h.status === "done" && h.blobId));
  const item = done[idx] ?? done[0];

  useEffect(() => {
    if (done.length > prevDone.current) {
      setIdx(0);
      followLatest.current = true;
    } else if (idx >= done.length && done.length > 0) setIdx(0);
    prevDone.current = done.length;
  }, [done.length, idx]);

  useEffect(() => {
    let gone = false;
    if (item?.blobId) {
      void imageUrl(item.blobId).then((u) => {
        if (!gone) setUrl(u);
      });
    } else setUrl(null);
    return () => {
      gone = true;
    };
  }, [item?.blobId]);

  const go = (dir: -1 | 1) => {
    const n = done.length;
    if (n < 2) return;
    setIdx((i) => {
      const next = (i + dir + n) % n;
      followLatest.current = next === 0;
      return next;
    });
  };

  const closeSheet = () => {
    setSheet(null);
    setFlipLock(true);
  };
  const openSheet = (s: "params" | "fav" | "hist") => setSheet(s);

  useEffect(() => {
    if (!flipLock) return;
    const stop = (e: Event) => {
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

  const jump = (section: string) => {
    useApp.getState().setUI({ paramsJump: section });
    setSheet("params");
  };

  return (
    <div className="relative flex h-full flex-col bg-stage text-on-stage" style={{ background: "#141210", color: "#f3eee6" }}>
      <div className="relative min-h-0 flex-1">
        {url ? (
          <div className="relative h-full">
            <img src={url} alt="" className="h-full w-full object-contain" />
            {done.length > 1 && !flipLock && (
              <>
                <button className="absolute inset-y-0 left-0 w-1/2" onClick={() => go(1)} aria-label="上一张" />
                <button className="absolute inset-y-0 right-0 w-1/2" onClick={() => go(-1)} aria-label="下一张" />
              </>
            )}
          </div>
        ) : (
          <div className="grid h-full place-items-center px-8 text-center text-[13px] text-stage-muted">
            还没有图。先去参数里写提示词，再点绘一张。
          </div>
        )}
      </div>
      {item && (
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-2 text-[11px] text-stage-muted">
          <button onClick={() => jump("model")}>{modelLabel(item.model)}</button>
          <button onClick={() => jump("size")}>
            {item.width}×{item.height}
          </button>
          <button onClick={() => jump("steps")}>{item.steps}步</button>
          <button onClick={() => jump("sampler")}>{samplerLabel(item.sampler)}</button>
          <button
            onClick={() => {
              useApp.getState().setPureParams({ seed: item.seed });
              jump("seed");
            }}
          >
            {item.seed}
          </button>
          <span className={left > 0 ? "text-danger" : "text-good"}>{left > 0 ? `${left}s` : "可生图"}</span>
        </div>
      )}
      <div className="flex items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-2">
        <IconBtn className="text-on-stage" onClick={() => openSheet("params")}>
          <SlidersHorizontal className="size-5" />
        </IconBtn>
        <IconBtn className="text-on-stage" onClick={() => openSheet("fav")}>
          <Bookmark className="size-5" />
        </IconBtn>
        <PrimaryBtn
          className="flex-1"
          busy={Boolean(phase)}
          onClick={() => {
            if (phase) {
              cancelPureDraw();
              return;
            }
            void drawOne(setPhase);
          }}
        >
          {phase ? "取消" : "绘一张"}
        </PrimaryBtn>
        <IconBtn
          className="text-on-stage"
          onClick={async () => {
            if (!item?.blobId) return;
            const u = await imageUrl(item.blobId);
            if (!u) return;
            downloadBlob(await fetch(u).then((r) => r.blob()), String(item.seed));
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }}
        >
          {saved ? <Check className="size-5 text-good" /> : <Download className="size-5" />}
        </IconBtn>
        <IconBtn className="text-on-stage" onClick={() => openSheet("hist")}>
          <Clock className="size-5" />
        </IconBtn>
      </div>

      {sheet === "params" && <PureParamsSheet onClose={closeSheet} />}
      {sheet === "fav" && <FavSheet currentBlob={item?.blobId} onClose={closeSheet} />}
      {sheet === "hist" && (
        <HistSheet
          items={done}
          activeId={item?.id}
          onClose={closeSheet}
          onPreview={(i) => {
            followLatest.current = i === 0;
            setIdx(i);
            closeSheet();
          }}
        />
      )}
    </div>
  );
}

function Sheet({
  title,
  onClose,
  extra,
  children,
}: {
  title: string;
  onClose: () => void;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-overlay/50">
      <button className="flex-1" onClick={onClose} />
      <div className="flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
          <div className="text-[16px] font-semibold">{title}</div>
          <div className="flex items-center gap-2">
            {extra}
            <button onClick={onClose} aria-label="关闭">
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

function FavSheet({
  currentBlob,
  onClose,
}: {
  currentBlob?: string;
  onClose: () => void;
}) {
  const favorites = useApp((s) => s.favorites);
  const [openId, setOpenId] = useState<string | null>(null);
  const current = favorites.find((f) => f.id === openId);
  if (current) {
    return (
      <FavDetail
        fav={current}
        currentBlob={currentBlob}
        onBack={() => setOpenId(null)}
        onClose={onClose}
        onFill={() => undefined}
      />
    );
  }
  return (
    <Sheet
      title="收藏"
      onClose={onClose}
      extra={
        <button
          className="rounded-full border border-line bg-card px-3 py-1 text-[12px]"
          onClick={() => useApp.getState().addFavorite(currentBlob)}
        >
          保存当前
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {favorites.map((f) => (
          <button
            key={f.id}
            className="flex items-center gap-3 rounded-[18px] border border-line bg-card px-3 py-2 text-left"
            onClick={() => setOpenId(f.id)}
          >
            <RatioThumb blobId={f.blobId} w={f.params.width} h={f.params.height} />
            <div className="min-w-0 flex-1 truncate text-[14px]">{f.name}</div>
            <span className="text-[16px] text-muted">›</span>
          </button>
        ))}
        {favorites.length === 0 && <div className="py-10 text-center text-[13px] text-muted">还没有收藏。点右上角保存当前参数。</div>}
      </div>
    </Sheet>
  );
}

function FavDetail({
  fav,
  currentBlob,
  onBack,
  onClose,
  onFill,
}: {
  fav: FavoriteItem;
  currentBlob?: string;
  onBack: () => void;
  onClose: () => void;
  onFill: () => void;
}) {
  const [name, setName] = useState(fav.name);
  useEffect(() => setName(fav.name), [fav.id, fav.name]);
  const p = fav.params;
  const chars = p.characters.filter((c) => c.prompt.trim());
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-overlay/50">
      <button className="flex-1" onClick={onClose} />
      <div className="flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <button className="inline-flex items-center gap-1 text-[14px]" onClick={onBack}>
            <ChevronLeft className="size-4" /> 返回
          </button>
          <button onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
          <div className="mb-1 text-[13px] text-muted">名称</div>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              const t = name.trim() || "未命名";
              setName(t);
              if (t !== fav.name) useApp.getState().patchFavorite(fav.id, { name: t });
            }}
          />
          <div className="mt-3 flex gap-2">
            <button
              className="h-11 flex-1 rounded-full bg-ink text-[14px] font-medium text-bg"
              onClick={() => {
                const next = structuredClone(fav.params);
                if (next.seed != null) next.seedLocked = true;
                useApp.getState().setPureParams(next);
                useApp.getState().toast("已填入");
                onFill();
              }}
            >
              填入
            </button>
            <button
              className="h-11 flex-1 rounded-full bg-danger text-[14px] font-medium text-white"
              onClick={() => {
                useApp.getState().deleteFavorite(fav.id);
                onBack();
              }}
            >
              删除
            </button>
          </div>
          <Field label="正面提示词" text={promptPreview(p) || "（空）"} />
          <Field label="负面提示词" text={p.negative || "（空）"} />
          {chars.length > 0 &&
            chars.map((c, i) => (
              <div key={c.id}>
                <Field label={c.name ? `角色提示词 · ${c.name}` : `角色提示词 ${i + 1}`} text={c.prompt} />
                {c.uc?.trim() ? <Field label={c.name ? `角色负面 · ${c.name}` : `角色负面 ${i + 1}`} text={c.uc} /> : null}
              </div>
            ))}
          <div className="mt-3 text-[12px] leading-5 text-muted">
            {modelLabel(p.model)} · {p.width}×{p.height} · {p.steps}步 · {samplerLabel(p.sampler)} · 种子 {p.seed ?? "随机"}
            {p.seedLocked ? "（已锁）" : ""} · CFG {p.scale} · 噪声{" "}
            {NOISE_SCHEDULES.find((n) => n.id === p.noiseSchedule)?.label ?? p.noiseSchedule} · rescale {p.cfgRescale}
            {p.varietyPlus ? " · Variety+" : ""}
            {p.decrisper ? " · Decrisper" : ""}
          </div>
          <button
            className="mt-4 mb-2 h-11 w-full rounded-full border border-line bg-card text-[14px] disabled:opacity-40"
            disabled={!currentBlob}
            onClick={() => {
              if (!currentBlob) return;
              useApp.getState().setFavoriteThumb(fav.id, currentBlob);
            }}
          >
            应用当前图片为配图
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-3">
      <div className="mb-1 text-[12px] text-muted">{label}</div>
      <div className="whitespace-pre-wrap rounded-[16px] bg-surface px-3.5 py-3 text-[13px] leading-relaxed">{text}</div>
    </div>
  );
}

function RatioThumb({ blobId, w, h }: { blobId?: string; w: number; h: number }) {
  const [u, setU] = useState<string | null>(null);
  useEffect(() => {
    if (blobId) void imageUrl(blobId).then(setU);
    else setU(null);
  }, [blobId]);
  const ratio = w > 0 && h > 0 ? w / h : 832 / 1216;
  const height = 72;
  const width = Math.max(40, Math.min(72, Math.round(height * ratio)));
  return (
    <div className="shrink-0 overflow-hidden rounded-[8px] bg-dim" style={{ width, height }}>
      {u ? <img src={u} alt="" className="size-full object-contain" /> : null}
    </div>
  );
}

function HistSheet({
  items,
  activeId,
  onClose,
  onPreview,
}: {
  items: HistoryItem[];
  activeId?: string;
  onClose: () => void;
  onPreview: (i: number) => void;
}) {
  return (
    <Sheet title="历史" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((h, i) => (
          <HistCell key={h.id} item={h} active={h.id === activeId} onPreview={() => onPreview(i)} />
        ))}
        {items.length === 0 && <div className="col-span-3 py-10 text-center text-[13px] text-muted">还没有历史</div>}
      </div>
    </Sheet>
  );
}

function HistCell({ item, active, onPreview }: { item: HistoryItem; active?: boolean; onPreview: () => void }) {
  const [u, setU] = useState<string | null>(null);
  const hold = useRef<number | null>(null);
  const held = useRef(false);
  useEffect(() => {
    if (item.blobId) void imageUrl(item.blobId).then(setU);
  }, [item.blobId]);
  const clear = () => {
    if (hold.current) window.clearTimeout(hold.current);
    hold.current = null;
  };
  const onDown = (e: PE<HTMLDivElement>) => {
    held.current = false;
    clear();
    hold.current = window.setTimeout(() => {
      held.current = true;
    }, HOLD_MS);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  return (
    <div
      className={
        active
          ? "relative overflow-hidden rounded-[8px] bg-dim ring-2 ring-red-500 ring-offset-1 ring-offset-bg"
          : "relative overflow-hidden rounded-[8px] bg-dim"
      }
      onPointerDown={onDown}
      onPointerUp={(e) => {
        const was = held.current;
        clear();
        e.stopPropagation();
        if (was) useApp.getState().deleteHistory(item.id);
        else onPreview();
      }}
      onPointerCancel={clear}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="aspect-square">
        {u && <img src={u} alt="" className="size-full object-cover" />}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-6 text-[10px] leading-tight text-white">
        <div>{modelShort(item.model)}</div>
        <div>{samplerShort(item.sampler)}</div>
      </div>
      <button
        className="absolute bottom-1 right-1 z-10 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] text-white"
        onClick={(e) => {
          e.stopPropagation();
          const p = item.params;
          if (p) {
            const next = structuredClone(p);
            next.seed = item.seed;
            next.seedLocked = true;
            useApp.getState().setPureParams(next);
          } else {
            useApp.getState().setPureParams({
              model: item.model,
              width: item.width,
              height: item.height,
              steps: item.steps,
              sampler: item.sampler,
              seed: item.seed,
              seedLocked: true,
              negative: item.negative,
              promptMid: item.prompt,
              merged: true,
            });
          }
          useApp.getState().toast("已应用参数");
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        应用参数
      </button>
    </div>
  );
}

function PureParamsSheet({ onClose }: { onClose: () => void }) {
  const params = useApp((s) => s.pureParams);
  const grok = useApp((s) => s.settings.grokModelId);
  const chat = fakePureChat(params, grok);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-overlay/40">
      <div className="mt-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <div className="font-serif text-[18px]">参数设置</div>
          <button onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4">
            <ReadMeta />
          </div>
          <ParamsPane chat={chat} mode="pure" />
        </div>
      </div>
    </div>
  );
}

function ReadMeta() {
  return (
    <label className="mb-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-card text-[13px]">
      <ScanSearch className="size-4" />
      看图识参
      <input
        type="file"
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        className="hidden"
        onChange={async (e) => {
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
            const chars = meta.characters?.length
              ? meta.characters.map((c, i) => ({
                  id: p.characters[i]?.id || `c${i}`,
                  name: p.characters[i]?.name || `角色${i + 1}`,
                  enabled: true,
                  prompt: c.prompt,
                  uc: c.uc,
                  x: c.x,
                  y: c.y,
                }))
              : p.characters;
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
              sampler: (meta.sampler as ImageParams["sampler"]) || p.sampler,
              noiseSchedule: (meta.noiseSchedule as ImageParams["noiseSchedule"]) || p.noiseSchedule,
              model: known ? ((NAI_MODELS.find((m) => m.id === meta.model || m.wire === meta.model)?.id ?? p.model) as ImageParams["model"]) : p.model,
              characters: chars,
            });
            useApp.getState().toast("已识别参数");
          } catch {
            useApp.getState().toast("识别失败，不是带参数的 NAI PNG");
          }
        }}
      />
    </label>
  );
}

async function drawOne(setPhase: (v: "uploading" | "generating" | "receiving" | null) => void) {
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
      },
    });
    const rec: HistoryItem = {
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
      status: "done",
    };
    useApp.getState().addHistory(rec);
  } catch (e) {
    useApp.getState().toast(imageFailText(e, ac.signal));
  } finally {
    if (drawAbort === ac) drawAbort = null;
    drawing = false;
    setPhase(null);
  }
}
