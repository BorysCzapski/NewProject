// ============================================================================
// lib/grammar/content/a2.ts
// Authored interactive lessons for A2 grammar topics, keyed by topic slug
// (must match grammar_topics.slug in supabase/seed/02_grammar_a2.sql).
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const A2_LESSONS: Record<string, GrammarLesson> = {
  // --------------------------------------------------------------------------
  // Past Simple
  // --------------------------------------------------------------------------
  "past-simple": [
    {
      type: "intro",
      text:
        "Past Simple to czas przeszły prosty. Używamy go, gdy mówimy o czynnościach zakończonych w przeszłości — zwykle wiemy dokładnie, kiedy się wydarzyły: yesterday, last week, two years ago, in 2010.",
    },
    {
      type: "timeline",
      title: "Kiedy? Zakończona przeszłość",
      markers: [
        {
          at: 15,
          label: "went to London (two years ago)",
          example: { en: "She went to London two years ago.", pl: "Ona pojechała do Londynu dwa lata temu." },
        },
        {
          at: 32,
          label: "played football (yesterday)",
          example: { en: "He played football yesterday.", pl: "On grał wczoraj w piłkę." },
        },
        {
          at: 40,
          label: "moved to a new flat (last month)",
          example: { en: "We moved to a new flat last month.", pl: "Przeprowadziliśmy się do nowego mieszkania w zeszłym miesiącu." },
        },
      ],
      caption:
        "Każde zdarzenie to zamknięty punkt w przeszłości — nie ma związku z teraźniejszością.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "I", role: "subject" },
            {
              text: "worked",
              role: "verb",
              note: "regularne: forma podstawowa + -ed; nieregularne mają własną 2. formę (go → went)",
            },
            { text: "in a shop", role: "object" },
            { text: "last year", role: "other", note: "określnik czasu przeszłego" },
          ],
          example: { en: "I worked in a shop last year.", pl: "W zeszłym roku pracowałem w sklepie." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "I", role: "subject" },
            { text: "didn't", role: "aux", note: "did not → operator czasu przeszłego" },
            {
              text: "watch",
              role: "verb",
              note: "po didn't czasownik wraca do formy podstawowej — bez -ed!",
            },
            { text: "the film", role: "object" },
          ],
          example: { en: "I didn't watch the film.", pl: "Nie obejrzałem tego filmu." },
        },
        {
          label: "Pytanie",
          parts: [
            {
              text: "Did",
              role: "aux",
              note: "did → operator czasu przeszłego, czasownik wraca do formy podstawowej",
            },
            { text: "you", role: "subject" },
            { text: "visit", role: "verb", note: "forma podstawowa, nie visited" },
            { text: "your grandmother?", role: "object" },
          ],
          example: { en: "Did you visit your grandmother last weekend?", pl: "Odwiedziłeś babcię w zeszły weekend?" },
        },
      ],
      caption:
        "Ta sama forma dla wszystkich osób — w Past Simple nie ma końcówki -s.",
    },
    {
      type: "table",
      title: "Najczęstsze czasowniki nieregularne",
      headers: ["Forma podstawowa", "Past Simple", "Przykład"],
      rows: [
        ["go", "went", "She went to London."],
        ["see", "saw", "I saw a great film."],
        ["have", "had", "We had a party."],
        ["be", "was / were", "I was tired. They were happy."],
      ],
      caption:
        'Uwaga: "to be" ma dwie formy — was (I, he, she, it) i were (you, we, they).',
    },
    {
      type: "examples",
      items: [
        { en: "I visited my aunt last Sunday.", pl: "Odwiedziłem ciocię w zeszłą niedzielę.", highlight: "visited" },
        { en: "She went to the cinema two days ago.", pl: "Ona poszła do kina dwa dni temu.", highlight: "went" },
        { en: "We were very happy at the party.", pl: "Byliśmy bardzo szczęśliwi na imprezie.", highlight: "were" },
        { en: "Did you see that film last night?", pl: "Widziałeś ten film wczoraj wieczorem?", highlight: "Did" },
        { en: "He didn't finish his homework.", pl: "On nie skończył pracy domowej.", highlight: "didn't finish" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Najczęstszy błąd: podwójna przeszłość. "Did she finished?" ✗ i "I didn\'t went" ✗ są niepoprawne — przeszłość pokazuje już did/didn\'t, więc czasownik główny wraca do formy podstawowej: "Did she finish?", "I didn\'t go".',
    },
    {
      type: "quiz",
      question: "Które zdanie jest poprawne?",
      options: [
        "They didn't went to school yesterday.",
        "They didn't go to school yesterday.",
        "They don't went to school yesterday.",
      ],
      correctIndex: 1,
      explanation:
        'Po "didn\'t" czasownik główny stoi w formie podstawowej: didn\'t go. Formę przeszłą (went) wyraża już samo "did".',
    },
  ],

  // --------------------------------------------------------------------------
  // Present Continuous
  // --------------------------------------------------------------------------
  "present-continuous": [
    {
      type: "intro",
      text:
        "Present Continuous to czas teraźniejszy ciągły. Opisuje czynności, które trwają właśnie teraz, w momencie mówienia — a także plany i ustalenia na najbliższą przyszłość.",
    },
    {
      type: "timeline",
      title: "Kiedy? Czynność trwa teraz",
      markers: [
        {
          at: 42,
          to: 58,
          label: "am reading (right now)",
          example: { en: "I am reading a book right now.", pl: "Właśnie teraz czytam książkę." },
        },
        {
          at: 44,
          to: 56,
          label: "is raining (now)",
          example: { en: "Look! It is raining now.", pl: "Patrz! Teraz pada deszcz." },
        },
        {
          at: 70,
          label: "are meeting (tomorrow — plan)",
          example: { en: "We are meeting our friends tomorrow.", pl: "Jutro spotykamy się z przyjaciółmi." },
        },
      ],
      caption:
        "Czynność rozciąga się wokół 'teraz' — zaczęła się przed chwilą i jeszcze się nie skończyła. Punkt w przyszłości to ustalony plan.",
    },
    {
      type: "formula",
      title: "Budowa zdania: to be + czasownik-ing",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "She", role: "subject" },
            { text: "is", role: "aux", note: "am → I, is → he/she/it, are → you/we/they" },
            { text: "cooking", role: "verb", note: "czasownik główny + końcówka -ing" },
            { text: "dinner", role: "object" },
            { text: "at the moment", role: "other", note: "typowe określenia: now, right now, at the moment, currently" },
          ],
          example: { en: "She is cooking dinner at the moment.", pl: "Ona w tej chwili gotuje obiad." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "He", role: "subject" },
            { text: "is", role: "aux" },
            { text: "not", role: "negation", note: "not po to be: isn't, aren't" },
            { text: "working", role: "verb" },
            { text: "today", role: "other" },
          ],
          example: { en: "He is not (isn't) working today.", pl: "On dzisiaj nie pracuje." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Are", role: "aux", note: "to be wskakuje przed podmiot — bez do/does!" },
            { text: "you", role: "subject" },
            { text: "listening", role: "verb" },
            { text: "to me?", role: "object" },
          ],
          example: { en: "Are you listening to me?", pl: "Słuchasz mnie?" },
        },
      ],
    },
    {
      type: "table",
      title: "Pisownia końcówki -ing",
      headers: ["Zasada", "Czasownik", "Forma -ing"],
      rows: [
        ["zwykłe dodanie -ing", "play, read", "playing, reading"],
        ["końcowe -e znika", "make, write", "making, writing"],
        ["podwajamy spółgłoskę", "run, sit", "running, sitting"],
      ],
      caption:
        "Podwajamy, gdy krótki czasownik kończy się spółgłoską po krótkiej samogłosce.",
    },
    {
      type: "examples",
      items: [
        { en: "I am writing an email right now.", pl: "Właśnie piszę e-mail.", highlight: "am writing" },
        { en: "They are playing football at the moment.", pl: "Oni w tej chwili grają w piłkę.", highlight: "are playing" },
        { en: "Is it raining outside?", pl: "Czy na zewnątrz pada?", highlight: "Is it raining" },
        { en: "We aren't studying at the moment.", pl: "W tej chwili się nie uczymy.", highlight: "aren't studying" },
      ],
    },
    {
      type: "compare",
      title: "Present Continuous vs Present Simple",
      columns: [
        {
          title: "Present Continuous",
          formula: "am/is/are + verb-ing",
          whenToUse: "Czynność chwilowa — dzieje się teraz albo jest ustalonym planem na najbliższą przyszłość.",
          examples: ["She is cooking dinner now.", "I am reading a book right now."],
        },
        {
          title: "Present Simple",
          formula: "verb (+s dla he/she/it)",
          whenToUse: "Rutyna i fakty — coś dzieje się regularnie lub jest zawsze prawdziwe.",
          examples: ["She cooks dinner every day.", "I read books in the evening."],
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Czasowniki stanu — know, like, want, believe — zwykle NIE występują w formie ciągłej, bo opisują stały stan, a nie czynność. "I am wanting coffee" ✗ → "I want coffee" ✓. Pamiętaj też, że "to be" nie może zniknąć: "I reading a book" ✗ → "I am reading a book" ✓.',
    },
    {
      type: "quiz",
      question: 'Wybierz poprawne zdanie o tym, co dzieje się TERAZ:',
      options: [
        "She cooks dinner in the kitchen now.",
        "She is cooking dinner in the kitchen now.",
        "She cooking dinner in the kitchen now.",
      ],
      correctIndex: 1,
      explanation:
        'Czynność trwająca teraz = to be + -ing: "She is cooking". Sam czasownik z -ing bez "is" to za mało, a "cooks" opisuje rutynę.',
    },
  ],

  // --------------------------------------------------------------------------
  // Going to
  // --------------------------------------------------------------------------
  "going-to": [
    {
      type: "intro",
      text:
        'Konstrukcji "be going to" używamy, gdy mówimy o planach i zamiarach, które już podjęliśmy, oraz gdy przewidujemy przyszłość na podstawie tego, co widzimy teraz: "Look at those clouds! It is going to rain."',
    },
    {
      type: "timeline",
      title: "Kiedy? Decyzja teraz, czynność w przyszłości",
      markers: [
        {
          at: 48,
          label: "decyzja / to, co widzę (teraz)",
          example: { en: "Look at those clouds!", pl: "Popatrz na te chmury!" },
        },
        {
          at: 68,
          label: "it is going to rain",
          example: { en: "It is going to rain.", pl: "Będzie padać." },
        },
        {
          at: 82,
          label: "visit my grandparents (next week)",
          example: { en: "I am going to visit my grandparents next week.", pl: "W przyszłym tygodniu odwiedzę dziadków." },
        },
      ],
      caption:
        "Plan lub sygnał istnieje już teraz — sama czynność dopiero nastąpi.",
    },
    {
      type: "formula",
      title: "Budowa: to be + going to + czasownik",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "She", role: "subject" },
            { text: "is", role: "aux", note: "am → I, is → he/she/it, are → you/we/they" },
            { text: "going to", role: "other", note: "stała część konstrukcji; potocznie 'gonna' (tylko w mowie!)" },
            { text: "study", role: "verb", note: "zawsze forma podstawowa — bez -s i bez -ing" },
            { text: "medicine", role: "object" },
          ],
          example: { en: "She is going to study medicine.", pl: "Ona zamierza studiować medycynę." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "We", role: "subject" },
            { text: "are", role: "aux" },
            { text: "not", role: "negation", note: "not po to be: aren't / isn't going to" },
            { text: "going to", role: "other" },
            { text: "buy", role: "verb" },
            { text: "a new car", role: "object" },
          ],
          example: { en: "We aren't going to buy a new car.", pl: "Nie zamierzamy kupować nowego samochodu." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Are", role: "aux", note: "to be przed podmiot — jak w każdym zdaniu z be" },
            { text: "you", role: "subject" },
            { text: "going to", role: "other" },
            { text: "travel", role: "verb" },
            { text: "this summer?", role: "object" },
          ],
          example: { en: "Are you going to travel this summer?", pl: "Zamierzasz podróżować tego lata?" },
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "I am going to start a new diet.", pl: "Zamierzam zacząć nową dietę.", highlight: "am going to start" },
        { en: "They are going to move to a new city.", pl: "Oni zamierzają przeprowadzić się do nowego miasta.", highlight: "are going to move" },
        { en: "Look at the sky! It is going to rain.", pl: "Popatrz na niebo! Będzie padać.", highlight: "is going to rain" },
        { en: "What are you going to do tonight?", pl: "Co zamierzasz robić dziś wieczorem?", highlight: "are you going to do" },
      ],
    },
    {
      type: "compare",
      title: "Going to vs Present Continuous (przyszłość)",
      columns: [
        {
          title: "be going to",
          formula: "am/is/are + going to + verb",
          whenToUse: "Podkreśla intencję i podjętą decyzję — także przewidywania na podstawie tego, co widać.",
          examples: ["I am going to start a new diet.", "It is going to rain."],
        },
        {
          title: "Present Continuous",
          formula: "am/is/are + verb-ing",
          whenToUse: "Konkretne ustalenie 'w kalendarzu' — umówiony termin, kupione bilety.",
          examples: ["We are meeting our friends tomorrow.", "I am flying to Rome on Friday."],
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Po "going to" czasownik stoi ZAWSZE w formie podstawowej: "She is going to studies" ✗, "I am going to visiting" ✗ → "She is going to study" ✓. I nie zapominaj o to be: "I going to visit" ✗ → "I am going to visit" ✓.',
    },
    {
      type: "quiz",
      question: "Uzupełnij: They ___ to buy a new house next year.",
      options: ["is going", "are going", "go"],
      correctIndex: 1,
      explanation:
        'Z "they" łączy się "are": They are going to buy... Forma to be musi pasować do podmiotu.',
    },
  ],

  // --------------------------------------------------------------------------
  // Stopniowanie przymiotników
  // --------------------------------------------------------------------------
  "comparatives-superlatives": [
    {
      type: "intro",
      text:
        "Stopniowanie przymiotników pozwala porównywać rzeczy: kto jest wyższy, co jest droższe, które miasto jest największe. Krótkie przymiotniki dostają końcówki -er / -est, dłuższe łączymy z more / the most.",
    },
    {
      type: "formula",
      title: "Dwa wzory porównań",
      variants: [
        {
          label: "Krótkie przymiotniki",
          parts: [
            { text: "My brother", role: "subject" },
            { text: "is", role: "aux" },
            { text: "taller", role: "verb", note: "przymiotnik + -er (stopień wyższy)" },
            { text: "than", role: "other", note: "than = niż — łączy dwie porównywane rzeczy" },
            { text: "me", role: "object" },
          ],
          example: { en: "My brother is taller than me.", pl: "Mój brat jest wyższy ode mnie." },
        },
        {
          label: "Długie przymiotniki",
          parts: [
            { text: "This restaurant", role: "subject" },
            { text: "is", role: "aux" },
            { text: "more expensive", role: "verb", note: "more + przymiotnik (3+ sylaby) — bez końcówki -er!" },
            { text: "than", role: "other" },
            { text: "that one", role: "object" },
          ],
          example: { en: "This restaurant is more expensive than that one.", pl: "Ta restauracja jest droższa niż tamta." },
        },
        {
          label: "Stopień najwyższy",
          parts: [
            { text: "My father", role: "subject" },
            { text: "is", role: "aux" },
            { text: "the tallest", role: "verb", note: "the + -est (krótkie) lub the most + przymiotnik (długie)" },
            { text: "in the family", role: "object", note: "najwyższy stopień często z in/of: in the world, of all" },
          ],
          example: { en: "My father is the tallest in the family.", pl: "Mój tata jest najwyższy w rodzinie." },
        },
      ],
      caption: 'Przed stopniem najwyższym zawsze stoi "the": the tallest, the most popular.',
    },
    {
      type: "table",
      title: "Zasady pisowni (krótkie przymiotniki)",
      headers: ["Zasada", "Przymiotnik", "Wyższy", "Najwyższy"],
      rows: [
        ["zwykłe -er / -est", "tall", "taller", "the tallest"],
        ["końcowe -e: tylko -r / -st", "nice", "nicer", "the nicest"],
        ["podwajamy spółgłoskę", "big", "bigger", "the biggest"],
        ["-y → -i", "happy", "happier", "the happiest"],
      ],
    },
    {
      type: "table",
      title: "Przymiotniki nieregularne",
      headers: ["Przymiotnik", "Wyższy", "Najwyższy"],
      rows: [
        ["good", "better", "the best"],
        ["bad", "worse", "the worst"],
        ["far", "farther / further", "the farthest / furthest"],
      ],
      caption: "Tych form nie da się wyprowadzić z zasad — trzeba je zapamiętać.",
    },
    {
      type: "examples",
      items: [
        { en: "This car is faster than mine.", pl: "Ten samochód jest szybszy od mojego.", highlight: "faster than" },
        { en: "Mount Everest is the highest mountain in the world.", pl: "Mount Everest to najwyższa góra na świecie.", highlight: "the highest" },
        { en: "This book is more interesting than that film.", pl: "Ta książka jest ciekawsza niż tamten film.", highlight: "more interesting than" },
        { en: "She is as tall as her sister.", pl: "Ona jest tak samo wysoka jak jej siostra.", highlight: "as tall as" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie łącz obu sposobów naraz: "more taller" ✗, "the most biggest" ✗. Wybierz jeden — końcówkę (taller) albo more/most (more expensive). Dłuższych przymiotników nie skracamy: "interestinger" ✗ → "more interesting" ✓. A żeby powiedzieć "tak samo... jak", użyj as...as: "She is as tall as her sister."',
    },
    {
      type: "quiz",
      question: 'Jak brzmi stopień wyższy od "good"?',
      options: ["gooder", "better", "more good"],
      correctIndex: 1,
      explanation:
        '"Good" jest nieregularne: good → better → the best. Formy "gooder" i "more good" nie istnieją.',
    },
  ],

  // --------------------------------------------------------------------------
  // Must / have to
  // --------------------------------------------------------------------------
  "must-have-to": [
    {
      type: "intro",
      text:
        'Zarówno "must", jak i "have to" znaczą "musieć". Różnica: must to zwykle obowiązek płynący z opinii mówiącego, a have to — z zewnętrznych zasad (szef, regulamin, prawo). Największa pułapka czeka w przeczeniach!',
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "must",
          parts: [
            { text: "You", role: "subject" },
            {
              text: "must",
              role: "aux",
              note: "czasownik modalny — jedna forma dla wszystkich osób, bez -s",
            },
            { text: "wear", role: "verb", note: "po must zawsze forma podstawowa" },
            { text: "a seatbelt", role: "object" },
          ],
          example: { en: "You must wear a seatbelt in the car.", pl: "Musisz zapinać pasy w samochodzie." },
        },
        {
          label: "have to",
          parts: [
            { text: "She", role: "subject" },
            {
              text: "has to",
              role: "aux",
              note: "odmienia się jak zwykły czasownik: have to (I/you/we/they), has to (he/she/it)",
            },
            { text: "finish", role: "verb" },
            { text: "the report", role: "object" },
          ],
          example: { en: "She has to finish the report by Friday.", pl: "Ona musi skończyć raport do piątku." },
        },
        {
          label: "Pytanie z have to",
          parts: [
            { text: "Do", role: "aux", note: "pytania z have to budujemy przez do/does — jak ze zwykłym czasownikiem" },
            { text: "you", role: "subject" },
            { text: "have to", role: "other" },
            { text: "work", role: "verb" },
            { text: "tomorrow?", role: "object" },
          ],
          example: { en: "Do you have to work tomorrow?", pl: "Musisz jutro pracować?" },
        },
      ],
    },
    {
      type: "compare",
      title: "must vs have to",
      columns: [
        {
          title: "must",
          formula: "must + verb (bez odmiany)",
          whenToUse: "Obowiązek z opinii mówiącego — sam uważam, że to konieczne. Głównie czas teraźniejszy.",
          examples: ["I must call my mother today.", "You must wear a seatbelt."],
        },
        {
          title: "have to",
          formula: "have/has to + verb",
          whenToUse: "Obowiązek narzucony z zewnątrz — zasady, szef, grafik. Naturalne też w przeszłości i przyszłości.",
          examples: ["I have to work on Saturday.", "I had to study hard for the exam."],
        },
      ],
    },
    {
      type: "compare",
      title: "Przeczenia — tu znaczenia się rozchodzą!",
      columns: [
        {
          title: "mustn't = ZAKAZ",
          formula: "mustn't + verb",
          whenToUse: "Czegoś nie wolno robić — to jest zabronione.",
          examples: ["You mustn't smoke here.", "You mustn't park here."],
        },
        {
          title: "don't have to = BRAK OBOWIĄZKU",
          formula: "don't/doesn't have to + verb",
          whenToUse: "Nie musisz — możesz, ale nie ma takiego obowiązku.",
          examples: ["You don't have to come if you are busy.", "We don't have to pay — it's free."],
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "You must wear a helmet when you ride a bike.", pl: "Musisz nosić kask, gdy jeździsz na rowerze.", highlight: "must wear" },
        { en: "She has to finish the report today.", pl: "Ona musi dziś skończyć raport.", highlight: "has to" },
        { en: "You mustn't tell anyone this secret.", pl: "Nie wolno ci nikomu zdradzić tego sekretu.", highlight: "mustn't" },
        { en: "We don't have to pay for the tickets, they are free.", pl: "Nie musimy płacić za bilety, są darmowe.", highlight: "don't have to" },
        { en: "We will have to leave early.", pl: "Będziemy musieli wyjść wcześnie.", highlight: "will have to" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Po polsku "nie musisz" i "nie wolno ci" to dwa różne zakazy — po angielsku też! "You mustn\'t park here" = zakaz (nie wolno). "You don\'t have to park here" = brak obowiązku (możesz, ale nie musisz). Pomylenie ich całkiem zmienia sens zdania. I pamiętaj: "She must works" ✗, "She musts" ✗ → "She must work" ✓.',
    },
    {
      type: "quiz",
      question: 'Wstęp na koncert jest darmowy. Co powiesz koledze?',
      options: [
        "You mustn't pay for the ticket.",
        "You don't have to pay for the ticket.",
        "You must pay for the ticket.",
      ],
      correctIndex: 1,
      explanation:
        '"Don\'t have to" = nie ma obowiązku (bilet jest darmowy). "Mustn\'t" oznaczałoby, że płacenie jest zabronione — a to co innego.',
    },
  ],
};
