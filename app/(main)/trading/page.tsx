// ============================================================================
// app/(main)/trading/page.tsx
// Start aplikacji do nauki tradingu: postęp, skróty do trybów nauki, zasady
// do przypięcia i dziennik przykładowych transakcji (ropa Brent / OIL CFD).
// ============================================================================
import Link from "next/link";
import { BookOpen, Calculator, ListChecks, TrendingUp } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressSummary } from "@/components/trading/lesson-done";
import { JOURNAL, LESSONS, QUIZ, RULES, SCENARIOS, lessonBySlug } from "@/lib/trading/content";
import { cn } from "@/lib/utils";

const MODES = [
  { href: "/trading/lekcje", title: "Lekcje", desc: `${LESSONS.length} lekcji od podstaw do psychologii`, Icon: BookOpen },
  { href: "/trading/przyklady", title: "Przykłady", desc: `${SCENARIOS.length} sytuacji na wykresie: co robisz?`, Icon: TrendingUp },
  { href: "/trading/quiz", title: "Quiz", desc: `${QUIZ.length} pytań, losowane po 10`, Icon: ListChecks },
  { href: "/trading/narzedzia", title: "Kalkulator", desc: "Ryzyko, wolumen i lista kontrolna", Icon: Calculator },
];

export default async function TradingPage() {
  await requireProfile();
  const total = JOURNAL.reduce((s, j) => s + j.resultPln, 0);
  const wins = JOURNAL.filter((j) => j.resultPln > 0).length;

  return (
    <div>
      <PageHeader title="Trading" subtitle="Ropa Brent (OIL CFD) — nauka na przykładach" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-3">
          <CardTitle>Twój postęp</CardTitle>
          <ProgressSummary total={LESSONS.length} />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {MODES.map(({ href, title, desc, Icon }) => (
            <Link key={href} href={href}>
              <Card className="flex h-full flex-col gap-2">
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="flex flex-col gap-3">
          <CardTitle>Moje zasady</CardTitle>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-foreground">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <CardTitle>Dziennik przykładów</CardTitle>
            <span className="text-xs text-foreground-muted">29.10–06.11.2026</span>
          </div>
          <p className="text-sm text-foreground-muted">
            Bilans: <strong className={total >= 0 ? "text-primary" : "text-danger"}>{total >= 0 ? "+" : ""}{total.toFixed(2).replace(".", ",")} PLN</strong>{" "}
            ({wins} zysków, {JOURNAL.length - wins} {JOURNAL.length - wins === 1 ? "strata" : "straty"})
          </p>
          <ul className="flex flex-col divide-y divide-border/70">
            {JOURNAL.map((j, i) => (
              <li key={i} className="flex flex-col gap-0.5 py-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {j.date} · {j.side === "Buy" ? "Buy" : "Sell"}
                  </span>
                  <span className={cn("font-semibold", j.resultPln >= 0 ? "text-primary" : "text-danger")}>
                    {j.resultPln >= 0 ? "+" : "−"}
                    {Math.abs(j.resultPln).toFixed(2).replace(".", ",")} PLN
                  </span>
                </div>
                <p className="text-sm text-foreground-muted">{j.lesson}</p>
                <Link href={`/trading/lekcje/${j.lessonSlug}`} className="text-xs font-medium text-primary underline">
                  {lessonBySlug(j.lessonSlug)?.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <p className="text-xs text-foreground-muted">
          Materiał edukacyjny, nie porada inwestycyjna. CFD to instrumenty z dźwignią — większość rachunków detalicznych
          traci na nich pieniądze. Wyniki z dziennika nie gwarantują przyszłych rezultatów.
        </p>
      </div>
    </div>
  );
}
