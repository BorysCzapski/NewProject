"use client";

// ============================================================================
// components/auth/register-form.tsx
// Registration form. Level is intentionally NOT collected here — the user
// picks it right after on /onboarding (see proxy.ts's onboarding gate).
// ============================================================================
import { useActionState } from "react";
import Link from "next/link";
import { register, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="username">Nazwa użytkownika</Label>
        <Input id="username" name="username" autoComplete="username" required minLength={3} maxLength={24} />
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
        <Link href="/login" className="font-medium text-primary">
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
