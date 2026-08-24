import { test, expect } from "../fixtures";
import { pickMaturaExam } from "../helpers/user";

// ============================================================================
// README.md: "przełączenie języka niczego nie kasuje — postęp każdego języka
// czeka tam, gdzie go zostawiłeś". Switching język/poziom on /matura/ustawienia
// must swap which content is shown WITHOUT touching the other combination's
// progress — this is the one behaviour a code read can't fully confirm
// without actually round-tripping the switch.
// ============================================================================

test("switching język/poziom preserves each combination's progress independently", async ({ page, freshUser: _freshUser }) => {
  // Two full settings round trips plus a theory lesson completion, each a
  // real page load against Supabase — comfortably over the 30s default on a
  // cold Turbopack route compile.
  test.slow();
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  // Leave a mark in en/podstawowa: complete the section's first theory lesson.
  await page.goto("/matura/nauka/srodki-jezykowe", { waitUntil: "networkidle" });
  const lessonHref = await page.locator('a[href*="/teoria/"]').first().getAttribute("href");
  await Promise.all([
    page.waitForURL((url) => url.pathname === lessonHref, { timeout: 15_000 }),
    page.locator('a[href*="/teoria/"]').first().click(),
  ]);
  await page.getByRole("button", { name: /Oznacz jako przerobione/ }).click();
  await expect(page.getByText("Lekcja przerobiona")).toBeVisible();

  await page.goto("/matura/nauka/srodki-jezykowe", { waitUntil: "networkidle" });
  await expect(page.getByText(/^1\/\d+ przerobione$/)).toBeVisible();

  // Switch to es/rozszerzona: different totals, and this combination has
  // never been touched by this account, so its theory progress must read 0.
  await page.goto("/matura/ustawienia", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "es", level: "rozszerzona" });

  await page.goto("/matura", { waitUntil: "networkidle" });
  await expect(page.getByText("Poziom rozszerzony", { exact: true })).toBeVisible();
  await expect(page.getByText("/ 50 pkt")).toBeVisible();

  await page.goto("/matura/nauka/srodki-jezykowe", { waitUntil: "networkidle" });
  await expect(page.getByText(/^0\/\d+ przerobione$/)).toBeVisible();

  // Switch back: the en/podstawowa lesson completed above must still be there.
  await page.goto("/matura/ustawienia", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await page.goto("/matura/nauka/srodki-jezykowe", { waitUntil: "networkidle" });
  await expect(page.getByText(/^1\/\d+ przerobione$/)).toBeVisible();
});
