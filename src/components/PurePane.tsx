import { useEffect, useRef, useState, type PointerEvent as PE, type ReactNode } from "react";
import { Bookmark, Check, ChevronLeft, Clock, Download, Eye, Folder, MoreHorizontal, Pencil, ScanSearch, SlidersHorizontal, Star, X } from "lucide-react";
import { parseNaiPng } from "@/lib/png-meta";
import { buildNaiPayload, modelLabel, modelShort, samplerLabel, samplerShort } from "@/lib/nai";
import { COOLDOWN_MS, NAI_MODELS, NOISE_SCHEDULES } from "@/lib/constants";
import { imageUrl } from "@/lib/idb";
import { fakePureChat, useApp, countFavsInGroup, favGroupDescendants } from "@/lib/store";
import { promptPreview } from "@/lib/presets";
import type { FavoriteItem, FavGroup, HistoryItem, ImageParams } from "@/lib/types";
import { afterPaint, generateNai, genPhaseLabel, imageFailText } from "@/lib/engine";
import { autoScrollNearEdge, downloadBlob, indexFromY, moveId, nearestScroller, randomSeed, sortHistoryNewestFirst, uid } from "@/lib/utils";
import { ParamsPane } from "./ParamsPane";
import { IconBtn, PrimaryBtn, TextArea, TextInput, useCooldown } from "./ui-kit";

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
  const [viewId, setViewId] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [phase, setPhase] = useState<"uploading" | "generating" | "receiving" | null>(null);
  const [flipLock, setFlipLock] = useState(false);
  const [peekId, setPeekId] = useState<string | null>(null);
  const peek = useApp((s) => (peekId ? s.favorites.find((f) => f.id === peekId) : undefined));

  const done = sortHistoryNewestFirst(history.filter((h) => h.status === "done" && h.blobId));
  const found = viewId ? done.findIndex((h) => h.id === viewId) : -1;
  const idx = found >= 0 ? found : 0;
  const item = done[idx];
  const shownBlob = peek?.blobId || item?.blobId;

  useEffect(() => {
    let gone = false;
    if (shownBlob) {
      void imageUrl(shownBlob).then((u) => {
        if (!gone) setUrl(u);
      });
    } else setUrl(null);
    return () => {
      gone = true;
    };
  }, [shownBlob]);

  const go = (dir: -1 | 1) => {
    if (peekId) {
      setPeekId(null);
      return;
    }
    const n = done.length;
    if (n < 2) return;
    const next = (idx + dir + n) % n;
    setViewId(done[next].id);
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
      {item && !peek && (
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
      {peek && (
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-2 text-[11px] text-stage-muted">
          <button onClick={() => jump("model")}>{modelLabel(peek.params.model)}</button>
          <button onClick={() => jump("size")}>
            {peek.params.width}×{peek.params.height}
          </button>
          <button onClick={() => jump("steps")}>{peek.params.steps}步</button>
          <button onClick={() => jump("sampler")}>{samplerLabel(peek.params.sampler)}</button>
          <span>{peek.params.seed ?? "随机"}</span>
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
            void drawOne(setPhase, (id) => {
              setPeekId(null);
              setViewId(id);
            });
          }}
        >
          {phase ? "取消" : "绘一张"}
        </PrimaryBtn>
        <IconBtn
          className="text-on-stage"
          onClick={async () => {
            if (!shownBlob) return;
            const u = await imageUrl(shownBlob);
            if (!u) return;
            downloadBlob(await fetch(u).then((r) => r.blob()), String(peek?.params.seed ?? item?.seed ?? "image"));
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
      {sheet === "fav" && (
        <FavSheet currentBlob={item?.blobId} previewId={peekId} onPreview={setPeekId} onClose={closeSheet} />
      )}
      {sheet === "hist" && (
        <HistSheet
          items={done}
          activeId={item?.id}
          onClose={closeSheet}
          onPreview={(i) => {
            const row = done[i];
            if (row) setViewId(row.id);
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
  header,
  children,
}: {
  title: string;
  onClose: () => void;
  extra?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-overlay/50">
      <button className="flex-1" onClick={onClose} />
      <div className="flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        {header ?? (
          <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
            <div className="text-[16px] font-semibold">{title}</div>
            <div className="flex items-center gap-2">
              {extra}
              <button onClick={onClose} aria-label="关闭">
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

function GripBars() {
  return (
    <span className="flex flex-col items-center justify-center gap-[3.5px] text-current" aria-hidden>
      <span className="h-[2px] w-4 rounded-full bg-current" />
      <span className="h-[2px] w-4 rounded-full bg-current" />
      <span className="h-[2px] w-4 rounded-full bg-current" />
    </span>
  );
}

type OrderSnap = { groups: Record<string, number>; favs: Record<string, number> };
type MenuState = { kind: "fav" | "group"; id: string; top: number; right: number };
type MoveState = { kind: "fav" | "group"; id: string };

function byOrder<T extends { id: string; order?: number; starred?: boolean }>(
  rows: T[],
  pick: (id: string) => number | undefined,
  starredFirst: boolean,
) {
  return [...rows].sort((a, b) => {
    if (starredFirst && Boolean(a.starred) !== Boolean(b.starred)) return a.starred ? -1 : 1;
    return (pick(a.id) ?? a.order ?? 0) - (pick(b.id) ?? b.order ?? 0);
  });
}

function applyPureParams(next: ImageParams) {
  const s = useApp.getState();
  if (s.settings.pureCharLocked) {
    next = { ...next, characters: structuredClone(s.pureParams.characters), useCoords: s.pureParams.useCoords };
  }
  s.setPureParams(next);
}

function FavSheet({
  currentBlob,
  previewId,
  onPreview,
  onClose,
}: {
  currentBlob?: string;
  previewId: string | null;
  onPreview: (id: string) => void;
  onClose: () => void;
}) {
  const favorites = useApp((s) => s.favorites);
  const favGroups = useApp((s) => s.favGroups);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [holdId, setHoldId] = useState<string | null>(null);
  const [draft, setDraft] = useState<OrderSnap | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [move, setMove] = useState<MoveState | null>(null);
  const [naming, setNaming] = useState<{ id?: string; name: string } | null>(null);
  const [askDelete, setAskDelete] = useState<string | null>(null);
  const thumbs = useApp((s) => s.settings.favThumbs === true);
  const listRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef(0);
  const press = useRef<{ y: number } | null>(null);
  const sortRef = useRef(false);
  const draftRef = useRef<OrderSnap | null>(null);
  const dragRef = useRef<{ id: string; lane: string } | null>(null);
  const lastY = useRef(0);
  const rafRef = useRef(0);

  const gOrder = (id: string) => draft?.groups[id];
  const fOrder = (id: string) => draft?.favs[id];
  const pinStars = !(sortMode && draft);
  const groupsOf = (parentId: string | null) =>
    byOrder(
      favGroups.filter((g) => (g.parentId ?? null) === parentId),
      gOrder,
      pinStars,
    );
  const favsOf = (groupId: string | null) =>
    byOrder(
      favorites.filter((f) => (f.groupId ?? null) === groupId),
      fOrder,
      pinStars,
    );
  const current = favorites.find((f) => f.id === openId);
  const editing = favorites.find((f) => f.id === editId);

  const saveDraft = () => {
    const d = draftRef.current;
    if (!sortRef.current || !d) return;
    sortRef.current = false;
    useApp.getState().setFavOrders(d.groups, d.favs);
    draftRef.current = null;
    setDraft(null);
    setSortMode(false);
    setDragId(null);
  };

  const close = () => {
    saveDraft();
    onClose();
  };

  useEffect(() => {
    sortRef.current = sortMode;
  }, [sortMode]);

  useEffect(() => {
    if (!sortMode) return;
    const applyY = (y: number) => {
      const d = dragRef.current;
      const cur = draftRef.current;
      if (!d || !cur) return;
      const nodes = listRef.current?.querySelectorAll<HTMLElement>(`[data-drag-lane="${d.lane}"]`);
      if (!nodes?.length) return;
      const ids = Array.from(nodes)
        .map((el) => el.dataset.rowId)
        .filter((id): id is string => Boolean(id));
      const next = moveId(ids, d.id, indexFromY(nodes, y));
      if (next.join("\0") === ids.join("\0")) return;
      const laneGroups = d.lane.startsWith("g:");
      const map = { ...(laneGroups ? cur.groups : cur.favs) };
      next.forEach((id, i) => {
        map[id] = i;
      });
      const updated = laneGroups ? { ...cur, groups: map } : { ...cur, favs: map };
      draftRef.current = updated;
      setDraft(updated);
    };
    const tick = () => {
      rafRef.current = 0;
      if (!dragRef.current) return;
      const scroller = nearestScroller(listRef.current);
      const dy = scroller ? autoScrollNearEdge(scroller, lastY.current) : 0;
      applyY(lastY.current);
      if (dy) rafRef.current = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      lastY.current = e.clientY;
      const scroller = nearestScroller(listRef.current);
      const dy = scroller ? autoScrollNearEdge(scroller, e.clientY) : 0;
      applyY(e.clientY);
      if (dy && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    const onUp = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      const scroller = nearestScroller(listRef.current);
      if (scroller) scroller.style.touchAction = "";
      dragRef.current = null;
      setDragId(null);
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sortMode]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pressTimer.current);
      if (sortRef.current && draftRef.current) useApp.getState().setFavOrders(draftRef.current.groups, draftRef.current.favs);
    };
  }, []);

  const clearPress = () => {
    window.clearTimeout(pressTimer.current);
    press.current = null;
    setHoldId(null);
  };

  const enterSort = () => {
    if (favorites.length + favGroups.length < 2) return;
    const snap: OrderSnap = { groups: {}, favs: {} };
    const parents = new Set<string | null>([null]);
    for (const g of favGroups) parents.add(g.parentId ?? null);
    for (const f of favorites) parents.add(f.groupId ?? null);
    for (const p of parents) {
      groupsOf(p).forEach((g, i) => {
        snap.groups[g.id] = i;
      });
      favsOf(p).forEach((f, i) => {
        snap.favs[f.id] = i;
      });
    }
    draftRef.current = { groups: { ...snap.groups }, favs: { ...snap.favs } };
    sortRef.current = true;
    setDraft(draftRef.current);
    setSortMode(true);
    setHoldId(null);
    setMenu(null);
    try {
      navigator.vibrate?.(12);
    } catch {
      /* */
    }
  };

  const cancelSort = () => {
    sortRef.current = false;
    draftRef.current = null;
    dragRef.current = null;
    setDraft(null);
    setDragId(null);
    setSortMode(false);
  };

  const finishSort = () => {
    saveDraft();
  };

  const onRowPointerDown = (e: PE<HTMLElement>) => {
    if (sortRef.current) return;
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    clearPress();
    if (favorites.length + favGroups.length < 2) return;
    const id = e.currentTarget.dataset.rowId || "";
    press.current = { y: e.clientY };
    setHoldId(id);
    pressTimer.current = window.setTimeout(enterSort, HOLD_MS);
  };

  const onRowPointerMove = (e: PE<HTMLElement>) => {
    const p = press.current;
    if (!p || sortRef.current) return;
    if (Math.abs(e.clientY - p.y) > 12) clearPress();
  };

  const onGripDown = (e: PE<HTMLElement>, id: string, lane: string) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id, lane };
    setDragId(id);
    lastY.current = e.clientY;
    const el = nearestScroller(listRef.current);
    if (el) el.style.touchAction = "none";
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* */
    }
  };

  const openMenu = (el: HTMLElement, kind: "fav" | "group", id: string) => {
    const r = el.getBoundingClientRect();
    const menuW = 132;
    const menuH = kind === "group" ? 168 : 126;
    let right = window.innerWidth - r.right;
    right = Math.max(8, Math.min(right, window.innerWidth - menuW - 8));
    let top = r.bottom + 4;
    if (top + menuH > window.innerHeight - 8) top = Math.max(8, r.top - menuH - 4);
    setMenu({ kind, id, top, right });
  };

  const fillFav = (fav: FavoriteItem) => {
    const next = structuredClone(fav.params);
    next.seedLocked = false;
    applyPureParams(next);
    useApp.getState().toast("已填入");
  };

  const rowHandlers = {
    onPointerDown: onRowPointerDown,
    onPointerMove: onRowPointerMove,
    onPointerUp: clearPress,
    onPointerCancel: clearPress,
    onContextMenu: (e: { preventDefault(): void }) => e.preventDefault(),
  };

  const renderGroups = (parentId: string | null, depth: number): ReactNode =>
    groupsOf(parentId).map((g) => (
      <div key={g.id}>
        <div
          data-drag-lane={`g:${parentId ?? "root"}`}
          data-row-id={g.id}
          className={`flex items-center gap-2 py-1.5 select-none ${dragId === g.id ? "bg-ink/10" : ""} ${!sortMode && holdId === g.id ? "bg-ink/5" : ""}`}
          style={{ marginLeft: depth * 12, touchAction: sortMode ? "pan-y" : "manipulation" }}
          {...rowHandlers}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-line text-primary">
              <Folder className="size-3" />
            </span>
            {g.starred && <Star className="size-3 shrink-0 fill-primary text-primary" />}
            <div className="min-w-0 truncate text-[15px] font-bold">{g.name}</div>
          </div>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center text-muted"
            aria-label={g.collapsed ? "展开" : "收起"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => useApp.getState().toggleFavGroup(g.id)}
          >
            <svg viewBox="0 0 12 12" className={`size-3 shrink-0 fill-current transition ${g.collapsed ? "" : "rotate-180"}`} aria-hidden>
              <path d="M6 9.2 1.4 3.2h9.2L6 9.2z" />
            </svg>
          </button>
          {sortMode ? (
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center text-ink/55"
              aria-label="拖动排序"
              style={{ touchAction: "none" }}
              onPointerDown={(e) => onGripDown(e, g.id, `g:${parentId ?? "root"}`)}
            >
              <GripBars />
            </button>
          ) : (
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center text-muted"
              aria-label="更多"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => openMenu(e.currentTarget, "group", g.id)}
            >
              <MoreHorizontal className="size-4" />
            </button>
          )}
        </div>
        {!g.collapsed && (
          <div>
            {renderGroups(g.id, depth + 1)}
            {thumbs
              ? renderThumbs(favsOf(g.id), depth + 1)
              : favsOf(g.id).map((f) => renderFav(f, depth + 1))}
          </div>
        )}
      </div>
    ));

  const renderFav = (f: FavoriteItem, depth: number) => (
    <div
      key={f.id}
      data-drag-lane={`f:${f.groupId ?? "root"}`}
      data-row-id={f.id}
      className={`mb-2 flex items-stretch gap-3 rounded-[18px] border border-line bg-card px-3 py-2 select-none ${dragId === f.id ? "bg-ink/15" : ""} ${!sortMode && holdId === f.id ? "bg-ink/8" : ""}`}
      style={{ marginLeft: depth * 12, touchAction: sortMode ? "pan-y" : "manipulation" }}
      {...rowHandlers}
    >
      <RatioThumb blobId={f.blobId} w={f.params.width} h={f.params.height} />
      <div className="flex min-h-[72px] min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center">
          <div className="flex min-w-0 items-center gap-1">
            {f.starred && <Star className="size-3 shrink-0 fill-primary text-primary" />}
            <div className="truncate text-[14px] text-ink">{f.name}</div>
          </div>
        </div>
        {!sortMode && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-ink"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => fillFav(f)}
            >
              填入
            </button>
            <span className="flex-1" />
            <button
              type="button"
              className="flex size-7 items-center justify-center text-muted"
              aria-label="查看"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setOpenId(f.id)}
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              className="flex size-7 items-center justify-center text-muted"
              aria-label="编辑"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setEditId(f.id)}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              className="flex size-7 items-center justify-center text-muted"
              aria-label="更多"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => openMenu(e.currentTarget, "fav", f.id)}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        )}
      </div>
      {sortMode && (
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center text-ink/55"
          aria-label="拖动排序"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => onGripDown(e, f.id, `f:${f.groupId ?? "root"}`)}
        >
          <GripBars />
        </button>
      )}
    </div>
  );

  const renderThumbs = (rows: FavoriteItem[], depth: number) =>
    rows.length ? (
      <div className="mb-3 grid grid-cols-4 items-start gap-x-1.5 gap-y-2" style={{ marginLeft: depth * 12 }}>
        {rows.map((f) => (
          <FavThumb
            key={f.id}
            fav={f}
            active={previewId === f.id}
            onPick={() => onPreview(f.id)}
            onHold={() => setOpenId(f.id)}
            onApply={() => fillFav(f)}
            onMenu={(el) => openMenu(el, "fav", f.id)}
          />
        ))}
      </div>
    ) : null;

  if (current) {
    return (
      <FavDetail fav={current} currentBlob={currentBlob} onBack={() => setOpenId(null)} onClose={onClose} onFill={() => undefined} />
    );
  }

  const pill = "rounded-full border border-line bg-card px-3 py-1 text-[12px]";
  return (
    <>
      <Sheet
        title="收藏"
        onClose={close}
        header={
          sortMode ? (
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
              <button type="button" className="text-[15px] font-medium text-primary" onClick={cancelSort}>
                取消
              </button>
              <button type="button" className="text-[15px] font-medium text-primary" onClick={finishSort}>
                完成
              </button>
              <button type="button" onClick={close} aria-label="关闭">
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1.5 px-4 py-3">
              <div className="shrink-0 text-[16px] font-semibold">收藏</div>
              <button
                type="button"
                className={
                  thumbs
                    ? "shrink-0 rounded-full bg-danger px-2.5 py-1 text-[12px] text-white"
                    : "shrink-0 rounded-full border border-line bg-card px-2.5 py-1 text-[12px]"
                }
                onClick={() => useApp.getState().setSettings({ favThumbs: !thumbs })}
              >
                缩略图
              </button>
              <span className="min-w-0 flex-1" />
              <button type="button" className={pill} onClick={() => setNaming({ name: "" })}>
                创建分组
              </button>
              <button type="button" className={pill} onClick={() => useApp.getState().addFavorite(currentBlob)}>
                保存当前
              </button>
              <button type="button" onClick={close} aria-label="关闭">
                <X className="size-5" />
              </button>
            </div>
          )
        }
      >
        <div ref={listRef}>
          {renderGroups(null, 0)}
          {thumbs ? renderThumbs(favsOf(null), 0) : favsOf(null).map((f) => renderFav(f, 0))}
          {favorites.length === 0 && favGroups.length === 0 && (
            <div className="py-10 text-center text-[13px] text-muted">还没有收藏。点右上角保存当前参数。</div>
          )}
        </div>
      </Sheet>
      {menu && (
        <div className="fixed inset-0 z-40" onClick={() => setMenu(null)}>
          <div
            className="absolute w-[132px] overflow-hidden rounded-[14px] border border-line bg-card text-left text-[14px] text-ink shadow-lg"
            style={{ top: menu.top, right: menu.right }}
            onClick={(e) => e.stopPropagation()}
          >
            {menu.kind === "group" && (
              <button
                type="button"
                className="block w-full px-3 py-2.5 text-left"
                onClick={() => {
                  const g = favGroups.find((x) => x.id === menu.id);
                  setNaming({ id: menu.id, name: g?.name ?? "" });
                  setMenu(null);
                }}
              >
                重命名
              </button>
            )}
            <button
              type="button"
              className={`block w-full px-3 py-2.5 text-left ${menu.kind === "group" ? "border-t border-line" : ""}`}
              onClick={() => {
                if (menu.kind === "fav") useApp.getState().deleteFavorite(menu.id);
                else setAskDelete(menu.id);
                setMenu(null);
              }}
            >
              删除
            </button>
            <button
              type="button"
              className="block w-full border-t border-line px-3 py-2.5 text-left"
              onClick={() => {
                setMove({ kind: menu.kind, id: menu.id });
                setMenu(null);
              }}
            >
              移动
            </button>
            <button
              type="button"
              className="block w-full border-t border-line px-3 py-2.5 text-left"
              onClick={() => {
                if (menu.kind === "fav") useApp.getState().toggleFavoriteStar(menu.id);
                else useApp.getState().toggleFavGroupStar(menu.id);
                setMenu(null);
              }}
            >
              星标
            </button>
          </div>
        </div>
      )}
      {move && (
        <MoveSheet
          move={move}
          groups={favGroups}
          onClose={() => setMove(null)}
          onPick={(parentId) => {
            if (move.kind === "fav") useApp.getState().moveFavorite(move.id, parentId);
            else useApp.getState().moveFavGroup(move.id, parentId);
            setMove(null);
          }}
        />
      )}
      {naming && (
        <NameDialog
          title={naming.id ? "重命名" : "创建分组"}
          value={naming.name}
          onClose={() => setNaming(null)}
          onOk={(name) => {
            if (naming.id) useApp.getState().renameFavGroup(naming.id, name);
            else useApp.getState().addFavGroup(name);
            setNaming(null);
          }}
        />
      )}
      {askDelete && (
        <ConfirmDialog
          text={
            countFavsInGroup(favGroups, favorites, askDelete) > 0
              ? `删除这个分组？里面的 ${countFavsInGroup(favGroups, favorites, askDelete)} 条收藏会一起删掉。`
              : "删除这个分组？"
          }
          onClose={() => setAskDelete(null)}
          onOk={() => {
            useApp.getState().deleteFavGroup(askDelete);
            setAskDelete(null);
          }}
        />
      )}
      {editing && <FavEdit fav={editing} onClose={() => setEditId(null)} />}
    </>
  );
}

function MoveSheet({
  move,
  groups,
  onClose,
  onPick,
}: {
  move: MoveState;
  groups: FavGroup[];
  onClose: () => void;
  onPick: (parentId: string | null) => void;
}) {
  const blocked = move.kind === "group" ? new Set([move.id, ...favGroupDescendants(groups, move.id)]) : new Set<string>();
  const rows: { g: FavGroup; depth: number }[] = [];
  const walk = (parentId: string | null, depth: number) => {
    for (const g of [...groups]
      .filter((x) => (x.parentId ?? null) === parentId)
      .sort((a, b) => {
        if (Boolean(a.starred) !== Boolean(b.starred)) return a.starred ? -1 : 1;
        return a.order - b.order;
      })) {
      if (blocked.has(g.id)) continue;
      rows.push({ g, depth });
      walk(g.id, depth + 1);
    }
  };
  walk(null, 0);
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-overlay/50">
      <button type="button" className="min-h-8 flex-1" onClick={onClose} />
      <div className="flex h-[70%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <div className="text-[16px] font-semibold">移动</div>
          <button type="button" onClick={onClose} aria-label="关闭">
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <button type="button" className="mb-2 h-11 w-full rounded-full border border-line bg-card text-[14px]" onClick={() => onPick(null)}>
            不放进分组
          </button>
          {rows.map(({ g, depth }) => (
            <button
              key={g.id}
              type="button"
              className="mb-2 block h-11 rounded-full border border-line bg-card px-4 text-left text-[14px]"
              style={{ marginLeft: depth * 16, width: `calc(100% - ${depth * 16}px)` }}
              onClick={() => onPick(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NameDialog({
  title,
  value,
  onClose,
  onOk,
}: {
  title: string;
  value: string;
  onClose: () => void;
  onOk: (name: string) => void;
}) {
  const [text, setText] = useState(value);
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-overlay/50 px-8">
      <div className="w-full rounded-[20px] bg-bg p-4 text-ink">
        <div className="mb-3 text-[15px] font-semibold">{title}</div>
        <TextInput value={text} autoFocus placeholder="分组名称" onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex justify-end gap-4">
          <button type="button" className="text-[14px] text-muted" onClick={onClose}>
            取消
          </button>
          <button type="button" className="text-[14px] font-medium text-primary" onClick={() => onOk(text)}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ text, onClose, onOk }: { text: string; onClose: () => void; onOk: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-overlay/50 px-8">
      <div className="w-full rounded-[20px] bg-bg p-4 text-ink">
        <div className="text-[14px] leading-relaxed">{text}</div>
        <div className="mt-4 flex justify-end gap-4">
          <button type="button" className="text-[14px] text-muted" onClick={onClose}>
            取消
          </button>
          <button type="button" className="text-[14px] font-medium text-danger" onClick={onOk}>
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

function FavEdit({ fav, onClose }: { fav: FavoriteItem; onClose: () => void }) {
  const p = fav.params;
  const [name, setName] = useState(fav.name);
  const [front, setFront] = useState(p.promptFront);
  const [mid, setMid] = useState(p.promptMid);
  const [back, setBack] = useState(p.promptBack);
  const [negative, setNegative] = useState(p.negative);
  const [chars, setChars] = useState(p.characters.map((c) => ({ id: c.id, prompt: c.prompt, uc: c.uc })));
  const save = () => {
    const params = structuredClone(p);
    params.promptFront = front;
    params.promptMid = mid;
    params.promptBack = back;
    params.negative = negative;
    params.characters = params.characters.map((c) => {
      const hit = chars.find((x) => x.id === c.id);
      return hit ? { ...c, prompt: hit.prompt, uc: hit.uc } : c;
    });
    useApp.getState().patchFavorite(fav.id, { name: name.trim() || "未命名", params });
    useApp.getState().toast("已保存");
    onClose();
  };
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-overlay/50">
      <button type="button" className="min-h-8 flex-1" onClick={onClose} />
      <div className="flex h-[78%] min-h-0 flex-col overflow-hidden rounded-t-[28px] bg-bg text-ink">
        <div className="shrink-0 px-4 py-3 text-[16px] font-semibold">编辑收藏</div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-1 text-[12px] text-muted">标题</div>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          {p.merged ? (
            <>
              <div className="mb-1 mt-3 text-[12px] text-muted">正面提示词</div>
              <TextArea value={mid} onChange={(e) => setMid(e.target.value)} />
            </>
          ) : (
            <>
              <div className="mb-1 mt-3 text-[12px] text-muted">正面提示词前</div>
              <TextArea value={front} onChange={(e) => setFront(e.target.value)} />
              <div className="mb-1 mt-3 text-[12px] text-muted">正面提示词中</div>
              <TextArea value={mid} onChange={(e) => setMid(e.target.value)} />
              <div className="mb-1 mt-3 text-[12px] text-muted">正面提示词后</div>
              <TextArea value={back} onChange={(e) => setBack(e.target.value)} />
            </>
          )}
          <div className="mb-1 mt-3 text-[12px] text-muted">负面提示词</div>
          <TextArea value={negative} onChange={(e) => setNegative(e.target.value)} />
          {chars.map((c, i) => (
            <div key={c.id}>
              <div className="mb-1 mt-3 text-[12px] text-muted">角色{i + 1} 正面</div>
              <TextArea
                value={c.prompt}
                onChange={(e) => setChars((rows) => rows.map((x) => (x.id === c.id ? { ...x, prompt: e.target.value } : x)))}
              />
              <div className="mb-1 mt-3 text-[12px] text-muted">角色{i + 1} 负面</div>
              <TextArea
                value={c.uc}
                onChange={(e) => setChars((rows) => rows.map((x) => (x.id === c.id ? { ...x, uc: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line px-4 py-3">
          <button type="button" className="h-10 px-3 text-[14px]" onClick={onClose}>
            取消
          </button>
          <button type="button" className="h-10 rounded-full bg-ink px-4 text-[14px] font-medium text-bg" onClick={save}>
            保存修改
          </button>
        </div>
      </div>
    </div>
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
                next.seedLocked = false;
                applyPureParams(next);
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

function FavThumb({
  fav,
  active,
  onPick,
  onHold,
  onApply,
  onMenu,
}: {
  fav: FavoriteItem;
  active: boolean;
  onPick: () => void;
  onHold: () => void;
  onApply: () => void;
  onMenu: (el: HTMLElement) => void;
}) {
  const [u, setU] = useState<string | null>(null);
  const hold = useRef<number | null>(null);
  const held = useRef(false);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (fav.blobId) void imageUrl(fav.blobId).then(setU);
    else setU(null);
  }, [fav.blobId]);
  const clear = () => {
    if (hold.current) window.clearTimeout(hold.current);
    hold.current = null;
  };
  const w = fav.params.width > 0 ? fav.params.width : 832;
  const h = fav.params.height > 0 ? fav.params.height : 1216;
  return (
    <div className="flex min-w-0 flex-col">
      <div
        className={`overflow-hidden rounded-[8px] bg-dim ${active ? "ring-2 ring-red-500 ring-offset-1 ring-offset-bg" : ""}`}
        style={{ aspectRatio: `${w} / ${h}` }}
        onPointerDown={(e) => {
          held.current = false;
          moved.current = false;
          start.current = { x: e.clientX, y: e.clientY };
          clear();
          hold.current = window.setTimeout(() => {
            held.current = true;
          }, HOLD_MS);
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - start.current.x) > 10 || Math.abs(e.clientY - start.current.y) > 10) {
            moved.current = true;
            clear();
          }
        }}
        onPointerUp={(e) => {
          const was = held.current;
          const skip = moved.current;
          clear();
          held.current = false;
          e.stopPropagation();
          if (skip) return;
          if (was) onHold();
          else onPick();
        }}
        onPointerCancel={clear}
        onContextMenu={(e) => e.preventDefault()}
      >
        {u ? <img src={u} alt="" className="size-full object-contain" /> : null}
      </div>
      <div className="mt-1 flex items-stretch gap-0.5">
        <button
          type="button"
          className="min-w-0 flex-1 whitespace-nowrap rounded-full border border-line py-0.5 text-[10px] leading-tight text-ink"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
        >
          应用参数
        </button>
        <button
          type="button"
          className="flex w-5 shrink-0 items-center justify-center text-muted"
          aria-label="更多"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onMenu(e.currentTarget);
          }}
        >
          <MoreHorizontal className="size-3" />
        </button>
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
            next.seedLocked = false;
            applyPureParams(next);
          } else {
            useApp.getState().setPureParams({
              model: item.model,
              width: item.width,
              height: item.height,
              steps: item.steps,
              sampler: item.sampler,
              seed: item.seed,
              seedLocked: false,
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

async function drawOne(
  setPhase: (v: "uploading" | "generating" | "receiving" | null) => void,
  showId: (id: string) => void,
) {
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
    showId(rec.id);
  } catch (e) {
    useApp.getState().toast(imageFailText(e, ac.signal));
  } finally {
    if (drawAbort === ac) drawAbort = null;
    drawing = false;
    setPhase(null);
  }
}
