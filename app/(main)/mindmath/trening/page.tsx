// ============================================================================
// app/(main)/mindmath/trening/page.tsx
// Trening na czas. `?tryb=<id>` wstępnie wybiera tryb (link z lekcji techniki).
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Trainer } from "@/components/mindmath/trainer";

export default async function TreningPage({
  searchParams,
}: {
  searchParams: Promise<{ tryb?: string }>;
}) {
  await requireProfile();
  const { tryb } = await searchParams;
  return (
    <div>
      <PageHeader title="Trening" subtitle="Odpowiadaj jak najszybciej, bez kartki" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Trainer initialMode={tryb ?? "mix"} />
      </div>
    </div>
  );
}
