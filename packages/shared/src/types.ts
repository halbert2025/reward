import {
  ContractState,
  FamilyTrustState,
  FulfillmentState,
  RepairCaseState,
  TaskState,
} from "./state-machine";

export type ID = string;
export type ISODateTime = string;

export type Role = "parent" | "child" | "co_signer" | "witness" | "system_admin";
export type MemberStatus = "invited" | "active" | "paused" | "removed";
export type MembershipKind =
  | "family_member"
  | "contract_owner"
  | "contract_child"
  | "contract_cosigner";
export type MembershipStatus = "active" | "revoked";
export type RewardPoolStatus = "draft" | "active" | "archived";
export type WishCategory = "time" | "experience" | "object" | "privilege" | "other";
export type SafetyStatus = "pending" | "approved" | "blocked";
export type FocusSessionState = "not_started" | "running" | "paused" | "completed" | "exited";
export type EvidenceVisibility = "contract_family" | "parent_child_only";
export type FulfillmentResponseType = "fulfilled" | "delayed" | "pending_repair";
export type WitnessStatus = "invited" | "accepted" | "expired" | "revoked";
export type BackyardSignal = "none" | "quiet_cat_visit";
export type ChildNoteVisibility = "child_private";
export type NotificationType =
  | "child_confirm_needed"
  | "child_can_start"
  | "parent_response_needed"
  | "delayed_notice"
  | "repair_prompt"
  | "diary_ready";
export type ActorType = "parent" | "child" | "witness" | "system" | "admin";

export interface User {
  id: ID;
  displayName: string;
  mockEmail?: string | null;
  roleHint?: ActorType | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime | null;
}

export interface Family {
  id: ID;
  name: string;
  trustState: FamilyTrustState;
  principlesConfirmedAt?: ISODateTime | null;
  createdById: ID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface FamilyMember {
  id: ID;
  familyId: ID;
  userId: ID;
  role: Role;
  status: MemberStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime | null;
}

export interface Membership {
  id: ID;
  familyId: ID;
  userId: ID;
  contractId?: ID | null;
  kind: MembershipKind;
  status: MembershipStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime | null;
}

export interface RewardPool {
  id: ID;
  familyId: ID;
  createdById: ID;
  title: string;
  status: RewardPoolStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface Wish {
  id: ID;
  rewardPoolId: ID;
  title: string;
  description?: string | null;
  category: WishCategory;
  safetyStatus: SafetyStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface Contract {
  id: ID;
  familyId: ID;
  wishId?: ID | null;
  createdById: ID;
  childId: ID;
  state: ContractState;
  acceptedVersionId?: ID | null;
  currentVersionNumber: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface ContractVersion {
  id: ID;
  contractId: ID;
  versionNumber: number;
  title: string;
  promiseText: string;
  rewardText: string;
  taskText: string;
  durationMinutes: number;
  createdById: ID;
  createdAt: ISODateTime;
  confirmedAt?: ISODateTime | null;
}

export interface Task {
  id: ID;
  contractId: ID;
  assignedChildId: ID;
  state: TaskState;
  title: string;
  plannedDurationMinutes: number;
  startedAt?: ISODateTime | null;
  completedAt?: ISODateTime | null;
  exitedAt?: ISODateTime | null;
  exitReason?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface FocusSession {
  id: ID;
  taskId: ID;
  childId: ID;
  state: FocusSessionState;
  startedAt?: ISODateTime | null;
  pausedAt?: ISODateTime | null;
  endedAt?: ISODateTime | null;
  durationSeconds: number;
  exitReason?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Evidence {
  id: ID;
  taskId: ID;
  authorId: ID;
  reflectionText: string;
  photoUrl?: string | null;
  visibility: EvidenceVisibility;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface Fulfillment {
  id: ID;
  contractId: ID;
  respondedById: ID;
  state: FulfillmentState;
  responseType: FulfillmentResponseType;
  message?: string | null;
  expectedAt?: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  closedAt?: ISODateTime | null;
}

export interface RepairCase {
  id: ID;
  contractId: ID;
  openedById: ID;
  state: RepairCaseState;
  parentMessage?: string | null;
  childResponse?: string | null;
  resolutionSummary?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface Witness {
  id: ID;
  contractId: ID;
  invitedById: ID;
  displayName: string;
  inviteTokenHash: string;
  status: WitnessStatus;
  blessingMessage?: string | null;
  createdAt: ISODateTime;
  acceptedAt?: ISODateTime | null;
  revokedAt?: ISODateTime | null;
}

export interface DiaryEntry {
  id: ID;
  familyId: ID;
  contractId: ID;
  title: string;
  summary: string;
  parentMessage?: string | null;
  childReflectionExcerpt?: string | null;
  backyardSignal: BackyardSignal;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface ChildNote {
  id: ID;
  familyId: ID;
  childId: ID;
  contractId?: ID | null;
  body: string;
  visibility: ChildNoteVisibility;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface Notification {
  id: ID;
  familyId: ID;
  recipientUserId: ID;
  type: NotificationType;
  title: string;
  body: string;
  readAt?: ISODateTime | null;
  createdAt: ISODateTime;
  expiresAt?: ISODateTime | null;
}

export interface AuditLog {
  id: ID;
  familyId: ID;
  actorUserId?: ID | null;
  actorType: ActorType;
  eventName: string;
  entityType: string;
  entityId: string;
  metadataJson?: Record<string, unknown> | null;
  createdAt: ISODateTime;
}

export interface ParentContractView {
  contract: Contract;
  acceptedVersion?: ContractVersion | null;
  task?: Task | null;
  evidence?: Evidence[];
  fulfillment?: Fulfillment | null;
  diaryEntry?: DiaryEntry | null;
}

export interface ChildContractView {
  contract: Contract;
  acceptedVersion?: ContractVersion | null;
  task?: Task | null;
  ownEvidence?: Evidence[];
  diaryEntry?: DiaryEntry | null;
  ownChildNotes?: ChildNote[];
}

export interface WitnessMemoryView {
  contractId: ID;
  diaryTitle: string;
  diarySummary: string;
  backyardSignal: BackyardSignal;
  blessingMessage?: string | null;
}

export interface FamilySafeExport {
  family: Family;
  contracts: Contract[];
  versions: ContractVersion[];
  diaryEntries: DiaryEntry[];
  childNotesExcluded: true;
}
