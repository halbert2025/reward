import Link from "next/link";
import { submitWishReflection } from "@/lib/server/child-actions";
import { getPomodoroState } from "@/lib/server/child-workflow";

type Params = Promise<{
  taskId: string;
}>;

type SearchParams = Promise<{
  error?: string;
}>;

const errorCopy: Record<string, string> = {
  reflection: "写一句你刚才做了什么就可以。",
  EVIDENCE_PRIVACY_RISK:
    "只拍任务成果局部，避开人脸、住址、学校标识、证件、聊天截图和定位信息。",
};

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
          <h1 className="text-2xl font-semibold">完成记录还没有准备好</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            先回到小院，等这次番茄钟完成后再提交复盘。
          </p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-leaf" href="/child/backyard">
            回到小院
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/child/backyard">
          回到小院
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Completion reflection
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            你的努力已经被记录下来了。
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            写一句复盘就可以。照片是可选项，MVP 只保存本地/mock 证据信息。
          </p>
        </header>

        <form
          action={submitWishReflection}
          className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5"
        >
          <input name="taskId" type="hidden" value={task.id} />
          {query.error ? (
            <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorCopy[query.error] ?? errorCopy.reflection}
            </p>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold">
            一句复盘
            <textarea
              className="min-h-28 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="reflection"
              placeholder="我刚才专心完成了..."
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            可选照片说明
            <input
              className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
              name="photoLabel"
              placeholder="例如：书桌一角、作品局部"
            />
          </label>

          <p className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
            只需要记录努力。可以跳过照片；如果填写照片说明，请避开人脸、住址、
            学校标识、证件、聊天截图和定位信息。
          </p>

          <button
            className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            提交完成记录
          </button>
        </form>
      </section>
    </main>
  );
}
