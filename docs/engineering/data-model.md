# Reward MVP Data Model

> Prompt 12 output. This document is the product-readable data model baseline.

## Modeling Rules

- ContractVersion must exist. Confirmed contract content is never overwritten.
- AuditLog must exist for every key state transition.
- ChildNote and Evidence are separate objects.
- ChildNote is child-private by default.
- Evidence visibility follows contract permission, not witness permission.
- Deletion uses soft delete, archive, or retention policy first.
- The role model supports parent, child, co-signer, witness, system, and admin.
- MVP must not add school/class/institution, payment wallet, merchant, video monitoring, or realtime location as core entities.

## Sensitivity Classes

| Class | Meaning | Examples |
| --- | --- | --- |
| A | Public or low-risk product metadata | template ids, non-sensitive config |
| B | Family internal data | family name, contract title, diary summary |
| C | Child expression or evidence | reflection, photo evidence, ChildNote |
| D | Safety, dispute, or repair-sensitive data | repair messages, audit context |
| E | Secrets and internal security data | tokens, invite secrets |

## Entity Overview

| Entity | Purpose | Sensitivity | Delete Policy |
| --- | --- | --- | --- |
| User | Mock-auth user identity. | B | soft delete |
| Family | Family workspace. | B | archive |
| FamilyMember | User role inside a family. | B | soft delete |
| Membership | Co-sign or participation relation for contract-level permissions. | B | soft delete |
| RewardPool | Parent-created safe wish pool. | B | archive |
| Wish | Small wish item. | B | archive |
| Contract | State holder for a family promise. | B/D | archive |
| ContractVersion | Immutable contract content snapshot. | B/D | never overwrite |
| Task | Child-facing execution task. | B/C | archive |
| FocusSession | Pomodoro execution session. | B/C | archive |
| Evidence | Completion reflection and optional photo metadata. | C | archive |
| Fulfillment | Parent response to completion. | B/D | archive |
| RepairCase | Repair flow, not verdict. | D | archive |
| Witness | Memorial witness invite/access. | B/E | revoke or expire |
| DiaryEntry | Shared memory generated after response. | B/C | archive |
| ChildNote | Child-private note/tree-hole. | C/D | child-controlled archive |
| Notification | In-app reminder record. | B/D | retention delete |
| AuditLog | Accountability trail. | D/E | retention only |

## Derived Product Objects

### RewardTicket

RewardTicket is a product-facing derived object, not a separate persisted Prisma model in the current pilot build.

- Source of truth: `Evidence` rows created by `submitWishReflection`.
- Display surface: `/child/rewards`.
- Included fields: ticket creation date, wish title, task title, child reflection excerpt, mock photo label when present, diary status, and static cat cafe artwork.
- Sensitivity: C, because it contains child-authored reflection text.
- Visibility: child and authorized family parent views only. Witness views must not expose RewardTicket raw content.
- Export: included in family-safe exports as part of task completion evidence.
- Deletion and sealing: follows the underlying `Evidence` lifecycle. Sealed family data must hide RewardTicket from normal collection views while retaining minimum audit records.
- Retention: same as `Evidence` until a separate retention policy is approved.

## Entities

### User

Fields:

- `id`: string, required.
- `displayName`: string, required.
- `mockEmail`: string, optional, unique when present.
- `roleHint`: parent, child, system, admin, optional.
- `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Has many FamilyMember records.
- Has many child-authored ChildNote records.
- Has many AuditLog actor references.

Permission notes:

- Users cannot infer other families from user records.

### Family

Fields:

- `id`: string, required.
- `name`: string, required.
- `trustState`: FamilyTrustState.
- `principlesConfirmedAt`: datetime, optional.
- `createdById`: User id.
- `createdAt`, `updatedAt`, `archivedAt`.

Relationships:

- Has many FamilyMember, RewardPool, Contract, DiaryEntry, Notification, AuditLog.

Permission notes:

- Parent can manage family setup.
- Child can view family display context only after membership.
- Witness cannot browse Family directly.

### FamilyMember

Fields:

- `id`: string.
- `familyId`, `userId`.
- `role`: parent, child, co_signer, system_admin.
- `status`: invited, active, paused, removed.
- `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Belongs to User and Family.

Permission notes:

- Server-side permission checks use FamilyMember, not UI state.

### Membership

Fields:

- `id`: string.
- `familyId`, `userId`, optional `contractId`.
- `kind`: family_member, contract_owner, contract_child, contract_cosigner.
- `status`: active, revoked.
- `createdAt`, `updatedAt`, `deletedAt`.

Purpose:

- Provides a contract-level permission layer for multi-parent and co-signer cases.

### RewardPool

Fields:

- `id`, `familyId`, `createdById`.
- `title`: string.
- `status`: draft, active, archived.
- `createdAt`, `updatedAt`, `archivedAt`.

Relationships:

- Has many Wish records.

Permission notes:

- Parent creates and edits safe wishes.
- Child can browse active safe wishes.

### Wish

Fields:

- `id`, `rewardPoolId`.
- `title`: string.
- `description`: string, optional.
- `category`: time, experience, object, privilege, other.
- `safetyStatus`: pending, approved, blocked.
- `createdAt`, `updatedAt`, `archivedAt`.

Privacy notes:

- Must not encode cash, merchant, school, institution, surveillance, or gacha behavior.

### Contract

Fields:

- `id`, `familyId`, `wishId`, `createdById`, `childId`.
- `state`: ContractState.
- `acceptedVersionId`: ContractVersion id, optional until child confirmation.
- `currentVersionNumber`: integer.
- `createdAt`, `updatedAt`, `archivedAt`.

Relationships:

- Has many ContractVersion, Task, Fulfillment, RepairCase, Witness, DiaryEntry, Membership.

Permission notes:

- Parent can draft.
- Child confirms a version.
- Nobody overwrites accepted content.

### ContractVersion

Fields:

- `id`, `contractId`, `versionNumber`.
- `title`, `promiseText`, `rewardText`, `taskText`.
- `durationMinutes`: integer, default 25 for first template.
- `createdById`.
- `createdAt`, `confirmedAt`.

Rules:

- Immutable after creation.
- New edits create a new row.
- Child confirmation binds Contract.acceptedVersionId.

### Task

Fields:

- `id`, `contractId`, `assignedChildId`.
- `state`: TaskState.
- `title`.
- `plannedDurationMinutes`.
- `startedAt`, `completedAt`, `exitedAt`.
- `exitReason`: string, optional.
- `createdAt`, `updatedAt`, `archivedAt`.

Relationships:

- Has many FocusSession and Evidence.

Permission notes:

- Child drives task transitions.
- Parent cannot delete task effort.

### FocusSession

Fields:

- `id`, `taskId`, `childId`.
- `state`: not_started, running, paused, completed, exited.
- `startedAt`, `pausedAt`, `endedAt`.
- `durationSeconds`.
- `exitReason`: optional.
- `createdAt`, `updatedAt`.

Purpose:

- Records the wish pomodoro execution without video, location, or hard lock.

### Evidence

Fields:

- `id`, `taskId`, `authorId`.
- `reflectionText`: required.
- `photoUrl`: optional placeholder.
- `visibility`: contract_family, parent_child_only.
- `createdAt`, `updatedAt`, `archivedAt`.

Privacy notes:

- Evidence is not ChildNote.
- Parent can view contract evidence.
- Witness cannot view evidence in MVP.
- Analytics cannot include raw reflection text or child face data.

### Fulfillment

Fields:

- `id`, `contractId`, `respondedById`.
- `state`: FulfillmentState.
- `responseType`: fulfilled, delayed, pending_repair.
- `message`: optional.
- `expectedAt`: optional for delay.
- `createdAt`, `updatedAt`, `closedAt`.

Permission notes:

- Parent responds.
- AI and witness cannot fulfill.

### RepairCase

Fields:

- `id`, `contractId`, `openedById`.
- `state`: RepairCaseState.
- `parentMessage`: optional.
- `childResponse`: optional.
- `resolutionSummary`: optional, no verdict.
- `createdAt`, `updatedAt`, `archivedAt`.

Privacy notes:

- Witness cannot view repair details.
- Repair language must avoid blame and verdict.

### Witness

Fields:

- `id`, `contractId`, `invitedById`.
- `displayName`: string.
- `inviteTokenHash`: string.
- `status`: invited, accepted, expired, revoked.
- `blessingMessage`: optional.
- `createdAt`, `acceptedAt`, `revokedAt`.

Permission notes:

- Witness sees limited completion memory only.
- No amount, Evidence, ChildNote, or repair detail.

### DiaryEntry

Fields:

- `id`, `familyId`, `contractId`.
- `title`, `summary`.
- `parentMessage`: optional.
- `childReflectionExcerpt`: optional safe excerpt.
- `backyardSignal`: quiet_cat_visit or none.
- `createdAt`, `updatedAt`, `archivedAt`.

Permission notes:

- Parent and child can view.
- Witness can view limited safe summary after invitation.

### ChildNote

Fields:

- `id`, `familyId`, `childId`, optional `contractId`.
- `body`: required.
- `visibility`: child_private by default.
- `createdAt`, `updatedAt`, `archivedAt`.

Privacy notes:

- Parent cannot view default ChildNote content.
- Witness cannot view ChildNote.
- System cannot auto-alert or auto-send from ChildNote in MVP.
- Analytics cannot include raw ChildNote content.

### Notification

Fields:

- `id`, `familyId`, `recipientUserId`.
- `type`: child_confirm_needed, child_can_start, parent_response_needed, delayed_notice, repair_prompt, diary_ready.
- `title`, `body`.
- `readAt`, `createdAt`, `expiresAt`.

Rules:

- Notifications are generated from valid transitions.
- No unsafe private ChildNote content in notification body.

### AuditLog

Fields:

- `id`, `familyId`, optional `actorUserId`.
- `actorType`: parent, child, witness, system, admin.
- `eventName`: string.
- `entityType`, `entityId`.
- `metadataJson`: limited JSON.
- `createdAt`.

Rules:

- Never store raw ChildNote, child face data, exact location, or unsafe free text in metadata.
- Retain according to safety/accountability policy.

## DTO Boundaries

- Parent DTOs exclude ChildNote body.
- Witness DTOs exclude Evidence, amount-like reward fields, ChildNote, RepairCase, and internal AuditLog.
- Analytics DTOs exclude raw reflection, raw note, real names, exact location, school/class data, and image content.
- Export DTOs exclude ChildNote by default.

## Migration Risks

- If ContractVersion is added late, contract trust rules will be hard to retrofit.
- If Evidence and ChildNote share storage, parent/witness privacy bugs become likely.
- If AuditLog metadata accepts raw JSON without filtering, sensitive child text may leak.
- If role checks rely on UI only, child-private data can be exposed through API calls.

## Tests Needed

- ContractVersion immutability test.
- AuditLog write test for each key transition.
- Parent cannot read ChildNote test.
- Witness cannot read Evidence, ChildNote, amount, or repair detail test.
- Soft-delete/archive behavior test for child effort records.
- Analytics payload privacy test.

## Done When

- All Prompt 12 required objects are represented.
- ContractVersion, AuditLog, ChildNote, Evidence, and role modeling are explicit.
- Product and engineering can tell which data is private, family-visible, witness-visible, or audit-only.
