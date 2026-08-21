-- ============================================================================
-- supabase/seed/matura-es/13_vocab_praca_zycie_zywienie.sql
-- Spanish vocabulary: Praca, Życie prywatne, Żywienie.
-- Run 11_vocab_topics.sql first. See 12_vocab_czlowiek_dom_edukacja.sql for
-- the conventions (level meaning, what belongs in `note`, the VALUES form).
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'es' and slug in ('praca', 'zycie-prywatne', 'zywienie')
);

-- ----------------------------------------------------------------------------
-- 4. Praca
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'praca') t,
(values
  ('podstawowa','el trabajo','rz.','praca','Busco trabajo desde marzo.','Szukam pracy od marca.','buscar trabajo — bez rodzajnika, jak po polsku „szukać pracy”.',1),
  ('podstawowa','trabajar','cz.','pracować','Trabaja en una tienda de ropa.','Pracuje w sklepie odzieżowym.','trabajar EN un sitio, trabajar DE camarero (jako kelner).',2),
  ('podstawowa','el empleo','rz.','zatrudnienie, posada','La tasa de empleo ha subido.','Wskaźnik zatrudnienia wzrósł.','Bardziej formalne niż trabajo; el desempleo = bezrobocie.',3),
  ('podstawowa','la empresa','rz.','firma','Trabajo en una empresa pequeña.','Pracuję w małej firmie.','FAŁSZYWY PRZYJACIEL: nie „impreza”.',4),
  ('podstawowa','el jefe','rz.','szef','Mi jefe es muy comprensivo.','Mój szef jest bardzo wyrozumiały.','Żeńska forma: la jefa.',5),
  ('podstawowa','el compañero de trabajo','zwrot','współpracownik','Me llevo bien con mis compañeros.','Dobrze dogaduję się ze współpracownikami.','compañero to też kolega ze szkoły: compañero de clase.',6),
  ('podstawowa','el sueldo','rz.','pensja','El sueldo no es muy alto.','Pensja nie jest zbyt wysoka.','Synonim: el salario.',7),
  ('podstawowa','el horario laboral','zwrot','godziny pracy','Tengo un horario laboral flexible.','Mam elastyczne godziny pracy.','laboral = związany z pracą (przymiotnik od labor).',8),
  ('podstawowa','a tiempo parcial','zwrot','na pół etatu','Trabajo a tiempo parcial mientras estudio.','Pracuję na pół etatu w trakcie studiów.','Pełen etat: a tiempo completo.',9),
  ('podstawowa','el currículum','rz.','CV','Envié el currículum por correo.','Wysłałem CV mailem.','Pełna forma: currículum vitae. Liczba mnoga: los currículums.',10),
  ('podstawowa','la entrevista de trabajo','zwrot','rozmowa kwalifikacyjna','Tengo una entrevista de trabajo el lunes.','W poniedziałek mam rozmowę kwalifikacyjną.','entrevista to też wywiad prasowy.',11),
  ('podstawowa','solicitar','cz.','ubiegać się o','He solicitado un puesto de recepcionista.','Ubiegałem się o stanowisko recepcjonisty.','la solicitud = podanie, wniosek.',12),
  ('podstawowa','el puesto','rz.','stanowisko','Es un puesto de mucha responsabilidad.','To bardzo odpowiedzialne stanowisko.','Też: stoisko na targu.',13),
  ('podstawowa','contratar','cz.','zatrudnić','La empresa contrató a diez personas.','Firma zatrudniła dziesięć osób.','Przed dopełnieniem osobowym stawia się A: contratar A alguien.',14),
  ('podstawowa','despedir','cz.','zwolnić (z pracy)','Lo despidieron el año pasado.','Zwolnili go w zeszłym roku.','despedirse DE alguien = żegnać się z kimś.',15),
  ('podstawowa','el paro','rz.','bezrobocie','Está en paro desde enero.','Jest bezrobotny od stycznia.','estar en paro = być bezrobotnym. Synonim: el desempleo.',16),
  ('podstawowa','las vacaciones','rz.','urlop, wakacje','Tengo tres semanas de vacaciones.','Mam trzy tygodnie urlopu.','ZAWSZE liczba mnoga.',17),
  ('podstawowa','el médico','rz.','lekarz','Mi padre es médico.','Mój tata jest lekarzem.','Przy zawodzie po ser NIE MA rodzajnika: es médico, nie es un médico.',18),
  ('podstawowa','el abogado','rz.','prawnik','Quiere ser abogada.','Chce zostać prawniczką.','Żeńska forma: la abogada.',19),
  ('podstawowa','el ingeniero','rz.','inżynier','Trabaja de ingeniero en una fábrica.','Pracuje jako inżynier w fabryce.','trabajar DE + zawód = pracować jako.',20),
  ('podstawowa','el dependiente','rz.','sprzedawca','La dependienta fue muy amable.','Sprzedawczyni była bardzo miła.','Żeńska forma: la dependienta.',21),
  ('podstawowa','el camarero','rz.','kelner','De verano trabajé de camarero.','Latem pracowałem jako kelner.','Typowa praca wakacyjna w zadaniach.',22),
  ('podstawowa','el bombero','rz.','strażak','Los bomberos llegaron enseguida.','Strażacy przyjechali natychmiast.','enseguida = natychmiast.',23),
  ('podstawowa','el fontanero','rz.','hydraulik','Hay que llamar al fontanero.','Trzeba wezwać hydraulika.','W Ameryce Łacińskiej: el plomero.',24),
  ('rozszerzona','el contrato','rz.','umowa','Le ofrecieron un contrato indefinido.','Zaproponowali mu umowę na czas nieokreślony.','contrato temporal = umowa na czas określony.',25),
  ('rozszerzona','el ascenso','rz.','awans','Consiguió un ascenso tras dos años.','Awansował po dwóch latach.','ascender = awansować.',26),
  ('rozszerzona','la jornada laboral','zwrot','dzień pracy, wymiar czasu pracy','Se debate reducir la jornada laboral.','Debatuje się nad skróceniem czasu pracy.','Częsty temat rozprawki na poziomie rozszerzonym.',27),
  ('rozszerzona','el teletrabajo','rz.','praca zdalna','El teletrabajo ahorra tiempo de desplazamiento.','Praca zdalna oszczędza czas dojazdów.','Bardzo częsty temat egzaminacyjny po 2020 roku.',28),
  ('rozszerzona','la conciliación','rz.','godzenie pracy z życiem prywatnym','La conciliación sigue siendo un reto.','Godzenie pracy z życiem prywatnym wciąż jest wyzwaniem.','Pełna forma: conciliación laboral y familiar.',29),
  ('rozszerzona','el reto','rz.','wyzwanie','Es un reto muy motivador.','To bardzo motywujące wyzwanie.','Synonim: el desafío. Świetne słowo do rozprawki.',30),
  ('rozszerzona','la experiencia laboral','zwrot','doświadczenie zawodowe','Piden dos años de experiencia laboral.','Wymagają dwóch lat doświadczenia.','pedir = wymagać, prosić o.',31),
  ('rozszerzona','las prácticas','rz.','praktyki, staż','Hice las prácticas en un hospital.','Odbyłem praktyki w szpitalu.','Zawsze liczba mnoga w tym znaczeniu.',32),
  ('rozszerzona','el autónomo','rz.','osoba na własnej działalności','Como autónomo, pago mis propias cuotas.','Jako samozatrudniony sam płacę składki.','Ważne słowo w hiszpańskich realiach zawodowych.',33),
  ('rozszerzona','la baja','rz.','zwolnienie lekarskie','Está de baja por una lesión.','Jest na zwolnieniu z powodu kontuzji.','estar de baja = być na zwolnieniu.',34),
  ('rozszerzona','el sindicato','rz.','związek zawodowy','Los sindicatos convocaron una huelga.','Związki zawodowe ogłosiły strajk.','la huelga = strajk; convocar = zwołać.',35),
  ('rozszerzona','la precariedad','rz.','niepewność zatrudnienia','La precariedad afecta sobre todo a los jóvenes.','Niepewność zatrudnienia dotyka zwłaszcza młodych.','afectar A alguien — z przyimkiem.',36),
  ('rozszerzona','desempeñar','cz.','pełnić (funkcję)','Desempeña un papel clave en el equipo.','Pełni kluczową rolę w zespole.','desempeñar un papel = odgrywać rolę.',37),
  ('rozszerzona','el desplazamiento','rz.','dojazd, przemieszczanie się','El desplazamiento diario le lleva una hora.','Codzienny dojazd zajmuje mu godzinę.','llevar + czas = zajmować (o czasie).',38)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 5. Życie prywatne
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'zycie-prywatne') t,
(values
  ('podstawowa','la familia','rz.','rodzina','Mi familia es bastante grande.','Moja rodzina jest dość duża.','Liczba pojedyncza, choć oznacza wiele osób.',1),
  ('podstawowa','los padres','rz.','rodzice','Mis padres viven en Cracovia.','Moi rodzice mieszkają w Krakowie.','Liczba mnoga od el padre; los padres = rodzice, nie „ojcowie”.',2),
  ('podstawowa','el hermano','rz.','brat','Tengo dos hermanos mayores.','Mam dwóch starszych braci.','los hermanos może znaczyć „rodzeństwo”.',3),
  ('podstawowa','el hijo','rz.','syn','Tienen tres hijos.','Mają troje dzieci.','los hijos = dzieci (potomstwo), nie los niños.',4),
  ('podstawowa','el abuelo','rz.','dziadek','Mi abuelo tiene ochenta años.','Mój dziadek ma osiemdziesiąt lat.','los abuelos = dziadkowie.',5),
  ('podstawowa','el primo','rz.','kuzyn','Mi prima vive en Sevilla.','Moja kuzynka mieszka w Sewilli.','Nie myl z el tío (wujek).',6),
  ('podstawowa','el tío','rz.','wujek','Mi tío nos visita los domingos.','Wujek odwiedza nas w niedziele.','Potocznie „tío” znaczy też „koleś” — w wypracowaniu nie używaj.',7),
  ('podstawowa','el sobrino','rz.','bratanek, siostrzeniec','Cuido a mi sobrina los viernes.','W piątki opiekuję się siostrzenicą.','cuidar A alguien.',8),
  ('podstawowa','el amigo','rz.','przyjaciel','Es mi mejor amigo desde el colegio.','To mój najlepszy przyjaciel od podstawówki.','desde = od (punkt w czasie).',9),
  ('podstawowa','la amistad','rz.','przyjaźń','La amistad requiere tiempo.','Przyjaźń wymaga czasu.','Kluczowe słowo w rozprawkach.',10),
  ('podstawowa','la pareja','rz.','partner, para','Vino con su pareja.','Przyszedł z partnerką.','Rodzaj ŻEŃSKI niezależnie od płci osoby: su pareja es alto — błąd; poprawnie: su pareja es alta.',11),
  ('podstawowa','el novio','rz.','chłopak, narzeczony','Su novia estudia Derecho.','Jego dziewczyna studiuje prawo.','Na ślubie: los novios = para młoda.',12),
  ('podstawowa','la boda','rz.','ślub, wesele','La boda fue en un pueblo pequeño.','Ślub odbył się w małej wsi.','casarse = brać ślub.',13),
  ('podstawowa','el cumpleaños','rz.','urodziny','Mañana es mi cumpleaños.','Jutro są moje urodziny.','LICZBA POJEDYNCZA mimo -s: el cumpleaños, los cumpleaños.',14),
  ('podstawowa','celebrar','cz.','świętować, obchodzić','Celebramos la Nochevieja en casa.','Sylwestra świętujemy w domu.','la Nochevieja = Sylwester; la Nochebuena = Wigilia.',15),
  ('podstawowa','el tiempo libre','zwrot','czas wolny','En mi tiempo libre toco la guitarra.','W wolnym czasie gram na gitarze.','tocar + instrument = grać na instrumencie.',16),
  ('podstawowa','quedar','cz.','umówić się','Quedamos a las seis en la plaza.','Umawiamy się o szóstej na placu.','quedar CON alguien. Uwaga: quedarse (zwrotny) = zostać.',17),
  ('podstawowa','salir','cz.','wychodzić','Salgo con mis amigos los sábados.','W soboty wychodzę ze znajomymi.','salir con alguien znaczy też „chodzić z kimś”.',18),
  ('podstawowa','divertirse','cz.','dobrze się bawić','Nos divertimos muchísimo.','Bawiliśmy się świetnie.','Nieregularny: me divierto. divertido = zabawny.',19),
  ('podstawowa','aburrirse','cz.','nudzić się','Me aburro en casa los domingos.','W niedziele nudzę się w domu.','SER aburrido = nudny; ESTAR aburrido = znudzony.',20),
  ('podstawowa','el ocio','rz.','rozrywka, czas wolny','La oferta de ocio es amplia.','Oferta rozrywkowa jest szeroka.','Formalniejsze niż tiempo libre; częste w tekstach.',21),
  ('podstawowa','la afición','rz.','hobby, zamiłowanie','Su afición es la fotografía.','Jego hobby to fotografia.','aficionado a algo = miłośnik czegoś.',22),
  ('podstawowa','coleccionar','cz.','kolekcjonować','Colecciona sellos desde niño.','Kolekcjonuje znaczki od dziecka.','el sello = znaczek pocztowy.',23),
  ('podstawowa','discutir','cz.','kłócić się, dyskutować','Discutimos por una tontería.','Pokłóciliśmy się o głupstwo.','FAŁSZYWY PRZYJACIEL: częściej „kłócić się” niż „dyskutować”.',24),
  ('rozszerzona','la convivencia','rz.','współżycie, mieszkanie razem','La convivencia mejora con reglas claras.','Wspólne mieszkanie układa się lepiej przy jasnych zasadach.','convivir = mieszkać/żyć razem.',25),
  ('rozszerzona','el vínculo','rz.','więź','Mantienen un vínculo muy fuerte.','Łączy ich bardzo silna więź.','Formalne, dobrze punktowane w rozprawce.',26),
  ('rozszerzona','apoyar','cz.','wspierać','Mis padres siempre me han apoyado.','Rodzice zawsze mnie wspierali.','el apoyo = wsparcie. NIE myl z apoyarse en (opierać się o).',27),
  ('rozszerzona','el conflicto','rz.','konflikt','El conflicto se resolvió hablando.','Konflikt rozwiązano rozmową.','resolver = rozwiązywać (nieregularny: resuelvo).',28),
  ('rozszerzona','reconciliarse','cz.','pogodzić się','Se reconciliaron después de un mes.','Pogodzili się po miesiącu.','reconciliarse CON alguien.',29),
  ('rozszerzona','la brecha generacional','zwrot','przepaść pokoleniowa','La brecha generacional se nota en la tecnología.','Przepaść pokoleniowa widać w technologii.','Świetny zwrot do rozprawki o rodzinie.',30),
  ('rozszerzona','independizarse','cz.','usamodzielnić się','Se independizó a los veinticinco.','Usamodzielnił się w wieku dwudziestu pięciu lat.','a los + wiek = w wieku. Temat wraca co roku.',31),
  ('rozszerzona','la responsabilidad','rz.','odpowiedzialność','Compartimos las responsabilidades del hogar.','Dzielimy się obowiązkami domowymi.','el hogar = dom, ognisko domowe.',32),
  ('rozszerzona','la tradición','rz.','tradycja','Es una tradición familiar muy antigua.','To bardzo stara tradycja rodzinna.','transmitir una tradición = przekazywać tradycję.',33),
  ('rozszerzona','soler','cz.','mieć w zwyczaju','Suelo cenar con mi familia.','Zwykle jem kolację z rodziną.','TYLKO w presente i imperfecto, zawsze + bezokolicznik. Bardzo podnosi ocenę za zakres.',34),
  ('rozszerzona','echar de menos','zwrot','tęsknić za','Echo de menos a mis abuelos.','Tęsknię za dziadkami.','Przed osobą stawia się A. W Ameryce: extrañar.',35),
  ('rozszerzona','llevarse una sorpresa','zwrot','przeżyć niespodziankę','Me llevé una sorpresa enorme.','Przeżyłem ogromną niespodziankę.','Idiom z llevarse — dobrze widziany na rozszerzeniu.',36)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 6. Żywienie
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'zywienie') t,
(values
  ('podstawowa','el desayuno','rz.','śniadanie','El desayuno es la comida más importante.','Śniadanie to najważniejszy posiłek.','desayunar = jeść śniadanie (bez dopełnienia „śniadanie”).',1),
  ('podstawowa','la comida','rz.','obiad, jedzenie','La comida en España es a las dos.','W Hiszpanii obiad jest o drugiej.','W Hiszpanii to główny posiłek dnia — ważny szczegół kulturowy.',2),
  ('podstawowa','la cena','rz.','kolacja','Cenamos sobre las nueve.','Kolację jemy koło dziewiątej.','cenar = jeść kolację. sobre + godzina = około.',3),
  ('podstawowa','la merienda','rz.','podwieczorek','Los niños toman la merienda a las cinco.','Dzieci jedzą podwieczorek o piątej.','merendar = jeść podwieczorek. Brak dobrego polskiego odpowiednika.',4),
  ('podstawowa','el pan','rz.','chleb','Compro pan todos los días.','Codziennie kupuję chleb.','Rzeczownik niepoliczalny — bez rodzajnika po compro.',5),
  ('podstawowa','la carne','rz.','mięso','No como carne desde hace un año.','Nie jem mięsa od roku.','desde hace + czas = od (jak długo).',6),
  ('podstawowa','el pescado','rz.','ryba (jako jedzenie)','El pescado es muy sano.','Ryba jest bardzo zdrowa.','Żywa ryba to el pez — częsta pułapka w zadaniach.',7),
  ('podstawowa','la verdura','rz.','warzywa','Hay que comer más verdura.','Trzeba jeść więcej warzyw.','Często w liczbie pojedynczej, choć po polsku mnoga.',8),
  ('podstawowa','la fruta','rz.','owoce','La fruta de temporada es más barata.','Owoce sezonowe są tańsze.','de temporada = sezonowy.',9),
  ('podstawowa','el huevo','rz.','jajko','Los huevos fritos con patatas están buenísimos.','Jajka sadzone z ziemniakami są przepyszne.','Wzmocnienie: buenísimo (superlativo absoluto).',10),
  ('podstawowa','la leche','rz.','mleko','Tomo café con leche.','Piję kawę z mlekiem.','tomar = pić/jeść (bardzo pojemne słowo).',11),
  ('podstawowa','el queso','rz.','ser','El queso manchego es muy famoso.','Ser manchego jest bardzo znany.','Wiedza o produktach regionalnych bywa w tekstach.',12),
  ('podstawowa','el aceite','rz.','olej, oliwa','El aceite de oliva es la base de la dieta.','Oliwa z oliwek jest podstawą tej diety.','aceite de oliva = oliwa z oliwek.',13),
  ('podstawowa','la sal','rz.','sól','Le falta sal a la sopa.','Zupie brakuje soli.','faltar — składnia jak gustar.',14),
  ('podstawowa','el azúcar','rz.','cukier','Tomo el té sin azúcar.','Piję herbatę bez cukru.','Rodzaj męski mimo końcówki -ar.',15),
  ('podstawowa','el restaurante','rz.','restauracja','Reservé mesa en un restaurante italiano.','Zarezerwowałem stolik we włoskiej restauracji.','reservar mesa = zarezerwować stolik.',16),
  ('podstawowa','la carta','rz.','menu, karta dań','¿Nos trae la carta, por favor?','Poprosimy kartę.','FAŁSZYWY PRZYJACIEL: to też „list”. Menu dnia to el menú del día.',17),
  ('podstawowa','la cuenta','rz.','rachunek','La cuenta, por favor.','Poproszę rachunek.','Też: konto bankowe.',18),
  ('podstawowa','el primer plato','zwrot','pierwsze danie','De primero, sopa.','Na pierwsze — zupa.','W zamawianiu skraca się do de primero / de segundo.',19),
  ('podstawowa','el postre','rz.','deser','De postre hay flan.','Na deser jest flan.','el flan = hiszpański budyń karmelowy.',20),
  ('podstawowa','pedir','cz.','zamawiać, prosić o','He pedido una ensalada.','Zamówiłem sałatkę.','Nieregularny: pido, pides. NIE myl z preguntar (pytać).',21),
  ('podstawowa','probar','cz.','spróbować, przymierzyć','¿Has probado la paella?','Próbowałeś paelli?','Nieregularny: pruebo. Też: przymierzać ubranie.',22),
  ('podstawowa','tener hambre','zwrot','być głodnym','Tengo mucha hambre.','Jestem bardzo głodny.','Przez TENER, nie ser/estar. mucha, nie mucho — hambre jest rodzaju żeńskiego.',23),
  ('podstawowa','tener sed','zwrot','być spragnionym','¿Tienes sed?','Chce ci się pić?','Ta sama konstrukcja co tener hambre.',24),
  ('podstawowa','sabroso','przym.','smaczny','La sopa está muy sabrosa.','Zupa jest bardzo smaczna.','O smaku zawsze ESTAR: está rico/sabroso.',25),
  ('podstawowa','picante','przym.','ostry (w smaku)','La comida mexicana es picante.','Kuchnia meksykańska jest ostra.','Ostry nóż to afilado — inne słowo.',26),
  ('rozszerzona','la alimentación','rz.','odżywianie','Una alimentación equilibrada previene enfermedades.','Zrównoważone odżywianie zapobiega chorobom.','prevenir = zapobiegać.',27),
  ('rozszerzona','equilibrado','przym.','zrównoważony','Lleva una dieta equilibrada.','Stosuje zrównoważoną dietę.','llevar una dieta = stosować dietę.',28),
  ('rozszerzona','el aporte','rz.','wkład, podaż (składników)','Las legumbres tienen un gran aporte proteico.','Rośliny strączkowe dostarczają dużo białka.','las legumbres = rośliny strączkowe.',29),
  ('rozszerzona','la grasa','rz.','tłuszcz','Hay que reducir las grasas saturadas.','Trzeba ograniczyć tłuszcze nasycone.','reducir = ograniczać.',30),
  ('rozszerzona','el trastorno alimentario','zwrot','zaburzenie odżywiania','Los trastornos alimentarios afectan a muchos jóvenes.','Zaburzenia odżywiania dotykają wielu młodych.','Poważny temat w tekstach na rozszerzeniu.',31),
  ('rozszerzona','la obesidad','rz.','otyłość','La obesidad infantil ha aumentado.','Otyłość dziecięca wzrosła.','infantil = dziecięcy.',32),
  ('rozszerzona','el desperdicio de alimentos','zwrot','marnowanie żywności','El desperdicio de alimentos es un problema global.','Marnowanie żywności to problem globalny.','desperdiciar = marnować.',33),
  ('rozszerzona','ecológico','przym.','ekologiczny','Compro verdura ecológica en el mercado.','Kupuję ekologiczne warzywa na targu.','Na etykietach: producto ecológico (odpowiednik „bio”).',34),
  ('rozszerzona','la caducidad','rz.','termin przydatności','Comprueba la fecha de caducidad.','Sprawdź datę przydatności.','caducar = tracić ważność.',35),
  ('rozszerzona','el aditivo','rz.','dodatek (do żywności)','Este zumo no lleva aditivos.','Ten sok nie zawiera dodatków.','llevar w znaczeniu „zawierać” — częste w opisach produktów.',36),
  ('rozszerzona','a la plancha','zwrot','z grilla, smażony na patelni','Pedí pollo a la plancha.','Zamówiłem kurczaka z grilla.','Standardowa formuła w karcie dań.',37),
  ('rozszerzona','ponerse morado','zwrot','najeść się do syta','Nos pusimos morados de marisco.','Objedliśmy się owocami morza.','Potoczny idiom; dobry w e-mailu do kolegi, nie w rozprawce.',38)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
