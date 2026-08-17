// ============================================================================
// lib/butelki/coupon-storage.ts
// Uploads/reads coupon photos in the private "butelki-kupony" bucket (see
// 0011_butelki.sql storage policy: one folder per user). Mirrors the shape
// of lib/paragony/receipt-storage.ts.
// ============================================================================
import "server-only";
import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Uploads a "data:image/jpeg;base64,..." (or png/webp) coupon photo and
 * returns its storage PATH (not a public URL — the bucket is private,
 * callers must sign it for display, see getCouponImageSignedUrl). */
export async function uploadCouponImage(
  supabase: SupabaseClient,
  userId: string,
  dataUrl: string
): Promise<string | null> {
  const match = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;

  const mime = match[1] === "jpg" ? "jpeg" : match[1];
  const buffer = Buffer.from(match[2], "base64");
  const path = `${userId}/${randomUUID()}.${mime === "jpeg" ? "jpg" : mime}`;

  const { error } = await supabase.storage
    .from("butelki-kupony")
    .upload(path, buffer, { contentType: `image/${mime}`, upsert: false });

  if (error) {
    console.error("[butelki] coupon image upload failed:", error);
    return null;
  }
  return path;
}

/** Bucket is private — always read through a short-lived signed URL, never a
 * stored/public link. */
export async function getCouponImageSignedUrl(
  supabase: SupabaseClient,
  storagePath: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("butelki-kupony")
    .createSignedUrl(storagePath, 3600);
  if (error) {
    console.error("[butelki] createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function deleteCouponImage(supabase: SupabaseClient, storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from("butelki-kupony").remove([storagePath]);
  if (error) {
    console.error("[butelki] coupon image delete failed:", error);
  }
}
