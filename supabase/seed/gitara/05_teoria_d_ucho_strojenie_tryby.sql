-- ============================================================================
-- supabase/seed/gitara/05_teoria_d_ucho_strojenie_tryby.sql
-- Dział 6, partia D: trening słuchu, systemy strojenia, tryby, transpozycja i kapodaster, melodia, faktura, podstawowe pojęcia (7 lekcji).
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
  'trening-sluchu',
  'Trening słuchu',
  'Jak ćwiczyć „ucho”: słuch relatywny, rozpoznawanie interwałów i akordów, granie ze słuchu i pierwsze kroki w improwizacji.',
  9, 22,
  $content$[
  {
    "type": "intro",
    "text": "Kiedy muzycy mówią „ucho”, nie mają na myśli narządu słuchu, ale **zdolność mózgu do rozróżniania i rozumienia tego, co się usłyszało**. Trening słuchu uczy rozpoznawać dźwięki i akordy bez patrzenia w nuty. To jedna z najbardziej praktycznych umiejętności gitarzysty."
  },
  {
    "type": "definition",
    "term": "Słuch absolutny i relatywny",
    "text": "**Słuch absolutny** to rzadka zdolność nazywania usłyszanego dźwięku (np. „to G nad środkowym C”). Badania sugerują, że jeśli nie ma się go bardzo wcześnie, nie da się go wypracować. Na szczęście wystarcza **słuch relatywny**: rozpoznawanie, że jeden dźwięk jest o tercję wielką wyżej od drugiego albo że cztery akordy tworzą progresję I–IV–V7–I.",
    "note": "Dla muzyki zachodniej słuch relatywny jest nawet przydatniejszy: utwór w dur brzmi niemal tak samo w C-dur i w D-dur, liczy się relacja dźwięków do toniki."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "Wyćwiczone ucho pozwala gitarzystom dobierać akordy do piosenek na słuch i grać je w ulubionej tonacji, a kompozytorom — zapisywać pomysły bez szukania na instrumencie. Jest też podstawą improwizacji: kiedy „słyszysz w głowie” frazę, możesz ją zagrać."
  },
  {
    "type": "steps",
    "title": "Pięć umiejętności słuchowych",
    "steps": [
      {
        "title": "1. Strojenie",
        "text": "Najważniejsza. Nie ćwicz na rozstrojonym instrumencie — to bardzo spowalnia rozwój słuchu. Stroi się cały czas, nie tylko na początku."
      },
      {
        "title": "2. Akordy ze słuchu",
        "text": "Słuchaj progresji w znanych piosenkach. Zagraj je w innej tonacji, zmień bas albo chwyty i posłuchaj, co się zmienia. Zacznij od akordów I, IV i V."
      },
      {
        "title": "3. Melodie ze słuchu",
        "text": "Po prostu graj melodie, które znasz. Szukaj kolejnego dźwięku po odległości od poprzedniego (interwał), po miejscu w tonacji albo po miejscu w akordzie."
      },
      {
        "title": "4. Improwizacja",
        "text": "Znaj gamy i arpeggia. Słuchaj improwizatorów, wypisuj ich solówki, buduj własne zwroty z ulubionych „licków”."
      },
      {
        "title": "5. Interwały i zapis",
        "text": "Kojarz interwał z dobrze znaną melodią, a potem zapisuj melodie, które znasz, i porównuj z oryginałem."
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Interwał",
      "Skojarzenie (początek melodii)"
    ],
    "rows": [
      [
        "sekunda mała w górę",
        "motyw z „Szczęk”"
      ],
      [
        "sekunda wielka w górę",
        "„Panie Janie” (początek)"
      ],
      [
        "tercja mała w górę",
        "„Greensleeves”"
      ],
      [
        "tercja wielka w górę",
        "„When the Saints Go Marching In”"
      ],
      [
        "kwarta czysta w górę",
        "„Auld Lang Syne”"
      ],
      [
        "tryton",
        "motyw z „Simpsonów”"
      ],
      [
        "kwinta czysta w górę",
        "temat z „Gwiezdnych wojen”"
      ],
      [
        "oktawa w górę",
        "„Somewhere Over the Rainbow”"
      ]
    ],
    "title": "Interwały w znanych melodiach",
    "caption": "To tylko pomysły. Melodia musi być dla Ciebie bardzo znana, więc wybierz własne skojarzenia. Zagraj interwał na gryfie, sprawdź, czy się zgadza i zapamiętaj jego brzmienie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Gra w parach.** Usiądźcie plecami do siebie: jedna osoba gra interwał, druga zgaduje, jaki to interwał. Gdy pójdzie łatwo, zgadujcie konkretne dźwięki. Zaskakująco dobrze zgadnie się je na instrumencie, na którym gra się często."
  },
  {
    "type": "steps",
    "title": "Jak zapisywać melodię ze słuchu",
    "steps": [
      {
        "title": "Zacznij od znanej melodii",
        "text": "Takiej, której nuty jeszcze nie znasz, ale ją „masz w głowie”."
      },
      {
        "title": "Zaśpiewaj fragment i zagraj",
        "text": "Odtwarzaj po jednym kroku, szukając dźwięku na gryfie."
      },
      {
        "title": "Zapisz tabulaturę",
        "text": "Zapisuj to, co znalazłeś — nuty lub tabulaturę — i zagraj od początku. Gdzie się mylisz?"
      },
      {
        "title": "Analizuj błędy",
        "text": "Które interwały rozpoznajesz łatwo, a które mylisz? Rozpoznajesz dźwięk po odległości od poprzedniego, po miejscu w tonacji czy po miejscu w akordzie?"
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**W aplikacji.** Zacznij od stroika w zakładce Ćwicz: stroić „na oko” i „na ucho” naprzemiennie. Potem wybierz jedną prostą piosenkę i spróbuj znaleźć jej akordy tylko ze słuchu, korzystając z lekcji „Akordy w tonacji” (I, IV, V i vi)."
  },
  {
    "type": "quiz",
    "question": "Który słuch jest ważniejszy w codziennym graniu na gitarze?",
    "options": [
      "absolutny",
      "relatywny",
      "żaden",
      "oba tak samo rzadkie"
    ],
    "correctIndex": 1,
    "explanation": "Słuch relatywny — rozpoznawanie interwałów i funkcji akordów w tonacji — wystarcza do większości zadań i da się go wytrenować."
  },
  {
    "type": "quiz",
    "question": "Od którego akordu najlepiej zacząć dobieranie akordów do piosenki ze słuchu?",
    "options": [
      "VII",
      "I, IV i V",
      "tylko iii",
      "wszystkich naraz"
    ],
    "correctIndex": 1,
    "explanation": "Akordy I, IV i V (a często też vi) pojawiają się najczęściej, więc najpierw sprawdź te."
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
  'systemy-strojenia',
  'Systemy strojenia',
  'Dlaczego gitara (i pianino) stroi się „równo temperowanie”, czym były strój pitagorejski i czysty oraz jak wykorzystać dudnienia przy strojeniu.',
  10, 23,
  $content$[
  {
    "type": "intro",
    "text": "Zanim muzycy zagrają razem, muszą się **zgrać**: uzgodnić, jaka dokładnie częstotliwość to A, B♭ i tak dalej. Dzisiejszy zachodni **strój równomiernie temperowany** zastąpił stosunkowo niedawno inne systemy używane w Europie, a inne kultury mają zupełnie inne systemy i skale. Każdy system opiera się na fizyce dźwięku, ale też na historii i na tym, jak stroi się dany instrument."
  },
  {
    "type": "definition",
    "term": "Idea: czyste interwały",
    "text": "Dźwięki, które brzmią „w stroju” względem siebie, mają **proste stosunki częstotliwości** (małe liczby całkowite): oktawa 2:1, kwinta czysta 3:2, kwarta czysta 4:3, tercja wielka 5:4. Nie chodzi o „prawie takie same” częstotliwości: dwa dźwięki o stosunku 1,005 brzmią źle. System strojenia próbuje zbudować całą skalę z takich czystych interwałów."
  },
  {
    "type": "table",
    "headers": [
      "System",
      "Na czym polega",
      "Wady"
    ],
    "rows": [
      [
        "Pitagorejski",
        "wszystko budowane z czystych kwint (3:2); stosowany w średniowieczu",
        "tercje bardzo „nieczyste”; seria czystych kwint nie zamyka się w oktawie, więc powstaje „wilcza kwinta”"
      ],
      [
        "Średniotonowy",
        "czyste tercje wielkie (5:4); popularny w XVI–XVIII w.",
        "kwinty nieco zmniejszone; także „wilcze” interwały w niektórych tonacjach"
      ],
      [
        "Czysty (naturalny)",
        "czyste kwinty i tercje, bliski szeregowi harmonicznemu",
        "trzeba przestrajać dźwięki przy zmianie tonacji; dobry dla głosu i skrzypiec, niepraktyczny dla fortepianu"
      ],
      [
        "Temperacja „dobra”",
        "kompromis: wszystkie tonacje użyteczne, każda brzmi trochę inaczej (J. S. Bach, „Das wohltemperierte Klavier”)",
        "różnice między tonacjami"
      ],
      [
        "Równomiernie temperowany",
        "oktawa podzielona na 12 równych półtonów; współczesny standard",
        "tylko oktawa jest czysta; reszta lekko „rozstrojona”"
      ]
    ],
    "title": "Systemy strojenia w pigułce",
    "caption": "Instrumenty, które można przestrajać na bieżąco (głos, skrzypce, puzon), często odruchowo przechodzą w strój czysty. Instrumenty, których szybko nie przestroisz (fortepian, organy, harfa), potrzebują temperacji."
  },
  {
    "type": "definition",
    "term": "Strój równomiernie temperowany",
    "text": "Oktawę dzieli się na 12 **równych** półtonów. Stosunek częstotliwości kolejnych półtonów to pierwiastek dwunastego stopnia z 2 (≈ 1,0595) — dlatego dwanaście półtonów daje dokładnie oktawę (2:1). Zaleta: **każda tonacja brzmi tak samo „czysto”**, więc nie trzeba przestrajać instrumentu przy zmianie tonacji. Cena: poza oktawą żaden interwał nie jest dokładnie czysty."
  },
  {
    "type": "table",
    "headers": [
      "Interwał",
      "Czysty (cents)",
      "Równomierny (cents)",
      "Różnica"
    ],
    "rows": [
      [
        "kwarta czysta",
        "498",
        "500",
        "+2"
      ],
      [
        "kwinta czysta",
        "702",
        "700",
        "−2"
      ],
      [
        "tercja wielka",
        "386",
        "400",
        "+14"
      ],
      [
        "tercja mała",
        "316",
        "300",
        "−16"
      ]
    ],
    "title": "Czyste i temperowane interwały w centach",
    "caption": "**Cent** to 1/100 półtonu równomiernie temperowanego (oktawa to 1200 centów). Kwarty i kwinty są prawie czyste, tercje odbiegają najbardziej — stąd „kwaśne” tercje w akordzie na gitarze."
  },
  {
    "type": "definition",
    "term": "Dudnienia",
    "text": "Gdy dwa dźwięki są prawie, ale nie dokładnie w czystym interwale, połączona fala ma regularne „falowanie” głośności — **dudnienia**. Im bliżej czystego interwału, tym wolniej dudni. Stroiciele fortepianów nie „słyszą” strojów dokładnie, tylko mierzą dudnienia."
  },
  {
    "type": "steps",
    "title": "Strojenie gitary „na dudnienia”",
    "steps": [
      {
        "title": "Struna 6 → 5",
        "text": "Zagraj 5. próg struny E (to A) razem z pustą struną A. Dostrój A tak, żeby **dudnienia znikły** (dźwięki zlewają się w jeden)."
      },
      {
        "title": "Struna 5 → 4",
        "text": "5. próg struny A (D) razem z pustą D."
      },
      {
        "title": "Struna 4 → 3",
        "text": "5. próg struny D (G) razem z pustą G."
      },
      {
        "title": "Struna 3 → 2",
        "text": "To wyjątek: **4. próg** struny G (B) razem z pustą B (tercja)."
      },
      {
        "title": "Struna 2 → 1",
        "text": "5. próg struny B (E) razem z pustą e."
      }
    ]
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Progi są ustawione w stroju równomiernie temperowanym (każdy próg to jeden półton). Dlatego kwarty i kwinty brzmią prawie czysto, a **tercje** — odrobinę „za szerokie”: tercja wielka w akordzie (np. C–E) jest minimalnie wyższa od czystej 5:4. Doświadczeni muzycy korygują to drobnymi ruchami palca, a w zespole z wokalem czy skrzypcami strój dopasowuje się „na słuch”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Szerokie strojenie.** Niektóre tradycje świadomie wolą, żeby wiele osób grało **blisko**, ale nie dokładnie na tym samym dźwięku — brzmi to pełniej i żywiej. W orkiestrach gamelan w Azji Południowo-Wschodniej pary instrumentów są precyzyjnie dostrojone tak, że dają stałe dudnienia na całej skali."
  },
  {
    "type": "quiz",
    "question": "Który interwał jest w równomiernie temperowanym stroju dokładnie czysty?",
    "options": [
      "kwinta",
      "tercja wielka",
      "oktawa",
      "kwarta"
    ],
    "correctIndex": 2,
    "explanation": "Tylko oktawa (2:1). Pozostałe interwały są nieco odchylone od czystych stosunków z szeregu harmonicznego."
  },
  {
    "type": "quiz",
    "question": "Co oznacza zanik dudnień przy strojeniu dwóch strun?",
    "options": [
      "Że struny brzmią zupełnie inaczej",
      "Że interwał jest strojony czysto",
      "Że struna jest za luźna",
      "Że trzeba zmienić struny"
    ],
    "correctIndex": 1,
    "explanation": "Gdy dudnienia znikną, oba dźwięki zlewają się — interwał jest bliski czystemu. Dlatego stroi się „na dudnienia”."
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
  'tryby',
  'Tryby',
  'Siedem trybów jako gamy zaczęte od różnych stopni skali durowej, ich charakter (dorycki, frygijski, lidyjski, miksolidyjski…) i zastosowanie na gitarze.',
  9, 24,
  $content$[
  {
    "type": "intro",
    "text": "W gamie durowej i molowej lista dźwięków jest taka sama w całej muzyce utworu, a my przyzwyczajamy się, że z tych dźwięków powstają określone akordy, ułożone w określone progresje i kończące się określoną kadencją. W muzyce, która opiera się na **trybach**, każdy tryb niesie inny zestaw oczekiwań. Tryby są zbyt różne od siebie, żeby po prostu transponować utwór z jednego do drugiego, jak robisz to z gamami."
  },
  {
    "type": "definition",
    "term": "Tryb",
    "text": "Tryb, podobnie jak gama, wyznacza dźwięki, których używa utwór, ale każdy tryb ma **własny charakter**: inny wzór tonów i półtonów, inny dźwięk końcowy (**finalis**), inny dźwięk, wokół którego krąży melodia. Dźwięki każdego trybu można zagrać na samych **białych klawiszach**, zaczynając od innego miejsca."
  },
  {
    "type": "table",
    "headers": [
      "Tryb",
      "Od białych klawiszy",
      "Stopień gamy durowej",
      "Charakter"
    ],
    "rows": [
      [
        "Joński (Ionian)",
        "C – C",
        "1.",
        "= gama durowa"
      ],
      [
        "Dorycki (Dorian)",
        "D – D",
        "2.",
        "molowy z podwyższoną sekstą"
      ],
      [
        "Frygijski (Phrygian)",
        "E – E",
        "3.",
        "molowy z obniżoną sekundą — „hiszpański”"
      ],
      [
        "Lidyjski (Lydian)",
        "F – F",
        "4.",
        "durowy z podwyższoną kwartą — „unoszący”"
      ],
      [
        "Miksolidyjski (Mixolydian)",
        "G – G",
        "5.",
        "durowy z obniżoną septymą — bluesowy/rockowy"
      ],
      [
        "Eolski (Aeolian)",
        "A – A",
        "6.",
        "= gama molowa naturalna"
      ],
      [
        "Lokrycki (Locrian)",
        "B – B",
        "7.",
        "rzadki, napięty (obniżone 2 i 5)"
      ]
    ],
    "title": "Siedem trybów na białych klawiszach",
    "caption": "Wszystkie mają te same dźwięki co C-dur — zmienia się tylko, **od którego** zaczynasz. Najpraktyczniejsza zasada: tryb zaczyna się na kolejnym stopniu tej samej gamy durowej."
  },
  {
    "type": "definition",
    "term": "Dorycka („moll” z jazzu)",
    "text": "Dorycka ma te same dźwięki co molowa naturalna, tylko z **podwyższonym szóstym stopniem**: D dorycka to D E F G A **B** C (D moll miałoby B♭). Charakter jest „molowy”, ale jaśniejszy. W jazzie używa się jej do improwizacji nad akordem ii.",
    "note": "Każda skala z obniżoną tercją i obniżoną septymą (jazzowe „flat 3” i „flat 7”) przy zachowanej naturalnej sekście jest dorycka, niezależnie od dźwięku, od którego zaczyna."
  },
  {
    "type": "tab",
    "title": "G miksolidyjski (= gama C-dur grana od G)",
    "tabText": "e|-------------------------|\nB|-------------------------|\nG|-------------------------|\nD|-------------------------|\nA|-------------5--7--8--10-|\nE|-3--5--7--8--------------|",
    "caption": "G – A – B – C – D – E – F – G. To gama G-dur z obniżonym siódmym stopniem (F zamiast F♯). Zagraj ją nad akordem G7 albo w rockowym riffie na G."
  },
  {
    "type": "tab",
    "title": "D dorycki (= gama C-dur grana od D)",
    "tabText": "e|-------------------------|\nB|-------------------------|\nG|-------------------------|\nD|-------------7--9--10-12-|\nA|-5--7--8--10-------------|\nE|-------------------------|",
    "caption": "D – E – F – G – A – B – C – D. Zagraj nad Dm7 albo w jazzującym podkładzie w d-moll."
  },
  {
    "type": "steps",
    "title": "Jak „obliczyć” tryb",
    "steps": [
      {
        "title": "1. Wybierz tonikę trybu",
        "text": "Np. G miksolidyjski."
      },
      {
        "title": "2. Znajdź gamę durową z tymi samymi dźwiękami",
        "text": "G to piąty stopień gamy C-dur (C D E F G…), więc G miksolidyjski ma dźwięki C-dur."
      },
      {
        "title": "3. Zagraj od toniki",
        "text": "G A B C D E F G — to ta sama gama, ale „dom” jest w G."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Tryby w historii i muzyce świata",
    "text": "Starożytni Grecy i średniowieczny chorał używali trybów; nazwy kościelnych trybów zapożyczono od greckich, ale systemy nie pokrywają się. Różne tryby miały inny wpływ na nastrój. W średniowieczu tylko dźwięk B mógł zmieniać się (twarde B = nasze B, miękkie = B♭) — z tych znaków wywodzą się nasze krzyżyk, bemol i kasownik. **Tryby jazzowe i folkowe** używają tych samych skal, ale bez ustalonych zasad chorału; modalny jazz powstał około 1960 r. Podobne do trybów są **ragi** w klasycznej muzyce indyjskiej (z własnymi zasadami melodii i strojenia)."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Pułapka.** Nie myl trybu z tonacją o tych samych znakach: D dorycki i C-dur mają te same dźwięki, ale **inną tonikę**. To, że „D dorycki jest w C-dur”, nie oznacza, że melodia jest w C-dur: wszystko kręci się wokół D i jego akordów (np. Dm7)."
  },
  {
    "type": "quiz",
    "question": "Na którym stopniu gamy durowej zaczyna się tryb miksolidyjski?",
    "options": [
      "2.",
      "4.",
      "5.",
      "7."
    ],
    "correctIndex": 2,
    "explanation": "Mixolydian to 5. stopień (G w C-dur): G A B C D E F G — dur z obniżoną septymą."
  },
  {
    "type": "quiz",
    "question": "Który tryb jest identyczny z gamą molową naturalną?",
    "options": [
      "dorycki",
      "eolski",
      "lidyjski",
      "lokrycki"
    ],
    "correctIndex": 1,
    "explanation": "Eolski (od 6. stopnia gamy durowej) to molowa naturalna: np. A eolski = a-moll."
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
  'transpozycja-i-kapodaster',
  'Transpozycja i kapodaster',
  'Jak zmienić tonację utworu (nuty lub same akordy), jak wybrać nową i jak kapodaster pozwala grać znane chwyty w innej tonacji.',
  10, 25,
  $content$[
  {
    "type": "intro",
    "text": "Zmiana tonacji utworu to **transpozycja**. Muzykę w dur można przenieść do dowolnej innej tonacji durowej, a muzykę w moll do dowolnej tonacji molowej (zmiana z moll na dur to znacznie więcej niż transpozycja). Po transpozycji utwór brzmi wyżej lub niżej, ale poza tym tak samo."
  },
  {
    "type": "table",
    "headers": [
      "Dlaczego transponujemy",
      "Przykład"
    ],
    "rows": [
      [
        "Dopasowanie do głosu",
        "Śpiewak ma problem z wysokimi lub niskimi dźwiękami; zmiana tonacji o kilka półtonów rozwiązuje kłopot."
      ],
      [
        "Łatwiej na instrumencie",
        "Instrumenty strunowe zwykle lepiej brzmią w tonacjach z krzyżykami, dęte — z bemolami; dla gitarzysty ulubione to C, G, D, A, E, Am, Em, Dm."
      ],
      [
        "Instrumenty transponujące",
        "Klarnet, trąbka, saksofon, waltornia — ich nuty są zapisane inaczej, niż brzmią."
      ]
    ],
    "title": "Po co zmieniać tonację"
  },
  {
    "type": "definition",
    "term": "Kapodaster",
    "text": "Kapodaster to „sztuczny próg”, który przyciska wszystkie struny na wybranym progu. Podnosi całą gitarę o tyle półtonów, na którym progu stoi. To najprostszy sposób transpozycji bez pisania nut: grasz te same **kształty** akordów, a brzmią wyżej."
  },
  {
    "type": "table",
    "headers": [
      "Kapodaster na progu",
      "Kształty G (G, C, D, Em) brzmią jak",
      "Kształty C (C, F, G, Am) brzmią jak"
    ],
    "rows": [
      [
        "0",
        "G",
        "C"
      ],
      [
        "1",
        "A♭",
        "D♭"
      ],
      [
        "2",
        "A",
        "D"
      ],
      [
        "3",
        "B♭",
        "E♭"
      ],
      [
        "4",
        "B",
        "E"
      ],
      [
        "5",
        "C",
        "F"
      ],
      [
        "7",
        "D",
        "G"
      ]
    ],
    "title": "Tonacja po założeniu kapodastra",
    "caption": "Każdy próg to półton. Kapodaster na 7. progu to to samo co przeniesienie o kwintę w górę (jedno miejsce w kole kwintowym)."
  },
  {
    "type": "steps",
    "title": "Transpozycja samych nazw akordów",
    "steps": [
      {
        "title": "1. Wybierz o ile",
        "text": "Ustal, o ile półtonów w górę albo w dół chcesz przenieść utwór (w górę — brzmi wyżej, w dół — niżej)."
      },
      {
        "title": "2. Przesuń każdy akord o tyle samo",
        "text": "Użyj kolejności dźwięków: C C♯ D D♯ E F F♯ G G♯ A A♯ B (i znowu C). Zmieniasz tylko nazwę dźwięku; „m”, „7”, „sus4” zostają."
      },
      {
        "title": "3. Przesuń też bas",
        "text": "Jeśli akord ma bas (C/E), przesuń go o tyle samo."
      },
      {
        "title": "4. Zagraj i sprawdź",
        "text": "Jeśli nowa tonacja jest niewygodna, spróbuj sąsiedniej."
      }
    ]
  },
  {
    "type": "table",
    "headers": [
      "Utwór w G",
      "G",
      "C",
      "D",
      "Em"
    ],
    "rows": [
      [
        "+2 półtony (A-dur)",
        "A",
        "D",
        "E",
        "F♯m"
      ],
      [
        "+5 półtonów (C-dur)",
        "C",
        "F",
        "G",
        "Am"
      ],
      [
        "+7 półtonów (D-dur)",
        "D",
        "G",
        "A",
        "Bm"
      ]
    ],
    "title": "Przykład: piosenka G – C – D – Em",
    "caption": "Przenieś każdy akord o tyle samo półtonów. Zwróć uwagę, że +7 w górę to to samo, co −5 w dół."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Jak wybrać nową tonację dla gitary.** Spójrz na **ostatni akord** (zwykle nazywa tonację) albo na najczęstszy akord. Zmień go na łatwy (G, D, A, E, C, Am, Em, Dm) i przesuń resztę o tyle samo. Chcesz zachować brzmienie? Przejdź w dół do najbliższej wygodnej tonacji i załóż **kapodaster** na progu równym liczbie półtonów różnicy."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Przykład.** Piosenka w E♭ jest wygodna dla wokalisty, ale na gitarze niewygodna. Zagraj akordy tonacji D (o półton niżej) i załóż kapodaster na **1. progu** — dla wszystkich zabrzmi jak E♭. Jeśli utwór jest w A♭, a pianista nie chce zmieniać tonacji, zagraj kształty G z kapodastrem na 1. progu — zabrzmi to jak A♭. Im niżej kapodaster, tym mniejsze ryzyko, że gitara rozjedzie się z pianinem."
  },
  {
    "type": "table",
    "headers": [
      "Instrument",
      "Zapisany o",
      "Przykład"
    ],
    "rows": [
      [
        "Trąbka, klarnet, saksofon tenorowy (w B♭)",
        "cały ton wyżej niż brzmi",
        "C brzmi, D zapisane"
      ],
      [
        "Waltornia (w F)",
        "kwintę czystą wyżej",
        "C brzmi, G zapisane"
      ],
      [
        "Saksofon altowy (w E♭)",
        "sekstę wielką wyżej",
        "C brzmi, A zapisane"
      ]
    ],
    "title": "Instrumenty transponujące (skrót)",
    "caption": "Aby partia w C zabrzmiała na trąbce w B♭ tak jak w oryginale, trzeba ją zapisać o cały ton wyżej."
  },
  {
    "type": "quiz",
    "question": "Zagrasz kształty akordów G, C, D i Em z kapodastrem na 3. progu. W jakiej tonacji brzmi utwór?",
    "options": [
      "A",
      "B♭",
      "B",
      "C"
    ],
    "correctIndex": 1,
    "explanation": "G + 3 półtony = B♭. Kapodaster na 3. progu podnosi G-dur do B♭-dur."
  },
  {
    "type": "quiz",
    "question": "Piosenka G – C – D – Em po przeniesieniu o 2 półtony w górę to…",
    "options": [
      "A – D – E – F♯m",
      "A – D – E – Fm",
      "G♯ – C♯ – D♯ – Fm",
      "B – E – F♯ – G♯m"
    ],
    "correctIndex": 0,
    "explanation": "Każdy akord w górę o dwa półtony: G→A, C→D, D→E, Em→F♯m."
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
  'melodia-i-fraza',
  'Melodia i fraza',
  'Czym jest melodia, jak opisać jej kształt, ruch i frazy oraz czym różnią się motyw i temat — z przykładami z gitary.',
  8, 26,
  $content$[
  {
    "type": "intro",
    "text": "**Melodia** to ciąg dźwięków, jeden po drugim — ale nie byle jaki: to te dźwięki, które przyciągają ucho, linia, która wydaje się najważniejsza. Wszystko, co nie jest melodią (rytm, akordy, bas), jest **akompaniamentem**. Dodatkowe dźwięki, które ozdabiają melodię (tryle, slajdy), to **ozdobniki**."
  },
  {
    "type": "definition",
    "term": "Kontur melodii",
    "text": "Melodia, która stoi w miejscu na jednej wysokości, szybko nudzi. Dźwięki idą w górę albo w dół, szybko lub wolno — wyobraź sobie linię, która stromo się wznosi, gdy melodia nagle skacze, i łagodnie opada, gdy się obniża. To **kontur** (kształt) melodii. Opisuje się go słownie: „melodia wznosząca się”, „fraza w kształcie łuku”."
  },
  {
    "type": "table",
    "headers": [
      "Rodzaj ruchu",
      "Opis",
      "Przykład"
    ],
    "rows": [
      [
        "Stopniowy (jednokrokowy)",
        "dźwięki sąsiednie, małe odstępy: półtony, tony, fragmenty gamy",
        "gama w górę lub w dół"
      ],
      [
        "Skokowy",
        "duże odstępy między dźwiękami",
        "skoki o kwintę, oktawę"
      ]
    ],
    "title": "Ruch melodii",
    "caption": "Wiele melodii łączy oba rodzaje ruchu w ciekawy, wyważony sposób."
  },
  {
    "type": "definition",
    "term": "Fraza",
    "text": "Melodie dzielą się na **frazy**. Fraza jest jak fragment zdania („w ciemnym lesie”): wyraża myśl, ale to jeszcze nie pełne zdanie. Zwykle na końcu frazy jest krótka pauza. W muzyce wokalnej frazy podążają za tekstem. Fraza często ma swoją parę: **poprzednik** (jak pytanie) i **następnik** (jak odpowiedź).",
    "note": "Poprzednik kończy się tak, że brzmi niedokończenie. Następnik kończy się na toniki — „w domu”. Posłuchaj „Auld Lang Syne”."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Frazy nie zawsze są wyraźnie oddzielone: mogą przechodzić jedna w drugą, skracać się albo nakładać. To też sposób, by utrzymać zainteresowanie słuchacza."
  },
  {
    "type": "definition",
    "term": "Motyw i temat",
    "text": "**Motyw** to krótka myśl muzyczna — krótsza niż fraza — która wraca w utworze, raz w tej samej postaci, raz zmieniona (wolniej, szybciej, w innej tonacji, „do góry nogami”). Wagnerowski **lejtmotyw** kojarzy się z postacią lub ideą. **Temat** to dłuższy fragment melodii (przynajmniej jedna fraza), który powraca, np. w „temacie z wariacjami”. Filmowe motywy też działają jak tematy, np. temat Bena Kenobiego."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Melodię zagrasz na pojedynczych strunach, a akompaniament akordami — ale też możesz łączyć je w jednym brzmieniu (tzw. fingerstyle). Ozdobniki w tabulaturze to hammer-on (h), pull-off (p) i slide (/): to właśnie one „ożywiają” melodię. W lekcji o technikach gry masz je pod ręką."
  },
  {
    "type": "steps",
    "title": "Ćwiczenie: opisz melodię piosenki",
    "steps": [
      {
        "title": "Zanuć pierwszą frazę",
        "text": "Ile ma dźwięków? Czy kończy się pauzą?"
      },
      {
        "title": "Narysuj jej kontur",
        "text": "Linia wznosząca się, opadająca, łuk? Czy są skoki?"
      },
      {
        "title": "Znajdź poprzednik i następnik",
        "text": "Czy pierwsza fraza brzmi jak pytanie, a druga jak odpowiedź?"
      },
      {
        "title": "Wypatrz motyw",
        "text": "Czy jakiś krótki zwrot wraca (w zmienionej postaci)?"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jak nazywa się krótka myśl muzyczna, krótsza od frazy, która wraca w utworze?",
    "options": [
      "temat",
      "motyw",
      "kadencja",
      "metrum"
    ],
    "correctIndex": 1,
    "explanation": "Motyw to krótki pomysł melodyczny (lub rytmiczny), który często wraca, czasem zmieniony. Temat jest dłuższy."
  },
  {
    "type": "quiz",
    "question": "Co dzieje się zwykle na końcu następnika (frazy-odpowiedzi)?",
    "options": [
      "Melodia kończy się na tonice",
      "Melodia zostaje otwarta",
      "Zmienia się metrum",
      "Zaczyna się modulacja"
    ],
    "correctIndex": 0,
    "explanation": "Poprzednik brzmi niedokończenie, a następnik odpowiada mu, kończąc na tonice."
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
  'faktura-i-kontrapunkt',
  'Faktura i kontrapunkt',
  'Jak opisać, ile dzieje się w muzyce naraz: jednogłos, homofonia, polifonia, heterofonia oraz kanon, fuga i jak to przełożyć na gitarę.',
  9, 27,
  $content$[
  {
    "type": "intro",
    "text": "**Faktura** opisuje, ile się dzieje w muzyce w danej chwili: czy jest gęsta czy rzadka, czy ma wiele warstw, czy tylko rytm, czy melodię z akompaniamentem, czy kilka splatających się melodii. Formalne terminy opisują relację melodii i harmonii."
  },
  {
    "type": "table",
    "headers": [
      "Faktura",
      "Co to jest",
      "Przykład"
    ],
    "rows": [
      [
        "Monofonia (jednogłos)",
        "jedna linia melodyczna, bez harmonii; może być rytmiczny akompaniament",
        "ktoś gwiżdże melodię, grupa śpiewa unisono, chorał gregoriański"
      ],
      [
        "Homofonia",
        "jedna wyraźna melodia + akompaniament (akordy)",
        "śpiewak z gitarą, większość piosenek pop, hymny, „barbershop”"
      ],
      [
        "Polifonia",
        "więcej niż jedna niezależna melodia naraz",
        "kanony, fugi, Bach, orkiestra"
      ],
      [
        "Heterofonia",
        "jedna melodia, ale wykonywana naraz w kilku wariantach z różnymi ozdobnikami",
        "bluegrass, niektóre tradycje Bliskiego Wschodu i Azji"
      ]
    ],
    "title": "Cztery podstawowe faktury",
    "caption": "Heterofonia rzadko występuje w muzyce zachodniej; w pozostałych trzech mieści się większość utworów."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Gitara solo = homofonia.** Gdy śpiewasz i akompaniujesz sobie akordami, masz fakturę homofoniczną. Gdy grasz fingerstyle melodię na górnych strunach i bas na dolnych — też, ale z coraz bardziej niezależnymi liniami (i bliżej polifonii)."
  },
  {
    "type": "definition",
    "term": "Akompaniament",
    "text": "Wszystko, co nie jest melodią: rytm, harmonia, bas, akordy. **Linia basowa** to najniższe dźwięki; wyznacza harmonię, do której pasuje reszta, i często zdradza progresję akordów. **Głosy wewnętrzne** wypełniają przestrzeń między melodią a basem. **Descant** to partia nad melodią."
  },
  {
    "type": "definition",
    "term": "Kontrapunkt (polifonia)",
    "text": "Gdy w muzyce **jednocześnie** słychać więcej niż jedną **niezależną** melodię, muzyka jest **kontrapunktowa** (polifoniczna). „Jednocześnie” — dzieje się w tym samym czasie. „Niezależna” — w danej chwili jedna melodia robi co innego (inny rytm, inne dźwięki) niż druga.",
    "note": "Chorał na cztery głosy z identycznym rytmem w każdym nie jest polifonią, tylko homofonią (brzmi jak akordy), choć każdy głos śpiewany osobno wygląda jak melodia."
  },
  {
    "type": "table",
    "headers": [
      "Pojęcie",
      "Co to jest"
    ],
    "rows": [
      [
        "Kanon",
        "wszystkie głosy śpiewają tę samą melodię bez zmian, ale w różnych momentach (czasem wyżej lub niżej o kwartę lub kwintę)"
      ],
      [
        "Round (kanon w kółko)",
        "specjalny kanon, w którym koniec pasuje do początku, więc można go powtarzać bez końca; np. „Panie Janie” / „Frère Jacques”"
      ],
      [
        "Fuga",
        "co najmniej trzy głosy wchodzą kolejno z tym samym tematem (podmiot), a potem rozwijają go w różne strony; zwykle pojawia się też drugi temat (przeciwtemat)"
      ],
      [
        "Kontrapunkt (przeciwmelodia)",
        "w muzyce homofonicznej jedna partia, która jest naprawdę niezależna od melodii, np. solista improwizujący nad powtarzanym refrenem"
      ]
    ],
    "title": "Przydatne terminy",
    "caption": "Wystarczy, że zaśpiewasz „Panie Janie” w kilka osób z opóźnieniem — usłyszysz najprostszą polifonię, jaką znamy."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "**Ćwiczenie.** Przy następnej ulubionej piosence nie podśpiewuj melodii: posłuchaj **linii basowej**, harmonii, głosów wewnętrznych i partii instrumentów. Prawdopodobnie usłyszysz ciekawe, odrębne linie, które na co dzień pomijasz."
  },
  {
    "type": "quiz",
    "question": "Jaka faktura opisuje „śpiewak z gitarą grającą akordy”?",
    "options": [
      "monofonia",
      "homofonia",
      "polifonia",
      "heterofonia"
    ],
    "correctIndex": 1,
    "explanation": "Jedna wyraźna melodia + akompaniament akordowy to homofonia."
  },
  {
    "type": "quiz",
    "question": "Co wyróżnia kanon?",
    "options": [
      "Różne melodie naraz",
      "Ta sama melodia w różnych momentach",
      "Jedna melodia bez akompaniamentu",
      "Zmiana tonacji"
    ],
    "correctIndex": 1,
    "explanation": "W kanonie wszystkie głosy wykonują tę samą melodię, ale zaczynają ją w różnym czasie."
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
  'podstawowe-elementy-muzyki',
  'Rytm, barwa i harmonia: słownik pojęć',
  'Kluczowe terminy opisujące muzykę: rytm i uderzenie, barwa dźwięku, harmonia (burdon, akordy, rytm harmoniczny) — w skrócie i z odniesieniem do gitary.',
  9, 28,
  $content$[
  {
    "type": "intro",
    "text": "Rytm, melodia, harmonia, barwa i faktura to **podstawowe elementy muzyki**. Teoria muzyki opisuje utwory przez podobieństwa i różnice w tych elementach, a gatunki wyróżnia się właśnie tym, że mają podobne cechy. Ten słownik porządkuje pojęcia, które padały w poprzednich lekcjach."
  },
  {
    "type": "definition",
    "term": "Rytm",
    "text": "Rozmieszczenie dźwięków w czasie. Słowo ma kilka znaczeń: podstawowa **pulsacja** utworu, **powtarzający się wzór rytmiczny** („poczuj rytm”) albo **układ w czasie** niewielkiej grupy nut („zagraj mi ten rytm”)."
  },
  {
    "type": "table",
    "headers": [
      "Termin",
      "Znaczenie"
    ],
    "rows": [
      [
        "Uderzenie (beat)",
        "pulsacja; także konkretny powtarzalny wzór rytmiczny („latynoski beat”)"
      ],
      [
        "Na uderzeniu",
        "w momencie, gdy puls jest najsilniejszy (downbeat)"
      ],
      [
        "Poza uderzeniem (offbeat)",
        "w pustych miejscach między uderzeniami"
      ],
      [
        "Upbeat",
        "dokładnie w połowie między uderzeniami („i”)"
      ],
      [
        "Takt",
        "grupa uderzeń; pierwsze jest zwykle najsilniejsze"
      ],
      [
        "Synkopa",
        "silny dźwięk na słabej części albo poza uderzeniem"
      ],
      [
        "Sekcja rytmiczna",
        "perkusja, bas i instrumenty akordowe (m.in. gitara) tworzące rytm i harmonię"
      ]
    ],
    "title": "Słownik rytmu",
    "caption": "Gdy puls jest silnie ustalony, dźwięk nie musi być na każdym uderzeniu — pulsację da się czuć, nawet gdy nie jest wykonywana."
  },
  {
    "type": "definition",
    "term": "Barwa (timbre)",
    "text": "Wszystko w dźwięku, co nie dotyczy wysokości, głośności i długości. Gdy flet i obój zagrają ten sam dźwięk, tak samo głośno i tak samo długo, i tak je rozróżnisz — to różnica **barwy**. Barwa wynika z tego, że każdy dźwięk instrumentu to złożona fala z wielu częstotliwości (szereg harmoniczny); proporcje alikwotów dają „kolor” dźwięku. Szczególnie ważny jest **atak** dźwięku — dlatego łatwiej rozpoznać instrument po krótkich, wyraźnych nutach niż po długich, gładkich.",
    "note": "Barwę opisują słowa: jasna, ciemna, ciepła, ostra, miękka, rezonująca, matowa… To ta sama gitara bliżej mostka (jaśniej) i bliżej podstawy gryfu (cieplej)."
  },
  {
    "type": "definition",
    "term": "Harmonia",
    "text": "Gdy brzmi **więcej niż jeden dźwięk naraz**, jest harmonia. Nie musi być „harmonijna” — może być bardzo dysonansowa. Liczy się to, że dźwięki brzmią równocześnie. Harmonia jest najbardziej rozwiniętym elementem muzyki zachodniej."
  },
  {
    "type": "table",
    "headers": [
      "Pojęcie",
      "Co to jest"
    ],
    "rows": [
      [
        "Harmonia domyślna",
        "sama melodia może sugerować akordy, które do niej pasują"
      ],
      [
        "Burdon",
        "dźwięk, który prawie się nie zmienia — najprostszy sposób dodania harmonii; typowy dla dud i muzyki indyjskiej"
      ],
      [
        "Harmonia równoległa",
        "głosy poruszają się razem w górę lub w dół, podążając za melodią"
      ],
      [
        "Akord",
        "trzy lub więcej dźwięków (zwykle zbudowanych na trójdźwięku); może brzmieć razem (blokowy) albo kolejno (arpeggio)"
      ],
      [
        "Progresja",
        "kolejne akordy; np. „blues” to nazwa progresji"
      ],
      [
        "Rytm harmoniczny",
        "jak często zmieniają się akordy (wolny: akord zmienia się rzadko; szybki: często)"
      ],
      [
        "Diatoniczna / chromatyczna",
        "diatoniczna harmonia zostaje w jednej tonacji; chromatyczna używa wielu dźwięków spoza niej (dużo znaków przygodnych)"
      ],
      [
        "Dysonans",
        "dźwięk lub akord, który nie pasuje do spodziewanej harmonii; może brzmieć zaskakująco lub ostro"
      ]
    ],
    "title": "Pojęcia harmonii",
    "caption": "Rytm harmoniczny jest niezależny od tempa: sekcja z szybkimi nutami i jednym akordem ma szybki rytm, ale wolny rytm harmoniczny."
  },
  {
    "type": "tab",
    "title": "Burdon na gitarze: pusta struna D i melodia na e",
    "tabText": "e|-0--2--3--2--0--|\nB|----------------|\nG|----------------|\nD|-0--0--0--0--0--|\nA|----------------|\nE|----------------|",
    "caption": "Pusta struna D brzmi cały czas jako burdon, a na strunie e rusza się melodia (E – F♯ – G – F♯ – E). To najprostsze „harmonizowanie” melodii, tak jak robią dudy."
  },
  {
    "type": "tip",
    "variant": "key",
    "text": "**Na gitarze.** Gitara jest instrumentem sekcji rytmicznej i solowym jednocześnie. Zagraj tę samą progresję z szybkimi i wolnymi zmianami akordów, żeby poczuć, czym jest **rytm harmoniczny**, i zagraj akord blokowo, a potem jako arpeggio, żeby zobaczyć, jak ten sam akord zmienia charakter."
  },
  {
    "type": "quiz",
    "question": "Co opisuje „rytm harmoniczny”?",
    "options": [
      "Jak szybko grane są nuty",
      "Jak często zmieniają się akordy",
      "Jak głośna jest muzyka",
      "Jakiego metrum używa utwór"
    ],
    "correctIndex": 1,
    "explanation": "Rytm harmoniczny to częstość zmian akordów. Utwór z wieloma szybkimi nutami na jednym akordzie ma wolny rytm harmoniczny."
  },
  {
    "type": "quiz",
    "question": "Czym jest burdon?",
    "options": [
      "Akordem septymowym",
      "Dźwiękiem, który prawie się nie zmienia, grającym pod melodią",
      "Szybkim ozdobnikiem",
      "Rodzajem metrum"
    ],
    "correctIndex": 1,
    "explanation": "Burdon (drone) to dźwięk trwający lub rzadko się zmieniający — najprostszy sposób dodania harmonii do melodii."
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

