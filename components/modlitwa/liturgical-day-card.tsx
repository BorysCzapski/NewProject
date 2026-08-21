// ============================================================================
// components/modlitwa/liturgical-day-card.tsx
// Nagłówek dnia: data, nazwa dnia liturgicznego, okres, kolor szat i ewentualne
// uroczystości. Wszystko liczone lokalnie w lib/modlitwa/liturgical-calendar.ts,
// więc renderuje się bez żadnego zapytania.
// ============================================================================
import { COLOR_DOT_CLASSES, COLOR_LABELS, formatPolishDayAndMonth, type LiturgicalDay } from "@/lib/modlitwa/liturgical-calendar";
import { Card } from "@/components/ui/card";

const RANK_LABELS: Record<string, string> = {
  uroczystosc: "Uroczystość",
  swieto: "Święto",
  wspomnienie: "Wspomnienie",
  niedziela: "Niedziela",
};

export function LiturgicalDayCard({ day }: { day: LiturgicalDay }) {
  const extraObservances = day.observances.filter((o) => o.name !== day.name);

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm capitalize text-foreground-muted">{formatPolishDayAndMonth(day.date)}</p>
      <h2 className="text-lg font-semibold text-foreground">{day.name}</h2>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground-muted">
        <span>{day.seasonLabel}</span>
        <span className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-full ${COLOR_DOT_CLASSES[day.color]}`} aria-hidden />
          szaty: {COLOR_LABELS[day.color]}
        </span>
      </div>

      {extraObservances.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1">
          {extraObservances.map((observance) => (
            <li key={observance.name} className="text-sm text-foreground">
              <span className="text-foreground-muted">{RANK_LABELS[observance.rank]}: </span>
              {observance.name}
              {observance.holyDayOfObligation && (
                <span className="ml-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                  nakazana
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {day.observances.some((o) => o.holyDayOfObligation) && extraObservances.length === 0 && (
        <p className="text-sm font-medium text-primary">Uroczystość nakazana — obowiązek uczestnictwa we Mszy św.</p>
      )}
    </Card>
  );
}
