-- ============================================================================
-- Seed: Spanish grammar topics for Polish speakers  (language = 'es', level = 'B2')
-- File: supabase/seed/es_02_grammar_b2.sql
-- 5 topics, each with 6 exercises. Idempotent: deletes the B2/es slice first
-- (cascades to grammar_exercises), then re-inserts using fixed topic uuids.
-- ============================================================================

delete from grammar_topics where language = 'es' and level = 'B2';

-- ----------------------------------------------------------------------------
-- Topic 0: Subjuntivo imperfecto
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000d1', 'es', 'B2', 'es-subjuntivo-imperfecto', 'Subjuntivo imperfecto',
'Imperfecto de subjuntivo to czas przeszły trybu łączącego, którego używamy między innymi w zdaniach warunkowych nierzeczywistych, po czasownikach woli i emocji w czasie przeszłym oraz w grzecznych prośbach. Tworzenie tej formy jest bardzo regularne i opiera się na jednym wygodnym punkcie odniesienia. Bierzemy trzecią osobę liczby mnogiej czasu pretérito indefinido, odrzucamy końcówkę -ron i dodajemy nowe końcówki. Istnieją dwa równoważne zestawy końcówek: -ra, -ras, -ra, -ramos, -rais, -ran oraz -se, -ses, -se, -semos, -seis, -sen. Na przykład od hablar (ellos hablaron) tworzymy hablara lub hablase, a od tener (ellos tuvieron) tworzymy tuviera lub tuviese. Dzięki tej regule wszystkie czasowniki nieregularne w indefinido automatycznie dają nam poprawną formę subjuntivo, na przykład ser oraz ir dają fuera, a poder daje pudiera. Wariant na -ra jest częstszy w mowie potocznej, natomiast forma na -se brzmi nieco bardziej formalnie i literacko. Spójrz na przykłady w kontekście: Si tuviera más tiempo, aprendería italiano (Gdybym miał więcej czasu, uczyłbym się włoskiego). Me pidió que fuera puntual (Poprosił mnie, żebym był punktualny). Ojalá pudiera ayudarte, pero hoy estoy muy ocupado (Obym mógł ci pomóc, ale dziś jestem bardzo zajęty). Zwróć uwagę, że w formie nosotros zawsze pojawia się akcent graficzny na samogłosce przed końcówką: habláramos, tuviéramos, fuéramos. Ten czas jest kluczem do naturalnego wyrażania hipotez i uprzejmych próśb, dlatego warto ćwiczyć go regularnie.',
0);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000d1', 'gap_fill', 'Si yo ___ (tener) más tiempo, aprendería italiano.', NULL, 'tuviera', 0),
('e0000000-0000-4000-8000-0000000000d1', 'gap_fill', 'El profesor me pidió que ___ (ser) puntual.', NULL, 'fuera', 1),
('e0000000-0000-4000-8000-0000000000d1', 'multiple_choice', 'Elige el imperfecto de subjuntivo (querer, nosotros):', '["quisiéramos","queríamos","quisimos","querríamos"]'::jsonb, 'quisiéramos', 2),
('e0000000-0000-4000-8000-0000000000d1', 'multiple_choice', 'Elige la forma correcta: Ojalá ___ ayudarte, pero hoy no puedo.', '["pudiera","puedo","podría","pude"]'::jsonb, 'pudiera', 3),
('e0000000-0000-4000-8000-0000000000d1', 'gap_fill', 'Quería que tú ___ (venir) a la fiesta.', NULL, 'vinieras', 4),
('e0000000-0000-4000-8000-0000000000d1', 'transformation', 'Pasa la frase a un contexto pasado empezando por ''Quería que'': Quiero que estudies más.', NULL, 'Quería que estudiaras más.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Tryby warunkowe (condicionales)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000d2', 'es', 'B2', 'es-condicionales', 'Tryby warunkowe',
'Zdania warunkowe w języku hiszpańskim dzielimy zwykle na trzy główne typy, które różnią się stopniem prawdopodobieństwa. Każde zdanie warunkowe składa się z części z si (warunek) oraz części głównej (skutek). Pierwszy typ to warunek realny, dotyczący sytuacji prawdopodobnych lub zawsze prawdziwych. Używamy w nim schematu si + czas teraźniejszy, a w części głównej czasu teraźniejszego, przyszłego lub trybu rozkazującego, na przykład: Si tienes tiempo, ven a verme (Jeśli masz czas, przyjdź do mnie). Drugi typ to warunek hipotetyczny lub mało prawdopodobny, odnoszący się do teraźniejszości lub przyszłości. Tutaj stosujemy schemat si + imperfecto de subjuntivo, a w części głównej condicional simple, na przykład: Si ganara la lotería, viajaría por todo el mundo (Gdybym wygrał na loterii, podróżowałbym po całym świecie). Trzeci typ to warunek nierealny dotyczący przeszłości, czyli sytuacja, która już się nie wydarzy. Używamy wtedy schematu si + pluscuamperfecto de subjuntivo, a w części głównej condicional compuesto, na przykład: Si hubiera salido antes, no habría perdido el tren (Gdybym wyszedł wcześniej, nie spóźniłbym się na pociąg). Bardzo ważna zasada mówi, że po samym spójniku si nigdy nie stawiamy presente de subjuntivo ani condicional. Kolejność obu części jest dowolna, a gdy zaczynamy od warunku, oddzielamy części przecinkiem. Warto też wiedzieć, że w mowie potocznej Hiszpanie czasem zastępują condicional compuesto formą hubiera. Opanowanie tych trzech schematów pozwoli Ci precyzyjnie mówić o możliwościach, marzeniach i żalach.',
1);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000d2', 'gap_fill', 'Si yo ___ (ganar) la lotería, viajaría por todo el mundo.', NULL, 'ganara', 0),
('e0000000-0000-4000-8000-0000000000d2', 'gap_fill', 'Si hubiera estudiado más, ___ (aprobar) el examen.', NULL, 'habría aprobado', 1),
('e0000000-0000-4000-8000-0000000000d2', 'multiple_choice', 'Elige la forma correcta: Si tuviera dinero, ___ una casa.', '["compraría","compro","compraré","comprara"]'::jsonb, 'compraría', 2),
('e0000000-0000-4000-8000-0000000000d2', 'multiple_choice', 'Elige la forma correcta (condición real): Si ___ tiempo, ven a verme.', '["tienes","tuvieras","tendrías","tuvieses"]'::jsonb, 'tienes', 3),
('e0000000-0000-4000-8000-0000000000d2', 'gap_fill', 'Si mañana ___ (llover), no saldremos de casa.', NULL, 'llueve', 4),
('e0000000-0000-4000-8000-0000000000d2', 'transformation', 'Transforma en una condición imposible del pasado (tipo 3): Si estudio, apruebo.', NULL, 'Si hubiera estudiado, habría aprobado.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Mowa zależna (estilo indirecto)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000d3', 'es', 'B2', 'es-estilo-indirecto', 'Mowa zależna (estilo indirecto)',
'Mowa zależna, czyli estilo indirecto, służy do relacjonowania cudzych słów bez cytowania ich dosłownie. Zamiast powtarzać wypowiedź w cudzysłowie, wprowadzamy ją czasownikami takimi jak decir, comentar, preguntar czy explicar, zwykle w połączeniu ze spójnikiem que. Jeśli czasownik wprowadzający stoi w czasie przeszłym, następuje charakterystyczne przesunięcie czasów. Presente de indicativo zmienia się w pretérito imperfecto, na przykład zdanie Estoy cansado staje się Dijo que estaba cansado (Powiedział, że jest zmęczony). Pretérito perfecto oraz indefinido przechodzą w pluscuamperfecto, więc He terminado el trabajo zmienia się w Dijo que había terminado el trabajo. Futuro simple zamienia się na condicional simple, dlatego Vendré mañana staje się Dijo que vendría al día siguiente (Powiedział, że przyjdzie następnego dnia). Tryb rozkazujący przekształcamy w imperfecto de subjuntivo, na przykład polecenie Ven aquí staje się Me dijo que viniera. Pytania relacjonujemy za pomocą preguntar si, gdy pytanie jest ogólne, lub za pomocą słowa pytającego, gdy pytanie jest szczegółowe, na przykład Me preguntó si tenía tiempo (Zapytał mnie, czy mam czas). Oprócz czasów zmieniamy również zaimki osobowe, dzierżawcze oraz okoliczniki czasu i miejsca: aquí staje się allí, hoy staje się aquel día, a mañana staje się al día siguiente. Warto pamiętać, że jeśli czasownik wprowadzający stoi w czasie teraźniejszym, przesunięcie czasów nie następuje. Opanowanie mowy zależnej pozwoli Ci swobodnie streszczać rozmowy i relacjonować to, co powiedzieli inni.',
2);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000d3', 'gap_fill', 'Estilo directo: ''Estoy cansado''. Indirecto: Dijo que ___ (estar) cansado.', NULL, 'estaba', 0),
('e0000000-0000-4000-8000-0000000000d3', 'gap_fill', 'Estilo directo: ''Vendré mañana''. Indirecto: Dijo que ___ (venir) al día siguiente.', NULL, 'vendría', 1),
('e0000000-0000-4000-8000-0000000000d3', 'multiple_choice', 'Elige la forma correcta: ''He terminado el trabajo''. Dijo que ___ el trabajo.', '["había terminado","ha terminado","terminaba","terminó"]'::jsonb, 'había terminado', 2),
('e0000000-0000-4000-8000-0000000000d3', 'multiple_choice', 'Elige la forma correcta: ''¿Tienes tiempo?''. Me preguntó si ___ tiempo.', '["tenía","tengo","tendría","tuviera"]'::jsonb, 'tenía', 3),
('e0000000-0000-4000-8000-0000000000d3', 'gap_fill', 'Estilo directo: ''Ven aquí''. Indirecto: Me dijo que ___ (venir) allí.', NULL, 'viniera', 4),
('e0000000-0000-4000-8000-0000000000d3', 'transformation', 'Pasa a estilo indirecto empezando por ''Dijo que'': Quiero viajar a México.', NULL, 'Dijo que quería viajar a México.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Strona bierna (voz pasiva)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000d4', 'es', 'B2', 'es-voz-pasiva', 'Strona bierna',
'Strona bierna, czyli voz pasiva, przenosi uwagę z wykonawcy czynności na jej obiekt. W języku hiszpańskim istnieje kilka sposobów jej tworzenia, a najważniejszy z nich to tak zwana pasiva con ser. Budujemy ją według schematu ser w odpowiednim czasie plus imiesłów bierny (participio), który uzgadnia się w rodzaju i liczbie z podmiotem. Na przykład: La casa fue construida en 1990 (Dom został zbudowany w 1990 roku). Zwróć uwagę, że participio przyjmuje formę żeńską construida, ponieważ odnosi się do rzeczownika casa. Wykonawcę czynności, czyli tak zwany agente, wprowadzamy przyimkiem por, na przykład: La novela fue escrita por García Márquez (Powieść została napisana przez García Márqueza). Ta konstrukcja jest typowa dla języka pisanego, prasy i tekstów formalnych. W mowie potocznej znacznie częściej używamy jednak strony biernej zwrotnej, czyli pasiva refleja, tworzonej za pomocą se oraz czasownika w trzeciej osobie. Na przykład: Aquí se habla español (Tutaj mówi się po hiszpańsku) oraz Se venden pisos en esta zona (W tej okolicy sprzedaje się mieszkania). Zauważ, że czasownik uzgadnia się liczbą z rzeczownikiem, dlatego mówimy se vende un piso, ale se venden pisos. Warto też odróżnić stronę bierną czynności od opisu stanu, który tworzymy z czasownikiem estar, na przykład La puerta está cerrada opisuje rezultat, a nie samą czynność zamykania. Ogólnie hiszpański preferuje stronę czynną lub pasiva refleja, więc pasiva con ser stosuj z umiarem, głównie w bardziej oficjalnych wypowiedziach.',
3);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000d4', 'gap_fill', 'Voz pasiva con ser: La casa ___ (ser) construida en 1990.', NULL, 'fue', 0),
('e0000000-0000-4000-8000-0000000000d4', 'gap_fill', 'En la voz pasiva, el agente se introduce con la preposición ___.', NULL, 'por', 1),
('e0000000-0000-4000-8000-0000000000d4', 'multiple_choice', 'Elige la forma pasiva correcta: La novela ___ por García Márquez.', '["fue escrita","fue escrito","fueron escritas","está escribiendo"]'::jsonb, 'fue escrita', 2),
('e0000000-0000-4000-8000-0000000000d4', 'multiple_choice', 'Elige la pasiva refleja correcta: ___ español en este país.', '["Se habla","Es hablado","Se hablan","Está hablado"]'::jsonb, 'Se habla', 3),
('e0000000-0000-4000-8000-0000000000d4', 'gap_fill', 'Pasiva refleja: ___ (venderse) pisos en esta zona.', NULL, 'Se venden', 4),
('e0000000-0000-4000-8000-0000000000d4', 'transformation', 'Pon en voz pasiva con ser la frase: Cervantes escribió el Quijote.', NULL, 'El Quijote fue escrito por Cervantes.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Por vs para
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000d5', 'es', 'B2', 'es-por-para', 'Por vs para',
'Przyimki por i para sprawiają uczącym się dużo trudności, ponieważ oba tłumaczymy na polski między innymi jako dla, za lub przez. Klucz do ich rozróżnienia leży jednak w znaczeniu, a nie w tłumaczeniu. Przyimek para wyraża przede wszystkim cel, przeznaczenie i kierunek. Używamy go, gdy mówimy o celu działania, na przykład: Estudio español para trabajar en España (Uczę się hiszpańskiego, żeby pracować w Hiszpanii). Para wskazuje też odbiorcę czegoś, na przykład Este regalo es para ti (Ten prezent jest dla ciebie), a także termin lub datę graniczną, jak w Necesito el informe para el lunes. Wreszcie para wyraża kierunek podróży, na przykład Mañana salgo para Madrid, oraz opinię, jak w Para mí, esto es muy fácil. Przyimek por z kolei wskazuje przyczynę, motyw i wymianę. Używamy go, gdy podajemy powód działania lub przyczynę, na przykład: Gracias por tu ayuda (Dziękuję za twoją pomoc) oraz Lo hago por ti (Robię to dla ciebie, ze względu na ciebie). Por oznacza również cenę i wymianę, jak w Pagué diez euros por el libro, ruch przez jakieś miejsce, jak w Pasamos por el parque, a także przybliżony czas, jak w Estudio por la mañana. Prosta wskazówka pomaga zapamiętać różnicę: para zwykle patrzy w przyszłość i wskazuje cel, natomiast por częściej odnosi się do przyczyny, która leży u źródła działania. Warto uczyć się tych przyimków w konkretnych zwrotach, bo dzięki temu ich użycie szybko stanie się automatyczne.',
4);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Elige por o para: Estudio español ___ trabajar en España.', '["para","por","de","en"]'::jsonb, 'para', 0),
('e0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Elige por o para: Gracias ___ tu ayuda.', '["por","para","de","con"]'::jsonb, 'por', 1),
('e0000000-0000-4000-8000-0000000000d5', 'gap_fill', 'Completa con por o para: Este regalo es ___ ti.', NULL, 'para', 2),
('e0000000-0000-4000-8000-0000000000d5', 'gap_fill', 'Completa con por o para: Pagué diez euros ___ el libro.', NULL, 'por', 3),
('e0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Elige por o para: Mañana salgo ___ Madrid.', '["para","por","a","en"]'::jsonb, 'para', 4),
('e0000000-0000-4000-8000-0000000000d5', 'transformation', 'Reescribe eligiendo por o para (finalidad): Corro todos los días ___ estar en forma.', NULL, 'Corro todos los días para estar en forma.', 5);
