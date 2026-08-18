// ============================================================================
// app/(main)/matura/nauka/srodki-jezykowe/[taskId]/page.tsx
// One task's attempt screen — hands grading off to the client form, which
// calls the submitTaskAttempt Server Action (grading happens server-side).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { TaskAttemptForm } from "@/components/matura/task-attempt-form";
import type { MaturaTask } from "@/lib/types/database";

const BACK_HREF = "/matura/nauka/srodki-jezykowe";

export default async function SrodkiJezykoweTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase.from("matura_tasks").select("*").eq("id", taskId).maybeSingle();
  if (!task) notFound();

  return (
    <div>
      <PageHeader title="Znajomość środków językowych" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={BACK_HREF}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie zadania
        </Link>

        <TaskAttemptForm task={task as MaturaTask} backHref={BACK_HREF} />
      </div>
    </div>
  );
}
