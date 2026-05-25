import Link from "next/link";
import { requestParentLogin } from "@/lib/server/auth/auth-actions";

type SearchParams = Promise<{
  error?: string;
}>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Pilot login
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Parent sign in</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            For the first pilot, Reward uses a lightweight test code. Email delivery can
            be connected later.
          </p>
        </header>

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please enter a valid parent email.
          </p>
        ) : null}

        <form action={requestParentLogin} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Parent email
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="email"
              placeholder="parent@example.com"
              required
              type="email"
            />
          </label>
          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Get test code
          </button>
        </form>
      </section>
    </main>
  );
}
