import Link from "next/link";
import {
  createOrReviseFirstContract,
  getFirstContractDraftContext,
} from "@/lib/server/contract-flow";

type SearchParams = Promise<{
  contractId?: string;
  error?: string;
}>;

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { family, child, wishes } = await getFirstContractDraftContext();
  const firstWish = wishes[0];

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            First small promise
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            Create one 25-minute agreement.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Keep the first contract small: one child-owned focus session, one sentence
            of reflection, and one safe wish from the family pool.
          </p>
        </header>

        {!family?.principlesConfirmedAt ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Principles required</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Family principles must be confirmed before creating a formal promise.
            </p>
            <Link
              className="mt-4 inline-flex rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
              href="/parent/onboarding?step=principles"
            >
              Continue onboarding
            </Link>
          </section>
        ) : (
          <form
            action={createOrReviseFirstContract}
            className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <input name="contractId" type="hidden" value={params.contractId ?? ""} />
            <input name="familyId" type="hidden" value={family.id} />

            {params.error === "contract" ? (
              <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Choose a safe family wish and keep this first promise away from school,
                merchants, payments, or institution tasks.
              </p>
            ) : null}

            <label className="grid gap-2 text-sm font-semibold">
              Wish
              <select
                className="rounded-panel border border-[var(--line)] bg-white px-3 py-2 text-sm"
                defaultValue={firstWish?.id}
                name="wishId"
                required
              >
                {wishes.map((wish) => (
                  <option key={wish.id} value={wish.id}>
                    {wish.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Title
              <input
                className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                defaultValue="First 25-minute promise"
                name="title"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Promise
              <textarea
                className="min-h-24 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                defaultValue={`I will complete one focused 25-minute wish pomodoro with ${child?.displayName ?? "the child"}.`}
                name="promiseText"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Task
              <input
                className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                defaultValue="Complete 1 focused 25-minute wish pomodoro."
                name="taskText"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Evidence
              <input
                className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                defaultValue="Pomodoro completion plus one reflection sentence."
                name="evidenceText"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Repair
              <input
                className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                defaultValue="The child may restart once."
                name="repairText"
              />
            </label>

            <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
              Fulfillment is expected today or within 24 hours. This first flow does
              not support large wishes, payment, merchants, or school/institution use.
            </div>

            <button
              className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Create preview
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
