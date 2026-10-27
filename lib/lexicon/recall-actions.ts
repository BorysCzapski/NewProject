"use server";

// ============================================================================
// lib/lexicon/recall-actions.ts
// Server Actions "Treningu fiszek": zapis jednej odpowiedzi (przesuwa pudełko
// Leitnera w lexicon_recall_progress) i zamknięcie sesji (jeden ping aktywności
// na sesję, nie na kartę). Fire-and-forget z klienta, jak
// lib/lexicon/spelling-actions.ts.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { nextVocabReview } from "@/lib/matura/vocab-review";
import { ACTIVITY_TYPES } from "@/lib/constants";

export async function recordRecallAnswer(entryId: string, wasCorrect: boolean): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lexicon_recall_progress")
    .select("box, correct_count, incorrect_count")
    .eq("user_id", profile.id)
    .eq("entry_id", entryId)
    .maybeSingle();

  const outcome = nextVocabReview(existing?.box ?? 0, wasCorrect);

  const { error } = await supabase.from("lexicon_recall_progress").upsert(
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
  if (error) console.error("[lexicon] recordRecallAnswer failed:", error);
}

export async function finishRecallSession(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.VOCABULARY });
  if (error) console.error("[lexicon] finishRecallSession record_activity failed:", error);
  revalidatePath("/jezyki/nauka/trening-fiszki");
  revalidatePath("/jezyki");
}
