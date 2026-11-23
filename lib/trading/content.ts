// ============================================================================
// lib/trading/content.ts
// Treść aplikacji do nauki tradingu (ropa Brent / OIL CFD, XTB): lekcje,
// quiz, scenariusze do ćwiczenia decyzji, zasady i dziennik przykładowych
// transakcji. Źródło: podsumowanie sesji nauki 29.10–06.11.2026.
// Materiał edukacyjny — to nie jest porada inwestycyjna.
// ============================================================================

export interface Lesson {
  slug: string;
  title: string;
  /** Jedno zdanie: o czym jest lekcja. */
  lead: string;
  points: string[];
  /** Najważniejszy wniosek do zapamiętania. */
  takeaway: string;
}

export const LESSONS: Lesson[] = [
  {
    slug: "podstawy",
    title: "Podstawy: czym handlujemy",
    lead: "OIL w XTB to CFD na kontrakt futures na ropę Brent.",
    points: [
      "OIL w XTB = CFD na kontrakt futures na ropę Brent (giełda ICE).",
      "Cena Sell (bid) to ta z wykresu. Cena Buy (ask) jest wyższa o spread.",
      "Spread (np. 0,05–0,07 USD) to koszt wejścia w pozycję.",
      "Long (Buy) zarabia, gdy cena rośnie. Short (Sell) — gdy spada.",
      "Long zamykasz po cenie Sell, short po cenie Buy — dlatego TP shorta zadziała dopiero, gdy wykres zejdzie o spread niżej.",
      "Rolowanie kontraktu: CFD przechodzi na kolejną serię futures, więc cena w newsach (np. kontrakt grudniowy) może różnić się od ceny w aplikacji (styczniowy).",
      "Handel OIL w XTB trwa do północy czasu polskiego; w weekend rynek jest zamknięty.",
    ],
    takeaway: "Wykres pokazuje Sell. Każda pozycja startuje na lekkim minusie o wartość spreadu.",
  },
  {
    slug: "wolumen-i-ryzyko",
    title: "Wolumen i ryzyko",
    lead: "Najważniejsza lekcja: ile ryzykujesz, zanim zastanowisz się, ile zarobisz.",
    points: [
      "0,01 lota OIL ≈ 10 baryłek ≈ ok. 40 PLN na każdy 1 USD ruchu ceny.",
      "0,02 lota ≈ 80 PLN na 1 USD, 0,035 lota ≈ 140 PLN na 1 USD.",
      "Zasada 1–2%: na jednej transakcji ryzykujesz maksymalnie 1–2% kapitału (przy ~1600 PLN to 16–32 PLN).",
      "Najpierw stop, potem wolumen: SL wyznaczasz z wykresu, a wolumen dobierasz tak, by strata na SL mieściła się w limicie. Nigdy odwrotnie.",
      "Depozyt to blokowana kwota. Zbyt duży wolumen zabiera prawie wszystkie wolne środki i grozi stop outem.",
      "Po dobrej serii pojawia się pokusa zwiększania wolumenu — wtedy jedna strata zjada zysk z kilku dobrych transakcji.",
      "Zasada własna: wolumen 0,01, maksymalnie 0,02.",
    ],
    takeaway: "Najpierw SL z wykresu, potem wolumen z limitu ryzyka. Nie odwrotnie.",
  },
  {
    slug: "sl-i-tp",
    title: "Stop Loss i Take Profit",
    lead: "SL i TP ustawiasz od razu przy otwieraniu pozycji.",
    points: [
      "SL stawiasz w logicznym miejscu: za wsparciem/oporem albo za knotem świecy, z małym zapasem na szum.",
      "Relacja TP : SL powinna wynosić co najmniej ~1,3 : 1, najlepiej 1,5–2 : 1.",
      "Przy 1 : 1 musisz wygrywać ponad 50% transakcji, żeby wyjść na zero; przy 0,8 : 1 — ponad 55%.",
      "Break even: gdy cena przejdzie ok. połowę drogi do TP, przesuń SL na cenę wejścia. Od tego momentu pozycja nie może przynieść straty.",
      "Zbyt wczesne przesunięcie SL blisko wejścia = zwykły szum go wybije i wynik wyniesie ~0 zamiast zysku.",
      "Stop może wykonać się z poślizgiem przy gwałtownym ruchu (np. +2 PLN zamiast −2 PLN).",
    ],
    takeaway: "SL z wykresu, TP min. 1,3× dalej niż SL, break even przy połowie drogi.",
  },
  {
    slug: "swiece",
    title: "Świece i zamknięcie świecy",
    lead: "Decyzję podejmujesz po zamknięciu świecy, nie w jej trakcie.",
    points: [
      "Świeca M30 trwa 30 minut: świeca „8:30” trwa od 8:30 do 9:00 i zamyka się o 9:00.",
      "W trakcie świecy cena może wybić poziom i wrócić — zostaje sam knot.",
      "Długi górny knot przy oporze = sprzedający odepchnęli cenę (sygnał spadkowy).",
      "Długi dolny knot przy wsparciu = kupujący obronili poziom (sygnał wzrostowy).",
      "Duża świeca zamknięta przy samym dole/górze = siła tej strony rynku, nie jej wyczerpanie.",
      "Nie gonisz ceny: jeśli świeca zamknęła się ponad ~0,3 USD za poziomem, nie wchodzisz — czekasz na cofnięcie.",
    ],
    takeaway: "Czekaj na zamknięcie świecy. Knot to informacja, nie sygnał wejścia.",
  },
  {
    slug: "poziomy",
    title: "Wsparcia, opory i poziomy",
    lead: "Poziomy, przy których cena wcześniej się zatrzymywała, są punktem odniesienia dla decyzji.",
    points: [
      "Wsparcie — poziom, przy którym kupujący wcześniej bronili ceny (dołki).",
      "Opór — poziom, przy którym sprzedający zatrzymywali cenę (szczyty).",
      "Przebite wsparcie często staje się oporem (i odwrotnie).",
      "Okrągłe poziomy (100, 98, 110) przyciągają cenę, ale nie są magiczne — w silnym trendzie pękają.",
      "Opór testowany wiele razy w końcu pęka albo mocno odrzuca cenę.",
      "Fałszywe wybicie: cena przebija poziom i szybko wraca. Częste wieczorem i w piątki.",
    ],
    takeaway: "Handlujesz przy poziomach, nie między nimi.",
  },
  {
    slug: "trend",
    title: "Trend i timeframe’y",
    lead: "Analizę zaczynasz od wyższego interwału, wejścia szukasz na niższym.",
    points: [
      "Kolejność: H4 → H1 → wejście na M30.",
      "Trend wzrostowy: coraz wyższe szczyty i dołki. Spadkowy: coraz niższe.",
      "W silnym trendzie graj z trendem, nie czekaj na jego odwrócenie.",
      "Gra pod trend = mniejszy cel, ciaśniejszy stop i tylko przy bardzo wyraźnym sygnale.",
      "Konsolidacja (wąski przedział) zwykle kończy się mocniejszym ruchem — czekasz na wybicie.",
      "W silnym trendzie cofnięcia często nie przychodzą — ruch może uciec i trzeba się z tym pogodzić.",
    ],
    takeaway: "Trend na H4/H1 mówi, w którą stronę wolno Ci szukać wejścia.",
  },
  {
    slug: "plan",
    title: "Plan transakcji krok po kroku",
    lead: "Powtarzalna procedura zamiast improwizacji.",
    points: [
      "1. Sprawdź H4/H1: jaki jest trend?",
      "2. Wyznacz kluczowe poziomy (wsparcie, opór).",
      "3. Napisz scenariusze: kiedy long, kiedy short, kiedy nic.",
      "4. Ustaw alerty cenowe (na cenę Sell) na poziomach.",
      "5. Po alercie poczekaj na zamknięcie świecy M30.",
      "6. Sprawdź: czy świeca zamknęła się za poziomem, ale nie za daleko?",
      "7. Ustaw wolumen 0,01, SL i TP od razu.",
      "8. Sprawdź relację zysku do ryzyka (min. ~1,3 : 1).",
      "9. Otwórz pozycję.",
      "10. Przy połowie drogi do TP przesuń SL na cenę wejścia.",
      "11. Zamknij przed ważnymi wydarzeniami, przed nocą i przed weekendem.",
    ],
    takeaway: "Między poziomami nie wchodzisz. Brak transakcji to też dobra decyzja.",
  },
  {
    slug: "alerty",
    title: "Alerty cenowe i zlecenia oczekujące",
    lead: "Alert to powiadomienie, nie transakcja.",
    points: [
      "Ustawiaj alerty na cenę sprzedaży (Sell) — wtedy zgadzają się z wykresem.",
      "Alert zwykle działa jednorazowo: po uruchomieniu ustaw go ponownie.",
      "Po alercie nie wchodzisz od razu — czekasz na zamknięcie świecy.",
      "Zlecenie oczekujące (Buy/Sell Stop, Limit) uruchomi się na samym knocie, bez czekania na zamknięcie świecy.",
      "Zlecenia oczekujące są dobre, gdy nie możesz pilnować wykresu, ale ryzyko fałszywego wybicia jest większe.",
    ],
    takeaway: "Alert budzi uwagę, decyzję podejmuje świeca.",
  },
  {
    slug: "wiadomosci",
    title: "Wiadomości i kalendarz",
    lead: "Ropa reaguje na geopolitykę mocniej niż na wykres.",
    points: [
      "Geopolityka: Iran, cieśnina Ormuz, Huti, Arabia Saudyjska — nagłówek potrafi zmienić cenę o kilka dolarów w kilka minut.",
      "Przykład: 04.11 spadek o 10% w jeden dzień na nadziejach na porozumienie pokojowe.",
      "Ważne dane: zapasy ropy w USA (EIA) w środy 16:30, inflacja PCE, PKB, NFP (pierwszy piątek miesiąca, 14:30), decyzje Fed/EBC, OPEC+.",
      "Ok. 15–30 minut przed i po ważnych danych nie otwierasz nowych pozycji (szerszy spread, poślizgi).",
      "Otwarcie Londynu 9:00, otwarcie Wall Street 15:30 (14:30 przed zmianą czasu w USA).",
    ],
    takeaway: "Przed danymi i po nich — ręce z dala od przycisku.",
  },
  {
    slug: "ryzyko-czasowe",
    title: "Ryzyko czasowe",
    lead: "Czas trzymania pozycji też jest ryzykiem.",
    points: [
      "Nie trzymasz pozycji na noc i na weekend — luka cenowa może przeskoczyć stop.",
      "Wieczorem płynność spada, a fałszywe wybicia są częstsze.",
      "W piątek po ~16:00 lepiej nie otwierać nowych pozycji.",
      "Pilnuj baterii i połączenia — nie zostawiaj pozycji, jeśli nie możesz nią zarządzać.",
    ],
    takeaway: "Jeśli nie możesz pilnować pozycji, nie otwieraj jej.",
  },
  {
    slug: "psychologia",
    title: "Psychologia",
    lead: "Największy przeciwnik siedzi przy tym samym biurku.",
    points: [
      "Strata boli bardziej niż cieszy taki sam zysk — kusi szybkie zamykanie zysków i trzymanie strat.",
      "Wcześniejsze zamknięcie ma wynikać z wykresu lub planu, nie z kwoty na ekranie.",
      "Przykład: pewne +16 zł teraz vs +40 zł (TP) albo +2 zł (SL). Trzymanie się opłaca, gdy szansa na TP jest większa niż ~37%.",
      "Nie odgrywaj się po stracie — strata po stracie to najgorsza seria.",
      "Częściowe zamknięcie: bierzesz część zysku i zostawiasz resztę do TP.",
      "Przegapiona okazja to nie strata — rynek daje okazje codziennie.",
      "Dobry wynik nie oznacza, że ryzyko było małe.",
    ],
    takeaway: "Decyzje podejmuje plan, nie emocje i nie kwota na ekranie.",
  },
  {
    slug: "matematyka",
    title: "Matematyka zysku do ryzyka",
    lead: "Jaki procent wygranych musisz mieć, żeby wyjść na zero.",
    points: [
      "Wzór: minimalny % wygranych = SL / (SL + TP).",
      "0,8 : 1 → ~56%.   1 : 1 → 50%.   1,3 : 1 → ~43%.",
      "1,5 : 1 → 40%.   2 : 1 → ~33%.",
      "Im lepsza relacja, tym mniej trafności potrzebujesz — ale TP musi być realistyczny.",
    ],
    takeaway: "Relacja 1,5 : 1 pozwala przegrywać więcej niż połowę transakcji i nadal nie tracić.",
  },
];

export const BREAK_EVEN_TABLE: Array<{ rr: string; ratio: number; winPct: string }> = [
  { rr: "0,8 : 1", ratio: 0.8, winPct: "~56%" },
  { rr: "1 : 1", ratio: 1, winPct: "50%" },
  { rr: "1,3 : 1", ratio: 1.3, winPct: "~43%" },
  { rr: "1,5 : 1", ratio: 1.5, winPct: "40%" },
  { rr: "2 : 1", ratio: 2, winPct: "~33%" },
];

// ---------------------------------------------------------------- Quiz ------

export interface QuizQuestion {
  id: string;
  lesson: string; // slug lekcji
  question: string;
  options: string[];
  /** Indeks poprawnej odpowiedzi. */
  answer: number;
  explanation: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    lesson: "podstawy",
    question: "Którą cenę pokazuje wykres w XTB?",
    options: ["Buy (ask)", "Sell (bid)", "Średnią z Buy i Sell", "Cenę zamknięcia z poprzedniego dnia"],
    answer: 1,
    explanation: "Wykres pokazuje cenę Sell. Buy jest wyższe o spread.",
  },
  {
    id: "q2",
    lesson: "podstawy",
    question: "Otwierasz short. Po jakiej cenie zostanie zamknięty (TP)?",
    options: ["Sell", "Buy", "Po środku spreadu", "Po cenie otwarcia"],
    answer: 1,
    explanation: "Short zamyka się kupnem, czyli po cenie Buy. TP zadziała więc, gdy wykres zejdzie o spread niżej.",
  },
  {
    id: "q3",
    lesson: "podstawy",
    question: "Cena kontraktu grudniowego z newsów różni się od ceny w aplikacji. Dlaczego?",
    options: [
      "XTB celowo zawyża cenę",
      "CFD został zrolowany na kolejny kontrakt (styczniowy)",
      "To błąd w danych",
      "Różnica wynika z podatku",
    ],
    answer: 1,
    explanation: "CFD przechodzi na kolejną serię futures (rolowanie), więc ceny dwóch kontraktów się różnią.",
  },
  {
    id: "q4",
    lesson: "wolumen-i-ryzyko",
    question: "Ile PLN zmienia się wynik 0,01 lota OIL przy ruchu ceny o 1 USD?",
    options: ["ok. 4 PLN", "ok. 40 PLN", "ok. 400 PLN", "ok. 1 PLN"],
    answer: 1,
    explanation: "0,01 lota ≈ 10 baryłek ≈ ok. 40 PLN na każdy 1 USD ruchu.",
  },
  {
    id: "q5",
    lesson: "wolumen-i-ryzyko",
    question: "Kapitał 1600 PLN, ryzyko 2%. Ile maksymalnie możesz stracić na jednej transakcji?",
    options: ["8 PLN", "32 PLN", "160 PLN", "320 PLN"],
    answer: 1,
    explanation: "2% z 1600 PLN = 32 PLN.",
  },
  {
    id: "q6",
    lesson: "wolumen-i-ryzyko",
    question: "Jaka jest właściwa kolejność?",
    options: [
      "Najpierw wolumen, potem SL",
      "Najpierw SL z wykresu, potem wolumen dobrany do limitu ryzyka",
      "Najpierw TP, potem reszta wedle uczucia",
      "Kolejność nie ma znaczenia",
    ],
    answer: 1,
    explanation: "Najpierw stop z wykresu, dopiero potem wolumen, żeby strata na SL mieściła się w limicie.",
  },
  {
    id: "q7",
    lesson: "wolumen-i-ryzyko",
    question: "Masz serię trzech zysków. Co jest najgroźniejszą pokusą?",
    options: [
      "Zrobienie przerwy",
      "Zwiększenie wolumenu",
      "Spisanie wniosków",
      "Zmniejszenie wolumenu",
    ],
    answer: 1,
    explanation: "Po dobrej serii kusi większy wolumen — jedna strata potrafi wtedy zjeść zysk z kilku transakcji.",
  },
  {
    id: "q8",
    lesson: "sl-i-tp",
    question: "Kiedy ustawiasz SL i TP?",
    options: [
      "Gdy pozycja jest już na plusie",
      "Od razu, przy otwieraniu pozycji",
      "Dopiero gdy cena zacznie iść pod prąd",
      "Nie trzeba, pilnuję wykresu",
    ],
    answer: 1,
    explanation: "SL i TP ustawiasz od razu — nie po fakcie.",
  },
  {
    id: "q9",
    lesson: "sl-i-tp",
    question: "Gdzie logicznie stawia się SL?",
    options: [
      "Dokładnie na poziomie wejścia",
      "Za poziomem wsparcia/oporu albo za knotem, z zapasem na szum",
      "Tak blisko, żeby strata była symboliczna",
      "Tam, gdzie wychodzi okrągła kwota w PLN",
    ],
    answer: 1,
    explanation: "SL ma stać w miejscu, w którym scenariusz przestaje być prawdziwy — za poziomem lub knotem.",
  },
  {
    id: "q10",
    lesson: "sl-i-tp",
    question: "Kiedy przesunąć SL na cenę wejścia (break even)?",
    options: [
      "Zaraz po otwarciu pozycji",
      "Gdy cena przejdzie ok. połowę drogi do TP",
      "Tylko gdy pozycja jest na minusie",
      "Nigdy",
    ],
    answer: 1,
    explanation: "Przy ok. połowie drogi do TP. Wcześniej szum rynku zwykle wybija taki stop.",
  },
  {
    id: "q11",
    lesson: "sl-i-tp",
    question: "Jaka minimalna relacja TP : SL jest rozsądna?",
    options: ["0,5 : 1", "0,8 : 1", "ok. 1,3 : 1", "Nie ma znaczenia"],
    answer: 2,
    explanation: "Minimum ok. 1,3 : 1, najlepiej 1,5–2 : 1.",
  },
  {
    id: "q12",
    lesson: "matematyka",
    question: "Relacja 1 : 1. Ile procent transakcji musisz wygrać, żeby wyjść na zero?",
    options: ["33%", "40%", "50%", "70%"],
    answer: 2,
    explanation: "SL / (SL + TP) = 1 / 2 = 50%.",
  },
  {
    id: "q13",
    lesson: "matematyka",
    question: "Relacja 2 : 1. Ile % wygranych daje zero?",
    options: ["~33%", "50%", "~43%", "~56%"],
    answer: 0,
    explanation: "SL / (SL + TP) = 1 / 3 ≈ 33%.",
  },
  {
    id: "q14",
    lesson: "swiece",
    question: "Świeca M30 „9:30” — kiedy się zamyka?",
    options: ["o 9:30", "o 10:00", "o 10:30", "o 9:45"],
    answer: 1,
    explanation: "Trwa 30 minut, więc zamyka się o 10:00.",
  },
  {
    id: "q15",
    lesson: "swiece",
    question: "Długi górny knot przy oporze zwykle oznacza…",
    options: [
      "Kupujący przejęli kontrolę",
      "Sprzedający odepchnęli cenę (sygnał spadkowy)",
      "Rynek jest zamknięty",
      "Nic, to szum",
    ],
    answer: 1,
    explanation: "Cena doszła wysoko i została odepchnięta — sprzedający obronili opór.",
  },
  {
    id: "q16",
    lesson: "swiece",
    question: "Świeca zamknęła się 1,2 USD za poziomem wybicia. Co robisz?",
    options: [
      "Wchodzę od razu, żeby nie uciekło",
      "Nie gonię ceny — czekam na cofnięcie",
      "Podwajam wolumen",
      "Wchodzę w przeciwną stronę bez planu",
    ],
    answer: 1,
    explanation: "Reguła: nie wchodzisz, gdy świeca zamknęła się ponad ~0,3 USD za poziomem.",
  },
  {
    id: "q17",
    lesson: "poziomy",
    question: "Co często dzieje się z przebitym wsparciem?",
    options: ["Znika na zawsze", "Staje się oporem", "Zawsze wraca jako wsparcie", "Zamienia się w trend"],
    answer: 1,
    explanation: "Przebite wsparcie często staje się oporem (i odwrotnie).",
  },
  {
    id: "q18",
    lesson: "poziomy",
    question: "Kiedy fałszywe wybicia są najczęstsze?",
    options: ["Rano po otwarciu Londynu", "Wieczorem i w piątki", "W środę o 16:30", "Zawsze tak samo"],
    answer: 1,
    explanation: "Wieczorem płynność spada, a w piątki rynek robi się nerwowy — fałszywe wybicia są częstsze.",
  },
  {
    id: "q19",
    lesson: "trend",
    question: "Od którego interwału zaczynasz analizę?",
    options: ["M1", "M30", "H4", "Nie ma znaczenia"],
    answer: 2,
    explanation: "Od wyższego interwału (H4), potem H1, wejścia szukasz na M30.",
  },
  {
    id: "q20",
    lesson: "trend",
    question: "Silny trend spadkowy. Jak grasz?",
    options: [
      "Czekam na odwrócenie i kupuję",
      "Gram z trendem",
      "Gram pod trend z dużym wolumenem",
      "Nie handluję nigdy",
    ],
    answer: 1,
    explanation: "W silnym trendzie graj z trendem. Gra pod trend to mniejszy cel, ciaśniejszy stop i bardzo wyraźny sygnał.",
  },
  {
    id: "q21",
    lesson: "alerty",
    question: "Alert cenowy właśnie zadziałał. Co dalej?",
    options: [
      "Otwieram pozycję natychmiast",
      "Czekam na zamknięcie świecy M30",
      "Ignoruję alert",
      "Podwajam alerty",
    ],
    answer: 1,
    explanation: "Alert to tylko powiadomienie — decyzję podejmujesz po zamknięciu świecy.",
  },
  {
    id: "q22",
    lesson: "alerty",
    question: "Zlecenie oczekujące (Stop/Limit) a zamknięcie świecy:",
    options: [
      "Czeka na zamknięcie świecy",
      "Uruchomi się na samym knocie, bez czekania",
      "Działa tylko w weekend",
      "Nie istnieje w XTB",
    ],
    answer: 1,
    explanation: "Zlecenie oczekujące wejdzie nawet na knocie — stąd większe ryzyko fałszywego wybicia.",
  },
  {
    id: "q23",
    lesson: "wiadomosci",
    question: "Kiedy w środy publikowane są zapasy ropy w USA (EIA)?",
    options: ["9:00", "14:30", "16:30", "22:00"],
    answer: 2,
    explanation: "Zapasy EIA wychodzą w środy o 16:30 czasu polskiego.",
  },
  {
    id: "q24",
    lesson: "wiadomosci",
    question: "Jak długo przed i po ważnych danych nie otwierasz nowych pozycji?",
    options: ["1–2 minuty", "ok. 15–30 minut", "2 godziny", "Cały dzień"],
    answer: 1,
    explanation: "Ok. 15–30 minut — spread się rozszerza i rosną poślizgi.",
  },
  {
    id: "q25",
    lesson: "ryzyko-czasowe",
    question: "Dlaczego nie trzymasz pozycji na weekend?",
    options: [
      "Bo XTB pobiera karę",
      "Bo luka cenowa może przeskoczyć stop",
      "Bo CFD wygasa w piątek",
      "Bo w weekend jest wyższy spread na wykresie",
    ],
    answer: 1,
    explanation: "Po otwarciu rynku cena może zrobić lukę i stop wykona się dużo gorzej niż zakładałeś.",
  },
  {
    id: "q26",
    lesson: "psychologia",
    question: "Masz +16 zł. TP daje +40 zł, SL daje +2 zł. Od jakiej szansy na TP opłaca się trzymać?",
    options: ["ok. 10%", "ok. 37%", "ok. 75%", "100%"],
    answer: 1,
    explanation: "Trzymanie ma wartość oczekiwaną 40p + 2(1−p). Przy +16 zł wychodzi p ≈ 37%.",
  },
  {
    id: "q27",
    lesson: "psychologia",
    question: "Po stracie masz pokusę „odegrać się”. Co robisz?",
    options: [
      "Otwieram kolejną pozycję z większym wolumenem",
      "Robię przerwę — żadnego odgrywania się",
      "Zmieniam instrument i podwajam stawkę",
      "Zdejmuję SL, żeby dać cenie szansę",
    ],
    answer: 1,
    explanation: "Strata po stracie to najgorsza seria. Przerwa jest regułą.",
  },
  {
    id: "q28",
    lesson: "plan",
    question: "Cena stoi między wsparciem a oporem, z dala od obu. Najlepsza decyzja?",
    options: ["Wejść na wyczucie", "Nic nie robić", "Otworzyć dwie pozycje naraz", "Zwiększyć wolumen"],
    answer: 1,
    explanation: "Między poziomami nie wchodzisz. Brak transakcji to też dobra decyzja.",
  },
];

// ---------------------------------------------------------- Scenariusze -----

export interface ScenarioOption {
  text: string;
  correct: boolean;
  why: string;
}

export interface Scenario {
  id: string;
  title: string;
  /** Opis sytuacji na rynku. */
  setup: string;
  question: string;
  options: ScenarioOption[];
  lesson: string; // slug lekcji do powtórki
}

export const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "Alert na oporze, świeca jeszcze trwa",
    setup:
      "OIL rośnie od rana. Alert na oporze 98,50 właśnie zadzwonił — cena Sell to 98,52. Jest 10:42, a świeca M30 „10:30” zamknie się o 11:00. Widać już długi górny knot.",
    question: "Co robisz?",
    options: [
      {
        text: "Wchodzę w long teraz, bo wybicie oporu właśnie trwa",
        correct: false,
        why: "To klasyczny błąd z 30.10 (−22,44 PLN): wejście przed zamknięciem świecy tuż pod oporem. Do 11:00 cena może wrócić.",
      },
      {
        text: "Czekam do 11:00 i oceniam, gdzie zamknęła się świeca",
        correct: true,
        why: "Alert to tylko powiadomienie. Decyzję podejmujesz po zamknięciu świecy — dopiero wtedy wiesz, czy opór pękł, czy został sam knot.",
      },
      {
        text: "Wchodzę w short, bo knot pokazuje odrzucenie",
        correct: false,
        why: "Knot w trakcie świecy może zniknąć. Bez zamknięcia świecy nie masz potwierdzenia.",
      },
    ],
    lesson: "swiece",
  },
  {
    id: "s2",
    title: "Świeca zamknęła się nad oporem",
    setup:
      "Opór 98,50. Świeca M30 zamknęła się na 98,70 (0,20 USD nad poziomem), z małym górnym knotem. H1 i H4 rosną. Spread 0,06.",
    question: "Co robisz?",
    options: [
      {
        text: "Long 0,01 lota, SL pod 98,30, TP min. 1,3× dalej niż SL",
        correct: true,
        why: "Zgodnie z trendem, świeca zamknięta za poziomem, ale nie dalej niż ~0,3 USD — wchodzisz z SL i TP od razu.",
      },
      {
        text: "Nie wchodzę — każde wybicie jest fałszywe",
        correct: false,
        why: "Fałszywe wybicia się zdarzają, ale tu masz trend, zamknięcie za poziomem i blisko poziomu. To spełnia warunki wejścia.",
      },
      {
        text: "Long 0,05 lota, bo setup jest idealny",
        correct: false,
        why: "Wolumen wynika z limitu ryzyka (max 0,02 w Twoich zasadach). Pewność setupu to nie powód do zwiększania wolumenu.",
      },
    ],
    lesson: "plan",
  },
  {
    id: "s3",
    title: "Świeca uciekła za poziom",
    setup:
      "Opór 98,50. Poprzednia świeca zamknęła się na 99,40 — prawie 1 USD powyżej poziomu — dużą zieloną świecą przy samej górze. Trend rosnący.",
    question: "Co robisz?",
    options: [
      {
        text: "Wchodzę long od razu, bo ruch ucieka",
        correct: false,
        why: "To gonienie ceny. SL musiałby być daleko albo ryzyko rośnie. Reguła: > ~0,3 USD za poziomem = nie wchodzę.",
      },
      {
        text: "Nie gonię — czekam na cofnięcie do poziomu lub nową konsolidację",
        correct: true,
        why: "Siła ruchu jest realna, ale wejście po takim ruchu ma słaby stosunek zysku do ryzyka. Przegapiona okazja to nie strata.",
      },
      {
        text: "Wchodzę short, bo cena jest za wysoko",
        correct: false,
        why: "Duża świeca zamknięta przy górze to siła kupujących, nie wyczerpanie. Short pod trend bez wyraźnego sygnału to zła gra.",
      },
    ],
    lesson: "swiece",
  },
  {
    id: "s4",
    title: "Spadek o 10% w jeden dzień",
    setup:
      "04.11: ropa spadła o 10% na nadziejach na porozumienie pokojowe. Jest wieczór, dzień wygląda na „skończony”, a Ty masz ochotę wejść short, żeby „dołączyć do ruchu”. Wolumen 0,03 lota.",
    question: "Co robisz?",
    options: [
      {
        text: "Short 0,03 — trend jest jasny",
        correct: false,
        why: "To dokładnie transakcja z dziennika: −38,25 PLN. Wejście po ruchu, za duży wolumen i po końcu dnia.",
      },
      {
        text: "Nie wchodzę. Ruch się wydarzył, wieczorem jest niska płynność",
        correct: true,
        why: "Gonienie ruchu o 10% wieczorem to zła pora i zły moment. Wiadomości bywają silniejsze niż wykres — lepiej poczekać na nowy układ.",
      },
      {
        text: "Long, bo po takim spadku musi być odbicie",
        correct: false,
        why: "„Musi być odbicie” to nadzieja, nie plan. Bez poziomu i sygnału nie ma wejścia.",
      },
    ],
    lesson: "wiadomosci",
  },
  {
    id: "s5",
    title: "SL na ten sam dzień — czy przesunąć?",
    setup:
      "Long z wejściem 97,00, SL 96,70, TP 97,60 (relacja 2 : 1). Cena doszła do 97,10 — jesteś na małym plusie. Kusi Cię przesunięcie SL na 96,95.",
    question: "Co robisz?",
    options: [
      {
        text: "Przesuwam SL na 96,95 — bezpieczniej",
        correct: false,
        why: "Za wczesne przesunięcie blisko wejścia — szum wybije stop i wyjdziesz na ~0, zamiast zarobić. Tak było 05.11 (+2,92 PLN).",
      },
      {
        text: "Czekam, aż cena dojdzie ok. 97,30 (połowa drogi do TP), wtedy SL na 97,00",
        correct: true,
        why: "Break even przy połowie drogi do TP daje pozycji oddech, a od tego momentu nie może przynieść straty.",
      },
      {
        text: "Zamykam od razu, bo +10 groszy to zysk",
        correct: false,
        why: "Zamykasz z powodu kwoty na ekranie, a nie z powodu wykresu czy planu.",
      },
    ],
    lesson: "sl-i-tp",
  },
  {
    id: "s6",
    title: "Pewne +16 zł czy TP?",
    setup:
      "Jesteś na +16 zł. TP to +40 zł, SL (po przesunięciu) to +2 zł. Wykres wciąż wygląda zdrowo, trend jest po Twojej stronie.",
    question: "Co jest właściwym podejściem?",
    options: [
      {
        text: "Zamykam, żeby nie stracić zysku",
        correct: false,
        why: "Samo „żeby nie stracić” to emocja. Liczy się, czy szansa na TP przekracza ~37%.",
      },
      {
        text: "Trzymam, jeśli oceniam szansę na TP na ponad ~37% i wykres to potwierdza",
        correct: true,
        why: "Wartość oczekiwana trzymania przekracza +16 zł, gdy p(TP) > ~37%. Dodatkowo rozważ częściowe zamknięcie.",
      },
      {
        text: "Usuwam SL, żeby cena miała więcej miejsca",
        correct: false,
        why: "Usuwanie SL to najgorszy ruch. SL jest Twoją linią obrony.",
      },
    ],
    lesson: "psychologia",
  },
  {
    id: "s7",
    title: "Dane z USA za 10 minut",
    setup:
      "Środa, 16:20. Za 10 minut zapasy ropy EIA (16:30). Cena jest dokładnie przy wsparciu, świeca właśnie dała dolny knot. Setup jest ładny.",
    question: "Co robisz?",
    options: [
      {
        text: "Wchodzę teraz, zdążę przed danymi",
        correct: false,
        why: "Dane to ruch w obie strony, szerszy spread i poślizgi. Setup „ładny” nie unieważnia reguły 15–30 minut.",
      },
      {
        text: "Czekam, aż dane miną i rynek się uspokoi, i oceniam od nowa",
        correct: true,
        why: "15–30 minut przed i po danych nie otwierasz nowych pozycji. Jeśli okazja przepadnie, rynek da następne.",
      },
      {
        text: "Wchodzę na zlecenie oczekujące z szerokim SL",
        correct: false,
        why: "Szeroki SL oznacza większą stratę albo mniejszy wolumen — a poślizgi i tak mogą przeskoczyć stop.",
      },
    ],
    lesson: "wiadomosci",
  },
  {
    id: "s8",
    title: "Piątek, 17:30",
    setup:
      "Piątek 17:30. Dobry sygnał short po pęknięciu wsparcia. Do północy rynek jeszcze działa, a w weekend będzie zamknięty.",
    question: "Co robisz?",
    options: [
      {
        text: "Short i zostawiam do poniedziałku, TP jest daleko",
        correct: false,
        why: "Weekendowa luka może przeskoczyć SL. Nie trzymasz pozycji na weekend.",
      },
      {
        text: "Nie otwieram nowych pozycji po ~16:00 w piątek",
        correct: true,
        why: "Piątkowy wieczór to niska płynność i fałszywe wybicia, a pozycji nie wolno trzymać na weekend.",
      },
      {
        text: "Short z bardzo małym TP, żeby zamknąć przed północą",
        correct: false,
        why: "Wciąż ryzykujesz w gorszych warunkach, a mały TP psuje relację zysku do ryzyka.",
      },
    ],
    lesson: "ryzyko-czasowe",
  },
  {
    id: "s9",
    title: "Wolumen po serii zysków",
    setup:
      "Masz za sobą trzy wygrane z rzędu (+54, +3, +53 PLN). Nowy sygnał jest czytelny. Kapitał ok. 1600 PLN, a SL ma 0,40 USD.",
    question: "Jaki wolumen wybierasz?",
    options: [
      {
        text: "0,05 lota — jestem w formie",
        correct: false,
        why: "0,05 lota × 0,40 USD ≈ 80 PLN ryzyka — 5% kapitału. Dobra seria to nie powód do zwiększania ryzyka.",
      },
      {
        text: "0,02 lota (strata na SL ≈ 32 PLN, czyli ~2%)",
        correct: true,
        why: "0,02 lota ≈ 80 PLN/USD × 0,40 USD = 32 PLN, czyli ~2% kapitału. Mieści się w limicie i w Twoich zasadach.",
      },
      {
        text: "0,10 lota, żeby zarobić na wszystkim naraz",
        correct: false,
        why: "To prosta droga do stop outu. Zasada: 0,01, max 0,02.",
      },
    ],
    lesson: "wolumen-i-ryzyko",
  },
  {
    id: "s10",
    title: "Wybicie z konsolidacji",
    setup:
      "Od dwóch godzin cena stoi w przedziale 96,80–97,30. Świeca M30 zamyka się na 97,45 (0,15 USD nad górą przedziału), H1 jest wzrostowy. Wcześniej doszło do dwóch odrzuceń od 97,30.",
    question: "Co robisz?",
    options: [
      {
        text: "Long 0,01–0,02 lota, SL w środku przedziału lub pod nim, TP min. 1,3 : 1",
        correct: true,
        why: "Wybicie konsolidacji po zamknięciu świecy, blisko poziomu i z trendem. Tak powstała transakcja z 05.11 (+52,67 PLN).",
      },
      {
        text: "Nic nie robię — wybicia zawsze wracają",
        correct: false,
        why: "Konsolidacja zwykle kończy się mocniejszym ruchem. Zamknięta świeca i trend podnoszą szansę, że to nie fałsz.",
      },
      {
        text: "Short na odrzucenie od oporu",
        correct: false,
        why: "Poziom pękł po zamknięciu świecy; short pod trend bez wyraźnego sygnału to słaby pomysł.",
      },
    ],
    lesson: "trend",
  },
  {
    id: "s11",
    title: "Strata, i od razu następny sygnał",
    setup:
      "Właśnie dostałeś SL (−38 PLN). Po 10 minutach pojawia się „okazja”, żeby szybko odrobić stratę. Wykres jest średni, ale 'to byłoby idealnie odrobić'.",
    question: "Co robisz?",
    options: [
      {
        text: "Wchodzę z większym wolumenem, żeby odrobić",
        correct: false,
        why: "Odgrywanie się po stracie to najgorsza seria. Większy wolumen zwielokrotnia ryzyko.",
      },
      {
        text: "Robię przerwę i wracam do planu",
        correct: true,
        why: "Po stracie przerwa — żadnego odgrywania się. Decyzje podejmuje plan, nie emocje.",
      },
      {
        text: "Wchodzę z normalnym wolumenem, bo przecież setup jest „prawie” dobry",
        correct: false,
        why: "„Prawie dobry” to nie setup. Wejście motywowane stratą jest wejściem emocjonalnym.",
      },
    ],
    lesson: "psychologia",
  },
  {
    id: "s12",
    title: "Zmiana kierunku po pęknięciu wsparcia",
    setup:
      "Byłeś w long od rana. Wsparcie 96,50 pęka: świeca M30 zamyka się na 96,25, a H1 zmienia strukturę na niższe szczyty i dołki. Twój SL jest tuż pod 96,50.",
    question: "Co robisz?",
    options: [
      {
        text: "Przesuwam SL niżej, żeby dać cenie szansę wrócić",
        correct: false,
        why: "Przesuwanie SL pod prąd to unikanie straty. Scenariusz long właśnie przestał być prawdziwy.",
      },
      {
        text: "Akceptuję SL i rozważam short po cofnięciu do przebitego wsparcia, które stało się oporem",
        correct: true,
        why: "Przebite wsparcie często staje się oporem. Zmiana kierunku po pęknięciu poziomu (06.11, +130,02 PLN) wymaga SL, TP i wolumenu jak zawsze.",
      },
      {
        text: "Short natychmiast 0,05 lota, żeby odrobić",
        correct: false,
        why: "Za duży wolumen i wejście bez poczekania na cofnięcie — to odgrywanie się, nie plan.",
      },
    ],
    lesson: "poziomy",
  },
];

// -------------------------------------------------------------- Zasady ------

export const RULES: string[] = [
  "Wolumen 0,01, maksymalnie 0,02.",
  "Ryzyko na transakcję 1–2% kapitału.",
  "SL i TP zawsze od razu.",
  "Wchodzę tylko po zamknięciu świecy M30.",
  "Nie gonię ceny (max ~0,3 USD od poziomu).",
  "Relacja zysku do ryzyka min. ~1,3 : 1.",
  "SL na wejście przy połowie drogi do TP.",
  "W silnym trendzie gram z trendem.",
  "Nic nie robię między poziomami.",
  "Nie trzymam pozycji na noc i na weekend.",
  "Nie handluję tuż przed i po ważnych danych.",
  "Po stracie przerwa — żadnego odgrywania się.",
];

/** Krótka lista kontrolna przed otwarciem pozycji (z planu transakcji). */
export const PRE_TRADE_CHECKLIST: string[] = [
  "Trend na H4/H1 jest sprawdzony",
  "Jestem przy kluczowym poziomie (nie między poziomami)",
  "Świeca M30 się zamknęła i nie uciekła > ~0,3 USD za poziom",
  "SL jest z wykresu, a wolumen dobrany do limitu ryzyka",
  "TP : SL ≥ ~1,3 : 1",
  "Nie ma ważnych danych w ciągu 15–30 minut",
  "Nie jest późny wieczór ani piątek po 16:00",
  "Nie odgrywam się po stracie",
];

// ------------------------------------------------------------- Dziennik -----

export interface JournalEntry {
  date: string;
  side: "Buy" | "Sell";
  resultPln: number;
  lesson: string;
  /** Slug powiązanej lekcji. */
  lessonSlug: string;
}

export const JOURNAL: JournalEntry[] = [
  { date: "29.10", side: "Sell", resultPln: 27.81, lesson: "SL za oporem, TP przy wsparciu — plan zadziałał", lessonSlug: "plan" },
  { date: "30.10", side: "Buy", resultPln: -22.44, lesson: "Wejście przed zamknięciem świecy, tuż pod oporem", lessonSlug: "swiece" },
  { date: "30.10", side: "Buy", resultPln: -2, lesson: "SL na wejściu uchronił przed stratą (poślizg)", lessonSlug: "sl-i-tp" },
  { date: "04.11", side: "Sell", resultPln: -38.25, lesson: "Wejście po spadku o 10%, za duży wolumen, po końcu dnia", lessonSlug: "wolumen-i-ryzyko" },
  { date: "05.11", side: "Buy", resultPln: 54.47, lesson: "Sygnał po zamknięciu świecy, wolumen 0,02", lessonSlug: "swiece" },
  { date: "05.11", side: "Sell", resultPln: 2.92, lesson: "Słabszy sygnał, SL przesunięty za blisko — wynik ~0", lessonSlug: "sl-i-tp" },
  { date: "05.11", side: "Buy", resultPln: 52.67, lesson: "Wybicie konsolidacji, zysk wzięty z rzeczowych powodów", lessonSlug: "trend" },
  { date: "06.11", side: "Sell", resultPln: 130.02, lesson: "Zmiana kierunku po pęknięciu wsparcia, SL przesunięty na plus", lessonSlug: "poziomy" },
];

export function lessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
