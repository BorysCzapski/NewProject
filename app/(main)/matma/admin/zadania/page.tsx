// ============================================================================
// app/(main)/matma/admin/zadania/page.tsx
// Admin AI-grading review queue plus a simple per-source problem-bank count
// (bulk past-exam import itself is a separate admin script — not built
// here, see the caption below).
// ============================================================================
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAiGradingReviewQueue } from "@/lib/matma/admin-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AiGradingReviewItem } from "@/components/matma/admin/ai-grading-review-item";
import type { MathProblemSource } from "@/lib/types/database";

const SOURCE_LABELS: Record<MathProblemSource, string> = {
  topic: "Temat",
  past_exam: "Z matury",
  curated: "Wybrane",
  ai_generated: "Wygenerowane AI",
};

export default async function MatmaAdminZadaniaPage() {
  await requireAdmin();
  const supabase = await createClient();

  const sources = Object.keys(SOURCE_LABELS) as MathProblemSource[];
  // Exact head-count per source instead of pulling every row: a plain
  // .select("source") silently truncates at PostgREST's project db-max-rows
  // (1000) once the problem bank grows past it, which it already has.
  const [reviewQueue, ...countResults] = await Promise.all([
    getAiGradingReviewQueue(supabase),
    ...sources.map((source) => supabase.from("math_problems").select("id", { count: "exact", head: true }).eq("source", source)),
  ]);

  const countsBySource: Record<MathProblemSource, number> = {
    topic: 0,
    past_exam: 0,
    curated: 0,
    ai_generated: 0,
  };
  sources.forEach((source, i) => {
    countsBySource[source] = countResults[i].count ?? 0;
  });
  const total = Object.values(countsBySource).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader title="Zadania i ocena AI" subtitle="Bank zadań i kolejka korekt" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-2">
          <CardTitle>Bank zadań</CardTitle>
          <CardDescription>Łącznie {total} zadań w bazie</CardDescription>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground-muted">
            {(Object.keys(SOURCE_LABELS) as MathProblemSource[]).map((source) => (
              <span key={source}>
                {SOURCE_LABELS[source]}:{" "}
                <span className="font-semibold text-foreground">{countsBySource[source]}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-foreground-muted">
            Import zadań z arkuszy maturalnych odbywa się przez osobny skrypt administracyjny — nie jest częścią
            tego panelu.
          </p>
        </Card>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Kolejka przeglądu ocen AI
          </h2>
          {reviewQueue.length === 0 ? (
            <Card className="text-center text-sm text-foreground-muted">Brak ocen AI do przeglądu.</Card>
          ) : (
            <div className="flex flex-col gap-3">
              {reviewQueue.map((row) => (
                <AiGradingReviewItem key={row.id} row={row} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
