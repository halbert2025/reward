import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

type OperationalEventLevel = "info" | "warn" | "error";

export async function recordOperationalEvent(input: {
  level: OperationalEventLevel;
  eventName: string;
  message: string;
  actorUserId?: string | null;
  familyId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.operationalEvent.create({
      data: {
        level: input.level,
        eventName: input.eventName,
        message: input.message.slice(0, 500),
        actorUserId: input.actorUserId ?? null,
        familyId: input.familyId ?? null,
        metadataJson: input.metadataJson ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to record operational event", error);
  }
}

export function areNewInvitesPaused() {
  return process.env.REWARD_INVITES_PAUSED === "true";
}
