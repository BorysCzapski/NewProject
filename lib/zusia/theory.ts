// ============================================================================
// lib/zusia/theory.ts
// Lessons and theory sections. Lessons 1-4 follow the "Lekcje z ZUS
// 2026/2027" student book (photographed pages); "Materiały dodatkowe" and
// "Składki przedsiębiorców 2026" come from the two olympiad PDFs. Amounts are
// the 2026 values quoted there.
// ============================================================================
import type { Lesson, LessonId, TheorySection } from "./types";

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    short: "Lekcja 1",
    title: "Świadomy zawsze ubezpieczony",
    subtitle: "Cel ubezpieczeń, historia, zadania ZUS, FUS",
    source: "Podręcznik „Lekcje z ZUS 2026/2027”, s. 7–17",
  },
  {
    id: "l2",
    short: "Lekcja 2",
    title: "Co Ci się należy, kiedy płacisz składki",
    subtitle: "Rodzaje ubezpieczeń, składki, zasiłki chorobowe i wypadkowe",
    source: "Podręcznik „Lekcje z ZUS 2026/2027”, s. 19–35",
  },
  {
    id: "l3",
    short: "Lekcja 3",
    title: "Renty i emerytury",
    subtitle: "Niezdolność do pracy, renty, emerytura, waloryzacja",
    source: "Podręcznik „Lekcje z ZUS 2026/2027”, s. 37–54",
  },
  {
    id: "l4",
    short: "Lekcja 4",
    title: "ABC przedsiębiorcy",
    subtitle: "Rejestracja firmy, zgłoszenia, ulgi w składkach, rozliczenia",
    source: "Podręcznik „Lekcje z ZUS 2026/2027”, s. 55–71",
  },
  {
    id: "d1",
    short: "Dodatkowe",
    title: "Materiały dodatkowe 2025/2026",
    subtitle: "Renta socjalna, wakacje składkowe, mały ZUS plus, zasiłek pogrzebowy…",
    source: "PDF „Olimpiada 2026 – Materiał dodatkowy”",
  },
  {
    id: "d2",
    short: "Składki 2026",
    title: "Składki przedsiębiorców w 2026 r.",
    subtitle: "Kwoty, podstawy wymiaru, składka zdrowotna",
    source: "PDF „Składki przedsiębiorców w 2026 roku” (Analiza Wydziału Planowania Funduszy, luty 2026)",
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export const THEORY: TheorySection[] = [
  // ==========================================================================
  // LEKCJA 1
  // ==========================================================================
  {
    id: "l1-cel",
    lesson: "l1",
    title: "Cel ubezpieczeń społecznych",
    blocks: [
      {
        type: "p",
        text: "Ubezpieczenia społeczne zapewniają **pieniądze na pokrycie podstawowych potrzeb**, gdy nie będziesz mógł pracować – np. z powodu choroby, macierzyństwa, wypadku przy pracy – albo gdy osiągniesz wiek emerytalny.",
      },
      {
        type: "p",
        text: "ZUS wypłaca świadczenia **przez określony czas** (np. zasiłek chorobowy, macierzyński) albo **do końca życia** (np. emerytura).",
      },
      {
        type: "important",
        text: "Ubezpieczenia społeczne są **powszechne**, bo większość pracujących płaci składki, choć nie wie, czy i kiedy skorzysta z zebranego kapitału. Dzięki temu składki są niższe, a osoby ubezpieczone mają gwarancję wypłaty świadczeń.",
      },
      {
        type: "p",
        text: "Społeczeństwo to wspólnota: wszyscy są narażeni na przewidywalne zagrożenia (ryzyka) – chorobę, wypadek, starość – więc podejmują wspólne działania, by zapobiegać ich skutkom lub je łagodzić. Dlatego płacimy składki, a w zamian zyskujemy prawo do świadczeń.",
      },
    ],
  },
  {
    id: "l1-historia",
    lesson: "l1",
    title: "Historia ubezpieczeń",
    blocks: [
      {
        type: "list",
        items: [
          "Pomysł obowiązkowych ubezpieczeń społecznych powstał w **Niemczech pod koniec XIX wieku**. Wprowadził je **kanclerz II Rzeszy Otto von Bismarck**.",
          "Wiele państw, w tym Polska, uznało rozwiązania niemieckie za warte naśladowania.",
          "Po odzyskaniu niepodległości Polska zaczęła budować własny system. **Zakład Ubezpieczeń Społecznych** powołał prezydent **Ignacy Mościcki** rozporządzeniem z **24 października 1934 r.**",
          "ZUS wypłacał świadczenia nawet w czasie okupacji, w PRL i podczas przemian ustrojowych – działał nieprzerwanie.",
        ],
      },
      {
        type: "important",
        title: "Podstawa prawna dziś",
        text: "ZUS działa na podstawie ustawy z **13 października 1998 r.** o systemie ubezpieczeń społecznych.",
      },
    ],
  },
  {
    id: "l1-zus",
    lesson: "l1",
    title: "ZUS – czym jest i co robi",
    blocks: [
      { type: "p", text: "Każdy człon nazwy ma znaczenie:" },
      {
        type: "table",
        head: ["Człon", "Znaczenie"],
        rows: [
          ["**Zakład**", "instytucja państwowa działająca na podstawie prawa; jej decyzje oceniają sądy"],
          ["**Ubezpieczeń**", "pełni funkcje ubezpieczeniowe – pokrywa potrzeby finansowe (na zasadach z przepisów), by chronić osoby ubezpieczone od skutków różnych sytuacji życiowych"],
          ["**Społecznych**", "świadczy usługi powszechnie osobom objętym ubezpieczeniami społecznymi"],
        ],
      },
      {
        type: "important",
        title: "ZUS nie tworzy prawa",
        text: "To **parlament** określa wysokość składek oraz zasady przyznawania i obliczania świadczeń. ZUS musi składki zbierać i zapisywać na kontach oraz prawidłowo obliczać i wypłacać świadczenia – ale nie ustala ich wysokości.",
      },
    ],
  },
  {
    id: "l1-zadania",
    lesson: "l1",
    title: "Najważniejsze zadania ZUS",
    blocks: [
      {
        type: "p",
        text: "**Wobec ubezpieczonych:**",
      },
      {
        type: "list",
        items: [
          "prowadzi indywidualne konta ubezpieczonych,",
          "pobiera od płatników składki na ubezpieczenia społeczne i zapisuje informacje o nich na kontach,",
          "wydaje decyzje dotyczące podlegania ubezpieczeniom i prawa do świadczeń,",
          "pobiera składki na ubezpieczenie zdrowotne i przekazuje je do Narodowego Funduszu Zdrowia (NFZ).",
        ],
      },
      { type: "p", text: "**Wobec świadczeniobiorców:**" },
      {
        type: "list",
        items: [
          "przyznaje i wypłaca świadczenia **długoterminowe** (emerytury, renty),",
          "przyznaje i wypłaca świadczenia **krótkoterminowe** (zasiłki chorobowe, macierzyńskie, opiekuńcze),",
          "kieruje na rehabilitację leczniczą.",
        ],
      },
      { type: "p", text: "**Wobec płatników składek:**" },
      {
        type: "list",
        items: [
          "prowadzi konta płatników składek i rozliczenia z nimi,",
          "na wniosek dłużnika może odroczyć termin płatności składek lub rozłożyć dług na raty,",
          "dofinansowuje projekty poprawiające bezpieczeństwo i warunki pracy.",
        ],
      },
    ],
  },
  {
    id: "l1-skladka-swiadczenie",
    lesson: "l1",
    title: "Od składki po świadczenie",
    blocks: [
      {
        type: "p",
        text: "Ze świadczeń korzysta ten, **za kogo są opłacane składki** i kto spełnił określone warunki. Składki są po to, by otrzymać świadczenie w sytuacji, którą obejmuje ubezpieczenie.",
      },
      {
        type: "important",
        text: "Ubezpieczeniom podlega się **z mocy samej ustawy**. Jeśli pracodawca nie zgłosi pracownika do ZUS i nie opłaci składek, pracownik i tak może zwrócić się do ZUS – zaniechanie innej osoby nie może pozbawiać ubezpieczonego jego praw. Ubezpieczenia chronią tych, którzy utrzymują się z własnej pracy.",
      },
    ],
  },
  {
    id: "l1-ryzyko",
    lesson: "l1",
    title: "Ryzyko ubezpieczeniowe",
    blocks: [
      {
        type: "p",
        text: "Cechą ubezpieczeń jest **przewidywalność zdarzeń**. Choroba, wypadek (niezdolność do pracy), starość czy macierzyństwo to przewidywalne zdarzenia, które eksperci nazywają **ryzykiem ubezpieczeniowym** – potrafią określić prawdopodobieństwo jego wystąpienia.",
      },
      {
        type: "p",
        text: "Aby zminimalizować ryzyko niezdolności do pracy, wypadku przy pracy lub choroby zawodowej, ZUS prowadzi **prewencję rentową i wypadkową**. Ma ona pomóc uniknąć trwałej utraty zdolności do pracy i utrzymać ją przez cały okres aktywności zawodowej.",
      },
      {
        type: "important",
        text: "Gdy ubezpieczysz się na wypadek danego ryzyka, zyskujesz prawo do świadczenia, jeśli ryzyko się spełni. Jeżeli przestaniesz spełniać wszystkie warunki (np. przez przerwę w opłacaniu składek), świadczenia nie otrzymasz.",
      },
    ],
  },
  {
    id: "l1-uczestnicy",
    lesson: "l1",
    title: "Uczestnicy systemu ubezpieczeń",
    blocks: [
      {
        type: "table",
        head: ["Uczestnik", "Kto to", "Skala"],
        rows: [
          ["**Ubezpieczeni**", "pracownicy, zleceniobiorcy…", "ponad 16 mln"],
          ["**Świadczeniobiorcy**", "emeryci, renciści, osoby pobierające zasiłki", "ok. 10 mln emerytów i rencistów"],
          ["**Płatnicy składek**", "pracodawcy, zleceniodawcy, osoby prowadzące działalność", "ok. 3 mln"],
        ],
      },
      {
        type: "p",
        text: "Z usług ZUS korzysta ponad **26 mln klientów** – prawie każdy obywatel zetknie się z tą instytucją w ciągu życia.",
      },
    ],
  },
  {
    id: "l1-fus",
    lesson: "l1",
    title: "ZUS ≠ FUS",
    blocks: [
      {
        type: "p",
        text: "Świadczenia dzielą się na **cztery grupy**: emerytalne, rentowe, chorobowe, wypadkowe. Dlatego są cztery składki społeczne: **emerytalna, rentowa, chorobowa, wypadkowa**.",
      },
      {
        type: "p",
        text: "Składki wpływają do **Funduszu Ubezpieczeń Społecznych (FUS)**. Z FUS finansowane są emerytury, renty i zasiłki. **Funduszem zarządza ZUS** – ale nie prowadzi własnej polityki finansowej i nie ustala stóp składek ani zasad obliczania świadczeń (decyduje o tym parlament w ustawach).",
      },
      {
        type: "important",
        title: "Składka zdrowotna",
        text: "ZUS pobiera też składki na ubezpieczenie zdrowotne, ale **ich nie gromadzi** – przekazuje je od razu do **NFZ** wraz z informacją, kogo dotyczą.",
      },
      {
        type: "example",
        title: "Wydatki FUS (czy wiesz, że…)",
        text: "Planowane wydatki budżetu państwa w 2026 r. to 918,9 mld zł, a planowane wydatki FUS – 500,7 mld zł. FUS wydaje więc ok. **54,4%** tego, co budżet państwa.",
      },
      {
        type: "p",
        text: "Gdy w FUS zabraknie pieniędzy, uzupełniają je **dotacje z budżetu państwa**; istnieje też **Fundusz Rezerwy Demograficznej**. Konstytucja gwarantuje każdemu obywatelowi prawo do zabezpieczenia społecznego – państwo gwarantuje wypłaty.",
      },
    ],
  },
  {
    id: "l1-pomoc",
    lesson: "l1",
    title: "Pomoc społeczna, ubezpieczenie, zaopatrzenie",
    blocks: [
      {
        type: "table",
        head: ["Pojęcie", "Zasada", "Przykłady"],
        rows: [
          [
            "**Ubezpieczenie społeczne**",
            "prawo do świadczeń **w zamian za opłacane składki**",
            "zasiłek chorobowy, macierzyński, emerytura",
          ],
          [
            "**Pomoc społeczna**",
            "wspiera w trudnych sytuacjach życiowych, których ktoś nie pokona samodzielnie; ma doprowadzić do usamodzielnienia",
            "ubóstwo, bezdomność, bezrobocie, przemoc w rodzinie, klęski żywiołowe",
          ],
          [
            "**Zaopatrzenie społeczne**",
            "podobne do ubezpieczenia, ale **bez płacenia składek**",
            "emerytury policyjne, świadczenie wychowawcze 800+",
          ],
        ],
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 2
  // ==========================================================================
  {
    id: "l2-system",
    lesson: "l2",
    title: "System ubezpieczeń społecznych",
    blocks: [
      {
        type: "table",
        head: ["Ryzyko", "Ubezpieczenie"],
        rows: [
          ["starość", "**emerytalne**"],
          ["niezdolność do pracy", "**rentowe**"],
          ["wypadek przy pracy (choroba zawodowa)", "**wypadkowe**"],
          ["macierzyństwo i choroba", "**chorobowe**"],
        ],
      },
      {
        type: "p",
        text: "Najważniejsze świadczenia w ciągu życia: **zasiłek macierzyński, zasiłek opiekuńczy, zasiłek chorobowy, świadczenie rehabilitacyjne, rehabilitacja lecznicza, renta z tytułu niezdolności do pracy**.",
      },
    ],
  },
  {
    id: "l2-praca",
    lesson: "l2",
    title: "Praca zarobkowa a ubezpieczenia",
    blocks: [
      {
        type: "p",
        text: "Ubezpieczenia są **obowiązkowe**, **dobrowolne** albo nie obejmują Cię w ogóle – zależnie od tego, na jakiej podstawie pracujesz (zasady dotyczą sytuacji, gdy umowa lub działalność jest jedynym źródłem zarobków).",
      },
      {
        type: "table",
        head: ["Ubezpieczenie", "Umowa o dzieło", "Zlecenie z uczniem/studentem (do 26 lat)", "Umowa zlecenia", "Umowa o pracę", "Działalność gospodarcza"],
        rows: [
          ["Emerytalne", "brak", "brak", "obowiązkowe", "obowiązkowe", "obowiązkowe"],
          ["Rentowe", "brak", "brak", "obowiązkowe", "obowiązkowe", "obowiązkowe"],
          ["Chorobowe", "brak", "brak", "**dobrowolne**", "obowiązkowe", "**dobrowolne**"],
          ["Wypadkowe", "brak", "brak", "obowiązkowe", "obowiązkowe", "obowiązkowe"],
          ["Zdrowotne", "brak", "brak", "obowiązkowe", "obowiązkowe", "obowiązkowe"],
        ],
      },
      {
        type: "important",
        text: "Chorobowe jest **obowiązkowe tylko przy umowie o pracę**. Przy zleceniu i działalności jest dobrowolne (przystępuje się na wniosek). Umowa o dzieło i zlecenie ucznia/studenta do 26. roku życia nie dają żadnych z tych ubezpieczeń.",
      },
    ],
  },
  {
    id: "l2-stopy",
    lesson: "l2",
    title: "Stopy składek i kto je finansuje",
    blocks: [
      {
        type: "table",
        head: ["Ubezpieczenie", "Stopa", "Z kieszeni pracodawcy / zleceniodawcy", "Z kieszeni pracownika / zleceniobiorcy"],
        rows: [
          ["Emerytalne", "19,52%", "9,76%", "9,76%"],
          ["Rentowe", "8%", "6,5%", "1,5%"],
          ["Chorobowe", "2,45%", "–", "w całości"],
          ["Wypadkowe", "zróżnicowana (np. 1,67%)", "w całości", "–"],
          ["Zdrowotne", "9% (4,9% dla liniowego PIT)", "–", "w całości"],
        ],
      },
      {
        type: "important",
        text: "Osoba prowadząca **działalność gospodarczą finansuje wszystkie składki w całości z własnych środków**. Zdrowotna to 9% albo 4,9% dla przedsiębiorców opodatkowanych wyłącznie podatkiem liniowym.",
      },
    ],
  },
  {
    id: "l2-chorobowy",
    lesson: "l2",
    title: "Zasiłek chorobowy",
    blocks: [
      {
        type: "p",
        text: "Zasiłek chorobowy dostajesz **zamiast pensji**, gdy chorujesz i masz zwolnienie lekarskie. Warunki: jesteś niezdolny do pracy z powodu choroby (zwolnienie), masz **wymagany okres ubezpieczenia chorobowego** i nie zalegasz ze składkami (albo zadłużenie nie przekracza 1% minimalnego wynagrodzenia – dotyczy m.in. przedsiębiorców).",
      },
      {
        type: "table",
        head: ["Maksymalny okres wypłaty", "Kiedy"],
        rows: [
          ["**182 dni**", "zasada"],
          ["**270 dni**", "niezdolność w czasie ciąży albo spowodowana gruźlicą"],
          ["**91 dni**", "niezdolność powstała lub trwa po ustaniu tytułu ubezpieczenia chorobowego (nie dłużej niż do wyczerpania 182 dni)"],
        ],
      },
      {
        type: "table",
        head: ["Wysokość zasiłku", "Kiedy"],
        rows: [
          ["**80%** pensji", "zasada (średnia z 12 miesięcy lub z okresu krótszego)"],
          ["**100%** pensji", "m.in. wypadek w drodze do/z pracy albo niezdolność w czasie ciąży"],
        ],
      },
      {
        type: "important",
        title: "Kto wypłaca?",
        text: "Jeśli pracodawca zgłasza do ubezpieczenia chorobowego **powyżej 20 osób**, sam wypłaca zasiłki i rozlicza się z ZUS. W pozostałych przypadkach zasiłki wypłaca **ZUS**.",
      },
    ],
  },
  {
    id: "l2-wyczekiwanie",
    lesson: "l2",
    title: "Okres wyczekiwania i podstawa zasiłku",
    blocks: [
      {
        type: "table",
        head: ["Rodzaj ubezpieczenia chorobowego", "Okres wyczekiwania"],
        rows: [
          ["**obowiązkowe** (np. umowa o pracę)", "**30 dni** nieprzerwanego ubezpieczenia"],
          ["**dobrowolne** (np. działalność gospodarcza)", "**90 dni** nieprzerwanego ubezpieczenia"],
        ],
      },
      {
        type: "p",
        text: "Do okresu wyczekiwania wlicza się **poprzednie okresy** ubezpieczenia chorobowego (obowiązkowego i dobrowolnego), jeśli przerwa nie przekroczyła **30 dni** albo była spowodowana urlopem wychowawczym, urlopem bezpłatnym lub czynną służbą wojskową żołnierza niezawodowego. Zalicza się też okres ubezpieczenia społecznego rolników.",
      },
      {
        type: "example",
        title: "Przykład 1 – Tomasz",
        text: "Umowa zlecenia od 1 lutego, 17 lutego zwolnienie lekarskie. Wcześniej pół roku umowy o pracę (do 15 stycznia). Łączny okres ubezpieczenia chorobowego > 90 dni, przerwa ≤ 30 dni – ma prawo do zasiłku od pierwszego dnia niezdolności.",
      },
      {
        type: "important",
        title: "Zasiłek bez okresu wyczekiwania",
        text: "Można go dostać m.in. gdy: jesteś **absolwentem** szkoły/uczelni i w ciągu **90 dni** od jej ukończenia zostałeś objęty ubezpieczeniem chorobowym; niezdolność wynika z **wypadku w drodze do lub z pracy** albo przy pracy; jesteś ubezpieczony obowiązkowo i wcześniej miałeś **co najmniej 10 lat** obowiązkowego ubezpieczenia chorobowego.",
      },
      {
        type: "example",
        title: "Przykład 2 – Karol",
        text: "Skończył szkołę w czerwcu, od 1 września pracuje na zleceniu (z chorobowym na wniosek). Po dwóch tygodniach choruje – przysługuje mu zasiłek, bo absolwent objęty chorobowym w ciągu 90 dni nie ma okresu wyczekiwania.",
      },
      {
        type: "p",
        text: "**Podstawa wymiaru zasiłku** to kwota, od której liczono składki na ubezpieczenie chorobowe (lub wypadkowe przy wypadku przy pracy) w ciągu **12 kalendarzowych miesięcy** poprzedzających niezdolność. Gdy ubezpieczenie trwa krócej niż 12 miesięcy – bierze się pełne miesiące kalendarzowe ubezpieczenia (np. Marcin zatrudniony od 10 kwietnia, chory od 15 lipca → podstawa z maja i czerwca).",
      },
    ],
  },
  {
    id: "l2-rehabilitacyjne",
    lesson: "l2",
    title: "Świadczenie rehabilitacyjne",
    blocks: [
      {
        type: "p",
        text: "Przysługuje, jeśli: wykorzystałeś zasiłek chorobowy przez maksymalny okres, a nadal jesteś niezdolny do pracy; możliwe, że **odzyskasz zdolność do pracy** po dalszym leczeniu lub rehabilitacji; nie masz prawa do innego świadczenia (emerytura, renta z tytułu niezdolności, zasiłek dla bezrobotnych).",
      },
      {
        type: "list",
        items: [
          "Lekarz orzecznik ZUS musi wydać orzeczenie o niezdolności do pracy na okres **nie dłuższy niż 12 miesięcy**.",
          "Pobierasz je **maksymalnie 12 miesięcy**.",
          "Wysokość: **90%** pensji przez pierwsze 90 dni, potem **75%**; **100%** gdy niezdolność przypada w czasie ciąży.",
          "Jeśli lekarz uzna Cię za zdolnego do pracy, możesz wnieść **sprzeciw** wobec orzeczenia.",
        ],
      },
    ],
  },
  {
    id: "l2-macierzynski",
    lesson: "l2",
    title: "Zasiłek macierzyński",
    blocks: [
      {
        type: "p",
        text: "Otrzymasz go, jeśli **urodzisz dziecko albo przyjmiesz dziecko na wychowanie**. Okres wypłaty zależy od liczby dzieci urodzonych podczas jednego porodu. Skorzystać może też **ubezpieczony ojciec**. Rodzice mogą pobierać zasiłek łącznie nawet **61 tygodni**, ale jedno z nich nie dłużej niż **52 tygodnie**.",
      },
      {
        type: "table",
        head: ["Przy jednym dziecku", "Wysokość"],
        rows: [
          ["pierwsze **20 tygodni**", "**100%** pensji"],
          ["kolejne **32 tygodnie** oraz **9 tygodni** zarezerwowanych dla drugiego rodzica", "**70%** pensji"],
          ["wariant: stała stawka przez 52 tygodnie", "**81,5%** pensji (drugi rodzic z 9 tygodni dostaje 70%)"],
        ],
      },
      {
        type: "p",
        text: "**Za urlop ojcowski:** do **2 tygodni**, nie dłużej niż do ukończenia przez dziecko **12. miesiąca** życia; jednorazowo albo w maksymalnie 2 częściach (żadna krótsza niż tydzień); **100%** pensji.",
      },
      {
        type: "p",
        text: "**Uzupełniający urlop macierzyński** (bezpośrednio po macierzyńskim) – gdy dziecko jest w szpitalu: do tygodnia urlopu za każdy tydzień pobytu dziecka w szpitalu, w limitach zależnych od wcześniactwa (przed ukończeniem 28. tygodnia ciąży lub waga ≤ 1000 g – do upływu 15. tygodnia po porodzie; 28.–37. tydzień ciąży – do upływu 8. tygodnia po porodzie; po 37. tygodniu i co najmniej 2 dni w szpitalu między 5. a 28. dniem – w okresie od 5. dnia do upływu 8. tygodnia).",
      },
    ],
  },
  {
    id: "l2-opiekunczy",
    lesson: "l2",
    title: "Zasiłek opiekuńczy",
    blocks: [
      {
        type: "table",
        head: ["Opieka nad…", "Limit w roku kalendarzowym"],
        rows: [
          ["zdrowym dzieckiem do **8 lat** w sytuacjach z przepisów albo chorym dzieckiem do **14 lat** (także z niepełnosprawnością)", "**60 dni**"],
          ["dzieckiem z niepełnosprawnością **8–18 lat** w związku z porodem, chorobą lub pobytem w szpitalu małżonka/rodzica, który stale się nim opiekuje", "**30 dni**"],
          ["chorym dzieckiem z niepełnosprawnością **14–18 lat**", "**30 dni**"],
          ["chorym dzieckiem powyżej 14 lat lub innym chorym członkiem rodziny (małżonek, rodzic) mieszkającym z Tobą", "**14 dni**"],
        ],
      },
      {
        type: "important",
        text: "Zasiłek opiekuńczy wynosi **80%** pensji. Łączny okres pobierania w roku kalendarzowym **nie może przekroczyć 60 dni**.",
      },
    ],
  },
  {
    id: "l2-wypadkowe",
    lesson: "l2",
    title: "Świadczenia z ubezpieczenia wypadkowego",
    blocks: [
      {
        type: "p",
        text: "Przysługują, gdy jesteś niezdolny do pracy z powodu **wypadku przy pracy lub choroby zawodowej**: zasiłek chorobowy, świadczenie rehabilitacyjne, **renta wypadkowa**, **jednorazowe odszkodowanie**, zwrot kosztów wyrobów medycznych, świadczeń stomatologicznych i szczepień ochronnych.",
      },
      {
        type: "list",
        items: [
          "Renty i zasiłki wypadkowe są **korzystniejsze** niż z ubezpieczenia chorobowego i rentowego.",
          "Przysługują **niezależnie od stażu** – nawet jeśli do wypadku doszło pierwszego dnia pracy.",
          "Zasiłek chorobowy i świadczenie rehabilitacyjne z ubezpieczenia wypadkowego wynoszą zawsze **100%** pensji.",
        ],
      },
      {
        type: "important",
        title: "Jednorazowe odszkodowanie",
        text: "Tylko z ubezpieczenia wypadkowego – **20% przeciętnego wynagrodzenia za każdy procent** stałego lub długotrwałego uszczerbku na zdrowiu.",
      },
      {
        type: "example",
        title: "Przykład 3 – Piotr",
        text: "Pierwszego dnia pracy uległ wypadkowi w drodze z pracy; był niezdolny ponad 2 miesiące. Za pierwsze 33 dni dostał wynagrodzenie za czas choroby (od pracodawcy), potem – mimo krótkiego ubezpieczenia – zasiłek chorobowy.",
      },
    ],
  },
  {
    id: "l2-start-ulga",
    lesson: "l2",
    title: "Brak ubezpieczenia = brak świadczeń",
    blocks: [
      {
        type: "p",
        text: "Gdy w czasie, w którym nie jesteś objęty ubezpieczeniem (np. korzystasz z ulgi na start), zachorujesz, zajmiesz się dzieckiem lub urodzisz dziecko, **nie dostaniesz** zasiłku chorobowego, świadczenia rehabilitacyjnego, macierzyńskiego ani opiekuńczego. Dotyczy to też świadczeń z ubezpieczenia wypadkowego (wypadek przy pracy, choroba zawodowa).",
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 3
  // ==========================================================================
  {
    id: "l3-niezdolnosc",
    lesson: "l3",
    title: "Niezdolność do pracy",
    blocks: [
      {
        type: "p",
        text: "Osoba niezdolna do pracy utraciła **zdolność do pracy zarobkowej z powodu naruszenia sprawności organizmu**.",
      },
      {
        type: "table",
        head: ["Rodzaj", "Znaczenie"],
        rows: [
          ["**całkowita**", "utrata zdolności do wykonywania **jakiejkolwiek** pracy zarobkowej (takiej, dzięki której możesz się utrzymać)"],
          ["**częściowa**", "utrata zdolności do pracy **zgodnej z kwalifikacjami**, ale możesz wykonywać inną pracę albo dotychczasową krócej (np. pół etatu)"],
        ],
      },
      {
        type: "p",
        text: "Gdy lekarz orzeka całkowitą niezdolność do pracy, może też stwierdzić **niezdolność do samodzielnej egzystencji** – gdy naruszenie sprawności powoduje, że wymagasz stałej lub długotrwałej opieki i pomocy innej osoby w czynnościach życia codziennego.",
      },
    ],
  },
  {
    id: "l3-orzecznictwo",
    lesson: "l3",
    title: "Kto orzeka i jak się odwołać",
    blocks: [
      {
        type: "list",
        items: [
          "Niezdolność do pracy orzekają **lekarze orzecznicy ZUS** i **komisje lekarskie ZUS**.",
          "Jeśli się nie zgadzasz z orzeczeniem lekarza orzecznika, możesz wnieść **sprzeciw** do komisji lekarskiej (II instancji) w ciągu **14 dni** od otrzymania orzeczenia.",
          "**Od 1 stycznia 2027 r.** sprzeciw rozpatrzy inny lekarz orzecznik; sprawy szczególnie skomplikowane – trzech lekarzy orzeczników łącznie.",
          "Od decyzji ZUS wydanej na podstawie orzeczenia II instancji możesz **odwołać się do sądu okręgowego**; wtedy niezdolność ocenia biegły sądowy.",
          "Niezdolność orzeka się na **maksymalnie 5 lat**; dłużej – gdy według wiedzy medycznej nie ma szansy odzyskania zdolności do pracy w tym czasie.",
        ],
      },
    ],
  },
  {
    id: "l3-niepelnosprawnosc",
    lesson: "l3",
    title: "Niepełnosprawność ≠ niezdolność do pracy",
    blocks: [
      {
        type: "p",
        text: "Aby dostać rentę z tytułu niezdolności do pracy (od ZUS), trzeba mieć **orzeczenie o niezdolności do pracy**, a nie orzeczenie o niepełnosprawności. To **dwa odrębne systemy** orzecznictwa, prowadzone przez różne instytucje na podstawie innych przepisów i w innych celach.",
      },
      {
        type: "important",
        text: "Osoba z niepełnosprawnością może być uznana za **zdolną do pracy** i nie dostać renty. Renta rekompensuje **brak możliwości pracowania**, a nie problemy zdrowotne czy trudności w pełnieniu ról społecznych. (Przykład z podręcznika: prezydent USA Franklin D. Roosevelt poruszał się na wózku.)",
      },
      {
        type: "p",
        text: "Jeśli lekarze ustalą, że mimo choroby możesz wykonywać inną pracę, dostaniesz orzeczenie o **celowości przekwalifikowania zawodowego** (np. górnik z pylicą płuc może zostać sprzedawcą).",
      },
    ],
  },
  {
    id: "l3-renta",
    lesson: "l3",
    title: "Renta z tytułu niezdolności do pracy",
    blocks: [
      {
        type: "p",
        text: "Rentę dostaniesz, gdy otrzymasz **orzeczenie o niezdolności do pracy** od lekarza orzecznika ZUS oraz:",
      },
      {
        type: "list",
        items: [
          "stałeś się niezdolny do pracy **w trakcie okresu wymienionego w przepisach**,",
          "potwierdzisz **okresy składkowe i nieskładkowe** (ich liczba zależy od wieku, w którym stałeś się niezdolny),",
          "nie masz prawa do emerytury z FUS i nie spełniasz warunków, by ją uzyskać.",
        ],
      },
      {
        type: "important",
        text: "Przy rencie z tytułu niezdolności do pracy lub rencie socjalnej **możesz dorabiać**, jeśli praca nie jest sprzeczna z orzeczoną niezdolnością. Zależnie od zarobku (z działalności objętej obowiązkowymi ubezpieczeniami) renta może być **zmniejszona lub zawieszona**.",
      },
    ],
  },
  {
    id: "l3-rodzinna",
    lesson: "l3",
    title: "Renta rodzinna, renta wdowia, zasiłek pogrzebowy",
    blocks: [
      {
        type: "p",
        text: "**Renta rodzinna** przysługuje członkom rodziny osoby zmarłej, która w chwili śmierci: miała prawo do emerytury, emerytury pomostowej lub renty z tytułu niezdolności do pracy; mogłaby je otrzymać (spełniała warunki); pobierała zasiłek/świadczenie przedemerytalne lub nauczycielskie świadczenie kompensacyjne. To zabezpieczenie bliskich na wypadek śmierci osoby utrzymującej rodzinę.",
      },
      {
        type: "p",
        text: "**Renta wdowia** (renta rodzinna połączona z innym świadczeniem) – warunki łącznie: masz własne świadczenie długoterminowe, ukończyłeś **60 lat (kobieta) / 65 lat (mężczyzna)**, do śmierci małżonka byłeś z nim we wspólności małżeńskiej, prawo do renty rodzinnej nabyłeś **nie wcześniej niż w wieku 55 (K) / 60 (M)** lat i **nie jesteś w związku małżeńskim**.",
      },
      {
        type: "p",
        text: "**Zasiłek pogrzebowy** – dla osoby, która pokryła koszty pogrzebu osoby objętej ubezpieczeniem (ubezpieczonego, emeryta/rencisty, członka ich rodziny). **Członek rodziny** dostaje **7 tys. zł** niezależnie od poniesionych kosztów; **osoba spoza rodziny** – zwrot poniesionych kosztów, maksymalnie 7 tys. zł.",
      },
    ],
  },
  {
    id: "l3-socjalna",
    lesson: "l3",
    title: "Renta socjalna",
    blocks: [
      {
        type: "p",
        text: "Przysługuje po osiągnięciu **pełnoletności**, jeśli stałeś się **całkowicie niezdolny do pracy** z powodu naruszenia sprawności organizmu, które powstało: **przed ukończeniem 18 lat**, **w trakcie nauki w szkole lub szkole wyższej przed ukończeniem 25 lat** albo w trakcie studiów doktoranckich lub aspirantury naukowej.",
      },
      {
        type: "important",
        text: "Renta socjalna **nie jest świadczeniem z ubezpieczenia społecznego** – jest **finansowana przez państwo**. Do renty socjalnej przysługuje **dodatek dopełniający**, jeśli jesteś całkowicie niezdolny do pracy i do samodzielnej egzystencji.",
      },
    ],
  },
  {
    id: "l3-emerytura-solidarnosc",
    lesson: "l3",
    title: "Emerytura i solidarność międzypokoleniowa",
    blocks: [
      {
        type: "p",
        text: "Emerytura ma zabezpieczyć byt na starość, gdy z powodu wieku nie będziesz mógł lub chciał pracować. Składki płacone **dziś** przez osoby aktywne zawodowo ZUS przekazuje na wypłatę świadczeń **obecnym emerytom**, a jednocześnie **zapisuje je na kontach** płacących – ich suma zdecyduje o przyszłej emeryturze. To **umowa międzypokoleniowa**, czyli **solidaryzm społeczny**.",
      },
      {
        type: "p",
        text: "**Starzenie się społeczeństwa:** rodzi się coraz mniej dzieci, a ludzie żyją dłużej. Według prognozy GUS ludność Polski spadnie z 37,8 mln (2022) do ok. 30,9 mln (2060), a udział osób starszych rośnie.",
      },
    ],
  },
  {
    id: "l3-wiek-staz",
    lesson: "l3",
    title: "Wiek emerytalny i staż",
    blocks: [
      {
        type: "list",
        items: [
          "Wiek emerytalny w Polsce: **60 lat – kobiety, 65 lat – mężczyźni**. Emerytura to **prawo, nie obowiązek** – możesz o nią wystąpić od razu po osiągnięciu wieku.",
          "ZUS przyznaje emeryturę, gdy osiągniesz wiek i **złożysz wniosek**. Jeśli po osiągnięciu wieku emerytalnego pobierasz rentę z tytułu niezdolności do pracy, wniosku składać nie musisz – ZUS przyzna emeryturę automatycznie.",
          "Nie musisz mieć ściśle określonego stażu, by nabyć prawo do emerytury – wystarczy **jakikolwiek okres ubezpieczenia**.",
          "Pewność, że emerytura nie będzie niższa od **gwarantowanej najniższej kwoty emerytury**, mają kobiety z co najmniej **20 latami** i mężczyźni z co najmniej **25 latami** okresów składkowych i nieskładkowych.",
        ],
      },
      {
        type: "table",
        head: ["Okresy", "Co to"],
        rows: [
          ["**składkowe**", "związane z aktywnością zawodową: podlegania ubezpieczeniu emerytalnemu i rentowym (umowa o pracę, zlecenie, pobieranie zasiłku macierzyńskiego, działalność), czynna służba wojskowa w Wojsku Polskim"],
          ["**nieskładkowe**", "brak aktywności zawodowej, ale ustawodawca zalicza do stażu: nauka w szkole wyższej na jednym kierunku (jeśli ukończysz), pobieranie zasiłku chorobowego, świadczenia rehabilitacyjnego"],
        ],
      },
      {
        type: "important",
        text: "Okresy nieskładkowe zgłaszane do stażu **nie mogą przekraczać 1/3 okresów składkowych**.",
      },
      {
        type: "p",
        text: "Kalkulator emerytalny znajdziesz na eZUS, na zus.pl i w aplikacji mZUS; pomoże też doradca emerytalny w placówce, na e-wizycie lub przez CKK. Wiek emerytalny w innych krajach rośnie: m.in. 66–67 lat (Niemcy, Wielka Brytania), w Danii nawet 70 lat dla roczników od 1971.",
      },
    ],
  },
  {
    id: "l3-model",
    lesson: "l3",
    title: "Model systemu emerytalnego",
    blocks: [
      {
        type: "table",
        head: ["Model", "Jak liczona emerytura"],
        rows: [
          ["**zdefiniowanego świadczenia** (przed reformą 1999 r.; osoby urodzone przed 1949 r.)", "zależała od długości stażu i **najlepszych zarobków z 10 lub 20 lat**"],
          ["**zdefiniowanej składki** (od 1999 r., reforma emerytalna)", "wynik podzielenia składek zapisanych na koncie i subkoncie (waloryzowanych co roku) przez **średnie dalsze trwanie życia**"],
        ],
      },
      {
        type: "important",
        title: "Wzór",
        text: "**Emerytura = (zwaloryzowane składki emerytalne + zwaloryzowany kapitał początkowy + zwaloryzowane składki i środki na subkoncie) ÷ średnie dalsze trwanie życia (w miesiącach).** Tablice trwania życia ogłasza w komunikacie **prezes GUS**.",
      },
      {
        type: "p",
        text: "Wysokość emerytury zależy przede wszystkim od: **składek zapisanych na koncie** (ubezpieczonego w ZUS) i ich waloryzacji, **kapitału początkowego**, **średniego dalszego trwania życia** ustalonego dla wieku przejścia na emeryturę.",
      },
    ],
  },
  {
    id: "l3-waloryzacja",
    lesson: "l3",
    title: "Waloryzacja, kapitał początkowy, subkonto",
    blocks: [
      {
        type: "list",
        items: [
          "**Waloryzacja** to ochrona wartości składek na koncie i subkoncie w ZUS, kapitału początkowego oraz środków przekazanych przez OFE.",
          "**Kapitał początkowy** – środki zgromadzone na emeryturę **przed reformą (przed 1999 r.)**; wartość pracy sprzed 1999 r.",
          "**Subkonto** – wydzielona część konta prowadzonego przez ZUS; środki są waloryzowane, podlegają dziedziczeniu i podziałowi (np. przy rozwodzie).",
          "Wskaźnik dla konta i kapitału początkowego **kompensuje inflację i uwzględnia wzrost wynagrodzeń** w gospodarce. Wzrost wartości subkonta zależy od tempa rozwoju gospodarczego (PKB) z ostatnich **5 lat**.",
        ],
      },
      {
        type: "important",
        title: "Dłuższa praca = wyższa emerytura",
        text: "Im później zgłosisz się po emeryturę, tym wyższa będzie – odłożysz więcej składek, a średnie dalsze trwanie życia (przez które dzieli się kapitał) będzie krótsze.",
      },
      {
        type: "example",
        title: "Pan Edward i 1000 zł",
        text: "1000 zł niewniesione do systemu 25 lat temu (umowa o dzieło w 1999 r.) oznacza emeryturę niższą o ok. **30 zł**, a ta sama kwota wniesiona tuż przed emeryturą zwiększy ją zaledwie o **4 zł 60 gr**. Wniosek: im młodszy byłeś, gdy składka została odprowadzona, tym większe ma znaczenie – nie warto godzić się na pracę bez składek (np. umowa o dzieło).",
      },
      {
        type: "p",
        text: "**Emeryt może pracować.** Po osiągnięciu powszechnego wieku emerytalnego (60/65) ZUS **nie zmniejszy ani nie zawiesi** emerytury bez względu na zarobki. Jeśli pracujesz i płacone są składki emerytalne i rentowe, możesz **raz w roku** złożyć wniosek o ponowne obliczenie emerytury.",
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 4
  // ==========================================================================
  {
    id: "l4-rejestracja",
    lesson: "l4",
    title: "Rejestracja firmy",
    blocks: [
      {
        type: "p",
        text: "Działalność gospodarczą rejestrujesz w **urzędzie gminy lub miasta** albo elektronicznie – wnioskiem o wpis do **CEIDG** (Centralna Ewidencja i Informacja o Działalności Gospodarczej – spis przedsiębiorców). Na **jednym wniosku CEIDG-1** zgłaszasz firmę jednocześnie w: gminie, urzędzie skarbowym, GUS i ZUS (także jako płatnik składek).",
      },
      {
        type: "important",
        title: "Działalność nieewidencjonowana (nierejestrowana)",
        text: "Drobna działalność bez obowiązku rejestracji w CEIDG (np. blog) – **nie podlegasz ubezpieczeniom społecznym**. Brak składek = brak świadczeń. Warunek: kwartalny przychód nie przekracza 225% minimalnego wynagrodzenia (10 813,50 zł w 2026 r.).",
      },
    ],
  },
  {
    id: "l4-zgloszenie",
    lesson: "l4",
    title: "Zgłoszenie do ubezpieczeń",
    blocks: [
      {
        type: "p",
        text: "Przy rejestracji firmy w urzędzie wraz z CEIDG-1 możesz zgłosić:",
      },
      {
        type: "table",
        head: ["Kogo", "Formularz"],
        rows: [
          ["siebie – do ubezpieczeń społecznych i zdrowotnego (lub tylko zdrowotnego)", "**ZUS ZUA** lub **ZUS ZZA**"],
          ["członków swojej rodziny do ubezpieczenia zdrowotnego", "**ZUS ZCNA**"],
          ["zatrudnionych (pracowników, zleceniobiorców, współpracujących) – do społecznych i zdrowotnego lub tylko zdrowotnego", "**ZUS ZUA** lub **ZUS ZZA**"],
          ["członków rodziny zatrudnionych osób do zdrowotnego", "**ZUS ZCNA**"],
        ],
      },
      {
        type: "important",
        text: "Pracowników i zleceniobiorców musisz zgłosić do ubezpieczeń w ZUS **w ciągu 7 dni od dnia zatrudnienia**. Zgłoszenia możesz złożyć w placówce ZUS, listownie lub elektronicznie (program Płatnik, aplikacja ePłatnik).",
      },
      {
        type: "p",
        text: "**Osoby współpracujące** z Tobą przy działalności to małżonek, dzieci (własne, drugiego małżonka, przysposobione), rodzice, macocha i ojczym oraz osoby przysposabiające Ciebie – jeśli spełniają **oba warunki**: pozostają z Tobą we wspólnym gospodarstwie domowym i współpracują przy prowadzeniu działalności.",
      },
    ],
  },
  {
    id: "l4-ubezp-przedsiebiorcy",
    lesson: "l4",
    title: "Ubezpieczenia i podstawa składek przedsiębiorcy",
    blocks: [
      {
        type: "list",
        items: [
          "**Obowiązkowe** dla przedsiębiorcy: ubezpieczenia społeczne – emerytalne, rentowe, wypadkowe – oraz ubezpieczenie zdrowotne.",
          "**Dobrowolne**: ubezpieczenie chorobowe. Jeśli przystąpisz, możesz korzystać ze świadczeń w razie choroby i macierzyństwa.",
        ],
      },
      {
        type: "important",
        title: "Podstawa wymiaru składek",
        text: "Składki na ubezpieczenia społeczne naliczasz za siebie od deklarowanej kwoty **nie niższej niż 60% prognozowanego przeciętnego wynagrodzenia miesięcznego** (w 2026 r. – **5652 zł**). Możesz zadeklarować wyższą – im wyższe składki, tym wyższe świadczenia (np. przy chorobie czy wypadku przy pracy).",
      },
    ],
  },
  {
    id: "l4-ulgi",
    lesson: "l4",
    title: "Ulgi w płaceniu składek",
    blocks: [
      {
        type: "table",
        head: ["Ulga", "Jak długo", "Składki społeczne", "Świadczenia"],
        rows: [
          ["**Ulga na start**", "maks. **6 miesięcy** od rozpoczęcia działalności", "**brak składek** (płacisz tylko zdrowotną)", "brak świadczeń z ubezpieczeń społecznych"],
          ["**Preferencyjne składki**", "maks. **24 miesiące** od rozpoczęcia działalności albo od zakończenia ulgi na start", "podstawa **co najmniej 30% minimalnego wynagrodzenia** (2026: 1441,80 zł)", "ZUS liczy od kwoty, od której opłacasz składki"],
          ["**Mały ZUS plus**", "maks. **36 miesięcy** kalendarzowych w każdym okresie **60 miesięcy** prowadzenia działalności", "podstawa zależna od **dochodu**; między 30% minimalnego a 60% prognozowanego przeciętnego (2026: od 1441,80 zł do 5652 zł)", "ZUS liczy od kwoty, od której opłacasz składki"],
          ["**Wakacje składkowe**", "**1 miesiąc** w roku kalendarzowym", "zwolnienie ze składek (finansuje je budżet państwa)", "zachowane prawa do świadczeń, miesiąc wlicza się do emerytury"],
        ],
      },
      {
        type: "important",
        text: "Korzystanie z ulgi na start, preferencyjnych składek czy małego ZUS plus oznacza **niższe świadczenia** (lub ich brak). Okres obniżonych składek wpływa też na wysokość przyszłej emerytury lub renty. Składka **zdrowotna** jest zawsze płatna.",
      },
    ],
  },
  {
    id: "l4-ulga-start-pref",
    lesson: "l4",
    title: "Ulga na start i preferencyjne składki – warunki",
    blocks: [
      {
        type: "p",
        text: "**Ulga na start**: zaczynasz działalność **po raz pierwszy** albo ponownie po co najmniej **60 miesiącach** od jej ostatniego zawieszenia/zakończenia; nie wykonujesz dla byłego pracodawcy tego, co robiłeś dla niego jako pracownik w bieżącym lub poprzednim roku. W tym okresie masz **obowiązkowe ubezpieczenie zdrowotne** – opłacasz tylko tę składkę.",
      },
      {
        type: "p",
        text: "**Preferencyjne składki** możesz płacić po uldze na start (po 6 miesiącach albo po wcześniejszej rezygnacji) albo od razu po założeniu firmy, jeśli: w ostatnich **60 miesiącach** przed rozpoczęciem działalności nie prowadziłeś pozarolniczej działalności (nie byłeś np. wspólnikiem spółki jawnej, twórcą czy artystą) oraz nie wykonujesz dla byłego pracodawcy tego, co robiłeś jako pracownik.",
      },
    ],
  },
  {
    id: "l4-maly-zus",
    lesson: "l4",
    title: "Mały ZUS plus – warunki",
    blocks: [
      {
        type: "list",
        items: [
          "przychód z działalności za poprzedni rok **nie przekroczył 120 tys. zł**,",
          "w poprzednim roku kalendarzowym prowadziłeś działalność **co najmniej 60 dni**,",
          "nie wykonujesz dla byłego pracodawcy tego, co robiłeś dla niego jako pracownik (w tym lub poprzednim roku).",
        ],
      },
      {
        type: "p",
        text: "Podstawę wymiaru możesz wyliczyć specjalnym wzorem albo kalkulatorem na **zus.pl** lub **eskladka.pl**.",
      },
    ],
  },
  {
    id: "l4-wakacje-zdrowotna",
    lesson: "l4",
    title: "Wakacje składkowe i składka zdrowotna",
    blocks: [
      {
        type: "p",
        text: "W miesiącu, w którym dostaniesz zwolnienie (wakacje składkowe), składki są **sfinansowane z budżetu państwa**. Wniosek składasz przez **eZUS w miesiącu poprzedzającym** ten, za który chcesz zwolnienie (np. za sierpień – w lipcu). Zwolnienie **nie obejmuje składki zdrowotnej**.",
      },
      {
        type: "p",
        text: "**Składka zdrowotna** – obowiązkowa od dnia rozpoczęcia działalności do dnia jej zakończenia (z wyjątkiem okresu zawieszenia). Zasady ustalania zależą od **formy opodatkowania** (zasady ogólne, karta podatkowa, ryczałt). Płacisz ją **zawsze w pełnej wysokości** – nawet gdy działalność wykonujesz tylko część miesiąca (np. pobierałeś zasiłek chorobowy).",
      },
      {
        type: "example",
        title: "Przykłady z podręcznika",
        text: "Przedsiębiorca na zasadach ogólnych od 1 lutego 2026 do 31 stycznia 2027 płaci miesięczną składkę od dochodu z poprzedniego miesiąca (podstawa nie niższa niż minimalne wynagrodzenie). Na karcie podatkowej – w 2026 r. składka wynosi **432,54 zł** (9% od 4806 zł).",
      },
    ],
  },
  {
    id: "l4-rozliczenia",
    lesson: "l4",
    title: "Rozliczenia z ZUS",
    blocks: [
      {
        type: "p",
        text: "Jako płatnik składek przekazujesz **dokumenty rozliczeniowe**:",
      },
      {
        type: "table",
        head: ["Dokument", "Co zawiera"],
        rows: [
          ["**ZUS DRA**", "deklaracja rozliczeniowa – wszystkie składki za dany miesiąc"],
          ["**ZUS RCA**", "raport imienny – należne składki i wypłacone świadczenia"],
          ["**ZUS RPA**", "raport imienny – przychody ubezpieczonego / okresy pracy nauczycielskiej"],
          ["**ZUS RSA**", "raport imienny – wypłacone świadczenia i przerwy w opłacaniu składek"],
        ],
      },
      {
        type: "list",
        items: [
          "Nawet jeśli opłacasz składki tylko za siebie, co miesiąc przekazujesz dokumenty (wtedy **tylko deklarację DRA** za siebie).",
          "Zwolnieni z miesięcznych dokumentów są tylko m.in. marynarze, duchowni, osoby składające dokumenty za nianię, osoby objęte dobrowolnie ubezpieczeniami emerytalnym i rentowymi.",
          "Rozliczasz składki za **ponad 5 osób** – dokumenty **obowiązkowo elektronicznie**.",
          "**ePłatnik** – aplikacja powiązana z kontem na eZUS, dla rozliczających **maks. 100 ubezpieczonych**; podpis kwalifikowany, osobisty (e-dowód) lub profil zaufany. **Program Płatnik** – niezależnie od liczby osób, ale do wysyłki potrzebny podpis kwalifikowany.",
          "Wszystkie składki opłacasz **jednym przelewem** na swój numer rachunku składkowego (**NRS**).",
        ],
      },
      {
        type: "table",
        head: ["Termin (do dnia następnego miesiąca)", "Kto"],
        rows: [
          ["**15.**", "osoby prawne: spółki kapitałowe, spółdzielnie, stowarzyszenia, fundacje, JST, uczelnie, Kościół, ZOZ"],
          ["**20.**", "osoby fizyczne – przedsiębiorcy opłacający składki tylko za siebie, spółki osobowe, zatrudniający pracowników"],
        ],
      },
      {
        type: "p",
        text: "Jeśli 15. lub 20. przypada w sobotę, niedzielę lub święto, ostatni dzień to **najbliższy dzień roboczy po**.",
      },
    ],
  },
  {
    id: "l4-pomoc",
    lesson: "l4",
    title: "Odroczenie, raty, dofinansowanie",
    blocks: [
      {
        type: "list",
        items: [
          "Nie możesz na bieżąco płacić składek? Wnioskujesz do ZUS o **odroczenie terminu płatności**. Masz już zaległości? Wniosek o **rozłożenie długu na raty**. ZUS może też **umorzyć** należności – na warunkach z przepisów.",
          "**Dofinansowanie** poprawy bezpieczeństwa i higieny pracy – jeśli nie zalegasz ze składkami; ZUS przyznaje je w **corocznym konkursie** na projekty dotyczące utrzymania zdolności do pracy.",
          "Maksymalne dofinansowanie: **do 80%** szacowanej wartości projektu, **nie mniej niż 15 tys. zł**, **nie więcej niż 350 tys. zł**.",
        ],
      },
    ],
  },

  // ==========================================================================
  // DODATKOWE 2025/2026
  // ==========================================================================
  {
    id: "d1-dodatek",
    lesson: "d1",
    title: "Dodatek dopełniający do renty socjalnej",
    blocks: [
      {
        type: "p",
        text: "Mogą go otrzymać osoby uprawnione do renty socjalnej, które są jednocześnie **całkowicie niezdolne do pracy** i **niezdolne do samodzielnej egzystencji**. Trzeba złożyć wniosek **EDD-SOC** i dołączyć zaświadczenie o stanie zdrowia **OL-9** (wystawione najwcześniej miesiąc przed złożeniem wniosku).",
      },
      {
        type: "list",
        items: [
          "Orzeka lekarz orzecznik ZUS lub komisja lekarska ZUS; **od 13 kwietnia 2026 r.** orzeczenia o niezdolności do samodzielnej egzystencji w tych sprawach mogą wydawać także pielęgniarki i pielęgniarze.",
          "Wysokość od 1 marca 2026 r.: **2704,71 zł** (waloryzowana raz w roku); ZUS odlicza składkę zdrowotną i zaliczkę na podatek.",
          "Wypłacany razem z rentą socjalną; może być obniżony lub zawieszony zależnie od przychodu z pracy.",
          "Nie przysługuje osobie tymczasowo aresztowanej lub odbywającej karę pozbawienia wolności (nie dotyczy dozoru elektronicznego).",
          "Od miesiąca ustalenia dodatku wygasa prawo do **świadczenia uzupełniającego** dla osób niezdolnych do samodzielnej egzystencji (łączny limit świadczeń od 1 marca 2026: 2687,67 zł).",
          "Renta socjalna + renta rodzinna: łącznie nie więcej niż **300% najniższej renty z tytułu całkowitej niezdolności do pracy** (od 1 marca 2026: **5935,47 zł**); obniżona renta socjalna nie niższa niż **10%** tej kwoty (**197,85 zł**).",
        ],
      },
    ],
  },
  {
    id: "d1-wakacje",
    lesson: "d1",
    title: "Wakacje składkowe – szczegóły",
    blocks: [
      {
        type: "p",
        text: "Przedsiębiorca (z wpisem do CEIDG) lub komornik sądowy może raz w roku złożyć wniosek o zwolnienie z opłacania **za siebie** składek za **jeden miesiąc** w roku kalendarzowym – na: obowiązkowe ubezpieczenia emerytalne, rentowe i wypadkowe, dobrowolne chorobowe oraz Fundusz Pracy i Fundusz Solidarnościowy.",
      },
      {
        type: "important",
        text: "Wakacje **nie obejmują** składki zdrowotnej ani składek opłacanych za pracowników. Zwolnienie jest liczone od **najniższej podstawy**, finansuje je budżet państwa (miesiąc wlicza się do emerytury i renty, nie trzeba zawieszać firmy). To forma pomocy **de minimis**.",
      },
      {
        type: "table",
        head: ["Warunek", "Szczegół"],
        rows: [
          ["Wniosek", "**RWS**, wyłącznie z profilu płatnika na **eZUS**, w **miesiącu poprzedzającym** miesiąc zwolnienia (za grudzień → w listopadzie)"],
          ["Liczba ubezpieczonych", "w miesiącu przed wnioskiem **nie więcej niż 10** (wliczając przedsiębiorcę; bez uczniów/studentów do 26 lat; wliczani: pracownicy, zleceniobiorcy, współpracujący)"],
          ["Ubezpieczenia", "choć jeden dzień w miesiącu poprzedzającym wniosek: emerytalne, rentowe i wypadkowe z działalności"],
          ["Przychód", "w jednym z dwóch ostatnich lat nie więcej niż równowartość **2 mln euro** (lub brak przychodu)"],
          ["Były pracodawca", "brak działalności na rzecz byłego pracodawcy w zakresie dawnej pracy"],
          ["De minimis", "limit pomocy w ciągu 3 lat: równowartość **300 tys. euro**"],
          ["Wspólnik spółki cywilnej", "składa wniosek ze **swojego** profilu płatnika, nie z konta spółki"],
        ],
      },
      {
        type: "list",
        items: [
          "Dokumenty za miesiąc wakacji: **ZUS RCA** z kodem wakacyjnym – **05 14** (podstawa 60% prognozowanego przeciętnego), **05 74** (30% minimalnego – preferencyjny ZUS), **05 94** (mały ZUS plus) – oraz RCA za zdrowotną/chorobową i DRA.",
          "ZUS częściowo zwolni lub odmówi – wydaje **decyzję** (na eZUS). Odwołanie – za pośrednictwem ZUS do sądu rejonowego (sąd pracy i ubezpieczeń społecznych) w ciągu **miesiąca** od doręczenia; wniesienie jest **bezpłatne**.",
          "Brak rozstrzygnięcia w **2 miesiące** od wniosku – można złożyć odwołanie od niewydania decyzji.",
        ],
      },
    ],
  },
  {
    id: "d1-honorowe",
    lesson: "d1",
    title: "Świadczenie honorowe (100 lat)",
    blocks: [
      {
        type: "list",
        items: [
          "Przysługuje osobie, która ma **obywatelstwo polskie** i **skończyła 100 lat**.",
          "**Z urzędu** (bez wniosku) – jeśli w ostatnim dniu miesiąca poprzedzającego miesiąc setnych urodzin miała prawo do świadczenia z ustawy (np. emerytura, renta).",
          "**Na wniosek** – gdy nie ma takiego świadczenia, ale od 16. roku życia miała **ośrodek interesów życiowych w Polsce co najmniej 10 lat**; przyznane od miesiąca wniosku, nie wcześniej niż od miesiąca setnych urodzin.",
          "Wysokość od 1 marca 2026 r.: **6938,92 zł** miesięcznie (waloryzacja co roku w marcu).",
          "Jeśli osoba pobiera kilka świadczeń – otrzyma tylko **jedno** świadczenie honorowe; gdy świadczenia wypłacają dwa organy, przyzna i wypłaci je ZUS.",
        ],
      },
    ],
  },
  {
    id: "d1-ezus",
    lesson: "d1",
    title: "eZUS i mZUS dla płatnika",
    blocks: [
      {
        type: "list",
        items: [
          "Platforma Usług Elektronicznych (PUE) zmienia się w **eZUS**; część dla płatników składek (przedsiębiorców) – wdrożenie od początku 2026 r.",
          "Nowości: szybki dostęp do wiadomości (saldo rozliczeń, zwolnienia lekarskie pracowników), kreatory wniosków, sekcja „Wybrane dla Ciebie”, widok **„Sprawy płatnika”**, korespondencja w jednym wątku, skrzynka z trzech sekcji: powiadomienia, korespondencja z ZUS, komunikaty.",
          "**mZUS dla Płatnika** – aplikacja mobilna: salda, zwolnienia lekarskie, wysyłanie dokumentów (RWN, RD-3, wniosek o zaświadczenie A1, zgłoszenie umowy o dzieło), generowanie zaświadczeń, priorytetowy kontakt z CKK, umawianie e-wizyt.",
        ],
      },
    ],
  },
  {
    id: "d1-maly-zus-plus",
    lesson: "d1",
    title: "Mały ZUS plus – zmiany od 2026",
    blocks: [
      {
        type: "list",
        items: [
          "Do 31 grudnia 2025 r. – 36 miesięcy w ciągu ostatnich 60 miesięcy prowadzenia firmy. **Od stycznia 2026 r.** – **36 miesięcy kalendarzowych w każdym okresie 60 miesięcy**; przysługuje niezależnie od tego, czy wcześniej wykorzystano ulgę.",
          "Warunki: przychód w poprzednim roku **≤ 120 tys. zł** (przy krótszym prowadzeniu działalności – limit proporcjonalnie niższy), działalność w poprzednim roku **co najmniej 60 dni**.",
          "**Nie mogą** skorzystać: osoby na karcie podatkowej z jednoczesnym zwolnieniem z VAT w poprzednim roku, prowadzące też inną pozarolniczą działalność (np. wspólnik spółki jawnej), pracujące dla byłego/obecnego pracodawcy w dawnym zakresie, spełniające warunki preferencyjnych składek.",
          "Zgłoszenie: **ZUS ZUA/ZZA** z kodem tytułu **05 90** lub **05 92**, do **31 stycznia** danego roku (lub w 7 dni od rozpoczęcia/wznowienia działalności). W 2026 r. – do 2 lutego (31 stycznia to sobota).",
          "Kto korzysta w styczniu – dokumenty rozliczeniowe do **20 lutego** (roczny przychód, dochód, formy opodatkowania, podstawa wymiaru).",
          "Podstawa nie niższa niż **30% minimalnego** (1441,80 zł) i nie wyższa niż **60% prognozowanego przeciętnego** (5652 zł). Ulga **nie obejmuje składki zdrowotnej**.",
        ],
      },
    ],
  },
  {
    id: "d1-zbieg",
    lesson: "d1",
    title: "Zbieg renty rodzinnej z innym świadczeniem (renta wdowia)",
    blocks: [
      {
        type: "p",
        text: "Wdowa lub wdowiec z prawem do renty rodzinnej i własnego świadczenia (emerytura, renta z tytułu niezdolności do pracy itd.) może wybrać:",
      },
      {
        type: "list",
        items: [
          "**100% renty rodzinnej + 15%** własnego świadczenia, albo",
          "**100% własnego świadczenia + 15%** renty rodzinnej.",
          "**Od 1 stycznia 2027 r.** zamiast 15% będzie **25%** drugiego świadczenia.",
          "Gdy do renty rodzinnej dochodzą emerytura **i** renta z niezdolności do pracy z ubezpieczenia wypadkowego: 100% jednego świadczenia + 15% drugiego + 50% trzeciego (np. 100% renty rodzinnej, 15% emerytury i 50% renty wypadkowej).",
        ],
      },
      {
        type: "important",
        title: "Warunki (łącznie)",
        text: "co najmniej **60 lat (K) / 65 lat (M)**; wspólność małżeńska do dnia śmierci małżonka; prawo do renty rodzinnej nabyte **nie wcześniej niż w wieku 55 (K) / 60 (M)**; **nie pozostajesz w związku małżeńskim**. Prawo ustaje w dniu poprzedzającym zawarcie nowego małżeństwa.",
      },
      {
        type: "list",
        items: [
          "Wymagany **wniosek**; świadczenie przyznawane od miesiąca złożenia wniosku.",
          "Suma świadczeń nie może przekroczyć **trzykrotności najniższej emerytury** – nadwyżka pomniejsza świadczenia (najpierw z budżetu państwa: zaopatrzenie żołnierzy, funkcjonariuszy…).",
        ],
      },
    ],
  },
  {
    id: "d1-pogrzebowy",
    lesson: "d1",
    title: "Zasiłek pogrzebowy – szczegóły",
    blocks: [
      {
        type: "list",
        items: [
          "Od **1 stycznia 2026 r.** – **7000 zł** (wcześniej 4000 zł).",
          "**Członek rodziny** zmarłego – pełna kwota niezależnie od kosztów; **osoba spoza rodziny lub instytucja** – do wysokości poniesionych kosztów, nie więcej niż 7000 zł. Przy kilku płacących – podział proporcjonalnie do kosztów.",
          "Członkowie rodziny: małżonek, rodzice, dzieci (własne, przysposobione, z rodziny zastępczej), rodzeństwo, dziadkowie, wnuki, osoby pod opieką prawną. Zasiłek może dostać też pracodawca, DPS, gmina, powiat, osoba prawna kościoła, osoba obca – jeśli pokryli koszty.",
          "Koszty: od chwili śmierci do zakończenia pochówku, **udokumentowane rachunkami**; nie liczą się np. koszt nagrobka czy konsolacji.",
          "Nie jest wypłacany z urzędu – **wniosek** (od 2026 r. formularz **Z-12**): w placówce ZUS, pocztą, przez zakład pogrzebowy lub przez eZUS.",
          "Termin: do **12 miesięcy od dnia śmierci** (lub od pogrzebu – gdy np. trudno było zidentyfikować zmarłego, z dokumentem potwierdzającym przyczynę). Wypłata w ciągu **14 dni kalendarzowych** od ostatniej okoliczności niezbędnej do ustalenia prawa.",
        ],
      },
    ],
  },
  {
    id: "d1-utrata-ciazy",
    lesson: "d1",
    title: "Świadczenia po utracie ciąży",
    blocks: [
      {
        type: "list",
        items: [
          "Od **6 sierpnia 2025 r.** dwa rozporządzenia upraszczają przyznawanie **zasiłku macierzyńskiego** i **pogrzebowego** po utracie ciąży – **niezależnie od tygodnia ciąży i bez ustalania płci**.",
          "Gdy nie sporządzono aktu urodzenia – wystarczy **zaświadczenie** wydane na podstawie dokumentacji medycznej przez lekarza specjalistę położnika-ginekologa, lekarza w trakcie tej specjalizacji lub **położną**. Zasiłek pogrzebowy – także na podstawie **karty zgonu**.",
          "Martwe urodzenie → zasiłek macierzyński **8 tygodni** od zakończenia ciąży. Dziecko urodzone żywe, zmarłe przed 8. tygodniem życia → 8 tygodni po porodzie, ale **nie krócej niż 7 dni od śmierci dziecka**.",
        ],
      },
    ],
  },
  {
    id: "d1-staz",
    lesson: "d1",
    title: "Zaświadczenia o okresach doliczanych do stażu pracy",
    blocks: [
      {
        type: "list",
        items: [
          "Od **1 stycznia 2026 r.** do stażu pracy można doliczyć także okresy inne niż umowa o pracę (wobec jednostek sektora finansów publicznych – od 1.01.2026, wobec pozostałych pracodawców – od **1 maja 2026**).",
          "M.in. okresy z opłaconymi składkami z działalności lub współpracy, z umowy zlecenia, agencyjnej, członkostwa w rolniczej spółdzielni produkcyjnej, **ulgi na start** (zgłoszenie do ubezpieczenia zdrowotnego), pracy za granicą na podstawie innej niż stosunek pracy.",
          "Wniosek o zaświadczenie: symbol **USP**, wyłącznie **elektronicznie na eZUS**; ZUS wystawia je na podstawie danych z konta (bez załączania dokumentów).",
          "Okresy sprzed **1 stycznia 1999 r.** – wniosek **US-7**; okres zaczynający się przed i trwający po tej dacie – dwa wnioski: US-7 i USP.",
          "ZUS nie wystawia zaświadczeń za okresy zlecenia ucznia/studenta do 26 lat (brak ubezpieczeń emerytalnego i rentowych).",
          "Odmowa – można wnioskować o **postępowanie wyjaśniające** (wniosek ogólny **POG**) z dokumentami.",
        ],
      },
    ],
  },

  // ==========================================================================
  // SKŁADKI PRZEDSIĘBIORCÓW 2026
  // ==========================================================================
  {
    id: "d2-kwoty",
    lesson: "d2",
    title: "Kluczowe kwoty 2026",
    blocks: [
      {
        type: "table",
        head: ["Wielkość", "Kwota 2026"],
        rows: [
          ["Prognozowane przeciętne wynagrodzenie", "**9420 zł**"],
          ["60% prognozowanego przeciętnego (podstawa zasad ogólnych)", "**5652 zł**"],
          ["Minimalne wynagrodzenie za pracę", "**4806 zł**"],
          ["30% minimalnego (podstawa preferencyjna)", "**1441,80 zł**"],
          ["Przeciętne wynagrodzenie w sektorze przedsiębiorstw (IV kw. 2025)", "9228,64 zł"],
          ["Roczny limit podstawy składek emerytalnej i rentowej", "282 600 zł"],
          ["Miesięczny limit podstawy dobrowolnej chorobowej", "23 550 zł"],
          ["Kwartalny limit przychodu działalności nierejestrowej (225% min.)", "10 813,50 zł"],
        ],
      },
      {
        type: "important",
        text: "Najniższe składki na zasadach ogólnych są w 2026 r. **wyższe o 8,6%** r/r (wzrost prognozowanego wynagrodzenia); preferencyjne – o **3,0%** (wzrost minimalnego). Ponad **99%** przedsiębiorców płaci od najniższej dopuszczalnej podstawy.",
      },
    ],
  },
  {
    id: "d2-ogolne",
    lesson: "d2",
    title: "Najniższe składki – zasady ogólne",
    blocks: [
      {
        type: "p",
        text: "Podstawa: **5652 zł** (60% prognozowanego przeciętnego wynagrodzenia, art. 18 ust. 8 ustawy o systemie ubezpieczeń społecznych).",
      },
      {
        type: "table",
        head: ["Składka", "Stopa", "Kwota miesięczna"],
        rows: [
          ["Emerytalna", "19,52%", "**1103,27 zł**"],
          ["Rentowa", "8,00%", "**452,16 zł**"],
          ["Chorobowa (dobrowolna)", "2,45%", "**138,47 zł**"],
          ["Wypadkowa", "1,67%", "**94,39 zł**"],
          ["Suma społecznych z chorobową", "", "**1788,29 zł**"],
          ["Fundusz Pracy / Solidarnościowy", "2,45%", "**138,47 zł**"],
          ["Razem z FP/FS", "", "**1926,76 zł**"],
          ["Suma społecznych **bez** chorobowej (podręcznik)", "", "**1649,82 zł**"],
        ],
      },
      {
        type: "p",
        text: "Składki społeczne zapłacone za przedsiębiorcę stanowią koszt uzyskania przychodu lub bezpośrednio pomniejszają podstawę opodatkowania podatkiem dochodowym i podstawę składki zdrowotnej.",
      },
    ],
  },
  {
    id: "d2-preferencyjne",
    lesson: "d2",
    title: "Najniższe składki – zasady preferencyjne",
    blocks: [
      {
        type: "p",
        text: "Podstawa: **1441,80 zł** (30% minimalnego wynagrodzenia, art. 18a ust. 1 ustawy). Podstawa jest niższa od minimalnego wynagrodzenia, więc **nie płaci się Funduszu Pracy ani Solidarnościowego**.",
      },
      {
        type: "table",
        head: ["Składka", "Stopa", "Kwota miesięczna"],
        rows: [
          ["Emerytalna", "19,52%", "**281,44 zł**"],
          ["Rentowa", "8,00%", "**115,34 zł**"],
          ["Chorobowa (dobrowolna)", "2,45%", "**35,32 zł**"],
          ["Wypadkowa", "1,67%", "**24,08 zł**"],
          ["Suma z chorobową", "", "**456,18 zł**"],
          ["Suma bez chorobowej (podręcznik)", "", "**420,86 zł**"],
        ],
      },
      {
        type: "p",
        text: "**Mały ZUS plus** w 2026 r.: składki liczone od **połowy przeciętnego dochodu z roku poprzedniego**, czyli w przedziale od **456,18 zł** do **1788,29 zł** miesięcznie (podstawa od 1441,80 zł do 5652 zł).",
      },
    ],
  },
  {
    id: "d2-ulgi",
    lesson: "d2",
    title: "Ulgi i „ulgowy pas startowy”",
    blocks: [
      {
        type: "list",
        items: [
          "**Działalność nierejestrowa** – bez firmy i zgłoszenia do ubezpieczeń, gdy kwartalny przychód ≤ 225% minimalnego wynagrodzenia (10 813,50 zł w 2026 r.).",
          "**Ulga na start** – 6 miesięcy bez ubezpieczenia i składek społecznych (+FP/FS); tylko zdrowotna.",
          "**Składki preferencyjne** – od 30% minimalnego przez 24 miesiące.",
          "**Mały ZUS plus** – niskie składki od dochodu, 36 miesięcy z każdych 60.",
          "**Wakacje składkowe** – 1 miesiąc w roku bez składek.",
        ],
      },
      {
        type: "important",
        text: "„Ulgowy pas startowy” może trwać nawet ponad **5,5 roku** i pozwala zmniejszyć kwotę składek o ponad 70%. Przykład: firma założona w styczniu 2020 r. – do lipca 2025 r. ograniczenie składek o ok. 63 tys. zł (70,9%); firma założona w styczniu 2026 r. – do lipca 2031 r. ok. 109 tys. zł (73,5%). Z ulg korzysta co trzeci przedsiębiorca – ale poza wakacjami składkowymi skutkuje to **niższymi świadczeniami** w przyszłości.",
      },
      {
        type: "p",
        text: "Od czego zależą świadczenia: emerytura z nowego systemu – od **składek, kapitału początkowego i subkonta** (art. 25 ust. 1 ustawy o emeryturach i rentach z FUS); renta z tytułu niezdolności i emerytura ze starego systemu – od **najlepszych lat** (art. 15); zasiłki – od przeciętnego wynagrodzenia/przychodu z **12 miesięcy** poprzedzających niezdolność.",
      },
    ],
  },
  {
    id: "d2-zdrowotna",
    lesson: "d2",
    title: "Składka zdrowotna przedsiębiorców 2026",
    blocks: [
      {
        type: "p",
        text: "Składka zdrowotna wynosi **9%** podstawy (**4,9%** dla opodatkowanych liniowo). Żadna z ulg (ulga na start, preferencyjne składki, mały ZUS plus, wakacje składkowe) **nie obejmuje składki zdrowotnej**. Gdy ktoś ma kilka tytułów (np. etat i zlecenie), składkę płaci **z każdego odrębnie**.",
      },
      {
        type: "table",
        head: ["Forma opodatkowania", "Podstawa i składka (2026)"],
        rows: [
          ["**Skala podatkowa / podatek liniowy** (zasady ogólne)", "od **dochodu** z poprzedniego miesiąca; rok składkowy **1 lutego – 31 stycznia**; **minimum 432,54 zł** (9% od 4806 zł); roczne rozliczenie; 9% (skala) lub 4,9% (liniowy)"],
          ["**Karta podatkowa**", "ryczałtowo **432,54 zł**"],
          ["**Ryczałt** – przychody narastające do 60 tys. zł", "**498,35 zł** (9% od 60% przeciętnego wynagrodzenia, 5537,18 zł)"],
          ["**Ryczałt** – powyżej 60 do 300 tys. zł", "**830,58 zł** (9% od 100%, 9228,64 zł)"],
          ["**Ryczałt** – powyżej 300 tys. zł", "**1495,04 zł** (9% od 180%, 16 611,55 zł)"],
          ["Pozostałe osoby prowadzące pozarolniczą działalność (np. twórcy, wspólnicy)", "**830,58 zł**"],
          ["Osoby współpracujące (także przy uldze na start)", "**622,93 zł** (9% od 75%, 6921,48 zł)"],
        ],
      },
      {
        type: "important",
        text: "W 2025 r. minimalna składka zdrowotna liczona była od **75%** minimalnego wynagrodzenia (314,96 zł). W 2026 r. – od **100%** (432,54 zł), czyli wzrost o **37,3%**.",
      },
    ],
  },
];

export function getTheoryForLesson(lesson: LessonId): TheorySection[] {
  return THEORY.filter((s) => s.lesson === lesson);
}
