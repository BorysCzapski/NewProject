// ============================================================================
// components/modlitwa/streak-strip.tsx
// Pasek ostatnich siedmiu dni — jedno spojrzenie mówi, gdzie jest dziura w
// łańcuchu. Komponent serwerowy: dostaje gotowe dane, nic nie pobiera.
// ============================================================================
import { Check } from "lucide-react";
import { fromDateKey } from "@/lib/modlitwa/liturgical-calendar";
import { Card } from "@/components/ui/card";

const WEEKDAY_SHORT = ["N", "P", "W", "Ś", "C", "P", "S"];

export function StreakStrip({
  days,
  longestStreak,
  totalDays,
}: {
  days: Array<{ date: string; prayed: boolean }>;
  longestStreak: number;
  totalDays: number;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-foreground">Ostatnie 7 dni</h2>
        <p className="text-sm text-foreground-muted">
          Rekord: <span className="font-semibold text-foreground">{longestStreak}</span> · Razem:{" "}
          <span className="font-semibold text-foreground">{totalDays}</span>
        </p>
      </div>

      <ul className="flex items-stretch justify-between gap-1.5">
        {days.map((day, index) => {
          const weekday = WEEKDAY_SHORT[fromDateKey(day.date).getDay()];
          const isToday = index === days.length - 1;
          return (
            <li key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] text-foreground-muted">{weekday}</span>
              <span
                aria-label={day.prayed ? `${day.date}: modlitwa odnotowana` : `${day.date}: brak wpisu`}
                className={[
                  "flex h-10 w-full items-center justify-center rounded-(--radius-control) border",
                  day.prayed
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface-muted text-foreground-muted",
                  isToday && !day.prayed ? "border-dashed border-primary" : "",
                ].join(" ")}
              >
                {day.prayed ? <Check className="h-5 w-5" /> : <span className="text-xs">—</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
