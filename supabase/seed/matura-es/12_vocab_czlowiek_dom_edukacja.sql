-- ============================================================================
-- supabase/seed/matura-es/12_vocab_czlowiek_dom_edukacja.sql
-- Spanish vocabulary for the first three thematic blocks: Człowiek, Miejsce
-- zamieszkania, Edukacja. Run 11_vocab_topics.sql first.
--
-- `level` is the level FROM WHICH an entry is expected — a rozszerzona student
-- gets both slices, a podstawowa student only the first (0021_matura_theory.sql).
--
-- The `note` column is where most of the value is. A bare term/translation
-- pair is what a dictionary gives; what loses marks on the arkusz is number
-- and gender mismatches (el pelo singular against Polish plural, las gafas
-- always plural), ser/estar choice on adjectives, verbs that need an indirect
-- object (caer bien, gustar), and false friends that look Polish but are not
-- (embarazada). Those go in the note, not the translation.
--
-- The VALUES-list form below keeps one entry on one line; the topic id is
-- joined in once per block instead of being re-selected per row.
-- ============================================================================

delete from matura_vocab_entries
where topic_id in (
  select id from matura_vocab_topics
  where language = 'es' and slug in ('czlowiek', 'miejsce-zamieszkania', 'edukacja')
);

-- ----------------------------------------------------------------------------
-- 1. Człowiek
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'czlowiek') t,
(values
  ('podstawowa','el nombre','rz.','imię','Mi nombre es Marta.','Mam na imię Marta.','Uwaga: „nazwisko” to el apellido, nie el nombre.',1),
  ('podstawowa','el apellido','rz.','nazwisko','Escribe tu apellido en mayúsculas.','Napisz nazwisko wielkimi literami.','Hiszpanie mają zwykle DWA nazwiska: ojca i matki.',2),
  ('podstawowa','la edad','rz.','wiek','¿Qué edad tienes?','Ile masz lat?','Wiek podaje się przez TENER, nie ser: tengo 18 años.',3),
  ('podstawowa','la fecha de nacimiento','rz.','data urodzenia','Mi fecha de nacimiento es el 3 de mayo.','Moja data urodzenia to 3 maja.','Data: el + liczba + de + miesiąc, bez rodzajnika przed miesiącem.',4),
  ('podstawowa','el estado civil','rz.','stan cywilny','En el formulario hay que indicar el estado civil.','W formularzu trzeba podać stan cywilny.','Typowe w zadaniach o dokumentach i formularzach.',5),
  ('podstawowa','soltero','przym.','stanu wolnego, kawaler','Está soltero desde hace dos años.','Jest wolny od dwóch lat.','Ze stanem cywilnym używa się ESTAR albo SER — obie formy są poprawne.',6),
  ('podstawowa','casado','przym.','żonaty, zamężna','Está casada con un francés.','Jest zamężna z Francuzem.','casarse CON alguien, nigdy „casarse a”.',7),
  ('podstawowa','la nacionalidad','rz.','narodowość','¿Cuál es tu nacionalidad?','Jakiej jesteś narodowości?','Nazwy narodowości piszemy MAŁĄ literą: soy polaco.',8),
  ('podstawowa','alto','przym.','wysoki','Mi hermano es muy alto.','Mój brat jest bardzo wysoki.','O wzroście zawsze SER, nie estar.',9),
  ('podstawowa','bajo','przym.','niski','Es bajo pero muy fuerte.','Jest niski, ale bardzo silny.','bajo to też przyimek „pod” — rozpoznaj po kontekście.',10),
  ('podstawowa','delgado','przym.','szczupły','Se ha quedado muy delgado.','Bardzo schudł.','Grzeczniejsze niż flaco, które bywa złośliwe.',11),
  ('podstawowa','gordo','przym.','gruby','El gato está gordo.','Kot jest gruby.','Z ESTAR = przytył; z SER = taki już jest.',12),
  ('podstawowa','el pelo','rz.','włosy','Tiene el pelo rizado.','Ma kręcone włosy.','PO HISZPAŃSKU LICZBA POJEDYNCZA, choć po polsku mnoga. Najczęstszy błąd Polaków w tym dziale.',13),
  ('podstawowa','rubio','przym.','blond','Es rubia de ojos azules.','Jest blondynką o niebieskich oczach.','O wyglądzie po SER; opis oczu przez DE, nie con.',14),
  ('podstawowa','moreno','przym.','ciemnowłosy, śniady','Su hermano es moreno.','Jego brat jest ciemnowłosy.','Zależnie od kontekstu: kolor włosów albo opalenizna.',15),
  ('podstawowa','pelirrojo','przym.','rudy','Mi prima es pelirroja.','Moja kuzynka jest ruda.','Od pelo + rojo; pisane jednym słowem z podwójnym r.',16),
  ('podstawowa','liso','przym.','prosty (o włosach)','Lleva el pelo liso y largo.','Ma proste, długie włosy.','llevar el pelo… to naturalniejsze niż tener el pelo…',17),
  ('podstawowa','rizado','przym.','kręcony','Tiene el pelo rizado.','Ma kręcone włosy.','Uwaga na tildę w rizado — bez niej to inny wyraz.',18),
  ('podstawowa','los ojos','rz.','oczy','Tiene los ojos verdes.','Ma zielone oczy.','Przy częściach ciała używa się rodzajnika, nie zaimka dzierżawczego.',19),
  ('podstawowa','la barba','rz.','broda (zarost)','Se ha dejado barba.','Zapuścił brodę.','„Broda” jako część twarzy to la barbilla.',20),
  ('podstawowa','el bigote','rz.','wąsy','Lleva bigote desde joven.','Nosi wąsy od młodości.','Po hiszpańsku zwykle liczba pojedyncza.',21),
  ('podstawowa','las gafas','rz.','okulary','No veo nada sin gafas.','Nic nie widzę bez okularów.','ZAWSZE w liczbie mnogiej. W Ameryce Łacińskiej: los lentes.',22),
  ('podstawowa','simpático','przym.','sympatyczny','Tu profesora es muy simpática.','Twoja nauczycielka jest bardzo sympatyczna.','FAŁSZYWY PRZYJACIEL: nie znaczy „współczujący”.',23),
  ('podstawowa','antipático','przym.','niesympatyczny','El camarero fue bastante antipático.','Kelner był dość niesympatyczny.','Przeciwieństwo simpático, nie „antypatyczny” w polskim sensie.',24),
  ('podstawowa','amable','przym.','uprzejmy','Ha sido muy amable conmigo.','Był dla mnie bardzo uprzejmy.','amable CON alguien.',25),
  ('podstawowa','tímido','przym.','nieśmiały','De niño era muy tímido.','Jako dziecko był bardzo nieśmiały.','Cecha stała, więc SER.',26),
  ('podstawowa','hablador','przym.','gadatliwy','Mi abuela es muy habladora.','Moja babcia jest bardzo gadatliwa.','Rodzaj żeński: habladora, z końcówką -a.',27),
  ('podstawowa','trabajador','przym.','pracowity','Es un estudiante trabajador.','To pracowity uczeń.','To samo słowo znaczy też „pracownik”.',28),
  ('podstawowa','perezoso','przym.','leniwy','No es tonto, solo perezoso.','Nie jest głupi, tylko leniwy.','Rzeczownik la pereza = lenistwo.',29),
  ('podstawowa','generoso','przym.','hojny','Siempre invita, es muy generoso.','Zawsze stawia, jest bardzo hojny.','Częsty argument w rozprawce o przyjaźni.',30),
  ('podstawowa','egoísta','przym.','samolubny','No seas egoísta.','Nie bądź samolubny.','Ta sama forma dla obu rodzajów: un chico egoísta, una chica egoísta.',31),
  ('podstawowa','alegre','przym.','wesoły','Es una persona alegre.','To wesoła osoba.','SER alegre = usposobienie; ESTAR alegre = w dobrym nastroju teraz.',32),
  ('podstawowa','triste','przym.','smutny','Está triste porque suspendió.','Jest smutny, bo oblał.','Chwilowy nastrój — zawsze ESTAR.',33),
  ('podstawowa','enfadado','przym.','zły, obrażony','Está enfadada conmigo.','Jest na mnie zła.','enfadarse CON alguien POR algo. W Ameryce: enojado.',34),
  ('podstawowa','preocupado','przym.','zmartwiony','Estoy preocupado por el examen.','Martwię się egzaminem.','preocuparse POR algo.',35),
  ('podstawowa','la sonrisa','rz.','uśmiech','Me recibió con una sonrisa.','Przywitał mnie uśmiechem.','Czasownik: sonreír (odmiana jak reír).',36),
  ('podstawowa','llorar','cz.','płakać','El niño lloraba sin parar.','Dziecko płakało bez przerwy.','Czasownik regularny — nie myl z llover (padać).',37),
  ('podstawowa','parecerse a','cz.','być podobnym do','Me parezco a mi padre.','Jestem podobny do ojca.','Zwrotny + przyimek A. Bez zaimka parecer znaczy „wydawać się”.',38),
  ('rozszerzona','el rasgo','rz.','cecha','La generosidad es su rasgo más visible.','Hojność to jego najbardziej widoczna cecha.','rasgo de carácter = cecha charakteru; przydatne w rozprawce.',39),
  ('rozszerzona','el comportamiento','rz.','zachowanie','Su comportamiento nos sorprendió a todos.','Jego zachowanie zaskoczyło nas wszystkich.','Czasownik: comportarse (zachowywać się).',40),
  ('rozszerzona','la autoestima','rz.','poczucie własnej wartości','Las redes sociales afectan a la autoestima.','Media społecznościowe wpływają na poczucie własnej wartości.','Temat wraca w rozprawkach o internecie i młodzieży.',41),
  ('rozszerzona','fiable','przym.','godny zaufania','Es la persona más fiable que conozco.','To najbardziej godna zaufania osoba, jaką znam.','O ludziach i o źródłach informacji: una fuente fiable.',42),
  ('rozszerzona','terco','przym.','uparty','Es terco como una mula.','Jest uparty jak osioł.','Synonim: testarudo. Hiszpanie mówią o mule, nie o ośle.',43),
  ('rozszerzona','exigente','przym.','wymagający','Es un profesor muy exigente.','To bardzo wymagający nauczyciel.','exigir = wymagać; exigente CON alguien.',44),
  ('rozszerzona','cariñoso','przym.','czuły, serdeczny','Mi abuela era muy cariñosa.','Moja babcia była bardzo serdeczna.','el cariño = czułość, przywiązanie.',45),
  ('rozszerzona','madurar','cz.','dojrzewać','Ha madurado mucho este año.','Bardzo dojrzał w tym roku.','O ludziach i o owocach. Rzeczownik: la madurez.',46),
  ('rozszerzona','avergonzarse','cz.','wstydzić się','Me avergüenzo de lo que dije.','Wstydzę się tego, co powiedziałem.','Zwrotny + DE. Uwaga na ü w formach: me avergüenzo.',47),
  ('rozszerzona','embarazada','przym.','w ciąży','Mi hermana está embarazada.','Moja siostra jest w ciąży.','KLASYCZNY FAŁSZYWY PRZYJACIEL: NIE znaczy „zawstydzona”. Zawstydzony to avergonzado.',48),
  ('rozszerzona','emocionarse','cz.','wzruszyć się','Me emocioné al leer su carta.','Wzruszyłem się, czytając jego list.','emocionante = wzruszający, ekscytujący.',49),
  ('rozszerzona','llevarse bien con','zwrot','dobrze się dogadywać z','Me llevo muy bien con mis padres.','Bardzo dobrze dogaduję się z rodzicami.','Przeciwieństwo: llevarse mal con. Bardzo częste w e-mailu o rodzinie.',50),
  ('rozszerzona','caer bien','zwrot','być lubianym','Tu amigo me cae muy bien.','Bardzo lubię twojego kolegę.','SKŁADNIA JAK GUSTAR: osoba lubiąca jest dopełnieniem dalszym (me, te, le…).',51),
  ('rozszerzona','tener buena pinta','zwrot','dobrze wyglądać','Ese plato tiene buena pinta.','To danie dobrze wygląda.','Potoczne, ale często w tekstach o jedzeniu i wyglądzie.',52)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 2. Miejsce zamieszkania
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'miejsce-zamieszkania') t,
(values
  ('podstawowa','la vivienda','rz.','mieszkanie, lokum','El precio de la vivienda ha subido.','Ceny mieszkań wzrosły.','Ogólne określenie miejsca do mieszkania — częste w tekstach o rynku.',1),
  ('podstawowa','el piso','rz.','mieszkanie','Vivo en un piso de tres habitaciones.','Mieszkam w mieszkaniu z trzema pokojami.','W Ameryce Łacińskiej: el departamento / apartamento.',2),
  ('podstawowa','el chalet','rz.','dom jednorodzinny','Se han mudado a un chalet.','Przeprowadzili się do domu.','Wymowa hiszpańska: „czalet”.',3),
  ('podstawowa','las afueras','rz.','przedmieścia','Vivimos en las afueras de Madrid.','Mieszkamy na przedmieściach Madrytu.','Zawsze liczba mnoga, zawsze z rodzajnikiem.',4),
  ('podstawowa','el barrio','rz.','dzielnica','Es un barrio muy tranquilo.','To bardzo spokojna dzielnica.','Kluczowe słowo w opisie miejsca zamieszkania.',5),
  ('podstawowa','el vecino','rz.','sąsiad','Mis vecinos hacen mucho ruido.','Moi sąsiedzi bardzo hałasują.','la vecindad / el vecindario = sąsiedztwo.',6),
  ('podstawowa','la habitación','rz.','pokój','Mi habitación da al jardín.','Mój pokój wychodzi na ogród.','dar a = wychodzić na (o oknie, pokoju).',7),
  ('podstawowa','el salón','rz.','salon','Vemos la tele en el salón.','Oglądamy telewizję w salonie.','Też: el cuarto de estar.',8),
  ('podstawowa','la cocina','rz.','kuchnia','La cocina es pequeña pero práctica.','Kuchnia jest mała, ale praktyczna.','To samo słowo znaczy „kuchenka” i „kuchnia” jako sztuka gotowania.',9),
  ('podstawowa','el cuarto de baño','rz.','łazienka','El piso tiene dos cuartos de baño.','Mieszkanie ma dwie łazienki.','Skrótowo: el baño.',10),
  ('podstawowa','el dormitorio','rz.','sypialnia','El dormitorio principal es muy amplio.','Główna sypialnia jest bardzo przestronna.','dormir = spać; stąd nazwa.',11),
  ('podstawowa','el pasillo','rz.','korytarz','El pasillo es estrecho y oscuro.','Korytarz jest wąski i ciemny.','Częsty przy opisie wad mieszkania.',12),
  ('podstawowa','la planta','rz.','piętro','Vivo en la tercera planta.','Mieszkam na trzecim piętrze.','Parter to la planta baja, NIE „la primera planta”.',13),
  ('podstawowa','el ascensor','rz.','winda','El edificio no tiene ascensor.','Budynek nie ma windy.','Klasyczna wada mieszkania w zadaniach.',14),
  ('podstawowa','los muebles','rz.','meble','Hemos comprado muebles nuevos.','Kupiliśmy nowe meble.','Zwykle liczba mnoga; jeden mebel: un mueble.',15),
  ('podstawowa','el armario','rz.','szafa','La ropa está en el armario.','Ubrania są w szafie.','armario empotrado = szafa wnękowa.',16),
  ('podstawowa','la nevera','rz.','lodówka','Deja la leche en la nevera.','Zostaw mleko w lodówce.','W Ameryce: el refrigerador / la heladera.',17),
  ('podstawowa','la lavadora','rz.','pralka','La lavadora se ha estropeado.','Pralka się zepsuła.','estropearse = zepsuć się (o urządzeniu).',18),
  ('podstawowa','la calefacción','rz.','ogrzewanie','En invierno la calefacción es cara.','Zimą ogrzewanie jest drogie.','Uwaga na ó w tym słowie.',19),
  ('podstawowa','alquilar','cz.','wynajmować','Queremos alquilar un piso céntrico.','Chcemy wynająć mieszkanie w centrum.','Ten sam czasownik znaczy „wynajmować komuś” i „wynajmować od kogoś”.',20),
  ('podstawowa','el alquiler','rz.','czynsz, najem','El alquiler cuesta 600 euros al mes.','Czynsz kosztuje 600 euro miesięcznie.','al mes = miesięcznie.',21),
  ('podstawowa','mudarse','cz.','przeprowadzać się','Nos mudamos el mes que viene.','Przeprowadzamy się w przyszłym miesiącu.','ZAWSZE zwrotny. la mudanza = przeprowadzka.',22),
  ('podstawowa','compartir piso','zwrot','mieszkać na współdzielonym mieszkaniu','Comparto piso con dos estudiantes.','Mieszkam z dwoma studentami.','Bardzo częste w tekstach o studiowaniu.',23),
  ('podstawowa','amueblado','przym.','umeblowany','Buscamos un piso amueblado.','Szukamy umeblowanego mieszkania.','Od los muebles.',24),
  ('podstawowa','luminoso','przym.','jasny, dobrze doświetlony','Es un salón muy luminoso.','To bardzo jasny salon.','Zaleta w ogłoszeniu; przeciwieństwo: oscuro.',25),
  ('podstawowa','ruidoso','przym.','hałaśliwy','La calle es muy ruidosa por las noches.','Ulica jest bardzo hałaśliwa nocą.','el ruido = hałas.',26),
  ('podstawowa','el ruido','rz.','hałas','No soporto el ruido del tráfico.','Nie znoszę hałasu ulicznego.','no soportar = nie znosić.',27),
  ('rozszerzona','la hipoteca','rz.','kredyt hipoteczny','Pagamos la hipoteca desde hace diez años.','Spłacamy kredyt od dziesięciu lat.','Temat wraca w tekstach o samodzielności młodych.',28),
  ('rozszerzona','el inquilino','rz.','najemca, lokator','El inquilino se queja de la humedad.','Lokator skarży się na wilgoć.','Właściciel to el casero / el propietario.',29),
  ('rozszerzona','el casero','rz.','właściciel wynajmowanego mieszkania','El casero quiere subir el alquiler.','Właściciel chce podnieść czynsz.','subir el alquiler = podnieść czynsz.',30),
  ('rozszerzona','la fianza','rz.','kaucja','Hay que dejar una fianza de un mes.','Trzeba wpłacić kaucję w wysokości jednego czynszu.','Typowy szczegół w ogłoszeniach o wynajmie.',31),
  ('rozszerzona','los gastos de comunidad','zwrot','czynsz administracyjny','El alquiler no incluye los gastos de comunidad.','Czynsz nie obejmuje opłat wspólnotowych.','incluir = obejmować, zawierać.',32),
  ('rozszerzona','la humedad','rz.','wilgoć','Hay humedad en las paredes.','Na ścianach jest wilgoć.','Częsta wada mieszkania w zadaniach z reklamacją.',33),
  ('rozszerzona','reformar','cz.','remontować','Van a reformar toda la cocina.','Wyremontują całą kuchnię.','la reforma = remont. NIE „reformować” w polskim sensie politycznym.',34),
  ('rozszerzona','el casco antiguo','zwrot','starówka','El casco antiguo está lleno de turistas.','Starówka jest pełna turystów.','Częste w tekstach o miastach i turystyce.',35),
  ('rozszerzona','la vivienda social','zwrot','mieszkanie komunalne','Faltan viviendas sociales en las grandes ciudades.','W dużych miastach brakuje mieszkań komunalnych.','faltar = brakować, składnia jak gustar.',36),
  ('rozszerzona','acogedor','przym.','przytulny','Es un piso pequeño pero acogedor.','To małe, ale przytulne mieszkanie.','acoger = przyjmować, gościć.',37),
  ('rozszerzona','estar bien comunicado','zwrot','mieć dobre połączenie komunikacyjne','El barrio está muy bien comunicado.','Dzielnica ma bardzo dobre połączenia.','Prawie zawsze z ESTAR; ceniona zaleta lokalizacji.',38)
) as v(lvl, term, pos, pl, ex, expl, note, ord);

-- ----------------------------------------------------------------------------
-- 3. Edukacja
-- ----------------------------------------------------------------------------
insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, v.lvl::matura_level, v.term, v.pos, v.pl, v.ex, v.expl, v.note, v.ord
from (select id from matura_vocab_topics where language = 'es' and slug = 'edukacja') t,
(values
  ('podstawowa','el colegio','rz.','szkoła (podstawowa)','Mi hermana pequeña va al colegio.','Moja młodsza siostra chodzi do szkoły.','FAŁSZYWY PRZYJACIEL: to nie „kolegium” ani studia.',1),
  ('podstawowa','el instituto','rz.','liceum, szkoła średnia','Estudio en un instituto público.','Uczę się w publicznym liceum.','Odpowiednik polskiego liceum — najważniejsze słowo tego działu.',2),
  ('podstawowa','la universidad','rz.','uniwersytet','Quiero estudiar en la universidad.','Chcę studiować na uniwersytecie.','Studiować NA uczelni to EN la universidad.',3),
  ('podstawowa','la asignatura','rz.','przedmiot szkolny','Mi asignatura favorita es la historia.','Mój ulubiony przedmiot to historia.','NIE el objeto ani el tema — to inne znaczenia.',4),
  ('podstawowa','la nota','rz.','ocena','He sacado buenas notas.','Dostałem dobre oceny.','sacar/obtener una nota = dostać ocenę. Też: notatka.',5),
  ('podstawowa','aprobar','cz.','zdać','He aprobado el examen de español.','Zdałem egzamin z hiszpańskiego.','Czasownik nieregularny: apruebo, apruebas…',6),
  ('podstawowa','suspender','cz.','oblać','Suspendí las matemáticas.','Oblałem matematykę.','Ten sam czasownik znaczy też „zawiesić”.',7),
  ('podstawowa','el examen','rz.','egzamin','El examen dura dos horas.','Egzamin trwa dwie godziny.','Liczba mnoga: los exámenes — z tildą, bo akcent się przesuwa.',8),
  ('podstawowa','estudiar','cz.','uczyć się, studiować','Estudio dos horas al día.','Uczę się dwie godziny dziennie.','Jedno słowo na „uczyć się” i „studiować”.',9),
  ('podstawowa','aprender','cz.','nauczyć się','He aprendido mucho este año.','Dużo się nauczyłem w tym roku.','aprender A + bezokolicznik: aprender a nadar.',10),
  ('podstawowa','enseñar','cz.','uczyć (kogoś), pokazywać','Mi madre enseña inglés.','Moja mama uczy angielskiego.','Dwa znaczenia: nauczać i pokazywać.',11),
  ('podstawowa','el profesor','rz.','nauczyciel','El profesor de física es muy exigente.','Nauczyciel fizyki jest bardzo wymagający.','Żeńska forma: la profesora.',12),
  ('podstawowa','el alumno','rz.','uczeń','Los alumnos entregaron los trabajos.','Uczniowie oddali prace.','Synonim: el estudiante (ta sama forma dla obu rodzajów).',13),
  ('podstawowa','los deberes','rz.','praca domowa','Todavía no he hecho los deberes.','Jeszcze nie odrobiłem lekcji.','ZAWSZE liczba mnoga. hacer los deberes = odrabiać lekcje.',14),
  ('podstawowa','el horario','rz.','plan lekcji, rozkład','Este año tenemos un horario horrible.','W tym roku mamy okropny plan.','Też: godziny otwarcia.',15),
  ('podstawowa','el recreo','rz.','przerwa','Durante el recreo jugamos al fútbol.','Na przerwie gramy w piłkę.','jugar A + nazwa sportu.',16),
  ('podstawowa','la clase','rz.','lekcja, klasa, sala','Hoy no hay clase de inglés.','Dziś nie ma lekcji angielskiego.','Trzy znaczenia naraz — rozstrzyga kontekst.',17),
  ('podstawowa','el curso','rz.','rok szkolny, kurs','Estoy en segundo curso.','Jestem w drugiej klasie.','FAŁSZYWY PRZYJACIEL: rzadko znaczy „kurs” w polskim sensie szkolenia.',18),
  ('podstawowa','la beca','rz.','stypendium','Ha conseguido una beca Erasmus.','Dostał stypendium Erasmus.','conseguir una beca = zdobyć stypendium.',19),
  ('podstawowa','el título','rz.','dyplom, tytuł','Necesitas el título para trabajar aquí.','Potrzebujesz dyplomu, żeby tu pracować.','Dwa znaczenia: dyplom i tytuł (książki, filmu).',20),
  ('podstawowa','matricularse','cz.','zapisać się','Me he matriculado en un curso de alemán.','Zapisałem się na kurs niemieckiego.','matricularse EN algo. La matrícula = wpisowe, rejestracja.',21),
  ('podstawowa','la carrera','rz.','kierunek studiów','Estudia la carrera de Medicina.','Studiuje medycynę.','Też: kariera i wyścig. W kontekście szkolnym prawie zawsze studia.',22),
  ('podstawowa','el apunte','rz.','notatka','¿Me dejas los apuntes de ayer?','Pożyczysz mi wczorajsze notatki?','Zwykle w liczbie mnogiej: tomar apuntes = robić notatki.',23),
  ('podstawowa','la pizarra','rz.','tablica','Escribe la respuesta en la pizarra.','Napisz odpowiedź na tablicy.','pizarra digital = tablica interaktywna.',24),
  ('podstawowa','el examen de selectividad','zwrot','egzamin maturalny (Hiszpania)','La selectividad decide en qué carrera entras.','Matura decyduje, na jaki kierunek się dostaniesz.','Hiszpański odpowiednik matury; obecnie oficjalnie EBAU/EvAU.',25),
  ('rozszerzona','la enseñanza','rz.','nauczanie, szkolnictwo','La enseñanza pública es gratuita.','Szkolnictwo publiczne jest bezpłatne.','enseñanza obligatoria = obowiązek szkolny.',26),
  ('rozszerzona','el aprendizaje','rz.','uczenie się, przyswajanie','El aprendizaje de idiomas requiere constancia.','Nauka języków wymaga systematyczności.','la constancia = wytrwałość; przydatne w rozprawce.',27),
  ('rozszerzona','el conocimiento','rz.','wiedza','Amplía tus conocimientos leyendo.','Poszerzaj wiedzę, czytając.','W znaczeniu „wiedza” często w liczbie mnogiej: conocimientos.',28),
  ('rozszerzona','la habilidad','rz.','umiejętność','El trabajo en equipo es una habilidad clave.','Praca zespołowa to kluczowa umiejętność.','Częste w tekstach o rynku pracy.',29),
  ('rozszerzona','el esfuerzo','rz.','wysiłek','Sin esfuerzo no hay resultados.','Bez wysiłku nie ma wyników.','esforzarse POR/EN = starać się.',30),
  ('rozszerzona','el fracaso escolar','zwrot','niepowodzenie szkolne','El fracaso escolar preocupa a los profesores.','Niepowodzenia szkolne niepokoją nauczycieli.','Stały temat tekstów publicystycznych na rozszerzeniu.',31),
  ('rozszerzona','el rendimiento','rz.','wyniki, wydajność','Dormir poco baja el rendimiento.','Za mało snu obniża wyniki.','rendimiento académico = wyniki w nauce.',32),
  ('rozszerzona','exigir','cz.','wymagać','El profesor exige puntualidad.','Nauczyciel wymaga punktualności.','Po exigir que → SUBJUNTIVO: exige que lleguemos a tiempo.',33),
  ('rozszerzona','la formación','rz.','wykształcenie, szkolenie','Busca formación complementaria.','Szuka dodatkowego szkolenia.','formación profesional = szkolnictwo zawodowe.',34),
  ('rozszerzona','el plan de estudios','zwrot','program studiów','Han cambiado el plan de estudios.','Zmienili program studiów.','Odpowiednik polskiej „siatki” zajęć.',35),
  ('rozszerzona','la asistencia','rz.','obecność, frekwencja','La asistencia a clase es obligatoria.','Obecność na zajęciach jest obowiązkowa.','asistir A clase = uczęszczać. FAŁSZYWY PRZYJACIEL: asistir to nie „asystować”.',36),
  ('rozszerzona','repetir curso','zwrot','powtarzać klasę','Ha tenido que repetir curso.','Musiał powtarzać klasę.','tener que + bezokolicznik = musieć.',37),
  ('rozszerzona','sacar adelante','zwrot','doprowadzić do końca, dać radę','Sacó adelante la carrera trabajando.','Skończył studia, pracując.','Idiom, dobrze punktowany za zakres środków językowych.',38)
) as v(lvl, term, pos, pl, ex, expl, note, ord);
