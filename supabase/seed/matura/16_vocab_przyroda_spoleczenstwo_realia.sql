-- ============================================================================
-- supabase/seed/matura/16_vocab_przyroda_spoleczenstwo_realia.sql
-- English vocabulary: Świat przyrody, Życie społeczne, Kraje anglojęzyczne.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
--
-- The last block is realioznawstwo — facts about the English-speaking world
-- rather than vocabulary in the usual sense, filed here because that is where
-- a student goes looking for it, and because the terms do turn up as words in
-- reading and listening texts.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'en' and slug in ('swiat-przyrody', 'zycie-spoleczne', 'realioznawstwo')
);

-- ----------------------------------------------------------------------------
-- 13. Świat przyrody
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'swiat-przyrody') t,
(values
  ('podstawowa','weather','rz.','pogoda','The weather has been awful.','Pogoda była okropna.','NIEPOLICZALNE: nigdy „weathers”, nigdy „a weather”.',1),
  ('podstawowa','forecast','rz.','prognoza','The forecast says it will rain.','Prognoza mówi, że będzie padać.','weather forecast = prognoza pogody.',2),
  ('podstawowa','shower','rz.','przelotny deszcz','Scattered showers are expected.','Spodziewane są przelotne opady.','Też: prysznic.',3),
  ('podstawowa','freezing','przym.','bardzo zimno','It is absolutely freezing outside.','Na dworze jest strasznie zimno.','freeze = zamarzać. boiling = bardzo gorąco.',4),
  ('podstawowa','mild','przym.','łagodny','We had a mild winter.','Mieliśmy łagodną zimę.','Przeciwieństwo: severe, harsh.',5),
  ('podstawowa','countryside','rz.','wieś, tereny wiejskie','I grew up in the countryside.','Dorastałem na wsi.','IN the countryside — z rodzajnikiem.',6),
  ('podstawowa','forest','rz.','las','The forest covers the whole valley.','Las pokrywa całą dolinę.','wood/woods = mniejszy las.',7),
  ('podstawowa','field','rz.','pole','The fields were covered in snow.','Pola były pokryte śniegiem.','be covered IN/WITH something.',8),
  ('podstawowa','species','rz.','gatunek','This species is under threat.','Ten gatunek jest zagrożony.','TA SAMA forma w l.poj. i l.mn. — nigdy „specie”.',9),
  ('podstawowa','wildlife','rz.','dzika przyroda','The park protects local wildlife.','Park chroni lokalną przyrodę.','Niepoliczalne.',10),
  ('podstawowa','endangered','przym.','zagrożony wyginięciem','Pandas are an endangered species.','Pandy to gatunek zagrożony.','endangered species — utrwal jako całość.',11),
  ('podstawowa','pollution','rz.','zanieczyszczenie','Air pollution is a serious issue.','Zanieczyszczenie powietrza to poważny problem.','pollute = zanieczyszczać. Niepoliczalne.',12),
  ('podstawowa','litter','rz.','śmieci (porzucone)','Do not drop litter in the park.','Nie śmieć w parku.','rubbish/waste = odpady ogólnie; USA: trash, garbage.',13),
  ('podstawowa','recycle','cz.','poddawać recyklingowi','We recycle paper and glass.','Segregujemy papier i szkło.','recycling = recykling.',14),
  ('podstawowa','waste','rz./cz.','odpady, marnować','Do not waste water.','Nie marnuj wody.','a waste of time = strata czasu.',15),
  ('podstawowa','environment','rz.','środowisko','We must protect the environment.','Musimy chronić środowisko.','THE environment — zawsze z rodzajnikiem.',16),
  ('rozszerzona','climate change','zwrot','zmiana klimatu','Climate change is already visible.','Zmiana klimatu jest już widoczna.','Najczęstszy temat rozprawki na rozszerzeniu.',17),
  ('rozszerzona','global warming','zwrot','globalne ocieplenie','Global warming is melting the glaciers.','Globalne ocieplenie topi lodowce.','melt = topnieć; glacier = lodowiec.',18),
  ('rozszerzona','greenhouse gases','zwrot','gazy cieplarniane','Greenhouse gases trap heat.','Gazy cieplarniane zatrzymują ciepło.','trap = zatrzymywać, uwięzić.',19),
  ('rozszerzona','drought','rz.','susza','The drought lasted all summer.','Susza trwała całe lato.','Wymowa: „draut”.',20),
  ('rozszerzona','flood','rz./cz.','powódź, zalewać','Floods destroyed several villages.','Powodzie zniszczyły kilka wsi.','Wymowa: „flad”.',21),
  ('rozszerzona','wildfire','rz.','pożar lasu','Wildfires are becoming more frequent.','Pożary lasów są coraz częstsze.','spread like wildfire = rozprzestrzeniać się błyskawicznie.',22),
  ('rozszerzona','natural resources','zwrot','zasoby naturalne','Natural resources are not infinite.','Zasoby naturalne nie są nieskończone.','Kluczowy zwrot w argumentacji ekologicznej.',23),
  ('rozszerzona','renewable energy','zwrot','energia odnawialna','Renewable energy is getting cheaper.','Energia odnawialna tanieje.','renewable = odnawialny.',24),
  ('rozszerzona','sustainable','przym.','zrównoważony','We need a sustainable approach.','Potrzebujemy zrównoważonego podejścia.','sustainability = zrównoważony rozwój. Bardzo wysoko punktowane.',25),
  ('rozszerzona','carbon footprint','zwrot','ślad węglowy','Flying increases your carbon footprint.','Latanie zwiększa twój ślad węglowy.','Bardzo częste w tekstach o ekologii.',26),
  ('rozszerzona','single-use plastic','zwrot','plastik jednorazowy','Single-use plastic should be banned.','Plastik jednorazowy powinien być zakazany.','ban = zakazywać.',27),
  ('rozszerzona','raise awareness','zwrot','podnosić świadomość','Campaigns raise awareness of the problem.','Kampanie podnoszą świadomość problemu.','awareness OF something. Świetne w rozprawce.',28)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 14. Życie społeczne
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'zycie-spoleczne') t,
(values
  ('podstawowa','society','rz.','społeczeństwo','Society has changed a great deal.','Społeczeństwo bardzo się zmieniło.','a great deal = bardzo, znacznie.',1),
  ('podstawowa','community','rz.','społeczność','The local community organised the event.','Lokalna społeczność zorganizowała wydarzenie.','Bardzo częste w tekstach o życiu społecznym.',2),
  ('podstawowa','people','rz.','ludzie','People here are very friendly.','Ludzie tutaj są bardzo mili.','Zawsze liczba mnoga: people ARE. „Peoples” to narody.',3),
  ('podstawowa','charity','rz.','organizacja dobroczynna','She works for a children charity.','Pracuje dla organizacji pomagającej dzieciom.','charity work = działalność dobroczynna.',4),
  ('podstawowa','volunteer','rz./cz.','wolontariusz','He volunteers at a shelter.','Pracuje jako wolontariusz w schronisku.','volunteering = wolontariat.',5),
  ('podstawowa','crime','rz.','przestępstwo','Crime has fallen in recent years.','Przestępczość spadła w ostatnich latach.','commit a crime = popełnić przestępstwo.',6),
  ('podstawowa','the law','rz.','prawo','The new law comes into force in June.','Nowe prawo wchodzi w życie w czerwcu.','come into force = wchodzić w życie.',7),
  ('podstawowa','government','rz.','rząd','The government announced new measures.','Rząd ogłosił nowe działania.','measure = środek, działanie.',8),
  ('podstawowa','election','rz.','wybory','The election takes place in October.','Wybory odbędą się w październiku.','take place = odbywać się. vote = głosować.',9),
  ('podstawowa','protest','rz./cz.','protest','Thousands joined the protest.','Tysiące dołączyły do protestu.','protest AGAINST something.',10),
  ('podstawowa','rights','rz.','prawa','Everyone has the right to education.','Każdy ma prawo do edukacji.','the right TO something.',11),
  ('rozszerzona','inequality','rz.','nierówność','Income inequality keeps growing.','Nierówności dochodowe wciąż rosną.','income = dochód. equality = równość.',12),
  ('rozszerzona','poverty','rz.','ubóstwo','Child poverty remains high.','Ubóstwo dzieci pozostaje wysokie.','live in poverty = żyć w ubóstwie.',13),
  ('rozszerzona','immigration','rz.','imigracja','Immigration has transformed British cities.','Imigracja przekształciła brytyjskie miasta.','immigrant = imigrant; emigrate = emigrować.',14),
  ('rozszerzona','discrimination','rz.','dyskryminacja','Discrimination at work is illegal.','Dyskryminacja w pracy jest nielegalna.','discriminate AGAINST somebody.',15),
  ('rozszerzona','prejudice','rz.','uprzedzenie','We must fight prejudice.','Musimy zwalczać uprzedzenia.','FAŁSZYWY PRZYJACIEL: nie „przesąd” (superstition).',16),
  ('rozszerzona','ageing population','zwrot','starzejące się społeczeństwo','An ageing population strains the health system.','Starzejące się społeczeństwo obciąża system zdrowia.','Pisownia amerykańska: aging.',17),
  ('rozszerzona','birth rate','zwrot','wskaźnik urodzeń','The birth rate has fallen sharply.','Wskaźnik urodzeń mocno spadł.','Częsty temat tekstów o demografii.',18),
  ('rozszerzona','unemployment rate','zwrot','stopa bezrobocia','Youth unemployment remains a problem.','Bezrobocie wśród młodych pozostaje problemem.','youth unemployment = bezrobocie młodych.',19),
  ('rozszerzona','freedom of speech','zwrot','wolność słowa','Freedom of speech has its limits.','Wolność słowa ma swoje granice.','Częsty temat rozprawki.',20),
  ('rozszerzona','tackle a problem','zwrot','zmierzyć się z problemem','Governments must tackle the problem.','Rządy muszą zmierzyć się z tym problemem.','TACKLE, address, deal with — świetne czasowniki w rozprawce.',21),
  ('rozszerzona','raise concerns','zwrot','budzić obawy','The report raised serious concerns.','Raport wzbudził poważne obawy.','concern = obawa, troska.',22),
  ('rozszerzona','in the long run','zwrot','na dłuższą metę','In the long run it will pay off.','Na dłuższą metę to się opłaci.','pay off = opłacić się. Świetne w rozprawce.',23),
  ('rozszerzona','bridge the gap','zwrot','zniwelować różnicę','Education can bridge the gap.','Edukacja może zniwelować tę różnicę.','Idiom bardzo dobrze punktowany.',24)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 15. Kraje anglojęzyczne (realioznawstwo)
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'realioznawstwo') t,
(values
  ('podstawowa','the United Kingdom','zwrot','Zjednoczone Królestwo','The United Kingdom has four nations.','Zjednoczone Królestwo składa się z czterech krajów.','UK = Anglia, Szkocja, Walia, Irlandia Płn. Great Britain to tylko wyspa.',1),
  ('podstawowa','Great Britain','zwrot','Wielka Brytania','Great Britain is an island.','Wielka Brytania to wyspa.','NIE to samo co UK — bez Irlandii Północnej. Częsta pułapka.',2),
  ('podstawowa','the Queen','rz.','królowa','The monarch is head of state.','Monarcha jest głową państwa.','Od 2022 roku: the King. monarchy = monarchia.',3),
  ('podstawowa','Parliament','rz.','parlament','Parliament meets in Westminster.','Parlament obraduje w Westminsterze.','House of Commons / House of Lords.',4),
  ('podstawowa','pound','rz.','funt','Prices are in pounds, not euros.','Ceny są w funtach, nie w euro.','Symbol: GBP. USA: dollar.',5),
  ('podstawowa','Thanksgiving','rz.','Święto Dziękczynienia','Thanksgiving is in November.','Święto Dziękczynienia jest w listopadzie.','Wyłącznie amerykańskie (i kanadyjskie).',6),
  ('podstawowa','Halloween','rz.','Halloween','Children go trick-or-treating.','Dzieci chodzą po domach po słodycze.','trick or treat = cukierek albo psikus.',7),
  ('podstawowa','Boxing Day','zwrot','drugi dzień świąt','Boxing Day is 26th December.','Boxing Day to 26 grudnia.','Brytyjskie; nie ma nic wspólnego z boksem.',8),
  ('podstawowa','the Union Jack','zwrot','flaga brytyjska','The Union Jack combines three crosses.','Union Jack łączy trzy krzyże.','Nazwa własna flagi Zjednoczonego Królestwa.',9),
  ('rozszerzona','British English','zwrot','angielszczyzna brytyjska','British English uses lift, not elevator.','W brytyjskim mówi się lift, nie elevator.','Różnice leksykalne bywają testowane w środkach językowych.',10),
  ('rozszerzona','American English','zwrot','angielszczyzna amerykańska','American English drops the u in colour.','W amerykańskim pisze się color, bez u.','Pisownia: -our/-or, -re/-er, -ise/-ize.',11),
  ('rozszerzona','the Commonwealth','rz.','Wspólnota Narodów','The Commonwealth has over fifty members.','Wspólnota Narodów liczy ponad pięćdziesięciu członków.','Dawne kolonie brytyjskie.',12),
  ('rozszerzona','devolution','rz.','przekazanie kompetencji','Devolution gave Scotland its own parliament.','Dewolucja dała Szkocji własny parlament.','Kluczowe pojęcie polityki brytyjskiej.',13),
  ('rozszerzona','Brexit','rz.','Brexit','Brexit changed travel rules.','Brexit zmienił zasady podróżowania.','Od Britain + exit. Wyjście z UE w 2020 roku.',14),
  ('rozszerzona','the melting pot','zwrot','tygiel kulturowy','The US is often called a melting pot.','USA nazywa się często tyglem kulturowym.','Alternatywna metafora: salad bowl.',15),
  ('rozszerzona','the Fourth of July','zwrot','Święto Niepodległości USA','The Fourth of July is celebrated with fireworks.','Czwarty lipca świętuje się fajerwerkami.','Independence Day. fireworks = fajerwerki.',16),
  ('rozszerzona','small talk','zwrot','rozmowa o niczym','Small talk about the weather is a British habit.','Rozmowa o pogodzie to brytyjski zwyczaj.','Brak zwięzłego polskiego odpowiednika.',17),
  ('rozszerzona','queueing','rz.','stanie w kolejce','Queueing is taken seriously in Britain.','W Brytanii kolejki traktuje się poważnie.','Stereotyp kulturowy, ale trafny — częsty w tekstach.',18),
  ('rozszerzona','the stiff upper lip','zwrot','powściągliwość w trudnych chwilach','The stiff upper lip is a British stereotype.','Powściągliwość to brytyjski stereotyp.','Idiom kulturowy — dobrze świadczy o zakresie środków.',19)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
