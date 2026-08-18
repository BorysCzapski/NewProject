// ============================================================================
// app/(main)/geografia/wgraj/page.tsx
// Upload a worksheet PDF and see your previously uploaded files.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getUserFiles } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { UploadForm } from "@/components/geografia/upload/upload-form";
import { FileListItem } from "@/components/geografia/upload/file-list-item";

export default async function GeografiaUploadPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const files = await getUserFiles(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Wgraj arkusz" subtitle="Dodaj własne ćwiczenia z pliku PDF" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <UploadForm />

        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground-muted">Twoje pliki</h2>
            {files.map((file) => (
              <FileListItem key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
