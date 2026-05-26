import { PrismaClient } from "@prisma/client";

const appEnv = process.env.APP_ENV || process.env.NODE_ENV || "local";
const allowSeed = process.env.ALLOW_DEMO_SEED === "true";

if ((appEnv === "pilot" || appEnv === "production") && !allowSeed) {
  console.error(
    "Refusing to run demo seed in pilot/production. Set ALLOW_DEMO_SEED=true only for an explicit recovery sandbox.",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const ids = {
  parent: "seed_parent",
  child: "seed_child",
  family: "seed_family",
  parentMember: "seed_member_parent",
  childMember: "seed_member_child",
  pool: "seed_reward_pool",
  wish: "seed_wish",
  contract: "seed_contract",
  version: "seed_contract_version_1",
  task: "seed_task",
  childNote: "seed_child_note",
};

async function audit(eventName, entityType, entityId, actorUserId, actorType) {
  await prisma.auditLog.create({
    data: {
      familyId: ids.family,
      actorUserId,
      actorType,
      eventName,
      entityType,
      entityId,
      metadataJson: {
        seed: true,
      },
    },
  });
}

async function main() {
  await prisma.auditLog.deleteMany({
    where: {
      familyId: ids.family,
    },
  });
  await prisma.notification.deleteMany({
    where: {
      familyId: ids.family,
    },
  });
  await prisma.diaryEntry.deleteMany({
    where: {
      contractId: ids.contract,
    },
  });
  await prisma.fulfillment.deleteMany({
    where: {
      contractId: ids.contract,
    },
  });
  await prisma.repairCase.deleteMany({
    where: {
      contractId: ids.contract,
    },
  });
  await prisma.witness.deleteMany({
    where: {
      contractId: ids.contract,
    },
  });
  await prisma.evidence.deleteMany({
    where: {
      taskId: ids.task,
    },
  });
  await prisma.focusSession.deleteMany({
    where: {
      taskId: ids.task,
    },
  });

  await prisma.user.upsert({
    where: { id: ids.parent },
    update: {
      displayName: "Demo Parent",
      mockEmail: "parent@reward.local",
      roleHint: "parent",
      deletedAt: null,
    },
    create: {
      id: ids.parent,
      displayName: "Demo Parent",
      mockEmail: "parent@reward.local",
      roleHint: "parent",
    },
  });

  await prisma.user.upsert({
    where: { id: ids.child },
    update: {
      displayName: "Demo Child",
      mockEmail: "child@reward.local",
      roleHint: "child",
      deletedAt: null,
    },
    create: {
      id: ids.child,
      displayName: "Demo Child",
      mockEmail: "child@reward.local",
      roleHint: "child",
    },
  });

  await prisma.family.upsert({
    where: { id: ids.family },
    update: {
      name: "Demo Family",
      trustState: "active",
      createdById: ids.parent,
      archivedAt: null,
    },
    create: {
      id: ids.family,
      name: "Demo Family",
      trustState: "active",
      principlesConfirmedAt: new Date(),
      createdById: ids.parent,
    },
  });

  await prisma.familyMember.upsert({
    where: {
      familyId_userId_role: {
        familyId: ids.family,
        userId: ids.parent,
        role: "parent",
      },
    },
    update: {
      status: "active",
      deletedAt: null,
    },
    create: {
      id: ids.parentMember,
      familyId: ids.family,
      userId: ids.parent,
      role: "parent",
      status: "active",
    },
  });

  await prisma.familyMember.upsert({
    where: {
      familyId_userId_role: {
        familyId: ids.family,
        userId: ids.child,
        role: "child",
      },
    },
    update: {
      status: "active",
      deletedAt: null,
    },
    create: {
      id: ids.childMember,
      familyId: ids.family,
      userId: ids.child,
      role: "child",
      status: "active",
    },
  });

  await prisma.rewardPool.upsert({
    where: { id: ids.pool },
    update: {
      title: "Small Wish Pool",
      status: "active",
      archivedAt: null,
    },
    create: {
      id: ids.pool,
      familyId: ids.family,
      createdById: ids.parent,
      title: "Small Wish Pool",
      status: "active",
    },
  });

  await prisma.wish.upsert({
    where: { id: ids.wish },
    update: {
      title: "Choose tonight's bedtime story",
      description: "A small family wish after one focused 25-minute effort.",
      category: "experience",
      safetyStatus: "approved",
      archivedAt: null,
    },
    create: {
      id: ids.wish,
      rewardPoolId: ids.pool,
      title: "Choose tonight's bedtime story",
      description: "A small family wish after one focused 25-minute effort.",
      category: "experience",
      safetyStatus: "approved",
    },
  });

  await prisma.contract.upsert({
    where: { id: ids.contract },
    update: {
      familyId: ids.family,
      wishId: ids.wish,
      createdById: ids.parent,
      childId: ids.child,
      state: "pending_child_confirm",
      currentVersionNumber: 1,
      archivedAt: null,
    },
    create: {
      id: ids.contract,
      familyId: ids.family,
      wishId: ids.wish,
      createdById: ids.parent,
      childId: ids.child,
      state: "pending_child_confirm",
      currentVersionNumber: 1,
    },
  });

  await prisma.contractVersion.upsert({
    where: {
      contractId_versionNumber: {
        contractId: ids.contract,
        versionNumber: 1,
      },
    },
    update: {
      title: "25-minute wish pomodoro",
      promiseText: "I will focus on one small task for 25 minutes.",
      rewardText: "After completion, I can choose tonight's bedtime story.",
      taskText: "Start the wish pomodoro and submit one sentence reflection.",
      durationMinutes: 25,
      createdById: ids.parent,
    },
    create: {
      id: ids.version,
      contractId: ids.contract,
      versionNumber: 1,
      title: "25-minute wish pomodoro",
      promiseText: "I will focus on one small task for 25 minutes.",
      rewardText: "After completion, I can choose tonight's bedtime story.",
      taskText: "Start the wish pomodoro and submit one sentence reflection.",
      durationMinutes: 25,
      createdById: ids.parent,
    },
  });

  await prisma.task.upsert({
    where: { id: ids.task },
    update: {
      contractId: ids.contract,
      assignedChildId: ids.child,
      state: "not_started",
      title: "25-minute wish pomodoro",
      plannedDurationMinutes: 25,
      archivedAt: null,
    },
    create: {
      id: ids.task,
      contractId: ids.contract,
      assignedChildId: ids.child,
      state: "not_started",
      title: "25-minute wish pomodoro",
      plannedDurationMinutes: 25,
    },
  });

  await prisma.childNote.upsert({
    where: { id: ids.childNote },
    update: {
      familyId: ids.family,
      childId: ids.child,
      contractId: ids.contract,
      body: "This is my private note. Parent should not see this by default.",
      visibility: "child_private",
      archivedAt: null,
    },
    create: {
      id: ids.childNote,
      familyId: ids.family,
      childId: ids.child,
      contractId: ids.contract,
      body: "This is my private note. Parent should not see this by default.",
      visibility: "child_private",
    },
  });

  await audit("family_created", "Family", ids.family, ids.parent, "parent");
  await audit("principles_confirmed", "Family", ids.family, ids.parent, "parent");
  await audit("reward_pool_initialized", "RewardPool", ids.pool, ids.parent, "parent");
  await audit("contract_submitted", "Contract", ids.contract, ids.parent, "parent");
  await audit("contract_version_created", "ContractVersion", ids.version, ids.parent, "parent");
  await audit("child_note_created", "ChildNote", ids.childNote, ids.child, "child");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded Reward MVP demo data.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
