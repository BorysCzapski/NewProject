// ============================================================================
// app/schola/(shell)/piosenki/import-pdf/page.tsx
// ============================================================================
import { ScholaPageHeader } from "@/components/schola/page-header";
import { PdfImportFlow } from "@/components/schola/pdf-import-flow";

export default function ScholaImportPdfPage() {
  return (
    <div>
      <ScholaPageHeader title="Import z PDF" subtitle="Wgraj śpiewnik, AI podzieli go na pieśni" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <PdfImportFlow />
      </div>
    </div>
  );
}
