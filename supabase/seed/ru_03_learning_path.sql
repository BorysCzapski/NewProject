-- ============================================================================
-- ru_03_learning_path.sql
-- Learning-path stages for RUSSIAN (language = 'ru'). Category labels match
-- ru_01_vocabulary_*.sql; grammar_topic_id UUIDs match ru_02_grammar_*.sql.
-- ============================================================================

delete from learning_path_stages where language = 'ru' and level = 'A1';
delete from learning_path_stages where language = 'ru' and level = 'A2';
delete from learning_path_stages where language = 'ru' and level = 'B1';
delete from learning_path_stages where language = 'ru' and level = 'B2';

-- A1 (topics f...a1..a5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('ru','A1',0,'rodzina','Rodzina','f0000000-0000-4000-8000-0000000000a1'),
  ('ru','A1',1,'kolory','Kolory','f0000000-0000-4000-8000-0000000000a2'),
  ('ru','A1',2,'liczby','Liczby','f0000000-0000-4000-8000-0000000000a3'),
  ('ru','A1',3,'jedzenie','Jedzenie','f0000000-0000-4000-8000-0000000000a4'),
  ('ru','A1',4,'dom','Dom','f0000000-0000-4000-8000-0000000000a5'),
  ('ru','A1',5,'dni tygodnia','Dni tygodnia','f0000000-0000-4000-8000-0000000000a1'),
  ('ru','A1',6,'podstawowe czasowniki','Podstawowe czasowniki','f0000000-0000-4000-8000-0000000000a2'),
  ('ru','A1',7,'ubrania','Ubrania','f0000000-0000-4000-8000-0000000000a3'),
  ('ru','A1',8,'zwierzęta','Zwierzęta','f0000000-0000-4000-8000-0000000000a4'),
  ('ru','A1',9,'czas/godziny','Czas i godziny','f0000000-0000-4000-8000-0000000000a5');

-- A2 (topics f...b1..b5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('ru','A2',0,'podróże','Podróże','f0000000-0000-4000-8000-0000000000b1'),
  ('ru','A2',1,'praca','Praca','f0000000-0000-4000-8000-0000000000b2'),
  ('ru','A2',2,'zakupy','Zakupy','f0000000-0000-4000-8000-0000000000b3'),
  ('ru','A2',3,'pogoda','Pogoda','f0000000-0000-4000-8000-0000000000b4'),
  ('ru','A2',4,'zdrowie','Zdrowie','f0000000-0000-4000-8000-0000000000b5'),
  ('ru','A2',5,'czas wolny','Czas wolny','f0000000-0000-4000-8000-0000000000b1'),
  ('ru','A2',6,'transport','Transport','f0000000-0000-4000-8000-0000000000b2'),
  ('ru','A2',7,'uczucia podstawowe','Uczucia','f0000000-0000-4000-8000-0000000000b3');

-- B1 (topics f...c1..c5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('ru','B1',0,'emocje','Emocje','f0000000-0000-4000-8000-0000000000c1'),
  ('ru','B1',1,'edukacja','Edukacja','f0000000-0000-4000-8000-0000000000c2'),
  ('ru','B1',2,'technologia','Technologia','f0000000-0000-4000-8000-0000000000c3'),
  ('ru','B1',3,'środowisko','Środowisko','f0000000-0000-4000-8000-0000000000c4'),
  ('ru','B1',4,'relacje','Relacje','f0000000-0000-4000-8000-0000000000c5'),
  ('ru','B1',5,'media','Media','f0000000-0000-4000-8000-0000000000c1'),
  ('ru','B1',6,'kultura','Kultura','f0000000-0000-4000-8000-0000000000c2'),
  ('ru','B1',7,'zwroty codzienne','Zwroty codzienne','f0000000-0000-4000-8000-0000000000c3');

-- B2 (topics f...d1..d5)
insert into learning_path_stages (language, level, order_index, category, title, grammar_topic_id) values
  ('ru','B2',0,'biznes','Biznes','f0000000-0000-4000-8000-0000000000d1'),
  ('ru','B2',1,'polityka','Polityka','f0000000-0000-4000-8000-0000000000d2'),
  ('ru','B2',2,'nauka','Nauka','f0000000-0000-4000-8000-0000000000d3'),
  ('ru','B2',3,'media','Media','f0000000-0000-4000-8000-0000000000d4'),
  ('ru','B2',4,'idiomy','Idiomy','f0000000-0000-4000-8000-0000000000d5'),
  ('ru','B2',5,'prawo','Prawo','f0000000-0000-4000-8000-0000000000d1'),
  ('ru','B2',6,'ekonomia','Ekonomia','f0000000-0000-4000-8000-0000000000d2'),
  ('ru','B2',7,'zwroty zaawansowane','Zwroty zaawansowane','f0000000-0000-4000-8000-0000000000d3');
