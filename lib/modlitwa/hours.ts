// ============================================================================
// lib/modlitwa/hours.ts
// Liturgia godzin: układ poszczególnych godzin (Godzina czytań, Jutrznia,
// Modlitwa w ciągu dnia, Nieszpory, Kompleta) wraz z tekstami stałymi.
//
// Zakres — świadoma decyzja: aplikacja prowadzi PRZEZ strukturę godziny
// (wezwanie, psalmodia, czytanie, kantyk, prośby, modlitwa) i podaje teksty
// stałe oraz sigla psalmów i kantyków na dany dzień. Nie kopiuje natomiast
// hymnów, psalmów ani kantyków z Liturgii Godzin — to chronione tłumaczenia
// (patrz nagłówek lib/modlitwa/prayers.ts). Pełne teksty są jednym kliknięciem
// dalej, na brewiarz.pl, a czytanie krótkie bierzemy z czytań dnia, które i
// tak już pobieramy (lib/modlitwa/readings.ts).
//
// Psalmodia Komplety jest w rzeczywistości jednotygodniowa i stała, więc
// podajemy ją dokładnie. Dla pozostałych godzin psałterz jest czterotygodniowy
// i zależny od okresu — tam podajemy tydzień psałterza wyliczony z kalendarza
// i odsyłamy do pełnego układu.
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

export type HourId = "godzina-czytan" | "jutrznia" | "w-ciagu-dnia" | "nieszpory" | "kompleta";

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
  /** Kiedy tradycyjnie się ją odmawia — używane też do sortowania w UI. */
  timeHint: string;
  description: string;
  /** lucide-react icon name, mapowane w components/modlitwa/hour-icon.tsx. */
  icon: string;
}

export const HOURS: HourDefinition[] = [
  {
    id: "godzina-czytan",
    name: "Godzina czytań",
    latin: "Officium lectionis (Matutinum)",
    timeHint: "o dowolnej porze dnia",
    description: "Dłuższa medytacja nad Pismem i tekstem Ojców Kościoła.",
    icon: "BookOpen",
  },
  {
    id: "jutrznia",
    name: "Jutrznia",
    latin: "Laudes matutinae",
    timeHint: "rano, na początek dnia",
    description: "Modlitwa poranna: uświęcenie dnia i dziękczynienie za świt.",
    icon: "Sunrise",
  },
  {
    id: "w-ciagu-dnia",
    name: "Modlitwa w ciągu dnia",
    latin: "Hora media",
    timeHint: "około południa",
    description: "Krótka przerwa w pracy — psalmy, czytanie i prośba.",
    icon: "Sun",
  },
  {
    id: "nieszpory",
    name: "Nieszpory",
    latin: "Vesperae",
    timeHint: "wieczorem",
    description: "Dziękczynienie za miniony dzień z kantykiem Maryi.",
    icon: "Sunset",
  },
  {
    id: "kompleta",
    name: "Kompleta",
    latin: "Completorium",
    timeHint: "przed snem",
    description: "Ostatnia modlitwa dnia, zakończona antyfoną maryjną.",
    icon: "Moon",
  },
];

export function getHour(id: string): HourDefinition | undefined {
  return HOURS.find((h) => h.id === id);
}

export const HOUR_LABELS: Record<HourId, string> = {
  "godzina-czytan": "Godzina czytań",
  jutrznia: "Jutrznia",
  "w-ciagu-dnia": "Modlitwa w ciągu dnia",
  nieszpory: "Nieszpory",
  kompleta: "Kompleta",
};

/** Psalmodia Komplety — stała, zależna tylko od dnia tygodnia. */
const COMPLINE_PSALMS: Record<number, { citation: string; incipit: string }> = {
  0: { citation: "Ps 91", incipit: "Kto się w opiekę oddał Najwyższemu…" },
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
 * Składa godzinę na konkretny dzień. `shortReading` to czytanie z dzisiejszej
 * liturgii słowa (pobierane osobno) — dzięki temu użytkownik ma w jednym
 * miejscu strukturę godziny i realny tekst Pisma na dziś.
 */
export function assembleHour(
  hourId: HourId,
  day: LiturgicalDay,
  shortReading: ShortReading | null
): AssembledHour {
  const definition = getHour(hourId)!;
  const weekday = fromDateKey(day.date).getDay();
  const week = ROMAN_WEEK[psalterWeek(day)];
  const fullTextUrl = "https://brewiarz.pl/";

  const opening: HourStep =
    hourId === "kompleta"
      ? {
          title: "Wezwanie",
          text: "Boże, wejrzyj ku wspomożeniu memu.\nPanie, pośpiesz ku ratunkowi memu.",
          note: "Następnie „Chwała Ojcu”.",
        }
      : {
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
          { title: "Hymn", note: "Hymn na dziś znajdziesz w brewiarzu.", citation: "Liturgia Godzin" },
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
            title: "Kantyk Symeona",
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
            title: "Kantyk Zachariasza (Benedictus)",
            citation: "Łk 1, 68-79",
            incipit: "Błogosławiony Pan, Bóg Izraela, bo lud swój nawiedził i wyzwolił…",
          },
          {
            title: "Prośby",
            note: "Wezwania na dziś — dołącz własne intencje z listy w aplikacji.",
          },
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
            title: "Kantyk Maryi (Magnificat)",
            citation: "Łk 1, 46-55",
            incipit: "Wielbi dusza moja Pana i raduje się duch mój w Bogu, Zbawicielu moim…",
          },
          { title: "Prośby", note: "Wezwania na dziś — dołącz własne intencje z listy w aplikacji." },
          ourFather,
          { title: "Modlitwa dnia", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };

    case "w-ciagu-dnia":
      return {
        definition,
        fullTextUrl,
        steps: [
          opening,
          gloria,
          { title: "Hymn", citation: `Liturgia Godzin, tydzień ${week}` },
          {
            title: "Psalmodia",
            citation: `Psałterz, tydzień ${week} — ${dayLabel(weekday)}, Modlitwa w ciągu dnia`,
            note: "Trzy krótkie psalmy albo psalmodia dodatkowa.",
          },
          readingStep,
          { title: "Modlitwa", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };

    default:
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
            note: "Tekst patrystyczny na dziś znajdziesz w brewiarzu.",
            citation: "Liturgia Godzin",
          },
          ourFather,
          { title: "Modlitwa dnia", note: `Kolekta z dnia: ${day.name}.` },
        ],
      };
  }
}

function dayLabel(weekday: number): string {
  return ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"][weekday];
}

/**
 * Godzina proponowana „na teraz” na podstawie pory dnia — sterowana zegarem
 * klienta, więc wołana z komponentu klienckiego albo z domyślną godziną.
 */
export function suggestedHour(hour: number): HourId {
  if (hour < 10) return "jutrznia";
  if (hour < 15) return "w-ciagu-dnia";
  if (hour < 20) return "nieszpory";
  return "kompleta";
}
