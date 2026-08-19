"use server";

// ============================================================================
// lib/matura/vocabulary-actions.ts
// Server Action backing FlashcardTrainer for Matura vocabulary words —
// mirrors lib/vocabulary/actions.ts, passed in via FlashcardTrainer's
// onAnswer override prop (same pattern the Podręcznik feature already uses
// for its own textbook_words — see app/(main)/jezyki/nauka/podrecznik/[id]/
// dzial/[unitId]/fiszki/page.tsx). FlashcardTrainer has no session-finish
// override (only per-card onAnswer), so record_activity is called here on
// every card instead of once at session end — safe, since record_activity
// only advances the streak once per calendar day regardless of call count.
// ============================================================================
import { createClient } from "@/lib/supabase/server";
import { upsertMaturaVocabularyProgress } from "@/lib/matura/vocabulary-progress";
import { ACTIVITY_TYPES } from "@/lib/constants";

/** Records the result of reviewing one word (flashcards). */
export async function recordMaturaVocabularyAnswer(wordId: string, wasCorrect: boolean): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await upsertMaturaVocabularyProgress(supabase, user.id, wordId, wasCorrect);
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
}
