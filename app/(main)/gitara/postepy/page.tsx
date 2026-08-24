// ============================================================================
// app/(main)/gitara/postepy/page.tsx
// Progress overview: lessons read, drills answered (across every
// fretboard-explorer / chord-recognition drill, not scoped per dział — see
// the migration's module comment on gtr_drill_attempts for why there is no
// per-dział exercise bank here), and total practice time logged from
// /gitara/cwicz.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics, getTotalPracticeSeconds } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import type { GtrLesson } from "@/lib/types/database";

export default async function GitaraProgressPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, practiceSeconds, { data: lessonRows }, { data: drillRows }] =
    await Promise.all([
      getTopics(supabase),
      getCompletedLessonIds(supabase, profile.id),
      getTotalPracticeSeconds(supabase, profile.id),
      supabase.from("gtr_lessons").select("id, topic_id"),
      supabase.from("gtr_drill_attempts").select("is_correct").eq("user_id", profile.id),
    ]);

  const lessons = (lessonRows ?? []) as Array<Pick<GtrLesson, "id" | "topic_id">>;
  const drills = (drillRows ?? []) as Array<{ is_correct: boolean }>;
  const drillsCorrect = drills.filter((d) => d.is_correct).length;

  return (
    <div>
      <PageHeader title="Postępy" subtitle="Lekcje, ćwiczenia i czas gry" />
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
            <p className="text-xl font-bold tabular-nums text-foreground">
              {drills.length > 0 ? `${Math.round((drillsCorrect / drills.length) * 100)}%` : "—"}
            </p>
            <p className="text-xs text-foreground-muted">
              {drills.length > 0 ? `poprawnych z ${drills.length}` : "ćwiczeń"}
            </p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {Math.round(practiceSeconds / 60)}
            </p>
            <p className="text-xs text-foreground-muted">min ćwiczeń</p>
          </div>
        </Card>

        {topics.map((topic) => {
          const topicLessons = lessons.filter((l) => l.topic_id === topic.id);
          const done = topicLessons.filter((l) => completedIds.has(l.id)).length;
          const percent = topicLessons.length > 0 ? (done / topicLessons.length) * 100 : 0;

          return (
            <Link key={topic.id} href={`/gitara/dzialy/${topic.slug}`}>
              <Card className="flex flex-col gap-2 transition-transform active:scale-[0.99]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1">
                      {topic.order_index}. {topic.title}
                    </CardTitle>
                    <p className="mt-0.5 text-xs tabular-nums text-foreground-muted">
                      {done}/{topicLessons.length} lekcji
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
