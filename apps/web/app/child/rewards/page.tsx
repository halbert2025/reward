import Image from "next/image";
import Link from "next/link";
import { getChildRewardCollection } from "@/lib/server/child-workflow";

export default async function ChildRewardsPage() {
  const { tickets, stats } = await getChildRewardCollection();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link className="text-sm font-semibold text-leaf" href="/child/backyard">
          Back to backyard
        </Link>

        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Reward tickets
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">猫猫奶茶小票收藏册</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            这里只收藏你完成过的安静努力。小票可以给自己和家长回看，不会放进公开排名，也不会给见证人展示原文。
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">累计小票</p>
            <p className="mt-2 text-3xl font-semibold">{stats.rewardTicketCount}</p>
          </div>
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
            <p className="text-sm text-[var(--muted)]">猫猫陪伴时长</p>
            <p className="mt-2 text-3xl font-semibold">{stats.totalFocusMinutes} 分钟</p>
          </div>
        </section>

        {stats.hasMoreTickets ? (
          <p className="rounded-panel border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-[var(--muted)]">
            当前先展示最新 {stats.visibleTicketLimit} 张小票。完整导出会走家长数据请求流程，不在孩子端一次性加载全部历史记录。
          </p>
        ) : null}

        {tickets.length === 0 ? (
          <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">还没有小票</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              完成一次番茄钟并提交一句复盘后，这里会出现第一张猫猫奶茶小票。
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {tickets.map((ticket, index) => {
              const contract = ticket.task.contract;
              const diary = contract.diaryEntries[0];
              const version = contract.versions[0];
              return (
                <article
                  className="overflow-hidden rounded-panel border border-[var(--line)] bg-white/80"
                  key={ticket.id}
                >
                  <div className="relative aspect-[16/9] bg-[#102723]">
                    <Image
                      alt=""
                      className="object-cover opacity-85"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src="/assets/pomodoro/coffee/drink_cat_latte_art_close_01.png"
                    />
                    <span className="absolute left-3 top-3 rounded-panel bg-[#102723]/80 px-3 py-1 text-xs font-semibold text-[#f7e7bb]">
                      Ticket #{stats.rewardTicketCount - index}
                    </span>
                  </div>
                  <div className="grid gap-3 p-5">
                    <div>
                      <p className="text-sm font-medium text-leaf">
                        {ticket.createdAt.toLocaleDateString("zh-CN")}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        {contract.wish?.title ?? version?.title ?? "家庭小愿望"}
                      </h2>
                    </div>
                    <p className="rounded-panel border border-[var(--line)] bg-[var(--background)] p-3 text-sm leading-6">
                      {ticket.reflectionText}
                    </p>
                    <div className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
                      <p>任务：{ticket.task.title}</p>
                      <p>饮品：猫猫笑脸拉花</p>
                      <p>状态：{diary ? "已生成家庭纪念" : "等待家长回应"}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}
