import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = "prisma/schema.prisma";
const targetPath = process.argv[2] || "prisma/schema.postgres.prisma";

const source = readFileSync(sourcePath, "utf8");
const postgresSchema = source.replace('provider = "sqlite"', 'provider = "postgresql"');

writeFileSync(targetPath, postgresSchema);
console.log(`Wrote ${targetPath}`);
