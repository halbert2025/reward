import type { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma";

export class RewardRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  getSeedFamily() {
    return this.db.family.findFirst({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        rewardPools: {
          include: {
            wishes: true,
          },
        },
        contracts: {
          include: {
            versions: true,
            tasks: true,
          },
        },
      },
    });
  }

  getContractWithVersions(contractId: string) {
    return this.db.contract.findUnique({
      where: { id: contractId },
      include: {
        versions: true,
        tasks: true,
        fulfillments: true,
      },
    });
  }

  getChildPrivateNotes(childId: string) {
    return this.db.childNote.findMany({
      where: {
        childId,
        visibility: "child_private",
        archivedAt: null,
      },
    });
  }

  countAuditLogs(familyId: string) {
    return this.db.auditLog.count({
      where: {
        familyId,
      },
    });
  }
}
