"use client";

// ============================================================================
// components/matura/level-picker.tsx
// Podstawowa/rozszerzona radio picker — same tappable-card pattern as
// components/auth/level-picker.tsx, used both for the first-run choice and
// for changing the level later on /matura/ustawienia.
// ============================================================================
import { cn } from "@/lib/utils";
import { MATURA_LEVELS, MATURA_LEVEL_LABELS, MATURA_LEVEL_DESCRIPTIONS } from "@/lib/matura/constants";
import type { MaturaLevel } from "@/lib/types/database";

export function MaturaLevelPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: MaturaLevel;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-3">
      {MATURA_LEVELS.map((level) => (
        <label
          key={level}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-(--radius-card) border-2 border-border bg-surface p-4",
            "transition-colors has-checked:border-primary has-checked:bg-primary-soft"
          )}
        >
          <input
            type="radio"
            name={name}
            value={level}
            defaultChecked={defaultValue === level}
            className="mt-1 h-4 w-4 accent-primary"
            required
          />
          <span>
            <span className="block font-semibold text-foreground">{MATURA_LEVEL_LABELS[level]}</span>
            <span className="mt-0.5 block text-sm text-foreground-muted">
              {MATURA_LEVEL_DESCRIPTIONS[level]}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
