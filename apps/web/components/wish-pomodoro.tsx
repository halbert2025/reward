"use client";

import { useEffect, useState } from "react";
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

export function WishPomodoro({
  taskId,
  taskState,
  title,
  wishTitle,
}: WishPomodoroProps) {
  const [remaining, setRemaining] = useState(debugSeconds);
  const [showExit, setShowExit] = useState(false);
  const isRunning = taskState === "running";
  const readyToComplete = isRunning && remaining <= 0;

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
        <p className="text-sm font-medium text-leaf">Cat backyard timer</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight">{wishTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{title}</p>
      </div>

      <div className="grid gap-4 rounded-panel border border-[var(--line)] bg-[var(--background)] p-5 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="flex aspect-square items-center justify-center rounded-panel border border-[var(--line)] bg-white">
          <div className="relative h-32 w-40">
            <div className="absolute left-8 top-8 h-20 w-24 rounded-[48%] bg-[#f4c36d]" />
            <div className="absolute left-12 top-2 h-20 w-20 rounded-[46%] bg-[#f6cf87]" />
            <div className="absolute left-12 top-0 h-8 w-8 rotate-[-20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
            <div className="absolute left-24 top-0 h-8 w-8 rotate-[20deg] bg-[#f6cf87] [clip-path:polygon(50%_0,0_100%,100%_100%)]" />
            <div className="absolute left-[70px] top-9 h-2 w-2 rounded-full bg-ink" />
            <div className="absolute left-[98px] top-9 h-2 w-2 rounded-full bg-ink" />
            <div className="absolute left-[84px] top-12 h-2 w-3 rounded-full bg-[#c2745d]" />
            <div className="absolute left-28 top-20 h-10 w-14 rounded-full border-8 border-l-0 border-[#f4c36d]" />
            <div className="absolute bottom-0 left-1 right-1 h-6 rounded-full bg-[#d8e7c2]" />
          </div>
        </div>
        <div className="flex flex-col justify-center text-center sm:text-left">
          <p className="text-sm font-semibold text-[var(--muted)]">
            Product promise: 25 minutes
          </p>
          <p className="mt-3 text-6xl font-semibold tabular-nums">
            {String(Math.floor(remaining / 60)).padStart(2, "0")}:
            {String(remaining % 60).padStart(2, "0")}
          </p>
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
            A quiet cat is keeping the backyard warm while you focus. Debug timer is
            shortened for desktop testing.
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
          <h2 className="text-lg font-semibold">这次先停下</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            如果这次先停下，写一句原因就好。
          </p>
          <form action={exitWishPomodoro} className="mt-4 grid gap-3">
            <input name="taskId" type="hidden" value={taskId} />
            <select
              className="rounded-panel border border-[var(--line)] bg-white px-3 py-2 text-sm"
              name="exitReason"
              required
            >
              <option value="">Choose a reason</option>
              <option value="Need a break">Need a break</option>
              <option value="Need help from parent">Need help from parent</option>
              <option value="The promise needs a better time">The promise needs a better time</option>
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                onClick={() => setShowExit(false)}
                type="button"
              >
                Return
              </button>
              <button
                className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                Save reason
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
