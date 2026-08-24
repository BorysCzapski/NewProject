"use server";

// ============================================================================
// lib/algorytmy/actions.ts
// Server Actions for Algorytmy: submitting an answer and marking a lesson as
// done.
//
// Grading happens HERE, from the stored exercise, and the client is never sent
// correct_option_id before it answers — same stance as lib/matura/actions.ts
// and lib/geografia/actions.ts. A client that knows the answer is a client
// that can be told to show it.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { AlgoExercise, AlgoExerciseOption } from "@/lib/types/database";

export interface AlgoAttemptReview {
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
}

export async function submitExerciseAnswer(params: {
  exerciseId: string;
  chosenOptionId: string;
}): Promise<ActionResult<AlgoAttemptReview>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exerciseRow, error: readError } = await supabase
    .from("algo_exercises")
    .select("*")
    .eq("id", params.exerciseId)
    .maybeSingle();

  if (readError || !exerciseRow) {
    console.error("[algorytmy] nie udało się odczytać zadania:", readError);
    return actionFailure("Nie udało się wczytać zadania. Odśwież stronę i spróbuj ponownie.");
  }
  const exercise = exerciseRow as AlgoExercise;

  // Reject an option id that is not one of this exercise's own options, rather
  // than silently recording it as a wrong answer — it can only come from a
  // tampered or stale form.
  const options = (exercise.options ?? []) as AlgoExerciseOption[];
  if (!options.some((o) => o.id === params.chosenOptionId)) {
    return actionFailure("Ta odpowiedź nie należy do tego zadania. Odśwież stronę.");
  }

  const isCorrect = params.chosenOptionId === exercise.correct_option_id;

  const { error: insertError } = await supabase.from("algo_exercise_attempts").insert({
    exercise_id: exercise.id,
    user_id: profile.id,
    chosen_option_id: params.chosenOptionId,
    is_correct: isCorrect,
    points_awarded: isCorrect ? exercise.points_max : 0,
    points_max: exercise.points_max,
  });

  if (insertError) {
    console.error("[algorytmy] zapis próby nie powiódł się:", insertError);
    return actionFailure("Nie udało się zapisać odpowiedzi. Spróbuj ponownie.");
  }

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    activity_type: ACTIVITY_TYPES.ALGORYTMY,
    activity_date: new Date().toISOString().slice(0, 10),
    metadata: { app: "algorytmy", topic_id: exercise.topic_id, task_type: exercise.task_type },
  });

  revalidatePath("/algorytmy");
  revalidatePath("/algorytmy/dzialy");

  return {
    ok: true,
    data: {
      isCorrect,
      correctOptionId: exercise.correct_option_id,
      explanation: exercise.explanation,
    },
  };
}

/** Marks a lesson as przerobiona. Idempotent — re-marking is a no-op upsert,
 * so a double click cannot produce two rows or move completed_at. */
export async function markLessonDone(params: {
  lessonId: string;
  topicSlug: string;
  lessonSlug: string;
}): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("algo_lesson_progress")
    .upsert(
      { user_id: profile.id, lesson_id: params.lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[algorytmy] oznaczenie lekcji nie powiodło się:", error);
    return actionFailure("Nie udało się zapisać postępu. Spróbuj ponownie.");
  }

  revalidatePath(`/algorytmy/dzialy/${params.topicSlug}`);
  revalidatePath(`/algorytmy/dzialy/${params.topicSlug}/lekcja/${params.lessonSlug}`);
  revalidatePath("/algorytmy");
  return { ok: true, data: null };
}
