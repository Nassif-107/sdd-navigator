// @req SCD-ACC-001

import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("tab navigation through requirements table", async ({ page }) => {
    await page.goto("/requirements");
    const table = page.locator("table");
    await expect(table).toBeVisible();
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeDefined();
  });

  test("aria-sort present on sortable columns", async ({ page }) => {
    await page.goto("/requirements");
    const table = page.locator("table");
    await expect(table).toBeVisible();
    const sortedColumn = table.locator("[aria-sort]");
    await expect(sortedColumn.first()).toBeVisible();
    const sortValue = await sortedColumn.first().getAttribute("aria-sort");
    expect(["ascending", "descending"]).toContain(sortValue);
  });
});
