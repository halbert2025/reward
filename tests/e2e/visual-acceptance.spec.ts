import { expect, test } from "@playwright/test";
import { completeChildContractFlow, seedDemoData, useRole } from "./helpers";

test.beforeEach(async () => {
  seedDemoData();
});

test.describe("Reward MVP desktop visual acceptance", () => {
  test("P04 parent contract draft is visible and actionable", async ({ page }) => {
    await useRole(page, "parent");
    await page.goto("/parent/contracts/new");

    await expect(page.getByText("First small promise")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create preview" })).toBeEnabled();
    await page.screenshot({ path: "test-results/acceptance-p04-contract-draft.png", fullPage: true });
  });

  test("P08 child completion, P09 parent response, and P10 diary render key states", async ({
    page,
  }) => {
    await completeChildContractFlow(page);
    await page.screenshot({ path: "test-results/acceptance-p08-child-backyard.png", fullPage: true });

    await useRole(page, "parent");
    await page.goto("/parent/response");
    await expect(page.getByText("Parent response")).toBeVisible();
    await expect(page.locator('form button[type="submit"]')).toBeEnabled();
    await page.screenshot({ path: "test-results/acceptance-p09-parent-response.png", fullPage: true });

    await page.locator('textarea[name="message"]').fill("Thank you for keeping this small effort.");
    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/family\/diary\//);
    await expect(page.getByText("Family diary")).toBeVisible();
    await expect(page.getByText("Quiet cat visit")).toBeVisible();
    await page.screenshot({ path: "test-results/acceptance-p10-family-diary.png", fullPage: true });
  });
});
