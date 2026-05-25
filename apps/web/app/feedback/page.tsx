import Link from "next/link";
import { createPilotFeedback, getPilotFeedbackContext } from "@/lib/server/pilot-operations";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function PilotFeedbackPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { families } = await getPilotFeedbackContext();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Pilot feedback
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Tell the pilot team</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Share a bug, confusing moment, safety concern, or general note. Safety feedback enters manual review without automatic judgment or family broadcast.
          </p>
        </header>

        {params.status === "sent" ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
            Feedback sent. Thank you.
          </p>
        ) : null}
        {params.error ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please choose a type and write at least six characters.
          </p>
        ) : null}

        <form action={createPilotFeedback} className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-semibold">
            Family
            <select className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm" name="familyId">
              <option value="">No family / account-level</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Type
            <select className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm" name="type" required>
              <option value="bug">Bug</option>
              <option value="usability">Usability</option>
              <option value="safety">Safety concern</option>
              <option value="general">General</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Message
            <textarea
              className="min-h-32 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              maxLength={800}
              minLength={6}
              name="message"
              placeholder="What happened? What felt confusing or important?"
              required
            />
          </label>

          <button className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
            Send feedback
          </button>
        </form>
      </section>
    </main>
  );
}
