"use client";

// ============================================================================
// components/auth/level-picker.tsx
// Reusable A1-B2 level selector used on /onboarding (first login) and on the
// profile page (changing level later). Renders as an accessible radio group
// of large tappable cards — no native <select>, this is the primary control
// of its screen so it should feel substantial on a phone.
// ============================================================================
import { cn } from "@/lib/utils";
import { LEVELS, LEVEL_LABELS, LEVEL_DESCRIPTIONS } from "@/lib/constants";
import type { UserLevel } from "@/lib/types/database";

export function LevelPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: UserLevel;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LEVELS.map((level) => (
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
            <span className="block font-semibold text-foreground">{LEVEL_LABELS[level]}</span>
            <span className="mt-0.5 block text-sm text-foreground-muted">
              {LEVEL_DESCRIPTIONS[level]}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
