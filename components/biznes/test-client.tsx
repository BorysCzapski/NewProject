"use client";

// ============================================================================
// components/biznes/test-client.tsx
// "Wszystkie zadania" – a full exam-style test over the whole question bank
// (or chosen lessons): no feedback until the end, optional time limit, scored
// review. Past results are listed from localStorage.
// ============================================================================
import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QUESTIONS } from "@/lib/biznes/questions";
import { shuffle, shuffleOptions } from "@/lib/biznes/quiz";
import { LESSONS } from "@/lib/biznes/lessons";
import { TESTS_KEY, useLocalState, type TestResult } from "@/lib/biznes/use-local-state";
import type { LessonId, Question } from "@/lib/biznes/types";
import { LessonPicker } from "./lesson-picker";
import { QuizRunner } from "./quiz-runner";

const LIMITS: Array<{ label: string; seconds: number | undefined }> = [
  { label: "Bez limitu", seconds: undefined },
  { label: "30 min", seconds: 30 * 60 },
  { label: "60 min", seconds: 60 * 60 },
  { label: "90 min", seconds: 90 * 60 },
];

export function TestClient() {
  const [lessons, setLessons] = useState<LessonId[]>(LESSONS.map((l) => l.id));
  const [limit, setLimit] = useState<number | undefined>(undefined);
  const [shuffled, setShuffled] = useState(true);
  const [withOpen, setWithOpen] = useState(true);
  const [session, setSession] = useState<{ id: number; questions: Question[]; limit?: number; title: string } | null>(null);
  const [results] = useLocalState<TestResult[]>(TESTS_KEY, []);

  const pool = QUESTIONS.filter((q) => lessons.includes(q.lesson) && (withOpen || q.type !== "open"));
  const counts: Partial<Record<LessonId, number>> = {};
  for (const q of QUESTIONS) if (withOpen || q.type !== "open") counts[q.lesson] = (counts[q.lesson] ?? 0) + 1;

  function start() {
    const base = shuffled ? shuffle(pool) : pool;
    const title = lessons.length === LESSONS.length ? "Test – wszystkie zadania" : `Test – ${lessons.length} dz.`;
    setSession({ id: Date.now(), questions: base.map(shuffleOptions), limit, title });
  }

  if (session) {
    return (
      <QuizRunner key={session.id} questions={session.questions} mode="exam" title={session.title} timeLimit={session.limit} onExit={() => setSession(null)} />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <LessonPicker value={lessons} onChange={setLessons} counts={counts} />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Limit czasu</p>
        <div className="grid grid-cols-4 gap-2">
          {LIMITS.map((l) => (
            <button
              key={l.label}
              type="button"
              aria-pressed={limit === l.seconds}
              onClick={() => setLimit(l.seconds)}
              className={cn(
                "rounded-(--radius-control) border py-2 text-xs font-medium",
                limit === l.seconds ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {(
          [
            ["Losowa kolejność pytań", shuffled, setShuffled],
            ["Dołącz zadania otwarte", withOpen, setWithOpen],
          ] as const
        ).map(([label, on, set]) => (
          <label key={label} className="flex items-center justify-between gap-3 rounded-(--radius-control) border border-border bg-surface px-3.5 py-3 text-sm text-foreground">
            {label}
            <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-5 w-5 accent-[var(--primary)]" />
          </label>
        ))}
      </div>

      <Card className="flex flex-col gap-3">
        <p className="text-sm text-foreground-muted">Zadań w teście: {pool.length}. Odpowiedzi poznasz dopiero po zakończeniu.</p>
        <Button size="lg" disabled={pool.length === 0} onClick={start}>
          Rozpocznij test
        </Button>
      </Card>

      {results.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-foreground-muted" /> Ostatnie wyniki
          </h2>
          {results.slice(0, 5).map((r) => (
            <div key={r.at} className="flex items-center justify-between rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm">
              <span className="min-w-0 truncate text-foreground">{r.label}</span>
              <span className="shrink-0 font-semibold text-primary">
                {r.total ? Math.round((r.correct / r.total) * 100) : 0}% <span className="font-normal text-foreground-muted">({r.correct}/{r.total})</span>
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
