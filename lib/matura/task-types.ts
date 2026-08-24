// ============================================================================
// lib/matura/task-types.ts
// Catalog of CKE TASK TYPES per exam part — the axis the student practises
// along.
//
// Before this file the app served a fixed, numbered bank ("Zadanie 1", "Zadanie
// 2", …), so every task was a one-shot item: once done it showed a score and
// had no reason to be opened again, and a section with four tasks was
// "finished" after four attempts. That is not how the exam works. CKE never
// tests "zadanie 3"; it tests a small, stable set of TASK TYPES — słowotwórstwo,
// parafraza, dobieranie, test wyboru… — which recur in every session with
// completely different content. This file names those types. The section page
// counts how many times the student has completed each type and hands out a
// FRESH task of that type on every attempt (lib/matura/task-stock.ts).
//
// One catalog serves angielski AND hiszpański: CKE publishes one format for all
// języki obce nowożytne, so only the generated content differs per language —
// same reasoning that keeps the exam parts themselves shared in
// lib/matura/sections.ts.
//
// CAVEAT, same class as matura_sections.exam_weight in 0013_matura.sql: the
// LEVELS each type is offered at are an approximation. CKE rotates its task set
// between sessions and does not publish a fixed per-level list that stays
// stable, so `levels` below encodes what the arkusze consistently show rather
// than a guaranteed rule. Widening or narrowing a type is a one-line edit here.
// ============================================================================
import type {
  MaturaLevel,
  MaturaSectionSlug,
  MaturaTaskItemType,
  MaturaTaskTypeSlug,
  MaturaWritingFormType,
} from "@/lib/types/database";

export interface MaturaTaskTypeDef {
  slug: MaturaTaskTypeSlug;
  /** Exam part this type belongs to. */
  section: MaturaSectionSlug;
  levels: MaturaLevel[];
  label: string;
  description: string;
  /** Shape of the graded sub-items a task of this type is built from. */
  itemType: MaturaTaskItemType;
  /** Graded sub-items per task — also its points_max (1 pt per item, see the
   * matura_tasks comment in 0013_matura.sql). */
  itemCount: number;
  /**
   * False for types whose authenticity depends on material the model cannot
   * invent — rozumienie ze słuchu needs a REAL recording (matura_tasks.content
   * carries a youtubeVideoId), and a made-up transcript the student reads
   * instead of hears is not a listening task. Those types rotate over the
   * curated bank instead of being topped up; everything else is generated on
   * demand. See lib/matura/task-stock.ts.
   */
  aiGeneratable: boolean;
  /** Type-specific brief appended to the generator's system prompt. */
  aiBrief: string;
}

export const MATURA_TASK_TYPES: MaturaTaskTypeDef[] = [
  // ——— Znajomość środków językowych ———
  {
    slug: "slowotworstwo",
    section: "srodki-jezykowe",
    levels: ["podstawowa", "rozszerzona"],
    label: "Słowotwórstwo",
    description: "Przekształć wyraz podany w nawiasie, żeby pasował do zdania.",
    itemType: "gap_fill",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      "Każdy item to zdanie z jedną luką ___ oraz wyrazem bazowym WIELKIMI LITERAMI w nawiasie. " +
      "Ustaw transformWord na ten wyraz bazowy. Poprawna odpowiedź to WYŁĄCZNIE brakujący wyraz " +
      "(nie całe zdanie). Mieszaj części mowy: rzeczownik, przymiotnik, przysłówek, przeczenie " +
      "(un-/in-/dis-). W explanation podaj regułę słowotwórczą po polsku.",
  },
  {
    slug: "luki-otwarte",
    section: "srodki-jezykowe",
    levels: ["podstawowa", "rozszerzona"],
    label: "Uzupełnianie luk",
    description: "Wpisz brakujący wyraz — bez podpowiedzi i bez wariantów do wyboru.",
    itemType: "gap_fill",
    itemCount: 5,
    aiGeneratable: true,
    aiBrief:
      "Każdy item to zdanie z jedną luką ___, bez wyrazu bazowego (NIE ustawiaj transformWord). " +
      "Luka ma sprawdzać gramatykę funkcyjną: przyimek, czasownik posiłkowy, zaimek, spójnik, " +
      "przedimek albo element kolokacji. Odpowiedź to jeden wyraz. Jeśli poprawnych wariantów jest " +
      "kilka, wypisz je wszystkie w correctAnswers.",
  },
  {
    slug: "formy-czasownika",
    section: "srodki-jezykowe",
    levels: ["podstawowa", "rozszerzona"],
    label: "Odmiana czasownika",
    description: "Wpisz czasownik z nawiasu we właściwej formie — czas, tryb, osoba.",
    itemType: "gap_fill",
    itemCount: 5,
    aiGeneratable: true,
    aiBrief:
      "Każdy item to zdanie z luką ___ i bezokolicznikiem w nawiasie (ustaw go w transformWord). " +
      "Kontekst zdania musi JEDNOZNACZNIE wymuszać jedną formę — czas, tryb i osobę — żeby zadanie " +
      "miało dokładnie jedną poprawną odpowiedź. Mieszaj czasy przeszłe, przyszłe i tryb łączący/" +
      "warunkowy tam, gdzie język egzaminu je rozróżnia. W explanation nazwij formę po polsku.",
  },
  {
    slug: "luki-wybor",
    section: "srodki-jezykowe",
    levels: ["podstawowa", "rozszerzona"],
    label: "Test wyboru",
    description: "Wybierz wariant A–D, który poprawnie uzupełnia zdanie.",
    itemType: "multiple_choice",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      'Każdy item to zdanie z luką ___ i DOKŁADNIE cztery opcje w formacie "A. tekst", "B. tekst", ' +
      '"C. tekst", "D. tekst". correctAnswers zawiera jedną opcję przepisaną DOSŁOWNIE razem z literą ' +
      "i kropką. Dystraktory muszą być wiarygodne — typowe błędy Polaków uczących się języka, nie " +
      "warianty odrzucane na pierwszy rzut oka.",
  },
  {
    slug: "parafraza",
    section: "srodki-jezykowe",
    levels: ["podstawowa", "rozszerzona"],
    label: "Parafraza zdań",
    description: "Przekształć zdanie tak, aby zachowało znaczenie, używając podanego wyrazu.",
    itemType: "gap_fill",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      "Każdy item podaje zdanie wyjściowe, wyraz kluczowy WIELKIMI LITERAMI (ustaw go w transformWord) " +
      "i zdanie docelowe z luką ___. Student wpisuje TYLKO brakujący fragment (2–5 wyrazów), " +
      "obowiązkowo zawierający wyraz kluczowy w niezmienionej formie. Sprawdzaj konstrukcje " +
      "egzaminacyjne: strona bierna, mowa zależna, tryby warunkowe, inwersja, konstrukcje z " +
      "bezokolicznikiem i gerundium.",
  },
  {
    slug: "tlumaczenie",
    section: "srodki-jezykowe",
    levels: ["rozszerzona"],
    label: "Tłumaczenie fragmentów",
    description: "Przetłumacz fragment podany po polsku, żeby zdanie było poprawne.",
    itemType: "gap_fill",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      "Każdy item to zdanie w języku obcym z luką ___, a bezpośrednio po nim — w nawiasie — polski " +
      "fragment do przetłumaczenia. NIE ustawiaj transformWord. Odpowiedź to przetłumaczony fragment " +
      "(2–6 wyrazów). Wypisz w correctAnswers wszystkie naturalne warianty tłumaczenia.",
  },

  // ——— Rozumienie tekstów pisanych ———
  {
    slug: "czytanie-wybor",
    section: "czytanie",
    levels: ["podstawowa", "rozszerzona"],
    label: "Test wyboru do tekstu",
    description: "Przeczytaj tekst i wybierz właściwą odpowiedź A–D.",
    itemType: "multiple_choice",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      "Najpierw ułóż ORYGINALNY tekst (220–320 wyrazów w języku egzaminu) i wpisz go w pole " +
      "passage — artykuł, reportaż albo relacja osobista na temat bliski maturzyście. Potem ułóż " +
      'pytania z czterema opcjami "A. …"–"D. …". Pytania mają sprawdzać zrozumienie treści, ' +
      "intencji autora i znaczenia z kontekstu — odpowiedzi NIE mogą dać się zgadnąć bez tekstu, " +
      "ale każda musi dać się w nim jednoznacznie uzasadnić.",
  },
  {
    slug: "czytanie-dobieranie",
    section: "czytanie",
    levels: ["podstawowa", "rozszerzona"],
    label: "Dobieranie",
    description: "Dopasuj nagłówek lub zdanie do właściwego akapitu tekstu.",
    itemType: "multiple_choice",
    itemCount: 4,
    aiGeneratable: true,
    aiBrief:
      "W polu passage umieść ORYGINALNY tekst podzielony na ponumerowane akapity (1., 2., 3., …), " +
      "po jednym na item. Każdy item pyta o jeden akapit, a opcje to te same 5–6 nagłówków " +
      'w formacie "A. …"–"E. …" powtórzone przy każdym pytaniu, z czego jeden pasuje. Zostaw ' +
      "co najmniej jeden nagłówek niepasujący do żadnego akapitu — CKE zawsze daje nadmiarowy.",
  },
  {
    slug: "czytanie-prawda-falsz",
    section: "czytanie",
    levels: ["podstawowa"],
    label: "Prawda / Fałsz",
    description: "Oceń, czy zdanie jest zgodne z tekstem.",
    itemType: "multiple_choice",
    itemCount: 5,
    aiGeneratable: true,
    aiBrief:
      "W polu passage umieść ORYGINALNY tekst (180–260 wyrazów). Każdy item to zdanie o tekście " +
      'z dokładnie dwiema opcjami: "A. Prawda" i "B. Fałsz". Rozłóż odpowiedzi mniej więcej po ' +
      "połowie. Zdania fałszywe mają być fałszywe przez KONKRETNY szczegół zaprzeczony w tekście, " +
      "nie przez brak informacji.",
  },

  // ——— Rozumienie ze słuchu ———
  // aiGeneratable: false — patrz komentarz przy polu w MaturaTaskTypeDef.
  {
    slug: "sluchanie-wybor",
    section: "sluchanie",
    levels: ["podstawowa", "rozszerzona"],
    label: "Test wyboru do nagrania",
    description: "Wysłuchaj nagrania i wybierz właściwą odpowiedź A–D.",
    itemType: "multiple_choice",
    itemCount: 5,
    aiGeneratable: false,
    aiBrief: "",
  },
  {
    slug: "sluchanie-dobieranie",
    section: "sluchanie",
    levels: ["podstawowa", "rozszerzona"],
    label: "Dobieranie do wypowiedzi",
    description: "Dopasuj zdanie do wypowiedzi właściwej osoby.",
    itemType: "multiple_choice",
    itemCount: 4,
    aiGeneratable: false,
    aiBrief: "",
  },
];

/** Types offered for a given exam part at a given poziom, in catalog order. */
export function taskTypesFor(section: MaturaSectionSlug, level: MaturaLevel): MaturaTaskTypeDef[] {
  return MATURA_TASK_TYPES.filter((t) => t.section === section && t.levels.includes(level));
}

export function getTaskType(slug: string): MaturaTaskTypeDef | undefined {
  return MATURA_TASK_TYPES.find((t) => t.slug === slug);
}

// ----------------------------------------------------------------------------
// Wypowiedź pisemna. Writing already carries its type as
// matura_writing_tasks.form_type, so it needs no new column — only the same
// level mapping and generator brief the exact-match types get above.
//
// CKE's rozszerzony prompt is a TEKST ARGUMENTACYJNY and the arkusz names the
// form: rozprawka, artykuł publicystyczny or list formalny. All three are
// graded against one form-independent rubric (lib/matura/writing-grading.ts),
// so adding them is a catalog entry, not a grading change.
// ----------------------------------------------------------------------------
export interface MaturaWritingTypeDef {
  formType: MaturaWritingFormType;
  levels: MaturaLevel[];
  label: string;
  description: string;
  aiBrief: string;
}

export const MATURA_WRITING_TYPES: MaturaWritingTypeDef[] = [
  {
    formType: "email",
    levels: ["podstawowa"],
    label: "E-mail",
    description: "E-mail do znajomego lub instytucji, 100–150 wyrazów.",
    aiBrief: "Sytuacja wymagająca napisania e-maila — do kolegi z zagranicy, do szkoły językowej, do hotelu.",
  },
  {
    formType: "blog_post",
    levels: ["podstawowa"],
    label: "Wpis na blogu",
    description: "Wpis na blogu o własnym doświadczeniu, 100–150 wyrazów.",
    aiBrief:
      "Sytuacja z życia maturzysty, o której naturalnie pisze się na blogu — wyjazd, wydarzenie, zmiana w życiu.",
  },
  {
    formType: "forum_post",
    levels: ["podstawowa"],
    label: "Wpis na forum",
    description: "Odpowiedź na wątek na forum internetowym, 100–150 wyrazów.",
    aiBrief: "Wątek na forum, w którym ktoś prosi o radę lub opinię, a zdający odpowiada.",
  },
  {
    formType: "rozprawka_za_i_przeciw",
    levels: ["rozszerzona"],
    label: "Rozprawka za i przeciw",
    description: "Tekst argumentacyjny z argumentami obu stron, 200–250 wyrazów.",
    aiBrief: "Teza, wobec której da się uczciwie zebrać argumenty za i przeciw. Oba podpunkty to strony sporu.",
  },
  {
    formType: "artykul",
    levels: ["rozszerzona"],
    label: "Artykuł publicystyczny",
    description: "Artykuł do gazetki lub portalu, z tezą i przykładami, 200–250 wyrazów.",
    aiBrief:
      "Temat dla gazetki szkolnej albo portalu młodzieżowego — zjawisko społeczne, technologia, edukacja, kultura.",
  },
  {
    formType: "list_formalny",
    levels: ["rozszerzona"],
    label: "List formalny",
    description: "List oficjalny: skarga, podanie lub propozycja, 200–250 wyrazów.",
    aiBrief:
      "Sytuacja wymagająca oficjalnego listu — skarga na usługę, podanie o staż, propozycja współpracy, list do redakcji.",
  },
];

export function writingTypesFor(level: MaturaLevel): MaturaWritingTypeDef[] {
  return MATURA_WRITING_TYPES.filter((t) => t.levels.includes(level));
}

export function getWritingType(formType: string): MaturaWritingTypeDef | undefined {
  return MATURA_WRITING_TYPES.find((t) => t.formType === formType);
}
