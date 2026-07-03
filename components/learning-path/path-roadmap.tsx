// ============================================================================
// components/learning-path/path-roadmap.tsx
// Vertical roadmap of learning-path stages (Duolingo-style path): each stage
// is a node connected by a line, styled by status (locked/current/
// completed). Unlocked stages link to their detail page; locked ones are
// inert with a lock icon.
// ============================================================================
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningPathStageWithProgress } from "@/lib/learning-path/progress";

export function PathRoadmap({ stages }: { stages: LearningPathStageWithProgress[] }) {
  return (
    <ol className="flex flex-col">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const isLocked = stage.status === "locked";
        const isCompleted = stage.status === "completed";
        const isCurrent = stage.status === "current";

        const node = (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-bold",
                  isCompleted && "border-accent bg-accent text-accent-foreground",
                  isCurrent && "border-primary bg-primary-soft text-primary ring-4 ring-primary/20",
                  isLocked && "border-border bg-surface-muted text-foreground-muted"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : index + 1}
              </span>
              {!isLast && (
                <span className={cn("w-0.5 flex-1 min-h-8", isCompleted ? "bg-accent" : "bg-border")} />
              )}
            </div>

            <div className={cn("flex-1 pb-6", isLocked && "opacity-60")}>
              <p className={cn("font-semibold", isCurrent ? "text-primary" : "text-foreground")}>
                {stage.title}
              </p>
              {!isLocked && (
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {stage.masteredWords}/{stage.totalWords} słówek opanowanych
                  {stage.grammarTopicTitle && ` · ${stage.grammarTopicTitle}`}
                </p>
              )}
              {isLocked && (
                <p className="mt-0.5 text-sm text-foreground-muted">Ukończ poprzedni etap, aby odblokować</p>
              )}
            </div>
          </div>
        );

        return (
          <li key={stage.id}>
            {isLocked ? node : <Link href={`/nauka/sciezka/${stage.id}`}>{node}</Link>}
          </li>
        );
      })}
    </ol>
  );
}
