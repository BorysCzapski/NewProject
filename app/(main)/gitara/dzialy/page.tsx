// ============================================================================
// app/(main)/gitara/dzialy/page.tsx
// All 5 działy, in the prerequisite order lib/gitara/topics.ts's module
// comment explains. Flat list, not grouped by category — unlike Algorytmy's
// 12 działy across 3 categories, 5 działy read fine as one list.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { GtrLesson } from "@/lib/types/database";

export default async function GitaraTopicsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, { data: lessonRows }] = await Promise.all([
    getTopics(supabase),
    getCompletedLessonIds(supabase, profile.id),
    supabase.from("gtr_lessons").select("id, topic_id"),
  ]);

  const lessons = (lessonRows ?? []) as Array<Pick<GtrLesson, "id" | "topic_id">>;
  const lessonsByTopic = new Map<string, string[]>();
  for (const lesson of lessons) {
    const list = lessonsByTopic.get(lesson.topic_id) ?? [];
    list.push(lesson.id);
    lessonsByTopic.set(lesson.topic_id, list);
  }

  return (
    <div>
      <PageHeader title="Działy" subtitle="Od postawy do technik gry" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {topics.map((topic) => {
          const ids = lessonsByTopic.get(topic.id) ?? [];
          const done = ids.filter((id) => completedIds.has(id)).length;
          const allDone = ids.length > 0 && done === ids.length;

          return (
            <Link key={topic.id} href={`/gitara/dzialy/${topic.slug}`}>
              <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                <div className="min-w-0 flex-1">
                  <CardTitle>
                    {topic.order_index}. {topic.title}
                  </CardTitle>
                  <CardDescription className="mt-0.5 line-clamp-2">{topic.description}</CardDescription>
                  {ids.length > 0 && (
                    <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                      {done}/{ids.length} lekcji przerobionych
                    </p>
                  )}
                </div>
                {allDone ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                    <Check className="h-3.5 w-3.5 text-accent" />
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                )}
              </Card>
            </Link>
          );
        })}

        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Działy pojawią się po wgraniu danych startowych z <code>supabase/seed/gitara/</code>.
          </Card>
        )}
      </div>
    </div>
  );
}
