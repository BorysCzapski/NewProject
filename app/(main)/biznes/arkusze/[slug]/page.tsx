// ============================================================================
// app/(main)/biznes/arkusze/[slug]/page.tsx
// One exam sheet, solved task by task (SheetRunner keeps answers locally).
// ============================================================================
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { SheetRunner } from "@/components/biznes/sheet-runner";
import { SHEETS, getSheet } from "@/lib/biznes/sheets";

export function generateStaticParams() {
  return SHEETS.map((s) => ({ slug: s.slug }));
}

export default async function BiznesSheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sheet = getSheet(slug);
  if (!sheet) notFound();
  return (
    <div>
      <PageHeader title={sheet.title} subtitle={`${sheet.period} · ${sheet.maxPoints} pkt`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SheetRunner sheet={sheet} />
      </div>
    </div>
  );
}
