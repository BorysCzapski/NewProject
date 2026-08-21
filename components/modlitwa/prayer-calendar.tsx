"use client";

// ============================================================================
// components/modlitwa/prayer-calendar.tsx
// Miesięczny kalendarz: dni z odnotowaną modlitwą + dni liturgicznie wyjątkowe.
//
// Siatkę budujemy współdzielonym helperem z lib/calendar/date-utils.ts (ten sam,
// którego używa kalendarz Linguo), a obchody liczymy lokalnie — dlatego zmiana
// miesiąca nie wymaga żadnego zapytania do bazy, dopóki nie wyjdziemy poza
// zakres dni modlitwy przekazany z serwera.
// ============================================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCalendarGrid, WEEKDAY_LABELS } from "@/lib/calendar/date-utils";
import {
  COLOR_DOT_CLASSES,
  formatPolishDate,
  fromDateKey,
  getLiturgicalDay,
} from "@/lib/modlitwa/liturgical-calendar";
import { Card } from "@/components/ui/card";

const MONTH_FORMATTER = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" });

export function PrayerCalendar({
  prayedDates,
  todayDateKey,
}: {
  prayedDates: string[];
  todayDateKey: string;
}) {
  const initial = fromDateKey(todayDateKey);
  const [year, setYear] = useState(initial.getFullYear());
  const [monthIndex, setMonthIndex] = useState(initial.getMonth());
  const [selected, setSelected] = useState<string>(todayDateKey);

  const prayed = useMemo(() => new Set(prayedDates), [prayedDates]);
  const weeks = useMemo(() => buildCalendarGrid(year, monthIndex), [year, monthIndex]);

  function shiftMonth(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setYear(next.getFullYear());
    setMonthIndex(next.getMonth());
  }

  const selectedDay = getLiturgicalDay(selected);
  const monthLabel = MONTH_FORMATTER.format(new Date(year, monthIndex, 1));

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Poprzedni miesiąc"
            className="flex h-11 w-11 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-base font-semibold capitalize text-foreground">{monthLabel}</p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Następny miesiąc"
            className="flex h-11 w-11 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-foreground-muted">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((cell, cellIndex) => {
                if (!cell.dateKey) return <span key={cellIndex} />;

                const day = getLiturgicalDay(cell.dateKey);
                const hasFeast = day.observances.some(
                  (o) => o.rank === "uroczystosc" || o.rank === "swieto"
                );
                const isPrayed = prayed.has(cell.dateKey);
                const isToday = cell.dateKey === todayDateKey;
                const isSelected = cell.dateKey === selected;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelected(cell.dateKey!)}
                    className={[
                      "flex h-11 flex-col items-center justify-center gap-0.5 rounded-(--radius-control) text-sm",
                      isPrayed ? "bg-accent-soft font-semibold text-foreground" : "text-foreground",
                      isSelected ? "ring-2 ring-primary" : "",
                      isToday && !isSelected ? "border border-primary" : "",
                    ].join(" ")}
                  >
                    <span>{cell.day}</span>
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full ${
                        hasFeast ? COLOR_DOT_CLASSES[day.color] : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-accent-soft" /> dzień modlitwy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> uroczystość / święto
          </span>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">{formatPolishDate(selected)}</p>
        <h2 className="text-base font-semibold text-foreground">{selectedDay.name}</h2>
        <p className="text-sm text-foreground-muted">{selectedDay.seasonLabel}</p>

        {selectedDay.observances.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm text-foreground">
            {selectedDay.observances.map((observance) => (
              <li key={observance.name}>
                {observance.name}
                {observance.holyDayOfObligation && (
                  <span className="ml-1 text-xs font-medium text-primary">(nakazana)</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm text-foreground">
          {prayed.has(selected) ? "Modlitwa odnotowana ✓" : "Brak wpisu w dzienniku."}
        </p>

        <Link
          href={`/modlitwa/czytania?data=${selected}`}
          className="text-sm font-medium text-primary"
        >
          Zobacz czytania z tego dnia
        </Link>
      </Card>
    </div>
  );
}
