"use client";

// ============================================================================
// components/gitara/lesson/quiz-block.tsx
// In-lesson checkpoint: one question, immediate feedback, no scoring.
// Deliberately not recorded anywhere — see components/algorytmy/lesson/
// quiz-block.tsx's module comment for why (same reasoning applies here: a
// graded drill lives in gtr_drill_attempts and is reached from /gitara/cwicz
// or a dział's practice section, not from a comprehension check mid-read).
// ============================================================================
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/gitara/lesson/rich-text";
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
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;

  return (
    <Card className="flex flex-col gap-2.5 bg-surface-muted">
      <CardTitle>
        <RichText text={question} as="span" />
      </CardTitle>

      <div className="flex flex-col gap-1.5">
        {options.map((option, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === correctIndex;
          const reveal = answered && (isChosen || isCorrect);

          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setChosen(i)}
              className={cn(
                "flex items-center gap-2 rounded-(--radius-control) px-3 py-2.5 text-left text-sm transition-colors",
                !answered && "bg-surface text-foreground active:bg-primary-soft",
                answered && !reveal && "bg-surface text-foreground-muted",
                reveal && isCorrect && "bg-accent-soft text-foreground",
                reveal && !isCorrect && "bg-danger-soft text-foreground"
              )}
            >
              <span className="min-w-0 flex-1">
                <RichText text={option} as="span" />
              </span>
              {reveal && isCorrect && <Check className="h-4 w-4 shrink-0 text-accent" />}
              {reveal && !isCorrect && <X className="h-4 w-4 shrink-0 text-danger" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="rounded-(--radius-control) bg-surface px-3 py-2">
          <p className="text-xs font-semibold text-foreground-muted">
            {chosen === correctIndex ? "Dobrze" : "Niedokładnie"}
          </p>
          <RichText text={explanation} className="text-sm text-foreground" />
        </div>
      )}
    </Card>
  );
}
