-- ============================================================================
-- supabase/seed/matura/05_writing_tasks_podstawowa.sql
-- Writing task bank (matura_writing_tasks) for poziom podstawowy: e-mail /
-- wpis na blogu, 100-150 words, 4 required content points, 12 pts max.
-- Tasks 1-2 use REAL CKE topics (from the official Informator o egzaminie
-- maturalnym, Zadania 16-17 — publicly published example tasks). Tasks 3-4
-- are original, matching CKE's phrasing style. Every model_answer is an
-- ORIGINAL text authored for this app (never a copied CKE model answer),
-- written to satisfy the full-mark pattern described in
-- supabase/seed/matura/04_lessons_pisanie.sql.
--
-- Idempotent: deletes existing curated/past_exam tasks for this section
-- first. Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_writing_tasks
where section_id in (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Zadanie 1 (REAL, CKE Informator — Zadanie 16): wpis na blogu, zwycięstwo w biegu
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'blog_post',
  'Zwyciężyłeś/Zwyciężyłaś w biegu ulicami miasta. Napisz wpis na blogu, w którym:',
  '["napiszesz, skąd dowiedziałeś/aś się o imprezie i jakie były warunki udziału", "poinformujesz, jak przygotowywałeś/aś się do biegu", "wyjaśnisz, dlaczego zależało Ci na zwycięstwie", "opiszesz, jak zareagowała publiczność"]'::jsonb,
  100, 150, 12, 'past_exam',
  '{"year": 2024, "session": "Informator CKE — przykładowe zadanie 16", "source_url": "https://cke.gov.pl"}'::jsonb,
  $m$Guess what — I actually won the city fun run last weekend!

I found out about the race through a poster at my sports club, and I was thrilled to see that anyone over the age of sixteen could take part for free, so I signed up straight away.

To get ready, I started jogging three times a week and gradually increased the distance, and in the final week I even did a short practice run along the actual route.

Winning meant a lot to me because I'd never finished first in anything sporty before, and I really wanted to prove to myself that consistent effort actually pays off.

The moment I crossed the finish line, the crowd went absolutely wild, and total strangers were cheering and taking photos with me!$m$,
  'Wszystkie 4 podpunkty rozwinięte konkretem (plakat w klubie sportowym + warunek wieku, plan treningowy, osobista motywacja, reakcja tłumu). Naturalne zwroty: crossed the finish line, went absolutely wild. Brak błędów zakłócających komunikację.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 2 (REAL, CKE Informator — Zadanie 17): e-mail, zgubiony dowód osobisty
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'email',
  'Wybierałeś/Wybierałaś się na wakacje do kolegi do Londynu, ale dwa dni temu zgubiłeś/zgubiłaś dowód osobisty. Napisz e-mail do tego kolegi, w którym:',
  '["przedstawisz okoliczności zgubienia dowodu", "poinformujesz, że musisz odłożyć wyjazd, i wyrazisz niezadowolenie", "wyjaśnisz, co zrobiłeś/aś, aby odzyskać dowód", "zaproponujesz inny termin wizyty i wyrazisz nadzieję, że pasuje"]'::jsonb,
  100, 150, 12, 'past_exam',
  '{"year": 2024, "session": "Informator CKE — przykładowe zadanie 17", "source_url": "https://cke.gov.pl"}'::jsonb,
  $m$Hi Tom,

I'm really sorry to tell you this, but I lost my ID card while I was rushing to catch the bus into town two days ago, and I still haven't managed to find it anywhere.

Because of that, I'm afraid I'll have to postpone my trip to London, and to be honest, I'm quite frustrated since I'd been looking forward to it for weeks.

As soon as I noticed it was missing, I reported the loss at the local police station and applied for a replacement, which should apparently take about ten working days.

Would it be possible to visit you two weeks later instead, maybe around the 20th? I really hope that date works for you, and I promise this trip will happen!

Speak soon,
Kasia$m$,
  'Cztery podpunkty w osobnych akapitach, każdy rozwinięty (konkretna przyczyna, emocja, konkretne działanie z terminem, konkretna propozycja z datą). Naturalny styl maila do przyjaciela: powitanie, pożegnanie, ściągnięte formy (I''m, I''d, haven''t).'
);

-- ----------------------------------------------------------------------------
-- Zadanie 3 (curated): e-mail, wymiana szkolna z Anglią
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'email',
  'Twoja szkoła bierze udział w międzynarodowej wymianie z Anglią. Napisz e-mail do kolegi/koleżanki z Anglii, który/która niedługo Cię odwiedzi, w którym:',
  '["poinformujesz o terminie jego/jej przyjazdu do Polski i zaproponujesz miejsce spotkania", "opiszesz, jak wygląda typowy dzień w Twojej szkole", "zaproponujesz atrakcję, którą chcielibyście wspólnie zwiedzić", "zapytasz o jego/jej oczekiwania wobec pobytu"]'::jsonb,
  100, 150, 12, 'curated',
  '{"attribution": "Zespół Matura Angielski"}'::jsonb,
  $m$Hi Emily,

I just found out you're arriving in Poland on the 14th of March, so let's meet at the main train station around noon — I'll be waiting right by the entrance with a sign with your name on it!

A typical school day here starts at eight and usually has seven lessons, but don't worry, we also get a proper thirty-minute break for lunch in the canteen.

While you're here, I'd love to take you to the old town at the weekend, since it has some amazing street food stalls and a really impressive castle overlooking the river.

By the way, is there anything specific you're hoping to try or see during your stay? Just let me know so I can plan everything perfectly!

Can't wait to finally meet you in person,
Ola$m$,
  'Każdy podpunkt rozwinięty konkretem (data i miejsce spotkania, plan lekcji, konkretna atrakcja z detalem, pytanie otwarte na koniec). Naturalne zwroty: Can''t wait, By the way, don''t worry.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 4 (curated): wpis na blogu, nowe zajęcia pozalekcyjne
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'pisanie'),
  'blog_post',
  'Niedawno zacząłeś/zaczęłaś uczęszczać na nowe zajęcia pozalekcyjne. Napisz wpis na blogu, w którym:',
  '["napiszesz, dlaczego wybrałeś/aś akurat te zajęcia", "opiszesz, jak wyglądają typowe zajęcia", "wyjaśnisz, jakie umiejętności dzięki nim zdobywasz", "zachęcisz czytelników do spróbowania podobnych zajęć"]'::jsonb,
  100, 150, 12, 'curated',
  '{"attribution": "Zespół Matura Angielski"}'::jsonb,
  $m$So, I finally joined the pottery classes I'd been curious about for ages!

I chose this hobby because I'd always admired handmade ceramics online and wanted to try creating something with my own hands instead of just scrolling through photos.

Each session starts with the instructor demonstrating a new technique, and then we spend almost an hour shaping clay on the wheel while she walks around giving individual tips.

Thanks to these classes, I'm slowly learning patience, hand-eye coordination, and honestly, a lot more focus than I ever had before.

If you've ever thought about picking up a creative hobby, I'd seriously recommend giving pottery a try — it's oddly relaxing once you get the hang of it!$m$,
  'Podpunkty rozwinięte (konkretny powód wyboru, przebieg zajęć krok po kroku, lista konkretnych umiejętności, osobista rekomendacja z detalem). Zróżnicowane słownictwo: hand-eye coordination, oddly relaxing, get the hang of it.'
);
