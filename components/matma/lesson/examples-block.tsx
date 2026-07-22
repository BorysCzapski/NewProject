"use client";

// ============================================================================
// components/matma/lesson/examples-block.tsx
// Worked examples revealed step-by-step: the problem is always visible, but
// each MathExampleStep only appears once the student taps "Pokaż krok" —
// active recall instead of reading a fully-worked solution passively. The
// final answer is its own last reveal, gated behind every step.
// ============================================================================
import { useState } from "react";
import { ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Math as InlineMath, MathBlock as KatexBlock, MathText } from "@/components/matma/math";
import type { MathExampleItem } from "@/lib/matma/lesson-blocks";

function ExampleItemView({ item }: { item: MathExampleItem }) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const allStepsRevealed = revealedSteps >= item.steps.length;

  return (
    <div className="rounded-(--radius-control) border border-border p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        Zadanie
      </p>
      <KatexBlock className="text-base">{item.problem}</KatexBlock>

      {item.steps.slice(0, revealedSteps).length > 0 && (
        <ol className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
          {item.steps.slice(0, revealedSteps).map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <MathText text={step.text} className="text-sm text-foreground" />
                {step.formula && <KatexBlock className="text-base">{step.formula}</KatexBlock>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {!allStepsRevealed && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => setRevealedSteps((n) => n + 1)}
        >
          <Eye className="h-4 w-4" />
          Pokaż krok {revealedSteps + 1} z {item.steps.length}
        </Button>
      )}

      {allStepsRevealed && !answerRevealed && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          onClick={() => setAnswerRevealed(true)}
        >
          <ChevronRight className="h-4 w-4" />
          Pokaż odpowiedź
        </Button>
      )}

      {answerRevealed && (
        <div className="mt-3 flex items-center gap-2 rounded-(--radius-control) bg-accent-soft px-3 py-2">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Odpowiedź</span>
          <InlineMath className="text-accent">{item.answer}</InlineMath>
        </div>
      )}
    </div>
  );
}

export function ExamplesBlock({ title, items }: { title?: string; items: MathExampleItem[] }) {
  return (
    <Card>
      <CardTitle>{title ?? "Przykłady"}</CardTitle>
      <div className="mt-3 flex flex-col gap-3">
        {items.map((item, i) => (
          <ExampleItemView key={i} item={item} />
        ))}
      </div>
    </Card>
  );
}
