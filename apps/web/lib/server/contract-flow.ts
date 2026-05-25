import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const forbiddenContractTerms = [
  "school",
  "class",
  "teacher",
  "institution",
  "merchant",
  "payment",
  "wallet",
  "cash",
  "store",
  "shopping",
];

export async function getFirstContractDraftContext() {
  const family = await prisma.family.findFirst({
    where: {
      createdById: "seed_parent",
      archivedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      members: {
        where: {
          role: "child",
          status: "active",
        },
        include: {
          user: true,
        },
      },
      rewardPools: {
        where: {
          status: "active",
          archivedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          wishes: {
            where: {
              safetyStatus: "approved",
              archivedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  return {
    family,
    child: family?.members[0]?.user,
    wishes: family?.rewardPools.flatMap((pool) => pool.wishes) ?? [],
  };
}

export async function getContractForPreview(contractId: string) {
  return prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      family: true,
      wish: true,
      tasks: {
        orderBy: {
          createdAt: "asc",
        },
      },
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
      },
    },
  });
}

export async function getChildConfirmContract(contractId: string) {
  return prisma.contract.findFirst({
    where: {
      id: contractId,
      childId: "seed_child",
      archivedAt: null,
    },
    include: {
      family: true,
      wish: true,
      tasks: true,
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
      },
    },
  });
}

function getCleanText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function containsForbiddenContractTerm(value: string) {
  const normalized = value.toLowerCase();
  return forbiddenContractTerms.some((term) => normalized.includes(term));
}

export async function createOrReviseFirstContract(formData: FormData) {
  "use server";

  const contractId = getCleanText(formData, "contractId");
  const familyId = getCleanText(formData, "familyId");
  const wishId = getCleanText(formData, "wishId");
  const title = getCleanText(formData, "title") || "First 25-minute promise";
  const promiseText =
    getCleanText(formData, "promiseText") ||
    "I will complete one focused 25-minute wish pomodoro.";
  const taskText =
    getCleanText(formData, "taskText") ||
    "Complete 1 focused 25-minute wish pomodoro.";
  const evidenceText =
    getCleanText(formData, "evidenceText") ||
    "Pomodoro completion plus one reflection sentence.";
  const repairText =
    getCleanText(formData, "repairText") || "The child may restart once.";

  const family = familyId
    ? await prisma.family.findUnique({
        where: { id: familyId },
        select: { principlesConfirmedAt: true },
      })
    : null;

  if (!family?.principlesConfirmedAt) {
    redirect("/parent/onboarding?step=principles&error=principles-required");
  }

  const wish = await prisma.wish.findFirst({
    where: {
      id: wishId,
      rewardPool: {
        familyId,
        status: "active",
      },
      safetyStatus: "approved",
      archivedAt: null,
    },
  });

  const rewardText = wish ? `Small wish reward: ${wish.title}` : "";
  const combined = `${title} ${promiseText} ${taskText} ${evidenceText} ${rewardText}`;

  if (!wish || containsForbiddenContractTerm(combined)) {
    redirect("/parent/contracts/new?error=contract");
  }

  const contract = await prisma.$transaction(async (tx) => {
    if (contractId) {
      const existing = await tx.contract.findFirst({
        where: {
          id: contractId,
          familyId,
          createdById: "seed_parent",
          archivedAt: null,
        },
        include: {
          versions: {
            orderBy: {
              versionNumber: "desc",
            },
            take: 1,
          },
        },
      });

      if (!existing) {
        throw new Error("Contract not found");
      }

      const nextVersionNumber = (existing.versions[0]?.versionNumber ?? 0) + 1;
      const version = await tx.contractVersion.create({
        data: {
          contractId: existing.id,
          versionNumber: nextVersionNumber,
          title,
          promiseText,
          rewardText,
          taskText: `${taskText}\nEvidence: ${evidenceText}\nFulfillment: today or within 24 hours.\nRepair: ${repairText}`,
          durationMinutes: 25,
          createdById: "seed_parent",
        },
      });

      await tx.contract.update({
        where: { id: existing.id },
        data: {
          wishId,
          state: "pending_child_confirm",
          acceptedVersionId: null,
          currentVersionNumber: nextVersionNumber,
          tasks: {
            updateMany: {
              where: { contractId: existing.id },
              data: {
                title: taskText,
                plannedDurationMinutes: 25,
                state: "not_started",
              },
            },
          },
        },
      });

      await tx.auditLog.createMany({
        data: [
          {
            familyId,
            actorUserId: "seed_parent",
            actorType: "parent",
            eventName: "contract_version_created",
            entityType: "ContractVersion",
            entityId: version.id,
            metadataJson: { versionNumber: nextVersionNumber },
          },
          {
            familyId,
            actorUserId: "seed_parent",
            actorType: "parent",
            eventName: "contract_submitted",
            entityType: "Contract",
            entityId: existing.id,
            metadataJson: { state: "pending_child_confirm" },
          },
        ],
      });

      return existing;
    }

    const created = await tx.contract.create({
      data: {
        familyId,
        wishId,
        createdById: "seed_parent",
        childId: "seed_child",
        state: "draft",
        currentVersionNumber: 0,
        tasks: {
          create: {
            assignedChildId: "seed_child",
            title: taskText,
            plannedDurationMinutes: 25,
          },
        },
        memberships: {
          create: [
            {
              familyId,
              userId: "seed_parent",
              kind: "contract_owner",
              status: "active",
            },
            {
              familyId,
              userId: "seed_child",
              kind: "contract_child",
              status: "active",
            },
          ],
        },
      },
    });

    const version = await tx.contractVersion.create({
      data: {
        contractId: created.id,
        versionNumber: 1,
        title,
        promiseText,
        rewardText,
        taskText: `${taskText}\nEvidence: ${evidenceText}\nFulfillment: today or within 24 hours.\nRepair: ${repairText}`,
        durationMinutes: 25,
        createdById: "seed_parent",
      },
    });

    await tx.contract.update({
      where: { id: created.id },
      data: {
        state: "pending_child_confirm",
        currentVersionNumber: 1,
      },
    });

    await tx.notification.create({
      data: {
        familyId,
        recipientUserId: "seed_child",
        type: "child_confirm_needed",
        title: "A small promise is ready",
        body: "Please review the 25-minute promise before it starts.",
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId,
          actorUserId: "seed_parent",
          actorType: "parent",
          eventName: "contract_version_created",
          entityType: "ContractVersion",
          entityId: version.id,
          metadataJson: { versionNumber: 1 },
        },
        {
          familyId,
          actorUserId: "seed_parent",
          actorType: "parent",
          eventName: "contract_submitted",
          entityType: "Contract",
          entityId: created.id,
          metadataJson: { from: "draft", to: "pending_child_confirm" },
        },
      ],
    });

    return created;
  });

  revalidatePath("/");
  redirect(`/parent/contracts/${contract.id}/preview`);
}

export async function childConfirmFirstContract(formData: FormData) {
  "use server";

  const contractId = getCleanText(formData, "contractId");
  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      childId: "seed_child",
      state: "pending_child_confirm",
      archivedAt: null,
    },
    include: {
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
        take: 1,
      },
    },
  });

  const version = contract?.versions[0];

  if (!contract || !version) {
    redirect(`/child/contracts/${contractId}/confirm?error=stale`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.contractVersion.update({
      where: { id: version.id },
      data: { confirmedAt: new Date() },
    });

    await tx.contract.update({
      where: { id: contract.id },
      data: {
        acceptedVersionId: version.id,
        state: "active",
      },
    });

    await tx.notification.create({
      data: {
        familyId: contract.familyId,
        recipientUserId: "seed_child",
        type: "child_can_start",
        title: "Your 25-minute promise can start",
        body: "The promise is active. Start when you are ready.",
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId: contract.familyId,
          actorUserId: "seed_child",
          actorType: "child",
          eventName: "contract_child_confirmed",
          entityType: "ContractVersion",
          entityId: version.id,
          metadataJson: { state: "confirmed" },
        },
        {
          familyId: contract.familyId,
          actorUserId: null,
          actorType: "system",
          eventName: "contract_activated",
          entityType: "Contract",
          entityId: contract.id,
          metadataJson: { acceptedVersionId: version.id },
        },
      ],
    });
  });

  revalidatePath("/");
  redirect(`/child/contracts/${contract.id}/confirm?status=active`);
}
