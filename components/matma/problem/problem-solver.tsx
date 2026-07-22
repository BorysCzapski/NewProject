"use client";

// ============================================================================
// components/matma/problem/problem-solver.tsx
// Main problem-practice UI: statement, the always-on InkCanvas scratchpad,
// answer/method fields (textarea instead of a single-line Input for proof
// problems), an AI hint button, and the graded-submission flow. The PARENT
// Server Component page owns problem selection — on success this only
// offers "Następne zadanie", which asks the parent for a new problem via
// router.refresh().
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MathText } from "@/components/matma/math";
import { InkCanvas, type InkCanvasHandle } from "@/components/matma/problem/ink-canvas";
import { AiFeedbackCard } from "@/components/matma/problem/ai-feedback-card";
import { requestProblemHint, submitProblemAttempt } from "@/lib/matma/actions";
import { cn } from "@/lib/utils";
import type { MathProblem, MathProblemAttempt } from "@/lib/types/database";

const DIFFICULTY_CONFIG: Record<1 | 2 | 3, { label: string; className: string }> = {
  1: { label: "Poziom 1", className: "bg-accent-soft text-accent" },
  2: { label: "Poziom 2", className: "bg-warning-soft text-warning" },
  3: { label: "Poziom 3", className: "bg-danger-soft text-danger" },
};

const textareaClassName = cn(
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
  "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
  "disabled:opacity-60"
);

export function ProblemSolver({
  problem,
  isSpacedReview,
}: {
  problem: MathProblem;
  isSpacedReview?: boolean;
}) {
  const router = useRouter();
  const canvasRef = useRef<InkCanvasHandle>(null);

  const [answerText, setAnswerText] = useState("");
  const [methodDescription, setMethodDescription] = useState("");
  // null = not manually touched yet -> auto-derived from whether the answer/
  // method fields are currently empty; once the student toggles it by hand
  // we respect their explicit choice instead of continuing to auto-flip it.
  const [manualIncludeCanvas, setManualIncludeCanvas] = useState<boolean | null>(null);
  const fieldsEmpty = !answerText.trim() && !methodDescription.trim();
  const includeCanvas = manualIncludeCanvas ?? fieldsEmpty;

  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [isHintPending, startHintTransition] = useTransition();

  const [result, setResult] = useState<MathProblemAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitPending, startSubmitTransition] = useTransition();

  const busy = isSubmitPending || isHintPending;

  function handleHint() {
    setHintError(null);
    startHintTransition(async () => {
      const res = await requestProblemHint(problem.id);
      if (!res.ok) {
        setHintError(res.error);
        return;
      }
      setHint(res.data);
    });
  }

  function handleSubmit() {
    setError(null);
    if (!answerText.trim() && !methodDescription.trim() && !includeCanvas) {
      setError("Wpisz odpowiedź albo opisz swoją metodę przed wysłaniem.");
      return;
    }
    const canvasImageDataUrl = includeCanvas ? canvasRef.current?.getDataUrl() ?? null : null;

    startSubmitTransition(async () => {
      const res = await submitProblemAttempt(
        problem.id,
        {
          answerText: answerText.trim() || null,
          methodDescription: methodDescription.trim() || null,
          canvasImageDataUrl,
        },
        isSpacedReview ?? false
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResult(res.data);
    });
  }

  function handleNext() {
    setResult(null);
    setAnswerText("");
    setMethodDescription("");
    setManualIncludeCanvas(null);
    setHint(null);
    setHintError(null);
    setError(null);
    router.refresh();
  }

  const difficultyConfig = DIFFICULTY_CONFIG[problem.difficulty];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={difficultyConfig.className}>{difficultyConfig.label}</Badge>
          {problem.is_proof && <Badge className="bg-warning-soft text-warning">Dowód</Badge>}
          {isSpacedReview && <Badge className="bg-primary-soft text-primary">Powtórka</Badge>}
        </div>
        <MathText text={problem.content.statement} className="text-base text-foreground" />
      </Card>

      <InkCanvas ref={canvasRef} />

      {result ? (
        <>
          {result.ai_feedback && <AiFeedbackCard feedback={result.ai_feedback} />}
          <Button size="lg" className="w-full" onClick={handleNext}>
            Następne zadanie
          </Button>
        </>
      ) : (
        <Card className="flex flex-col gap-4">
          {problem.is_proof ? (
            <div>
              <Label htmlFor="matma-answer">Twój dowód / tok rozumowania</Label>
              <textarea
                id="matma-answer"
                rows={8}
                value={answerText}
                disabled={busy}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Zapisz tu pełny tok dowodu…"
                className={textareaClassName}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="matma-answer">Twoja odpowiedź (wynik)</Label>
              <Input
                id="matma-answer"
                value={answerText}
                disabled={busy}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="np. x = 3"
              />
            </div>
          )}

          <div>
            <Label htmlFor="matma-method">Opisz metodę / kluczowe kroki (opcjonalnie)</Label>
            <textarea
              id="matma-method"
              rows={4}
              value={methodDescription}
              disabled={busy}
              onChange={(e) => setMethodDescription(e.target.value)}
              placeholder="Krótko opisz, jak podszedłeś/-aś do zadania…"
              className={textareaClassName}
            />
          </div>

          <label className="flex items-start gap-2.5 text-sm text-foreground-muted">
            <input
              type="checkbox"
              checked={includeCanvas}
              disabled={busy}
              onChange={(e) => setManualIncludeCanvas(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded-(--radius-control) border-border accent-primary"
            />
            Załącz szkic z brudnopisu do oceny AI
          </label>

          {hint && (
            <div className="flex gap-2.5 rounded-(--radius-control) bg-primary-soft p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <MathText text={hint} className="text-sm text-foreground" />
            </div>
          )}
          {hintError && <p className="text-sm text-danger">{hintError}</p>}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={busy}
              isLoading={isHintPending}
              onClick={handleHint}
            >
              <Lightbulb className="h-4 w-4" /> Poproszę o wskazówkę
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={busy}
              isLoading={isSubmitPending}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" /> Wyślij do oceny
            </Button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </Card>
      )}
    </div>
  );
}
