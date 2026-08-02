"use client";

// ============================================================================
// components/schola/new-mass-plan-form.tsx
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMassPlan } from "@/lib/schola/mass-plan-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateKey } from "@/lib/utils";

const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

export function NewMassPlanForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [massDate, setMassDate] = useState(toDateKey(new Date()));
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!title.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await createMassPlan({ title, massDate, notes });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/schola/msze/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="plan-title">Nazwa</Label>
        <Input
          id="plan-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="np. Niedziela, 10:00"
          disabled={pending}
        />
      </div>
      <div>
        <Label htmlFor="plan-date">Data Mszy</Label>
        <Input
          id="plan-date"
          type="date"
          value={massDate}
          onChange={(e) => setMassDate(e.target.value)}
          disabled={pending}
        />
      </div>
      <div>
        <Label htmlFor="plan-notes">Notatki (opcjonalnie)</Label>
        <textarea
          id="plan-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={textareaClass}
          disabled={pending}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button size="lg" className="w-full" onClick={submit} disabled={!title.trim()} isLoading={pending}>
        Utwórz plan
      </Button>
    </div>
  );
}
