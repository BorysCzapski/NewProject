// ============================================================================
// app/(main)/biznes/page.tsx
// Matura BiZ home: preparation for the extended matura in business and
// management (biznes i zarządzanie). Tiles for every study mode plus a
// progress summary kept in the browser.
// ============================================================================
import Link from "next/link";
import { BookOpen, ChevronRight, ClipboardCheck, FileText, Grid3x3, Layers, ListChecks, Network, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressSummary } from "@/components/biznes/progress-summary";
import { CROSSWORDS } from "@/lib/biznes/crosswords";
import { FLASHCARDS } from "@/lib/biznes/flashcards";
import { MIND_MAPS } from "@/lib/biznes/mindmaps";
import { QUESTIONS } from "@/lib/biznes/questions";
import { LESSONS } from "@/lib/biznes/lessons";
import { SHEETS } from "@/lib/biznes/sheets";

const TILES = [
  { href: "/biznes/teoria", icon: BookOpen, title: "Teoria", text: `${LESSONS.length} działów podstawy programowej: cała baza wiedzy z maturabiz.pl` },
  { href: "/biznes/arkusze", icon: FileText, title: "Arkusze", text: `${SHEETS.length} pełnych arkuszy (CKE i autorskie) z oceną AI` },
  { href: "/biznes/trening", icon: ListChecks, title: "Trening", text: `${QUESTIONS.length} zadań z natychmiastową odpowiedzią i powtórką błędów` },
  { href: "/biznes/test", icon: ClipboardCheck, title: "Test – wszystkie zadania", text: "Wszystkie pytania ze słownika w trybie egzaminu: czas, wynik, analiza" },
  { href: "/biznes/fiszki", icon: Layers, title: "Fiszki z pojęciami", text: `${FLASHCARDS.length} pojęć, kwot i terminów do zapamiętania` },
  { href: "/biznes/krzyzowki", icon: Grid3x3, title: "Krzyżówki", text: `${CROSSWORDS.length} krzyżówek z pojęć z każdego działu` },
  { href: "/biznes/mapy", icon: Network, title: "Mapy myśli", text: `${MIND_MAPS.length} map z każdego działu + tryb „z pamięci”` },
  { href: "/biznes/ai", icon: Sparkles, title: "Zadania AI", text: "Nowe pytania i przypadki generowane z teorii, z oceną odpowiedzi" },
] as const;

export default function BiznesHomePage() {
  return (
    <div>
      <PageHeader title="Matura BiZ" subtitle="Biznes i zarządzanie, poziom rozszerzony" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <ProgressSummary />

        <nav aria-label="Tryby nauki" className="flex flex-col gap-2.5">
          {TILES.map(({ href, icon: Icon, title, text }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3.5 rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card) transition-transform active:scale-[0.99]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-foreground">{title}</span>
                <span className="block text-sm text-foreground-muted">{text}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-foreground-muted">
          Materiał: baza wiedzy i słownik pojęć z maturabiz.pl oraz arkusze (w tym Informator CKE). Postępy zapisują się na koncie.
        </p>
      </div>
    </div>
  );
}
