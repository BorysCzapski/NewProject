// ============================================================================
// app/(main)/nauka/sluchanie/[id]/page.tsx
// Listening exercise detail: video + gap-fill transcript + submit, handled
// by the client ExerciseSession component. Loads any previous attempt's
// score to show as a "best so far" note (retries are allowed).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { ExerciseSession } from "@/components/listening/exercise-session";
import type { ListeningExercise } from "@/lib/types/database";

export default async function ListeningExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exercise } = await supabase
    .from("listening_exercises")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!exercise) notFound();

  const { data: attempts } = await supabase
    .from("listening_attempts")
    .select("score")
    .eq("exercise_id", id)
    .eq("user_id", profile.id);

  const previousBestScore =
    attempts && attempts.length > 0 ? Math.max(...attempts.map((a) => a.score as number)) : null;

  return (
    <div>
      <PageHeader title="Słuchanie" subtitle={(exercise as ListeningExercise).title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka/sluchanie"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie ćwiczenia
        </Link>

        <ExerciseSession exercise={exercise as ListeningExercise} previousBestScore={previousBestScore} />
      </div>
    </div>
  );
}
