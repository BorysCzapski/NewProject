// ============================================================================
// scripts/build-biznes-sheets.mjs
// Turns the printed maturabiz.pl exam sheets (PDF) into lib/biznes/content/
// arkusze.json: sheet -> ordered items (context blocks and tasks with points).
//
//   node scripts/build-biznes-sheets.mjs [dir-with-arkusz1..6.pdf]
//
// The PDFs are task sheets only (no answer key), and charts/diagrams do not
// survive text extraction - every sheet keeps a link to the original page.
// ============================================================================
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const dir = process.argv[2] ?? join(homedir(), "Downloads");
const OUT = new URL("../lib/biznes/content/arkusze.json", import.meta.url);

const NOISE = [
  /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}maturabiz\.pl.*$/,
  /^Page \d+ of \d+https?:.*$/,
  /^Materia$/,
  /^ł$/,
  /^y do nauki BiZu znajdziesz na maturabiz\.pl$/,
  /^KODPESEL$/,
];
const HEADING = /^Zadanie (\d+)\.(?:\s?(\d+)\.)?(?:\s*\((\d+)\s*[–-]\s*(\d+)\))?\s*(.*)$/;

function clean(raw) {
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l) => !NOISE.some((re) => re.test(l)));
  // Re-join hard-wrapped lines: next line continues a sentence when it starts
  // lowercase and the previous one does not end a sentence or a label.
  const out = [];
  for (const l of lines) {
    const prev = out[out.length - 1];
    if (prev !== undefined && l && /^[a-ząćęłńóśźż(]/.test(l) && !/[.:?!;)]$/.test(prev) && !HEADING.test(prev)) {
      out[out.length - 1] = `${prev} ${l}`;
    } else out.push(l);
  }
  return out;
}

function parseSheet(text, index) {
  const lines = clean(text);
  const titleLine = text.split("\n").find((l) => /maturabiz\.pl \|/.test(l)) ?? "";
  const title = titleLine.replace(/^.*maturabiz\.pl \| /, "").trim();
  const slug = (text.match(/maturabiz\.pl\/arkusze\/([a-z0-9-]+)/) ?? [])[1] ?? `arkusz-${index}`;
  const [name, period] = title.split(" - ");

  const items = [];
  let cur = null;
  let preamble = [];
  const flush = () => {
    if (!cur) return;
    cur.text = cur.text.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    items.push(cur);
    cur = null;
  };
  for (const line of lines) {
    const m = line.match(HEADING);
    if (m) {
      flush();
      const [, num, sub, lo, hi, rest] = m;
      const label = sub ? `${num}.${sub}` : num;
      cur = {
        id: `${slug}-z${label.replace(".", "-")}`,
        label,
        number: Number(num),
        kind: hi ? "task" : "context",
        points: hi ? Number(hi) : 0,
        text: rest ? [rest] : [],
      };
    } else if (cur) cur.text.push(line);
    else preamble.push(line);
  }
  flush();

  // Tasks that follow a "Zadanie N." context are its sub-tasks; a standalone
  // task with points is complete by itself.
  const maxPoints = items.reduce((s, it) => s + it.points, 0);
  return {
    slug,
    title: name ?? title,
    period: period ?? "",
    url: `https://maturabiz.pl/arkusze/${slug}`,
    kind: index <= 2 ? "cke" : "autorski",
    maxPoints,
    items: items.filter((it) => it.text.length > 0 || it.kind === "task"),
  };
}

const sheets = [];
for (let i = 1; i <= 6; i++) {
  const data = await pdf(readFileSync(join(dir, `arkusz${i}.pdf`)));
  const sheet = parseSheet(data.text, i);
  console.log(i, sheet.slug, `${sheet.items.length} items, ${sheet.items.filter((x) => x.kind === "task").length} tasks, ${sheet.maxPoints} pkt`);
  sheets.push(sheet);
}
writeFileSync(OUT, JSON.stringify(sheets, null, 1));
