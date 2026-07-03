// ============================================================================
// components/ui/badge.tsx
// Small pill used for CEFR level tags, category chips and status labels.
// ============================================================================
import { cn } from "@/lib/utils";
import type { UserLevel } from "@/lib/types/database";
import type { HTMLAttributes } from "react";

const LEVEL_CLASSES: Record<UserLevel, string> = {
  A1: "bg-level-a1/15 text-level-a1",
  A2: "bg-level-a2/15 text-level-a2",
  B1: "bg-level-b1/15 text-level-b1",
  B2: "bg-level-b2/15 text-level-b2",
};

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted",
        className
      )}
      {...props}
    />
  );
}

export function LevelBadge({ level, className }: { level: UserLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        LEVEL_CLASSES[level],
        className
      )}
    >
      {level}
    </span>
  );
}
