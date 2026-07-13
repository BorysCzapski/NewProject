-- ============================================================================
-- 01_vocabulary_a1.sql
-- Seed data: CEFR level A1 vocabulary words for the English-learning app.
-- Covers 10 thematic categories (rodzina, kolory, liczby, jedzenie, dom,
-- dni tygodnia, podstawowe czasowniki, ubrania, zwierzęta, czas/godziny),
-- ~18 words each. Safe to re-run: existing A1 rows are deleted first.
-- ============================================================================

delete from vocabulary_words where language = 'en' and level = 'A1';

-- ----------------------------------------------------------------------------
-- rodzina (family)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'rodzina', 'mother', 'matka', 'My mother is a teacher.'),
  ('A1', 'rodzina', 'father', 'ojciec', 'My father works in a bank.'),
  ('A1', 'rodzina', 'parent', 'rodzic', 'Every parent loves their child.'),
  ('A1', 'rodzina', 'brother', 'brat', 'I have one brother.'),
  ('A1', 'rodzina', 'sister', 'siostra', 'My sister is younger than me.'),
  ('A1', 'rodzina', 'son', 'syn', 'Their son is five years old.'),
  ('A1', 'rodzina', 'daughter', 'córka', 'Her daughter goes to school.'),
  ('A1', 'rodzina', 'grandmother', 'babcia', 'My grandmother makes great soup.'),
  ('A1', 'rodzina', 'grandfather', 'dziadek', 'My grandfather likes to read newspapers.'),
  ('A1', 'rodzina', 'aunt', 'ciocia', 'My aunt lives in London.'),
  ('A1', 'rodzina', 'uncle', 'wujek', 'My uncle has a big car.'),
  ('A1', 'rodzina', 'cousin', 'kuzyn / kuzynka', 'My cousin is visiting us this weekend.'),
  ('A1', 'rodzina', 'wife', 'żona', 'His wife is a doctor.'),
  ('A1', 'rodzina', 'husband', 'mąż', 'Her husband cooks dinner every day.'),
  ('A1', 'rodzina', 'baby', 'niemowlę / dziecko', 'The baby is sleeping now.'),
  ('A1', 'rodzina', 'child', 'dziecko', 'The child is playing in the garden.'),
  ('A1', 'rodzina', 'family', 'rodzina', 'I love spending time with my family.'),
  ('A1', 'rodzina', 'grandparents', 'dziadkowie', 'My grandparents live in a small village.');

-- ----------------------------------------------------------------------------
-- kolory (colours)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'kolory', 'red', 'czerwony', 'The apple is red.'),
  ('A1', 'kolory', 'orange', 'pomarańczowy', 'She is wearing an orange dress.'),
  ('A1', 'kolory', 'yellow', 'żółty', 'The sun is yellow.'),
  ('A1', 'kolory', 'green', 'zielony', 'The grass is green.'),
  ('A1', 'kolory', 'blue', 'niebieski', 'The sky is blue today.'),
  ('A1', 'kolory', 'purple', 'fioletowy', 'I like her purple bag.'),
  ('A1', 'kolory', 'pink', 'różowy', 'The flowers are pink.'),
  ('A1', 'kolory', 'brown', 'brązowy', 'He has brown eyes.'),
  ('A1', 'kolory', 'black', 'czarny', 'My cat is black.'),
  ('A1', 'kolory', 'white', 'biały', 'The walls are white.'),
  ('A1', 'kolory', 'gray', 'szary', 'The gray car is new.'),
  ('A1', 'kolory', 'gold', 'złoty', 'She has a gold ring.'),
  ('A1', 'kolory', 'silver', 'srebrny', 'He wears a silver watch.'),
  ('A1', 'kolory', 'color', 'kolor', 'What color is your bike?'),
  ('A1', 'kolory', 'dark', 'ciemny (kolor)', 'I like dark blue jackets.'),
  ('A1', 'kolory', 'light', 'jasny (kolor)', 'She has light brown hair.'),
  ('A1', 'kolory', 'navy', 'granatowy', 'He wore a navy jacket to work.'),
  ('A1', 'kolory', 'beige', 'beżowy', 'The new sofa is beige.');

-- ----------------------------------------------------------------------------
-- liczby (numbers)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'liczby', 'zero', 'zero', 'The temperature is zero today.'),
  ('A1', 'liczby', 'one', 'jeden', 'I have one brother.'),
  ('A1', 'liczby', 'two', 'dwa', 'She has two cats.'),
  ('A1', 'liczby', 'three', 'trzy', 'There are three books on the table.'),
  ('A1', 'liczby', 'four', 'cztery', 'We need four chairs.'),
  ('A1', 'liczby', 'five', 'pięć', 'It''s five o''clock.'),
  ('A1', 'liczby', 'six', 'sześć', 'The shop opens at six.'),
  ('A1', 'liczby', 'seven', 'siedem', 'There are seven days in a week.'),
  ('A1', 'liczby', 'eight', 'osiem', 'I go to bed at eight.'),
  ('A1', 'liczby', 'nine', 'dziewięć', 'The train leaves at nine.'),
  ('A1', 'liczby', 'ten', 'dziesięć', 'Count to ten, please.'),
  ('A1', 'liczby', 'eleven', 'jedenaście', 'The film starts at eleven.'),
  ('A1', 'liczby', 'twelve', 'dwanaście', 'There are twelve months in a year.'),
  ('A1', 'liczby', 'twenty', 'dwadzieścia', 'My sister is twenty years old.'),
  ('A1', 'liczby', 'thirty', 'trzydzieści', 'The bus comes every thirty minutes.'),
  ('A1', 'liczby', 'hundred', 'sto', 'The book has one hundred pages.'),
  ('A1', 'liczby', 'thousand', 'tysiąc', 'The ticket costs one thousand zlotys.'),
  ('A1', 'liczby', 'first', 'pierwszy', 'January is the first month of the year.');

-- ----------------------------------------------------------------------------
-- jedzenie (food)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'jedzenie', 'bread', 'chleb', 'I eat bread every morning.'),
  ('A1', 'jedzenie', 'milk', 'mleko', 'I drink milk with my breakfast.'),
  ('A1', 'jedzenie', 'water', 'woda', 'Can I have a glass of water?'),
  ('A1', 'jedzenie', 'egg', 'jajko', 'She is cooking an egg for breakfast.'),
  ('A1', 'jedzenie', 'apple', 'jabłko', 'He eats an apple every day.'),
  ('A1', 'jedzenie', 'banana', 'banan', 'The monkey wants a banana.'),
  ('A1', 'jedzenie', 'cheese', 'ser', 'I like cheese on my sandwich.'),
  ('A1', 'jedzenie', 'meat', 'mięso', 'We don''t eat meat on Fridays.'),
  ('A1', 'jedzenie', 'juice', 'sok', 'She drinks orange juice every morning.'),
  ('A1', 'jedzenie', 'sandwich', 'kanapka', 'I made a sandwich for lunch.'),
  ('A1', 'jedzenie', 'rice', 'ryż', 'We eat rice with chicken.'),
  ('A1', 'jedzenie', 'soup', 'zupa', 'My grandmother makes delicious soup.'),
  ('A1', 'jedzenie', 'sugar', 'cukier', 'Do you take sugar in your tea?'),
  ('A1', 'jedzenie', 'salt', 'sól', 'Please pass the salt.'),
  ('A1', 'jedzenie', 'tea', 'herbata', 'Would you like a cup of tea?'),
  ('A1', 'jedzenie', 'coffee', 'kawa', 'He drinks coffee every morning.'),
  ('A1', 'jedzenie', 'potato', 'ziemniak', 'We are cooking potato soup.'),
  ('A1', 'jedzenie', 'tomato', 'pomidor', 'The salad has tomato and cheese.');

-- ----------------------------------------------------------------------------
-- dom (house)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'dom', 'house', 'dom', 'They live in a big house.'),
  ('A1', 'dom', 'room', 'pokój', 'My room is very small.'),
  ('A1', 'dom', 'kitchen', 'kuchnia', 'My mother is cooking in the kitchen.'),
  ('A1', 'dom', 'bedroom', 'sypialnia', 'My bedroom is upstairs.'),
  ('A1', 'dom', 'bathroom', 'łazienka', 'The bathroom is next to the kitchen.'),
  ('A1', 'dom', 'window', 'okno', 'Please open the window.'),
  ('A1', 'dom', 'door', 'drzwi', 'Close the door, please.'),
  ('A1', 'dom', 'table', 'stół', 'The plates are on the table.'),
  ('A1', 'dom', 'chair', 'krzesło', 'Please sit on this chair.'),
  ('A1', 'dom', 'bed', 'łóżko', 'The cat is sleeping on the bed.'),
  ('A1', 'dom', 'sofa', 'sofa / kanapa', 'We watch TV on the sofa.'),
  ('A1', 'dom', 'lamp', 'lampa', 'Turn on the lamp, please.'),
  ('A1', 'dom', 'wall', 'ściana', 'There is a picture on the wall.'),
  ('A1', 'dom', 'floor', 'podłoga', 'The toy is on the floor.'),
  ('A1', 'dom', 'roof', 'dach', 'The house has a red roof.'),
  ('A1', 'dom', 'garden', 'ogród', 'The children are playing in the garden.'),
  ('A1', 'dom', 'key', 'klucz', 'I can''t find my key.'),
  ('A1', 'dom', 'mirror', 'lustro', 'She looks in the mirror every morning.');

-- ----------------------------------------------------------------------------
-- dni tygodnia (days of the week)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'dni tygodnia', 'Monday', 'poniedziałek', 'I go to work on Monday.'),
  ('A1', 'dni tygodnia', 'Tuesday', 'wtorek', 'We have English class on Tuesday.'),
  ('A1', 'dni tygodnia', 'Wednesday', 'środa', 'Today is Wednesday.'),
  ('A1', 'dni tygodnia', 'Thursday', 'czwartek', 'The meeting is on Thursday.'),
  ('A1', 'dni tygodnia', 'Friday', 'piątek', 'I love Friday because the weekend starts.'),
  ('A1', 'dni tygodnia', 'Saturday', 'sobota', 'We go shopping on Saturday.'),
  ('A1', 'dni tygodnia', 'Sunday', 'niedziela', 'On Sunday, we visit our grandparents.'),
  ('A1', 'dni tygodnia', 'day', 'dzień', 'It is a beautiful day today.'),
  ('A1', 'dni tygodnia', 'week', 'tydzień', 'I have three lessons this week.'),
  ('A1', 'dni tygodnia', 'weekend', 'weekend', 'What are your plans for the weekend?'),
  ('A1', 'dni tygodnia', 'today', 'dzisiaj', 'Today is my birthday.'),
  ('A1', 'dni tygodnia', 'tomorrow', 'jutro', 'We are going to the cinema tomorrow.'),
  ('A1', 'dni tygodnia', 'yesterday', 'wczoraj', 'It rained yesterday.'),
  ('A1', 'dni tygodnia', 'month', 'miesiąc', 'My birthday is next month.'),
  ('A1', 'dni tygodnia', 'year', 'rok', 'This year I want to learn English.'),
  ('A1', 'dni tygodnia', 'date', 'data', 'What is today''s date?'),
  ('A1', 'dni tygodnia', 'calendar', 'kalendarz', 'There is a calendar on the wall.'),
  ('A1', 'dni tygodnia', 'holiday', 'święto / wakacje', 'Christmas is my favorite holiday.');

-- ----------------------------------------------------------------------------
-- podstawowe czasowniki (basic verbs)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'podstawowe czasowniki', 'be', 'być', 'I want to be a doctor.'),
  ('A1', 'podstawowe czasowniki', 'have', 'mieć', 'I have two brothers.'),
  ('A1', 'podstawowe czasowniki', 'go', 'iść / jechać', 'We go to school by bus.'),
  ('A1', 'podstawowe czasowniki', 'do', 'robić / czasownik posiłkowy', 'What do you do on Sundays?'),
  ('A1', 'podstawowe czasowniki', 'make', 'robić / tworzyć', 'They make dinner together every evening.'),
  ('A1', 'podstawowe czasowniki', 'say', 'mówić / powiedzieć', 'Can you say that again, please?'),
  ('A1', 'podstawowe czasowniki', 'get', 'dostawać / stawać się', 'Can I get a glass of water, please?'),
  ('A1', 'podstawowe czasowniki', 'know', 'wiedzieć / znać', 'I know your sister.'),
  ('A1', 'podstawowe czasowniki', 'think', 'myśleć', 'I think this book is interesting.'),
  ('A1', 'podstawowe czasowniki', 'see', 'widzieć', 'I can see the mountains from my window.'),
  ('A1', 'podstawowe czasowniki', 'want', 'chcieć', 'Do you want some coffee?'),
  ('A1', 'podstawowe czasowniki', 'like', 'lubić', 'I like playing football.'),
  ('A1', 'podstawowe czasowniki', 'come', 'przychodzić / przyjść', 'Please come to my party.'),
  ('A1', 'podstawowe czasowniki', 'take', 'brać / wziąć', 'Take an umbrella, it''s raining.'),
  ('A1', 'podstawowe czasowniki', 'give', 'dawać / dać', 'Can you give me your phone number?'),
  ('A1', 'podstawowe czasowniki', 'eat', 'jeść', 'We eat dinner at seven.'),
  ('A1', 'podstawowe czasowniki', 'drink', 'pić', 'I drink water every day.'),
  ('A1', 'podstawowe czasowniki', 'sleep', 'spać', 'I sleep eight hours every night.');

-- ----------------------------------------------------------------------------
-- ubrania (clothes)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'ubrania', 'shirt', 'koszula', 'He is wearing a white shirt.'),
  ('A1', 'ubrania', 'pants', 'spodnie', 'These pants are too long.'),
  ('A1', 'ubrania', 'dress', 'sukienka', 'She bought a new dress.'),
  ('A1', 'ubrania', 'skirt', 'spódnica', 'The skirt is blue and short.'),
  ('A1', 'ubrania', 'jacket', 'kurtka', 'Put on your jacket, it''s cold.'),
  ('A1', 'ubrania', 'coat', 'płaszcz', 'She wore a warm coat in winter.'),
  ('A1', 'ubrania', 'shoes', 'buty', 'My shoes are dirty.'),
  ('A1', 'ubrania', 'socks', 'skarpetki', 'I need clean socks.'),
  ('A1', 'ubrania', 'hat', 'czapka / kapelusz', 'He is wearing a hat in the sun.'),
  ('A1', 'ubrania', 'scarf', 'szalik', 'She wrapped a scarf around her neck.'),
  ('A1', 'ubrania', 'gloves', 'rękawiczki', 'Wear your gloves, it''s cold outside.'),
  ('A1', 'ubrania', 'jeans', 'dżinsy', 'He always wears blue jeans.'),
  ('A1', 'ubrania', 'sweater', 'sweter', 'I put on a warm sweater.'),
  ('A1', 'ubrania', 't-shirt', 'koszulka (t-shirt)', 'He is wearing a red t-shirt.'),
  ('A1', 'ubrania', 'belt', 'pasek', 'This belt matches your shoes.'),
  ('A1', 'ubrania', 'tie', 'krawat', 'My father wears a tie to work.'),
  ('A1', 'ubrania', 'boots', 'kozaki / botki', 'She wears boots in winter.'),
  ('A1', 'ubrania', 'pajamas', 'piżama', 'The children are wearing their pajamas.');

-- ----------------------------------------------------------------------------
-- zwierzęta (animals)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'zwierzęta', 'dog', 'pies', 'My dog likes to run in the park.'),
  ('A1', 'zwierzęta', 'cat', 'kot', 'The cat is sleeping on the sofa.'),
  ('A1', 'zwierzęta', 'bird', 'ptak', 'A small bird is singing in the tree.'),
  ('A1', 'zwierzęta', 'fish', 'ryba', 'We have three fish in the aquarium.'),
  ('A1', 'zwierzęta', 'horse', 'koń', 'She can ride a horse.'),
  ('A1', 'zwierzęta', 'cow', 'krowa', 'The cow gives us milk.'),
  ('A1', 'zwierzęta', 'pig', 'świnia', 'The pig is in the farmyard.'),
  ('A1', 'zwierzęta', 'sheep', 'owca', 'There are many sheep in the field.'),
  ('A1', 'zwierzęta', 'chicken', 'kura / kurczak', 'The chicken lays eggs every day.'),
  ('A1', 'zwierzęta', 'duck', 'kaczka', 'The duck is swimming in the lake.'),
  ('A1', 'zwierzęta', 'rabbit', 'królik', 'The rabbit eats carrots.'),
  ('A1', 'zwierzęta', 'mouse', 'mysz', 'A small mouse ran across the floor.'),
  ('A1', 'zwierzęta', 'elephant', 'słoń', 'The elephant is a very big animal.'),
  ('A1', 'zwierzęta', 'lion', 'lew', 'The lion is the king of the jungle.'),
  ('A1', 'zwierzęta', 'tiger', 'tygrys', 'The tiger has orange and black fur.'),
  ('A1', 'zwierzęta', 'bear', 'niedźwiedź', 'We saw a bear in the forest.'),
  ('A1', 'zwierzęta', 'monkey', 'małpa', 'The monkey is climbing the tree.'),
  ('A1', 'zwierzęta', 'snake', 'wąż', 'The snake is sleeping under a rock.');

-- ----------------------------------------------------------------------------
-- czas/godziny (time / hours)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A1', 'czas/godziny', 'time', 'czas', 'I don''t have time today.'),
  ('A1', 'czas/godziny', 'hour', 'godzina', 'The lesson lasts one hour.'),
  ('A1', 'czas/godziny', 'minute', 'minuta', 'Wait a minute, please.'),
  ('A1', 'czas/godziny', 'second', 'sekunda', 'It only takes a second.'),
  ('A1', 'czas/godziny', 'clock', 'zegar', 'The clock on the wall is broken.'),
  ('A1', 'czas/godziny', 'watch', 'zegarek', 'He is wearing a new watch.'),
  ('A1', 'czas/godziny', 'morning', 'rano / poranek', 'I drink coffee in the morning.'),
  ('A1', 'czas/godziny', 'afternoon', 'popołudnie', 'We meet in the afternoon.'),
  ('A1', 'czas/godziny', 'evening', 'wieczór', 'I read books in the evening.'),
  ('A1', 'czas/godziny', 'night', 'noc', 'The stars are bright at night.'),
  ('A1', 'czas/godziny', 'noon', 'południe', 'We have lunch at noon.'),
  ('A1', 'czas/godziny', 'midnight', 'północ', 'The party ends at midnight.'),
  ('A1', 'czas/godziny', 'early', 'wcześnie', 'I wake up early every day.'),
  ('A1', 'czas/godziny', 'late', 'późno', 'Don''t be late for school.'),
  ('A1', 'czas/godziny', 'now', 'teraz', 'I am busy now.'),
  ('A1', 'czas/godziny', 'soon', 'wkrótce', 'The bus will arrive soon.'),
  ('A1', 'czas/godziny', 'always', 'zawsze', 'She always drinks tea in the morning.'),
  ('A1', 'czas/godziny', 'never', 'nigdy', 'He never eats meat.');
