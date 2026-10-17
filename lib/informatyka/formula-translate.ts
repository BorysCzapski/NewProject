// ============================================================================
// lib/informatyka/formula-translate.ts
// The exam is taken in Polish Excel/Calc (SUMA.JEŻELI, `;` between arguments);
// the in-app spreadsheet (Univer) only knows English names and `,`. This maps
// a formula typed exam-style onto the in-app dialect. Client-safe, pure.
// ============================================================================

/** Polish → English function names (also drives the cheat sheet). */
export const FUNCTION_PAIRS: [pl: string, en: string][] = [
  ["SUMA.ILOCZYNÓW", "SUMPRODUCT"],
  ["SUMA.JEŻELI", "SUMIF"],
  ["SUMY.JEŻELI", "SUMIFS"],
  ["SUMA", "SUM"],
  ["ŚREDNIA.JEŻELI", "AVERAGEIF"],
  ["ŚREDNIA.WARUNKÓW", "AVERAGEIFS"],
  ["ŚREDNIA", "AVERAGE"],
  ["MEDIANA", "MEDIAN"],
  ["MIN", "MIN"],
  ["MAX", "MAX"],
  ["ILE.LICZB", "COUNT"],
  ["ILE.NIEPUSTYCH", "COUNTA"],
  ["LICZ.PUSTE", "COUNTBLANK"],
  ["LICZ.JEŻELI", "COUNTIF"],
  ["LICZ.WARUNKI", "COUNTIFS"],
  ["JEŻELI", "IF"],
  ["ORAZ", "AND"],
  ["LUB", "OR"],
  ["NIE", "NOT"],
  ["ZAOKR.DO.CAŁK", "INT"],
  ["ZAOKR.W.GÓRĘ", "ROUNDUP"],
  ["ZAOKR.W.DÓŁ", "ROUNDDOWN"],
  ["ZAOKR", "ROUND"],
  ["MOD", "MOD"],
  ["ILOCZYN", "PRODUCT"],
  ["MODUŁ.LICZBY", "ABS"],
  ["PIERWIASTEK", "SQRT"],
  ["POTĘGA", "POWER"],
  ["WYSZUKAJ.PIONOWO", "VLOOKUP"],
  ["WYSZUKAJ.POZIOMO", "HLOOKUP"],
  ["PODAJ.POZYCJĘ", "MATCH"],
  ["INDEKS", "INDEX"],
  ["DŁ", "LEN"],
  ["LEWY", "LEFT"],
  ["PRAWY", "RIGHT"],
  ["FRAGMENT.TEKSTU", "MID"],
  ["ZNAJDŹ", "FIND"],
  ["SZUKAJ.TEKSTU", "SEARCH"],
  ["ZŁĄCZ.TEKSTY", "CONCATENATE"],
  ["TEKST", "TEXT"],
  ["ROK", "YEAR"],
  ["MIESIĄC", "MONTH"],
  ["DZIEŃ.TYG", "WEEKDAY"],
  ["DZIEŃ", "DAY"],
  ["DATA", "DATE"],
  ["DZISIAJ", "TODAY"],
  ["PRAWDA", "TRUE"],
  ["FAŁSZ", "FALSE"],
];

const NAME_CHAR = "A-Za-zĄĆĘŁŃÓŚŻŹąćęłńóśżź0-9_.";

const RULES = FUNCTION_PAIRS.filter(([pl, en]) => pl !== en)
  .sort((a, b) => b[0].length - a[0].length)
  .map(([pl, en]) => ({
    // function call: not glued to a longer name on the left, followed by "("
    re: new RegExp(`(?<![${NAME_CHAR}])${pl.replace(/\./g, "\\.")}(?=\\()`, "gi"),
    en,
  }));

/** `;` → `,` outside string literals. */
function swapSeparators(formula: string): string {
  let out = "";
  let inString = false;
  for (const ch of formula) {
    if (ch === '"') inString = !inString;
    out += ch === ";" && !inString ? "," : ch;
  }
  return out;
}

/** Translates an exam-style formula; returns it unchanged when nothing needed translating. */
export function translateFormula(formula: string): string {
  if (!formula.startsWith("=")) return formula;
  // keep string literals out of the name replacement
  const parts = formula.split(/("(?:[^"]|"")*")/);
  const translated = parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      let text = part;
      for (const { re, en } of RULES) text = text.replace(re, en);
      return text;
    })
    .join("");
  return swapSeparators(translated);
}
