import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Phone } from "lucide-react";
import { Card, formatPhoneFromId } from "./Shared";
import { updateAgent, type Agent } from "@/lib/agent-store";

export function DeployTab({ agent }: { agent: Agent }) {
  const number = useMemo(() => formatPhoneFromId(agent.id), [agent.id]);
  const [copied, setCopied] = useState(false);
  const isLive = agent.status === "live";

  function copyNumber() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(number).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  const checks = [
    { label: "Voice configured", ok: !!agent.tts },
    { label: "Workflow generated", ok: !!agent.workflow },
    { label: "Guardrails active", ok: agent.guardrails.length > 0 },
    { label: "Test call passed", ok: !!agent.lastTested },
  ];
  const ready = checks.every((c) => c.ok);

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isLive ? "border-status-live/30 bg-status-live/8" : "border-hairline bg-surface"}`}>
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isLive ? "bg-status-live/15 text-status-live" : "bg-primary-soft text-primary"}`}>
            <Phone className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-[14px] font-medium text-heading">
              {isLive ? "Live in production" : ready ? "Ready to publish" : "Almost there"}
            </h2>
            <p className="text-[11.5px] text-secondary-text">
              {isLive
                ? "This agent is answering production calls."
                : ready
                ? "All checks pass. Promote to start taking real calls."
                : "Finish the remaining setup items below to publish."}
            </p>
          </div>
        </div>
        <button
          onClick={() => updateAgent(agent.id, { status: isLive ? "draft" : "live" })}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-colors ${isLive ? "border border-hairline bg-surface text-secondary-text hover:text-destructive" : "btn-primary"}`}
        >
          {isLive ? "Unpublish" : "Promote to production"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* Phone number */}
        <Card title="Phone number" sub="Auto-provisioned test line — call it from any phone right now.">
          <div className="rounded-xl border border-hairline bg-gradient-to-br from-canvas-soft to-surface p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary ring-1 ring-violet-border">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" /> Test number
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-text">US · Toll-free</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="font-mono text-[22px] tracking-tight text-heading">{number}</p>
              <button
                onClick={copyNumber}
                className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-1 text-[11px] text-secondary-text hover:text-heading cursor-pointer"
              >
                {copied ? <CheckCircle2 className="h-3 w-3 text-status-live" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { k: "Region", v: "US-East" },
                { k: "Latency", v: "~180ms" },
                { k: "SLA", v: "99.95%" },
              ].map((m) => (
                <div key={m.k} className="rounded-md bg-surface/70 px-2 py-1.5 ring-1 ring-hairline">
                  <p className="text-[9.5px] uppercase tracking-wider text-muted-text">{m.k}</p>
                  <p className="mt-0.5 text-[12px] font-medium text-heading">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-3 py-1.5 text-[12px] text-secondary-text hover:text-heading cursor-pointer">
              Map a custom number
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-3 py-1.5 text-[12px] text-secondary-text hover:text-heading cursor-pointer">
              Set business hours
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
