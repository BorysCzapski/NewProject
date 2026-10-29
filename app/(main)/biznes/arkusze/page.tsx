// ============================================================================
// app/(main)/biznes/arkusze/page.tsx
// List of full exam sheets (CKE materials and four author sheets).
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SHEETS, taskCount } from "@/lib/biznes/sheets";

const GROUPS = [
  { kind: "cke", label: "Materiały CKE" },
  { kind: "autorski", label: "Arkusze autorskie" },
] as const;

export default function BiznesSheetsPage() {
  return (
    <div>
      <PageHeader title="Arkusze" subtitle="Pełne arkusze do rozwiązania" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        {GROUPS.map((g) => (
          <section key={g.kind} className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">{g.label}</h2>
            {SHEETS.filter((s) => s.kind === g.kind).map((s) => (
              <Link
                key={s.slug}
                href={`/biznes/arkusze/${s.slug}`}
                className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card) transition-transform active:scale-[0.99]"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-primary">{s.period}</span>
                  <span className="block text-base font-semibold text-foreground">{s.title}</span>
                  <span className="block text-sm text-foreground-muted">
                    {taskCount(s)} zadań · {s.maxPoints} pkt
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
              </Link>
            ))}
          </section>
        ))}
        <p className="text-xs text-foreground-muted">
          Arkusze pochodzą z maturabiz.pl i nie mają klucza odpowiedzi: odpowiedzi ocenia AI na podstawie bazy wiedzy. Wykresy i rysunki nie są w tekście arkusza, więc przy każdym jest link do oryginału.
        </p>
      </div>
    </div>
  );
}
