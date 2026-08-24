-- ============================================================================
-- supabase/seed/gitara/01_topics.sql
-- 5 działów aplikacji Gitara. Autorytatywna lista (kolejność, opisy,
-- uzasadnienie kolejności) siedzi w lib/gitara/topics.ts — ten plik jest jej
-- odwzorowaniem, tak jak supabase/seed/algorytmy/01_topics.sql wobec
-- lib/algorytmy/topics.ts.
--
-- Idempotentny: upsert po slug. Uruchom PRZED 02_chords.sql, 03_lessons.sql
-- i 04_songs.sql.
-- ============================================================================

insert into gtr_topics (slug, title, description, order_index) values
  (
    'postawa-i-strojenie',
    'Postawa i strojenie',
    'Jak trzymać gitarę, budowa instrumentu, strojenie standardowe (E-A-D-G-B-e) i jak czytać diagramy akordów oraz tabulaturę.',
    1
  ),
  (
    'pierwsze-akordy',
    'Pierwsze akordy',
    'Pięć akordów, od których zaczyna prawie każdy: Em, Am, C, G, D. Chwyty, zmiana akordów i pierwsza progresja.',
    2
  ),
  (
    'nuty-i-rytm',
    'Nuty i rytm',
    'Wartości rytmiczne i takt, czytanie tabulatury oraz nuty na gryfie — gdzie leży każdy dźwięk na każdej strunie.',
    3
  ),
  (
    'system-caged',
    'System CAGED',
    'Pięć kształtów C-A-G-E-D tego samego akordu przesuwanych wzdłuż gryfu — mapa całego gryfu zbudowana z akordów, które już znasz.',
    4
  ),
  (
    'techniki-gry',
    'Techniki gry',
    'Palm muting, legato (hammer-on, pull-off), bend, tapping i sweep picking — jak wydobyć z gitary więcej niż samo brzdąkanie.',
    5
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  updated_at = now();
