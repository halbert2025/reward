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
- Clear final handler note when complete or rejected.
