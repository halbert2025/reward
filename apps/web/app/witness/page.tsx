import Link from "next/link";
import { getWitnessMemory, sendWitnessBlessing } from "@/lib/server/witness-flow";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function WitnessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const witness = await getWitnessMemory();
  const diary = witness?.contract.diaryEntries[0];
  const version = witness?.contract.versions[0];

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Witness view
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            只见证，不裁判。
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            这里只展示约定摘要和完成纪念。见证人不会看到孩子的小纸条、证据照片或家庭争议。
          </p>
        </header>

        {!witness || !diary ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">No witness memory yet</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Ask the family to generate a memorial witness link after diary creation.
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
              <h2 className="text-lg font-semibold">Safe summary</h2>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted)]">
                <p>Wish: {witness.contract.wish?.title ?? "Small family wish"}</p>
                <p>Promise: {version?.title ?? diary.title}</p>
                <p>Memory: {diary.title}</p>
                <p>Quiet cat visit: included</p>
              </div>
            </section>

            {params.status === "sent" ? (
              <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
                Blessing saved.
              </p>
            ) : null}

            <form
              action={sendWitnessBlessing}
              className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5"
            >
              <input name="witnessId" type="hidden" value={witness.id} />
              <label className="grid gap-2 text-sm font-semibold">
                One blessing
                <textarea
                  className="min-h-24 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                  name="blessing"
                  placeholder="Send one warm sentence."
                  required
                />
              </label>
              <button
                className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                Send blessing
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
