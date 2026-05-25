import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireAdmin() {
  const actor = await getCurrentActor();

  if (actor.role !== "admin") {
    redirect("/auth/login?error=admin");
  }

  return actor;
}

function actorTypeFor(role: string) {
  return role === "co_signer" ? "parent" : role === "admin" ? "admin" : role;
}

export async function getPilotOperationsDashboard() {
  await requireAdmin();

  const [families, consents, dataRequests, feedback, riskSignals] = await Promise.all([
    prisma.family.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        members: {
          include: { user: true },
        },
        _count: {
          select: {
            contracts: true,
            invites: true,
            dataRequests: true,
            pilotFeedback: true,
            riskSignals: true,
          },
        },
      },
    }),
    prisma.pilotConsent.findMany({
      orderBy: { acceptedAt: "desc" },
      take: 20,
      include: { user: true, family: true },
    }),
    prisma.dataRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { family: true, requestedBy: true },
    }),
    prisma.pilotFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { family: true, submittedBy: true },
    }),
    prisma.riskSignal.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { family: true },
    }),
  ]);

  return { families, consents, dataRequests, feedback, riskSignals };
}

export async function updateDataRequestStatus(formData: FormData) {
  "use server";

  const actor = await requireAdmin();
  const requestId = clean(formData, "requestId");
  const status = clean(formData, "status");
  const handlerNote = clean(formData, "handlerNote");

  if (!["requested", "in_review", "completed", "rejected_with_reason"].includes(status)) {
    redirect("/admin/pilot?error=data-request-status");
  }

  if ((status === "rejected_with_reason" || status === "completed") && handlerNote.length < 4) {
    redirect("/admin/pilot?error=handler-note");
  }

  const request = await prisma.dataRequest.update({
    where: { id: requestId },
    data: {
      status: status as "requested" | "in_review" | "completed" | "rejected_with_reason",
      handlerNote: handlerNote || null,
      completedAt: status === "completed" ? new Date() : null,
    },
  });

  if (request.familyId) {
    await prisma.auditLog.create({
      data: {
        familyId: request.familyId,
        actorUserId: actor.id,
        actorType: "admin",
        eventName: "data_request_status_updated",
        entityType: "DataRequest",
        entityId: request.id,
        metadataJson: { status, hasHandlerNote: Boolean(handlerNote) },
      },
    });
  }

  revalidatePath("/admin/pilot");
  redirect("/admin/pilot?status=data-request-updated");
}

export async function updateFeedbackStatus(formData: FormData) {
  "use server";

  const actor = await requireAdmin();
  const feedbackId = clean(formData, "feedbackId");
  const status = clean(formData, "status");
  const handlerNote = clean(formData, "handlerNote");

  if (!["new", "triaged", "closed"].includes(status)) {
    redirect("/admin/pilot?error=feedback-status");
  }

  const feedback = await prisma.pilotFeedback.update({
    where: { id: feedbackId },
    data: {
      status: status as "new" | "triaged" | "closed",
      handlerNote: handlerNote || null,
    },
  });

  if (feedback.familyId) {
    await prisma.auditLog.create({
      data: {
        familyId: feedback.familyId,
        actorUserId: actor.id,
        actorType: "admin",
        eventName: "pilot_feedback_status_updated",
        entityType: "PilotFeedback",
        entityId: feedback.id,
        metadataJson: { status, hasHandlerNote: Boolean(handlerNote) },
      },
    });
  }

  revalidatePath("/admin/pilot");
  redirect("/admin/pilot?status=feedback-updated");
}

export async function updateRiskSignalStatus(formData: FormData) {
  "use server";

  const actor = await requireAdmin();
  const riskSignalId = clean(formData, "riskSignalId");
  const status = clean(formData, "status");
  const reviewerNote = clean(formData, "reviewerNote");

  if (!["queued", "in_review", "resolved", "dismissed"].includes(status)) {
    redirect("/admin/pilot?error=risk-status");
  }

  if ((status === "resolved" || status === "dismissed") && reviewerNote.length < 4) {
    redirect("/admin/pilot?error=reviewer-note");
  }

  const riskSignal = await prisma.riskSignal.update({
    where: { id: riskSignalId },
    data: {
      status: status as "queued" | "in_review" | "resolved" | "dismissed",
      reviewerNote: reviewerNote || null,
      reviewedAt: status === "resolved" || status === "dismissed" ? new Date() : null,
    },
  });

  if (riskSignal.familyId) {
    await prisma.auditLog.create({
      data: {
        familyId: riskSignal.familyId,
        actorUserId: actor.id,
        actorType: "admin",
        eventName: "risk_signal_status_updated",
        entityType: "RiskSignal",
        entityId: riskSignal.id,
        metadataJson: { status, hasReviewerNote: Boolean(reviewerNote) },
      },
    });
  }

  revalidatePath("/admin/pilot");
  redirect("/admin/pilot?status=risk-updated");
}

export async function getPilotFeedbackContext() {
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

  return { actor, families };
}

export async function createPilotFeedback(formData: FormData) {
  "use server";

  const actor = await getCurrentActor();
  const familyId = clean(formData, "familyId") || null;
  const type = clean(formData, "type");
  const message = clean(formData, "message");

  if (!["bug", "usability", "safety", "general"].includes(type)) {
    redirect("/feedback?error=type");
  }

  if (message.length < 6 || message.length > 800) {
    redirect("/feedback?error=message");
  }

  if (familyId) {
    const member = await prisma.familyMember.findFirst({
      where: { familyId, userId: actor.id, status: "active" },
    });

    if (!member) {
      redirect("/feedback?error=family");
    }
  }

  const role = actor.role === "co_signer" ? "parent" : actor.role === "admin" ? "parent" : actor.role;
  const feedback = await prisma.pilotFeedback.create({
    data: {
      familyId,
      submittedById: actor.id.startsWith("seed_") ? null : actor.id,
      role: role as "parent" | "child" | "witness",
      type: type as "bug" | "usability" | "safety" | "general",
      message,
    },
  });

  if (familyId) {
    await prisma.auditLog.create({
      data: {
        familyId,
        actorUserId: actor.id.startsWith("seed_") ? null : actor.id,
        actorType: actorTypeFor(actor.role) as "parent" | "child" | "witness" | "system" | "admin",
        eventName: "pilot_feedback_created",
        entityType: "PilotFeedback",
        entityId: feedback.id,
        metadataJson: { type, role },
      },
    });
  }

  if (type === "safety") {
    await prisma.riskSignal.create({
      data: {
        familyId,
        sourceType: "pilot_feedback",
        level: "L4",
        status: "queued",
        summary: "Safety-related pilot feedback requires manual review.",
      },
    });
  }

  redirect("/feedback?status=sent");
}
