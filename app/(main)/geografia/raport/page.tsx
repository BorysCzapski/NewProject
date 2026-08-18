// ============================================================================
// app/(main)/geografia/raport/page.tsx
// Printable progress report ("wynik podsumowujący postępy, który może
// zostać przekazany nauczycielowi" — product spec §8). Plain, print-friendly
// markup; app/globals.css hides the bottom nav / sticky header on @media print.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress } from "@/lib/geografia/progress";
import { computeEstimatedPercent } from "@/lib/geografia/dashboard";
import { PrintButton } from "@/components/geografia/report/print-button";

export default async function GeografiaReportPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const topics = await getTopicsWithProgress(supabase, profile.id);
  const percent = computeEstimatedPercent(topics);

  const { count: totalAttempts } = await supabase
    .from("geo_exercise_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const generatedAt = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeStyle: "short" }).format(new Date());

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 print:px-0 print:py-0">
      <div className="print-hidden mb-6">
        <PrintButton />
      </div>

      <h1 className="text-2xl font-bold text-foreground">Raport postępów — Geografia (matura rozszerzona)</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Uczeń: {profile.username} · Wygenerowano: {generatedAt}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-(--radius-card) border border-border p-4">
          <p className="text-xs text-foreground-muted">Poziom opanowania materiału</p>
          <p className="text-3xl font-bold text-foreground">{percent}%</p>
        </div>
        <div className="rounded-(--radius-card) border border-border p-4">
          <p className="text-xs text-foreground-muted">Rozwiązane ćwiczenia (łącznie)</p>
          <p className="text-3xl font-bold text-foreground">{totalAttempts ?? 0}</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Wyniki wg działów CKE</h2>
      <table className="mt-3 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-foreground-muted">
            <th className="py-2 pr-2">Dział</th>
            <th className="py-2 pr-2">Tytuł</th>
            <th className="py-2 pr-2">Status</th>
            <th className="py-2 pr-2 text-right">Rozwiązane</th>
            <th className="py-2 text-right">Opanowanie</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic.id} className="border-b border-border/60">
              <td className="py-2 pr-2 text-foreground-muted">{topic.cke_number}</td>
              <td className="py-2 pr-2 text-foreground">{topic.title}</td>
              <td className="py-2 pr-2 text-foreground-muted">
                {topic.status === "mastered" ? "Opanowany" : topic.status === "learning" ? "W trakcie" : "Nowy"}
              </td>
              <td className="py-2 pr-2 text-right text-foreground">{topic.solvedCount}</td>
              <td className="py-2 text-right font-medium text-foreground">{topic.masteryScore}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-foreground-muted">
        Raport wygenerowany automatycznie przez aplikację Geografia (Phoenix). Wynik jest szacunkowy i oparty na
        dotychczasowej aktywności ucznia w aplikacji — nie zastępuje oceny nauczyciela.
      </p>
    </div>
  );
}
