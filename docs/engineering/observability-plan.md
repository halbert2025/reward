# Reward Observability Plan

Date: 2026-05-26  
Stage: P6 Deployment & Observability

## Health Check

Endpoint:

```text
/api/health
```

The endpoint returns:

- `ok`
- `service`
- `appEnv`
- `database`
- `invitesPaused`
- `latencyMs`

If the database query fails, the endpoint returns HTTP `503`.

## Operational Events

`OperationalEvent` stores lightweight platform events that are not always tied to a family:

- login request invalid email
- login verification failure
- invite creation blocked by pause switch
- invite permission denied
- future action/server failures

These events are for pilot operations and debugging. They must not include ChildNote raw content, evidence photos, or private repair detail.

## Admin Visibility

P5 `/admin/pilot` currently shows operational summaries, data requests, feedback, and risk queue. A future iteration can add an `OperationalEvent` table view if needed. For now, events are queryable through the database and can be inspected during incident review.

## Minimum Production Signals

For a hosted pilot, monitor:

- `/api/health` status and latency.
- HTTP 5xx rate.
- Login verification failures.
- Child invite pause events.
- Database connection failures.
- E2E smoke check after deploy.

## Alerting Guidance

During pilot, alert a human operator when:

- `/api/health` returns non-200 twice in a row.
- Login failures spike in a short period.
- `REWARD_INVITES_PAUSED=true` remains active longer than planned.
- Risk signals remain queued without review.
