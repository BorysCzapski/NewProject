-- ============================================================================
-- 01_vocabulary_a2.sql
-- Seed data: CEFR level A2 vocabulary words for the English-learning app.
-- Covers 8 thematic categories (podróże, praca, zakupy, pogoda, zdrowie,
-- czas wolny, transport, uczucia podstawowe), 24 words each. Safe to
-- re-run: existing A2 rows are deleted first.
-- ============================================================================

delete from vocabulary_words where level = 'A2';

-- ----------------------------------------------------------------------------
-- podróże (travel)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'podróże', 'airport', 'lotnisko', 'We arrived at the airport two hours before the flight.'),
  ('A2', 'podróże', 'passport', 'paszport', 'Don''t forget your passport when you travel abroad.'),
  ('A2', 'podróże', 'ticket', 'bilet', 'I bought a train ticket to Warsaw.'),
  ('A2', 'podróże', 'luggage', 'bagaż', 'Please put your luggage in the car.'),
  ('A2', 'podróże', 'suitcase', 'walizka', 'She packed her suitcase the night before the trip.'),
  ('A2', 'podróże', 'hotel', 'hotel', 'We stayed in a small hotel near the beach.'),
  ('A2', 'podróże', 'reservation', 'rezerwacja', 'I made a reservation for two nights.'),
  ('A2', 'podróże', 'tourist', 'turysta / turystka', 'Many tourists visit this city in summer.'),
  ('A2', 'podróże', 'guide', 'przewodnik (osoba lub książka)', 'Our guide showed us the old town.'),
  ('A2', 'podróże', 'map', 'mapa', 'Can you show me on the map where the museum is?'),
  ('A2', 'podróże', 'journey', 'podróż', 'The journey to the coast took six hours.'),
  ('A2', 'podróże', 'holiday', 'wakacje / urlop', 'We are going on holiday next week.'),
  ('A2', 'podróże', 'abroad', 'za granicą', 'He wants to study abroad next year.'),
  ('A2', 'podróże', 'border', 'granica', 'We crossed the border early in the morning.'),
  ('A2', 'podróże', 'customs', 'odprawa celna / cło', 'We waited in a long line at customs.'),
  ('A2', 'podróże', 'visa', 'wiza', 'You need a visa to visit that country.'),
  ('A2', 'podróże', 'backpack', 'plecak', 'He carried all his things in a backpack.'),
  ('A2', 'podróże', 'souvenir', 'pamiątka', 'I bought a souvenir for my sister.'),
  ('A2', 'podróże', 'postcard', 'pocztówka', 'She sent a postcard from Rome.'),
  ('A2', 'podróże', 'campsite', 'pole namiotowe', 'We found a nice campsite near the lake.'),
  ('A2', 'podróże', 'sightseeing', 'zwiedzanie', 'We spent the whole day sightseeing in Paris.'),
  ('A2', 'podróże', 'departure', 'odlot / odjazd', 'The departure time is written on the ticket.'),
  ('A2', 'podróże', 'arrival', 'przylot / przyjazd', 'Our arrival was delayed by an hour.'),
  ('A2', 'podróże', 'destination', 'cel podróży', 'Rome was our final destination.');

-- ----------------------------------------------------------------------------
-- praca (work)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'praca', 'job', 'praca (posada)', 'She found a new job in a bank.'),
  ('A2', 'praca', 'office', 'biuro', 'I work in an office in the city centre.'),
  ('A2', 'praca', 'salary', 'pensja', 'His salary is higher than mine.'),
  ('A2', 'praca', 'boss', 'szef / szefowa', 'My boss is very kind to everyone.'),
  ('A2', 'praca', 'colleague', 'kolega / koleżanka z pracy', 'I had lunch with a colleague today.'),
  ('A2', 'praca', 'meeting', 'spotkanie (zebranie)', 'We have a meeting at nine o''clock.'),
  ('A2', 'praca', 'interview', 'rozmowa kwalifikacyjna', 'She was nervous before the job interview.'),
  ('A2', 'praca', 'application', 'podanie o pracę', 'He sent his application to five companies.'),
  ('A2', 'praca', 'career', 'kariera', 'Teaching is a good career for her.'),
  ('A2', 'praca', 'employee', 'pracownik', 'Every employee gets two days off a week.'),
  ('A2', 'praca', 'employer', 'pracodawca', 'Her employer offered her a higher salary.'),
  ('A2', 'praca', 'contract', 'umowa', 'I signed a new contract last month.'),
  ('A2', 'praca', 'deadline', 'termin (ostateczny)', 'The deadline for the report is Friday.'),
  ('A2', 'praca', 'schedule', 'harmonogram / grafik', 'My work schedule changes every week.'),
  ('A2', 'praca', 'task', 'zadanie', 'This task will take about an hour.'),
  ('A2', 'praca', 'project', 'projekt', 'We finished the project on time.'),
  ('A2', 'praca', 'break', 'przerwa', 'Let''s take a short break for coffee.'),
  ('A2', 'praca', 'overtime', 'nadgodziny', 'He works overtime almost every week.'),
  ('A2', 'praca', 'promotion', 'awans', 'She got a promotion after one year.'),
  ('A2', 'praca', 'retire', 'przejść na emeryturę', 'My father wants to retire next year.'),
  ('A2', 'praca', 'unemployed', 'bezrobotny', 'He has been unemployed since March.'),
  ('A2', 'praca', 'factory', 'fabryka', 'My uncle works in a car factory.'),
  ('A2', 'praca', 'warehouse', 'magazyn', 'The boxes are stored in a warehouse.'),
  ('A2', 'praca', 'shift', 'zmiana (w pracy)', 'I work the night shift this week.');

-- ----------------------------------------------------------------------------
-- zakupy (shopping)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'zakupy', 'shop', 'sklep', 'There is a small shop on the corner.'),
  ('A2', 'zakupy', 'store', 'sklep (zwł. duży)', 'This store sells clothes for children.'),
  ('A2', 'zakupy', 'mall', 'centrum handlowe', 'We spent the afternoon at the mall.'),
  ('A2', 'zakupy', 'cashier', 'kasjer / kasjerka', 'The cashier gave me my change.'),
  ('A2', 'zakupy', 'receipt', 'paragon', 'Keep the receipt in case you want a refund.'),
  ('A2', 'zakupy', 'discount', 'zniżka / rabat', 'I got a 20% discount on these shoes.'),
  ('A2', 'zakupy', 'price', 'cena', 'The price of milk went up last month.'),
  ('A2', 'zakupy', 'expensive', 'drogi', 'This restaurant is too expensive for us.'),
  ('A2', 'zakupy', 'cheap', 'tani', 'These vegetables are quite cheap in summer.'),
  ('A2', 'zakupy', 'sale', 'wyprzedaż', 'There is a big sale in that shop this week.'),
  ('A2', 'zakupy', 'basket', 'koszyk', 'She put the apples in her basket.'),
  ('A2', 'zakupy', 'trolley', 'wózek sklepowy', 'He pushed the trolley through the supermarket.'),
  ('A2', 'zakupy', 'checkout', 'kasa (miejsce płatności)', 'There was a long line at the checkout.'),
  ('A2', 'zakupy', 'size', 'rozmiar', 'Do you have this jacket in a bigger size?'),
  ('A2', 'zakupy', 'fitting room', 'przymierzalnia', 'She tried on the dress in the fitting room.'),
  ('A2', 'zakupy', 'refund', 'zwrot pieniędzy', 'I asked for a refund because the shirt was too small.'),
  ('A2', 'zakupy', 'exchange', 'wymiana (towaru)', 'Can I exchange this for a different colour?'),
  ('A2', 'zakupy', 'customer', 'klient', 'The shop was full of customers on Saturday.'),
  ('A2', 'zakupy', 'shop assistant', 'sprzedawca / sprzedawczyni', 'The shop assistant helped me find the right size.'),
  ('A2', 'zakupy', 'cash', 'gotówka', 'I only have cash, not a card.'),
  ('A2', 'zakupy', 'card', 'karta (płatnicza)', 'She paid for the groceries with her card.'),
  ('A2', 'zakupy', 'bargain', 'okazja (dobra cena)', 'These shoes were a real bargain.'),
  ('A2', 'zakupy', 'queue', 'kolejka', 'We stood in a queue for twenty minutes.'),
  ('A2', 'zakupy', 'brand', 'marka', 'This is my favourite brand of coffee.');

-- ----------------------------------------------------------------------------
-- pogoda (weather)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'pogoda', 'weather', 'pogoda', 'The weather is nice today.'),
  ('A2', 'pogoda', 'sun', 'słońce', 'The sun is shining brightly this morning.'),
  ('A2', 'pogoda', 'sunny', 'słoneczny', 'It''s sunny and warm outside.'),
  ('A2', 'pogoda', 'rain', 'deszcz', 'We stayed home because of the rain.'),
  ('A2', 'pogoda', 'rainy', 'deszczowy', 'Take an umbrella, it''s a rainy day.'),
  ('A2', 'pogoda', 'cloud', 'chmura', 'There is not a single cloud in the sky.'),
  ('A2', 'pogoda', 'cloudy', 'pochmurny', 'It''s cloudy, so we can''t see the mountains.'),
  ('A2', 'pogoda', 'wind', 'wiatr', 'The wind blew the leaves off the trees.'),
  ('A2', 'pogoda', 'windy', 'wietrzny', 'It''s too windy to go sailing today.'),
  ('A2', 'pogoda', 'snow', 'śnieg', 'The snow covered the whole garden.'),
  ('A2', 'pogoda', 'snowy', 'śnieżny', 'We love walking in the snowy forest.'),
  ('A2', 'pogoda', 'storm', 'burza', 'A storm is coming, so close the windows.'),
  ('A2', 'pogoda', 'temperature', 'temperatura', 'The temperature dropped below zero last night.'),
  ('A2', 'pogoda', 'degree', 'stopień', 'It''s twenty degrees outside today.'),
  ('A2', 'pogoda', 'forecast', 'prognoza (pogody)', 'The forecast says it will rain tomorrow.'),
  ('A2', 'pogoda', 'hot', 'gorący', 'It''s too hot to play football today.'),
  ('A2', 'pogoda', 'cold', 'zimny', 'Wear a coat, it''s cold outside.'),
  ('A2', 'pogoda', 'warm', 'ciepły', 'The water in the sea was warm.'),
  ('A2', 'pogoda', 'cool', 'chłodny', 'The evenings are cool in September.'),
  ('A2', 'pogoda', 'foggy', 'mglisty', 'Drive slowly, it''s very foggy this morning.'),
  ('A2', 'pogoda', 'ice', 'lód', 'Be careful, there is ice on the road.'),
  ('A2', 'pogoda', 'thunder', 'grzmot', 'We heard thunder in the distance.'),
  ('A2', 'pogoda', 'lightning', 'błyskawica', 'The lightning lit up the whole sky.'),
  ('A2', 'pogoda', 'humid', 'wilgotny', 'It''s very humid today, so I feel tired.');

-- ----------------------------------------------------------------------------
-- zdrowie (health)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'zdrowie', 'health', 'zdrowie', 'Eating vegetables is good for your health.'),
  ('A2', 'zdrowie', 'doctor', 'lekarz', 'I have an appointment with the doctor at three.'),
  ('A2', 'zdrowie', 'nurse', 'pielęgniarka / pielęgniarz', 'The nurse checked my temperature.'),
  ('A2', 'zdrowie', 'hospital', 'szpital', 'He was taken to the hospital after the accident.'),
  ('A2', 'zdrowie', 'medicine', 'lekarstwo', 'Take this medicine twice a day.'),
  ('A2', 'zdrowie', 'pill', 'tabletka', 'She takes one pill every morning.'),
  ('A2', 'zdrowie', 'pharmacy', 'apteka', 'I need to buy some plasters at the pharmacy.'),
  ('A2', 'zdrowie', 'illness', 'choroba', 'He missed school because of a short illness.'),
  ('A2', 'zdrowie', 'symptom', 'objaw', 'A headache can be a symptom of many things.'),
  ('A2', 'zdrowie', 'headache', 'ból głowy', 'I have a headache, so I need to rest.'),
  ('A2', 'zdrowie', 'fever', 'gorączka', 'The child has a high fever tonight.'),
  ('A2', 'zdrowie', 'cough', 'kaszel', 'She has a bad cough and a sore throat.'),
  ('A2', 'zdrowie', 'flu', 'grypa', 'Half the class is sick with the flu.'),
  ('A2', 'zdrowie', 'appointment', 'wizyta (u lekarza)', 'I made an appointment with the dentist for Monday.'),
  ('A2', 'zdrowie', 'injury', 'kontuzja / uraz', 'The player couldn''t play because of his injury.'),
  ('A2', 'zdrowie', 'pain', 'ból', 'I feel a sharp pain in my back.'),
  ('A2', 'zdrowie', 'allergy', 'alergia', 'He has an allergy to nuts.'),
  ('A2', 'zdrowie', 'vaccine', 'szczepionka', 'Children get this vaccine at school.'),
  ('A2', 'zdrowie', 'diet', 'dieta', 'She started a healthy diet last month.'),
  ('A2', 'zdrowie', 'exercise', 'ćwiczenie (fizyczne)', 'Regular exercise keeps your heart healthy.'),
  ('A2', 'zdrowie', 'dentist', 'dentysta', 'I''m afraid of going to the dentist.'),
  ('A2', 'zdrowie', 'prescription', 'recepta', 'The doctor gave me a prescription for antibiotics.'),
  ('A2', 'zdrowie', 'healthy', 'zdrowy', 'My grandmother is very healthy for her age.'),
  ('A2', 'zdrowie', 'recover', 'wyzdrowieć', 'It took him two weeks to recover from the flu.');

-- ----------------------------------------------------------------------------
-- czas wolny (free time)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'czas wolny', 'hobby', 'hobby', 'Painting is my favourite hobby.'),
  ('A2', 'czas wolny', 'sport', 'sport', 'He plays a lot of sport at the weekend.'),
  ('A2', 'czas wolny', 'game', 'gra', 'We played a board game after dinner.'),
  ('A2', 'czas wolny', 'movie', 'film', 'Let''s watch a movie tonight.'),
  ('A2', 'czas wolny', 'cinema', 'kino', 'We went to the cinema on Friday evening.'),
  ('A2', 'czas wolny', 'theatre', 'teatr', 'They saw a play at the theatre last week.'),
  ('A2', 'czas wolny', 'concert', 'koncert', 'We''re going to a concert this Saturday.'),
  ('A2', 'czas wolny', 'museum', 'muzeum', 'The museum is closed on Mondays.'),
  ('A2', 'czas wolny', 'painting', 'malowanie / obraz', 'Painting helps her relax after work.'),
  ('A2', 'czas wolny', 'drawing', 'rysowanie', 'My son loves drawing animals.'),
  ('A2', 'czas wolny', 'reading', 'czytanie', 'Reading before bed helps me sleep.'),
  ('A2', 'czas wolny', 'book', 'książka', 'I''m reading a really interesting book.'),
  ('A2', 'czas wolny', 'music', 'muzyka', 'She listens to music every morning.'),
  ('A2', 'czas wolny', 'dance', 'taniec', 'They took dance lessons together.'),
  ('A2', 'czas wolny', 'party', 'impreza', 'We''re having a party for her birthday.'),
  ('A2', 'czas wolny', 'picnic', 'piknik', 'We had a picnic in the park.'),
  ('A2', 'czas wolny', 'garden', 'ogród', 'He spends every weekend in the garden.'),
  ('A2', 'czas wolny', 'fishing', 'wędkowanie', 'My father goes fishing every Sunday.'),
  ('A2', 'czas wolny', 'swimming', 'pływanie', 'Swimming is great exercise for the whole body.'),
  ('A2', 'czas wolny', 'cycling', 'jazda na rowerze', 'We go cycling along the river.'),
  ('A2', 'czas wolny', 'hiking', 'wędrówka piesza', 'They went hiking in the mountains last summer.'),
  ('A2', 'czas wolny', 'chess', 'szachy', 'My brother taught me how to play chess.'),
  ('A2', 'czas wolny', 'guitar', 'gitara', 'She plays the guitar in a small band.'),
  ('A2', 'czas wolny', 'photography', 'fotografia', 'Photography is a great hobby for travelling people.');

-- ----------------------------------------------------------------------------
-- transport
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'transport', 'bus', 'autobus', 'I take the bus to work every day.'),
  ('A2', 'transport', 'train', 'pociąg', 'The train leaves at half past eight.'),
  ('A2', 'transport', 'car', 'samochód', 'We drove to the coast in our car.'),
  ('A2', 'transport', 'taxi', 'taksówka', 'We took a taxi from the airport.'),
  ('A2', 'transport', 'bicycle', 'rower', 'He rides his bicycle to school.'),
  ('A2', 'transport', 'plane', 'samolot', 'Our plane lands at ten in the morning.'),
  ('A2', 'transport', 'ship', 'statek', 'The ship sailed across the ocean for a week.'),
  ('A2', 'transport', 'subway', 'metro', 'In New York, many people use the subway.'),
  ('A2', 'transport', 'tram', 'tramwaj', 'The tram stops right in front of our house.'),
  ('A2', 'transport', 'station', 'stacja / dworzec', 'Meet me at the station at six o''clock.'),
  ('A2', 'transport', 'platform', 'peron', 'The train to Kraków leaves from platform two.'),
  ('A2', 'transport', 'driver', 'kierowca', 'The bus driver was very friendly.'),
  ('A2', 'transport', 'fare', 'opłata za przejazd', 'The bus fare went up this year.'),
  ('A2', 'transport', 'traffic', 'ruch uliczny', 'There was heavy traffic on the way home.'),
  ('A2', 'transport', 'road', 'droga', 'This road leads straight to the city centre.'),
  ('A2', 'transport', 'highway', 'autostrada', 'We drove on the highway for two hours.'),
  ('A2', 'transport', 'parking', 'parking', 'There is no parking near the theatre.'),
  ('A2', 'transport', 'fuel', 'paliwo', 'We need to stop and buy some fuel.'),
  ('A2', 'transport', 'engine', 'silnik', 'The engine made a strange noise.'),
  ('A2', 'transport', 'seatbelt', 'pas bezpieczeństwa', 'Please fasten your seatbelt before we start.'),
  ('A2', 'transport', 'driving license', 'prawo jazdy', 'She got her driving license last year.'),
  ('A2', 'transport', 'motorbike', 'motocykl', 'He rides a motorbike to work in summer.'),
  ('A2', 'transport', 'ferry', 'prom', 'We crossed the river by ferry.'),
  ('A2', 'transport', 'traffic jam', 'korek (uliczny)', 'We were stuck in a traffic jam for an hour.');

-- ----------------------------------------------------------------------------
-- uczucia podstawowe (basic feelings)
-- ----------------------------------------------------------------------------
insert into vocabulary_words (level, category, word_en, translation_pl, example_sentence) values
  ('A2', 'uczucia podstawowe', 'happy', 'szczęśliwy', 'She looks very happy today.'),
  ('A2', 'uczucia podstawowe', 'sad', 'smutny', 'He felt sad after the film.'),
  ('A2', 'uczucia podstawowe', 'angry', 'zły / wściekły', 'My father was angry when I broke the window.'),
  ('A2', 'uczucia podstawowe', 'afraid', 'przestraszony (afraid of)', 'The little boy is afraid of the dark.'),
  ('A2', 'uczucia podstawowe', 'scared', 'przestraszony / wystraszony', 'She was scared during the storm.'),
  ('A2', 'uczucia podstawowe', 'nervous', 'zdenerwowany', 'I always feel nervous before an exam.'),
  ('A2', 'uczucia podstawowe', 'excited', 'podekscytowany', 'The children are excited about the trip.'),
  ('A2', 'uczucia podstawowe', 'tired', 'zmęczony', 'I''m too tired to go out tonight.'),
  ('A2', 'uczucia podstawowe', 'bored', 'znudzony', 'The students looked bored during the lesson.'),
  ('A2', 'uczucia podstawowe', 'surprised', 'zaskoczony', 'We were surprised by the good news.'),
  ('A2', 'uczucia podstawowe', 'worried', 'zmartwiony', 'She is worried about her exam results.'),
  ('A2', 'uczucia podstawowe', 'proud', 'dumny', 'His parents are very proud of him.'),
  ('A2', 'uczucia podstawowe', 'embarrassed', 'zawstydzony', 'I felt embarrassed when I forgot his name.'),
  ('A2', 'uczucia podstawowe', 'jealous', 'zazdrosny', 'He was jealous of his brother''s new bike.'),
  ('A2', 'uczucia podstawowe', 'confused', 'zdezorientowany', 'I''m confused by these instructions.'),
  ('A2', 'uczucia podstawowe', 'relaxed', 'zrelaksowany', 'I feel relaxed after a walk in the park.'),
  ('A2', 'uczucia podstawowe', 'lonely', 'samotny', 'She felt lonely after moving to a new city.'),
  ('A2', 'uczucia podstawowe', 'confident', 'pewny siebie', 'He seemed confident during the presentation.'),
  ('A2', 'uczucia podstawowe', 'disappointed', 'rozczarowany', 'We were disappointed with the weather on holiday.'),
  ('A2', 'uczucia podstawowe', 'grateful', 'wdzięczny', 'I''m grateful for your help.'),
  ('A2', 'uczucia podstawowe', 'curious', 'ciekawy (ciekawski)', 'The children were curious about the old house.'),
  ('A2', 'uczucia podstawowe', 'calm', 'spokojny', 'Try to stay calm during the exam.'),
  ('A2', 'uczucia podstawowe', 'upset', 'zdenerwowany / zmartwiony', 'She was upset when she lost her keys.'),
  ('A2', 'uczucia podstawowe', 'shy', 'nieśmiały', 'He is too shy to speak in front of the class.');
