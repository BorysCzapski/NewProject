// ============================================================================
// app/(main)/silownia/treningi/page.tsx
// Pełny dziennik treningów: dodawanie, edycja, kasowanie, historia
// pogrupowana po dniach. Patrz components/silownia/workout-log.tsx.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLastWorkout, listWorkouts } from "@/lib/silownia/queries";
import { suggestNextSplit } from "@/lib/silownia/suggestion";
import { todayKey } from "@/lib/silownia/format";
import { PageHeader } from "@/components/layout/page-header";
import { WorkoutLog } from "@/components/silownia/workout-log";

export default async function TreningiPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const [workouts, lastWorkout] = await Promise.all([
    listWorkouts(supabase, profile.id, { limit: 100 }),
    getLastWorkout(supabase, profile.id),
  ]);

  return (
    <div>
      <PageHeader title="Treningi" subtitle="Dziennik sesji treningowych" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <WorkoutLog workouts={workouts} today={today} suggestedSplit={suggestNextSplit(lastWorkout)} />
      </div>
    </div>
  );
}
