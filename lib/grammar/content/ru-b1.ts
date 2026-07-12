// ============================================================================
// lib/grammar/content/ru-b1.ts
// Authored interactive lessons for Russian B1 grammar topics (for Polish
// learners), keyed by topic slug (must match grammar_topics.slug in
// supabase/seed/ru_02_grammar_b1.sql). Project convention: the `en` field
// holds the target language (here: Russian, in Cyrillic), `pl` the Polish
// translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const RU_B1_LESSONS: Record<string, GrammarLesson> = {
  "ru-aspekt": [
    {
      type: "intro",
      text:
        "Aspekt to serce rosyjskiego czasownika — i dobra wiadomość: po polsku działa niemal tak samo. Tak jak czytać/przeczytać, rosyjskie czasowniki tworzą pary: читать/прочитать, писать/написать, делать/сделать. Forma niedokonana opisuje proces, trwanie lub powtarzanie, a dokonana — rezultat, jednorazowość i zakończenie czynności. Wybór aspektu zmienia sens zdania, dlatego zawsze pytaj: chodzi o proces czy o rezultat?",
    },
    {
      type: "compare",
      title: "Niedokonany czy dokonany?",
      columns: [
        {
          title: "Niedokonany (несовершенный вид)",
          formula: "читать, писать, делать",
          whenToUse:
            "Proces, trwanie, czynności powtarzające się i nawykowe. Słowa-sygnały: обычно, всегда, часто, каждый день, весь вечер.",
          examples: [
            "Я читал книгу весь вечер. (czytałem — proces)",
            "Каждый день я пишу письма. (nawyk)",
          ],
        },
        {
          title: "Dokonany (совершенный вид)",
          formula: "прочитать, написать, сделать",
          whenToUse:
            "Rezultat, jednorazowość, zakończenie czynności. Słowa-sygnały: вдруг, уже, наконец, за два дня.",
          examples: [
            "Я прочитал книгу за два дня. (przeczytałem — wynik)",
            "Она уже написала письмо. (gotowe!)",
          ],
        },
      ],
    },
    {
      type: "table",
      title: "Typowe pary aspektowe",
      headers: ["Niedokonany", "Dokonany", "Po polsku"],
      rows: [
        ["читать", "прочитать", "czytać → przeczytać"],
        ["писать", "написать", "pisać → napisać"],
        ["делать", "сделать", "robić → zrobić"],
        ["покупать", "купить", "kupować → kupić"],
        ["говорить", "сказать", "mówić → powiedzieć"],
      ],
      caption:
        "Najczęściej parę tworzy przedrostek (про-, на-, с-), ale bywają pary z zupełnie różnych czasowników — jak покупать/купить czy говорить/сказать.",
    },
    {
      type: "formula",
      title: "Czas przyszły — dwa sposoby",
      variants: [
        {
          label: "Niedokonany (złożony)",
          parts: [
            { text: "Я", role: "subject" },
            { text: "буду", role: "aux", note: "odmieniona forma быть: буду, будешь, будет, будем..." },
            { text: "читать", role: "verb", note: "bezokolicznik — zawsze niedokonany!" },
            { text: "книгу", role: "object" },
          ],
          example: { en: "Я буду читать книгу.", pl: "Będę czytać książkę. (proces)" },
        },
        {
          label: "Dokonany (prosty)",
          parts: [
            { text: "Я", role: "subject" },
            { text: "прочитаю", role: "verb", note: "odmienia się jak czas teraźniejszy, ale znaczenie jest przyszłe" },
            { text: "книгу", role: "object" },
          ],
          example: { en: "Я прочитаю книгу.", pl: "Przeczytam książkę. (rezultat)" },
        },
      ],
      caption:
        "Czasownik dokonany nie ma czasu teraźniejszego — forma wyglądająca na teraźniejszą (прочитаю, сделаю, скажу) zawsze oznacza przyszłość. Dokładnie jak polskie „przeczytam, zrobię, powiem”.",
    },
    {
      type: "examples",
      items: [
        { en: "Вчера я весь день писал письмо.", pl: "Wczoraj cały dzień pisałem list. (proces)", highlight: "писал" },
        { en: "Она уже прочитала этот роман.", pl: "Ona już przeczytała tę powieść. (rezultat)", highlight: "прочитала" },
        { en: "Обычно я пью кофе по утрам.", pl: "Zwykle rano piję kawę. (nawyk)", highlight: "пью" },
        { en: "Завтра я сделаю эту работу.", pl: "Jutro zrobię tę pracę. (przyszły dokonany)", highlight: "сделаю" },
        { en: "Наконец он написал доклад.", pl: "Wreszcie napisał referat.", highlight: "написал" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie łącz быть z aspektem dokonanym: "я буду прочитать" ✗ — czas przyszły złożony tworzy TYLKO niedokonany: "буду читать" ✓, a dokonany ma formę prostą: "прочитаю" ✓. Druga pułapka: po обычно, всегда, часто stoi zawsze aspekt niedokonany — tak samo jak po polsku ("zwykle czytam", nie "zwykle przeczytam").',
    },
    {
      type: "quiz",
      question: "Wybierz formę wskazującą zakończony rezultat: Она уже ___ этот роман.",
      options: ["читала", "прочитала", "читает"],
      correctIndex: 1,
      explanation:
        "Słowo уже sygnalizuje rezultat, więc potrzebny jest aspekt dokonany: прочитала (przeczytała). Читала to proces (czytała), a читает — czas teraźniejszy.",
    },
    {
      type: "quiz",
      question: "Uzupełnij czasem przyszłym dokonanym: Завтра я ___ эту работу.",
      options: ["делаю", "буду делать", "сделаю"],
      correctIndex: 2,
      explanation:
        "Chodzi o doprowadzenie pracy do końca — prosty czas przyszły dokonany: сделаю (zrobię). Буду делать to przyszły niedokonany (będę robić — proces), a делаю to czas teraźniejszy.",
    },
  ],

  "ru-celownik": [
    {
      type: "intro",
      text:
        "Celownik (дательный падеж) odpowiada na pytania кому? чему? — dokładnie jak polski celownik (komu? czemu?). Wskazuje odbiorcę czynności: osobę, której coś dajemy, mówimy lub pomagamy — Я звоню другу, Он помогает сестре. Obsługuje też konstrukcje bezosobowe (Мне нравится..., Мне холодно) oraz wiek (Моему брату двадцать лет).",
    },
    {
      type: "table",
      title: "Końcówki celownika",
      headers: ["Rodzaj", "Końcówka", "Przykład"],
      rows: [
        ["męski", "-у / -ю", "брат → брату, учитель → учителю"],
        ["nijaki", "-у / -ю", "окно → окну, море → морю"],
        ["żeński na -а/-я", "-е", "мама → маме, сестра → сестре"],
        ["żeński na -ь oraz na -ия", "-и", "дверь → двери, Россия → России"],
        ["liczba mnoga", "-ам / -ям", "друзья → друзьям, сёстры → сёстрам"],
      ],
    },
    {
      type: "formula",
      title: "Trzy typowe użycia celownika",
      variants: [
        {
          label: "Czasownik + odbiorca",
          parts: [
            { text: "Я", role: "subject" },
            { text: "звоню", role: "verb", note: "z celownikiem łączą się m.in.: дать, помогать, звонить, говорить, показывать" },
            { text: "другу", role: "object", note: "кому? — odbiorca w celowniku, bez przyimka!" },
          ],
          example: { en: "Я звоню другу.", pl: "Dzwonię do przyjaciela." },
        },
        {
          label: "Konstrukcja bezosobowa",
          parts: [
            { text: "Мне", role: "object", note: "osoba stoi w celowniku, nie w mianowniku!" },
            { text: "нравится", role: "verb", note: "podobnie: нужно, можно, холодно" },
            { text: "эта песня", role: "subject", note: "podmiot gramatyczny — to, co się podoba" },
          ],
          example: { en: "Мне нравится эта песня.", pl: "Podoba mi się ta piosenka." },
        },
        {
          label: "Przyimek к",
          parts: [
            { text: "Мы", role: "subject" },
            { text: "идём", role: "verb" },
            { text: "к", role: "other", note: "к + celownik = do, w stronę (osoby lub miejsca)" },
            { text: "врачу", role: "object" },
          ],
          example: { en: "Мы идём к врачу.", pl: "Idziemy do lekarza." },
        },
      ],
      caption:
        "Drugi częsty przyimek z celownikiem to по: гулять по городу — spacerować po mieście.",
    },
    {
      type: "table",
      title: "Zaimki osobowe w celowniku",
      headers: ["Mianownik", "Celownik", "Przykład"],
      rows: [
        ["я", "мне", "Мне двадцать лет."],
        ["ты", "тебе", "Тебе нравится этот фильм?"],
        ["он / оно", "ему", "Ему нужно работать."],
        ["она", "ей", "Я помогаю ей."],
        ["мы", "нам", "Нам холодно."],
        ["вы", "вам", "Сколько вам лет?"],
        ["они", "им", "Я звоню им."],
      ],
    },
    {
      type: "examples",
      items: [
        { en: "Я подарил цветы маме.", pl: "Podarowałem mamie kwiaty.", highlight: "маме" },
        { en: "Он помогает сестре.", pl: "On pomaga siostrze.", highlight: "сестре" },
        { en: "Мне нравится эта песня.", pl: "Podoba mi się ta piosenka.", highlight: "Мне" },
        { en: "Моему брату двадцать лет.", pl: "Mój brat ma dwadzieścia lat.", highlight: "Моему брату" },
        { en: "Мы идём в гости к брату.", pl: "Idziemy w odwiedziny do brata.", highlight: "к брату" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie kalkuj polskiego "dzwonić DO kogoś": звонить łączy się z celownikiem bez żadnego przyimka — "Я звоню другу" ✓, nie "звоню до друга" ✗. Podobnie помогать: "помогаю сестре" jak polskie "pomagam siostrze". I wiek: po polsku "mam 20 lat", po rosyjsku osoba stoi w celowniku — "Мне двадцать лет" (dosłownie: mnie jest dwadzieścia lat).',
    },
    {
      type: "quiz",
      question: "Wybierz właściwą formę: ___ нравится этот фильм.",
      options: ["Я", "Мне", "Меня"],
      correctIndex: 1,
      explanation:
        "Po нравится osoba, której coś się podoba, stoi w celowniku: Мне. Podmiotem gramatycznym jest этот фильм — to on się podoba, jak w polskim „podoba MI się”.",
    },
    {
      type: "quiz",
      question: "Wstaw брат po przyimku к: Мы идём в гости к ___.",
      options: ["брат", "брату", "братом"],
      correctIndex: 1,
      explanation:
        "Przyimek к zawsze wymaga celownika: к брату. Брат to mianownik, a братом — narzędnik (używany np. po с).",
    },
  ],

  "ru-narzednik": [
    {
      type: "intro",
      text:
        "Narzędnik (творительный падеж) odpowiada na pytania кем? чем? — jak polski narzędnik (kim? czym?). Podstawowe znaczenie zna każdy Polak: narzędzie lub środek, którym coś robimy — Я пишу ручкой (piszę długopisem). Ale rosyjski narzędnik to też towarzystwo (с другом), zawód i rola (работать врачом) oraz pozycja w przestrzeni (под столом).",
    },
    {
      type: "table",
      title: "Końcówki narzędnika",
      headers: ["Rodzaj", "Końcówka", "Przykład"],
      rows: [
        ["męski", "-ом / -ем", "нож → ножом, учитель → учителем"],
        ["nijaki", "-ом / -ем", "окно → окном, море → морем"],
        ["żeński", "-ой / -ей", "мама → мамой, неделя → неделей"],
        ["liczba mnoga", "-ами / -ями", "книги → книгами, друзья → друзьями"],
      ],
      caption:
        "Zaimki osobowe: мной, тобой, им, ей, нами, вами, ими — np. Пойдёшь со мной? (Pójdziesz ze mną?).",
    },
    {
      type: "formula",
      title: "Trzy role narzędnika",
      variants: [
        {
          label: "Narzędzie — bez przyimka",
          parts: [
            { text: "Я", role: "subject" },
            { text: "режу", role: "verb" },
            { text: "хлеб", role: "object" },
            { text: "ножом", role: "other", note: "чем? — samo narzędzie stoi BEZ przyimka с, jak po polsku: kroję nożem" },
          ],
          example: { en: "Я режу хлеб ножом.", pl: "Kroję chleb nożem." },
        },
        {
          label: "Towarzystwo — с + narzędnik",
          parts: [
            { text: "Я", role: "subject" },
            { text: "иду", role: "verb" },
            { text: "в кино", role: "object" },
            { text: "с другом", role: "other", note: "с кем? — razem z kimś; przy towarzystwie przyimek с jest konieczny" },
          ],
          example: { en: "Я иду в кино с другом.", pl: "Idę do kina z przyjacielem." },
        },
        {
          label: "Zawód i rola",
          parts: [
            { text: "Он", role: "subject" },
            { text: "работает", role: "verb", note: "narzędnika wymagają też: быть, стать, заниматься, интересоваться" },
            { text: "врачом", role: "object", note: "кем? — zawód lub rola w narzędniku" },
          ],
          example: { en: "Он работает врачом.", pl: "On pracuje jako lekarz." },
        },
      ],
    },
    {
      type: "table",
      title: "Przyimki miejsca z narzędnikiem",
      headers: ["Przyimek", "Znaczenie", "Przykład"],
      rows: [
        ["над", "nad", "Лампа висит над столом."],
        ["под", "pod", "Кот сидит под столом."],
        ["перед", "przed", "Машина стоит перед домом."],
        ["за", "za", "Сад за домом."],
        ["между", "między", "Стол стоит между окном и дверью."],
      ],
      caption:
        "Te przyimki z narzędnikiem odpowiadają na pytanie где? (gdzie coś JEST) — jak polskie „nad stołem, pod stołem, przed domem”.",
    },
    {
      type: "examples",
      items: [
        { en: "Я пишу ручкой.", pl: "Piszę długopisem.", highlight: "ручкой" },
        { en: "Я люблю чай с молоком.", pl: "Lubię herbatę z mlekiem.", highlight: "с молоком" },
        { en: "Она хочет стать учителем.", pl: "Ona chce zostać nauczycielką.", highlight: "учителем" },
        { en: "Мой отец занимается спортом.", pl: "Mój tata uprawia sport.", highlight: "спортом" },
        { en: "Кот сидит под столом.", pl: "Kot siedzi pod stołem.", highlight: "под столом" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Narzędzie NIGDY nie bierze przyimka: "Я пишу ручкой" ✓, nie "пишу с ручкой" ✗ — dokładnie jak po polsku (piszę długopisem, a nie „z długopisem”). Za to przy zawodzie nie wstawiaj mianownika: "Он работает врач" ✗ → "Он работает врачом" ✓. Pomaga analogia: po polsku też mówimy „jest lekarzem”, „została nauczycielką” — narzędnik. Zapamiętaj też stałe związki: заниматься спортом, интересоваться музыкой.',
    },
    {
      type: "quiz",
      question: "Wybierz formę zawodu po czasowniku стать: Она хочет стать ___.",
      options: ["учитель", "учителем", "учителя"],
      correctIndex: 1,
      explanation:
        "Po стать, быть i работать zawód stoi w narzędniku: учителем — jak polskie „zostać nauczycielem”. Учитель to mianownik, учителя — dopełniacz.",
    },
    {
      type: "quiz",
      question: "Wybierz formę po przyimku под: Кот сидит под ___.",
      options: ["стол", "столом", "столе"],
      correctIndex: 1,
      explanation:
        "Под przy pytaniu где? (gdzie kot siedzi) wymaga narzędnika: под столом. Столе to miejscownik (po в/на/о), a стол — mianownik lub biernik.",
    },
  ],

  "ru-miejscownik": [
    {
      type: "intro",
      text:
        "Miejscownik (предложный падеж) to jedyny rosyjski przypadek, który ZAWSZE występuje z przyimkiem — stąd jego nazwa („przyimkowy”). Polski miejscownik zachowuje się tak samo (o kim? o czym? — w, na, o, przy). Odpowiada na pytania где? о ком? о чём? i służy do dwóch rzeczy: mówienia GDZIE coś jest (в Москве, на столе) oraz O CZYM lub O KIM rozmawiamy (о фильме, о нём).",
    },
    {
      type: "table",
      title: "Końcówki miejscownika",
      headers: ["Typ rzeczownika", "Końcówka", "Przykład"],
      rows: [
        ["większość rzeczowników", "-е", "Москва → в Москве, стол → на столе, работа → о работе"],
        ["na -ия, -ие", "-и", "Россия → в России, здание → в здании"],
        ["niektóre męskie (miejsce)", "-у (akcentowane)", "лес → в лесу, сад → в саду, берег → на берегу"],
        ["żeńskie na -ь", "-и", "дверь → на двери, площадь → на площади"],
      ],
      caption:
        "Zaimki osobowe: обо мне, о тебе, о нём, о ней, о нас, о вас, о них.",
    },
    {
      type: "formula",
      title: "Gdzie? i o czym?",
      variants: [
        {
          label: "Miejsce: в / на",
          parts: [
            { text: "Я", role: "subject" },
            { text: "живу", role: "verb" },
            { text: "в", role: "other", note: "в — wewnątrz; на — na powierzchni albo z tradycji (на работе)" },
            { text: "Москве", role: "object", note: "где? — miejscownik" },
          ],
          example: { en: "Я живу в Москве.", pl: "Mieszkam w Moskwie." },
        },
        {
          label: "Temat: о",
          parts: [
            { text: "Мы", role: "subject" },
            { text: "говорим", role: "verb", note: "podobnie: думать, рассказывать, мечтать" },
            { text: "о фильме", role: "object", note: "о чём? — temat rozmowy lub myśli" },
          ],
          example: { en: "Мы говорим о фильме.", pl: "Rozmawiamy o filmie." },
        },
        {
          label: "об przed samogłoską",
          parts: [
            { text: "Он", role: "subject" },
            { text: "думает", role: "verb" },
            { text: "об экзамене", role: "object", note: "об przed а, э, о, у, и; forma specjalna: обо мне" },
          ],
          example: { en: "Он думает об экзамене.", pl: "On myśli o egzaminie." },
        },
      ],
    },
    {
      type: "table",
      title: "в czy на? Wybór zależy od słowa",
      headers: ["в (wewnątrz)", "на (z tradycji)"],
      rows: [
        ["в школе", "на работе"],
        ["в театре", "на концерте"],
        ["в парке", "на почте"],
        ["в музее", "на вокзале"],
        ["в России", "на море"],
      ],
      caption:
        "Par typu в школе / на работе trzeba uczyć się razem ze słowem — kalka z polskiego nie zawsze działa.",
    },
    {
      type: "examples",
      items: [
        { en: "Я живу в Москве.", pl: "Mieszkam w Moskwie.", highlight: "в Москве" },
        { en: "Книга лежит на столе.", pl: "Książka leży na stole.", highlight: "на столе" },
        { en: "Мы говорили о работе.", pl: "Rozmawialiśmy o pracy.", highlight: "о работе" },
        { en: "Летом мы отдыхали на море.", pl: "Latem odpoczywaliśmy nad morzem.", highlight: "на море" },
        { en: "Дети гуляют в лесу.", pl: "Dzieci spacerują po lesie.", highlight: "в лесу" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Dwie pułapki. Po pierwsze: "w pracy" to на работе, nie "в работе" ✗ — a "na koncercie" to akurat zgodnie z polskim на концерте ✓. Po drugie: krótkie męskie rzeczowniki miejsca biorą akcentowane -у: в лесу, в саду, на берегу — nie "в лесе" ✗. I pamiętaj: miejscownik odpowiada na где? (gdzie jestem), a biernik na куда? (dokąd idę): Я в Москве, ale Я еду в Москву.',
    },
    {
      type: "quiz",
      question: "Wybierz formę po przyimku в (miejsce): Дети играют в ___.",
      options: ["парк", "парке", "парком"],
      correctIndex: 1,
      explanation:
        "Pytanie brzmi где? (gdzie się bawią), więc potrzebny miejscownik: в парке. В парк (biernik) odpowiadałoby na куда? — dokąd idą, a парком to narzędnik.",
    },
    {
      type: "quiz",
      question: "Wstaw Москва w miejscowniku: Я живу в ___.",
      options: ["Москва", "Москве", "Москву"],
      correctIndex: 1,
      explanation:
        "Где я живу? — miejscownik: в Москве. В Москву (biernik) oznacza kierunek ruchu: jadę DO Moskwy.",
    },
  ],

  "ru-czasowniki-ruchu": [
    {
      type: "intro",
      text:
        "Rosyjskie czasowniki ruchu chodzą parami — dosłownie: идти/ходить (iść pieszo) i ехать/ездить (jechać pojazdem). Polski ma tę samą opozycję: „idę do szkoły” (teraz, w jedną stronę) vs „chodzę do szkoły” (regularnie). Forma jednokierunkowa opisuje ruch tu i teraz w jednym kierunku, wielokierunkowa — ruch powtarzalny, nawykowy lub w obie strony. Do tego dochodzą przedrostki (по-, при-, у-), które nadają nowe znaczenia.",
    },
    {
      type: "compare",
      title: "Określone czy nieokreślone?",
      columns: [
        {
          title: "Określone (jednokierunkowe): идти, ехать",
          formula: "ruch teraz, w jedną stronę",
          whenToUse:
            "Konkretny ruch w jednym kierunku, zwykle tu i teraz. Słowo-sygnał: сейчас.",
          examples: [
            "Сейчас я иду домой. (właśnie idę)",
            "Я еду в Москву. (jadę w tej chwili)",
          ],
        },
        {
          title: "Nieokreślone (wielokierunkowe): ходить, ездить",
          formula: "ruch powtarzalny lub w obie strony",
          whenToUse:
            "Nawyki i regularność (каждый день, часто) oraz — w czasie przeszłym — jednorazowa wyprawa tam i z powrotem.",
          examples: [
            "Каждый день я хожу в школу. (chodzę)",
            "Вчера мы ходили в театр. (byliśmy i wróciliśmy)",
          ],
        },
      ],
    },
    {
      type: "table",
      title: "Odmiana w czasie teraźniejszym",
      headers: ["Osoba", "идти", "ходить", "ехать", "ездить"],
      rows: [
        ["я", "иду", "хожу", "еду", "езжу"],
        ["ты", "идёшь", "ходишь", "едешь", "ездишь"],
        ["он / она", "идёт", "ходит", "едет", "ездит"],
        ["мы", "идём", "ходим", "едем", "ездим"],
        ["вы", "идёте", "ходите", "едете", "ездите"],
        ["они", "идут", "ходят", "едут", "ездят"],
      ],
      caption:
        "Uwaga na nieregularne formy 1. osoby: хожу (nie „ходю”) i езжу (nie „ездю”).",
    },
    {
      type: "formula",
      title: "Przedrostki zmieniają znaczenie",
      variants: [
        {
          label: "по- — start i przyszłość",
          parts: [
            { text: "Завтра", role: "other", note: "określenie czasu przyszłego" },
            { text: "я", role: "subject" },
            { text: "пойду", role: "verb", note: "по- + иду = pójdę; czas przyszły dokonany, tak samo поеду — pojadę" },
            { text: "в кино", role: "object" },
          ],
          example: { en: "Завтра я пойду в кино.", pl: "Jutro pójdę do kina." },
        },
        {
          label: "при- — przybycie",
          parts: [
            { text: "Он", role: "subject" },
            { text: "приехал", role: "verb", note: "при- = przybycie: приехать — przyjechać, прийти — przyjść" },
            { text: "вчера", role: "other" },
          ],
          example: { en: "Он приехал вчера.", pl: "On przyjechał wczoraj." },
        },
        {
          label: "у- — oddalenie",
          parts: [
            { text: "Она", role: "subject" },
            { text: "ушла", role: "verb", note: "у- = odejście: уйти — odejść; ушла to forma żeńska czasu przeszłego" },
            { text: "домой", role: "object" },
          ],
          example: { en: "Она ушла домой.", pl: "Ona poszła (sobie) do domu." },
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "Сейчас я иду в магазин.", pl: "Właśnie idę do sklepu.", highlight: "иду" },
        { en: "Каждое утро он ходит на работу пешком.", pl: "Codziennie rano chodzi do pracy pieszo.", highlight: "ходит" },
        { en: "Ты часто ездишь на машине?", pl: "Czy często jeździsz samochodem?", highlight: "ездишь" },
        { en: "Вчера мы ходили в театр.", pl: "Wczoraj byliśmy w teatrze. (poszliśmy i wróciliśmy)", highlight: "ходили" },
        { en: "Летом я поеду на море.", pl: "Latem pojadę nad morze.", highlight: "поеду" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Rozróżniaj środek transportu: pieszo — идти/ходить, pojazdem — ехать/ездить. "Я иду в Москву" ✗ brzmi jak piesza pielgrzymka — poprawnie "Я еду в Москву" ✓. Druga pułapka: "Вчера мы ходили в театр" to naturalny sposób powiedzenia „byliśmy wczoraj w teatrze” — poszliśmy i wróciliśmy, dlatego forma wielokierunkowa, nie "шли". Pytania pomocnicze: czy to teraz i w jedną stronę (иду), czy regularnie albo w obie strony (хожу/ходил)?',
    },
    {
      type: "quiz",
      question: "Wybierz formę dla ruchu tu i teraz, w jedną stronę: Сейчас я ___ в магазин.",
      options: ["хожу", "иду", "ходил"],
      correctIndex: 1,
      explanation:
        "Сейчас + jeden kierunek = forma jednokierunkowa: иду (idę właśnie teraz). Хожу opisuje czynność regularną, a ходил to czas przeszły.",
    },
    {
      type: "quiz",
      question: "Uzupełnij czasem przyszłym z przedrostkiem по-: Завтра я ___ в Санкт-Петербург на поезде.",
      options: ["еду", "поеду", "езжу"],
      correctIndex: 1,
      explanation:
        "Przedrostek по- tworzy czas przyszły dokonany: поеду (pojadę). Еду to czas teraźniejszy (jadę teraz), a езжу oznacza ruch regularny (jeżdżę).",
    },
  ],
};
