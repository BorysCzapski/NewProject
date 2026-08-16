#!/usr/bin/env node
// Runner migracji i skryptów SQL dla bazy Supabase (Postgres).
//
//   node scripts/db.mjs status              — co jest wgrane, co czeka
//   node scripts/db.mjs baseline            — oznacz istniejące migracje jako wgrane (nie wykonuje SQL)
//   node scripts/db.mjs up [--dry-run]      — wgraj oczekujące migracje po kolei
//   node scripts/db.mjs sql <plik.sql>      — wykonaj dowolny plik (np. seed); nie zapisuje się w rejestrze
//   node scripts/db.mjs query "select ..."  — jednorazowe zapytanie, wynik jako tabela
//
// Connection string bierze z SUPABASE_DB_URL w .env.local (szukanym w górę od cwd).
// Dashboard Supabase -> Project Settings -> Database -> Connection string -> Session pooler.
//
// Każda migracja leci w transakcji i jest zapisywana w public._migrations wraz z sumą
// kontrolną pliku. Plik z komentarzem `-- no-transaction` w pierwszych liniach albo z własnym
// BEGIN/COMMIT jest puszczany bez zewnętrznej transakcji (np. CREATE INDEX CONCURRENTLY).

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const MIGRATIONS_DIR = join(REPO, 'supabase', 'migrations')

function die(msg) {
  console.error(`\n✗ ${msg}\n`)
  process.exit(1)
}

// --- env --------------------------------------------------------------------

// Szuka .env.local w górę od katalogu skryptu — dzięki temu działa też z worktree
// (.claude/worktrees/<nazwa>/), gdzie pliku env nie ma, ale jest w głównym checkoucie.
function findEnvFile() {
  let dir = REPO
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, '.env.local')
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

function loadEnv() {
  const file = findEnvFile()
  if (!file) return null
  for (const rawLine of readFileSync(file, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
  return file
}

function connectionString() {
  const envFile = loadEnv()
  const url = process.env.SUPABASE_DB_URL
  if (!url) {
    die(
      `Brak SUPABASE_DB_URL${envFile ? ` w ${envFile}` : ' (nie znaleziono .env.local)'}.\n` +
        '  Supabase -> Project Settings -> Database -> Connection string -> Session pooler,\n' +
        '  podmień [YOUR-PASSWORD] na hasło i wpisz jako SUPABASE_DB_URL=... w .env.local',
    )
  }
  if (url.includes(':6543')) {
    console.warn(
      '⚠ Port 6543 to transaction pooler — nie obsługuje wieloetapowych transakcji.\n' +
        '  Do migracji użyj session poolera (port 5432).',
    )
  }
  return url
}

// --- postgres ---------------------------------------------------------------

async function connect() {
  let pg
  try {
    pg = await import('pg')
  } catch {
    die("Brak zależności 'pg'. Zainstaluj: npm install pg")
  }
  const client = new pg.default.Client({
    connectionString: connectionString(),
    // Pooler Supabase podaje certyfikat spoza domyślnego store'a Node — połączenie jest
    // szyfrowane, ale bez weryfikacji łańcucha CA.
    ssl: { rejectUnauthorized: false },
    application_name: 'scripts/db.mjs',
  })
  await client.connect()
  return client
}

const LEDGER_DDL = `
create table if not exists public._migrations (
  version    text primary key,
  name       text not null,
  checksum   text not null,
  applied_at timestamptz not null default now()
);
alter table public._migrations enable row level security;
revoke all on public._migrations from anon, authenticated;
`

async function ensureLedger(client) {
  await client.query(LEDGER_DDL)
}

// --- migracje ---------------------------------------------------------------

function listMigrations() {
  if (!existsSync(MIGRATIONS_DIR)) die(`Brak katalogu ${MIGRATIONS_DIR}`)
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((file) => {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
      const match = /^(\d+)[_-]?(.*)\.sql$/.exec(file)
      return {
        file,
        path: join(MIGRATIONS_DIR, file),
        version: match ? match[1] : basename(file, '.sql'),
        name: match ? match[2] : basename(file, '.sql'),
        sql,
        checksum: createHash('sha256').update(sql).digest('hex').slice(0, 16),
      }
    })
}

async function appliedMap(client) {
  const { rows } = await client.query(
    'select version, checksum, applied_at from public._migrations',
  )
  return new Map(rows.map((r) => [r.version, r]))
}

// Plik sam steruje transakcją, albo prosi o jej brak (CREATE INDEX CONCURRENTLY itp.).
function managesOwnTransaction(sql) {
  return /^\s*--\s*no-transaction/im.test(sql) || /^\s*begin\s*;/im.test(sql)
}

async function runSql(client, sql, { wrap }) {
  if (!wrap) {
    await client.query(sql)
    return
  }
  await client.query('begin')
  try {
    await client.query(sql)
    await client.query('commit')
  } catch (err) {
    await client.query('rollback').catch(() => {})
    throw err
  }
}

// --- komendy ----------------------------------------------------------------

async function cmdStatus() {
  const client = await connect()
  try {
    await ensureLedger(client)
    const applied = await appliedMap(client)
    const migrations = listMigrations()
    let pending = 0
    let drifted = 0
    console.log('')
    for (const m of migrations) {
      const row = applied.get(m.version)
      if (!row) {
        pending++
        console.log(`  ○ oczekuje   ${m.file}`)
      } else if (row.checksum !== m.checksum) {
        drifted++
        console.log(`  ! zmieniony  ${m.file}  (plik różni się od tego, co wgrano)`)
      } else {
        console.log(`  ● wgrany     ${m.file}  ${row.applied_at.toISOString().slice(0, 10)}`)
      }
    }
    console.log(
      `\n  ${migrations.length} migracji: ${migrations.length - pending - drifted} wgranych, ` +
        `${pending} oczekuje${drifted ? `, ${drifted} zmienionych po wgraniu` : ''}\n`,
    )
  } finally {
    await client.end()
  }
}

async function cmdBaseline() {
  const client = await connect()
  try {
    await ensureLedger(client)
    const applied = await appliedMap(client)
    const migrations = listMigrations()
    const fresh = migrations.filter((m) => !applied.has(m.version))
    if (fresh.length === 0) {
      console.log('\n  Rejestr już zawiera wszystkie migracje — nic do zrobienia.\n')
      return
    }
    for (const m of fresh) {
      await client.query(
        'insert into public._migrations (version, name, checksum) values ($1, $2, $3)',
        [m.version, m.name, m.checksum],
      )
      console.log(`  ✓ oznaczono jako wgrane (bez wykonania): ${m.file}`)
    }
    console.log(`\n  ${fresh.length} migracji zapisano w rejestrze.\n`)
  } finally {
    await client.end()
  }
}

async function cmdUp({ dryRun }) {
  const client = await connect()
  try {
    await ensureLedger(client)
    const applied = await appliedMap(client)
    const pending = listMigrations().filter((m) => !applied.has(m.version))
    if (pending.length === 0) {
      console.log('\n  Brak oczekujących migracji.\n')
      return
    }
    console.log('')
    for (const m of pending) {
      if (dryRun) {
        console.log(`  ○ (dry-run) pominięto ${m.file} — ${m.sql.split('\n').length} linii SQL`)
        continue
      }
      const wrap = !managesOwnTransaction(m.sql)
      process.stdout.write(`  → ${m.file}${wrap ? '' : ' (bez transakcji)'} ... `)
      try {
        await runSql(client, m.sql, { wrap })
        await client.query(
          'insert into public._migrations (version, name, checksum) values ($1, $2, $3)',
          [m.version, m.name, m.checksum],
        )
        console.log('ok')
      } catch (err) {
        console.log('BŁĄD')
        die(`${m.file}: ${err.message}${err.hint ? `\n  hint: ${err.hint}` : ''}`)
      }
    }
    console.log(`\n  Wgrano ${dryRun ? 0 : pending.length} migracji.\n`)
  } finally {
    await client.end()
  }
}

async function cmdSqlFile(target) {
  if (!target) die('Podaj ścieżkę do pliku .sql')
  const path = resolve(process.cwd(), target)
  if (!existsSync(path)) die(`Nie ma pliku ${path}`)
  const sql = readFileSync(path, 'utf8')
  const client = await connect()
  try {
    const wrap = !managesOwnTransaction(sql)
    process.stdout.write(`\n  → ${target}${wrap ? '' : ' (bez transakcji)'} ... `)
    await runSql(client, sql, { wrap })
    console.log('ok\n')
  } catch (err) {
    console.log('BŁĄD')
    die(`${target}: ${err.message}${err.hint ? `\n  hint: ${err.hint}` : ''}`)
  } finally {
    await client.end()
  }
}

async function cmdQuery(sql) {
  if (!sql) die('Podaj zapytanie, np: node scripts/db.mjs query "select count(*) from profiles"')
  const client = await connect()
  try {
    const result = await client.query(sql)
    const rows = Array.isArray(result) ? result[result.length - 1].rows : result.rows
    if (!rows || rows.length === 0) {
      console.log('\n  (brak wierszy)\n')
      return
    }
    console.log('')
    console.table(rows)
    console.log('')
  } finally {
    await client.end()
  }
}

// --- main -------------------------------------------------------------------

const [command, ...rest] = process.argv.slice(2)
const flags = new Set(rest.filter((a) => a.startsWith('--')))
const positional = rest.filter((a) => !a.startsWith('--'))

try {
  switch (command) {
    case 'status':
      await cmdStatus()
      break
    case 'baseline':
      await cmdBaseline()
      break
    case 'up':
      await cmdUp({ dryRun: flags.has('--dry-run') })
      break
    case 'sql':
      await cmdSqlFile(positional[0])
      break
    case 'query':
      await cmdQuery(positional[0])
      break
    default:
      console.log(
        [
          '',
          'Użycie: node scripts/db.mjs <komenda>',
          '',
          '  status              co jest wgrane, co czeka',
          '  baseline            oznacz obecne migracje jako wgrane (nie wykonuje SQL)',
          '  up [--dry-run]      wgraj oczekujące migracje',
          '  sql <plik.sql>      wykonaj dowolny plik SQL (np. seed)',
          '  query "select ..."  jednorazowe zapytanie',
          '',
        ].join('\n'),
      )
      process.exit(command ? 1 : 0)
  }
} catch (err) {
  die(err.message)
}
