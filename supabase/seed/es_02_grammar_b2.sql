-- ============================================================================
-- Seed: Spanish grammar topics for Polish speakers  (language = 'es', level = 'B2')
-- File: supabase/seed/es_02_grammar_b2.sql
-- 5 topics, each with 6 exercises. Idempotent: deletes the B2/es slice first
-- (cascades to grammar_exercises), then re-inserts using fixed topic uuids.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run es_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'es' and level = 'B2';
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

-- ----------------------------------------------------------------------------
-- Topic 5: Oraciones de relativo (indicativo vs. subjuntivo)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'es', 'B2', 'es-oraciones-relativas', 'Oraciones de relativo: indicativo vs. subjuntivo',
'Oraciones de relativo (zdania względne) łączą dwa zdania za pomocą zaimka względnego — najczęściej que, ale też quien/quienes, el que/la que/los que/las que, el cual oraz cuyo — i pozwalają dodać informację o rzeczowniku bez powtarzania go. Kluczowe pytanie na poziomie B2 nie dotyczy jednak samego zaimka, lecz trybu czasownika w zdaniu podrzędnym: indicativo czy subjuntivo? Reguła jest prosta, choć wymaga wprawy: jeśli poprzednik (antecedente), czyli rzeczownik, do którego odnosi się zaimek, jest konkretny, znany i istniejący, używamy indicativo. Jeśli poprzednik jest nieokreślony, nieznany, hipotetyczny lub zaprzeczony, używamy subjuntivo. Porównaj: Conozco a un chico que habla cuatro idiomas (Znam chłopaka, który mówi w czterech językach) — chłopak istnieje konkretnie, więc indicativo. Busco a un chico que hable cuatro idiomas (Szukam chłopaka, który mówiłby w czterech językach) — taki chłopak jest tylko wyobrażony, jeszcze go nie znalazłem, więc subjuntivo. Ta sama zasada działa z przeczeniem: No hay nadie que sepa la respuesta (Nie ma nikogo, kto znałby odpowiedź) — nadie to poprzednik nieistniejący, zawsze subjuntivo. Podobnie z pytaniami o istnienie: ¿Hay algún restaurante que esté abierto ahora? (Czy jest jakaś restauracja, która jest teraz otwarta?) — nie wiemy, czy taka restauracja istnieje, dlatego subjuntivo. Zaimek quien/quienes zastępuje osoby i często pojawia się po przyimku: La persona con quien hablé ayer es mi jefa (Osoba, z którą rozmawiałem wczoraj, to moja szefowa). Cuyo/cuya/cuyos/cuyas odpowiada polskiemu „którego, czyj” i uzgadnia się z rzeczownikiem, który po nim następuje, a nie z poprzednikiem: El escritor cuyo libro leí es argentino (Pisarz, którego książkę przeczytałem, jest Argentyńczykiem). Najczęstszy błąd Polaków to automatyczne stosowanie indicativo we wszystkich zdaniach względnych, bo w polskim nie istnieje takie rozróżnienie — trzeba świadomie zadać sobie pytanie, czy dana osoba lub rzecz na pewno istnieje. Innym błędem jest mylenie cuyo z quien — cuyo zawsze wprowadza rzeczownik (cuyo libro), nigdy nie stoi samodzielnie. Warto też zapamiętać wzorzec z przeczeniem i pytaniami o istnienie, który niemal zawsze bierze subjuntivo, w przeciwieństwie do zdań stwierdzających istnienie czegoś konkretnego. Opanowanie tej reguły znacząco podniesie precyzję Twoich wypowiedzi na poziomie B2.',
5);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'gap_fill', 'Conozco a un chico que ___ (hablar) cuatro idiomas.', NULL, 'habla', 0),
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'gap_fill', 'Busco a un chico que ___ (hablar) cuatro idiomas.', NULL, 'hable', 1),
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'gap_fill', 'No hay nadie que ___ (saber) la respuesta.', NULL, 'sepa', 2),
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'multiple_choice', 'Elige la forma correcta: ¿Hay algún restaurante que ___ abierto ahora?', '["esté","está","estará"]'::jsonb, 'esté', 3),
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'multiple_choice', 'Elige el relativo correcto: El escritor ___ libro leí es argentino.', '["cuyo","que","quien"]'::jsonb, 'cuyo', 4),
('22caf5c4-5139-4603-9e34-39d1e392fd43', 'transformation', 'Transforma al subjuntivo (el amigo buscado todavía no existe): Tengo un amigo que vive en Madrid. → Busco un amigo que...', NULL, 'Busco un amigo que viva en Madrid.', 5);

-- ----------------------------------------------------------------------------
-- Topic 6: Conectores concesivos y causales
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('759d1541-7c90-4015-af2c-392eac52f52c', 'es', 'B2', 'es-conectores-concesivos-causales', 'Conectores concesivos y causales',
'Konektory przyczynowe i przyzwalające pozwalają budować bardziej złożone, dojrzałe zdania, typowe dla poziomu B2. Do wyrażania przyczyny najczęściej służy porque, które zawsze łączy się z trybem oznajmującym i zwykle stoi w środku lub na końcu zdania: No fui a la fiesta porque estaba muy cansado (Nie poszedłem na imprezę, bo byłem bardzo zmęczony). Ya que oraz puesto que również wprowadzają przyczynę, ale sugerują, że powód jest znany obu rozmówcom lub oczywisty, i częściej otwierają zdanie: Ya que estás aquí, ayúdame con esto (Skoro już tu jesteś, pomóż mi z tym); Puesto que no hay más preguntas, terminamos la reunión (Ponieważ nie ma więcej pytań, kończymy spotkanie). Do wyrażania przyzwolenia (mimo że, chociaż) służy przede wszystkim aunque, które jako jedyny z tych spójników zmienia znaczenie w zależności od trybu czasownika. Aunque + indicativo informuje o fakcie znanym i pewnym mówiącemu: Aunque llueve, salgo a correr (Chociaż pada — i wiem, że pada — wychodzę biegać). Aunque + subjuntivo wskazuje na fakt hipotetyczny, nieznany lub nieistotny dla decyzji mówiącego: Aunque llueva mañana, saldré a correr (Nawet jeśli będzie padać — nie wiem, czy będzie — i tak wyjdę biegać). Ta różnica jest kluczowa: subjuntivo po aunque nie oznacza niepewności co do gramatyki, lecz świadomy wybór znaczeniowy. A pesar de que zachowuje się podobnie do aunque i również dopuszcza oba tryby według tej samej zasady, natomiast a pesar de (bez que) łączy się z rzeczownikiem lub bezokolicznikiem, a nie z odmienionym czasownikiem: A pesar de la lluvia, salimos a pasear (Mimo deszczu wyszliśmy na spacer); A pesar de estudiar mucho, no aprobó el examen (Mimo że dużo się uczył, nie zdał egzaminu). Typowy błąd Polaków to używanie porque zamiast pero albo aunque przy przeciwstawieniu — porque wprowadza WYŁĄCZNIE przyczynę, nigdy kontrast: „Estudio mucho porque no apruebo” brzmi nielogicznie; poprawnie: Estudio mucho, pero no apruebo albo Aunque estudio mucho, no apruebo. Innym błędem jest automatyczne stawianie subjuntivo po każdym aunque — jeśli fakt jest pewny i znany, indicativo jest poprawną i częstszą opcją. Warto zapamiętać, że formalne ya que i puesto que dobrze sprawdzają się w pisemnych argumentacjach i esejach na poziomie B2, podczas gdy porque dominuje w mowie potocznej.',
6);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('759d1541-7c90-4015-af2c-392eac52f52c', 'gap_fill', 'No fui a la fiesta porque ___ (estar) muy cansado.', NULL, 'estaba', 0),
('759d1541-7c90-4015-af2c-392eac52f52c', 'gap_fill', 'Aunque ___ (llover) mucho, salgo a correr todos los días. (hecho conocido)', NULL, 'llueve', 1),
('759d1541-7c90-4015-af2c-392eac52f52c', 'gap_fill', 'Aunque ___ (llover) mañana, saldré a correr de todos modos. (hecho hipotético)', NULL, 'llueva', 2),
('759d1541-7c90-4015-af2c-392eac52f52c', 'multiple_choice', 'Elige el conector correcto: ___ estás aquí, ayúdame con esto.', '["Ya que","Porque","Aunque"]'::jsonb, 'Ya que', 3),
('759d1541-7c90-4015-af2c-392eac52f52c', 'multiple_choice', 'Elige la forma correcta: A pesar de ___ mucho, no aprobó el examen.', '["estudiar","estudia","estudiara"]'::jsonb, 'estudiar', 4),
('759d1541-7c90-4015-af2c-392eac52f52c', 'transformation', 'Une las frases con ''aunque + subjuntivo'' (hecho hipotético): Puede que llueva mañana. / Saldré a correr.', NULL, 'Aunque llueva mañana, saldré a correr.', 5);
