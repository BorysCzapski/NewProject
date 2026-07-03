// ============================================================================
// app/(main)/nauka/page.tsx
// "Nauka" hub: entry point listing every learning module. Individual module
// pages live under app/(main)/nauka/<module>/.
// ============================================================================
import Link from "next/link";
import { Map, Layers, BookOpen, GraduationCap, PenLine, Music, Headphones } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";

const MODULES = [
  {
    href: "/nauka/sciezka",
    label: "Ścieżka nauki",
    description: "Etapy do odblokowania: słówka + gramatyka razem",
    icon: Map,
  },
  {
    href: "/nauka/fiszki",
    label: "Fiszki",
    description: "Karty do nauki słówek z powtórkami",
    icon: Layers,
  },
  {
    href: "/nauka/slowka",
    label: "Trener znaczeń",
    description: "Quiz EN↔PL i wpisywanie tłumaczeń",
    icon: BookOpen,
  },
  {
    href: "/nauka/gramatyka",
    label: "Gramatyka",
    description: "Wyjaśnienia i ćwiczenia gramatyczne",
    icon: GraduationCap,
  },
  {
    href: "/nauka/czytanie",
    label: "Czytanie",
    description: "Artykuły od AI i pytania sprawdzające",
    icon: BookOpen,
  },
  {
    href: "/nauka/pisanie",
    label: "Pisanie",
    description: "Krótkie formy oceniane przez AI",
    icon: PenLine,
  },
  {
    href: "/nauka/piosenki",
    label: "Piosenki",
    description: "Tłumacz teksty piosenek linijka po linijce",
    icon: Music,
  },
  {
    href: "/nauka/sluchanie",
    label: "Słuchanie",
    description: "Filmiki z YouTube i luki w transkrypcji",
    icon: Headphones,
  },
];

export default async function NaukaPage() {
  const profile = await requireProfile();

  return (
    <div>
      <PageHeader
        title="Nauka"
        subtitle="Wybierz moduł, żeby zacząć"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <mod.icon className="h-6 w-6" />
              </span>
              <span>
                <CardTitle>{mod.label}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
