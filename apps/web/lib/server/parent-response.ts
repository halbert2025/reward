import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ContractState, FulfillmentResponseType, FulfillmentState } from "@prisma/client";
import { canCreateFulfillment } from "@reward/shared/permissions";
import { validateNeutralRepairMessage } from "@reward/shared/safety-rules";
import { Actor, ContractState as SharedContractState } from "@reward/shared/state-machine";
import { requireContractTransition } from "@reward/shared/transition-helpers";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

export async function getPendingParentResponse() {
  const actor = await getCurrentActor();
  const parentId = actor.role === "parent" || actor.role === "co_signer" ? actor.id : "seed_parent";

  return prisma.contract.findFirst({
    where: {
      createdById: parentId,
      state: "fulfillment_pending",
      archivedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    include: {
      family: true,
      wish: true,
      tasks: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: {
          evidence: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
    },
  });
}

export async function getDiaryEntry(diaryId: string) {
  return prisma.diaryEntry.findUnique({
    where: { id: diaryId },
    include: {
      contract: {
        include: {
          wish: true,
          tasks: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            include: {
              evidence: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
          fulfillments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });
}

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitParentResponse(formData: FormData) {
  "use server";

  const contractId = clean(formData, "contractId");
  const responseType = clean(formData, "responseType");
  const message = clean(formData, "message");
  const delayReason = clean(formData, "delayReason");
  const expectedAt = clean(formData, "expectedAt");
  const actor = await getCurrentActor();

  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      createdById: actor.id,
      state: "fulfillment_pending",
      archivedAt: null,
    },
  });

  if (!contract) {
    redirect("/parent/response?error=missing");
  }

  if (
    !canCreateFulfillment(actor, {
      id: contract.id,
      familyId: contract.familyId,
      childId: contract.childId,
      createdById: contract.createdById,
      state: contract.state as SharedContractState,
    })
  ) {
    redirect("/parent/response?error=permission");
  }

  if (responseType === "delayed" && (!delayReason || !expectedAt)) {
    redirect(`/parent/response?contractId=${contractId}&error=delay`);
  }

  if (!["fulfilled", "delayed", "pending_repair"].includes(responseType)) {
    redirect(`/parent/response?contractId=${contractId}&error=response`);
  }

  if (responseType === "pending_repair") {
    const repairValidation = validateNeutralRepairMessage(message);
    if (!repairValidation.ok) {
      redirect(`/parent/response?contractId=${contractId}&error=${repairValidation.code}`);
    }
  }

  const response = responseType as FulfillmentResponseType;
  const fulfillmentState = response as FulfillmentState;
  const responseEvent =
    response === "fulfilled"
      ? "fulfillment.mark_fulfilled"
      : response === "delayed"
        ? "fulfillment.mark_delayed"
        : "fulfillment.request_repair";
  const responseLabel =
    responseType === "fulfilled"
      ? "Fulfilled"
      : responseType === "delayed"
        ? `Delayed: ${delayReason}`
        : "Ready for a family review";

  const diaryEntry = await prisma.$transaction(async (tx) => {
    const source = await tx.contract.findFirst({
      where: {
        id: contractId,
        createdById: actor.id,
        state: "fulfillment_pending",
        archivedAt: null,
      },
      include: {
        wish: true,
        tasks: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          include: {
            evidence: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });
    const task = source?.tasks[0];
    const evidence = task?.evidence[0];

    if (!source || !task || !evidence) {
      throw new Error("Diary source missing");
    }
    const responseContractState = requireContractTransition(
      source.state as SharedContractState,
      responseEvent,
      Actor.Parent,
    );
    const diaryGeneratedState = requireContractTransition(
      responseContractState,
      "diary.generate",
      Actor.System,
    );

    const fulfillment = await tx.fulfillment.create({
      data: {
        contractId,
        respondedById: actor.id,
        state: fulfillmentState,
        responseType: response,
        message: response === "delayed" ? delayReason : message || null,
        expectedAt: response === "delayed" ? new Date(expectedAt) : null,
        closedAt: response === "fulfilled" ? new Date() : null,
      },
    });

    let repairCaseId: string | null = null;
    if (response === "pending_repair") {
      const repairCase = await tx.repairCase.create({
        data: {
          contractId,
          openedById: actor.id,
          state: "opened",
          parentMessage: message,
        },
      });
      repairCaseId = repairCase.id;
    }

    const diary = await tx.diaryEntry.create({
      data: {
        familyId: source.familyId,
        contractId: source.id,
        title: `${source.wish?.title ?? "Small wish"} memory card`,
        summary: [
          `Wish: ${source.wish?.title ?? "Small family wish"}`,
          `Task: ${task.title}`,
          `Child reflection: ${evidence.reflectionText}`,
          `Parent response: ${responseLabel}`,
          `Completed at: ${task.completedAt?.toISOString() ?? evidence.createdAt.toISOString()}`,
          "Quiet cat visit: The quiet cat came to the backyard and kept this effort as a small memory.",
        ].join("\n"),
        parentMessage: message || null,
        childReflectionExcerpt: evidence.reflectionText,
        backyardSignal: "quiet_cat_visit",
      },
    });

    await tx.contract.update({
      where: { id: source.id },
      data: {
        state: diaryGeneratedState as unknown as ContractState,
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId: source.familyId,
          actorUserId: actor.id,
          actorType: "parent",
          eventName:
            responseType === "fulfilled"
              ? "fulfillment_marked_fulfilled"
              : responseType === "delayed"
                ? "fulfillment_marked_delayed"
                : "repair_requested",
          entityType: responseType === "pending_repair" ? "RepairCase" : "Fulfillment",
          entityId: repairCaseId ?? fulfillment.id,
          metadataJson: {
            responseType,
            expectedAt: expectedAt || null,
          },
        },
        {
          familyId: source.familyId,
          actorUserId: null,
          actorType: "system",
          eventName: "diary_generated",
          entityType: "DiaryEntry",
          entityId: diary.id,
          metadataJson: { fulfillmentId: fulfillment.id },
        },
      ],
    });

    return diary;
  });

  revalidatePath("/");
  redirect(`/family/diary/${diaryEntry.id}`);
}
