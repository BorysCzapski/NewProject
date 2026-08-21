-- ============================================================================
-- supabase/seed/matura-es/11_vocab_topics.sql
-- The thematic blocks the Spanish vocabulary bank is organised by
-- (matura_vocab_topics). Run BEFORE any 1x_vocab_entries_*.sql file — those
-- look their topic up by slug.
--
-- SOURCE OF THE LIST. Blocks 1-14 are the "zakres tematyczny" of the podstawa
-- programowa for języki obce nowożytne, which CKE's Informator reproduces as
-- the scope every arkusz draws on. Block 15 is NOT one of them: it covers the
-- separate requirement that a maturzysta knows something about the countries
-- where the language is spoken, which shows up in reading and listening texts
-- and in the wypowiedź pisemna, but has no thematic block of its own. It is
-- marked as such in its description so nobody later mistakes it for one.
--
-- Slugs are identical across languages (see ../matura/11_vocab_topics.sql) so
-- a student switching between angielski and hiszpański lands on the same
-- thematic block, not a different one.
--
-- CKE publishes no official word list for języki obce, so which words sit in
-- which block is editorial. Where a word could sit in two blocks it is filed
-- where a maturzysta would look for it first.
-- ============================================================================

delete from matura_vocab_topics where language = 'es';

insert into matura_vocab_topics (language, slug, title, title_target, description, order_index) values
  ('es', 'czlowiek', 'Człowiek', 'La persona',
   'Dane osobowe, wygląd, cechy charakteru, uczucia i emocje, zainteresowania.', 1),
  ('es', 'miejsce-zamieszkania', 'Miejsce zamieszkania', 'El lugar de residencia',
   'Dom i jego okolica, pomieszczenia, wyposażenie, wynajem, wady i zalety miejsca.', 2),
  ('es', 'edukacja', 'Edukacja', 'La educación',
   'Szkoła, przedmioty, oceny, egzaminy, życie szkolne, studia i kształcenie.', 3),
  ('es', 'praca', 'Praca', 'El trabajo',
   'Zawody, warunki pracy, szukanie pracy, rozmowa kwalifikacyjna, kariera.', 4),
  ('es', 'zycie-prywatne', 'Życie prywatne', 'La vida privada',
   'Rodzina, znajomi, formy spędzania czasu wolnego, święta i uroczystości, konflikty.', 5),
  ('es', 'zywienie', 'Żywienie', 'La alimentación',
   'Artykuły spożywcze, posiłki, lokale gastronomiczne, nawyki żywieniowe, dieta.', 6),
  ('es', 'zakupy-i-uslugi', 'Zakupy i usługi', 'Compras y servicios',
   'Sklepy, towary, sprzedawanie i kupowanie, reklamacje, banki, usługi.', 7),
  ('es', 'podrozowanie-i-turystyka', 'Podróżowanie i turystyka', 'Viajes y turismo',
   'Środki transportu, baza noclegowa, wycieczki, zwiedzanie, awarie i problemy w podróży.', 8),
  ('es', 'kultura', 'Kultura', 'La cultura',
   'Dziedziny kultury, twórcy, uczestnictwo w kulturze, media, tradycje i zwyczaje.', 9),
  ('es', 'sport', 'Sport', 'El deporte',
   'Dyscypliny, sprzęt, obiekty, imprezy sportowe, uprawianie sportu, sport wyczynowy.', 10),
  ('es', 'zdrowie', 'Zdrowie', 'La salud',
   'Samopoczucie, choroby i objawy, leczenie, higiena, zdrowy tryb życia, uzależnienia.', 11),
  ('es', 'nauka-i-technika', 'Nauka i technika', 'Ciencia y tecnología',
   'Odkrycia i wynalazki, obsługa urządzeń, technologie informacyjno-komunikacyjne, internet.', 12),
  ('es', 'swiat-przyrody', 'Świat przyrody', 'El mundo natural',
   'Pogoda i klimat, krajobraz, rośliny i zwierzęta, klęski żywiołowe, ochrona środowiska.', 13),
  ('es', 'zycie-spoleczne', 'Życie społeczne', 'La vida social',
   'Wydarzenia i zjawiska społeczne, problemy współczesnego świata, polityka, prawo, religia.', 14),
  ('es', 'realioznawstwo', 'Kraje hiszpańskojęzyczne', 'El mundo hispanohablante',
   'Wiedza o Hiszpanii i Ameryce Łacińskiej — geografia, święta, obyczaje, różnice językowe. '
   'Nie jest to blok tematyczny z podstawy programowej, tylko odrębny wymóg CKE dotyczący '
   'wiedzy o krajach obszaru nauczanego języka.', 15);
