# Testy e2e — Matura z języka

Testy [Playwright](https://playwright.dev) dla modułu **Matura z języka** (`/matura`). Nie ma
tu mocka backendu — testy klikają po prawdziwej aplikacji uruchomionej lokalnie, gadającej z
prawdziwym projektem Supabase, tak samo jak w `npm run dev`. Dzięki temu sprawdzają dokładnie to,
co zobaczy użytkownik — łącznie z prawdziwym ocenianiem AI (Groq) wypowiedzi pisemnej.

## Wymagania

Wszystko, co opisuje `README.md` w katalogu głównym (sekcje "Uruchomienie lokalne" i "Konfiguracja
Supabase") — `.env.local` z prawdziwymi kluczami Supabase i Groq, migracje i **seed Matury**
(`supabase/seed/matura/*.sql`, `supabase/seed/00_admin.sql`) wgrane na bazę. Bez seeda część testów
po prostu nie znajdzie żadnej lekcji/działu do kliknięcia i się wywali.

Testy same tworzą i kasują jednorazowe konta uczniów przez Supabase Admin API
(`SUPABASE_SERVICE_ROLE_KEY`) — nie trzeba nic zakładać ręcznie. Wyjątkiem jest
`admin-import.spec.ts`, który loguje się na seedowane konto `admin`/`admin213`.

## Uruchomienie

```bash
npx playwright install chromium   # raz, jeśli przeglądarka nie jest jeszcze pobrana
npm run test:e2e                  # odpala `npm run dev` samo, jeśli nie działa już w innym terminalu
npm run test:e2e:ui               # tryb interaktywny (Playwright UI)
```

`playwright.config.ts` uruchamia `npm run dev` za Ciebie (i zostawia już działający serwer w
spokoju — `reuseExistingServer: true`), więc zwykle wystarczy sam `npm run test:e2e`.

Jeśli Chromium jest zainstalowany w niestandardowym miejscu (np. w sandboksie CI), ustaw
`PLAYWRIGHT_CHROMIUM_EXECUTABLE=/ścieżka/do/chrome` — w normalnym przypadku nic nie trzeba ustawiać.

## Co jest pokryte

| Plik | Co sprawdza |
| --- | --- |
| `matura/onboarding.spec.ts` | Pierwszy wybór język+poziom; zwykły użytkownik nie widzi ani nie może wejść na `/matura/admin/import` |
| `matura/settings.spec.ts` | Zmiana język/poziom w ustawieniach NIE kasuje postępu żadnej kombinacji |
| `matura/theory-vocab.spec.ts` | Oznaczanie lekcji teorii jako przerobionej; sesja fiszek do końca |
| `matura/writing.spec.ts` | Ocenianie AI wypowiedzi pisemnej: zasada "gilotyny" (za krótki tekst zeruje kryteria 2-4) i spójność sumy kryteriów z wynikiem łącznym |
| `matura/admin-import.spec.ts` | Konto admina faktycznie widzi formularz importu PDF |
| `matura/task-types.spec.ts` | Uruchomienie typu zadania CKE wydaje realne zadanie (nie "pusto") i ocenia odpowiedź |

## Czego tu NIE ma

- Funkcji wymagających `youtubeVideoId` (rozumienie ze słuchu) — testy nie sprawdzają odtwarzacza
  ani transkrypcji, tylko przepływ ocenianego zadania (patrz `task-types.spec.ts`, sekcja
  środki-językowe).
- Panelu importu PDF *w akcji* (samo wgranie i przetworzenie arkusza przez AI) — `admin-import.spec.ts`
  sprawdza tylko, że admin w ogóle widzi formularz; wgrywanie realnego arkusza CKE jako danych
  testowych nie wydawało się uczciwym testem (to nie jest prawdziwy arkusz, a etykieta źródła w
  bazie i tak zawsze wychodzi `curated` + `needsReview`).
- Trybu "produkcja" trenażera słownictwa (od 3. powtórzenia) — wymaga wielu wcześniejszych
  poprawnych odpowiedzi tego samego hasła, co nie mieści się w jednym, izolowanym teście.
