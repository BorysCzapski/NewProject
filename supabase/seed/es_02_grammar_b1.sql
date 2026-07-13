-- ============================================================================
-- Seed: Spanish grammar topics for Polish speakers  (language = 'es', level = 'B1')
-- File: supabase/seed/es_02_grammar_b1.sql
-- 5 topics, each with 5-6 exercises. Idempotent: deletes the B1/es slice first
-- (cascades to grammar_exercises), then re-inserts using fixed topic uuids.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run es_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'es' and level = 'B1';
delete from grammar_topics where language = 'es' and level = 'B1';

-- ----------------------------------------------------------------------------
-- Topic 0: Pretérito imperfecto
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000c1', 'es', 'B1', 'es-imperfecto', 'Pretérito imperfecto',
'Pretérito imperfecto to czas przeszły, którego używamy do opisywania czynności trwających, powtarzających się lub tworzących tło wydarzeń. W przeciwieństwie do pretérito indefinido, imperfecto nie skupia się na zakończeniu czynności, lecz na jej trwaniu i powtarzalności. Używamy go, gdy opisujemy dawne zwyczaje, na przykład: Cuando era niño, jugaba al fútbol todos los días (Kiedy byłem dzieckiem, codziennie grałem w piłkę). Świetnie nadaje się też do opisu miejsc, osób i pogody w przeszłości: La casa era grande y tenía un jardín precioso (Dom był duży i miał przepiękny ogród). Odmiana czasowników regularnych jest bardzo prosta i ma tylko dwa wzory. Dla czasowników na -ar dodajemy końcówki -aba, -abas, -aba, -ábamos, -abais, -aban. Dla czasowników na -er oraz -ir używamy końcówek -ía, -ías, -ía, -íamos, -íais, -ían. W tym czasie istnieją tylko trzy czasowniki nieregularne: ser (era), ir (iba) oraz ver (veía). Imperfecto często pojawia się z wyrażeniami takimi jak antes, siempre, todos los días czy mientras. Bardzo typowe jest łączenie imperfecto z indefinido w jednym zdaniu: Mientras estudiaba, sonó el teléfono (Kiedy się uczyłem, zadzwonił telefon). Warto zapamiętać, że imperfecto tłumaczymy zwykle jako czynność niedokonaną. Dzięki temu czasowi Twoje opowieści o przeszłości staną się znacznie bardziej naturalne i płynne.',
0);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000c1', 'gap_fill', 'Cuando yo ___ (ser) niño, jugaba al fútbol todos los días.', NULL, 'era', 0),
('e0000000-0000-4000-8000-0000000000c1', 'gap_fill', 'Antes nosotros ___ (vivir) en Madrid.', NULL, 'vivíamos', 1),
('e0000000-0000-4000-8000-0000000000c1', 'multiple_choice', 'Elige la forma correcta: Todos los días ella ___ a la escuela.', '["iba","fue","va","irá"]'::jsonb, 'iba', 2),
('e0000000-0000-4000-8000-0000000000c1', 'multiple_choice', 'Elige la forma correcta: Mientras yo ___, sonó el teléfono.', '["estudiaba","estudié","estudio","estudiaré"]'::jsonb, 'estudiaba', 3),
('e0000000-0000-4000-8000-0000000000c1', 'gap_fill', 'La casa ___ (ser) grande y bonita.', NULL, 'era', 4),
('e0000000-0000-4000-8000-0000000000c1', 'transformation', 'Escribe en pretérito imperfecto la frase: Yo veo la televisión cada noche.', NULL, 'Yo veía la televisión cada noche.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Subjuntivo presente (wprowadzenie)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000c2', 'es', 'B1', 'es-subjuntivo-presente', 'Subjuntivo presente (wprowadzenie)',
'Tryb subjuntivo to jeden z najważniejszych elementów gramatyki hiszpańskiej, który sprawia trudność wielu uczącym się. Używamy go przede wszystkim wtedy, gdy wyrażamy życzenia, emocje, wątpliwości lub polecenia dotyczące innej osoby. Subjuntivo prawie zawsze pojawia się w zdaniach podrzędnych wprowadzanych spójnikiem que. Aby utworzyć presente de subjuntivo, bierzemy pierwszą osobę liczby pojedynczej czasu teraźniejszego, odrzucamy końcówkę -o i dodajemy przeciwne końcówki. Dla czasowników na -ar są to: -e, -es, -e, -emos, -éis, -en. Dla czasowników na -er oraz -ir używamy końcówek: -a, -as, -a, -amos, -áis, -an. Na przykład od hablar tworzymy hable, a od comer tworzymy coma. Typowe wyrażenia, po których pojawia się subjuntivo, to querer que, esperar que, ojalá oraz es importante que. Spójrz na przykłady: Quiero que vengas a mi fiesta (Chcę, żebyś przyszedł na moją imprezę). Espero que tengas un buen día (Mam nadzieję, że będziesz mieć dobry dzień). Bardzo częste jest też użycie ze słowem ojalá: Ojalá llueva mañana (Oby jutro padało). Zwróć uwagę, że po wyrażeniach pewności, takich jak creo que, zwykle używamy trybu oznajmującego, a nie subjuntivo. Na początku warto nauczyć się kilku gotowych zwrotów i stopniowo rozszerzać ich użycie, aż subjuntivo stanie się dla Ciebie zupełnie naturalny.',
1);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Quiero que tú ___ (venir) a mi fiesta.', NULL, 'vengas', 0),
('e0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Ojalá mañana ___ (llover).', NULL, 'llueva', 1),
('e0000000-0000-4000-8000-0000000000c2', 'multiple_choice', 'Elige la forma correcta: Espero que ustedes ___ un buen viaje.', '["tengan","tienen","tuvieron","tendrán"]'::jsonb, 'tengan', 2),
('e0000000-0000-4000-8000-0000000000c2', 'multiple_choice', 'Elige la forma correcta: Es importante que nosotros ___ español todos los días.', '["estudiemos","estudiamos","estudiar","estudiaremos"]'::jsonb, 'estudiemos', 3),
('e0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Mi madre quiere que yo ___ (decir) la verdad.', NULL, 'diga', 4),
('e0000000-0000-4000-8000-0000000000c2', 'transformation', 'Transforma empezando por ''Quiero que'' la frase: Tú comes más verdura.', NULL, 'Quiero que comas más verdura.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Tryb rozkazujący (imperativo)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000c3', 'es', 'B1', 'es-imperativo', 'Tryb rozkazujący (imperativo)',
'Tryb rozkazujący, czyli imperativo, służy do wydawania poleceń, udzielania rad oraz dawania instrukcji. W języku hiszpańskim jego forma zależy od tego, czy polecenie jest twierdzące, czy przeczące, oraz od osoby, do której się zwracamy. W formie twierdzącej dla tú imperativo regularne jest identyczne z trzecią osobą liczby pojedynczej czasu teraźniejszego: hablar -> habla, comer -> come, escribir -> escribe. Przykład: Habla más despacio, por favor (Mów wolniej, proszę). Istnieje jednak kilka bardzo ważnych form nieregularnych dla tú, które trzeba znać na pamięć: decir -> di, hacer -> haz, ir -> ve, poner -> pon, salir -> sal, ser -> sé, tener -> ten oraz venir -> ven. Przykład: Ven aquí ahora mismo (Chodź tu natychmiast). W formie przeczącej używamy trybu subjuntivo: no hables, no comas, no escribas. Przykład: No comas tan rápido (Nie jedz tak szybko). Formy grzecznościowe z usted również opierają się na subjuntivo, na przykład hable usted albo venga usted. Warto pamiętać, że w formie twierdzącej zaimki dopełnienia doczepiamy na końcu czasownika (dímelo), a w formie przeczącej stawiamy je przed czasownikiem (no me lo digas). Opanowanie imperativo pozwoli Ci swobodnie prosić, radzić i wydawać polecenia po hiszpańsku.',
2);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Imperativo afirmativo (tú): ___ (abrir) la puerta, por favor.', NULL, 'Abre', 0),
('e0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Imperativo negativo (tú): No ___ (comer) tan rápido.', NULL, 'comas', 1),
('e0000000-0000-4000-8000-0000000000c3', 'multiple_choice', 'Elige la forma imperativa afirmativa de hacer (tú):', '["haz","hace","haga","haces"]'::jsonb, 'haz', 2),
('e0000000-0000-4000-8000-0000000000c3', 'multiple_choice', 'Elige la forma correcta: ___ usted aquí, por favor. (venir)', '["Venga","Ven","Viene","Vengas"]'::jsonb, 'Venga', 3),
('e0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Imperativo afirmativo (tú): ___ (venir) aquí ahora mismo.', NULL, 'Ven', 4),
('e0000000-0000-4000-8000-0000000000c3', 'transformation', 'Cambia a imperativo negativo (tú) la frase: Habla con él.', NULL, 'No hables con él.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Futuro simple
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000c4', 'es', 'B1', 'es-futuro-simple', 'Futuro simple',
'Futuro simple to czas przyszły prosty, którego używamy do mówienia o wydarzeniach, które dopiero nastąpią, a także do wyrażania przypuszczeń dotyczących teraźniejszości. Jego tworzenie jest wyjątkowo proste, ponieważ dodajemy końcówki bezpośrednio do bezokolicznika, bez odrzucania jakiejkolwiek części. Końcówki są takie same dla wszystkich trzech koniugacji: -é, -ás, -á, -emos, -éis, -án. Wszystkie końcówki oprócz formy nosotros mają akcent graficzny. Przykład: Mañana viajaré a España (Jutro pojadę do Hiszpanii). Istnieje grupa czasowników o nieregularnym temacie, choć końcówki pozostają identyczne: tener -> tendr-, salir -> saldr-, poder -> podr-, hacer -> har-, decir -> dir-, venir -> vendr-, poner -> pondr-, saber -> sabr- oraz querer -> querr-. Przykład: El año que viene tendremos más tiempo (W przyszłym roku będziemy mieć więcej czasu). Futuro simple bardzo często wyraża też prawdopodobieństwo i domysł w teraźniejszości. Zapytanie ¿Qué hora será? oznacza Ciekawe, która jest godzina. Inny przykład domysłu: Estará en casa (Pewnie jest w domu). W mowie potocznej Hiszpanie często zastępują futuro simple konstrukcją ir a + bezokolicznik, ale znajomość obu form jest bardzo przydatna. Dzięki temu czasowi z łatwością opowiesz o swoich planach i przewidywaniach.',
3);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000c4', 'gap_fill', 'Mañana yo ___ (viajar) a España.', NULL, 'viajaré', 0),
('e0000000-0000-4000-8000-0000000000c4', 'gap_fill', 'El año que viene nosotros ___ (tener) más tiempo.', NULL, 'tendremos', 1),
('e0000000-0000-4000-8000-0000000000c4', 'multiple_choice', 'Elige la forma correcta (probabilidad): ¿Qué hora ___?', '["será","es","sería","fue"]'::jsonb, 'será', 2),
('e0000000-0000-4000-8000-0000000000c4', 'multiple_choice', 'Elige la forma correcta: Ellos ___ la verdad tarde o temprano. (saber)', '["sabrán","saberán","saben","supieron"]'::jsonb, 'sabrán', 3),
('e0000000-0000-4000-8000-0000000000c4', 'gap_fill', '¿Tú ___ (venir) a la fiesta el sábado?', NULL, 'vendrás', 4),
('e0000000-0000-4000-8000-0000000000c4', 'transformation', 'Pasa al futuro simple la frase: Yo hago la tarea.', NULL, 'Yo haré la tarea.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Zaimki dopełnienia (OD/OI)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values
('e0000000-0000-4000-8000-0000000000c5', 'es', 'B1', 'es-pronombres-od-oi', 'Zaimki dopełnienia (OD/OI)',
'Zaimki dopełnienia bliższego i dalszego to jeden z kluczowych tematów gramatyki hiszpańskiej na poziomie B1. Dopełnienie bliższe (complemento directo, OD) odpowiada na pytanie kogo? co? i przyjmuje formy: me, te, lo, la, nos, os, los, las. Dopełnienie dalsze (complemento indirecto, OI) odpowiada na pytanie komu? czemu? i ma formy: me, te, le, nos, os, les. Zaimki te stawiamy zwykle bezpośrednio przed odmienionym czasownikiem. Na przykład zamiast powtarzać rzeczownik, mówimy: ¿Ves la película? Sí, la veo (Widzisz film? Tak, oglądam go). Jeśli w zdaniu jest bezokolicznik, gerundio lub tryb rozkazujący, zaimek możemy doczepić na końcu czasownika: Voy a comprarlo (Zamierzam to kupić). Gdy w jednym zdaniu występują oba zaimki, dopełnienie dalsze stoi zawsze przed bliższym. Uwaga na ważną zasadę: kiedy le lub les spotyka się z lo, la, los albo las, zmienia się w se. Dlatego zamiast le lo doy powiemy se lo doy. Spójrz na przykład z pełnym kontekstem: Le doy el libro a María staje się Se lo doy (Daję jej to). Pamiętaj też, że w hiszpańskim często dublujemy dopełnienie dalsze: A María le doy el libro. Opanowanie tych zaimków sprawi, że Twoje wypowiedzi będą brzmiały o wiele bardziej naturalnie i płynnie.',
4);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Elige el pronombre correcto: ¿Ves la película? Sí, ___ veo.', '["la","lo","le","les"]'::jsonb, 'la', 0),
('e0000000-0000-4000-8000-0000000000c5', 'gap_fill', 'Sustituye el objeto directo: ¿Tienes el libro? Sí, ___ tengo.', NULL, 'lo', 1),
('e0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Elige la forma correcta: Le doy el libro a María. = ___ doy.', '["Se lo","Le lo","Lo le","Se la"]'::jsonb, 'Se lo', 2),
('e0000000-0000-4000-8000-0000000000c5', 'gap_fill', 'Completa con el pronombre de objeto indirecto: A nosotros ___ gusta el español.', NULL, 'nos', 3),
('e0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Elige la forma correcta: Voy a comprar el pan. = Voy a ___.', '["comprarlo","comprarle","comprando","lo comprar"]'::jsonb, 'comprarlo', 4),
('e0000000-0000-4000-8000-0000000000c5', 'transformation', 'Sustituye los objetos por pronombres en la frase: Doy el regalo a mis padres.', NULL, 'Se lo doy.', 5);
