-- ============================================================================
-- supabase/seed/matura/14_vocabulary_rozszerzona.sql
-- Vocabulary ADDITIONS for poziom rozszerzony — 5 more advanced/nuanced
-- words per thematic circle, on top of 13_vocabulary_podstawowa.sql (a
-- rozszerzona student sees BOTH, see visibleMaturaLevels() in
-- lib/matura/constants.ts). Same circle names as podstawowa so the
-- słownictwo hub merges word counts per circle across both levels.
--
-- Idempotent: deletes existing rozszerzona words first.
-- ============================================================================

delete from matura_vocabulary_words where level = 'rozszerzona';

-- ---------------------------------------------------------------------------
-- Człowiek
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Człowiek', 'temperament', 'temperament', 'Even as a baby, she had a calm temperament.', 1),
  ('rozszerzona', 'Człowiek', 'arrogant', 'arogancki', 'His arrogant attitude made him unpopular with colleagues.', 2),
  ('rozszerzona', 'Człowiek', 'compassionate', 'współczujący', 'The nurse was known for being incredibly compassionate.', 3),
  ('rozszerzona', 'Człowiek', 'resilience', 'odporność psychiczna, hart ducha', 'Her resilience helped her recover quickly after the setback.', 4),
  ('rozszerzona', 'Człowiek', 'two-faced', 'dwulicowy', 'I don''t trust him — he''s quite two-faced.', 5);

-- ---------------------------------------------------------------------------
-- Dom
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Dom', 'detached house', 'dom wolnostojący', 'They live in a detached house with a large garden.', 1),
  ('rozszerzona', 'Dom', 'eviction', 'eksmisja', 'The tenants faced eviction after months of unpaid rent.', 2),
  ('rozszerzona', 'Dom', 'décor', 'wystrój wnętrza', 'The flat has a modern, minimalist décor.', 3),
  ('rozszerzona', 'Dom', 'utility bills', 'rachunki za media', 'Utility bills have risen sharply this year.', 4),
  ('rozszerzona', 'Dom', 'run-down (building)', 'zaniedbany, podupadły', 'The run-down building was finally demolished last year.', 5);

-- ---------------------------------------------------------------------------
-- Szkoła
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Szkoła', 'curriculum', 'program nauczania', 'The new curriculum puts more emphasis on practical skills.', 1),
  ('rozszerzona', 'Szkoła', 'plagiarism', 'plagiat', 'Plagiarism can lead to serious academic consequences.', 2),
  ('rozszerzona', 'Szkoła', 'underachieve', 'osiągać wyniki poniżej możliwości', 'Some gifted students underachieve due to a lack of motivation.', 3),
  ('rozszerzona', 'Szkoła', 'literacy', 'umiejętność czytania i pisania', 'The programme aims to improve literacy among young children.', 4),
  ('rozszerzona', 'Szkoła', 'tuition fees', 'czesne', 'Tuition fees at private universities can be very high.', 5);

-- ---------------------------------------------------------------------------
-- Praca
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Praca', 'redundancy', 'zwolnienie (z powodu redukcji etatów)', 'The factory announced redundancies affecting two hundred workers.', 1),
  ('rozszerzona', 'Praca', 'workload', 'obciążenie pracą', 'Her workload has increased significantly since the promotion.', 2),
  ('rozszerzona', 'Praca', 'perk', 'dodatkowa korzyść (poza pensją)', 'One of the perks of the job is free gym membership.', 3),
  ('rozszerzona', 'Praca', 'burnout', 'wypalenie zawodowe', 'He took a month off work to deal with burnout.', 4),
  ('rozszerzona', 'Praca', 'qualifications', 'kwalifikacje', 'She has all the necessary qualifications for the role.', 5);

-- ---------------------------------------------------------------------------
-- Życie rodzinne i towarzyskie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Życie rodzinne i towarzyskie', 'extended family', 'rodzina wielopokoleniowa, dalsza rodzina', 'We often visit our extended family during the holidays.', 1),
  ('rozszerzona', 'Życie rodzinne i towarzyskie', 'estranged', 'skłócony, wyobcowany (z rodziną)', 'He''s been estranged from his father for years.', 2),
  ('rozszerzona', 'Życie rodzinne i towarzyskie', 'upbringing', 'wychowanie (sposób wychowania)', 'Her strict upbringing shaped her strong work ethic.', 3),
  ('rozszerzona', 'Życie rodzinne i towarzyskie', 'peer pressure', 'presja rówieśników', 'Many teenagers struggle with peer pressure.', 4),
  ('rozszerzona', 'Życie rodzinne i towarzyskie', 'acquaintance', 'znajomy (mniej bliski niż przyjaciel)', 'He''s just an acquaintance, not a close friend.', 5);

-- ---------------------------------------------------------------------------
-- Żywienie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Żywienie', 'malnutrition', 'niedożywienie', 'Malnutrition remains a serious problem in some parts of the world.', 1),
  ('rozszerzona', 'Żywienie', 'processed food', 'żywność przetworzona', 'Try to avoid heavily processed food.', 2),
  ('rozszerzona', 'Żywienie', 'staple food', 'podstawowy produkt żywnościowy', 'Rice is a staple food in many Asian countries.', 3),
  ('rozszerzona', 'Żywienie', 'binge eating', 'objadanie się', 'Stress can sometimes lead to binge eating.', 4),
  ('rozszerzona', 'Żywienie', 'organic produce', 'żywność ekologiczna', 'More people are choosing organic produce over conventionally grown food.', 5);

-- ---------------------------------------------------------------------------
-- Zakupy i usługi
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Zakupy i usługi', 'consumer rights', 'prawa konsumenta', 'Consumer rights protect customers from faulty products.', 1),
  ('rozszerzona', 'Zakupy i usługi', 'impulse buying', 'kupowanie pod wpływem impulsu', 'Online shopping often encourages impulse buying.', 2),
  ('rozszerzona', 'Zakupy i usługi', 'counterfeit', 'podrobiony, podróbka', 'The market was full of counterfeit designer bags.', 3),
  ('rozszerzona', 'Zakupy i usługi', 'subscription', 'subskrypcja, prenumerata', 'I cancelled my streaming subscription to save money.', 4),
  ('rozszerzona', 'Zakupy i usługi', 'haggle', 'targować się', 'In some countries, it''s normal to haggle over the price.', 5);

-- ---------------------------------------------------------------------------
-- Podróżowanie i turystyka
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Podróżowanie i turystyka', 'itinerary', 'plan podróży, trasa', 'Our itinerary includes three cities in ten days.', 1),
  ('rozszerzona', 'Podróżowanie i turystyka', 'off the beaten track', 'z dala od utartych szlaków turystycznych', 'We prefer destinations off the beaten track.', 2),
  ('rozszerzona', 'Podróżowanie i turystyka', 'layover', 'przerwa międzylotnicza', 'We had a six-hour layover in Frankfurt.', 3),
  ('rozszerzona', 'Podróżowanie i turystyka', 'culture shock', 'szok kulturowy', 'She experienced culture shock during her first weeks abroad.', 4),
  ('rozszerzona', 'Podróżowanie i turystyka', 'all-inclusive', 'all inclusive (wszystko wliczone w cenę)', 'We booked an all-inclusive resort for our holiday.', 5);

-- ---------------------------------------------------------------------------
-- Kultura
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Kultura', 'adaptation (of a book)', 'adaptacja (filmowa książki)', 'The film is a loose adaptation of the novel.', 1),
  ('rozszerzona', 'Kultura', 'critically acclaimed', 'uznany przez krytyków', 'It''s one of the most critically acclaimed films of the decade.', 2),
  ('rozszerzona', 'Kultura', 'contemporary art', 'sztuka współczesna', 'The museum specialises in contemporary art.', 3),
  ('rozszerzona', 'Kultura', 'heritage', 'dziedzictwo (kulturowe)', 'The old town is part of the country''s cultural heritage.', 4),
  ('rozszerzona', 'Kultura', 'blockbuster', 'hit kinowy, kasowy przebój', 'The film became an instant blockbuster.', 5);

-- ---------------------------------------------------------------------------
-- Sport
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Sport', 'underdog', 'słabszy zawodnik/drużyna (niefaworyzowany)', 'The underdog team won against all expectations.', 1),
  ('rozszerzona', 'Sport', 'sportsmanship', 'postawa fair play', 'He showed great sportsmanship after losing the match.', 2),
  ('rozszerzona', 'Sport', 'doping', 'doping', 'The athlete was banned for two years after a doping scandal.', 3),
  ('rozszerzona', 'Sport', 'endurance', 'wytrzymałość', 'Marathon runners need exceptional endurance.', 4),
  ('rozszerzona', 'Sport', 'amateur', 'amator', 'He started as an amateur before turning professional.', 5);

-- ---------------------------------------------------------------------------
-- Zdrowie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Zdrowie', 'chronic illness', 'choroba przewlekła', 'She has been living with a chronic illness for years.', 1),
  ('rozszerzona', 'Zdrowie', 'epidemic', 'epidemia', 'The country dealt with a flu epidemic last winter.', 2),
  ('rozszerzona', 'Zdrowie', 'mental health', 'zdrowie psychiczne', 'More schools are focusing on students'' mental health.', 3),
  ('rozszerzona', 'Zdrowie', 'side effect', 'skutek uboczny', 'The medicine can cause mild side effects like drowsiness.', 4),
  ('rozszerzona', 'Zdrowie', 'life expectancy', 'przewidywana długość życia', 'Life expectancy has risen significantly over the past century.', 5);

-- ---------------------------------------------------------------------------
-- Nauka i technika
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Nauka i technika', 'cybersecurity', 'cyberbezpieczeństwo', 'The company invested heavily in cybersecurity after the attack.', 1),
  ('rozszerzona', 'Nauka i technika', 'algorithm', 'algorytm', 'Social media platforms use algorithms to recommend content.', 2),
  ('rozszerzona', 'Nauka i technika', 'groundbreaking', 'przełomowy', 'It was a groundbreaking discovery in medical science.', 3),
  ('rozszerzona', 'Nauka i technika', 'obsolete', 'przestarzały, wyszły z użycia', 'That technology quickly became obsolete.', 4),
  ('rozszerzona', 'Nauka i technika', 'data privacy', 'prywatność danych', 'Data privacy has become a major concern for internet users.', 5);

-- ---------------------------------------------------------------------------
-- Świat przyrody
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Świat przyrody', 'carbon footprint', 'ślad węglowy', 'Flying regularly increases your carbon footprint.', 1),
  ('rozszerzona', 'Świat przyrody', 'ecosystem', 'ekosystem', 'The oil spill damaged the local marine ecosystem.', 2),
  ('rozszerzona', 'Świat przyrody', 'deforestation', 'wylesianie', 'Deforestation is one of the main causes of habitat loss.', 3),
  ('rozszerzona', 'Świat przyrody', 'biodiversity', 'bioróżnorodność', 'The rainforest is home to an incredible level of biodiversity.', 4),
  ('rozszerzona', 'Świat przyrody', 'greenhouse gas', 'gaz cieplarniany', 'Cars are a major source of greenhouse gas emissions.', 5);

-- ---------------------------------------------------------------------------
-- Państwo i społeczeństwo
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('rozszerzona', 'Państwo i społeczeństwo', 'legislation', 'ustawodawstwo, przepisy prawne', 'New legislation was introduced to protect workers'' rights.', 1),
  ('rozszerzona', 'Państwo i społeczeństwo', 'discrimination', 'dyskryminacja', 'The law prohibits discrimination based on gender or race.', 2),
  ('rozszerzona', 'Państwo i społeczeństwo', 'human rights', 'prawa człowieka', 'The organisation fights for human rights around the world.', 3),
  ('rozszerzona', 'Państwo i społeczeństwo', 'welfare state', 'państwo opiekuńcze', 'Scandinavian countries are known for their strong welfare state.', 4),
  ('rozszerzona', 'Państwo i społeczeństwo', 'corruption', 'korupcja', 'The government promised to fight corruption in public institutions.', 5);

