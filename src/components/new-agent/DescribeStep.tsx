import { useState } from "react";
import { PhoneIncoming, PhoneOutgoing, UserSquare2, BookOpenText, Zap, X, ChevronRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Textarea, DirectionCard } from "./UI";
import { FileDrop } from "./FileDrop";
import { AddActionDropdown } from "./Dropdowns";
import { ActionChip } from "@/lib/agent-store";

export function DescribeStep({
  template,
  name,
  setName,
  direction,
  setDirection,
  persona,
  setPersona,
  knowledge,
  setKnowledge,
  files,
  setFiles,
  actions,
  disabledActionIds,
  setDisabledActionIds,
  manualActions,
  setManualActions,
  setAiOpen,
  aiOpen,
  fillPulse,
  onContinue,
}: {
  template: any;
  name: string;
  setName: (v: string) => void;
  direction: "inbound" | "outbound";
  setDirection: (v: "inbound" | "outbound") => void;
  persona: string;
  setPersona: (v: string) => void;
  knowledge: string;
  setKnowledge: (v: string) => void;
  files: Array<{ name: string; size: number }>;
  setFiles: (f: Array<{ name: string; size: number }>) => void;
  actions: ActionChip[];
  disabledActionIds: string[];
  setDisabledActionIds: React.Dispatch<React.SetStateAction<string[]>>;
  manualActions: string[];
  setManualActions: React.Dispatch<React.SetStateAction<string[]>>;
  setAiOpen: (v: "all" | "persona" | "knowledge" | null) => void;
  aiOpen: "all" | "persona" | "knowledge" | null;
  fillPulse: boolean;
  onContinue: () => void;
}) {
  const [showAddAction, setShowAddAction] = useState(false);
  const canContinue = name.trim() && persona.trim().length > 20;

  return (
    <section className={`animate-slide-up space-y-6 ${fillPulse ? "ring-1 ring-primary/10 rounded-xl p-1 transition-all" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-heading">
            {template ? "Make it yours" : "Describe your agent"}
          </h1>
          <p className="mt-2 text-[14px] text-secondary-text">
            {template
              ? "Edit the persona and knowledge — anything here is a starting point."
              : "A few sentences on what this agent does and how it should behave."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAiOpen("all")}
          className="inline-flex items-center gap-2 rounded-lg bg-canvas-soft px-3.5 py-2 text-[13px] font-medium text-heading ring-1 ring-hairline transition-all hover:bg-primary-soft hover:ring-primary/30 hover:text-primary cursor-pointer"
        >
          <Wand2 className="h-3.5 w-3.5 text-primary" /> Fill with AI
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <Field label="Agent name" hint="Shown in your dashboard.">
          <div className="w-full md:w-1/2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Support"
              className="flex h-9 w-full rounded-md border border-hairline bg-surface px-3 py-1 text-[14px] shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-text focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </Field>

        <Field label="Call direction" hint="Who initiates the call?">
          <div className="grid grid-cols-2 gap-3">
            <DirectionCard
              active={direction === "inbound"}
              onClick={() => setDirection("inbound")}
              icon={PhoneIncoming}
              title="Inbound"
              desc="Callers dial in."
            />
            <DirectionCard
              active={direction === "outbound"}
              onClick={() => setDirection("outbound")}
              icon={PhoneOutgoing}
              title="Outbound"
              desc="Agent dials out."
            />
          </div>
        </Field>
      </div>

      <Field
        label="Persona & instructions"
        icon={UserSquare2}
        hint="Tone, what to verify, when to escalate."
        ai={() => setAiOpen("persona")}
        aiActive={aiOpen === "persona"}
      >
        <Textarea value={persona} onChange={setPersona} minRows={8} placeholder="You are a calm, patient support agent…" />
      </Field>

      <Field
        label="Knowledge & FAQs"
        icon={BookOpenText}
        hint="Facts, policies. Upload docs to ingest."
        ai={() => setAiOpen("knowledge")}
        aiActive={aiOpen === "knowledge"}
      >
        <Textarea value={knowledge} onChange={setKnowledge} minRows={8} placeholder="Refund window: 30 days. Escalate chargebacks…" />
      </Field>

      <FileDrop files={files} onChange={setFiles} />

      <div className="rounded-lg border border-hairline bg-surface p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-secondary-text" />
          <span className="text-[13px] font-semibold text-heading">Capabilities</span>
          {(actions.filter(a => !disabledActionIds.includes(a.id)).length > 0 || manualActions.length > 0) && (
            <span className="text-[12px] text-secondary-text">· auto-detected from your prompt</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions
            .filter((a) => !disabledActionIds.includes(a.id))
            .map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1.5 rounded-lg bg-canvas-soft px-2.5 py-1.5 text-[12.5px] font-medium text-heading ring-1 ring-hairline">
                {a.label}
                <button
                  type="button"
                  onClick={() => setDisabledActionIds((prev) => [...prev, a.id])}
                  className="text-secondary-text hover:text-destructive cursor-pointer"
                  aria-label={`Remove ${a.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          {manualActions.map((label) => {
            const id = label.toLowerCase().replace(/\s+/g, "-");
            return (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-lg bg-canvas-soft px-2.5 py-1.5 text-[12.5px] font-medium text-heading ring-1 ring-hairline">
                {label}
                <button
                  type="button"
                  onClick={() => {
                    setManualActions((prev) => prev.filter((l) => l !== label));
                    setDisabledActionIds((prev) => prev.filter((x) => x !== id));
                  }}
                  className="text-secondary-text hover:text-destructive cursor-pointer"
                  aria-label={`Remove ${label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
          {actions.filter(a => !disabledActionIds.includes(a.id)).length === 0 && manualActions.length === 0 && (
            <p className="text-[13px] text-muted-text">Capabilities will auto-detect from your persona, or add manually</p>
          )}
          <AddActionDropdown
            existing={[...actions.filter(a => !disabledActionIds.includes(a.id)).map((a) => a.label), ...manualActions]}
            open={showAddAction}
            onToggle={() => setShowAddAction((v) => !v)}
            onAdd={(label) => {
              const id = label.toLowerCase().replace(/\s+/g, "-");
              if (disabledActionIds.includes(id)) {
                setDisabledActionIds((prev) => prev.filter((x) => x !== id));
              } else {
                setManualActions((prev) => [...prev, label]);
              }
              setShowAddAction(false);
            }}
            onClose={() => setShowAddAction(false)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-hairline mt-6">
        <Button
          disabled={!canContinue}
          onClick={onContinue}
          className="gap-1.5 cursor-pointer"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
