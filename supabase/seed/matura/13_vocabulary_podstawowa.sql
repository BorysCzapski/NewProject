-- ============================================================================
-- supabase/seed/matura/13_vocabulary_podstawowa.sql
-- Vocabulary THEORY for poziom podstawowy (matura_vocabulary_words),
-- organized by CKE's official "kręgi tematyczne" (thematic circles) — the
-- standard topic structure used across all CKE foreign-language exams
-- (English, German, French, Spanish, Russian), cross-validated against
-- prep-site consensus (the primary source — the CKE Informator PDF — does
-- not itself enumerate the list; it's defined in the separate national core
-- curriculum document, referenced but not reprinted by the Informator).
-- 10 words per circle, each with a natural example sentence. Practiced via
-- FlashcardTrainer (see app/(main)/matura/nauka/slownictwo/).
--
-- Idempotent: deletes existing podstawowa words first.
-- ============================================================================

delete from matura_vocabulary_words where level = 'podstawowa';

-- ---------------------------------------------------------------------------
-- Człowiek
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Człowiek', 'appearance', 'wygląd', 'She has a friendly appearance and a warm smile.', 1),
  ('podstawowa', 'Człowiek', 'personality', 'osobowość', 'His personality makes him easy to get along with.', 2),
  ('podstawowa', 'Człowiek', 'reliable', 'niezawodny, godny zaufania', 'You can always count on him — he''s very reliable.', 3),
  ('podstawowa', 'Człowiek', 'generous', 'hojny, wielkoduszny', 'She''s incredibly generous with her time and money.', 4),
  ('podstawowa', 'Człowiek', 'stubborn', 'uparty', 'My little brother is so stubborn that he never admits he''s wrong.', 5),
  ('podstawowa', 'Człowiek', 'ambitious', 'ambitny', 'She''s an ambitious student who always aims for the best grades.', 6),
  ('podstawowa', 'Człowiek', 'jealous', 'zazdrosny', 'He felt jealous when his friend got the promotion instead of him.', 7),
  ('podstawowa', 'Człowiek', 'mood', 'nastrój', 'He''s been in a bad mood all morning.', 8),
  ('podstawowa', 'Człowiek', 'self-confidence', 'pewność siebie', 'Winning the competition boosted her self-confidence enormously.', 9),
  ('podstawowa', 'Człowiek', 'sense of humour', 'poczucie humoru', 'I love spending time with him — he has a great sense of humour.', 10);

-- ---------------------------------------------------------------------------
-- Dom
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Dom', 'furniture', 'meble', 'We bought new furniture for the living room.', 1),
  ('podstawowa', 'Dom', 'household chores', 'obowiązki domowe', 'Everyone in the family shares the household chores.', 2),
  ('podstawowa', 'Dom', 'tenant', 'lokator, najemca', 'The tenant has to pay the rent by the first of the month.', 3),
  ('podstawowa', 'Dom', 'landlord', 'właściciel wynajmowanego mieszkania', 'Our landlord fixed the broken heating within a day.', 4),
  ('podstawowa', 'Dom', 'spacious', 'przestronny', 'Their new flat is much more spacious than the old one.', 5),
  ('podstawowa', 'Dom', 'move house', 'przeprowadzić się', 'We''re moving house next weekend.', 6),
  ('podstawowa', 'Dom', 'neighbourhood', 'okolica, sąsiedztwo', 'It''s a quiet neighbourhood with lots of green spaces.', 7),
  ('podstawowa', 'Dom', 'mortgage', 'kredyt hipoteczny', 'They took out a mortgage to buy their first flat.', 8),
  ('podstawowa', 'Dom', 'cosy', 'przytulny', 'The cabin was small but incredibly cosy.', 9),
  ('podstawowa', 'Dom', 'do up (a house)', 'wyremontować, odnowić', 'They spent a whole year doing up the old cottage.', 10);

-- ---------------------------------------------------------------------------
-- Szkoła
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Szkoła', 'timetable', 'plan lekcji', 'Check the timetable — we have maths first today.', 1),
  ('podstawowa', 'Szkoła', 'compulsory', 'obowiązkowy', 'Attendance at these classes is compulsory.', 2),
  ('podstawowa', 'Szkoła', 'term', 'semestr, trymestr', 'The new term starts in September.', 3),
  ('podstawowa', 'Szkoła', 'headteacher', 'dyrektor szkoły', 'The headteacher gave a speech at the graduation ceremony.', 4),
  ('podstawowa', 'Szkoła', 'revise for an exam', 'powtarzać materiał przed egzaminem', 'I need to revise for my chemistry exam this weekend.', 5),
  ('podstawowa', 'Szkoła', 'pass (an exam)', 'zdać (egzamin)', 'I''m confident I''ll pass the test.', 6),
  ('podstawowa', 'Szkoła', 'fail (an exam)', 'oblać (egzamin)', 'He failed his driving test twice before passing.', 7),
  ('podstawowa', 'Szkoła', 'skip a lesson', 'opuścić lekcję (celowo)', 'He was punished for skipping a lesson.', 8),
  ('podstawowa', 'Szkoła', 'extra-curricular activities', 'zajęcia pozalekcyjne', 'The school offers many extra-curricular activities, like drama and chess club.', 9),
  ('podstawowa', 'Szkoła', 'classmate', 'kolega/koleżanka z klasy', 'One of my classmates helped me understand the homework.', 10);

-- ---------------------------------------------------------------------------
-- Praca
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Praca', 'employer', 'pracodawca', 'Her employer offered her a permanent contract.', 1),
  ('podstawowa', 'Praca', 'employee', 'pracownik', 'The company treats its employees very well.', 2),
  ('podstawowa', 'Praca', 'apply for a job', 'ubiegać się o pracę', 'I applied for a job at the local hospital.', 3),
  ('podstawowa', 'Praca', 'job interview', 'rozmowa kwalifikacyjna', 'I have a job interview tomorrow morning.', 4),
  ('podstawowa', 'Praca', 'CV (curriculum vitae)', 'CV, życiorys zawodowy', 'Make sure your CV highlights your relevant experience.', 5),
  ('podstawowa', 'Praca', 'salary', 'pensja, wynagrodzenie', 'The salary for this position is quite competitive.', 6),
  ('podstawowa', 'Praca', 'promotion', 'awans', 'She got a promotion after just one year in the company.', 7),
  ('podstawowa', 'Praca', 'resign', 'zrezygnować z pracy', 'He decided to resign after a disagreement with his boss.', 8),
  ('podstawowa', 'Praca', 'unemployed', 'bezrobotny', 'He''s been unemployed since the factory closed down.', 9),
  ('podstawowa', 'Praca', 'part-time job', 'praca w niepełnym wymiarze godzin', 'Many students take a part-time job to earn extra money.', 10);

-- ---------------------------------------------------------------------------
-- Życie rodzinne i towarzyskie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'relative', 'krewny', 'We invited all our relatives to the wedding.', 1),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'sibling', 'rodzeństwo (jedna osoba)', 'I have two siblings, a brother and a sister.', 2),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'get on well with somebody', 'dobrze się dogadywać z kimś', 'I get on really well with my grandmother.', 3),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'get married', 'pobrać się', 'They got married last summer in a small ceremony.', 4),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'bring up (children)', 'wychowywać (dzieci)', 'They brought up their children to be independent.', 5),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'close friend', 'bliski przyjaciel', 'She''s my closest friend — we''ve known each other for years.', 6),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'keep in touch', 'utrzymywać kontakt', 'We still keep in touch even though we live in different cities.', 7),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'celebration', 'uroczystość, obchody', 'The whole family gathered for the celebration.', 8),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'reunion', 'spotkanie po latach, zjazd', 'We''re organising a family reunion this summer.', 9),
  ('podstawowa', 'Życie rodzinne i towarzyskie', 'argument (with somebody)', 'kłótnia (z kimś)', 'They had an argument about whose turn it was to cook.', 10);

-- ---------------------------------------------------------------------------
-- Żywienie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Żywienie', 'ingredient', 'składnik (potrawy)', 'Flour and eggs are the main ingredients of this cake.', 1),
  ('podstawowa', 'Żywienie', 'recipe', 'przepis (kulinarny)', 'She found the recipe for the soup online.', 2),
  ('podstawowa', 'Żywienie', 'tasty', 'smaczny', 'This dish is really tasty.', 3),
  ('podstawowa', 'Żywienie', 'diet', 'dieta', 'He''s on a strict diet to lose weight.', 4),
  ('podstawowa', 'Żywienie', 'leftovers', 'resztki jedzenia', 'We had the leftovers for lunch the next day.', 5),
  ('podstawowa', 'Żywienie', 'starving', 'bardzo głodny', 'Let''s eat now, I''m starving!', 6),
  ('podstawowa', 'Żywienie', 'fussy eater', 'wybredny jedzeniowo', 'My little sister is a really fussy eater.', 7),
  ('podstawowa', 'Żywienie', 'go off (food)', 'zepsuć się (o jedzeniu)', 'The milk has gone off — throw it away.', 8),
  ('podstawowa', 'Żywienie', 'ready meal', 'danie gotowe (do odgrzania)', 'We often buy ready meals when we''re too tired to cook.', 9),
  ('podstawowa', 'Żywienie', 'nutritious', 'odżywczy, wartościowy', 'Try to choose nutritious snacks instead of sweets.', 10);

-- ---------------------------------------------------------------------------
-- Zakupy i usługi
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Zakupy i usługi', 'receipt', 'paragon', 'Keep the receipt in case you want to return the item.', 1),
  ('podstawowa', 'Zakupy i usługi', 'refund', 'zwrot pieniędzy', 'The shop gave me a full refund for the faulty product.', 2),
  ('podstawowa', 'Zakupy i usługi', 'complaint', 'reklamacja, skarga', 'I made a complaint about the poor service.', 3),
  ('podstawowa', 'Zakupy i usługi', 'bargain', 'okazja (dobra cena)', 'I found a real bargain in the sale.', 4),
  ('podstawowa', 'Zakupy i usługi', 'customer service', 'obsługa klienta', 'The customer service in that shop is excellent.', 5),
  ('podstawowa', 'Zakupy i usługi', 'out of stock', 'brak w magazynie, wyprzedane', 'Sorry, that size is currently out of stock.', 6),
  ('podstawowa', 'Zakupy i usługi', 'sale', 'wyprzedaż', 'I bought this jacket in the winter sale.', 7),
  ('podstawowa', 'Zakupy i usługi', 'delivery', 'dostawa', 'Delivery usually takes three to five working days.', 8),
  ('podstawowa', 'Zakupy i usługi', 'warranty', 'gwarancja', 'The laptop comes with a two-year warranty.', 9),
  ('podstawowa', 'Zakupy i usługi', 'overcharge', 'policzyć za dużo, zawyżyć cenę', 'I think the waiter overcharged us for the drinks.', 10);

-- ---------------------------------------------------------------------------
-- Podróżowanie i turystyka
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Podróżowanie i turystyka', 'accommodation', 'zakwaterowanie', 'We booked our accommodation months in advance.', 1),
  ('podstawowa', 'Podróżowanie i turystyka', 'journey', 'podróż (trasa)', 'The journey to the coast took almost six hours.', 2),
  ('podstawowa', 'Podróżowanie i turystyka', 'departure', 'odlot, odjazd', 'Please arrive two hours before departure.', 3),
  ('podstawowa', 'Podróżowanie i turystyka', 'delay', 'opóźnienie', 'Our flight was delayed by three hours.', 4),
  ('podstawowa', 'Podróżowanie i turystyka', 'luggage', 'bagaż', 'Make sure your luggage doesn''t exceed the weight limit.', 5),
  ('podstawowa', 'Podróżowanie i turystyka', 'sightseeing', 'zwiedzanie', 'We spent the whole day sightseeing around the old town.', 6),
  ('podstawowa', 'Podróżowanie i turystyka', 'package holiday', 'wczasy zorganizowane', 'They booked a package holiday to Greece.', 7),
  ('podstawowa', 'Podróżowanie i turystyka', 'souvenir', 'pamiątka (z podróży)', 'I bought a small souvenir for my grandmother.', 8),
  ('podstawowa', 'Podróżowanie i turystyka', 'abroad', 'za granicą', 'She''s studying abroad this semester.', 9),
  ('podstawowa', 'Podróżowanie i turystyka', 'board (a plane/train)', 'wsiadać (do samolotu/pociągu)', 'Passengers can now board the plane.', 10);

-- ---------------------------------------------------------------------------
-- Kultura
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Kultura', 'exhibition', 'wystawa', 'We visited an art exhibition at the gallery.', 1),
  ('podstawowa', 'Kultura', 'box office', 'kasa biletowa (kino/teatr)', 'Tickets are available at the box office.', 2),
  ('podstawowa', 'Kultura', 'plot (of a film/book)', 'fabuła (filmu/książki)', 'The plot of the film was quite predictable.', 3),
  ('podstawowa', 'Kultura', 'review', 'recenzja', 'The new album got great reviews from critics.', 4),
  ('podstawowa', 'Kultura', 'release (a film/album)', 'wydać, wypuścić (film/album)', 'The band released their new album last week.', 5),
  ('podstawowa', 'Kultura', 'masterpiece', 'arcydzieło', 'Many consider this novel a true masterpiece.', 6),
  ('podstawowa', 'Kultura', 'cast', 'obsada (aktorska)', 'The film has an impressive cast of actors.', 7),
  ('podstawowa', 'Kultura', 'soundtrack', 'ścieżka dźwiękowa', 'The soundtrack of the movie was composed by a famous musician.', 8),
  ('podstawowa', 'Kultura', 'subtitles', 'napisy (filmowe)', 'I prefer watching foreign films with subtitles.', 9),
  ('podstawowa', 'Kultura', 'gig', 'koncert (nieformalnie)', 'We''re going to a gig on Friday night.', 10);

-- ---------------------------------------------------------------------------
-- Sport
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Sport', 'compete', 'rywalizować, brać udział w zawodach', 'She competes in swimming championships every year.', 1),
  ('podstawowa', 'Sport', 'referee', 'sędzia (sportowy)', 'The referee gave the player a yellow card.', 2),
  ('podstawowa', 'Sport', 'draw (a match)', 'remis', 'The match ended in a 2-2 draw.', 3),
  ('podstawowa', 'Sport', 'defeat', 'pokonać, porażka', 'Our team suffered a heavy defeat last weekend.', 4),
  ('podstawowa', 'Sport', 'fitness', 'kondycja fizyczna', 'Regular training improves your overall fitness.', 5),
  ('podstawowa', 'Sport', 'injury', 'kontuzja', 'The striker is out with a knee injury.', 6),
  ('podstawowa', 'Sport', 'spectator', 'widz (na wydarzeniu sportowym)', 'Thousands of spectators filled the stadium.', 7),
  ('podstawowa', 'Sport', 'training session', 'trening, sesja treningowa', 'The team has a training session every Tuesday.', 8),
  ('podstawowa', 'Sport', 'score a goal', 'strzelić gola', 'He scored the winning goal in the final minute.', 9),
  ('podstawowa', 'Sport', 'championship', 'mistrzostwa', 'They won the national championship last year.', 10);

-- ---------------------------------------------------------------------------
-- Zdrowie
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Zdrowie', 'symptom', 'objaw', 'A high temperature is a common symptom of the flu.', 1),
  ('podstawowa', 'Zdrowie', 'recover (from an illness)', 'wyzdrowieć', 'It took her two weeks to fully recover from the flu.', 2),
  ('podstawowa', 'Zdrowie', 'prescription', 'recepta', 'The doctor gave me a prescription for antibiotics.', 3),
  ('podstawowa', 'Zdrowie', 'treatment', 'leczenie', 'The treatment lasted several months.', 4),
  ('podstawowa', 'Zdrowie', 'injection', 'zastrzyk', 'The nurse gave him an injection to relieve the pain.', 5),
  ('podstawowa', 'Zdrowie', 'allergic (to)', 'uczulony (na)', 'I''m allergic to peanuts.', 6),
  ('podstawowa', 'Zdrowie', 'painkiller', 'środek przeciwbólowy', 'Take a painkiller if the headache doesn''t go away.', 7),
  ('podstawowa', 'Zdrowie', 'surgery', 'operacja (chirurgiczna)', 'He had to undergo surgery on his knee.', 8),
  ('podstawowa', 'Zdrowie', 'exhausted', 'wyczerpany', 'After the long shift, she felt completely exhausted.', 9),
  ('podstawowa', 'Zdrowie', 'well-being', 'dobre samopoczucie, kondycja psychofizyczna', 'Regular exercise has a positive effect on mental well-being.', 10);

-- ---------------------------------------------------------------------------
-- Nauka i technika
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Nauka i technika', 'device', 'urządzenie', 'This small device can measure your heart rate.', 1),
  ('podstawowa', 'Nauka i technika', 'invention', 'wynalazek', 'The invention of the internet changed the world.', 2),
  ('podstawowa', 'Nauka i technika', 'artificial intelligence', 'sztuczna inteligencja', 'Artificial intelligence is being used in more and more industries.', 3),
  ('podstawowa', 'Nauka i technika', 'upload', 'przesłać (plik do sieci)', 'Please upload your assignment before midnight.', 4),
  ('podstawowa', 'Nauka i technika', 'breakthrough', 'przełom (naukowy)', 'Scientists announced a major breakthrough in cancer research.', 5),
  ('podstawowa', 'Nauka i technika', 'reliable (technology)', 'niezawodny', 'This app is really reliable — it never crashes.', 6),
  ('podstawowa', 'Nauka i technika', 'innovative', 'innowacyjny', 'The company is known for its innovative products.', 7),
  ('podstawowa', 'Nauka i technika', 'malfunction', 'awaria, wadliwe działanie', 'The machine stopped working due to a malfunction.', 8),
  ('podstawowa', 'Nauka i technika', 'research', 'badania (naukowe)', 'The university is conducting research into renewable energy.', 9),
  ('podstawowa', 'Nauka i technika', 'update (software)', 'zaktualizować (oprogramowanie)', 'Remember to update the app to the latest version.', 10);

-- ---------------------------------------------------------------------------
-- Świat przyrody
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Świat przyrody', 'endangered species', 'gatunek zagrożony wyginięciem', 'Tigers are an endangered species.', 1),
  ('podstawowa', 'Świat przyrody', 'drought', 'susza', 'The region has suffered from a severe drought this year.', 2),
  ('podstawowa', 'Świat przyrody', 'pollution', 'zanieczyszczenie', 'Air pollution is a serious problem in big cities.', 3),
  ('podstawowa', 'Świat przyrody', 'renewable energy', 'energia odnawialna', 'The government is investing more in renewable energy.', 4),
  ('podstawowa', 'Świat przyrody', 'wildlife', 'dzika przyroda, fauna', 'The national park protects the local wildlife.', 5),
  ('podstawowa', 'Świat przyrody', 'natural disaster', 'klęska żywiołowa', 'The earthquake was one of the worst natural disasters in the country''s history.', 6),
  ('podstawowa', 'Świat przyrody', 'habitat', 'siedlisko', 'Deforestation destroys the natural habitat of many animals.', 7),
  ('podstawowa', 'Świat przyrody', 'sustainable', 'zrównoważony (ekologicznie)', 'The company switched to more sustainable packaging.', 8),
  ('podstawowa', 'Świat przyrody', 'climate change', 'zmiana klimatu', 'Climate change is affecting weather patterns around the world.', 9),
  ('podstawowa', 'Świat przyrody', 'recycle', 'poddawać recyklingowi', 'We recycle paper, plastic and glass at home.', 10);

-- ---------------------------------------------------------------------------
-- Państwo i społeczeństwo
-- ---------------------------------------------------------------------------
insert into matura_vocabulary_words (level, category, word_en, translation_pl, example_sentence, order_index) values
  ('podstawowa', 'Państwo i społeczeństwo', 'citizen', 'obywatel', 'Every citizen has the right to vote.', 1),
  ('podstawowa', 'Państwo i społeczeństwo', 'election', 'wybory', 'The presidential election takes place next month.', 2),
  ('podstawowa', 'Państwo i społeczeństwo', 'law', 'prawo, ustawa', 'It''s against the law to drive without a licence.', 3),
  ('podstawowa', 'Państwo i społeczeństwo', 'crime rate', 'wskaźnik przestępczości', 'The crime rate has decreased in the city centre.', 4),
  ('podstawowa', 'Państwo i społeczeństwo', 'government', 'rząd', 'The government announced new tax reforms.', 5),
  ('podstawowa', 'Państwo i społeczeństwo', 'equality', 'równość', 'The organisation campaigns for equality and human rights.', 6),
  ('podstawowa', 'Państwo i społeczeństwo', 'volunteer', 'wolontariusz, wolontariat', 'She volunteers at the local homeless shelter every weekend.', 7),
  ('podstawowa', 'Państwo i społeczeństwo', 'charity', 'organizacja charytatywna', 'He donates money to charity every month.', 8),
  ('podstawowa', 'Państwo i społeczeństwo', 'protest', 'protest, protestować', 'Thousands of people took part in the protest.', 9),
  ('podstawowa', 'Państwo i społeczeństwo', 'community', 'społeczność', 'The new centre brings the whole community together.', 10);

