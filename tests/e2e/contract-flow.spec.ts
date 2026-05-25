import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

const cwd = process.cwd();

function seedDemoData() {
  execFileSync("npm.cmd", ["run", "prisma:seed"], {
    cwd,
    shell: true,
    stdio: "pipe",
  });
}

async function useRole(page: import("@playwright/test").Page, role: "parent" | "child") {
  await page.context().addCookies([
    {
      name: "reward_mock_role",
      value: role,
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

test.beforeEach(async () => {
  seedDemoData();
});

test.describe("Reward MVP contract flow", () => {
  test("child confirms, starts pomodoro, completes, and submits reflection", async ({ page }) => {
    await useRole(page, "child");

    await page.goto("/child/contracts/seed_contract/confirm");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Confirm and activate" }).click();
    await expect(page).toHaveURL(/status=active/);

    await page.goto("/child/pomodoro/seed_task");
    await page.locator("form").first().getByRole("button").click();
    await expect(page.getByText("Cat backyard timer")).toBeVisible();

    await expect(page.getByRole("button", { name: /完成|completed|鎴/ })).toBeEnabled({
      timeout: 12_000,
    });
    await page.getByRole("button", { name: /完成|completed|鎴/ }).click();
    await expect(page).toHaveURL(/\/child\/pomodoro\/seed_task\/reflect/);

    await page.getByRole("textbox", { name: "一句复盘" }).fill("我完成了一次安静的 25 分钟练习。");
    await page.getByRole("button", { name: "提交完成记录" }).click();
    await expect(page).toHaveURL(/\/child\/backyard\?status=cat-visit/);
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
