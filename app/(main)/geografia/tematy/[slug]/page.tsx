// ============================================================================
// app/(main)/geografia/tematy/[slug]/page.tsx
// One topic: its theory lessons first, then its exercise bank — theory
// before practice, since a student landing on a brand-new dział has nothing
// to attempt yet. Also carries the product-spec-required notice when the
// topic has fewer than 25 exercises (see components/geografia/topic-list-item
// .tsx header for the spec citation).
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Check, Clock, TriangleAlert, Upload } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  getCompletedLessonIds,
  getExercisesForTopic,
  getFavoriteExerciseIds,
  getLessonsForTopic,
  getTopicBySlug,
} from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseListItem } from "@/components/geografia/exercise/exercise-list-item";
import { cn } from "@/lib/utils";

const TARGET_EXERCISE_COUNT = 25;

export default async function GeografiaTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [lessons, completedLessonIds, exercises, favoriteIds, { data: attemptRows }] = await Promise.all([
    getLessonsForTopic(supabase, topic.id),
    getCompletedLessonIds(supabase, profile.id),
    getExercisesForTopic(supabase, topic.id),
    getFavoriteExerciseIds(supabase, profile.id),
    supabase.from("geo_exercise_attempts").select("exercise_id").eq("user_id", profile.id),
  ]);
  const solvedIds = new Set((attemptRows ?? []).map((r) => r.exercise_id as string));
  const doneCount = lessons.filter((l) => completedLessonIds.has(l.id)).length;

  return (
    <div>
      <PageHeader title={`Dział ${topic.cke_number}`} subtitle={topic.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <p className="text-sm text-foreground-muted">{topic.description}</p>

        {/* ——— Teoria ——— */}
        <div className="mt-1 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Teoria
          </h2>
          {lessons.length > 0 && (
            <span className="text-xs text-foreground-muted">
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
            const done = completedLessonIds.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/geografia/tematy/${topic.slug}/lekcja/${lesson.slug}`}>
                <Card className="flex items-start gap-3">
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
                </Card>
              </Link>
            );
          })
        )}

        {/* ——— Ćwiczenia ——— */}
        <h2 className="mt-3 text-sm font-semibold text-foreground">Ćwiczenia ({exercises.length})</h2>

        {exercises.length < TARGET_EXERCISE_COUNT && (
          <Card className="flex items-start gap-3 bg-warning-soft">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="min-w-0 flex-1">
              <CardTitle>Ten dział ma mniej niż {TARGET_EXERCISE_COUNT} ćwiczeń</CardTitle>
              <p className="mt-1 text-sm text-foreground-muted">
                Obecnie: {exercises.length}. Możesz wgrać własny arkusz z tego działu, żeby powiększyć bazę.
              </p>
              <Link href="/geografia/wgraj">
                <Button size="sm" variant="outline" className="mt-2">
                  <Upload className="h-4 w-4" />
                  Wgraj arkusz
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {exercises.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground-muted">Brak ćwiczeń w tym dziale — bądź pierwszy!</p>
        ) : (
          exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              isFavorite={favoriteIds.has(exercise.id)}
              isSolved={solvedIds.has(exercise.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
