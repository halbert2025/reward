# Reward Pilot Hardening Plan

Date: 2026-05-26  
Stage: P11 Pilot Hardening

## Current Status

Pilot hardening can start as an internal readiness pass. Full P11 hardening based on real usage must wait for first-batch feedback.

## Hardening Areas

| Area | Current State | Next Action |
| --- | --- | --- |
| Deployment | Runbook exists; hosted URL pending | Choose host and run P9A |
| Environment validation | `env:check` and `predeploy:check` exist | Run against pilot env |
| Rollback | Plan exists | Assign rollback owner |
| Observability | Health check plan exists | Verify on hosted URL |
| Admin operations | `/admin/pilot` exists | Assign admin emails |
| Data requests | Flow and runbook exist | Assign handler |
| Safety review | SOP exists | Assign reviewer |
| Mobile visual QA | Local records exist | Repeat against real URL |
| Feedback triage | Triage template exists | Fill with real feedback |

## Hardening Tasks Before Second Batch

1. Confirm first-batch P0/P1 items are closed.
2. Confirm no ChildNote, Evidence, RewardTicket, amount, or repair detail leakage.
3. Confirm health check and rollback are tested.
4. Confirm invite pause switch works in the pilot host.
5. Confirm data request handling creates audit or operational trace.
6. Confirm mobile smoke works on real URL.

## Non-Goals

- Do not open real AI/Kimi.
- Do not open real photo upload.
- Do not add payment or ranking.
- Do not expand to school/institution workflows.

## Exit Criteria

P11 is complete when:

- First-batch feedback is triaged.
- P0/P1 are closed or pilot remains paused.
- Hosted smoke passes again.
- Operators can handle feedback, data requests, safety review, and rollback.
