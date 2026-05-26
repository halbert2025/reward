import { expect, test } from "@playwright/test";
import { completeChildContractFlow, seedDemoData, useRole } from "./helpers";

test.beforeEach(async () => {
  seedDemoData();
});

test.describe("Reward MVP contract flow", () => {
  test("child confirms, starts pomodoro, completes, and submits reflection", async ({ page }) => {
    await completeChildContractFlow(page);
    await expect(page).toHaveURL(/\/child\/backyard\?status=cat-visit/);
    await page.getByRole("link", { name: "查看小票收藏册" }).click();
    await expect(page.getByRole("heading", { name: "猫猫奶茶小票收藏册" })).toBeVisible();
    await expect(page.getByText("我完成了一次安静的 25 分钟练习。").first()).toBeVisible();
  });

  test("unsafe reward or contract input is blocked before preview", async ({ page }) => {
    await useRole(page, "parent");

    await page.goto("/parent/contracts/new");
    await page.getByLabel("Title").fill("Cash reward");
    await page.getByLabel("Promise").fill("Finish class ranking task");
    await page.getByRole("button", { name: "Create preview" }).click();

    await expect(page).toHaveURL(/error=/);
    await expect(page.getByText(/不放进家庭愿望池|not suitable|不适合/)).toBeVisible();
  });
});
