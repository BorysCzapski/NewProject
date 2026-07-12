// ============================================================================
// lib/grammar/content/es-a1.ts
// Authored interactive lessons for Spanish A1 grammar topics, keyed by topic
// slug (must match grammar_topics.slug in supabase/seed/es_02_grammar_a1.sql).
// Project convention: the `en` field holds the TARGET language (here Spanish),
// and `pl` holds the Polish translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const ES_A1_LESSONS: Record<string, GrammarLesson> = {
  "es-articulos-genero": [
    {
      type: "intro",
      text:
        'W hiszpańskim każdy rzeczownik ma rodzaj: męski albo żeński. Przed rzeczownikiem stawiamy rodzajnik określony, który musi się z tym rodzajem zgadzać: "el" dla rodzaju męskiego, "la" dla żeńskiego. Rodzaju najlepiej uczyć się razem z rodzajnikiem — zapamiętuj od razu "la mesa", a nie samo "mesa".',
    },
    {
      type: "table",
      title: "Jak rozpoznać rodzaj?",
      headers: ["Końcówka", "Rodzaj", "Rodzajnik", "Przykład"],
      rows: [
        ["-o", "zwykle męski", "el", "el libro, el niño"],
        ["-a", "zwykle żeński", "la", "la casa, la niña"],
        ["-ción, -dad", "żeński", "la", "la canción, la ciudad"],
        ["inne (-e, spółgłoska)", "trzeba sprawdzić", "el / la", "el coche, la flor"],
      ],
      caption:
        "Reguła -o/-a działa bardzo często, ale nie zawsze — wyjątki trzeba znać na pamięć.",
    },
    {
      type: "table",
      title: "Najważniejsze wyjątki",
      headers: ["Słowo", "Rodzaj", "Znaczenie"],
      rows: [
        ["el problema", "męski (mimo -a!)", "problem"],
        ["el día", "męski (mimo -a!)", "dzień"],
        ["el mapa", "męski (mimo -a!)", "mapa"],
        ["la mano", "żeński (mimo -o!)", "ręka"],
        ["la foto", "żeński (skrót od la fotografía)", "zdjęcie"],
      ],
      caption: "Tych słów nie da się wydedukować z końcówki — zapamiętaj je z rodzajnikiem.",
    },
    {
      type: "examples",
      items: [
        {
          en: "El coche es rápido.",
          pl: "Samochód jest szybki.",
          highlight: "El coche",
        },
        {
          en: "La mesa es grande.",
          pl: "Stół jest duży.",
          highlight: "La mesa",
        },
        {
          en: "El día es bonito.",
          pl: "Dzień jest ładny.",
          highlight: "El día",
        },
        {
          en: "La mano es pequeña.",
          pl: "Ręka jest mała.",
          highlight: "La mano",
        },
        {
          en: "El problema es serio.",
          pl: "Problem jest poważny.",
          highlight: "El problema",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Rodzaj hiszpański nie musi zgadzać się z polskim! "Książka" jest po polsku żeńska, ale po hiszpańsku męska — el libro; "stół" jest męski, a "la mesa" żeńska. Nigdy nie przenoś rodzaju z polskiego — ucz się każdego słowa razem z jego rodzajnikiem.',
    },
    {
      type: "quiz",
      question: 'Jaki rodzajnik pasuje do słowa "mano"?',
      options: ["el", "la", "los"],
      correctIndex: 1,
      explanation:
        '"Mano" to wyjątek: kończy się na -o, ale jest rodzaju żeńskiego — la mano.',
    },
    {
      type: "quiz",
      question: "___ problema es serio.",
      options: ["El", "La", "Las"],
      correctIndex: 0,
      explanation:
        '"Problema" mimo końcówki -a jest rodzaju męskiego: el problema. Podobnie el día i el mapa.',
    },
  ],
  "es-ser": [
    {
      type: "intro",
      text:
        'Czasownik "ser" znaczy "być" i jest jednym z najważniejszych czasowników w hiszpańskim. Jest nieregularny, więc jego formy trzeba po prostu zapamiętać. Używamy go do cech stałych: tożsamości, zawodu, pochodzenia, narodowości oraz trwałych cech charakteru i wyglądu.',
    },
    {
      type: "table",
      title: "Odmiana ser w czasie teraźniejszym",
      headers: ["Osoba", "Forma", "Przykład"],
      rows: [
        ["yo", "soy", "Soy estudiante."],
        ["tú", "eres", "Eres muy alto."],
        ["él / ella / usted", "es", "Ella es profesora."],
        ["nosotros / nosotras", "somos", "Somos de Polonia."],
        ["vosotros / vosotras", "sois", "Sois muy amables."],
        ["ellos / ellas / ustedes", "son", "Son médicos."],
      ],
      caption:
        "Zaimek osobowy zwykle pomijamy — końcówka czasownika sama mówi, o kim mowa.",
    },
    {
      type: "formula",
      title: "Budowa zdania z ser",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            {
              text: "Yo",
              role: "subject",
              note: 'zaimek często pomijamy: samo "Soy estudiante" wystarczy',
            },
            { text: "soy", role: "verb", note: "forma ser dopasowana do osoby" },
            { text: "estudiante", role: "object" },
          ],
          example: { en: "Yo soy estudiante.", pl: "Jestem studentem." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Ella", role: "subject" },
            {
              text: "no",
              role: "negation",
              note: '"no" stawiamy bezpośrednio PRZED czasownikiem',
            },
            { text: "es", role: "verb" },
            { text: "profesora", role: "object" },
          ],
          example: { en: "Ella no es profesora.", pl: "Ona nie jest nauczycielką." },
        },
        {
          label: "Pytanie",
          parts: [
            {
              text: "¿De dónde",
              role: "qword",
              note: "pytanie otwiera odwrócony znak ¿",
            },
            { text: "eres", role: "verb" },
            {
              text: "tú?",
              role: "subject",
              note: "zaimek można pominąć: ¿De dónde eres?",
            },
          ],
          example: { en: "¿De dónde eres?", pl: "Skąd jesteś?" },
        },
      ],
      caption:
        "Pytania tworzymy bez żadnego czasownika posiłkowego — wystarczą znaki ¿...? i intonacja.",
    },
    {
      type: "examples",
      items: [
        { en: "Soy de Polonia.", pl: "Jestem z Polski.", highlight: "Soy" },
        { en: "Ella es profesora.", pl: "Ona jest nauczycielką.", highlight: "es" },
        {
          en: "Nosotros somos altos.",
          pl: "Jesteśmy wysocy.",
          highlight: "somos",
        },
        {
          en: "¿Eres estudiante?",
          pl: "Jesteś studentem/studentką?",
          highlight: "Eres",
        },
        {
          en: "Mis padres son de Madrid.",
          pl: "Moi rodzice są z Madrytu.",
          highlight: "son",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        '"Ser" to nie jedyne hiszpańskie "być" — o położeniu i stanach chwilowych mówimy czasownikiem "estar". "Jestem zmęczony" to "Estoy cansado", nigdy "Soy cansado". Zasada na A1: ser = to, kim lub czym ktoś jest na stałe.',
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę: Ella ___ profesora.",
      options: ["soy", "eres", "es"],
      correctIndex: 2,
      explanation:
        'Dla él/ella/usted używamy formy "es": Ella es profesora.',
    },
    {
      type: "quiz",
      question: "¿De dónde ___ (tú)?",
      options: ["es", "eres", "soy"],
      correctIndex: 1,
      explanation:
        'Dla "tú" forma czasownika ser to "eres": ¿De dónde eres? — Skąd jesteś?',
    },
  ],
  "es-estar": [
    {
      type: "intro",
      text:
        'Czasownik "estar" to drugie hiszpańskie "być" — również nieregularny. Używamy go przede wszystkim, gdy mówimy o położeniu (gdzie ktoś lub coś się znajduje) oraz o stanach chwilowych: nastroju, samopoczuciu, zmęczeniu — o wszystkim, co może się zmienić.',
    },
    {
      type: "table",
      title: "Odmiana estar w czasie teraźniejszym",
      headers: ["Osoba", "Forma", "Przykład"],
      rows: [
        ["yo", "estoy", "Estoy en casa."],
        ["tú", "estás", "¿Cómo estás?"],
        ["él / ella / usted", "está", "Madrid está en España."],
        ["nosotros / nosotras", "estamos", "Estamos contentos."],
        ["vosotros / vosotras", "estáis", "¿Dónde estáis?"],
        ["ellos / ellas / ustedes", "están", "Los libros están en la mesa."],
      ],
      caption:
        "Cztery z sześciu form mają akcent graficzny: estás, está, estáis, están — trzeba go pisać!",
    },
    {
      type: "formula",
      title: "Budowa zdania z estar",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            {
              text: "Yo",
              role: "subject",
              note: 'zaimek zwykle pomijamy: "Estoy en casa"',
            },
            { text: "estoy", role: "verb" },
            {
              text: "en casa",
              role: "object",
              note: "położenie — najczęstsze użycie estar",
            },
          ],
          example: { en: "Yo estoy en casa.", pl: "Jestem w domu." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Nosotros", role: "subject" },
            { text: "no", role: "negation", note: '"no" bezpośrednio przed czasownikiem' },
            { text: "estamos", role: "verb" },
            { text: "cansados", role: "object" },
          ],
          example: { en: "No estamos cansados.", pl: "Nie jesteśmy zmęczeni." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "¿Cómo", role: "qword" },
            {
              text: "estás",
              role: "verb",
              note: "pamiętaj o akcencie: estás, nie estas",
            },
            { text: "tú?", role: "subject", note: "zaimek zwykle pomijamy" },
          ],
          example: { en: "¿Cómo estás?", pl: "Jak się masz?" },
        },
      ],
    },
    {
      type: "compare",
      title: "ser czy estar?",
      columns: [
        {
          title: "ser",
          formula: "cechy stałe",
          whenToUse:
            "Tożsamość, zawód, pochodzenie, trwałe cechy — to, kim lub czym ktoś jest.",
          examples: ["Soy de Polonia.", "Ella es profesora.", "Somos altos."],
        },
        {
          title: "estar",
          formula: "położenie + stany chwilowe",
          whenToUse:
            "Gdzie ktoś lub coś się znajduje oraz jak się ktoś czuje w danej chwili — to, co może się zmienić.",
          examples: ["Estoy en casa.", "Madrid está en España.", "Estamos cansados."],
        },
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "Madrid está en España.",
          pl: "Madryt leży w Hiszpanii.",
          highlight: "está",
        },
        { en: "Estoy cansado.", pl: "Jestem zmęczony.", highlight: "Estoy" },
        {
          en: "Los libros están en la mesa.",
          pl: "Książki są na stole.",
          highlight: "están",
        },
        {
          en: "¿Cómo estás?",
          pl: "Jak się masz? / Jak się czujesz?",
          highlight: "estás",
        },
        {
          en: "Estamos muy contentos.",
          pl: "Jesteśmy bardzo zadowoleni.",
          highlight: "Estamos",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie gub akcentów: "está" (jest) to zupełnie inne słowo niż "esta" (ta). Polacy często piszą "estas" i "esta" bez akcentu — po hiszpańsku to błąd, który zmienia znaczenie. Ucz się form estar od razu z akcentem: estás, está, estáis, están.',
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę: Madrid ___ en España.",
      options: ["es", "está", "estás"],
      correctIndex: 1,
      explanation:
        'Mówimy o położeniu, więc potrzebny jest estar. Dla él/ella (Madrid = "on") forma to "está": Madrid está en España.',
    },
  ],
  "es-plural": [
    {
      type: "intro",
      text:
        "Liczbę mnogą rzeczowników w hiszpańskim tworzymy według trzech prostych reguł, zależnych od tego, na co kończy się słowo. Do liczby mnogiej przechodzi też rodzajnik: el zmienia się w los, a la w las.",
    },
    {
      type: "table",
      title: "Trzy reguły liczby mnogiej",
      headers: ["Rzeczownik kończy się na", "Zmiana", "Przykład"],
      rows: [
        ["samogłoskę", "+ s", "casa → casas, libro → libros"],
        ["spółgłoskę", "+ es", "profesor → profesores, flor → flores"],
        ["-z", "z → c, + es", "lápiz → lápices, vez → veces"],
      ],
      caption:
        "Zamiana -z na -ces to reguła ortograficzna — formy typu lápizs nie istnieją.",
    },
    {
      type: "table",
      title: "Rodzajniki w liczbie mnogiej",
      headers: ["Liczba pojedyncza", "Liczba mnoga", "Przykład"],
      rows: [
        ["el", "los", "el gato → los gatos"],
        ["la", "las", "la casa → las casas"],
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "Los gatos están en el jardín.",
          pl: "Koty są w ogrodzie.",
          highlight: "Los gatos",
        },
        {
          en: "Las flores son bonitas.",
          pl: "Kwiaty są ładne.",
          highlight: "Las flores",
        },
        {
          en: "Necesito dos lápices.",
          pl: "Potrzebuję dwóch ołówków.",
          highlight: "lápices",
        },
        {
          en: "Las ciudades son grandes.",
          pl: "Miasta są duże.",
          highlight: "Las ciudades",
        },
        {
          en: "Los profesores son simpáticos.",
          pl: "Nauczyciele są sympatyczni.",
          highlight: "profesores",
        },
      ],
    },
    {
      type: "tip",
      variant: "tip",
      text:
        'Liczba mnoga "rozlewa się" na całe zdanie: rodzajnik, rzeczownik, czasownik i przymiotnik muszą się zgadzać. "La ciudad es bonita" → "Las ciudades son bonitas" — zmieniły się aż cztery słowa, nie tylko rzeczownik.',
    },
    {
      type: "quiz",
      question: 'Wybierz liczbę mnogą od "lápiz":',
      options: ["lápizs", "lápices", "lápizes"],
      correctIndex: 1,
      explanation:
        "W słowach zakończonych na -z litera z zmienia się w c i dodajemy -es: lápiz → lápices.",
    },
    {
      type: "quiz",
      question: '"la flor" w liczbie mnogiej to...',
      options: ["la flores", "las flors", "las flores"],
      correctIndex: 2,
      explanation:
        '"Flor" kończy się na spółgłoskę, więc dodajemy -es, a rodzajnik "la" zmienia się w "las": las flores.',
    },
  ],
  "es-presente-regular": [
    {
      type: "intro",
      text:
        "Hiszpańskie czasowniki dzielą się na trzy grupy według końcówki bezokolicznika: -ar, -er oraz -ir. Czasownik regularny odmieniamy tak: odcinamy końcówkę bezokolicznika i dodajemy końcówki osobowe. Czasu teraźniejszego używamy, mówiąc o faktach, nawykach i o tym, co dzieje się teraz.",
    },
    {
      type: "timeline",
      title: "Kiedy używamy czasu teraźniejszego?",
      markers: [
        {
          at: 0,
          to: 100,
          label: "Fakt / stała sytuacja",
          example: { en: "Vivo en Varsovia.", pl: "Mieszkam w Warszawie." },
        },
        { at: 20, label: "nawyk" },
        {
          at: 50,
          label: "nawyk / teraz",
          example: {
            en: "Hablo español todos los días.",
            pl: "Mówię po hiszpańsku codziennie.",
          },
        },
        { at: 80, label: "nawyk" },
      ],
      caption:
        "Jeden hiszpański czas teraźniejszy wystarcza i do nawyków, i do tego, co dzieje się w tej chwili.",
    },
    {
      type: "table",
      title: "Wzory odmiany: hablar, comer, vivir",
      headers: ["Osoba", "hablar (-ar)", "comer (-er)", "vivir (-ir)"],
      rows: [
        ["yo", "hablo", "como", "vivo"],
        ["tú", "hablas", "comes", "vives"],
        ["él / ella / usted", "habla", "come", "vive"],
        ["nosotros/-as", "hablamos", "comemos", "vivimos"],
        ["vosotros/-as", "habláis", "coméis", "vivís"],
        ["ellos / ellas / ustedes", "hablan", "comen", "viven"],
      ],
      caption:
        "Grupy -er i -ir różnią się tylko w formach nosotros i vosotros — reszta jest identyczna.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            {
              text: "Yo",
              role: "subject",
              note: 'zaimek zwykle pomijamy: "Hablo español"',
            },
            {
              text: "hablo",
              role: "verb",
              note: "habl- + o: końcówka sama wskazuje osobę",
            },
            { text: "español", role: "object" },
          ],
          example: { en: "Yo hablo español.", pl: "Mówię po hiszpańsku." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Nosotros", role: "subject" },
            {
              text: "no",
              role: "negation",
              note: '"no" zawsze bezpośrednio przed czasownikiem',
            },
            { text: "comemos", role: "verb" },
            { text: "carne", role: "object" },
          ],
          example: { en: "No comemos carne.", pl: "Nie jemy mięsa." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "¿Dónde", role: "qword", note: "pytanie otwiera znak ¿" },
            { text: "vives", role: "verb" },
            { text: "tú?", role: "subject", note: "zaimek zwykle pomijamy" },
          ],
          example: { en: "¿Dónde vives?", pl: "Gdzie mieszkasz?" },
        },
      ],
      caption:
        'Pytania i przeczenia tworzymy bez czasownika posiłkowego — hiszpański nie ma odpowiednika angielskiego "do/does".',
    },
    {
      type: "examples",
      items: [
        {
          en: "Hablo español y polaco.",
          pl: "Mówię po hiszpańsku i po polsku.",
          highlight: "Hablo",
        },
        {
          en: "Nosotros comemos pizza los viernes.",
          pl: "W piątki jemy pizzę.",
          highlight: "comemos",
        },
        {
          en: "Ellos viven en Madrid.",
          pl: "Oni mieszkają w Madrycie.",
          highlight: "viven",
        },
        {
          en: "¿Bebes café por la mañana?",
          pl: "Pijesz rano kawę?",
          highlight: "Bebes",
        },
        {
          en: "Vosotros escribís una carta.",
          pl: "Wy piszecie list.",
          highlight: "escribís",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Uważaj na formy vosotros: habláis, coméis, vivís — wszystkie mają akcent graficzny. I nie dodawaj zaimka do każdego zdania: ciągłe "yo hablo, yo como" brzmi nienaturalnie, bo końcówka czasownika już mówi, kto wykonuje czynność.',
    },
    {
      type: "quiz",
      question: "Wybierz poprawną formę (vivir): Ellos ___ en Madrid.",
      options: ["vive", "vivís", "viven"],
      correctIndex: 2,
      explanation:
        "Dla ellos/ellas czasowniki grupy -ir dostają końcówkę -en: Ellos viven en Madrid.",
    },
  ],
};
