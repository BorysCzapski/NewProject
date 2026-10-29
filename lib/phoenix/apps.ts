// ============================================================================
// lib/phoenix/apps.ts
// Phoenix app registry: the single source of truth for every mini-app the
// platform hosts. Adding a new app = one APPS entry + its routes under
// app/(main)/<id>/. The launcher, the /aplikacje manager and the bottom nav
// all render from here. Icon names map to lucide-react icons client-side.
// ============================================================================

export type PhoenixSectionId = "nauka" | "narzedzia" | "wiara" | "zdrowie";

export interface PhoenixSection {
  id: PhoenixSectionId;
  label: string;
  /** lucide icon name (see components/phoenix/app-icon.tsx). */
  icon: string;
}

export interface PhoenixApp {
  /** Route namespace: the app lives under /<id>/... */
  id: string;
  name: string;
  description: string;
  section: PhoenixSectionId;
  /** lucide icon name (see components/phoenix/app-icon.tsx). */
  icon: string;
  href: string;
  /** Apps not yet built show as "wkrótce" tiles and can't be installed. */
  comingSoon?: boolean;
}

export const PHOENIX_SECTIONS: PhoenixSection[] = [
  { id: "nauka", label: "Nauka", icon: "GraduationCap" },
  { id: "narzedzia", label: "Narzędzia", icon: "Wrench" },
  { id: "wiara", label: "Wiara", icon: "Church" },
  { id: "zdrowie", label: "Zdrowie", icon: "Dumbbell" },
];

export const PHOENIX_APPS: PhoenixApp[] = [
  {
    id: "jezyki",
    name: "Linguo",
    description: "Nauka języków: angielski, hiszpański, rosyjski",
    section: "nauka",
    icon: "Languages",
    href: "/jezyki",
  },
  {
    id: "matura",
    name: "Matura z języka",
    description: "Przygotowanie do matury z angielskiego i hiszpańskiego (CKE)",
    section: "nauka",
    icon: "ScrollText",
    href: "/matura",
  },
  {
    id: "geografia",
    name: "Geografia",
    description: "Matura rozszerzona z geografii: 23 działy CKE, mapy, powtórki",
    section: "nauka",
    icon: "Compass",
    href: "/geografia",
  },
  {
    id: "algorytmy",
    name: "Algorytmy",
    description: "Struktury danych i algorytmy: teoria, animacje, zadania",
    section: "nauka",
    icon: "Binary",
    href: "/algorytmy",
  },
  {
    id: "maturalnik",
    name: "Maturalnik",
    description: "612 zadań maturalnych z matematyki: odhaczaj, rysuj, sprawdzaj rozwiązania",
    section: "nauka",
    icon: "NotebookPen",
    href: "/maturalnik",
  },
  {
    id: "informatyka",
    name: "Informatyka",
    description: "Matura rozszerzona z informatyki 2022–2026: kod, SQL, arkusz i canvas",
    section: "nauka",
    icon: "Terminal",
    href: "/informatyka",
  },
  {
    id: "zusia",
    name: "ZUSia",
    description: "Olimpiada o ubezpieczeniach społecznych: teoria, trening, testy, fiszki, krzyżówki, mapy myśli i zadania AI",
    section: "nauka",
    icon: "Landmark",
    href: "/zusia",
  },
  {
    id: "biznes",
    name: "Matura BiZ",
    description: "Matura rozszerzona z biznesu i zarządzania: teoria, arkusze, fiszki, trening, krzyżówki, mapy myśli i zadania AI",
    section: "nauka",
    icon: "Briefcase",
    href: "/biznes",
  },
  {
    id: "tracker",
    name: "Tracker",
    description: "Godziny pracy i zadania dzień po dniu, wykres postępu i wskazówki lock in",
    section: "nauka",
    icon: "LineChart",
    href: "/tracker",
  },
  {
    id: "gitara",
    name: "Gitara",
    description: "Nauka gry na gitarze: akordy, CAGED, rytm, techniki, piosenki",
    section: "nauka",
    icon: "Guitar",
    href: "/gitara",
  },
  {
    id: "kuznia",
    name: "Kuźnia",
    description: "Kreator promptów do budowy kolejnych aplikacji",
    section: "narzedzia",
    icon: "Hammer",
    href: "/kuznia",
  },
  {
    id: "butelki",
    name: "Kaucje",
    description: "Licznik butelek kaucyjnych",
    section: "narzedzia",
    icon: "Recycle",
    href: "/butelki",
  },
  {
    id: "modlitwa",
    name: "Modlitwa",
    description: "Werset dnia, czytania, liturgia godzin i intencje",
    section: "wiara",
    icon: "Sparkles",
    href: "/modlitwa",
  },
  {
    id: "silownia",
    name: "Siłownia",
    description: "Trening, nawodnienie, kalorie (AI) i suplementacja",
    section: "zdrowie",
    icon: "Dumbbell",
    href: "/silownia",
  },
];

export function getApp(id: string): PhoenixApp | undefined {
  return PHOENIX_APPS.find((a) => a.id === id);
}

/** Installable = built. Used to sanitize profiles.installed_apps values. */
export function installableAppIds(): string[] {
  return PHOENIX_APPS.filter((a) => !a.comingSoon).map((a) => a.id);
}
