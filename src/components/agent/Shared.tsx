import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export function formatPhoneFromId(id: string) {
  const digits = id.replace(/\D/g, "").padStart(10, "5").slice(0, 10);
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface p-4">
      <header className="mb-3">
        <h2 className="text-[13px] font-medium text-heading">{title}</h2>
        {sub && <p className="text-[11px] text-muted-text">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

export function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-[13px]">
      <span className="inline-flex items-center gap-1.5 text-secondary-text">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </span>
      <span className="text-heading">{value}</span>
    </div>
  );
}

export function Dropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  openUp,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string; desc?: string }>;
  onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex w-full items-center justify-between gap-1.5 rounded-md border border-hairline bg-surface px-3 py-2 text-[12px] text-secondary-text hover:text-heading"
      >
        <span className="inline-flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" />} {label}
        </span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className={`absolute left-0 right-0 z-30 overflow-hidden rounded-md border border-hairline bg-surface shadow-md ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-start gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-primary-soft hover:text-primary ${
                value === o.value ? "bg-canvas-soft text-heading" : "text-secondary-text"
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-heading">{o.label}</p>
                {o.desc && <p className="text-[11px] text-muted-text">{o.desc}</p>}
              </div>
              {value === o.value && <CheckCircle2 className="mt-0.5 h-3 w-3 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
