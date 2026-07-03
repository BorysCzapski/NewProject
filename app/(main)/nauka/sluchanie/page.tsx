// ============================================================================
// app/(main)/nauka/sluchanie/page.tsx
// Listening module hub: paste a YouTube link to create a new gap-fill
// exercise, and browse existing exercises at the user's level, most recent
// first, marking those already completed.
// ============================================================================
import Link from "next/link";
import { Headphones, CheckCircle2 } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge, LevelBadge } from "@/components/ui/badge";
import { NewExerciseForm } from "@/components/listening/new-exercise-form";
import type { ListeningExercise } from "@/lib/types/database";

export default async function ListeningHubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exercises } = await supabase
    .from("listening_exercises")
    .select("*")
    .eq("level", profile.level)
    .order("created_at", { ascending: false });

  const exerciseList = (exercises ?? []) as ListeningExercise[];

  const { data: attempts } = await supabase
    .from("listening_attempts")
    .select("exercise_id")
    .eq("user_id", profile.id);

  const completedIds = new Set((attempts ?? []).map((a) => a.exercise_id as string));

  return (
    <div>
      <PageHeader
        title="Słuchanie"
        subtitle="Filmiki z YouTube i luki w transkrypcji"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-6">
          <CardTitle>Nowe ćwiczenie</CardTitle>
          <CardDescription className="mt-1 mb-3">
            Wklej link do filmiku z napisami, a przygotujemy z niego ćwiczenie ze słuchania
            dopasowane do Twojego poziomu ({profile.level}).
          </CardDescription>
          <NewExerciseForm />
        </Card>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Ćwiczenia na Twoim poziomie</h2>
        {exerciseList.length === 0 ? (
          <Card>
            <CardDescription>Nie ma jeszcze żadnych ćwiczeń na Twoim poziomie — utwórz pierwsze powyżej.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {exerciseList.map((exercise) => (
              <Link key={exercise.id} href={`/nauka/sluchanie/${exercise.id}`}>
                <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Headphones className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <CardTitle className="truncate">{exercise.title}</CardTitle>
                    <CardDescription className="mt-0.5">{exercise.gaps.length} luk do uzupełnienia</CardDescription>
                  </span>
                  {completedIds.has(exercise.id) && (
                    <Badge className="shrink-0 gap-1 bg-primary-soft text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ukończono
                    </Badge>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
