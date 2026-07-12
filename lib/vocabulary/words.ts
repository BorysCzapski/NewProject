// ============================================================================
// lib/vocabulary/words.ts
// Word-selection logic shared by the flashcards and meaning-trainer pages:
// fetching a language- + level-appropriate batch and shuffling it.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TargetLanguage, UserLevel, VocabularyWord } from "@/lib/types/database";
import { shuffle } from "@/lib/vocabulary/word-utils";

/** All vocabulary_words rows for a language + CEFR level, optionally narrowed to one category. */
export async function getWordsForLevel(
  supabase: SupabaseClient,
  language: TargetLanguage,
  level: UserLevel,
  category?: string
): Promise<VocabularyWord[]> {
  let query = supabase
    .from("vocabulary_words")
    .select("*")
    .eq("language", language)
    .eq("level", level);
  if (category) query = query.eq("category", category);
  const { data } = await query;
  return (data as VocabularyWord[]) ?? [];
}

/**
 * Which words a flashcard session draws from:
 * - "all"        — prefer unmastered, fill up with mastered if needed (default)
 * - "unmastered" — ONLY words not yet mastered (status new/learning/no row)
 * - "new"        — ONLY words never practiced (no progress row / status new)
 */
export type FlashcardMode = "all" | "unmastered" | "new";

/**
 * Picks ~`batchSize` words for a flashcards session according to `mode`,
 * prioritizing words the user hasn't mastered yet. Result is shuffled.
 */
export async function getFlashcardBatch(
  supabase: SupabaseClient,
  userId: string,
  language: TargetLanguage,
  level: UserLevel,
  batchSize = 15,
  category?: string,
  mode: FlashcardMode = "all"
): Promise<VocabularyWord[]> {
  const levelWords = await getWordsForLevel(supabase, language, level, category);
  return pickUnmasteredFirst(supabase, userId, levelWords, batchSize, mode);
}

/**
 * Shared selection strategy: prefer words the user hasn't mastered yet
 * (status 'new'/'learning', or no progress row at all); in "all" mode fall
 * back to filling with already-mastered words if too few qualify. Result is
 * shuffled. In "unmastered"/"new" mode an empty result means "nothing left
 * to practice" and the caller shows a congratulations state.
 */
async function pickUnmasteredFirst(
  supabase: SupabaseClient,
  userId: string,
  words: VocabularyWord[],
  batchSize: number,
  mode: FlashcardMode = "all"
): Promise<VocabularyWord[]> {
  if (words.length === 0) return [];

  const wordIds = words.map((w) => w.id);
  const { data: progressRows } = await supabase
    .from("vocabulary_progress")
    .select("word_id, status")
    .eq("user_id", userId)
    .in("word_id", wordIds);

  const statusByWordId = new Map<string, string>();
  for (const row of progressRows ?? []) statusByWordId.set(row.word_id, row.status);

  const isNew = (w: VocabularyWord) => {
    const status = statusByWordId.get(w.id);
    return status === undefined || status === "new";
  };
  const isQualifying = (w: VocabularyWord) => {
    const status = statusByWordId.get(w.id);
    return status === undefined || status === "new" || status === "learning";
  };

  if (mode === "new") return shuffle(words.filter(isNew)).slice(0, batchSize);
  if (mode === "unmastered") return shuffle(words.filter(isQualifying)).slice(0, batchSize);

  const qualifying = words.filter(isQualifying);
  const rest = words.filter((w) => !isQualifying(w));

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

/**
 * Picks a batch of words for the meaning trainer plus a distractor pool.
 * When `category` is set, the quiz batch is limited to that category (e.g.
 * practicing a single ścieżka nauki stage) but distractors are still drawn
 * from the whole level so wrong answers stay plausible even in a small category.
 * Like flashcards, unmastered words come first — otherwise repeated sessions
 * keep re-quizzing words the user already knows and stage progress stalls.
 */
export async function getMeaningTrainerBatch(
  supabase: SupabaseClient,
  userId: string,
  language: TargetLanguage,
  level: UserLevel,
  batchSize = 10,
  category?: string
): Promise<MeaningTrainerData> {
  const [levelPool, categoryPool] = await Promise.all([
    getWordsForLevel(supabase, language, level),
    category ? getWordsForLevel(supabase, language, level, category) : Promise.resolve(null),
  ]);
  const source = categoryPool ?? levelPool;
  const batch = await pickUnmasteredFirst(supabase, userId, source, batchSize);
  return { batch, pool: levelPool };
}

/**
 * A set of vocabulary pairs for the matching game, scoped to language + level
 * (optionally a category). Returns `count` random words with their PL
 * translations. Server-side selection keeps the game honest (answers aren't
 * derivable from the payload order — the client shuffles both columns).
 */
export async function getMatchingPairs(
  supabase: SupabaseClient,
  language: TargetLanguage,
  level: UserLevel,
  count = 6,
  category?: string
): Promise<VocabularyWord[]> {
  const pool = await getWordsForLevel(supabase, language, level, category);
  return shuffle(pool).slice(0, count);
}
