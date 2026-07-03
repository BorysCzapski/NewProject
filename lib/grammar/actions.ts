"use server";

// ============================================================================
// lib/grammar/actions.ts
// Server Actions backing the grammar module: persisting an attempt, grading
// AI-checked "transformation" exercises, and marking a topic's completion
// (which drives streaks/calendar via record_activity).
// ============================================================================
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { ACTIVITY_TYPES } from "@/lib/constants";

/** Inserts one grammar_progress row for the current user. */
export async function recordGrammarAttempt(params: {
  topicId: string;
  exerciseId: string;
  isCorrect: boolean;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Musisz być zalogowany.");

  const { error } = await supabase.from("grammar_progress").insert({
    user_id: user.id,
    topic_id: params.topicId,
    exercise_id: params.exerciseId,
    is_correct: params.isCorrect,
  });
  if (error) throw new Error("Nie udało się zapisać odpowiedzi.");
}

/** Asks the AI to grade a free-form "transformation" answer against the reference. */
export async function gradeTransformation(params: {
  prompt: string;
  referenceAnswer: string;
  studentAnswer: string;
}): Promise<{ isCorrect: boolean; feedback: string }> {
  try {
    return await askAIForJSON<{ isCorrect: boolean; feedback: string }>({
      system:
        "Jesteś nauczycielem angielskiego. Oceniasz, czy przekształcone zdanie ucznia jest " +
        "gramatycznie poprawne i zachowuje sens/strukturę wymaganą przez polecenie, porównując " +
        "je do przykładowej poprawnej odpowiedzi. Bądź wyrozumiały dla drobnych różnic " +
        "stylistycznych, ale wymagaj poprawnej struktury gramatycznej. Odpowiadasz PO POLSKU.",
      prompt:
        `Polecenie ćwiczenia: "${params.prompt}"\n` +
        `Przykładowa poprawna odpowiedź: "${params.referenceAnswer}"\n` +
        `Odpowiedź ucznia: "${params.studentAnswer}"`,
      schema: {
        isCorrect: { type: "boolean" },
        feedback: { type: "string", description: "krótka informacja zwrotna po polsku" },
      },
    });
  } catch {
    throw new Error("Nie udało się ocenić odpowiedzi. Spróbuj ponownie.");
  }
}

/** Marks one meaningful grammar activity (a fully-answered topic) for streaks/calendar. */
export async function completeGrammarTopic(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.GRAMMAR });
  if (error) throw new Error("Nie udało się zapisać postępu.");
}
