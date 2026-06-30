import type { AgentStatus } from "@/lib/agent-store";

export function StatusPill({ status }: { status: AgentStatus }) {
  const map: Record<AgentStatus, { label: string; dot: string; text: string }> = {
    live:    { label: "Live",    dot: "bg-status-live",    text: "text-status-live" },
    testing: { label: "Testing", dot: "bg-status-testing", text: "text-status-testing" },
    draft:   { label: "Draft",   dot: "bg-status-draft",   text: "text-secondary-text" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-canvas-soft px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-hairline ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const ACCENT: Record<string, { bg: string; text: string }> = {
  sky:     { bg: "bg-sky-100",     text: "text-sky-700" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
  orange:  { bg: "bg-orange-100",  text: "text-orange-700" },
  violet:  { bg: "bg-violet-100",  text: "text-violet-700" },
  rose:    { bg: "bg-rose-100",    text: "text-rose-700" },
  amber:   { bg: "bg-amber-100",   text: "text-amber-700" },
};

export function AgentAvatar({ name, accent = "violet", size = 36, avatar }: { name: string; accent?: string; size?: number; avatar?: string }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="shrink-0 rounded-full object-cover ring-1 ring-hairline bg-surface"
        style={{ width: size, height: size }}
      />
    );
  }
  const a = ACCENT[accent] ?? ACCENT.violet;
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ring-1 ring-hairline ${a.bg} ${a.text} text-[11px] font-medium`}
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
