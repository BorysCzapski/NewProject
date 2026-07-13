// ============================================================================
// lib/phoenix/apps.ts
// Phoenix app registry: the single source of truth for every mini-app the
// platform hosts. Adding a new app = one APPS entry + its routes under
// app/(main)/<id>/. The launcher, the /aplikacje manager and the bottom nav
// all render from here. Icon names map to lucide-react icons client-side.
// ============================================================================

export type PhoenixSectionId = "nauka" | "narzedzia" | "wiara";

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
  // ——— planned apps: visible in /aplikacje as "wkrótce", hidden from the
  // launcher until they get routes and comingSoon is removed ———
  {
    id: "matma",
    name: "Matma",
    description: "Trening matematyki",
    section: "nauka",
    icon: "Calculator",
    href: "/matma",
    comingSoon: true,
  },
  {
    id: "paragony",
    name: "Paragony",
    description: "Skanowanie paragonów i kontrola wydatków",
    section: "narzedzia",
    icon: "ReceiptText",
    href: "/paragony",
    comingSoon: true,
  },
  {
    id: "butelki",
    name: "Kaucje",
    description: "Licznik butelek kaucyjnych",
    section: "narzedzia",
    icon: "Recycle",
    href: "/butelki",
    comingSoon: true,
  },
  {
    id: "schola",
    name: "Schola",
    description: "Śpiewnik scholi: spis pieśni i notatki",
    section: "wiara",
    icon: "Music4",
    href: "/schola",
    comingSoon: true,
  },
  {
    id: "modlitwa",
    name: "Modlitwa",
    description: "Refleksje, werset dnia i liturgia słowa",
    section: "wiara",
    icon: "Sparkles",
    href: "/modlitwa",
    comingSoon: true,
  },
];

export function getApp(id: string): PhoenixApp | undefined {
  return PHOENIX_APPS.find((a) => a.id === id);
}

/** Installable = built. Used to sanitize profiles.installed_apps values. */
export function installableAppIds(): string[] {
  return PHOENIX_APPS.filter((a) => !a.comingSoon).map((a) => a.id);
}
