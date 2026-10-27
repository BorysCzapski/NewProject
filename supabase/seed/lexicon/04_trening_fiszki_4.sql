-- Wygenerowane przez scripts/build-lexicon-seed.mjs — nie edytuj ręcznie.
-- Talia „Trening fiszki 4": 28 haseł (polskie słowo -> angielskie), z wariantami
-- w kolumnie alternatives. Źródło: lexicon/trening-fiszki-4-source.txt.
-- Wymaga migracji 0037 (kolumna alternatives). Idempotentny.
insert into lexicon_decks (slug, title, description, kind, source_name, source_url, order_index)
values (
  'trening-fiszki-4',
  'Trening fiszki 4',
  'Dom i mieszkanie: widzisz polskie słowo, wpisujesz angielskie',
  'word',
  'Trening fiszki 4',
  '',
  4
)
on conflict (slug) do nothing;

-- Jak w 03_dom_i_mieszkanie.sql: odsuwamy rangi, żeby dopisanie haseł w środku
-- nie zderzyło się z unique (deck_id, rank).
update lexicon_entries
set rank = rank + 100000
where deck_id = (select id from lexicon_decks where slug = 'trening-fiszki-4');

insert into lexicon_entries (deck_id, rank, term, alternatives, translation_pl, enriched_at)
select d.id, v.rank, v.term, v.alternatives, v.translation_pl, now()
from lexicon_decks d
cross join (values
  (1, 'garden', array[]::text[], 'ogródek'),
  (2, 'kitchen sink', array[]::text[], 'zlew'),
  (3, 'allotment', array[]::text[], 'działka'),
  (4, 'windowsill', array[]::text[], 'parapet'),
  (5, 'bathroom sink', array[]::text[], 'umywalka'),
  (6, 'roller blinds', array[]::text[], 'roleta'),
  (7, 'detached house', array[]::text[], 'dom wolnostojący'),
  (8, 'attic', array[]::text[], 'strych'),
  (9, 'studio', array[]::text[], 'kawalerka'),
  (10, 'ceiling', array[]::text[], 'sufit'),
  (11, 'cellar', array[]::text[], 'piwnica'),
  (12, 'chimney', array[]::text[], 'komin'),
  (13, 'staircase', array['stairwell']::text[], 'klatka schodowa'),
  (14, 'lawn', array[]::text[], 'trawnik'),
  (15, 'pavement', array['sidewalk']::text[], 'chodnik'),
  (16, 'wallpaper', array[]::text[], 'tapeta'),
  (17, 'luxury mansion', array[]::text[], 'luksusowa rezydencja'),
  (18, 'suburbs', array['outskirts']::text[], 'przedmieście'),
  (19, 'resident', array[]::text[], 'mieszkaniec'),
  (20, 'rural', array[]::text[], 'wiejski'),
  (21, 'neat', array[]::text[], 'schludny'),
  (22, 'spacious', array[]::text[], 'przestronny'),
  (23, 'tap', array[]::text[], 'kran'),
  (24, 'bunk bed', array[]::text[], 'łóżko piętrowe'),
  (25, 'duvet', array[]::text[], 'kołdra'),
  (26, 'cushion', array[]::text[], 'poduszka ozdobna'),
  (27, 'pillow', array[]::text[], 'poduszka'),
  (28, 'cutlery', array[]::text[], 'sztućce')
) as v(rank, term, alternatives, translation_pl)
where d.slug = 'trening-fiszki-4'
on conflict (deck_id, term) do update
  set rank = excluded.rank,
      alternatives = excluded.alternatives,
      translation_pl = excluded.translation_pl,
      enriched_at = coalesce(lexicon_entries.enriched_at, excluded.enriched_at);
