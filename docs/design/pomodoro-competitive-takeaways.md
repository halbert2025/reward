# Pomodoro Competitive Takeaways

Source: `椅子上有猫竞品分析报告.html`

## Adopted In Current Build

- IP as state machine, not decoration: idle, focus, guest visit, completion.
- Primary action remains lightweight: start, pause, complete.
- Completion creates a collectible reward ticket instead of only a one-off success message.
- Child-facing stats stay gentle: completed count, ticket count, companionship minutes.
- PWA does not promise system-level app or website blocking.

## Implementation Mapping

| Takeaway | Product/page mapping | Code entry | E2E / QA coverage |
| --- | --- | --- | --- |
| IP as state machine | `/child/pomodoro/[taskId]` uses idle, focus, guest, look_up, complete, exit states. | `apps/web/lib/pomodoro-ip-states.ts`, `apps/web/components/wish-pomodoro.tsx` | `tests/e2e/contract-flow.spec.ts`, `docs/design/pomodoro-ip-state-table.md` |
| Low-stimulation white-noise screen | Cat teahouse image stack, static countdown, no ranking or hard-lock promise. | `apps/web/components/wish-pomodoro.tsx` | `docs/reviews/assets/2026-05-26-visual/pomodoro-running.png` |
| Collectible reward ticket | Reflection evidence appears in `/child/rewards` as a private ticket collection. | `apps/web/app/child/rewards/page.tsx`, `apps/web/lib/server/child-workflow.ts` | `tests/e2e/contract-flow.spec.ts`, `docs/reviews/assets/2026-05-26-visual/child-rewards.png` |
| Gentle stats | Child sees ticket count and companionship minutes only. | `apps/web/app/child/backyard/page.tsx`, `apps/web/app/child/rewards/page.tsx` | Visual acceptance screenshots |
| No system blocking promise | Product copy states no camera, lock, ranking, or real website blocking. | `apps/web/components/wish-pomodoro.tsx`, `docs/product/pilot-non-goals.md` | Manual copy review in P7 checklist |

## Deferred

- Exportable reward ticket images.
- Seasonal theme and asset release operations.
- Advanced statistics and family weekly reports.
- Native lock-screen, widget, watch, or system blocking integrations.

## Known Gaps For Later

- Mobile narrow-screen visual screenshots are still separate from the current desktop acceptance record.
- Real audio loops are not included in MVP; the current implementation is visual-only.
- Seasonal assets require an asset manifest and release checklist before pilot expansion.

## Product Boundary

Reward should translate the reference into a family promise and child trust context. It should not copy the chair-room structure, pressure mechanics, public rankings, or real-world item redemption.
