import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({ streak, size = "md" }: { streak: number; size?: "sm" | "md" | "lg" }) {
  const isActive = streak > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold",
        isActive ? "bg-warning-soft text-warning" : "bg-surface-muted text-foreground-muted",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-lg"
      )}
    >
      <Flame className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4")} fill={isActive ? "currentColor" : "none"} />
      {streak}
    </span>
  );
}
