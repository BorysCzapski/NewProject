// ============================================================================
// lib/godziny/defaults.ts
// Zestaw startowy tematów nauki — to, co użytkownik dostaje po kliknięciu
// „Użyj gotowej listy" na pustym ekranie (spec: „Lista może być domyślna
// i/lub edytowalna przez użytkownika").
//
// Lista jest ŚWIADOMIE tylko propozycją wstrzykiwaną raz do study_topics, a
// nie zbiorem wierszy globalnych czytanych przy każdym renderze. Dzięki temu
// użytkownik może dowolny domyślny temat zmienić lub skasować, a późniejsza
// zmiana tego pliku nie przestawi nikomu istniejącej listy ani nie rozjedzie
// historii.
//
// Część propozycji bierzemy wprost z rejestru mini-aplikacji Phoenixa —
// spec mówi o wyborze z „listy tematów/aplikacji edukacyjnych", a Linguo,
// Matma czy Geografia to dokładnie te aplikacje, w których ta osoba spędza
// czas na nauce. Dopisanie kolejnej aplikacji do lib/phoenix/apps.ts
// automatycznie poszerza propozycję dla nowych użytkowników.
// ============================================================================
import { PHOENIX_APPS } from "@/lib/phoenix/apps";

export interface DefaultTopic {
  name: string;
  category: string;
}

export const APP_CATEGORY = "Aplikacje";

/**
 * Same "Godziny" nie proponujemy jako tematu — to licznik czasu nauki, a nie
 * coś, czego się człowiek uczy. Bez tego wyjątku aplikacja wpisywałaby samą
 * siebie na listę przedmiotów przy pierwszym uruchomieniu.
 */
const SELF_APP_ID = "godziny";

/** Tematy „szkolne" i „własne" — stała część propozycji. */
const FIXED_DEFAULTS: DefaultTopic[] = [
  { name: "Matematyka", category: "Szkoła" },
  { name: "Język polski", category: "Szkoła" },
  { name: "Język angielski", category: "Szkoła" },
  { name: "Historia", category: "Szkoła" },
  { name: "Biologia", category: "Szkoła" },
  { name: "Chemia", category: "Szkoła" },
  { name: "Fizyka", category: "Szkoła" },
  { name: "Programowanie", category: "Rozwój własny" },
  { name: "Czytanie książek", category: "Rozwój własny" },
  { name: "Kurs online", category: "Rozwój własny" },
];

/**
 * Pełna propozycja: aplikacje edukacyjne Phoenixa + tematy stałe.
 *
 * Nazwy deduplikujemy bez uwzględniania wielkości liter, bo dokładnie tego
 * pilnuje unikalny indeks study_topics_user_name_idx — bez tego dodanie do
 * lib/phoenix/apps.ts aplikacji nazwanej jak przedmiot szkolny wywaliłoby
 * cały seed na naruszeniu unikalności.
 */
export function defaultTopics(): DefaultTopic[] {
  const fromApps: DefaultTopic[] = PHOENIX_APPS.filter(
    (app) => app.section === "nauka" && !app.comingSoon && app.id !== SELF_APP_ID
  ).map((app) => ({ name: app.name, category: APP_CATEGORY }));

  const seen = new Set<string>();
  const unique: DefaultTopic[] = [];
  for (const topic of [...fromApps, ...FIXED_DEFAULTS]) {
    const key = topic.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(topic);
  }
  return unique;
}

/**
 * Kolor tematu = slot palety --chart-1..8. Przydzielamy po kolei (a nie
 * losowo), żeby ta sama lista domyślna zawsze wyglądała tak samo i żeby
 * sąsiednie pozycje nie dostały tego samego odcienia.
 */
export function colorIndexFor(position: number): number {
  return position % 8;
}
