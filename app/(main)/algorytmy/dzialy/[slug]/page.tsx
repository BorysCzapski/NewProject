// ============================================================================
// app/(main)/algorytmy/dzialy/[slug]/page.tsx
// One dział: its lessons, then the exercise TYPES it is practised through.
//
// Theory before practice, and types rather than a numbered exercise list — the
// same model the Matura and Geografia apps use (see
// lib/matura/task-types.ts for the reasoning). Each type shows how many times
// the student has done it and how often they got it right; starting one hands
// out an exercise they have not seen, generating more when the queue runs dry.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Check, ChevronRight, Clock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getLessonsForTopic, getTopicBySlug } from "@/lib/algorytmy/content";
import { getTypeStats } from "@/lib/algorytmy/exercise-stock";
import { startExerciseType } from "@/lib/algorytmy/practice-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { TaskTypeCard } from "@/components/practice/type-card";
import { cn } from "@/lib/utils";

// Starting a type can generate an exercise inline, and the after() top-up runs
// on this segment's budget too — both are AI calls. Matches the 60 s every
// other AI path in this repo uses.
export const maxDuration = 60;

export default async function AlgorytmyTopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pusto?: string }>;
}) {
  const { slug } = await params;
  const { pusto } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [lessons, completedIds, typeStats] = await Promise.all([
    getLessonsForTopic(supabase, topic.id),
    getCompletedLessonIds(supabase, profile.id),
    getTypeStats(supabase, profile.id, topic.id),
  ]);

  const doneCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const totalCompleted = typeStats.reduce((sum, stat) => sum + stat.completedCount, 0);

  return (
    <div>
      <PageHeader title={`Dział ${topic.order_index}`} subtitle={topic.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <p className="text-sm text-foreground-muted">{topic.description}</p>

        {/* ——— Teoria ——— */}
        <div className="mt-1 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Teoria
          </h2>
          {lessons.length > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {doneCount} / {lessons.length} przerobionych
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <p className="rounded-(--radius-card) border border-dashed border-border px-4 py-5 text-center text-sm text-foreground-muted">
            Teoria do tego działu jest w przygotowaniu.
          </p>
        ) : (
          lessons.map((lesson, i) => {
            const done = completedIds.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/algorytmy/dzialy/${topic.slug}/lekcja/${lesson.slug}`}>
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

        {/* ——— Typy zadań ——— */}
        <div className="mt-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Typy zadań</h2>
          {totalCompleted > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {totalCompleted} wykonanych łącznie
            </span>
          )}
        </div>

        <p className="-mt-1 text-xs text-foreground-muted">
          Każdy typ możesz rozwiązywać bez końca — za każdym razem dostajesz inne zadanie.
        </p>

        {pusto && (
          <Card className="text-sm text-foreground-muted">
            Nie udało się teraz przygotować zadania tego typu. Spróbuj ponownie za chwilę.
          </Card>
        )}

        {typeStats.map((stat) => (
          <TaskTypeCard
            key={stat.typeDef.slug}
            action={startExerciseType}
            fields={{ topicSlug: topic.slug, typeSlug: stat.typeDef.slug }}
            label={stat.typeDef.label}
            description={stat.typeDef.description}
            completedCount={stat.completedCount}
            lastPoints={null}
            lastMaxPoints={null}
            averagePercent={stat.accuracyPercent}
          />
        ))}
      </div>
    </div>
  );
}
