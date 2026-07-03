"use client";

// ============================================================================
// components/reading/reading-session.tsx
// Renders one reading text: the article, then either the answer form (fresh
// attempt) or a read-only results view (if the user already has an attempt
// for this text). Submitting grades multiple-choice locally and open
// questions via AI, then shows per-question feedback + the overall score.
// ============================================================================
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { submitReadingAttempt, type ReadingAttemptResult, type ReadingQuestionResult } from "@/lib/reading/actions";
import type { ReadingQuestion, ReadingText } from "@/lib/types/database";

interface InitialAttempt extends ReadingAttemptResult {
  answers: Record<string, string>;
}

export function ReadingSession({
  text,
  questions,
  initialAttempt,
}: {
  text: ReadingText;
  questions: ReadingQuestion[];
  initialAttempt: InitialAttempt | null;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAttempt?.answers ?? {});
  const [result, setResult] = useState<ReadingAttemptResult | null>(initialAttempt);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitReadingAttempt(text.id, answers);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się ocenić odpowiedzi. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Card className="mb-5">
        <CardTitle>{text.title}</CardTitle>
        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground">{text.content}</p>
      </Card>

      <h2 className="mb-3 text-lg font-semibold text-foreground">Pytania</h2>
      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i}
            question={q}
            value={answers[q.id] ?? ""}
            onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
            result={result?.results[q.id]}
            locked={!!result}
          />
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {!result && (
        <Button
          size="lg"
          className="mt-5 w-full"
          onClick={handleSubmit}
          disabled={!allAnswered}
          isLoading={submitting}
        >
          {submitting ? "Sprawdzanie…" : "Sprawdź odpowiedzi"}
        </Button>
      )}

      {result && (
        <Card className="mt-5 text-center">
          <CardTitle>Wynik: {result.score}%</CardTitle>
          <CardDescription className="mt-1">
            {result.score >= 80
              ? "Świetna robota!"
              : result.score >= 50
                ? "Nieźle, poćwicz jeszcze."
                : "Spróbuj przeczytać tekst jeszcze raz."}
          </CardDescription>
        </Card>
      )}
    </div>
  );
}

function QuestionCard({
  index,
  question,
  value,
  onChange,
  result,
  locked,
}: {
  index: number;
  question: ReadingQuestion;
  value: string;
  onChange: (val: string) => void;
  result?: ReadingQuestionResult;
  locked: boolean;
}) {
  return (
    <Card>
      <CardDescription>Pytanie {index + 1}</CardDescription>
      <p className="mt-1 text-base font-medium text-foreground">{question.question}</p>

      {question.type === "multiple_choice" ? (
        <div className="mt-3 flex flex-col gap-2">
          {(question.options ?? []).map((option) => {
            const isSelected = value === option;
            const isRightAnswer = option === question.correct_answer;
            return (
              <button
                key={option}
                type="button"
                onClick={() => !locked && onChange(option)}
                disabled={locked}
                className={cn(
                  "rounded-(--radius-control) border px-4 py-3 text-left text-base transition-colors",
                  !locked && isSelected && "border-primary bg-primary-soft text-primary",
                  !locked && !isSelected && "border-border bg-surface active:bg-surface-muted",
                  locked && isRightAnswer && "border-primary bg-primary-soft text-primary",
                  locked && isSelected && !isRightAnswer && "border-danger bg-danger-soft text-danger",
                  locked && !isSelected && !isRightAnswer && "border-border bg-surface opacity-60"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          rows={3}
          placeholder="Wpisz odpowiedź po angielsku…"
          className={cn(
            "mt-3 w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
            "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
            "disabled:opacity-70"
          )}
        />
      )}

      {result && (
        <div
          className={cn(
            "mt-3 flex items-start gap-2 rounded-(--radius-control) p-3 text-sm",
            result.isCorrect ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger"
          )}
        >
          {result.isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>
            {question.type === "multiple_choice"
              ? result.isCorrect
                ? "Poprawnie!"
                : `Niepoprawnie. Poprawna odpowiedź: "${question.correct_answer}"`
              : result.isCorrect
                ? "Poprawna odpowiedź."
                : "Niepoprawna odpowiedź."}
            {result.feedback && <span className="mt-1 block text-foreground-muted">{result.feedback}</span>}
          </span>
        </div>
      )}
    </Card>
  );
}
