-- ============================================================================
-- supabase/seed/matura/07_lessons_czytanie.sql
-- English theory for "Rozumienie tekstów pisanych", both levels.
--
-- Mostly TECHNIQUE, hence kind='strategia'. The English in a reading text is
-- usually within reach of a student who has done the środki językowe lessons;
-- what costs marks is method — reading the whole text first, missing that the
-- question paraphrases rather than quotes, or picking the distractor that
-- repeats a word from the text.
--
-- The lexical exception earns its place: the vocabulary of text organisation.
-- Missing a "however" can flip an answer.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'en' and slug = 'czytanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  'jak-czytac-pod-zadanie',
  'Jak czytać pod zadanie',
  'Kolejność pracy z tekstem, która oszczędza czas i zmniejsza liczbę błędów.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Największy błąd w tej części to czytanie tekstu jak książki — od początku do końca, ze zrozumieniem każdego słowa. Na egzaminie nie masz na to czasu i nie musisz. Szukasz konkretnych informacji, nie rozumiesz wszystkiego."
  },
  {
    "type": "table",
    "title": "Kolejność, która działa",
    "headers": ["Krok", "Co robisz", "Po co"],
    "rows": [
      ["1", "Przeczytaj POLECENIE i pytania", "wiesz, czego szukasz"],
      ["2", "Przejrzyj tekst pobieżnie (30 s)", "orientujesz się w temacie i strukturze"],
      ["3", "Wróć do pytania 1 i znajdź jego fragment", "czytasz punktowo, nie liniowo"],
      ["4", "Podkreśl w tekście miejsce z odpowiedzią", "łatwiej zweryfikować przy sprawdzaniu"],
      ["5", "Dopiero potem wybierz odpowiedź", "unikasz pierwszego wrażenia"]
    ],
    "caption": "Pytania zwykle idą w kolejności tekstu — odpowiedź na pytanie 3 jest zwykle za odpowiedzią na pytanie 2."
  },
  {
    "type": "table",
    "title": "Dwie techniki czytania",
    "headers": ["Technika", "Po co", "Kiedy"],
    "rows": [
      ["skimming", "ogólny sens, temat akapitu", "pierwsze przejrzenie tekstu"],
      ["scanning", "konkretna informacja: data, nazwa, liczba", "szukanie odpowiedzi na pytanie"]
    ],
    "caption": "Skimming czyta się szybko całość; scanning przebiega wzrokiem po tekście w poszukiwaniu jednego elementu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie musisz rozumieć każdego słowa. Jeśli utkniesz na nieznanym wyrazie, sprawdź, czy jest w ogóle potrzebny do odpowiedzi. Zwykle nie jest."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Odpowiedź MUSI mieć oparcie w tekście. Nie „wiadomo skądinąd”, nie „to logiczne”. Jeśli nie umiesz wskazać zdania, na którym opierasz odpowiedź, prawdopodobnie zgadujesz."
  },
  {
    "type": "quiz",
    "question": "Nie znasz słowa w zdaniu, w którym jest odpowiedź. Co robisz?",
    "options": [
      "Zostawiam pytanie puste",
      "Zgaduję znaczenie z kontekstu i budowy wyrazu",
      "Wybieram odpowiedź zawierającą to samo słowo"
    ],
    "correctIndex": 1,
    "explanation": "Kontekst i budowa wyrazu (przedrostek, przyrostek, podobieństwo do polskiego) zwykle wystarczą. Ostatnia opcja to typowa pułapka — powtórzone słowo najczęściej oznacza dystraktor."
  }
]$content$,
  1
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  'typy-zadan-czytanie',
  'Typy zadań i jak podejść do każdego',
  'Dobieranie nagłówków, prawda/fałsz, wybór wielokrotny — inna taktyka do każdego.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "W tej części powtarzają się trzy-cztery typy zadań. Każdy ma swoją logikę i swoje pułapki, więc opłaca się mieć do każdego osobne podejście zamiast czytać wszystko tak samo."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Taktyka", "Pułapka"],
    "rows": [
      ["Dobieranie nagłówków", "czytaj pierwsze i ostatnie zdanie akapitu", "nagłówek pasujący do jednego zdania, nie do całości"],
      ["Prawda / fałsz / brak informacji", "trzy możliwości, nie dwie", "zdanie prawdziwe, ale nieobecne w tekście"],
      ["Wybór wielokrotny", "eliminuj, nie wybieraj", "opcja z tym samym słowem co tekst"],
      ["Dobieranie osób do zdań", "tabelka: kto co powiedział", "dwie osoby mówią podobnie"],
      ["Uzupełnianie luk zdaniami", "patrz na spójniki przed i po luce", "zdanie pasujące tematycznie, nie logicznie"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na trzecią opcję NOT GIVEN. „False” znaczy, że tekst mówi coś przeciwnego. „Not given” znaczy, że tekst w ogóle o tym nie wspomina. Mylenie tych dwóch to najczęstszy błąd w tym typie zadania."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W wyborze wielokrotnym najpierw skreśl odpowiedzi ewidentnie złe. Zwykle zostają dwie i wtedy decyduje jeden szczegół — łatwiej go znaleźć, mając przed oczami tylko dwie opcje."
  },
  {
    "type": "table",
    "title": "Sygnały w zadaniu na dobieranie zdań",
    "headers": ["Przed luką", "Prawdopodobne zdanie w luce"],
    "rows": [
      ["However, …", "zdanie przeciwstawne do poprzedniego"],
      ["Therefore, …", "skutek tego, co było wcześniej"],
      ["For example, …", "konkretny przykład ogólnej tezy"],
      ["Moreover, …", "kolejny argument w tę samą stronę"],
      ["In other words, …", "przeformułowanie poprzedniego zdania"]
    ],
    "caption": "Spójnik przed luką i po luce zawęża wybór szybciej niż sama treść."
  },
  {
    "type": "quiz",
    "question": "W tekście: „The museum is open Tuesday to Sunday”. Zdanie: „The museum is closed on Mondays.” Prawda, fałsz czy brak informacji?",
    "options": ["Prawda", "Fałsz", "Brak informacji"],
    "correctIndex": 0,
    "explanation": "Skoro otwarte jest od wtorku do niedzieli, poniedziałek zostaje poza zakresem. To parafraza: informacja jest w tekście, tylko wyrażona inaczej."
  },
  {
    "type": "matchPairs",
    "title": "Typ zadania → najważniejsza taktyka",
    "pairs": [
      { "left": "dobieranie nagłówków", "right": "pierwsze i ostatnie zdanie akapitu" },
      { "left": "true / false / not given", "right": "czy TEKST to mówi" },
      { "left": "wybór wielokrotny", "right": "eliminuj złe odpowiedzi" },
      { "left": "uzupełnianie luk zdaniami", "right": "patrz na spójniki wokół luki" }
    ]
  }
]$content$,
  2
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  'parafrazy-w-zadaniach',
  'Parafraza — dlaczego odpowiedź nigdy nie jest cytatem',
  'CKE nie przepisuje zdań z tekstu. Oto jak rozpoznać to samo znaczenie w innych słowach.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Zasada, która tłumaczy większość błędów w tej części: poprawna odpowiedź prawie nigdy nie używa tych samych słów co tekst. Jest parafrazą. A opcja, która POWTARZA słowa z tekstu, to zwykle dystraktor — zastawiony właśnie na tych, którzy szukają wzrokowo."
  },
  {
    "type": "table",
    "title": "Typowe parafrazy",
    "headers": ["W tekście", "W zadaniu", "Mechanizm"],
    "rows": [
      ["It is cheap.", "It doesn't cost much.", "przeczenie przeciwieństwa"],
      ["Open Tuesday to Sunday.", "Closed on Mondays.", "wnioskowanie z zakresu"],
      ["He has worked here for ten years.", "He started working here in 2015.", "przeliczenie czasu"],
      ["She didn't enjoy it at all.", "She found it disappointing.", "synonim o mocniejszym rejestrze"],
      ["Almost all students", "The majority of students", "wyrażenie ilościowe"],
      ["He changed his mind.", "He decided not to go.", "opis zamiast faktu"],
      ["It is compulsory.", "You have to do it.", "przekład rejestru"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nauka słownictwa z synonimami zwraca się w tej części podwójnie. Kto zna parę „cheap / inexpensive” i „disappointing / not enjoyable”, przestaje wpadać w parafrazy."
  },
  {
    "type": "matchPairs",
    "title": "Zdanie z tekstu → jego parafraza",
    "pairs": [
      { "left": "It is very inexpensive.", "right": "It doesn't cost much." },
      { "left": "He has lived there for three years.", "right": "He moved there in 2022." },
      { "left": "Hardly anyone came.", "right": "Very few people attended." },
      { "left": "She loved the film.", "right": "She found the film excellent." },
      { "left": "He tends to be late.", "right": "He is usually not punctual." }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: dokończ parafrazę",
    "items": [
      { "before": "It is cheap. → It doesn't ", "after": " much.", "accept": ["cost"], "hint": "cost", "pl": "Nie kosztuje dużo." },
      { "before": "Attendance is compulsory. → You ", "after": " attend.", "accept": ["have to", "must"], "hint": "obowiązek", "pl": "Musisz uczestniczyć." },
      { "before": "She didn't like it. → She found it ", "after": ".", "accept": ["disappointing", "boring", "poor"], "hint": "przymiotnik oceniający", "pl": "Uznała to za rozczarowujące." }
    ]
  },
  {
    "type": "quiz",
    "question": "Tekst: „Entry is free for children under 12.” Która odpowiedź jest poprawna?",
    "options": [
      "A ten-year-old does not pay.",
      "Entry is free for everyone.",
      "Children under 12 pay less."
    ],
    "correctIndex": 0,
    "explanation": "Dziesięciolatek ma mniej niż 12 lat, więc wchodzi za darmo — to parafraza. Trzecia opcja powtarza „children under 12” prosto z tekstu, ale zmienia sens: za darmo to nie „taniej”."
  }
]$content$,
  3
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'czytanie'),
  'intencja-autora',
  'Intencja autora i ton tekstu',
  'Pytania, na które odpowiedzi nie ma w żadnym pojedynczym zdaniu.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu dochodzą pytania o intencję: „What is the purpose of the text?”, „What is the author's attitude?”. Odpowiedzi nie ma w żadnym pojedynczym zdaniu — wynika z całości, z doboru słów i z tego, czego autor NIE mówi."
  },
  {
    "type": "table",
    "title": "Cele tekstu i po czym je poznać",
    "headers": ["Cel", "Sygnały językowe"],
    "rows": [
      ["to inform", "dane, liczby, czas przeszły, brak ocen"],
      ["to persuade", "pytania retoryczne, tryb rozkazujący, we should"],
      ["to criticise", "ironia, cudzysłów, so-called, słowa nacechowane"],
      ["to warn", "czas przyszły, warunki, risk, danger"],
      ["to entertain", "anegdota, humor, narracja w 1. osobie"],
      ["to recommend", "it is worth, I would suggest, do try"]
    ]
  },
  {
    "type": "table",
    "title": "Postawa autora — słowa, które ją zdradzają",
    "headers": ["Postawa", "Typowe wyrażenia"],
    "rows": [
      ["enthusiastic", "undoubtedly, remarkable, a real gem"],
      ["critical", "unfortunately, worrying, leaves much to be desired"],
      ["neutral / objective", "according to the data, it is estimated, research shows"],
      ["sceptical", "allegedly, supposedly, it remains to be seen"],
      ["ironic", "cudzysłów, przesada, kontrast słów i faktów"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Nie myl postawy AUTORA z postawą osoby cytowanej. Autor może przytoczyć czyjąś entuzjastyczną opinię właśnie po to, żeby ją podważyć. Zawsze pytaj: kto to mówi?"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ostatni akapit zdradza intencję najczęściej. Apel na koniec — autor przekonuje. Podsumowanie danych — informuje. Pytanie — chce sprowokować do myślenia."
  },
  {
    "type": "matchPairs",
    "title": "Wyrażenie → postawa autora",
    "pairs": [
      { "left": "leaves much to be desired", "right": "krytyczna" },
      { "left": "according to the data", "right": "neutralna" },
      { "left": "undoubtedly remarkable", "right": "entuzjastyczna" },
      { "left": "allegedly, supposedly", "right": "sceptyczna" },
      { "left": "we should act now", "right": "przekonująca" }
    ]
  },
  {
    "type": "quiz",
    "question": "Tekst kończy się zdaniem: „How much longer are we going to wait?”. Jaki jest najprawdopodobniej cel autora?",
    "options": ["To inform about a fact", "To persuade the reader to act", "To entertain the reader"],
    "correctIndex": 1,
    "explanation": "Pytanie retoryczne w ostatnim zdaniu to klasyczny sygnał perswazji — autor nie oczekuje odpowiedzi, tylko chce, żeby czytelnik poczuł potrzebę działania."
  }
]$content$,
  4
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'czytanie'),
  'dobieranie-zdan',
  'Dobieranie zdań do luk',
  'Najtrudniejszy typ zadania na rozszerzeniu. Rozstrzygają zaimki i spójniki, nie temat.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "Z tekstu usunięto kilka zdań, trzeba je wstawić z powrotem, a podanych zdań jest więcej niż luk. Kluczowa zmiana nastawienia: nie szukaj zdania o tym samym TEMACIE — szukaj zdania, które PASUJE GRAMATYCZNIE I LOGICZNIE do sąsiedztwa luki."
  },
  {
    "type": "table",
    "title": "Na co patrzeć — w tej kolejności",
    "headers": ["Trop", "Przykład", "Co mówi"],
    "rows": [
      ["zaimek na początku zdania", "This means that…", "poprzednie zdanie zawiera to, do czego odsyła „this”"],
      ["spójnik", "However, …", "poprzednie zdanie mówi coś przeciwnego"],
      ["przedimek określony", "The problem mentioned…", "problem musiał być wcześniej wymieniony"],
      ["liczba mnoga / pojedyncza", "Both countries…", "wcześniej muszą być dwa kraje"],
      ["czas czasownika", "It had happened before", "porządkuje chronologię"],
      ["powtórzenie leksykalne", "such measures", "wcześniej musi paść „measure”"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zacznij od luk, których jesteś PEWNY. Każde wstawione zdanie zmniejsza pulę i ułatwia resztę. Na koniec zostaw te, przy których wahasz się między dwoma."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po wstawieniu wszystkiego przeczytaj cały tekst ciągiem. Jeśli w którymś miejscu zgrzyta, prawie na pewno zamieniłeś dwie luki miejscami — to najczęstszy układ błędu."
  },
  {
    "type": "examples",
    "title": "Jak trop rozstrzyga",
    "items": [
      { "en": "Luka, a po niej: „Both proposals were rejected.”", "pl": "W luce muszą być wymienione DWIE propozycje — „both” tego wymaga.", "highlight": "Both" },
      { "en": "Luka, a przed nią: „The cost would be enormous.”", "pl": "Zdanie zaczynające się od „However” pasuje — zapowiada kontrast.", "highlight": "However" },
      { "en": "Luka, a po niej: „This decision surprised everyone.”", "pl": "W luce musi paść jakaś decyzja — „this decision” do niej odsyła.", "highlight": "This decision" }
    ]
  },
  {
    "type": "quiz",
    "question": "Po luce stoi: „Both methods have drawbacks”. Czego szukasz w zdaniu do luki?",
    "options": [
      "Zdania o wadach",
      "Zdania, w którym pojawiają się DWIE metody",
      "Zdania z tym samym słowem „drawback”"
    ],
    "correctIndex": 1,
    "explanation": "„Both” musi mieć do czego się odnieść. To trop gramatyczny, mocniejszy niż tematyczny — trzecia opcja to typowa pułapka na powtórzone słowo."
  }
]$content$,
  5
);
