// ============================================================================
// lib/matura/vocabulary-progress.ts
// Mirrors lib/vocabulary/progress.ts exactly, writing to
// matura_vocabulary_progress instead — same mastery math (2 net-correct
// reviews = mastered), so the two modules can't silently drift apart.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MasteryStatus } from "@/lib/types/database";

export async function upsertMaturaVocabularyProgress(
  supabase: SupabaseClient,
  userId: string,
  wordId: string,
  wasCorrect: boolean
): Promise<void> {
  const { data: existing } = await supabase
    .from("matura_vocabulary_progress")
    .select("correct_count, incorrect_count")
    .eq("user_id", userId)
    .eq("word_id", wordId)
    .maybeSingle();

  const correctCount = (existing?.correct_count ?? 0) + (wasCorrect ? 1 : 0);
  const incorrectCount = (existing?.incorrect_count ?? 0) + (wasCorrect ? 0 : 1);

  const status: MasteryStatus =
    correctCount - incorrectCount >= 2
      ? "mastered"
      : correctCount + incorrectCount > 0
        ? "learning"
        : "new";

  await supabase.from("matura_vocabulary_progress").upsert(
    {
      user_id: userId,
      word_id: wordId,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      status,
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,word_id" }
  );
}
