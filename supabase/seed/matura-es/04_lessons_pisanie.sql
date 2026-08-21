-- ============================================================================
-- supabase/seed/matura-es/04_lessons_pisanie.sql
-- Spanish theory for "Wypowiedź pisemna", both levels.
--
-- This section is worth 12 points at podstawowa and 13 at rozszerzona — on the
-- extended paper that is the single heaviest part of the exam, roughly a
-- quarter of everything available. It is also the part where a student can
-- gain the most from theory, because the marking criteria are published and
-- fixed: you can be taught exactly what an examiner is counting.
--
-- The lessons are therefore organised around the rubric rather than around
-- "how to write well": one lesson per criterion group, then the forms, then
-- the phrase banks. The rubric totals are structural facts of the current CKE
-- format, not estimates — see lib/matura/constants.ts MATURA_WRITING_MAX_POINTS
-- and lib/matura/writing-grading.ts, which primes the AI grader with the same
-- criteria the student reads here. The two must not drift apart.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'es' and slug = 'pisanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Jak to jest oceniane
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'jak-to-jest-oceniane',
  'Jak to jest oceniane — 12 punktów',
  'Cztery kryteria CKE, zasada gilotyny i najtańsze punkty w całym arkuszu.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "Wypowiedź pisemna na poziomie podstawowym to 12 punktów rozdzielonych na cztery kryteria. Egzaminator nie ocenia „czy ładnie napisane” — sprawdza konkretną listę. Kto zna listę, pisze pod nią."
  },
  {
    "type": "table",
    "title": "Cztery kryteria",
    "headers": ["Kryterium", "Punkty", "Co decyduje"],
    "rows": [
      ["Treść", "0-5", "czy wszystkie 4 podpunkty polecenia są rozwinięte"],
      ["Spójność i logika", "0-2", "czy tekst się klei: akapity, spójniki, kolejność"],
      ["Zakres środków językowych", "0-3", "czy słownictwo i struktury są urozmaicone"],
      ["Poprawność środków językowych", "0-2", "gramatyka, ortografia, interpunkcja"]
    ],
    "caption": "Razem 12. Treść jest warta najwięcej — i jest najłatwiejsza do zdobycia."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "ZASADA GILOTYNY. Jeśli napiszesz mniej niż 80 słów, punktowane jest TYLKO kryterium treści — pozostałe trzy dostają automatycznie zero. Z 12 punktów zostaje maksymalnie 5. Licz słowa."
  },
  {
    "type": "table",
    "title": "Kryterium treści — jak liczą punkty",
    "headers": ["Ile podpunktów rozwiniętych", "Punkty"],
    "rows": [
      ["4 z 4, każdy rozwinięty", "5"],
      ["4 wspomniane, 2-3 rozwinięte", "4"],
      ["3 rozwinięte", "3"],
      ["2 rozwinięte", "2"],
      ["1 rozwinięty", "1"],
      ["temat pominięty lub praca nie na temat", "0"]
    ],
    "caption": "„Rozwinięty” znaczy: co najmniej dwa zdania, w tym jedno konkretne. Samo wzmiankowanie to za mało."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Najtańsze punkty w całym arkuszu: przepisz sobie cztery podpunkty polecenia na brudnopis, napisz do każdego dwa zdania, a potem odhacz je jeden po drugim. Większość strat w tym kryterium to zwyczajne pominięcie podpunktu, nie brak języka."
  },
  {
    "type": "table",
    "title": "Zakres i poprawność — co je podnosi",
    "headers": ["Zakres (0-3)", "Poprawność (0-2)"],
    "rows": [
      ["różne czasy, nie tylko presente", "zgodność rodzaju i liczby"],
      ["konektory: sin embargo, además", "ser vs estar, por vs para"],
      ["zwroty idiomatyczne", "akcenty graficzne (tildes)"],
      ["brak powtórzeń tego samego słowa", "znaki ¿ i ¡ na początku"],
      ["zdania złożone, nie tylko proste", "poprawne formy nieregularne"]
    ]
  },
  {
    "type": "quiz",
    "question": "Napisałeś 74 słowa, rozwinąłeś wszystkie cztery podpunkty i nie masz błędów. Ile możesz dostać?",
    "options": ["12 punktów", "maksymalnie 5 punktów", "9 punktów"],
    "correctIndex": 1,
    "explanation": "Poniżej 80 słów działa gilotyna: liczy się tylko treść, czyli maksymalnie 5 punktów. Bezbłędny język nie ratuje za krótkiej pracy — to najdroższy możliwy błąd."
  },
  {
    "type": "quiz",
    "question": "Polecenie ma cztery podpunkty. Rozwinąłeś trzy, czwarty tylko wspomniałeś jednym zdaniem. Ile punktów za treść?",
    "options": ["5", "4", "3"],
    "correctIndex": 1,
    "explanation": "Wszystkie cztery zostały odniesione, ale tylko trzy rozwinięte — to 4 punkty. Dopisanie jednego zdania do czwartego podpunktu kosztowałoby minutę i dało piąty punkt."
  }
]$content$,
  1
);

-- ----------------------------------------------------------------------------
-- 2. E-mail
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'email',
  'E-mail — budowa i zwroty',
  'Najczęstsza forma na podstawie. Szkielet, który działa dla każdego tematu.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "E-mail na poziomie podstawowym ma 100-150 słów i cztery podpunkty do rozwinięcia. Struktura jest zawsze taka sama, więc warto ją mieć w głowie gotową — wtedy na egzaminie myślisz o treści, nie o układzie."
  },
  {
    "type": "table",
    "title": "Szkielet e-maila",
    "headers": ["Część", "Ile zdań", "Co tam wchodzi"],
    "rows": [
      ["Powitanie", "1", "Hola Ana / Querido Juan"],
      ["Wstęp", "1-2", "po co piszesz, nawiązanie"],
      ["Rozwinięcie", "6-8", "cztery podpunkty, po dwa zdania"],
      ["Zakończenie", "1-2", "prośba o odpowiedź, pozdrowienia"],
      ["Podpis", "1", "imię"]
    ],
    "caption": "Cztery akapity wystarczą. Podział na akapity to część kryterium spójności — jeden blok tekstu kosztuje punkt."
  },
  {
    "type": "keyPhrases",
    "title": "Zwroty, które zawsze pasują",
    "caption": "Rejestr nieformalny — do kolegi. Do osoby nieznanej użyj usted i zwrotów z lekcji o rejestrze.",
    "groups": [
      {
        "label": "Powitanie",
        "phrases": [
          { "text": "¡Hola, Marta!", "pl": "Cześć, Marta!" },
          { "text": "Querido Juan / Querida Ana", "pl": "Drogi Juanie / Droga Ano" },
          { "text": "¿Qué tal? ¿Cómo estás?", "pl": "Co słychać? Jak się masz?" }
        ]
      },
      {
        "label": "Wstęp",
        "phrases": [
          { "text": "Te escribo porque…", "pl": "Piszę do ciebie, bo…" },
          { "text": "Perdona que no te haya escrito antes.", "pl": "Wybacz, że nie pisałem wcześniej." },
          { "text": "Tengo muchas ganas de contarte…", "pl": "Bardzo chcę ci opowiedzieć…" },
          { "text": "¿Sabes qué? La semana pasada…", "pl": "Wiesz co? W zeszłym tygodniu…" }
        ]
      },
      {
        "label": "Rozwinięcie",
        "phrases": [
          { "text": "En primer lugar…", "pl": "Po pierwsze…" },
          { "text": "Lo mejor fue que…", "pl": "Najlepsze było to, że…" },
          { "text": "Lo que más me gustó fue…", "pl": "Najbardziej podobało mi się…" },
          { "text": "Por cierto, …", "pl": "Przy okazji…" },
          { "text": "Además, …", "pl": "Poza tym…" }
        ]
      },
      {
        "label": "Zakończenie",
        "phrases": [
          { "text": "Escríbeme pronto.", "pl": "Napisz szybko." },
          { "text": "Espero tu respuesta.", "pl": "Czekam na odpowiedź." },
          { "text": "Un abrazo,", "pl": "Uściski," },
          { "text": "Besos,", "pl": "Buziaki," },
          { "text": "Hasta pronto,", "pl": "Do zobaczenia wkrótce," }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Trzymaj jeden rejestr od początku do końca. Jeśli zacząłeś na „tú”, nie przechodź nagle na „usted” — mieszanie rejestrów jest liczone jako błąd w kryterium poprawności."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Wpleć co najmniej jeden czas przeszły i jedną konstrukcję z przyszłością („voy a…”). Sam presente przez całą pracę to sufit trzech punktów za zakres."
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdania do e-maila",
    "instruction": "Typowe zdania z rozwinięcia.",
    "items": [
      { "correct": ["Te", "escribo", "para", "contarte", "una", "buena", "noticia"], "pl": "Piszę, żeby opowiedzieć ci dobrą nowinę.", "note": "PARA + bezokolicznik = cel." },
      { "correct": ["Lo", "que", "más", "me", "gustó", "fue", "la", "comida"], "pl": "Najbardziej podobało mi się jedzenie.", "note": "„Lo que más me gustó” to gotowa, wysoko punktowana konstrukcja." },
      { "correct": ["Espero", "que", "puedas", "venir", "conmigo"], "pl": "Mam nadzieję, że będziesz mógł pójść ze mną.", "note": "Esperar que + subjuntivo — nawet na podstawie robi bardzo dobre wrażenie." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zakończenie pasuje do e-maila do kolegi?",
    "options": ["Le saluda atentamente,", "Un abrazo,", "Reciba un cordial saludo,"],
    "correctIndex": 1,
    "explanation": "„Un abrazo” to rejestr nieformalny. Pozostałe dwa są formalne i pasowałyby do listu do instytucji — w e-mailu do kolegi zabrzmiałyby jak pomyłka."
  }
]$content$,
  2
);

-- ----------------------------------------------------------------------------
-- 3. Wpis na blogu i na forum
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'wpis-blog-forum',
  'Wpis na blogu i na forum',
  'Czym różnią się od e-maila i jak wyrazić opinię, żeby zdobyć punkty za zakres.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Blog i forum mają tę samą długość i tę samą punktację co e-mail, ale inny odbiorcę: piszesz do wielu osób naraz, nie do jednego znajomego. Zmienia to powitanie, zakończenie i to, ile miejsca poświęcasz na opinię."
  },
  {
    "type": "compare",
    "title": "Trzy formy obok siebie",
    "columns": [
      {
        "title": "E-MAIL",
        "formula": "do jednej znanej osoby",
        "whenToUse": "relacja z wydarzenia, zaproszenie, prośba",
        "examples": ["Hola Ana, ¿qué tal?", "Un abrazo, Marta"]
      },
      {
        "title": "BLOG",
        "formula": "do czytelników, osobiście",
        "whenToUse": "relacja plus refleksja, wrażenia, opinia",
        "examples": ["Hola a todos:", "¿Y vosotros qué pensáis?"]
      },
      {
        "title": "FORUM",
        "formula": "do społeczności, w dyskusji",
        "whenToUse": "odpowiedź na pytanie, rada, wymiana zdań",
        "examples": ["Hola a todos:", "Espero que os sirva."]
      }
    ]
  },
  {
    "type": "keyPhrases",
    "title": "Wyrażanie opinii",
    "caption": "W blogu i na forum opinia jest oczekiwana. Używaj różnych zwrotów — powtarzanie „creo que” obniża zakres.",
    "groups": [
      {
        "label": "Twoje zdanie",
        "phrases": [
          { "text": "En mi opinión, …", "pl": "Moim zdaniem…" },
          { "text": "Desde mi punto de vista, …", "pl": "Z mojego punktu widzenia…" },
          { "text": "Personalmente, creo que…", "pl": "Osobiście uważam, że…" },
          { "text": "Me parece que…", "pl": "Wydaje mi się, że…" },
          { "text": "Estoy convencido de que…", "pl": "Jestem przekonany, że…" }
        ]
      },
      {
        "label": "Zgoda i sprzeciw",
        "phrases": [
          { "text": "Estoy totalmente de acuerdo.", "pl": "Całkowicie się zgadzam." },
          { "text": "No estoy de acuerdo con…", "pl": "Nie zgadzam się z…" },
          { "text": "Hasta cierto punto sí, pero…", "pl": "Do pewnego stopnia tak, ale…" },
          { "text": "Depende de la situación.", "pl": "To zależy od sytuacji." }
        ]
      },
      {
        "label": "Zwrot do czytelników",
        "phrases": [
          { "text": "¿Qué opináis vosotros?", "pl": "A co wy o tym myślicie?" },
          { "text": "Dejadme un comentario.", "pl": "Zostawcie komentarz." },
          { "text": "Espero que os sirva.", "pl": "Mam nadzieję, że się przyda." }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zwrot do czytelników na końcu („¿Y vosotros qué pensáis?”) to jednocześnie naturalne zakończenie i sygnał dla egzaminatora, że rozpoznałeś formę. Kosztuje jedno zdanie."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uwaga na formę „vosotros” — w Ameryce Łacińskiej używa się „ustedes”, ale arkusze CKE są pisane pod normę hiszpańską. Trzymaj się vosotros i bądź konsekwentny w całym tekście."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzupełnij zwroty",
    "items": [
      { "before": "En mi ", "after": ", es una idea excelente.", "accept": ["opinión"], "hint": "moim zdaniem", "pl": "Moim zdaniem to świetny pomysł." },
      { "before": "No estoy de ", "after": " contigo.", "accept": ["acuerdo"], "hint": "nie zgadzam się", "pl": "Nie zgadzam się z tobą." },
      { "before": "Desde mi punto de ", "after": ", el problema es otro.", "accept": ["vista"], "hint": "z mojego punktu widzenia", "pl": "Z mojego punktu widzenia problem jest inny." },
      { "before": "¿Y ", "after": " qué pensáis?", "accept": ["vosotros"], "hint": "zwrot do czytelników", "pl": "A wy co o tym myślicie?" }
    ]
  }
]$content$,
  3
);

-- ----------------------------------------------------------------------------
-- 4. Najczęstsze błędy Polaków
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'najczestsze-bledy',
  'Najczęstsze błędy Polaków',
  'Lista rzeczy, które kosztują punkty w kryterium poprawności — i jak je wyłapać przed oddaniem pracy.',
  'gramatyka', 9,
  $content$[
  {
    "type": "intro",
    "text": "Kryterium poprawności to tylko 2 punkty, ale traci się je przewidywalnie: te same błędy wracają w pracach rok po roku. Wszystkie są do wyłapania w dwóch minutach kontroli na końcu."
  },
  {
    "type": "table",
    "title": "Dziesięć błędów, które wracają najczęściej",
    "headers": ["Błąd", "Źle", "Dobrze"],
    "rows": [
      ["ser zamiast estar", "Soy cansado.", "Estoy cansado."],
      ["brak a osobowego", "Veo mi hermano.", "Veo a mi hermano."],
      ["kalka z polskiego przy gustar", "Yo gusto el cine.", "Me gusta el cine."],
      ["zła zgodność rodzaju", "La problema es grave.", "El problema es grave."],
      ["liczba mnoga la gente", "La gente son amables.", "La gente es amable."],
      ["brak tildy", "El esta aqui.", "Él está aquí."],
      ["brak znaku otwierającego", "Como estas?", "¿Cómo estás?"],
      ["por/para na chybił trafił", "Gracias para tu ayuda.", "Gracias por tu ayuda."],
      ["pelo w liczbie mnogiej", "Tiene pelos rubios.", "Tiene el pelo rubio."],
      ["bezokolicznik zamiast subjuntivo", "Quiero que ir.", "Quiero que vayas."]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Kontrola przed oddaniem, w tej kolejności: (1) policz słowa, (2) sprawdź, czy są wszystkie cztery podpunkty, (3) przejrzyj same czasowniki — czy zgadza się osoba, (4) przejrzyj same rzeczowniki — czy zgadza się rodzajnik, (5) dopisz brakujące tildy i znaki ¿ ¡."
  },
  {
    "type": "fillGap",
    "title": "Znajdź i popraw",
    "instruction": "Wpisz poprawną formę.",
    "items": [
      { "before": "Hoy (yo) ", "after": " muy contento.", "accept": ["estoy"], "hint": "nastrój, nie cecha", "pl": "Dziś jestem bardzo zadowolony." },
      { "before": "Ayer vi ", "after": " mi profesora en el centro.", "accept": ["a"], "hint": "dopełnienie osobowe", "pl": "Wczoraj widziałem moją nauczycielkę w centrum." },
      { "before": "A nosotros nos ", "after": " mucho la música latina.", "accept": ["gusta"], "hint": "la música — liczba pojedyncza", "pl": "Bardzo lubimy muzykę latynoską." },
      { "before": "", "after": " gente de aquí es muy amable.", "accept": ["La", "la"], "hint": "rodzajnik", "pl": "Ludzie stąd są bardzo mili." },
      { "before": "Quiero que tú ", "after": " conmigo.", "accept": ["vengas"], "hint": "venir — subjuntivo po quiero que", "pl": "Chcę, żebyś poszedł ze mną." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Błąd → poprawna wersja",
    "pairs": [
      { "left": "Soy cansado", "right": "Estoy cansado" },
      { "left": "Yo gusto el cine", "right": "Me gusta el cine" },
      { "left": "La problema", "right": "El problema" },
      { "left": "Gracias para tu ayuda", "right": "Gracias por tu ayuda" },
      { "left": "Veo mi hermano", "right": "Veo a mi hermano" }
    ]
  }
]$content$,
  4
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5. Rozprawka — jak jest oceniana
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka-ocenianie',
  'Rozprawka — 13 punktów i co za nie dają',
  'Kryteria rozszerzenia różnią się od podstawy. Oto co dokładnie liczy egzaminator.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu wypowiedź pisemna jest warta 13 punktów z 50 — ponad jedną czwartą całego egzaminu i najcięższa część arkusza. Kryteria są podobne do podstawy, ale poprzeczka wyraźnie wyżej, a rozkład punktów inny."
  },
  {
    "type": "table",
    "title": "Cztery kryteria na rozszerzeniu",
    "headers": ["Kryterium", "Punkty", "Różnica wobec podstawy"],
    "rows": [
      ["Zgodność z poleceniem", "0-5", "nie tylko treść — także FORMA rozprawki"],
      ["Spójność i logika", "0-2", "wymagana wyraźna teza i wnioski"],
      ["Zakres środków językowych", "0-3", "oczekiwane struktury zaawansowane"],
      ["Poprawność środków językowych", "0-3", "o punkt więcej niż na podstawie"]
    ],
    "caption": "Razem 13. Poprawność waży więcej niż na podstawie — błędy kosztują realnie."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "GILOTYNA NA ROZSZERZENIU: próg to 160 słów, nie 80. Wymagany zakres to 200-250 słów. Poniżej 160 punktowana jest wyłącznie zgodność z poleceniem — maksymalnie 5 z 13."
  },
  {
    "type": "table",
    "title": "Co podnosi zakres do 3 punktów",
    "headers": ["Struktura", "Przykład"],
    "rows": [
      ["subjuntivo", "No cabe duda de que sea un tema polémico."],
      ["strona bierna lub se", "Se argumenta a menudo que…"],
      ["okresy warunkowe", "Si se aplicara esta medida, mejoraría…"],
      ["konstrukcje bezosobowe", "Cabe destacar que…"],
      ["konektory zaawansowane", "no obstante, por consiguiente, ahora bien"],
      ["zdania względne", "un fenómeno que afecta a millones"]
    ],
    "caption": "Trzy-cztery takie konstrukcje w całej pracy wystarczą. Nie chodzi o to, żeby pisać wyłącznie skomplikowanie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Kryterium „zgodność z poleceniem” obejmuje FORMĘ. Rozprawka za i przeciw musi mieć argumenty obu stron. Praca zawierająca wyłącznie argumenty za — choćby świetnie napisana — traci punkty w najcięższym kryterium."
  },
  {
    "type": "quiz",
    "question": "Napisałeś 240 słów, świetnym językiem, ale wyłącznie argumenty przeciw. Które kryterium ucierpi najbardziej?",
    "options": ["Zakres środków językowych", "Zgodność z poleceniem", "Poprawność"],
    "correctIndex": 1,
    "explanation": "Rozprawka za i przeciw wymaga obu stron. Brak jednej to niezgodność z poleceniem — czyli strata w kryterium wartym 5 punktów, najwięcej z całej czwórki."
  }
]$content$,
  5
);

-- ----------------------------------------------------------------------------
-- 6. Rozprawka — struktura
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka-struktura',
  'Rozprawka — struktura akapit po akapicie',
  'Gotowy szkielet na 200-250 słów: ile akapitów, ile zdań, co w którym.',
  'strategia', 11,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka za i przeciw ma sztywną budowę i to jest dobra wiadomość: na egzaminie nie wymyślasz kompozycji, tylko wypełniasz znany szkielet treścią. Cztery akapity, 200-250 słów."
  },
  {
    "type": "table",
    "title": "Szkielet",
    "headers": ["Akapit", "Słów", "Zawartość"],
    "rows": [
      ["Wstęp", "40-50", "wprowadzenie tematu + teza, że są dwie strony"],
      ["Argumenty ZA", "60-70", "2 argumenty, każdy z przykładem"],
      ["Argumenty PRZECIW", "60-70", "2 argumenty, każdy z przykładem"],
      ["Zakończenie", "40-50", "podsumowanie + własne stanowisko"]
    ],
    "caption": "Cztery akapity, wyraźnie oddzielone. Egzaminator ma zobaczyć strukturę na pierwszy rzut oka."
  },
  {
    "type": "compare",
    "title": "Dobra teza kontra zła teza",
    "columns": [
      {
        "title": "DOBRA",
        "formula": "zapowiada obie strony",
        "whenToUse": "we wstępie, po wprowadzeniu tematu",
        "examples": [
          "Este fenómeno tiene tanto ventajas como inconvenientes que merece la pena analizar.",
          "A continuación analizaré los argumentos a favor y en contra.",
          "Se trata de un tema polémico sobre el que existen opiniones muy diversas."
        ]
      },
      {
        "title": "ZŁA",
        "formula": "pytanie zamiast tezy",
        "whenToUse": "nigdy — to strata punktu za spójność",
        "examples": [
          "¿Es bueno o malo?",
          "En este texto voy a escribir sobre este tema.",
          "Hoy en día mucha gente habla de esto."
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Każdy argument buduj tak samo: TWIERDZENIE, potem UZASADNIENIE, potem PRZYKŁAD. Trzy zdania. Argument bez przykładu egzaminator liczy jako niepogłębiony."
  },
  {
    "type": "examples",
    "title": "Argument w trzech zdaniach",
    "items": [
      { "en": "En primer lugar, el teletrabajo ahorra mucho tiempo.", "pl": "Po pierwsze, praca zdalna oszczędza dużo czasu. — twierdzenie", "highlight": "En primer lugar" },
      { "en": "Al no tener que desplazarse, los empleados disponen de horas adicionales cada semana.", "pl": "Nie musząc dojeżdżać, pracownicy zyskują dodatkowe godziny tygodniowo. — uzasadnienie", "highlight": "Al no tener que" },
      { "en": "Por ejemplo, quien vive a una hora de la oficina recupera diez horas al mes.", "pl": "Na przykład ktoś, kto mieszka godzinę od biura, odzyskuje dziesięć godzin miesięcznie. — przykład", "highlight": "Por ejemplo" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W zakończeniu MUSI pojawić się twoje stanowisko. „Ambas posturas tienen razón” to nie stanowisko, tylko unik — i kosztuje punkt za spójność i logikę. Opowiedz się, choćby warunkowo."
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdania rozprawki",
    "instruction": "Typowe zdania ze wstępu i zakończenia.",
    "items": [
      { "correct": ["Este", "fenómeno", "tiene", "tanto", "ventajas", "como", "inconvenientes"], "pl": "Zjawisko to ma zarówno zalety, jak i wady.", "note": "„tanto… como…” to najlepsza konstrukcja na tezę." },
      { "correct": ["En", "conclusión", "considero", "que", "las", "ventajas", "superan", "los", "inconvenientes"], "pl": "Podsumowując, uważam, że zalety przewyższają wady.", "note": "Wyraźne stanowisko w zakończeniu — wymagane." },
      { "correct": ["Por", "un", "lado", "es", "más", "cómodo", "para", "los", "empleados"], "pl": "Z jednej strony jest to wygodniejsze dla pracowników.", "note": "„Por un lado… por otro lado…” porządkuje akapity ZA i PRZECIW." }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile akapitów powinna mieć rozprawka za i przeciw?",
    "options": ["Dwa: za i przeciw", "Cztery: wstęp, za, przeciw, zakończenie", "Jeden ciągły tekst"],
    "correctIndex": 1,
    "explanation": "Cztery akapity to standard oczekiwany przez egzaminatora. Dwa akapity gubią wstęp i wnioski, a jeden blok tekstu automatycznie obniża ocenę za spójność."
  }
]$content$,
  6
);

-- ----------------------------------------------------------------------------
-- 7. Język rozprawki
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'jezyk-rozprawki',
  'Język rozprawki — bank zwrotów',
  'Gotowe wyrażenia na każdy akapit. To one dają punkty za zakres środków językowych.',
  'slownictwo', 12,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka nagradza rejestr formalny i bezosobowy. Zamiast „yo pienso” lepiej „cabe señalar que”, zamiast „mucha gente dice” — „se argumenta a menudo que”. Ten bank zwrotów wystarczy na każdy temat, jaki może się pojawić."
  },
  {
    "type": "keyPhrases",
    "title": "Zwroty według akapitu",
    "caption": "Wybierz dwa-trzy z każdej grupy i naucz się ich na pamięć. Reszta to już tylko treść.",
    "groups": [
      {
        "label": "Wstęp",
        "phrases": [
          { "text": "Hoy en día se debate mucho sobre…", "pl": "Dziś dużo dyskutuje się o…" },
          { "text": "Se trata de un tema polémico.", "pl": "To temat kontrowersyjny." },
          { "text": "Este fenómeno tiene tanto ventajas como inconvenientes.", "pl": "Zjawisko to ma zarówno zalety, jak i wady." },
          { "text": "A continuación analizaré ambas posturas.", "pl": "Poniżej przeanalizuję oba stanowiska." },
          { "text": "Cabe preguntarse si…", "pl": "Warto zapytać, czy…" }
        ]
      },
      {
        "label": "Argumenty ZA",
        "phrases": [
          { "text": "En primer lugar, …", "pl": "Po pierwsze…" },
          { "text": "Una de las principales ventajas es que…", "pl": "Jedną z głównych zalet jest to, że…" },
          { "text": "Cabe destacar que…", "pl": "Warto podkreślić, że…" },
          { "text": "Es innegable que…", "pl": "Nie da się zaprzeczyć, że…" },
          { "text": "Asimismo, conviene señalar que…", "pl": "Warto też wskazać, że…" }
        ]
      },
      {
        "label": "Argumenty PRZECIW",
        "phrases": [
          { "text": "Por otro lado, …", "pl": "Z drugiej strony…" },
          { "text": "Sin embargo, no todo son ventajas.", "pl": "Jednak nie same zalety." },
          { "text": "No obstante, hay que tener en cuenta que…", "pl": "Niemniej trzeba wziąć pod uwagę, że…" },
          { "text": "El principal inconveniente reside en…", "pl": "Główna wada tkwi w…" },
          { "text": "Ahora bien, …", "pl": "Z drugiej jednak strony…" }
        ]
      },
      {
        "label": "Zakończenie",
        "phrases": [
          { "text": "En conclusión, …", "pl": "Podsumowując…" },
          { "text": "A modo de conclusión, …", "pl": "Tytułem podsumowania…" },
          { "text": "Teniendo en cuenta lo expuesto, …", "pl": "Biorąc pod uwagę powyższe…" },
          { "text": "En mi opinión, las ventajas superan los inconvenientes.", "pl": "Moim zdaniem zalety przeważają nad wadami." },
          { "text": "Todo apunta a que…", "pl": "Wszystko wskazuje na to, że…" }
        ]
      },
      {
        "label": "Konstrukcje bezosobowe",
        "phrases": [
          { "text": "Se argumenta a menudo que…", "pl": "Często się argumentuje, że…" },
          { "text": "Se suele afirmar que…", "pl": "Zwykle twierdzi się, że…" },
          { "text": "Es evidente que…", "pl": "Jest oczywiste, że…" },
          { "text": "Resulta difícil negar que…", "pl": "Trudno zaprzeczyć, że…" },
          { "text": "Conviene recordar que…", "pl": "Warto przypomnieć, że…" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Kilka z tych zwrotów rządzi trybem. Po „no cabe duda de que” idzie indicativo (fakt), ale po „es posible que” — subjuntivo. Nauczywszy się zwrotu, naucz się też, co po nim stoi."
  },
  {
    "type": "table",
    "title": "Zwrot i tryb po nim",
    "headers": ["Zwrot", "Tryb", "Przykład"],
    "rows": [
      ["es evidente que", "indicativo", "Es evidente que existe un problema."],
      ["no cabe duda de que", "indicativo", "No cabe duda de que ayuda."],
      ["es posible que", "subjuntivo", "Es posible que empeore."],
      ["es necesario que", "subjuntivo", "Es necesario que actuemos."],
      ["no creo que", "subjuntivo", "No creo que sea suficiente."],
      ["de ahí que", "subjuntivo", "De ahí que resulte tan polémico."]
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: tryb po zwrocie",
    "items": [
      { "before": "Es evidente que este problema ", "after": " grave.", "accept": ["es"], "hint": "ser — po es evidente que idzie fakt", "pl": "Jest oczywiste, że ten problem jest poważny." },
      { "before": "Es necesario que las autoridades ", "after": " medidas.", "accept": ["tomen"], "hint": "tomar — es necesario que", "pl": "Konieczne jest, by władze podjęły działania." },
      { "before": "No creo que la situación ", "after": " pronto.", "accept": ["mejore"], "hint": "mejorar — no creo que", "pl": "Nie sądzę, żeby sytuacja szybko się poprawiła." },
      { "before": "De ahí que este debate ", "after": " tan actual.", "accept": ["sea", "resulte"], "hint": "ser — de ahí que", "pl": "Stąd ta debata jest tak aktualna." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Funkcja → zwrot",
    "pairs": [
      { "left": "wprowadzić temat", "right": "Hoy en día se debate mucho sobre…" },
      { "left": "podkreślić argument", "right": "Cabe destacar que…" },
      { "left": "przejść do kontrargumentów", "right": "Por otro lado, …" },
      { "left": "podsumować", "right": "A modo de conclusión, …" },
      { "left": "uniknąć pierwszej osoby", "right": "Se argumenta a menudo que…" }
    ]
  }
]$content$,
  7
);

-- ----------------------------------------------------------------------------
-- 8. Rejestr formalny
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rejestr-formalny',
  'Rejestr formalny — czego unikać',
  'Kolokwializmy, które w rozprawce kosztują punkty, i ich formalne odpowiedniki.',
  'slownictwo', 8,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka wymaga rejestru formalnego. Wtrącenia z języka mówionego są w niej liczone jako błąd stylistyczny — nawet jeśli gramatycznie są bez zarzutu. Poniżej lista rzeczy, które najczęściej wpadają Polakom do wypracowania."
  },
  {
    "type": "table",
    "title": "Kolokwializm → wersja formalna",
    "headers": ["Unikaj", "Użyj", "Znaczenie"],
    "rows": [
      ["un montón de", "una gran cantidad de", "mnóstwo"],
      ["o sea", "es decir", "to znaczy"],
      ["vale", "de acuerdo", "w porządku"],
      ["tío / tía", "persona / individuo", "koleś"],
      ["súper / guay", "excelente / notable", "super"],
      ["cosas", "aspectos / factores / elementos", "rzeczy"],
      ["mucha gente dice", "se argumenta a menudo", "wiele osób mówi"],
      ["yo pienso que", "cabe señalar que", "myślę, że"],
      ["pero", "sin embargo / no obstante", "ale"],
      ["y también", "asimismo / además", "i również"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Słowo „cosas” jest najczęstszym objawem ubogiego zakresu. Prawie zawsze da się je zastąpić czymś konkretnym: aspectos, factores, elementos, cuestiones, circunstancias."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie zaczynaj zdania od „Y” ani od „Pero”. W rejestrze formalnym używa się „Asimismo” i „Sin embargo” — i za jedno i drugie dostajesz punkty w kryterium zakresu."
  },
  {
    "type": "matchPairs",
    "title": "Zamień na formalne",
    "pairs": [
      { "left": "un montón de", "right": "una gran cantidad de" },
      { "left": "o sea", "right": "es decir" },
      { "left": "pero", "right": "sin embargo" },
      { "left": "cosas", "right": "aspectos" },
      { "left": "mucha gente dice", "right": "se argumenta a menudo" },
      { "left": "yo pienso que", "right": "cabe señalar que" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: podnieś rejestr",
    "instruction": "Wpisz formalny odpowiednik.",
    "items": [
      { "before": "Existe ", "after": " de estudios sobre el tema.", "accept": ["una gran cantidad"], "hint": "zamiast „un montón”", "pl": "Istnieje wiele badań na ten temat." },
      { "before": "", "after": ", conviene analizar ambas posturas.", "accept": ["Sin embargo", "No obstante"], "hint": "zamiast „pero”", "pl": "Jednak warto przeanalizować oba stanowiska." },
      { "before": "Hay varios ", "after": " que influyen en el resultado.", "accept": ["factores", "aspectos", "elementos"], "hint": "zamiast „cosas”", "pl": "Jest kilka czynników wpływających na wynik." },
      { "before": "", "after": " a menudo que la tecnología aísla.", "accept": ["Se argumenta", "se argumenta"], "hint": "zamiast „mucha gente dice”", "pl": "Często argumentuje się, że technologia izoluje." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie pasuje do rozprawki?",
    "options": [
      "Yo pienso que hay un montón de cosas buenas.",
      "Cabe señalar que existen numerosos aspectos positivos.",
      "O sea, es súper bueno."
    ],
    "correctIndex": 1,
    "explanation": "Drugie zdanie jest bezosobowe, precyzyjne i formalne — dokładnie to, co nagradza kryterium zakresu. Pierwsze i trzecie należą do rejestru mówionego."
  }
]$content$,
  8
);
