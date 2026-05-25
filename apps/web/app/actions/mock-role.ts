"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { MOCK_ROLE_COOKIE, normalizeMockRole } from "@/lib/server/auth/mock-auth";
import { isMockRoleSwitcherEnabled } from "@/lib/server/auth/session-auth";

export async function switchMockRole(formData: FormData) {
  if (!isMockRoleSwitcherEnabled()) {
    throw new Error("Mock role switcher is disabled.");
  }

  const role = normalizeMockRole(String(formData.get("role") ?? "parent"));
  const cookieStore = await cookies();

  cookieStore.set(MOCK_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/");
}
