import { execFileSync } from "node:child_process";
import { expect, type Page } from "@playwright/test";

export function seedDemoData() {
  execFileSync("npm.cmd", ["run", "prisma:seed"], {
    cwd: process.cwd(),
    shell: true,
    stdio: "pipe",
  });
}

export async function useRole(page: Page, role: "parent" | "child" | "witness") {
  await page.context().addCookies([
    {
      name: "reward_mock_role",
      value: role,
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

export async function completeChildContractFlow(page: Page) {
  await useRole(page, "child");

  await page.goto("/child/contracts/seed_contract/confirm");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm and activate" }).click();

  await page.goto("/child/pomodoro/seed_task");
  await page.getByRole("button", { name: "开始守约" }).click();
  await page.getByRole("button", { name: "我完成了" }).click({
    timeout: 12_000,
  });

  await page.getByRole("textbox", { name: "一句复盘" }).fill("我完成了一次安静的 25 分钟练习。");
  await page.getByRole("button", { name: "提交完成记录" }).click();
  await expect(page).toHaveURL(/\/child\/backyard\?status=cat-visit/);
  await expect(page.getByText("安静猫猫来过了")).toBeVisible();
}
