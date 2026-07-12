// ============================================================================
// lib/grammar/content/ru-a1.ts
// Authored interactive lessons for Russian A1 grammar topics, keyed by topic
// slug (must match grammar_topics.slug in supabase/seed/ru_02_grammar_a1.sql).
// Convention: the `en` field holds the TARGET language (Russian, Cyrillic),
// the `pl` field holds the Polish translation / simplified pronunciation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const RU_A1_LESSONS: Record<string, GrammarLesson> = {
  "ru-alfabet": [
    {
      type: "intro",
      text:
        "Rosyjski zapisujemy cyrylicą (кириллица) — alfabetem z 33 liter. Część liter wygląda i brzmi jak polskie (А, К, М, О, Т), część to pułapki: wyglądają znajomo, ale czyta się je zupełnie inaczej. Do tego dochodzi garść liter całkiem nowych. Dobra wiadomość: to zamknięta lista — kilka dni czytania na głos i alfabet jest Twój.",
    },
    {
      type: "table",
      title: "Fałszywi przyjaciele — wyglądają znajomo, brzmią inaczej",
      headers: ["Litera", "Czytamy jak", "Przykład"],
      rows: [
        ["В в", "w", "вода [wada] — woda"],
        ["Н н", "n", "нос [nos] — nos"],
        ["Р р", "r", "рука [ruka] — ręka"],
        ["С с", "s", "сок [sok] — sok"],
        ["У у", "u", "утро [utra] — poranek"],
        ["Х х", "ch", "хлеб [chlep] — chleb"],
        ["Е е", "je (zmiękcza spółgłoskę)", "нет [niet] — nie"],
      ],
      caption:
        "To najczęstsze źródło błędów na starcie: rosyjskie В to polskie „w”, a nie „b”!",
    },
    {
      type: "table",
      title: "Litery, których nie ma w polskim alfabecie",
      headers: ["Litera", "Czytamy jak", "Przykład"],
      rows: [
        ["Ж ж", "ż", "журнал [żurnał] — czasopismo"],
        ["Ш ш", "sz", "школа [szkoła] — szkoła"],
        ["Щ щ", "szcz (miękkie)", "борщ [borszcz] — barszcz"],
        ["Ч ч", "cz (miękkie)", "чай [czaj] — herbata"],
        ["Ц ц", "c", "цирк [cyrk] — cyrk"],
        ["Ы ы", "y", "сын [syn] — syn"],
        ["Э э", "e", "это [eta] — to"],
        ["Ю ю", "ju", "юг [juk] — południe"],
        ["Я я", "ja", "яблоко [jabłaka] — jabłko"],
        ["Ё ё", "jo — ZAWSZE akcentowane", "ёлка [jołka] — choinka"],
        ["Й й", "j", "мой [moj] — mój"],
        ["Ь ь", "brak dźwięku — zmiękcza poprzednią spółgłoskę", "день [dień] — dzień"],
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "Это Москва.",
          pl: "To jest Moskwa. (eta Maskwa)",
          highlight: "Москва",
        },
        {
          en: "Меня зовут Анна.",
          pl: "Nazywam się Anna. (mienia zawut Anna)",
          highlight: "зовут",
        },
        {
          en: "Я говорю по-русски.",
          pl: "Mówię po rosyjsku. (ja gawariu pa-russki)",
          highlight: "говорю",
        },
        {
          en: "Молоко и хлеб, пожалуйста.",
          pl: "Mleko i chleb, poproszę. (małako i chlep, pażałusta)",
          highlight: "Молоко",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "W rosyjskim rządzi akcent (ударение): nieakcentowane „о” brzmi jak „a” — to tzw. akanie. Dlatego молоко czytamy [małako], a хорошо — [charaszo]. Nie czytaj każdego „о” jak po polsku! Pocieszenie: litera ё zawsze niesie akcent, więc z nią nie ma zgadywania.",
    },
    {
      type: "quiz",
      question: "Która litera cyrylicy odpowiada polskiemu dźwiękowi „w”?",
      options: ["В", "Б", "У", "Н"],
      correctIndex: 0,
      explanation:
        "В czytamy jak polskie „w”: вода = woda. Б to „b”, У to „u”, a Н to „n” — klasyczne pułapki cyrylicy.",
    },
    {
      type: "quiz",
      question:
        "Jak najczęściej brzmi nieakcentowane „о”, np. w słowie „молоко”?",
      options: ["jak o", "jak a", "jak u"],
      correctIndex: 1,
      explanation:
        "To akanie: nieakcentowane „о” wymawiamy jak „a”, dlatego молоко brzmi mniej więcej [małako].",
    },
  ],
  "ru-rodzaj": [
    {
      type: "intro",
      text:
        "Rosyjskie rzeczowniki — tak jak polskie — mają rodzaj: męski, żeński albo nijaki. Najczęściej rozpoznasz go po końcówce w mianowniku (kto? co?). Rodzaj jest ważny od pierwszej lekcji, bo decyduje o formie „mój” (мой/моя/моё), przymiotników i czasowników w czasie przeszłym.",
    },
    {
      type: "table",
      title: "Rodzaj po końcówce",
      headers: ["Rodzaj", "Typowa końcówka", "Przykłady"],
      rows: [
        ["męski (он)", "spółgłoska", "стол (stół), дом (dom), брат (brat)"],
        ["żeński (она)", "-а / -я", "мама (mama), книга (książka), Россия (Rosja)"],
        ["nijaki (оно)", "-о / -е", "окно (okno), слово (słowo), море (morze)"],
        [
          "męski LUB żeński",
          "-ь (miękki znak)",
          "день (dzień — m.), ночь (noc — ż.)",
        ],
      ],
      caption:
        "Słowa na -ь nie zdradzają rodzaju końcówką — ucz się ich od razu z rodzajem.",
    },
    {
      type: "formula",
      title: "мой / моя / моё — dopasuj do rodzaju",
      variants: [
        {
          label: "Rodzaj męski",
          parts: [
            { text: "Это", role: "subject", note: "это = „to (jest)” — nigdy się nie odmienia" },
            { text: "мой", role: "other", note: "мой — przy rzeczownikach męskich" },
            { text: "дом", role: "object", note: "kończy się na spółgłoskę → rodzaj męski" },
          ],
          example: { en: "Это мой дом.", pl: "To jest mój dom." },
        },
        {
          label: "Rodzaj żeński",
          parts: [
            { text: "Это", role: "subject" },
            { text: "моя", role: "other", note: "моя — przy rzeczownikach żeńskich" },
            { text: "книга", role: "object", note: "końcówka -а → rodzaj żeński" },
          ],
          example: { en: "Это моя книга.", pl: "To jest moja książka." },
        },
        {
          label: "Rodzaj nijaki",
          parts: [
            { text: "Это", role: "subject" },
            { text: "моё", role: "other", note: "моё [majo] — ё zawsze akcentowane" },
            { text: "окно", role: "object", note: "końcówka -о → rodzaj nijaki" },
          ],
          example: { en: "Это моё окно.", pl: "To jest moje okno." },
        },
      ],
      caption: "Zmienia się tylko „mój” — rzeczownik zostaje w mianowniku.",
    },
    {
      type: "examples",
      items: [
        { en: "Это мой дом.", pl: "To jest mój dom.", highlight: "мой" },
        { en: "Это моя книга.", pl: "To jest moja książka.", highlight: "моя" },
        { en: "Это моё окно.", pl: "To jest moje okno.", highlight: "моё" },
        {
          en: "Мой брат — студент.",
          pl: "Mój brat jest studentem.",
          highlight: "Мой",
        },
        {
          en: "Моя мама дома.",
          pl: "Moja mama jest w domu.",
          highlight: "Моя",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Rodzaj po rosyjsku nie zawsze pokrywa się z polskim! Zwłaszcza słowa na -ь potrafią zaskoczyć: медаль (medal) i цель (cel) są po rosyjsku ŻEŃSKIE, choć po polsku to rodzaj męski. Zapamiętuj takie słowa parami: день — он, ночь — она.",
    },
    {
      type: "quiz",
      question: "Jakiego rodzaju jest słowo „окно” (okno)?",
      options: ["męskiego", "żeńskiego", "nijakiego"],
      correctIndex: 2,
      explanation:
        "Końcówka -о to znak rodzaju nijakiego: окно, слово, молоко. Dlatego mówimy „моё окно”.",
    },
    {
      type: "quiz",
      question: "Это ___ книга. — którą formę wstawisz?",
      options: ["мой", "моя", "моё"],
      correctIndex: 1,
      explanation:
        "Книга kończy się na -а, więc jest rodzaju żeńskiego — pasuje forma моя: Это моя книга.",
    },
  ],
  "ru-zaimki-osobowe": [
    {
      type: "intro",
      text:
        "Zaimki osobowe zastępują osoby i rzeczy, o których mówimy. Po rosyjsku jest ich osiem: я, ты, он, она, оно, мы, вы, они. To absolutna podstawa — w odróżnieniu od polskiego zaimka w roli podmiotu zwykle się NIE opuszcza.",
    },
    {
      type: "table",
      title: "Osiem zaimków — do zapamiętania",
      headers: ["Zaimek", "Po polsku", "Uwagi / wymowa"],
      rows: [
        ["я", "ja", "[ja]"],
        ["ты", "ty", "do osób, które dobrze znamy"],
        ["он", "on", "zastępuje rzeczowniki męskie: стол → он"],
        ["она", "ona", "[ana] — rzeczowniki żeńskie: книга → она"],
        ["оно", "ono", "[ano] — rzeczowniki nijakie: окно → оно"],
        ["мы", "my", "[my]"],
        ["вы", "wy / Pan, Pani", "grzecznościowo do jednej osoby i zawsze do wielu"],
        ["они", "oni / one", "[ani] — jedna forma dla wszystkich rodzajów"],
      ],
    },
    {
      type: "formula",
      title: "Zaimek w zdaniu",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            {
              text: "Я",
              role: "subject",
              note: "zaimka nie opuszczamy — inaczej niż po polsku",
            },
            {
              text: "студент",
              role: "object",
              note: "w czasie teraźniejszym nie ma „jestem” — samo Я студент",
            },
          ],
          example: { en: "Я студент.", pl: "Jestem studentem." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Ты", role: "subject" },
            {
              text: "дома?",
              role: "object",
              note: "pytanie tworzy sama intonacja — szyk się nie zmienia",
            },
          ],
          example: { en: "Ты дома?", pl: "Jesteś w domu?" },
        },
        {
          label: "Grzecznościowo",
          parts: [
            {
              text: "Вы",
              role: "subject",
              note: "вы do jednej osoby = Pan/Pani; czasownik zawsze w liczbie mnogiej",
            },
            { text: "говорите", role: "verb" },
            { text: "по-русски?", role: "object" },
          ],
          example: {
            en: "Вы говорите по-русски?",
            pl: "Czy mówi Pan/Pani po rosyjsku?",
          },
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "Я студент.", pl: "Jestem studentem.", highlight: "Я" },
        { en: "Ты дома?", pl: "Jesteś w domu?", highlight: "Ты" },
        {
          en: "Он врач, а она учительница.",
          pl: "On jest lekarzem, a ona nauczycielką.",
          highlight: "она",
        },
        {
          en: "Мы говорим по-русски.",
          pl: "Mówimy po rosyjsku.",
          highlight: "Мы",
        },
        {
          en: "Они дома.",
          pl: "Oni są w domu. (ani dama)",
          highlight: "Они",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Po polsku mówimy „Mówię po rosyjsku” — bez zaimka. Po rosyjsku zaimek zostaje: Я говорю по-русски. Zdanie „Говорю по-русски” bez я brzmi dla Rosjanina nienaturalnie.",
    },
    {
      type: "tip",
      variant: "tip",
      text:
        "Они to jedna forma dla polskiego „oni” i „one” — rosyjski nie rozróżnia tu rodzaju. Za to pamiętaj o rodzaju przy он/она/оно: „stół” to он, „książka” to она, „okno” to оно.",
    },
    {
      type: "quiz",
      question: "Jakim zaimkiem zastąpisz słowo „книга” (książka)?",
      options: ["он", "она", "оно"],
      correctIndex: 1,
      explanation:
        "Книга kończy się na -а, jest rodzaju żeńskiego, więc zastępuje ją она: Книга здесь. → Она здесь.",
    },
    {
      type: "quiz",
      question:
        "Jak grzecznie zapytasz jedną starszą osobę, czy mówi po rosyjsku?",
      options: [
        "Ты говоришь по-русски?",
        "Вы говорите по-русски?",
        "Они говорят по-русски?",
      ],
      correctIndex: 1,
      explanation:
        "Forma grzecznościowa (jak polskie Pan/Pani) to вы + czasownik w liczbie mnogiej: Вы говорите по-русски?",
    },
  ],
  "ru-czas-terazniejszy": [
    {
      type: "intro",
      text:
        "Czas teraźniejszy opisuje to, co dzieje się teraz albo zwykle. Rosyjskie czasowniki odmieniają się przez osoby: do tematu dokleja się końcówki według jednej z dwóch koniugacji. I jeszcze jedna wielka różnica: w czasie teraźniejszym rosyjski w ogóle nie używa czasownika „być”.",
    },
    {
      type: "timeline",
      title: "Kiedy używamy czasu teraźniejszego?",
      markers: [
        {
          at: 0,
          to: 100,
          label: "stała sytuacja / nawyk",
          example: { en: "Мы живём в Москве.", pl: "Mieszkamy w Moskwie." },
        },
        {
          at: 50,
          label: "teraz, w tej chwili",
          example: { en: "Я читаю книгу.", pl: "(Właśnie) czytam książkę." },
        },
      ],
      caption:
        "Jedna forma obsługuje i „teraz”, i „zwykle” — rosyjski nie rozdziela tego jak angielski Present Simple i Continuous.",
    },
    {
      type: "table",
      title: "Dwie koniugacje — wzorce odmiany",
      headers: ["Osoba", "читать (czytać) — I koniugacja", "говорить (mówić) — II koniugacja"],
      rows: [
        ["я (ja)", "читаю", "говорю"],
        ["ты (ty)", "читаешь", "говоришь"],
        ["он / она (on / ona)", "читает", "говорит"],
        ["мы (my)", "читаем", "говорим"],
        ["вы (wy / Pan, Pani)", "читаете", "говорите"],
        ["они (oni / one)", "читают", "говорят"],
      ],
      caption:
        "Końcówka zawsze zdradza osobę — dlatego ucz się odmiany na głos, całymi kolumnami.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "Я", role: "subject" },
            {
              text: "читаю",
              role: "verb",
              note: "temat чита- + końcówka -ю (1. osoba l.poj.)",
            },
            { text: "книгу", role: "object" },
          ],
          example: { en: "Я читаю книгу.", pl: "Czytam książkę." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Я", role: "subject" },
            {
              text: "не",
              role: "negation",
              note: "не stawiamy tuż przed czasownikiem",
            },
            { text: "читаю", role: "verb" },
            { text: "газеты", role: "object" },
          ],
          example: { en: "Я не читаю газеты.", pl: "Nie czytam gazet." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Ты", role: "subject" },
            {
              text: "говоришь",
              role: "verb",
              note: "szyk bez zmian — pytanie tworzy intonacja",
            },
            { text: "по-русски?", role: "object" },
          ],
          example: { en: "Ты говоришь по-русски?", pl: "Mówisz po rosyjsku?" },
        },
      ],
      caption:
        "Żadnych operatorów w stylu do/does — przeczenie robi не, a pytanie sama intonacja.",
    },
    {
      type: "examples",
      items: [
        { en: "Я читаю книгу.", pl: "Czytam książkę.", highlight: "читаю" },
        {
          en: "Ты говоришь по-русски?",
          pl: "Mówisz po rosyjsku?",
          highlight: "говоришь",
        },
        {
          en: "Мы живём в Москве.",
          pl: "Mieszkamy w Moskwie. (my żywiom w Maskwie)",
          highlight: "живём",
        },
        {
          en: "Он работает дома.",
          pl: "On pracuje w domu.",
          highlight: "работает",
        },
        {
          en: "Они читают журналы.",
          pl: "Oni czytają czasopisma.",
          highlight: "читают",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "W czasie teraźniejszym „być” znika: Я студент (jestem studentem), Это дом (to jest dom). Zdania typu „Я есть студент” to kalka, której Rosjanie nie używają — brak czasownika jest tu w pełni poprawny.",
    },
    {
      type: "quiz",
      question: "Мы ___ в Москве. — wybierz poprawną formę.",
      options: ["живу", "живёшь", "живём", "живут"],
      correctIndex: 2,
      explanation:
        "Dla мы (my) końcówka to -ём/-ем: Мы живём в Москве. Живу to „ja”, живёшь — „ty”, живут — „oni”.",
    },
    {
      type: "quiz",
      question: "Jak powiesz po rosyjsku „Jestem studentem”?",
      options: ["Я есть студент.", "Я быть студент.", "Я студент."],
      correctIndex: 2,
      explanation:
        "W czasie teraźniejszym pomijamy „być”: Я студент. Formy z есть/быть w takim zdaniu są błędem.",
    },
  ],
  "ru-liczba-mnoga": [
    {
      type: "intro",
      text:
        "Liczba mnoga mówi, że rzeczy lub osób jest więcej niż jedna. Po rosyjsku rzeczowniki męskie i żeńskie dostają zwykle końcówkę -ы lub -и, a nijakie zamieniają -о na -а. Do tego dochodzi krótka lista wyjątków, których warto nauczyć się od razu.",
    },
    {
      type: "table",
      title: "Zasady regularne",
      headers: ["Liczba pojedyncza", "Zmiana", "Przykład"],
      rows: [
        ["r. męski na spółgłoskę", "+ ы", "стол → столы, студент → студенты"],
        ["r. żeński na -а", "-а → -ы", "лампа → лампы, мама → мамы"],
        [
          "po г, к, х, ж, ш, щ, ч",
          "-и (nigdy -ы!)",
          "книга → книги, ученик → ученики",
        ],
        ["r. nijaki na -о", "-о → -а", "окно → окна, слово → слова"],
        ["r. nijaki na -е", "-е → -я", "море → моря"],
      ],
      caption:
        "Reguła „siedmiu liter”: po г, к, х, ж, ш, щ, ч nigdy nie piszemy ы — zawsze и.",
    },
    {
      type: "table",
      title: "Wyjątki — do zapamiętania",
      headers: ["Liczba pojedyncza", "Liczba mnoga", "Znaczenie"],
      rows: [
        ["дом", "дома (akcent: damá)", "dom → domy"],
        ["друг", "друзья", "przyjaciel → przyjaciele"],
        ["человек", "люди", "człowiek → ludzie"],
      ],
      caption:
        "Tych form nie wyprowadzisz z reguły — ucz się słowa od razu razem z jego liczbą mnogą.",
    },
    {
      type: "examples",
      items: [
        { en: "Это столы.", pl: "To są stoły.", highlight: "столы" },
        {
          en: "У меня есть книги.",
          pl: "Mam książki. (u mienia jest' knigi)",
          highlight: "книги",
        },
        {
          en: "В классе новые студенты.",
          pl: "W klasie są nowi studenci.",
          highlight: "студенты",
        },
        { en: "Это окна.", pl: "To są okna.", highlight: "окна" },
        {
          en: "Мои друзья дома.",
          pl: "Moi przyjaciele są w domu.",
          highlight: "друзья",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Dwa częste błędy Polaków: pisanie „книгы” (po г musi być и: книги) oraz tworzenie liczby mnogiej od человек przez końcówkę — „человеки” nie istnieje, poprawnie jest люди. Uwaga też na дома (domy): akcent pada na -а [damá], inaczej niż w дома „w domu” [dóma].",
    },
    {
      type: "quiz",
      question: "Jaka jest liczba mnoga słowa „окно” (okno)?",
      options: ["окны", "окна", "окни"],
      correctIndex: 1,
      explanation:
        "Rzeczowniki nijakie na -о zamieniają je w liczbie mnogiej na -а: окно → окна, слово → слова.",
    },
    {
      type: "quiz",
      question: "Dlaczego mówimy „книги”, a nie „книгы”?",
      options: [
        "bo po г piszemy и, nie ы",
        "bo to nieregularny wyjątek",
        "bo книга jest rodzaju nijakiego",
      ],
      correctIndex: 0,
      explanation:
        "Działa reguła „siedmiu liter”: po г, к, х, ж, ш, щ, ч nigdy nie piszemy ы — dlatego книга → книги.",
    },
  ],
};
