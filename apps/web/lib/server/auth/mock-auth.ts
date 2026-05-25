import { cookies } from "next/headers";
import type { PermissionActor, PermissionRole } from "@reward/shared/permissions";
import { prisma } from "../prisma";

export const MOCK_ROLE_COOKIE = "reward_mock_role";

const roleToSeedUserId: Record<"parent" | "child" | "witness", string> = {
  parent: "seed_parent",
  child: "seed_child",
  witness: "seed_witness",
};

export function normalizeMockRole(role: string | null | undefined): "parent" | "child" | "witness" {
  if (role === "child" || role === "witness" || role === "parent") {
    return role;
  }

  return "parent";
}

export async function getCurrentMockActor(roleOverride?: string): Promise<PermissionActor> {
  const cookieStore = await cookies();
  const role = normalizeMockRole(roleOverride ?? cookieStore.get(MOCK_ROLE_COOKIE)?.value);
  const userId = roleToSeedUserId[role];

  if (role === "witness") {
    return {
      id: userId,
      role,
      familyId: "seed_family",
    };
  }

  const member = await prisma.familyMember.findFirst({
    where: {
      userId,
      status: "active",
    },
    select: {
      familyId: true,
    },
  });

  return {
    id: userId,
    role: role as PermissionRole,
    familyId: member?.familyId ?? "seed_family",
  };
}
