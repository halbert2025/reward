import Link from "next/link";
import {
  getPilotOperationsDashboard,
  updateDataRequestStatus,
  updateFeedbackStatus,
  updateRiskSignalStatus,
} from "@/lib/server/pilot-operations";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function PilotAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { families, consents, dataRequests, feedback, riskSignals } =
    await getPilotOperationsDashboard();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-6xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Pilot operations
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Admin review console</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Restricted pilot view for family readiness, consent status, data requests, feedback, and manual safety review.
          </p>
        </header>

        {params.status ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
            Updated: {params.status}
          </p>
        ) : null}
        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please check status and handler notes before updating.
          </p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">Families</p>
            <p className="mt-2 text-3xl font-semibold">{families.length}</p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">Consents</p>
            <p className="mt-2 text-3xl font-semibold">{consents.length}</p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">Open requests</p>
            <p className="mt-2 text-3xl font-semibold">
              {dataRequests.filter((item) => item.status !== "completed").length}
            </p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">Risk queue</p>
            <p className="mt-2 text-3xl font-semibold">
              {riskSignals.filter((item) => item.status === "queued").length}
            </p>
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Pilot families</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {families.map((family) => (
              <div className="grid gap-2 rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 md:grid-cols-[1fr_auto] md:items-center" key={family.id}>
                <div>
                  <p className="font-semibold">{family.name}</p>
                  <p className="text-[var(--muted)]">
                    members {family.members.length} · contracts {family._count.contracts} · invites {family._count.invites} · requests {family._count.dataRequests} · feedback {family._count.pilotFeedback} · risks {family._count.riskSignals}
                  </p>
                </div>
                <p className="text-[var(--muted)]">{family.trustState}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Data requests</h2>
          <div className="mt-4 grid gap-3">
            {dataRequests.map((request) => (
              <form action={updateDataRequestStatus} className="grid gap-3 rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 text-sm md:grid-cols-[1fr_160px_1fr_auto]" key={request.id}>
                <input name="requestId" type="hidden" value={request.id} />
                <div>
                  <p className="font-semibold">{request.type}</p>
                  <p className="text-[var(--muted)]">{request.family?.name ?? "Account-level"} · {request.requestedBy.displayName}</p>
                  <p className="mt-1 text-[var(--muted)]">{request.requestSummary}</p>
                </div>
                <select className="rounded-panel border border-[var(--line)] px-3 py-2" defaultValue={request.status} name="status">
                  <option value="requested">requested</option>
                  <option value="in_review">in_review</option>
                  <option value="completed">completed</option>
                  <option value="rejected_with_reason">rejected_with_reason</option>
                </select>
                <input className="rounded-panel border border-[var(--line)] px-3 py-2" name="handlerNote" placeholder="Handler note" />
                <button className="rounded-panel bg-ink px-4 py-2 font-semibold text-white" type="submit">Update</button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Feedback</h2>
          <div className="mt-4 grid gap-3">
            {feedback.map((item) => (
              <form action={updateFeedbackStatus} className="grid gap-3 rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 text-sm md:grid-cols-[1fr_120px_1fr_auto]" key={item.id}>
                <input name="feedbackId" type="hidden" value={item.id} />
                <div>
                  <p className="font-semibold">{item.type} · {item.role}</p>
                  <p className="text-[var(--muted)]">{item.family?.name ?? "Account-level"}</p>
                  <p className="mt-1 text-[var(--muted)]">{item.message}</p>
                </div>
                <select className="rounded-panel border border-[var(--line)] px-3 py-2" defaultValue={item.status} name="status">
                  <option value="new">new</option>
                  <option value="triaged">triaged</option>
                  <option value="closed">closed</option>
                </select>
                <input className="rounded-panel border border-[var(--line)] px-3 py-2" name="handlerNote" placeholder="Handler note" />
                <button className="rounded-panel bg-ink px-4 py-2 font-semibold text-white" type="submit">Update</button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Manual risk review</h2>
          <div className="mt-4 grid gap-3">
            {riskSignals.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No risk signals queued.</p>
            ) : null}
            {riskSignals.map((signal) => (
              <form action={updateRiskSignalStatus} className="grid gap-3 rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 text-sm md:grid-cols-[1fr_120px_1fr_auto]" key={signal.id}>
                <input name="riskSignalId" type="hidden" value={signal.id} />
                <div>
                  <p className="font-semibold">{signal.level} · {signal.sourceType}</p>
                  <p className="text-[var(--muted)]">{signal.family?.name ?? "Account-level"}</p>
                  <p className="mt-1 text-[var(--muted)]">{signal.summary}</p>
                </div>
                <select className="rounded-panel border border-[var(--line)] px-3 py-2" defaultValue={signal.status} name="status">
                  <option value="queued">queued</option>
                  <option value="in_review">in_review</option>
                  <option value="resolved">resolved</option>
                  <option value="dismissed">dismissed</option>
                </select>
                <input className="rounded-panel border border-[var(--line)] px-3 py-2" name="reviewerNote" placeholder="Reviewer note" />
                <button className="rounded-panel bg-ink px-4 py-2 font-semibold text-white" type="submit">Update</button>
              </form>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
