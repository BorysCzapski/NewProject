-- ============================================================================
-- supabase/seed/gitara/05_teoria_a_notacja.sql
-- Dział 6, partia A: notacja — pięciolinia, klucze, tonacje, rytm, metrum, tempo, dynamika (8 lekcji).
-- Idempotentny: upsert po slug. Uruchom PO 01_topics.sql (dział `teoria-muzyki` jest tu
-- dodawany osobno, więc plik działa też sam). Bloki zgodne z lib/gitara/lesson-blocks.ts.
-- Treść: adaptacja podręcznika C. Schmidt-Jones, CC BY-SA 4.0 (patrz blok „Źródło” w lekcjach).
-- ============================================================================

insert into gtr_topics (slug, title, description, order_index) values (
  'teoria-muzyki', 'Teoria muzyki',
  'Zapis nutowy, rytm, gamy, interwały i akordy — teoria, która tłumaczy, dlaczego to, co grasz na gitarze, brzmi tak, a nie inaczej. Adaptacja polska podręcznika Catherine Schmidt-Jones z dopiskami dla gitarzysty.',
  6
)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  order_index = excluded.order_index, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'pieciolinia-i-klucze',
  'Pięciolinia i klucze',
  'Jak wygląda zapis nutowy, co mówi klucz i jak odczytać nazwę nuty z jej miejsca na pięciolinii.',
  7, 1,
  $content$[
  {
    "type": "intro",
    "text": "Ludzie grali długo, zanim wynaleźli zapis muzyki — i do dziś część muzyków gra „ze słuchu”. Zapis ma jednak te same zalety co pismo: muzykę łatwiej poznawać, ćwiczyć i przekazywać. Najpopularniejszy zapis to **nuty na pięciolinii**. Znasz już tabulaturę (pokazuje, *gdzie* na gryfie położyć palec); nuty mówią, *jaki to dźwięk* i *jak długo trwa*."
  },
  {
    "type": "definition",
    "term": "Pięciolinia",
    "text": "Pięć poziomych, równoległych linii. Nuty stawia się **na liniach** albo **w przestrzeniach** między nimi. Dźwięk za wysoki lub za niski, żeby zmieścić się na pięciolinii, zapisuje się na krótkich **liniach dodanych**.",
    "note": "Im wyżej na pięciolinii stoi nuta, tym wyższy dźwięk."
  },
  {
    "type": "table",
    "headers": [
      "Element zapisu",
      "Co oznacza"
    ],
    "rows": [
      [
        "Kreska taktowa",
        "Pionowa kreska dzieląca muzykę na krótkie odcinki — **takty**"
      ],
      [
        "Podwójna kreska",
        "Koniec większej części utworu; gruba podwójna kreska kończy utwór"
      ],
      [
        "Nuta",
        "Zapisany dźwięk (wysokość + długość)"
      ],
      [
        "Pauza",
        "Zapisana cisza"
      ],
      [
        "Klucz, znaki przykluczowe, metrum",
        "Na początku pięciolinii — mówią, jak czytać nuty (o nich w kolejnych lekcjach)"
      ],
      [
        "Tempo, dynamika, powtórki",
        "Napisy nad i pod pięciolinią: jak szybko, jak głośno, dokąd wracać"
      ]
    ],
    "title": "Z czego składa się zapis"
  },
  {
    "type": "definition",
    "term": "Klucz",
    "text": "Pierwszy znak na każdej pięciolinii. Mówi, **która nuta (A, B, C, D, E, F lub G) leży na której linii albo w której przestrzeni**. Układ jest zawsze ten sam: kolejna litera to kolejna linia lub przestrzeń wyżej, a po G znów wraca A."
  },
  {
    "type": "compare",
    "title": "Dwa najczęstsze klucze",
    "leftLabel": "Klucz wiolinowy",
    "rightLabel": "Klucz basowy",
    "rows": [
      {
        "aspect": "Inna nazwa",
        "left": "klucz G",
        "right": "klucz F"
      },
      {
        "aspect": "Jak go poznać",
        "left": "Spirala owija **drugą linię od dołu** — to nuta G",
        "right": "Dwie kropki otaczają **drugą linię od góry** — to nuta F"
      },
      {
        "aspect": "Kto go czyta",
        "left": "Wyższe głosy i instrumenty (skrzypce, flet, gitara, prawa ręka na pianinie)",
        "right": "Niższe głosy i instrumenty (wiolonczela, gitara basowa, lewa ręka na pianinie)"
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Klucz",
      "Linie (od dołu)",
      "Przestrzenie (od dołu)"
    ],
    "rows": [
      [
        "Wiolinowy",
        "E – G – B – D – F",
        "F – A – C – E"
      ],
      [
        "Basowy",
        "G – B – D – F – A",
        "A – C – E – G"
      ]
    ],
    "title": "Ściąga: nuty na pięciolinii",
    "caption": "Linie i przestrzenie warto uczyć się osobno — ułóż własne zdanie z pierwszych liter i będzie szło szybciej. W kluczu wiolinowym przestrzenie układają się w słowo FACE."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Dlaczego dwa klucze?** Zapis czyta się najłatwiej, gdy większość nut mieści się na pięciolinii, a nie na liniach dodanych. Razem klucz wiolinowy i basowy pokrywają zakres większości głosów i instrumentów; **środkowe C** leży między nimi — tuż pod pięciolinią wiolinową i tuż nad basową."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Gitara i klucz wiolinowy.** Muzykę gitarową zapisuje się w kluczu wiolinowym, ale **brzmi ona o oktawę niżej, niż jest zapisana**. Czasem na kluczu dopisuje się maleńką „8” u dołu — to właśnie znaczy „graj oktawę niżej”. Jeśli widzisz nuty i tabulaturę razem (tak zapisuje się większość lekcji gitarowych), tabulatura jest Twoją podpowiedzią, gdzie to zagrać."
  },
  {
    "type": "quiz",
    "question": "Wokół której linii zwija się spirala klucza wiolinowego?",
    "options": [
      "Pierwszej od dołu (E)",
      "Drugiej od dołu (G)",
      "Trzeciej od dołu (B)",
      "Piątej od dołu (F)"
    ],
    "correctIndex": 1,
    "explanation": "Spirala klucza wiolinowego owija drugą linię od dołu — dlatego nazywa się go także kluczem G."
  },
  {
    "type": "quiz",
    "question": "Co oznacza maleńka „8” pod kluczem wiolinowym w nutach gitarowych?",
    "options": [
      "Że utwór ma 8 taktów",
      "Że nuty brzmią o oktawę niżej, niż są zapisane",
      "Że gramy ósemkami",
      "Że trzeba zagrać na 8. progu"
    ],
    "correctIndex": 1,
    "explanation": "Ósemka pod kluczem wiolinowym znaczy „brzmi oktawę niżej”. Gitara tak właśnie jest zapisywana — łatwiej czytać w wiolinowym niż w basowym."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'krzyzyki-bemole-enharmonia',
  'Krzyżyki, bemole i enharmonia',
  'Dwanaście dźwięków w oktawie, półtony i tony na gryfie oraz dlaczego ten sam dźwięk może mieć dwie nazwy.',
  8, 2,
  $content$[
  {
    "type": "intro",
    "text": "Wysokość dźwięku zależy od częstotliwości drgań struny: im szybsze drgania, tym dźwięk wyższy. Muzycy nie mówią jednak o hercach, tylko dają dźwiękom litery: **A, B, C, D, E, F, G**. Te siedem liter nazywa **dźwięki naturalne** (białe klawisze). Po G zaczyna się następna oktawa — znowu od A."
  },
  {
    "type": "definition",
    "term": "Półton i cały ton",
    "text": "**Półton** to najmniejsza odległość między sąsiednimi dźwiękami w muzyce zachodniej. **Cały ton** to dwa półtony.",
    "note": "Na gitarze: jeden próg w górę = **półton**, dwa progi = **cały ton**."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Dźwięki naturalne **nie leżą od siebie w równych odstępach**. Tylko dwie pary są oddalone o półton: **E–F** i **B–C**. Wszystkie pozostałe sąsiednie litery dzieli cały ton. Na gryfie widać to od razu: między E a F jest jeden próg, a między F a G — dwa."
  },
  {
    "type": "definition",
    "term": "Krzyżyk, bemol, kasownik",
    "text": "**Krzyżyk (♯)** podnosi dźwięk o półton, **bemol (♭)** obniża o półton, **kasownik (♮)** odwołuje poprzedni znak i wraca do dźwięku naturalnego. **Podwójny krzyżyk** podnosi o cały ton (dwa półtony), **podwójny bemol** obniża o cały ton."
  },
  {
    "type": "table",
    "headers": [
      "Dźwięk",
      "Druga nazwa (enharmonia)"
    ],
    "rows": [
      [
        "C",
        "—"
      ],
      [
        "C♯",
        "D♭"
      ],
      [
        "D",
        "—"
      ],
      [
        "D♯",
        "E♭"
      ],
      [
        "E",
        "—"
      ],
      [
        "F",
        "—"
      ],
      [
        "F♯",
        "G♭"
      ],
      [
        "G",
        "—"
      ],
      [
        "G♯",
        "A♭"
      ],
      [
        "A",
        "—"
      ],
      [
        "A♯",
        "B♭"
      ],
      [
        "B",
        "—"
      ]
    ],
    "title": "12 dźwięków w oktawie",
    "caption": "Między dźwiękami naturalnymi, które dzieli cały ton, leży dźwięk z krzyżykiem lub bemolem (czarne klawisze). W silniku aplikacji zapisujemy je krzyżykami: C#, D#, F#, G#, A#."
  },
  {
    "type": "definition",
    "term": "Enharmonia",
    "text": "Dwa dźwięki, które brzmią tak samo, ale mają **różne nazwy i różny zapis**, są **enharmoniczne**. Przykład: G♯ i A♭ to ten sam próg na tej samej strunie. Nawet **E♯ = F** i **C♭ = B**, bo E♯ to po prostu dźwięk o półton wyższy od E.",
    "note": "Na gitarze (tak jak na pianinie) enharmoniczne dźwięki brzmią identycznie. Skrzypek czy wokalista mogą je zagrać odrobinę inaczej."
  },
  {
    "type": "fretboard-explorer",
    "title": "Znajdź wszystkie F♯ (czyli G♭)",
    "targetNote": "F#",
    "frets": 12,
    "caption": "Każde zaznaczone miejsce to F♯ — i jednocześnie G♭. Nazwa zależy od kontekstu: w tonacji z krzyżykami powiesz F♯, w tonacji z bemolami G♭."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Po co dwie nazwy?** Muzyka w danej tonacji używa głównie siedmiu z dwunastu dźwięków, więc zapis ma tylko siedem liter, a resztę dostaje się krzyżykami i bemolami. Dlatego ważne jest, **jak** dźwięk jest nazwany: pokazuje jego rolę w akordzie i w tonacji. Podwójne krzyżyki i bemole wyglądają skomplikowanie, ale zachowują informację o roli dźwięku w akordzie i tonacji, której zwykłe „A” by nie dało."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**B czy H?** W zapisie międzynarodowym (i w tej aplikacji) dźwięk naturalny między A a C to **B**, a obniżony — **B♭**. W polskiej nomenklaturze naturalne B nazywa się **H**, a B oznacza dźwięk obniżony (nasze B♭). Spotkasz obie wersje: w śpiewnikach często H, w tabulaturach i zagranicznych podręcznikach — B."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Znaki w zapisie.** Krzyżyk lub bemol może stać na początku pięciolinii (w **znakach przykluczowych** — następna lekcja) albo tuż przed nutą jako **znak przygodny**. W standardowym zapisie znak przygodny obowiązuje do końca taktu."
  },
  {
    "type": "quiz",
    "question": "Które dwa zapisy opisują ten sam dźwięk (ten sam próg na gitarze)?",
    "options": [
      "C♯ i D♭",
      "C i D",
      "E i G",
      "A i B"
    ],
    "correctIndex": 0,
    "explanation": "C♯ i D♭ to dźwięki enharmoniczne — leżą pomiędzy C a D. W pozostałych parach dźwięki są różne."
  },
  {
    "type": "quiz",
    "question": "Ile półtonów (progów) dzieli E od F?",
    "options": [
      "0",
      "1",
      "2",
      "3"
    ],
    "correctIndex": 1,
    "explanation": "E i F to jedna z dwóch par dźwięków naturalnych oddalonych o półton (druga to B–C). Na gryfie to sąsiednie progi."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'tonacje-i-znaki-przykluczowe',
  'Tonacje i znaki przykluczowe',
  'Jak z krzyżyków i bemoli po kluczu odczytać tonację i które tonacje są najwygodniejsze na gitarze.',
  8, 3,
  $content$[
  {
    "type": "intro",
    "text": "Zaraz po kluczu na pięciolinii stoi **znak przykluczowy**: kilka krzyżyków albo kilka bemoli (albo nic). Klucz mówi, jakie litery leżą na liniach, a znaki przykluczowe — **które z nich są podwyższone lub obniżone w całym utworze**. To jedyne dwa znaki, które pojawiają się na każdej pięciolinii."
  },
  {
    "type": "definition",
    "term": "Znaki przykluczowe",
    "text": "Lista wszystkich krzyżyków lub bemoli tonacji. Gdy krzyżyk (bemol) stoi na jakiejś linii lub w przestrzeni, podwyższony (obniżony) jest **każdy** dźwięk o tej literze — także w innych oktawach. Brak znaków przykluczowych znaczy: wszystkie dźwięki naturalne."
  },
  {
    "type": "table",
    "headers": [
      "",
      "Kolejność"
    ],
    "rows": [
      [
        "Krzyżyki",
        "F♯ – C♯ – G♯ – D♯ – A♯ – E♯ – B♯"
      ],
      [
        "Bemole (odwrotnie)",
        "B♭ – E♭ – A♭ – D♭ – G♭ – C♭ – F♭"
      ]
    ],
    "title": "Kolejność krzyżyków i bemoli",
    "caption": "Zawsze w tej samej kolejności: tonacja z jednym krzyżykiem ma F♯, z dwoma — F♯ i C♯, i tak dalej. Kolejność wynika z koła kwintowego (osobna lekcja)."
  },
  {
    "type": "steps",
    "title": "Jak szybko nazwać tonację durową",
    "steps": [
      {
        "title": "Tonacja z krzyżykami",
        "text": "Nazwa tonacji to dźwięk o **półton wyższy od ostatniego krzyżyka**. Przykład: krzyżyki F♯, C♯ → ostatni to C♯, więc tonacja to **D-dur**."
      },
      {
        "title": "Tonacja z bemolami",
        "text": "Nazwa tonacji to **przedostatni bemol**. Przykład: bemole B♭, E♭, A♭ → przedostatni to E♭, więc tonacja to **Es-dur** (E♭-dur)."
      },
      {
        "title": "Wyjątki",
        "text": "Reguła nie działa dla **C-dur** (brak znaków) i **F-dur** (jeden bemol: B♭). Te dwie tonacje po prostu zapamiętaj."
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Znaki",
      "Tonacja durowa",
      "Paralelna molowa"
    ],
    "rows": [
      [
        "brak",
        "C-dur",
        "a-moll (Am)"
      ],
      [
        "1♯ (F♯)",
        "G-dur",
        "e-moll (Em)"
      ],
      [
        "2♯",
        "D-dur",
        "h-moll (Bm)"
      ],
      [
        "3♯",
        "A-dur",
        "fis-moll (F♯m)"
      ],
      [
        "4♯",
        "E-dur",
        "cis-moll (C♯m)"
      ],
      [
        "5♯",
        "B-dur (po polsku H-dur)",
        "gis-moll (G♯m)"
      ],
      [
        "1♭ (B♭)",
        "F-dur",
        "d-moll (Dm)"
      ],
      [
        "2♭",
        "B♭-dur",
        "g-moll (Gm)"
      ],
      [
        "3♭",
        "E♭-dur",
        "c-moll (Cm)"
      ],
      [
        "4♭",
        "A♭-dur",
        "f-moll (Fm)"
      ]
    ],
    "title": "Tonacje i ich znaki",
    "caption": "Utwór w moll ma te same znaki przykluczowe co jego **paralelny dur** — dur leżący trzy półtony wyżej (np. a-moll i C-dur). Czy utwór jest w dur czy w moll, słychać, a w nutach zdradza to zwykle ostatni akord."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Jak rozpoznać dur od moll?** Posłuchaj: dur brzmi jasno, moll smutniej. Jeśli nie jesteś pewien, sprawdź **ostatni akord** utworu — zwykle (podobnie jak ostatnia nuta melodii) nazywa tonację."
  },
  {
    "type": "table",
    "headers": [
      "Tonacja",
      "Akordy główne (I – IV – V)",
      "Paralelna molowa"
    ],
    "rows": [
      [
        "C-dur",
        "C – F – G",
        "Am"
      ],
      [
        "G-dur",
        "G – C – D",
        "Em"
      ],
      [
        "D-dur",
        "D – G – A",
        "Bm"
      ],
      [
        "A-dur",
        "A – D – E",
        "F♯m"
      ],
      [
        "E-dur",
        "E – A – B",
        "C♯m"
      ],
      [
        "F-dur",
        "F – B♭ – C",
        "Dm"
      ]
    ],
    "title": "Na gitarze: najwygodniejsze tonacje",
    "caption": "Tonacje C, G, D, A i E są ulubionymi tonacjami gitarzystów, bo większość ich akordów brzmi na strunach otwartych. Dlatego zaczynałeś od Em, Am, C, G, D. Kapodaster pozwala zagrać te same kształty w innej tonacji."
  },
  {
    "type": "quiz",
    "question": "Utwór ma w kluczu dwa krzyżyki (F♯ i C♯). W jakiej jest tonacji durowej?",
    "options": [
      "C-dur",
      "G-dur",
      "D-dur",
      "A-dur"
    ],
    "correctIndex": 2,
    "explanation": "Ostatni krzyżyk to C♯, a tonacja to dźwięk o półton wyższy: D. Dwa krzyżyki to D-dur (paralelna molowa: h-moll)."
  },
  {
    "type": "quiz",
    "question": "Utwór ma w kluczu dwa bemole (B♭ i E♭). Jaka to tonacja durowa?",
    "options": [
      "B♭-dur",
      "E♭-dur",
      "F-dur",
      "G-dur"
    ],
    "correctIndex": 0,
    "explanation": "Przedostatni bemol nazywa tonację. Bemole B♭ i E♭ — przedostatni to B♭, więc tonacja to B♭-dur."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'wartosci-nut-i-pauz',
  'Wartości nut i pauz',
  'Jak wygląda nuta, jak ją czytać i jak długości nut mają się do siebie jak ułamki.',
  7, 4,
  $content$[
  {
    "type": "intro",
    "text": "Zapisana nuta mówi dwie rzeczy: **jak wysoko** (miejsce na pięciolinii, klucz, tonacja) i **jak długo** (jej wygląd, metrum i tempo). W tej lekcji o drugiej z nich."
  },
  {
    "type": "definition",
    "term": "Nuta i jej części",
    "text": "Nuta ma **główkę** (pełną albo pustą), a niektóre mają jeszcze **laskę**, **chorągiewki**, **belki** łączące nuty oraz **kropki** po główce. Wysokość wskazuje tylko miejsce główki. Wszystko inne wpływa na długość.",
    "note": "Nuta bez główki (na przykład krzyżyk na laskach) nie ma jednego wyznaczonego dźwięku: to może być uderzenie w bęben, klaśnięcie albo cały akord."
  },
  {
    "type": "table",
    "headers": [
      "Nuta",
      "Pauza",
      "Długość względem całej nuty",
      "Przy metrum 4/4 (ćwierćnuta = 1 uderzenie)"
    ],
    "rows": [
      [
        "Cała nuta",
        "Cała pauza",
        "1",
        "4 uderzenia"
      ],
      [
        "Półnuta",
        "Półpauza",
        "1/2",
        "2 uderzenia"
      ],
      [
        "Ćwierćnuta",
        "Ćwierćpauza",
        "1/4",
        "1 uderzenie"
      ],
      [
        "Ósemka",
        "Pauza ósemkowa",
        "1/8",
        "1/2 uderzenia"
      ],
      [
        "Szesnastka",
        "Pauza szesnastkowa",
        "1/16",
        "1/4 uderzenia"
      ],
      [
        "Trzydziestodwójka",
        "Pauza trzydziestodwójkowa",
        "1/32",
        "1/8 uderzenia"
      ]
    ],
    "title": "Wartości nut i pauz",
    "caption": "Każda kolejna nuta jest dwa razy krótsza od poprzedniej. Nie ma „trzecich” czy „szóstych” nut — inne długości zapisuje się kropkami, łukami i triolami (następna lekcja)."
  },
  {
    "type": "rhythm-values",
    "title": "Wartości rytmiczne na żywo",
    "bpm": 70,
    "caption": "Odtwórz każdy wiersz osobno: takt trwa tyle samo, zmienia się tylko, na ile równych części go dzielimy."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Nuty działają jak ułamki.** Dwie półnuty, cztery ćwierćnuty i osiem ósemek trwają dokładnie tyle samo co jedna cała nuta. Pojedyncze chorągiewki sąsiednich nut często zamienia się na **belki**, które łączą nuty w czytelne grupy (zazwyczaj po jednym uderzeniu); ile chorągiewek miałaby nuta, tyle belek ma jej główka."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Ile nuta trwa naprawdę?** Wartość nuty jest względna: półnuta zawsze trwa dwa razy dłużej niż ćwierćnuta, ale ile to sekund, zależy od **metrum** (ile uderzeń w takcie i która nuta jest uderzeniem) oraz od **tempa** (jak szybkie jest uderzenie)."
  },
  {
    "type": "definition",
    "term": "Pauza",
    "text": "Pauza to zapisana cisza. Dla każdej wartości nuty istnieje pauza o tej samej długości. Pauza nie zawsze oznacza ciszę w całej muzyce — czasem tylko w jednym głosie, a pauzą zaznacza się, że ten głos czeka."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Kierunek lasek nie zmienia długości.** Nuty poniżej środkowej linii mają laski w górę, a na środkowej linii i powyżej — w dół. To tylko kwestia czytelności (dźwięki mają mieścić się blisko pięciolinii)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Na gitarze.** Uderzenia w rytmie brzdąkania to w praktyce ćwierćnuty i ósemki: „raz – i – dwa – i” to cztery ósemki w takcie 2/4 albo dwie ćwierćnuty z podziałem. Zagraj podstawowy rytm na jednym akordzie z metronomem (zakładka Ćwicz) i licz na głos, ile ósemek mieści się w jednym uderzeniu."
  },
  {
    "type": "quiz",
    "question": "Ile ósemek trwa tyle co jedna półnuta?",
    "options": [
      "2",
      "4",
      "8",
      "16"
    ],
    "correctIndex": 1,
    "explanation": "Półnuta to 1/2 całej nuty, ósemka to 1/8. Czyli półnuta = 4 ósemki."
  },
  {
    "type": "quiz",
    "question": "Czy kierunek laski (w górę czy w dół) zmienia długość nuty?",
    "options": [
      "Tak, laska w górę to nuta dłuższa",
      "Tak, laska w dół to nuta dłuższa",
      "Nie, to tylko kwestia czytelności",
      "Tak, ale tylko dla półnut"
    ],
    "correctIndex": 2,
    "explanation": "O długości decyduje kształt nuty (pusta czy pełna główka, laska, chorągiewki, kropki), a nie kierunek laski."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'takt-i-metrum',
  'Takt i metrum',
  'Jak odczytać oznaczenie taktu (np. 4/4, 3/4, 6/8), czym są takt i uderzenie oraz jak rozpoznać metrum ze słuchu.',
  8, 5,
  $content$[
  {
    "type": "intro",
    "text": "Muzykę słychać w czasie, więc zwykle dzieli się ją na krótkie, równe odcinki — **uderzenia** (miary). W większości utworów coś dzieje się dokładnie na początku każdego uderzenia: to je wystukujesz nogą albo klaszczesz. Najsilniejsze uderzenie to **mocna część** (część „raz”)."
  },
  {
    "type": "definition",
    "term": "Takt",
    "text": "Uderzenia układają się w powtarzalne wzory mocnych i słabych części, np. mocna–słaba–mocna–słaba albo mocna–słaba–słaba. Jeden taki wzór to **takt** (kreski taktowe oddzielają kolejne takty). Oznaczenie metrum mówi dwie rzeczy: **ile uderzeń jest w takcie** i **jaka nuta jest jednym uderzeniem**."
  },
  {
    "type": "table",
    "headers": [
      "Oznaczenie",
      "Znaczy",
      "Przykład"
    ],
    "rows": [
      [
        "4/4",
        "4 uderzenia w takcie, uderzenie = ćwierćnuta",
        "Można ten takt wypełnić: 4 ćwierćnutami, 2 półnutami, całą nutą itd."
      ],
      [
        "3/4",
        "3 uderzenia, uderzenie = ćwierćnuta",
        "Walc: raz-dwa-trzy"
      ],
      [
        "2/4",
        "2 uderzenia, uderzenie = ćwierćnuta",
        "Marsz: raz-dwa"
      ],
      [
        "6/8",
        "6 ósemek w takcie (zwykle liczone po 2 uderzenia)",
        "Ballada, jig"
      ],
      [
        "3/8",
        "3 ósemki w takcie",
        "Często liczone jako 1 uderzenie na takt"
      ]
    ],
    "title": "Jak czytać oznaczenie taktu",
    "caption": "Górna liczba = ile uderzeń w takcie. Dolna = jaka nuta jest uderzeniem (4 = ćwierćnuta, 8 = ósemka, 2 = półnuta). Oznaczenie przypomina ułamek: wypełnianie taktu jest jak szukanie równych ułamków."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Dwa skróty.** 4/4 występuje tak często, że nazywa się je **taktem na cztery** i oznacza literą **C**. 2/2 zapisuje się jako **C** przekreślone pionową kreską (tzw. alla breve)."
  },
  {
    "type": "definition",
    "term": "Metrum",
    "text": "Metrum to powtarzalny wzór mocnych i słabych części. Nie musi mieć nic wspólnego z umiejętnością czytania nut: małe dzieci (i słuchacze) czują je bez zapisu. Oznaczenie taktu jest tylko **zapisem** metrum. Niektóre style (chorał gregoriański, niektóre muzyki świata) metrum nie mają."
  },
  {
    "type": "table",
    "headers": [
      "Liczba uderzeń",
      "Nazwa",
      "Wzór"
    ],
    "rows": [
      [
        "2",
        "metrum dwumiarowe",
        "mocna – słaba"
      ],
      [
        "3",
        "metrum trzymiarowe",
        "mocna – słaba – słaba"
      ],
      [
        "4",
        "metrum czteromiarowe",
        "mocna – słaba – słaba – słaba (trzecia część bywa nieco mocniejsza)"
      ]
    ],
    "title": "Metrum według liczby uderzeń"
  },
  {
    "type": "compare",
    "title": "Prosta czy złożona miara",
    "leftLabel": "Metrum proste",
    "rightLabel": "Metrum złożone",
    "rows": [
      {
        "aspect": "Jak dzieli się uderzenie",
        "left": "na **połowy** (2 ósemki)",
        "right": "na **trzecie części** (3 ósemki)"
      },
      {
        "aspect": "Jak liczyć",
        "left": "raz-i-dwa-i-trzy-i-cztery-i",
        "right": "raz-i-a-dwa-i-a"
      },
      {
        "aspect": "Przykłady",
        "left": "2/4, 3/4, 4/4",
        "right": "6/8 (2 uderzenia), 9/8 (3), 12/8 (4)"
      }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**6/8 to dwa uderzenia po trzy.** W takcie 6/8 jest sześć ósemek, ale zwykle czuje się je jako **dwa** uderzenia (ćwierćnuta z kropką) podzielone na trzy. Podobnie 9/8 to trzy uderzenia, a 12/8 — cztery. Przyjemne rozpoznawanie: jeśli wygodniej liczy się „raz-i-a-dwa-i-a”, to metrum jest złożone."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Na gitarze.** Rytm brzdąkania zależy od metrum. W 4/4 zagrasz np. ↓ ↓↑ ↓ ↓↑, w 3/4 — ↓ ↓ ↓ albo ↓ ↓↑ ↓↑, w 6/8 — ↓ ↓ ↑ ↓ ↓ ↑ (akcent na „raz” i „cztery”). Zanim zagrasz, naucz się liczyć na głos; kapodaster niczego tu nie zmieni, a metronom w zakładce Ćwicz pomoże utrzymać równą pulsację."
  },
  {
    "type": "quiz",
    "question": "Co oznacza metrum 3/4?",
    "options": [
      "3 uderzenia w takcie, każde to ćwierćnuta",
      "4 uderzenia w takcie, każde to trzecia nuta",
      "3 takty po 4 uderzenia",
      "3 ćwierćnuty na minutę"
    ],
    "correctIndex": 0,
    "explanation": "Górna liczba to liczba uderzeń w takcie (3), dolna — jaka nuta jest uderzeniem (4 = ćwierćnuta)."
  },
  {
    "type": "quiz",
    "question": "Ile uderzeń zwykle liczysz w takcie 6/8?",
    "options": [
      "6",
      "3",
      "2",
      "1"
    ],
    "correctIndex": 2,
    "explanation": "6/8 jest metrum złożonym: sześć ósemek grupuje się po trzy, więc zwykle liczy się dwa uderzenia (każde z kropką)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'przedtakt-kropki-ligi-synkopa',
  'Przedtakt, kropki, łuki i synkopa',
  'Nietypowe długości nut, rytm poza mocną częścią taktu i dlaczego wiązanie nut to nie to samo co legato.',
  9, 6,
  $content$[
  {
    "type": "intro",
    "text": "Wartości nut z poprzedniej lekcji to „połówki połówek”. Tu o tym, jak zapisać **inne** długości, jak zacząć utwór **przed** pierwszą mocną częścią i jak ożywić rytm, akcentując miejsca, które zwykle są słabe."
  },
  {
    "type": "definition",
    "term": "Nuta z kropką",
    "text": "Kropka za główką **wydłuża nutę o połowę jej wartości**. Półnuta z kropką to półnuta + ćwierćnuta (3/4 całej nuty), ćwierćnuta z kropką — ćwierćnuta + ósemka. Druga kropka dodaje połowę tego, co dodała pierwsza."
  },
  {
    "type": "table",
    "headers": [
      "Nuta z kropką",
      "Trwa tyle co",
      "W uderzeniach (ćwierćnuta = 1)"
    ],
    "rows": [
      [
        "Półnuta z kropką",
        "półnuta + ćwierćnuta",
        "3"
      ],
      [
        "Ćwierćnuta z kropką",
        "ćwierćnuta + ósemka",
        "1,5"
      ],
      [
        "Ósemka z kropką",
        "ósemka + szesnastka",
        "0,75"
      ],
      [
        "Półnuta z dwiema kropkami",
        "półnuta + ćwierćnuta + ósemka",
        "3,5"
      ]
    ],
    "title": "Kropki w praktyce"
  },
  {
    "type": "compare",
    "title": "Dwa łuki, które łatwo pomylić",
    "leftLabel": "Łuk wiążący (legato „tie”)",
    "rightLabel": "Łuk legato (slur)",
    "rows": [
      {
        "aspect": "Co łączy",
        "left": "dwie lub więcej nut **o tej samej wysokości**",
        "right": "nuty **o różnej wysokości**"
      },
      {
        "aspect": "Efekt",
        "left": "słychać **jedną** długą nutę, równą sumie wartości",
        "right": "grane płynnie, bez przerwy między nutami, ale każda brzmi osobno"
      },
      {
        "aspect": "Po co",
        "left": "żeby zapisać dźwięk dłuższy niż takt albo o nietypowej długości",
        "right": "to artykulacja — sposób wykonania"
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Na gitarze.** Na tabulaturze legato (hammer-on, pull-off, slide) zapisujemy zwykle jako łuk albo literkami **h**, **p**, **/**. To łuk legato — grasz dwa różne dźwięki, ale uderzasz strunę tylko raz. Łuk wiążący to co innego: powtórzonej nuty nie uderzasz drugi raz."
  },
  {
    "type": "definition",
    "term": "Takt niepełny i przedtakt",
    "text": "Każdy takt powinien mieć dokładnie tyle uderzeń, ile wynika z metrum. Wyjątek: utwór często zaczyna się **przed** mocną częścią. Wtedy pierwszy takt może być niepełny — to **przedtakt (anakruza)**. Jeśli jest przedtakt, ostatni takt utworu jest odpowiednio **krótszy**, tak żeby oba razem dawały jeden pełny takt.",
    "note": "Przedtakt może zacząć też każdą frazę w środku utworu: nuty przed pierwszą mocną częścią frazy to jej „przygotowanie”."
  },
  {
    "type": "definition",
    "term": "Triola i inne podziały „z innej miary”",
    "text": "Gdy chcesz podzielić wartość nie na połowy, a na trzy równe części, piszesz nad nutami liczbę **3** i masz **triolę**. Można tak podzielić także na pięć lub inne części, ale triole są zdecydowanie najczęstsze. Dla gitarzysty triola ósemkowa to „raz-i-a”, trzy równe dźwięki na jedno uderzenie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Swing.** W jazzie i pokrewnych stylach dwie zapisane ósemki grane są często jak triola (długa-krótka). Wtedy w nagłówku stoi „swing”; napis „straight” (prosto) każe grać nuty równo, tak jak zapisano."
  },
  {
    "type": "definition",
    "term": "Synkopa",
    "text": "Synkopa to rytm, który **akcentuje miejsce zwykle słabe**: słabą część taktu albo miejsce między uderzeniami (tzw. „i”). Silne, równe pulsowanie tworzy tło, a synkopa wprowadza niespodziankę: długa nuta zaczyna się na „drugiej” albo w połowie trzeciej części.",
    "note": "Synkopa to serce muzyki afroamerykańskiej: ragtime, blues, jazz, rock. Jej rodzaj sporo mówi o stylu utworu."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Popularny rytm brzdąkania ↓ ↓↑ _ ↑↓↑ jest zsynkopowany: trzecie uderzenie jest pominięte, a zamiast niego słychać tylko „i” (ruch w górę). Zagraj go z metronomem i licz „raz – dwa-i – (trzy) – i – cztery-i”: poczujesz, że rytm „przepływa” przez mocną część."
  },
  {
    "type": "quiz",
    "question": "Ile uderzeń (ćwierćnut) trwa półnuta z kropką?",
    "options": [
      "2",
      "2,5",
      "3",
      "4"
    ],
    "correctIndex": 2,
    "explanation": "Półnuta trwa 2 uderzenia, kropka dodaje połowę (1), razem 3."
  },
  {
    "type": "quiz",
    "question": "Łuk łączy dwie nuty o tej samej wysokości. Co to znaczy?",
    "options": [
      "Grasz dwa dźwięki płynnie",
      "Brzmi jedna dłuższa nuta (suma obu wartości)",
      "Powtarzasz frazę",
      "Grasz oktawę wyżej"
    ],
    "correctIndex": 1,
    "explanation": "To łuk wiążący: drugiej nuty nie uderzasz osobno, tylko przedłużasz pierwszą."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'tempo-i-znaki-powtorzen',
  'Tempo i znaki powtórzeń',
  'Jak szybko grać (uderzenia na minutę i włoskie nazwy) oraz jak czytać powtórki i skróty w zapisie.',
  8, 7,
  $content$[
  {
    "type": "intro",
    "text": "**Tempo** to szybkość utworu. Podaje się je na dwa sposoby: dokładnie (**uderzenia na minutę**) albo słownie (najczęściej po włosku). Oznaczenia stoją zwykle nad pięciolinią na początku utworu i w miejscach zmiany tempa."
  },
  {
    "type": "definition",
    "term": "Metronom",
    "text": "Oznaczenie metronomiczne podaje liczbę uderzeń na minutę (BPM), np. ćwierćnuta = 120. Mierzy się je metronomem — urządzeniem lub aplikacją, które odtwarza równe „kliknięcia”. W tej aplikacji metronom znajdziesz w zakładce Ćwicz.",
    "note": "Napisy na metronomie (allegro = 120, andante = 80) są tylko orientacyjne: „allegro” ma być wyraźnie szybsze od „andante”, ale niekoniecznie dokładnie 120."
  },
  {
    "type": "table",
    "headers": [
      "Termin",
      "Znaczenie"
    ],
    "rows": [
      [
        "Grave",
        "bardzo wolno, poważnie"
      ],
      [
        "Largo",
        "wolno, szeroko"
      ],
      [
        "Larghetto",
        "nieco żywiej niż largo"
      ],
      [
        "Adagio",
        "wolno"
      ],
      [
        "Lento",
        "wolno"
      ],
      [
        "Andante",
        "dosłownie „idąc” — umiarkowanie wolno"
      ],
      [
        "Moderato",
        "umiarkowanie"
      ],
      [
        "Allegretto",
        "nie tak szybko jak allegro"
      ],
      [
        "Allegro",
        "szybko"
      ],
      [
        "Vivace / Vivo",
        "żywo, żwawo"
      ],
      [
        "Presto",
        "bardzo szybko"
      ],
      [
        "Prestissimo",
        "najszybciej"
      ]
    ],
    "title": "Włoskie określenia tempa (od najwolniejszego)",
    "caption": "Znaczenie zależy od utworu: to, jak szybko „czuje się” muzyka, zależy też od tego, jak gęsto dzielone są uderzenia. Jeśli nie ma oznaczenia BPM, kieruj się stylem, gatunkiem i zdrowym rozsądkiem."
  },
  {
    "type": "table",
    "headers": [
      "Słowo",
      "Znaczenie"
    ],
    "rows": [
      [
        "poco / un poco",
        "trochę"
      ],
      [
        "molto",
        "bardzo"
      ],
      [
        "più",
        "bardziej"
      ],
      [
        "meno",
        "mniej"
      ],
      [
        "mosso",
        "poruszony, ruchliwy"
      ]
    ],
    "title": "Przydatne słówka",
    "caption": "Np. „un poco allegro” = trochę szybko; „più mosso” = z większym ruchem (szybciej); „molto adagio” = bardzo wolno."
  },
  {
    "type": "table",
    "headers": [
      "Oznaczenie",
      "Znaczy"
    ],
    "rows": [
      [
        "accelerando (accel.)",
        "stopniowo przyspieszaj"
      ],
      [
        "ritardando (rit.)",
        "stopniowo zwalniaj"
      ],
      [
        "rallentando (rall.)",
        "stopniowo zwalniaj"
      ],
      [
        "ritenuto (riten.)",
        "zwolnij (od razu)"
      ],
      [
        "rubato",
        "swobodnie: trzymaj tempo, ale pozwól muzyce delikatnie przyspieszać i odpoczywać"
      ],
      [
        "poco a poco",
        "stopniowo, po trochu"
      ],
      [
        "a tempo / Tempo I",
        "wróć do pierwotnego tempa"
      ]
    ],
    "title": "Zmiany tempa"
  },
  {
    "type": "definition",
    "term": "Powtórki",
    "text": "Powtarzanie to jedna z najważniejszych zasad muzyki, więc zapis ma wiele sposobów na oszczędzenie miejsca. Krótkie powtórzenie (takt lub dwa) oznacza **znak powtórzenia**. Fragment średniej długości ujmuje się między **dwukropki przy podwójnej kresce** (kropki po prawej stronie otwierają, po lewej zamykają powtórkę)."
  },
  {
    "type": "steps",
    "title": "Jak czytać powtórki",
    "steps": [
      {
        "title": "Brak dwukropka otwierającego",
        "text": "Wróć na sam początek utworu."
      },
      {
        "title": "Nawiasy (1. i 2.)",
        "text": "Przy drugim przejściu pomijasz takty z nawiasem „1.” i grasz „2.”. W każdym przejściu grasz tylko jeden nawias."
      },
      {
        "title": "Napisy włoskie",
        "text": "**D.C.** (da capo) – wróć na początek; **D.S.** (dal segno) – wróć do znaku segno; **al Fine** – graj do słowa „Fine”; **Coda** – skocz do zakończenia."
      },
      {
        "title": "Napisy w śpiewnikach",
        "text": "Spotkasz też „x2”, „refren”, „solo”, „tylko za drugim razem”. Zwykle są jasne, choć warto chwilę prześledzić „mapę” utworu, zanim zaczniesz grać."
      }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Zanim zaczniesz nowy utwór, znajdź na kartce wszystkie powtórki i skoki, zakreśl je ołówkiem i narysuj strzałki. Ćwicząc nowy fragment, zacznij wolno (np. 60 BPM), a tempo podnoś o 5–10 BPM dopiero wtedy, gdy zagrasz bez błędów trzy razy z rzędu."
  },
  {
    "type": "quiz",
    "question": "Co oznacza „ritardando”?",
    "options": [
      "Przyspieszaj stopniowo",
      "Zwalniaj stopniowo",
      "Graj głośniej",
      "Graj staccato"
    ],
    "correctIndex": 1,
    "explanation": "Ritardando (rit.) to stopniowe zwalnianie. Przyspieszanie to accelerando."
  },
  {
    "type": "quiz",
    "question": "Które określenie tempa oznacza „bardzo szybko”?",
    "options": [
      "Largo",
      "Andante",
      "Allegro",
      "Presto"
    ],
    "correctIndex": 3,
    "explanation": "Presto to bardzo szybko; allegro to po prostu szybko, andante — umiarkowanie wolno, largo — wolno."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'dynamika-i-artykulacja',
  'Dynamika i artykulacja',
  'Jak głośno i jak „wyraźnie” grać: oznaczenia głośności, akcenty, staccato i legato — oraz jak to wydobyć na gitarze.',
  8, 8,
  $content$[
  {
    "type": "intro",
    "text": "Dwa utwory z identycznymi nutami i rytmem mogą brzmieć zupełnie inaczej. O tej różnicy decyduje **styl wykonania**: jak głośno (dynamika) i w jaki sposób łączymy dźwięki (artykulacja)."
  },
  {
    "type": "definition",
    "term": "Dynamika",
    "text": "Dynamika to głośność muzyki. Fizycy mówią o amplitudzie, muzycy — o oznaczeniach, które są **względne**: „forte” w wykonaniu orkiestry jest głośniejsze niż „forte” pojedynczych skrzypiec. Znaczenie zależy od utworu, instrumentu, wykonawcy, stylu i akustyki sali."
  },
  {
    "type": "table",
    "headers": [
      "Znak",
      "Nazwa",
      "Znaczenie"
    ],
    "rows": [
      [
        "pp",
        "pianissimo",
        "bardzo cicho"
      ],
      [
        "p",
        "piano",
        "cicho"
      ],
      [
        "mp",
        "mezzo piano",
        "średnio cicho"
      ],
      [
        "mf",
        "mezzo forte",
        "średnio głośno"
      ],
      [
        "f",
        "forte",
        "głośno"
      ],
      [
        "ff",
        "fortissimo",
        "bardzo głośno"
      ],
      [
        "crescendo (cresc.)",
        "—",
        "stopniowo głośniej"
      ],
      [
        "decrescendo / diminuendo (dim.)",
        "—",
        "stopniowo ciszej"
      ]
    ],
    "title": "Oznaczenia dynamiki",
    "caption": "Forte po piano znaczy nagłą zmianę głośności; crescendo i diminuendo zmieniają ją stopniowo. Od tych słów wzięła się nazwa „fortepian” (pianoforte): instrument, który — w przeciwieństwie do klawesynu — potrafi grać głośno i cicho."
  },
  {
    "type": "definition",
    "term": "Akcent",
    "text": "Akcent to znak, że dana nuta (albo jej początek) ma być wyraźnie mocniejsza od reszty. Są różne rodzaje akcentów (m.in. **>** , **sforzando**, **fortepiano**), a ich wykonanie zależy od instrumentu i stylu — akcentowana nuta bywa też dłuższa albo krótsza."
  },
  {
    "type": "definition",
    "term": "Artykulacja",
    "text": "Artykulacja opisuje, co dzieje się **między dźwiękami**: jak zaczyna się każdy z nich (atak) i ile jest przerwy. Nie zmienia tempa ani rytmu; sprawia tylko, że dźwięki brzmią krócej albo dłużej niż zapisane (resztę czasu zajmuje niezapisana pauza)."
  },
  {
    "type": "table",
    "headers": [
      "Artykulacja",
      "Jak brzmi",
      "Na gitarze"
    ],
    "rows": [
      [
        "Staccato (kropka nad nutą)",
        "krótko, z wyraźną przerwą między dźwiękami",
        "szybko zdejmij palec z progu albo lekko oprzyj dłoń na strunach"
      ],
      [
        "Legato",
        "płynnie, bez przerwy, ale z zaznaczonym początkiem każdej nuty",
        "kolejne struny szarpiesz bez przerwy; dociskaj kolejny próg, zanim puścisz poprzedni"
      ],
      [
        "Łuk legato (slur)",
        "tylko pierwsza nuta ma atak, reszta płynie",
        "hammer-on, pull-off, slide (jedno szarpnięcie struny na kilka dźwięków)"
      ],
      [
        "Akcent",
        "nuta wyróżniona atakiem",
        "mocniejsze uderzenie kostką albo palcem"
      ],
      [
        "Marcato",
        "kilka akcentów pod rząd, mocno i wyraźnie",
        "wyraźny, twardy atak każdej nuty"
      ]
    ],
    "title": "Najczęstsze artykulacje"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Tie to nie slur.** Łuk między dwiema nutami o tej samej wysokości (łuk wiążący) nie jest artykulacją: to jedna dłuższa nuta. Dopiero łuk nad nutami **różnej** wysokości mówi o płynnym graniu (legato)."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Dynamika na gitarze.** Głośność zmieniasz siłą uderzenia, miejscem uderzania (bliżej mostka — jaśniej i głośniej, bliżej podstawy gryfu — ciepło i ciszej) i tym, ile strun naraz uderzasz. Palm muting (tłumienie dłonią) daje krótki, stłumiony dźwięk podobny do staccato."
  },
  {
    "type": "quiz",
    "question": "Które oznaczenie jest najgłośniejsze?",
    "options": [
      "p",
      "mf",
      "f",
      "ff"
    ],
    "correctIndex": 3,
    "explanation": "Kolejność od najcichszego: pp, p, mp, mf, f, ff. „ff” (fortissimo) to bardzo głośno."
  },
  {
    "type": "quiz",
    "question": "Co daje staccato?",
    "options": [
      "Dźwięki łączone płynnie",
      "Dźwięki krótkie, z przerwą między nimi",
      "Szybsze tempo",
      "Głośniejsze granie"
    ],
    "correctIndex": 1,
    "explanation": "Staccato skraca brzmienie nut (z przerwą między nimi), ale nie zmienia tempa ani rytmu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

