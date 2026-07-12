"use client";

// ============================================================================
// components/grammar/lesson/quiz-block.tsx
// Inline "sprawdź się" mini-quiz inside a lesson: one question, instant
// visual feedback and an explanation once answered. Purely didactic — not
// persisted and independent from the graded exercises below the lesson.
// ============================================================================
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QuizBlock({
  question,
  options,
  correctIndex,
  explanation,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <Card className="border-primary/30">
      <CardTitle className="flex items-center gap-2">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          Sprawdź się
        </span>
      </CardTitle>
      <p className="mt-2 text-base font-medium text-foreground">{question}</p>

      <div className="mt-3 flex flex-col gap-2">
        {options.map((option, i) => {
          const isCorrect = i === correctIndex;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-2 rounded-(--radius-control) border px-3 py-2 text-left text-sm font-medium transition-colors",
                !answered && "border-border bg-surface text-foreground active:bg-surface-muted",
                answered && isCorrect && "border-transparent bg-accent-soft text-accent",
                answered && isPicked && !isCorrect && "border-transparent bg-danger-soft text-danger",
                answered && !isPicked && !isCorrect && "border-border text-foreground-muted opacity-60"
              )}
            >
              {option}
              {answered && isCorrect && <Check className="h-4 w-4 shrink-0" />}
              {answered && isPicked && !isCorrect && <X className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <p
          className={cn(
            "mt-3 rounded-(--radius-control) px-3 py-2 text-sm leading-relaxed",
            picked === correctIndex
              ? "bg-accent-soft text-accent"
              : "bg-surface-muted text-foreground"
          )}
        >
          {picked === correctIndex ? "Dobrze! " : "Nie tym razem. "}
          {explanation}
        </p>
      )}
    </Card>
  );
}
