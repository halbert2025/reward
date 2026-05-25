import Link from "next/link";
import {
  createChildPrivateNote,
  getChildPrivateNotesForCurrentChild,
} from "@/lib/server/child-notes";

type SearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function ChildNotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const notes = await getChildPrivateNotesForCurrentChild();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/child/backyard">
          Back to backyard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Private note
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            写给自己的小纸条
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            这张小纸条默认只给你自己看。MVP 不做 AI 分析，也不会自动提醒家长。
          </p>
        </header>

        {params.status === "saved" ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
            小纸条已经保存。
          </p>
        ) : null}

        {params.error === "empty" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            写一句想留给自己的话就可以。
          </p>
        ) : null}

        <form
          action={createChildPrivateNote}
          className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5"
        >
          <label className="grid gap-2 text-sm font-semibold">
            Note
            <textarea
              className="min-h-28 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="body"
              placeholder="Today I want to remember..."
              required
            />
          </label>
          <button
            className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Save private note
          </button>
        </form>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Only visible here</h2>
          <div className="mt-4 grid gap-3">
            {notes.length > 0 ? (
              notes.map((note) => (
                <p
                  className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6"
                  key={note.id}
                >
                  {note.body}
                </p>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No private notes yet.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
