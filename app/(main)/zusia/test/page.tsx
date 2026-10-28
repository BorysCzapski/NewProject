// ============================================================================
// app/(main)/zusia/test/page.tsx
// Thin server shell for the Test – wszystkie zadania screen; all interaction lives in the
// client component.
// ============================================================================
import { PageHeader } from "@/components/layout/page-header";
import { TestClient } from "@/components/zusia/test-client";

export default function ZusiaTestPage() {
  return (
    <div>
      <PageHeader title="Test – wszystkie zadania" subtitle="Pełny arkusz w trybie egzaminu" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <TestClient />
      </div>
    </div>
  );
}
