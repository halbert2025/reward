import Link from "next/link";
import { createWitnessInvite, getWitnessInviteContext } from "@/lib/server/witness-flow";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function ParentWitnessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const contract = await getWitnessInviteContext();
  const witness = contract?.witnesses[0];

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Memorial witness
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            One free memory witness.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            只见证，不裁判。Witness sees only a safe contract summary and memory card.
          </p>
        </header>

        {params.error === "limit" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            MVP includes one free memorial witness for this contract.
          </p>
        ) : null}

        {!contract ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">No memory ready yet</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Generate a diary first, then invite one memorial witness.
            </p>
          </section>
        ) : (
          <section className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6">
              <p>Wish: {contract.wish?.title ?? "Small family wish"}</p>
              <p>Invite link: http://localhost:3000/witness</p>
              <p>Status: {witness?.status ?? "not invited"}</p>
              <p>Blessing: {witness?.blessingMessage ?? "None yet"}</p>
            </div>

            {!witness ? (
              <form action={createWitnessInvite} className="grid gap-3">
                <input name="contractId" type="hidden" value={contract.id} />
                <label className="grid gap-2 text-sm font-semibold">
                  Witness display name
                  <input
                    className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                    name="displayName"
                    placeholder="Grandma, uncle, family friend..."
                  />
                </label>
                <button
                  className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                  type="submit"
                >
                  Generate witness link
                </button>
              </form>
            ) : (
              <Link
                className="inline-flex rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                href="/witness"
              >
                Open witness view
              </Link>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
