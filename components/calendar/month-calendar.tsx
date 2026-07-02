"use client";

// ============================================================================
// components/calendar/month-calendar.tsx
// Interactive monthly calendar: navigable prev/next, highlights days that
// have at least one activity_log row. Re-fetches from the browser Supabase
// client whenever the displayed month changes, so navigation stays a fast
// client-side interaction without a full page reload.
// ============================================================================
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { WEEKDAY_LABELS, buildCalendarGrid, formatDateKey, getMonthBounds } from "@/lib/calendar/date-utils";
import { Button } from "@/components/ui/button";

export function MonthCalendar({ userId }: { userId: string }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMonthActivity() {
      setLoading(true);
      const supabase = createClient();
      const { start, end } = getMonthBounds(year, monthIndex);
      const { data, error } = await supabase
        .from("activity_log")
        .select("activity_date")
        .eq("user_id", userId)
        .gte("activity_date", start)
        .lte("activity_date", end);

      if (cancelled) return;
      if (!error && data) {
        setActivityDates(new Set(data.map((row) => row.activity_date as string)));
      }
      setLoading(false);
    }

    fetchMonthActivity();
    return () => {
      cancelled = true;
    };
  }, [year, monthIndex, userId]);

  function goToPrevMonth() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  }

  const weeks = buildCalendarGrid(year, monthIndex);
  const monthLabel = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(
    new Date(year, monthIndex, 1)
  );
  const todayKey = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth} aria-label="Poprzedni miesiąc">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="text-base font-semibold capitalize text-foreground">{monthLabel}</p>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Następny miesiąc">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className={cn("grid grid-cols-7 gap-1.5 transition-opacity", loading && "animate-pulse opacity-50")}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[11px] font-medium text-foreground-muted">
            {label}
          </div>
        ))}

        {weeks.flat().map((cell, i) => {
          if (cell.day === null) return <div key={`blank-${i}`} className="aspect-square" />;

          const hasActivity = activityDates.has(cell.dateKey!);
          const isToday = cell.dateKey === todayKey;

          return (
            <div
              key={cell.dateKey}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs",
                isToday ? "ring-2 ring-primary" : "border border-border",
                hasActivity ? "bg-primary-soft text-primary font-semibold" : "bg-surface text-foreground"
              )}
            >
              <span>{cell.day}</span>
              {hasActivity && <Flame className="h-2.5 w-2.5" fill="currentColor" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
