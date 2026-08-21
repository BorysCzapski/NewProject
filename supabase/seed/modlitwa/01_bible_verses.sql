-- ============================================================================
-- supabase/seed/modlitwa/01_bible_verses.sql
-- Kuratorowana pula wersetów do losowania „wersetu dnia”.
--
-- To jest WYBÓR krótkich cytatów, a nie tekst Pisma Świętego — zgodnie z
-- zasadą ze specyfikacji („nie przechowywać pełnych tekstów Biblii, jedynie
-- odwoływać się do źródeł”). Pełne rozdziały czyta się w Piśmie albo w
-- czytaniach dnia, które aplikacja pobiera osobno.
--
-- season = NULL  -> werset „na każdy czas” (pula domyślna)
-- season = ...   -> pula okresowa; lib/modlitwa/verses.ts woli ją w danym
--                   okresie liturgicznym, dzięki czemu w Adwencie, Wielkim
--                   Poście i Wielkanocy werset dnia pasuje do liturgii.
--
-- Uruchomienie:  node scripts/db.mjs sql supabase/seed/modlitwa/01_bible_verses.sql
-- Idempotentne: powtórne uruchomienie nic nie zmienia (on conflict do nothing).
--
-- Uwaga redakcyjna: brzmienie cytatów odpowiada Biblii Tysiąclecia; przed
-- publikacją warto je zweryfikować z wydaniem drukowanym lub z biblia.deon.pl.
-- ============================================================================

insert into bible_verses (reference, text, translation, themes, season) values
  ('J 3, 16', 'Tak bowiem Bóg umiłował świat, że Syna swego Jednorodzonego dał, aby każdy, kto w Niego wierzy, nie zginął, ale miał życie wieczne.', 'Biblia Tysiąclecia', '{milosc,zbawienie}', null),
  ('Ps 23, 1', 'Pan jest moim pasterzem, nie brak mi niczego.', 'Biblia Tysiąclecia', '{zaufanie,opieka}', null),
  ('Ps 27, 1', 'Pan światłem i zbawieniem moim: kogóż mam się lękać?', 'Biblia Tysiąclecia', '{odwaga,zaufanie}', null),
  ('Flp 4, 13', 'Wszystko mogę w Tym, który mnie umacnia.', 'Biblia Tysiąclecia', '{moc,zaufanie}', null),
  ('Mt 11, 28', 'Przyjdźcie do Mnie wszyscy, którzy utrudzeni i obciążeni jesteście, a Ja was pokrzepię.', 'Biblia Tysiąclecia', '{pocieszenie,odpoczynek}', null),
  ('Mt 6, 33', 'Starajcie się naprzód o królestwo Boga i o Jego sprawiedliwość, a to wszystko będzie wam dodane.', 'Biblia Tysiąclecia', '{zaufanie,priorytety}', null),
  ('Rz 8, 28', 'Bóg z tymi, którzy Go miłują, współdziała we wszystkim dla ich dobra.', 'Biblia Tysiąclecia', '{opatrznosc,zaufanie}', null),
  ('Rz 8, 31', 'Jeżeli Bóg z nami, któż przeciwko nam?', 'Biblia Tysiąclecia', '{odwaga}', null),
  ('1 Kor 13, 4-5', 'Miłość cierpliwa jest, łaskawa jest. Miłość nie zazdrości, nie szuka poklasku, nie unosi się pychą.', 'Biblia Tysiąclecia', '{milosc}', null),
  ('1 Kor 13, 13', 'Tak więc trwają wiara, nadzieja, miłość — te trzy: z nich zaś największa jest miłość.', 'Biblia Tysiąclecia', '{milosc,nadzieja}', null),
  ('Ps 46, 2', 'Bóg jest dla nas ucieczką i mocą: łatwo znaleźć u Niego pomoc w trudnościach.', 'Biblia Tysiąclecia', '{pocieszenie,moc}', null),
  ('Iz 41, 10', 'Nie lękaj się, bo Ja jestem z tobą; nie trwóż się, bom Ja twoim Bogiem.', 'Biblia Tysiąclecia', '{odwaga,obecnosc}', null),
  ('Iz 40, 31', 'Ci, co zaufali Panu, odzyskują siły, otrzymują skrzydła jak orły.', 'Biblia Tysiąclecia', '{wytrwalosc,zaufanie}', null),
  ('Jr 29, 11', 'Jestem bowiem świadomy zamiarów, jakie zamyślam co do was — zamiarów pełnych pokoju, a nie zguby.', 'Biblia Tysiąclecia', '{nadzieja,opatrznosc}', null),
  ('Prz 3, 5', 'Z całego serca Bogu zaufaj, nie polegaj na swoim rozsądku.', 'Biblia Tysiąclecia', '{zaufanie,madrosc}', null),
  ('Ps 91, 1', 'Kto przebywa w pieczy Najwyższego i w cieniu Wszechmocnego mieszka.', 'Biblia Tysiąclecia', '{opieka,zaufanie}', null),
  ('Mt 5, 3', 'Błogosławieni ubodzy w duchu, albowiem do nich należy królestwo niebieskie.', 'Biblia Tysiąclecia', '{blogoslawienstwa,pokora}', null),
  ('Mt 5, 9', 'Błogosławieni, którzy wprowadzają pokój, albowiem oni będą nazwani synami Bożymi.', 'Biblia Tysiąclecia', '{pokoj,blogoslawienstwa}', null),
  ('J 14, 6', 'Ja jestem drogą i prawdą, i życiem. Nikt nie przychodzi do Ojca inaczej jak tylko przeze Mnie.', 'Biblia Tysiąclecia', '{wiara,droga}', null),
  ('J 15, 12', 'To jest moje przykazanie, abyście się wzajemnie miłowali, tak jak Ja was umiłowałem.', 'Biblia Tysiąclecia', '{milosc,przykazanie}', null),
  ('J 8, 12', 'Ja jestem światłością świata. Kto idzie za Mną, nie będzie chodził w ciemności, lecz będzie miał światło życia.', 'Biblia Tysiąclecia', '{swiatlo,wiara}', null),
  ('Ps 118, 24', 'Oto dzień, który Pan uczynił: radujmy się zeń i weselmy!', 'Biblia Tysiąclecia', '{radosc,wdziecznosc}', null),
  ('Ps 121, 1-2', 'Wznoszę swe oczy ku górom: Skądże nadejdzie mi pomoc? Pomoc mi przyjdzie od Pana, co stworzył niebo i ziemię.', 'Biblia Tysiąclecia', '{zaufanie,pomoc}', null),
  ('Mt 7, 7', 'Proście, a będzie wam dane; szukajcie, a znajdziecie; kołaczcie, a otworzą wam.', 'Biblia Tysiąclecia', '{modlitwa,wytrwalosc}', null),
  ('Mt 22, 37-39', 'Będziesz miłował Pana Boga swego całym swoim sercem. (…) Będziesz miłował swego bliźniego jak siebie samego.', 'Biblia Tysiąclecia', '{milosc,przykazanie}', null),
  ('Łk 1, 37', 'Dla Boga bowiem nie ma nic niemożliwego.', 'Biblia Tysiąclecia', '{wiara,nadzieja}', null),
  ('Flp 4, 6-7', 'O nic się już zbytnio nie troskajcie, ale w każdej sprawie wasze prośby przedstawiajcie Bogu. A pokój Boży, który przewyższa wszelki umysł, będzie strzegł waszych serc.', 'Biblia Tysiąclecia', '{pokoj,modlitwa}', null),
  ('1 Tes 5, 16-18', 'Zawsze się radujcie, nieustannie się módlcie! W każdym położeniu dziękujcie.', 'Biblia Tysiąclecia', '{radosc,modlitwa,wdziecznosc}', null),
  ('Hbr 11, 1', 'Wiara zaś jest poręką tych dóbr, których się spodziewamy, dowodem tych rzeczywistości, których nie widzimy.', 'Biblia Tysiąclecia', '{wiara}', null),
  ('Hbr 13, 8', 'Jezus Chrystus wczoraj i dziś, ten sam także na wieki.', 'Biblia Tysiąclecia', '{wiara,stalosc}', null),
  ('1 P 5, 7', 'Wszystkie troski wasze przerzućcie na Niego, gdyż Jemu zależy na was.', 'Biblia Tysiąclecia', '{zaufanie,pocieszenie}', null),
  ('1 J 4, 16', 'Bóg jest miłością: kto trwa w miłości, trwa w Bogu, a Bóg trwa w nim.', 'Biblia Tysiąclecia', '{milosc}', null),
  ('Ap 3, 20', 'Oto stoję u drzwi i kołaczę: jeśli kto posłyszy mój głos i drzwi otworzy, wejdę do niego.', 'Biblia Tysiąclecia', '{nawrocenie,obecnosc}', null),
  ('Ps 51, 12', 'Stwórz, o Boże, we mnie serce czyste i odnów w mojej piersi ducha niezwyciężonego.', 'Biblia Tysiąclecia', '{nawrocenie,odnowa}', null),
  ('Ps 34, 19', 'Pan jest blisko skruszonych w sercu i wybawia złamanych na duchu.', 'Biblia Tysiąclecia', '{pocieszenie,milosierdzie}', null),
  ('Koh 3, 1', 'Wszystko ma swój czas i jest wyznaczona godzina na wszystkie sprawy pod niebem.', 'Biblia Tysiąclecia', '{madrosc,cierpliwosc}', null),
  ('Mi 6, 8', 'Powiedziano ci, człowiecze, co jest dobre: abyś czynił sprawiedliwość, umiłował życzliwość i pokornie chodził z Bogiem twoim.', 'Biblia Tysiąclecia', '{sprawiedliwosc,pokora}', null),
  ('Ps 103, 8', 'Miłosierny jest Pan i łaskawy, nieskory do gniewu i bardzo łagodny.', 'Biblia Tysiąclecia', '{milosierdzie}', null),
  ('Mt 28, 20', 'A oto Ja jestem z wami przez wszystkie dni, aż do skończenia świata.', 'Biblia Tysiąclecia', '{obecnosc,pocieszenie}', null),
  ('Ga 5, 22', 'Owocem zaś ducha jest: miłość, radość, pokój, cierpliwość, uprzejmość, dobroć, wierność.', 'Biblia Tysiąclecia', '{duch,cnoty}', null),
  ('Ef 4, 32', 'Bądźcie dla siebie nawzajem dobrzy i miłosierni! Przebaczajcie sobie, tak jak i Bóg nam przebaczył w Chrystusie.', 'Biblia Tysiąclecia', '{przebaczenie,milosierdzie}', null),
  ('Kol 3, 15', 'Sercami waszymi niech rządzi pokój Chrystusowy.', 'Biblia Tysiąclecia', '{pokoj}', null),
  ('2 Tm 1, 7', 'Albowiem nie dał nam Bóg ducha bojaźni, ale mocy i miłości, i trzeźwego myślenia.', 'Biblia Tysiąclecia', '{odwaga,duch}', null),
  ('Ps 63, 2', 'Boże, Ty Boże mój, Ciebie szukam; Ciebie pragnie moja dusza.', 'Biblia Tysiąclecia', '{tesknota,modlitwa}', null),
  ('Łk 6, 36', 'Bądźcie miłosierni, jak Ojciec wasz jest miłosierny.', 'Biblia Tysiąclecia', '{milosierdzie}', null),
  ('Mt 6, 21', 'Bo gdzie jest twój skarb, tam będzie i serce twoje.', 'Biblia Tysiąclecia', '{serce,madrosc}', null),
  ('J 16, 33', 'Na świecie doznacie ucisku, ale miejcie odwagę: Jam zwyciężył świat.', 'Biblia Tysiąclecia', '{odwaga,nadzieja}', null),
  ('Ps 37, 5', 'Powierz Panu swoją drogę i zaufaj Mu: On sam będzie działał.', 'Biblia Tysiąclecia', '{zaufanie}', null),
  ('Iz 43, 1', 'Nie lękaj się, bo cię wykupiłem, wezwałem cię po imieniu; tyś mój!', 'Biblia Tysiąclecia', '{tozsamosc,zaufanie}', null),
  ('Ps 42, 2', 'Jak łania pragnie wody ze strumieni, tak dusza moja pragnie Ciebie, Boże.', 'Biblia Tysiąclecia', '{tesknota,modlitwa}', null),
  ('Mk 11, 24', 'Wszystko, o co w modlitwie prosicie, stanie się wam, tylko wierzcie, że otrzymacie.', 'Biblia Tysiąclecia', '{modlitwa,wiara}', null),
  ('Mt 18, 20', 'Bo gdzie są dwaj albo trzej zebrani w imię moje, tam jestem pośród nich.', 'Biblia Tysiąclecia', '{wspolnota,obecnosc}', null),
  ('Ps 119, 105', 'Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.', 'Biblia Tysiąclecia', '{slowo,swiatlo}', null),
  ('Rz 12, 12', 'Weselcie się nadzieją! W ucisku bądźcie cierpliwi, w modlitwie — wytrwali.', 'Biblia Tysiąclecia', '{nadzieja,wytrwalosc,modlitwa}', null),
  ('Rz 12, 21', 'Nie daj się zwyciężyć złu, ale zło dobrem zwyciężaj!', 'Biblia Tysiąclecia', '{dobro,walka}', null),
  ('2 Kor 12, 9', 'Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali.', 'Biblia Tysiąclecia', '{laska,slabosc}', null),
  ('Ps 130, 1-2', 'Z głębokości wołam do Ciebie, Panie, o Panie, słuchaj głosu mego!', 'Biblia Tysiąclecia', '{modlitwa,ufnosc}', null),
  ('Ps 139, 14', 'Dziękuję Ci, że mnie stworzyłeś tak cudownie, godne podziwu są Twoje dzieła.', 'Biblia Tysiąclecia', '{wdziecznosc,godnosc}', null),
  ('Jk 1, 22', 'Wprowadzajcie zaś słowo w czyn, a nie bądźcie tylko słuchaczami oszukującymi samych siebie.', 'Biblia Tysiąclecia', '{czyn,slowo}', null),
  ('Ps 145, 18', 'Pan jest blisko wszystkich, którzy Go wzywają, wszystkich wzywających Go szczerze.', 'Biblia Tysiąclecia', '{modlitwa,obecnosc}', null),

  -- ——— Adwent ———
  ('Iz 7, 14', 'Oto Panna pocznie i porodzi Syna, i nazwie Go imieniem Emmanuel.', 'Biblia Tysiąclecia', '{oczekiwanie,proroctwo}', 'adwent'),
  ('Iz 40, 3', 'Przygotujcie na pustyni drogę dla Pana, wyrównajcie na pustkowiu gościniec naszemu Bogu!', 'Biblia Tysiąclecia', '{nawrocenie,oczekiwanie}', 'adwent'),
  ('Iz 9, 1', 'Naród kroczący w ciemnościach ujrzał światłość wielką.', 'Biblia Tysiąclecia', '{swiatlo,nadzieja}', 'adwent'),
  ('Mt 24, 42', 'Czuwajcie więc, bo nie wiecie, w którym dniu Pan wasz przyjdzie.', 'Biblia Tysiąclecia', '{czuwanie}', 'adwent'),
  ('Łk 1, 38', 'Oto ja służebnica Pańska, niech mi się stanie według twego słowa.', 'Biblia Tysiąclecia', '{maryja,posluszenstwo}', 'adwent'),
  ('Ap 22, 20', 'Zaiste, przyjdę niebawem. Amen. Przyjdź, Panie Jezu!', 'Biblia Tysiąclecia', '{oczekiwanie}', 'adwent'),
  ('So 3, 17', 'Pan, twój Bóg, jest pośród ciebie, Mocarz, który zbawia.', 'Biblia Tysiąclecia', '{obecnosc,radosc}', 'adwent'),
  ('Ps 25, 4', 'Daj mi poznać drogi Twoje, Panie, i naucz mnie Twoich ścieżek.', 'Biblia Tysiąclecia', '{droga,modlitwa}', 'adwent'),

  -- ——— Boże Narodzenie ———
  ('Łk 2, 10-11', 'Nie bójcie się! Oto zwiastuję wam radość wielką: dziś w mieście Dawida narodził się wam Zbawiciel, którym jest Mesjasz, Pan.', 'Biblia Tysiąclecia', '{radosc,narodzenie}', 'boze_narodzenie'),
  ('J 1, 14', 'A Słowo stało się ciałem i zamieszkało wśród nas.', 'Biblia Tysiąclecia', '{wcielenie}', 'boze_narodzenie'),
  ('Łk 2, 14', 'Chwała Bogu na wysokościach, a na ziemi pokój ludziom Jego upodobania.', 'Biblia Tysiąclecia', '{pokoj,chwala}', 'boze_narodzenie'),
  ('Iz 9, 5', 'Albowiem Dziecię nam się narodziło, Syn został nam dany.', 'Biblia Tysiąclecia', '{narodzenie,proroctwo}', 'boze_narodzenie'),
  ('J 1, 5', 'A światłość w ciemności świeci i ciemność jej nie ogarnęła.', 'Biblia Tysiąclecia', '{swiatlo,nadzieja}', 'boze_narodzenie'),
  ('Ga 4, 4', 'Gdy jednak nadeszła pełnia czasu, zesłał Bóg Syna swego, zrodzonego z niewiasty.', 'Biblia Tysiąclecia', '{wcielenie,czas}', 'boze_narodzenie'),

  -- ——— Wielki Post ———
  ('Jl 2, 13', 'Nawróćcie się do Pana Boga waszego! On bowiem jest łaskawy, miłosierny, nieskory do gniewu.', 'Biblia Tysiąclecia', '{nawrocenie,milosierdzie}', 'wielki_post'),
  ('Mt 4, 4', 'Nie samym chlebem żyje człowiek, lecz każdym słowem, które pochodzi z ust Bożych.', 'Biblia Tysiąclecia', '{post,slowo}', 'wielki_post'),
  ('Ps 51, 3', 'Zmiłuj się nade mną, Boże, w łaskawości swojej, w ogromie swej litości zgładź nieprawość moją.', 'Biblia Tysiąclecia', '{pokuta,milosierdzie}', 'wielki_post'),
  ('Mk 8, 34', 'Jeśli kto chce pójść za Mną, niech się zaprze samego siebie, niech weźmie krzyż swój i niech Mnie naśladuje.', 'Biblia Tysiąclecia', '{krzyz,nasladowanie}', 'wielki_post'),
  ('Iz 53, 5', 'Lecz On był przebity za nasze grzechy, zdruzgotany za nasze winy.', 'Biblia Tysiąclecia', '{meka,odkupienie}', 'wielki_post'),
  ('Łk 15, 20', 'A gdy był jeszcze daleko, ujrzał go jego ojciec i wzruszył się głęboko; wybiegł naprzeciw niego.', 'Biblia Tysiąclecia', '{powrot,milosierdzie}', 'wielki_post'),
  ('J 12, 24', 'Jeżeli ziarno pszenicy wpadłszy w ziemię nie obumrze, zostanie tylko samo, ale jeżeli obumrze, przynosi plon obfity.', 'Biblia Tysiąclecia', '{ofiara,owoc}', 'wielki_post'),
  ('2 Kor 5, 20', 'W imię Chrystusa prosimy: pojednajcie się z Bogiem!', 'Biblia Tysiąclecia', '{pojednanie}', 'wielki_post'),
  ('Mt 6, 6', 'Ty zaś, gdy chcesz się modlić, wejdź do swej izdebki, zamknij drzwi i módl się do Ojca twego, który jest w ukryciu.', 'Biblia Tysiąclecia', '{modlitwa,ukrycie}', 'wielki_post'),

  -- ——— Okres wielkanocny ———
  ('Mt 28, 6', 'Nie ma Go tu, bo zmartwychwstał, jak powiedział.', 'Biblia Tysiąclecia', '{zmartwychwstanie}', 'wielkanoc'),
  ('J 20, 29', 'Uwierzyłeś dlatego, że Mnie ujrzałeś? Błogosławieni, którzy nie widzieli, a uwierzyli.', 'Biblia Tysiąclecia', '{wiara}', 'wielkanoc'),
  ('1 Kor 15, 55', 'Gdzież jest, o śmierci, twoje zwycięstwo? Gdzież jest, o śmierci, twój oścień?', 'Biblia Tysiąclecia', '{zwyciestwo,nadzieja}', 'wielkanoc'),
  ('Łk 24, 32', 'Czy serce nie pałało w nas, kiedy rozmawiał z nami w drodze i Pisma nam wyjaśniał?', 'Biblia Tysiąclecia', '{spotkanie,slowo}', 'wielkanoc'),
  ('Kol 3, 1', 'Jeśliście więc razem z Chrystusem powstali z martwych, szukajcie tego, co w górze.', 'Biblia Tysiąclecia', '{nowe_zycie}', 'wielkanoc'),
  ('J 11, 25', 'Ja jestem zmartwychwstaniem i życiem. Kto we Mnie wierzy, choćby i umarł, żyć będzie.', 'Biblia Tysiąclecia', '{zmartwychwstanie,nadzieja}', 'wielkanoc'),
  ('Ps 118, 1', 'Dziękujcie Panu, bo jest dobry, bo Jego łaska trwa na wieki.', 'Biblia Tysiąclecia', '{wdziecznosc}', 'wielkanoc'),
  ('Dz 2, 32', 'Tego właśnie Jezusa wskrzesił Bóg, a my wszyscy jesteśmy tego świadkami.', 'Biblia Tysiąclecia', '{swiadectwo}', 'wielkanoc'),
  ('J 20, 21', 'Pokój wam! Jak Ojciec Mnie posłał, tak i Ja was posyłam.', 'Biblia Tysiąclecia', '{pokoj,posłanie}', 'wielkanoc')
on conflict (reference) do nothing;
