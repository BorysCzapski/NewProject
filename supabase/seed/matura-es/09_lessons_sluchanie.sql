-- ============================================================================
-- supabase/seed/matura-es/09_lessons_sluchanie.sql
-- Spanish theory for "Rozumienie ze słuchu", both levels.
--
-- LESSONS ONLY, NO TASKS — deliberately. A listening task needs a real,
-- still-reachable recording; the exact-match task shape this module uses
-- carries a youtubeVideoId, and inventing one would give the student a dead
-- player. An honest "brak zadań" is better than a broken one. The English
-- section has tasks (../matura/10_tasks_sluchanie.sql) because its video ids
-- were verified; the Spanish ones still need to be.
--
-- That makes the theory here carry the whole section, so it is deliberately
-- fuller than a lesson accompanying a task bank would be. Most of it is
-- technique, plus one properly lexical lesson: spoken Spanish is not written
-- Spanish, and a student who has only ever read the language is meeting
-- "vale", "o sea" and swallowed syllables for the first time under exam
-- conditions.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'es' and slug = 'sluchanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'sluchanie'),
  'jak-sluchac',
  'Jak wykorzystać dwa odsłuchania',
  'Nagranie leci dwa razy i to nie przypadek. Każde odsłuchanie ma inne zadanie.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Każde nagranie odtwarzane jest DWA RAZY, a przed pierwszym masz czas na przeczytanie zadań. To nie jest uprzejmość — to część konstrukcji egzaminu i można to zaplanować. Największy błąd to traktować oba odsłuchania tak samo."
  },
  {
    "type": "table",
    "title": "Plan na jedno nagranie",
    "headers": ["Moment", "Co robisz"],
    "rows": [
      ["Przed nagraniem", "czytasz zadania, podkreślasz słowa kluczowe, przewidujesz temat"],
      ["Pierwsze odsłuchanie", "łapiesz OGÓLNY sens, zaznaczasz odpowiedzi pewne, resztę zostawiasz"],
      ["Przerwa", "patrzysz tylko na pytania bez odpowiedzi"],
      ["Drugie odsłuchanie", "polujesz na te konkretne informacje"],
      ["Po nagraniu", "uzupełniasz wszystkie puste pola, nawet zgadując"]
    ],
    "caption": "Pierwsze odsłuchanie to mapa, drugie to polowanie. Odwrotna kolejność nie działa."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Nie zatrzymuj się na jednym niezrozumianym zdaniu. Zgubisz kolejne trzydzieści sekund, a razem z nimi dwa pytania. Odpuść, słuchaj dalej, wróć przy drugim odsłuchaniu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Czas na przeczytanie zadań przed nagraniem wykorzystaj do przewidywania. Jeśli w pytaniach są godziny, będą godziny. Jeśli są ceny — będą liczby. Ucho przygotowane na konkretny typ informacji łapie go znacznie łatwiej."
  },
  {
    "type": "quiz",
    "question": "Podczas pierwszego odsłuchania nie zrozumiałeś jednego zdania. Co robisz?",
    "options": [
      "Wracam myślami do tego zdania i próbuję je odtworzyć",
      "Słucham dalej, wracam do tego przy drugim odsłuchaniu",
      "Zaznaczam losową odpowiedź i przechodzę dalej"
    ],
    "correctIndex": 1,
    "explanation": "Zatrzymanie się kosztuje kolejne pytania. Nagranie leci dalej niezależnie od ciebie — od tego jest drugie odsłuchanie."
  }
]$content$,
  1
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'sluchanie'),
  'liczby-daty-nazwy',
  'Liczby, daty i nazwy własne',
  'Informacje, które najłatwiej przegapić, i sposób na ich zapisywanie.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Liczby są w hiszpańskim wymawiane szybko i często zlewają się z sąsiednimi wyrazami. To najczęstsze źródło straconych punktów w tej części, bo pytanie o godzinę albo cenę jest łatwe — pod warunkiem, że usłyszałeś liczbę."
  },
  {
    "type": "table",
    "title": "Liczby, które brzmią podobnie",
    "headers": ["Para", "Różnica", "Wskazówka"],
    "rows": [
      ["sesenta / setenta", "60 / 70", "sesenta ma s w środku, setenta ma t"],
      ["dieciséis / sesenta", "16 / 60", "dieciséis zaczyna się od die-"],
      ["catorce / cuarenta", "14 / 40", "cuarenta ma cua- na początku"],
      ["cien / ciento", "100 / 100 z czymś", "ciento zawsze przed inną liczbą"],
      ["quince / quinientos", "15 / 500", "quinientos jest wyraźnie dłuższe"],
      ["doscientos / trescientos", "200 / 300", "słuchaj pierwszej sylaby"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zapisuj liczby cyframi od razu, w trakcie słuchania — nie zapamiętuj. Nawet jeśli nie wiesz jeszcze, czy będzie potrzebna. Zapisanie „16:30” zajmuje sekundę, odtworzenie z pamięci po minucie zwykle się nie udaje."
  },
  {
    "type": "table",
    "title": "Daty i godziny po hiszpańsku",
    "headers": ["Forma", "Znaczenie", "Uwaga"],
    "rows": [
      ["el tres de mayo", "3 maja", "dzień przed miesiącem, bez rodzajnika przed miesiącem"],
      ["a las tres y media", "o wpół do czwartej", "y media = i pół, czyli 3:30"],
      ["a las tres menos cuarto", "za kwadrans trzecia", "menos = przed pełną godziną"],
      ["a mediodía", "w południe", "nie „a las doce” w mowie potocznej"],
      ["el fin de semana", "weekend", "często mylone z „el viernes”"],
      ["dentro de dos semanas", "za dwa tygodnie", "dentro de = za (w przyszłości)"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Y media” to wpół do NASTĘPNEJ godziny po polsku: „las tres y media” to 3:30, czyli po polsku „wpół do czwartej”. Automatyczne tłumaczenie „trzy i pół” prowadzi prosto do błędu."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zapisz cyframi",
    "instruction": "Wpisz samą liczbę albo godzinę.",
    "items": [
      { "before": "setenta y cinco = ", "after": "", "accept": ["75"], "hint": "setenta = 70", "pl": "siedemdziesiąt pięć" },
      { "before": "las cuatro y cuarto = ", "after": "", "accept": ["4:15", "16:15"], "hint": "y cuarto = kwadrans po", "pl": "kwadrans po czwartej" },
      { "before": "las nueve menos diez = ", "after": "", "accept": ["8:50", "20:50"], "hint": "menos = przed pełną godziną", "pl": "za dziesięć dziewiąta" },
      { "before": "doscientos treinta = ", "after": "", "accept": ["230"], "hint": "doscientos = 200", "pl": "dwieście trzydzieści" }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Hiszpański → liczba",
    "pairs": [
      { "left": "dieciséis", "right": "16" },
      { "left": "sesenta", "right": "60" },
      { "left": "setenta", "right": "70" },
      { "left": "cuarenta", "right": "40" },
      { "left": "quinientos", "right": "500" }
    ]
  }
]$content$,
  2
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'sluchanie'),
  'jezyk-mowiony',
  'Język mówiony — czego nie ma w podręczniku',
  'Wypełniacze, skróty i połknięte sylaby. Bez nich nagranie brzmi szybciej, niż jest.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Hiszpański mówiony różni się od pisanego bardziej, niż podejrzewa ktoś, kto uczył się wyłącznie z podręcznika. Nagrania maturalne są autentyczne albo udają autentyczne, więc pełno w nich wypełniaczy i skrótów wymowy. Znajomość kilkunastu z nich zmienia odbiór całego nagrania."
  },
  {
    "type": "keyPhrases",
    "title": "Wypełniacze i zwroty rozmowy",
    "caption": "Nie niosą treści, ale zajmują czas i mylą, jeśli się ich nie rozpoznaje.",
    "groups": [
      {
        "label": "Wypełniacze",
        "phrases": [
          { "text": "bueno…", "pl": "no więc… (początek wypowiedzi)" },
          { "text": "o sea", "pl": "to znaczy" },
          { "text": "pues nada", "pl": "no i tyle" },
          { "text": "es que…", "pl": "chodzi o to, że…" },
          { "text": "vamos", "pl": "no wiesz, że tak powiem" },
          { "text": "en plan", "pl": "typu, w stylu (bardzo potoczne)" }
        ]
      },
      {
        "label": "Reakcje",
        "phrases": [
          { "text": "vale", "pl": "dobra, w porządku" },
          { "text": "claro", "pl": "jasne" },
          { "text": "¡qué va!", "pl": "coś ty! (zaprzeczenie)" },
          { "text": "¡venga!", "pl": "no dawaj! / no już!" },
          { "text": "ni hablar", "pl": "nie ma mowy" },
          { "text": "por supuesto", "pl": "oczywiście" }
        ]
      },
      {
        "label": "Sygnały zmiany tematu",
        "phrases": [
          { "text": "por cierto", "pl": "à propos" },
          { "text": "a propósito", "pl": "przy okazji" },
          { "text": "cambiando de tema", "pl": "zmieniając temat" },
          { "text": "volviendo a lo de antes", "pl": "wracając do tego, co było" }
        ]
      }
    ]
  },
  {
    "type": "table",
    "title": "Skróty wymowy — dlaczego nie słyszysz słów, które znasz",
    "headers": ["Zapis", "Wymowa potoczna", "Zjawisko"],
    "rows": [
      ["para", "pa", "skrócenie"],
      ["está", "tá", "połknięcie pierwszej sylaby"],
      ["nada", "na-a", "zanik d między samogłoskami"],
      ["cansado", "cansao", "to samo, bardzo częste w imiesłowach"],
      ["todo el día", "to-el-día", "łączenie wyrazów"],
      ["¿qué es esto?", "quesesto", "zlewanie się samogłosek"],
      ["los amigos", "losamigos", "łączenie międzywyrazowe"]
    ],
    "caption": "Zanik d w końcówce -ado (cansado → cansao) to najczęstsza cecha potocznej wymowy w Hiszpanii."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Jeśli w nagraniu słyszysz „cansao”, „acabao”, „terminao” — to zwykłe imiesłowy na -ado. Rozpoznanie tego jednego wzorca odblokowuje kilkanaście słów naraz."
  },
  {
    "type": "matchPairs",
    "title": "Potocznie → poprawnie",
    "pairs": [
      { "left": "cansao", "right": "cansado" },
      { "left": "pa mí", "right": "para mí" },
      { "left": "na-a", "right": "nada" },
      { "left": "tá bien", "right": "está bien" },
      { "left": "to-el-día", "right": "todo el día" }
    ]
  },
  {
    "type": "quiz",
    "question": "W nagraniu ktoś mówi: „Bueno, es que, o sea, no sé…”. Ile informacji niesie ta wypowiedź?",
    "options": ["Trzy różne argumenty", "Praktycznie żadnej — to same wypełniacze", "Zdanie przeczące"],
    "correctIndex": 1,
    "explanation": "„Bueno”, „es que” i „o sea” to wypełniacze — mówiący zbiera myśli. Kto ich nie rozpoznaje, próbuje w nich szukać treści i gubi to, co pada zaraz potem."
  }
]$content$,
  3
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'sluchanie'),
  'opinie-i-ton',
  'Opinie, ton i intencja mówiącego',
  'Na rozszerzeniu pytają nie o fakty, tylko o to, co mówiący naprawdę myśli.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie rozszerzonym pytania rzadko brzmią „o której godzinie” — częściej „jaką postawę wyraża mówiący” albo „po co to mówi”. Odpowiedź bywa ukryta w tonie i w jednym słowie oceniającym, nie w treści zdania."
  },
  {
    "type": "keyPhrases",
    "title": "Sygnały postawy",
    "caption": "Jedno takie wyrażenie często decyduje o całej odpowiedzi.",
    "groups": [
      {
        "label": "Aprobata",
        "phrases": [
          { "text": "me parece estupendo", "pl": "wydaje mi się świetne" },
          { "text": "estoy totalmente de acuerdo", "pl": "całkowicie się zgadzam" },
          { "text": "no está nada mal", "pl": "wcale nieźle" },
          { "text": "merece la pena", "pl": "warto" }
        ]
      },
      {
        "label": "Dezaprobata",
        "phrases": [
          { "text": "no me convence", "pl": "nie przekonuje mnie" },
          { "text": "deja mucho que desear", "pl": "pozostawia wiele do życzenia" },
          { "text": "es una pena que…", "pl": "szkoda, że…" },
          { "text": "no me hace ninguna gracia", "pl": "wcale mi się to nie podoba" }
        ]
      },
      {
        "label": "Wahanie i zastrzeżenie",
        "phrases": [
          { "text": "hasta cierto punto", "pl": "do pewnego stopnia" },
          { "text": "en principio sí, pero…", "pl": "w zasadzie tak, ale…" },
          { "text": "depende", "pl": "to zależy" },
          { "text": "no estoy tan seguro", "pl": "nie jestem taki pewien" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uważaj na „sí, pero…”. Wszystko przed „pero” to uprzejmość, a prawdziwa opinia jest PO nim. Odpowiedź oparta na pierwszej połowie zdania będzie odwrotna do zamierzonej."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ironia rozpoznawana jest przez sprzeczność: mówiący używa słów pozytywnych, ale opisuje sytuację negatywną („Estupendo, otra vez sin autobús”). Jeśli treść kłóci się ze słowem oceniającym, to ironia."
  },
  {
    "type": "examples",
    "title": "To samo zdarzenie, różne postawy",
    "items": [
      { "en": "La reforma me parece necesaria, aunque tardía.", "pl": "Popiera, z zastrzeżeniem — całość pozytywna.", "highlight": "necesaria" },
      { "en": "En principio la apoyo, pero no soluciona el problema de fondo.", "pl": "Sceptyczny — prawdziwa opinia po „pero”.", "highlight": "pero" },
      { "en": "Otra reforma más. Genial.", "pl": "Ironia — pozytywne słowo, negatywny kontekst.", "highlight": "Genial" },
      { "en": "No me convence en absoluto.", "pl": "Jednoznacznie negatywna.", "highlight": "No me convence" }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Wyrażenie → postawa",
    "pairs": [
      { "left": "merece la pena", "right": "aprobata" },
      { "left": "deja mucho que desear", "right": "dezaprobata" },
      { "left": "hasta cierto punto", "right": "częściowa zgoda" },
      { "left": "no me convence", "right": "sprzeciw" },
      { "left": "no estoy tan seguro", "right": "wahanie" }
    ]
  },
  {
    "type": "quiz",
    "question": "Mówiący: „La idea es interesante, pero en la práctica no funcionaría”. Jaka jest jego postawa?",
    "options": ["Pozytywna", "Krytyczna", "Neutralna"],
    "correctIndex": 1,
    "explanation": "Pierwsza połowa to grzecznościowe ustępstwo, prawdziwa ocena stoi po „pero”: pomysł nie zadziała. Zdanie jest w sumie krytyczne."
  }
]$content$,
  4
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'sluchanie'),
  'akcenty-i-warianty',
  'Akcenty i warianty hiszpańskiego',
  'Nagranie może być z Hiszpanii albo z Ameryki. Oto różnice, które słychać.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Hiszpański ma około pięciuset milionów użytkowników i nagrania maturalne nie ograniczają się do Madrytu. Różnice są przewidywalne i jest ich niewiele — kto o nich wie, nie zgubi się przy pierwszym argentyńskim „vos”."
  },
  {
    "type": "table",
    "title": "Wymowa",
    "headers": ["Zjawisko", "Hiszpania", "Ameryka Łacińska"],
    "rows": [
      ["c przed e/i, z", "jak angielskie th: „gracias” = grathias", "jak s: „gracias” = grasias (seseo)"],
      ["ll i y", "podobne do polskiego j", "w Argentynie jak polskie ż (yeísmo rehilado)"],
      ["s na końcu sylaby", "wyraźne", "w Karaibach osłabione lub nieme"],
      ["tempo", "szybkie, dużo skrótów", "zwykle wolniejsze i wyraźniejsze"]
    ]
  },
  {
    "type": "table",
    "title": "Gramatyka i słownictwo",
    "headers": ["Zjawisko", "Hiszpania", "Ameryka Łacińska"],
    "rows": [
      ["druga osoba l.mn.", "vosotros habláis", "ustedes hablan"],
      ["druga osoba l.poj. (Argentyna)", "tú tienes", "vos tenés (voseo)"],
      ["czas przeszły dziś", "hoy he comido", "hoy comí"],
      ["komputer", "el ordenador", "la computadora"],
      ["telefon", "el móvil", "el celular"],
      ["samochód", "el coche", "el carro / el auto"],
      ["sok", "el zumo", "el jugo"],
      ["okulary", "las gafas", "los lentes"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie musisz umieć mówić po argentyńsku — musisz umieć to ZROZUMIEĆ. Jeśli usłyszysz „vos tenés”, wiedz, że to „tú tienes”. Rozpoznanie wystarczy do odpowiedzi na pytanie."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na seseo przy liczbach: w Ameryce „cien” i „sien” brzmią tak samo, a „diez” może zabrzmieć jak „dies”. Przy zapisywaniu liczb opieraj się na kontekście, nie na samym dźwięku."
  },
  {
    "type": "matchPairs",
    "title": "Wariant amerykański → hiszpański",
    "pairs": [
      { "left": "la computadora", "right": "el ordenador" },
      { "left": "el celular", "right": "el móvil" },
      { "left": "el carro", "right": "el coche" },
      { "left": "el jugo", "right": "el zumo" },
      { "left": "ustedes hablan", "right": "vosotros habláis" },
      { "left": "vos tenés", "right": "tú tienes" }
    ]
  },
  {
    "type": "quiz",
    "question": "W nagraniu słyszysz: „¿Vos querés un jugo?”. Skąd najprawdopodobniej pochodzi mówiący?",
    "options": ["Z Hiszpanii", "Z Argentyny", "Z Meksyku"],
    "correctIndex": 1,
    "explanation": "„Vos querés” to voseo, charakterystyczne przede wszystkim dla Argentyny i Urugwaju, a „jugo” zamiast „zumo” potwierdza, że nagranie jest amerykańskie, nie hiszpańskie."
  }
]$content$,
  5
);
