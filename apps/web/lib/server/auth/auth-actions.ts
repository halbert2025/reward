import { redirect } from "next/navigation";
import { createDisplayCode, createUserSession, hashToken } from "./session-auth";
import { prisma } from "../prisma";

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function requestParentLogin(formData: FormData) {
  "use server";

  const email = normalizeEmail(clean(formData, "email"));

  if (!email.includes("@") || email.length > 160) {
    redirect("/auth/login?error=email");
  }

  const code = createDisplayCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.loginToken.create({
    data: {
      email,
      tokenHash: hashToken(`${email}:${code}`),
      expiresAt,
    },
  });

  redirect(`/auth/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
}

export async function verifyParentLogin(formData: FormData) {
  "use server";

  const email = normalizeEmail(clean(formData, "email"));
  const code = clean(formData, "code").toUpperCase();

  const token = await prisma.loginToken.findFirst({
    where: {
      email,
      tokenHash: hashToken(`${email}:${code}`),
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!token) {
    redirect(`/auth/verify?email=${encodeURIComponent(email)}&error=code`);
  }

  const user = await prisma.user.upsert({
    where: {
      mockEmail: email,
    },
    update: {
      roleHint: "parent",
      deletedAt: null,
    },
    create: {
      displayName: email.split("@")[0] || "Parent",
      mockEmail: email,
      roleHint: "parent",
    },
  });

  await prisma.loginToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  await createUserSession(user.id);
  redirect("/family/new");
}
