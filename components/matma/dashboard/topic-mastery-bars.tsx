// ============================================================================
// components/matma/dashboard/topic-mastery-bars.tsx
// Dashboard department overview: one row per topic (already in order_index
// order from getTopicsWithProgress) showing mastery as a horizontal bar plus
// percent and a status badge. Plain display component, no interactivity.
// Status label/color mapping mirrors app/(main)/matma/nauka/page.tsx.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TopicWithProgress } from "@/lib/matma/progress";
import type { MasteryStatus } from "@/lib/types/database";

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

const STATUS_BAR_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-border",
  learning: "bg-warning",
  mastered: "bg-accent",
};

export function TopicMasteryBars({ topics }: { topics: TopicWithProgress[] }) {
  if (topics.length === 0) return null;

  return (
    <Card className="flex flex-col gap-4">
      <CardTitle>Postępy w działach</CardTitle>
      <div className="flex flex-col gap-3">
        {topics.map((topic) => (
          <div key={topic.id}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {topic.title}
              </span>
              <Badge className={STATUS_BADGE_CLASSES[topic.status]}>{STATUS_LABELS[topic.status]}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={cn("h-full rounded-full transition-all", STATUS_BAR_CLASSES[topic.status])}
                  style={{ width: `${Math.min(100, Math.max(0, topic.masteryScore))}%` }}
                />
              </div>
              <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
                {topic.masteryScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
