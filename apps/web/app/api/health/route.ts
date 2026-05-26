import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      service: "reward-web",
      appEnv: process.env.APP_ENV ?? "local",
      database: "ok",
      invitesPaused: process.env.REWARD_INVITES_PAUSED === "true",
      latencyMs: Date.now() - startedAt,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: "reward-web",
        appEnv: process.env.APP_ENV ?? "local",
        database: "error",
        invitesPaused: process.env.REWARD_INVITES_PAUSED === "true",
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
