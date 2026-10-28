"use client";

// ============================================================================
// components/zusia/training-client.tsx
// Trening: pick lessons, question types and a pool (losowe / moje błędy /
// jeszcze nierozwiązane), then practise with instant feedback.
// ============================================================================
import { useMemo, useState } from "react";
import { Shuffle, Target, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QUESTIONS } from "@/lib/zusia/questions";
import { shuffle, shuffleOptions, TYPE_LABELS } from "@/lib/zusia/quiz";
import { LESSONS } from "@/lib/zusia/theory";
import { STATS_KEY, useLocalState, type QuestionStats } from "@/lib/zusia/use-local-state";
import type { LessonId, Question, QuestionType } from "@/lib/zusia/types";
import { LessonPicker } from "./lesson-picker";
import { QuizRunner } from "./quiz-runner";

type Pool = "all" | "wrong" | "new";
const COUNTS = [10, 20, 40] as const;

export function TrainingClient() {
  const [lessons, setLessons] = useState<LessonId[]>(LESSONS.map((l) => l.id));
  const [types, setTypes] = useState<QuestionType[]>(["single", "multi", "tf"]);
  const [pool, setPool] = useState<Pool>("all");
  const [count, setCount] = useState<number>(10);
  const [stats, , ready] = useLocalState<QuestionStats>(STATS_KEY, {});
  const [session, setSession] = useState<{ id: number; questions: Question[]; title: string } | null>(null);

  const available = useMemo(
    () =>
      QUESTIONS.filter((q) => lessons.includes(q.lesson) && types.includes(q.type)).filter((q) => {
        const s = stats[q.id];
        if (pool === "wrong") return !!s && s.wrong > s.ok;
        if (pool === "new") return !s;
        return true;
      }),
    [lessons, types, pool, stats]
  );

  const countsByLesson = useMemo(() => {
    const c: Partial<Record<LessonId, number>> = {};
    for (const q of QUESTIONS) if (types.includes(q.type)) c[q.lesson] = (c[q.lesson] ?? 0) + 1;
    return c;
  }, [types]);

  const wrongTotal = Object.values(stats).filter((s) => s.wrong > s.ok).length;

  function start(questions: Question[], title: string) {
    setSession({ id: Date.now(), questions: questions.map(shuffleOptions), title });
  }

  if (session) {
    return (
      <QuizRunner
        key={session.id}
        questions={session.questions}
        mode="practice"
        title={session.title}
        onExit={() => setSession(null)}
        onRetry={(wrong) => start(shuffle(wrong), "Powtórka błędnych")}
      />
    );
  }

  const toggleType = (t: QuestionType) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const take = Math.min(count, available.length);

  return (
    <div className="flex flex-col gap-5">
      <LessonPicker value={lessons} onChange={setLessons} counts={countsByLesson} />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Rodzaj zadań</p>
        <div className="flex flex-wrap gap-2">
          {(["single", "multi", "tf", "open"] as QuestionType[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={types.includes(t)}
              onClick={() => toggleType(t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                types.includes(t) ? "border-primary bg-primary-soft font-medium text-primary" : "border-border text-foreground-muted"
              )}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Pula pytań</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["all", "Wszystkie", Shuffle],
              ["new", "Nowe", Sparkle],
              ["wrong", `Moje błędy${ready ? ` (${wrongTotal})` : ""}`, Target],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={pool === id}
              onClick={() => setPool(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-(--radius-control) border px-2 py-2.5 text-xs font-medium transition-colors",
                pool === id ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Liczba pytań w serii</p>
        <div className="flex gap-2">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={count === c}
              onClick={() => setCount(c)}
              className={cn(
                "flex-1 rounded-(--radius-control) border py-2 text-sm font-medium",
                count === c ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Card className="flex flex-col gap-3">
        <p className="text-sm text-foreground-muted">
          {available.length === 0
            ? pool === "wrong"
              ? "Nie masz jeszcze błędnych odpowiedzi do powtórki – najpierw rozwiąż kilka zadań."
              : "Brak zadań dla tego wyboru."
            : `Dostępnych zadań: ${available.length}. W serii: ${take}.`}
        </p>
        <Button size="lg" disabled={available.length === 0 || lessons.length === 0} onClick={() => start(shuffle(available).slice(0, take), "Trening")}>
          Rozpocznij trening
        </Button>
      </Card>
    </div>
  );
}
