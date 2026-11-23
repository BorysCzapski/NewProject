-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Talia „Business English: jednostki 5–7": 62 haseł z trzech jednostek podręcznika
-- (5 Sales Forecasts, 6 Controlling Operations, 7 Business Relationships), ze zdjęć
-- stron od użytkownika. Źródło: lexicon/business-english-source.txt.
-- Wymaga migracji 0037 (kolumna alternatives). Idempotentny: ponowne uruchomienie
-- aktualizuje hasła po kluczu (deck_id, term), więc postęp użytkowników zostaje.
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'business-english-5-7',
  'Business English: jednostki 5–7',
  'Sales Forecasts, Controlling Operations, Business Relationships — słownictwo biznesowe z podręcznika',
  'word',
  'Podręcznik Business English — jednostki 5, 6, 7',
  '',
  3
)
on conflict (slug) do nothing;

-- unique (deck_id, rank) nie pozwala na zamianę numerów w jednym zapytaniu, więc
-- najpierw odsuwamy rangi poza zakres, a upsert ustawia je na nowo.
update lexicon_entries
set rank = rank + 100000
where deck_id = (select id from lexicon_decks where slug = 'business-english-5-7');

insert into lexicon_entries (deck_id, rank, term, alternatives, translation_pl, example, example_pl, enriched_at)
select d.id, v.rank, v.term, v.alternatives, v.translation_pl, v.example, v.example_pl, now()
from lexicon_decks d
cross join (values
  (1, 'sales forecast', array[]::text[], 'prognoza sprzedaży', 'This report presents our sales forecast for the fourth quarter.', 'Ten raport przedstawia naszą prognozę sprzedaży na czwarty kwartał.'),
  (2, 'volume', array[]::text[], 'wielkość sprzedaży, wolumen', 'We will increase total sales by 24% over the current volume.', 'Zwiększymy łączną sprzedaż o 24% w stosunku do obecnego wolumenu.'),
  (3, 'predict', array[]::text[], 'przewidywać, prognozować', 'We predict the largest increase will come in the small engines division.', 'Przewidujemy, że największy wzrost nastąpi w dziale małych silników.'),
  (4, 'expect', array[]::text[], 'spodziewać się, oczekiwać', 'We expect sales of small motors to show above average increases.', 'Spodziewamy się ponadprzeciętnych wzrostów sprzedaży małych silników.'),
  (5, 'estimate', array[]::text[], 'szacować; szacunek', 'Based on that trend, we estimate a 25% decline for the fourth quarter.', 'Na podstawie tego trendu szacujemy 25% spadek w czwartym kwartale.'),
  (6, 'comparison', array[]::text[], 'porównanie', 'A comparison with Alta Inc. shows our strengths more clearly.', 'Porównanie z Alta Inc. wyraźniej pokazuje nasze mocne strony.'),
  (7, 'past sales', array[]::text[], 'dotychczasowa sprzedaż, sprzedaż z poprzednich okresów', 'Our current figures are much lower than those from past sales.', 'Nasze obecne wyniki są dużo niższe niż wyniki z poprzednich okresów.'),
  (8, 'seasonal trend', array[]::text[], 'trend sezonowy', 'A seasonal trend will not last the entire year.', 'Trend sezonowy nie utrzyma się przez cały rok.'),
  (9, 'factor', array[]::text[], 'czynnik', 'Another factor affecting the marine division is increasing competition.', 'Kolejnym czynnikiem wpływającym na dział morski jest rosnąca konkurencja.'),
  (10, 'competition', array[]::text[], 'konkurencja', 'Competition with Dorsey Marine is increasing.', 'Konkurencja ze strony Dorsey Marine rośnie.'),
  (11, 'contracts', array[]::text[], 'kontrakty, umowy', 'The company signed two new contracts to build offices.', 'Firma podpisała dwa nowe kontrakty na budowę biur.'),
  (12, 'existing', array[]::text[], 'istniejący, dotychczasowy', 'Strong sales with our existing clients will support this division.', 'Silna sprzedaż wśród dotychczasowych klientów wesprze ten dział.'),
  (13, 'pricing policy', array[]::text[], 'polityka cenowa', 'We advise a review of the company''s pricing policy.', 'Zalecamy przegląd polityki cenowej firmy.'),
  (14, 'outbid', array[]::text[], 'przebić ofertę', 'They outbid us on several contracts.', 'Przebili nasze oferty przy kilku kontraktach.'),
  (15, 'decline', array[]::text[], 'spadek', 'We estimate a 25% decline for the fourth quarter.', 'Szacujemy 25% spadek w czwartym kwartale.'),
  (16, 'demand', array[]::text[], 'popyt', 'The new engine remains in high demand.', 'Nowy silnik nadal cieszy się dużym popytem.'),
  (17, 'replacement parts', array[]::text[], 'części zamienne', 'Sales of replacement parts will show above average increases.', 'Sprzedaż części zamiennych wzrośnie ponad średnią.'),
  (18, 'division', array[]::text[], 'dział, oddział (firmy)', 'The largest increase will come in the small engines division.', 'Największy wzrost nastąpi w dziale małych silników.'),
  (19, 'operations', array[]::text[], 'działalność operacyjna, procesy operacyjne', 'I have several suggestions for improving operations and increasing efficiency.', 'Mam kilka sugestii, jak usprawnić działalność operacyjną i zwiększyć wydajność.'),
  (20, 'control', array[]::text[], 'kontrola, nadzór', 'The owner has control over the business.', 'Właściciel ma kontrolę nad firmą.'),
  (21, 'efficiency', array[]::text[], 'wydajność, sprawność', 'If you work faster, you might increase your efficiency.', 'Jeśli będziesz pracować szybciej, możesz zwiększyć swoją wydajność.'),
  (22, 'strategy', array[]::text[], 'strategia', 'Good plans have a clear strategy.', 'Dobre plany mają jasną strategię.'),
  (23, 'raw materials', array[]::text[], 'surowce', 'I would advise that you change your strategy regarding raw materials.', 'Radzę zmienić strategię dotyczącą surowców.'),
  (24, 'storage', array[]::text[], 'magazynowanie, przechowywanie', 'Warehouses are used for storage.', 'Magazyny służą do przechowywania towarów.'),
  (25, 'warehouse', array[]::text[], 'magazyn, hala magazynowa', 'Warehouses are used for storage.', 'Magazyny służą do przechowywania towarów.'),
  (26, 'just-in-time approach', array['just in time approach', 'just-in-time']::text[], 'system dostaw „dokładnie na czas" (just-in-time)', 'You could reduce this cost by up to 90% if you adopted a just-in-time approach.', 'Mógłbyś obniżyć ten koszt nawet o 90%, gdybyś przyjął system just-in-time.'),
  (27, 'minimize', array['minimise']::text[], 'zminimalizować, ograniczyć do minimum', 'That would minimize the amount of your resources and space.', 'To zminimalizowałoby ilość zasobów i miejsca, które zużywasz.'),
  (28, 'workload', array[]::text[], 'ilość pracy, obciążenie pracą', 'If you minimize your workload, you have less to do.', 'Jeśli zmniejszysz swoje obciążenie pracą, masz mniej do zrobienia.'),
  (29, 'inventory', array[]::text[], 'zapasy, stan magazynowy', 'Space goes toward maintaining inventory.', 'Miejsce jest potrzebne na utrzymanie zapasów.'),
  (30, 'inventory management', array[]::text[], 'zarządzanie zapasami', 'This would entail the adoption of a new inventory management system.', 'Wymagałoby to wdrożenia nowego systemu zarządzania zapasami.'),
  (31, 'supplies', array[]::text[], 'zaopatrzenie, materiały i zapasy', 'At the end of each week you order flour, sugar, and other supplies.', 'Pod koniec każdego tygodnia zamawiasz mąkę, cukier i inne zaopatrzenie.'),
  (32, 'supply chain', array[]::text[], 'łańcuch dostaw', 'Materials arrive via the supply chain.', 'Materiały docierają łańcuchem dostaw.'),
  (33, 'quality control', array[]::text[], 'kontrola jakości', 'Your quality control process is pretty thorough.', 'Wasz proces kontroli jakości jest dość dokładny.'),
  (34, 'strategic business unit', array[]::text[], 'strategiczna jednostka biznesowa', 'I would suggest that you start a strategic business unit.', 'Sugeruję, żebyś utworzył strategiczną jednostkę biznesową.'),
  (35, 'break-even point', array['breakeven point', 'break even point']::text[], 'próg rentowności', 'It may take a few years before the unit reaches a break-even point.', 'Może minąć kilka lat, zanim jednostka osiągnie próg rentowności.'),
  (36, 'factory', array[]::text[], 'fabryka, zakład produkcyjny', 'Factories can function without defined operations.', 'Fabryki mogą działać bez zdefiniowanych procesów.'),
  (37, 'retailer', array[]::text[], 'sprzedawca detaliczny', 'The supply chain runs from materials to the factory, the retailer and the consumer.', 'Łańcuch dostaw prowadzi od materiałów przez fabrykę i sprzedawcę detalicznego do konsumenta.'),
  (38, 'consumer', array[]::text[], 'konsument, klient końcowy', 'The supply chain ends with the consumer.', 'Łańcuch dostaw kończy się na konsumencie.'),
  (39, 'takeover', array[]::text[], 'przejęcie firmy', 'The business community was surprised at a corporation''s takeover of an auto parts maker.', 'Świat biznesu był zaskoczony przejęciem producenta części samochodowych przez korporację.'),
  (40, 'acquire', array[]::text[], 'przejąć firmę, nabyć', 'Nielson-Williams acquires Western Manufacturing.', 'Nielson-Williams przejmuje Western Manufacturing.'),
  (41, 'corporation', array[]::text[], 'korporacja', 'Another national corporation tried to take control of WM.', 'Inna krajowa korporacja próbowała przejąć kontrolę nad WM.'),
  (42, 'bid', array[]::text[], 'oferta przejęcia, próba przejęcia', 'Nielson-Williams made a successful bid for Western Manufacturing.', 'Nielson-Williams złożyło zwycięską ofertę przejęcia Western Manufacturing.'),
  (43, 'buyout', array[]::text[], 'wykup firmy', 'The deal put an end to a months-long battle for the buyout of the company.', 'Umowa zakończyła trwającą miesiącami walkę o wykup firmy.'),
  (44, 'target', array[]::text[], 'cel przejęcia', 'For months, WM was the target of another national corporation.', 'Przez miesiące WM była celem przejęcia innej krajowej korporacji.'),
  (45, 'hostile takeover', array[]::text[], 'wrogie przejęcie', 'Managers planned to quit if NexiCorp''s hostile takeover was successful.', 'Menedżerowie planowali odejść, jeśli wrogie przejęcie przez NexiCorp się powiedzie.'),
  (46, 'tender offer', array[]::text[], 'publiczna oferta wykupu akcji', 'Nielson-Williams stepped in and made its own tender offer.', 'Nielson-Williams wkroczyło do akcji i złożyło własną publiczną ofertę wykupu akcji.'),
  (47, 'white knight', array[]::text[], '„biały rycerz" (inwestor ratujący firmę przed wrogim przejęciem)', 'Many hailed Nielson-Williams as a white knight.', 'Wielu okrzyknęło Nielson-Williams „białym rycerzem".'),
  (48, 'divestment', array['divestiture']::text[], 'zbycie aktywów, wyprzedaż części firmy', 'WM announced plans for divestment to prevent bankruptcy.', 'WM ogłosiło plany zbycia aktywów, żeby uniknąć bankructwa.'),
  (49, 'bankrupt', array[]::text[], 'niewypłacalny, zbankrutowany', 'The company was going bankrupt.', 'Firma stała na skraju bankructwa.'),
  (50, 'bankruptcy', array[]::text[], 'bankructwo, upadłość', 'Selling parts of a company can help corporations avoid bankruptcy.', 'Sprzedaż części firmy może pomóc korporacjom uniknąć bankructwa.'),
  (51, 'offer', array[]::text[], 'oferta', 'Several larger corporations have made offers.', 'Kilka większych korporacji złożyło oferty.'),
  (52, 'friendly takeover', array[]::text[], 'przyjazne przejęcie', 'The board considers this a friendly takeover.', 'Zarząd uważa to za przyjazne przejęcie.'),
  (53, 'parent company', array[]::text[], 'spółka matka', 'WM is pleased to accept Nielson-Williams as its parent company.', 'WM chętnie przyjmuje Nielson-Williams jako swoją spółkę matkę.'),
  (54, 'shares', array[]::text[], 'akcje, udziały', 'Mr. Lewis made an offer to buy a majority of company shares.', 'Pan Lewis złożył ofertę kupna większości akcji firmy.'),
  (55, 'majority', array[]::text[], 'większość', 'A majority of WM''s management team announced intentions to quit.', 'Większość zarządu WM zapowiedziała zamiar odejścia.'),
  (56, 'aggressive', array[]::text[], 'agresywny', 'None of the offers was as aggressive as NexiCorp''s.', 'Żadna z ofert nie była tak agresywna jak oferta NexiCorp.'),
  (57, 'unethical', array[]::text[], 'nieetyczny', 'The board objected to NexiCorp''s unethical business practices.', 'Zarząd sprzeciwił się nieetycznym praktykom biznesowym NexiCorp.'),
  (58, 'business practices', array[]::text[], 'praktyki biznesowe', 'Officials disagreed with NexiCorp''s business practices.', 'Przedstawiciele WM nie zgadzali się z praktykami biznesowymi NexiCorp.'),
  (59, 'disagree', array[]::text[], 'nie zgadzać się', 'Officials at WM disagreed with NexiCorp''s business practices.', 'Przedstawiciele WM nie zgadzali się z praktykami biznesowymi NexiCorp.'),
  (60, 'welcome', array[]::text[], 'przyjąć z zadowoleniem', 'The management welcomed Nielson-Williams as their new parent company.', 'Zarząd z zadowoleniem przyjął Nielson-Williams jako nową spółkę matkę.'),
  (61, 'complete', array[]::text[], 'sfinalizować, zakończyć', 'Nielson-Williams completed its buyout of Western Manufacturing.', 'Nielson-Williams sfinalizowało wykup Western Manufacturing.'),
  (62, 'profitable', array[]::text[], 'dochodowy, zyskowny', 'WM used to be a profitable company.', 'WM kiedyś była dochodową firmą.')
) as v(rank, term, alternatives, translation_pl, example, example_pl)
where d.slug = 'business-english-5-7'
on conflict (deck_id, term) do update
  set rank = excluded.rank,
      alternatives = excluded.alternatives,
      translation_pl = excluded.translation_pl,
      example = excluded.example,
      example_pl = excluded.example_pl,
      enriched_at = coalesce(lexicon_entries.enriched_at, excluded.enriched_at);
