// ============================================================================
// components/geografia/topic-list-item.tsx
// One row in the /geografia/tematy list: CKE number, title, mastery bar,
// theory progress and exercise count — with the product-spec-required "below
// 25 exercises" notice (spec §5: "gdy liczba ćwiczeń < 25, system wyświetla
// komunikat i umożliwia wgranie brakujących").
//
// Theory progress is shown SEPARATELY from the mastery bar on purpose:
// reading lessons is self-declared and never feeds mastery (see
// lib/geografia/progress.ts / markLessonComplete), so merging them into one
// number would let a student "raise" a score by scrolling.
// ============================================================================
import Link from "next/link";
import { BookOpen, ChevronRight, TriangleAlert } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TopicWithProgress } from "@/lib/geografia/progress";
import type { MasteryStatus } from "@/lib/types/database";

const TARGET_EXERCISE_COUNT = 25;

const STATUS_LABELS: Record<MasteryStatus, string> = {
  new: "Nowy",
  learning: "W trakcie",
  mastered: "Opanowany",
};
const STATUS_BADGE_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-surface-muted text-foreground-muted",
  learning: "bg-warning-soft text-warning",
  mastered: "bg-accent-soft text-accent",
};

export function TopicListItem({
  topic,
  lessonCount = 0,
  lessonsDone = 0,
}: {
  topic: TopicWithProgress;
  lessonCount?: number;
  lessonsDone?: number;
}) {
  const belowTarget = topic.exerciseCount < TARGET_EXERCISE_COUNT;

  return (
    <Link href={`/geografia/tematy/${topic.slug}`} className="block">
      <Card className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground-muted">Dział {topic.cke_number}</p>
            <CardTitle>{topic.title}</CardTitle>
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-foreground-muted" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn(STATUS_BADGE_CLASSES[topic.status])}>{STATUS_LABELS[topic.status]}</Badge>
          <span className="text-xs font-medium text-foreground-muted">{topic.masteryScore}% opanowania</span>
          {lessonCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonsDone}/{lessonCount} lekcji teorii
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-foreground-muted">
          <span>
            {topic.exerciseCount} / {TARGET_EXERCISE_COUNT}+ ćwiczeń
          </span>
          {belowTarget && (
            <span className="flex items-center gap-1 text-right text-warning">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
              Za mało ćwiczeń
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
