import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const principleIds = [
  "no_unilateral_change",
  "respond_after_completion",
  "care_is_not_reward",
  "clear_rules_not_control",
  "child_can_feedback",
] as const;

const forbiddenRewardTerms = [
  "school",
  "class",
  "teacher",
  "cash",
  "wallet",
  "merchant",
  "shopping",
  "video",
  "location",
  "ranking",
  "gacha",
];

export const onboardingPrinciples = [
  {
    id: "no_unilateral_change",
    text: "After a contract is confirmed, acceptance rules can only change through a new version.",
  },
  {
    id: "respond_after_completion",
    text: "After the child completes a promise, the parent should respond or agree on a new time.",
  },
  {
    id: "care_is_not_reward",
    text: "Basic care, love, company, and safety are never used as rewards or trade items.",
  },
  {
    id: "clear_rules_not_control",
    text: "Reward helps the family write clear rules; it is not a child-control tool.",
  },
  {
    id: "child_can_feedback",
    text: "The child may ask to revisit a promise that feels unfair.",
  },
];

export async function ensureParentDemoUser() {
  const parent = await prisma.user.upsert({
    where: { id: "seed_parent" },
    update: {
      displayName: "Demo Parent",
      mockEmail: "parent@reward.local",
      roleHint: "parent",
      deletedAt: null,
    },
    create: {
      id: "seed_parent",
      displayName: "Demo Parent",
      mockEmail: "parent@reward.local",
      roleHint: "parent",
    },
  });

  await prisma.user.upsert({
    where: { id: "seed_child" },
    update: {
      displayName: "Demo Child",
      mockEmail: "child@reward.local",
      roleHint: "child",
      deletedAt: null,
    },
    create: {
      id: "seed_child",
      displayName: "Demo Child",
      mockEmail: "child@reward.local",
      roleHint: "child",
    },
  });

  return parent;
}

export async function getParentOnboardingState() {
  const family = await prisma.family.findFirst({
    where: {
      createdById: "seed_parent",
      archivedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      rewardPools: {
        include: {
          wishes: true,
        },
      },
    },
  });

  return {
    family,
    principlesDone: Boolean(family?.principlesConfirmedAt),
    rewardPoolDone: Boolean(family?.rewardPools.some((pool) => pool.status === "active")),
  };
}

export async function createFamilyFromOnboarding(formData: FormData) {
  "use server";

  const parent = await ensureParentDemoUser();
  const name = String(formData.get("familyName") ?? "").trim();

  if (name.length < 2) {
    redirect("/parent/onboarding?error=family-name");
  }

  const family = await prisma.family.create({
    data: {
      name,
      trustState: "principles_pending",
      createdById: parent.id,
      members: {
        create: [
          {
            userId: "seed_parent",
            role: "parent",
            status: "active",
          },
          {
            userId: "seed_child",
            role: "child",
            status: "active",
          },
        ],
      },
      auditLogs: {
        create: {
          actorUserId: parent.id,
          actorType: "parent",
          eventName: "family_created",
          entityType: "Family",
          entityId: "pending",
          metadataJson: {
            source: "onboarding",
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

  revalidatePath("/");
  redirect("/parent/onboarding?step=principles");
}

export async function confirmPrinciplesFromOnboarding(formData: FormData) {
  "use server";

  const familyId = String(formData.get("familyId") ?? "");
  const checked = new Set(formData.getAll("principles").map(String));
  const allConfirmed = principleIds.every((id) => checked.has(id));

  if (!familyId || !allConfirmed) {
    redirect("/parent/onboarding?step=principles&error=principles");
  }

  await prisma.family.update({
    where: { id: familyId },
    data: {
      principlesConfirmedAt: new Date(),
      trustState: "active",
      auditLogs: {
        create: {
          actorUserId: "seed_parent",
          actorType: "parent",
          eventName: "principles_confirmed",
          entityType: "Family",
          entityId: familyId,
          metadataJson: {
            principleIds,
          },
        },
      },
    },
  });

  revalidatePath("/");
  redirect("/parent/onboarding?step=reward-pool");
}

export async function initializeRewardPoolFromOnboarding(formData: FormData) {
  "use server";

  const familyId = String(formData.get("familyId") ?? "");
  const smallWish = String(formData.get("smallWish") ?? "").trim();
  const mediumWish = String(formData.get("mediumWish") ?? "").trim();
  const largeWish = String(formData.get("largeWish") ?? "").trim();
  const combined = `${smallWish} ${mediumWish} ${largeWish}`.toLowerCase();
  const hasForbidden = forbiddenRewardTerms.some((term) => combined.includes(term));

  const family = familyId
    ? await prisma.family.findUnique({
        where: { id: familyId },
        select: { principlesConfirmedAt: true },
      })
    : null;

  if (!family?.principlesConfirmedAt) {
    redirect("/parent/onboarding?step=principles&error=principles-required");
  }

  if (!smallWish || hasForbidden) {
    redirect("/parent/onboarding?step=reward-pool&error=reward-pool");
  }

  const pool = await prisma.rewardPool.create({
    data: {
      familyId,
      createdById: "seed_parent",
      title: "Family wish pool",
      status: "active",
      wishes: {
        create: [
          {
            title: smallWish,
            description: "Small wish for the first 25-minute promise.",
            category: "experience",
            safetyStatus: "approved",
          },
          ...(mediumWish
            ? [
                {
                  title: mediumWish,
                  description: "Medium wish placeholder for later contracts.",
                  category: "experience" as const,
                  safetyStatus: "approved" as const,
                },
              ]
            : []),
          ...(largeWish
            ? [
                {
                  title: largeWish,
                  description: "Large wish placeholder for future planning.",
                  category: "experience" as const,
                  safetyStatus: "approved" as const,
                },
              ]
            : []),
        ],
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId,
      actorUserId: "seed_parent",
      actorType: "parent",
      eventName: "reward_pool_initialized",
      entityType: "RewardPool",
      entityId: pool.id,
      metadataJson: {
        source: "onboarding",
      },
    },
  });

  revalidatePath("/");
  redirect("/parent/onboarding?step=done");
}
