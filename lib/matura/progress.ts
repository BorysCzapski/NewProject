// ============================================================================
// lib/matura/progress.ts
// Per-section mastery, computed on demand from matura_task_attempts +
// matura_tasks — same on-the-fly pattern as lib/matma/progress.ts, but
// simpler: matura tasks have no difficulty tiers (CKE task groups aren't
// leveled the way math problems are), so mastery is a plain average of the
// STUDENT'S MOST RECENT attempt ratio (points_awarded/max_points) per task.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import type { MasteryStatus, MaturaSection, MaturaSectionProgress } from "@/lib/types/database";

interface LatestAttemptInfo {
  ratio: number; // points_awarded / max_points, clamped 0-1
  attemptedAt: string;
}

async function getLatestAttemptsByTask(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string
): Promise<Map<string, LatestAttemptInfo>> {
  const { data } = await supabase
    .from("matura_task_attempts")
    .select("task_id, points_awarded, max_points, attempted_at, matura_tasks!inner(section_id)")
    .eq("user_id", userId)
    .eq("matura_tasks.section_id", sectionId)
    .order("attempted_at", { ascending: false });

  const rows = (data ?? []) as unknown as Array<{
    task_id: string;
    points_awarded: number;
    max_points: number;
    attempted_at: string;
  }>;

  const latest = new Map<string, LatestAttemptInfo>();
  for (const row of rows) {
    if (latest.has(row.task_id)) continue; // already-newer row seen (desc order)
    const ratio = row.max_points > 0 ? Math.max(0, Math.min(1, row.points_awarded / row.max_points)) : 0;
    latest.set(row.task_id, { ratio, attemptedAt: row.attempted_at });
  }
  return latest;
}

/** Same idea as getLatestAttemptsByTask, but over matura_writing_submissions
 * (AI-graded free-text, see 0014_matura_writing.sql) — a section's mastery
 * folds in BOTH task shapes, since "pisanie" only has writing tasks and
 * "srodki-jezykowe" only has exact-match tasks, but nothing stops a future
 * section from having both. Keyed by task_id in a disjoint UUID space from
 * matura_tasks, so merging the two maps in recomputeSectionProgress is safe. */
async function getLatestWritingRatiosByTask(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string
): Promise<Map<string, LatestAttemptInfo>> {
  const { data } = await supabase
    .from("matura_writing_submissions")
    .select("task_id, points_awarded, max_points, created_at, matura_writing_tasks!inner(section_id)")
    .eq("user_id", userId)
    .eq("matura_writing_tasks.section_id", sectionId)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Array<{
    task_id: string;
    points_awarded: number;
    max_points: number;
    created_at: string;
  }>;

  const latest = new Map<string, LatestAttemptInfo>();
  for (const row of rows) {
    if (latest.has(row.task_id)) continue;
    const ratio = row.max_points > 0 ? Math.max(0, Math.min(1, row.points_awarded / row.max_points)) : 0;
    latest.set(row.task_id, { ratio, attemptedAt: row.created_at });
  }
  return latest;
}

function deriveStatus(masteryScore: number, hasAnyAttempt: boolean): MasteryStatus {
  if (masteryScore >= MIN_MASTERY_THRESHOLD * 100) return "mastered";
  return hasAnyAttempt ? "learning" : "new";
}

/** Recomputes and upserts matura_section_progress for one user+section. Call
 * after grading any attempt in that section. */
export async function recomputeSectionProgress(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string
): Promise<MaturaSectionProgress> {
  const [{ data: tasks }, { data: writingTasks }, latestByTask, latestByWritingTask] = await Promise.all([
    supabase.from("matura_tasks").select("id").eq("section_id", sectionId),
    supabase.from("matura_writing_tasks").select("id").eq("section_id", sectionId),
    getLatestAttemptsByTask(supabase, userId, sectionId),
    getLatestWritingRatiosByTask(supabase, userId, sectionId),
  ]);

  const taskIds = ((tasks ?? []) as Array<{ id: string }>).map((t) => t.id);
  const writingTaskIds = ((writingTasks ?? []) as Array<{ id: string }>).map((t) => t.id);
  const ratios = [
    ...taskIds.map((id) => latestByTask.get(id)?.ratio ?? null),
    ...writingTaskIds.map((id) => latestByWritingTask.get(id)?.ratio ?? null),
  ].filter((r): r is number => r !== null);
  const masteryScore = ratios.length > 0 ? Math.round((ratios.reduce((sum, r) => sum + r, 0) / ratios.length) * 100) : 0;
  const status = deriveStatus(masteryScore, ratios.length > 0);

  const { data: upserted } = await supabase
    .from("matura_section_progress")
    .upsert(
      { user_id: userId, section_id: sectionId, status, mastery_score: masteryScore },
      { onConflict: "user_id,section_id" }
    )
    .select("*")
    .single();

  return upserted as MaturaSectionProgress;
}

export interface SectionWithProgress extends MaturaSection {
  status: MasteryStatus;
  masteryScore: number;
}

/** All sections for a level, annotated with this student's progress. */
export async function getSectionsWithProgress(
  supabase: SupabaseClient,
  userId: string,
  level: MaturaSection["level"]
): Promise<SectionWithProgress[]> {
  const { data: sectionRows } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("level", level)
    .order("order_index");

  const sections = (sectionRows ?? []) as MaturaSection[];
  const { data: progressRows } = await supabase
    .from("matura_section_progress")
    .select("*")
    .eq("user_id", userId)
    .in("section_id", sections.map((s) => s.id));

  const progressBySection = new Map(((progressRows ?? []) as MaturaSectionProgress[]).map((p) => [p.section_id, p]));

  return sections.map((section) => {
    const progress = progressBySection.get(section.id);
    return { ...section, status: progress?.status ?? "new", masteryScore: progress?.mastery_score ?? 0 };
  });
}
