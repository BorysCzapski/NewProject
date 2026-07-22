// ============================================================================
// app/(main)/matma/dowody/page.tsx
// "Trener dowodów": every is_proof problem across all topics, grouped by
// topic, linking into the nested per-problem practice route below (there's
// no topic-scoped proof route — proof problems are practiced individually
// here, unlike the difficulty-tiered flow in .../cwiczenia/page.tsx).
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MathProblem, MathTopic } from "@/lib/types/database";

const DIFFICULTY_CONFIG: Record<1 | 2 | 3, { label: string; className: string }> = {
  1: { label: "Poziom 1", className: "bg-accent-soft text-accent" },
  2: { label: "Poziom 2", className: "bg-warning-soft text-warning" },
  3: { label: "Poziom 3", className: "bg-danger-soft text-danger" },
};

interface ProofProblemRow extends MathProblem {
  math_topics: Pick<MathTopic, "id" | "title" | "order_index">;
}

function excerpt(statement: string, maxLength = 140): string {
  const plain = statement
    .replace(/\$\$[^$]+\$\$|\$[^$]+\$/g, " (wzór) ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
}

export default async function DowodyPage() {
  await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("math_problems")
    .select("*, math_topics!inner(id, title, order_index)")
    .eq("is_proof", true)
    .order("order_index", { referencedTable: "math_topics" })
    .order("difficulty");

  const problems = (data ?? []) as unknown as ProofProblemRow[];

  const grouped: { topicId: string; topicTitle: string; problems: ProofProblemRow[] }[] = [];
  const indexByTopic = new Map<string, number>();
  for (const problem of problems) {
    const topicId = problem.math_topics.id;
    let idx = indexByTopic.get(topicId);
    if (idx === undefined) {
      idx = grouped.length;
      indexByTopic.set(topicId, idx);
      grouped.push({ topicId, topicTitle: problem.math_topics.title, problems: [] });
    }
    grouped[idx].problems.push(problem);
  }

  return (
    <div>
      <PageHeader
        title="Trener dowodów"
        subtitle="Oceniamy tu tok rozumowania, nie tylko jedną liczbę wyniku"
      />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        {grouped.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">
            Bank zadań na dowodzenie jest jeszcze pusty.
          </Card>
        ) : (
          grouped.map((group) => (
            <section key={group.topicId}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                {group.topicTitle}
              </h2>
              <div className="flex flex-col gap-3">
                {group.problems.map((problem) => {
                  const difficultyConfig = DIFFICULTY_CONFIG[problem.difficulty];
                  return (
                    <Link key={problem.id} href={`/matma/dowody/${problem.id}`}>
                      <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
                        <div className="min-w-0 flex-1">
                          <Badge className={cn("mb-1.5", difficultyConfig.className)}>
                            {difficultyConfig.label}
                          </Badge>
                          <CardDescription className="line-clamp-2 text-foreground">
                            {excerpt(problem.content.statement)}
                          </CardDescription>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
