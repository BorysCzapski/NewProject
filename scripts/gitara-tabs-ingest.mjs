#!/usr/bin/env node
// Imports tab PDFs (Guitar Pro exports) into gtr_tabs.
//
//   node scripts/gitara-tabs-ingest.mjs <plik.pdf> [<plik2.pdf> ...]
//
// Each PDF is parsed by scripts/gitara/parse_tab_pdf.py (needs `pip install pymupdf`),
// then upserted by slug (title + artist) with the service-role key, so re-running updates.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

function loadEnv() {
  let dir = REPO;
  for (let i = 0; i < 6; i++) {
    const file = join(dir, ".env.local");
    if (existsSync(file)) {
      for (const raw of readFileSync(file, "utf8").split("\n")) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        let value = line.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        const key = line.slice(0, eq).trim();
        if (!(key in process.env)) process.env[key] = value;
      }
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

const files = process.argv.slice(2);
if (files.length === 0) die("Podaj co najmniej jeden plik PDF.");
loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) die("Brak NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY w .env.local");
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(url, key, { auth: { persistSession: false } });

for (const file of files) {
  const abs = resolve(file);
  if (!existsSync(abs)) die(`Nie ma pliku ${abs}`);
  const out = execFileSync("python3", [join(HERE, "gitara", "parse_tab_pdf.py"), abs], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "inherit"] });
  const tab = JSON.parse(out);
  if (!tab.bars?.length) die(`${file}: nie odczytano żadnego taktu.`);
  // "PLAY EVERY NOTE WITH ARTIFICIAL HARMONIC TECHNIQUE EXCEPT BASS STRINGS": the PDF marks no note
  // individually, so apply the rule here — strings 1-3 are harmonics, sounding 12 frets higher.
  if (tab.note && /artific/i.test(tab.note) && /except bass/i.test(tab.note)) {
    for (const bar of tab.bars) for (const ev of bar.events) for (const n of ev.notes) if (n.s <= 3 && n.f !== undefined && n.ah === undefined) n.ah = n.f + 12;
  }
  const title = tab.title.replace(/\s+/g, " ").trim();
  const niceTitle = title === title.toUpperCase() ? title.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : title;
  const row = {
    slug: slugify(`${niceTitle}-${tab.artist}`),
    title: niceTitle,
    artist: tab.artist,
    arranger: tab.arranger,
    capo: tab.capo,
    tempo: tab.tempo,
    tuning: tab.tuning,
    note: tab.note,
    source_file: tab.source_file,
    bars: tab.bars,
    bar_count: tab.bars.length,
  };
  const { error } = await supabase.from("gtr_tabs").upsert(row, { onConflict: "slug" });
  if (error) die(`${file}: ${error.message}`);
  console.log(`✓ ${row.title} — ${row.artist} (kapodaster ${row.capo}, ${row.bar_count} taktów)`);
}
