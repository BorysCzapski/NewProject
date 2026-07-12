"use client";

import { useActionState } from "react";
import { completeOnboarding, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LevelPicker } from "@/components/auth/level-picker";
import { LanguagePicker } from "@/components/auth/language-picker";

const initialState: ActionState = {};

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(completeOnboarding, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Wybierz język, którego chcesz się uczyć:
        </h2>
        <LanguagePicker name="language" />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Wybierz swój poziom:</h2>
        <LevelPicker name="level" />
      </div>

      {state?.error && (
        <p className="rounded-(--radius-control) bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        Zaczynamy!
      </Button>
    </form>
  );
}
