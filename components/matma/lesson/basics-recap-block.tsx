"use client";

// ============================================================================
// components/matma/lesson/basics-recap-block.tsx
// A skippable refresher: by default just shows title+text+formula inline
// (no gating — most students will simply read it as the first thing in the
// lesson). A "Znam to, przejdź dalej" button lets a confident student prove
// it instead: it opens the block's controlQuiz one question at a time, and
// only collapses the recap once EVERY question is answered correctly. Missing
// one stops the skip attempt and points the student back at the text above —
// no punishment, just a nudge to actually read it.
// ============================================================================
import { useState } from "react";
import { Check, X, ChevronRight, RotateCcw, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MathBlock as KatexBlock, MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/matma/lesson-blocks";

export function BasicsRecapBlock({
  title,
  text,
  formula,
  controlQuiz,
}: {
  title: string;
  text: string;
  formula?: string;
  controlQuiz: QuizQuestion[];
}) {
  const [skipRequested, setSkipRequested] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [passed, setPassed] = useState(false);

  function reset() {
    setSkipRequested(false);
    setQuizIndex(0);
    setPicked(null);
    setFailed(false);
  }

  function pick(i: number) {
    setPicked(i);
    if (i !== controlQuiz[quizIndex].correctIndex) setFailed(true);
  }

  function advance() {
    if (quizIndex + 1 >= controlQuiz.length) {
      setPassed(true);
    } else {
      setQuizIndex((n) => n + 1);
      setPicked(null);
    }
  }

  if (passed) {
    return (
      <div className="flex items-center gap-2 rounded-(--radius-control) bg-accent-soft px-3.5 py-2.5 text-sm font-medium text-accent">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Podstawy „{title}” odhaczone — jedziemy dalej.
      </div>
    );
  }

  return (
    <Card>
      <CardTitle className="flex items-center gap-2">
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-foreground-muted">
          Powtórka
        </span>
        {title}
      </CardTitle>
      <MathText text={text} className="mt-2 text-sm text-foreground" />
      {formula && <KatexBlock className="text-lg">{formula}</KatexBlock>}

      {!skipRequested && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setSkipRequested(true)}
        >
          <GraduationCap className="h-4 w-4" />
          Znam to, przejdź dalej
        </Button>
      )}

      {skipRequested && !failed && controlQuiz[quizIndex] && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            Pytanie kontrolne {quizIndex + 1} z {controlQuiz.length}
          </p>
          <MathText
            text={controlQuiz[quizIndex].question}
            className="text-sm font-medium text-foreground"
          />
          <div className="mt-2 flex flex-col gap-2">
            {controlQuiz[quizIndex].options.map((option, i) => {
              const isCorrect = i === controlQuiz[quizIndex].correctIndex;
              const isPicked = i === picked;
              const answered = picked !== null;
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
          {picked !== null && picked === controlQuiz[quizIndex].correctIndex && (
            <Button size="sm" className="mt-3" onClick={advance}>
              {quizIndex + 1 >= controlQuiz.length ? "Zakończ" : "Następne pytanie"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {failed && (
        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-sm text-danger">
            Jeszcze nie do końca — zerknij jeszcze raz na treść powtórki powyżej, zanim spróbujesz
            ponownie.
          </p>
          <Button variant="outline" size="sm" className="self-start" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Wróć do treści
          </Button>
        </div>
      )}
    </Card>
  );
}
