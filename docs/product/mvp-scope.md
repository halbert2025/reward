# Reward MVP Scope

> Source of truth for Prompt 10. This file freezes the first buildable MVP scope.

## MVP 唯一目标

Reward MVP only proves one thing:

> A parent and a child can complete one small wish contract together, and the product records the process as a warm family memory without turning it into school management, money escrow, surveillance, or open social competition.

The MVP is successful when one family can finish this loop:

1. Parent creates a family.
2. Parent confirms the five principles.
3. Parent initializes a simple reward pool.
4. System recommends the first small contract: a 25-minute wish pomodoro.
5. Parent invites the child.
6. Child chooses a small wish and confirms the contract.
7. Child actively clicks start.
8. Child completes the pomodoro and submits a one-sentence reflection, with optional light photo evidence.
9. Parent receives a response reminder.
10. Parent selects fulfilled, delayed, or pending repair.
11. System creates a parent-child diary.
12. Wish backyard shows a quiet cat visit.

## MVP 用户角色

### Parent

The parent is the family initiator, promise keeper, and responder.

Must be able to:

- Create a family space.
- Confirm the five principles.
- Initialize a simple reward pool.
- Create the first small wish contract from the 25-minute template.
- Invite a child.
- View contract execution state.
- Respond to completion with fulfilled, delayed, or pending repair.
- Write a short parent message for the diary.
- Invite one memorial witness placeholder.

Must not be able to:

- View the child's private ChildNote.
- Hard delete child effort history.
- Overwrite a confirmed contract version.
- Use the product for school, class, institution, or teacher management.

### Child

The child is the active promise participant, not a passive monitored object.

Must be able to:

- Enter the family through invitation.
- Choose a small wish from the reward pool.
- Confirm the contract.
- Start the pomodoro by self-action.
- Pause or exit with a reason.
- Complete the contract.
- Submit one-sentence reflection.
- Optionally attach one light photo.
- View own effort and diary.
- Write one private ChildNote.

Must not be able to:

- Set arbitrary monetary pricing.
- Modify a confirmed contract directly.
- Invite strangers.
- Publish progress to an open social space.

### Witness

The witness is a memorial witness only, not a judge.

Must be able to:

- View limited completion summary.
- Send one blessing-style message.

Must not be able to:

- View reward amount.
- View evidence photo.
- View ChildNote.
- View dispute or repair details.
- Vote, judge, rank, or compare.

### System

The system is historian, reminder, and state-machine assistant.

Must be able to:

- Recommend the first small contract.
- Enforce contract status transitions.
- Preserve ContractVersion.
- Write AuditLog for key actions.
- Generate the diary after parent response.
- Keep AI-like copy as rule-based or mock behavior in MVP.

Must not be able to:

- Judge whether the child is good or bad.
- Automatically send unsafe or sensitive messages.
- Automatically alert parents from private child text.
- Replace parent-child decision-making.

## MVP 必做功能

### Foundation

- Family creation.
- Five principles confirmation.
- Parent-child invitation.
- Local mock authentication.
- Role-based access control for parent, child, witness, and system behavior.

### Reward Pool

- Simple reward pool initialization.
- Small wish items only.
- No wallet, escrow, cash payment, shopping, merchant, sponsor, or commission behavior.

### First Contract

- 25-minute wish pomodoro template.
- Contract creation by parent.
- Child confirmation.
- Immutable confirmed ContractVersion.
- Contract status state machine.
- AuditLog for create, confirm, start, exit, complete, parent response, and diary generation.

### Execution

- Child active start.
- Pomodoro running state.
- Exit with reason.
- Completion submission with reflection.
- Optional light photo evidence placeholder.

### Parent Response

- Parent reminder after child completion.
- Parent response states:
  - fulfilled
  - delayed
  - pending_repair
- Parent message for diary.

### Memory

- Parent-child diary generation.
- Quiet cat backyard visit after completion.
- ChildNote minimal private entry.
- One free memorial witness placeholder.

## MVP 不做功能

The following are explicitly out of scope for MVP and should be blocked in product, design, data model, and copy:

- School, teacher, institution, class, community, interest class.
- Payment escrow, wallet, funds, gift card, cash red packet, platform purchase.
- Shopping, merchant, sponsor, commission, child commercial recommendation.
- Video supervision, always-on monitoring, default hard lock, realtime location.
- Open child social, comments, likes, ranking, stranger follow, school or class data pool.
- Gacha, SSR, rarity, ten-pull, pity, paid random reward.
- Full AI, AI judge, auto-send, auto-alert.
- Full repair center.
- Full witness tiers.
- Low-comparison inspiration.
- Ability archive.
- Time post office.
- Annual report.
- Backyard sharing.

## MVP 十个核心页面

| ID | Page | MVP Purpose |
| --- | --- | --- |
| P01 | 家长欢迎页 | Let parent start family setup. |
| P02 | 原则确认页 | Make the five principles explicit before any contract. |
| P03 | 奖池初始化页 | Create a small, non-commercial reward pool. |
| P04 | 创建首个小约定页 | Create the first 25-minute wish pomodoro contract. |
| P05 | 孩子邀请页 | Invite child into the family space. |
| P06 | 孩子愿望后院首页 | Let child see wishes and enter the first contract. |
| P07 | 愿望番茄钟页 | Let child actively start and complete the promise. |
| P08 | 完成提交页 | Let child submit reflection and optional light evidence. |
| P09 | 家长兑现提醒页 | Let parent respond fulfilled, delayed, or pending repair. |
| P10 | 亲子日记页 | Show the shared memory and quiet cat visit. |

## MVP 成功指标

The first release should instrument these metrics without collecting sensitive child data:

- 首次设置完成率
- 首个小约定创建率
- 孩子开始守约率
- 首个约定完成率
- 家长回应率
- 亲子日记生成率
- 第二个约定创建率
- 7 日家庭留存率

## MVP 验收标准

MVP is acceptable only when all of the following are true:

- Parent can complete setup and create the first contract.
- Child can confirm, start pomodoro, and submit reflection.
- Parent can respond with fulfilled, delayed, or pending repair.
- Diary is generated after parent response.
- Quiet cat appears after the first completed promise.
- Parent cannot view ChildNote.
- Witness cannot view evidence, ChildNote, amount, or dispute details.
- Confirmed contract cannot be overwritten; any change creates a new version.
- Key operations write AuditLog.
- Unsafe or unmodelable contracts are blocked.
- No school, institution, merchant, escrow, video monitoring, hard lock, or open social behavior exists in the MVP surface.

## Done When

- Product, design, engineering, and testing can all point to this file as the MVP scope baseline.
- The ten MVP pages are listed with one clear purpose each.
- Must-do and no-go functionality are explicit enough to block scope drift.
- Success metrics avoid sensitive child content and school/institution fields.
- Acceptance criteria can be converted directly into QA scripts.
