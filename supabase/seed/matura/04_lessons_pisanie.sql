-- ============================================================================
-- supabase/seed/matura/04_lessons_pisanie.sql
-- English theory for "Wypowiedź pisemna", both levels.
--
-- Worth 12 points at podstawowa and 13 at rozszerzona — on the extended paper
-- the single heaviest part of the exam. It is also where theory pays off most,
-- because the marking criteria are published and fixed: a student can be
-- taught exactly what an examiner counts.
--
-- Organised around the rubric rather than around "how to write well", the same
-- way as ../matura-es/04_lessons_pisanie.sql. The rubric totals must stay in
-- step with lib/matura/constants.ts and lib/matura/writing-grading.ts, which
-- primes the AI grader with the same criteria the student reads here.
--
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (
  select id from matura_sections where language = 'en' and slug = 'pisanie'
);

-- ============================================================================
-- POZIOM PODSTAWOWY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'jak-to-jest-oceniane',
  'Jak to jest oceniane — 12 punktów',
  'Cztery kryteria CKE, zasada gilotyny i najtańsze punkty w całym arkuszu.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "Wypowiedź pisemna na podstawie to 12 punktów w czterech kryteriach. Egzaminator nie ocenia wrażenia — sprawdza listę. Kto zna listę, pisze pod nią i zbiera punkty, których inni nie widzą."
  },
  {
    "type": "table",
    "title": "Cztery kryteria",
    "headers": ["Kryterium", "Punkty", "Co decyduje"],
    "rows": [
      ["Treść", "0-5", "czy wszystkie 4 podpunkty polecenia są rozwinięte"],
      ["Spójność i logika", "0-2", "akapity, spójniki, kolejność myśli"],
      ["Zakres środków językowych", "0-3", "urozmaicone słownictwo i struktury"],
      ["Poprawność środków językowych", "0-2", "gramatyka, ortografia, interpunkcja"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "ZASADA GILOTYNY. Poniżej 80 słów punktowane jest TYLKO kryterium treści — pozostałe trzy dostają zero. Z 12 punktów zostaje maksymalnie 5. Policz słowa przed oddaniem pracy."
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
      ["praca nie na temat", "0"]
    ],
    "caption": "„Rozwinięty” = co najmniej dwa zdania, w tym jedno konkretne. Samo wzmiankowanie nie wystarcza."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Najtańsze punkty w arkuszu: wypisz cztery podpunkty na brudnopis, napisz do każdego dwa zdania i odhacz je. Większość strat w tym kryterium to zwykłe pominięcie podpunktu, nie brak języka."
  },
  {
    "type": "table",
    "title": "Zakres i poprawność — co je podnosi",
    "headers": ["Zakres (0-3)", "Poprawność (0-2)"],
    "rows": [
      ["różne czasy, nie tylko present simple", "końcówka -s w trzeciej osobie"],
      ["spójniki: however, although, moreover", "poprawne formy nieregularne"],
      ["phrasal verbs i kolokacje", "przedimki a / an / the"],
      ["brak powtórzeń tego samego słowa", "przyimki po czasownikach"],
      ["zdania złożone, nie tylko proste", "szyk: podmiot przed orzeczeniem"]
    ]
  },
  {
    "type": "quiz",
    "question": "Napisałeś 76 słów, rozwinąłeś wszystkie cztery podpunkty, bez błędów. Ile możesz dostać?",
    "options": ["12 punktów", "maksymalnie 5 punktów", "10 punktów"],
    "correctIndex": 1,
    "explanation": "Poniżej 80 słów działa gilotyna — liczy się wyłącznie treść, czyli maksymalnie 5. Bezbłędny język nie ratuje za krótkiej pracy."
  },
  {
    "type": "quiz",
    "question": "Rozwinąłeś trzy podpunkty, czwarty wspomniałeś jednym zdaniem. Ile za treść?",
    "options": ["5", "4", "3"],
    "correctIndex": 1,
    "explanation": "Wszystkie cztery zostały odniesione, ale rozwinięte tylko trzy — 4 punkty. Jedno dodatkowe zdanie dałoby piąty."
  }
]$content$,
  1
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'email',
  'E-mail — budowa i zwroty',
  'Najczęstsza forma na podstawie. Szkielet, który działa dla każdego tematu.',
  'strategia', 10,
  $content$[
  {
    "type": "intro",
    "text": "E-mail na podstawie ma 100-150 słów i cztery podpunkty. Struktura jest zawsze taka sama, więc warto mieć ją gotową w głowie — wtedy na egzaminie myślisz o treści, nie o układzie."
  },
  {
    "type": "table",
    "title": "Szkielet e-maila",
    "headers": ["Część", "Ile zdań", "Co tam wchodzi"],
    "rows": [
      ["Powitanie", "1", "Hi Tom, / Dear Anna,"],
      ["Wstęp", "1-2", "po co piszesz, nawiązanie"],
      ["Rozwinięcie", "6-8", "cztery podpunkty, po dwa zdania"],
      ["Zakończenie", "1-2", "prośba o odpowiedź, pozdrowienia"],
      ["Podpis", "1", "imię"]
    ],
    "caption": "Cztery akapity. Podział na akapity to część kryterium spójności — jeden blok tekstu kosztuje punkt."
  },
  {
    "type": "keyPhrases",
    "title": "Zwroty, które zawsze pasują",
    "caption": "Rejestr nieformalny. Do instytucji potrzebny jest rejestr formalny — patrz lekcja o rejestrze.",
    "groups": [
      {
        "label": "Powitanie",
        "phrases": [
          { "text": "Hi Tom,", "pl": "Cześć Tom," },
          { "text": "Dear Anna,", "pl": "Droga Anno," },
          { "text": "How are you?", "pl": "Jak się masz?" },
          { "text": "Long time no see!", "pl": "Dawno się nie widzieliśmy!" }
        ]
      },
      {
        "label": "Wstęp",
        "phrases": [
          { "text": "I'm writing to tell you about…", "pl": "Piszę, żeby opowiedzieć ci o…" },
          { "text": "Sorry I haven't written for so long.", "pl": "Przepraszam, że tak długo nie pisałem." },
          { "text": "Guess what happened last week!", "pl": "Zgadnij, co się stało w zeszłym tygodniu!" },
          { "text": "Thanks for your last email.", "pl": "Dzięki za ostatniego maila." }
        ]
      },
      {
        "label": "Rozwinięcie",
        "phrases": [
          { "text": "First of all, …", "pl": "Przede wszystkim…" },
          { "text": "The best part was…", "pl": "Najlepsze było…" },
          { "text": "What I liked most was…", "pl": "Najbardziej podobało mi się…" },
          { "text": "By the way, …", "pl": "Przy okazji…" },
          { "text": "Anyway, …", "pl": "W każdym razie…" }
        ]
      },
      {
        "label": "Zakończenie",
        "phrases": [
          { "text": "Write back soon.", "pl": "Napisz szybko." },
          { "text": "Let me know what you think.", "pl": "Daj znać, co sądzisz." },
          { "text": "Hope to hear from you soon.", "pl": "Mam nadzieję, że wkrótce się odezwiesz." },
          { "text": "Take care,", "pl": "Trzymaj się," },
          { "text": "All the best,", "pl": "Wszystkiego dobrego," }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Trzymaj jeden rejestr. Jeśli zacząłeś „Hi Tom”, nie kończ „Yours faithfully” — mieszanie rejestrów liczy się jako błąd."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Wpleć co najmniej jeden czas przeszły, jeden present perfect i jedną konstrukcję przyszłą. Sam present simple przez całą pracę to sufit trzech punktów za zakres."
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdania do e-maila",
    "items": [
      { "correct": ["I", "am", "writing", "to", "tell", "you", "about", "my", "holiday"], "pl": "Piszę, żeby opowiedzieć ci o moich wakacjach.", "note": "„I'm writing to…” to standardowe otwarcie." },
      { "correct": ["What", "I", "liked", "most", "was", "the", "food"], "pl": "Najbardziej podobało mi się jedzenie.", "note": "Konstrukcja cleft z „what” — wysoko punktowana." },
      { "correct": ["Let", "me", "know", "what", "you", "think"], "pl": "Daj znać, co o tym sądzisz.", "note": "Naturalne zakończenie, zaprasza do odpowiedzi." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zakończenie pasuje do e-maila do kolegi?",
    "options": ["Yours faithfully,", "Take care,", "I remain, Sir, your obedient servant,"],
    "correctIndex": 1,
    "explanation": "„Take care” to rejestr nieformalny. „Yours faithfully” należy do listu formalnego do osoby, której nazwiska nie znamy."
  }
]$content$,
  2
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'blog-forum',
  'Wpis na blogu i na forum',
  'Inny odbiorca niż w e-mailu i więcej miejsca na opinię.',
  'strategia', 8,
  $content$[
  {
    "type": "intro",
    "text": "Blog i forum mają tę samą długość i punktację co e-mail, ale piszesz do wielu osób naraz. Zmienia to powitanie, zakończenie i proporcje: więcej opinii, mniej relacji."
  },
  {
    "type": "compare",
    "title": "Trzy formy obok siebie",
    "columns": [
      {
        "title": "E-MAIL",
        "formula": "do jednej znanej osoby",
        "whenToUse": "relacja, zaproszenie, prośba",
        "examples": ["Hi Tom,", "Take care, Anna"]
      },
      {
        "title": "BLOG",
        "formula": "do czytelników, osobiście",
        "whenToUse": "relacja plus refleksja i opinia",
        "examples": ["Hi everyone!", "What do you think?"]
      },
      {
        "title": "FORUM",
        "formula": "do społeczności, w dyskusji",
        "whenToUse": "odpowiedź, rada, wymiana zdań",
        "examples": ["Hi all,", "Hope this helps."]
      }
    ]
  },
  {
    "type": "keyPhrases",
    "title": "Wyrażanie opinii",
    "caption": "Powtarzanie „I think” obniża zakres. Zmieniaj konstrukcje.",
    "groups": [
      {
        "label": "Twoje zdanie",
        "phrases": [
          { "text": "In my opinion, …", "pl": "Moim zdaniem…" },
          { "text": "From my point of view, …", "pl": "Z mojego punktu widzenia…" },
          { "text": "Personally, I believe that…", "pl": "Osobiście uważam, że…" },
          { "text": "It seems to me that…", "pl": "Wydaje mi się, że…" },
          { "text": "I'm convinced that…", "pl": "Jestem przekonany, że…" }
        ]
      },
      {
        "label": "Zgoda i sprzeciw",
        "phrases": [
          { "text": "I couldn't agree more.", "pl": "Nie mógłbym się bardziej zgodzić." },
          { "text": "I see your point, but…", "pl": "Rozumiem, ale…" },
          { "text": "I'm afraid I disagree.", "pl": "Obawiam się, że się nie zgadzam." },
          { "text": "It depends on the situation.", "pl": "To zależy od sytuacji." }
        ]
      },
      {
        "label": "Zwrot do czytelników",
        "phrases": [
          { "text": "What do you think?", "pl": "Co o tym sądzicie?" },
          { "text": "Leave a comment below.", "pl": "Zostawcie komentarz." },
          { "text": "Hope this helps!", "pl": "Mam nadzieję, że to pomoże!" }
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Pytanie do czytelników na końcu to jednocześnie naturalne zakończenie i sygnał, że rozpoznałeś formę. Kosztuje jedno zdanie, a widać je od razu."
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: uzupełnij zwroty",
    "items": [
      { "before": "In my ", "after": ", it's a great idea.", "accept": ["opinion", "view"], "hint": "moim zdaniem", "pl": "Moim zdaniem to świetny pomysł." },
      { "before": "I'm afraid I ", "after": " with you.", "accept": ["disagree"], "hint": "nie zgadzam się", "pl": "Obawiam się, że się z tobą nie zgadzam." },
      { "before": "From my point of ", "after": ", the problem is different.", "accept": ["view"], "hint": "z mojego punktu widzenia", "pl": "Z mojego punktu widzenia problem jest inny." },
      { "before": "It ", "after": " to me that nobody cares.", "accept": ["seems"], "hint": "wydaje mi się", "pl": "Wydaje mi się, że nikogo to nie obchodzi." }
    ]
  }
]$content$,
  3
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'najczestsze-bledy',
  'Najczęstsze błędy Polaków',
  'Lista rzeczy, które kosztują punkty w poprawności — i jak je wyłapać przed oddaniem.',
  'gramatyka', 9,
  $content$[
  {
    "type": "intro",
    "text": "Kryterium poprawności to tylko 2 punkty, ale traci się je przewidywalnie — te same błędy wracają w pracach rok po roku. Wszystkie da się wyłapać w dwie minuty kontroli."
  },
  {
    "type": "table",
    "title": "Dziesięć błędów, które wracają najczęściej",
    "headers": ["Błąd", "Źle", "Dobrze"],
    "rows": [
      ["brak -s w 3. osobie", "He live in Kraków.", "He lives in Kraków."],
      ["kalka „jestem zgodny”", "I am agree.", "I agree."],
      ["podwójny czas przeszły", "Did you went there?", "Did you go there?"],
      ["zły przyimek", "I'm good in maths.", "I'm good at maths."],
      ["liczba mnoga niepoliczalnych", "many informations", "much information"],
      ["brak przedimka", "I am student.", "I am a student."],
      ["szyk w pytaniu pośrednim", "I don't know where is it.", "I don't know where it is."],
      ["people jako l.poj.", "People is nice.", "People are nice."],
      ["since / for", "I live here since 3 years.", "I have lived here for 3 years."],
      ["to po look forward", "I look forward to see you.", "I look forward to seeing you."]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Kontrola przed oddaniem, w tej kolejności: (1) policz słowa, (2) sprawdź cztery podpunkty, (3) przejrzyj same czasowniki — czy jest -s i -ed, (4) przejrzyj rzeczowniki policzalne — czy mają przedimek, (5) sprawdź przyimki po czasownikach i przymiotnikach."
  },
  {
    "type": "fillGap",
    "title": "Znajdź i popraw",
    "items": [
      { "before": "My brother ", "after": " in London.", "accept": ["lives", "works"], "hint": "trzecia osoba", "pl": "Mój brat mieszka w Londynie." },
      { "before": "I ", "after": " with you completely.", "accept": ["agree"], "hint": "bez „am”", "pl": "Całkowicie się z tobą zgadzam." },
      { "before": "She is very good ", "after": " languages.", "accept": ["at"], "hint": "przyimek po good", "pl": "Jest bardzo dobra z języków." },
      { "before": "I have lived here ", "after": " five years.", "accept": ["for"], "hint": "okres, nie punkt", "pl": "Mieszkam tu od pięciu lat." },
      { "before": "I look forward to ", "after": " from you.", "accept": ["hearing"], "hint": "po „to” idzie -ing", "pl": "Czekam na wiadomość." },
      { "before": "I don't know where ", "after": ".", "accept": ["it is", "he is", "she is"], "hint": "pytanie pośrednie — szyk twierdzący", "pl": "Nie wiem, gdzie to jest." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Błąd → poprawna wersja",
    "pairs": [
      { "left": "I am agree", "right": "I agree" },
      { "left": "many informations", "right": "much information" },
      { "left": "good in maths", "right": "good at maths" },
      { "left": "since 3 years", "right": "for 3 years" },
      { "left": "People is nice", "right": "People are nice" }
    ]
  }
]$content$,
  4
);

-- ============================================================================
-- POZIOM ROZSZERZONY
-- ============================================================================

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka-ocenianie',
  'Rozprawka — 13 punktów i co za nie dają',
  'Kryteria rozszerzenia różnią się od podstawy. Oto co dokładnie liczy egzaminator.',
  'strategia', 9,
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu wypowiedź pisemna jest warta 13 punktów z 50 — ponad jedną czwartą egzaminu i najcięższa część arkusza. Kryteria przypominają te z podstawy, ale poprzeczka jest wyżej, a rozkład punktów inny."
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
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "GILOTYNA NA ROZSZERZENIU: próg to 160 słów, wymagany zakres 200-250. Poniżej 160 punktowana jest wyłącznie zgodność z poleceniem — maksymalnie 5 z 13."
  },
  {
    "type": "table",
    "title": "Co podnosi zakres do 3 punktów",
    "headers": ["Struktura", "Przykład"],
    "rows": [
      ["strona bierna", "It is often argued that…"],
      ["inwersja", "Not only does it save time, but…"],
      ["okresy warunkowe", "If this measure were introduced, …"],
      ["zdania względne", "a phenomenon which affects millions"],
      ["konstrukcje bezosobowe", "There is no denying that…"],
      ["konektory zaawansowane", "nevertheless, consequently, admittedly"]
    ],
    "caption": "Trzy-cztery takie konstrukcje w całej pracy wystarczą. Nie chodzi o pisanie wyłącznie skomplikowane."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Kryterium „zgodność z poleceniem” obejmuje FORMĘ. Rozprawka za i przeciw musi zawierać argumenty obu stron. Praca wyłącznie z argumentami za — choćby świetna językowo — traci w najcięższym kryterium."
  },
  {
    "type": "quiz",
    "question": "Napisałeś 240 słów świetnym językiem, ale wyłącznie argumenty przeciw. Które kryterium ucierpi najbardziej?",
    "options": ["Zakres środków językowych", "Zgodność z poleceniem", "Poprawność"],
    "correctIndex": 1,
    "explanation": "Rozprawka za i przeciw wymaga obu stron. Brak jednej to niezgodność z poleceniem — strata w kryterium wartym 5 punktów."
  }
]$content$,
  5
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka-struktura',
  'Rozprawka — struktura akapit po akapicie',
  'Gotowy szkielet na 200-250 słów: ile akapitów, ile zdań, co w którym.',
  'strategia', 11,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka za i przeciw ma sztywną budowę i to dobra wiadomość: na egzaminie nie wymyślasz kompozycji, tylko wypełniasz znany szkielet. Cztery akapity, 200-250 słów."
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
    ]
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
          "This phenomenon has both advantages and drawbacks worth examining.",
          "In this essay I will examine the arguments on both sides.",
          "It is a controversial issue on which opinions differ widely."
        ]
      },
      {
        "title": "ZŁA",
        "formula": "pytanie zamiast tezy",
        "whenToUse": "nigdy — to strata punktu za spójność",
        "examples": [
          "Is it good or bad?",
          "In this text I will write about this topic.",
          "Nowadays many people talk about this."
        ]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Każdy argument buduj tak samo: TWIERDZENIE, UZASADNIENIE, PRZYKŁAD. Trzy zdania. Argument bez przykładu egzaminator liczy jako niepogłębiony."
  },
  {
    "type": "examples",
    "title": "Argument w trzech zdaniach",
    "items": [
      { "en": "Firstly, remote work saves a considerable amount of time.", "pl": "Po pierwsze, praca zdalna oszczędza sporo czasu. — twierdzenie", "highlight": "Firstly" },
      { "en": "Since employees no longer commute, they gain extra hours every week.", "pl": "Skoro pracownicy nie dojeżdżają, zyskują dodatkowe godziny tygodniowo. — uzasadnienie", "highlight": "Since" },
      { "en": "For instance, someone living an hour from the office recovers ten hours a month.", "pl": "Na przykład ktoś mieszkający godzinę od biura odzyskuje dziesięć godzin miesięcznie. — przykład", "highlight": "For instance" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W zakończeniu MUSI pojawić się twoje stanowisko. „Both sides have a point” to nie stanowisko, tylko unik — i kosztuje punkt za spójność. Opowiedz się, choćby warunkowo."
  },
  {
    "type": "orderWords",
    "title": "Ułóż zdania rozprawki",
    "items": [
      { "correct": ["This", "issue", "has", "both", "advantages", "and", "disadvantages"], "pl": "Ta kwestia ma zarówno zalety, jak i wady.", "note": "„both… and…” to najprostsza dobra teza." },
      { "correct": ["To", "sum", "up", "the", "benefits", "outweigh", "the", "drawbacks"], "pl": "Podsumowując, korzyści przeważają nad wadami.", "note": "Wyraźne stanowisko w zakończeniu — wymagane." },
      { "correct": ["On", "the", "one", "hand", "it", "is", "much", "more", "convenient"], "pl": "Z jednej strony jest to o wiele wygodniejsze.", "note": "„On the one hand… on the other hand…” porządkuje akapity." }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile akapitów powinna mieć rozprawka za i przeciw?",
    "options": ["Dwa: za i przeciw", "Cztery: wstęp, za, przeciw, zakończenie", "Jeden ciągły tekst"],
    "correctIndex": 1,
    "explanation": "Cztery akapity to standard oczekiwany przez egzaminatora. Dwa gubią wstęp i wnioski, a jeden blok tekstu obniża ocenę za spójność."
  }
]$content$,
  6
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'pisanie'),
  'jezyk-rozprawki',
  'Język rozprawki — bank zwrotów',
  'Gotowe wyrażenia na każdy akapit. To one dają punkty za zakres środków językowych.',
  'slownictwo', 12,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka nagradza rejestr formalny i bezosobowy. Zamiast „I think” lepiej „It could be argued that”, zamiast „a lot of people say” — „it is widely believed that”. Ten bank zwrotów wystarczy na każdy temat."
  },
  {
    "type": "keyPhrases",
    "title": "Zwroty według akapitu",
    "caption": "Wybierz dwa-trzy z każdej grupy i naucz się na pamięć. Reszta to już tylko treść.",
    "groups": [
      {
        "label": "Wstęp",
        "phrases": [
          { "text": "Nowadays there is much debate about…", "pl": "Obecnie dużo się dyskutuje o…" },
          { "text": "This is a highly controversial issue.", "pl": "To bardzo kontrowersyjna kwestia." },
          { "text": "This phenomenon has both advantages and drawbacks.", "pl": "Zjawisko to ma zarówno zalety, jak i wady." },
          { "text": "In this essay I will examine both sides.", "pl": "W tym eseju przeanalizuję obie strony." },
          { "text": "It is worth considering whether…", "pl": "Warto rozważyć, czy…" }
        ]
      },
      {
        "label": "Argumenty ZA",
        "phrases": [
          { "text": "First and foremost, …", "pl": "Przede wszystkim…" },
          { "text": "One of the main benefits is that…", "pl": "Jedną z głównych korzyści jest to, że…" },
          { "text": "It should be emphasised that…", "pl": "Należy podkreślić, że…" },
          { "text": "There is no denying that…", "pl": "Nie da się zaprzeczyć, że…" },
          { "text": "What is more, …", "pl": "Co więcej…" }
        ]
      },
      {
        "label": "Argumenty PRZECIW",
        "phrases": [
          { "text": "On the other hand, …", "pl": "Z drugiej strony…" },
          { "text": "However, this is not the whole picture.", "pl": "Jednak to nie cały obraz." },
          { "text": "Nevertheless, it must be remembered that…", "pl": "Niemniej trzeba pamiętać, że…" },
          { "text": "The main drawback lies in…", "pl": "Główna wada tkwi w…" },
          { "text": "Admittedly, …", "pl": "Trzeba przyznać, że…" }
        ]
      },
      {
        "label": "Zakończenie",
        "phrases": [
          { "text": "To sum up, …", "pl": "Podsumowując…" },
          { "text": "All things considered, …", "pl": "Biorąc wszystko pod uwagę…" },
          { "text": "In the light of the above, …", "pl": "W świetle powyższego…" },
          { "text": "In my view, the benefits outweigh the drawbacks.", "pl": "Moim zdaniem korzyści przeważają nad wadami." },
          { "text": "Everything points to the conclusion that…", "pl": "Wszystko wskazuje na wniosek, że…" }
        ]
      },
      {
        "label": "Konstrukcje bezosobowe",
        "phrases": [
          { "text": "It is often argued that…", "pl": "Często argumentuje się, że…" },
          { "text": "It is widely believed that…", "pl": "Powszechnie uważa się, że…" },
          { "text": "It could be argued that…", "pl": "Można by argumentować, że…" },
          { "text": "It is worth noting that…", "pl": "Warto zauważyć, że…" },
          { "text": "Research suggests that…", "pl": "Badania sugerują, że…" }
        ]
      }
    ]
  },
  {
    "type": "table",
    "title": "Konektory według funkcji",
    "headers": ["Funkcja", "Wyrażenia"],
    "rows": [
      ["dodawanie", "moreover, furthermore, in addition, what is more"],
      ["przeciwstawienie", "however, nevertheless, on the contrary, whereas"],
      ["przyczyna", "because of, due to, owing to, since"],
      ["skutek", "therefore, consequently, as a result, thus"],
      ["przykład", "for instance, such as, namely"],
      ["podsumowanie", "to sum up, in conclusion, all in all"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„However” to nie „but” i nie łączy dwóch zdań przecinkiem. Poprawnie: „It is expensive. However, it is worth it.” albo „It is expensive; however, it is worth it.” Nigdy: „It is expensive, however it is worth it.”"
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: wstaw konektor",
    "items": [
      { "before": "The car is old. ", "after": ", it still works perfectly.", "accept": ["However", "Nevertheless"], "hint": "przeciwstawienie", "pl": "Samochód jest stary. Mimo to działa doskonale." },
      { "before": "He did not study at all. ", "after": ", he failed the exam.", "accept": ["Therefore", "Consequently", "As a result"], "hint": "skutek", "pl": "W ogóle się nie uczył. W rezultacie oblał." },
      { "before": "It is cheap and, what is ", "after": ", very reliable.", "accept": ["more"], "hint": "dodawanie", "pl": "Jest tani, a co więcej, bardzo niezawodny." },
      { "before": "It is often ", "after": " that technology isolates people.", "accept": ["argued", "believed", "claimed"], "hint": "konstrukcja bezosobowa", "pl": "Często argumentuje się, że technologia izoluje ludzi." }
    ]
  },
  {
    "type": "matchPairs",
    "title": "Funkcja → zwrot",
    "pairs": [
      { "left": "wprowadzić temat", "right": "Nowadays there is much debate about…" },
      { "left": "podkreślić argument", "right": "It should be emphasised that…" },
      { "left": "przejść do kontrargumentów", "right": "On the other hand, …" },
      { "left": "podsumować", "right": "All things considered, …" },
      { "left": "uniknąć pierwszej osoby", "right": "It is often argued that…" }
    ]
  }
]$content$,
  7
);

insert into matura_lessons (section_id, slug, title, summary, kind, estimated_minutes, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'pisanie'),
  'rejestr-formalny',
  'Rejestr formalny — czego unikać',
  'Kolokwializmy i skróty, które w rozprawce kosztują punkty, plus ich formalne odpowiedniki.',
  'slownictwo', 8,
  $content$[
  {
    "type": "intro",
    "text": "Rozprawka wymaga rejestru formalnego. Wtrącenia z języka mówionego liczą się jako błąd stylistyczny, nawet jeśli gramatycznie są bez zarzutu. Poniżej to, co najczęściej wpada Polakom do wypracowania."
  },
  {
    "type": "table",
    "title": "Kolokwializm → wersja formalna",
    "headers": ["Unikaj", "Użyj", "Znaczenie"],
    "rows": [
      ["a lot of / lots of", "a considerable number of", "wiele"],
      ["kids", "children / young people", "dzieci"],
      ["get", "obtain / receive / become", "dostać"],
      ["stuff / things", "aspects / factors / issues", "rzeczy"],
      ["big", "significant / substantial", "duży"],
      ["I think", "it could be argued that", "myślę, że"],
      ["but", "however / nevertheless", "ale"],
      ["so", "therefore / consequently", "więc"],
      ["what's more", "furthermore / moreover", "co więcej"],
      ["find out", "discover / establish", "dowiedzieć się"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Bez form skróconych. W rozprawce piszemy „it is”, nie „it's”; „do not”, nie „don't”. Skróty należą do rejestru mówionego i w e-mailu są w porządku, ale w rozprawce obniżają ocenę."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Nie zaczynaj zdania od „And”, „But” ani „So”. Odpowiedniki formalne — „Moreover”, „However”, „Therefore” — są zawsze bezpieczne i dodatkowo punktowane jako konektory."
  },
  {
    "type": "table",
    "title": "Czego jeszcze unikać",
    "headers": ["Unikaj", "Dlaczego", "Zamiast tego"],
    "rows": [
      ["phrasal verbs potocznych", "rejestr mówiony", "find out → discover"],
      ["pytań retorycznych w środku", "przerywają wywód", "stwierdzenie"],
      ["wykrzykników", "emocjonalne", "spokojne twierdzenie"],
      ["„you” w znaczeniu ogólnym", "zbyt bezpośrednie", "one / people"],
      ["„etc.”", "sugeruje brak pomysłów", "wymień konkretnie"]
    ]
  },
  {
    "type": "matchPairs",
    "title": "Zamień na formalne",
    "pairs": [
      { "left": "a lot of", "right": "a considerable number of" },
      { "left": "but", "right": "however" },
      { "left": "so", "right": "therefore" },
      { "left": "stuff", "right": "aspects" },
      { "left": "find out", "right": "discover" },
      { "left": "I think", "right": "it could be argued that" }
    ]
  },
  {
    "type": "fillGap",
    "title": "Sprawdź się: podnieś rejestr",
    "items": [
      { "before": "There is a ", "after": " number of studies on this topic.", "accept": ["considerable", "significant", "substantial"], "hint": "zamiast „a lot of”", "pl": "Istnieje wiele badań na ten temat." },
      { "before": "", "after": ", it is worth examining both sides.", "accept": ["However", "Nevertheless"], "hint": "zamiast „but”", "pl": "Jednak warto przeanalizować obie strony." },
      { "before": "Several ", "after": " influence the outcome.", "accept": ["factors", "aspects", "issues"], "hint": "zamiast „things”", "pl": "Kilka czynników wpływa na wynik." },
      { "before": "It is often ", "after": " that technology isolates us.", "accept": ["argued", "claimed", "believed"], "hint": "zamiast „people say”", "pl": "Często argumentuje się, że technologia nas izoluje." }
    ]
  },
  {
    "type": "quiz",
    "question": "Które zdanie pasuje do rozprawki?",
    "options": [
      "I think there's lots of good stuff about it.",
      "It could be argued that this solution offers significant benefits.",
      "So basically it's really great!"
    ],
    "correctIndex": 1,
    "explanation": "Drugie zdanie jest bezosobowe, precyzyjne i formalne — dokładnie to, co nagradza kryterium zakresu. Pozostałe dwa należą do rejestru mówionego."
  }
]$content$,
  8
);
