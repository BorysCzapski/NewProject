-- ============================================================================
-- supabase/seed/geografia/02_exercises.sql
-- A small, hand-checked starter set (2 multiple-choice questions per CKE
-- topic + 5 map-point exercises) — deliberately NOT a full 25-per-topic
-- library. Geography facts are exactly the kind of thing worth getting
-- right rather than mass-generating at seed time; the AI-generation pipeline
-- (lib/geografia/generate.ts, triggered from /geografia/admin) and student
-- uploads (/geografia/wgraj) are how each topic grows toward the product
-- spec's 25-exercise target — see components/geografia/topic-list-item.tsx.
--
-- Idempotent: deletes existing 'built_in' exercises for these topics first,
-- so re-running this file doesn't duplicate rows. Run AFTER 01_topics.sql.
-- ============================================================================

delete from geo_exercises where source = 'built_in';

-- ----------------------------------------------------------------------------
-- I. Źródła informacji geograficznej
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'zrodla-informacji-geograficznej'),
  'mc', 1, 1,
  '{"statement": "Skala mapy 1:500 000 oznacza, że 1 cm na mapie odpowiada w terenie odległości:"}'::jsonb,
  '[{"id":"o0","text":"500 m"},{"id":"o1","text":"5 km"},{"id":"o2","text":"50 km"},{"id":"o3","text":"500 km"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Zamień jednostki: 1 cm x 500 000 = 500 000 cm. Przelicz centymetry na kilometry (1 km = 100 000 cm)."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'zrodla-informacji-geograficznej'),
  'mc', 2, 1,
  '{"statement": "Zdalne zbieranie danych o powierzchni Ziemi za pomocą satelitów lub samolotów (bez kontaktu z badanym obiektem) to:"}'::jsonb,
  '[{"id":"o0","text":"GPS"},{"id":"o1","text":"Teledetekcja"},{"id":"o2","text":"GIS"},{"id":"o3","text":"Niwelacja"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Nazwa metody dosłownie oznacza \"wykrywanie na odległość\"."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- II. Ziemia we Wszechświecie
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'ziemia-we-wszechswiecie'),
  'mc', 1, 1,
  '{"statement": "Pory roku na Ziemi są następstwem przede wszystkim:"}'::jsonb,
  '[{"id":"o0","text":"zmiennej odległości Ziemi od Słońca w ciągu roku"},{"id":"o1","text":"nachylenia osi ziemskiej do płaszczyzny orbity i ruchu obiegowego"},{"id":"o2","text":"zmian jasności Słońca w cyklu rocznym"},{"id":"o3","text":"zmiennej prędkości ruchu obrotowego Ziemi"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Odległość Ziemi od Słońca zmienia się w ciągu roku bardzo nieznacznie i nie jest głównym czynnikiem."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'ziemia-we-wszechswiecie'),
  'mc', 2, 1,
  '{"statement": "Ruch obiegowy Ziemi wokół Słońca (rok gwiazdowy) trwa około:"}'::jsonb,
  '[{"id":"o0","text":"24 godziny"},{"id":"o1","text":"27 dni"},{"id":"o2","text":"365 dni i 6 godzin"},{"id":"o3","text":"30 dni"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["To właśnie z tych dodatkowych ok. 6 godzin co 4 lata wynika rok przestępny."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- III. Atmosfera
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'atmosfera'),
  'mc', 1, 1,
  '{"statement": "W której warstwie atmosfery zachodzą zjawiska pogodowe (opady, wiatry, chmury)?"}'::jsonb,
  '[{"id":"o0","text":"Troposfera"},{"id":"o1","text":"Stratosfera"},{"id":"o2","text":"Mezosfera"},{"id":"o3","text":"Jonosfera"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["To najniższa warstwa atmosfery, sięgająca do ok. 10-12 km."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'atmosfera'),
  'mc', 2, 1,
  '{"statement": "Warstwa ozonowa, chroniąca powierzchnię Ziemi przed nadmiarem promieniowania UV, znajduje się w:"}'::jsonb,
  '[{"id":"o0","text":"troposferze"},{"id":"o1","text":"stratosferze"},{"id":"o2","text":"mezosferze"},{"id":"o3","text":"egzosferze"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["To warstwa bezpośrednio nad troposferą."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- IV. Hydrosfera
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'hydrosfera'),
  'mc', 1, 1,
  '{"statement": "Krążenie wody w przyrodzie (cykl hydrologiczny) jest napędzane głównie energią:"}'::jsonb,
  '[{"id":"o0","text":"geotermalną"},{"id":"o1","text":"słoneczną"},{"id":"o2","text":"pływów morskich"},{"id":"o3","text":"wiatru"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["To ta sama energia, która powoduje parowanie wody z oceanów."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'hydrosfera'),
  'mc', 2, 1,
  '{"statement": "Ciepły prąd morski płynący wzdłuż wschodnich wybrzeży Ameryki Północnej, łagodzący klimat Europy Zachodniej, to:"}'::jsonb,
  '[{"id":"o0","text":"Prąd Labradorski"},{"id":"o1","text":"Golfsztrom"},{"id":"o2","text":"Prąd Peruwiański"},{"id":"o3","text":"Kuroshio"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Kuroshio to analogiczny ciepły prąd, ale na Pacyfiku, u wybrzeży Japonii."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- V. Litosfera
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'litosfera'),
  'mc', 2, 1,
  '{"statement": "Powstawanie łańcuchów górskich takich jak Himalaje tłumaczy się w teorii tektoniki płyt jako efekt:"}'::jsonb,
  '[{"id":"o0","text":"kolizji (zderzenia) dwóch płyt litosfery"},{"id":"o1","text":"rozpadu jednej płyty na kilka mniejszych"},{"id":"o2","text":"długotrwałej erozji wietrznej"},{"id":"o3","text":"osiadania skał pod wpływem grawitacji"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Himalaje powstały w wyniku zderzenia płyty indyjskiej z euroazjatycką."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'litosfera'),
  'mc', 1, 1,
  '{"statement": "Rozpad skał pod wpływem zmian temperatury, wody, mrozu lub organizmów, bez przemieszczania powstałego materiału, to:"}'::jsonb,
  '[{"id":"o0","text":"erozja"},{"id":"o1","text":"wietrzenie"},{"id":"o2","text":"transport"},{"id":"o3","text":"akumulacja"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Erozja dodatkowo przemieszcza materiał, ten proces sam w sobie nie."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- VI. Pedosfera i biosfera
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'pedosfera-i-biosfera'),
  'mc', 2, 1,
  '{"statement": "Silnie wyługowane, czerwonobrunatne gleby, ubogie w składniki odżywcze, typowe dla klimatu równikowego wilgotnego, to gleby:"}'::jsonb,
  '[{"id":"o0","text":"czarnoziemy"},{"id":"o1","text":"laterytowe (ferralitowe)"},{"id":"o2","text":"bielicowe"},{"id":"o3","text":"rędziny"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Intensywne opady wypłukują z nich większość składników mineralnych."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'pedosfera-i-biosfera'),
  'mc', 1, 1,
  '{"statement": "Formacja roślinna charakterystyczna dla klimatu równikowego wilgotnego to:"}'::jsonb,
  '[{"id":"o0","text":"tajga"},{"id":"o1","text":"step"},{"id":"o2","text":"wilgotny las równikowy"},{"id":"o3","text":"tundra"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["To formacja o najwyższej bioróżnorodności na Ziemi."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- VII. Podział polityczny i rozwój społeczno-gospodarczy świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'podzial-polityczny-i-rozwoj-spoleczno-gospodarczy'),
  'mc', 2, 1,
  '{"statement": "Który wskaźnik uwzględnia jednocześnie długość życia, poziom edukacji i dochód narodowy, oceniając poziom rozwoju społeczno-gospodarczego?"}'::jsonb,
  '[{"id":"o0","text":"PKB per capita"},{"id":"o1","text":"HDI (wskaźnik rozwoju społecznego)"},{"id":"o2","text":"Wskaźnik Giniego"},{"id":"o3","text":"Stopa bezrobocia"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["PKB per capita mierzy tylko jeden z trzech elementów tego wskaźnika."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'podzial-polityczny-i-rozwoj-spoleczno-gospodarczy'),
  'mc', 1, 1,
  '{"statement": "Forma ustroju politycznego, w której głowa państwa jest wybierana i nie dziedziczy władzy, to:"}'::jsonb,
  '[{"id":"o0","text":"monarchia"},{"id":"o1","text":"republika"},{"id":"o2","text":"kolonia"},{"id":"o3","text":"protektorat"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["W monarchii władza jest z reguły dziedziczona."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- VIII. Przemiany struktur demograficznych i procesy osadnicze
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'demografia-i-osadnictwo'),
  'mc', 1, 1,
  '{"statement": "Przyrost naturalny to różnica między:"}'::jsonb,
  '[{"id":"o0","text":"liczbą urodzeń a liczbą zgonów"},{"id":"o1","text":"liczbą imigrantów a liczbą emigrantów"},{"id":"o2","text":"liczbą urodzeń a liczbą zawartych małżeństw"},{"id":"o3","text":"gęstością zaludnienia a powierzchnią kraju"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["To wskaźnik czysto demograficzny, niezwiązany z migracjami (to przyrost rzeczywisty)."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'demografia-i-osadnictwo'),
  'mc', 2, 1,
  '{"statement": "Faza modelu przejścia demograficznego z wysoką urodzeniowością i szybko spadającą umieralnością (stąd wysoki przyrost naturalny) występuje najczęściej w krajach:"}'::jsonb,
  '[{"id":"o0","text":"wysoko rozwiniętych"},{"id":"o1","text":"rozwijających się"},{"id":"o2","text":"o gospodarce nakazowo-rozdzielczej"},{"id":"o3","text":"postsocjalistycznych"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["W krajach wysoko rozwiniętych umieralność spadła już dawno temu, a urodzeniowość jest niska."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- IX. Uwarunkowania rozwoju gospodarki światowej
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'uwarunkowania-gospodarki-swiatowej'),
  'mc', 1, 1,
  '{"statement": "Proces integracji rynków, kapitału, towarów i informacji na skalę światową nazywamy:"}'::jsonb,
  '[{"id":"o0","text":"globalizacją"},{"id":"o1","text":"regionalizacją"},{"id":"o2","text":"autarkią"},{"id":"o3","text":"dekolonizacją"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Autarkia to dokładne przeciwieństwo — gospodarcza samowystarczalność i izolacja."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'uwarunkowania-gospodarki-swiatowej'),
  'mc', 2, 1,
  '{"statement": "Firma prowadząca działalność w wielu krajach jednocześnie, zarządzana z jednego centralnego ośrodka, to:"}'::jsonb,
  '[{"id":"o0","text":"korporacja transnarodowa"},{"id":"o1","text":"spółdzielnia"},{"id":"o2","text":"monopolista lokalny"},{"id":"o3","text":"gospodarstwo rodzinne"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Skrót \"korporacja ponadnarodowa\" opisuje tę samą formę."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- X. Rolnictwo, leśnictwo i rybactwo
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'rolnictwo-lesnictwo-rybactwo'),
  'mc', 1, 1,
  '{"statement": "Rolnictwo, w którym większość produkcji jest przeznaczana na sprzedaż, a nie na potrzeby własne producenta, nazywamy:"}'::jsonb,
  '[{"id":"o0","text":"samozaopatrzeniowym"},{"id":"o1","text":"towarowym"},{"id":"o2","text":"zbieracko-łowieckim"},{"id":"o3","text":"trzypolowym"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Przeciwieństwem jest rolnictwo samozaopatrzeniowe (na własne potrzeby)."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'rolnictwo-lesnictwo-rybactwo'),
  'mc', 2, 1,
  '{"statement": "Sztuczne utrzymywanie i rozmnażanie organizmów wodnych (ryb, skorupiaków, alg) w kontrolowanych warunkach nazywa się:"}'::jsonb,
  '[{"id":"o0","text":"akwakulturą"},{"id":"o1","text":"batymetrią"},{"id":"o2","text":"talasokracją"},{"id":"o3","text":"eutrofizacją"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Prefiks \"akwa-\" wskazuje na związek z wodą i uprawą/chowem."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XI. Przemysł
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'przemysl'),
  'mc', 2, 1,
  '{"statement": "Współczesny przemysł wysokiej technologii (high-tech) lokalizuje się najczęściej w pobliżu:"}'::jsonb,
  '[{"id":"o0","text":"złóż węgla kamiennego"},{"id":"o1","text":"dużych ośrodków naukowo-badawczych i uniwersytetów"},{"id":"o2","text":"portów rzecznych"},{"id":"o3","text":"pastwisk"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Kluczowym zasobem tego przemysłu jest wiedza i wysoko wykwalifikowana kadra, nie surowce."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'przemysl'),
  'mc', 1, 1,
  '{"statement": "Obszar o dużej koncentracji zakładów przemysłowych, powiązanych ze sobą gospodarczo, to:"}'::jsonb,
  '[{"id":"o0","text":"okręg przemysłowy"},{"id":"o1","text":"park narodowy"},{"id":"o2","text":"strefa klimatyczna"},{"id":"o3","text":"dorzecze"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Przykładem jest Górnośląski Okręg Przemysłowy."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XII. Usługi
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'uslugi'),
  'mc', 1, 1,
  '{"statement": "Sektor gospodarki obejmujący m.in. handel, transport, edukację i opiekę zdrowotną nazywamy sektorem:"}'::jsonb,
  '[{"id":"o0","text":"pierwszym (rolniczym)"},{"id":"o1","text":"drugim (przemysłowym)"},{"id":"o2","text":"trzecim (usługowym)"},{"id":"o3","text":"żadnym z powyższych"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["Sektor pierwszy to rolnictwo, drugi to przemysł i budownictwo."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'uslugi'),
  'mc', 2, 1,
  '{"statement": "Forma turystyki związana z odwiedzaniem obszarów przyrodniczo cennych, często chronionych, z zachowaniem zasad zrównoważonego rozwoju, to:"}'::jsonb,
  '[{"id":"o0","text":"turystyka kwalifikowana"},{"id":"o1","text":"turystyka eventowa"},{"id":"o2","text":"ekoturystyka"},{"id":"o3","text":"turystyka masowa"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["Nazwa zawiera przedrostek \"eko-\", wskazujący na powiązanie ze środowiskiem."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XIII. Człowiek a środowisko geograficzne
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'czlowiek-a-srodowisko'),
  'mc', 1, 1,
  '{"statement": "Szkodliwa, nadmierna działalność człowieka wywierająca presję na środowisko przyrodnicze nazywana jest:"}'::jsonb,
  '[{"id":"o0","text":"antropopresją"},{"id":"o1","text":"sukcesją"},{"id":"o2","text":"recyrkulacją"},{"id":"o3","text":"detoksykacją"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Przedrostek \"antropo-\" odnosi się do człowieka."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'czlowiek-a-srodowisko'),
  'mc', 2, 1,
  '{"statement": "Rozwój zaspokajający potrzeby obecnego pokolenia bez ograniczania możliwości zaspokajania potrzeb przyszłych pokoleń nazywamy rozwojem:"}'::jsonb,
  '[{"id":"o0","text":"intensywnym"},{"id":"o1","text":"zrównoważonym"},{"id":"o2","text":"ekstensywnym"},{"id":"o3","text":"liniowym"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["To pojęcie pojawiło się w raporcie \"Nasza wspólna przyszłość\" (Brundtland, 1987)."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XIV. Regionalne zróżnicowanie środowiska przyrodniczego Polski
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'srodowisko-przyrodnicze-polski'),
  'mc', 1, 1,
  '{"statement": "Najwyższym szczytem Polski są:"}'::jsonb,
  '[{"id":"o0","text":"Śnieżka"},{"id":"o1","text":"Rysy"},{"id":"o2","text":"Babia Góra"},{"id":"o3","text":"Giewont"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Ten szczyt leży w Tatrach, blisko granicy ze Słowacją."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'srodowisko-przyrodnicze-polski'),
  'mc', 2, 1,
  '{"statement": "Pas pojezierzy w północnej Polsce (np. Pojezierze Mazurskie) powstał głównie w wyniku działalności:"}'::jsonb,
  '[{"id":"o0","text":"wiatru (procesów eolicznych)"},{"id":"o1","text":"lądolodu (zlodowaceń)"},{"id":"o2","text":"rzek górskich"},{"id":"o3","text":"wulkanów"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Jeziora te powstały w zagłębieniach pozostawionych przez wycofujący się lód."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XV. Społeczeństwo i gospodarka Polski
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'spoleczenstwo-i-gospodarka-polski'),
  'mc', 1, 1,
  '{"statement": "Stolicą Polski i jej największym miastem jest:"}'::jsonb,
  '[{"id":"o0","text":"Kraków"},{"id":"o1","text":"Warszawa"},{"id":"o2","text":"Łódź"},{"id":"o3","text":"Wrocław"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["To miasto leży nad Wisłą, w centralnej Polsce."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'spoleczenstwo-i-gospodarka-polski'),
  'mc', 2, 1,
  '{"statement": "Region Polski, który historycznie stał się głównym ośrodkiem górnictwa węgla i przemysłu ciężkiego, to:"}'::jsonb,
  '[{"id":"o0","text":"Polesie"},{"id":"o1","text":"Górny Śląsk"},{"id":"o2","text":"Bieszczady"},{"id":"o3","text":"Żuławy Wiślane"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["To region na południu Polski, graniczący z Czechami."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XVI. Morze Bałtyckie i gospodarka morska Polski
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'morze-baltyckie'),
  'mc', 2, 1,
  '{"statement": "Morze Bałtyckie jest morzem:"}'::jsonb,
  '[{"id":"o0","text":"otwartym, oceanicznym, o wysokim zasoleniu"},{"id":"o1","text":"śródlądowym (wewnętrznym), o niskim zasoleniu"},{"id":"o2","text":"martwym, bez życia biologicznego"},{"id":"o3","text":"ciepłym morzem tropikalnym"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Wymiana wody z Oceanem Atlantyckim jest bardzo ograniczona przez wąskie cieśniny duńskie."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'morze-baltyckie'),
  'mc', 1, 1,
  '{"statement": "Niskie zasolenie wód Bałtyku wynika głównie z:"}'::jsonb,
  '[{"id":"o0","text":"dużego dopływu wód rzecznych i ograniczonej wymiany wód z oceanem"},{"id":"o1","text":"bliskości bieguna północnego"},{"id":"o2","text":"braku parowania wody"},{"id":"o3","text":"wysokiej temperatury wody"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Do Bałtyku wpada wiele dużych rzek (Wisła, Odra, Newa i inne)."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XVII. Strefowość środowiska przyrodniczego na Ziemi
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'strefowosc-przyrodnicza'),
  'mc', 2, 1,
  '{"statement": "Astrefowe zróżnicowanie środowiska przyrodniczego (np. piętrowość klimatyczno-roślinna w górach) jest spowodowane głównie:"}'::jsonb,
  '[{"id":"o0","text":"szerokością geograficzną"},{"id":"o1","text":"wysokością nad poziomem morza"},{"id":"o2","text":"długością geograficzną"},{"id":"o3","text":"odległością od równika"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Piętra klimatyczno-roślinne w Tatrach zmieniają się wraz z wysokością, nie z szerokością geograficzną."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'strefowosc-przyrodnicza'),
  'mc', 1, 1,
  '{"statement": "Strefa klimatyczno-roślinna z bezleśną roślinnością (mchy, porosty) i wieczną zmarzliną to:"}'::jsonb,
  '[{"id":"o0","text":"strefa równikowa"},{"id":"o1","text":"strefa zwrotnikowa"},{"id":"o2","text":"tundra"},{"id":"o3","text":"strefa umiarkowana ciepła"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["Ta strefa leży między lasami borealnymi (tajgą) a wiecznymi lodami."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XVIII. Problemy środowiskowe współczesnego świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'problemy-srodowiskowe-swiata'),
  'mc', 1, 1,
  '{"statement": "Wzrost stężenia gazów takich jak CO2 w atmosferze, prowadzący do wzrostu średniej temperatury Ziemi, to:"}'::jsonb,
  '[{"id":"o0","text":"efekt cieplarniany"},{"id":"o1","text":"dziura ozonowa"},{"id":"o2","text":"eutrofizacja"},{"id":"o3","text":"smog fotochemiczny"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["To pojęcie różni się od dziury ozonowej, choć obie sprawy bywają mylone."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'problemy-srodowiskowe-swiata'),
  'mc', 2, 1,
  '{"statement": "Zanik warstwy ozonowej w stratosferze, zwiększający natężenie promieniowania UV docierającego do powierzchni Ziemi, nazywamy:"}'::jsonb,
  '[{"id":"o0","text":"dziurą ozonową"},{"id":"o1","text":"kwaśnym deszczem"},{"id":"o2","text":"inwersją temperatury"},{"id":"o3","text":"erozją glebową"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Zjawisko to jest szczególnie widoczne nad Antarktydą."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XIX. Uwarunkowania przyrodnicze gospodarczej działalności człowieka
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'uwarunkowania-przyrodnicze-gospodarki'),
  'mc', 1, 1,
  '{"statement": "Żyzne gleby (np. czarnoziemy) i klimat umiarkowany ciepły to uwarunkowania przyrodnicze korzystne szczególnie dla rozwoju:"}'::jsonb,
  '[{"id":"o0","text":"rolnictwa"},{"id":"o1","text":"górnictwa głębinowego"},{"id":"o2","text":"przemysłu ciężkiego"},{"id":"o3","text":"rybołówstwa dalekomorskiego"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Czarnoziemy to jedne z najżyźniejszych gleb na świecie."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'uwarunkowania-przyrodnicze-gospodarki'),
  'mc', 2, 1,
  '{"statement": "Obecność wysokich gór z trwałą pokrywą śnieżną i dobrym nasłonecznieniem sprzyja szczególnie rozwojowi turystyki:"}'::jsonb,
  '[{"id":"o0","text":"narciarskiej (górskiej zimowej)"},{"id":"o1","text":"nadmorskiej"},{"id":"o2","text":"miejskiej"},{"id":"o3","text":"pielgrzymkowej na równinach"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Przykładem takich regionów są Alpy."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XX. Problemy polityczne współczesnego świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'problemy-polityczne-swiata'),
  'mc', 2, 1,
  '{"statement": "Państwo, w którym instytucje rządowe utraciły kontrolę nad częścią lub całością terytorium i nie zapewniają podstawowych funkcji (bezpieczeństwa, prawa), nazywamy państwem:"}'::jsonb,
  '[{"id":"o0","text":"upadłym"},{"id":"o1","text":"neutralnym"},{"id":"o2","text":"federalnym"},{"id":"o3","text":"buforowym"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Termin ten (z ang. \"failed state\") opisuje głęboki kryzys władzy państwowej."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'problemy-polityczne-swiata'),
  'mc', 1, 1,
  '{"statement": "Osoby zmuszone do opuszczenia swojego kraju z powodu prześladowań, wojny lub konfliktu i szukające ochrony w innym kraju, to:"}'::jsonb,
  '[{"id":"o0","text":"emigranci ekonomiczni"},{"id":"o1","text":"uchodźcy"},{"id":"o2","text":"turyści"},{"id":"o3","text":"repatrianci"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Emigranci ekonomiczni wyjeżdżają dobrowolnie w poszukiwaniu pracy, nie z powodu zagrożenia życia."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XXI. Wybrane problemy społeczne współczesnego świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'problemy-spoleczne-swiata'),
  'mc', 1, 1,
  '{"statement": "Zjawisko niedostatecznego spożycia kalorii i składników odżywczych, dotykające wielu krajów Afryki Subsaharyjskiej, to:"}'::jsonb,
  '[{"id":"o0","text":"niedożywienie"},{"id":"o1","text":"otyłość"},{"id":"o2","text":"nadprodukcja żywności"},{"id":"o3","text":"eutrofizacja"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["To dokładne przeciwieństwo otyłości."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'problemy-spoleczne-swiata'),
  'mc', 2, 1,
  '{"statement": "Proces zwiększania się udziału osób starszych w strukturze wieku społeczeństwa nazywamy:"}'::jsonb,
  '[{"id":"o0","text":"starzeniem się społeczeństwa"},{"id":"o1","text":"eksplozją demograficzną"},{"id":"o2","text":"feminizacją"},{"id":"o3","text":"urbanizacją"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["To zjawisko jest szczególnie widoczne w krajach wysoko rozwiniętych, np. w Japonii."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XXII. Zróżnicowanie jakości życia w wybranych regionach i krajach świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'jakosc-zycia-na-swiecie'),
  'mc', 1, 1,
  '{"statement": "Wysoki wskaźnik HDI (bliski 1) oznacza, że w danym kraju przeciętnie mieszkańcy:"}'::jsonb,
  '[{"id":"o0","text":"żyją dłużej, są lepiej wykształceni i mają wyższy dochód"},{"id":"o1","text":"żyją w warunkach wysokiego zanieczyszczenia powietrza"},{"id":"o2","text":"mieszkają przy bardzo dużej gęstości zaludnienia"},{"id":"o3","text":"pracują głównie w rolnictwie samozaopatrzeniowym"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["HDI łączy trzy wymiary: zdrowie/długość życia, edukację i dochód."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'jakosc-zycia-na-swiecie'),
  'mc', 2, 1,
  '{"statement": "Kraje o najniższej jakości życia mierzonej wskaźnikiem HDI znajdują się najczęściej w:"}'::jsonb,
  '[{"id":"o0","text":"Europie Zachodniej"},{"id":"o1","text":"Ameryce Północnej"},{"id":"o2","text":"Afryce Subsaharyjskiej"},{"id":"o3","text":"Azji Wschodniej"}]'::jsonb,
  '{"correctOptionIds":["o2"]}'::jsonb,
  '["Region ten obejmuje kraje na południe od Sahary."]'::jsonb,
  'built_in'
);

-- ----------------------------------------------------------------------------
-- XXIII. Problemy gospodarcze współczesnego świata
-- ----------------------------------------------------------------------------
insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, options, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'problemy-gospodarcze-swiata'),
  'mc', 2, 1,
  '{"statement": "Sytuacja, w której zobowiązania finansowe państwa przewyższają jego możliwości spłaty, to problem:"}'::jsonb,
  '[{"id":"o0","text":"nadwyżki budżetowej"},{"id":"o1","text":"zadłużenia (długu publicznego)"},{"id":"o2","text":"deflacji"},{"id":"o3","text":"protekcjonizmu"}]'::jsonb,
  '{"correctOptionIds":["o1"]}'::jsonb,
  '["Nadwyżka budżetowa to sytuacja odwrotna."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'problemy-gospodarcze-swiata'),
  'mc', 1, 1,
  '{"statement": "Gospodarka, w której głównym czynnikiem wzrostu są innowacje, badania naukowe i wysoko wykwalifikowana kadra, a nie surowce, nazywana jest gospodarką:"}'::jsonb,
  '[{"id":"o0","text":"opartą na wiedzy"},{"id":"o1","text":"plantacyjną"},{"id":"o2","text":"samozaopatrzeniową"},{"id":"o3","text":"nakazowo-rozdzielczą"}]'::jsonb,
  '{"correctOptionIds":["o0"]}'::jsonb,
  '["Ten typ gospodarki dominuje np. w sektorze IT i biotechnologii."]'::jsonb,
  'built_in'
);

-- ============================================================================
-- A handful of open-answer exercises (self-assessed by the student against
-- the model answer + rubric — see lib/geografia/grading.ts).
-- ============================================================================

insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, correct_answer, hints, source)
values (
  (select id from geo_topics where slug = 'litosfera'),
  'open', 2, 2,
  '{"statement": "Wyjaśnij, dlaczego na granicach płyt litosfery dochodzi do częstych trzęsień ziemi i wulkanizmu."}'::jsonb,
  '{"modelAnswer": "Na granicach płyt litosfery płyty przemieszczają się względem siebie (rozsuwają się, zderzają lub przesuwają wzdłuż siebie), co generuje w skałach ogromne naprężenia. Ich nagłe uwolnienie wywołuje trzęsienia ziemi, a przy granicach zbieżnych (subdukcja jednej płyty pod drugą) stopiona skała wznosi się i wypływa na powierzchnię jako magma, tworząc wulkany — dlatego np. wokół Pacyfiku (Pacyficzny Pierścień Ognia) obie te formy aktywności występują razem.", "rubric": ["Wskazanie, że granice płyt to miejsca naprężeń/tarcia przy ich względnym przemieszczaniu się", "Powiązanie typu granicy (zbieżna/rozbieżna/transformująca) z odpowiednim procesem (subdukcja, ryft, przesuwanie)", "Podanie konkretnego przykładu regionu (np. Pacyficzny Pierścień Ognia, Himalaje, Ryft Wschodnioafrykański)"]}'::jsonb,
  '["Rozważ, co dzieje się fizycznie ze skałami, gdy dwie ogromne płyty próbują się przemieszczać względem siebie."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'atmosfera'),
  'open', 2, 2,
  '{"statement": "Wyjaśnij mechanizm powstawania wiatru."}'::jsonb,
  '{"modelAnswer": "Wiatr powstaje w wyniku różnic w ogrzaniu powierzchni Ziemi przez Słońce, co prowadzi do różnic w ciśnieniu atmosferycznym między poszczególnymi obszarami. Powietrze przemieszcza się z obszarów wysokiego ciśnienia do obszarów niskiego ciśnienia, tworząc wiatr — a na wielkoskalowych wiatrach (np. pasatach) na jego kierunek dodatkowo wpływa siła Coriolisa, wynikająca z ruchu obrotowego Ziemi.", "rubric": ["Odniesienie do różnic w ogrzaniu powierzchni Ziemi i wynikających z nich różnic ciśnienia atmosferycznego", "Wskazanie, że powietrze przemieszcza się z obszaru wysokiego do niskiego ciśnienia", "Wzmianka o wpływie siły Coriolisa na kierunek wiatru w skali globalnej"]}'::jsonb,
  '["Zacznij od tego, co powoduje różnice ciśnienia atmosferycznego między dwoma miejscami."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'demografia-i-osadnictwo'),
  'open', 1, 2,
  '{"statement": "Wymień i krótko opisz dwie przyczyny migracji ludności."}'::jsonb,
  '{"modelAnswer": "Przyczyny ekonomiczne — ludzie migrują w poszukiwaniu lepiej płatnej pracy lub wyższego standardu życia, gdy w regionie pochodzenia panuje bezrobocie lub niskie zarobki. Przyczyny polityczne/wojenne — ludzie opuszczają swój kraj z powodu konfliktów zbrojnych, prześladowań lub niestabilności politycznej, szukając bezpieczeństwa w innym kraju.", "rubric": ["Poprawnie opisana przyczyna ekonomiczna migracji", "Poprawnie opisana inna przyczyna migracji (np. polityczna, wojenna, środowiskowa lub rodzinna)"]}'::jsonb,
  '["Pomyśl o różnicy między migracją dobrowolną a wymuszoną."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'problemy-srodowiskowe-swiata'),
  'open', 2, 2,
  '{"statement": "Wyjaśnij, w jaki sposób wzrost emisji gazów cieplarnianych prowadzi do globalnego wzrostu temperatury (efekt cieplarniany)."}'::jsonb,
  '{"modelAnswer": "Gazy cieplarniane (np. CO2, metan) w atmosferze przepuszczają promieniowanie słoneczne docierające do powierzchni Ziemi, ale zatrzymują część promieniowania cieplnego (podczerwonego) wypromieniowywanego z powrotem przez powierzchnię Ziemi. Im wyższa koncentracja tych gazów w atmosferze, tym więcej ciepła jest zatrzymywane, co prowadzi do wzrostu średniej temperatury przy powierzchni Ziemi.", "rubric": ["Wskazanie, że gazy cieplarniane zatrzymują promieniowanie cieplne wypromieniowywane przez Ziemię", "Powiązanie wzrostu koncentracji tych gazów (np. z działalności człowieka) ze wzrostem zatrzymywanego ciepła", "Wniosek, że skutkiem jest wzrost średniej temperatury na Ziemi"]}'::jsonb,
  '["Zastanów się, co się dzieje z ciepłem, które Ziemia normalnie wypromieniowuje z powrotem w kosmos."]'::jsonb,
  'built_in'
), (
  (select id from geo_topics where slug = 'spoleczenstwo-i-gospodarka-polski'),
  'open', 1, 2,
  '{"statement": "Wymień dwa czynniki, które przyczyniły się do rozwoju przemysłu na Górnym Śląsku."}'::jsonb,
  '{"modelAnswer": "Bogate złoża węgla kamiennego, które od XIX wieku stały się podstawą energetyczną i surowcową dla hutnictwa i przemysłu ciężkiego. Duża, dostępna siła robocza wynikająca z gęstego zaludnienia regionu oraz dobrze rozwinięta infrastruktura transportowa (linie kolejowe), ułatwiająca transport surowców i wyrobów.", "rubric": ["Poprawnie wskazany czynnik surowcowy (złoża węgla kamiennego)", "Poprawnie wskazany inny czynnik (siła robocza, infrastruktura transportowa lub tradycje przemysłowe regionu)"]}'::jsonb,
  '["Pomyśl, jaki surowiec mineralny historycznie kojarzy się z tym regionem."]'::jsonb,
  'built_in'
);

-- ============================================================================
-- Map-point exercises (5 total, confident real-world coordinates, generous
-- tolerance given how imprecise a tap/click on a small map is). Each is
-- inserted via a CTE so the exercise id is available for the matching
-- geo_map_tasks row without a separate lookup query.
-- ============================================================================

with new_ex as (
  insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, hints, source)
  values (
    (select id from geo_topics where slug = 'litosfera'),
    'map', 2, 2,
    '{"statement": "Zaznacz na mapie Mount Everest — najwyższy szczyt Ziemi (Himalaje)."}'::jsonb,
    '["Himalaje leżą na granicy Nepalu i Chin (Tybetu)."]'::jsonb,
    'built_in'
  )
  returning id
)
insert into geo_map_tasks (exercise_id, interaction_type, input_data, correct_answer, feedback_description)
select id, 'point',
  '{"center":[30,70],"zoom":3}'::jsonb,
  '{"lat":27.9881,"lng":86.9250,"toleranceKm":150}'::jsonb,
  'Mount Everest (8849 m n.p.m.) leży na granicy Nepalu i Chin.'
from new_ex;

with new_ex as (
  insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, hints, source)
  values (
    (select id from geo_topics where slug = 'hydrosfera'),
    'map', 2, 2,
    '{"statement": "Zaznacz na mapie ujście Nilu do Morza Śródziemnego (delta Nilu)."}'::jsonb,
    '["To najdłuższa rzeka Afryki, uchodząca w Egipcie."]'::jsonb,
    'built_in'
  )
  returning id
)
insert into geo_map_tasks (exercise_id, interaction_type, input_data, correct_answer, feedback_description)
select id, 'point',
  '{"center":[20,20],"zoom":3}'::jsonb,
  '{"lat":31.35,"lng":31.5,"toleranceKm":120}'::jsonb,
  'Delta Nilu znajduje się na wybrzeżu Egiptu, w pobliżu Rosetty i Damietty.'
from new_ex;

with new_ex as (
  insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, hints, source)
  values (
    (select id from geo_topics where slug = 'morze-baltyckie'),
    'map', 1, 1,
    '{"statement": "Zaznacz na mapie Gdańsk — jeden z największych polskich portów morskich."}'::jsonb,
    '["To miasto leży w ujściu Wisły do Bałtyku."]'::jsonb,
    'built_in'
  )
  returning id
)
insert into geo_map_tasks (exercise_id, interaction_type, input_data, correct_answer, feedback_description)
select id, 'point',
  '{"center":[54,19],"zoom":6}'::jsonb,
  '{"lat":54.35,"lng":18.65,"toleranceKm":60}'::jsonb,
  'Gdańsk leży na wybrzeżu Zatoki Gdańskiej.'
from new_ex;

with new_ex as (
  insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, hints, source)
  values (
    (select id from geo_topics where slug = 'srodowisko-przyrodnicze-polski'),
    'map', 2, 2,
    '{"statement": "Zaznacz na mapie Rysy — najwyższy szczyt Polski, w Tatrach."}'::jsonb,
    '["Tatry leżą na południu Polski, na granicy ze Słowacją."]'::jsonb,
    'built_in'
  )
  returning id
)
insert into geo_map_tasks (exercise_id, interaction_type, input_data, correct_answer, feedback_description)
select id, 'point',
  '{"center":[50,20],"zoom":7}'::jsonb,
  '{"lat":49.1793,"lng":20.0881,"toleranceKm":40}'::jsonb,
  'Rysy (2499 m n.p.m.) leżą w Tatrach Wysokich.'
from new_ex;

with new_ex as (
  insert into geo_exercises (topic_id, type, difficulty, points_max, prompt, hints, source)
  values (
    (select id from geo_topics where slug = 'strefowosc-przyrodnicza'),
    'map', 3, 1,
    '{"statement": "Zaznacz na mapie Quito — stolicę Ekwadoru, leżącą niemal na równiku."}'::jsonb,
    '["Ekwador leży w Ameryce Południowej, nad Oceanem Spokojnym."]'::jsonb,
    'built_in'
  )
  returning id
)
insert into geo_map_tasks (exercise_id, interaction_type, input_data, correct_answer, feedback_description)
select id, 'point',
  '{"center":[0,-60],"zoom":3}'::jsonb,
  '{"lat":-0.1807,"lng":-78.4678,"toleranceKm":150}'::jsonb,
  'Quito leży w Andach, blisko równika, na wysokości ok. 2850 m n.p.m.'
from new_ex;
