// ============================================================================
// app/(main)/nauka/page.tsx
// "Nauka" hub: entry point listing every learning module. Individual module
// pages live under app/(main)/nauka/<module>/.
// ============================================================================
import Link from "next/link";
import { Map, Layers, BookOpen, GraduationCap, PenLine, Music, Headphones, Link2, Type } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";

const MODULES = [
  {
    href: "/jezyki/nauka/sciezka",
    label: "Ścieżka nauki",
    description: "Etapy do odblokowania: słówka + gramatyka razem",
    icon: Map,
  },
  {
    href: "/jezyki/nauka/fiszki",
    label: "Fiszki",
    description: "Karty do nauki słówek z powtórkami",
    icon: Layers,
  },
  {
    href: "/jezyki/nauka/slowka",
    label: "Trener znaczeń",
    description: "Quiz EN↔PL i wpisywanie tłumaczeń",
    icon: BookOpen,
  },
  {
    href: "/jezyki/nauka/laczenie",
    label: "Łączenie tłumaczeń",
    description: "Połącz słowa z ich tłumaczeniami — gra na dopasowanie",
    icon: Link2,
  },
  {
    href: "/jezyki/nauka/gramatyka",
    label: "Gramatyka",
    description: "Wyjaśnienia i ćwiczenia gramatyczne",
    icon: GraduationCap,
  },
  {
    href: "/jezyki/nauka/czytanie",
    label: "Czytanie",
    description: "Artykuły od AI i pytania sprawdzające",
    icon: BookOpen,
  },
  {
    href: "/jezyki/nauka/pisanie",
    label: "Pisanie",
    description: "Krótkie formy oceniane przez AI",
    icon: PenLine,
  },
  {
    href: "/jezyki/nauka/piosenki",
    label: "Piosenki",
    description: "Tłumacz teksty piosenek linijka po linijce",
    icon: Music,
  },
  {
    href: "/jezyki/nauka/sluchanie",
    label: "Słuchanie",
    description: "Filmiki z YouTube i luki w transkrypcji",
    icon: Headphones,
  },
];

// Shown only to Russian learners, at the very top — the alphabet comes first.
const CYRYLICA_MODULE = {
  href: "/jezyki/nauka/cyrylica",
  label: "Cyrylica — zacznij tutaj",
  description: "Wprowadzenie do alfabetu: bez tego fiszki będą nieczytelne",
  icon: Type,
};

export default async function NaukaPage() {
  const profile = await requireProfile();
  const modules =
    profile.target_language === "ru" ? [CYRYLICA_MODULE, ...MODULES] : MODULES;

  return (
    <div>
      <PageHeader
        title="Nauka"
        subtitle="Wybierz moduł, żeby zacząć"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {modules.map((mod) => (
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
