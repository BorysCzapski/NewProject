"use server";

// ============================================================================
// lib/reading/actions.ts
// Server Actions backing the reading module: generating a fresh AI article
// with comprehension questions, and grading a submitted attempt (multiple
// choice locally, open questions via a single batched AI call).
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { askAIForJSON } from "@/lib/ai";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { langInfo } from "@/lib/languages";
import type { ReadingQuestion, UserLevel } from "@/lib/types/database";

const LEVEL_SPECS: Record<UserLevel, string> = {
  A1: "60-100 słów, tylko podstawowe czasy, bardzo podstawowe słownictwo",
  A2: "100-150 słów, czasy przeszłe i teraźniejsze, słownictwo codzienne",
  B1: "150-250 słów, szerszy zakres czasów gramatycznych, umiarkowanie zróżnicowane słownictwo",
  B2: "250-400 słów, złożone zdania podrzędne, trochę słownictwa idiomatycznego",
};

interface GeneratedQuestion {
  type: "multiple_choice" | "open";
  question: string;
  options?: string[];
  correct_answer?: string;
}

interface GeneratedArticle {
  title: string;
  content: string;
  questions: GeneratedQuestion[];
}

/** Generates a new AI reading text + questions for `topic` and redirects to it. */
export async function generateReadingText(topic: string): Promise<void> {
  const profile = await requireProfile();
  const info = langInfo(profile.target_language);

  let result: GeneratedArticle;
  try {
    result = await askAIForJSON<GeneratedArticle>({
      system:
        `Jesteś nauczycielem języka ${info.pl}ego tworzącym oryginalne, krótkie artykuły do czytania dla ` +
        `Polaków, ściśle dopasowane do poziomu CEFR ucznia. Artykuł musi być całkowicie oryginalny ` +
        `i napisany W JĘZYKU ${info.pl.toUpperCase()}M (${info.en}). Dołącz 3-5 pytań sprawdzających ` +
        `zrozumienie tekstu: część typu "multiple_choice" (dokładnie 4 opcje, correct_answer musi ` +
        `być identyczny jak jedna z opcji) i co najmniej jedno pytanie typu "open" (bez opcji i bez ` +
        `correct_answer — zostanie ocenione później przez AI). Pytania i opcje pisz w języku ${info.pl}m, ` +
        `tak jak sam tekst.`,
      prompt:
        `Napisz krótki artykuł w języku ${info.pl}m na temat: "${topic}", dla poziomu ${profile.level} ` +
        `(CEFR): ${LEVEL_SPECS[profile.level]}. Dodaj tytuł oraz 3-5 pytań sprawdzających ` +
        `zrozumienie tekstu.`,
      schema: {
        title: { type: "string" },
        content: { type: "string" },
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["multiple_choice", "open"] },
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct_answer: { type: "string" },
            },
            required: ["type", "question"],
          },
        },
      },
      maxTokens: 2048,
    });
  } catch {
    throw new Error("Nie udało się wygenerować tekstu, spróbuj ponownie.");
  }

  const supabase = await createClient();
  const { data: textRow, error: textError } = await supabase
    .from("reading_texts")
    .insert({
      user_id: profile.id,
      language: profile.target_language,
      level: profile.level,
      topic,
      title: result.title,
      content: result.content,
    })
    .select()
    .single();

  if (textError || !textRow) {
    throw new Error("Nie udało się zapisać tekstu.");
  }

  // The AI's structured output isn't schema-enforced for conditional fields (the
  // tool schema can't require options/correct_answer only when type=multiple_choice),
  // so a malformed multiple_choice question (missing options, or a correct_answer
  // that isn't literally one of them) would otherwise permanently block the student
  // from finishing — downgrade it to an "open" question instead of trusting it blindly.
  const questionRows = (result.questions ?? []).map((q, index) => {
    const isValidMultipleChoice =
      q.type === "multiple_choice" &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      !!q.correct_answer &&
      q.options.includes(q.correct_answer);

    return {
      text_id: textRow.id,
      type: isValidMultipleChoice ? "multiple_choice" : "open",
      question: q.question,
      options: isValidMultipleChoice ? q.options! : null,
      correct_answer: isValidMultipleChoice ? q.correct_answer! : null,
      order_index: index,
    };
  });

  if (questionRows.length > 0) {
    const { error: qError } = await supabase.from("reading_questions").insert(questionRows);
    if (qError) {
      throw new Error("Nie udało się zapisać pytań.");
    }
  }

  redirect(`/jezyki/nauka/czytanie/${textRow.id}`);
}

export interface ReadingQuestionResult {
  isCorrect: boolean;
  feedback: string | null;
}

export interface ReadingAttemptResult {
  score: number;
  results: Record<string, ReadingQuestionResult>;
}

/**
 * Grades one reading attempt: multiple-choice questions locally, all open
 * questions in a single batched AI call, then persists reading_attempts and
 * records the "reading" activity.
 */
export async function submitReadingAttempt(
  textId: string,
  answers: Record<string, string>
): Promise<ReadingAttemptResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Musisz być zalogowany.");

  const { data: text } = await supabase
    .from("reading_texts")
    .select("*")
    .eq("id", textId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!text) throw new Error("Nie znaleziono tekstu.");

  const { data: questions } = await supabase
    .from("reading_questions")
    .select("*")
    .eq("text_id", textId)
    .order("order_index");
  const questionList = (questions ?? []) as ReadingQuestion[];
  if (questionList.length === 0) throw new Error("Ten tekst nie ma pytań.");

  const openQuestions = questionList.filter((q) => q.type === "open");
  let openResults: Record<string, { isCorrect: boolean; feedback: string }> = {};

  if (openQuestions.length > 0) {
    const schemaProps: Record<string, unknown> = {};
    for (const q of openQuestions) {
      schemaProps[q.id] = {
        type: "object",
        properties: {
          isCorrect: { type: "boolean" },
          feedback: { type: "string", description: "krótki komentarz po polsku" },
        },
        required: ["isCorrect", "feedback"],
      };
    }

    const answersBlock = openQuestions
      .map(
        (q, i) =>
          `${i + 1}. (id: ${q.id}) ${q.question}\nOdpowiedź ucznia: ${
            answers[q.id]?.trim() || "(brak odpowiedzi)"
          }`
      )
      .join("\n\n");

    try {
      openResults = await askAIForJSON<Record<string, { isCorrect: boolean; feedback: string }>>({
        system:
          "Oceniasz odpowiedzi ucznia na pytania otwarte dotyczące przeczytanego przez niego " +
          "obcojęzycznego tekstu. Odpowiadasz PO POLSKU, krótko i konkretnie wskazując błędy lub " +
          "potwierdzając poprawność.",
        prompt:
          `Tekst przeczytany przez ucznia:\n"""\n${text.content}\n"""\n\n` +
          "Oceń poniższe odpowiedzi ucznia na pytania otwarte. Dla każdego pytania (klucz = jego " +
          "id) podaj isCorrect (czy odpowiedź jest merytorycznie poprawna) i feedback (krótki " +
          `komentarz po polsku):\n\n${answersBlock}`,
        schema: schemaProps,
        maxTokens: 2048,
      });
    } catch {
      throw new Error("Nie udało się ocenić odpowiedzi. Spróbuj ponownie.");
    }
  }

  let correctCount = 0;
  const results: Record<string, ReadingQuestionResult> = {};
  for (const q of questionList) {
    if (q.type === "multiple_choice") {
      const isCorrect = answers[q.id] === q.correct_answer;
      if (isCorrect) correctCount++;
      results[q.id] = { isCorrect, feedback: null };
    } else {
      const r = openResults[q.id];
      const isCorrect = r?.isCorrect ?? false;
      if (isCorrect) correctCount++;
      results[q.id] = { isCorrect, feedback: r?.feedback ?? "Brak oceny AI." };
    }
  }

  const score = Math.round((correctCount / questionList.length) * 100);

  const { error: insertError } = await supabase.from("reading_attempts").insert({
    user_id: user.id,
    text_id: textId,
    answers,
    score,
    feedback: JSON.stringify(results),
  });
  if (insertError) throw new Error("Nie udało się zapisać wyniku.");

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.READING });

  return { score, results };
}
