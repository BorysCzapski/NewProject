-- ============================================================================
-- supabase/seed/matura-es/07_lessons_czytanie.sql
-- Spanish theory for "Rozumienie tekstów pisanych", both levels.
--
-- This section is mostly TECHNIQUE, which is why its lessons are filed as
-- kind='strategia' rather than 'gramatyka'. The Spanish in a reading text is
-- usually within reach of a student who has done the środki językowe lessons;
-- what costs marks is method — reading the whole text first, missing that the
-- question paraphrases rather than quotes, or picking a distractor that
-- repeats a word from the text.
--
-- The one genuinely lexical lesson is the vocabulary of text organisation:
-- words like "sin embargo" or "en cambio" are what tell you a paragraph has
-- just changed direction, and missing one can flip an answer.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'es' and slug = 'czytanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  'jak-czytac-pod-zadanie',
  'Jak czytać pod zadanie',
  'Kolejność pracy z tekstem, która oszczędza czas i zmniejsza liczbę błędów.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Największy błąd w tej części to czytanie tekstu tak, jak czyta się książkę — od początku do końca, ze zrozumieniem każdego słowa. Na egzaminie nie masz na to czasu i nie musisz. Twoim celem jest znaleźć konkretne informacje, nie zrozumieć wszystko."
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
      ["5", "Dopiero potem wybierz odpowiedź", "unikasz sugerowania się pierwszym wrażeniem"]
    ],
    "caption": "Pytania zwykle idą w kolejności tekstu — odpowiedź na pytanie 3 jest zwykle za odpowiedzią na pytanie 2."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie musisz rozumieć każdego słowa. Jeśli utkniesz na nieznanym wyrazie, sprawdź, czy jest w ogóle potrzebny do odpowiedzi. W większości przypadków nie jest."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Odpowiedź MUSI mieć oparcie w tekście. Nie „wiadomo z życia”, nie „to logiczne” — ma być w tekście. Jeśli nie potrafisz wskazać zdania, na którym opierasz odpowiedź, prawdopodobnie zgadujesz."
  },
  {
    "type": "quiz",
    "question": "Nie znasz słowa w zdaniu, w którym jest odpowiedź. Co robisz?",
    "options": [
      "Zostawiam pytanie puste",
      "Zgaduję znaczenie z kontekstu i z budowy wyrazu",
      "Wybieram odpowiedź zawierającą to samo słowo"
    ],
    "correctIndex": 1,
    "explanation": "Kontekst i budowa wyrazu (przedrostek, przyrostek, podobieństwo do polskiego lub angielskiego) zwykle wystarczą. Ostatnia opcja to typowa pułapka — powtórzone słowo najczęściej oznacza dystraktor."
  }
]$content$,
  1
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  'typy-zadan-czytanie',
  'Typy zadań i jak podejść do każdego',
  'Dobieranie nagłówków, prawda/fałsz, wybór wielokrotny — inna taktyka do każdego.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "W tej części arkusza powtarzają się trzy-cztery typy zadań. Każdy ma swoją logikę i swoje pułapki, więc opłaca się mieć do każdego osobne podejście zamiast czytać wszystko tak samo."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Taktyka", "Pułapka"],
    "rows": [
      ["Dobieranie nagłówków", "czytaj pierwsze i ostatnie zdanie akapitu", "nagłówek pasujący do jednego zdania, nie do całości"],
      ["Prawda / fałsz", "szukaj dokładnego sformułowania", "zdanie prawdziwe, ale nieobecne w tekście"],
      ["Wybór wielokrotny", "eliminuj, nie wybieraj", "opcja z tym samym słowem co tekst"],
      ["Dobieranie osób do zdań", "rób tabelkę: kto co powiedział", "dwie osoby mówią podobnie"],
      ["Uzupełnianie luk zdaniami", "patrz na spójniki przed i po luce", "zdanie pasujące tematycznie, ale nie logicznie"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W zadaniach prawda/fałsz uwaga na zdania, które są PRAWDZIWE, ale nie wynikają z tekstu. Kryterium nie brzmi „czy to prawda”, tylko „czy tekst to mówi”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W wyborze wielokrotnym najpierw skreśl odpowiedzi ewidentnie złe. Zwykle zostają dwie i wtedy decyduje jeden szczegół — łatwiej go znaleźć, mając tylko dwie opcje przed oczami."
  },
  {
    "type": "table",
    "title": "Sygnały w zadaniu na dobieranie zdań",
    "headers": ["Przed luką", "Prawdopodobne zdanie w luce"],
    "rows": [
      ["Sin embargo, …", "zdanie przeciwstawne do poprzedniego"],
      ["Por eso, …", "skutek tego, co było wcześniej"],
      ["Por ejemplo, …", "konkretny przykład ogólnej tezy"],
      ["Además, …", "kolejny argument w tę samą stronę"],
      ["Es decir, …", "przeformułowanie poprzedniego zdania"]
    ],
    "caption": "Spójnik przed luką i po luce zawęża wybór szybciej niż sama treść."
  },
  {
    "type": "quiz",
    "question": "W tekście: „El museo abre de martes a domingo”. Zdanie: „El museo está cerrado los lunes”. Prawda czy fałsz?",
    "options": ["Prawda", "Fałsz", "Nie ma tej informacji"],
    "correctIndex": 0,
    "explanation": "Skoro otwarte jest od wtorku do niedzieli, poniedziałek zostaje poza tym zakresem. To typowa parafraza: informacja jest w tekście, ale wyrażona inaczej."
  },
  {
    "type": "matchPairs",
    "title": "Typ zadania → najważniejsza taktyka",
    "pairs": [
      { "left": "dobieranie nagłówków", "right": "pierwsze i ostatnie zdanie akapitu" },
      { "left": "prawda / fałsz", "right": "czy TEKST to mówi" },
      { "left": "wybór wielokrotny", "right": "eliminuj złe odpowiedzi" },
      { "left": "uzupełnianie luk zdaniami", "right": "patrz na spójniki wokół luki" }
    ]
  }
]$content$,
  2
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  'parafrazy-w-zadaniach',
  'Parafraza — dlaczego odpowiedź nigdy nie jest cytatem',
  'CKE nigdy nie przepisuje zdania z tekstu. Oto jak rozpoznać to samo znaczenie w innych słowach.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Zasada, która tłumaczy większość błędów w tej części: poprawna odpowiedź prawie nigdy nie używa tych samych słów co tekst. Jest parafrazą. A opcja, która POWTARZA słowa z tekstu, to zwykle dystraktor zastawiony właśnie na tych, którzy szukają wzrokowo."
  },
  {
    "type": "table",
    "title": "Typowe parafrazy",
    "headers": ["W tekście", "W zadaniu", "Mechanizm"],
    "rows": [
      ["Es barato.", "No cuesta mucho.", "przeczenie przeciwieństwa"],
      ["Abre de martes a domingo.", "Cierra los lunes.", "wnioskowanie z zakresu"],
      ["Trabaja desde hace diez años.", "Lleva diez años trabajando.", "inna konstrukcja, to samo znaczenie"],
      ["No le gustó nada.", "Le pareció decepcionante.", "synonim o mocniejszym rejestrze"],
      ["Casi todos los alumnos", "La mayoría de los alumnos", "wyrażenie ilościowe"],
      ["Decidió no ir.", "Cambió de opinión.", "opis zamiast faktu"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nauka słownictwa z synonimami zwraca się w tej części podwójnie. Jeśli znasz „barato” i „económico”, „decepcionante” i „no gustar nada”, parafrazy przestają być pułapką."
  },
  {
    "type": "matchPairs",
    "title": "Zdanie z tekstu → jego parafraza",
    "pairs": [
      { "left": "Es muy económico.", "right": "No cuesta mucho." },
      { "left": "Lleva tres años allí.", "right": "Vive allí desde 2022." },
      { "left": "Casi nadie vino.", "right": "Vino muy poca gente." },
      { "left": "Le encantó la película.", "right": "La película le pareció excelente." },
      { "left": "Suele llegar tarde.", "right": "Normalmente no es puntual." }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: dokończ parafrazę",
    "items": [
      { "before": "Es barato. → No ", "after": " mucho.", "accept": ["cuesta"], "hint": "costar", "pl": "Nie kosztuje dużo." },
      { "before": "Trabaja aquí desde hace cinco años. → ", "after": " cinco años trabajando aquí.", "accept": ["Lleva", "lleva"], "hint": "llevar + czas + gerundio", "pl": "Pracuje tu od pięciu lat." },
      { "before": "No me gustó nada. → Me pareció ", "after": ".", "accept": ["decepcionante", "malo", "terrible"], "hint": "przymiotnik oceniający", "pl": "Wydało mi się rozczarowujące." }
    ]
  },
  {
    "type": "quiz",
    "question": "Tekst: „La entrada es gratuita para menores de 12 años”. Która odpowiedź jest poprawna?",
    "options": [
      "Los niños de 10 años no pagan.",
      "La entrada es gratuita para todos.",
      "Los menores de 12 años pagan menos."
    ],
    "correctIndex": 0,
    "explanation": "Dziesięciolatek ma mniej niż 12 lat, więc wchodzi za darmo — to parafraza. Trzecia opcja powtarza „menores de 12 años” prosto z tekstu, ale zmienia sens: darmo to nie „taniej”."
  }
]$content$,
  3
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'czytanie'),
  'intencja-autora',
  'Intencja autora i ton tekstu',
  'Pytania, na które odpowiedzi nie ma wprost w żadnym zdaniu — trzeba ją wywnioskować.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu dochodzą pytania o intencję: „¿Cuál es el propósito del texto?”, „¿Qué actitud muestra el autor?”. Odpowiedzi nie ma w żadnym pojedynczym zdaniu — wynika z całości, z doboru słów i z tego, czego autor NIE mówi."
  },
  {
    "type": "table",
    "title": "Cele tekstu i po czym je poznać",
    "headers": ["Cel", "Sygnały językowe"],
    "rows": [
      ["informar", "dane, liczby, czas przeszły, brak ocen"],
      ["convencer / persuadir", "pytania retoryczne, tryb rozkazujący, deberíamos"],
      ["criticar", "ironia, cudzysłów, so-called, słowa nacechowane"],
      ["advertir", "czas przyszły, warunki, riesgo, peligro"],
      ["entretener", "anegdota, humor, narracja w 1. osobie"],
      ["recomendar", "conviene, merece la pena, te aconsejo"]
    ]
  },
  {
    "type": "table",
    "title": "Postawa autora — słowa, które ją zdradzają",
    "headers": ["Postawa", "Typowe wyrażenia"],
    "rows": [
      ["entuzjastyczna", "sin duda, extraordinario, una joya"],
      ["krytyczna", "lamentablemente, resulta preocupante, deja mucho que desear"],
      ["neutralna", "según los datos, se estima que, cabe señalar"],
      ["sceptyczna", "supuestamente, al parecer, habría que comprobar"],
      ["ironiczna", "cudzysłów, przesada, kontrast między słowami a faktami"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Nie myl postawy AUTORA z postawą osoby cytowanej w tekście. Autor może przytoczyć czyjąś entuzjastyczną opinię właśnie po to, żeby ją podważyć. Pytaj: kto to mówi?"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ostatni akapit zwykle zdradza intencję najwięcej. Jeśli tekst kończy się apelem — autor przekonuje. Jeśli podsumowaniem danych — informuje. Jeśli pytaniem — chce sprowokować do myślenia."
  },
  {
    "type": "matchPairs",
    "title": "Wyrażenie → postawa autora",
    "pairs": [
      { "left": "resulta preocupante", "right": "krytyczna" },
      { "left": "según los datos", "right": "neutralna" },
      { "left": "sin duda extraordinario", "right": "entuzjastyczna" },
      { "left": "al parecer, supuestamente", "right": "sceptyczna" },
      { "left": "deberíamos actuar ya", "right": "przekonująca" }
    ]
  },
  {
    "type": "quiz",
    "question": "Tekst kończy się zdaniem: „¿Cuánto tiempo más vamos a esperar?”. Jaki jest najprawdopodobniej cel autora?",
    "options": ["Informar sobre un hecho", "Convencer al lector de actuar", "Entretener al lector"],
    "correctIndex": 1,
    "explanation": "Pytanie retoryczne w ostatnim zdaniu to klasyczny sygnał perswazji — autor nie oczekuje odpowiedzi, tylko chce, żeby czytelnik poczuł potrzebę działania."
  }
]$content$,
  4
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'czytanie'),
  'dobieranie-zdan',
  'Dobieranie zdań do luk',
  'Najtrudniejszy typ zadania na rozszerzeniu. Rozstrzygają zaimki i spójniki, nie temat.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "W tym zadaniu z tekstu usunięto kilka zdań i trzeba je wstawić z powrotem. Podanych zdań jest zawsze więcej niż luk. Kluczowa zmiana nastawienia: nie szukaj zdania o tym samym TEMACIE — szukaj zdania, które PASUJE GRAMATYCZNIE I LOGICZNIE do sąsiedztwa luki."
  },
  {
    "type": "table",
    "title": "Na co patrzeć — w tej kolejności",
    "headers": ["Trop", "Przykład", "Co mówi"],
    "rows": [
      ["zaimek na początku zdania", "Esto significa que…", "poprzednie zdanie zawiera to, do czego odsyła „esto”"],
      ["spójnik", "Sin embargo, …", "poprzednie zdanie mówi coś przeciwnego"],
      ["rodzajnik określony", "El problema mencionado…", "problem musiał być wcześniej wymieniony"],
      ["liczba mnoga / pojedyncza", "Ambos países…", "wcześniej muszą być dwa kraje"],
      ["czas czasownika", "Había ocurrido antes", "porządkuje chronologię"],
      ["powtórzenie leksykalne", "esta medida", "wcześniej musi paść „medida”"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zacznij od luk, których jesteś PEWNY. Każde wstawione zdanie zmniejsza pulę i ułatwia resztę. Zostaw na koniec te, przy których wahasz się między dwoma."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po wstawieniu wszystkich zdań przeczytaj cały tekst ciągiem. Jeśli w którymś miejscu zgrzyta, prawie na pewno pomyliłeś dwie luki między sobą — to najczęstszy układ błędu."
  },
  {
    "type": "examples",
    "title": "Jak trop rozstrzyga",
    "items": [
      { "en": "Luka, a po niej: „Ambas propuestas fueron rechazadas.”", "pl": "W luce muszą być wymienione DWIE propozycje — „ambas” tego wymaga.", "highlight": "Ambas" },
      { "en": "Luka, a przed nią: „El coste sería enorme.”", "pl": "Zdanie zaczynające się od „Sin embargo” dobrze pasuje — zapowiada kontrast.", "highlight": "Sin embargo" },
      { "en": "Luka, a po niej: „Esta decisión sorprendió a todos.”", "pl": "W luce musi paść jakaś decyzja — „esta decisión” do niej odsyła.", "highlight": "Esta decisión" }
    ]
  },
  {
    "type": "quiz",
    "question": "Po luce stoi: „Ambos métodos tienen inconvenientes”. Czego szukasz w zdaniu do luki?",
    "options": [
      "Zdania o wadach",
      "Zdania, w którym pojawiają się DWIE metody",
      "Zdania z tym samym słowem „inconveniente”"
    ],
    "correctIndex": 1,
    "explanation": "„Ambos” znaczy „obydwa” i musi mieć do czego się odnieść. To trop gramatyczny, mocniejszy niż tematyczny — trzecia opcja to typowa pułapka na powtórzone słowo."
  }
]$content$,
  5
);
