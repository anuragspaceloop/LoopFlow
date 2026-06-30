import { useState } from "react";
import { Settings2, X, Bot, Mic2, Volume2, Shield } from "lucide-react";
import { Card, Row } from "./Shared";
import {
  updateAgent,
  LLMS,
  STTS,
  VOICES,
  type Agent,
} from "@/lib/agent-store";

export function AdvancedDrawer({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-surface shadow-lg">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-surface/95 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <Settings2 className="h-3.5 w-3.5 text-secondary-text" />
            <h2 className="text-[13px] font-medium text-heading">Advanced</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-secondary-text hover:bg-canvas-soft hover:text-heading cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="space-y-4 px-5 py-4">
          <Card title="Persona" sub="Source of truth — edit directly.">
            <PersonaEditor agent={agent} />
          </Card>
          <Card title="Model & transcriber" sub="Auto-set. Override if needed.">
            <Row label="LLM" icon={Bot} value={LLMS.find((l) => l.id === agent.llm)?.name ?? agent.llm} />
            <Row label="STT" icon={Mic2} value={STTS.find((s) => s.id === agent.stt)?.name ?? agent.stt} />
            <Row label="TTS voice" icon={Volume2} value={VOICES.find((v) => v.id === agent.tts)?.name ?? agent.tts} />
          </Card>
          <Card title="Guardrails" sub={`${agent.guardrails.length} active rules.`}>
            <ul className="space-y-1.5 text-[12.5px] text-body">
              {agent.guardrails.map((g, i) => (
                <li key={i} className="flex gap-2">
                  <Shield className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {g}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Call settings">
            <Row label="Silence timeout" value="6s" />
            <Row label="Interruption sensitivity" value="Medium" />
            <Row label="Hold music" value="Off" />
          </Card>
        </div>
      </aside>
    </div>
  );
}

function PersonaEditor({ agent }: { agent: Agent }) {
  const [val, setVal] = useState(agent.persona);
  const dirty = val !== agent.persona;
  return (
    <div className="space-y-2">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={6}
        className="w-full resize-y rounded-md border border-hairline bg-canvas-soft px-3 py-2 text-[12.5px] leading-relaxed text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
      <div className="flex justify-end">
        <button
          disabled={!dirty}
          onClick={() => updateAgent(agent.id, { persona: val })}
          className="btn-primary disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}
