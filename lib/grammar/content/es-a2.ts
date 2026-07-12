// ============================================================================
// lib/grammar/content/es-a2.ts
// Authored interactive lessons for Spanish A2 grammar topics (for Polish
// learners), keyed by topic slug (must match grammar_topics.slug in
// supabase/seed/es_02_grammar_a2.sql). Convention: the `en` field holds the
// target language (Spanish), the `pl` field holds the Polish translation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const ES_A2_LESSONS: Record<string, GrammarLesson> = {
  // --------------------------------------------------------------------------
  // Pretérito perfecto
  // --------------------------------------------------------------------------
  "es-preterito-perfecto": [
    {
      type: "intro",
      text:
        "Pretérito perfecto to czas przeszły złożony. Używamy go, gdy czynność jest już zakończona, ale wciąż wiąże się z teraźniejszością — wydarzyła się dzisiaj, w tym tygodniu, w tym roku albo „kiedykolwiek w życiu”. Typowe określenia: hoy, esta semana, este año, ya, todavía no, nunca, alguna vez.",
    },
    {
      type: "timeline",
      title: "Kiedy? Przeszłość połączona z „teraz”",
      markers: [
        {
          at: 44,
          label: "he hablado con mi madre (hoy)",
          example: { en: "Hoy he hablado con mi madre.", pl: "Dzisiaj rozmawiałem z mamą." },
        },
        {
          at: 34,
          to: 50,
          label: "hemos trabajado mucho (esta semana)",
          example: { en: "Esta semana hemos trabajado mucho.", pl: "W tym tygodniu dużo pracowaliśmy." },
        },
        {
          at: 5,
          to: 50,
          label: "¿alguna vez has visto...? (całe życie do teraz)",
          example: { en: "¿Alguna vez has visto el mar?", pl: "Czy kiedykolwiek widziałeś morze?" },
        },
      ],
      caption:
        "Czynność jest zakończona, ale okres, w którym się wydarzyła (dzisiaj, ten tydzień, całe życie), sięga aż do „teraz”.",
    },
    {
      type: "formula",
      title: "Budowa: haber (he, has, ha...) + participio",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "Yo", role: "subject", note: "podmiot często pomijamy — formę osoby widać po haber" },
            { text: "he", role: "aux", note: "haber: he, has, ha, hemos, habéis, han" },
            { text: "comido", role: "verb", note: "participio: -ar → -ado (hablado), -er/-ir → -ido (comido, vivido)" },
            { text: "paella", role: "object" },
            { text: "hoy", role: "other", note: "typowe określenia: hoy, esta semana, este año, ya" },
          ],
          example: { en: "Hoy he comido paella con mis amigos.", pl: "Dzisiaj zjadłem paellę z przyjaciółmi." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Todavía", role: "other", note: "todavía no = jeszcze nie" },
            { text: "no", role: "negation", note: "no stoi PRZED haber — nigdy między haber a participio" },
            { text: "he", role: "aux" },
            { text: "escrito", role: "verb", note: "escribir → escrito (participio nieregularne)" },
            { text: "el correo", role: "object" },
          ],
          example: { en: "Todavía no he escrito el correo.", pl: "Jeszcze nie napisałem e-maila." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "¿Qué", role: "qword", note: "pytanie otwiera ¿ — bez żadnego operatora typu do/does" },
            { text: "has", role: "aux" },
            { text: "hecho", role: "verb", note: "hacer → hecho (nieregularne)" },
            { text: "hoy?", role: "other" },
          ],
          example: { en: "¿Qué has hecho hoy?", pl: "Co dzisiaj robiłeś?" },
        },
      ],
      caption:
        "Między haber a participio nic nie wstawiamy — to nierozłączna para.",
    },
    {
      type: "table",
      title: "Odmiana haber w czasie teraźniejszym",
      headers: ["Osoba", "haber", "Przykład"],
      rows: [
        ["yo", "he", "he hablado"],
        ["tú", "has", "has comido"],
        ["él / ella / usted", "ha", "ha trabajado"],
        ["nosotros / nosotras", "hemos", "hemos vivido"],
        ["vosotros / vosotras", "habéis", "habéis escrito"],
        ["ellos / ellas / ustedes", "han", "han hablado"],
      ],
      caption:
        "Haber to tylko czasownik posiłkowy — „mieć” w znaczeniu posiadania to tener.",
    },
    {
      type: "table",
      title: "Participios nieregularne — do zapamiętania",
      headers: ["Bezokolicznik", "Participio", "Przykład"],
      rows: [
        ["hacer", "hecho", "He hecho la tarea."],
        ["escribir", "escrito", "Ha escrito una carta."],
        ["ver", "visto", "¿Has visto esa película?"],
        ["poner", "puesto", "Hemos puesto la mesa."],
        ["decir", "dicho", "No han dicho nada."],
        ["volver", "vuelto", "Ella ha vuelto muy tarde."],
      ],
      caption:
        "Participio w tym czasie nigdy nie zmienia się przez rodzaj ani liczbę — zawsze kończy się na -o.",
    },
    {
      type: "examples",
      items: [
        { en: "Hoy he hablado con mi madre.", pl: "Dzisiaj rozmawiałem z mamą.", highlight: "he hablado" },
        { en: "Esta semana hemos trabajado mucho.", pl: "W tym tygodniu dużo pracowaliśmy.", highlight: "hemos trabajado" },
        { en: "¿Alguna vez has visto el mar?", pl: "Czy kiedykolwiek widziałeś morze?", highlight: "has visto" },
        { en: "Todavía no he escrito el correo.", pl: "Jeszcze nie napisałem e-maila.", highlight: "no he escrito" },
        { en: "Ella ha vuelto a casa muy tarde.", pl: "Ona wróciła do domu bardzo późno.", highlight: "ha vuelto" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Dwie pułapki dla Polaków: 1) haber to NIE tener — \"Tengo comido\" ✗ → \"He comido\" ✓; posiłkowym „mieć” jest zawsze haber. 2) Participio się nie odmienia: \"Ella ha vuelta\" ✗ → \"Ella ha vuelto\" ✓ — końcówka -o dla wszystkich. W Hiszpanii ten czas jest obowiązkowy, gdy mówisz o dzisiejszym dniu.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Ella ___ escrito una carta.",
      options: ["ha", "has", "han"],
      correctIndex: 0,
      explanation:
        "Z „ella” łączy się trzecia osoba liczby pojedynczej: ha. Odmiana haber: he, has, ha, hemos, habéis, han.",
    },
  ],

  // --------------------------------------------------------------------------
  // Pretérito indefinido
  // --------------------------------------------------------------------------
  "es-preterito-indefinido": [
    {
      type: "intro",
      text:
        "Pretérito indefinido to podstawowy czas przeszły dokonany. Opisuje czynności zakończone w przeszłości, które nie mają związku z teraźniejszością — zwykle wiemy dokładnie, kiedy się wydarzyły: ayer, anoche, la semana pasada, el año pasado, en 2010. W Ameryce Łacińskiej używa się go znacznie częściej niż w Hiszpanii.",
    },
    {
      type: "timeline",
      title: "Kiedy? Zamknięta przeszłość",
      markers: [
        {
          at: 10,
          label: "vivimos en Barcelona (en 2010)",
          example: { en: "En 2010 vivimos en Barcelona.", pl: "W 2010 roku mieszkaliśmy w Barcelonie." },
        },
        {
          at: 25,
          label: "viajamos a España (el verano pasado)",
          example: { en: "El verano pasado viajamos a España.", pl: "Zeszłego lata pojechaliśmy do Hiszpanii." },
        },
        {
          at: 40,
          label: "hablé con mi jefe (ayer)",
          example: { en: "Ayer hablé con mi jefe.", pl: "Wczoraj rozmawiałem z szefem." },
        },
      ],
      caption:
        "Każde zdarzenie to zamknięty punkt w przeszłości — okres (wczoraj, zeszły rok) już się skończył. Porównaj: „hoy, esta semana” → pretérito perfecto.",
    },
    {
      type: "formula",
      title: "Budowa zdania",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "Ayer", role: "other", note: "określenia: ayer, anoche, la semana pasada, el año pasado, en 2010" },
            { text: "yo", role: "subject", note: "podmiot często pomijamy — osobę zdradza końcówka" },
            { text: "hablé", role: "verb", note: "hablar → hablé; uwaga na akcent graficzny w 1. osobie!" },
            { text: "con mi jefe", role: "object" },
          ],
          example: { en: "Ayer hablé con mi jefe.", pl: "Wczoraj rozmawiałem z szefem." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Ellos", role: "subject" },
            { text: "no", role: "negation", note: "no stoi tuż przed czasownikiem" },
            { text: "viajaron", role: "verb", note: "viajar → viajaron (3. osoba liczby mnogiej)" },
            { text: "a México", role: "object" },
            { text: "el año pasado", role: "other" },
          ],
          example: { en: "Ellos no viajaron a México el año pasado.", pl: "Oni nie pojechali do Meksyku w zeszłym roku." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "¿Qué", role: "qword", note: "słowo pytające po ¿; szyk się nie zmienia" },
            { text: "hiciste", role: "verb", note: "hacer → hiciste (nieregularne, bez akcentu graficznego)" },
            { text: "el fin de semana pasado?", role: "other" },
          ],
          example: { en: "¿Qué hiciste el fin de semana pasado?", pl: "Co robiłeś w zeszły weekend?" },
        },
      ],
    },
    {
      type: "table",
      title: "Odmiana regularna",
      headers: ["Osoba", "hablar (-ar)", "comer (-er)", "vivir (-ir)"],
      rows: [
        ["yo", "hablé", "comí", "viví"],
        ["tú", "hablaste", "comiste", "viviste"],
        ["él / ella / usted", "habló", "comió", "vivió"],
        ["nosotros / nosotras", "hablamos", "comimos", "vivimos"],
        ["vosotros / vosotras", "hablasteis", "comisteis", "vivisteis"],
        ["ellos / ellas / ustedes", "hablaron", "comieron", "vivieron"],
      ],
      caption:
        "Czasowniki na -er oraz -ir mają identyczne końcówki. Akcent graficzny w 1. i 3. osobie liczby pojedynczej: hablé, habló.",
    },
    {
      type: "table",
      title: "Najważniejsze formy nieregularne",
      headers: ["Bezokolicznik", "yo", "él / ella", "Przykład"],
      rows: [
        ["ser / ir (ta sama forma!)", "fui", "fue", "Ayer fuimos al cine."],
        ["tener", "tuve", "tuvo", "Tuve un problema con el coche."],
        ["hacer", "hice", "hizo", "¿Qué hiciste ayer?"],
        ["estar", "estuve", "estuvo", "Estuve en casa toda la tarde."],
        ["poder", "pude", "pudo", "No pude dormir anoche."],
      ],
      caption:
        "Formy nieregularne nie mają akcentu graficznego: hice, tuve — trzeba je zapamiętać.",
    },
    {
      type: "examples",
      items: [
        { en: "Ayer hablé con María por teléfono.", pl: "Wczoraj rozmawiałem z Marią przez telefon.", highlight: "hablé" },
        { en: "El verano pasado viajamos a España.", pl: "Zeszłego lata pojechaliśmy do Hiszpanii.", highlight: "viajamos" },
        { en: "¿Qué hiciste el fin de semana pasado?", pl: "Co robiłeś w zeszły weekend?", highlight: "hiciste" },
        { en: "Anoche no pude dormir bien.", pl: "Wczoraj w nocy nie mogłem dobrze spać.", highlight: "no pude" },
        { en: "Ellos fueron al cine la semana pasada.", pl: "Oni poszli do kina w zeszłym tygodniu.", highlight: "fueron" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Akcent graficzny zmienia znaczenie! „hablo” = mówię (teraz), ale „habló” = on/ona rozmawiał(a). Pisząc bez akcentu, zmieniasz czas i osobę. Druga pułapka: nie mieszaj czasów — z „ayer, el año pasado” użyj indefinido (hablé), a z „hoy, esta semana” w Hiszpanii użyj pretérito perfecto (he hablado).",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Ayer nosotros ___ al cine.",
      options: ["fuimos", "vamos", "hemos ido"],
      correctIndex: 0,
      explanation:
        "„Ayer” to zamknięta przeszłość, więc potrzebujemy pretérito indefinido: fuimos (od ir). „Vamos” to czas teraźniejszy, a „hemos ido” łączy się z okresami sięgającymi „teraz”, np. hoy.",
    },
  ],

  // --------------------------------------------------------------------------
  // Gerundio (estar + -ando/-iendo)
  // --------------------------------------------------------------------------
  "es-gerundio": [
    {
      type: "intro",
      text:
        "Gerundio to forma czasownika odpowiadająca polskiemu „-ąc” (robiąc, jedząc). Najczęściej spotkasz ją w konstrukcji estar + gerundio, która opisuje czynność trwającą właśnie teraz, w tym momencie: Ahora estoy comiendo — Teraz jem. To hiszpański odpowiednik angielskiego Present Continuous.",
    },
    {
      type: "timeline",
      title: "Kiedy? Czynność trwa w tej chwili",
      markers: [
        {
          at: 42,
          to: 58,
          label: "estoy comiendo (ahora)",
          example: { en: "Ahora estoy comiendo un bocadillo.", pl: "Teraz jem kanapkę." },
        },
        {
          at: 44,
          to: 56,
          label: "están jugando (en este momento)",
          example: { en: "Los niños están jugando en el parque.", pl: "Dzieci bawią się (właśnie) w parku." },
        },
      ],
      caption:
        "Czynność rozciąga się wokół „teraz” — zaczęła się przed chwilą i jeszcze trwa. Do rutyny i planów ta konstrukcja NIE służy.",
    },
    {
      type: "formula",
      title: "Budowa: estar + gerundio",
      variants: [
        {
          label: "Twierdzenie",
          parts: [
            { text: "Los niños", role: "subject" },
            { text: "están", role: "aux", note: "estar: estoy, estás, está, estamos, estáis, están" },
            { text: "jugando", role: "verb", note: "-ar → -ando (jugar → jugando)" },
            { text: "en el parque", role: "object" },
          ],
          example: { en: "Los niños están jugando en el parque.", pl: "Dzieci bawią się w parku." },
        },
        {
          label: "Przeczenie",
          parts: [
            { text: "Yo", role: "subject" },
            { text: "no", role: "negation", note: "no stoi przed estar" },
            { text: "estoy", role: "aux" },
            { text: "trabajando", role: "verb" },
            { text: "ahora", role: "other", note: "typowe określenia: ahora, en este momento" },
          ],
          example: { en: "Yo no estoy trabajando ahora.", pl: "Teraz nie pracuję." },
        },
        {
          label: "Pytanie",
          parts: [
            { text: "¿Qué", role: "qword" },
            { text: "estás", role: "aux" },
            { text: "haciendo", role: "verb", note: "-er/-ir → -iendo (hacer → haciendo)" },
            { text: "en este momento?", role: "other" },
          ],
          example: { en: "¿Qué estás haciendo en este momento?", pl: "Co robisz w tym momencie?" },
        },
      ],
    },
    {
      type: "table",
      title: "Tworzenie gerundio",
      headers: ["Zasada", "Bezokolicznik", "Gerundio"],
      rows: [
        ["-ar → -ando", "hablar, jugar", "hablando, jugando"],
        ["-er / -ir → -iendo", "comer, vivir", "comiendo, viviendo"],
        ["samogłoska przed końcówką → -yendo", "leer, oír", "leyendo, oyendo"],
        ["zmiana samogłoski w temacie", "dormir, pedir", "durmiendo, pidiendo"],
        ["forma szczególna", "ir", "yendo"],
      ],
      caption:
        "Gdy w temacie czasownika na -er/-ir tuż przed końcówką stoi samogłoska, -iendo zmienia się na -yendo: le-er → leyendo.",
    },
    {
      type: "examples",
      items: [
        { en: "Ahora estoy comiendo un bocadillo.", pl: "Teraz jem kanapkę.", highlight: "estoy comiendo" },
        { en: "Los niños están jugando en el parque.", pl: "Dzieci bawią się w parku.", highlight: "están jugando" },
        { en: "¿Qué estás haciendo en este momento?", pl: "Co robisz w tym momencie?", highlight: "estás haciendo" },
        { en: "Estamos viendo la televisión.", pl: "Oglądamy (właśnie) telewizję.", highlight: "Estamos viendo" },
        { en: "El abuelo está durmiendo la siesta.", pl: "Dziadek śpi (właśnie ucina sobie) sjestę.", highlight: "está durmiendo" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Estar + gerundio tylko dla czynności trwających W TEJ CHWILI. Do rutyny użyj zwykłego czasu teraźniejszego: „Estoy trabajando en un banco cada día” ✗ → „Trabajo en un banco” ✓. I nie gub estar: „Yo comiendo” ✗ → „Yo estoy comiendo” ✓ — samo gerundio nie tworzy zdania.",
    },
    {
      type: "quiz",
      question: "Jak brzmi gerundio od czasownika „leer”?",
      options: ["leyendo", "leiendo", "leendo"],
      correctIndex: 0,
      explanation:
        "Po samogłosce w temacie (le-) końcówka -iendo zmienia się na -yendo: leyendo. Podobnie oír → oyendo.",
    },
    {
      type: "quiz",
      question: "Wybierz zdanie o tym, co dzieje się TERAZ:",
      options: [
        "Ella escribe una carta cada semana.",
        "Ella está escribiendo una carta.",
        "Ella escribiendo una carta.",
      ],
      correctIndex: 1,
      explanation:
        "Czynność trwająca teraz = estar + gerundio: „está escribiendo”. Samo gerundio bez estar to za mało, a „escribe cada semana” opisuje rutynę.",
    },
  ],

  // --------------------------------------------------------------------------
  // Stopniowanie przymiotników (comparativos)
  // --------------------------------------------------------------------------
  "es-comparativos": [
    {
      type: "intro",
      text:
        "Stopniowanie przymiotników pozwala porównywać osoby i rzeczy. Po hiszpańsku istnieją trzy typy porównań: wyższości (más... que), niższości (menos... que) i równości (tan... como). Stopień najwyższy tworzymy z rodzajnikiem: el/la/los/las + más + przymiotnik. Prosta zasada: przy más i menos zawsze pojawia się que, przy tan — como.",
    },
    {
      type: "formula",
      title: "Cztery wzory porównań",
      variants: [
        {
          label: "Wyższość",
          parts: [
            { text: "Juan", role: "subject" },
            { text: "es", role: "aux" },
            { text: "más alto", role: "verb", note: "más + przymiotnik = bardziej / -szy" },
            { text: "que", role: "other", note: "que = niż — zawsze przy más i menos" },
            { text: "Pedro", role: "object" },
          ],
          example: { en: "Juan es más alto que Pedro.", pl: "Juan jest wyższy niż Pedro." },
        },
        {
          label: "Niższość",
          parts: [
            { text: "Este libro", role: "subject" },
            { text: "es", role: "aux" },
            { text: "menos interesante", role: "verb", note: "menos + przymiotnik = mniej..." },
            { text: "que", role: "other" },
            { text: "el otro", role: "object" },
          ],
          example: { en: "Este libro es menos interesante que el otro.", pl: "Ta książka jest mniej interesująca niż tamta." },
        },
        {
          label: "Równość",
          parts: [
            { text: "María", role: "subject" },
            { text: "es", role: "aux" },
            { text: "tan simpática", role: "verb", note: "tan + przymiotnik = tak samo..." },
            { text: "como", role: "other", note: "como = jak — tylko przy tan!" },
            { text: "su hermana", role: "object" },
          ],
          example: { en: "María es tan simpática como su hermana.", pl: "María jest tak miła jak jej siostra." },
        },
        {
          label: "Stopień najwyższy",
          parts: [
            { text: "Elena", role: "subject" },
            { text: "es", role: "aux" },
            { text: "la más inteligente", role: "verb", note: "rodzajnik (el/la/los/las) + más + przymiotnik" },
            { text: "de la clase", role: "object", note: "zakres porównania z de: de la clase, del mundo" },
          ],
          example: { en: "Elena es la más inteligente de la clase.", pl: "Elena jest najinteligentniejsza w klasie." },
        },
      ],
      caption:
        "Przymiotnik zgadza się w rodzaju i liczbie z rzeczownikiem: más alta (ona), más altos (oni).",
    },
    {
      type: "table",
      title: "Formy nieregularne — bez más!",
      headers: ["Przymiotnik", "Stopień wyższy", "Przykład"],
      rows: [
        ["bueno (dobry)", "mejor (lepszy)", "Este restaurante es mejor que aquel."],
        ["malo (zły)", "peor (gorszy)", "El tiempo hoy es peor que ayer."],
        ["grande (duży / starszy)", "mayor", "Mi hermano mayor tiene veinte años."],
        ["pequeño (mały / młodszy)", "menor", "Ana es menor que su prima."],
      ],
      caption:
        "Tych form nie łączymy z más: „más bueno” brzmi źle — mów mejor.",
    },
    {
      type: "examples",
      items: [
        { en: "Juan es más alto que Pedro.", pl: "Juan jest wyższy niż Pedro.", highlight: "más alto que" },
        { en: "Este libro es menos interesante que el otro.", pl: "Ta książka jest mniej interesująca niż tamta.", highlight: "menos interesante que" },
        { en: "Mi coche es tan rápido como el tuyo.", pl: "Mój samochód jest tak szybki jak twój.", highlight: "tan rápido como" },
        { en: "Elena es la más inteligente de la clase.", pl: "Elena jest najinteligentniejsza w klasie.", highlight: "la más inteligente" },
        { en: "Este café es peor que el otro.", pl: "Ta kawa jest gorsza niż tamta.", highlight: "peor que" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Nie łącz más z formami nieregularnymi: „más mejor” ✗ → „mejor” ✓, „más bueno que” ✗ → „mejor que” ✓. Nie myl też łączników: más/menos idzie w parze z que, a tan — z como; „tan rápido que” ✗ → „tan rápido como” ✓. I pamiętaj o zgodności: „Ana es más alto” ✗ → „Ana es más alta” ✓.",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Mi coche es tan rápido ___ el tuyo.",
      options: ["como", "que", "de"],
      correctIndex: 0,
      explanation:
        "Porównanie równości to tan + przymiotnik + como. „Que” występuje tylko przy más i menos.",
    },
    {
      type: "quiz",
      question: "Jak powiesz „lepszy niż”?",
      options: ["más bueno que", "mejor que", "tan bueno que"],
      correctIndex: 1,
      explanation:
        "„Bueno” ma nieregularny stopień wyższy: mejor. Nie dodajemy do niego más, a łącznikiem porównania wyższości jest que.",
    },
  ],

  // --------------------------------------------------------------------------
  // Ser vs estar
  // --------------------------------------------------------------------------
  "es-ser-vs-estar": [
    {
      type: "intro",
      text:
        "Ser i estar to dwa czasowniki, które po polsku znaczą „być” — i właśnie dlatego tak łatwo je pomylić. Ser opisuje to, kim lub czym coś jest na stałe: tożsamość, zawód, narodowość, charakter, pochodzenie, materiał. Estar opisuje, jak coś się ma teraz (stany, samopoczucie, nastrój) albo gdzie się znajduje. To jedno z najważniejszych rozróżnień na poziomie A2.",
    },
    {
      type: "table",
      title: "Odmiana ser i estar",
      headers: ["Osoba", "ser", "estar"],
      rows: [
        ["yo", "soy", "estoy"],
        ["tú", "eres", "estás"],
        ["él / ella / usted", "es", "está"],
        ["nosotros / nosotras", "somos", "estamos"],
        ["vosotros / vosotras", "sois", "estáis"],
        ["ellos / ellas / ustedes", "son", "están"],
      ],
    },
    {
      type: "compare",
      title: "ser vs estar",
      columns: [
        {
          title: "ser — cechy stałe",
          formula: "ser + cecha / tożsamość",
          whenToUse:
            "To, kim lub czym coś jest na stałe: tożsamość, zawód, narodowość, charakter, pochodzenie, materiał.",
          examples: [
            "Ella es profesora.",
            "Somos de Polonia.",
            "La mesa es de madera.",
          ],
        },
        {
          title: "estar — stany i miejsce",
          formula: "estar + stan / położenie",
          whenToUse:
            "Stany tymczasowe: samopoczucie, nastrój, zmęczenie — oraz położenie, czyli gdzie coś się znajduje.",
          examples: [
            "Hoy estoy muy cansado.",
            "Madrid está en España.",
            "¿Cómo estás?",
          ],
        },
      ],
    },
    {
      type: "table",
      title: "Przymiotniki, które zmieniają znaczenie",
      headers: ["Przymiotnik", "z ser", "z estar"],
      rows: [
        ["aburrido", "es aburrido = jest nudny", "está aburrido = jest znudzony"],
        ["listo", "es listo = jest bystry", "está listo = jest gotowy"],
        ["malo", "es malo = jest zły, niedobry", "está malo = jest chory"],
      ],
      caption:
        "Ten sam przymiotnik, inne „być” — i całkiem inny sens zdania.",
    },
    {
      type: "examples",
      items: [
        { en: "Ella es profesora de matemáticas.", pl: "Ona jest nauczycielką matematyki.", highlight: "es" },
        { en: "La mesa es de madera.", pl: "Stół jest z drewna.", highlight: "es de madera" },
        { en: "Madrid está en España.", pl: "Madryt leży w Hiszpanii.", highlight: "está en" },
        { en: "Hoy estamos muy cansados.", pl: "Dzisiaj jesteśmy bardzo zmęczeni.", highlight: "estamos" },
        { en: "¿Cómo estás? — Muy bien, gracias.", pl: "Jak się masz? — Bardzo dobrze, dziękuję.", highlight: "estás" },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        "Położenie to ZAWSZE estar — nawet jeśli miejsce jest stałe od wieków: „Varsovia es en Polonia” ✗ → „Varsovia está en Polonia” ✓. Polskie „jest” nie podpowie ci wyboru, więc pytaj: kim/czym coś jest (→ ser) czy jak się ma / gdzie jest (→ estar)?",
    },
    {
      type: "quiz",
      question: "Uzupełnij: Madrid ___ en España.",
      options: ["está", "es", "son"],
      correctIndex: 0,
      explanation:
        "Położenie — gdzie coś się znajduje — zawsze wyrażamy przez estar, nawet gdy chodzi o miejsce stałe, takie jak miasto.",
    },
    {
      type: "quiz",
      question: "Co znaczy zdanie „Pedro está aburrido”?",
      options: [
        "Pedro jest nudny.",
        "Pedro jest znudzony.",
        "Pedro jest zmęczony.",
      ],
      correctIndex: 1,
      explanation:
        "Estar aburrido = być znudzonym (stan chwilowy). „Pedro jest nudny” (cecha charakteru) to ser aburrido: Pedro es aburrido.",
    },
  ],
};
