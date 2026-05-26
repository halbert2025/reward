import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

function loadDotEnv(path = ".env") {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [name, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
    if (!process.env[name]) {
      process.env[name] = value;
    }
  }
}

loadDotEnv();

const APP_ENVS = new Set(["local", "development", "test", "pilot", "production"]);
const STORAGE_PROVIDERS = new Set(["mock", "local", "s3", "r2"]);
const AI_PROVIDER_MODES = new Set(["mock", "template", "kimi"]);
const REQUIRED_REMOTE_OWNER_VARS = [
  "REWARD_PILOT_OPS_OWNER",
  "REWARD_DATA_REQUEST_OWNER",
  "REWARD_SAFETY_REVIEW_OWNER",
  "REWARD_ROLLBACK_OWNER",
];

function readEnv(name) {
  return process.env[name]?.trim() ?? "";
}

function isRemoteEnv(appEnv) {
  return appEnv === "pilot" || appEnv === "production";
}

function validateUrl(name, value, errors) {
  try {
    new URL(value);
  } catch {
    errors.push(`${name} must be an absolute URL.`);
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateRewardEnv(env = process.env) {
  const appEnv = (env.APP_ENV || env.NODE_ENV || "local").trim();
  const storageProvider = (env.STORAGE_PROVIDER || env.EVIDENCE_STORAGE_MODE || "mock").trim();
  const aiProviderMode = (env.AI_PROVIDER_MODE || env.AI_MODE || env.AI_PROVIDER || "mock").trim();
  const databaseUrl = (env.DATABASE_URL || "").trim();
  const authSecret = (env.AUTH_SECRET || "").trim();
  const appBaseUrl = (env.APP_BASE_URL || "").trim();
  const mockSwitcher = (env.REWARD_ENABLE_MOCK_ROLE_SWITCHER || env.MOCK_AUTH_ENABLED || "").trim();
  const adminEmails = (env.REWARD_ADMIN_EMAILS || "").trim();
  const allowDemoSeed = (env.ALLOW_DEMO_SEED || "").trim();
  const notificationMode = (env.NOTIFICATION_MODE || "in_app").trim();
  const paymentsEnabled = (env.REWARD_ENABLE_PAYMENTS || env.ENABLE_PAYMENTS || "").trim();

  const errors = [];
  const warnings = [];

  if (!APP_ENVS.has(appEnv)) {
    errors.push(`APP_ENV must be one of ${Array.from(APP_ENVS).join(", ")}.`);
  }

  if (!databaseUrl) {
    errors.push("DATABASE_URL is required.");
  }

  if (!appBaseUrl) {
    errors.push("APP_BASE_URL is required.");
  } else {
    validateUrl("APP_BASE_URL", appBaseUrl, errors);
  }

  if (!STORAGE_PROVIDERS.has(storageProvider)) {
    errors.push(`STORAGE_PROVIDER must be one of ${Array.from(STORAGE_PROVIDERS).join(", ")}.`);
  }

  if (!AI_PROVIDER_MODES.has(aiProviderMode)) {
    errors.push(`AI_PROVIDER_MODE must be one of ${Array.from(AI_PROVIDER_MODES).join(", ")}.`);
  }

  if (isRemoteEnv(appEnv)) {
    if (!authSecret || authSecret.length < 32) {
      errors.push("AUTH_SECRET must be set to at least 32 characters for pilot/production.");
    }

    if (!isHttpsUrl(appBaseUrl)) {
      errors.push("pilot/production APP_BASE_URL must use HTTPS.");
    }

    if (!adminEmails) {
      errors.push("REWARD_ADMIN_EMAILS is required for pilot/production admin access.");
    }

    for (const ownerVar of REQUIRED_REMOTE_OWNER_VARS) {
      if (!(env[ownerVar] || "").trim()) {
        errors.push(`${ownerVar} is required for pilot/production operations.`);
      }
    }

    if (allowDemoSeed === "true") {
      errors.push("ALLOW_DEMO_SEED must not be true for pilot/production.");
    }

    if (databaseUrl.startsWith("file:")) {
      errors.push("pilot/production DATABASE_URL must not use SQLite file: URLs.");
    }

    if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
      errors.push("pilot/production DATABASE_URL must use PostgreSQL.");
    }

    if (mockSwitcher === "true") {
      errors.push("REWARD_ENABLE_MOCK_ROLE_SWITCHER/MOCK_AUTH_ENABLED must not be true for pilot/production.");
    }

    if (notificationMode !== "in_app") {
      errors.push("NOTIFICATION_MODE must remain in_app for the first pilot.");
    }

    if (paymentsEnabled === "true") {
      errors.push("REWARD_ENABLE_PAYMENTS/ENABLE_PAYMENTS must not be true for pilot/production.");
    }

    if (storageProvider !== "mock") {
      warnings.push("Non-mock storage requires evidence policy, EXIF stripping, and deletion workflow review.");
    }

    if (aiProviderMode === "kimi") {
      warnings.push("Kimi mode requires separate AI consent, redaction, kill switch, and fallback review.");
    }
  }

  if (!isRemoteEnv(appEnv) && databaseUrl.startsWith("postgres")) {
    warnings.push("Local development is configured against PostgreSQL; keep demo seed separate from real data.");
  }

  return {
    ok: errors.length === 0,
    appEnv,
    storageProvider,
    aiProviderMode,
    notificationMode,
    databaseUrlKind: databaseUrl.startsWith("file:")
      ? "sqlite"
      : databaseUrl.startsWith("postgres")
        ? "postgresql"
        : databaseUrl
          ? "other"
          : "missing",
    errors,
    warnings,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = validateRewardEnv();
  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}
