// ============================================================================
// lib/matma/study-plan.ts
// Pure scheduling math behind the exam-date study plan: how many weeks are
// left, how many of those become a review tail (simulations + closing gaps,
// no new material), and which topics land in which week — weaker topics
// (lower mastery_score) get more weeks, curriculum order (math_topics
// .order_index, basics first) sets the base sequence. All pure/testable;
// the DB-touching orchestration (insert/replace rows) lives in
// lib/matma/actions.ts so this file has no Supabase dependency at all.
// ============================================================================

export interface StudyPlanTopicInput {
  id: string;
  masteryScore: number; // 0-100
  orderIndex: number;
}

export interface GeneratedPlanWeek {
  weekIndex: number;
  targetStartDate: string; // ISO date (yyyy-mm-dd)
  targetEndDate: string;
  topicIds: string[];
  isReviewWeek: boolean;
}

/** How many "week units" of dedicated attention a topic still needs, based on
 * its current mastery. Mastered topics need none (they only reappear via
 * spaced review, not a dedicated plan week). */
function computeNeedUnits(masteryScore: number): number {
  if (masteryScore >= 80) return 0;
  if (masteryScore >= 60) return 1;
  if (masteryScore >= 30) return 2;
  return 3;
}

/** Lays out which topic(s) land in which content week (curriculum order,
 * weaker topics get proportionally more dedicated weeks), stretching or
 * compressing to exactly fill `availableWeeks`. */
export function buildWeeklyTopicSequence(
  topicsInCurriculumOrder: StudyPlanTopicInput[],
  availableWeeks: number
): string[][] {
  if (availableWeeks <= 0) return [];

  const expanded: string[] = [];
  for (const t of topicsInCurriculumOrder) {
    const need = computeNeedUnits(t.masteryScore);
    for (let i = 0; i < need; i++) expanded.push(t.id);
  }

  if (expanded.length === 0) {
    // Everything already mastered ahead of schedule — use the spare weeks
    // for a light rotating review of every topic instead of sitting idle.
    return Array.from({ length: availableWeeks }, () => topicsInCurriculumOrder.map((t) => t.id));
  }

  if (expanded.length <= availableWeeks) {
    // More weeks than strictly needed: give the weakest topics an extra pass.
    const weeks: string[][] = expanded.map((id) => [id]);
    const weakestFirst = [...topicsInCurriculumOrder].sort((a, b) => a.masteryScore - b.masteryScore);
    let i = 0;
    while (weeks.length < availableWeeks && weakestFirst.length > 0) {
      weeks.push([weakestFirst[i % weakestFirst.length].id]);
      i++;
    }
    return weeks;
  }

  // Fewer weeks than the raw need count: compress by bundling several
  // topic-units into each week (round-robin across the expanded sequence),
  // preserving curriculum order and de-duplicating within a week.
  const weeks: string[][] = Array.from({ length: availableWeeks }, () => []);
  expanded.forEach((topicId, idx) => {
    const weekIdx = Math.min(availableWeeks - 1, Math.floor((idx / expanded.length) * availableWeeks));
    weeks[weekIdx].push(topicId);
  });
  return weeks.map((w) => [...new Set(w)]);
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Full plan generation from today to exam day. The last 3-4 weeks (scaled
 * down for short plans) become review weeks: simulations + closing
 * remaining gaps, never new material — see product spec.
 */
export function generateStudyPlanWeeks(params: {
  examDate: Date;
  today: Date;
  topics: StudyPlanTopicInput[];
}): GeneratedPlanWeek[] {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks = Math.max(1, Math.round((params.examDate.getTime() - params.today.getTime()) / msPerWeek));

  const reviewWeeks =
    totalWeeks <= 4 ? Math.min(1, totalWeeks) : totalWeeks <= 8 ? 2 : totalWeeks <= 16 ? 3 : 4;
  const contentWeeks = Math.max(0, totalWeeks - reviewWeeks);

  const ordered = [...params.topics].sort((a, b) => a.orderIndex - b.orderIndex);
  const sequence = buildWeeklyTopicSequence(ordered, contentWeeks);
  const stillWeak = ordered.filter((t) => t.masteryScore < 80).map((t) => t.id);

  const weeks: GeneratedPlanWeek[] = [];
  const cursor = new Date(params.today);
  for (let i = 0; i < totalWeeks; i++) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 6);
    const isReview = i >= contentWeeks;
    weeks.push({
      weekIndex: i,
      targetStartDate: toIsoDate(start),
      targetEndDate: toIsoDate(end),
      // Review weeks target whatever is STILL weak once that week arrives —
      // recomputeStudyPlan regenerates this list live rather than freezing
      // it at plan-creation time.
      topicIds: isReview ? stillWeak : (sequence[i] ?? []),
      isReviewWeek: isReview,
    });
    cursor.setDate(cursor.getDate() + 7);
  }
  return weeks;
}

/** For a week whose end date has passed: did the student actually cover its
 * topics? Used when recomputing the plan to close out the past before
 * regenerating the future. */
export function deriveWeekOutcomeStatus(
  weekTopicIds: string[],
  masteryByTopic: Map<string, number>
): "completed" | "partially_completed" | "skipped" {
  if (weekTopicIds.length === 0) return "completed";
  const masteredCount = weekTopicIds.filter((id) => (masteryByTopic.get(id) ?? 0) >= 80).length;
  if (masteredCount === weekTopicIds.length) return "completed";
  if (masteredCount > 0) return "partially_completed";
  return "skipped";
}
