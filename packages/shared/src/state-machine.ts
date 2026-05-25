export enum Actor {
  Parent = "parent",
  Child = "child",
  Witness = "witness",
  System = "system",
  Admin = "admin",
}

export enum ContractState {
  Draft = "draft",
  PendingChildConfirm = "pending_child_confirm",
  Confirmed = "confirmed",
  Active = "active",
  Completed = "completed",
  FulfillmentPending = "fulfillment_pending",
  Fulfilled = "fulfilled",
  Delayed = "delayed",
  PendingRepair = "pending_repair",
  DiaryGenerated = "diary_generated",
  Archived = "archived",
}

export enum TaskState {
  NotStarted = "not_started",
  Running = "running",
  Paused = "paused",
  Exited = "exited",
  Submitted = "submitted",
  AcceptedForReview = "accepted_for_review",
}

export enum FulfillmentState {
  None = "none",
  Pending = "pending",
  Fulfilled = "fulfilled",
  Delayed = "delayed",
  PendingRepair = "pending_repair",
  Closed = "closed",
}

export enum RepairCaseState {
  None = "none",
  Opened = "opened",
  AwaitingParent = "awaiting_parent",
  AwaitingChild = "awaiting_child",
  MutuallyResolved = "mutually_resolved",
  ClosedWithoutVerdict = "closed_without_verdict",
  Archived = "archived",
}

export enum FamilyTrustState {
  Uninitialized = "uninitialized",
  PrinciplesPending = "principles_pending",
  Active = "active",
  Strained = "strained",
  Restoring = "restoring",
  Stable = "stable",
  Paused = "paused",
}

export enum ArchiveState {
  Open = "open",
  ReadyToSeal = "ready_to_seal",
  Sealed = "sealed",
  ReopenedByParent = "reopened_by_parent",
  Exported = "exported",
  DeletedByRetention = "deleted_by_retention",
}

export enum StateMachineName {
  Contract = "contract",
  Task = "task",
  Fulfillment = "fulfillment",
  RepairCase = "repair_case",
  FamilyTrust = "family_trust",
  Archive = "archive",
}

export enum TransitionErrorCode {
  ContractConfirmedImmutable = "CONTRACT_CONFIRMED_IMMUTABLE",
  ContractVersionRequired = "CONTRACT_VERSION_REQUIRED",
  ContractVersionStale = "CONTRACT_VERSION_STALE",
  ParentCannotDeleteChildEffort = "PARENT_CANNOT_DELETE_CHILD_EFFORT",
  ChildCannotEditConfirmedContract = "CHILD_CANNOT_EDIT_CONFIRMED_CONTRACT",
  AiCannotJudge = "AI_CANNOT_JUDGE",
  AiCannotFulfill = "AI_CANNOT_FULFILL",
  WitnessPermissionDenied = "WITNESS_PERMISSION_DENIED",
  WitnessCannotRepair = "WITNESS_CANNOT_REPAIR",
  WitnessCannotFulfill = "WITNESS_CANNOT_FULFILL",
  RepairHasNoVerdict = "REPAIR_HAS_NO_VERDICT",
  RepairSnapshotRequired = "REPAIR_SNAPSHOT_REQUIRED",
  PrinciplesRequired = "PRINCIPLES_REQUIRED",
  TrustIsNotChildScore = "TRUST_IS_NOT_CHILD_SCORE",
  NoHardLock = "NO_HARD_LOCK",
  SchoolPathForbidden = "SCHOOL_PATH_FORBIDDEN",
  PaymentEscrowForbidden = "PAYMENT_ESCROW_FORBIDDEN",
  SurveillanceForbidden = "SURVEILLANCE_FORBIDDEN",
  ArchiveSealed = "ARCHIVE_SEALED",
  ExportChildNoteForbidden = "EXPORT_CHILD_NOTE_FORBIDDEN",
  ExportRepairDetailForbidden = "EXPORT_REPAIR_DETAIL_FORBIDDEN",
  TaskMustStartFirst = "TASK_MUST_START_FIRST",
  TaskExitReasonRequired = "TASK_EXIT_REASON_REQUIRED",
  TaskAlreadySubmitted = "TASK_ALREADY_SUBMITTED",
  TaskUnderParentReview = "TASK_UNDER_PARENT_REVIEW",
  FulfillmentFinal = "FULFILLMENT_FINAL",
  FulfillmentClosed = "FULFILLMENT_CLOSED",
}

export type RewardState =
  | ContractState
  | TaskState
  | FulfillmentState
  | RepairCaseState
  | FamilyTrustState
  | ArchiveState;

export interface TransitionDefinition<
  TState extends string = string,
  TEvent extends string = string,
> {
  machine: StateMachineName;
  from: TState;
  event: TEvent;
  actors: Actor[];
  guard: string;
  to: TState;
  auditLog: string[];
  notify: Actor[];
  idempotency: "same-key" | "no-op" | "reject-conflict";
}

export interface TransitionRequest<TState extends string = string> {
  machine: StateMachineName;
  from: TState;
  event: string;
  actor: Actor;
  idempotencyKey?: string;
}

export interface TransitionResult<TState extends string = string> {
  ok: boolean;
  from: TState;
  to?: TState;
  errorCode?: TransitionErrorCode;
  auditLog: string[];
  notify: Actor[];
}

export const contractTransitions: TransitionDefinition<ContractState>[] = [
  {
    machine: StateMachineName.Contract,
    from: ContractState.Draft,
    event: "contract.submit_for_child",
    actors: [Actor.Parent],
    guard: "safe content and reward exists",
    to: ContractState.PendingChildConfirm,
    auditLog: ["contract_submitted", "contract_version_created"],
    notify: [Actor.Child],
    idempotency: "same-key",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.PendingChildConfirm,
    event: "contract.revise_for_child",
    actors: [Actor.Parent],
    guard: "safe content and latest version is not confirmed",
    to: ContractState.PendingChildConfirm,
    auditLog: ["contract_version_created", "contract_submitted"],
    notify: [Actor.Child],
    idempotency: "same-key",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.PendingChildConfirm,
    event: "contract.child_confirm",
    actors: [Actor.Child],
    guard: "child belongs to family and version is latest",
    to: ContractState.Confirmed,
    auditLog: ["contract_child_confirmed"],
    notify: [],
    idempotency: "same-key",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.Confirmed,
    event: "contract.activate",
    actors: [Actor.System],
    guard: "acceptedVersionId exists",
    to: ContractState.Active,
    auditLog: ["contract_activated"],
    notify: [Actor.Child],
    idempotency: "no-op",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.Fulfilled,
    event: "diary.generate",
    actors: [Actor.System],
    guard: "fulfillment response exists",
    to: ContractState.DiaryGenerated,
    auditLog: ["diary_generated"],
    notify: [Actor.Parent, Actor.Child],
    idempotency: "no-op",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.Delayed,
    event: "diary.generate",
    actors: [Actor.System],
    guard: "delay response exists",
    to: ContractState.DiaryGenerated,
    auditLog: ["diary_generated"],
    notify: [Actor.Parent, Actor.Child],
    idempotency: "no-op",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.PendingRepair,
    event: "diary.generate",
    actors: [Actor.System],
    guard: "repair snapshot exists",
    to: ContractState.DiaryGenerated,
    auditLog: ["diary_generated"],
    notify: [Actor.Parent, Actor.Child],
    idempotency: "no-op",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.FulfillmentPending,
    event: "fulfillment.mark_fulfilled",
    actors: [Actor.Parent],
    guard: "parent has permission",
    to: ContractState.Fulfilled,
    auditLog: ["fulfillment_marked_fulfilled"],
    notify: [Actor.Child],
    idempotency: "same-key",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.FulfillmentPending,
    event: "fulfillment.mark_delayed",
    actors: [Actor.Parent],
    guard: "delay note or expected time exists",
    to: ContractState.Delayed,
    auditLog: ["fulfillment_marked_delayed"],
    notify: [Actor.Child],
    idempotency: "same-key",
  },
  {
    machine: StateMachineName.Contract,
    from: ContractState.FulfillmentPending,
    event: "fulfillment.request_repair",
    actors: [Actor.Parent],
    guard: "neutral message exists",
    to: ContractState.PendingRepair,
    auditLog: ["repair_requested"],
    notify: [Actor.Parent, Actor.Child],
    idempotency: "same-key",
  },
];

export function canActorRequestTransition(
  transition: TransitionDefinition,
  actor: Actor,
): boolean {
  return transition.actors.includes(actor);
}

export function findTransition<TState extends string>(
  transitions: TransitionDefinition<TState>[],
  from: TState,
  event: string,
): TransitionDefinition<TState> | undefined {
  return transitions.find((transition) => {
    return transition.from === from && transition.event === event;
  });
}
