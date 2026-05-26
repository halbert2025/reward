# Reward Pilot Release Candidate Plan

Date: 2026-05-26  
Stage: P9A Pilot Release Candidate & Test Environment

## Current RC Decision

Status: `Internal RC rehearsal ready; external pilot No-Go until hosted URL exists`.

Reason: the codebase and pilot documentation are ready for a release-candidate rehearsal, but this workspace does not currently provide a real hosted HTTPS pilot URL or pilot PostgreSQL credentials. A version without those two inputs can be tested locally, but should not be sent to external families as the official pilot.

## Candidate Version

- Branch: `main`
- RC source: latest committed and pushed state after P9-P12 documentation completion.
- Delivery shape now: local/internal rehearsal.
- Required delivery shape before external families: hosted HTTPS URL.

## Environment Gate

| Item | Required For External Pilot | Current Decision |
| --- | --- | --- |
| `APP_ENV=pilot` | Yes | Pending hosted env |
| `APP_BASE_URL=https://...` | Yes | Pending real URL |
| `DATABASE_URL=postgresql://...` | Yes | Pending pilot database |
| `AUTH_SECRET` | Yes | Pending hosted env |
| `REWARD_ENABLE_MOCK_ROLE_SWITCHER=false` | Yes | Must verify on host |
| `REWARD_ADMIN_EMAILS` | Yes | Pending operator assignment |
| `STORAGE_PROVIDER=mock` | Yes | Keep mock for first pilot |
| `AI_PROVIDER_MODE=mock` or `template` | Yes | Keep mock/template |
| `ALLOW_DEMO_SEED=false` | Yes | Must verify on host |
| `REWARD_INVITES_PAUSED=false` | Yes | Start false, can pause incident response |

## Release Steps

1. Choose host and create pilot app.
2. Provision PostgreSQL.
3. Set env variables from `docs/engineering/env-vars.md`.
4. Run:

```bash
npm run env:check
npm run predeploy:check
npm run build
```

5. Deploy latest `main`.
6. Verify `/api/health`.
7. Execute P9B real URL smoke.
8. Execute P9D Go / No-Go gate.

## Safety Locks

The first external pilot must keep these disabled:

- Real photo upload.
- Real push notification.
- Real AI/Kimi.
- Payment.
- Ranking.
- Open child social.
- School or institution workflow.

## Exit Criteria

This RC becomes externally testable only when:

- Real hosted URL exists.
- Pilot PostgreSQL is configured.
- Admin allowlist is set.
- Real URL smoke passes on desktop and mobile.
- P9D returns `Go` or a strictly scoped `Conditional Go`.
