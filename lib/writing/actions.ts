"use server";

// ============================================================================
// lib/writing/actions.ts
// Server Actions backing the writing module: starting a new task (creating
// it via lib/writing/create-task.ts and redirecting to it), grading a
// submission with AI, and a structured follow-up chat reply (with
// word-level corrections).
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { createWritingTask } from "@/lib/writing/create-task";
import { normalizeSuggestions, type WritingSuggestion } from "@/lib/writing/hints-core";
import { requireProfile } from "@/lib/auth/get-profile";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { langInfo } from "@/lib/languages";
import { actionFailure, type ActionFailure, type ActionResult } from "@/lib/action-result";
import type { WritingSubmission, WritingTaskType } from "@/lib/types/database";

const ALL_TASK_TYPES: WritingTaskType[] = [
  "comment_reply",
  "message_friend",
  "formal_email",
  "question_answer",
];

/**
 * Creates a new writing task (random type if none given) and redirects to it.
 * Failures are RETURNED, not thrown — see lib/action-result.ts.
 */
export async function startWritingTask(taskType?: WritingTaskType): Promise<ActionFailure> {
  const profile = await requireProfile();
  const type = taskType ?? ALL_TASK_TYPES[Math.floor(Math.random() * ALL_TASK_TYPES.length)];

  let taskId: string;
  try {
    const task = await createWritingTask({
      language: profile.target_language,
      level: profile.level,
      taskType: type,
      // RLS: writing_tasks_insert_own requires created_by = auth.uid() for
      // non-admins — without it the insert is silently rejected.
      createdBy: profile.id,
    });
    taskId = task.id;
  } catch (err) {
    console.error("[writing] createWritingTask failed:", err);
    return actionFailure(
      err instanceof Error && err.message
        ? err.message
        : "Nie udało się przygotować zadania. Spróbuj ponownie za chwilę."
    );
  }
  redirect(`/jezyki/nauka/pisanie/${taskId}`);
}

interface GradedWriting {
  feedback: string;
  correctedVersion: string;
  followupQuestion: string;
  score: number;
  suggestions?: unknown;
}

export interface SubmitWritingResult {
  submission: WritingSubmission;
  /**
   * Opcjonalne "da się ładniej" — NIE są zapisywane w bazie (to tylko dodatek do oceny,
   * bez zmiany schematu), więc po ponownym otwarciu pracy ich nie ma. Często puste.
   */
  suggestions: WritingSuggestion[];
}

/**
 * Grades a submitted text with AI, persists it, and records the writing
 * activity. Failures are RETURNED, not thrown — see lib/action-result.ts.
 */
export async function submitWriting(
  taskId: string,
  content: string
): Promise<ActionResult<SubmitWritingResult>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: task, error: taskError } = await supabase
    .from("writing_tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (taskError || !task) return actionFailure("Nie znaleziono zadania.");

  const trimmed = content.trim();
  if (!trimmed) return actionFailure("Wpisz swoją odpowiedź przed wysłaniem.");

  const info = langInfo(task.language);
  let graded: GradedWriting;
  try {
    graded = await askAIForJSON<GradedWriting>({
      system:
        `Jesteś nauczycielem języka ${info.pl}ego oceniającym krótką pracę pisemną ucznia (nie esej). ` +
        `Odpowiadasz PO POLSKU. Sprawdzasz poprawność gramatyczną, dobór słownictwa i czy treść ` +
        `pasuje do polecenia/kontekstu. ` +
        // Błędy idą do feedback i correctedVersion. suggestions to osobna, OPCJONALNA warstwa:
        // alternatywy dla fragmentów, które są poprawne, ale można je powiedzieć wyraźnie lepiej.
        `Oprócz poprawek błędów możesz w polu suggestions zaproponować lepsze sformułowania, ale ` +
        `tylko gdy to naprawdę się opłaca: fragment ucznia jest poprawny, a Twoja wersja jest ` +
        `wyraźnie bardziej naturalna albo bogatsza. Nie dotykaj zdań, które są dobre; nie ` +
        `przepisuj tekstu według własnego gustu; nie proponuj słownictwa wyraźnie trudniejszego ` +
        `niż poziom ucznia; nie powtarzaj tego, co już poprawiasz jako błąd. Maksymalnie 3 ` +
        `propozycje, a dla dobrego tekstu pusta lista jest właściwą odpowiedzią. W feedback ` +
        `pochwal to, co działa, i wskaż najważniejsze błędy — bez wymuszania uwag.`,
      prompt:
        `Poziom ucznia: ${task.level}.\n` +
        `Polecenie zadania: "${task.scenario}"\n` +
        `Tekst ucznia (w języku ${info.pl}m):\n"""\n${trimmed}\n"""`,
      schema: {
        feedback: { type: "string", description: "konkretne uwagi po polsku" },
        correctedVersion: {
          type: "string",
          description: `poprawiona wersja tekstu ucznia, w języku ${info.pl}m (${info.en})`,
        },
        followupQuestion: {
          type: "string",
          description: "krótkie pytanie pogłębiające po polsku, żeby kontynuować mini-dialog",
        },
        score: { type: "number", description: "0-100" },
        suggestions: {
          type: "array",
          description:
            "opcjonalne, 0-3 propozycje ładniejszego sformułowania poprawnego fragmentu; pusta lista, jeśli nic nie warto zmieniać",
          items: {
            type: "object",
            properties: {
              original: { type: "string", description: "dokładny fragment tekstu ucznia" },
              better: { type: "string", description: `lepsza wersja tego fragmentu, w języku ${info.pl}m` },
              why: { type: "string", description: "jedno krótkie zdanie po polsku: czemu to brzmi lepiej" },
            },
            required: ["original", "better", "why"],
          },
        },
      },
      // Model rozumujący: tokeny rozumowania liczą się do limitu, a odpowiedź jest dłuższa niż dotąd.
      maxTokens: 2500,
    });
  } catch (err) {
    console.error("[writing] AI grading failed:", err);
    return actionFailure("Nie udało się ocenić pracy przez AI. Spróbuj ponownie za chwilę.");
  }

  const { data: submission, error: insertError } = await supabase
    .from("writing_submissions")
    .insert({
      user_id: profile.id,
      task_id: taskId,
      content: trimmed,
      ai_feedback: graded.feedback,
      ai_corrected_version: graded.correctedVersion,
      ai_followup_question: graded.followupQuestion,
      score: graded.score,
    })
    .select()
    .single();
  if (insertError || !submission) {
    console.error("[writing] submission insert failed:", insertError);
    return actionFailure("Nie udało się zapisać pracy.");
  }

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.WRITING });

  return {
    ok: true,
    data: {
      submission: submission as WritingSubmission,
      suggestions: normalizeSuggestions(graded.suggestions),
    },
  };
}

export interface WordCorrection {
  wrong: string;
  correct: string;
  note: string;
}

export interface FollowupReply {
  reply: string;
  corrections: WordCorrection[];
}

/** Ephemeral follow-up reply to the AI's follow-up question — not persisted anywhere. */
export async function askFollowup(
  taskId: string,
  userReply: string
): Promise<ActionResult<FollowupReply>> {
  await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("writing_tasks")
    .select("scenario, language")
    .eq("id", taskId)
    .single();

  const trimmed = userReply.trim();
  if (!trimmed) return actionFailure("Wpisz odpowiedź przed wysłaniem.");

  const info = langInfo(task?.language ?? "en");

  try {
    const result = await askAIForJSON<FollowupReply>({
      system:
        `Jesteś przyjaznym nauczycielem języka ${info.pl}ego prowadzącym krótki dialog po polsku z ` +
        `uczniem, który właśnie odpowiedział (w języku ${info.pl}m) na Twoje pytanie pogłębiające. ` +
        `Oprócz odpowiedzi w dialogu sprawdzasz też, czy w tekście ucznia są błędne słowa lub ` +
        `wyrażenia w języku ${info.pl}m (błędy gramatyczne, ortograficzne lub złe dobory słów).`,
      prompt:
        `Kontekst zadania pisemnego: "${task?.scenario ?? ""}"\n` +
        `Odpowiedź ucznia na Twoje pytanie pogłębiające (w języku ${info.pl}m): "${trimmed}"\n` +
        "Odpowiedz krótko i zachęcająco po polsku, kontynuując dialog.",
      schema: {
        reply: { type: "string", description: "krótka, zachęcająca odpowiedź po polsku kontynuująca dialog" },
        corrections: {
          type: "array",
          description:
            "błędne słowa/wyrażenia z odpowiedzi ucznia (pusta lista, jeśli odpowiedź nie zawiera błędów)",
          items: {
            type: "object",
            properties: {
              wrong: { type: "string", description: "błędne słowo lub wyrażenie użyte przez ucznia" },
              correct: { type: "string", description: "poprawna forma" },
              note: { type: "string", description: "krótkie wyjaśnienie błędu po polsku" },
            },
            required: ["wrong", "correct", "note"],
          },
        },
      },
      maxTokens: 500,
    });
    return { ok: true, data: { reply: result.reply, corrections: result.corrections ?? [] } };
  } catch (err) {
    console.error("[writing] followup failed:", err);
    return actionFailure("Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie.");
  }
}
