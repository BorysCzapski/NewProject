// ============================================================================
// app/(main)/matma/kalendarz/page.tsx
// "Kalendarz" screen for Matma: streak header, aggregate stats (mastered
// topics / solved problems / completed mock exams), and the shared month
// calendar highlighting days with any activity_log row — same structure as
// app/(main)/jezyki/kalendarz/page.tsx, reused unchanged via MonthCalendar.
// ============================================================================
import { Award, GraduationCap, ListChecks } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { MonthCalendar } from "@/components/calendar/month-calendar";

export default async function MatmaKalendarzPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ count: masteredTopics }, { count: solvedProblems }, { count: completedExams }] = await Promise.all([
    supabase
      .from("math_topic_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "mastered"),
    supabase
      .from("math_problem_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase
      .from("math_mock_exams")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "completed"),
  ]);

  const stats = [
    { icon: Award, label: "Opanowane działy", value: masteredTopics ?? 0 },
    { icon: ListChecks, label: "Rozwiązane zadania", value: solvedProblems ?? 0 },
    { icon: GraduationCap, label: "Ukończone egzaminy próbne", value: completedExams ?? 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Kalendarz"
        subtitle="Twoja passa i historia aktywności"
        action={<StreakBadge streak={profile.current_streak} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Aktualna passa</p>
            <StreakBadge streak={profile.current_streak} size="lg" />
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground-muted">Rekord</p>
            <p className="text-lg font-bold text-foreground">{profile.longest_streak} dni</p>
          </div>
        </Card>

        <div className="mb-4 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="flex flex-col items-center gap-1 py-3 text-center">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-[11px] leading-tight text-foreground-muted">{s.label}</span>
            </Card>
          ))}
        </div>

        <Card>
          <MonthCalendar userId={profile.id} />
        </Card>
      </div>
    </div>
  );
}
