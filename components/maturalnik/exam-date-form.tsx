"use client";

// ============================================================================
// components/maturalnik/exam-date-form.tsx
// Sets/changes maturalnik_settings.exam_date — a plain typed Server Action
// (not FormData-based), called via useTransition, same style as
// components/textbook/delete-textbook-button.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setExamDate } from "@/lib/maturalnik/actions";

export function ExamDateForm({ currentExamDate }: { currentExamDate: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(currentExamDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await setExamDate(value || null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/maturalnik");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="exam-date" className="text-sm font-semibold text-foreground">
          Data matury z matematyki
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
