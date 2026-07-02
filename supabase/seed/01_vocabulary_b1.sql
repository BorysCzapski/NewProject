-- ============================================================================
-- 01_vocabulary_b1.sql
-- Seed data: CEFR level B1 vocabulary words for the English-learning app.
-- Covers 8 thematic categories (emocje, edukacja, technologia, środowisko,
-- relacje, podstawowe phrasal verbs, media, kultura), roughly 20-22 words
-- each. Safe to re-run: existing B1 rows are deleted first.
-- ============================================================================

delete from vocabulary_words where level = 'B1';

-- ----------------------------------------------------------------------------
-- emocje (emotions)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'emocje', 'anxious', 'zaniepokojony / niespokojny', 'She felt anxious before her driving test.'),
  ('B1', 'emocje', 'embarrassed', 'zawstydzony', 'He was embarrassed when he forgot her name.'),
  ('B1', 'emocje', 'jealous', 'zazdrosny', 'My little brother gets jealous when I get more attention.'),
  ('B1', 'emocje', 'furious', 'wściekły', 'She was furious when she found out about the lie.'),
  ('B1', 'emocje', 'relieved', 'odczuwający ulgę', 'I was relieved to hear the exam results were good.'),
  ('B1', 'emocje', 'confident', 'pewny siebie', 'He felt confident about the interview.'),
  ('B1', 'emocje', 'disappointed', 'rozczarowany', 'They were disappointed with the final score.'),
  ('B1', 'emocje', 'nervous', 'zdenerwowany', 'I always get nervous before public speaking.'),
  ('B1', 'emocje', 'grateful', 'wdzięczny', 'We are grateful for all your help.'),
  ('B1', 'emocje', 'ashamed', 'zawstydzony (poczucie winy)', 'He felt ashamed of how he had treated his friend.'),
  ('B1', 'emocje', 'overwhelmed', 'przytłoczony', 'She felt overwhelmed by all the tasks at work.'),
  ('B1', 'emocje', 'content', 'zadowolony (spokojnie)', 'He seemed content just sitting by the lake.'),
  ('B1', 'emocje', 'frustrated', 'sfrustrowany', 'I get frustrated when the internet is slow.'),
  ('B1', 'emocje', 'curious', 'ciekawy (dociekliwy)', 'The children were curious about the old house.'),
  ('B1', 'emocje', 'lonely', 'samotny', 'He felt lonely after moving to a new city.'),
  ('B1', 'emocje', 'proud', 'dumny', 'Her parents were proud of her achievement.'),
  ('B1', 'emocje', 'annoyed', 'zirytowany', 'She was annoyed by the constant noise.'),
  ('B1', 'emocje', 'terrified', 'przerażony', 'He was terrified of the dark as a child.'),
  ('B1', 'emocje', 'sympathetic', 'współczujący', 'The nurse was very sympathetic to the frightened patient.'),
  ('B1', 'emocje', 'moody', 'humorzasty / kapryśny', 'Teenagers can be quite moody sometimes.'),
  ('B1', 'emocje', 'insecure', 'niepewny siebie', 'She felt insecure about speaking a foreign language.');

-- ----------------------------------------------------------------------------
-- edukacja (education)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'edukacja', 'curriculum', 'program nauczania', 'The new curriculum includes more practical lessons.'),
  ('B1', 'edukacja', 'assignment', 'zadanie domowe / praca zaliczeniowa', 'She handed in her assignment a day early.'),
  ('B1', 'edukacja', 'lecture', 'wykład', 'The professor gave a fascinating lecture on history.'),
  ('B1', 'edukacja', 'scholarship', 'stypendium', 'He received a scholarship to study abroad.'),
  ('B1', 'edukacja', 'graduate', 'absolwent / kończyć studia', 'She will graduate from university next year.'),
  ('B1', 'edukacja', 'degree', 'stopień naukowy / dyplom', 'He has a degree in economics.'),
  ('B1', 'edukacja', 'tuition', 'czesne', 'Tuition fees have increased this year.'),
  ('B1', 'edukacja', 'revise', 'powtarzać materiał', 'I need to revise for my chemistry exam.'),
  ('B1', 'edukacja', 'grade', 'ocena / stopień', 'She got the highest grade in the class.'),
  ('B1', 'edukacja', 'plagiarism', 'plagiat', 'The university takes plagiarism very seriously.'),
  ('B1', 'edukacja', 'enrol', 'zapisać się (na kurs)', 'He decided to enrol in an evening course.'),
  ('B1', 'edukacja', 'lecturer', 'wykładowca', 'Our lecturer is an expert in marine biology.'),
  ('B1', 'edukacja', 'coursework', 'praca zaliczeniowa / zajęcia', 'Coursework counts for forty percent of the final mark.'),
  ('B1', 'edukacja', 'campus', 'kampus', 'There is a large library on campus.'),
  ('B1', 'edukacja', 'semester', 'semestr', 'The autumn semester starts in October.'),
  ('B1', 'edukacja', 'lecture hall', 'sala wykładowa', 'The lecture hall was full of first-year students.'),
  ('B1', 'edukacja', 'thesis', 'praca dyplomowa', 'She is writing her thesis on climate change.'),
  ('B1', 'edukacja', 'qualification', 'kwalifikacja', 'You need a teaching qualification for this job.'),
  ('B1', 'edukacja', 'motivate', 'motywować', 'Good teachers know how to motivate students.'),
  ('B1', 'edukacja', 'literacy', 'umiejętność czytania i pisania', 'The programme aims to improve adult literacy.'),
  ('B1', 'edukacja', 'distance learning', 'nauka zdalna', 'Distance learning became very common during the pandemic.');

-- ----------------------------------------------------------------------------
-- technologia (technology)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'technologia', 'device', 'urządzenie', 'This device can measure your heart rate.'),
  ('B1', 'technologia', 'software', 'oprogramowanie', 'We need to update the software before the meeting.'),
  ('B1', 'technologia', 'password', 'hasło', 'Never share your password with anyone.'),
  ('B1', 'technologia', 'download', 'pobierać (plik)', 'You can download the app for free.'),
  ('B1', 'technologia', 'upload', 'przesyłać (plik)', 'She uploaded the photos to the shared folder.'),
  ('B1', 'technologia', 'battery', 'bateria / akumulator', 'My phone battery dies very quickly.'),
  ('B1', 'technologia', 'wireless', 'bezprzewodowy', 'The office has a wireless network for guests.'),
  ('B1', 'technologia', 'browser', 'przeglądarka internetowa', 'Which browser do you use most often?'),
  ('B1', 'technologia', 'malware', 'złośliwe oprogramowanie', 'The email contained a link with malware.'),
  ('B1', 'technologia', 'backup', 'kopia zapasowa', 'Always keep a backup of your important files.'),
  ('B1', 'technologia', 'update', 'aktualizacja / aktualizować', 'I need to update my phone tonight.'),
  ('B1', 'technologia', 'artificial intelligence', 'sztuczna inteligencja', 'Artificial intelligence is changing many industries.'),
  ('B1', 'technologia', 'algorithm', 'algorytm', 'The app uses an algorithm to suggest songs.'),
  ('B1', 'technologia', 'server', 'serwer', 'The website was down because the server crashed.'),
  ('B1', 'technologia', 'encryption', 'szyfrowanie', 'Encryption keeps your online payments secure.'),
  ('B1', 'technologia', 'gadget', 'gadżet elektroniczny', 'He loves buying the latest tech gadgets.'),
  ('B1', 'technologia', 'touchscreen', 'ekran dotykowy', 'The new tablet has a very responsive touchscreen.'),
  ('B1', 'technologia', 'notification', 'powiadomienie', 'I turned off notifications to focus on work.'),
  ('B1', 'technologia', 'streaming', 'przesyłanie strumieniowe', 'We watched the concert through a streaming service.'),
  ('B1', 'technologia', 'cybersecurity', 'cyberbezpieczeństwo', 'The company invested heavily in cybersecurity.'),
  ('B1', 'technologia', 'virtual', 'wirtualny', 'The meeting took place in a virtual classroom.');

-- ----------------------------------------------------------------------------
-- środowisko (environment)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'środowisko', 'pollution', 'zanieczyszczenie', 'Air pollution is a serious problem in big cities.'),
  ('B1', 'środowisko', 'recycle', 'poddawać recyklingowi', 'We recycle paper, glass and plastic at home.'),
  ('B1', 'środowisko', 'climate change', 'zmiana klimatu', 'Scientists warn that climate change is accelerating.'),
  ('B1', 'środowisko', 'renewable', 'odnawialny', 'Renewable energy comes from sources like wind and sun.'),
  ('B1', 'środowisko', 'greenhouse gas', 'gaz cieplarniany', 'Cars produce a large amount of greenhouse gas.'),
  ('B1', 'środowisko', 'sustainable', 'zrównoważony (ekologicznie)', 'The company promotes sustainable farming methods.'),
  ('B1', 'środowisko', 'endangered', 'zagrożony (wyginięciem)', 'Tigers are an endangered species.'),
  ('B1', 'środowisko', 'deforestation', 'wylesianie', 'Deforestation destroys the habitats of many animals.'),
  ('B1', 'środowisko', 'drought', 'susza', 'The region suffered a severe drought last summer.'),
  ('B1', 'środowisko', 'emission', 'emisja (spalin, gazów)', 'The new law will reduce carbon emissions.'),
  ('B1', 'środowisko', 'ecosystem', 'ekosystem', 'Coral reefs support a rich ecosystem.'),
  ('B1', 'środowisko', 'conservation', 'ochrona przyrody', 'The organisation works on wildlife conservation.'),
  ('B1', 'środowisko', 'fossil fuel', 'paliwo kopalne', 'We still depend heavily on fossil fuels.'),
  ('B1', 'środowisko', 'wildlife', 'dzika przyroda', 'The national park protects local wildlife.'),
  ('B1', 'środowisko', 'contaminate', 'zanieczyszczać (skazić)', 'Chemicals from the factory contaminated the river.'),
  ('B1', 'środowisko', 'biodegradable', 'biodegradowalny', 'These bags are biodegradable and break down quickly.'),
  ('B1', 'środowisko', 'carbon footprint', 'ślad węglowy', 'Flying often increases your carbon footprint.'),
  ('B1', 'środowisko', 'landfill', 'wysypisko śmieci', 'Too much waste still ends up in landfills.'),
  ('B1', 'środowisko', 'global warming', 'globalne ocieplenie', 'Global warming is causing ice caps to melt.'),
  ('B1', 'środowisko', 'habitat', 'siedlisko', 'The construction destroyed the birds'' natural habitat.'),
  ('B1', 'środowisko', 'preserve', 'chronić / zachowywać', 'We must preserve these forests for future generations.');

-- ----------------------------------------------------------------------------
-- relacje (relationships)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'relacje', 'relationship', 'związek / relacja', 'They have a strong relationship built on trust.'),
  ('B1', 'relacje', 'trust', 'zaufanie / ufać', 'It takes time to build trust between colleagues.'),
  ('B1', 'relacje', 'acquaintance', 'znajomy (nie bliski)', 'He is more of an acquaintance than a friend.'),
  ('B1', 'relacje', 'engaged', 'zaręczony', 'My sister got engaged last month.'),
  ('B1', 'relacje', 'commitment', 'zaangażowanie / zobowiązanie', 'A good marriage requires real commitment.'),
  ('B1', 'relacje', 'argument', 'kłótnia / sprzeczka', 'They had an argument about money.'),
  ('B1', 'relacje', 'apologize', 'przepraszać', 'He apologized for being late.'),
  ('B1', 'relacje', 'forgive', 'wybaczać', 'It took her a while to forgive him.'),
  ('B1', 'relacje', 'support', 'wspierać / wsparcie', 'Her family supported her through the difficult time.'),
  ('B1', 'relacje', 'loyal', 'lojalny', 'A good friend is loyal even in hard times.'),
  ('B1', 'relacje', 'get along', 'dogadywać się (z kimś)', 'My brother and I get along really well.'),
  ('B1', 'relacje', 'reliable', 'godny zaufania / niezawodny', 'She is a reliable friend who always helps.'),
  ('B1', 'relacje', 'conflict', 'konflikt', 'The conflict between them lasted for years.'),
  ('B1', 'relacje', 'bond', 'więź', 'The two sisters share a very close bond.'),
  ('B1', 'relacje', 'jealousy', 'zazdrość', 'Jealousy can damage even the strongest relationship.'),
  ('B1', 'relacje', 'reconcile', 'pogodzić się', 'The two friends finally reconciled after months apart.'),
  ('B1', 'relacje', 'companionship', 'towarzystwo (bliskość)', 'Older people often value companionship above everything else.'),
  ('B1', 'relacje', 'betray', 'zdradzić (kogoś)', 'He felt betrayed when his friend told his secret.'),
  ('B1', 'relacje', 'intimate', 'bliski / intymny', 'They shared an intimate friendship since childhood.'),
  ('B1', 'relacje', 'divorce', 'rozwód / rozwodzić się', 'Her parents got divorced when she was ten.'),
  ('B1', 'relacje', 'sibling', 'rodzeństwo (brat lub siostra)', 'I have two siblings, a brother and a sister.');

-- ----------------------------------------------------------------------------
-- podstawowe phrasal verbs (basic phrasal verbs)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'podstawowe phrasal verbs', 'give up', 'poddawać się / rzucać (np. palenie)', 'He decided to give up smoking last year.'),
  ('B1', 'podstawowe phrasal verbs', 'look after', 'opiekować się', 'She looks after her grandmother every weekend.'),
  ('B1', 'podstawowe phrasal verbs', 'find out', 'dowiedzieć się', 'I found out about the party from a friend.'),
  ('B1', 'podstawowe phrasal verbs', 'put off', 'odkładać (na później)', 'Don''t put off your homework until Sunday night.'),
  ('B1', 'podstawowe phrasal verbs', 'carry on', 'kontynuować', 'Please carry on with your work, I''ll wait.'),
  ('B1', 'podstawowe phrasal verbs', 'turn down', 'odrzucać (propozycję)', 'She turned down the job offer.'),
  ('B1', 'podstawowe phrasal verbs', 'set up', 'zakładać (firmę) / ustawiać', 'They set up a small business together.'),
  ('B1', 'podstawowe phrasal verbs', 'break down', 'zepsuć się (o maszynie) / załamać się', 'Our car broke down on the motorway.'),
  ('B1', 'podstawowe phrasal verbs', 'come up with', 'wpaść na (pomysł)', 'She came up with a great idea for the project.'),
  ('B1', 'podstawowe phrasal verbs', 'get over', 'dojść do siebie (po czymś)', 'It took him months to get over the illness.'),
  ('B1', 'podstawowe phrasal verbs', 'run out of', 'skończyć się (o zapasach)', 'We ran out of milk this morning.'),
  ('B1', 'podstawowe phrasal verbs', 'take off', 'startować (samolot) / zdejmować', 'The plane took off on time.'),
  ('B1', 'podstawowe phrasal verbs', 'point out', 'zwracać uwagę / wskazywać', 'The teacher pointed out a mistake in my essay.'),
  ('B1', 'podstawowe phrasal verbs', 'work out', 'ćwiczyć / wypracować (rozwiązanie)', 'She works out at the gym three times a week.'),
  ('B1', 'podstawowe phrasal verbs', 'go on', 'dziać się / kontynuować', 'What is going on in the office today?'),
  ('B1', 'podstawowe phrasal verbs', 'bring up', 'wychowywać / poruszać (temat)', 'They brought up the issue at the meeting.'),
  ('B1', 'podstawowe phrasal verbs', 'deal with', 'radzić sobie z / zajmować się', 'She knows how to deal with difficult customers.'),
  ('B1', 'podstawowe phrasal verbs', 'end up', 'skończyć (w jakiejś sytuacji)', 'We ended up staying at home all evening.'),
  ('B1', 'podstawowe phrasal verbs', 'look forward to', 'nie móc się doczekać', 'I''m looking forward to the summer holidays.'),
  ('B1', 'podstawowe phrasal verbs', 'stand for', 'oznaczać (skrót) / popierać', 'What does the abbreviation EU stand for?'),
  ('B1', 'podstawowe phrasal verbs', 'call off', 'odwoływać', 'They called off the meeting because of the storm.');

-- ----------------------------------------------------------------------------
-- media (media)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'media', 'headline', 'nagłówek', 'The headline announced the election results.'),
  ('B1', 'media', 'broadcast', 'nadawać (program) / audycja', 'The match will be broadcast live tonight.'),
  ('B1', 'media', 'journalist', 'dziennikarz / dziennikarka', 'The journalist interviewed the mayor about the project.'),
  ('B1', 'media', 'article', 'artykuł', 'I read an interesting article about space travel.'),
  ('B1', 'media', 'advertisement', 'reklama', 'This advertisement is aimed at young people.'),
  ('B1', 'media', 'audience', 'publiczność / widownia', 'The show attracted a huge audience.'),
  ('B1', 'media', 'coverage', 'relacja medialna (pokrycie tematu)', 'The news gave a lot of coverage to the storm.'),
  ('B1', 'media', 'censorship', 'cenzura', 'The film was banned due to strict censorship.'),
  ('B1', 'media', 'subscribe', 'subskrybować', 'I subscribed to a channel about cooking.'),
  ('B1', 'media', 'influencer', 'influencer', 'The influencer promoted the brand on social media.'),
  ('B1', 'media', 'editor', 'redaktor', 'The editor decided to cut the last paragraph.'),
  ('B1', 'media', 'reliable source', 'wiarygodne źródło', 'Always check if the news comes from a reliable source.'),
  ('B1', 'media', 'fake news', 'fałszywe wiadomości', 'Fake news spreads very quickly on social media.'),
  ('B1', 'media', 'press conference', 'konferencja prasowa', 'The minister held a press conference this morning.'),
  ('B1', 'media', 'ratings', 'oglądalność / wyniki oglądalności', 'The show''s ratings dropped after the second season.'),
  ('B1', 'media', 'commercial', 'reklama telewizyjna', 'We watched a funny commercial during the break.'),
  ('B1', 'media', 'columnist', 'felietonista', 'The columnist writes about politics every week.'),
  ('B1', 'media', 'viral', 'wiralowy (szybko rozpowszechniany)', 'The video went viral within a few hours.'),
  ('B1', 'media', 'bias', 'stronniczość', 'Readers accused the newspaper of bias.'),
  ('B1', 'media', 'documentary', 'film dokumentalny', 'We watched a documentary about ocean life.');

-- ----------------------------------------------------------------------------
-- kultura (culture)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('B1', 'kultura', 'tradition', 'tradycja', 'It is a tradition to eat carp on Christmas Eve.'),
  ('B1', 'kultura', 'heritage', 'dziedzictwo', 'The castle is part of the country''s cultural heritage.'),
  ('B1', 'kultura', 'custom', 'zwyczaj', 'It is a local custom to remove your shoes indoors.'),
  ('B1', 'kultura', 'exhibition', 'wystawa', 'We visited an exhibition of modern art.'),
  ('B1', 'kultura', 'sculpture', 'rzeźba', 'The park is full of interesting sculptures.'),
  ('B1', 'kultura', 'masterpiece', 'arcydzieło', 'This painting is considered his masterpiece.'),
  ('B1', 'kultura', 'folklore', 'folklor', 'The festival celebrates local folklore and dance.'),
  ('B1', 'kultura', 'landmark', 'zabytek / punkt orientacyjny', 'The tower is a famous landmark in the city.'),
  ('B1', 'kultura', 'ritual', 'rytuał', 'Drinking tea together is a daily ritual in their family.'),
  ('B1', 'kultura', 'diverse', 'różnorodny', 'The city has a diverse and multicultural population.'),
  ('B1', 'kultura', 'ancestor', 'przodek', 'Her ancestors came from a small village in the mountains.'),
  ('B1', 'kultura', 'ceremony', 'ceremonia / uroczystość', 'The wedding ceremony took place in an old church.'),
  ('B1', 'kultura', 'costume', 'strój (np. ludowy, kostium)', 'The dancers wore traditional costumes.'),
  ('B1', 'kultura', 'monument', 'pomnik', 'A monument was built to honour the soldiers.'),
  ('B1', 'kultura', 'craft', 'rzemiosło', 'Pottery is a traditional craft in this region.'),
  ('B1', 'kultura', 'generation', 'pokolenie', 'This recipe has been passed down through generations.'),
  ('B1', 'kultura', 'identity', 'tożsamość', 'Language plays a big role in national identity.'),
  ('B1', 'kultura', 'multicultural', 'wielokulturowy', 'London is a very multicultural city.'),
  ('B1', 'kultura', 'legend', 'legenda', 'According to legend, a dragon once lived in this cave.'),
  ('B1', 'kultura', 'festival', 'festiwal', 'The music festival takes place every summer.');
