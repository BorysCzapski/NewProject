// ============================================================================
// lib/grammar/content/a1.ts
// Authored interactive lessons for A1 grammar topics, keyed by topic slug
// (must match grammar_topics.slug in supabase/seed/02_grammar_a1.sql).
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const A1_LESSONS: Record<string, GrammarLesson> = {
  "to-be": [
    {
      type: "intro",
      text:
        'Czasownik "to be" znaczy "być" i jest najważniejszym czasownikiem w angielskim — pojawia się niemal w każdym zdaniu. W czasie teraźniejszym ma tylko trzy formy: am, is, are.',
    },
    {
      type: "table",
      title: "Formy to be",
      headers: ["Osoba", "Forma", "Skrót", "Przykład"],
      rows: [
        ["I", "am", "I'm", "I'm a student."],
        ["you / we / they", "are", "you're / we're / they're", "They're happy."],
        ["he / she / it", "is", "he's / she's / it's", "She's my sister."],
      ],
      caption: "Formy skrócone brzmią naturalniej w mowie — używaj ich śmiało.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "I", role: "subject", note: "podmiot — kto?" },
            { text: "am", role: "verb", note: "forma to be dopasowana do osoby" },
            { text: "a student", role: "object" },
          ],
          example: { en: "I am a student.", pl: "Jestem uczniem." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "She", role: "subject" },
            { text: "is", role: "verb" },
            { text: "not", role: "negation", note: "not stawiamy ZA formą to be: isn't, aren't" },
            { text: "at home", role: "object" },
          ],
          example: { en: "She is not (isn't) at home.", pl: "Jej nie ma w domu." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Are", role: "verb", note: "w pytaniu to be wskakuje PRZED podmiot" },
            { text: "you", role: "subject" },
            { text: "ready?", role: "object" },
          ],
          example: { en: "Are you ready?", pl: "Jesteś gotowy/gotowa?" },
        },
      ],
      caption: "Zamiana miejscami podmiotu i to be wystarczy, żeby zadać pytanie — bez do/does!",
    },
    {
      type: "examples",
      items: [
        { en: "I am twelve years old.", pl: "Mam dwanaście lat.", highlight: "am" },
        { en: "They are from Poland.", pl: "Oni są z Polski.", highlight: "are" },
        { en: "It is cold today.", pl: "Dzisiaj jest zimno.", highlight: "is" },
        { en: "We aren't tired.", pl: "Nie jesteśmy zmęczeni.", highlight: "aren't" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Po polsku mówimy "Mam 12 lat", ale po angielsku wiek wyrażamy przez to be: "I am 12", nigdy "I have 12". W angielskim "być" nigdy nie znika ze zdania.',
    },
    {
      type: "quiz",
      question: "Które zdanie jest poprawne?",
      options: ["She are my friend.", "She is my friend.", "She am my friend."],
      correctIndex: 1,
      explanation: 'Z he/she/it zawsze łączymy formę "is": She is my friend.',
    },
  ],
  "present-simple": [
    {
      type: "intro",
      text:
        "Present Simple to czas teraźniejszy prosty. Używamy go, gdy mówimy o nawykach, rutynie i faktach — o rzeczach, które dzieją się zawsze albo regularnie, a nie tylko w tej chwili.",
    },
    {
      type: "timeline",
      title: "Kiedy używamy Present Simple?",
      markers: [
        {
          at: 0,
          to: 100,
          label: "Fakt / stała sytuacja",
          example: { en: "She works in a bank.", pl: "Ona pracuje w banku." },
        },
        { at: 15, label: "nawyk" },
        {
          at: 50,
          label: "nawyk",
          example: {
            en: "I play tennis every Sunday.",
            pl: "Gram w tenisa w każdą niedzielę.",
          },
        },
        { at: 85, label: "nawyk" },
      ],
      caption:
        "Czynność powtarza się w przeszłości, teraz i w przyszłości — dlatego kropki rozsypane są po całej osi.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "She", role: "subject", note: "he/she/it → czasownik dostaje -s" },
            { text: "works", role: "verb", note: "work + s — końcówka tylko dla 3. osoby l.poj." },
            { text: "in a bank", role: "object" },
          ],
          example: { en: "She works in a bank.", pl: "Ona pracuje w banku." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "He", role: "subject" },
            { text: "doesn't", role: "aux", note: "does not → doesn't; dla I/you/we/they: don't" },
            { text: "like", role: "verb", note: "po does czasownik wraca do formy podstawowej — bez -s!" },
            { text: "coffee", role: "object" },
          ],
          example: { en: "He doesn't like coffee.", pl: "On nie lubi kawy." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Does", role: "aux", note: "do/does zawsze zaczyna pytanie; does dla he/she/it" },
            { text: "she", role: "subject" },
            { text: "like", role: "verb", note: "forma podstawowa — -s już siedzi w does" },
            { text: "pizza?", role: "object" },
          ],
          example: { en: "Does she like pizza?", pl: "Czy ona lubi pizzę?" },
        },
      ],
    },
    {
      type: "table",
      title: "Końcówka w 3. osobie (he/she/it)",
      headers: ["Czasownik kończy się na", "Zmiana", "Przykład"],
      rows: [
        ["większość czasowników", "+ s", "work → works"],
        ["-o, -ch, -sh, -x, -s", "+ es", "go → goes, watch → watches"],
        ["spółgłoska + y", "y → ies", "study → studies"],
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "I always brush my teeth before bed.",
          pl: "Zawsze myję zęby przed snem.",
          highlight: "always",
        },
        {
          en: "We live in Warsaw.",
          pl: "Mieszkamy w Warszawie.",
          highlight: "live",
        },
        {
          en: "My brother watches TV every evening.",
          pl: "Mój brat ogląda telewizję co wieczór.",
          highlight: "watches",
        },
        {
          en: "The train leaves at six o'clock.",
          pl: "Pociąg odjeżdża o szóstej.",
          highlight: "leaves",
        },
        {
          en: "They don't like fast food.",
          pl: "Oni nie lubią fast foodów.",
          highlight: "don't like",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Najczęstszy błąd to gubienie -s: "She work" zamiast "She works". Drugi: podwajanie końcówki w pytaniu — "Does she likes?" jest źle, bo -s przejęło już "does". Poprawnie: "Does she like?".',
    },
    {
      type: "quiz",
      question: "Które pytanie jest poprawne?",
      options: [
        "Does she likes pizza?",
        "Do she like pizza?",
        "Does she like pizza?",
      ],
      correctIndex: 2,
      explanation:
        'Dla he/she/it pytanie zaczynamy od "does", a czasownik główny zostaje w formie podstawowej: Does she like pizza?',
    },
  ],
  "articles-a-an-the": [
    {
      type: "intro",
      text:
        'Przedimki "a", "an" i "the" to krótkie słówka przed rzeczownikami. Po polsku ich nie ma, ale po angielsku pokazują, czy mówimy o czymś ogólnym ("jakiś"), czy o czymś konkretnym ("ten właśnie").',
    },
    {
      type: "compare",
      title: "a/an czy the?",
      columns: [
        {
          title: "a / an",
          formula: "a/an + rzeczownik policzalny (l.poj.)",
          whenToUse:
            'Coś ogólnego, "jakiś, jakaś" — wspominamy o tym po raz pierwszy albo nie jest to konkretna rzecz.',
          examples: [
            "I have a dog.",
            "She is eating an apple.",
            "There is a cat in the garden.",
          ],
        },
        {
          title: "the",
          formula: "the + rzeczownik (każdy)",
          whenToUse:
            "Coś konkretnego: znanego rozmówcy, wspomnianego wcześniej albo jedynego w swoim rodzaju (the sun, the moon).",
          examples: [
            "The cat in the garden is very friendly.",
            "Can you close the door, please?",
            "The moon is bright tonight.",
          ],
        },
      ],
    },
    {
      type: "table",
      title: "a czy an? Decyduje pierwszy DŹWIĘK",
      headers: ["Rzeczownik zaczyna się od", "Przedimek", "Przykład"],
      rows: [
        ["dźwięku spółgłoski", "a", "a dog, a university (brzmi: ju-)"],
        ["dźwięku samogłoski (a, e, i, o, u)", "an", "an apple, an elephant"],
        ["niemego h", "an", "an hour (h jest nieme)"],
      ],
      caption:
        "Liczy się wymowa, nie pisownia — dlatego an hour, ale a university.",
    },
    {
      type: "examples",
      items: [
        {
          en: "I saw an elephant at the zoo.",
          pl: "Widziałem słonia w zoo.",
          highlight: "an elephant",
        },
        {
          en: "She wants to be a doctor.",
          pl: "Ona chce zostać lekarką.",
          highlight: "a doctor",
        },
        {
          en: "We need an umbrella, it is raining.",
          pl: "Potrzebujemy parasola, pada deszcz.",
          highlight: "an umbrella",
        },
        {
          en: "There is a cat in the garden. The cat is very friendly.",
          pl: "W ogrodzie jest (jakiś) kot. Ten kot jest bardzo przyjazny.",
          highlight: "The cat",
        },
      ],
    },
    {
      type: "tip",
      variant: "tip",
      text:
        'Gdy mówimy o czymś ogólnie w liczbie mnogiej albo o rzeczach niepoliczalnych, nie dajemy żadnego przedimka: "I like music.", "Dogs are loyal animals." — nie "the music", "the dogs".',
    },
    {
      type: "quiz",
      question: "I saw ___ elephant at the zoo.",
      options: ["a", "an", "the"],
      correctIndex: 1,
      explanation:
        '"Elephant" zaczyna się od dźwięku samogłoski (e), więc potrzebujemy "an": an elephant.',
    },
  ],
  "plural-nouns": [
    {
      type: "intro",
      text:
        "Liczbę mnogą po angielsku najczęściej tworzymy, dodając -s: one book → two books. Jest jednak kilka końcówek specjalnych i grupa słów nieregularnych, które trzeba zapamiętać.",
    },
    {
      type: "table",
      title: "Zasady regularne",
      headers: ["Rzeczownik kończy się na", "Zmiana", "Przykład"],
      rows: [
        ["większość rzeczowników", "+ s", "dog → dogs"],
        ["-s, -ss, -sh, -ch, -x, -z", "+ es", "box → boxes"],
        ["spółgłoska + y", "y → ies", "city → cities"],
        ["samogłoska + y", "+ s", "boy → boys"],
        ["-f / -fe", "→ ves", "leaf → leaves, knife → knives"],
        ["-o", "często + es", "potato → potatoes (ale: photos)"],
      ],
    },
    {
      type: "table",
      title: "Formy nieregularne — do zapamiętania",
      headers: ["Liczba pojedyncza", "Liczba mnoga"],
      rows: [
        ["child", "children"],
        ["man", "men"],
        ["woman", "women"],
        ["mouse", "mice"],
        ["sheep / fish", "sheep / fish (bez zmian)"],
      ],
      caption: "Tych form nie da się wydedukować z reguły — trzeba je znać na pamięć.",
    },
    {
      type: "examples",
      items: [
        {
          en: "There are three children in the park.",
          pl: "W parku jest troje dzieci.",
          highlight: "children",
        },
        {
          en: "There are five boxes in the room.",
          pl: "W pokoju jest pięć pudełek.",
          highlight: "boxes",
        },
        {
          en: "I visited two big cities.",
          pl: "Odwiedziłem dwa duże miasta.",
          highlight: "cities",
        },
        {
          en: "These are leaves.",
          pl: "To są liście.",
          highlight: "leaves",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie dodawaj -s do form nieregularnych: "childs", "mans" ani "childrens" nie istnieją. Pamiętaj też, że z liczbą mnogą zmienia się reszta zdania: "This is a leaf." → "These are leaves."',
    },
    {
      type: "quiz",
      question: 'Jak brzmi liczba mnoga od "child"?',
      options: ["childs", "children", "childes"],
      correctIndex: 1,
      explanation:
        '"Child" jest rzeczownikiem nieregularnym — jego liczba mnoga to "children", bez końcówki -s.',
    },
  ],
  "can-cant": [
    {
      type: "intro",
      text:
        '"Can" znaczy "umieć, móc". Mówimy nim o umiejętnościach i możliwościach oraz prosimy o pozwolenie. Jest bardzo wygodny: ma jedną formę dla wszystkich osób.',
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "She", role: "subject" },
            { text: "can", role: "aux", note: "jedna forma dla wszystkich osób — nigdy 'cans'" },
            { text: "swim", role: "verb", note: "forma podstawowa, bez 'to' — nie 'can to swim'" },
            { text: "very well", role: "object" },
          ],
          example: { en: "She can swim very well.", pl: "Ona umie bardzo dobrze pływać." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "I", role: "subject" },
            { text: "can't", role: "negation", note: "cannot → can't; piszemy razem: cannot" },
            { text: "speak", role: "verb" },
            { text: "Chinese", role: "object" },
          ],
          example: { en: "I can't speak Chinese.", pl: "Nie umiem mówić po chińsku." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Can", role: "aux", note: "can wskakuje przed podmiot — bez do/does!" },
            { text: "you", role: "subject" },
            { text: "help", role: "verb" },
            { text: "me, please?", role: "object" },
          ],
          example: { en: "Can you help me, please?", pl: "Czy możesz mi pomóc?" },
        },
      ],
      caption: '"Can" to czasownik modalny — sam tworzy pytania i przeczenia, bez pomocy do/does.',
    },
    {
      type: "table",
      title: "Do czego służy can?",
      headers: ["Użycie", "Przykład", "Tłumaczenie"],
      rows: [
        ["umiejętność", "He can play the guitar.", "On umie grać na gitarze."],
        ["prośba / pozwolenie", "Can I open the window?", "Czy mogę otworzyć okno?"],
        ["możliwość", "It can be very cold in winter.", "Zimą potrafi być bardzo zimno."],
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "I can swim, but I can't ski.",
          pl: "Umiem pływać, ale nie umiem jeździć na nartach.",
          highlight: "can't ski",
        },
        {
          en: "My cat can open doors!",
          pl: "Mój kot umie otwierać drzwi!",
          highlight: "can open",
        },
        {
          en: "Can I borrow your pen, please?",
          pl: "Czy mogę pożyczyć twój długopis?",
          highlight: "Can I",
        },
        {
          en: "When I was young, I could run very fast.",
          pl: "Kiedy byłem młody, umiałem bardzo szybko biegać.",
          highlight: "could",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Trzy pułapki: nie mów "She cans" (can nie dostaje -s), nie mów "can to play" (po can czasownik bez "to") i nie zaczynaj pytania od "Do you can...?" — poprawnie jest "Can you...?".',
    },
    {
      type: "quiz",
      question: "___ you play the piano?",
      options: ["Do", "Can", "Are"],
      correctIndex: 1,
      explanation:
        'Pytamy o umiejętność, więc używamy "can". Jako czasownik modalny sam zaczyna pytanie: Can you play the piano?',
    },
  ],
};
