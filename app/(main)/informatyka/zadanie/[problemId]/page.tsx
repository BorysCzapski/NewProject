// ============================================================================
// app/(main)/informatyka/zadanie/[problemId]/page.tsx
// Solving one problem: the exam statement (page crops), a canvas / written
// answer workspace, then "check with the key" and self-scoring.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems, getProblemDetail } from "@/lib/informatyka/content";
import { getProblemProgress } from "@/lib/informatyka/progress";
import { getCanvasUrl, getPageUrls } from "@/lib/informatyka/storage";
import { KIND_LABEL, examShortLabel, topicLabel } from "@/lib/informatyka/taxonomy";
import { PageHeader } from "@/components/layout/page-header";
import { ProblemSolver } from "@/components/informatyka/problem-solver";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function ZadaniePage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;
  if (!UUID.test(problemId)) notFound();
  const profile = await requireProfile();
  const supabase = await createClient();

  const detail = await getProblemDetail(supabase, problemId);
  if (!detail) notFound();
  const { problem, task, exam } = detail;

  const [progress, introUrls, statementUrls, keyUrls, all] = await Promise.all([
    getProblemProgress(supabase, profile.id, problem.id),
    getPageUrls(supabase, task.intro_image_paths),
    getPageUrls(supabase, problem.statement_image_paths),
    getPageUrls(supabase, problem.key_image_paths),
    getAllProblems(supabase),
  ]);
  const canvasUrl = progress?.canvas_path ? await getCanvasUrl(supabase, progress.canvas_path) : null;

  const siblings = all.filter((p) => p.exam.id === exam.id);
  const index = siblings.findIndex((p) => p.id === problem.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <div>
      <PageHeader
        title={`Zadanie ${problem.label}`}
        subtitle={`${examShortLabel(exam)} · ${KIND_LABEL[problem.kind]} · ${topicLabel(problem.topic)}`}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5 lg:max-w-5xl">
        <ProblemSolver
          problemId={problem.id}
          examId={exam.id}
          dataFiles={problem.data_files}
          resultFile={problem.result_file}
          sqlExtraSchema={problem.sql_extra_schema}
          initialCode={progress?.code ?? ""}
          initialSql={progress?.sql_text ?? ""}
          pointsMax={problem.points_max}
          kind={problem.kind}
          taskNumber={task.number}
          taskTitle={task.title}
          introUrls={introUrls}
          statementUrls={statementUrls}
          keyUrls={keyUrls}
          canvasUrl={canvasUrl}
          initialAnswer={progress?.answer_text ?? ""}
          initialStatus={progress?.status ?? "todo"}
          initialScore={progress?.score ?? null}
        />

        <div className="flex items-center justify-between gap-3 pt-2">
          {prev ? (
            <Link
              href={`/informatyka/zadanie/${prev.id}`}
              className="flex items-center gap-1 text-sm font-medium text-foreground-muted"
            >
              <ChevronLeft className="h-4 w-4" /> {prev.label}
            </Link>
          ) : (
            <span />
          )}
          <Link href={`/informatyka/arkusze/${exam.slug}`} className="text-sm font-medium text-foreground-muted">
            Lista zadań
          </Link>
          {next ? (
            <Link
              href={`/informatyka/zadanie/${next.id}`}
              className="flex items-center gap-1 text-sm font-medium text-foreground-muted"
            >
              {next.label} <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
