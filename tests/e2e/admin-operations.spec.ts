import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";
import { seedDemoData, useRole } from "./helpers";

const prisma = new PrismaClient();
const adminEmail = "admin@example.com";

test.beforeEach(async () => {
  seedDemoData();
});

test.afterAll(async () => {
  await prisma.$disconnect();
});

async function signInAdmin(page: import("@playwright/test").Page) {
  await page.goto("/auth/login");
  await page.getByLabel("Parent email").fill(adminEmail);
  await page.getByRole("button", { name: "Get test code" }).click();
  const code = (await page.locator('input[name="code"]').inputValue()).trim();
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/pilot/);
  expect(code.length).toBeGreaterThanOrEqual(6);
}

function dataRequestRow(page: import("@playwright/test").Page, requestId: string) {
  return page.locator(`form:has(input[name="requestId"][value="${requestId}"])`);
}

test.describe("Reward pilot admin operations", () => {
  test("non-admin users cannot access the pilot operations console", async ({ page }) => {
    await useRole(page, "parent");
    await page.goto("/admin/pilot");
    await expect(page).toHaveURL(/\/auth\/login\?error=admin/);
  });

  test("admin updates family-linked data request with AuditLog", async ({ page }) => {
    const request = await prisma.dataRequest.create({
      data: {
        familyId: "seed_family",
        requestedById: "seed_parent",
        type: "export",
        requesterRole: "parent",
        requestSummary: "Please export the seed family pilot data.",
      },
    });

    await signInAdmin(page);
    const row = dataRequestRow(page, request.id);
    await row.getByRole("combobox").selectOption("completed");
    await row.getByPlaceholder("Handler note").fill("Export completed manually.");
    await row.getByRole("button", { name: "Update" }).click();
    await expect(page).toHaveURL(/status=data-request-updated/);

    const audit = await prisma.auditLog.findFirst({
      where: {
        entityId: request.id,
        eventName: "data_request_status_updated",
      },
    });
    expect(audit).toBeTruthy();
  });

  test("admin account-level data request update records OperationalEvent", async ({ page }) => {
    const request = await prisma.dataRequest.create({
      data: {
        requestedById: "seed_parent",
        type: "deletion",
        requesterRole: "parent",
        requestSummary: "Please review account-level deletion request.",
      },
    });

    await signInAdmin(page);
    const row = dataRequestRow(page, request.id);
    await row.getByRole("combobox").selectOption("rejected_with_reason");
    await row.getByPlaceholder("Handler note").fill("Identity verification needed.");
    await row.getByRole("button", { name: "Update" }).click();
    await expect(page).toHaveURL(/status=data-request-updated/);

    const events = await prisma.operationalEvent.findMany({
      where: {
        eventName: "account_data_request_status_updated",
      },
    });
    const event = events.find((item) => {
      const metadata = item.metadataJson as { requestId?: string } | null;
      return metadata?.requestId === request.id;
    });
    expect(event).toBeTruthy();
  });

  test("admin terminal statuses require handler or reviewer notes", async ({ page }) => {
    const request = await prisma.dataRequest.create({
      data: {
        familyId: "seed_family",
        requestedById: "seed_parent",
        type: "seal",
        requesterRole: "parent",
        requestSummary: "Please seal the seed family records.",
      },
    });

    await signInAdmin(page);
    const row = dataRequestRow(page, request.id);
    await row.getByRole("combobox").selectOption("completed");
    await row.getByRole("button", { name: "Update" }).click();
    await expect(page).toHaveURL(/error=handler-note/);
  });
});
