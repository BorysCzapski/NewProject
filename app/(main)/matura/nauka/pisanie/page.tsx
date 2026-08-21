// ============================================================================
// app/(main)/matura/nauka/pisanie/page.tsx
// "Wypowiedź pisemna" hub: the section's theory library (CKE rubric, forms,
// connectors — see supabase/seed/matura*/04_lessons_pisanie.sql) followed by
// its writing task bank, each task tagged with the student's last AI-graded
// score if any.
//
// Lessons are listed rather than inlined, matching [sectionSlug]/page.tsx —
// see the note there for why.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionLessons, groupLessonsByKind } from "@/lib/matura/theory";
import { MATURA_WRITING_FORM_LABELS } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MaturaSection, MaturaWritingSubmission, MaturaWritingTask } from "@/lib/types/database";

export default async function PisaniePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("language", settings.language)
    .eq("level", settings.level)
    .eq("slug", "pisanie")
    .maybeSingle();
  if (!sectionRow) notFound();
  const section = sectionRow as MaturaSection;

  const [lessons, { data: taskRows }, { data: submissionRows }] = await Promise.all([
    getSectionLessons(supabase, profile.id, section.id),
    supabase.from("matura_writing_tasks").select("*").eq("section_id", section.id).order("created_at"),
    supabase
      .from("matura_writing_submissions")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const groups = groupLessonsByKind(lessons);
  const doneCount = lessons.filter((item) => item.completed).length;
  const tasks = (taskRows ?? []) as MaturaWritingTask[];
  const submissions = (submissionRows ?? []) as MaturaWritingSubmission[];
  const latestSubmissionByTask = new Map<string, MaturaWritingSubmission>();
  for (const submission of submissions) {
    if (!latestSubmissionByTask.has(submission.task_id)) latestSubmissionByTask.set(submission.task_id, submission);
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
              <Link key={lesson.id} href={`/matura/nauka/pisanie/teoria/${lesson.slug}`}>
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
          const submission = latestSubmissionByTask.get(task.id);
          return (
            <Link key={task.id} href={`/matura/nauka/pisanie/zadanie/${task.id}`}>
              <Card className="transition-transform active:scale-[0.99]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Badge className="mb-1.5">{MATURA_WRITING_FORM_LABELS[task.form_type]}</Badge>
                    <CardTitle>Zadanie {i + 1}</CardTitle>
                    <CardDescription className="mt-0.5 line-clamp-2">{task.instructions}</CardDescription>
                  </div>
                  {submission ? (
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                      {submission.points_awarded}/{submission.max_points}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
