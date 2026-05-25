import Link from "next/link";
import { getPendingParentResponse, submitParentResponse } from "@/lib/server/parent-response";

type SearchParams = Promise<{
  error?: string;
}>;

const errorCopy: Record<string, string> = {
  delay: "如果今天不方便兑现，请写清原因和新的时间。",
  response: "请选择一种回应方式。",
  REPAIR_MESSAGE_REQUIRED: "写一句中性的说明，比如：这个愿望需要一起商量一下。",
  REPAIR_MESSAGE_NOT_NEUTRAL: "这里不做裁判或责备，请换成一起商量的表达。",
  missing: "这个约定刚刚有更新，请刷新后再继续。",
};

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
          回到总览
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Parent response
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            这个约定正在等待回应。
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            如果今天不方便兑现，可以说明原因并设置新的兑现时间。这里不做裁判，
            只把原来约好的规则说清楚。
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

            {params.error ? (
              <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorCopy[params.error] ?? errorCopy.response}
              </p>
            ) : null}

            <section className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6">
              <p>愿望：{contract.wish?.title ?? "家庭小愿望"}</p>
              <p>任务：{task.title}</p>
              <p>孩子复盘：{evidence.reflectionText}</p>
              <p className="mt-2 text-[var(--muted)]">
                证据照片在 MVP 中只保留安全的本地/mock 摘要，不展示原始敏感图片。
              </p>
            </section>

            <fieldset className="grid gap-3 text-sm">
              <legend className="font-semibold">回应方式</legend>
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
                <span>这个愿望需要一起商量一下</span>
              </label>
            </fieldset>

            <label className="grid gap-2 text-sm font-semibold">
              给孩子的一句话
              <textarea
                className="min-h-24 rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                name="message"
                placeholder="谢谢你把这次努力记录下来，我们一起按约定回应。"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                延期原因
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                  name="delayReason"
                  placeholder="只在延期时填写"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                新兑现时间
                <input
                  className="rounded-panel border border-[var(--line)] px-3 py-2 text-sm"
                  name="expectedAt"
                  type="datetime-local"
                />
              </label>
            </div>

            <p className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
              选择“待复盘”时，请使用中性表达。系统会保存努力记录，不会判断谁对谁错；
              见证人也看不到延期原因、证据照片或修复细节。
            </p>

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
