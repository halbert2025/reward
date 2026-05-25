# Reward State Machines

> Prompt 11 output. Product and engineering should use this as the shared state baseline.

## Design Principles

- Every business write must go through a domain transition.
- Confirmed contracts are immutable; changes create a new ContractVersion.
- Parent cannot unilaterally delete child effort records.
- Child cannot unilaterally modify confirmed contracts.
- AI can suggest copy or reminders, but cannot judge, decide, auto-send, or auto-alert.
- Disputes become repair flows, not verdict flows.
- ChildNote remains private to the child by default.
- Witness permission is intentionally weak.
- No state machine may require school, institution, payment escrow, video monitoring, hard lock, open social ranking, or gacha behavior.

## Actors

| Actor | Meaning |
| --- | --- |
| parent | Family parent or guardian role. |
| child | Child participant role. |
| witness | Memorial witness with limited read and blessing permissions. |
| system | Deterministic system process, scheduler, or rule-based assistant. |
| admin | Internal development/admin role. Not part of family product behavior. |

## Contract State Machine

### State List

| State | Meaning |
| --- | --- |
| draft | Parent is drafting the contract. |
| pending_child_confirm | Parent has proposed the contract and waits for child confirmation. |
| confirmed | Child accepted the exact ContractVersion. |
| active | Contract is available for task execution. |
| completed | Child completed required task and submitted completion content. |
| fulfillment_pending | Parent response is required. |
| fulfilled | Parent marked the promise fulfilled. |
| delayed | Parent marked fulfillment delayed with a note or expected time. |
| pending_repair | Parent-child repair discussion is needed. |
| diary_generated | Shared diary has been generated. |
| archived | Contract is sealed for normal product use. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| draft | contract.submit_for_child | parent | safe content, reward exists | pending_child_confirm | create ContractVersion, AuditLog |
| pending_child_confirm | contract.child_confirm | child | child belongs to family | confirmed | bind acceptedVersionId, AuditLog |
| confirmed | contract.activate | system | acceptedVersionId exists | active | notify child, AuditLog |
| active | contract.mark_completed | system | linked Task completed | completed | create completion snapshot, AuditLog |
| completed | contract.request_parent_response | system | completion exists | fulfillment_pending | notify parent, AuditLog |
| fulfillment_pending | fulfillment.mark_fulfilled | parent | parent has permission | fulfilled | create Fulfillment, AuditLog |
| fulfillment_pending | fulfillment.mark_delayed | parent | delay note or expected time exists | delayed | create Fulfillment, notify child, AuditLog |
| fulfillment_pending | fulfillment.request_repair | parent | neutral message exists | pending_repair | create RepairCase, AuditLog |
| fulfilled | diary.generate | system | parent response exists | diary_generated | create DiaryEntry, backyard feedback, AuditLog |
| delayed | diary.generate | system | parent response exists | diary_generated | create DiaryEntry, AuditLog |
| pending_repair | diary.generate_repair_memory | system | repair state can be summarized safely | diary_generated | create repair-aware DiaryEntry, AuditLog |
| diary_generated | contract.archive | parent, system | no active repair required | archived | seal normal edits, AuditLog |

### Allowed Actors

- Parent: draft, submit, fulfillment response, archive.
- Child: confirm, view own contract, start linked task through Task state machine.
- System: activate, parent reminder, diary generation, archival housekeeping.
- Witness: no Contract transitions.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| confirmed -> draft | CONTRACT_CONFIRMED_IMMUTABLE |
| confirmed -> pending_child_confirm by editing same version | CONTRACT_VERSION_REQUIRED |
| fulfilled -> pending_repair by witness | WITNESS_CANNOT_REPAIR |
| diary_generated -> completed | CONTRACT_DIARY_FINALIZED |
| archived -> any normal write state | ARCHIVE_SEALED |
| any -> fulfilled by system or AI | AI_CANNOT_JUDGE_OR_FULFILL |

### Notification Triggers

- pending_child_confirm: notify child that a contract is ready to review.
- active: notify child that the pomodoro can start.
- fulfillment_pending: notify parent that a response is needed.
- delayed: notify child with neutral delay copy.
- pending_repair: notify family with repair-oriented copy.
- diary_generated: notify parent and child that the memory is available.

### AuditLog Requirements

Required events:

- contract_submitted
- contract_version_created
- contract_child_confirmed
- contract_activated
- contract_completed
- parent_response_requested
- fulfillment_marked_fulfilled
- fulfillment_marked_delayed
- repair_requested
- diary_generated
- contract_archived

### Edge Cases

- Parent edits a confirmed contract: create a new ContractVersion and move the new proposal to pending_child_confirm.
- Child tries to confirm an outdated version: reject with CONTRACT_VERSION_STALE.
- Parent response is submitted twice: keep first accepted transition and return idempotent result for the same idempotency key.
- Diary generation fails after fulfillment: keep fulfilled/delayed/pending_repair state and retry diary.generate.

### TypeScript Enum

```ts
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
```

### Acceptance Criteria

- Confirmed contract content cannot be overwritten.
- Child confirmation always references a ContractVersion.
- Parent response cannot occur before child completion.
- Diary cannot be generated before parent response.
- All accepted transitions write AuditLog.

## Task State Machine

### State List

| State | Meaning |
| --- | --- |
| not_started | Task exists but child has not started. |
| running | Child started the task. |
| paused | Child paused task without exiting. |
| exited | Child exited early with a reason. |
| submitted | Child submitted completion reflection/evidence. |
| accepted_for_review | Completion is ready for parent response. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| not_started | task.start | child | contract active | running | create FocusSession, AuditLog |
| running | task.pause | child | session active | paused | pause FocusSession, AuditLog |
| paused | task.resume | child | same child, session resumable | running | resume FocusSession, AuditLog |
| running | task.exit | child | reason provided | exited | close FocusSession, notify parent, AuditLog |
| paused | task.exit | child | reason provided | exited | close FocusSession, notify parent, AuditLog |
| running | task.complete | child, system | timer condition met | submitted | require reflection next, AuditLog |
| submitted | task.accept_for_parent_review | system | reflection exists | accepted_for_review | notify parent, AuditLog |

### Allowed Actors

- Child: start, pause, resume, exit, submit.
- System: verify timer condition, move submitted task to parent review.
- Parent: read task summary only; no destructive task transition.
- Witness: no Task transition.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| not_started -> submitted | TASK_MUST_START_FIRST |
| running -> exited without reason | TASK_EXIT_REASON_REQUIRED |
| submitted -> running | TASK_ALREADY_SUBMITTED |
| accepted_for_review -> running | TASK_UNDER_PARENT_REVIEW |
| any -> deleted by parent | PARENT_CANNOT_DELETE_CHILD_EFFORT |

### Notification Triggers

- exited: neutral parent notification.
- accepted_for_review: parent response reminder.

### AuditLog Requirements

- task_started
- task_paused
- task_resumed
- task_exited
- task_completed
- task_submitted_for_review

### Edge Cases

- Start called twice with same idempotency key: return existing running session.
- Timer completes while client disconnects: system can mark submitted only after reflection is saved.
- Exit after completion: reject with TASK_ALREADY_SUBMITTED.

### TypeScript Enum

```ts
export enum TaskState {
  NotStarted = "not_started",
  Running = "running",
  Paused = "paused",
  Exited = "exited",
  Submitted = "submitted",
  AcceptedForReview = "accepted_for_review",
}
```

### Acceptance Criteria

- Child must actively start.
- Early exit requires a reason.
- Parent cannot delete effort records.
- Task completion can lead to parent response only after reflection exists.

## Fulfillment State Machine

### State List

| State | Meaning |
| --- | --- |
| none | No parent response yet. |
| pending | Parent response is required. |
| fulfilled | Parent says the promise has been fulfilled. |
| delayed | Parent gives a delay note or expected time. |
| pending_repair | Parent-child repair is needed. |
| closed | Fulfillment state has been represented in diary. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| none | fulfillment.request | system | child completion exists | pending | notify parent, AuditLog |
| pending | fulfillment.fulfill | parent | parent has permission | fulfilled | notify child, AuditLog |
| pending | fulfillment.delay | parent | delay reason exists | delayed | notify child, AuditLog |
| pending | fulfillment.repair | parent | neutral repair message exists | pending_repair | create RepairCase, AuditLog |
| fulfilled | fulfillment.close | system | diary generated | closed | seal Fulfillment, AuditLog |
| delayed | fulfillment.close | system | diary generated | closed | seal Fulfillment, AuditLog |
| pending_repair | fulfillment.close | system | diary generated or repair snapshot exists | closed | seal snapshot, AuditLog |

### Allowed Actors

- Parent: fulfill, delay, request repair.
- System: request response and close after diary.
- Child: read family-facing fulfillment summary.
- Witness: read only safe completion memory after diary, not amount or repair detail.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| pending -> fulfilled by system or AI | AI_CANNOT_FULFILL |
| pending -> fulfilled by witness | WITNESS_CANNOT_FULFILL |
| fulfilled -> delayed | FULFILLMENT_FINAL |
| closed -> pending | FULFILLMENT_CLOSED |

### Notification Triggers

- pending: parent response reminder.
- fulfilled: child memory notification.
- delayed: child neutral delay notice.
- pending_repair: family repair prompt.

### AuditLog Requirements

- fulfillment_requested
- fulfillment_fulfilled
- fulfillment_delayed
- fulfillment_repair_requested
- fulfillment_closed

### Edge Cases

- Parent response and diary generation race: fulfillment transition wins first, diary reads saved state.
- Duplicate parent response: reject different second response; return idempotent result for exact retry.
- Delay without note: reject.

### TypeScript Enum

```ts
export enum FulfillmentState {
  None = "none",
  Pending = "pending",
  Fulfilled = "fulfilled",
  Delayed = "delayed",
  PendingRepair = "pending_repair",
  Closed = "closed",
}
```

### Acceptance Criteria

- Parent must respond before diary generation.
- Fulfillment can be fulfilled, delayed, or pending repair.
- AI and witness cannot fulfill.
- Delay and repair states use neutral copy.

## RepairCase State Machine

### State List

| State | Meaning |
| --- | --- |
| none | No repair case exists. |
| opened | Repair case has been opened. |
| awaiting_parent | Parent needs to add or revise repair message. |
| awaiting_child | Child needs to respond or acknowledge. |
| mutually_resolved | Family reached a repair outcome. |
| closed_without_verdict | Case closed without judging either side. |
| archived | Repair record is sealed. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| none | repair.open | parent | contract fulfillment pending | opened | create RepairCase, AuditLog |
| opened | repair.ask_parent | system | parent input needed | awaiting_parent | notify parent, AuditLog |
| opened | repair.ask_child | system | child input needed | awaiting_child | notify child, AuditLog |
| awaiting_parent | repair.parent_message | parent | neutral message | awaiting_child | notify child, AuditLog |
| awaiting_child | repair.child_response | child | safe response or skip | awaiting_parent | notify parent, AuditLog |
| awaiting_parent | repair.resolve | parent, child | both sides acknowledged | mutually_resolved | AuditLog |
| awaiting_child | repair.resolve | parent, child | both sides acknowledged | mutually_resolved | AuditLog |
| opened | repair.close_without_verdict | parent | no judgment wording | closed_without_verdict | AuditLog |
| mutually_resolved | repair.archive | system | diary snapshot exists | archived | seal record, AuditLog |
| closed_without_verdict | repair.archive | system | diary snapshot exists | archived | seal record, AuditLog |

### Allowed Actors

- Parent: open repair, message, acknowledge resolution.
- Child: respond, acknowledge resolution.
- System: route prompts, archive.
- Witness: no repair access.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| any -> verdict_parent_right | REPAIR_HAS_NO_VERDICT |
| any -> verdict_child_wrong | REPAIR_HAS_NO_VERDICT |
| opened -> archived without snapshot | REPAIR_SNAPSHOT_REQUIRED |
| any -> witness_view_detail | WITNESS_CANNOT_VIEW_REPAIR |

### Notification Triggers

- opened: notify family with repair-oriented copy.
- awaiting_parent: parent nudge.
- awaiting_child: child nudge.
- mutually_resolved: family memory prompt.

### AuditLog Requirements

- repair_opened
- repair_parent_prompted
- repair_child_prompted
- repair_parent_message_added
- repair_child_response_added
- repair_mutually_resolved
- repair_closed_without_verdict
- repair_archived

### Edge Cases

- Child chooses not to respond: allow neutral closure without verdict.
- Parent uses judgmental wording: block or request rewrite.
- Witness requests repair detail: deny.

### TypeScript Enum

```ts
export enum RepairCaseState {
  None = "none",
  Opened = "opened",
  AwaitingParent = "awaiting_parent",
  AwaitingChild = "awaiting_child",
  MutuallyResolved = "mutually_resolved",
  ClosedWithoutVerdict = "closed_without_verdict",
  Archived = "archived",
}
```

### Acceptance Criteria

- Repair never produces a verdict.
- Witness cannot access repair details.
- Closing repair does not delete effort, evidence, or diary history.

## FamilyTrust State Machine

### State List

| State | Meaning |
| --- | --- |
| uninitialized | Family trust context does not exist. |
| principles_pending | Family exists but principles are not confirmed. |
| active | Principles confirmed and family can create contracts. |
| strained | Multiple delayed or repair states indicate trust needs gentle copy. |
| restoring | Family is repairing through completed follow-up contracts. |
| stable | Family has repeated successful loops. |
| paused | Family paused product use. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| uninitialized | family.create | parent | parent authenticated | principles_pending | create family, AuditLog |
| principles_pending | principles.confirm | parent | all principles checked | active | AuditLog |
| active | trust.mark_strained | system | threshold from delayed/repair events | strained | adjust copy tone, AuditLog |
| strained | trust.start_restoring | parent, system | new small contract created | restoring | suggest small safe contract, AuditLog |
| restoring | trust.mark_stable | system | repeated healthy loops | stable | backyard feedback, AuditLog |
| stable | trust.mark_strained | system | threshold met | strained | adjust copy tone, AuditLog |
| active | family.pause | parent | no active running task | paused | pause reminders, AuditLog |
| paused | family.resume | parent | parent confirms resume | active | resume reminders, AuditLog |

### Allowed Actors

- Parent: create family, confirm principles, pause, resume.
- System: derive strained/restoring/stable from behavior thresholds.
- Child: no direct trust scoring transition.
- Witness: no FamilyTrust transition.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| principles_pending -> active without principles | PRINCIPLES_REQUIRED |
| any -> scored_child_bad | TRUST_IS_NOT_CHILD_SCORE |
| strained -> punitive_lock | NO_HARD_LOCK |
| any -> school_report | SCHOOL_PATH_FORBIDDEN |

### Notification Triggers

- principles_pending: parent setup reminder.
- strained: softer copy only; no shame notification.
- restoring: small-contract suggestion.
- stable: gentle family memory feedback.

### AuditLog Requirements

- family_created
- principles_confirmed
- trust_marked_strained
- trust_restoring_started
- trust_marked_stable
- family_paused
- family_resumed

### Edge Cases

- FamilyTrust must not become a child rating.
- Strained state must not expose sensitive content or private notes.
- Pause cannot interrupt a running child task.

### TypeScript Enum

```ts
export enum FamilyTrustState {
  Uninitialized = "uninitialized",
  PrinciplesPending = "principles_pending",
  Active = "active",
  Strained = "strained",
  Restoring = "restoring",
  Stable = "stable",
  Paused = "paused",
}
```

### Acceptance Criteria

- Principles are required before contract creation.
- Trust state never becomes a visible child score.
- System suggestions stay gentle and non-punitive.

## Archive / TimeCapsule State Machine

### State List

| State | Meaning |
| --- | --- |
| open | Content is active and editable through normal rules. |
| ready_to_seal | Diary or memory can be sealed. |
| sealed | Memory is sealed against normal edits. |
| reopened_by_parent | Parent reopened only allowed parent-owned metadata. |
| exported | Family-safe export was created. |
| deleted_by_retention | Retention policy removed allowed data. |

### Transition Table

| From | Event | Actor | Guard | To | Side Effects |
| --- | --- | --- | --- | --- | --- |
| open | archive.prepare | system | diary exists | ready_to_seal | AuditLog |
| ready_to_seal | archive.seal | parent, system | no active repair needed | sealed | lock normal edits, AuditLog |
| sealed | archive.reopen_parent_metadata | parent | only parent-owned metadata | reopened_by_parent | AuditLog |
| reopened_by_parent | archive.reseal | parent, system | metadata saved | sealed | AuditLog |
| sealed | archive.export_family_safe | parent | export excludes ChildNote and restricted evidence | exported | create export, AuditLog |
| sealed | archive.delete_by_retention | system | retention policy allows deletion | deleted_by_retention | delete allowed data only, AuditLog |

### Allowed Actors

- Parent: seal, reopen parent-owned metadata, request safe export.
- Child: view own memories and private notes according to permissions.
- System: prepare, reseal, retention deletion.
- Witness: view only limited sealed memory summary.

### Forbidden Transitions

| Forbidden Transition | Error Code |
| --- | --- |
| sealed -> open full edit | ARCHIVE_SEALED |
| sealed -> export with ChildNote | EXPORT_CHILD_NOTE_FORBIDDEN |
| sealed -> export witness repair detail | EXPORT_REPAIR_DETAIL_FORBIDDEN |
| any -> hard delete child effort by parent | PARENT_CANNOT_DELETE_CHILD_EFFORT |

### Notification Triggers

- sealed: optional family memory notice.
- exported: parent export ready notice.
- deleted_by_retention: internal audit only unless product copy is required.

### AuditLog Requirements

- archive_prepared
- archive_sealed
- archive_parent_metadata_reopened
- archive_resealed
- archive_exported
- archive_deleted_by_retention

### Edge Cases

- Retention deletion cannot remove AuditLog required for safety and accountability unless policy explicitly says so.
- Export must exclude ChildNote by default.
- Witness view must remain weaker than parent/child view.

### TypeScript Enum

```ts
export enum ArchiveState {
  Open = "open",
  ReadyToSeal = "ready_to_seal",
  Sealed = "sealed",
  ReopenedByParent = "reopened_by_parent",
  Exported = "exported",
  DeletedByRetention = "deleted_by_retention",
}
```

### Acceptance Criteria

- Sealed memories cannot be casually edited.
- Export excludes ChildNote and restricted details.
- Retention behavior cannot become parent-controlled hard deletion of child effort.

## Three Most Error-Prone State Boundaries

1. **ContractVersion boundary:** once a child confirms a ContractVersion, all later edits must create a new version. Updating the same row is a product bug and a trust bug.
2. **Fulfillment versus Repair boundary:** parent can choose fulfilled, delayed, or pending repair, but the system must never convert pending repair into a judgment or verdict.
3. **Privacy boundary around ChildNote, Evidence, and Witness:** parent cannot read ChildNote, witness cannot read ChildNote/evidence/amount/repair details, and exports must preserve those limits.

## Done When

- Product can read this file without TypeScript knowledge and understand each state machine.
- Engineering can implement all transitions through domain functions.
- Every state machine lists states, allowed actors, forbidden transitions, notifications, AuditLog, edge cases, enum sketch, and acceptance criteria.
- The three most error-prone boundaries are explicit.
