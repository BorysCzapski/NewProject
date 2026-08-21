"use server";

// ============================================================================
// lib/matura/vocab-actions.ts
// Server Actions for the matura vocabulary bank: recording one review (which
// advances the Leitner box) and marking a theory lesson as worked through.
//
// Both are deliberately fire-and-forget from the client's point of view — a
// dropped review costs the student one scheduling step, and blocking the drill
// on a round-trip per card would make it unusable on a phone.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { nextVocabReview } from "@/lib/matura/vocab-review";
import { ACTIVITY_TYPES } from "@/lib/constants";

/** Records one flashcard/drill answer and reschedules the entry. */
export async function recordVocabAnswer(entryId: string, wasCorrect: boolean): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("matura_vocab_progress")
    .select("box, correct_count, incorrect_count")
    .eq("user_id", profile.id)
    .eq("entry_id", entryId)
    .maybeSingle();

  const outcome = nextVocabReview(existing?.box ?? 0, wasCorrect);

  const { error } = await supabase.from("matura_vocab_progress").upsert(
    {
      user_id: profile.id,
      entry_id: entryId,
      box: outcome.box,
      status: outcome.status,
      correct_count: (existing?.correct_count ?? 0) + (wasCorrect ? 1 : 0),
      incorrect_count: (existing?.incorrect_count ?? 0) + (wasCorrect ? 0 : 1),
      last_reviewed_at: new Date().toISOString(),
      next_review_at: outcome.nextReviewAt,
    },
    { onConflict: "user_id,entry_id" }
  );
  if (error) console.error("[matura] recordVocabAnswer failed:", error);
}

/** Called once when a drill session ends — one activity ping per session, not
 * per card, so the streak counter reflects sittings rather than taps. */
export async function finishVocabSession(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
  if (error) console.error("[matura] finishVocabSession record_activity failed:", error);
  revalidatePath("/matura/slownictwo");
  revalidatePath("/matura");
}

/** Marks a theory lesson as worked through. Idempotent: re-reading a lesson
 * must not create a second row or move the original completion date. */
export async function markLessonComplete(lessonId: string): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("matura_lesson_progress")
    .upsert(
      { user_id: profile.id, lesson_id: lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
    );
  if (error) {
    console.error("[matura] markLessonComplete failed:", error);
    return;
  }

  const { error: activityError } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
  if (activityError) console.error("[matura] markLessonComplete record_activity failed:", activityError);

  revalidatePath("/matura/nauka");
}
