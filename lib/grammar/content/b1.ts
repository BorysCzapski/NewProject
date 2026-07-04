// ============================================================================
// lib/grammar/content/b1.ts
// Authored interactive lessons for B1 grammar topics, keyed by topic slug
// (must match grammar_topics.slug in supabase/seed/02_grammar_b1.sql).
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const B1_LESSONS: Record<string, GrammarLesson> = {
  "present-perfect": [
    {
      type: "intro",
      text:
        "Present Perfect łączy przeszłość z teraźniejszością: coś wydarzyło się kiedyś (nie mówimy dokładnie kiedy), ale skutek jest ważny TERAZ. Budujemy go z have/has + trzecia forma czasownika (Past Participle).",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "She", role: "subject" },
            { text: "has", role: "aux", note: "has dla he/she/it, have dla pozostałych osób" },
            { text: "visited", role: "verb", note: "Past Participle: regularne +ed, nieregularne 3. forma (go → gone, see → seen)" },
            { text: "Paris three times", role: "object" },
          ],
          example: { en: "She has visited Paris three times.", pl: "Ona była w Paryżu trzy razy." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "He", role: "subject" },
            { text: "has", role: "aux" },
            { text: "not", role: "negation", note: "hasn't / haven't w mowie" },
            { text: "finished", role: "verb" },
            { text: "the project yet", role: "object", note: "yet — 'jeszcze', zwykle na końcu przeczeń i pytań" },
          ],
          example: { en: "He hasn't finished the project yet.", pl: "On jeszcze nie skończył projektu." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Have", role: "aux", note: "have/has wskakuje przed podmiot" },
            { text: "you", role: "subject" },
            { text: "ever", role: "other", note: "ever — 'kiedykolwiek', typowe w pytaniach o doświadczenia" },
            { text: "tried", role: "verb" },
            { text: "sushi?", role: "object" },
          ],
          example: { en: "Have you ever tried sushi?", pl: "Czy kiedykolwiek próbowałeś/aś sushi?" },
        },
      ],
    },
    {
      type: "timeline",
      title: "Present Perfect vs Past Simple",
      caption:
        "Past Simple to zamknięty punkt w przeszłości (wiemy kiedy). Present Perfect to most z przeszłości do teraz — liczy się skutek lub trwanie do dziś.",
      markers: [
        {
          at: 15,
          label: "Past Simple — konkretny moment",
          example: { en: "I went to London last year.", pl: "Pojechałem do Londynu w zeszłym roku. (wiadomo kiedy)" },
        },
        {
          at: 20,
          to: 50,
          label: "Present Perfect — od przeszłości do teraz",
          example: { en: "I have lived here for five years.", pl: "Mieszkam tu od pięciu lat. (i nadal mieszkam)" },
        },
        {
          at: 45,
          label: "Present Perfect — skutek teraz",
          example: { en: "I have lost my keys.", pl: "Zgubiłem klucze. (ważne: teraz ich nie mam)" },
        },
      ],
    },
    {
      type: "table",
      title: "Typowe słowa-sygnały",
      headers: ["Słowo", "Znaczenie", "Przykład"],
      rows: [
        ["just", "właśnie, przed chwilą", "I have just finished my dinner."],
        ["already", "już (wcześniej niż się spodziewano)", "She has already sent the email."],
        ["yet", "jeszcze / już (pytania i przeczenia)", "Have you done your homework yet?"],
        ["ever / never", "kiedykolwiek / nigdy", "Have you ever been to Japan?"],
        ["for + okres", "od (jak długo)", "I have lived here for five years."],
        ["since + moment", "od (od kiedy)", "I have lived here since 2019."],
      ],
    },
    {
      type: "examples",
      items: [
        { en: "I have already finished my homework.", pl: "Już skończyłem pracę domową.", highlight: "have already finished" },
        { en: "She has never been to Australia.", pl: "Ona nigdy nie była w Australii.", highlight: "has never been" },
        { en: "They have lived in this city since 2015.", pl: "Mieszkają w tym mieście od 2015 roku.", highlight: "since 2015" },
        { en: "We haven't finished the project yet.", pl: "Jeszcze nie skończyliśmy projektu.", highlight: "haven't finished" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie kalkuj z polskiego "od trzech lat" jako "since 3 years" ✗. Z okresem czasu używamy for: "for 3 years" ✓, a since tylko z konkretnym momentem: "since 2022", "since Monday". I pamiętaj: gdy podajesz datę (yesterday, in 2010, last week), Present Perfect jest zakazany — użyj Past Simple.',
    },
    {
      type: "quiz",
      question: "Które zdanie jest poprawne?",
      options: [
        "I have seen this film yesterday.",
        "I have seen this film.",
        "I have see this film.",
      ],
      correctIndex: 1,
      explanation:
        'Present Perfect nie łączy się z określeniami konkretnego czasu ("yesterday" wymaga Past Simple: I saw this film yesterday), a po have/has musi stać trzecia forma: seen, nie see.',
    },
  ],

  "first-conditional": [
    {
      type: "intro",
      text:
        "First Conditional opisuje realne, prawdopodobne sytuacje w przyszłości i ich konsekwencje: jeśli coś się stanie, to coś z tego wyniknie. To konstrukcja, której użyjesz codziennie — plany, pogoda, decyzje.",
    },
    {
      type: "formula",
      title: "If + Present Simple, will + czasownik",
      variants: [
        {
          label: "Zdanie warunkowe (if)",
          parts: [
            { text: "If", role: "other", note: "jeśli — wprowadza warunek" },
            { text: "it", role: "subject" },
            { text: "rains", role: "verb", note: "Present Simple — NIGDY will po if!" },
            { text: ",", role: "other", note: "przecinek tylko, gdy if stoi na początku" },
          ],
          example: { en: "If it rains, ...", pl: "Jeśli będzie padać, ..." },
        },
        {
          label: "Zdanie wynikowe",
          parts: [
            { text: "I", role: "subject" },
            { text: "will", role: "aux", note: "zamiast will może być can/may/might albo tryb rozkazujący" },
            { text: "stay", role: "verb", note: "forma podstawowa czasownika" },
            { text: "at home", role: "object" },
          ],
          example: { en: "If it rains, I will stay at home.", pl: "Jeśli będzie padać, zostanę w domu." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "What", role: "qword" },
            { text: "will", role: "aux" },
            { text: "you", role: "subject" },
            { text: "do", role: "verb" },
            { text: "if you miss the train?", role: "object", note: "część z if zostaje w Present Simple" },
          ],
          example: { en: "What will you do if you miss the train?", pl: "Co zrobisz, jeśli spóźnisz się na pociąg?" },
        },
      ],
      caption:
        'Kolejność można odwrócić: "I will stay at home if it rains." — wtedy bez przecinka.',
    },
    {
      type: "examples",
      items: [
        { en: "If you study hard, you can pass the exam.", pl: "Jeśli będziesz się pilnie uczyć, możesz zdać egzamin.", highlight: "can pass" },
        { en: "If you see him, tell him to call me.", pl: "Jeśli go zobaczysz, powiedz mu, żeby do mnie zadzwonił.", highlight: "tell" },
        { en: "If she doesn't hurry, she will be late.", pl: "Jeśli się nie pospieszy, spóźni się.", highlight: "doesn't hurry" },
        { en: "If you don't study, you won't pass the exam.", pl: "Jeśli nie będziesz się uczyć, nie zdasz egzaminu.", highlight: "won't pass" },
      ],
    },
    {
      type: "compare",
      title: "First vs Second Conditional",
      columns: [
        {
          title: "First Conditional — realne",
          formula: "If + Present Simple, will + czasownik",
          whenToUse: "Prawdopodobne sytuacje w przyszłości, które naprawdę mogą się zdarzyć.",
          examples: [
            "If I win the lottery, I will buy a house.",
            "If I finish work early, I will call you.",
          ],
        },
        {
          title: "Second Conditional — hipotetyczne",
          formula: "If + Past Simple, would + czasownik",
          whenToUse: "Sytuacje wyimaginowane, mało prawdopodobne — marzenia i gdybanie.",
          examples: [
            "If I won the lottery, I would buy a house.",
            "If I had more time, I would travel more.",
          ],
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Najczęstszy błąd: "If I will have time..." ✗. Po if NIGDY nie stawiamy will, chociaż mówimy o przyszłości — poprawnie: "If I have time, I will call you." ✓. Will należy wyłącznie do zdania wynikowego.',
    },
    {
      type: "quiz",
      question: "Uzupełnij: If it ___ tomorrow, we will cancel the picnic.",
      options: ["will rain", "rains", "rained"],
      correctIndex: 1,
      explanation:
        "Po if w First Conditional używamy Present Simple (rains), nawet gdy mówimy o jutrze. Will pojawia się tylko w drugiej części: we will cancel.",
    },
  ],

  "second-conditional": [
    {
      type: "intro",
      text:
        "Second Conditional to gdybanie: sytuacje hipotetyczne, nierealne lub mało prawdopodobne w teraźniejszości albo przyszłości. Po if stoi czas przeszły, ale zdanie NIE mówi o przeszłości — to wyobrażenie.",
    },
    {
      type: "formula",
      title: "If + Past Simple, would + czasownik",
      variants: [
        {
          label: "Zdanie warunkowe (if)",
          parts: [
            { text: "If", role: "other" },
            { text: "I", role: "subject" },
            { text: "had", role: "verb", note: "Past Simple — ale znaczenie teraźniejsze/przyszłe, nie przeszłe!" },
            { text: "more money", role: "object" },
          ],
          example: { en: "If I had more money, ...", pl: "Gdybym miał więcej pieniędzy, ..." },
        },
        {
          label: "Zdanie wynikowe",
          parts: [
            { text: "I", role: "subject" },
            { text: "would", role: "aux", note: "zamiast would: could (możliwość) lub might (mniejsza pewność)" },
            { text: "buy", role: "verb", note: "forma podstawowa" },
            { text: "a new car", role: "object" },
          ],
          example: { en: "If I had more money, I would buy a new car.", pl: "Gdybym miał więcej pieniędzy, kupiłbym nowy samochód." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "What", role: "qword" },
            { text: "would", role: "aux" },
            { text: "you", role: "subject" },
            { text: "do", role: "verb" },
            { text: "if you found a wallet?", role: "object", note: "found — Past Simple od find" },
          ],
          example: { en: "What would you do if you found a wallet on the street?", pl: "Co byś zrobił, gdybyś znalazł portfel na ulicy?" },
        },
      ],
      caption:
        'Z "to be" po if używamy were dla wszystkich osób: "If I were you, I would apologize." — klasyczna konstrukcja do dawania rad.',
    },
    {
      type: "examples",
      items: [
        { en: "If I were you, I would talk to her.", pl: "Na twoim miejscu porozmawiałbym z nią.", highlight: "If I were you" },
        { en: "If I had more time, I could learn another language.", pl: "Gdybym miał więcej czasu, mógłbym nauczyć się kolejnego języka.", highlight: "could learn" },
        { en: "If she didn't work so much, she would have more free time.", pl: "Gdyby tyle nie pracowała, miałaby więcej wolnego czasu.", highlight: "didn't work" },
        { en: "If it weren't so cold, I wouldn't wear a jacket.", pl: "Gdyby nie było tak zimno, nie nosiłbym kurtki.", highlight: "wouldn't wear" },
      ],
    },
    {
      type: "compare",
      title: "Realne czy wyimaginowane?",
      columns: [
        {
          title: "First Conditional",
          formula: "If + Present Simple, will + czasownik",
          whenToUse: "Mówisz o czymś, co realnie może się wydarzyć — traktujesz warunek poważnie.",
          examples: [
            "If I win the lottery, I will buy a house. (gram i wierzę w szansę)",
          ],
        },
        {
          title: "Second Conditional",
          formula: "If + Past Simple, would + czasownik",
          whenToUse: "Fantazjujesz, gdybasz, dajesz radę — warunek jest mało realny albo czysto teoretyczny.",
          examples: [
            "If I won the lottery, I would buy a house. (marzenie)",
          ],
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie wstawiaj would do części z if: "If I would have money..." ✗. Would mieszka tylko w zdaniu wynikowym: "If I had money, I would travel." ✓. I pamiętaj o were zamiast was po if: "If I were you..." brzmi najlepiej.',
    },
    {
      type: "quiz",
      question: "Uzupełnij: What would you do if you ___ a ghost?",
      options: ["see", "saw", "would see"],
      correctIndex: 1,
      explanation:
        "W Second Conditional po if stoi Past Simple: saw. Would zostaje w drugiej części zdania (would you do), nigdy po if.",
    },
  ],

  "passive-voice-basics": [
    {
      type: "intro",
      text:
        "Strony biernej (Passive Voice) używamy, gdy ważniejsze jest, CO się stało z rzeczą lub osobą, a nie KTO to zrobił — albo gdy wykonawca jest nieznany lub nieistotny. Bardzo częsta w wiadomościach i języku formalnym.",
    },
    {
      type: "formula",
      title: "Przekształcenie: strona czynna → bierna",
      variants: [
        {
          label: "Strona czynna",
          parts: [
            { text: "John", role: "subject", note: "wykonawca jest podmiotem" },
            { text: "wrote", role: "verb" },
            { text: "the letter", role: "object", note: "dopełnienie — to ono stanie się podmiotem strony biernej" },
          ],
          example: { en: "John wrote the letter.", pl: "John napisał list." },
        },
        {
          label: "Strona bierna",
          parts: [
            { text: "The letter", role: "subject", note: "dawne dopełnienie wskakuje na początek" },
            { text: "was", role: "aux", note: "to be w czasie zdania wyjściowego (tu: Past Simple)" },
            { text: "written", role: "verb", note: "zawsze Past Participle (3. forma)" },
            { text: "by John", role: "object", note: "by + wykonawca — tylko jeśli warto go podać" },
          ],
          example: { en: "The letter was written by John.", pl: "List został napisany przez Johna." },
        },
        {
          label: "Pytanie i przeczenie",
          parts: [
            { text: "Was", role: "aux", note: "w pytaniu to be przed podmiot" },
            { text: "this book", role: "subject" },
            { text: "written", role: "verb" },
            { text: "by Shakespeare?", role: "object" },
          ],
          example: { en: "Was this book written by Shakespeare? / The email wasn't sent on time.", pl: "Czy tę książkę napisał Szekspir? / E-mail nie został wysłany na czas." },
        },
      ],
      caption:
        "Tylko czasowniki przechodnie (mające dopełnienie) tworzą stronę bierną — potrzebujemy przedmiotu, który stanie się nowym podmiotem.",
    },
    {
      type: "table",
      title: "Forma to be zależy od czasu",
      headers: ["Czas", "Konstrukcja", "Przykład"],
      rows: [
        ["Present Simple", "is/are + Past Participle", "The house is cleaned every week."],
        ["Past Simple", "was/were + Past Participle", "The house was cleaned yesterday."],
        ["Present Continuous", "is/are being + Past Participle", "The car is being repaired right now."],
      ],
      caption: "Patrz na czas zdania wyjściowego i dobierz do niego formę to be — Past Participle się nie zmienia.",
    },
    {
      type: "examples",
      items: [
        { en: "My phone was stolen.", pl: "Ukradziono mi telefon. (nie wiemy kto)", highlight: "was stolen" },
        { en: "English is spoken all over the world.", pl: "Po angielsku mówi się na całym świecie.", highlight: "is spoken" },
        { en: "The bridge was built in 1990.", pl: "Most zbudowano w 1990 roku.", highlight: "was built" },
        { en: "Millions of dollars are spent on advertising every year.", pl: "Co roku wydaje się miliony dolarów na reklamę.", highlight: "are spent" },
        { en: "This song was written by a famous composer.", pl: "Tę piosenkę napisał znany kompozytor.", highlight: "by a famous composer" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Polskie "zbudowano", "ukradziono" nie mają podmiotu, więc kusi kalka "It built in 1990" ✗. Po angielsku strona bierna ZAWSZE wymaga to be: "It was built in 1990" ✓. Bez was/were/is zdanie jest błędne.',
    },
    {
      type: "quiz",
      question: 'Wybierz poprawną stronę bierną dla: "They clean the office every day."',
      options: [
        "The office cleans every day.",
        "The office is cleaned every day.",
        "The office was cleaned every day.",
      ],
      correctIndex: 1,
      explanation:
        "Zdanie wyjściowe jest w Present Simple, więc bierzemy is + Past Participle: is cleaned. Was cleaned to Past Simple, a wersja bez to be w ogóle nie jest stroną bierną.",
    },
  ],

  "reported-speech-basics": [
    {
      type: "intro",
      text:
        'Mowa zależna (Reported Speech) służy do przekazywania czyichś słów "z drugiej ręki", bez cytowania. Ponieważ raportujemy coś powiedzianego wcześniej, cofamy czas o jeden stopień i dopasowujemy zaimki oraz określenia czasu.',
    },
    {
      type: "formula",
      title: "Przekształcenie: mowa niezależna → zależna",
      variants: [
        {
          label: "Zdanie twierdzące",
          parts: [
            { text: "She said (that)", role: "other", note: "that można pominąć; tell wymaga osoby: told me" },
            { text: "she", role: "subject", note: "I → she — zaimek z perspektywy raportującego" },
            { text: "liked", role: "verb", note: "like → liked — czas cofa się o stopień" },
            { text: "coffee", role: "object" },
          ],
          example: { en: '"I like coffee." → She said (that) she liked coffee.', pl: "„Lubię kawę.” → Powiedziała, że lubi kawę." },
        },
        {
          label: "Pytanie ogólne",
          parts: [
            { text: "He asked me", role: "other" },
            { text: "if", role: "other", note: "if/whether wprowadza pytanie tak/nie" },
            { text: "I", role: "subject" },
            { text: "was tired", role: "verb", note: "szyk zdania twierdzącego — bez inwersji!" },
          ],
          example: { en: '"Are you tired?" → He asked me if I was tired.', pl: "„Jesteś zmęczony?” → Zapytał mnie, czy jestem zmęczony." },
        },
        {
          label: "Pytanie szczegółowe",
          parts: [
            { text: "She asked me", role: "other" },
            { text: "where", role: "qword", note: "słowo pytające zostaje" },
            { text: "I", role: "subject" },
            { text: "lived", role: "verb", note: "bez do/did — zwykły szyk twierdzący" },
          ],
          example: { en: '"Where do you live?" → She asked me where I lived.', pl: "„Gdzie mieszkasz?” → Zapytała mnie, gdzie mieszkam." },
        },
      ],
    },
    {
      type: "table",
      title: "Cofanie czasów",
      headers: ["Mowa niezależna", "Mowa zależna", "Przykład"],
      rows: [
        ["Present Simple", "Past Simple", '"I like coffee." → She said she liked coffee.'],
        ["Present Continuous", "Past Continuous", '"I am working." → He said he was working.'],
        ["Present Perfect", "Past Perfect", '"I have finished." → She said she had finished.'],
        ["Past Simple", "Past Perfect", '"I visited Paris." → He said he had visited Paris.'],
        ["will", "would", '"I will help you." → She said she would help me.'],
        ["can", "could", '"I can swim." → She said she could swim.'],
        ["must", "had to", '"I must go." → He said he had to go.'],
      ],
    },
    {
      type: "table",
      title: "Zmiany zaimków oraz określeń czasu i miejsca",
      headers: ["Bezpośrednio", "W mowie zależnej"],
      rows: [
        ["I / my", "he, she / his, her"],
        ["today", "that day"],
        ["tomorrow", "the next day"],
        ["here", "there"],
        ["this", "that"],
      ],
      caption: '"I will call you tomorrow." → She said she would call me the next day.',
    },
    {
      type: "examples",
      items: [
        { en: 'He said, "I am learning English." → He said he was learning English.', pl: "Powiedział, że uczy się angielskiego.", highlight: "was learning" },
        { en: '"I love my job." → He said he loved his job.', pl: "Powiedział, że kocha swoją pracę.", highlight: "he loved his" },
        { en: '"I have finished my homework." → She said she had finished her homework.', pl: "Powiedziała, że skończyła pracę domową.", highlight: "had finished" },
        { en: '"I can swim very well." → She said she could swim very well.', pl: "Powiedziała, że umie bardzo dobrze pływać.", highlight: "could" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Dwa częste błędy: 1) "He told that..." ✗ — tell zawsze wymaga osoby: "He told ME that..." ✓, a say odwrotnie: "He said that..." (bez me). 2) W pytaniach zależnych nie ma inwersji ani do/did: "She asked where did I live" ✗ → "She asked where I lived" ✓.',
    },
    {
      type: "quiz",
      question: 'Przekształć: "Where do you live?" → He asked me ___',
      options: ["where do I live.", "where I lived.", "where did I live."],
      correctIndex: 1,
      explanation:
        "Pytanie zależne traci szyk pytający: bez do/did, zwykła kolejność podmiot + czasownik, a czas cofa się o stopień (live → lived): He asked me where I lived.",
    },
  ],
};
