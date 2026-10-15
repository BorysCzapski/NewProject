// ============================================================================
// app/(main)/maturalnik/[chapterSlug]/page.tsx
// Problem list for one chapter: checkbox + flagged badge + link to the
// solver view.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getChapterBySlug, getProblemsByChapter } from "@/lib/maturalnik/content";
import { getProgressForChapterProblems } from "@/lib/maturalnik/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProblemCheckbox } from "@/components/maturalnik/problem-checkbox";

export default async function MaturalnikChapterPage({
  params,
}: {
  params: Promise<{ chapterSlug: string }>;
}) {
  const { chapterSlug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const chapter = await getChapterBySlug(supabase, chapterSlug);
  if (!chapter) notFound();

  const problems = await getProblemsByChapter(supabase, chapter.id);
  const progressByProblem = await getProgressForChapterProblems(
    supabase,
    profile.id,
    problems.map((p) => p.id)
  );

  return (
    <div>
      <PageHeader title={chapter.title} subtitle={`${problems.length} zadań`} />
      <div className="mx-auto flex max-w-lg flex-col gap-2 px-5 py-5">
        {problems.map((problem) => {
          const progress = progressByProblem.get(problem.id);
          return (
            <Card key={problem.id} className="flex items-center gap-3 p-3">
              <ProblemCheckbox problemId={problem.id} initialDone={progress?.done ?? false} />
              <Link
                href={`/maturalnik/${chapter.slug}/${problem.number}`}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <span className="font-medium text-foreground">
                  Zadanie {chapter.number}.{problem.number}
                </span>
                {problem.flagged_for_review && (
                  <Badge className="gap-1 bg-warning-soft text-warning">
                    <AlertTriangle className="h-3 w-3" /> uszkodzony obraz
                  </Badge>
                )}
                {progress?.canvas_path && <Badge>rozwiązywane</Badge>}
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-foreground-muted" />
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
