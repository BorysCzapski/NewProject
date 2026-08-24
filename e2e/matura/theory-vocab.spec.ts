import { test, expect } from "../fixtures";
import { pickMaturaExam } from "../helpers/user";

// ============================================================================
// Theory lesson completion and the vocabulary flashcard drill — the two
// non-AI, non-exact-match-task-type flows, independent of the matura_tasks
// schema (see e2e/matura/task-types.spec.ts's header comment).
// ============================================================================

test("marking a theory lesson done updates the section's progress counter", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await page.goto("/matura/nauka/czytanie", { waitUntil: "networkidle" });
  await expect(page.getByText(/^0\/\d+ przerobione$/)).toBeVisible();

  const lessonHref = await page.locator('a[href*="/teoria/"]').first().getAttribute("href");
  await Promise.all([
    page.waitForURL((url) => url.pathname === lessonHref, { timeout: 15_000 }),
    page.locator('a[href*="/teoria/"]').first().click(),
  ]);

  await page.getByRole("button", { name: /Oznacz jako przerobione/ }).click();
  await expect(page.getByText("Lekcja przerobiona")).toBeVisible();

  await page.goto("/matura/nauka/czytanie", { waitUntil: "networkidle" });
  await expect(page.getByText(/^1\/\d+ przerobione$/)).toBeVisible();
});

test("the vocabulary drill runs a topic's fresh entries to completion", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await page.goto("/matura/slownictwo", { waitUntil: "networkidle" });
  const topicHref = await page.locator('a[href*="/slownictwo/dzial/"]').first().getAttribute("href");
  await Promise.all([
    page.waitForURL((url) => url.pathname === topicHref, { timeout: 15_000 }),
    page.locator('a[href*="/slownictwo/dzial/"]').first().click(),
  ]);

  const drillHref = await page.locator('a[href*="/fiszki"]').first().getAttribute("href");
  await Promise.all([
    page.waitForURL((url) => url.pathname === drillHref, { timeout: 15_000 }),
    page.locator('a[href*="/fiszki"]').first().click(),
  ]);

  // A brand-new account's whole batch is "unseen" -> recognition mode
  // (box < 2, see components/matura/vocab-drill.tsx): tap to reveal, then
  // "Umiem" every card. Capped well above any realistic batch size so a
  // stuck drill fails fast instead of hanging the run.
  for (let i = 0; i < 40; i++) {
    if (await page.getByRole("button", { name: "Gotowe" }).isVisible().catch(() => false)) break;
    await page.getByText("dotknij, by sprawdzić").click();
    await page.getByRole("button", { name: /Umiem/ }).click();
  }

  await expect(page.getByRole("button", { name: "Gotowe" })).toBeVisible();
  await expect(page.getByText(/odpowiedzi za pierwszym razem/)).toBeVisible();
});
