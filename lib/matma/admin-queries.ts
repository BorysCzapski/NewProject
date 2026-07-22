// ============================================================================
// lib/matma/admin-queries.ts
// Read-only helpers for the Matma admin panel — plain "server-only" reads
// taking `supabase` as the first arg, no auth check inside (the page calls
// requireAdmin() first), same pattern as lib/homework/admin-queries.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MathProblemAttempt, MathProblemSource } from "@/lib/types/database";

export interface AdminTopicOverviewRow {
  topicId: string;
  title: string;
  orderIndex: number;
  examWeight: number;
  lessonCount: number;
  problemCount: number;
  problemCountBySource: Record<MathProblemSource, number>;
  studentsWithProgress: number;
  avgMasteryScore: number;
}

export async function getAdminTopicsOverview(supabase: SupabaseClient): Promise<AdminTopicOverviewRow[]> {
  const [{ data: topics }, { data: lessons }, { data: problems }, { data: progress }] = await Promise.all([
    supabase.from("math_topics").select("id, title, order_index, exam_weight").order("order_index"),
    supabase.from("math_lessons").select("id, topic_id"),
    supabase.from("math_problems").select("id, topic_id, source"),
    supabase.from("math_topic_progress").select("topic_id, mastery_score"),
  ]);

  const lessonCounts = new Map<string, number>();
  for (const l of lessons ?? []) lessonCounts.set(l.topic_id, (lessonCounts.get(l.topic_id) ?? 0) + 1);

  const problemCounts = new Map<string, number>();
  const problemBySource = new Map<string, Record<MathProblemSource, number>>();
  for (const p of (problems ?? []) as Array<{ id: string; topic_id: string; source: MathProblemSource }>) {
    problemCounts.set(p.topic_id, (problemCounts.get(p.topic_id) ?? 0) + 1);
    const bucket = problemBySource.get(p.topic_id) ?? { topic: 0, past_exam: 0, curated: 0, ai_generated: 0 };
    bucket[p.source] += 1;
    problemBySource.set(p.topic_id, bucket);
  }

  const masteryByTopic = new Map<string, number[]>();
  for (const p of (progress ?? []) as Array<{ topic_id: string; mastery_score: number }>) {
    const arr = masteryByTopic.get(p.topic_id) ?? [];
    arr.push(p.mastery_score);
    masteryByTopic.set(p.topic_id, arr);
  }

  return (topics ?? []).map((t) => {
    const scores = masteryByTopic.get(t.id) ?? [];
    return {
      topicId: t.id,
      title: t.title,
      orderIndex: t.order_index,
      examWeight: t.exam_weight,
      lessonCount: lessonCounts.get(t.id) ?? 0,
      problemCount: problemCounts.get(t.id) ?? 0,
      problemCountBySource: problemBySource.get(t.id) ?? { topic: 0, past_exam: 0, curated: 0, ai_generated: 0 },
      studentsWithProgress: scores.length,
      avgMasteryScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    };
  });
}

export interface AdminStudentRow {
  id: string;
  username: string;
  estimatedPercent: number;
  weakestTopicTitle: string | null;
  currentStreak: number;
}

export async function listStudentsWithMathProgress(supabase: SupabaseClient): Promise<AdminStudentRow[]> {
  const [{ data: students }, { data: topics }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("id, username, current_streak").eq("role", "user").order("username"),
    supabase.from("math_topics").select("id, title, exam_weight"),
    supabase.from("math_topic_progress").select("user_id, topic_id, mastery_score"),
  ]);

  const topicById = new Map((topics ?? []).map((t) => [t.id, t as { id: string; title: string; exam_weight: number }]));
  const byStudent = new Map<string, Array<{ topic_id: string; mastery_score: number }>>();
  for (const p of (progress ?? []) as Array<{ user_id: string; topic_id: string; mastery_score: number }>) {
    const arr = byStudent.get(p.user_id) ?? [];
    arr.push(p);
    byStudent.set(p.user_id, arr);
  }

  return (students ?? []).map((s) => {
    const rows = byStudent.get(s.id) ?? [];
    const totalWeight = rows.reduce((sum, r) => sum + (topicById.get(r.topic_id)?.exam_weight ?? 0), 0) || 1;
    const weighted = rows.reduce(
      (sum, r) => sum + (topicById.get(r.topic_id)?.exam_weight ?? 0) * (r.mastery_score / 100),
      0
    );
    const weakest = [...rows].sort((a, b) => a.mastery_score - b.mastery_score)[0];
    return {
      id: s.id,
      username: s.username,
      estimatedPercent: rows.length ? Math.round((weighted / totalWeight) * 100) : 0,
      weakestTopicTitle: weakest ? (topicById.get(weakest.topic_id)?.title ?? null) : null,
      currentStreak: s.current_streak,
    };
  });
}

export interface AdminAttemptReviewRow extends MathProblemAttempt {
  problem_statement: string;
  student_username: string;
}

/** Recent AI-graded open/proof attempts, for the admin's spot-check/correction queue. */
export async function getAiGradingReviewQueue(
  supabase: SupabaseClient,
  limit = 30
): Promise<AdminAttemptReviewRow[]> {
  const { data } = await supabase
    .from("math_problem_attempts")
    .select("*, math_problems(content), profiles(username)")
    .not("ai_feedback", "is", null)
    .order("attempted_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as unknown as Array<
    MathProblemAttempt & { math_problems: { content: { statement: string } }; profiles: { username: string } }
  >).map((row) => ({
    ...row,
    problem_statement: row.math_problems.content.statement,
    student_username: row.profiles.username,
  }));
}
