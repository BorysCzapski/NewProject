-- ============================================================================
-- supabase/seed/matura-es/03_tasks_srodki_jezykowe.sql
-- Curated Spanish task bank (matura_tasks, source='curated') for "Znajomość
-- środków językowych": 3 tasks at poziom podstawowy, 4 at rozszerzony, each a
-- group of graded sub-items (see MaturaTaskContent in lib/types/database.ts).
--
-- Grading is exact-normalized string match (lib/matura/grading.ts): trim,
-- lowercase, strip punctuation. It does NOT strip diacritics, so "está" and
-- "esta" are different answers — deliberately, because a missing tilde IS an
-- error on the real exam. Where a genuinely equivalent phrasing exists, it is
-- listed explicitly in correctAnswers rather than left to fuzzy matching.
--
-- Idempotent: deletes existing Spanish curated tasks for this section first.
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_tasks
where source = 'curated'
  and section_id in (select id from matura_sections where language = 'es' and slug = 'srodki-jezykowe');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 1: słowotwórstwo
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania, przekształcając podane w nawiasach wyrazy tak, aby powstały poprawne pod względem gramatycznym i logicznym zdania. Wpisz tylko brakujący wyraz.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Terminó el ejercicio muy ___ (RÁPIDO).", "transformWord": "RÁPIDO", "correctAnswers": ["rápidamente"], "explanation": "Przysłówek tworzymy od formy ŻEŃSKIEJ przymiotnika: rápido → rápida → rápidamente." },
      { "id": "2", "type": "gap_fill", "prompt": "La ___ (INFORMAR) que me diste no era correcta.", "transformWord": "INFORMAR", "correctAnswers": ["información"], "explanation": "Czasownik → rzeczownik z końcówką -ción: informar → la información." },
      { "id": "3", "type": "gap_fill", "prompt": "Estudiar idiomas ofrece muchas ___ (POSIBLE).", "transformWord": "POSIBLE", "correctAnswers": ["posibilidades"], "explanation": "Przymiotnik → rzeczownik z końcówką -dad, tu w liczbie mnogiej: posible → posibilidad → posibilidades." },
      { "id": "4", "type": "gap_fill", "prompt": "Este camino de montaña es bastante ___ (PELIGRO).", "transformWord": "PELIGRO", "correctAnswers": ["peligroso"], "explanation": "Rzeczownik → przymiotnik z końcówką -oso: el peligro → peligroso (rodzaj męski, bo camino)." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 2: ser/estar oraz por/para (wybór wielokrotny)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Wybierz poprawną odpowiedź spośród podanych.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Mi padre ___ médico en un hospital de Valencia.", "options": ["es", "está", "hay"], "correctAnswers": ["es"], "explanation": "Zawód to cecha stała — SER." },
      { "id": "2", "type": "multiple_choice", "prompt": "Las llaves ___ encima de la mesa del salón.", "options": ["son", "están", "hay"], "correctAnswers": ["están"], "explanation": "Położenie konkretnego przedmiotu — ESTAR. HAY użyjemy tylko dla rzeczy nieokreślonych: hay unas llaves." },
      { "id": "3", "type": "multiple_choice", "prompt": "Compré estas flores ___ mi abuela, hoy es su cumpleaños.", "options": ["por", "para", "de"], "correctAnswers": ["para"], "explanation": "Odbiorca, przeznaczenie prezentu — PARA." },
      { "id": "4", "type": "multiple_choice", "prompt": "Muchas gracias ___ venir a mi fiesta.", "options": ["por", "para", "de"], "correctAnswers": ["por"], "explanation": "Podziękowanie ZA coś — zawsze POR, mimo że po polsku nie ma tu ani „przez”, ani „dla”." },
      { "id": "5", "type": "multiple_choice", "prompt": "Ana ___ cansada porque ha trabajado todo el día.", "options": ["es", "está", "tiene"], "correctAnswers": ["está"], "explanation": "Zmęczenie to stan chwilowy — ESTAR." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 3: uzupełnianie luk (formy czasownika)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania poprawną formą czasownika podanego w nawiasie. Wpisz tylko brakujący wyraz lub wyrazy.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "¿A qué hora ___ (empezar) la clase de español?", "correctAnswers": ["empieza"], "explanation": "3. osoba l. poj., czas teraźniejszy, czasownik nieregularny e→ie: empieza." },
      { "id": "2", "type": "gap_fill", "prompt": "Ayer nosotros ___ (ir) al museo del Prado.", "correctAnswers": ["fuimos"], "explanation": "Pretérito indefinido od IR (i od SER) w 1. os. l. mn.: fuimos." },
      { "id": "3", "type": "gap_fill", "prompt": "Me gusta ___ (levantarse) temprano los domingos.", "correctAnswers": ["levantarme"], "explanation": "Po „me gusta” bezokolicznik, a zaimek zwrotny dopasowujemy do osoby: levantarme." },
      { "id": "4", "type": "gap_fill", "prompt": "Hace dos años que ___ (yo, estudiar) español.", "correctAnswers": ["estudio"], "explanation": "Konstrukcja „hace + czas + que” z czynnością wciąż trwającą wymaga czasu TERAŹNIEJSZEGO: estudio." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 1: indicativo vs subjuntivo
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania poprawną formą czasownika podanego w nawiasie. Zwróć uwagę na wybór trybu.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Es importante que todos ___ (participar) en el debate.", "correctAnswers": ["participen"], "explanation": "„Es importante que” wyraża ocenę — subjuntivo: participen." },
      { "id": "2", "type": "gap_fill", "prompt": "Creo que Marta ___ (tener) razón en este asunto.", "correctAnswers": ["tiene"], "explanation": "„Creo que” w twierdzeniu wyraża przekonanie — indicativo: tiene." },
      { "id": "3", "type": "gap_fill", "prompt": "No creo que Marta ___ (tener) razón en este asunto.", "correctAnswers": ["tenga"], "explanation": "Zaprzeczony czasownik opinii przerzuca zdanie podrzędne w subjuntivo: tenga. Porównaj z poprzednim zdaniem." },
      { "id": "4", "type": "gap_fill", "prompt": "Cuando ___ (tú, llegar) a casa, avísame por favor.", "correctAnswers": ["llegues"], "explanation": "„Cuando” odnoszące się do PRZYSZŁOŚCI wymaga subjuntivo: llegues." },
      { "id": "5", "type": "gap_fill", "prompt": "Me alegro mucho de que ___ (tú, estar) aquí con nosotros.", "correctAnswers": ["estés"], "explanation": "Wyrażenie emocji („me alegro de que”) — subjuntivo: estés." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 2: indefinido vs imperfecto
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania poprawną formą czasu przeszłego (pretérito indefinido albo pretérito imperfecto).",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Mientras yo ___ (preparar) la cena, sonó el teléfono.", "correctAnswers": ["preparaba"], "explanation": "Czynność stanowiąca TŁO dla innego zdarzenia — imperfecto: preparaba." },
      { "id": "2", "type": "gap_fill", "prompt": "El verano pasado nosotros ___ (viajar) a Andalucía.", "correctAnswers": ["viajamos"], "explanation": "Zdarzenie zamknięte, w określonym momencie — indefinido: viajamos." },
      { "id": "3", "type": "gap_fill", "prompt": "Cuando yo ___ (ser) niño, jugaba en la calle todos los días.", "correctAnswers": ["era"], "explanation": "Opis okoliczności w przeszłości — imperfecto: era." },
      { "id": "4", "type": "gap_fill", "prompt": "De repente, alguien ___ (llamar) a la puerta.", "correctAnswers": ["llamó"], "explanation": "„De repente” sygnalizuje nagłe, zamknięte zdarzenie — indefinido: llamó." },
      { "id": "5", "type": "gap_fill", "prompt": "Antes la gente ___ (escribir) muchas más cartas que ahora.", "correctAnswers": ["escribía"], "explanation": "Czynność powtarzalna, zwyczaj w przeszłości — imperfecto: escribía." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 3: parafraza zdań
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij drugie zdanie tak, aby zachowało znaczenie zdania pierwszego. Wpisz tylko brakujący wyraz lub wyrazy.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Otra vez perdí las llaves. → ___ a perder las llaves.", "correctAnswers": ["volví"], "explanation": "„Volver a + bezokolicznik” = zrobić coś ponownie. 1. os. indefinido: volví." },
      { "id": "2", "type": "gap_fill", "prompt": "Empezó a llover de repente. → Se ___ a llover de repente.", "correctAnswers": ["puso"], "explanation": "„Ponerse a + bezokolicznik” = nagle zacząć coś robić: se puso a llover." },
      { "id": "3", "type": "gap_fill", "prompt": "Es necesario estudiar más. → ___ que estudiar más.", "correctAnswers": ["hay"], "explanation": "„Hay que + bezokolicznik” wyraża konieczność bezosobową." },
      { "id": "4", "type": "gap_fill", "prompt": "En esta tienda venden pisos. → En esta tienda ___ pisos.", "correctAnswers": ["se venden"], "explanation": "Konstrukcja bezosobowa z SE; czasownik zgadza się z liczbą mnogą rzeczownika: se venden pisos." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 4: tłumaczenie fragmentów
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania, tłumacząc na język hiszpański podany w nawiasie fragment. Wpisz tylko tłumaczenie fragmentu.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "No me gusta que ___ (mówisz do mnie w ten sposób).", "correctAnswers": ["me hables así", "me hables de esa manera", "me hables de este modo"], "explanation": "Po „no me gusta que” obowiązuje subjuntivo: me hables. Najczęstszy błąd to indicativo („me hablas”)." },
      { "id": "2", "type": "gap_fill", "prompt": "Llegaré a casa ___ (zanim się obudzisz).", "correctAnswers": ["antes de que te despiertes"], "explanation": "„Antes de que” zawsze łączy się z subjuntivo: te despiertes." },
      { "id": "3", "type": "gap_fill", "prompt": "Te llamo ___ (żeby ci powiedzieć) la verdad.", "correctAnswers": ["para decirte"], "explanation": "Cel wyrażamy przez PARA; przy tym samym podmiocie używamy bezokolicznika, nie „para que”: para decirte." },
      { "id": "4", "type": "gap_fill", "prompt": "___ (Od dwóch lat) vivo en Madrid.", "correctAnswers": ["desde hace dos años", "hace dos años que"], "explanation": "Obie konstrukcje są poprawne: „Desde hace dos años vivo…” oraz „Hace dos años que vivo…”." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);
