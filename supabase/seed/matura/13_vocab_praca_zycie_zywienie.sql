-- ============================================================================
-- supabase/seed/matura/13_vocab_praca_zycie_zywienie.sql
-- English vocabulary: Praca, Życie prywatne, Żywienie.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'en' and slug in ('praca', 'zycie-prywatne', 'zywienie')
);

-- ----------------------------------------------------------------------------
-- 4. Praca
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'praca') t,
(values
  ('podstawowa','job','rz.','praca (posada)','She got a job in a bank.','Dostała pracę w banku.','job jest POLICZALNE, work nie. „a work” to błąd.',1),
  ('podstawowa','work','rz./cz.','praca, pracować','I have a lot of work to do.','Mam dużo pracy.','NIEPOLICZALNE jako rzeczownik: much work, nie many works.',2),
  ('podstawowa','employer','rz.','pracodawca','My employer offers flexible hours.','Mój pracodawca oferuje elastyczne godziny.','employee = pracownik. Uwaga na końcówki -er/-ee.',3),
  ('podstawowa','employee','rz.','pracownik','The company has fifty employees.','Firma ma pięćdziesięciu pracowników.','Akcent na ostatnią sylabę.',4),
  ('podstawowa','colleague','rz.','współpracownik','My colleagues are very helpful.','Moi współpracownicy są bardzo pomocni.','Trudna pisownia: -eague.',5),
  ('podstawowa','salary','rz.','pensja','The salary is not very high.','Pensja nie jest zbyt wysoka.','salary = miesięczna; wages = tygodniowa/godzinowa.',6),
  ('podstawowa','apply for','zwrot','ubiegać się o','I applied for a summer job.','Ubiegałem się o pracę wakacyjną.','apply FOR a job, apply TO a company.',7),
  ('podstawowa','job interview','zwrot','rozmowa kwalifikacyjna','I have a job interview on Monday.','W poniedziałek mam rozmowę kwalifikacyjną.','go for an interview = iść na rozmowę.',8),
  ('podstawowa','CV','rz.','życiorys','Attach your CV to the email.','Załącz CV do maila.','Amerykańskie: resume. attach = załączyć.',9),
  ('podstawowa','part-time','przym.','na pół etatu','I work part-time at a cafe.','Pracuję na pół etatu w kawiarni.','Pełen etat: full-time.',10),
  ('podstawowa','shift','rz.','zmiana (w pracy)','I work the night shift.','Pracuję na nocnej zmianie.','shift work = praca zmianowa.',11),
  ('podstawowa','earn','cz.','zarabiać','She earns about 4000 zloty a month.','Zarabia około 4000 złotych miesięcznie.','earn money, NIE „win money”.',12),
  ('podstawowa','hire','cz.','zatrudnić','They hired ten new people.','Zatrudnili dziesięć nowych osób.','W brytyjskim też: wynająć (hire a car).',13),
  ('podstawowa','fire','cz.','zwolnić','He was fired for being late.','Zwolniono go za spóźnienia.','Łagodniej: let somebody go. Zwolnienie grupowe: make redundant.',14),
  ('podstawowa','unemployed','przym.','bezrobotny','He has been unemployed since January.','Jest bezrobotny od stycznia.','unemployment = bezrobocie.',15),
  ('podstawowa','retire','cz.','przejść na emeryturę','My father retired last year.','Ojciec przeszedł na emeryturę w zeszłym roku.','pension = emerytura (pieniądze). FAŁSZYWY PRZYJACIEL: nie „pensja”.',16),
  ('podstawowa','staff','rz.','personel','The staff are very friendly.','Personel jest bardzo miły.','Czasownik zwykle w liczbie mnogiej: the staff ARE.',17),
  ('podstawowa','a day off','zwrot','dzień wolny','I am taking a day off on Friday.','Biorę wolne w piątek.','take a day off = wziąć wolne.',18),
  ('rozszerzona','promotion','rz.','awans','She got a promotion after two years.','Awansowała po dwóch latach.','FAŁSZYWY PRZYJACIEL: to też „promocja” marketingowa, ale nie „przecena”.',19),
  ('rozszerzona','redundancy','rz.','zwolnienie grupowe','The factory announced redundancies.','Fabryka ogłosiła zwolnienia grupowe.','be made redundant = zostać zwolnionym z przyczyn ekonomicznych.',20),
  ('rozszerzona','work-life balance','zwrot','równowaga między pracą a życiem','A good work-life balance reduces stress.','Dobra równowaga zmniejsza stres.','Bardzo częsty temat rozprawki.',21),
  ('rozszerzona','remote work','zwrot','praca zdalna','Remote work saves commuting time.','Praca zdalna oszczędza czas dojazdów.','Też: working from home (WFH).',22),
  ('rozszerzona','self-employed','przym.','samozatrudniony','She has been self-employed for years.','Od lat prowadzi własną działalność.','Rzeczownik: self-employment.',23),
  ('rozszerzona','internship','rz.','staż, praktyki','He did an internship at a law firm.','Odbył staż w kancelarii.','DO an internship, nie make.',24),
  ('rozszerzona','qualifications','rz.','kwalifikacje','The job requires specific qualifications.','Ta praca wymaga określonych kwalifikacji.','Zwykle liczba mnoga.',25),
  ('rozszerzona','deadline','rz.','termin','We missed the deadline by a day.','Spóźniliśmy się z terminem o dzień.','meet a deadline = dotrzymać terminu.',26),
  ('rozszerzona','overtime','rz.','nadgodziny','He works overtime every week.','Co tydzień pracuje w nadgodzinach.','WORK overtime — bez przyimka.',27),
  ('rozszerzona','take on','zwrot','przyjmować (pracę, obowiązki)','The firm took on twenty graduates.','Firma przyjęła dwudziestu absolwentów.','Też: podjąć się czegoś.',28),
  ('rozszerzona','look forward to','zwrot','wyczekiwać','I look forward to hearing from you.','Czekam na odpowiedź.','PO to idzie GERUND, nie bezokolicznik. Standardowe zakończenie formalnego maila.',29),
  ('rozszerzona','be in charge of','zwrot','odpowiadać za','She is in charge of the whole team.','Odpowiada za cały zespół.','in charge OF something.',30),
  ('rozszerzona','gain experience','zwrot','zdobywać doświadczenie','Volunteering helps you gain experience.','Wolontariat pomaga zdobyć doświadczenie.','GAIN experience, nie „win”.',31)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 5. Życie prywatne
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'zycie-prywatne') t,
(values
  ('podstawowa','relative','rz.','krewny','All our relatives came to the wedding.','Wszyscy krewni przyszli na wesele.','Jako przymiotnik: względny.',1),
  ('podstawowa','sibling','rz.','rodzeństwo (jedna osoba)','Do you have any siblings?','Masz rodzeństwo?','Jedno słowo na brata lub siostrę — brak polskiego odpowiednika.',2),
  ('podstawowa','only child','zwrot','jedynak','She is an only child.','Jest jedynaczką.','NIE „the only child”, chyba że dosłownie jedyne dziecko w grupie.',3),
  ('podstawowa','grandparents','rz.','dziadkowie','My grandparents live in the countryside.','Dziadkowie mieszkają na wsi.','in the countryside = na wsi.',4),
  ('podstawowa','get married','zwrot','brać ślub','They got married last summer.','Pobrali się zeszłego lata.','get married TO somebody, nie „with”.',5),
  ('podstawowa','get divorced','zwrot','rozwodzić się','His parents got divorced when he was ten.','Rodzice rozwiedli się, gdy miał dziesięć lat.','divorce (rz.) = rozwód.',6),
  ('podstawowa','close friend','zwrot','bliski przyjaciel','She is my closest friend.','To moja najbliższa przyjaciółka.','NIE „best friend” w każdym kontekście — close jest naturalniejsze.',7),
  ('podstawowa','friendship','rz.','przyjaźń','Friendship takes time to build.','Przyjaźń buduje się latami.','Kluczowe słowo w rozprawkach.',8),
  ('podstawowa','free time','zwrot','czas wolny','In my free time I play the guitar.','W wolnym czasie gram na gitarze.','play THE guitar — z rodzajnikiem przy instrumentach.',9),
  ('podstawowa','hobby','rz.','hobby','Photography is my main hobby.','Fotografia to moje główne hobby.','Liczba mnoga: hobbies.',10),
  ('podstawowa','hang out','zwrot','spędzać czas','We hang out at the shopping centre.','Spędzamy czas w centrum handlowym.','Potoczne; do e-maila do kolegi.',11),
  ('podstawowa','meet up','zwrot','spotkać się','Let us meet up on Saturday.','Spotkajmy się w sobotę.','meet up WITH somebody.',12),
  ('podstawowa','celebrate','cz.','świętować','We celebrate Christmas at home.','Boże Narodzenie świętujemy w domu.','celebration = uroczystość.',13),
  ('podstawowa','anniversary','rz.','rocznica','It is their tenth wedding anniversary.','To ich dziesiąta rocznica ślubu.','Nie myl z birthday (urodziny).',14),
  ('podstawowa','argue','cz.','kłócić się','We argue about small things.','Kłócimy się o drobiazgi.','argue ABOUT something WITH somebody. Też: argumentować.',15),
  ('podstawowa','make up','zwrot','pogodzić się','They argued but made up quickly.','Pokłócili się, ale szybko się pogodzili.','Ten sam phrasal verb znaczy „wymyślić” i „nadrobić”.',16),
  ('podstawowa','look after','zwrot','opiekować się','I look after my little brother.','Opiekuję się młodszym bratem.','Synonim: take care of.',17),
  ('podstawowa','spend time','zwrot','spędzać czas','I spend a lot of time with my family.','Spędzam dużo czasu z rodziną.','SPEND time, nie „pass time”.',18),
  ('rozszerzona','extended family','zwrot','dalsza rodzina','Our extended family meets once a year.','Dalsza rodzina spotyka się raz w roku.','Przeciwieństwo: nuclear family.',19),
  ('rozszerzona','upbringing','rz.','wychowanie','He had a very strict upbringing.','Miał bardzo surowe wychowanie.','bring up = wychowywać.',20),
  ('rozszerzona','generation gap','zwrot','przepaść pokoleniowa','The generation gap is often exaggerated.','Przepaść pokoleniową często się wyolbrzymia.','exaggerate = wyolbrzymiać.',21),
  ('rozszerzona','move out','zwrot','wyprowadzić się od rodziców','Many young people cannot afford to move out.','Wielu młodych nie stać na wyprowadzkę.','afford TO do something.',22),
  ('rozszerzona','rely on','zwrot','polegać na','You can always rely on her.','Zawsze możesz na niej polegać.','rely ON — nie „rely to”.',23),
  ('rozszerzona','get in touch','zwrot','skontaktować się','Get in touch when you arrive.','Odezwij się, jak dotrzesz.','keep in touch = utrzymywać kontakt.',24),
  ('rozszerzona','have a lot in common','zwrot','mieć wiele wspólnego','We have a lot in common.','Mamy wiele wspólnego.','in common WITH somebody.',25),
  ('rozszerzona','drift apart','zwrot','oddalić się od siebie','Old friends often drift apart.','Starzy przyjaciele często się oddalają.','Bardzo dobry zwrot w rozprawce o przyjaźni.',26),
  ('rozszerzona','used to','zwrot','kiedyś (a już nie)','We used to spend every summer there.','Kiedyś spędzaliśmy tam każde lato.','used to + BEZOKOLICZNIK; be used TO + GERUND (być przyzwyczajonym).',27),
  ('rozszerzona','sense of belonging','zwrot','poczucie przynależności','Family gives a sense of belonging.','Rodzina daje poczucie przynależności.','belong TO somebody.',28)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 6. Żywienie
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'zywienie') t,
(values
  ('podstawowa','meal','rz.','posiłek','Breakfast is the most important meal.','Śniadanie to najważniejszy posiłek.','have a meal = zjeść posiłek.',1),
  ('podstawowa','snack','rz.','przekąska','I had a quick snack between lessons.','Zjadłem szybką przekąskę między lekcjami.','snack on something = podjadać coś.',2),
  ('podstawowa','starter','rz.','przystawka','We ordered soup as a starter.','Zamówiliśmy zupę na przystawkę.','Amerykańskie: appetizer. Danie główne: main course.',3),
  ('podstawowa','dessert','rz.','deser','What is for dessert?','Co na deser?','Uwaga na pisownię: dwa s. Jedno s to desert (pustynia).',4),
  ('podstawowa','vegetables','rz.','warzywa','Eat more vegetables.','Jedz więcej warzyw.','Skrót: veg (niepoliczalne).',5),
  ('podstawowa','fruit','rz.','owoce','Fruit is expensive in winter.','Owoce są zimą drogie.','ZWYKLE NIEPOLICZALNE: fruit IS, nie are.',6),
  ('podstawowa','bread','rz.','chleb','I bought a loaf of bread.','Kupiłem bochenek chleba.','NIEPOLICZALNE: a loaf of bread, nie „a bread”.',7),
  ('podstawowa','meat','rz.','mięso','I gave up meat a year ago.','Rok temu zrezygnowałem z mięsa.','give up = rezygnować. Niepoliczalne.',8),
  ('podstawowa','recipe','rz.','przepis','This recipe is very easy.','Ten przepis jest bardzo łatwy.','Wymowa trzysylabowa. Recepta to prescription.',9),
  ('podstawowa','ingredient','rz.','składnik','You need five ingredients.','Potrzebujesz pięciu składników.','Akcent na drugą sylabę.',10),
  ('podstawowa','boil','cz.','gotować (we wrzątku)','Boil the pasta for ten minutes.','Gotuj makaron dziesięć minut.','fry = smażyć; bake = piec; roast = piec mięso.',11),
  ('podstawowa','tasty','przym.','smaczny','The soup was really tasty.','Zupa była naprawdę smaczna.','taste = smak, smakować.',12),
  ('podstawowa','delicious','przym.','pyszny','That cake was delicious.','To ciasto było pyszne.','Mocniejsze niż tasty — dobre w e-mailu.',13),
  ('podstawowa','order','cz.','zamawiać','We ordered a pizza online.','Zamówiliśmy pizzę online.','Też: rozkaz, kolejność.',14),
  ('podstawowa','bill','rz.','rachunek','Could we have the bill, please?','Poprosimy rachunek.','Amerykańskie: check.',15),
  ('podstawowa','takeaway','rz.','jedzenie na wynos','We got a takeaway last night.','Wczoraj zamówiliśmy jedzenie na wynos.','Amerykańskie: takeout.',16),
  ('podstawowa','be hungry','zwrot','być głodnym','I am really hungry.','Jestem bardzo głodny.','BE hungry, nie „have hunger”.',17),
  ('podstawowa','have a sweet tooth','zwrot','mieć słabość do słodyczy','She has a real sweet tooth.','Ma prawdziwą słabość do słodyczy.','Idiom — dobrze punktowany.',18),
  ('rozszerzona','balanced diet','zwrot','zrównoważona dieta','A balanced diet prevents many illnesses.','Zrównoważona dieta zapobiega wielu chorobom.','prevent = zapobiegać. be ON a diet = być na diecie.',19),
  ('rozszerzona','nutrition','rz.','odżywianie','Good nutrition matters at every age.','Dobre odżywianie ma znaczenie w każdym wieku.','nutritious = odżywczy.',20),
  ('rozszerzona','processed food','zwrot','żywność przetworzona','Processed food contains too much salt.','Żywność przetworzona zawiera za dużo soli.','Stały temat rozprawki o zdrowiu.',21),
  ('rozszerzona','additive','rz.','dodatek do żywności','This juice contains no additives.','Ten sok nie zawiera dodatków.','preservative = konserwant.',22),
  ('rozszerzona','best before date','zwrot','data minimalnej trwałości','Check the best before date.','Sprawdź datę przydatności.','use by date = termin przydatności do spożycia.',23),
  ('rozszerzona','food waste','zwrot','marnowanie żywności','Food waste is a global problem.','Marnowanie żywności to problem globalny.','waste jako czasownik: marnować.',24),
  ('rozszerzona','organic','przym.','ekologiczny','Organic vegetables cost more.','Ekologiczne warzywa kosztują więcej.','FAŁSZYWY PRZYJACIEL: nie „organiczny” w sensie chemicznym.',25),
  ('rozszerzona','vegetarian','rz./przym.','wegetarianin','My sister has been vegetarian for years.','Moja siostra od lat jest wegetarianką.','vegan = weganin (bez nabiału i jaj).',26),
  ('rozszerzona','eating habits','zwrot','nawyki żywieniowe','Eating habits form in childhood.','Nawyki żywieniowe kształtują się w dzieciństwie.','habit = nawyk.',27),
  ('rozszerzona','cut down on','zwrot','ograniczyć','I am cutting down on sugar.','Ograniczam cukier.','cut down ON something. Zupełnie zrezygnować: cut out.',28),
  ('rozszerzona','put on weight','zwrot','przytyć','He put on weight over the holidays.','Przytył w wakacje.','Schudnąć: lose weight.',29),
  ('rozszerzona','eat out','zwrot','jeść na mieście','We eat out about once a month.','Jemy na mieście mniej więcej raz w miesiącu.','Przeciwieństwo: eat in / cook at home.',30)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
