# Reward Admin Permissions

Date: 2026-05-26  
Stage: P5 Pilot Operations

## Admin Identity

Admin users are identified by `REWARD_ADMIN_EMAILS`.

When an allowlisted email signs in, the user receives:

```text
User.roleHint = admin
```

Admin users access `/admin/pilot`.

## Allowed

Admins may:

- View pilot family operational summaries.
- View consent metadata.
- View data request metadata and request summaries.
- View pilot feedback.
- View risk signal summaries.
- Update statuses and handler/reviewer notes.

## Forbidden

Admins must not:

- Masquerade as a child or parent in production/pilot.
- Read ChildNote raw content through the operations console.
- View real evidence files unless a future legal/safety process explicitly allows it.
- Trigger automatic parent/witness notifications from risk review.
- Edit family contracts, rewards, child reflections, or diaries from admin console.

## Audit

Family-linked admin status changes write `AuditLog`:

- `data_request_status_updated`
- `pilot_feedback_status_updated`
- `risk_signal_status_updated`

Account-level records without a family do not currently write `AuditLog` because `AuditLog.familyId` is required. They remain tracked on their own rows and should be included in a future account-level operations log if needed.
