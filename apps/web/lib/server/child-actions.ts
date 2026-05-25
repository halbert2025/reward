"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateEvidencePlaceholder } from "@reward/shared/safety-rules";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

export async function startWishPomodoro(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "");
  const actor = await getCurrentActor();

  if (actor.role !== "child") {
    redirect("/child/backyard?error=permission");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      assignedChildId: actor.id,
      contract: {
        state: "active",
      },
    },
    include: {
      contract: true,
    },
  });

  if (!task) {
    redirect("/child/backyard?error=not-ready");
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        state: "running",
        startedAt: new Date(),
      },
    });

    await tx.focusSession.create({
      data: {
        taskId: task.id,
        childId: actor.id,
        state: "running",
        startedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        familyId: task.contract.familyId,
        actorUserId: actor.id,
        actorType: "child",
        eventName: "task_started",
        entityType: "Task",
        entityId: task.id,
        metadataJson: { source: "wish_pomodoro" },
      },
    });
  });

  revalidatePath("/");
  redirect(`/child/pomodoro/${task.id}`);
}

export async function exitWishPomodoro(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "");
  const reason = String(formData.get("exitReason") ?? "").trim();
  const actor = await getCurrentActor();

  if (actor.role !== "child") {
    redirect("/child/backyard?error=permission");
  }

  if (!reason) {
    redirect(`/child/pomodoro/${taskId}?error=exit-reason`);
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      assignedChildId: actor.id,
      state: {
        in: ["running", "paused"],
      },
    },
    include: {
      contract: true,
      focusSessions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!task) {
    redirect("/child/backyard");
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        state: "exited",
        exitedAt: new Date(),
        exitReason: reason,
      },
    });

    const session = task.focusSessions[0];
    if (session) {
      await tx.focusSession.update({
        where: { id: session.id },
        data: {
          state: "exited",
          endedAt: new Date(),
          exitReason: reason,
        },
      });
    }

    await tx.notification.create({
      data: {
        familyId: task.contract.familyId,
        recipientUserId: task.contract.createdById,
        type: "repair_prompt",
        title: "The child paused this promise",
        body: "The effort record was saved with a short reason.",
      },
    });

    await tx.auditLog.create({
      data: {
        familyId: task.contract.familyId,
        actorUserId: actor.id,
        actorType: "child",
        eventName: "task_exited",
        entityType: "Task",
        entityId: task.id,
        metadataJson: { reason },
      },
    });
  });

  revalidatePath("/");
  redirect("/child/backyard?status=paused");
}

export async function completeWishPomodoro(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "");
  const actor = await getCurrentActor();

  if (actor.role !== "child") {
    redirect("/child/backyard?error=permission");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      assignedChildId: actor.id,
      state: "running",
    },
    include: {
      contract: true,
      focusSessions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!task) {
    redirect(`/child/pomodoro/${taskId}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        state: "submitted",
        completedAt: new Date(),
      },
    });

    const session = task.focusSessions[0];
    if (session) {
      await tx.focusSession.update({
        where: { id: session.id },
        data: {
          state: "completed",
          endedAt: new Date(),
          durationSeconds: 25 * 60,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        familyId: task.contract.familyId,
        actorUserId: actor.id,
        actorType: "child",
        eventName: "task_completed",
        entityType: "Task",
        entityId: task.id,
        metadataJson: { durationMinutes: 25 },
      },
    });
  });

  revalidatePath("/");
  redirect(`/child/pomodoro/${task.id}/reflect`);
}

export async function submitWishReflection(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "");
  const reflection = String(formData.get("reflection") ?? "").trim();
  const photoLabel = String(formData.get("photoLabel") ?? "").trim();
  const evidenceNoticeAccepted = String(formData.get("evidenceNoticeAccepted") ?? "") === "on";
  const actor = await getCurrentActor();

  if (actor.role !== "child") {
    redirect("/child/backyard?error=permission");
  }

  if (!reflection) {
    redirect(`/child/pomodoro/${taskId}/reflect?error=reflection`);
  }

  if (photoLabel && !evidenceNoticeAccepted) {
    redirect(`/child/pomodoro/${taskId}/reflect?error=notice`);
  }

  const evidenceValidation = validateEvidencePlaceholder(photoLabel);
  if (!evidenceValidation.ok) {
    redirect(`/child/pomodoro/${taskId}/reflect?error=${evidenceValidation.code}`);
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      assignedChildId: actor.id,
      state: "submitted",
    },
    include: {
      contract: true,
    },
  });

  if (!task) {
    redirect("/child/backyard");
  }

  await prisma.$transaction(async (tx) => {
    await tx.evidence.create({
      data: {
        taskId: task.id,
        authorId: actor.id,
        reflectionText: reflection,
        photoUrl: photoLabel ? `mock://${photoLabel}` : null,
        visibility: "contract_family",
      },
    });

    await tx.task.update({
      where: { id: task.id },
      data: {
        state: "accepted_for_review",
      },
    });

    await tx.contract.update({
      where: { id: task.contractId },
      data: {
        state: "fulfillment_pending",
      },
    });

    await tx.notification.create({
      data: {
        familyId: task.contract.familyId,
        recipientUserId: task.contract.createdById,
        type: "parent_response_needed",
        title: "A promise is ready for your response",
        body: "The child submitted a reflection for the 25-minute promise.",
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId: task.contract.familyId,
          actorUserId: actor.id,
          actorType: "child",
          eventName: "task_submitted_for_review",
          entityType: "Task",
          entityId: task.id,
          metadataJson: {
            hasPhotoPlaceholder: Boolean(photoLabel),
            storageProvider: "mock",
            evidenceNoticeAccepted,
          },
        },
        {
          familyId: task.contract.familyId,
          actorUserId: null,
          actorType: "system",
          eventName: "parent_response_requested",
          entityType: "Contract",
          entityId: task.contractId,
          metadataJson: { state: "fulfillment_pending" },
        },
      ],
    });
  });

  revalidatePath("/");
  redirect("/child/backyard?status=cat-visit");
}
