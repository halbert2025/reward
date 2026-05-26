const baseUrlInput = process.argv[2] || process.env.PILOT_BASE_URL || process.env.APP_BASE_URL || "";

const routes = [
  { path: "/api/health", kind: "json", expectOk: true },
  { path: "/", kind: "page" },
  { path: "/auth/login", kind: "page" },
  { path: "/pilot/consent", kind: "page" },
  { path: "/feedback", kind: "page" },
  { path: "/privacy/requests", kind: "page" },
  { path: "/admin/pilot", kind: "page", allowStatuses: [200, 302, 401, 403] },
  { path: "/witness", kind: "page" },
];

function fail(message) {
  console.error(`[pilot:url-smoke] ${message}`);
  process.exit(1);
}

function normalizeBaseUrl(input) {
  const trimmed = input.trim().replace(/\/+$/, "");
  if (!trimmed) {
    fail("PILOT_BASE_URL, APP_BASE_URL, or a URL argument is required.");
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    fail("Base URL must be an absolute URL.");
  }

  const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !isLocalhost) {
    fail("Pilot smoke URL must use HTTPS unless it is localhost.");
  }

  return url.toString().replace(/\/+$/, "");
}

async function checkRoute(baseUrl, route) {
  const url = `${baseUrl}${route.path}`;
  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      "User-Agent": "RewardPilotSmoke/1.0",
    },
  });

  const allowed = route.allowStatuses ?? [200];
  const statusOk = allowed.includes(response.status);
  const result = {
    path: route.path,
    status: response.status,
    ok: statusOk,
  };

  if (!statusOk) {
    return result;
  }

  if (route.kind === "json") {
    try {
      const json = await response.json();
      result.ok = result.ok && json.ok === route.expectOk;
      result.details = {
        appEnv: json.appEnv,
        database: json.database,
        invitesPaused: json.invitesPaused,
        latencyMs: json.latencyMs,
      };
    } catch {
      result.ok = false;
      result.error = "Expected JSON response.";
    }
  }

  return result;
}

const baseUrl = normalizeBaseUrl(baseUrlInput);
const results = [];

console.log(`[pilot:url-smoke] baseUrl=${baseUrl}`);

for (const route of routes) {
  try {
    const result = await checkRoute(baseUrl, route);
    results.push(result);
    console.log(`- ${result.ok ? "PASS" : "FAIL"} ${result.path} ${result.status}`);
  } catch (error) {
    const result = {
      path: route.path,
      status: "network-error",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    results.push(result);
    console.log(`- FAIL ${result.path} ${result.status}`);
  }
}

const ok = results.every((result) => result.ok);

console.log("\n[pilot:url-smoke] summary");
console.log(JSON.stringify({ ok, baseUrl, results }, null, 2));

if (!ok) {
  process.exit(1);
}
