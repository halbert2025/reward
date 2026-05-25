import Link from "next/link";
import { verifyParentLogin } from "@/lib/server/auth/auth-actions";

type SearchParams = Promise<{
  code?: string;
  email?: string;
  error?: string;
}>;

export default async function VerifyPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const email = params.email ?? "";
  const code = params.code ?? "";

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/auth/login">
          Back to login
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Verify test code
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Complete sign in</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            During pilot setup, the code is shown here so the flow can be tested before
            email delivery is connected.
          </p>
        </header>

        {code ? (
          <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm">
            Test code: <span className="font-semibold">{code}</span>
          </div>
        ) : null}

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This code is invalid or expired.
          </p>
        ) : null}

        <form action={verifyParentLogin} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              defaultValue={email}
              name="email"
              required
              type="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Test code
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm uppercase"
              defaultValue={code}
              name="code"
              required
            />
          </label>
          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
