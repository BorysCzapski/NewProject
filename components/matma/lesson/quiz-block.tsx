"use client";

// ============================================================================
// components/matma/lesson/quiz-block.tsx
// Inline "sprawdź się" mini-quiz inside a lesson: instant visual feedback,
// modeled on components/grammar/lesson/quiz-block.tsx. Matma-specific
// addition: on a WRONG answer, an expandable "Przypomnienie" box shows the
// text of the nearest preceding intro/definition/formula block (passed down
// by block-renderer.tsx as `recapText`) so the student can re-read the
// relevant explanation without leaving the quiz.
// ============================================================================
import { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";

export function QuizBlock({
  question,
  options,
  correctIndex,
  explanation,
  recapText,
  onResult,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  recapText?: string;
  onResult?: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [recapOpen, setRecapOpen] = useState(false);
  const answered = picked !== null;

  function pick(i: number) {
    setPicked(i);
    onResult?.(i === correctIndex);
  }

  return (
    <Card className="border-primary/30">
      <CardTitle className="flex items-center gap-2">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          Sprawdź się
        </span>
      </CardTitle>
      <MathText text={question} className="mt-2 text-base font-medium text-foreground" />

      <div className="mt-3 flex flex-col gap-2">
        {options.map((option, i) => {
          const isCorrect = i === correctIndex;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => pick(i)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-2 rounded-(--radius-control) border px-3 py-2 text-left text-sm font-medium transition-colors",
                !answered && "border-border bg-surface text-foreground active:bg-surface-muted",
                answered && isCorrect && "border-transparent bg-accent-soft text-accent",
                answered && isPicked && !isCorrect && "border-transparent bg-danger-soft text-danger",
                answered && !isPicked && !isCorrect && "border-border text-foreground-muted opacity-60"
              )}
            >
              <MathText text={option} className="text-sm" />
              {answered && isCorrect && <Check className="h-4 w-4 shrink-0" />}
              {answered && isPicked && !isCorrect && <X className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <>
          <div
            className={cn(
              "mt-3 rounded-(--radius-control) px-3 py-2 text-sm leading-relaxed",
              picked === correctIndex ? "bg-accent-soft text-accent" : "bg-surface-muted text-foreground"
            )}
          >
            {picked === correctIndex ? "Dobrze! " : "Nie tym razem. "}
            <MathText text={explanation} className="inline text-inherit" />
          </div>

          {picked !== correctIndex && recapText && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setRecapOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform", recapOpen && "rotate-180")} />
                Przypomnienie
              </button>
              {recapOpen && (
                <MathText
                  text={recapText}
                  className="mt-2 rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground-muted"
                />
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
