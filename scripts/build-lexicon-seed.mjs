#!/usr/bin/env node
// Buduje z surowych list: lexicon/01_daily_words.sql (EF), lexicon/02_phrasal_verbs.sql (UMN)
// matura/19_vocab_phrasal_verbs.sql (testyourenglish.pl) i lexicon/03_dom_i_mieszkanie.sql
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

// --- Matura: phrasal verbs (testyourenglish.pl) -----------------------------
// Blok w pliku: "* hasło – tłumaczenie", pusta linia, zdanie EN, zdanie PL.
// Wpis „turn on / turn off – włączać / wyłączać" rozbijamy na dwa hasła (wpisywanie
// „turn on / turn off" w trenerze byłoby niewykonalne); przykład z źródła dostaje
// pierwsze, drugie zostaje bez przykładu — niczego nie dopisujemy od siebie.
const blocks = readFileSync(join(DIR, '..', 'matura', 'phrasal-verbs-source.txt'), 'utf8')
  .split(/\n\s*\n(?=\* )/)
  .map((b) => b.trim())
  .filter(Boolean)

const pv = []
for (const block of blocks) {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
  const head = lines[0].match(/^\*\s*(.+?)\s+[–-]\s+(.+)$/)
  if (!head || lines.length !== 3) throw new Error(`Zły blok phrasal verb:\n${block}`)
  const [, term, pl] = head
  const [ex, exPl] = [lines[1], lines[2]]
  if (term.includes(' / ') && pl.includes(' / ')) {
    const terms = term.split(' / ')
    const pls = pl.split(' / ')
    if (terms.length !== pls.length) throw new Error(`Niezgodne warianty: ${term}`)
    terms.forEach((t, i) => pv.push({ term: t.trim(), pl: pls[i].trim(), ex: i === 0 ? ex : '', exPl: i === 0 ? exPl : '' }))
  } else {
    pv.push({ term, pl, ex, exPl })
  }
}
const pvTerms = new Set()
for (const r of pv) {
  if (pvTerms.has(r.term)) throw new Error(`Duplikat phrasal verb: ${r.term}`)
  pvTerms.add(r.term)
}

const pvSql = `-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- ============================================================================
-- supabase/seed/matura/19_vocab_phrasal_verbs.sql
-- Blok „Phrasal verbs na maturze" w banku słownictwa angielskiego.
-- Źródło: testyourenglish.pl, „Phrasal verbs na maturze"
-- (https://testyourenglish.pl/wiedza/phrasal-verbs-na-maturze/) — hasło,
-- tłumaczenie i zdanie przykładowe z tłumaczeniem, wszystko ze źródła.
-- ${pv.length} haseł. Nieniszczący i idempotentny (nie kasuje banku).
-- ============================================================================

insert into matura_vocab_topics (language, slug, title, title_target, description, order_index) values
  ('en', 'phrasal-verbs', 'Phrasal verbs', 'Phrasal verbs',
   'Czasowniki frazowe, które najczęściej pojawiają się na maturze. Źródło: testyourenglish.pl.', 17)
on conflict do nothing;

insert into matura_vocab_entries (topic_id, level, term, part_of_speech, translation_pl, example, example_pl, note, order_index)
select t.id, 'podstawowa'::matura_level, v.term, 'czasownik frazowy', v.pl, v.ex, v.ex_pl, '', v.ord
from (select id from matura_vocab_topics where language = 'en' and slug = 'phrasal-verbs') t,
(values
${pv.map((r, i) => `  (${i + 1}, ${q(r.term)}, ${q(r.pl)}, ${q(r.ex)}, ${q(r.exPl)})`).join(',\n')}
) as v(ord, term, pl, ex, ex_pl)
on conflict (topic_id, term) do nothing;
`
writeFileSync(join(DIR, '..', 'matura', '19_vocab_phrasal_verbs.sql'), pvSql)
console.log(`✓ Matura phrasal verbs: ${pv.length} haseł`)

// --- Dom i mieszkanie (zrzuty ekranu użytkownika, zestaw „Pojęcia") ---------
// Linia: "hasło — tłumaczenie". Wpisy BEZ tłumaczenia to hasła ucięte na
// krawędzi zrzutu ekranu — pomijamy je i wypisujemy, zamiast zgadywać.
// Talia ma gotowe tłumaczenia, więc dostaje enriched_at i nie wymaga AI
// (patrz lib/lexicon/enrich.ts: needsEnrichment).
const dom = []
const domCut = []
readFileSync(join(DIR, 'dom-pojecia-source.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .forEach((line, i) => {
    const m = line.match(/^(.+?)\s+—\s*(.*)$/)
    if (!m) throw new Error(`Nie umiem sparsować linii ${i + 1}: ${line}`)
    const [, term, pl] = m
    if (!pl.trim()) domCut.push(term.trim())
    else dom.push({ rank: i + 1, term: term.trim(), pl: pl.trim() })
  })
const domTerms = new Set()
for (const r of dom) {
  if (domTerms.has(r.term)) throw new Error(`Duplikat hasła: ${r.term}`)
  domTerms.add(r.term)
}

const domSql = `-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Talia „Dom i mieszkanie": ${dom.length} haseł z zestawu „Pojęcia" (zrzuty ekranu od użytkownika).
-- Pominięte (ucięte na zrzucie, bez tłumaczenia): ${domCut.join(', ') || 'brak'}.
-- Lista jest niepełna: na zrzutach brakuje fragmentu między „armchair" i
-- „bench" oraz między „boiler room" i „bowl" (tam była reklama). Rank to
-- pozycja w przepisanej liście; po dopisaniu brakujących haseł seed
-- przenumerowuje całą talię.
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'dom-pojecia',
  'Dom i mieszkanie',
  'Słownictwo o domu, wyposażeniu i obowiązkach domowych — słówka i zwroty',
  'word',
  'Zestaw „Pojęcia" — dom i mieszkanie',
  '',
  3
)
on conflict (slug) do nothing;

-- Talia jest niepełna i będzie uzupełniana, a nowe hasła wchodzą MIĘDZY
-- istniejące i przesuwają rank. unique (deck_id, rank) nie pozwala na zamianę
-- numerów w jednym zapytaniu, więc najpierw odsuwamy wszystkie rangi poza
-- zakres, a upsert ustawia je na nowo (term jest kluczem, więc postęp
-- użytkowników, wskazujący na entry_id, zostaje nietknięty).
update lexicon_entries
set rank = rank + 100000
where deck_id = (select id from lexicon_decks where slug = 'dom-pojecia');

insert into lexicon_entries (deck_id, rank, term, translation_pl, enriched_at)
select d.id, v.rank, v.term, v.translation_pl, now()
from lexicon_decks d
cross join (values
${dom.map((r) => `  (${r.rank}, ${q(r.term)}, ${q(r.pl)})`).join(',\n')}
) as v(rank, term, translation_pl)
where d.slug = 'dom-pojecia'
on conflict (deck_id, term) do update
  set rank = excluded.rank,
      translation_pl = excluded.translation_pl,
      enriched_at = coalesce(lexicon_entries.enriched_at, excluded.enriched_at);
`
writeFileSync(join(DIR, '03_dom_i_mieszkanie.sql'), domSql)
console.log(`✓ Dom i mieszkanie: ${dom.length} haseł, pominięto ucięte: ${domCut.join(', ') || 'brak'}`)
