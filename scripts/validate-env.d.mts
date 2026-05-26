export interface RewardEnvValidationResult {
  ok: boolean;
  appEnv: string;
  storageProvider: string;
  aiProviderMode: string;
  notificationMode: string;
  databaseUrlKind: "sqlite" | "postgresql" | "other" | "missing";
  errors: string[];
  warnings: string[];
}

export function validateRewardEnv(env?: NodeJS.ProcessEnv | Record<string, string | undefined>): RewardEnvValidationResult;
