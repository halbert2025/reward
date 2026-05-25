# Reward MVP API Contract

> Prompt 13 output. This file should directly guide Next API Routes or backend service implementation.

## API Principles

- All business writes go through domain transitions.
- Server-side authorization is required for every endpoint.
- Confirmed ContractVersion content is immutable.
- Parent cannot read ChildNote default content.
- Witness cannot read Evidence, ChildNote, reward amount-like details, or repair details.
- AI/Kimi cannot judge, fulfill, repair verdicts, auto-send, auto-alert, or read ChildNote.
- Do not design payment, school, institution, merchant, video supervision, hard lock, realtime location, open social, ranking, or gacha APIs.

## Common Envelope

### Success

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};
```

### Error

```ts
type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    field?: string;
  };
  requestId: string;
};
```

## Auth / Current User Mock

### Get Current User

- Method: `GET`
- Path: `/api/auth/me`
- Request DTO: none
- Response DTO: `CurrentUserResponse`
- Required role: any mock session user
- Permission checks: session user exists
- State transition: none
- Audit log: none
- Error cases: `UNAUTHENTICATED`

### Switch Mock User

- Method: `POST`
- Path: `/api/auth/mock-switch`
- Request DTO: `MockSwitchUserRequest`
- Response DTO: `CurrentUserResponse`
- Required role: development mock user
- Permission checks: only enabled in local/demo mode
- State transition: none
- Audit log: `mock_user_switched`
- Error cases: `MOCK_AUTH_DISABLED`, `USER_NOT_FOUND`

## Family

### Create Family

- Method: `POST`
- Path: `/api/families`
- Request DTO: `CreateFamilyRequest`
- Response DTO: `FamilyResponse`
- Required role: parent
- Permission checks: actor can create family
- State transition: `family.create`: uninitialized -> principles_pending
- Audit log: `family_created`
- Error cases: `FORBIDDEN`, `INVALID_FAMILY_NAME`

### Confirm Principles

- Method: `POST`
- Path: `/api/families/:familyId/principles/confirm`
- Request DTO: `ConfirmPrinciplesRequest`
- Response DTO: `FamilyResponse`
- Required role: parent
- Permission checks: actor is active parent in family
- State transition: `principles.confirm`: principles_pending -> active
- Audit log: `principles_confirmed`
- Error cases: `PRINCIPLES_REQUIRED`, `FAMILY_NOT_FOUND`, `FORBIDDEN`

### Invite Child

- Method: `POST`
- Path: `/api/families/:familyId/invitations/child`
- Request DTO: `CreateChildInvitationRequest`
- Response DTO: `ChildInvitationResponse`
- Required role: parent
- Permission checks: actor is active parent in family
- State transition: none
- Audit log: `child_invitation_created`
- Error cases: `FORBIDDEN`, `FAMILY_NOT_ACTIVE`

## RewardPool And Wish

### Initialize RewardPool

- Method: `POST`
- Path: `/api/families/:familyId/reward-pool`
- Request DTO: `InitializeRewardPoolRequest`
- Response DTO: `RewardPoolResponse`
- Required role: parent
- Permission checks: actor is active parent; principles confirmed
- State transition: none
- Audit log: `reward_pool_initialized`
- Error cases: `PRINCIPLES_REQUIRED`, `FORBIDDEN`, `UNSAFE_WISH_CONTENT`

### List Wishes

- Method: `GET`
- Path: `/api/families/:familyId/wishes`
- Request DTO: query `status=active`
- Response DTO: `WishListResponse`
- Required role: parent or child
- Permission checks: actor is active family member
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`

### Choose Wish

- Method: `POST`
- Path: `/api/wishes/:wishId/choose`
- Request DTO: `ChooseWishRequest`
- Response DTO: `WishResponse`
- Required role: child
- Permission checks: child belongs to same family; wish is safe and active
- State transition: none
- Audit log: `wish_chosen`
- Error cases: `FORBIDDEN`, `WISH_NOT_ACTIVE`, `UNSAFE_WISH_CONTENT`

## Contract

### Create First Contract

- Method: `POST`
- Path: `/api/families/:familyId/contracts`
- Request DTO: `CreateContractRequest`
- Response DTO: `ContractResponse`
- Required role: parent
- Permission checks: active parent; child belongs to family; wish belongs to family
- State transition: `contract.submit_for_child`: draft -> pending_child_confirm
- Audit log: `contract_submitted`, `contract_version_created`
- Error cases: `FORBIDDEN`, `UNSAFE_CONTRACT_CONTENT`, `CONTRACT_VERSION_REQUIRED`

### Get Contract

- Method: `GET`
- Path: `/api/contracts/:contractId`
- Request DTO: none
- Response DTO: role-specific `ParentContractViewResponse`, `ChildContractViewResponse`, or `WitnessMemoryViewResponse`
- Required role: parent, co_signer, child, or witness
- Permission checks: choose DTO by role; witness gets limited summary only
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`, `CONTRACT_NOT_FOUND`, `WITNESS_PERMISSION_DENIED`

### Confirm Contract

- Method: `POST`
- Path: `/api/contracts/:contractId/confirm`
- Request DTO: `ConfirmContractRequest`
- Response DTO: `ContractResponse`
- Required role: child
- Permission checks: actor is assigned child; version is latest and pending confirmation
- State transition: `contract.child_confirm`: pending_child_confirm -> confirmed, then system may activate
- Audit log: `contract_child_confirmed`, `contract_activated`
- Error cases: `FORBIDDEN`, `CONTRACT_VERSION_STALE`, `CHILD_CANNOT_EDIT_CONFIRMED_CONTRACT`

### Propose Contract Revision

- Method: `POST`
- Path: `/api/contracts/:contractId/versions`
- Request DTO: `CreateContractVersionRequest`
- Response DTO: `ContractVersionResponse`
- Required role: parent or assigned co_signer
- Permission checks: actor can draft; if contract is confirmed, create new version only
- State transition: new proposal returns contract to pending_child_confirm for the new version
- Audit log: `contract_version_created`
- Error cases: `CONTRACT_CONFIRMED_IMMUTABLE`, `UNSAFE_CONTRACT_CONTENT`

## Task And FocusSession

### Start Task

- Method: `POST`
- Path: `/api/tasks/:taskId/start`
- Request DTO: `StartTaskRequest`
- Response DTO: `TaskResponse`
- Required role: child
- Permission checks: actor is assigned child; contract is active
- State transition: `task.start`: not_started -> running
- Audit log: `task_started`
- Error cases: `TASK_MUST_START_FIRST`, `FORBIDDEN`

### Pause Task

- Method: `POST`
- Path: `/api/tasks/:taskId/pause`
- Request DTO: `PauseTaskRequest`
- Response DTO: `TaskResponse`
- Required role: child
- Permission checks: actor owns running task
- State transition: `task.pause`: running -> paused
- Audit log: `task_paused`
- Error cases: `FORBIDDEN`, `TASK_ALREADY_SUBMITTED`

### Resume Task

- Method: `POST`
- Path: `/api/tasks/:taskId/resume`
- Request DTO: `ResumeTaskRequest`
- Response DTO: `TaskResponse`
- Required role: child
- Permission checks: actor owns paused task
- State transition: `task.resume`: paused -> running
- Audit log: `task_resumed`
- Error cases: `FORBIDDEN`, `TASK_ALREADY_SUBMITTED`

### Exit FocusSession

- Method: `POST`
- Path: `/api/tasks/:taskId/exit`
- Request DTO: `ExitTaskRequest`
- Response DTO: `TaskResponse`
- Required role: child
- Permission checks: actor owns running or paused task
- State transition: `task.exit`: running/paused -> exited
- Audit log: `task_exited`
- Error cases: `TASK_EXIT_REASON_REQUIRED`, `FORBIDDEN`

### Complete Task

- Method: `POST`
- Path: `/api/tasks/:taskId/complete`
- Request DTO: `CompleteTaskRequest`
- Response DTO: `TaskResponse`
- Required role: child
- Permission checks: actor owns running task; timer condition met
- State transition: `task.complete`: running -> submitted
- Audit log: `task_completed`
- Error cases: `FORBIDDEN`, `TASK_ALREADY_SUBMITTED`

### Get Task

- Method: `GET`
- Path: `/api/tasks/:taskId`
- Request DTO: none
- Response DTO: `TaskResponse`
- Required role: parent or child
- Permission checks: parent can read summary; child can read own task
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`, `TASK_NOT_FOUND`

## Evidence

### Submit Evidence

- Method: `POST`
- Path: `/api/tasks/:taskId/evidence`
- Request DTO: `SubmitEvidenceRequest`
- Response DTO: `EvidenceResponse`
- Required role: child
- Permission checks: actor owns task
- State transition: `task.accept_for_parent_review`: submitted -> accepted_for_review; contract completed -> fulfillment_pending
- Audit log: `completion_submitted`, `task_submitted_for_review`, `parent_response_requested`
- Error cases: `REFLECTION_REQUIRED`, `FORBIDDEN`, `TASK_NOT_SUBMITTED`

### Get Evidence

- Method: `GET`
- Path: `/api/tasks/:taskId/evidence`
- Request DTO: none
- Response DTO: `EvidenceListResponse`
- Required role: parent or child
- Permission checks: parent can read contract evidence; child can read own evidence; witness denied
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`, `WITNESS_PERMISSION_DENIED`

## Fulfillment

### Mark Fulfilled

- Method: `POST`
- Path: `/api/contracts/:contractId/fulfillment/fulfilled`
- Request DTO: `MarkFulfilledRequest`
- Response DTO: `FulfillmentResponse`
- Required role: parent or assigned co_signer
- Permission checks: actor can respond; contract is fulfillment_pending
- State transition: fulfillment_pending -> fulfilled; fulfillment pending -> fulfilled
- Audit log: `fulfillment_marked_fulfilled`, `fulfillment_fulfilled`
- Error cases: `FORBIDDEN`, `AI_CANNOT_FULFILL`, `FULFILLMENT_FINAL`

### Mark Delayed

- Method: `POST`
- Path: `/api/contracts/:contractId/fulfillment/delayed`
- Request DTO: `MarkDelayedRequest`
- Response DTO: `FulfillmentResponse`
- Required role: parent or assigned co_signer
- Permission checks: actor can respond; delay reason or expected time exists
- State transition: fulfillment_pending -> delayed; fulfillment pending -> delayed
- Audit log: `fulfillment_marked_delayed`, `fulfillment_delayed`
- Error cases: `DELAY_REASON_REQUIRED`, `FORBIDDEN`, `FULFILLMENT_FINAL`

### Request Repair

- Method: `POST`
- Path: `/api/contracts/:contractId/fulfillment/repair`
- Request DTO: `RequestRepairRequest`
- Response DTO: `RepairCaseResponse`
- Required role: parent or assigned co_signer
- Permission checks: actor can respond; message is neutral
- State transition: fulfillment_pending -> pending_repair; repair none -> opened
- Audit log: `repair_requested`, `repair_opened`
- Error cases: `REPAIR_HAS_NO_VERDICT`, `FORBIDDEN`, `JUDGMENTAL_REPAIR_COPY`

## DiaryEntry

### Generate Diary

- Method: `POST`
- Path: `/api/contracts/:contractId/diary/generate`
- Request DTO: `GenerateDiaryRequest`
- Response DTO: `DiaryEntryResponse`
- Required role: system
- Permission checks: contract has parent response
- State transition: fulfilled/delayed/pending_repair -> diary_generated
- Audit log: `diary_generated`
- Error cases: `PARENT_RESPONSE_REQUIRED`, `DIARY_ALREADY_EXISTS`

### Get Diary

- Method: `GET`
- Path: `/api/diary/:diaryEntryId`
- Request DTO: none
- Response DTO: `DiaryEntryResponse` or `WitnessMemoryViewResponse`
- Required role: parent, child, or witness
- Permission checks: parent/child family access; witness limited memory only
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`, `WITNESS_PERMISSION_DENIED`

## ChildNote

### Create ChildNote

- Method: `POST`
- Path: `/api/child-notes`
- Request DTO: `CreateChildNoteRequest`
- Response DTO: `ChildNoteResponse`
- Required role: child
- Permission checks: actor creates own note only
- State transition: none
- Audit log: `child_note_created`
- Error cases: `FORBIDDEN`, `CHILD_NOTE_REQUIRED`

### List Own ChildNotes

- Method: `GET`
- Path: `/api/child-notes`
- Request DTO: optional `familyId`, `contractId`
- Response DTO: `ChildNoteListResponse`
- Required role: child
- Permission checks: child can read own notes only
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`

### Parent ChildNote Access

- Method: `GET`
- Path: `/api/families/:familyId/child-notes`
- Request DTO: none
- Response DTO: error only in MVP
- Required role: parent
- Permission checks: always deny default ChildNote content
- State transition: none
- Audit log: `child_note_parent_access_denied`
- Error cases: `CHILD_NOTE_PRIVATE`

## Witness

### Create Witness Invite

- Method: `POST`
- Path: `/api/contracts/:contractId/witnesses`
- Request DTO: `CreateWitnessInviteRequest`
- Response DTO: `WitnessInviteResponse`
- Required role: parent
- Permission checks: contract belongs to family; diary exists or completion summary is safe
- State transition: none
- Audit log: `witness_invited`
- Error cases: `FORBIDDEN`, `WITNESS_SCOPE_NOT_READY`

### Accept Witness Invite

- Method: `POST`
- Path: `/api/witness-invites/:token/accept`
- Request DTO: `AcceptWitnessInviteRequest`
- Response DTO: `WitnessMemoryViewResponse`
- Required role: witness token
- Permission checks: token valid; witness limited DTO only
- State transition: none
- Audit log: `witness_invite_accepted`
- Error cases: `INVITE_EXPIRED`, `WITNESS_PERMISSION_DENIED`

### Add Witness Blessing

- Method: `POST`
- Path: `/api/witnesses/:witnessId/blessing`
- Request DTO: `AddWitnessBlessingRequest`
- Response DTO: `WitnessMemoryViewResponse`
- Required role: witness token
- Permission checks: witness belongs to contract; blessing copy safe
- State transition: none
- Audit log: `witness_blessing_added`
- Error cases: `FORBIDDEN`, `UNSAFE_WITNESS_COPY`

## Notification

### List Notifications

- Method: `GET`
- Path: `/api/notifications`
- Request DTO: optional `unreadOnly`
- Response DTO: `NotificationListResponse`
- Required role: parent, child, or witness
- Permission checks: actor can read own notifications only
- State transition: none
- Audit log: none
- Error cases: `FORBIDDEN`

### Mark Notification Read

- Method: `POST`
- Path: `/api/notifications/:notificationId/read`
- Request DTO: none
- Response DTO: `NotificationResponse`
- Required role: notification recipient
- Permission checks: actor owns notification
- State transition: none
- Audit log: `notification_read`
- Error cases: `FORBIDDEN`, `NOTIFICATION_NOT_FOUND`

## AuditLog

### Write AuditLog

- Method: internal function only
- Path: not public
- Request DTO: `WriteAuditLogRequest`
- Response DTO: `AuditLogResponse`
- Required role: system
- Permission checks: called by domain service only
- State transition: none
- Audit log: writes requested event
- Error cases: `AUDIT_EVENT_REQUIRED`, `AUDIT_METADATA_UNSAFE`

## AI / Kimi Integration

Kimi is integrated as an internal AI provider, not as a decision-maker.

### Provider Configuration

- Provider name: `kimi`
- Protocol for MVP: OpenAI-compatible chat completions
- Base URL: `https://api.kimi.com/coding/v1`
- Endpoint: `https://api.kimi.com/coding/v1/chat/completions`
- Model: `kimi-for-coding`
- Environment variables:
  - `AI_PROVIDER=mock | kimi`
  - `KIMI_API_KEY`
  - `KIMI_BASE_URL=https://api.kimi.com/coding/v1`
  - `KIMI_MODEL=kimi-for-coding`

### Generate Safe Suggestion

- Method: `POST`
- Path: `/api/ai/suggestions`
- Request DTO: `GenerateAiSuggestionRequest`
- Response DTO: `GenerateAiSuggestionResponse`
- Required role: parent or child, depending on surface
- Permission checks:
  - Do not send ChildNote body.
  - Do not send raw repair dispute text unless explicitly filtered.
  - Do not send exact location, school/class data, real child names, or images.
  - Surface must be one of: contract_rewrite, wish_rewrite, diary_tone, parent_message_tone.
- State transition: none
- Audit log: `ai_suggestion_requested`
- Error cases: `AI_DISABLED`, `AI_PROVIDER_NOT_CONFIGURED`, `AI_INPUT_UNSAFE`, `AI_CANNOT_JUDGE`

### Kimi Request Shape

```ts
type KimiChatCompletionRequest = {
  model: "kimi-for-coding";
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
};
```

### Kimi Safety Boundary

- Kimi may rewrite unsafe wording into safer wording.
- Kimi may suggest a gentler parent message.
- Kimi may draft diary tone from already-safe summaries.
- Kimi must not decide whether a child completed a promise.
- Kimi must not auto-send parent/child/witness messages.
- Kimi must not receive or analyze ChildNote.
- Kimi must not create notifications from private child text.

## Forbidden API Surfaces

Do not create:

- `/api/payments/*`
- `/api/wallets/*`
- `/api/schools/*`
- `/api/classes/*`
- `/api/institutions/*`
- `/api/merchants/*`
- `/api/video-monitoring/*`
- `/api/location/*`
- `/api/social/*`
- `/api/rankings/*`
- `/api/gacha/*`

## Done When

- This file can guide Next API Routes or backend service implementation.
- Each endpoint lists method, path, request DTO, response DTO, role, permission checks, state transition, audit log, and error cases.
- Kimi API is represented as a bounded internal provider.
- No forbidden payment, school, institution, merchant, video, hard-lock, open-social, ranking, or gacha API exists.
