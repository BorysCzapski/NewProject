"use server";

// ============================================================================
// lib/geografia/actions.ts
// Geografia Server Actions: submitting attempts (mc/map programmatic, open
// self-assessed), requesting an AI hint for an open answer, and favorites.
// Failures are RETURNED as ActionResult, never thrown (see lib/action-result.ts).
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { gradeMcAttempt, requestOpenAnswerHint } from "@/lib/geografia/grading";
import { gradeMapPointAttempt, gradeMapRegionAttempt } from "@/lib/geografia/map-grading";
import { getTopicsWithProgress, markTopicReviewed, recomputeTopicProgress } from "@/lib/geografia/progress";
import { maybeWriteDailySnapshot } from "@/lib/geografia/dashboard";
import type {
  GeoExercise,
  GeoExerciseAiFeedback,
  GeoExerciseAttempt,
  GeoMapPointAnswer,
  GeoMapPointGivenAnswer,
  GeoMapRegionAnswer,
  GeoMapRegionGivenAnswer,
  GeoMapTask,
  GeoMcAnswer,
  GeoMcCorrectAnswer,
  GeoOpenAnswer,
} from "@/lib/types/database";

async function getExerciseById(
  supabase: Awaited<ReturnType<typeof createClient>>,
  exerciseId: string
): Promise<GeoExercise | null> {
  const { data } = await supabase.from("geo_exercises").select("*").eq("id", exerciseId).maybeSingle();
  return (data as GeoExercise | null) ?? null;
}

/** Whatever's safe to reveal AFTER a submission, to let the solver UI show
 * "this was the correct answer" without ever exposing it beforehand (the
 * exercise row fetched server-side for rendering the question never
 * includes correct_answer/geo_map_tasks.correct_answer as client props). */
export interface ExerciseAttemptReview {
  correctOptionIds?: string[];
  correctLat?: number;
  correctLng?: number;
  toleranceKm?: number;
  distanceKm?: number;
  correctRegionIds?: string[];
}

/** Submits an MC or map attempt — graded programmatically, no AI involved.
 * Not for 'open' exercises: use submitOpenSelfAssessment instead. */
export async function submitExerciseAttempt(
  exerciseId: string,
  answer: GeoMcAnswer | GeoMapPointGivenAnswer | GeoMapRegionGivenAnswer,
  durationSeconds: number | null,
  isSpacedReview = false
): Promise<ActionResult<{ attempt: GeoExerciseAttempt; review: ExerciseAttemptReview }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const exercise = await getExerciseById(supabase, exerciseId);
  if (!exercise) return actionFailure("Nie znaleziono ćwiczenia.");
  if (exercise.type === "open") return actionFailure("To ćwiczenie wymaga samooceny odpowiedzi otwartej.");

  let pointsAwarded = 0;
  let review: ExerciseAttemptReview = {};
  if (exercise.type === "mc") {
    const correct = exercise.correct_answer as GeoMcCorrectAnswer;
    pointsAwarded = gradeMcAttempt(correct, answer as GeoMcAnswer, exercise.points_max).pointsAwarded;
    review = { correctOptionIds: correct.correctOptionIds };
  } else {
    const { data: taskRow } = await supabase
      .from("geo_map_tasks")
      .select("*")
      .eq("exercise_id", exerciseId)
      .single();
    const task = taskRow as GeoMapTask | null;
    if (!task) return actionFailure("Brak danych zadania mapowego.");

    if (task.interaction_type === "point") {
      const correct = task.correct_answer as GeoMapPointAnswer;
      const graded = gradeMapPointAttempt(correct, answer as GeoMapPointGivenAnswer, exercise.points_max);
      pointsAwarded = graded.pointsAwarded;
      review = {
        correctLat: correct.lat,
        correctLng: correct.lng,
        toleranceKm: correct.toleranceKm,
        distanceKm: graded.distanceKm,
      };
    } else if (task.interaction_type === "region") {
      const correct = task.correct_answer as GeoMapRegionAnswer;
      pointsAwarded = gradeMapRegionAttempt(correct, answer as GeoMapRegionGivenAnswer, exercise.points_max).pointsAwarded;
      review = { correctRegionIds: correct.correctRegionIds };
    } else {
      return actionFailure("Ten typ zadania mapowego nie jest jeszcze obsługiwany.");
    }
  }

  const { data: inserted, error } = await supabase
    .from("geo_exercise_attempts")
    .insert({
      exercise_id: exerciseId,
      user_id: profile.id,
      answer,
      points_awarded: pointsAwarded,
      points_max: exercise.points_max,
      self_assessed: false,
      duration_seconds: durationSeconds,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("[geografia] attempt insert failed:", error);
    return actionFailure("Nie udało się zapisać próby rozwiązania.");
  }

  await Promise.all([
    recomputeTopicProgress(supabase, profile.id, exercise.topic_id),
    supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GEOGRAFIA }),
    isSpacedReview ? markTopicReviewed(supabase, profile.id, exercise.topic_id) : Promise.resolve(),
  ]);
  await maybeWriteDailySnapshot(supabase, profile.id, await getTopicsWithProgress(supabase, profile.id));

  revalidatePath("/geografia");
  revalidatePath("/geografia/tematy");
  return { ok: true, data: { attempt: inserted as GeoExerciseAttempt, review } };
}

/** Asks the AI for a hint (matched/missing rubric points) WITHOUT recording
 * an attempt — a student can request this before deciding their own score. */
export async function requestOpenHint(
  exerciseId: string,
  studentAnswer: string
): Promise<ActionResult<GeoExerciseAiFeedback>> {
  await requireProfile();
  const supabase = await createClient();

  const exercise = await getExerciseById(supabase, exerciseId);
  if (!exercise || exercise.type !== "open") return actionFailure("Nie znaleziono pytania otwartego.");
  if (!studentAnswer.trim()) return actionFailure("Wpisz odpowiedź przed poproszeniem o wskazówkę.");

  const correct = exercise.correct_answer as { modelAnswer: string; rubric: string[] };
  const feedback = await requestOpenAnswerHint({
    statement: exercise.prompt.statement,
    modelAnswer: correct.modelAnswer,
    rubric: correct.rubric,
    studentAnswer,
  });
  return { ok: true, data: feedback };
}

/** Fetches the model answer + rubric for an open exercise ON DEMAND (not
 * preloaded into the solve page's initial props) — so a student sees it only
 * after deliberately clicking "reveal", not the instant the page loads. */
export async function revealModelAnswer(
  exerciseId: string
): Promise<ActionResult<{ modelAnswer: string; rubric: string[] }>> {
  await requireProfile();
  const supabase = await createClient();
  const exercise = await getExerciseById(supabase, exerciseId);
  if (!exercise || exercise.type !== "open") return actionFailure("Nie znaleziono pytania otwartego.");
  const correct = exercise.correct_answer as { modelAnswer: string; rubric: string[] };
  return { ok: true, data: correct };
}

/** Records an open-answer attempt with the STUDENT'S OWN point choice
 * (clamped to [0, points_max]) — never AI-authoritative, per product spec. */
export async function submitOpenSelfAssessment(
  exerciseId: string,
  answerText: string,
  selfPoints: number,
  aiFeedback: GeoExerciseAiFeedback | null,
  durationSeconds: number | null
): Promise<ActionResult<GeoExerciseAttempt>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const exercise = await getExerciseById(supabase, exerciseId);
  if (!exercise || exercise.type !== "open") return actionFailure("Nie znaleziono pytania otwartego.");
  if (!answerText.trim()) return actionFailure("Wpisz odpowiedź przed wysłaniem.");

  const pointsAwarded = Math.max(0, Math.min(exercise.points_max, Math.round(selfPoints * 2) / 2));
  const answer: GeoOpenAnswer = { text: answerText };

  const { data: inserted, error } = await supabase
    .from("geo_exercise_attempts")
    .insert({
      exercise_id: exerciseId,
      user_id: profile.id,
      answer,
      points_awarded: pointsAwarded,
      points_max: exercise.points_max,
      self_assessed: true,
      ai_feedback: aiFeedback,
      duration_seconds: durationSeconds,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("[geografia] open attempt insert failed:", error);
    return actionFailure("Nie udało się zapisać odpowiedzi.");
  }

  await Promise.all([
    recomputeTopicProgress(supabase, profile.id, exercise.topic_id),
    supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GEOGRAFIA }),
  ]);
  await maybeWriteDailySnapshot(supabase, profile.id, await getTopicsWithProgress(supabase, profile.id));

  revalidatePath("/geografia");
  revalidatePath("/geografia/tematy");
  return { ok: true, data: inserted as GeoExerciseAttempt };
}

export async function toggleFavorite(exerciseId: string): Promise<ActionResult<{ favorited: boolean }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("geo_favorites")
    .select("exercise_id")
    .eq("user_id", profile.id)
    .eq("exercise_id", exerciseId)
    .maybeSingle();

  if (existing) {
    await supabase.from("geo_favorites").delete().eq("user_id", profile.id).eq("exercise_id", exerciseId);
    revalidatePath("/geografia/ulubione");
    return { ok: true, data: { favorited: false } };
  }

  const { error } = await supabase.from("geo_favorites").insert({ user_id: profile.id, exercise_id: exerciseId });
  if (error) {
    console.error("[geografia] favorite insert failed:", error);
    return actionFailure("Nie udało się dodać do ulubionych.");
  }
  revalidatePath("/geografia/ulubione");
  return { ok: true, data: { favorited: true } };
}
