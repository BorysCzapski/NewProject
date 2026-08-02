// ============================================================================
// app/schola/rejestracja/page.tsx
// Schola's own registration screen. No language/level fields — there's no
// Schola equivalent of Phoenix's /onboarding at all.
// ============================================================================
import { ScholaRegisterForm } from "@/components/schola/register-form";

export default function ScholaRegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-primary">Schola</span>
          <p className="mt-2 text-foreground-muted">Załóż konto i dołącz do śpiewnika</p>
        </div>
        <ScholaRegisterForm />
      </div>
    </div>
  );
}
