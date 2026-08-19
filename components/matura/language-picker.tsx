"use client";

// ============================================================================
// components/matura/language-picker.tsx
// Angielski/hiszpański radio picker — the same tappable-card pattern as
// components/matura/level-picker.tsx, shown directly above it so the student
// answers "który egzamin?" as one question in two parts.
// ============================================================================
import { cn } from "@/lib/utils";
import { MATURA_LANGUAGES, MATURA_LANGUAGE_LABELS, MATURA_LANGUAGE_DESCRIPTIONS } from "@/lib/matura/constants";
import type { MaturaLanguage } from "@/lib/types/database";

export function MaturaLanguagePicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: MaturaLanguage;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-3">
      {MATURA_LANGUAGES.map((language) => (
        <label
          key={language}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-(--radius-card) border-2 border-border bg-surface p-4",
            "transition-colors has-checked:border-primary has-checked:bg-primary-soft"
          )}
        >
          <input
            type="radio"
            name={name}
            value={language}
            defaultChecked={defaultValue === language}
            className="mt-1 h-4 w-4 accent-primary"
            required
          />
          <span>
            <span className="block font-semibold text-foreground">{MATURA_LANGUAGE_LABELS[language]}</span>
            <span className="mt-0.5 block text-sm text-foreground-muted">
              {MATURA_LANGUAGE_DESCRIPTIONS[language]}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
