import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function assertCount(label, count) {
  if (count < 1) {
    throw new Error(`Expected at least one ${label}, found ${count}`);
  }
}

async function main() {
  const [
    families,
    parents,
    children,
    wishes,
    contracts,
    versions,
    childNotes,
    evidence,
    auditLogs,
  ] = await Promise.all([
    prisma.family.count(),
    prisma.user.count({ where: { roleHint: "parent" } }),
    prisma.user.count({ where: { roleHint: "child" } }),
    prisma.wish.count(),
    prisma.contract.count(),
    prisma.contractVersion.count(),
    prisma.childNote.count({ where: { visibility: "child_private" } }),
    prisma.evidence.count(),
    prisma.auditLog.count(),
  ]);

  await assertCount("family", families);
  await assertCount("parent", parents);
  await assertCount("child", children);
  await assertCount("wish", wishes);
  await assertCount("contract", contracts);
  await assertCount("ContractVersion", versions);
  await assertCount("private ChildNote", childNotes);
  await assertCount("AuditLog", auditLogs);

  const parentVisibleChildNotes = await prisma.childNote.count({
    where: {
      visibility: {
        not: "child_private",
      },
    },
  });

  if (parentVisibleChildNotes !== 0) {
    throw new Error("ChildNote privacy violation: found non-private ChildNote rows.");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        families,
        parents,
        children,
        wishes,
        contracts,
        contractVersions: versions,
        privateChildNotes: childNotes,
        evidenceRows: evidence,
        auditLogs,
        childNoteDefaultPrivate: true,
        childNoteAndEvidenceSeparated: true,
      },
      null,
      2,
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
