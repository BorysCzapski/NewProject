"use server";

// ============================================================================
// lib/matura/actions.ts
// Server Actions for Matura Angielski: picking/changing poziom matury, and
// submitting a task attempt (graded server-side from the stored task
// content, never trusting a client-supplied "correct" answer).
// ============================================================================
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { gradeTask } from "@/lib/matura/grading";
import { recomputeSectionProgress } from "@/lib/matura/progress";
import { MATURA_LEVELS } from "@/lib/matura/constants";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { MaturaLevel, MaturaTask, MaturaTaskAttempt, MaturaTaskContent } from "@/lib/types/database";

export interface ActionState {
  error?: string;
}

function isMaturaLevel(v: string): v is MaturaLevel {
  return (MATURA_LEVELS as string[]).includes(v);
}

/** Sets/changes the student's poziom matury. Used by useActionState forms
 * (first-run picker on the dashboard, and the settings page). */
export async function setExamLevel(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const level = String(formData.get("level") ?? "");
  if (!isMaturaLevel(level)) return { error: "Wybierz poziom, aby kontynuować." };

  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("matura_settings")
    .upsert({ user_id: profile.id, level }, { onConflict: "user_id" });
  if (error) {
    console.error("[matura] setExamLevel failed:", error);
    return { error: "Nie udało się zapisać poziomu matury." };
  }

  revalidatePath("/matura");
  revalidatePath("/matura/nauka");
  revalidatePath("/matura/ustawienia");
  redirect("/matura");
}

export async function submitTaskAttempt(params: {
  taskId: string;
  answers: Record<string, string>;
}): Promise<ActionResult<MaturaTaskAttempt>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: task, error: taskError } = await supabase
    .from("matura_tasks")
    .select("*")
    .eq("id", params.taskId)
    .single();
  if (taskError || !task) return actionFailure("Nie znaleziono zadania.");

  const { section_id, content } = task as MaturaTask;
  const graded = gradeTask(content as MaturaTaskContent, params.answers);

  const { data: attempt, error: attemptError } = await supabase
    .from("matura_task_attempts")
    .insert({
      task_id: params.taskId,
      user_id: profile.id,
      answers: params.answers,
      points_awarded: graded.pointsAwarded,
      max_points: graded.maxPoints,
      item_results: graded.itemResults,
    })
    .select("*")
    .single();
  if (attemptError || !attempt) {
    console.error("[matura] submitTaskAttempt insert failed:", attemptError);
    return actionFailure("Nie udało się zapisać odpowiedzi. Spróbuj ponownie.");
  }

  await recomputeSectionProgress(supabase, profile.id, section_id);

  const { error: activityError } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
  if (activityError) console.error("[matura] record_activity failed:", activityError);

  revalidatePath("/matura");
  revalidatePath("/matura/nauka");

  return { ok: true, data: attempt as MaturaTaskAttempt };
}
