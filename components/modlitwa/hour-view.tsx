"use client";

// ============================================================================
// components/modlitwa/hour-view.tsx
// Przebieg jednej godziny brewiarza: kolejne części jako karty, na końcu
// przycisk „Odmówiłem tę godzinę”, który dopisuje ją do dzisiejszego wpisu
// w dzienniku (i tym samym podbija streak, jeśli to pierwsza modlitwa dnia).
// ============================================================================
import { useState, useTransition } from "react";
import { Check, ExternalLink } from "lucide-react";
import { markPrayed } from "@/lib/modlitwa/prayer-actions";
import type { AssembledHour } from "@/lib/modlitwa/hours";
import type { HourId } from "@/lib/modlitwa/hours";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HourView({
  hour,
  dateKey,
  initiallyDone,
}: {
  hour: AssembledHour;
  dateKey: string;
  initiallyDone: boolean;
}) {
  const [done, setDone] = useState(initiallyDone);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDone() {
    setError(null);
    setDone(true);
    startTransition(async () => {
      const result = await markPrayed(dateKey, hour.definition.id as HourId);
      if (!result.ok) {
        setDone(false);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-foreground-muted">{hour.definition.description}</p>

      <ol className="flex flex-col gap-3">
        {hour.steps.map((step, index) => (
          <li key={`${step.title}-${index}`}>
            <Card className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
                <h2 className="text-base font-semibold text-foreground">{step.title}</h2>
              </div>

              {step.citation && (
                <p className="text-sm font-medium text-foreground-muted">{step.citation}</p>
              )}

              {step.text && (
                <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-foreground">
                  {step.text}
                </p>
              )}

              {step.incipit && (
                <p className="text-[1.0625rem] italic leading-relaxed text-foreground">{step.incipit}</p>
              )}

              {step.note && <p className="text-sm text-foreground-muted">{step.note}</p>}
            </Card>
          </li>
        ))}
      </ol>

      <a
        href={hour.fullTextUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-primary"
      >
        <ExternalLink className="h-4 w-4" />
        Pełne teksty na brewiarz.pl
      </a>

      {done ? (
        <div className="flex h-12 items-center justify-center gap-2 rounded-(--radius-control) bg-accent-soft text-base font-medium text-foreground">
          <Check className="h-5 w-5 text-accent" />
          Odmówione dzisiaj
        </div>
      ) : (
        <Button size="lg" onClick={handleDone} isLoading={isPending} className="w-full">
          Odmówiłem {hour.definition.name.toLowerCase()}
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
