// ============================================================================
// app/(main)/algorytmy/postepy/page.tsx
// Progress per dział: lessons read and exercises solved, with accuracy.
//
// Accuracy is shown as "poprawne / rozwiązane", never as a single grade. The
// bank grows without limit (types generate new exercises on demand), so a
// running percentage is a measure of how you are doing lately — not a score
// out of some fixed total that could be "completed".
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics } from "@/lib/algorytmy/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import type { AlgoLesson } from "@/lib/types/database";

interface AttemptRow {
  is_correct: boolean;
  algo_exercises: { topic_id: string } | null;
}

export default async function AlgorytmyProgressPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, { data: lessonRows }, { data: attemptRows }] = await Promise.all([
    getTopics(supabase),
    getCompletedLessonIds(supabase, profile.id),
    supabase.from("algo_lessons").select("id, topic_id"),
    supabase
      .from("algo_exercise_attempts")
      .select("is_correct, algo_exercises!inner(topic_id)")
      .eq("user_id", profile.id),
  ]);

  const lessons = (lessonRows ?? []) as Array<Pick<AlgoLesson, "id" | "topic_id">>;
  const attempts = (attemptRows ?? []) as unknown as AttemptRow[];

  const totalSolved = attempts.length;
  const totalCorrect = attempts.filter((a) => a.is_correct).length;

  return (
    <div>
      <PageHeader title="Postępy" subtitle="Teoria i zadania w każdym dziale" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Card className="flex items-center justify-around gap-2 text-center">
          <div>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {lessons.filter((l) => completedIds.has(l.id)).length}
              <span className="text-sm font-normal text-foreground-muted">/{lessons.length}</span>
            </p>
            <p className="text-xs text-foreground-muted">lekcji</p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums text-foreground">{totalSolved}</p>
            <p className="text-xs text-foreground-muted">zadań</p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {totalSolved > 0 ? `${Math.round((totalCorrect / totalSolved) * 100)}%` : "—"}
            </p>
            <p className="text-xs text-foreground-muted">poprawnych</p>
          </div>
        </Card>

        {topics.map((topic) => {
          const topicLessons = lessons.filter((l) => l.topic_id === topic.id);
          const done = topicLessons.filter((l) => completedIds.has(l.id)).length;
          const own = attempts.filter((a) => a.algo_exercises?.topic_id === topic.id);
          const ownCorrect = own.filter((a) => a.is_correct).length;
          const percent = topicLessons.length > 0 ? (done / topicLessons.length) * 100 : 0;

          return (
            <Link key={topic.id} href={`/algorytmy/dzialy/${topic.slug}`}>
              <Card className="flex flex-col gap-2 transition-transform active:scale-[0.99]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1">
                      {topic.order_index}. {topic.title}
                    </CardTitle>
                    <p className="mt-0.5 text-xs tabular-nums text-foreground-muted">
                      {done}/{topicLessons.length} lekcji
                      {own.length > 0 && ` · ${ownCorrect}/${own.length} zadań poprawnie`}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-foreground-muted" />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
