// ============================================================================
// app/(main)/geografia/tematy/[slug]/page.tsx
// One topic's exercise list, plus the product-spec-required notice when it
// has fewer than 25 exercises (see components/geografia/topic-list-item.tsx
// header comment for the exact spec citation).
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { TriangleAlert, Upload } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getExercisesForTopic, getFavoriteExerciseIds, getTopicBySlug } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseListItem } from "@/components/geografia/exercise/exercise-list-item";

const TARGET_EXERCISE_COUNT = 25;

export default async function GeografiaTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [exercises, favoriteIds, { data: attemptRows }] = await Promise.all([
    getExercisesForTopic(supabase, topic.id),
    getFavoriteExerciseIds(supabase, profile.id),
    supabase.from("geo_exercise_attempts").select("exercise_id").eq("user_id", profile.id),
  ]);
  const solvedIds = new Set((attemptRows ?? []).map((r) => r.exercise_id as string));

  return (
    <div>
      <PageHeader title={`Dział ${topic.cke_number}`} subtitle={topic.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <p className="text-sm text-foreground-muted">{topic.description}</p>

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
