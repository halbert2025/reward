# Reward State Transition Table

> Prompt 11 output. Compact implementation reference for transition guards, events, and side effects.

## Shared Columns

| Column | Meaning |
| --- | --- |
| Machine | State machine name. |
| From | Required current state. |
| Event | Domain event/function name. |
| Actor | Actor allowed to request transition. |
| Guard | Required condition. |
| To | Next state. |
| AuditLog | Required audit event. |
| Notify | Notification side effect. |
| Idempotency | Retry behavior. |

## Contract

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| draft | contract.submit_for_child | parent | safe content, reward exists | pending_child_confirm | contract_submitted, contract_version_created | child | same key returns same version |
| pending_child_confirm | contract.child_confirm | child | family member, latest version | confirmed | contract_child_confirmed | none | same key returns accepted version |
| confirmed | contract.activate | system | acceptedVersionId exists | active | contract_activated | child | repeat is no-op |
| active | contract.mark_completed | system | Task accepted_for_review | completed | contract_completed | none | repeat is no-op |
| completed | contract.request_parent_response | system | completion exists | fulfillment_pending | parent_response_requested | parent | repeat is no-op |
| fulfillment_pending | fulfillment.mark_fulfilled | parent | parent has permission | fulfilled | fulfillment_marked_fulfilled | child | exact retry returns same result |
| fulfillment_pending | fulfillment.mark_delayed | parent | delay note or expected time | delayed | fulfillment_marked_delayed | child | exact retry returns same result |
| fulfillment_pending | fulfillment.request_repair | parent | neutral message | pending_repair | repair_requested | family | exact retry returns same result |
| fulfilled | diary.generate | system | response exists | diary_generated | diary_generated | parent, child | repeat returns existing diary |
| delayed | diary.generate | system | response exists | diary_generated | diary_generated | parent, child | repeat returns existing diary |
| pending_repair | diary.generate_repair_memory | system | safe repair snapshot | diary_generated | diary_generated | parent, child | repeat returns existing diary |
| diary_generated | contract.archive | parent, system | no active repair needed | archived | contract_archived | none | repeat is no-op |

## Task

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| not_started | task.start | child | contract active | running | task_started | none | same key returns session |
| running | task.pause | child | active session | paused | task_paused | none | repeat is no-op |
| paused | task.resume | child | resumable session | running | task_resumed | none | repeat is no-op |
| running | task.exit | child | reason provided | exited | task_exited | parent | same key returns exit record |
| paused | task.exit | child | reason provided | exited | task_exited | parent | same key returns exit record |
| running | task.complete | child, system | timer condition met | submitted | task_completed | none | repeat is no-op |
| submitted | task.accept_for_parent_review | system | reflection exists | accepted_for_review | task_submitted_for_review | parent | repeat is no-op |

## Fulfillment

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| none | fulfillment.request | system | child completion exists | pending | fulfillment_requested | parent | repeat is no-op |
| pending | fulfillment.fulfill | parent | parent has permission | fulfilled | fulfillment_fulfilled | child | exact retry returns same result |
| pending | fulfillment.delay | parent | delay reason exists | delayed | fulfillment_delayed | child | exact retry returns same result |
| pending | fulfillment.repair | parent | neutral repair message | pending_repair | fulfillment_repair_requested | family | exact retry returns same result |
| fulfilled | fulfillment.close | system | diary generated | closed | fulfillment_closed | none | repeat is no-op |
| delayed | fulfillment.close | system | diary generated | closed | fulfillment_closed | none | repeat is no-op |
| pending_repair | fulfillment.close | system | diary or repair snapshot exists | closed | fulfillment_closed | none | repeat is no-op |

## RepairCase

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| none | repair.open | parent | contract fulfillment pending | opened | repair_opened | family | same key returns case |
| opened | repair.ask_parent | system | parent input needed | awaiting_parent | repair_parent_prompted | parent | repeat is no-op |
| opened | repair.ask_child | system | child input needed | awaiting_child | repair_child_prompted | child | repeat is no-op |
| awaiting_parent | repair.parent_message | parent | neutral message | awaiting_child | repair_parent_message_added | child | same key returns message |
| awaiting_child | repair.child_response | child | safe response or skip | awaiting_parent | repair_child_response_added | parent | same key returns response |
| awaiting_parent | repair.resolve | parent, child | both sides acknowledged | mutually_resolved | repair_mutually_resolved | family | repeat is no-op |
| awaiting_child | repair.resolve | parent, child | both sides acknowledged | mutually_resolved | repair_mutually_resolved | family | repeat is no-op |
| opened | repair.close_without_verdict | parent | no judgment wording | closed_without_verdict | repair_closed_without_verdict | family | repeat is no-op |
| mutually_resolved | repair.archive | system | diary snapshot exists | archived | repair_archived | none | repeat is no-op |
| closed_without_verdict | repair.archive | system | diary snapshot exists | archived | repair_archived | none | repeat is no-op |

## FamilyTrust

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| uninitialized | family.create | parent | parent authenticated | principles_pending | family_created | none | same key returns family |
| principles_pending | principles.confirm | parent | all principles checked | active | principles_confirmed | none | repeat is no-op |
| active | trust.mark_strained | system | threshold met | strained | trust_marked_strained | none | repeat is no-op |
| strained | trust.start_restoring | parent, system | new small contract | restoring | trust_restoring_started | none | repeat is no-op |
| restoring | trust.mark_stable | system | healthy loops threshold | stable | trust_marked_stable | family | repeat is no-op |
| stable | trust.mark_strained | system | threshold met | strained | trust_marked_strained | none | repeat is no-op |
| active | family.pause | parent | no running task | paused | family_paused | none | repeat is no-op |
| paused | family.resume | parent | parent confirms | active | family_resumed | none | repeat is no-op |

## Archive / TimeCapsule

| From | Event | Actor | Guard | To | AuditLog | Notify | Idempotency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| open | archive.prepare | system | diary exists | ready_to_seal | archive_prepared | none | repeat is no-op |
| ready_to_seal | archive.seal | parent, system | no active repair needed | sealed | archive_sealed | family optional | repeat is no-op |
| sealed | archive.reopen_parent_metadata | parent | parent-owned metadata only | reopened_by_parent | archive_parent_metadata_reopened | none | same key returns edit session |
| reopened_by_parent | archive.reseal | parent, system | metadata saved | sealed | archive_resealed | none | repeat is no-op |
| sealed | archive.export_family_safe | parent | excludes restricted content | exported | archive_exported | parent | same key returns export |
| sealed | archive.delete_by_retention | system | policy allows | deleted_by_retention | archive_deleted_by_retention | internal only | repeat is no-op |

## Global Illegal Transitions

| Attempt | Error Code |
| --- | --- |
| Overwrite confirmed ContractVersion | CONTRACT_CONFIRMED_IMMUTABLE |
| Parent hard-deletes child effort | PARENT_CANNOT_DELETE_CHILD_EFFORT |
| Child edits confirmed contract | CHILD_CANNOT_EDIT_CONFIRMED_CONTRACT |
| AI judges, fulfills, repairs, or alerts | AI_CANNOT_JUDGE |
| Witness views evidence, amount, ChildNote, or repair detail | WITNESS_PERMISSION_DENIED |
| Any school/institution workflow | SCHOOL_PATH_FORBIDDEN |
| Any escrow/payment wallet workflow | PAYMENT_ESCROW_FORBIDDEN |
| Any video/hard-lock workflow | SURVEILLANCE_FORBIDDEN |

## Done When

- Engineers can implement transition guards from this table.
- QA can derive positive and negative state tests from this table.
- Every transition includes actor, guard, next state, AuditLog, notification, and idempotency behavior.
