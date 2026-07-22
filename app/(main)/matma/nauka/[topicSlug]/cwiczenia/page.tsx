// ============================================================================
// app/(main)/matma/nauka/[topicSlug]/cwiczenia/page.tsx
// Problem-practice session for one topic. Two entry modes:
//  - ?review=1: a spaced-review check-in problem picked from the student's
//    most-overdue mastered topic (lib/matma/spaced-review.ts), independent
//    of the topicSlug in the URL (the review candidate can come from any
//    already-mastered topic — the slug just anchors the page's own header).
//  - default: a problem from THIS topic at the student's currently unlocked
//    difficulty tier, preferring one they haven't attempted yet.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getProblemsForTopic, getTopicBySlug } from "@/lib/matma/content";
import { getUnlockedDifficulty } from "@/lib/matma/progress";
import { getSpacedReviewCandidate } from "@/lib/matma/spaced-review";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProblemSolver } from "@/components/matma/problem/problem-solver";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default async function CwiczeniaPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicSlug: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { topicSlug } = await params;
  const { review } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, topicSlug);
  if (!topic) notFound();

  if (review === "1") {
    const candidate = await getSpacedReviewCandidate(supabase, profile.id);

    if (!candidate) {
      return (
        <div>
          <PageHeader title={topic.title} subtitle="Powtórka wyprzedzająca" />
          <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
            <Card className="flex flex-col items-center gap-3 py-8 text-center">
              <CardTitle>Brak zaległych powtórek</CardTitle>
              <CardDescription>
                Świetnie — na razie nie ma żadnych opanowanych działów, które trzeba odświeżyć. Wróć tu za jakiś
                czas.
              </CardDescription>
              <Link href="/matma">
                <Button variant="outline">Wróć do pulpitu</Button>
              </Link>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div>
        <PageHeader title={candidate.topicTitle} subtitle="Powtórka wyprzedzająca" />
        <div className="mx-auto max-w-lg px-5 py-5">
          <ProblemSolver problem={candidate.problem} isSpacedReview />
        </div>
      </div>
    );
  }

  const unlockedDifficulty = await getUnlockedDifficulty(supabase, profile.id, topic.id);
  const problems = await getProblemsForTopic(supabase, topic.id, {
    difficulty: unlockedDifficulty,
    isProof: false,
  });

  if (problems.length === 0) {
    return (
      <div>
        <PageHeader title={topic.title} subtitle={`Poziom ${unlockedDifficulty} z 3`} />
        <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
          <Card className="flex flex-col items-center gap-3 py-8 text-center">
            <CardTitle>Brak zadań na tym poziomie</CardTitle>
            <CardDescription>
              W tym dziale nie ma jeszcze zadań o tym poziomie trudności. Spróbuj wrócić później.
            </CardDescription>
            <Link href={`/matma/nauka/${topic.slug}`}>
              <Button variant="outline">Wróć do działu</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const problemIds = problems.map((p) => p.id);
  const { data: attemptRows } = await supabase
    .from("math_problem_attempts")
    .select("problem_id")
    .eq("user_id", profile.id)
    .in("problem_id", problemIds);
  const attemptedIds = new Set((attemptRows ?? []).map((row) => row.problem_id as string));

  const unattempted = problems.filter((p) => !attemptedIds.has(p.id));
  const pool = unattempted.length > 0 ? unattempted : problems;
  const problem = pickRandom(pool);

  return (
    <div>
      <PageHeader title={topic.title} subtitle={`Poziom ${unlockedDifficulty} z 3`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <ProblemSolver problem={problem} />
      </div>
    </div>
  );
}
