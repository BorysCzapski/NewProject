// ============================================================================
// components/modlitwa/suggested-hour-hint.tsx
// „O tej porze odmawia się…” — podpowiedź godziny brewiarza według pory dnia.
//
// Godzinę wylicza serwer w strefie Europe/Warsaw (currentWarsawHour), a nie
// przeglądarka: aplikacja jest polska, a liczenie po stronie serwera pozwala
// zostawić ten komponent serwerowym — bez hydratacji i bez migotania
// wartości zastępczej przy pierwszym renderze.
// ============================================================================
import Link from "next/link";
import { Clock } from "lucide-react";
import { getHour, type HourId } from "@/lib/modlitwa/hours";

export function SuggestedHourHint({ hourId }: { hourId: HourId }) {
  const hour = getHour(hourId);
  if (!hour) return null;

  return (
    <Link
      href={`/modlitwa/liturgia/${hour.id}`}
      className="flex items-center gap-3 rounded-(--radius-card) border border-primary/30 bg-primary-soft px-4 py-3 active:opacity-80"
    >
      <Clock className="h-5 w-5 shrink-0 text-primary" />
      <span className="text-sm text-foreground">
        O tej porze odmawia się <span className="font-semibold">{hour.name}</span> — {hour.timeHint}.
      </span>
    </Link>
  );
}
