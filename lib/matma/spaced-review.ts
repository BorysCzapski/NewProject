// ============================================================================
// lib/matma/spaced-review.ts
// Light spaced-repetition: topics already "mastered" occasionally surface
// one quick check-in problem so they don't quietly rot before the exam. If
// the check-in goes badly, the NEXT recomputeTopicProgress call (run right
// after grading, same as any other attempt) naturally drags mastery_score
// and status back down — no special-case "regression" logic needed, see
// lib/matma/progress.ts's "latest attempt, not best attempt" design note.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MathProblem } from "@/lib/types/database";

const REVIEW_INTERVAL_DAYS = 5;

export interface SpacedReviewCandidate {
  topicId: string;
  topicTitle: string;
  problem: MathProblem;
}

/** One review candidate per study session, picked from the mastered topic
 * that's gone longest without a check-in (or was never reviewed at all). */
export async function getSpacedReviewCandidate(
  supabase: SupabaseClient,
  userId: string
): Promise<SpacedReviewCandidate | null> {
  const { data: masteredRows } = await supabase
    .from("math_topic_progress")
    .select("topic_id, last_reviewed_at, math_topics(id, title)")
    .eq("user_id", userId)
    .eq("status", "mastered");

  const mastered = (masteredRows ?? []) as unknown as Array<{
    topic_id: string;
    last_reviewed_at: string | null;
    math_topics: { id: string; title: string };
  }>;
  if (mastered.length === 0) return null;

  const cutoff = Date.now() - REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
  const due = mastered
    .filter((m) => !m.last_reviewed_at || new Date(m.last_reviewed_at).getTime() < cutoff)
    .sort((a, b) => {
      const at = a.last_reviewed_at ? new Date(a.last_reviewed_at).getTime() : 0;
      const bt = b.last_reviewed_at ? new Date(b.last_reviewed_at).getTime() : 0;
      return at - bt; // longest-overdue first
    });
  if (due.length === 0) return null;

  const target = due[0];
  const { data: problemRows } = await supabase
    .from("math_problems")
    .select("*")
    .eq("topic_id", target.topic_id)
    .eq("is_proof", false)
    .in("difficulty", [2, 3]);
  const problems = (problemRows ?? []) as MathProblem[];
  if (problems.length === 0) return null;

  const problem = problems[Math.floor(Math.random() * problems.length)];
  return { topicId: target.topic_id, topicTitle: target.math_topics.title, problem };
}

export async function getCanvasSignedUrl(supabase: SupabaseClient, storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("math-attempts").createSignedUrl(storagePath, 3600);
  if (error) {
    console.error("[matma] createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}
