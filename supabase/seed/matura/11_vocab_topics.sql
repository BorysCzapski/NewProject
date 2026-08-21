-- ============================================================================
-- supabase/seed/matura/11_vocab_topics.sql
-- The thematic blocks the English vocabulary bank is organised by
-- (matura_vocab_topics). Run BEFORE any 1x_vocab_entries_*.sql file — those
-- look their topic up by slug.
--
-- Blocks 1-14 are the "zakres tematyczny" of the podstawa programowa for
-- języki obce nowożytne; block 15 is NOT one of them and says so in its
-- description — it covers CKE's separate requirement of knowing something
-- about the countries where the language is spoken. See the fuller note in
-- ../matura-es/11_vocab_topics.sql; the two files are deliberately parallel,
-- with the same slugs in the same order, so a student switching language lands
-- on the same thematic block.
-- ============================================================================

delete from matura_vocab_topics where language = 'en';

insert into matura_vocab_topics (language, slug, title, title_target, description, order_index) values
  ('en', 'czlowiek', 'Człowiek', 'People',
   'Dane osobowe, wygląd, cechy charakteru, uczucia i emocje, zainteresowania.', 1),
  ('en', 'miejsce-zamieszkania', 'Miejsce zamieszkania', 'Home',
   'Dom i jego okolica, pomieszczenia, wyposażenie, wynajem, wady i zalety miejsca.', 2),
  ('en', 'edukacja', 'Edukacja', 'Education',
   'Szkoła, przedmioty, oceny, egzaminy, życie szkolne, studia i kształcenie.', 3),
  ('en', 'praca', 'Praca', 'Work',
   'Zawody, warunki pracy, szukanie pracy, rozmowa kwalifikacyjna, kariera.', 4),
  ('en', 'zycie-prywatne', 'Życie prywatne', 'Private life',
   'Rodzina, znajomi, formy spędzania czasu wolnego, święta i uroczystości, konflikty.', 5),
  ('en', 'zywienie', 'Żywienie', 'Food',
   'Artykuły spożywcze, posiłki, lokale gastronomiczne, nawyki żywieniowe, dieta.', 6),
  ('en', 'zakupy-i-uslugi', 'Zakupy i usługi', 'Shopping and services',
   'Sklepy, towary, sprzedawanie i kupowanie, reklamacje, banki, usługi.', 7),
  ('en', 'podrozowanie-i-turystyka', 'Podróżowanie i turystyka', 'Travel and tourism',
   'Środki transportu, baza noclegowa, wycieczki, zwiedzanie, awarie i problemy w podróży.', 8),
  ('en', 'kultura', 'Kultura', 'Culture',
   'Dziedziny kultury, twórcy, uczestnictwo w kulturze, media, tradycje i zwyczaje.', 9),
  ('en', 'sport', 'Sport', 'Sport',
   'Dyscypliny, sprzęt, obiekty, imprezy sportowe, uprawianie sportu, sport wyczynowy.', 10),
  ('en', 'zdrowie', 'Zdrowie', 'Health',
   'Samopoczucie, choroby i objawy, leczenie, higiena, zdrowy tryb życia, uzależnienia.', 11),
  ('en', 'nauka-i-technika', 'Nauka i technika', 'Science and technology',
   'Odkrycia i wynalazki, obsługa urządzeń, technologie informacyjno-komunikacyjne, internet.', 12),
  ('en', 'swiat-przyrody', 'Świat przyrody', 'The natural world',
   'Pogoda i klimat, krajobraz, rośliny i zwierzęta, klęski żywiołowe, ochrona środowiska.', 13),
  ('en', 'zycie-spoleczne', 'Życie społeczne', 'Social life',
   'Wydarzenia i zjawiska społeczne, problemy współczesnego świata, polityka, prawo, religia.', 14),
  ('en', 'realioznawstwo', 'Kraje anglojęzyczne', 'The English-speaking world',
   'Wiedza o Wielkiej Brytanii, Irlandii, USA, Kanadzie, Australii — geografia, święta, obyczaje, '
   'różnice British/American English. Nie jest to blok tematyczny z podstawy programowej, tylko '
   'odrębny wymóg CKE dotyczący wiedzy o krajach obszaru nauczanego języka.', 15);
