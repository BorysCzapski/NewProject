-- ============================================================================
-- supabase/seed/matura/09_lessons_sluchanie.sql
-- English theory for "Rozumienie ze słuchu", both levels.
--
-- Unlike the Spanish section, this one HAS a task bank (10_tasks_sluchanie.sql)
-- because its video ids were verified. The lessons here therefore lead into
-- those tasks rather than standing in for them.
--
-- Mostly technique, with two lexical lessons that earn their place: connected
-- speech (a student who has only read English meets "gonna", "wanna" and the
-- disappearing /t/ for the first time under exam conditions) and accents,
-- since CKE recordings are not all RP.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'en' and slug = 'sluchanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  'jak-sluchac',
  'Jak wykorzystać dwa odsłuchania',
  'Nagranie leci dwa razy i to nie przypadek. Każde odsłuchanie ma inne zadanie.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Każde nagranie odtwarzane jest DWA RAZY, a przed pierwszym masz czas na przeczytanie zadań. To część konstrukcji egzaminu i można to zaplanować. Największy błąd to traktować oba odsłuchania tak samo."
  },
  {
    "type": "table",
    "title": "Plan na jedno nagranie",
    "headers": ["Moment", "Co robisz"],
    "rows": [
      ["Przed nagraniem", "czytasz zadania, podkreślasz słowa kluczowe, przewidujesz temat"],
      ["Pierwsze odsłuchanie", "łapiesz OGÓLNY sens, zaznaczasz pewne odpowiedzi"],
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
    "text": "Czas na czytanie zadań wykorzystaj do przewidywania. Jeśli w pytaniach są godziny, będą godziny. Jeśli ceny — będą liczby. Ucho przygotowane na konkretny typ informacji łapie go znacznie łatwiej."
  },
  {
    "type": "quiz",
    "question": "Podczas pierwszego odsłuchania nie zrozumiałeś jednego zdania. Co robisz?",
    "options": [
      "Wracam myślami do tego zdania",
      "Słucham dalej, wracam przy drugim odsłuchaniu",
      "Zaznaczam losową odpowiedź i przechodzę dalej"
    ],
    "correctIndex": 1,
    "explanation": "Zatrzymanie się kosztuje kolejne pytania. Nagranie leci dalej niezależnie od ciebie — od tego jest drugie odsłuchanie."
  }
]$content$,
  1
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  'liczby-daty-nazwy',
  'Liczby, daty i literowanie',
  'Informacje, które najłatwiej przegapić, i sposób na ich zapisywanie.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Liczby i nazwy własne to najczęstsze źródło straconych punktów w tej części, bo pytanie o godzinę albo cenę jest łatwe — pod warunkiem, że usłyszałeś liczbę. Angielski dokłada tu własne pułapki."
  },
  {
    "type": "table",
    "title": "Liczby, które brzmią podobnie",
    "headers": ["Para", "Różnica", "Wskazówka"],
    "rows": [
      ["thirteen / thirty", "13 / 30", "thirteen ma akcent na końcu: thirTEEN"],
      ["fourteen / forty", "14 / 40", "forty NIE ma u — to nie „fourty”"],
      ["fifteen / fifty", "15 / 50", "akcent rozstrzyga"],
      ["sixteen / sixty", "16 / 60", "-teen brzmi dłużej"],
      ["a hundred and five / a hundred five", "105", "brytyjski dodaje „and”"]
    ],
    "caption": "Reguła: końcówka -TEEN jest akcentowana, końcówka -TY nie. To najpewniejsza wskazówka."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zapisuj liczby cyframi od razu, w trakcie słuchania — nie zapamiętuj. Zapisanie „16:30” zajmuje sekundę, odtworzenie z pamięci po minucie zwykle się nie udaje."
  },
  {
    "type": "table",
    "title": "Daty, godziny i ceny",
    "headers": ["Forma", "Znaczenie", "Uwaga"],
    "rows": [
      ["the third of May / May the third", "3 maja", "brytyjski i amerykański szyk"],
      ["half past three", "3:30", "NIE „wpół do trzeciej” — to 3:30"],
      ["a quarter to four", "3:45", "to = przed pełną godziną"],
      ["a quarter past four", "4:15", "past = po pełnej godzinie"],
      ["nineteen ninety-eight", "1998", "lata czyta się parami"],
      ["two thousand and five", "2005", "lata po 2000 inaczej"],
      ["nine ninety-nine", "9,99 funta", "ceny bez „pounds” w środku"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Half past three” to 3:30, a nie „wpół do trzeciej” (czyli 2:30). Automatyczne tłumaczenie polskiego „wpół do” prowadzi prosto do błędu o całą godzinę."
  },
  {
    "type": "table",
    "title": "Literowanie — litery, które Polacy mylą",
    "headers": ["Litera", "Wymowa", "Mylona z"],
    "rows": [
      ["G", "dżi", "J (dżej)"],
      ["J", "dżej", "G (dżi)"],
      ["I", "aj", "E (i)"],
      ["E", "i", "I (aj)"],
      ["A", "ej", "R (ar)"],
      ["Y", "łaj", "U (ju)"]
    ],
    "caption": "Przy nazwiskach i adresach mailowych zawsze pada literowanie — te sześć liter decyduje o punkcie."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zapisz cyframi",
    "instruction": "Wpisz samą liczbę albo godzinę.",
    "items": [
      { "before": "half past seven = ", "after": "", "accept": ["7:30", "19:30"], "hint": "half past = :30", "pl": "wpół do ósmej" },
      { "before": "a quarter to nine = ", "after": "", "accept": ["8:45", "20:45"], "hint": "to = przed pełną godziną", "pl": "za kwadrans dziewiąta" },
      { "before": "nineteen eighty-four = ", "after": "", "accept": ["1984"], "hint": "lata czyta się parami", "pl": "tysiąc dziewięćset osiemdziesiąty czwarty" },
      { "before": "forty-five = ", "after": "", "accept": ["45"], "hint": "-ty, nie -teen", "pl": "czterdzieści pięć" }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Angielski → liczba",
    "pairs": [
      { "left": "thirteen", "right": "13" },
      { "left": "thirty", "right": "30" },
      { "left": "fifteen", "right": "15" },
      { "left": "fifty", "right": "50" },
      { "left": "two thousand and twenty", "right": "2020" }
    ]
  }
]$content$,
  2
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  'mowa-polaczona',
  'Mowa połączona — czego nie ma w podręczniku',
  'Dlaczego nie słyszysz słów, które znasz. Wypełniacze, skróty i znikające dźwięki.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Angielski mówiony różni się od pisanego bardziej, niż podejrzewa ktoś, kto uczył się z podręcznika. Wyrazy zlewają się ze sobą, dźwięki znikają, a co drugie zdanie zaczyna się od wypełniacza. Znajomość kilkunastu wzorców zmienia odbiór całego nagrania."
  },
  {
    "type": "table",
    "title": "Skróty wymowy",
    "headers": ["Zapis", "Wymowa potoczna", "Zjawisko"],
    "rows": [
      ["going to", "gonna", "ściągnięcie"],
      ["want to", "wanna", "ściągnięcie"],
      ["got to", "gotta", "ściągnięcie"],
      ["kind of", "kinda", "ściągnięcie"],
      ["what do you", "whaddaya", "zlanie się wyrazów"],
      ["did you", "didja", "palatalizacja"],
      ["water (AmE)", "wader", "t między samogłoskami brzmi jak d"],
      ["I don't know", "dunno", "redukcja całości"]
    ],
    "caption": "Żadne z nich nie jest błędem — tak mówią rodzimi użytkownicy i tak brzmią nagrania."
  },
  {
    "type": "keyPhrases",
    "title": "Wypełniacze i sygnały rozmowy",
    "caption": "Nie niosą treści, ale zajmują czas i mylą, jeśli się ich nie rozpoznaje.",
    "groups": [
      {
        "label": "Wypełniacze",
        "phrases": [
          { "text": "well…", "pl": "no więc…" },
          { "text": "you know", "pl": "no wiesz" },
          { "text": "I mean", "pl": "to znaczy" },
          { "text": "sort of / kind of", "pl": "jakby, w pewnym sensie" },
          { "text": "actually", "pl": "właściwie (NIE „aktualnie”)" },
          { "text": "basically", "pl": "w zasadzie" }
        ]
      },
      {
        "label": "Reakcje",
        "phrases": [
          { "text": "no way!", "pl": "nie ma mowy! / coś ty!" },
          { "text": "fair enough", "pl": "no dobrze, rozumiem" },
          { "text": "you're kidding", "pl": "żartujesz" },
          { "text": "absolutely", "pl": "jak najbardziej" },
          { "text": "not really", "pl": "raczej nie" }
        ]
      },
      {
        "label": "Sygnały zmiany tematu",
        "phrases": [
          { "text": "by the way", "pl": "à propos" },
          { "text": "anyway", "pl": "w każdym razie" },
          { "text": "speaking of which", "pl": "skoro o tym mowa" },
          { "text": "going back to what you said", "pl": "wracając do tego, co mówiłeś" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "ACTUALLY to fałszywy przyjaciel: znaczy „właściwie, tak naprawdę”, a nie „aktualnie”. „Aktualnie” to currently. W nagraniach „actually” zwykle zapowiada sprostowanie — czyli coś istotnego."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "„Well…” na początku odpowiedzi prawie zawsze zapowiada zastrzeżenie albo niepełną zgodę. Jeśli pytanie brzmi o postawę mówiącego, samo „well” już jest wskazówką."
  },
  {
    "type": "matchPairs",
    "title": "Potocznie → poprawnie",
    "pairs": [
      { "left": "gonna", "right": "going to" },
      { "left": "wanna", "right": "want to" },
      { "left": "gotta", "right": "got to" },
      { "left": "dunno", "right": "I don't know" },
      { "left": "kinda", "right": "kind of" }
    ]
  },
  {
    "type": "quiz",
    "question": "W nagraniu ktoś mówi: „Well, I mean, sort of, you know…”. Ile informacji niesie ta wypowiedź?",
    "options": ["Cztery różne argumenty", "Praktycznie żadnej — to same wypełniacze", "Zdanie przeczące"],
    "correctIndex": 1,
    "explanation": "To wszystko wypełniacze — mówiący zbiera myśli. Kto ich nie rozpoznaje, szuka w nich treści i gubi to, co pada zaraz potem."
  }
]$content$,
  3
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'sluchanie'),
  'opinie-i-ton',
  'Opinie, ton i intencja mówiącego',
  'Na rozszerzeniu pytają nie o fakty, tylko o to, co mówiący naprawdę myśli.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu pytania rzadko brzmią „at what time” — częściej „what is the speaker's attitude” albo „why does she say this”. Odpowiedź bywa ukryta w tonie i w jednym słowie oceniającym, nie w treści zdania."
  },
  {
    "type": "keyPhrases",
    "title": "Sygnały postawy",
    "caption": "Jedno takie wyrażenie często decyduje o całej odpowiedzi.",
    "groups": [
      {
        "label": "Aprobata",
        "phrases": [
          { "text": "I'm all for it", "pl": "jestem całkowicie za" },
          { "text": "it's well worth it", "pl": "zdecydowanie warto" },
          { "text": "I couldn't agree more", "pl": "nie mógłbym się bardziej zgodzić" },
          { "text": "not bad at all", "pl": "wcale nieźle" }
        ]
      },
      {
        "label": "Dezaprobata",
        "phrases": [
          { "text": "I'm not convinced", "pl": "nie jestem przekonany" },
          { "text": "it leaves a lot to be desired", "pl": "pozostawia wiele do życzenia" },
          { "text": "it's a shame that…", "pl": "szkoda, że…" },
          { "text": "I can't say I'm impressed", "pl": "nie powiem, żebym był pod wrażeniem" }
        ]
      },
      {
        "label": "Wahanie i zastrzeżenie",
        "phrases": [
          { "text": "up to a point", "pl": "do pewnego stopnia" },
          { "text": "in theory yes, but…", "pl": "w teorii tak, ale…" },
          { "text": "it depends", "pl": "to zależy" },
          { "text": "I have mixed feelings", "pl": "mam mieszane uczucia" },
          { "text": "I wouldn't go that far", "pl": "nie posuwałbym się tak daleko" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uważaj na „yes, but…”. Wszystko przed „but” to uprzejmość, a prawdziwa opinia jest PO nim. Odpowiedź oparta na pierwszej połowie zdania będzie odwrotna do zamierzonej."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ironię rozpoznaje się po sprzeczności: mówiący używa słów pozytywnych, opisując sytuację negatywną („Brilliant. Another delay.”). Jeśli treść kłóci się ze słowem oceniającym, to ironia."
  },
  {
    "type": "examples",
    "title": "To samo zdarzenie, różne postawy",
    "items": [
      { "en": "The reform is necessary, though it comes rather late.", "pl": "Popiera, z zastrzeżeniem — całość pozytywna.", "highlight": "necessary" },
      { "en": "In principle I support it, but it doesn't address the real problem.", "pl": "Sceptyczny — prawdziwa opinia po „but”.", "highlight": "but" },
      { "en": "Another reform. Wonderful.", "pl": "Ironia — pozytywne słowo, negatywny kontekst.", "highlight": "Wonderful" },
      { "en": "I'm not convinced at all.", "pl": "Jednoznacznie negatywna.", "highlight": "not convinced" }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Wyrażenie → postawa",
    "pairs": [
      { "left": "it's well worth it", "right": "aprobata" },
      { "left": "leaves a lot to be desired", "right": "dezaprobata" },
      { "left": "up to a point", "right": "częściowa zgoda" },
      { "left": "I'm not convinced", "right": "sprzeciw" },
      { "left": "I have mixed feelings", "right": "wahanie" }
    ]
  },
  {
    "type": "quiz",
    "question": "Mówiący: „The idea is interesting, but in practice it wouldn't work”. Jaka jest jego postawa?",
    "options": ["Pozytywna", "Krytyczna", "Neutralna"],
    "correctIndex": 1,
    "explanation": "Pierwsza połowa to grzecznościowe ustępstwo, prawdziwa ocena stoi po „but”: pomysł nie zadziała. Zdanie jest w sumie krytyczne."
  }
]$content$,
  4
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'sluchanie'),
  'akcenty',
  'Akcenty: brytyjski, amerykański i inne',
  'Nagrania CKE nie są wyłącznie w RP. Oto różnice, które słychać.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Angielski ma więcej odmian niż jakikolwiek inny język egzaminacyjny, a nagrania maturalne nie ograniczają się do brytyjskiego standardu. Różnice są przewidywalne i jest ich niewiele — kto o nich wie, nie zgubi się przy pierwszym amerykańskim „gotten”."
  },
  {
    "type": "table",
    "title": "Wymowa",
    "headers": ["Zjawisko", "Brytyjski", "Amerykański"],
    "rows": [
      ["r po samogłosce", "nieme: „car” = ka", "wymawiane: „car” = kar"],
      ["t między samogłoskami", "wyraźne: „water”", "jak d: „wader”"],
      ["a w „bath”, „can't”", "długie: baath", "krótkie: bath jak w „cat”"],
      ["o w „hot”", "zaokrąglone", "otwarte, bliżej „hat”"],
      ["schedule", "„szedjul”", "„skedżul”"]
    ]
  },
  {
    "type": "table",
    "title": "Słownictwo i gramatyka",
    "headers": ["Znaczenie", "Brytyjski", "Amerykański"],
    "rows": [
      ["mieszkanie", "flat", "apartment"],
      ["winda", "lift", "elevator"],
      ["parter", "ground floor", "first floor"],
      ["chodnik", "pavement", "sidewalk"],
      ["wakacje", "holiday", "vacation"],
      ["frytki", "chips", "fries"],
      ["jesień", "autumn", "fall"],
      ["past participle od get", "got", "gotten"],
      ["present perfect", "I've just eaten", "I just ate"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "PARTER to najgroźniejsza różnica na egzaminie. Brytyjski „first floor” to polskie PIERWSZE piętro, ale amerykański „first floor” to PARTER. W zadaniu o kierunkach potrafi to zmienić odpowiedź."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie musisz mówić z żadnym konkretnym akcentem — musisz ROZUMIEĆ oba. Jeśli usłyszysz „I gotten it”, wiedz, że to amerykańskie „I've got it”."
  },
  {
    "type": "matchPairs",
    "title": "Amerykański → brytyjski",
    "pairs": [
      { "left": "apartment", "right": "flat" },
      { "left": "elevator", "right": "lift" },
      { "left": "sidewalk", "right": "pavement" },
      { "left": "vacation", "right": "holiday" },
      { "left": "fall", "right": "autumn" },
      { "left": "fries", "right": "chips" }
    ]
  },
  {
    "type": "quiz",
    "question": "Mówiący: „Take the elevator to the first floor — that's the ground level.” Skąd pochodzi?",
    "options": ["Z Wielkiej Brytanii", "Z USA", "Nie da się ustalić"],
    "correctIndex": 1,
    "explanation": "„Elevator” zamiast „lift”, a przede wszystkim „first floor” utożsamione z parterem — obie cechy są amerykańskie. W brytyjskim parter to „ground floor”."
  }
]$content$,
  5
);
