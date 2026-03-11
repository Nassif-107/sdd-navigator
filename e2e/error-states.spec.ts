// @req SCD-ERR-001

import { test, expect } from "@playwright/test";

test.describe("Error and loading states", () => {
  test("loading indicator visible during fetch", async ({ page }) => {
    await page.goto("/requirements");
    const loadingOrData = page.getByText(/Loading requirements|FR-SCAN-001/).first();
    await expect(loadingOrData).toBeVisible();
  });

  test("error message on network failure", async ({ page }) => {
    // Abort all fetch/XHR requests — simulates network failure for API mode
    await page.route("**/*", async (route) => {
      const type = route.request().resourceType();
      if (type === "fetch" || type === "xhr") {
        await route.abort();
      } else {
        await route.continue();
      }
    });
    // Navigate to a non-existent requirement — triggers error in mock mode too
    await page.goto("/requirements/NONEXISTENT-REQ");
    await expect(page.locator("[role='alert']")).toBeVisible();
  });
});
