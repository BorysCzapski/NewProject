-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- ============================================================================
-- supabase/seed/matura/19_vocab_phrasal_verbs.sql
-- Blok „Phrasal verbs na maturze" w banku słownictwa angielskiego.
-- Źródło: testyourenglish.pl, „Phrasal verbs na maturze"
-- (https://testyourenglish.pl/wiedza/phrasal-verbs-na-maturze/) — hasło,
-- tłumaczenie i zdanie przykładowe z tłumaczeniem, wszystko ze źródła.
-- 41 haseł. Nieniszczący i idempotentny (nie kasuje banku).
-- ============================================================================

insert into matura_vocab_topics (language, slug, title, title_target, description, order_index) values
  ('en', 'phrasal-verbs', 'Phrasal verbs', 'Phrasal verbs',
   'Czasowniki frazowe, które najczęściej pojawiają się na maturze. Źródło: testyourenglish.pl.', 17)
on conflict do nothing;

insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, 'podstawowa'::matura_level, v.term, 'czasownik frazowy', v.pl, v.ex, v.ex_pl, '', v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'phrasal-verbs') t,
(values
  (1, 'get up', 'wstawać', 'I have to get up at 6 AM tomorrow to catch the train.', 'Muszę jutro wstać o 6 rano, żeby zdążyć na pociąg.'),
  (2, 'go out', 'wychodzić (np. ze znajomymi)', 'Do you want to go out for a pizza tonight?', 'Chcesz wyjść dziś wieczorem na pizzę?'),
  (3, 'look for', 'szukać', 'I’m looking for my keys, I can’t find them anywhere.', 'Szukam moich kluczy, nigdzie nie mogę ich znaleźć.'),
  (4, 'find out', 'dowiedzieć się', 'I need to find out what time the exam starts.', 'Muszę się dowiedzieć, o której zaczyna się egzamin.'),
  (5, 'put on', 'zakładać (ubranie)', 'Put on a warm coat, it’s freezing outside.', 'Załóż ciepły płaszcz, na zewnątrz jest lodowato.'),
  (6, 'take off', 'zdejmować (ubranie); startować (o samolocie)', 'Please take off your shoes before entering.', 'Proszę, zdejmij buty przed wejściem.'),
  (7, 'turn on', 'włączać', 'Can you turn on the light? I can’t see anything.', 'Możesz włączyć światło? Nic nie widzę.'),
  (8, 'turn off', 'wyłączać', '', ''),
  (9, 'give up', 'poddać się; rzucić (nawyk)', 'Learning to play the guitar is hard, but don’t give up!', 'Nauka gry na gitarze jest trudna, ale nie poddawaj się!'),
  (10, 'carry on', 'kontynuować', 'Sorry for the interruption, please carry on with your presentation.', 'Przepraszam za przerwę, proszę kontynuować prezentację.'),
  (11, 'run out of', 'skończyć się, wyczerpać zapas', 'Oh no, we’ve run out of milk. I need to go to the shop.', 'O nie, skończyło nam się mleko. Muszę iść do sklepu.'),
  (12, 'look after', 'opiekować się', 'I have to look after my younger sister this evening.', 'Muszę dziś wieczorem zaopiekować się moją młodszą siostrą.'),
  (13, 'look forward to', 'nie móc się doczekać', 'I’m really looking forward to the summer holidays.', 'Naprawdę nie mogę się doczekać letnich wakacji.'),
  (14, 'get along with', 'dogadywać się z kimś', 'I get along with my classmates really well.', 'Bardzo dobrze dogaduję się z moimi kolegami z klasy.'),
  (15, 'break up', 'zerwać z kimś', 'Did you hear that Tom and Kate decided to break up?', 'Słyszałeś, że Tom i Kate postanowili zerwać?'),
  (16, 'come across', 'natknąć się na coś/kogoś', 'I came across an interesting article about climate change.', 'Natknąłem się na ciekawy artykuł o zmianach klimatu.'),
  (17, 'come up with', 'wymyślić coś, wpaść na pomysł', 'We need to come up with a good idea for our school project.', 'Musimy wpaść na dobry pomysł na nasz projekt szkolny.'),
  (18, 'figure out', 'zrozumieć, rozwiązać', 'It took me a while to figure out this maths problem.', 'Zajęło mi chwilę, żeby rozwiązać to zadanie z matematyki.'),
  (19, 'put off', 'odkładać na później', 'Don’t put off studying for your exams until the last minute.', 'Nie odkładaj nauki do egzaminów na ostatnią chwilę.'),
  (20, 'deal with', 'radzić sobie z czymś', 'Being a class president means you have to deal with a lot of problems.', 'Bycie przewodniczącym klasy oznacza, że musisz radzić sobie z wieloma problemami.'),
  (21, 'work out', 'rozwiązać problem; ćwiczyć', 'Don’t worry, we’ll work out a solution.', 'Nie martw się, wypracujemy jakieś rozwiązanie.'),
  (22, 'set off', 'wyruszyć w podróż', 'We need to set off early to avoid the traffic.', 'Musimy wyruszyć wcześnie, żeby uniknąć korków.'),
  (23, 'get back', 'wrócić', 'What time did you get back home last night?', 'O której wróciłeś wczoraj do domu?'),
  (24, 'check in', 'zameldować się', 'You should check in at the hotel as soon as you arrive.', 'Powinieneś zameldować się w hotelu, jak tylko przyjedziesz.'),
  (25, 'hand in', 'oddać (pracę, zadanie)', 'The deadline to hand in the essay is this Friday.', 'Termin oddania eseju jest w ten piątek.'),
  (26, 'fall behind', 'mieć zaległości', 'I was ill for a week and I fell behind with my schoolwork.', 'Byłem chory przez tydzień i mam zaległości w nauce.'),
  (27, 'go over', 'powtórzyć materiał', 'Let’s go over the most important topics before the test.', 'Powtórzmy najważniejsze tematy przed testem.'),
  (28, 'put up with', 'znosić, tolerować', 'I don’t know how she can put up with such a noisy neighbour.', 'Nie wiem, jak ona może znosić tak hałaśliwego sąsiada.'),
  (29, 'rely on', 'polegać na', 'She’s a great friend, you can always rely on her.', 'To świetna przyjaciółka, zawsze możesz na niej polegać.'),
  (30, 'bring up', 'poruszyć temat; wychowywać', 'I didn’t want to bring up the bad news at the party.', 'Nie chciałem poruszać tych złych wieści na imprezie.'),
  (31, 'grow up', 'dorastać', 'I grew up in a small town near the mountains.', 'Dorastałem w małym miasteczku blisko gór.'),
  (32, 'break down', 'zepsuć się', 'Our car broke down in the middle of nowhere.', 'Nasz samochód zepsuł się na kompletnym pustkowiu.'),
  (33, 'ask out', 'zaprosić na randkę', 'He finally decided to ask her out.', 'W końcu zdecydował się zaprosić ją na randkę.'),
  (34, 'make up', 'pogodzić się; zmyślić historię', 'They had an argument, but they made up quickly.', 'Pokłócili się, ale szybko się pogodzili.'),
  (35, 'fall for', 'zakochać się w kimś', 'He fell for her the moment he saw her.', 'Zakochał się w niej, jak tylko ją zobaczył.'),
  (36, 'take up', 'zacząć (hobby)', 'I’m thinking of taking up photography.', 'Myślę o tym, żeby zająć się fotografią.'),
  (37, 'turn down', 'odrzucić (ofertę)', 'She turned down the job offer in London because she didn’t want to move.', 'Odrzuciła ofertę pracy w Londynie, bo nie chciała się przeprowadzać.'),
  (38, 'look up to', 'podziwiać kogoś', 'Many young athletes look up to Iga Świątek.', 'Wielu młodych sportowców podziwia Igę Świątek.'),
  (39, 'show up', 'pojawić się', 'We waited for an hour, but he never showed up.', 'Czekaliśmy godzinę, ale on nigdy się nie pojawił.'),
  (40, 'sort out', 'rozwiązać problem, uporządkować', 'We need to sort out the details of our trip.', 'Musimy uporządkować szczegóły naszej wycieczki.'),
  (41, 'stand for', 'oznaczać (o skrócie); popierać coś', 'Do you know what „UNESCO” stands for?', 'Czy wiesz, co oznacza skrót „UNESCO”?')
) as v(ord, term, pl, ex, ex_pl)
on conflict (topic_id, term) do nothing;
