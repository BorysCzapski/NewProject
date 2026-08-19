-- ============================================================================
-- supabase/seed/matura-es/07_lessons_czytanie.sql
-- One lesson per poziom for "Rozumienie tekstów pisanych" po hiszpańsku
-- (matura_lessons). Strategy content: how the task types work and where Polish
-- readers of Spanish actually lose points (false friends, negation, and
-- answers that are true in the world but not stated in the text).
--
-- Idempotent: deletes existing Spanish lessons for this section first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'es' and slug = 'czytanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  'Rozumienie tekstów pisanych — jak czytać pod zadanie',
  $content$[
  {
    "type": "intro",
    "text": "Ta część nie sprawdza, czy zrozumiałeś każde słowo. Sprawdza, czy potrafisz znaleźć w tekście konkretną informację i odróżnić ją od informacji podobnej, ale nie tej. Typy zadań: wybór wielokrotny, dobieranie nagłówków do akapitów, prawda/fałsz oraz uzupełnianie luk zdaniami."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Czytaj najpierw PYTANIA, potem tekst. Wiedząc, czego szukasz, przeczytasz raz zamiast trzy razy — a na arkuszu liczy się czas."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd: wybierasz odpowiedź, która jest PRAWDZIWA W ŚWIECIE, ale nie została powiedziana w tekście. Punkt dostajesz wyłącznie za to, co autor napisał. Zaznacz w tekście fragment, który uzasadnia Twój wybór — jeśli nie umiesz go wskazać, to zła odpowiedź."
  },
  {
    "type": "table",
    "title": "Fałszywi przyjaciele — pułapki dla Polaków",
    "headers": ["Hiszpańskie słowo", "Wygląda jak", "Naprawdę znaczy"],
    "rows": [
      ["el éxito", "eksodus / exit", "sukces"],
      ["la carpeta", "karpeta / dywan", "teczka, skoroszyt"],
      ["el compromiso", "kompromis", "zobowiązanie"],
      ["actualmente", "aktualnie w sensie „obecnie”", "obecnie (to akurat pasuje!) — ale „actual” to nie „aktualny” w sensie „ważny”"],
      ["sensible", "sensowny", "wrażliwy"],
      ["la ropa", "ropa naftowa", "ubrania"],
      ["embarazada", "zawstydzona", "w ciąży"]
    ]
  },
  {
    "type": "examples",
    "title": "Słowa, które odwracają sens zdania",
    "items": [
      { "en": "No obstante, el proyecto siguió adelante.", "pl": "Niemniej jednak projekt był kontynuowany.", "highlight": "No obstante" },
      { "en": "Apenas quedaban entradas.", "pl": "Prawie nie zostało biletów.", "highlight": "Apenas" },
      { "en": "Ya no vive en Madrid.", "pl": "Już nie mieszka w Madrycie.", "highlight": "Ya no" },
      { "en": "Todavía no ha respondido.", "pl": "Jeszcze nie odpowiedział.", "highlight": "Todavía no" },
      { "en": "Salvo los domingos, abre todos los días.", "pl": "Oprócz niedziel otwarte codziennie.", "highlight": "Salvo" }
    ]
  },
  {
    "type": "quiz",
    "question": "W tekście czytasz: „Apenas había gente en la playa”. Co to znaczy?",
    "options": ["Na plaży było mnóstwo ludzi.", "Na plaży prawie nie było ludzi.", "Na plaży ledwo zmieścili się ludzie."],
    "correctIndex": 1,
    "explanation": "„Apenas” = ledwie, prawie nie. To słowo odwraca sens całego zdania — przeoczenie go kosztuje punkt."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'czytanie'),
  'Czytanie na rozszerzeniu — intencja autora i dobieranie zdań',
  $content$[
  {
    "type": "intro",
    "text": "Na rozszerzeniu teksty są dłuższe i bardziej abstrakcyjne (artykuły prasowe, eseje, wywiady), a pytania rzadziej dotyczą faktów. Częściej pytają o INTENCJĘ autora, o funkcję akapitu albo o to, do czego odnosi się dane słowo w tekście."
  },
  {
    "type": "table",
    "title": "Typy pytań i co naprawdę sprawdzają",
    "headers": ["Pytanie brzmi", "Sprawdza"],
    "rows": [
      ["¿Cuál es el propósito del autor?", "Po co napisał tekst: informuje, przekonuje, ostrzega, krytykuje?"],
      ["¿A qué se refiere „lo” en la línea 12?", "Czy śledzisz odniesienia zaimków"],
      ["El autor menciona X para…", "Funkcję przykładu w argumentacji, nie sam przykład"],
      ["¿Qué actitud muestra el autor?", "Ton: escéptico, entusiasta, crítico, neutral, irónico"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Przy dobieraniu zdań do luk kieruj się SPÓJNIKAMI i zaimkami na początku brakującego zdania. „Sin embargo” zapowiada kontrast z poprzednim zdaniem, „Por ello” — skutek, „Este” / „Esta” musi mieć rzeczownik, do którego się odnosi, tuż przed luką."
  },
  {
    "type": "examples",
    "title": "Słownictwo do opisu postawy autora",
    "items": [
      { "en": "El autor se muestra escéptico ante estos datos.", "pl": "Autor jest sceptyczny wobec tych danych.", "highlight": "escéptico" },
      { "en": "El tono del artículo es claramente crítico.", "pl": "Ton artykułu jest wyraźnie krytyczny.", "highlight": "crítico" },
      { "en": "El autor cuestiona la validez del estudio.", "pl": "Autor podważa wiarygodność badania.", "highlight": "cuestiona" },
      { "en": "El artículo pretende concienciar al lector.", "pl": "Artykuł ma uświadomić czytelnika.", "highlight": "pretende concienciar" }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Pretender” to NIE „pretendować”, tylko „zamierzać, mieć na celu”. W pytaniach o intencję autora pojawia się bardzo często i mylne odczytanie przekreśla całe pytanie."
  },
  {
    "type": "quiz",
    "question": "Luka poprzedzona zdaniem o zaletach, a po niej następuje opis kosztów. Które zdanie pasuje w lukę?",
    "options": ["Además, los beneficios son evidentes.", "Sin embargo, esta solución no está exenta de problemas.", "Por ejemplo, muchos usuarios lo confirman."],
    "correctIndex": 1,
    "explanation": "Po zaletach, a przed kosztami, potrzebny jest zwrot kontrastujący — „Sin embargo”. „Además” dokładałoby kolejną zaletę, „Por ejemplo” rozwijałoby poprzednie zdanie."
  }
]$content$::jsonb,
  1
);
