import Link from "next/link";
import { WishPomodoro } from "@/components/wish-pomodoro";
import { getPomodoroState } from "@/lib/server/child-workflow";

type Params = Promise<{
  taskId: string;
}>;

type SearchParams = Promise<{
  error?: string;
}>;

export default async function PomodoroPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { taskId } = await params;
  const query = await searchParams;
  const { task, contract, latestVersion } = await getPomodoroState(taskId);

  if (!task || !contract || !latestVersion) {
    return (
      <main className="min-h-screen px-6 py-8 sm:px-10">
        <section className="mx-auto max-w-3xl rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h1 className="text-2xl font-semibold">Promise not ready</h1>
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

        {query.error === "exit-reason" ? (
          <p className="rounded-panel border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            如果这次先停下，写一句原因就好。
          </p>
        ) : null}

        <WishPomodoro
          taskId={task.id}
          taskState={task.state}
          title={task.title}
          wishTitle={contract.wish?.title ?? latestVersion.rewardText}
        />
      </section>
    </main>
  );
}
