// ============================================================================
// components/modlitwa/hour-picker.tsx
// Wybór pory dnia: poziomy pasek wszystkich ośmiu godzin brewiarza. Zawsze
// widoczny nad tekstem, żeby przełączenie „Jutrznia -> Nieszpory” było jednym
// kliknięciem, bez wracania do listy.
//
// Zwykłe linki, nie stan klienta — dzięki temu każda godzina ma własny adres
// (da się ją dodać do zakładek i udostępnić), a serwer i tak renderuje treść.
// Odhaczone godziny dostają kropkę, bieżąca — wypełnienie.
// ============================================================================
import Link from "next/link";
import { HOURS, HOUR_SHORT_LABELS, type HourId } from "@/lib/modlitwa/hours";

export function HourPicker({
  currentHourId,
  doneHours,
  suggestedHourId,
  dateKey,
  isToday,
}: {
  currentHourId: HourId;
  doneHours: string[];
  suggestedHourId: HourId;
  dateKey: string;
  isToday: boolean;
}) {
  const done = new Set(doneHours);

  return (
    <nav aria-label="Wybór godziny brewiarza" className="-mx-5 px-5">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {HOURS.map((hour) => {
          const isCurrent = hour.id === currentHourId;
          const query = isToday ? "" : `?data=${dateKey}`;
          return (
            <li key={hour.id} className="shrink-0">
              <Link
                href={`/modlitwa/liturgia/${hour.id}${query}`}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "flex h-11 items-center gap-1.5 rounded-(--radius-control) border px-3.5 text-sm font-medium",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground active:opacity-80",
                ].join(" ")}
              >
                {HOUR_SHORT_LABELS[hour.id]}
                {done.has(hour.id) && (
                  <span
                    aria-label="odmówiona"
                    className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-primary-foreground" : "bg-accent"}`}
                  />
                )}
                {!done.has(hour.id) && hour.id === suggestedHourId && !isCurrent && (
                  <span aria-label="teraz" className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
