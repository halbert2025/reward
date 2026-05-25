import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createRawToken, getCurrentActor, hashToken } from "./auth/session-auth";
import { prisma } from "./prisma";

export async function getWitnessInviteContext() {
  const actor = await getCurrentActor();
  const parentId = actor.role === "parent" || actor.role === "co_signer" ? actor.id : "seed_parent";

  return prisma.contract.findFirst({
    where: {
      createdById: parentId,
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

export async function getWitnessMemory(rawToken?: string) {
  return prisma.witness.findFirst({
    where: {
      ...(rawToken ? { inviteTokenHash: hashToken(rawToken) } : {}),
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
  const actor = await getCurrentActor();

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    redirect("/parent/witness?error=permission");
  }

  const contract = await prisma.contract.findFirst({
    where: {
      id: contractId,
      createdById: actor.id,
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

  const rawToken = createRawToken(18);
  const witness = await prisma.witness.create({
    data: {
      contractId,
      invitedById: actor.id,
      displayName,
      inviteTokenHash: hashToken(rawToken),
      status: "invited",
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId: contract.familyId,
      actorUserId: actor.id,
      actorType: "parent",
      eventName: "witness_invite_created",
      entityType: "Witness",
      entityId: witness.id,
      metadataJson: { scope: "memorial_only" },
    },
  });

  revalidatePath("/");
  redirect(`/parent/witness?status=created&token=${encodeURIComponent(rawToken)}`);
}

export async function sendWitnessBlessing(formData: FormData) {
  "use server";

  const witnessId = String(formData.get("witnessId") ?? "");
  const blessing = String(formData.get("blessing") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "/witness");
  const safeReturnTo = returnTo.startsWith("/witness") ? returnTo : "/witness";

  if (!blessing) {
    redirect(`${safeReturnTo}?error=empty`);
  }

  const witness = await prisma.witness.findUnique({
    where: { id: witnessId },
    include: { contract: true },
  });

  if (!witness) {
    redirect(`${safeReturnTo}?error=missing`);
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
  revalidatePath(safeReturnTo);
  redirect(`${safeReturnTo}?status=sent`);
}
