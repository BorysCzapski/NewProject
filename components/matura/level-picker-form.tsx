"use client";

// ============================================================================
// components/matura/level-picker-form.tsx
// Wraps MaturaLevelPicker in a Server-Action-backed form (useActionState),
// same shape as components/profile/level-change-form.tsx.
// ============================================================================
import { useActionState } from "react";
import { setExamLevel, type ActionState } from "@/lib/matura/actions";
import { Button } from "@/components/ui/button";
import { MaturaLevelPicker } from "@/components/matura/level-picker";
import type { MaturaLevel } from "@/lib/types/database";

const initialState: ActionState = {};

export function LevelPickerForm({
  currentLevel,
  submitLabel = "Zapisz poziom",
}: {
  currentLevel?: MaturaLevel;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(setExamLevel, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <MaturaLevelPicker name="level" defaultValue={currentLevel} />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
