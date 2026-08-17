"use server";

// ============================================================================
// lib/textbook/actions.ts
// Server Actions backing the "Podręcznik" module: recording a word review
// (flashcards + fill-blank exercises share this — same as the global
// vocabulary module's recordVocabularyAnswer serving both fiszki and
// słówka), marking session/topic completion for streaks, and deleting a
// textbook the student no longer wants.
// ============================================================================
import { createClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionFailure } from "@/lib/action-result";
import type { MasteryStatus } from "@/lib/types/database";

/**
 * Records one review of a (possibly shared) textbook word: increments
 * correct/incorrect counts and recomputes mastery_status in
 * textbook_word_progress, keyed by (current user, word) — a textbook can be
 * studied by many students, so progress can't live on the word row itself.
 * Same "2 net-correct -> mastered" rule as lib/vocabulary/progress.ts, for
 * consistent UX.
 */
export async function recordTextbookWordAnswer(wordId: string, wasCorrect: boolean): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Musisz być zalogowany.");

  const { data: existing } = await supabase
    .from("textbook_word_progress")
    .select("correct_count, incorrect_count")
    .eq("user_id", user.id)
    .eq("word_id", wordId)
    .maybeSingle();

  const correctCount = (existing?.correct_count ?? 0) + (wasCorrect ? 1 : 0);
  const incorrectCount = (existing?.incorrect_count ?? 0) + (wasCorrect ? 0 : 1);
  const status: MasteryStatus =
    correctCount - incorrectCount >= 2 ? "mastered" : correctCount + incorrectCount > 0 ? "learning" : "new";

  await supabase.from("textbook_word_progress").upsert(
    {
      user_id: user.id,
      word_id: wordId,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      mastery_status: status,
    },
    { onConflict: "user_id,word_id" }
  );
}

/** Marks a completed fill-blank exercise session for streaks/homework. */
export async function finishTextbookWordExerciseSession(): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.VOCABULARY });
}

/** No-op passed as GrammarExerciseStepper's onAttempt for textbook topics:
 * unlike the global grammar module, individual attempts aren't logged (not
 * needed for a private upload) — only completeTextbookGrammarTopic below
 * records anything. A Server Component can't pass a plain closure as a
 * Client Component prop, so this has to be a real exported action. */
export async function noopTextbookGrammarAttempt(): Promise<void> {}

/** Marks one meaningful grammar activity (a fully-answered textbook grammar
 * topic) for streaks/calendar — same activity type as the global grammar
 * module, no separate per-attempt log (not needed for a textbook-derived topic). */
export async function completeTextbookGrammarTopic(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GRAMMAR });
  if (error) throw new Error("Nie udało się zapisać postępu.");
}

/** Deletes a textbook and (via ON DELETE CASCADE) its units/words/grammar. */
export async function deleteTextbook(textbookId: string): Promise<ActionFailure | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionFailure("Musisz być zalogowany.");

  const { error } = await supabase.from("textbooks").delete().eq("id", textbookId).eq("user_id", user.id);
  if (error) {
    console.error("[textbook] delete failed:", error);
    return actionFailure("Nie udało się usunąć podręcznika.");
  }
}
