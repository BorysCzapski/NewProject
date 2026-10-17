// ============================================================================
// app/(main)/informatyka/typy/[key]/page.tsx
// Every problem of one kind (programowanie, SQL, …) or one topic (rekurencja,
// systemy liczbowe, …) across all exam sessions, newest first.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/lib/informatyka/content";
import { getProgressMap, tally } from "@/lib/informatyka/progress";
import { KINDS, TOPICS } from "@/lib/informatyka/taxonomy";
import { PageHeader } from "@/components/layout/page-header";
import { ProblemRow } from "@/components/informatyka/problem-row";

export default async function TypyPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const kind = KINDS.find((k) => k.id === key);
  const topicName = TOPICS[key];
  if (!kind && !topicName) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();
  const [all, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);

  const problems = all.filter((p) => (kind ? p.kind === kind.id : p.topic === key));
  const t = tally(problems, progress);

  return (
    <div>
      <PageHeader
        title={kind?.label ?? topicName}
        subtitle={`${t.earned}/${t.possible} pkt · ${t.done}/${t.total} zadań`}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-2 px-5 py-5">
        {problems.map((p) => (
          <ProblemRow key={p.id} problem={p} progress={progress.get(p.id)} showExam />
        ))}
      </div>
    </div>
  );
}
