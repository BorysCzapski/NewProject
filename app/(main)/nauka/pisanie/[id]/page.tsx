// ============================================================================
// app/(main)/nauka/pisanie/[id]/page.tsx
// Writing task detail: shows the compose form if the user hasn't submitted
// yet for this task, otherwise hands off to the client component that shows
// the AI grading and the ephemeral follow-up chat.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { WritingTaskDetail } from "@/components/writing/writing-task-detail";
import type { WritingSubmission, WritingTask } from "@/lib/types/database";

export default async function WritingTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  // Independent of each other (both only need `id`/profile.id) — fetch concurrently.
  const [{ data: task }, { data: submission }] = await Promise.all([
    supabase.from("writing_tasks").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("writing_submissions")
      .select("*")
      .eq("task_id", id)
      .eq("user_id", profile.id)
      .maybeSingle(),
  ]);
  if (!task) notFound();

  return (
    <div>
      <PageHeader title="Pisanie" subtitle={`Poziom ${task.level}`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/nauka/pisanie"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie zadania
        </Link>

        <WritingTaskDetail
          task={task as WritingTask}
          initialSubmission={(submission as WritingSubmission | null) ?? null}
        />
      </div>
    </div>
  );
}
