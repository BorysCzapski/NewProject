// ============================================================================
// app/(main)/matma/admin/page.tsx
// Matma admin overview: per-topic content stats (lessons/problems/problem
// source mix/avg mastery) plus an inline exam_weight editor. Entry point to
// the two other admin screens (zadania, uczniowie).
// ============================================================================
import Link from "next/link";
import { ClipboardList, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAdminTopicsOverview } from "@/lib/matma/admin-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamWeightEditor } from "@/components/matma/admin/exam-weight-editor";
import type { MathProblemSource } from "@/lib/types/database";

const SOURCE_LABELS: Record<MathProblemSource, string> = {
  topic: "temat",
  past_exam: "z matury",
  curated: "wybrane",
  ai_generated: "AI",
};

export default async function MatmaAdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const topics = await getAdminTopicsOverview(supabase);

  return (
    <div>
      <PageHeader title="Panel administratora — Matma" subtitle="Działy i zadania" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/matma/admin/zadania">
            <Button variant="outline" className="w-full">
              <ClipboardList className="h-4 w-4" /> Zadania
            </Button>
          </Link>
          <Link href="/matma/admin/uczniowie">
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4" /> Uczniowie
            </Button>
          </Link>
        </div>

        {topics.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">Brak działów w bazie.</Card>
        ) : (
          topics.map((topic) => (
            <Card key={topic.topicId} className="flex flex-col gap-3">
              <div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>
                  {topic.lessonCount} lekcji · {topic.problemCount} zadań
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-muted">
                {(Object.keys(SOURCE_LABELS) as MathProblemSource[]).map((source) => (
                  <span key={source}>
                    {SOURCE_LABELS[source]}:{" "}
                    <span className="font-semibold text-foreground">{topic.problemCountBySource[source]}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-foreground-muted">
                <span>
                  Śr. poziom opanowania:{" "}
                  <span className="font-semibold text-foreground">{topic.avgMasteryScore}%</span>
                </span>
                <span>{topic.studentsWithProgress} uczniów</span>
              </div>

              <ExamWeightEditor topicId={topic.topicId} initialWeight={topic.examWeight} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
