"use client";

// ============================================================================
// components/grammar/lesson/formula-block.tsx
// Interactive sentence-structure block: tabs (twierdzenie/przeczenie/pytanie)
// switch between formula variants; each variant is a row of colored chips,
// one per grammatical role. Tapping a chip reveals its note.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FormulaPart, FormulaRole, FormulaVariant } from "@/lib/grammar/lesson-blocks";

const ROLE_STYLES: Record<FormulaRole, string> = {
  subject: "bg-primary-soft text-primary",
  aux: "bg-warning-soft text-warning",
  verb: "bg-accent-soft text-accent",
  object: "bg-surface-muted text-foreground",
  negation: "bg-danger-soft text-danger",
  qword: "bg-level-b1/15 text-level-b1",
  other: "bg-surface-muted text-foreground-muted",
};

const ROLE_LABELS: Partial<Record<FormulaRole, string>> = {
  subject: "podmiot",
  aux: "operator",
  verb: "czasownik",
  negation: "przeczenie",
  qword: "pytajnik",
};

export function FormulaBlock({
  title,
  caption,
  variants,
}: {
  title?: string;
  caption?: string;
  variants: FormulaVariant[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openNote, setOpenNote] = useState<number | null>(null);
  const active = variants[activeIndex];

  // Legend shows only the roles actually used in the current variant.
  const usedRoles = [...new Set(active.parts.map((p) => p.role))].filter(
    (role): role is FormulaRole => role in ROLE_LABELS
  );

  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}

      {variants.length > 1 && (
        <div className="mt-3 flex rounded-(--radius-control) bg-surface-muted p-1">
          {variants.map((variant, i) => (
            <button
              key={variant.label}
              type="button"
              onClick={() => {
                setActiveIndex(i);
                setOpenNote(null);
              }}
              className={cn(
                "min-h-9 flex-1 rounded-[calc(var(--radius-control)-4px)] px-2 text-sm font-medium transition-colors",
                i === activeIndex
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-muted"
              )}
            >
              {variant.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {active.parts.map((part, i) => (
          <FormulaChip
            key={`${activeIndex}-${i}`}
            part={part}
            isOpen={openNote === i}
            onToggle={() => setOpenNote(openNote === i ? null : i)}
          />
        ))}
      </div>

      {openNote !== null && active.parts[openNote]?.note && (
        <p className="mt-2 rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
          {active.parts[openNote].note}
        </p>
      )}

      {active.example && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-base font-medium text-foreground">{active.example.en}</p>
          <p className="mt-0.5 text-sm text-foreground-muted">{active.example.pl}</p>
        </div>
      )}

      {usedRoles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {usedRoles.map((role) => (
            <span key={role} className="flex items-center gap-1 text-xs text-foreground-muted">
              <span className={cn("h-2.5 w-2.5 rounded-full", ROLE_STYLES[role].split(" ")[0])} />
              {ROLE_LABELS[role]}
            </span>
          ))}
        </div>
      )}

      {caption && <p className="mt-3 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}

function FormulaChip({
  part,
  isOpen,
  onToggle,
}: {
  part: FormulaPart;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const interactive = Boolean(part.note);
  return (
    <button
      type="button"
      onClick={interactive ? onToggle : undefined}
      disabled={!interactive}
      className={cn(
        "rounded-(--radius-control) px-2.5 py-1.5 text-sm font-semibold",
        ROLE_STYLES[part.role],
        interactive && "cursor-pointer transition-transform active:scale-95",
        isOpen && "ring-2 ring-primary"
      )}
    >
      {part.text}
    </button>
  );
}
