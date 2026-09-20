import { useEffect, useState } from "react";
import { Menu, SlidersHorizontal } from "lucide-react";
import { emptyCharacter } from "@/lib/constants";
import { loadTags } from "@/lib/tags";
import { listedChats, useApp } from "@/lib/store";
import { FIELD_LABELS } from "@/lib/prompts";
import { DEFAULT_STATUS_BAR, defaultImageParams } from "@/lib/constants";
import type { Chat, MultiMode } from "@/lib/types";
import { uid } from "@/lib/utils";
import { ChatPane, CustomPromptModal } from "./ChatPane";
import { ConnectionPanel } from "./ConnectionPanel";
import { ParamsPane } from "./ParamsPane";
import { PurePane } from "./PurePane";
import { RoleEditor } from "./RoleEditor";
import { RenameModal, Sidebar } from "./Sidebar";
import { ConfirmHost, GhostBtn, IconBtn, Modal, PrimaryBtn, TextArea, TextInput, ToastHost } from "./ui-kit";

export function App() {
  const hydrate = useApp((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
    void loadTags();
  }, [hydrate]);
  return <Shell />;
}

function Shell() {
  const tab = useApp((s) => s.ui.tab);
  const creating = useApp((s) => s.ui.creating);
  const editing = useApp((s) => s.ui.editingChatId);
  const currentId = useApp((s) => s.currentId);
  const chat = useApp((s) => s.chats.find((c) => c.id === currentId));
  const editChat = useApp((s) => s.chats.find((c) => c.id === editing));
  const draft = useApp((s) => s.chats.find((c) => c.isDraft && c.id === currentId));
  const theme = useApp((s) => s.settings.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  let body: React.ReactNode;
  if (tab === "pure") {
    body = <PurePane />;
  } else if (creating && draft) {
    body = tab === "params" ? <ParamsPane chat={draft} /> : <RoleEditor chat={draft} mode="create" />;
  } else if (editing && editChat && tab === "chat") {
    body = <RoleEditor chat={editChat} mode="edit" />;
  } else if (tab === "params") {
    body = chat && !chat.isDraft ? <ParamsPane chat={chat} /> : <EmptyParams />;
  } else if (chat && !chat.isDraft) {
    body = <ChatPane chat={chat} />;
  } else {
    body = <EmptyChat />;
  }

  return (
    <div className="relative mx-auto flex h-full max-w-lg flex-col bg-bg">
      <header className="flex shrink-0 items-center gap-1 px-2 pt-[calc(env(safe-area-inset-top)+8px)]">
        <IconBtn onClick={() => useApp.getState().setUI({ sidebar: true })}>
          <Menu className="size-5" />
        </IconBtn>
        <nav className="flex flex-1 justify-center gap-7 text-[15px]">
          <TabBtn id="chat" label="聊天" />
          <TabBtn id="params" label="生图参数" />
          <TabBtn id="pure" label="纯生图" />
        </nav>
        <IconBtn onClick={() => useApp.getState().setUI({ connection: true })}>
          <SlidersHorizontal className="size-5" />
        </IconBtn>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full">{body}</div>
        <Sidebar />
        <ConnectionPanel />
      </main>

      <ToastHost />
      <ConfirmHost />
      <RenameModal />
      <CustomPromptModal />
      <SaveCardModal />
      <SaveAppearModal />
      <FieldEditModal />
      <MoveModal />
      <MultiCreateModal />
    </div>
  );
}

function TabBtn({ id, label }: { id: "chat" | "params" | "pure"; label: string }) {
  const tab = useApp((s) => s.ui.tab);
  const on = tab === id;
  return (
    <button
      onClick={() => useApp.getState().setTab(id)}
      className={`relative pb-2 ${on ? "font-semibold text-ink" : "text-muted"}`}
    >
      {label}
      {on && <span className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-ink" />}
    </button>
  );
}

function EmptyParams() {
  return (
    <p className="px-6 py-16 text-center text-[13px] text-muted">先在侧栏新建一个角色，才能设置聊天配图参数。</p>
  );
}

function EmptyChat() {
  return (
    <div className="grid h-full place-items-center px-8 text-center">
      <div>
        <div className="font-serif text-2xl">还没有开始</div>
        <p className="mt-2 max-w-xs text-[13px] leading-6 text-muted">
          点左上角打开侧栏，新建一个角色就能聊。配图会跟着每句回复出来。
        </p>
        <button
          className="mt-6 rounded-full bg-primary px-6 py-3 text-[14px] text-on-primary"
          onClick={() => useApp.getState().newDraft()}
        >
          新建聊天
        </button>
      </div>
    </div>
  );
}

function SaveCardModal() {
  const open = useApp((s) => s.ui.saveCardOpen);
  const chat = useApp((s) => s.current());
  const [name, setName] = useState(chat?.name ?? "");
  useEffect(() => setName(chat?.name ?? ""), [chat?.name, open]);
  if (!open || !chat) return null;
  const close = () => useApp.getState().setUI({ saveCardOpen: false });
  return (
    <Modal open onClose={close} title="保存为角色卡" hideClose>
      <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="输入名称" autoFocus />
      <div className="mt-4 flex gap-3">
        <GhostBtn onClick={close}>取消</GhostBtn>
        <PrimaryBtn onClick={() => useApp.getState().saveCard(chat, name.trim() || chat.name || "未命名")}>保存</PrimaryBtn>
      </div>
    </Modal>
  );
}

function SaveAppearModal() {
  const ui = useApp((s) => s.ui);
  const tab = useApp((s) => s.ui.tab);
  const chat = useApp((s) => s.current());
  const pure = useApp((s) => s.pureParams);
  const [name, setName] = useState("");
  useEffect(() => setName(""), [ui.saveAppearOpen]);
  if (!ui.saveAppearOpen) return null;
  const close = () => useApp.getState().setUI({ saveAppearOpen: false });
  const prompt =
    tab === "pure"
      ? ui.appearTarget && ui.appearTarget !== "mid"
        ? pure.characters.find((c) => c.id === ui.appearTarget)?.prompt ?? ""
        : pure.promptMid
      : ui.appearTarget && ui.appearTarget !== "mid"
        ? chat?.imageParams.characters.find((c) => c.id === ui.appearTarget)?.prompt ?? ""
        : chat?.imageParams.promptMid ?? "";
  return (
    <Modal open onClose={close} title="保存角色" hideClose>
      <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="输入名称" autoFocus />
      <div className="mt-4 flex gap-3">
        <GhostBtn onClick={close}>取消</GhostBtn>
        <PrimaryBtn disabled={!name.trim()} onClick={() => useApp.getState().saveAppearance(name.trim(), prompt)}>
          保存
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

function FieldEditModal() {
  const field = useApp((s) => s.ui.fieldEdit);
  const [text, setText] = useState(field?.text ?? "");
  useEffect(() => setText(field?.text ?? ""), [field?.text, field?.key, field?.charId]);
  if (!field) return null;
  const isAll = field.key === "all";
  const label = isAll ? "整张卡" : FIELD_LABELS[field.key] || field.key;
  return (
    <Modal open onClose={() => useApp.getState().setUI({ fieldEdit: null })} title={isAll ? "个性化修改整张卡" : `个性化修改 · ${label}`}>
      <TextArea value={text} placeholder="写下你的要求" onChange={(e) => setText(e.target.value)} />
      <PrimaryBtn
        className="mt-4"
        onClick={() => {
          const t = text.trim();
          if (!t) {
            useApp.getState().toast("写一点要求");
            return;
          }
          const live = useApp.getState().current();
          if (!live) return;
          useApp.getState().setUI({
            fieldEdit: null,
            polishJob: {
              chatId: live.id,
              kind: isAll ? "personalize" : "field",
              key: isAll ? undefined : field.key,
              charId: field.charId,
              instruction: t,
            },
          });
        }}
      >
        {isAll ? "按这个改" : "改这一栏"}
      </PrimaryBtn>
    </Modal>
  );
}

function MoveModal() {
  const open = useApp((s) => s.ui.moveOpen);
  const folders = useApp((s) => s.folders);
  const chats = useApp((s) => s.chats);
  if (!open) return null;
  const { foldersSorted } = listedChats(folders, chats);
  return (
    <Modal open onClose={() => useApp.getState().setUI({ moveOpen: false })} title="移动到">
      <button
        className="mb-2 w-full rounded-2xl bg-card px-4 py-3 text-left"
        onClick={() => useApp.getState().moveSelected(null)}
      >
        不放进文件夹
      </button>
      {foldersSorted.map((f) => (
        <button
          key={f.id}
          className="mb-2 w-full rounded-2xl bg-card px-4 py-3 text-left"
          onClick={() => useApp.getState().moveSelected(f.id)}
        >
          {f.name}
        </button>
      ))}
    </Modal>
  );
}

function MultiCreateModal() {
  const ids = useApp((s) => s.ui.multiCreate);
  const chats = useApp((s) => s.chats);
  const [mode, setMode] = useState<MultiMode>("together");
  const [overview, setOverview] = useState("");
  const [opening, setOpening] = useState("");
  if (!ids || ids.length < 2) return null;
  const picked = ids.map((id) => chats.find((c) => c.id === id)).filter(Boolean) as Chat[];

  const makeDraft = (): Chat => {
    const id = uid("chat_");
    const characters = picked.map((c, i) => {
      const src = c.characters[0] ?? emptyCharacter(i + 1);
      return { ...src, id: uid("c_") };
    });
    const imageParams = defaultImageParams();
    imageParams.characters = characters.map((c) => ({
      id: c.id,
      name: c.name,
      enabled: true,
      prompt: c.appearance || c.prompt,
      uc: c.uc,
      x: 0.5,
      y: 0.5,
    }));
    return {
      id,
      folderId: null,
      name: characters.map((c) => c.name).filter(Boolean).join("、"),
      remark: "",
      starred: false,
      order: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDraft: true,
      grokModelId: useApp.getState().settings.grokModelId,
      isMulti: true,
      multiMode: mode,
      promptMode: "insert",
      adultBoost: false,
      canGen: true,
      statusBarOn: false,
      statusBar: DEFAULT_STATUS_BAR,
      overview,
      opening,
      extras: [],
      memory: "",
      memoryUntil: 0,
      memoryFoldAt: 0,
      memorySnaps: [],
      characters,
      imageParams,
      messages: [],
      scrollTop: 0,
    };
  };

  const pushDraft = (draft: Chat) => {
    useApp.setState((s) => ({
      chats: [...s.chats, draft],
      currentId: draft.id,
      ui: { ...s.ui, multiCreate: null, creating: true, sidebar: false, selectMode: false, selected: [], tab: "chat", autoPolish: false },
    }));
  };

  return (
    <Modal open onClose={() => useApp.getState().setUI({ multiCreate: null })} title="请设置多人聊天" wide>
      {picked.map((c, i) => (
        <div key={c.id} className="mb-2 text-[13px]">
          角色{i + 1}：{c.name}
        </div>
      ))}
      <div className="my-3 text-[13px] font-medium">要求总览</div>
      <TextArea value={overview} onChange={(e) => setOverview(e.target.value)} />
      <div className="mb-1 mt-3 text-[13px] font-medium">开场场景</div>
      <TextArea value={opening} onChange={(e) => setOpening(e.target.value)} />
      <div className="my-3 flex gap-2">
        <button
          className={`flex-1 rounded-full py-2 text-[13px] ${mode === "together" ? "bg-primary text-on-primary" : "border border-line"}`}
          onClick={() => setMode("together")}
        >
          多人同聊模式
        </button>
        <button
          className={`flex-1 rounded-full py-2 text-[13px] ${mode === "group" ? "bg-primary text-on-primary" : "border border-line"}`}
          onClick={() => setMode("group")}
        >
          群聊模式
        </button>
      </div>
      <PrimaryBtn
        onClick={() => {
          const draft = makeDraft();
          useApp.setState((s) => ({
            chats: [...s.chats, draft],
            currentId: draft.id,
            ui: { ...s.ui, multiCreate: null, creating: true, sidebar: false, selectMode: false, selected: [], tab: "chat", autoPolish: true },
          }));
        }}
      >
        让 Grok 完善设定
      </PrimaryBtn>
      <GhostBtn
        className="mt-2"
        onClick={async () => {
          const draft = makeDraft();
          pushDraft(draft);
          useApp.getState().commitChat(draft.id);
          const { sendOpening } = await import("./chat-actions");
          void sendOpening(draft.id);
        }}
      >
        跳过，开始聊天
      </GhostBtn>
    </Modal>
  );
}
