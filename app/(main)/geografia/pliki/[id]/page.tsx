// ============================================================================
// app/(main)/geografia/pliki/[id]/page.tsx
// View one uploaded worksheet PDF (via a signed URL, embedded in the
// browser's native PDF viewer) with a private per-user annotation panel
// alongside it.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getFileById, getGeoFileSignedUrl } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { AnnotationPanel } from "@/components/geografia/annotations/annotation-panel";
import type { GeoAnnotation } from "@/lib/types/database";

export default async function GeografiaFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const file = await getFileById(supabase, id);
  if (!file || file.user_id !== profile.id) notFound();

  const [signedUrl, { data: annotationRows }] = await Promise.all([
    getGeoFileSignedUrl(supabase, file.storage_path),
    supabase
      .from("geo_annotations")
      .select("*")
      .eq("file_id", id)
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader title={file.title} subtitle="Podgląd i Twoje prywatne notatki" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {signedUrl ? (
          <iframe src={signedUrl} className="h-96 w-full rounded-(--radius-card) border border-border" title={file.title} />
        ) : (
          <p className="text-sm text-danger">Nie udało się wygenerować podglądu pliku.</p>
        )}

        <AnnotationPanel fileId={id} initialAnnotations={(annotationRows ?? []) as GeoAnnotation[]} />
      </div>
    </div>
  );
}
