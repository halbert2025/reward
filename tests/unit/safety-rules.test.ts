import { describe, expect, it } from "vitest";
import {
  validateEvidencePlaceholder,
  validateNeutralRepairMessage,
  validateRewardInput,
} from "../../packages/shared/src/safety-rules";

describe("MVP safety and acceptance rules", () => {
  it("blocks forbidden reward and school/payment language", () => {
    const result = validateRewardInput({
      title: "Recharge game coins",
      promiseText: "I will finish class homework",
      rewardText: "Small wish reward: recharge 100 game coins",
      taskText: "One safe task",
      evidenceText: "One reflection",
      repairText: "No repair needed",
      screenTimeMinutes: 25,
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("REWARD_FORBIDDEN");
  });

  it("checks promise and repair fields with the same reward safety rules", () => {
    const result = validateRewardInput({
      title: "Small wish",
      promiseText: "Get first place in class ranking",
      rewardText: "Small wish reward: family craft",
      taskText: "One safe task",
      evidenceText: "One reflection",
      repairText: "No payment wallet",
      screenTimeMinutes: 25,
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("REWARD_FORBIDDEN");
  });

  it("allows small companionship rewards", () => {
    const result = validateRewardInput({
      title: "一起做一个小手工",
      rewardText: "Small wish reward: 一起做一个小手工",
      taskText: "完成一次 25 分钟愿望番茄钟",
      evidenceText: "一句复盘，照片可跳过",
      screenTimeMinutes: 25,
    });

    expect(result.ok).toBe(true);
  });

  it("blocks evidence placeholders with private child data", () => {
    const result = validateEvidencePlaceholder("school uniform selfie with address");

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("EVIDENCE_PRIVACY_RISK");
  });

  it("blocks real photo upload indicators in pilot evidence placeholders", () => {
    const result = validateEvidencePlaceholder("https://example.com/photo.jpg");

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("EVIDENCE_PRIVACY_RISK");
  });

  it("limits evidence placeholder length", () => {
    const result = validateEvidencePlaceholder("a".repeat(81));

    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("EVIDENCE_PLACEHOLDER_TOO_LONG");
  });

  it("keeps repair wording neutral", () => {
    expect(validateNeutralRepairMessage("这个愿望需要一起商量一下").ok).toBe(true);

    const result = validateNeutralRepairMessage("孩子错了，需要惩罚");
    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.code).toBe("REPAIR_MESSAGE_NOT_NEUTRAL");
  });
});
