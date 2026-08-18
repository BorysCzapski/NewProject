// ============================================================================
// app/(main)/matura/admin/import/page.tsx
// Admin-only trigger UI for the arkusz PDF import pipeline (see
// lib/matura/import-pdf.ts). Mirrors app/(main)/matma/admin/import/page.tsx.
// ============================================================================
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { MaturaPdfImportForm } from "@/components/matura/admin/pdf-import-form";

export default async function MaturaAdminImportPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="Import arkuszy"
        subtitle="Zadania z arkuszy maturalnych z poprzednich lat"
        action={
          <Link href="/matura">
            <Button variant="ghost" size="icon" aria-label="Wróć do Matury Angielski">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <MaturaPdfImportForm />
      </div>
    </div>
  );
}
