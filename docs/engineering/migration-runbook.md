# Reward Migration Runbook

Date: 2026-05-26  
Stage: P2 Production Data Layer

## Goals

This runbook keeps pilot/production data changes deliberate, reversible, and separate from local demo seed data.

## Local Development

Use SQLite locally:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run verify:seed
```

Local seed is allowed because it only creates demo rows such as `seed_family`, `seed_parent`, and `seed_child`.

## Pilot/Production Preflight

Before applying migrations to a hosted database:

```bash
npm run env:check
npm run predeploy:check
npm run typecheck
npm run test
npm run build
```

For a pilot incident, pause new child invites before applying risky changes:

```env
REWARD_INVITES_PAUSED=true
```

Required checks:

- `APP_ENV` is `pilot` or `production`.
- `DATABASE_URL` points to PostgreSQL.
- `AUTH_SECRET` is at least 32 characters.
- Mock role switcher is disabled.
- `ALLOW_DEMO_SEED` is not enabled.
- A database backup or provider snapshot exists.

## Applying Migrations

For local development:

```bash
npm run prisma:migrate
```

For hosted pilot/production, use Prisma deploy migrations after the PostgreSQL schema/provider switch is finalized:

```bash
npm run prisma:postgres-schema
npx prisma migrate deploy --schema prisma/schema.postgres.prisma
```

Do not run `npm run prisma:seed` against a real pilot/production database.

## Rollback

Prisma migrations are forward-first. For pilot rollback:

1. Pause new invites.
2. Export current database snapshot.
3. Restore the latest known-good provider snapshot if data corruption is severe.
4. Otherwise write a forward repair migration.
5. Record the incident in `AuditLog` or the pilot operations log.

## Data Separation Rules

- Demo rows with `seed_` IDs belong only to local/test.
- Real pilot users must enter through `/auth/login`, `/family/new`, and `/parent/invites`.
- Do not copy local SQLite data into a pilot database.
- Do not use production data to refresh local development.

## Manual Verification

After migration:

1. Create a test parent account.
2. Create one family.
3. Generate a child invite.
4. Join as child.
5. Create and complete one promise loop.
6. Confirm `AuditLog` rows exist for family, invite, contract, child completion, parent response, diary, and witness invite.
