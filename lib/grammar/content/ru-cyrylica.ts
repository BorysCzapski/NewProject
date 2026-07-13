// ============================================================================
// lib/grammar/content/ru-cyrylica.ts
// Standalone introduction to the Cyrillic alphabet for Polish learners of
// Russian — the very first lesson, shown BEFORE any flashcards (without
// Cyrillic the A1 flashcards are unreadable). Covers all 33 letters in
// didactic groups, from "free" letters to false friends to new shapes.
// Convention: the `en` field holds the TARGET language (Russian, Cyrillic),
// the `pl` field holds the Polish translation / simplified pronunciation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const RU_CYRYLICA_INTRO: GrammarLesson = [
  {
    type: "intro",
    text:
      "Zanim otworzysz pierwszą fiszkę, poznaj cyrylicę (кириллица) — bez niej rosyjskie słowa to tylko szlaczki. Dobra wiadomość: to nie chiński. Alfabet ma dokładnie 33 litery, z czego kilka znasz „za darmo”, kilka to podstępne pułapki, a resztę opanujesz w jakieś pół godziny. Po tej lekcji przeczytasz każde słowo na fiszkach — na początku powoli, ale samodzielnie. Czytaj wszystkie przykłady NA GŁOS.",
  },
  {
    type: "table",
    title: "Grupa 1: litery „za darmo” — wyglądają i brzmią jak polskie",
    headers: ["Litera", "Czytamy jak", "Przykład"],
    rows: [
      ["А а", "a", "мама [mama] — mama"],
      ["К к", "k", "кот [kot] — kot"],
      ["М м", "m", "март [mart] — marzec"],
      ["О о", "o (pod akcentem)", "он [on] — on"],
      ["Т т", "t", "там [tam] — tam"],
    ],
    caption:
      "Pięć liter bez żadnej nauki — i już składasz z nich pierwsze rosyjskie słowa.",
  },
  {
    type: "examples",
    title: "Przeczytaj — to umiesz już teraz",
    items: [
      { en: "мама", pl: "mama [mama]" },
      { en: "кот", pl: "kot [kot]" },
      { en: "там", pl: "tam [tam]" },
      { en: "Кто там?", pl: "Kto tam? [kto tam]", highlight: "Кто" },
    ],
  },
  {
    type: "quiz",
    question: "Jak przeczytasz rosyjskie słowo «кот»?",
    options: ["[kot]", "[sot]", "[kit]"],
    correctIndex: 0,
    explanation:
      "к = k, о = o, т = t — wszystkie trzy litery czytamy jak po polsku: [kot], czyli kot. Prawda, że bezboleśnie?",
  },
  {
    type: "table",
    title: "Grupa 2: fałszywi przyjaciele — wyglądają znajomo, brzmią inaczej",
    headers: ["Litera", "Czytamy jak", "Przykład"],
    rows: [
      ["В в", "w (nigdy „b”!)", "вода [wada] — woda"],
      ["Е е", "je (zmiękcza poprzednią spółgłoskę)", "нет [niet] — nie"],
      ["Н н", "n (nigdy „h”!)", "нос [nos] — nos"],
      ["Р р", "r (nigdy „p”!)", "рука [ruka] — ręka"],
      ["С с", "s (nigdy „c”!)", "сок [sok] — sok"],
      ["У у", "u (nigdy „y”!)", "утро [utra] — poranek"],
      ["Х х", "ch (nigdy „iks”!)", "хлеб [chlep] — chleb"],
    ],
    caption:
      "Siedem liter odpowiadających za większość pomyłek na starcie. Czytaj tę tabelę na głos, aż przestaniesz się wahać.",
  },
  {
    type: "tip",
    variant: "warning",
    text:
      "Najczęstsze błędy Polaków: В to „w”, nie „b” (вода = woda, nie „boda”!), Р to „r”, nie „p” (рука = ręka), С to „s”, nie „c” (сок = sok), Н to „n”, nie „h”, a У to „u”, nie „y”. Gdy widzisz znajomy kształt, zatrzymaj się na ułamek sekundy — w cyrylicy znajoma litera to często zupełnie inny dźwięk.",
  },
  {
    type: "examples",
    title: "Przeczytaj — grupy 1 i 2 razem",
    items: [
      { en: "нос", pl: "nos [nos]" },
      { en: "сумка", pl: "torba [sumka]" },
      { en: "рука", pl: "ręka [ruka]" },
      { en: "мост", pl: "most [most]" },
      { en: "Ура!", pl: "Hurra! [ura]" },
    ],
  },
  {
    type: "quiz",
    question: "Jak przeczytasz słowo «вера»?",
    options: ["[wiera]", "[bepa]", "[bera]"],
    correctIndex: 0,
    explanation:
      "в = w, е = je (zmiękcza poprzedzającą spółgłoskę), р = r, а = a → [wiera], czyli wiara. Kto przeczytał [bepa], ten czytał po łacińsku, nie po rosyjsku!",
  },
  {
    type: "table",
    title: "Grupa 3a: nowe kształty, znajome polskie dźwięki",
    headers: ["Litera", "Czytamy jak", "Przykład"],
    rows: [
      ["Б б", "b", "банк [bank] — bank"],
      ["Г г", "g", "год [got] — rok"],
      ["Д д", "d", "да [da] — tak"],
      ["З з", "z", "зима [zima] — zima"],
      ["И и", "i", "имя [imia] — imię"],
      ["Й й", "j", "мой [moj] — mój"],
      ["Л л", "ł (twarde) / l (miękkie)", "лампа [łampa] — lampa"],
      ["П п", "p", "папа [papa] — tata"],
      ["Ф ф", "f", "фото [fota] — zdjęcie"],
      ["Э э", "e", "это [eta] — to"],
    ],
    caption:
      "Kształty nowe, ale każdy dźwięk masz w polskim. Uwaga: б (b) i в (w) to dwie różne litery!",
  },
  {
    type: "table",
    title: "Grupa 3b: syczące, jotowane i ы",
    headers: ["Litera", "Czytamy jak", "Przykład"],
    rows: [
      ["Ж ж", "ż", "журнал [żurnał] — czasopismo"],
      ["Ш ш", "sz", "школа [szkoła] — szkoła"],
      ["Щ щ", "szcz (miękkie)", "борщ [borszcz] — barszcz"],
      ["Ц ц", "c", "цирк [cyrk] — cyrk"],
      ["Ч ч", "cz (miękkie)", "чай [czaj] — herbata"],
      ["Ю ю", "ju", "юг [juk] — południe"],
      ["Я я", "ja", "яблоко [jabłaka] — jabłko"],
      ["Ё ё", "jo — ZAWSZE pod akcentem", "ёлка [jołka] — choinka"],
      ["Ы ы", "y (jak w „syn”)", "сын [syn] — syn"],
    ],
    caption:
      "Ю, я, ё działają jak polskie ju/ja/jo, a po spółgłosce dodatkowo ją zmiękczają. Nie myl ш (sz) ze щ (szcz).",
  },
  {
    type: "examples",
    title: "Przeczytaj — prawie cały alfabet w akcji",
    items: [
      { en: "да", pl: "tak [da]" },
      { en: "спасибо", pl: "dziękuję [spasiba]" },
      { en: "школа", pl: "szkoła [szkoła]" },
      { en: "чай", pl: "herbata [czaj]" },
      { en: "я", pl: "ja [ja]" },
    ],
  },
  {
    type: "quiz",
    question: "Która para liter oddaje polskie „sz” i „ż”?",
    options: ["ш i ж", "щ i з", "ч i ц"],
    correctIndex: 0,
    explanation:
      "ш = sz (школа = szkoła), ж = ż (журнал = żurnal). Щ to miękkie „szcz”, з to zwykłe „z”, ч — miękkie „cz”, a ц — „c”.",
  },
  {
    type: "table",
    title: "Znaki specjalne: ъ i ь — litery bez własnego dźwięku",
    headers: ["Znak", "Co robi", "Przykład"],
    rows: [
      [
        "Ъ ъ (twardy znak)",
        "nie ma dźwięku; oddziela spółgłoskę od е, ё, ю, я, żeby wyraźnie wybrzmiało [j]",
        "подъезд [padjezd] — klatka schodowa",
      ],
      [
        "Ь ь (miękki znak)",
        "nie ma dźwięku; zmiękcza poprzednią spółgłoskę",
        "день [dień] — dzień",
      ],
    ],
    caption:
      "Żaden z nich nigdy nie stoi na początku słowa. Ъ jest rzadki, za to ь spotkasz bardzo często: мать (matka), говорить (mówić).",
  },
  {
    type: "tip",
    variant: "tip",
    text:
      "Rosyjski akcent (ударение) jest silny i ruchomy, a nieakcentowane „о” brzmi jak „a” — to tzw. akanie. Dlatego молоко czytamy [małako], хорошо — [charaszo], a Москва — [Maskwa]. Nie czytaj każdego „о” jak po polsku! Jedyny pewniak: litera ё zawsze niesie akcent, więc z nią nie ma zgadywania.",
  },
  {
    type: "examples",
    title: "Przeczytaj sam — te słowa spotkasz na pierwszych fiszkach",
    items: [
      { en: "дом", pl: "dom [dom]" },
      { en: "вода", pl: "woda [wada]" },
      { en: "хлеб", pl: "chleb [chlep]" },
      { en: "кошка", pl: "kot, kotka [koszka]" },
      { en: "молоко", pl: "mleko [małako]" },
    ],
  },
  {
    type: "quiz",
    question: "Na fiszce widzisz «вода». Jak to przeczytasz i co to znaczy?",
    options: ["[wada] — woda", "[boda] — jezioro", "[wyda] — wydra"],
    correctIndex: 0,
    explanation:
      "в = w, о bez akcentu = a (akanie), д = d, а = a → [wada], czyli woda. Gratulacje — właśnie przeczytałeś cyrylicę bez podpowiedzi. Fiszki czekają!",
  },
];
