// ============================================================================
// lib/fiszki/modes.ts
// Czysta definicja menu "Fiszki": materiały (talie leksykonu + słownictwo wg
// poziomu) i tryby nauki. Bez I/O i bez importów z serwera — używana przez strony
// serwerowe, komponenty i testy.
//
// Dlaczego materiał i tryb to dwie osobne rzeczy. Linguo urosło z dwóch baz słów:
// talii leksykonu (EF, czasowniki frazowe, własne zestawy — tylko angielski) i
// słownictwa wg poziomu (A1–B2, wszystkie języki). Tryby nauki stały obok siebie
// jako sześć kafelków bez informacji, na czym który pracuje. Teraz wybierasz
// materiał, a potem tryb — i widzisz, które tryby ten materiał obsługuje.
// ============================================================================

export type FiszkiModeId = "znaczenia" | "pisownia" | "trening" | "karty" | "quiz" | "laczenie";

export type FiszkiModeGroup = "powtorki" | "swobodne";

export interface FiszkiMode {
  id: FiszkiModeId;
  label: string;
  description: string;
  group: FiszkiModeGroup;
}

export const FISZKI_MODES: FiszkiMode[] = [
  {
    id: "znaczenia",
    label: "Znaczenia",
    description: "Codzienna sesja: nowe słowa i powtórki we właściwym terminie",
    group: "powtorki",
  },
  {
    id: "pisownia",
    label: "Pisownia",
    description: "Uzupełnij 1–2 brakujące litery w słowie",
    group: "powtorki",
  },
  {
    id: "trening",
    label: "Trening fiszek",
    description: "Widzisz polskie słowo, wpisujesz angielskie",
    group: "powtorki",
  },
  {
    id: "karty",
    label: "Fiszki",
    description: "Odwracane karty: umiem / nie umiem",
    group: "swobodne",
  },
  {
    id: "quiz",
    label: "Trener znaczeń",
    description: "Quiz EN↔PL albo wpisywanie tłumaczeń",
    group: "swobodne",
  },
  {
    id: "laczenie",
    label: "Łączenie tłumaczeń",
    description: "Połącz słowa z ich tłumaczeniami",
    group: "swobodne",
  },
];

export const FISZKI_GROUPS: Array<{ id: FiszkiModeGroup; title: string }> = [
  { id: "powtorki", title: "Z powtórkami" },
  { id: "swobodne", title: "Ćwiczenie swobodne" },
];

/**
 * Podpis pod nazwą grupy. Zależy od materiału, bo tryby swobodne zachowują się
 * inaczej: na talii leksykonu nie zapisują nic (nie ruszają harmonogramu), a na
 * słownictwie wg poziomu liczą się do opanowania słówek w Ścieżce nauki.
 */
export function groupHint(group: FiszkiModeGroup, kind: MaterialKind): string {
  if (group === "powtorki") return "Program pamięta, co umiesz, i wraca do słów w odpowiednim terminie.";
  return kind === "deck"
    ? "Szybka praktyka bez wpływu na harmonogram powtórek."
    : "Postęp liczy się do opanowania słówek w Ścieżce nauki.";
}

/** Slug materiału "słownictwo wg poziomu" (nie jest talią w bazie). */
export const LEVEL_MATERIAL = "poziom";

export type MaterialKind = "deck" | "level";

export function isFiszkiMode(value: string): value is FiszkiModeId {
  return FISZKI_MODES.some((mode) => mode.id === value);
}

/** Które tryby obsługuje dany rodzaj materiału. */
export function modeSupported(kind: MaterialKind, mode: FiszkiModeId): boolean {
  if (kind === "deck") return true;
  return mode === "karty" || mode === "quiz" || mode === "laczenie";
}

/** Dlaczego tryb jest niedostępny dla słownictwa wg poziomu. */
export const LEVEL_UNSUPPORTED_REASON = "Tylko dla talii (EF, czasowniki frazowe, własne zestawy).";

/** Minimum gotowych słów (z tłumaczeniem), żeby tryb swobodny miał sens. */
export const MIN_PRACTICE_ENTRIES = 4;

/** Ile słów bierze jedna runda trybu swobodnego z talii. */
export const PRACTICE_BATCH = { karty: 15, quiz: 10, laczenie: 6 } as const;
