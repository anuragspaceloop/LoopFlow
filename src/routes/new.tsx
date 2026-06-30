import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, TopBar } from "@/components/AppShell";
import { AgentAvatar } from "@/components/StatusPill";
import { ArrowLeft, Send, Sparkles, X, Boxes, ChevronRight, Search, Plus } from "lucide-react";
import { useMemo } from "react";
import {
  createAgent,
  detectActions,
  TEMPLATES,
  ActionChip,
} from "@/lib/agent-store";

import { Stepper, Step } from "@/components/new-agent/UI";
import { DescribeStep } from "@/components/new-agent/DescribeStep";
import { VoiceStep } from "@/components/new-agent/VoiceStep";
import { ReviewStep } from "@/components/new-agent/ReviewStep";

export const Route = createFileRoute("/new")({
  head: () => ({ meta: [{ title: "Create agent — Prodloop" }] }),
  component: NewAgent,
});

function NewAgent() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { template?: string };
  const templateId = search.template;
  const template = TEMPLATES.find((t) => t.id === templateId);

  const [step, setStep] = useState<Step>("describe");

  const [startedFromScratch, setStartedFromScratch] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    TEMPLATES.forEach((t) => t.useCase && set.add(t.useCase));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return TEMPLATES.filter(
      (t) =>
        (filter ? t.useCase === filter : true) &&
        (q ? t.name.toLowerCase().includes(q.toLowerCase()) || t.outcome.toLowerCase().includes(q.toLowerCase()) : true),
    );
  }, [filter, q]);

  // Step 1 States
  const [name, setName] = useState(template?.name ?? "");
  const [persona, setPersona] = useState(template?.persona ?? "");
  const [knowledge, setKnowledge] = useState(template?.knowledge ?? "");

  // Reset inputs when templateId changes
  useEffect(() => {
    setName(template?.name ?? "");
    setPersona(template?.persona ?? "");
    setKnowledge(template?.knowledge ?? "");
    setStep("describe");
  }, [templateId, template]);
  const [voice, setVoice] = useState("priya");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [direction, setDirection] = useState<"inbound" | "outbound">("inbound");
  const [files, setFiles] = useState<Array<{ name: string; size: number }>>([]);

  // Capabilities States
  const [actions, setActions] = useState<ActionChip[]>([]);
  const [disabledActionIds, setDisabledActionIds] = useState<string[]>([]);
  const [manualActions, setManualActions] = useState<string[]>([]);

  // AI Drawer States
  const [aiOpen, setAiOpen] = useState<"all" | "persona" | "knowledge" | null>(null);
  const [fillPulse, setFillPulse] = useState(false);

  // Auto-detect capabilities as user types persona/knowledge
  useEffect(() => {
    const text = persona + "\n" + knowledge;
    setActions(detectActions(text));
  }, [persona, knowledge]);

  function applyAI(target: "all" | "persona" | "knowledge", addition: string) {
    if (target === "all") {
      // Split by --- or guess
      const parts = addition.split("---");
      if (parts.length >= 2) {
        setPersona(parts[0].trim());
        setKnowledge(parts[1].trim());
      } else {
        setPersona(addition.trim());
      }
      // Pulse animation to show it was filled
      setFillPulse(true);
      setTimeout(() => setFillPulse(false), 1500);
    } else if (target === "persona") {
      setPersona(addition);
    } else if (target === "knowledge") {
      setKnowledge(addition);
    }
    setAiOpen(null);
  }

  function submit() {
    const manualChips: ActionChip[] = manualActions.map((label) => {
      const needs = /\b(look ?up|check|order status|book|schedul|appointment|demo|callback|reservation|confirm(ation)? text|sms|text message|email|reset|password|refund|charge)\b/i.test(label);
      const id = label.toLowerCase().replace(/\s+/g, "-");
      return {
        id,
        label,
        needsIntegration: needs,
        enabled: !disabledActionIds.includes(id),
        connected: !needs,
      };
    });
    const combinedActions = [
      ...actions.map(a => ({ ...a, enabled: !disabledActionIds.includes(a.id) })),
      ...manualChips
    ];

    const a = createAgent({
      name,
      template: templateId,
      persona,
      knowledge,
      voice,
      languages: selectedLanguages,
      direction,
      files,
      actions: combinedActions,
    });
    navigate({ to: "/build/$id", params: { id: a.id } });
  }

  if (!templateId && !startedFromScratch) {
    return (
      <AppShell
        topbar={
          <TopBar>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-[14px] font-medium text-heading">Create a new agent</h2>
              <span className="text-[12px] text-muted-text">Pick a template or start fresh</span>
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              className="rounded-md p-1.5 text-secondary-text hover:bg-canvas-soft hover:text-heading cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </TopBar>
        }
      >
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          {/* Top row: templates panel LEFT, scratch tile RIGHT */}
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-hairline bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-heading">Browse templates</h3>
                  <p className="mt-1 text-[13px] text-secondary-text">
                    Production-ready starting points — edit anything after.
                  </p>
                </div>
                <span className="rounded-md bg-canvas-soft px-2 py-1 text-[11px] text-secondary-text ring-1 ring-hairline">
                  {TEMPLATES.length} available
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-hairline bg-canvas px-3 py-2 text-[13px] focus-within:border-primary/40">
                  <Search className="h-3.5 w-3.5 text-muted-text" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search templates"
                    className="flex-1 bg-transparent text-heading placeholder:text-muted-text focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setFilter(null)}
                  className={`rounded-md px-2.5 py-2 text-[12px] transition-colors cursor-pointer ${
                    filter === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-canvas text-secondary-text ring-1 ring-hairline hover:text-heading"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`rounded-md px-2.5 py-2 text-[12px] transition-colors cursor-pointer ${
                      filter === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-canvas text-secondary-text ring-1 ring-hairline hover:text-heading"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStartedFromScratch(true)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface p-5 text-left transition-all hover:border-primary/50 hover:shadow-sm hover:ring-1 hover:ring-primary/20 cursor-pointer"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <Plus className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-heading">Start from scratch</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-secondary-text">
                Describe what the agent should do. We'll draft the persona, knowledge and safety rules with you.
              </p>
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
                Open composer
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          {/* Templates grid */}
          <div className="mt-6">
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-text">
              {filtered.length} template{filtered.length === 1 ? "" : "s"}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate({ search: { template: t.id } })}
                  className="group relative rounded-xl border border-hairline bg-surface p-5 text-left transition-all hover:border-primary/50 hover:shadow-sm hover:ring-1 hover:ring-primary/20 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <AgentAvatar name={t.name} accent={t.accent} size={40} avatar={t.avatar} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-heading">{t.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-secondary-text">
                        {t.outcome}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-canvas-soft px-1.5 py-0.5 text-[11px] font-medium text-secondary-text ring-1 ring-hairline">
                        <Boxes className="h-3 w-3" /> {t.integrations}
                      </span>
                      {t.source && (
                        <span className="rounded-md bg-canvas-soft px-1.5 py-0.5 text-[11px] font-medium text-secondary-text ring-1 ring-hairline">
                          {t.source}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  const topbar = (
    <TopBar>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (templateId) {
              navigate({ search: {} });
            } else {
              setStartedFromScratch(false);
            }
          }}
          className="rounded-md p-1 hover:bg-canvas-soft text-secondary-text hover:text-heading cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-semibold text-heading">Create agent</h1>
      </div>
      <div className="flex items-center gap-2">
        {template ? (
          <div className="flex items-center gap-2">
            <AgentAvatar name={template.name} accent={template.accent} size={22} avatar={template.avatar} />
            <span className="text-[13px] font-medium text-heading">{template.name}</span>
            <span className="text-[12px] text-muted-text">· template</span>
          </div>
        ) : (
          <span className="text-[13px] font-medium text-heading">New agent from scratch</span>
        )}
      </div>
      <Stepper step={step} />
    </TopBar>
  );

  return (
    <AppShell topbar={topbar}>
      <main
        className={`flex-1 overflow-y-auto transition-[padding] duration-300 ${
          aiOpen ? "lg:pr-[420px]" : ""
        }`}
      >
        <div className="mx-auto w-full max-w-4xl px-6 py-5">
          {step === "describe" && (
            <DescribeStep
              template={template}
              name={name}
              setName={setName}
              direction={direction}
              setDirection={setDirection}
              persona={persona}
              setPersona={setPersona}
              knowledge={knowledge}
              setKnowledge={setKnowledge}
              files={files}
              setFiles={setFiles}
              actions={actions}
              disabledActionIds={disabledActionIds}
              setDisabledActionIds={setDisabledActionIds}
              manualActions={manualActions}
              setManualActions={setManualActions}
              setAiOpen={setAiOpen}
              aiOpen={aiOpen}
              fillPulse={fillPulse}
              onContinue={() => setStep("voice")}
            />
          )}

          {step === "voice" && (
            <VoiceStep
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              voice={voice}
              setVoice={setVoice}
              onBack={() => setStep("describe")}
              onContinue={() => setStep("review")}
            />
          )}

          {step === "review" && (
            <ReviewStep
              name={name}
              template={template}
              direction={direction}
              voice={voice}
              selectedLanguages={selectedLanguages}
              actions={[...actions.filter(a => !disabledActionIds.includes(a.id)), ...manualActions]}
              files={files}
              persona={persona}
              onBack={() => setStep("voice")}
              onSubmit={submit}
            />
          )}
        </div>
      </main>

      {aiOpen && (
        <AIDrawer
          target={aiOpen}
          onClose={() => setAiOpen(null)}
          onApply={(addition) => applyAI(aiOpen, addition)}
          currentValue={aiOpen === "persona" ? persona : knowledge}
        />
      )}
    </AppShell>
  );
}

function AIDrawer({
  target,
  onClose,
  onApply,
  currentValue,
}: {
  target: "all" | "persona" | "knowledge";
  onClose: () => void;
  onApply: (text: string) => void;
  currentValue: string;
}) {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Array<{ role: "ai" | "you"; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, loading]);

  const hasConversation = turns.length > 0;

  async function send(customText?: string) {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;
    setInput("");
    setTurns((t) => [...t, { role: "you", text: textToSend }]);
    setLoading(true);

    try {
      // Simulate prompt builder API delay
      await new Promise((r) => setTimeout(r, 1600));

      let aiText = "";
      if (target === "all") {
        aiText = `You are a warm, helpful customer support representative. Assist callers with finding their packages, checking return status, and answering FAQs about Acme Corp. Always verify their order number and email before sharing sensitive details.
---
Acme Corp Policies:
- Return window: 30 days from purchase.
- Shipping: Standard takes 3-5 business days. Express takes 1-2.
- Support email: support@acme.com. Phone: 1-800-555-0199.`;
      } else if (target === "persona") {
        aiText = `You are an expert customer success manager. Your goal is to guide the user step-by-step through setting up their workspace, answer technical questions warmly and concisely, and verify their identity before discussing billing.`;
      } else {
        aiText = `FAQ & Knowledge base:
- Standard shipping takes 3-5 business days.
- Express shipping takes 1-2 business days.
- Return window is 30 days with a receipt.
- Support email: support@acme.com`;
      }

      setTurns((t) => [...t, { role: "ai", text: aiText }]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTIONS = target === "all"
    ? [
        "📞 Inbound customer support bot",
        "📅 Outbound appointment scheduler",
        "💸 Refund & order lookup agent"
      ]
    : target === "persona"
    ? [
        "⚡ Make the tone warmer & empathetic",
        "🎯 Make the responses more concise",
        "🛡️ Always verify caller identity first"
      ]
    : [
        "📦 Add return window of 30 days",
        "📧 Add support email: support@acme.com",
        "🌐 Add business hours: 9 AM - 5 PM"
      ];

  return (
    <aside className="fixed right-4 bottom-4 top-[72px] z-40 flex w-[calc(100%-32px)] md:w-[400px] flex-col rounded-2xl border border-hairline bg-surface shadow-2xl animate-slide-in-right overflow-hidden">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-[13.5px] font-semibold text-heading">Configure with AI</h3>
            <p className="text-[10.5px] text-secondary-text">
              {target === "all" ? "Draft entire agent details" : `Refine ${target}`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-secondary-text hover:bg-canvas-soft hover:text-heading cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        {!hasConversation ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/15 to-violet-500/5 text-primary ring-1 ring-primary/25 shadow-xs">
              <Sparkles className="h-7 w-7 text-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
            <h4 className="mt-4 text-[14px] font-semibold text-heading">Describe your voice agent</h4>
            <p className="mx-auto mt-2 max-w-[260px] text-[12px] leading-relaxed text-secondary-text">
              Tell me what you want the agent to do. I will draft the persona, knowledge base, and auto-wire capabilities.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-[280px]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-hairline bg-surface px-3 py-2.5 text-left text-[12.5px] font-medium text-secondary-text transition-all hover:border-primary/30 hover:bg-primary-soft hover:text-primary cursor-pointer active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {turns.map((t, i) => (
              <div key={i} className={`flex gap-2.5 ${t.role === "you" ? "flex-row-reverse" : ""} animate-slide-up`}>
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                    t.role === "ai"
                      ? "bg-canvas-soft text-secondary-text ring-1 ring-hairline"
                      : "bg-primary text-white"
                  }`}
                >
                  {t.role === "ai" ? <Sparkles className="h-3 w-3" /> : "Y"}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    t.role === "ai"
                      ? "rounded-tl-md bg-canvas-soft text-heading"
                      : "rounded-tr-md bg-primary text-white"
                  }`}
                >
                  {t.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 animate-slide-up">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-canvas-soft text-secondary-text ring-1 ring-hairline">
                  <Sparkles className="h-3 w-3" />
                </span>
                <div className="rounded-2xl rounded-tl-md bg-canvas-soft px-4 py-3 text-[13px] text-secondary-text">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary-text" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary-text" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary-text" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-hairline p-3 shrink-0">
        {hasConversation && !loading && (
          <button
            onClick={() => {
              const lastAI = [...turns].reverse().find((t) => t.role === "ai");
              if (lastAI) onApply(lastAI.text);
            }}
            className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover cursor-pointer shadow-sm animate-slide-up"
          >
            Apply to agent configuration
          </button>
        )}
        <div className="flex items-end gap-2 rounded-xl bg-canvas-soft p-1.5 ring-1 ring-hairline focus-within:ring-primary/20 focus-within:border-primary/30">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={
              target === "all"
                ? "e.g. Acme support agent for package lookup..."
                : `How should I modify the ${target}?`
            }
            className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent px-2 py-1 text-[13px] text-heading placeholder:text-muted-text focus:outline-none"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 transition-colors hover:bg-primary-hover cursor-pointer"
            aria-label="Send"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </footer>
    </aside>
  );
}
