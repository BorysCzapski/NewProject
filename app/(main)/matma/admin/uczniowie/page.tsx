// ============================================================================
// app/(main)/matma/admin/uczniowie/page.tsx
// Student roster for the Matma admin: estimated exam percent, weakest
// topic, streak, and a one-click "zadaj ćwiczenie" control per student.
// ============================================================================
import { Flame } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listStudentsWithMathProgress } from "@/lib/matma/admin-queries";
import { getTopics } from "@/lib/matma/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AssignPracticeForm } from "@/components/matma/admin/assign-practice-form";

export default async function MatmaAdminUczniowiePage() {
  await requireAdmin();
  const supabase = await createClient();
  const [students, topics] = await Promise.all([listStudentsWithMathProgress(supabase), getTopics(supabase)]);

  return (
    <div>
      <PageHeader title="Uczniowie" subtitle={`${students.length} uczniów`} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {students.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">Brak uczniów.</Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle>{student.username}</CardTitle>
                  <CardDescription>
                    {student.weakestTopicTitle ? `Najsłabszy dział: ${student.weakestTopicTitle}` : "Brak diagnozy"}
                  </CardDescription>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-foreground">{student.estimatedPercent}%</span>
                  <span className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Flame className="h-3.5 w-3.5" /> {student.currentStreak}
                  </span>
                </div>
              </div>

              <AssignPracticeForm studentId={student.id} topics={topics} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
