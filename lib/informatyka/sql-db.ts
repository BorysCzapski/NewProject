// ============================================================================
// lib/informatyka/sql-db.ts
// In-browser SQL for the exam's database tasks: sql.js (SQLite in WebAssembly,
// loaded from a CDN) with the exam data files imported as tables and the most
// common MySQL functions shimmed — the CKE exam uses MySQL/MariaDB, so queries
// written in exam style should run unchanged. Client-side only.
// ============================================================================
import type { LoadedFile } from "@/lib/informatyka/data-files-client";

const SQLJS_VERSION = "1.15.0";
const BASE = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;

interface SqlJsDatabase {
  run(sql: string, params?: unknown[]): void;
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  create_function(name: string, fn: (...args: never[]) => unknown): void;
  close(): void;
}
interface SqlJsStatic {
  Database: new () => SqlJsDatabase;
}
declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

let engine: Promise<SqlJsStatic> | null = null;

function loadEngine(): Promise<SqlJsStatic> {
  engine ??= new Promise<SqlJsStatic>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${BASE}sql-wasm.js`;
    script.onload = () => window.initSqlJs!({ locateFile: (f) => BASE + f }).then(resolve, reject);
    script.onerror = () => {
      engine = null;
      reject(new Error("Nie udało się pobrać silnika SQL (sprawdź połączenie z internetem)."));
    };
    document.head.appendChild(script);
  });
  return engine;
}

// --- MySQL function shims -------------------------------------------------------

const asDate = (v: unknown) => {
  const d = new Date(String(v).slice(0, 10) + "T00:00:00Z");
  return Number.isNaN(d.getTime()) ? null : d;
};
const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));
// sql.js hands every JS number back to SQLite as a REAL, and SQLite renders a REAL to text as
// "2026.0" — so integer-valued results are cleaned up where text is built (CONCAT).
const int = (n: number | null) => (n === null || !Number.isFinite(n) ? null : Math.trunc(n));
const plain = (v: unknown) => (typeof v === "string" && /^-?\d+\.0$/.test(v) ? v.slice(0, -2) : v);

function registerShims(db: SqlJsDatabase) {
  const fn = (name: string, f: (...a: never[]) => unknown) => db.create_function(name, f);
  fn("YEAR", ((v: unknown) => int(asDate(v)?.getUTCFullYear() ?? null)) as never);
  fn("MONTH", ((v: unknown) => int(asDate(v) ? asDate(v)!.getUTCMonth() + 1 : null)) as never);
  fn("DAY", ((v: unknown) => int(asDate(v)?.getUTCDate() ?? null)) as never);
  fn("DAYOFMONTH", ((v: unknown) => int(asDate(v)?.getUTCDate() ?? null)) as never);
  fn("DATEDIFF", ((a: unknown, b: unknown) => {
    const x = asDate(a);
    const y = asDate(b);
    return x && y ? int(Math.round((x.getTime() - y.getTime()) / 86_400_000)) : null;
  }) as never);
  fn("CONCAT", ((...args: unknown[]) => (args.some((a) => a === null) ? null : args.map(plain).join(""))) as never);
  fn("IF", ((c: unknown, a: unknown, b: unknown) => (c ? a : b)) as never);
  fn("IFNULL", ((a: unknown, b: unknown) => (a === null ? b : a)) as never);
  fn("LEFT", ((s: unknown, n: unknown) => (s === null ? null : String(s).slice(0, Number(n)))) as never);
  fn("RIGHT", ((s: unknown, n: unknown) => (s === null ? null : Number(n) <= 0 ? "" : String(s).slice(-Number(n)))) as never);
  fn("SUBSTRING", ((s: unknown, from: unknown, len?: unknown) => {
    if (s === null) return null;
    const str = String(s);
    const start = Number(from) > 0 ? Number(from) - 1 : Math.max(str.length + Number(from), 0);
    return len === undefined ? str.slice(start) : str.slice(start, start + Number(len));
  }) as never);
  fn("CHAR_LENGTH", ((s: unknown) => (s === null ? null : int(String(s).length))) as never);
  fn("LOCATE", ((sub: unknown, s: unknown) => (s === null ? null : int(String(s).indexOf(String(sub)) + 1))) as never);
  fn("FLOOR", ((v: unknown) => (num(v) === null ? null : int(Math.floor(num(v)!)))) as never);
  fn("CEIL", ((v: unknown) => (num(v) === null ? null : int(Math.ceil(num(v)!)))) as never);
  fn("CEILING", ((v: unknown) => (num(v) === null ? null : int(Math.ceil(num(v)!)))) as never);
  fn("SQRT", ((v: unknown) => (num(v) === null ? null : Math.sqrt(num(v)!))) as never);
  fn("POW", ((a: unknown, b: unknown) => Math.pow(Number(a), Number(b))) as never);
  fn("POWER", ((a: unknown, b: unknown) => Math.pow(Number(a), Number(b))) as never);
  fn("MOD", ((a: unknown, b: unknown) => (Number(b) === 0 ? null : Number.isInteger(Number(a) % Number(b)) ? int(Number(a) % Number(b)) : Number(a) % Number(b))) as never);
  fn("CURDATE", (() => new Date().toISOString().slice(0, 10)) as never);
  fn("NOW", (() => new Date().toISOString().slice(0, 19).replace("T", " ")) as never);
}

// --- importing the data files as tables -----------------------------------------

const q = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;

function parseTable(file: LoadedFile) {
  const lines = file.content.split("\n").filter((l) => l.length > 0);
  if (lines.length === 0) return null;
  const delimiter = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
  const columns = lines[0].split(delimiter).map((c) => c.trim());
  const rows = lines.slice(1).map((l) => l.split(delimiter));
  const types = columns.map((_, i) => {
    const values = rows.map((r) => (r[i] ?? "").trim()).filter((v) => v !== "");
    if (values.length === 0) return "TEXT";
    // "007"-style values (PESEL, codes) keep their leading zeros → text
    if (values.some((v) => /^-?0\d/.test(v))) return "TEXT";
    if (values.every((v) => /^-?\d+$/.test(v))) return "INTEGER";
    if (values.every((v) => /^-?\d+(\.\d+)?$/.test(v))) return "REAL";
    return "TEXT";
  });
  return { columns, rows, types };
}

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export interface SqlSession {
  /** Runs one or more statements; returns every result set produced. */
  run(sql: string): QueryResult[];
  tables: { name: string; columns: string[]; rowCount: number }[];
  close(): void;
}

export async function openSession(files: LoadedFile[], extraSchema: string | null): Promise<SqlSession> {
  const SQL = await loadEngine();
  const db = new SQL.Database();
  registerShims(db);

  const tables: SqlSession["tables"] = [];
  for (const file of files) {
    const parsed = parseTable(file);
    if (!parsed) continue;
    const name = file.name.replace(/\.txt$/i, "");
    db.run(`CREATE TABLE ${q(name)} (${parsed.columns.map((c, i) => `${q(c)} ${parsed.types[i]}`).join(", ")})`);
    db.run("BEGIN");
    const insert = `INSERT INTO ${q(name)} VALUES (${parsed.columns.map(() => "?").join(",")})`;
    for (const row of parsed.rows) {
      db.run(
        insert,
        parsed.columns.map((_, i) => {
          const raw = (row[i] ?? "").trim();
          if (parsed.types[i] === "TEXT") return row[i] ?? "";
          return raw === "" ? null : Number(raw);
        })
      );
    }
    db.run("COMMIT");
    tables.push({ name, columns: parsed.columns, rowCount: parsed.rows.length });
  }

  if (extraSchema) {
    db.run(extraSchema);
    for (const [, name] of extraSchema.matchAll(/CREATE TABLE\s+(\w+)/gi)) {
      const info = db.exec(`PRAGMA table_info(${q(name)})`)[0];
      tables.push({ name, columns: (info?.values ?? []).map((r) => String(r[1])), rowCount: 0 });
    }
  }

  return {
    tables,
    run(sql) {
      return db.exec(sql).map((r) => ({ columns: r.columns, rows: r.values }));
    },
    close() {
      db.close();
    },
  };
}
