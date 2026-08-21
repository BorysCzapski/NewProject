// ============================================================================
// app/(main)/matura/nauka/pisanie/[taskId]/page.tsx
// One writing task's compose/review screen — hands grading off to the
// client form, which calls the submitWritingTask Server Action (AI grading
// against the CKE rubric happens server-side).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { WritingTaskForm } from "@/components/matura/writing-task-form";
import type { MaturaSection, MaturaWritingSubmission, MaturaWritingTask } from "@/lib/types/database";

const BACK_HREF = "/matura/nauka/pisanie";

export default async function PisanieTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("matura_writing_tasks")
    .select("*, matura_sections!inner(level, language)")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) notFound();

  const { matura_sections, ...taskRow } = task as MaturaWritingTask & {
    matura_sections: Pick<MaturaSection, "level" | "language">;
  };

  const { data: submission } = await supabase
    .from("matura_writing_submissions")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <PageHeader title="Wypowiedź pisemna" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={BACK_HREF}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie zadania
        </Link>

        <WritingTaskForm
          task={taskRow}
          language={matura_sections.language}
          level={matura_sections.level}
          initialSubmission={submission as MaturaWritingSubmission | null}
        />
      </div>
    </div>
  );
}
