"use client";

// ============================================================================
// components/zusia/lesson-picker.tsx
// Multi-select chips for choosing which lessons (działy) a mode should use.
// ============================================================================
import { cn } from "@/lib/utils";
import { LESSONS } from "@/lib/zusia/theory";
import type { LessonId } from "@/lib/zusia/types";

export function LessonPicker({
  value,
  onChange,
  counts,
}: {
  value: LessonId[];
  onChange: (next: LessonId[]) => void;
  /** Optional item count per lesson, shown on each chip. */
  counts?: Partial<Record<LessonId, number>>;
}) {
  const all = value.length === LESSONS.length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Działy</p>
        <button
          type="button"
          onClick={() => onChange(all ? [] : LESSONS.map((l) => l.id))}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          {all ? "Wyczyść" : "Zaznacz wszystkie"}
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {LESSONS.map((l) => {
          const on = value.includes(l.id);
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onChange(on ? value.filter((x) => x !== l.id) : [...value, l.id])}
              aria-pressed={on}
              className={cn(
                "flex items-center justify-between gap-3 rounded-(--radius-control) border px-3.5 py-2.5 text-left transition-colors",
                on ? "border-primary bg-primary-soft" : "border-border bg-surface hover:bg-surface-muted"
              )}
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-primary">{l.short}</span>
                <span className="block truncate text-sm font-medium text-foreground">{l.title}</span>
              </span>
              {counts && <span className="shrink-0 text-xs text-foreground-muted">{counts[l.id] ?? 0}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
