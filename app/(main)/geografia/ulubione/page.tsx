// ============================================================================
// app/(main)/geografia/ulubione/page.tsx
// Favorited exercises across all topics.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { ExerciseListItem } from "@/components/geografia/exercise/exercise-list-item";
import type { GeoExercise } from "@/lib/types/database";

export default async function GeografiaFavoritesPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: favoriteRows }, { data: attemptRows }] = await Promise.all([
    supabase.from("geo_favorites").select("geo_exercises(*)").eq("user_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("geo_exercise_attempts").select("exercise_id").eq("user_id", profile.id),
  ]);
  const solvedIds = new Set((attemptRows ?? []).map((r) => r.exercise_id as string));
  const exercises = ((favoriteRows ?? []) as unknown as Array<{ geo_exercises: GeoExercise | null }>)
    .map((r) => r.geo_exercises)
    .filter((e): e is GeoExercise => !!e);

  return (
    <div>
      <PageHeader title="Ulubione" subtitle="Ćwiczenia oznaczone gwiazdką" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {exercises.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground-muted">
            Nie masz jeszcze ulubionych ćwiczeń — oznacz gwiazdką te, do których chcesz łatwo wracać.
          </p>
        ) : (
          exercises.map((exercise) => (
            <ExerciseListItem key={exercise.id} exercise={exercise} isFavorite isSolved={solvedIds.has(exercise.id)} />
          ))
        )}
      </div>
    </div>
  );
}
