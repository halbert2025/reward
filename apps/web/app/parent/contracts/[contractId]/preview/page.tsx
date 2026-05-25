import Link from "next/link";
import { getContractForPreview } from "@/lib/server/contract-flow";

type Params = Promise<{
  contractId: string;
}>;

export default async function ContractPreviewPage({ params }: { params: Params }) {
  const { contractId } = await params;
  const contract = await getContractForPreview(contractId);
  const latest = contract?.versions[0];
  const task = contract?.tasks[0];

  if (!contract || !latest) {
    return (
      <main className="min-h-screen px-6 py-8 sm:px-10">
        <section className="mx-auto max-w-3xl rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h1 className="text-2xl font-semibold">Contract not found</h1>
          <Link className="mt-4 inline-flex text-sm font-semibold text-leaf" href="/">
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Contract preview
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">{latest.title}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            State: {contract.state} · Version {latest.versionNumber}
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Promise</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {latest.promiseText}
            </p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Reward</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {latest.rewardText}
            </p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5 sm:col-span-2">
            <h2 className="text-lg font-semibold">Task and evidence</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">
              {latest.taskText}
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Task state: {task?.state ?? "not_created"} · Duration:{" "}
              {task?.plannedDurationMinutes ?? 25} minutes
            </p>
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Version history</h2>
          <div className="mt-3 grid gap-2">
            {contract.versions.map((version) => (
              <div
                className="flex items-center justify-between rounded-panel border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm"
                key={version.id}
              >
                <span>Version {version.versionNumber}</span>
                <span>{version.confirmedAt ? "Confirmed" : "Waiting"}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
            href={`/child/contracts/${contract.id}/confirm`}
          >
            Open child confirmation
          </Link>
          <Link
            className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
            href={`/parent/contracts/new?contractId=${contract.id}`}
          >
            Create revised version
          </Link>
        </div>
      </section>
    </main>
  );
}
