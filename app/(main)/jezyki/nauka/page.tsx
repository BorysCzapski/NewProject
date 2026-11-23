// ============================================================================
// app/(main)/nauka/page.tsx
// "Nauka" hub: entry point listing every learning module. Individual module
// pages live under app/(main)/nauka/<module>/.
// ============================================================================
import Link from "next/link";
import { Map, Layers, BookOpen, GraduationCap, PenLine, Headphones, Type, BookMarked } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { stagger } from "@/lib/motion";

// Wszystkie ćwiczenia słówek (Codzienne, Pisownia, Trening fiszek, Fiszki, Trener
// znaczeń, Łączenie) siedzą pod jednym kafelkiem: najpierw wybierasz materiał, potem
// tryb (patrz app/(main)/jezyki/fiszki).
const MODULES = [
  {
    href: "/jezyki/fiszki",
    label: "Fiszki",
    description: "Wybierz materiał, a potem tryb: znaczenia, pisownia, wpisywanie, quiz, łączenie",
    icon: Layers,
  },
  {
    href: "/jezyki/nauka/sciezka",
    label: "Ścieżka nauki",
    description: "Etapy do odblokowania: słówka + gramatyka razem",
    icon: Map,
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
    href: "/jezyki/nauka/sluchanie",
    label: "Słuchanie",
    description: "Filmiki z YouTube i luki w transkrypcji",
    icon: Headphones,
  },
  {
    href: "/jezyki/nauka/podrecznik",
    label: "Angielski szkoła",
    description: "Wgraj własny podręcznik — działy, słówka i gramatyka z PDF-a",
    icon: BookMarked,
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
  const modules = profile.target_language === "ru" ? [CYRYLICA_MODULE, ...MODULES] : MODULES;

  return (
    <div>
      <PageHeader
        title="Nauka"
        subtitle="Wybierz moduł, żeby zacząć"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {modules.map((mod, index) => (
          <Link key={mod.href} href={mod.href} className="animate-fade-up motion-stagger" style={stagger(index)}>
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
