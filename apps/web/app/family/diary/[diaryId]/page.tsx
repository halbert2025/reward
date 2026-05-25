import Link from "next/link";
import { getDiaryEntry } from "@/lib/server/parent-response";

type Params = Promise<{
  diaryId: string;
}>;

const responseCopy: Record<string, string> = {
  fulfilled: "已兑现：这次努力和回应都已经放进纪念卡。",
  delayed: "已延期：这次努力先被记录下来，新的回应时间也已经写清楚。",
  pending_repair: "待复盘：这次努力会被保留，之后再一起商量。",
};

export default async function DiaryPage({ params }: { params: Params }) {
  const { diaryId } = await params;
  const diary = await getDiaryEntry(diaryId);
  const task = diary?.contract.tasks[0];
  const evidence = task?.evidence[0];
  const fulfillment = diary?.contract.fulfillments[0];
  const responseType = fulfillment?.responseType ?? "fulfilled";

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          回到总览
        </Link>

        {!diary || !task || !evidence ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h1 className="text-2xl font-semibold">
              这个纪念还在整理，请稍后再看。
            </h1>
          </section>
        ) : (
          <>
            <header className="border-b border-[var(--line)] pb-5">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
                Family diary
              </p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight">
                {diary.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                安静猫来访了，把这次努力放进小院纪念卡。
              </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
                <h2 className="text-lg font-semibold">愿望</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {diary.contract.wish?.title ?? "家庭小愿望"}
                </p>
              </div>
              <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
                <h2 className="text-lg font-semibold">任务</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{task.title}</p>
              </div>
              <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
                <h2 className="text-lg font-semibold">孩子复盘</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {evidence.reflectionText}
                </p>
              </div>
              <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
                <h2 className="text-lg font-semibold">家长回应</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {responseCopy[responseType] ?? responseCopy.fulfilled}
                </p>
              </div>
            </section>

            <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
              <h2 className="text-lg font-semibold">纪念卡</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">
                {diary.summary}
              </p>
              <p className="mt-4 rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
                这张纪念卡不会包含孩子私密小纸条、原始敏感照片、争议细节或见证人评价。
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                href="/child/backyard"
              >
                回到小院
              </Link>
              <Link
                className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                href="/parent/contracts/new"
              >
                创建下一个约定
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
