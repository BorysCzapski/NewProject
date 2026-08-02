"use client";

// ============================================================================
// components/schola/register-form.tsx
// Mirrors components/auth/register-form.tsx, with displayName instead of
// username, and no level/language collection at all (there's no Schola
// equivalent of Phoenix's /onboarding — see proxy.ts's isScholaPath branch).
// ============================================================================
import { useActionState } from "react";
import Link from "next/link";
import { scholaRegister, type ScholaActionState } from "@/lib/schola/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ScholaActionState = {};

export function ScholaRegisterForm() {
  const [state, formAction, isPending] = useActionState(scholaRegister, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="displayName">Imię i nazwisko</Label>
        <Input id="displayName" name="displayName" autoComplete="name" required minLength={2} />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <div>
        <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      {state?.error && (
        <p className="rounded-(--radius-control) bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        Utwórz konto
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Masz już konto?{" "}
        <Link href="/schola/logowanie" className="font-medium text-primary">
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
