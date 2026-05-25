import { ContractState } from "./state-machine";

export type PermissionRole = "parent" | "child" | "co_signer" | "witness" | "system" | "admin";

export interface PermissionActor {
  id: string;
  role: PermissionRole;
  familyId?: string;
}

export interface ContractPermissionTarget {
  id: string;
  familyId: string;
  childId: string;
  createdById: string;
  state: ContractState;
}

export interface EvidencePermissionTarget {
  familyId: string;
  authorId: string;
  contractChildId: string;
}

export interface ChildNotePermissionTarget {
  childId: string;
  visibility: "child_private";
}

export function canViewContract(
  actor: PermissionActor,
  contract: ContractPermissionTarget,
): boolean {
  if (actor.role === "system" || actor.role === "admin") {
    return true;
  }

  if (actor.role === "parent" || actor.role === "co_signer") {
    return actor.familyId === contract.familyId;
  }

  if (actor.role === "child") {
    return actor.id === contract.childId && actor.familyId === contract.familyId;
  }

  if (actor.role === "witness") {
    return contract.state === ContractState.DiaryGenerated;
  }

  return false;
}

export function canEditContractDraft(
  actor: PermissionActor,
  contract: ContractPermissionTarget,
): boolean {
  const parentCanEdit =
    (actor.role === "parent" || actor.role === "co_signer") &&
    actor.familyId === contract.familyId;

  return parentCanEdit && contract.state === ContractState.Draft;
}

export function canConfirmContract(
  actor: PermissionActor,
  contract: ContractPermissionTarget,
): boolean {
  return (
    actor.role === "child" &&
    actor.id === contract.childId &&
    actor.familyId === contract.familyId &&
    contract.state === ContractState.PendingChildConfirm
  );
}

export function canViewEvidence(
  actor: PermissionActor,
  evidence: EvidencePermissionTarget,
): boolean {
  if (actor.role === "parent" || actor.role === "co_signer") {
    return actor.familyId === evidence.familyId;
  }

  if (actor.role === "child") {
    return actor.id === evidence.authorId || actor.id === evidence.contractChildId;
  }

  return false;
}

export function canViewChildNote(
  actor: PermissionActor,
  note: ChildNotePermissionTarget,
): boolean {
  return actor.role === "child" && actor.id === note.childId;
}

export function canCreateFulfillment(
  actor: PermissionActor,
  contract: ContractPermissionTarget,
): boolean {
  return (
    (actor.role === "parent" || actor.role === "co_signer") &&
    actor.familyId === contract.familyId &&
    contract.state === ContractState.FulfillmentPending
  );
}

export function canViewWitnessSummary(
  actor: PermissionActor,
  contract: ContractPermissionTarget,
): boolean {
  return actor.role === "witness" && contract.state === ContractState.DiaryGenerated;
}
