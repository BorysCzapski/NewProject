# Phoenix — platforma mini-aplikacji

**Phoenix** to jedna aplikacja-powłoka (super-app), w której mieszkają mini-aplikacje —
każda pod własną przestrzenią tras, ze wspólnym logowaniem, profilem i motywem. Ekran
główny (`/`) to launcher z kafelkami zainstalowanych aplikacji podzielonymi na sekcje
(Nauka / Narzędzia / Wiara); użytkownik wybiera swoje aplikacje na `/aplikacje`.
Rejestr aplikacji: `lib/phoenix/apps.ts` — dodanie nowej mini-aplikacji to jeden wpis
tam + trasy pod `app/(main)/<id>/`.

Pierwsza mini-aplikacja to **Linguo** (`/jezyki`) — nauka języków po polsku
(angielski, hiszpański, rosyjski): fiszki i trener słówek, gramatyka z interaktywnymi
lekcjami, czytanie i pisanie oceniane przez AI, tłumaczenie piosenek, słuchanie z lukami
(YouTube), gra „łączenie tłumaczeń", prace domowe z panelem admina, kalendarz i streaki,
a dla rosyjskiego — wprowadzenie do cyrylicy i ekranowa klawiatura.

Druga mini-aplikacja to **Kuźnia** (`/kuznia`) — kreator promptów do budowy kolejnych
aplikacji: czat z AI buduje razem z użytkownikiem, wiadomość po wiadomości, gotowy do
skopiowania dokument promptu (Markdown), na bieżąco podpowiadając konkretne uzupełnienia
i wykrywając sprzeczności/luki w dotychczasowych ustaleniach — z propozycją naprawy jednym
kliknięciem. Gotowy prompt wkleja się w nową, osobną sesję czatu, żeby zacząć budowę.

Trzecia mini-aplikacja to **Matma** (`/matma`) — pełny kurs + trener zadaniowy + symulator
egzaminu przygotowujący do matury rozszerzonej z matematyki (CKE), z celem 80% punktów:
interaktywne lekcje (suwaki parametrów wykresów, przeciąganie punktów geometrii, obracalne
bryły 3D, rozwiązania krok po kroku z odsłanianiem), bank zadań z czterech źródeł (tematyczne,
prawdziwe zadania maturalne CKE, kuratorowane, generowane przez AI) oceniany analitycznym
schematem punktowym jak na maturze, diagnoza startowa i adaptacyjna ścieżka nauki per dział,
rysik/tablet graficzny (Pointer Events — nacisk, gumka, cofnij/ponów) do zapisu toku
rozwiązania, pełne symulacje egzaminu (180 minut, 50 punktów), spersonalizowany harmonogram
nauki do dnia matury, trener dowodów i panel nauczyciela.

Czwarta mini-aplikacja to **Paragony** (`/paragony`) — paragony, budżet domowy i portfel
ETF: skanowanie paragonu ze zdjęcia (Groq, model wizyjny) z ekranem korekty przed zapisem,
automatyczna kategoryzacja AI, konta/portfele z saldem per konto, rachunki cykliczne
(czynsz, subskrypcje), cele oszczędnościowe z szacowaną datą osiągnięcia, budżet miesięczny
plan vs wykonanie z wykresami i drill-downem do listy transakcji; oraz ręczna ewidencja
posiadanych ETF-ów z automatycznym pobieraniem i cache'owaniem cen (Stooq dla GPW, FMP dla
zagranicznych), wykresem wartości portfela w czasie, CAGR/zmiennością/max drawdown liczonymi
z realnych danych (uwzględniając dywidendy) i symulatorem „co jeśli" bez zapisu do bazy.

Piąta mini-aplikacja to **Matura z języka** (`/matura`) — przygotowanie do matury z języka
obcego (CKE): **angielskiego albo hiszpańskiego**, poziom podstawowy lub rozszerzony (język
i poziom wybierasz na starcie, oba zmienialne w każdej chwili; przełączenie języka niczego nie
kasuje — postęp każdego języka czeka tam, gdzie go zostawiłeś). Jeden moduł obsługuje oba
języki, bo CKE ustala **ten sam format egzaminu dla wszystkich języków obcych nowożytnych** —
te same cztery części, te same 60/50 punktów, te same kryteria wypowiedzi pisemnej; różni się
wyłącznie treść (patrz `0016_matura_language.sql`). Struktura odzwierciedla realny egzamin: cztery części — rozumienie ze słuchu, rozumienie
tekstów pisanych, znajomość środków językowych, wypowiedź pisemna — każda z osobną wagą punktową
(edytowalne przybliżenie, nie oficjalny rozkład CKE) i szacowanym wynikiem na dashboardzie.
Wszystkie cztery działy działają już dziś, każdy z lekcją (kryteria CKE, typy zadań, strategie,
przykłady) i bankiem zadań. **Znajomość środków językowych**: słowotwórstwo, wybór wielokrotny,
parafraza jednym wyrazem, parafraza ze słowem kluczowym — oceniane programistycznie (dokładne
dopasowanie znormalizowanej odpowiedzi, bez AI). **Rozumienie tekstów pisanych**: wybór
wielokrotny, dopasowanie nagłówków, prawda/fałsz, tekst z lukami zdaniowymi, dopasowanie pytań do
fragmentów tekstu — oryginalne teksty w stylu i typach zadań prawdziwych arkuszy CKE, oceniane tak
samo programistycznie. **Rozumienie ze słuchu**: prawdziwe, publicznie dostępne nagrania BBC
Learning English („6 Minute English") osadzone przez ten sam odtwarzacz YouTube co moduł słuchania
w Linguo — każde pytanie sprawdzone względem faktycznie pobranej transkrypcji nagrania (tą samą
biblioteką co `lib/listening/fetch-transcript.ts`), a nie zgadywane. **Wypowiedź pisemna**: lekcja
z pełnym rozkładem punktowym CKE (12 pkt podstawowa / 13 pkt rozszerzona, źródło: oficjalny
Informator o egzaminie maturalnym), przydatnymi zwrotami i jednym w pełni omówionym przykładem na
maksimum punktów per poziom, plus bank zadań (e-mail/wpis na blogu na podstawie — w tym prawdziwe
tematy z Informatora CKE; rozprawka za i przeciw na rozszerzonym — w tym prawdziwe tematy z matur
2023-2025) z własną, oryginalną wzorcową odpowiedzią odsłanianą po wysłaniu własnej pracy. Ocena
wypowiedzi pisemnej jest analityczna wg 4 kryteriów CKE (Groq, z twardo wymuszaną w kodzie zasadą
„gilotyny" długości tekstu — poniżej progu słów pozostałe kryteria są zerowane niezależnie od oceny
AI), nie jednym zbiorczym wynikiem. Panel administratora (`/matura/admin/import`, widoczny na
dashboardzie tylko dla `role = 'admin'`) pozwala wgrać dowolny arkusz maturalny z poprzednich lat
jako PDF (opcjonalnie razem z osobnym plikiem klucza odpowiedzi, co poprawia trafność odpowiedzi w
zadaniach zamkniętych) — AI wyodrębnia z niego zadania środków językowych, czytania i pisania
(zawsze `source: 'curated'` + `needsReview: true`, świadomie ostrożniejsze niż automatyczny
pipeline Matmy, bo nie da się algorytmicznie zweryfikować, że wgrany PDF to naprawdę niezmieniony
arkusz CKE — patrz `lib/matura/import-pdf.ts`). „Rozumienie ze słuchu" jest z tego importu świadomie
wykluczone: arkusz to sam tekst, bez nagrania, a CKE nawet nie drukuje transkrypcji zadań na
słuchanie. Schemat bazy (`supabase/migrations/0013_matura.sql`, `0014_matura_writing.sql`) jest już
przygotowany na resztę docelowego zakresu: symulacje egzaminu, plan nauki do dnia matury,
przydzielanie ćwiczeń uczniom — czekają na UI w kolejnych sesjach.

**Schola** (`/schola`) jest inna niż powyższe — to NIE jest mini-aplikacja Phoenixa (nie ma
wpisu w `lib/phoenix/apps.ts`, nie pojawia się na `/aplikacje` ani na launcherze `/`). To
w pełni osobny realm dla scholi kościelnej: własna rejestracja/logowanie (`/schola/logowanie`,
`/schola/rejestracja`), własna powłoka bez dolnej nawigacji Phoenixa — użytkownicy Scholi
nigdy nie widzą reszty Phoenixa. Mimo to działa w tym samym wdrożeniu Next.js i tym samym
projekcie Supabase (dla prostoty hostingu), z osobną tabelą członkostwa `schola_members`
(niezależną od `profiles`) i politykami RLS opartymi o `is_schola_member()` zamiast
własności wiersza — każdy zalogowany członek scholi może edytować każdą pieśń i każdy plan.
Funkcje: śpiewnik (tytuł, tekst z akordami w formacie ChordPro, tagi liturgiczne, linki do
nagrań/nut), planowanie Mszy (uporządkowana lista pieśni z notatkami typu „2x refren, 1x
zwrotka"), import całego śpiewnika z PDF-a (AI dzieli plik na pojedyncze pieśni) oraz import
pojedynczej pieśni ze zdjęcia nut/tekstu z akordami — oba z obowiązkowym ekranem korekty
przed zapisem, ten sam schemat co w Paragonach. Zob. `supabase/migrations/0009_schola.sql`
i `lib/schola/*` po szczegóły; osoba z istniejącym kontem Phoenixa, która chce dołączyć do
Scholi, loguje się tym samym e-mailem na `/schola/logowanie` (patrz komentarz „Sharp edges”
w planie implementacji, jeśli szukasz uzasadnienia tej decyzji).

## Spis treści

- [Stack technologiczny](#stack-technologiczny)
- [Funkcje](#funkcje)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Konfiguracja Supabase](#konfiguracja-supabase)
- [Zmienne środowiskowe](#zmienne-środowiskowe)
- [Konto administratora](#konto-administratora)
- [Struktura projektu](#struktura-projektu)
- [Deploy na Vercel](#deploy-na-vercel)

## Stack technologiczny

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** — projekt mobile-first, dolna nawigacja jak w aplikacji mobilnej
- **Supabase** — Postgres, autentykacja e-mail/hasło, Row Level Security
- **Groq API** (Llama 3.3) — generowanie i ocenianie treści, wyłącznie po stronie serwera, darmowy tier
- **youtube-transcript** — pobieranie transkrypcji filmów YouTube do modułu słuchania

> Next.js 16 zmienił konwencję `middleware.ts` na `proxy.ts` (patrz `proxy.ts` w katalogu
> głównym) — jeśli coś aktualizujesz w oparciu o starsze przykłady z internetu, uwzględnij tę zmianę.

## Funkcje

1. **Wybór języka** — aplikacja uczy **angielskiego, hiszpańskiego lub rosyjskiego** (dla osób
   mówiących po polsku). Język wybierasz przy zakładaniu konta i możesz go zmienić w profilu —
   wszystkie treści (słówka, gramatyka, teksty, piosenki) przełączają się na wybrany język.
2. **Autentykacja i profil** — rejestracja/logowanie e-mail+hasło, wybór języka i poziomu (A1-B2)
   zaraz po rejestracji, zmiana w profilu, tryb jasny/ciemny.
3. **Ścieżka nauki** — mapa etapów per poziom (kategoria słówek + powiązany temat gramatyczny na
   etap); kolejny etap odblokowuje się po opanowaniu 80% słówek z bieżącej kategorii. Admin widzi
   na jakim etapie jest każdy uczeń i może jednym kliknięciem zadać temu uczniowi pracę domową
   z zaległej kategorii.
4. **Słówka** — fiszki z animacją obrotu i prostym algorytmem powtórek + trener znaczeń;
   oba tryby wspierają ćwiczenie pojedynczej kategorii (np. z poziomu ścieżki nauki).
5. **Łączenie tłumaczeń** — gra: łączysz słowo w języku obcym z jego polskim tłumaczeniem
   (rysowana linia). Można z niej zadać pracę domową.
6. **Gramatyka** — tematy per poziom z wyjaśnieniami po polsku, ćwiczenia (luki, wybór,
   przekształcenia zdań oceniane przez AI).
7. **Czytanie** — AI generuje krótkie artykuły w wybranym języku, dopasowane do poziomu i tematu,
   zadaje pytania (ABCD + otwarte), ocenia odpowiedzi otwarte.
8. **Pisanie** — krótkie formy (bez esejów) z losowym, konkretnym poleceniem od AI, ocena
   poprawności/słownictwa, poprawiona wersja tekstu, mini-dialog pogłębiający.
9. **Piosenki** — wklejasz tekst piosenki, tłumaczysz linijka po linijce (AI akceptuje sensowne
   warianty); tryb „Słówka" pozwala dotknąć dowolnego słowa, by zobaczyć jego znaczenie w kontekście.
10. **Słuchanie** — wklejasz link do YouTube, aplikacja pobiera transkrypcję i tworzy ćwiczenie
    z lukami; kliknięcie luki przewija film do właściwego momentu.
11. **Prace domowe** — admin tworzy zadania (9 typów) dla całego poziomu **lub konkretnego ucznia**,
    może edytować ich treść, a każde zadanie ma jasny opis wymagań; postęp liczy się automatycznie.
12. **Kalendarz i streaki** — kalendarz miesięczny z oznaczonymi dniami aktywności, aktualny
    streak i rekord, zbiorcze statystyki.

## Uruchomienie lokalne

Wymagania: Node.js 20.9+ (zalecane 22+), konto Supabase, klucz API Groq (do funkcji AI, darmowy).

```bash
npm install
cp .env.example .env.local   # uzupełnij wartości — patrz niżej
npm run dev
```

Aplikacja wystartuje na [http://localhost:3000](http://localhost:3000).

## Konfiguracja Supabase

1. Utwórz nowy projekt na [supabase.com](https://supabase.com).
2. W **SQL Editor** uruchom po kolei zawartość plików z katalogu `supabase/`
   (albo z terminala — patrz [Wgrywanie migracji z terminala](#wgrywanie-migracji-z-terminala)):

   **Migracje (schemat):**
   1. `supabase/migrations/0001_init.sql` — schemat bazy (tabele, enumy, RLS, funkcje).
   2. `supabase/migrations/0002_learning_path.sql` — tabela ścieżki nauki (etapy per poziom).
   3. `supabase/migrations/0003_multilang_homework_matching.sql` — wielojęzyczność (kolumna
      `language` + `profiles.target_language`), prace domowe per-uczeń, gra „łączenie tłumaczeń",
      polityki RLS admin-read (dzięki nim admin widzi postęp uczniów).
   4. `supabase/migrations/0004_writing_tasks_insert_own.sql` — polityka RLS pozwalająca
      uczniom generować zadania pisemne.
   5. `supabase/migrations/0005_phoenix_installed_apps.sql` — kolumna `installed_apps`
      (aplikacje widoczne na launcherze Phoenixa).
   6. `supabase/migrations/0006_prompt_forge.sql` — tabela `prompt_sessions` (Kuźnia:
      sesje kreatora promptów).
   7. `supabase/migrations/0007_matma.sql` — schemat Matmy (matura rozszerzona z matematyki):
      działy, lekcje, bank zadań, próby, egzaminy próbne, postęp per dział, ścieżka nauki,
      migawki postępu, plan nauki, przypisane ćwiczenia; tworzy też prywatny bucket Storage
      `math-attempts` na zdjęcia brudnopisu.
   8. `supabase/migrations/0008_paragony_budzet_etf.sql` — schemat Paragonów: konta,
      kategorie budżetowe, paragony + pozycje, transakcje (uznanie/obciążenie/transfer),
      rachunki cykliczne, cele oszczędnościowe, budżet miesięczny, portfel ETF (holdingi,
      transakcje kupna/sprzedaży, dywidendy) oraz globalny cache cen `etf_price_history`
      (bez RLS per-user — patrz komentarz w migracji); tworzy też prywatny bucket Storage
      `paragony-receipts` na zdjęcia paragonów.
   9. `supabase/migrations/0009_schola.sql` — schemat Scholi (osobny realm, patrz wyżej):
      `schola_members` (osobne członkostwo, niezależne od `profiles`), `schola_songs`
      (śpiewnik), `schola_mass_plans` + `schola_mass_plan_items` (planowanie Mszy); RLS
      oparta o funkcję `is_schola_member()`, nie o własność wiersza — brak bucketu Storage
      (import PDF/zdjęcia jest przetwarzany tymczasowo, nic nie jest trwale zapisywane).
   10. `supabase/migrations/0013_matura.sql` — schemat Matury Angielski: cztery części
      egzaminu per poziom (`matura_sections`), lekcje, bank zadań, próby, symulacje
      egzaminu, postęp per część, migawki postępu, plan nauki, przydzielone ćwiczenia
      i wybrany poziom matury (`matura_settings`) — pełny docelowy zakres (patrz opis
      aplikacji wyżej), choć dziś tylko dwa działy mają treść.
   11. `supabase/migrations/0014_matura_writing.sql` — schemat „Wypowiedzi pisemnej":
      `matura_writing_tasks` (bank zadań z wzorcową odpowiedzią) i
      `matura_writing_submissions` (oceniane analitycznie przez AI wg 4 kryteriów CKE,
      patrz opis aplikacji wyżej) — osobne tabele od `matura_tasks`/`matura_task_attempts`
      z 0013, bo ocena jest holistyczna, nie dopasowaniem pojedynczych odpowiedzi.

   **Seed — konto admina:**
   8. `supabase/seed/00_admin.sql` — konto administratora (patrz [niżej](#konto-administratora)).

   **Seed — angielski (język domyślny):**
   9. `01_vocabulary_a1.sql` … `01_vocabulary_b2.sql` — słownictwo EN (~1000 słówek).
   10. `02_grammar_a1.sql` … `02_grammar_b2.sql` — gramatyka EN (5 tematów × ~30 ćwiczeń/poziom).
   11. `03_learning_path.sql` — ścieżka nauki EN.

   **Seed — hiszpański (opcjonalnie, jeśli chcesz język ES):**
   12. `es_01_vocabulary_a1.sql` … `es_01_vocabulary_b2.sql`, `es_02_grammar_a1.sql` …
      `es_02_grammar_b2.sql`, a na końcu `es_03_learning_path.sql`.

   **Seed — rosyjski (opcjonalnie, jeśli chcesz język RU):**
   13. `ru_01_vocabulary_a1.sql` … `ru_02_grammar_b2.sql`, a na końcu `ru_03_learning_path.sql`.

   **Seed — Matma:**
   14. `supabase/seed/matma/01_topics.sql` — 11 działów matury rozszerzonej z matematyki
      + rekomendowana kolejność (ścieżka nauki).
   15. `supabase/seed/matma/02_lessons_<dzial>.sql` i `03_problems_<dzial>.sql` (po jednej
      parze plików na dział, 11 par) — interaktywne lekcje i bank zadań (źródło `topic`).
      Uruchom `01_topics.sql` przed nimi (odwołują się do działów po `slug`).
   16. Prawdziwe zadania maturalne CKE (`source: 'past_exam'`) **nie** są w plikach seed —
      importuje je administrator jednorazowym skryptem z panelu `/matma/admin/import`
      (patrz `lib/matma/import-past-exams.ts`), nie jest to część standardowego seedowania.

   **Seed — Matura (angielski):**
   17. `supabase/seed/matura/01_sections.sql` — 4 części egzaminu × 2 poziomy
      (`matura_sections`), z wagami punktowymi (przybliżenie, patrz opis aplikacji wyżej).
   18. `supabase/seed/matura/02_lessons_srodki_jezykowe.sql` — po jednej lekcji na poziom
      dla działu „Znajomość środków językowych" (treść jsonb w formacie `GrammarBlock`,
      ten sam renderer co lekcje gramatyki w Linguo). Uruchom `01_sections.sql` wcześniej.
   19. `supabase/seed/matura/03_tasks_srodki_jezykowe.sql` — kuratorowany bank zadań
      (`source: 'curated'`), po 3 zadania na poziom. Uruchom `01_sections.sql` wcześniej.
   20. `supabase/seed/matura/04_lessons_pisanie.sql` — po jednej lekcji na poziom dla
      działu „Wypowiedź pisemna" (kryteria CKE, przydatne zwroty, w pełni omówiony
      przykład na maksimum punktów). Uruchom `01_sections.sql` wcześniej.
   21. `supabase/seed/matura/05_writing_tasks_podstawowa.sql` i
      `06_writing_tasks_rozszerzona.sql` — bank zadań pisemnych (`matura_writing_tasks`),
      4 na poziom, część z prawdziwych tematów CKE (`source: 'past_exam'`) — patrz
      komentarz w każdym pliku po dokładne źródło — reszta oryginalne (`source: 'curated'`).
      Każde zadanie ma własną, oryginalną wzorcową odpowiedź. Uruchom `01_sections.sql`
      wcześniej.
   22. `supabase/seed/matura/07_lessons_czytanie.sql` i `08_tasks_czytanie.sql` — lekcja +
      kuratorowany bank zadań (`source: 'curated'`) dla „Rozumienia tekstów pisanych", po
      3 zadania na poziom — oryginalne teksty w typach zadań prawdziwych arkuszy CKE
      (dopasowanie nagłówków, prawda/fałsz, tekst z lukami zdaniowymi, dopasowanie pytań
      do fragmentów). Uruchom `01_sections.sql` wcześniej.
   23. `supabase/seed/matura/09_lessons_sluchanie.sql` i `10_tasks_sluchanie.sql` — lekcja
      + kuratorowany bank zadań dla „Rozumienia ze słuchu", po 2 zadania na poziom, każde
      osadzające prawdziwe nagranie BBC Learning English („6 Minute English",
      `content.youtubeVideoId`) — pytania zweryfikowane względem faktycznie pobranej
      transkrypcji nagrania, nie zgadywane. Uruchom `01_sections.sql` wcześniej.

   **Seed — Matura (hiszpański):** komplet niezależny od angielskiego, w katalogu
   `supabase/seed/matura-es/`. Wymaga wcześniej migracji `0016_matura_language.sql`.
   24. `matura-es/01_sections.sql` — te same 4 części × 2 poziomy, tym razem z
      `language = 'es'`. **Uruchom przed pozostałymi plikami z tego katalogu.**
   25. `matura-es/02_lessons_srodki_jezykowe.sql` i `03_tasks_srodki_jezykowe.sql` — lekcja
      + bank zadań dla „Znajomości środków językowych" (3 zadania na podstawie, 4 na
      rozszerzeniu): słowotwórstwo, ser/estar, por/para, subjuntivo vs indicativo,
      indefinido vs imperfecto, parafrazy i tłumaczenie fragmentów.
   26. `matura-es/04_lessons_pisanie.sql`, `05_writing_tasks_podstawowa.sql`,
      `06_writing_tasks_rozszerzona.sql` — lekcja + po 3 zadania na poziom, każde z własną
      oryginalną wzorcową odpowiedzią. Wszystkie oznaczone `source: 'curated'` (nie
      `past_exam`) — są pisane w formacie CKE, ale nie są przepisanymi arkuszami, więc
      etykieta „prawdziwe zadanie CKE" byłaby nieuczciwa.
   27. `matura-es/07_lessons_czytanie.sql` i `08_tasks_czytanie.sql` — lekcja + po 2 zadania
      na poziom, oryginalne teksty w formatach CKE (wybór wielokrotny, dobieranie nagłówków,
      intencja autora, uzupełnianie luk zdaniami).
   28. `matura-es/09_lessons_sluchanie.sql` — **tylko lekcja, bez zadań.** Zadanie ze słuchu
      wymaga `content.youtubeVideoId` wskazującego na realne, wciąż dostępne nagranie;
      wymyślony identyfikator dałby uczniowi martwy odtwarzacz, co jest gorsze niż uczciwy
      stan „brak zadań". Zadania hiszpańskie dodaj tak samo jak angielskie: wybierz
      nagranie, zweryfikuj identyfikator, dopiero potem napisz pytania.

   Każdy plik seeda usuwa najpierw swoje dane (`delete ... where language = ... and level = ...`),
   więc można je bezpiecznie uruchomić ponownie — pliki jednego języka **nie ruszają** danych
   pozostałych języków. `*_03_learning_path.sql` wymaga wcześniej uruchomionych plików ze
   słownictwem i gramatyką danego języka (odwołuje się do ich kategorii i tematów).

   > ⚠️ Ponowne uruchomienie seeda **słownictwa** danego języka wstawia słówka z nowymi ID,
   > więc kasuje postęp opanowania słówek (`vocabulary_progress`) tego języka — to skutek
   > kaskady kluczy obcych, nie błąd. Uruchamiaj ponownie tylko wtedy, gdy naprawdę chcesz
   > odświeżyć pulę słówek.

   > ⚠️ Seedy **gramatyki** (`*02_grammar_*.sql`) czyszczą też etapy ścieżki nauki swojego
   > języka (etapy wskazują na tematy gramatyczne kluczem obcym). Po ich ponownym uruchomieniu
   > zawsze uruchom na końcu `*_03_learning_path.sql` tego języka, żeby odtworzyć ścieżkę.
3. W **Authentication → Providers** upewnij się, że logowanie e-mail/hasło jest włączone.
   Do szybkich testów lokalnych możesz wyłączyć "Confirm email" w
   **Authentication → Sign In / Providers**, żeby rejestracja od razu dawała aktywną sesję
   (w przeciwnym razie użytkownik musi potwierdzić adres e-mail przed pierwszym logowaniem).
4. Skopiuj **Project URL**, **anon public key** i **service_role key** z
   **Project Settings → API** do `.env.local`.

### Wgrywanie migracji z terminala

Zamiast klikać w SQL Editor można puścić migracje skryptem `scripts/db.mjs`. Wymaga jednej
dodatkowej zmiennej w `.env.local` — connection stringu z **Project Settings → Database →
Connection string → Session pooler** (port 5432; „Direct connection" jest IPv6-only i zwykle
nie łączy się z domowego łącza), z `[YOUR-PASSWORD]` podmienionym na hasło do bazy:

```bash
SUPABASE_DB_URL=postgresql://postgres.<ref>:<haslo>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

```bash
npm run db status              # co jest wgrane, co czeka
npm run db baseline            # jednorazowo: oznacz już wklejone migracje jako wgrane
npm run db up                  # wgraj oczekujące migracje (każda w transakcji)
npm run db up -- --dry-run     # tylko pokaż, co poszłoby na bazę
npm run db sql supabase/seed/00_admin.sql
npm run db query "select count(*) from profiles"
```

Skrypt trzyma rejestr wgranych migracji w tabeli `public._migrations` (wersja, nazwa, suma
kontrolna pliku, data) — z włączonym RLS i odebranymi uprawnieniami dla `anon`/`authenticated`,
więc nie wychodzi przez PostgREST. `status` oznacza migrację jako `zmieniony`, jeśli plik
różni się od tego, co faktycznie poszło na bazę.

Na **istniejącej** bazie, gdzie migracje `0001`–`0009` wklejano ręcznie, uruchom najpierw
`npm run db baseline` — zapisze je w rejestrze **bez wykonywania SQL**. Bez tego `up`
spróbowałoby wgrać je od nowa. Na czystej bazie pomiń `baseline` i od razu zrób `up`.

Plik migracji, który nie może działać w transakcji (np. `CREATE INDEX CONCURRENTLY`), oznacz
komentarzem `-- no-transaction` w pierwszych liniach — skrypt puści go wtedy bez własnego
`BEGIN`/`COMMIT`.

> `SUPABASE_DB_URL` zawiera hasło do bazy i omija RLS. Trzyma się je wyłącznie w `.env.local`
> (jest w `.gitignore`) — nie dodawaj go do zmiennych środowiskowych na Vercelu, aplikacja
> go nie używa.

Cała logika Row Level Security (kto co widzi/edytuje) jest już zdefiniowana w migracji:
własne postępy widzi tylko właściciel, treści współdzielone (słówka, gramatyka, prace domowe)
są czytelne dla każdego zalogowanego użytkownika, a zapis do nich wymaga roli `admin`.

## Zmienne środowiskowe

Patrz `.env.example`. Wymagane:

| Zmienna | Opis |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL projektu Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publiczny klucz anon Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | klucz service_role — **tylko po stronie serwera**, używany m.in. do logowania po nazwie użytkownika |
| `GROQ_API_KEY` | klucz API Groq — funkcje AI (czytanie, pisanie, piosenki, gramatyka-przekształcenia) nie zadziałają bez niego, darmowy tier na [console.groq.com](https://console.groq.com/keys) |
| `NEXT_PUBLIC_SITE_URL` | publiczny URL wdrożenia (linki w e-mailach autoryzacyjnych) |

Opcjonalnie: `GROQ_MODEL` (domyślnie `llama-3.3-70b-versatile`), `FMP_API_KEY` — klucz
Financial Modeling Prep (darmowy tier: 250 zapytań/dzień) używany przez Paragony do cen
ETF-ów zagranicznych; bez niego działają nadal ETF-y notowane na GPW (Stooq, bez klucza) —
patrz `lib/paragony/etf-prices.ts`.

## Konto administratora

Seed (`supabase/seed/00_admin.sql`) tworzy konto administratora bezpośrednio w schemacie
`auth` Supabase:

- **login:** `admin`
- **hasło:** `admin213`

Logowanie w aplikacji akceptuje login **lub** e-mail — dla konta admina wystarczy wpisać `admin`.

> ⚠️ **To hasło jest publiczne (jest w tym repozytorium).** Przed jakimkolwiek wdrożeniem
> produkcyjnym/publicznym zmień je w **Supabase Dashboard → Authentication → Users → admin →
> Reset password**, albo usuń to konto i utwórz własne z rolą `admin` w tabeli `profiles`.

## Struktura projektu

```
app/
  (main)/            # ekrany za logowaniem — wspólny layout z dolną nawigacją
    page.tsx          # PHOENIX: launcher (kafelki zainstalowanych aplikacji)
    aplikacje/         # PHOENIX: menedżer aplikacji (dodaj/usuń z ekranu głównego)
    profil/            # PHOENIX: profil, poziom, język, motyw, wylogowanie
    jezyki/            # LINGUO — mini-aplikacja językowa
      page.tsx          # dashboard („Dziś"): streak, etap ścieżki, prace domowe
      nauka/             # hub + wszystkie moduły nauki (fiszki, gramatyka, ...)
      prace-domowe/      # widok prac domowych użytkownika
      kalendarz/         # kalendarz, streaki, statystyki
      admin/             # panel administratora (prace domowe, ścieżki uczniów)
    kuznia/            # KUŹNIA — kreator promptów
    matma/             # MATMA — matura rozszerzona z matematyki
      page.tsx          # dashboard: szacowany wynik, mastery per dział, trend, plan
      nauka/             # hub działów, lekcje interaktywne, ćwiczenia
      diagnoza/          # test diagnostyczny startowy (opcjonalny, per dział)
      dowody/            # trener dowodów (przekrojowy, is_proof=true)
      egzamin/           # symulacja egzaminu (180 min / 50 pkt)
      plan/              # harmonogram nauki do daty matury
      kalendarz/         # kalendarz aktywności (reużywa components/calendar)
      admin/             # panel nauczyciela + import zadań maturalnych CKE
    matura/            # MATURA ANGIELSKI — matura z języka angielskiego (CKE)
      page.tsx          # dashboard: wybór poziomu (pierwsza wizyta) / szacowany wynik
      nauka/             # hub 4 części egzaminu — wszystkie zbudowane
        [sectionSlug]/     # generyczna trasa dla 3 działów ocenianych dokładnym
                          # dopasowaniem: środki-jezykowe, czytanie, słuchanie (osadza
                          # prawdziwe nagranie YouTube gdy content.youtubeVideoId jest ustawiony)
        pisanie/          # osobna trasa: lekcja + bank zadań pisemnych + kompozycja
                          # oceniana przez AI (inny model danych — patrz opis wyżej)
      ustawienia/        # zmiana poziomu matury (podstawowa/rozszerzona)
      admin/import/      # panel admina: import arkusza PDF (+ opcjonalny klucz odpowiedzi)
  login/ register/ onboarding/   # ekrany publiczne / pierwsze logowanie
components/
  ui/                # podstawowe komponenty (Button, Card, Input, Badge, ...)
  layout/            # dolna nawigacja (per-aplikacja), nagłówek strony
  phoenix/           # komponenty powłoki (ikony aplikacji, menedżer)
  matma/             # komponenty Matmy: lesson/ (bloki lekcji), problem/ (rysik,
                     # ocena AI), exam/, diagnostic/, plan/, dashboard/, admin/
  matura/            # komponenty Matury Angielski: poziom, dashboard, lista części,
                     # próba zadania (reużywa components/grammar/lesson dla treści)
  <moduł>/           # komponenty specyficzne dla danego modułu Linguo
lib/
  phoenix/           # rejestr aplikacji + akcje powłoki
  supabase/          # klienci Supabase (przeglądarka / serwer / service role)
  actions/, <moduł>/ # Server Actions per moduł
  ai.ts              # klient Groq + pomocnik do ustrukturyzowanych odpowiedzi JSON
  homework/progress.ts # automatyczne liczenie postępu prac domowych
  matma/             # silnik Matmy: mastery per dział, ocena AI, egzamin,
                     # diagnoza, plan nauki, dashboard, akcje, import CKE
  matura/            # silnik Matury Angielski: sekcje, ocena programistyczna
                     # środków językowych (bez AI), ocena AI wypowiedzi pisemnej wg
                     # kryteriów CKE, mastery per część, szacowany wynik, akcje
  types/database.ts  # typy TypeScript odzwierciedlające schemat bazy
supabase/
  migrations/        # schemat SQL (0007 = Matma, 0008 = Paragony, 0009 = Schola,
                     # 0013 = Matura, 0016 = wymiar języka w Maturze)
  seed/               # dane początkowe (admin, słówka, gramatyka, matma/, matura/,
                     # matura-es/)
scripts/
  db.mjs             # runner migracji i skryptów SQL (`npm run db`)
proxy.ts             # odświeżanie sesji Supabase + ochrona tras (Next.js 16 "proxy")
```

## Deploy na Vercel

1. Wypchnij repozytorium na GitHub/GitLab/Bitbucket.
2. Na [vercel.com](https://vercel.com) wybierz **Add New → Project** i zaimportuj repozytorium
   (Next.js zostanie wykryty automatycznie, nie trzeba zmieniać ustawień builda).
3. W **Settings → Environment Variables** dodaj wszystkie zmienne z sekcji
   [Zmienne środowiskowe](#zmienne-środowiskowe) (dla `NEXT_PUBLIC_SITE_URL` wpisz docelowy
   adres `https://twoja-domena.vercel.app`).
4. Wykonaj kroki z sekcji [Konfiguracja Supabase](#konfiguracja-supabase), jeśli jeszcze
   tego nie zrobiono (migracja + seed muszą być uruchomione na tej samej instancji Supabase,
   na którą wskazują zmienne środowiskowe).
5. W Supabase, w **Authentication → URL Configuration**, ustaw **Site URL** oraz
   **Redirect URLs** na adres wdrożenia z Vercela, żeby linki autoryzacyjne działały poprawnie.
6. Kliknij **Deploy**. Kolejne pushe do gałęzi produkcyjnej wdrażają się automatycznie.

