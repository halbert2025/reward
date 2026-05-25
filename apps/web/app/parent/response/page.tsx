import Link from "next/link";
import { getPendingParentResponse, submitParentResponse } from "@/lib/server/parent-response";

type SearchParams = Promise<{
  error?: string;
}>;

export default async function ParentResponsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const contract = await getPendingParentResponse();
  const task = contract?.tasks[0];
  const evidence = task?.evidence[0];

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/">
          Back to dashboard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Parent response
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            这个约定正在等待回应。
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            如果今天不方便兑现，可以说明原因并设置新的兑现时间。
          </p>
        </header>

        {!contract || !task || !evidence ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">目前没有等待回应的约定</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              孩子提交完成记录后，这里会出现回应入口。
            </p>
          </section>
        ) : (
          <form
            action={submitParentResponse}
            className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5"
          >
            <input name="contractId" type="hidden" value={contract.id} />

            {params.error === "delay" ? (
              <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                如果今天不方便兑现，请写清原因和新的时间。
              </p>
            ) : null}

            <section className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6">
              <p>Wish: {contract.wish?.title ?? "Small family wish"}</p>
              <p>Task: {task.title}</p>
              <p>Child reflection: {evidence.reflectionText}</p>
            </section>

            <fieldset className="grid gap-3 text-sm">
              <legend className="font-semibold">Response</legend>
              <label className="flex gap-3">
                <input defaultChecked name="responseType" type="radio" value="fulfilled" />
                <span>已兑现</span>
              </label>
              <label className="flex gap-3">
                <input name="responseType" type="radio" value="delayed" />
                <span>需要延期</span>
              </label>
              <label className="flex gap-3">
                <input name="responseType" type="radio" value="pending_repair" />
                <span>需要一起复盘</span>
              </label>
            </fieldset>

            <label className="grid gap-2 text-sm font-semibold">
              Parent message
              <textarea
                className="min-h-24 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                name="message"
                placeholder="Write one warm sentence."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Delay reason
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                  name="delayReason"
                  placeholder="Only needed for delay"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                New time
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                  name="expectedAt"
                  type="datetime-local"
                />
              </label>
            </div>

            <button
              className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              保存回应
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
