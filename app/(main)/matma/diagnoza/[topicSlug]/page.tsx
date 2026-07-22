// ============================================================================
// app/(main)/matma/diagnoza/[topicSlug]/page.tsx
// Runs the diagnostic problem set for a single topic. If the problem bank
// isn't seeded deeply enough yet for a full 1-2-3 difficulty ladder,
// getDiagnosticProblemSet can come back empty — show a friendly message
// instead of handing the runner zero problems.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/matma/content";
import { getDiagnosticProblemSet } from "@/lib/matma/diagnostic";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { DiagnosticRunner } from "@/components/matma/diagnostic/diagnostic-runner";

export default async function DiagnozaTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, topicSlug);
  if (!topic) notFound();

  const problems = await getDiagnosticProblemSet(supabase, topic.id);

  return (
    <div>
      <PageHeader title={`Diagnoza: ${topic.title}`} subtitle="Kilka szybkich pytań, żeby ocenić punkt startowy" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/matma/diagnoza"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie działy
        </Link>

        {problems.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">
            Bank zadań dla tego działu jest jeszcze za mały, żeby przeprowadzić diagnozę. Spróbuj ponownie
            później albo zacznij naukę tego działu od podstaw.
          </Card>
        ) : (
          <DiagnosticRunner topicId={topic.id} topicSlug={topic.slug} problems={problems} />
        )}
      </div>
    </div>
  );
}
