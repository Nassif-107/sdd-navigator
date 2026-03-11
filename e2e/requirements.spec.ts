// @req SCD-UI-002
// @req SCD-UI-003

import { test, expect } from "@playwright/test";

test.describe("Requirements", () => {
  test("table loads with rows", async ({ page }) => {
    await page.goto("/requirements");
    const table = page.locator("table");
    await expect(table.getByText("FR-SCAN-001")).toBeVisible();
    await expect(table.getByText("AR-SEC-001")).toBeVisible();
  });

  test("filter by type changes rows", async ({ page }) => {
    await page.goto("/requirements");
    await page.getByRole("button", { name: "AR", exact: true }).click();
    const table = page.locator("table");
    await expect(table.getByText("AR-PERF-001")).toBeVisible();
    await expect(table.getByText("FR-SCAN-001")).not.toBeVisible();
  });

  test("filter by status changes rows", async ({ page }) => {
    await page.goto("/requirements");
    await page.getByRole("button", { name: "missing", exact: true }).click();
    const table = page.locator("table");
    await expect(table.getByText("FR-API-003")).toBeVisible();
    await expect(table.getByText("FR-SCAN-001")).not.toBeVisible();
  });

  test("sort toggle works", async ({ page }) => {
    await page.goto("/requirements");
    await page.getByRole("button", { name: "Updated" }).click();
    await expect(page).toHaveURL(/sort=updatedAt/);
  });

  test("click row navigates to detail", async ({ page }) => {
    await page.goto("/requirements");
    await page.locator("table").getByText("FR-SCAN-001").click();
    await expect(page.getByRole("heading", { name: "File system scanner" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Annotations/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Tasks/ })).toBeVisible();
  });

  test("detail shows annotations and tasks", async ({ page }) => {
    await page.goto("/requirements/FR-SCAN-001");
    await expect(page.getByText("src/scanner/index.ts:12")).toBeVisible();
    await expect(page.getByText("TASK-001")).toBeVisible();
  });

  test("back preserves filters", async ({ page }) => {
    await page.goto("/requirements?type=FR");
    await page.locator("table").getByText("FR-SCAN-001").click();
    await page.getByRole("link", { name: /Back to requirements/ }).click();
    await expect(page).toHaveURL(/type=FR/);
  });
});
