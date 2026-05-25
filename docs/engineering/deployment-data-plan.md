# Reward Deployment Data Plan

Date: 2026-05-26  
Stage: P2 Production Data Layer

## Decision

Reward keeps SQLite for local development and automated demo tests, and uses PostgreSQL for pilot/production environments.

This means:

- Local developers may continue to use `DATABASE_URL=file:./dev.db`.
- Playwright and seed-based MVP checks may continue to use local SQLite.
- Pilot and production must use `postgresql://` or `postgres://` `DATABASE_URL`.
- Demo seed data is not allowed to run automatically in pilot/production.

## Environment Strategy

| Environment | Database | Seed | Mock Role Switcher | Storage | AI |
| --- | --- | --- | --- | --- | --- |
| local | SQLite | allowed | allowed | mock | mock/template |
| test | SQLite | allowed | allowed | mock | mock/template |
| pilot | PostgreSQL | blocked by default | disabled | mock first | mock/template |
| production | PostgreSQL | blocked by default | disabled | reviewed provider only | mock/template until consent |

## Current Schema Readiness

The current Prisma schema already supports the P1/P2 pilot requirements:

- Multiple users per family through `FamilyMember`.
- Parent, child, co-signer, witness, system admin roles.
- Child invitation records through `FamilyInvite`.
- Login sessions through `AuthSession` and `LoginToken`.
- Witness weak-access token through `Witness.inviteTokenHash`.
- Audit logs linked to family, actor, entity, and event.

No data model migration is required for P2 beyond the existing migrations:

- `20260524151208_init`
- `20260525121611_add_auth_invites`

## Seed Isolation

`prisma/seed.mjs` is demo-only. It refuses to run when `APP_ENV=pilot` or `APP_ENV=production`, unless `ALLOW_DEMO_SEED=true` is explicitly set for a controlled recovery sandbox.

Required rule:

- Never set `ALLOW_DEMO_SEED=true` in a real pilot or production environment.
- Never use `seed_parent`, `seed_child`, or `seed_family` as real pilot data.
- Real pilot families must be created through the parent login and family invite flow.

## Predeploy Gate

Before deploying pilot/production:

```bash
npm run env:check
npm run predeploy:check
npm run typecheck
npm run test
npm run build
```

`predeploy:check` verifies:

- Required env vars exist.
- Pilot/production use PostgreSQL.
- Mock role switcher is disabled in remote environments.
- `AUTH_SECRET` is strong enough.
- The database accepts a basic query.

## PostgreSQL Schema Path

The repo keeps `prisma/schema.prisma` on SQLite for local development and generates a PostgreSQL deployment schema when needed:

```bash
npm run prisma:postgres-schema
```

This writes `prisma/schema.postgres.prisma` by switching the datasource provider to `postgresql`. Hosted pilot migration commands should use that generated schema:

```bash
npx prisma migrate deploy --schema prisma/schema.postgres.prisma
```

The generated PostgreSQL schema must be regenerated after every Prisma schema change and reviewed before the first hosted database migration.
