-- ============================================================================
-- supabase/seed/matura-es/04_lessons_pisanie.sql
-- One lesson per poziom for "Wypowiedź pisemna" po hiszpańsku (matura_lessons).
--
-- The CKE marking criteria are identical to the English seed's lesson — same
-- four criteria, same 12/13 point split, same word-count guillotine — so this
-- lesson does NOT re-explain them differently. What it adds is the Spanish
-- half: which connectors read as B2+ in Spanish, which register slips cost
-- points, and which tildes examiners actually catch. Keep this aligned with
-- LANGUAGE_NOTES.es in lib/matura/writing-grading.ts: the student should be
-- taught against the same list the AI grader marks against.
--
-- Idempotent: deletes existing Spanish lessons for this section first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'es' and slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'Wypowiedź pisemna — e-mail, wpis na blogu, wpis na forum',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie podstawowym piszesz 100–150 słów: e-mail, wpis na blogu albo wpis na forum. Polecenie zawiera cztery podpunkty i to one, a nie Twój pomysł na tekst, decydują o punktach za treść. Za tę wypowiedź możesz dostać 12 punktów."
  },
  {
    "type": "table",
    "title": "Za co dostajesz punkty (kryteria CKE)",
    "headers": ["Kryterium", "Punkty", "O co chodzi"],
    "rows": [
      ["Treść", "0–5", "Wszystkie 4 podpunkty zaadresowane I rozwinięte (1–2 zdania z konkretem)"],
      ["Spójność i logika", "0–2", "Tekst czyta się jako całość, bez sprzecznych fragmentów"],
      ["Zakres środków", "0–3", "Zróżnicowane słownictwo, konkret zamiast bueno/malo/interesante"],
      ["Poprawność", "0–2", "Błędy nie zakłócają komunikacji"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Poniżej 80 słów wszystkie kryteria oprócz treści są ZEROWANE. To reguła CKE, nie uznaniowość egzaminatora — licz słowa, zanim oddasz arkusz."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Rozwinięcie podpunktu to nie jedno zdanie „Fui al concierto”. To zdanie plus konkret: „Fui al concierto de un grupo español y me sorprendió que tocaran más de dos horas”. Egzaminator szuka drugiego zdania."
  },
  {
    "type": "table",
    "title": "Otwarcie i zamknięcie — gotowe formuły",
    "headers": ["Rejestr", "Powitanie", "Pożegnanie"],
    "rows": [
      ["Nieformalny (kolega)", "¡Hola, Marta! / ¿Qué tal?", "Un abrazo / Nos vemos pronto"],
      ["Półformalny (blog, forum)", "¡Hola a todos!", "¿Y vosotros qué opináis?"],
      ["Formalny (instytucja)", "Estimado señor / Estimada señora:", "Atentamente / Un cordial saludo"]
    ]
  },
  {
    "type": "examples",
    "title": "Łączniki, które podnoszą ocenę zakresu",
    "items": [
      { "en": "Además, el precio me pareció muy razonable.", "pl": "Poza tym cena wydała mi się bardzo rozsądna.", "highlight": "Además" },
      { "en": "Sin embargo, no todo salió como esperaba.", "pl": "Jednak nie wszystko poszło tak, jak się spodziewałem.", "highlight": "Sin embargo" },
      { "en": "Por eso te recomiendo que vengas conmigo.", "pl": "Dlatego radzę ci, żebyś poszedł ze mną.", "highlight": "Por eso" },
      { "en": "Lo que más me gustó fue el ambiente.", "pl": "Najbardziej podobała mi się atmosfera.", "highlight": "Lo que más me gustó" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Trzymaj JEDEN rejestr przez cały tekst. Jeśli zacząłeś od „tú”, nie przechodź w połowie na „usted” — mieszanie form obniża ocenę spójności."
  },
  {
    "type": "quiz",
    "question": "Piszesz e-mail do hiszpańskiego kolegi. Które zakończenie pasuje?",
    "options": ["Atentamente,", "Un abrazo,", "Le saluda atentamente,"],
    "correctIndex": 1,
    "explanation": "Kolega = rejestr nieformalny, więc „Un abrazo”. Pozostałe dwa to formuły formalne, do instytucji."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'Rozprawka za i przeciw — jak zdobyć komplet 13 punktów',
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu piszesz rozprawkę „za i przeciw” na 200–250 słów, w stylu formalnym, za 13 punktów. Struktura jest sztywna i to dobra wiadomość: możesz ją przećwiczyć raz i powtarzać na egzaminie."
  },
  {
    "type": "table",
    "title": "Kryteria CKE — poziom rozszerzony",
    "headers": ["Kryterium", "Punkty", "Na czym się przewrócisz"],
    "rows": [
      ["Zgodność z poleceniem", "0–5", "Brak tezy zapowiadającej strukturę; argumenty wymienione, nie rozwinięte"],
      ["Spójność i logika", "0–2", "6+ zakłóceń = 0 pkt"],
      ["Zakres środków", "0–3", "Ubogie łączniki, mieszanie rejestru"],
      ["Poprawność", "0–3", "Liczy się gramatyka ORAZ ortografia (tildes!) jednocześnie"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Poniżej 160 słów zerowane są wszystkie kryteria oprócz pierwszego. Rozprawka na 150 słów, choćby idealna, daje maksymalnie 5 z 13 punktów."
  },
  {
    "type": "compare",
    "title": "Teza: dobra vs. słaba",
    "columns": [
      {
        "title": "DOBRA",
        "formula": "wprost zapowiada strukturę",
        "whenToUse": "wstęp, ostatnie zdanie akapitu 1",
        "examples": ["Este fenómeno tiene tanto ventajas como inconvenientes.", "A continuación, analizaré los aspectos positivos y negativos de esta solución."]
      },
      {
        "title": "SŁABA",
        "formula": "tylko stawia pytanie",
        "whenToUse": "obniża ocenę zgodności z poleceniem",
        "examples": ["¿Es bueno o malo?", "Mucha gente habla de este tema."]
      }
    ]
  },
  {
    "type": "table",
    "title": "Szkielet rozprawki",
    "headers": ["Akapit", "Co ma zawierać", "Ile słów"],
    "rows": [
      ["1. Wstęp", "Wprowadzenie tematu + teza zapowiadająca za i przeciw", "ok. 40"],
      ["2. Argumenty za", "2 argumenty, każdy rozwinięty o mechanizm/skutek", "ok. 70"],
      ["3. Argumenty przeciw", "2 argumenty, tak samo rozwinięte", "ok. 70"],
      ["4. Zakończenie", "Parafraza tezy + własny wyważony wniosek", "ok. 40"]
    ]
  },
  {
    "type": "examples",
    "title": "Łączniki na poziom B2+ (zakres środków)",
    "items": [
      { "en": "Por un lado… por otro lado…", "pl": "Z jednej strony… z drugiej strony…", "highlight": "Por un lado" },
      { "en": "Cabe destacar que este cambio afecta a todos.", "pl": "Warto podkreślić, że ta zmiana dotyczy wszystkich.", "highlight": "Cabe destacar que" },
      { "en": "A menudo se argumenta que la tecnología aísla a los jóvenes.", "pl": "Często argumentuje się, że technologia izoluje młodych.", "highlight": "A menudo se argumenta que" },
      { "en": "No obstante, conviene tener en cuenta el coste.", "pl": "Niemniej jednak warto wziąć pod uwagę koszt.", "highlight": "No obstante" },
      { "en": "En definitiva, los beneficios superan los riesgos.", "pl": "Ostatecznie korzyści przewyższają ryzyko.", "highlight": "En definitiva" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Styl formalny = bez „vale”, „o sea”, „un montón”, „tío” i bez zwracania się do czytelnika przez „tú”. Używaj form bezosobowych: „se puede afirmar que”, „conviene recordar”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zostaw 3 minuty na przejrzenie tildes: está/esta, más/mas, sí/si, él/el, sé/se, aún/aun. To kryterium poprawności, w którym najłatwiej odzyskać punkt bez zmiany treści."
  },
  {
    "type": "quiz",
    "question": "Które zdanie nadaje się na tezę rozprawki za i przeciw?",
    "options": [
      "En mi opinión, las redes sociales son terribles.",
      "Las redes sociales presentan tanto ventajas como inconvenientes que merece la pena analizar.",
      "¿Son buenas o malas las redes sociales?"
    ],
    "correctIndex": 1,
    "explanation": "Teza musi WPROST zapowiadać, że przedstawisz obie strony. Pierwsza opowiada się po jednej stronie (to teza do rozprawki opiniującej), trzecia tylko stawia pytanie."
  }
]$content$::jsonb,
  1
);
