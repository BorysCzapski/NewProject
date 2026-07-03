# EnglishApp — aplikacja do nauki angielskiego

Mobilna (mobile-first) aplikacja webowa do nauki angielskiego po polsku: fiszki i trener
słówek, gramatyka, czytanie i pisanie oceniane przez AI, tłumaczenie piosenek, słuchanie
z lukami (YouTube), prace domowe z panelem admina, kalendarz i streaki.

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

1. **Autentykacja i profil** — rejestracja/logowanie e-mail+hasło, wybór poziomu (A1-B2) zaraz
   po rejestracji, zmiana poziomu w profilu, tryb jasny/ciemny.
2. **Słówka** — fiszki z animacją obrotu i prostym algorytmem powtórek + trener znaczeń
   (quiz 4-odpowiedziowy EN↔PL i tryb wpisywania z tolerancją literówek).
3. **Gramatyka** — tematy per poziom z wyjaśnieniami po polsku, ćwiczenia (luki, wybór,
   przekształcenia zdań ocieniane przez AI).
4. **Czytanie** — AI generuje krótkie artykuły dopasowane do poziomu i tematu, zadaje pytania
   (ABCD + otwarte), ocenia odpowiedzi otwarte.
5. **Pisanie** — krótkie formy (bez esejów) z poleceniem od AI, ocena poprawności/słownictwa,
   poprawiona wersja tekstu, mini-dialog pogłębiający.
6. **Piosenki** — wklejasz tekst piosenki, tłumaczysz linijka po linijce lub słowo po słowie,
   AI akceptuje sensowne warianty tłumaczenia.
7. **Słuchanie** — wklejasz link do YouTube, aplikacja pobiera transkrypcję i tworzy ćwiczenie
   z lukami; kliknięcie luki przewija film do właściwego momentu.
8. **Prace domowe** — admin tworzy zadania (8 typów) widoczne dla wszystkich użytkowników;
   postęp liczy się automatycznie z aktywności w modułach.
9. **Kalendarz i streaki** — kalendarz miesięczny z oznaczonymi dniami aktywności, aktualny
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
   1. `supabase/migrations/0001_init.sql` — schemat bazy (tabele, enumy, RLS, funkcje).
   2. `supabase/seed/00_admin.sql` — konto administratora (patrz [niżej](#konto-administratora)).
   3. `supabase/seed/01_vocabulary_a1.sql`, `01_vocabulary_a2.sql`, `01_vocabulary_b1.sql`,
      `01_vocabulary_b2.sql` — słownictwo (~700 słówek, po ~150-200 na poziom).
   4. `supabase/seed/02_grammar_a1.sql`, `02_grammar_a2.sql`, `02_grammar_b1.sql`,
      `02_grammar_b2.sql` — tematy i ćwiczenia gramatyczne (5 tematów × ~30 ćwiczeń na poziom).

   Każdy plik seeda usuwa najpierw dane dla swojego poziomu (`delete from ... where level = '...'`),
   więc można je bezpiecznie uruchomić ponownie.
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
    page.tsx          # dashboard
    nauka/             # hub + wszystkie moduły nauki (fiszki, słówka, gramatyka, ...)
    prace-domowe/      # widok prac domowych użytkownika
    kalendarz/         # kalendarz, streaki, statystyki
    profil/            # profil, poziom, motyw, wylogowanie
    admin/             # panel administratora (prace domowe)
  login/ register/ onboarding/   # ekrany publiczne / pierwsze logowanie
components/
  ui/                # podstawowe komponenty (Button, Card, Input, Badge, ...)
  layout/            # dolna nawigacja, nagłówek strony
  <moduł>/           # komponenty specyficzne dla danego modułu nauki
lib/
  supabase/          # klienci Supabase (przeglądarka / serwer / service role)
  actions/, <moduł>/ # Server Actions per moduł
  ai.ts              # klient Groq + pomocnik do ustrukturyzowanych odpowiedzi JSON
  homework/progress.ts # automatyczne liczenie postępu prac domowych
  types/database.ts  # typy TypeScript odzwierciedlające schemat bazy
supabase/
  migrations/        # schemat SQL
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

