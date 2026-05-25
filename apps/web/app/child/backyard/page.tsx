import Link from "next/link";
import { getChildBackyardState } from "@/lib/server/child-workflow";

type SearchParams = Promise<{
  status?: string;
  error?: string;
}>;

export default async function ChildBackyardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { contract, latestVersion, task, quietCatVisit } = await getChildBackyardState();
  const catVisit = quietCatVisit || params.status === "cat-visit";

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Wish backyard
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            准备好了吗？开始为愿望充能。
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            This space shows the current family promise without rankings, video, or
            hard locks.
          </p>
        </header>

        {params.error === "not-ready" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            这个愿望还没准备好，请先确认约定。
          </p>
        ) : null}

        {catVisit ? (
          <section className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5 sm:grid-cols-[120px_1fr]">
            <div className="flex aspect-square items-center justify-center rounded-panel border border-[var(--line)] bg-[var(--background)]">
              <div className="relative h-20 w-24">
                <div className="absolute left-5 top-5 h-12 w-14 rounded-[48%] bg-[#f4c36d]" />
                <div className="absolute left-7 top-1 h-12 w-12 rounded-[46%] bg-[#f6cf87]" />
                <div className="absolute left-7 top-0 h-5 w-5 rotate-[-20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
                <div className="absolute left-14 top-0 h-5 w-5 rotate-[20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
                <div className="absolute left-[42px] top-6 h-1.5 w-1.5 rounded-full bg-ink" />
                <div className="absolute left-[58px] top-6 h-1.5 w-1.5 rounded-full bg-ink" />
                <div className="absolute bottom-0 left-0 right-0 h-4 rounded-full bg-[#d8e7c2]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">安静猫来了</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                你的努力已经被记录下来了。今天的小院已经更新啦，去做点别的吧，猫猫会等你回来。
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                This visit is the MVP memory-card feedback for a completed wish pomodoro.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5 sm:grid-cols-[120px_1fr]">
            <div className="flex aspect-square items-center justify-center rounded-panel border border-[var(--line)] bg-[var(--background)]">
              <div className="relative h-16 w-24">
                <div className="absolute bottom-2 left-6 h-8 w-12 rounded-full bg-[#d8e7c2]" />
                <div className="absolute bottom-5 left-10 h-5 w-5 rounded-full bg-[#f6cf87]" />
                <div className="absolute bottom-9 left-10 h-3 w-3 rotate-[-20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
                <div className="absolute bottom-9 left-14 h-3 w-3 rotate-[20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Quiet cat corner</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Complete one small promise and the quiet cat will visit this backyard.
              </p>
            </div>
          </section>
        )}

        {!contract || !latestVersion || !task ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">你的小院还在</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              等下一个愿望准备好之后，再回来看看。
            </p>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
              <p className="text-sm font-medium text-leaf">Current wish</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {contract.wish?.title ?? "Small family wish"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {latestVersion.promiseText}
              </p>
              <div className="mt-4 rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6">
                <p>Task: {task.title}</p>
                <p>Time: 25 minutes</p>
                <p>Status: {contract.state}</p>
              </div>
            </div>

            <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
              <h2 className="text-lg font-semibold">Next step</h2>
              {contract.state === "pending_child_confirm" ? (
                <>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Review the exact promise version before it starts.
                  </p>
                  <Link
                    className="mt-4 inline-flex rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                    href={`/child/contracts/${contract.id}/confirm`}
                  >
                    Confirm promise
                  </Link>
                </>
              ) : contract.state === "active" ? (
                <>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Start only when you feel ready. No camera or device lock is used.
                  </p>
                  <Link
                    className="mt-4 inline-flex rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                    href={`/child/pomodoro/${task.id}`}
                  >
                    开始守约
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Your effort is saved. The next step is the parent response.
                </p>
              )}

              <Link
                className="mt-4 inline-flex rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                href="/child/notes"
              >
                Private note entry
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
