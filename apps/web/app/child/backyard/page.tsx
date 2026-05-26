import Link from "next/link";
import Image from "next/image";
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
  const { contract, latestVersion, task, quietCatVisit, stats } = await getChildBackyardState();
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
            这里展示当前家庭约定。没有排名、视频监控或锁机，只记录一次安静的守约过程。
          </p>
        </header>

        {params.error === "not-ready" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            这个愿望还没有准备好，请先确认约定。
          </p>
        ) : null}

        {catVisit ? (
          <section className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5 sm:grid-cols-[150px_1fr]">
            <div className="overflow-hidden rounded-panel border border-[var(--line)] bg-[#102723]">
              <Image
                alt=""
                className="aspect-square h-full w-full object-cover"
                height={300}
                src="/assets/pomodoro/coffee/drink_cat_latte_art_close_01.png"
                width={300}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">安静猫猫来过了</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                你的努力已经被记录下来。今天的小院更新了一杯猫猫拉花饮品，接下来等家长回应就好。
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                This visit is the MVP memory-card feedback for a completed wish pomodoro.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5 sm:grid-cols-[150px_1fr]">
            <div className="overflow-hidden rounded-panel border border-[var(--line)] bg-[#102723]">
              <Image
                alt=""
                className="aspect-square h-full w-full object-cover"
                height={300}
                src="/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png"
                width={300}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">森林猫猫奶茶厅</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                完成一个小约定后，猫猫会把这次努力做成一杯安静的饮品，留在小院里。
              </p>
            </div>
          </section>
        )}

        <section className="grid gap-4 rounded-panel border border-[var(--line)] bg-white/70 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-medium text-leaf">Reward collection</p>
            <h2 className="mt-2 text-lg font-semibold">今日小票会被收进收藏册</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              每次完成番茄钟后，系统会保存一张猫猫奶茶小票。它不是排名，也不会公开给见证人看，只用来回看自己的努力。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center md:min-w-80">
            <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-3">
              <p className="text-2xl font-semibold">{stats.completedTasks}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">已完成</p>
            </div>
            <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-3">
              <p className="text-2xl font-semibold">{stats.rewardTicketCount}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">小票</p>
            </div>
            <div className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-3">
              <p className="text-2xl font-semibold">{stats.totalFocusMinutes}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">分钟</p>
            </div>
          </div>
          <Link
            className="inline-flex w-fit rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold md:col-span-2"
            href="/child/rewards"
          >
            查看小票收藏册
          </Link>
        </section>

        {!contract || !latestVersion || !task ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">你的小院还在等一个愿望</h2>
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
                    准备好再开始。这里不会打开摄像头，也不会锁住设备。
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
