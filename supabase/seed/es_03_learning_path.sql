-- ============================================================================
-- es_03_learning_path.sql
-- Learning-path stages for SPANISH (language = 'es'): one stage per (level,
-- category), paired with a grammar topic (cycling each level's 5 topics). The
-- category labels must match es_01_vocabulary_*.sql exactly, and the
-- grammar_topic_id UUIDs must match es_02_grammar_*.sql. Idempotent per level.
-- ============================================================================

delete from learning_path_stages where language = 'es' and level = 'A1';
delete from learning_path_stages where language = 'es' and level = 'A2';
delete from learning_path_stages where language = 'es' and level = 'B1';
delete from learning_path_stages where language = 'es' and level = 'B2';

-- A1 (topics e...a1..a5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('es','A1',0,'rodzina','Rodzina','e0000000-0000-4000-8000-0000000000a1'),
  ('es','A1',1,'kolory','Kolory','e0000000-0000-4000-8000-0000000000a2'),
  ('es','A1',2,'liczby','Liczby','e0000000-0000-4000-8000-0000000000a3'),
  ('es','A1',3,'jedzenie','Jedzenie','e0000000-0000-4000-8000-0000000000a4'),
  ('es','A1',4,'dom','Dom','e0000000-0000-4000-8000-0000000000a5'),
  ('es','A1',5,'dni tygodnia','Dni tygodnia','e0000000-0000-4000-8000-0000000000a1'),
  ('es','A1',6,'podstawowe czasowniki','Podstawowe czasowniki','e0000000-0000-4000-8000-0000000000a2'),
  ('es','A1',7,'ubrania','Ubrania','e0000000-0000-4000-8000-0000000000a3'),
  ('es','A1',8,'zwierzęta','Zwierzęta','e0000000-0000-4000-8000-0000000000a4'),
  ('es','A1',9,'czas/godziny','Czas i godziny','e0000000-0000-4000-8000-0000000000a5');

-- A2 (topics e...b1..b5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('es','A2',0,'podróże','Podróże','e0000000-0000-4000-8000-0000000000b1'),
  ('es','A2',1,'praca','Praca','e0000000-0000-4000-8000-0000000000b2'),
  ('es','A2',2,'zakupy','Zakupy','e0000000-0000-4000-8000-0000000000b3'),
  ('es','A2',3,'pogoda','Pogoda','e0000000-0000-4000-8000-0000000000b4'),
  ('es','A2',4,'zdrowie','Zdrowie','e0000000-0000-4000-8000-0000000000b5'),
  ('es','A2',5,'czas wolny','Czas wolny','e0000000-0000-4000-8000-0000000000b1'),
  ('es','A2',6,'transport','Transport','e0000000-0000-4000-8000-0000000000b2'),
  ('es','A2',7,'uczucia podstawowe','Uczucia','e0000000-0000-4000-8000-0000000000b3');

-- B1 (topics e...c1..c5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('es','B1',0,'emocje','Emocje','e0000000-0000-4000-8000-0000000000c1'),
  ('es','B1',1,'edukacja','Edukacja','e0000000-0000-4000-8000-0000000000c2'),
  ('es','B1',2,'technologia','Technologia','e0000000-0000-4000-8000-0000000000c3'),
  ('es','B1',3,'środowisko','Środowisko','e0000000-0000-4000-8000-0000000000c4'),
  ('es','B1',4,'relacje','Relacje','e0000000-0000-4000-8000-0000000000c5'),
  ('es','B1',5,'media','Media','e0000000-0000-4000-8000-0000000000c1'),
  ('es','B1',6,'kultura','Kultura','e0000000-0000-4000-8000-0000000000c2'),
  ('es','B1',7,'zwroty codzienne','Zwroty codzienne','e0000000-0000-4000-8000-0000000000c3');

-- B2 (topics e...d1..d5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('es','B2',0,'biznes','Biznes','e0000000-0000-4000-8000-0000000000d1'),
  ('es','B2',1,'polityka','Polityka','e0000000-0000-4000-8000-0000000000d2'),
  ('es','B2',2,'nauka','Nauka','e0000000-0000-4000-8000-0000000000d3'),
  ('es','B2',3,'media','Media','e0000000-0000-4000-8000-0000000000d4'),
  ('es','B2',4,'idiomy','Idiomy','e0000000-0000-4000-8000-0000000000d5'),
  ('es','B2',5,'prawo','Prawo','e0000000-0000-4000-8000-0000000000d1'),
  ('es','B2',6,'ekonomia','Ekonomia','e0000000-0000-4000-8000-0000000000d2'),
  ('es','B2',7,'zwroty zaawansowane','Zwroty zaawansowane','e0000000-0000-4000-8000-0000000000d3');
