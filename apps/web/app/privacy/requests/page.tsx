import Link from "next/link";
import { createPilotDataRequest, getPilotDataRequestContext } from "@/lib/server/pilot-consent";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

const requestTypes = [
  ["export", "Export family-safe data"],
  ["deletion", "Request deletion review"],
  ["seal", "Request data sealing"],
  ["exit_pilot", "Exit pilot"],
] as const;

export default async function PrivacyRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { families, requests } = await getPilotDataRequestContext();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Privacy requests
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Data handling request</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Pilot data export, deletion review, sealing, and exit requests are handled manually. This page records the request and keeps a status trail.
          </p>
        </header>

        {params.status === "requested" ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
            Request recorded. The pilot team should review it manually.
          </p>
        ) : null}

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please choose a valid request type, family, and write at least eight characters.
          </p>
        ) : null}

        <form action={createPilotDataRequest} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Family
            <select className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm" name="familyId">
              <option value="">No family yet / account-level request</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Request type
            <select className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm" name="type" required>
              {requestTypes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Request details
            <textarea
              className="min-h-28 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              maxLength={500}
              minLength={8}
              name="requestSummary"
              placeholder="Briefly describe what you need the pilot team to handle."
              required
            />
          </label>

          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Submit request
          </button>
        </form>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Recent requests</h2>
          {requests.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">No requests yet.</p>
          ) : (
            <div className="mt-3 grid gap-3 text-sm">
              {requests.map((request) => (
                <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-3" key={request.id}>
                  <p className="font-semibold">{request.type}</p>
                  <p className="text-[var(--muted)]">Status: {request.status}</p>
                  <p className="text-[var(--muted)]">Family: {request.family?.name ?? "Account-level"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
