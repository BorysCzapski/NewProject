"use server";
// ============================================================================
// lib/paragony/receipts-actions.ts
// Scan -> AI draft -> user review/correction -> confirmed transaction(s).
// The AI read is NEVER trusted as final: scanReceipt only creates a
// 'pending_review' receipt + draft items (or an empty draft if OCR fails —
// see AGENTS spec §Obsługa błędów); confirmReceipt is the only path that
// marks a receipt 'confirmed' and creates real transactions, and it always
// runs against whatever the user edited on the review screen.
// ============================================================================
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSONWithImage } from "@/lib/ai";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { uploadReceiptImage, getReceiptImageSignedUrl } from "@/lib/paragony/receipt-storage";
import { accountExists, categoryExists } from "@/lib/paragony/validation";
import { DEFAULT_EXPENSE_CATEGORIES, normalizeCategoryName } from "@/lib/paragony/categories";
import type { Receipt, ReceiptItem, ReceiptOcrResult } from "@/lib/types/database";

async function loadCategoryIdsByName(
  supabase: SupabaseClient,
  userId: string
): Promise<Map<string, string>> {
  const { data } = await supabase
    .from("budget_categories")
    .select("id, name")
    .or(`user_id.is.null,user_id.eq.${userId}`);
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    map.set(normalizeCategoryName(row.name as string), row.id as string);
  }
  return map;
}

interface ScannedReceipt {
  receipt: Receipt;
  items: ReceiptItem[];
  imageSignedUrl: string | null;
  /** True when the AI read failed entirely (missing key, model down,
   * malformed output) — the review screen should show an empty form with a
   * "uzupełnij ręcznie" notice instead of pretending a draft exists. */
  ocrFailed: boolean;
}

/** Uploads the photo, asks the vision model to read + categorize it, and
 * stores a pending_review draft. Never throws on OCR failure. */
export async function scanReceipt(imageDataUrl: string): Promise<ActionResult<ScannedReceipt>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const imagePath = await uploadReceiptImage(supabase, profile.id, imageDataUrl);

  let ocrResult: ReceiptOcrResult | null = null;
  let ocrFailed = false;
  try {
    ocrResult = await askAIForJSONWithImage<ReceiptOcrResult>({
      system:
        "Jesteś asystentem odczytującym polskie paragony sklepowe ze zdjęcia. Odpowiadasz WYŁĄCZNIE " +
        "danymi zgodnymi ze schematem. Jeśli jakiegoś pola nie da się odczytać, zwróć pusty string / 0 " +
        "/ pustą listę — nigdy nie zmyślaj danych, których nie widać na zdjęciu.",
      prompt:
        "Odczytaj ten paragon: nazwę sklepu, datę zakupu (format YYYY-MM-DD), formę płatności (jeśli " +
        "widoczna), sumę całkowitą oraz listę pozycji (nazwa, ilość, cena jednostkowa, cena łączna). Dla " +
        `każdej pozycji przypisz jedną kategorię spośród: ${DEFAULT_EXPENSE_CATEGORIES.join(", ")} — ` +
        "wybierz najbliższą pasującą, nawet jeśli niedoskonałą.",
      imageUrl: imageDataUrl,
      schema: {
        store_name: { type: "string", description: "Nazwa sklepu, pusty string jeśli nieczytelna" },
        purchase_date: {
          type: "string",
          description: "Data w formacie YYYY-MM-DD, pusty string jeśli nieczytelna",
        },
        total_amount: { type: "number", description: "Suma całkowita paragonu" },
        payment_method: { type: "string", description: "Forma płatności, pusty string jeśli nie widać" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              quantity: { type: "number", description: "Ilość, domyślnie 1" },
              unit_price: { type: "number", description: "Cena jednostkowa, 0 jeśli nieznana" },
              total_price: { type: "number" },
              category: {
                type: "string",
                description: `Jedna z: ${DEFAULT_EXPENSE_CATEGORIES.join(", ")}`,
              },
            },
            required: ["name", "total_price"],
          },
        },
      },
      maxTokens: 3000,
    });
  } catch (err) {
    console.error("[paragony] receipt OCR failed, falling back to manual entry:", err);
    ocrFailed = true;
  }

  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      user_id: profile.id,
      store_name: ocrResult?.store_name || null,
      purchase_date: ocrResult?.purchase_date || null,
      total_amount: ocrResult?.total_amount || null,
      raw_ocr_json: ocrResult,
      status: "pending_review",
      image_path: imagePath,
    })
    .select()
    .single();

  if (receiptError || !receipt) {
    console.error("[paragony] receipt insert failed:", receiptError);
    return actionFailure("Nie udało się zapisać paragonu. Spróbuj ponownie.");
  }

  let items: ReceiptItem[] = [];
  const rawItems = ocrResult?.items ?? [];
  if (rawItems.length > 0) {
    const categoryByName = await loadCategoryIdsByName(supabase, profile.id);
    const rows = rawItems.map((item) => ({
      receipt_id: receipt.id,
      user_id: profile.id,
      name: item.name,
      quantity: item.quantity || 1,
      unit_price: item.unit_price || null,
      total_price: item.total_price || 0,
      category_id: categoryByName.get(normalizeCategoryName(item.category ?? "")) ?? null,
    }));
    const { data: insertedItems, error: itemsError } = await supabase
      .from("receipt_items")
      .insert(rows)
      .select();
    if (itemsError) {
      console.error("[paragony] receipt items insert failed:", itemsError);
    } else {
      items = (insertedItems ?? []) as ReceiptItem[];
    }
  }

  const imageSignedUrl = imagePath ? await getReceiptImageSignedUrl(supabase, imagePath) : null;

  return {
    ok: true,
    data: {
      receipt: receipt as Receipt,
      items,
      imageSignedUrl,
      ocrFailed: ocrFailed || !ocrResult,
    },
  };
}

interface ConfirmReceiptItemInput {
  name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number;
  category_id: string | null;
}

interface ConfirmReceiptInput {
  receiptId: string;
  storeName: string;
  purchaseDate: string;
  accountId: string;
  items: ConfirmReceiptItemInput[];
}

/** Persists the user's corrected version of a draft receipt and turns it
 * into real transactions — one transaction PER distinct category present
 * among the items (an "uncategorized" bucket for items left without one),
 * so a mixed-basket receipt doesn't distort the per-category budget view by
 * dumping its whole total under a single category. */
export async function confirmReceipt(
  input: ConfirmReceiptInput
): Promise<ActionResult<{ transactionIds: string[] }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!input.storeName.trim()) return actionFailure("Podaj nazwę sklepu.");
  if (input.items.length === 0) return actionFailure("Dodaj przynajmniej jedną pozycję paragonu.");
  if (input.items.some((i) => !i.name.trim() || i.total_price <= 0)) {
    return actionFailure("Każda pozycja musi mieć nazwę i cenę większą od zera.");
  }
  if (!(await accountExists(supabase, input.accountId))) {
    return actionFailure("Wybierz prawidłowe konto.");
  }
  for (const item of input.items) {
    if (item.category_id && !(await categoryExists(supabase, item.category_id))) {
      return actionFailure("Wybrano nieprawidłową kategorię.");
    }
  }

  const { data: receipt, error: receiptFetchError } = await supabase
    .from("receipts")
    .select("id")
    .eq("id", input.receiptId)
    .maybeSingle();
  if (receiptFetchError || !receipt) return actionFailure("Nie znaleziono paragonu.");

  const totalAmount = input.items.reduce((sum, i) => sum + i.total_price, 0);

  const { error: deleteError } = await supabase
    .from("receipt_items")
    .delete()
    .eq("receipt_id", input.receiptId);
  if (deleteError) {
    console.error("[paragony] receipt items delete failed:", deleteError);
    return actionFailure("Nie udało się zapisać poprawek paragonu.");
  }

  const { data: insertedItems, error: insertError } = await supabase
    .from("receipt_items")
    .insert(
      input.items.map((item) => ({
        receipt_id: input.receiptId,
        user_id: profile.id,
        name: item.name.trim(),
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        total_price: item.total_price,
        category_id: item.category_id,
      }))
    )
    .select();
  if (insertError || !insertedItems) {
    console.error("[paragony] receipt items insert failed:", insertError);
    return actionFailure("Nie udało się zapisać pozycji paragonu.");
  }

  const { error: updateError } = await supabase
    .from("receipts")
    .update({
      store_name: input.storeName.trim(),
      purchase_date: input.purchaseDate || null,
      total_amount: totalAmount,
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.receiptId);
  if (updateError) {
    console.error("[paragony] receipt confirm update failed:", updateError);
    return actionFailure("Nie udało się potwierdzić paragonu.");
  }

  const groups = new Map<string, number>();
  for (const item of insertedItems as ReceiptItem[]) {
    const key = item.category_id ?? "__none__";
    groups.set(key, (groups.get(key) ?? 0) + item.total_price);
  }

  const occurredAt = input.purchaseDate || new Date().toISOString().slice(0, 10);
  const transactionRows = Array.from(groups.entries()).map(([key, amount]) => ({
    user_id: profile.id,
    type: "obciazenie" as const,
    amount,
    occurred_at: occurredAt,
    description: input.storeName.trim(),
    category_id: key === "__none__" ? null : key,
    account_id: input.accountId,
    receipt_id: input.receiptId,
  }));

  const { data: insertedTx, error: txError } = await supabase
    .from("transactions")
    .insert(transactionRows)
    .select("id");
  if (txError || !insertedTx) {
    console.error("[paragony] receipt transaction insert failed:", txError);
    return actionFailure("Paragon zapisany, ale nie udało się utworzyć transakcji. Dodaj ją ręcznie.");
  }

  revalidatePath("/paragony");
  revalidatePath("/paragony/budzet");
  return { ok: true, data: { transactionIds: insertedTx.map((t) => t.id as string) } };
}

/** Bulk re-categorization: "przypisz tę kategorię do wszystkich pozycji z
 * tego sklepu" (case-insensitive match on receipts.store_name). */
export async function bulkAssignCategoryByStore(
  storeName: string,
  categoryId: string
): Promise<ActionResult<{ updated: number }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!storeName.trim()) return actionFailure("Podaj nazwę sklepu.");
  if (!(await categoryExists(supabase, categoryId))) return actionFailure("Nie znaleziono kategorii.");

  const { data: receiptRows, error: receiptsError } = await supabase
    .from("receipts")
    .select("id")
    .eq("user_id", profile.id)
    .ilike("store_name", storeName.trim());
  if (receiptsError) {
    console.error("[paragony] bulk category lookup failed:", receiptsError);
    return actionFailure("Nie udało się znaleźć paragonów z tego sklepu.");
  }
  const ids = (receiptRows ?? []).map((r) => r.id as string);
  if (ids.length === 0) return { ok: true, data: { updated: 0 } };

  const { data: updated, error: updateError } = await supabase
    .from("receipt_items")
    .update({ category_id: categoryId })
    .in("receipt_id", ids)
    .select("id");
  if (updateError) {
    console.error("[paragony] bulk category assign failed:", updateError);
    return actionFailure("Nie udało się zaktualizować kategorii.");
  }

  revalidatePath("/paragony/budzet");
  return { ok: true, data: { updated: updated?.length ?? 0 } };
}

export async function deleteReceipt(receiptId: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  // Deleting cascades receipt_items (FK on delete cascade) and nulls out
  // transactions.receipt_id (FK on delete set null) — any already-created
  // transactions stay intact, just unlinked from the receipt.
  const { error } = await supabase.from("receipts").delete().eq("id", receiptId);
  if (error) {
    console.error("[paragony] receipt delete failed:", error);
    return actionFailure("Nie udało się usunąć paragonu.");
  }

  revalidatePath("/paragony");
  return { ok: true, data: null };
}
