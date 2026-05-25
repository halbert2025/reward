import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function getChildPrivateNotesForCurrentChild() {
  return prisma.childNote.findMany({
    where: {
      childId: "seed_child",
      visibility: "child_private",
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createChildPrivateNote(formData: FormData) {
  "use server";

  const body = String(formData.get("body") ?? "").trim();
  const family = await prisma.family.findFirst({
    where: {
      members: {
        some: {
          userId: "seed_child",
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
      childId: "seed_child",
      body,
      visibility: "child_private",
    },
  });

  await prisma.auditLog.create({
    data: {
      familyId: family.id,
      actorUserId: "seed_child",
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
