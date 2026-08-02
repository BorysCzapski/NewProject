// ============================================================================
// app/schola/logowanie/page.tsx
// Schola's own login screen — deliberately no mention of Phoenix anywhere.
// `redirectTo` is populated by proxy.ts's isScholaPath branch when it
// bounces an unauthenticated visitor away from a protected /schola/* page.
// ============================================================================
import { ScholaLoginForm } from "@/components/schola/login-form";

export default async function ScholaLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-primary">Schola</span>
          <p className="mt-2 text-foreground-muted">Zaloguj się do śpiewnika</p>
        </div>
        <ScholaLoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
