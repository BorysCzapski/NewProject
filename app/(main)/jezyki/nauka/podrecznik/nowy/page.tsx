// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/nowy/page.tsx
// Upload flow entry point — the upload/processing UI lives in a client
// component (needs fetch() + router.push once the Route Handler finishes).
// ============================================================================
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { TextbookUploadFlow } from "@/components/textbook/upload-flow";

export default async function NewTextbookPage() {
  await requireProfile();

  return (
    <div>
      <PageHeader title="Nowy podręcznik" subtitle="Wgraj plik PDF" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka/podrecznik"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Twoje podręczniki
        </Link>
        <TextbookUploadFlow />
      </div>
    </div>
  );
}
