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

  return {
    contract,
    latestVersion: contract?.versions[0],
    task: contract?.tasks[0],
    quietCatVisit,
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
