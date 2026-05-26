# Reward MVP 页面规格

本文用途：把 HTML 原型转为研发可执行页面规格。前端实现应读取本文，而不是直接照搬原型 HTML。

## 通用页面规则

- 每页必须校验当前 actor role，不允许只靠隐藏按钮实现权限。
- 所有主要按钮必须有 loading/disabled 状态。
- 所有写操作失败必须保留用户已填内容。
- 所有涉及孩子隐私的页面必须默认最小展示。
- 文案不得使用审判、控制、羞辱、强迫语气。
- MVP 使用 mock auth/role switcher，但页面权限按真实角色设计。

## 通用状态文案

| 状态 | 推荐文案 |
|---|---|
| 加载 | 正在整理这个约定... |
| 网络错误 | 暂时没有连上，刚才填写的内容还在。请稍后再试。 |
| 权限不足 | 这部分内容只对对应成员可见。 |
| 状态冲突 | 这个约定刚刚有更新，请刷新后再继续。 |
| 保存失败 | 这次没有保存成功，请再试一次。 |

## P01 家长欢迎页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 parent 在 30 秒内理解 Reward 是家庭约定闭环，不是番茄钟、控制软件或奖励商城。 |
| 主要用户 | parent |
| 入口和出口 | 入口：根路径或 mock parent 登录后默认页。出口：P02 原则确认页。 |
| 默认状态 | 展示一句话定位、3 个价值点、MVP 小闭环示意、创建入口。 |
| 空状态 | 无家庭时展示创建入口；已有家庭时展示“继续当前家庭”。 |
| 加载状态 | 加载家庭状态和 mock actor。 |
| 错误状态 | 家庭状态加载失败时允许重试。 |
| 必填数据 | 无；若创建家庭，需要 parent 昵称、家庭显示名、child 昵称、child 年龄段。 |
| 操作按钮 | 主按钮：创建第一个家庭约定。次按钮：继续已有家庭、切换角色。 |
| 禁用文案 | 家庭名称缺失：先给这个家庭取个好记的名字。child 昵称缺失：先写一个孩子愿意看到的称呼。 |
| 验收标准 | 首屏出现“把随口承诺，变成孩子相信的家庭约定”；不得出现监督、锁定、惩罚、抽卡、商城导购表达；点击主按钮进入 P02。 |

## P02 原则确认页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 parent 明确 5 条家庭契约原则，确认产品边界后才能创建正式契约。 |
| 主要用户 | parent |
| 入口和出口 | 入口：P01 创建家庭后。出口：P03 奖池初始化页。 |
| 默认状态 | 展示 5 条原则，每条可勾选确认；底部显示继续按钮。 |
| 空状态 | 若家庭不存在，引导返回 P01 创建家庭。 |
| 加载状态 | 加载家庭和原则确认状态。 |
| 错误状态 | 保存失败时保留勾选状态。 |
| 必填数据 | familyId、parentId、5 条原则确认值。 |
| 操作按钮 | 勾选原则、全部确认并继续、返回。 |
| 禁用文案 | 未全部勾选：请先确认每条原则，再创建正式约定。 |
| 验收标准 | 未确认 5 条原则时不能继续；确认后写入 AuditLog；原则文案包含“不是控制孩子的工具”“孩子有权反馈”。 |

5 条原则：

- 签约后不能单方修改验收标准。
- 孩子完成约定后，应兑现或协商延期。
- 基础照顾、爱、陪伴和安全不能作为奖励或惩罚。
- 本 App 不是控制孩子的工具，而是帮助家庭建立清楚规则。
- 孩子有权对不公平的约定提出反馈。

## P03 奖池初始化页

| 项 | 规格 |
|---|---|
| 页面目标 | 通过 3-4 个情境问题生成简版小/中/大奖池，让 child 只能从家庭边界内选择首个小愿望。 |
| 主要用户 | parent |
| 入口和出口 | 入口：P02 完成原则确认。出口：P04 创建首个小约定页。 |
| 默认状态 | 展示小/中/大愿望边界、可选奖励偏好、禁用奖励类型。 |
| 空状态 | 无原则确认时提示先完成 P02。 |
| 加载状态 | 加载已有 RewardPool 草稿。 |
| 错误状态 | 保存失败时提示并保留已选项。 |
| 必填数据 | 小愿望边界、至少 1 个可用小愿望、禁用奖励类型。 |
| 操作按钮 | 添加小愿望、标记禁用奖励、生成奖池、继续创建首个小约定。 |
| 禁用文案 | 没有可用小愿望：先放入一个孩子能在近期实现的小愿望。奖励越界：这个奖励先不放进首个小约定。 |
| 验收标准 | 生成 RewardPool；现金、游戏充值、盲盒、高价电子产品、过长屏幕时间可被禁用；不得出现商城或商品导购入口。 |

## P04 创建首个小约定页

| 项 | 规格 |
|---|---|
| 页面目标 | parent 创建结构化首个小约定，默认推荐 25 分钟愿望番茄钟。 |
| 主要用户 | parent |
| 入口和出口 | 入口：P03 完成奖池。出口：P05 邀请孩子页。 |
| 默认状态 | 展示愿望、任务、证据、奖励、兑现时间、延期规则、契约预览。 |
| 空状态 | 奖池为空时返回 P03。 |
| 加载状态 | 加载 RewardPool 和 contract draft。 |
| 错误状态 | 不可建模内容被拦截时展示温和替代说明；保存失败保留草稿。 |
| 必填数据 | wishId、taskTitle、duration=25、evidenceType、rewardDescription、fulfillmentDueAt、delayRule。 |
| 操作按钮 | 选择愿望、编辑任务、选择证据、保存草稿、生成约定、邀请孩子确认。 |
| 禁用文案 | 缺少兑现时间：先写清楚完成后什么时候回应。不可建模：这个内容不适合做成家庭约定，我们可以换成更清楚、更安全的习惯目标。 |
| 验收标准 | 生成 Contract draft 和 ContractVersion；已确认版本不可覆盖；不可建模清单能拦截；不出现 AI 裁决和自动生成强制任务。 |

## P05 孩子邀请页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 parent 用邀请码/链接邀请 child 进入孩子端确认约定。 |
| 主要用户 | parent，次要用户 child |
| 入口和出口 | 入口：P04 创建约定后。出口：P06 孩子愿望后院首页。 |
| 默认状态 | 展示邀请链接、邀请码、孩子将看到的约定摘要、复制按钮。 |
| 空状态 | 没有待确认约定时提示返回 P04。 |
| 加载状态 | 生成邀请信息中。 |
| 错误状态 | 邀请码生成失败时可重试。 |
| 必填数据 | familyId、contractId、inviteCode、expiresAt。 |
| 操作按钮 | 复制邀请链接、刷新邀请码、切换到 child 预览、继续到孩子端。 |
| 禁用文案 | 邀请已过期：这个邀请已经过期，可以重新生成一个。 |
| 验收标准 | child 可通过链接进入待确认约定；邀请页不展示 ChildNote、证据照片、争议详情；witness 不在此页被强制邀请。 |

## P06 孩子愿望后院首页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 child 感觉自己不是在看任务表，而是在为愿望后院充能。 |
| 主要用户 | child |
| 入口和出口 | 入口：P05 邀请链接或 child mock 登录。出口：P07 愿望番茄钟页。 |
| 默认状态 | 展示当前愿望卡、小院状态、安静猫占位、任务摘要、开始守约按钮、私密小纸条入口。 |
| 空状态 | 没有待确认/进行中约定时展示“你的小院还在，等下一个愿望”。 |
| 加载状态 | 加载小院和当前约定。 |
| 错误状态 | 约定已变更时提示刷新。 |
| 必填数据 | childId、active/pending contract、wishTitle、taskTitle、duration、backyardState。 |
| 操作按钮 | 确认约定、开始守约、查看约定规则、写给自己的小纸条。 |
| 禁用文案 | 约定还没准备好：这个愿望还在等家长确认规则。 |
| 验收标准 | child 能知道自己为哪个愿望努力；ChildNote 入口默认只对 child 可见；页面不得像家长任务清单或监督面板。 |

## P07 愿望番茄钟页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 child 主动开始 25 分钟守约，并可体面退出或完成。 |
| 主要用户 | child |
| 入口和出口 | 入口：P06 点击开始守约。出口：P08 完成提交页，或返回 P06。 |
| 默认状态 | 显示倒计时、任务目标、愿望卡、暂停/继续、中途退出。 |
| 空状态 | 无 active contract 时返回 P06。 |
| 加载状态 | 创建 TaskSession 或恢复计时中。 |
| 错误状态 | 计时状态冲突时展示刷新；保存失败时允许重试。 |
| 必填数据 | taskSessionId、contractId、duration、startedAt。 |
| 操作按钮 | 开始、暂停、继续、我完成了、中途退出。 |
| 禁用文案 | 退出原因缺失：如果这次先停下，写一句原因就好。 |
| 验收标准 | child 主动开始；退出必须记录原因但不羞辱；不接视频、强锁、实时监控；完成后进入 P08。 |

## P08 完成提交页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 child 用一句复盘和可选照片提交完成记录，生成家长待回应通知。 |
| 主要用户 | child |
| 入口和出口 | 入口：P07 完成。出口：P09 家长兑现提醒页或 P06 完成状态。 |
| 默认状态 | 展示一句复盘输入、可选照片上传、隐私提示、提交按钮。 |
| 空状态 | 如果 TaskSession 未完成，提示返回番茄钟。 |
| 加载状态 | 提交复盘和 Evidence metadata 中。 |
| 错误状态 | 提交失败保留复盘；照片失败可跳过照片。 |
| 必填数据 | reflectionText；照片可选。 |
| 操作按钮 | 提交完成记录、添加照片、跳过照片、返回小院。 |
| 禁用文案 | 复盘为空：写一句你刚刚做了什么就可以。照片提示：只拍任务成果局部，避开人脸、学校和住址。 |
| 验收标准 | 写入 Task completion、reflection、可选 Evidence；通知 parent；照片非强制；不得要求人脸或视频证明。 |

## P09 家长兑现提醒页

| 项 | 规格 |
|---|---|
| 页面目标 | 让 parent 对 child 已完成的约定作出温和回应：已兑现、延期或待复盘。 |
| 主要用户 | parent |
| 入口和出口 | 入口：站内通知、parent 首页待办。出口：P10 亲子日记页或待复盘状态。 |
| 默认状态 | 展示孩子完成摘要、复盘、证据摘要、原始规则、回应选项、留言框。 |
| 空状态 | 没有待回应任务时展示“目前没有等待回应的约定”。 |
| 加载状态 | 加载完成记录和契约版本。 |
| 错误状态 | 状态已被其他操作更新时提示刷新。 |
| 必填数据 | responseType；延期时 delayReason 和 newFulfillmentDueAt 必填。 |
| 操作按钮 | 已兑现、需要延期、待复盘、保存回应、写一句留言。 |
| 禁用文案 | 延期原因缺失：如果今天不方便兑现，请写清原因和新的时间。无回应关闭：这个约定还需要一个回应。 |
| 验收标准 | parent 不能无回应关闭；延期必须有原因和新时间；待复盘不进入完整修复中心；已兑现生成 P10。 |

## P10 亲子日记页

| 项 | 规格 |
|---|---|
| 页面目标 | 生成亲子日记，把愿望、努力、回应和安静猫来访组成情感闭环。 |
| 主要用户 | parent、child |
| 入口和出口 | 入口：P09 已兑现，或历史日记。出口：回到 parent 首页/child 后院。 |
| 默认状态 | 展示愿望、任务、复盘、家长留言、完成时间、安静猫来访、保存纪念。 |
| 空状态 | 尚未生成日记时提示等待回应完成。 |
| 加载状态 | 生成 DiaryEntry 中。 |
| 错误状态 | 生成失败可重试，不丢失回应和复盘。 |
| 必填数据 | contractId、reflectionText、fulfillmentResponse、diaryEntryId、backyardEvent。 |
| 操作按钮 | 保存纪念、回到小院、创建下一个约定、返回家庭首页。 |
| 禁用文案 | 日记尚未准备好：这个纪念还在整理，请稍后再看。 |
| 验收标准 | 生成 DiaryEntry；parent/child 可见；不包含私密 ChildNote；出现安静猫来访；可引导创建第二个约定。 |
## P11 Child Reward Tickets

| Item | Spec |
|---|---|
| Page goal | Let the child review completed pomodoro reward tickets without rankings or public sharing. |
| Primary user | child |
| Entry and exit | Entry: P06 child backyard "View reward tickets". Exit: back to child backyard. |
| Default state | Show total ticket count, companionship minutes, and a newest-first list of reward tickets. |
| Empty state | Show "No tickets yet" and explain that a ticket appears after completing a pomodoro and submitting one reflection. |
| Loading state | Page may show standard route loading; no destructive action is available during loading. |
| Error state | If ticket data cannot load, show a retry/back-to-backyard path and do not expose partial private data. |
| No-permission state | Non-child or unauthenticated users are redirected by auth guard; witness access is not allowed. |
| Large-data state | List should be paginated or capped before broad pilot; current pilot may show latest collection only after seed reset is deterministic. |
| Required data | Evidence id, task title, wish title, reflection text, createdAt, optional mock photo label, diary status. |
| Actions | Back to backyard. Future: export ticket image after separate review. |
| Forbidden content | ChildNote, witness-only notes, repair details, real photo file, public ranking. |
| Acceptance | Child can open `/child/rewards` after completing a pomodoro; newest ticket is visible; witness E2E confirms reward ticket raw content is not exposed. |
