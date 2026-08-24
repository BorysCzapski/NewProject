-- ============================================================================
-- supabase/seed/gitara/02_chords.sql
-- The chord library: 20 chords covering open, power, barre and rozszerzony
-- (extended) categories, roughly in the order a beginner should learn them.
--
-- Every `positions` shape was worked out by hand against real fingerings
-- (lib/gitara/theory.ts's module comment explains the string-index
-- convention: 0 = low E .. 5 = high e) — these are standard, commonly taught
-- voicings, not generated. Idempotent: upsert by slug.
-- ============================================================================

insert into gtr_chords (slug, symbol, root, quality, category, positions, difficulty, order_index, description) values
  (
    'em', 'Em', 'E', 'moll', 'open',
    '{"frets":[0,2,2,0,0,0],"fingers":[null,2,3,null,null,null],"baseFret":1}',
    1, 1, 'Najłatwiejszy akord na gitarze — tylko dwa palce, żadna struna nie jest wyciszona.'
  ),
  (
    'am', 'Am', 'A', 'moll', 'open',
    '{"frets":[null,0,2,2,1,0],"fingers":[null,null,2,3,1,null],"baseFret":1}',
    1, 2, 'Trzy palce blisko siebie na sąsiednich strunach — dobre wprowadzenie do zmiany akordów.'
  ),
  (
    'c', 'C', 'C', 'dur', 'open',
    '{"frets":[null,3,2,0,1,0],"fingers":[null,3,2,null,1,null],"baseFret":1}',
    1, 3, 'Klasyczny akord C-dur. Pilnuj, żeby szósta struna (niska E) nie zabrzmiała — jest wyciszona.'
  ),
  (
    'g', 'G', 'G', 'dur', 'open',
    '{"frets":[3,2,0,0,0,3],"fingers":[3,2,null,null,null,4],"baseFret":1}',
    1, 4, 'Szeroki rozstaw palców na skrajnych strunach. Wersja bazowa systemu CAGED dla kształtu G.'
  ),
  (
    'd', 'D', 'D', 'dur', 'open',
    '{"frets":[null,null,0,2,3,2],"fingers":[null,null,null,1,3,2],"baseFret":1}',
    1, 5, 'Trójkątny układ palców na trzech najcieńszych strunach. Grasz tylko cztery struny.'
  ),
  (
    'dm', 'Dm', 'D', 'moll', 'open',
    '{"frets":[null,null,0,2,3,1],"fingers":[null,null,null,2,3,1],"baseFret":1}',
    1, 6, 'To samo miejsce co D-dur, inny układ palców — dobry przykład, jak duże i małe tercje zmieniają brzmienie.'
  ),
  (
    'e-dur', 'E', 'E', 'dur', 'open',
    '{"frets":[0,2,2,1,0,0],"fingers":[null,2,3,1,null,null],"baseFret":1}',
    1, 7, 'Wszystkie sześć strun brzmi. To też kształt E z systemu CAGED — zapamiętaj ten układ palców na później.'
  ),
  (
    'a-dur', 'A', 'A', 'dur', 'open',
    '{"frets":[null,0,2,2,2,0],"fingers":[null,null,1,2,3,null],"baseFret":1}',
    1, 8, 'Trzy palce w rzędzie na tym samym progu. Kształt A z systemu CAGED.'
  ),
  (
    'g7', 'G7', 'G', 'septyma', 'open',
    '{"frets":[3,2,0,0,0,1],"fingers":[3,2,null,null,null,1],"baseFret":1}',
    1, 9, 'G-dur z dodaną septymą — brzmi „niedokończone”, naturalnie ciągnie do powrotu na C.'
  ),
  (
    'd7', 'D7', 'D', 'septyma', 'open',
    '{"frets":[null,null,0,2,1,2],"fingers":[null,null,null,3,1,2],"baseFret":1}',
    1, 10, 'Septymowa wersja D-dur, bardzo częsta w progresjach bluesowych i ludowych.'
  ),
  (
    'a7', 'A7', 'A', 'septyma', 'open',
    '{"frets":[null,0,2,0,2,0],"fingers":[null,null,1,null,2,null],"baseFret":1}',
    1, 11, 'Tylko dwa palce, a brzmi bogaciej niż zwykłe A-dur.'
  ),
  (
    'e7', 'E7', 'E', 'septyma', 'open',
    '{"frets":[0,2,0,1,0,0],"fingers":[null,2,null,1,null,null],"baseFret":1}',
    1, 12, 'Prostszy niż E-dur — mniej palców, mniej strun do pilnowania.'
  ),
  (
    'am7', 'Am7', 'A', 'moll-septyma', 'open',
    '{"frets":[null,0,2,0,1,0],"fingers":[null,null,2,null,1,null],"baseFret":1}',
    2, 13, 'Am z jednym palcem mniej niż zwykłe Am — łagodniejsze, „jazzujące” brzmienie.'
  ),
  (
    'f-dur', 'F', 'F', 'dur', 'barre',
    '{"frets":[1,3,3,2,1,1],"fingers":[1,3,4,2,1,1],"baseFret":1,"barre":{"fret":1,"fromString":0,"toString":5}}',
    3, 14, 'Pierwszy prawdziwy chwyt barowy większości gitarzystów. Kształt E dociśnięty jednym palcem na 1. progu.'
  ),
  (
    'bm', 'Bm', 'B', 'moll', 'barre',
    '{"frets":[null,2,4,4,3,2],"fingers":[null,1,3,3,2,1],"baseFret":2,"barre":{"fret":2,"fromString":1,"toString":5}}',
    3, 15, 'Kształt Am przesunięty i dociśnięty barem na 2. progu — ten sam ruch, inne miejsce na gryfie.'
  ),
  (
    'e5', 'E5', 'E', 'power', 'power',
    '{"frets":[0,2,2,null,null,null],"fingers":[null,1,1,null,null,null],"baseFret":1}',
    1, 16, 'Akord potęgowy: tylko pryma i kwinta, bez tercji — ani dur, ani moll. Podstawa rocka i metalu.'
  ),
  (
    'a5', 'A5', 'A', 'power', 'power',
    '{"frets":[null,0,2,2,null,null],"fingers":[null,null,1,1,null,null],"baseFret":1}',
    1, 17, 'Ten sam kształt co E5, przesunięty o jedną strunę w górę.'
  ),
  (
    'd5', 'D5', 'D', 'power', 'power',
    '{"frets":[null,null,0,2,3,null],"fingers":[null,null,null,1,3,null],"baseFret":1}',
    1, 18, 'Uwaga: inny wzór palców niż E5/A5 — strojenie między strunami G i H (B) to tercja, nie kwarta jak reszta.'
  ),
  (
    'cadd9', 'Cadd9', 'C', 'rozszerzony', 'rozszerzony',
    '{"frets":[null,3,2,0,3,0],"fingers":[null,3,2,null,4,null],"baseFret":1}',
    2, 19, 'C-dur z dodaną nutą — jaśniejsze, bardziej „otwarte” brzmienie niż zwykłe C.'
  ),
  (
    'dsus4', 'Dsus4', 'D', 'sus4', 'rozszerzony',
    '{"frets":[null,null,0,2,3,3],"fingers":[null,null,null,1,3,4],"baseFret":1}',
    2, 20, 'Tercja zastąpiona kwartą — akord „zawieszony”, który chce rozwiązać się do D-dur.'
  )
on conflict (slug) do update set
  symbol = excluded.symbol,
  root = excluded.root,
  quality = excluded.quality,
  category = excluded.category,
  positions = excluded.positions,
  difficulty = excluded.difficulty,
  order_index = excluded.order_index,
  description = excluded.description;
