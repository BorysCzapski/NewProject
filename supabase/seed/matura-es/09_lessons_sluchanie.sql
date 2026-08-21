-- ============================================================================
-- supabase/seed/matura-es/09_lessons_sluchanie.sql
-- One lesson per poziom for "Rozumienie ze słuchu" po hiszpańsku
-- (matura_lessons).
--
-- NOTE — why this file seeds LESSONS but no TASKS, unlike its English
-- counterpart (supabase/seed/matura/10_tasks_sluchanie.sql):
-- a listening task needs MaturaTaskContent.youtubeVideoId pointing at a real,
-- still-published video. The English tasks were authored against videos whose
-- ids were checked; inventing plausible-looking Spanish ids here would seed
-- tasks that render a dead player, which is worse for the student than an
-- honest "brak zadań" state (the section page already handles that gracefully).
-- Spanish listening tasks should be added the same way the English ones were:
-- pick a real video, verify the id, then author items against it.
--
-- The strategy lesson below is useful on its own and needs no audio, so it
-- ships now.
--
-- Idempotent: deletes existing Spanish lessons for this section first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'es' and slug = 'sluchanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'sluchanie'),
  'Rozumienie ze słuchu — jak nie zgubić się w nagraniu',
  $content$[
  {
    "type": "intro",
    "text": "Nagranie usłyszysz DWA razy. To zmienia strategię: pierwsze odtworzenie służy do złapania ogólnego sensu i zaznaczenia odpowiedzi pewnych, drugie — do sprawdzenia i uzupełnienia reszty. Nie próbuj zapisać wszystkiego za pierwszym razem."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Przed odtworzeniem masz czas na przeczytanie zadań. Wykorzystaj go w całości: podkreśl w pytaniach słowa kluczowe (liczby, imiona, miejsca) i przewiduj, czego będziesz słuchać."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Hiszpański w nagraniach jest szybki i „zlepiony”: „¿Qué es esto?” brzmi jak [ke-ses-to]. To normalne i nie znaczy, że czegoś nie umiesz — samogłoski na styku wyrazów łączą się w jedną."
  },
  {
    "type": "table",
    "title": "Sygnały, na które warto polować w nagraniu",
    "headers": ["Usłyszysz", "To znaczy, że zaraz padnie"],
    "rows": [
      ["Lo importante es que…", "Główna informacja"],
      ["En realidad… / De hecho…", "Sprostowanie tego, co powiedziano przed chwilą"],
      ["Es decir… / O sea…", "Powtórzenie tej samej myśli prościej"],
      ["Al final… / Total, que…", "Podsumowanie, często zawiera odpowiedź"],
      ["Pero…, Sin embargo…", "Zmiana kierunku — częsta pułapka w zadaniach"]
    ]
  },
  {
    "type": "examples",
    "title": "Liczby i daty — najczęściej mylone",
    "items": [
      { "en": "sesenta / setenta", "pl": "60 / 70 — różnią się jedną głoską", "highlight": "sesenta" },
      { "en": "dieciséis / sesenta", "pl": "16 / 60", "highlight": "dieciséis" },
      { "en": "a las dos y media", "pl": "o wpół do trzeciej (dosł. „druga i pół”)", "highlight": "y media" },
      { "en": "menos cuarto", "pl": "za piętnaście", "highlight": "menos cuarto" }
    ]
  },
  {
    "type": "quiz",
    "question": "W nagraniu słyszysz: „Íbamos a quedar a las siete, pero al final nos vemos a las ocho”. O której się spotykają?",
    "options": ["O siódmej.", "O ósmej.", "O wpół do ósmej."],
    "correctIndex": 1,
    "explanation": "„Al final” sygnalizuje ostateczną wersję — o ósmej. Siódma to plan, który został zmieniony; takie „pero al final” to klasyczna pułapka."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'sluchanie'),
  'Słuchanie na rozszerzeniu — opinie, ton i akcenty',
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu nagrania są dłuższe, a pytania rzadko dotyczą pojedynczego faktu. Częściej pytają, jaką POSTAWĘ ma mówiący, czy dwie osoby się zgadzają, albo po co ktoś przywołał dany przykład."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W nagraniach maturalnych pojawiają się różne odmiany hiszpańskiego. W wariancie latynoamerykańskim nie usłyszysz „vosotros” (zastępuje je „ustedes”), a „c” i „z” brzmią jak [s], nie jak angielskie „th”. To nie utrudnia zadania — o ile wiesz, że tak będzie."
  },
  {
    "type": "table",
    "title": "Jak rozpoznać postawę mówiącego",
    "headers": ["Zwrot", "Postawa"],
    "rows": [
      ["No estoy del todo convencido…", "Sceptycyzm, dystans"],
      ["Me parece una idea estupenda", "Wyraźna aprobata"],
      ["Bueno, hasta cierto punto…", "Częściowa zgoda z zastrzeżeniem"],
      ["No me malinterpretes, pero…", "Zaraz padnie krytyka"],
      ["Ya, pero es que…", "Uprzejma niezgoda"],
      ["Precisamente eso es lo que digo", "Pełna zgoda z rozmówcą"]
    ]
  },
  {
    "type": "examples",
    "title": "Zgoda i niezgoda — usłysz różnicę",
    "items": [
      { "en": "Estoy totalmente de acuerdo contigo.", "pl": "Całkowicie się z tobą zgadzam.", "highlight": "totalmente de acuerdo" },
      { "en": "En eso no te doy la razón.", "pl": "W tej kwestii nie przyznaję ci racji.", "highlight": "no te doy la razón" },
      { "en": "Sí, bueno, aunque yo lo veo de otra manera.", "pl": "Tak, choć ja to widzę inaczej. (uprzejma niezgoda)", "highlight": "de otra manera" },
      { "en": "Ni mucho menos.", "pl": "Absolutnie nie / bynajmniej.", "highlight": "Ni mucho menos" }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Gdy pytanie brzmi „¿En qué están de acuerdo los interlocutores?”, szukaj miejsca, gdzie jedna osoba POWTARZA myśl drugiej innymi słowami. Zgoda w naturalnej rozmowie rzadko brzmi „sí” — częściej to parafraza."
  },
  {
    "type": "quiz",
    "question": "Rozmówca mówi: „Ya, pero es que eso no funciona en ciudades pequeñas”. Jaka to postawa?",
    "options": ["Pełna zgoda.", "Uprzejma niezgoda z zastrzeżeniem.", "Prośba o powtórzenie."],
    "correctIndex": 1,
    "explanation": "„Ya, pero es que…” to typowy zwrot uprzejmej niezgody: rozmówca przyjmuje do wiadomości argument, po czym go podważa."
  }
]$content$::jsonb,
  1
);
