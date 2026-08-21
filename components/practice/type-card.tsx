"use client";

// ============================================================================
// components/matura/task-type-card.tsx
// One CKE task type on a section hub: what it is, how many times the student
// has done it, how they score on it, and a button that hands them a fresh
// instance of it.
//
// A form rather than a link — see lib/matura/practice-actions.ts for why
// starting a task must not be prefetchable. The pending state matters more
// here than on a normal button: when the student's queue for a type is empty
// the action generates a task inline, which takes seconds, and a card that
// looked inert for that long would read as broken.
// ============================================================================
import { useFormStatus } from "react-dom";
import { ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface TaskTypeCardProps {
  action: (formData: FormData) => Promise<void>;
  /** Hidden inputs identifying the type to the action. */
  fields: Record<string, string>;
  label: string;
  description: string;
  completedCount: number;
  lastPoints: number | null;
  lastMaxPoints: number | null;
  averagePercent: number | null;
  /** Set when the type has nothing to hand out and cannot generate more. */
  unavailableNote?: string;
}

function CardBody({
  label,
  description,
  completedCount,
  lastPoints,
  lastMaxPoints,
  averagePercent,
  unavailableNote,
}: Omit<TaskTypeCardProps, "action" | "fields">) {
  const { pending } = useFormStatus();

  return (
    <Card className="w-full text-left transition-transform active:scale-[0.99]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <CardTitle>{label}</CardTitle>
          <CardDescription className="mt-0.5">{description}</CardDescription>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="tabular-nums">{completedCount}×</span>
              <span className="font-normal text-foreground-muted">wykonane</span>
            </span>
            {averagePercent !== null && <span className="tabular-nums">średnio {averagePercent}%</span>}
            {lastPoints !== null && lastMaxPoints !== null && (
              <span className="tabular-nums">
                ostatnio {lastPoints}/{lastMaxPoints}
              </span>
            )}
          </div>

          {unavailableNote && <p className="mt-2 text-xs text-foreground-muted">{unavailableNote}</p>}
        </div>

        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-foreground-muted" />
          )}
        </span>
      </div>

      {pending && (
        <p className="mt-2 text-xs text-foreground-muted">Przygotowuję nowe zadanie…</p>
      )}
    </Card>
  );
}

export function TaskTypeCard({ action, fields, ...display }: TaskTypeCardProps) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="block w-full">
        <CardBody {...display} />
      </button>
    </form>
  );
}
