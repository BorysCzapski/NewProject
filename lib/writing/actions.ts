"use server";

// ============================================================================
// lib/writing/actions.ts
// Server Actions backing the writing module: starting a new task (creating
// it via lib/writing/create-task.ts and redirecting to it), grading a
// submission with Claude, and a plain-text follow-up chat reply.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { askClaude, askClaudeForJSON } from "@/lib/anthropic";
import { createWritingTask } from "@/lib/writing/create-task";
import { requireProfile } from "@/lib/auth/get-profile";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { WritingSubmission, WritingTaskType } from "@/lib/types/database";

const ALL_TASK_TYPES: WritingTaskType[] = [
  "comment_reply",
  "message_friend",
  "formal_email",
  "question_answer",
];

/** Creates a new writing task (random type if none given) and redirects to it. */
export async function startWritingTask(taskType?: WritingTaskType): Promise<never> {
  const profile = await requireProfile();
  const type = taskType ?? ALL_TASK_TYPES[Math.floor(Math.random() * ALL_TASK_TYPES.length)];

  const task = await createWritingTask({ level: profile.level, taskType: type });
  redirect(`/nauka/pisanie/${task.id}`);
}

interface GradedWriting {
  feedback: string;
  correctedVersion: string;
  followupQuestion: string;
  score: number;
}

/** Grades a submitted text with Claude, persists it, and records the writing activity. */
export async function submitWriting(taskId: string, content: string): Promise<WritingSubmission> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: task, error: taskError } = await supabase
    .from("writing_tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (taskError || !task) throw new Error("Nie znaleziono zadania.");

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Wpisz swoją odpowiedź przed wysłaniem.");

  let graded: GradedWriting;
  try {
    graded = await askClaudeForJSON<GradedWriting>({
      system:
        "Jesteś nauczycielem angielskiego oceniającym krótką pracę pisemną ucznia (nie esej). " +
        "Odpowiadasz PO POLSKU. Sprawdzasz poprawność gramatyczną, dobór słownictwa i czy treść " +
        "pasuje do polecenia/kontekstu.",
      prompt:
        `Poziom ucznia: ${task.level}.\n` +
        `Polecenie zadania: "${task.scenario}"\n` +
        `Tekst ucznia:\n"""\n${trimmed}\n"""`,
      schema: {
        feedback: { type: "string", description: "konkretne uwagi po polsku" },
        correctedVersion: { type: "string", description: "poprawiona wersja tekstu ucznia, po angielsku" },
        followupQuestion: {
          type: "string",
          description: "krótkie pytanie pogłębiające po polsku, żeby kontynuować mini-dialog",
        },
        score: { type: "number", description: "0-100" },
      },
    });
  } catch {
    throw new Error("Nie udało się ocenić pracy przez AI. Spróbuj ponownie.");
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
  if (insertError || !submission) throw new Error("Nie udało się zapisać pracy.");

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.WRITING });

  return submission as WritingSubmission;
}

/** Ephemeral follow-up reply to the AI's follow-up question — not persisted anywhere. */
export async function askFollowup(taskId: string, userReply: string): Promise<string> {
  await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("writing_tasks")
    .select("scenario")
    .eq("id", taskId)
    .single();

  const trimmed = userReply.trim();
  if (!trimmed) throw new Error("Wpisz odpowiedź przed wysłaniem.");

  try {
    return await askClaude({
      system:
        "Jesteś przyjaznym nauczycielem angielskiego prowadzącym krótki dialog po polsku z uczniem, " +
        "który właśnie odpowiedział na Twoje pytanie pogłębiające.",
      prompt:
        `Kontekst zadania pisemnego: "${task?.scenario ?? ""}"\n` +
        `Odpowiedź ucznia na Twoje pytanie pogłębiające: "${trimmed}"\n` +
        "Odpowiedz krótko i zachęcająco po polsku.",
      maxTokens: 300,
    });
  } catch {
    throw new Error("Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie.");
  }
}
