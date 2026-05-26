import { prisma } from "./prisma";
import { getCurrentActor } from "./auth/session-auth";

export async function getChildBackyardState() {
  const actor = await getCurrentActor();
  const childId = actor.role === "child" ? actor.id : "seed_child";
  const contract = await prisma.contract.findFirst({
    where: {
      childId,
      archivedAt: null,
      state: {
        in: ["pending_child_confirm", "active", "completed", "fulfillment_pending"],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      family: true,
      wish: true,
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          evidence: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
      },
    },
  });

  const quietCatVisit = Boolean(
    contract?.tasks.some((task) => task.evidence.length > 0) ||
      contract?.state === "completed" ||
      contract?.state === "fulfillment_pending",
  );
  const completedTasks = await prisma.task.count({
    where: {
      assignedChildId: childId,
      completedAt: {
        not: null,
      },
      archivedAt: null,
    },
  });
  const rewardTicketCount = await prisma.evidence.count({
    where: {
      authorId: childId,
      task: {
        archivedAt: null,
      },
    },
  });
  const totalFocusSeconds = await prisma.focusSession.aggregate({
    where: {
      childId,
      state: "completed",
    },
    _sum: {
      durationSeconds: true,
    },
  });

  return {
    contract,
    latestVersion: contract?.versions[0],
    task: contract?.tasks[0],
    quietCatVisit,
    stats: {
      completedTasks,
      rewardTicketCount,
      totalFocusMinutes: Math.round((totalFocusSeconds._sum.durationSeconds ?? 0) / 60),
    },
  };
}

export async function getPomodoroState(taskId: string) {
  const actor = await getCurrentActor();
  const childId = actor.role === "child" ? actor.id : "seed_child";
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      assignedChildId: childId,
      archivedAt: null,
    },
    include: {
      contract: {
        include: {
          wish: true,
          versions: {
            orderBy: {
              versionNumber: "desc",
            },
          },
        },
      },
      focusSessions: {
        orderBy: {
          createdAt: "desc",
        },
      },
      evidence: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    task,
    contract: task?.contract,
    latestVersion: task?.contract.versions[0],
    latestSession: task?.focusSessions[0],
    latestEvidence: task?.evidence[0],
  };
}

export async function getChildRewardCollection() {
  const actor = await getCurrentActor();
  const childId = actor.role === "child" ? actor.id : "seed_child";
  const tickets = await prisma.evidence.findMany({
    where: {
      authorId: childId,
      archivedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      task: {
        include: {
          contract: {
            include: {
              wish: true,
              versions: {
                orderBy: {
                  versionNumber: "desc",
                },
              },
              diaryEntries: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const totalFocusSeconds = await prisma.focusSession.aggregate({
    where: {
      childId,
      state: "completed",
    },
    _sum: {
      durationSeconds: true,
    },
  });

  return {
    tickets,
    stats: {
      rewardTicketCount: tickets.length,
      totalFocusMinutes: Math.round((totalFocusSeconds._sum.durationSeconds ?? 0) / 60),
    },
  };
}
