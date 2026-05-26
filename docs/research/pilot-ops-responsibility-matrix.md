# Reward Pilot Operations Responsibility Matrix

Date: 2026-05-26  
Stage: P9 Pilot Launch & Controlled Test Ops

## Assignment Status

Current status: roles are defined, named owners are still pending. External pilot invitations must not be sent until every required owner has a real name and contact path.

| Responsibility | Required Before External Pilot | Owner | Backup | Response Target |
| --- | --- | --- | --- | --- |
| Pilot launch decision | Yes | Pending | Pending | Before invite |
| Test family communication | Yes | Pending | Pending | Same day |
| Technical deployment and rollback | Yes | Pending | Pending | 2 hours for P0/P1 |
| Data request handling | Yes | Pending | Pending | 3 business days target |
| Privacy/legal review | Yes | Pending | Pending | Before invite |
| Safety/risk review | Yes | Pending | Pending | Same day for safety reports |
| Product feedback triage | Yes | Pending | Pending | Next daily review |
| Visual/UX acceptance | No, but recommended | Pending | Pending | Before second batch |

## Escalation Levels

| Level | Example | Action |
| --- | --- | --- |
| P0 | Child-private content exposed, unauthenticated family data access | Pause invites, start incident review, do not expand pilot |
| P1 | Login/invite broken, admin action not audited, data request lost | Fix before more invites |
| P2 | Main loop confusing but recoverable | Fix in current iteration or document workaround |
| P3 | Polish issue, copy issue, visual rough edge | Queue for hardening |
| P4 | Future feature request | Keep in V1 candidate review |

## Daily Pilot Rhythm

1. Check `/api/health`.
2. Check feedback inbox and risk queue.
3. Check data requests.
4. Check whether new invites should remain open.
5. Record observation in `pilot-daily-observation-template.md`.

## Stop Conditions

Pause new invites when:

- Any P0 appears.
- Two or more unrelated P1 issues appear in one day.
- A safety/risk report has no assigned reviewer.
- The app cannot pass health check.
- The pilot operator cannot respond for more than one business day.
