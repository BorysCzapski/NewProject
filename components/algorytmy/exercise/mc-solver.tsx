"use client";

// ============================================================================
// components/algorytmy/exercise/mc-solver.tsx
// Answers one exercise. The correct option is NOT among this component's
// props — it arrives only in the Server Action's response, after the student
// commits to an answer (lib/algorytmy/actions.ts). Anything the client knows,
// the client can be made to reveal.
// ============================================================================
import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { submitExerciseAnswer, type AlgoAttemptReview } from "@/lib/algorytmy/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/algorytmy/lesson/rich-text";
import type { AlgoExerciseOption } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function McSolver({
  exerciseId,
  options,
}: {
  exerciseId: string;
  options: AlgoExerciseOption[];
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [review, setReview] = useState<AlgoAttemptReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!chosen || review) return;
    setError(null);
    startTransition(async () => {
      const result = await submitExerciseAnswer({ exerciseId, chosenOptionId: chosen });
      if (result.ok) setReview(result.data);
      else setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isChosen = chosen === option.id;
          const isCorrect = review?.correctOptionId === option.id;
          const reveal = review !== null && (isChosen || isCorrect);

          return (
            <button
              key={option.id}
              type="button"
              disabled={review !== null || pending}
              onClick={() => setChosen(option.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-(--radius-control) border px-3.5 py-3 text-left text-sm transition-colors",
                !review && isChosen && "border-primary bg-primary-soft text-foreground",
                !review && !isChosen && "border-border bg-surface text-foreground active:bg-surface-muted",
                review && !reveal && "border-border bg-surface text-foreground-muted",
                reveal && isCorrect && "border-accent bg-accent-soft text-foreground",
                reveal && !isCorrect && "border-danger bg-danger-soft text-foreground"
              )}
            >
              <span className="min-w-0 flex-1">
                <RichText text={option.text} as="span" />
              </span>
              {reveal && isCorrect && <Check className="h-4 w-4 shrink-0 text-accent" />}
              {reveal && !isCorrect && <X className="h-4 w-4 shrink-0 text-danger" />}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {!review && (
        <Button onClick={submit} disabled={!chosen} isLoading={pending} className="w-full">
          Sprawdź odpowiedź
        </Button>
      )}

      {review && (
        <Card className={cn("flex flex-col gap-1", review.isCorrect ? "bg-accent-soft" : "bg-surface-muted")}>
          <p className="text-sm font-semibold text-foreground">
            {review.isCorrect ? "Dobrze!" : "Nie tym razem"}
          </p>
          <RichText text={review.explanation} className="text-sm text-foreground" />
        </Card>
      )}
    </div>
  );
}
