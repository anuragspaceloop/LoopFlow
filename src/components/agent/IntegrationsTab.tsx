import { useState } from "react";
import { CheckCircle2, ChevronDown, ExternalLink, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/StatusPill";
import { type Agent } from "@/lib/agent-store";

const INTEGRATIONS = [
  { id: "salesforce", name: "Salesforce", desc: "Sync contacts, log calls, update opportunities.", category: "CRM", color: "sky" },
  { id: "hubspot", name: "HubSpot", desc: "Create deals and update lifecycle stages.", category: "CRM", color: "orange" },
  { id: "zendesk", name: "Zendesk", desc: "Open tickets, attach call summaries.", category: "Support", color: "emerald" },
  { id: "intercom", name: "Intercom", desc: "Notify a teammate, send the recap to inbox.", category: "Support", color: "violet" },
  { id: "calendly", name: "Calendly", desc: "Book a meeting on a teammate's calendar.", category: "Scheduling", color: "sky" },
  { id: "twilio", name: "Twilio", desc: "Phone numbers and SIP routing.", category: "Telephony", color: "rose" },
  { id: "slack", name: "Slack", desc: "Post call summaries to a channel.", category: "Notifications", color: "violet" },
  { id: "webhook", name: "Custom webhook", desc: "Send call events to any HTTPS endpoint.", category: "Developer", color: "amber" },
];

export function IntegrationsTab({ agent, onNext }: { agent: Agent; onNext: () => void }) {
  const [tab, setTab] = useState<string>("All");
  const cats = ["All", ...Array.from(new Set(INTEGRATIONS.map((i) => i.category)))];
  const list = INTEGRATIONS.filter((i) => tab === "All" || i.category === tab);

  // first 2 connected for demo (based on agent actions count)
  const connectedIds = new Set(agent.actions.slice(0, 2).map((_, i) => INTEGRATIONS[i]?.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-3">
        <div>
          <h2 className="text-[14px] font-medium text-heading">Integrations</h2>
          <p className="text-[11.5px] text-secondary-text">
            Connect tools so the agent can take real actions on calls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-canvas-soft px-2 py-1 text-[11px] text-secondary-text ring-1 ring-hairline">
            {connectedIds.size} connected · {INTEGRATIONS.length - connectedIds.size} available
          </span>
          <Button
            onClick={onNext}
            className="gap-1.5 cursor-pointer"
          >
            Continue to deploy <ChevronDown className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`rounded-md px-2.5 py-1.5 text-[12px] transition-colors cursor-pointer ${
              tab === c
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-secondary-text ring-1 ring-hairline hover:text-heading"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => {
          const connected = connectedIds.has(i.id);
          return (
            <div
              key={i.id}
              className="group flex flex-col rounded-xl border border-hairline bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <AgentAvatar name={i.name} accent={i.color} size={32} />
                {connected && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary ring-1 ring-violet-border">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-[14px] font-medium text-heading">{i.name}</h3>
              <p className="mt-1 flex-1 text-[12px] leading-relaxed text-secondary-text">{i.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-wider text-muted-text">{i.category}</span>
                <button
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors cursor-pointer ${
                    connected
                      ? "text-secondary-text hover:text-heading"
                      : "btn-primary"
                  }`}
                >
                  {connected ? (
                    <>
                      Configure <ExternalLink className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <Plug className="h-3 w-3" /> Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
