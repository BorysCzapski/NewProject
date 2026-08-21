-- ============================================================================
-- supabase/seed/matura-es/16_vocab_przyroda_spoleczenstwo_realia.sql
-- Spanish vocabulary: Świat przyrody, Życie społeczne, Kraje hiszpańskojęzyczne.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
--
-- The last block is realioznawstwo — facts about the Spanish-speaking world
-- rather than vocabulary in the usual sense. It is filed as vocabulary because
-- that is where a student goes looking for it, and because the terms really do
-- turn up as words in reading and listening texts.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'es' and slug in ('swiat-przyrody', 'zycie-spoleczne', 'realioznawstwo')
);

-- ----------------------------------------------------------------------------
-- 13. Świat przyrody
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'swiat-przyrody') t,
(values
  ('podstawowa','el tiempo','rz.','pogoda','¿Qué tiempo hace hoy?','Jaka jest dziś pogoda?','To samo słowo znaczy „czas”. Pogoda przez HACER: hace sol.',1),
  ('podstawowa','hace sol','zwrot','jest słonecznie','Hoy hace sol y calor.','Dziś jest słonecznie i ciepło.','Pogoda: HACER + rzeczownik (sol, frío, calor, viento).',2),
  ('podstawowa','llover','cz.','padać (deszcz)','Está lloviendo desde la mañana.','Pada od rana.','Nieregularny i bezosobowy: llueve. la lluvia = deszcz.',3),
  ('podstawowa','nevar','cz.','padać (śnieg)','En invierno nieva poco aquí.','Zimą mało tu pada śnieg.','Bezosobowy: nieva. la nieve = śnieg.',4),
  ('podstawowa','la nube','rz.','chmura','El cielo está lleno de nubes.','Niebo jest pełne chmur.','nublado = pochmurny.',5),
  ('podstawowa','el viento','rz.','wiatr','Hace mucho viento en la costa.','Na wybrzeżu bardzo wieje.','hace viento, nie „es viento”.',6),
  ('podstawowa','la temperatura','rz.','temperatura','La temperatura baja por la noche.','Temperatura spada w nocy.','bajar/subir = spadać/rosnąć.',7),
  ('podstawowa','el árbol','rz.','drzewo','Plantamos un árbol en el jardín.','Zasadziliśmy drzewo w ogrodzie.','Liczba mnoga: los árboles — tilda zostaje.',8),
  ('podstawowa','la flor','rz.','kwiat','Las flores del balcón se han secado.','Kwiaty na balkonie uschły.','secarse = wyschnąć.',9),
  ('podstawowa','el bosque','rz.','las','El bosque es enorme.','Las jest ogromny.','la selva = las tropikalny, dżungla.',10),
  ('podstawowa','la montaña','rz.','góra','Pasamos el fin de semana en la montaña.','Weekend spędziliśmy w górach.','Często liczba pojedyncza tam, gdzie po polsku mnoga.',11),
  ('podstawowa','el río','rz.','rzeka','El río pasa por el centro.','Rzeka przepływa przez centrum.','pasar por = przechodzić, przepływać przez.',12),
  ('podstawowa','el mar','rz.','morze','El mar está muy tranquilo hoy.','Morze jest dziś bardzo spokojne.','Zwykle rodzaj męski; w poezji i żegludze bywa żeński.',13),
  ('podstawowa','el animal','rz.','zwierzę','Es un animal en peligro de extinción.','To zwierzę zagrożone wyginięciem.','en peligro de extinción = zagrożony wyginięciem.',14),
  ('podstawowa','el pájaro','rz.','ptak','Los pájaros vuelven en primavera.','Ptaki wracają wiosną.','el ave (rodzaj żeński, ale z el) = ptak w sensie ogólnym.',15),
  ('podstawowa','el medio ambiente','zwrot','środowisko','Hay que cuidar el medio ambiente.','Trzeba dbać o środowisko.','Utrwal jako całość — nigdy samo medio.',16),
  ('podstawowa','contaminar','cz.','zanieczyszczać','Los coches contaminan mucho.','Samochody bardzo zanieczyszczają.','la contaminación = zanieczyszczenie.',17),
  ('podstawowa','reciclar','cz.','poddawać recyklingowi','Reciclamos el papel y el vidrio.','Segregujemy papier i szkło.','el reciclaje = recykling.',18),
  ('podstawowa','la basura','rz.','śmieci','Saca la basura, por favor.','Wynieś śmieci, proszę.','sacar la basura = wynosić śmieci. Liczba pojedyncza!',19),
  ('podstawowa','ahorrar agua','zwrot','oszczędzać wodę','Es importante ahorrar agua en verano.','Latem ważne jest oszczędzanie wody.','el agua jest żeńskie, ale bierze el (akcentowane a-).',20),
  ('rozszerzona','el cambio climático','zwrot','zmiana klimatu','El cambio climático ya es visible.','Zmiana klimatu jest już widoczna.','Najczęstszy temat rozprawki na rozszerzeniu.',21),
  ('rozszerzona','el calentamiento global','zwrot','globalne ocieplenie','El calentamiento global derrite los glaciares.','Globalne ocieplenie topi lodowce.','derretir = topić; el glaciar = lodowiec.',22),
  ('rozszerzona','la sequía','rz.','susza','La sequía afecta al sur del país.','Susza dotyka południe kraju.','Poważny problem w Hiszpanii — częsty w tekstach.',23),
  ('rozszerzona','la inundación','rz.','powódź','Las inundaciones destrozaron el pueblo.','Powodzie zniszczyły miasteczko.','inundar = zalewać.',24),
  ('rozszerzona','el incendio','rz.','pożar','Los incendios forestales son cada vez más frecuentes.','Pożary lasów są coraz częstsze.','forestal = leśny. NIE myl z el fuego (ogień).',25),
  ('rozszerzona','el terremoto','rz.','trzęsienie ziemi','El terremoto se sintió en toda la región.','Trzęsienie ziemi odczuto w całym regionie.','sentirse = być odczuwanym.',26),
  ('rozszerzona','los recursos naturales','zwrot','zasoby naturalne','Los recursos naturales no son infinitos.','Zasoby naturalne nie są nieskończone.','Kluczowy zwrot w argumentacji ekologicznej.',27),
  ('rozszerzona','las energías renovables','zwrot','energie odnawialne','España apuesta por las energías renovables.','Hiszpania stawia na energie odnawialne.','apostar POR = stawiać na.',28),
  ('rozszerzona','el desarrollo sostenible','zwrot','zrównoważony rozwój','El desarrollo sostenible exige cambios.','Zrównoważony rozwój wymaga zmian.','Bardzo wysoko punktowany zwrot.',29),
  ('rozszerzona','la huella de carbono','zwrot','ślad węglowy','Volar aumenta mucho la huella de carbono.','Latanie mocno zwiększa ślad węglowy.','la huella = ślad — to samo słowo w dejar huella.',30),
  ('rozszerzona','desechable','przym.','jednorazowy','Hay que evitar los plásticos desechables.','Trzeba unikać plastiku jednorazowego.','evitar = unikać.',31),
  ('rozszerzona','concienciar','cz.','uświadamiać','Las campañas concienician a la población.','Kampanie uświadamiają społeczeństwo.','la concienciación = podnoszenie świadomości.',32)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 14. Życie społeczne
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'zycie-spoleczne') t,
(values
  ('podstawowa','la sociedad','rz.','społeczeństwo','La sociedad ha cambiado mucho.','Społeczeństwo bardzo się zmieniło.','social = społeczny.',1),
  ('podstawowa','la gente','rz.','ludzie','La gente aquí es muy amable.','Ludzie tutaj są bardzo mili.','LICZBA POJEDYNCZA: la gente ES, nie son. Klasyczny błąd Polaków.',2),
  ('podstawowa','el problema','rz.','problem','Es un problema serio.','To poważny problem.','RODZAJ MĘSKI mimo końcówki -a: el problema, este problema.',3),
  ('podstawowa','ayudar','cz.','pomagać','Ayudo a mis vecinos mayores.','Pomagam starszym sąsiadom.','ayudar A alguien A hacer algo.',4),
  ('podstawowa','el voluntario','rz.','wolontariusz','Trabaja de voluntaria en una ONG.','Pracuje jako wolontariuszka w organizacji pozarządowej.','la ONG = organizacja pozarządowa.',5),
  ('podstawowa','la ayuda','rz.','pomoc','Necesitamos tu ayuda.','Potrzebujemy twojej pomocy.','pedir ayuda = prosić o pomoc.',6),
  ('podstawowa','el derecho','rz.','prawo (do czegoś)','Todos tenemos derecho a la educación.','Wszyscy mamy prawo do edukacji.','derecho A algo. Też: kierunek studiów prawo.',7),
  ('podstawowa','la ley','rz.','ustawa, prawo','La ley entra en vigor en enero.','Ustawa wchodzi w życie w styczniu.','entrar en vigor = wchodzić w życie.',8),
  ('podstawowa','la policía','rz.','policja','La policía llegó en cinco minutos.','Policja przyjechała w pięć minut.','Rodzaj żeński, liczba pojedyncza dla całej instytucji.',9),
  ('podstawowa','el gobierno','rz.','rząd','El gobierno anunció nuevas medidas.','Rząd ogłosił nowe działania.','la medida = środek, działanie.',10),
  ('podstawowa','votar','cz.','głosować','Voté por primera vez el año pasado.','Głosowałem pierwszy raz w zeszłym roku.','el voto = głos; las elecciones = wybory.',11),
  ('podstawowa','la manifestación','rz.','demonstracja','Hubo una manifestación en el centro.','W centrum była demonstracja.','hubo = był (od haber, pretérito).',12),
  ('podstawowa','la religión','rz.','religia','Respeto todas las religiones.','Szanuję wszystkie religie.','respetar = szanować.',13),
  ('rozszerzona','la desigualdad','rz.','nierówność','La desigualdad económica ha crecido.','Nierówności ekonomiczne wzrosły.','igual = równy; la igualdad = równość.',14),
  ('rozszerzona','la pobreza','rz.','ubóstwo','La pobreza infantil sigue siendo alta.','Ubóstwo dzieci wciąż jest wysokie.','seguir + gerundio = nadal coś robić.',15),
  ('rozszerzona','la inmigración','rz.','imigracja','La inmigración ha transformado las ciudades.','Imigracja przekształciła miasta.','el inmigrante = imigrant; emigrar = emigrować.',16),
  ('rozszerzona','la integración','rz.','integracja','La integración exige esfuerzo por ambas partes.','Integracja wymaga wysiłku obu stron.','ambas partes = obie strony.',17),
  ('rozszerzona','la discriminación','rz.','dyskryminacja','Denunciaron un caso de discriminación.','Zgłosili przypadek dyskryminacji.','denunciar = zgłaszać, donosić.',18),
  ('rozszerzona','el prejuicio','rz.','uprzedzenie','Hay que combatir los prejuicios.','Trzeba zwalczać uprzedzenia.','combatir = zwalczać. FAŁSZYWY PRZYJACIEL: nie „przesąd” (superstición).',19),
  ('rozszerzona','la solidaridad','rz.','solidarność','La solidaridad vecinal fue enorme.','Solidarność sąsiedzka była ogromna.','solidario = solidarny.',20),
  ('rozszerzona','el envejecimiento','rz.','starzenie się','El envejecimiento de la población preocupa.','Starzenie się społeczeństwa niepokoi.','envejecer = starzeć się.',21),
  ('rozszerzona','la tasa de natalidad','zwrot','wskaźnik urodzeń','España tiene una tasa de natalidad muy baja.','Hiszpania ma bardzo niski wskaźnik urodzeń.','la tasa = wskaźnik, stopa.',22),
  ('rozszerzona','el paro juvenil','zwrot','bezrobocie wśród młodych','El paro juvenil es un problema estructural.','Bezrobocie młodych to problem strukturalny.','Bardzo częsty temat hiszpańskich tekstów.',23),
  ('rozszerzona','la ciudadanía','rz.','obywatele, obywatelstwo','La ciudadanía exige transparencia.','Obywatele domagają się przejrzystości.','el ciudadano = obywatel.',24),
  ('rozszerzona','la libertad de expresión','zwrot','wolność słowa','La libertad de expresión tiene límites.','Wolność słowa ma granice.','el límite = granica, ograniczenie.',25),
  ('rozszerzona','fomentar la convivencia','zwrot','sprzyjać wspólnemu życiu','Estas iniciativas fomentan la convivencia.','Te inicjatywy sprzyjają współżyciu.','Bardzo dobra kolokacja do zakończenia rozprawki.',26),
  ('rozszerzona','poner de manifiesto','zwrot','uwidaczniać, ujawniać','La pandemia puso de manifiesto las carencias.','Pandemia uwidoczniła braki.','la carencia = brak, niedostatek. Formuła typowa dla publicystyki.',27),
  ('rozszerzona','a corto plazo','zwrot','w krótkiej perspektywie','A corto plazo la medida funciona.','W krótkiej perspektywie ten środek działa.','Para: a largo plazo = w dłuższej perspektywie. Idealne do rozprawki.',28)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 15. Kraje hiszpańskojęzyczne (realioznawstwo)
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'realioznawstwo') t,
(values
  ('podstawowa','la comunidad autónoma','zwrot','wspólnota autonomiczna','España tiene diecisiete comunidades autónomas.','Hiszpania ma siedemnaście wspólnot autonomicznych.','Odpowiednik polskiego województwa, ale z dużo szerszą autonomią.',1),
  ('podstawowa','la siesta','rz.','sjesta','La siesta ya no es tan común en las ciudades.','Sjesta nie jest już tak powszechna w miastach.','Uwaga: to stereotyp, w tekstach często obalany.',2),
  ('podstawowa','las tapas','rz.','tapas','Salimos de tapas los viernes.','W piątki chodzimy na tapas.','ir/salir de tapas = chodzić po barach na przekąski.',3),
  ('podstawowa','la paella','rz.','paella','La paella es originaria de Valencia.','Paella pochodzi z Walencji.','originario DE = pochodzący z. Nie jest daniem ogólnohiszpańskim.',4),
  ('podstawowa','el flamenco','rz.','flamenco','El flamenco nació en Andalucía.','Flamenco narodziło się w Andaluzji.','nacer = rodzić się, powstawać.',5),
  ('podstawowa','la Nochevieja','rz.','sylwester','En Nochevieja se comen doce uvas.','W sylwestra je się dwanaście winogron.','Zwyczaj dwunastu winogron — klasyk zadań o świętach.',6),
  ('podstawowa','los Reyes Magos','zwrot','Trzej Królowie','Los niños reciben regalos el 6 de enero.','Dzieci dostają prezenty 6 stycznia.','W Hiszpanii prezenty daje się 6 stycznia, nie w Wigilię.',7),
  ('podstawowa','la Semana Santa','zwrot','Wielki Tydzień','Las procesiones de Semana Santa son famosas.','Procesje Wielkiego Tygodnia są słynne.','la procesión = procesja.',8),
  ('podstawowa','el euro','rz.','euro','En España se paga en euros.','W Hiszpanii płaci się w euro.','W Ameryce Łacińskiej: el peso, el sol, el bolívar i inne.',9),
  ('podstawowa','el castellano','rz.','język hiszpański (kastylijski)','En Cataluña se habla catalán y castellano.','W Katalonii mówi się po katalońsku i po hiszpańsku.','castellano = español; w Hiszpanii często wolą pierwszy termin.',10),
  ('rozszerzona','el catalán','rz.','język kataloński','El catalán es lengua cooficial.','Kataloński jest językiem współurzędowym.','Inne: el gallego, el euskera (baskijski).',11),
  ('rozszerzona','Hispanoamérica','rz.','Ameryka Hiszpańskojęzyczna','Hispanoamérica abarca casi veinte países.','Ameryka hiszpańskojęzyczna obejmuje prawie dwadzieścia krajów.','abarcar = obejmować.',12),
  ('rozszerzona','el voseo','rz.','użycie vos zamiast tú','En Argentina se usa el voseo: vos tenés.','W Argentynie używa się vos: vos tenés.','Kluczowa różnica dialektalna — pojawia się w nagraniach.',13),
  ('rozszerzona','el seseo','rz.','wymowa c/z jak s','El seseo es normal en toda América.','Seseo jest normą w całej Ameryce.','Dlatego casa i caza brzmią tam identycznie.',14),
  ('rozszerzona','el Día de Muertos','zwrot','Dzień Zmarłych (Meksyk)','El Día de Muertos es Patrimonio de la Humanidad.','Dzień Zmarłych jest na liście UNESCO.','Meksykańskie święto — kolorowe, nie żałobne.',15),
  ('rozszerzona','la Real Academia Española','zwrot','Królewska Akademia Hiszpańska','La RAE regula la norma del español.','RAE reguluje normę języka hiszpańskiego.','Skrót: la RAE. Odpowiednik Rady Języka Polskiego.',16),
  ('rozszerzona','el Camino de Santiago','zwrot','Droga św. Jakuba','Miles de peregrinos hacen el Camino cada año.','Tysiące pielgrzymów co roku pokonują Camino.','el peregrino = pielgrzym. Bardzo częsty temat tekstów.',17),
  ('rozszerzona','el mestizaje','rz.','mieszanie się kultur','El mestizaje define la identidad latinoamericana.','Mieszanie kultur definiuje tożsamość latynoamerykańską.','la identidad = tożsamość.',18),
  ('rozszerzona','el legado','rz.','spuścizna','El legado árabe se ve en la arquitectura.','Spuściznę arabską widać w architekturze.','Ślad ośmiu wieków obecności arabskiej w Hiszpanii.',19),
  ('rozszerzona','la sobremesa','rz.','rozmowa po posiłku','La sobremesa puede durar horas.','Rozmowa po obiedzie może trwać godzinami.','Nie ma polskiego odpowiednika — świetny przykład różnicy kulturowej.',20)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
