"use server";

// ============================================================================
// lib/writing/actions.ts
// Server Actions backing the writing module: starting a new task (creating
// it via lib/writing/create-task.ts and redirecting to it), grading a
// submission with AI, and a plain-text follow-up chat reply.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { askAI, askAIForJSON } from "@/lib/ai";
import { createWritingTask } from "@/lib/writing/create-task";
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
}

/**
 * Grades a submitted text with AI, persists it, and records the writing
 * activity. Failures are RETURNED, not thrown — see lib/action-result.ts.
 */
export async function submitWriting(
  taskId: string,
  content: string
): Promise<ActionResult<WritingSubmission>> {
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
        `pasuje do polecenia/kontekstu.`,
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
      },
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

  return { ok: true, data: submission as WritingSubmission };
}

/** Ephemeral follow-up reply to the AI's follow-up question — not persisted anywhere. */
export async function askFollowup(taskId: string, userReply: string): Promise<ActionResult<string>> {
  await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("writing_tasks")
    .select("scenario")
    .eq("id", taskId)
    .single();

  const trimmed = userReply.trim();
  if (!trimmed) return actionFailure("Wpisz odpowiedź przed wysłaniem.");

  try {
    const reply = await askAI({
      system:
        "Jesteś przyjaznym nauczycielem angielskiego prowadzącym krótki dialog po polsku z uczniem, " +
        "który właśnie odpowiedział na Twoje pytanie pogłębiające.",
      prompt:
        `Kontekst zadania pisemnego: "${task?.scenario ?? ""}"\n` +
        `Odpowiedź ucznia na Twoje pytanie pogłębiające: "${trimmed}"\n` +
        "Odpowiedz krótko i zachęcająco po polsku.",
      maxTokens: 300,
    });
    return { ok: true, data: reply };
  } catch (err) {
    console.error("[writing] followup failed:", err);
    return actionFailure("Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie.");
  }
}
