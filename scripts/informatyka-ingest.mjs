#!/usr/bin/env node
// Jednorazowy (idempotentny) import arkuszy maturalnych z informatyki do apki Informatyka.
//
//   python3 scripts/informatyka/extract_pdfs.py <katalog-z-pdfami> <out-dir>
//   node scripts/informatyka-ingest.mjs <out-dir> <Archive.zip>
//
// <out-dir> to wynik extract_pdfs.py (exams.json + images/). Z archiwum z
// danymi CKE bierzemy pliki wskazane w scripts/informatyka/data-folders.json
// (folder -> sesja). Zip rozpakowywany jest do izolowanego katalogu
// tymczasowego (nieufny plik), a `__MACOSX` pomijany. Wycinki PDF lądują w
// prywatnym buckecie `informatyka-pages`, reszta w tabelach informatyka_*.
// Uploady idą kluczem service-role (omija RLS — to jedyna droga zapisu
// współdzielonych treści). Można uruchamiać wielokrotnie: wszystko to upsert.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// --- env (kopia loadera z scripts/db.mjs) ------------------------------------

function loadEnv() {
  let dir = REPO;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, ".env.local");
    if (existsSync(candidate)) {
      for (const rawLine of readFileSync(candidate, "utf8").split("\n")) {
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
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

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

// --- pliki danych -------------------------------------------------------------

// Pliki CKE bywają w UTF-8 albo w Windows-1250; BOM i CRLF usuwamy.
function decodeText(buffer) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    text = new TextDecoder("windows-1250").decode(buffer);
  }
  return text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "__MACOSX" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function loadSessionFiles(root, folder) {
  const dir = join(root, folder);
  if (!existsSync(dir)) return null;
  const files = new Map(); // lowercased name -> { name, content }
  for (const file of walk(dir)) {
    const name = file.slice(file.lastIndexOf("/") + 1);
    if (!name.toLowerCase().endsWith(".txt")) continue;
    files.set(name.toLowerCase(), { name, content: decodeText(readFileSync(file)) });
  }
  return files;
}

// Które pliki danych otwiera dane podzadanie: wymienione w treści (+ ich
// warianty *_przyklad); gdy treść żadnego nie wymienia (np. "z poprzedniego
// zadania"), wszystkie pliki zadania.
function dataFilesFor(problem, task, files) {
  const pick = (names) => {
    const out = new Set();
    for (const raw of names) {
      const key = raw.toLowerCase();
      if (files.has(key)) out.add(files.get(key).name);
      const base = key.replace(/\.txt$/, "");
      const example = `${base}_przyklad.txt`;
      if (files.has(example)) out.add(files.get(example).name);
    }
    return [...out];
  };
  const own = pick(problem.mentioned_files ?? []);
  if (own.length) return own;
  const union = new Set();
  for (const p of task.problems) for (const n of pick(p.mentioned_files ?? [])) union.add(n);
  return [...union];
}

// --- main ----------------------------------------------------------------------

async function main() {
  const outDirArg = process.argv[2];
  const zipArg = process.argv[3];
  if (!outDirArg || !zipArg) die("Użycie: node scripts/informatyka-ingest.mjs <out-dir> <Archive.zip>");
  const outDir = resolve(outDirArg);
  const zipPath = resolve(zipArg);
  if (!existsSync(join(outDir, "exams.json"))) die(`Brak ${join(outDir, "exams.json")} — uruchom najpierw extract_pdfs.py`);
  if (!existsSync(zipPath)) die(`Nie ma pliku ${zipPath}`);

  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) die("Brak NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY w .env.local");

  const exams = JSON.parse(readFileSync(join(outDir, "exams.json"), "utf8"));
  const folders = JSON.parse(readFileSync(join(HERE, "informatyka", "data-folders.json"), "utf8"));

  const dataRoot = mkdtempSync(join(tmpdir(), "informatyka-data-"));
  console.log(`\n→ Rozpakowuję ${zipPath} do ${dataRoot} ...`);
  try {
    execFileSync("unzip", ["-q", "-o", zipPath, "-x", "__MACOSX/*", "*/.DS_Store", "-d", dataRoot], { stdio: "inherit" });
  } catch (err) {
    rmSync(dataRoot, { recursive: true, force: true });
    die(`unzip nie powiodło się: ${err.message}`);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const report = [];
  const imageCache = new Map();

  async function uploadImage(rel) {
    if (imageCache.has(rel)) return imageCache.get(rel);
    const abs = join(outDir, rel);
    if (!existsSync(abs)) die(`Brak obrazu ${abs}`);
    const storagePath = rel.replace(/^images\//, "");
    const buffer = readFileSync(abs);
    await withRetry(
      async () => {
        const { error } = await supabase.storage
          .from("informatyka-pages")
          .upload(storagePath, buffer, { contentType: "image/png", upsert: true });
        if (error) throw new Error(error.message);
      },
      { label: `upload ${storagePath}` }
    );
    imageCache.set(rel, storagePath);
    return storagePath;
  }

  async function upload(rels) {
    const out = [];
    for (const rel of rels ?? []) out.push(await uploadImage(rel));
    return out;
  }

  for (const exam of exams) {
    process.stdout.write(`  ${exam.slug.padEnd(22)} `);
    const { data: examRow, error: examErr } = await supabase
      .from("informatyka_exams")
      .upsert(
        {
          slug: exam.slug,
          year: exam.year,
          session: exam.session,
          formula: exam.formula,
          title: exam.title,
          exam_date: exam.exam_date,
          duration_minutes: exam.duration_minutes,
          max_points: exam.max_points,
          order_index: exam.order,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (examErr) die(`Sesja ${exam.slug}: ${examErr.message}`);

    // pliki danych sesji
    const folder = folders[exam.slug];
    const files = folder ? loadSessionFiles(dataRoot, folder) : null;
    if (!files) console.log(`\n    ⚠ brak folderu danych dla ${exam.slug} (${folder ?? "nie zmapowany"})`);
    const sessionFiles = files ?? new Map();
    const fileRows = [...sessionFiles.values()].map((f) => ({
      exam_id: examRow.id,
      name: f.name,
      content: f.content,
      is_example: /_przyklad\.txt$/i.test(f.name),
    }));
    if (fileRows.length) {
      await withRetry(
        async () => {
          const { error } = await supabase.from("informatyka_data_files").upsert(fileRows, { onConflict: "exam_id,name" });
          if (error) throw new Error(error.message);
        },
        { label: `pliki ${exam.slug}` }
      );
    }

    const used = new Set();
    const missing = new Set();
    let problemCount = 0;

    for (const task of exam.tasks) {
      const { data: taskRow, error: taskErr } = await supabase
        .from("informatyka_tasks")
        .upsert(
          {
            exam_id: examRow.id,
            number: task.number,
            part: task.part,
            title: task.title ?? "",
            intro_image_paths: await upload(task.intro_images),
          },
          { onConflict: "exam_id,number" }
        )
        .select("id")
        .single();
      if (taskErr) die(`Zadanie ${exam.slug}/${task.number}: ${taskErr.message}`);

      for (const problem of task.problems) {
        for (const m of problem.mentioned_files ?? []) {
          if (!sessionFiles.has(m.toLowerCase())) missing.add(m);
        }
        const dataFiles = dataFilesFor(problem, task, sessionFiles);
        dataFiles.forEach((n) => used.add(n.toLowerCase()));
        const row = {
          task_id: taskRow.id,
          label: problem.label,
          order_index: problem.order,
          points_max: problem.points_max,
          kind: problem.kind,
          topic: problem.topic,
          statement_image_paths: await upload(problem.statement_images),
          key_image_paths: await upload(problem.key_images),
          scoring_text: problem.scoring_text ?? "",
          key_text: problem.key_text ?? "",
          result_file: problem.result_file,
          data_files: dataFiles,
          sql_extra_schema: problem.sql_extra_schema ?? null,
          needs_review: Boolean(problem.needs_review),
        };
        await withRetry(
          async () => {
            const { error } = await supabase.from("informatyka_problems").upsert(row, { onConflict: "task_id,label" });
            if (error) throw new Error(error.message);
          },
          { label: `zadanie ${exam.slug}/${problem.label}` }
        );
        problemCount++;
      }
    }

    const orphans = [...sessionFiles.keys()].filter((k) => !used.has(k) && !k.endsWith("_przyklad.txt"));
    report.push({ slug: exam.slug, tasks: exam.tasks.length, problems: problemCount, files: fileRows.length, missing: [...missing], orphans });
    console.log(`ok (${exam.tasks.length} zadań, ${problemCount} podzadań, ${fileRows.length} plików)`);
  }

  rmSync(dataRoot, { recursive: true, force: true });

  console.log("\n— Raport —");
  for (const r of report) {
    if (r.missing.length) console.log(`  ${r.slug}: wspomniane w treści, ale bez pliku: ${r.missing.join(", ")}`);
    if (r.orphans.length) console.log(`  ${r.slug}: pliki nieprzypisane do żadnego zadania: ${r.orphans.join(", ")}`);
  }
  console.log(
    `\n✓ ${report.length} sesji, ${report.reduce((s, r) => s + r.problems, 0)} podzadań, ${report.reduce((s, r) => s + r.files, 0)} plików danych.\n`
  );
}

main().catch((err) => die(err.stack ?? String(err)));
