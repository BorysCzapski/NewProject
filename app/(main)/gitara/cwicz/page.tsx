// ============================================================================
// app/(main)/gitara/cwicz/page.tsx
// Practice tools: metronome and tuner. Both are entirely client-side
// (lib/gitara/audio-engine.ts) — this page's job is just auth + layout.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { MetronomeTool } from "@/components/gitara/metronome-tool";
import { TunerTool } from "@/components/gitara/tuner-tool";

export default async function GitaraPracticePage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Ćwicz" subtitle="Metronom i stroik" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <MetronomeTool />
        <TunerTool />
      </div>
    </div>
  );
}
