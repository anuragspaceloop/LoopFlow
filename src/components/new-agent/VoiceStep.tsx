import { ArrowLeft, ChevronRight, Languages, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, VoiceCard } from "./UI";
import { AddLanguageDropdown } from "./Dropdowns";
import { VOICES } from "@/lib/agent-store";

export function VoiceStep({
  selectedLanguages,
  setSelectedLanguages,
  voice,
  setVoice,
  onBack,
  onContinue,
}: {
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  voice: string;
  setVoice: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-display text-[28px]">Voice & language</h1>
        <p className="mt-2 text-[14px] text-secondary-text">
          Pick the languages first, then sample a voice. Change either anytime.
        </p>
      </div>

      <Field label="Languages" icon={Languages} hint="Select one or more languages. The agent can switch dynamically on caller cue.">
        <div className="flex flex-wrap items-center gap-2">
          {selectedLanguages.map((lang) => (
            <span key={lang} className="inline-flex h-[38px] items-center gap-1.5 rounded-lg bg-primary-soft px-3 text-[13px] font-semibold text-primary border border-violet-border/50">
              {lang}
              {selectedLanguages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedLanguages((prev) => prev.filter((l) => l !== lang))}
                  className="text-primary hover:text-destructive cursor-pointer"
                  aria-label={`Remove ${lang}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
          <AddLanguageDropdown
            existing={selectedLanguages}
            onAdd={(lang) => setSelectedLanguages((prev) => [...prev, lang])}
          />
        </div>
      </Field>

      <div>
        <label className="text-[13px] font-semibold text-heading">Voice</label>
        <p className="mt-0.5 text-[12px] text-secondary-text">Tap any voice to hear a 4-second sample.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {VOICES.map((v) => (
            <VoiceCard
              key={v.id}
              id={v.id}
              name={v.name}
              desc={v.desc}
              active={voice === v.id}
              onSelect={() => setVoice(v.id)}
            />
          ))}
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
          onClick={onContinue}
          className="gap-1.5 cursor-pointer"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
