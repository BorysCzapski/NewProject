// ============================================================================
// app/(main)/algorytmy/dzialy/page.tsx
// All 12 działy, grouped by category and ordered as the prerequisite chain
// (lib/algorytmy/topics.ts explains why the order is what it is). Each card
// carries the student's lesson progress for that dział.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics } from "@/lib/algorytmy/content";
import { ALGO_CATEGORY_LABELS, type AlgoCategory } from "@/lib/algorytmy/topics";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { AlgoLesson } from "@/lib/types/database";

export default async function AlgorytmyTopicsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, { data: lessonRows }] = await Promise.all([
    getTopics(supabase),
    getCompletedLessonIds(supabase, profile.id),
    supabase.from("algo_lessons").select("id, topic_id"),
  ]);

  const lessons = (lessonRows ?? []) as Array<Pick<AlgoLesson, "id" | "topic_id">>;
  const lessonsByTopic = new Map<string, string[]>();
  for (const lesson of lessons) {
    const list = lessonsByTopic.get(lesson.topic_id) ?? [];
    list.push(lesson.id);
    lessonsByTopic.set(lesson.topic_id, list);
  }

  // Preserve catalog order within each category — the order IS the curriculum.
  const categories: AlgoCategory[] = ["podstawy", "struktury", "algorytmy"];

  return (
    <div>
      <PageHeader title="Działy" subtitle="Od złożoności do programowania dynamicznego" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {categories.map((category) => {
          const inCategory = topics.filter((t) => t.category === category);
          if (inCategory.length === 0) return null;

          return (
            <section key={category} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                {ALGO_CATEGORY_LABELS[category]}
              </h2>
              {inCategory.map((topic) => {
                const ids = lessonsByTopic.get(topic.id) ?? [];
                const done = ids.filter((id) => completedIds.has(id)).length;
                const allDone = ids.length > 0 && done === ids.length;

                return (
                  <Link key={topic.id} href={`/algorytmy/dzialy/${topic.slug}`}>
                    <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                      <div className="min-w-0 flex-1">
                        <CardTitle>
                          {topic.order_index}. {topic.title}
                        </CardTitle>
                        <CardDescription className="mt-0.5 line-clamp-2">
                          {topic.description}
                        </CardDescription>
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
            </section>
          );
        })}

        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Działy pojawią się po wgraniu danych startowych (<code>npm run db seed</code>).
          </Card>
        )}
      </div>
    </div>
  );
}
