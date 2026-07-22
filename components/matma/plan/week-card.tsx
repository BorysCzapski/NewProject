// ============================================================================
// components/matma/plan/week-card.tsx
// One row in the study-plan week list: date range, status badge, and either
// the review-week callout (simulations + closing gaps, no new material) or
// the week's topic chips (title lookup only — non-clickable; the current
// week's clickable topic links are rendered separately by the plan page).
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MathStudyPlanWeek, MathStudyPlanWeekStatus } from "@/lib/types/database";

export const WEEK_STATUS_LABELS: Record<MathStudyPlanWeekStatus, string> = {
  upcoming: "Nadchodzący",
  in_progress: "W trakcie",
  completed: "Ukończony",
  partially_completed: "Częściowo ukończony",
  skipped: "Pominięty",
};

export const WEEK_STATUS_CLASSES: Record<MathStudyPlanWeekStatus, string> = {
  upcoming: "bg-surface-muted text-foreground-muted",
  in_progress: "bg-warning-soft text-warning",
  completed: "bg-accent-soft text-accent",
  partially_completed: "bg-warning-soft text-warning",
  skipped: "bg-danger-soft text-danger",
};

export function formatWeekDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

export function WeekCard({
  week,
  topicTitleById,
}: {
  week: MathStudyPlanWeek;
  topicTitleById: Record<string, string>;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardTitle>Tydzień {week.week_index + 1}</CardTitle>
        <Badge className={WEEK_STATUS_CLASSES[week.status]}>{WEEK_STATUS_LABELS[week.status]}</Badge>
      </div>
      <p className="mt-0.5 text-sm text-foreground-muted">
        {formatWeekDate(week.target_start_date)} – {formatWeekDate(week.target_end_date)}
      </p>

      {week.is_review_week ? (
        <div className="mt-3 rounded-(--radius-control) bg-accent-soft p-3 text-sm text-accent">
          Tydzień powtórkowy: symulacje egzaminu i domykanie luk zamiast nowego materiału.
        </div>
      ) : week.topic_ids.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {week.topic_ids.map((topicId) => (
            <span
              key={topicId}
              className={cn(
                "inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted"
              )}
            >
              {topicTitleById[topicId] ?? "Temat"}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
