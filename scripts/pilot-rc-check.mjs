import { spawnSync } from "node:child_process";

const steps = [
  ["env:check", "npm run env:check"],
  ["predeploy:check", "npm run predeploy:check"],
  ["test", "npm test"],
  ["typecheck", "npm run typecheck"],
  ["build", "npm run build"],
];

function runStep(name, command) {
  console.log(`\n[pilot:rc-check] ${name}`);
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  if (result.error) {
    console.error(`[pilot:rc-check] ${name} failed to start: ${result.error.message}`);
    return false;
  }

  if (result.status !== 0) {
    console.error(`[pilot:rc-check] ${name} failed with exit code ${result.status}.`);
    return false;
  }

  return true;
}

const startedAt = Date.now();
const results = [];

for (const [name, command] of steps) {
  const ok = runStep(name, command);
  results.push({ name, ok });

  if (!ok) {
    break;
  }
}

const ok = results.every((result) => result.ok) && results.length === steps.length;
const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log("\n[pilot:rc-check] summary");
for (const result of results) {
  console.log(`- ${result.ok ? "PASS" : "FAIL"} ${result.name}`);
}

if (ok) {
  console.log(`[pilot:rc-check] internal RC rehearsal checks passed in ${durationSeconds}s.`);
} else {
  console.error(`[pilot:rc-check] checks failed after ${durationSeconds}s.`);
  process.exit(1);
}
