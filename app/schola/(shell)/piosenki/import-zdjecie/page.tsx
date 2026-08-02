// ============================================================================
// app/schola/(shell)/piosenki/import-zdjecie/page.tsx
// ============================================================================
import { ScholaPageHeader } from "@/components/schola/page-header";
import { SongPhotoImportFlow } from "@/components/schola/song-photo-import-flow";

export default function ScholaImportPhotoPage() {
  return (
    <div>
      <ScholaPageHeader title="Ze zdjęcia" subtitle="Zrób zdjęcie nut lub tekstu z akordami" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SongPhotoImportFlow />
      </div>
    </div>
  );
}
