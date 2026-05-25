import Link from "next/link";
import { joinFamilyWithChildInvite } from "@/lib/server/family-invites";

type Params = Promise<{
  code: string;
}>;

type SearchParams = Promise<{
  error?: string;
}>;

export default async function ChildInvitePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { code } = await params;
  const query = await searchParams;

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Child invite
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Join your family</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Use a nickname. You do not need email or phone for this pilot.
          </p>
        </header>

        {query.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This invite code is invalid, expired, or already used.
          </p>
        ) : null}

        <form action={joinFamilyWithChildInvite} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Invite code
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm uppercase"
              defaultValue={code}
              name="code"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Nickname
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="nickname"
              placeholder="Your nickname"
              required
            />
          </label>
          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Join family
          </button>
        </form>
      </section>
    </main>
  );
}
