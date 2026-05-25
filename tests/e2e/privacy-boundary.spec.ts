import { test, expect } from "@playwright/test";

test.skip(true, "Prompt 15 initializes the app shell; real E2E steps are enabled after feature routes exist.");

test.describe("Reward MVP privacy boundaries", () => {
  test("child can create private ChildNote and parent cannot view it", async ({ page }) => {
    await page.goto("/");

    // TODO: Child creates ChildNote from P08 or note surface.
    // TODO: Child lists own ChildNotes.
    // TODO: Parent calls parent ChildNote route.
    // TODO: Expect CHILD_NOTE_PRIVATE and no body in response.
    // TODO: Assert no auto-alert notification is created.

    await expect(page).toHaveURL(/.*/);
  });

  test("witness sees only limited memory and no evidence, ChildNote, amount, or repair details", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange generated diary and witness invite.
    // TODO: Witness accepts invite.
    // TODO: Assert response is WitnessMemoryView only.
    // TODO: Assert evidence, ChildNote, amount-like fields, and repair details are absent.

    await expect(page).toHaveURL(/.*/);
  });

  test("Kimi AI suggestion endpoint never receives ChildNote and never changes business state", async ({ page }) => {
    await page.goto("/");

    // TODO: Arrange ChildNote and AI_PROVIDER=mock or kimi.
    // TODO: Request parent_message_tone suggestion.
    // TODO: Assert request payload excludes ChildNote.body.
    // TODO: Assert no Contract, Fulfillment, RepairCase, Notification state changes.
    // TODO: Assert AuditLog includes ai_suggestion_requested only.

    await expect(page).toHaveURL(/.*/);
  });
});
