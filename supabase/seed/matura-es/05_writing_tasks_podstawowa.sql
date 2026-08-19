-- ============================================================================
-- supabase/seed/matura-es/05_writing_tasks_podstawowa.sql
-- Spanish writing prompts for poziom PODSTAWOWY (matura_writing_tasks):
-- e-mail / wpis na blogu / wpis na forum, 100–150 słów, 12 punktów.
--
-- source is 'curated', NOT 'past_exam' — unlike the English seed, which cites
-- verifiable CKE sessions. These prompts are written in the CKE format but are
-- not transcriptions of a specific published arkusz, and labelling them as
-- past-exam material would claim a provenance we cannot back up. Same
-- conservative rule lib/matura/import-pdf.ts applies to admin PDF imports.
--
-- model_answer is an ORIGINAL full-mark reference text, revealed to the
-- student only after they submit their own attempt.
--
-- Idempotent: deletes existing Spanish writing tasks for this section first.
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_writing_tasks
where section_id in (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Zadanie 1: wpis na blogu — wycieczka szkolna do Hiszpanii
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'blog_post',
  'W zeszłym miesiącu byłeś(-aś) na wycieczce szkolnej w Hiszpanii. Napisz wpis na swoim blogu, w którym opiszesz tę wycieczkę.',
  '["napisz, dokąd pojechaliście i z kim", "opisz miejsce, które zrobiło na Tobie największe wrażenie", "wspomnij o czymś, co Cię zaskoczyło albo nie poszło zgodnie z planem", "poradź czytelnikom, co warto zrobić w tym miejscu"]'::jsonb,
  100, 150, 12, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$¡Hola a todos!

El mes pasado fui de viaje escolar a Andalucía con mi clase y dos profesores. Pasamos allí cinco días y todavía no me lo puedo creer.

Lo que más me impresionó fue la Alhambra de Granada. Los patios y los jardines son preciosos, y desde arriba se ve toda la ciudad. Estuvimos casi tres horas y no me aburrí ni un momento.

Sin embargo, no todo salió según lo planeado: el segundo día perdimos el autobús y tuvimos que volver al hotel en tren. Al final fue divertido, aunque en ese momento nos pusimos bastante nerviosos.

Si vais a Granada, os recomiendo comprar las entradas por internet con antelación, porque las colas son enormes. Y probad los churros con chocolate.

¿Y vosotros, habéis estado alguna vez en Andalucía?$m$,
  'Wszystkie cztery podpunkty zaadresowane i rozwinięte drugim zdaniem. Rejestr półformalny, spójny (konsekwentne „vosotros”). Zróżnicowane słownictwo (me impresionó, no me aburrí, según lo planeado) zamiast bueno/bonito. Poprawne indefinido dla zdarzeń zamkniętych i imperfecto dla tła. 128 słów — w wymaganym zakresie.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 2: e-mail — nowa praca dorywcza
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'email',
  'Od miesiąca pracujesz dorywczo po lekcjach. Napisz e-mail do hiszpańskiego kolegi / hiszpańskiej koleżanki, w którym opowiesz mu / jej o tej pracy.',
  '["napisz, gdzie i od kiedy pracujesz", "wyjaśnij, dlaczego zdecydowałeś(-aś) się podjąć tę pracę", "opisz, co jest w niej najtrudniejsze", "zapytaj kolegę / koleżankę o jego / jej doświadczenia z pracą"]'::jsonb,
  100, 150, 12, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$¡Hola, Diego!

¿Qué tal todo? Tengo una novedad: desde hace un mes trabajo los fines de semana en una cafetería del centro de mi ciudad.

Decidí buscar trabajo porque quiero ahorrar para un viaje a España el verano que viene y, además, mis padres no pueden darme tanto dinero. Me pareció mejor ganarlo yo mismo.

Lo más difícil no es preparar el café, sino tratar con los clientes cuando hay mucha gente y todos tienen prisa. Al principio me ponía muy nervioso, pero ahora ya me he acostumbrado.

¿Y tú? ¿Has trabajado alguna vez mientras estudiabas? Me gustaría saber cómo consigues organizar el tiempo.

Escríbeme pronto.

Un abrazo,
Marek$m$,
  'Cztery podpunkty zaadresowane i rozwinięte. Rejestr nieformalny utrzymany od powitania po pożegnanie. Konstrukcje ponad poziom minimalny: „desde hace un mes”, „lo más difícil no es… sino…”, „me he acostumbrado”. Pytanie do adresata realnie domyka podpunkt czwarty. 118 słów.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 3: wpis na forum — nauka języków obcych
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'pisanie'),
  'forum_post',
  'Na forum internetowym dla uczniów trwa dyskusja na temat tego, czy warto uczyć się więcej niż jednego języka obcego. Napisz swój wpis w tej dyskusji.',
  '["napisz, ilu języków obcych się uczysz", "przedstaw swoje zdanie na temat nauki kilku języków jednocześnie", "podaj przykład sytuacji, w której znajomość języka Ci się przydała", "zachęć innych użytkowników do podzielenia się opinią"]'::jsonb,
  100, 150, 12, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$¡Hola a todos!

Yo estudio dos idiomas: inglés desde primaria y español desde hace tres años.

En mi opinión, aprender dos lenguas a la vez es posible, aunque hay que organizarse bien. Al principio confundía algunas palabras, sobre todo las que se parecen, pero con el tiempo dejó de ser un problema. Creo que lo importante es no empezar los dos idiomas el mismo año.

El verano pasado el español me resultó muy útil. Estábamos de vacaciones en Málaga y mi madre se puso enferma; fui yo quien tuvo que explicar la situación en la farmacia. Sin el idioma habría sido mucho más complicado.

¿Y vosotros cuántos idiomas estudiáis? ¿Os parece que merece la pena aprender dos a la vez?$m$,
  'Cztery podpunkty zaadresowane, każdy rozwinięty. Przykład z apteki to konkret, a nie ogólnik — dokładnie tego wymaga kryterium treści. Zróżnicowane struktury: „desde hace tres años”, „dejó de ser”, „fui yo quien tuvo que”, tryb warunkowy „habría sido”. Rejestr forum, spójny. 121 słów.'
);
