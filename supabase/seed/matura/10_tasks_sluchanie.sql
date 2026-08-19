-- ============================================================================
-- supabase/seed/matura/10_tasks_sluchanie.sql
-- Curated listening task bank (matura_tasks, source='curated') for
-- "Rozumienie ze słuchu": 2 tasks per poziom, each embedding a REAL,
-- publicly available BBC Learning English "6 Minute English" video
-- (content.youtubeVideoId — rendered via components/listening/youtube-player.tsx,
-- the same component Linguo's listening module uses). Every comprehension
-- item below was authored AFTER fetching and reading the video's actual
-- transcript (via the same youtube-transcript-plus library
-- lib/listening/fetch-transcript.ts uses) — not guessed — so every question
-- and correct answer is grounded in real audio content.
--
-- Idempotent: deletes existing curated tasks for these sections first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_tasks
where source = 'curated'
  and section_id in (select id from matura_sections where language = 'en' and slug = 'sluchanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 1: "Are you addicted to your smartphone?"
-- (BBC Learning English, 6 Minute English)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  $c$
  {
    "instructions": "Obejrzyj/wysłuchaj nagrania (możesz odtworzyć je maksymalnie dwa razy, tak jak na egzaminie). Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D).",
    "youtubeVideoId": "KkrhHUeMjIU",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "According to the recent survey mentioned in the recording, what proportion of teenagers in the USA feel addicted to their phones?", "options": ["A. A quarter", "B. A third", "C. Half", "D. Three quarters"], "correctAnswers": ["C. Half"], "explanation": "Rob mówi: 'half of teenagers in the USA feel like they are addicted to their mobile phones'." },
      { "id": "2", "type": "multiple_choice", "prompt": "What does Catherine say would happen if she went without her phone for more than a minute?", "options": ["A. She would fall asleep.", "B. She would get sweaty palms and feel panicky.", "C. She would call her friends instead.", "D. She would feel relieved."], "correctAnswers": ["B. She would get sweaty palms and feel panicky."], "explanation": "Catherine mówi wprost o spoconych dłoniach i panice." },
      { "id": "3", "type": "multiple_choice", "prompt": "According to Jean Twenge, what is one danger of compulsively checking your phone?", "options": ["A. You spend too much money.", "B. You lose track of time without noticing.", "C. You forget how to use other technology.", "D. You damage your eyesight."], "correctAnswers": ["B. You lose track of time without noticing."], "explanation": "Jean Twenge mówi o 'looking up and realising that an hour has passed'." },
      { "id": "4", "type": "multiple_choice", "prompt": "In what year did the word 'smartphone' first appear in print, according to the quiz answer?", "options": ["A. 1995", "B. 2000", "C. 2005", "D. 2010"], "correctAnswers": ["A. 1995"], "explanation": "Rob podaje poprawną odpowiedź na koniec nagrania: 1995." },
      { "id": "5", "type": "multiple_choice", "prompt": "What does Jean Twenge suggest phones and social media should mainly be used for?", "options": ["A. Watching videos for entertainment.", "B. Keeping in touch with people and then seeing them in person.", "C. Reading the news constantly.", "D. Playing games."], "correctAnswers": ["B. Keeping in touch with people and then seeing them in person."], "explanation": "Mówi o użyciu telefonu 'to keep in touch with people... then put it away and go see some of those people in person'." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "BBC Learning English — 6 Minute English: Are you addicted to your smartphone?"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 2: "Why you need a good night's sleep"
-- (BBC Learning English, 6 Minute English)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  $c$
  {
    "instructions": "Obejrzyj/wysłuchaj nagrania (możesz odtworzyć je maksymalnie dwa razy, tak jak na egzaminie). Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D).",
    "youtubeVideoId": "j2PdEQpu5js",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "According to the recording, how much longer do people who get enough sleep live, compared to those who don't?", "options": ["A. About one year", "B. About five years", "C. About ten years", "D. About twenty years"], "correctAnswers": ["B. About five years"], "explanation": "Georgie mówi: 'people who get enough sleep live about five years longer'." },
      { "id": "2", "type": "multiple_choice", "prompt": "How much of the average person's life is spent asleep, according to the quiz answer?", "options": ["A. A half", "B. A quarter", "C. A third", "D. A fifth"], "correctAnswers": ["C. A third"], "explanation": "Podana poprawna odpowiedź: 'around one third of their life'." },
      { "id": "3", "type": "multiple_choice", "prompt": "Why do we need to sleep after learning new things, according to Ginny Smith?", "options": ["A. To forget unnecessary information.", "B. So the brain can consolidate information into long-term storage.", "C. To give the eyes a rest.", "D. To prepare for the next day's lessons."], "correctAnswers": ["B. So the brain can consolidate information into long-term storage."], "explanation": "Ginny Smith mówi, że mózg 'consolidates the information - takes it from short-term storage to long-term storage'." },
      { "id": "4", "type": "multiple_choice", "prompt": "What does the expression 'sleep on it' mean, according to the recording?", "options": ["A. To sleep on a hard surface.", "B. To delay a decision until you've had time to think about it.", "C. To fall asleep instantly.", "D. To dream about a problem."], "correctAnswers": ["B. To delay a decision until you've had time to think about it."], "explanation": "Nagranie wprost definiuje to wyrażenie w ten sposób." },
      { "id": "5", "type": "multiple_choice", "prompt": "What long-term health problems can chronic sleep deprivation lead to, according to Ginny Smith?", "options": ["A. Better concentration and memory.", "B. Heart disease and a weakened immune system.", "C. Improved fight-or-flight response.", "D. Increased height."], "correctAnswers": ["B. Heart disease and a weakened immune system."], "explanation": "Nagranie wprost wymienia te dwa skutki przewlekłego niedoboru snu." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "BBC Learning English — 6 Minute English: Why you need a good night''s sleep"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 1: "How can I help the environment?"
-- (BBC Learning English, 6 Minute English)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'sluchanie'),
  $c$
  {
    "instructions": "Obejrzyj/wysłuchaj nagrania (możesz odtworzyć je maksymalnie dwa razy, tak jak na egzaminie). Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D).",
    "youtubeVideoId": "uhfVT5iAtMM",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "What point does Neil make about toothbrushes at the start of the programme?", "options": ["A. They are too expensive to replace often.", "B. They last for hundreds of years in the environment even though we use them briefly.", "C. Most people don't clean their teeth properly.", "D. New biodegradable toothbrushes are now available."], "correctAnswers": ["B. They last for hundreds of years in the environment even though we use them briefly."], "explanation": "Neil mówi: 'We use them for a couple of months yet they will last for hundreds of years'." },
      { "id": "2", "type": "multiple_choice", "prompt": "In which country was the first artificial plastic developed, according to the quiz answer?", "options": ["A. Switzerland", "B. Germany", "C. England", "D. the United States"], "correctAnswers": ["C. England"], "explanation": "Poprawna odpowiedź podana w nagraniu: Anglia, Alexander Parkes, 1856." },
      { "id": "3", "type": "multiple_choice", "prompt": "What is Madeleine Murray's 'pet peeve', according to the recording?", "options": ["A. People who don't recycle.", "B. Multipacks and minipacks of products.", "C. Plastic toothbrushes.", "D. People who waste food."], "correctAnswers": ["B. Multipacks and minipacks of products."], "explanation": "Madeleine Murray mówi wprost: 'My personal, like, pet peeve is multipacks and minipacks'." },
      { "id": "4", "type": "multiple_choice", "prompt": "What does the word 'decant' mean, as explained in the recording?", "options": ["A. To throw something away.", "B. To transfer something into smaller reusable containers.", "C. To buy something in bulk.", "D. To recycle plastic packaging."], "correctAnswers": ["B. To transfer something into smaller reusable containers."], "explanation": "Nagranie wprost definiuje to słowo w ten sposób." },
      { "id": "5", "type": "multiple_choice", "prompt": "What does Dr Tara Shine suggest people do with baby items their children have outgrown?", "options": ["A. Throw them away immediately.", "B. Sell them for the highest possible price.", "C. Pass them on to other people (hand-me-downs).", "D. Keep them in storage indefinitely."], "correctAnswers": ["C. Pass them on to other people (hand-me-downs)."], "explanation": "Dr Tara Shine mówi o kulturze 'pass-thing-on' i 'hand-me-down'." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "BBC Learning English — 6 Minute English: How can I help the environment?"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 2: "Is social media dead?"
-- (BBC Learning English, 6 Minute English)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'sluchanie'),
  $c$
  {
    "instructions": "Obejrzyj/wysłuchaj nagrania (możesz odtworzyć je maksymalnie dwa razy, tak jak na egzaminie). Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D).",
    "youtubeVideoId": "iMcP-ZydB6s",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "What was the first electronic message, sent in 1844, called?", "options": ["A. Morse code", "B. Semaphore", "C. Dial-up", "D. Telegraph English"], "correctAnswers": ["A. Morse code"], "explanation": "Poprawna odpowiedź podana w nagraniu: Morse code." },
      { "id": "2", "type": "multiple_choice", "prompt": "According to a recent report mentioned in the recording, what has happened to social media activity since 2022?", "options": ["A. It has continued to grow steadily.", "B. It has stayed exactly the same.", "C. It has been going down.", "D. It doubled."], "correctAnswers": ["C. It has been going down."], "explanation": "Nagranie mówi: 'social media activity peaked in 2022 and has been going down ever since'." },
      { "id": "3", "type": "multiple_choice", "prompt": "What does Kyle Chayka say 'shattered the illusion' that the internet was a fun space?", "options": ["A. The introduction of AI-generated photos.", "B. Twitter becoming the hub of angry political debate during the US election.", "C. The rise of Instagram.", "D. The closure of MySpace."], "correctAnswers": ["B. Twitter becoming the hub of angry political debate during the US election."], "explanation": "Kyle Chayka opisuje moment, gdy Twitter stał się centrum dyskusji wyborczej w USA w 2015/2016." },
      { "id": "4", "type": "multiple_choice", "prompt": "What does Kyle Chayka predict about the future of social media?", "options": ["A. AI-generated content will completely replace human content.", "B. People will gravitate towards smaller online spaces and post less.", "C. Everyone will stop using social media entirely.", "D. Large tech companies will shut down."], "correctAnswers": ["B. People will gravitate towards smaller online spaces and post less."], "explanation": "Kyle Chayka mówi: 'people gravitating towards smaller online spaces... and just posting less in general'." },
      { "id": "5", "type": "multiple_choice", "prompt": "What does a 'cultural happening' mean, according to the recording's example?", "options": ["A. A historical event from the distant past.", "B. An event that embodies the values and interests of a group at a particular time, like Game of Thrones for millennials.", "C. A type of AI-generated content.", "D. A technical malfunction in social media apps."], "correctAnswers": ["B. An event that embodies the values and interests of a group at a particular time, like Game of Thrones for millennials."], "explanation": "Nagranie wprost definiuje to wyrażenie i podaje ten przykład." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "BBC Learning English — 6 Minute English: Is social media dead?"}'::jsonb
);
