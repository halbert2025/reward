# Development Decisions Addendum

Date: 2026-05-24

The user has asked Codex to make proactive product and engineering decisions, with two priorities:

1. Build the most complete practical MVP possible.
2. Keep a computer-testable interface available throughout development.

Therefore the development baseline is:

## Blocking Decisions

| Question | Decision | Status |
| --- | --- | --- |
| MVP platform | Build Web/PWA first, optimized for desktop testing and responsive enough for mobile browser. Native app and mobile shell are later. | Closed |
| First demo auth | Use mock role switcher for parent, child, and witness. Real login is later. | Closed |
| Evidence photos | Use local/mock evidence metadata in MVP. Do not upload real family photos to object storage yet. | Closed |
| Notifications | Use in-app notifications and simulated reminders. No real push, SMS, or email in MVP. | Closed |
| AI | Use rule templates and mock AI by default. Kimi is designed as a bounded provider adapter, but not enabled as real business automation in MVP. | Closed |

## Before Coding Decisions

| Question | Decision | Status |
| --- | --- | --- |
| Database | Use SQLite for local development and desktop demo; keep Prisma schema portable for PostgreSQL later. | Closed |
| State machine truth | Domain layer state-machine functions are the only truth. UI/API cannot mutate business state directly. | Closed |
| AuditLog coverage | Cover family_created, principles_confirmed, reward_pool_initialized, contract_submitted, contract_version_created, contract_child_confirmed, task_started, task_exited, task_completed, completion_submitted, parent_response_requested, fulfillment_marked_fulfilled, fulfillment_marked_delayed, repair_requested, diary_generated, child_note_created, witness_invited, ai_suggestion_requested. | Closed |
| ChildNote | Include ChildNote in MVP as a minimal child-private entry and privacy boundary test. It is not merged into parent-visible diary by default. | Closed |
| Free witness | Include one free memorial witness placeholder in MVP with weak permissions and limited summary view. Full witness H5 can come later. | Closed |
| 24h/72h reminder simulation | Use `TIME_ACCELERATION_FACTOR` and test helpers so long waits can be simulated in development. | Closed |

## Before Pilot Decisions

These do not block local MVP development, but they block real family pilot:

- Prepare family notice and consent text.
- Prepare child data and privacy policy drafts.
- Define evidence-photo rules: avoid faces, address, school logos, unrelated child data.
- Define data export, archive, and deletion SOP.
- Define manual review SOP for abnormal emotion or clear safety risk.
- Define test-family exit data handling.

## Later Decisions

These stay out of MVP implementation unless explicitly reopened:

- Family membership/Pro commercial entry.
- Low-comparison inspiration library.
- Ability archive.
- Time post office.
- Voluntary focus shield V2.

## Engineering Interpretation

When a choice is needed, prefer the smallest complete desktop-testable loop that preserves future adapters and does not violate privacy, child safety, or product boundaries.
