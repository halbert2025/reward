# Prompt 28 Code Review

Date: 2026-05-25

## Summary

The current Reward MVP implementation fits the frozen Web/PWA desktop-testable scope. It now covers parent onboarding, first contract creation, child confirmation, cat-themed wish pomodoro, reflection Evidence, parent response, diary generation, ChildNote privacy, and a memorial witness placeholder.

## Blocking Issues

None found.

## Major Issues

- Route-level authorization is still mock-session based. This is acceptable for MVP demo but must be replaced before pilot.
- E2E tests remain skeleton-level. The core flows have unit/build verification, but browser automation needs stabilization.

## Minor Issues

- The parent response form exposes delay fields regardless of selected radio option. It validates server-side, but future UI can reveal fields conditionally.
- `Contract.state` reaches `diary_generated` after all parent response types. Fulfillment/RepairCase rows preserve response detail, but dashboard labels should read those rows when richer reporting is needed.
- Some validation is keyword-based and English-oriented; future Chinese copy validation should use a structured forbidden-category classifier or curated phrase list.

## Suggested Tests

- Integration: fulfilled response creates Fulfillment + DiaryEntry + `diary_generated` audit log.
- Integration: delayed response requires reason and new time.
- Integration: pending repair creates RepairCase and excludes repair detail from witness DTO.
- E2E: P01-P10 normal family in under five minutes.
- E2E: ChildNote created by child never appears on parent or witness pages.

## Merge Verdict

Safe for local MVP demo and continued feature hardening. Not yet pilot-ready until real auth, policy text, and executable E2E/integration coverage are added.
