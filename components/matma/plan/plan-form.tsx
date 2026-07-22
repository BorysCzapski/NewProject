"use client";

// ============================================================================
// components/matma/plan/plan-form.tsx
// Sets or updates the exam-date study plan (exam date + weekly hours target),
// and — when a plan already exists — offers a "Wyłącz harmonogram" action
// that switches the timed schedule off (the untimed learning path keeps
// working either way, per lib/matma/actions.ts generateOrUpdateStudyPlan).
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generateOrUpdateStudyPlan } from "@/lib/matma/actions";

const HOURS_OPTIONS: { value: number; label: string }[] = [
  { value: 4, label: "3–5h / tydzień" },
  { value: 7, label: "5–10h / tydzień" },
  { value: 12, label: "10h+ / tydzień" },
];

/** Suggests the next upcoming May 1st (the usual CKE matura window) as a
 * sane default starting point — computed from a real Date, fine to do in a
 * Client Component. */
function nextUpcomingMay1(): string {
  const now = new Date();
  const may1ThisYear = new Date(now.getFullYear(), 4, 1);
  const target = now <= may1ThisYear ? may1ThisYear : new Date(now.getFullYear() + 1, 4, 1);
  return target.toISOString().slice(0, 10);
}

export function PlanForm({
  hasPlan,
  currentExamDate,
  currentWeeklyHoursTarget,
}: {
  hasPlan: boolean;
  currentExamDate?: string | null;
  currentWeeklyHoursTarget?: number | null;
}) {
  const router = useRouter();
  const [examDate, setExamDate] = useState(currentExamDate ?? nextUpcomingMay1());
  const [weeklyHours, setWeeklyHours] = useState(currentWeeklyHoursTarget ?? HOURS_OPTIONS[0].value);
  const [pending, startTransition] = useTransition();
  const [disablePending, startDisableTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!examDate || pending || disablePending) return;
    setError(null);
    startTransition(async () => {
      const result = await generateOrUpdateStudyPlan(examDate, weeklyHours);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function disable() {
    if (pending || disablePending) return;
    setError(null);
    startDisableTransition(async () => {
      const result = await generateOrUpdateStudyPlan(null, null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="exam-date">Data egzaminu</Label>
        <Input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          disabled={pending || disablePending}
        />
      </div>

      <div>
        <Label>Ile czasu tygodniowo chcesz poświęcać?</Label>
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          {HOURS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={pending || disablePending}
              onClick={() => setWeeklyHours(opt.value)}
              className={cn(
                "flex-1 rounded-full px-2 py-2 text-xs font-medium transition-colors disabled:opacity-50",
                weeklyHours === opt.value ? "bg-primary text-primary-foreground" : "text-foreground-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        isLoading={pending}
        disabled={disablePending}
        onClick={submit}
      >
        <CalendarDays className="h-4 w-4" />
        {hasPlan ? "Zapisz zmiany" : "Utwórz plan"}
      </Button>

      {hasPlan && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          isLoading={disablePending}
          disabled={pending}
          onClick={disable}
        >
          Wyłącz harmonogram
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
