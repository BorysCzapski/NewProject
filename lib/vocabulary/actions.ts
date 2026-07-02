"use server";

// ============================================================================
// lib/vocabulary/actions.ts
// Server Actions backing the flashcards and meaning-trainer client
// components: recording a single word review and closing out a session.
// ============================================================================
import { createClient } from "@/lib/supabase/server";
import { upsertVocabularyProgress } from "@/lib/vocabulary/progress";

/** Records the result of reviewing one word (flashcards or meaning trainer). */
export async function recordVocabularyAnswer(wordId: string, wasCorrect: boolean): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await upsertVocabularyProgress(supabase, user.id, wordId, wasCorrect);
}

/** Marks a completed flashcards session (10+ cards reviewed) for streaks/homework. */
export async function finishFlashcardSession(): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: "flashcards" });
}

/** Marks a completed meaning-trainer session (10 questions answered) for streaks/homework. */
export async function finishMeaningSession(): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: "vocabulary" });
}
