"use server";

// ============================================================================
// lib/lexicon/actions.ts
// Server Actions for the daily lexicon: record one answer (advances the Leitner
// box) and close a session (one activity ping per sitting, not per card).
// Fire-and-forget from the client, like lib/matura/vocab-actions.ts.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { nextVocabReview } from "@/lib/matura/vocab-review";
import { ACTIVITY_TYPES } from "@/lib/constants";

export async function recordLexiconAnswer(entryId: string, wasCorrect: boolean): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lexicon_progress")
    .select("box, correct_count, incorrect_count")
    .eq("user_id", profile.id)
    .eq("entry_id", entryId)
    .maybeSingle();

  const outcome = nextVocabReview(existing?.box ?? 0, wasCorrect);

  const { error } = await supabase.from("lexicon_progress").upsert(
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
  if (error) console.error("[lexicon] recordLexiconAnswer failed:", error);
}

export async function finishLexiconSession(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.VOCABULARY });
  if (error) console.error("[lexicon] finishLexiconSession record_activity failed:", error);
  revalidatePath("/jezyki/nauka/codzienne");
  revalidatePath("/jezyki");
}
