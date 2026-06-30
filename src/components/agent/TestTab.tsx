import React, { useEffect, useRef, useState } from "react";
import {
  PhoneCall,
  Volume2,
  Sparkles,
  Phone,
  PhoneOff,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Send,
  Shield,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "./Shared";
import { LiveCallOrb, type CallState } from "@/components/LiveCallOrb";
import {
  updateAgent,
  applyPromptFix,
  appendToPersona,
  appendToKnowledge,
  VOICES,
  type Agent,
} from "@/lib/agent-store";

type TranscriptLine = { speaker: "agent" | "caller"; text: string };
type ChatTurn =
  | { role: "agent"; text: string }
  | { role: "you"; text: string }
  | { role: "fix"; fix: PendingFix; applied?: boolean };

type PendingFix = {
  kind: "guardrail" | "persona" | "knowledge";
  summary: string;
  before: string;
  after: string;
  newGuardrail?: string;
  personaAddition?: string;
  knowledgeAddition?: string;
};

const DEMO_SCRIPT: TranscriptLine[] = [
  { speaker: "agent", text: "Hi, thanks for calling. How can I help today?" },
  { speaker: "caller", text: "Hi, I want to check on order 4421." },
  { speaker: "agent", text: "Happy to help. Let me look that up — one moment." },
  { speaker: "caller", text: "Sure." },
  { speaker: "agent", text: "Order 4421 shipped yesterday and should arrive Friday. Anything else?" },
];

export function TestTab({ agent, onNext }: { agent: Agent; onNext: () => void }) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [chat, setChat] = useState<ChatTurn[]>([
    {
      role: "agent",
      text: "Run a test call, then tell me what to change in plain English. Try: 'add to SOP that we never quote pricing on the call'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [tts, setTts] = useState(agent.tts);
  const [issueSuggested, setIssueSuggested] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const scriptIdxRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat]);

  function clearTimers() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }
  useEffect(() => () => clearTimers(), []);

  function startCall() {
    clearTimers();
    setTranscript([]);
    setIssueSuggested(false);
    scriptIdxRef.current = 0;
    setCallState("listening");
    runNext(600);
  }

  function endCall() {
    clearTimers();
    setCallState("idle");
    updateAgent(agent.id, { lastTested: Date.now(), status: "testing" });
  }

  function runNext(delay = 800) {
    const idx = scriptIdxRef.current;
    if (idx >= DEMO_SCRIPT.length) {
      const t = setTimeout(() => {
        setCallState("idle");
        updateAgent(agent.id, { lastTested: Date.now(), status: "testing" });
      }, 1000);
      timersRef.current.push(t);
      return;
    }
    const line = DEMO_SCRIPT[idx];
    const t = setTimeout(() => {
      setTranscript((prev) => [...prev, line]);
      setCallState(line.speaker === "agent" ? "speaking" : "listening");
      scriptIdxRef.current += 1;
      const nextDelay = line.text.length * 55 + 400;
      runNext(nextDelay);
    }, delay);
    timersRef.current.push(t);
  }

  async function submit() {
    if (!input.trim()) return;
    const txt = input;
    setInput("");
    setChat((prev) => [...prev, { role: "you", text: txt }]);

    // Simulate AI synthesis
    await new Promise((r) => setTimeout(r, 1200));
    const fix = synthesizeFix(txt);
    setChat((prev) => [
      ...prev,
      { role: "agent", text: `I drafted a change based on: "${txt}". Review and apply it below.` },
      { role: "fix", fix },
    ]);
  }

  function applyFix(idx: number) {
    setChat((prev) => {
      const next = [...prev];
      const item = next[idx];
      if (item.role !== "fix") return prev;
      item.applied = true;
      const fix = item.fix;
      if (fix.kind === "guardrail") {
        applyPromptFix(agent.id, {
          summary: fix.summary,
          before: fix.before,
          after: fix.after,
          newGuardrail: fix.newGuardrail,
        });
      } else if (fix.kind === "persona" && fix.personaAddition) {
        appendToPersona(agent.id, fix.personaAddition);
      } else if (fix.kind === "knowledge" && fix.knowledgeAddition) {
        appendToKnowledge(agent.id, fix.knowledgeAddition);
      }
      return next;
    });
  }

  const hasTested = !!agent.lastTested;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4 overflow-hidden">
      {/* Header strip — Save & continue vanishes once the agent has been tested. */}
      {!hasTested && (
        <div className="flex animate-slide-up items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-3 shrink-0">
          <div>
            <h2 className="text-[14px] font-medium text-heading">Test &amp; refine</h2>
            <p className="text-[11.5px] text-secondary-text">
              Run a call, edit by chat, then continue when it sounds right.
            </p>
          </div>
          <Button
            onClick={onNext}
            className="gap-1.5 cursor-pointer"
          >
            Save &amp; continue <ChevronDown className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      )}

      {/* 50 / 50 — Voice/Chat on the left, Transcription on the right */}
      <div className="grid flex-1 gap-4 lg:grid-cols-2 min-h-0">
        {/* LEFT — Voice view or AI Chat view */}
        {!chatOpen ? (
          <section className="relative flex flex-col rounded-2xl border border-hairline bg-surface min-h-0 h-full">
            <header className="flex items-center justify-between border-b border-hairline px-4 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary-soft text-[10px] font-medium text-primary ring-1 ring-violet-border">
                  <PhoneCall className="h-2.5 w-2.5" />
                </span>
                <span className="text-[13px] font-semibold text-heading">Voice</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-secondary-text">
                  ·
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      callState === "idle" ? "bg-status-idle" : "bg-status-live animate-pulse"
                    }`}
                  />
                  {callState === "idle" ? "Ready" : labelForState(callState)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Dropdown
                  label={VOICES.find((v) => v.id === tts)?.name ?? tts}
                  icon={Volume2}
                  options={VOICES.map((v) => ({ value: v.id, label: v.name, desc: v.desc }))}
                  value={tts}
                  onChange={(v) => {
                    setTts(v);
                    updateAgent(agent.id, { tts: v });
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => setChatOpen(true)}
                  className="gap-1.5 text-[12px] h-8 px-2.5 cursor-pointer border-hairline"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Edit with chat
                </Button>
              </div>
            </header>

            <div className="flex flex-1 flex-col items-center justify-center min-h-0">
              <LiveCallOrb state={callState} />
            </div>

            <div className="border-t border-hairline px-4 py-3 shrink-0 flex justify-end">
              {callState === "idle" ? (
                <Button
                  onClick={startCall}
                  className="gap-1.5 cursor-pointer w-full sm:w-auto"
                >
                  <Phone className="h-4 w-4" /> Start call
                </Button>
              ) : (
                <Button
                  onClick={endCall}
                  variant="destructive"
                  className="gap-1.5 cursor-pointer w-full sm:w-auto"
                >
                  <PhoneOff className="h-4 w-4" /> End call
                </Button>
              )}
            </div>
          </section>
        ) : (
          <section className="relative flex flex-col rounded-2xl border border-hairline bg-surface min-h-0 h-full">
            <header className="flex items-center justify-between border-b border-hairline px-4 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary-soft text-[10px] font-medium text-primary ring-1 ring-violet-border">
                  <Sparkles className="h-2.5 w-2.5 text-primary" />
                </span>
                <span className="text-[13px] font-semibold text-heading">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => setChatOpen(false)}
                className="text-secondary-text hover:text-heading cursor-pointer h-8 px-2.5"
              >
                Close
              </Button>
            </header>

            <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 no-scrollbar">
              {chat.map((m, i) => {
                if (m.role === "fix") {
                  return <FixCard key={i} fix={m.fix} applied={!!m.applied} onApply={() => applyFix(i)} />;
                }
                return (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${m.role === "you" ? "flex-row-reverse" : ""} animate-slide-up`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                        m.role === "agent"
                          ? "bg-canvas-soft text-secondary-text ring-1 ring-hairline"
                          : "bg-primary text-white"
                      }`}
                    >
                      {m.role === "agent" ? <Sparkles className="h-3 w-3 text-primary" /> : "Y"}
                    </span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        m.role === "agent"
                          ? "rounded-tl-md bg-canvas-soft text-heading"
                          : "rounded-tr-md bg-primary text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-hairline p-3 shrink-0">
              <div className="flex items-end gap-2 rounded-xl bg-canvas-soft p-1.5 ring-1 ring-hairline focus-within:ring-primary/20 focus-within:border-primary/30">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="Describe what to change — plain English…"
                  className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent px-1 py-1 text-[13px] text-heading placeholder:text-muted-text focus:outline-none"
                />
                <button
                  onClick={() => submit()}
                  disabled={!input.trim()}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 transition-colors hover:bg-primary-hover cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </footer>
          </section>
        )}

        {/* RIGHT — Transcription */}
        <section className="flex flex-col rounded-2xl border border-hairline bg-surface min-h-0 h-full">
          <header className="flex items-center justify-between border-b border-hairline px-4 py-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary-soft text-[10px] font-medium text-primary ring-1 ring-violet-border">
                <BookOpen className="h-2.5 w-2.5" />
              </span>
              <h3 className="text-[13px] font-medium text-heading">Transcription</h3>
            </div>
            <span className="text-[11px] text-muted-text">{transcript.length} lines</span>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 min-h-0 no-scrollbar">
            {transcript.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-[12.5px] text-muted-text">
                  Start a call to see the live transcript stream here.
                </p>
              </div>
            ) : (
              transcript.map((line, i) => (
                <div key={i} className="flex gap-3 animate-slide-up">
                  <span
                    className={`min-w-[52px] shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      line.speaker === "agent" ? "text-primary" : "text-secondary-text"
                    }`}
                  >
                    {line.speaker === "agent" ? "Agent" : "Caller"}
                  </span>
                  <p className="text-[13px] leading-relaxed text-heading">{line.text}</p>
                </div>
              ))
            )}
          </div>
          {hasTested && (
            <footer className="flex items-center justify-between border-t border-hairline bg-canvas-soft px-4 py-2.5 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                <CheckCircle2 className="h-3 w-3" /> Last tested{" "}
                {new Date(agent.lastTested!).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Button
                onClick={onNext}
                className="gap-1.5 cursor-pointer"
              >
                Continue to Workflow <ChevronDown className="h-4 w-4" />
              </Button>
            </footer>
          )}
        </section>
      </div>
    </div>
  );
}

function labelForState(s: CallState) {
  if (s === "listening") return "Listening";
  if (s === "thinking") return "Thinking";
  if (s === "speaking") return "Speaking";
  return "Idle";
}

function FixCard({
  fix,
  applied,
  onApply,
}: {
  fix: PendingFix;
  applied: boolean;
  onApply: () => void;
}) {
  const kindLabel: Record<PendingFix["kind"], { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    guardrail: { label: "Guardrail", icon: Shield },
    persona: { label: "Persona", icon: Bot },
    knowledge: { label: "Knowledge", icon: BookOpen },
  };
  const meta = kindLabel[fix.kind];
  const Icon = meta.icon;
  return (
    <div className="ml-9 animate-slide-up rounded-xl border border-violet-border bg-primary-soft/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary ring-1 ring-violet-border">
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
        {applied && (
          <span className="inline-flex items-center gap-1 text-[11px] text-status-live">
            <CheckCircle2 className="h-3 w-3" /> Applied
          </span>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-hairline bg-surface p-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-text">Before</p>
          <p className="mt-1 text-[12px] text-secondary-text line-through decoration-destructive/30">{fix.before}</p>
        </div>
        <div className="rounded-md border border-primary/30 bg-surface p-2">
          <p className="text-[10px] uppercase tracking-wider text-primary">After</p>
          <p className="mt-1 text-[12px] text-heading">{fix.after}</p>
        </div>
      </div>
      {!applied && (
        <div className="mt-3 flex gap-1.5">
          <button
            onClick={onApply}
            className="btn-primary inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium cursor-pointer"
          >
            <CheckCircle2 className="h-3 w-3" /> Apply change
          </button>
        </div>
      )}
    </div>
  );
}

function synthesizeFix(input: string): PendingFix {
  const lower = input.toLowerCase();
  if (lower.includes("pricing") || lower.includes("price") || lower.includes("cost") || lower.includes("charge")) {
    return {
      kind: "guardrail",
      summary: "Add a guardrail to never quote pricing without manager approval.",
      before: "Discuss billing and quote general prices if asked.",
      after: "Never share pricing or quote specific fees without supervisor approval. Transfer billing escalations.",
      newGuardrail: "Never share pricing without manager approval.",
    };
  }
  if (lower.includes("concise") || lower.includes("warmer") || lower.includes("warm") || lower.includes("short")) {
    return {
      kind: "persona",
      summary: "Make the tone warmer and a bit more concise.",
      before: "You are a highly technical and empathetic SaaS support agent. Guide them step-by-step.",
      after: "You are a warm, friendly SaaS support agent. Keep explanations concise and step-by-step.",
      personaAddition: "Keep explanations warm, helpful, and concise.",
    };
  }
  if (lower.includes("verify") || lower.includes("identity") || lower.includes("auth")) {
    return {
      kind: "guardrail",
      summary: "Always verify caller identity before sharing account info.",
      before: "Discuss account details once email is provided.",
      after: "Always verify the caller's full name and account PIN before sharing any account-specific info.",
      newGuardrail: "Always verify caller identity before sharing account info.",
    };
  }
  return {
    kind: "guardrail",
    summary: `Adding this guardrail: "${input}".`,
    before: "Current behavior.",
    after: "Updated per your instruction.",
    newGuardrail: input,
  };
}
