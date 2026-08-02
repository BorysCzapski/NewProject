"use client";

// ============================================================================
// components/schola/login-form.tsx
// Mirrors components/auth/login-form.tsx, but email+password only — Schola
// members have no username field to resolve, unlike Phoenix profiles.
// ============================================================================
import { useActionState } from "react";
import Link from "next/link";
import { scholaLogin, type ScholaActionState } from "@/lib/schola/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ScholaActionState = {};

export function ScholaLoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(scholaLogin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/schola"} />
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
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-(--radius-control) bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isPending} className="w-full">
        Zaloguj się
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Nie masz konta?{" "}
        <Link href="/schola/rejestracja" className="font-medium text-primary">
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
