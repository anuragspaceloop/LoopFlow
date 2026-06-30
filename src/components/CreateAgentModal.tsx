import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  X,
  Search,
  Plus,
  Boxes,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { TEMPLATES, type Template } from "@/lib/agent-store";
import { AgentAvatar } from "@/components/StatusPill";

export function CreateAgentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setTimeout(() => {
        document.body.style.overflow = originalOverflow;
      }, 100);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    TEMPLATES.forEach((t) => t.useCase && set.add(t.useCase));
    return Array.from(set);
  }, []);

  const filtered = TEMPLATES.filter(
    (t) =>
      (filter ? t.useCase === filter : true) &&
      (q ? t.name.toLowerCase().includes(q.toLowerCase()) || t.outcome.toLowerCase().includes(q.toLowerCase()) : true),
  );

  if (!open) return null;

  function start(template?: Template) {
    onClose();
    navigate({ to: "/new", search: template ? { template: template.id } : {} });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-0 backdrop-blur-sm">
      <div className="relative flex min-h-screen w-full max-w-none flex-col bg-canvas animate-slide-up">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-hairline bg-canvas/95 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-[14px] font-medium text-heading">Create a new agent</h2>
            <span className="text-[12px] text-muted-text">Pick a template or start fresh</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-secondary-text hover:bg-canvas-soft hover:text-heading"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {/* Top row: templates panel LEFT, scratch tile RIGHT */}
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-hairline bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-heading">Browse templates</h3>
                  <p className="mt-1 text-[13px] text-secondary-text">
                    Production-ready starting points — edit anything after.
                  </p>
                </div>
                <span className="rounded-md bg-canvas-soft px-2 py-1 text-[11px] text-secondary-text ring-1 ring-hairline">
                  {TEMPLATES.length} available
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-hairline bg-canvas px-3 py-2 text-[13px] focus-within:border-primary/40">
                  <Search className="h-3.5 w-3.5 text-muted-text" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search templates"
                    className="flex-1 bg-transparent text-heading placeholder:text-muted-text focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setFilter(null)}
                  className={`rounded-md px-2.5 py-2 text-[12px] transition-colors ${
                    filter === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-canvas text-secondary-text ring-1 ring-hairline hover:text-heading"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`rounded-md px-2.5 py-2 text-[12px] transition-colors ${
                      filter === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-canvas text-secondary-text ring-1 ring-hairline hover:text-heading"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => start()}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface p-5 text-left transition-all hover:border-primary/50 hover:shadow-sm hover:ring-1 hover:ring-primary/20 cursor-pointer"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <Plus className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-heading">Start from scratch</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-secondary-text">
                Describe what the agent should do. We'll draft the persona, knowledge and safety rules with you.
              </p>
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
                Open composer
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          {/* Templates grid */}
          <div className="mt-6">
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-text">
              {filtered.length} template{filtered.length === 1 ? "" : "s"}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => start(t)}
                  className="group relative rounded-xl border border-hairline bg-surface p-5 text-left transition-all hover:border-primary/50 hover:shadow-sm hover:ring-1 hover:ring-primary/20 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <AgentAvatar name={t.name} accent={t.accent} size={40} avatar={t.avatar} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-heading">{t.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-secondary-text">
                        {t.outcome}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-canvas-soft px-1.5 py-0.5 text-[11px] font-medium text-secondary-text ring-1 ring-hairline">
                        <Boxes className="h-3 w-3" /> {t.integrations}
                      </span>
                      {t.source && (
                        <span className="rounded-md bg-canvas-soft px-1.5 py-0.5 text-[11px] font-medium text-secondary-text ring-1 ring-hairline">
                          {t.source}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
