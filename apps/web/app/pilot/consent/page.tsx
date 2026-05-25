import Link from "next/link";
import {
  CHILD_NOTICE,
  GUARDIAN_NOTICE,
  PILOT_CONSENT_VERSION,
  acceptGuardianPilotConsent,
  getGuardianPilotConsent,
} from "@/lib/server/pilot-consent";

type SearchParams = Promise<{
  error?: string;
}>;

export default async function PilotConsentPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const consent = await getGuardianPilotConsent();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/family/new">
          Back to family setup
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Pilot notice v{PILOT_CONSENT_VERSION}
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Guardian consent</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Review this before creating a test family. The first pilot keeps data collection small and avoids photo upload, real AI, payment, location, rankings, and device locks.
          </p>
        </header>

        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            A parent or co-signer account must accept the pilot notice before creating a test family.
          </p>
        ) : null}

        {consent ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
            Pilot notice already accepted. You can continue family setup.
          </p>
        ) : null}

        <section className="grid gap-3 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Parent notice</h2>
          <div className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
            {GUARDIAN_NOTICE.split("\n").map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Child-friendly notice</h2>
          <div className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
            {CHILD_NOTICE.split("\n").map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <form action={acceptGuardianPilotConsent} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="flex gap-3 text-sm leading-6">
            <input className="mt-1 h-4 w-4" name="accepted" required type="checkbox" />
            I understand this is a small pilot, data handling requests are manual, and child-private notes are not visible to parents or witnesses by default.
          </label>
          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Accept and continue
          </button>
        </form>
      </section>
    </main>
  );
}
