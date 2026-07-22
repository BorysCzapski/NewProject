"use client";

// ============================================================================
// components/matma/lesson/self-assessment.tsx
// Fixed UI shown at the end of every lesson (not a MathBlock type). "Tak,
// rozumiem" records lesson activity and confirms. "Muszę powtórzyć" runs a
// short control quiz built from the lesson's own last quiz-type block(s)
// (passed in by the page) — passing it counts the same as "Tak"; missing a
// question just points the student back at the lesson content, no penalty,
// no forced navigation.
// ============================================================================
import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, ChevronRight, CheckCircle2, RotateCcw, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MathText } from "@/components/matma/math";
import { recordLessonActivity } from "@/lib/matma/actions";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/matma/lesson-blocks";

type Mode = "prompt" | "quiz" | "done" | "encourage";

export function SelfAssessment({
  topicSlug,
  recapQuestions,
}: {
  topicSlug: string;
  recapQuestions: QuizQuestion[];
}) {
  const [mode, setMode] = useState<Mode>("prompt");
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function markUnderstood() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await recordLessonActivity();
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setMode("done");
      } catch {
        setError("Nie udało się zapisać postępu. Spróbuj ponownie.");
      }
    });
  }

  function startRepeat() {
    if (recapQuestions.length === 0) {
      setMode("encourage");
      return;
    }
    setQuizIndex(0);
    setPicked(null);
    setMode("quiz");
  }

  function nextQuizQuestion() {
    if (quizIndex + 1 >= recapQuestions.length) {
      markUnderstood();
    } else {
      setQuizIndex((n) => n + 1);
      setPicked(null);
    }
  }

  if (mode === "done") {
    return (
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <CardTitle>Świetnie, ten temat masz opanowany!</CardTitle>
        <Link
          href={`/matma/nauka/${topicSlug}`}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do działu
        </Link>
      </Card>
    );
  }

  if (mode === "encourage") {
    return (
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-soft text-warning">
          <BookOpen className="h-7 w-7" />
        </span>
        <CardTitle>Jeszcze nie tym razem — i to zupełnie normalne</CardTitle>
        <p className="text-sm text-foreground-muted">
          Zerknij jeszcze raz na materiał powyżej, szczególnie na przykłady i wzory, a potem spróbuj
          ponownie albo przejdź do ćwiczeń, żeby utrwalić temat w praktyce.
        </p>
        <Link
          href={`/matma/nauka/${topicSlug}`}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do działu
        </Link>
      </Card>
    );
  }

  if (mode === "quiz") {
    const q = recapQuestions[quizIndex];
    const answered = picked !== null;
    const correct = answered && picked === q.correctIndex;
    return (
      <Card>
        <CardTitle>
          Krótkie sprawdzenie ({quizIndex + 1}/{recapQuestions.length})
        </CardTitle>
        <MathText text={q.question} className="mt-2 text-sm font-medium text-foreground" />
        <div className="mt-3 flex flex-col gap-2">
          {q.options.map((option, i) => {
            const isCorrect = i === q.correctIndex;
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
                <MathText text={option} className="text-sm" />
                {answered && isCorrect && <Check className="h-4 w-4 shrink-0" />}
                {answered && isPicked && !isCorrect && <X className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        {answered && correct && (
          <Button size="sm" className="mt-3" isLoading={isPending} onClick={nextQuizQuestion}>
            {quizIndex + 1 >= recapQuestions.length ? "Zakończ" : "Następne pytanie"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {answered && !correct && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-sm text-danger">Niezupełnie — to dobry sygnał, żeby wrócić do materiału.</p>
            <Button variant="outline" size="sm" className="self-start" onClick={() => setMode("encourage")}>
              Zobacz materiał jeszcze raz
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Czy rozumiesz ten temat?</CardTitle>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" isLoading={isPending} onClick={markUnderstood}>
          <CheckCircle2 className="h-4 w-4" />
          Tak, rozumiem
        </Button>
        <Button variant="outline" className="flex-1" onClick={startRepeat}>
          <RotateCcw className="h-4 w-4" />
          Muszę powtórzyć
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </Card>
  );
}
