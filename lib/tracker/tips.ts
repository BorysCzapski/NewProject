// ============================================================================
// lib/tracker/tips.ts
// Treść zakładki "Lock in": wskazówki dobrej nauki i protokół skupienia.
// Statyczne, po polsku, bez bazy — to materiał do przeczytania, nie dane
// użytkownika. Wskazówki opierają się na tym, co o uczeniu się faktycznie
// działa (aktywne przypominanie, rozłożone powtórki, praca w blokach, sen),
// a nie na samej motywacji.
// ============================================================================

export interface TipGroup {
  title: string;
  intro?: string;
  items: Array<{ title: string; text: string }>;
}

/** Protokół trybu lock in — kroki do odhaczenia w głowie, w kolejności. */
export const LOCK_IN_PROTOCOL: TipGroup[] = [
  {
    title: "Zanim zaczniesz (2 minuty)",
    items: [
      {
        title: "Jeden cel na blok",
        text: "Zapisz jedno zdanie: co dokładnie będzie zrobione, gdy skończysz. „Zrobię zadania 1–8 z rozdziału 3”, a nie „pouczę się matmy”.",
      },
      {
        title: "Telefon poza zasięgiem wzroku",
        text: "W innym pokoju albo w plecaku, nie na biurku ekranem w dół. Samo widzenie telefonu obniża skupienie, nawet jeśli go nie dotykasz.",
      },
      {
        title: "Wyłącz powiadomienia i zbędne karty",
        text: "Zamknij wszystko, co nie jest potrzebne do tego jednego zadania. Włącz tryb „nie przeszkadzać” na komputerze.",
      },
      {
        title: "Ustaw timer",
        text: "50 minut pracy, 10 przerwy (albo 25/5, jeśli dopiero zaczynasz). Timer zdejmuje z głowy pytanie „czy już wystarczy”.",
      },
      {
        title: "Woda i wszystko pod ręką",
        text: "Zeszyty, notatki, ładowarka, picie. Każde wstanie „na chwilę” kosztuje więcej niż minutę.",
      },
    ],
  },
  {
    title: "W trakcie bloku",
    items: [
      {
        title: "Jedna rzecz naraz",
        text: "Wielozadaniowość to szybkie przełączanie się, a każde przełączenie kosztuje czas i błędy. Skończ albo świadomie przerwij.",
      },
      {
        title: "Kartka na rozpraszacze",
        text: "Gdy wpadnie Ci „muszę coś sprawdzić”, zapisz to na kartce i wróć do pracy. Sprawdzisz w przerwie — prawie nigdy nie jest już potrzebne.",
      },
      {
        title: "Zaczynaj od najtrudniejszego",
        text: "Najcięższe zadanie rób, gdy masz najwięcej energii — zwykle w pierwszej godzinie. Łatwe rzeczy zostaw na końcu, gdy głowa siada.",
      },
      {
        title: "Gdy się zaciąłeś, nie wpatruj się",
        text: "Po 5 minutach bez ruchu przejdź do innego zadania albo zapisz, co dokładnie jest niejasne. Konkretne pytanie to pół rozwiązania.",
      },
      {
        title: "Przerwa bez ekranu",
        text: "Wstań, napij się, popatrz przez okno, przejdź się. Scrollowanie w przerwie nie odpoczywa głowy, tylko ją zapełnia.",
      },
    ],
  },
  {
    title: "Po bloku (2 minuty)",
    items: [
      {
        title: "Zapisz dzień w Trackerze",
        text: "Godziny i liczba zadań, póki masz je w głowie. Dopisz jedną linijkę: co poszło dobrze, co przeszkadzało.",
      },
      {
        title: "Wybierz pierwsze zadanie na jutro",
        text: "Zapisz je dziś. Jutro nie tracisz pierwszych 20 minut na decydowanie, od czego zacząć — po prostu siadasz i robisz.",
      },
    ],
  },
];

export const STUDY_TIPS: TipGroup[] = [
  {
    title: "Jak się uczyć, żeby zostało w głowie",
    intro: "Czytanie i podkreślanie dają poczucie, że umiesz. Wynik dają metody, które wymagają wysiłku.",
    items: [
      {
        title: "Aktywne przypominanie zamiast czytania",
        text: "Zamknij notatki i spróbuj odtworzyć z pamięci: napisz, wytłumacz na głos, rozwiąż zadanie bez zaglądania. Dopiero potem sprawdź. Trudność jest tu sygnałem, że uczysz się naprawdę.",
      },
      {
        title: "Powtórki rozłożone w czasie",
        text: "Ten sam materiał po 1 dniu, 3, tygodniu i miesiącu zostaje lepiej niż 5 godzin w jeden wieczór. Fiszki z pudełkami (jak w Linguo i Maturze) robią to za Ciebie.",
      },
      {
        title: "Mieszaj rodzaje zadań",
        text: "Zamiast 20 takich samych zadań z rzędu, przeplataj typy. Jest trudniej i wolniej, ale na egzaminie nie wiesz z góry, jakiego typu będzie zadanie.",
      },
      {
        title: "Tłumacz to komuś innemu",
        text: "Jeśli nie potrafisz wytłumaczyć tematu prostymi słowami, zobaczysz dokładnie, gdzie jest dziura. Możesz tłumaczyć na głos pustemu pokojowi.",
      },
      {
        title: "Ucz się na błędach",
        text: "Zapisuj zadania, które Ci nie wyszły, razem z tym, dlaczego. Wracaj do tej listy zamiast do tego, co już umiesz.",
      },
    ],
  },
  {
    title: "Planowanie i rytm",
    items: [
      {
        title: "Trzy najważniejsze rzeczy na dzień",
        text: "Wieczorem wybierz maksymalnie trzy zadania, które zrobią największą różnicę. Lista na 15 punktów demotywuje i tak jej nie skończysz.",
      },
      {
        title: "Mierz zadania, nie tylko godziny",
        text: "Godziny pokazują czas przy biurku, zadania pokazują efekt. Wskaźnik „tempo” w Trackerze (zadania na godzinę) wychwytuje dni, w których siedziałeś długo, a zrobiłeś mało.",
      },
      {
        title: "Stała pora i miejsce",
        text: "Gdy uczysz się o tej samej porze w tym samym miejscu, głowa szybciej wchodzi w tryb pracy. Nawyk wygrywa z silną wolą.",
      },
      {
        title: "Zacznij od 10 minut",
        text: "Gdy nie chce Ci się zaczynać, umów się ze sobą na 10 minut. Najtrudniejszy jest start; zwykle zostajesz dłużej.",
      },
      {
        title: "Dzień wolny też jest planem",
        text: "Zapisuj również dni zerowe. Wykres z dziurami po cichu kłamie; uczciwy pokazuje, że po słabym dniu przychodzi lepszy.",
      },
    ],
  },
  {
    title: "Ciało, które pracuje na wynik",
    items: [
      {
        title: "Sen to część nauki",
        text: "To w nocy mózg utrwala to, czego się nauczyłeś. Zarwana noc przed egzaminem zwykle kosztuje więcej, niż daje dodatkowa godzina nauki.",
      },
      {
        title: "Ruch",
        text: "20–30 minut spaceru albo treningu poprawia skupienie na kolejne godziny. Przerwa na ruch to inwestycja, nie strata czasu.",
      },
      {
        title: "Jedzenie i woda",
        text: "Ciężki obiad usypia, głód rozprasza. Pij wodę w trakcie bloku, a przy biurku trzymaj coś lekkiego.",
      },
      {
        title: "Nie ucz się z telefonem w ręce",
        text: "Największy złodziej czasu nauki to „na chwilkę” w telefonie. Odłóż go przed startem bloku, nie w jego połowie.",
      },
    ],
  },
];
