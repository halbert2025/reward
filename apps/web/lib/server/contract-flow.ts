import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canConfirmContract, canEditContractDraft } from "@reward/shared/permissions";
import { validateRewardInput } from "@reward/shared/safety-rules";
import { Actor, ContractState } from "@reward/shared/state-machine";
import { requireContractTransition } from "@reward/shared/transition-helpers";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

export async function getFirstContractDraftContext() {
  const actor = await getCurrentActor();
  const parentId = actor.role === "parent" || actor.role === "co_signer" ? actor.id : "seed_parent";
  const family = await prisma.family.findFirst({
    where: {
      createdById: parentId,
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
  const actor = await getCurrentActor();
  const childId = actor.role === "child" ? actor.id : "seed_child";

  return prisma.contract.findFirst({
    where: {
      id: contractId,
      childId,
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
  const actor = await getCurrentActor();

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    redirect("/parent/contracts/new?error=permission");
  }

  const family = familyId
    ? await prisma.family.findUnique({
        where: { id: familyId },
        select: {
          principlesConfirmedAt: true,
          members: {
            where: {
              role: "child",
              status: "active",
              deletedAt: null,
            },
            take: 1,
            select: {
              userId: true,
            },
          },
        },
      })
    : null;
  const childId = family?.members[0]?.userId;

  if (!family?.principlesConfirmedAt || !childId) {
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
  const rewardValidation = validateRewardInput({
    title,
    promiseText,
    rewardText,
    taskText,
    evidenceText,
    repairText,
    screenTimeMinutes: 25,
  });

  if (!wish) {
    redirect("/parent/contracts/new?error=wish");
  }

  if (!rewardValidation.ok) {
    redirect(`/parent/contracts/new?error=${rewardValidation.code}`);
  }

  const contract = await prisma.$transaction(async (tx) => {
    if (contractId) {
      const existing = await tx.contract.findFirst({
        where: {
          id: contractId,
          familyId,
          createdById: actor.id,
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
      const permissionTarget = {
        id: existing.id,
        familyId: existing.familyId,
        childId: existing.childId,
        createdById: existing.createdById,
        state: existing.state as ContractState,
      };

      if (
        actor.familyId !== existing.familyId ||
        (!canEditContractDraft(actor, permissionTarget) &&
          existing.state !== "pending_child_confirm")
      ) {
        throw new Error("Permission denied");
      }

      const nextVersionNumber = (existing.versions[0]?.versionNumber ?? 0) + 1;
      const transitionEvent =
        existing.state === ContractState.Draft
          ? "contract.submit_for_child"
          : "contract.revise_for_child";
      const nextState = requireContractTransition(
        existing.state as ContractState,
        transitionEvent,
        Actor.Parent,
      );
      const version = await tx.contractVersion.create({
        data: {
          contractId: existing.id,
          versionNumber: nextVersionNumber,
          title,
          promiseText,
          rewardText,
          taskText: `${taskText}\nEvidence: ${evidenceText}\nFulfillment: today or within 24 hours.\nRepair: ${repairText}`,
          durationMinutes: 25,
          createdById: actor.id,
        },
      });

      await tx.contract.update({
        where: { id: existing.id },
        data: {
          wishId,
          state: nextState,
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
            actorUserId: actor.id,
            actorType: "parent",
            eventName: "contract_version_created",
            entityType: "ContractVersion",
            entityId: version.id,
            metadataJson: { versionNumber: nextVersionNumber },
          },
          {
            familyId,
            actorUserId: actor.id,
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
        createdById: actor.id,
        childId,
        state: "draft",
        currentVersionNumber: 0,
        tasks: {
          create: {
            assignedChildId: childId,
            title: taskText,
            plannedDurationMinutes: 25,
          },
        },
        memberships: {
          create: [
            {
              familyId,
              userId: actor.id,
              kind: "contract_owner",
              status: "active",
            },
            {
              familyId,
              userId: childId,
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
        createdById: actor.id,
      },
    });

    await tx.contract.update({
      where: { id: created.id },
      data: {
        state: requireContractTransition(
          ContractState.Draft,
          "contract.submit_for_child",
          Actor.Parent,
        ),
        currentVersionNumber: 1,
      },
    });

    await tx.notification.create({
      data: {
        familyId,
        recipientUserId: childId,
        type: "child_confirm_needed",
        title: "A small promise is ready",
        body: "Please review the 25-minute promise before it starts.",
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId,
          actorUserId: actor.id,
          actorType: "parent",
          eventName: "contract_version_created",
          entityType: "ContractVersion",
          entityId: version.id,
          metadataJson: { versionNumber: 1 },
        },
        {
          familyId,
          actorUserId: actor.id,
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
  const actor = await getCurrentActor();
  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      childId: actor.id,
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

  if (
    !canConfirmContract(actor, {
      id: contract.id,
      familyId: contract.familyId,
      childId: contract.childId,
      createdById: contract.createdById,
      state: contract.state as ContractState,
    })
  ) {
    redirect(`/child/contracts/${contractId}/confirm?error=permission`);
  }

  await prisma.$transaction(async (tx) => {
    const confirmedState = requireContractTransition(
      ContractState.PendingChildConfirm,
      "contract.child_confirm",
      Actor.Child,
    );
    const activeState = requireContractTransition(
      confirmedState,
      "contract.activate",
      Actor.System,
    );

    await tx.contractVersion.update({
      where: { id: version.id },
      data: { confirmedAt: new Date() },
    });

    await tx.contract.update({
      where: { id: contract.id },
      data: {
        acceptedVersionId: version.id,
        state: activeState,
      },
    });

    await tx.notification.create({
      data: {
        familyId: contract.familyId,
        recipientUserId: actor.id,
        type: "child_can_start",
        title: "Your 25-minute promise can start",
        body: "The promise is active. Start when you are ready.",
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          familyId: contract.familyId,
          actorUserId: actor.id,
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
