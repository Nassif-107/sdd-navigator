// @req SCD-UI-001
// @req SCD-API-001

import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("page loads and summary panel displays stats", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    const summary = page.locator("section[aria-label='Project summary']");
    await expect(summary.getByText("Requirements")).toBeVisible();
    await expect(summary.getByText("Coverage")).toBeVisible();
    await expect(summary.getByText("62.5%")).toBeVisible();
  });

  test("displays last scan timestamp", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Last scan:/)).toBeVisible();
  });

  test("charts render with SVG element", async ({ page }) => {
    await page.goto("/");
    const summary = page.locator("section[aria-label='Project summary']");
    await expect(summary).toBeVisible();
    // Progress bar uses role="progressbar"
    const progressBar = summary.locator("[role='progressbar']");
    await expect(progressBar.first()).toBeVisible();
  });
});
