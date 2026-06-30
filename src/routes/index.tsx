import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, TopBar } from "@/components/AppShell";
import { StatusPill, AgentAvatar } from "@/components/StatusPill";
import { CreateAgentModal } from "@/components/CreateAgentModal";
import { useAgents } from "@/lib/use-agents";
import { deleteAgent, type Agent, TEMPLATES } from "@/lib/agent-store";
import {
  Plus,
  Search,
  MoreHorizontal,
  PhoneCall,
  TrendingUp,
  Bot,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agents — Prodloop" },
      { name: "description", content: "All your voice agents in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const agents = useAgents();
  const [modalOpen, setModalOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => agents.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
    [agents, q],
  );

  const stats = useMemo(() => {
    const live = agents.filter((a) => a.status === "live").length;
    const testing = agents.filter((a) => a.status === "testing").length;
    const calls = agents.reduce((n, a) => n + (a.callsToday ?? 0), 0);
    return { total: agents.length, live, testing, calls };
  }, [agents]);

  return (
    <AppShell
      topbar={
        <TopBar>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-heading">Agents</h1>
            <span className="text-[13px] font-medium text-muted-text">{agents.length} total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden h-[38px] items-center gap-2 rounded-lg border border-hairline bg-surface px-3 text-[13px] text-secondary-text md:flex">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search agents"
                className="w-56 bg-transparent text-heading placeholder:text-muted-text focus:outline-none"
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" /> New agent
            </button>
          </div>
        </TopBar>
      }
    >
      <main className="px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total agents" value={String(stats.total)} icon={Bot} />
          <StatCard label="Live" value={String(stats.live)} icon={CheckCircle2} accent="live" />
          <StatCard label="In testing" value={String(stats.testing)} icon={TrendingUp} />
          <StatCard label="Calls today" value={String(stats.calls)} icon={PhoneCall} />
        </div>

        {/* Agents table */}
        <section className="mt-6 overflow-hidden rounded-lg border border-hairline bg-surface">
          <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-heading">Your agents</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <Tab active>All</Tab>
              <Tab>Live</Tab>
              <Tab>Testing</Tab>
              <Tab>Draft</Tab>
            </div>
          </header>

          {filtered.length === 0 ? (
            <EmptyState onCreate={() => setModalOpen(true)} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-hairline text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                    <th className="px-4 py-3">Agent</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Voice</th>
                    <th className="px-4 py-3">Languages</th>
                    <th className="px-4 py-3">Last tested</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <AgentRow key={a.id} agent={a} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <CreateAgentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "live";
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-text">{label}</span>
        <Icon className={`h-4 w-4 ${accent === "live" ? "text-status-live" : "text-muted-text"}`} />
      </div>
      <p className="mt-4 text-3xl font-semibold leading-none tracking-tight text-heading">{value}</p>
    </div>
  );
}

function Tab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`rounded-md px-2.5 py-1 text-[12px] transition-colors ${
        active ? "bg-canvas-soft text-heading" : "text-secondary-text hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  const navigate = useNavigate();
  const accent = TEMPLATES.find((t) => t.id === agent.template)?.accent ?? "violet";

  return (
    <tr
      className="cursor-pointer border-b border-hairline last:border-0 hover:bg-canvas-soft/60"
      onClick={() => navigate({ to: "/agent/$id", params: { id: agent.id } })}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <AgentAvatar name={agent.name} accent={accent} size={32} avatar={agent.avatar} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">{agent.name}</p>
            <p className="truncate text-[12.5px] text-muted-text">{agent.persona.slice(0, 64) || "—"}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><StatusPill status={agent.status} /></td>
      <td className="px-4 py-3 text-secondary-text">{agent.voice}</td>
      <td className="px-4 py-3 text-secondary-text">{agent.languages.join(", ")}</td>
      <td className="px-4 py-3 text-secondary-text">
        {agent.lastTested ? relTime(agent.lastTested) : <span className="text-muted-text">—</span>}
      </td>
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => {
              if (confirm(`Delete ${agent.name}?`)) deleteAgent(agent.id);
            }}
            className="rounded-md p-1.5 text-muted-text hover:bg-canvas-soft hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-md p-1.5 text-muted-text hover:bg-canvas-soft hover:text-heading" aria-label="More">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-canvas-soft text-secondary-text">
        <Bot className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-heading">No agents yet</h3>
      <p className="mt-2 max-w-sm text-sm text-secondary-text">
        Spin up your first voice agent from a template, or start with a blank slate and describe what it should do.
      </p>
      <button
        onClick={onCreate}
        className="btn-primary mt-5 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[12px] font-medium"
      >
        <Plus className="h-3.5 w-3.5" /> Create agent
      </button>
    </div>
  );
}

function relTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
