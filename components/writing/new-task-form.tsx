"use client";

// ============================================================================
// components/writing/new-task-form.tsx
// "Nowe zadanie" picker on the writing hub: buttons for each writing_tasks
// task_type plus a "losowy" option, each starting a new task via the
// startWritingTask Server Action (which redirects once the task is created).
// ============================================================================
import { useState, useTransition } from "react";
import { Shuffle } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startWritingTask } from "@/lib/writing/actions";
import { WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import type { WritingTaskType } from "@/lib/types/database";

const TASK_TYPES = Object.keys(WRITING_TASK_TYPE_LABELS) as WritingTaskType[];

export function NewTaskForm() {
  const [pending, startTransition] = useTransition();
  const [pendingType, setPendingType] = useState<WritingTaskType | "random" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function start(taskType?: WritingTaskType) {
    setError(null);
    setPendingType(taskType ?? "random");
    startTransition(async () => {
      try {
        // On success the action redirects; on failure it RETURNS the error
        // (thrown Server Action errors are redacted in production).
        const result = await startWritingTask(taskType);
        if (result && !result.ok) {
          setError(result.error);
          setPendingType(null);
        }
      } catch (err) {
        // On success the action redirects, which throws a special Next.js
        // navigation error that must propagate, not be swallowed here.
        unstable_rethrow(err);
        setError("Nie udało się utworzyć zadania. Spróbuj ponownie.");
        setPendingType(null);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {TASK_TYPES.map((type) => (
        <Button
          key={type}
          variant="outline"
          size="lg"
          className="w-full justify-start"
          disabled={pending}
          isLoading={pending && pendingType === type}
          onClick={() => start(type)}
        >
          {WRITING_TASK_TYPE_LABELS[type]}
        </Button>
      ))}
      <Button
        size="lg"
        className="mt-1 w-full"
        disabled={pending}
        isLoading={pending && pendingType === "random"}
        onClick={() => start()}
      >
        <Shuffle className="h-4 w-4" />
        Losowe zadanie
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
