"use server";

// ============================================================================
// lib/matura/actions.ts
// Server Actions for Matura: picking/changing the exam język + poziom, and
// submitting a task attempt (graded server-side from the stored task
// content, never trusting a client-supplied "correct" answer).
// ============================================================================
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { gradeTask } from "@/lib/matura/grading";
import { recomputeSectionProgress } from "@/lib/matura/progress";
import { MATURA_LANGUAGES, MATURA_LEVELS } from "@/lib/matura/constants";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type {
  MaturaLanguage,
  MaturaLevel,
  MaturaTask,
  MaturaTaskAttempt,
  MaturaTaskContent,
} from "@/lib/types/database";

export interface ActionState {
  error?: string;
}

function isMaturaLevel(v: string): v is MaturaLevel {
  return (MATURA_LEVELS as string[]).includes(v);
}

function isMaturaLanguage(v: string): v is MaturaLanguage {
  return (MATURA_LANGUAGES as string[]).includes(v);
}

/** Sets/changes which exam the student is preparing for — język AND poziom,
 * saved together because they are picked together in one form (first-run
 * picker on the dashboard, and the settings page).
 *
 * Switching language destroys nothing: mastery and attempts hang off
 * section-scoped rows, and matura_settings only records the CURRENT choice,
 * so a student can move between angielski and hiszpański and find each one's
 * progress exactly as they left it. */
export async function setExamPreferences(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const level = String(formData.get("level") ?? "");
  const language = String(formData.get("language") ?? "");
  if (!isMaturaLanguage(language)) return { error: "Wybierz język, aby kontynuować." };
  if (!isMaturaLevel(level)) return { error: "Wybierz poziom, aby kontynuować." };

  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("matura_settings")
    .upsert({ user_id: profile.id, language, level }, { onConflict: "user_id" });
  if (error) {
    console.error("[matura] setExamPreferences failed:", error);
    return { error: "Nie udało się zapisać ustawień matury." };
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
