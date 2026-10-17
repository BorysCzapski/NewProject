// ============================================================================
// app/(main)/informatyka/arkusze/[slug]/page.tsx
// One exam paper: its tasks (grouped into Część I / II for the 2015 formula)
// with every sub-problem, status and points.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems, getExamBySlug } from "@/lib/informatyka/content";
import { getProgressMap, tally } from "@/lib/informatyka/progress";
import { PageHeader } from "@/components/layout/page-header";
import { ProblemRow } from "@/components/informatyka/problem-row";

export default async function ArkuszPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const exam = await getExamBySlug(supabase, slug);
  if (!exam) notFound();

  const [allProblems, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);
  const problems = allProblems.filter((p) => p.exam.id === exam.id);
  const t = tally(problems, progress);

  // group by task, keeping paper order
  const groups: { number: number; part: 1 | 2 | null; title: string; items: typeof problems }[] = [];
  for (const p of problems) {
    let g = groups.find((x) => x.number === p.task_number);
    if (!g) groups.push((g = { number: p.task_number, part: p.task_part, title: p.task_title, items: [] }));
    g.items.push(p);
  }

  return (
    <div>
      <PageHeader title={exam.title} subtitle={`${t.earned}/${t.possible} pkt · ${t.done}/${t.total} zadań`} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {groups.map((g, i) => (
          <section key={g.number} className="flex flex-col gap-2">
            {g.part && g.part !== groups[i - 1]?.part ? (
              <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Część {g.part === 1 ? "I — pisemna" : "II — na komputerze"}
              </h2>
            ) : null}
            <h3 className="text-sm font-semibold text-foreground-muted">
              Zadanie {g.number}
              {g.title ? ` — ${g.title}` : ""}
            </h3>
            {g.items.map((p) => (
              <ProblemRow key={p.id} problem={p} progress={progress.get(p.id)} hideTaskTitle />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
