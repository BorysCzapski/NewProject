-- ============================================================================
-- supabase/seed/matura/02_lessons_srodki_jezykowe.sql
-- English grammar theory for "Znajomość środków językowych", POZIOM
-- PODSTAWOWY. The rozszerzona lessons for the same section are in
-- 17_lessons_srodki_rozszerzona.sql — split by level, since together they run
-- past two thousand lines.
--
-- Structure mirrors ../matura-es/02_lessons_srodki_jezykowe.sql: same lesson
-- shape, same insistence that every lesson ends in drills rather than
-- explanation. What differs is the content, and it has to — the two languages
-- trip a Polish learner in different places. Spanish loses marks on ser/estar
-- and por/para; English loses them on tense choice (Polish aspect maps badly
-- onto the perfect), on articles (Polish has none), on countability, and on
-- the prepositions that verb collocations hide.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections
  where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'
);

-- ----------------------------------------------------------------------------
-- 1. Jak działa ta część arkusza
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'jak-dziala-ta-czesc',
  'Jak działa ta część arkusza',
  'Typy zadań, punktacja i trzy nawyki, które ratują najwięcej punktów.',
  'strategia', 7,
  $content$[
  {
    "type": "intro",
    "text": "Ta część sprawdza użycie gramatyki i słownictwa W KONTEKŚCIE. Na poziomie podstawowym spotkasz uzupełnianie luk, wybór wielokrotny i słowotwórstwo — czyli przekształcenie podanego wyrazu (SUCCESS → successful)."
  },
  {
    "type": "table",
    "title": "Trzy typy zadań",
    "headers": ["Typ zadania", "Co sprawdza", "Na co patrzeć"],
    "rows": [
      ["Uzupełnianie luk", "przedimki, przyimki, formy czasownika", "co stoi PO luce, nie tylko przed"],
      ["Wybór wielokrotny", "podobne konstrukcje: since/for, make/do", "słowa-sygnały: yet, already, ago"],
      ["Słowotwórstwo", "przedrostki i przyrostki", "jakiej CZĘŚCI MOWY brakuje w zdaniu"]
    ],
    "caption": "Za każdą lukę jest 1 punkt. Odpowiedź jest albo poprawna, albo nie — nie ma punktów cząstkowych."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nawyk pierwszy: przeczytaj CAŁE zdanie. W angielskim to, co decyduje o formie — since/for, a time marker, liczba mnoga podmiotu — bywa na końcu zdania, nie przy luce."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Nawyk drugi: nigdy nie zostawiaj pustej luki. Pusta luka to gwarantowane zero. Nawet zgadnięty przedimek ma jedną szansę na trzy."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nawyk trzeci: sprawdź końcówki. Brakujące -s w trzeciej osobie i brakujące -ed w czasie przeszłym to najczęstsze błędy w całym arkuszu i najłatwiejsze do wyłapania na końcu."
  },
  {
    "type": "quiz",
    "question": "Luka: „She ___ in Warsaw since 2019.” Co sprawdzasz najpierw?",
    "options": [
      "Słowo SINCE — sygnalizuje present perfect",
      "Ile liter mieści się w luce",
      "Czy zdanie jest pytaniem"
    ],
    "correctIndex": 0,
    "explanation": "SINCE prawie zawsze wymusza present perfect: „has lived”. Słowa-sygnały rozstrzygają zadanie szybciej niż analiza znaczenia."
  },
  {
    "type": "quiz",
    "question": "Słowotwórstwo: „The trip was very ___ (SUCCESS).” Jakiej części mowy potrzebujesz?",
    "options": ["Przymiotnika", "Rzeczownika", "Czasownika"],
    "correctIndex": 0,
    "explanation": "Po „was very” stoi przymiotnik: successful. Najpierw ustal część mowy, dopiero potem przyrostek."
  }
]$content$,
  1
);

-- ----------------------------------------------------------------------------
-- 2. Present simple czy continuous
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'czasy-terazniejsze',
  'Present simple czy present continuous',
  'Pierwszy wybór, na którym polski nie pomaga — bo ma tylko jeden czas teraźniejszy.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Polski ma jeden czas teraźniejszy, angielski dwa. „Pracuję” to zarówno „I work” (ogólnie, zawsze), jak i „I am working” (teraz, w tej chwili). Ten wybór wraca w każdym arkuszu."
  },
  {
    "type": "formula",
    "title": "Budowa",
    "variants": [
      {
        "label": "Present simple",
        "parts": [
          { "text": "She", "role": "subject" },
          { "text": "works", "role": "verb", "note": "3. osoba: dodaj -s" },
          { "text": "in a bank", "role": "object" }
        ],
        "example": { "en": "She works in a bank.", "pl": "Pracuje w banku." }
      },
      {
        "label": "Present simple — pytanie",
        "parts": [
          { "text": "Does", "role": "aux", "note": "operator do/does" },
          { "text": "she", "role": "subject" },
          { "text": "work", "role": "verb", "note": "BEZ -s po does" },
          { "text": "here?", "role": "object" }
        ],
        "example": { "en": "Does she work here?", "pl": "Czy ona tu pracuje?" }
      },
      {
        "label": "Present continuous",
        "parts": [
          { "text": "She", "role": "subject" },
          { "text": "is", "role": "aux", "note": "am / is / are" },
          { "text": "working", "role": "verb", "note": "-ing" },
          { "text": "right now", "role": "object" }
        ],
        "example": { "en": "She is working right now.", "pl": "Właśnie pracuje." }
      }
    ]
  },
  {
    "type": "compare",
    "title": "Kiedy który",
    "columns": [
      {
        "title": "PRESENT SIMPLE",
        "formula": "work / works",
        "whenToUse": "rutyna, fakty, harmonogramy, stany",
        "examples": ["I get up at seven.", "Water boils at 100 degrees.", "The train leaves at six.", "She likes coffee."]
      },
      {
        "title": "PRESENT CONTINUOUS",
        "formula": "am / is / are + -ing",
        "whenToUse": "teraz, tymczasowo, plany na przyszłość, zmiany",
        "examples": ["I am reading a great book.", "He is staying with us this week.", "We are meeting at eight.", "Prices are rising."]
      }
    ]
  },
  {
    "type": "table",
    "title": "Słowa-sygnały",
    "headers": ["PRESENT SIMPLE", "PRESENT CONTINUOUS"],
    "rows": [
      ["always, usually, often", "now, right now, at the moment"],
      ["every day / week / year", "today, this week"],
      ["never, rarely, sometimes", "currently, at present"],
      ["on Mondays", "look!, listen!"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "CZASOWNIKI STANU nie występują w continuous: know, like, love, hate, want, need, believe, understand, belong, seem. „I am knowing” to błąd — zawsze „I know”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Wyjątek, o który lubią pytać: „I am thinking about it” (zastanawiam się — czynność) kontra „I think you are right” (uważam — stan). Ten sam czasownik, dwa różne znaczenia."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "instruction": "Wpisz poprawną formę czasownika z podpowiedzi.",
    "items": [
      { "before": "She usually ", "after": " to work by bus.", "accept": ["goes"], "hint": "go — usually", "pl": "Zwykle jeździ do pracy autobusem." },
      { "before": "Look! It ", "after": ".", "accept": ["is raining", "'s raining"], "hint": "rain — Look!", "pl": "Patrz! Pada." },
      { "before": "I ", "after": " what you mean.", "accept": ["understand"], "hint": "understand — czasownik stanu", "pl": "Rozumiem, co masz na myśli." },
      { "before": "They ", "after": " a new house at the moment.", "accept": ["are building", "'re building"], "hint": "build — at the moment", "pl": "Właśnie budują nowy dom." },
      { "before": "Water ", "after": " at zero degrees.", "accept": ["freezes"], "hint": "freeze — fakt", "pl": "Woda zamarza w zerze stopni." },
      { "before": "", "after": " your sister speak French?", "accept": ["Does", "does"], "hint": "operator", "pl": "Czy twoja siostra mówi po francusku?" }
    ]
  },
  {
    "type": "quiz",
    "question": "„I ___ this book is excellent.”",
    "options": ["am thinking", "think", "thinks"],
    "correctIndex": 1,
    "explanation": "Tu „think” znaczy „uważam” — to stan, więc simple. „Am thinking” znaczyłoby „zastanawiam się nad tą książką”, co w tym zdaniu nie ma sensu."
  }
]$content$,
  2
);

-- ----------------------------------------------------------------------------
-- 3. Past simple czy past continuous
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'czasy-przeszle',
  'Past simple czy past continuous',
  'Zdarzenie i tło. Ten sam podział co w hiszpańskim, ale inne końcówki i lista nieregularnych.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Past simple opowiada, CO się stało. Past continuous maluje TŁO, na którym to się stało. Prawie każde zadanie egzaminacyjne z tej pary ma postać: coś trwało (continuous), gdy coś się wydarzyło (simple)."
  },
  {
    "type": "timeline",
    "title": "Na osi czasu",
    "caption": "Continuous to odcinek, simple to punkt na nim.",
    "markers": [
      { "at": 12, "to": 38, "label": "PAST CONTINUOUS — tło", "example": { "en": "I was watching TV.", "pl": "Oglądałem telewizję." } },
      { "at": 26, "label": "PAST SIMPLE — zdarzenie", "example": { "en": "The phone rang.", "pl": "Zadzwonił telefon." } },
      { "at": 50, "label": "NOW", "example": { "en": "Now I am at home.", "pl": "Teraz jestem w domu." } }
    ]
  },
  {
    "type": "table",
    "title": "Nieregularne, o które pytają najczęściej",
    "headers": ["Bezokolicznik", "Past simple", "Past participle"],
    "rows": [
      ["be", "was / were", "been"],
      ["go", "went", "gone"],
      ["do", "did", "done"],
      ["take", "took", "taken"],
      ["give", "gave", "given"],
      ["write", "wrote", "written"],
      ["speak", "spoke", "spoken"],
      ["break", "broke", "broken"],
      ["choose", "chose", "chosen"],
      ["catch", "caught", "caught"],
      ["teach", "taught", "taught"],
      ["think", "thought", "thought"],
      ["buy", "bought", "bought"],
      ["bring", "brought", "brought"]
    ],
    "caption": "Trzecia kolumna jest potrzebna do present perfect i strony biernej — ucz się wszystkich trzech naraz."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po DID czasownik wraca do formy podstawowej: „Did you go?”, nie „Did you went?”. To samo w przeczeniu: „I didn't go”. Podwójny czas przeszły to jeden z najczęstszych błędów."
  },
  {
    "type": "examples",
    "title": "Oba czasy w jednym zdaniu",
    "items": [
      { "en": "While I was cooking, the phone rang.", "pl": "Kiedy gotowałem, zadzwonił telefon.", "highlight": "was cooking" },
      { "en": "They were playing football when it started to rain.", "pl": "Grali w piłkę, gdy zaczęło padać.", "highlight": "were playing" },
      { "en": "I was reading at ten o'clock last night.", "pl": "Wczoraj o dziesiątej czytałem.", "highlight": "was reading" },
      { "en": "She fell asleep while she was watching the film.", "pl": "Zasnęła podczas oglądania filmu.", "highlight": "was watching" }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Prosta reguła na zdania z when/while: po WHILE prawie zawsze idzie continuous, po WHEN prawie zawsze simple. Nie jest to bezwyjątkowe, ale na maturze sprawdza się niemal zawsze."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "While we ", "after": " dinner, the lights went out.", "accept": ["were having", "were eating"], "hint": "have — tło", "pl": "Kiedy jedliśmy kolację, zgasło światło." },
      { "before": "I ", "after": " my keys yesterday.", "accept": ["lost"], "hint": "lose — nieregularny", "pl": "Wczoraj zgubiłem klucze." },
      { "before": "She ", "after": " to Paris last summer.", "accept": ["went"], "hint": "go — nieregularny", "pl": "Pojechała latem do Paryża." },
      { "before": "What ", "after": " you doing at eight last night?", "accept": ["were"], "hint": "operator continuous", "pl": "Co robiłeś wczoraj o ósmej?" },
      { "before": "He didn't ", "after": " the answer.", "accept": ["know"], "hint": "know — po didn't forma podstawowa", "pl": "Nie znał odpowiedzi." },
      { "before": "They ", "after": " us a beautiful present.", "accept": ["bought", "brought", "gave"], "hint": "buy / bring / give — nieregularne", "pl": "Kupili nam piękny prezent." }
    ]
  },
  {
    "type": "conjugation",
    "title": "Formy nieregularne — sprawdź się",
    "persons": ["go", "take", "write", "break", "catch", "buy"],
    "columns": [
      { "label": "past simple", "forms": ["went", "took", "wrote", "broke", "caught", "bought"] },
      { "label": "past participle", "forms": ["gone", "taken", "written", "broken", "caught", "bought"] }
    ],
    "highlight": ["went", "gone", "took", "taken", "wrote", "written", "broke", "broken"],
    "caption": "Zwróć uwagę: catch i buy mają identyczną drugą i trzecią formę, go i take nie."
  },
  {
    "type": "quiz",
    "question": "„When I arrived, they ___ already.”",
    "options": ["were leaving", "left", "had left"],
    "correctIndex": 2,
    "explanation": "„Already” plus czynność wcześniejsza niż inna przeszła wymaga past perfect: had left. To zapowiedź materiału z poziomu rozszerzonego, ale pojawia się też na podstawie."
  }
]$content$,
  3
);

-- ----------------------------------------------------------------------------
-- 4. Present perfect
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'present-perfect',
  'Present perfect czy past simple',
  'Czas, którego polski nie ma wcale. Rozstrzyga jedno pytanie: czy okres już się skończył.',
  'gramatyka', 12,
  $content$[
  {
    "type": "intro",
    "text": "Present perfect nie ma polskiego odpowiednika i dlatego jest najtrudniejszym czasem dla Polaków. Mówi o przeszłości, która wciąż ma związek z teraźniejszością. Cała decyzja sprowadza się do jednego pytania: czy okres, o którym mówię, już się zamknął?"
  },
  {
    "type": "formula",
    "title": "Budowa",
    "variants": [
      {
        "label": "Twierdzenie",
        "parts": [
          { "text": "I", "role": "subject" },
          { "text": "have", "role": "aux", "note": "have / has" },
          { "text": "finished", "role": "verb", "note": "3. forma czasownika" },
          { "text": "the report", "role": "object" }
        ],
        "example": { "en": "I have finished the report.", "pl": "Skończyłem raport." }
      },
      {
        "label": "Przeczenie",
        "parts": [
          { "text": "She", "role": "subject" },
          { "text": "hasn't", "role": "negation" },
          { "text": "called", "role": "verb" },
          { "text": "yet", "role": "object" }
        ],
        "example": { "en": "She hasn't called yet.", "pl": "Jeszcze nie dzwoniła." }
      },
      {
        "label": "Pytanie",
        "parts": [
          { "text": "Have", "role": "aux" },
          { "text": "you", "role": "subject" },
          { "text": "ever", "role": "other" },
          { "text": "been", "role": "verb" },
          { "text": "to Spain?", "role": "object" }
        ],
        "example": { "en": "Have you ever been to Spain?", "pl": "Byłeś kiedyś w Hiszpanii?" }
      }
    ]
  },
  {
    "type": "compare",
    "title": "Rozstrzygnięcie",
    "columns": [
      {
        "title": "PRESENT PERFECT — okres trwa",
        "formula": "have / has + 3. forma",
        "whenToUse": "today, this week, ever, never, just, already, yet, since, for",
        "examples": ["I have seen that film.", "She has lived here since 2019.", "We haven't finished yet.", "Have you ever tried sushi?"]
      },
      {
        "title": "PAST SIMPLE — okres zamknięty",
        "formula": "-ed lub 2. forma",
        "whenToUse": "yesterday, last week, in 2019, ago, when",
        "examples": ["I saw that film last night.", "She moved here in 2019.", "We finished an hour ago.", "Did you try sushi in Japan?"]
      }
    ]
  },
  {
    "type": "table",
    "title": "SINCE czy FOR",
    "headers": ["", "Znaczenie", "Po nim stoi", "Przykład"],
    "rows": [
      ["SINCE", "od (punkt w czasie)", "moment", "since 2019, since Monday, since I was ten"],
      ["FOR", "przez (okres)", "długość", "for two years, for a week, for a long time"]
    ],
    "caption": "Oba prawie zawsze pociągają za sobą present perfect — to jedna z najpewniejszych podpowiedzi w arkuszu."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "AGO zawsze idzie z past simple, nigdy z perfect: „I saw him two days ago”, nie „I have seen him two days ago”. Słowo „ago” zamyka okres, więc perfect jest wykluczony."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "BEEN czy GONE: „He has been to Spain” znaczy, że był i już wrócił. „He has gone to Spain” — pojechał i wciąż tam jest. Klasyczne pytanie egzaminacyjne."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "I ", "after": " here since 2020.", "accept": ["have lived", "have worked", "'ve lived"], "hint": "live — since", "pl": "Mieszkam tu od 2020 roku." },
      { "before": "She ", "after": " to London last year.", "accept": ["went"], "hint": "go — last year", "pl": "Pojechała do Londynu w zeszłym roku." },
      { "before": "We haven't seen him ", "after": " three weeks.", "accept": ["for"], "hint": "okres, nie punkt", "pl": "Nie widzieliśmy go od trzech tygodni." },
      { "before": "", "after": " you ever been to Italy?", "accept": ["Have", "have"], "hint": "ever", "pl": "Byłeś kiedyś we Włoszech?" },
      { "before": "They arrived two hours ", "after": ".", "accept": ["ago"], "hint": "past simple", "pl": "Przyjechali dwie godziny temu." },
      { "before": "I ", "after": " finished my homework, so I can go out.", "accept": ["have", "'ve"], "hint": "skutek teraz", "pl": "Skończyłem pracę domową, więc mogę wyjść." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Sygnał → czas",
    "pairs": [
      { "left": "yesterday", "right": "past simple" },
      { "left": "since Monday", "right": "present perfect" },
      { "left": "two days ago", "right": "past simple" },
      { "left": "already", "right": "present perfect" },
      { "left": "in 2015", "right": "past simple" },
      { "left": "never", "right": "present perfect" }
    ]
  },
  {
    "type": "quiz",
    "question": "„My brother ___ to Canada — he's living there now.”",
    "options": ["has been", "has gone", "went"],
    "correctIndex": 1,
    "explanation": "„Has gone” znaczy, że pojechał i wciąż tam jest — dokładnie to mówi druga część zdania. „Has been” znaczyłoby, że był i wrócił."
  }
]$content$,
  4
);

-- ----------------------------------------------------------------------------
-- 5. Przyszłość
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'przyszlosc',
  'Przyszłość: will, going to, present continuous',
  'Trzy sposoby mówienia o przyszłości i jasny podział, kiedy który.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Angielski nie ma jednego czasu przyszłego. Ma trzy główne konstrukcje, a wybór zależy nie od czasu, tylko od tego, SKĄD wiesz, że coś się wydarzy — z decyzji podjętej właśnie teraz, z wcześniejszego zamiaru, czy z ustaleń."
  },
  {
    "type": "compare",
    "title": "Trzy konstrukcje",
    "columns": [
      {
        "title": "WILL",
        "formula": "will + forma podstawowa",
        "whenToUse": "decyzja podjęta w tej chwili, przewidywanie, obietnica, propozycja",
        "examples": ["I'll help you with that.", "It will rain tomorrow.", "I promise I won't tell.", "I'll have the soup."]
      },
      {
        "title": "GOING TO",
        "formula": "am/is/are going to + forma podstawowa",
        "whenToUse": "wcześniejszy zamiar, przewidywanie oparte na dowodach",
        "examples": ["We're going to buy a car.", "Look at those clouds — it's going to rain.", "She's going to study medicine."]
      },
      {
        "title": "PRESENT CONTINUOUS",
        "formula": "am/is/are + -ing",
        "whenToUse": "ustalone plany z konkretnym terminem",
        "examples": ["I'm meeting Anna at six.", "We're flying on Monday.", "They're getting married in June."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Test na WILL kontra GOING TO: czy decyzja zapadła PRZED tą rozmową? Jeśli tak — going to. Jeśli podejmujesz ją właśnie mówiąc — will. „The phone's ringing.” „I'll get it.” (decyzja teraz)."
  },
  {
    "type": "table",
    "title": "Przewidywanie: skąd wiesz",
    "headers": ["Podstawa", "Konstrukcja", "Przykład"],
    "rows": [
      ["moje przypuszczenie", "will", "I think he will pass the exam."],
      ["widoczny dowód", "going to", "He hasn't studied — he's going to fail."],
      ["rozkład jazdy, program", "present simple", "The train leaves at 6:30."],
      ["mój ustalony plan", "present continuous", "I'm seeing the dentist tomorrow."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po IF, WHEN, AS SOON AS, UNTIL, BEFORE, AFTER nie stawia się WILL — używa się czasu teraźniejszego: „I'll call you when I arrive”, nie „when I will arrive”. To stały punkt zadań."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "Look at the sky! It ", "after": " to rain.", "accept": ["is going", "'s going"], "hint": "widoczny dowód", "pl": "Popatrz na niebo! Będzie padać." },
      { "before": "I'm tired. I think I ", "after": " go to bed.", "accept": ["will", "'ll"], "hint": "decyzja teraz", "pl": "Jestem zmęczony. Chyba pójdę spać." },
      { "before": "I ", "after": " Anna at six — we arranged it yesterday.", "accept": ["am meeting", "'m meeting"], "hint": "ustalony plan", "pl": "Spotykam się z Anną o szóstej." },
      { "before": "I'll phone you when I ", "after": " home.", "accept": ["get", "arrive"], "hint": "po WHEN bez will", "pl": "Zadzwonię, gdy dotrę do domu." },
      { "before": "The film ", "after": " at 8 p.m.", "accept": ["starts"], "hint": "program, rozkład", "pl": "Film zaczyna się o ósmej." }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdania o przyszłości.",
    "items": [
      { "correct": ["We", "are", "going", "to", "visit", "my", "grandparents"], "pl": "Odwiedzimy dziadków.", "note": "Wcześniejszy zamiar → going to." },
      { "correct": ["I", "will", "call", "you", "as", "soon", "as", "I", "know"], "pl": "Zadzwonię, jak tylko się dowiem.", "note": "Po „as soon as” nie ma will — jest present simple." }
    ]
  },
  {
    "type": "quiz",
    "question": "„A: The phone is ringing. B: ___ get it.”",
    "options": ["I'm going to", "I'll", "I'm getting"],
    "correctIndex": 1,
    "explanation": "Decyzja podejmowana w tej sekundzie to zawsze WILL. „I'm going to get it” sugerowałoby, że planowałeś odebrać telefon jeszcze zanim zadzwonił."
  }
]$content$,
  5
);

-- ----------------------------------------------------------------------------
-- 6. Czasowniki modalne
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'modalne',
  'Czasowniki modalne',
  'Must, have to, should, can, may — obowiązek, rada, pozwolenie i przypuszczenie.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Modalne mówią o stosunku mówiącego do czynności: czy jest obowiązkowa, możliwa, wskazana. Nie odmieniają się (brak -s w trzeciej osobie), a po nich zawsze idzie forma podstawowa bez TO."
  },
  {
    "type": "table",
    "title": "Podstawowe znaczenia",
    "headers": ["Modalny", "Znaczenie", "Przykład"],
    "rows": [
      ["can", "umiejętność, pozwolenie", "I can swim. Can I go?"],
      ["could", "przeszła umiejętność, grzeczna prośba", "I could swim at five. Could you help?"],
      ["must", "obowiązek od mówiącego, pewność", "You must try this. He must be tired."],
      ["have to", "obowiązek z zewnątrz", "I have to wear a uniform."],
      ["should", "rada", "You should see a doctor."],
      ["may / might", "możliwość, formalne pozwolenie", "It may rain. May I come in?"],
      ["needn't", "brak konieczności", "You needn't come."],
      ["mustn't", "zakaz", "You mustn't smoke here."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "MUSTN'T to nie to samo co DON'T HAVE TO. „You mustn't go” = nie wolno ci iść. „You don't have to go” = nie musisz iść, ale możesz. Ta para jest testowana niemal co roku."
  },
  {
    "type": "compare",
    "title": "MUST czy HAVE TO",
    "columns": [
      {
        "title": "MUST",
        "formula": "obowiązek od mówiącego",
        "whenToUse": "sam uznajesz coś za konieczne; też: pewność",
        "examples": ["I must call my mother.", "You must see this film.", "She must be at home — her car is here."]
      },
      {
        "title": "HAVE TO",
        "formula": "obowiązek z zewnątrz",
        "whenToUse": "narzucone przez przepisy, okoliczności, kogoś innego",
        "examples": ["I have to wear a helmet at work.", "We had to pay extra.", "Do you have to leave now?"]
      }
    ]
  },
  {
    "type": "table",
    "title": "Przypuszczenia — jak pewny jesteś",
    "headers": ["Konstrukcja", "Pewność", "Przykład"],
    "rows": [
      ["must be", "prawie pewne, że tak", "He must be ill."],
      ["may / might / could be", "możliwe", "She might be at work."],
      ["can't be", "prawie pewne, że nie", "It can't be true."]
    ],
    "caption": "Uwaga: przeciwieństwem „must be” w przypuszczeniach jest „can't be”, NIE „mustn't be”."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "You ", "after": " smoke here — it's forbidden.", "accept": ["mustn't", "must not", "cannot", "can't"], "hint": "zakaz", "pl": "Nie wolno tu palić." },
      { "before": "You ", "after": " come if you don't want to.", "accept": ["don't have to", "needn't"], "hint": "brak konieczności", "pl": "Nie musisz przychodzić, jeśli nie chcesz." },
      { "before": "You look pale. You ", "after": " see a doctor.", "accept": ["should", "ought to"], "hint": "rada", "pl": "Blado wyglądasz. Powinieneś iść do lekarza." },
      { "before": "His car is outside, so he ", "after": " be at home.", "accept": ["must"], "hint": "prawie pewne", "pl": "Jego samochód stoi przed domem, więc musi być w domu." },
      { "before": "That ", "after": " be true — I saw her yesterday.", "accept": ["can't", "cannot"], "hint": "prawie pewne, że nie", "pl": "To nie może być prawda — widziałem ją wczoraj." },
      { "before": "In my school we ", "after": " wear a uniform.", "accept": ["have to"], "hint": "obowiązek z zewnątrz", "pl": "W mojej szkole musimy nosić mundurki." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Modalny → funkcja",
    "pairs": [
      { "left": "mustn't", "right": "zakaz" },
      { "left": "don't have to", "right": "brak konieczności" },
      { "left": "should", "right": "rada" },
      { "left": "might", "right": "możliwość" },
      { "left": "can't be", "right": "pewność, że nie" },
      { "left": "have to", "right": "obowiązek z zewnątrz" }
    ]
  }
]$content$,
  6
);

-- ----------------------------------------------------------------------------
-- 7. Przedimki
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'przedimki',
  'Przedimki: a, an, the — i kiedy żaden',
  'Polski nie ma przedimków, więc trzeba je zbudować od zera. Jedna reguła i lista wyjątków.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Przedimek to najczęstsza brakująca część mowy w zadaniach z lukami, bo polski nie ma go wcale. Cała reguła sprowadza się do dwóch pytań: czy rzeczownik jest policzalny, i czy rozmówca wie, o który egzemplarz chodzi."
  },
  {
    "type": "table",
    "title": "Podstawowa reguła",
    "headers": ["Sytuacja", "Przedimek", "Przykład"],
    "rows": [
      ["pierwszy raz wspominam, policzalny l.poj.", "a / an", "I saw a dog."],
      ["już wspomniany albo jedyny", "the", "The dog was black."],
      ["l.mn. ogólnie", "brak", "Dogs are loyal."],
      ["niepoliczalny ogólnie", "brak", "Water is essential."],
      ["konkretny niepoliczalny", "the", "The water in this glass is cold."]
    ],
    "caption": "AN przed dźwiękiem samogłoskowym, nie przed literą: an hour (h nieme), a university (brzmi „ju”)."
  },
  {
    "type": "table",
    "title": "THE — obowiązkowe",
    "headers": ["Kategoria", "Przykłady"],
    "rows": [
      ["rzeczy jedyne w swoim rodzaju", "the sun, the moon, the internet"],
      ["stopień najwyższy", "the best, the most important"],
      ["liczby porządkowe", "the first, the second"],
      ["oceany, rzeki, pasma gór", "the Atlantic, the Thames, the Alps"],
      ["kraje w liczbie mnogiej", "the Netherlands, the USA"],
      ["instrumenty muzyczne", "play the piano"],
      ["grupy ludzi", "the rich, the elderly"]
    ]
  },
  {
    "type": "table",
    "title": "Gdzie przedimka NIE MA",
    "headers": ["Kategoria", "Przykłady", "Uwaga"],
    "rows": [
      ["nazwy własne", "Poland, Warsaw, John", "ale: the USA"],
      ["posiłki", "have breakfast, after lunch", ""],
      ["sporty", "play football, do judo", "ale: play THE piano"],
      ["środki transportu", "by car, by train, on foot", ""],
      ["instytucje w ogólnym sensie", "go to school, be in hospital", "ale: go to THE school (budynek)"],
      ["języki", "speak English", "ale: the English language"],
      ["pory dnia z at/by", "at night, by day", "ale: in the morning"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Go to school” znaczy „chodzić do szkoły” jako uczeń. „Go to the school” znaczy „iść do budynku szkoły” — na przykład jako rodzic na zebranie. Ta sama różnica dotyczy hospital, prison, church."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wpisz przedimek albo „brak”",
    "items": [
      { "before": "She plays ", "after": " piano very well.", "accept": ["the"], "hint": "instrument", "pl": "Bardzo dobrze gra na pianinie." },
      { "before": "He plays ", "after": " football every Sunday.", "accept": ["brak", "-", "—"], "hint": "sport", "pl": "Gra w piłkę w każdą niedzielę." },
      { "before": "I go to ", "after": " school by bus.", "accept": ["brak", "-", "—"], "hint": "instytucja w ogólnym sensie", "pl": "Jeżdżę do szkoły autobusem." },
      { "before": "It was ", "after": " best film of the year.", "accept": ["the"], "hint": "stopień najwyższy", "pl": "To był najlepszy film roku." },
      { "before": "We waited for ", "after": " hour.", "accept": ["an"], "hint": "h nieme", "pl": "Czekaliśmy godzinę." },
      { "before": "", "after": " water is essential for life.", "accept": ["brak", "-", "—"], "hint": "niepoliczalny ogólnie", "pl": "Woda jest niezbędna do życia." },
      { "before": "She is ", "after": " university student.", "accept": ["a"], "hint": "brzmi „ju”", "pl": "Jest studentką." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie jest poprawne?",
    "options": [
      "My father is in the hospital — he works there as a nurse.",
      "My father is in hospital — he works there as a nurse.",
      "My father is in a hospital — he works there as a nurse."
    ],
    "correctIndex": 0,
    "explanation": "„In hospital” bez przedimka znaczy „jest pacjentem”. Skoro tam pracuje, chodzi o budynek — więc „in the hospital”."
  }
]$content$,
  7
);

-- ----------------------------------------------------------------------------
-- 8. Policzalne i niepoliczalne
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'policzalne-niepoliczalne',
  'Policzalne, niepoliczalne i określniki ilości',
  'Rzeczowniki, które po polsku mają liczbę mnogą, a po angielsku nie. Plus much, many, few, little.',
  'gramatyka', 9,
  $content$[
  {
    "type": "intro",
    "text": "Angielski dzieli rzeczowniki na policzalne i niepoliczalne inaczej niż polski, i to właśnie te rozbieżności są testowane. „Rada” po polsku ma liczbę mnogą, po angielsku „advice” nie ma jej wcale."
  },
  {
    "type": "table",
    "title": "Niepoliczalne, które Polacy najczęściej odmieniają",
    "headers": ["Angielski", "Polski", "Poprawnie"],
    "rows": [
      ["advice", "rada / rady", "some advice, a piece of advice"],
      ["information", "informacja / informacje", "some information"],
      ["news", "wiadomość / wiadomości", "the news IS good"],
      ["furniture", "mebel / meble", "a piece of furniture"],
      ["luggage", "bagaż / bagaże", "some luggage"],
      ["homework", "zadanie / zadania domowe", "a lot of homework"],
      ["money", "pieniądz / pieniądze", "money IS tight"],
      ["research", "badanie / badania", "some research"],
      ["knowledge", "wiedza", "knowledge IS power"],
      ["equipment", "sprzęt", "some equipment"],
      ["progress", "postęp / postępy", "make progress"],
      ["bread", "chleb", "a loaf of bread"]
    ],
    "caption": "Żaden z nich nie ma formy z -s i żaden nie łączy się z „a”."
  },
  {
    "type": "table",
    "title": "Określniki ilości",
    "headers": ["Policzalne", "Niepoliczalne", "Oba"],
    "rows": [
      ["many", "much", "a lot of / lots of"],
      ["a few (kilka)", "a little (trochę)", "some / any"],
      ["few (mało, za mało)", "little (mało, za mało)", "plenty of"],
      ["how many", "how much", "no"],
      ["several", "a great deal of", "enough"]
    ],
    "caption": "A FEW to „kilka” (pozytywnie), FEW to „niewiele” (negatywnie). Sam przedimek zmienia wydźwięk."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„A few friends came” znaczy, że przyszło kilkoro — dobrze. „Few friends came” znaczy, że prawie nikt nie przyszedł — źle. Ta różnica bywa całą treścią pytania w zadaniu na wybór wielokrotny."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Rzeczowniki, które są zawsze w liczbie mnogiej: trousers, jeans, glasses, scissors, clothes. Mówi się „a pair of trousers”, nigdy „a trouser”."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "She gave me some good ", "after": ".", "accept": ["advice"], "hint": "niepoliczalne", "pl": "Dała mi kilka dobrych rad." },
      { "before": "How ", "after": " money do you need?", "accept": ["much"], "hint": "money jest niepoliczalne", "pl": "Ile potrzebujesz pieniędzy?" },
      { "before": "There were ", "after": " people at the concert — it was almost empty.", "accept": ["few"], "hint": "negatywnie: prawie nikt", "pl": "Na koncercie było mało ludzi." },
      { "before": "The news ", "after": " very encouraging.", "accept": ["is", "was"], "hint": "news = liczba pojedyncza", "pl": "Wiadomości są bardzo zachęcające." },
      { "before": "We bought a new piece of ", "after": " for the living room.", "accept": ["furniture"], "hint": "niepoliczalne", "pl": "Kupiliśmy nowy mebel do salonu." },
      { "before": "I have too ", "after": " homework today.", "accept": ["much"], "hint": "homework jest niepoliczalne", "pl": "Mam dziś za dużo pracy domowej." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Rzeczownik → określnik",
    "pairs": [
      { "left": "advice", "right": "much" },
      { "left": "books", "right": "many" },
      { "left": "information", "right": "a little" },
      { "left": "friends", "right": "a few" },
      { "left": "luggage", "right": "a piece of" }
    ]
  }
]$content$,
  8
);

-- ----------------------------------------------------------------------------
-- 9. Stopniowanie
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'stopniowanie',
  'Stopniowanie przymiotników i porównania',
  'Krótkie z -er, długie z more — plus konstrukcje as… as, the more… the more.',
  'gramatyka', 8,
  $content$[
  {
    "type": "intro",
    "text": "Stopniowanie w angielskim zależy od DŁUGOŚCI przymiotnika, nie od jego znaczenia. To reguła mechaniczna i dlatego wdzięczna: raz zapamiętana, działa zawsze."
  },
  {
    "type": "table",
    "title": "Reguła",
    "headers": ["Długość", "Wyższy", "Najwyższy", "Przykład"],
    "rows": [
      ["jedna sylaba", "-er", "the -est", "tall → taller → the tallest"],
      ["dwie sylaby na -y", "-ier", "the -iest", "happy → happier → the happiest"],
      ["dwie i więcej sylab", "more", "the most", "modern → more modern → the most modern"],
      ["nieregularne", "—", "—", "good → better → the best"]
    ],
    "caption": "Przy jednej sylabie zakończonej spółgłoską po samogłosce podwaja się ostatnią literę: big → bigger."
  },
  {
    "type": "table",
    "title": "Nieregularne",
    "headers": ["Podstawowy", "Wyższy", "Najwyższy"],
    "rows": [
      ["good", "better", "the best"],
      ["bad", "worse", "the worst"],
      ["far", "further / farther", "the furthest / farthest"],
      ["little", "less", "the least"],
      ["much / many", "more", "the most"]
    ]
  },
  {
    "type": "keyPhrases",
    "title": "Konstrukcje porównawcze",
    "caption": "Te wyrażenia pojawiają się w zadaniach z lukami i bardzo dobrze wyglądają w wypowiedzi pisemnej.",
    "groups": [
      {
        "label": "Równość i nierówność",
        "phrases": [
          { "text": "as tall as", "pl": "tak wysoki jak" },
          { "text": "not as expensive as", "pl": "nie tak drogi jak" },
          { "text": "twice as big as", "pl": "dwa razy większy niż" },
          { "text": "the same as", "pl": "taki sam jak" },
          { "text": "different from", "pl": "inny niż" }
        ]
      },
      {
        "label": "Zmiana i zależność",
        "phrases": [
          { "text": "more and more popular", "pl": "coraz popularniejszy" },
          { "text": "better and better", "pl": "coraz lepszy" },
          { "text": "the more you practise, the better you get", "pl": "im więcej ćwiczysz, tym lepszy jesteś" },
          { "text": "by far the best", "pl": "zdecydowanie najlepszy" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po stopniu wyższym idzie THAN, nie „from” ani „as”: „bigger than”, nie „bigger from”. Kalka z polskiego „większy OD” to jeden z najczęstszych błędów."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "This exam was ", "after": " than the last one.", "accept": ["easier", "harder", "more difficult"], "hint": "stopień wyższy", "pl": "Ten egzamin był łatwiejszy niż poprzedni." },
      { "before": "It is the ", "after": " film I have ever seen.", "accept": ["best", "worst"], "hint": "good/bad — stopień najwyższy", "pl": "To najlepszy film, jaki widziałem." },
      { "before": "She is not ", "after": " tall as her brother.", "accept": ["as", "so"], "hint": "konstrukcja równości", "pl": "Nie jest tak wysoka jak brat." },
      { "before": "The situation is getting worse and ", "after": ".", "accept": ["worse"], "hint": "coraz gorzej", "pl": "Sytuacja staje się coraz gorsza." },
      { "before": "My phone is much ", "after": " than yours.", "accept": ["cheaper", "better", "older", "newer"], "hint": "stopień wyższy + than", "pl": "Mój telefon jest dużo tańszy niż twój." }
    ]
  },
  {
    "type": "quiz",
    "question": "„This car is ___ expensive than that one.”",
    "options": ["more", "most", "the most"],
    "correctIndex": 0,
    "explanation": "„Expensive” ma trzy sylaby, więc stopniuje się przez MORE, a obecność THAN wyklucza stopień najwyższy."
  }
]$content$,
  9
);

-- ----------------------------------------------------------------------------
-- 10. Słowotwórstwo
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'slowotworstwo',
  'Słowotwórstwo: przedrostki i przyrostki',
  'Dwa kroki do poprawnej odpowiedzi: najpierw część mowy, potem końcówka.',
  'slownictwo', 10,
  $content$[
  {
    "type": "intro",
    "text": "Zadanie słowotwórcze podaje wyraz DUŻYMI LITERAMI i każe wstawić jego inną formę. Sekwencja jest zawsze ta sama: ustal, jakiej CZĘŚCI MOWY brakuje, dopiero potem dobierz przyrostek. Odwrotna kolejność to najczęstsza przyczyna błędu."
  },
  {
    "type": "table",
    "title": "Krok 1: co stoi obok luki",
    "headers": ["Sąsiedztwo luki", "Potrzebna część mowy", "Przykład"],
    "rows": [
      ["po przedimku (a, the)", "rzeczownik", "a DECISION"],
      ["po be / very / quite", "przymiotnik", "very SUCCESSFUL"],
      ["po czasowniku, opisuje jak", "przysłówek", "spoke CLEARLY"],
      ["przed rzeczownikiem", "przymiotnik", "a DANGEROUS road"],
      ["po przyimku (of, with)", "rzeczownik", "full of ENERGY"]
    ]
  },
  {
    "type": "table",
    "title": "Krok 2: najczęstsze przyrostki",
    "headers": ["Przyrostek", "Tworzy", "Przykład"],
    "rows": [
      ["-tion / -sion", "rzeczownik (czynność)", "decide → decision"],
      ["-ment", "rzeczownik (proces, wynik)", "develop → development"],
      ["-ness", "rzeczownik (cecha)", "happy → happiness"],
      ["-ity", "rzeczownik (cecha)", "able → ability"],
      ["-ance / -ence", "rzeczownik", "important → importance"],
      ["-er / -or / -ist", "osoba", "teach → teacher, science → scientist"],
      ["-ful", "przymiotnik (pełen)", "success → successful"],
      ["-less", "przymiotnik (bez)", "care → careless"],
      ["-able / -ible", "przymiotnik (dający się)", "compare → comparable"],
      ["-ous", "przymiotnik", "danger → dangerous"],
      ["-ly", "przysłówek", "quick → quickly"]
    ]
  },
  {
    "type": "table",
    "title": "Przedrostki przeczące",
    "headers": ["Przedrostek", "Kiedy", "Przykład"],
    "rows": [
      ["un-", "najczęstszy", "happy → unhappy"],
      ["in-", "przed wieloma przymiotnikami", "correct → incorrect"],
      ["im-", "przed p, b, m", "possible → impossible"],
      ["il-", "przed l", "legal → illegal"],
      ["ir-", "przed r", "regular → irregular"],
      ["dis-", "odwrotność czynności", "agree → disagree"],
      ["mis-", "źle, błędnie", "understand → misunderstand"]
    ],
    "caption": "Wybór przedrostka zależy od pierwszej litery wyrazu — to reguła fonetyczna, nie znaczeniowa."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Sprawdź, czy zdanie nie wymaga formy PRZECZĄCEJ. „The instructions were ___ (CLEAR)” w kontekście narzekania to „unclear”, nie „clear”. Sens zdania rozstrzyga, nie sam wyraz w nawiasie."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: utwórz właściwą formę",
    "items": [
      { "before": "The trip was very ", "after": ".", "accept": ["successful"], "hint": "SUCCESS — po „very” przymiotnik", "pl": "Wyjazd był bardzo udany." },
      { "before": "He made an important ", "after": ".", "accept": ["decision"], "hint": "DECIDE — po przymiotniku rzeczownik", "pl": "Podjął ważną decyzję." },
      { "before": "She spoke very ", "after": ".", "accept": ["clearly", "quietly", "quickly"], "hint": "CLEAR — jak mówiła?", "pl": "Mówiła bardzo wyraźnie." },
      { "before": "It is completely ", "after": " to finish it today.", "accept": ["impossible"], "hint": "POSSIBLE — z przedrostkiem przeczącym", "pl": "Zupełnie niemożliwe jest skończyć to dzisiaj." },
      { "before": "We need more ", "after": " about the course.", "accept": ["information"], "hint": "INFORM — po „more” rzeczownik", "pl": "Potrzebujemy więcej informacji o kursie." },
      { "before": "Driving here at night is ", "after": ".", "accept": ["dangerous"], "hint": "DANGER — po „is” przymiotnik", "pl": "Jazda tędy nocą jest niebezpieczna." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Wyraz podstawowy → forma pochodna",
    "pairs": [
      { "left": "decide", "right": "decision" },
      { "left": "happy", "right": "happiness" },
      { "left": "success", "right": "successful" },
      { "left": "legal", "right": "illegal" },
      { "left": "regular", "right": "irregular" },
      { "left": "develop", "right": "development" }
    ]
  },
  {
    "type": "quiz",
    "question": "„His handwriting is completely ___ (READ).”",
    "options": ["readable", "unreadable", "reading"],
    "correctIndex": 1,
    "explanation": "„Completely” plus pismo odręczne sugeruje ocenę negatywną — nieczytelne. Samo „readable” znaczyłoby coś przeciwnego, a „reading” to nie przymiotnik."
  }
]$content$,
  10
);
