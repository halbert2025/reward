import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";
import { completeChildContractFlow, seedDemoData, useRole } from "./helpers";

const prisma = new PrismaClient();

test.beforeEach(async () => {
  seedDemoData();
});

test.afterAll(async () => {
  await prisma.$disconnect();
});

async function openOrCreateWitness(page: import("@playwright/test").Page) {
  await page.goto("/parent/witness");
  const witnessName = page.getByLabel("Witness display name");
  if ((await witnessName.count()) > 0) {
    await witnessName.fill("Grandma");
    await page.getByRole("button", { name: "Generate witness link" }).click();
  }
  await page.goto("/witness");
}

test.describe("Reward MVP fulfillment flow", () => {
  test("parent marks child completion fulfilled and diary is generated", async ({ page }) => {
    await completeChildContractFlow(page);
    await useRole(page, "parent");

    await page.goto("/parent/response");
    await page.getByRole("textbox", { name: "给孩子的一句话" }).fill("谢谢你把这次努力记录下来。");
    await page.getByRole("button", { name: "保存回应" }).click();

    await expect(page).toHaveURL(/\/family\/diary\//);
    await expect(page.getByText("已兑现")).toBeVisible();
    await expect(page.getByText("安静猫来访了")).toBeVisible();

    await expect
      .poll(async () => {
        return prisma.auditLog.count({
          where: {
            familyId: "seed_family",
            eventName: { in: ["fulfillment_marked_fulfilled", "diary_generated"] },
          },
        });
      })
      .toBe(2);
  });

  test("parent delays fulfillment and witness cannot see delay detail", async ({ page }) => {
    await completeChildContractFlow(page);
    await useRole(page, "parent");

    const delayReason = "今晚家庭时间不方便，明天晚饭后兑现。";
    await page.goto("/parent/response");
    await page.locator('input[name="responseType"][value="delayed"]').check();
    await page.getByLabel("延期原因").fill(delayReason);
    await page.getByLabel("新兑现时间").fill("2026-05-26T20:00");
    await page.getByRole("button", { name: "保存回应" }).click();

    await expect(page).toHaveURL(/\/family\/diary\//);
    await expect(page.getByText("已延期")).toBeVisible();

    await openOrCreateWitness(page);

    await expect(page.getByText("Safe summary")).toBeVisible();
    await expect(page.getByText(delayReason)).toHaveCount(0);
    await expect(page.getByText(/ChildNote|evidence|repair/i)).toHaveCount(0);
  });

  test("pending repair opens repair case without verdict wording", async ({ page }) => {
    await completeChildContractFlow(page);
    await useRole(page, "parent");

    await page.goto("/parent/response");
    await page.locator('input[name="responseType"][value="pending_repair"]').check();
    await page
      .getByRole("textbox", { name: "给孩子的一句话" })
      .fill("这个愿望需要一起商量一下。");
    await page.getByRole("button", { name: "保存回应" }).click();

    await expect(page).toHaveURL(/\/family\/diary\//);
    await expect(page.getByText("待复盘")).toBeVisible();

    const repairCase = await prisma.repairCase.findFirst({
      where: { contractId: "seed_contract" },
    });
    expect(repairCase?.parentMessage).toContain("一起商量");
    expect(repairCase?.parentMessage).not.toMatch(/错|惩罚|裁判|责备/);
  });
});
