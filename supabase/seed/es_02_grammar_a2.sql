-- ============================================================================
-- Seed: Spanish grammar topics for Polish speakers  (language = 'es', level = 'A2')
-- File: supabase/seed/es_02_grammar_a2.sql
-- 5 topics, each with 5-6 exercises. Idempotent: deletes the A2/es slice first
-- (cascades to grammar_exercises), then re-inserts using fixed topic uuids.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run es_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'es' and level = 'A2';
delete from grammar_topics where language = 'es' and level = 'A2';

-- ----------------------------------------------------------------------------
-- Topic 0: Pretérito perfecto
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000b1', 'es', 'A2', 'es-preterito-perfecto', 'Pretérito perfecto',
'Pretérito perfecto to czas przeszły złożony, którego używamy do mówienia o czynnościach zakończonych, ale wciąż powiązanych z teraźniejszością. Tworzymy go z czasownika posiłkowego haber w czasie teraźniejszym oraz z imiesłowu (participio) czasownika głównego. Odmiana haber wygląda tak: he, has, ha, hemos, habéis, han. Imiesłów regularny tworzymy przez końcówki -ado (dla czasowników na -ar) oraz -ido (dla czasowników na -er oraz -ir). Na przykład: Hoy he hablado con mi madre (Dzisiaj rozmawiałem z mamą). Tego czasu używamy często z wyrażeniami takimi jak hoy, esta semana, este año, ya, todavía no, nunca oraz alguna vez. Kolejny przykład: Esta semana hemos trabajado mucho (W tym tygodniu dużo pracowaliśmy). Uwaga na imiesłowy nieregularne, których trzeba nauczyć się na pamięć: hacer -> hecho, escribir -> escrito, ver -> visto, poner -> puesto, decir -> dicho oraz volver -> vuelto. Przykład z formą nieregularną: ¿Alguna vez has visto el mar? (Czy kiedykolwiek widziałeś morze?). Imiesłów w tym czasie nigdy nie zmienia się przez rodzaj ani liczbę i zawsze kończy się na -o. Pamiętaj, że haber to nie to samo co tener, mimo że oba bywają tłumaczone jako mieć. Ten czas jest bardzo częsty w Hiszpanii, zwłaszcza gdy mówimy o tym, co wydarzyło się dzisiaj.',
0);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000b1', 'gap_fill', 'Hoy yo ___ (comer) paella con mis amigos.', NULL, 'he comido', 0),
('e0000000-0000-4000-8000-0000000000b1', 'gap_fill', 'Esta semana nosotros ___ (trabajar) mucho.', NULL, 'hemos trabajado', 1),
('e0000000-0000-4000-8000-0000000000b1', 'multiple_choice', 'Elige la forma correcta del auxiliar: Ella ___ escrito una carta.', '["ha","has","han"]'::jsonb, 'ha', 2),
('e0000000-0000-4000-8000-0000000000b1', 'multiple_choice', 'El participio del verbo "hacer" es ___.', '["hacido","hecho","haciendo"]'::jsonb, 'hecho', 3),
('e0000000-0000-4000-8000-0000000000b1', 'gap_fill', 'Yo nunca ___ (ver) esa película.', NULL, 'he visto', 4),
('e0000000-0000-4000-8000-0000000000b1', 'transformation', 'Cambia a pretérito perfecto la frase: "Yo escribo un correo."', NULL, 'Yo he escrito un correo.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Pretérito indefinido
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000b2', 'es', 'A2', 'es-preterito-indefinido', 'Pretérito indefinido',
'Pretérito indefinido to podstawowy czas przeszły dokonany, którego używamy do opisywania zakończonych czynności w przeszłości, bez związku z teraźniejszością. Używamy go z wyrażeniami czasu takimi jak ayer, anoche, el año pasado, la semana pasada oraz en 2010. Odmiana regularna dla czasowników na -ar, na przykład hablar, wygląda tak: hablé, hablaste, habló, hablamos, hablasteis, hablaron. Dla czasowników na -er oraz -ir (comer, vivir) końcówki są identyczne: comí, comiste, comió, comimos, comisteis, comieron. Przykład: Ayer hablé con mi jefe (Wczoraj rozmawiałem z szefem). Inny przykład: El verano pasado viajamos a España (Zeszłego lata pojechaliśmy do Hiszpanii). Wiele ważnych czasowników jest nieregularnych i trzeba je zapamiętać: ser oraz ir mają tę samą formę (fui, fuiste, fue), tener -> tuve, hacer -> hice, estar -> estuve oraz poder -> pude. Przykład z formą nieregularną: ¿Qué hiciste el fin de semana pasado? (Co robiłeś w zeszły weekend?). Zwróć uwagę na akcent graficzny w pierwszej i trzeciej osobie liczby pojedynczej: hablé oraz habló. Porównaj ten czas z pretérito perfecto: indefinido dotyczy przeszłości zamkniętej, a perfecto łączy się z teraźniejszością. W Ameryce Łacińskiej pretérito indefinido jest używany znacznie częściej niż w Hiszpanii.',
1);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000b2', 'gap_fill', 'Ayer yo ___ (hablar) con María por teléfono.', NULL, 'hablé', 0),
('e0000000-0000-4000-8000-0000000000b2', 'gap_fill', 'El año pasado ellos ___ (viajar) a México.', NULL, 'viajaron', 1),
('e0000000-0000-4000-8000-0000000000b2', 'multiple_choice', 'Elige la forma correcta: Ayer nosotros ___ al cine.', '["fuimos","vamos","íbamos"]'::jsonb, 'fuimos', 2),
('e0000000-0000-4000-8000-0000000000b2', 'multiple_choice', 'La forma de "tener" en pretérito indefinido (él) es ___.', '["tuvo","tenía","tiene"]'::jsonb, 'tuvo', 3),
('e0000000-0000-4000-8000-0000000000b2', 'gap_fill', '¿Qué ___ (hacer) tú el fin de semana pasado?', NULL, 'hiciste', 4),
('e0000000-0000-4000-8000-0000000000b2', 'transformation', 'Cambia a pretérito indefinido (yo, ayer) la frase: "Como una manzana."', NULL, 'Ayer comí una manzana.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Gerundio (estar + -ando/-iendo)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000b3', 'es', 'A2', 'es-gerundio', 'Gerundio (estar + -ando/-iendo)',
'Gerundio to hiszpańska forma czasownika, która odpowiada polskiej formie zakończonej na -ąc, na przykład robiąc czy jedząc. Najczęściej używamy jej w konstrukcji estar + gerundio, aby opisać czynność, która dzieje się właśnie teraz, w tym momencie. Gerundio regularne tworzymy w prosty sposób: dla czasowników na -ar dodajemy -ando (hablar -> hablando), a dla czasowników na -er oraz -ir dodajemy -iendo (comer -> comiendo, vivir -> viviendo). Czasownik estar odmieniamy: estoy, estás, está, estamos, estáis, están. Przykład: Ahora estoy comiendo (Teraz jem). Inny przykład: Los niños están jugando en el parque (Dzieci bawią się w parku). Istnieją także formy nieregularne, które warto zapamiętać: leer -> leyendo, oír -> oyendo, dormir -> durmiendo, pedir -> pidiendo oraz ir -> yendo. Przykład: ¿Qué estás haciendo? (Co robisz?). Gdy w temacie czasownika na -er lub -ir tuż przed końcówką stoi samogłoska, końcówka -iendo zmienia się na -yendo. Tej konstrukcji używamy tylko dla czynności trwających w danej chwili, a nie dla rutyny czy planów na przyszłość. Do zwykłych, powtarzalnych czynności używamy zwykłego czasu teraźniejszego, a nie estar + gerundio.',
2);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000b3', 'gap_fill', 'Ahora yo estoy ___ (comer) un bocadillo.', NULL, 'comiendo', 0),
('e0000000-0000-4000-8000-0000000000b3', 'gap_fill', 'Los niños están ___ (jugar) en el parque.', NULL, 'jugando', 1),
('e0000000-0000-4000-8000-0000000000b3', 'multiple_choice', 'El gerundio del verbo "leer" es ___.', '["leyendo","leiendo","leendo"]'::jsonb, 'leyendo', 2),
('e0000000-0000-4000-8000-0000000000b3', 'multiple_choice', 'Elige la forma correcta: Estamos ___ la televisión.', '["viendo","ver","visto"]'::jsonb, 'viendo', 3),
('e0000000-0000-4000-8000-0000000000b3', 'gap_fill', '¿Qué estás ___ (hacer) en este momento?', NULL, 'haciendo', 4),
('e0000000-0000-4000-8000-0000000000b3', 'transformation', 'Transforma con estar + gerundio (ahora) la frase: "Ella escribe una carta."', NULL, 'Ella está escribiendo una carta.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Stopniowanie przymiotników (comparativos)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000b4', 'es', 'A2', 'es-comparativos', 'Stopniowanie przymiotników',
'W tej lekcji uczymy się stopniowania przymiotników, czyli porównywania rzeczy i osób. W języku hiszpańskim istnieją trzy główne typy porównań. Porównanie wyższości (superioridad) tworzymy według wzoru más + przymiotnik + que. Przykład: Juan es más alto que Pedro (Juan jest wyższy niż Pedro). Porównanie niższości (inferioridad) tworzymy według wzoru menos + przymiotnik + que. Przykład: Este libro es menos interesante que el otro (Ta książka jest mniej interesująca niż tamta). Porównanie równości (igualdad) tworzymy według wzoru tan + przymiotnik + como. Przykład: María es tan simpática como su hermana (María jest tak miła jak jej siostra). Uwaga na formy nieregularne, których nie łączymy ze słowem más: bueno -> mejor (lepszy), malo -> peor (gorszy), grande -> mayor oraz pequeño -> menor. Stopień najwyższy (superlativo) tworzymy z rodzajnikiem: el, la, los lub las + más + przymiotnik. Przykład: Elena es la más inteligente de la clase (Elena jest najinteligentniejsza w klasie). Zapamiętaj prostą zasadę: w porównaniach wyższości i niższości zawsze pojawia się słowo que, a w porównaniu równości słowo como. Przymiotnik w hiszpańskim zgadza się w rodzaju i liczbie z rzeczownikiem, więc mówimy más alta dla kobiety oraz más altos dla grupy.',
3);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000b4', 'gap_fill', 'Este libro es más interesante ___ el otro.', NULL, 'que', 0),
('e0000000-0000-4000-8000-0000000000b4', 'gap_fill', 'Mi coche es tan rápido ___ el tuyo.', NULL, 'como', 1),
('e0000000-0000-4000-8000-0000000000b4', 'multiple_choice', 'Elige la forma correcta: María corre ___ rápido que su hermano.', '["más","mejor","tan"]'::jsonb, 'más', 2),
('e0000000-0000-4000-8000-0000000000b4', 'multiple_choice', 'Elige el comparativo irregular correcto: Este café es ___ que el otro (peor calidad).', '["peor","más malo","menos bien"]'::jsonb, 'peor', 3),
('e0000000-0000-4000-8000-0000000000b4', 'gap_fill', 'Elena es la ___ inteligente de la clase (superlativo).', NULL, 'más', 4),
('e0000000-0000-4000-8000-0000000000b4', 'transformation', 'Escribe un comparativo de superioridad con estas ideas: "Ana es alta. Luis es bajo."', NULL, 'Ana es más alta que Luis.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Ser vs estar
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000b5', 'es', 'A2', 'es-ser-vs-estar', 'Ser vs estar',
'Ser oraz estar to dwa hiszpańskie czasowniki, które po polsku tłumaczymy jako być, ale używamy ich w różnych sytuacjach. Czasownika ser używamy do cech stałych i trwałych: tożsamości, zawodu, narodowości, opisu charakteru, pochodzenia oraz materiału. Odmiana ser wygląda tak: soy, eres, es, somos, sois, son. Przykład: Ella es profesora (Ona jest nauczycielką). Inny przykład: La mesa es de madera (Stół jest z drewna). Czasownika estar używamy do stanów tymczasowych, samopoczucia, nastroju oraz położenia w przestrzeni. Odmiana estar wygląda tak: estoy, estás, está, estamos, estáis, están. Przykład: Madrid está en España (Madryt leży w Hiszpanii). Inny przykład: Hoy estoy muy cansado (Dzisiaj jestem bardzo zmęczony). Aby zapamiętać różnicę, pomyśl: ser opisuje to, kim lub czym coś jest na stałe, a estar opisuje, jak coś się ma teraz albo gdzie się znajduje. Niektóre przymiotniki zmieniają znaczenie zależnie od czasownika: ser aburrido znaczy być nudnym, a estar aburrido znaczy być znudzonym. Do mówienia o położeniu, czyli o tym gdzie coś się znajduje, zawsze używamy estar, nawet jeśli chodzi o miejsce stałe, takie jak miasto. To rozróżnienie jest jednym z najważniejszych tematów na poziomie A2.',
4);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Elige ser o estar: Madrid ___ en España.', '["está","es","son"]'::jsonb, 'está', 0),
('e0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Elige ser o estar: Ella ___ profesora de matemáticas.', '["es","está","están"]'::jsonb, 'es', 1),
('e0000000-0000-4000-8000-0000000000b5', 'gap_fill', 'Nosotros ___ (estar) muy cansados hoy.', NULL, 'estamos', 2),
('e0000000-0000-4000-8000-0000000000b5', 'gap_fill', 'La mesa ___ (ser) de madera.', NULL, 'es', 3),
('e0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Elige la forma correcta: ¿Cómo ___ tú hoy? Muy bien, gracias.', '["estás","eres","estar"]'::jsonb, 'estás', 4),
('e0000000-0000-4000-8000-0000000000b5', 'transformation', 'Forma una frase correcta con ser o estar usando estas palabras: "Hoy / yo / muy feliz."', NULL, 'Hoy estoy muy feliz.', 5);
