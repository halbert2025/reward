# Prompt 27 Small PR Breakdown

Task: Finish Reward MVP P21-P28 hardening.

## PR 1: Parent Response And Diary

- Goal: Parent handles fulfilled, delayed, and review-needed responses; system generates DiaryEntry.
- Files: `apps/web/lib/server/parent-response.ts`, `apps/web/app/parent/response/page.tsx`, `apps/web/app/family/diary/[diaryId]/page.tsx`.
- Not doing: Full repair center, real push notifications, AI summary.
- Acceptance: Fulfillment, optional RepairCase, DiaryEntry, and AuditLog are created.
- Tests: Add integration tests for three response paths.
- Risks: Contract.state may be `diary_generated`; reports must read Fulfillment for response type.

## PR 2: Child Private Note

- Goal: Child can create/read private ChildNote; parent/witness cannot read body.
- Files: `apps/web/lib/server/child-notes.ts`, `apps/web/app/child/notes/page.tsx`, `tests/unit/child-note-service.test.ts`.
- Not doing: AI risk detection, admin surface, parent visibility.
- Acceptance: Child sees own notes; permission tests deny parent/witness.
- Tests: Unit permission tests and future route-level denial tests.
- Risks: Future export/API work must exclude ChildNote by default.

## PR 3: Memorial Witness Placeholder

- Goal: Parent generates one memorial witness invite; witness sees safe summary and sends blessing.
- Files: `apps/web/lib/server/witness-flow.ts`, `apps/web/app/parent/witness/page.tsx`, `apps/web/app/witness/page.tsx`.
- Not doing: Reminder witness, dispute witness, arbitration, evidence access.
- Acceptance: Witness can send one blessing and cannot see Evidence/ChildNote/repair detail.
- Tests: Permission tests and future route DTO tests.
- Risks: Copy must keep witness as memorial only.

## PR 4: Acceptance And Safety Reports

- Goal: Produce privacy review, demo acceptance report, code review, and computer-readable acceptance file.
- Files: `docs/reviews/*`, `docs/acceptance/reward-mvp-computer-acceptance.html`.
- Not doing: Product scope expansion.
- Acceptance: User can open HTML file locally and follow routes/scripts.
- Tests: Build and test commands pass.
- Risks: Reports must distinguish implemented flows from future hardening.

## PR 5: E2E And Integration Hardening

- Goal: Convert acceptance scripts into executable Playwright and database integration tests.
- Files: `tests/e2e/*`, future `tests/integration/*`.
- Not doing: New product features.
- Acceptance: Five acceptance scripts can run in CI/local.
- Tests: Playwright normal/delay/repair/privacy flows.
- Risks: Local dev server startup on Windows needs robust process handling.
