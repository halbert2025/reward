# Reward MVP Testing Plan

> Prompt 14 output. This plan converts acceptance criteria, state machines, permissions, and API contract into executable test intent.

## Test Strategy

Reward MVP testing uses five layers:

| Layer | Purpose | Example |
| --- | --- | --- |
| Domain unit | State transitions and illegal transitions. | ContractVersion cannot be overwritten. |
| Permission unit | Server authorization and DTO filtering. | Parent cannot read ChildNote. |
| Integration | Repository transaction, AuditLog, Notification, idempotency. | Submit evidence creates parent response reminder. |
| E2E | P01-P10 user loop. | Child completes task and parent fulfills. |
| Safety regression | Product no-go boundaries and AI/Kimi limits. | No school, escrow, hard lock, open social, or AI judge. |

## Required Fixtures

| Fixture | Contents |
| --- | --- |
| `parentUser` | Active parent in one family. |
| `childUser` | Active child in same family. |
| `coSignerUser` | Optional second parent/co-signer. |
| `witnessUser` | Token-based memorial witness. |
| `family` | Principles confirmed unless scenario starts at onboarding. |
| `rewardPool` | One active safe wish. |
| `contractDraft` | First 25-minute wish contract before child confirm. |
| `confirmedContract` | Contract with accepted ContractVersion. |
| `completedTask` | Child task with reflection submitted. |
| `privateChildNote` | Child-only note attached to family/contract. |

## Test Matrix

| Scenario | Domain | Permission | Notification | AuditLog | E2E |
| --- | --- | --- | --- | --- | --- |
| Normal family fulfillment | Contract, Task, Fulfillment, Diary | Parent/child correct views | child confirm, parent response, diary ready | all key events | yes |
| Parent delay | Fulfillment delayed | Witness cannot see delay detail | child delay notice | fulfillment_delayed | yes |
| Unilateral escalation | ContractVersion immutable | Parent cannot overwrite confirmed version | none or revision notice | contract_version_created or denied | yes |
| Evidence dispute | Fulfillment pending repair, RepairCase opened | Witness cannot see repair detail | repair prompt | repair_requested, repair_opened | yes |
| ChildNote privacy | none | Parent/witness denied | no auto-alert | child_note_created, access denied audit | yes |
| Unsafe input block | safety validation | no unsafe save | none | validation event only | integration/E2E |
| Kimi/AI boundary | no state mutation | no ChildNote to AI | no auto-send | ai_suggestion_requested | unit/integration |

## Given / When / Then Scenarios

### 1. Normal Family: Child Completes Task, Parent Fulfills

Given:

- Parent has created family, confirmed principles, initialized reward pool, and created the first 25-minute contract.
- Child is invited and belongs to the same family.

When:

- Child confirms the latest ContractVersion.
- Child starts the pomodoro.
- Child completes the task.
- Child submits required reflection.
- Parent marks fulfillment as fulfilled.
- System generates diary.

Then:

- Contract moves through pending_child_confirm -> confirmed -> active -> completed -> fulfillment_pending -> fulfilled -> diary_generated.
- Task moves through not_started -> running -> submitted -> accepted_for_review.
- DiaryEntry exists and has `quiet_cat_visit`.
- Parent can see contract, evidence, fulfillment, and diary.
- Child can see own task, evidence, and diary.
- Witness cannot see evidence, ChildNote, amount-like reward details, or repair details.
- Notifications include parent response reminder and diary ready.
- AuditLog includes contract_version_created, contract_child_confirmed, task_started, task_completed, completion_submitted, fulfillment_marked_fulfilled, diary_generated.

### 2. Delayed Family: Child Completes, Parent Sets Delay

Given:

- Child has completed task and submitted reflection.
- Contract is fulfillment_pending.

When:

- Parent selects delayed.
- Parent provides a delay reason or expected time.
- System generates diary.

Then:

- Fulfillment state becomes delayed, then closed after diary.
- Contract reaches diary_generated.
- Copy remains neutral and non-shaming.
- Child receives delayed notice.
- Witness cannot see delay detail.
- AuditLog includes fulfillment_marked_delayed, fulfillment_delayed, diary_generated.

### 3. Unilateral Escalation: Parent Tries To Raise Standard After Completion

Given:

- Child confirmed a ContractVersion and completed the task.

When:

- Parent tries to overwrite the confirmed version or raise the standard before fulfillment.

Then:

- API rejects overwrite with CONTRACT_CONFIRMED_IMMUTABLE or requires a new ContractVersion.
- Existing child effort remains intact.
- Parent cannot delete Task, FocusSession, Evidence, DiaryEntry, or AuditLog.
- No existing acceptedVersionId changes silently.
- AuditLog records denied overwrite or new contract_version_created if revision flow is allowed.

### 4. Evidence Dispute: Parent Chooses Pending Repair

Given:

- Child submitted reflection and optional photo evidence.
- Contract is fulfillment_pending.

When:

- Parent believes evidence is incomplete and selects pending repair.
- Parent submits a neutral repair message.

Then:

- Contract moves to pending_repair.
- RepairCase moves from none to opened.
- No AI judge decides who is right.
- Witness cannot see evidence or repair details.
- Family receives repair prompt.
- AuditLog includes repair_requested and repair_opened.

### 5. Tree-Hole Privacy: Child Writes Private ChildNote

Given:

- Child has access to the completion or note surface.

When:

- Child creates a ChildNote.
- Parent calls parent ChildNote route or opens parent pages.
- Witness opens limited memory view.
- AI/Kimi suggestion endpoint is called from a parent surface.

Then:

- Child can list own ChildNotes.
- Parent receives CHILD_NOTE_PRIVATE and cannot see body.
- Witness receives WITNESS_PERMISSION_DENIED or receives only limited memory DTO.
- No notification is auto-created from ChildNote.
- AI/Kimi request does not include ChildNote body.
- AuditLog includes child_note_created and parent access denied when attempted.

## Domain Unit Tests

- Contract submit creates ContractVersion.
- Child confirms latest ContractVersion only.
- Confirmed ContractVersion cannot be overwritten.
- Parent response cannot happen before child completion.
- Diary cannot generate before parent response.
- RepairCase has no verdict states.
- Archive/export excludes ChildNote.

## Permission Tests

- Parent cannot read ChildNote default content.
- Witness cannot read Evidence.
- Witness cannot read ChildNote.
- Witness cannot read reward amount-like details.
- Witness cannot read repair details.
- Child cannot edit confirmed contract.
- Parent cannot hard-delete child effort records.

## API Integration Tests

- `POST /api/families` writes family_created.
- `POST /api/families/:familyId/principles/confirm` writes principles_confirmed.
- `POST /api/families/:familyId/reward-pool` blocks unsafe wishes and writes reward_pool_initialized.
- `POST /api/families/:familyId/contracts` writes contract_submitted and contract_version_created.
- `POST /api/contracts/:contractId/confirm` writes contract_child_confirmed.
- `POST /api/tasks/:taskId/start` writes task_started.
- `POST /api/tasks/:taskId/evidence` writes completion_submitted and parent_response_requested.
- Fulfillment endpoints write fulfilled, delayed, or repair logs.
- `POST /api/contracts/:contractId/diary/generate` writes diary_generated.
- `GET /api/families/:familyId/child-notes` denies parent.
- `POST /api/ai/suggestions` never sends ChildNote and never changes business state.

## E2E Test Files

| File | Scope |
| --- | --- |
| `tests/e2e/contract-flow.spec.ts` | Onboarding, contract creation, child confirmation, task completion. |
| `tests/e2e/fulfillment-flow.spec.ts` | Fulfilled, delayed, pending repair, diary generation. |
| `tests/e2e/privacy-boundary.spec.ts` | ChildNote privacy, witness limits, AI/Kimi safety boundary. |
| `tests/e2e/admin-operations.spec.ts` | Admin allowlist, status mutation, required notes, family AuditLog, account-level OperationalEvent. |

## Pomodoro And Reward Ticket Acceptance Mapping

| Area | Page | Code | Assertion |
| --- | --- | --- | --- |
| Pomodoro IP states | `/child/pomodoro/[taskId]` | `apps/web/lib/pomodoro-ip-states.ts` | Idle/focus/guest/complete states have triggers, copy, assets, fallback, and QA assertions. |
| Pomodoro main flow | `/child/pomodoro/[taskId]` -> `/child/pomodoro/[taskId]/reflect` | `apps/web/components/wish-pomodoro.tsx` | Child can start, wait for completion, submit reflection, and return to backyard. |
| Reward tickets | `/child/rewards` | `apps/web/app/child/rewards/page.tsx` | Newest ticket is visible after reflection; long list is capped to latest 24 in the child UI. |
| Privacy boundary | `/witness`, `/child/rewards` | `apps/web/lib/server/child-workflow.ts` | Witness cannot see raw ticket/reflection content; exports and deletion follow Evidence lifecycle. |

## Safety Regression Checklist

Each release must scan UI routes, API routes, schema, analytics, and copy for forbidden surfaces:

- school, teacher, class, institution
- payment, wallet, escrow, cash red packet, gift card
- merchant, shopping, sponsor, commission
- video monitoring, realtime location, hard lock
- open social, comments, likes, ranking, stranger follow
- gacha, SSR, rarity, ten-pull, pity, paid random
- AI judge, auto-send, auto-alert from ChildNote

## Coverage Gaps Before Prompt 15

- No runnable app routes exist yet.
- Playwright config does not exist yet.
- Seed data and database test helpers do not exist yet.
- Test files are intentionally skeletons until the web/PWA project is initialized.

## Done When

- The five required Given/When/Then scenarios are documented.
- Test layers cover state, permission, notification, AuditLog, forbidden behavior, and AI/Kimi boundaries.
- E2E skeleton files exist for the MVP demo path.
