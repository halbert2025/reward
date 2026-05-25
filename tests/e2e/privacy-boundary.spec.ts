import { expect, test } from "@playwright/test";
import { completeChildContractFlow, seedDemoData, useRole } from "./helpers";

test.beforeEach(async () => {
  seedDemoData();
});

test.describe("Reward MVP privacy boundaries", () => {
  test("child can create private ChildNote and parent cannot view it", async ({ page }) => {
    const privateNote = `我想把这句话先留给自己 ${Date.now()}。`;
    await useRole(page, "child");

    await page.goto("/child/notes");
    await page.getByRole("textbox", { name: "Note" }).fill(privateNote);
    await page.getByRole("button", { name: "Save private note" }).click();
    await expect(page.getByText(privateNote).first()).toBeVisible();

    await useRole(page, "parent");
    await page.goto("/");
    await expect(page.getByText(privateNote)).toHaveCount(0);
    await expect(page.getByText("No ChildNote content visible for this role.")).toBeVisible();
  });

  test("witness sees only limited memory and no evidence, ChildNote, amount, or repair details", async ({
    page,
  }) => {
    await completeChildContractFlow(page);
    await useRole(page, "parent");
    await page.goto("/parent/response");
    await page.getByRole("textbox", { name: "给孩子的一句话" }).fill("谢谢你把这次努力记录下来。");
    await page.getByRole("button", { name: "保存回应" }).click();

    await page.goto("/parent/witness");
    const witnessName = page.getByLabel("Witness display name");
    if ((await witnessName.count()) > 0) {
      await witnessName.fill("Grandma");
      await page.getByRole("button", { name: "Generate witness link" }).click();
    }

    await useRole(page, "witness");
    await page.goto("/witness");
    await expect(page.getByText("Safe summary")).toBeVisible();
    await expect(page.getByText("Quiet cat visit: included")).toBeVisible();
    await expect(page.getByText(/private note|ChildNote|reflection|evidence|amount|repair/i)).toHaveCount(0);
  });

  test.skip("Kimi AI suggestion endpoint boundary is documented but no runtime endpoint exists in MVP", async () => {
    // MVP keeps Kimi as a documented adapter boundary only.
  });
});
