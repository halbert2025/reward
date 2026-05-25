"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { MOCK_ROLE_COOKIE, normalizeMockRole } from "@/lib/server/auth/mock-auth";

export async function switchMockRole(formData: FormData) {
  const role = normalizeMockRole(String(formData.get("role") ?? "parent"));
  const cookieStore = await cookies();

  cookieStore.set(MOCK_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/");
}
