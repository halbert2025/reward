import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getCurrentActor } from "./auth/session-auth";
import { areNewInvitesPaused, recordOperationalEvent } from "./operational-events";
import { createDisplayCode, createUserSession, hashToken } from "./auth/session-auth";
import { PILOT_CONSENT_VERSION } from "./pilot-consent";
import { prisma } from "./prisma";

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function getParentFamilies() {
  const actor = await getCurrentActor();

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    return [];
  }

  return prisma.family.findMany({
    where: {
      members: {
        some: {
          userId: actor.id,
          role: "parent",
          status: "active",
        },
      },
      archivedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      invites: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });
}

export async function createPilotFamily(formData: FormData) {
  "use server";

  const actor = await getCurrentActor();
  const familyName = clean(formData, "familyName");

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    redirect("/family/new?error=permission");
  }

  if (familyName.length < 2) {
    redirect("/family/new?error=family-name");
  }

  const consent = await prisma.pilotConsent.findFirst({
    where: {
      userId: actor.id,
      scope: "guardian_pilot",
      version: PILOT_CONSENT_VERSION,
      status: "accepted",
    },
  });

  if (!consent) {
    redirect("/pilot/consent?error=required");
  }

  const family = await prisma.family.create({
    data: {
      name: familyName,
      createdById: actor.id,
      trustState: "principles_pending",
      members: {
        create: {
          userId: actor.id,
          role: "parent",
          status: "active",
        },
      },
      auditLogs: {
        create: {
          actorUserId: actor.id,
          actorType: "parent",
          eventName: "pilot_family_created",
          entityType: "Family",
          entityId: "pending",
          metadataJson: {
            source: "pilot",
          },
        },
      },
    },
  });

  await prisma.auditLog.updateMany({
    where: {
      familyId: family.id,
      entityType: "Family",
      entityId: "pending",
    },
    data: {
      entityId: family.id,
    },
  });

  await prisma.pilotConsent.update({
    where: { id: consent.id },
    data: { familyId: family.id },
  });

  redirect("/parent/invites");
}

export async function createChildInvite(formData: FormData) {
  "use server";

  const actor = await getCurrentActor();
  const familyId = clean(formData, "familyId");

  if (areNewInvitesPaused()) {
    await recordOperationalEvent({
      level: "warn",
      eventName: "child_invite_paused",
      message: "Child invite creation blocked because new invites are paused.",
      actorUserId: actor.id,
      familyId,
    });
    redirect("/parent/invites?error=paused");
  }

  if (actor.role !== "parent" && actor.role !== "co_signer") {
    await recordOperationalEvent({
      level: "warn",
      eventName: "child_invite_permission_denied",
      message: "Non-parent attempted to create a child invite.",
      actorUserId: actor.id,
      familyId,
    });
    redirect("/parent/invites?error=permission");
  }

  const family = await prisma.family.findFirst({
    where: {
      id: familyId,
      members: {
        some: {
          userId: actor.id,
          role: "parent",
          status: "active",
        },
      },
      archivedAt: null,
    },
  });

  if (!family) {
    redirect("/parent/invites?error=family");
  }

  const code = createDisplayCode();
  const invite = await prisma.familyInvite.create({
    data: {
      familyId,
      createdById: actor.id,
      role: "child",
      displayCode: code,
      tokenHash: hashToken(code),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId,
      actorUserId: actor.id,
      actorType: "parent",
      eventName: "child_invite_created",
      entityType: "FamilyInvite",
      entityId: invite.id,
      metadataJson: {
        expiresAt: invite.expiresAt.toISOString(),
      },
    },
  });

  redirect(`/parent/invites?created=${encodeURIComponent(code)}`);
}

export async function joinFamilyWithChildInvite(formData: FormData) {
  "use server";

  const code = clean(formData, "code").toUpperCase();
  const nickname = clean(formData, "nickname");

  if (code.length < 6 || nickname.length < 1 || nickname.length > 40) {
    redirect(`/invite/child/${encodeURIComponent(code || "new")}?error=input`);
  }

  const invite = await prisma.familyInvite.findFirst({
    where: {
      displayCode: code,
      tokenHash: hashToken(code),
      role: "child",
      status: "active",
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!invite || invite.usedCount >= invite.maxUses) {
    redirect(`/invite/child/${encodeURIComponent(code)}?error=invite`);
  }

  const child = await prisma.user.create({
    data: {
      displayName: nickname,
      roleHint: "child",
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.familyMember.create({
      data: {
        familyId: invite.familyId,
        userId: child.id,
        role: Role.child,
        status: "active",
      },
    });

    await tx.familyInvite.update({
      where: { id: invite.id },
      data: {
        usedCount: {
          increment: 1,
        },
        status: "used",
      },
    });

    await tx.auditLog.create({
      data: {
        familyId: invite.familyId,
        actorUserId: child.id,
        actorType: "child",
        eventName: "child_joined_family",
        entityType: "FamilyInvite",
        entityId: invite.id,
        metadataJson: {
          nickname,
        },
      },
    });
  });

  await createUserSession(child.id);
  redirect("/child/backyard");
}
