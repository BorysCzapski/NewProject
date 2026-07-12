"use client";

// ============================================================================
// components/profile/language-change-form.tsx
// Lets a learner switch the language they are studying from the profile page.
// Changing it re-points all learner content queries at the new language.
// ============================================================================
import { useActionState } from "react";
import { updateLanguage, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LanguagePicker } from "@/components/auth/language-picker";
import type { TargetLanguage } from "@/lib/types/database";

const initialState: ActionState = {};

export function LanguageChangeForm({ currentLanguage }: { currentLanguage: TargetLanguage }) {
  const [state, formAction, isPending] = useActionState(updateLanguage, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LanguagePicker name="language" defaultValue={currentLanguage} />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" variant="secondary" isLoading={isPending} className="w-full">
        Zmień język
      </Button>
    </form>
  );
}
