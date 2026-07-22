// ============================================================================
// app/(main)/matma/plan/page.tsx
// "Plan" tab: the optional exam-date study plan layered on top of the
// always-available untimed learning path. No exam date given just means the
// timed schedule stays off — nothing else in Matma is gated on it.
// ============================================================================
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopics } from "@/lib/matma/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanForm } from "@/components/matma/plan/plan-form";
import { WeekCard, WEEK_STATUS_CLASSES, WEEK_STATUS_LABELS, formatWeekDate } from "@/components/matma/plan/week-card";
import { RecomputeButton } from "@/components/matma/plan/recompute-button";
import type { MathStudyPlan, MathStudyPlanWeek } from "@/lib/types/database";

function weeksRemaining(examDateIso: string): number {
  const ms = new Date(examDateIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (7 * 24 * 60 * 60 * 1000)));
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

function isCurrentWeek(week: MathStudyPlanWeek): boolean {
  const todayIso = new Date().toISOString().slice(0, 10);
  return todayIso >= week.target_start_date && todayIso <= week.target_end_date;
}

export default async function StudyPlanPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: planRow }, topics] = await Promise.all([
    supabase.from("math_study_plans").select("*").eq("user_id", profile.id).maybeSingle(),
    getTopics(supabase),
  ]);
  const plan = planRow as MathStudyPlan | null;

  const topicTitleById: Record<string, string> = {};
  const topicSlugById: Record<string, string> = {};
  for (const topic of topics) {
    topicTitleById[topic.id] = topic.title;
    topicSlugById[topic.id] = topic.slug;
  }

  let weeks: MathStudyPlanWeek[] = [];
  if (plan) {
    const { data: weekRows } = await supabase
      .from("math_study_plan_weeks")
      .select("*")
      .eq("plan_id", plan.id)
      .order("week_index");
    weeks = (weekRows ?? []) as MathStudyPlanWeek[];
  }

  const currentWeek = weeks.find(isCurrentWeek) ?? null;
  const otherWeeks = weeks.filter((w) => w.id !== currentWeek?.id);
  const examDate = plan?.exam_date ?? null;

  return (
    <div>
      <PageHeader title="Twój plan" subtitle="Harmonogram nauki do dnia egzaminu" />
      <div className="mx-auto max-w-lg px-5 py-5 flex flex-col gap-4">
        {!plan || !examDate ? (
          <>
            <Card>
              <CardTitle>Harmonogram jest opcjonalny</CardTitle>
              <CardDescription className="mt-1">
                Jeśli nie podasz daty egzaminu, plan tygodniowy po prostu zostaje wyłączony — ścieżka
                nauki (tematy, lekcje, ćwiczenia) działa dokładnie tak samo i możesz uczyć się we
                własnym tempie. Podaj datę, żeby dostać adaptacyjny harmonogram dopasowany do niej.
              </CardDescription>
            </Card>
            <Card>
              <CardTitle className="mb-3">Ustaw datę egzaminu</CardTitle>
              <PlanForm hasPlan={false} />
            </Card>
          </>
        ) : (
          <>
            <Card className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <CardDescription>Egzamin: {formatFullDate(examDate)}</CardDescription>
                <CardTitle className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-foreground-muted" />
                  {weeksRemaining(examDate)} tyg. do egzaminu
                </CardTitle>
              </div>
            </Card>

            <RecomputeButton />

            {currentWeek && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  Ten tydzień
                </h2>
                <Card className="border-primary/50 bg-primary-soft/30">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>Tydzień {currentWeek.week_index + 1}</CardTitle>
                    <Badge className={WEEK_STATUS_CLASSES[currentWeek.status]}>
                      {WEEK_STATUS_LABELS[currentWeek.status]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground-muted">
                    {formatWeekDate(currentWeek.target_start_date)} – {formatWeekDate(currentWeek.target_end_date)}
                  </p>

                  {currentWeek.is_review_week ? (
                    <p className="mt-3 rounded-(--radius-control) bg-accent-soft p-3 text-sm text-accent">
                      Tydzień powtórkowy: symulacje egzaminu i domykanie luk zamiast nowego materiału.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentWeek.topic_ids.map((topicId) => (
                        <Link
                          key={topicId}
                          href={`/matma/nauka/${topicSlugById[topicId] ?? ""}`}
                          className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground active:opacity-80"
                        >
                          {topicTitleById[topicId] ?? "Temat"}
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {otherWeeks.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  Wszystkie tygodnie
                </h2>
                <div className="flex flex-col gap-3">
                  {otherWeeks.map((week) => (
                    <WeekCard key={week.id} week={week} topicTitleById={topicTitleById} />
                  ))}
                </div>
              </div>
            )}

            <Card>
              <CardTitle className="mb-1">Zmień plan</CardTitle>
              <CardDescription className="mb-3">
                Zmień datę egzaminu lub tempo nauki, albo wyłącz harmonogram — ścieżka nauki zostanie bez
                zmian.
              </CardDescription>
              <PlanForm
                hasPlan
                currentExamDate={examDate}
                currentWeeklyHoursTarget={plan.weekly_hours_target}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
