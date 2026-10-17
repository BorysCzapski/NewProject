// ============================================================================
// app/(main)/informatyka/page.tsx
// Informatyka home: exam-countdown heatmap (or a CTA to set the date), overall
// points, and two ways in — by exam session and by task type.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Settings2 } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems, getExams } from "@/lib/informatyka/content";
import { getDailyActivity, getProgressMap, percent, tally } from "@/lib/informatyka/progress";
import { getInformatykaSettings } from "@/lib/informatyka/settings";
import { KINDS, TOPICS } from "@/lib/informatyka/taxonomy";
import { todayKey } from "@/lib/exam-dates";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamCountdownHeatmap } from "@/components/exam/exam-countdown-heatmap";
import { ProgressBar } from "@/components/informatyka/progress-bar";

export default async function InformatykaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [exams, problems, progress, settings] = await Promise.all([
    getExams(supabase),
    getAllProblems(supabase),
    getProgressMap(supabase, profile.id),
    getInformatykaSettings(supabase, profile.id),
  ]);
  const activity = settings?.exam_date
    ? await getDailyActivity(supabase, profile.id, settings.exam_date, problems)
    : {};

  const overall = tally(problems, progress);
  const topicIds = Object.keys(TOPICS).filter((t) => problems.some((p) => p.topic === t));

  return (
    <div>
      <PageHeader
        title="Informatyka"
        subtitle={`${overall.earned}/${overall.possible} pkt · ${overall.done}/${overall.total} zadań`}
        action={
          <Link href="/informatyka/ustawienia">
            <Button variant="ghost" size="icon" aria-label="Ustawienia">
              <Settings2 className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        {settings?.exam_date ? (
          <ExamCountdownHeatmap examDate={settings.exam_date} today={todayKey()} activity={activity} />
        ) : (
          <Link href="/informatyka/ustawienia">
            <Card className="flex items-center justify-between gap-3 bg-primary-soft transition-transform active:scale-[0.99]">
              <div>
                <CardTitle className="text-primary">Ustaw datę matury</CardTitle>
                <CardDescription>Zobaczysz tu odliczanie dni i swoją aktywność</CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </Card>
          </Link>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Postęp ogólny</h2>
            <span className="text-sm font-semibold text-foreground">{percent(overall)}%</span>
          </div>
          <ProgressBar earned={overall.earned} possible={overall.possible} />
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Rodzaj zadania</h2>
          {KINDS.map((kind) => {
            const t = tally(problems.filter((p) => p.kind === kind.id), progress);
            return (
              <Link key={kind.id} href={`/informatyka/typy/${kind.id}`}>
                <Card className="flex items-center gap-3 transition-transform active:scale-[0.99]">
                  <div className="min-w-0 flex-1">
                    <CardTitle>{kind.label}</CardTitle>
                    <CardDescription className="text-xs">{kind.hint}</CardDescription>
                    <ProgressBar earned={t.earned} possible={t.possible} />
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Temat</h2>
          <div className="flex flex-wrap gap-2">
            {topicIds.map((topic) => {
              const t = tally(problems.filter((p) => p.topic === topic), progress);
              return (
                <Link
                  key={topic}
                  href={`/informatyka/typy/${topic}`}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground active:scale-[0.97]"
                >
                  {TOPICS[topic]} <span className="text-foreground-muted">{t.done}/{t.total}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Arkusze</h2>
          {exams.map((exam) => {
            const t = tally(problems.filter((p) => p.exam.id === exam.id), progress);
            return (
              <Link key={exam.id} href={`/informatyka/arkusze/${exam.slug}`}>
                <Card className="flex items-center gap-3 transition-transform active:scale-[0.99]">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">{exam.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {exam.formula === "2015" ? "Formuła 2015 · część I + II" : "Formuła 2023"} · {t.done}/{t.total} zadań
                    </CardDescription>
                    <ProgressBar earned={t.earned} possible={t.possible} />
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
