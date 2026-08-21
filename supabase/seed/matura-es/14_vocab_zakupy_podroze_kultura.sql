-- ============================================================================
-- supabase/seed/matura-es/14_vocab_zakupy_podroze_kultura.sql
-- Spanish vocabulary: Zakupy i usługi, Podróżowanie i turystyka, Kultura.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'es' and slug in ('zakupy-i-uslugi', 'podrozowanie-i-turystyka', 'kultura')
);

-- ----------------------------------------------------------------------------
-- 7. Zakupy i usługi
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'zakupy-i-uslugi') t,
(values
  ('podstawowa','la tienda','rz.','sklep','Hay una tienda de ropa en la esquina.','Na rogu jest sklep odzieżowy.','tienda de + towar: tienda de ropa, de deportes.',1),
  ('podstawowa','el supermercado','rz.','supermarket','Voy al supermercado los sábados.','W soboty chodzę do supermarketu.','ir A + miejsce; a + el = al.',2),
  ('podstawowa','el mercado','rz.','targ, rynek','En el mercado la fruta es más barata.','Na targu owoce są tańsze.','Też: rynek w sensie ekonomicznym.',3),
  ('podstawowa','el centro comercial','zwrot','centrum handlowe','Quedamos en el centro comercial.','Umawiamy się w centrum handlowym.','Bardzo częste miejsce spotkań w zadaniach.',4),
  ('podstawowa','la panadería','rz.','piekarnia','Compro el pan en la panadería.','Chleb kupuję w piekarni.','Końcówka -ería tworzy nazwy sklepów: pan → panadería.',5),
  ('podstawowa','la carnicería','rz.','sklep mięsny','La carnicería cierra a las dos.','Sklep mięsny zamyka o drugiej.','Ten sam wzór: carne → carnicería.',6),
  ('podstawowa','la farmacia','rz.','apteka','La farmacia de guardia está abierta toda la noche.','Apteka dyżurna jest otwarta całą noc.','de guardia = dyżurna.',7),
  ('podstawowa','el precio','rz.','cena','El precio incluye el IVA.','Cena zawiera VAT.','el IVA = hiszpański VAT.',8),
  ('podstawowa','barato','przym.','tani','Esta camiseta es muy barata.','Ta koszulka jest bardzo tania.','Przeciwieństwo: caro.',9),
  ('podstawowa','caro','przym.','drogi','Es demasiado caro para mí.','To dla mnie za drogie.','demasiado = zbyt, za bardzo.',10),
  ('podstawowa','las rebajas','rz.','wyprzedaże','En enero empiezan las rebajas.','W styczniu zaczynają się wyprzedaże.','ZAWSZE liczba mnoga. Ważny szczegół kulturowy: styczeń i lipiec.',11),
  ('podstawowa','el descuento','rz.','zniżka','Tienen un descuento del 20%.','Mają dwudziestoprocentową zniżkę.','descuento DEL x% — z rodzajnikiem.',12),
  ('podstawowa','gastar','cz.','wydawać (pieniądze)','Gasté demasiado el fin de semana.','W weekend wydałem za dużo.','NIE myl z pasar (spędzać czas).',13),
  ('podstawowa','pagar','cz.','płacić','¿Puedo pagar con tarjeta?','Mogę zapłacić kartą?','pagar CON tarjeta, EN efectivo (gotówką).',14),
  ('podstawowa','el efectivo','rz.','gotówka','Prefiero pagar en efectivo.','Wolę płacić gotówką.','en efectivo — utrwal jako całość.',15),
  ('podstawowa','la tarjeta de crédito','zwrot','karta kredytowa','Perdí la tarjeta de crédito.','Zgubiłem kartę kredytową.','tarjeta znaczy też „kartka” (świąteczna).',16),
  ('podstawowa','el probador','rz.','przymierzalnia','¿Dónde está el probador?','Gdzie jest przymierzalnia?','probarse la ropa = przymierzać ubranie.',17),
  ('podstawowa','la talla','rz.','rozmiar (ubrania)','¿Tiene una talla más grande?','Ma pan większy rozmiar?','Rozmiar butów to el número, nie la talla.',18),
  ('podstawowa','el recibo','rz.','paragon','Guarda el recibo por si acaso.','Zachowaj paragon na wszelki wypadek.','por si acaso = na wszelki wypadek.',19),
  ('podstawowa','devolver','cz.','zwrócić','Quiero devolver esta camisa.','Chcę zwrócić tę koszulę.','Nieregularny: devuelvo. la devolución = zwrot.',20),
  ('podstawowa','el escaparate','rz.','witryna sklepowa','Lo vi en el escaparate.','Widziałem to na wystawie.','ir de escaparates = oglądać wystawy.',21),
  ('podstawowa','el banco','rz.','bank','Tengo que ir al banco.','Muszę iść do banku.','To samo słowo znaczy „ławka”.',22),
  ('rozszerzona','la garantía','rz.','gwarancja','El móvil tiene dos años de garantía.','Telefon ma dwa lata gwarancji.','Kluczowe w zadaniach z reklamacją.',23),
  ('rozszerzona','la reclamación','rz.','reklamacja','Presenté una reclamación por escrito.','Złożyłem pisemną reklamację.','presentar una reclamación = złożyć reklamację. por escrito = na piśmie.',24),
  ('rozszerzona','quejarse','cz.','skarżyć się','Se quejó del mal servicio.','Poskarżył się na złą obsługę.','quejarse DE algo. la queja = skarga.',25),
  ('rozszerzona','defectuoso','przym.','wadliwy','El producto llegó defectuoso.','Produkt dotarł wadliwy.','el defecto = wada.',26),
  ('rozszerzona','el consumidor','rz.','konsument','Los consumidores exigen transparencia.','Konsumenci wymagają przejrzystości.','el consumo = konsumpcja, zużycie.',27),
  ('rozszerzona','el consumismo','rz.','konsumpcjonizm','El consumismo genera muchos residuos.','Konsumpcjonizm generuje dużo odpadów.','Stały temat rozprawki na rozszerzeniu.',28),
  ('rozszerzona','la publicidad','rz.','reklama','La publicidad influye en lo que compramos.','Reklama wpływa na to, co kupujemy.','influir EN algo. el anuncio = pojedyncza reklama.',29),
  ('rozszerzona','el envío','rz.','wysyłka','El envío es gratuito a partir de 50 euros.','Wysyłka jest darmowa od 50 euro.','a partir de = począwszy od.',30),
  ('rozszerzona','el plazo','rz.','termin','El plazo de devolución es de 14 días.','Termin zwrotu to 14 dni.','a plazos = na raty — inne znaczenie.',31),
  ('rozszerzona','ahorrar','cz.','oszczędzać','Ahorro para un viaje a México.','Oszczędzam na wyjazd do Meksyku.','ahorrar PARA algo. los ahorros = oszczędności.',32),
  ('rozszerzona','el comercio electrónico','zwrot','handel elektroniczny','El comercio electrónico ha desplazado a las tiendas pequeñas.','Handel elektroniczny wyparł małe sklepy.','desplazar = wypierać.',33),
  ('rozszerzona','salir caro','zwrot','wyjść drogo','Comprar barato a veces sale caro.','Kupowanie tanio czasem wychodzi drogo.','Idiom przydatny w rozprawce o konsumpcji.',34)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 8. Podróżowanie i turystyka
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'podrozowanie-i-turystyka') t,
(values
  ('podstawowa','el viaje','rz.','podróż','El viaje duró doce horas.','Podróż trwała dwanaście godzin.','viajar = podróżować. Buen viaje = szerokiej drogi.',1),
  ('podstawowa','el avión','rz.','samolot','Vamos en avión, es más rápido.','Lecimy samolotem, tak szybciej.','Środek transportu z EN: en avión, en tren, en coche. Ale: A PIE.',2),
  ('podstawowa','el vuelo','rz.','lot','El vuelo se retrasó dos horas.','Lot był opóźniony o dwie godziny.','retrasarse = opóźnić się. el retraso = opóźnienie.',3),
  ('podstawowa','el aeropuerto','rz.','lotnisko','Llegamos al aeropuerto con tiempo.','Dotarliśmy na lotnisko z zapasem.','con tiempo = z zapasem czasu.',4),
  ('podstawowa','la estación','rz.','dworzec, stacja','La estación de tren está cerca.','Dworzec kolejowy jest blisko.','To samo słowo znaczy „pora roku”.',5),
  ('podstawowa','el billete','rz.','bilet','Compré el billete por internet.','Kupiłem bilet przez internet.','W Ameryce Łacińskiej: el boleto. Też: banknot.',6),
  ('podstawowa','ida y vuelta','zwrot','w obie strony','Un billete de ida y vuelta, por favor.','Poproszę bilet w obie strony.','Tylko w jedną stronę: solo de ida.',7),
  ('podstawowa','el equipaje','rz.','bagaż','Facturamos el equipaje enseguida.','Od razu nadaliśmy bagaż.','facturar el equipaje = nadać bagaż. Liczba pojedyncza!',8),
  ('podstawowa','la maleta','rz.','walizka','Todavía no he hecho la maleta.','Jeszcze się nie spakowałem.','hacer la maleta = pakować się.',9),
  ('podstawowa','el hotel','rz.','hotel','Reservamos un hotel céntrico.','Zarezerwowaliśmy hotel w centrum.','céntrico = położony w centrum.',10),
  ('podstawowa','el alojamiento','rz.','zakwaterowanie','El precio incluye alojamiento y desayuno.','Cena obejmuje nocleg i śniadanie.','alojarse = zatrzymać się (w hotelu).',11),
  ('podstawowa','la habitación doble','zwrot','pokój dwuosobowy','Queremos una habitación doble con vistas.','Chcemy pokój dwuosobowy z widokiem.','con vistas al mar = z widokiem na morze.',12),
  ('podstawowa','reservar','cz.','rezerwować','He reservado mesa para cuatro.','Zarezerwowałem stolik dla czterech osób.','la reserva = rezerwacja.',13),
  ('podstawowa','el turista','rz.','turysta','La ciudad recibe millones de turistas.','Miasto przyjmuje miliony turystów.','Ta sama forma dla obu rodzajów: el/la turista.',14),
  ('podstawowa','visitar','cz.','zwiedzać, odwiedzać','Visitamos el museo del Prado.','Zwiedziliśmy Muzeum Prado.','Jedno słowo na „zwiedzać” i „odwiedzać”.',15),
  ('podstawowa','el monumento','rz.','zabytek','La ciudad está llena de monumentos.','Miasto jest pełne zabytków.','FAŁSZYWY PRZYJACIEL: nie tylko „pomnik”.',16),
  ('podstawowa','la playa','rz.','plaża','Pasamos el día en la playa.','Spędziliśmy dzień na plaży.','pasar el día = spędzić dzień.',17),
  ('podstawowa','el mapa','rz.','mapa','Necesito un mapa de la ciudad.','Potrzebuję mapy miasta.','RODZAJ MĘSKI mimo końcówki -a: el mapa, un mapa.',18),
  ('podstawowa','perderse','cz.','zgubić się','Nos perdimos en el casco antiguo.','Zgubiliśmy się na starówce.','Zwrotny. Bez zaimka perder = tracić, gubić.',19),
  ('podstawowa','el folleto','rz.','ulotka, folder','Cogí un folleto en la oficina de turismo.','Wziąłem folder w informacji turystycznej.','la oficina de turismo = informacja turystyczna.',20),
  ('podstawowa','el seguro','rz.','ubezpieczenie','Contraté un seguro de viaje.','Wykupiłem ubezpieczenie podróżne.','Jako przymiotnik seguro = pewny, bezpieczny.',21),
  ('podstawowa','hacer turismo','zwrot','zwiedzać','Fuimos a Sevilla a hacer turismo.','Pojechaliśmy do Sewilli zwiedzać.','ir A + bezokolicznik = jechać, żeby coś zrobić.',22),
  ('rozszerzona','el destino','rz.','cel podróży','Es un destino cada vez más popular.','To coraz popularniejszy kierunek.','cada vez más = coraz bardziej.',23),
  ('rozszerzona','el itinerario','rz.','plan podróży, trasa','Preparé un itinerario de cinco días.','Przygotowałem pięciodniowy plan.','Formalne, dobre w e-mailu organizacyjnym.',24),
  ('rozszerzona','el albergue','rz.','schronisko, hostel','Dormimos en un albergue juvenil.','Spaliśmy w schronisku młodzieżowym.','Też: schronisko na szlaku Camino de Santiago.',25),
  ('rozszerzona','la escala','rz.','przesiadka','El vuelo tiene una escala en Fráncfort.','Lot ma przesiadkę we Frankfurcie.','vuelo directo = lot bezpośredni.',26),
  ('rozszerzona','el retraso','rz.','opóźnienie','El retraso nos hizo perder la conexión.','Opóźnienie sprawiło, że straciliśmy przesiadkę.','hacer + bezokolicznik = sprawić, że.',27),
  ('rozszerzona','extraviar','cz.','zgubić (bagaż)','La compañía extravió mi maleta.','Linia zgubiła moją walizkę.','Formalne; typowe w reklamacji do przewoźnika.',28),
  ('rozszerzona','el turismo masivo','zwrot','turystyka masowa','El turismo masivo daña el centro histórico.','Turystyka masowa niszczy zabytkowe centrum.','dañar = niszczyć. Bardzo częsty temat rozprawki.',29),
  ('rozszerzona','la temporada alta','zwrot','sezon wysoki','En temporada alta los precios se disparan.','W sezonie ceny szybują.','dispararse = gwałtownie rosnąć.',30),
  ('rozszerzona','sostenible','przym.','zrównoważony','Apuestan por un turismo sostenible.','Stawiają na zrównoważoną turystykę.','apostar POR = stawiać na. Kluczowe słowo współczesnych tekstów.',31),
  ('rozszerzona','el desplazarse','cz.','przemieszczać się','Es fácil desplazarse en metro.','Łatwo przemieszczać się metrem.','Zwrotny, formalny odpowiednik moverse.',32),
  ('rozszerzona','madrugar','cz.','wstawać wcześnie','Tuvimos que madrugar para coger el tren.','Musieliśmy wstać wcześnie, żeby złapać pociąg.','Brak zwięzłego polskiego odpowiednika — jedno słowo zamiast trzech.',33),
  ('rozszerzona','estar de paso','zwrot','być przejazdem','Solo estoy de paso en Madrid.','Jestem w Madrycie tylko przejazdem.','Idiom z estar.',34)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 9. Kultura
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'kultura') t,
(values
  ('podstawowa','la película','rz.','film','La película dura dos horas.','Film trwa dwie godziny.','el cine = kino jako miejsce i jako sztuka.',1),
  ('podstawowa','el cine','rz.','kino','Vamos al cine el viernes.','W piątek idziemy do kina.','ir al cine — z rodzajnikiem.',2),
  ('podstawowa','la serie','rz.','serial','Estoy viendo una serie española.','Oglądam hiszpański serial.','estar + gerundio = czynność w toku.',3),
  ('podstawowa','el actor','rz.','aktor','El actor principal es muy conocido.','Główny aktor jest bardzo znany.','Żeńska forma: la actriz (nieregularna).',4),
  ('podstawowa','el director','rz.','reżyser','La dirige un director mexicano.','Reżyseruje go meksykański reżyser.','dirigir = reżyserować, kierować.',5),
  ('podstawowa','la música','rz.','muzyka','Escucho música mientras estudio.','Słucham muzyki, ucząc się.','escuchar música — bez przyimka.',6),
  ('podstawowa','la canción','rz.','piosenka','Esa canción me encanta.','Uwielbiam tę piosenkę.','encantar — składnia jak gustar, ale mocniejsze.',7),
  ('podstawowa','el cantante','rz.','piosenkarz','Es mi cantante favorita.','To moja ulubiona piosenkarka.','Ta sama forma dla obu rodzajów: el/la cantante.',8),
  ('podstawowa','el concierto','rz.','koncert','El concierto fue al aire libre.','Koncert był na wolnym powietrzu.','al aire libre = na wolnym powietrzu.',9),
  ('podstawowa','el grupo','rz.','zespół','Su grupo favorito toca en Madrid.','Jego ulubiony zespół gra w Madrycie.','tocar = grać (o muzykach).',10),
  ('podstawowa','el libro','rz.','książka','He leído el libro dos veces.','Przeczytałem tę książkę dwa razy.','leer — nieregularne participio: leído.',11),
  ('podstawowa','el escritor','rz.','pisarz','Es una escritora argentina.','To argentyńska pisarka.','Żeńska forma: la escritora.',12),
  ('podstawowa','la novela','rz.','powieść','La novela ganó un premio importante.','Powieść zdobyła ważną nagrodę.','FAŁSZYWY PRZYJACIEL: nie „nowela”. Nowela to el cuento.',13),
  ('podstawowa','el museo','rz.','muzeum','El museo abre a las diez.','Muzeum otwiera o dziesiątej.','Rodzaj męski: el museo.',14),
  ('podstawowa','el cuadro','rz.','obraz','Ese cuadro es de Goya.','Ten obraz jest Goi.','ser DE + autor = być czyjegoś autorstwa.',15),
  ('podstawowa','la exposición','rz.','wystawa','Hay una exposición de fotografía.','Jest wystawa fotografii.','Skrót: la expo.',16),
  ('podstawowa','el teatro','rz.','teatr','Fuimos al teatro el sábado.','W sobotę byliśmy w teatrze.','la obra de teatro = sztuka teatralna.',17),
  ('podstawowa','la entrada','rz.','bilet wstępu','Las entradas se agotaron.','Bilety się wyprzedały.','agotarse = wyprzedać się. Też: wejście.',18),
  ('podstawowa','la fiesta','rz.','święto, impreza','Las fiestas del pueblo son en agosto.','Święta miasteczka są w sierpniu.','Dwa znaczenia: świętowanie i święto lokalne.',19),
  ('podstawowa','la costumbre','rz.','zwyczaj','Es una costumbre muy antigua.','To bardzo stary zwyczaj.','como de costumbre = jak zwykle.',20),
  ('podstawowa','el periódico','rz.','gazeta','Leo el periódico por la mañana.','Rano czytam gazetę.','Synonim: el diario.',21),
  ('podstawowa','la noticia','rz.','wiadomość','Vi la noticia en internet.','Widziałem tę wiadomość w internecie.','las noticias = wiadomości (program).',22),
  ('rozszerzona','el patrimonio','rz.','dziedzictwo','Toledo es Patrimonio de la Humanidad.','Toledo to Dziedzictwo Ludzkości.','Patrimonio de la Humanidad = lista UNESCO.',23),
  ('rozszerzona','la obra','rz.','dzieło','Es la obra más conocida del autor.','To najbardziej znane dzieło autora.','Też: budowa, roboty drogowe.',24),
  ('rozszerzona','el estreno','rz.','premiera','El estreno fue un éxito rotundo.','Premiera była pełnym sukcesem.','estrenar = wypuszczać premierowo. rotundo = całkowity.',25),
  ('rozszerzona','el guion','rz.','scenariusz','El guion se basa en hechos reales.','Scenariusz opiera się na faktach.','basarse EN algo. Zapis bez tildy zgodnie z nową normą RAE.',26),
  ('rozszerzona','la trama','rz.','fabuła','La trama es previsible pero entretenida.','Fabuła jest przewidywalna, ale wciągająca.','previsible = przewidywalny; entretenido = wciągający.',27),
  ('rozszerzona','la crítica','rz.','recenzja, krytyka','La crítica alabó la interpretación.','Krytyka chwaliła kreację aktorską.','alabar = chwalić.',28),
  ('rozszerzona','el doblaje','rz.','dubbing','En España casi todo se emite doblado.','W Hiszpanii prawie wszystko nadaje się z dubbingiem.','Ważny szczegół kulturowy w porównaniach z Polską.',29),
  ('rozszerzona','los subtítulos','rz.','napisy','Prefiero verlo en versión original con subtítulos.','Wolę oglądać w oryginale z napisami.','versión original (V.O.) = wersja oryginalna.',30),
  ('rozszerzona','el ocio cultural','zwrot','rozrywka kulturalna','El ocio cultural es caro en las capitales.','Rozrywka kulturalna jest droga w stolicach.','Zwrot przydatny w rozprawce.',31),
  ('rozszerzona','difundir','cz.','rozpowszechniać','Las redes difunden la cultura popular.','Sieci rozpowszechniają kulturę popularną.','la difusión = rozpowszechnianie.',32),
  ('rozszerzona','imprescindible','przym.','niezbędny','Es una lectura imprescindible.','To lektura obowiązkowa.','Bardzo cenione słowo — mocno podnosi ocenę za zakres.',33),
  ('rozszerzona','dejar huella','zwrot','zostawić ślad','Su obra dejó huella en el cine europeo.','Jego twórczość zostawiła ślad w kinie europejskim.','Idiom idealny do zakończenia rozprawki.',34)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
