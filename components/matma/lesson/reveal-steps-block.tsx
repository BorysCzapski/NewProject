"use client";

// ============================================================================
// components/matma/lesson/reveal-steps-block.tsx
// A guided problem walkthrough: the problem statement stays visible, but
// steps are shown ONE AT A TIME. Each step asks the student to predict or
// compute something ("choice" options or a free-text "input" checked with a
// loose comparison), then — right or wrong — reveals the correct step's
// explanation/formula before a "Następny krok" button advances.
// ============================================================================
import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { MathBlock as KatexBlock, MathText } from "@/components/matma/math";
import { isAcceptedAnswer, type RevealStep } from "@/lib/matma/lesson-blocks";
import { cn } from "@/lib/utils";

function RevealStepView({
  step,
  isLast,
  onNext,
}: {
  step: RevealStep;
  isLast: boolean;
  onNext: () => void;
}) {
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [checked, setChecked] = useState(false);

  const answered = step.kind === "choice" ? choiceIndex !== null : checked;
  const correct =
    step.kind === "choice"
      ? choiceIndex === step.correctIndex
      : isAcceptedAnswer(inputValue, step.acceptedAnswers ?? []);

  return (
    <div className="flex flex-col gap-3">
      <MathText text={step.prompt} className="text-sm font-medium text-foreground" />

      {step.kind === "choice" && step.options && (
        <div className="flex flex-col gap-2">
          {step.options.map((option, i) => {
            const isCorrect = i === step.correctIndex;
            const isPicked = i === choiceIndex;
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setChoiceIndex(i)}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-2 rounded-(--radius-control) border px-3 py-2 text-left text-sm font-medium transition-colors",
                  !answered && "border-border bg-surface text-foreground active:bg-surface-muted",
                  answered && isCorrect && "border-transparent bg-accent-soft text-accent",
                  answered && isPicked && !isCorrect && "border-transparent bg-danger-soft text-danger",
                  answered && !isPicked && !isCorrect && "border-border text-foreground-muted opacity-60"
                )}
              >
                <MathText text={option} className="text-sm" />
                {answered && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {step.kind === "input" && (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={checked}
            placeholder="Twoja odpowiedź"
            className="flex-1"
          />
          <Button
            variant={checked ? "outline" : "primary"}
            disabled={checked || !inputValue.trim()}
            onClick={() => setChecked(true)}
          >
            Sprawdź
          </Button>
        </div>
      )}

      {step.kind === "input" && checked && (
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            correct ? "text-accent" : "text-danger"
          )}
        >
          {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {correct ? "Dobrze!" : "Nie tym razem — zobacz poniżej, jak to rozwiązać."}
        </p>
      )}

      {answered && (
        <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2">
          <MathText text={step.reveal} className="text-sm text-foreground" />
          {step.formula && <KatexBlock className="text-base">{step.formula}</KatexBlock>}
        </div>
      )}

      {answered && !isLast && (
        <Button size="sm" className="self-start" onClick={onNext}>
          Następny krok
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {answered && isLast && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
          <PartyPopper className="h-4 w-4" />
          To już wszystkie kroki tego zadania.
        </p>
      )}
    </div>
  );
}

export function RevealStepsBlock({
  title,
  problem,
  steps,
}: {
  title?: string;
  problem: string;
  steps: RevealStep[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <Card>
      <CardTitle>{title ?? "Rozwiąż krok po kroku"}</CardTitle>
      <MathText text={problem} className="mt-2 text-sm text-foreground" />

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        Krok {currentStep + 1} z {steps.length}
      </p>
      <div className="mt-1">
        {step && (
          <RevealStepView
            key={currentStep}
            step={step}
            isLast={isLast}
            onNext={() => setCurrentStep((n) => Math.min(n + 1, steps.length - 1))}
          />
        )}
      </div>
    </Card>
  );
}
