// ============================================================================
// app/(main)/matma/egzamin/page.tsx
// Exam hub: resume an in-progress mock exam, start a new 180-min / 50-pkt
// one, or review past attempts.
// ============================================================================
import Link from "next/link";
import { ClipboardList, PlayCircle } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StartExamButton } from "@/components/matma/exam/start-exam-button";
import type { MathMockExam } from "@/lib/types/database";

const STATUS_CONFIG: Record<MathMockExam["status"], { label: string; className: string }> = {
  in_progress: { label: "W trakcie", className: "bg-warning-soft text-warning" },
  completed: { label: "Zakończony", className: "bg-accent-soft text-accent" },
  abandoned: { label: "Przerwany", className: "bg-danger-soft text-danger" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

export default async function EgzaminPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("math_mock_exams")
    .select("*")
    .eq("user_id", profile.id)
    .order("started_at", { ascending: false });

  const exams = (data ?? []) as MathMockExam[];
  const inProgress = exams.find((e) => e.status === "in_progress");

  return (
    <div>
      <PageHeader
        title="Egzamin próbny"
        subtitle="180 minut, 50 punktów — jak na prawdziwej maturze rozszerzonej"
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {inProgress && (
          <Link href={`/matma/egzamin/${inProgress.id}`}>
            <Card className="flex items-center gap-3 bg-primary-soft transition-transform active:scale-[0.98]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <PlayCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <CardDescription className="text-primary">Masz niedokończony egzamin</CardDescription>
                <CardTitle>Wznów egzamin</CardTitle>
              </div>
            </Card>
          </Link>
        )}

        <StartExamButton />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Historia egzaminów
          </h2>
          {exams.length === 0 ? (
            <Card className="text-center text-sm text-foreground-muted">
              Nie masz jeszcze żadnego egzaminu próbnego — zacznij pierwszy powyżej.
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {exams.map((exam) => {
                const statusConfig = STATUS_CONFIG[exam.status];
                return (
                  <Link key={exam.id} href={`/matma/egzamin/${exam.id}`}>
                    <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
                        <ClipboardList className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                        </div>
                        <CardDescription>{formatDate(exam.started_at)}</CardDescription>
                        {exam.status === "completed" && (
                          <p className="mt-0.5 text-sm font-semibold text-foreground">
                            {exam.total_points} / {exam.max_points} pkt
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
