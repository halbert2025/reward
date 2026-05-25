import { test, expect } from "@playwright/test";

test.skip(true, "Prompt 15 initializes the app shell; real E2E steps are enabled after feature routes exist.");

test.describe("Reward MVP fulfillment flow", () => {
  test("parent marks child completion fulfilled and diary is generated", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange fulfillment_pending contract.
    // TODO: Parent opens P09.
    // TODO: Parent marks fulfilled.
    // TODO: System generates P10 diary.
    // TODO: Assert quiet cat visit appears.
    // TODO: Assert AuditLog includes fulfillment_marked_fulfilled and diary_generated.

    await expect(page).toHaveURL(/.*/);
  });

  test("parent delays fulfillment with neutral copy and witness cannot see delay detail", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange fulfillment_pending contract.
    // TODO: Parent marks delayed with expected time.
    // TODO: Assert child receives neutral delayed notice.
    // TODO: Assert witness memory view excludes delay detail.
    // TODO: Assert AuditLog includes fulfillment_marked_delayed.

    await expect(page).toHaveURL(/.*/);
  });

  test("evidence dispute opens pending repair without AI judgment", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange child evidence submitted.
    // TODO: Parent selects pending repair with neutral message.
    // TODO: Assert Contract pending_repair and RepairCase opened.
    // TODO: Assert no verdict/right-wrong state exists.
    // TODO: Assert witness cannot see repair details.

    await expect(page).toHaveURL(/.*/);
  });
});
