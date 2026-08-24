"use server";

// ============================================================================
// lib/gitara/actions.ts
// Server Actions for Gitara: marking a lesson done, recording a drill
// outcome, and logging a practice session. Every write here calls the shared
// record_activity RPC (see supabase/migrations/0001_init.sql) so streaks and
// the calendar pick it up — the convention nearly every sibling app follows
// (lib/matma/actions.ts, lib/geografia/actions.ts, lib/vocabulary/actions.ts,
// ...). lib/algorytmy/actions.ts inserts into activity_log directly instead
// and so never advances the streak; that looks like a gap in that app, not a
// pattern worth repeating here.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { ACTIVITY_TYPES } from "@/lib/constants";

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
    .from("gtr_lesson_progress")
    .upsert(
      { user_id: profile.id, lesson_id: params.lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[gitara] oznaczenie lekcji nie powiodło się:", error);
    return actionFailure("Nie udało się zapisać postępu. Spróbuj ponownie.");
  }

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GITARA });

  revalidatePath(`/gitara/dzialy/${params.topicSlug}`);
  revalidatePath(`/gitara/dzialy/${params.topicSlug}/lekcja/${params.lessonSlug}`);
  revalidatePath("/gitara");
  revalidatePath("/gitara/postepy");
  return { ok: true, data: null };
}

/** Records the outcome of a client-generated-and-graded drill (see the
 * module comment on gtr_drill_attempts in the migration for why there is no
 * server-side exercise bank to grade against — the drill already graded
 * itself before calling this). */
export async function recordDrillAttempt(params: {
  drillType: string;
  isCorrect: boolean;
}): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("gtr_drill_attempts").insert({
    user_id: profile.id,
    drill_type: params.drillType,
    is_correct: params.isCorrect,
  });

  if (error) {
    console.error("[gitara] zapis próby nie powiódł się:", error);
    return actionFailure("Nie udało się zapisać wyniku.");
  }

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GITARA });
  revalidatePath("/gitara/postepy");
  return { ok: true, data: null };
}

const MIN_LOGGED_PRACTICE_SECONDS = 20;

/** Logs a metronome/tuner/free-play practice session for the /gitara/postepy
 * time stat. Sessions shorter than MIN_LOGGED_PRACTICE_SECONDS are dropped
 * silently (still `ok: true`) rather than surfaced as an error — starting
 * and immediately stopping the metronome is not a mistake the student needs
 * to see a message about. */
export async function logPracticeSession(params: {
  kind: "metronom" | "strojenie" | "wolna-gra";
  durationSeconds: number;
  bpm?: number;
}): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  if (params.durationSeconds < MIN_LOGGED_PRACTICE_SECONDS) {
    return { ok: true, data: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gtr_practice_sessions").insert({
    user_id: profile.id,
    kind: params.kind,
    duration_seconds: Math.round(params.durationSeconds),
    bpm: params.bpm ?? null,
  });

  if (error) {
    console.error("[gitara] zapis sesji ćwiczeń nie powiódł się:", error);
    return actionFailure("Nie udało się zapisać sesji ćwiczeń.");
  }

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GITARA });
  revalidatePath("/gitara/postepy");
  return { ok: true, data: null };
}
