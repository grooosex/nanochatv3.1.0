import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { cachedUrl, imageUrl } from "@/lib/idb";
import { firstChatImageBlob } from "@/lib/chat-avatar";
import type { ChatMessage } from "@/lib/types";

export function IconBtn({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-dim/80 active:scale-[0.98]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PrimaryBtn({
  className,
  children,
  busy,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-on-primary shadow-[0_6px_16px_rgb(156_83_72/0.25)] transition hover:bg-primary-hover disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function GhostBtn({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-[15px] font-medium text-ink transition hover:bg-surface disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Pill({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1.5 text-[12px] text-muted transition hover:border-line-strong hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[22px] border border-line/80 bg-card p-4 shadow-[0_1px_0_rgb(44_40_36/0.03)]", className)}>
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  hint,
  sub,
  right,
}: {
  children: ReactNode;
  hint?: string;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-ink">{children}</div>
        {sub ? <div className="mt-0.5">{sub}</div> : null}
        {hint && <div className="mt-0.5 text-[11px] leading-snug text-muted">{hint}</div>}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[88px] w-full resize-y rounded-[16px] border border-line bg-surface/60 px-3.5 py-3 text-[14px] leading-relaxed text-ink outline-none placeholder:text-faint focus:border-primary/40 focus:bg-card",
          className,
        )}
        {...rest}
      />
    );
  },
);

export function TextInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-full border border-line bg-card px-4 text-[14px] outline-none placeholder:text-faint focus:border-primary/40",
        className,
      )}
      {...rest}
    />
  );
}

export function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center overflow-hidden rounded-full p-0.5 transition-colors",
        on ? "bg-primary" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "block size-6 rounded-full bg-card shadow-sm transition-transform",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const span = max - min || 1;
  const pct = Math.min(100, Math.max(0, ((value - min) / span) * 100));
  const snap = (raw: number) => {
    const s = step && step > 0 ? step : 1;
    const n = Math.round(raw / s) * s;
    const clamped = Math.min(max, Math.max(min, n));
    const digits = s < 0.1 ? 2 : s < 1 ? 1 : 0;
    return Number(clamped.toFixed(digits));
  };
  const fromX = (clientX: number) => {
    const el = track.current;
    if (!el || disabled) return;
    const r = el.getBoundingClientRect();
    const t = r.width <= 0 ? 0 : (clientX - r.left) / r.width;
    onChange(snap(min + t * span));
  };
  return (
    <div
      ref={track}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      className={cn("relative h-6 w-full touch-none select-none", disabled ? "opacity-40" : "cursor-pointer")}
      onPointerDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (disabled || !(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
        fromX(e.clientX);
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line-strong" />
      <div
        className="pointer-events-none absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-card shadow-[0_1px_4px_rgb(44_40_36/0.35)] ring-1 ring-black/10"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

export function ExpandSelect<T extends string>({
  value,
  options,
  onChange,
  render,
  className,
  align = "center",
  menu,
}: {
  value: T;
  options: { id: T; label: string; short?: string; header?: boolean; danger?: boolean }[];
  onChange: (id: T) => void;
  render?: (id: T, label: string) => ReactNode;
  className?: string;
  align?: "center" | "left";
  menu?: "start" | "center" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value);
  const trigger = current?.short ?? current?.label ?? "";
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const menuSide = menu ?? (align === "left" ? "start" : "center");
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-full px-3 text-[14px] font-medium",
          current?.danger ? "text-danger" : "text-ink",
          align === "center" ? "justify-center" : "w-full justify-between",
        )}
      >
        {render ? render(value, trigger) : trigger}
        <ChevronDown className={cn("size-4 text-muted transition", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-[110%] z-50 min-w-[10rem] overflow-hidden rounded-[20px] border border-line bg-card py-1 shadow-[0_16px_40px_rgb(44_40_36/0.16)]",
            menuSide === "start" && "left-0",
            menuSide === "end" && "right-0",
            menuSide === "center" && (align === "left" ? "left-0 right-0 w-full" : "left-1/2 w-[min(280px,80vw)] -translate-x-1/2"),
          )}
        >
          <div className="max-h-[50vh] overflow-auto scroll-thin">
            {options.map((o) =>
              o.header ? (
                <div key={o.id} className="px-4 py-1.5 text-center text-[12px] font-medium text-good">
                  {o.label}
                </div>
              ) : (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-3 text-left text-[14px]",
                    o.danger && "text-danger",
                    o.id === value ? "bg-dim/70 font-medium" : "hover:bg-surface",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.id === value && <Check className={cn("size-4 shrink-0", o.danger ? "text-danger" : "text-primary")} />}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ToastHost() {
  const toasts = useApp((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-full bg-good px-4 py-2 text-[13px] text-on-primary shadow-lg"
          style={{ animation: "toast-in 180ms ease" }}
        >
          <Check className="size-4" />
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function ZoomImg({ src, className }: { src: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="block bg-transparent p-0" aria-label="查看大图" onClick={() => setOpen(true)}>
        <img src={src} alt="" className={className} />
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] grid size-10 place-items-center rounded-full bg-card text-ink"
            aria-label="关闭"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  hideClose,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
  hideClose?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-5 pt-[12vh] pb-[max(16px,env(safe-area-inset-bottom))]">
      <button className="absolute inset-0 bg-overlay" onClick={onClose} aria-label="关闭" />
      <div
        className={cn(
          "relative max-h-[calc(100dvh-12vh-16px-env(safe-area-inset-bottom))] w-full overflow-y-auto overscroll-contain rounded-[24px] bg-bg shadow-2xl scroll-thin",
          wide ? "max-w-lg" : "max-w-sm",
        )}
      >
        <div className={cn("sticky top-0 z-10 flex items-center bg-bg px-5 pt-5 pb-4", hideClose ? "" : "justify-between")}>
          <h2 className="text-[18px] font-semibold">{title}</h2>
          {!hideClose && (
            <IconBtn onClick={onClose} className="size-9">
              <X className="size-5" />
            </IconBtn>
          )}
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmHost() {
  const confirm = useApp((s) => s.ui.confirm);
  const setUI = useApp((s) => s.setUI);
  if (!confirm) return null;
  return (
    <Modal open onClose={() => setUI({ confirm: null })} title={confirm.title}>
      <p className="mb-5 text-[14px] leading-relaxed text-muted">{confirm.body}</p>
      <div className="flex gap-3">
        <GhostBtn onClick={() => setUI({ confirm: null })}>取消</GhostBtn>
        <PrimaryBtn
          className={confirm.danger ? "bg-danger hover:bg-danger/90" : ""}
          onClick={() => {
            confirm.onOk();
            setUI({ confirm: null });
          }}
        >
          确定
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

export function useCooldown(until: number) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (until <= Date.now()) return;
    const id = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [until]);
  const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
  return left;
}

export function Avatar({
  url,
  name,
  dim,
  size = 40,
}: {
  url?: string | null;
  name?: string;
  dim?: boolean;
  size?: number;
}) {
  const ch = (name || "角").slice(0, 1);
  return (
    <div
      className={cn("overflow-hidden rounded-full bg-dim text-center font-medium text-primary", dim && "opacity-55")}
      style={{ width: size, height: size, lineHeight: `${size}px`, fontSize: size * 0.4 }}
    >
      {url ? <img src={url} alt="" className="size-full object-cover" /> : ch}
    </div>
  );
}

export function useBlobUrl(id?: string | null) {
  const [url, setUrl] = useState<string | null>(() => cachedUrl(id));
  useEffect(() => {
    let gone = false;
    if (!id) {
      setUrl(null);
      return;
    }
    const hit = cachedUrl(id);
    if (hit) {
      setUrl(hit);
      return;
    }
    setUrl(null);
    void imageUrl(id).then((u) => {
      if (!gone) setUrl(u);
    });
    return () => {
      gone = true;
    };
  }, [id]);
  return url;
}

export function ChatAvatar({
  chat,
  name,
  size,
  dim,
}: {
  chat: { name: string; avatarBlobId?: string; messages: ChatMessage[] };
  name?: string;
  size?: number;
  dim?: boolean;
}) {
  const url = useBlobUrl(firstChatImageBlob(chat));
  return <Avatar url={url} name={name ?? chat.name} size={size} dim={dim} />;
}
