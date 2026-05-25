import { describe, expect, it } from "vitest";
import {
  Actor,
  ContractState,
  canActorRequestTransition,
  contractTransitions,
  findTransition,
} from "../../packages/shared/src/state-machine";

describe("contract transition skeleton", () => {
  it("allows parent to submit a draft contract for child confirmation", () => {
    const transition = findTransition(
      contractTransitions,
      ContractState.Draft,
      "contract.submit_for_child",
    );

    expect(transition?.to).toBe(ContractState.PendingChildConfirm);
    expect(transition).toBeDefined();
    expect(canActorRequestTransition(transition!, Actor.Parent)).toBe(true);
    expect(canActorRequestTransition(transition!, Actor.Child)).toBe(false);
  });
});
