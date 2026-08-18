// ============================================================================
// app/(main)/matura/nauka/srodki-jezykowe/page.tsx
// "Znajomość środków językowych" hub: the section's lesson (reuses
// GrammarLesson — see matura_lessons comment in 0013_matura.sql) followed by
// its task bank, each task tagged with the student's last score if any.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";
import type { MaturaLesson, MaturaSection, MaturaTask, MaturaTaskAttempt } from "@/lib/types/database";

export default async function SrodkiJezykowePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("level", settings.level)
    .eq("slug", "srodki-jezykowe")
    .maybeSingle();
  if (!sectionRow) notFound();
  const section = sectionRow as MaturaSection;

  const [{ data: lessonRows }, { data: taskRows }, { data: attemptRows }] = await Promise.all([
    supabase.from("matura_lessons").select("*").eq("section_id", section.id).order("order_index"),
    supabase.from("matura_tasks").select("*").eq("section_id", section.id).order("created_at"),
    supabase
      .from("matura_task_attempts")
      .select("*")
      .eq("user_id", profile.id)
      .order("attempted_at", { ascending: false }),
  ]);

  const lessons = (lessonRows ?? []) as MaturaLesson[];
  const tasks = (taskRows ?? []) as MaturaTask[];
  const attempts = (attemptRows ?? []) as MaturaTaskAttempt[];
  const latestAttemptByTask = new Map<string, MaturaTaskAttempt>();
  for (const attempt of attempts) {
    if (!latestAttemptByTask.has(attempt.task_id)) latestAttemptByTask.set(attempt.task_id, attempt);
  }

  return (
    <div>
      <PageHeader title={section.title} subtitle={section.description} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {lessons.map((lesson) => (
          <GrammarLesson key={lesson.id} blocks={lesson.content as GrammarBlock[]} />
        ))}

        <h2 className="mt-2 text-sm font-semibold text-foreground-muted">Zadania</h2>

        {tasks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">Brak dostępnych zadań — wróć tu wkrótce.</Card>
        )}

        {tasks.map((task, i) => {
          const attempt = latestAttemptByTask.get(task.id);
          return (
            <Link key={task.id} href={`/matura/nauka/srodki-jezykowe/${task.id}`}>
              <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                <div className="min-w-0 flex-1">
                  <CardTitle>Zadanie {i + 1}</CardTitle>
                  <CardDescription className="mt-0.5 line-clamp-1">{task.content.instructions}</CardDescription>
                </div>
                {attempt ? (
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                    {attempt.points_awarded}/{attempt.max_points}
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
