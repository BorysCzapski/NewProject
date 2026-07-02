// ============================================================================
// lib/vocabulary/words.ts
// Word-selection logic shared by the flashcards and meaning-trainer pages:
// fetching a level-appropriate batch and shuffling it.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserLevel, VocabularyWord } from "@/lib/types/database";
import { shuffle } from "@/lib/vocabulary/word-utils";

/** All vocabulary_words rows for a given CEFR level. */
export async function getWordsForLevel(
  supabase: SupabaseClient,
  level: UserLevel
): Promise<VocabularyWord[]> {
  const { data } = await supabase
    .from("vocabulary_words")
    .select("*")
    .eq("level", level);
  return (data as VocabularyWord[]) ?? [];
}

/**
 * Picks ~`batchSize` words for a flashcards session, prioritizing words the
 * user hasn't mastered yet (status 'new'/'learning', or no progress row at
 * all). Falls back to filling with already-mastered words of the same level
 * if too few qualify. Result is shuffled.
 */
export async function getFlashcardBatch(
  supabase: SupabaseClient,
  userId: string,
  level: UserLevel,
  batchSize = 15
): Promise<VocabularyWord[]> {
  const levelWords = await getWordsForLevel(supabase, level);
  if (levelWords.length === 0) return [];

  const wordIds = levelWords.map((w) => w.id);
  const { data: progressRows } = await supabase
    .from("vocabulary_progress")
    .select("word_id, status")
    .eq("user_id", userId)
    .in("word_id", wordIds);

  const statusByWordId = new Map<string, string>();
  for (const row of progressRows ?? []) statusByWordId.set(row.word_id, row.status);

  const isQualifying = (w: VocabularyWord) => {
    const status = statusByWordId.get(w.id);
    return status === undefined || status === "new" || status === "learning";
  };
  const qualifying = levelWords.filter(isQualifying);
  const rest = levelWords.filter((w) => !isQualifying(w));

  const selected =
    qualifying.length >= batchSize
      ? qualifying
      : [...qualifying, ...rest].slice(0, batchSize);

  return shuffle(selected).slice(0, batchSize);
}

export interface MeaningTrainerData {
  batch: VocabularyWord[];
  pool: VocabularyWord[]; // full level word list, used to source distractors
}

/** Picks a batch of words for the meaning trainer plus the full-level pool for distractors. */
export async function getMeaningTrainerBatch(
  supabase: SupabaseClient,
  level: UserLevel,
  batchSize = 10
): Promise<MeaningTrainerData> {
  const pool = await getWordsForLevel(supabase, level);
  const batch = shuffle(pool).slice(0, batchSize);
  return { batch, pool };
}
