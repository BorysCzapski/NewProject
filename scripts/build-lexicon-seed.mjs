#!/usr/bin/env node
// Buduje supabase/seed/lexicon/01_daily_words.sql (EF) i 02_phrasal_verbs.sql (UMN) z surowych list
// (supabase/seed/lexicon/ef-top-3000.txt, jedno hasło na linię, kolejność = ranga częstości).
//
//   node scripts/build-lexicon-seed.mjs
//
// Pomija wpisy, które nie są słowami do nauki (skróty, wykrzyknik-chrząknięcie,
// końcówka "n't", tytuły grzecznościowe) oraz wulgaryzm. Ranga pozostaje
// pozycją z oryginalnej listy, więc pominięcia zostawiają dziury, nie przesuwają reszty.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIR = join(resolve(HERE, '..'), 'supabase', 'seed', 'lexicon')

const SKIP = new Set(["n't", 'mm-hmm', 'ie', 'etc', 'AM', 'PM', 'vs', 'Mr', 'Mrs', 'Ms', 'shit'])

const lines = readFileSync(join(DIR, 'ef-top-3000.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)

const rows = []
const skipped = []
lines.forEach((term, i) => {
  if (SKIP.has(term)) skipped.push(term)
  else rows.push({ rank: i + 1, term })
})

const q = (s) => `'${s.replace(/'/g, "''")}'`

const sql = `-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Źródło: EF English Resources, "Top 3000 words"
-- (https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/).
-- ${rows.length} haseł; pominięte (nie-słowa/wulgaryzm): ${skipped.join(', ')}.
-- Tłumaczenia i przykłady dopisuje AI przy pierwszym użyciu (lib/lexicon/enrich.ts).
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'ef-top-3000',
  'Codzienne słówka',
  '3000 najczęstszych angielskich słów, od najpopularniejszych',
  'word',
  'EF English Resources — Top 3000 words',
  'https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/',
  1
)
on conflict (slug) do nothing;

insert into lexicon_entries (deck_id, rank, term)
select d.id, v.rank, v.term
from lexicon_decks d
cross join (values
${rows.map((r) => `  (${r.rank}, ${q(r.term)})`).join(',\n')}
) as v(rank, term)
where d.slug = 'ef-top-3000'
on conflict (deck_id, term) do nothing;
`
writeFileSync(join(DIR, '01_daily_words.sql'), sql)
console.log(`✓ EF: ${rows.length} haseł, pominięto ${skipped.length}: ${skipped.join(', ')}`)

// --- UMN: 150 most common phrasal verbs ------------------------------------
// Linia: "* Back up: sens; sens; sens". Hasło zapisujemy małymi literami,
// definicję dosłownie (łącznie z literówkami ze strony źródłowej).
const umn = readFileSync(join(DIR, 'umn-phrasal-verbs.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .map((line, i) => {
    const m = line.match(/^\*\s*([^:]+):\s*(.+)$/)
    if (!m) throw new Error(`Nie umiem sparsować linii ${i + 1}: ${line}`)
    return { rank: i + 1, term: m[1].trim().toLowerCase(), definition: m[2].trim() }
  })
const seenTerms = new Set()
for (const r of umn) {
  if (seenTerms.has(r.term)) throw new Error(`Duplikat hasła: ${r.term}`)
  seenTerms.add(r.term)
}

const phrasalSql = `-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Źródło: University of Minnesota CCAPS, "150 Most Common Phrasal Verbs"
-- (https://ccaps.umn.edu/esl-resources/students/vocabulary/150-most-common-phrasal-verbs).
-- ${umn.length} czasowników frazowych z angielskimi znaczeniami ze źródła (definition_en).
-- Polskie tłumaczenia i przykłady dopisuje AI przy pierwszym użyciu (lib/lexicon/enrich.ts).
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'umn-phrasal-verbs',
  'Czasowniki frazowe',
  '${umn.length} najczęstszych czasowników frazowych, w kolejności alfabetycznej listy UMN',
  'phrase',
  'UMN CCAPS — 150 Most Common Phrasal Verbs',
  'https://ccaps.umn.edu/esl-resources/students/vocabulary/150-most-common-phrasal-verbs',
  2
)
on conflict (slug) do nothing;

insert into lexicon_entries (deck_id, rank, term, definition_en, part_of_speech)
select d.id, v.rank, v.term, v.definition_en, 'czasownik frazowy'
from lexicon_decks d
cross join (values
${umn.map((r) => `  (${r.rank}, ${q(r.term)}, ${q(r.definition)})`).join(',\n')}
) as v(rank, term, definition_en)
where d.slug = 'umn-phrasal-verbs'
on conflict (deck_id, term) do nothing;
`
writeFileSync(join(DIR, '02_phrasal_verbs.sql'), phrasalSql)
console.log(`✓ UMN: ${umn.length} czasowników frazowych`)
