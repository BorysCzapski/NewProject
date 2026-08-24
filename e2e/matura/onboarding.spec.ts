import { test, expect } from "../fixtures";
import { pickMaturaExam } from "../helpers/user";

// ============================================================================
// First visit to /matura (język + poziom picker) and the admin-only import
// page's server-side gating. See README.md's "Matura z języka" section: język
// and poziom are chosen once, up front, and everything downstream (admin
// import link, dashboard totals) depends on that choice and on profile.role.
// ============================================================================

test("shows the exam picker on first visit, then the dashboard after choosing", async ({ page, freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await expect(page.getByText("Do jakiej matury się przygotowujesz?")).toBeVisible();

  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  // Fresh account: no progress yet, podstawowa totals 60 pkt (README).
  await expect(page.getByText(freshUser.username)).toBeVisible();
  await expect(page.getByText("Poziom podstawowy", { exact: true })).toBeVisible();
  await expect(page.getByText("/ 60 pkt")).toBeVisible();
  await expect(page.getByText(/Cel: 48\/60 pkt \(80%\)/)).toBeVisible();
});

test("a non-admin user never sees or can reach the PDF import page", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await expect(page.getByText("Import zadań z arkusza (admin)")).not.toBeVisible();

  // requireAdmin() must gate this server-side, not just hide the UI link —
  // a direct navigation has to redirect away, never render the upload form.
  await page.goto("/matura/admin/import", { waitUntil: "networkidle" });
  await expect(page.getByText("Import arkuszy")).not.toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
});
