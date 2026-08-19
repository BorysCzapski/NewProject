// ============================================================================
// lib/modlitwa/ics.ts
// Generator feedu iCalendar (RFC 5545) z kalendarzem liturgicznym.
//
// To jest nasza odpowiedź na wymaganie „integracja z kalendarzem Google/Apple”.
// Kierunek jest odwrócony względem pierwotnego pomysłu (OAuth + czytanie
// cudzego kalendarza) i to świadomy wybór:
//   * daty świąt i uroczystości liczymy sami i dokładnie
//     (lib/modlitwa/liturgical-calendar.ts), więc nie ma czego importować —
//     kalendarz użytkownika nie wie o liturgii więcej niż my;
//   * subskrypcja adresu ICS działa tak samo w Google Calendar, Apple Calendar
//     i Outlooku, bez tokenów OAuth, bez zgód na odczyt prywatnych wydarzeń
//     i bez przechowywania cudzych danych — czyli zgodnie z zasadą „prywatność
//     jest priorytetem” ze specyfikacji;
//   * kalendarz odświeża feed sam, więc nie ma „nieudanej synchronizacji” do
//     obsłużenia po naszej stronie.
//
// Wydarzenia są całodniowe (VALUE=DATE) i przezroczyste (TRANSP:TRANSPARENT),
// żeby nie zaznaczały użytkownika jako zajętego, i bez alarmów — o
// przypomnieniach decyduje aplikacja, nie cudzy kalendarz.
// ============================================================================
import {
  addDays,
  fromDateKey,
  observancesBetween,
  toDateKey,
  type Observance,
} from "@/lib/modlitwa/liturgical-calendar";

const PRODID = "-//Phoenix//Modlitwa//PL";

/** Składanie linii zgodnie z RFC 5545 (max 75 oktetów) — Google bywa surowe. */
function foldLine(line: string): string {
  if (line.length <= 73) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, 72)}`);
    rest = rest.slice(72);
  }
  return chunks.join("\r\n");
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function compact(dateKey: string): string {
  return dateKey.replaceAll("-", "");
}

/** UTC timestamp w formacie ICS (DTSTAMP). */
function stamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

const RANK_PREFIX: Record<Observance["rank"], string> = {
  uroczystosc: "Uroczystość",
  swieto: "Święto",
  wspomnienie: "Wspomnienie",
  niedziela: "Niedziela",
};

export interface IntentionEvent {
  id: string;
  personName: string;
  reason: string | null;
  promiseDate: string;
}

export interface BuildIcsOptions {
  /** Zakres dat "YYYY-MM-DD". */
  startDate: string;
  endDate: string;
  /** Intencje modlitewne jako osobne wydarzenia (domyślnie wyłączone). */
  intentions?: IntentionEvent[];
  /** Nazwa kalendarza widoczna w Google/Apple. */
  calendarName?: string;
  /** Stała „teraz” — parametr, żeby wynik dało się przetestować. */
  now?: Date;
}

/** Buduje kompletny dokument ICS. */
export function buildLiturgicalIcs({
  startDate,
  endDate,
  intentions = [],
  calendarName = "Kalendarz liturgiczny — Modlitwa",
  now = new Date(),
}: BuildIcsOptions): string {
  const dtstamp = stamp(now);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    "X-WR-TIMEZONE:Europe/Warsaw",
    "X-PUBLISHED-TTL:PT12H",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
  ];

  for (const { date, observance } of observancesBetween(startDate, endDate)) {
    // Niedziele zwykłe pomijamy — kalendarz ma pokazywać dni wyjątkowe, a nie
    // 52 powtarzalne wpisy rocznie.
    if (observance.rank === "niedziela") continue;

    const end = toDateKey(addDays(fromDateKey(date), 1));
    const summary = `${observance.name}`;
    const description = [
      RANK_PREFIX[observance.rank],
      observance.holyDayOfObligation ? "uroczystość nakazana" : null,
      `kolor szat: ${observance.color}`,
    ]
      .filter(Boolean)
      .join(" · ");

    lines.push(
      "BEGIN:VEVENT",
      `UID:liturgia-${compact(date)}-${slug(observance.name)}@phoenix.modlitwa`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(date)}`,
      `DTEND;VALUE=DATE:${compact(end)}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(description)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }

  for (const intention of intentions) {
    const end = toDateKey(addDays(fromDateKey(intention.promiseDate), 1));
    lines.push(
      "BEGIN:VEVENT",
      `UID:intencja-${intention.id}@phoenix.modlitwa`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(intention.promiseDate)}`,
      `DTEND;VALUE=DATE:${compact(end)}`,
      `SUMMARY:${escapeText(`Modlitwa za: ${intention.personName}`)}`,
      `DESCRIPTION:${escapeText(intention.reason ?? "")}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n");
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0142/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
