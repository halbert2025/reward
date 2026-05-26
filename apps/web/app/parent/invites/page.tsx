import Link from "next/link";
import { createChildInvite, getParentFamilies } from "@/lib/server/family-invites";

type SearchParams = Promise<{
  created?: string;
  error?: string;
}>;

export default async function ParentInvitesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const families = await getParentFamilies();
  const family = families[0];

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Family invites
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Invite your child</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Children join with a short code and nickname. They do not need email or phone.
          </p>
        </header>

        {params.created ? (
          <section className="rounded-panel border border-leaf bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Child invite code created</h2>
            <p className="mt-2 text-3xl font-semibold tracking-[0.08em]">{params.created}</p>
            <Link className="mt-4 inline-flex text-sm font-semibold text-leaf" href={`/invite/child/${params.created}`}>
              Open child join page
            </Link>
          </section>
        ) : null}

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error === "paused"
              ? "New child invites are temporarily paused while the pilot team checks the system."
              : "Could not create invite. Please sign in as the parent of this family."}
          </p>
        ) : null}

        {!family ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">No pilot family yet</h2>
            <Link className="mt-3 inline-flex rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" href="/family/new">
              Create family
            </Link>
          </section>
        ) : (
          <form action={createChildInvite} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <input name="familyId" type="hidden" value={family.id} />
            <div>
              <h2 className="text-lg font-semibold">{family.name}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Active members: {family.members.length}
              </p>
            </div>
            <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
              Generate child code
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
