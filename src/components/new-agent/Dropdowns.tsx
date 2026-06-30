import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/agent-store";

export const ACTION_LIBRARY = [
  "Look up an order",
  "Transfer to a department",
  "Book an appointment",
  "Send a confirmation",
  "Reset a password",
  "Look up a refund",
  "Verify caller identity",
  "Check account status",
  "Process a payment",
  "Schedule a callback",
];

export function AddActionDropdown({
  existing,
  open,
  onToggle,
  onAdd,
  onClose,
}: {
  existing: string[];
  open: boolean;
  onToggle: () => void;
  onAdd: (label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const available = ACTION_LIBRARY.filter((a) => !existing.includes(a));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (available.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-dashed border-hairline bg-surface px-3 text-[13px] font-semibold text-secondary-text hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" /> Add capability
      </button>
      {open && (
        <div className="absolute left-0 bottom-full z-30 mb-1.5 w-56 rounded-lg border border-hairline bg-surface p-1 shadow-lg animate-slide-up">
          {available.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onAdd(label)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] text-heading transition-colors hover:bg-canvas-soft cursor-pointer"
            >
              <Plus className="h-3 w-3 text-secondary-text" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddLanguageDropdown({
  existing,
  onAdd,
}: {
  existing: string[];
  onAdd: (lang: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const available = LANGUAGES.filter((l) => !existing.includes(l));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (available.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 text-[13px] font-semibold text-secondary-text hover:bg-canvas-soft hover:text-heading transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" /> Add language
      </button>
      {open && (
        <div className="absolute left-0 mt-1 z-30 w-64 rounded-lg border border-hairline bg-surface p-1 shadow-lg animate-slide-up">
          {available.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                onAdd(lang);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] text-heading transition-colors hover:bg-canvas-soft cursor-pointer"
            >
              <Plus className="h-3 w-3 text-secondary-text" />
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
