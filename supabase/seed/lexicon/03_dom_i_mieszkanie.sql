-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Talia „Dom i mieszkanie": 94 haseł z zestawu „Pojęcia" (zrzuty ekranu od użytkownika).
-- Pominięte (ucięte na zrzucie, bez tłumaczenia): armchair, outdoor heater.
-- Lista jest niepełna — zrzuty urywają się na „outdoor heater", a między
-- „armchair" i „bench" oraz „boiler room" i „bowl" brakuje fragmentów. Reszta
-- dojdzie osobnym plikiem; rank to pozycja w przepisanej liście.
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'dom-pojecia',
  'Dom i mieszkanie',
  'Słownictwo o domu, wyposażeniu i obowiązkach domowych — słówka i zwroty',
  'word',
  'Zestaw „Pojęcia" — dom i mieszkanie',
  '',
  3
)
on conflict (slug) do nothing;

-- Talia jest niepełna i będzie uzupełniana, a nowe hasła wchodzą MIĘDZY
-- istniejące i przesuwają rank. unique (deck_id, rank) nie pozwala na zamianę
-- numerów w jednym zapytaniu, więc najpierw odsuwamy wszystkie rangi poza
-- zakres, a upsert ustawia je na nowo (term jest kluczem, więc postęp
-- użytkowników, wskazujący na entry_id, zostaje nietknięty).
update lexicon_entries
set rank = rank + 100000
where deck_id = (select id from lexicon_decks where slug = 'dom-pojecia');

insert into lexicon_entries (deck_id, rank, term, translation_pl, enriched_at)
select d.id, v.rank, v.term, v.translation_pl, now()
from lexicon_decks d
cross join (values
  (1, 'across the street', 'po drugiej stronie ulicy'),
  (2, 'air conditioning', 'klimatyzacja'),
  (3, 'allotment', 'działka'),
  (4, 'ancient', 'starożytny, wiekowy, bardzo stary'),
  (5, 'antique furniture', 'zabytkowe meble'),
  (6, 'area', 'okolica'),
  (8, 'bench', 'ławka'),
  (9, 'blanket', 'koc'),
  (10, 'blind', 'roleta, żaluzja'),
  (11, 'boiler room', 'kotłownia'),
  (12, 'bowl', 'miska'),
  (13, 'bright', 'jasny'),
  (14, 'bunk bed', 'łóżko piętrowe'),
  (15, 'burglar alarm', 'alarm antywłamaniowy'),
  (16, 'castle', 'zamek'),
  (17, 'ceiling', 'sufit'),
  (18, 'cellar', 'piwnica'),
  (19, 'central heating', 'centralne ogrzewanie'),
  (20, 'change a light bulb', 'wymienić żarówkę'),
  (21, 'chimney', 'komin'),
  (22, 'clear up the mess', 'sprzątać bałagan'),
  (23, 'coffeemaker', 'ekspres do kawy'),
  (24, 'conveniently located', 'dogodnie położony'),
  (25, 'corridor', 'korytarz'),
  (26, 'couch', 'kanapa'),
  (27, 'council house', 'budynek komunalny'),
  (28, 'cupboard', 'szafka kuchenna'),
  (29, 'cushion', 'poduszka dekoracyjna'),
  (30, 'cutlery', 'sztućce'),
  (31, 'dining table', 'stół jadalny'),
  (32, 'dishwasher', 'zmywarka'),
  (33, 'district', 'dzielnica'),
  (34, 'do household chores', 'wykonywać obowiązki domowe'),
  (35, 'do the washing-up', 'zmywać naczynia'),
  (36, 'door handle', 'klamka'),
  (37, 'doorbell', 'dzwonek'),
  (38, 'doormat', 'wycieraczka do butów'),
  (39, 'draw the curtains', 'zasłaniać zasłony'),
  (40, 'dry the dishes', 'wycierać naczynia'),
  (41, 'dust the furniture', 'ścierać kurze z mebli'),
  (42, 'duvet', 'kołdra, pierzyna'),
  (43, 'easy access to sth', 'łatwy dostęp do czegoś'),
  (44, 'electric cooker', 'kuchenka elektryczna'),
  (45, 'electrical appliances', 'urządzenia elektryczne'),
  (46, 'empty', 'pusty'),
  (47, 'empty the dishwasher', 'opróżniać zmywarkę'),
  (48, 'feed the dog', 'karmić psa'),
  (49, 'fence', 'płot'),
  (50, 'fireplace', 'kominek'),
  (51, 'fitted wardrobe', 'szafa wnękowa'),
  (52, 'fix sth', 'naprawiać coś'),
  (53, 'flat', 'mieszkanie'),
  (54, 'fold the clothes', 'składać ubrania'),
  (55, 'gate', 'brama, furtka'),
  (56, 'go inside', 'wejść do środka'),
  (57, 'gravel path', 'ścieżka żwirowa'),
  (58, 'ground floor', 'parter'),
  (59, 'hang (up) the washing', 'rozwieszać pranie'),
  (60, 'heater', 'grzejnik, kaloryfer'),
  (61, 'houseboat', 'łódź mieszkalna'),
  (62, 'household appliances', 'sprzęt AGD'),
  (63, 'in front of sth', 'przed czymś'),
  (64, 'in the suburbs', 'na przedmieściach'),
  (65, 'inhabitant', 'mieszkaniec, mieszkanka'),
  (66, 'iron', 'żelazny; żelazo'),
  (67, 'kettle', 'czajnik'),
  (68, 'knock on the door', 'pukać do drzwi'),
  (69, 'ladder', 'drabina'),
  (70, 'laundry (room/area)', 'pralnia'),
  (71, 'lawn', 'trawnik'),
  (72, 'lie on the sofa', 'leżeć na kanapie'),
  (73, 'lift', 'winda'),
  (74, 'light', 'światło'),
  (75, 'light bulb', 'żarówka'),
  (76, 'load the washing machine', 'ładować pralkę'),
  (77, 'lock the door', 'zamykać drzwi na klucz'),
  (78, 'made-to-order wardrobe', 'szafa na wymiar'),
  (79, 'make yourself at home', 'czuj się jak u siebie w domu'),
  (80, 'mansion', 'luksusowa rezydencja'),
  (81, 'mattress', 'materac'),
  (82, 'mend sth', 'naprawiać coś'),
  (83, 'messy', 'nieuporządkowany, zabałaganiony'),
  (84, 'microwave oven', 'kuchenka mikrofalowa'),
  (85, 'mug', 'kubek'),
  (86, 'neat', 'schludny'),
  (87, 'neighbour', 'sąsiad, sąsiadka'),
  (88, 'neighbourhood', 'okolica'),
  (89, 'net curtain', 'firanka'),
  (90, 'next to sth', 'obok czegoś'),
  (91, 'old-fashioned', 'staroświecki, staromodny'),
  (92, 'on the corner', 'na rogu'),
  (93, 'on the top floor', 'na ostatnim piętrze'),
  (94, 'one-bedroom flat', 'mieszkanie z jedną sypialnią'),
  (95, 'opposite sth', 'naprzeciwko czegoś')
) as v(rank, term, translation_pl)
where d.slug = 'dom-pojecia'
on conflict (deck_id, term) do update
  set rank = excluded.rank,
      translation_pl = excluded.translation_pl,
      enriched_at = coalesce(lexicon_entries.enriched_at, excluded.enriched_at);
