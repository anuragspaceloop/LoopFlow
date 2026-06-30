import { PhoneCall } from "lucide-react";
import { Card } from "./Shared";
import { type Agent } from "@/lib/agent-store";

export function ActivityTab({ agent, onTest }: { agent: Agent; onTest: () => void }) {
  const hasTested = !!agent.lastTested;
  const stats = [
    { label: "Conversations", value: hasTested ? "1" : "0" },
    { label: "Avg duration", value: hasTested ? "1m 12s" : "—" },
    { label: "Error rate", value: hasTested ? "0%" : "—" },
    { label: "CSAT", value: hasTested ? "—" : "—" },
  ];
  return (
    <div className="space-y-4">
      {!hasTested && (
        <div className="flex items-center justify-between rounded-xl border border-violet-border bg-primary-soft px-4 py-3">
          <div>
            <h2 className="text-[14px] font-medium text-heading">No calls yet</h2>
            <p className="text-[11.5px] text-secondary-text">
              Run a test call to see metrics, transcripts and edits show up here.
            </p>
          </div>
          <button
            onClick={onTest}
            className="btn-primary inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium cursor-pointer"
          >
            <PhoneCall className="h-3.5 w-3.5" /> Run a test call
          </button>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-hairline bg-surface p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-text">{s.label}</p>
            <p className="mt-2 text-[24px] font-medium leading-none text-heading">{s.value}</p>
          </div>
        ))}
      </div>
      <Card title="Recent calls">
        {hasTested ? (
          <ul className="divide-y divide-hairline">
            <li className="flex items-center justify-between py-2 text-[13px]">
              <div>
                <p className="text-heading">Test call · order lookup</p>
                <p className="text-[11px] text-muted-text">{new Date(agent.lastTested!).toLocaleString()}</p>
              </div>
              <button className="text-[11px] font-medium text-primary hover:underline cursor-pointer">Replay</button>
            </li>
          </ul>
        ) : (
          <p className="text-[13px] text-secondary-text">No calls yet — run a test call to see activity here.</p>
        )}
      </Card>
      {agent.history.length > 0 && (
        <Card title="Recent edits" sub="Changes made via chat in the Test tab.">
          <ul className="space-y-2 text-[12.5px]">
            {agent.history.slice(0, 6).map((h, i) => (
              <li key={i} className="border-l-2 border-primary/40 pl-2.5 text-body">
                {h.summary}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
