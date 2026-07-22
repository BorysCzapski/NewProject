// ============================================================================
// lib/matma/diagnostic.ts
// Per-topic diagnostic test: a handful of problems spanning difficulty 1-3
// from the SAME problem bank used for regular practice (no separate
// diagnostic-only content type). Solving them is scored through the normal
// attempt/grading pipeline; lib/matma/progress.ts.recomputeTopicProgress
// then reads those attempts back with diagnosed=true to set the topic's
// starting point. Skipping is handled entirely by the (safe) default: a
// topic with zero attempts already reports status "new" / mastery 0.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MathProblem } from "@/lib/types/database";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 2 easy + 2 medium + up to 2 hard, non-proof problems — a short "od
 * bardzo podstawowego wzwyż" ladder, not a full practice set. */
export async function getDiagnosticProblemSet(
  supabase: SupabaseClient,
  topicId: string
): Promise<MathProblem[]> {
  const { data } = await supabase
    .from("math_problems")
    .select("*")
    .eq("topic_id", topicId)
    .eq("is_proof", false);

  const problems = (data ?? []) as MathProblem[];
  const byDifficulty: Record<1 | 2 | 3, MathProblem[]> = { 1: [], 2: [], 3: [] };
  for (const p of problems) byDifficulty[p.difficulty].push(p);

  return [
    ...shuffle(byDifficulty[1]).slice(0, 2),
    ...shuffle(byDifficulty[2]).slice(0, 2),
    ...shuffle(byDifficulty[3]).slice(0, 2),
  ];
}
