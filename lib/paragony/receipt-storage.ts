// ============================================================================
// lib/paragony/receipt-storage.ts
// Uploads/reads receipt photos in the private "paragony-receipts" bucket (see
// 0008_paragony_budzet_etf.sql storage policy: one folder per user). Mirrors
// the shape of lib/matma/actions.ts's uploadCanvasImage / getCanvasSignedUrl
// for the ink-canvas bucket.
// ============================================================================
import "server-only";
import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Uploads a "data:image/jpeg;base64,..." (or png/webp) receipt photo and
 * returns its storage PATH (not a public URL — the bucket is private,
 * callers must sign it for display, see getReceiptImageSignedUrl). */
export async function uploadReceiptImage(
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
    .from("paragony-receipts")
    .upload(path, buffer, { contentType: `image/${mime}`, upsert: false });

  if (error) {
    console.error("[paragony] receipt image upload failed:", error);
    return null;
  }
  return path;
}

/** Bucket is private — always read through a short-lived signed URL, never a
 * stored/public link. */
export async function getReceiptImageSignedUrl(
  supabase: SupabaseClient,
  storagePath: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("paragony-receipts")
    .createSignedUrl(storagePath, 3600);
  if (error) {
    console.error("[paragony] createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}
