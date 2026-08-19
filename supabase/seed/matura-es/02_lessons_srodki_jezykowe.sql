-- ============================================================================
-- supabase/seed/matura-es/02_lessons_srodki_jezykowe.sql
-- One lesson per poziom for "Znajomość środków językowych" po hiszpańsku
-- (matura_lessons). content is a jsonb array of GrammarBlock (reused from
-- lib/grammar/lesson-blocks.ts, rendered by components/grammar/lesson/*).
--
-- The English lesson in supabase/seed/matura/ teaches English word-formation
-- and tense choice; this one teaches what a Polish learner of Spanish actually
-- loses points on in this part of the arkusz — ser/estar, por/para, subjuntivo
-- and indefinido vs imperfecto — the same list the AI writing grader is
-- primed with in lib/matura/writing-grading.ts LANGUAGE_NOTES.es.
--
-- Idempotent: deletes existing Spanish lessons for this section first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_lessons
where section_id in (select id from matura_sections where language = 'es' and slug = 'srodki-jezykowe');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  'Znajomość środków językowych — jak to działa',
  $content$[
  {
    "type": "intro",
    "text": "Ta część arkusza sprawdza, czy potrafisz użyć gramatyki i słownictwa POPRAWNIE W KONTEKŚCIE zdania — nie czy znasz regułkę na pamięć. Najczęstsze typy zadań na poziomie podstawowym: (1) uzupełnianie luk jednym wyrazem, (2) wybór wielokrotny (A/B/C), (3) słowotwórstwo — przekształcasz podany wyraz (np. FÁCIL → fácilmente)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Zawsze przeczytaj CAŁE zdanie przed wpisaniem odpowiedzi. W hiszpańskim informacja decydująca o formie — rodzaj rzeczownika, liczba, osoba — bywa dwa słowa dalej, a nie tuż przy luce."
  },
  {
    "type": "compare",
    "title": "SER czy ESTAR — pierwsza pułapka",
    "columns": [
      {
        "title": "SER",
        "formula": "cecha stała, tożsamość, definicja",
        "whenToUse": "kim/czym coś jest: zawód, narodowość, charakter, materiał, godzina, miejsce wydarzenia",
        "examples": ["Marta es profesora.", "La mesa es de madera.", "Son las tres.", "La fiesta es en mi casa."]
      },
      {
        "title": "ESTAR",
        "formula": "stan chwilowy, położenie, wynik zmiany",
        "whenToUse": "gdzie coś jest i w jakim jest stanie tu i teraz",
        "examples": ["Marta está cansada.", "El libro está en la mesa.", "Estoy enfermo.", "La puerta está abierta."]
      }
    ]
  },
  {
    "type": "examples",
    "title": "Ta sama przydawka, inne znaczenie",
    "items": [
      { "en": "Pedro es aburrido.", "pl": "Pedro jest nudny (taki ma charakter).", "highlight": "es aburrido" },
      { "en": "Pedro está aburrido.", "pl": "Pedro się nudzi (teraz).", "highlight": "está aburrido" },
      { "en": "La manzana es verde.", "pl": "Jabłko jest zielone (taki ma kolor).", "highlight": "es verde" },
      { "en": "La manzana está verde.", "pl": "Jabłko jest niedojrzałe.", "highlight": "está verde" }
    ]
  },
  {
    "type": "compare",
    "title": "POR czy PARA",
    "columns": [
      {
        "title": "POR",
        "formula": "przyczyna, zamiana, droga, czas trwania",
        "whenToUse": "z POWODU czegoś, przez coś, za coś",
        "examples": ["Gracias por tu ayuda.", "Lo hice por ti.", "Pasamos por el centro.", "Estudié por dos horas."]
      },
      {
        "title": "PARA",
        "formula": "cel, przeznaczenie, termin, opinia",
        "whenToUse": "PO TO, ŻEBY; dla kogo; na kiedy",
        "examples": ["Estudio para aprobar.", "Este regalo es para ti.", "Lo necesito para el lunes.", "Para mí, es difícil."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Najczęstszy błąd Polaków: tłumaczenie polskiego „dla” zawsze jako PARA, a „przez” zawsze jako POR. Sprawdzaj SENS, nie polski przyimek — „Gracias por tu ayuda” to dosłownie „dzięki ZA pomoc”, mimo że po polsku nie ma tam ani „przez”, ani „dla”."
  },
  {
    "type": "table",
    "title": "Słowotwórstwo — najczęstsze końcówki",
    "headers": ["Końcówka", "Tworzy", "Przykład"],
    "rows": [
      ["-ción / -sión", "rzeczownik od czasownika", "informar → la información"],
      ["-dad / -tad", "rzeczownik od przymiotnika", "posible → la posibilidad"],
      ["-mente", "przysłówek od przymiotnika (forma żeńska!)", "rápido → rápidamente"],
      ["-oso / -osa", "przymiotnik od rzeczownika", "el peligro → peligroso"],
      ["-ista", "nazwa osoby (ta sama forma dla obu rodzajów)", "el arte → el/la artista"],
      ["in- / im- / des-", "przeczenie", "útil → inútil, posible → imposible"]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Przysłówki na -mente tworzysz od formy ŻEŃSKIEJ przymiotnika: rápido → rápida → rápidamente. Od przymiotników zakończonych na -e lub spółgłoskę forma się nie zmienia: fácil → fácilmente."
  },
  {
    "type": "quiz",
    "question": "Uzupełnij: „Mi hermana ___ muy simpática, siempre ayuda a todos.”",
    "options": ["está", "es", "hay"],
    "correctIndex": 1,
    "explanation": "„Simpática” opisuje tu stały charakter siostry, a nie chwilowy nastrój — dlatego SER: es muy simpática."
  },
  {
    "type": "quiz",
    "question": "Uzupełnij: „Compré este libro ___ mi madre, es su cumpleaños.”",
    "options": ["por", "para", "de"],
    "correctIndex": 1,
    "explanation": "Chodzi o odbiorcę prezentu (przeznaczenie) — PARA mi madre. POR znaczyłoby „zamiast mamy” albo „z powodu mamy”."
  }
]$content$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony
-- ----------------------------------------------------------------------------
insert into matura_lessons (section_id, title, content, order_index) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  'Środki językowe na rozszerzeniu — subjuntivo, czasy przeszłe, parafrazy',
  $content$[
  {
    "type": "intro",
    "text": "Na poziomie rozszerzonym dochodzą dwa typy zadań, których nie ma na podstawie: PARAFRAZA (przekształcasz zdanie tak, by zachowało znaczenie, używając podanego wyrazu) i TŁUMACZENIE FRAGMENTU (polski fragment w nawiasie oddajesz po hiszpańsku). Oba karzą za to samo: za tryb subjuntivo tam, gdzie powinien być indicativo, i odwrotnie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "W parafrazie liczy się KAŻDE słowo z polecenia. Jeśli kazano użyć wyrazu w podanej formie — nie odmieniaj go. Jeśli podano limit słów, przekroczenie zeruje punkt, nawet gdy zdanie jest poprawne."
  },
  {
    "type": "compare",
    "title": "INDICATIVO czy SUBJUNTIVO",
    "columns": [
      {
        "title": "INDICATIVO",
        "formula": "fakt, pewność, stwierdzenie",
        "whenToUse": "po czasownikach mówienia i myślenia w twierdzeniu: creo que, es verdad que, sé que",
        "examples": ["Creo que tiene razón.", "Es verdad que hace frío.", "Sé que vendrá mañana."]
      },
      {
        "title": "SUBJUNTIVO",
        "formula": "wola, wątpliwość, emocja, ocena",
        "whenToUse": "quiero que, dudo que, me alegro de que, es importante que, no creo que, para que, cuando (o przyszłości)",
        "examples": ["Quiero que vengas.", "Dudo que tenga razón.", "Me alegro de que estés aquí.", "Es importante que estudies.", "Cuando llegues, llámame."]
      }
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "„Creo que” + indicativo, ale „NO creo que” + subjuntivo. Zaprzeczenie czasownika opinii przerzuca zdanie podrzędne w subjuntivo — to jeden z najczęściej punktowanych błędów na rozszerzeniu."
  },
  {
    "type": "compare",
    "title": "INDEFINIDO czy IMPERFECTO",
    "columns": [
      {
        "title": "PRETÉRITO INDEFINIDO",
        "formula": "czynność zamknięta, wydarzyła się i skończyła",
        "whenToUse": "konkretne zdarzenie, ciąg zdarzeń, określony moment w przeszłości",
        "examples": ["Ayer fui al cine.", "En 2019 terminé mis estudios.", "De repente sonó el teléfono."]
      },
      {
        "title": "PRETÉRITO IMPERFECTO",
        "formula": "tło, opis, czynność powtarzalna",
        "whenToUse": "jak było, co się zwykle działo, co trwało gdy zdarzyło się coś innego",
        "examples": ["Antes vivía en Madrid.", "Era verano y hacía calor.", "Estudiaba cuando sonó el teléfono."]
      }
    ]
  },
  {
    "type": "examples",
    "title": "Zestawienie w jednym zdaniu",
    "items": [
      { "en": "Mientras cenábamos, llegó mi hermano.", "pl": "Kiedy jedliśmy kolację (tło), przyszedł mój brat (zdarzenie).", "highlight": "cenábamos" },
      { "en": "Cuando era niño, iba a la playa todos los veranos.", "pl": "Gdy byłem dzieckiem, jeździłem na plażę co lato (powtarzalność).", "highlight": "iba" },
      { "en": "El año pasado fui a España tres veces.", "pl": "W zeszłym roku pojechałem do Hiszpanii trzy razy (zamknięte, policzone).", "highlight": "fui" }
    ]
  },
  {
    "type": "table",
    "title": "Konstrukcje, które warto mieć gotowe do parafrazy",
    "headers": ["Zamiast", "Użyj", "Przykład"],
    "rows": [
      ["empezar a + bezokolicznik", "ponerse a", "Se puso a llover."],
      ["seguir + gerundio", "continuar + gerundio", "Sigue lloviendo."],
      ["tener que + bezokolicznik", "hay que / deber", "Hay que estudiar más."],
      ["volver a + bezokolicznik", "„znowu coś zrobić”", "Volvió a llamarme."],
      ["acabar de + bezokolicznik", "„dopiero co”", "Acabo de llegar."],
      ["strona bierna", "se + 3. osoba", "Se venden pisos."]
    ]
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Akcenty graficzne (tildes) to na rozszerzeniu realne punkty w kryterium poprawności: está vs esta, más vs mas, sí vs si, él vs el, sé vs se. Sprawdź je na końcu, zanim oddasz arkusz."
  },
  {
    "type": "quiz",
    "question": "Uzupełnij: „No creo que ___ razón en este asunto.”",
    "options": ["tiene", "tenga", "tendrá"],
    "correctIndex": 1,
    "explanation": "„No creo que” — zaprzeczony czasownik opinii wymaga subjuntivo: tenga. Bez przeczenia („Creo que tiene razón”) byłoby indicativo."
  },
  {
    "type": "quiz",
    "question": "Uzupełnij: „Mientras yo ___ la cena, mi hermano puso la mesa.”",
    "options": ["preparé", "preparaba", "prepare"],
    "correctIndex": 1,
    "explanation": "„Mientras” wprowadza tło trwające w tle innego zdarzenia — imperfecto: preparaba. Zdarzenie zamknięte to „puso”."
  },
  {
    "type": "quiz",
    "question": "Parafraza: „Otra vez me llamó por teléfono.” — zdanie o tym samym znaczeniu to:",
    "options": ["Acabó de llamarme.", "Volvió a llamarme.", "Se puso a llamarme."],
    "correctIndex": 1,
    "explanation": "„Volver a + bezokolicznik” znaczy „zrobić coś ponownie” i dokładnie oddaje „otra vez”. „Acabar de” to „dopiero co”, „ponerse a” to „zabrać się do”."
  }
]$content$::jsonb,
  1
);
