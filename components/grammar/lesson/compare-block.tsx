// ============================================================================
// components/grammar/lesson/compare-block.tsx
// Side-by-side comparison of 2-3 structures (e.g. Present Simple vs Present
// Continuous): each column gets its own accent color, formula, "kiedy
// używać" description and examples. Static — no client interactivity needed.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompareColumn } from "@/lib/grammar/lesson-blocks";

const COLUMN_ACCENTS = [
  { border: "border-t-primary", text: "text-primary", bg: "bg-primary-soft" },
  { border: "border-t-accent", text: "text-accent", bg: "bg-accent-soft" },
  { border: "border-t-warning", text: "text-warning", bg: "bg-warning-soft" },
];

export function CompareBlock({ title, columns }: { title?: string; columns: CompareColumn[] }) {
  return (
    <div>
      {title && <CardTitle className="mb-3">{title}</CardTitle>}
      <div className={cn("grid gap-3", columns.length > 1 && "sm:grid-cols-2")}>
        {columns.map((column, i) => {
          const accent = COLUMN_ACCENTS[i % COLUMN_ACCENTS.length];
          return (
            <Card key={i} className={cn("border-t-4", accent.border)}>
              <h4 className={cn("text-base font-bold", accent.text)}>{column.title}</h4>
              {column.formula && (
                <p
                  className={cn(
                    "mt-2 inline-block rounded-(--radius-control) px-2.5 py-1 text-sm font-semibold",
                    accent.bg,
                    accent.text
                  )}
                >
                  {column.formula}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-foreground">{column.whenToUse}</p>
              <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                {column.examples.map((example, j) => (
                  <li key={j} className="text-sm italic leading-relaxed text-foreground-muted">
                    {example}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
