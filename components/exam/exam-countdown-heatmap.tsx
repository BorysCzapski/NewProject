"use client";

// ============================================================================
// components/exam/exam-countdown-heatmap.tsx
// GitHub-contributions-style grid counting down to the matura exam date:
// one column per week, 7 rows (Mon-Sun), colored by how many problems the
// student marked done that day. Every square is a button — tapping it shows
// that day's count and the list of problems below the grid. Colors are just
// opacity steps against the theme-aware --primary (app/globals.css), so
// light/dark come for free. All day math is on "YYYY-MM-DD" strings in the
// app time zone (lib/exam-dates.ts), never on local Date objects.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { addDays, diffDays, formatKeyPl, weekdayMonday0, type DailyActivity } from "@/lib/exam-dates";

const DAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
/** Always show at least this many past weeks, even before any activity. */
const MIN_PAST_WEEKS = 4;
const CELL_STRIDE = 18; // 15px cell + 3px gap

function intensityClass(count: number): string {
  if (count <= 0) return "bg-surface-muted";
  if (count === 1) return "bg-primary/25";
  if (count <= 3) return "bg-primary/50";
  if (count <= 5) return "bg-primary/75";
  return "bg-primary";
}

function plural(count: number): string {
  if (count === 1) return "zadanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zadania";
  return "zadań";
}

export function ExamCountdownHeatmap({
  examDate,
  today,
  activity,
}: {
  examDate: string;
  /** "YYYY-MM-DD" in the app time zone, computed server-side. */
  today: string;
  activity: Record<string, DailyActivity>;
}) {
  const [selected, setSelected] = useState<string>(today);
  const scroller = useRef<HTMLDivElement>(null);
  const daysUntilExam = diffDays(today, examDate);

  // The grid reaches back to the first recorded day (at least MIN_PAST_WEEKS), so earlier
  // progress can be scrolled to; open it scrolled to the current week.
  const earliestActivity = Object.keys(activity)
    .filter((k) => (activity[k]?.count ?? 0) > 0)
    .sort()[0];
  const pastStart = addDays(today, -7 * MIN_PAST_WEEKS);
  const firstDay = earliestActivity && earliestActivity < pastStart ? earliestActivity : pastStart;
  const gridStart = addDays(firstDay, -weekdayMonday0(firstDay));
  const todayColumn = Math.floor(diffDays(gridStart, today) / 7);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = Math.max(0, todayColumn * CELL_STRIDE - el.clientWidth / 2);
  }, [todayColumn]);

  if (daysUntilExam < 0) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-4 text-center">
        <p className="text-sm text-foreground-muted">Data matury, którą ustawiłeś, już minęła.</p>
      </div>
    );
  }

  const gridEnd = addDays(examDate, 6 - weekdayMonday0(examDate));
  const days: string[] = [];
  for (let key = gridStart; key <= gridEnd; key = addDays(key, 1)) days.push(key);
  const weekCount = days.length / 7;

  const selectedActivity = activity[selected];
  const selectedIsFuture = selected > today;

  return (
    <div className="rounded-(--radius-card) border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <p className="text-2xl font-bold text-foreground">
          {daysUntilExam} {daysUntilExam === 1 ? "dzień" : "dni"}
        </p>
        <p className="text-sm text-foreground-muted">do matury ({formatKeyPl(examDate).split(", ")[1]})</p>
      </div>

      <div ref={scroller} className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex shrink-0 flex-col justify-between gap-[3px] py-[1px] text-[10px] text-foreground-muted">
          {DAY_LABELS.map((label) => (
            <span key={label} className="h-[15px] leading-[15px]">
              {label}
            </span>
          ))}
        </div>
        <div
          className="grid shrink-0 grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weekCount}, 15px)` }}
        >
          {days.map((key) => {
            const isFuture = key > today;
            const count = activity[key]?.count ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                aria-label={`${key}${isFuture ? "" : `: ${count} ${plural(count)}`}`}
                aria-pressed={key === selected}
                className={cn(
                  "h-[15px] w-[15px] rounded-[3px] transition-transform active:scale-90",
                  isFuture ? "bg-surface-muted/60" : intensityClass(count),
                  key === today && "ring-1 ring-foreground-muted",
                  key === examDate && "ring-2 ring-danger",
                  key === selected && "outline outline-2 outline-offset-1 outline-foreground"
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-1 text-[10px] text-foreground-muted">
        {todayColumn > 0 ? <span>← przewiń, żeby zobaczyć wcześniejsze dni</span> : <span />}
        <span className="flex items-center gap-1">
        <span>mniej</span>
        <span className="h-[11px] w-[11px] rounded-[2px] bg-surface-muted" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/25" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/50" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/75" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary" />
        <span>więcej</span>
        </span>
      </div>

      <div className="mt-3 rounded-(--radius-control) bg-surface-muted p-3">
        <p className="text-xs text-foreground-muted first-letter:uppercase">{formatKeyPl(selected)}</p>
        {selected === examDate && <p className="mt-0.5 text-sm font-semibold text-danger">Dzień matury</p>}
        {selectedIsFuture ? (
          <p className="mt-0.5 text-sm text-foreground-muted">Ten dzień jeszcze przed Tobą.</p>
        ) : (
          <>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {selectedActivity?.count ?? 0} {plural(selectedActivity?.count ?? 0)} zrobione
            </p>
            {selectedActivity && selectedActivity.items.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedActivity.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
