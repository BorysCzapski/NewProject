// ============================================================================
// app/(main)/admin/sciezka/page.tsx
// Admin view of every student's position on the ścieżka nauki roadmap
// (level, current stage, progress within it), with a one-click action to
// assign a catch-up vocabulary_mastery homework for a lagging category.
// ============================================================================
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLearningPath } from "@/lib/learning-path/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { HomeworkProgressBar } from "@/components/homework/homework-progress-bar";
import { AssignCatchupButton } from "@/components/learning-path/assign-catchup-button";
import type { Profile } from "@/lib/types/database";

export default async function AdminSciezkaPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("level")
    .order("username");

  const rows = await Promise.all(
    ((profiles ?? []) as Profile[]).map(async (student) => {
      const { stages, currentStageIndex } = await getLearningPath(
        supabase,
        student.id,
        student.level,
        student.target_language
      );
      const currentStage = stages[currentStageIndex] ?? stages[stages.length - 1] ?? null;
      return { student, stages, currentStageIndex, currentStage };
    })
  );

  return (
    <div>
      <PageHeader title="Ścieżka nauki — uczniowie" subtitle="Kto jest na jakim etapie" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {rows.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">Brak zarejestrowanych uczniów.</Card>
        ) : (
          rows.map(({ student, stages, currentStageIndex, currentStage }) => (
            <Card key={student.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <CardTitle>{student.username}</CardTitle>
                <LevelBadge level={student.level} />
              </div>
              {currentStage ? (
                <>
                  <CardDescription>
                    Etap {Math.min(currentStageIndex + 1, stages.length)} z {stages.length}:{" "}
                    {currentStage.title}
                  </CardDescription>
                  <HomeworkProgressBar
                    current={currentStage.masteredWords}
                    target={currentStage.totalWords || 1}
                    className="mt-3"
                  />
                  <div className="mt-3">
                    <AssignCatchupButton studentId={student.id} category={currentStage.category} />
                  </div>
                </>
              ) : (
                <CardDescription>Brak zdefiniowanej ścieżki dla tego poziomu.</CardDescription>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
