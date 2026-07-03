"use client";

// ============================================================================
// components/reading/topic-picker.tsx
// Tappable topic chips + a "random topic" button for starting a new AI
// reading text. Calls generateReadingText() directly, which redirects to the
// new text on success; on failure shows a Polish error and re-enables the
// chips so the user can retry.
// ============================================================================
import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateReadingText } from "@/lib/reading/actions";

const TOPICS = [
  "Podróże",
  "Praca",
  "Technologia",
  "Sport",
  "Kultura",
  "Nauka",
  "Historia",
  "Środowisko",
  "Jedzenie",
  "Muzyka",
];

export function TopicPicker() {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(topic: string) {
    if (pending) return;
    setPending(topic);
    setError(null);
    try {
      await generateReadingText(topic);
    } catch (err) {
      // generateReadingText redirects on success, which throws Next's internal
      // NEXT_REDIRECT error — let it propagate instead of reporting it as failure.
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Nie udało się wygenerować tekstu, spróbuj ponownie.");
      setPending(null);
    }
  }

  function pickRandom() {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    void pick(topic);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground-muted">Wybierz temat artykułu</p>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => pick(topic)}
            disabled={!!pending}
            className={cn(
              "rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors",
              "active:bg-surface-muted disabled:opacity-50",
              pending === topic && "border-primary bg-primary-soft text-primary"
            )}
          >
            {pending === topic ? "Generowanie…" : topic}
          </button>
        ))}
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="mt-4 w-full"
        onClick={pickRandom}
        disabled={!!pending}
        isLoading={!!pending}
      >
        <Shuffle className="h-5 w-5" />
        Losowy temat
      </Button>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
