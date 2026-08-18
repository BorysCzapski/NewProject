"use client";

// ============================================================================
// components/geografia/exercise/open-solver.tsx
// Open-answer exercise: the student writes an answer, can ask the AI for a
// HINT (matched/missing rubric points — never a score) and/or reveal the
// model answer + rubric, then picks their OWN point score. This is the
// concrete implementation of the product spec's "nie zastępować nauczyciela
// w ocenie otwartych odpowiedzi – aplikacja podaje jedynie wskazówki" —
// points_awarded always comes from the student, never from the AI.
// ============================================================================
import { useState } from "react";
import { Check, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requestOpenHint, revealModelAnswer, submitOpenSelfAssessment } from "@/lib/geografia/actions";
import type { GeoExerciseAiFeedback } from "@/lib/types/database";

export function OpenSolver({
  exerciseId,
  pointsMax,
}: {
  exerciseId: string;
  pointsMax: number;
}) {
  const [startedAt] = useState(() => Date.now());
  const [answerText, setAnswerText] = useState("");
  const [hint, setHint] = useState<GeoExerciseAiFeedback | null>(null);
  const [isHinting, setIsHinting] = useState(false);
  const [reveal, setReveal] = useState<{ modelAnswer: string; rubric: string[] } | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [selfPoints, setSelfPoints] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pointOptions = Array.from({ length: pointsMax * 2 + 1 }, (_, i) => i / 2);

  async function askForHint() {
    if (!answerText.trim()) {
      setError("Wpisz odpowiedź przed poproszeniem o wskazówkę.");
      return;
    }
    setError(null);
    setIsHinting(true);
    const result = await requestOpenHint(exerciseId, answerText);
    setIsHinting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setHint(result.data);
  }

  async function reveal_() {
    setIsRevealing(true);
    const result = await revealModelAnswer(exerciseId);
    setIsRevealing(false);
    if (result.ok) setReveal(result.data);
  }

  async function submit() {
    if (!answerText.trim()) {
      setError("Wpisz odpowiedź przed wysłaniem.");
      return;
    }
    if (selfPoints === null) {
      setError("Wybierz liczbę punktów, którą sobie przyznajesz.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const result = await submitOpenSelfAssessment(exerciseId, answerText, selfPoints, hint, durationSeconds);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="flex items-center gap-3 bg-accent-soft">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <CardTitle>Zapisano Twoją samoocenę</CardTitle>
          <p className="text-sm text-foreground-muted">
            Przyznane punkty: {selfPoints} / {pointsMax}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        rows={5}
        placeholder="Wpisz swoją odpowiedź..."
        className="w-full rounded-(--radius-control) border border-border bg-surface p-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" isLoading={isHinting} onClick={askForHint}>
          <Lightbulb className="h-4 w-4" />
          Poproś o wskazówkę AI
        </Button>
        <Button variant="outline" size="sm" isLoading={isRevealing} onClick={reveal_}>
          <Eye className="h-4 w-4" />
          Pokaż odpowiedź wzorcową
        </Button>
      </div>

      {hint && (
        <Card className="flex flex-col gap-2 bg-primary-soft">
          <p className="text-sm text-primary">{hint.hint}</p>
          {hint.matchedRubricPoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground-muted">Poruszone punkty:</p>
              <ul className="list-inside list-disc text-sm text-foreground">
                {hint.matchedRubricPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {hint.missingRubricPoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground-muted">Warto jeszcze dopisać:</p>
              <ul className="list-inside list-disc text-sm text-foreground">
                {hint.missingRubricPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {reveal && (
        <Card className="flex flex-col gap-2">
          <CardTitle>Odpowiedź wzorcowa</CardTitle>
          <p className="text-sm text-foreground">{reveal.modelAnswer}</p>
          <p className="text-xs font-semibold text-foreground-muted">Punkty oceny:</p>
          <ul className="list-inside list-disc text-sm text-foreground">
            {reveal.rubric.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Ile punktów sobie przyznajesz?</p>
        <div className="flex flex-wrap gap-2">
          {pointOptions.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelfPoints(p)}
              className={cn(
                "h-9 min-w-9 rounded-full border px-3 text-sm font-medium",
                selfPoints === p ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button isLoading={isSubmitting} onClick={submit}>
        Zapisz samoocenę
      </Button>
    </div>
  );
}
