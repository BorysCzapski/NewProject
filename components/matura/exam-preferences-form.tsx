"use client";

// ============================================================================
// components/matura/exam-preferences-form.tsx
// Wraps the język + poziom pickers in one Server-Action-backed form
// (useActionState), same shape as components/profile/level-change-form.tsx.
// Replaces the old level-only form: since 0016_matura_language.sql the module
// serves two languages, and asking for the poziom without asking which exam
// it belongs to would scope every query to a half-specified target.
// ============================================================================
import { useActionState } from "react";
import { setExamPreferences, type ActionState } from "@/lib/matura/actions";
import { Button } from "@/components/ui/button";
import { MaturaLanguagePicker } from "@/components/matura/language-picker";
import { MaturaLevelPicker } from "@/components/matura/level-picker";
import type { MaturaLanguage, MaturaLevel } from "@/lib/types/database";

const initialState: ActionState = {};

export function ExamPreferencesForm({
  currentLanguage,
  currentLevel,
  submitLabel = "Zapisz ustawienia",
}: {
  currentLanguage?: MaturaLanguage;
  currentLevel?: MaturaLevel;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(setExamPreferences, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Język</p>
        <MaturaLanguagePicker name="language" defaultValue={currentLanguage} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Poziom</p>
        <MaturaLevelPicker name="level" defaultValue={currentLevel} />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
