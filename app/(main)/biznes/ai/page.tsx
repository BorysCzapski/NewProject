// ============================================================================
// app/(main)/biznes/ai/page.tsx
// Thin server shell for the Zadania AI screen; all interaction lives in the
// client component.
// ============================================================================
import { PageHeader } from "@/components/layout/page-header";
import { AiClient } from "@/components/biznes/ai-client";

export default function BiznesAiPage() {
  return (
    <div>
      <PageHeader title="Zadania AI" subtitle="Nowe zadania generowane z teorii" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <AiClient />
      </div>
    </div>
  );
}
