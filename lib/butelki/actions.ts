"use server";
// ============================================================================
// lib/butelki/actions.ts
// "Kaucje" mini-app: bottle counter (absolute-value upsert, not atomic
// increment — the client debounces taps and always sends the running total,
// see components/butelki/bottle-counter.tsx) + coupon photo upload/delete.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { uploadCouponImage, deleteCouponImage, getCouponImageSignedUrl } from "@/lib/butelki/coupon-storage";
import type { BottleCoupon } from "@/lib/types/database";
import type { CouponWithUrl } from "@/lib/butelki/queries";

/** Upserts the absolute count for the caller. Negative values are clamped
 * to 0 rather than rejected — a debounced client can't really "fail" a tap. */
export async function setBottleCount(count: number): Promise<ActionResult<{ count: number }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const clamped = Math.max(0, Math.round(count) || 0);

  const { data, error } = await supabase
    .from("bottle_counters")
    .upsert({ user_id: profile.id, count: clamped, updated_at: new Date().toISOString() })
    .select("count")
    .single();

  if (error || !data) {
    console.error("[butelki] counter upsert failed:", error);
    return actionFailure("Nie udało się zapisać licznika.");
  }

  revalidatePath("/butelki");
  return { ok: true, data: { count: data.count as number } };
}

export async function resetBottleCount(): Promise<ActionResult<{ count: number }>> {
  return setBottleCount(0);
}

export async function addCoupon(imageDataUrl: string): Promise<ActionResult<CouponWithUrl>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const imagePath = await uploadCouponImage(supabase, profile.id, imageDataUrl);
  if (!imagePath) return actionFailure("Nie udało się zapisać zdjęcia kuponu.");

  const { data, error } = await supabase
    .from("bottle_coupons")
    .insert({ user_id: profile.id, image_path: imagePath })
    .select()
    .single();

  if (error || !data) {
    console.error("[butelki] coupon insert failed:", error);
    return actionFailure("Nie udało się dodać kuponu.");
  }

  const signedUrl = await getCouponImageSignedUrl(supabase, imagePath);

  revalidatePath("/butelki");
  return { ok: true, data: { ...(data as BottleCoupon), signedUrl } };
}

export async function deleteCoupon(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { data: coupon, error: fetchError } = await supabase
    .from("bottle_coupons")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !coupon) return actionFailure("Nie znaleziono kuponu.");

  const { error } = await supabase.from("bottle_coupons").delete().eq("id", id);
  if (error) {
    console.error("[butelki] coupon delete failed:", error);
    return actionFailure("Nie udało się usunąć kuponu.");
  }

  await deleteCouponImage(supabase, coupon.image_path as string);

  revalidatePath("/butelki");
  return { ok: true, data: null };
}
