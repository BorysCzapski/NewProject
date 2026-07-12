// ============================================================================
// lib/grammar/content/ru-a2.ts
// Authored interactive lessons for Russian A2 grammar topics, keyed by topic
// slug (must match grammar_topics.slug in supabase/seed/ru_02_grammar_a2.sql).
// Teaching language: Polish. Target-language examples are Russian (Cyrillic)
// and live in the `en` field by project convention; `pl` holds the Polish
// translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const RU_A2_LESSONS: Record<string, GrammarLesson> = {
  // --------------------------------------------------------------------------
  // Przypadki: mianownik i biernik
  // --------------------------------------------------------------------------
  "ru-mianownik-biernik": [
    {
      type: "intro",
      text:
        "W rosyjskim, tak jak w polskim, rzeczowniki odmieniają się przez przypadki. Mianownik (именительный падеж) odpowiada na pytania kto? co? — to forma podstawowa, ta ze słownika, i pełni rolę podmiotu. Biernik (винительный падеж) odpowiada na pytania kogo? co? i oznacza dopełnienie bliższe — obiekt czynności. Dobra wiadomość: ten system znasz już z polskiego!",
    },
    {
      type: "table",
      title: "Biernik — końcówki (liczba pojedyncza)",
      headers: ["Rodzaj", "Mianownik", "Biernik", "Przykład"],
      rows: [
        ["żeński na -а/-я", "книга, неделя", "книгу, неделю", "Я читаю книгу."],
        ["męski nieżywotny", "стол, дом", "стол, дом (bez zmian)", "Я вижу дом."],
        ["nijaki", "окно, море", "окно, море (bez zmian)", "Я вижу окно."],
        ["męski żywotny", "брат, студент", "брата, студента (= dopełniacz)", "Я вижу брата."],
      ],
      caption:
        "Najważniejszy wzór na tym poziomie: żeńskie -а/-я → -у/-ю. Męskie żywotne (osoby, zwierzęta) poznasz dokładniej przy dopełniaczu.",
    },
    {
      type: "formula",
      title: "Kto? (mianownik) + czasownik + kogo? co? (biernik)",
      variants: [
        {
          label: "Żeński: -а → -у",
          parts: [
            { text: "Я", role: "subject", note: "podmiot zawsze w mianowniku" },
            { text: "читаю", role: "verb", note: "читать (czytać) łączy się z biernikiem" },
            { text: "книгу", role: "object", note: "книга → книгу: żeńska końcówka -а zmienia się na -у" },
          ],
          example: { en: "Я читаю книгу.", pl: "Czytam książkę." },
        },
        {
          label: "Bez zmian (nieżywotny)",
          parts: [
            { text: "Он", role: "subject" },
            { text: "читает", role: "verb" },
            { text: "журнал", role: "object", note: "męski nieżywotny: biernik wygląda jak mianownik" },
          ],
          example: { en: "Он читает журнал.", pl: "On czyta czasopismo." },
        },
        {
          label: "Męski żywotny",
          parts: [
            { text: "Она", role: "subject" },
            { text: "видит", role: "verb", note: "видеть (widzieć) też wymaga biernika" },
            { text: "брата", role: "object", note: "брат → брата: żywotny męski wygląda jak dopełniacz" },
          ],
          example: { en: "Она видит брата.", pl: "Ona widzi brata." },
        },
      ],
      caption:
        "Czasowniki читать (czytać), видеть (widzieć), любить (kochać), знать (znać) zawsze łączą się z biernikiem.",
    },
    {
      type: "examples",
      items: [
        { en: "Это книга. Я читаю книгу.", pl: "To jest książka. Czytam książkę.", highlight: "книгу" },
        { en: "Я люблю Москву.", pl: "Kocham Moskwę.", highlight: "Москву" },
        { en: "Он видит собаку.", pl: "On widzi psa.", highlight: "собаку" },
        { en: "Мы читаем газету.", pl: "Czytamy gazetę.", highlight: "газету" },
        { en: "Она знает Анну.", pl: "Ona zna Annę.", highlight: "Анну" },
      ],
    },
    {
      type: "tip",
      variant: "tip",
      text:
        "Masz przewagę: polski biernik działa tak samo! Porównaj: czytam książkę → читаю книгу, kocham Moskwę → люблю Москву. Polskiej końcówce -ę odpowiada rosyjskie -у/-ю. A rzeczowniki męskie nieżywotne i nijakie — jak po polsku — w bierniku wyglądają identycznie jak w mianowniku: widzę stół → вижу стол.",
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę: Я люблю ___.",
      options: ["Москва", "Москву", "Москве"],
      correctIndex: 1,
      explanation:
        "Любить łączy się z biernikiem, a żeńska końcówka -а zmienia się na -у: Москва → Москву.",
    },
    {
      type: "quiz",
      question: "Które słowo w bierniku wygląda tak samo jak w mianowniku?",
      options: ["книга", "окно", "Анна"],
      correctIndex: 1,
      explanation:
        "Rzeczowniki nijakie (окно) i męskie nieżywotne mają biernik równy mianownikowi. Книга i Анна to rzeczowniki żeńskie na -а — w bierniku книгу, Анну.",
    },
  ],

  // --------------------------------------------------------------------------
  // Czas przeszły
  // --------------------------------------------------------------------------
  "ru-czas-przeszly": [
    {
      type: "intro",
      text:
        "Czas przeszły w rosyjskim jest zaskakująco prosty: czasownik NIE odmienia się przez osoby, tylko przez rodzaj i liczbę — dokładnie jak polskie czytał / czytała / czytali. Bierzemy bezokolicznik, odrzucamy końcówkę -ть i dodajemy -л (męski), -ла (żeński), -ло (nijaki) lub -ли (liczba mnoga).",
    },
    {
      type: "timeline",
      title: "Kiedy? Zakończona lub trwająca przeszłość",
      markers: [
        {
          at: 18,
          label: "жили в Москве (dawniej)",
          example: { en: "Мы жили в Москве.", pl: "Mieszkaliśmy w Moskwie." },
        },
        {
          at: 32,
          label: "читал книгу (вчера)",
          example: { en: "Вчера я читал книгу.", pl: "Wczoraj czytałem książkę." },
        },
        {
          at: 40,
          label: "была дома (утром)",
          example: { en: "Утром она была дома.", pl: "Rano ona była w domu." },
        },
      ],
      caption:
        "Wszystko na lewo od „teraz” — czas przeszły opisuje zarówno pojedyncze zdarzenia, jak i dłuższe stany.",
    },
    {
      type: "formula",
      title: "Budowa: bezokolicznik − ть + л / ла / ло / ли",
      variants: [
        {
          label: "Rodzaj męski",
          parts: [
            { text: "Вчера", role: "other", note: "typowe określenia przeszłości: вчера, утром, в субботу" },
            { text: "я", role: "subject" },
            { text: "читал", role: "verb", note: "читать − ть + л — tak mówi o sobie mężczyzna" },
            { text: "книгу", role: "object" },
          ],
          example: { en: "Вчера я читал книгу.", pl: "Wczoraj czytałem książkę." },
        },
        {
          label: "Rodzaj żeński",
          parts: [
            { text: "Она", role: "subject" },
            { text: "говорила", role: "verb", note: "говорить − ть + ла — dla każdego podmiotu żeńskiego" },
            { text: "по-русски", role: "object" },
          ],
          example: { en: "Она говорила по-русски.", pl: "Ona mówiła po rosyjsku." },
        },
        {
          label: "Liczba mnoga",
          parts: [
            { text: "Они", role: "subject" },
            { text: "жили", role: "verb", note: "-ли dla każdej liczby mnogiej: мы, вы, они" },
            { text: "в Москве", role: "object" },
          ],
          example: { en: "Они жили в Москве.", pl: "Oni mieszkali w Moskwie." },
        },
      ],
      caption:
        "Forma zależy od rodzaju podmiotu, nie od osoby: mężczyzna powie я читал, kobieta — я читала.",
    },
    {
      type: "table",
      title: "Czasownik быть (być) w czasie przeszłym",
      headers: ["Rodzaj / liczba", "Forma", "Przykład"],
      rows: [
        ["męski", "был", "Он был дома."],
        ["żeński", "была", "Она была дома."],
        ["nijaki", "было", "Это было давно."],
        ["mnoga", "были", "Они были в школе."],
      ],
      caption:
        "W czasie teraźniejszym быть zwykle znika (Я дома), ale w przeszłym jest obowiązkowe: Я был / была дома. Uwaga na akcent: была́.",
    },
    {
      type: "examples",
      items: [
        { en: "Вчера я читал книгу.", pl: "Wczoraj czytałem książkę. (mówi mężczyzna)", highlight: "читал" },
        { en: "Я читала журнал.", pl: "Czytałam czasopismo. (mówi kobieta)", highlight: "читала" },
        { en: "Она была дома.", pl: "Ona była w domu.", highlight: "была" },
        { en: "Мы жили в Москве.", pl: "Mieszkaliśmy w Moskwie.", highlight: "жили" },
        { en: "Они говорили по-русски.", pl: "Oni mówili po rosyjsku.", highlight: "говорили" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Najczęstszy błąd: końcówka niedopasowana do rodzaju podmiotu. Kobieta mówi o sobie я читала, я была — mężczyzna я читал, я был. Działa to jak polskie czytałem/czytałam, tylko że zaimek я jest ten sam dla wszystkich, a rodzaj pokazuje wyłącznie końcówka czasownika. Po ты tak samo: ты читал (do mężczyzny), ты читала (do kobiety).",
    },
    {
      type: "quiz",
      question: "Kobieta mówi o sobie. Wybierz poprawne zdanie:",
      options: ["Я был дома.", "Я была дома.", "Я были дома."],
      correctIndex: 1,
      explanation:
        "Forma czasu przeszłego zależy od rodzaju podmiotu: kobieta powie я была, mężczyzna — я был. Были to liczba mnoga.",
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę: Они ___ в Москве. (жить)",
      options: ["жил", "жила", "жили"],
      correctIndex: 2,
      explanation:
        "Они to liczba mnoga, więc czasownik dostaje końcówkę -ли: жили. Formy жил i жила to liczba pojedyncza (męska i żeńska).",
    },
  ],

  // --------------------------------------------------------------------------
  // Czas przyszły
  // --------------------------------------------------------------------------
  "ru-czas-przyszly": [
    {
      type: "intro",
      text:
        "Rosyjski ma dwa czasy przyszłe — dokładnie jak polski! Czas przyszły złożony (będę czytać = буду читать) tworzymy od czasowników niedokonanych: odmienione быть + bezokolicznik. Czas przyszły prosty (przeczytam = прочитаю) to forma czasowników dokonanych — wygląda jak czas teraźniejszy, ale ma znaczenie przyszłe i podkreśla rezultat.",
    },
    {
      type: "timeline",
      title: "Kiedy? Czynność dopiero nastąpi",
      markers: [
        {
          at: 62,
          label: "прочитаю книгу (вечером — rezultat)",
          example: { en: "Я прочитаю эту книгу вечером.", pl: "Przeczytam tę książkę wieczorem." },
        },
        {
          at: 68,
          to: 84,
          label: "буду работать (завтра — proces)",
          example: { en: "Завтра я буду работать.", pl: "Jutro będę pracować." },
        },
        {
          at: 80,
          to: 96,
          label: "будем говорить по-русски",
          example: { en: "Мы будем говорить по-русски.", pl: "Będziemy mówić po rosyjsku." },
        },
      ],
      caption:
        "Forma dokonana (прочитаю) to punkt — czynność zakończona z rezultatem. Forma złożona (буду работать) to proces rozciągnięty w przyszłości.",
    },
    {
      type: "table",
      title: "Odmiana быть w czasie przyszłym",
      headers: ["Osoba", "Forma", "Przykład"],
      rows: [
        ["я", "буду", "Я буду читать."],
        ["ты", "будешь", "Ты будешь работать?"],
        ["он / она / оно", "будет", "Она будет отдыхать."],
        ["мы", "будем", "Мы будем говорить по-русски."],
        ["вы", "будете", "Вы будете жить в Москве?"],
        ["они", "будут", "Они будут играть в футбол."],
      ],
      caption:
        "Bez odmiany быть nie zbudujesz czasu przyszłego złożonego — naucz się jej na pamięć.",
    },
    {
      type: "formula",
      title: "Dwa sposoby na przyszłość",
      variants: [
        {
          label: "Złożony (niedokonany)",
          parts: [
            { text: "Завтра", role: "other", note: "określenia przyszłości: завтра, вечером, в субботу" },
            { text: "я", role: "subject" },
            { text: "буду", role: "aux", note: "odmieniona forma быть — dopasuj do podmiotu" },
            { text: "работать", role: "verb", note: "bezokolicznik niedokonany — bez zmian" },
          ],
          example: { en: "Завтра я буду работать.", pl: "Jutro będę pracować." },
        },
        {
          label: "Prosty (dokonany)",
          parts: [
            { text: "Я", role: "subject" },
            { text: "прочитаю", role: "verb", note: "czasownik dokonany odmieniony jak w czasie teraźniejszym, ale znaczenie jest przyszłe" },
            { text: "эту книгу", role: "object" },
            { text: "вечером", role: "other" },
          ],
          example: { en: "Я прочитаю эту книгу вечером.", pl: "Przeczytam tę książkę wieczorem." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Ты", role: "subject" },
            { text: "будешь", role: "aux", note: "szyk się nie zmienia — pytanie tworzy intonacja" },
            { text: "читать?", role: "verb" },
          ],
          example: { en: "Ты будешь читать?", pl: "Będziesz czytać?" },
        },
      ],
    },
    {
      type: "compare",
      title: "Czas przyszły złożony vs prosty",
      columns: [
        {
          title: "Złożony (niedokonany)",
          formula: "быть (буду, будешь...) + bezokolicznik",
          whenToUse:
            "Proces — czynność trwająca lub powtarzająca się w przyszłości, jak polskie „będę czytać”.",
          examples: ["Завтра я буду работать.", "Мы будем говорить по-русски."],
        },
        {
          title: "Prosty (dokonany)",
          formula: "czasownik dokonany (прочитаю, напишу...)",
          whenToUse:
            "Rezultat — czynność, która zostanie zakończona, jak polskie „przeczytam, napiszę”.",
          examples: ["Я прочитаю эту книгу вечером.", "Я напишу письмо завтра."],
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "Завтра я буду работать.", pl: "Jutro będę pracować.", highlight: "буду работать" },
        { en: "Мы будем говорить по-русски.", pl: "Będziemy mówić po rosyjsku.", highlight: "будем говорить" },
        { en: "Я прочитаю эту книгу вечером.", pl: "Przeczytam tę książkę wieczorem.", highlight: "прочитаю" },
        { en: "Ты будешь смотреть фильм?", pl: "Będziesz oglądać film?", highlight: "будешь смотреть" },
        { en: "Он напишет письмо.", pl: "On napisze list.", highlight: "напишет" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Polski ma identyczny system, więc kieruj się swoim wyczuciem aspektu: będę czytać = буду читать (niedokonany), przeczytam = прочитаю (dokonany). Najczęstszy błąd: łączenie быть z czasownikiem dokonanym — „я буду прочитать” ✗ → „я прочитаю” ✓. Быть łączy się tylko z bezokolicznikiem niedokonanym.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Мы ___ говорить по-русски.",
      options: ["буду", "будем", "будут"],
      correctIndex: 1,
      explanation:
        "Forma быть musi pasować do podmiotu: мы будем. Буду łączy się z я, a будут z они.",
    },
  ],

  // --------------------------------------------------------------------------
  // Przyimki miejsca
  // --------------------------------------------------------------------------
  "ru-przyimki-miejsca": [
    {
      type: "intro",
      text:
        "Przyimki miejsca mówią, gdzie coś się znajduje: в (w), на (na), под (pod), над (nad), у (przy, u) i около (koło). Każdy przyimek wymaga konkretnego przypadka — dlatego ucz się od razu całych połączeń: в Москве, на столе, под столом.",
    },
    {
      type: "table",
      title: "Przyimek + przypadek",
      headers: ["Przyimek", "Znaczenie", "Przypadek", "Przykład"],
      rows: [
        ["в", "w (wewnątrz, obszar)", "miejscownik", "в доме, в Москве"],
        ["на", "na (powierzchnia, wydarzenie)", "miejscownik", "на столе, на работе"],
        ["под", "pod", "narzędnik", "под столом"],
        ["над", "nad", "narzędnik", "над домом"],
        ["у", "przy, u", "dopełniacz", "у окна"],
        ["около", "koło, obok", "dopełniacz", "около дома"],
      ],
      caption:
        "Na pytanie где? (gdzie?) в i на łączą się z miejscownikiem (предложный падеж) — rzeczownik dostaje zwykle końcówkę -е: стол → на столе, школа → в школе.",
    },
    {
      type: "formula",
      title: "Gdzie coś jest? Przyimek + właściwy przypadek",
      variants: [
        {
          label: "в + miejscownik",
          parts: [
            { text: "Я", role: "subject" },
            { text: "живу", role: "verb" },
            { text: "в", role: "other", note: "в = w, dla miejsc zamkniętych i obszarów: в доме, в городе" },
            { text: "Москве", role: "object", note: "Москва → в Москве: miejscownik z końcówką -е" },
          ],
          example: { en: "Я живу в Москве.", pl: "Mieszkam w Moskwie." },
        },
        {
          label: "на + miejscownik",
          parts: [
            { text: "Книга", role: "subject" },
            { text: "на", role: "other", note: "на = na, dla powierzchni i wydarzeń: на столе, на концерте" },
            { text: "столе", role: "object", note: "стол → на столе" },
          ],
          example: { en: "Книга на столе.", pl: "Książka jest na stole." },
        },
        {
          label: "под + narzędnik",
          parts: [
            { text: "Кот", role: "subject" },
            { text: "под", role: "other", note: "под i над łączą się z narzędnikiem (творительный падеж)" },
            { text: "столом", role: "object", note: "стол → под столом: narzędnik z końcówką -ом" },
          ],
          example: { en: "Кот под столом.", pl: "Kot jest pod stołem." },
        },
      ],
      caption:
        "W takich zdaniach po rosyjsku nie ma słowa „jest”: Книга на столе — dosłownie „Książka na stole”.",
    },
    {
      type: "examples",
      items: [
        { en: "Книга на столе.", pl: "Książka jest na stole.", highlight: "на столе" },
        { en: "Я живу в Москве.", pl: "Mieszkam w Moskwie.", highlight: "в Москве" },
        { en: "Кот под столом.", pl: "Kot jest pod stołem.", highlight: "под столом" },
        { en: "Дети в школе.", pl: "Dzieci są w szkole.", highlight: "в школе" },
        { en: "Она стоит у окна.", pl: "Ona stoi przy oknie.", highlight: "у окна" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Polskie „w / na” nie zawsze pokrywa się z rosyjskim в / на! Po rosyjsku mówi się на работе (w pracy!), на почте (na poczcie), на уроке (na lekcji), на концерте (na koncercie). Dlatego ucz się całych wyrażeń z przyimkiem i gotową końcówką, a nie samych rzeczowników.",
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę: Дети в ___.",
      options: ["школа", "школу", "школе"],
      correctIndex: 2,
      explanation:
        "Na pytanie где? (gdzie?) przyimek в łączy się z miejscownikiem: школа → в школе. Forma школу to biernik — używa się jej przy kierunku: иду в школу (idę do szkoły).",
    },
    {
      type: "quiz",
      question: "„Mama jest w pracy” to po rosyjsku:",
      options: ["Мама в работе.", "Мама на работе.", "Мама у работе."],
      correctIndex: 1,
      explanation:
        "Работа łączy się z на: на работе — mimo że po polsku mówimy „w pracy”. Takie połączenia trzeba zapamiętywać w całości.",
    },
  ],

  // --------------------------------------------------------------------------
  // Dopełniacz
  // --------------------------------------------------------------------------
  "ru-dopelniacz": [
    {
      type: "intro",
      text:
        "Dopełniacz (родительный падеж) odpowiada na pytania kogo? czego? — dokładnie jak polski dopełniacz. Używamy go do wyrażania przynależności (книга брата — książka brata), przy przeczeniu z нет (нет времени — nie ma czasu), przy ilości i mierze (чашка чая — filiżanka herbaty) oraz po przyimkach у, из, от, до, без, около.",
    },
    {
      type: "table",
      title: "Końcówki dopełniacza (liczba pojedyncza)",
      headers: ["Rodzaj", "Zmiana", "Przykłady"],
      rows: [
        ["męski", "+ -а / -я", "брат → брата, стол → стола"],
        ["nijaki", "-о/-е → -а/-я", "окно → окна, море → моря"],
        ["żeński na -а", "-а → -ы (-и)", "Москва → Москвы, книга → книги"],
        ["żeński na -я", "-я → -и", "неделя → недели"],
      ],
      caption:
        "Po к, г, х, ж, ш, щ, ч piszemy -и zamiast -ы: книга → книги, Польша → Польши.",
    },
    {
      type: "formula",
      title: "Mam / nie mam: у меня есть / у меня нет",
      variants: [
        {
          label: "Mam",
          parts: [
            { text: "У меня", role: "other", note: "dosłownie „u mnie” — tak Rosjanie mówią „mam”" },
            { text: "есть", role: "verb", note: "есть = jest / istnieje" },
            { text: "книга", role: "object", note: "po есть rzeczownik stoi w mianowniku" },
          ],
          example: { en: "У меня есть книга.", pl: "Mam książkę." },
        },
        {
          label: "Nie mam",
          parts: [
            { text: "У меня", role: "other" },
            { text: "нет", role: "negation", note: "нет = nie ma; zawsze wymaga dopełniacza" },
            { text: "книги", role: "object", note: "книга → книги: dopełniacz po нет" },
          ],
          example: { en: "У меня нет книги.", pl: "Nie mam książki." },
        },
        {
          label: "Przynależność",
          parts: [
            { text: "Это", role: "other", note: "это = to" },
            { text: "книга", role: "subject" },
            { text: "брата", role: "object", note: "брат → брата: dopełniacz odpowiada na pytanie czyja?" },
          ],
          example: { en: "Это книга брата.", pl: "To jest książka brata." },
        },
      ],
      caption:
        "Konstrukcja у меня есть / у меня нет to podstawowy sposób mówienia o posiadaniu po rosyjsku.",
    },
    {
      type: "examples",
      items: [
        { en: "У меня нет времени.", pl: "Nie mam czasu.", highlight: "нет времени" },
        { en: "Это книга брата.", pl: "To jest książka brata.", highlight: "брата" },
        { en: "Я из Польши.", pl: "Jestem z Polski.", highlight: "из Польши" },
        { en: "Я хочу чашку чая и стакан воды.", pl: "Chcę filiżankę herbaty i szklankę wody.", highlight: "чая" },
        { en: "Она живёт около школы.", pl: "Ona mieszka koło szkoły.", highlight: "около школы" },
      ],
    },
    {
      type: "tip",
      variant: "tip",
      text:
        "Polski dopełniacz działa niemal identycznie: „nie mam czasu”, „książka brata”, „szklanka wody” — wszędzie dopełniacz, tak samo jak po rosyjsku. Zapamiętaj przyimki, które go wymagają: у (u, przy), из (z), от (od), до (do), без (bez), около (koło) — np. без сахара (bez cukru), до вечера (do wieczora).",
    },
    {
      type: "quiz",
      question: "Uzupełnij: У меня нет ___. (время)",
      options: ["время", "времени", "времену"],
      correctIndex: 1,
      explanation:
        "Po нет zawsze stoi dopełniacz. Время odmienia się nieregularnie — jego dopełniacz to времени: У меня нет времени (Nie mam czasu).",
    },
    {
      type: "quiz",
      question: "Który przyimek łączy się z dopełniaczem?",
      options: ["в", "на", "без"],
      correctIndex: 2,
      explanation:
        "Без (bez) wymaga dopełniacza: без сахара. Przyimki в i на przy określaniu miejsca łączą się z miejscownikiem: в Москве, на столе.",
    },
  ],
};
