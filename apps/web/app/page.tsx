import {
  canConfirmContract,
  canCreateFulfillment,
  canEditContractDraft,
  canViewChildNote,
  canViewContract,
  canViewEvidence,
  canViewWitnessSummary,
} from "@reward/shared/permissions";
import { ContractState } from "@reward/shared/state-machine";
import Link from "next/link";
import { RoleSwitcher } from "@/components/role-switcher";
import { getCurrentActor, isMockRoleSwitcherEnabled } from "@/lib/server/auth/session-auth";
import { prisma } from "@/lib/server/prisma";
import { RewardRepository } from "@/lib/server/repositories/reward-repository";

const mvpSteps = [
  "P01 Parent welcome",
  "P02 Principles confirmation",
  "P03 Reward pool setup",
  "P04 First 25-minute contract",
  "P05 Child invite",
  "P06 Child wish backyard",
  "P07 Wish pomodoro",
  "P08 Completion submission",
  "P09 Parent fulfillment reminder",
  "P10 Parent-child diary",
];

function PermissionLine({ allowed, label }: { allowed: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2 last:border-b-0">
      <span>{label}</span>
      <span
        className={`rounded-panel px-2 py-1 text-xs font-semibold ${
          allowed ? "bg-leaf text-white" : "bg-white text-[var(--muted)]"
        }`}
      >
        {allowed ? "Allowed" : "Denied"}
      </span>
    </li>
  );
}

export default async function HomePage() {
  const repository = new RewardRepository();
  const actor = await getCurrentActor();
  const showMockRoleSwitcher = isMockRoleSwitcherEnabled();
  const family = await repository.getSeedFamily();
  const contract = family?.contracts[0];
  const childId = contract?.childId ?? "seed_child";

  const permissionContract = contract
    ? {
        id: contract.id,
        familyId: contract.familyId,
        childId: contract.childId,
        createdById: contract.createdById,
        state: contract.state as ContractState,
      }
    : undefined;

  const childNoteAllowed = canViewChildNote(actor, {
    childId,
    visibility: "child_private",
  });
  const visibleNotes = childNoteAllowed
    ? await repository.getChildPrivateNotes(actor.id)
    : [];
  const auditCount = family ? await repository.countAuditLogs(family.id) : 0;
  const latestChildProgress = family
    ? await prisma.contract.findFirst({
        where: {
          familyId: family.id,
          childId,
          archivedAt: null,
          state: {
            in: ["active", "completed", "fulfillment_pending", "fulfilled", "delayed"],
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          wish: true,
          tasks: {
            orderBy: {
              updatedAt: "desc",
            },
            include: {
              evidence: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
            take: 1,
          },
        },
      })
    : null;

  const permissions = permissionContract
    ? {
        viewContract: canViewContract(actor, permissionContract),
        editDraft: canEditContractDraft(actor, permissionContract),
        confirmContract: canConfirmContract(actor, permissionContract),
        viewEvidence: canViewEvidence(actor, {
          familyId: permissionContract.familyId,
          authorId: childId,
          contractChildId: childId,
        }),
        viewChildNote: childNoteAllowed,
        createFulfillment: canCreateFulfillment(actor, permissionContract),
        witnessSummary: canViewWitnessSummary(actor, permissionContract),
      }
    : undefined;

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-leaf">
            Reward MVP
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Desktop-testable family wish contract loop.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                Seed data, mock roles, permission checks, and the first app shell are
                now wired for the next MVP screens.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-panel bg-ink px-4 py-2 text-sm font-semibold text-white"
                  href="/parent/onboarding"
                >
                  Parent onboarding
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/parent/onboarding?step=family"
                >
                  Create demo family
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/parent/contracts/new"
                >
                  First promise
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/child/backyard"
                >
                  Cat backyard
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/parent/response"
                >
                  Parent response
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/child/notes"
                >
                  Private note
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/auth/login"
                >
                  Pilot login
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/family/new"
                >
                  Pilot family
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/pilot/consent"
                >
                  Pilot consent
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/privacy/requests"
                >
                  Data requests
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/feedback"
                >
                  Pilot feedback
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/parent/invites"
                >
                  Child invite
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/parent/witness"
                >
                  Witness invite
                </Link>
                <Link
                  className="rounded-panel border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                  href="/witness"
                >
                  Witness view
                </Link>
              </div>
            </div>
            {showMockRoleSwitcher ? (
              <div className="rounded-panel border border-[var(--line)] bg-white/70 p-4">
                <p className="mb-3 text-sm font-semibold">Current role: {actor.role}</p>
                <RoleSwitcher currentRole={actor.role} />
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Seed family</h2>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
              <p>Family: {family?.name ?? "Not seeded"}</p>
              <p>Members: {family?.members.length ?? 0}</p>
              <p>Wish: {family?.rewardPools[0]?.wishes[0]?.title ?? "None"}</p>
              <p>Contract: {contract?.state ?? "None"}</p>
              <p>ContractVersions: {contract?.versions.length ?? 0}</p>
              <p>AuditLogs: {auditCount}</p>
            </div>
          </div>

          <div className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
            <h2 className="text-lg font-semibold">Permission snapshot</h2>
            <ul className="mt-3 text-sm">
              {permissions ? (
                <>
                  <PermissionLine allowed={permissions.viewContract} label="View contract" />
                  <PermissionLine allowed={permissions.editDraft} label="Edit draft contract" />
                  <PermissionLine allowed={permissions.confirmContract} label="Confirm contract" />
                  <PermissionLine allowed={permissions.viewEvidence} label="View evidence" />
                  <PermissionLine allowed={permissions.viewChildNote} label="View ChildNote" />
                  <PermissionLine allowed={permissions.createFulfillment} label="Create fulfillment" />
                  <PermissionLine allowed={permissions.witnessSummary} label="Witness summary" />
                </>
              ) : (
                <li>No seed contract found.</li>
              )}
            </ul>
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">ChildNote boundary</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Parent and witness views must show denied here. Child view can see only
            their own private notes.
          </p>
          <div className="mt-4 rounded-panel border border-[var(--line)] bg-[var(--background)] p-4 text-sm">
            {visibleNotes.length > 0
              ? visibleNotes.map((note) => <p key={note.id}>{note.body}</p>)
              : "No ChildNote content visible for this role."}
          </div>
        </section>

        <section className="rounded-panel border border-[var(--line)] bg-white/70 p-5">
          <h2 className="text-lg font-semibold">Latest child progress</h2>
          {latestChildProgress?.tasks[0] ? (
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted)]">
              <p>Wish: {latestChildProgress.wish?.title ?? "Small family wish"}</p>
              <p>Contract: {latestChildProgress.state}</p>
              <p>Task: {latestChildProgress.tasks[0].state}</p>
              <p>
                Reflection:{" "}
                {latestChildProgress.tasks[0].evidence[0]?.reflectionText ??
                  "No completion reflection yet."}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">
              No active child progress yet.
            </p>
          )}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          {mvpSteps.map((step) => (
            <div
              className="rounded-panel border border-[var(--line)] bg-white/60 px-4 py-3 text-sm font-medium"
              key={step}
            >
              {step}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
