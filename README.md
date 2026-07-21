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
2. W **SQL Editor** uruchom po kolei zawartość plików z katalogu `supabase/`:

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

   **Seed — konto admina:**
   7. `supabase/seed/00_admin.sql` — konto administratora (patrz [niżej](#konto-administratora)).

   **Seed — angielski (język domyślny):**
   8. `01_vocabulary_a1.sql` … `01_vocabulary_b2.sql` — słownictwo EN (~1000 słówek).
   9. `02_grammar_a1.sql` … `02_grammar_b2.sql` — gramatyka EN (5 tematów × ~30 ćwiczeń/poziom).
   10. `03_learning_path.sql` — ścieżka nauki EN.

   **Seed — hiszpański (opcjonalnie, jeśli chcesz język ES):**
   11. `es_01_vocabulary_a1.sql` … `es_01_vocabulary_b2.sql`, `es_02_grammar_a1.sql` …
      `es_02_grammar_b2.sql`, a na końcu `es_03_learning_path.sql`.

   **Seed — rosyjski (opcjonalnie, jeśli chcesz język RU):**
   12. `ru_01_vocabulary_a1.sql` … `ru_02_grammar_b2.sql`, a na końcu `ru_03_learning_path.sql`.

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

Opcjonalnie: `GROQ_MODEL` (domyślnie `llama-3.3-70b-versatile`).

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
  login/ register/ onboarding/   # ekrany publiczne / pierwsze logowanie
components/
  ui/                # podstawowe komponenty (Button, Card, Input, Badge, ...)
  layout/            # dolna nawigacja (per-aplikacja), nagłówek strony
  phoenix/           # komponenty powłoki (ikony aplikacji, menedżer)
  <moduł>/           # komponenty specyficzne dla danego modułu Linguo
lib/
  phoenix/           # rejestr aplikacji + akcje powłoki
  supabase/          # klienci Supabase (przeglądarka / serwer / service role)
  actions/, <moduł>/ # Server Actions per moduł
  ai.ts              # klient Groq + pomocnik do ustrukturyzowanych odpowiedzi JSON
  homework/progress.ts # automatyczne liczenie postępu prac domowych
  types/database.ts  # typy TypeScript odzwierciedlające schemat bazy
supabase/
  migrations/        # schemat SQL (0005 = kolumna installed_apps Phoenixa)
  seed/               # dane początkowe (admin, słówka, gramatyka)
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

