// ============================================================================
// app/(main)/maturalnik/[chapterSlug]/[problemNumber]/page.tsx
// Single problem: scanned statement image, "zrobione" toggle, a drawing
// canvas that auto-saves/reloads, and a lazy AI solution reveal.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getChapterBySlug, getProblemByChapterAndNumber, getProblemsByChapter } from "@/lib/maturalnik/content";
import { getProblemProgress } from "@/lib/maturalnik/progress";
import { getProblemImageSignedUrl, getCanvasSignedUrl } from "@/lib/maturalnik/storage";
import { PageHeader } from "@/components/layout/page-header";
import { ProblemCheckbox } from "@/components/maturalnik/problem-checkbox";
import { CanvasPanel } from "@/components/maturalnik/canvas-panel";
import { SolutionPanel } from "@/components/maturalnik/solution-panel";

export default async function MaturalnikProblemPage({
  params,
}: {
  params: Promise<{ chapterSlug: string; problemNumber: string }>;
}) {
  const { chapterSlug, problemNumber } = await params;
  const number = Number(problemNumber);
  const profile = await requireProfile();
  const supabase = await createClient();

  const chapter = await getChapterBySlug(supabase, chapterSlug);
  if (!chapter || !Number.isInteger(number)) notFound();

  const [problem, allProblems] = await Promise.all([
    getProblemByChapterAndNumber(supabase, chapter.id, number),
    getProblemsByChapter(supabase, chapter.id),
  ]);
  if (!problem) notFound();

  const [progress, imageUrl] = await Promise.all([
    getProblemProgress(supabase, profile.id, problem.id),
    getProblemImageSignedUrl(supabase, problem.image_path),
  ]);
  const canvasUrl = progress?.canvas_path ? await getCanvasSignedUrl(supabase, progress.canvas_path) : null;

  const prevProblem = allProblems.find((p) => p.number === number - 1);
  const nextProblem = allProblems.find((p) => p.number === number + 1);

  return (
    <div>
      <PageHeader
        title={`Zadanie ${chapter.number}.${problem.number}`}
        subtitle={chapter.title}
        action={<ProblemCheckbox problemId={problem.id} initialDone={progress?.done ?? false} />}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {problem.flagged_for_review && (
          <div className="flex items-start gap-2 rounded-(--radius-control) bg-warning-soft p-2.5 text-xs text-warning">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Ten obrazek mógł się uszkodzić przy imporcie z notatnika (sklejenie z sąsiednią stroną) — jeśli treść
              nie ma sensu, to dlatego.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-(--radius-card) border border-border bg-surface">
          {imageUrl ? (
            // Zewnętrzny, podpisany URL z prywatnego bucketu Supabase — rozmiar
            // nieznany z góry (zdjęcia mają różne proporcje), więc plain <img>
            // zamiast next/image, które wymaga znanych wymiarów albo fill+kontenera.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={`Treść zadania ${chapter.number}.${problem.number}`} className="w-full" />
          ) : (
            <p className="p-4 text-center text-sm text-foreground-muted">Nie udało się wczytać obrazka zadania.</p>
          )}
        </div>

        <CanvasPanel problemId={problem.id} initialImageUrl={canvasUrl} />

        <SolutionPanel problemId={problem.id} initialSolution={problem.ai_solution} />

        <div className="flex items-center justify-between gap-3 pt-2">
          {prevProblem ? (
            <Link
              href={`/maturalnik/${chapter.slug}/${prevProblem.number}`}
              className="flex items-center gap-1 text-sm font-medium text-foreground-muted"
            >
              <ChevronLeft className="h-4 w-4" /> Poprzednie
            </Link>
          ) : (
            <span />
          )}
          {nextProblem ? (
            <Link
              href={`/maturalnik/${chapter.slug}/${nextProblem.number}`}
              className="flex items-center gap-1 text-sm font-medium text-foreground-muted"
            >
              Następne <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
