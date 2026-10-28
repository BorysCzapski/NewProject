// ============================================================================
// app/(main)/zusia/page.tsx
// ZUSia home: preparation for the Olimpiada „Warto wiedzieć więcej
// o ubezpieczeniach społecznych”. Tiles for every study mode plus a progress
// summary kept in the browser.
// ============================================================================
import Link from "next/link";
import { BookOpen, ChevronRight, ClipboardCheck, Grid3x3, Layers, ListChecks, Network, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressSummary } from "@/components/zusia/progress-summary";
import { CROSSWORDS } from "@/lib/zusia/crosswords";
import { FLASHCARDS } from "@/lib/zusia/flashcards";
import { MIND_MAPS } from "@/lib/zusia/mindmaps";
import { QUESTIONS } from "@/lib/zusia/questions";
import { LESSONS } from "@/lib/zusia/theory";

const TILES = [
  { href: "/zusia/teoria", icon: BookOpen, title: "Teoria", text: `${LESSONS.length} działów z podręcznika i materiałów dodatkowych` },
  { href: "/zusia/trening", icon: ListChecks, title: "Trening", text: `${QUESTIONS.length} zadań z natychmiastową odpowiedzią i powtórką błędów` },
  { href: "/zusia/test", icon: ClipboardCheck, title: "Test – wszystkie zadania", text: "Pełny arkusz jak na olimpiadzie: czas, wynik, analiza" },
  { href: "/zusia/fiszki", icon: Layers, title: "Fiszki z pojęciami", text: `${FLASHCARDS.length} pojęć, kwot i terminów do zapamiętania` },
  { href: "/zusia/krzyzowki", icon: Grid3x3, title: "Krzyżówki", text: `${CROSSWORDS.length} krzyżówek, w tym ta z podręcznika` },
  { href: "/zusia/mapy", icon: Network, title: "Mapy myśli", text: `${MIND_MAPS.length} map z każdego działu + tryb „z pamięci”` },
  { href: "/zusia/ai", icon: Sparkles, title: "Zadania AI", text: "Nowe pytania i przypadki generowane z teorii, z oceną odpowiedzi" },
] as const;

export default function ZusiaHomePage() {
  return (
    <div>
      <PageHeader title="ZUSia" subtitle="Olimpiada o ubezpieczeniach społecznych" />
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
          Materiał: „Lekcje z ZUS 2026/2027”, materiały dodatkowe 2025/26 i składki przedsiębiorców 2026. Postępy zapisują się w tej przeglądarce.
        </p>
      </div>
    </div>
  );
}
