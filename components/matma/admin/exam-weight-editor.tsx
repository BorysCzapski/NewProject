"use client";

// ============================================================================
// components/matma/admin/exam-weight-editor.tsx
// Inline editor for a single topic's exam_weight (0..1), embedded in a Card
// on the Matma admin overview.
// ============================================================================
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminUpdateExamWeight } from "@/lib/matma/actions";

export function ExamWeightEditor({ topicId, initialWeight }: { topicId: string; initialWeight: number }) {
  const [value, setValue] = useState(String(initialWeight));
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  function save() {
    setStatus(null);
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setStatus({ ok: false, message: "Podaj poprawną liczbę od 0 do 1." });
      return;
    }
    startTransition(async () => {
      const result = await adminUpdateExamWeight(topicId, parsed);
      setStatus(result.ok ? { ok: true, message: "Zapisano." } : { ok: false, message: result.error });
    });
  }

  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-3">
      <Label htmlFor={`weight-${topicId}`}>Waga w egzaminie (0–1)</Label>
      <div className="flex items-center gap-2">
        <Input
          id={`weight-${topicId}`}
          type="number"
          step="0.01"
          min={0}
          max={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-[7rem]"
        />
        <Button size="sm" variant="outline" isLoading={isPending} onClick={save}>
          Zapisz
        </Button>
      </div>
      {status && <p className={cn("text-sm", status.ok ? "text-accent" : "text-danger")}>{status.message}</p>}
    </div>
  );
}
