"use server";

// ============================================================================
// lib/listening/actions.ts
// Server Actions backing the listening module: starting a new exercise from
// a pasted YouTube link (via lib/listening/create-exercise.ts) and grading a
// submitted gap-fill attempt.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { createListeningExercise } from "@/lib/listening/create-exercise";
import { isCloseMatch } from "@/lib/utils";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { ListeningAttempt, ListeningExercise } from "@/lib/types/database";

/** Creates a new listening exercise from a YouTube link and redirects to it. */
export async function startListeningExercise(youtubeUrl: string): Promise<never> {
  const profile = await requireProfile();

  const trimmed = youtubeUrl.trim();
  if (!trimmed) throw new Error("Wklej link do filmiku YouTube.");

  const exercise = await createListeningExercise({
    youtubeUrl: trimmed,
    level: profile.level,
    createdBy: profile.id,
  });

  redirect(`/nauka/sluchanie/${exercise.id}`);
}

/** Grades a submitted gap-fill attempt, persists it, and records the listening activity. */
export async function submitListeningAttempt(
  exerciseId: string,
  answers: Record<string, string>
): Promise<ListeningAttempt> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exercise, error: exerciseError } = await supabase
    .from("listening_exercises")
    .select("*")
    .eq("id", exerciseId)
    .single();
  if (exerciseError || !exercise) throw new Error("Nie znaleziono ćwiczenia.");

  const { gaps } = exercise as ListeningExercise;
  if (gaps.length === 0) throw new Error("To ćwiczenie nie ma żadnych luk.");

  let correctCount = 0;
  for (const gap of gaps) {
    const gapId = `${gap.segmentIndex}-${gap.wordIndex}`;
    if (isCloseMatch(answers[gapId] ?? "", gap.answer)) correctCount++;
  }
  const score = (correctCount / gaps.length) * 100;

  const { data: attempt, error: insertError } = await supabase
    .from("listening_attempts")
    .insert({
      user_id: profile.id,
      exercise_id: exerciseId,
      answers,
      score,
    })
    .select()
    .single();
  if (insertError || !attempt) throw new Error("Nie udało się zapisać wyniku.");

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.LISTENING });

  return attempt as ListeningAttempt;
}
