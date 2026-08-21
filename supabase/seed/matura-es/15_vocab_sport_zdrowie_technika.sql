-- ============================================================================
-- supabase/seed/matura-es/15_vocab_sport_zdrowie_technika.sql
-- Spanish vocabulary: Sport, Zdrowie, Nauka i technika.
-- Run 11_vocab_topics.sql first. Conventions: see 12_vocab_czlowiek_dom_edukacja.sql.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'es' and slug in ('sport', 'zdrowie', 'nauka-i-technika')
);

-- ----------------------------------------------------------------------------
-- 10. Sport
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'sport') t,
(values
  ('podstawowa','el deporte','rz.','sport','Hago deporte tres veces por semana.','Uprawiam sport trzy razy w tygodniu.','HACER deporte, nie „practicar sport”. Można też practicar un deporte.',1),
  ('podstawowa','el equipo','rz.','drużyna, sprzęt','Nuestro equipo ganó la final.','Nasza drużyna wygrała finał.','Dwa znaczenia: drużyna i sprzęt/wyposażenie.',2),
  ('podstawowa','el partido','rz.','mecz','El partido empieza a las nueve.','Mecz zaczyna się o dziewiątej.','Też: partia polityczna.',3),
  ('podstawowa','ganar','cz.','wygrać, zarabiać','Ganamos por dos a cero.','Wygraliśmy dwa do zera.','Trzy znaczenia: wygrać, zarabiać, zyskać.',4),
  ('podstawowa','perder','cz.','przegrać, zgubić','Perdimos el partido y el autobús.','Przegraliśmy mecz i uciekł nam autobus.','Nieregularny: pierdo. perderse = zgubić się.',5),
  ('podstawowa','empatar','cz.','zremisować','Empataron a uno.','Zremisowali jeden do jednego.','el empate = remis.',6),
  ('podstawowa','jugar','cz.','grać','Juego al baloncesto los martes.','We wtorki gram w koszykówkę.','jugar A + sport (jugar al fútbol). Nieregularny: juego.',7),
  ('podstawowa','el fútbol','rz.','piłka nożna','El fútbol es el deporte más popular.','Piłka nożna to najpopularniejszy sport.','W Hiszpanii z akcentem na ú; w Ameryce często futbol.',8),
  ('podstawowa','el baloncesto','rz.','koszykówka','Juega al baloncesto desde los ocho años.','Gra w koszykówkę od ósmego roku życia.','W Ameryce Łacińskiej: el básquetbol.',9),
  ('podstawowa','la natación','rz.','pływanie','La natación es buena para la espalda.','Pływanie jest dobre na kręgosłup.','nadar = pływać. la espalda = plecy.',10),
  ('podstawowa','el ciclismo','rz.','kolarstwo','El ciclismo es muy popular en España.','Kolarstwo jest w Hiszpanii bardzo popularne.','montar en bici = jeździć na rowerze.',11),
  ('podstawowa','correr','cz.','biegać','Corro cinco kilómetros cada mañana.','Biegam pięć kilometrów każdego ranka.','Też: pędzić, jechać szybko.',12),
  ('podstawowa','entrenar','cz.','trenować','Entrenamos tres veces por semana.','Trenujemy trzy razy w tygodniu.','el entrenador = trener; el entrenamiento = trening.',13),
  ('podstawowa','el gimnasio','rz.','siłownia','Voy al gimnasio después de clase.','Chodzę na siłownię po lekcjach.','Skrót: el gim.',14),
  ('podstawowa','el campo','rz.','boisko','El campo está en obras.','Boisko jest w remoncie.','Też: wieś, pole. estar en obras = być w remoncie.',15),
  ('podstawowa','la piscina','rz.','basen','La piscina cubierta abre todo el año.','Basen kryty jest otwarty cały rok.','cubierta = kryta.',16),
  ('podstawowa','el árbitro','rz.','sędzia (sportowy)','El árbitro no vio la falta.','Sędzia nie widział faulu.','la falta = faul, też: brak, błąd.',17),
  ('podstawowa','la afición','rz.','kibice','La afición animó hasta el final.','Kibice dopingowali do końca.','To samo słowo znaczy „hobby”. el aficionado = kibic.',18),
  ('podstawowa','el campeonato','rz.','mistrzostwa','Ganó el campeonato juvenil.','Wygrał mistrzostwa juniorów.','el campeón = mistrz.',19),
  ('podstawowa','marcar un gol','zwrot','strzelić bramkę','Marcó dos goles en el segundo tiempo.','Strzelił dwa gole w drugiej połowie.','el tiempo = połowa meczu.',20),
  ('rozszerzona','la lesión','rz.','kontuzja','Se recuperó de una lesión grave.','Wyleczył poważną kontuzję.','lesionarse = doznać kontuzji. recuperarse DE algo.',21),
  ('rozszerzona','el rendimiento','rz.','wyniki, forma','El rendimiento del equipo ha bajado.','Forma drużyny spadła.','To samo słowo w kontekście szkolnym.',22),
  ('rozszerzona','el dopaje','rz.','doping (farmakologiczny)','El dopaje sigue siendo un problema.','Doping wciąż jest problemem.','UWAGA: kibicowanie to animar/la afición, nie el dopaje.',23),
  ('rozszerzona','el deporte de riesgo','zwrot','sport ekstremalny','Los deportes de riesgo atraen a los jóvenes.','Sporty ekstremalne przyciągają młodych.','atraer = przyciągać.',24),
  ('rozszerzona','superarse','cz.','przekraczać własne granice','Lo importante es superarse a uno mismo.','Ważne jest przekraczać własne granice.','Świetne zakończenie rozprawki o sporcie.',25),
  ('rozszerzona','el sedentarismo','rz.','siedzący tryb życia','El sedentarismo aumenta entre los adolescentes.','Siedzący tryb życia rośnie wśród nastolatków.','sedentario = siedzący. Stały temat tekstów.',26),
  ('rozszerzona','fomentar','cz.','promować, zachęcać do','Hay que fomentar el deporte escolar.','Trzeba promować sport szkolny.','Bardzo użyteczny czasownik w rozprawce: fomentar, promover, impulsar.',27),
  ('rozszerzona','el trabajo en equipo','zwrot','praca zespołowa','El deporte enseña el trabajo en equipo.','Sport uczy pracy zespołowej.','Klasyczny argument za uprawianiem sportu.',28),
  ('rozszerzona','estar en forma','zwrot','być w formie','Nadar te mantiene en forma.','Pływanie utrzymuje cię w formie.','mantener = utrzymywać. Zawsze z ESTAR.',29),
  ('rozszerzona','dar la vuelta al marcador','zwrot','odwrócić losy meczu','Dieron la vuelta al marcador en diez minutos.','Odwrócili wynik w dziesięć minut.','el marcador = tablica wyników.',30)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 11. Zdrowie
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'zdrowie') t,
(values
  ('podstawowa','la salud','rz.','zdrowie','La salud es lo más importante.','Zdrowie jest najważniejsze.','lo más + przymiotnik = to, co naj-.',1),
  ('podstawowa','sano','przym.','zdrowy','Lleva una vida sana.','Prowadzi zdrowy tryb życia.','SER sano = zdrowy z natury; ESTAR sano = akurat zdrowy.',2),
  ('podstawowa','enfermo','przym.','chory','Está enfermo desde el lunes.','Jest chory od poniedziałku.','ZAWSZE z ESTAR — to stan, nie cecha.',3),
  ('podstawowa','la enfermedad','rz.','choroba','Es una enfermedad poco común.','To rzadka choroba.','poco común = rzadki.',4),
  ('podstawowa','el dolor','rz.','ból','Tengo dolor de cabeza.','Boli mnie głowa.','dolor DE + część ciała. Konstrukcja przez TENER.',5),
  ('podstawowa','doler','cz.','boleć','Me duele la garganta.','Boli mnie gardło.','SKŁADNIA JAK GUSTAR: me duele (l.poj.), me duelen los pies (l.mn.).',6),
  ('podstawowa','la fiebre','rz.','gorączka','Tiene fiebre alta.','Ma wysoką gorączkę.','tener fiebre — przez TENER.',7),
  ('podstawowa','la tos','rz.','kaszel','La tos no me deja dormir.','Kaszel nie daje mi spać.','toser = kasłać. Rodzaj żeński: la tos.',8),
  ('podstawowa','el resfriado','rz.','przeziębienie','Es solo un resfriado.','To tylko przeziębienie.','estar resfriado = być przeziębionym.',9),
  ('podstawowa','la gripe','rz.','grypa','Estuvo con gripe una semana.','Chorował na grypę tydzień.','Rodzaj żeński mimo końcówki -e.',10),
  ('podstawowa','el médico','rz.','lekarz','Voy al médico esta tarde.','Idę dziś po południu do lekarza.','Synonim: el doctor.',11),
  ('podstawowa','la cita','rz.','wizyta, umówione spotkanie','Pedí cita con el dentista.','Umówiłem wizytę u dentysty.','pedir cita = umówić wizytę. Też: randka, cytat.',12),
  ('podstawowa','la receta','rz.','recepta, przepis','El médico me dio una receta.','Lekarz dał mi receptę.','Dwa znaczenia: recepta i przepis kulinarny.',13),
  ('podstawowa','la medicina','rz.','lek, medycyna','Tomo la medicina dos veces al día.','Biorę lek dwa razy dziennie.','Konkretny lek to el medicamento.',14),
  ('podstawowa','la pastilla','rz.','tabletka','Tómate una pastilla cada ocho horas.','Bierz tabletkę co osiem godzin.','cada + czas = co ile.',15),
  ('podstawowa','el hospital','rz.','szpital','Lo llevaron al hospital.','Zawieźli go do szpitala.','llevar A alguien = zawieźć kogoś.',16),
  ('podstawowa','la urgencia','rz.','nagły przypadek','Fuimos a urgencias por la noche.','Pojechaliśmy nocą na ostry dyżur.','urgencias (l.mn.) = izba przyjęć, ostry dyżur.',17),
  ('podstawowa','herirse','cz.','zranić się','Se hirió jugando al fútbol.','Zranił się, grając w piłkę.','la herida = rana. Gerundio = „robiąc coś”.',18),
  ('podstawowa','cuidarse','cz.','dbać o siebie','Cuídate mucho.','Dbaj o siebie.','Zwyczajowa formuła na koniec listu lub e-maila.',19),
  ('podstawowa','descansar','cz.','odpoczywać','Necesitas descansar más.','Musisz więcej odpoczywać.','el descanso = odpoczynek, przerwa.',20),
  ('rozszerzona','el tratamiento','rz.','leczenie','El tratamiento dura seis semanas.','Leczenie trwa sześć tygodni.','tratar = leczyć, traktować.',21),
  ('rozszerzona','la vacuna','rz.','szczepionka','La vacuna es gratuita.','Szczepionka jest bezpłatna.','vacunarse = zaszczepić się.',22),
  ('rozszerzona','el hábito','rz.','nawyk','Cambiar de hábitos cuesta.','Zmiana nawyków kosztuje wysiłku.','cambiar DE algo = zmienić coś na inne.',23),
  ('rozszerzona','la adicción','rz.','uzależnienie','La adicción al móvil preocupa a los padres.','Uzależnienie od telefonu niepokoi rodziców.','adicción A algo. Bardzo częsty temat rozprawki.',24),
  ('rozszerzona','el estrés','rz.','stres','El estrés afecta al sueño.','Stres wpływa na sen.','estresante = stresujący; estar estresado = być zestresowanym.',25),
  ('rozszerzona','la salud mental','zwrot','zdrowie psychiczne','Se habla más de salud mental que antes.','Mówi się o zdrowiu psychicznym więcej niż kiedyś.','se habla = forma bezosobowa z SE.',26),
  ('rozszerzona','prevenir','cz.','zapobiegać','Más vale prevenir que curar.','Lepiej zapobiegać niż leczyć.','Hiszpańskie przysłowie — świetnie wygląda w rozprawce.',27),
  ('rozszerzona','la esperanza de vida','zwrot','oczekiwana długość życia','España tiene una esperanza de vida muy alta.','Hiszpania ma bardzo wysoką oczekiwaną długość życia.','Fakt przydatny w argumentacji o diecie śródziemnomorskiej.',28),
  ('rozszerzona','el bienestar','rz.','dobrostan, dobre samopoczucie','El deporte mejora el bienestar general.','Sport poprawia ogólne samopoczucie.','Odpowiednik angielskiego wellbeing.',29),
  ('rozszerzona','recuperarse','cz.','dochodzić do zdrowia','Se recuperó rápidamente de la operación.','Szybko doszedł do siebie po operacji.','recuperarse DE algo.',30),
  ('rozszerzona','estar hecho polvo','zwrot','być wykończonym','Después del examen estaba hecho polvo.','Po egzaminie byłem wykończony.','Potoczne; do e-maila, nie do rozprawki.',31)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 12. Nauka i technika
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'nauka-i-technika') t,
(values
  ('podstawowa','el ordenador','rz.','komputer','Mi ordenador va muy lento.','Mój komputer bardzo wolno działa.','TYLKO w Hiszpanii. W Ameryce Łacińskiej: la computadora.',1),
  ('podstawowa','el móvil','rz.','telefon komórkowy','Me he dejado el móvil en casa.','Zostawiłem telefon w domu.','W Ameryce: el celular. dejarse = zostawić przez zapomnienie.',2),
  ('podstawowa','la pantalla','rz.','ekran','Paso demasiadas horas ante la pantalla.','Spędzam za dużo godzin przed ekranem.','ante = przed (formalne).',3),
  ('podstawowa','el teclado','rz.','klawiatura','El teclado español tiene la letra ñ.','Hiszpańska klawiatura ma literę ñ.','la tecla = klawisz.',4),
  ('podstawowa','la contraseña','rz.','hasło','Olvidé la contraseña otra vez.','Znowu zapomniałem hasła.','Ważne w zadaniach o bezpieczeństwie w sieci.',5),
  ('podstawowa','la red','rz.','sieć','No hay red en el sótano.','W piwnicy nie ma zasięgu.','las redes sociales = media społecznościowe.',6),
  ('podstawowa','descargar','cz.','pobierać','Descargué la aplicación gratis.','Pobrałem aplikację za darmo.','subir = wgrywać, przesyłać w górę.',7),
  ('podstawowa','la aplicación','rz.','aplikacja','Esta aplicación consume mucha batería.','Ta aplikacja zużywa dużo baterii.','Skrót: la app (wymawiane po angielsku).',8),
  ('podstawowa','el correo electrónico','zwrot','e-mail','Te mando un correo electrónico.','Wyślę ci maila.','Skrót: el correo. mandar/enviar = wysyłać.',9),
  ('podstawowa','enviar','cz.','wysyłać','Envié el archivo ayer.','Wysłałem plik wczoraj.','Akcent w odmianie: envío, envías.',10),
  ('podstawowa','el archivo','rz.','plik','El archivo pesa demasiado.','Plik jest za duży.','pesar = ważyć (o pliku: być dużym).',11),
  ('podstawowa','encender','cz.','włączać','Enciende el ordenador, por favor.','Włącz komputer, proszę.','Nieregularny: enciendo. Przeciwieństwo: apagar.',12),
  ('podstawowa','apagar','cz.','wyłączać','Apaga el móvil durante el examen.','Wyłącz telefon na czas egzaminu.','durante = podczas.',13),
  ('podstawowa','funcionar','cz.','działać','El wifi no funciona.','Wi-Fi nie działa.','O urządzeniach: funcionar, nie trabajar.',14),
  ('podstawowa','estropearse','cz.','psuć się','Se me ha estropeado el portátil.','Zepsuł mi się laptop.','Konstrukcja z SE ME wyraża, że stało się to niechcący.',15),
  ('podstawowa','el invento','rz.','wynalazek','La imprenta fue un invento revolucionario.','Druk był rewolucyjnym wynalazkiem.','inventar = wynaleźć; el inventor = wynalazca.',16),
  ('podstawowa','el descubrimiento','rz.','odkrycie','Fue un descubrimiento casual.','To było przypadkowe odkrycie.','descubrir = odkryć. casual = przypadkowy (FAŁSZYWY PRZYJACIEL).',17),
  ('podstawowa','el científico','rz.','naukowiec','Los científicos advierten del riesgo.','Naukowcy ostrzegają przed ryzykiem.','advertir DE algo = ostrzegać przed.',18),
  ('podstawowa','el usuario','rz.','użytkownik','La aplicación tiene millones de usuarios.','Aplikacja ma miliony użytkowników.','usar = używać.',19),
  ('rozszerzona','el avance','rz.','postęp','Los avances médicos salvan vidas.','Postępy medycyny ratują życie.','avanzar = posuwać się naprzód.',20),
  ('rozszerzona','la investigación','rz.','badania','La investigación necesita financiación.','Badania wymagają finansowania.','investigar = badać. FAŁSZYWY PRZYJACIEL: to nie tylko śledztwo.',21),
  ('rozszerzona','la inteligencia artificial','zwrot','sztuczna inteligencja','La inteligencia artificial cambiará el empleo.','Sztuczna inteligencja zmieni rynek pracy.','Najczęstszy temat współczesnych tekstów maturalnych.',22),
  ('rozszerzona','la herramienta','rz.','narzędzie','Internet es una herramienta muy potente.','Internet to bardzo potężne narzędzie.','Świetne słowo w rozprawce o technologii.',23),
  ('rozszerzona','la brecha digital','zwrot','wykluczenie cyfrowe','La brecha digital afecta a los mayores.','Wykluczenie cyfrowe dotyka osoby starsze.','los mayores = osoby starsze.',24),
  ('rozszerzona','la privacidad','rz.','prywatność','Nos preocupa la privacidad de los datos.','Martwi nas prywatność danych.','los datos = dane.',25),
  ('rozszerzona','el ciberacoso','rz.','cyberprzemoc','El ciberacoso es un delito.','Cyberprzemoc jest przestępstwem.','el delito = przestępstwo. Częsty temat rozprawki.',26),
  ('rozszerzona','fiable','przym.','wiarygodny','No todas las fuentes son fiables.','Nie wszystkie źródła są wiarygodne.','la fuente = źródło. To samo słowo o ludziach.',27),
  ('rozszerzona','sustituir','cz.','zastępować','Las máquinas sustituirán algunos empleos.','Maszyny zastąpią część miejsc pracy.','sustituir A alguien POR algo.',28),
  ('rozszerzona','suponer','cz.','oznaczać, zakładać','Esto supone un cambio enorme.','To oznacza ogromną zmianę.','Nieregularne participio: supuesto. Bardzo użyteczne w rozprawce.',29),
  ('rozszerzona','a golpe de clic','zwrot','za jednym kliknięciem','Todo está a golpe de clic.','Wszystko jest o jedno kliknięcie.','Idiom typowy dla tekstów o internecie.',30)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
