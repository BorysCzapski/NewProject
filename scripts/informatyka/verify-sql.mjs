// Runs reference SQL against the real exam data with the app's own SQL layer
// (lib/informatyka/sql-db.ts, shims included) and prints the result, so it can
// be compared with the CKE key.
//   node --experimental-strip-types scripts/informatyka/verify-sql.mjs <scratch> <slug> [label]
// <scratch> holds inf_out/exams.json, inf_data/ and sqlrefs/<slug>.json ({label: sql}).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createSession } from "../../lib/informatyka/sql-db.ts";

const [scratch, slug, only] = process.argv.slice(2);
const require = createRequire(path.join(scratch, "sqltest", "x.js"));
const initSqlJs = require("sql.js");
const SQL = await initSqlJs();
const exams = JSON.parse(fs.readFileSync(`${scratch}/inf_out/exams.json`, "utf8"));
const folders = JSON.parse(fs.readFileSync(new URL("./data-folders.json", import.meta.url), "utf8"));
const refs = JSON.parse(fs.readFileSync(`${scratch}/sqlrefs/${slug}.json`, "utf8"));
const exam = exams.find((e) => e.slug === slug);

function walk(d, acc = []) {
  for (const n of fs.readdirSync(d)) {
    if (n === "__MACOSX") continue;
    const f = path.join(d, n);
    if (fs.statSync(f).isDirectory()) walk(f, acc);
    else acc.push(f);
  }
  return acc;
}
const files = walk(path.join(scratch, "inf_data", folders[slug]))
  .filter((f) => f.toLowerCase().endsWith(".txt"))
  .map((f) => {
    const buf = fs.readFileSync(f);
    let text;
    try { text = new TextDecoder("utf-8", { fatal: true }).decode(buf); } catch { text = new TextDecoder("windows-1250").decode(buf); }
    return { name: path.basename(f), content: text.replace(/^﻿/, "").replace(/\r\n?/g, "\n") };
  });

for (const task of exam.tasks) for (const p of task.problems) {
  if (only && p.label !== only) continue;
  const sql = refs[p.label];
  if (!sql) continue;
  const session = createSession(SQL, files, p.sql_extra_schema ?? null);
  try {
    const res = session.run(sql);
    const last = res[res.length - 1];
    console.log(`\n### ${slug} ${p.label} — ${last ? last.rows.length : 0} rows`);
    if (last) {
      console.log(last.columns.join(" | "));
      for (const r of last.rows.slice(0, 40)) console.log(r.map((c) => (c === null ? "NULL" : String(c))).join(" | "));
      if (last.rows.length > 40) console.log(`… (+${last.rows.length - 40})`);
    }
  } catch (e) {
    console.log(`\n### ${slug} ${p.label} — ERROR: ${e.message}`);
  }
  session.close();
}
