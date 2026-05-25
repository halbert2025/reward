import { describe, expect, it } from "vitest";
import {
  canConfirmContract,
  canCreateFulfillment,
  canEditContractDraft,
  canViewChildNote,
  canViewContract,
  canViewEvidence,
  canViewWitnessSummary,
  type ContractPermissionTarget,
  type PermissionActor,
} from "../../packages/shared/src/permissions";
import { ContractState } from "../../packages/shared/src/state-machine";

const parent: PermissionActor = {
  id: "parent-1",
  role: "parent",
  familyId: "family-1",
};

const child: PermissionActor = {
  id: "child-1",
  role: "child",
  familyId: "family-1",
};

const witness: PermissionActor = {
  id: "witness-1",
  role: "witness",
  familyId: "family-1",
};

function contract(state: ContractState): ContractPermissionTarget {
  return {
    id: "contract-1",
    familyId: "family-1",
    childId: "child-1",
    createdById: "parent-1",
    state,
  };
}

describe("permission functions", () => {
  it("allows parent and assigned child to view contract", () => {
    const target = contract(ContractState.PendingChildConfirm);

    expect(canViewContract(parent, target)).toBe(true);
    expect(canViewContract(child, target)).toBe(true);
  });

  it("limits witness contract access to generated diary summary state", () => {
    expect(canViewContract(witness, contract(ContractState.PendingChildConfirm))).toBe(false);
    expect(canViewContract(witness, contract(ContractState.DiaryGenerated))).toBe(true);
    expect(canViewWitnessSummary(witness, contract(ContractState.DiaryGenerated))).toBe(true);
  });

  it("allows parent to edit draft but not confirmed contract", () => {
    expect(canEditContractDraft(parent, contract(ContractState.Draft))).toBe(true);
    expect(canEditContractDraft(parent, contract(ContractState.Confirmed))).toBe(false);
  });

  it("allows child to confirm only pending assigned contract", () => {
    expect(canConfirmContract(child, contract(ContractState.PendingChildConfirm))).toBe(true);
    expect(canConfirmContract(child, contract(ContractState.Confirmed))).toBe(false);
    expect(canEditContractDraft(child, contract(ContractState.Draft))).toBe(false);
  });

  it("denies parent and witness access to child private note", () => {
    const note = {
      childId: "child-1",
      visibility: "child_private" as const,
    };

    expect(canViewChildNote(child, note)).toBe(true);
    expect(canViewChildNote(parent, note)).toBe(false);
    expect(canViewChildNote(witness, note)).toBe(false);
  });

  it("allows parent and child to view evidence but denies witness", () => {
    const evidence = {
      familyId: "family-1",
      authorId: "child-1",
      contractChildId: "child-1",
    };

    expect(canViewEvidence(parent, evidence)).toBe(true);
    expect(canViewEvidence(child, evidence)).toBe(true);
    expect(canViewEvidence(witness, evidence)).toBe(false);
  });

  it("allows fulfillment only for parent at fulfillment pending state", () => {
    expect(canCreateFulfillment(parent, contract(ContractState.FulfillmentPending))).toBe(true);
    expect(canCreateFulfillment(child, contract(ContractState.FulfillmentPending))).toBe(false);
    expect(canCreateFulfillment(parent, contract(ContractState.Completed))).toBe(false);
  });
});
