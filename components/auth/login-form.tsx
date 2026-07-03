"use client";

// ============================================================================
// components/auth/login-form.tsx
// Login form: accepts either username or e-mail in a single field (the
// server action resolves username -> email server-side).
// ============================================================================
import { useActionState } from "react";
import Link from "next/link";
import { login, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
      <div>
        <Label htmlFor="identifier">Login lub e-mail</Label>
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
          placeholder="np. admin lub jan@example.com"
          required
        />
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
        <Link href="/register" className="font-medium text-primary">
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
