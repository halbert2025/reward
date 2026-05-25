import { PrismaClient } from "@prisma/client";
import { validateRewardEnv } from "./validate-env.mjs";

const envResult = validateRewardEnv();

if (!envResult.ok) {
  console.error("Environment validation failed:");
  for (const error of envResult.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

for (const warning of envResult.warnings) {
  console.warn(`Warning: ${warning}`);
}

const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log(
    JSON.stringify(
      {
        ok: true,
        appEnv: envResult.appEnv,
        database: envResult.databaseUrlKind,
        storageProvider: envResult.storageProvider,
        aiProviderMode: envResult.aiProviderMode,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error("Database predeploy check failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
