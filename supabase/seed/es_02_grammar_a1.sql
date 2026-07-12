-- ============================================================================
-- Seed: Spanish (es) grammar topics + exercises, level A1
-- App: Polish speakers learning Spanish
-- File: supabase/seed/es_02_grammar_a1.sql
-- Idempotent: deletes existing es/A1 grammar topics (cascades to exercises)
--             before re-inserting. Uses fixed UUIDs for stable references.
-- ============================================================================

delete from grammar_topics where language = 'es' and level = 'A1';

-- ----------------------------------------------------------------------------
-- Topic 0: Rodzajniki i rodzaj (el/la)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'e0000000-0000-4000-8000-0000000000a1',
  'es',
  'A1',
  'es-articulos-genero',
  'Rodzajniki i rodzaj (el/la)',
  'W języku hiszpańskim każdy rzeczownik ma rodzaj: męski albo żeński. Przed rzeczownikiem stawiamy rodzajnik określony, który zgadza się z tym rodzajem. Dla rodzaju męskiego w liczbie pojedynczej używamy "el", a dla rodzaju żeńskiego "la". Na przykład mówimy "el libro" (książka jako rodzaj męski) oraz "la casa" (dom, tu rodzaj żeński). Bardzo często rzeczowniki zakończone na -o są rodzaju męskiego, a te zakończone na -a są rodzaju żeńskiego. Dlatego naturalnie brzmi "el niño" (chłopiec) i "la niña" (dziewczynka). Uwaga jednak, bo od tej reguły jest sporo wyjątków, których trzeba się nauczyć na pamięć. Słowo "el problema" jest rodzaju męskiego, mimo że kończy się na -a, a "la mano" (ręka) jest rodzaju żeńskiego, chociaż kończy się na -o. Rodzaju najlepiej uczyć się razem z rodzajnikiem, czyli zapamiętywać od razu "la mesa", a nie samo "mesa". Rodzajnik "la" wskazuje, że rzeczownik jest żeński, na przykład "La mesa es grande" (Stół jest duży). Rodzajnik "el" wskazuje rodzaj męski, na przykład "El coche es rápido" (Samochód jest szybki). Rodzaj wpływa też na przymiotniki i inne słowa w zdaniu, dlatego jest tak ważny już od poziomu A1. Na razie skup się na zapamiętaniu, kiedy używać "el", a kiedy "la".',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000a1', 'gap_fill', 'Uzupełnij rodzajnikiem: ___ profesor es simpático.', NULL, 'El', 0),
('e0000000-0000-4000-8000-0000000000a1', 'gap_fill', 'Uzupełnij rodzajnikiem: ___ mesa es de madera.', NULL, 'La', 1),
('e0000000-0000-4000-8000-0000000000a1', 'multiple_choice', 'Jaki rodzajnik pasuje do słowa «mano»?', '["el","la","los"]'::jsonb, 'la', 2),
('e0000000-0000-4000-8000-0000000000a1', 'multiple_choice', 'Jaki rodzajnik pasuje do słowa «día»?', '["el","la","las"]'::jsonb, 'el', 3),
('e0000000-0000-4000-8000-0000000000a1', 'transformation', 'Zamień na rodzaj żeński: «el niño» → ___', NULL, 'la niña', 4),
('e0000000-0000-4000-8000-0000000000a1', 'gap_fill', 'Uzupełnij rodzajnikiem: ___ manzana es roja.', NULL, 'La', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Czasownik ser
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'e0000000-0000-4000-8000-0000000000a2',
  'es',
  'A1',
  'es-ser',
  'Czasownik ser',
  'Czasownik "ser" znaczy "być" i jest jednym z najważniejszych czasowników w hiszpańskim. Jest nieregularny, więc jego formy trzeba po prostu zapamiętać. W czasie teraźniejszym odmienia się tak: yo soy, tú eres, él/ella es, nosotros somos, vosotros sois, ellos/ellas son. Czasownika "ser" używamy, gdy mówimy o cechach stałych, tożsamości, zawodzie, pochodzeniu czy narodowości. Na przykład powiemy "Yo soy de Polonia" (Jestem z Polski), bo pochodzenie się nie zmienia. Kiedy mówimy o zawodzie, też używamy "ser", na przykład "Ella es profesora" (Ona jest nauczycielką). Gdy opisujemy czyjś charakter lub wygląd jako cechę trwałą, również wybieramy "ser", na przykład "Nosotros somos altos" (Jesteśmy wysocy). W hiszpańskim bardzo często pomijamy zaimek osobowy, bo końcówka czasownika już mówi, o kim mowa, dlatego "Soy estudiante" znaczy po prostu "Jestem studentem". Ważne, żeby nie mylić "ser" z drugim czasownikiem "estar", który też znaczy "być", ale używa się go w innych sytuacjach. Na tym poziomie zapamiętaj, że "ser" opisuje to, kim ktoś jest na stałe. Ćwicz wszystkie sześć form, aż wejdą Ci w krew.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000a2', 'gap_fill', 'Uzupełnij formą czasownika ser: Yo ___ de Polonia.', NULL, 'soy', 0),
('e0000000-0000-4000-8000-0000000000a2', 'gap_fill', 'Uzupełnij formą czasownika ser: Nosotros ___ estudiantes.', NULL, 'somos', 1),
('e0000000-0000-4000-8000-0000000000a2', 'multiple_choice', 'Wybierz poprawną formę: Ella ___ profesora.', '["soy","eres","es"]'::jsonb, 'es', 2),
('e0000000-0000-4000-8000-0000000000a2', 'multiple_choice', 'Wybierz poprawną formę: ¿De dónde ___ (tú)?', '["es","eres","soy"]'::jsonb, 'eres', 3),
('e0000000-0000-4000-8000-0000000000a2', 'transformation', 'Napisz w liczbie mnogiej: «Él es médico.» → ___', NULL, 'Ellos son médicos.', 4),
('e0000000-0000-4000-8000-0000000000a2', 'gap_fill', 'Uzupełnij formą czasownika ser: Vosotros ___ muy amables.', NULL, 'sois', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Czasownik estar
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'e0000000-0000-4000-8000-0000000000a3',
  'es',
  'A1',
  'es-estar',
  'Czasownik estar',
  'Czasownik "estar" to drugi hiszpański czasownik, który znaczy "być". Także jest nieregularny i jego formy warto znać na pamięć. W czasie teraźniejszym odmienia się tak: yo estoy, tú estás, él/ella está, nosotros estamos, vosotros estáis, ellos/ellas están. Czasownika "estar" używamy przede wszystkim, gdy mówimy o położeniu, czyli gdzie ktoś lub coś się znajduje. Na przykład powiemy "Madrid está en España" (Madryt leży w Hiszpanii). Używamy go też, gdy opisujemy stany chwilowe, na przykład nastrój albo samopoczucie, które mogą się zmienić. Dlatego mówimy "Yo estoy cansado" (Jestem zmęczony) albo "Nosotros estamos contentos" (Jesteśmy zadowoleni). Zapamiętaj prostą zasadę: "ser" opisuje cechy stałe, a "estar" położenie oraz stany chwilowe. Zwróć uwagę, że wiele form "estar" ma akcent graficzny, na przykład "estás" i "está", i ten akcent trzeba pisać. Podobnie jak przy "ser", zaimek osobowy często pomijamy, bo końcówka wystarcza. Na poziomie A1 najważniejsze jest, żebyś umiał powiedzieć, gdzie coś jest i jak się czujesz, używając właśnie "estar". Ćwicz oba czasowniki obok siebie, żeby dobrze czuć różnicę między nimi.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000a3', 'gap_fill', 'Uzupełnij formą czasownika estar: Yo ___ en casa.', NULL, 'estoy', 0),
('e0000000-0000-4000-8000-0000000000a3', 'gap_fill', 'Uzupełnij formą czasownika estar: Madrid ___ en España.', NULL, 'está', 1),
('e0000000-0000-4000-8000-0000000000a3', 'multiple_choice', 'Wybierz poprawną formę: Nosotros ___ cansados.', '["estamos","están","estáis"]'::jsonb, 'estamos', 2),
('e0000000-0000-4000-8000-0000000000a3', 'multiple_choice', 'Wybierz poprawną formę: ¿Cómo ___ (tú)?', '["estás","está","estoy"]'::jsonb, 'estás', 3),
('e0000000-0000-4000-8000-0000000000a3', 'transformation', 'Napisz w liczbie mnogiej: «Yo estoy contento.» → ___', NULL, 'Nosotros estamos contentos.', 4),
('e0000000-0000-4000-8000-0000000000a3', 'gap_fill', 'Uzupełnij formą czasownika estar: Los libros ___ en la mesa.', NULL, 'están', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Liczba mnoga rzeczowników
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'e0000000-0000-4000-8000-0000000000a4',
  'es',
  'A1',
  'es-plural',
  'Liczba mnoga rzeczowników',
  'Tworzenie liczby mnogiej rzeczowników w hiszpańskim jest dość proste i opiera się na kilku regułach. Jeśli rzeczownik kończy się na samogłoskę, dodajemy końcówkę -s. Dlatego z "casa" robi się "casas", a z "libro" robi się "libros". Jeśli rzeczownik kończy się na spółgłoskę, dodajemy końcówkę -es. Na przykład z "profesor" powstaje "profesores", a z "flor" powstaje "flores". Jest jeszcze ważna reguła ortograficzna: gdy słowo kończy się na literę -z, w liczbie mnogiej zmienia się ona na -c, i dodajemy -es. Dlatego z "lápiz" (ołówek) robi się "lápices", a nie "lápizs". Pamiętaj, że rodzajnik również przechodzi do liczby mnogiej: "el" zmienia się w "los", a "la" zmienia się w "las". Powiemy więc "los gatos" oraz "las casas". Cały opis też musi być spójny, na przykład "Las ciudades son bonitas" (Miasta są ładne). Zauważ, że przymiotnik "bonitas" także dostał końcówkę liczby mnogiej. Na poziomie A1 wystarczy, że zapamiętasz trzy przypadki: samogłoska plus -s, spółgłoska plus -es oraz zamiana -z na -ces. Ćwicz zamianę pojedynczych słów na liczbę mnogą, a szybko wejdzie Ci to w nawyk.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000a4', 'gap_fill', 'Uzupełnij liczbą mnogą: «el gato» → los ___', NULL, 'gatos', 0),
('e0000000-0000-4000-8000-0000000000a4', 'gap_fill', 'Uzupełnij liczbą mnogą: «la flor» → las ___', NULL, 'flores', 1),
('e0000000-0000-4000-8000-0000000000a4', 'multiple_choice', 'Wybierz liczbę mnogą od «lápiz»:', '["lápizs","lápices","lápizes"]'::jsonb, 'lápices', 2),
('e0000000-0000-4000-8000-0000000000a4', 'multiple_choice', 'Wybierz liczbę mnogą od «casa»:', '["casas","cases","casaes"]'::jsonb, 'casas', 3),
('e0000000-0000-4000-8000-0000000000a4', 'transformation', 'Napisz w liczbie mnogiej: «La ciudad es bonita.» → ___', NULL, 'Las ciudades son bonitas.', 4),
('e0000000-0000-4000-8000-0000000000a4', 'gap_fill', 'Uzupełnij liczbą mnogą: «el profesor» → los ___', NULL, 'profesores', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Czas teraźniejszy (regularne -ar/-er/-ir)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'e0000000-0000-4000-8000-0000000000a5',
  'es',
  'A1',
  'es-presente-regular',
  'Czas teraźniejszy (regularne -ar/-er/-ir)',
  'W hiszpańskim czasowniki dzielą się na trzy grupy według końcówki bezokolicznika: -ar, -er oraz -ir. Aby odmienić czasownik regularny w czasie teraźniejszym, odcinamy tę końcówkę i dodajemy nowe końcówki osobowe. Dla czasowników na -ar, takich jak "hablar" (mówić), formy to: hablo, hablas, habla, hablamos, habláis, hablan. Dlatego powiemy "Yo hablo español" (Mówię po hiszpańsku). Dla czasowników na -er, takich jak "comer" (jeść), formy to: como, comes, come, comemos, coméis, comen. Powiemy więc "Nosotros comemos pizza" (Jemy pizzę). Dla czasowników na -ir, takich jak "vivir" (mieszkać), formy to: vivo, vives, vive, vivimos, vivís, viven. Na przykład "Ellos viven en Madrid" (Oni mieszkają w Madrycie). Zauważ, że grupy -er oraz -ir mają prawie takie same końcówki i różnią się tylko w formach dla nosotros i vosotros. Podobnie jak wcześniej, zaimek osobowy zwykle pomijamy, bo końcówka jasno wskazuje osobę. Dzięki tym trzem wzorom możesz odmienić bardzo wiele czasowników. Na poziomie A1 najlepiej nauczyć się na pamięć jednego przykładu z każdej grupy, a potem stosować ten sam schemat do innych czasowników.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('e0000000-0000-4000-8000-0000000000a5', 'gap_fill', 'Uzupełnij (hablar): Yo ___ español.', NULL, 'hablo', 0),
('e0000000-0000-4000-8000-0000000000a5', 'gap_fill', 'Uzupełnij (comer): Nosotros ___ pizza.', NULL, 'comemos', 1),
('e0000000-0000-4000-8000-0000000000a5', 'multiple_choice', 'Wybierz poprawną formę (vivir): Ellos ___ en Madrid.', '["vive","vivís","viven"]'::jsonb, 'viven', 2),
('e0000000-0000-4000-8000-0000000000a5', 'multiple_choice', 'Wybierz poprawną formę (beber): Tú ___ mucho café.', '["bebes","bebe","bebéis"]'::jsonb, 'bebes', 3),
('e0000000-0000-4000-8000-0000000000a5', 'transformation', 'Odmień w 1. osobie liczby pojedynczej: «trabajar» → Yo ___', NULL, 'trabajo', 4),
('e0000000-0000-4000-8000-0000000000a5', 'gap_fill', 'Uzupełnij (escribir): Vosotros ___ una carta.', NULL, 'escribís', 5);
