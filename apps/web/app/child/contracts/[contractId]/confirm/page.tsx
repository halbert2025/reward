import Link from "next/link";
import {
  childConfirmFirstContract,
  getChildConfirmContract,
} from "@/lib/server/contract-flow";

type Params = Promise<{
  contractId: string;
}>;

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function ChildConfirmPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { contractId } = await params;
  const query = await searchParams;
  const contract = await getChildConfirmContract(contractId);
  const latest = contract?.versions[0];

  if (!contract || !latest) {
    return (
      <main className="min-h-screen px-6 py-8 sm:px-10">
        <section className="mx-auto max-w-3xl rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h1 className="text-2xl font-semibold">Promise not available</h1>
          <Link className="mt-4 inline-flex text-sm font-semibold text-leaf" href="/">
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const isActive = contract.state === "active" || query.status === "active";

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Child confirmation
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">{latest.title}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Review the exact version before the 25-minute promise starts.
          </p>
        </header>

        {query.error === "stale" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This promise changed or is no longer waiting for confirmation.
          </p>
        ) : null}
        {query.error === "permission" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This promise can only be confirmed from the child role.
          </p>
        ) : null}

        {isActive ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Promise active</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              The promise is ready for the child pomodoro flow.
            </p>
          </section>
        ) : (
          <form
            action={childConfirmFirstContract}
            className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <input name="contractId" type="hidden" value={contract.id} />

            <section>
              <h2 className="text-lg font-semibold">Promise</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {latest.promiseText}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Reward</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {latest.rewardText}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Task</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">
                {latest.taskText}
              </p>
            </section>

            <label className="flex gap-3 rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6">
              <input className="mt-1 size-4" required type="checkbox" />
              <span>
                I understand this version and can ask to revisit it if it feels unfair.
              </span>
            </label>

            <button
              className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Confirm and activate
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
