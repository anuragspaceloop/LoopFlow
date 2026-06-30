import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, TopBar } from "@/components/AppShell";
import { StatusPill, AgentAvatar } from "@/components/StatusPill";
import { getAgent } from "@/lib/agent-store";
import {
  Settings2,
  Activity,
  PhoneCall,
  Workflow,
  Plug,
  Phone,
  ArrowLeft,
} from "lucide-react";

import { ActivityTab } from "@/components/agent/ActivityTab";
import { TestTab } from "@/components/agent/TestTab";
import { WorkflowTab } from "@/components/agent/WorkflowTab";
import { IntegrationsTab } from "@/components/agent/IntegrationsTab";
import { DeployTab } from "@/components/agent/DeployTab";
import { AdvancedDrawer } from "@/components/agent/AdvancedDrawer";

export const Route = createFileRoute("/agent/$id")({
  head: () => ({ meta: [{ title: "Agent — Prodloop" }] }),
  component: AgentPage,
});

type Tab = "activity" | "test" | "workflow" | "integrations" | "deploy";

function AgentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(undefined);
  
  // Honor hash (#test, #workflow, etc.) so the build flow can land users directly on Test.
  const initialTab: Tab =
    (typeof window !== "undefined" &&
      ["activity", "test", "workflow", "integrations", "deploy"].includes(
        window.location.hash.replace("#", ""),
      )
      ? (window.location.hash.replace("#", "") as Tab)
      : undefined) ?? "activity";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Sync tab with URL hash for navigation consistency
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.hash = tab;
    }
  }, [tab]);

  useEffect(() => {
    const a = getAgent(id);
    if (!a) {
      navigate({ to: "/" });
      return;
    }
    setAgent(a);

    // Listen for agent updates
    const handler = () => {
      const fresh = getAgent(id);
      if (fresh) setAgent(fresh);
    };
    window.addEventListener("prodloop:agents", handler);
    return () => window.removeEventListener("prodloop:agents", handler);
  }, [id, navigate]);

  if (!agent) return null;

  const topbar = (
    <TopBar>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="btn-icon"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <AgentAvatar name={agent.name} accent={agent.template ? "emerald" : "violet"} size={28} />
        <h1 className="text-[15px] font-semibold tracking-tight text-heading">{agent.name}</h1>
        <StatusPill status={agent.status} />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAdvancedOpen(true)}
          className="btn-secondary"
        >
          <Settings2 className="h-3.5 w-3.5" /> Advanced
        </button>
      </div>
    </TopBar>
  );

  return (
    <AppShell topbar={topbar}>
      <div className="border-b border-hairline bg-canvas px-6">
        <nav className="flex gap-0">
          {(
            [
              ["activity", "Activity", Activity],
              ["test", "Test", PhoneCall],
              ["workflow", "Workflow", Workflow],
              ["integrations", "Integrations", Plug],
              ["deploy", "Deploy", Phone],
            ] as const
          ).map(([key, label, Icon]) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative inline-flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] transition-colors cursor-pointer ${
                  active ? "text-heading" : "text-secondary-text hover:text-heading"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
                {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="px-6 py-6">
        {tab === "activity" && <ActivityTab agent={agent} onTest={() => setTab("test")} />}
        {tab === "test" && <TestTab agent={agent} onNext={() => setTab("workflow")} />}
        {tab === "workflow" && <WorkflowTab agent={agent} onNext={() => setTab("integrations")} />}
        {tab === "integrations" && <IntegrationsTab agent={agent} onNext={() => setTab("deploy")} />}
        {tab === "deploy" && <DeployTab agent={agent} />}
      </main>

      {advancedOpen && <AdvancedDrawer agent={agent} onClose={() => setAdvancedOpen(false)} />}
    </AppShell>
  );
}
