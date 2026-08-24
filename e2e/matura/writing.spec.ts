import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures";
import { pickMaturaExam } from "../helpers/user";

// ============================================================================
// Wypowiedź pisemna: real Groq-graded submissions. Slow (a genuine AI call
// per test) and non-deterministic in its actual scores, so these assertions
// target the two things that must hold regardless of what the model says:
// the server-side word-count "guillotine" (lib/matura/writing-grading.ts,
// MATURA_WRITING_WORD_RANGE in lib/matura/constants.ts) and internal
// consistency of the rendered breakdown (criteria sum to the shown total).
// ============================================================================

test.describe.configure({ mode: "serial" });
test.slow(); // each case is a real AI grading round trip

async function startFirstWritingTask(page: Page) {
  await page.goto("/matura/nauka/pisanie", { waitUntil: "networkidle" });
  const form = page.locator("form").filter({ has: page.locator('button[type="submit"]') }).first();
  await Promise.all([
    page.waitForURL((url) => url.pathname.includes("/pisanie/zadanie/"), { timeout: 15_000 }),
    form.locator('button[type="submit"]').click(),
  ]);
}

/** Pulls "<label>\n<awarded>/<max>" out of the rendered result card. */
async function criterionScore(page: Page, label: string): Promise<{ awarded: number; max: number }> {
  const text = await page.locator("body").innerText();
  const match = text.match(new RegExp(`${label}\\s*\\n?\\s*(\\d+)\\/(\\d+)`));
  if (!match) throw new Error(`Nie znaleziono kryterium "${label}" w wyniku oceny`);
  return { awarded: Number(match[1]), max: Number(match[2]) };
}

test("a below-floor submission zeroes every criterion but the first (guillotine)", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await startFirstWritingTask(page);
  // podstawowa floor is 80 words (MATURA_WRITING_WORD_RANGE) — this is ~20.
  await page.fill(
    "textarea",
    "I like sports. I play football with my friends. It is fun and good for health. We meet on Saturday."
  );
  await page.getByRole("button", { name: /Wyślij do oceny/ }).click();
  await expect(page.getByText("Ocena wg kryteriów CKE")).toBeVisible({ timeout: 45_000 });

  const coherence = await criterionScore(page, "Spójność i logika wypowiedzi");
  const range = await criterionScore(page, "Zakres środków językowych");
  const correctness = await criterionScore(page, "Poprawność środków językowych");
  expect(coherence.awarded).toBe(0);
  expect(range.awarded).toBe(0);
  expect(correctness.awarded).toBe(0);

  // Criterion 1 (Treść) is graded on its own merit, NOT forced to 0 by the
  // guillotine — only the total is necessarily low here, not zero by rule.
  const content = await criterionScore(page, "Treść");
  expect(content.max).toBe(5);
});

test("a full-length submission grades all four criteria and totals their sum", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "rozszerzona" });

  await startFirstWritingTask(page);
  // rozszerzona range is 200-250 words (MATURA_WRITING_WORD_RANGE) — an
  // on-topic "for and against" essay would score better, but content
  // relevance isn't what this test checks; internal score consistency is.
  const paragraph =
    "Working from home has become far more common in recent years, and opinions about it remain divided. " +
    "On one hand, remote work saves employees a significant amount of commuting time, which they can spend " +
    "with their families or on personal projects instead of sitting in traffic every morning and evening. " +
    "It also allows companies to hire talented people regardless of where they happen to live, which widens " +
    "the pool of candidates considerably. On the other hand, many people struggle to separate their working " +
    "hours from their personal life when both happen in the same room, and this can lead to longer hours and " +
    "more stress rather than less. Teams can also lose some of the spontaneous collaboration that used to " +
    "happen naturally in a shared office, which may slow down creative projects. On balance, I believe remote " +
    "work suits some roles and personalities far better than others, so the healthiest solution for most " +
    "companies is a flexible policy rather than a single rule applied to everyone without exception at all.";
  await page.fill("textarea", paragraph);
  await page.getByRole("button", { name: /Wyślij do oceny/ }).click();
  await expect(page.getByText("Ocena wg kryteriów CKE")).toBeVisible({ timeout: 45_000 });

  const totalText = await page.locator("text=Ocena wg kryteriów CKE").locator("..").innerText();
  const totalMatch = totalText.match(/(\d+)\s*\n?\/(\d+)/);
  if (!totalMatch) throw new Error("Nie znaleziono łącznego wyniku oceny");
  const total = Number(totalMatch[1]);
  // rozszerzona wypowiedź pisemna: 5+2+3+3 = 13 pkt (README; lib/matura/writing-grading.ts ROZSZERZONA_CRITERIA)
  expect(totalMatch[2]).toBe("13");

  const labels = [
    "Zgodność z poleceniem",
    "Spójność i logika wypowiedzi",
    "Zakres środków językowych",
    "Poprawność środków językowych",
  ];
  let sum = 0;
  for (const label of labels) {
    const score = await criterionScore(page, label);
    expect(score.awarded).toBeGreaterThanOrEqual(0);
    expect(score.awarded).toBeLessThanOrEqual(score.max);
    sum += score.awarded;
  }
  expect(sum).toBe(total);
});
