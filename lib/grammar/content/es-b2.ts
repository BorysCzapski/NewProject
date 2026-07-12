// ============================================================================
// lib/grammar/content/es-b2.ts
// Authored interactive lessons for Spanish B2 grammar topics (taught in
// Polish), keyed by topic slug (must match grammar_topics.slug in
// supabase/seed/es_02_grammar_b2.sql). Convention: the `en` field carries the
// target-language (Spanish) text, `pl` carries the Polish translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const ES_B2_LESSONS: Record<string, GrammarLesson> = {
  "es-subjuntivo-imperfecto": [
    {
      type: "intro",
      text:
        "Imperfecto de subjuntivo to przeszły czas trybu łączącego — klucz do gdybania (Si tuviera...), relacjonowania próśb z przeszłości (Me pidió que fuera...) i bardzo uprzejmych zdań typu quisiera. Dobra wiadomość: tworzy się go jedną prostą regułą, która działa nawet dla najbardziej nieregularnych czasowników.",
    },
    {
      type: "table",
      title: "Jedna reguła: 3. os. l.mn. indefinido minus -ron",
      headers: ["Bezokolicznik", "ellos... (indefinido)", "Forma -ra", "Forma -se"],
      rows: [
        ["hablar", "hablaron", "hablara", "hablase"],
        ["tener", "tuvieron", "tuviera", "tuviese"],
        ["ser / ir", "fueron", "fuera", "fuese"],
        ["poder", "pudieron", "pudiera", "pudiese"],
        ["querer", "quisieron", "quisiera", "quisiese"],
      ],
      caption:
        "Końcówki: -ra, -ras, -ra, -ramos, -rais, -ran (albo -se, -ses, -se, -semos, -seis, -sen). Obie serie znaczą to samo: -ra jest częstsza w mowie, -se brzmi bardziej formalnie i literacko. W formie nosotros zawsze akcent graficzny: habláramos, tuviéramos, fuéramos.",
    },
    {
      type: "formula",
      title: "Gdzie spotkasz imperfecto de subjuntivo",
      variants: [
        {
          label: "Hipoteza z si",
          parts: [
            {
              text: "Si",
              role: "other",
              note: "si + imperfecto de subjuntivo = warunek nierealny",
            },
            { text: "yo", role: "subject" },
            {
              text: "tuviera",
              role: "verb",
              note: "tener: tuvieron → tuviera",
            },
            { text: "más tiempo,", role: "object" },
            {
              text: "aprendería",
              role: "verb",
              note: "condicional simple — skutek hipotezy",
            },
            { text: "italiano", role: "object" },
          ],
          example: {
            en: "Si yo tuviera más tiempo, aprendería italiano.",
            pl: "Gdybym miał więcej czasu, uczyłbym się włoskiego.",
          },
        },
        {
          label: "Wola i prośba w przeszłości",
          parts: [
            { text: "El profesor", role: "subject" },
            { text: "me", role: "object", note: "zaimek dopełnienia stoi przed czasownikiem" },
            {
              text: "pidió",
              role: "verb",
              note: "czasownik woli/prośby w czasie przeszłym → po que subjuntivo cofa się w przeszłość",
            },
            { text: "que", role: "other" },
            {
              text: "fuera",
              role: "verb",
              note: "ser: fueron → fuera (ta sama forma co od ir!)",
            },
            { text: "puntual", role: "object" },
          ],
          example: {
            en: "El profesor me pidió que fuera puntual.",
            pl: "Nauczyciel poprosił mnie, żebym był punktualny.",
          },
        },
        {
          label: "Ojalá + życzenie",
          parts: [
            {
              text: "Ojalá",
              role: "other",
              note: "ojalá + imperfecto de subjuntivo = życzenie mało realne",
            },
            {
              text: "pudiera",
              role: "verb",
              note: "poder: pudieron → pudiera",
            },
            { text: "ayudarte", role: "object" },
          ],
          example: {
            en: "Ojalá pudiera ayudarte.",
            pl: "Obym mógł ci pomóc. / Szkoda, że nie mogę ci pomóc.",
          },
        },
      ],
      caption:
        "Ta sama forma robi też karierę w grzecznych prośbach: Quisiera reservar una mesa (Chciałbym zarezerwować stolik).",
    },
    {
      type: "examples",
      title: "Imperfecto de subjuntivo w akcji",
      items: [
        {
          en: "Si tuviera más tiempo, aprendería italiano.",
          pl: "Gdybym miał więcej czasu, uczyłbym się włoskiego.",
          highlight: "tuviera",
        },
        {
          en: "Quería que vinieras a la fiesta.",
          pl: "Chciałem, żebyś przyszedł na imprezę.",
          highlight: "vinieras",
        },
        {
          en: "Ojalá pudiera ayudarte, pero hoy estoy muy ocupado.",
          pl: "Obym mógł ci pomóc, ale dziś jestem bardzo zajęty.",
          highlight: "pudiera",
        },
        {
          en: "Me pidió que fuera puntual.",
          pl: "Poprosił mnie, żebym był punktualny.",
          highlight: "fuera",
        },
        {
          en: "Quisiera reservar una mesa para dos personas.",
          pl: "Chciałbym zarezerwować stolik dla dwóch osób.",
          highlight: "Quisiera",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Typowy błąd Polaków: po que wstawiamy zwykły czas przeszły — Me pidió que *era* puntual. Po czasownikach woli i prośby w czasie przeszłym musi stać imperfecto de subjuntivo: Me pidió que fuera puntual. Pamiętaj też o obowiązkowym akcencie w formie nosotros (habláramos, nie *hablaramos) i o tym, że fuera to jednocześnie forma ser i ir — znaczenie podpowie kontekst.",
    },
    {
      type: "quiz",
      question: "Wybierz imperfecto de subjuntivo czasownika querer dla nosotros:",
      options: ["quisiéramos", "queríamos", "quisimos"],
      correctIndex: 0,
      explanation:
        "Od 3. os. l.mn. indefinido: quisieron → odcinamy -ron i dodajemy -ramos z akcentem: quisiéramos. Queríamos to imperfecto de indicativo, a quisimos — indefinido.",
    },
    {
      type: "quiz",
      question: "Quería que tú ___ (venir) a la fiesta.",
      options: ["vinieras", "vengas", "venías"],
      correctIndex: 0,
      explanation:
        "Czasownik woli (quería) stoi w czasie przeszłym, więc po que potrzebujemy imperfecto de subjuntivo: vinieron → vinieras. Vengas to presente de subjuntivo (pasowałoby po Quiero que...), a venías to zwykły czas przeszły oznajmujący.",
    },
  ],

  "es-condicionales": [
    {
      type: "intro",
      text:
        "Hiszpańskie zdania warunkowe dzielą się na trzy typy według stopnia prawdopodobieństwa: realny, hipotetyczny i nierealny (przeszły). Każde zdanie ma część z si (warunek) i część główną (skutek) — cały sekret to dobranie właściwej pary czasów do właściwego typu.",
    },
    {
      type: "compare",
      title: "Trzy typy okresów warunkowych",
      columns: [
        {
          title: "Typ 1 — realny",
          formula: "si + presente → presente / futuro / imperativo",
          whenToUse:
            "Sytuacje prawdopodobne albo zawsze prawdziwe — teraz lub w przyszłości.",
          examples: [
            "Si tienes tiempo, ven a verme.",
            "Si mañana llueve, no saldremos de casa.",
          ],
        },
        {
          title: "Typ 2 — hipotetyczny",
          formula: "si + imperfecto de subjuntivo → condicional simple",
          whenToUse:
            "Gdybanie o teraźniejszości lub przyszłości — mało prawdopodobne albo czysto teoretyczne.",
          examples: [
            "Si ganara la lotería, viajaría por todo el mundo.",
            "Si tuviera dinero, compraría una casa.",
          ],
        },
        {
          title: "Typ 3 — nierealny",
          formula: "si + pluscuamperfecto de subjuntivo → condicional compuesto",
          whenToUse:
            "Przeszłość, której już nie zmienimy — żale, wyrzuty i rozliczenia.",
          examples: [
            "Si hubiera salido antes, no habría perdido el tren.",
            "Si hubiera estudiado más, habría aprobado el examen.",
          ],
        },
      ],
    },
    {
      type: "formula",
      title: "Budowa krok po kroku",
      variants: [
        {
          label: "Typ 1 — realny",
          parts: [
            {
              text: "Si",
              role: "other",
              note: "po si nigdy nie stoi futuro ani presente de subjuntivo",
            },
            { text: "tienes", role: "verb", note: "presente de indicativo" },
            { text: "tiempo,", role: "object" },
            {
              text: "ven",
              role: "verb",
              note: "imperativo — w skutku może też stać presente lub futuro",
            },
            { text: "a verme", role: "object" },
          ],
          example: {
            en: "Si tienes tiempo, ven a verme.",
            pl: "Jeśli masz czas, przyjdź do mnie.",
          },
        },
        {
          label: "Typ 2 — hipotetyczny",
          parts: [
            { text: "Si", role: "other" },
            {
              text: "ganara",
              role: "verb",
              note: "imperfecto de subjuntivo: ganaron → ganara",
            },
            { text: "la lotería,", role: "object" },
            {
              text: "viajaría",
              role: "verb",
              note: "condicional simple — skutek hipotezy",
            },
            { text: "por todo el mundo", role: "object" },
          ],
          example: {
            en: "Si ganara la lotería, viajaría por todo el mundo.",
            pl: "Gdybym wygrał na loterii, podróżowałbym po całym świecie.",
          },
        },
        {
          label: "Typ 3 — nierealny",
          parts: [
            { text: "Si", role: "other" },
            {
              text: "hubiera salido",
              role: "verb",
              note: "pluscuamperfecto de subjuntivo: hubiera + participio",
            },
            { text: "antes,", role: "other" },
            { text: "no", role: "negation" },
            {
              text: "habría perdido",
              role: "verb",
              note: "condicional compuesto: habría + participio",
            },
            { text: "el tren", role: "object" },
          ],
          example: {
            en: "Si hubiera salido antes, no habría perdido el tren.",
            pl: "Gdybym wyszedł wcześniej, nie spóźniłbym się na pociąg.",
          },
        },
      ],
      caption:
        "Kolejność części jest dowolna: gdy zaczynasz od si, oddziel części przecinkiem; gdy skutek idzie pierwszy, przecinka nie ma (Ven a verme si tienes tiempo).",
    },
    {
      type: "examples",
      title: "Warunki w praktyce",
      items: [
        {
          en: "Si mañana llueve, no saldremos de casa.",
          pl: "Jeśli jutro będzie padać, nie wyjdziemy z domu.",
          highlight: "llueve",
        },
        {
          en: "¿Qué harías si ganaras la lotería?",
          pl: "Co byś zrobił, gdybyś wygrał na loterii?",
          highlight: "ganaras",
        },
        {
          en: "Si tuviera dinero, compraría una casa.",
          pl: "Gdybym miał pieniądze, kupiłbym dom.",
          highlight: "compraría",
        },
        {
          en: "Si hubiera estudiado más, habría aprobado el examen.",
          pl: "Gdybym się więcej uczył, zdałbym egzamin.",
          highlight: "habría aprobado",
        },
        {
          en: "Si hubieras venido a la fiesta, habrías conocido a Marta.",
          pl: "Gdybyś przyszedł na imprezę, poznałbyś Martę.",
          highlight: "hubieras venido",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Najczęstszy błąd Polaków to kalka z polskiego „gdybym miałbym”: po si NIGDY nie stawiamy condicionalu ani presente de subjuntivo — Si *tendría* dinero jest błędne, poprawnie: Si tuviera dinero. W mowie potocznej usłyszysz za to Si hubiera salido antes, no hubiera perdido el tren — hubiera zamiast habría w części głównej jest dopuszczalne, ale w tekstach formalnych trzymaj się condicional compuesto.",
    },
    {
      type: "quiz",
      question: "Si yo ___ (ganar) la lotería, viajaría por todo el mundo.",
      options: ["ganara", "gano", "ganaría"],
      correctIndex: 0,
      explanation:
        "Skutek stoi w condicional simple (viajaría), więc to typ 2 — po si potrzebne jest imperfecto de subjuntivo: ganara. Gano pasowałoby do typu 1 (z presente lub futuro w skutku), a ganaría po si nie występuje nigdy.",
    },
    {
      type: "quiz",
      question: "Si ___ tiempo, ven a verme.",
      options: ["tienes", "tuvieras", "tendrías"],
      correctIndex: 0,
      explanation:
        "Skutek to tryb rozkazujący (ven), czyli warunek realny — typ 1: si + presente de indicativo. Tuvieras wymagałoby condicionalu w skutku (Si tuvieras tiempo, vendrías...), a tendrías po si jest zawsze błędne.",
    },
  ],

  "es-estilo-indirecto": [
    {
      type: "intro",
      text:
        "Estilo indirecto pozwala relacjonować cudze słowa bez cytowania: zamiast «Estoy cansado» mówimy Dijo que estaba cansado. Gdy czasownik wprowadzający (dijo, preguntó, explicó) stoi w czasie przeszłym, uruchamia się łańcuszek zmian: przesuwają się czasy, zaimki oraz określenia czasu i miejsca.",
    },
    {
      type: "table",
      title: "Przesunięcie czasów po dijo que...",
      headers: ["Styl bezpośredni", "Styl zależny", "Przykład"],
      rows: [
        [
          "presente",
          "pretérito imperfecto",
          "«Estoy cansado» → Dijo que estaba cansado.",
        ],
        [
          "pretérito perfecto / indefinido",
          "pluscuamperfecto",
          "«He terminado» → Dijo que había terminado.",
        ],
        [
          "futuro simple",
          "condicional simple",
          "«Vendré» → Dijo que vendría.",
        ],
        [
          "imperativo",
          "imperfecto de subjuntivo",
          "«Ven aquí» → Me dijo que viniera allí.",
        ],
      ],
      caption:
        "Uwaga: gdy czasownik wprowadzający stoi w teraźniejszości, przesunięcie NIE następuje: Dice que está cansado.",
    },
    {
      type: "formula",
      title: "Trzy typy relacjonowanych wypowiedzi",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            {
              text: "Dijo",
              role: "verb",
              note: "czasownik wprowadzający w czasie przeszłym → cofamy czasy",
            },
            { text: "que", role: "other", note: "twierdzenia zawsze łączymy przez que" },
            {
              text: "estaba",
              role: "verb",
              note: "presente (estoy) → imperfecto (estaba)",
            },
            { text: "cansado", role: "object" },
          ],
          example: {
            en: "Dijo que estaba cansado.",
            pl: "Powiedział, że jest zmęczony.",
          },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "Me", role: "object" },
            { text: "preguntó", role: "verb" },
            {
              text: "si",
              role: "other",
              note: "pytanie ogólne (tak/nie) → si; szczegółowe → słowo pytające (dónde, qué...)",
            },
            {
              text: "tenía",
              role: "verb",
              note: "presente (tienes) → imperfecto (tenía)",
            },
            { text: "tiempo", role: "object" },
          ],
          example: {
            en: "Me preguntó si tenía tiempo.",
            pl: "Zapytał mnie, czy mam czas.",
          },
        },
        {
          label: "Polecenie",
          parts: [
            { text: "Me", role: "object" },
            { text: "dijo", role: "verb" },
            { text: "que", role: "other" },
            {
              text: "viniera",
              role: "verb",
              note: "imperativo (ven) → imperfecto de subjuntivo (viniera)",
            },
            { text: "allí", role: "other", note: "aquí → allí" },
          ],
          example: {
            en: "Me dijo que viniera allí.",
            pl: "Powiedział mi, żebym tam przyszedł.",
          },
        },
      ],
    },
    {
      type: "table",
      title: "Zmiany okoliczników czasu i miejsca",
      headers: ["Styl bezpośredni", "Styl zależny"],
      rows: [
        ["hoy", "aquel día"],
        ["ayer", "el día anterior"],
        ["mañana", "al día siguiente"],
        ["ahora", "entonces"],
        ["aquí", "allí"],
        ["este / esta", "aquel / aquella"],
      ],
    },
    {
      type: "examples",
      title: "Estilo indirecto w praktyce",
      items: [
        {
          en: "Dijo que había terminado el trabajo.",
          pl: "Powiedział, że skończył pracę.",
          highlight: "había terminado",
        },
        {
          en: "Dijo que vendría al día siguiente.",
          pl: "Powiedział, że przyjdzie następnego dnia.",
          highlight: "vendría",
        },
        {
          en: "Me preguntó dónde vivía.",
          pl: "Zapytał mnie, gdzie mieszkam.",
          highlight: "dónde vivía",
        },
        {
          en: "Dijo que quería viajar a México.",
          pl: "Powiedział, że chce pojechać do Meksyku.",
          highlight: "quería",
        },
        {
          en: "El médico me dijo que descansara más.",
          pl: "Lekarz powiedział mi, żebym więcej odpoczywał.",
          highlight: "descansara",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Polski nie przesuwa czasów — mówimy „Powiedział, że JEST zmęczony”, więc odruchowo tłumaczysz Dijo que *está* cansado. Po hiszpańsku po dijo czas MUSI się cofnąć: Dijo que estaba cansado. Pamiętaj też, że relacjonowane pytania tracą znaki ¿? i szyk pytania: Me preguntó si tenía tiempo (nie: *Me preguntó ¿tienes tiempo?).",
    },
    {
      type: "quiz",
      question: "«Vendré mañana». → Dijo que ___ al día siguiente.",
      options: ["vendría", "vendrá", "venía"],
      correctIndex: 0,
      explanation:
        "Futuro simple (vendré) przechodzi w condicional simple: vendría. Przy okazji mañana zmienia się w al día siguiente. Vendrá zostawiłoby relację bez przesunięcia, a venía to imperfecto — odpowiednik presente, nie futuro.",
    },
    {
      type: "quiz",
      question: "«Ven aquí». → Me dijo que ___ allí.",
      options: ["viniera", "venga", "vino"],
      correctIndex: 0,
      explanation:
        "Tryb rozkazujący relacjonujemy przez imperfecto de subjuntivo: ven → viniera. Venga (presente de subjuntivo) pasowałoby tylko po wprowadzeniu w teraźniejszości (Me dice que venga), a vino to zwykłe indefinido — „przyszedł”, nie „żebym przyszedł”.",
    },
  ],

  "es-voz-pasiva": [
    {
      type: "intro",
      text:
        "Strona bierna kieruje uwagę na obiekt czynności zamiast na wykonawcę. Hiszpański ma na to dwa główne narzędzia: formalną pasiva con ser (La casa fue construida...) i królującą w codziennej mowie pasiva refleja z se (Se venden pisos). Do tego dochodzi estar + participio, które opisuje stan — rezultat, a nie samą czynność.",
    },
    {
      type: "formula",
      title: "Trzy konstrukcje bierne",
      variants: [
        {
          label: "Pasiva con ser",
          parts: [
            {
              text: "La novela",
              role: "subject",
              note: "dawne dopełnienie zostaje podmiotem",
            },
            { text: "fue", role: "aux", note: "ser w odpowiednim czasie" },
            {
              text: "escrita",
              role: "verb",
              note: "participio uzgadnia się z podmiotem: escritA, bo la novela",
            },
            {
              text: "por García Márquez",
              role: "object",
              note: "wykonawcę (agente) wprowadza przyimek por",
            },
          ],
          example: {
            en: "La novela fue escrita por García Márquez.",
            pl: "Powieść została napisana przez Garcíę Márqueza.",
          },
        },
        {
          label: "Pasiva refleja",
          parts: [
            {
              text: "Se",
              role: "other",
              note: "se + 3. osoba — wykonawca nieznany lub nieistotny",
            },
            {
              text: "venden",
              role: "verb",
              note: "liczba zgodna z rzeczownikiem: se vende un piso, ale se venden pisos",
            },
            { text: "pisos", role: "subject" },
            { text: "en esta zona", role: "object" },
          ],
          example: {
            en: "Se venden pisos en esta zona.",
            pl: "W tej okolicy sprzedaje się mieszkania.",
          },
        },
        {
          label: "Stan: estar + participio",
          parts: [
            { text: "La puerta", role: "subject" },
            {
              text: "está",
              role: "aux",
              note: "estar = rezultat czynności, nie sama czynność",
            },
            {
              text: "cerrada",
              role: "verb",
              note: "participio uzgodnione: cerradA, bo la puerta",
            },
          ],
          example: {
            en: "La puerta está cerrada.",
            pl: "Drzwi są zamknięte (opis stanu).",
          },
        },
      ],
    },
    {
      type: "compare",
      title: "Pasiva con ser czy pasiva refleja?",
      columns: [
        {
          title: "Pasiva con ser",
          formula: "ser + participio (+ por + agente)",
          whenToUse:
            "Język pisany, prasa, teksty oficjalne. Jedyna opcja, gdy chcesz wskazać wykonawcę (por...).",
          examples: [
            "La casa fue construida en 1990.",
            "El Quijote fue escrito por Cervantes.",
          ],
        },
        {
          title: "Pasiva refleja",
          formula: "se + czasownik w 3. osobie",
          whenToUse:
            "Codzienna mowa — domyślny wybór, gdy wykonawca jest nieznany albo nieistotny.",
          examples: [
            "Aquí se habla español.",
            "Se venden pisos en esta zona.",
          ],
        },
      ],
    },
    {
      type: "table",
      title: "Najważniejsze participios nieregularne",
      headers: ["Bezokolicznik", "Participio", "Przykład"],
      rows: [
        ["escribir", "escrito", "El libro fue escrito en 1605."],
        ["hacer", "hecho", "El trabajo ya está hecho."],
        ["ver", "visto", "El ladrón fue visto por un vecino."],
        ["abrir", "abierto", "La puerta está abierta."],
        ["poner", "puesto", "La mesa ya está puesta."],
      ],
    },
    {
      type: "examples",
      title: "Strona bierna w praktyce",
      items: [
        {
          en: "La casa fue construida en 1990.",
          pl: "Dom został zbudowany w 1990 roku.",
          highlight: "fue construida",
        },
        {
          en: "El Quijote fue escrito por Cervantes.",
          pl: "Don Kichot został napisany przez Cervantesa.",
          highlight: "fue escrito por",
        },
        {
          en: "Aquí se habla español.",
          pl: "Tutaj mówi się po hiszpańsku.",
          highlight: "se habla",
        },
        {
          en: "Se venden pisos en esta zona.",
          pl: "W tej okolicy sprzedaje się mieszkania.",
          highlight: "Se venden",
        },
        {
          en: "La puerta está cerrada desde ayer.",
          pl: "Drzwi są zamknięte od wczoraj — stan, nie czynność.",
          highlight: "está cerrada",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Dwie pułapki uzgadniania: participio w pasiva con ser musi zgadzać się z podmiotem (la novela fue escritA, las cartas fueron escritAS), a czasownik w pasiva refleja z liczbą rzeczownika (se vende un piso, ale se venden pisos). I nie nadużywaj pasiva con ser — hiszpański woli stronę czynną lub pasiva refleja, więc zamiast *Es hablado español aquí powiedz po prostu Aquí se habla español.",
    },
    {
      type: "quiz",
      question: "Elige la pasiva refleja correcta: ___ español en este país.",
      options: ["Se habla", "Es hablado", "Se hablan"],
      correctIndex: 0,
      explanation:
        "Español to liczba pojedyncza, więc se habla. Se hablan wymagałoby liczby mnogiej (Se hablan tres idiomas), a es hablado brzmi sztucznie — w mowie zawsze wygrywa pasiva refleja.",
    },
    {
      type: "quiz",
      question: "La novela ___ por García Márquez.",
      options: ["fue escrita", "fue escrito", "se escribió"],
      correctIndex: 0,
      explanation:
        "Participio uzgadnia się z podmiotem: la novela → escritA. Fue escrito to błąd uzgodnienia, a pasiva refleja (se escribió) nie łączy się ze wskazaniem wykonawcy przez por — agente wymaga pasiva con ser.",
    },
  ],

  "es-por-para": [
    {
      type: "intro",
      text:
        "Por i para to zmora uczących się, bo oba tłumaczymy na polski jako „dla”, „za” albo „przez”. Sekret: nie tłumacz, tylko pytaj o znaczenie. Para patrzy w przód — na cel, odbiorcę, termin i kierunek. Por patrzy wstecz — na przyczynę, motyw i wymianę.",
    },
    {
      type: "compare",
      title: "por vs para — mapa znaczeń",
      columns: [
        {
          title: "para",
          formula: "cel • odbiorca • termin • kierunek • opinia",
          whenToUse:
            "Patrzy w przyszłość: po co? dla kogo (odbiorca)? na kiedy? dokąd?",
          examples: [
            "Estudio español para trabajar en España.",
            "Este regalo es para ti.",
            "Necesito el informe para el lunes.",
            "Mañana salgo para Madrid.",
            "Para mí, esto es muy fácil.",
          ],
        },
        {
          title: "por",
          formula: "przyczyna • wymiana / cena • ruch przez • przybliżony czas",
          whenToUse:
            "Patrzy wstecz, na źródło działania: dlaczego? w zamian za co? którędy? mniej więcej kiedy?",
          examples: [
            "Gracias por tu ayuda.",
            "Lo hago por ti.",
            "Pagué diez euros por el libro.",
            "Pasamos por el parque.",
            "Estudio por la mañana.",
          ],
        },
      ],
    },
    {
      type: "formula",
      title: "Cel czy przyczyna? Dwa zdania-wzorce",
      variants: [
        {
          label: "Cel → para",
          parts: [
            { text: "Estudio", role: "verb" },
            { text: "español", role: "object" },
            {
              text: "para",
              role: "other",
              note: "para + bezokolicznik = „żeby”, „w celu”",
            },
            { text: "trabajar", role: "verb" },
            { text: "en España", role: "object" },
          ],
          example: {
            en: "Estudio español para trabajar en España.",
            pl: "Uczę się hiszpańskiego, żeby pracować w Hiszpanii.",
          },
        },
        {
          label: "Przyczyna → por",
          parts: [
            { text: "Lo", role: "object", note: "zaimek dopełnienia" },
            { text: "hago", role: "verb" },
            {
              text: "por",
              role: "other",
              note: "por = motyw, „ze względu na”",
            },
            { text: "ti", role: "object" },
          ],
          example: {
            en: "Lo hago por ti.",
            pl: "Robię to dla ciebie (ze względu na ciebie).",
          },
        },
      ],
    },
    {
      type: "table",
      title: "Utarte zwroty — ucz się w całości",
      headers: ["Z por", "Z para"],
      rows: [
        ["por fin — wreszcie", "para siempre — na zawsze"],
        ["por supuesto — oczywiście", "para nada — wcale, w ogóle"],
        ["por ejemplo — na przykład", "para variar — dla odmiany"],
        ["por eso — dlatego", "para colmo — na domiar złego"],
      ],
      caption:
        "Gotowe zwroty najlepiej zapamiętywać w całości — wybór przyimka staje się wtedy automatyczny.",
    },
    {
      type: "examples",
      title: "por i para w praktyce",
      items: [
        {
          en: "Este regalo es para ti.",
          pl: "Ten prezent jest dla ciebie (ty jesteś odbiorcą).",
          highlight: "para ti",
        },
        {
          en: "Lo hago por ti.",
          pl: "Robię to dla ciebie (ty jesteś powodem).",
          highlight: "por ti",
        },
        {
          en: "Pagué diez euros por el libro.",
          pl: "Zapłaciłem dziesięć euro za książkę.",
          highlight: "por el libro",
        },
        {
          en: "Necesito el informe para el lunes.",
          pl: "Potrzebuję raportu na poniedziałek.",
          highlight: "para el lunes",
        },
        {
          en: "Pasamos por el parque.",
          pl: "Przeszliśmy przez park.",
          highlight: "por el parque",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Zestaw pułapek: Gracias łączy się ZAWSZE z por — Gracias *para* tu ayuda to częsty błąd. Porównaj też dwa „dla ciebie”: Este regalo es para ti (odbiorca) vs Lo hago por ti (motyw) — po polsku brzmią tak samo, po hiszpańsku znaczą co innego. I kierunek: salgo para Madrid = jadę DO Madrytu, paso por Madrid = jadę PRZEZ Madryt.",
    },
    {
      type: "quiz",
      question: "Gracias ___ tu ayuda.",
      options: ["por", "para", "de"],
      correctIndex: 0,
      explanation:
        "Podziękowanie wskazuje przyczynę, a przyczyna to por — gracias por to stały zwrot. Gracias para nie istnieje, a gracias de pojawia się tylko w zupełnie innych konstrukcjach (gracias de nuevo).",
    },
    {
      type: "quiz",
      question: "Mañana salgo ___ Madrid.",
      options: ["para", "por", "en"],
      correctIndex: 0,
      explanation:
        "Kierunek podróży (cel drogi) wyraża para: salgo para Madrid = wyjeżdżam do Madrytu. Salgo por Madrid znaczyłoby raczej „ruszam przez Madryt / po Madrycie”, a en nie łączy się z salir w tym znaczeniu.",
    },
  ],
};
