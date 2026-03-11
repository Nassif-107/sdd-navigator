// @req SCD-UI-004
// @req SCD-UI-005

import { test, expect } from "@playwright/test";

test.describe("Tasks", () => {
  test("tasks table loads", async ({ page }) => {
    await page.goto("/tasks");
    const table = page.locator("table");
    await expect(table.getByText("TASK-001")).toBeVisible();
  });

  test("filter by status works", async ({ page }) => {
    await page.goto("/tasks");
    await page.getByRole("button", { name: "done", exact: true }).click();
    const table = page.locator("table");
    await expect(table.getByText("TASK-001")).toBeVisible();
    await expect(table.getByText("TASK-006")).not.toBeVisible();
  });

  test("orphan tasks highlighted", async ({ page }) => {
    await page.goto("/tasks");
    const table = page.locator("table");
    await expect(table.getByText("UNKNOWN-REQ")).toBeVisible();
  });

  test("orphan panel renders", async ({ page }) => {
    await page.goto("/tasks");
    await expect(page.getByText(/Annotation Orphans/)).toBeVisible();
    await expect(page.getByText(/Task Orphans/)).toBeVisible();
  });
});
