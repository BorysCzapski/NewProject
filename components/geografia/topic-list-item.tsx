// ============================================================================
// components/geografia/topic-list-item.tsx
// One row in the /geografia/tematy list: CKE number, title, mastery bar,
// exercise count — with the product-spec-required "below 25 exercises"
// notice (see supabase/migrations/0015_geografia.sql / AGENTS spec §5:
// "gdy liczba ćwiczeń < 25, system wyświetla komunikat i umożliwia wgranie
// brakujących").
// ============================================================================
import Link from "next/link";
import { ChevronRight, TriangleAlert } from "lucide-react";
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

export function TopicListItem({ topic }: { topic: TopicWithProgress }) {
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

        <div className="flex items-center gap-2">
          <Badge className={cn(STATUS_BADGE_CLASSES[topic.status])}>{STATUS_LABELS[topic.status]}</Badge>
          <span className="text-xs font-medium text-foreground-muted">{topic.masteryScore}% opanowania</span>
        </div>

        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>
            {topic.exerciseCount} / {TARGET_EXERCISE_COUNT}+ ćwiczeń
          </span>
          {belowTarget && (
            <span className="flex items-center gap-1 text-warning">
              <TriangleAlert className="h-3.5 w-3.5" />
              Za mało ćwiczeń — wgraj lub wygeneruj więcej
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
