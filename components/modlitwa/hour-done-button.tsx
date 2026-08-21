"use client";

// ============================================================================
// components/modlitwa/hour-done-button.tsx
// „Odmówiłem tę godzinę” — dopisuje ją do dzisiejszego wpisu w dzienniku
// (a jeśli to pierwsza modlitwa dnia, podbija też streak).
//
// Wydzielone z hour-view.tsx, bo przycisk jest wspólny dla obu ścieżek: pełnego
// tekstu z brewiarza i awaryjnego przewodnika po strukturze godziny.
// ============================================================================
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { markPrayed } from "@/lib/modlitwa/prayer-actions";
import type { HourId } from "@/lib/modlitwa/hours";
import { Button } from "@/components/ui/button";

export function HourDoneButton({
  hourId,
  hourName,
  dateKey,
  initiallyDone,
}: {
  hourId: HourId;
  hourName: string;
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
      const result = await markPrayed(dateKey, hourId);
      if (!result.ok) {
        setDone(false);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {done ? (
        <div className="flex h-12 items-center justify-center gap-2 rounded-(--radius-control) bg-accent-soft text-base font-medium text-foreground">
          <Check className="h-5 w-5 text-accent" />
          Odmówione dzisiaj
        </div>
      ) : (
        <Button size="lg" onClick={handleDone} isLoading={isPending} className="w-full">
          Odmówiłem: {hourName.toLowerCase()}
        </Button>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
