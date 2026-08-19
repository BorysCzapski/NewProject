-- ============================================================================
-- supabase/seed/matura/09_lessons_sluchanie.sql
-- One lesson per poziom for "Rozumienie ze słuchu" (matura_lessons). Format
-- details (recording length, points, task types) sourced from the official
-- CKE Informator and cross-checked exam-prep sites — exact point/minute
-- figures vary slightly year to year, flagged as approximate like
-- exam_weight elsewhere in this schema.
--
-- Idempotent: deletes existing lessons for these sections first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'en' and slug = 'sluchanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'sluchanie'),
  'Rozumienie ze słuchu — jak zdobyć maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "Na egzaminie każde nagranie jest odtwarzane DWUKROTNIE. To ok. 15 punktów (25% arkusza), zwykle podzielone na 3-5 krótszych nagrań: dialogi codzienne, krótkie ogłoszenia (dworzec, lotnisko), wiadomości na sekretarce, proste wywiady — tempo mówienia jest stosunkowo wyraźne i niezbyt szybkie."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Na czym polega"],
    "rows": [
      ["Wybór wielokrotny", "Pytanie + 3-4 opcje odpowiedzi (A/B/C/D)"],
      ["Prawda/Fałsz", "Zdanie zgodne lub niezgodne z nagraniem"],
      ["Dopasowanie", "Np. dopasowanie mówcy do wypowiedzi lub nagrania do nagłówka"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zanim nagranie ruszy, przeczytaj WSZYSTKIE pytania i opcje odpowiedzi — wiedza, czego szukać, jest kluczowa, bo nagranie leci tylko dwa razy. Pierwsze odsłuchanie: ogólny sens i pewne odpowiedzi. Drugie odsłuchanie: potwierdzenie i uzupełnienie luk."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W zadaniach wyboru wielokrotnego poprawna odpowiedź rzadko powtarza dosłowne słowa z nagrania — jeśli opcja brzmi identycznie jak to, co słyszysz, to często dystraktor (pułapka). Szukaj opcji, która trafnie parafrazuje sens wypowiedzi."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'sluchanie'),
  'Rozumienie ze słuchu — jak zdobyć maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "Nagrania są dłuższe i gęstsze niż na poziomie podstawowym — dłuższe wywiady, dyskusje z co najmniej dwojgiem rozmówców, bardziej abstrakcyjne tematy (społeczeństwo, środowisko, kultura), naturalne tempo mówienia i więcej idiomatycznego języka. Każde nagranie wciąż odtwarzane jest dwukrotnie. To ok. 15 punktów (orientacyjnie 25% arkusza)."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Na czym polega"],
    "rows": [
      ["Wybór wielokrotny", "Pytanie + 3-4 opcje, często wymaga wywnioskowania, nie tylko odnalezienia faktu"],
      ["Dopasowanie", "Np. dopasowanie mówcy do opinii, kilka krótkich wypowiedzi do dopasowania"],
      ["Zadanie otwarte", "Uzupełnienie luki w zdaniu własnymi słowami na podstawie usłyszanej informacji"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Na poziomie rozszerzonym rozmówcy często zmieniają zdanie w trakcie wypowiedzi lub wyrażają opinię pośrednio (np. przez ton głosu, wahanie) — nie zatrzymuj się na pierwszym fragmencie pasującym do pytania, poczekaj na całą wypowiedź, bo kontekst może ją zmienić."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W zadaniach otwartych zapisuj odpowiedź WŁASNYMI słowami usłyszanymi w nagraniu (nie parafrazuj na własną rękę) — liczy się dokładność względem tego, co faktycznie powiedziano, a drobne błędy ortograficzne zwykle nie przeszkadzają, jeśli słowo jest rozpoznawalne."
  }
]$content$::jsonb,
  1
);
