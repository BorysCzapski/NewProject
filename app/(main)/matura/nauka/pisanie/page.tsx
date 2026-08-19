// ============================================================================
// app/(main)/matura/nauka/pisanie/page.tsx
// "Wypowiedź pisemna" hub: the section's lesson (CKE rubric, tips, worked
// example — see matura_lessons comment in supabase/seed/matura/
// 04_lessons_pisanie.sql) followed by its writing task bank, each task
// tagged with the student's last AI-graded score if any.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_WRITING_FORM_LABELS } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";
import type { MaturaLesson, MaturaSection, MaturaWritingSubmission, MaturaWritingTask } from "@/lib/types/database";

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

  const [{ data: lessonRows }, { data: taskRows }, { data: submissionRows }] = await Promise.all([
    supabase.from("matura_lessons").select("*").eq("section_id", section.id).order("order_index"),
    supabase.from("matura_writing_tasks").select("*").eq("section_id", section.id).order("created_at"),
    supabase
      .from("matura_writing_submissions")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const lessons = (lessonRows ?? []) as MaturaLesson[];
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
        {lessons.map((lesson) => (
          <GrammarLesson key={lesson.id} blocks={lesson.content as GrammarBlock[]} />
        ))}

        <h2 className="mt-2 text-sm font-semibold text-foreground-muted">Zadania</h2>

        {tasks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">Brak dostępnych zadań — wróć tu wkrótce.</Card>
        )}

        {tasks.map((task, i) => {
          const submission = latestSubmissionByTask.get(task.id);
          return (
            <Link key={task.id} href={`/matura/nauka/pisanie/${task.id}`}>
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
