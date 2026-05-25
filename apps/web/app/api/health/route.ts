import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "reward-web",
    appEnv: process.env.APP_ENV ?? "local"
  });
}
