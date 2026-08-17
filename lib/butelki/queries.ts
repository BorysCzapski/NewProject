// ============================================================================
// lib/butelki/queries.ts
// Read-side for the "Kaucje" page: current bottle count + coupon photos
// (each resolved to a short-lived signed URL, the bucket is private).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCouponImageSignedUrl } from "@/lib/butelki/coupon-storage";
import type { BottleCoupon } from "@/lib/types/database";

/** No row yet = 0 bottles (a fresh user never had a counter row created). */
export async function getBottleCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("bottle_counters")
    .select("count")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[butelki] counter fetch failed:", error);
    return 0;
  }
  return data?.count ?? 0;
}

export interface CouponWithUrl extends BottleCoupon {
  signedUrl: string | null;
}

export async function getBottleCoupons(supabase: SupabaseClient, userId: string): Promise<CouponWithUrl[]> {
  const { data, error } = await supabase
    .from("bottle_coupons")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.error("[butelki] coupons fetch failed:", error);
    return [];
  }

  const coupons = data as BottleCoupon[];
  return Promise.all(
    coupons.map(async (coupon) => ({
      ...coupon,
      signedUrl: await getCouponImageSignedUrl(supabase, coupon.image_path),
    }))
  );
}
