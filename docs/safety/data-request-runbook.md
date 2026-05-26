# Reward Data Request Runbook

Date: 2026-05-26  
Stage: P3 Privacy & Consent Gate

## Request Types

Reward pilot supports four manual request types:

| Type | Meaning | First Response |
| --- | --- | --- |
| `export` | Family-safe data export request | Confirm scope and requester authority. |
| `deletion` | Deletion review request | Confirm legal/safety retention constraints. |
| `seal` | Seal/archive sensitive family data | Pause access and mark for review. |
| `exit_pilot` | Family or account exits the pilot | Stop new invites and plan data handling. |

## Statuses

| Status | Meaning |
| --- | --- |
| `requested` | User submitted request. |
| `in_review` | Pilot team is reviewing identity, scope, and retention constraints. |
| `completed` | Request has been handled. |
| `rejected_with_reason` | Request cannot be fulfilled as submitted; reason must be recorded. |

## Product Entry

The request entry page is:

```text
/privacy/requests
```

It creates a `DataRequest` row and writes an `AuditLog` event when the request is linked to a family.

## Manual Handling Rules

- Do not promise instant deletion.
- Do not expose ChildNote raw content in family exports by default.
- Do not include witness blessing drafts or sensitive repair details unless reviewed.
- Verify that the requester is an active family member before family-level processing.
- For child-originated concerns, keep language calm and avoid punitive escalation.

## Suggested Internal SLA

- Acknowledge within 3 business days.
- Complete straightforward exports within 14 business days.
- Escalate deletion, sealing, safety, or dispute-related requests for manual review.

## Audit Requirements

Every handled request should have:

- Original `DataRequest` row.
- Status transition record in operations notes or admin tool.
- `AuditLog` event for family-linked requests.
- `OperationalEvent` event for account-level requests where `familyId` is empty.
- Clear final handler note when complete or rejected.

## Reward Ticket Scope

Reward tickets are the child-facing collection view derived from completion `Evidence` rows.

- Export: include reward ticket date, wish title, task title, reflection text, mock photo label, and parent-visible diary status when the requester is authorized to export the family data.
- Deletion review: do not delete the underlying `Evidence` directly during an active contract review; first determine whether the request is child-originated, guardian-originated, or family-level.
- Seal: sealed family data must hide reward ticket lists from normal product views while preserving the minimum audit and dispute-resolution record.
- Exit pilot: include reward tickets in the data handling plan because they contain child-authored reflection text.
- Witness access: witnesses must not receive raw reward tickets or child reflection text unless a future reviewed sharing rule explicitly allows it.
