// ============================================================================
// lib/modlitwa/liturgical-calendar.ts
// Czysta (bez I/O, bez zależności) implementacja kalendarza liturgicznego
// Kościoła katolickiego w Polsce: okres, kolor szat, nazwa dnia oraz lista
// uroczystości/świąt na dany dzień.
//
// Dlaczego liczone lokalnie, a nie importowane z zewnątrz: daty świąt są
// w 100% deterministyczne (wszystko wisi na dacie Wielkanocy), więc pobieranie
// ich z sieci wprowadzałoby tylko awaryjność. Import kalendarza z zewnątrz
// zostaje odwrócony: to MY publikujemy feed ICS, który Google/Apple subskrybują
// (patrz lib/modlitwa/ics.ts) — użytkownik dostaje te same daty w swoim
// kalendarzu, bez oddawania aplikacji dostępu do prywatnych wydarzeń.
//
// Uproszczenia (świadome): kalendarz obejmuje niedziele, wszystkie
// uroczystości i święta oraz najpopularniejsze wspomnienia obowiązkowe —
// nie jest pełnym kalendarzem z wszystkimi wspomnieniami dowolnymi ani
// kalendarzami zakonnymi/diecezjalnymi.
//
// Wszystkie daty są operowane jako lokalne "YYYY-MM-DD" (bez UTC), tak jak w
// lib/calendar/date-utils.ts — inaczej strefa czasowa potrafi przesunąć dzień.
// ============================================================================

export type LiturgicalSeason =
  | "adwent"
  | "boze_narodzenie"
  | "zwykly"
  | "wielki_post"
  | "triduum"
  | "wielkanoc";

export type LiturgicalRank = "uroczystosc" | "swieto" | "wspomnienie" | "niedziela";
export type LiturgicalColor = "bialy" | "czerwony" | "zielony" | "fioletowy" | "rozowy";

export interface Observance {
  name: string;
  rank: LiturgicalRank;
  color: LiturgicalColor;
  /** Uroczystość nakazana w Polsce (obowiązek uczestnictwa we Mszy św.). */
  holyDayOfObligation?: boolean;
}

export interface LiturgicalDay {
  /** "YYYY-MM-DD" */
  date: string;
  season: LiturgicalSeason;
  seasonLabel: string;
  /** Np. „III Niedziela Adwentu”, „Wtorek XX tygodnia zwykłego”. */
  name: string;
  color: LiturgicalColor;
  /** Uroczystości/święta/wspomnienia wypadające tego dnia (może być puste). */
  observances: Observance[];
  /** Tydzień okresu (adwent/wielki post/wielkanoc) lub tydzień zwykły. */
  weekNumber: number | null;
  isSunday: boolean;
}

export const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  adwent: "Adwent",
  boze_narodzenie: "Okres Narodzenia Pańskiego",
  zwykly: "Okres zwykły",
  wielki_post: "Wielki Post",
  triduum: "Triduum Paschalne",
  wielkanoc: "Okres wielkanocny",
};

export const COLOR_LABELS: Record<LiturgicalColor, string> = {
  bialy: "biały",
  czerwony: "czerwony",
  zielony: "zielony",
  fioletowy: "fioletowy",
  rozowy: "różowy",
};

/** Tailwind-owe klasy tła/tekstu dla kropki koloru szat w UI. */
export const COLOR_DOT_CLASSES: Record<LiturgicalColor, string> = {
  bialy: "bg-white border border-border",
  czerwony: "bg-red-500",
  zielony: "bg-emerald-500",
  fioletowy: "bg-violet-500",
  rozowy: "bg-pink-400",
};

const WEEKDAY_NAMES = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
  "XXII",
  "XXIII",
  "XXIV",
  "XXV",
  "XXVI",
  "XXVII",
  "XXVIII",
  "XXIX",
  "XXX",
  "XXXI",
  "XXXII",
  "XXXIII",
  "XXXIV",
];

// ---------------------------------------------------------------------------
// Pomocnicze operacje na datach — wszystko na lokalnym Date, nigdy na
// toISOString() (patrz nagłówek).
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Lokalny Date -> "YYYY-MM-DD". */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" -> lokalny Date (północ czasu lokalnego). */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

/** Liczba pełnych dni między dwiema datami (b - a), odporna na zmianę czasu. */
export function daysBetween(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / 86_400_000);
}

/**
 * Dzisiejsza data jako "YYYY-MM-DD" — ZAWSZE w strefie Europe/Warsaw, nie w
 * strefie procesu. Serwer na Vercelu chodzi w UTC, więc między północą a 2:00
 * czasu polskiego „dzisiaj” po stronie serwera to jeszcze wczoraj: bez tego
 * werset dnia, czytania i streak rozjeżdżałyby się co noc o jeden dzień.
 */
export function todayKey(): string {
  // "sv-SE" daje format ISO (YYYY-MM-DD) bez ręcznego składania.
  return new Intl.DateTimeFormat("sv-SE", { timeZone: WARSAW_TZ }).format(new Date());
}

const WARSAW_TZ = "Europe/Warsaw";

/** Bieżąca godzina (0-23) w Polsce — do podpowiedzi „która godzina brewiarza”. */
export function currentWarsawHour(): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: WARSAW_TZ, hour: "2-digit", hour12: false }).format(
      new Date()
    )
  );
}

// ---------------------------------------------------------------------------
// Wielkanoc i daty ruchome
// ---------------------------------------------------------------------------

/**
 * Niedziela Wielkanocna dla kalendarza gregoriańskiego — algorytm Meeusa/Jonesa/
 * Butchera (ten sam wynik co tablice liturgiczne dla lat 1583–4099).
 */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzec, 4 = kwiecień
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** I Niedziela Adwentu = czwarta niedziela przed 25 grudnia. */
export function firstSundayOfAdvent(year: number): Date {
  const christmas = new Date(year, 11, 25);
  const weekday = christmas.getDay(); // 0 = niedziela
  const sundayBeforeChristmas = addDays(christmas, weekday === 0 ? -7 : -weekday);
  return addDays(sundayBeforeChristmas, -21);
}

/**
 * Niedziela Chrztu Pańskiego — kończy okres Narodzenia Pańskiego. W Polsce
 * Objawienie Pańskie jest zawsze 6 stycznia, a Chrzest Pański wypada w
 * następującą po nim niedzielę (jeśli 6 I jest niedzielą — w poniedziałek 7 I).
 */
export function baptismOfTheLord(year: number): Date {
  const epiphany = new Date(year, 0, 6);
  if (epiphany.getDay() === 0) return new Date(year, 0, 7);
  const daysToSunday = 7 - epiphany.getDay();
  return addDays(epiphany, daysToSunday);
}

export interface MovableFeasts {
  easter: Date;
  ashWednesday: Date;
  palmSunday: Date;
  holyThursday: Date;
  goodFriday: Date;
  holySaturday: Date;
  ascension: Date;
  pentecost: Date;
  trinity: Date;
  corpusChristi: Date;
  sacredHeart: Date;
  christTheKing: Date;
  divineMercy: Date;
}

export function movableFeasts(year: number): MovableFeasts {
  const easter = easterSunday(year);
  return {
    easter,
    ashWednesday: addDays(easter, -46),
    palmSunday: addDays(easter, -7),
    holyThursday: addDays(easter, -3),
    goodFriday: addDays(easter, -2),
    holySaturday: addDays(easter, -1),
    divineMercy: addDays(easter, 7),
    // W Polsce Wniebowstąpienie jest przeniesione na VII Niedzielę Wielkanocną.
    ascension: addDays(easter, 42),
    pentecost: addDays(easter, 49),
    trinity: addDays(easter, 56),
    corpusChristi: addDays(easter, 60), // czwartek po Trójcy Świętej
    sacredHeart: addDays(easter, 68), // piątek po oktawie Bożego Ciała
    christTheKing: addDays(firstSundayOfAdvent(year), -7),
  };
}

// ---------------------------------------------------------------------------
// Stałe uroczystości, święta i najważniejsze wspomnienia (kalendarz polski)
// ---------------------------------------------------------------------------

interface FixedObservance extends Observance {
  month: number; // 1-12
  day: number;
}

const FIXED_OBSERVANCES: FixedObservance[] = [
  { month: 1, day: 1, name: "Świętej Bożej Rodzicielki Maryi", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
  { month: 1, day: 6, name: "Objawienie Pańskie (Trzech Króli)", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
  { month: 1, day: 25, name: "Nawrócenie św. Pawła Apostoła", rank: "swieto", color: "bialy" },
  { month: 2, day: 2, name: "Ofiarowanie Pańskie (Matki Bożej Gromnicznej)", rank: "swieto", color: "bialy" },
  { month: 2, day: 11, name: "Najświętszej Maryi Panny z Lourdes", rank: "wspomnienie", color: "bialy" },
  { month: 3, day: 19, name: "Św. Józefa, Oblubieńca NMP", rank: "uroczystosc", color: "bialy" },
  { month: 3, day: 25, name: "Zwiastowanie Pańskie", rank: "uroczystosc", color: "bialy" },
  { month: 4, day: 23, name: "Św. Wojciecha, biskupa i męczennika", rank: "uroczystosc", color: "czerwony" },
  { month: 4, day: 25, name: "Św. Marka Ewangelisty", rank: "swieto", color: "czerwony" },
  { month: 5, day: 1, name: "Św. Józefa Rzemieślnika", rank: "wspomnienie", color: "bialy" },
  { month: 5, day: 3, name: "Najświętszej Maryi Panny Królowej Polski", rank: "uroczystosc", color: "bialy" },
  { month: 5, day: 8, name: "Św. Stanisława, biskupa i męczennika", rank: "uroczystosc", color: "czerwony" },
  { month: 5, day: 31, name: "Nawiedzenie Najświętszej Maryi Panny", rank: "swieto", color: "bialy" },
  { month: 6, day: 24, name: "Narodzenie św. Jana Chrzciciela", rank: "uroczystosc", color: "bialy" },
  { month: 6, day: 29, name: "Świętych Apostołów Piotra i Pawła", rank: "uroczystosc", color: "czerwony" },
  { month: 7, day: 3, name: "Św. Tomasza Apostoła", rank: "swieto", color: "czerwony" },
  { month: 7, day: 16, name: "Najświętszej Maryi Panny z Góry Karmel", rank: "wspomnienie", color: "bialy" },
  { month: 7, day: 22, name: "Św. Marii Magdaleny", rank: "swieto", color: "bialy" },
  { month: 7, day: 25, name: "Św. Jakuba Apostoła", rank: "swieto", color: "czerwony" },
  { month: 8, day: 6, name: "Przemienienie Pańskie", rank: "swieto", color: "bialy" },
  { month: 8, day: 14, name: "Św. Maksymiliana Marii Kolbego", rank: "wspomnienie", color: "czerwony" },
  { month: 8, day: 15, name: "Wniebowzięcie Najświętszej Maryi Panny", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
  { month: 8, day: 26, name: "Najświętszej Maryi Panny Częstochowskiej", rank: "uroczystosc", color: "bialy" },
  { month: 9, day: 8, name: "Narodzenie Najświętszej Maryi Panny", rank: "swieto", color: "bialy" },
  { month: 9, day: 14, name: "Podwyższenie Krzyża Świętego", rank: "swieto", color: "czerwony" },
  { month: 9, day: 21, name: "Św. Mateusza, Apostoła i Ewangelisty", rank: "swieto", color: "czerwony" },
  { month: 9, day: 29, name: "Świętych Archaniołów Michała, Gabriela i Rafała", rank: "swieto", color: "bialy" },
  { month: 10, day: 2, name: "Świętych Aniołów Stróżów", rank: "wspomnienie", color: "bialy" },
  { month: 10, day: 7, name: "Najświętszej Maryi Panny Różańcowej", rank: "wspomnienie", color: "bialy" },
  { month: 10, day: 16, name: "Św. Jadwigi Śląskiej", rank: "swieto", color: "bialy" },
  { month: 10, day: 18, name: "Św. Łukasza Ewangelisty", rank: "swieto", color: "czerwony" },
  { month: 10, day: 22, name: "Św. Jana Pawła II, papieża", rank: "wspomnienie", color: "bialy" },
  { month: 11, day: 1, name: "Wszystkich Świętych", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
  { month: 11, day: 2, name: "Wspomnienie Wszystkich Wiernych Zmarłych (Dzień Zaduszny)", rank: "wspomnienie", color: "fioletowy" },
  { month: 11, day: 9, name: "Rocznica poświęcenia Bazyliki Laterańskiej", rank: "swieto", color: "bialy" },
  { month: 11, day: 30, name: "Św. Andrzeja Apostoła", rank: "swieto", color: "czerwony" },
  { month: 12, day: 8, name: "Niepokalane Poczęcie Najświętszej Maryi Panny", rank: "uroczystosc", color: "bialy" },
  { month: 12, day: 25, name: "Narodzenie Pańskie (Boże Narodzenie)", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
  { month: 12, day: 26, name: "Św. Szczepana, pierwszego męczennika", rank: "swieto", color: "czerwony" },
  { month: 12, day: 27, name: "Św. Jana, Apostoła i Ewangelisty", rank: "swieto", color: "bialy" },
  { month: 12, day: 28, name: "Świętych Młodzianków, męczenników", rank: "swieto", color: "czerwony" },
];

function movableObservances(year: number): Array<{ date: Date } & Observance> {
  const f = movableFeasts(year);
  return [
    { date: f.ashWednesday, name: "Środa Popielcowa", rank: "wspomnienie", color: "fioletowy" },
    { date: f.palmSunday, name: "Niedziela Palmowa Męki Pańskiej", rank: "niedziela", color: "czerwony" },
    { date: f.holyThursday, name: "Wielki Czwartek — Msza Wieczerzy Pańskiej", rank: "swieto", color: "bialy" },
    { date: f.goodFriday, name: "Wielki Piątek Męki Pańskiej", rank: "swieto", color: "czerwony" },
    { date: f.holySaturday, name: "Wielka Sobota — Wigilia Paschalna", rank: "swieto", color: "bialy" },
    { date: f.easter, name: "Niedziela Zmartwychwstania Pańskiego", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
    { date: addDays(f.easter, 1), name: "Poniedziałek w oktawie Wielkanocy", rank: "uroczystosc", color: "bialy" },
    { date: f.divineMercy, name: "Niedziela Miłosierdzia Bożego", rank: "niedziela", color: "bialy" },
    { date: f.ascension, name: "Wniebowstąpienie Pańskie", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
    { date: f.pentecost, name: "Zesłanie Ducha Świętego", rank: "uroczystosc", color: "czerwony", holyDayOfObligation: true },
    { date: f.trinity, name: "Najświętszej Trójcy", rank: "uroczystosc", color: "bialy" },
    { date: f.corpusChristi, name: "Najświętszego Ciała i Krwi Chrystusa (Boże Ciało)", rank: "uroczystosc", color: "bialy", holyDayOfObligation: true },
    { date: f.sacredHeart, name: "Najświętszego Serca Pana Jezusa", rank: "uroczystosc", color: "bialy" },
    { date: f.christTheKing, name: "Jezusa Chrystusa, Króla Wszechświata", rank: "uroczystosc", color: "bialy" },
  ];
}

// ---------------------------------------------------------------------------
// Okres liturgiczny
// ---------------------------------------------------------------------------

interface SeasonInfo {
  season: LiturgicalSeason;
  /** Numer tygodnia w okresie (1-based) lub null. */
  weekNumber: number | null;
}

function resolveSeason(date: Date): SeasonInfo {
  const year = date.getFullYear();
  const f = movableFeasts(year);
  const advent = firstSundayOfAdvent(year);
  const baptism = baptismOfTheLord(year);

  // Adwent -> koniec roku kalendarzowego
  if (daysBetween(advent, date) >= 0) {
    if (date.getMonth() === 11 && date.getDate() >= 25) {
      return { season: "boze_narodzenie", weekNumber: null };
    }
    return { season: "adwent", weekNumber: Math.floor(daysBetween(advent, date) / 7) + 1 };
  }

  // 1 stycznia -> Chrzest Pański
  if (daysBetween(date, baptism) >= 0) {
    return { season: "boze_narodzenie", weekNumber: null };
  }

  // Triduum Paschalne: Wielki Czwartek wieczorem -> Wielka Sobota
  if (daysBetween(f.holyThursday, date) >= 0 && daysBetween(date, f.holySaturday) >= 0) {
    return { season: "triduum", weekNumber: null };
  }

  // Wielki Post: Środa Popielcowa -> Wielka Środa
  if (daysBetween(f.ashWednesday, date) >= 0 && daysBetween(date, f.holyThursday) > 0) {
    const daysIn = daysBetween(f.ashWednesday, date);
    // Pierwsze cztery dni (Popielec–sobota) należą jeszcze do "tygodnia 0".
    return { season: "wielki_post", weekNumber: daysIn < 4 ? 0 : Math.floor((daysIn - 4) / 7) + 1 };
  }

  // Okres wielkanocny: Wielkanoc -> Zesłanie Ducha Świętego
  if (daysBetween(f.easter, date) >= 0 && daysBetween(date, f.pentecost) >= 0) {
    return { season: "wielkanoc", weekNumber: Math.floor(daysBetween(f.easter, date) / 7) + 1 };
  }

  return { season: "zwykly", weekNumber: ordinaryWeek(date, f, baptism, advent) };
}

/**
 * Numer tygodnia okresu zwykłego. Okres zwykły jest przerwany Wielkim Postem
 * i Wielkanocą: liczy się od poniedziałku po Chrzcie Pańskim, po czym po
 * Zesłaniu Ducha Świętego wraca tak, by 34. tydzień kończył się przed Adwentem
 * (stąd liczenie wstecz od I Niedzieli Adwentu w drugiej części roku).
 */
function ordinaryWeek(date: Date, f: MovableFeasts, baptism: Date, advent: Date): number {
  if (daysBetween(date, f.ashWednesday) > 0) {
    // Pierwsza część: od poniedziałku po Chrzcie Pańskim.
    const daysSinceBaptism = daysBetween(baptism, date);
    return Math.floor((daysSinceBaptism - 1) / 7) + 1;
  }
  // Druga część: 34. tydzień zawsze przylega do Adwentu, więc liczymy wstecz.
  const weeksToAdvent = Math.ceil(daysBetween(date, advent) / 7);
  return Math.max(1, 35 - weeksToAdvent);
}

// ---------------------------------------------------------------------------
// Publiczne API
// ---------------------------------------------------------------------------

const RANK_WEIGHT: Record<LiturgicalRank, number> = {
  uroczystosc: 4,
  swieto: 3,
  niedziela: 2,
  wspomnienie: 1,
};

/** Uroczystości/święta/wspomnienia wypadające danego dnia, od najwyższej rangi. */
export function observancesOn(date: Date): Observance[] {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const toObservance = (o: Observance): Observance => ({
    name: o.name,
    rank: o.rank,
    color: o.color,
    holyDayOfObligation: o.holyDayOfObligation,
  });

  const fixed = FIXED_OBSERVANCES.filter((o) => o.month === month && o.day === day).map(toObservance);

  const movable = movableObservances(date.getFullYear())
    .filter((o) => daysBetween(o.date, date) === 0)
    .map(toObservance);

  // Święta Rodziny nie ma w tablicach powyżej, bo jest ruchome wewnątrz
  // oktawy Bożego Narodzenia: niedziela między 26 a 31 grudnia, a gdy jej nie
  // ma (Boże Narodzenie w niedzielę) — 30 grudnia.
  if (month === 12 && isHolyFamily(date)) {
    movable.push({ name: "Świętej Rodziny: Jezusa, Maryi i Józefa", rank: "swieto", color: "bialy" });
  }

  return [...movable, ...fixed].sort((a, b) => RANK_WEIGHT[b.rank] - RANK_WEIGHT[a.rank]);
}

function isHolyFamily(date: Date): boolean {
  const year = date.getFullYear();
  const christmas = new Date(year, 11, 25);
  if (christmas.getDay() === 0) return date.getMonth() === 11 && date.getDate() === 30;
  const daysToSunday = 7 - christmas.getDay();
  const sunday = addDays(christmas, daysToSunday);
  return daysBetween(sunday, date) === 0 && sunday.getFullYear() === year;
}

/** Domyślny kolor szat dla okresu (gdy dzień nie ma własnego obchodu). */
function seasonColor(season: LiturgicalSeason, weekNumber: number | null, isSunday: boolean): LiturgicalColor {
  switch (season) {
    case "adwent":
      // III Niedziela Adwentu (Gaudete) — różowy.
      return isSunday && weekNumber === 3 ? "rozowy" : "fioletowy";
    case "wielki_post":
      // IV Niedziela Wielkiego Postu (Laetare) — różowy.
      return isSunday && weekNumber === 4 ? "rozowy" : "fioletowy";
    case "boze_narodzenie":
    case "wielkanoc":
    case "triduum":
      return "bialy";
    default:
      return "zielony";
  }
}

function dayName(date: Date, season: LiturgicalSeason, weekNumber: number | null): string {
  const isSunday = date.getDay() === 0;
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const roman = weekNumber && weekNumber > 0 ? ROMAN[weekNumber] : "";

  switch (season) {
    case "adwent":
      return isSunday ? `${roman} Niedziela Adwentu` : `${weekday} ${roman} tygodnia Adwentu`;
    case "wielki_post":
      if (weekNumber === 0) return `${weekday} po Popielcu`;
      return isSunday ? `${roman} Niedziela Wielkiego Postu` : `${weekday} ${roman} tygodnia Wielkiego Postu`;
    case "wielkanoc":
      return isSunday ? `${roman} Niedziela Wielkanocna` : `${weekday} ${roman} tygodnia wielkanocnego`;
    case "boze_narodzenie":
      return `${weekday} okresu Narodzenia Pańskiego`;
    case "triduum":
      return `${weekday} Triduum Paschalnego`;
    default:
      return isSunday ? `${roman} Niedziela zwykła` : `${weekday} ${roman} tygodnia zwykłego`;
  }
}

/** Pełny opis dnia liturgicznego dla daty "YYYY-MM-DD". */
export function getLiturgicalDay(dateKey: string): LiturgicalDay {
  const date = fromDateKey(dateKey);
  const { season, weekNumber } = resolveSeason(date);
  const isSunday = date.getDay() === 0;
  const observances = observancesOn(date);

  // Nazwa i kolor idą za najwyższym obchodem dnia; uroczystość/święto
  // „przykrywa” zwykłą nazwę dnia tygodnia, wspomnienie już nie.
  const top = observances[0];
  const overrides = top && (top.rank === "uroczystosc" || top.rank === "swieto" || (top.rank === "niedziela" && isSunday));

  return {
    date: dateKey,
    season,
    seasonLabel: SEASON_LABELS[season],
    name: overrides ? top.name : dayName(date, season, weekNumber),
    color: overrides ? top.color : seasonColor(season, weekNumber, isSunday),
    observances,
    weekNumber,
    isSunday,
  };
}

/** Dni z obchodem (uroczystość/święto/wspomnienie) w podanym zakresie dat. */
export function observancesBetween(
  startKey: string,
  endKey: string
): Array<{ date: string; observance: Observance; season: LiturgicalSeason }> {
  const out: Array<{ date: string; observance: Observance; season: LiturgicalSeason }> = [];
  const end = fromDateKey(endKey);
  let cursor = fromDateKey(startKey);
  let guard = 0;

  while (daysBetween(cursor, end) >= 0 && guard++ < 4000) {
    const key = toDateKey(cursor);
    const { season } = resolveSeason(cursor);
    for (const observance of observancesOn(cursor)) {
      out.push({ date: key, observance, season });
    }
    cursor = addDays(cursor, 1);
  }
  return out;
}

/** Data w polskim formacie długim, np. „18 sierpnia 2026”. */
export function formatPolishDate(dateKey: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fromDateKey(dateKey));
}

/** Np. „wtorek, 18 sierpnia”. */
export function formatPolishDayAndMonth(dateKey: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(fromDateKey(dateKey));
}
