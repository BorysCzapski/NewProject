// ============================================================================
// components/matma/problem/ai-feedback-card.tsx
// Renders a MathAiFeedback (see lib/types/database.ts): a big "X / Y pkt"
// headline, one row per step_breakdown entry (check/x icon + step name +
// justification), then the improvement_tip in a highlighted callout. Every
// area that shows AI grading (practice, exam, admin) builds its own small
// local copy of this — see CLAUDE.md build notes — so this file is scoped
// to the problem-practice area only.
// ============================================================================
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";
import type { MathAiFeedback } from "@/lib/types/database";

export function AiFeedbackCard({ feedback }: { feedback: MathAiFeedback }) {
  const ratio = feedback.max_points > 0 ? feedback.points_awarded / feedback.max_points : 0;
  const scoreClassName = ratio >= 0.8 ? "text-accent" : ratio >= 0.5 ? "text-warning" : "text-danger";

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-center">
        <p className={cn("text-3xl font-bold", scoreClassName)}>
          {feedback.points_awarded} / {feedback.max_points} pkt
        </p>
        <p className="text-sm text-foreground-muted">Ocena AI</p>
      </div>

      {feedback.step_breakdown.length > 0 && (
        <div className="flex flex-col gap-2">
          {feedback.step_breakdown.map((entry, i) => (
            <div key={i} className="flex gap-2.5 rounded-(--radius-control) bg-surface-muted p-3">
              {entry.satisfied ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <MathText text={entry.step} className="text-sm font-medium text-foreground" />
                  <span className="shrink-0 text-xs text-foreground-muted">
                    {entry.points_awarded}/{entry.points_possible}
                  </span>
                </div>
                <MathText text={entry.justification} className="mt-0.5 text-xs text-foreground-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback.improvement_tip && (
        <div className="flex gap-2.5 rounded-(--radius-control) bg-primary-soft p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <MathText text={feedback.improvement_tip} className="text-sm text-foreground" />
        </div>
      )}
    </Card>
  );
}
