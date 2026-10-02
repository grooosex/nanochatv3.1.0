import { useEffect, useRef, useState } from "react";
import {
  AlignJustify,
  Check,
  Copy,
  Folder as FolderIcon,
  FolderInput,
  FolderPlus,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { cn, autoScrollNearEdge, indexFromY, moveId } from "@/lib/utils";
import { listedChats, useApp } from "@/lib/store";
import { replyStoryText } from "@/lib/reply-markup";
import { ChatAvatar, IconBtn } from "./ui-kit";

const HOLD_MS = 420;

export function Sidebar() {
  const open = useApp((s) => s.ui.sidebar);
  const setUI = useApp((s) => s.setUI);
  const folders = useApp((s) => s.folders);
  const chats = useApp((s) => s.chats);
  const currentId = useApp((s) => s.currentId);
  const ui = useApp((s) => s.ui);
  const theme = useApp((s) => s.settings.theme);
  const { foldersSorted, root, inFolder } = listedChats(folders, chats);
  const [draftOrder, setDraftOrder] = useState<string[] | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; group: string } | null>(null);
  const draftRef = useRef<string[] | null>(null);
  const lastY = useRef(0);
  const rafRef = useRef(0);
  draftRef.current = draftOrder;

  const visualFolders = draftOrder
    ? [...foldersSorted].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id))
    : foldersSorted;
  const visualRoot = draftOrder
    ? [...root].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id))
    : root;
  const visualIn = (fid: string) => {
    const list = inFolder(fid);
    if (!draftOrder) return list;
    return [...list].sort((a, b) => draftOrder.indexOf(a.id) - draftOrder.indexOf(b.id));
  };

  const allOrderIds = () => [
    ...foldersSorted.map((f) => f.id),
    ...foldersSorted.flatMap((f) => inFolder(f.id).map((c) => c.id)),
    ...root.map((c) => c.id),
  ];

  useEffect(() => {
    if (!ui.sortMode) return;
    const applyY = (y: number) => {
      const d = dragRef.current;
      const draft = draftRef.current;
      if (!d || !draft) return;
      const rows = listRef.current?.querySelectorAll<HTMLElement>(`[data-drag-group="${d.group}"]`);
      if (!rows?.length) return;
      const groupIds = Array.from(rows).map((el) => el.dataset.rowId).filter((id): id is string => Boolean(id));
      const from = groupIds.indexOf(d.id);
      const to = indexFromY(rows, y);
      if (from < 0 || from === to) return;
      const nextGroup = moveId(groupIds, d.id, to);
      const out = [...draft];
      const slots = groupIds.map((g) => out.indexOf(g));
      nextGroup.forEach((g, i) => {
        if (slots[i] >= 0) out[slots[i]] = g;
      });
      draftRef.current = out;
      setDraftOrder(out);
    };
    const tick = () => {
      rafRef.current = 0;
      if (!dragRef.current) return;
      const el = listRef.current;
      const dy = el ? autoScrollNearEdge(el, lastY.current) : 0;
      applyY(lastY.current);
      if (dy) rafRef.current = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      lastY.current = e.clientY;
      const el = listRef.current;
      const dy = el ? autoScrollNearEdge(el, e.clientY) : 0;
      applyY(e.clientY);
      if (dy && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    const onUp = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      if (listRef.current) listRef.current.style.touchAction = "";
      if (!dragRef.current) return;
      dragRef.current = null;
      setDraggingId(null);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ui.sortMode]);

  const beginDrag = (e: React.PointerEvent<HTMLElement>, id: string, group: string) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id, group };
    setDraggingId(id);
    lastY.current = e.clientY;
    if (listRef.current) listRef.current.style.touchAction = "none";
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* */
    }
  };

  const beginSort = () => {
    setDraftOrder(allOrderIds());
    setUI({ sortMode: true });
  };

  const exitSidebar = () => {
    setDraftOrder(null);
    setUI({ sidebar: false, selectMode: false, selected: [], sortMode: false, menuId: null });
  };

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex">
      <aside className="relative flex h-full w-[86%] max-w-[360px] flex-col bg-bg shadow-[8px_0_32px_rgb(44_40_36/0.12)]">
        <header className="px-4 pb-2 pt-[calc(env(safe-area-inset-top)+14px)]">
          {ui.sortMode ? (
            <div className="flex items-center justify-between">
              <button
                className="text-[15px] font-medium text-primary"
                onClick={() => {
                  setDraftOrder(null);
                  setUI({ sortMode: false });
                }}
              >
                取消
              </button>
              <button
                className="text-[15px] font-medium text-primary"
                onClick={() => {
                  useApp.getState().reorder(draftOrder ?? allOrderIds());
                  setDraftOrder(null);
                  setUI({ sortMode: false });
                }}
              >
                完成
              </button>
            </div>
          ) : ui.selectMode ? (
            <>
              <div className="flex items-center">
                <button
                  className="shrink-0 text-[15px] font-medium text-primary"
                  onClick={() => {
                    const ids = [
                      ...folders.map((f) => f.id),
                      ...chats.filter((c) => !c.isDraft).map((c) => c.id),
                    ];
                    setUI({ selected: ids });
                  }}
                >
                  全选
                </button>
                <div className="min-w-0 flex-1 px-2 text-center text-[14px] text-muted">
                  已选择 {ui.selected.length} 项
                </div>
                <button
                  className="shrink-0 px-2 text-[15px] font-medium text-primary"
                  onClick={() => setUI({ selectMode: false, selected: [], sortMode: false })}
                >
                  取消
                </button>
                <IconBtn className="-mr-2" onClick={exitSidebar}>
                  <X className="size-5" />
                </IconBtn>
              </div>
              <button type="button" className="mt-2 text-left text-[13px] text-muted" onClick={beginSort}>
                手动排序
              </button>
            </>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <div className="font-serif text-[22px] tracking-wide">绘语</div>
                <div className="mt-0.5 text-[12px] text-muted">角色与故事</div>
              </div>
              <div className="flex items-center">
                <IconBtn
                  className="text-muted"
                  onClick={() => useApp.getState().setSettings({ theme: theme === "dark" ? "light" : "dark" })}
                  aria-label="切换主题"
                >
                  {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
                </IconBtn>
                <IconBtn onClick={exitSidebar}>
                  <X className="size-5" />
                </IconBtn>
              </div>
            </div>
          )}
          {ui.sortMode && (
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              文件夹在上、聊天在下。不按横杠时可滑动，拖到边缘会跟着滚。
            </p>
          )}
        </header>

        <div
          ref={listRef}
          className={cn("flex-1 overflow-y-auto px-4 scroll-thin hold-none", ui.selectMode && !ui.sortMode ? "pb-36" : "pb-6")}
        >
          {!ui.sortMode && (
            <>
              <button
                className="mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-on-primary disabled:opacity-40"
                disabled={ui.selectMode}
                onClick={() => useApp.getState().newDraft()}
              >
                <Plus className="size-4" /> 新建聊天
              </button>
              <button
                className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card text-[14px] disabled:opacity-40"
                disabled={ui.selectMode}
                onClick={() => useApp.getState().addFolder()}
              >
                <FolderPlus className="size-4" /> 创建文件夹
              </button>
            </>
          )}

          {visualFolders.map((f) => (
            <FolderRow
              key={f.id}
              id={f.id}
              name={f.name}
              starred={f.starred}
              collapsed={f.collapsed}
              count={inFolder(f.id).length}
              dragging={draggingId === f.id}
              dragGroup="folders"
              onGripDown={(e) => beginDrag(e, f.id, "folders")}
            >
              {!f.collapsed &&
                visualIn(f.id).map((c) => (
                  <ChatRow
                    key={c.id}
                    id={c.id}
                    nested
                    active={c.id === currentId}
                    dragging={draggingId === c.id}
                    dragGroup={`folder:${f.id}`}
                    onGripDown={(e) => beginDrag(e, c.id, `folder:${f.id}`)}
                  />
                ))}
            </FolderRow>
          ))}
          {visualRoot.map((c) => (
            <ChatRow
              key={c.id}
              id={c.id}
              active={c.id === currentId}
              dragging={draggingId === c.id}
              dragGroup="root"
              onGripDown={(e) => beginDrag(e, c.id, "root")}
            />
          ))}
        </div>

        {ui.selectMode && !ui.sortMode && (
          <div className="absolute inset-x-0 bottom-0 border-t border-line bg-bg px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]">
            {ui.selected.filter((id) => chats.some((c) => c.id === id && !c.isDraft)).length >= 2 && (
              <button
                type="button"
                className="mx-3 mb-2 w-[calc(100%-1.5rem)] rounded-full border border-line bg-card py-2.5 text-[13px] font-medium"
                onClick={() =>
                  setUI({
                    multiCreate: ui.selected.filter((id) => chats.some((c) => c.id === id && !c.isDraft)),
                  })
                }
              >
                创建多人聊天
              </button>
            )}
            <div className="flex justify-around">
              <SelAct icon={<FolderInput className="size-5" />} label="移动" onClick={() => setUI({ moveOpen: true })} />
              <SelAct icon={<Copy className="size-5" />} label="复制" onClick={() => useApp.getState().copySelected()} />
              <SelAct
                icon={<Trash2 className="size-5" />}
                label="删除"
                danger
                onClick={() =>
                  setUI({
                    confirm: {
                      title: "删除所选",
                      body: "聊天记录会一起删掉。",
                      danger: true,
                      onOk: () => useApp.getState().deleteSelected(),
                    },
                  })
                }
              />
              <SelAct icon={<Star className="size-5" />} label="星标" onClick={() => useApp.getState().starSelected()} />
              <SelAct
                icon={<Pencil className="size-5" />}
                label="重命名"
                disabled={ui.selected.length !== 1}
                onClick={() => {
                  const id = ui.selected[0];
                  const chat = chats.find((c) => c.id === id);
                  const folder = folders.find((f) => f.id === id);
                  setUI({
                    rename: { id, kind: folder ? "folder" : "chat", value: chat?.name || folder?.name || "" },
                  });
                }}
              />
            </div>
          </div>
        )}
      </aside>
      <button className="flex-1 bg-overlay/40" onClick={exitSidebar} />
    </div>
  );
}

function SelAct({
  icon,
  label,
  onClick,
  danger,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[11px] font-medium disabled:opacity-30",
        danger ? "text-danger" : "text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function useHold(id: string) {
  const timer = useRef<number | null>(null);
  const startY = useRef(0);
  const held = useRef(false);
  const start = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startY.current = e.clientY;
    held.current = false;
    timer.current = window.setTimeout(() => {
      const ui = useApp.getState().ui;
      if (ui.sortMode || ui.selectMode) return;
      held.current = true;
      useApp.getState().setUI({ selectMode: true, selected: [id], menuId: null });
    }, HOLD_MS);
  };
  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return {
    held,
    onPointerDown: start,
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerMove: (e: React.PointerEvent) => {
      if (Math.abs(e.clientY - startY.current) > 12) clear();
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}

function FolderRow({
  id,
  name,
  starred,
  collapsed,
  count,
  children,
  dragging,
  dragGroup,
  onGripDown,
}: {
  id: string;
  name: string;
  starred: boolean;
  collapsed: boolean;
  count: number;
  children?: React.ReactNode;
  dragging: boolean;
  dragGroup: string;
  onGripDown: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  const selected = useApp((s) => s.ui.selected.includes(id));
  const selectMode = useApp((s) => s.ui.selectMode);
  const sortMode = useApp((s) => s.ui.sortMode);
  const hold = useHold(id);
  const { held, ...holdH } = hold;
  return (
    <div className="mb-1">
      <div
        data-row-id={id}
        data-drag-group={dragGroup}
        {...(sortMode ? {} : holdH)}
        onClick={() => {
          if (held.current) {
            held.current = false;
            return;
          }
          if (sortMode) return;
          if (useApp.getState().ui.selectMode) {
            const cur = useApp.getState().ui.selected;
            useApp.getState().setUI({
              selected: selected ? cur.filter((x) => x !== id) : [...cur, id],
            });
            return;
          }
          useApp.getState().toggleFolder(id);
        }}
        className={cn(
          "flex items-center gap-3 rounded-[18px] px-2 py-2.5 hold-none",
          selected && "bg-dim",
          dragging && "drag-dim",
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-line text-primary">
          <FolderIcon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1 text-[15px] font-medium">
            {starred && <Star className="size-3 shrink-0 fill-primary text-primary" />}
            <span className="min-w-0 truncate">{name}</span>
          </div>
          <div className="text-[12px] text-muted">{count} 项</div>
        </div>
        {selectMode && !sortMode ? (
          <span className="grid size-9 shrink-0 place-items-center">
            <CheckBox on={selected} />
          </span>
        ) : sortMode ? (
          <span
            className="grid size-9 place-items-center text-muted"
            onPointerDown={onGripDown}
            style={{ touchAction: "none" }}
          >
            <AlignJustify className="size-5" />
          </span>
        ) : (
          <span className="text-muted">›</span>
        )}
      </div>
      {children}
    </div>
  );
}

function ChatRow({
  id,
  active,
  nested,
  dragging,
  dragGroup,
  onGripDown,
}: {
  id: string;
  active?: boolean;
  nested?: boolean;
  dragging: boolean;
  dragGroup: string;
  onGripDown: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  const chat = useApp((s) => s.chats.find((c) => c.id === id));
  const ui = useApp((s) => s.ui);
  const hold = useHold(id);
  const { held, ...holdH } = hold;
  if (!chat) return null;
  const selected = ui.selected.includes(id);
  const lastMsg = [...chat.messages].reverse().find((m) => m.content);
  const last =
    chat.remark ||
    (lastMsg && lastMsg.role !== "user" ? replyStoryText(lastMsg.content) || lastMsg.content : lastMsg?.content) ||
    chat.opening;
  const menu = ui.menuId === id;

  return (
    <div className={cn("relative mb-0.5", nested && "ml-3")}>
      <div
        data-row-id={id}
        data-drag-group={dragGroup}
        {...(ui.sortMode ? {} : holdH)}
        onClick={() => {
          if (held.current) {
            held.current = false;
            return;
          }
          if (ui.sortMode) return;
          if (useApp.getState().ui.selectMode) {
            const cur = useApp.getState().ui.selected;
            useApp.getState().setUI({
              selected: selected ? cur.filter((x) => x !== id) : [...cur, id],
            });
            return;
          }
          useApp.getState().openChat(id);
        }}
        className={cn(
          "flex items-center gap-3 rounded-[18px] px-2 py-2 hold-none",
          active && !ui.selectMode && "bg-dim/70",
          selected && "bg-dim",
          dragging && "drag-dim",
        )}
      >
        <ChatAvatar chat={chat} dim={active && !ui.selectMode} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1 text-[15px] font-medium">
            {chat.starred && <Star className="size-3 shrink-0 fill-primary text-primary" />}
            <span className="min-w-0 truncate">{chat.name || "未命名"}</span>
          </div>
          <div className="truncate text-[12px] text-muted">{last || "新的对话"}</div>
        </div>
        {ui.selectMode && !ui.sortMode ? (
          <span className="grid size-9 shrink-0 place-items-center">
            <CheckBox on={selected} />
          </span>
        ) : ui.sortMode ? (
          <span
            className="grid size-9 place-items-center text-muted"
            onPointerDown={onGripDown}
            style={{ touchAction: "none" }}
          >
            <AlignJustify className="size-5" />
          </span>
        ) : (
          <button
            className="grid size-9 place-items-center text-muted"
            onClick={(e) => {
              e.stopPropagation();
              useApp.getState().setUI({ menuId: menu ? null : id });
            }}
          >
            <MoreHorizontal className="size-5" />
          </button>
        )}
      </div>
      {menu && !ui.selectMode && (
        <div
          className="absolute right-2 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-line bg-card py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="block w-full px-4 py-2.5 text-left text-[14px]"
            onClick={() => {
              useApp.getState().setUI({
                menuId: null,
                rename: { id, kind: "remark", value: chat.remark || "" },
              });
            }}
          >
            修改备注
          </button>
          <button
            className="block w-full px-4 py-2.5 text-left text-[14px]"
            onClick={() => {
              useApp.getState().setUI({ menuId: null, sidebar: false });
              useApp.getState().beginEdit(id);
            }}
          >
            修改设定
          </button>
          <button
            className="block w-full px-4 py-2.5 text-left text-[14px] text-danger"
            onClick={() => {
              useApp.getState().setUI({
                menuId: null,
                confirm: {
                  title: "删除角色",
                  body: `删除「${chat.name}」以及全部聊天记录？`,
                  danger: true,
                  onOk: () => {
                    useApp.getState().setUI({ selected: [id] });
                    useApp.getState().deleteSelected();
                  },
                },
              });
            }}
          >
            删除角色
          </button>
        </div>
      )}
    </div>
  );
}

function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "grid size-[22px] shrink-0 place-items-center rounded-full border",
        on ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-card",
      )}
    >
      {on && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  );
}

export function RenameModal() {
  const rename = useApp((s) => s.ui.rename);
  const setUI = useApp((s) => s.setUI);
  const [val, setVal] = useState(rename?.value ?? "");
  useEffect(() => setVal(rename?.value ?? ""), [rename?.id, rename?.value]);
  if (!rename) return null;
  const title =
    rename.kind === "folder" ? "重命名文件夹" : rename.kind === "remark" ? "修改备注" : "修改名称";
  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-overlay p-6">
      <div className="w-full max-w-sm rounded-[24px] bg-bg p-5">
        <div className="mb-3 text-[16px] font-semibold">{title}</div>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="h-12 w-full rounded-full border border-line bg-card px-4"
        />
        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-3 text-muted" onClick={() => setUI({ rename: null })}>
            取消
          </button>
          <button
            className="flex-1 rounded-full bg-primary py-3 text-on-primary"
            onClick={() => {
              if (rename.kind === "remark") {
                useApp.getState().patchChat(rename.id, { remark: val });
                useApp.getState().toast("备注已更新");
                setUI({ rename: null });
              } else {
                useApp.getState().renameItem(rename.id, val);
              }
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
