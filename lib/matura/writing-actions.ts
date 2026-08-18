"use server";

// ============================================================================
// lib/matura/writing-actions.ts
// Server Action for "Wypowiedź pisemna": grades the student's free-text
// submission against the CKE rubric (lib/matura/writing-grading.ts) and
// persists it. Separate file from lib/matura/actions.ts because it needs
// its own MaturaLevel lookup (to pick the right rubric) that the exact-match
// task flow doesn't.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { gradeWritingSubmission, countWords } from "@/lib/matura/writing-grading";
import { recomputeSectionProgress } from "@/lib/matura/progress";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { MaturaSection, MaturaWritingSubmission, MaturaWritingTask } from "@/lib/types/database";

export async function submitWritingTask(params: {
  taskId: string;
  content: string;
}): Promise<ActionResult<MaturaWritingSubmission>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const trimmed = params.content.trim();
  if (!trimmed) return actionFailure("Wpisz swoją odpowiedź przed wysłaniem.");

  const { data: task, error: taskError } = await supabase
    .from("matura_writing_tasks")
    .select("*, matura_sections!inner(level)")
    .eq("id", params.taskId)
    .single();
  if (taskError || !task) return actionFailure("Nie znaleziono zadania.");

  const { matura_sections, ...taskRow } = task as MaturaWritingTask & {
    matura_sections: Pick<MaturaSection, "level">;
  };
  const level = matura_sections.level;

  let feedback;
  try {
    feedback = await gradeWritingSubmission(level, taskRow, trimmed);
  } catch (err) {
    console.error("[matura] gradeWritingSubmission failed:", err);
    return actionFailure("Nie udało się ocenić pracy przez AI. Spróbuj ponownie za chwilę.");
  }

  const { data: submission, error: insertError } = await supabase
    .from("matura_writing_submissions")
    .insert({
      task_id: params.taskId,
      user_id: profile.id,
      content: trimmed,
      word_count: countWords(trimmed),
      points_awarded: feedback.totalPoints,
      max_points: feedback.maxPoints,
      ai_feedback: feedback,
    })
    .select("*")
    .single();
  if (insertError || !submission) {
    console.error("[matura] writing submission insert failed:", insertError);
    return actionFailure("Nie udało się zapisać pracy.");
  }

  await recomputeSectionProgress(supabase, profile.id, taskRow.section_id);

  const { error: activityError } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
  if (activityError) console.error("[matura] record_activity failed:", activityError);

  revalidatePath("/matura");
  revalidatePath("/matura/nauka");
  revalidatePath("/matura/nauka/pisanie");

  return { ok: true, data: submission as MaturaWritingSubmission };
}
