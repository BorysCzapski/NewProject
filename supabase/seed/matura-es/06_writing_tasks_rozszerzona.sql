-- ============================================================================
-- supabase/seed/matura-es/06_writing_tasks_rozszerzona.sql
-- Spanish writing prompts for poziom ROZSZERZONY (matura_writing_tasks):
-- rozprawka "za i przeciw", 200–250 słów, 13 punktów.
--
-- source is 'curated', NOT 'past_exam' — see the note in
-- 05_writing_tasks_podstawowa.sql for why. model_answer is an ORIGINAL
-- full-mark reference text, shown only after the student submits.
--
-- Each model answer follows the four-paragraph skeleton taught in
-- 04_lessons_pisanie.sql (teza zapowiadająca strukturę -> 2 argumenty za ->
-- 2 argumenty przeciw -> parafraza tezy) so that the lesson, the model and
-- the AI grader in lib/matura/writing-grading.ts all describe the same target.
--
-- Idempotent: deletes existing Spanish writing tasks for this section first.
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_writing_tasks
where section_id in (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Zadanie 1: rola mediów społecznościowych w życiu młodych ludzi
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'Media społecznościowe odgrywają dziś ogromną rolę w życiu młodych ludzi. Napisz rozprawkę, w której przedstawisz dobre i złe strony tego zjawiska.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$El auge de las redes sociales ha transformado por completo la manera en que los jóvenes se relacionan entre sí. Este fenómeno presenta tanto ventajas como inconvenientes que merece la pena analizar detenidamente.

Por un lado, las redes sociales permiten mantener el contacto con amigos y familiares que viven lejos, algo que hace dos décadas resultaba costoso y complicado. Cabe destacar, además, que constituyen una herramienta valiosa para el aprendizaje: muchos estudiantes acceden a través de ellas a contenidos educativos, comunidades de idiomas y oportunidades profesionales a las que de otro modo nunca habrían llegado.

Por otro lado, no conviene ignorar sus efectos negativos. En primer lugar, la exposición constante a vidas aparentemente perfectas genera inseguridad y ansiedad, sobre todo entre los adolescentes, cuya identidad todavía se está formando. En segundo lugar, el tiempo que se dedica a la pantalla se resta directamente al sueño, al estudio y a las relaciones cara a cara, con consecuencias que a menudo se subestiman.

En definitiva, las redes sociales no son en sí mismas beneficiosas ni perjudiciales: todo depende del uso que se haga de ellas. A mi juicio, la solución no consiste en prohibirlas, sino en enseñar a los jóvenes a emplearlas de forma consciente y limitada, de modo que sigan siendo una herramienta y no se conviertan en una dependencia.$m$,
  'Teza w akapicie 1 wprost zapowiada strukturę „tanto ventajas como inconvenientes”. Po dwa rozwinięte argumenty na stronę — każdy z mechanizmem lub skutkiem, nie samym wymienieniem. Zakończenie parafrazuje tezę i proponuje wyważony wniosek. Styl formalny i jednolity, formy bezosobowe („se dedica”, „conviene ignorar”, „se haga”), łączniki B2+ („Cabe destacar”, „En definitiva”, „de modo que”). Poprawny subjuntivo po „de modo que” i „no consiste en… sino en…”. Ok. 215 słów.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 2: praca zarobkowa w trakcie studiów
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'Coraz więcej studentów podejmuje pracę zarobkową równolegle ze studiami. Napisz rozprawkę, w której przedstawisz zalety i wady takiego rozwiązania.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$Compaginar los estudios universitarios con un empleo remunerado se ha convertido en una práctica cada vez más habitual. Esta decisión conlleva tanto beneficios evidentes como riesgos que no deberían pasarse por alto.

Entre los aspectos positivos destaca, en primer lugar, la independencia económica. Quien gana su propio dinero deja de depender por completo de su familia y aprende a administrar un presupuesto, una competencia que la universidad rara vez enseña. Asimismo, la experiencia laboral adquirida durante la carrera resulta decisiva a la hora de buscar el primer empleo: los responsables de selección valoran a los candidatos que ya han demostrado responsabilidad en un entorno real.

No obstante, este modelo tiene un coste. Por una parte, el número de horas disponibles para estudiar se reduce de forma considerable, lo que puede traducirse en peores resultados académicos e incluso en el abandono de asignaturas. Por otra parte, la acumulación de obligaciones genera un cansancio sostenido que afecta al rendimiento y a la salud, un efecto que muchos estudiantes solo advierten cuando ya es demasiado tarde.

En conclusión, trabajar durante la carrera aporta autonomía y experiencia, pero exige un precio en tiempo y energía. Considero que la clave reside en el equilibrio: un empleo de pocas horas y flexible puede enriquecer la formación, mientras que una jornada completa acaba compitiendo con ella.$m$,
  'Teza „tanto beneficios… como riesgos” zapowiada strukturę. Argumenty rozwinięte przez konsekwencję (kompetencja budżetowania, ocena rekruterów, spadek wyników, koszt zdrowotny). Zakończenie parafrazuje tezę innymi słowami i formułuje wniosek warunkowy. Bogate środki: „pasarse por alto”, „a la hora de”, „traducirse en”, „reside en”, strona bierna z SE. Rejestr formalny bez wyjątków. Ok. 213 słów.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 3: turystyka masowa
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'W wielu europejskich miastach mówi się dziś o problemie turystyki masowej. Napisz rozprawkę, w której przedstawisz dobre i złe strony rozwoju masowej turystyki.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'curated',
  '{"attribution": "Zespół Matura — hiszpański", "needsReview": false}'::jsonb,
  $m$En las últimas décadas, el turismo de masas se ha extendido a prácticamente todas las ciudades históricas de Europa. Se trata de un fenómeno que ofrece ventajas innegables, pero que también plantea problemas serios para quienes viven en esos lugares.

Por un lado, el turismo constituye una fuente fundamental de ingresos. Genera empleo en la hostelería, el comercio y el transporte, y en muchas regiones representa la principal alternativa económica frente a la despoblación. A ello se añade que los ingresos derivados de las visitas permiten financiar la restauración de monumentos que, de otro modo, se deteriorarían por falta de fondos.

Por otro lado, las consecuencias negativas resultan cada vez más visibles. En primer lugar, la presión turística encarece la vivienda hasta expulsar a los residentes del centro de sus propias ciudades, un proceso que ya se observa en Barcelona o Lisboa. En segundo lugar, la afluencia masiva deteriora el patrimonio y el entorno natural: monumentos y playas sufren un desgaste que ninguna entrada puede compensar del todo.

En resumen, el turismo masivo enriquece económicamente a las ciudades al tiempo que amenaza su habitabilidad y su patrimonio. A mi entender, no se trata de renunciar a los visitantes, sino de regular su número y distribuirlos a lo largo del año, de manera que el beneficio no se obtenga a costa de quienes residen allí.$m$,
  'Teza zapowiada obie strony bez opowiadania się za żadną. Argumenty poparte konkretami (despoblación, restauracja zabytków, Barcelona/Lizbona, zużycie plaż). Zakończenie parafrazuje tezę i proponuje regulację zamiast zakazu. Zaawansowane konstrukcje: „se trata de”, „a ello se añade que”, „al tiempo que”, „de manera que” + subjuntivo, „a costa de”. Ok. 218 słów.'
);
