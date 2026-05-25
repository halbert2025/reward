# Reward Pilot Operations Runbook

Date: 2026-05-26  
Stage: P5 Pilot Operations

## Scope

P5 provides the smallest useful operations surface for a limited pilot:

- View recent pilot families.
- View consent records.
- Review data export/deletion/sealing/exit requests.
- Review parent/child/witness feedback.
- Review safety-related risk signals.
- Update request, feedback, and risk review statuses.

## Admin Access

Admin access is allowlist-based:

```env
REWARD_ADMIN_EMAILS=admin@example.com
```

An allowlisted email that signs in through `/auth/login` receives `roleHint=admin` and lands on:

```text
/admin/pilot
```

Admin users are not family members and should not participate in normal family flows.

## Feedback Intake

Pilot users can submit feedback at:

```text
/feedback
```

Supported feedback types:

- `bug`
- `usability`
- `safety`
- `general`

Safety feedback creates a queued `RiskSignal` for manual review. It does not automatically notify parents, witnesses, or external parties.

## Data Request Handling

Admins can move `DataRequest.status` through:

- `requested`
- `in_review`
- `completed`
- `rejected_with_reason`

Completed or rejected requests require a handler note. Family-linked status changes write `AuditLog`.

## Risk Review Handling

Admins can move `RiskSignal.status` through:

- `queued`
- `in_review`
- `resolved`
- `dismissed`

Resolved or dismissed risk signals require a reviewer note. Family-linked status changes write `AuditLog`.

## Guardrails

- Admin console must not show ChildNote raw content.
- Admin actions must not auto-alert parents or witnesses.
- Safety feedback creates a queue item only; it does not judge fault.
- Operations notes should stay factual and minimal.
- Admin actions on family-linked records write `AuditLog`.
