import { test, expect } from "@playwright/test";

test.skip(true, "Prompt 15 initializes the app shell; real E2E steps are enabled after feature routes exist.");

test.describe("Reward MVP contract flow", () => {
  test("normal family creates contract, child confirms, starts, completes, and submits reflection", async ({ page }) => {
    await page.goto("/");

    // TODO: P01 parent starts setup.
    // TODO: P02 parent confirms five principles.
    // TODO: P03 parent initializes safe reward pool.
    // TODO: P04 parent creates first 25-minute contract.
    // TODO: P05 parent invites child.
    // TODO: P06 child opens wish backyard.
    // TODO: child confirms latest ContractVersion.
    // TODO: P07 child starts and completes pomodoro.
    // TODO: P08 child submits required reflection.

    await expect(page).toHaveURL(/.*/);
  });

  test("parent cannot overwrite confirmed contract version after child confirmation", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange confirmed contract.
    // TODO: Parent attempts to edit accepted version in place.
    // TODO: Expect CONTRACT_CONFIRMED_IMMUTABLE or new ContractVersion flow.
    // TODO: Assert child effort remains visible.

    await expect(page).toHaveURL(/.*/);
  });

  test("unsafe reward or contract input is blocked before ContractVersion creation", async ({ page }) => {
    await page.goto("/");

    // TODO: Try school/class/institution wording.
    // TODO: Try cash/wallet/merchant wording.
    // TODO: Try video/location/hard-lock/open-ranking wording.
    // TODO: Assert no ContractVersion is created.

    await expect(page).toHaveURL(/.*/);
  });
});
