"use client";

// ============================================================================
// components/geografia/exercise/mc-solver.tsx
// Single-choice MC exercise: pick one option, submit, get instant
// programmatic feedback (full/zero points — no partial credit for MC per
// product spec, only map tasks get partial credit).
// ============================================================================
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitExerciseAttempt, type ExerciseAttemptReview } from "@/lib/geografia/actions";
import type { GeoExerciseAttempt, GeoMcOption } from "@/lib/types/database";

export function McSolver({
  exerciseId,
  options,
  pointsMax,
  isSpacedReview,
}: {
  exerciseId: string;
  options: GeoMcOption[];
  pointsMax: number;
  isSpacedReview: boolean;
}) {
  const [startedAt] = useState(() => Date.now());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attempt: GeoExerciseAttempt; review: ExerciseAttemptReview } | null>(null);

  async function submit() {
    if (!selectedId) return;
    setIsPending(true);
    setError(null);
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const response = await submitExerciseAttempt(
      exerciseId,
      { selectedOptionIds: [selectedId] },
      durationSeconds,
      isSpacedReview
    );
    setIsPending(false);
    if (!response.ok) {
      setError(response.error);
      return;
    }
    setResult(response.data);
  }

  const answered = !!result;
  const correctSet = new Set(result?.review.correctOptionIds ?? []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const isCorrect = correctSet.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={answered}
              onClick={() => setSelectedId(option.id)}
              className={cn(
                "flex min-h-12 items-center justify-between gap-2 rounded-(--radius-control) border px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                !answered && !isSelected && "border-border bg-surface text-foreground active:bg-surface-muted",
                !answered && isSelected && "border-primary bg-primary-soft text-primary",
                answered && isCorrect && "border-transparent bg-accent-soft text-accent",
                answered && isSelected && !isCorrect && "border-transparent bg-danger-soft text-danger",
                answered && !isSelected && !isCorrect && "border-border text-foreground-muted opacity-60"
              )}
            >
              {option.text}
              {answered && isCorrect && <Check className="h-4 w-4 shrink-0" />}
              {answered && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {!answered && (
        <Button disabled={!selectedId} isLoading={isPending} onClick={submit}>
          Sprawdź odpowiedź
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {answered && (
        <p className={cn("text-sm font-medium", result.attempt.points_awarded > 0 ? "text-accent" : "text-danger")}>
          {result.attempt.points_awarded > 0 ? "Poprawnie! " : "Niepoprawnie. "}
          Zdobyto {result.attempt.points_awarded} / {pointsMax} pkt.
        </p>
      )}
    </div>
  );
}
