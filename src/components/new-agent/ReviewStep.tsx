import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Summary } from "./UI";
import { AgentAvatar } from "@/components/StatusPill";
import { VOICES } from "@/lib/agent-store";

export function ReviewStep({
  name,
  template,
  direction,
  voice,
  selectedLanguages,
  actions,
  files,
  persona,
  onBack,
  onSubmit,
}: {
  name: string;
  template: any;
  direction: "inbound" | "outbound";
  voice: string;
  selectedLanguages: string[];
  actions: any[];
  files: Array<{ name: string; size: number }>;
  persona: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <section className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-display text-[28px]">Ready to build</h1>
        <p className="mt-2 text-[14px] text-secondary-text">
          We'll provision the workflow, choose the best LLM and STT, and prepare a test call.
        </p>
      </div>

      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-text">Agent</p>
            <p className="mt-1 text-[15px] font-medium text-heading">{name}</p>
          </div>
          <AgentAvatar name={name || "A"} accent={template?.accent ?? "violet"} size={36} avatar={template?.avatar} />
        </div>
        <div className="mt-4 grid gap-3 text-[12.5px] sm:grid-cols-4">
          <Summary k="Direction" v={direction === "inbound" ? "Inbound" : "Outbound"} />
          <Summary k="Voice" v={VOICES.find((v) => v.id === voice)?.name ?? voice} />
          <Summary k="Languages" v={selectedLanguages.join(", ")} />
          <Summary k="Actions" v={`${actions.length} detected`} />
        </div>
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {files.map((f) => (
              <span key={f.name} className="inline-flex items-center gap-1 rounded-md bg-canvas-soft px-2 py-1 text-[11px] text-secondary-text ring-1 ring-hairline">
                <FileText className="h-3 w-3" /> {f.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 rounded-md bg-canvas-soft p-3 text-[12.5px] leading-relaxed text-body">
          {persona.slice(0, 220)}
          {persona.length > 220 ? "…" : ""}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-hairline mt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-secondary-text hover:text-heading cursor-pointer gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onSubmit}
          className="gap-1.5 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" /> Build my agent
        </Button>
      </div>
    </section>
  );
}
