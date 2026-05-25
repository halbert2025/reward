# AGENTS.md

## Project

Reward is a family wish-contract system. It helps families turn casual promises into clear, recorded, reviewable agreements that children can trust.

MVP scope: family-side first small-contract loop only:

parent creates family -> confirms principles -> initializes reward pool -> creates first 25-minute wish pomodoro contract -> invites child -> child confirms and starts -> child submits reflection -> parent responds -> system creates diary and backyard feedback.

## Read First

Before any task, read:

- `docs/development-index.md`
- `docs/product/product-freeze.md`
- `docs/product/product-boundaries.md`
- `docs/decisions/development-decisions-addendum.md`
- `docs/decisions/open-questions.md`

Read extra docs by task:

- Technical setup: `docs/decisions/technical-decisions.md`, `docs/engineering/architecture.md`
- State changes: `docs/engineering/state-machines.md`
- Data/permissions: `docs/engineering/data-model.md`, `docs/engineering/permissions-matrix.md`, `docs/safety/data-classification.md`
- UI/copy: `docs/design/screen-spec.md`, `docs/design/copywriting.md`, `docs/design/design-system.md`
- Child safety/privacy: `docs/safety/child-safety-sop.md`, `docs/safety/threat-model.md`
- Analytics: `docs/analytics/event-taxonomy.md`, `docs/analytics/mvp-metrics.md`
- Tests: `docs/engineering/testing-plan.md`

## Hard Product Boundaries

- Reward is not a parental-control app, school management system, institution tool, reward mall, payment escrow platform, or child social network.
- Do not implement school/institution paths, teacher roles, class data pools, payment escrow, reward wallets, merchant shopping, product ads, video supervision, default hard locks, realtime location, open child social features, rankings, or gacha/random paid rewards.
- AI may suggest, decompose, translate tone, and remind. AI must not judge, decide, auto-send, auto-alert, rewrite facts, or expose ChildNote content.
- ChildNote/tree-hole content is private to the child by default. Parent and witness must not read it by default.
- Witness is weak-permission by default: summary and completion memory only; no amount, evidence, ChildNote, or dispute detail.
- Parent cannot unilaterally erase child effort records.
- Confirmed contracts cannot be overwritten; changes require a new ContractVersion.
- Key state changes must produce AuditLog.

## Before Coding Checklist

- Read the required docs for the task type.
- Confirm the requested feature is MVP, not V1/V2/Later.
- Check `docs/product/product-boundaries.md` for hard no-go items.
- If touching roles/privacy, check permissions matrix and data classification.
- If touching state, check state machine rules and audit events.
- If touching copy, check forbidden wording in `docs/design/copywriting.md`.
- If touching child data, check child safety SOP.
- If adding analytics, check forbidden event attributes.
- If a required decision is still open, update `docs/decisions/open-questions.md` or ask before coding.

## Engineering Rules

- Keep changes scoped to the current prompt.
- Prefer domain functions for business rules; UI and API must not directly mutate contract state.
- Permission checks must happen server-side, not only in the UI.
- Separate `ChildNote`, `Evidence`, `DiaryEntry`, and `AuditLog`.
- Mock auth, AI, storage, and notifications must preserve real permission boundaries.
- Do not introduce real payment, real AI provider, real push, or real object storage unless a prompt explicitly asks and required safety docs are updated.
- Do not add unrelated refactors while implementing product work.

## Commands

No technical project has been initialized yet.

- Install: TODO after Prompt 15 initializes the stack.
- Dev server: TODO after Prompt 15.
- Build: TODO after Prompt 15.
- Test: TODO after Prompt 15.
- Lint/typecheck: TODO after Prompt 15.

## Code Style

- TypeScript-first after the web project is initialized.
- Keep domain logic framework-independent where practical.
- Use explicit role, state, and event names.
- Prefer readable DTOs over leaking database internals to UI.
- Keep user-facing Chinese copy aligned with `docs/design/copywriting.md`.
- Avoid collecting or logging raw sensitive child content.

## Tests

Every code change must add or explain tests.

Required when relevant:

- Permission tests for parent/witness access denial.
- State-machine tests for Contract/Task/Fulfillment transitions.
- Version tests for confirmed Contract updates.
- AuditLog tests for key writes.
- Safety tests for forbidden contract content.
- E2E tests for P01-P10 flow when UI is affected.

## PR / Commit Checklist

- MVP scope confirmed.
- Hard boundaries not violated.
- ChildNote remains private by default.
- Witness remains weak-permission.
- ContractVersion and AuditLog rules preserved.
- Analytics avoid school, exact location, real names, faces, raw notes, and risk text.
- Tests run or documented as not available yet.
- New open questions are recorded in `docs/decisions/open-questions.md`.
