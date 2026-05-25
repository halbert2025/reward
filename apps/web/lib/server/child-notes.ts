import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentActor } from "./auth/session-auth";
import { prisma } from "./prisma";

export async function getChildPrivateNotesForCurrentChild() {
  const actor = await getCurrentActor();
  const childId = actor.role === "child" ? actor.id : "seed_child";

  return prisma.childNote.findMany({
    where: {
      childId,
      visibility: "child_private",
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createChildPrivateNote(formData: FormData) {
  "use server";

  const actor = await getCurrentActor();
  if (actor.role !== "child") {
    redirect("/child/notes?error=permission");
  }

  const body = String(formData.get("body") ?? "").trim();
  const family = await prisma.family.findFirst({
    where: {
      members: {
        some: {
          userId: actor.id,
          role: "child",
          status: "active",
        },
      },
      archivedAt: null,
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!body || !family) {
    redirect("/child/notes?error=empty");
  }

  await prisma.childNote.create({
    data: {
      familyId: family.id,
      childId: actor.id,
      body,
      visibility: "child_private",
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId: family.id,
      actorUserId: actor.id,
      actorType: "child",
      eventName: "child_note_created",
      entityType: "ChildNote",
      entityId: "child_private",
      metadataJson: { visibleTo: "child_only" },
    },
  });

  revalidatePath("/child/notes");
  redirect("/child/notes?status=saved");
}
