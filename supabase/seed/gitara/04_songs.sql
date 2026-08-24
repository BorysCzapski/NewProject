-- ============================================================================
-- supabase/seed/gitara/04_songs.sql
-- A small starter song library. Deliberately traditional/anonymous-authorship
-- Polish folk and carol material — melodies and lyrics old enough to be
-- public domain — NOT contemporary copyrighted pop songs. AGENTS.md's spec
-- is explicit that free tabs need distribution permission the app has no way
-- to verify for an arbitrary current song; these four sidestep that entirely.
-- Chord arrangements are original (any publisher's chording of a public-
-- domain melody is its own arrangement — there is no single "official" one).
--
-- Idempotent: upsert by slug.
-- ============================================================================

insert into gtr_songs (slug, title, artist, difficulty, tempo_bpm, capo, content_chordpro, source) values
  (
    'wlazl-kotek-na-plotek',
    'Wlazł kotek na płotek',
    'Tradycyjna',
    1, 100, 0,
    $chordpro$[C]Wlazł kotek na [G7]płotek i [C]mruga,
[C]ładna to pio[G7]senka nie[C]długa.
[F]Nie długa, nie [C]krótka,
[G7]lecz w sam raz,
[C]Zaśpiewaj mi [G7]kotku jeszcze [C]raz.$chordpro$,
    'curated'
  ),
  (
    'sto-lat',
    'Sto lat',
    'Tradycyjna',
    1, 110, 0,
    $chordpro$[C]Sto lat, sto lat, [G7]niech żyje, żyje [C]nam.
[C]Sto lat, sto lat, [G7]niech żyje, żyje [C]nam.
[C]Jeszcze raz, jeszcze [F]raz, niech żyje, żyje [G7]nam,
[C]niech żyje [G7]nam[C]!$chordpro$,
    'curated'
  ),
  (
    'cicha-noc',
    'Cicha noc',
    'Tradycyjna (kolęda)',
    2, 80, 0,
    $chordpro$[C]Cicha noc, [F]święta noc,
[C]Pokój niesie [G7]ludziom wszem,
[C]A u żłóbka [F]Matka Święta
[C]Czuwa sama [G7]uśmiechnięta,
[C]Nad Dzieciątka [G7]snem, [C]
Nad Dzieciątka snem.$chordpro$,
    'curated'
  ),
  (
    'plonie-ognisko',
    'Płonie ognisko',
    'Tradycyjna (piosenka harcerska)',
    2, 90, 0,
    $chordpro$[Am]Płonie ognisko i [G]szumią knieje,
[C]Drużynowy jest [E7]wśród nas,
[Am]Opowiada staro[G]dawne dzieje,
[Dm]Dawno, dawno mi[E7]niony [Am]czas.$chordpro$,
    'curated'
  )
on conflict (slug) do update set
  title = excluded.title,
  artist = excluded.artist,
  difficulty = excluded.difficulty,
  tempo_bpm = excluded.tempo_bpm,
  capo = excluded.capo,
  content_chordpro = excluded.content_chordpro,
  source = excluded.source;
