-- ============================================================================
-- supabase/seed/gitara/03_lessons.sql
-- 10 lekcje, dwie na dział, w kolejności lib/gitara/topics.ts. Block shapes
-- match lib/gitara/lesson-blocks.ts's GtrBlock union exactly — JSON keys are
-- camelCase because gtr_lessons.content is read back with a straight
-- `as GtrBlock[]` cast (lib/gitara/content.ts's lessonBlocks), no
-- snake_case conversion anywhere in the pipeline.
--
-- FrettedChord literals embedded in chord-diagram/progression blocks reuse
-- the exact same positions as 02_chords.sql's matching rows — run that file
-- first, though this one has no FK dependency on it (chord shapes are
-- authored inline per lesson, not looked up).
--
-- Run AFTER 01_topics.sql. Idempotent: upsert by (topic_id, slug).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Dział 1: postawa-i-strojenie
-- ----------------------------------------------------------------------------

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'postawa-i-strojenie'),
  'jak-trzymac-i-stroic',
  'Jak trzymać gitarę i się nastroić',
  'Postawa siedząca, nazwy strun i strojenie standardowe E-A-D-G-B-e.',
  6, 1,
  $content$[
  {
    "type": "intro",
    "text": "Zanim zagrasz pierwszy dźwięk, dwie rzeczy muszą się zgadzać: jak trzymasz gitarę i czy jest nastrojona. Złe nawyki postawy trudno potem oduczyć, a rozstrojona gitara sprawi, że nawet poprawnie zagrany akord będzie brzmiał źle."
  },
  {
    "type": "steps",
    "title": "Postawa — siedząc",
    "steps": [
      { "title": "Oprzyj gitarę na kolanie", "text": "Jeśli grasz na klasycznej, korpus opiera się na lewym kolanie (technika klasyczna) albo na prawym (technika ludowa/rockowa). Wybierz jedno i trzymaj się go — inaczej za każdym razem musisz się na nowo ustawiać." },
      { "title": "Nie garb się nad gryfem", "text": "Gitara powinna być na tyle blisko ciała, żeby nie trzeba było się nad nią pochylać. Plecy proste, gitara przyciągnięta przedramieniem, nie wzrokiem." },
      { "title": "Kciuk za gryfem", "text": "Kciuk lewej ręki (dla praworęcznych) leży z tyłu gryfu, mniej więcej naprzeciwko palca środkowego — nie wystaje ponad górną krawędź. To on daje oparcie, dzięki któremu palce mogą swobodnie się poruszać." },
      { "title": "Nadgarstek lekko wygięty, nie złamany", "text": "Zbyt mocno zgięty nadgarstek blokuje ruch palców i szybko męczy rękę. Powinien tworzyć łagodny łuk." }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Struny licz od najcieńszej.** 1. struna to najcieńsza (najwyższy dźwięk), 6. struna to najgrubsza (najniższy dźwięk) — mimo że na diagramach akordów rysuje się ją po LEWEJ stronie."
  },
  {
    "type": "definition",
    "term": "Strojenie standardowe",
    "text": "Od najgrubszej do najcieńszej struny: **E-A-D-G-B-e** (mi, la, re, sol, si, mi). Zapamiętaj zdanie: „Ala Ma Dobrą Gitarę, Bo Emi kupili” — pierwsze litery wskazują struny.",
    "note": "Duże E oznacza niższe brzmienie (6. struna), małe e — wyższe (1. struna). To ta sama nuta, dwie oktawy niżej i wyżej."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Użyj **stroika** na telefonie albo wbudowanego stroika elektronicznego, żeby nastroić każdą strunę osobno. W dziale **Ćwicz** znajdziesz stroik działający przez mikrofon — prosto w tej aplikacji."
  },
  {
    "type": "quiz",
    "question": "Ile strun ma standardowa gitara akustyczna/klasyczna?",
    "options": ["4", "6", "7", "12"],
    "correctIndex": 1,
    "explanation": "6 strun, strojonych standardowo E-A-D-G-B-e od najgrubszej do najcieńszej."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'postawa-i-strojenie'),
  'budowa-i-diagramy',
  'Budowa gitary i jak czytać diagramy',
  'Nazwy części gitary oraz jak czytać diagram akordu i tabulaturę.',
  5, 2,
  $content$[
  {
    "type": "intro",
    "text": "Zanim zaczniesz naukę akordów, warto znać nazwy części gitary i umieć czytać dwa rodzaje zapisu, które będziesz widzieć bez końca: diagram akordu i tabulaturę."
  },
  {
    "type": "table",
    "title": "Główne części gitary",
    "headers": ["Część", "Co robi"],
    "rows": [
      ["Główka", "Tu są klucze strojące — nimi zmieniasz napięcie (i strojenie) każdej struny"],
      ["Gryf", "Długi element z progami, po którym przesuwają się palce lewej ręki"],
      ["Progi", "Metalowe paski dzielące gryf — każdy próg to jeden półton"],
      ["Pudło rezonansowe / korpus", "Wzmacnia i kształtuje dźwięk strun"],
      ["Mostek", "Miejsce, gdzie struny są zamocowane przy korpusie"]
    ]
  },
  {
    "type": "chord-diagram",
    "title": "Przykładowy diagram akordu",
    "chords": [
      { "label": "C", "slug": "c", "chord": { "frets": [null, 3, 2, 0, 1, 0], "fingers": [null, 3, 2, null, 1, null], "baseFret": 1 } }
    ],
    "caption": "Pionowe linie to struny (od lewej: 6. gruba do 1. cienka). Poziome linie to progi. Kropka pokazuje, gdzie postawić palec, cyfra w kropce — który palec. Kółko nad struną = graj otwartą, **x** = nie graj tej struny."
  },
  {
    "type": "tab",
    "title": "Przykład tabulatury",
    "tabText": "e|---0---1---3---|\nB|---1---1---0---|\nG|---0---2---0---|\nD|---2---3---0---|\nA|---3---3---2---|\nE|-------1---3---|",
    "caption": "Sześć linii = sześć strun (górna = najcieńsza 1. struna). Liczby to progi. Czytasz od lewej do prawej — tu grane są kolejno trzy akordy."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Diagram akordu i tabulatura pokazują to samo z dwóch stron: diagram — **gdzie postawić palce naraz** (akord), tabulatura — **którą strunę i próg zagrać w danym momencie** (melodia, riff, przebieg)."
  },
  {
    "type": "quiz",
    "question": "W tabulaturze widzisz `3` na linii oznaczonej `A`. Co to znaczy?",
    "options": ["Zagraj 3. próg na strunie A", "Zagraj strunę A trzy razy", "Użyj 3. palca na dowolnym progu", "Pomiń tę strunę"],
    "correctIndex": 0,
    "explanation": "Liczba na linii struny wskazuje numer progu — 3 na linii A oznacza 3. próg struny A."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

-- ----------------------------------------------------------------------------
-- Dział 2: pierwsze-akordy
-- ----------------------------------------------------------------------------

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'pierwsze-akordy'),
  'pierwsze-piec-akordow',
  'Twoje pierwsze akordy: Em, Am, C, G, D',
  'Pięć chwytów, od których zaczyna prawie każdy gitarzysta.',
  7, 1,
  $content$[
  {
    "type": "intro",
    "text": "Te pięć akordów otwiera dosłownie tysiące piosenek. Nie musisz umieć ich wszystkich naraz — zacznij od Em i Am, które dzielą prawie ten sam układ palców."
  },
  {
    "type": "chord-diagram",
    "title": "Em i Am — sąsiedzi",
    "chords": [
      { "label": "Em", "slug": "em", "chord": { "frets": [0, 2, 2, 0, 0, 0], "fingers": [null, 2, 3, null, null, null], "baseFret": 1 } },
      { "label": "Am", "slug": "am", "chord": { "frets": [null, 0, 2, 2, 1, 0], "fingers": [null, null, 2, 3, 1, null], "baseFret": 1 } }
    ],
    "caption": "Am to Em przesunięte o jedną strunę w prawo, plus jeden dodatkowy palec. Poćwicz przeskakiwanie między nimi."
  },
  {
    "type": "chord-diagram",
    "title": "C, G, D",
    "chords": [
      { "label": "C", "slug": "c", "chord": { "frets": [null, 3, 2, 0, 1, 0], "fingers": [null, 3, 2, null, 1, null], "baseFret": 1 } },
      { "label": "G", "slug": "g", "chord": { "frets": [3, 2, 0, 0, 0, 3], "fingers": [3, 2, null, null, null, 4], "baseFret": 1 } },
      { "label": "D", "slug": "d", "chord": { "frets": [null, null, 0, 2, 3, 2], "fingers": [null, null, null, 1, 3, 2], "baseFret": 1 } }
    ],
    "caption": "Trudniejsze niż Em/Am, bo palce nie leżą już tak blisko siebie — ale to właśnie te trzy najczęściej zobaczysz w chwytach piosenek."
  },
  {
    "type": "steps",
    "title": "Jak ćwiczyć nowy chwyt",
    "steps": [
      { "title": "Ustaw palce bez grania", "text": "Połóż palce w pozycji akordu, nie brzdąkaj jeszcze. Sprawdź wzrokiem, czy każdy palec jest tuż przy progu (nie na środku pola między progami)." },
      { "title": "Zagraj strunę po strunie", "text": "Przeciągnij palcem po każdej strunie osobno. Jeśli któraś brzęczy albo jest głucha, popraw ustawienie palca — zwykle to kwestia nacisku albo zbyt płaskiego palca dotykającego sąsiedniej struny." },
      { "title": "Dopiero teraz zagraj cały akord naraz", "text": "Jedno smyknięcie przez wszystkie potrzebne struny. Powtarzaj, aż brzmi czysto za każdym razem, nie co drugi raz." }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd początkujących: **za mały nacisk** i palce leżące **za daleko od progu**. Struna musi być dociśnięta tuż przy progu (nie na nim), inaczej dźwięk brzęczy albo w ogóle nie brzmi."
  },
  {
    "type": "quiz",
    "question": "Grasz akord C i szósta struna (najgrubsza) brzmi, choć nie powinna. Co jest nie tak?",
    "options": ["Gitara jest rozstrojona", "Zapomniałeś wyciszyć/pominąć szóstą strunę — w C jest ona wyciszona (x)", "Za mocno dociskasz palce", "To normalne, tak ma być"],
    "correctIndex": 1,
    "explanation": "W akordzie C szósta struna jest oznaczona jako x (wyciszona) — nie powinna być grana ani brzmieć."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'pierwsze-akordy'),
  'zmiana-akordow-i-progresja',
  'Zmiana akordów i pierwsza progresja',
  'Jak trenować szybkie, czyste przejścia i twoja pierwsza progresja akordów.',
  6, 2,
  $content$[
  {
    "type": "intro",
    "text": "Umieć zagrać akord to połowa sukcesu. Druga połowa to zmienić go na kolejny, zanim rytm ucieknie do przodu. Tego właśnie uczy progresja akordów."
  },
  {
    "type": "definition",
    "term": "Progresja akordów",
    "text": "Sekwencja akordów granych jedna po drugiej w ustalonym rytmie, np. **G - Em - C - D**. To jedna z najbardziej rozpoznawalnych progresji w muzyce pop i rock.",
    "note": "Progresja nie zmienia się losowo — te same 4 akordy w tej kolejności brzmią znajomo, bo pasują do siebie harmonicznie."
  },
  {
    "type": "progression",
    "title": "Twoja pierwsza progresja: G - Em - C - D",
    "bpm": 70,
    "chords": [
      { "label": "G", "slug": "g", "chord": { "frets": [3, 2, 0, 0, 0, 3], "fingers": [3, 2, null, null, null, 4], "baseFret": 1 } },
      { "label": "Em", "slug": "em", "chord": { "frets": [0, 2, 2, 0, 0, 0], "fingers": [null, 2, 3, null, null, null], "baseFret": 1 } },
      { "label": "C", "slug": "c", "chord": { "frets": [null, 3, 2, 0, 1, 0], "fingers": [null, 3, 2, null, 1, null], "baseFret": 1 } },
      { "label": "D", "slug": "d", "chord": { "frets": [null, null, 0, 2, 3, 2], "fingers": [null, null, null, 1, 3, 2], "baseFret": 1 } }
    ],
    "caption": "Odtwórz, żeby usłyszeć, jak brzmi cała progresja. Potem spróbuj zagrać ją sam, zmieniając akord co dwa uderzenia."
  },
  {
    "type": "steps",
    "title": "Jak trenować szybkość zmiany",
    "steps": [
      { "title": "Zwolnij tempo", "text": "Ustaw metronom (dział Ćwicz) na wolne tempo, np. 60 BPM, i zmieniaj akord co 4 uderzenia." },
      { "title": "Szukaj wspólnych palców", "text": "Niektóre palce zostają na tym samym miejscu przy zmianie akordu (np. z Am na C palec wskazujący często nie musi się ruszać). Znajdź te „kotwice” — to przyspiesza zmianę." },
      { "title": "Przyspieszaj dopiero, gdy jest czysto", "text": "Szybka, ale brudna zmiana akordów uczy złych nawyków. Zwiększaj tempo tylko wtedy, gdy poprzednie jest już pewne." }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie patrz na prawą rękę podczas brzdąkania — trenuj lewą rękę, żeby ustawiała akord **bez patrzenia**. To jeden z największych kroków w stronę grania „na czuja”."
  },
  {
    "type": "quiz",
    "question": "Ćwiczysz zmianę G → C i zawsze się zacinasz. Co pomoże najbardziej?",
    "options": ["Granie od razu w szybkim tempie", "Zwolnienie tempa i szukanie wspólnych palców między akordami", "Pominięcie akordu G", "Granie tylko prawą ręką"],
    "correctIndex": 1,
    "explanation": "Zwolnienie tempa daje czas na poprawne ustawienie palców, a szukanie wspólnych punktów między akordami skraca dystans, jaki muszą pokonać palce."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

-- ----------------------------------------------------------------------------
-- Dział 3: nuty-i-rytm
-- ----------------------------------------------------------------------------

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'nuty-i-rytm'),
  'wartosci-rytmiczne-i-takt',
  'Wartości rytmiczne i takt',
  'Takt 4/4 i pięć podstawowych wartości rytmicznych, do usłyszenia, nie tylko przeczytania.',
  6, 1,
  $content$[
  {
    "type": "intro",
    "text": "Rytm to nie dodatek do muzyki — to jej szkielet. Zanim nauczysz się grać „w rytmie”, musisz wiedzieć, jak długo trwa każdy dźwięk."
  },
  {
    "type": "definition",
    "term": "Takt (metrum) 4/4",
    "text": "Najpopularniejszy podział muzyki: cztery uderzenia (ćwierćnuty) w każdym takcie, a jedna ćwierćnuta jest jednostką odliczania — „raz, dwa, trzy, cztery”.",
    "note": "Górna cyfra (4) mówi, ile uderzeń jest w takcie. Dolna cyfra (4) mówi, jaka wartość nuty jest jednym uderzeniem — tu: ćwierćnuta."
  },
  {
    "type": "rhythm-values",
    "title": "Wartości rytmiczne",
    "bpm": 70,
    "caption": "Odtwórz każdy wiersz osobno. Takt trwa tyle samo w każdym wierszu — zmienia się tylko, na ile części go dzielimy."
  },
  {
    "type": "table",
    "title": "Nazwy i długości",
    "headers": ["Wartość", "Ile trwa (takt 4/4)", "Ile w jednym takcie"],
    "rows": [
      ["Cała nuta", "4 uderzenia", "1"],
      ["Półnuta", "2 uderzenia", "2"],
      ["Ćwierćnuta", "1 uderzenie", "4"],
      ["Ósemka", "pół uderzenia", "8"],
      ["Szesnastka", "ćwierć uderzenia", "16"]
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Gitarzyści rzadko czytają rytm z klasycznych nut — częściej z **tabulatury** (gdzie rytm bywa opisany osobno) albo po prostu **licząc na głos**: „1 i 2 i 3 i 4 i” dla ósemek."
  },
  {
    "type": "quiz",
    "question": "Grasz w takcie 4/4 same ćwierćnuty. Ile dźwięków zagrasz w jednym takcie?",
    "options": ["2", "4", "8", "16"],
    "correctIndex": 1,
    "explanation": "Ćwierćnuta = jedno uderzenie, a takt 4/4 ma cztery uderzenia, więc zagrasz cztery ćwierćnuty."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'nuty-i-rytm'),
  'czytanie-tabulatury',
  'Czytanie tabulatury',
  'Podstawowy zapis, znaki specjalne (hammer-on, pull-off, bend, slide) i ograniczenia tabulatury.',
  5, 2,
  $content$[
  {
    "type": "intro",
    "text": "Tabulatura (w skrócie „tab”) to najpopularniejszy sposób zapisu gitarowego w internecie — nie wymaga znajomości nut, tylko strun i progów."
  },
  {
    "type": "tab",
    "title": "Podstawowy zapis",
    "tabText": "e|---0-------3---|\nB|-----1---0---1-|\nG|---------------|\nD|---------------|\nA|---------------|\nE|---------------|",
    "caption": "Sześć linii od góry: e-B-G-D-A-E (od najcieńszej do najgrubszej — odwrotnie niż liczysz numery strun). Liczba = numer progu. Puste pole = struna nie gra w tym miejscu."
  },
  {
    "type": "table",
    "title": "Znaki specjalne w tabulaturze",
    "headers": ["Znak", "Znaczenie"],
    "rows": [
      ["h", "hammer-on — uderz drugi dźwięk samym palcem lewej ręki, bez szarpania struny"],
      ["p", "pull-off — odwrotność hammer-on, zdejmujesz palec i struna brzmi niżej"],
      ["b", "bend — naciągnij strunę w bok, podnosząc wysokość dźwięku"],
      ["/ oraz \\", "slide — przesuń palec do kolejnego progu bez podrywania go ze struny"],
      ["x", "zagraj strunę wyciszoną (perkusyjny, głuchy dźwięk)"]
    ]
  },
  {
    "type": "tab",
    "title": "Przykład z hammer-on i slide",
    "tabText": "e|---3h5---7/9---|\nB|---------------|\nG|---------------|\nD|---------------|\nA|---------------|\nE|---------------|",
    "caption": "`3h5` = zagraj 3. próg, potem „uderz” 5. próg samym palcem lewej ręki. `7/9` = zagraj 7. próg i wjedź nim (bez puszczania) do 9. progu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tabulatura **nie pokazuje rytmu** tak dokładnie jak nuty — dlatego warto znać melodię ze słuchu (np. z nagrania) i traktować tab jako mapę **gdzie** grać, a nagranie jako informację **kiedy**."
  },
  {
    "type": "quiz",
    "question": "Co oznacza `h` między dwiema liczbami w tabulaturze, np. `2h4`?",
    "options": ["Zagraj obie nuty osobno, szarpiąc strunę za każdym razem", "Hammer-on: zagraj pierwszą nutę, drugą „uderz” palcem bez szarpania struny", "Zagraj akord z dwóch dźwięków naraz", "Wycisz strunę"],
    "correctIndex": 1,
    "explanation": "h oznacza hammer-on — drugi dźwięk uzyskujesz samym uderzeniem palca lewej ręki, bez ponownego zagrania struny prawą ręką."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'nuty-i-rytm'),
  'nuty-na-gryfie',
  'Nuty na gryfie',
  'Półtony, otwarte struny i ćwiczenie znajdowania dźwięków na całym gryfie.',
  6, 3,
  $content$[
  {
    "type": "intro",
    "text": "Każdy próg na każdej strunie to konkretny dźwięk. Znajomość, gdzie leżą poszczególne nuty, to fundament pod system CAGED w następnym dziale."
  },
  {
    "type": "definition",
    "term": "Półton",
    "text": "Odległość jednego progu na gitarze to zawsze **jeden półton** — najmniejsza odległość między dźwiękami w muzyce zachodniej. Dwa progi to cały ton.",
    "note": "Wyjątek: między E i F oraz między H(B) i C nie ma pominiętego dźwięku — tam pół tonu to naturalna odległość."
  },
  {
    "type": "table",
    "title": "Otwarte struny",
    "headers": ["Struna", "Dźwięk"],
    "rows": [
      ["6. (najgrubsza)", "E"],
      ["5.", "A"],
      ["4.", "D"],
      ["3.", "G"],
      ["2.", "H (B)"],
      ["1. (najcieńsza)", "e"]
    ]
  },
  {
    "type": "fretboard-explorer",
    "title": "Znajdź wszystkie C",
    "targetNote": "C",
    "frets": 12,
    "caption": "Kliknij każde miejsce na gryfie, gdzie brzmi dźwięk C. Usłyszysz potwierdzenie, gdy trafisz."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Skrót:** dźwięk na dowolnej strunie w 12. progu to ta sama nuta co struna otwarta, tylko o oktawę wyżej. To ułatwia orientację na wyższych progach."
  },
  {
    "type": "fretboard-explorer",
    "title": "A teraz znajdź wszystkie E",
    "targetNote": "E",
    "frets": 12,
    "caption": "E pojawia się często — to nuta dwóch strun otwartych naraz (6. i 1.)."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

-- ----------------------------------------------------------------------------
-- Dział 4: system-caged
-- ----------------------------------------------------------------------------

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'system-caged'),
  'wprowadzenie-do-caged',
  'Wprowadzenie do CAGED',
  'Pięć znanych ci już kształtów akordów, przesuwanych wzdłuż całego gryfu.',
  6, 1,
  $content$[
  {
    "type": "intro",
    "text": "System CAGED bierze pięć akordów otwartych, które już znasz — C, A, G, E, D — i pokazuje, jak każdy z nich da się przesunąć w dowolne miejsce gryfu, żeby zagrać DOWOLNY akord durowy tym samym kształtem."
  },
  {
    "type": "definition",
    "term": "System CAGED",
    "text": "Nazwa to skrót od pięciu kształtów akordów: **C**, **A**, **G**, **E**, **D**. Każdy kształt, przesunięty odpowiednio wysoko i „dociśnięty” palcem zamiast pustych strun (czyli zamieniony w chwyt barowy), daje ten sam akord w innym miejscu gryfu.",
    "note": "F-dur, którego uczyłeś się jako osobny, trudny chwyt, to w rzeczywistości kształt E przesunięty o jeden próg."
  },
  {
    "type": "caged-shapes",
    "title": "Pięć kształtów C-dur",
    "caption": "Przełączaj się między kształtami. To wciąż ten sam akord (C-dur), tylko zagrany w innym miejscu gryfu i innym układem palców."
  },
  {
    "type": "compare",
    "title": "Dlaczego to działa",
    "leftLabel": "Akord otwarty",
    "rightLabel": "Kształt przesunięty",
    "rows": [
      { "aspect": "Puste struny", "left": "Grane jako otwarte (0)", "right": "Dociśnięte palcem wskazującym (barre)" },
      { "aspect": "Pozycja", "left": "Zawsze blisko główki", "right": "Dowolne miejsce na gryfie" },
      { "aspect": "Dźwięk (nuta)", "left": "Zależy od konkretnego chwytu", "right": "Zależy tylko od tego, na którym progu leży palec barowy" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Kształt **G** (i częściowo **C**) jest fizycznie trudny do zagrania w pełnej, sześciostrunowej wersji barowej — dlatego w praktyce gitarzyści częściej pomijają najwyższą strunę albo używają go rzadziej niż kształtów E i A. To normalne, nie błąd w nauce."
  },
  {
    "type": "quiz",
    "question": "Grasz kształt E jako barre na 3. progu. Jaki to akord?",
    "options": ["Zawsze E-dur", "Zawsze G-dur", "Zależy od tego, jaki dźwięk jest pod palcem barowym na 6. strunie", "Zawsze C-dur"],
    "correctIndex": 2,
    "explanation": "Kształt przesunięty gra akord o nazwie takiej, jak dźwięk pod palcem barowym na strunie, która była root w otwartej wersji tego kształtu — dla kształtu E to 6. struna."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'system-caged'),
  'laczenie-pozycji',
  'Łączenie pozycji wzdłuż gryfu',
  'Jak kształty zachodzą na siebie i którymi zacząć w praktyce.',
  5, 2,
  $content$[
  {
    "type": "intro",
    "text": "Znajomość pięciu kształtów osobno to dopiero połowa systemu CAGED. Prawdziwa siła pojawia się, gdy widzisz, jak **sąsiednie kształty zachodzą na siebie** — bo współdzielą te same nuty na gryfie."
  },
  {
    "type": "steps",
    "title": "Jak ćwiczyć przejścia",
    "steps": [
      { "title": "Zacznij od dwóch sąsiednich kształtów", "text": "Np. C i A dla akordu C-dur (blisko siebie na dole gryfu). Zagraj jeden, potem drugi, zwracając uwagę na wspólne nuty." },
      { "title": "Znajdź nutę root w każdym kształcie", "text": "Root (dźwięk, od którego akord bierze nazwę) leży w innym miejscu w każdym kształcie — czasem na 6. strunie, czasem na 5., czasem na 4." },
      { "title": "Graj tę samą progresję różnymi kształtami", "text": "Zagraj progresję z lekcji „Zmiana akordów i pierwsza progresja”, ale użyj wyższych pozycji z systemu CAGED zamiast akordów otwartych, gdzie to możliwe." }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Nie musisz uczyć się wszystkich pięciu kształtów naraz dla każdego akordu. Zacznij od kształtów **E** i **A** — najłatwiejsze do zagrania w pełni i najczęściej używane w prawdziwej grze."
  },
  {
    "type": "table",
    "title": "Który kształt, kiedy",
    "headers": ["Kształt", "Root leży na strunie"],
    "rows": [
      ["C", "5. (A)"],
      ["A", "5. (A)"],
      ["G", "6. (E) i 3. (G)"],
      ["E", "6. (E)"],
      ["D", "4. (D)"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "System CAGED działa identycznie dla akordów **molowych** — te same pięć kształtów, tylko oparte na wersjach molowych Am, Em i Dm zamiast durowych."
  },
  {
    "type": "quiz",
    "question": "Chcesz zagrać A-dur w wysokiej pozycji, korzystając z kształtu D. Jak znaleźć właściwy próg?",
    "options": ["Policzyć odległość (w półtonach) od D do A i o tyle przesunąć kształt", "Zawsze zagrać na 5. progu", "To niemożliwe — kształt D działa tylko dla D-dur", "Zagrać na tym samym progu co otwarte D"],
    "correctIndex": 0,
    "explanation": "Kształt D jest ruchomy — przesuwasz go tak, żeby jego nuta root (na 4. strunie) trafiła na próg, gdzie leży A. Odległość liczysz tak samo, jak przy każdym innym ruchomym kształcie."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

-- ----------------------------------------------------------------------------
-- Dział 5: techniki-gry
-- ----------------------------------------------------------------------------

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'techniki-gry'),
  'palm-muting-i-legato',
  'Palm muting i legato: hammer-on / pull-off',
  'Dwie przeciwstawne techniki: stłumiony dźwięk kontra płynne przejścia bez szarpania struny.',
  6, 1,
  $content$[
  {
    "type": "intro",
    "text": "Techniki to sposób, w jaki wydobywasz dźwięk — nie tylko CO grasz, ale JAK. Palm muting i legato to dwie najczęściej używane techniki, zupełnie przeciwstawne w efekcie."
  },
  {
    "type": "definition",
    "term": "Palm muting (P.M.)",
    "text": "Delikatnie opierasz krawędź dłoni prawej ręki na strunach tuż przy mostku, jednocześnie grając. Dźwięk staje się stłumiony, „chrupiący” — charakterystyczny dla rocka i metalu.",
    "note": "Zbyt mocny nacisk całkowicie wygłuszy strunę. Chodzi o lekki dotyk, nie dociśnięcie."
  },
  {
    "type": "definition",
    "term": "Legato: hammer-on i pull-off",
    "text": "**Hammer-on** — uderzasz palcem lewej ręki w wyższy próg tej samej struny, bez ponownego szarpnięcia jej prawą ręką. **Pull-off** — odwrotnie: masz strunę dociśniętą na wyższym progu, zdejmujesz palec (lekko „szarpiąc” w bok), a struna brzmi niżej.",
    "note": "Legato brzmi płynniej i szybciej niż granie każdej nuty osobno."
  },
  {
    "type": "tab",
    "title": "Ćwiczenie: hammer-on i pull-off",
    "tabText": "e|---5h7---7p5---|\nB|---------------|\nG|---------------|\nD|---------------|\nA|---------------|\nE|---------------|",
    "caption": "Zagraj 5. próg, „uderz” 7. (hammer-on) — bez szarpania struny drugi raz. Potem dociśnij 7. i 5. próg naraz i zdejmij palec z 7. (pull-off), zostawiając brzmieć 5."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Legato wymaga **mocnego** i **precyzyjnego** uderzenia palcem — zbyt delikatne stuknięcie da cichy, niewyraźny dźwięk. To technika, która wymaga siły w palcach lewej ręki, nie tylko zręczności."
  },
  {
    "type": "quiz",
    "question": "Grasz palm muting, ale struny brzmią całkowicie głucho, bez żadnego dźwięku. Co poprawić?",
    "options": ["Dociskać mocniej dłonią", "Zmniejszyć nacisk krawędzi dłoni — dotyk powinien być lekki", "Przestać grać tę technikę", "Zmienić strojenie"],
    "correctIndex": 1,
    "explanation": "Zbyt mocny nacisk dłonią całkowicie wygłusza struny. Palm muting to lekki, delikatny dotyk tuż przy mostku, nie dociśnięcie."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'techniki-gry'),
  'bend-tapping-sweep',
  'Bend, tapping i sweep picking',
  'Trzy zaawansowane techniki do rozpoznania w nagraniach, zanim jeszcze je opanujesz.',
  6, 2,
  $content$[
  {
    "type": "intro",
    "text": "Trzy zaawansowane techniki, które warto znać, nawet jeśli opanujesz je dopiero za miesiące — żeby rozpoznawać je w nagraniach i wiedzieć, w którą stronę rozwijać technikę."
  },
  {
    "type": "definition",
    "term": "Bend (naciąganie struny)",
    "text": "Dociskasz strunę do progu i przesuwasz palcem w bok (zwykle w górę, w stronę sufitu gitary), podnosząc napięcie struny i wysokość dźwięku — bez zmiany progu.",
    "note": "Pełny bend („full bend”) podnosi dźwięk o cały ton, czyli tyle, ile dałoby przesunięcie o 2 progi."
  },
  {
    "type": "definition",
    "term": "Tapping",
    "text": "Zamiast szarpać struny prawą ręką, **stukasz** palcem (zwykle wskazującym) bezpośrednio w próg gryfu, generując dźwięk uderzeniem — jak bardzo energiczny hammer-on wykonywany też prawą ręką. Pozwala grać bardzo szybkie, szerokie frazy."
  },
  {
    "type": "definition",
    "term": "Sweep picking",
    "text": "Kostka „zamiata” przez kilka sąsiednich strun jednym płynnym ruchem, podczas gdy lewa ręka zmienia palce na każdej strunie w tym samym tempie — daje efekt bardzo szybkiego, „spływającego” arpeggio.",
    "note": "To jedna z trudniejszych technik gitarowych — wymaga precyzyjnej synchronizacji obu rąk."
  },
  {
    "type": "table",
    "title": "Kiedy która technika",
    "headers": ["Technika", "Typowy gatunek", "Efekt"],
    "rows": [
      ["Bend", "Blues, rock", "Śpiewny, „płaczący” dźwięk"],
      ["Tapping", "Rock, metal, fusion", "Bardzo szybkie, szerokie frazy"],
      ["Sweep picking", "Metal, neoklasyka", "Szybkie arpeggio na kilku strunach"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie musisz uczyć się tych technik w kolejności z tej lekcji. Zacznij od tej, która brzmi w piosenkach, które **chcesz** umieć zagrać — motywacja z konkretnego utworu uczy szybciej niż ćwiczenie techniki w oderwaniu od muzyki."
  },
  {
    "type": "quiz",
    "question": "W tabulaturze widzisz strzałkę w górę przy liczbie, np. `7^`. Jaką to najpewniej technikę oznacza?",
    "options": ["Slide", "Bend", "Palm muting", "Sweep picking"],
    "correctIndex": 1,
    "explanation": "Strzałka w górę przy numerze progu to powszechny zapis bend — naciągnięcia struny podnoszącego wysokość dźwięku."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();
