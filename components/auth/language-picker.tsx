"use client";

// ============================================================================
// components/auth/language-picker.tsx
// Reusable target-language selector used on /onboarding (first login) and on
// the profile page (changing language later). Renders as an accessible radio
// group of large tappable cards — this is the primary control of its screen,
// so it should feel substantial on a phone.
// ============================================================================
import { cn } from "@/lib/utils";
import { LANGUAGES, LANGUAGE_LABELS, LANGUAGE_FLAGS } from "@/lib/constants";
import type { TargetLanguage } from "@/lib/types/database";

export function LanguagePicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: TargetLanguage;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LANGUAGES.map((language) => (
        <label
          key={language}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-(--radius-card) border-2 border-border bg-surface p-4",
            "transition-colors has-checked:border-primary has-checked:bg-primary-soft"
          )}
        >
          <input
            type="radio"
            name={name}
            value={language}
            defaultChecked={defaultValue === language}
            className="h-4 w-4 accent-primary"
            required
          />
          <span className="flex items-center gap-2">
            <span className="text-2xl">{LANGUAGE_FLAGS[language]}</span>
            <span className="font-semibold text-foreground">{LANGUAGE_LABELS[language]}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
