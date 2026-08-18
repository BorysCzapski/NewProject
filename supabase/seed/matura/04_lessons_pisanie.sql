-- ============================================================================
-- supabase/seed/matura/04_lessons_pisanie.sql
-- One lesson per poziom for "Wypowiedź pisemna" (matura_lessons). content is
-- a jsonb array of GrammarBlock (lib/grammar/lesson-blocks.ts). Criteria,
-- point splits, word-count rules and "what earns full marks" descriptions
-- are sourced from the official CKE "Informator o egzaminie maturalnym z
-- języka angielskiego (od roku szkolnego 2024/2025)" and cross-checked OKE
-- "Zasady oceniania" PDFs — see lib/matura/writing-grading.ts for the full
-- rubric text used by the AI grader. The worked examples are ORIGINAL texts
-- authored for this app (not copied CKE model answers), structured to match
-- the paragraph-by-paragraph pattern of real full-mark CKE sample answers.
--
-- Idempotent: deletes existing lessons for these sections first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where level = 'podstawowa' and slug = 'pisanie'),
  'Wypowiedź pisemna — jak zdobyć maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie podstawowym piszesz JEDNĄ wypowiedź (nie masz wyboru tematu): e-mail/wiadomość, wpis na blogu albo wpis na forum internetowym — zawsze styl nieformalny/neutralny. Długość: 100-150 słów. Polecenie zawsze zawiera 4 podpunkty, do których musisz się odnieść. Ta część to 12 punktów — 20% całego egzaminu."
  },
  {
    "type": "table",
    "title": "Kryteria oceniania (12 pkt razem)",
    "headers": ["Kryterium", "Punkty", "Co sprawdza"],
    "rows": [
      ["Treść", "0-5", "Czy odniosłeś się do WSZYSTKICH 4 podpunktów i czy każdy z nich ROZWINĄŁEŚ (nie tylko wspomniałeś)"],
      ["Spójność i logika", "0-2", "Czy tekst płynie jako całość, bez sprzecznych/nielogicznych fragmentów"],
      ["Zakres środków językowych", "0-3", "Różnorodność i precyzja słownictwa oraz struktur gramatycznych"],
      ["Poprawność środków językowych", "0-2", "Liczba błędów językowych względem długości tekstu"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Zasada gilotyny: jeśli Twoja praca ma mniej niż 80 słów, liczy się WYŁĄCZNIE kryterium „Treść” — pozostałe trzy kryteria automatycznie dostają 0 punktów, niezależnie od jakości języka. Zawsze pilnuj długości."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Najważniejsza zasada punktacji: samo wspomnienie podpunktu jednym zdaniem to za mało na 5/5 z treści. Każdy z 4 podpunktów rozwiń 1-2 zdaniami — dodaj konkret, przykład albo uzasadnienie. Zaadresowane, ale nierozwinięte podpunkty i tak obniżają ocenę."
  },
  {
    "type": "compare",
    "title": "Podnieś poziom słownictwa",
    "columns": [
      {
        "title": "Zamiast tego…",
        "whenToUse": "Ogólne, mało precyzyjne słowa — nisko punktowane w „zakresie środków”",
        "examples": ["It was very good.", "I was happy.", "There were a lot of people.", "I was scared."]
      },
      {
        "title": "…napisz to",
        "whenToUse": "Precyzyjne, naturalne sformułowania — wyżej punktowane",
        "examples": ["It was absolutely fantastic.", "I was thrilled.", "The place was packed.", "I was terrified."]
      }
    ]
  },
  {
    "type": "examples",
    "title": "Przydatne zwroty (styl nieformalny)",
    "items": [
      { "en": "I still can't believe what happened!", "pl": "Wciąż nie mogę uwierzyć, co się stało!", "highlight": "can't believe" },
      { "en": "Guess what happened to me yesterday!", "pl": "Zgadnij, co mi się wczoraj przydarzyło!", "highlight": "Guess what" },
      { "en": "Anyway, I'd better go now — write back soon!", "pl": "W każdym razie muszę już kończyć — odpisz szybko!", "highlight": "I'd better go" },
      { "en": "By the way, have you ever tried it yourself?", "pl": "A tak przy okazji, próbowałeś/aś tego kiedyś?", "highlight": "By the way" }
    ]
  },
  {
    "type": "intro",
    "text": "PRZYKŁAD NA 12/12 PUNKTÓW — polecenie: „Wziąłeś/wzięłaś udział w szkolnym konkursie talentów i zająłeś/zajęłaś pierwsze miejsce. Napisz wpis na blogu, w którym: napiszesz, jak dowiedziałeś/aś się o konkursie i zdecydowałeś/aś się wziąć w nim udział; opiszesz, jak się przygotowywałeś/aś; wyjaśnisz, co czułeś/aś podczas występu; opiszesz reakcję publiczności po ogłoszeniu wyników.”"
  },
  {
    "type": "intro",
    "text": "I still can't stop smiling — I WON!"
  },
  {
    "type": "intro",
    "text": "It all started when our form tutor mentioned the school talent show during registration. I'd never performed in public before, but a friend convinced me to sign up for the singing category, so I did it almost on a whim."
  },
  {
    "type": "intro",
    "text": "For the next three weeks, I practised every single evening after finishing my homework, and I even asked our music teacher for extra feedback on my breathing technique."
  },
  {
    "type": "intro",
    "text": "Walking onto that stage, my hands were shaking and my heart was racing, but the moment the music started, all the nerves simply disappeared and I just focused on enjoying myself."
  },
  {
    "type": "intro",
    "text": "When they announced my name as the winner, the whole hall burst into applause and my classmates were literally jumping out of their seats!"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Dlaczego to 12/12: (1) Treść — wszystkie 4 podpunkty zaadresowane I rozwinięte konkretem (kategoria konkursu, technika oddechowa, moment na scenie, reakcja klasy). (2) Spójność — jeden akapit = jeden wątek, naturalne przejścia czasowe (It all started… / For the next three weeks… / Walking onto that stage… / When they announced…). (3) Zakres środków — Past Perfect (I'd never performed), imiesłów czynny (Walking onto that stage), naturalne zwroty (on a whim, burst into applause, jumping out of their seats) zamiast ogólników. (4) Poprawność — zero błędów zakłócających komunikację."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie'),
  'Wypowiedź pisemna — rozprawka za i przeciw na maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie rozszerzonym masz do wyboru 2 tematy (np. rozprawka i list formalny, albo rozprawka i artykuł) — ta lekcja skupia się na ROZPRAWCE ZA I PRZECIW, bo pojawia się najczęściej. Długość: 200-250 słów (w praktyce tolerowane 180-280, poniżej 160 słów liczy się tylko pierwsze kryterium). Styl: formalny, konsekwentny przez cały tekst. Ta część to 13 punktów."
  },
  {
    "type": "table",
    "title": "Kryteria oceniania (13 pkt razem)",
    "headers": ["Kryterium", "Punkty", "Co sprawdza"],
    "rows": [
      ["Zgodność z poleceniem", "0-5", "Teza zapowiadająca strukturę + rozwinięte argumenty za i przeciw + zakończenie + poprawna forma"],
      ["Spójność i logika", "0-2", "Liczba zakłóceń logicznych/spójnościowych (0-2 = pełne 2 pkt, 3-5 = 1 pkt, 6+ = 0 pkt)"],
      ["Zakres środków językowych", "0-3", "Bogactwo i precyzja słownictwa/struktur, jednolity formalny rejestr"],
      ["Poprawność środków językowych", "0-3", "Błędy językowe ORAZ ortograficzno-interpunkcyjne — liczą się oba wymiary naraz"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd na 4-5 pkt: teza, która tylko zadaje pytanie („Is it a good idea?”) zamiast WPROST zapowiedzieć strukturę rozprawki. Poprawna teza brzmi np. „There are both advantages and disadvantages of…” — to zdanie od razu pokazuje egzaminatorowi, że będzie „za i przeciw”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Rekomendowana struktura: (1) wstęp z tezą zapowiadającą strukturę, (2)-(3) dwa akapity z argumentami ZA, każdy rozwinięty (nie tylko wymieniony — wyjaśnij mechanizm/konsekwencję), (4)-(5) dwa akapity z argumentami PRZECIW, tak samo rozwinięte, (6) zakończenie, które PARAFRAZUJE tezę (nie powtarza jej dosłownie) i podaje wyważony wniosek."
  },
  {
    "type": "compare",
    "title": "Podnieś poziom łączników",
    "columns": [
      {
        "title": "Prosto (niski zakres)",
        "whenToUse": "Podstawowe, powtarzalne łączniki",
        "examples": ["Firstly, ...", "Secondly, ...", "In conclusion, ..."]
      },
      {
        "title": "Bogato (wysoki zakres)",
        "whenToUse": "Zróżnicowane, formalne łączniki — wyżej punktowane",
        "examples": ["To begin with, ...", "What is more, ...", "Nevertheless, ...", "All things considered, ..."]
      }
    ]
  },
  {
    "type": "examples",
    "title": "Przydatne zwroty (styl formalny)",
    "items": [
      { "en": "There is no doubt that this issue divides public opinion.", "pl": "Nie ulega wątpliwości, że ta kwestia dzieli opinię publiczną.", "highlight": "There is no doubt that" },
      { "en": "It is often argued that technology does more harm than good.", "pl": "Często twierdzi się, że technologia przynosi więcej szkody niż pożytku.", "highlight": "It is often argued that" },
      { "en": "Having weighed both sides of the argument, I believe...", "pl": "Rozważywszy obie strony argumentacji, uważam, że…", "highlight": "Having weighed both sides" },
      { "en": "All things considered, a balanced approach seems the most reasonable.", "pl": "Biorąc wszystko pod uwagę, wyważone podejście wydaje się najrozsądniejsze.", "highlight": "All things considered" }
    ]
  },
  {
    "type": "intro",
    "text": "PRZYKŁAD NA 13/13 PUNKTÓW (ok. 220 słów) — polecenie: „Coraz więcej szkół wprowadza zakaz korzystania z telefonów komórkowych na terenie szkoły. Napisz rozprawkę, w której przedstawisz zalety i wady takiego rozwiązania.”"
  },
  {
    "type": "intro",
    "text": "Nowadays, an increasing number of schools have decided to ban mobile phones on their premises entirely. This essay will examine both the advantages and disadvantages of such a policy."
  },
  {
    "type": "intro",
    "text": "To begin with, a phone-free environment allows students to concentrate fully on their lessons without the constant temptation to check notifications. Furthermore, it encourages genuine face-to-face interaction during breaks, which many teenagers have gradually lost due to excessive screen time."
  },
  {
    "type": "intro",
    "text": "However, this approach is not without its drawbacks. Firstly, in the event of an emergency, students may find it difficult to contact their parents or receive urgent information quickly. What is more, since smartphones are increasingly used as educational tools, banning them entirely might actually limit access to useful apps and online resources during lessons."
  },
  {
    "type": "intro",
    "text": "Nevertheless, having weighed both sides of the argument, I believe that a complete ban is too extreme a measure. A more balanced solution, such as allowing phones only during designated breaks, would address the concerns about distraction while still keeping students safe and connected. All things considered, schools should aim for a policy that limits misuse rather than eliminating a tool that, when used responsibly, can genuinely support learning."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Dlaczego to 13/13: (1) Zgodność z poleceniem — teza w akapicie 1 wprost zapowiada strukturę „advantages and disadvantages”, dwa argumenty za i dwa przeciw są rozwinięte (nie tylko wymienione), zakończenie parafrazuje tezę i podaje wyważony wniosek. (2) Spójność — każdy akapit ma jasną funkcję, płynne przejścia (To begin with… / Furthermore… / However… / What is more… / Nevertheless… / All things considered…). (3) Zakres środków — bogate formalne łączniki, strona bierna (are increasingly used), precyzyjne słownictwo (premises, drawbacks, an extreme measure). (4) Poprawność — styl formalny utrzymany konsekwentnie przez cały tekst, zero błędów."
  }
]$content$::jsonb,
  1
);
