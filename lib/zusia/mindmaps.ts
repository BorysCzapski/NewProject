// ============================================================================
// lib/zusia/mindmaps.ts
// One mind map per lesson (the book's „Ćwiczenie – mapa myśli” prompts filled
// in), plus extra maps for the biggest topics. Rendered by
// components/zusia/mind-map.tsx with a recall mode that hides the leaves.
// ============================================================================
import type { MindMap } from "./types";

export const MIND_MAPS: MindMap[] = [
  {
    id: "mm-l1-zus",
    lesson: "l1",
    center: "ZUS",
    branches: [
      { label: "Podstawa prawna", items: ["ustawa z 13 października 1998 r. o systemie ubezpieczeń społecznych", "rozporządzenie prezydenta Mościckiego z 24.10.1934 r. – powołanie ZUS", "Konstytucja RP: prawo do zabezpieczenia społecznego"] },
      { label: "Cel ubezpieczeń", items: ["pieniądze na podstawowe potrzeby, gdy nie możesz pracować", "ochrona przed skutkami ryzyka: choroba, wypadek, macierzyństwo, starość", "powszechność → niższe składki"] },
      { label: "Najważniejsze zadania", items: ["prowadzi indywidualne konta ubezpieczonych i płatników", "pobiera składki i zapisuje je na kontach", "wydaje decyzje o podleganiu ubezpieczeniom i prawie do świadczeń", "przekazuje składki zdrowotne do NFZ", "prewencja rentowa i wypadkowa, rehabilitacja lecznicza"] },
      { label: "Przyznaje i wypłaca", items: ["długoterminowe: emerytury, renty", "krótkoterminowe: zasiłki chorobowe, macierzyńskie, opiekuńcze", "zasiłek pogrzebowy, świadczenie rehabilitacyjne"] },
      { label: "Zarządza funduszem", items: ["Fundusz Ubezpieczeń Społecznych (FUS)", "składki + dotacje budżetowe + Fundusz Rezerwy Demograficznej", "FUS ≈ 54,4% wydatków budżetu państwa (2026)"] },
      { label: "Uczestnicy systemu", items: ["ubezpieczeni (>16 mln)", "świadczeniobiorcy (~10 mln emerytów i rencistów)", "płatnicy składek (~3 mln)"] },
      { label: "Czego ZUS nie robi", items: ["nie tworzy prawa – robi to parlament", "nie ustala stóp składek ani zasad obliczania świadczeń", "nie gromadzi składek zdrowotnych"] },
    ],
  },
  {
    id: "mm-l1-roznice",
    lesson: "l1",
    center: "Pomoc a ubezpieczenie",
    branches: [
      { label: "Ubezpieczenie społeczne", items: ["prawo do świadczeń w zamian za składki", "zasiłek chorobowy, macierzyński, emerytura"] },
      { label: "Pomoc społeczna", items: ["bez składek – wsparcie w trudnej sytuacji", "ubóstwo, bezdomność, bezrobocie, przemoc, klęski żywiołowe", "cel: usamodzielnienie i integracja"] },
      { label: "Zaopatrzenie społeczne", items: ["bez składek, ale jak ubezpieczenie", "800+, emerytury policyjne"] },
    ],
  },
  {
    id: "mm-l2-ubezpieczenia",
    lesson: "l2",
    center: "Ubezpieczenia społeczne",
    branches: [
      { label: "Emerytalne (starość)", items: ["składka 19,52% = 9,76% + 9,76%", "obowiązkowe: praca, zlecenie, działalność"] },
      { label: "Rentowe (niezdolność do pracy)", items: ["składka 8% = 6,5% pracodawca + 1,5% pracownik", "renta z tytułu niezdolności do pracy, rodzinna, zasiłek pogrzebowy"] },
      { label: "Chorobowe (choroba, macierzyństwo)", items: ["składka 2,45% – płaci pracownik", "obowiązkowe tylko przy umowie o pracę", "zasiłek chorobowy, macierzyński, opiekuńczy, świadczenie rehabilitacyjne"] },
      { label: "Wypadkowe (wypadek przy pracy)", items: ["składkę płaci w całości pracodawca", "zasiłek chorobowy i świadczenie rehabilitacyjne = 100%", "renta wypadkowa, jednorazowe odszkodowanie (20% przeciętnego za 1% uszczerbku)"] },
      { label: "Zdrowotne", items: ["9% (4,9% liniowy)", "ZUS przekazuje do NFZ"] },
      { label: "Kto jest objęty?", items: ["umowa o dzieło – żadne", "zlecenie ucznia/studenta do 26 lat – żadne", "zlecenie i działalność – chorobowe dobrowolne", "umowa o pracę – wszystkie obowiązkowe"] },
    ],
  },
  {
    id: "mm-l2-swiadczenia",
    lesson: "l2",
    center: "Świadczenia z ubezpieczeń chorobowego i wypadkowego",
    branches: [
      { label: "Zasiłek chorobowy", items: ["80% pensji (100%: ciąża, wypadek w drodze/przy pracy)", "182 dni (270 – ciąża, gruźlica; 91 po ustaniu tytułu)", "wyczekiwanie: 30 dni (obowiązkowe) / 90 dni (dobrowolne)", "powyżej 20 osób – wypłaca pracodawca"] },
      { label: "Świadczenie rehabilitacyjne", items: ["do 12 miesięcy", "90% przez 90 dni, potem 75%; 100% w ciąży", "po wyczerpaniu zasiłku, gdy jest szansa na powrót do pracy"] },
      { label: "Zasiłek macierzyński", items: ["20 tyg. po 100%, 32 tyg. po 70% + 9 tyg. dla drugiego rodzica", "łącznie do 61 tyg., jedno z rodziców max 52", "wariant 81,5% przez 52 tyg.", "ojcowski: do 2 tyg., 100%"] },
      { label: "Zasiłek opiekuńczy", items: ["80% pensji", "60 dni: dziecko do 8 l. (zdrowe) / do 14 l. (chore)", "30 dni: dziecko z niepełnosprawnością 8–18 / 14–18 lat", "14 dni: inny chory członek rodziny"] },
      { label: "Wypadkowe", items: ["zawsze 100% pensji", "bez względu na staż", "jednorazowe odszkodowanie, renta wypadkowa", "zwrot kosztów wyrobów medycznych, szczepień, stomatologii"] },
    ],
  },
  {
    id: "mm-l3-emerytura",
    lesson: "l3",
    center: "Emerytura",
    branches: [
      { label: "Wiek emerytalny", items: ["60 lat – kobiety", "65 lat – mężczyźni", "prawo, nie obowiązek"] },
      { label: "Z jakiego ubezpieczenia", items: ["z ubezpieczenia emerytalnego (FUS)", "wniosek – lub automatycznie, gdy pobierasz rentę z niezdolności"] },
      { label: "Solidarność międzypokoleniowa", items: ["dzisiejsze składki → emerytury obecnych emerytów", "własne składki zapisywane na koncie – decydują o przyszłej emeryturze"] },
      { label: "Od czego zależy wysokość", items: ["zwaloryzowane składki na koncie", "zwaloryzowany kapitał początkowy (przed 1999 r.)", "subkonto", "średnie dalsze trwanie życia (GUS)"] },
      { label: "Staż i okresy", items: ["składkowe (praca, zlecenie, działalność)", "nieskładkowe – max 1/3 składkowych", "20 lat (K) / 25 lat (M) – gwarancja najniższej emerytury"] },
      { label: "Dłuższa praca", items: ["więcej składek", "krótsze średnie dalsze trwanie życia", "emeryt może pracować – ZUS nie zmniejsza emerytury"] },
    ],
  },
  {
    id: "mm-l3-renta",
    lesson: "l3",
    center: "Renta z tytułu niezdolności do pracy",
    branches: [
      { label: "Warunki przyznania", items: ["orzeczenie o niezdolności do pracy", "okresy składkowe i nieskładkowe", "niezdolność powstała w okresie z przepisów", "brak prawa do emerytury z FUS"] },
      { label: "Kto stwierdza niezdolność", items: ["lekarz orzecznik ZUS", "komisja lekarska ZUS (II instancja) – sprzeciw w 14 dni", "od 1.01.2027 sprzeciw rozpatrzy inny lekarz orzecznik"] },
      { label: "Co wydaje", items: ["orzeczenie, na jego podstawie – decyzję ZUS", "od decyzji – odwołanie do sądu okręgowego"] },
      { label: "Na jak długo", items: ["maksymalnie 5 lat", "dłużej – gdy nie można oczekiwać powrotu do pracy w tym czasie"] },
      { label: "Rodzaje niezdolności", items: ["całkowita – jakakolwiek praca", "częściowa – praca zgodna z kwalifikacjami", "niezdolność do samodzielnej egzystencji"] },
      { label: "Inne renty", items: ["rodzinna i wdowia", "socjalna (finansuje państwo) + dodatek dopełniający", "wypadkowa"] },
    ],
  },
  {
    id: "mm-l4-ulgi",
    lesson: "l4",
    center: "Ulgi dla przedsiębiorców",
    branches: [
      { label: "Ulga na start", items: ["maks. 6 miesięcy", "brak składek społecznych (tylko zdrowotna)", "brak świadczeń z ubezpieczeń społecznych", "pierwszy raz lub po 60 miesiącach przerwy"] },
      { label: "Składki preferencyjne", items: ["maks. 24 miesiące", "podstawa ≥ 30% minimalnego (2026: 1441,80 zł)", "ZUS liczy świadczenia od kwoty składek", "nie dla wykonujących to samo dla byłego pracodawcy"] },
      { label: "Mały ZUS plus", items: ["36 miesięcy w każdym okresie 60 miesięcy", "przychód ≤ 120 tys. zł; min. 60 dni działalności", "podstawa zależna od dochodu: 1441,80–5652 zł", "nie obejmuje składki zdrowotnej"] },
      { label: "Wakacje składkowe", items: ["1 miesiąc w roku", "wniosek RWS przez eZUS miesiąc wcześniej", "≤ 10 ubezpieczonych, przychód ≤ 2 mln euro", "pomoc de minimis; nie obejmuje zdrowotnej"] },
      { label: "Skutki ulg", items: ["niższe składki = niższe świadczenia", "wpływ na przyszłą emeryturę/rentę", "składka zdrowotna zawsze płatna"] },
    ],
  },
  {
    id: "mm-l4-rozliczenia",
    lesson: "l4",
    center: "Przedsiębiorca i ZUS",
    branches: [
      { label: "Rejestracja", items: ["CEIDG-1 – gmina, US, GUS, ZUS", "nieewidencjonowana: brak ubezpieczeń"] },
      { label: "Zgłoszenia", items: ["ZUA/ZZA – siebie i zatrudnionych", "ZCNA – rodzina do zdrowotnego", "pracownika zgłoś w 7 dni"] },
      { label: "Ubezpieczenia", items: ["obowiązkowe: emerytalne, rentowe, wypadkowe, zdrowotne", "dobrowolne: chorobowe", "podstawa ≥ 60% prognozowanego przeciętnego (5652 zł)"] },
      { label: "Dokumenty", items: ["DRA – deklaracja", "RCA, RPA, RSA – raporty imienne", "tylko za siebie = tylko DRA"] },
      { label: "Terminy", items: ["do 15. – osoby prawne", "do 20. – osoby fizyczne, spółki osobowe, zatrudniający", "dzień wolny → najbliższy dzień roboczy po"] },
      { label: "Narzędzia", items: ["Płatnik (bez limitu), ePłatnik (do 100 osób)", ">5 osób – obowiązkowo elektronicznie", "NRS – jeden przelew"] },
      { label: "Wsparcie ZUS", items: ["odroczenie, raty, umorzenie", "dofinansowanie BHP: do 80%, 15–350 tys. zł"] },
    ],
  },
  {
    id: "mm-d1-dodatkowe",
    lesson: "d1",
    center: "Materiały dodatkowe 2025/26",
    branches: [
      { label: "Renta socjalna", items: ["dodatek dopełniający 2704,71 zł", "wniosek EDD-SOC + OL-9", "z rentą rodzinną łącznie do 300% najniższej renty (5935,47 zł)"] },
      { label: "Wakacje składkowe", items: ["RWS przez eZUS miesiąc wcześniej", "≤ 10 ubezpieczonych", "kody RCA: 05 14 / 05 74 / 05 94", "decyzja – odwołanie w miesiąc"] },
      { label: "Świadczenie honorowe", items: ["100 lat, obywatelstwo polskie", "6938,92 zł", "z urzędu lub na wniosek (10 lat w Polsce po 16. r.ż.)"] },
      { label: "Zbieg z rentą rodzinną", items: ["100% + 15% (od 2027 – 25%)", "warunki: 60/65 lat, brak ponownego małżeństwa", "limit 3× najniższa emerytura"] },
      { label: "Zasiłek pogrzebowy", items: ["7000 zł od 2026 r.", "wniosek Z-12 w 12 miesięcy", "bez nagrobka i konsolacji"] },
      { label: "Staż i utrata ciąży", items: ["USP / US-7 / POG", "zaświadczenie położnika-ginekologa lub położnej", "zasiłek macierzyński 8 tygodni po martwym urodzeniu"] },
      { label: "eZUS i mZUS", items: ["konto płatnika w nowej wersji", "aplikacja mobilna dla płatnika"] },
    ],
  },
  {
    id: "mm-d2-skladki",
    lesson: "d2",
    center: "Składki przedsiębiorców 2026",
    branches: [
      { label: "Kwoty bazowe", items: ["przeciętne (prognoza) 9420 zł", "60% = 5652 zł", "minimalne 4806 zł", "30% = 1441,80 zł"] },
      { label: "Zasady ogólne", items: ["emerytalna 1103,27 zł", "rentowa 452,16 zł", "wypadkowa 94,39 zł", "chorobowa 138,47 zł", "razem z FP/FS 1926,76 zł"] },
      { label: "Zasady preferencyjne", items: ["emerytalna 281,44 zł", "rentowa 115,34 zł", "wypadkowa 24,08 zł", "chorobowa 35,32 zł", "razem 456,18 zł (bez FP/FS)"] },
      { label: "Zdrowotna", items: ["9% skala / 4,9% liniowy", "minimum 432,54 zł", "ryczałt: 498,35 / 830,58 / 1495,04 zł", "osoby współpracujące 622,93 zł"] },
      { label: "Ulgi", items: ["nierejestrowa: do 10 813,50 zł/kwartał", "ulga na start 6 mies.", "preferencyjne 24 mies.", "mały ZUS plus 36 z 60", "wakacje 1 mies. w roku"] },
    ],
  },
];
