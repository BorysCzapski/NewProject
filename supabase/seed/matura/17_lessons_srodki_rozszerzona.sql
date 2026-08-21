-- ============================================================================
-- supabase/seed/matura/17_lessons_srodki_rozszerzona.sql
-- English grammar theory for "Znajomość środków językowych", POZIOM
-- ROZSZERZONY. The podstawowa lessons are in 02_lessons_srodki_jezykowe.sql.
--
-- Nothing here repeats the podstawowa file; a rozszerzona student is
-- responsible for that material too. What is here is what actually separates
-- the levels: the perfect tenses beyond present perfect, the full conditional
-- system including mixed conditionals and wish, reported speech, the passive,
-- gerund vs infinitive, inversion, phrasal verbs and collocations — and the
-- key-word transformation task, which exists only at this level and rewards
-- technique as much as grammar.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections
  where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'
);

-- ----------------------------------------------------------------------------
-- 1. Czym różni się poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'czym-rozni-sie-rozszerzenie',
  'Czym różni się poziom rozszerzony',
  'Nowe typy zadań, wyższa poprzeczka i lista struktur, bez których nie da się zdać.',
  'strategia', 6,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu ta część waży mniej punktowo niż na podstawie, ale jest wyraźnie trudniejsza. Dochodzi typ zadania, którego na podstawie nie ma wcale: TRANSFORMACJA ZDANIA z podanym słowem kluczem."
  },
  {
    "type": "table",
    "title": "Typy zadań, których nie było na podstawie",
    "headers": ["Typ", "Na czym polega", "Co jest testowane"],
    "rows": [
      ["Transformacja ze słowem kluczem", "przepisz zdanie, używając podanego wyrazu", "strona bierna, inwersja, wish, phrasal verbs"],
      ["Tłumaczenie fragmentu", "przełóż fragment na angielski", "szyk, przyimki, kolokacje"],
      ["Uzupełnianie tekstu bez opcji", "luki w ciągłym tekście", "spójniki, czasy, przedimki"]
    ],
    "caption": "W transformacji liczy się wszystko: gramatyka, pisownia i to, czy znaczenie zostało zachowane."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W transformacji NIE WOLNO zmieniać podanego wyrazu. Jeśli słowem kluczem jest UNLESS, ma się pojawić dokładnie „unless” — nie „if not”. Zmieniony wyraz to zero punktów, choćby zdanie było poprawne."
  },
  {
    "type": "table",
    "title": "Struktury, bez których nie da się zdać rozszerzenia",
    "headers": ["Struktura", "Przykład", "Lekcja"],
    "rows": [
      ["past perfect", "He had left before I arrived.", "Czasy perfect"],
      ["mixed conditionals", "If I had studied, I would be a doctor now.", "Okresy warunkowe"],
      ["wish / if only", "I wish I had known.", "Okresy warunkowe"],
      ["strona bierna", "The house is being renovated.", "Strona bierna"],
      ["gerund vs infinitive", "I stopped smoking / to smoke.", "Gerund i infinitive"],
      ["inwersja", "Never have I seen anything like it.", "Inwersja"],
      ["phrasal verbs", "put up with, get away with", "Phrasal verbs"]
    ]
  },
  {
    "type": "quiz",
    "question": "Transformacja: „They are repairing the road.” → „The road ___ repaired.” (BEING)",
    "options": ["is being", "was being", "has been"],
    "correctIndex": 0,
    "explanation": "Zdanie wyjściowe jest w present continuous, więc strona bierna to „is being repaired”. Słowo klucz BEING potwierdza konstrukcję ciągłą."
  }
]$content$,
  1
);

-- ----------------------------------------------------------------------------
-- 2. Czasy perfect
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'czasy-perfect',
  'Past perfect i czasy perfect continuous',
  'Cofanie się w przeszłość jeszcze dalej i podkreślanie, że coś TRWAŁO.',
  'gramatyka', 12,
  $content$[
  {
    "type": "intro",
    "text": "Present perfect znasz z podstawy. Na rozszerzeniu dochodzą trzy: past perfect (przeszłość przed przeszłością), present perfect continuous i past perfect continuous (podkreślenie trwania). Wszystkie testowane są w transformacjach."
  },
  {
    "type": "timeline",
    "title": "Past perfect na osi czasu",
    "caption": "Past perfect to zdarzenie WCZEŚNIEJSZE niż inne przeszłe, nie po prostu dawne.",
    "markers": [
      { "at": 10, "label": "PAST PERFECT — wcześniejsze", "example": { "en": "He had left.", "pl": "Wyszedł." } },
      { "at": 30, "label": "PAST SIMPLE — późniejsze", "example": { "en": "I arrived.", "pl": "Przyszedłem." } },
      { "at": 50, "label": "NOW", "example": { "en": "Now I am telling you.", "pl": "Teraz ci to opowiadam." } }
    ]
  },
  {
    "type": "table",
    "title": "Cztery czasy perfect",
    "headers": ["Czas", "Budowa", "Kiedy", "Przykład"],
    "rows": [
      ["present perfect", "have/has + V3", "skutek teraz", "I have finished."],
      ["past perfect", "had + V3", "przed inną przeszłością", "I had finished before he came."],
      ["present perfect cont.", "have/has been + V-ing", "trwa do teraz", "I have been waiting for an hour."],
      ["past perfect cont.", "had been + V-ing", "trwało do momentu w przeszłości", "I had been waiting for an hour when she came."]
    ]
  },
  {
    "type": "compare",
    "title": "Perfect czy perfect continuous",
    "columns": [
      {
        "title": "PERFECT — wynik",
        "formula": "have + V3",
        "whenToUse": "liczy się REZULTAT i ile rzeczy zrobiono",
        "examples": ["I have written three emails.", "She has read the whole book.", "They have painted the kitchen."]
      },
      {
        "title": "PERFECT CONTINUOUS — proces",
        "formula": "have been + V-ing",
        "whenToUse": "liczy się, JAK DŁUGO to trwało; często widoczny efekt uboczny",
        "examples": ["I have been writing emails all morning.", "She has been reading for hours.", "They have been painting — that's why they're dirty."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Past perfect potrzebny jest tylko wtedy, gdy kolejność wydarzeń nie jest oczywista. Jeśli zdania są w kolejności chronologicznej i połączone przez „and then”, wystarczy past simple. Nadużywanie past perfect jest równie źle widziane jak jego brak."
  },
  {
    "type": "examples",
    "title": "Różnica, którą testują",
    "items": [
      { "en": "When I arrived, she left.", "pl": "Przyszedłem, a potem ona wyszła — kolejno.", "highlight": "left" },
      { "en": "When I arrived, she had left.", "pl": "Zanim przyszedłem, już wyszła.", "highlight": "had left" },
      { "en": "I have read that book.", "pl": "Przeczytałem tę książkę — mam ją za sobą.", "highlight": "have read" },
      { "en": "I have been reading that book.", "pl": "Czytam tę książkę — wciąż w trakcie.", "highlight": "have been reading" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "By the time we got there, the film ", "after": ".", "accept": ["had started", "had finished"], "hint": "start/finish — wcześniejsze niż „got there”", "pl": "Zanim dotarliśmy, film już się zaczął." },
      { "before": "I ", "after": " for two hours when she finally arrived.", "accept": ["had been waiting"], "hint": "wait — trwało do momentu w przeszłości", "pl": "Czekałem dwie godziny, gdy w końcu przyszła." },
      { "before": "She looks exhausted — she ", "after": " all day.", "accept": ["has been working", "'s been working"], "hint": "work — proces z widocznym skutkiem", "pl": "Wygląda na wykończoną — pracowała cały dzień." },
      { "before": "He ", "after": " three books this year.", "accept": ["has written", "'s written"], "hint": "write — wynik, policzalna liczba", "pl": "Napisał w tym roku trzy książki." },
      { "before": "They ", "after": " never seen snow before they moved north.", "accept": ["had"], "hint": "przed inną przeszłością", "pl": "Nigdy nie widzieli śniegu, zanim przenieśli się na północ." }
    ]
  },
  {
    "type": "quiz",
    "question": "„She was tired because she ___ all night.”",
    "options": ["has been studying", "had been studying", "studied"],
    "correctIndex": 1,
    "explanation": "Zmęczenie jest w przeszłości („was tired”), a nauka trwała jeszcze wcześniej i do tego momentu — więc past perfect continuous."
  }
]$content$,
  2
);

-- ----------------------------------------------------------------------------
-- 3. Okresy warunkowe
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'okresy-warunkowe',
  'Okresy warunkowe, mieszane i WISH',
  'Wszystkie typy zdań warunkowych plus konstrukcje żalu: wish, if only, should have.',
  'gramatyka', 13,
  $content$[
  {
    "type": "intro",
    "text": "Na podstawie wystarczały trzy typy. Na rozszerzeniu dochodzą warianty mieszane i cała rodzina konstrukcji wyrażających żal — a to one najczęściej pojawiają się w transformacjach."
  },
  {
    "type": "table",
    "title": "Cztery podstawowe typy",
    "headers": ["Typ", "IF…", "…then", "Znaczenie"],
    "rows": [
      ["zero", "present simple", "present simple", "prawda zawsze: If you heat ice, it melts."],
      ["pierwszy", "present simple", "will + V", "realne: If it rains, we'll stay in."],
      ["drugi", "past simple", "would + V", "nierealne teraz: If I had money, I'd travel."],
      ["trzeci", "past perfect", "would have + V3", "nierealne w przeszłości: If I had known, I would have come."]
    ]
  },
  {
    "type": "table",
    "title": "Mieszane — to one są w transformacjach",
    "headers": ["Układ", "Przykład", "Znaczenie"],
    "rows": [
      ["przeszły warunek, teraźniejszy skutek", "If I had studied medicine, I would be a doctor now.", "nie studiowałem, więc dziś nim nie jestem"],
      ["teraźniejszy warunek, przeszły skutek", "If I were more careful, I wouldn't have broken it.", "jestem nieostrożny, więc wtedy stłukłem"]
    ],
    "caption": "Mieszany warunek łączy dwa różne czasy — właśnie dlatego jest wdzięcznym materiałem na zadanie."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Po IF nie stawia się WILL ani WOULD: „If it rains” — nie „if it will rain”. Wyjątkiem jest grzeczna prośba („If you would kindly wait…”), ale na maturze nie liczy się na nią."
  },
  {
    "type": "table",
    "title": "WISH i konstrukcje żalu",
    "headers": ["Konstrukcja", "O czym", "Przykład"],
    "rows": [
      ["wish + past simple", "żal o teraźniejszość", "I wish I knew the answer."],
      ["wish + past perfect", "żal o przeszłość", "I wish I had studied harder."],
      ["wish + would", "irytacja cudzym zachowaniem", "I wish you would stop shouting."],
      ["if only", "mocniejsze niż wish", "If only I had listened!"],
      ["should have + V3", "wyrzut, że czegoś nie zrobiono", "You should have told me."],
      ["it's time + past simple", "już pora", "It's time we left."]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W konstrukcjach nierealnych z „I / he / she / it” dopuszczalne jest WERE zamiast was: „If I were you” i „I wish he were here”. W transformacjach bezpieczniej pisać „were” — jest zawsze poprawne."
  },
  {
    "type": "keyPhrases",
    "title": "Alternatywy dla IF",
    "caption": "Każde z nich bywa słowem kluczem w transformacji.",
    "groups": [
      {
        "label": "Zamiast if",
        "phrases": [
          { "text": "unless = if not", "pl": "chyba że / jeśli nie" },
          { "text": "provided that / as long as", "pl": "pod warunkiem że" },
          { "text": "in case", "pl": "na wypadek gdyby" },
          { "text": "otherwise", "pl": "w przeciwnym razie" },
          { "text": "but for", "pl": "gdyby nie" },
          { "text": "supposing", "pl": "przypuśćmy, że" }
        ]
      }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "If I ", "after": " you, I would accept the offer.", "accept": ["were", "was"], "hint": "be — warunek nierealny", "pl": "Na twoim miejscu przyjąłbym ofertę." },
      { "before": "If she had left earlier, she ", "after": " the train.", "accept": ["would have caught"], "hint": "catch — trzeci okres", "pl": "Gdyby wyszła wcześniej, złapałaby pociąg." },
      { "before": "I wish I ", "after": " harder for that exam.", "accept": ["had studied", "had worked"], "hint": "żal o przeszłość", "pl": "Żałuję, że nie uczyłem się więcej do tego egzaminu." },
      { "before": "You ", "after": " have told me — I had no idea.", "accept": ["should"], "hint": "wyrzut", "pl": "Powinieneś był mi powiedzieć." },
      { "before": "We won't go ", "after": " the weather improves.", "accept": ["unless"], "hint": "if not", "pl": "Nie pojedziemy, chyba że pogoda się poprawi." },
      { "before": "If I had taken that job, I ", "after": " in London now.", "accept": ["would be", "'d be"], "hint": "warunek mieszany", "pl": "Gdybym przyjął tę pracę, mieszkałbym teraz w Londynie." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Konstrukcja → znaczenie",
    "pairs": [
      { "left": "I wish I knew", "right": "żałuję, że nie wiem (teraz)" },
      { "left": "I wish I had known", "right": "żałuję, że nie wiedziałem (wtedy)" },
      { "left": "I wish you would stop", "right": "irytacja cudzym zachowaniem" },
      { "left": "unless", "right": "jeśli nie" },
      { "left": "but for", "right": "gdyby nie" }
    ]
  },
  {
    "type": "quiz",
    "question": "Transformacja: „I'm sorry I didn't call you.” → „I wish I ___ you.” (CALLED)",
    "options": ["called", "had called", "would call"],
    "correctIndex": 1,
    "explanation": "Żal dotyczy przeszłości („didn't call”), więc po wish idzie past perfect: had called. Samo „called” wyrażałoby żal o teraźniejszość."
  }
]$content$,
  3
);

-- ----------------------------------------------------------------------------
-- 4. Strona bierna
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'strona-bierna',
  'Strona bierna we wszystkich czasach',
  'Jedna reguła, osiem czasów. Plus konstrukcje z „it is said that” i „have something done”.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Strona bierna to jeden z najczęstszych tematów transformacji. Reguła jest mechaniczna: BE w tym samym czasie co czasownik wyjściowy plus trzecia forma. Trudność polega wyłącznie na tym, żeby trafić w czas."
  },
  {
    "type": "table",
    "title": "Strona bierna w każdym czasie",
    "headers": ["Czas", "Czynna", "Bierna"],
    "rows": [
      ["present simple", "They clean it.", "It is cleaned."],
      ["present continuous", "They are cleaning it.", "It is being cleaned."],
      ["past simple", "They cleaned it.", "It was cleaned."],
      ["past continuous", "They were cleaning it.", "It was being cleaned."],
      ["present perfect", "They have cleaned it.", "It has been cleaned."],
      ["past perfect", "They had cleaned it.", "It had been cleaned."],
      ["future", "They will clean it.", "It will be cleaned."],
      ["modal", "They must clean it.", "It must be cleaned."]
    ],
    "caption": "Wzór jest zawsze ten sam: forma BE odpowiadająca czasowi + trzecia forma czasownika."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Wykonawcę dodaje się przez BY, ale tylko jeśli jest istotny: „The book was written by Orwell”. Jeśli nieistotny — pomija się go, i właśnie po to zwykle używa się strony biernej."
  },
  {
    "type": "table",
    "title": "Konstrukcje bezosobowe",
    "headers": ["Czynna", "Bierna — wariant 1", "Bierna — wariant 2"],
    "rows": [
      ["People say he is rich.", "It is said that he is rich.", "He is said to be rich."],
      ["People believe she left.", "It is believed that she left.", "She is believed to have left."],
      ["They expect prices to rise.", "It is expected that prices will rise.", "Prices are expected to rise."]
    ],
    "caption": "Wariant 2 jest częstszy w transformacjach: podmiot + be + V3 + to + bezokolicznik."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "HAVE SOMETHING DONE znaczy „zlecić coś komuś”, nie „zrobić samemu”. „I had my hair cut” = obcięto mi włosy u fryzjera. „I cut my hair” = sam sobie obciąłem. Ta różnica jest testowana."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zamień na stronę bierną",
    "items": [
      { "before": "They are building a new bridge. → A new bridge ", "after": " built.", "accept": ["is being"], "hint": "present continuous", "pl": "Budowany jest nowy most." },
      { "before": "Someone has stolen my bike. → My bike ", "after": " stolen.", "accept": ["has been"], "hint": "present perfect", "pl": "Skradziono mi rower." },
      { "before": "They will announce the results tomorrow. → The results ", "after": " announced tomorrow.", "accept": ["will be"], "hint": "future", "pl": "Wyniki zostaną ogłoszone jutro." },
      { "before": "People say he is very rich. → He ", "after": " to be very rich.", "accept": ["is said"], "hint": "konstrukcja bezosobowa", "pl": "Mówi się, że jest bardzo bogaty." },
      { "before": "I ", "after": " my car repaired last week.", "accept": ["had"], "hint": "have something done", "pl": "W zeszłym tygodniu oddałem samochód do naprawy." },
      { "before": "You must finish it today. → It must ", "after": " today.", "accept": ["be finished"], "hint": "modal", "pl": "To musi zostać skończone dzisiaj." }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdanie w stronie biernej.",
    "items": [
      { "correct": ["The", "windows", "are", "being", "cleaned", "right", "now"], "pl": "Okna są właśnie myte.", "note": "Present continuous passive: are being + V3." },
      { "correct": ["The", "results", "will", "be", "announced", "on", "Friday"], "pl": "Wyniki zostaną ogłoszone w piątek.", "note": "Future passive: will be + V3." }
    ]
  },
  {
    "type": "quiz",
    "question": "„They were repairing the road.” w stronie biernej to:",
    "options": ["The road was repaired.", "The road was being repaired.", "The road has been repaired."],
    "correctIndex": 1,
    "explanation": "Zdanie wyjściowe jest w past continuous, więc bierna wymaga „was being repaired”. Pierwsza opcja to past simple, trzecia — present perfect."
  }
]$content$,
  4
);

-- ----------------------------------------------------------------------------
-- 5. Gerund i infinitive
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'gerund-infinitive',
  'Gerund czy infinitive',
  'Po jednych czasownikach -ing, po innych to. A po kilku oba, ale ze zmianą znaczenia.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Po niektórych czasownikach idzie forma z -ing, po innych bezokolicznik z TO. Nie ma reguły semantycznej — to lista do zapamiętania. Ale jest krótka, a jej znajomość zamyka cały typ zadania."
  },
  {
    "type": "table",
    "title": "Po tych czasownikach: -ING",
    "headers": ["Czasownik", "Przykład"],
    "rows": [
      ["enjoy", "I enjoy reading."],
      ["avoid", "He avoided answering."],
      ["mind", "Do you mind waiting?"],
      ["suggest", "She suggested going out."],
      ["admit / deny", "He denied taking it."],
      ["finish / give up", "I gave up smoking."],
      ["can't stand / can't help", "I can't stand waiting."],
      ["look forward to", "I look forward to meeting you."],
      ["be used to / get used to", "I'm used to getting up early."]
    ],
    "caption": "Uwaga na trzy ostatnie: TO jest tam przyimkiem, nie częścią bezokolicznika, więc po nim idzie -ing."
  },
  {
    "type": "table",
    "title": "Po tych czasownikach: TO + bezokolicznik",
    "headers": ["Czasownik", "Przykład"],
    "rows": [
      ["want / would like", "I want to go."],
      ["decide", "We decided to stay."],
      ["hope / expect", "I hope to see you."],
      ["promise / refuse", "He refused to help."],
      ["manage / afford", "We can't afford to buy it."],
      ["agree / offer", "She agreed to come."],
      ["seem / appear", "He seems to know."],
      ["pretend", "He pretended to be asleep."]
    ]
  },
  {
    "type": "table",
    "title": "Oba, ale znaczenie się zmienia",
    "headers": ["Czasownik", "+ -ing", "+ to"],
    "rows": [
      ["stop", "stop smoking = rzucić palenie", "stop to smoke = zatrzymać się, żeby zapalić"],
      ["remember", "remember locking = pamiętam, że zamknąłem", "remember to lock = pamiętaj, żeby zamknąć"],
      ["forget", "forget meeting = zapomnieć, że się spotkało", "forget to meet = zapomnieć się spotkać"],
      ["try", "try calling = spróbuj zadzwonić (metoda)", "try to call = staraj się dodzwonić (wysiłek)"],
      ["regret", "regret saying = żałować, że się powiedziało", "regret to say = z przykrością informuję"],
      ["mean", "mean waiting = oznaczać czekanie", "mean to wait = zamierzać poczekać"]
    ],
    "caption": "Ta tabela jest najczęściej testowaną częścią tego materiału. -ing patrzy WSTECZ, TO patrzy W PRZÓD."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„I'm looking forward to seeing you” — nie „to see”. To jedno z najczęstszych zdań w e-mailach formalnych i jeden z najczęstszych błędów, bo „to” wygląda jak część bezokolicznika, a jest przyimkiem."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "I look forward to ", "after": " from you.", "accept": ["hearing"], "hint": "hear — to jest przyimkiem", "pl": "Czekam na wiadomość od ciebie." },
      { "before": "He avoided ", "after": " the question.", "accept": ["answering"], "hint": "answer — po avoid", "pl": "Unikał odpowiedzi na pytanie." },
      { "before": "We decided ", "after": " at home.", "accept": ["to stay"], "hint": "stay — po decide", "pl": "Postanowiliśmy zostać w domu." },
      { "before": "Remember ", "after": " the door when you leave.", "accept": ["to lock", "to close"], "hint": "przyszłe zadanie", "pl": "Pamiętaj, żeby zamknąć drzwi, gdy będziesz wychodzić." },
      { "before": "I'm used to ", "after": " up early.", "accept": ["getting", "waking"], "hint": "be used to + -ing", "pl": "Jestem przyzwyczajony do wczesnego wstawania." },
      { "before": "She stopped ", "after": " two years ago and feels much better.", "accept": ["smoking"], "hint": "rzuciła nałóg", "pl": "Rzuciła palenie dwa lata temu." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Znaczenie → forma",
    "pairs": [
      { "left": "rzucić palenie", "right": "stop smoking" },
      { "left": "zatrzymać się, żeby zapalić", "right": "stop to smoke" },
      { "left": "pamiętaj, żeby zamknąć", "right": "remember to lock" },
      { "left": "pamiętam, że zamknąłem", "right": "remember locking" },
      { "left": "spróbuj innej metody", "right": "try calling" }
    ]
  },
  {
    "type": "quiz",
    "question": "„I regret ___ you that your application was unsuccessful.”",
    "options": ["telling", "to tell", "tell"],
    "correctIndex": 1,
    "explanation": "„Regret to tell/inform” to formuła w oficjalnym piśmie: z przykrością informuję. „Regret telling” znaczyłoby, że żałuje się, że się kiedyś powiedziało."
  }
]$content$,
  5
);

-- ----------------------------------------------------------------------------
-- 6. Mowa zależna
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'mowa-zalezna',
  'Mowa zależna',
  'Przesunięcie czasów, zaimków i okoliczników. Plus czasowniki relacjonujące, które lubią transformacje.',
  'gramatyka', 11,
  $content$[
  {
    "type": "intro",
    "text": "Relacjonując cudze słowa po czasowniku w przeszłości, cofasz czas o jeden stopień i przesuwasz okoliczniki. Na rozszerzeniu dochodzi trzecia rzecz: dobór czasownika relacjonującego, bo transformacje często proszą właśnie o niego."
  },
  {
    "type": "table",
    "title": "Przesunięcie czasów",
    "headers": ["Mowa niezależna", "Mowa zależna"],
    "rows": [
      ["present simple", "past simple"],
      ["present continuous", "past continuous"],
      ["past simple", "past perfect"],
      ["present perfect", "past perfect"],
      ["will", "would"],
      ["can", "could"],
      ["must", "had to"],
      ["may", "might"]
    ],
    "caption": "Past perfect, would, could i might już się nie cofają — nie ma dokąd."
  },
  {
    "type": "table",
    "title": "Okoliczniki",
    "headers": ["Niezależna", "Zależna"],
    "rows": [
      ["today", "that day"],
      ["yesterday", "the day before"],
      ["tomorrow", "the next day"],
      ["now", "then"],
      ["here", "there"],
      ["this", "that"],
      ["ago", "before"],
      ["next week", "the following week"]
    ]
  },
  {
    "type": "table",
    "title": "Czasowniki relacjonujące i ich składnia",
    "headers": ["Czasownik", "Składnia", "Przykład"],
    "rows": [
      ["say", "say (that)", "He said that he was tired."],
      ["tell", "tell somebody (that)", "He told me that he was tired."],
      ["ask", "ask somebody to do", "She asked me to wait."],
      ["advise", "advise somebody to do", "He advised me to see a doctor."],
      ["suggest", "suggest doing / that", "She suggested going out."],
      ["offer", "offer to do", "He offered to help."],
      ["refuse", "refuse to do", "She refused to answer."],
      ["admit", "admit doing", "He admitted taking it."],
      ["deny", "deny doing", "She denied knowing him."],
      ["accuse", "accuse somebody of doing", "They accused him of lying."],
      ["apologise", "apologise for doing", "He apologised for being late."],
      ["insist", "insist on doing", "She insisted on paying."]
    ],
    "caption": "Ta tabela to serce transformacji z mowy zależnej: podane słowo klucz dyktuje całą składnię."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "SAY i TELL nie są wymienne. TELL wymaga dopełnienia osobowego: „He told ME”, nigdy „He told that…”. SAY go nie przyjmuje: „He said that…”, nigdy „He said me”."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: zamień na mowę zależną",
    "items": [
      { "before": "\"I am tired.\" → He said he ", "after": " tired.", "accept": ["was"], "hint": "present → past", "pl": "Powiedział, że jest zmęczony." },
      { "before": "\"I'll call you tomorrow.\" → She said she ", "after": " me the next day.", "accept": ["would call"], "hint": "will → would", "pl": "Powiedziała, że zadzwoni następnego dnia." },
      { "before": "\"Please wait.\" → She asked me ", "after": ".", "accept": ["to wait"], "hint": "ask somebody to do", "pl": "Poprosiła, żebym zaczekał." },
      { "before": "\"I didn't do it.\" → He denied ", "after": " it.", "accept": ["doing"], "hint": "deny + -ing", "pl": "Zaprzeczył, że to zrobił." },
      { "before": "\"Sorry I'm late.\" → He apologised for ", "after": " late.", "accept": ["being"], "hint": "apologise for + -ing", "pl": "Przeprosił za spóźnienie." },
      { "before": "\"You should rest.\" → The doctor advised me ", "after": ".", "accept": ["to rest"], "hint": "advise somebody to do", "pl": "Lekarz poradził mi odpocząć." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Czasownik → składnia",
    "pairs": [
      { "left": "suggest", "right": "+ -ing" },
      { "left": "advise", "right": "+ somebody to do" },
      { "left": "accuse", "right": "+ somebody of doing" },
      { "left": "insist", "right": "+ on doing" },
      { "left": "refuse", "right": "+ to do" },
      { "left": "apologise", "right": "+ for doing" }
    ]
  }
]$content$,
  6
);

-- ----------------------------------------------------------------------------
-- 7. Inwersja i emfaza
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'inwersja',
  'Inwersja i konstrukcje emfatyczne',
  'Never have I seen… Struktura, która natychmiast podnosi ocenę za zakres.',
  'gramatyka', 10,
  $content$[
  {
    "type": "intro",
    "text": "Inwersja to przestawienie szyku tak jak w pytaniu, choć zdanie nie jest pytaniem. Używa się jej po wyrażeniach przeczących i ograniczających na początku zdania. Brzmi formalnie i literacko — a na maturze jest bardzo dobrze punktowana."
  },
  {
    "type": "formula",
    "title": "Jak działa",
    "caption": "Wyrażenie na początku, potem operator, dopiero potem podmiot.",
    "variants": [
      {
        "label": "Zwykły szyk",
        "parts": [
          { "text": "I", "role": "subject" },
          { "text": "have never", "role": "aux" },
          { "text": "seen", "role": "verb" },
          { "text": "anything like it", "role": "object" }
        ],
        "example": { "en": "I have never seen anything like it.", "pl": "Nigdy czegoś takiego nie widziałem." }
      },
      {
        "label": "Z inwersją",
        "parts": [
          { "text": "Never", "role": "qword", "note": "wyrażenie przeczące na początku" },
          { "text": "have", "role": "aux", "note": "operator przed podmiotem" },
          { "text": "I", "role": "subject" },
          { "text": "seen anything like it", "role": "object" }
        ],
        "example": { "en": "Never have I seen anything like it.", "pl": "Nigdy czegoś takiego nie widziałem." }
      }
    ]
  },
  {
    "type": "table",
    "title": "Wyrażenia wymuszające inwersję",
    "headers": ["Wyrażenie", "Przykład"],
    "rows": [
      ["Never", "Never have I been so embarrassed."],
      ["Rarely / Seldom", "Rarely does he complain."],
      ["Hardly … when", "Hardly had I arrived when it started."],
      ["No sooner … than", "No sooner had we left than it rained."],
      ["Not only … but also", "Not only did she win, but she also set a record."],
      ["Little", "Little did they know what awaited."],
      ["Under no circumstances", "Under no circumstances should you open it."],
      ["Only after / Only when", "Only then did I understand."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na parę HARDLY … WHEN i NO SOONER … THAN. Nie wolno ich mieszać: „No sooner had I arrived WHEN…” to błąd. Po „no sooner” zawsze „than”."
  },
  {
    "type": "table",
    "title": "Inne konstrukcje emfatyczne",
    "headers": ["Konstrukcja", "Przykład", "Efekt"],
    "rows": [
      ["cleft z IT", "It was John who broke it.", "podkreśla, KTO"],
      ["cleft z WHAT", "What I need is a holiday.", "podkreśla, CZEGO"],
      ["DO emfatyczne", "I do like it, honestly.", "wzmacnia twierdzenie"],
      ["THE thing that", "The thing that annoys me is the noise.", "podkreśla temat"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Jedna inwersja w rozprawce robi bardzo dobre wrażenie: „Not only does technology save time, but it also creates new problems”. Dwie już brzmią jak popis — jedna wystarczy."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: przekształć z inwersją",
    "items": [
      { "before": "I have never seen such a mess. → Never ", "after": " I seen such a mess.", "accept": ["have"], "hint": "operator przed podmiotem", "pl": "Nigdy nie widziałem takiego bałaganu." },
      { "before": "He rarely complains. → Rarely ", "after": " he complain.", "accept": ["does"], "hint": "present simple → operator does", "pl": "Rzadko narzeka." },
      { "before": "No sooner had we sat down ", "after": " the phone rang.", "accept": ["than"], "hint": "no sooner …", "pl": "Ledwo usiedliśmy, zadzwonił telefon." },
      { "before": "Not only ", "after": " she sing, but she also plays the piano.", "accept": ["does"], "hint": "operator", "pl": "Nie tylko śpiewa, ale też gra na pianinie." },
      { "before": "", "after": " no circumstances should you touch it.", "accept": ["Under", "under"], "hint": "w żadnym wypadku", "pl": "W żadnym wypadku nie wolno tego dotykać." }
    ]
  },
  {
    "type": "orderWords",
    "instruction": "Ułóż zdanie z inwersją.",
    "items": [
      { "correct": ["Never", "have", "I", "felt", "so", "tired"], "pl": "Nigdy nie czułem się tak zmęczony.", "note": "Never + operator + podmiot." },
      { "correct": ["Only", "then", "did", "I", "understand", "the", "problem"], "pl": "Dopiero wtedy zrozumiałem problem.", "note": "Only then + does/did + podmiot." }
    ]
  },
  {
    "type": "quiz",
    "question": "„___ had I closed the door than the phone rang.”",
    "options": ["Hardly", "No sooner", "Never"],
    "correctIndex": 1,
    "explanation": "Obecność THAN wymusza „no sooner”. Gdyby było „when”, poprawne byłoby „hardly”. To najczęściej mylona para w tym materiale."
  }
]$content$,
  7
);

-- ----------------------------------------------------------------------------
-- 8. Phrasal verbs
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'phrasal-verbs',
  'Phrasal verbs',
  'Czasowniki złożone pogrupowane tematycznie — plus zasada, gdzie stoi dopełnienie.',
  'slownictwo', 12,
  $content$[
  {
    "type": "intro",
    "text": "Phrasal verb to czasownik plus partykuła, których znaczenie łączne nie wynika z części składowych: „give up” nie ma nic wspólnego z dawaniem. Są nieuniknione w tekstach i w transformacjach, a ich znajomość mocno podnosi ocenę za zakres."
  },
  {
    "type": "table",
    "title": "Gdzie stoi dopełnienie",
    "headers": ["Typ", "Zasada", "Przykład"],
    "rows": [
      ["rozdzielny", "rzeczownik przed lub po partykule", "turn the TV off / turn off the TV"],
      ["rozdzielny z zaimkiem", "zaimek ZAWSZE w środku", "turn it off — nigdy „turn off it”"],
      ["nierozdzielny", "dopełnienie zawsze po partykule", "look after the children"],
      ["trzyczłonowy", "nigdy nie rozdziela się", "put up with the noise"]
    ],
    "caption": "Reguła zaimka jest bezwzględna i najczęściej testowana: „turn off it” to zawsze błąd."
  },
  {
    "type": "keyPhrases",
    "title": "Phrasal verbs według tematu",
    "caption": "Grupowanie tematyczne działa lepiej niż alfabetyczne — łatwiej zapamiętać sześć z jednego pola niż sześć przypadkowych.",
    "groups": [
      {
        "label": "Relacje i ludzie",
        "phrases": [
          { "text": "get on with", "pl": "dogadywać się z" },
          { "text": "fall out with", "pl": "pokłócić się z" },
          { "text": "make up", "pl": "pogodzić się" },
          { "text": "look up to", "pl": "podziwiać" },
          { "text": "look down on", "pl": "patrzeć z góry na" },
          { "text": "put up with", "pl": "znosić, tolerować" },
          { "text": "take after", "pl": "wdać się w kogoś" }
        ]
      },
      {
        "label": "Nauka i praca",
        "phrases": [
          { "text": "catch up with", "pl": "nadrobić zaległości" },
          { "text": "keep up with", "pl": "nadążać za" },
          { "text": "drop out of", "pl": "rzucić szkołę" },
          { "text": "hand in", "pl": "oddać pracę" },
          { "text": "take on", "pl": "przyjąć (pracę, obowiązki)" },
          { "text": "carry out", "pl": "przeprowadzić (badanie)" },
          { "text": "set up", "pl": "założyć (firmę)" }
        ]
      },
      {
        "label": "Problemy i rozwiązania",
        "phrases": [
          { "text": "come up with", "pl": "wymyślić" },
          { "text": "work out", "pl": "rozwiązać, obliczyć" },
          { "text": "sort out", "pl": "uporządkować, załatwić" },
          { "text": "deal with", "pl": "poradzić sobie z" },
          { "text": "give up", "pl": "poddać się, rzucić" },
          { "text": "get away with", "pl": "ujść na sucho" },
          { "text": "run out of", "pl": "wyczerpać zapas" }
        ]
      },
      {
        "label": "Zmiana i rozwój",
        "phrases": [
          { "text": "take up", "pl": "zacząć uprawiać (hobby)" },
          { "text": "turn into", "pl": "zamienić się w" },
          { "text": "grow up", "pl": "dorastać" },
          { "text": "bring up", "pl": "wychowywać" },
          { "text": "cut down on", "pl": "ograniczyć" },
          { "text": "look forward to", "pl": "wyczekiwać" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W transformacjach phrasal verb bywa słowem kluczem: „She started playing tennis last year” + TOOK → „She took up tennis last year”. Warto znać odpowiedniki formalne: carry out = conduct, put up with = tolerate, find out = discover."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzupełnij partykułę",
    "items": [
      { "before": "I can't put ", "after": " with this noise any longer.", "accept": ["up"], "hint": "znosić", "pl": "Nie mogę dłużej znosić tego hałasu." },
      { "before": "She takes ", "after": " her mother — same eyes, same laugh.", "accept": ["after"], "hint": "wdać się w kogoś", "pl": "Wdała się w matkę." },
      { "before": "We've run ", "after": " of milk.", "accept": ["out"], "hint": "wyczerpać zapas", "pl": "Skończyło nam się mleko." },
      { "before": "He came ", "after": " with a brilliant idea.", "accept": ["up"], "hint": "wymyślić", "pl": "Wpadł na świetny pomysł." },
      { "before": "I need to catch ", "after": " with the rest of the class.", "accept": ["up"], "hint": "nadrobić zaległości", "pl": "Muszę nadrobić zaległości." },
      { "before": "He dropped ", "after": " of university after a year.", "accept": ["out"], "hint": "rzucić studia", "pl": "Rzucił studia po roku." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Phrasal verb → znaczenie",
    "pairs": [
      { "left": "put up with", "right": "znosić" },
      { "left": "come up with", "right": "wymyślić" },
      { "left": "get away with", "right": "ujść na sucho" },
      { "left": "take up", "right": "zacząć uprawiać" },
      { "left": "look up to", "right": "podziwiać" },
      { "left": "carry out", "right": "przeprowadzić" }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie jest poprawne?",
    "options": ["Turn off it, please.", "Turn it off, please.", "Turn off it now."],
    "correctIndex": 1,
    "explanation": "Przy rozdzielnym phrasal verb zaimek zawsze stoi między czasownikiem a partykułą. „Turn off it” jest niepoprawne niezależnie od reszty zdania."
  }
]$content$,
  8
);

-- ----------------------------------------------------------------------------
-- 9. Transformacje — technika
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'transformacje',
  'Transformacje ze słowem kluczem — technika',
  'Zadanie typowe wyłącznie dla rozszerzenia. Cztery kroki i katalog przekształceń, które wracają.',
  'strategia', 11,
  $content$[
  {
    "type": "intro",
    "text": "Transformacja daje ci zdanie i słowo klucz. Masz napisać zdanie o tym samym znaczeniu, używając tego słowa w niezmienionej postaci. Punkt jest tylko za pełne, poprawne rozwiązanie — połowiczne nie liczą się wcale."
  },
  {
    "type": "table",
    "title": "Cztery kroki",
    "headers": ["Krok", "Co robisz"],
    "rows": [
      ["1", "Ustal, CO znaczy zdanie wyjściowe — nie jak jest zbudowane."],
      ["2", "Rozpoznaj, jakiej konstrukcji wymaga słowo klucz."],
      ["3", "Napisz nowe zdanie, nie zmieniając ani litery w słowie kluczu."],
      ["4", "Sprawdź: to samo znaczenie? liczba słów w limicie? czas i osoba się zgadzają?"]
    ]
  },
  {
    "type": "table",
    "title": "Katalog przekształceń, które wracają co roku",
    "headers": ["Wyjściowe", "Słowo klucz", "Wynik"],
    "rows": [
      ["It's a pity I didn't go.", "WISH", "I wish I had gone."],
      ["They are repairing the road.", "BEING", "The road is being repaired."],
      ["I haven't seen him for years.", "SINCE", "It's years since I saw him."],
      ["She started playing tennis in May.", "TAKEN", "She has taken up tennis since May."],
      ["He can't come unless you invite him.", "UNLESS", "He can't come unless you invite him."],
      ["Somebody must have taken it.", "BEEN", "It must have been taken."],
      ["I have never seen such a view.", "NEVER", "Never have I seen such a view."],
      ["He said he was sorry for being late.", "APOLOGISED", "He apologised for being late."],
      ["It isn't necessary to book.", "NEED", "You needn't book."],
      ["People say she is very rich.", "SAID", "She is said to be very rich."],
      ["I can't stand this noise.", "PUT", "I can't put up with this noise."],
      ["The last time I saw her was in June.", "SEEN", "I haven't seen her since June."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na limit słów — zwykle od trzech do sześciu, licząc słowo klucz. Formy skrócone liczą się jako dwa słowa: „isn't” to „is not”. Przekroczenie limitu unieważnia odpowiedź nawet przy poprawnej gramatyce."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Słowo klucz zwykle jednoznacznie zdradza konstrukcję: WISH → żal, BEING → strona bierna ciągła, SAID → konstrukcja bezosobowa, UNLESS → warunek przeczący. Rozpoznanie go załatwia połowę zadania."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: dokończ transformację",
    "items": [
      { "before": "It's a pity I didn't study more. → I wish I ", "after": " more.", "accept": ["had studied"], "hint": "WISH — żal o przeszłość", "pl": "Żałuję, że nie uczyłem się więcej." },
      { "before": "Somebody stole my bike. → My bike ", "after": " stolen.", "accept": ["was", "has been"], "hint": "strona bierna", "pl": "Skradziono mi rower." },
      { "before": "The last time I saw her was in June. → I ", "after": " her since June.", "accept": ["haven't seen"], "hint": "SINCE + present perfect", "pl": "Nie widziałem jej od czerwca." },
      { "before": "It isn't necessary to book a table. → You ", "after": " book a table.", "accept": ["needn't", "don't have to", "don't need to"], "hint": "brak konieczności", "pl": "Nie musisz rezerwować stolika." },
      { "before": "People believe he left the country. → He is believed ", "after": " the country.", "accept": ["to have left"], "hint": "konstrukcja bezosobowa, przeszłość", "pl": "Uważa się, że wyjechał z kraju." },
      { "before": "I can't stand waiting. → I can't put ", "after": " waiting.", "accept": ["up with"], "hint": "PUT — phrasal verb", "pl": "Nie znoszę czekania." }
    ]
  },
  {
    "type": "quiz",
    "question": "„I last visited Rome in 2019.” → „I ___ Rome since 2019.” (BEEN)",
    "options": ["haven't been to", "didn't go to", "wasn't in"],
    "correctIndex": 0,
    "explanation": "SINCE wymusza present perfect, a słowo klucz BEEN wskazuje na „have been to”. Przeczenie jest konieczne, bo zdanie wyjściowe mówi, że od tamtej pory nie był."
  }
]$content$,
  9
);

-- ----------------------------------------------------------------------------
-- 10. Kolokacje
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'kolokacje',
  'Kolokacje: make czy do, i inne pary',
  'Wyrazy, które chodzą parami. Znajomość kolokacji to najtańszy sposób na punkty za zakres.',
  'slownictwo', 10,
  $content$[
  {
    "type": "intro",
    "text": "Kolokacja to utarte połączenie wyrazów: mówi się „make a decision”, nie „do a decision”, choć gramatycznie oba są poprawne. Kolokacje są testowane w lukach i decydują o naturalności wypowiedzi pisemnej."
  },
  {
    "type": "compare",
    "title": "MAKE czy DO",
    "columns": [
      {
        "title": "MAKE — tworzenie",
        "formula": "coś powstaje",
        "whenToUse": "decyzje, wysiłki, hałas, błędy",
        "examples": ["make a decision", "make an effort", "make a mistake", "make progress", "make friends", "make money", "make noise", "make a suggestion"]
      },
      {
        "title": "DO — wykonywanie",
        "formula": "czynność, obowiązek",
        "whenToUse": "praca, obowiązki, ogólne czynności",
        "examples": ["do homework", "do the shopping", "do research", "do exercise", "do a favour", "do business", "do the washing-up", "do your best"]
      }
    ]
  },
  {
    "type": "keyPhrases",
    "title": "Inne częste kolokacje",
    "caption": "Wszystkie pojawiają się w arkuszach; wszystkie warto znać jako całości.",
    "groups": [
      {
        "label": "Z TAKE",
        "phrases": [
          { "text": "take a decision (BrE)", "pl": "podjąć decyzję" },
          { "text": "take an exam", "pl": "przystąpić do egzaminu" },
          { "text": "take part in", "pl": "wziąć udział w" },
          { "text": "take place", "pl": "odbywać się" },
          { "text": "take care of", "pl": "zająć się" },
          { "text": "take advantage of", "pl": "wykorzystać" }
        ]
      },
      {
        "label": "Z HAVE / GET",
        "phrases": [
          { "text": "have a good time", "pl": "dobrze się bawić" },
          { "text": "have an effect on", "pl": "mieć wpływ na" },
          { "text": "get married", "pl": "brać ślub" },
          { "text": "get in touch with", "pl": "skontaktować się z" },
          { "text": "get rid of", "pl": "pozbyć się" },
          { "text": "get the impression", "pl": "odnieść wrażenie" }
        ]
      },
      {
        "label": "Z PAY / KEEP",
        "phrases": [
          { "text": "pay attention to", "pl": "zwracać uwagę na" },
          { "text": "pay a visit", "pl": "złożyć wizytę" },
          { "text": "keep in touch", "pl": "utrzymywać kontakt" },
          { "text": "keep a secret", "pl": "dochować tajemnicy" },
          { "text": "keep an eye on", "pl": "mieć na oku" }
        ]
      },
      {
        "label": "Przymiotnik + przyimek",
        "phrases": [
          { "text": "good at", "pl": "dobry z / w" },
          { "text": "interested in", "pl": "zainteresowany" },
          { "text": "afraid of", "pl": "bojący się" },
          { "text": "responsible for", "pl": "odpowiedzialny za" },
          { "text": "similar to", "pl": "podobny do" },
          { "text": "different from", "pl": "inny niż" },
          { "text": "aware of", "pl": "świadomy" },
          { "text": "capable of", "pl": "zdolny do" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Przyimki po przymiotnikach to najczęstsza luka jednosłowna w arkuszu. „Good AT”, nie „good in”. „Different FROM”, nie „different than” (choć amerykański dopuszcza „than”, CKE trzyma się normy brytyjskiej)."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się",
    "items": [
      { "before": "You need to ", "after": " a decision soon.", "accept": ["make", "take"], "hint": "decyzja", "pl": "Musisz wkrótce podjąć decyzję." },
      { "before": "I have to ", "after": " my homework before dinner.", "accept": ["do"], "hint": "obowiązek", "pl": "Muszę odrobić lekcje przed kolacją." },
      { "before": "She is very good ", "after": " maths.", "accept": ["at"], "hint": "przyimek po good", "pl": "Jest bardzo dobra z matematyki." },
      { "before": "The conference will take ", "after": " in June.", "accept": ["place"], "hint": "odbywać się", "pl": "Konferencja odbędzie się w czerwcu." },
      { "before": "Please pay ", "after": " to the instructions.", "accept": ["attention"], "hint": "zwracać uwagę", "pl": "Zwróć uwagę na polecenie." },
      { "before": "He is responsible ", "after": " the whole project.", "accept": ["for"], "hint": "przyimek po responsible", "pl": "Odpowiada za cały projekt." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Czasownik → rzeczownik",
    "pairs": [
      { "left": "make", "right": "a mistake" },
      { "left": "do", "right": "the shopping" },
      { "left": "take", "right": "part in" },
      { "left": "pay", "right": "attention" },
      { "left": "keep", "right": "in touch" },
      { "left": "get", "right": "rid of" }
    ]
  },
  {
    "type": "quiz",
    "question": "„The teacher asked us to ___ research on the topic.”",
    "options": ["make", "do", "take"],
    "correctIndex": 1,
    "explanation": "Kolokacja to „do research”. Research jest przy tym niepoliczalne — nie ma formy „researches”."
  }
]$content$,
  10
);
