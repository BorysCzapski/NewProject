// ============================================================================
// app/(main)/zusia/fiszki/page.tsx
// Thin server shell for the Fiszki screen; all interaction lives in the
// client component.
// ============================================================================
import { PageHeader } from "@/components/layout/page-header";
import { FlashcardsClient } from "@/components/zusia/flashcards-client";

export default function ZusiaFlashcardsPage() {
  return (
    <div>
      <PageHeader title="Fiszki" subtitle="Pojęcia, kwoty i terminy" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <FlashcardsClient />
      </div>
    </div>
  );
}
