import { expect, test } from "@playwright/test";
import { seedDemoData } from "./helpers";

test.beforeEach(async () => {
  seedDemoData();
});

test.describe("Reward pilot auth and invite flow", () => {
  test("parent signs in, creates family, invites child, and child joins", async ({ page }) => {
    const stamp = Date.now();
    const email = `pilot-parent-${stamp}@example.com`;
    const familyName = `Pilot Family ${stamp}`;
    const childName = `Pilot Child ${stamp}`;

    await page.goto("/auth/login");
    await page.getByLabel("Parent email").fill(email);
    await page.getByRole("button", { name: "Get test code" }).click();

    await expect(page).toHaveURL(/\/auth\/verify/);
    const code = (await page.locator('input[name="code"]').inputValue()).trim();
    expect(code.length).toBeGreaterThanOrEqual(6);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/family\/new/);
    await page.getByLabel("Family name").fill(familyName);
    await page.getByRole("button", { name: "Create family" }).click();

    await expect(page).toHaveURL(/\/parent\/invites/);
    await expect(page.getByText(familyName)).toBeVisible();
    await page.getByRole("button", { name: "Generate child code" }).click();

    await expect(page).toHaveURL(/created=/);
    const inviteCode = (await page.locator("h2 + p").first().textContent())?.trim() ?? "";
    expect(inviteCode.length).toBeGreaterThanOrEqual(6);

    const childContext = await page.context().browser()?.newContext({
      baseURL: process.env.APP_BASE_URL ?? "http://127.0.0.1:3000",
    });
    if (!childContext) {
      throw new Error("Missing browser context");
    }
    const childPage = await childContext.newPage();
    await childPage.goto(`/invite/child/${inviteCode}`);
    await childPage.getByLabel("Nickname").fill(childName);
    await childPage.getByRole("button", { name: "Join family" }).click();

    await expect(childPage).toHaveURL(/\/child\/backyard/);
    await childContext.close();
  });
});
