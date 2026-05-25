import type {
  ChildNote,
  Contract,
  ContractVersion,
  DiaryEntry,
  Evidence,
  Family,
  Fulfillment,
  Notification,
  ParentContractView,
  RepairCase,
  RewardPool,
  Task,
  User,
  Wish,
  Witness,
  WitnessMemoryView,
} from "./types";

export type ApiRole = "parent" | "child" | "co_signer" | "witness" | "system" | "admin";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    field?: string;
  };
  requestId: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "FAMILY_NOT_FOUND"
  | "FAMILY_NOT_ACTIVE"
  | "INVALID_FAMILY_NAME"
  | "PRINCIPLES_REQUIRED"
  | "MOCK_AUTH_DISABLED"
  | "USER_NOT_FOUND"
  | "UNSAFE_WISH_CONTENT"
  | "WISH_NOT_ACTIVE"
  | "UNSAFE_CONTRACT_CONTENT"
  | "CONTRACT_NOT_FOUND"
  | "CONTRACT_VERSION_REQUIRED"
  | "CONTRACT_VERSION_STALE"
  | "CONTRACT_CONFIRMED_IMMUTABLE"
  | "CHILD_CANNOT_EDIT_CONFIRMED_CONTRACT"
  | "TASK_NOT_FOUND"
  | "TASK_MUST_START_FIRST"
  | "TASK_EXIT_REASON_REQUIRED"
  | "TASK_ALREADY_SUBMITTED"
  | "TASK_NOT_SUBMITTED"
  | "REFLECTION_REQUIRED"
  | "DELAY_REASON_REQUIRED"
  | "FULFILLMENT_FINAL"
  | "AI_CANNOT_FULFILL"
  | "REPAIR_HAS_NO_VERDICT"
  | "JUDGMENTAL_REPAIR_COPY"
  | "PARENT_RESPONSE_REQUIRED"
  | "DIARY_ALREADY_EXISTS"
  | "CHILD_NOTE_REQUIRED"
  | "CHILD_NOTE_PRIVATE"
  | "WITNESS_PERMISSION_DENIED"
  | "WITNESS_SCOPE_NOT_READY"
  | "INVITE_EXPIRED"
  | "UNSAFE_WITNESS_COPY"
  | "NOTIFICATION_NOT_FOUND"
  | "AUDIT_EVENT_REQUIRED"
  | "AUDIT_METADATA_UNSAFE"
  | "AI_DISABLED"
  | "AI_PROVIDER_NOT_CONFIGURED"
  | "AI_INPUT_UNSAFE"
  | "AI_CANNOT_JUDGE";

export interface CurrentUserResponse {
  user: User;
  activeRole: ApiRole;
  familyIds: string[];
}

export interface MockSwitchUserRequest {
  userId: string;
  role: ApiRole;
}

export interface CreateFamilyRequest {
  name: string;
}

export interface ConfirmPrinciplesRequest {
  confirmedPrincipleIds: string[];
}

export interface FamilyResponse {
  family: Family;
}

export interface CreateChildInvitationRequest {
  childDisplayName?: string;
}

export interface ChildInvitationResponse {
  inviteToken: string;
  inviteUrl: string;
  expiresAt: string;
}

export interface InitializeRewardPoolRequest {
  title: string;
  wishes: Array<{
    title: string;
    description?: string;
    category?: string;
  }>;
}

export interface RewardPoolResponse {
  rewardPool: RewardPool;
  wishes: Wish[];
}

export interface WishListResponse {
  wishes: Wish[];
}

export interface ChooseWishRequest {
  childId: string;
}

export interface WishResponse {
  wish: Wish;
}

export interface CreateContractRequest {
  wishId: string;
  childId: string;
  title: string;
  promiseText: string;
  rewardText: string;
  taskText: string;
  durationMinutes: 25;
  idempotencyKey?: string;
}

export interface CreateContractVersionRequest {
  title: string;
  promiseText: string;
  rewardText: string;
  taskText: string;
  durationMinutes: number;
  idempotencyKey?: string;
}

export interface ConfirmContractRequest {
  versionId: string;
  idempotencyKey?: string;
}

export interface ContractResponse {
  contract: Contract;
  acceptedVersion?: ContractVersion | null;
  latestVersion: ContractVersion;
}

export interface ContractVersionResponse {
  contract: Contract;
  version: ContractVersion;
}

export interface ParentContractViewResponse {
  view: ParentContractView;
}

export interface ChildContractViewResponse {
  contract: Contract;
  acceptedVersion?: ContractVersion | null;
  task?: Task | null;
  ownEvidence?: Evidence[];
  ownChildNoteCount?: number;
  diaryEntry?: DiaryEntry | null;
}

export interface WitnessMemoryViewResponse {
  view: WitnessMemoryView;
}

export interface StartTaskRequest {
  idempotencyKey?: string;
}

export interface PauseTaskRequest {
  idempotencyKey?: string;
}

export interface ResumeTaskRequest {
  idempotencyKey?: string;
}

export interface ExitTaskRequest {
  reason: string;
  idempotencyKey?: string;
}

export interface CompleteTaskRequest {
  idempotencyKey?: string;
}

export interface TaskResponse {
  task: Task;
}

export interface SubmitEvidenceRequest {
  reflectionText: string;
  photoUrl?: string;
  visibility?: "contract_family" | "parent_child_only";
  idempotencyKey?: string;
}

export interface EvidenceResponse {
  evidence: Evidence;
}

export interface EvidenceListResponse {
  evidence: Evidence[];
}

export interface MarkFulfilledRequest {
  message?: string;
  idempotencyKey?: string;
}

export interface MarkDelayedRequest {
  message: string;
  expectedAt?: string;
  idempotencyKey?: string;
}

export interface RequestRepairRequest {
  message: string;
  idempotencyKey?: string;
}

export interface FulfillmentResponse {
  fulfillment: Fulfillment;
}

export interface RepairCaseResponse {
  repairCase: RepairCase;
}

export interface GenerateDiaryRequest {
  idempotencyKey?: string;
}

export interface DiaryEntryResponse {
  diaryEntry: DiaryEntry;
}

export interface CreateChildNoteRequest {
  familyId: string;
  contractId?: string;
  body: string;
}

export interface ChildNoteResponse {
  childNote: ChildNote;
}

export interface ChildNoteListResponse {
  childNotes: ChildNote[];
}

export interface CreateWitnessInviteRequest {
  displayName: string;
}

export interface WitnessInviteResponse {
  witness: Witness;
  inviteUrl: string;
}

export interface AcceptWitnessInviteRequest {
  displayName?: string;
}

export interface AddWitnessBlessingRequest {
  blessingMessage: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
}

export interface NotificationResponse {
  notification: Notification;
}

export interface WriteAuditLogRequest {
  familyId: string;
  actorUserId?: string;
  actorType: "parent" | "child" | "witness" | "system" | "admin";
  eventName: string;
  entityType: string;
  entityId: string;
  metadataJson?: Record<string, unknown>;
}

export interface AuditLogResponse {
  id: string;
  eventName: string;
  createdAt: string;
}

export type AiProvider = "mock" | "kimi";

export type AiSuggestionSurface =
  | "contract_rewrite"
  | "wish_rewrite"
  | "diary_tone"
  | "parent_message_tone";

export interface GenerateAiSuggestionRequest {
  surface: AiSuggestionSurface;
  input: string;
  locale?: "zh-CN";
}

export interface GenerateAiSuggestionResponse {
  provider: AiProvider;
  suggestion: string;
  safetyNotes: string[];
}

export interface KimiChatCompletionRequest {
  model: "kimi-for-coding";
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
}

export interface KimiChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: "assistant";
      content: string;
    };
  }>;
}
