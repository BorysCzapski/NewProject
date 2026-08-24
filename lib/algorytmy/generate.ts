// ============================================================================
// lib/algorytmy/generate.ts
// Generates ORIGINAL single-choice exercises for one (dział, typ zadania), so
// a student practising a type never runs out. Called from
// lib/algorytmy/exercise-stock.ts.
//
// Three exercises per call, not one and not twenty. Matma's generator
// documents why big batches fail (the model runs past the completion-token
// budget mid-JSON and Groq rejects the whole tool call, zeroing the batch);
// exercises here are short — a statement, four options, one explanation — so
// three fit comfortably while still amortising the round trip.
//
// Rows are inserted with needs_review = true, matching geo_exercises and
// math_problems: usable immediately, flagged for an admin, because an LLM
// asked for a big-O bound can be confidently wrong in a way the student has no
// way to detect.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSON } from "@/lib/ai";
import type { AlgoTaskTypeDef } from "@/lib/algorytmy/task-types";
import type { AlgoExerciseOption, AlgoTopic } from "@/lib/types/database";

const OPTIONS_PER_EXERCISE = 4;

interface RawExercise {
  statement?: unknown;
  code?: unknown;
  codeLanguage?: unknown;
  options?: unknown;
  correctIndex?: unknown;
  explanation?: unknown;
  difficulty?: unknown;
}

interface RawBatch {
  exercises?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

interface NormalizedExercise {
  statement: string;
  code: string | null;
  codeLanguage: string | null;
  options: AlgoExerciseOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

/**
 * Rejects an exercise outright rather than repairing it. Matura's generator
 * salvages a task by dropping bad sub-items, because a four-item task is still
 * worth doing with three. Here the exercise IS the single question — an
 * exercise whose correct answer cannot be identified is not a smaller
 * exercise, it is a broken one, and showing it would teach the wrong thing.
 */
export function normalizeGeneratedExercise(raw: RawExercise): NormalizedExercise | null {
  const statement = text(raw.statement);
  const explanation = text(raw.explanation);
  if (!statement || !explanation) return null;

  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const optionTexts = rawOptions.map(text).filter((t) => t.length > 0);
  if (optionTexts.length !== OPTIONS_PER_EXERCISE) return null;
  // Duplicate options mean more than one answer is "correct" as far as the
  // student can tell.
  if (new Set(optionTexts).size !== optionTexts.length) return null;

  const correctIndex = raw.correctIndex;
  if (!Number.isInteger(correctIndex)) return null;
  const index = correctIndex as number;
  if (index < 0 || index >= optionTexts.length) return null;

  const options: AlgoExerciseOption[] = optionTexts.map((t, i) => ({ id: `o${i}`, text: t }));

  const difficulty = raw.difficulty;
  const level = difficulty === 1 || difficulty === 2 || difficulty === 3 ? difficulty : 2;

  const code = text(raw.code);
  const codeLanguage = text(raw.codeLanguage);

  return {
    statement,
    code: code || null,
    // A snippet with no language label renders unlabelled rather than wrong.
    codeLanguage: code ? codeLanguage || "python" : null,
    options,
    correctOptionId: options[index].id,
    explanation,
    difficulty: level,
  };
}

/**
 * Generates and inserts up to `count` exercises. Returns how many landed.
 * Never throws — a failed top-up leaves the queue as it was, which every
 * caller already handles.
 *
 * `supabase` must be the STUDENT's client: algo_exercises_insert_own admits a
 * row whose created_by matches the caller (0024_algorytmy.sql), so this needs
 * no service-role key. The row still lands in the shared bank.
 */
export async function generateExercises(params: {
  supabase: SupabaseClient;
  topic: AlgoTopic;
  typeDef: AlgoTaskTypeDef;
  userId: string;
  count: number;
}): Promise<number> {
  const { supabase, topic, typeDef, userId, count } = params;
  if (count <= 0) return 0;

  // Steering away from what the bank already holds — the same anti-duplication
  // move as lib/geografia/generate.ts, which feeds existing statements back
  // into the prompt.
  const { data: existingRows } = await supabase
    .from("algo_exercises")
    .select("statement")
    .eq("topic_id", topic.id)
    .eq("task_type", typeDef.slug)
    .limit(20);
  const existing = ((existingRows ?? []) as Array<{ statement: string }>).map((r) => r.statement);

  let batch: RawBatch;
  try {
    batch = await askAIForJSON<RawBatch>({
      system:
        "Jesteś wykładowcą algorytmiki układającym ORYGINALNE zadania testowe jednokrotnego wyboru. " +
        `Dział: „${topic.title}” (${topic.description}) Typ zadania: „${typeDef.label}”. ` +
        "Zasady wspólne: " +
        "1) Wszystko piszesz PO POLSKU; identyfikatory w kodzie mogą być po angielsku. " +
        `2) Każde zadanie ma DOKŁADNIE ${OPTIONS_PER_EXERCISE} różne opcje i dokładnie jedną poprawną — ` +
        "correctIndex to jej pozycja liczona od zera. " +
        "3) Dystraktory muszą być wynikami realnych pomyłek, nie odpowiedziami odrzucanymi na pierwszy rzut oka. " +
        "4) explanation tłumaczy, DLACZEGO poprawna jest poprawna — nie powtarza jej treści. " +
        "5) Trzymaj się faktów podręcznikowych. Nie wymyślaj nazw algorytmów ani złożoności; jeśli nie jesteś " +
        "pewien wartości, ułóż zadanie o czymś, czego jesteś pewien. " +
        "6) difficulty: 1 (rozgrzewka), 2 (typowe), 3 (wymagające). " +
        `WYMAGANIA TEGO TYPU: ${typeDef.aiBrief}`,
      prompt:
        `Ułóż ${count} nowych zadań typu „${typeDef.label}” z działu „${topic.title}”.` +
        (existing.length > 0
          ? `\n\nNIE powtarzaj tematycznie tych zadań, które już są w banku:\n${existing
              .map((s) => `- ${s.slice(0, 120)}`)
              .join("\n")}`
          : ""),
      schema: {
        exercises: {
          type: "array",
          description: `Zadania — dokładnie ${count}.`,
          items: {
            type: "object",
            properties: {
              statement: { type: "string", description: "Treść pytania PO POLSKU." },
              code: {
                type: "string",
                description:
                  "Fragment kodu pokazywany nad pytaniem. Pomiń, jeśli ten typ zadania kodu nie wymaga.",
              },
              codeLanguage: { type: "string", description: "python albo javascript — tylko gdy jest code." },
              options: {
                type: "array",
                items: { type: "string" },
                description: `Dokładnie ${OPTIONS_PER_EXERCISE} różnych opcji, bez liter A/B/C/D na początku.`,
              },
              correctIndex: { type: "integer", description: "Pozycja poprawnej opcji, liczona od zera." },
              explanation: { type: "string", description: "Uzasadnienie poprawnej odpowiedzi, PO POLSKU." },
              difficulty: { type: "integer", description: "1, 2 albo 3." },
            },
            required: ["statement", "options", "correctIndex", "explanation"],
          },
        },
      },
      maxTokens: 3000,
    });
  } catch (err) {
    console.error(`[algorytmy] generowanie zadań „${typeDef.slug}" nie powiodło się:`, err);
    return 0;
  }

  const rawExercises = Array.isArray(batch.exercises) ? (batch.exercises as RawExercise[]) : [];
  const rows = rawExercises
    .map(normalizeGeneratedExercise)
    .filter((e): e is NormalizedExercise => e !== null)
    .map((e) => ({
      topic_id: topic.id,
      task_type: typeDef.slug,
      statement: e.statement,
      code: e.code,
      code_language: e.codeLanguage,
      options: e.options,
      correct_option_id: e.correctOptionId,
      explanation: e.explanation,
      difficulty: e.difficulty,
      points_max: 1,
      source: "ai_generated" as const,
      needs_review: true,
      created_by: userId,
    }));

  if (rows.length === 0) return 0;

  const { error } = await supabase.from("algo_exercises").insert(rows);
  if (error) {
    console.error("[algorytmy] zapis wygenerowanych zadań nie powiódł się:", error);
    return 0;
  }
  return rows.length;
}
