-- ============================================================================
-- supabase/seed/gitara/05_teoria_b_gamy_interwaly.sql
-- Dział 6, partia B: oktawa, gamy dur/moll, interwały, harmoniczne i flażolety, koło kwintowe, skale pentatoniczne i bluesowe (7 lekcji).
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
  'oktawa-i-skala-chromatyczna',
  'Oktawa i skala chromatyczna',
  'Skąd bierze się oktawa, jak ją nazwać i opisać na gryfie oraz czym jest skala chromatyczna i całotonowa.',
  8, 9,
  $content$[
  {
    "type": "intro",
    "text": "Dźwięk to fala, a jego wysokość zależy od **częstotliwości** — od tego, ile razy na sekundę fala dociera do ucha. Muzycy rzadko mówią o liczbach; dają dźwiękom nazwy (A, C, F♯…). Dźwięk o częstotliwości 440 drgań na sekundę nazywa się po prostu **A**."
  },
  {
    "type": "definition",
    "term": "Oktawa",
    "text": "Dźwięk o **dwa razy wyższej częstotliwości** brzmi tak, jakby był tym samym dźwiękiem, tylko wyżej. Taka odległość to **oktawa**. Dźwięki oddalone o oktawę mają **tę samą nazwę**: oktawa wyżej lub niżej od C to znowu C, oktawa od F♯ to F♯.",
    "note": "Dlatego zwykle mówimy po prostu „dźwięk G”, bez podawania oktawy: gama G-dur jest ta sama w każdej oktawie."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Oktawa to **12 progów**. Pusta struna A brzmi 110 Hz, a ta sama struna zagrana na 12. progu — 220 Hz, czyli dwa razy wyżej. Dźwięk na 12. progu ma więc tę samą nazwę co pusta struna: na gryfie wszystko po 12. progu powtarza się od początku."
  },
  {
    "type": "definition",
    "term": "Nazwy oktaw",
    "text": "Aby wskazać konkretną oktawę, używa się cyfry: w tzw. **zapisie naukowym** dźwięk C w danej oktawie ma numer, a od C do następnego C ciągnie się jedna oktawa. **Środkowe C** to C4. Poza tym spotkasz zapis Helmholtza (C wielkie, c małe, c jednokreślne), używany głównie w podręcznikach teorii."
  },
  {
    "type": "table",
    "headers": [
      "Struna",
      "Nazwa",
      "Dźwięk (zapis naukowy)",
      "Częstotliwość"
    ],
    "rows": [
      [
        "6. (najgrubsza)",
        "E",
        "E2",
        "ok. 82 Hz"
      ],
      [
        "5.",
        "A",
        "A2",
        "110 Hz"
      ],
      [
        "4.",
        "D",
        "D3",
        "ok. 147 Hz"
      ],
      [
        "3.",
        "G",
        "G3",
        "ok. 196 Hz"
      ],
      [
        "2.",
        "B",
        "B3",
        "ok. 247 Hz"
      ],
      [
        "1. (najcieńsza)",
        "e",
        "E4",
        "ok. 330 Hz"
      ]
    ],
    "title": "Struny gitary w zapisie naukowym",
    "caption": "Gitara w nutach jest zapisana o oktawę wyżej (patrz lekcja o kluczach), ale brzmi tak, jak w tej tabeli. Dwie skrajne struny to ten sam dźwięk E dwie oktawy od siebie."
  },
  {
    "type": "definition",
    "term": "Oktawa i osiem dźwięków",
    "text": "Słowo „oktawa” pochodzi od łacińskiego „osiem”, choć częstotliwość podwaja się, a nie rośnie ośmiokrotnie. Nazwę nadali muzycy, którzy patrzyli na podział oktawy na **gamę**: w muzyce zachodniej oktawę dzieli się na **dwanaście** równo rozmieszczonych dźwięków, z których w gamie durowej i molowej używa się siedmiu. Dodaj pierwszy dźwięk następnej oktawy („do-re-mi-fa-sol-la-si-do”) i masz osiem dźwięków. To jest **skala diatoniczna** — podstawa większości muzyki zachodniej."
  },
  {
    "type": "table",
    "headers": [
      "Odległość",
      "Półtony (progi)",
      "Całe tony"
    ],
    "rows": [
      [
        "C → C♯",
        "1",
        "½"
      ],
      [
        "C → D",
        "2",
        "1"
      ],
      [
        "C → E",
        "4",
        "2"
      ],
      [
        "C → F",
        "5",
        "2½"
      ],
      [
        "C → G",
        "7",
        "3½"
      ],
      [
        "C → C (oktawa)",
        "12",
        "6"
      ]
    ],
    "title": "Liczenie półtonów i tonów",
    "caption": "Licz wszystkie dźwięki pośrednie, także te z krzyżykami i bemolami (czarne klawisze). Na gryfie: każdy próg to jeden półton."
  },
  {
    "type": "definition",
    "term": "Skala chromatyczna",
    "text": "Skala, która biegnie **same półtonami**, grając wszystkie dwanaście dźwięków oktawy. Na gitarze to po prostu kolejne progi jednej struny. Jest tylko jedna skala chromatyczna: zaczynając od dowolnego dźwięku, zagrasz te same dźwięki."
  },
  {
    "type": "tab",
    "title": "Skala chromatyczna na strunie E",
    "tabText": "e|-------------------|\nB|-------------------|\nG|-------------------|\nD|-------------------|\nA|-------------------|\nE|-0--1--2--3--4--5--|",
    "caption": "Pusta struna i pięć kolejnych progów: E – F – F♯ – G – G♯ – A. Każdy krok to półton. Kontynuuj aż do 12. progu, a trafisz w E o oktawę wyżej."
  },
  {
    "type": "definition",
    "term": "Skala całotonowa",
    "text": "Skala złożona **wyłącznie z całych tonów** (na gitarze — co dwa progi). Ani ona, ani skala chromatyczna nie mają dźwięku „najważniejszego” (tonika), bo wszystkie odstępy są jednakowe — dlatego brzmią „unoszącym się” i mało „domowo”. Zwykła muzyka używa gam durowych i molowych, a skali całotonowej chętnie sięgają kompozytorzy, którzy nie chcą środka tonalnego.",
    "note": "Są dwie różne skale całotonowe (żadna nie zawiera dźwięków drugiej)."
  },
  {
    "type": "tab",
    "title": "Skala całotonowa na strunie A",
    "tabText": "e|----------------------|\nB|----------------------|\nG|----------------------|\nD|----------------------|\nA|-0--2--4--6--8--10-12-|\nE|----------------------|",
    "caption": "Co dwa progi: A – B – C♯ – D♯ – F – G – A. Porównaj z poprzednim zapisem i posłuchaj różnicy: ta skala brzmi „rozmyta”."
  },
  {
    "type": "fretboard-explorer",
    "title": "Znajdź wszystkie E",
    "targetNote": "E",
    "frets": 12,
    "caption": "Dźwięk E leży na gryfie w wielu miejscach — pary oddalone o 12 progów to ten sam dźwięk o oktawę wyżej."
  },
  {
    "type": "quiz",
    "question": "Ile razy wyższa jest częstotliwość dźwięku o oktawę wyższego?",
    "options": [
      "1,5 raza",
      "2 razy",
      "4 razy",
      "8 razy"
    ],
    "correctIndex": 1,
    "explanation": "Oktawa to stosunek częstotliwości 2:1. Nazwa pochodzi od ośmiu dźwięków gamy, nie od ośmiokrotnego wzrostu."
  },
  {
    "type": "quiz",
    "question": "Ile progów na gitarze to oktawa?",
    "options": [
      "5",
      "7",
      "10",
      "12"
    ],
    "correctIndex": 3,
    "explanation": "Oktawa to dwanaście półtonów, czyli 12 progów. Dźwięk na 12. progu ma tę samą nazwę co pusta struna."
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
  'gama-durowa',
  'Gama durowa',
  'Wzór tonów i półtonów, który daje jasne, „wesołe” brzmienie, oraz jak go użyć na gryfie w dowolnej tonacji.',
  9, 10,
  $content$[
  {
    "type": "intro",
    "text": "Proste piosenki, które śpiewaliśmy w dzieciństwie, wesoła muzyka pop i rock, ludowe melodie — większość z nich jest w **tonacji durowej**. Brzmi jasno, optymistycznie, pewnie. Źródłem tego brzmienia są dwa elementy: **akordy durowe**, zbudowane z dźwięków tej tonacji, i silne poczucie **środka tonalnego**, czyli dźwięku, który jest „domem”."
  },
  {
    "type": "definition",
    "term": "Tonika",
    "text": "Gama zaczyna się od dźwięku, który nazywa tonację: to **tonika** (środek tonalny), dźwięk, na którym muzyka „odpoczywa”. To „do” z „do-re-mi”. Muzyka w A-dur prawie zawsze kończy się akordem A-dur, często od niego zaczyna i regularnie do niego wraca."
  },
  {
    "type": "definition",
    "term": "Gama durowa",
    "text": "Od toniki idź w górę według wzoru: **ton – ton – półton – ton – ton – ton – półton**. Dojdziesz do toniki oktawę wyżej, a po drodze wypiszesz wszystkie dźwięki tej tonacji."
  },
  {
    "type": "table",
    "headers": [
      "Stopień",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "rows": [
      [
        "Odstęp do następnego",
        "T",
        "T",
        "P",
        "T",
        "T",
        "T",
        "P",
        "—"
      ]
    ],
    "title": "Wzór gamy durowej",
    "caption": "T = cały ton (2 półtony, 2 progi), P = półton (1 półton, 1 próg). Półtony wypadają między 3. i 4. oraz 7. i 8. stopniem."
  },
  {
    "type": "table",
    "headers": [
      "Tonacja",
      "Dźwięki gamy",
      "Znaki"
    ],
    "rows": [
      [
        "C-dur",
        "C D E F G A B",
        "brak"
      ],
      [
        "G-dur",
        "G A B C D E F♯",
        "F♯"
      ],
      [
        "D-dur",
        "D E F♯ G A B C♯",
        "F♯, C♯"
      ],
      [
        "A-dur",
        "A B C♯ D E F♯ G♯",
        "F♯, C♯, G♯"
      ],
      [
        "E-dur",
        "E F♯ G♯ A B C♯ D♯",
        "F♯, C♯, G♯, D♯"
      ],
      [
        "F-dur",
        "F G A B♭ C D E",
        "B♭"
      ],
      [
        "B♭-dur",
        "B♭ C D E♭ F G A",
        "B♭, E♭"
      ]
    ],
    "title": "Kilka gam durowych",
    "caption": "Wszystkie mają ten sam wzór odstępów — różnią się tylko dźwiękami, bo wzór zaczyna się od innej toniki. Krzyżyki i bemole stoją w znakach przykluczowych (lekcja o tonacjach)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Pamiętaj o literach.** W zapisie gama durowa nie pomija ani nie powtarza żadnej linii i przestrzeni: siedem kolejnych liter, każda raz. Dlatego w gamie B♭-dur masz E♭, a nie D♯ — po D musi nastąpić litera E."
  },
  {
    "type": "steps",
    "title": "Jak zbudować gamę durową",
    "steps": [
      {
        "title": "Wybierz tonikę",
        "text": "Np. D. To pierwszy dźwięk i nazwa tonacji."
      },
      {
        "title": "Idź według wzoru T-T-P-T-T-T-P",
        "text": "D → (ton) E → (ton) F♯ → (półton) G → (ton) A → (ton) B → (ton) C♯ → (półton) D."
      },
      {
        "title": "Sprawdź litery",
        "text": "D E F♯ G A B C♯ D — każda litera raz, w kolejności. Jeśli któraś się powtórzy, wynik jest źle zapisany enharmonicznie."
      }
    ]
  },
  {
    "type": "tab",
    "title": "Gama C-dur w pierwszej pozycji",
    "tabText": "e|-------------------------|\nB|----------------------1--|\nG|----------------2--4-----|\nD|-------2--3--5-----------|\nA|-3--5--------------------|\nE|-------------------------|",
    "caption": "C – D – E – F – G – A – B – C od 3. progu struny A do 1. progu struny B. Półtony (E–F i B–C) to sąsiednie progi — dokładnie tak jak we wzorze."
  },
  {
    "type": "tab",
    "title": "Wzór gamy durowej na jednej strunie",
    "tabText": "e|-------------------------|\nB|-------------------------|\nG|-------------------------|\nD|-------------------------|\nA|-0--2--4--5--7--9--11-12-|\nE|-------------------------|",
    "caption": "Progi 0-2-4-5-7-9-11-12 to wzór T-T-P-T-T-T-P. Zaczynając od dowolnego progu tej samej struny (i odliczając od niego), zagrasz gamę durową zaczynającą się na tym dźwięku."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Po co tonacje, skoro brzmią tak samo?** Wszystkie gamy durowe mają ten sam wzór, więc ta sama melodia w D-dur i w F-dur różni się tylko wysokością. Dawniej, przed stosowaniem stroju równomiernie temperowanego, tonacje brzmiały wyraźnie inaczej; dziś o tonacji decyduje głównie to, **w której łatwiej zaśpiewać lub zagrać**. Gitarzyści lubią C, G, D, A i E (dużo akordów z pustymi strunami); resztę ratuje kapodaster."
  },
  {
    "type": "fretboard-explorer",
    "title": "Znajdź wszystkie G (tonika G-dur)",
    "targetNote": "G",
    "frets": 12,
    "caption": "Znajdź G — tonikę gamy G-dur. Od każdego z nich możesz zagrać gamę wzorem T-T-P-T-T-T-P."
  },
  {
    "type": "quiz",
    "question": "Jaki jest wzór odstępów w gamie durowej (od toniki w górę)?",
    "options": [
      "T-P-T-T-P-T-T",
      "T-T-P-T-T-T-P",
      "P-T-T-T-P-T-T",
      "T-T-T-P-T-T-P"
    ],
    "correctIndex": 1,
    "explanation": "Gama durowa: ton, ton, półton, ton, ton, ton, półton. Wzór z pierwszej odpowiedzi to gama molowa naturalna."
  },
  {
    "type": "quiz",
    "question": "Który dźwięk jest 7. stopniem gamy G-dur?",
    "options": [
      "F",
      "F♯",
      "G♯",
      "E"
    ],
    "correctIndex": 1,
    "explanation": "G-dur: G A B C D E F♯. Siódmy stopień to F♯ — półton pod toniką, stąd jedyny krzyżyk w tej tonacji."
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
  'gama-molowa',
  'Gama molowa',
  'Gama molowa naturalna, harmoniczna i melodyczna, tonacje paralelne oraz dorycka — skala jazzowego „moll”.',
  9, 11,
  $content$[
  {
    "type": "intro",
    "text": "Każda tonacja durowa używa innego zestawu dźwięków, ale zawsze układa je w ten sam wzór, więc wszystkie brzmią podobnie. **Tonacja molowa** ma inny wzór odstępów, a przez to **inny charakter**: poważniejszy, smutniejszy, tajemniczy, czasem złowieszczy. Nie da się więc przenieść utworu z C-dur do d-moll (ani nawet do c-moll), nie zmieniając jego nastroju."
  },
  {
    "type": "definition",
    "term": "Gama molowa naturalna",
    "text": "Z toniki w górę: **ton – półton – ton – ton – półton – ton – ton**. Powstaje, gdy zagrasz wszystkie dźwięki ze znaków przykluczowych tonacji molowej."
  },
  {
    "type": "table",
    "headers": [
      "Stopień",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "rows": [
      [
        "Gama durowa",
        "T",
        "T",
        "P",
        "T",
        "T",
        "T",
        "P",
        "—"
      ],
      [
        "Gama molowa naturalna",
        "T",
        "P",
        "T",
        "T",
        "P",
        "T",
        "T",
        "—"
      ]
    ],
    "title": "Dur i moll obok siebie",
    "caption": "Wzór molowy to ten sam układ co durowy, ale rozpoczęty w innym miejscu — dlatego tonacje paralelne mają wspólne znaki przykluczowe."
  },
  {
    "type": "definition",
    "term": "Tonacja paralelna",
    "text": "Tonacja molowa ma te same znaki przykluczowe co jakaś durowa — to jej **paralelny dur** (po angielsku „relative major”). Mimo wspólnych znaków brzmią inaczej, bo mają inny środek tonalny. Paralelny dur leży **trzy półtony wyżej** od moll: a-moll ↔ C-dur, e-moll ↔ G-dur, c-moll ↔ E♭-dur.",
    "note": "Dlatego jeśli zagrasz gamę C-dur od dźwięku A, zagrasz gamę a-moll naturalną."
  },
  {
    "type": "table",
    "headers": [
      "Gama a-moll",
      "Dźwięki",
      "Zmiana względem naturalnej"
    ],
    "rows": [
      [
        "Naturalna",
        "A B C D E F G A",
        "—"
      ],
      [
        "Harmoniczna",
        "A B C D E F G♯ A",
        "podniesiony 7. stopień (w górę i w dół)"
      ],
      [
        "Melodyczna (w górę)",
        "A B C D E F♯ G♯ A",
        "podniesione 6. i 7. stopień"
      ],
      [
        "Melodyczna (w dół)",
        "A G F E D C B A",
        "taka sama jak naturalna"
      ]
    ],
    "title": "Trzy rodzaje gamy molowej",
    "caption": "Harmoniczna ma podwyższony siódmy stopień, bo akordy w moll często go używają, żeby wyraźniej prowadzić do toniki. Melodyczna ma podwyższone 6. i 7. stopień tylko w górę, bo melodie w moll często tak się wznoszą."
  },
  {
    "type": "tab",
    "title": "Gama a-moll naturalna",
    "tabText": "e|-------------------------|\nB|-------------------------|\nG|-------------------------|\nD|-------------------5--7--|\nA|----------5--7--8--------|\nE|-5--7--8-----------------|",
    "caption": "A – B – C – D – E – F – G – A od 5. progu struny E do 7. progu struny D. To ten sam zestaw dźwięków co gama C-dur w poprzedniej lekcji, ale zaczęty od A."
  },
  {
    "type": "tab",
    "title": "Wzór gamy molowej na jednej strunie",
    "tabText": "e|-------------------------|\nB|-------------------------|\nG|-------------------------|\nD|-------------------------|\nA|-0--2--3--5--7--8--10-12-|\nE|-------------------------|",
    "caption": "Progi 0-2-3-5-7-8-10-12 to wzór T-P-T-T-P-T-T. Przesuń początek na inny próg, a zagrasz gamę molową na innej tonice."
  },
  {
    "type": "definition",
    "term": "Dorycka (jazzowe „moll”)",
    "text": "Jazz zna także inne skale oparte na modach kościelnych. Jedna z najużyteczniejszych — **dorycka** — nazywana jest „dorycka moll”, bo ma zasadniczo molowe brzmienie. Od gamy molowej naturalnej różni się **jednym dźwiękiem** (podwyższona 6. nuta), np. D dorycka: D E F G A **B** C (D naturalne moll miałoby B♭).",
    "note": "D dorycka ma te same znaki co C-dur: jej „paralelny dur” leży o cały ton niżej. Dlatego dorycka służy do improwizacji nad akordem ii (np. Dm w tonacji C-dur)."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Jak rozpoznać dur od moll ze słuchu?** Dur brzmi jasno i pewnie, moll — smutniej i poważniej. Posłuchaj piosenek, które znasz, i spróbuj je oceniać. Wsparciem jest zwykle ostatni akord utworu, który najczęściej nazywa tonację."
  },
  {
    "type": "quiz",
    "question": "Jaka jest paralelna tonacja molowa do G-dur?",
    "options": [
      "g-moll",
      "e-moll",
      "a-moll",
      "d-moll"
    ],
    "correctIndex": 1,
    "explanation": "Paralelny moll leży o trzy półtony niżej od duru: G → E. G-dur i e-moll mają wspólny znak (F♯)."
  },
  {
    "type": "quiz",
    "question": "Który stopień jest podwyższony w gamie molowej harmonicznej względem naturalnej?",
    "options": [
      "3.",
      "5.",
      "6.",
      "7."
    ],
    "correctIndex": 3,
    "explanation": "Gama harmoniczna ma podniesiony siódmy stopień (w a-moll G♯ zamiast G)."
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
  'interwaly',
  'Interwały',
  'Odległość między dźwiękami: jak ją nazwać (pryma, tercja, kwinta…), jakie bywa jej „rodzaj” i jak interwały wyglądają na gryfie.',
  10, 12,
  $content$[
  {
    "type": "intro",
    "text": "**Interwał** to odległość między dwoma dźwiękami — o ile jeden jest wyższy od drugiego. Bez tego pojęcia trudno mówić o gamach, akordach, kadencjach czy dysonansach, więc to jedna z najważniejszych lekcji teorii. Fizycy opisują interwał różnicą częstotliwości; muzycy — nazwą."
  },
  {
    "type": "steps",
    "title": "Jak nazwać interwał",
    "steps": [
      {
        "title": "1. Policz stopnie",
        "text": "Policz wszystkie linie i przestrzenie od jednego dźwięku do drugiego, **włącznie z oboma**. B–D to **tercja** (B, C, D), A–F to **seksta**. Klucz, znaki i krzyżyki nie mają tu znaczenia."
      },
      {
        "title": "2. Określ rodzaj",
        "text": "Teraz policz **półtony**: tercja złożona z trzech półtonów brzmi inaczej niż z czterech. Tu liczą się krzyżyki i bemole (znaki przykluczowe, przygodne)."
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Liczba",
      "Nazwa",
      "Liczba",
      "Nazwa"
    ],
    "rows": [
      [
        "1",
        "pryma",
        "5",
        "kwinta"
      ],
      [
        "2",
        "sekunda",
        "6",
        "seksta"
      ],
      [
        "3",
        "tercja",
        "7",
        "septyma"
      ],
      [
        "4",
        "kwarta",
        "8",
        "oktawa"
      ]
    ],
    "title": "Nazwy interwałów prostych",
    "caption": "Interwały większe od oktawy to **złożone**: nona (9), decyma (10), undecyma (11) itd."
  },
  {
    "type": "definition",
    "term": "Czyste interwały",
    "text": "**Pryma, kwarta, kwinta i oktawa** mogą być **czyste** — to interwały, w których dźwięki są ze sobą szczególnie blisko spokrewnione (stosunek częstotliwości to małe liczby), więc brzmią „czysto”. Nigdy nie nazywa się ich wielkimi ani małymi. Czysta kwarta ma **5 półtonów**, czysta kwinta — **7**, oktawa — **12**."
  },
  {
    "type": "definition",
    "term": "Wielkie i małe",
    "text": "**Sekundy, tercje, seksty i septymy** mogą być **wielkie** albo **małe**; mała jest zawsze o półton mniejsza od wielkiej."
  },
  {
    "type": "definition",
    "term": "Zwiększone i zmniejszone",
    "text": "Interwał o półton większy od czystego lub wielkiego jest **zwiększony**, o półton mniejszy od czystego lub małego — **zmniejszony**. Czasem do poprawnego zapisu trzeba podwójnego krzyżyka lub bemola. Liczy się faktyczna liczba półtonów, nie to, czy dźwięki zapisano jako naturalne, z krzyżykiem czy z bemolem."
  },
  {
    "type": "table",
    "headers": [
      "Półtony",
      "Interwał (skrót)",
      "Przykład od C"
    ],
    "rows": [
      [
        "0",
        "pryma czysta (P1)",
        "C – C"
      ],
      [
        "1",
        "sekunda mała (m2)",
        "C – D♭"
      ],
      [
        "2",
        "sekunda wielka (M2)",
        "C – D"
      ],
      [
        "3",
        "tercja mała (m3)",
        "C – E♭"
      ],
      [
        "4",
        "tercja wielka (M3)",
        "C – E"
      ],
      [
        "5",
        "kwarta czysta (P4)",
        "C – F"
      ],
      [
        "6",
        "tryton: kwarta zwiększona (A4) = kwinta zmniejszona (d5)",
        "C – F♯ / G♭"
      ],
      [
        "7",
        "kwinta czysta (P5)",
        "C – G"
      ],
      [
        "8",
        "seksta mała (m6)",
        "C – A♭"
      ],
      [
        "9",
        "seksta wielka (M6)",
        "C – A"
      ],
      [
        "10",
        "septyma mała (m7)",
        "C – B♭"
      ],
      [
        "11",
        "septyma wielka (M7)",
        "C – B"
      ],
      [
        "12",
        "oktawa czysta (P8)",
        "C – C"
      ]
    ],
    "title": "Interwały i ich liczba półtonów",
    "caption": "Tryton (6 półtonów, trzy całe tony) nie da się zapisać jako wielki, mały ani czysty. W muzyce zachodniej uchodzi za szczególnie „napięty” i chce się rozwiązywać do innego interwału."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Zawsze nazywaj interwał tak, jak jest zapisany.** Ten sam dźwięk można zapisać różnie (enharmonia): tercja wielka bywa zapisana jako kwarta zmniejszona, a sekunda mała jako pryma zwiększona. Kompozytor miał powód: zapis pokazuje, jak dźwięki wchodzą w skład akordu i tonacji."
  },
  {
    "type": "definition",
    "term": "Odwracanie interwału",
    "text": "Przenieś jeden z dźwięków o oktawę, tak żeby wyższy stał się niższym (i odwrotnie) — dostajesz **odwrócenie** interwału. Nazwę nowego interwału liczysz jako **9 minus stara liczba**: tercja ↔ seksta, kwarta ↔ kwinta, sekunda ↔ septyma. Czysty zostaje czysty, **wielki** staje się **małym** (i odwrotnie), **zwiększony** staje się **zmniejszonym**.",
    "note": "Przykład: tercja wielka (C–E) odwrócona to seksta mała (E–C). Czysta kwinta odwrócona to czysta kwarta."
  },
  {
    "type": "table",
    "headers": [
      "Interwał",
      "Odwrócenie"
    ],
    "rows": [
      [
        "tercja wielka",
        "seksta mała"
      ],
      [
        "kwinta czysta",
        "kwarta czysta"
      ],
      [
        "seksta wielka",
        "tercja mała"
      ],
      [
        "septyma wielka",
        "sekunda mała"
      ],
      [
        "kwarta zwiększona",
        "kwinta zmniejszona"
      ]
    ],
    "title": "Przykłady odwróceń"
  },
  {
    "type": "table",
    "headers": [
      "Interwał",
      "Jak go zagrać na gitarze"
    ],
    "rows": [
      [
        "Półtony na jednej strunie",
        "Liczba progów = liczba półtonów (np. 7 progów = kwinta czysta, 12 = oktawa)"
      ],
      [
        "Dwa dźwięki na **tym samym progu** sąsiednich strun",
        "**kwarta czysta** (5 półtonów) — dla par E–A, A–D, D–G, B–e. Wyjątek: G–B to **tercja wielka** (4 półtony)"
      ],
      [
        "Kwinta czysta",
        "Struna 6 próg x + struna 5 próg x+2 (np. **power chord**): E pusta + A na 2. progu to E–B"
      ],
      [
        "Oktawa",
        "Struna 6 próg x + struna 4 próg x+2 (np. pusta E i D na 2. progu — E o oktawę wyżej)"
      ]
    ],
    "title": "Interwały na gryfie",
    "caption": "Nauczysz się je rozpoznawać po „kształcie” na gryfie. Zagraj każdy z nich i słuchaj: tercja wielka jest jasna, tercja mała smutna, kwinta czysta „pusta i mocna”."
  },
  {
    "type": "tab",
    "title": "Kwinta i oktawa od pustej struny E",
    "tabText": "e|----------------|\nB|----------------|\nG|----------------|\nD|-------------2--|\nA|----2-----------|\nE|-0--------0-----|",
    "caption": "Po lewej: E z A na 2. progu — kwinta czysta (E–B). Po prawej: E z D na 2. progu — oktawa (E–E). Takie „kształty” przesuwasz po gryfie razem."
  },
  {
    "type": "quiz",
    "question": "Ile półtonów ma kwinta czysta?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "correctIndex": 2,
    "explanation": "Kwarta czysta to 5 półtonów, tryton to 6, a kwinta czysta — 7."
  },
  {
    "type": "quiz",
    "question": "Odwrócenie tercji wielkiej to…",
    "options": [
      "sekunda mała",
      "seksta mała",
      "seksta wielka",
      "kwarta czysta"
    ],
    "correctIndex": 1,
    "explanation": "9 – 3 = 6, więc seksta, a wielki interwał po odwróceniu staje się małym: seksta mała."
  },
  {
    "type": "quiz",
    "question": "Dwa dźwięki na tym samym progu strun D i G brzmią jako…",
    "options": [
      "tercja wielka",
      "kwarta czysta",
      "kwinta czysta",
      "oktawa"
    ],
    "correctIndex": 1,
    "explanation": "Sąsiednie struny są odstrojone o kwartę czystą (5 półtonów), wyjątek to G–B (tercja wielka)."
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
  'harmoniczne-i-flazolety',
  'Harmoniczne i flażolety',
  'Dlaczego interwały brzmią tak, a nie inaczej: stosunki częstotliwości, szereg harmoniczny i flażolety na gitarze.',
  8, 13,
  $content$[
  {
    "type": "intro",
    "text": "Nazwy interwałów i ich zapis to wynik długiej historii notacji. Ale **brzmienie** interwałów nie jest przypadkiem: wynika z fizyki dźwięku. Każdy interwał to **stosunek częstotliwości** — tak jak oktawa to 2:1."
  },
  {
    "type": "definition",
    "term": "Szereg harmoniczny",
    "text": "Gdy gra struna (albo słup powietrza), brzmi nie tylko dźwięk podstawowy, ale i **alikwoty**: dźwięki o częstotliwościach 2×, 3×, 4×… większych od podstawowej. Ten zestaw to **szereg harmoniczny**. Różne proporcje alikwotów dają różną barwę dźwięku."
  },
  {
    "type": "table",
    "headers": [
      "Nr harmonicznej",
      "Częstotliwość",
      "Interwał od dźwięku podstawowego"
    ],
    "rows": [
      [
        "1",
        "1×",
        "dźwięk podstawowy"
      ],
      [
        "2",
        "2×",
        "oktawa"
      ],
      [
        "3",
        "3×",
        "oktawa + kwinta czysta"
      ],
      [
        "4",
        "4×",
        "dwie oktawy"
      ],
      [
        "5",
        "5×",
        "dwie oktawy + tercja wielka"
      ],
      [
        "6",
        "6×",
        "dwie oktawy + kwinta czysta"
      ]
    ],
    "title": "Pierwsze harmoniczne",
    "caption": "Dla podstawowego C: C – C – G – C – E – G. Dlatego trzy pierwsze różne dźwięki szeregu (C, E, G) tworzą akord durowy."
  },
  {
    "type": "table",
    "headers": [
      "Interwał",
      "Stosunek częstotliwości"
    ],
    "rows": [
      [
        "oktawa",
        "2 : 1"
      ],
      [
        "kwinta czysta",
        "3 : 2"
      ],
      [
        "kwarta czysta",
        "4 : 3"
      ],
      [
        "tercja wielka",
        "5 : 4"
      ],
      [
        "tercja mała",
        "6 : 5"
      ]
    ],
    "title": "Stosunki częstotliwości interwałów",
    "caption": "Im mniejsze liczby, tym bardziej „spokrewnione” dźwięki — stąd nazwa „czyste” dla oktawy, kwinty i kwarty. Interwały, które w szeregu leżą dalej (wyższe harmoniczne), mają skomplikowane stosunki i brzmią mniej „czysto”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Strój równomiernie temperowany.** Dzisiejsza muzyka zachodnia dzieli oktawę na 12 **równych** półtonów, dzięki czemu instrument (gitara, pianino) jest równie „czysty” w każdej tonacji. Ceną jest to, że **wszystkie interwały poza oktawą są odrobinę „rozstrojone”** względem szeregu harmonicznego (np. tercja wielka jest nieco wyższa niż „czysta” 5:4). Chór a cappella i zespoły dęte blaszane często „wracają” do czystych interwałów, bo mogą tak stroić na bieżąco."
  },
  {
    "type": "definition",
    "term": "Flażolet (harmoniczna naturalna)",
    "text": "Na instrumentach strunowych zwykle dociskasz strunę, skracając jej drgającą część. **Flażolet** wydobywasz inaczej: dotykasz struny **bardzo lekko** w miejscu, gdzie jedna z niższych harmonicznych ma **węzeł** (miejsce, w którym struna się nie rusza). Lekki dotyk wygasza wszystkie drgania bez węzła w tym punkcie, więc zostaje cichszy, cieńszy, „dzwoneczkowy” dźwięk.",
    "note": "W większości miejsc na strunie lekkie dotknięcie nie da żadnego dźwięku — działa tylko tam, gdzie jest węzeł jednej z niższych harmonicznych."
  },
  {
    "type": "table",
    "headers": [
      "Próg",
      "Harmoniczna",
      "Interwał od pustej struny"
    ],
    "rows": [
      [
        "12.",
        "2.",
        "oktawa"
      ],
      [
        "7. (i 19.)",
        "3.",
        "oktawa + kwinta czysta"
      ],
      [
        "5. (i 24.)",
        "4.",
        "dwie oktawy"
      ],
      [
        "4. (i 9., 16.)",
        "5.",
        "dwie oktawy + tercja wielka"
      ]
    ],
    "title": "Flażolety naturalne na gitarze",
    "caption": "Dotknij struny lewą ręką lekko nad metalowym progiem (nie dociskaj do gryfu), szarp ją prawą i od razu zabierz palec. Najłatwiejszy jest flażolet na 12. progu, potem 7. i 5."
  },
  {
    "type": "steps",
    "title": "Jak zagrać flażolet na 12. progu",
    "steps": [
      {
        "title": "Połóż palec lewej ręki",
        "text": "Dotknij struny **bardzo lekko** dokładnie nad metalowym progiem (nie dociskaj do gryfu)."
      },
      {
        "title": "Uderz strunę",
        "text": "Prawą ręką szarp strunę zwykłym ruchem."
      },
      {
        "title": "Zabierz palec",
        "text": "Zaraz po uderzeniu oderwij palec — dźwięk powinien zadźwięczeć jak dzwoneczek, o oktawę wyżej niż pusta struna."
      }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Dźwięk flażoletu jest cichszy i cieńszy, bo w jego brzmieniu brakuje większości szeregu harmonicznego — zmienia się więc **barwa**. Gitarzyści używają go jako efektu. Flażolety służą też do strojenia: flażolet na 5. progu struny E i na 7. progu struny A to ten sam dźwięk (E), więc gdy brzmią równo, struny są dobrze nastrojone względem siebie."
  },
  {
    "type": "quiz",
    "question": "Jaki stosunek częstotliwości ma kwinta czysta?",
    "options": [
      "2:1",
      "3:2",
      "4:3",
      "5:4"
    ],
    "correctIndex": 1,
    "explanation": "Kwinta czysta to 3:2 (w szeregu: trzecia harmoniczna do drugiej). Oktawa to 2:1, kwarta czysta 4:3, tercja wielka 5:4."
  },
  {
    "type": "quiz",
    "question": "Flażolet na 12. progu brzmi…",
    "options": [
      "o oktawę wyżej niż pusta struna",
      "o kwintę wyżej niż pusta struna",
      "tak samo jak pusta struna",
      "dwie oktawy wyżej"
    ],
    "correctIndex": 0,
    "explanation": "Węzeł w połowie struny wydobywa drugą harmoniczną — oktawę wyżej od dźwięku podstawowego."
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
  'kolo-kwintowe',
  'Koło kwintowe',
  'Jak ułożyć tonacje, żeby widać było, które z nich są ze sobą spokrewnione, i skąd wziąć kolejność krzyżyków i bemoli.',
  7, 14,
  $content$[
  {
    "type": "intro",
    "text": "**Koło kwintowe** to sposób rozmieszczenia tonacji tak, żeby widać było, jak bliskie są sobie. Tonacje nie są „blisko”, gdy leżą obok siebie na klawiaturze, tylko gdy mają **podobne znaki przykluczowe**."
  },
  {
    "type": "definition",
    "term": "Idąc po kole",
    "text": "Gdy przechodzisz w koło **zgodnie z ruchem wskazówek**, idziesz o **kwintę czystą w górę**: dochodzi jeden krzyżyk (albo ubywa jednego bemola). **Przeciwnie do ruchu wskazówek** idziesz kwintę w dół, czyli kwartę w górę: dochodzi bemol (albo ubywa krzyżyka). Dlatego przeciwny kierunek bywa nazywany „kołem kwart”."
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
        "0",
        "C",
        "Am"
      ],
      [
        "1♯",
        "G",
        "Em"
      ],
      [
        "2♯",
        "D",
        "Bm"
      ],
      [
        "3♯",
        "A",
        "F♯m"
      ],
      [
        "4♯",
        "E",
        "C♯m"
      ],
      [
        "5♯",
        "B",
        "G♯m"
      ],
      [
        "6♯ / 6♭",
        "F♯ / G♭",
        "D♯m / E♭m"
      ],
      [
        "5♭",
        "D♭",
        "B♭m"
      ],
      [
        "4♭",
        "A♭",
        "Fm"
      ],
      [
        "3♭",
        "E♭",
        "Cm"
      ],
      [
        "2♭",
        "B♭",
        "Gm"
      ],
      [
        "1♭",
        "F",
        "Dm"
      ]
    ],
    "title": "Tonacje w kole kwintowym (zgodnie z ruchem wskazówek, od C)",
    "caption": "Po 12 krokach wracasz do C. U dołu koła (6 krzyżyków lub 6 bemoli) tonacje F♯ i G♭ brzmią tak samo — to tonacje enharmoniczne."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Kto jest „blisko”?** Najbliższa dla C-dur jest **a-moll** (ten sam znak przykluczowy — żadnych znaków). Dalej: **G-dur / e-moll** (jeden krzyżyk) i **F-dur / d-moll** (jeden bemol). Najdalsze są tonacje po przeciwnej stronie koła (6 krzyżyków lub 6 bemoli). Przykład: najbliższe D-dur to G-dur (1♯) i A-dur (3♯), a ich paralelne moll (h, e, fis) też są blisko."
  },
  {
    "type": "steps",
    "title": "Skąd kolejność krzyżyków i bemoli",
    "steps": [
      {
        "title": "Krzyżyki",
        "text": "Pierwszy krzyżyk to zawsze **F♯**, drugi — o kwintę wyżej, **C♯**, trzeci **G♯**, potem **D♯, A♯, E♯, B♯**. Każdy następny jest kwintę od poprzedniego."
      },
      {
        "title": "Bemole",
        "text": "Kolejność jest odwrotna: **B♭, E♭, A♭, D♭, G♭, C♭, F♭**. Każdy następny bemol leży o kwintę **niżej** od poprzedniego."
      },
      {
        "title": "Zasada ruchu",
        "text": "Idąc zgodnie z ruchem wskazówek, **dodajesz krzyżyk lub zabierasz bemol**. Przeciw wskazówkom — odwrotnie."
      }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze: sąsiedzi to akordy tonacji.** W kole kwintowym tonika, jej sąsiad po lewej (**IV stopień**) i po prawej (**V stopień**) tworzą trzy główne akordy tonacji. Przykład: w **G-dur** obok G leżą **C** (po lewej) i **D** (po prawej) — G, C, D to najpopularniejsze trzy akordy w tej tonacji. A paralelne moll (Em) leży „pod” G. To dlatego tyle piosenek gra się na G–C–D–Em."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Kapodaster.** Każdy próg to półton, a **kapodaster na 7. progu** przenosi tonację o kwintę w górę — czyli o jedno miejsce zgodnie z ruchem wskazówek. Kapodaster na 2. progu zmienia tonację o cały ton. Koło kwintowe pokazuje, jakie akordy zagrasz w nowej tonacji."
  },
  {
    "type": "quiz",
    "question": "Ile krzyżyków ma tonacja D-dur?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctIndex": 1,
    "explanation": "Od C idziesz o kwintę w górę do G (1♯), potem do D (2♯): F♯ i C♯."
  },
  {
    "type": "quiz",
    "question": "Które dwie tonacje durowe są najbliższe C-dur w kole kwintowym?",
    "options": [
      "D-dur i B♭-dur",
      "G-dur i F-dur",
      "E-dur i A♭-dur",
      "F♯-dur i B-dur"
    ],
    "correctIndex": 1,
    "explanation": "Jeden krok zgodnie z ruchem wskazówek to G-dur (1♯), jeden krok przeciwnie — F-dur (1♭). To dźwięki o kwintę i kwartę od C."
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
  'skale-pentatoniczne-i-bluesowe',
  'Skale pentatoniczne i bluesowe',
  'Skale, które nie są durowe ani molowe: pentatoniczna (podstawa solówek gitarowych), bluesowa i kilka „egzotycznych”.',
  10, 15,
  $content$[
  {
    "type": "intro",
    "text": "Zbiór dźwięków, których używa muzyka, układa się w **skalę**: dźwięki ustawione od najniższego do najwyższego, najczęściej w układzie powtarzającym się w każdej oktawie. Jakich dźwięków użyjesz i jak są od siebie oddalone, bardzo wpływa na brzmienie — stąd rozpoznajemy „europejski” moll i dur, a dźwięki wschodniej Azji często opierały się na skali pentatonicznej."
  },
  {
    "type": "definition",
    "term": "Skala pentatoniczna",
    "text": "Skala, która używa **pięciu** z dwunastu dźwięków oktawy (szósty dźwięk zaczyna kolejną oktawę). Najbardziej znana pentatonika to ta, którą zagrasz na **czarnych klawiszach** pianina. Pentatonik jest wiele — każdy układ pięciu dźwięków o innych odstępach brzmi inaczej, tak jak dur i moll."
  },
  {
    "type": "table",
    "headers": [
      "Skala",
      "Dźwięki",
      "Uwagi"
    ],
    "rows": [
      [
        "A-moll pentatoniczna",
        "A C D E G",
        "5 dźwięków z gamy a-moll bez 2. (B) i 6. (F) stopnia"
      ],
      [
        "C-dur pentatoniczna",
        "C D E G A",
        "te same dźwięki co powyżej, ale środek tonalny w C"
      ],
      [
        "A-bluesowa",
        "A C D E♭ E G",
        "pentatonika + „blue note” E♭ (kwinta zmniejszona)"
      ]
    ],
    "title": "Pentatonika, jej paralela i blues",
    "caption": "A-moll pentatoniczna i C-dur pentatoniczna mają te same dźwięki — tak jak a-moll i C-dur mają wspólną gamę. Różni je tonika, czyli „dom”."
  },
  {
    "type": "tab",
    "title": "A-moll pentatoniczna — pierwsza pozycja (box)",
    "tabText": "e|-------------------------------5--8--|\nB|-------------------------5--8--------|\nG|-------------------5--7--------------|\nD|-------------5--7--------------------|\nA|-------5--7--------------------------|\nE|-5--8--------------------------------|",
    "caption": "Dwa dźwięki na każdej strunie w okolicy 5. progu: A C – D E – G A – C D – E G – A C. To klasyczny „box”, od którego uczy się solówek. Tonika A leży na 5. progu strun E i e oraz na 7. progu struny D."
  },
  {
    "type": "fretboard-explorer",
    "title": "Znajdź wszystkie A (tonika boxu)",
    "targetNote": "A",
    "frets": 12,
    "caption": "Znajdź A — tonikę. Każde miejsce z A to początek pentatoniki w innej pozycji: ten sam kształt przesuwasz po gryfie."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Przesuwalna skala.** Wzór pentatoniczny jest przesuwalny: przesuń cały box o 2 progi w górę (tonika B), a zagrasz b-moll pentatoniczną; o 3 progi w dół (box na 2. progu) — fis-moll pentatoniczną. Dlatego pentatonika jest tak popularna: jeden kształt, dowolna tonacja."
  },
  {
    "type": "definition",
    "term": "Skala bluesowa",
    "text": "Skale bluesowe są blisko spokrewnione z pentatonicznymi (niektóre wersje są pentatonicznymi). Powstały jako kompromis między skalami europejskimi a afrykańskimi. Typowa wersja: weź pentatonikę molową od toniki i dodaj **dźwięk między kwartą a kwintą** (kwinta zmniejszona). W A to E♭ — „blue note”, nadający bluesowy charakter."
  },
  {
    "type": "tab",
    "title": "A-bluesowa w boxie",
    "tabText": "e|----------------------------------5--8--|\nB|----------------------------5--8--------|\nG|----------------------5--7--------------|\nD|----------------5--7--------------------|\nA|-------5--6--7--------------------------|\nE|-5--8-----------------------------------|",
    "caption": "To samo co wyżej plus **E♭ na 6. progu struny A** (zaraz między D i E). Zagraj go przelotnie, jako „zahaczenie” między 5. a 7. progiem — tak brzmi blues."
  },
  {
    "type": "definition",
    "term": "Skala chromatyczna i całotonowa a muzyka tonalna",
    "text": "Zwykła muzyka tonalna używa głównie siedmiu z dwunastu dźwięków gamy durowej lub molowej; pozostałe pojawiają się oszczędnie, by ożywić brzmienie. Skala chromatyczna i całotonowa (lekcja o oktawie) nie mają środka tonalnego, bo wszystkie odstępy są jednakowe."
  },
  {
    "type": "table",
    "headers": [
      "Skala",
      "Liczba dźwięków w oktawie",
      "Przykład użycia"
    ],
    "rows": [
      [
        "Chromatyczna",
        "12",
        "każda muzyka (jako pula wszystkich dźwięków)"
      ],
      [
        "Dur / moll",
        "7",
        "większość muzyki zachodniej"
      ],
      [
        "Pentatoniczna",
        "5",
        "muzyka Azji Wschodniej, blues, rock, folk"
      ],
      [
        "Całotonowa",
        "6",
        "muzyka współczesna, impresjonizm"
      ],
      [
        "Oktatoniczna",
        "8",
        "niektóre tradycje afrykańskie, jazz"
      ]
    ],
    "title": "Podział oktawy",
    "caption": "Indyjska muzyka klasyczna rozróżnia 22 możliwe wysokości w oktawie, a każda raga używa pięciu, sześciu lub siedmiu z nich. Inne tradycje używają ćwierćtonów i innych **mikrotonów** (interwałów mniejszych niż półton)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Skale „egzotyczne”.** Są też skale poza systemem dur–moll, często nazywane „arabską”, „węgierską” czy „cygańską”. Zwykle są luźno wzorowane na muzyce innych kultur, ale ignorują jej zasady strojenia i melodii, więc traktuj je jako **ciekawe kolory** do eksperymentów, a nie wierne odwzorowanie tych tradycji. Komponując, możesz też wymyślać własne skale i sprawdzać, jak zmieniają nastrój."
  },
  {
    "type": "quiz",
    "question": "Ile dźwięków ma skala pentatoniczna w jednej oktawie?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "correctIndex": 1,
    "explanation": "„Penta” to pięć. Pentatonika ma pięć dźwięków na oktawę; szósty zaczyna kolejną oktawę."
  },
  {
    "type": "quiz",
    "question": "Jaki dźwięk dodajesz do A-moll pentatonicznej, żeby powstała skala bluesowa?",
    "options": [
      "B",
      "E♭",
      "F",
      "G♯"
    ],
    "correctIndex": 1,
    "explanation": "Dodajemy kwintę zmniejszoną od toniki: w A to E♭ (D♯), leżące między D a E — „blue note”."
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

