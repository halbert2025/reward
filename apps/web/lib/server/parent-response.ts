import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ContractState, FulfillmentResponseType, FulfillmentState } from "@prisma/client";
import { prisma } from "./prisma";

export async function getPendingParentResponse() {
  return prisma.contract.findFirst({
    where: {
      createdById: "seed_parent",
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

async function createDiaryForResponse(
  contractId: string,
  responseLabel: string,
  parentMessage: string,
) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
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
    },
  });

  const task = contract?.tasks[0];
  const evidence = task?.evidence[0];

  if (!contract || !task || !evidence) {
    throw new Error("Diary source missing");
  }

  return prisma.diaryEntry.create({
    data: {
      familyId: contract.familyId,
      contractId: contract.id,
      title: `${contract.wish?.title ?? "Small wish"} memory card`,
      summary: [
        `Wish: ${contract.wish?.title ?? "Small family wish"}`,
        `Task: ${task.title}`,
        `Child reflection: ${evidence.reflectionText}`,
        `Parent response: ${responseLabel}`,
        `Completed at: ${task.completedAt?.toISOString() ?? evidence.createdAt.toISOString()}`,
        "Quiet cat visit: The quiet cat came to the backyard and kept this effort as a small memory.",
      ].join("\n"),
      parentMessage: parentMessage || null,
      childReflectionExcerpt: evidence.reflectionText,
      backyardSignal: "quiet_cat_visit",
    },
  });
}

export async function submitParentResponse(formData: FormData) {
  "use server";

  const contractId = clean(formData, "contractId");
  const responseType = clean(formData, "responseType");
  const message = clean(formData, "message");
  const delayReason = clean(formData, "delayReason");
  const expectedAt = clean(formData, "expectedAt");

  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      createdById: "seed_parent",
      state: "fulfillment_pending",
      archivedAt: null,
    },
  });

  if (!contract) {
    redirect("/parent/response?error=missing");
  }

  if (responseType === "delayed" && (!delayReason || !expectedAt)) {
    redirect(`/parent/response?contractId=${contractId}&error=delay`);
  }

  if (!["fulfilled", "delayed", "pending_repair"].includes(responseType)) {
    redirect(`/parent/response?contractId=${contractId}&error=response`);
  }

  const response = responseType as FulfillmentResponseType;
  const fulfillmentState = response as FulfillmentState;
  const nextContractState = response as ContractState;

  const diary = await prisma.$transaction(async (tx) => {
    const fulfillment = await tx.fulfillment.create({
      data: {
        contractId,
        respondedById: "seed_parent",
        state: fulfillmentState,
        responseType: response,
        message: response === "delayed" ? delayReason : message || null,
        expectedAt: response === "delayed" ? new Date(expectedAt) : null,
        closedAt: response === "fulfilled" ? new Date() : null,
      },
    });

    if (response === "pending_repair") {
      await tx.repairCase.create({
        data: {
          contractId,
          openedById: "seed_parent",
          state: "opened",
          parentMessage: message || "This wish needs a small family review.",
        },
      });
    }

    await tx.contract.update({
      where: { id: contractId },
      data: {
        state: nextContractState,
      },
    });

    await tx.auditLog.create({
      data: {
        familyId: contract.familyId,
        actorUserId: "seed_parent",
        actorType: "parent",
        eventName:
          responseType === "fulfilled"
            ? "fulfillment_marked_fulfilled"
            : responseType === "delayed"
              ? "fulfillment_marked_delayed"
              : "repair_requested",
        entityType: responseType === "pending_repair" ? "RepairCase" : "Fulfillment",
        entityId: fulfillment.id,
        metadataJson: {
          responseType,
          expectedAt: expectedAt || null,
        },
      },
    });

    return fulfillment;
  });

  const diaryEntry = await createDiaryForResponse(
    contractId,
    responseType === "fulfilled"
      ? "Fulfilled"
      : responseType === "delayed"
        ? `Delayed: ${delayReason}`
        : "Ready for a family review",
    message,
  );

  await prisma.$transaction([
    prisma.contract.update({
      where: { id: contractId },
      data: { state: "diary_generated" },
    }),
    prisma.auditLog.create({
      data: {
        familyId: contract.familyId,
        actorUserId: null,
        actorType: "system",
        eventName: "diary_generated",
        entityType: "DiaryEntry",
        entityId: diaryEntry.id,
        metadataJson: { fulfillmentId: diary.id },
      },
    }),
  ]);

  revalidatePath("/");
  redirect(`/family/diary/${diaryEntry.id}`);
}
