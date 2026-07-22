// ============================================================================
// lib/matma/content.ts
// Server-only read helpers over the shared content tables (math_topics,
// math_lessons, math_problems). No auth checks here — RLS already makes
// these tables select-true for any authenticated user; auth happens once,
// in the page via requireProfile()/requireAdmin(), same pattern as
// lib/homework/admin-queries.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MathTopic, MathLesson, MathProblem } from "@/lib/types/database";

export async function getTopics(supabase: SupabaseClient): Promise<MathTopic[]> {
  const { data } = await supabase.from("math_topics").select("*").order("order_index");
  return (data ?? []) as MathTopic[];
}

export async function getTopicBySlug(supabase: SupabaseClient, slug: string): Promise<MathTopic | null> {
  const { data } = await supabase.from("math_topics").select("*").eq("slug", slug).maybeSingle();
  return (data as MathTopic) ?? null;
}

export async function getTopicById(supabase: SupabaseClient, id: string): Promise<MathTopic | null> {
  const { data } = await supabase.from("math_topics").select("*").eq("id", id).maybeSingle();
  return (data as MathTopic) ?? null;
}

export async function getLessonsForTopic(supabase: SupabaseClient, topicId: string): Promise<MathLesson[]> {
  const { data } = await supabase
    .from("math_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .order("order_index");
  return (data ?? []) as MathLesson[];
}

export async function getLessonById(supabase: SupabaseClient, lessonId: string): Promise<MathLesson | null> {
  const { data } = await supabase.from("math_lessons").select("*").eq("id", lessonId).maybeSingle();
  return (data as MathLesson) ?? null;
}

export async function getProblemsForTopic(
  supabase: SupabaseClient,
  topicId: string,
  opts?: { difficulty?: 1 | 2 | 3; isProof?: boolean }
): Promise<MathProblem[]> {
  let query = supabase.from("math_problems").select("*").eq("topic_id", topicId);
  if (opts?.difficulty) query = query.eq("difficulty", opts.difficulty);
  if (opts?.isProof !== undefined) query = query.eq("is_proof", opts.isProof);
  const { data } = await query.order("difficulty");
  return (data ?? []) as MathProblem[];
}

export async function getProblemById(supabase: SupabaseClient, id: string): Promise<MathProblem | null> {
  const { data } = await supabase.from("math_problems").select("*").eq("id", id).maybeSingle();
  return (data as MathProblem) ?? null;
}

export async function getProblemsByIds(supabase: SupabaseClient, ids: string[]): Promise<MathProblem[]> {
  if (ids.length === 0) return [];
  const { data } = await supabase.from("math_problems").select("*").in("id", ids);
  const bySource = new Map((data ?? []).map((p) => [(p as MathProblem).id, p as MathProblem]));
  // preserve the exam's original problem order
  return ids.map((id) => bySource.get(id)).filter((p): p is MathProblem => !!p);
}

export async function getLearningPathStages(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("math_learning_path_stages")
    .select("*, math_topics(id, slug, title, description, exam_weight)")
    .order("order_index");
  return (data ?? []) as Array<{
    id: string;
    order_index: number;
    topic_id: string;
    title: string;
    math_topics: MathTopic;
  }>;
}
