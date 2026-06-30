import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, TopBar } from "@/components/AppShell";
import { getAgent } from "@/lib/agent-store";
import { CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/build/$id")({
  head: () => ({ meta: [{ title: "Configuring agent — Prodloop" }] }),
  component: Building,
});

const STEPS = [
  "Parsing your SOP",
  "Drafting persona and tone",
  "Building knowledge index",
  "Choosing best-fit LLM",
  "Selecting transcriber (STT)",
  "Provisioning TTS voice",
  "Wiring guardrails & actions",
  "Ready to test",
];

function Building() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!getAgent(id)) {
      navigate({ to: "/" });
      return;
    }
    if (step >= STEPS.length - 1) {
      const t = setTimeout(
        () => navigate({ to: "/agent/$id", params: { id }, hash: "test" }),
        700,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 550 + Math.random() * 300);
    return () => clearTimeout(t);
  }, [step, id, navigate]);

  return (
    <AppShell topbar={<TopBar><h1 className="text-[14px] font-medium text-heading">Configuring agent</h1></TopBar>}>
      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-14 w-14">
            <span className="absolute inset-0 animate-breathe rounded-full bg-primary shadow-md" />
            <span className="absolute inset-3 rounded-full bg-canvas" />
            <span className="absolute inset-[36%] rounded-full bg-primary animate-pulse-soft" />
          </div>
          <h1 className="text-display text-[22px]">Configuring your agent…</h1>
          <p className="mt-1 text-[13px] text-secondary-text">
            Picking the best LLM, STT and TTS combination for your workflow.
          </p>
        </div>

        <ul className="mx-auto mt-8 space-y-1.5 text-left">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-md border px-3 py-2 text-[12.5px] transition-colors ${
                  done
                    ? "border-hairline bg-surface text-secondary-text"
                    : active
                    ? "border-primary/30 bg-primary-soft/50 text-heading"
                    : "border-hairline bg-canvas-soft text-muted-text"
                }`}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-text/40" />
                  )}
                </span>
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </main>
    </AppShell>
  );
}
