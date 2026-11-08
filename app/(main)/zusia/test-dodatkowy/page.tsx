// ============================================================================
// app/(main)/zusia/test-dodatkowy/page.tsx
// „Test z materiałów dodatkowych": arkusz 2026 w trybie egzaminu. Cała
// interakcja jest w komponencie klienckim; to tylko cienka powłoka serwerowa.
// ============================================================================
import { PageHeader } from "@/components/layout/page-header";
import { ExtraTestClient } from "@/components/zusia/extra-test-client";

export default function ZusiaExtraTestPage() {
  return (
    <div>
      <PageHeader title="Test z materiałów dodatkowych" subtitle="Arkusz 2026 w trybie egzaminu" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <ExtraTestClient />
      </div>
    </div>
  );
}
