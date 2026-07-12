// ============================================================================
// lib/grammar/content/es-b1.ts
// Authored interactive lessons for Spanish B1 grammar topics, keyed by topic
// slug (must match grammar_topics.slug in supabase/seed/es_02_grammar_b1.sql).
// Teaching language: Polish. Project convention: the target language (Spanish)
// lives in the `en` field, the Polish translation in the `pl` field.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const ES_B1_LESSONS: Record<string, GrammarLesson> = {
  "es-imperfecto": [
    {
      type: "intro",
      text:
        "Pretérito imperfecto to czas przeszły „niedokonany”: opisuje czynności trwające, powtarzające się lub tworzące tło wydarzeń. Nie mówi, że coś się skończyło — maluje scenę: dawne zwyczaje, opisy miejsc, osób i pogody w przeszłości. Odmiana jest wyjątkowo prosta: tylko dwa wzory końcówek i zaledwie trzy czasowniki nieregularne.",
    },
    {
      type: "table",
      title: "Odmiana regularna",
      headers: ["Osoba", "hablar (-ar)", "comer (-er)", "vivir (-ir)"],
      rows: [
        ["yo", "hablaba", "comía", "vivía"],
        ["tú", "hablabas", "comías", "vivías"],
        ["él / ella / usted", "hablaba", "comía", "vivía"],
        ["nosotros/-as", "hablábamos", "comíamos", "vivíamos"],
        ["vosotros/-as", "hablabais", "comíais", "vivíais"],
        ["ellos / ellas / ustedes", "hablaban", "comían", "vivían"],
      ],
      caption:
        "Czasowniki -er i -ir mają identyczne końcówki. Formy yo oraz él/ella są takie same — znaczenie rozstrzyga kontekst.",
    },
    {
      type: "table",
      title: "Tylko trzy czasowniki nieregularne",
      headers: ["Czasownik", "Formy", "Przykład"],
      rows: [
        ["ser", "era, eras, era, éramos, erais, eran", "La casa era grande."],
        ["ir", "iba, ibas, iba, íbamos, ibais, iban", "Iba a la escuela a pie."],
        ["ver", "veía, veías, veía, veíamos, veíais, veían", "Veía la televisión cada noche."],
      ],
    },
    {
      type: "timeline",
      title: "Imperfecto na osi czasu",
      caption:
        "Imperfecto to rozciągnięte tło w przeszłości: zwyczaje i czynności w trakcie. Indefinido to punktowe wydarzenie, które w to tło „uderza”.",
      markers: [
        {
          at: 5,
          to: 30,
          label: "Dawny zwyczaj (powtarzalność)",
          example: {
            en: "Cuando era niño, jugaba al fútbol todos los días.",
            pl: "Kiedy byłem dzieckiem, codziennie grałem w piłkę.",
          },
        },
        {
          at: 15,
          to: 40,
          label: "Tło — czynność w trakcie",
          example: { en: "Mientras estudiaba...", pl: "Podczas gdy się uczyłem..." },
        },
        {
          at: 28,
          label: "Indefinido — punktowe zdarzenie",
          example: { en: "...sonó el teléfono.", pl: "...zadzwonił telefon." },
        },
      ],
    },
    {
      type: "compare",
      title: "Imperfecto vs indefinido",
      columns: [
        {
          title: "Pretérito imperfecto — tło i trwanie",
          formula: "temat + -aba / -ía",
          whenToUse:
            "Zwyczaje, powtarzalność, opisy miejsc, osób i pogody, czynność w trakcie — bez informacji o zakończeniu. Po polsku zwykle czasownik NIEdokonany.",
          examples: ["Antes vivíamos en Madrid.", "Hacía frío y llovía."],
        },
        {
          title: "Pretérito indefinido — zamknięte zdarzenie",
          formula: "np. hablé, comí, viví",
          whenToUse:
            "Pojedyncze, zakończone wydarzenie w konkretnym momencie przeszłości. Po polsku zwykle czasownik dokonany.",
          examples: ["Ayer hablé con ella.", "Mientras estudiaba, sonó el teléfono."],
        },
      ],
    },
    {
      type: "examples",
      items: [
        {
          en: "Cuando era niño, jugaba al fútbol todos los días.",
          pl: "Kiedy byłem dzieckiem, codziennie grałem w piłkę.",
          highlight: "jugaba",
        },
        {
          en: "La casa era grande y tenía un jardín precioso.",
          pl: "Dom był duży i miał przepiękny ogród.",
          highlight: "era",
        },
        {
          en: "Antes nosotros vivíamos en Madrid.",
          pl: "Dawniej mieszkaliśmy w Madrycie.",
          highlight: "vivíamos",
        },
        {
          en: "Mientras estudiaba, sonó el teléfono.",
          pl: "Kiedy się uczyłem, zadzwonił telefon.",
          highlight: "estudiaba",
        },
        {
          en: "Todos los días iba a la escuela a pie.",
          pl: "Codziennie chodziła do szkoły pieszo.",
          highlight: "iba",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Nie sugeruj się tym, że po polsku oba czasy oddajemy czasem przeszłym. Zadaj pytanie: tło/zwyczaj (imperfecto) czy zamknięte zdarzenie (indefinido)? Pojedynczy rozegrany mecz to „Ayer jugué al fútbol” ✓, nie „Ayer jugaba...” ✗. Pilnuj też akcentów: hablábamos, vivíamos — bez nich forma jest błędna.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Todos los días ella ___ a la escuela.",
      options: ["iba", "fue", "va"],
      correctIndex: 0,
      explanation:
        "„Todos los días” sygnalizuje powtarzający się zwyczaj w przeszłości, więc potrzebujemy imperfecto od ir: iba. Fue (indefinido) opisałoby pojedyncze, zamknięte wydarzenie, a va to czas teraźniejszy.",
    },
  ],

  "es-subjuntivo-presente": [
    {
      type: "intro",
      text:
        "Subjuntivo presente to tryb życzeń, emocji, wątpliwości i poleceń dotyczących innej osoby. Prawie zawsze pojawia się w zdaniu podrzędnym po que: Quiero que vengas (Chcę, żebyś przyszedł). Formę tworzymy z 1. osoby liczby pojedynczej czasu teraźniejszego: odrzucamy -o i dodajemy „przeciwne” końcówki — czasowniki na -ar dostają e, a na -er/-ir dostają a.",
    },
    {
      type: "formula",
      title: "Schemat: zdanie główne + que + subjuntivo",
      variants: [
        {
          label: "Życzenie (querer que)",
          parts: [
            { text: "Quiero", role: "verb", note: "czasownik życzenia — w zwykłym indicativo" },
            { text: "que", role: "other", note: "que wprowadza zdanie podrzędne z subjuntivo" },
            { text: "tú", role: "subject" },
            { text: "vengas", role: "verb", note: "subjuntivo od venir: vengo → venga → vengas" },
            { text: "a mi fiesta", role: "object" },
          ],
          example: { en: "Quiero que vengas a mi fiesta.", pl: "Chcę, żebyś przyszedł na moją imprezę." },
        },
        {
          label: "Nadzieja (esperar que)",
          parts: [
            { text: "Espero", role: "verb" },
            { text: "que", role: "other" },
            { text: "ustedes", role: "subject" },
            { text: "tengan", role: "verb", note: "tener: tengo → tenga → tengan" },
            { text: "un buen viaje", role: "object" },
          ],
          example: { en: "Espero que tengan un buen viaje.", pl: "Mam nadzieję, że będą państwo mieli dobrą podróż." },
        },
        {
          label: "Ojalá",
          parts: [
            { text: "Ojalá", role: "other", note: "„oby” — zawsze z subjuntivo, bez que" },
            { text: "llueva", role: "verb", note: "llover: llueve → llueva" },
            { text: "mañana", role: "object" },
          ],
          example: { en: "Ojalá llueva mañana.", pl: "Oby jutro padało." },
        },
      ],
    },
    {
      type: "table",
      title: "Jak utworzyć presente de subjuntivo",
      headers: ["Osoba", "hablar → hable", "comer → coma", "vivir → viva"],
      rows: [
        ["yo", "hable", "coma", "viva"],
        ["tú", "hables", "comas", "vivas"],
        ["él / ella / usted", "hable", "coma", "viva"],
        ["nosotros/-as", "hablemos", "comamos", "vivamos"],
        ["vosotros/-as", "habléis", "comáis", "viváis"],
        ["ellos / ellas / ustedes", "hablen", "coman", "vivan"],
      ],
      caption:
        "Punktem wyjścia jest 1. osoba l.poj. indicativo bez -o, dlatego nieregularność „przechodzi” na subjuntivo: hacer → hago → haga, decir → digo → diga, tener → tengo → tenga.",
    },
    {
      type: "table",
      title: "Typowe wyrażenia wywołujące subjuntivo",
      headers: ["Wyrażenie", "Znaczenie", "Przykład"],
      rows: [
        ["querer que", "chcieć, żeby", "Mi madre quiere que yo diga la verdad."],
        ["esperar que", "mieć nadzieję, że", "Espero que tengas un buen día."],
        ["ojalá", "oby", "Ojalá llueva mañana."],
        ["es importante que", "ważne jest, żeby", "Es importante que estudiemos todos los días."],
      ],
      caption:
        "Po wyrażeniach pewności — creo que, sé que — używamy indicativo: Creo que viene. Ale w przeczeniu wraca subjuntivo: No creo que venga.",
    },
    {
      type: "examples",
      items: [
        { en: "Quiero que vengas a mi fiesta.", pl: "Chcę, żebyś przyszedł na moją imprezę.", highlight: "vengas" },
        { en: "Espero que tengas un buen día.", pl: "Mam nadzieję, że będziesz mieć dobry dzień.", highlight: "tengas" },
        { en: "Ojalá llueva mañana.", pl: "Oby jutro padało.", highlight: "llueva" },
        { en: "Es importante que estudiemos todos los días.", pl: "Ważne, żebyśmy uczyli się codziennie.", highlight: "estudiemos" },
        { en: "Mi madre quiere que yo diga la verdad.", pl: "Moja mama chce, żebym mówił prawdę.", highlight: "diga" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Polska kalka „Chcę, żebyś przyszedł” → „Quiero que vienes” ✗ to najczęstszy błąd. Po querer que czasownik MUSI stać w subjuntivo: „Quiero que vengas” ✓. Uważaj też na kierunek końcówek: -ar → -e (hable), -er/-ir → -a (coma) — dokładnie odwrotnie niż w indicativo.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Espero que ustedes ___ un buen viaje.",
      options: ["tienen", "tengan", "tendrán"],
      correctIndex: 1,
      explanation:
        "Esperar que wyraża nadzieję, więc wymaga subjuntivo. Od tener: tengo → odrzucamy -o → tenga, w 3. os. l.mn. tengan. Tienen to indicativo, a tendrán to futuro.",
    },
    {
      type: "quiz",
      question: "Które zdanie jest poprawne?",
      options: [
        "Creo que Juan venga mañana.",
        "Creo que Juan viene mañana.",
        "Quiero que Juan viene mañana.",
      ],
      correctIndex: 1,
      explanation:
        "Creo que wyraża pewność, więc bierze indicativo: viene. Subjuntivo pojawiłoby się po przeczeniu (No creo que venga) albo po życzeniu (Quiero que Juan venga).",
    },
  ],

  "es-imperativo": [
    {
      type: "intro",
      text:
        "Imperativo to tryb rozkazujący: polecenia, prośby, rady i instrukcje. Jego forma zależy od dwóch rzeczy: do kogo mówisz (tú czy usted) i czy polecenie jest twierdzące, czy przeczące. Twierdzące tú jest proste — wygląda jak 3. osoba l.poj. czasu teraźniejszego (habla, come, escribe) — ale przeczenia i formy grzecznościowe zapożyczają formy z subjuntivo.",
    },
    {
      type: "formula",
      title: "Trzy podstawowe warianty",
      variants: [
        {
          label: "Twierdzenie (tú)",
          parts: [
            { text: "Habla", role: "verb", note: "= 3. os. l.poj. presente: él habla" },
            { text: "más despacio", role: "object" },
            { text: ", por favor", role: "other" },
          ],
          example: { en: "Habla más despacio, por favor.", pl: "Mów wolniej, proszę." },
        },
        {
          label: "Przeczenie (tú)",
          parts: [
            { text: "No", role: "negation", note: "przeczenie przełącza czasownik na subjuntivo" },
            { text: "comas", role: "verb", note: "subjuntivo: comer → coma → comas" },
            { text: "tan rápido", role: "object" },
          ],
          example: { en: "No comas tan rápido.", pl: "Nie jedz tak szybko." },
        },
        {
          label: "Grzecznościowo (usted)",
          parts: [
            { text: "Venga", role: "verb", note: "formy usted = subjuntivo, także na tak" },
            { text: "usted", role: "subject", note: "usted często stoi po czasowniku" },
            { text: "aquí", role: "object" },
            { text: ", por favor", role: "other" },
          ],
          example: { en: "Venga usted aquí, por favor.", pl: "Proszę tu przyjść." },
        },
      ],
    },
    {
      type: "table",
      title: "Nieregularne formy tú (twierdzące) — do zapamiętania",
      headers: ["Bezokolicznik", "Imperativo (tú)", "Przykład"],
      rows: [
        ["decir", "di", "Di la verdad."],
        ["hacer", "haz", "Haz la tarea."],
        ["ir", "ve", "Ve a casa."],
        ["poner", "pon", "Pon la mesa."],
        ["salir", "sal", "Sal de aquí."],
        ["ser", "sé", "Sé bueno."],
        ["tener", "ten", "Ten cuidado."],
        ["venir", "ven", "Ven aquí ahora mismo."],
      ],
      caption: "Tylko osiem form — warto wykuć jako rytmiczną listę: di, haz, ve, pon, sal, sé, ten, ven.",
    },
    {
      type: "examples",
      items: [
        { en: "Abre la puerta, por favor.", pl: "Otwórz drzwi, proszę.", highlight: "Abre" },
        { en: "Ven aquí ahora mismo.", pl: "Chodź tu natychmiast.", highlight: "Ven" },
        { en: "No hables con él.", pl: "Nie rozmawiaj z nim.", highlight: "No hables" },
        { en: "Dímelo ahora.", pl: "Powiedz mi to teraz.", highlight: "Dímelo" },
        { en: "No me lo digas.", pl: "Nie mów mi tego.", highlight: "No me lo digas" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Pozycja zaimków: w rozkazie twierdzącym doczepiamy je NA KOŃCU czasownika (dímelo — często dochodzi wtedy akcent graficzny), a w przeczącym stawiamy PRZED czasownikiem (no me lo digas). „No dímelo” ✗. I nie przenoś formy twierdzącej do przeczenia: „no habla” ✗ → „no hables” ✓ — przeczenie zawsze bierze subjuntivo.",
    },
    {
      type: "quiz",
      question: "Wybierz twierdzący rozkaz (tú) od hacer:",
      options: ["haz", "hace", "haga"],
      correctIndex: 0,
      explanation:
        "Hacer ma nieregularne imperativo dla tú: haz. Hace to 3. osoba czasu teraźniejszego, a haga to forma grzecznościowa dla usted.",
    },
    {
      type: "quiz",
      question: "Przekształć na przeczenie (tú): Habla con él. → ___",
      options: ["No habla con él.", "No hables con él.", "No hable con él."],
      correctIndex: 1,
      explanation:
        "Rozkaz przeczący dla tú bierze formę subjuntivo 2. osoby: no hables. No hable to przeczenie dla usted, a „no habla” nie jest poprawnym rozkazem.",
    },
  ],

  "es-futuro-simple": [
    {
      type: "intro",
      text:
        "Futuro simple to najprostszy w budowie czas hiszpański: końcówki doklejamy do CAŁEGO bezokolicznika (viajar → viajaré) i są identyczne dla wszystkich trzech koniugacji. Używamy go do mówienia o przyszłości (Mañana viajaré a España) oraz — co bywa zaskoczeniem — do przypuszczeń o teraźniejszości: ¿Qué hora será? znaczy „Ciekawe, która godzina”.",
    },
    {
      type: "formula",
      title: "Bezokolicznik + końcówka",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "Mañana", role: "other", note: "okolicznik czasu" },
            { text: "yo", role: "subject" },
            { text: "viajaré", role: "verb", note: "viajar + é — bezokolicznik zostaje w całości" },
            { text: "a España", role: "object" },
          ],
          example: { en: "Mañana viajaré a España.", pl: "Jutro pojadę do Hiszpanii." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Ellos", role: "subject" },
            { text: "no", role: "negation", note: "no zawsze bezpośrednio przed czasownikiem" },
            { text: "sabrán", role: "verb", note: "nieregularny temat sabr- + án" },
            { text: "la verdad", role: "object" },
          ],
          example: { en: "Ellos no sabrán la verdad.", pl: "Oni nie poznają prawdy." },
        },
        {
          label: "Pytanie / domysł",
          parts: [
            { text: "¿Qué", role: "qword" },
            { text: "hora", role: "object" },
            { text: "será?", role: "verb", note: "futuro o TERAZ = przypuszczenie" },
          ],
          example: { en: "¿Qué hora será?", pl: "Ciekawe, która jest godzina?" },
        },
      ],
    },
    {
      type: "table",
      title: "Końcówki — wspólne dla -ar, -er, -ir",
      headers: ["Osoba", "viajar", "comer", "vivir"],
      rows: [
        ["yo", "viajaré", "comeré", "viviré"],
        ["tú", "viajarás", "comerás", "vivirás"],
        ["él / ella / usted", "viajará", "comerá", "vivirá"],
        ["nosotros/-as", "viajaremos", "comeremos", "viviremos"],
        ["vosotros/-as", "viajaréis", "comeréis", "viviréis"],
        ["ellos / ellas / ustedes", "viajarán", "comerán", "vivirán"],
      ],
      caption:
        "Wszystkie końcówki oprócz -emos (nosotros) mają akcent graficzny: -é, -ás, -á, -emos, -éis, -án.",
    },
    {
      type: "table",
      title: "Nieregularny temat, regularne końcówki",
      headers: ["Bezokolicznik", "Temat", "Przykład (él/ella)"],
      rows: [
        ["tener", "tendr-", "tendrá"],
        ["salir", "saldr-", "saldrá"],
        ["poder", "podr-", "podrá"],
        ["poner", "pondr-", "pondrá"],
        ["venir", "vendr-", "vendrá"],
        ["saber", "sabr-", "sabrá"],
        ["querer", "querr-", "querrá"],
        ["hacer", "har-", "hará"],
        ["decir", "dir-", "dirá"],
      ],
    },
    {
      type: "timeline",
      title: "Futuro simple na osi czasu",
      caption:
        "Futuro simple wskazuje przyszłość, ale w znaczeniu domysłu potrafi mówić o chwili obecnej.",
      markers: [
        {
          at: 50,
          label: "Domysł o teraźniejszości",
          example: { en: "Estará en casa.", pl: "Pewnie jest (teraz) w domu." },
        },
        {
          at: 70,
          label: "Plan na jutro",
          example: { en: "Mañana viajaré a España.", pl: "Jutro pojadę do Hiszpanii." },
        },
        {
          at: 90,
          label: "Dalsza przyszłość",
          example: { en: "El año que viene tendremos más tiempo.", pl: "W przyszłym roku będziemy mieć więcej czasu." },
        },
      ],
    },
    {
      type: "examples",
      items: [
        { en: "Mañana viajaré a España.", pl: "Jutro pojadę do Hiszpanii.", highlight: "viajaré" },
        { en: "El año que viene tendremos más tiempo.", pl: "W przyszłym roku będziemy mieć więcej czasu.", highlight: "tendremos" },
        { en: "¿Vendrás a la fiesta el sábado?", pl: "Przyjdziesz w sobotę na imprezę?", highlight: "Vendrás" },
        { en: "Ellos sabrán la verdad tarde o temprano.", pl: "Prędzej czy później poznają prawdę.", highlight: "sabrán" },
        { en: "¿Dónde está Juan? — Estará en casa.", pl: "Gdzie jest Juan? — Pewnie jest w domu.", highlight: "Estará" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Nie odrzucaj końcówki bezokolicznika jak w innych czasach: viviré ✓, nie „vivé” ✗. Pilnuj akcentów — hablara (bez akcentu) to zupełnie inna forma niż hablará. W mowie potocznej Hiszpanie często wybierają ir a + bezokolicznik (Voy a viajar mañana), ale na poziomie B1 musisz swobodnie używać obu form.",
    },
    {
      type: "quiz",
      question: "Uzupełnij (domysł): ¿Qué hora ___?",
      options: ["es", "será", "sería"],
      correctIndex: 1,
      explanation:
        "Futuro simple wyraża przypuszczenie o teraźniejszości: ¿Qué hora será? = „Ciekawe, która godzina”. Zwykłe pytanie o godzinę to ¿Qué hora es?",
    },
  ],

  "es-pronombres-od-oi": [
    {
      type: "intro",
      text:
        "Zaimki dopełnienia pozwalają nie powtarzać w kółko rzeczowników: ¿Ves la película? — Sí, la veo. Dopełnienie bliższe (OD, complemento directo) odpowiada na pytanie kogo? co?, a dalsze (OI, complemento indirecto) — komu? czemu?. Największa różnica względem polskiego: zaimki stoją zwykle PRZED odmienionym czasownikiem, a przy dwóch zaimkach obowiązuje sztywna kolejność.",
    },
    {
      type: "table",
      title: "Formy zaimków",
      headers: ["Osoba", "OD — kogo? co?", "OI — komu? czemu?"],
      rows: [
        ["yo", "me", "me"],
        ["tú", "te", "te"],
        ["él / ella / usted", "lo / la", "le"],
        ["nosotros/-as", "nos", "nos"],
        ["vosotros/-as", "os", "os"],
        ["ellos / ellas / ustedes", "los / las", "les"],
      ],
      caption:
        "Różnice widać tylko w 3. osobie: OD rozróżnia rodzaj (lo/la, los/las), OI nie (le, les).",
    },
    {
      type: "formula",
      title: "Gdzie stoi zaimek?",
      variants: [
        {
          label: "Przed odmienionym czasownikiem",
          parts: [
            { text: "Sí,", role: "other" },
            { text: "la", role: "object", note: "la = la película (OD, rodzaj żeński)" },
            { text: "veo", role: "verb" },
          ],
          example: { en: "¿Ves la película? — Sí, la veo.", pl: "Widzisz ten film? — Tak, oglądam go." },
        },
        {
          label: "Doczepiony do bezokolicznika",
          parts: [
            { text: "Voy a", role: "other", note: "konstrukcja ir a + bezokolicznik" },
            { text: "comprarlo", role: "verb", note: "zaimek doklejony na końcu: comprar + lo" },
          ],
          example: { en: "Voy a comprarlo.", pl: "Zamierzam to kupić." },
        },
        {
          label: "Dwa zaimki: OI przed OD",
          parts: [
            { text: "Se", role: "object", note: "le → se, bo stoi przed lo/la/los/las" },
            { text: "lo", role: "object", note: "lo = el libro (OD)" },
            { text: "doy", role: "verb" },
          ],
          example: { en: "Le doy el libro a María. → Se lo doy.", pl: "Daję Marii książkę. → Daję jej ją." },
        },
      ],
      caption:
        "Doczepianie na końcu działa też przy gerundio (estoy comprándolo) i rozkazie twierdzącym (cómpralo).",
    },
    {
      type: "examples",
      items: [
        { en: "¿Tienes el libro? — Sí, lo tengo.", pl: "Masz tę książkę? — Tak, mam ją.", highlight: "lo tengo" },
        { en: "A nosotros nos gusta el español.", pl: "Nam podoba się hiszpański.", highlight: "nos gusta" },
        { en: "Voy a comprarlo.", pl: "Zamierzam to kupić.", highlight: "comprarlo" },
        { en: "Se lo doy.", pl: "Daję jej to.", highlight: "Se lo" },
        { en: "A María le doy el libro.", pl: "Marii daję książkę (dublowanie OI jest normalne).", highlight: "le" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Gdy le/les spotyka lo/la/los/las, OBOWIĄZKOWO zmienia się w se: „Le lo doy” ✗ → „Se lo doy” ✓. Kolejność zawsze: OI przed OD (najpierw komu, potem co). I nie kalkuj polskiego szyku „Widzę go” → „Veo lo” ✗ — przy odmienionym czasowniku zaimek idzie przed: „Lo veo” ✓.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: ¿Ves la película? Sí, ___ veo.",
      options: ["la", "lo", "le"],
      correctIndex: 0,
      explanation:
        "La película to dopełnienie bliższe rodzaju żeńskiego, więc zastępuje je la. Lo odpowiada rodzajowi męskiemu, a le to zaimek dopełnienia dalszego (komu?).",
    },
    {
      type: "quiz",
      question: "Zastąp oba dopełnienia: Doy el regalo a mis padres. → ___",
      options: ["Les lo doy.", "Se lo doy.", "Lo les doy."],
      correctIndex: 1,
      explanation:
        "Kolejność to OI przed OD, a les przed lo obowiązkowo zmienia się w se: Se lo doy. „Les lo” i „lo les” są niegramatyczne.",
    },
  ],
};
