"use client";

// ============================================================================
// components/godziny/history-view.tsx
// Historia nauki: filtry (dni / tygodnie / miesiące + temat), wykres sumy
// czasu w kolejnych okresach, rozbicie na tematy i lista okresów.
//
// Filtry siedzą w adresie URL, a nie w stanie komponentu — dzięki temu
// „ostatnie 12 tygodni, tylko Matematyka" da się zapisać w zakładkach i
// cofnąć przyciskiem wstecz, a przeliczaniem zajmuje się serwer (getHistory),
// nie przeglądarka. Nowy adres składamy z propsów, a NIE z useSearchParams():
// strona i tak przekazuje tu oba filtry po walidacji, a każdy komponent
// czytający useSearchParams() wymaga własnej granicy <Suspense>, żeby nie
// zablokować prerenderowania trasy.
//
// Wykres jest ŚWIADOMIE jednoserie: jeden słupek = suma całej nauki w danym
// okresie, w jednym kolorze. Wersja „słupek poskładany z kolorów tematów"
// wygląda bogaciej, ale przy kilkunastu tematach na ekranie telefonu robi się
// z niej pasek szumu — rozbicie na tematy stoi więc obok, jako lista z
// nazwami i liczbami, gdzie kolor tylko podpiera podpis, a nie zastępuje go.
// ============================================================================
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatBucketLabel,
  formatBucketTick,
  formatEntryCount,
  formatHours,
  formatMinutes,
  GROUPING_LABELS,
  type Grouping,
} from "@/lib/godziny/format";
import type { StudyHistory } from "@/lib/godziny/queries";
import { chartColor } from "@/lib/paragony/chart-colors";
import type { StudyTopic } from "@/lib/types/database";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GROUPINGS: Grouping[] = ["day", "week", "month"];

const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-control)",
  fontSize: 12,
};

/** Jak nazwać jeden okres w podsumowaniu „średnio na ...". */
const PER_BUCKET_LABEL: Record<Grouping, string> = {
  day: "dzień",
  week: "tydzień",
  month: "miesiąc",
};

export function HistoryView({
  history,
  topics,
  today,
  topicId,
}: {
  history: StudyHistory;
  topics: StudyTopic[];
  today: string;
  topicId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /** Domyślne wartości zostawiamy poza adresem — czysty URL do zakładek. */
  function navigate(next: { grouping?: Grouping; topicId?: string | null }) {
    const grouping = next.grouping ?? history.grouping;
    const topic = next.topicId === undefined ? topicId : next.topicId;

    const params = new URLSearchParams();
    if (grouping !== "day") params.set("grupowanie", grouping);
    if (topic) params.set("temat", topic);

    const query = params.toString();
    startTransition(() =>
      router.replace(query ? `/godziny/historia?${query}` : "/godziny/historia")
    );
  }

  const chartData = history.buckets.map((bucket) => ({
    start: bucket.start,
    minutes: bucket.minutes,
    tick: formatBucketTick(bucket.start, history.grouping),
    label: formatBucketLabel(bucket.start, history.grouping, today),
  }));

  const averagePerActive = history.activeBuckets
    ? Math.round(history.totalMinutes / history.activeBuckets)
    : 0;
  const maxTopicMinutes = history.topicTotals[0]?.minutes ?? 0;
  const selectedTopic = topics.find((topic) => topic.id === topicId);

  return (
    <div className={cn("flex flex-col gap-4", isPending && "opacity-60")}>
      {/* Filtry: jeden rząd nad wykresem. */}
      <div className="flex flex-col gap-2">
        <div
          role="group"
          aria-label="Grupowanie historii"
          className="flex rounded-(--radius-control) border border-border bg-surface p-1"
        >
          {GROUPINGS.map((grouping) => (
            <button
              key={grouping}
              type="button"
              onClick={() => navigate({ grouping })}
              aria-pressed={history.grouping === grouping}
              className={cn(
                "flex-1 rounded-(--radius-control) py-2 text-sm font-medium transition-colors",
                history.grouping === grouping
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground-muted"
              )}
            >
              {GROUPING_LABELS[grouping]}
            </button>
          ))}
        </div>

        <label className="sr-only" htmlFor="topic-filter">
          Filtruj po temacie
        </label>
        <select
          id="topic-filter"
          value={topicId ?? ""}
          onChange={(e) => navigate({ topicId: e.target.value || null })}
          className="h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Wszystkie tematy</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
              {topic.is_archived ? " (archiwum)" : ""}
            </option>
          ))}
        </select>
      </div>

      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>
            Czas nauki · {GROUPING_LABELS[history.grouping].toLowerCase()}
            {selectedTopic ? ` · ${selectedTopic.name}` : ""}
          </CardTitle>
          <CardDescription className="mt-0.5">
            {formatMinutes(history.totalMinutes)} w {formatEntryCount(history.totalEntries)}
            {history.activeBuckets > 0 &&
              ` · średnio ${formatMinutes(averagePerActive)} na aktywny ${PER_BUCKET_LABEL[history.grouping]}`}
          </CardDescription>
        </div>

        {history.totalMinutes === 0 ? (
          <p className="py-8 text-center text-sm text-foreground-muted">
            Brak wpisów w tym zakresie.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="tick"
                tick={{ fontSize: 10, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
                minTickGap={12}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value: number) => formatHours(value)}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
                width={48}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-muted)" }}
                formatter={(value: number) => [formatMinutes(value), "Czas nauki"]}
                labelFormatter={(_tick: string, payload) =>
                  (payload?.[0]?.payload as { label?: string } | undefined)?.label ?? ""
                }
                contentStyle={TOOLTIP_CONTENT_STYLE}
                labelStyle={{ color: "var(--color-foreground)" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
              {/* Jedna seria — bez legendy; tytuł karty mówi, co pokazuje słupek. */}
              <Bar
                dataKey="minutes"
                name="Czas nauki"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {history.topicTotals.length > 0 && (
        <Card className="flex flex-col gap-3">
          <CardTitle>Na co poszedł czas</CardTitle>
          <ul className="flex flex-col gap-2.5">
            {history.topicTotals.map((topic) => {
              const share = history.totalMinutes
                ? Math.round((topic.minutes / history.totalMinutes) * 100)
                : 0;
              const width = maxTopicMinutes ? (topic.minutes / maxTopicMinutes) * 100 : 0;
              return (
                <li key={topic.topicId} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {topic.name}
                    </span>
                    <span className="shrink-0 text-foreground-muted">
                      {formatMinutes(topic.minutes)} · {share}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        backgroundColor: chartColor(topic.colorIndex),
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Lista okresów — to samo, co wykres, tylko w liczbach; bez niej wykres
          byłby jedynym nośnikiem danych, a część kolorów palety nie wyrabia
          3:1 kontrastu na jasnym tle. */}
      {history.totalMinutes > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Kolejne okresy
          </h2>
          <ul className="flex flex-col gap-2">
            {[...history.buckets]
              .reverse()
              .filter((bucket) => bucket.minutes > 0)
              .map((bucket) => (
                <li key={bucket.start}>
                  <Card className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-base font-medium text-foreground">
                        {formatBucketLabel(bucket.start, history.grouping, today)}
                      </p>
                      <p className="shrink-0 text-base font-semibold text-foreground">
                        {formatMinutes(bucket.minutes)}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-0.5">
                      {bucket.byTopic.map((slice) => (
                        <li
                          key={slice.topicId}
                          className="flex items-center justify-between gap-2 text-sm text-foreground-muted"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              aria-hidden
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: chartColor(slice.colorIndex) }}
                            />
                            <span className="truncate">{slice.name}</span>
                          </span>
                          <span className="shrink-0">{formatMinutes(slice.minutes)}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
