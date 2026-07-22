// ============================================================================
// components/matma/exam/exam-results.tsx
// Plain results display for a completed (or abandoned) mock exam: total
// score + percent headline, and a per-topic breakdown bar from
// exam.breakdown. No interactivity — safe to render straight from the
// Server Component exam detail page.
// ============================================================================
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MathMockExam } from "@/lib/types/database";

function scoreClass(ratio: number): string {
  return ratio >= MIN_MASTERY_THRESHOLD ? "text-accent" : ratio >= 0.5 ? "text-warning" : "text-danger";
}

function barClass(ratio: number): string {
  return ratio >= MIN_MASTERY_THRESHOLD ? "bg-accent" : ratio >= 0.5 ? "bg-warning" : "bg-danger";
}

export function ExamResults({ exam }: { exam: MathMockExam }) {
  const totalPoints = exam.total_points ?? 0;
  const ratio = exam.max_points > 0 ? totalPoints / exam.max_points : 0;
  const percent = Math.round(ratio * 100);
  const breakdown = exam.breakdown ?? [];

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
      <Link
        href="/matma/egzamin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Wszystkie egzaminy
      </Link>

      <Card className="flex flex-col items-center gap-1 py-6 text-center">
        {exam.status === "abandoned" ? (
          <p className="mb-1 text-sm font-medium text-foreground-muted">Egzamin przerwany</p>
        ) : (
          <Award className={cn("mb-1 h-8 w-8", scoreClass(ratio))} />
        )}
        <p className={cn("text-4xl font-bold", scoreClass(ratio))}>
          {totalPoints} / {exam.max_points} pkt
        </p>
        <p className="text-sm text-foreground-muted">{percent}% — poziom rozszerzony</p>
      </Card>

      {breakdown.length > 0 && (
        <Card className="flex flex-col gap-3">
          <CardTitle>Wynik według działów</CardTitle>
          <div className="flex flex-col gap-3">
            {breakdown.map((entry) => {
              const entryRatio = entry.points_max > 0 ? entry.points_awarded / entry.points_max : 0;
              const pct = Math.min(100, Math.round(entryRatio * 100));
              return (
                <div key={entry.topic_id}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="text-foreground">{entry.topic_title}</span>
                    <span className="shrink-0 text-foreground-muted">
                      {entry.points_awarded}/{entry.points_max}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={cn("h-full rounded-full transition-all", barClass(entryRatio))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
