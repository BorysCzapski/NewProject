// ============================================================================
// lib/vocabulary/progress.ts
// Shared mastery-tracking helper used by both the flashcards trainer and the
// meaning trainer, so the two modules can never disagree on how progress is
// scored.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MasteryStatus } from "@/lib/types/database";

/**
 * Records one review of `wordId` for `userId`: increments correct/incorrect
 * counts (creating the progress row if it doesn't exist yet) and recomputes
 * `status` from the resulting totals.
 */
export async function upsertVocabularyProgress(
  supabase: SupabaseClient,
  userId: string,
  wordId: string,
  wasCorrect: boolean
): Promise<void> {
  const { data: existing } = await supabase
    .from("vocabulary_progress")
    .select("correct_count, incorrect_count")
    .eq("user_id", userId)
    .eq("word_id", wordId)
    .maybeSingle();

  const correctCount = (existing?.correct_count ?? 0) + (wasCorrect ? 1 : 0);
  const incorrectCount = (existing?.incorrect_count ?? 0) + (wasCorrect ? 0 : 1);

  // A word counts as mastered after 2 net-correct reviews (correct answers
  // minus mistakes). The previous threshold of 3 made stage progress on the
  // learning path crawl: ~15 words x 3 net hits before a stage unlocked.
  const status: MasteryStatus =
    correctCount - incorrectCount >= 2
      ? "mastered"
      : correctCount + incorrectCount > 0
        ? "learning"
        : "new";

  const now = new Date().toISOString();

  await supabase.from("vocabulary_progress").upsert(
    {
      user_id: userId,
      word_id: wordId,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      status,
      last_reviewed_at: now,
    },
    { onConflict: "user_id,word_id" }
  );
}
