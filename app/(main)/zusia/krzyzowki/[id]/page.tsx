// ============================================================================
// app/(main)/zusia/krzyzowki/[id]/page.tsx
// One interactive crossword.
// ============================================================================
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CrosswordBoard } from "@/components/zusia/crossword-board";
import { CROSSWORDS, getCrossword } from "@/lib/zusia/crosswords";
import { getLesson } from "@/lib/zusia/theory";

export function generateStaticParams() {
  return CROSSWORDS.map((c) => ({ id: c.id }));
}

export default async function ZusiaCrosswordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crossword = getCrossword(id);
  if (!crossword) notFound();

  return (
    <div>
      <PageHeader title={crossword.title} subtitle={getLesson(crossword.lesson)?.short} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <CrosswordBoard crossword={crossword} />
      </div>
    </div>
  );
}
