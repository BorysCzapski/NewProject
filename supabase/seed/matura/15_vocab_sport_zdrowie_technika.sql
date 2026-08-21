-- ============================================================================
-- supabase/seed/matura/15_vocab_sport_zdrowie_technika.sql
-- English vocabulary: Sport, Zdrowie, Nauka i technika.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'en' and slug in ('sport', 'zdrowie', 'nauka-i-technika')
);

-- ----------------------------------------------------------------------------
-- 10. Sport
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'sport') t,
(values
  ('podstawowa','do sport','zwrot','uprawiać sport','I do sport three times a week.','Uprawiam sport trzy razy w tygodniu.','DO sport ogólnie; PLAY z grami zespołowymi; GO z -ing (go swimming).',1),
  ('podstawowa','play football','zwrot','grać w piłkę','We play football every Saturday.','Gramy w piłkę w każdą sobotę.','PLAY + gra zespołowa, bez rodzajnika.',2),
  ('podstawowa','go swimming','zwrot','chodzić pływać','I go swimming twice a week.','Pływam dwa razy w tygodniu.','GO + -ing dla sportów indywidualnych: go running, go cycling.',3),
  ('podstawowa','match','rz.','mecz','The match starts at eight.','Mecz zaczyna się o ósmej.','Amerykańskie: game.',4),
  ('podstawowa','team','rz.','drużyna','Our team won the final.','Nasza drużyna wygrała finał.','Zespół muzyczny to band, nie team.',5),
  ('podstawowa','win','cz.','wygrać','We won two nil.','Wygraliśmy dwa do zera.','WIN a match, BEAT an opponent. Nieregularny: win - won - won.',6),
  ('podstawowa','beat','cz.','pokonać','They beat us in the semi-final.','Pokonali nas w półfinale.','beat SOMEBODY, win SOMETHING. Klasyczna pułapka.',7),
  ('podstawowa','lose','cz.','przegrać','We lost by one goal.','Przegraliśmy jedną bramką.','lose BY + różnica. Nieregularny: lose - lost - lost.',8),
  ('podstawowa','draw','rz./cz.','remis, zremisować','The game ended in a draw.','Mecz zakończył się remisem.','Też: rysować. Nieregularny: draw - drew - drawn.',9),
  ('podstawowa','score','cz./rz.','strzelić gola, wynik','He scored twice in the second half.','Strzelił dwa gole w drugiej połowie.','the score = wynik.',10),
  ('podstawowa','referee','rz.','sędzia','The referee missed the foul.','Sędzia nie widział faulu.','Skrót: ref. foul = faul.',11),
  ('podstawowa','coach','rz.','trener','Our coach is very demanding.','Nasz trener jest bardzo wymagający.','Też: autokar. Synonim: trainer.',12),
  ('podstawowa','pitch','rz.','boisko','The pitch was completely wet.','Boisko było zupełnie mokre.','court = kort/boisko do koszykówki; track = bieżnia.',13),
  ('podstawowa','fan','rz.','kibic','Thousands of fans came.','Przyszły tysiące kibiców.','supporter = kibic (bardziej brytyjskie).',14),
  ('podstawowa','championship','rz.','mistrzostwa','He won the national championship.','Wygrał mistrzostwa kraju.','champion = mistrz.',15),
  ('podstawowa','take part in','zwrot','brać udział w','She took part in the Olympics.','Brała udział w igrzyskach.','take part IN. Synonim: participate in.',16),
  ('podstawowa','keep fit','zwrot','utrzymywać formę','Cycling helps me keep fit.','Jazda na rowerze pomaga mi utrzymać formę.','Też: stay in shape.',17),
  ('rozszerzona','injury','rz.','kontuzja','He recovered from a serious injury.','Wyleczył poważną kontuzję.','recover FROM. get injured = doznać kontuzji.',18),
  ('rozszerzona','endurance','rz.','wytrzymałość','Marathon running requires endurance.','Bieganie maratonów wymaga wytrzymałości.','endure = znosić, wytrzymywać.',19),
  ('rozszerzona','doping','rz.','doping farmakologiczny','Doping scandals damage the sport.','Afery dopingowe szkodzą sportowi.','UWAGA: kibicowanie to cheering/support, NIE doping.',20),
  ('rozszerzona','extreme sports','zwrot','sporty ekstremalne','Extreme sports attract young people.','Sporty ekstremalne przyciągają młodych.','Częsty temat rozprawki o ryzyku.',21),
  ('rozszerzona','sedentary lifestyle','zwrot','siedzący tryb życia','A sedentary lifestyle harms your health.','Siedzący tryb życia szkodzi zdrowiu.','harm = szkodzić.',22),
  ('rozszerzona','teamwork','rz.','praca zespołowa','Sport teaches teamwork.','Sport uczy pracy zespołowej.','Klasyczny argument w rozprawce o sporcie.',23),
  ('rozszerzona','push yourself','zwrot','przekraczać własne granice','Sport teaches you to push yourself.','Sport uczy przekraczania własnych granic.','Dobre zakończenie rozprawki.',24),
  ('rozszerzona','give up','zwrot','poddać się, rzucić','He gave up training after the injury.','Rzucił treningi po kontuzji.','give up + GERUND: gave up smoking.',25),
  ('rozszerzona','work out','zwrot','ćwiczyć','I work out at the gym three times a week.','Ćwiczę na siłowni trzy razy w tygodniu.','Jako rzeczownik: a workout.',26),
  ('rozszerzona','be into','zwrot','interesować się','She is really into climbing.','Naprawdę interesuje się wspinaczką.','Potoczne, ale bardzo naturalne w e-mailu.',27)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 11. Zdrowie
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'zdrowie') t,
(values
  ('podstawowa','health','rz.','zdrowie','Health comes first.','Zdrowie przede wszystkim.','healthy = zdrowy. Niepoliczalne.',1),
  ('podstawowa','illness','rz.','choroba','He missed school because of illness.','Opuścił szkołę z powodu choroby.','disease = konkretna jednostka chorobowa.',2),
  ('podstawowa','symptom','rz.','objaw','The main symptom is a headache.','Głównym objawem jest ból głowy.','Litera p jest wymawiana: „symptom”.',3),
  ('podstawowa','headache','rz.','ból głowy','I have a terrible headache.','Mam okropny ból głowy.','HAVE a headache. Podobnie: toothache, stomach ache.',4),
  ('podstawowa','sore throat','zwrot','ból gardła','I have a sore throat.','Boli mnie gardło.','sore = obolały, podrażniony.',5),
  ('podstawowa','a cold','rz.','przeziębienie','I have caught a cold.','Przeziębiłem się.','CATCH a cold. Z rodzajnikiem: a cold.',6),
  ('podstawowa','flu','rz.','grypa','She has been off with flu.','Choruje na grypę.','Zwykle bez rodzajnika: have flu (BrE).',7),
  ('podstawowa','temperature','rz.','gorączka, temperatura','He has a high temperature.','Ma wysoką gorączkę.','have a temperature = mieć gorączkę.',8),
  ('podstawowa','GP','rz.','lekarz rodzinny','I made an appointment with my GP.','Umówiłem się do lekarza rodzinnego.','General Practitioner. Wizyta: an appointment.',9),
  ('podstawowa','prescription','rz.','recepta','The doctor gave me a prescription.','Lekarz dał mi receptę.','prescribe = przepisywać lek. NIE recipe (przepis kulinarny).',10),
  ('podstawowa','painkiller','rz.','środek przeciwbólowy','I took a painkiller.','Wziąłem środek przeciwbólowy.','TAKE medicine, nie „drink medicine”.',11),
  ('podstawowa','treatment','rz.','leczenie','The treatment lasts six weeks.','Leczenie trwa sześć tygodni.','treat = leczyć.',12),
  ('podstawowa','ambulance','rz.','karetka','We called an ambulance immediately.','Natychmiast wezwaliśmy karetkę.','call an ambulance = wezwać karetkę.',13),
  ('podstawowa','injure','cz.','zranić','He injured his knee playing football.','Zranił kolano, grając w piłkę.','get injured = doznać urazu. Rana: a wound.',14),
  ('podstawowa','recover','cz.','wyzdrowieć','She recovered quickly.','Szybko wyzdrowiała.','recover FROM an illness.',15),
  ('podstawowa','get better','zwrot','zdrowieć','I hope you get better soon.','Mam nadzieję, że szybko wyzdrowiejesz.','Standardowa formuła w e-mailu.',16),
  ('rozszerzona','vaccination','rz.','szczepienie','Vaccination is free of charge.','Szczepienie jest bezpłatne.','free of charge = bezpłatny.',17),
  ('rozszerzona','addiction','rz.','uzależnienie','Phone addiction worries many parents.','Uzależnienie od telefonu niepokoi rodziców.','addiction TO something. be addicted to.',18),
  ('rozszerzona','mental health','zwrot','zdrowie psychiczne','Mental health is finally being discussed.','Wreszcie mówi się o zdrowiu psychicznym.','Bardzo częsty temat rozprawki.',19),
  ('rozszerzona','stress','rz.','stres','Exams cause a lot of stress.','Egzaminy powodują duży stres.','stressful = stresujący; stressed = zestresowany.',20),
  ('rozszerzona','wellbeing','rz.','dobrostan','Exercise improves overall wellbeing.','Ruch poprawia ogólne samopoczucie.','Pisownia też: well-being.',21),
  ('rozszerzona','life expectancy','zwrot','oczekiwana długość życia','Life expectancy has risen steadily.','Oczekiwana długość życia stale rośnie.','Przydatne w argumentacji o zdrowiu.',22),
  ('rozszerzona','obesity','rz.','otyłość','Childhood obesity has increased.','Otyłość dziecięca wzrosła.','obese = otyły.',23),
  ('rozszerzona','eating disorder','zwrot','zaburzenie odżywiania','Eating disorders affect many teenagers.','Zaburzenia odżywiania dotykają wielu nastolatków.','Poważny temat tekstów na rozszerzeniu.',24),
  ('rozszerzona','prevention','rz.','profilaktyka','Prevention is better than cure.','Lepiej zapobiegać niż leczyć.','Angielskie przysłowie — świetne w rozprawce.',25),
  ('rozszerzona','come down with','zwrot','rozchorować się na','I came down with flu last week.','Rozchorowałem się na grypę w zeszłym tygodniu.','Tylko o lżejszych chorobach.',26),
  ('rozszerzona','cut down on','zwrot','ograniczyć','You should cut down on sugar.','Powinieneś ograniczyć cukier.','cut down ON something.',27),
  ('rozszerzona','be worn out','zwrot','być wykończonym','After the exam I was worn out.','Po egzaminie byłem wykończony.','Nieregularny: wear - wore - worn.',28)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 12. Nauka i technika
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'nauka-i-technika') t,
(values
  ('podstawowa','device','rz.','urządzenie','Turn off all electronic devices.','Wyłącz wszystkie urządzenia elektroniczne.','turn off = wyłączyć; turn on = włączyć.',1),
  ('podstawowa','screen','rz.','ekran','I spend too long in front of a screen.','Spędzam za dużo czasu przed ekranem.','screen time = czas przed ekranem.',2),
  ('podstawowa','password','rz.','hasło','I forgot my password again.','Znowu zapomniałem hasła.','Ważne w zadaniach o bezpieczeństwie w sieci.',3),
  ('podstawowa','download','cz.','pobierać','I downloaded the app for free.','Pobrałem aplikację za darmo.','upload = wgrywać.',4),
  ('podstawowa','attachment','rz.','załącznik','Please find the attachment below.','W załączeniu przesyłam plik.','attach = załączać. Standardowy zwrot w mailu.',5),
  ('podstawowa','browse','cz.','przeglądać','I was browsing the internet.','Przeglądałem internet.','browser = przeglądarka.',6),
  ('podstawowa','social media','zwrot','media społecznościowe','Social media influences young people.','Media społecznościowe wpływają na młodych.','Czasownik zwykle w liczbie pojedynczej.',7),
  ('podstawowa','charge','cz.','ładować','My phone needs charging.','Mój telefon trzeba naładować.','charger = ładowarka. Też: pobierać opłatę.',8),
  ('podstawowa','battery','rz.','bateria','The battery runs out quickly.','Bateria szybko się rozładowuje.','run out = wyczerpać się.',9),
  ('podstawowa','break down','zwrot','zepsuć się','My laptop broke down yesterday.','Mój laptop zepsuł się wczoraj.','O urządzeniach i samochodach.',10),
  ('podstawowa','invention','rz.','wynalazek','The printing press was a crucial invention.','Druk był kluczowym wynalazkiem.','invent = wynaleźć; inventor = wynalazca.',11),
  ('podstawowa','discovery','rz.','odkrycie','It was an accidental discovery.','To było przypadkowe odkrycie.','discover = odkryć.',12),
  ('podstawowa','scientist','rz.','naukowiec','Scientists warn about the risks.','Naukowcy ostrzegają przed ryzykiem.','warn ABOUT/OF something.',13),
  ('podstawowa','experiment','rz./cz.','eksperyment','They carried out an experiment.','Przeprowadzili eksperyment.','CARRY OUT an experiment, nie „make”.',14),
  ('podstawowa','equipment','rz.','sprzęt','The lab has modern equipment.','Laboratorium ma nowoczesny sprzęt.','NIEPOLICZALNE: nigdy „equipments”.',15),
  ('rozszerzona','research','rz.','badania','Research shows a clear link.','Badania pokazują wyraźny związek.','NIEPOLICZALNE: „researches” to błąd. DO research.',16),
  ('rozszerzona','breakthrough','rz.','przełom','It was a major medical breakthrough.','To był ogromny przełom w medycynie.','Świetne słowo w rozprawce o nauce.',17),
  ('rozszerzona','artificial intelligence','zwrot','sztuczna inteligencja','Artificial intelligence will reshape work.','Sztuczna inteligencja przekształci rynek pracy.','Skrót: AI. Najczęstszy współczesny temat.',18),
  ('rozszerzona','privacy','rz.','prywatność','Data privacy is a growing concern.','Prywatność danych coraz bardziej niepokoi.','a concern = powód do niepokoju.',19),
  ('rozszerzona','cyberbullying','rz.','cyberprzemoc','Cyberbullying is a serious offence.','Cyberprzemoc to poważne przestępstwo.','offence = wykroczenie, przestępstwo.',20),
  ('rozszerzona','digital divide','zwrot','wykluczenie cyfrowe','The digital divide affects older people.','Wykluczenie cyfrowe dotyka osoby starsze.','Częsty zwrot w tekstach publicystycznych.',21),
  ('rozszerzona','reliable source','zwrot','wiarygodne źródło','Always check whether the source is reliable.','Zawsze sprawdzaj, czy źródło jest wiarygodne.','whether, nie „if”, w zdaniu tego typu.',22),
  ('rozszerzona','replace','cz.','zastępować','Machines may replace some jobs.','Maszyny mogą zastąpić część miejsc pracy.','replace A with B.',23),
  ('rozszerzona','keep track of','zwrot','śledzić, kontrolować','Apps help you keep track of your spending.','Aplikacje pomagają kontrolować wydatki.','spending = wydatki.',24),
  ('rozszerzona','at the click of a button','zwrot','za jednym kliknięciem','Information is available at the click of a button.','Informacja jest o jedno kliknięcie.','Idiom typowy dla tekstów o internecie.',25),
  ('rozszerzona','a double-edged sword','zwrot','miecz obosieczny','Technology is a double-edged sword.','Technologia to miecz obosieczny.','IDEALNY zwrot do tezy rozprawki za i przeciw.',26)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
