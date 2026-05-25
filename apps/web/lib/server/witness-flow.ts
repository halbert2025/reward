import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function getWitnessInviteContext() {
  return prisma.contract.findFirst({
    where: {
      createdById: "seed_parent",
      archivedAt: null,
      state: {
        in: ["diary_generated", "fulfilled", "delayed"],
      },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      wish: true,
      witnesses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      diaryEntries: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function getWitnessMemory() {
  return prisma.witness.findFirst({
    where: {
      status: {
        in: ["invited", "accepted"],
      },
      contract: {
        archivedAt: null,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      contract: {
        include: {
          wish: true,
          diaryEntries: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 1,
          },
        },
      },
    },
  });
}

export async function createWitnessInvite(formData: FormData) {
  "use server";

  const contractId = String(formData.get("contractId") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim() || "Memory witness";
  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      createdById: "seed_parent",
      archivedAt: null,
    },
  });

  if (!contract) {
    redirect("/parent/witness?error=missing");
  }

  const count = await prisma.witness.count({
    where: { contractId },
  });

  if (count >= 1) {
    redirect("/parent/witness?error=limit");
  }

  const witness = await prisma.witness.create({
    data: {
      contractId,
      invitedById: "seed_parent",
      displayName,
      inviteTokenHash: `demo-${contractId}`,
      status: "invited",
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId: contract.familyId,
      actorUserId: "seed_parent",
      actorType: "parent",
      eventName: "witness_invited",
      entityType: "Witness",
      entityId: witness.id,
      metadataJson: { scope: "memorial_only" },
    },
  });

  revalidatePath("/");
  redirect("/parent/witness?status=created");
}

export async function sendWitnessBlessing(formData: FormData) {
  "use server";

  const witnessId = String(formData.get("witnessId") ?? "");
  const blessing = String(formData.get("blessing") ?? "").trim();

  if (!blessing) {
    redirect("/witness?error=empty");
  }

  const witness = await prisma.witness.findUnique({
    where: { id: witnessId },
    include: { contract: true },
  });

  if (!witness) {
    redirect("/witness?error=missing");
  }

  await prisma.witness.update({
    where: { id: witness.id },
    data: {
      status: "accepted",
      acceptedAt: witness.acceptedAt ?? new Date(),
      blessingMessage: blessing,
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId: witness.contract.familyId,
      actorUserId: null,
      actorType: "witness",
      eventName: "witness_blessing_sent",
      entityType: "Witness",
      entityId: witness.id,
      metadataJson: { memorialOnly: true },
    },
  });

  revalidatePath("/witness");
  redirect("/witness?status=sent");
}
