// ============================================================================
// app/login/page.tsx
// Public login screen. `redirectTo` is populated by proxy.ts when it bounces
// an unauthenticated visitor away from a protected page.
// ============================================================================
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            EnglishApp
          </Link>
          <p className="mt-2 text-foreground-muted">Zaloguj się i wróć do nauki</p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
