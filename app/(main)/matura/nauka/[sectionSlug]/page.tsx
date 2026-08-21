// ============================================================================
// app/(main)/matura/nauka/[sectionSlug]/page.tsx
// Hub for any exact-match-graded section (środki językowe, czytanie, słuchanie
// — see MATURA_EXACT_MATCH_SECTION_SLUGS): the section's THEORY LIBRARY,
// grouped by kind, followed by its task bank with the student's last score.
// "pisanie" has its own dedicated route (different tables, AI-graded
// holistically) and is NOT served here.
//
// Lessons are listed, not inlined. Before 0017 this page concatenated every
// lesson in the section onto one screen, which was tolerable at one lesson per
// section and unusable at a dozen — each lesson now has its own page under
// teoria/, and this page only reads their titles and summaries.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_EXACT_MATCH_SECTION_SLUGS } from "@/lib/matura/sections";
import { getSectionLessons, groupLessonsByKind } from "@/lib/matura/theory";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { MaturaSection, MaturaSectionSlug, MaturaTask, MaturaTaskAttempt } from "@/lib/types/database";

export default async function MaturaSectionPage({
  params,
}: {
  params: Promise<{ sectionSlug: string }>;
}) {
  const { sectionSlug } = await params;
  if (!MATURA_EXACT_MATCH_SECTION_SLUGS.includes(sectionSlug as MaturaSectionSlug)) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("language", settings.language)
    .eq("level", settings.level)
    .eq("slug", sectionSlug)
    .maybeSingle();
  if (!sectionRow) notFound();
  const section = sectionRow as MaturaSection;

  const [lessons, { data: taskRows }, { data: attemptRows }] = await Promise.all([
    getSectionLessons(supabase, profile.id, section.id),
    supabase.from("matura_tasks").select("*").eq("section_id", section.id).order("created_at"),
    supabase
      .from("matura_task_attempts")
      .select("*")
      .eq("user_id", profile.id)
      .order("attempted_at", { ascending: false }),
  ]);

  const groups = groupLessonsByKind(lessons);
  const doneCount = lessons.filter((item) => item.completed).length;
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
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground-muted">Teoria</h2>
          {lessons.length > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {doneCount}/{lessons.length} przerobione
            </span>
          )}
        </div>

        {lessons.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Teoria do tej części pojawi się wkrótce.
          </Card>
        )}

        {groups.map((group) => (
          <section key={group.kind} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              {group.label}
            </h3>
            {group.lessons.map(({ lesson, completed }) => (
              <Link key={lesson.id} href={`/matura/nauka/${sectionSlug}/teoria/${lesson.slug}`}>
                <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1">{lesson.title}</CardTitle>
                    <CardDescription className="mt-0.5 line-clamp-2">{lesson.summary}</CardDescription>
                    <p className="mt-1 text-xs text-foreground-muted">{lesson.estimated_minutes} min</p>
                  </div>
                  {completed ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Check className="h-3.5 w-3.5 text-accent" />
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  )}
                </Card>
              </Link>
            ))}
          </section>
        ))}

        <h2 className="mt-2 text-sm font-semibold text-foreground-muted">Zadania</h2>

        {tasks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">Brak dostępnych zadań — wróć tu wkrótce.</Card>
        )}

        {tasks.map((task, i) => {
          const attempt = latestAttemptByTask.get(task.id);
          return (
            <Link key={task.id} href={`/matura/nauka/${sectionSlug}/zadanie/${task.id}`}>
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
