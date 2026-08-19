# Prompt: matura rozszerzona z hiszpańskiego w Phoenixie

> Wersja oryginalnego promptu dostosowana do **Phoenixa** (to repo).
>
> **Najważniejsze ustalenie, które zmienia cały prompt:** ta aplikacja w 70% **już istnieje**.
> Repo ma mini-aplikację **„Matura Angielski"** (`/matura`, migracje `0013_matura.sql` +
> `0014_matura_writing.sql`, moduł `lib/matura/`), która jest dokładnie tym produktem —
> tylko dla angielskiego. Jej model danych jest **strukturalnie niezależny od języka**:
> cztery części arkusza CKE, dwa poziomy, kryteria oceny wypowiedzi pisemnej i limity słów
> są identyczne dla każdego języka obcego nowożytnego.
>
> Dlatego zadanie brzmi: **dodać wymiar języka do istniejącego modułu `matura` i dopisać
> treść hiszpańską** — a nie budować drugą aplikację od zera. Rozdział 1 pokazuje, ile
> dokładnie kodu jest zaszyte pod angielski (odpowiedź: pięć miejsc).
>
> **Stan na dziś: etapy 1 i 2 z rozdziału 9 są zrobione i wdrożone w tym repo.** Moduł
> `/matura` obsługuje angielski i hiszpański, a hiszpańska treść jest zaseedowana dla obu
> poziomów. Reszta rozdziału 9 to lista tego, co zostało.

---

## 0. Decyzja platformowa (odpowiedź na otwarte pytanie oryginalnego promptu)

Oryginalny prompt kończył się pytaniem: *na jakich platformach (web/Android/iOS) i czy
potrzebna jest natywna aplikacja mobilna?*

**Odpowiedź wynika z Phoenixa i nie jest już otwarta: responsywny web (mobile-first),
jedno wdrożenie Next.js na Vercelu. Bez natywnego Androida i iOS.**

- Phoenix to **jedna powłoka** — wspólne logowanie, profil, motyw, launcher i dolna nawigacja.
  Mini-aplikacja poza tym wdrożeniem traci wszystko, co daje powłoka.
- Interfejs repo jest już **mobile-first** (Tailwind v4, dolna nawigacja w stylu aplikacji
  mobilnej) — na telefonie zachowuje się jak aplikacja, bez sklepów i podpisywania.
- Natywny klient to drugi frontend na te same Server Actions, czyli podwojenie kosztu każdej
  funkcji. Nic w wymaganiach tego nie uzasadnia.

Jedyna funkcja z listy, która realnie potrzebuje warstwy „prawie natywnej", to **tryb
offline** — a to PWA (service worker + manifest), nie aplikacja natywna. Patrz 7.1.

---

## 1. Punkt wyjścia: co już jest w repo

### 1.1. Mini-aplikacja `/matura` (istnieje)

Wpis w `lib/phoenix/apps.ts`: `id: "matura"`, `name: "Matura Angielski"`, ikona `ScrollText`,
sekcja `nauka`.

**Tabele (`0013_matura.sql`, `0014_matura_writing.sql`):**

```
matura_sections            -- 4 części CKE × poziom, z edytowalną exam_weight
matura_lessons             -- lekcja blokowa per sekcja (content jsonb)
matura_tasks               -- bank zadań, source: topic|past_exam|curated|ai_generated
matura_task_attempts       -- podejścia (per-user)
matura_section_progress    -- opanowanie sekcji (per-user)
matura_progress_snapshots  -- historia postępu (per-user)
matura_mock_exams          -- symulacje arkusza (per-user)
matura_study_plans         -- plan do dnia matury (per-user)
matura_study_plan_weeks    -- tygodnie planu (per-user)
matura_assigned_practice   -- zadania od nauczyciela (per-user)
matura_settings            -- wybrany poziom (per-user)
matura_writing_tasks       -- polecenia wypowiedzi pisemnej
matura_writing_submissions -- wypracowania + ocena analityczna AI (per-user)
```

**Moduł `lib/matura/`:** `actions.ts`, `constants.ts`, `dashboard.ts`, `grading.ts`,
`import-actions.ts`, `import-pdf.ts`, `progress.ts`, `sections.ts`, `settings.ts`,
`writing-actions.ts`, `writing-grading.ts`.

**Trasy:** `/matura`, `/matura/nauka`, `/matura/nauka/[sectionSlug]`,
`/matura/nauka/[sectionSlug]/[taskId]`, `/matura/nauka/pisanie`,
`/matura/nauka/pisanie/[taskId]`, `/matura/admin/import`, `/matura/ustawienia`.

**Treść (`supabase/seed/matura/`):** sekcje, lekcje i zadania dla wszystkich czterech części
(środki językowe, pisanie, czytanie, słuchanie), wypracowania dla obu poziomów.

**Co już jest zrobione dobrze i czego nie ruszaj:**

- `MATURA_MAX_POINTS` (podstawowa 60, rozszerzona 50), `MATURA_WRITING_MAX_POINTS`
  (12 / 13) i `MATURA_WRITING_WORD_RANGE` z „gilotyną" poniżej progu słów
  (`lib/matura/constants.ts`) — **fakty strukturalne formatu CKE, wspólne dla wszystkich
  języków obcych**, nie do przepisywania per język.
- `exam_weight` jako edytowalna kolumna, nie stała — bo CKE nie publikuje stabilnego
  rozkładu punktów na zadania. Ten sam kompromis co `math_topics.exam_weight`.
- Analityczna ocena wypracowania wg czterech kryteriów CKE osobno
  (`lib/matura/writing-grading.ts`).

### 1.2. Co jest zaszyte pod angielski — pełna lista

Dokładnie pięć miejsc. To jest cały koszt „ujęzykowienia" modułu:

| Plik | Co tam jest |
|---|---|
| `lib/matura/writing-grading.ts` | 3 prompty mówiące „na maturze z angielskiego" / „z języka angielskiego" |
| `lib/matura/import-pdf.ts` | 4 miejsca: „z angielskiego", „po ANGIELSKU", „znajomości języka angielskiego" |
| `lib/matura/constants.ts` | tylko komentarze („CKE English exam format", „z języka angielskiego") |
| `lib/matura/actions.ts` | tylko komentarz nagłówka |
| `lib/phoenix/apps.ts` | `name: "Matura Angielski"`, `description: "…z języka angielskiego (CKE)"` |

Wszystkie prompty da się sparametryzować **istniejącym** `lib/languages.ts`:
`langInfo('es')`, `langGenitive('es')` („hiszpańskiego"), `teacherSystemPrompt('es')`.
Ten plik już obsługuje `'es'` — Linguo uczy hiszpańskiego od dawna.

### 1.3. Czego w `/matura` nie ma, a jest w Twoim promptu

To jest realny zakres nowej pracy, niezależny od języka:

- gry (quiz jako gra, dopasowywanie, escape room),
- powtórki rozłożone w czasie (`next_review_date`),
- wgrywanie **własnych** arkuszy przez ucznia (dziś import PDF jest tylko w panelu admina),
- wymowa i nagrania (część ustna),
- interfejs symulacji egzaminu i planu nauki — **tabele istnieją, tras nie ma**
  (`/matura/egzamin`, `/matura/plan` do zbudowania),
- tryb offline.

---

## 2. Dlaczego rozszerzenie, a nie osobna aplikacja `hiszpanski`

Rozważyłem wariant „nowa mini-aplikacja Español z tabelami `es_*`" i **odrzucam go**:

- Format egzaminu jest **ten sam**. Osobne tabele znaczą dwie kopie logiki punktowania,
  dwie kopie kryteriów wypowiedzi pisemnej, dwa panele importu, dwa dashboardy — i dwa
  miejsca, w których trzeba nanieść każdą zmianę Informatora CKE.
- Uczeń zdający dwa języki miałby dwa niezależne, niespójne postępy zamiast jednego widoku.
- Repo ma już precedens rozwiązania odwrotnego i działającego: **Linguo jest wielojęzyczne**
  (`TargetLanguage = 'en' | 'es' | 'ru'`), z osobnymi seedami treści per język
  (`supabase/seed/es_01_vocabulary_*.sql` itd.) i wspólnym kodem.

**Wniosek: `matura` idzie tą samą drogą co Linguo.** Jedna aplikacja, wymiar języka
w danych, treść per język w seedach.

Konsekwencja dla rejestru w `lib/phoenix/apps.ts`:

```ts
{
  id: "matura",
  name: "Matura z języka",          // było: "Matura Angielski"
  description: "Przygotowanie do matury z angielskiego i hiszpańskiego (CKE)",
  section: "nauka",
  icon: "ScrollText",
  href: "/matura",
}
```

Ikona zostaje — `ScrollText` jest już na whiteliście w `components/phoenix/app-icon.tsx`
(to jest whitelista: nieznana nazwa cicho degraduje się do `LayoutGrid`).

---

## 3. Migracja: `0016_matura_language.sql`

Nowy plik, idempotentny, **bez edytowania `0013`/`0014`** (żelazna zasada tego repo).

```sql
do $$ begin
  create type matura_language as enum ('en', 'es');
exception when duplicate_object then null; end $$;
```

Gdzie kolumna języka jest potrzebna, a gdzie nie:

| Tabela | Zmiana | Dlaczego |
|---|---|---|
| `matura_sections` | `+ language matura_language not null default 'en'`; unikaty `(level, slug)` i `(level, order_index)` → `(language, level, slug)` i `(language, level, order_index)` | Sekcja jest korzeniem treści. |
| `matura_lessons`, `matura_tasks`, `matura_writing_tasks` | **bez zmian** | Mają `section_id` → język dziedziczą. |
| `matura_task_attempts`, `matura_section_progress`, `matura_writing_submissions` | **bez zmian** | Wiszą na sekcji/zadaniu. |
| `matura_mock_exams` | `+ language` | Trzyma `level` wprost, nie ma `section_id`. |
| `matura_study_plans` | `+ language`; unikat `(user_id)` → `(user_id, language)` | Plan jest per język — inaczej nauka drugiego języka kasuje plan pierwszego. |
| `matura_settings` | `+ language matura_language not null default 'en'` | Wybrany język egzaminu, obok wybranego poziomu. |
| `matura_progress_snapshots`, `matura_assigned_practice` | `+ language`, jeśli nie mają `section_id` | Sprawdź przed pisaniem migracji. |

`default 'en'` na istniejących wierszach jest celowy — **istniejąca treść angielska
i istniejący postęp uczniów muszą przeżyć migrację bez ruchu ręcznego.**

RLS: nowych polityk nie trzeba — istniejące działają dalej. Trzymaj się podziału z całego
repo: treść wspólna czytana przez każdego zalogowanego i zapisywana tylko przez
`public.is_admin()`, dane per-użytkownik przez `<table>_own` (`auth.uid() = user_id`)
+ `<table>_admin_read`.

### Typy

W `lib/types/database.ts`, obok `MaturaLevel`:

```ts
export type MaturaLanguage = "en" | "es";
```

Nie używaj `TargetLanguage` z Linguo — ono zawiera `'ru'`, dla którego nie ma i nie planujemy
treści maturalnej. Typ musi mówić prawdę o tym, co aplikacja realnie obsługuje.

---

## 4. Zmiany w kodzie

### 4.1. Prompty AI — sparametryzuj językiem

`lib/matura/writing-grading.ts` i `lib/matura/import-pdf.ts`: wszędzie tam, gdzie dziś jest
wpisane „angielski", wstaw `langGenitive(language)` / `langInfo(language).pl`
z `lib/languages.ts`. Każda funkcja oceniająca i importująca dostaje `language` jako
argument — z sekcji, zadania albo `matura_settings`.

Uwaga merytoryczna do promptu oceniającego: kryteria CKE są wspólne, ale **typowe błędy są
językowo specyficzne**. Dla hiszpańskiego warto dopisać do promptu feedbacku to, na czym
Polacy realnie tracą punkty: `ser`/`estar`, `por`/`para`, subjuntivo po wyrażeniach woli
i wątpliwości, zgodność czasów, `pretérito indefinido` vs `imperfecto`, rodzajniki,
kalki składniowe z polskiego.

Wszystko idzie przez `askAIForJSON` z `lib/ai.ts` — wyłącznie po stronie serwera, strukturalny
JSON wymuszony przypiętym tool callem. Nie wołaj Groq bezpośrednio i nie parsuj wolnego tekstu.

### 4.2. Wybór języka w UI

- `/matura/ustawienia` — wybór **języka** obok wyboru poziomu, zapisywany w `matura_settings`.
- Dashboard `/matura` i `/matura/nauka` filtrują treść po `(language, level)` z ustawień.
- Panel importu (`/matura/admin/import`) — jawny wybór języka importowanego arkusza,
  bez zgadywania.
- Przełącznik języka widoczny w nagłówku aplikacji, jeśli uczeń ma treść w obu.

### 4.3. Nazewnictwo i konwencje (obowiązkowe)

- **Zanim napiszesz kod: to nie jest Next.js, który znasz.** Przeczytaj przewodnik
  w `node_modules/next/dist/docs/` (wymóg z `AGENTS.md`). Next.js 16 zmienił `middleware.ts`
  na `proxy.ts`.
- Mutacje przez **Server Actions**; **Route Handler tylko dla uploadu plików**, bo wieloMB PDF
  przekracza limit body Server Action (wzorzec: `app/api/jezyki/import-textbook/route.ts`).
- Interfejs i trasy po polsku, kod i komentarze po angielsku.
- Blok komentarza-nagłówka w każdym pliku: nazwa pliku + **dlaczego** istnieje. To tu norma.

---

## 5. Treść hiszpańska

Nowy katalog `supabase/seed/matura-es/`, ta sama numeracja co `supabase/seed/matura/`:
`01_sections.sql` (8 wierszy: 2 poziomy × 4 części, `language = 'es'`), potem
`02_lessons_*` / `03_tasks_*` per część, `05`/`06_writing_tasks_*` per poziom.

Priorytet dla **poziomu rozszerzonego** — to jest cel z Twojego promptu; podstawowy
dopisujesz później, schemat i tak go obsługuje.

Skąd treść:

1. **Zagadnienia gramatyczne i tematy** — z podstawy programowej i Informatora
   (dokumenty publiczne). Lista tematów jest wspólna dla języków obcych; gramatyka jest
   hiszpańska (czasy przeszłe, subjuntivo, tryby warunkowe, `ser`/`estar`, `por`/`para`,
   peryfrazy czasownikowe, mowa zależna).
2. **Lekcje i zadania** — generowane przez AI z `teacherSystemPrompt('es')`, z panelem admina
   do przeglądu przed publikacją. Wzorzec: `lib/matma/ai-generation-lekcje.ts`.
3. **Prawdziwe arkusze CKE** — przez istniejący import PDF w panelu admina, nie przez
   automatyczne ściąganie ze strony CKE. Uzasadnienie w 7.3.

---

## 6. Nowe funkcje z Twojego promptu — jak je zbudować tutaj

### 6.1. Wgrywanie własnych arkuszy przez ucznia

Dziś import jest tylko admiński (`lib/matura/import-pdf.ts`). Rozszerzenie:

1. Route Handler `app/api/matura/import-arkusz/route.ts`, `export const maxDuration = 60`,
   limit **4 MB** na plik — sufit body funkcji serverless na Vercelu, ten sam co
   w `import-textbook`.
2. `pdf-parse` → `splitIntoImportChunks` (`lib/schola/pdf-chunking.ts`) → wywołanie AI
   **per chunk**, scalanie w kodzie. Nie proś modelu o cały plik naraz.
3. **Obowiązkowy ekran korekty przed zapisem** — wykryta kategoria (mapowana na
   `MaturaSectionSlug`: `sluchanie` / `czytanie` / `srodki-jezykowe` / `pisanie`), język,
   poziom i wyekstrahowane zadania, wszystko edytowalne. Tak działają Paragony i Schola.
   Podręcznik świadomie tego nie robi, bo ma zbyt zagnieżdżoną strukturę — arkusz jest płaski,
   więc **tutaj ekran korekty ma być**.
4. Plik do Supabase Storage (bucket `matura-arkusze`), pobierany podpisanym URL-em —
   wzorzec bucketu `math-attempts` w `lib/matma/spaced-review.ts`.
5. Nowe tabele: `matura_worksheets` (plik + wykryta kategoria + `uploaded_by`) i
   `matura_worksheet_items` (zadania po przeglądzie). Arkusz ucznia jest **prywatny**
   (RLS `_own`), dopóki admin nie oznaczy go jako wspólny — odwrotnie niż podręczniki
   w `0012_textbooks_shared.sql`, bo arkusz to zwykle materiał konkretnego nauczyciela.

**Formaty:** PDF działa od razu. **CSV** parsuj sam, bez zależności.
**DOCX wymaga nowej zależności** — patrz 7.5.

### 6.2. Gry

Typy gier to kod (`lib/matura/games.ts`), nie wiersze w bazie — uzasadnienie w rozdziale 8.
Zapisujemy **wynik**, w nowej tabeli `matura_game_sessions` (`user_id`, `game_type`,
`section_id`, `score`, `max_score`, `duration_ms`, `payload jsonb`).

- **Quiz ABCD** — z `matura_tasks`, w formatach CKE, nie ogólne pytania.
- **Dopasowywanie** — `components/matching/matching-game.tsx` **już istnieje** (gra „łączenie
  tłumaczeń" z rysowaną linią). Użyj jej ponownie dla par fraza↔definicja, kolokacja↔znaczenie,
  czasownik↔przyimek. Wersja z obrazkami — patrz 7.5.
- **Escape room** — pokój = sekwencja 4–6 „zamków", każdy to jedno zadanie językowe
  (parafraza, słowotwórstwo, luka, tłumaczenie fragmentu) losowane z `matura_tasks` dla
  wybranej sekcji; błąd kosztuje czas, nie blokuje. Stan pokoju w
  `matura_game_sessions.payload`, żeby dało się wrócić po odświeżeniu.

Każda gra po zakończeniu **zasila powtórki**: przegrane elementy wracają z krótszym interwałem.

### 6.3. Powtórki rozłożone w czasie

Dodaj `next_review_date` do `matura_section_progress` i port logiki z
`lib/matma/spaced-review.ts`. Jednostką powtórki jest sekcja/zagadnienie, nie pojedyncze
słówko — od słówek jest Linguo. Kolejka na dziś to pierwszy kafelek dashboardu `/matura`.

### 6.4. Symulacja egzaminu i plan nauki

**Tabele już są, brakuje interfejsu.** Zbuduj `/matura/egzamin` i `/matura/plan`:

- pełny arkusz na czas — **150 minut / 50 punktów** dla rozszerzonego
  (`time_limit_seconds` ma już default 9000 = 150 min), pauza i wznowienie,
- natychmiastowa ocena części zamkniętej + ocena AI wypowiedzi pisemnej wg czterech kryteriów
  CKE **osobno**, każde z uzasadnieniem po polsku (`writing-grading.ts` to już robi),
- plan do dnia matury z `matura_study_plans` / `_weeks`, wzorzec `lib/matma/study-plan.ts`.

### 6.5. Wymowa, słuchanie i część ustna

W repo **nie ma dziś żadnego API mowy** — to budowa od zera.

- **Rozumienie ze słuchu** — Groq udostępnia Whisper (`whisper-large-v3`): nagranie →
  transkrypcja → zadanie z lukami/ABCD. Taniej: istniejący pipeline YouTube Linguo
  (`lib/listening/`) na materiałach hiszpańskich.
- **Wymowa** — `MediaRecorder` w przeglądarce → Whisper na serwerze → porównanie z tekstem
  docelowym (odległość edycyjna na poziomie słów) → wskazanie słów do poprawy.
  **Nie obiecuj oceny fonetycznej** — Whisper mówi *co* usłyszał, nie *jak dobrze* to brzmiało.
- **Odsłuch wzorca** — `speechSynthesis` przeglądarki z `es-ES`, zero kosztu i zależności.
- **Część ustna** — dziś jej w module nie ma w ogóle. To osobne ~15 minut i **30 punktów**,
  wspólne dla obu poziomów (rozmowa wstępna, rozmowa z odgrywaniem roli, opis ilustracji
  z trzema pytaniami, wypowiedź na podstawie materiału stymulującego). Wymaga piątej sekcji
  (`ustna`) albo osobnej tabeli `matura_speaking_tasks` + `matura_speaking_attempts`
  (nagranie w Storage + transkrypcja + ocena AI). **Uwaga:** część ustna nie wchodzi do
  `MATURA_MAX_POINTS` — punktuje się osobno i tak trzeba ją pokazywać na dashboardzie.

---

## 7. Czym to się różni od oryginalnego promptu (i dlaczego)

### 7.1. Tryb offline — poza pierwszą wersję

Phoenix nie ma service workera ani manifestu PWA. Offline zrobione *dobrze* dla aplikacji na
Server Components i Server Actions to nie dodatek, tylko osobny model danych: co cache'ujemy,
co kolejkujemy, jak rozwiązujemy konflikty postępu przy synchronizacji. Ryzyko: rozjazd
postępu między urządzeniami i „zjedzone" wyniki.

**Rekomendacja:** wersja 1 online-only. Offline to osobny etap i decyzja **całego Phoenixa**
(service worker jest wspólny dla powłoki), nie jednej mini-aplikacji. Jeśli offline jest
wymaganiem twardym — powiedz, bo zmienia architekturę modułu gier od pierwszego dnia.

### 7.2. Limit 500 MB na użytkownika → nierealny

Darmowy plan Supabase to ~1 GB Storage **na cały projekt**, a Phoenix ma dziś osiem
zarejestrowanych mini-aplikacji dzielących tę samą bazę. 500 MB na użytkownika oznacza dwóch użytkowników. Do tego pojedynczy upload i tak
jest ograniczony do ~4,5 MB przez Vercela.

**Propozycja: 20 MB na użytkownika, 4 MB na plik**, licznik w profilu, czytelny komunikat po
przekroczeniu. „Opcja zakupu dodatkowego miejsca" zakłada płatności, których w Phoenixie nie
ma — pomijam; jeśli mają być, to osobny temat.

### 7.3. „Automatyczne pobranie całej teorii CKE" → seed + import przez admina

Automatyczny scraping cudzej strony po to, by zbudować własną bazę treści, jest ryzykowny
prawnie i sprzeczny z tym, co sam prompt deklaruje w „Czego aplikacja świadomie nie robi".
Podstawa programowa i struktura egzaminu to dokumenty publiczne — te seedujemy. Arkusze
wchodzą przez świadomy import pliku, do którego użytkownik ma prawo. Efekt dla ucznia ten
sam, bez wystawiania projektu.

### 7.4. Stack z oryginału → stack Phoenixa

| Oryginał | Tutaj | Dlaczego |
|---|---|---|
| Express / FastAPI | Server Actions + Route Handlers | Brak osobnego backendu w Phoenixie. |
| React (web) **lub** Flutter | Next.js 16, responsywny web | Rozdział 0. |
| Elasticsearch | Postgres `tsvector` + `pg_trgm` | Skala nie uzasadnia drugiego silnika. |
| GPT-4 | Groq przez `askAIForJSON` | Całe repo tak robi; darmowy tier, lista modeli zapasowych. |
| JWT pisane ręcznie | Supabase Auth + RLS | Bezpieczeństwo w bazie, nie w kodzie aplikacji. |
| „szyfrowanie plików" | Prywatny bucket + podpisane URL-e | Standard Supabase; własne szyfrowanie zepsułoby podgląd. |

### 7.5. Dwie decyzje — rozstrzygnięte

- **DOCX: nie robimy.** Decyzja podjęta. Obsługujemy PDF (`pdf-parse`, już w zależnościach)
  i CSV (parsujemy sami). Bez zależności `mammoth`.
- **Obrazki do gry „matching": są darmowe źródła.** Trzy realne opcje, w kolejności
  malejącego tarcia:
  1. **Openverse** (`api.openverse.org`) — agreguje materiały na licencjach CC,
     **działa bez klucza API** dla podstawowego wyszukiwania. Najmniejsze tarcie.
  2. **Wikimedia Commons** (`commons.wikimedia.org/w/api.php`) — bez klucza, domena
     publiczna i CC, świetne dla rzeczowników konkretnych (zwierzęta, przedmioty, miejsca).
  3. **Pexels / Pixabay** — ładniejsze zdjęcia i wygodniejsze API, ale **wymagają darmowego
     klucza** w `.env.local`, dokładnie jak `GROQ_API_KEY`.

  Rekomendacja: **Openverse albo Wikimedia**, bo nie dokładają sekretu do konfiguracji.
  Trzy rzeczy do zrobienia niezależnie od wyboru: (a) **cache'uj URL-e w bazie**, nie odpytuj
  API przy każdej partii; (b) dodaj host do `images.remotePatterns` w `next.config.ts` —
  inaczej `next/image` odmówi; (c) **zapisuj autora i licencję** razem z URL-em i pokazuj
  atrybucję, bo tego wymaga CC.

  Uwaga praktyczna: obrazki mają sens dla słownictwa konkretnego. Dla materiału maturalnego
  na poziomie rozszerzonym (parafrazy, kolokacje, subjuntivo) obrazek niczego nie doda —
  tam zostaje dopasowanie fraza↔definicja.

### 7.6. Kryteria sukcesu — uściślone

„80% użytkowników kończy program w 6 miesięcy" i „średnia symulacji > 85%" to cele
produktowe, a nie coś, co aplikacja może o sobie stwierdzić — zwłaszcza przy jednocyfrowej
liczbie użytkowników. Co **da się** zmierzyć i warto oprzyrządować od początku:

- odsetek ukończonych zagadnień per uczeń i mediana czasu do domknięcia sekcji,
- trend wyniku kolejnych symulacji, w rozbiciu na cztery części arkusza
  (`matura_progress_snapshots` już to unosi),
- utrzymanie: dni aktywne w tygodniu i streak — mechanizm istnieje od `0001_init.sql`,
- realny cel ucznia: **≥ 80% punktów**, czyli 40/50 na rozszerzonym — trzymaj w
  `matura_settings` obok poziomu i języka, i pokazuj dystans do celu na dashboardzie
  (Matma robi dokładnie tak).

„Ocena UX > 4,5/5" wymaga ankiety, której w aplikacji nie ma — albo dodajemy prosty moduł
opinii, albo skreślamy kryterium jako niemierzalne.

---

## 8. Model danych z oryginalnego promptu → tutaj

| Encja z oryginału | Tutaj | Uwaga |
|---|---|---|
| `User` | **`profiles`** (istnieje) | Nie twórz nowej tabeli użytkowników — `role`, `level`, `installed_apps` już są. Preferencje egzaminacyjne → `matura_settings`. |
| `Topic` | `matura_sections` (+ `matura_lessons`) | `ckey_reference` → `cke_reference` (literówka w oryginale). |
| `GrammarRule` | treść w `matura_lessons` | Osobna tabela reguł duplikowałaby `grammar_topics` z Linguo. |
| `Worksheet` | `matura_worksheets` (nowa) | `file_path` → ścieżka w Supabase Storage. |
| `Game` | **nie jest tabelą** | Patrz niżej. |
| `Progress` | `matura_section_progress` | Dołóż `next_review_date`. |
| `ExamSimulation` | `matura_mock_exams` (istnieje) | Brakuje tylko interfejsu. |

**Dlaczego `Game` nie jest tabelą.** W oryginale `Game` ma `type`, `related_topic_ids`,
`difficulty` — to opis *instancji rozgrywki*, która nie ma trwałej tożsamości. Typ gry to kod,
a trudność i temat wynikają z treści, którą gra dostaje. Trzymanie tego w bazie znaczy, że
dodanie nowej gry wymaga wiersza w bazie, a każda partia — insertu. Matma tego nie robi
i słusznie. Zostaje wynik w `matura_game_sessions`, bo to zasila powtórki i statystyki.

---

## 9. Kolejność wdrożenia

Każdy etap samodzielnie użyteczny; po każdym aplikacja działa.

- [x] **1. Wymiar języka** — `0016_matura_language.sql`, typ `MaturaLanguage`, parametryzacja
  wszystkich miejsc z 1.2, wybór języka na `/matura` i `/matura/ustawienia`, wybór języka
  w panelu importu, nowa nazwa w rejestrze Phoenixa.
- [x] **2. Treść hiszpańska** — `supabase/seed/matura-es/`, oba poziomy: sekcje, lekcje
  i banki zadań dla środków językowych, czytania i pisania; dla słuchania sama lekcja
  (uzasadnienie w nagłówku `09_lessons_sluchanie.sql`).
- [x] **2a. Pasek znaków hiszpańskich** — nieplanowany, ale konieczny: ocena nie usuwa
  akcentów, więc bez niego uczeń na polskiej klawiaturze tracił punkty za układ klawiatury,
  a nie za hiszpański (`components/matura/accent-bar.tsx`).
- [ ] **3. Symulacja arkusza + plan nauki** — interfejs do istniejących tabel
  (`matura_mock_exams`, `matura_study_plans` — tabele są, tras `/matura/egzamin`
  i `/matura/plan` nadal nie ma).
- [ ] **4. Powtórki** — `next_review_date` + kolejka na dashboardzie.
- [ ] **5. Wgrywanie własnych arkuszy przez ucznia** — Route Handler, ekstrakcja, ekran
  korekty, Storage. (Import admiński już działa i zna teraz język.)
- [ ] **6. Gry** — quiz i dopasowywanie (recykling `matching-game.tsx`), potem escape room.
- [ ] **7. Mowa** — słuchanie z Whisper, wymowa, na końcu część ustna (nowa sekcja,
  30 pkt liczonych osobno).
- [ ] **8. Zadania ze słuchu po hiszpańsku** — wymagają wybrania i zweryfikowania realnych
  nagrań YouTube.
- [ ] **9. (Opcjonalnie) PWA/offline** — decyzja na poziomie całego Phoenixa.

---

## 10. Błędy i przypadki brzegowe

- **Nie udało się sparsować pliku** — komunikat po polsku mówiący *co* zawiodło (nieczytelny
  PDF / skan bez warstwy tekstowej / plik za duży), plik zostaje zapisany, kategorię i zadania
  można wpisać ręcznie. Nigdy nie porzucaj uploadu po cichu.
- **AI zwróciło niepełny schemat** — ratuj, co się da, zamiast wywalać cały import. Wzorzec
  jest już w repo (commit „Textbook extraction: tolerate partial AI schema violations",
  `lib/textbook/extract.ts`).
- **Groq niedostępny / wyczerpany limit** — `lib/ai.ts` ma listę modeli zapasowych; funkcje AI
  degradują się do treści z bazy, nie wysypują ekranu.
- **Przerwana symulacja** — status `in_progress` z timestampem; po powrocie wznów z pozostałym
  czasem albo oznacz `abandoned`. Porzuconych nie licz do statystyk.
- **Uczeń przełącza język w trakcie nauki** — postęp obu języków zostaje nienaruszony
  (dlatego `matura_study_plans` unikat na `(user_id, language)`, a nie `(user_id)`).
- **Brak mikrofonu / odmowa uprawnień** — moduł mowy pokazuje wersję tekstową, nie blokuje postępu.
- **Wypracowanie poniżej progu słów** — „gilotyna" CKE już jest zaimplementowana
  (`MATURA_WRITING_WORD_RANGE.floor`); pokaż uczniowi licznik słów **przed** wysłaniem.
- **Limit przechowywania** — patrz 7.2.

---

## 11. Czego aplikacja świadomie nie robi

- Nie udaje narzędzia CKE i nie twierdzi, że generowane zadania są zadaniami CKE — źródło
  każdego zadania jest widoczne (`matura_task_source`: `past_exam` vs `ai_generated`).
- Nie redystrybuuje chronionych arkuszy — wgrany plik jest domyślnie prywatny dla wgrywającego.
- Nie zastępuje nauczyciela i nie ocenia „ostatecznie" — punktacja AI jest oznaczona jako
  orientacyjna, a przy wypowiedzi pisemnej i ustnej zawsze z uzasadnieniem, które da się
  zakwestionować.
- Nie duplikuje Linguo — braki na poziomie podstaw kieruje do `/jezyki`.
- Nie ocenia fonetyki wymowy — porównuje transkrypcję, i mówi o tym wprost.
