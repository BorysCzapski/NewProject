-- ============================================================================
-- supabase/seed/matura-es/02_lessons_srodki_jezykowe.sql
-- Spanish grammar theory for "Znajomość środków językowych", POZIOM
-- PODSTAWOWY. The rozszerzona lessons for the same section live in
-- 17_lessons_srodki_rozszerzona.sql — one file per level, because together
-- they run to a couple of thousand lines and the split keeps each readable.
--
-- Every lesson is a jsonb array of GrammarBlock (lib/grammar/lesson-blocks.ts,
-- rendered by components/grammar/lesson/*). Since 0017 a lesson also carries a
-- slug (its URL), a summary (shown in the section index), a kind and an
-- estimated reading time.
--
-- WHAT THESE LESSONS TEACH. Not "Spanish grammar" in the abstract — the
-- specific things a Polish learner loses points on in this part of the arkusz.
-- The order is by how often it costs marks, not by textbook convention: ser
-- vs estar and por vs para first, because they appear in almost every paper
-- and Polish gives no help with either; articles next, because Polish has none
-- at all; then the past tenses, where Polish aspect maps onto Spanish tense in
-- a way that looks helpful and is not.
--
-- Every lesson ends with drill blocks (fillGap / matchPairs / orderWords /
-- conjugation), not just explanation. A rule that has been read is not a rule
-- that has been learnt.
--
-- Idempotent: deletes Spanish lessons for this section+level first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections
  where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'
);

-- ----------------------------------------------------------------------------
-- 1. Jak działa ta część arkusza (strategia)
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'jak-dziala-ta-czesc',
  'Jak działa ta część arkusza',
  'Typy zadań, punktacja i trzy nawyki, które ratują najwięcej punktów.',
  'strategia', 7,
  $content$[
  {
    "type": "intro",
    "text": "Ta część sprawdza, czy potrafisz użyć gramatyki i słownictwa POPRAWNIE W KONTEKŚCIE — nie czy znasz regułkę na pamięć. Na poziomie podstawowym spotkasz trzy typy zadań: uzupełnianie luk jednym wyrazem, wybór wielokrotny (A/B/C) i słowotwórstwo, czyli przekształcenie podanego wyrazu (FÁCIL → fácilmente)."
  },
  {
    "type": "table",
    "title": "Trzy typy zadań i co naprawdę sprawdzają",
    "headers": ["Typ zadania", "Co sprawdza", "Na co patrzeć"],
    "rows": [
      ["Uzupełnianie luk", "przyimki, rodzajniki, zaimki, formy czasownika", "co stoi PO luce, nie tylko przed"],
      ["Wybór wielokrotny", "podobne formy: ser/estar, por/para, indefinido/imperfecto", "słowa-sygnały: ayer, siempre, mientras"],
      ["Słowotwórstwo", "sufiksy i prefiksy, część mowy", "jakiej CZĘŚCI MOWY brakuje w zdaniu"]
    ],
    "caption": "Za każdą lukę jest 1 punkt. Nie ma punktów ułamkowych — forma jest albo poprawna, albo nie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nawyk pierwszy: przeczytaj CAŁE zdanie, zanim cokolwiek wpiszesz. W hiszpańskim informacja decydująca o formie — rodzaj rzeczownika, liczba, osoba — bywa dwa słowa dalej, a nie tuż przy luce."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Nawyk drugi: NIGDY nie zostawiaj pustej luki. Pusta luka to gwarantowane zero. Nawet zgadywana forma czasownika w 3. osobie ma szansę trafić."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nawyk trzeci: na koniec sprawdź akcenty graficzne. „Esta” i „está” to dwa różne wyrazy, tak samo „el” i „él”, „si” i „sí”. Brak tildy to błąd, nawet jeśli reszta jest idealna."
  },
  {
    "type": "quiz",
    "question": "W zadaniu jest luka: „Marta ___ profesora de inglés.” Co sprawdzasz najpierw?",
    "options": [
      "Czy zdanie mówi o cesze stałej, czy o stanie chwilowym",
      "Ile liter mieści się w luce",
      "Czy zdanie jest w czasie przeszłym"
    ],
    "correctIndex": 0,
    "explanation": "Zawód to tożsamość, cecha stała — więc SER: „Marta es profesora”. To najczęstsza decyzja w całej tej części arkusza."
  },
  {
    "type": "quiz",
    "question": "Słowotwórstwo: „La película fue muy ___ (ABURRIR).” Jakiej części mowy potrzebujesz?",
    "options": ["Przymiotnika", "Rzeczownika", "Przysłówka"],
    "correctIndex": 0,
    "explanation": "Po „fue muy” stoi przymiotnik — poprawnie: aburrida (uzgodniona z „la película”, więc rodzaj żeński). Najpierw ustal część mowy, potem dopiero końcówkę."
  }
]$content$,
  1
);

-- ----------------------------------------------------------------------------
-- 2. SER czy ESTAR
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'ser-estar',
  'SER czy ESTAR',
  'Dwa czasowniki na jedno polskie „być”. Kiedy który — i co się zmienia w znaczeniu.',
  'gramatyka', 12,
  $content$[
  {
    "type": "intro",
    "text": "Polskie „być” rozpada się w hiszpańskim na dwa czasowniki. To najczęstsza decyzja w całym arkuszu i najczęstsze źródło straconych punktów, bo polski nie daje tu żadnej podpowiedzi. Dobra wiadomość: reguła jest krótka."
  },
  {
    "type": "compare",
    "title": "Podstawowy podział",
    "columns": [
      {
        "title": "SER",
        "formula": "kim/czym coś JEST",
        "whenToUse": "tożsamość, zawód, narodowość, charakter, materiał, pochodzenie, godzina, miejsce WYDARZENIA",
        "examples": ["Marta es profesora.", "La mesa es de madera.", "Son las tres.", "La fiesta es en mi casa.", "Soy de Polonia."]
      },
      {
        "title": "ESTAR",
        "formula": "gdzie coś jest i JAK się ma",
        "whenToUse": "położenie, stan chwilowy, samopoczucie, wynik zmiany",
        "examples": ["Marta está cansada.", "El libro está en la mesa.", "Estoy enfermo.", "La puerta está abierta.", "Madrid está en España."]
      }
    ]
  },
  {
    "type": "conjugation",
    "title": "Odmiana w czasie teraźniejszym",
    "persons": ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ustedes"],
    "columns": [
      { "label": "SER", "forms": ["soy", "eres", "es", "somos", "sois", "son"] },
      { "label": "ESTAR", "forms": ["estoy", "estás", "está", "estamos", "estáis", "están"] }
    ],
    "highlight": ["soy", "eres", "es", "somos", "sois", "son", "estoy", "estás", "está", "están"],
    "caption": "Obie odmiany są nieregularne. Uwaga na tildy w estar: estás, está, están — bez nich to inne formy."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "PUŁAPKA MIEJSCA. Rzecz i osoba są gdzieś przez ESTAR (El libro está en la mesa). Ale WYDARZENIE odbywa się gdzieś przez SER (El concierto es en el parque). Pytanie brzmi: to przedmiot czy wydarzenie?"
  },
  {
    "type": "examples",
    "title": "Ta sama przydawka, inne znaczenie",
    "items": [
      { "en": "Pedro es aburrido.", "pl": "Pedro jest nudny — taki ma charakter.", "highlight": "es aburrido" },
      { "en": "Pedro está aburrido.", "pl": "Pedro się nudzi — teraz.", "highlight": "está aburrido" },
      { "en": "La manzana es verde.", "pl": "Jabłko jest zielone — taki ma kolor.", "highlight": "es verde" },
      { "en": "La manzana está verde.", "pl": "Jabłko jest niedojrzałe.", "highlight": "está verde" },
      { "en": "Mi hermano es listo.", "pl": "Mój brat jest bystry.", "highlight": "es listo" },
      { "en": "Mi hermano está listo.", "pl": "Mój brat jest gotowy.", "highlight": "está listo" },
      { "en": "Ella es guapa.", "pl": "Ona jest ładna — ogólnie.", "highlight": "es guapa" },
      { "en": "Ella está guapa.", "pl": "Ona ładnie dziś wygląda.", "highlight": "está guapa" }
    ]
  },
  {
    "type": "table",
    "title": "Przymiotniki, które zawsze idą z jednym z nich",
    "headers": ["Zawsze SER", "Zawsze ESTAR"],
    "rows": [
      ["inteligente, importante, necesario", "contento, enfadado, cansado"],
      ["posible, imposible, evidente", "roto, abierto, cerrado"],
      ["joven, viejo (o wieku)", "vivo, muerto"],
      ["rico (bogaty)", "rico (smaczny)"]
    ],
    "caption": "Ostatni wiersz to nie pomyłka: „es rico” znaczy bogaty, „está rico” — smaczny."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: SER czy ESTAR",
    "instruction": "Wpisz poprawną formę w czasie teraźniejszym.",
    "items": [
      { "before": "Mi padre ", "after": " ingeniero.", "accept": ["es"], "hint": "zawód", "pl": "Mój tata jest inżynierem." },
      { "before": "La ventana ", "after": " abierta.", "accept": ["está"], "hint": "wynik zmiany", "pl": "Okno jest otwarte." },
      { "before": "Nosotros ", "after": " de Cracovia.", "accept": ["somos"], "hint": "pochodzenie", "pl": "Jesteśmy z Krakowa." },
      { "before": "El examen ", "after": " en el aula 12.", "accept": ["es"], "hint": "wydarzenie, nie przedmiot", "pl": "Egzamin jest w sali 12." },
      { "before": "Hoy (yo) ", "after": " muy cansada.", "accept": ["estoy"], "hint": "samopoczucie", "pl": "Dziś jestem bardzo zmęczona." },
      { "before": "La sopa ", "after": " riquísima.", "accept": ["está"], "hint": "smak", "pl": "Zupa jest przepyszna." },
      { "before": "¿Dónde ", "after": " mis llaves?", "accept": ["están"], "hint": "położenie, liczba mnoga", "pl": "Gdzie są moje klucze?" },
      { "before": "Estas gafas ", "after": " rotas.", "accept": ["están"], "hint": "stan po zmianie", "pl": "Te okulary są zepsute." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Znaczenie zależy od czasownika",
    "instruction": "Dopasuj hiszpańskie zdanie do właściwego tłumaczenia.",
    "pairs": [
      { "left": "Es aburrido", "right": "jest nudny" },
      { "left": "Está aburrido", "right": "nudzi się" },
      { "left": "Es listo", "right": "jest bystry" },
      { "left": "Está listo", "right": "jest gotowy" },
      { "left": "Es malo", "right": "jest zły (charakter)" },
      { "left": "Está malo", "right": "jest chory" }
    ]
  },
  {
    "type": "quiz",
    "question": "„El concierto ___ en el teatro Real.”",
    "options": ["es", "está", "obie formy są poprawne"],
    "correctIndex": 0,
    "explanation": "Koncert to WYDARZENIE, a wydarzenia odbywają się gdzieś przez SER. Gdyby chodziło o budynek („El teatro está en Madrid”), byłoby ESTAR."
  }
]$content$,
  2
);

-- ----------------------------------------------------------------------------
-- 3. POR czy PARA
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'por-para',
  'POR czy PARA',
  'Drugi klasyczny wybór. Zamiast tłumaczyć z polskiego, pytaj o przyczynę albo o cel.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "POR i PARA obsługują to, co po polsku wyrażamy przez „dla”, „za”, „przez”, „po”, „na”. Dlatego tłumaczenie z polskiego nie działa — trzeba przełączyć się na inne pytanie: czy chodzi o PRZYCZYNĘ (skąd to się wzięło), czy o CEL (dokąd to zmierza)."
  },
  {
    "type": "compare",
    "title": "Jedno pytanie, które rozstrzyga",
    "columns": [
      {
        "title": "POR — spójrz WSTECZ",
        "formula": "przyczyna, powód, zamiana, droga, czas trwania",
        "whenToUse": "z POWODU czegoś, w zamian ZA coś, PRZEZ jakieś miejsce",
        "examples": ["Gracias por tu ayuda.", "Lo hice por ti.", "Pasamos por el centro.", "Estudié por dos horas.", "Lo compré por 20 euros."]
      },
      {
        "title": "PARA — spójrz W PRZÓD",
        "formula": "cel, przeznaczenie, odbiorca, termin, opinia",
        "whenToUse": "PO TO, ŻEBY; DLA kogo; NA kiedy",
        "examples": ["Estudio para aprobar.", "Este regalo es para ti.", "Lo necesito para el lunes.", "Para mí, es difícil.", "Salgo para Madrid."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd Polaków: automatyczne „dla” → PARA i „przez” → POR. Sprawdzaj SENS. „Gracias por tu ayuda” to dosłownie „dzięki ZA pomoc”, choć po polsku nie ma tam ani „przez”, ani „dla”."
  },
  {
    "type": "table",
    "title": "Pary, które warto porównać",
    "headers": ["Zdanie", "Znaczenie"],
    "rows": [
      ["Lo hago por ti.", "Robię to ze względu na ciebie (bo mi na tobie zależy)."],
      ["Lo hago para ti.", "Robię to dla ciebie (ty to dostaniesz)."],
      ["Salgo por Madrid.", "Wychodzę i przechodzę przez Madryt."],
      ["Salgo para Madrid.", "Wyruszam do Madrytu."],
      ["Trabajo por mi hermano.", "Pracuję za brata (zastępuję go)."],
      ["Trabajo para mi hermano.", "Pracuję dla brata (on jest szefem)."]
    ]
  },
  {
    "type": "keyPhrases",
    "title": "Utarte zwroty — naucz się w całości",
    "caption": "W tych wyrażeniach przyimek jest częścią zwrotu. Nie ma czego analizować, trzeba je znać.",
    "groups": [
      {
        "label": "Z POR",
        "phrases": [
          { "text": "por favor", "pl": "proszę" },
          { "text": "por fin", "pl": "wreszcie" },
          { "text": "por ejemplo", "pl": "na przykład" },
          { "text": "por supuesto", "pl": "oczywiście" },
          { "text": "por eso", "pl": "dlatego" },
          { "text": "por la mañana / tarde / noche", "pl": "rano / po południu / wieczorem" },
          { "text": "por lo menos", "pl": "przynajmniej" },
          { "text": "por casualidad", "pl": "przypadkiem" }
        ]
      },
      {
        "label": "Z PARA",
        "phrases": [
          { "text": "para siempre", "pl": "na zawsze" },
          { "text": "para nada", "pl": "wcale" },
          { "text": "para colmo", "pl": "na domiar złego" },
          { "text": "estar para", "pl": "być gotowym do / mieć ochotę na" },
          { "text": "para mí / para ti", "pl": "moim / twoim zdaniem" }
        ]
      }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: POR czy PARA",
    "instruction": "Wpisz właściwy przyimek.",
    "items": [
      { "before": "Estudio mucho ", "after": " aprobar el examen.", "accept": ["para"], "hint": "cel", "pl": "Uczę się dużo, żeby zdać egzamin." },
      { "before": "Gracias ", "after": " venir.", "accept": ["por"], "hint": "za co dziękujesz", "pl": "Dzięki za przyjście." },
      { "before": "Este correo es ", "after": " el director.", "accept": ["para"], "hint": "odbiorca", "pl": "Ten mail jest do dyrektora." },
      { "before": "Estuve en Sevilla ", "after": " tres días.", "accept": ["por"], "hint": "czas trwania", "pl": "Byłem w Sewilli przez trzy dni." },
      { "before": "Lo compré ", "after": " diez euros.", "accept": ["por"], "hint": "zamiana, cena", "pl": "Kupiłem to za dziesięć euro." },
      { "before": "Necesito el trabajo ", "after": " el viernes.", "accept": ["para"], "hint": "termin", "pl": "Potrzebuję tej pracy na piątek." },
      { "before": "No salgo ", "after": " la lluvia.", "accept": ["por"], "hint": "powód", "pl": "Nie wychodzę z powodu deszczu." },
      { "before": "", "after": " mí, la película es mala.", "accept": ["Para", "para"], "hint": "opinia", "pl": "Moim zdaniem film jest zły." }
    ]
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdania",
    "instruction": "Zbuduj poprawne zdanie z podanych elementów.",
    "items": [
      { "correct": ["Trabajo", "mucho", "para", "ahorrar", "dinero"], "pl": "Pracuję dużo, żeby zaoszczędzić pieniądze.", "note": "PARA + bezokolicznik wyraża cel." },
      { "correct": ["Te", "llamo", "por", "un", "problema", "urgente"], "pl": "Dzwonię do ciebie w sprawie pilnego problemu.", "note": "POR wskazuje powód telefonu." },
      { "correct": ["Salimos", "para", "Barcelona", "mañana"], "pl": "Jutro wyruszamy do Barcelony.", "note": "PARA + miejsce = kierunek podróży." }
    ]
  },
  {
    "type": "quiz",
    "question": "„Cambié mi coche ___ una bicicleta.”",
    "options": ["por", "para", "obie formy są poprawne"],
    "correctIndex": 0,
    "explanation": "Zamiana jednej rzeczy na drugą to zawsze POR. „Para” sugerowałoby, że rower jest celem albo odbiorcą, co tu nie ma sensu."
  }
]$content$,
  3
);

-- ----------------------------------------------------------------------------
-- 4. Rodzajniki
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'rodzajniki',
  'Rodzajniki: el, la, un, una — i kiedy żadnego',
  'Polski nie ma rodzajników, więc trzeba je zbudować od zera. Krótka reguła i lista wyjątków.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Polski nie ma rodzajników w ogóle, więc nie ma się na czym oprzeć — a w zadaniach z lukami rodzajnik pojawia się bez przerwy. Cała reguła sprowadza się do jednego pytania: czy mówię o czymś ZNANYM rozmówcy, czy wprowadzam coś NOWEGO."
  },
  {
    "type": "table",
    "title": "Formy",
    "headers": ["", "rodzaj męski", "rodzaj żeński"],
    "rows": [
      ["określony l.poj.", "el libro", "la casa"],
      ["określony l.mn.", "los libros", "las casas"],
      ["nieokreślony l.poj.", "un libro", "una casa"],
      ["nieokreślony l.mn.", "unos libros", "unas casas"]
    ],
    "caption": "unos/unas znaczy „jakieś, kilka” — nie ma polskiego odpowiednika."
  },
  {
    "type": "compare",
    "title": "Określony czy nieokreślony",
    "columns": [
      {
        "title": "EL / LA — znane",
        "formula": "wiadomo, o co chodzi",
        "whenToUse": "rzecz już wspomniana, jedyna w swoim rodzaju, ogólne pojęcie",
        "examples": ["El libro que te presté.", "El sol sale a las siete.", "Me gusta la música.", "El español es difícil."]
      },
      {
        "title": "UN / UNA — nowe",
        "formula": "wprowadzam po raz pierwszy",
        "whenToUse": "jeden z wielu, coś nieokreślonego",
        "examples": ["Vi una película muy buena.", "Necesito un bolígrafo.", "Hay un problema.", "Es un chico simpático."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "PUŁAPKA ZAWODU. Po SER przed zawodem NIE MA rodzajnika: „Es médico”, nie „es un médico”. Rodzajnik wraca dopiero z przymiotnikiem: „Es un médico excelente”."
  },
  {
    "type": "examples",
    "title": "Gdzie rodzajnika NIE MA",
    "items": [
      { "en": "Mi hermana es abogada.", "pl": "Moja siostra jest prawniczką (zawód po ser).", "highlight": "es abogada" },
      { "en": "Estudio español.", "pl": "Uczę się hiszpańskiego (nazwa języka po czasowniku).", "highlight": "español" },
      { "en": "Voy a casa.", "pl": "Idę do domu (utarty zwrot).", "highlight": "a casa" },
      { "en": "Tengo hambre.", "pl": "Jestem głodny (tener + rzeczownik abstrakcyjny).", "highlight": "hambre" },
      { "en": "Compro pan y leche.", "pl": "Kupuję chleb i mleko (rzeczowniki niepoliczalne).", "highlight": "pan y leche" },
      { "en": "Hablo francés.", "pl": "Mówię po francusku.", "highlight": "francés" }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Za to PRZED nazwą języka rodzajnik JEST, jeśli język jest podmiotem albo stoi po innym czasowniku niż hablar/estudiar: „El español es fácil”, „Me encanta el español”."
  },
  {
    "type": "table",
    "title": "Wyjątki, o które pytają najczęściej",
    "headers": ["Reguła", "Przykład", "Dlaczego"],
    "rows": [
      ["a + el = al", "Voy al cine.", "obowiązkowe ściągnięcie"],
      ["de + el = del", "Vengo del trabajo.", "obowiązkowe ściągnięcie"],
      ["el przed żeńskim a-", "el agua, el aula, el hambre", "akcentowane a- na początku"],
      ["ale przymiotnik żeński", "el agua fría", "rodzaj się nie zmienia, tylko rodzajnik"],
      ["części ciała", "Me duele la cabeza.", "rodzajnik zamiast zaimka dzierżawczego"],
      ["godziny", "Son las tres.", "zawsze las (podrozumiane horas)"],
      ["dni tygodnia", "El lunes tengo clase.", "el = „w poniedziałek”"]
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wpisz rodzajnik albo zostaw myślnik",
    "instruction": "Jeśli rodzajnik jest niepotrzebny, wpisz: brak",
    "items": [
      { "before": "Mi padre es ", "after": " profesor.", "accept": ["brak", "-", "—"], "hint": "zawód po ser", "pl": "Mój tata jest nauczycielem." },
      { "before": "Vamos ", "after": " cine esta tarde.", "accept": ["al"], "hint": "a + el", "pl": "Idziemy dziś po południu do kina." },
      { "before": "Me duele ", "after": " cabeza.", "accept": ["la"], "hint": "część ciała", "pl": "Boli mnie głowa." },
      { "before": "Vengo ", "after": " supermercado.", "accept": ["del"], "hint": "de + el", "pl": "Wracam z supermarketu." },
      { "before": "", "after": " agua está fría.", "accept": ["El", "el"], "hint": "żeński, ale z el", "pl": "Woda jest zimna." },
      { "before": "Estudio ", "after": " español desde hace dos años.", "accept": ["brak", "-", "—"], "hint": "nazwa języka po estudiar", "pl": "Uczę się hiszpańskiego od dwóch lat." },
      { "before": "", "after": " español es más fácil que el alemán.", "accept": ["El", "el"], "hint": "język jako podmiot", "pl": "Hiszpański jest łatwiejszy niż niemiecki." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie jest poprawne?",
    "options": [
      "Mi hermano es un ingeniero.",
      "Mi hermano es ingeniero.",
      "Mi hermano es el ingeniero."
    ],
    "correctIndex": 1,
    "explanation": "Po SER przed samym zawodem nie stawia się rodzajnika. Trzecie zdanie byłoby poprawne tylko wtedy, gdyby chodziło o konkretnego, znanego inżyniera („to TEN inżynier”)."
  }
]$content$,
  4
);

-- ----------------------------------------------------------------------------
-- 5. Indefinido czy imperfecto
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'indefinido-imperfecto',
  'Indefinido czy imperfecto',
  'Dwa czasy przeszłe. Polski aspekt pomaga tylko pozornie — oto co naprawdę je rozdziela.',
  'gramatyka', 13,
  $content$[
  {
    "type": "intro",
    "text": "Hiszpański ma dwa czasy przeszłe proste i wybór między nimi to stały punkt arkusza. Kuszące jest tłumaczenie: dokonany = indefinido, niedokonany = imperfecto. Działa w większości przypadków, ale zawodzi dokładnie tam, gdzie zadania są trudne — dlatego lepiej myśleć obrazem, nie aspektem."
  },
  {
    "type": "timeline",
    "title": "Jak wyglądają na osi czasu",
    "caption": "Indefinido to punkt: coś się stało i skończyło. Imperfecto to tło: coś trwało, nie wiadomo dokąd.",
    "markers": [
      { "at": 15, "to": 40, "label": "IMPERFECTO — tło, trwanie", "example": { "en": "Llovía y hacía frío.", "pl": "Padało i było zimno." } },
      { "at": 28, "label": "INDEFINIDO — zdarzenie", "example": { "en": "Sonó el teléfono.", "pl": "Zadzwonił telefon." } },
      { "at": 50, "label": "AHORA", "example": { "en": "Ahora estoy en casa.", "pl": "Teraz jestem w domu." } }
    ]
  },
  {
    "type": "compare",
    "title": "Co robi każdy z nich",
    "columns": [
      {
        "title": "INDEFINIDO",
        "formula": "-é/-aste/-ó, -í/-iste/-ió",
        "whenToUse": "zdarzenie zamknięte, ciąg zdarzeń, ile razy, jak długo dokładnie",
        "examples": ["Ayer fui al cine.", "Estudié tres horas.", "Nació en 1990.", "Se levantó, desayunó y salió."]
      },
      {
        "title": "IMPERFECTO",
        "formula": "-aba / -ía",
        "whenToUse": "opis tła, zwyczaj, wiek, godzina, pogoda, stan i samopoczucie",
        "examples": ["Antes vivíamos en Madrid.", "Tenía diez años.", "Eran las cinco.", "Hacía sol.", "Estaba muy cansado."]
      }
    ]
  },
  {
    "type": "conjugation",
    "title": "Końcówki regularne",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "hablar — indef.", "forms": ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"] },
      { "label": "hablar — imperf.", "forms": ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"] },
      { "label": "comer — indef.", "forms": ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"] },
      { "label": "comer — imperf.", "forms": ["comía", "comías", "comía", "comíamos", "comíais", "comían"] }
    ],
    "caption": "Uwaga: hablé i habló różnią się tylko akcentem, a znaczą „ja mówiłem” i „on mówił”. Tilda nie jest ozdobą."
  },
  {
    "type": "conjugation",
    "title": "Trzy nieregularne w imperfecto — to wszystkie, jakie są",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "SER", "forms": ["era", "eras", "era", "éramos", "erais", "eran"] },
      { "label": "IR", "forms": ["iba", "ibas", "iba", "íbamos", "ibais", "iban"] },
      { "label": "VER", "forms": ["veía", "veías", "veía", "veíamos", "veíais", "veían"] }
    ],
    "highlight": ["era", "eras", "éramos", "erais", "eran", "iba", "ibas", "íbamos", "ibais", "iban"],
    "caption": "Imperfecto to najbardziej regularny czas w hiszpańskim — nieregularne są dokładnie trzy czasowniki."
  },
  {
    "type": "table",
    "title": "Słowa-sygnały: podpowiadają, którego czasu użyć",
    "headers": ["INDEFINIDO", "IMPERFECTO"],
    "rows": [
      ["ayer, anoche", "antes, entonces"],
      ["el año pasado, la semana pasada", "todos los días, siempre"],
      ["en 2019, el lunes", "normalmente, a menudo"],
      ["de repente, entonces (nagle)", "mientras, cuando (tło)"],
      ["dos veces, tres horas", "cada verano, a veces"]
    ],
    "caption": "Jeśli w zdaniu jest jedno z tych słów, decyzja jest w zasadzie podjęta."
  },
  {
    "type": "examples",
    "title": "Oba w jednym zdaniu — najczęstszy układ w zadaniach",
    "items": [
      { "en": "Mientras estudiaba, sonó el teléfono.", "pl": "Kiedy się uczyłem, zadzwonił telefon.", "highlight": "estudiaba" },
      { "en": "Hacía frío cuando salimos.", "pl": "Było zimno, kiedy wyszliśmy.", "highlight": "Hacía" },
      { "en": "Cuando era niño, viví dos años en Francia.", "pl": "Gdy byłem dzieckiem, mieszkałem dwa lata we Francji.", "highlight": "viví" },
      { "en": "Eran las diez y todavía no había nadie.", "pl": "Była dziesiąta i wciąż nikogo nie było.", "highlight": "Eran" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Viví dos años en Francia” jest w indefinido, mimo że po polsku brzmi niedokonanie. Powód: podany jest KONKRETNY, zamknięty odcinek czasu. Podany czas trwania zawsze przechyla szalę na indefinido."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wybierz czas",
    "instruction": "Wpisz poprawną formę czasownika podanego w podpowiedzi.",
    "items": [
      { "before": "Ayer (yo) ", "after": " al médico.", "accept": ["fui"], "hint": "ir — ayer sygnalizuje indefinido", "pl": "Wczoraj poszedłem do lekarza." },
      { "before": "Cuando ", "after": " pequeño, jugaba al fútbol.", "accept": ["era"], "hint": "ser — opis wieku", "pl": "Kiedy byłem mały, grałem w piłkę." },
      { "before": "Mientras ", "after": " la tele, llegó mi hermano.", "accept": ["veía"], "hint": "ver — tło dla zdarzenia", "pl": "Kiedy oglądałem telewizję, przyszedł brat." },
      { "before": "El verano pasado ", "after": " a Grecia.", "accept": ["viajamos", "viajé"], "hint": "viajar — el verano pasado", "pl": "Zeszłego lata pojechaliśmy do Grecji." },
      { "before": "Todos los días ", "after": " a las siete.", "accept": ["me levantaba"], "hint": "levantarse — zwyczaj", "pl": "Codziennie wstawałem o siódmej." },
      { "before": "De repente ", "after": " a llover.", "accept": ["empezó"], "hint": "empezar — de repente", "pl": "Nagle zaczęło padać." }
    ]
  },
  {
    "type": "quiz",
    "question": "„Cuando llegué a casa, mi madre ___ la cena.” Która forma?",
    "options": ["preparó", "preparaba", "prepara"],
    "correctIndex": 1,
    "explanation": "Przyjście do domu to zdarzenie (indefinido: llegué), a przygotowywanie kolacji to tło, które już trwało — więc imperfecto. „Preparó” znaczyłoby, że zaczęła gotować dopiero po twoim przyjściu."
  }
]$content$,
  5
);

-- ----------------------------------------------------------------------------
-- 6. Pretérito perfecto
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'preterito-perfecto',
  'Pretérito perfecto — „he hecho”',
  'Trzeci czas przeszły. Kiedy używa się go zamiast indefinido i jak tworzyć imiesłowy.',
  'gramatyka', 9,
  $content$[
  {
    "type": "intro",
    "text": "Pretérito perfecto to złożony czas przeszły: HABER w czasie teraźniejszym plus imiesłów. Mówi o przeszłości, która wciąż „dotyka” teraźniejszości — dziś, w tym tygodniu, w moim życiu."
  },
  {
    "type": "formula",
    "title": "Budowa",
    "caption": "Między haber a imiesłów nie wchodzi NIC — ani zaimek, ani „no”.",
    "variants": [
      {
        "label": "Twierdzenie",
        "parts": [
          { "text": "he / has / ha", "role": "aux", "note": "HABER w presente" },
          { "text": "hablado", "role": "verb", "note": "imiesłów: -ado / -ido" },
          { "text": "con Marta", "role": "object" }
        ],
        "example": { "en": "He hablado con Marta.", "pl": "Rozmawiałem z Martą." }
      },
      {
        "label": "Przeczenie",
        "parts": [
          { "text": "no", "role": "negation", "note": "no stoi PRZED haber" },
          { "text": "he", "role": "aux" },
          { "text": "comido", "role": "verb" },
          { "text": "nada", "role": "object" }
        ],
        "example": { "en": "No he comido nada.", "pl": "Nic nie jadłem." }
      },
      {
        "label": "Z zaimkiem",
        "parts": [
          { "text": "lo", "role": "other", "note": "zaimek PRZED haber, nigdy między" },
          { "text": "he", "role": "aux" },
          { "text": "visto", "role": "verb" }
        ],
        "example": { "en": "Lo he visto esta mañana.", "pl": "Widziałem go dziś rano." }
      }
    ]
  },
  {
    "type": "conjugation",
    "title": "HABER w czasie teraźniejszym",
    "persons": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"],
    "columns": [
      { "label": "haber", "forms": ["he", "has", "ha", "hemos", "habéis", "han"] }
    ],
    "highlight": ["he", "has", "ha", "hemos", "habéis", "han"],
    "caption": "Cała odmiana jest nieregularna, ale krótka. Uwaga: h jest nieme."
  },
  {
    "type": "table",
    "title": "Imiesłowy nieregularne — trzeba znać na pamięć",
    "headers": ["Bezokolicznik", "Imiesłów", "Znaczenie"],
    "rows": [
      ["hacer", "hecho", "zrobiony"],
      ["ver", "visto", "widziany"],
      ["escribir", "escrito", "napisany"],
      ["decir", "dicho", "powiedziany"],
      ["poner", "puesto", "położony"],
      ["volver", "vuelto", "wrócony"],
      ["abrir", "abierto", "otwarty"],
      ["romper", "roto", "zepsuty"],
      ["morir", "muerto", "martwy"]
    ],
    "caption": "Regularne: -ar → -ado (hablado), -er/-ir → -ido (comido, vivido)."
  },
  {
    "type": "compare",
    "title": "Perfecto czy indefinido",
    "columns": [
      {
        "title": "PERFECTO — okres jeszcze trwa",
        "formula": "he + imiesłów",
        "whenToUse": "hoy, esta semana, este año, últimamente, ya, todavía no, nunca, alguna vez",
        "examples": ["Hoy he estudiado mucho.", "¿Has estado alguna vez en España?", "Todavía no he terminado.", "Este año he leído diez libros."]
      },
      {
        "title": "INDEFINIDO — okres zamknięty",
        "formula": "końcówki -é / -í",
        "whenToUse": "ayer, la semana pasada, en 2020, hace dos años",
        "examples": ["Ayer estudié mucho.", "Estuve en España en 2019.", "Terminé hace una hora.", "El año pasado leí diez libros."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Prosta zasada: jeśli okres, o którym mówisz, JESZCZE SIĘ NIE SKOŃCZYŁ (dziś, w tym tygodniu, w tym roku, w życiu) — perfecto. Jeśli się zamknął (wczoraj, w zeszłym roku) — indefinido."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W dużej części Ameryki Łacińskiej perfecto prawie nie występuje i mówi się „hoy estudié”. Na maturze trzymaj się normy hiszpańskiej — arkusze CKE są pisane pod nią."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "instruction": "Wpisz formę pretérito perfecto.",
    "items": [
      { "before": "Hoy (yo) no ", "after": " nada.", "accept": ["he comido"], "hint": "comer", "pl": "Dziś nic nie jadłem." },
      { "before": "¿", "after": " la película ya?", "accept": ["Has visto", "has visto"], "hint": "ver — imiesłów nieregularny", "pl": "Widziałeś już ten film?" },
      { "before": "Esta semana (nosotros) ", "after": " mucho.", "accept": ["hemos trabajado"], "hint": "trabajar", "pl": "W tym tygodniu dużo pracowaliśmy." },
      { "before": "Todavía no ", "after": " el correo.", "accept": ["he escrito"], "hint": "escribir — imiesłów nieregularny", "pl": "Jeszcze nie napisałem maila." },
      { "before": "Ellos ", "after": " la ventana.", "accept": ["han abierto"], "hint": "abrir — imiesłów nieregularny", "pl": "Oni otworzyli okno." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Bezokolicznik → imiesłów",
    "pairs": [
      { "left": "hacer", "right": "hecho" },
      { "left": "decir", "right": "dicho" },
      { "left": "poner", "right": "puesto" },
      { "left": "volver", "right": "vuelto" },
      { "left": "romper", "right": "roto" },
      { "left": "escribir", "right": "escrito" }
    ]
  }
]$content$,
  6
);

-- ----------------------------------------------------------------------------
-- 7. Zaimki dopełnienia
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'zaimki-dopelnienia',
  'Zaimki dopełnienia: lo, la, le, se',
  'Gdzie je postawić i którego użyć. Najczęstsza pułapka szyku w całym arkuszu.',
  'gramatyka', 12,
  $content$[
  {
    "type": "intro",
    "text": "Zaimki dopełnienia zastępują rzeczownik, żeby go nie powtarzać. Sprawiają Polakom kłopot z dwóch powodów: mają osobne formy dla dopełnienia bliższego i dalszego, i mają sztywne miejsce w zdaniu, które nie zawsze pokrywa się z polskim."
  },
  {
    "type": "table",
    "title": "Formy",
    "headers": ["Osoba", "Bliższe (kogo? co?)", "Dalsze (komu? czemu?)"],
    "rows": [
      ["ja", "me", "me"],
      ["ty", "te", "te"],
      ["on / ona / pan(i)", "lo / la", "le"],
      ["my", "nos", "nos"],
      ["wy", "os", "os"],
      ["oni / one", "los / las", "les"]
    ],
    "caption": "Różnią się tylko w 3. osobie — i właśnie tam są wszystkie pytania egzaminacyjne."
  },
  {
    "type": "formula",
    "title": "Gdzie stoi zaimek",
    "caption": "Trzy pozycje, trzy reguły. Innych możliwości nie ma.",
    "variants": [
      {
        "label": "Przed czasownikiem",
        "parts": [
          { "text": "Lo", "role": "other", "note": "zaimek" },
          { "text": "veo", "role": "verb", "note": "czasownik odmieniony" },
          { "text": "todos los días", "role": "object" }
        ],
        "example": { "en": "Lo veo todos los días.", "pl": "Widuję go codziennie." }
      },
      {
        "label": "Doklejony do bezokolicznika",
        "parts": [
          { "text": "Voy a", "role": "aux" },
          { "text": "verlo", "role": "verb", "note": "zaimek doklejony na końcu" },
          { "text": "mañana", "role": "object" }
        ],
        "example": { "en": "Voy a verlo mañana.", "pl": "Zobaczę go jutro." }
      },
      {
        "label": "Doklejony do rozkaźnika",
        "parts": [
          { "text": "Dí", "role": "verb", "note": "tryb rozkazujący twierdzący" },
          { "text": "melo", "role": "other", "note": "me + lo, doklejone" }
        ],
        "example": { "en": "Dímelo ahora.", "pl": "Powiedz mi to teraz." }
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Przy konstrukcjach typu „voy a ver”, „quiero hacer”, „estoy leyendo” masz WYBÓR: „Lo voy a ver” albo „Voy a verlo”. Obie formy są poprawne i obie punktowane."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Ale w przeczeniu rozkaźnika zaimek WRACA przed czasownik: „Dímelo” (powiedz mi to), lecz „No me lo digas” (nie mów mi tego). Nigdy „no dímelo”."
  },
  {
    "type": "examples",
    "title": "Kolejność, gdy są dwa zaimki",
    "items": [
      { "en": "Me lo dio ayer.", "pl": "Dał mi to wczoraj — najpierw dalsze, potem bliższe.", "highlight": "Me lo" },
      { "en": "Te la enseño mañana.", "pl": "Pokażę ci ją jutro.", "highlight": "Te la" },
      { "en": "Se lo dije a Juan.", "pl": "Powiedziałem to Juanowi — le + lo → SE lo.", "highlight": "Se lo" },
      { "en": "Nos las trajeron rotas.", "pl": "Przynieśli nam je zepsute.", "highlight": "Nos las" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "REGUŁA SE: gdy zaimek dalszy LE/LES spotyka bliższy LO/LA/LOS/LAS, LE zamienia się w SE. Nie mówi się „le lo dije”, tylko „SE lo dije”. To ulubione pytanie egzaminatorów."
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdanie z zaimkami",
    "instruction": "Zwróć uwagę na kolejność: dopełnienie dalsze przed bliższym.",
    "items": [
      { "correct": ["Se", "lo", "compré", "ayer"], "pl": "Kupiłem mu to wczoraj.", "note": "le + lo → se lo." },
      { "correct": ["No", "me", "lo", "digas"], "pl": "Nie mów mi tego.", "note": "W przeczeniu rozkaźnika zaimki wracają przed czasownik." },
      { "correct": ["Voy", "a", "regalárselo"], "pl": "Podaruję mu to.", "note": "Przy bezokoliczniku oba zaimki doklejają się na końcu; dochodzi tilda." },
      { "correct": ["Te", "las", "mando", "por", "correo"], "pl": "Wyślę ci je mailem.", "note": "te = dalsze, las = bliższe." }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zastąp podkreślone słowa zaimkiem",
    "instruction": "Wpisz sam zaimek.",
    "items": [
      { "before": "¿Ves a Marta? — Sí, ", "after": " veo.", "accept": ["la"], "hint": "Marta = dopełnienie bliższe, żeńskie", "pl": "Tak, widzę ją." },
      { "before": "¿Compraste los billetes? — Sí, ", "after": " compré.", "accept": ["los"], "hint": "los billetes, l.mn. męska", "pl": "Tak, kupiłem je." },
      { "before": "Escribí una carta a mis padres. → ", "after": " escribí una carta.", "accept": ["Les", "les"], "hint": "a mis padres = dopełnienie dalsze", "pl": "Napisałem im list." },
      { "before": "Di el libro a Juan. → ", "after": " lo di.", "accept": ["Se", "se"], "hint": "le + lo, więc...", "pl": "Dałem mu to." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie jest poprawne?",
    "options": ["Le lo he dado.", "Se lo he dado.", "Lo le he dado."],
    "correctIndex": 1,
    "explanation": "Kiedy LE spotyka LO, zamienia się w SE. „Le lo” nie istnieje w hiszpańskim, a „lo le” dodatkowo łamie kolejność (dalsze zawsze przed bliższym)."
  }
]$content$,
  7
);

-- ----------------------------------------------------------------------------
-- 8. GUSTAR i czasowniki o tej samej składni
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'gustar',
  'GUSTAR i czasowniki o odwróconej składni',
  'Nie „ja lubię”, tylko „mnie się podoba”. Cała grupa czasowników działa tak samo.',
  'gramatyka', 9,
  $content$[
  {
    "type": "intro",
    "text": "„Me gusta el cine” nie znaczy dosłownie „lubię kino”, tylko „kino mi się podoba”. Podmiotem jest to, co się podoba — a osoba jest dopełnieniem. Kiedy to zrozumiesz, cała grupa kilkunastu czasowników przestaje sprawiać kłopot naraz."
  },
  {
    "type": "formula",
    "title": "Schemat",
    "caption": "Czasownik uzgadnia się z tym, CO się podoba — nie z osobą.",
    "variants": [
      {
        "label": "Podoba się jedna rzecz",
        "parts": [
          { "text": "Me", "role": "other", "note": "komu: me/te/le/nos/os/les" },
          { "text": "gusta", "role": "verb", "note": "3. os. l.poj." },
          { "text": "el cine", "role": "subject", "note": "to jest PODMIOT" }
        ],
        "example": { "en": "Me gusta el cine.", "pl": "Lubię kino." }
      },
      {
        "label": "Podoba się wiele rzeczy",
        "parts": [
          { "text": "Me", "role": "other" },
          { "text": "gustan", "role": "verb", "note": "3. os. l.mn." },
          { "text": "las películas", "role": "subject", "note": "liczba mnoga → gustan" }
        ],
        "example": { "en": "Me gustan las películas españolas.", "pl": "Lubię hiszpańskie filmy." }
      },
      {
        "label": "Podoba się robić coś",
        "parts": [
          { "text": "Nos", "role": "other" },
          { "text": "gusta", "role": "verb", "note": "przy bezokoliczniku ZAWSZE l.poj." },
          { "text": "viajar", "role": "subject" }
        ],
        "example": { "en": "Nos gusta viajar.", "pl": "Lubimy podróżować." }
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd: „yo gusto el cine”. To znaczy „ja się podobam kinu”. Osoba NIGDY nie jest podmiotem gustar."
  },
  {
    "type": "table",
    "title": "Cała grupa działa identycznie",
    "headers": ["Czasownik", "Znaczenie", "Przykład"],
    "rows": [
      ["gustar", "podobać się, lubić", "Me gusta el chocolate."],
      ["encantar", "uwielbiać", "Me encanta bailar."],
      ["interesar", "interesować", "Nos interesa la historia."],
      ["doler", "boleć", "Me duele la cabeza."],
      ["molestar", "przeszkadzać", "Le molesta el ruido."],
      ["parecer", "wydawać się", "Me parece bien."],
      ["faltar", "brakować", "Te falta un punto."],
      ["quedar", "zostawać", "Nos quedan dos días."],
      ["apetecer", "mieć ochotę", "¿Te apetece un café?"],
      ["preocupar", "martwić", "Me preocupa el examen."]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Żeby podkreślić, o kogo chodzi, dodaje się „a mí, a ti, a él…”: „A mí me gusta el fútbol, pero a ella no.” Ta konstrukcja jest bardzo dobrze widziana w wypowiedzi pisemnej."
  },
  {
    "type": "examples",
    "title": "Stopniowanie upodobania",
    "items": [
      { "en": "Me encanta el flamenco.", "pl": "Uwielbiam flamenco.", "highlight": "encanta" },
      { "en": "Me gusta mucho el flamenco.", "pl": "Bardzo lubię flamenco.", "highlight": "gusta mucho" },
      { "en": "No me gusta nada el flamenco.", "pl": "W ogóle nie lubię flamenco.", "highlight": "No me gusta nada" },
      { "en": "Me da igual.", "pl": "Jest mi obojętne.", "highlight": "da igual" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "instruction": "Wpisz właściwą formę: gusta / gustan / encanta / encantan / duele / duelen.",
    "items": [
      { "before": "A mí me ", "after": " los deportes de invierno.", "accept": ["gustan", "encantan"], "hint": "liczba mnoga", "pl": "Lubię sporty zimowe." },
      { "before": "A Juan le ", "after": " la cabeza.", "accept": ["duele"], "hint": "jedna część ciała", "pl": "Juana boli głowa." },
      { "before": "Nos ", "after": " mucho viajar en tren.", "accept": ["gusta", "encanta"], "hint": "bezokolicznik → l.poj.", "pl": "Bardzo lubimy podróżować pociągiem." },
      { "before": "A mis padres les ", "after": " los pies.", "accept": ["duelen"], "hint": "los pies, l.mn.", "pl": "Rodziców bolą stopy." },
      { "before": "¿Te ", "after": " ir al cine esta noche?", "accept": ["apetece"], "hint": "apetecer", "pl": "Masz ochotę pójść dziś do kina?" }
    ]
  },
  {
    "type": "quiz",
    "question": "„___ gustan las lenguas extranjeras.”",
    "options": ["Yo", "A mí me", "Mí me"],
    "correctIndex": 1,
    "explanation": "Osoba przy gustar jest dopełnieniem, więc potrzebny jest zaimek ME, a dodatkowe „a mí” tylko go wzmacnia. „Yo gustan” byłoby podwójnie błędne — zła forma zaimka i brak zgody."
  }
]$content$,
  8
);

-- ----------------------------------------------------------------------------
-- 9. Przyimki
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'przyimki',
  'Przyimki: a, de, en, con',
  'Cztery przyimki, które wypełniają większość luk. Plus czasowniki, które rządzą konkretnym przyimkiem.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "W zadaniach z lukami przyimek to najczęstsza brakująca część mowy — bo jest krótki, niepozorny i nie da się go wywnioskować z polskiego. Polski używa przypadków tam, gdzie hiszpański używa przyimka, więc odpowiedniki są przypadkowe i trzeba je znać razem z czasownikiem."
  },
  {
    "type": "table",
    "title": "Podstawowe znaczenia",
    "headers": ["Przyimek", "Główne użycia", "Przykład"],
    "rows": [
      ["A", "kierunek, godzina, dopełnienie osobowe", "Voy a Madrid. A las dos. Veo a Juan."],
      ["DE", "pochodzenie, przynależność, materiał, temat", "Soy de Polonia. El libro de Ana. De madera."],
      ["EN", "miejsce (w środku), środek transportu, miesiąc", "Estoy en casa. En tren. En julio."],
      ["CON", "towarzystwo, narzędzie", "Voy con mi hermana. Escribo con boli."],
      ["DESDE / HASTA", "od / do (czas i miejsce)", "Desde las ocho hasta las tres."],
      ["ENTRE", "między", "Entre tú y yo."],
      ["SOBRE", "o (temat), na, około", "Un libro sobre historia."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "A OSOBOWE. Kiedy dopełnieniem bliższym jest OSOBA, przed nią obowiązkowo stoi A: „Veo a Juan”, ale „Veo la casa”. Polski nie ma tu nic podobnego, więc to stały punkt zadań."
  },
  {
    "type": "keyPhrases",
    "title": "Czasowniki i ich przyimki",
    "caption": "Ucz się ich jako całości — czasownik plus przyimek, nigdy osobno.",
    "groups": [
      {
        "label": "Z przyimkiem A",
        "phrases": [
          { "text": "empezar a + bezokolicznik", "pl": "zacząć coś robić" },
          { "text": "aprender a + bezokolicznik", "pl": "nauczyć się coś robić" },
          { "text": "ayudar a alguien", "pl": "pomagać komuś" },
          { "text": "invitar a alguien", "pl": "zaprosić kogoś" },
          { "text": "ir a + bezokolicznik", "pl": "zamierzać coś zrobić" },
          { "text": "parecerse a", "pl": "być podobnym do" }
        ]
      },
      {
        "label": "Z przyimkiem DE",
        "phrases": [
          { "text": "acordarse de", "pl": "pamiętać o" },
          { "text": "olvidarse de", "pl": "zapomnieć o" },
          { "text": "depender de", "pl": "zależeć od" },
          { "text": "quejarse de", "pl": "skarżyć się na" },
          { "text": "tratar de + bezokolicznik", "pl": "próbować coś zrobić" },
          { "text": "dejar de + bezokolicznik", "pl": "przestać coś robić" }
        ]
      },
      {
        "label": "Z przyimkiem EN / CON",
        "phrases": [
          { "text": "pensar en", "pl": "myśleć o" },
          { "text": "confiar en", "pl": "ufać komuś" },
          { "text": "tardar en + bezokolicznik", "pl": "zajmować czas na coś" },
          { "text": "soñar con", "pl": "marzyć o, śnić o" },
          { "text": "casarse con", "pl": "brać ślub z" },
          { "text": "contar con", "pl": "liczyć na" }
        ]
      }
    ]
  },
  {
    "type": "examples",
    "title": "Gdzie polski myli",
    "items": [
      { "en": "Pienso en ti.", "pl": "Myślę o tobie — EN, nie „de”.", "highlight": "en" },
      { "en": "Sueño con viajar.", "pl": "Marzę o podróżowaniu — CON, nie „de”.", "highlight": "con" },
      { "en": "Me caso con Ana.", "pl": "Żenię się z Aną — CON, nie „a”.", "highlight": "con" },
      { "en": "Depende de ti.", "pl": "To zależy od ciebie.", "highlight": "de" },
      { "en": "Tardé dos horas en llegar.", "pl": "Dotarcie zajęło mi dwie godziny.", "highlight": "en" },
      { "en": "Empecé a estudiar a las ocho.", "pl": "Zacząłem uczyć się o ósmej.", "highlight": "a" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wpisz przyimek",
    "items": [
      { "before": "Siempre pienso ", "after": " mis abuelos.", "accept": ["en"], "hint": "pensar…", "pl": "Zawsze myślę o dziadkach." },
      { "before": "Todo depende ", "after": " ti.", "accept": ["de"], "hint": "depender…", "pl": "Wszystko zależy od ciebie." },
      { "before": "Empezamos ", "after": " trabajar en junio.", "accept": ["a"], "hint": "empezar…", "pl": "Zaczęliśmy pracować w czerwcu." },
      { "before": "Voy a viajar ", "after": " tren.", "accept": ["en"], "hint": "środek transportu", "pl": "Pojadę pociągiem." },
      { "before": "Vi ", "after": " tu hermano en la calle.", "accept": ["a"], "hint": "dopełnienie osobowe", "pl": "Widziałem twojego brata na ulicy." },
      { "before": "Me olvidé ", "after": " las llaves.", "accept": ["de"], "hint": "olvidarse…", "pl": "Zapomniałem kluczy." },
      { "before": "El regalo es ", "after": " mi madre.", "accept": ["para", "de"], "hint": "dla kogo albo od kogo — oba możliwe", "pl": "Prezent jest dla mojej mamy." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Czasownik → przyimek",
    "pairs": [
      { "left": "soñar", "right": "con" },
      { "left": "acordarse", "right": "de" },
      { "left": "aprender", "right": "a" },
      { "left": "confiar", "right": "en" },
      { "left": "dejar (przestać)", "right": "de" },
      { "left": "ayudar", "right": "a" }
    ]
  }
]$content$,
  9
);

-- ----------------------------------------------------------------------------
-- 10. Słowotwórstwo
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'slowotworstwo',
  'Słowotwórstwo: przyrostki i przedrostki',
  'Jak z jednego wyrazu zrobić rzeczownik, przymiotnik albo przysłówek — i jak rozpoznać, którego potrzebujesz.',
  'slownictwo', 10,
  $content$[
  {
    "type": "intro",
    "text": "Zadanie słowotwórcze podaje wyraz DUŻYMI LITERAMI i każe wstawić do zdania jego inną formę. Klucz to dwa kroki: najpierw ustal, jakiej CZĘŚCI MOWY brakuje, dopiero potem dobierz końcówkę. Odwrotna kolejność to najczęstsza przyczyna błędów."
  },
  {
    "type": "table",
    "title": "Krok 1: co stoi obok luki",
    "headers": ["Sąsiedztwo luki", "Potrzebna część mowy", "Przykład"],
    "rows": [
      ["po rodzajniku (el, la, un)", "rzeczownik", "la BELLEZA"],
      ["po ser / estar / muy", "przymiotnik", "es FÁCIL"],
      ["po czasowniku, opisuje jak", "przysłówek", "habla RÁPIDAMENTE"],
      ["po przyimku (de, con, sin)", "rzeczownik", "sin DIFICULTAD"],
      ["przed rzeczownikiem", "przymiotnik", "una decisión DIFÍCIL"]
    ]
  },
  {
    "type": "table",
    "title": "Krok 2: najczęstsze przyrostki",
    "headers": ["Przyrostek", "Tworzy", "Przykład"],
    "rows": [
      ["-ción / -sión", "rzeczownik (czynność)", "informar → información"],
      ["-dad / -tad", "rzeczownik (cecha)", "posible → posibilidad"],
      ["-eza", "rzeczownik (cecha)", "bello → belleza"],
      ["-miento", "rzeczownik (proces)", "conocer → conocimiento"],
      ["-ista", "osoba (zawód, poglądy)", "arte → artista"],
      ["-dor / -dora", "osoba lub urządzenie", "trabajar → trabajador"],
      ["-oso / -osa", "przymiotnik (pełen czegoś)", "peligro → peligroso"],
      ["-able / -ible", "przymiotnik (dający się)", "comer → comestible"],
      ["-mente", "przysłówek", "rápida → rápidamente"]
    ],
    "caption": "Uwaga na -mente: dokleja się do formy ŻEŃSKIEJ przymiotnika (rápido → rápida → rápidamente)."
  },
  {
    "type": "table",
    "title": "Przedrostki przeczące",
    "headers": ["Przedrostek", "Znaczenie", "Przykład"],
    "rows": [
      ["in- / im- / i-", "nie-", "posible → imposible, legal → ilegal"],
      ["des-", "od-, roz-", "ordenado → desordenado"],
      ["re-", "ponownie", "hacer → rehacer"],
      ["anti-", "przeciw", "social → antisocial"]
    ],
    "caption": "im- przed p i b (imposible), i- przed l i r (ilegal, irreal), in- w pozostałych (increíble)."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uzgodnij rodzaj i liczbę. „La película fue muy aburrida” — nie „aburrido”, bo película jest rodzaju żeńskiego. Poprawnie utworzony wyraz z błędną końcówką to wciąż zero punktów."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: utwórz właściwą formę",
    "instruction": "W podpowiedzi jest wyraz wyjściowy.",
    "items": [
      { "before": "Habla español con mucha ", "after": ".", "accept": ["facilidad"], "hint": "FÁCIL — po „mucha” potrzebny rzeczownik", "pl": "Mówi po hiszpańsku z dużą łatwością." },
      { "before": "El examen fue muy ", "after": ".", "accept": ["difícil"], "hint": "DIFICULTAD — po „muy” przymiotnik", "pl": "Egzamin był bardzo trudny." },
      { "before": "Contestó ", "after": " a todas las preguntas.", "accept": ["rápidamente"], "hint": "RÁPIDO — jak odpowiedział?", "pl": "Odpowiedział szybko na wszystkie pytania." },
      { "before": "Es una zona muy ", "after": " por la noche.", "accept": ["peligrosa"], "hint": "PELIGRO — zona jest rodzaju żeńskiego", "pl": "To bardzo niebezpieczna okolica nocą." },
      { "before": "Su comportamiento fue ", "after": ".", "accept": ["inaceptable"], "hint": "ACEPTAR — z przedrostkiem przeczącym", "pl": "Jego zachowanie było nie do przyjęcia." },
      { "before": "Necesitamos más ", "after": " sobre el tema.", "accept": ["información"], "hint": "INFORMAR — po „más” rzeczownik", "pl": "Potrzebujemy więcej informacji na ten temat." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Wyraz podstawowy → forma pochodna",
    "pairs": [
      { "left": "posible", "right": "posibilidad" },
      { "left": "trabajar", "right": "trabajador" },
      { "left": "bello", "right": "belleza" },
      { "left": "conocer", "right": "conocimiento" },
      { "left": "peligro", "right": "peligroso" },
      { "left": "legal", "right": "ilegal" }
    ]
  },
  {
    "type": "quiz",
    "question": "„La decisión fue completamente ___ (LÓGICA).”",
    "options": ["ilógica", "inlógica", "deslógica"],
    "correctIndex": 0,
    "explanation": "Przed l stawia się przedrostek i-, nie in-. Stąd ilógico, ilegal, ilimitado — ale increíble i imposible, bo tam zaczyna się od innych liter."
  }
]$content$,
  10
);
