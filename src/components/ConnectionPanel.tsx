import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Download, FileUp, Settings, Star, Trash2, Upload, X } from "lucide-react";
import { DEFAULT_LLM_PARAMS, DEFAULT_NAI_BASE, shortModelLabel } from "@/lib/constants";
import { exportArchive, importArchive } from "@/lib/archive";
import { fetchLlmModels } from "@/lib/grok-client";
import { applyLlmPick, pruneStarred, snapshotLlmAccount } from "@/lib/llm-models";
import { llmIdentity } from "@/lib/image-ai";
import { useApp } from "@/lib/store";
import { cn, uid, uniqueNumberedName } from "@/lib/utils";
import type { LlmAccount, StPreset } from "@/lib/types";
import {
  activePreset,
  parseChatCompletionPreset,
  restoreSampler,
  samplerPatch,
  uniquePresetName,
} from "@/lib/st-preset";
import { GhostBtn, Modal, PrimaryBtn, Slider, Switch, TextInput } from "./ui-kit";

export function ConnectionPanel() {
  const open = useApp((s) => s.ui.connection);
  const settings = useApp((s) => s.settings);
  const setUI = useApp((s) => s.setUI);
  const [key, setKey] = useState(settings.naiKey);
  const [base, setBase] = useState(settings.naiBase || DEFAULT_NAI_BASE);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dl, setDl] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);
  const llmSettings = useApp((s) => s.ui.llmSettings);
  useEffect(() => {
    if (!open || !llmSettings) return;
    setApiOpen(true);
    useApp.getState().setUI({ llmSettings: false });
  }, [open, llmSettings]);
  useEffect(() => {
    if (!open) setApiOpen(false);
  }, [open]);
  if (!open) return null;

  const close = () => {
    setApiOpen(false);
    setUI({ connection: false });
  };

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/nai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", baseUrl: base, apiKey: key }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setErr(data.error || "连接失败");
        useApp.getState().setSettings({ naiKey: key, naiBase: base, naiConnected: false });
        return;
      }
      useApp.getState().setSettings({ naiKey: key, naiBase: base, naiConnected: true });
      useApp.getState().toast("已连接");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "连接失败");
    } finally {
      setBusy(false);
    }
  };

  const selectGrok = () => useApp.getState().setSettings({ chatSource: "grok" });
  const selectApi = () => {
    if (!settings.llmConnected) {
      useApp.getState().toast("先连接 API");
      setApiOpen(true);
      return;
    }
    useApp.getState().setSettings({ chatSource: "api" });
  };

  return (
    <div className="absolute inset-0 z-50 flex justify-center px-4 py-8">
      <div className="absolute inset-0 bg-overlay/40" />
      <SheetCard
        title="连接"
        titleExtra={
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <Switch
              on={settings.chatImage !== false}
              onChange={(v) => {
                useApp.getState().setSettings({ chatImage: v });
              }}
              label="生图"
            />
            生图
          </span>
        }
        onClose={close}
      >
        <div className="mb-4 grid grid-cols-2 gap-3">
          <button
            className="flex flex-col items-center gap-2 rounded-[18px] border border-line bg-card py-5"
            onClick={() => setDl(true)}
          >
            <Download className="size-6" />
            <span className="text-[13px]">下载存档</span>
          </button>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border border-line bg-card py-5">
            <Upload className="size-6" />
            <span className="text-[13px]">读取存档</span>
            <input
              type="file"
              accept=".json,.zip"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                try {
                  await importArchive(f);
                  await useApp.getState().hydrate();
                  useApp.getState().toast("已读取存档");
                  close();
                } catch (err) {
                  useApp.getState().toast(err instanceof Error ? err.message : "读取失败");
                }
              }}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={selectGrok}
          className={cn(
            "mb-3 w-full rounded-[18px] border p-4 text-left",
            settings.chatSource === "grok" ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
        >
          <div className="mb-1 font-medium">Grok</div>
          <p className="text-[12px] leading-relaxed text-muted">
            已使用当前 Grok 会员账号，无需再登录。选中后聊天、润色、写提示词都走 Grok。顶栏切换 4.7 / 4.6 / 4.5 均衡、专家、快速。
          </p>
        </button>

        <div
          role="button"
          tabIndex={0}
          onClick={selectApi}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") selectApi();
          }}
          className={cn(
            "mb-4 flex w-full items-center gap-3 rounded-[18px] border p-4 text-left",
            settings.chatSource === "api" ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="font-medium">API 连接</div>
            <p className="mt-0.5 truncate text-[12px] text-muted">
              {settings.llmConnected
                ? settings.llmModel
                  ? shortModelLabel(settings.llmModel)
                  : "已连接，去设置里选模型"
                : "未连接。点齿轮填写网址和密钥"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {settings.llmConnected ? (
              <Check className="size-5 text-good" />
            ) : (
              <X className="size-5 text-danger" />
            )}
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-dim"
              onClick={() => setApiOpen(true)}
              aria-label="API 设置"
            >
              <Settings className="size-5" />
            </button>
          </div>
        </div>

        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-medium">NAI 中转站 API Key</div>
          {settings.naiConnected ? (
            <span className="flex items-center gap-2 text-[12px]">
              <span className="flex items-center gap-1 text-good">
                <Check className="size-3.5" /> 已连接
              </span>
              <button
                className="text-muted"
                onClick={() => {
                  useApp.getState().setSettings({ naiConnected: false, naiKey: "" });
                  setKey("");
                }}
              >
                退出
              </button>
            </span>
          ) : null}
        </div>
        <TextInput type="password" value={key} placeholder="" onChange={(e) => setKey(e.target.value)} />
        <p className="mb-3 mt-1 text-[11px] text-muted">
          进阶档位以上可生成 Key。Key 只保存在你这台设备上。点保存后即可聊天配图和纯生图。
        </p>
        <div className="mb-1 text-[14px] font-medium">中转站地址</div>
        <TextInput value={base} onChange={(e) => setBase(e.target.value)} />
        {err && <p className="mt-2 text-[12px] text-danger">{err}</p>}
        <PrimaryBtn className="mt-4" busy={busy} onClick={() => void save()}>
          保存
        </PrimaryBtn>
      </SheetCard>
      <Modal open={dl} onClose={() => setDl(false)} title="下载存档">
        <p className="mb-4 text-[13px] text-muted">全部含配图；无配图可再次点重生。</p>
        <div className="flex flex-col gap-2">
          <PrimaryBtn
            onClick={() => {
              void exportArchive("full");
              setDl(false);
            }}
          >
            全部
          </PrimaryBtn>
          <GhostBtn
            onClick={() => {
              void exportArchive("lite");
              setDl(false);
            }}
          >
            无配图
          </GhostBtn>
        </div>
      </Modal>
      {apiOpen && (
        <div className="absolute inset-0 z-20 flex justify-center px-4 py-8">
          <button type="button" className="absolute inset-0 bg-overlay/40" onClick={() => setApiOpen(false)} aria-label="关闭" />
          <ApiSettingsSheet onClose={() => setApiOpen(false)} />
        </div>
      )}
    </div>
  );
}

function SheetCard({
  title,
  titleExtra,
  onClose,
  children,
}: {
  title: string;
  titleExtra?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-0 w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-bg shadow-2xl">
      <div className="flex shrink-0 items-center gap-2 px-5 pb-3 pt-5">
        <h2 className="text-[20px] font-semibold">{title}</h2>
        {titleExtra}
        <button type="button" className="ml-auto" onClick={onClose} aria-label="关闭">
          <X className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 scroll-hide">{children}</div>
    </div>
  );
}

function ApiSettingsSheet({ onClose }: { onClose: () => void }) {
  const settings = useApp((s) => s.settings);
  const [url, setUrl] = useState(settings.llmBase);
  const [key, setKey] = useState(settings.llmKey);
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    setUrl(settings.llmBase);
    setKey(settings.llmKey);
    setErr("");
  }, [settings.llmBase, settings.llmKey]);

  const connect = async (override?: {
    url?: string;
    key?: string;
    toast?: string;
    starred?: string[];
    model?: string;
  }) => {
    const u = (override?.url ?? url).trim();
    const k = override?.key ?? key;
    setBusy(true);
    setErr("");
    try {
      const list = await fetchLlmModels(u, k);
      const live = useApp.getState().settings;
      const preferred = override?.model || live.llmModel;
      const nextModel = preferred || list[0] || "";
      const keepStars = override?.starred ?? live.llmStarred;
      const starred = list.length ? pruneStarred(keepStars, list, nextModel) : [...new Set(keepStars)];
      const nextIdentity = llmIdentity(u, k);
      const prevIdentity = live.llmIdentity || (live.llmConnected ? llmIdentity(live.llmBase, live.llmKey) : "");
      useApp.getState().setSettings({
        llmBase: u,
        llmKey: k,
        llmConnected: true,
        llmModels: list,
        llmModel: nextModel,
        llmStarred: starred,
        chatSource: "api",
        llmAccounts: snapshotLlmAccount(live.llmAccounts ?? [], u, k, starred, nextModel),
        llmIdentity: nextIdentity,
      });
      if (prevIdentity && prevIdentity !== nextIdentity) useApp.getState().clearImageAi();
      useApp.getState().toast(
        override?.toast ?? (list.length ? `已连接 · ${list.length} 个模型` : "已连接，请手填模型名"),
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "连接失败");
      useApp.getState().setSettings({ llmBase: u, llmKey: k, llmConnected: false });
    } finally {
      setBusy(false);
    }
  };

  const disconnect = () => {
    useApp.getState().setSettings({
      llmConnected: false,
      llmKey: "",
      chatSource: "grok",
    });
    setKey("");
    useApp.getState().toast("已断开 API");
  };

  const saveAccount = () => {
    const name = uniqueNumberedName(
      saveName,
      (settings.llmAccounts ?? []).map((a) => a.name),
    );
    if (!saveName.trim()) {
      useApp.getState().toast("请输入名称");
      return;
    }
    useApp.getState().setSettings({
      llmAccounts: [
        ...(settings.llmAccounts ?? []),
        {
          id: uid("acc_"),
          name,
          base: url.trim(),
          key,
          starred: [...settings.llmStarred],
          model: settings.llmModel,
        },
      ],
    });
    useApp.getState().toast(`已保存（${name}）`);
    setSaveOpen(false);
    setSaveName("");
  };

  const p = settings.llmParams;

  return (
    <SheetCard title="API 设置" onClose={onClose}>
      <div className="mb-1 flex items-center justify-between text-[14px] font-medium">
        <span>网址</span>
        <button
          type="button"
          className="text-[12px] font-normal text-muted"
          onClick={() => {
            if (!url.trim() || !key.trim()) {
              useApp.getState().toast("请填写网址和密钥");
              return;
            }
            setSaveName("");
            setSaveOpen(true);
          }}
        >
          保存
        </button>
      </div>
      <TextInput
        value={url}
        placeholder="https://api.siliconflow.cn/v1"
        onChange={(e) => setUrl(e.target.value)}
      />
      <p className="mb-3 mt-1 text-[11px] text-muted">OpenAI 兼容。末尾 /v1 即可，不必写到 chat/completions。</p>
      <AccountPicker
        accounts={settings.llmAccounts ?? []}
        keyValue={key}
        onKeyChange={setKey}
        busy={busy}
        exit={
          settings.llmConnected ? (
            <button type="button" className="text-[12px] text-muted" onClick={disconnect}>
              退出
            </button>
          ) : null
        }
        onPick={(a) => {
          const s = useApp.getState().settings;
          if (s.llmBase || s.llmKey) {
            useApp.getState().setSettings({
              llmAccounts: snapshotLlmAccount(s.llmAccounts ?? [], s.llmBase, s.llmKey, s.llmStarred, s.llmModel),
            });
          }
          setUrl(a.base);
          setKey(a.key);
          void connect({
            url: a.base,
            key: a.key,
            starred: a.starred,
            model: a.model,
            toast: `已应用密钥（${a.name}）`,
          });
        }}
        onDelete={(id) =>
          useApp.getState().setSettings({
            llmAccounts: (settings.llmAccounts ?? []).filter((a) => a.id !== id),
          })
        }
      />
      {err && <p className="mt-2 text-[12px] text-danger">{err}</p>}
      <PrimaryBtn
        className={cn("mt-3", settings.llmConnected && "bg-good hover:bg-good")}
        busy={busy}
        onClick={() => void connect()}
      >
        {settings.llmConnected ? "已连接 · 重新拉取" : "连接"}
      </PrimaryBtn>

      <div className="mt-5 mb-1 text-[14px] font-medium">可用模型</div>
      <p className="mb-2 text-[11px] text-muted">列表来自接口。点选即当前模型，星标会进聊天顶栏。</p>
      <ModelPicker
        models={settings.llmModels}
        current={settings.llmModel}
        starred={settings.llmStarred}
        connected={settings.llmConnected}
        onPick={(id) => {
          useApp.getState().setSettings(applyLlmPick(settings, id));
        }}
        onStar={(id) => {
          const on = settings.llmStarred.includes(id);
          const next = on ? settings.llmStarred.filter((x) => x !== id) : [...settings.llmStarred, id];
          const llmStarred = pruneStarred(next, settings.llmModels, settings.llmModel);
          useApp.getState().setSettings({
            llmStarred,
            llmAccounts: snapshotLlmAccount(
              settings.llmAccounts ?? [],
              settings.llmBase,
              settings.llmKey,
              llmStarred,
              settings.llmModel,
            ),
          });
        }}
      />
      {settings.llmConnected && settings.llmModels.length === 0 && (
        <div className="mt-3">
          <div className="mb-1 text-[13px]">手填模型名</div>
          <div className="flex gap-2">
            <TextInput value={manual} placeholder="deepseek-ai/DeepSeek-V3.2" onChange={(e) => setManual(e.target.value)} />
            <button
              type="button"
              className="shrink-0 rounded-full bg-primary px-4 text-[13px] text-on-primary"
              onClick={() => {
                const id = manual.trim();
                if (!id) return;
                useApp.getState().setSettings({
                  llmModel: id,
                  llmModels: [id],
                  llmStarred: settings.llmStarred.includes(id) ? settings.llmStarred : [...settings.llmStarred, id],
                });
              }}
            >
              使用
            </button>
          </div>
        </div>
      )}
      <p className="mt-2 text-[12px] text-muted">
        当前：{settings.llmModel ? shortModelLabel(settings.llmModel) : "未选"} · 常用{" "}
        {pruneStarred(settings.llmStarred, settings.llmModels, settings.llmModel).length}
      </p>

      <ChatPresetPicker />

      <div className="mt-5 mb-2 flex items-center justify-between">
        <div className="text-[14px] font-medium">预设</div>
        <button
          type="button"
          className="text-[12px] text-muted"
          onClick={() => useApp.getState().setSettings({ llmParams: { ...DEFAULT_LLM_PARAMS } })}
        >
          恢复默认
        </button>
      </div>
      {activePreset(settings) && (
        <p className="mb-2 text-[11px] text-muted">采样来自：{activePreset(settings)?.name}</p>
      )}
      <ParamRow
        label="温度"
        value={p.temperature}
        min={0}
        max={2}
        step={0.05}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, temperature: n } })}
      />
      <ParamRow
        label="Top P"
        value={p.topP}
        min={0}
        max={1}
        step={0.05}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, topP: n } })}
      />
      <ParamRow
        label="频率惩罚"
        value={p.frequencyPenalty}
        min={0}
        max={2}
        step={0.05}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, frequencyPenalty: n } })}
      />
      <ParamRow
        label="存在惩罚"
        value={p.presencePenalty}
        min={0}
        max={2}
        step={0.05}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, presencePenalty: n } })}
      />
      <ParamRow
        label="最大回复"
        value={p.maxTokens}
        min={256}
        max={32000}
        step={256}
        digits={0}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, maxTokens: n } })}
      />
      <ParamRow
        label="上下文（轮）"
        value={p.contextTurns}
        min={4}
        max={40}
        step={1}
        digits={0}
        onChange={(n) => useApp.getState().setSettings({ llmParams: { ...p, contextTurns: n } })}
      />
      <Modal open={saveOpen} onClose={() => setSaveOpen(false)} title="保存账号">
        <TextInput
          value={saveName}
          placeholder="给这组起个名字"
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveAccount();
          }}
        />
        <PrimaryBtn className="mt-4" onClick={saveAccount}>
          保存
        </PrimaryBtn>
      </Modal>
    </SheetCard>
  );
}

function applyStPreset(preset: StPreset) {
  const s = useApp.getState().settings;
  const snapshot = s.stParamSnapshot ?? { ...s.llmParams };
  useApp.getState().setSettings({
    stActiveId: preset.id,
    stParamSnapshot: snapshot,
    llmParams: samplerPatch(preset.params, s.llmParams),
  });
  useApp.getState().toast(`已应用预设（${preset.name}）`);
}

function cancelStPreset() {
  const s = useApp.getState().settings;
  useApp.getState().setSettings({
    stActiveId: null,
    stParamSnapshot: null,
    llmParams: restoreSampler(s.stParamSnapshot, s.llmParams),
  });
  useApp.getState().toast("已取消预设");
}

function ChatPresetPicker() {
  const settings = useApp((s) => s.settings);
  const presets = settings.stPresets ?? [];
  const active = activePreset(settings);
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const place = () => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(r.width, window.innerWidth - 16);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    const top = r.bottom + 4;
    const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
    setPos({ top, left, width, maxH });
  };

  const openMenu = () => {
    place();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    place();
    let start: { x: number; y: number } | null = null;
    let downOutside = false;
    let moved = false;
    const inChrome = (t: EventTarget | null) => {
      const n = t as Node | null;
      return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
    };
    const onDown = (e: PointerEvent) => {
      start = { x: e.clientX, y: e.clientY };
      downOutside = !inChrome(e.target);
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!start) return;
      if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
    };
    const onUp = (e: PointerEvent) => {
      if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
      start = null;
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  const importFile = async (file: File) => {
    let raw: unknown;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      useApp.getState().toast("无法读取这个文件");
      return;
    }
    try {
      const parsed = parseChatCompletionPreset(raw, file.name);
      const s = useApp.getState().settings;
      const name = uniquePresetName(
        parsed.name,
        (s.stPresets ?? []).map((p) => p.name),
      );
      useApp.getState().setSettings({ stPresets: [...(s.stPresets ?? []), { ...parsed, name }] });
      useApp.getState().toast(`已导入 ${name}，点列表应用`);
    } catch (e) {
      useApp.getState().toast(e instanceof Error ? e.message : "这不是对话补全预设");
    }
  };

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="min-w-0 flex-1 text-[14px] font-medium">对话补全预设</div>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void importFile(f);
          }}
        />
        <button
          type="button"
          className="grid size-8 shrink-0 place-items-center text-muted"
          aria-label="导入预设"
          onClick={() => fileRef.current?.click()}
        >
          <FileUp className="size-4" />
        </button>
        {active ? (
          <span className="flex shrink-0 items-center gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 text-good">
              <Check className="size-3.5" />
              已应用
            </span>
            <button type="button" className="text-muted" onClick={cancelStPreset}>
              取消
            </button>
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-danger">
            <X className="size-3.5" />
            未应用
          </span>
        )}
      </div>
      <div ref={box} className="relative">
        <div className="flex h-11 items-center rounded-full border border-line bg-card pl-4 pr-1">
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left text-[13px]"
            onClick={() => (open ? setOpen(false) : openMenu())}
          >
            <span className={active ? "text-ink" : "text-muted"}>{active ? active.name : "未应用"}</span>
          </button>
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center text-muted"
            aria-label={open ? "收起预设列表" : "展开预设列表"}
            onClick={() => (open ? setOpen(false) : openMenu())}
          >
            <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
          </button>
        </div>
        {open &&
          pos &&
          createPortal(
            <div
              ref={menu}
              className="fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              <div className="overflow-auto overscroll-contain scroll-hide" style={{ maxHeight: pos.maxH }}>
                {presets.length === 0 ? (
                  <p className="px-4 py-6 text-center text-[13px] text-muted">还没有导入的预设</p>
                ) : (
                  presets.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 border-b border-line/70 last:border-0">
                      <button
                        type="button"
                        className={cn(
                          "min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]",
                          p.id === active?.id && "text-primary",
                        )}
                        onClick={() => {
                          applyStPreset(p);
                          setOpen(false);
                        }}
                      >
                        {p.name}
                      </button>
                      <button
                        type="button"
                        className="grid size-10 shrink-0 place-items-center text-danger"
                        aria-label={`删除${p.name}`}
                        onClick={() => {
                          const s = useApp.getState().settings;
                          const was = s.stActiveId === p.id;
                          const next = (s.stPresets ?? []).filter((x) => x.id !== p.id);
                          if (was) {
                            useApp.getState().setSettings({
                              stPresets: next,
                              stActiveId: null,
                              stParamSnapshot: null,
                              llmParams: restoreSampler(s.stParamSnapshot, s.llmParams),
                            });
                            useApp.getState().toast("已取消预设");
                          } else {
                            useApp.getState().setSettings({ stPresets: next });
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}

function AccountPicker({
  accounts,
  keyValue,
  onKeyChange,
  busy,
  exit,
  onPick,
  onDelete,
}: {
  accounts: LlmAccount[];
  keyValue: string;
  onKeyChange: (v: string) => void;
  busy?: boolean;
  exit?: ReactNode;
  onPick: (a: LlmAccount) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const place = () => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(r.width, window.innerWidth - 16);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    const top = r.bottom + 4;
    const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
    setPos({ top, left, width, maxH });
  };

  const openMenu = () => {
    place();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    place();
    let start: { x: number; y: number } | null = null;
    let downOutside = false;
    let moved = false;
    const inChrome = (t: EventTarget | null) => {
      const n = t as Node | null;
      return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
    };
    const onDown = (e: PointerEvent) => {
      start = { x: e.clientX, y: e.clientY };
      downOutside = !inChrome(e.target);
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!start) return;
      if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
    };
    const onUp = (e: PointerEvent) => {
      if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
      start = null;
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  return (
    <div ref={box}>
      <div className="mb-1 flex items-center justify-between gap-2 text-[14px] font-medium">
        <span>API 密钥</span>
        <span className="flex shrink-0 items-center gap-3 text-[12px] font-normal">
          {exit}
          <button type="button" className="text-muted" onClick={() => (open ? setOpen(false) : openMenu())}>
            账号列表
          </button>
        </span>
      </div>
      <TextInput type="password" value={keyValue} placeholder="" onChange={(e) => onKeyChange(e.target.value)} />
      {open &&
        pos &&
        createPortal(
          <div
            ref={menu}
            className="fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="overflow-auto overscroll-contain scroll-hide" style={{ maxHeight: pos.maxH }}>
              {accounts.length === 0 ? (
                <p className="px-4 py-6 text-center text-[13px] text-muted">还没有保存的账号</p>
              ) : (
                accounts.map((a) => (
                  <div key={a.id} className="flex items-center gap-1 border-b border-line/70 last:border-0">
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]"
                      disabled={busy}
                      onClick={() => {
                        onPick(a);
                        setOpen(false);
                      }}
                    >
                      {a.name}
                    </button>
                    <button
                      type="button"
                      className="grid size-10 shrink-0 place-items-center text-danger"
                      aria-label={`删除${a.name}`}
                      onClick={() => onDelete(a.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function ModelPicker({
  models,
  current,
  starred,
  connected,
  onPick,
  onStar,
}: {
  models: string[];
  current: string;
  starred: string[];
  connected: boolean;
  onPick: (id: string) => void;
  onStar: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t ? models.filter((id) => id.toLowerCase().includes(t)) : models;
    const star = new Set(starred);
    return [...list].sort((a, b) => {
      const as = star.has(a) ? 0 : 1;
      const bs = star.has(b) ? 0 : 1;
      if (as !== bs) return as - bs;
      return a.localeCompare(b);
    });
  }, [models, q, starred]);

  const place = () => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(r.width, window.innerWidth - 16);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    const top = r.bottom + 4;
    const maxH = Math.min(260, Math.max(120, window.innerHeight - top - 12));
    setPos({ top, left, width, maxH });
  };

  const openMenu = () => {
    place();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    place();
    let start: { x: number; y: number } | null = null;
    let downOutside = false;
    let moved = false;
    const inChrome = (t: EventTarget | null) => {
      const n = t as Node | null;
      return Boolean(n && (box.current?.contains(n) || menu.current?.contains(n)));
    };
    const onDown = (e: PointerEvent) => {
      start = { x: e.clientX, y: e.clientY };
      downOutside = !inChrome(e.target);
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!start) return;
      if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 10) moved = true;
    };
    const onUp = (e: PointerEvent) => {
      if (downOutside && !moved && !inChrome(e.target)) setOpen(false);
      start = null;
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <div className="flex h-12 items-center rounded-full border border-line bg-card focus-within:border-primary/40">
        <input
          value={q}
          placeholder="搜索"
          className="min-w-0 flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:text-faint"
          onChange={(e) => {
            setQ(e.target.value);
            if (!open) openMenu();
          }}
          onFocus={() => {
            if (!open) openMenu();
          }}
        />
        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center"
          aria-label={open ? "收起模型列表" : "展开模型列表"}
          onClick={() => (open ? setOpen(false) : openMenu())}
        >
          <ChevronDown className={cn("size-4 text-muted transition", open && "rotate-180")} />
        </button>
      </div>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menu}
            className="fixed z-[85] overflow-hidden rounded-[16px] border border-line bg-card shadow-[0_16px_40px_rgb(44_40_36/0.16)]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="overflow-auto overscroll-contain scroll-hide" style={{ maxHeight: pos.maxH }}>
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-[13px] text-muted">
                  {connected ? "没有匹配的模型" : "连接后才会出现列表"}
                </p>
              ) : (
                filtered.map((id) => {
                  const on = current === id;
                  const star = starred.includes(id);
                  return (
                    <div
                      key={id}
                      className={cn("flex items-center gap-1 border-b border-line/70 last:border-0", on && "bg-dim/70")}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 truncate px-3 py-3 text-left text-[13px]"
                        onClick={() => {
                          onPick(id);
                          setOpen(false);
                        }}
                      >
                        {id}
                      </button>
                      <button
                        type="button"
                        className="grid size-10 shrink-0 place-items-center"
                        onClick={() => onStar(id)}
                        aria-label={star ? "取消常用" : "标为常用"}
                      >
                        <Star className={cn("size-4", star ? "fill-primary text-primary" : "text-faint")} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function ParamRow({
  label,
  value,
  min,
  max,
  step,
  digits = 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  onChange: (n: number) => void;
}) {
  const shown = digits === 0 ? String(Math.round(value)) : value.toFixed(digits);
  return (
    <div className="mb-3">
      <div className="mb-0.5 flex items-center justify-between text-[13px]">
        <span>{label}</span>
        <span className="tabular-nums text-muted">{shown}</span>
      </div>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} />
    </div>
  );
}
