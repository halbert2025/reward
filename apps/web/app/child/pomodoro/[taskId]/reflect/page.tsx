import Link from "next/link";
import { submitWishReflection } from "@/lib/server/child-actions";
import { getPomodoroState } from "@/lib/server/child-workflow";

type Params = Promise<{
  taskId: string;
}>;

type SearchParams = Promise<{
  error?: string;
}>;

export default async function ReflectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { taskId } = await params;
  const query = await searchParams;
  const { task, contract } = await getPomodoroState(taskId);

  if (!task || !contract || task.state !== "submitted") {
    return (
      <main className="min-h-screen px-6 py-8 sm:px-10">
        <section className="mx-auto max-w-3xl rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h1 className="text-2xl font-semibold">Reflection not ready</h1>
          <Link className="mt-4 inline-flex text-sm font-semibold text-leaf" href="/child/backyard">
            Back to backyard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/child/backyard">
          Back to backyard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Completion reflection
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            你的努力已经被记录下来了。
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Add one sentence. Photo is optional; use a safe local placeholder only.
          </p>
        </header>

        <form
          action={submitWishReflection}
          className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5"
        >
          <input name="taskId" type="hidden" value={task.id} />
          {query.error === "reflection" ? (
            <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              写一句你刚刚做了什么就可以。
            </p>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold">
            One-sentence reflection
            <textarea
              className="min-h-28 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="reflection"
              placeholder="I focused on..."
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Optional photo placeholder
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="photoLabel"
              placeholder="e.g. workbook corner, desk note"
            />
          </label>

          <p className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
            Only use a task-result detail. Avoid faces, addresses, school names, and
            private family information.
          </p>

          <button
            className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Submit completion record
          </button>
        </form>
      </section>
    </main>
  );
}
