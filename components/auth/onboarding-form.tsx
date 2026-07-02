"use client";

import { useActionState } from "react";
import { completeOnboarding, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LevelPicker } from "@/components/auth/level-picker";

const initialState: ActionState = {};

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(completeOnboarding, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <LevelPicker name="level" />

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
