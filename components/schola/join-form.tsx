"use client";

// ============================================================================
// components/schola/join-form.tsx
// For an already-authenticated user (typically an existing Phoenix account)
// who isn't a Schola member yet — see app/schola/brak-dostepu/page.tsx.
// ============================================================================
import { useActionState } from "react";
import { joinScholaAsExistingUser, type ScholaActionState } from "@/lib/schola/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ScholaActionState = {};

export function JoinScholaForm() {
  const [state, formAction, isPending] = useActionState(joinScholaAsExistingUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="displayName">Imię i nazwisko</Label>
        <Input id="displayName" name="displayName" autoComplete="name" required minLength={2} />
      </div>

      {state?.error && (
        <p className="rounded-(--radius-control) bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        Dołącz do Scholi
      </Button>
    </form>
  );
}
