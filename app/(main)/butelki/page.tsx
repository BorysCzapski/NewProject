// ============================================================================
// app/(main)/butelki/page.tsx
// "Kaucje" home screen: bottle counter + coupon photo gallery. No sub-routes
// — this one page is the whole app.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getBottleCount, getBottleCoupons } from "@/lib/butelki/queries";
import { PageHeader } from "@/components/layout/page-header";
import { BottleCounter } from "@/components/butelki/bottle-counter";
import { CouponGallery } from "@/components/butelki/coupon-gallery";

export default async function ButelkiPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [count, coupons] = await Promise.all([
    getBottleCount(supabase, profile.id),
    getBottleCoupons(supabase, profile.id),
  ]);

  return (
    <div>
      <PageHeader title="Kaucje" subtitle="Licznik butelek kaucyjnych" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <BottleCounter initialCount={count} />
        <CouponGallery initialCoupons={coupons} />
      </div>
    </div>
  );
}
