// ============================================================================
// lib/zusia/crosswords.ts
// Crossword word lists. The grid layout is computed at runtime by
// lib/zusia/crossword-layout.ts (deterministic), so only answer + clue are
// stored here. Answers are single words without spaces or hyphens; Polish
// letters are kept (Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż).
// ============================================================================
import type { Crossword } from "./types";

export const CROSSWORDS: Crossword[] = [
  {
    id: "cw-l1-podrecznik",
    lesson: "l1",
    title: "Krzyżówka z podręcznika (lekcja 1)",
    entries: [
      { answer: "BISMARCK", clue: "Wprowadził ubezpieczenia społeczne w II Rzeszy." },
      { answer: "RYZYKO", clue: "Tak eksperci nazywają chroniony świadczeniem skutek zdarzenia losowego." },
      { answer: "PŁATNIK", clue: "Tę funkcję pełni w ubezpieczeniu społecznym np. pracodawca czy zleceniodawca." },
      { answer: "EMERYTURA", clue: "Świadczenie, które przyznaje i wypłaca ZUS, jeśli osiągniesz określony wiek." },
      { answer: "ZAKŁAD", clue: "… Ubezpieczeń Społecznych." },
      { answer: "KONTA", clue: "ZUS prowadzi je dla każdego ubezpieczonego i płatnika składek." },
      { answer: "PARLAMENT", clue: "Instytucja, która uchwala zasady funkcjonowania systemu ubezpieczeń." },
    ],
  },
  {
    id: "cw-l1-system",
    lesson: "l1",
    title: "System i zadania ZUS",
    entries: [
      { answer: "FUS", clue: "Fundusz, do którego wpływają składki na ubezpieczenia społeczne." },
      { answer: "MOŚCICKI", clue: "Prezydent, który powołał ZUS w 1934 r." },
      { answer: "NFZ", clue: "Do niego ZUS przekazuje składki zdrowotne." },
      { answer: "SKŁADKA", clue: "Procent wynagrodzenia płacony na ubezpieczenie." },
      { answer: "ŚWIADCZENIE", clue: "Pieniądze wypłacane z ubezpieczenia, gdy ryzyko się spełni." },
      { answer: "USTAWA", clue: "Akt prawny z 13 października 1998 r. – podstawa działania ZUS." },
      { answer: "ZASIŁEK", clue: "Krótkoterminowe świadczenie: chorobowy, macierzyński lub opiekuńczy." },
      { answer: "RENTA", clue: "Świadczenie przy niezdolności do pracy." },
    ],
  },
  {
    id: "cw-l2",
    lesson: "l2",
    title: "Ubezpieczenia i zasiłki",
    entries: [
      { answer: "CHOROBOWE", clue: "Ubezpieczenie obowiązkowe tylko przy umowie o pracę." },
      { answer: "WYPADKOWE", clue: "Ubezpieczenie finansowane w całości przez pracodawcę." },
      { answer: "WYCZEKIWANIA", clue: "Okres … – 30 lub 90 dni ubezpieczenia przed zasiłkiem chorobowym." },
      { answer: "MACIERZYŃSKI", clue: "Zasiłek po urodzeniu dziecka: 20 tygodni po 100%." },
      { answer: "OPIEKUŃCZY", clue: "Zasiłek 80% pensji, do 60 dni w roku." },
      { answer: "DZIEŁO", clue: "Umowa, od której nie płaci się składek na ubezpieczenia społeczne." },
      { answer: "REHABILITACYJNE", clue: "Świadczenie po wyczerpaniu zasiłku chorobowego, do 12 miesięcy." },
      { answer: "OJCOWSKI", clue: "Urlop, za który przysługuje do 2 tygodni zasiłku." },
      { answer: "RENTOWE", clue: "Ubezpieczenie chroniące przed niezdolnością do pracy." },
    ],
  },
  {
    id: "cw-l3",
    lesson: "l3",
    title: "Renty i emerytury",
    entries: [
      { answer: "ORZECZNIK", clue: "Lekarz ZUS orzekający niezdolność do pracy." },
      { answer: "WALORYZACJA", clue: "Coroczne zwiększanie wartości składek na koncie i subkoncie." },
      { answer: "SUBKONTO", clue: "Wydzielona część konta w ZUS, dziedziczona i dzielona przy rozwodzie." },
      { answer: "KAPITAŁ", clue: "…początkowy – wartość pracy sprzed 1999 r." },
      { answer: "SOCJALNA", clue: "Renta finansowana przez państwo, nie z ubezpieczenia." },
      { answer: "RODZINNA", clue: "Renta dla bliskich zmarłego utrzymującego rodzinę." },
      { answer: "SOLIDARNOŚĆ", clue: "Międzypokoleniowa zasada działania systemu emerytalnego." },
      { answer: "SKŁADKOWE", clue: "Okresy związane z pracą i opłacaną składką." },
      { answer: "POGRZEBOWY", clue: "Zasiłek 7000 zł dla osoby, która pokryła koszty pogrzebu." },
      { answer: "SPRZECIW", clue: "Składasz go od orzeczenia lekarza orzecznika w 14 dni." },
    ],
  },
  {
    id: "cw-l4",
    lesson: "l4",
    title: "ABC przedsiębiorcy",
    entries: [
      { answer: "CEIDG", clue: "Rejestr, w którym wpisuje się działalność gospodarczą." },
      { answer: "PREFERENCYJNE", clue: "Składki liczone od 30% minimalnego wynagrodzenia przez 24 miesiące." },
      { answer: "WAKACJE", clue: "Składkowe: jeden miesiąc w roku bez składek." },
      { answer: "PŁATNIK", clue: "Program do rozliczeń z ZUS bez limitu osób." },
      { answer: "DEKLARACJA", clue: "ZUS DRA to … rozliczeniowa." },
      { answer: "START", clue: "Ulga na … – 6 miesięcy bez składek społecznych." },
      { answer: "ZDROWOTNA", clue: "Składka, której nie obejmuje żadna ulga." },
      { answer: "RACHUNEK", clue: "Składkowy – NRS, na który płacisz jednym przelewem." },
      { answer: "ODROCZENIE", clue: "Wniosek, gdy nie możesz płacić składek na bieżąco." },
    ],
  },
  {
    id: "cw-d1",
    lesson: "d1",
    title: "Materiały dodatkowe",
    entries: [
      { answer: "HONOROWE", clue: "Świadczenie dla osób, które skończyły 100 lat." },
      { answer: "DOPEŁNIAJĄCY", clue: "Dodatek do renty socjalnej dla niezdolnych do samodzielnej egzystencji." },
      { answer: "WDOWIA", clue: "Renta rodzinna połączona z własnym świadczeniem." },
      { answer: "PORTAL", clue: "eZUS to … usług elektronicznych ZUS (dawne PUE)." },
      { answer: "POGRZEBOWY", clue: "Zasiłek, o który wnioskuje się na formularzu Z-12." },
      { answer: "POŁOŻNA", clue: "Obok lekarza ginekologa może wystawić zaświadczenie po utracie ciąży." },
      { answer: "STAŻ", clue: "Do niego można doliczyć okresy z umowy zlecenia (wniosek USP)." },
      { answer: "MINIMIS", clue: "Pomoc de …, jaką są wakacje składkowe." },
    ],
  },
  {
    id: "cw-d2",
    lesson: "d2",
    title: "Składki 2026",
    entries: [
      { answer: "RYCZAŁT", clue: "Forma opodatkowania z trzema progami składki zdrowotnej." },
      { answer: "PODSTAWA", clue: "Kwota, od której liczysz składkę (np. 5652 zł)." },
      { answer: "MINIMALNE", clue: "Wynagrodzenie – 4806 zł w 2026 r." },
      { answer: "LINIOWY", clue: "Podatek, przy którym składka zdrowotna wynosi 4,9%." },
      { answer: "PREFERENCYJNA", clue: "Podstawa 1441,80 zł." },
      { answer: "PRZECIĘTNE", clue: "Prognozowane … wynagrodzenie: 9420 zł." },
      { answer: "EMERYTALNA", clue: "Najwyższa składka społeczna: 19,52%." },
      { answer: "PRZYCHÓD", clue: "Od niego zależą progi składki zdrowotnej na ryczałcie." },
    ],
  },
];

export function getCrossword(id: string): Crossword | undefined {
  return CROSSWORDS.find((c) => c.id === id);
}
