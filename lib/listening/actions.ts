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
import { TranscriptError } from "@/lib/listening/fetch-transcript";
import { isCloseMatch } from "@/lib/utils";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionFailure } from "@/lib/action-result";
import type { ListeningAttempt, ListeningExercise } from "@/lib/types/database";

/**
 * Creates a new listening exercise from a YouTube link and redirects to it.
 * Failures are RETURNED (not thrown) — production Next.js redacts messages
 * of errors thrown in Server Actions, so throwing would show the user a
 * useless generic error instead of the real reason.
 */
export async function startListeningExercise(
  youtubeUrl: string,
  manualTranscript?: string
): Promise<ActionFailure & { transcriptUnavailable?: boolean }> {
  const profile = await requireProfile();

  const trimmed = youtubeUrl.trim();
  if (!trimmed) return actionFailure("Wklej link do filmiku YouTube.");

  let exercise: ListeningExercise;
  try {
    exercise = await createListeningExercise({
      youtubeUrl: trimmed,
      language: profile.target_language,
      level: profile.level,
      createdBy: profile.id,
      manualTranscript,
    });
  } catch (err) {
    console.error("[listening] createListeningExercise failed:", err);
    if (err instanceof TranscriptError) {
      // Signals the form to offer the paste-it-yourself fallback.
      return { ...actionFailure(err.userMessage), transcriptUnavailable: true };
    }
    return actionFailure(
      err instanceof Error ? err.message : "Nie udało się utworzyć ćwiczenia. Spróbuj ponownie."
    );
  }

  redirect(`/jezyki/nauka/sluchanie/${exercise.id}`);
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

  // The UI allows unlimited retries of the same exercise ("Spróbuj ponownie") —
  // only the FIRST attempt at a given exercise should count as the "meaningful
  // activity" for streaks, otherwise retries would silently inflate activity_log.
  const { count: priorAttempts } = await supabase
    .from("listening_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("exercise_id", exerciseId);

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

  if (!priorAttempts) {
    await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.LISTENING });
  }

  return attempt as ListeningAttempt;
}
