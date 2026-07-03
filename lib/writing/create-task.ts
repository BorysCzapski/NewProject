// ============================================================================
// lib/writing/create-task.ts
// Creates one writing_tasks row, either from an admin-supplied scenario or
// (when none is given) an AI-generated one. Shared by the writing practice
// module (app/(main)/nauka/pisanie) and the homework admin creator so a
// homework's writing task and a normal practice task are created identically.
// ============================================================================
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { askClaudeForJSON } from "@/lib/anthropic";
import { WRITING_WORD_LIMITS, WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import type { UserLevel, WritingTask, WritingTaskType } from "@/lib/types/database";

export async function createWritingTask(params: {
  level: UserLevel;
  taskType: WritingTaskType;
  scenario?: string;
  createdBy?: string | null;
}): Promise<WritingTask> {
  const limits = WRITING_WORD_LIMITS[params.level];
  let scenario = params.scenario?.trim();

  if (!scenario) {
    const result = await askClaudeForJSON<{ scenario: string }>({
      system:
        "Jesteś nauczycielem angielskiego, który tworzy krótkie zadania pisemne dla Polaków " +
        "uczących się angielskiego. Polecenie zawsze piszesz PO POLSKU, zwięźle (1-3 zdania), " +
        "z jasnym kontekstem i wskazaniem do kogo/w jakiej sytuacji pisze uczeń. Nie pisz " +
        "odpowiedzi za ucznia, tylko samo polecenie.",
      prompt:
        `Wymyśl jedno zadanie pisemne typu "${WRITING_TASK_TYPE_LABELS[params.taskType]}" ` +
        `dla poziomu ${params.level} (CEFR). Uczeń napisze odpowiedź po angielsku, długość ` +
        `${limits.min}-${limits.max} słów. Zaproponuj konkretny, ciekawy kontekst (nie ogólnikowy).`,
      schema: {
        scenario: { type: "string", description: "Polecenie zadania pisemnego, po polsku." },
      },
    });
    scenario = result.scenario;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_tasks")
    .insert({
      level: params.level,
      task_type: params.taskType,
      scenario,
      min_words: limits.min,
      max_words: limits.max,
      created_by: params.createdBy ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Nie udało się utworzyć zadania pisemnego.");
  }
  return data as WritingTask;
}
