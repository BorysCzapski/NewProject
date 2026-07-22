"use client";

// ============================================================================
// components/matma/admin/ai-grading-review-item.tsx
// One row in the admin AI-grading review queue: student + trimmed problem
// statement + the current AI feedback (small local rendering — see
// CLAUDE.md build notes, every area that shows AI grading builds its own
// copy) + a manual-correction form calling adminCorrectAttemptGrade.
// ============================================================================
import { useState, useTransition } from "react";
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";
import { adminCorrectAttemptGrade } from "@/lib/matma/actions";
import type { AdminAttemptReviewRow } from "@/lib/matma/admin-queries";

export function AiGradingReviewItem({ row }: { row: AdminAttemptReviewRow }) {
  const feedback = row.ai_feedback;
  const maxPoints = feedback?.max_points ?? 0;
  const [points, setPoints] = useState(String(feedback?.points_awarded ?? 0));
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const trimmedStatement =
    row.problem_statement.length > 200 ? `${row.problem_statement.slice(0, 200)}…` : row.problem_statement;

  function save() {
    setStatus(null);
    const parsed = Number(points);
    if (!Number.isFinite(parsed)) {
      setStatus({ ok: false, message: "Podaj poprawną liczbę punktów." });
      return;
    }
    startTransition(async () => {
      const result = await adminCorrectAttemptGrade(row.id, parsed, reason);
      setStatus(result.ok ? { ok: true, message: "Zapisano korektę." } : { ok: false, message: result.error });
    });
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{row.student_username}</span>
        <span className="text-xs text-foreground-muted">
          {new Date(row.attempted_at).toLocaleDateString("pl-PL")}
        </span>
      </div>

      <MathText text={trimmedStatement} className="text-sm text-foreground-muted" />

      {feedback && (
        <div className="flex flex-col gap-2 rounded-(--radius-control) bg-surface-muted p-3">
          <p className="text-lg font-bold text-foreground">
            {feedback.points_awarded} / {feedback.max_points} pkt
            <span className="ml-2 text-xs font-normal text-foreground-muted">ocena AI</span>
          </p>
          {feedback.improvement_tip && (
            <div className="flex gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <MathText text={feedback.improvement_tip} className="text-xs text-foreground-muted" />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor={`points-${row.id}`}>Skorygowane punkty</Label>
            <Input
              id={`points-${row.id}`}
              type="number"
              min={0}
              max={maxPoints}
              step="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <span className="pb-3 text-sm text-foreground-muted">/ {maxPoints} pkt</span>
        </div>
        <div>
          <Label htmlFor={`reason-${row.id}`}>Powód korekty (opcjonalnie)</Label>
          <Input
            id={`reason-${row.id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Np. AI nie doceniło poprawnej metody"
          />
        </div>
        <Button size="sm" variant="outline" isLoading={isPending} onClick={save} className="self-start">
          Zapisz korektę
        </Button>
        {status && <p className={cn("text-sm", status.ok ? "text-accent" : "text-danger")}>{status.message}</p>}
      </div>
    </Card>
  );
}
