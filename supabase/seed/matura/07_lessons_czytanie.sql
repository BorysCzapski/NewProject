-- ============================================================================
-- supabase/seed/matura/07_lessons_czytanie.sql
-- One lesson per poziom for "Rozumienie tekstów pisanych" (matura_lessons).
-- Format details (text volume, point totals, task types) are sourced from
-- the official CKE Informator and cross-checked exam-prep sites — see the
-- research note in lib/matura/sections.ts-adjacent commentary; rozszerzona's
-- exact item count varies slightly by source/year, flagged as approximate
-- like exam_weight elsewhere in this schema.
--
-- Idempotent: deletes existing lessons for these sections first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where slug = 'czytanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where level = 'podstawowa' and slug = 'czytanie'),
  'Rozumienie tekstów pisanych — jak zdobyć maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "To największa część egzaminu podstawowego pod względem punktów: ok. 20 punktów (33% arkusza), czyli więcej niż środki językowe czy pisanie. Zwykle 4-5 tekstów (łącznie ok. 1200-1500 słów), każdy z osobnym zestawem pytań."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Na czym polega"],
    "rows": [
      ["Wybór wielokrotny", "Pytanie lub zdanie do dokończenia + 3-4 opcje (A/B/C/D)"],
      ["Dopasowanie nagłówków", "Do każdego akapitu dopasuj pasujący nagłówek z listy (jeden nagłówek to dystraktor — nie pasuje do żadnego akapitu)"],
      ["Prawda/Fałsz", "Zdanie zgodne lub niezgodne z treścią tekstu"],
      ["Zadanie otwarte", "Uzupełnienie luki w streszczeniu tekstu własnymi słowami (parafraza)"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zanim przeczytasz cały tekst, przeczytaj pytania/nagłówki — szukaj w tekście SYNONIMÓW i PARAFRAZ tych słów, nie dokładnie tych samych wyrazów. Zdający, którzy szukają identycznych słów, często trafiają na fałszywy trop (dystraktor)."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Przy dopasowaniu nagłówków: nie wybieraj nagłówka, który pasuje tylko do JEDNEGO zdania akapitu — szukaj nagłówka podsumowującego CAŁY akapit. To najczęstsza pułapka w tym typie zadania."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'czytanie'),
  'Rozumienie tekstów pisanych — jak zdobyć maksimum punktów',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie rozszerzonym teksty są dłuższe i gęstsze (ok. 1600-2500 słów łącznie), a odpowiedzi częściej wymagają wnioskowania, nie tylko odnajdywania faktów. To ok. 18 punktów (orientacyjnie 30% arkusza — dokładna liczba zadań bywa różna w różnych latach)."
  },
  {
    "type": "table",
    "title": "Typy zadań",
    "headers": ["Typ", "Na czym polega"],
    "rows": [
      ["Tekst z lukami zdaniowymi", "Z tekstu usunięto zdania — dopasuj je z listy do właściwych luk (jedno zdanie to dystraktor)"],
      ["Dopasowanie pytań do fragmentów", "Tekst podzielony na fragmenty A-D — do każdego pytania dopasuj fragment, w którym pada odpowiedź"],
      ["Wybór wielokrotny (wnioskowanie)", "Pytanie wymaga wywnioskowania czegoś z kontekstu, nie tylko odnalezienia faktu wprost"],
      ["Zadanie otwarte", "Uzupełnienie luki w streszczeniu własnymi słowami — liczy się parafraza, nie kopiowanie zdania z tekstu"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W zadaniu z lukami zdaniowymi patrz na SPÓJNOŚĆ: zaimki (it, this, they), łączniki (however, therefore) i czas gramatyczny w zdaniu przed i po luce muszą logicznie pasować do wstawianego zdania — to najpewniejszy sposób na znalezienie właściwej odpowiedzi, nie samo znaczenie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W dopasowaniu pytań do fragmentów najpierw przeskanuj każdy fragment pod kątem słów kluczowych (nazwiska, liczby, konkretne terminy), zanim zaczniesz dokładnie czytać pytania — to znacznie przyspiesza pracę przy długich, gęstych tekstach."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W pytaniach wymagających wnioskowania poprawna odpowiedź rzadko powtarza dosłowne słowa z tekstu — jeśli opcja brzmi identycznie jak fragment tekstu, to często dystraktor. Szukaj opcji, która trafnie PARAFRAZUJE sens."
  }
]$content$::jsonb,
  1
);
