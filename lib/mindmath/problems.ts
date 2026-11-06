// ============================================================================
// lib/mindmath/problems.ts
// Czyste generatory zadań do treningu rachunku w głowie (bez I/O). Każdy tryb
// odpowiada technice z lib/mindmath/techniques.ts. `rng` jest parametrem, żeby
// generator był deterministyczny w testach; w aplikacji losujemy dopiero po
// kliknięciu "Start" (nigdy podczas renderu — Math.random rozjechałby hydratację).
// ============================================================================
export type Rng = () => number;
export type Level = 1 | 2 | 3;

export interface Problem {
  text: string;
  answer: number;
}

export interface ModeInfo {
  id: string;
  label: string;
  hint: string;
}

export const MODES: ModeInfo[] = [
  { id: "mix", label: "Mieszanka", hint: "Losowe zadania ze wszystkich trybów" },
  { id: "add", label: "Dodawanie", hint: "Dopełnianie do dziesiątek i setek" },
  { id: "chain", label: "Ciąg liczb", hint: "Dodawanie kilku liczb po kolei" },
  { id: "from9", label: "Odejmowanie od 100, 1000…", hint: "Wszystko od 9, ostatnie od 10" },
  { id: "times11", label: "Razy 11", hint: "Suma sąsiednich cyfr" },
  { id: "square5", label: "Kwadraty liczb na 5", hint: "n(n+1) i 25" },
  { id: "near100", label: "Blisko 100", hint: "Metoda braków (Nikhilam)" },
  { id: "vertcross", label: "Pionowo i na krzyż", hint: "Dwucyfrowe × dwucyfrowe" },
  { id: "diffsq", label: "Różnica kwadratów", hint: "(a − b)(a + b)" },
  { id: "times5", label: "Razy 5, 25, 125", hint: "Mnożenie przez 10, 100, 1000 i dzielenie" },
  { id: "times9", label: "Razy 9, 99", hint: "Razy 10 (100) minus liczba" },
  { id: "fingers", label: "Tabliczka 6–9", hint: "Metoda palców" },
  { id: "digitsum", label: "Suma cyfr", hint: "Pierwiastek cyfrowy (reszta z 9)" },
];

export const MODE_IDS = MODES.map((m) => m.id);
export const LEVELS: Level[] = [1, 2, 3];

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

function digitalRoot(n: number): number {
  return n === 0 ? 0 : 1 + ((n - 1) % 9);
}

type Gen = (rng: Rng, level: Level) => Problem;

const GENERATORS: Record<string, Gen> = {
  add: (rng, level) => {
    const [a, b] = level === 1 ? [int(rng, 11, 99), int(rng, 11, 99)] : level === 2 ? [int(rng, 101, 999), int(rng, 11, 99)] : [int(rng, 101, 999), int(rng, 101, 999)];
    return { text: `${a} + ${b}`, answer: a + b };
  },
  chain: (rng, level) => {
    const count = level === 1 ? 4 : level === 2 ? 5 : 6;
    const max = level === 1 ? 9 : 49;
    const nums = Array.from({ length: count }, () => int(rng, level === 1 ? 2 : 6, max));
    return { text: nums.join(" + "), answer: nums.reduce((s, n) => s + n, 0) };
  },
  from9: (rng, level) => {
    const base = level === 1 ? 100 : level === 2 ? 1000 : 10000;
    const n = int(rng, Math.floor(base / 10) + 1, base - 1);
    return { text: `${base} − ${n}`, answer: base - n };
  },
  times11: (rng, level) => {
    const n = level === 3 ? int(rng, 100, 999) : int(rng, 12, 99);
    return { text: `${n} × 11`, answer: n * 11 };
  },
  square5: (rng, level) => {
    const tens = level === 1 ? int(rng, 1, 9) : level === 2 ? int(rng, 10, 19) : int(rng, 20, 49);
    const n = tens * 10 + 5;
    return { text: `${n}²`, answer: n * n };
  },
  near100: (rng, level) => {
    let a: number;
    let b: number;
    if (level === 1) [a, b] = [int(rng, 91, 99), int(rng, 91, 99)];
    else if (level === 2) [a, b] = [int(rng, 86, 99), int(rng, 86, 99)];
    else [a, b] = [int(rng, 101, 115), int(rng, 101, 115)];
    return { text: `${a} × ${b}`, answer: a * b };
  },
  vertcross: (rng, level) => {
    const max = level === 1 ? 30 : level === 2 ? 60 : 99;
    const a = int(rng, 11, max);
    const b = int(rng, 11, max);
    return { text: `${a} × ${b}`, answer: a * b };
  },
  diffsq: (rng, level) => {
    const base = level === 3 ? int(rng, 4, 19) * 5 : int(rng, 2, 9) * 10;
    const d = level === 1 ? int(rng, 1, 3) : int(rng, 1, 7);
    return { text: `${base - d} × ${base + d}`, answer: base * base - d * d };
  },
  times5: (rng, level) => {
    if (level === 1) {
      const n = int(rng, 6, 48) * 2;
      return { text: `${n} × 5`, answer: n * 5 };
    }
    if (level === 2) {
      const n = int(rng, 3, 40) * 4;
      return { text: `${n} × 25`, answer: n * 25 };
    }
    const n = int(rng, 3, 30) * 8;
    return { text: `${n} × 125`, answer: n * 125 };
  },
  times9: (rng, level) => {
    const n = level === 3 ? int(rng, 100, 499) : int(rng, 12, 99);
    const k = level === 1 ? 9 : 99;
    return { text: `${n} × ${k}`, answer: n * k };
  },
  fingers: (rng, level) => {
    const a = int(rng, 6, level === 1 ? 8 : 9);
    const b = int(rng, 6, level === 1 ? 8 : 9);
    return { text: `${a} × ${b}`, answer: a * b };
  },
  digitsum: (rng, level) => {
    const n = level === 1 ? int(rng, 100, 9999) : level === 2 ? int(rng, 10000, 99999) : int(rng, 100000, 9999999);
    return { text: `Suma cyfr liczby ${n}, aż zostanie jedna cyfra`, answer: digitalRoot(n) };
  },
};

const MIXABLE = MODE_IDS.filter((id) => id !== "mix");

export function generateProblem(mode: string, level: Level, rng: Rng = Math.random): Problem {
  const id = mode === "mix" || !(mode in GENERATORS) ? MIXABLE[int(rng, 0, MIXABLE.length - 1)] : mode;
  return GENERATORS[id](rng, level);
}

export function generateSession(mode: string, level: Level, count: number, rng: Rng = Math.random): Problem[] {
  return Array.from({ length: count }, () => generateProblem(mode, level, rng));
}
