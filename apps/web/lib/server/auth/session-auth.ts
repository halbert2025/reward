import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { PermissionActor, PermissionRole } from "@reward/shared/permissions";
import { getCurrentMockActor } from "./mock-auth";
import { prisma } from "../prisma";

export const SESSION_COOKIE = "reward_session";

const sessionDays = 7;

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  const appEnv = process.env.APP_ENV || process.env.NODE_ENV || "local";

  if ((appEnv === "pilot" || appEnv === "production") && (!secret || secret.length < 32)) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters for pilot/production.");
  }

  return secret || "reward-dev-auth-secret";
}

export function hashToken(token: string) {
  return createHash("sha256").update(`${authSecret()}:${token}`).digest("hex");
}

export function createRawToken(byteLength = 24) {
  return randomBytes(byteLength).toString("base64url");
}

export function createDisplayCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export function isMockRoleSwitcherEnabled() {
  if (process.env.REWARD_ENABLE_MOCK_ROLE_SWITCHER) {
    return process.env.REWARD_ENABLE_MOCK_ROLE_SWITCHER === "true";
  }

  return process.env.NODE_ENV !== "production";
}

export async function createUserSession(userId: string) {
  const rawToken = createRawToken();
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (rawToken) {
    await prisma.authSession.updateMany({
      where: {
        tokenHash: hashToken(rawToken),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  const session = await prisma.authSession.findFirst({
    where: {
      tokenHash: hashToken(rawToken),
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          familyMembers: {
            where: {
              status: "active",
              deletedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  return session?.user ?? null;
}

function toPermissionRole(role: string | null | undefined): PermissionRole {
  if (role === "parent" || role === "child" || role === "witness") {
    return role;
  }

  if (role === "system_admin" || role === "admin") {
    return "admin";
  }

  return "parent";
}

export async function getCurrentActor(): Promise<PermissionActor> {
  const user = await getSessionUser();
  const member = user?.familyMembers[0];

  if (user && member) {
    return {
      id: user.id,
      role: toPermissionRole(member.role),
      familyId: member.familyId,
    };
  }

  if (user) {
    return {
      id: user.id,
      role: toPermissionRole(user.roleHint),
    };
  }

  if (isMockRoleSwitcherEnabled()) {
    return getCurrentMockActor();
  }

  throw new Error("UNAUTHENTICATED");
}
