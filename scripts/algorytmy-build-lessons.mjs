#!/usr/bin/env node
// ============================================================================
// scripts/algorytmy-build-lessons.mjs
// Validates the authored Algorytmy theory in supabase/seed/algorytmy/lessons/
// *.json against the AlgoBlock contract (lib/algorytmy/lesson-blocks.ts) and
// emits supabase/seed/algorytmy/03_lessons.sql.
//
//   node scripts/algorytmy-build-lessons.mjs                     — validate + write SQL
//   node scripts/algorytmy-build-lessons.mjs --check              — validate only
//   node scripts/algorytmy-build-lessons.mjs --check rekurencja   — validate one dział
//
// Same build step, and the same reason, as scripts/geografia-build-lessons.mjs:
// a lesson is a deeply nested jsonb array and one malformed block would either
// crash the renderer or silently render nothing. This app adds checks that
// only make sense here — a `binary-search` block whose array is not sorted
// would make the visualiser demonstrate the algorithm producing a WRONG
// answer, and a `traversal` edge pointing at a node id that does not exist
// would draw a line into empty space. Both are caught below rather than in
// production.
// ============================================================================
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const LESSONS_DIR = join(REPO, 'supabase', 'seed', 'algorytmy', 'lessons')
const OUT_FILE = join(REPO, 'supabase', 'seed', 'algorytmy', '03_lessons.sql')

// Must match supabase/seed/algorytmy/01_topics.sql (and lib/algorytmy/topics.ts).
const TOPIC_SLUGS = new Set([
  'zlozonosc-obliczeniowa', 'rekurencja', 'tablice-i-listy', 'stos-i-kolejka',
  'wyszukiwanie', 'sortowanie-proste', 'sortowanie-szybkie', 'tablice-haszujace',
  'drzewa-bst', 'kopce', 'grafy', 'programowanie-dynamiczne',
])

const CODE_LANGUAGES = new Set(['python', 'javascript', 'pseudokod'])
const SORTING_ALGORITHMS = new Set(['bubble', 'insertion', 'selection', 'merge', 'quick'])
const TRAVERSAL_ALGORITHMS = new Set(['bfs', 'dfs'])
// Keep in sync with ALGO_GROWTH_FUNCTIONS in lib/algorytmy/lesson-blocks.ts.
const GROWTH_FUNCTIONS = new Set(['1', 'log n', 'n', 'n log n', 'n^2', '2^n'])

const errors = []
const warnings = []

function fail(where, message) {
  errors.push(`${where}: ${message}`)
}

const isStr = (v) => typeof v === 'string' && v.trim().length > 0
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
const isArr = (v, min = 1) => Array.isArray(v) && v.length >= min

function checkBlock(block, where) {
  if (!block || typeof block !== 'object') return fail(where, 'blok nie jest obiektem')
  switch (block.type) {
    case 'intro':
      if (!isStr(block.text)) fail(where, 'intro.text wymagany')
      break

    case 'definition':
      if (!isStr(block.term)) fail(where, 'definition.term wymagany')
      if (!isStr(block.text)) fail(where, 'definition.text wymagany')
      break

    case 'code':
      if (!CODE_LANGUAGES.has(block.language))
        fail(where, `code.language musi być ${[...CODE_LANGUAGES].join('|')}`)
      if (!isStr(block.code)) fail(where, 'code.code wymagany')
      else if (block.code.split('\n').length > 40)
        warnings.push(`${where}: ${block.code.split('\n').length} linii kodu — na telefonie to dużo`)
      break

    case 'complexity':
      if (!isArr(block.rows)) return fail(where, 'complexity.rows wymagane')
      block.rows.forEach((r, i) => {
        if (!isStr(r?.operation)) fail(`${where}.rows[${i}]`, 'operation wymagane')
        if (!isStr(r?.worst)) fail(`${where}.rows[${i}]`, 'worst wymagane')
      })
      break

    case 'steps':
      if (!isStr(block.title)) fail(where, 'steps.title wymagany')
      if (!isArr(block.steps, 2)) return fail(where, 'steps.steps: min. 2 kroki')
      block.steps.forEach((s, i) => {
        if (!isStr(s?.title) || !isStr(s?.text)) fail(`${where}.steps[${i}]`, 'title/text wymagane')
      })
      break

    case 'compare':
      if (!isStr(block.title)) fail(where, 'compare.title wymagany')
      if (!isStr(block.leftLabel) || !isStr(block.rightLabel))
        fail(where, 'compare.leftLabel/rightLabel wymagane')
      if (!isArr(block.rows)) return fail(where, 'compare.rows wymagane')
      block.rows.forEach((r, i) => {
        if (!isStr(r?.aspect) || !isStr(r?.left) || !isStr(r?.right))
          fail(`${where}.rows[${i}]`, 'aspect/left/right wymagane')
      })
      break

    case 'table': {
      if (!isArr(block.headers)) return fail(where, 'table.headers wymagane')
      if (!isArr(block.rows)) return fail(where, 'table.rows wymagane')
      const cols = block.headers.length
      block.rows.forEach((row, i) => {
        if (!Array.isArray(row)) return fail(`${where}.rows[${i}]`, 'wiersz musi być tablicą')
        if (row.length !== cols)
          fail(`${where}.rows[${i}]`, `ma ${row.length} kolumn, nagłówków jest ${cols}`)
      })
      break
    }

    case 'tip':
      if (!['tip', 'warning', 'exam'].includes(block.variant))
        fail(where, 'tip.variant musi być tip|warning|exam')
      if (!isStr(block.text)) fail(where, 'tip.text wymagany')
      break

    case 'sorting':
      if (!isStr(block.title)) fail(where, 'sorting.title wymagany')
      if (!SORTING_ALGORITHMS.has(block.algorithm))
        fail(where, `sorting.algorithm musi być ${[...SORTING_ALGORITHMS].join('|')}`)
      if (!isArr(block.values, 4)) return fail(where, 'sorting.values: min. 4 wartości')
      if (!block.values.every(isNum)) fail(where, 'sorting.values zawiera wartość nieliczbową')
      if (block.values.length > 12)
        fail(where, `sorting.values: ${block.values.length} elementów — powyżej 12 słupki są nieczytelne`)
      break

    case 'traversal': {
      if (!isStr(block.title)) fail(where, 'traversal.title wymagany')
      if (!TRAVERSAL_ALGORITHMS.has(block.algorithm))
        fail(where, `traversal.algorithm musi być ${[...TRAVERSAL_ALGORITHMS].join('|')}`)
      if (!isArr(block.nodes, 3)) return fail(where, 'traversal.nodes: min. 3 wierzchołki')
      const ids = new Set()
      block.nodes.forEach((n, i) => {
        if (!isStr(n?.id)) return fail(`${where}.nodes[${i}]`, 'id wymagane')
        if (ids.has(n.id)) fail(`${where}.nodes[${i}]`, `duplikat id "${n.id}"`)
        ids.add(n.id)
        if (!isStr(n?.label)) fail(`${where}.nodes[${i}]`, 'label wymagane')
        if (!isNum(n?.x) || n.x < 0 || n.x > 100) fail(`${where}.nodes[${i}]`, 'x poza zakresem 0..100')
        if (!isNum(n?.y) || n.y < 0 || n.y > 100) fail(`${where}.nodes[${i}]`, 'y poza zakresem 0..100')
      })
      if (!isArr(block.edges)) return fail(where, 'traversal.edges wymagane')
      block.edges.forEach((e, i) => {
        // An edge to a nonexistent node would draw a line into empty space.
        if (!ids.has(e?.from)) fail(`${where}.edges[${i}]`, `from "${e?.from}" nie jest wierzchołkiem`)
        if (!ids.has(e?.to)) fail(`${where}.edges[${i}]`, `to "${e?.to}" nie jest wierzchołkiem`)
        if (e?.from === e?.to) fail(`${where}.edges[${i}]`, 'pętla własna — wizualizator jej nie rysuje')
      })
      if (!ids.has(block.startId))
        fail(where, `traversal.startId "${block.startId}" nie jest wierzchołkiem`)
      break
    }

    case 'binary-search': {
      if (!isStr(block.title)) fail(where, 'binary-search.title wymagany')
      if (!isArr(block.values, 4)) return fail(where, 'binary-search.values: min. 4 wartości')
      if (!block.values.every(isNum)) return fail(where, 'binary-search.values zawiera wartość nieliczbową')
      // The whole point of the block is that the algorithm is correct on the
      // authored data — unsorted input would demonstrate it returning a wrong
      // answer, which is worse than not showing it at all.
      const sorted = [...block.values].every((v, i, a) => i === 0 || a[i - 1] <= v)
      if (!sorted) fail(where, 'binary-search.values musi być posortowane rosnąco')
      if (!isNum(block.target)) fail(where, 'binary-search.target wymagany')
      break
    }

    case 'structure-ops': {
      if (!isStr(block.title)) fail(where, 'structure-ops.title wymagany')
      if (!['stack', 'queue'].includes(block.kind)) fail(where, 'structure-ops.kind musi być stack|queue')
      if (!isArr(block.operations, 3)) return fail(where, 'structure-ops.operations: min. 3 operacje')
      let depth = 0
      block.operations.forEach((o, i) => {
        if (o?.op === 'push') {
          if (!isStr(o.value)) fail(`${where}.operations[${i}]`, 'push wymaga value')
          depth += 1
        } else if (o?.op === 'pop') {
          // Popping an empty structure has no frame to render.
          if (depth === 0) fail(`${where}.operations[${i}]`, 'pop na pustej strukturze')
          else depth -= 1
        } else {
          fail(`${where}.operations[${i}]`, 'op musi być push|pop')
        }
      })
      break
    }

    case 'growth':
      if (!isStr(block.title)) fail(where, 'growth.title wymagany')
      if (!isArr(block.functions, 2)) return fail(where, 'growth.functions: min. 2 funkcje')
      block.functions.forEach((f, i) => {
        if (!GROWTH_FUNCTIONS.has(f))
          fail(`${where}.functions[${i}]`, `nieznana funkcja "${f}" (dozwolone: ${[...GROWTH_FUNCTIONS].join(', ')})`)
      })
      if (!Number.isInteger(block.maxN) || block.maxN < 2) fail(where, 'growth.maxN musi być liczbą całkowitą >= 2')
      if (block.functions?.includes('2^n') && block.maxN > 20)
        warnings.push(`${where}: 2^n przy maxN=${block.maxN} zdominuje wykres — rozważ maxN <= 20`)
      break

    case 'quiz':
      if (!isStr(block.question)) fail(where, 'quiz.question wymagane')
      if (!isArr(block.options, 2)) return fail(where, 'quiz.options: min. 2 opcje')
      if (!block.options.every(isStr)) fail(where, 'quiz.options musi zawierać same niepuste teksty')
      if (new Set(block.options).size !== block.options.length) fail(where, 'quiz.options zawiera duplikaty')
      if (!Number.isInteger(block.correctIndex) || block.correctIndex < 0 || block.correctIndex >= block.options.length)
        fail(where, `quiz.correctIndex ${block.correctIndex} poza zakresem 0..${block.options.length - 1}`)
      if (!isStr(block.explanation)) fail(where, 'quiz.explanation wymagane')
      break

    default:
      fail(where, `nieznany typ bloku "${block.type}"`)
  }
}

function main() {
  if (!existsSync(LESSONS_DIR)) {
    console.error(`\n✗ Brak katalogu ${LESSONS_DIR}\n`)
    process.exit(1)
  }

  const only = process.argv.slice(2).find((a) => !a.startsWith('--'))
  let files = readdirSync(LESSONS_DIR).filter((f) => f.endsWith('.json')).sort()
  if (only) {
    const wanted = only.endsWith('.json') ? only : `${only}.json`
    files = files.filter((f) => f === wanted)
    if (files.length === 0) {
      console.error(`\n✗ Nie znaleziono pliku ${wanted} w ${LESSONS_DIR}\n`)
      process.exit(1)
    }
  }
  if (files.length === 0) {
    console.error('\n✗ Brak plików .json z lekcjami\n')
    process.exit(1)
  }

  const allLessons = []
  const seenTopics = new Set()

  for (const file of files) {
    let doc
    try {
      doc = JSON.parse(readFileSync(join(LESSONS_DIR, file), 'utf8'))
    } catch (err) {
      fail(file, `niepoprawny JSON — ${err.message}`)
      continue
    }

    if (!TOPIC_SLUGS.has(doc.topicSlug)) {
      fail(file, `nieznany topicSlug "${doc.topicSlug}"`)
      continue
    }
    if (seenTopics.has(doc.topicSlug)) fail(file, `topicSlug "${doc.topicSlug}" w więcej niż jednym pliku`)
    seenTopics.add(doc.topicSlug)

    if (!isArr(doc.lessons)) {
      fail(file, 'brak tablicy lessons')
      continue
    }

    const seenSlugs = new Set()
    doc.lessons.forEach((lesson, li) => {
      const where = `${file} › lekcja[${li}] (${lesson?.slug ?? '?'})`
      if (!isStr(lesson?.slug) || !/^[a-z0-9-]+$/.test(lesson.slug))
        fail(where, 'slug wymagany (małe litery, cyfry, myślniki)')
      else if (seenSlugs.has(lesson.slug)) fail(where, `duplikat slug "${lesson.slug}" w tym dziale`)
      else seenSlugs.add(lesson.slug)

      if (!isStr(lesson?.title)) fail(where, 'title wymagany')
      if (!isStr(lesson?.summary)) fail(where, 'summary wymagane')
      if (!isArr(lesson?.blocks, 3)) {
        fail(where, 'blocks: min. 3 bloki')
        return
      }
      lesson.blocks.forEach((block, bi) =>
        checkBlock(block, `${where} › blok[${bi}] (${block?.type ?? '?'})`)
      )

      allLessons.push({
        topicSlug: doc.topicSlug,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        readingMinutes: Number.isInteger(lesson.readingMinutes) ? lesson.readingMinutes : 8,
        orderIndex: li + 1,
        blocks: lesson.blocks,
      })
    })
  }

  const byType = {}
  for (const lesson of allLessons)
    for (const block of lesson.blocks) byType[block?.type ?? '?'] = (byType[block?.type ?? '?'] ?? 0) + 1
  const totalBlocks = Object.values(byType).reduce((a, b) => a + b, 0)

  console.log(`\n  Pliki:    ${files.length}`)
  console.log(`  Działy:   ${seenTopics.size} / ${TOPIC_SLUGS.size}`)
  console.log(`  Lekcje:   ${allLessons.length}`)
  console.log(`  Bloki:    ${totalBlocks}`)
  console.log(
    `  Typy:     ${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}×${n}`).join(', ')}`
  )

  const missing = [...TOPIC_SLUGS].filter((s) => !seenTopics.has(s))
  if (missing.length > 0) console.log(`\n  ⚠ Działy bez teorii (${missing.length}): ${missing.join(', ')}`)
  for (const w of warnings.slice(0, 20)) console.log(`  ⚠ ${w}`)

  if (errors.length > 0) {
    console.error(`\n✗ ${errors.length} błędów walidacji:\n`)
    for (const e of errors.slice(0, 60)) console.error(`  • ${e}`)
    if (errors.length > 60) console.error(`  … i ${errors.length - 60} więcej`)
    console.error('')
    process.exit(1)
  }

  if (process.argv.includes('--check')) {
    console.log('\n✓ Walidacja OK (--check: nie zapisuję SQL)\n')
    return
  }
  if (only) {
    console.log('\n✓ Walidacja OK — SQL generuję tylko przy pełnym przebiegu (bez filtra działu)\n')
    return
  }

  const header = `-- ============================================================================
-- supabase/seed/algorytmy/03_lessons.sql
-- WYGENEROWANY PLIK — nie edytuj ręcznie.
-- Źródło: supabase/seed/algorytmy/lessons/*.json
-- Regeneracja: node scripts/algorytmy-build-lessons.mjs
--
-- ${allLessons.length} lekcji w ${seenTopics.size} działach (${totalBlocks} bloków).
-- Idempotentny: upsert po (topic_id, slug), więc ponowne uruchomienie
-- aktualizuje treść zamiast duplikować lekcje.
-- Uruchom PO 01_topics.sql.
-- ============================================================================

`
  const statements = allLessons.map((lesson) => {
    const json = JSON.stringify(lesson.blocks)
    // Dollar-quoting: lesson prose and code snippets are full of apostrophes,
    // quotes and backslashes; $algo$ cannot collide with either.
    return `insert into algo_lessons (topic_id, slug, title, summary, content, reading_minutes, order_index)
values (
  (select id from algo_topics where slug = $algo$${lesson.topicSlug}$algo$),
  $algo$${lesson.slug}$algo$,
  $algo$${lesson.title}$algo$,
  $algo$${lesson.summary}$algo$,
  $algo$${json}$algo$::jsonb,
  ${lesson.readingMinutes},
  ${lesson.orderIndex}
)
on conflict (topic_id, slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index,
  updated_at = now();`
  })

  writeFileSync(OUT_FILE, header + statements.join('\n\n') + '\n')
  console.log(`\n✓ Zapisano ${OUT_FILE}\n`)
}

main()
