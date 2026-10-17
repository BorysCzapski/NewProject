// One problem in a list: status dot, label, points, kind/topic — links to the solver.
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InformatykaProgress } from "@/lib/types/database";
import type { ProblemSummary } from "@/lib/informatyka/content";
import { KIND_LABEL, examShortLabel, topicLabel } from "@/lib/informatyka/taxonomy";

export function ProblemRow({
  problem,
  progress,
  showExam,
  hideTaskTitle,
}: {
  problem: ProblemSummary;
  progress: InformatykaProgress | undefined;
  showExam?: boolean;
  /** Set where the task title is already shown as a group heading. */
  hideTaskTitle?: boolean;
}) {
  const done = progress?.status === "done";
  return (
    <Link
      href={`/informatyka/zadanie/${problem.id}`}
      className="flex items-center gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-3 shadow-(--shadow-card) transition-transform active:scale-[0.99]"
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
          done ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent"
        )}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {showExam ? `${examShortLabel(problem.exam)} · ` : ""}Zadanie {problem.label}
          {problem.task_title && !hideTaskTitle ? <span className="font-normal text-foreground-muted"> — {problem.task_title}</span> : null}
        </p>
        <p className="truncate text-xs text-foreground-muted">
          {KIND_LABEL[problem.kind]} · {topicLabel(problem.topic)}
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-foreground-muted">
        {done ? `${progress?.score ?? 0}/` : ""}
        {problem.points_max} pkt
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
    </Link>
  );
}
