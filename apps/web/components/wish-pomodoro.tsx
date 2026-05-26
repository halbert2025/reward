"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  completeWishPomodoro,
  exitWishPomodoro,
  startWishPomodoro,
} from "@/lib/server/child-actions";

type WishPomodoroProps = {
  taskId: string;
  taskState: string;
  title: string;
  wishTitle: string;
};

const debugSeconds = 8;
const halfTimeGuestSecond = Math.floor(debugSeconds / 2);

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function WishPomodoro({
  taskId,
  taskState,
  title,
  wishTitle,
}: WishPomodoroProps) {
  const [remaining, setRemaining] = useState(debugSeconds);
  const [showExit, setShowExit] = useState(false);
  const [catLookedUp, setCatLookedUp] = useState(false);
  const isRunning = taskState === "running";
  const readyToComplete = isRunning && remaining <= 0;
  const showGuest = isRunning && remaining <= halfTimeGuestSecond;
  const sceneImage = readyToComplete
    ? "/assets/pomodoro/coffee/barista_serve_drink_counter_close_01.png"
    : catLookedUp
      ? "/assets/pomodoro/coffee/barista_look_up_counter_close_01.png"
      : "/assets/pomodoro/coffee/barista_idle_counter_close_01.png";

  useEffect(() => {
    if (!isRunning || remaining <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isRunning, remaining]);

  return (
    <section className="grid gap-5 rounded-panel border border-[var(--line)] bg-white/70 p-5">
      <div>
        <p className="text-sm font-medium text-leaf">森林猫猫奶茶厅</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight">{wishTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{title}</p>
      </div>

      <div className="grid gap-4 rounded-panel border border-[var(--line)] bg-[#102723] p-4 sm:grid-cols-[1.15fr_0.85fr]">
        <button
          aria-label="轻点柜台"
          className="group relative block aspect-[4/3] overflow-hidden rounded-panel border border-[#335147] bg-[#18352f] text-left shadow-inner focus:outline-none focus:ring-2 focus:ring-[#f2d58b]"
          onClick={() => setCatLookedUp(true)}
          type="button"
        >
          <Image
            alt=""
            fill
            className="absolute inset-0 h-full w-full object-cover opacity-65"
            sizes="(min-width: 640px) 55vw, 100vw"
            src="/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png"
          />
          {showGuest ? (
            <Image
              alt=""
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-700"
              sizes="(min-width: 640px) 55vw, 100vw"
              src="/assets/pomodoro/coffee/guest_back_bar_scene_wide_01.png"
            />
          ) : null}
          <Image
            alt=""
            className="absolute inset-x-[9%] bottom-[5%] h-[74%] w-[82%] rounded-panel object-cover object-center opacity-95 transition-transform duration-700 group-active:scale-[1.01]"
            height={520}
            src={sceneImage}
            width={640}
          />
          {readyToComplete ? (
            <Image
              alt=""
              className="absolute bottom-[5%] right-[6%] h-[30%] w-[30%] rounded-full object-cover shadow-lg"
              height={180}
              src="/assets/pomodoro/coffee/drink_cat_latte_art_close_01.png"
              width={180}
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-panel bg-[#102723]/75 px-3 py-1 text-xs font-semibold text-[#f7e7bb]">
            {readyToComplete
              ? "饮品完成"
              : showGuest
                ? "有猫猫安静坐下"
                : catLookedUp
                  ? "猫猫看了你一眼"
                  : "安静制作中"}
          </span>
        </button>

        <div className="flex flex-col justify-center rounded-panel border border-[#335147] bg-[#f7f0d8] p-5 text-center sm:text-left">
          <p className="text-sm font-semibold text-[var(--muted)]">产品约定：25 分钟</p>
          <p className="mt-3 text-6xl font-semibold tabular-nums">{formatTime(remaining)}</p>
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
            当前电脑端验收使用 8 秒调试倒计时。真实试点仍按 25 分钟记录，不做摄像头、锁机或排名。
          </p>
        </div>
      </div>

      {!isRunning ? (
        <form action={startWishPomodoro}>
          <input name="taskId" type="hidden" value={taskId} />
          <button
            className="w-full rounded-panel bg-ink px-4 py-3 text-sm font-semibold text-white"
            type="submit"
          >
            开始守约
          </button>
        </form>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-panel border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold"
            onClick={() => setShowExit(true)}
            type="button"
          >
            先停一下
          </button>
          <form action={completeWishPomodoro}>
            <input name="taskId" type="hidden" value={taskId} />
            <button
              className="w-full rounded-panel bg-ink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!readyToComplete}
              type="submit"
            >
              我完成了
            </button>
          </form>
        </div>
      )}

      {showExit ? (
        <div className="rounded-panel border border-[var(--line)] bg-white p-4">
          <h2 className="text-lg font-semibold">这次先停一下</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            如果这次先停下来，写一句原因就好。原因只用于复盘和家长理解，不会变成惩罚。
          </p>
          <form action={exitWishPomodoro} className="mt-4 grid gap-3">
            <input name="taskId" type="hidden" value={taskId} />
            <select
              className="rounded-panel border border-[var(--line)] bg-white px-3 py-2 text-sm"
              name="exitReason"
              required
            >
              <option value="">选择一个原因</option>
              <option value="Need a break">需要休息一下</option>
              <option value="Need help from parent">需要家长帮忙</option>
              <option value="The promise needs a better time">这个约定需要换个时间</option>
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                onClick={() => setShowExit(false)}
                type="button"
              >
                返回
              </button>
              <button
                className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                保存原因
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
