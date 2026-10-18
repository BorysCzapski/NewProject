#!/usr/bin/env node
// Runs every reference solution (SQL in scripts/informatyka/reference-sql.json,
// Python in scripts/informatyka/reference-py/<slug>/<label>.py) against the real
// exam data, derives the required answer tokens from the output and stores
// reference code + answer_check on the problems.
//
//   node --experimental-strip-types --no-warnings scripts/informatyka-refs.mjs <scratch> [--dry] [slug ...]
//
// <scratch> holds inf_data/ (unzipped Archive.zip), inf_out/exams.json and sqltest/ (with sql.js).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { createSession } from "../lib/informatyka/sql-db.ts";
import { requiredTokens } from "../lib/informatyka/answer-check.ts";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const args = process.argv.slice(2);
const scratch = args[0];
const dry = args.includes("--dry");
const only = new Set(args.slice(1).filter((a) => !a.startsWith("--")));

const require = createRequire(path.join(scratch, "sqltest", "x.js"));
const SQL = await require("sql.js")();
const exams = JSON.parse(fs.readFileSync(`${scratch}/inf_out/exams.json`, "utf8"));
const folders = JSON.parse(fs.readFileSync(`${HERE}/informatyka/data-folders.json`, "utf8"));
const sqlRefs = JSON.parse(fs.readFileSync(`${HERE}/informatyka/reference-sql.json`, "utf8"));
const pyDir = `${HERE}/informatyka/reference-py`;
const refsMeta = fs.existsSync(`${HERE}/informatyka/reference-meta.json`)
  ? JSON.parse(fs.readFileSync(`${HERE}/informatyka/reference-meta.json`, "utf8"))
  : {};

function walk(d, acc = []) {
  for (const n of fs.readdirSync(d)) {
    if (n === "__MACOSX") continue;
    const f = path.join(d, n);
    if (fs.statSync(f).isDirectory()) walk(f, acc);
    else acc.push(f);
  }
  return acc;
}
function loadFiles(slug) {
  return walk(path.join(scratch, "inf_data", folders[slug]))
    .filter((f) => f.toLowerCase().endsWith(".txt"))
    .map((f) => {
      const buf = fs.readFileSync(f);
      let text;
      try { text = new TextDecoder("utf-8", { fatal: true }).decode(buf); } catch { text = new TextDecoder("windows-1250").decode(buf); }
      return { name: path.basename(f), content: text.replace(/^﻿/, "").replace(/\r\n?/g, "\n") };
    });
}

const cell = (c) => (c === null ? "" : typeof c === "number" && !Number.isInteger(c) ? String(Math.round(c * 100) / 100) : String(c));

function runSql(sql, files, extra) {
  const session = createSession(SQL, files, extra ?? null);
  try {
    const res = session.run(sql);
    const last = res[res.length - 1];
    return last ? last.rows.map((r) => r.map(cell).join(" ")).join("\n") : "";
  } finally {
    session.close();
  }
}

function runPython(code, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "inf-ref-"));
  try {
    for (const f of files) fs.writeFileSync(path.join(dir, f.name), f.content);
    const script = path.join(dir, "__ref__.py");
    fs.writeFileSync(script, code);
    return execFileSync("python3", [script], { cwd: dir, encoding: "utf8", timeout: 120000, maxBuffer: 50 * 1024 * 1024 });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// The answer part of the CKE key (key_text, else what follows "Rozwiązanie"/"Odpowiedź" in the scoring text).
function keyAnswer(p) {
  const strip = (t) => t.replace(/^\s*(Poprawna odpowiedź|Prawidłowa odpowiedź|Odpowiedź)\s*/i, "");
  if (p.key_text && p.key_text.trim()) return strip(p.key_text.trim());
  const m = /(Poprawna odpowiedź|Prawidłowa odpowiedź|Rozwiązanie|Odpowiedź)\s*\n([\s\S]*)$/i.exec(p.scoring_text || "");
  return m ? m[2] : "";
}
function compareWithKey(p, output) {
  const key = new Set(requiredTokens(keyAnswer(p)));
  const mine = new Set(requiredTokens(output));
  if (key.size === 0) return "key?";
  // the key text often breaks long strings across lines: compare with whitespace removed too
  const squash = (t) => t.toLowerCase().replace(/\s+/g, "");
  if (squash(keyAnswer(p)).includes(squash(output)) && squash(output).length > 20) return "key=";
  const missing = [...key].filter((t) => !mine.has(t));
  const extra = [...mine].filter((t) => !key.has(t));
  if (!missing.length && !extra.length) return "key=";
  return `key≠ brak:[${missing.slice(0, 6).join(" ")}] nadmiar:[${extra.slice(0, 6).join(" ")}]`;
}

const updates = [];
for (const exam of exams) {
  if (only.size && !only.has(exam.slug)) continue;
  const files = loadFiles(exam.slug);
  for (const task of exam.tasks) for (const p of task.problems) {
    const sqlRef = sqlRefs[exam.slug]?.[p.label];
    const pyFile = path.join(pyDir, exam.slug, `${p.label}.py`);
    const meta = refsMeta[exam.slug]?.[p.label] ?? {};
    const hasPy = fs.existsSync(pyFile);
    if (!sqlRef && !hasPy) continue;

    const row = { slug: exam.slug, label: p.label, reference_sql: null, reference_code: null, reference_note: meta.note ?? sqlRef?.note ?? null, answer_check: null };
    let output = "";
    try {
      if (sqlRef) {
        row.reference_sql = sqlRef.sql;
        output = runSql(sqlRef.sql, files, p.sql_extra_schema);
      }
      if (hasPy) {
        row.reference_code = fs.readFileSync(pyFile, "utf8");
        output = runPython(row.reference_code, files);
      }
    } catch (e) {
      console.log(`✗ ${exam.slug} ${p.label}: ${String(e.message).split("\n")[0]}`);
      continue;
    }
    const checkable = (sqlRef ? sqlRef.check !== false : meta.check !== false) && output.trim() !== "";
    if (checkable) {
      const alt = sqlRef?.alt ?? meta.alt ?? [];
      row.answer_check = { any: [requiredTokens(output), ...alt] };
    }
    updates.push(row);
    const verdict = compareWithKey(p, output);
    console.log(`${checkable ? "✓" : "·"} ${exam.slug} ${p.label} [${verdict}]  ${(row.answer_check ? row.answer_check.any[0].join(" ") : "(bez sprawdzania)").slice(0, 70)}`);
  }
}

if (dry) {
  console.log(`\n(dry run) ${updates.length} rozwiązań wzorcowych`);
  process.exit(0);
}

// --- store ---------------------------------------------------------------
function loadEnv() {
  let dir = path.resolve(HERE, "..");
  for (let i = 0; i < 6; i++) {
    const f = path.join(dir, ".env.local");
    if (fs.existsSync(f)) {
      for (const raw of fs.readFileSync(f, "utf8").split("\n")) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        let v = line.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (!(line.slice(0, eq).trim() in process.env)) process.env[line.slice(0, eq).trim()] = v;
      }
      return;
    }
    dir = path.dirname(dir);
  }
}
loadEnv();
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: examRows } = await supabase.from("informatyka_exams").select("id, slug");
const examId = new Map(examRows.map((e) => [e.slug, e.id]));
let stored = 0;
for (const u of updates) {
  const { data: tasks } = await supabase.from("informatyka_tasks").select("id").eq("exam_id", examId.get(u.slug));
  const { error, count } = await supabase
    .from("informatyka_problems")
    .update({ reference_sql: u.reference_sql, reference_code: u.reference_code, reference_note: u.reference_note, answer_check: u.answer_check }, { count: "exact" })
    .in("task_id", tasks.map((t) => t.id))
    .eq("label", u.label);
  if (error) throw new Error(`${u.slug} ${u.label}: ${error.message}`);
  stored += count ?? 0;
}
console.log(`\n✓ zapisano ${stored} rozwiązań wzorcowych`);
