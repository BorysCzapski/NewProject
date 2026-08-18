// ============================================================================
// app/(main)/geografia/cwiczenie/[id]/page.tsx
// Solves one exercise. Deliberately does NOT pass correct_answer /
// geo_map_tasks.correct_answer to the client solver components — grading
// happens server-side in lib/geografia/actions.ts, which returns only the
// post-submit review payload (see ExerciseAttemptReview).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getExerciseById, getMapTaskForExercise } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { FavoriteButton } from "@/components/geografia/exercise/favorite-button";
import { HintList } from "@/components/geografia/exercise/hint-list";
import { McSolver } from "@/components/geografia/exercise/mc-solver";
import { OpenSolver } from "@/components/geografia/exercise/open-solver";
import { MapSolver } from "@/components/geografia/exercise/map-solver";

export default async function GeografiaExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { id } = await params;
  const { review } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();

  const exercise = await getExerciseById(supabase, id);
  if (!exercise) notFound();

  const [{ data: topicRow }, favoriteRow, mapTask] = await Promise.all([
    supabase.from("geo_topics").select("slug, title, cke_number").eq("id", exercise.topic_id).maybeSingle(),
    supabase.from("geo_favorites").select("exercise_id").eq("user_id", profile.id).eq("exercise_id", id).maybeSingle(),
    exercise.type === "map" ? getMapTaskForExercise(supabase, exercise.id) : Promise.resolve(null),
  ]);
  const topic = topicRow as { slug: string; title: string; cke_number: string } | null;

  return (
    <div>
      <PageHeader
        title={`Dział ${topic?.cke_number ?? ""}`}
        subtitle={topic?.title ?? ""}
        action={<FavoriteButton exerciseId={exercise.id} initialFavorited={!!favoriteRow.data} />}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {topic && (
          <Link
            href={`/geografia/tematy/${topic.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do działu
          </Link>
        )}

        <p className="text-base font-medium text-foreground">{exercise.prompt.statement}</p>

        <HintList hints={exercise.hints} />

        {exercise.type === "mc" ? (
          <McSolver
            exerciseId={exercise.id}
            options={exercise.options ?? []}
            pointsMax={exercise.points_max}
            isSpacedReview={review === "1"}
          />
        ) : exercise.type === "open" ? (
          <OpenSolver exerciseId={exercise.id} pointsMax={exercise.points_max} />
        ) : mapTask ? (
          <MapSolver
            exerciseId={exercise.id}
            interactionType={mapTask.interaction_type}
            inputData={mapTask.input_data as never}
            pointsMax={exercise.points_max}
            isSpacedReview={review === "1"}
          />
        ) : (
          <p className="text-sm text-danger">Brak danych zadania mapowego.</p>
        )}
      </div>
    </div>
  );
}
