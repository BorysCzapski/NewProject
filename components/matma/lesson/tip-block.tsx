// ============================================================================
// components/matma/lesson/tip-block.tsx
// A small highlighted callout — a helpful tip or a "watch out" warning.
// ============================================================================
import { Lightbulb, TriangleAlert } from "lucide-react";
import { MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";

export function TipBlock({ variant, text }: { variant: "tip" | "warning"; text: string }) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-(--radius-control) px-3.5 py-3",
        variant === "warning" ? "bg-warning-soft" : "bg-primary-soft"
      )}
    >
      {variant === "warning" ? (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      ) : (
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      )}
      <MathText
        text={text}
        className={cn("text-sm", variant === "warning" ? "text-warning" : "text-primary")}
      />
    </div>
  );
}
