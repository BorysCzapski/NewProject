-- ============================================================================
-- supabase/seed/matura-es/17_lessons_srodki_rozszerzona.sql
-- Spanish grammar theory for "Znajomość środków językowych", POZIOM
-- ROZSZERZONY. The podstawowa lessons for the same section are in
-- 02_lessons_srodki_jezykowe.sql — the split is by level, because together the
-- two run to a couple of thousand lines.
--
-- A rozszerzona student is responsible for everything in the podstawowa file
-- too; nothing here repeats it. What is here is the material that separates
-- the two levels in practice: the subjunctive (which podstawowa barely
-- touches and rozszerzona cannot avoid), conditional sentences, reported
-- speech, verbal periphrases, the passive and impersonal SE, and the sentence
-- transformation task — a task type that only appears at this level and that
-- rewards technique as much as grammar.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections
  where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'
);

-- ----------------------------------------------------------------------------
-- 1. Czego wymaga poziom rozszerzony (strategia)
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'czym-rozni-sie-rozszerzenie',
  'Czym różni się poziom rozszerzony',
  'Nowe typy zadań, wyższa poprzeczka i lista struktur, bez których nie da się zdać.',
  'strategia', 6,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu ta część arkusza waży mniej punktowo niż na podstawie, ale jest wyraźnie trudniejsza. Dochodzą zadania, których na podstawie nie ma wcale — przede wszystkim PARAFRAZA ZDANIA, czyli przekształcenie zdania tak, żeby zachowało znaczenie, ale użyło wskazanej konstrukcji."
  },
  {
    "type": "table",
    "title": "Typy zadań, których nie było na podstawie",
    "headers": ["Typ", "Na czym polega", "Co jest testowane"],
    "rows": [
      ["Parafraza zdania", "przepisz zdanie, używając podanego słowa", "subjuntivo, strona bierna, perífrasis"],
      ["Tłumaczenie fragmentu", "przełóż fragment zdania na hiszpański", "szyk, zaimki, przyimki"],
      ["Uzupełnianie tekstu", "luki w ciągłym tekście, bez opcji", "spójniki, tryby, czasy"]
    ],
    "caption": "W parafrazie liczy się WSZYSTKO: gramatyka, ortografia i to, czy znaczenie zostało zachowane."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W parafrazie nie wolno zmieniać podanego wyrazu. Jeśli w poleceniu jest QUE, ma się pojawić dokładnie „que”, a nie „de que” czy „porque”, chyba że polecenie na to pozwala."
  },
  {
    "type": "table",
    "title": "Struktury, bez których nie da się zdać rozszerzenia",
    "headers": ["Struktura", "Przykład", "Lekcja"],
    "rows": [
      ["presente de subjuntivo", "Espero que vengas.", "Subjuntivo — formy"],
      ["imperfecto de subjuntivo", "Si tuviera dinero, viajaría.", "Okresy warunkowe"],
      ["mowa zależna", "Dijo que vendría.", "Mowa zależna"],
      ["strona bierna i se", "Se construyó en 1990.", "Strona bierna"],
      ["perífrasis verbales", "Acabo de llegar.", "Perífrasis"],
      ["konektory", "No obstante, sin embargo", "Konektory"]
    ]
  },
  {
    "type": "quiz",
    "question": "Parafraza: „Es necesario estudiar más.” → „Es necesario que tú ___ más.”",
    "options": ["estudias", "estudies", "estudiar"],
    "correctIndex": 1,
    "explanation": "Po „es necesario QUE” z konkretnym podmiotem obowiązkowo idzie subjuntivo: estudies. Bez „que” zostaje bezokolicznik. To najczęstsza parafraza na rozszerzeniu."
  }
]$content$,
  1
);

-- ----------------------------------------------------------------------------
-- 2. Subjuntivo — formy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'subjuntivo-formy',
  'Subjuntivo — jak tworzyć formy',
  'Presente i imperfecto de subjuntivo. Jedna reguła tworzenia, kilkanaście nieregularności.',
  'gramatyka', 12,
  $content$[
  {
    "type": "intro",
    "text": "Subjuntivo nie ma polskiego odpowiednika — to nie czas, tylko TRYB, którym hiszpański sygnalizuje, że coś jest życzeniem, wątpliwością albo oceną, a nie faktem. Najpierw formy, w następnej lekcji użycie."
  },
  {
    "type": "formula",
    "title": "Jak zbudować presente de subjuntivo",
    "caption": "Weź 1. osobę presente, odetnij -o, dopisz końcówki „odwrotne”: czasowniki na -ar biorą e, pozostałe biorą a.",
    "variants": [
      {
        "label": "hablar → hable",
        "parts": [
          { "text": "hablo", "role": "verb", "note": "1. os. presente" },
          { "text": "habl-", "role": "other", "note": "odetnij -o" },
          { "text": "+ e", "role": "aux", "note": "końcówka -ar → e" }
        ],
        "example": { "en": "Espero que hables con él.", "pl": "Mam nadzieję, że z nim porozmawiasz." }
      },
      {
        "label": "comer → coma",
        "parts": [
          { "text": "como", "role": "verb" },
          { "text": "com-", "role": "other" },
          { "text": "+ a", "role": "aux", "note": "końcówka -er/-ir → a" }
        ],
        "example": { "en": "Quiero que comas algo.", "pl": "Chcę, żebyś coś zjadł." }
      },
      {
        "label": "tener → tenga",
        "parts": [
          { "text": "tengo", "role": "verb", "note": "nieregularna 1. osoba" },
          { "text": "teng-", "role": "other", "note": "nieregularność zostaje!" },
          { "text": "+ a", "role": "aux" }
        ],
        "example": { "en": "Ojalá tengas suerte.", "pl": "Oby ci się poszczęściło." }
      }
    ]
  },
  {
    "type": "conjugation",
    "title": "Presente de subjuntivo — końcówki",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "hablar", "forms": ["hable", "hables", "hable", "hablemos", "habléis", "hablen"] },
      { "label": "comer", "forms": ["coma", "comas", "coma", "comamos", "comáis", "coman"] },
      { "label": "vivir", "forms": ["viva", "vivas", "viva", "vivamos", "viváis", "vivan"] }
    ],
    "caption": "1. i 3. osoba liczby pojedynczej są identyczne — kontekst rozstrzyga, o kogo chodzi."
  },
  {
    "type": "conjugation",
    "title": "Sześć nieregularnych, których nie da się wyprowadzić",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "SER", "forms": ["sea", "seas", "sea", "seamos", "seáis", "sean"] },
      { "label": "IR", "forms": ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"] },
      { "label": "SABER", "forms": ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"] },
      { "label": "HABER", "forms": ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"] },
      { "label": "ESTAR", "forms": ["esté", "estés", "esté", "estemos", "estéis", "estén"] },
      { "label": "DAR", "forms": ["dé", "des", "dé", "demos", "deis", "den"] }
    ],
    "highlight": ["sea", "vaya", "sepa", "haya", "esté", "dé"],
    "caption": "Mnemotechnika: SER, IR, SABER, HABER, ESTAR, DAR. Reszta powstaje z 1. osoby presente."
  },
  {
    "type": "formula",
    "title": "Imperfecto de subjuntivo",
    "caption": "Weź 3. osobę liczby mnogiej indefinido, odetnij -ron, dopisz -ra (albo -se — obie formy są poprawne).",
    "variants": [
      {
        "label": "hablar",
        "parts": [
          { "text": "hablaron", "role": "verb", "note": "3. os. l.mn. indefinido" },
          { "text": "habla-", "role": "other", "note": "odetnij -ron" },
          { "text": "+ ra", "role": "aux" }
        ],
        "example": { "en": "Si hablara español, trabajaría allí.", "pl": "Gdybym mówił po hiszpańsku, pracowałbym tam." }
      },
      {
        "label": "tener",
        "parts": [
          { "text": "tuvieron", "role": "verb" },
          { "text": "tuvie-", "role": "other" },
          { "text": "+ ra", "role": "aux" }
        ],
        "example": { "en": "Si tuviera tiempo, iría.", "pl": "Gdybym miał czas, poszedłbym." }
      },
      {
        "label": "ser / ir (ta sama forma)",
        "parts": [
          { "text": "fueron", "role": "verb", "note": "ser i ir mają wspólne indefinido" },
          { "text": "fue-", "role": "other" },
          { "text": "+ ra", "role": "aux" }
        ],
        "example": { "en": "Si fuera rico, viajaría más.", "pl": "Gdybym był bogaty, więcej bym podróżował." }
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ta reguła jest bezwyjątkowa. KAŻDY czasownik, także najbardziej nieregularny, tworzy imperfecto de subjuntivo z 3. osoby l.mn. indefinido. Jeśli znasz „dijeron”, masz „dijera”."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: utwórz subjuntivo",
    "items": [
      { "before": "Espero que (tú) ", "after": " pronto.", "accept": ["vengas"], "hint": "venir — presente de subj., 1 os. presente: vengo", "pl": "Mam nadzieję, że wkrótce przyjdziesz." },
      { "before": "Quiero que ellos ", "after": " la verdad.", "accept": ["sepan"], "hint": "saber — nieregularne", "pl": "Chcę, żeby znali prawdę." },
      { "before": "Ojalá ", "after": " buen tiempo mañana.", "accept": ["haga"], "hint": "hacer — 1 os. presente: hago", "pl": "Oby jutro była dobra pogoda." },
      { "before": "Si (yo) ", "after": " más dinero, compraría un coche.", "accept": ["tuviera", "tuviese"], "hint": "tener — imperfecto de subj., indefinido: tuvieron", "pl": "Gdybym miał więcej pieniędzy, kupiłbym samochód." },
      { "before": "No creo que ", "after": " fácil.", "accept": ["sea"], "hint": "ser — nieregularne", "pl": "Nie sądzę, żeby to było łatwe." },
      { "before": "Me pidió que ", "after": " temprano.", "accept": ["llegara", "llegase"], "hint": "llegar — imperfecto de subj.", "pl": "Poprosił, żebym przyszedł wcześnie." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Bezokolicznik → presente de subjuntivo (yo)",
    "pairs": [
      { "left": "ser", "right": "sea" },
      { "left": "ir", "right": "vaya" },
      { "left": "saber", "right": "sepa" },
      { "left": "haber", "right": "haya" },
      { "left": "tener", "right": "tenga" },
      { "left": "poder", "right": "pueda" }
    ]
  }
]$content$,
  2
);

-- ----------------------------------------------------------------------------
-- 3. Subjuntivo — kiedy go używać
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'subjuntivo-uzycie',
  'Subjuntivo — kiedy go używać',
  'Cztery wyzwalacze trybu łączącego plus lista spójników, po których jest obowiązkowy.',
  'gramatyka', 13,
  $content$[
  {
    "type": "intro",
    "text": "Formy znasz z poprzedniej lekcji. Teraz pytanie kluczowe: kiedy hiszpański przełącza się na subjuntivo? Prawie zawsze rozstrzyga to, co stoi PRZED „que” — zdanie nadrzędne wymusza tryb w podrzędnym."
  },
  {
    "type": "table",
    "title": "Cztery wyzwalacze",
    "headers": ["Wyzwalacz", "Typowe zwroty", "Przykład"],
    "rows": [
      ["Wola, prośba, rada", "querer que, pedir que, aconsejar que, es necesario que", "Quiero que vengas."],
      ["Emocja i ocena", "me alegro de que, es una pena que, me molesta que", "Me alegro de que estés aquí."],
      ["Wątpliwość i przeczenie", "no creo que, dudo que, no es verdad que", "No creo que sea difícil."],
      ["Cel i warunek przyszły", "para que, cuando (o przyszłości), antes de que", "Te lo digo para que lo sepas."]
    ],
    "caption": "Wspólny mianownik: żadne z tych zdań nie STWIERDZA faktu. Fakt = indicativo, wszystko inne = subjuntivo."
  },
  {
    "type": "compare",
    "title": "Ta sama konstrukcja, inny tryb",
    "columns": [
      {
        "title": "INDICATIVO — stwierdzam fakt",
        "formula": "creo que + indicativo",
        "whenToUse": "gdy zdanie nadrzędne twierdzi, że coś jest prawdą",
        "examples": ["Creo que tiene razón.", "Es verdad que llueve.", "Sé que viene mañana.", "Cuando llegué, ya estaba."]
      },
      {
        "title": "SUBJUNTIVO — nie stwierdzam",
        "formula": "no creo que + subjuntivo",
        "whenToUse": "gdy zdanie nadrzędne przeczy, wątpi, chce albo ocenia",
        "examples": ["No creo que tenga razón.", "No es verdad que llueva.", "Quiero que venga mañana.", "Cuando llegue, hablamos."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "CUANDO to najczęstsza pułapka. O przeszłości i zwyczaju — indicativo („Cuando llego a casa, ceno”). O PRZYSZŁOŚCI — subjuntivo („Cuando llegue a casa, cenaré”). Polski nie sygnalizuje tej różnicy w ogóle."
  },
  {
    "type": "keyPhrases",
    "title": "Spójniki i to, czego wymagają",
    "caption": "Pierwsza grupa nie daje wyboru. Drugą trzeba rozstrzygnąć kontekstem.",
    "groups": [
      {
        "label": "ZAWSZE subjuntivo",
        "phrases": [
          { "text": "para que", "pl": "żeby (cel)" },
          { "text": "antes de que", "pl": "zanim" },
          { "text": "sin que", "pl": "bez tego, żeby" },
          { "text": "a menos que", "pl": "chyba że" },
          { "text": "con tal de que", "pl": "pod warunkiem że" },
          { "text": "en caso de que", "pl": "w razie gdyby" },
          { "text": "ojalá", "pl": "oby" }
        ]
      },
      {
        "label": "Zależnie od kontekstu",
        "phrases": [
          { "text": "cuando", "pl": "gdy — przyszłość: subjuntivo" },
          { "text": "aunque", "pl": "chociaż — fakt: indicativo, przypuszczenie: subjuntivo" },
          { "text": "mientras", "pl": "podczas gdy / dopóki" },
          { "text": "después de que", "pl": "po tym jak" },
          { "text": "hasta que", "pl": "dopóki nie" }
        ]
      },
      {
        "label": "ZAWSZE indicativo",
        "phrases": [
          { "text": "porque", "pl": "ponieważ" },
          { "text": "ya que", "pl": "skoro" },
          { "text": "puesto que", "pl": "jako że" },
          { "text": "así que", "pl": "więc" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Jeśli podmiot obu zdań jest TEN SAM, zamiast „que + subjuntivo” używa się bezokolicznika: „Quiero ir” (chcę iść), ale „Quiero que vayas” (chcę, żebyś poszedł). Mylenie tych dwóch to typowy błąd w wypowiedzi pisemnej."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: indicativo czy subjuntivo",
    "items": [
      { "before": "Creo que Ana ", "after": " razón.", "accept": ["tiene"], "hint": "tener — creo que stwierdza fakt", "pl": "Myślę, że Ana ma rację." },
      { "before": "No creo que Ana ", "after": " razón.", "accept": ["tenga"], "hint": "tener — przeczenie", "pl": "Nie sądzę, żeby Ana miała rację." },
      { "before": "Cuando ", "after": " a casa, te llamo.", "accept": ["llegue"], "hint": "llegar — mowa o przyszłości", "pl": "Kiedy dotrę do domu, zadzwonię." },
      { "before": "Cuando ", "after": " a casa, siempre ceno.", "accept": ["llego"], "hint": "llegar — zwyczaj", "pl": "Kiedy wracam do domu, zawsze jem kolację." },
      { "before": "Te lo explico para que lo ", "after": ".", "accept": ["entiendas"], "hint": "entender — para que", "pl": "Wyjaśniam ci to, żebyś zrozumiał." },
      { "before": "Aunque ", "after": " frío, saldremos.", "accept": ["haga"], "hint": "hacer — przypuszczenie o przyszłości", "pl": "Nawet gdyby było zimno, wyjdziemy." },
      { "before": "Me alegro de que ", "after": " aquí.", "accept": ["estés"], "hint": "estar — emocja", "pl": "Cieszę się, że tu jesteś." }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdania z trybem łączącym.",
    "items": [
      { "correct": ["Es", "importante", "que", "estudies", "todos", "los", "días"], "pl": "Ważne, żebyś uczył się codziennie.", "note": "Ocena + que → subjuntivo." },
      { "correct": ["No", "creo", "que", "sea", "una", "buena", "idea"], "pl": "Nie sądzę, żeby to był dobry pomysł.", "note": "Przeczenie wątpliwości → subjuntivo." },
      { "correct": ["Llámame", "antes", "de", "que", "salgas"], "pl": "Zadzwoń, zanim wyjdziesz.", "note": "antes de que zawsze wymaga subjuntivo." }
    ]
  },
  {
    "type": "quiz",
    "question": "„Es evidente que ___ (haber) un problema.”",
    "options": ["haya", "hay", "hubiera"],
    "correctIndex": 1,
    "explanation": "„Es evidente que” STWIERDZA fakt, więc idzie indicativo: hay. Subjuntivo pojawiłoby się dopiero w przeczeniu: „No es evidente que haya un problema”."
  }
]$content$,
  3
);

-- ----------------------------------------------------------------------------
-- 4. Okresy warunkowe
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'okresy-warunkowe',
  'Okresy warunkowe z SI',
  'Trzy typy zdań warunkowych i jedna reguła, której nie wolno złamać.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Zdania z SI dzielą się na trzy typy według tego, jak realny jest warunek. Każdy typ ma sztywną parę czasów — i to właśnie ta para jest sprawdzana w parafrazach."
  },
  {
    "type": "table",
    "title": "Trzy typy",
    "headers": ["Typ", "Po SI", "W drugiej części", "Przykład"],
    "rows": [
      ["realny (przyszłość)", "presente", "futuro / presente / rozkaz", "Si estudias, aprobarás."],
      ["nierealny (teraźniejszość)", "imperf. de subjuntivo", "condicional simple", "Si estudiaras, aprobarías."],
      ["nierealny (przeszłość)", "pluscuamp. de subjuntivo", "condicional compuesto", "Si hubieras estudiado, habrías aprobado."]
    ],
    "caption": "Typ 1: może się zdarzyć. Typ 2: teoretycznie, ale raczej nie. Typ 3: już się nie zdarzy, bo jest po czasie."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "ŻELAZNA REGUŁA: po SI nigdy nie stawia się futuro ani condicional. „Si tendré”, „si tendría” to błędy. Poprawnie: „si tengo” albo „si tuviera”."
  },
  {
    "type": "conjugation",
    "title": "Condicional simple — końcówki",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "hablar", "forms": ["hablaría", "hablarías", "hablaría", "hablaríamos", "hablaríais", "hablarían"] },
      { "label": "tener (nieregul.)", "forms": ["tendría", "tendrías", "tendría", "tendríamos", "tendríais", "tendrían"] },
      { "label": "hacer (nieregul.)", "forms": ["haría", "harías", "haría", "haríamos", "haríais", "harían"] }
    ],
    "highlight": ["tendría", "tendrías", "tendría", "tendríamos", "tendríais", "tendrían", "haría", "harías", "haría", "haríamos", "haríais", "harían"],
    "caption": "Końcówki dokleja się do BEZOKOLICZNIKA. Nieregularne tematy są te same co w futuro: tendr-, podr-, har-, dir-, saldr-, vendr-, querr-, sabr-."
  },
  {
    "type": "examples",
    "title": "Te same zdania w trzech typach",
    "items": [
      { "en": "Si tengo tiempo, te ayudo.", "pl": "Jeśli będę miał czas, pomogę ci — realne.", "highlight": "tengo" },
      { "en": "Si tuviera tiempo, te ayudaría.", "pl": "Gdybym miał czas, pomógłbym ci — ale nie mam.", "highlight": "tuviera" },
      { "en": "Si hubiera tenido tiempo, te habría ayudado.", "pl": "Gdybym miał był czas, pomógłbym ci — wczoraj, za późno.", "highlight": "hubiera tenido" }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Condicional przydaje się też poza zdaniami warunkowymi: do grzecznych próśb („¿Podrías ayudarme?”) i do rad („Yo que tú, hablaría con él”). W wypowiedzi pisemnej obie konstrukcje robią bardzo dobre wrażenie."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzupełnij warunek",
    "items": [
      { "before": "Si ", "after": " más, aprobarías.", "accept": ["estudiaras", "estudiases"], "hint": "estudiar — typ 2", "pl": "Gdybyś się więcej uczył, zdałbyś." },
      { "before": "Si llueve mañana, no ", "after": ".", "accept": ["saldremos", "salimos"], "hint": "salir — typ 1", "pl": "Jeśli jutro będzie padać, nie wyjdziemy." },
      { "before": "Si (yo) ", "after": " rico, viajaría por el mundo.", "accept": ["fuera", "fuese"], "hint": "ser — typ 2", "pl": "Gdybym był bogaty, podróżowałbym po świecie." },
      { "before": "Si hubieras venido, lo ", "after": ".", "accept": ["habrías visto"], "hint": "ver — typ 3", "pl": "Gdybyś przyszedł, zobaczyłbyś to." },
      { "before": "¿", "after": " ayudarme, por favor?", "accept": ["Podrías", "podrías"], "hint": "poder — grzeczna prośba", "pl": "Mógłbyś mi pomóc?" }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdanie warunkowe.",
    "items": [
      { "correct": ["Si", "tuviera", "dinero", "me", "compraría", "una", "moto"], "pl": "Gdybym miał pieniądze, kupiłbym sobie motocykl.", "note": "Typ 2: imperfecto de subjuntivo + condicional." },
      { "correct": ["Yo", "que", "tú", "hablaría", "con", "el", "profesor"], "pl": "Na twoim miejscu porozmawiałbym z nauczycielem.", "note": "„Yo que tú” + condicional to standardowy sposób udzielania rad." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie jest POPRAWNE?",
    "options": [
      "Si tendría tiempo, iría contigo.",
      "Si tuviera tiempo, iría contigo.",
      "Si tendré tiempo, iré contigo."
    ],
    "correctIndex": 1,
    "explanation": "Po SI nie może stać ani condicional (tendría), ani futuro (tendré). Warunek nierealny wymaga imperfecto de subjuntivo: tuviera."
  }
]$content$,
  4
);

-- ----------------------------------------------------------------------------
-- 5. Mowa zależna
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'mowa-zalezna',
  'Mowa zależna',
  'Co się zmienia, gdy relacjonujesz cudze słowa: czasy, zaimki i okoliczniki.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Mowa zależna to relacjonowanie cudzych słów. Jeśli czasownik wprowadzający jest w czasie przeszłym (dijo, preguntó), przesuwają się trzy rzeczy naraz: czas, zaimki i okoliczniki czasu i miejsca. Zapominanie o dwóch ostatnich to najczęstszy błąd."
  },
  {
    "type": "table",
    "title": "Przesunięcie czasów po „dijo que”",
    "headers": ["Mowa niezależna", "Mowa zależna", "Przykład"],
    "rows": [
      ["presente", "imperfecto", "„Trabajo” → Dijo que trabajaba."],
      ["indefinido / perfecto", "pluscuamperfecto", "„Trabajé” → Dijo que había trabajado."],
      ["futuro", "condicional", "„Trabajaré” → Dijo que trabajaría."],
      ["imperativo", "imperf. de subjuntivo", "„¡Trabaja!” → Me dijo que trabajara."],
      ["imperfecto", "imperfecto (bez zmian)", "„Trabajaba” → Dijo que trabajaba."],
      ["condicional", "condicional (bez zmian)", "„Trabajaría” → Dijo que trabajaría."]
    ],
    "caption": "Dwa ostatnie wiersze są ważne: imperfecto i condicional już się nie cofają, bo nie ma dokąd."
  },
  {
    "type": "table",
    "title": "Co jeszcze się przesuwa",
    "headers": ["Mowa niezależna", "Mowa zależna"],
    "rows": [
      ["hoy", "aquel día"],
      ["ayer", "el día anterior"],
      ["mañana", "al día siguiente"],
      ["ahora", "entonces"],
      ["aquí", "allí"],
      ["este", "aquel"],
      ["venir", "ir"],
      ["traer", "llevar"]
    ]
  },
  {
    "type": "examples",
    "title": "Pełne przekształcenie",
    "items": [
      { "en": "\"Hoy estoy cansado.\" → Dijo que aquel día estaba cansado.", "pl": "Powiedział, że tego dnia był zmęczony.", "highlight": "aquel día estaba" },
      { "en": "\"Mañana te llamo.\" → Dijo que al día siguiente me llamaría.", "pl": "Powiedział, że następnego dnia do mnie zadzwoni.", "highlight": "al día siguiente me llamaría" },
      { "en": "\"¿Dónde vives?\" → Me preguntó dónde vivía.", "pl": "Zapytał, gdzie mieszkam.", "highlight": "dónde vivía" },
      { "en": "\"Ven aquí.\" → Me dijo que fuera allí.", "pl": "Powiedział, żebym tam poszedł.", "highlight": "que fuera allí" }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Pytania bez słowa pytającego wprowadza się przez SI: „¿Vienes?” → Me preguntó SI venía. W pytaniach ze słowem pytającym akcent graficzny ZOSTAJE: dónde, cuándo, qué."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Jeśli czasownik wprowadzający jest w czasie TERAŹNIEJSZYM (dice que), nic się nie przesuwa: „Trabajo” → Dice que trabaja. Przesunięcie uruchamia dopiero przeszłość."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zamień na mowę zależną",
    "items": [
      { "before": "\"Estoy enfermo.\" → Dijo que ", "after": " enfermo.", "accept": ["estaba"], "hint": "presente → imperfecto", "pl": "Powiedział, że jest chory." },
      { "before": "\"Llegaré tarde.\" → Dijo que ", "after": " tarde.", "accept": ["llegaría"], "hint": "futuro → condicional", "pl": "Powiedział, że przyjdzie późno." },
      { "before": "\"He terminado.\" → Dijo que ", "after": ".", "accept": ["había terminado"], "hint": "perfecto → pluscuamperfecto", "pl": "Powiedział, że skończył." },
      { "before": "\"¡Espérame!\" → Me pidió que lo ", "after": ".", "accept": ["esperara", "esperase"], "hint": "rozkaz → imperf. de subjuntivo", "pl": "Poprosił, żebym na niego zaczekał." },
      { "before": "\"¿Tienes hambre?\" → Me preguntó si ", "after": " hambre.", "accept": ["tenía"], "hint": "pytanie bez słowa pytającego", "pl": "Zapytał, czy jestem głodny." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Okolicznik → jego odpowiednik w mowie zależnej",
    "pairs": [
      { "left": "hoy", "right": "aquel día" },
      { "left": "ayer", "right": "el día anterior" },
      { "left": "mañana", "right": "al día siguiente" },
      { "left": "ahora", "right": "entonces" },
      { "left": "aquí", "right": "allí" }
    ]
  }
]$content$,
  5
);

-- ----------------------------------------------------------------------------
-- 6. Perífrasis verbales
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'perifrasis',
  'Perífrasis verbales',
  'Konstrukcje typu „acabar de”, „volver a”, „ponerse a” — jedna z najlepiej punktowanych rzeczy na rozszerzeniu.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Perífrasis to zestaw czasownika posiłkowego z bezokolicznikiem, gerundio albo imiesłowem. Hiszpański wyraża nimi to, co polski robi przedrostkami i przysłówkami — „dopiero co przyszedłem”, „znowu to zrobił”, „zabrał się do pracy”. Na maturze pojawiają się w parafrazach i bardzo podnoszą ocenę za zakres środków."
  },
  {
    "type": "table",
    "title": "Z bezokolicznikiem",
    "headers": ["Konstrukcja", "Znaczenie", "Przykład"],
    "rows": [
      ["ir a + bezok.", "zamiar, bliska przyszłość", "Voy a estudiar esta tarde."],
      ["acabar de + bezok.", "dopiero co", "Acabo de llegar."],
      ["volver a + bezok.", "znowu coś zrobić", "Volvió a llamar."],
      ["empezar a + bezok.", "zacząć", "Empezó a llover."],
      ["ponerse a + bezok.", "zabrać się do", "Se puso a trabajar."],
      ["dejar de + bezok.", "przestać", "Dejé de fumar."],
      ["tener que + bezok.", "musieć (obowiązek)", "Tengo que irme."],
      ["deber de + bezok.", "chyba, pewnie", "Debe de estar en casa."],
      ["soler + bezok.", "mieć w zwyczaju", "Suelo levantarme temprano."]
    ]
  },
  {
    "type": "table",
    "title": "Z gerundio i imiesłowem",
    "headers": ["Konstrukcja", "Znaczenie", "Przykład"],
    "rows": [
      ["estar + gerundio", "czynność w toku", "Estoy leyendo."],
      ["seguir / continuar + ger.", "nadal coś robić", "Sigue lloviendo."],
      ["llevar + czas + ger.", "robić coś od jakiegoś czasu", "Llevo dos años estudiando español."],
      ["ir + gerundio", "stopniowo", "Va mejorando poco a poco."],
      ["llevar + imiesłów", "mieć coś zrobione", "Llevo escritas tres páginas."],
      ["quedar + imiesłów", "pozostać w jakimś stanie", "Quedé sorprendido."]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "„Llevo dos años estudiando español” to najelegantszy sposób powiedzenia „uczę się hiszpańskiego od dwóch lat”. Alternatywy: „Estudio español desde hace dos años” albo „Hace dos años que estudio español” — wszystkie trzy bywają w parafrazach."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na różnicę: DEBER + bezokolicznik to obowiązek („Debes estudiar” — powinieneś się uczyć), a DEBER DE + bezokolicznik to przypuszczenie („Debe de estudiar mucho” — pewnie dużo się uczy). Jedno „de” zmienia całe znaczenie."
  },
  {
    "type": "examples",
    "title": "Perífrasis w parafrazie",
    "items": [
      { "en": "Ha llegado hace un momento. → Acaba de llegar.", "pl": "Dopiero co przyszedł.", "highlight": "Acaba de" },
      { "en": "Lo hizo otra vez. → Volvió a hacerlo.", "pl": "Zrobił to znowu.", "highlight": "Volvió a" },
      { "en": "Ya no fumo. → He dejado de fumar.", "pl": "Rzuciłem palenie.", "highlight": "dejado de" },
      { "en": "Normalmente ceno a las nueve. → Suelo cenar a las nueve.", "pl": "Zwykle jem kolację o dziewiątej.", "highlight": "Suelo" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzupełnij perífrasis",
    "items": [
      { "before": "", "after": " de terminar el trabajo, no te preocupes.", "accept": ["Acabo", "acabo"], "hint": "acabar de — dopiero co", "pl": "Właśnie skończyłem pracę, nie martw się." },
      { "before": "Después del accidente, ", "after": " a conducir.", "accept": ["volvió", "volví"], "hint": "volver a — znowu", "pl": "Po wypadku znowu zaczął prowadzić." },
      { "before": "", "after": " tres años viviendo en Madrid.", "accept": ["Llevo", "llevo"], "hint": "llevar + czas + gerundio", "pl": "Mieszkam w Madrycie od trzech lat." },
      { "before": "(Yo) ", "after": " que estudiar más.", "accept": ["tengo"], "hint": "tener que — obowiązek", "pl": "Muszę się więcej uczyć." },
      { "before": "Nos ", "after": " a trabajar inmediatamente.", "accept": ["pusimos"], "hint": "ponerse a — zabrać się do", "pl": "Natychmiast zabraliśmy się do pracy." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Konstrukcja → znaczenie",
    "pairs": [
      { "left": "acabar de", "right": "dopiero co" },
      { "left": "volver a", "right": "znowu" },
      { "left": "dejar de", "right": "przestać" },
      { "left": "ponerse a", "right": "zabrać się do" },
      { "left": "soler", "right": "mieć w zwyczaju" },
      { "left": "seguir + gerundio", "right": "nadal coś robić" }
    ]
  },
  {
    "type": "quiz",
    "question": "„Estudié español durante tres años y ahora he empezado otra vez.” Jak to skrócić?",
    "options": ["He vuelto a estudiar español.", "Acabo de estudiar español.", "Suelo estudiar español."],
    "correctIndex": 0,
    "explanation": "„Otra vez” = znowu, więc volver a. „Acabar de” znaczyłoby „dopiero co skończyłem”, a „soler” — „mam w zwyczaju”."
  }
]$content$,
  6
);

-- ----------------------------------------------------------------------------
-- 7. Strona bierna i konstrukcje z SE
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'strona-bierna-se',
  'Strona bierna i konstrukcje z SE',
  'Trzy sposoby powiedzenia tego samego bez wskazywania wykonawcy — i który brzmi naturalnie.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Hiszpański unika strony biernej z „ser” w mowie potocznej — brzmi ona sztucznie i tłumaczeniowo. Zamiast niej używa konstrukcji z SE. Na maturze musisz umieć obie: rozpoznać bierną w tekście i utworzyć wersję z SE w parafrazie."
  },
  {
    "type": "compare",
    "title": "Trzy sposoby",
    "columns": [
      {
        "title": "SER + imiesłów",
        "formula": "El libro fue escrito por Cervantes.",
        "whenToUse": "gdy wykonawca jest ważny i podany (por…); typowe dla tekstów pisanych",
        "examples": ["La casa fue construida en 1920.", "El acuerdo fue firmado por ambas partes."]
      },
      {
        "title": "SE pasiva refleja",
        "formula": "Se construyó la casa en 1920.",
        "whenToUse": "gdy wykonawca jest nieistotny; NAJNATURALNIEJSZE po hiszpańsku",
        "examples": ["Se venden pisos.", "Se habla español.", "Se construyeron dos puentes."]
      },
      {
        "title": "SE impersonal",
        "formula": "Se vive bien aquí.",
        "whenToUse": "gdy nie ma żadnego dopełnienia — odpowiednik polskiego „się” bezosobowego",
        "examples": ["Se come muy bien en este bar.", "No se puede fumar aquí."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W konstrukcji „se + czasownik + rzeczownik” czasownik UZGADNIA SIĘ z rzeczownikiem: „Se vende piso” (jeden), ale „Se venden pisos” (kilka). To ulubione pytanie w zadaniach z lukami i najczęstszy błąd."
  },
  {
    "type": "examples",
    "title": "Ta sama treść, trzy formy",
    "items": [
      { "en": "Alguien robó el coche. → El coche fue robado.", "pl": "Samochód został skradziony.", "highlight": "fue robado" },
      { "en": "Alguien robó el coche. → Se robó el coche.", "pl": "Skradziono samochód — naturalniej.", "highlight": "Se robó" },
      { "en": "Aquí venden libros usados. → Aquí se venden libros usados.", "pl": "Tu sprzedaje się używane książki.", "highlight": "se venden" },
      { "en": "La gente vive bien aquí. → Se vive bien aquí.", "pl": "Żyje się tu dobrze.", "highlight": "Se vive" }
    ]
  },
  {
    "type": "table",
    "title": "Uwaga: SE ma cztery różne zastosowania",
    "headers": ["Typ", "Przykład", "Znaczenie"],
    "rows": [
      ["zwrotne", "Se lava.", "Myje się (sam siebie)."],
      ["wzajemne", "Se escriben.", "Piszą do siebie."],
      ["bierne / bezosobowe", "Se venden pisos.", "Sprzedaje się mieszkania."],
      ["zamiast LE", "Se lo di.", "Dałem mu to."]
    ],
    "caption": "Ostatni wiersz to reguła z lekcji o zaimkach: le + lo → se lo."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzgodnij formę",
    "items": [
      { "before": "En esta tienda se ", "after": " ropa de segunda mano.", "accept": ["vende"], "hint": "vender — ropa jest w liczbie pojedynczej", "pl": "W tym sklepie sprzedaje się odzież używaną." },
      { "before": "Se ", "after": " dos escuelas el año pasado.", "accept": ["construyeron"], "hint": "construir — dos escuelas, liczba mnoga", "pl": "W zeszłym roku zbudowano dwie szkoły." },
      { "before": "Aquí no se ", "after": " fumar.", "accept": ["puede"], "hint": "poder — konstrukcja bezosobowa", "pl": "Tu nie wolno palić." },
      { "before": "La catedral ", "after": " construida en el siglo XIII.", "accept": ["fue"], "hint": "ser — strona bierna", "pl": "Katedrę zbudowano w XIII wieku." },
      { "before": "Se ", "after": " muy bien en Andalucía.", "accept": ["come", "vive"], "hint": "comer albo vivir — bezosobowe", "pl": "W Andaluzji je się bardzo dobrze." }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdanie bezosobowe.",
    "items": [
      { "correct": ["Se", "necesitan", "camareros", "con", "experiencia"], "pl": "Poszukiwani kelnerzy z doświadczeniem.", "note": "camareros w l.mn. → necesitan w l.mn." },
      { "correct": ["En", "España", "se", "cena", "muy", "tarde"], "pl": "W Hiszpanii je się kolację bardzo późno.", "note": "Brak dopełnienia → forma bezosobowa w l.poj." }
    ]
  },
  {
    "type": "quiz",
    "question": "„___ alquilan habitaciones para estudiantes.”",
    "options": ["Se alquila", "Se alquilan", "Es alquilado"],
    "correctIndex": 1,
    "explanation": "„Habitaciones” jest w liczbie mnogiej, więc czasownik też: se alquilan. To najczęstszy błąd w tej konstrukcji — uzgodnienie idzie z rzeczownikiem, nie z „se”."
  }
]$content$,
  7
);

-- ----------------------------------------------------------------------------
-- 8. Parafrazy — technika
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'parafrazy',
  'Parafrazy zdań — technika',
  'Zadanie typowe wyłącznie dla rozszerzenia. Cztery kroki i katalog najczęstszych przekształceń.',
  'strategia', 11,
  $content$[
  {
    "type": "intro",
    "text": "Parafraza daje ci zdanie i słowo klucz, a ty masz napisać zdanie o tym samym znaczeniu, używając tego słowa. Punkt jest tylko wtedy, gdy znaczenie zostało zachowane W CAŁOŚCI i gramatyka jest bez zarzutu — połowiczne rozwiązania nie liczą się wcale."
  },
  {
    "type": "table",
    "title": "Cztery kroki",
    "headers": ["Krok", "Co robisz"],
    "rows": [
      ["1", "Przeczytaj zdanie wyjściowe i ustal, CO ono znaczy — nie jak jest zbudowane."],
      ["2", "Spójrz na słowo klucz i rozpoznaj, jakiej konstrukcji wymaga."],
      ["3", "Napisz nowe zdanie, nie zmieniając ani litery w słowie kluczu."],
      ["4", "Sprawdź: to samo znaczenie? zgodność osób i czasów? akcenty?"]
    ]
  },
  {
    "type": "table",
    "title": "Katalog przekształceń, które wracają co roku",
    "headers": ["Wyjściowe", "Słowo klucz", "Wynik"],
    "rows": [
      ["Tienes que estudiar.", "NECESARIO", "Es necesario que estudies."],
      ["Quizá venga.", "PUEDE", "Puede que venga."],
      ["Hace dos años que vivo aquí.", "LLEVO", "Llevo dos años viviendo aquí."],
      ["Ha llegado hace un momento.", "ACABA", "Acaba de llegar."],
      ["Lo hizo otra vez.", "VOLVIÓ", "Volvió a hacerlo."],
      ["Alguien construyó la casa en 1920.", "SE", "Se construyó la casa en 1920."],
      ["No es seguro que venga.", "DUDO", "Dudo que venga."],
      ["Si no estudias, suspenderás.", "MENOS", "Suspenderás a menos que estudies."],
      ["Dijo: „Estoy cansado”.", "QUE", "Dijo que estaba cansado."],
      ["Es muy caro para mí.", "DEMASIADO", "Es demasiado caro para mí."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy sposób na stratę punktu: zmiana osoby. „Tienes que estudiar” dotyczy TY, więc parafraza to „es necesario que ESTUDIES”, nie „que estudie”. Zawsze sprawdź, kto wykonuje czynność."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Jeśli słowo klucz to spójnik wymagający subjuntivo (para que, a menos que, antes de que), masz gotową odpowiedź na pytanie o tryb — nie trzeba nic rozstrzygać."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: dokończ parafrazę",
    "instruction": "Zachowaj znaczenie zdania wyjściowego.",
    "items": [
      { "before": "Tienes que llamarle. → Es necesario que le ", "after": ".", "accept": ["llames"], "hint": "subjuntivo, 2. osoba", "pl": "Trzeba, żebyś do niego zadzwonił." },
      { "before": "Hace tres años que trabajo aquí. → Llevo tres años ", "after": " aquí.", "accept": ["trabajando"], "hint": "llevar + gerundio", "pl": "Pracuję tu od trzech lat." },
      { "before": "Quizá llueva mañana. → Puede que ", "after": " mañana.", "accept": ["llueva"], "hint": "puede que + subjuntivo", "pl": "Może jutro będzie padać." },
      { "before": "Alguien robó el coche. → El coche ", "after": " robado.", "accept": ["fue"], "hint": "strona bierna z ser", "pl": "Samochód został skradziony." },
      { "before": "Lo compró otra vez. → ", "after": " a comprarlo.", "accept": ["Volvió", "volvió"], "hint": "volver a", "pl": "Kupił to znowu." },
      { "before": "Dijo: „Vendré mañana”. → Dijo que ", "after": " al día siguiente.", "accept": ["vendría"], "hint": "futuro → condicional", "pl": "Powiedział, że przyjdzie następnego dnia." }
    ]
  },
  {
    "type": "quiz",
    "question": "„No creo que sea posible.” Parafraza ze słowem DUDO:",
    "options": [
      "Dudo que sea posible.",
      "Dudo que es posible.",
      "Dudo de ser posible."
    ],
    "correctIndex": 0,
    "explanation": "„Dudar que” należy do wyzwalaczy subjuntivo, tak samo jak „no creer que”, więc tryb zostaje bez zmian: sea. Druga opcja łamie regułę trybu, trzecia jest gramatycznie niemożliwa."
  }
]$content$,
  8
);

-- ----------------------------------------------------------------------------
-- 9. Konektory
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'konektory',
  'Konektory — spójniki i wyrażenia łączące',
  'Materiał, który zarabia punkty w dwóch częściach naraz: w lukach i w wypracowaniu.',
  'slownictwo', 9,
  $content$[
  {
    "type": "intro",
    "text": "Konektory to wyrażenia spajające tekst: „jednak”, „ponadto”, „w związku z tym”. W zadaniach z lukami są jednym z najczęstszych typów pytań, a w wypowiedzi pisemnej decydują o punktach za spójność i logikę. Ucz się ich raz, korzystaj dwa razy."
  },
  {
    "type": "keyPhrases",
    "title": "Konektory według funkcji",
    "caption": "Do rozprawki wybieraj z grup „przeciwstawienie” i „wnioskowanie” — to one najmocniej podnoszą ocenę.",
    "groups": [
      {
        "label": "Dodawanie",
        "phrases": [
          { "text": "además", "pl": "ponadto" },
          { "text": "asimismo", "pl": "podobnie, również" },
          { "text": "es más", "pl": "co więcej" },
          { "text": "por otra parte", "pl": "z drugiej strony" },
          { "text": "no solo… sino también", "pl": "nie tylko… ale także" }
        ]
      },
      {
        "label": "Przeciwstawienie",
        "phrases": [
          { "text": "sin embargo", "pl": "jednak" },
          { "text": "no obstante", "pl": "niemniej jednak" },
          { "text": "en cambio", "pl": "natomiast" },
          { "text": "a pesar de", "pl": "mimo" },
          { "text": "aunque", "pl": "chociaż" },
          { "text": "por el contrario", "pl": "przeciwnie" }
        ]
      },
      {
        "label": "Przyczyna i skutek",
        "phrases": [
          { "text": "por lo tanto", "pl": "zatem" },
          { "text": "por consiguiente", "pl": "w konsekwencji" },
          { "text": "debido a", "pl": "z powodu" },
          { "text": "ya que", "pl": "skoro, ponieważ" },
          { "text": "de ahí que", "pl": "stąd też (+ subjuntivo)" },
          { "text": "así pues", "pl": "a więc" }
        ]
      },
      {
        "label": "Porządkowanie i podsumowanie",
        "phrases": [
          { "text": "en primer lugar", "pl": "po pierwsze" },
          { "text": "a continuación", "pl": "następnie" },
          { "text": "por último", "pl": "wreszcie" },
          { "text": "en resumen", "pl": "podsumowując" },
          { "text": "en conclusión", "pl": "reasumując" },
          { "text": "cabe destacar que", "pl": "warto podkreślić, że" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Sin embargo” i „no obstante” zawsze oddziela się przecinkiem: „Es caro. Sin embargo, lo compraré.” Brak przecinka bywa liczony jako błąd interpunkcyjny."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "„De ahí que” wymaga subjuntivo: „De ahí que sea tan importante”. To jeden z niewielu konektorów rządzących trybem — i właśnie dlatego lubiany przez układających arkusze."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wstaw konektor",
    "instruction": "Wybierz wyrażenie pasujące do logiki zdania.",
    "items": [
      { "before": "Es un coche viejo. ", "after": ", funciona perfectamente.", "accept": ["Sin embargo", "No obstante"], "hint": "przeciwstawienie", "pl": "To stary samochód. Jednak działa doskonale." },
      { "before": "No estudió nada. ", "after": ", suspendió el examen.", "accept": ["Por lo tanto", "Por consiguiente", "Así pues"], "hint": "skutek", "pl": "W ogóle się nie uczył. Zatem oblał egzamin." },
      { "before": "Es barato y ", "after": " muy cómodo.", "accept": ["además"], "hint": "dodawanie", "pl": "Jest tani, a ponadto bardzo wygodny." },
      { "before": "", "after": ", quisiera agradecer su atención.", "accept": ["En primer lugar", "Por último"], "hint": "porządkowanie", "pl": "Po pierwsze, chciałbym podziękować za uwagę." },
      { "before": "", "after": " a la lluvia, el partido se canceló.", "accept": ["Debido", "debido"], "hint": "przyczyna", "pl": "Z powodu deszczu mecz odwołano." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Konektor → funkcja",
    "pairs": [
      { "left": "sin embargo", "right": "przeciwstawienie" },
      { "left": "además", "right": "dodawanie" },
      { "left": "por lo tanto", "right": "skutek" },
      { "left": "debido a", "right": "przyczyna" },
      { "left": "en resumen", "right": "podsumowanie" },
      { "left": "en primer lugar", "right": "porządkowanie" }
    ]
  },
  {
    "type": "quiz",
    "question": "„El proyecto es caro. ___, creemos que merece la pena.”",
    "options": ["Por lo tanto", "No obstante", "Además"],
    "correctIndex": 1,
    "explanation": "Druga część zdania przeciwstawia się pierwszej, więc potrzebny jest konektor przeciwstawny. „Por lo tanto” wprowadziłoby skutek, a „además” — dodatkowy argument w tę samą stronę."
  }
]$content$,
  9
);
