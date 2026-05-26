import { describe, expect, it } from "vitest";
import { validateRewardEnv } from "../../scripts/validate-env.mjs";

const basePilotEnv = {
  APP_ENV: "pilot",
  APP_BASE_URL: "https://pilot.example.com",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/reward_pilot",
  AUTH_SECRET: "a".repeat(32),
  REWARD_ADMIN_EMAILS: "admin@example.com",
  REWARD_ENABLE_MOCK_ROLE_SWITCHER: "false",
  STORAGE_PROVIDER: "mock",
  AI_PROVIDER_MODE: "mock",
  ALLOW_DEMO_SEED: "false",
  NOTIFICATION_MODE: "in_app",
  REWARD_ENABLE_PAYMENTS: "false",
  REWARD_PILOT_OPS_OWNER: "Pilot Ops <ops@example.com>",
  REWARD_DATA_REQUEST_OWNER: "Data Owner <data@example.com>",
  REWARD_SAFETY_REVIEW_OWNER: "Safety Owner <safety@example.com>",
  REWARD_ROLLBACK_OWNER: "Rollback Owner <rollback@example.com>",
};

describe("pilot environment validation", () => {
  it("accepts a locked-down pilot environment", () => {
    const result = validateRewardEnv(basePilotEnv);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("blocks non-https pilot URLs and missing admin allowlist", () => {
    const result = validateRewardEnv({
      ...basePilotEnv,
      APP_BASE_URL: "http://pilot.example.com",
      REWARD_ADMIN_EMAILS: "",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("pilot/production APP_BASE_URL must use HTTPS.");
    expect(result.errors).toContain("REWARD_ADMIN_EMAILS is required for pilot/production admin access.");
  });

  it("requires named pilot operations owners", () => {
    const result = validateRewardEnv({
      ...basePilotEnv,
      REWARD_PILOT_OPS_OWNER: "",
      REWARD_DATA_REQUEST_OWNER: "",
      REWARD_SAFETY_REVIEW_OWNER: "",
      REWARD_ROLLBACK_OWNER: "",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("REWARD_PILOT_OPS_OWNER is required for pilot/production operations.");
    expect(result.errors).toContain("REWARD_DATA_REQUEST_OWNER is required for pilot/production operations.");
    expect(result.errors).toContain("REWARD_SAFETY_REVIEW_OWNER is required for pilot/production operations.");
    expect(result.errors).toContain("REWARD_ROLLBACK_OWNER is required for pilot/production operations.");
  });

  it("blocks demo, push, payment, mock role, and sqlite settings in pilot", () => {
    const result = validateRewardEnv({
      ...basePilotEnv,
      DATABASE_URL: "file:./dev.db",
      REWARD_ENABLE_MOCK_ROLE_SWITCHER: "true",
      ALLOW_DEMO_SEED: "true",
      NOTIFICATION_MODE: "push",
      REWARD_ENABLE_PAYMENTS: "true",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("pilot/production DATABASE_URL must not use SQLite file: URLs.");
    expect(result.errors).toContain("pilot/production DATABASE_URL must use PostgreSQL.");
    expect(result.errors).toContain("REWARD_ENABLE_MOCK_ROLE_SWITCHER/MOCK_AUTH_ENABLED must not be true for pilot/production.");
    expect(result.errors).toContain("ALLOW_DEMO_SEED must not be true for pilot/production.");
    expect(result.errors).toContain("NOTIFICATION_MODE must remain in_app for the first pilot.");
    expect(result.errors).toContain("REWARD_ENABLE_PAYMENTS/ENABLE_PAYMENTS must not be true for pilot/production.");
  });
});
