import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers/user";

// ============================================================================
// Positive counterpart to onboarding.spec.ts's admin-gating check: the
// seeded admin account (README.md → "Konto administratora") must actually be
// able to reach the PDF import screen, not just be excluded from the redirect.
// Uses the shared seeded account rather than a disposable one on purpose —
// admin status can't be self-service granted, and this test never writes
// anything (no file is uploaded), so it's safe to share with other runs.
// ============================================================================

test("the seeded admin account can open the PDF import page", async ({ page }) => {
  await loginAs(page, "admin", "admin213");
  await page.goto("/matura/admin/import", { waitUntil: "networkidle" });

  await expect(page.getByText("Import arkuszy")).toBeVisible();
  // Arkusz PDF + opcjonalny plik klucza odpowiedzi (README.md).
  await expect(page.locator('input[type="file"]')).toHaveCount(2);
});
