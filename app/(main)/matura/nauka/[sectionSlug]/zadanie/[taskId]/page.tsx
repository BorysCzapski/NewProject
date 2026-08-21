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
import { getTaskType } from "@/lib/matura/task-types";
import { startTaskType } from "@/lib/matura/practice-actions";
import { PageHeader } from "@/components/layout/page-header";
import { TaskAttemptForm } from "@/components/matura/task-attempt-form";
import { NextOfTypeButton } from "@/components/practice/next-of-type-button";
import type { MaturaSection, MaturaSectionSlug, MaturaTask } from "@/lib/types/database";

// Handing out a task can generate one inline, and the after() top-up runs on
// this segment's budget too — both are AI calls. The platform default (10s on
// Vercel) would cut them off; 60 is what every other AI path in this repo uses
// (see app/api/geografia/import-exercises/route.ts).
export const maxDuration = 60;

export default async function MaturaSectionTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ sectionSlug: string; taskId: string }>;
  searchParams: Promise<{ typ?: string }>;
}) {
  const { sectionSlug, taskId } = await params;
  if (!MATURA_EXACT_MATCH_SECTION_SLUGS.includes(sectionSlug as MaturaSectionSlug)) notFound();
  const { typ } = await searchParams;
  // Only honour a type that really belongs to this section — the marker comes
  // from the query string, so it is student-editable input.
  const typeDef = typ ? getTaskType(typ) : undefined;
  const practisedType = typeDef && typeDef.section === sectionSlug ? typeDef : undefined;

  await requireProfile();
  const supabase = await createClient();

  // The join pulls the section's language: the answer field needs it to decide
  // whether to offer the Spanish accent bar (see components/ui/accent-bar.tsx).
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
          {practisedType ? practisedType.label : "Wszystkie zadania"}
        </Link>

        <TaskAttemptForm task={taskRow} backHref={backHref} language={matura_sections.language} />

        {practisedType && (
          <NextOfTypeButton
            action={startTaskType}
            fields={{ sectionSlug, typeSlug: practisedType.slug }}
          />
        )}
      </div>
    </div>
  );
}
