"use server";

// ============================================================================
// lib/matura/grammar-actions.ts
// Server Actions backing GrammarExerciseStepper for Matura grammar topics —
// mirrors lib/grammar/actions.ts exactly (same shape), writing to
// matura_grammar_progress instead of grammar_progress. Passed to
// GrammarExerciseStepper via its onAttempt/onComplete override props.
// ============================================================================
import { createClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPES } from "@/lib/constants";

/** Inserts one matura_grammar_progress row for the current user. */
export async function recordMaturaGrammarAttempt(params: {
  topicId: string;
  exerciseId: string;
  isCorrect: boolean;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Musisz być zalogowany.");

  const { error } = await supabase.from("matura_grammar_progress").insert({
    user_id: user.id,
    topic_id: params.topicId,
    exercise_id: params.exerciseId,
    is_correct: params.isCorrect,
  });
  if (error) throw new Error("Nie udało się zapisać odpowiedzi.");
}

/** Marks one meaningful grammar activity (a fully-answered topic) for streaks/calendar. */
export async function completeMaturaGrammarTopic(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATURA });
  if (error) throw new Error("Nie udało się zapisać postępu.");
}
