// ============================================================================
// app/(main)/mindmath/page.tsx
// Mind Math: wejście do technik i treningu oraz ostatnie wyniki z rekordami
// (najlepszy czas przy 100% poprawnych, per tryb i poziom).
// ============================================================================
import Link from "next/link";
import { ArrowRight, BookOpen, Timer } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { MODES } from "@/lib/mindmath/problems";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Row {
  id: string;
  mode: string;
  level: number;
  total: number;
  correct: number;
  seconds: number;
  created_at: string;
}

const modeLabel = (id: string) => MODES.find((m) => m.id === id)?.label ?? id;
const LEVEL = ["", "łatwy", "średni", "trudny"];

export default async function MindMathPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("mindmath_sessions")
    .select("id, mode, level, total, correct, seconds, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];

  const best = new Map<string, Row>();
  for (const r of rows) {
    if (r.correct !== r.total) continue;
    const key = `${r.mode}|${r.level}|${r.total}`;
    const cur = best.get(key);
    if (!cur || Number(r.seconds) < Number(cur.seconds)) best.set(key, r);
  }
  const records = [...best.values()].sort((a, b) => a.mode.localeCompare(b.mode)).slice(0, 8);

  return (
    <div>
      <PageHeader title="Mind Math" subtitle="Szybkie liczenie w głowie: techniki i trening" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link href="/mindmath/trening">
          <Card className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <CardTitle>Trening</CardTitle>
                <CardDescription>Serie zadań na czas, 3 poziomy trudności</CardDescription>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-foreground-muted" />
          </Card>
        </Link>
        <Link href="/mindmath/techniki">
          <Card className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <CardTitle>Techniki</CardTitle>
                <CardDescription>Matematyka wedyjska z Indii, liczydło z Chin i Japonii, sztuczki</CardDescription>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-foreground-muted" />
          </Card>
        </Link>

        <Card>
          <CardTitle>Rekordy</CardTitle>
          <p className="text-sm text-foreground-muted">Najszybsze serie bez żadnego błędu.</p>
          <ul className="mt-2 flex flex-col">
            {records.length === 0 && <li className="py-2 text-sm text-foreground-muted">Jeszcze brak. Zrób pierwszy trening.</li>}
            {records.map((r) => (
              <li key={r.id} className="flex items-baseline justify-between gap-3 border-t border-border/70 py-2 first:border-t-0">
                <span className="text-foreground">
                  {modeLabel(r.mode)} <span className="text-sm text-foreground-muted">• {LEVEL[r.level]} • {r.total} zad.</span>
                </span>
                <span className="font-semibold tabular-nums text-primary">{Number(r.seconds).toFixed(1)} s</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>Ostatnie sesje</CardTitle>
          <ul className="mt-2 flex flex-col">
            {rows.length === 0 && <li className="py-2 text-sm text-foreground-muted">Brak sesji.</li>}
            {rows.slice(0, 8).map((r) => (
              <li key={r.id} className="flex items-baseline justify-between gap-3 border-t border-border/70 py-2 first:border-t-0">
                <span className="text-foreground">
                  {modeLabel(r.mode)} <span className="text-sm text-foreground-muted">• {LEVEL[r.level]}</span>
                </span>
                <span className="text-sm tabular-nums text-foreground-muted">
                  {r.correct}/{r.total} • {Number(r.seconds).toFixed(0)} s
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
