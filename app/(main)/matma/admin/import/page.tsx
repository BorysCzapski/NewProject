// ============================================================================
// app/(main)/matma/admin/import/page.tsx
// Trigger UI + coverage overview for the CKE past-exam import pipeline (see
// lib/matma/import-past-exams.ts). Server Component, requireAdmin()-gated —
// the actual import runs client-side via the "use client" trigger form
// calling the Server Action, since it can take minutes (many PDFs).
// ============================================================================
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPastExamYearCoverage } from "@/lib/matma/import-past-exams";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportTriggerForm } from "@/components/matma/admin/import-trigger-form";
import { MatemaksPasteImportForm } from "@/components/matma/admin/matemaks-paste-import-form";

export default async function MatmaAdminImportPage() {
  await requireAdmin();
  const supabase = await createClient();
  const coverage = await getPastExamYearCoverage(supabase);
  const total = coverage.reduce((sum, c) => sum + c.count, 0);

  return (
    <div>
      <PageHeader
        title="Import arkuszy CKE"
        subtitle="Zadania z prawdziwych matur rozszerzonych"
        action={
          <Link href="/matma/admin">
            <Button variant="ghost" size="icon" aria-label="Wróć do panelu administratora">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Card className="flex flex-col gap-2">
          <div>
            <CardTitle>Pokrycie bazy zadaniami z matur</CardTitle>
            <CardDescription>
              {total === 0
                ? "Baza nie zawiera jeszcze żadnych zadań ze źródła „z matury” (source = past_exam)."
                : `Łącznie ${total} ${total === 1 ? "zadanie" : "zadań"} ze źródła „z matury”, wg roku arkusza:`}
            </CardDescription>
          </div>
          {coverage.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {coverage.map((c) => (
                <span key={c.year}>
                  <span className="font-semibold text-foreground">{c.year}</span>{" "}
                  <span className="text-foreground-muted">({c.count})</span>
                </span>
              ))}
            </div>
          )}
        </Card>

        <ImportTriggerForm />

        <div className="mt-2 border-t border-border pt-5">
          <CardTitle>Zadania spoza CKE (kuratorowane)</CardTitle>
          <CardDescription className="mb-3">
            Matemaks.pl blokuje automatyczne zapytania serwera (403 na każde żądanie) — import działa przez skrypt
            uruchamiany w Twojej własnej przeglądarce, nie przez automatyczne pobieranie.
          </CardDescription>
          <MatemaksPasteImportForm />
        </div>
      </div>
    </div>
  );
}
