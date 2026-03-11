// @req SCD-UI-007

import { test, expect } from "@playwright/test";

test.describe("Responsive layout", () => {
  test("mobile viewport renders card layout instead of table", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/requirements");
    // Card layout should be visible on mobile (sm:hidden)
    const cards = page.locator("div.sm\\:hidden");
    await expect(cards).toBeVisible();
    // Wait for data to load — scope to mobile card container
    await expect(cards.getByText("FR-SCAN-001").first()).toBeVisible();
    // Table should be hidden on mobile (hidden sm:block)
    const table = page.locator("table");
    await expect(table).not.toBeVisible();
  });
});
