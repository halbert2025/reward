import { redirect } from "next/navigation";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

export const PILOT_CONSENT_VERSION = "2026-05-26";

export const GUARDIAN_NOTICE = [
  "Reward is a small family promise pilot, not a control or monitoring tool.",
  "The pilot records account, family, promise, reflection, diary, invite, audit, and in-app request data.",
  "The first pilot does not collect real evidence photos, location, school identifiers, payment data, or child social graph data.",
  "ChildNote is child-private by default and is not shown to parents, witnesses, or normal operations views.",
  "Witnesses only see a safe memory summary, not evidence, amount, ChildNote, repair details, or family disputes.",
  "AI/Kimi is off by default and must not be connected without separate consent, redaction, a kill switch, and fallback.",
  "Families can request export, deletion review, data sealing, or pilot exit from the data request page.",
].join("\n");

export const CHILD_NOTICE = [
  "Reward helps your family remember one small promise at a time.",
  "Your private note is for you by default.",
  "The app does not use camera monitoring, location tracking, rankings, or punishment locks.",
  "If something feels unfair, ask a trusted adult to review it together.",
].join("\n");

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function getGuardianPilotConsent() {
  const actor = await getCurrentActor();

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    return null;
  }

  return prisma.pilotConsent.findFirst({
    where: {
      userId: actor.id,
      scope: "guardian_pilot",
      version: PILOT_CONSENT_VERSION,
      status: "accepted",
    },
    orderBy: { acceptedAt: "desc" },
  });
}

export async function acceptGuardianPilotConsent() {
  "use server";

  const actor = await getCurrentActor();

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    redirect("/pilot/consent?error=permission");
  }

  await prisma.pilotConsent.create({
    data: {
      userId: actor.id,
      scope: "guardian_pilot",
      version: PILOT_CONSENT_VERSION,
      status: "accepted",
      noticeSnapshot: GUARDIAN_NOTICE,
    },
  });

  redirect("/family/new?status=consent-accepted");
}

export async function createPilotDataRequest(formData: FormData) {
  "use server";

  const actor = await getCurrentActor();
  const type = clean(formData, "type");
  const requestSummary = clean(formData, "requestSummary");
  const familyId = clean(formData, "familyId") || null;

  if (!["export", "deletion", "seal", "exit_pilot"].includes(type)) {
    redirect("/privacy/requests?error=type");
  }

  if (requestSummary.length < 8 || requestSummary.length > 500) {
    redirect("/privacy/requests?error=summary");
  }

  if (familyId) {
    const member = await prisma.familyMember.findFirst({
      where: {
        familyId,
        userId: actor.id,
        status: "active",
      },
    });

    if (!member) {
      redirect("/privacy/requests?error=family");
    }
  }

  const request = await prisma.dataRequest.create({
    data: {
      familyId,
      requestedById: actor.id,
      type: type as "export" | "deletion" | "seal" | "exit_pilot",
      requesterRole: actor.role === "co_signer" ? "parent" : actor.role,
      requestSummary,
    },
  });

  if (familyId) {
    await prisma.auditLog.create({
      data: {
        familyId,
        actorUserId: actor.id,
        actorType: actor.role === "co_signer" ? "parent" : actor.role,
        eventName: "data_request_created",
        entityType: "DataRequest",
        entityId: request.id,
        metadataJson: {
          type,
          status: "requested",
        },
      },
    });
  }

  redirect("/privacy/requests?status=requested");
}

export async function getPilotDataRequestContext() {
  const actor = await getCurrentActor();

  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          userId: actor.id,
          status: "active",
        },
      },
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  const requests = await prisma.dataRequest.findMany({
    where: {
      requestedById: actor.id,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      family: true,
    },
  });

  return { actor, families, requests };
}
