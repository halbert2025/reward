import Link from "next/link";
import { createPilotFamily, getParentFamilies } from "@/lib/server/family-invites";

type SearchParams = Promise<{
  error?: string;
}>;

export default async function NewFamilyPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const families = await getParentFamilies();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-2xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Pilot family
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Create a test family</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            This creates a real pilot family for the current signed-in parent.
          </p>
        </header>

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please sign in as a parent and enter a family name with at least two characters.
          </p>
        ) : null}

        <form action={createPilotFamily} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Family name
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="familyName"
              placeholder="Lin family"
              required
            />
          </label>
          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Create family
          </button>
        </form>

        {families.length > 0 ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Your families</h2>
            <div className="mt-3 grid gap-2 text-sm">
              {families.map((family) => (
                <Link className="font-semibold text-leaf" href="/parent/invites" key={family.id}>
                  {family.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
