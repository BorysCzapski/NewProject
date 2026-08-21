-- ============================================================================
-- supabase/seed/matura/12_vocab_czlowiek_dom_edukacja.sql
-- English vocabulary for the first three thematic blocks: Człowiek, Miejsce
-- zamieszkania, Edukacja. Run 11_vocab_topics.sql first.
--
-- `level` is the level FROM WHICH an entry is expected — a rozszerzona student
-- gets both slices, a podstawowa student only the first (0021_matura_theory.sql).
--
-- The `note` column carries what a translation pair cannot. For English that
-- means: collocations (make/do, take an exam), countability (advice, furniture,
-- news — no plural), prepositions the Polish translation hides (depend ON,
-- good AT), phrasal verbs, irregular forms, and the false friends Poles walk
-- into (actually, eventually, sympathetic, pension). Those decide marks in
-- środki językowe far more often than the headword does.
--
-- Structure mirrors ../matura-es/12_vocab_czlowiek_dom_edukacja.sql exactly —
-- same blocks, same slugs, same VALUES form.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'en' and slug in ('czlowiek', 'miejsce-zamieszkania', 'edukacja')
);

-- ----------------------------------------------------------------------------
-- 1. Człowiek
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'czlowiek') t,
(values
  ('podstawowa','surname','rz.','nazwisko','Please write your surname in capitals.','Napisz nazwisko wielkimi literami.','Amerykański odpowiednik: last name. Imię to first name / given name.',1),
  ('podstawowa','date of birth','zwrot','data urodzenia','My date of birth is 3rd May 2007.','Moja data urodzenia to 3 maja 2007.','Skrót w formularzach: DOB.',2),
  ('podstawowa','marital status','zwrot','stan cywilny','The form asks for your marital status.','Formularz pyta o stan cywilny.','single / married / divorced / widowed.',3),
  ('podstawowa','appearance','rz.','wygląd','She has changed her appearance completely.','Całkowicie zmieniła wygląd.','appear = wydawać się LUB pojawiać się.',4),
  ('podstawowa','good-looking','przym.','atrakcyjny','He is a good-looking young man.','To atrakcyjny młody człowiek.','Neutralne dla obu płci, w przeciwieństwie do handsome/pretty.',5),
  ('podstawowa','slim','przym.','szczupły','She is tall and slim.','Jest wysoka i szczupła.','slim jest komplementem, skinny raczej nie.',6),
  ('podstawowa','overweight','przym.','z nadwagą','Being overweight increases health risks.','Nadwaga zwiększa ryzyko zdrowotne.','Grzeczniejsze niż fat — ważne w wypowiedzi pisemnej.',7),
  ('podstawowa','curly','przym.','kręcony','She has long curly hair.','Ma długie kręcone włosy.','hair jest NIEPOLICZALNE: her hair IS, nie are.',8),
  ('podstawowa','straight','przym.','prosty (o włosach)','His hair is dark and straight.','Ma ciemne, proste włosy.','Kolejność przymiotników: długość - kolor - typ.',9),
  ('podstawowa','freckles','rz.','piegi','She has freckles on her nose.','Ma piegi na nosie.','Zawsze liczba mnoga.',10),
  ('podstawowa','beard','rz.','broda (zarost)','He grew a beard last winter.','Zapuścił brodę zeszłej zimy.','grow a beard = zapuścić brodę.',11),
  ('podstawowa','outgoing','przym.','towarzyski','She is outgoing and makes friends easily.','Jest towarzyska i łatwo zawiera znajomości.','make friends — z make, nie do.',12),
  ('podstawowa','shy','przym.','nieśmiały','He was very shy as a child.','Jako dziecko był bardzo nieśmiały.','Przeciwieństwo: confident.',13),
  ('podstawowa','hard-working','przym.','pracowity','She is a hard-working student.','To pracowita uczennica.','Z łącznikiem, gdy stoi przed rzeczownikiem.',14),
  ('podstawowa','lazy','przym.','leniwy','He is not stupid, just lazy.','Nie jest głupi, tylko leniwy.','laziness = lenistwo.',15),
  ('podstawowa','reliable','przym.','niezawodny, godny zaufania','She is the most reliable person I know.','To najbardziej godna zaufania osoba, jaką znam.','rely ON somebody = polegać na kimś.',16),
  ('podstawowa','generous','przym.','hojny','He is generous with his time.','Jest hojny, jeśli chodzi o czas.','generous WITH something.',17),
  ('podstawowa','selfish','przym.','samolubny','Do not be so selfish.','Nie bądź taki samolubny.','self = jaźń; stąd selfish, selfless.',18),
  ('podstawowa','cheerful','przym.','pogodny','She always sounds cheerful.','Zawsze brzmi pogodnie.','sound + przymiotnik = brzmieć jakoś.',19),
  ('podstawowa','upset','przym.','zdenerwowany, przygnębiony','She was upset about the results.','Była przygnębiona wynikami.','upset ABOUT something. Forma nieregularna: upset - upset - upset.',20),
  ('podstawowa','proud','przym.','dumny','My parents are proud of me.','Rodzice są ze mnie dumni.','proud OF something/somebody.',21),
  ('podstawowa','look like','zwrot','wyglądać jak','She looks like her mother.','Wygląda jak matka.','look LIKE + rzeczownik; look + przymiotnik (she looks tired).',22),
  ('podstawowa','take after','zwrot','wdać się w kogoś','He takes after his father.','Wdał się w ojca.','Phrasal verb o podobieństwie rodzinnym.',23),
  ('podstawowa','get on with','zwrot','dogadywać się z','I get on well with my sister.','Dobrze dogaduję się z siostrą.','W amerykańskim: get along with.',24),
  ('rozszerzona','trait','rz.','cecha','Patience is his best trait.','Cierpliwość to jego najlepsza cecha.','character trait = cecha charakteru.',25),
  ('rozszerzona','self-esteem','rz.','poczucie własnej wartości','Social media can damage self-esteem.','Media społecznościowe mogą szkodzić poczuciu własnej wartości.','Stały temat rozprawki o internecie.',26),
  ('rozszerzona','stubborn','przym.','uparty','He is too stubborn to apologise.','Jest zbyt uparty, żeby przeprosić.','too + przym. + to + bezokolicznik.',27),
  ('rozszerzona','considerate','przym.','uważający na innych','She is very considerate towards others.','Jest bardzo uważająca na innych.','NIE myl z considerable (znaczny).',28),
  ('rozszerzona','sympathetic','przym.','współczujący','The teacher was sympathetic to my problem.','Nauczyciel odniósł się ze zrozumieniem do mojego problemu.','FAŁSZYWY PRZYJACIEL: NIE znaczy „sympatyczny”. Sympatyczny to nice/likeable.',29),
  ('rozszerzona','outspoken','przym.','mówiący bez ogródek','She is outspoken about climate change.','Otwarcie wypowiada się o zmianie klimatu.','outspoken ABOUT something.',30),
  ('rozszerzona','down-to-earth','przym.','stąpający twardo po ziemi','Despite his fame he stayed down-to-earth.','Mimo sławy pozostał normalnym człowiekiem.','despite + rzeczownik, BEZ of.',31),
  ('rozszerzona','peer pressure','zwrot','presja rówieśnicza','Peer pressure affects teenagers strongly.','Presja rówieśnicza silnie wpływa na nastolatków.','affect (cz.) vs effect (rz.) — klasyczna pułapka.',32),
  ('rozszerzona','come across as','zwrot','sprawiać wrażenie','He comes across as arrogant.','Sprawia wrażenie aroganckiego.','Bardzo dobrze punktowany phrasal verb.',33),
  ('rozszerzona','look up to','zwrot','podziwiać','I have always looked up to my grandmother.','Zawsze podziwiałem babcię.','Przeciwieństwo: look down on (patrzeć z góry).',34),
  ('rozszerzona','fall out with','zwrot','pokłócić się z','They fell out with each other over money.','Pokłócili się o pieniądze.','fall out WITH somebody OVER something.',35),
  ('rozszerzona','put up with','zwrot','znosić, tolerować','I cannot put up with the noise.','Nie mogę znieść tego hałasu.','Phrasal verb trzyczłonowy — częsty w słowotwórstwie.',36)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 2. Miejsce zamieszkania
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'miejsce-zamieszkania') t,
(values
  ('podstawowa','flat','rz.','mieszkanie','We rent a two-bedroom flat.','Wynajmujemy dwupokojowe mieszkanie.','Brytyjskie. Amerykańskie: apartment. Uwaga: two-bedroom = dwie SYPIALNIE.',1),
  ('podstawowa','detached house','zwrot','dom wolnostojący','They live in a detached house.','Mieszkają w domu wolnostojącym.','semi-detached = bliźniak; terraced = szeregowiec.',2),
  ('podstawowa','suburb','rz.','przedmieście','We moved to a quiet suburb.','Przeprowadziliśmy się na spokojne przedmieście.','in the suburbs = na przedmieściach.',3),
  ('podstawowa','neighbourhood','rz.','okolica, sąsiedztwo','It is a safe neighbourhood.','To bezpieczna okolica.','Pisownia amerykańska: neighborhood.',4),
  ('podstawowa','neighbour','rz.','sąsiad','Our neighbours are very friendly.','Nasi sąsiedzi są bardzo mili.','Pisownia amerykańska: neighbor.',5),
  ('podstawowa','ground floor','zwrot','parter','The kitchen is on the ground floor.','Kuchnia jest na parterze.','UWAGA: w USA parter to first floor. Klasyczna pułapka.',6),
  ('podstawowa','stairs','rz.','schody','Take the stairs, the lift is broken.','Idź schodami, winda jest zepsuta.','Zawsze liczba mnoga.',7),
  ('podstawowa','lift','rz.','winda','The lift is out of order.','Winda jest nieczynna.','Amerykańskie: elevator. out of order = nieczynny.',8),
  ('podstawowa','furniture','rz.','meble','We bought some new furniture.','Kupiliśmy nowe meble.','NIEPOLICZALNE: nigdy „furnitures”. Jeden mebel: a piece of furniture.',9),
  ('podstawowa','wardrobe','rz.','szafa','Your coat is in the wardrobe.','Twój płaszcz jest w szafie.','Amerykańskie: closet.',10),
  ('podstawowa','fridge','rz.','lodówka','Put the milk in the fridge.','Włóż mleko do lodówki.','Pełna forma: refrigerator.',11),
  ('podstawowa','washing machine','zwrot','pralka','The washing machine has broken down.','Pralka się zepsuła.','break down = zepsuć się (o urządzeniu).',12),
  ('podstawowa','central heating','zwrot','centralne ogrzewanie','The flat has central heating.','Mieszkanie ma centralne ogrzewanie.','Częsta zaleta w ogłoszeniach.',13),
  ('podstawowa','rent','cz./rz.','wynajmować, czynsz','We pay 600 pounds rent a month.','Płacimy 600 funtów czynszu miesięcznie.','rent OUT = wynajmować komuś. a month = miesięcznie.',14),
  ('podstawowa','landlord','rz.','właściciel wynajmowanego mieszkania','The landlord wants to raise the rent.','Właściciel chce podnieść czynsz.','Żeńska forma: landlady. Najemca: tenant.',15),
  ('podstawowa','move in','zwrot','wprowadzić się','We moved in last September.','Wprowadziliśmy się we wrześniu.','move out = wyprowadzić się; move house = przeprowadzić się.',16),
  ('podstawowa','share a flat','zwrot','wynajmować mieszkanie wspólnie','I share a flat with two students.','Wynajmuję mieszkanie z dwoma studentami.','flatmate = współlokator (USA: roommate).',17),
  ('podstawowa','cosy','przym.','przytulny','The living room is small but cosy.','Salon jest mały, ale przytulny.','Pisownia amerykańska: cozy.',18),
  ('podstawowa','spacious','przym.','przestronny','The flat is bright and spacious.','Mieszkanie jest jasne i przestronne.','space = przestrzeń.',19),
  ('podstawowa','noisy','przym.','hałaśliwy','The street is noisy at night.','Ulica jest głośna nocą.','noise = hałas (niepoliczalne).',20),
  ('podstawowa','view','rz.','widok','The room has a view of the park.','Pokój ma widok na park.','a view OF something.',21),
  ('rozszerzona','mortgage','rz.','kredyt hipoteczny','They have been paying a mortgage for ten years.','Spłacają kredyt od dziesięciu lat.','Litera t jest NIEMA: „morgydż”.',22),
  ('rozszerzona','deposit','rz.','kaucja, zaliczka','The landlord kept part of the deposit.','Właściciel zatrzymał część kaucji.','Też: wpłata na konto.',23),
  ('rozszerzona','bills','rz.','rachunki','The rent does not include bills.','Czynsz nie obejmuje rachunków.','bills included = z rachunkami w cenie.',24),
  ('rozszerzona','damp','rz./przym.','wilgoć, wilgotny','There is damp on the bedroom wall.','Na ścianie sypialni jest wilgoć.','Typowa wada mieszkania w zadaniach z reklamacją.',25),
  ('rozszerzona','do up','zwrot','wyremontować','They are doing up the whole kitchen.','Remontują całą kuchnię.','Formalniej: renovate.',26),
  ('rozszerzona','commute','cz./rz.','dojeżdżać do pracy','I commute to Warsaw every day.','Codziennie dojeżdżam do Warszawy.','commuter = osoba dojeżdżająca.',27),
  ('rozszerzona','well-connected','przym.','dobrze skomunikowany','The area is well-connected.','Okolica jest dobrze skomunikowana.','Ceniona zaleta lokalizacji.',28),
  ('rozszerzona','housing estate','zwrot','osiedle','She grew up on a housing estate.','Dorastała na osiedlu.','ON an estate — z przyimkiem on, nie in.',29),
  ('rozszerzona','affordable housing','zwrot','mieszkania w przystępnej cenie','Big cities lack affordable housing.','Wielkim miastom brakuje przystępnych mieszkań.','afford = pozwolić sobie na.',30),
  ('rozszerzona','settle down','zwrot','osiąść, ustatkować się','They settled down in a small town.','Osiedli w małym miasteczku.','Też: ustatkować się życiowo.',31)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 3. Edukacja
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'edukacja') t,
(values
  ('podstawowa','secondary school','zwrot','szkoła średnia','I go to a secondary school in Kraków.','Chodzę do liceum w Krakowie.','Amerykańskie: high school. Podstawówka: primary school.',1),
  ('podstawowa','subject','rz.','przedmiot szkolny','My favourite subject is biology.','Mój ulubiony przedmiot to biologia.','Też: temat. NIE object.',2),
  ('podstawowa','take an exam','zwrot','przystąpić do egzaminu','I am taking my final exams in May.','W maju zdaję maturę.','TAKE = przystąpić; PASS = zdać. Klasyczna pułapka w środkach językowych.',3),
  ('podstawowa','pass','cz.','zdać','I passed the exam with a good mark.','Zdałem egzamin z dobrą oceną.','Zdać = pass, NIE take.',4),
  ('podstawowa','fail','cz.','oblać','He failed maths twice.','Dwa razy oblał matematykę.','fail AN exam — bez przyimka.',5),
  ('podstawowa','mark','rz.','ocena','She always gets top marks.','Zawsze dostaje najwyższe oceny.','Amerykańskie: grade. get a mark = dostać ocenę.',6),
  ('podstawowa','homework','rz.','praca domowa','I have a lot of homework today.','Mam dziś dużo pracy domowej.','NIEPOLICZALNE: nigdy „homeworks”, nigdy „a homework”.',7),
  ('podstawowa','revise','cz.','powtarzać do egzaminu','I am revising for my English exam.','Powtarzam do egzaminu z angielskiego.','revise FOR an exam. FAŁSZYWY PRZYJACIEL: to nie „rewidować”.',8),
  ('podstawowa','timetable','rz.','plan lekcji','Our new timetable is terrible.','Nasz nowy plan jest okropny.','Amerykańskie: schedule.',9),
  ('podstawowa','break','rz.','przerwa','We play football during the break.','Na przerwie gramy w piłkę.','Amerykańskie: recess.',10),
  ('podstawowa','term','rz.','semestr, trymestr','The summer term ends in June.','Semestr letni kończy się w czerwcu.','Też: termin, pojęcie.',11),
  ('podstawowa','headteacher','rz.','dyrektor szkoły','The headteacher gave a speech.','Dyrektor wygłosił przemówienie.','Amerykańskie: principal.',12),
  ('podstawowa','classmate','rz.','kolega z klasy','My classmates helped me catch up.','Koledzy z klasy pomogli mi nadrobić.','catch up = nadrobić zaległości.',13),
  ('podstawowa','scholarship','rz.','stypendium','She won a scholarship to Oxford.','Zdobyła stypendium do Oksfordu.','win/get a scholarship.',14),
  ('podstawowa','degree','rz.','stopień naukowy, dyplom','He has a degree in economics.','Ma dyplom z ekonomii.','a degree IN something.',15),
  ('podstawowa','graduate','cz./rz.','ukończyć studia, absolwent','She graduated from Warsaw University.','Ukończyła Uniwersytet Warszawski.','graduate FROM a university.',16),
  ('podstawowa','attend','cz.','uczęszczać','All students must attend the lecture.','Wszyscy studenci muszą być na wykładzie.','attend BEZ przyimka: attend school, nie „attend to school”.',17),
  ('podstawowa','make progress','zwrot','robić postępy','You have made great progress this term.','Zrobiłeś w tym semestrze duże postępy.','MAKE progress, nie do. progress jest niepoliczalne.',18),
  ('podstawowa','do research','zwrot','prowadzić badania','We had to do research for the project.','Musieliśmy zebrać materiały do projektu.','DO research, nie make. research jest niepoliczalne.',19),
  ('podstawowa','be good at','zwrot','być dobrym z','She is good at languages.','Jest dobra z języków.','good AT — nie „good in”. Częsty błąd Polaków.',20),
  ('rozszerzona','curriculum','rz.','program nauczania','The curriculum has been reformed.','Program nauczania zreformowano.','Liczba mnoga: curricula.',21),
  ('rozszerzona','compulsory','przym.','obowiązkowy','Education is compulsory until 18.','Nauka jest obowiązkowa do 18 roku życia.','Przeciwieństwo: optional.',22),
  ('rozszerzona','tuition fees','zwrot','czesne','Tuition fees have risen sharply.','Czesne mocno wzrosło.','Częsty temat rozprawki o dostępie do edukacji.',23),
  ('rozszerzona','drop out','zwrot','porzucić szkołę','He dropped out of university after a year.','Rzucił studia po roku.','drop out OF something. dropout (rz.) = osoba, która rzuciła.',24),
  ('rozszerzona','cheat','cz.','ściągać, oszukiwać','He was caught cheating in the test.','Przyłapano go na ściąganiu.','be caught + gerund = zostać przyłapanym na.',25),
  ('rozszerzona','achievement','rz.','osiągnięcie','Passing the exam was a real achievement.','Zdanie egzaminu było prawdziwym osiągnięciem.','achieve = osiągać.',26),
  ('rozszerzona','lifelong learning','zwrot','uczenie się przez całe życie','Lifelong learning is now essential.','Uczenie się przez całe życie jest dziś niezbędne.','Bardzo dobrze punktowany zwrot w rozprawce.',27),
  ('rozszerzona','vocational','przym.','zawodowy','Vocational training is undervalued.','Kształcenie zawodowe jest niedoceniane.','vocational school = szkoła zawodowa.',28),
  ('rozszerzona','keep up with','zwrot','nadążać za','It is hard to keep up with the material.','Trudno nadążyć za materiałem.','Nie myl z catch up with (dogonić).',29),
  ('rozszerzona','a heavy workload','zwrot','duże obciążenie pracą','Students complain about a heavy workload.','Uczniowie skarżą się na duże obciążenie.','complain ABOUT something.',30),
  ('rozszerzona','pay attention to','zwrot','zwracać uwagę na','Pay attention to the instructions.','Zwróć uwagę na polecenie.','pay attention TO — z przyimkiem to.',31),
  ('rozszerzona','bear in mind','zwrot','mieć na uwadze','Bear in mind that the deadline is Friday.','Miej na uwadze, że termin to piątek.','Nieregularny: bear - bore - borne. Bardzo dobre w rozprawce.',32)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
