import { useState } from "react";
import { Wand2 } from "lucide-react";

export type Step = "describe" | "voice" | "review";

export function Field({
  label,
  hint,
  icon: Icon,
  ai,
  aiActive,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  ai?: () => void;
  aiActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2.5 transition-all duration-300 rounded-xl p-4 -mx-4 ${aiActive ? "bg-primary-soft/30 ring-1 ring-primary/10 shadow-sm" : ""}`}>
      <div className="flex items-end justify-between">
        <div>
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-heading">
            {Icon && <Icon className="h-3.5 w-3.5 text-secondary-text" />}
            {label}
          </label>
          {hint && <p className="mt-0.5 text-[12px] text-secondary-text">{hint}</p>}
        </div>
        {ai && (
          <button
            type="button"
            onClick={ai}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
              aiActive
                ? "bg-primary text-primary-foreground"
                : "text-secondary-text hover:text-primary hover:bg-canvas-soft"
            }`}
          >
            <Wand2 className="h-3 w-3" /> Write with AI
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  minRows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minRows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className="w-full resize-y rounded-md border border-hairline bg-surface px-3 py-2.5 text-[14px] leading-relaxed text-heading placeholder:text-muted-text focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
    />
  );
}

export function DirectionCard({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
        active
          ? "border-primary ring-2 ring-primary/10 bg-surface shadow-xs"
          : "border-hairline bg-surface hover:bg-canvas-soft/40"
      }`}
    >
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          active ? "bg-primary-soft text-primary" : "bg-canvas-soft text-secondary-text ring-1 ring-hairline"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-heading">{title}</p>
        <p className="mt-0.5 text-[12px] text-secondary-text">{desc}</p>
      </div>
    </button>
  );
}

export function VoiceCard({
  name,
  desc,
  active,
  onSelect,
}: {
  id: string;
  name: string;
  desc: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-xl border bg-surface p-4 text-left transition-all cursor-pointer ${
        active ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-hairline hover:border-primary/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPlaying((p) => !p);
            setTimeout(() => setPlaying(false), 1800);
          }}
          className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
            playing
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-canvas-soft text-secondary-text ring-1 ring-hairline group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
          aria-label={`Preview ${name}`}
        >
          {playing ? (
            <span className="flex items-end gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="block w-0.5 origin-bottom bg-current"
                  style={{ height: 10, animation: `wave-bar 0.7s ease-in-out ${i * 0.12}s infinite` }}
                />
              ))}
            </span>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13.5px] font-medium text-heading">{name}</p>
            {active && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                Selected
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12px] text-secondary-text">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-hairline bg-canvas-soft px-3 py-2">
      <p className="text-[10.5px] uppercase tracking-wider text-muted-text">{k}</p>
      <p className="mt-1 text-[13px] font-medium text-heading">{v}</p>
    </div>
  );
}

export function Stepper({ step }: { step: Step }) {
  const items: Array<{ id: Step; label: string }> = [
    { id: "describe", label: "Describe" },
    { id: "voice", label: "Voice" },
    { id: "review", label: "Review" },
  ];
  const idx = items.findIndex((i) => i.id === step);
  return (
    <div className="hidden items-center gap-2 md:flex">
      {items.map((it, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={it.id} className="flex items-center gap-2">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                  ? "bg-primary/15 text-primary"
                  : "bg-canvas-soft text-muted-text ring-1 ring-hairline"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={`text-[12px] ${active ? "text-heading" : "text-secondary-text"}`}>{it.label}</span>
            {i < items.length - 1 && <span className="mx-1 h-px w-6 bg-hairline" />}
          </div>
        );
      })}
    </div>
  );
}
