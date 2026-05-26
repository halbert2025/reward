import { redirect } from "next/navigation";
import { createDisplayCode, createUserSession, hashToken } from "./session-auth";
import { recordOperationalEvent } from "../operational-events";
import { prisma } from "../prisma";

function clean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isAdminEmail(email: string) {
  const configured = process.env.REWARD_ADMIN_EMAILS ?? "";
  return configured
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email);
}

export async function requestParentLogin(formData: FormData) {
  "use server";

  const email = normalizeEmail(clean(formData, "email"));

  if (!email.includes("@") || email.length > 160) {
    await recordOperationalEvent({
      level: "warn",
      eventName: "login_request_invalid_email",
      message: "Parent login requested with invalid email.",
    });
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
    await recordOperationalEvent({
      level: "warn",
      eventName: "login_verify_failed",
      message: "Parent login verification failed.",
      metadataJson: { emailDomain: email.split("@")[1] ?? "unknown" },
    });
    redirect(`/auth/verify?email=${encodeURIComponent(email)}&error=code`);
  }

  const roleHint = isAdminEmail(email) ? "admin" : "parent";
  const user = await prisma.user.upsert({
    where: {
      mockEmail: email,
    },
    update: {
      roleHint,
      deletedAt: null,
    },
    create: {
      displayName: email.split("@")[0] || "Parent",
      mockEmail: email,
      roleHint,
    },
  });

  await prisma.loginToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  await createUserSession(user.id);
  redirect(roleHint === "admin" ? "/admin/pilot" : "/family/new");
}
