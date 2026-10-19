-- ============================================================================
-- supabase/seed/gitara/05_teoria_c_harmonia.sql
-- Dział 6, partia C: trójdźwięki, konsonans i dysonans, nazwy akordów, akordy w tonacji, kadencje, forma (6 lekcji).
-- Idempotentny: upsert po slug. Uruchom PO 01_topics.sql (dział `teoria-muzyki` jest tu
-- dodawany osobno, więc plik działa też sam). Bloki zgodne z lib/gitara/lesson-blocks.ts.
-- Treść: adaptacja podręcznika C. Schmidt-Jones, CC BY-SA 4.0 (patrz blok „Źródło” w lekcjach).
-- ============================================================================

insert into gtr_topics (slug, title, description, order_index) values (
  'teoria-muzyki', 'Teoria muzyki',
  'Zapis nutowy, rytm, gamy, interwały i akordy — teoria, która tłumaczy, dlaczego to, co grasz na gitarze, brzmi tak, a nie inaczej. Adaptacja polska podręcznika Catherine Schmidt-Jones z dopiskami dla gitarzysty.',
  6
)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  order_index = excluded.order_index, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'trojdzwieki',
  'Trójdźwięki',
  'Z czego zbudowany jest akord: pryma, tercja i kwinta, ich odwrócenia oraz co decyduje o tym, czy trójdźwięk jest durowy, molowy, zwiększony czy zmniejszony.',
  9, 16,
  $content$[
  {
    "type": "intro",
    "text": "Harmonia w muzyce zachodniej opiera się na **trójdźwiękach** — prostych akordach z trzech dźwięków ułożonych **w tercje**. Gdy grasz akord C-dur na gitarze, grasz właśnie trójdźwięk: C, E i G (czasem kilkakrotnie, w różnych oktawach)."
  },
  {
    "type": "definition",
    "term": "Postać zasadnicza",
    "text": "W postaci zasadniczej najniżej leży **pryma** — dźwięk, od którego akord bierze nazwę. Wyżej, o tercję od niej, leży **tercja** akordu, a o kwintę od prymy — **kwinta** (która jest też tercją nad tercją akordu). Trójdźwięk to więc po prostu stos tercji: pryma – tercja – kwinta."
  },
  {
    "type": "definition",
    "term": "Przewroty (odwrócenia)",
    "text": "Każdy akord złożony z tych samych dźwięków (o tych samych nazwach) to wciąż ten sam akord w innym układzie. Jeśli najniżej leży **tercja**, mamy **pierwszy przewrót**; jeśli najniżej leży **kwinta** — **drugi przewrót** (nazywany też akordem **sekstowo-kwartowym**, od interwałów, które się w nim tworzą). Liczy się tylko to, który dźwięk jest najniższy — nie to, jak daleko leżą pozostałe ani ile razy powtarzają się dźwięki w różnych oktawach.",
    "note": "Jeśli zmienisz wysokość lub zapis któregokolwiek dźwięku (np. F♯ na G♭), akord przestaje być przewrotem tego samego akordu — staje się innym akordem."
  },
  {
    "type": "table",
    "headers": [
      "Akord C-dur",
      "Najniższy dźwięk",
      "Zapis"
    ],
    "rows": [
      [
        "Postać zasadnicza",
        "C (pryma)",
        "C"
      ],
      [
        "I przewrót",
        "E (tercja)",
        "C/E"
      ],
      [
        "II przewrót",
        "G (kwinta)",
        "C/G"
      ]
    ],
    "title": "Trzy układy tego samego akordu",
    "caption": "W zapisie akordowym po ukośniku podajemy najniższy dźwięk (bas). Dla gitarzysty to po prostu zmiana, który dźwięk brzmi najniżej."
  },
  {
    "type": "chord-diagram",
    "title": "C, C/E i C/G",
    "chords": [
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "C/E",
        "chord": {
          "frets": [
            0,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "C/G",
        "chord": {
          "frets": [
            3,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            4,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "caption": "Te same trzy dźwięki: C, E, G. W C/E najniżej brzmi E (pusta struna 6), w C/G — G (3. próg struny 6)."
  },
  {
    "type": "definition",
    "term": "Co decyduje o nazwie",
    "text": "Nazwa akordu zależy od **interwałów między jego dźwiękami w postaci zasadniczej**, a nie od przewrotu. Przewrót zmienia brzmienie tylko odrobinę, natomiast zmiana jednego dźwięku (np. B na B♭ w akordzie G) zmienia akord diametralnie."
  },
  {
    "type": "table",
    "headers": [
      "Trójdźwięk",
      "Budowa (od prymy)",
      "Półtony",
      "Brzmienie",
      "C jako przykład"
    ],
    "rows": [
      [
        "Durowy",
        "tercja wielka + tercja mała",
        "4 + 3",
        "jasne, stabilne",
        "C E G"
      ],
      [
        "Molowy",
        "tercja mała + tercja wielka",
        "3 + 4",
        "ciemniejsze, smutniejsze",
        "C E♭ G"
      ],
      [
        "Zwiększony",
        "tercja wielka + tercja wielka",
        "4 + 4",
        "niespokojne, „zawieszone”",
        "C E G♯"
      ],
      [
        "Zmniejszony",
        "tercja mała + tercja mała",
        "3 + 3",
        "napięte, niestabilne",
        "C E♭ G♭"
      ]
    ],
    "title": "Cztery rodzaje trójdźwięków",
    "caption": "W durowym i molowym kwinta jest **czysta** (7 półtonów) — różni je tylko tercja. Zwiększony i zmniejszony nie mają czystej kwinty, więc brzmią niespokojnie i używa się ich oszczędnie."
  },
  {
    "type": "chord-diagram",
    "title": "E-dur i e-moll — różni je jeden dźwięk",
    "chords": [
      {
        "label": "E",
        "slug": "e-dur",
        "chord": {
          "frets": [
            0,
            2,
            2,
            1,
            0,
            0
          ],
          "fingers": [
            null,
            2,
            3,
            1,
            null,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Em",
        "slug": "em",
        "chord": {
          "frets": [
            0,
            2,
            2,
            0,
            0,
            0
          ],
          "fingers": [
            null,
            2,
            3,
            null,
            null,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "caption": "E-dur: E B E **G♯** B E. E-moll: E B E **G** B E. Tercja (G♯ → G) opada o półton, a akord zmienia się z jasnego w smutny. Wystarczy zdjąć jeden palec."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Power chord to nie dur i nie moll.** Akord potęgowy (np. E5) to tylko pryma i kwinta, **bez tercji** — dlatego brzmi mocno i „neutralnie”, a o charakterze durowym lub molowym decyduje wtedy melodia i reszta zespołu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Aby rozpoznać akord z dowolnej tabulatury lub diagramu: wypisz dźwięki, **ułóż je w stos tercji** (przestawiając oktawy), znajdź prymę — i licz półtony między prymą, tercją i kwintą."
  },
  {
    "type": "quiz",
    "question": "Z jakich dźwięków składa się akord G-dur?",
    "options": [
      "G A D",
      "G B D",
      "G B♭ D",
      "G B D♯"
    ],
    "correctIndex": 1,
    "explanation": "G-dur: pryma G, tercja wielka B (4 półtony), kwinta czysta D (7 półtonów). Wersja z B♭ to g-moll."
  },
  {
    "type": "quiz",
    "question": "Który trójdźwięk ma tercję małą i kwintę czystą?",
    "options": [
      "durowy",
      "molowy",
      "zwiększony",
      "zmniejszony"
    ],
    "correctIndex": 1,
    "explanation": "Molowy: tercja mała (3 półtony) + tercja wielka (4), razem kwinta czysta (7 półtonów)."
  },
  {
    "type": "quiz",
    "question": "W akordzie C/E (E w basie) najniżej brzmi…",
    "options": [
      "prymy akordu (C)",
      "tercja akordu (E)",
      "kwinta akordu (G)",
      "septyma akordu"
    ],
    "correctIndex": 1,
    "explanation": "C/E to pierwszy przewrót: najniżej leży tercja akordu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'konsonans-i-dysonans',
  'Konsonans i dysonans',
  'Dlaczego niektóre interwały i akordy brzmią stabilnie, a inne „ciągną” do rozwiązania — i jak to wykorzystać w progresji.',
  7, 17,
  $content$[
  {
    "type": "intro",
    "text": "Dźwięki, które brzmią razem przyjemnie, nazywamy **konsonansami**. Akord zbudowany z samych konsonansów wydaje się **stabilny** — mógłbyś słuchać go długo, nie czując potrzeby zmiany. **Dysonanse** mogą brzmieć ostro albo po prostu „niestabilnie”: słuchacz czuje, że muzyka chce przejść dalej, do akordu, który to napięcie rozładuje."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "To, co wydaje się przyjemne, jest po części **kwestią kultury** i zmieniało się przez wieki. Tu mowa o muzyce zachodniej. Nie chodzi też o nieczysty strój — to osobna sprawa."
  },
  {
    "type": "table",
    "headers": [
      "Konsonanse",
      "Dysonanse"
    ],
    "rows": [
      [
        "tercja mała, tercja wielka",
        "sekunda mała, sekunda wielka"
      ],
      [
        "kwarta czysta, kwinta czysta",
        "septyma mała, septyma wielka"
      ],
      [
        "seksta mała, seksta wielka",
        "**tryton** (najbardziej napięty)"
      ],
      [
        "oktawa",
        ""
      ]
    ],
    "title": "Które interwały są które",
    "caption": "Akord złożony wyłącznie z konsonansów (np. trójdźwięk durowy lub molowy) jest stabilny. Dodana septyma, sekunda czy tryton wprowadzają dysonans."
  },
  {
    "type": "definition",
    "term": "Rozwiązanie",
    "text": "Przejście od dysonansu do konsonansu, którego się spodziewamy, to **rozwiązanie**. Wzór napięcia i rozładowania to jedno ze źródeł tego, że muzyka jest ciekawa. Muzyka bez dysonansów bywa nudna; muzyka z samymi nierozwiązanymi dysonansami bywa męcząca, bo słuchacz zostaje bez odprężenia."
  },
  {
    "type": "progression",
    "title": "Napięcie i rozładowanie: G7 → C",
    "chords": [
      {
        "label": "G7",
        "slug": "g7",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            1
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            1
          ],
          "baseFret": 1
        }
      },
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "G7 zawiera dysonans (F i B tworzą tryton) i „chce” wrócić do C. Posłuchaj, jak C brzmi jak ulga. To najczęstsze rozwiązanie w muzyce."
  },
  {
    "type": "progression",
    "title": "Akord „zawieszony”: Dsus4 → D",
    "chords": [
      {
        "label": "Dsus4",
        "slug": "dsus4",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            3,
            3
          ],
          "fingers": [
            null,
            null,
            null,
            1,
            3,
            4
          ],
          "baseFret": 1
        }
      },
      {
        "label": "D",
        "slug": "d",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            3,
            2
          ],
          "fingers": [
            null,
            null,
            null,
            1,
            3,
            2
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "Czwarty stopień zajmuje miejsce tercji i wisi w powietrzu. Gdy opada do tercji (G → F♯), akord się rozwiązuje."
  },
  {
    "type": "tab",
    "title": "Tryton na gryfie",
    "tabText": "e|----|\nB|----|\nG|----|\nD|-3--|\nA|-2--|\nE|----|",
    "caption": "B (struna A, próg 2) i F (struna D, próg 3) brzmią razem jako tryton — sześć półtonów. Zagraj go i posłuchaj, jak „domaga się” rozwiązania, np. do C–E."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Dlaczego tak brzmi?** W prostym ujęciu fale dźwiękowe konsonansów „pasują” do siebie lepiej: przy oktawie na jedną falę dolnego dźwięku przypadają dokładnie dwie fale górnego. Gdy stosunek jest skomplikowany, fale „nie leżą” na sobie. Dlatego w szeregu harmonicznym (lekcja o harmonicznych) czyste interwały mają małe liczby."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Dodanie septymy do akordu (np. G → G7) wnosi dysonans, który ładnie „ciągnie” do następnego akordu. Zagraj G7, zatrzymaj się i posłuchaj, czy chcesz zagrać C — to ta potrzeba rozwiązania. Zwykłe G–C jest spokojniejsze, G7–C wyraźniejsze."
  },
  {
    "type": "quiz",
    "question": "Który interwał jest uznawany za najbardziej dysonujący („napięty”)?",
    "options": [
      "kwinta czysta",
      "tercja wielka",
      "tryton",
      "oktawa"
    ],
    "correctIndex": 2,
    "explanation": "Tryton (6 półtonów) leży między kwartą a kwintą czystą i jest szczególnie niestabilny."
  },
  {
    "type": "quiz",
    "question": "Jak nazywa się przejście od dysonansu do spodziewanego konsonansu?",
    "options": [
      "modulacja",
      "rozwiązanie",
      "transpozycja",
      "synkopa"
    ],
    "correctIndex": 1,
    "explanation": "To rozwiązanie. Wzór napięcia i rozwiązania nadaje muzyce dramaturgię."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'nazwy-akordow',
  'Nazwy akordów: septymy i rozszerzenia',
  'Jak odczytać symbol akordu (G7, Cmaj7, Dsus4, Am/G…) i samemu ustalić, z jakich dźwięków się składa.',
  10, 18,
  $content$[
  {
    "type": "intro",
    "text": "Gitarzyści i pianiści często dostają tylko **symbol akordu** nad tekstem, bez zapisanych nut. Wystarczy znać nazwę akordu, gamy durowe i molowe oraz kilka reguł, żeby samemu ustalić, z jakich dźwięków akord się składa. To bardzo praktyczna umiejętność."
  },
  {
    "type": "steps",
    "title": "Jak odczytać symbol akordu",
    "steps": [
      {
        "title": "1. Trójdźwięk",
        "text": "Zacznij od nazwy bazowej: **C** = dur, **Cm** = moll, **Cdim** = zmniejszony, **Caug** (lub C+) = zwiększony."
      },
      {
        "title": "2. Dźwięki dodatkowe",
        "text": "Liczba po nazwie to numer stopnia gamy **od prymy akordu**: „4” w Csus4 to czwarty dźwięk gamy C, „7” w Dm7 to siódmy dźwięk gamy d-moll naturalnej."
      },
      {
        "title": "3. Zmiany",
        "text": "Znaki „♭5”, „♯9” mówią, że dany dźwięk jest **zmieniony** względem gamy prymy akordu (nie względem tonacji utworu)."
      },
      {
        "title": "4. Bas",
        "text": "Po ukośniku zapisuje się dźwięk basowy: **C/E** — akord C-dur z E na dole."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Akordy septymowe",
    "text": "Dodaj do trójdźwięku **septymę** (dźwięk o septymę od prymy) i masz **akord septymowy**. Typ akordu zależy od trójdźwięku **i** od rodzaju septymy. Łatwo zapamiętać: septyma wielka leży o półton pod oktawą, septyma mała — o półton niżej, a zmniejszona — jeszcze o półton niżej."
  },
  {
    "type": "table",
    "headers": [
      "Symbol (od C)",
      "Nazwa",
      "Budowa",
      "Dźwięki"
    ],
    "rows": [
      [
        "C7",
        "septymowy (dominantowy)",
        "dur + septyma mała",
        "C E G B♭"
      ],
      [
        "Cmaj7",
        "durowo-wielkoseptymowy",
        "dur + septyma wielka",
        "C E G B"
      ],
      [
        "Cm7",
        "molowo-septymowy",
        "moll + septyma mała",
        "C E♭ G B♭"
      ],
      [
        "Cdim7",
        "zmniejszony septymowy",
        "zmniejszony + septyma zmniejszona",
        "C E♭ G♭ B♭♭ (=A)"
      ],
      [
        "Cm7♭5",
        "półzmniejszony",
        "zmniejszony + septyma mała",
        "C E♭ G♭ B♭"
      ]
    ],
    "title": "Najpopularniejsze akordy septymowe",
    "caption": "C7 (z septymą małą) nazywamy też akordem dominantowym — najczęstsza ozdoba akordu V w tonacji."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Ciekawostka.** Akordy zmniejszone septymowe są symetryczne: Ddim7, Fdim7, A♭dim7 i Bdim7 składają się z tych samych dźwięków (D F A♭ B), tylko inaczej nazwanych. Każdy z nich może więc rozwiązywać się w kilku kierunkach."
  },
  {
    "type": "definition",
    "term": "Dźwięki dodane, zawieszenia, rozszerzenia",
    "text": "Można dodać nie tylko septymę. **Dodane** dźwięki (add) to pojedyncze dźwięki z gamy prymy: **Cadd9** to C-dur z dodanym D. **Zawieszenie** (sus) zastępuje tercję sekundą (**sus2**) lub kwartą (**sus4**): Csus4 = C F G. **Rozszerzenia** (9, 11, 13) kontynuują stos tercji ponad septymę: **C9** zwykle zawiera septymę małą i dodatkowo dźwięk D.",
    "note": "Każdy dodany dźwięk i septyma wnoszą dysonans. W jazzie i popie wiele takich akordów brzmi ciekawie i nie wymaga rozwiązania, w innych stylach dysonans trzeba rozwiązać."
  },
  {
    "type": "table",
    "headers": [
      "Symbol (od C)",
      "Dźwięki",
      "Uwagi"
    ],
    "rows": [
      [
        "C",
        "C E G",
        "trójdźwięk durowy"
      ],
      [
        "Csus2",
        "C D G",
        "tercja zastąpiona sekundą"
      ],
      [
        "Csus4",
        "C F G",
        "tercja zastąpiona kwartą; „chce” rozwiązać się do C"
      ],
      [
        "Cadd9",
        "C E G D",
        "tylko dodana nona (bez septymy)"
      ],
      [
        "C6",
        "C E G A",
        "dodana seksta"
      ],
      [
        "C9",
        "C E G B♭ D",
        "septyma mała + nona"
      ]
    ],
    "title": "Dodane dźwięki i zawieszenia",
    "caption": "Zawieszenie sus4 i rozszerzenie 11 mają te same nazwy dźwięku F, ale brzmią inaczej: sus4 trzyma F tuż obok basu zamiast tercji, a w 11 F leży wysoko, nad całym akordem."
  },
  {
    "type": "definition",
    "term": "Alteracje i bas",
    "text": "Jeśli dźwięk akordu nie należy do gamy durowej lub molowej jego prymy, mamy **alterację** (np. **C7♭9** lub **G7♯5**). Alteracje są zawsze liczone od gamy **prymy akordu**, a nie od tonacji utworu. Po ukośniku zapisuje się bas: C/E to pierwszy przewrót, a **C/B** — C-dur z dodanym dźwiękiem B w basie. Gdy bas nie jest wskazany, graj prymę."
  },
  {
    "type": "chord-diagram",
    "title": "Kilka akordów z tej lekcji",
    "chords": [
      {
        "label": "G7",
        "slug": "g7",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            1
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            1
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Cmaj7",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            0,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            null,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Em7",
        "chord": {
          "frets": [
            0,
            2,
            0,
            0,
            0,
            0
          ],
          "fingers": [
            null,
            2,
            null,
            null,
            null,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Am7",
        "slug": "am7",
        "chord": {
          "frets": [
            null,
            0,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            null,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Dsus2",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            3,
            0
          ],
          "fingers": [
            null,
            null,
            null,
            1,
            2,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Dsus4",
        "slug": "dsus4",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            3,
            3
          ],
          "fingers": [
            null,
            null,
            null,
            1,
            3,
            4
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Cadd9",
        "slug": "cadd9",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            3,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            4,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "caption": "G7 = G B D F, Cmaj7 = C E G B, Em7 = E G B D, Am7 = A C E G, Dsus2 = D E A, Dsus4 = D G A, Cadd9 = C E G D. Sprawdź na diagramie, które dźwięki powstały z których."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Ćwiczenie.** Weź akord, którego nie znasz (np. F6, Am/G, Fsus4, Bmaj7), ustal z reguł, jakie dźwięki w nim są, znajdź wygodny chwyt na gryfie i zagraj go. Z czasem rozpoznasz brzmienie po symbolu."
  },
  {
    "type": "quiz",
    "question": "Z jakich dźwięków składa się Cmaj7?",
    "options": [
      "C E G B♭",
      "C E G B",
      "C E♭ G B",
      "C F G B"
    ],
    "correctIndex": 1,
    "explanation": "Cmaj7 to C-dur z septymą wielką (B). Z septymą małą (B♭) byłby to C7."
  },
  {
    "type": "quiz",
    "question": "Co zastępuje tercję w akordzie sus4?",
    "options": [
      "sekunda",
      "kwarta",
      "seksta",
      "septyma"
    ],
    "correctIndex": 1,
    "explanation": "Sus4 zastępuje tercję kwartą: np. Dsus4 = D G A. Sus2 zastępuje ją sekundą."
  },
  {
    "type": "quiz",
    "question": "Co oznacza „/E” w zapisie C/E?",
    "options": [
      "Dodaj dźwięk E do akordu",
      "Najniższy dźwięk to E",
      "Zagraj w tonacji E",
      "Pomiń E"
    ],
    "correctIndex": 1,
    "explanation": "Po ukośniku zapisujemy bas: C/E to akord C-dur z dźwiękiem E na dole (pierwszy przewrót)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'akordy-w-tonacji',
  'Akordy w tonacji',
  'Które akordy pasują do tonacji, jak je numerować (I, IV, V…) i skąd biorą się najpopularniejsze progresje.',
  10, 19,
  $content$[
  {
    "type": "intro",
    "text": "**Analiza harmoniczna** to po prostu zrozumienie, jak akord jest związany z tonacją i z innymi akordami utworu. Pozornie brzmi poważnie, ale wielu muzyków, którzy nie znają nut, potrafi powiedzieć, który akord jest „jedynką” albo „piątką”. Po co to wiedzieć? Bo dzięki temu zagrasz tę samą progresję w dowolnej tonacji, szybciej dobierzesz akordy do melodii i zrozumiesz formy takie jak 12-taktowy blues."
  },
  {
    "type": "definition",
    "term": "Akordy tonacji durowej",
    "text": "W każdej tonacji najpewniej usłyszysz akordy zbudowane **wyłącznie z dźwięków tonacji**. Buduje się je na każdym stopniu gamy i numeruje cyframi rzymskimi: **duże** cyfry (I, IV, V) dla durowych, **małe** (ii, iii, vi) dla molowych, a zmniejszony zapisuje się małą cyfrą z kółkiem (vii°). Wzór jest taki sam w każdej tonacji durowej: durowe stopnie 1, 4, 5; molowe 2, 3, 6; zmniejszony 7."
  },
  {
    "type": "table",
    "headers": [
      "Tonacja",
      "I",
      "ii",
      "iii",
      "IV",
      "V",
      "vi",
      "vii°"
    ],
    "rows": [
      [
        "C-dur",
        "C",
        "Dm",
        "Em",
        "F",
        "G",
        "Am",
        "B°"
      ],
      [
        "G-dur",
        "G",
        "Am",
        "Bm",
        "C",
        "D",
        "Em",
        "F♯°"
      ],
      [
        "D-dur",
        "D",
        "Em",
        "F♯m",
        "G",
        "A",
        "Bm",
        "C♯°"
      ],
      [
        "A-dur",
        "A",
        "Bm",
        "C♯m",
        "D",
        "E",
        "F♯m",
        "G♯°"
      ],
      [
        "E-dur",
        "E",
        "F♯m",
        "G♯m",
        "A",
        "B",
        "C♯m",
        "D♯°"
      ],
      [
        "F-dur",
        "F",
        "Gm",
        "Am",
        "B♭",
        "C",
        "Dm",
        "E°"
      ]
    ],
    "title": "Akordy w kilku tonacjach durowych",
    "caption": "Uważaj na krzyżyki i bemole: IV w B♭-dur to E♭-dur, nie E; vii° w G-dur to F♯ zmniejszony, nie F. Dlatego warto znać gamy."
  },
  {
    "type": "table",
    "headers": [
      "Stopień",
      "Nazwa funkcyjna",
      "Rola"
    ],
    "rows": [
      [
        "I",
        "tonika",
        "„dom”, środek tonalny — najczęstszy akord"
      ],
      [
        "ii",
        "supertonika (subdominanta paralelna)",
        "przygotowuje V"
      ],
      [
        "iii",
        "medianta (dominanta paralelna)",
        "rzadziej używana"
      ],
      [
        "IV",
        "subdominanta",
        "oddala od toniki, bardzo częsta"
      ],
      [
        "V",
        "dominanta",
        "najmocniej ciągnie do toniki"
      ],
      [
        "vi",
        "submedianta (tonika paralelna)",
        "paralelny moll — „smutny” zamiennik toniki"
      ],
      [
        "vii°",
        "(zmniejszony)",
        "niestabilny, silnie ciągnie do I"
      ]
    ],
    "title": "Funkcje akordów",
    "caption": "W całej muzyce zachodniej akord I jest „domem”, a **V7** (V z septymą małą) mocno mówi „czas wracać do domu”. Dlatego V7 → I tak dobrze kończy utwór."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Trzy akordy wystarczą.** Wiele piosenek ludowych, bluesów, marszów i rockowych utworów da się zagrać tylko z akordów **I, IV, V** (czasem V7). W G-dur to **G, C, D**, w D-dur **D, G, A**, w A-dur **A, D, E**, w C-dur **C, F, G**. Początkujący gitarzyści to uwielbiają."
  },
  {
    "type": "progression",
    "title": "Najpopularniejsza progresja: I – V – vi – IV (G – D – Em – C)",
    "chords": [
      {
        "label": "G",
        "slug": "g",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            3
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            4
          ],
          "baseFret": 1
        }
      },
      {
        "label": "D",
        "slug": "d",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            3,
            2
          ],
          "fingers": [
            null,
            null,
            null,
            1,
            3,
            2
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Em",
        "slug": "em",
        "chord": {
          "frets": [
            0,
            2,
            2,
            0,
            0,
            0
          ],
          "fingers": [
            null,
            2,
            3,
            null,
            null,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 80,
    "caption": "Bardzo wiele piosenek pop i rock opiera się na tym schemacie. Zagraj go w G-dur, potem przenieś na inną tonację tym samym wzorem stopni (np. C – G – Am – F)."
  },
  {
    "type": "table",
    "headers": [
      "Takt",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "rows": [
      [
        "Stopień",
        "I",
        "I",
        "I",
        "I",
        "IV",
        "IV",
        "I",
        "I",
        "V",
        "IV",
        "I",
        "V"
      ],
      [
        "W A-dur",
        "A",
        "A",
        "A",
        "A",
        "D",
        "D",
        "A",
        "A",
        "E",
        "D",
        "A",
        "E"
      ]
    ],
    "title": "12-taktowy blues (wersja podstawowa)",
    "caption": "Wiele bluesów gra się z akordami septymowymi: A7, D7, E7. Zmienia się tonacja i tempo, ale schemat stopni jest ten sam: cztery takty I, dwa IV, dwa I, V–IV–I–V."
  },
  {
    "type": "progression",
    "title": "Szkielet bluesa w A: A7 – D7 – A7 – E7",
    "chords": [
      {
        "label": "A7",
        "slug": "a7",
        "chord": {
          "frets": [
            null,
            0,
            2,
            0,
            2,
            0
          ],
          "fingers": [
            null,
            null,
            1,
            null,
            2,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "D7",
        "slug": "d7",
        "chord": {
          "frets": [
            null,
            null,
            0,
            2,
            1,
            2
          ],
          "fingers": [
            null,
            null,
            null,
            3,
            1,
            2
          ],
          "baseFret": 1
        }
      },
      {
        "label": "A7",
        "slug": "a7",
        "chord": {
          "frets": [
            null,
            0,
            2,
            0,
            2,
            0
          ],
          "fingers": [
            null,
            null,
            1,
            null,
            2,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "E7",
        "slug": "e7",
        "chord": {
          "frets": [
            0,
            2,
            0,
            1,
            0,
            0
          ],
          "fingers": [
            null,
            2,
            null,
            1,
            null,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 80,
    "caption": "Cztery akordy skrótowo oddają charakter bluesa: toniki, subdominanta, tonika, dominanta. Dodaj powtórzenia, żeby wypełnić 12 taktów."
  },
  {
    "type": "definition",
    "term": "Tonacje molowe",
    "text": "W tonacji molowej akordy mają inny układ. Dla gamy molowej naturalnej: **i, ii°, III, iv, v, VI, VII**. W gamie harmonicznej siódmy stopień jest podniesiony, więc akord **V jest durowy** (a nie molowy), a **vii°** — zmniejszony; dzięki temu muzyka mocniej ciągnie do toniki."
  },
  {
    "type": "table",
    "headers": [
      "Tonacja",
      "i",
      "ii°",
      "III",
      "iv",
      "v (lub V)",
      "VI",
      "VII"
    ],
    "rows": [
      [
        "a-moll",
        "Am",
        "B°",
        "C",
        "Dm",
        "Em (E)",
        "F",
        "G"
      ],
      [
        "e-moll",
        "Em",
        "F♯°",
        "G",
        "Am",
        "Bm (B)",
        "C",
        "D"
      ],
      [
        "d-moll",
        "Dm",
        "E°",
        "F",
        "Gm",
        "Am (A)",
        "B♭",
        "C"
      ]
    ],
    "title": "Akordy w tonacjach molowych",
    "caption": "W nawiasach: akord V z gamy harmonicznej, najczęściej grany w kadencji. Tonacja molowa i jej paralelny dur mają te same dźwięki, ale inną tonikę."
  },
  {
    "type": "definition",
    "term": "Modulacja",
    "text": "Utwór może tymczasowo przejść do innej tonacji — to **modulacja**. W muzyce klasycznej zwykle do tonacji blisko spokrewnionej (dominantowej, subdominantowej, paralelnej). Znajdziesz ją po nagłym napływie znaków przygodnych albo zmianie znaków przykluczowych. W popie ulubiony zabieg to przeniesienie utworu **o cały ton w górę** (np. z C-dur do D-dur) na ostatnie refreny."
  },
  {
    "type": "quiz",
    "question": "Jaki akord to vi w tonacji G-dur?",
    "options": [
      "Am",
      "Bm",
      "Em",
      "C"
    ],
    "correctIndex": 2,
    "explanation": "G-dur: G Am Bm C D Em F♯°. Szósty stopień to Em (paralelny moll G-dur)."
  },
  {
    "type": "quiz",
    "question": "Jaki akord to IV w tonacji B♭-dur?",
    "options": [
      "E♭",
      "E",
      "F",
      "G♭"
    ],
    "correctIndex": 0,
    "explanation": "IV stopień to czwarty dźwięk gamy B♭-dur (B♭ C D E♭ F G A): E♭-dur. Nie E."
  },
  {
    "type": "quiz",
    "question": "Które trzy akordy to I, IV i V w tonacji D-dur?",
    "options": [
      "D G A",
      "D E A",
      "D C G",
      "D F A"
    ],
    "correctIndex": 0,
    "explanation": "D-dur: D E F♯ G A B C♯. I = D, IV = G, V = A."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'kadencje',
  'Kadencje',
  'Jak muzyka sygnalizuje koniec frazy i utworu: kadencja autentyczna, plagalna, półkadencja, zwodnicza i jak ich używać na gitarze.',
  8, 20,
  $content$[
  {
    "type": "intro",
    "text": "**Kadencja** to miejsce w muzyce, w którym czujemy zakończenie — mocne i ostateczne (koniec utworu, zwrotki) albo tymczasowe, takie jak przecinek w zdaniu. Fraza muzyczna jest jak zdanie: zawiera myśl, po której następuje pauza. Część fraz brzmi jak pytanie, na które czekamy odpowiedzi; inne kończą się z poczuciem „doszliśmy”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Muzyka może zakończyć się po prostu, zatrzymując się, ale słuchacz uzna to za niedokończone. Zadowalające zakończenie, jak w dobrej opowieści, przygotowuje się wcześniej (zwolnienie, narastanie napięcia) i kończy w sposób, którego słuchacz się spodziewa."
  },
  {
    "type": "definition",
    "term": "Co daje wrażenie kadencji",
    "text": "Najważniejsza w tonalnej muzyce jest **harmonia**: utwór niemal na pewno kończy się akordem toniki, a frazy mogą kończyć się innym akordem (np. dominantą). Ale ważne są też **melodia** (zwykle kończy się dźwiękiem toniki, a to daje silniejsze zakończenie niż tercja czy kwinta), **rytm** (pauza, zwolnienie), **faktura** (np. przejście z wielogłosu do jednego głosu) oraz **forma** (kadencje wyznaczają granice fraz — co osiem taktów, co szesnaście)."
  },
  {
    "type": "table",
    "headers": [
      "Kadencja",
      "Progresja",
      "Jak brzmi",
      "W C-dur"
    ],
    "rows": [
      [
        "Autentyczna (doskonała)",
        "V (lub V7) → I",
        "najsilniejsze, ostateczne zakończenie",
        "G7 → C"
      ],
      [
        "Plagalna („amen”)",
        "IV → I",
        "łagodniejsze; znane z kościelnego „amen”",
        "F → C"
      ],
      [
        "Półkadencja",
        "dowolny akord → V",
        "zatrzymanie w pół drogi — „pytanie”",
        "C → G"
      ],
      [
        "Zwodnicza",
        "V → vi (zamiast I)",
        "oczekujemy toniki, a dostajemy inny akord",
        "G → Am"
      ]
    ],
    "title": "Najczęstsze kadencje",
    "caption": "Nazewnictwo bywa niejednoznaczne: ta sama kadencja ma kilka nazw (autentyczna = doskonała = pełna; zwodnicza = przerwana = fałszywa). Uważaj — niektóre podręczniki używają „półkadencji” także na określenie kadencji plagalnej."
  },
  {
    "type": "progression",
    "title": "Kadencja autentyczna: G7 → C",
    "chords": [
      {
        "label": "G7",
        "slug": "g7",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            1
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            1
          ],
          "baseFret": 1
        }
      },
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "Najmocniejsze zakończenie. Dominanta z septymą ciągnie do toniki — dlatego tyle utworów kończy się właśnie tak."
  },
  {
    "type": "progression",
    "title": "Kadencja plagalna: F → C",
    "chords": [
      {
        "label": "F",
        "slug": "f-dur",
        "chord": {
          "frets": [
            1,
            3,
            3,
            2,
            1,
            1
          ],
          "fingers": [
            1,
            3,
            4,
            2,
            1,
            1
          ],
          "baseFret": 1,
          "barre": {
            "fret": 1,
            "fromString": 0,
            "toString": 5
          }
        }
      },
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "Łagodniejsza, „amen”. Ten sam wzór IV → I w innych tonacjach to np. C → G (w G-dur) albo G → D (w D-dur)."
  },
  {
    "type": "progression",
    "title": "Półkadencja: C → G",
    "chords": [
      {
        "label": "C",
        "slug": "c",
        "chord": {
          "frets": [
            null,
            3,
            2,
            0,
            1,
            0
          ],
          "fingers": [
            null,
            3,
            2,
            null,
            1,
            null
          ],
          "baseFret": 1
        }
      },
      {
        "label": "G",
        "slug": "g",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            3
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            4
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "Kończy się na dominancie, więc brzmi jak pytanie. Dobra na koniec pierwszej frazy, a odpowiedzią będzie kolejna fraza zakończona na toniki."
  },
  {
    "type": "progression",
    "title": "Kadencja zwodnicza: G → Am",
    "chords": [
      {
        "label": "G",
        "slug": "g",
        "chord": {
          "frets": [
            3,
            2,
            0,
            0,
            0,
            3
          ],
          "fingers": [
            3,
            2,
            null,
            null,
            null,
            4
          ],
          "baseFret": 1
        }
      },
      {
        "label": "Am",
        "slug": "am",
        "chord": {
          "frets": [
            null,
            0,
            2,
            2,
            1,
            0
          ],
          "fingers": [
            null,
            null,
            2,
            3,
            1,
            null
          ],
          "baseFret": 1
        }
      }
    ],
    "bpm": 60,
    "caption": "Słuchacz oczekuje C po G, a dostaje Am — podobne dźwięki, ale inne zakończenie. Pozwala przedłużyć utwór."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Ćwiczenie.** Weź dobrze znaną piosenkę, znajdź w niej wszystkie pauzy i zakończenia fraz i zbadaj ostatnie dwa akordy przed każdą. Jaka to kadencja? Po kilku piosenkach zaczniesz rozpoznawać je ze słuchu."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Na gitarze.** Zakończenie utworu zwykle gramy kadencją autentyczną: V7 → I, a przedostatni akord możesz podkreślić zwolnieniem (rit.). Gdy kończysz pierwszą frazę, spróbuj półkadencji, a drugą — autentyczną: tak powstają zwrotki typu pytanie–odpowiedź."
  },
  {
    "type": "quiz",
    "question": "Jak nazywa się kadencja IV → I (np. F → C)?",
    "options": [
      "autentyczna",
      "plagalna",
      "zwodnicza",
      "półkadencja"
    ],
    "correctIndex": 1,
    "explanation": "Kadencja plagalna (IV → I) znana jest jako „amen” z hymnów."
  },
  {
    "type": "quiz",
    "question": "Na którym akordzie kończy się półkadencja?",
    "options": [
      "I",
      "IV",
      "V",
      "vi"
    ],
    "correctIndex": 2,
    "explanation": "Półkadencja kończy się na dominancie (V), przez co brzmi jak niedokończone zdanie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

insert into gtr_lessons (topic_id, slug, title, summary, reading_minutes, order_index, content) values (
  (select id from gtr_topics where slug = 'teoria-muzyki'),
  'forma-utworu',
  'Forma utworu',
  'Jak opisać budowę piosenki lub utworu literami (A, B), jak nazywa się typowe formy i jak ułatwia to naukę nowych utworów.',
  8, 21,
  $content$[
  {
    "type": "intro",
    "text": "Każdy utwór ma **plan** — ogólną strukturę, „duży obraz”. Proste lub powtarzalne utwory ogarniamy od razu (jak ścianę z identycznych cegieł); bardziej złożone wymagają przesłuchania lub nauki. Rozpoznanie formy pomaga wykonać utwór sensowniej, a słuchaczowi — lepiej się nim cieszyć."
  },
  {
    "type": "definition",
    "term": "Opisywanie formy literami",
    "text": "Każdą dużą część utworu oznacza się literą: pierwsza to **A**. Jeśli druga część jest identyczna z pierwszą, to też A. Jeśli bardzo podobna, ale z istotnymi różnicami — **A′** („A z kreską”), a kolejna wariacja to **A″**. Pierwsza część wyraźnie inna to **B**, następna jeszcze inna to **C**."
  },
  {
    "type": "steps",
    "title": "Jak wykryć części utworu",
    "steps": [
      {
        "title": "Słuchaj powtórzeń",
        "text": "Powtarzającym się fragmentom dawaj tę samą literę."
      },
      {
        "title": "Słuchaj zmian",
        "text": "Nowa część zwykle różni się w kilku rzeczach naraz: melodia, harmonia, rytm, faktura, barwa."
      },
      {
        "title": "Zapisz plan",
        "text": "Np. A A B A, a potem sprawdź, czy któryś fragment wraca z drobnymi zmianami (A′)."
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Część",
      "Co to jest"
    ],
    "rows": [
      [
        "Zwrotka",
        "ta sama melodia, **inny tekst**"
      ],
      [
        "Refren",
        "ta sama melodia **i ten sam tekst**"
      ],
      [
        "Bridge (przejście)",
        "nowy materiał, zwykle późno w utworze, często zamiast zwrotki i prowadzący do refrenu"
      ],
      [
        "Część instrumentalna",
        "ważny fragment bez śpiewu: na początku, na końcu albo między innymi częściami"
      ]
    ],
    "title": "Części typowej piosenki",
    "caption": "Układ zwrotka – refren – zwrotka – refren – bridge – refren to schemat bardzo wielu piosenek. W jazzie „bridge” to część B w układzie A A B A (patrz niżej)."
  },
  {
    "type": "definition",
    "term": "Forma w mniejszej skali",
    "text": "Literami można też oznaczać mniejsze części: nawet pojedyncze frazy. Np. jedna zwrotka może mieć formę **A A′ B A″**, czyli frazy o podobnej melodii. Układ **A A B A** jest powszechny w zwrotkach od folku po jazz i pop; zwrotki bluesa często mają formę **A A′ B** (dwie podobne linijki i odpowiedź)."
  },
  {
    "type": "table",
    "headers": [
      "Forma",
      "Plan",
      "Charakterystyka"
    ],
    "rows": [
      [
        "Przekomponowana",
        "jedna część bez dużych powtórzeń",
        "krótki utwór bez powrotów"
      ],
      [
        "Zwrotkowa",
        "zwrotki (A A′ A″ …), opcjonalnie z refrenem",
        "ta sama muzyka, inne słowa"
      ],
      [
        "Wariacje",
        "A A′ A″ A‴ …",
        "ta sama melodia/harmonia, zmienia się rytm, tempo, faktura lub barwa"
      ],
      [
        "Rondo",
        "A B A C A (A B A C A B A)",
        "główna część wraca po każdej nowej"
      ],
      [
        "Dwuczęściowa",
        "A B",
        "dwie różne części"
      ],
      [
        "Trzyczęściowa",
        "A B A lub A B A′",
        "powrót pierwszej części"
      ],
      [
        "Jazzowy standard",
        "A A B A, powtarzane wiele razy",
        "temat gra się na początku i na końcu, a w środku improwizacje na tym samym układzie akordów; część B to „bridge”"
      ],
      [
        "Cykliczna",
        "powtarzany krótki fragment (ostinato) lub cykl części",
        "stała powtórka jednej linii z różnymi dodatkami"
      ],
      [
        "Sonatowa",
        "ekspozycja – przetworzenie – repryza",
        "złożona forma klasyczna, np. pierwsza część sonaty"
      ],
      [
        "Taniec",
        "powtórki o ustalonej liczbie taktów (4, 8, 16, 32)",
        "dopasowane do kroków"
      ]
    ],
    "title": "Wybrane nazwane formy",
    "caption": "Formy nie są sztywnymi regułami: kompozytor może je łamać i łączyć (np. rondo sonatowe)."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** 12-taktowy blues to forma, którą znasz z poprzedniej lekcji: ten sam układ akordów powtarzany w kółko, a zwrotki są wypełniane tekstem lub solówkami. To bliska kuzynka jazzowego standardu: jeden powtarzany „chorus” i improwizacje."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Ćwiczenie.** Wybierz trzy ulubione piosenki i odsłuchaj każdą kilka razy, aż ustalisz pełną formę literami (z kreskami). Porównaj: ile zwrotek? ile refrenów? czy jest bridge? Czy zwrotki mają formę A A B A?"
  },
  {
    "type": "quiz",
    "question": "Czym różni się zwrotka od refrenu?",
    "options": [
      "Zwrotka ma tę samą melodię i ten sam tekst",
      "Zwrotka ma tę samą melodię, ale inny tekst",
      "Refren zawsze jest wolniejszy",
      "Nie ma różnicy"
    ],
    "correctIndex": 1,
    "explanation": "Zwrotki mają tę samą melodię, lecz inne słowa. Refren powtarza się z tą samą melodią i tym samym tekstem."
  },
  {
    "type": "quiz",
    "question": "Jaki plan ma rondo?",
    "options": [
      "A B",
      "A A′ A″",
      "A B A C A",
      "A A B A"
    ],
    "correctIndex": 2,
    "explanation": "Rondo: główna część wraca między częściami nowej muzyki — A B A C A."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Źródło i licencja.** Lekcja jest polską adaptacją i skrótem fragmentów podręcznika Catherine Schmidt-Jones „Understanding Basic Music Theory” (Connexions / OpenStax CNX), udostępnionego na licencji Creative Commons Uznanie autorstwa – Na tych samych warunkach 4.0 (CC BY-SA 4.0). Dodano wyjaśnienia i przykłady dla gitarzysty; lekcja jest udostępniana na tej samej licencji."
  }
]$content$
)
on conflict (topic_id, slug) do update set
  title = excluded.title, summary = excluded.summary, reading_minutes = excluded.reading_minutes,
  order_index = excluded.order_index, content = excluded.content, updated_at = now();

