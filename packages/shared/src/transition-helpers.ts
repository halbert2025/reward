import {
  Actor,
  ContractState,
  TransitionErrorCode,
  canActorRequestTransition,
  contractTransitions,
  findTransition,
} from "./state-machine";

export type ContractTransitionEvent =
  | "contract.submit_for_child"
  | "contract.revise_for_child"
  | "contract.child_confirm"
  | "contract.activate"
  | "fulfillment.mark_fulfilled"
  | "fulfillment.mark_delayed"
  | "fulfillment.request_repair"
  | "diary.generate";

export function resolveContractTransition(
  from: ContractState,
  event: ContractTransitionEvent,
  actor: Actor,
) {
  const transition = findTransition(contractTransitions, from, event);

  if (!transition) {
    return {
      ok: false as const,
      errorCode: TransitionErrorCode.ContractVersionStale,
      auditLog: [],
      notify: [],
    };
  }

  if (!canActorRequestTransition(transition, actor)) {
    return {
      ok: false as const,
      errorCode: TransitionErrorCode.WitnessPermissionDenied,
      auditLog: [],
      notify: [],
    };
  }

  return {
    ok: true as const,
    to: transition.to,
    auditLog: transition.auditLog,
    notify: transition.notify,
  };
}

export function requireContractTransition(
  from: ContractState,
  event: ContractTransitionEvent,
  actor: Actor,
): ContractState {
  const result = resolveContractTransition(from, event, actor);

  if (!result.ok) {
    throw new Error(result.errorCode);
  }

  return result.to;
}
