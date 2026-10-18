-- ============================================================================
-- supabase/seed/matura/18_vocab_top100.sql
-- "100 najważniejszych słówek" — a curated must-know block for the PODSTAWOWA
-- exam, added to the English vocabulary bank as its own topic.
--
-- Source: angielskibezspinki.pl, "100 najważniejszych słówek na maturze
-- podstawowej z angielskiego"
-- (https://angielskibezspinki.pl/100-najwazniejszych-slowek-na-maturze-podstawowej-z-angielskiego/).
-- The source gives only the word and its Polish equivalent, so examples,
-- part of speech and notes are empty here; the drill handles that.
--
-- Some of these words ALSO appear in the thematic blocks (12-16). They are
-- separate rows with separate progress on purpose: this block is a focused
-- last-weeks checklist, and merging the rows would make a word vanish from
-- whichever list the student is not looking at.
--
-- Idempotent and non-destructive: unlike 11_vocab_topics.sql it does NOT delete
-- the bank, so it is safe to run on top of the existing seeds in any order after 11.
-- ============================================================================

insert into matura_vocab_topics (language, slug, title, title_target, description, order_index) values
  ('en', 'top-100', '100 najważniejszych słówek', 'Top 100',
   'Zestaw słówek, które najczęściej decydują o punktach na maturze podstawowej. Źródło: angielskibezspinki.pl.', 16)
on conflict do nothing;

insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, 'podstawowa'::matura_level, v.term, '', v.pl, '', '', '', v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'top-100') t,
(values
  (1,'confident','pewny siebie'),
  (2,'reliable','godny zaufania'),
  (3,'patient','cierpliwy'),
  (4,'shy','nieśmiały'),
  (5,'honest','uczciwy'),
  (6,'proud','dumny'),
  (7,'worried','zmartwiony'),
  (8,'neighbour','sąsiad'),
  (9,'relative','krewny'),
  (10,'friendship','przyjaźń'),
  (11,'flat','mieszkanie'),
  (12,'rent','wynajmować'),
  (13,'chores','obowiązki domowe'),
  (14,'tidy','uporządkowany'),
  (15,'messy','bałaganiarski'),
  (16,'furniture','meble'),
  (17,'shelf','półka'),
  (18,'upstairs','na górze'),
  (19,'downstairs','na dole'),
  (20,'repair','naprawiać'),
  (21,'subject','przedmiot szkolny'),
  (22,'timetable','plan lekcji'),
  (23,'revise','powtarzać materiał'),
  (24,'improve','poprawiać'),
  (25,'mistake','błąd'),
  (26,'mark','ocena'),
  (27,'deadline','termin wykonania'),
  (28,'knowledge','wiedza'),
  (29,'skill','umiejętność'),
  (30,'effort','wysiłek'),
  (31,'apply','aplikować'),
  (32,'experience','doświadczenie'),
  (33,'salary','pensja'),
  (34,'earn','zarabiać'),
  (35,'save','oszczędzać'),
  (36,'spend','wydawać'),
  (37,'afford','móc sobie pozwolić'),
  (38,'borrow','pożyczać od kogoś'),
  (39,'lend','pożyczać komuś'),
  (40,'appointment','umówione spotkanie'),
  (41,'meal','posiłek'),
  (42,'ingredients','składniki'),
  (43,'fresh','świeży'),
  (44,'healthy','zdrowy'),
  (45,'order','zamawiać'),
  (46,'receipt','paragon'),
  (47,'refund','zwrot pieniędzy'),
  (48,'discount','zniżka'),
  (49,'customer','klient'),
  (50,'size','rozmiar'),
  (51,'journey','podróż'),
  (52,'luggage','bagaż'),
  (53,'accommodation','zakwaterowanie'),
  (54,'book','rezerwować'),
  (55,'delay','opóźnienie'),
  (56,'departure','odjazd'),
  (57,'arrival','przyjazd'),
  (58,'platform','peron'),
  (59,'abroad','za granicą'),
  (60,'sightseeing','zwiedzanie'),
  (61,'headache','ból głowy'),
  (62,'sore','obolały'),
  (63,'cough','kaszel'),
  (64,'injury','uraz'),
  (65,'treatment','leczenie'),
  (66,'recover','wracać do zdrowia'),
  (67,'fit','w dobrej kondycji'),
  (68,'coach','trener'),
  (69,'match','mecz'),
  (70,'competition','zawody'),
  (71,'audience','publiczność'),
  (72,'performance','występ'),
  (73,'exhibition','wystawa'),
  (74,'review','recenzja'),
  (75,'novel','powieść'),
  (76,'entertainment','rozrywka'),
  (77,'recommend','polecać'),
  (78,'enjoy','lubić'),
  (79,'relax','odpoczywać'),
  (80,'hobby','zainteresowanie'),
  (81,'device','urządzenie'),
  (82,'password','hasło'),
  (83,'download','pobierać'),
  (84,'upload','przesyłać'),
  (85,'screen','ekran'),
  (86,'pollution','zanieczyszczenie'),
  (87,'recycle','przetwarzać odpady'),
  (88,'waste','marnować'),
  (89,'protect','chronić'),
  (90,'environment','środowisko'),
  (91,'agree','zgadzać się'),
  (92,'suggest','sugerować'),
  (93,'explain','wyjaśniać'),
  (94,'reason','powód'),
  (95,'advantage','zaleta'),
  (96,'disadvantage','wada'),
  (97,'although','chociaż'),
  (98,'however','jednak'),
  (99,'instead','zamiast tego'),
  (100,'therefore','dlatego')
) as v(ord, term, pl)
on conflict (topic_id, term) do nothing;
