# Reward

Reward is a family wish-contract MVP. It helps a parent and child turn one small promise into a clear, reviewable, warm family loop.

## Current Stage

Prompt 15 initialized the technical project skeleton:

- `apps/web`: Next.js + TypeScript + Tailwind web/PWA app.
- `packages/shared`: shared state-machine, DTO, and API types.
- `prisma/schema.prisma`: local SQLite Prisma schema baseline.
- `tests/e2e`: Playwright acceptance skeletons.
- `docs`: product, engineering, safety, design, API, and testing source of truth.

## Setup

```bash
npm install
```

Create local env from the example:

```bash
copy .env.example .env
```

## Development

```bash
npm run dev
```

The web app runs at:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

## Scripts

```bash
npm run build
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run prisma:format
npm run prisma:generate
npm run env:check
npm run predeploy:check
```

`env:check` validates the local or deployment environment. `predeploy:check`
also verifies database connectivity and should run before a pilot/production
deploy.

## Product Boundaries

MVP must not implement school or institution workflows, payment escrow, merchant shopping, video supervision, hard lock, realtime location, open child social features, ranking, gacha, or AI judgment.

Kimi API is documented as a future bounded provider, but Prompt 15 keeps AI in mock mode. AI must not read ChildNote, judge completion, auto-send messages, or auto-alert parents.

## Read First

- `AGENTS.md`
- `docs/development-index.md`
- `docs/product/mvp-scope.md`
- `docs/engineering/api-contract.md`
- `docs/engineering/testing-plan.md`
