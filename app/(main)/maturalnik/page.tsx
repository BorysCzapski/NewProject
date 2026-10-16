// ============================================================================
// app/(main)/maturalnik/page.tsx
// Maturalnik home: exam-countdown heatmap (or a CTA to set the date), overall
// progress, and the 17-chapter list.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Settings2 } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getChapters } from "@/lib/maturalnik/content";
import { getProgressByChapter, getProgressSummary, getDailyActivity } from "@/lib/maturalnik/progress";
import { getMaturalnikSettings } from "@/lib/maturalnik/settings";
import { todayKey } from "@/lib/maturalnik/dates";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamCountdownHeatmap } from "@/components/maturalnik/exam-countdown-heatmap";

export default async function MaturalnikPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [chapters, progressByChapter, summary, settings] = await Promise.all([
    getChapters(supabase),
    getProgressByChapter(supabase, profile.id),
    getProgressSummary(supabase, profile.id),
    getMaturalnikSettings(supabase, profile.id),
  ]);

  const activity = settings?.exam_date ? await getDailyActivity(supabase, profile.id, settings.exam_date) : {};

  const overallPercent = summary.totalCount > 0 ? Math.round((summary.doneCount / summary.totalCount) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Maturalnik"
        subtitle={`${summary.doneCount}/${summary.totalCount} zadań zrobionych`}
        action={
          <Link href="/maturalnik/ustawienia">
            <Button variant="ghost" size="icon" aria-label="Ustawienia">
              <Settings2 className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {settings?.exam_date ? (
          <ExamCountdownHeatmap examDate={settings.exam_date} today={todayKey()} activity={activity} />
        ) : (
          <Link href="/maturalnik/ustawienia">
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
            <span className="text-sm font-semibold text-foreground">{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${overallPercent}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {chapters.map((chapter) => {
            const progress = progressByChapter.get(chapter.id) ?? { done: 0, total: 0 };
            const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
            return (
              <Link key={chapter.id} href={`/maturalnik/${chapter.slug}`}>
                <Card className="flex items-center gap-3 transition-transform active:scale-[0.99]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                    {chapter.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">{chapter.title}</CardTitle>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="shrink-0 text-xs text-foreground-muted">
                        {progress.done}/{progress.total}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
