// ============================================================================
// lib/grammar/content/ru-b2.ts
// Authored interactive lessons for Russian B2 grammar topics, keyed by topic
// slug (must match grammar_topics.slug in supabase/seed/ru_02_grammar_b2.sql).
// Teaching language is Polish; by project convention the `en` field holds the
// target-language (Russian, Cyrillic) text and `pl` holds the translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const RU_B2_LESSONS: Record<string, GrammarLesson> = {
  "ru-imieslowy": [
    {
      type: "intro",
      text:
        "Rosyjskie imiesłowy dzielą się na dwie duże grupy: przymiotnikowe (причастия), które odmieniają się jak przymiotniki i opisują rzeczownik (какой?), oraz przysłówkowe (деепричастия) — nieodmienne, opisujące dodatkową czynność tego samego podmiotu. W stylu pisanym i oficjalnym są wszechobecne, więc na B2 musisz je pewnie rozpoznawać i tworzyć.",
    },
    {
      type: "table",
      title: "Cztery typy imiesłowów przymiotnikowych",
      headers: ["Typ", "Przyrostki", "Przykład", "Znaczenie"],
      rows: [
        [
          "Czynny teraźniejszy",
          "-ущ-/-ющ-, -ащ-/-ящ-",
          "читающий, говорящий",
          "czytający, mówiący",
        ],
        [
          "Czynny przeszły",
          "-вш-/-ш-",
          "прочитавший, построивший",
          "ten, który przeczytał / zbudował",
        ],
        [
          "Bierny teraźniejszy",
          "-ем-/-им-",
          "читаемый, любимый",
          "czytany, lubiany",
        ],
        [
          "Bierny przeszły",
          "-нн-/-енн-/-т-",
          "написанный, решённый, открытый",
          "napisany, rozwiązany, otwarty",
        ],
      ],
      caption:
        "Imiesłów przymiotnikowy zgadza się z rzeczownikiem w rodzaju, liczbie i przypadku — dokładnie jak zwykły przymiotnik: читающий студент, читающая девушка.",
    },
    {
      type: "formula",
      title: "Od zdania z который do imiesłowu",
      variants: [
        {
          label: "Zdanie z который",
          parts: [
            { text: "Студент,", role: "subject" },
            {
              text: "который",
              role: "other",
              note: "zaimek względny — wersja typowa dla języka mówionego",
            },
            { text: "читает", role: "verb" },
            { text: "книгу,", role: "object" },
            { text: "сидит", role: "verb" },
            { text: "у окна", role: "object" },
          ],
          example: {
            en: "Студент, который читает книгу, сидит у окна.",
            pl: "Student, który czyta książkę, siedzi przy oknie.",
          },
        },
        {
          label: "Imiesłów przymiotnikowy",
          parts: [
            { text: "Студент,", role: "subject" },
            {
              text: "читающий",
              role: "verb",
              note: "temat czasu teraźniejszego + -ющ- — zastępuje całe „который читает”",
            },
            { text: "книгу,", role: "object" },
            { text: "сидит", role: "verb" },
            { text: "у окна", role: "object" },
          ],
          example: {
            en: "Студент, читающий книгу, сидит у окна.",
            pl: "Student czytający książkę siedzi przy oknie.",
          },
        },
        {
          label: "Imiesłów przysłówkowy",
          parts: [
            {
              text: "Прочитав",
              role: "verb",
              note: "деепричастие dokonane na -в — czynność zakończona PRZED czynnością główną",
            },
            { text: "письмо,", role: "object" },
            { text: "она", role: "subject", note: "ten sam podmiot wykonuje obie czynności" },
            { text: "заплакала", role: "verb" },
          ],
          example: {
            en: "Прочитав письмо, она заплакала.",
            pl: "Przeczytawszy list, zapłakała.",
          },
        },
      ],
      caption:
        "W mowie potocznej Rosjanie chętniej mówią zdaniem z который, ale w tekstach pisanych i oficjalnych imiesłowy są bardzo częste.",
    },
    {
      type: "compare",
      title: "Деепричастие: niedokonane czy dokonane?",
      columns: [
        {
          title: "Niedokonane: -я / -а",
          formula: "читая, делая, напевая",
          whenToUse:
            "Czynność RÓWNOCZESNA z czynnością główną — polskie „robiąc coś”.",
          examples: [
            "Он шёл по улице, напевая песню.",
            "Читая, она делала заметки.",
          ],
        },
        {
          title: "Dokonane: -в / -вши",
          formula: "прочитав, сделав",
          whenToUse:
            "Czynność WCZEŚNIEJSZA, zakończona przed główną — polskie „zrobiwszy coś”.",
          examples: [
            "Прочитав письмо, она заплакала.",
            "Сделав уроки, он пошёл гулять.",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Imiesłowy w akcji",
      items: [
        {
          en: "Книга, написанная известным автором, лежит на столе.",
          pl: "Książka napisana przez znanego autora leży na stole.",
          highlight: "написанная",
        },
        {
          en: "Девушка, читающая книгу, сидит у окна.",
          pl: "Dziewczyna czytająca książkę siedzi przy oknie.",
          highlight: "читающая",
        },
        {
          en: "Человек, построивший этот дом, был архитектором.",
          pl: "Człowiek, który zbudował ten dom, był architektem.",
          highlight: "построивший",
        },
        {
          en: "Прочитав письмо, она заплакала.",
          pl: "Przeczytawszy list, zapłakała.",
          highlight: "Прочитав",
        },
        {
          en: "Он шёл по улице, напевая песню.",
          pl: "Szedł ulicą, nucąc piosenkę.",
          highlight: "напевая",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Деепричастие musi odnosić się do podmiotu zdania głównego! Zdanie «Прочитав письмо, слёзы потекли по её лицу» jest błędne — to nie łzy przeczytały list. Poprawnie: «Прочитав письмо, она заплакала». Uważaj też na formę: imiesłów przymiotnikowy odmienia się (читающий, читающая, читающую), a przysłówkowy nigdy (читая — zawsze ta sama forma).",
    },
    {
      type: "quiz",
      question: "Письмо, ___ вчера, уже отправлено.",
      options: ["написанное", "написавшее", "пишущее"],
      correctIndex: 0,
      explanation:
        "List został napisany (ktoś go napisał), więc potrzebny jest imiesłów BIERNY przeszły: написанное (rodzaj nijaki, bo письмо). Написавшее to imiesłów czynny — znaczyłby, że list sam coś napisał.",
    },
    {
      type: "quiz",
      question: "Które zdanie jest poprawne?",
      options: [
        "Прочитав письмо, она заплакала.",
        "Прочитав письмо, слёзы потекли по её лицу.",
        "Читающий письмо, она заплакала.",
      ],
      correctIndex: 0,
      explanation:
        "Деепричастие musi mieć ten sam podmiot co zdanie główne: to ONA przeczytała list i ONA zapłakała. W drugim zdaniu podmiotem są łzy (to one „przeczytałyby” list), a w trzecim użyto odmiennego imiesłowu przymiotnikowego zamiast nieodmiennego деепричастие.",
    },
  ],

  "ru-tryb-rozkazujacy": [
    {
      type: "intro",
      text:
        "Tryb rozkazujący (повелительное наклонение) służy do wydawania poleceń, próśb, rad i zachęt. Formę tworzymy od tematu czasu teraźniejszego lub przyszłego, dodając -й, -и albo -ь, a kluczową decyzją na poziomie B2 jest wybór aspektu: dokonany w prośbach, niedokonany w zakazach.",
    },
    {
      type: "formula",
      title: "Cztery typy poleceń",
      variants: [
        {
          label: "Prośba (2 os. lp.)",
          parts: [
            {
              text: "Открой",
              role: "verb",
              note: "aspekt dokonany — jednorazowa czynność; temat na samogłoskę → -й",
            },
            { text: "окно,", role: "object" },
            {
              text: "пожалуйста!",
              role: "other",
              note: "łagodzi bezpośredni ton rosyjskiego rozkaźnika",
            },
          ],
          example: {
            en: "Открой окно, пожалуйста!",
            pl: "Otwórz okno, proszę!",
          },
        },
        {
          label: "Zakaz",
          parts: [
            {
              text: "Не",
              role: "negation",
              note: "w zakazach prawie zawsze aspekt NIEDOKONANY",
            },
            {
              text: "опаздывайте",
              role: "verb",
              note: "-те = liczba mnoga albo forma grzecznościowa",
            },
            { text: "на урок!", role: "object" },
          ],
          example: {
            en: "Не опаздывайте на урок!",
            pl: "Nie spóźniajcie się na lekcję!",
          },
        },
        {
          label: "Wspólne działanie",
          parts: [
            {
              text: "Давайте",
              role: "aux",
              note: "давай/давайте + 1 os. lm. = polskie „zróbmy...”",
            },
            { text: "пойдём", role: "verb" },
            { text: "в кино!", role: "object" },
          ],
          example: {
            en: "Давайте пойдём в кино!",
            pl: "Chodźmy do kina!",
          },
        },
        {
          label: "Osoba trzecia",
          parts: [
            {
              text: "Пусть",
              role: "aux",
              note: "пусть/пускай + 3 osoba = polskie „niech...”",
            },
            { text: "он", role: "subject" },
            { text: "позвонит", role: "verb" },
            { text: "мне завтра", role: "object" },
          ],
          example: {
            en: "Пусть он позвонит мне завтра.",
            pl: "Niech on zadzwoni do mnie jutro.",
          },
        },
      ],
    },
    {
      type: "table",
      title: "Jak zbudować formę rozkazującą",
      headers: ["Sytuacja", "Końcówka", "Przykłady"],
      rows: [
        ["Temat kończy się na samogłoskę", "-й", "читай, работай, открой"],
        ["Akcent pada na końcówkę osobową", "-и", "говори, смотри, пиши"],
        ["Temat na spółgłoskę, akcent na temacie", "-ь", "будь, встань, ответь"],
        ["Liczba mnoga / forma grzecznościowa", "+ -те", "читайте, говорите, откройте"],
        ["Formy nieregularne", "—", "ешь (есть), дай (дать), пей (пить)"],
      ],
      caption:
        "Punktem wyjścia jest temat czasu teraźniejszego lub przyszłego: читают → читай, говорят → говори.",
    },
    {
      type: "compare",
      title: "Aspekt w rozkaźniku: dokonany czy niedokonany?",
      columns: [
        {
          title: "Dokonany",
          formula: "Закрой дверь!",
          whenToUse:
            "Prośby i polecenia o jednorazową, konkretną czynność — liczy się rezultat.",
          examples: [
            "Закрой дверь!",
            "Открой окно, пожалуйста!",
            "Покажите ваши документы!",
          ],
        },
        {
          title: "Niedokonany",
          formula: "Не опаздывай!",
          whenToUse:
            "Zakazy (prawie zawsze!) oraz zachęty i zaproszenia: Садитесь! Проходите!",
          examples: [
            "Не опаздывайте на урок!",
            "Не забывай звонить маме.",
            "Садитесь, пожалуйста!",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Tryb rozkazujący w praktyce",
      items: [
        {
          en: "Покажите, пожалуйста, ваши документы.",
          pl: "Proszę pokazać dokumenty.",
          highlight: "Покажите",
        },
        {
          en: "Не опаздывайте на урок!",
          pl: "Nie spóźniajcie się na lekcję!",
          highlight: "Не опаздывайте",
        },
        {
          en: "Давайте пойдём в парк вместе!",
          pl: "Chodźmy razem do parku!",
          highlight: "Давайте пойдём",
        },
        {
          en: "Пусть он сам решит эту задачу.",
          pl: "Niech on sam rozwiąże to zadanie.",
          highlight: "Пусть",
        },
        {
          en: "Ешь суп, пока он горячий!",
          pl: "Jedz zupę, póki jest gorąca!",
          highlight: "Ешь",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Rosyjski rozkaźnik brzmi bardziej bezpośrednio niż polski — dodawaj пожалуйста albo formę na -те. Typowy błąd Polaków: aspekt dokonany w zakazie. Zakaz to niedokonany: «Не закрывай окно!», nie «Не закрой». Wyjątek: не + dokonany to OSTRZEŻENIE przed czymś przypadkowym — «Не упади!» (uważaj, żebyś nie upadł), «Не забудь ключи!».",
    },
    {
      type: "quiz",
      question:
        "Nauczyciel zabrania uczniom notorycznego spóźniania się: Не ___ на уроки!",
      options: ["опоздайте", "опаздывайте", "опаздывать"],
      correctIndex: 1,
      explanation:
        "Zakaz dotyczący powtarzającej się czynności wymaga aspektu NIEDOKONANEGO: не опаздывайте. «Не опоздайте!» byłoby jednorazowym ostrzeżeniem, a опаздывать to bezokolicznik, nie rozkaźnik.",
    },
  ],

  "ru-liczebniki": [
    {
      type: "intro",
      text:
        "Rosyjskie liczebniki rządzą przypadkiem rzeczownika, który po nich stoi — to jeden z najtrudniejszych tematów gramatyki. Prosty schemat do zapamiętania: 1 → mianownik, 2-4 → dopełniacz liczby pojedynczej, 5 i więcej → dopełniacz liczby mnogiej. W liczbach złożonych liczy się wyłącznie ostatnie słowo.",
    },
    {
      type: "table",
      title: "Rekcja liczebników — schemat podstawowy",
      headers: ["Liczebnik", "Forma rzeczownika", "Przykłady"],
      rows: [
        [
          "один / одна / одно",
          "mianownik lp. (zgoda jak przymiotnik)",
          "один стол, одна книга, одно окно",
        ],
        [
          "два / две, три, четыре",
          "dopełniacz lp.",
          "два стола, две сестры, четыре окна",
        ],
        [
          "пять, шесть... двадцать",
          "dopełniacz lm.",
          "пять столов, десять книг, двадцать рублей",
        ],
        [
          "одиннадцать – четырнадцать",
          "ZAWSZE dopełniacz lm.",
          "одиннадцать студентов, двенадцать книг",
        ],
      ],
      caption:
        "Два/две rozróżnia rodzaj: два dla męskiego i nijakiego (два брата, два окна), две dla żeńskiego (две сестры, две чашки).",
    },
    {
      type: "formula",
      title: "Liczby złożone: liczy się ostatnie słowo",
      variants: [
        {
          label: "...один → mianownik",
          parts: [
            { text: "двадцать", role: "other" },
            {
              text: "один",
              role: "other",
              note: "o przypadku decyduje TYLKO ostatnie słowo liczebnika",
            },
            {
              text: "студент",
              role: "object",
              note: "mianownik lp. — dokładnie jak po zwykłym один",
            },
          ],
          example: {
            en: "В группе двадцать один студент.",
            pl: "W grupie jest dwudziestu jeden studentów.",
          },
        },
        {
          label: "...два-четыре → dop. lp.",
          parts: [
            { text: "двадцать", role: "other" },
            { text: "два", role: "other" },
            {
              text: "рубля",
              role: "object",
              note: "dopełniacz liczby pojedynczej — jak po два, три, четыре",
            },
          ],
          example: {
            en: "Это стоит двадцать два рубля.",
            pl: "To kosztuje dwadzieścia dwa ruble.",
          },
        },
        {
          label: "...пять+ → dop. lm.",
          parts: [
            { text: "двадцать", role: "other" },
            { text: "пять", role: "other" },
            {
              text: "рублей",
              role: "object",
              note: "dopełniacz liczby mnogiej — jak po пять i wyżej",
            },
          ],
          example: {
            en: "Это стоит двадцать пять рублей.",
            pl: "To kosztuje dwadzieścia pięć rubli.",
          },
        },
      ],
      caption:
        "Porównaj: двадцать один рубль, двадцать два рубля, двадцать пять рублей — ta sama dwudziestka, trzy różne formy rzeczownika.",
    },
    {
      type: "examples",
      title: "Liczebniki w przypadkach zależnych",
      items: [
        {
          en: "Я пришёл с двумя друзьями.",
          pl: "Przyszedłem z dwoma przyjaciółmi.",
          highlight: "с двумя друзьями",
        },
        {
          en: "Мы говорили о двух книгах.",
          pl: "Rozmawialiśmy o dwóch książkach.",
          highlight: "о двух книгах",
        },
        {
          en: "У меня нет пяти рублей.",
          pl: "Nie mam pięciu rubli.",
          highlight: "пяти рублей",
        },
        {
          en: "На полке лежат пять книг.",
          pl: "Na półce leży pięć książek.",
          highlight: "пять книг",
        },
        {
          en: "В группе двадцать один студент.",
          pl: "W grupie jest dwudziestu jeden studentów.",
          highlight: "двадцать один студент",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Pułapka nr 1: liczby 11-14 ZAWSZE łączą się z dopełniaczem liczby mnogiej, mimo że kończą się na cyfry 1-4: одиннадцать студентов, двенадцать книг (nie «двенадцать книги»!). Pułapka nr 2: w przypadkach zależnych odmienia się także sam liczebnik: с пятью рублями, о двух книгах — schemat „2-4 + dopełniacz lp.” działa tylko w mianowniku i bierniku.",
    },
    {
      type: "quiz",
      question: "У меня два ___.",
      options: ["брат", "брата", "братья"],
      correctIndex: 1,
      explanation:
        "Po liczebnikach два/две, три, четыре rzeczownik stoi w dopełniaczu liczby POJEDYNCZEJ: два брата. Братья to mianownik liczby mnogiej — po liczebniku 2-4 nie ma go nigdy.",
    },
    {
      type: "quiz",
      question: "В классе двенадцать ___.",
      options: ["студент", "студента", "студентов"],
      correctIndex: 2,
      explanation:
        "Liczby 11-14 zawsze wymagają dopełniacza liczby mnogiej: двенадцать студентов. Nie daj się zmylić temu, że dwanaście „kończy się na dwa” — reguła 2-4 tu nie działa.",
    },
  ],

  "ru-strona-bierna": [
    {
      type: "intro",
      text:
        "Strona bierna (страдательный залог) przenosi uwagę z wykonawcy czynności na jej przedmiot. Rosyjski tworzy ją na dwa sposoby, zależnie od aspektu: czasowniki niedokonane dostają cząstkę -ся (дома строятся), a dokonane — krótki imiesłów bierny z odpowiednią formą быть (дом был построен).",
    },
    {
      type: "formula",
      title: "Od strony czynnej do biernej",
      variants: [
        {
          label: "Strona czynna",
          parts: [
            {
              text: "Рабочие",
              role: "subject",
              note: "wykonawca czynności — w stronie biernej przejdzie do narzędnika",
            },
            { text: "построили", role: "verb" },
            { text: "дом", role: "object" },
          ],
          example: {
            en: "Рабочие построили дом.",
            pl: "Robotnicy zbudowali dom.",
          },
        },
        {
          label: "Bierna — dokonana",
          parts: [
            {
              text: "Дом",
              role: "subject",
              note: "dawne dopełnienie staje się podmiotem",
            },
            {
              text: "был",
              role: "aux",
              note: "быть w czasie przeszłym lub przyszłym; w teraźniejszym znika",
            },
            {
              text: "построен",
              role: "verb",
              note: "krótki imiesłów bierny — zgadza się z podmiotem w rodzaju i liczbie",
            },
            {
              text: "рабочими",
              role: "object",
              note: "agens w NARZĘDNIKU, bez żadnego przyimka",
            },
          ],
          example: {
            en: "Дом был построен рабочими.",
            pl: "Dom został zbudowany przez robotników.",
          },
        },
        {
          label: "Bierna — niedokonana (-ся)",
          parts: [
            { text: "Новые дома", role: "subject" },
            {
              text: "строятся",
              role: "verb",
              note: "forma zwrotna z -ся — proces lub czynność powtarzalna",
            },
            { text: "рабочими", role: "object" },
            { text: "каждый год", role: "other" },
          ],
          example: {
            en: "Новые дома строятся рабочими каждый год.",
            pl: "Nowe domy są budowane przez robotników każdego roku.",
          },
        },
      ],
      caption:
        "Przepis: przedmiot staje się podmiotem, dawny podmiot przechodzi do narzędnika, a formę czasownika dobierasz według aspektu.",
    },
    {
      type: "table",
      title: "Krótki imiesłów bierny w czasach",
      headers: ["Czas", "Wzór", "Przykład"],
      rows: [
        [
          "Teraźniejszy (rezultat)",
          "sam imiesłów, BEZ быть",
          "Дверь закрыта. Магазин открыт.",
        ],
        [
          "Przeszły",
          "был / была / было / были + imiesłów",
          "Дом был построен в прошлом веке.",
        ],
        ["Przyszły", "будет / будут + imiesłów", "Письмо будет отправлено завтра."],
        ["Proces (niedokonany)", "czasownik z -ся", "Новые дома строятся каждый год."],
      ],
      caption:
        "Krótki imiesłów zgadza się z podmiotem w rodzaju i liczbie: роман написан, книга написана, письмо написано, романы написаны.",
    },
    {
      type: "compare",
      title: "-ся czy krótki imiesłów?",
      columns: [
        {
          title: "-ся (aspekt niedokonany)",
          formula: "Дома строятся.",
          whenToUse:
            "Proces, czynność trwająca lub powtarzalna; typowe dla stylu oficjalnego, naukowego i prasowego.",
          examples: [
            "Новые дома строятся рабочими каждый год.",
            "Журнал издаётся с 1990 года.",
          ],
        },
        {
          title: "Krótki imiesłów (aspekt dokonany)",
          formula: "Дом (был) построен.",
          whenToUse:
            "Rezultat zakończonej czynności; w czasie teraźniejszym bez быть, w przeszłym i przyszłym z был/будет.",
          examples: [
            "Дом был построен в прошлом веке.",
            "Задача решена. Письмо будет отправлено.",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Strona bierna w praktyce",
      items: [
        {
          en: "Этот дом был построен в прошлом веке.",
          pl: "Ten dom został zbudowany w zeszłym wieku.",
          highlight: "был построен",
        },
        {
          en: "Роман написан известным писателем.",
          pl: "Powieść została napisana przez znanego pisarza.",
          highlight: "известным писателем",
        },
        {
          en: "Магазин открыт с девяти до восьми.",
          pl: "Sklep jest otwarty od dziewiątej do dwudziestej.",
          highlight: "открыт",
        },
        {
          en: "Письмо будет отправлено завтра.",
          pl: "List zostanie wysłany jutro.",
          highlight: "будет отправлено",
        },
        {
          en: "Задача была решена талантливым студентом.",
          pl: "Zadanie zostało rozwiązane przez utalentowanego studenta.",
          highlight: "решена",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Największa pułapka dla Polaków: polskie „przez kogoś” NIE ma rosyjskiego odpowiednika z przyimkiem. Agensa wyrażamy samym narzędnikiem: «Роман написан известным писателем», nigdy «через известного писателя». Pamiętaj też o zgodzie w rodzaju: письмо написано (nijaki), книга написана (żeński) — i o tym, że w mowie potocznej Rosjanie wolą stronę czynną z они: «Дом построили в прошлом веке».",
    },
    {
      type: "quiz",
      question:
        "Zamień na stronę bierną (czas przeszły): «Рабочие построили дом.»",
      options: [
        "Дом был построен рабочими.",
        "Дом был построен через рабочих.",
        "Дом строится рабочими.",
      ],
      correctIndex: 0,
      explanation:
        "Czasownik dokonany (построили) wymaga krótkiego imiesłowu biernego z был, a agens stoi w narzędniku BEZ przyimka: рабочими. Wersja z через to kalka z polskiego „przez”, a строится oznacza trwający proces, nie zakończoną czynność w przeszłości.",
    },
  ],

  "ru-mowa-zalezna": [
    {
      type: "intro",
      text:
        "Mowa zależna (косвенная речь) przekazuje cudze słowa bez dosłownego cytatu. Najważniejsza wiadomość dla każdego, kto uczył się angielskiego: w rosyjskim NIE ma następstwa czasów — czas z wypowiedzi oryginalnej zostaje, zmieniają się tylko osoby, zaimki i łączniki (что, ли, чтобы).",
    },
    {
      type: "compare",
      title: "Rosyjski vs angielski: co z czasami?",
      columns: [
        {
          title: "Angielski — cofa czasy",
          formula: "He said he LIVED in Moscow.",
          whenToUse:
            "Po czasowniku wprowadzającym w czasie przeszłym czas się cofa: lives → lived, will → would.",
          examples: ["„I live in Moscow.” → He said he lived in Moscow."],
        },
        {
          title: "Rosyjski — zachowuje czas",
          formula: "Он сказал, что ЖИВЁТ в Москве.",
          whenToUse:
            "Czas z wypowiedzi oryginalnej zostaje bez zmian, nawet gdy zdanie nadrzędne jest w przeszłości.",
          examples: [
            "«Я живу в Москве». → Он сказал, что живёт в Москве.",
            "«Я приду завтра». → Она сказала, что придёт завтра.",
          ],
        },
      ],
    },
    {
      type: "formula",
      title: "Trzy łączniki mowy zależnej",
      variants: [
        {
          label: "Oznajmienie → что",
          parts: [
            { text: "Он", role: "subject" },
            { text: "сказал,", role: "verb" },
            { text: "что", role: "other", note: "spójnik dla zdań oznajmujących" },
            {
              text: "любит",
              role: "verb",
              note: "czas teraźniejszy ZOSTAJE — brak następstwa czasów",
            },
            { text: "русскую музыку", role: "object" },
          ],
          example: {
            en: "Он сказал, что любит русскую музыку.",
            pl: "Powiedział, że lubi rosyjską muzykę.",
          },
        },
        {
          label: "Pytanie tak/nie → ли",
          parts: [
            { text: "Он", role: "subject" },
            { text: "спросил,", role: "verb" },
            {
              text: "придёт",
              role: "verb",
              note: "orzeczenie wysuwamy na początek zdania podrzędnego",
            },
            {
              text: "ли",
              role: "other",
              note: "partykuła ли stoi ZA orzeczeniem — inaczej niż polskie „czy”",
            },
            { text: "она", role: "subject" },
          ],
          example: {
            en: "Он спросил, придёт ли она.",
            pl: "Zapytał, czy ona przyjdzie.",
          },
        },
        {
          label: "Pytanie szczegółowe",
          parts: [
            { text: "Она", role: "subject" },
            { text: "спросила,", role: "verb" },
            {
              text: "где",
              role: "qword",
              note: "zaimek pytający zostaje, ale bez szyku pytającego",
            },
            { text: "я", role: "subject", note: "zmiana osoby: ты работаешь → я работаю" },
            { text: "работаю", role: "verb" },
          ],
          example: {
            en: "Она спросила, где я работаю.",
            pl: "Zapytała, gdzie pracuję.",
          },
        },
        {
          label: "Polecenie → чтобы",
          parts: [
            { text: "Учитель", role: "subject" },
            { text: "сказал,", role: "verb" },
            {
              text: "чтобы",
              role: "other",
              note: "polecenia i prośby wprowadza чтобы",
            },
            { text: "мы", role: "subject" },
            {
              text: "открыли",
              role: "verb",
              note: "po чтобы czasownik zawsze w formie przeszłej",
            },
            { text: "учебники", role: "object" },
          ],
          example: {
            en: "Учитель сказал, чтобы мы открыли учебники.",
            pl: "Nauczyciel powiedział, żebyśmy otworzyli podręczniki.",
          },
        },
      ],
    },
    {
      type: "table",
      title: "Ściąga: typ wypowiedzi → łącznik",
      headers: ["Typ wypowiedzi", "Łącznik", "Przykład"],
      rows: [
        ["Oznajmienie", "что", "Он сказал, что любит русскую музыку."],
        ["Pytanie tak/nie", "ли (po orzeczeniu)", "Он спросил, придёт ли она."],
        [
          "Pytanie szczegółowe",
          "zaimek pytający (где, когда, кто...)",
          "Она спросила, где я работаю.",
        ],
        [
          "Polecenie / prośba",
          "чтобы + forma przeszła",
          "Учитель сказал, чтобы мы открыли учебники.",
        ],
      ],
      caption:
        "Prośbę można też oddać czasownikiem попросить z bezokolicznikiem: Он попросил меня прийти пораньше.",
    },
    {
      type: "examples",
      title: "Mowa zależna w praktyce",
      items: [
        {
          en: "Она сказала, что живёт в Москве.",
          pl: "Powiedziała, że mieszka w Moskwie.",
          highlight: "что живёт",
        },
        {
          en: "Мама спросила, сделал ли я уроки.",
          pl: "Mama zapytała, czy odrobiłem lekcje.",
          highlight: "сделал ли",
        },
        {
          en: "Она не знала, где я живу.",
          pl: "Nie wiedziała, gdzie mieszkam.",
          highlight: "где я живу",
        },
        {
          en: "Мама сказала, чтобы я убрал комнату.",
          pl: "Mama powiedziała, żebym posprzątał pokój.",
          highlight: "чтобы я убрал",
        },
        {
          en: "Он попросил меня прийти пораньше.",
          pl: "Poprosił mnie, żebym przyszedł wcześniej.",
          highlight: "попросил меня прийти",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Nie przenoś angielskich nawyków! «Я живу в Москве» w mowie zależnej to «Он сказал, что живёт в Москве» — NIE «что жил» (to znaczyłoby, że już tam nie mieszka). Druga pułapka: polskie „czy” stoi na początku, ale rosyjskie ли stoi PO orzeczeniu: «спросил, придёт ли она», nigdy «спросил, ли придёт она».",
    },
    {
      type: "quiz",
      question: "«Где ты работаешь?» — Она спросила, где я ___.",
      options: ["работаю", "работаешь", "работал"],
      correctIndex: 0,
      explanation:
        "Zmienia się osoba (ты работаешь → я работаю), ale czas ZOSTAJE teraźniejszy, bo rosyjski nie ma następstwa czasów. Работал sugerowałoby, że już tam nie pracuję, a работаешь nie zgadza się z nowym podmiotem я.",
    },
  ],
};
