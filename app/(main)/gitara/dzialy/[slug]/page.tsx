// ============================================================================
// app/(main)/gitara/dzialy/[slug]/page.tsx
// One dział: its lessons in order. No per-dział exercise-type section like
// Algorytmy's — see the migration's module comment for why this app has no
// exercise bank; the graded practice this app offers instead (metronome,
// tuner, fretboard-explorer drills embedded in lessons) lives at /gitara/cwicz
// and inside the lessons themselves, not behind a dział-scoped queue.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Check, ChevronRight, Clock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getLessonsForTopic, getTopicBySlug } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function GitaraTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [lessons, completedIds] = await Promise.all([
    getLessonsForTopic(supabase, topic.id),
    getCompletedLessonIds(supabase, profile.id),
  ]);

  const doneCount = lessons.filter((l) => completedIds.has(l.id)).length;

  return (
    <div>
      <PageHeader title={`Dział ${topic.order_index}`} subtitle={topic.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <p className="text-sm text-foreground-muted">{topic.description}</p>

        <div className="mt-1 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Lekcje
          </h2>
          {lessons.length > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {doneCount} / {lessons.length} przerobionych
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <p className="rounded-(--radius-card) border border-dashed border-border px-4 py-5 text-center text-sm text-foreground-muted">
            Lekcje w tym dziale są w przygotowaniu.
          </p>
        ) : (
          lessons.map((lesson, i) => {
            const done = completedIds.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/gitara/dzialy/${topic.slug}/lekcja/${lesson.slug}`}>
                <Card className="flex items-start gap-3 transition-transform active:scale-[0.99]">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle>{lesson.title}</CardTitle>
                    {lesson.summary && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-foreground-muted">{lesson.summary}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
                      <Clock className="h-3 w-3" />
                      ok. {lesson.reading_minutes} min
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-foreground-muted" />
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
