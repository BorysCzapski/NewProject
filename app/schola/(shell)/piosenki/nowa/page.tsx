// ============================================================================
// app/schola/(shell)/piosenki/nowa/page.tsx
// ============================================================================
import { ScholaPageHeader } from "@/components/schola/page-header";
import { SongForm } from "@/components/schola/song-form";

export default function NewScholaSongPage() {
  return (
    <div>
      <ScholaPageHeader title="Nowa pieśń" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SongForm />
      </div>
    </div>
  );
}
