"use client";

// ============================================================================
// components/trading/lesson-done.tsx
// Przycisk „oznacz jako przerobioną" (localStorage) + licznik postępu na
// stronie głównej aplikacji.
// ============================================================================
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/lib/trading/use-local-state";

const EMPTY: string[] = [];

export function useDoneLessons() {
  return useLocalState<string[]>("trading:lessons", EMPTY);
}

export function LessonDoneButton({ slug }: { slug: string }) {
  const [done, setDone] = useDoneLessons();
  const isDone = done.includes(slug);
  return (
    <Button
      variant={isDone ? "outline" : "primary"}
      onClick={() => setDone(isDone ? done.filter((s) => s !== slug) : [...done, slug])}
    >
      {isDone ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
      {isDone ? "Przerobiona" : "Oznacz jako przerobioną"}
    </Button>
  );
}

export function LessonCheck({ slug }: { slug: string }) {
  const [done] = useDoneLessons();
  return done.includes(slug) ? (
    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-label="Przerobiona" />
  ) : (
    <Circle className="h-5 w-5 shrink-0 text-border" aria-hidden />
  );
}

export function ProgressSummary({ total }: { total: number }) {
  const [done] = useDoneLessons();
  const [scenarios] = useLocalState<Record<string, boolean>>("trading:scenarios", {});
  const [quiz] = useLocalState<{ best: number; runs: number }>("trading:quiz", { best: 0, runs: 0 });
  const doneCount = done.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-3">
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-foreground">
            {doneCount}/{total}
          </p>
          <p className="text-xs text-foreground-muted">lekcji</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{Object.keys(scenarios).length}</p>
          <p className="text-xs text-foreground-muted">scenariuszy</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{quiz.runs ? `${quiz.best}%` : "—"}</p>
          <p className="text-xs text-foreground-muted">rekord quizu</p>
        </div>
      </div>
    </div>
  );
}
