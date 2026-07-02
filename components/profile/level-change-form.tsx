"use client";

import { useActionState } from "react";
import { updateLevel, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LevelPicker } from "@/components/auth/level-picker";
import type { UserLevel } from "@/lib/types/database";

const initialState: ActionState = {};

export function LevelChangeForm({ currentLevel }: { currentLevel: UserLevel }) {
  const [state, formAction, isPending] = useActionState(updateLevel, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <LevelPicker name="level" defaultValue={currentLevel} />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" variant="secondary" isLoading={isPending} className="w-full">
        Zapisz poziom
      </Button>
    </form>
  );
}
