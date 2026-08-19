// ============================================================================
// app/(main)/matura/nauka/[sectionSlug]/[taskId]/page.tsx
// Generic task attempt screen for any exact-match section — hands grading
// off to the client form, which calls the submitTaskAttempt Server Action
// (grading happens server-side). See MATURA_EXACT_MATCH_SECTION_SLUGS.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { MATURA_EXACT_MATCH_SECTION_SLUGS } from "@/lib/matura/sections";
import { PageHeader } from "@/components/layout/page-header";
import { TaskAttemptForm } from "@/components/matura/task-attempt-form";
import type { MaturaSection, MaturaSectionSlug, MaturaTask } from "@/lib/types/database";

export default async function MaturaSectionTaskPage({
  params,
}: {
  params: Promise<{ sectionSlug: string; taskId: string }>;
}) {
  const { sectionSlug, taskId } = await params;
  if (!MATURA_EXACT_MATCH_SECTION_SLUGS.includes(sectionSlug as MaturaSectionSlug)) notFound();

  await requireProfile();
  const supabase = await createClient();

  // The join pulls the section's language: the answer field needs it to decide
  // whether to offer the Spanish accent bar (see components/matura/accent-bar.tsx).
  const { data: task } = await supabase
    .from("matura_tasks")
    .select("*, matura_sections!inner(language)")
    .eq("id", taskId)
    .maybeSingle();
  if (!task) notFound();

  const { matura_sections, ...taskRow } = task as MaturaTask & {
    matura_sections: Pick<MaturaSection, "language">;
  };

  const backHref = `/matura/nauka/${sectionSlug}`;

  return (
    <div>
      <PageHeader title="Matura" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie zadania
        </Link>

        <TaskAttemptForm task={taskRow} backHref={backHref} language={matura_sections.language} />
      </div>
    </div>
  );
}
