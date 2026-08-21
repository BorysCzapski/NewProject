// ============================================================================
// lib/modlitwa/hours.ts
// Liturgia godzin: definicje ośmiu godzin brewiarza (Wezwanie, Godzina czytań,
// Jutrznia, trzy Modlitwy w ciągu dnia, Nieszpory, Kompleta) — podział taki
// sam jak w Liturgii Godzin i na brewiarz.pl, żeby wybór pory dnia w aplikacji
// odpowiadał temu, co użytkownik faktycznie odmawia.
//
// Pełne teksty pobiera lib/modlitwa/breviary-source.ts. Ten moduł zostaje
// PRZEWODNIKIEM AWARYJNYM: gdy ILG nie udostępnia danego dnia (archiwum starsze
// niż tydzień, daty odległe) albo padnie sieć, assembleHour() składa układ
// godziny z tekstów stałych, sigli i czytania z dzisiejszej liturgii słowa —
// zamiast pustego ekranu użytkownik dostaje szkielet, po którym się pomodli.
//
// Czego tu nie ma: hymnów i psalmów przepisanych do repozytorium. Chronione
// tłumaczenia biorą się wyłącznie z ILG, z notą copyright przy każdym ekranie.
// ============================================================================
import {
  AKT_POKUTY,
  ANIOL_PANSKI,
  CHWALA_OJCU,
  KROLOWO_NIEBA,
  OJCZE_NASZ,
  POD_TWOJA_OBRONE,
  WITAJ_KROLOWO,
  type Prayer,
} from "@/lib/modlitwa/prayers";
import type { LiturgicalDay, LiturgicalSeason } from "@/lib/modlitwa/liturgical-calendar";
import { fromDateKey } from "@/lib/modlitwa/liturgical-calendar";

export type HourId =
  | "wezwanie"
  | "godzina-czytan"
  | "jutrznia"
  | "przedpoludniowa"
  | "poludniowa"
  | "popoludniowa"
  | "nieszpory"
  | "kompleta";

export interface HourStep {
  title: string;
  /** Tekst stały do odmówienia (jeśli jest). */
  text?: string;
  /** Sigla (np. „Ps 4”, „Łk 1, 68-79”) — bez pełnego tekstu. */
  citation?: string;
  /** Pierwsze słowa, żeby wiadomo było, o który tekst chodzi. */
  incipit?: string;
  /** Wyjaśnienie/rubryka. */
  note?: string;
}

export interface HourDefinition {
  id: HourId;
  name: string;
  latin: string;
  /** Kiedy tradycyjnie się ją odmawia — pokazywane przy wyborze pory dnia. */
  timeHint: string;
  /** Godzina orientacyjna (0-23) do sortowania i podpowiedzi „teraz”. */
  clockHint: number | null;
  description: string;
  /** lucide-react icon name, mapowane w components/modlitwa/hour-icon.tsx. */
  icon: string;
}

export const HOURS: HourDefinition[] = [
  {
    id: "wezwanie",
    name: "Wezwanie",
    latin: "Invitatorium",
    timeHint: "na początek dnia, przed pierwszą godziną",
    clockHint: 6,
    description: "Psalm wzywający do modlitwy — otwiera cały dzień brewiarza.",
    icon: "Bell",
  },
  {
    id: "godzina-czytan",
    name: "Godzina czytań",
    latin: "Officium lectionis",
    timeHint: "o dowolnej porze dnia",
    clockHint: null,
    description: "Dłuższa medytacja: czytanie biblijne i tekst Ojców Kościoła.",
    icon: "BookOpen",
  },
  {
    id: "jutrznia",
    name: "Jutrznia",
    latin: "Laudes matutinae",
    timeHint: "rano, na początek dnia",
    clockHint: 7,
    description: "Modlitwa poranna z Pieśnią Zachariasza — uświęcenie dnia.",
    icon: "Sunrise",
  },
  {
    id: "przedpoludniowa",
    name: "Modlitwa przedpołudniowa",
    latin: "Tertia",
    timeHint: "około godziny 9",
    clockHint: 9,
    description: "Krótka przerwa w pracy — trzy psalmy, czytanie i modlitwa.",
    icon: "Sun",
  },
  {
    id: "poludniowa",
    name: "Modlitwa południowa",
    latin: "Sexta",
    timeHint: "około południa",
    clockHint: 12,
    description: "Południowe zatrzymanie się w środku dnia.",
    icon: "Sun",
  },
  {
    id: "popoludniowa",
    name: "Modlitwa popołudniowa",
    latin: "Nona",
    timeHint: "około godziny 15",
    clockHint: 15,
    description: "Popołudniowa modlitwa — godzina śmierci Pana.",
    icon: "Sun",
  },
  {
    id: "nieszpory",
    name: "Nieszpory",
    latin: "Vesperae",
    timeHint: "wieczorem",
    clockHint: 18,
    description: "Dziękczynienie za miniony dzień z Pieśnią Maryi.",
    icon: "Sunset",
  },
  {
    id: "kompleta",
    name: "Kompleta",
    latin: "Completorium",
    timeHint: "przed snem",
    clockHint: 21,
    description: "Ostatnia modlitwa dnia, zakończona antyfoną maryjną.",
    icon: "Moon",
  },
];

export function getHour(id: string): HourDefinition | undefined {
  return HOURS.find((h) => h.id === id);
}

export const HOUR_LABELS: Record<HourId, string> = {
  wezwanie: "Wezwanie",
  "godzina-czytan": "Godzina czytań",
  jutrznia: "Jutrznia",
  przedpoludniowa: "Modlitwa przedpołudniowa",
  poludniowa: "Modlitwa południowa",
  popoludniowa: "Modlitwa popołudniowa",
  nieszpory: "Nieszpory",
  kompleta: "Kompleta",
};

/** Krótkie etykiety do przełącznika pory dnia (wąskie ekrany). */
export const HOUR_SHORT_LABELS: Record<HourId, string> = {
  wezwanie: "Wezwanie",
  "godzina-czytan": "Czytań",
  jutrznia: "Jutrznia",
  przedpoludniowa: "Przedpoł.",
  poludniowa: "Południe",
  popoludniowa: "Popoł.",
  nieszpory: "Nieszpory",
  kompleta: "Kompleta",
};

/** Psalmodia Komplety — stała, zależna tylko od dnia tygodnia. */
const COMPLINE_PSALMS: Record<number, { citation: string; incipit: string }> = {
  0: { citation: "Ps 91", incipit: "Kto przebywa w pieczy Najwyższego…" },
  1: { citation: "Ps 86", incipit: "Nakłoń swe ucho, wysłuchaj mnie, Panie…" },
  2: { citation: "Ps 143, 1-11", incipit: "Usłysz, Panie, modlitwę moją…" },
  3: { citation: "Ps 31, 2-6; Ps 130", incipit: "Panie, do Ciebie się uciekam…" },
  4: { citation: "Ps 16", incipit: "Zachowaj mnie, Boże, bo chronię się do Ciebie…" },
  5: { citation: "Ps 88", incipit: "Panie, Boże mój, wołam do Ciebie we dnie…" },
  6: { citation: "Ps 4; Ps 134", incipit: "Kiedy Cię wzywam, odpowiedz mi, Boże…" },
};

/** Antyfona maryjna kończąca Kompletę — zmienia się wraz z okresem. */
export function marianAntiphon(season: LiturgicalSeason): Prayer {
  if (season === "wielkanoc" || season === "triduum") return KROLOWO_NIEBA;
  if (season === "adwent" || season === "boze_narodzenie") return POD_TWOJA_OBRONE;
  return WITAJ_KROLOWO;
}

/**
 * Tydzień czterotygodniowego psałterza (I–IV). Liczy się od I Niedzieli
 * Adwentu jako tygodnia I; w okresie zwykłym wyznacza go numer tygodnia.
 */
export function psalterWeek(day: LiturgicalDay): number {
  const week = day.weekNumber ?? 1;
  return ((Math.max(week, 1) - 1) % 4) + 1;
}

const ROMAN_WEEK = ["", "I", "II", "III", "IV"];

export interface AssembledHour {
  definition: HourDefinition;
  steps: HourStep[];
  /** Adres pełnych tekstów w serwisie brewiarz.pl. */
  fullTextUrl: string;
}

export interface ShortReading {
  citation: string | null;
  text: string | null;
}

/**
 * Awaryjny układ godziny na konkretny dzień — używany, gdy nie mamy pełnych
 * tekstów z ILG. `shortReading` to czytanie z dzisiejszej liturgii słowa.
 */
export function assembleHour(
  hourId: HourId,
  day: LiturgicalDay,
  shortReading: ShortReading | null,
  fullTextUrl = "https://brewiarz.pl/"
): AssembledHour {
  const definition = getHour(hourId)!;
  const weekday = fromDateKey(day.date).getDay();
  const week = ROMAN_WEEK[psalterWeek(day)];

  const opening: HourStep = {
    title: "Wezwanie",
    text: "Boże, wejrzyj ku wspomożeniu memu.\nPanie, pośpiesz ku ratunkowi memu.",
    note:
      day.season === "wielki_post"
        ? "Bez „Alleluja” — trwa Wielki Post."
        : "Zakończ słowami „Chwała Ojcu… Alleluja”.",
  };

  const gloria: HourStep = { title: CHWALA_OJCU.title, text: CHWALA_OJCU.text };

  const readingStep: HourStep = {
    title: "Czytanie",
    citation: shortReading?.citation ?? undefined,
    text: shortReading?.text ?? undefined,
    note: shortReading?.text
      ? "Czytanie z dzisiejszej liturgii słowa."
      : "Czytania na dziś nie udało się pobrać — sięgnij po Pismo Święte lub brewiarz.pl.",
  };

  const ourFather: HourStep = { title: OJCZE_NASZ.title, text: OJCZE_NASZ.text };

  switch (hourId) {
    case "wezwanie":
      return {
        definition,
        fullTextUrl,
        steps: [
          {
            title: "Wezwanie",
            text: "Panie, otwórz wargi moje.\nA usta moje będą głosić Twoją chwałę.",
          },
          {
            title: "Psalm wezwania",
            citation: "Ps 95 (94)",
            incipit: "Przyjdźcie, radośnie śpiewajmy Panu…",
            note: "Zamiennie: Ps 100, Ps 67 albo Ps 24 — z antyfoną dnia.",
          },
          gloria,
        ],
      };

    case "kompleta": {
      const psalm = COMPLINE_PSALMS[weekday];
      const antiphon = marianAntiphon(day.season);
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          {
            title: "Rachunek sumienia",
            text: AKT_POKUTY.text,
            note: "Chwila ciszy: co dziś było dobre, a co wymaga przebaczenia.",
          },
          { title: "Hymn", citation: "Liturgia Godzin", note: "Hymn na dziś znajdziesz w brewiarzu." },
          {
            title: "Psalmodia",
            citation: psalm.citation,
            incipit: psalm.incipit,
            note: "Psalmy Komplety są stałe i zależą tylko od dnia tygodnia.",
          },
          readingStep,
          {
            title: "Responsorium",
            text: "W ręce Twoje, Panie, powierzam ducha mojego.\nTy nas odkupiłeś, Panie, Boże wierny.",
          },
          {
            title: "Pieśń Symeona",
            citation: "Łk 2, 29-32",
            incipit: "Teraz, o Panie, pozwól odejść słudze Twemu w pokoju…",
            note: "Antyfona: „Strzeż nas, Panie, gdy czuwamy, i podczas snu nas osłaniaj”.",
          },
          {
            title: "Modlitwa i błogosławieństwo",
            text: "Noc spokojną i śmierć szczęśliwą niech nam da Bóg wszechmogący:\nOjciec i Syn, i Duch Święty. Amen.",
          },
          { title: `Antyfona maryjna — ${antiphon.title}`, text: antiphon.text, note: antiphon.note },
        ],
      };
    }

    case "jutrznia":
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          { title: "Hymn", citation: `Liturgia Godzin, tydzień ${week}`, note: "Pełny tekst w brewiarzu." },
          {
            title: "Psalmodia",
            citation: `Psałterz, tydzień ${week} — ${dayLabel(weekday)}, Jutrznia`,
            note: "Dwa psalmy i kantyk ze Starego Testamentu.",
          },
          readingStep,
          {
            title: "Pieśń Zachariasza (Benedictus)",
            citation: "Łk 1, 68-79",
            incipit: "Błogosławiony Pan, Bóg Izraela, bo lud swój nawiedził i wyzwolił…",
          },
          { title: "Prośby", note: "Wezwania na dziś — dołącz własne intencje z listy w aplikacji." },
          ourFather,
          { title: "Modlitwa dnia", note: `Kolekta z dnia: ${day.name}.` },
          ...(day.season === "wielkanoc" || day.season === "triduum"
            ? [{ title: KROLOWO_NIEBA.title, text: KROLOWO_NIEBA.text }]
            : [{ title: ANIOL_PANSKI.title, text: ANIOL_PANSKI.text, note: ANIOL_PANSKI.note }]),
        ],
      };

    case "nieszpory":
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          { title: "Hymn", citation: `Liturgia Godzin, tydzień ${week}`, note: "Pełny tekst w brewiarzu." },
          {
            title: "Psalmodia",
            citation: `Psałterz, tydzień ${week} — ${dayLabel(weekday)}, Nieszpory`,
            note: "Dwa psalmy i kantyk z Nowego Testamentu.",
          },
          readingStep,
          {
            title: "Pieśń Maryi (Magnificat)",
            citation: "Łk 1, 46-55",
            incipit: "Wielbi dusza moja Pana i raduje się duch mój w Bogu, Zbawicielu moim…",
          },
          { title: "Prośby", note: "Wezwania na dziś — dołącz własne intencje z listy w aplikacji." },
          ourFather,
          { title: "Modlitwa dnia", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };

    case "godzina-czytan":
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          { title: "Hymn", citation: `Liturgia Godzin, tydzień ${week}` },
          {
            title: "Psalmodia",
            citation: `Psałterz, tydzień ${week} — ${dayLabel(weekday)}, Godzina czytań`,
            note: "Trzy psalmy z antyfonami.",
          },
          {
            title: "I czytanie — biblijne",
            citation: shortReading?.citation ?? undefined,
            text: shortReading?.text ?? undefined,
            note: "W brewiarzu jest to dłuższy fragment ciągły; tu masz czytanie z dzisiejszej Mszy.",
          },
          {
            title: "II czytanie — z Ojców Kościoła",
            citation: "Liturgia Godzin",
            note: "Tekst patrystyczny na dziś znajdziesz w brewiarzu.",
          },
          ourFather,
          { title: "Modlitwa dnia", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };

    default: {
      const hourNames: Record<string, string> = {
        przedpoludniowa: "przedpołudniowa",
        poludniowa: "południowa",
        popoludniowa: "popołudniowa",
      };
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          { title: "Hymn", citation: `Liturgia Godzin, tydzień ${week}` },
          {
            title: "Psalmodia",
            citation: `Psałterz, tydzień ${week} — ${dayLabel(weekday)}, modlitwa ${hourNames[hourId] ?? ""}`,
            note: "Trzy krótkie psalmy albo psalmodia dodatkowa.",
          },
          readingStep,
          { title: "Modlitwa", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };
    }
  }
}

function dayLabel(weekday: number): string {
  return ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"][weekday];
}

/**
 * Godzina proponowana „na teraz” na podstawie pory dnia. Wezwanie i Godzina
 * czytań nie mają stałej pory, więc nigdy nie są podpowiadane automatycznie.
 */
export function suggestedHour(hour: number): HourId {
  if (hour < 9) return "jutrznia";
  if (hour < 11) return "przedpoludniowa";
  if (hour < 14) return "poludniowa";
  if (hour < 17) return "popoludniowa";
  if (hour < 20) return "nieszpory";
  return "kompleta";
}
