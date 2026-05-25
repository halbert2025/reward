# Reward MVP Acceptance Criteria

> Source of truth for Prompt 10 acceptance and QA baseline.

## Global Acceptance Rules

MVP passes only when all global rules are true:

- The ten core pages P01-P10 exist in the product route map or implementation plan.
- Parent, child, witness, and system permissions are enforced.
- The first contract uses the 25-minute wish pomodoro template.
- Confirmed ContractVersion is immutable.
- Key actions write AuditLog.
- Parent cannot view ChildNote.
- Witness cannot view amount, evidence, ChildNote, or repair/dispute details.
- Unsafe reward or contract wording is blocked before save.
- No MVP UI or data model depends on school, teacher, institution, class, merchant, escrow, payment wallet, video monitoring, hard lock, open social ranking, gacha, or AI judge.

## Page Acceptance Criteria

| Page | Must Pass |
| --- | --- |
| P01 家长欢迎页 | Parent can start family setup; no marketing-only dead end. |
| P02 原则确认页 | Parent must confirm all five principles before continuing. |
| P03 奖池初始化页 | Parent can add safe small wishes; blocked categories cannot be saved. |
| P04 创建首个小约定页 | Parent can create the 25-minute contract; ContractVersion is created on confirmation. |
| P05 孩子邀请页 | Parent can generate a family-scoped child invite. |
| P06 孩子愿望后院首页 | Child can see family-scoped wish entry and cannot see parent controls. |
| P07 愿望番茄钟页 | Child can start, exit with reason, or complete without hard lock. |
| P08 完成提交页 | Child must submit reflection; evidence is optional; ChildNote remains private. |
| P09 家长兑现提醒页 | Parent can choose fulfilled, delayed, or pending repair; response writes AuditLog. |
| P10 亲子日记页 | Diary appears after parent response; quiet cat visit appears after first completed promise. |

## Data And Permission Acceptance Criteria

### Contract

- Contract status supports draft, pending_child_confirm, confirmed, running, exited, completed, parent_fulfilled, parent_delayed, pending_repair, and diary_generated.
- Confirmed content is stored as ContractVersion.
- Editing confirmed content creates a new version instead of overwriting the old one.

### Evidence

- Reflection is required for completion.
- Photo evidence is optional and light.
- MVP does not support video evidence or always-on monitoring.

### ChildNote

- Child can create one private note in MVP.
- Parent cannot fetch or view ChildNote.
- Witness cannot fetch or view ChildNote.
- System does not auto-alert from ChildNote.

### AuditLog

AuditLog must cover:

- family_created
- principles_confirmed
- reward_pool_initialized
- contract_created
- contract_confirmed
- pomodoro_started
- pomodoro_exited
- completion_submitted
- parent_response_submitted
- diary_generated

## Acceptance Scripts

### Script 1: Normal Fulfillment

Given:

- Parent has no existing family.

Steps:

1. Parent opens P01 and starts setup.
2. Parent confirms all five principles on P02.
3. Parent adds one safe small wish on P03.
4. Parent creates the 25-minute contract on P04.
5. Parent invites child on P05.
6. Child opens P06 and confirms the contract.
7. Child starts P07 pomodoro and completes it.
8. Child submits a reflection on P08.
9. Parent selects fulfilled on P09.
10. Product shows P10 diary and quiet cat visit.

Expected:

- Contract reaches diary_generated.
- AuditLog contains all key actions.
- Diary contains parent and child memory content.

### Script 2: Parent Delays

Given:

- Child has completed a contract and submitted reflection.

Steps:

1. Parent opens P09.
2. Parent selects delayed.
3. Parent enters a short delay note or expected time.
4. Product generates P10 diary.

Expected:

- Contract records parent_delayed before diary generation.
- Copy stays neutral and does not shame parent or child.
- Witness cannot see delay details.

### Script 3: Pending Repair

Given:

- Child has submitted completion.

Steps:

1. Parent opens P09.
2. Parent selects pending repair.
3. Parent saves a short neutral message.
4. Product generates P10 diary with repair-aware state.

Expected:

- Contract records pending_repair.
- No AI judge decides who is right.
- Witness cannot see repair details.

### Script 4: Unsafe Input Block

Given:

- Parent is creating reward or contract content.

Steps:

1. Parent enters a school/class/institution scenario.
2. Parent enters cash, merchant, shopping, or wallet-style reward.
3. Parent enters surveillance, video monitoring, location, hard lock, or open ranking language.

Expected:

- Product blocks save in each case.
- Product provides gentle rewrite copy.
- No ContractVersion is created from blocked content.

### Script 5: ChildNote Privacy

Given:

- Child has access to P08.

Steps:

1. Child writes a private ChildNote.
2. Parent opens all parent MVP pages.
3. Witness opens limited memory view.

Expected:

- Child can see own ChildNote.
- Parent cannot view or fetch ChildNote.
- Witness cannot view or fetch ChildNote.
- No AI auto-alert or parent push is triggered by ChildNote.

## Success Metrics Acceptance

The MVP analytics plan must support:

- 首次设置完成率
- 首个小约定创建率
- 孩子开始守约率
- 首个约定完成率
- 家长回应率
- 亲子日记生成率
- 第二个约定创建率
- 7 日家庭留存率

Metric events must not include raw ChildNote, exact location, school/class identifiers, child face data, or real child names.

## Done When

- QA can execute the five acceptance scripts without reading the original PRD.
- Every acceptance rule maps to the frozen MVP scope.
- Privacy and safety checks are included in normal acceptance, not left as later review.
- Product can be rejected if any no-go category appears in UI, data model, or flow.
