// ============================================================================
// app/(main)/gitara/piosenki/wgraj/page.tsx
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { PdfImportFlow } from "@/components/gitara/pdf-import-flow";

export default async function GitaraImportSongbookPage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Import z PDF" subtitle="Wgraj śpiewnik, AI podzieli go na piosenki" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <PdfImportFlow />
      </div>
    </div>
  );
}
