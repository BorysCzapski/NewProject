// ============================================================================
// app/(main)/informatyka/egzamin/[slug]/wynik/page.tsx
// Summary of a finished timed session: points scored since `od` (session start,
// ms), problems worked on but not scored yet (the key is unlocked now), and
// problems left untouched.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems, getExamBySlug } from "@/lib/informatyka/content";
import { getProgressMap } from "@/lib/informatyka/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProblemRow } from "@/components/informatyka/problem-row";

export default async function WynikPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ od?: string }>;
}) {
  const { slug } = await params;
  const { od } = await searchParams;
  const startMs = Number(od);
  if (!Number.isFinite(startMs) || startMs <= 0) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();
  const exam = await getExamBySlug(supabase, slug);
  if (!exam) notFound();

  const [all, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);
  const problems = all.filter((p) => p.exam.id === exam.id);

  const scored = problems.filter((p) => {
    const row = progress.get(p.id);
    return row?.status === "done" && row.done_at && new Date(row.done_at).getTime() >= startMs;
  });
  const earned = scored.reduce((sum, p) => sum + Number(progress.get(p.id)?.score ?? 0), 0);

  const touched = (id: string) => {
    const row = progress.get(id);
    return Boolean(row && (row.answer_text || row.code || row.sql_text || row.canvas_path || row.sheet_path));
  };
  const toScore = problems.filter((p) => !scored.includes(p) && touched(p.id));
  const untouched = problems.filter((p) => !scored.includes(p) && !touched(p.id));

  return (
    <div>
      <PageHeader title="Wynik egzaminu" subtitle={exam.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-1 text-center">
          <CardDescription>Punkty zdobyte w tej sesji</CardDescription>
          <CardTitle className="text-3xl">
            {earned} / {exam.max_points}
          </CardTitle>
          <CardDescription>
            {scored.length} ocenionych, {toScore.length} do oceny, {untouched.length} nietkniętych
          </CardDescription>
        </Card>

        {toScore.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Do oceny z kluczem</h2>
            <p className="text-xs text-foreground-muted">Klucz jest już odblokowany — otwórz zadanie, sprawdź i przyznaj sobie punkty.</p>
            {toScore.map((p) => (
              <ProblemRow key={p.id} problem={p} progress={progress.get(p.id)} hideTaskTitle />
            ))}
          </section>
        )}
        {scored.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Ocenione</h2>
            {scored.map((p) => (
              <ProblemRow key={p.id} problem={p} progress={progress.get(p.id)} hideTaskTitle />
            ))}
          </section>
        )}
        {untouched.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Nietknięte</h2>
            {untouched.map((p) => (
              <ProblemRow key={p.id} problem={p} progress={progress.get(p.id)} hideTaskTitle />
            ))}
          </section>
        )}
        <Link href={`/informatyka/arkusze/${exam.slug}`} className="text-center text-sm font-medium text-foreground-muted">
          Wróć do listy zadań
        </Link>
      </div>
    </div>
  );
}
