// ============================================================================
// lib/matura/writing-stock.ts
// The wypowiedź-pisemna half of lib/matura/task-stock.ts: per-form counters,
// picking the next prompt, and generating new ones so a form never runs dry.
//
// Writing keeps its own file because its unit of work is a different shape —
// one free-text response graded holistically against the CKE rubric, stored in
// matura_writing_tasks/matura_writing_submissions rather than
// matura_tasks/matura_task_attempts (see the header of 0014_matura_writing.sql
// for why those tables were never merged). The QUEUE semantics are identical,
// so the two files deliberately mirror each other's shape.
//
// A generated prompt must ship with a model_answer: the student sees it after
// submitting, and a prompt without one silently degrades the review screen.
// That is why a reply missing the model answer is rejected outright here,
// unlike the sub-item tolerance in lib/matura/generate-tasks.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSON } from "@/lib/ai";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MATURA_LANGUAGE_LABELS,
  MATURA_WRITING_MAX_POINTS,
  MATURA_WRITING_WORD_RANGE,
} from "@/lib/matura/constants";
import { MATURA_TOPIC_AREAS } from "@/lib/matura/generate-tasks";
import { writingTypesFor, type MaturaWritingTypeDef } from "@/lib/matura/task-types";
import type { MaturaLanguage, MaturaLevel, MaturaWritingFormType } from "@/lib/types/database";

const STOCK_TARGET = 3;
const TOP_UP_BATCH = 2;

/** CKE gives four podpunkty at poziom podstawowy; the rozszerzony tekst
 * argumentacyjny is modeled with two, matching how rozprawka's for/against
 * split was already stored (0014_matura_writing.sql). */
function contentPointCount(level: MaturaLevel): number {
  return level === "podstawowa" ? 4 : 2;
}

export interface MaturaWritingTypeStats {
  typeDef: MaturaWritingTypeDef;
  completedCount: number;
  lastPoints: number | null;
  lastMaxPoints: number | null;
  averagePercent: number | null;
  freshAvailable: number;
}

interface SubmissionRow {
  task_id: string;
  points_awarded: number;
  max_points: number;
  created_at: string;
  matura_writing_tasks: { form_type: string } | null;
}

export async function getWritingTypeStats(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string,
  level: MaturaLevel
): Promise<MaturaWritingTypeStats[]> {
  const types = writingTypesFor(level);
  if (types.length === 0) return [];

  const [{ data: submissionRows }, { data: taskRows }] = await Promise.all([
    supabase
      .from("matura_writing_submissions")
      .select(
        "task_id, points_awarded, max_points, created_at, matura_writing_tasks!inner(form_type, section_id)"
      )
      .eq("user_id", userId)
      .eq("matura_writing_tasks.section_id", sectionId)
      .order("created_at", { ascending: false }),
    supabase.from("matura_writing_tasks").select("id, form_type").eq("section_id", sectionId),
  ]);

  const submissions = (submissionRows ?? []) as unknown as SubmissionRow[];
  const tasks = (taskRows ?? []) as Array<{ id: string; form_type: string }>;
  const attemptedTaskIds = new Set(submissions.map((s) => s.task_id));

  return types.map((typeDef) => {
    const own = submissions.filter((s) => s.matura_writing_tasks?.form_type === typeDef.formType);
    const totalAwarded = own.reduce((sum, s) => sum + Number(s.points_awarded), 0);
    const totalMax = own.reduce((sum, s) => sum + Number(s.max_points), 0);

    return {
      typeDef,
      completedCount: own.length,
      lastPoints: own.length > 0 ? Number(own[0].points_awarded) : null,
      lastMaxPoints: own.length > 0 ? Number(own[0].max_points) : null,
      averagePercent: totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : null,
      freshAvailable: tasks.filter(
        (t) => t.form_type === typeDef.formType && !attemptedTaskIds.has(t.id)
      ).length,
    };
  });
}

async function splitByFreshness(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string,
  formType: MaturaWritingFormType
): Promise<{ fresh: string[]; seen: Array<{ id: string; createdAt: string }> }> {
  const { data: taskRows } = await supabase
    .from("matura_writing_tasks")
    .select("id")
    .eq("section_id", sectionId)
    .eq("form_type", formType);

  const ids = (taskRows ?? []).map((t) => (t as { id: string }).id);
  if (ids.length === 0) return { fresh: [], seen: [] };

  const { data: submissionRows } = await supabase
    .from("matura_writing_submissions")
    .select("task_id, created_at")
    .eq("user_id", userId)
    .in("task_id", ids)
    .order("created_at", { ascending: false });

  const latest = new Map<string, string>();
  for (const row of (submissionRows ?? []) as Array<{ task_id: string; created_at: string }>) {
    if (!latest.has(row.task_id)) latest.set(row.task_id, row.created_at);
  }

  return {
    fresh: ids.filter((id) => !latest.has(id)),
    seen: ids
      .filter((id) => latest.has(id))
      .map((id) => ({ id, createdAt: latest.get(id)! }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

interface RawWritingTask {
  instructions?: unknown;
  contentPoints?: unknown;
  modelAnswer?: unknown;
  modelAnswerNotes?: unknown;
}

function pickRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

async function generateInto(params: {
  typeDef: MaturaWritingTypeDef;
  sectionId: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  count: number;
}): Promise<string[]> {
  const { typeDef, sectionId, language, level, count } = params;
  if (count <= 0) return [];

  const languageLabel = MATURA_LANGUAGE_LABELS[language].toLowerCase();
  const range = MATURA_WRITING_WORD_RANGE[level];
  const pointsMax = MATURA_WRITING_MAX_POINTS[level];
  const points = contentPointCount(level);
  const admin = createAdminClient();
  const inserted: string[] = [];

  for (let i = 0; i < count; i += 1) {
    let raw: RawWritingTask;
    try {
      raw = await askAIForJSON<RawWritingTask>({
        system:
          `Jesteś egzaminatorem CKE układającym ORYGINALNE polecenia do wypowiedzi pisemnej na maturze ` +
          `z języka ${languageLabel}ego, ${level === "podstawowa" ? "poziom podstawowy" : "poziom rozszerzony"}. ` +
          `Forma wypowiedzi: ${typeDef.label}. ${typeDef.aiBrief} ` +
          "Zasady: " +
          "1) instructions: polecenie PO POLSKU, opisujące sytuację i formę wypowiedzi — dokładnie tak, " +
          "jak formułuje je arkusz CKE. " +
          `2) contentPoints: DOKŁADNIE ${points} podpunktów PO POLSKU, które zdający musi rozwinąć. ` +
          "Każdy podpunkt ma być konkretny i rozłączny z pozostałymi. " +
          `3) modelAnswer: WŁASNA, wzorcowa wypowiedź w języku ${languageLabel}m na ${range.min}–${range.max} ` +
          "wyrazów, realizująca wszystkie podpunkty i warta komplet punktów. Nigdy nie kopiuj wypowiedzi " +
          "wzorcowych z arkuszy CKE — napisz własną. " +
          "4) modelAnswerNotes: 2–3 zdania PO POLSKU o tym, co w tej wypowiedzi zasługuje na punkty " +
          "(struktura, spójniki, zakres środków).",
        prompt:
          `Ułóż jedno nowe polecenie typu „${typeDef.label}”. ` +
          `Obszar tematyczny na tę próbę: ${pickRandom(MATURA_TOPIC_AREAS)}.`,
        schema: {
          instructions: { type: "string", description: "Polecenie PO POLSKU." },
          contentPoints: {
            type: "array",
            items: { type: "string" },
            description: `Dokładnie ${points} podpunktów PO POLSKU.`,
          },
          modelAnswer: { type: "string", description: `Wzorcowa wypowiedź, ${range.min}–${range.max} wyrazów.` },
          modelAnswerNotes: { type: "string", description: "Komentarz PO POLSKU do wypowiedzi wzorcowej." },
        },
        maxTokens: 2600,
      });
    } catch (err) {
      console.error(`[matura] generowanie polecenia „${typeDef.formType}" nie powiodło się:`, err);
      continue;
    }

    const instructions = typeof raw.instructions === "string" ? raw.instructions.trim() : "";
    const modelAnswer = typeof raw.modelAnswer === "string" ? raw.modelAnswer.trim() : "";
    const contentPoints = Array.isArray(raw.contentPoints)
      ? raw.contentPoints.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean)
      : [];

    // A prompt with no model answer would break the post-submission review, and
    // one with no podpunkty cannot be graded against "treść" at all.
    if (!instructions || !modelAnswer || contentPoints.length === 0) {
      console.error(`[matura] wygenerowane polecenie „${typeDef.formType}" odrzucone: brak wymaganych pól`);
      continue;
    }

    const { data, error } = await admin
      .from("matura_writing_tasks")
      .insert({
        section_id: sectionId,
        form_type: typeDef.formType,
        instructions,
        content_points: contentPoints,
        min_words: range.min,
        max_words: range.max,
        points_max: pointsMax,
        source: "ai_generated",
        source_metadata: { needsReview: true },
        model_answer: modelAnswer,
        model_answer_notes:
          typeof raw.modelAnswerNotes === "string" ? raw.modelAnswerNotes.trim() : "",
      })
      .select("id")
      .single();

    if (error) {
      console.error(`[matura] zapis polecenia „${typeDef.formType}" nie powiódł się:`, error);
      continue;
    }
    inserted.push((data as { id: string }).id);
  }

  return inserted;
}

export async function topUpWritingStock(params: {
  supabase: SupabaseClient;
  userId: string;
  sectionId: string;
  typeDef: MaturaWritingTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
}): Promise<void> {
  const { supabase, userId, sectionId, typeDef, language, level } = params;
  const { fresh } = await splitByFreshness(supabase, userId, sectionId, typeDef.formType);
  const missing = Math.min(TOP_UP_BATCH, STOCK_TARGET - fresh.length);
  if (missing <= 0) return;
  await generateInto({ typeDef, sectionId, language, level, count: missing });
}

export async function pickWritingTaskForType(params: {
  supabase: SupabaseClient;
  userId: string;
  sectionId: string;
  typeDef: MaturaWritingTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
}): Promise<{ taskId: string; isRepeat: boolean } | null> {
  const { supabase, userId, sectionId, typeDef, language, level } = params;

  const { fresh, seen } = await splitByFreshness(supabase, userId, sectionId, typeDef.formType);
  if (fresh.length > 0) return { taskId: pickRandom(fresh), isRepeat: false };

  const [generatedId] = await generateInto({ typeDef, sectionId, language, level, count: 1 });
  if (generatedId) return { taskId: generatedId, isRepeat: false };

  if (seen.length > 0) return { taskId: seen[0].id, isRepeat: true };
  return null;
}
