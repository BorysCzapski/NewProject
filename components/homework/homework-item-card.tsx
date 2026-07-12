// ============================================================================
// components/homework/homework-item-card.tsx
// One homework entry in the user-facing /prace-domowe list: title, type
// badge, progress bar, and deadline (styled distinctly when overdue).
// ============================================================================
import { CalendarClock } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeworkProgressBar } from "@/components/homework/homework-progress-bar";
import { formatDeadline } from "@/components/homework/format-deadline";
import { homeworkRequirementText } from "@/lib/homework/labels";
import { HOMEWORK_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { HomeworkWithProgress } from "@/lib/homework/progress";

export function HomeworkItemCard({ homework }: { homework: HomeworkWithProgress }) {
  const isOverdue = homework.status === "overdue";

  return (
    <Card className={cn("flex flex-col gap-2", isOverdue && "border-danger/60 bg-danger-soft/30")}>
      <div className="flex items-start justify-between gap-3">
        <CardTitle>{homework.title}</CardTitle>
        <Badge className="shrink-0">{HOMEWORK_TYPE_LABELS[homework.type]}</Badge>
      </div>
      {/* Concrete Polish sentence of exactly what to do, so tasks are przejrzyste. */}
      <p className="text-xs text-foreground-muted">{homeworkRequirementText(homework)}</p>
      {homework.description && <CardDescription>{homework.description}</CardDescription>}

      <HomeworkProgressBar current={homework.progress_current} target={homework.progress_target} className="mt-1" />

      {homework.deadline && (
        <p className={cn("flex items-center gap-1.5 text-xs", isOverdue ? "font-medium text-danger" : "text-foreground-muted")}>
          <CalendarClock className="h-3.5 w-3.5" />
          Termin: {formatDeadline(homework.deadline)}
        </p>
      )}
    </Card>
  );
}
