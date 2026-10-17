"use client";

// ============================================================================
// components/exam/exam-date-form.tsx
// Sets/changes an exam-countdown date for one of the exam apps (Maturalnik,
// Informatyka). The app-specific Server Action comes in as `save`.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ExamDateForm({
  currentExamDate,
  save,
  backHref,
  label,
}: {
  currentExamDate: string | null;
  save: (examDate: string | null) => Promise<{ ok: true } | { ok: false; error: string }>;
  backHref: string;
  label: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentExamDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await save(value || null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(backHref);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="exam-date" className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <input
          id="exam-date"
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-12 rounded-(--radius-control) border border-border bg-surface px-3.5 text-base text-foreground shadow-(--shadow-control)"
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" size="lg" isLoading={pending} className="w-full">
        Zapisz
      </Button>
    </form>
  );
}
