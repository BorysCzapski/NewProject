"use client";

// ============================================================================
// components/matma/diagnostic/diagnostic-runner.tsx
// Fast-paced per-topic diagnostic: steps through a handful of problems
// (getDiagnosticProblemSet), grading each through the normal
// submitProblemAttempt pipeline but showing only a quick "X / Y pkt" readout
// (not the full AI feedback card — this is a placement check, not a lesson).
// Deliberately self-contained: does NOT import components/matma/problem/**
// (owned by a different parallel work area).
// ============================================================================
import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MathText } from "@/components/matma/math";
import { submitProblemAttempt, finalizeDiagnostic } from "@/lib/matma/actions";
import { cn } from "@/lib/utils";
import type { MathProblem } from "@/lib/types/database";

const DIFFICULTY_CONFIG: Record<1 | 2 | 3, { label: string; className: string }> = {
  1: { label: "Poziom 1", className: "bg-accent-soft text-accent" },
  2: { label: "Poziom 2", className: "bg-warning-soft text-warning" },
  3: { label: "Poziom 3", className: "bg-danger-soft text-danger" },
};

interface DiagnosticRunnerProps {
  topicId: string;
  topicSlug: string;
  problems: MathProblem[];
}

interface CheckedResult {
  pointsAwarded: number;
  pointsMax: number;
}

export function DiagnosticRunner({ topicId, topicSlug, problems }: DiagnosticRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [result, setResult] = useState<CheckedResult | null>(null);
  const [collected, setCollected] = useState<CheckedResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (problems.length === 0) {
    return (
      <Card className="text-center text-sm text-foreground-muted">
        Brak zadań do diagnozy w tym dziale.
      </Card>
    );
  }

  if (isDone) {
    const earned = collected.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const max = collected.reduce((sum, r) => sum + r.pointsMax, 0);
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Sparkles className="h-6 w-6" />
        </span>
        <CardTitle>Diagnoza zakończona</CardTitle>
        <CardDescription>
          Zdobyto {earned} / {max} pkt. Ten dział ma już ustawiony punkt startowy — dalsza nauka i ćwiczenia
          dopasują się do Twojego poziomu.
        </CardDescription>
        <div className="mt-2 flex w-full flex-col gap-2">
          <Link href={`/matma/nauka/${topicSlug}`} className="w-full">
            <Button size="lg" className="w-full">
              Przejdź do działu
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/matma/diagnoza" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              Wróć do diagnozy
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const problem = problems[index];
  const difficultyConfig = DIFFICULTY_CONFIG[problem.difficulty];
  const isLast = index === problems.length - 1;

  function handleCheck() {
    setError(null);
    startTransition(async () => {
      const submission = await submitProblemAttempt(problem.id, {
        answerText: answerText.trim() || null,
        methodDescription: null,
        canvasImageDataUrl: null,
      });
      if (!submission.ok) {
        setError(submission.error);
        return;
      }
      const next: CheckedResult = {
        pointsAwarded: submission.data.points_awarded ?? 0,
        pointsMax: problem.points_max,
      };
      setResult(next);
      setCollected((prev) => [...prev, next]);
    });
  }

  function handleNext() {
    if (isLast) {
      setError(null);
      startTransition(async () => {
        const finalized = await finalizeDiagnostic(topicId);
        if (!finalized.ok) {
          setError(finalized.error);
          return;
        }
        setIsDone(true);
      });
      return;
    }
    setIndex((i) => i + 1);
    setAnswerText("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground-muted">
          Pytanie {index + 1} z {problems.length}
        </p>
        <div className="flex gap-1">
          {problems.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-5 rounded-full",
                i < index ? "bg-accent" : i === index ? "bg-primary" : "bg-surface-muted"
              )}
            />
          ))}
        </div>
      </div>

      <Card className="flex flex-col gap-3">
        <Badge className={cn("w-fit", difficultyConfig.className)}>{difficultyConfig.label}</Badge>
        <MathText text={problem.content.statement} className="text-foreground" />
      </Card>

      <div>
        <Label htmlFor="diagnostic-answer">Twoja odpowiedź</Label>
        <Input
          id="diagnostic-answer"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          disabled={result !== null || isPending}
          placeholder="np. x = 3"
        />
      </div>

      {result && (
        <Card className="flex items-center gap-3 bg-accent-soft">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
          <p className="font-semibold text-accent">
            {result.pointsAwarded} / {result.pointsMax} pkt
          </p>
        </Card>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {result === null ? (
        <Button size="lg" className="w-full" isLoading={isPending} disabled={!answerText.trim()} onClick={handleCheck}>
          Sprawdź
        </Button>
      ) : (
        <Button size="lg" className="w-full" isLoading={isPending} onClick={handleNext}>
          {isLast ? "Zakończ diagnozę" : "Dalej"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
