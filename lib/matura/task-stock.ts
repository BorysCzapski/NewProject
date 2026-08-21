// ============================================================================
// lib/matura/task-stock.ts
// Turns the task bank into a practice QUEUE per CKE task type: how many times
// the student has completed a type, which task to hand them next, and keeping
// enough unseen tasks in the bank that "next" is always something they have not
// solved before.
//
// "Fresh" is per student, not global. The bank is shared content
// (0013_matura.sql), so the same generated task can serve everyone; what must
// not repeat is a task THIS student already answered, because a remembered
// answer measures memory rather than language. Every query below is therefore
// "tasks of this type in this section, minus this student's attempts".
//
// Top-up runs through next/server's `after()` from the page that hands out a
// task, so the student waits for their task and not for the generator. The one
// exception is an empty queue: with nothing to hand out there is nothing to
// wait behind, so that single generation is awaited inline.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateMaturaTask, MATURA_TOPIC_AREAS } from "@/lib/matura/generate-tasks";
import { taskTypesFor, type MaturaTaskTypeDef } from "@/lib/matura/task-types";
import type {
  MaturaLanguage,
  MaturaLevel,
  MaturaSectionSlug,
  MaturaTaskTypeSlug,
} from "@/lib/types/database";

/** Unseen tasks we try to keep queued per type before topping up. */
const STOCK_TARGET = 3;
/** Tasks generated in one top-up run — bounded so a burst cannot run long. */
const TOP_UP_BATCH = 2;

export interface MaturaTypeStats {
  typeDef: MaturaTaskTypeDef;
  /** How many times this student completed a task of this type. */
  completedCount: number;
  /** Points on the most recent attempt, null before the first one. */
  lastPoints: number | null;
  lastMaxPoints: number | null;
  /** Rounded percentage across every attempt of this type, null before the first. */
  averagePercent: number | null;
  /** Tasks of this type the student has not answered yet. */
  freshAvailable: number;
}

interface AttemptRow {
  task_id: string;
  points_awarded: number;
  max_points: number;
  attempted_at: string;
  matura_tasks: { task_type: string | null } | null;
}

/**
 * Per-type counters for one section. Drives the section hub: a type is
 * something you have done N times, not something you have or have not done.
 */
export async function getTypeStats(
  supabase: SupabaseClient,
  userId: string,
  section: { id: string; slug: MaturaSectionSlug },
  level: MaturaLevel
): Promise<MaturaTypeStats[]> {
  const types = taskTypesFor(section.slug, level);
  if (types.length === 0) return [];

  const [{ data: attemptRows }, { data: taskRows }] = await Promise.all([
    supabase
      .from("matura_task_attempts")
      .select("task_id, points_awarded, max_points, attempted_at, matura_tasks!inner(task_type, section_id)")
      .eq("user_id", userId)
      .eq("matura_tasks.section_id", section.id)
      .order("attempted_at", { ascending: false }),
    supabase.from("matura_tasks").select("id, task_type").eq("section_id", section.id),
  ]);

  const attempts = (attemptRows ?? []) as unknown as AttemptRow[];
  const tasks = (taskRows ?? []) as Array<{ id: string; task_type: string | null }>;

  const attemptedTaskIds = new Set(attempts.map((a) => a.task_id));

  return types.map((typeDef) => {
    const own = attempts.filter((a) => a.matura_tasks?.task_type === typeDef.slug);
    const totalAwarded = own.reduce((sum, a) => sum + Number(a.points_awarded), 0);
    const totalMax = own.reduce((sum, a) => sum + Number(a.max_points), 0);
    const freshAvailable = tasks.filter(
      (t) => t.task_type === typeDef.slug && !attemptedTaskIds.has(t.id)
    ).length;

    return {
      typeDef,
      completedCount: own.length,
      // attempts arrive newest-first, so index 0 is the latest attempt.
      lastPoints: own.length > 0 ? Number(own[0].points_awarded) : null,
      lastMaxPoints: own.length > 0 ? Number(own[0].max_points) : null,
      averagePercent: totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : null,
      freshAvailable,
    };
  });
}

/** Ids of this section's tasks of one type, split by whether the student has
 * already answered them. */
async function splitByFreshness(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string,
  typeSlug: MaturaTaskTypeSlug
): Promise<{ fresh: string[]; seen: Array<{ id: string; attemptedAt: string }> }> {
  const { data: taskRows } = await supabase
    .from("matura_tasks")
    .select("id")
    .eq("section_id", sectionId)
    .eq("task_type", typeSlug);

  const ids = (taskRows ?? []).map((t) => (t as { id: string }).id);
  if (ids.length === 0) return { fresh: [], seen: [] };

  const { data: attemptRows } = await supabase
    .from("matura_task_attempts")
    .select("task_id, attempted_at")
    .eq("user_id", userId)
    .in("task_id", ids)
    .order("attempted_at", { ascending: false });

  const latestAttempt = new Map<string, string>();
  for (const row of (attemptRows ?? []) as Array<{ task_id: string; attempted_at: string }>) {
    if (!latestAttempt.has(row.task_id)) latestAttempt.set(row.task_id, row.attempted_at);
  }

  const fresh = ids.filter((id) => !latestAttempt.has(id));
  const seen = ids
    .filter((id) => latestAttempt.has(id))
    .map((id) => ({ id, attemptedAt: latestAttempt.get(id)! }))
    // oldest first: the task solved longest ago is the least-remembered one.
    .sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt));

  return { fresh, seen };
}

function pickRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Generates up to `count` tasks of a type and inserts them into the shared
 * bank. Returns the ids that landed. Never throws: a top-up that fails leaves
 * the queue as it was, which the caller already handles.
 */
async function generateInto(params: {
  typeDef: MaturaTaskTypeDef;
  sectionId: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  count: number;
}): Promise<string[]> {
  const { typeDef, sectionId, language, level, count } = params;
  if (!typeDef.aiGeneratable || count <= 0) return [];

  const admin = createAdminClient();
  const inserted: string[] = [];

  // Sequential, not parallel: Groq rate-limits per key and a top-up is
  // background work with no deadline, so serialising costs the student nothing
  // and keeps a burst from tripping the limit for the whole app.
  for (let i = 0; i < count; i += 1) {
    const content = await generateMaturaTask({
      typeDef,
      language,
      level,
      variationHint: pickRandom(MATURA_TOPIC_AREAS),
    });
    if (!content) continue;

    const { data, error } = await admin
      .from("matura_tasks")
      .insert({
        section_id: sectionId,
        task_type: typeDef.slug,
        content,
        points_max: content.items.length,
        source: "ai_generated",
        source_metadata: { needsReview: true },
      })
      .select("id")
      .single();

    if (error) {
      console.error(`[matura] zapis wygenerowanego zadania „${typeDef.slug}" nie powiódł się:`, error);
      continue;
    }
    inserted.push((data as { id: string }).id);
  }

  return inserted;
}

/**
 * Background top-up: brings the student's unseen queue for a type back up to
 * STOCK_TARGET. Safe to call on every visit — it returns immediately when the
 * queue is already deep enough, and does nothing at all for types that cannot
 * be generated (rozumienie ze słuchu needs a real recording).
 */
export async function topUpTypeStock(params: {
  supabase: SupabaseClient;
  userId: string;
  sectionId: string;
  typeDef: MaturaTaskTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
}): Promise<void> {
  const { supabase, userId, sectionId, typeDef, language, level } = params;
  if (!typeDef.aiGeneratable) return;

  const { fresh } = await splitByFreshness(supabase, userId, sectionId, typeDef.slug);
  const missing = Math.min(TOP_UP_BATCH, STOCK_TARGET - fresh.length);
  if (missing <= 0) return;

  await generateInto({ typeDef, sectionId, language, level, count: missing });
}

export interface PickedTask {
  taskId: string;
  /** True when the student has already answered this one — only happens for
   * types that cannot be generated and whose curated bank is exhausted. */
  isRepeat: boolean;
}

/**
 * Hands out the next task of a type: an unseen one at random, else the one
 * solved longest ago, else — for generatable types — a task made on the spot.
 * Returns null only when the type has no bank and no generator, which the
 * caller surfaces as "wróć tu wkrótce" rather than an error.
 */
export async function pickTaskForType(params: {
  supabase: SupabaseClient;
  userId: string;
  sectionId: string;
  typeDef: MaturaTaskTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
}): Promise<PickedTask | null> {
  const { supabase, userId, sectionId, typeDef, language, level } = params;

  const { fresh, seen } = await splitByFreshness(supabase, userId, sectionId, typeDef.slug);
  if (fresh.length > 0) return { taskId: pickRandom(fresh), isRepeat: false };

  // Nothing unseen left. For a generatable type make one now — this is the
  // only place the student waits on the model, and only because there is
  // genuinely nothing else to show them.
  if (typeDef.aiGeneratable) {
    const [generatedId] = await generateInto({ typeDef, sectionId, language, level, count: 1 });
    if (generatedId) return { taskId: generatedId, isRepeat: false };
  }

  if (seen.length > 0) return { taskId: seen[0].id, isRepeat: true };
  return null;
}
