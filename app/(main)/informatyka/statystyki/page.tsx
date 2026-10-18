// ============================================================================
// app/(main)/informatyka/statystyki/page.tsx
// Points over time, activity streak, and which topics are weak (low accuracy
// on what's been done) or barely touched (low coverage).
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/lib/informatyka/content";
import { getProgressMap } from "@/lib/informatyka/progress";
import { computeStats, type GroupStat } from "@/lib/informatyka/stats";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StatsChart } from "@/components/informatyka/stats-chart";

function Bar({ value, tone }: { value: number; tone: "primary" | "warning" }) {
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
      <div className={tone === "primary" ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-warning"} style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

function GroupRow({ stat }: { stat: GroupStat }) {
  return (
    <Link href={`/informatyka/typy/${stat.id}`} className="flex flex-col gap-1 rounded-(--radius-control) py-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate font-medium text-foreground">{stat.label}</span>
        <span className="shrink-0 text-xs text-foreground-muted">
          {stat.done}/{stat.total} zadań · {stat.accuracy === null ? "—" : `${Math.round(stat.accuracy * 100)}% pkt`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Bar value={stat.coverage} tone="primary" />
        <Bar value={stat.accuracy ?? 0} tone="warning" />
      </div>
    </Link>
  );
}

export default async function StatystykiPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [problems, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);
  const stats = computeStats(problems, progress);

  const attempted = stats.topics.filter((t) => t.accuracy !== null && t.done >= 2);
  const weakest = [...attempted].sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 3);
  const untouched = [...stats.topics].sort((a, b) => a.coverage - b.coverage).slice(0, 3);

  return (
    <div>
      <PageHeader title="Statystyki" subtitle="Informatyka" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Card className="p-3">
            <CardTitle className="text-xl">{stats.overall.earned}</CardTitle>
            <CardDescription className="text-xs">pkt z {stats.overall.possible}</CardDescription>
          </Card>
          <Card className="p-3">
            <CardTitle className="text-xl">{stats.overall.done}</CardTitle>
            <CardDescription className="text-xs">zadań z {stats.overall.total}</CardDescription>
          </Card>
          <Card className="p-3">
            <CardTitle className="text-xl">{stats.streak}</CardTitle>
            <CardDescription className="text-xs">dni z rzędu</CardDescription>
          </Card>
        </div>

        <Card className="flex flex-col gap-2">
          <CardTitle>Punkty w czasie</CardTitle>
          {stats.timeline.length > 1 ? (
            <StatsChart data={stats.timeline} />
          ) : (
            <CardDescription>Wykres pojawi się, gdy ocenisz zadania z co najmniej dwóch dni.</CardDescription>
          )}
        </Card>

        {(weakest.length > 0 || untouched.length > 0) && (
          <Card className="flex flex-col gap-3">
            {weakest.length > 0 && (
              <div>
                <CardTitle>Najsłabsze tematy</CardTitle>
                <CardDescription className="mb-1 text-xs">Najniższa skuteczność wśród zadań, które już zrobiłeś (min. 2).</CardDescription>
                {weakest.map((t) => (
                  <GroupRow key={t.id} stat={t} />
                ))}
              </div>
            )}
            <div>
              <CardTitle>Najmniej ruszone</CardTitle>
              <CardDescription className="mb-1 text-xs">Tematy z najmniejszą częścią zrobionych zadań.</CardDescription>
              {untouched.map((t) => (
                <GroupRow key={t.id} stat={t} />
              ))}
            </div>
          </Card>
        )}

        <Card className="flex flex-col gap-1">
          <CardTitle>Wg rodzaju zadania</CardTitle>
          <CardDescription className="mb-1 text-xs">Zielony pasek = ile zrobiono, żółty = skuteczność punktowa.</CardDescription>
          {stats.kinds.map((k) => (
            <GroupRow key={k.id} stat={k} />
          ))}
        </Card>

        <Card className="flex flex-col gap-1">
          <CardTitle>Wg tematu</CardTitle>
          {stats.topics.map((t) => (
            <GroupRow key={t.id} stat={t} />
          ))}
        </Card>
      </div>
    </div>
  );
}
