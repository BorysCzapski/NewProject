#!/usr/bin/env node
// Jednorazowy import notatnika OneNote (.onepkg) do apki Maturalnik.
//
//   node scripts/maturalnik-ingest.mjs <sciezka-do-pliku.onepkg>
//
// .onepkg to archiwum CAB zawierające po jednym pliku .one na rozdział
// podręcznika. Każdy .one to binarny format OneNote (MS-ONESTORE) — zamiast
// go w pełni parsować, wycinamy bezpośrednio osadzone obrazki JPEG po
// sygnaturach bajtowych (SOI 0xFFD8FF ... EOI 0xFFD9). W tym konkretnym
// notatniku każdy taki obrazek to dokładnie jedno zadanie — podpis
// "Zadanie N.M [źródło, punkty]" jest już wypalony w samym zdjęciu, więc nie
// trzeba go osobno odczytywać (OCR); kolejność wycięcia = kolejność w pliku =
// kolejność zadań w rozdziale (zweryfikowane ręcznie na kilku rozdziałach).
//
// To naiwne cięcie czasem źle wyznacza granicę dwóch sąsiednich obrazków
// (dwa zdjęcia "sklejają się" w jeden uszkodzony blob) — stąd walidacja przez
// sharp() poniżej i flaga flagged_for_review zamiast cichego pominięcia.
//
// Wymaga `cabextract` w PATH (macOS: `brew install cabextract`) i pakietu
// `sharp` (devDependency). Connection string i klucze bierze z .env.local
// (ten sam plik co scripts/db.mjs), uploady idą przez klucz service-role
// wprost do Supabase Storage — to świadomie OMIJA RLS, bo to jedyny sposób
// zapisu do współdzielonych treści, z którego korzysta tylko ten skrypt.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// --- env (kopia loadera z scripts/db.mjs) ------------------------------------

function findEnvFile() {
  let dir = REPO;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, ".env.local");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function loadEnv() {
  const file = findEnvFile();
  if (!file) return null;
  for (const rawLine of readFileSync(file, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
  return file;
}

// --- cięcie JPEG-ów -----------------------------------------------------------

function carveJpegs(buffer) {
  const images = [];
  let i = 0;
  while (true) {
    const start = buffer.indexOf(Buffer.from([0xff, 0xd8, 0xff]), i);
    if (start === -1) break;
    const eoi = buffer.indexOf(Buffer.from([0xff, 0xd9]), start);
    if (eoi === -1) break;
    const end = eoi + 2;
    const blob = buffer.subarray(start, end);
    if (blob.length > 500) images.push(blob);
    i = end;
  }
  return images;
}

// Numer rozdziału z nazwy pliku, np. "10. Geometria analityczna.one" -> 10.
function parseChapter(filename) {
  const match = /^(\d+)\.\s*(.+)\.one$/.exec(filename);
  if (!match) return null;
  return { number: Number(match[1]), title: match[2].trim() };
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- walidacja obrazków (sharp) -----------------------------------------------

// UWAGA: wykrywa tylko strukturalne uszkodzenia (plik się nie dekoduje, albo
// ma zdegenerowane wymiary). "Podwójne naświetlenie" opisane na górze pliku
// to poprawny, dekodowalny JPEG z błędną treścią wizualną — rozmiar bajtowy
// okazał się zawodnym sygnałem (sprawdzony przypadek z rozdziału 16 był tylko
// ~2x mediany rozdziału, a rozmiary legalnych zadań wieloczęściowych wahają
// się w podobnym zakresie), więc nie próbujemy tego zgadywać po rozmiarze.
// Realnym zabezpieczeniem jest ręczny przegląd po imporcie (patrz README apki).
async function validateImage(buffer) {
  const { default: sharp } = await import("sharp");
  try {
    const meta = await sharp(buffer).metadata();
    if (!meta.width || !meta.height) return { ok: false, reason: "brak wymiarów po dekodowaniu" };
    if (meta.width < 100 || meta.height < 20) return { ok: false, reason: `zdegenerowane wymiary ${meta.width}x${meta.height}` };
    // Wszystkie zadania w tym notatniku to poziome kadry (pełna szerokość
    // strony) — kadr wyższy niż szerszy jest prawie na pewno sklejeniem.
    if (meta.height > meta.width) return { ok: false, reason: `pionowy kadr ${meta.width}x${meta.height} (oczekiwano poziomego)` };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `niedekodowalny: ${err.message}` };
  }
}

// Uploady 600+ plików przez sieć czasem łapią przejściowy "fetch failed" —
// zamiast wywalać cały import od zera, próbujemy ponownie z krótkim odstępem.
async function withRetry(fn, { attempts = 4, label = "" } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        const delayMs = 500 * 2 ** i;
        console.log(`\n    ⚠ ${label || "operacja"} nie powiodła się (${err.message}), ponawiam za ${delayMs}ms ...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr;
}

// --- main ----------------------------------------------------------------------

async function main() {
  const onepkgPath = process.argv[2];
  if (!onepkgPath) die("Podaj ścieżkę do pliku .onepkg: node scripts/maturalnik-ingest.mjs <plik.onepkg>");
  const resolvedPath = resolve(onepkgPath);
  if (!existsSync(resolvedPath)) die(`Nie ma pliku ${resolvedPath}`);

  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    die("Brak NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY w .env.local");
  }

  try {
    execFileSync("cabextract", ["-v"], { stdio: "ignore" });
  } catch {
    die("Brak `cabextract` w PATH. Zainstaluj: brew install cabextract");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Rozpakowanie do świeżego, pustego, izolowanego katalogu tymczasowego —
  // .onepkg to nieufny plik pobrany przez użytkownika, nigdy nie
  // rozpakowujemy go do katalogu repo.
  const extractDir = mkdtempSync(join(tmpdir(), "maturalnik-onepkg-"));
  console.log(`\n→ Rozpakowuję ${basename(resolvedPath)} do ${extractDir} ...`);
  try {
    execFileSync("cabextract", ["-d", extractDir, resolvedPath], { stdio: "inherit" });
  } catch (err) {
    rmSync(extractDir, { recursive: true, force: true });
    die(`cabextract nie powiodło się: ${err.message}`);
  }

  const oneFiles = readdirSync(extractDir)
    .filter((f) => f.endsWith(".one"))
    .map((f) => ({ file: f, chapter: parseChapter(f) }))
    .filter((f) => f.chapter !== null)
    .sort((a, b) => a.chapter.number - b.chapter.number);

  if (oneFiles.length === 0) {
    rmSync(extractDir, { recursive: true, force: true });
    die("Nie znaleziono żadnego pliku rozdziału (*.one) w rozpakowanym archiwum.");
  }

  console.log(`\n  Znaleziono ${oneFiles.length} rozdziałów.\n`);

  const summary = [];
  let totalProblems = 0;
  let totalFlagged = 0;

  for (const { file, chapter } of oneFiles) {
    const buffer = readFileSync(join(extractDir, file));
    const images = carveJpegs(buffer);
    const slug = slugify(chapter.title);

    const { data: chapterRow, error: chapterErr } = await supabase
      .from("maturalnik_chapters")
      .upsert(
        { number: chapter.number, slug, title: chapter.title, order_index: chapter.number },
        { onConflict: "number" }
      )
      .select("id")
      .single();
    if (chapterErr) die(`Nie udało się zapisać rozdziału ${chapter.number}: ${chapterErr.message}`);

    let flaggedInChapter = 0;

    process.stdout.write(`  ${String(chapter.number).padStart(2, " ")}. ${chapter.title} — ${images.length} zadań ... `);

    for (let idx = 0; idx < images.length; idx++) {
      const problemNumber = idx + 1;
      const image = images[idx];
      const validation = await validateImage(image);
      const flagged = !validation.ok;
      if (flagged) flaggedInChapter++;

      const path = `${chapter.number}/${problemNumber}.jpg`;
      try {
        await withRetry(
          async () => {
            const { error } = await supabase.storage
              .from("maturalnik-problems")
              .upload(path, image, { contentType: "image/jpeg", upsert: true });
            if (error) throw new Error(error.message);
          },
          { label: `upload ${path}` }
        );
        await withRetry(
          async () => {
            const { error } = await supabase
              .from("maturalnik_problems")
              .upsert(
                { chapter_id: chapterRow.id, number: problemNumber, image_path: path, flagged_for_review: flagged },
                { onConflict: "chapter_id,number" }
              );
            if (error) throw new Error(error.message);
          },
          { label: `zapis ${chapter.number}.${problemNumber}` }
        );
      } catch (err) {
        die(`Zadanie ${chapter.number}.${problemNumber} nie powiodło się po kilku próbach: ${err.message}`);
      }
    }

    totalProblems += images.length;
    totalFlagged += flaggedInChapter;
    summary.push({ chapter: chapter.number, title: chapter.title, count: images.length, flagged: flaggedInChapter });
    console.log(flaggedInChapter > 0 ? `ok (${flaggedInChapter} oflagowane)` : "ok");
  }

  rmSync(extractDir, { recursive: true, force: true });

  console.log(`\n  Zaimportowano ${totalProblems} zadań w ${oneFiles.length} rozdziałach.`);
  if (totalFlagged > 0) {
    console.log(`  ⚠ ${totalFlagged} zadań oflagowanych do ręcznego przeglądu (obraz może być uszkodzony):`);
    for (const s of summary) {
      if (s.flagged > 0) console.log(`    - rozdział ${s.chapter} (${s.title}): ${s.flagged}`);
    }
  }
  console.log("");
}

main().catch((err) => die(err.stack ?? err.message));
