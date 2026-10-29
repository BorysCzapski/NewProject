// ============================================================================
// app/(main)/biznes/mapy/[id]/page.tsx
// One mind map with the "from memory" recall mode.
// ============================================================================
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MindMap } from "@/components/biznes/mind-map";
import { MIND_MAPS } from "@/lib/biznes/mindmaps";
import { getLesson } from "@/lib/biznes/lessons";

export function generateStaticParams() {
  return MIND_MAPS.map((m) => ({ id: m.id }));
}

export default async function BiznesMindMapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const map = MIND_MAPS.find((m) => m.id === id);
  if (!map) notFound();

  return (
    <div>
      <PageHeader title={map.center} subtitle={getLesson(map.lesson)?.title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <MindMap map={map} />
      </div>
    </div>
  );
}
