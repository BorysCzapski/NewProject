#!/usr/bin/env node
// ============================================================================
// scripts/geografia-build-lessons.mjs
// Validates the authored geography theory in supabase/seed/geografia/lessons/
// *.json against the GeoBlock contract (lib/geografia/lesson-blocks.ts) and
// emits supabase/seed/geografia/03_lessons.sql.
//
//   node scripts/geografia-build-lessons.mjs                  — validate + write SQL
//   node scripts/geografia-build-lessons.mjs --check           — validate only
//   node scripts/geografia-build-lessons.mjs --check atmosfera — validate one dział
//
// The single-dział form exists so a content author can check their own file
// in isolation while other działy are still being written (the whole-dir run
// would fail on everyone else's work-in-progress).
//
// Why a build step instead of hand-written SQL: a lesson is a deeply nested
// jsonb array, and a single malformed block (wrong type name, a `quiz` whose
// correctIndex is out of range, a klimatogram with 11 months) would either
// crash the renderer at runtime or silently render nothing. Validating here
// means bad content can never reach the database — the same "don't trust
// generated structure blindly" stance as lib/textbook/extract.ts's
// sanitizeExercise, applied to authored theory.
// ============================================================================
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '..')
const LESSONS_DIR = join(REPO, 'supabase', 'seed', 'geografia', 'lessons')
const OUT_FILE = join(REPO, 'supabase', 'seed', 'geografia', '03_lessons.sql')

// Topic slugs must match supabase/seed/geografia/01_topics.sql exactly.
const TOPIC_SLUGS = new Set([
  'zrodla-informacji-geograficznej', 'ziemia-we-wszechswiecie', 'atmosfera', 'hydrosfera', 'litosfera',
  'pedosfera-i-biosfera', 'podzial-polityczny-i-rozwoj-spoleczno-gospodarczy', 'demografia-i-osadnictwo',
  'uwarunkowania-gospodarki-swiatowej', 'rolnictwo-lesnictwo-rybactwo', 'przemysl', 'uslugi',
  'czlowiek-a-srodowisko', 'srodowisko-przyrodnicze-polski', 'spoleczenstwo-i-gospodarka-polski',
  'morze-baltyckie', 'strefowosc-przyrodnicza', 'problemy-srodowiskowe-swiata',
  'uwarunkowania-przyrodnicze-gospodarki', 'problemy-polityczne-swiata', 'problemy-spoleczne-swiata',
  'jakosc-zycia-na-swiecie', 'problemy-gospodarcze-swiata',
])

const TONES = new Set(['sky', 'water', 'earth', 'rock', 'ice', 'vegetation', 'heat', 'neutral'])

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
  const t = block.type
  switch (t) {
    case 'intro':
      if (!isStr(block.text)) fail(where, 'intro.text wymagany')
      break
    case 'definition':
      if (!isStr(block.term)) fail(where, 'definition.term wymagany')
      if (!isStr(block.text)) fail(where, 'definition.text wymagany')
      break
    case 'key-numbers':
      if (!isArr(block.items)) return fail(where, 'key-numbers.items wymagane')
      block.items.forEach((it, i) => {
        if (!isStr(it?.value)) fail(`${where}.items[${i}]`, 'value wymagane')
        if (!isStr(it?.label)) fail(`${where}.items[${i}]`, 'label wymagane')
      })
      break
    case 'formula':
      if (!isStr(block.expression)) fail(where, 'formula.expression wymagane')
      break
    case 'table': {
      if (!isArr(block.headers)) return fail(where, 'table.headers wymagane')
      if (!isArr(block.rows)) return fail(where, 'table.rows wymagane')
      const cols = block.headers.length
      block.rows.forEach((row, i) => {
        if (!Array.isArray(row)) return fail(`${where}.rows[${i}]`, 'wiersz musi być tablicą')
        if (row.length !== cols) fail(`${where}.rows[${i}]`, `ma ${row.length} kolumn, nagłówków jest ${cols}`)
      })
      break
    }
    case 'compare':
      if (!isStr(block.title)) fail(where, 'compare.title wymagany')
      if (!isStr(block.leftLabel) || !isStr(block.rightLabel)) fail(where, 'compare.leftLabel/rightLabel wymagane')
      if (!isArr(block.rows)) return fail(where, 'compare.rows wymagane')
      block.rows.forEach((r, i) => {
        if (!isStr(r?.aspect) || !isStr(r?.left) || !isStr(r?.right))
          fail(`${where}.rows[${i}]`, 'aspect/left/right wymagane')
      })
      break
    case 'classification':
      if (!isStr(block.title)) fail(where, 'classification.title wymagany')
      if (!isArr(block.groups)) return fail(where, 'classification.groups wymagane')
      block.groups.forEach((g, i) => {
        if (!isStr(g?.name)) fail(`${where}.groups[${i}]`, 'name wymagane')
        if (!isStr(g?.description)) fail(`${where}.groups[${i}]`, 'description wymagane')
        if (!Array.isArray(g?.examples)) fail(`${where}.groups[${i}]`, 'examples musi być tablicą')
      })
      break
    case 'case-study':
      for (const k of ['title', 'region', 'text', 'takeaway'])
        if (!isStr(block[k])) fail(where, `case-study.${k} wymagane`)
      break
    case 'mnemonic':
      if (!isStr(block.text)) fail(where, 'mnemonic.text wymagany')
      break
    case 'tip':
      if (!['tip', 'warning', 'exam'].includes(block.variant)) fail(where, 'tip.variant musi być tip|warning|exam')
      if (!isStr(block.text)) fail(where, 'tip.text wymagany')
      break
    case 'process':
      if (!isStr(block.title)) fail(where, 'process.title wymagany')
      if (!isArr(block.steps, 2)) return fail(where, 'process.steps: min. 2 etapy')
      block.steps.forEach((s, i) => {
        if (!isStr(s?.title) || !isStr(s?.text)) fail(`${where}.steps[${i}]`, 'title/text wymagane')
      })
      break
    case 'timeline':
      if (!isStr(block.title)) fail(where, 'timeline.title wymagany')
      if (!isArr(block.events, 2)) return fail(where, 'timeline.events: min. 2 wydarzenia')
      block.events.forEach((e, i) => {
        if (!isStr(e?.period) || !isStr(e?.label) || !isStr(e?.text))
          fail(`${where}.events[${i}]`, 'period/label/text wymagane')
      })
      break
    case 'layers':
      if (!isStr(block.title)) fail(where, 'layers.title wymagany')
      if (block.orientation && !['top-down', 'bottom-up'].includes(block.orientation))
        fail(where, 'layers.orientation musi być top-down|bottom-up')
      if (!isArr(block.layers, 2)) return fail(where, 'layers.layers: min. 2 warstwy')
      block.layers.forEach((l, i) => {
        if (!isStr(l?.name) || !isStr(l?.text)) fail(`${where}.layers[${i}]`, 'name/text wymagane')
        if (l?.tone && !TONES.has(l.tone)) fail(`${where}.layers[${i}]`, `nieznany tone "${l.tone}"`)
      })
      break
    case 'concentric':
      if (!isStr(block.title)) fail(where, 'concentric.title wymagany')
      if (!isArr(block.shells, 2)) return fail(where, 'concentric.shells: min. 2 powłoki')
      block.shells.forEach((s, i) => {
        if (!isStr(s?.name) || !isStr(s?.text)) fail(`${where}.shells[${i}]`, 'name/text wymagane')
        if (s?.tone && !TONES.has(s.tone)) fail(`${where}.shells[${i}]`, `nieznany tone "${s.tone}"`)
      })
      break
    case 'cycle':
      if (!isStr(block.title)) fail(where, 'cycle.title wymagany')
      if (!isArr(block.stages, 3)) return fail(where, 'cycle.stages: min. 3 etapy')
      if (block.stages.length > 8) fail(where, 'cycle.stages: maks. 8 etapów (układ kołowy)')
      block.stages.forEach((s, i) => {
        if (!isStr(s?.name) || !isStr(s?.text)) fail(`${where}.stages[${i}]`, 'name/text wymagane')
      })
      break
    case 'zones':
      if (!isStr(block.title)) fail(where, 'zones.title wymagany')
      if (!isArr(block.zones, 2)) return fail(where, 'zones.zones: min. 2 strefy')
      block.zones.forEach((z, i) => {
        if (!isStr(z?.name) || !isStr(z?.latitude) || !isStr(z?.text))
          fail(`${where}.zones[${i}]`, 'name/latitude/text wymagane')
        if (z?.tone && !TONES.has(z.tone)) fail(`${where}.zones[${i}]`, `nieznany tone "${z.tone}"`)
      })
      break
    case 'climate-chart': {
      if (!isStr(block.station)) fail(where, 'climate-chart.station wymagana')
      for (const k of ['temps', 'precip']) {
        const arr = block[k]
        if (!Array.isArray(arr) || arr.length !== 12) fail(where, `climate-chart.${k} musi mieć dokładnie 12 liczb`)
        else if (!arr.every(isNum)) fail(where, `climate-chart.${k} zawiera wartość nieliczbową`)
      }
      if (Array.isArray(block.precip) && block.precip.some((p) => isNum(p) && p < 0))
        fail(where, 'climate-chart.precip: opad nie może być ujemny')
      if (block.answer && (!isStr(block.answer.climate) || !isStr(block.answer.reasoning)))
        fail(where, 'climate-chart.answer wymaga climate + reasoning')
      break
    }
    case 'population-pyramid': {
      if (!isStr(block.country)) fail(where, 'population-pyramid.country wymagany')
      for (const k of ['male', 'female']) {
        if (!isArr(block[k], 3)) fail(where, `population-pyramid.${k} wymaga min. 3 przedziałów`)
        else if (!block[k].every(isNum)) fail(where, `population-pyramid.${k} zawiera wartość nieliczbową`)
      }
      if (Array.isArray(block.male) && Array.isArray(block.female) && block.male.length !== block.female.length)
        fail(where, 'population-pyramid: male i female muszą mieć tyle samo przedziałów')
      if (block.answer && (!isStr(block.answer.shape) || !isStr(block.answer.reasoning)))
        fail(where, 'population-pyramid.answer wymaga shape + reasoning')
      break
    }
    case 'chart': {
      if (!['bar', 'line'].includes(block.variant)) fail(where, 'chart.variant musi być bar|line')
      if (!isStr(block.title)) fail(where, 'chart.title wymagany')
      if (!isArr(block.labels)) return fail(where, 'chart.labels wymagane')
      if (!isArr(block.series)) return fail(where, 'chart.series wymagane')
      block.series.forEach((s, i) => {
        if (!isStr(s?.name)) fail(`${where}.series[${i}]`, 'name wymagane')
        if (!Array.isArray(s?.values) || !s.values.every(isNum))
          return fail(`${where}.series[${i}]`, 'values musi być tablicą liczb')
        if (s.values.length !== block.labels.length)
          fail(`${where}.series[${i}]`, `ma ${s.values.length} wartości, etykiet jest ${block.labels.length}`)
      })
      break
    }
    case 'map-explore': {
      if (!isStr(block.title)) fail(where, 'map-explore.title wymagany')
      if (!Array.isArray(block.center) || block.center.length !== 2 || !block.center.every(isNum))
        fail(where, 'map-explore.center musi być [lat, lng]')
      else {
        const [lat, lng] = block.center
        if (lat < -90 || lat > 90) fail(where, `map-explore.center: lat ${lat} poza zakresem -90..90`)
        if (lng < -180 || lng > 180) fail(where, `map-explore.center: lng ${lng} poza zakresem -180..180`)
      }
      if (!isNum(block.zoom)) fail(where, 'map-explore.zoom wymagany')
      if (!isArr(block.markers)) return fail(where, 'map-explore.markers wymagane')
      block.markers.forEach((m, i) => {
        if (!isStr(m?.label) || !isStr(m?.text)) fail(`${where}.markers[${i}]`, 'label/text wymagane')
        if (!isNum(m?.lat) || m.lat < -90 || m.lat > 90) fail(`${where}.markers[${i}]`, 'lat poza zakresem -90..90')
        if (!isNum(m?.lng) || m.lng < -180 || m.lng > 180)
          fail(`${where}.markers[${i}]`, 'lng poza zakresem -180..180')
      })
      break
    }
    case 'matching': {
      if (!isStr(block.title)) fail(where, 'matching.title wymagany')
      if (!isArr(block.pairs, 3)) return fail(where, 'matching.pairs: min. 3 pary')
      if (block.pairs.length > 6) warnings.push(`${where}: ${block.pairs.length} par — powyżej 6 robi się ciasno`)
      const rights = new Set()
      block.pairs.forEach((p, i) => {
        if (!isStr(p?.left) || !isStr(p?.right)) return fail(`${where}.pairs[${i}]`, 'left/right wymagane')
        if (rights.has(p.right)) fail(`${where}.pairs[${i}]`, `duplikat prawej strony "${p.right}" — para niejednoznaczna`)
        rights.add(p.right)
      })
      break
    }
    case 'ordering': {
      if (!isStr(block.title)) fail(where, 'ordering.title wymagany')
      if (!isArr(block.items, 3)) return fail(where, 'ordering.items: min. 3 elementy')
      if (!block.items.every(isStr)) fail(where, 'ordering.items musi zawierać same niepuste teksty')
      if (new Set(block.items).size !== block.items.length) fail(where, 'ordering.items zawiera duplikaty')
      break
    }
    case 'quiz': {
      if (!isStr(block.question)) fail(where, 'quiz.question wymagane')
      if (!isArr(block.options, 2)) return fail(where, 'quiz.options: min. 2 opcje')
      if (!block.options.every(isStr)) fail(where, 'quiz.options musi zawierać same niepuste teksty')
      if (!Number.isInteger(block.correctIndex) || block.correctIndex < 0 || block.correctIndex >= block.options.length)
        fail(where, `quiz.correctIndex ${block.correctIndex} poza zakresem 0..${block.options.length - 1}`)
      if (!isStr(block.explanation)) fail(where, 'quiz.explanation wymagane')
      break
    }
    default:
      fail(where, `nieznany typ bloku "${t}"`)
  }
}

function main() {
  if (!existsSync(LESSONS_DIR)) {
    console.error(`\n✗ Brak katalogu ${LESSONS_DIR}\n`)
    process.exit(1)
  }

  // A bare non-flag argument narrows the run to one dział (see header).
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
    const path = join(LESSONS_DIR, file)
    let doc
    try {
      doc = JSON.parse(readFileSync(path, 'utf8'))
    } catch (err) {
      fail(file, `niepoprawny JSON — ${err.message}`)
      continue
    }

    const topicSlug = doc.topicSlug
    if (!TOPIC_SLUGS.has(topicSlug)) {
      fail(file, `nieznany topicSlug "${topicSlug}"`)
      continue
    }
    if (seenTopics.has(topicSlug)) fail(file, `topicSlug "${topicSlug}" występuje w więcej niż jednym pliku`)
    seenTopics.add(topicSlug)

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
      lesson.blocks.forEach((block, bi) => checkBlock(block, `${where} › blok[${bi}] (${block?.type ?? '?'})`))

      allLessons.push({
        topicSlug,
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
-- supabase/seed/geografia/03_lessons.sql
-- WYGENEROWANY PLIK — nie edytuj ręcznie.
-- Źródło: supabase/seed/geografia/lessons/*.json
-- Regeneracja: node scripts/geografia-build-lessons.mjs
--
-- ${allLessons.length} lekcji teorii w ${seenTopics.size} działach CKE (${totalBlocks} bloków).
-- Idempotentny: upsert po (topic_id, slug), więc ponowne uruchomienie
-- aktualizuje treść zamiast duplikować lekcje.
-- Uruchom PO 01_topics.sql.
-- ============================================================================

`
  const statements = allLessons.map((lesson) => {
    const json = JSON.stringify(lesson.blocks)
    // Dollar-quoting: lesson prose contains apostrophes and quotation marks;
    // $geo$ can't collide with authored Polish text.
    return `insert into geo_lessons (topic_id, slug, title, summary, content, reading_minutes, order_index)
values (
  (select id from geo_topics where slug = $geo$${lesson.topicSlug}$geo$),
  $geo$${lesson.slug}$geo$,
  $geo$${lesson.title}$geo$,
  $geo$${lesson.summary}$geo$,
  $geo$${json}$geo$::jsonb,
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
