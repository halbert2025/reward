# Reward Deployment Runbook

Date: 2026-05-26  
Stage: P9A Pilot Release Candidate

## Purpose

This runbook defines the minimum deployment steps for a controlled Reward pilot. The first pilot must stay inside the MVP boundaries: no real photo upload, no real push, no real payment, no rankings, and no real AI/Kimi processing of child-private content.

## Release Candidate Inputs

- Git commit hash for the release candidate.
- Hosted HTTPS app URL, or an explicitly marked internal local test package.
- PostgreSQL `DATABASE_URL` for pilot.
- Admin allowlist for `/admin/pilot`.
- Rollback owner and support owner.

## Required Environment

```env
APP_ENV=pilot
APP_BASE_URL=https://<pilot-host>
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>
AUTH_SECRET=<32+ character secret>
REWARD_ENABLE_MOCK_ROLE_SWITCHER=false
REWARD_ADMIN_EMAILS=<admin emails>
REWARD_INVITES_PAUSED=false
STORAGE_PROVIDER=mock
AI_PROVIDER_MODE=mock
ALLOW_DEMO_SEED=false
NOTIFICATION_MODE=in_app
```

## Predeploy Steps

1. Confirm the release commit is pushed to `origin/main`.
2. Confirm no local uncommitted changes are part of the release.
3. Generate or verify the PostgreSQL Prisma schema if required:

```bash
npm run prisma:postgres-schema
```

4. Validate environment variables:

```bash
npm run env:check
```

5. Run the predeploy gate:

```bash
npm run predeploy:check
```

6. Build the app:

```bash
npm run build
```

## Deploy Steps

1. Deploy the selected commit to the pilot host.
2. Apply migrations against the pilot PostgreSQL database.
3. Do not run demo seed in pilot.
4. Verify `/api/health`.
5. Run the P9B real URL smoke path.

## Postdeploy Smoke

Minimum checks:

- `/api/health` returns `ok`.
- Parent can log in.
- Parent can confirm pilot consent.
- Parent can create a family and child invite.
- Child can join with invite code.
- Main contract loop can complete.
- Witness sees only safe summary.
- `/feedback` and `/privacy/requests` work.
- `/admin/pilot` blocks non-admin and allows allowlisted admin.

## Pause And Rollback

If the release behaves unsafely:

1. Set `REWARD_INVITES_PAUSED=true`.
2. Redeploy or restart.
3. Record the incident in the pilot operation notes.
4. Roll back to the previous known-good commit if needed.
5. Do not delete audit, operation, risk, feedback, or data request records as a quick fix.

## Current Status

As of 2026-05-26, the repository is ready for an internal release-candidate rehearsal, but external pilot launch still requires a real hosted URL, PostgreSQL environment values, admin allowlist, and assigned human operators.
