// ============================================================================
// lib/gitara/topics.ts
// The Gitara curriculum: 6 działy, ordered as a real prerequisite chain, not
// a taxonomy — this file is the reference supabase/seed/gitara/01_topics.sql
// is authored from, same relationship as lib/algorytmy/topics.ts to its seed.
//
// Postawa i strojenie first because nothing else is practisable before the
// instrument is in tune and held correctly. Pierwsze akordy next — chords are
// what makes a beginner want to keep going, so they come before the more
// abstract nuty-i-rytm dział rather than after it. System CAGED depends on
// both: it is literally the 5 open-chord shapes (pierwsze akordy) relocated
// using notes on the neck (nuty-i-rytm), so it cannot come earlier. Techniki
// gry last — hammer-ons, bends and palm muting are refinements applied ON TOP
// of chords and rhythm the student can already play.
// ============================================================================

export interface GtrTopicSeed {
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
}

export const GTR_TOPICS: GtrTopicSeed[] = [
  {
    slug: "postawa-i-strojenie",
    title: "Postawa i strojenie",
    description:
      "Jak trzymać gitarę, budowa instrumentu, strojenie standardowe (E-A-D-G-B-e) i jak czytać diagramy akordów oraz tabulaturę.",
    orderIndex: 1,
  },
  {
    slug: "pierwsze-akordy",
    title: "Pierwsze akordy",
    description:
      "Pięć akordów, od których zaczyna prawie każdy: Em, Am, C, G, D. Chwyty, zmiana akordów i pierwsza progresja.",
    orderIndex: 2,
  },
  {
    slug: "nuty-i-rytm",
    title: "Nuty i rytm",
    description:
      "Wartości rytmiczne i takt, czytanie tabulatury oraz nuty na gryfie — gdzie leży każdy dźwięk na każdej strunie.",
    orderIndex: 3,
  },
  {
    slug: "system-caged",
    title: "System CAGED",
    description:
      "Pięć kształtów C-A-G-E-D tego samego akordu przesuwanych wzdłuż gryfu — mapa całego gryfu zbudowana z akordów, które już znasz.",
    orderIndex: 4,
  },
  {
    slug: "techniki-gry",
    title: "Techniki gry",
    description:
      "Palm muting, legato (hammer-on, pull-off), bend, tapping i sweep picking — jak wydobyć z gitary więcej niż samo brzdąkanie.",
    orderIndex: 5,
  },
  {
    slug: "teoria-muzyki",
    title: "Teoria muzyki",
    description:
      "Zapis nutowy, rytm, gamy, interwały i akordy — teoria, która tłumaczy, dlaczego to, co grasz na gitarze, brzmi tak, a nie inaczej. Adaptacja polska podręcznika Catherine Schmidt-Jones z dopiskami dla gitarzysty.",
    orderIndex: 6,
  },
];

export function getTopicSeed(slug: string): GtrTopicSeed | undefined {
  return GTR_TOPICS.find((t) => t.slug === slug);
}
