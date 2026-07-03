// ============================================================================
// app/(main)/nauka/pisanie/page.tsx
// Writing module hub: pick a task type (or a random one) to start a new
// short-form writing task, and browse past submissions with their AI score.
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { NewTaskForm } from "@/components/writing/new-task-form";
import { ScoreBadge } from "@/components/writing/score-badge";
import { WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import type { WritingSubmission, WritingTask } from "@/lib/types/database";

function teaser(scenario: string): string {
  const flat = scenario.replace(/\s+/g, " ").trim();
  return flat.length > 90 ? `${flat.slice(0, 90)}…` : flat;
}

export default async function WritingHubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("writing_submissions")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const allSubmissions = (submissions ?? []) as WritingSubmission[];
  const taskIds = allSubmissions.map((s) => s.task_id);

  const tasksById = new Map<string, WritingTask>();
  if (taskIds.length > 0) {
    const { data: tasks } = await supabase.from("writing_tasks").select("*").in("id", taskIds);
    for (const task of (tasks ?? []) as WritingTask[]) tasksById.set(task.id, task);
  }

  // writing_submissions has no level column of its own (it's on the linked
  // writing_tasks row) — filter here so a level change doesn't leave old
  // submissions from a different level cluttering this list.
  const submissionList = allSubmissions.filter((s) => tasksById.get(s.task_id)?.level === profile.level);

  return (
    <div>
      <PageHeader
        title="Pisanie"
        subtitle="Krótkie formy oceniane przez AI"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-6">
          <CardTitle>Nowe zadanie</CardTitle>
          <CardDescription className="mt-1 mb-3">
            Wybierz typ zadania albo wylosuj dowolne, dopasowane do Twojego poziomu ({profile.level}).
          </CardDescription>
          <NewTaskForm />
        </Card>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Twoje prace</h2>
        {submissionList.length === 0 ? (
          <Card>
            <CardDescription>Nie masz jeszcze żadnych ocenionych prac. Zacznij od nowego zadania powyżej.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {submissionList.map((submission) => {
              const task = tasksById.get(submission.task_id);
              return (
                <Link key={submission.id} href={`/nauka/pisanie/${submission.task_id}`}>
                  <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                    <div className="min-w-0 flex-1">
                      <CardTitle>
                        {task ? WRITING_TASK_TYPE_LABELS[task.task_type] : "Zadanie pisemne"}
                      </CardTitle>
                      <CardDescription className="mt-0.5">
                        {task ? teaser(task.scenario) : ""}
                      </CardDescription>
                    </div>
                    {submission.score !== null && (
                      <ScoreBadge score={submission.score} className="shrink-0" />
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
