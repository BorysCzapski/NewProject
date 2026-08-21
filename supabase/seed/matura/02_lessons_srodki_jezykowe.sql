-- ============================================================================
-- supabase/seed/matura/02_lessons_srodki_jezykowe.sql
-- One short lesson per poziom for "Znajomość środków językowych"
-- (matura_lessons). content is a jsonb array of GrammarBlock (reused from
-- lib/grammar/lesson-blocks.ts, rendered by components/grammar/lesson/*) —
-- this is plain-text/quiz content, not interactive math widgets, so it
-- reuses that renderer instead of inventing a parallel block type.
--
-- Idempotent: deletes existing lessons for these sections first. Run
-- 01_sections.sql BEFORE this file — it looks up section_id by (level, slug).
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'en' and slug = 'srodki-jezykowe');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'Znajomość środków językowych — jak to działa',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie podstawowym to zadanie sprawdza, czy potrafisz poprawnie użyć gramatyki i słownictwa w kontekście zdania. Najczęstsze typy zadań: (1) słowotwórstwo — przekształcasz podane słowo (np. CARE → careful), (2) wybór wielokrotny (A/B/C/D) — wybierasz poprawną strukturę gramatyczną, (3) parafraza jednowyrazowa — uzupełniasz zdanie jednym słowem, zachowując znaczenie oryginału."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zanim wpiszesz odpowiedź, przeczytaj CAŁE zdanie — czasem informacja decydująca o poprawnej formie (liczba mnoga, czas, strona bierna) jest na końcu, nie przy samej luce."
  },
  {
    "type": "examples",
    "title": "Przykład: słowotwórstwo",
    "items": [
      { "en": "My sister is very careful about her health.", "pl": "Moja siostra bardzo dba o swoje zdrowie.", "highlight": "careful" },
      { "en": "It was the most boring film I have ever seen.", "pl": "To był najnudniejszy film, jaki widziałem.", "highlight": "boring" }
    ]
  },
  {
    "type": "quiz",
    "question": "I'm really looking forward ___ you this weekend.",
    "options": ["to see", "to seeing", "seeing", "see"],
    "correctIndex": 1,
    "explanation": "Po wyrażeniu 'look forward to' zawsze następuje czasownik z końcówką -ing (to jest tu przyimek 'to', nie 'to' bezokolicznika)."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'Znajomość środków językowych — jak to działa',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie rozszerzonym dochodzi trudniejszy typ zadania: parafraza ze słowem kluczowym (key word transformation) — przekształcasz zdanie, używając od 2 do 5 wyrazów, wliczając podane słowo kluczowe W NIEZMIENIONEJ FORMIE. To zadanie testuje znajomość struktur gramatycznych (mowa zależna, strona bierna, konstrukcje z 'wish', 'used to', inwersje) i wymaga precyzji — liczy się każdy wyraz."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Słowa kluczowego NIE WOLNO zmieniać formy (np. jeśli podane jest 'STOLEN', nie możesz napisać 'steal' ani 'stole') — inaczej odpowiedź jest błędna, nawet jeśli reszta zdania jest poprawna."
  },
  {
    "type": "examples",
    "title": "Przykład: parafraza ze słowem kluczowym",
    "items": [
      { "en": "My bike was stolen yesterday.", "pl": "Mój rower został wczoraj skradziony.", "highlight": "was stolen" },
      { "en": "He used to smoke, but he doesn't anymore.", "pl": "Kiedyś palił, ale już nie pali.", "highlight": "used to" }
    ]
  },
  {
    "type": "quiz",
    "question": "Original: \"I will call you tomorrow,\" she said. KEY WORD: WOULD — She said that she ___ me the next day.",
    "options": ["will call", "would call", "would have called", "calls"],
    "correctIndex": 1,
    "explanation": "W mowie zależnej 'will' cofa się o jeden czas wstecz do 'would' (tzw. backshift)."
  }
]$content$::jsonb,
  1
);
