-- ============================================================================
-- supabase/seed/matura/14_vocab_zakupy_podroze_kultura.sql
-- English vocabulary: Zakupy i usługi, Podróżowanie i turystyka, Kultura.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'en' and slug in ('zakupy-i-uslugi', 'podrozowanie-i-turystyka', 'kultura')
);

-- ----------------------------------------------------------------------------
-- 7. Zakupy i usługi
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'zakupy-i-uslugi') t,
(values
  ('podstawowa','shop','rz./cz.','sklep, robić zakupy','There is a shoe shop on the corner.','Na rogu jest sklep obuwniczy.','Amerykańskie: store. go shopping = iść na zakupy.',1),
  ('podstawowa','shopping centre','zwrot','centrum handlowe','We met at the shopping centre.','Spotkaliśmy się w centrum handlowym.','Amerykańskie: shopping mall.',2),
  ('podstawowa','customer','rz.','klient','The customer is always right.','Klient nasz pan.','client używa się o usługach profesjonalnych.',3),
  ('podstawowa','shop assistant','zwrot','sprzedawca','The shop assistant was very helpful.','Sprzedawca był bardzo pomocny.','Amerykańskie: sales clerk.',4),
  ('podstawowa','price','rz.','cena','The price includes delivery.','Cena obejmuje dostawę.','Nie myl z prize (nagroda).',5),
  ('podstawowa','cheap','przym.','tani','These trainers were quite cheap.','Te buty sportowe były dość tanie.','trainers = buty sportowe (USA: sneakers).',6),
  ('podstawowa','expensive','przym.','drogi','It is too expensive for me.','To dla mnie za drogie.','Uwaga: cost jest czasownikiem, nie przymiotnikiem.',7),
  ('podstawowa','sale','rz.','wyprzedaż','I bought it in the sale.','Kupiłem to na wyprzedaży.','IN the sale — z przyimkiem in. on sale = w sprzedaży/przeceniony.',8),
  ('podstawowa','discount','rz.','zniżka','Students get a ten percent discount.','Studenci dostają dziesięcioprocentową zniżkę.','a discount ON something.',9),
  ('podstawowa','afford','cz.','pozwolić sobie na','I cannot afford a new phone.','Nie stać mnie na nowy telefon.','Prawie zawsze z can/could. afford TO do something.',10),
  ('podstawowa','receipt','rz.','paragon','Keep the receipt in case.','Zachowaj paragon na wszelki wypadek.','Litera p jest NIEMA: „risit”.',11),
  ('podstawowa','refund','rz.','zwrot pieniędzy','I asked for a refund.','Poprosiłem o zwrot pieniędzy.','exchange = wymiana towaru.',12),
  ('podstawowa','try on','zwrot','przymierzyć','Can I try these on?','Mogę to przymierzyć?','Zaimek wchodzi w środek: try THEM on.',13),
  ('podstawowa','fitting room','zwrot','przymierzalnia','The fitting rooms are upstairs.','Przymierzalnie są na górze.','Amerykańskie: dressing room.',14),
  ('podstawowa','size','rz.','rozmiar','Do you have this in a larger size?','Ma pan to w większym rozmiarze?','Buty: shoe size.',15),
  ('podstawowa','queue','rz./cz.','kolejka, stać w kolejce','There was a long queue at the till.','Przy kasie była długa kolejka.','Amerykańskie: line. the till = kasa.',16),
  ('podstawowa','pay in cash','zwrot','płacić gotówką','Can I pay in cash?','Mogę zapłacić gotówką?','pay BY card, pay IN cash — różne przyimki.',17),
  ('rozszerzona','warranty','rz.','gwarancja','The laptop has a two-year warranty.','Laptop ma dwuletnią gwarancję.','Też: guarantee. Kluczowe w reklamacji.',18),
  ('rozszerzona','faulty','przym.','wadliwy','The item arrived faulty.','Towar dotarł uszkodzony.','fault = wada, wina.',19),
  ('rozszerzona','complain','cz.','skarżyć się','I would like to complain about the service.','Chciałbym złożyć skargę na obsługę.','complain ABOUT something TO somebody.',20),
  ('rozszerzona','complaint','rz.','reklamacja','I am writing to make a complaint.','Piszę, aby złożyć reklamację.','MAKE a complaint, nie do. Otwarcie listu formalnego.',21),
  ('rozszerzona','consumer','rz.','konsument','Consumers have the right to a refund.','Konsumenci mają prawo do zwrotu.','consumption = konsumpcja, zużycie.',22),
  ('rozszerzona','advertisement','rz.','reklama','The advertisement was misleading.','Reklama wprowadzała w błąd.','Skrót: ad / advert. misleading = wprowadzający w błąd.',23),
  ('rozszerzona','bargain','rz.','okazja','It was an absolute bargain.','To była prawdziwa okazja.','Jako czasownik: targować się.',24),
  ('rozszerzona','delivery','rz.','dostawa','Delivery is free over 200 zloty.','Dostawa jest darmowa powyżej 200 złotych.','deliver = dostarczać.',25),
  ('rozszerzona','online shopping','zwrot','zakupy przez internet','Online shopping has changed the high street.','Zakupy online zmieniły handel w miastach.','the high street = główna ulica handlowa (BrE).',26),
  ('rozszerzona','consumerism','rz.','konsumpcjonizm','Consumerism generates enormous waste.','Konsumpcjonizm generuje ogromne ilości odpadów.','Bardzo częsty temat rozprawki.',27),
  ('rozszerzona','impulse buying','zwrot','zakupy pod wpływem impulsu','Shops encourage impulse buying.','Sklepy zachęcają do zakupów pod wpływem impulsu.','encourage somebody TO do something.',28),
  ('rozszerzona','save up for','zwrot','oszczędzać na','I am saving up for a trip.','Oszczędzam na wyjazd.','save up FOR something.',29),
  ('rozszerzona','rip off','zwrot','zdzierać, naciągać','That price is a complete rip-off.','Ta cena to zwykłe zdzierstwo.','Potoczne; jako rzeczownik z łącznikiem: a rip-off.',30)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 8. Podróżowanie i turystyka
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'podrozowanie-i-turystyka') t,
(values
  ('podstawowa','journey','rz.','podróż (przejazd)','The journey took eight hours.','Podróż trwała osiem godzin.','journey = przejazd; trip = wyjazd; travel = podróżowanie (niepoliczalne).',1),
  ('podstawowa','trip','rz.','wycieczka, wyjazd','We went on a school trip to Berlin.','Pojechaliśmy na wycieczkę szkolną do Berlina.','GO ON a trip, nie „go to a trip”.',2),
  ('podstawowa','flight','rz.','lot','Our flight was delayed by two hours.','Nasz lot był opóźniony o dwie godziny.','be delayed = mieć opóźnienie.',3),
  ('podstawowa','luggage','rz.','bagaż','We only took hand luggage.','Wzięliśmy tylko bagaż podręczny.','NIEPOLICZALNE: nigdy „luggages”. USA: baggage.',4),
  ('podstawowa','suitcase','rz.','walizka','I have not packed my suitcase yet.','Jeszcze nie spakowałem walizki.','pack = pakować; unpack = rozpakowywać.',5),
  ('podstawowa','book','cz.','rezerwować','We booked the hotel online.','Zarezerwowaliśmy hotel przez internet.','booking = rezerwacja. Też: książka.',6),
  ('podstawowa','accommodation','rz.','zakwaterowanie','The price includes accommodation.','Cena obejmuje zakwaterowanie.','NIEPOLICZALNE w brytyjskim: nigdy „accommodations”.',7),
  ('podstawowa','single room','zwrot','pokój jednoosobowy','I would like a single room.','Poproszę pokój jednoosobowy.','double room = dwuosobowy z jednym łóżkiem; twin = z dwoma.',8),
  ('podstawowa','return ticket','zwrot','bilet powrotny','A return ticket to London, please.','Poproszę bilet powrotny do Londynu.','Amerykańskie: round-trip ticket. W jedną stronę: single/one-way.',9),
  ('podstawowa','platform','rz.','peron','The train leaves from platform four.','Pociąg odjeżdża z peronu czwartego.','FROM platform — z przyimkiem from.',10),
  ('podstawowa','abroad','przysł.','za granicą','She has never been abroad.','Nigdy nie była za granicą.','BEZ przyimka: go abroad, nie „go to abroad”.',11),
  ('podstawowa','sightseeing','rz.','zwiedzanie','We did some sightseeing in the morning.','Rano trochę zwiedzaliśmy.','GO sightseeing / DO some sightseeing.',12),
  ('podstawowa','landmark','rz.','charakterystyczny obiekt','Big Ben is a famous landmark.','Big Ben to słynny punkt orientacyjny.','Częste w opisach miast.',13),
  ('podstawowa','get lost','zwrot','zgubić się','We got lost in the old town.','Zgubiliśmy się na starówce.','get + participle = zmiana stanu.',14),
  ('podstawowa','set off','zwrot','wyruszyć','We set off at dawn.','Wyruszyliśmy o świcie.','Nieregularny: set - set - set.',15),
  ('podstawowa','check in','zwrot','zameldować się, odprawić','We checked in at the hotel at six.','Zameldowaliśmy się w hotelu o szóstej.','check out = wymeldować się.',16),
  ('podstawowa','travel insurance','zwrot','ubezpieczenie podróżne','Do not travel without insurance.','Nie podróżuj bez ubezpieczenia.','take out insurance = wykupić ubezpieczenie.',17),
  ('rozszerzona','destination','rz.','cel podróży','It is a popular holiday destination.','To popularny kierunek wakacyjny.','Uwaga: holiday (BrE) / vacation (AmE).',18),
  ('rozszerzona','itinerary','rz.','plan podróży','I have prepared a detailed itinerary.','Przygotowałem szczegółowy plan podróży.','Formalne — dobre w e-mailu organizacyjnym.',19),
  ('rozszerzona','stopover','rz.','przesiadka, przystanek w podróży','We had a stopover in Amsterdam.','Mieliśmy przesiadkę w Amsterdamie.','Lot bezpośredni: direct flight.',20),
  ('rozszerzona','delay','rz./cz.','opóźnienie','The delay made us miss our connection.','Opóźnienie sprawiło, że straciliśmy przesiadkę.','miss a connection = spóźnić się na przesiadkę.',21),
  ('rozszerzona','mass tourism','zwrot','turystyka masowa','Mass tourism damages historic centres.','Turystyka masowa niszczy zabytkowe centra.','Bardzo częsty temat rozprawki.',22),
  ('rozszerzona','peak season','zwrot','szczyt sezonu','Prices double in peak season.','W szczycie sezonu ceny się podwajają.','off-season = poza sezonem.',23),
  ('rozszerzona','sustainable tourism','zwrot','turystyka zrównoważona','Sustainable tourism protects local communities.','Turystyka zrównoważona chroni lokalne społeczności.','Bardzo wysoko punktowany zwrot.',24),
  ('rozszerzona','backpacking','rz.','podróżowanie z plecakiem','He went backpacking around Asia.','Podróżował z plecakiem po Azji.','go backpacking — jak go camping.',25),
  ('rozszerzona','off the beaten track','zwrot','z dala od utartych szlaków','We prefer places off the beaten track.','Wolimy miejsca z dala od utartych szlaków.','Idiom — bardzo dobrze widziany na rozszerzeniu.',26),
  ('rozszerzona','broaden your horizons','zwrot','poszerzać horyzonty','Travelling broadens your horizons.','Podróżowanie poszerza horyzonty.','Klasyczny argument w rozprawce o podróżach.',27),
  ('rozszerzona','culture shock','zwrot','szok kulturowy','She experienced a real culture shock.','Przeżyła prawdziwy szok kulturowy.','experience = doświadczać.',28)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 9. Kultura
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'kultura') t,
(values
  ('podstawowa','film','rz.','film','The film lasts two hours.','Film trwa dwie godziny.','Amerykańskie: movie. last = trwać.',1),
  ('podstawowa','audience','rz.','publiczność','The audience clapped for five minutes.','Publiczność klaskała pięć minut.','Zbiorowy: the audience WAS/WERE — obie formy możliwe.',2),
  ('podstawowa','play','rz.','sztuka teatralna','We saw a play at the National Theatre.','Obejrzeliśmy sztukę w Teatrze Narodowym.','SEE a play, nie „watch a play” w teatrze.',3),
  ('podstawowa','novel','rz.','powieść','The novel won a major prize.','Powieść zdobyła ważną nagrodę.','FAŁSZYWY PRZYJACIEL: to nie „nowela”. Nowela to short story.',4),
  ('podstawowa','author','rz.','autor','The author lives in Ireland.','Autor mieszka w Irlandii.','writer = pisarz.',5),
  ('podstawowa','painting','rz.','obraz','The painting is worth millions.','Obraz jest wart miliony.','be worth + rzeczownik/gerund.',6),
  ('podstawowa','exhibition','rz.','wystawa','There is a photography exhibition on.','Trwa wystawa fotografii.','be on = trwać (o wydarzeniu).',7),
  ('podstawowa','performance','rz.','przedstawienie, występ','The evening performance sold out.','Wieczorne przedstawienie było wyprzedane.','sell out = wyprzedać się.',8),
  ('podstawowa','band','rz.','zespół muzyczny','My favourite band is playing tonight.','Mój ulubiony zespół gra dziś wieczorem.','Zespół sportowy to team, nie band.',9),
  ('podstawowa','gig','rz.','koncert (potocznie)','We went to a gig last Friday.','W piątek byliśmy na koncercie.','Potoczne; formalnie: concert.',10),
  ('podstawowa','lyrics','rz.','tekst piosenki','I love the lyrics of this song.','Uwielbiam tekst tej piosenki.','Zawsze liczba mnoga.',11),
  ('podstawowa','ticket','rz.','bilet','Tickets sold out in an hour.','Bilety wyprzedały się w godzinę.','box office = kasa biletowa.',12),
  ('podstawowa','tradition','rz.','tradycja','It is an old family tradition.','To stara tradycja rodzinna.','traditional = tradycyjny.',13),
  ('podstawowa','custom','rz.','zwyczaj','It is a local custom.','To lokalny zwyczaj.','customs (l.mn.) = odprawa celna — inne znaczenie.',14),
  ('podstawowa','the media','rz.','media','The media covered the story widely.','Media szeroko opisały tę historię.','cover a story = relacjonować.',15),
  ('podstawowa','news','rz.','wiadomości','The news was worrying.','Wiadomości były niepokojące.','NIEPOLICZALNE i w liczbie pojedynczej: the news IS.',16),
  ('rozszerzona','plot','rz.','fabuła','The plot is predictable but enjoyable.','Fabuła jest przewidywalna, ale przyjemna.','Też: spisek, działka ziemi.',17),
  ('rozszerzona','review','rz.','recenzja','The film got mixed reviews.','Film zebrał mieszane recenzje.','mixed reviews = mieszane oceny.',18),
  ('rozszerzona','masterpiece','rz.','arcydzieło','It is considered a masterpiece.','Uważa się to za arcydzieło.','be considered + rzeczownik, bez „as”.',19),
  ('rozszerzona','subtitles','rz.','napisy','I watch films with subtitles.','Oglądam filmy z napisami.','dubbing = dubbing. Zawsze liczba mnoga.',20),
  ('rozszerzona','heritage','rz.','dziedzictwo','Kraków is on the World Heritage list.','Kraków jest na liście światowego dziedzictwa.','cultural heritage = dziedzictwo kulturowe.',21),
  ('rozszerzona','censorship','rz.','cenzura','Censorship still exists in some countries.','Cenzura wciąż istnieje w niektórych krajach.','censor = cenzurować.',22),
  ('rozszerzona','mainstream','przym./rz.','główny nurt','His music is far from mainstream.','Jego muzyka jest daleka od głównego nurtu.','far from = daleki od.',23),
  ('rozszerzona','portray','cz.','przedstawiać, ukazywać','The novel portrays post-war Poland.','Powieść ukazuje powojenną Polskę.','portrayal = przedstawienie.',24),
  ('rozszerzona','be based on','zwrot','opierać się na','The film is based on a true story.','Film opiera się na prawdziwej historii.','based ON — nie „based at”.',25),
  ('rozszerzona','leave a mark','zwrot','zostawić ślad','Her work left a mark on European cinema.','Jej twórczość zostawiła ślad w kinie europejskim.','Idiom idealny do zakończenia rozprawki.',26),
  ('rozszerzona','stand the test of time','zwrot','przetrwać próbę czasu','Few films stand the test of time.','Niewiele filmów przetrwa próbę czasu.','Bardzo dobrze punktowany idiom.',27)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
