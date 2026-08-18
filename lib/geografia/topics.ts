// ============================================================================
// lib/geografia/topics.ts
// Canonical list of the 23 CKE "zakres rozszerzony" (extended-scope) geography
// sections, seeded into geo_topics (supabase/seed/geografia/01_topics.sql).
//
// Section titles are taken VERBATIM from the 2024 podstawa programowa
// (rozporządzenie MEiN, obowiązująca od matury 2025/2027 — confirmed live
// against zpe.gov.pl/podstawa-programowa/szkola-ponadpodstawowa/geografia on
// 2026-08-18): 16 zakres-podstawowy sections (I-XVI) plus 7 rozszerzenie-only
// sections (XVII-XXIII), all of which the rozszerzenie exam covers. This is
// the CORE CURRICULUM structure, not the yearly CKE "informator maturalny"
// (which adds worked examples/weighting on top but hasn't been republished
// for the exam this app targets as of this writing) — verify section wording
// against the current informator when CKE publishes it, same "admin can
// re-tune at any time" spirit as MATH_TOPICS.examWeight in lib/matma/topics.ts.
// ============================================================================

export interface GeoTopicSeed {
  slug: string;
  ckeNumber: string;
  title: string;
  description: string;
  orderIndex: number;
}

export const GEO_TOPICS: GeoTopicSeed[] = [
  {
    slug: "zrodla-informacji-geograficznej",
    ckeNumber: "I",
    title: "Źródła informacji geograficznej, technologie geoinformacyjne oraz metody prezentacji danych przestrzennych",
    description:
      "Mapa i jej elementy, skala, siatka geograficzna, GPS/GIS, teledetekcja, interpretacja map tematycznych, wykresów, danych statystycznych i zdjęć satelitarnych.",
    orderIndex: 1,
  },
  {
    slug: "ziemia-we-wszechswiecie",
    ckeNumber: "II",
    title: "Ziemia we Wszechświecie",
    description:
      "Ruch obrotowy i obiegowy Ziemi oraz ich następstwa (strefy czasowe, pory roku, oświetlenie Ziemi), Układ Słoneczny, kształt i wymiary Ziemi.",
    orderIndex: 2,
  },
  {
    slug: "atmosfera",
    ckeNumber: "III",
    title: "Atmosfera",
    description:
      "Budowa i skład atmosfery, bilans radiacyjny, krążenie powietrza, masy powietrza i fronty atmosferyczne, strefy klimatyczne, pogoda a klimat, ekstremalne zjawiska pogodowe.",
    orderIndex: 3,
  },
  {
    slug: "hydrosfera",
    ckeNumber: "IV",
    title: "Hydrosfera",
    description:
      "Krążenie wody w przyrodzie, wody oceaniczne (prądy morskie, pływy), wody śródlądowe (rzeki, jeziora, lodowce, wody podziemne), zasoby wody i ich zagrożenia.",
    orderIndex: 4,
  },
  {
    slug: "litosfera",
    ckeNumber: "V",
    title: "Litosfera",
    description:
      "Budowa wnętrza Ziemi, tektonika płyt, procesy wewnętrzne (wulkanizm, trzęsienia ziemi, ruchy górotwórcze) i zewnętrzne (wietrzenie, erozja, rzeźbotwórcza działalność lodowców, rzek, wiatru, morza), skały.",
    orderIndex: 5,
  },
  {
    slug: "pedosfera-i-biosfera",
    ckeNumber: "VI",
    title: "Pedosfera i biosfera",
    description:
      "Czynniki glebotwórcze i typy gleb, strefowość gleb, formacje roślinne świata, zależności klimat-gleba-roślinność-fauna, ochrona przyrody.",
    orderIndex: 6,
  },
  {
    slug: "podzial-polityczny-i-rozwoj-spoleczno-gospodarczy",
    ckeNumber: "VII",
    title: "Podział polityczny i zróżnicowanie poziomu rozwoju społeczno-gospodarczego świata",
    description:
      "Mapa polityczna świata, formy ustrojowe państw, ugrupowania integracyjne, mierniki rozwoju (PKB, HDI), podział na kraje wysoko i słabo rozwinięte.",
    orderIndex: 7,
  },
  {
    slug: "demografia-i-osadnictwo",
    ckeNumber: "VIII",
    title: "Przemiany struktur demograficznych i społecznych oraz procesy osadnicze",
    description:
      "Rozmieszczenie ludności, przyrost naturalny i rzeczywisty, migracje, struktura wieku i płci, model przejścia demograficznego, urbanizacja, sieć osadnicza.",
    orderIndex: 8,
  },
  {
    slug: "uwarunkowania-gospodarki-swiatowej",
    ckeNumber: "IX",
    title: "Uwarunkowania rozwoju gospodarki światowej",
    description:
      "Zasoby naturalne i ich wykorzystanie, czynniki lokalizacji działalności gospodarczej, globalizacja, korporacje transnarodowe, handel międzynarodowy.",
    orderIndex: 9,
  },
  {
    slug: "rolnictwo-lesnictwo-rybactwo",
    ckeNumber: "X",
    title: "Rolnictwo, leśnictwo i rybactwo",
    description:
      "Warunki rozwoju rolnictwa, typy rolnictwa na świecie, struktura użytkowania ziemi, leśnictwo, rybołówstwo morskie i akwakultura.",
    orderIndex: 10,
  },
  {
    slug: "przemysl",
    ckeNumber: "XI",
    title: "Przemysł",
    description:
      "Czynniki lokalizacji przemysłu, przemiany strukturalne przemysłu na świecie, okręgi przemysłowe, nowoczesne technologie i przemysł high-tech.",
    orderIndex: 11,
  },
  {
    slug: "uslugi",
    ckeNumber: "XII",
    title: "Usługi",
    description: "Struktura i zróżnicowanie usług, transport, turystyka, usługi finansowe i informacyjne, handel.",
    orderIndex: 12,
  },
  {
    slug: "czlowiek-a-srodowisko",
    ckeNumber: "XIII",
    title: "Człowiek a środowisko geograficzne – konflikty interesów",
    description:
      "Antropopresja, degradacja środowiska, zrównoważony rozwój, konflikty w wykorzystaniu zasobów i przestrzeni.",
    orderIndex: 13,
  },
  {
    slug: "srodowisko-przyrodnicze-polski",
    ckeNumber: "XIV",
    title: "Regionalne zróżnicowanie środowiska przyrodniczego Polski",
    description:
      "Ukształtowanie powierzchni, budowa geologiczna, klimat, wody, gleby i szata roślinna Polski w ujęciu regionalnym, krainy geograficzne.",
    orderIndex: 14,
  },
  {
    slug: "spoleczenstwo-i-gospodarka-polski",
    ckeNumber: "XV",
    title: "Społeczeństwo i gospodarka Polski",
    description:
      "Struktura demograficzna i społeczna Polski, sieć osadnicza, rolnictwo, przemysł i usługi w Polsce, zróżnicowanie regionalne rozwoju.",
    orderIndex: 15,
  },
  {
    slug: "morze-baltyckie",
    ckeNumber: "XVI",
    title: "Morze Bałtyckie i gospodarka morska Polski",
    description:
      "Cechy fizycznogeograficzne Bałtyku, porty i żegluga, gospodarka morska Polski, zagrożenia środowiska Morza Bałtyckiego.",
    orderIndex: 16,
  },
  {
    slug: "strefowosc-przyrodnicza",
    ckeNumber: "XVII",
    title: "Strefowość środowiska przyrodniczego na Ziemi",
    description:
      "Strefy klimatyczno-roślinno-glebowe świata, astrefowe zróżnicowanie środowiska (piętrowość górska, wpływ prądów morskich i kontynentalizmu).",
    orderIndex: 17,
  },
  {
    slug: "problemy-srodowiskowe-swiata",
    ckeNumber: "XVIII",
    title: "Problemy środowiskowe współczesnego świata",
    description:
      "Zmiany klimatu, efekt cieplarniany, dziura ozonowa, pustynnienie, wylesianie, zanieczyszczenie wód i atmosfery, utrata bioróżnorodności.",
    orderIndex: 18,
  },
  {
    slug: "uwarunkowania-przyrodnicze-gospodarki",
    ckeNumber: "XIX",
    title: "Uwarunkowania przyrodnicze gospodarczej działalności człowieka",
    description:
      "Wpływ rzeźby terenu, klimatu, wód i zasobów naturalnych na rozmieszczenie rolnictwa, przemysłu, osadnictwa i turystyki w wybranych regionach świata.",
    orderIndex: 19,
  },
  {
    slug: "problemy-polityczne-swiata",
    ckeNumber: "XX",
    title: "Problemy polityczne współczesnego świata",
    description:
      "Konflikty zbrojne i ich podłoże geograficzne, terroryzm, spory graniczne i terytorialne, państwa upadłe, uchodźstwo.",
    orderIndex: 20,
  },
  {
    slug: "problemy-spoleczne-swiata",
    ckeNumber: "XXI",
    title: "Wybrane problemy społeczne współczesnego świata",
    description:
      "Głód i niedożywienie, dostęp do wody pitnej, ubóstwo, nierówności społeczne, starzenie się społeczeństw, epidemie i ich uwarunkowania geograficzne.",
    orderIndex: 21,
  },
  {
    slug: "jakosc-zycia-na-swiecie",
    ckeNumber: "XXII",
    title: "Zróżnicowanie jakości życia człowieka w wybranych regionach i krajach świata",
    description:
      "Wskaźniki jakości życia (HDI, dostęp do edukacji i opieki zdrowotnej), kontrasty rozwojowe między regionami świata, studia przypadków wybranych krajów.",
    orderIndex: 22,
  },
  {
    slug: "problemy-gospodarcze-swiata",
    ckeNumber: "XXIII",
    title: "Problemy gospodarcze współczesnego świata",
    description:
      "Zadłużenie państw, kryzysy gospodarcze, nierównomierny rozwój gospodarczy, transformacja gospodarek postsocjalistycznych, gospodarka oparta na wiedzy.",
    orderIndex: 23,
  },
];

export const GEO_TOPIC_SLUGS = GEO_TOPICS.map((t) => t.slug);
