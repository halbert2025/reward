# Reward 有条件通过补齐项关闭说明

> 日期：2026-05-25  
> 来源：`docs/reviews/2026.05.25 Reward需求与原型评审报告.md`  
> 目的：关闭“有条件通过”前必须补齐的 7 项，形成开发、设计、测试共同口径。

## 0. 总结结论

本文件将评审报告中的 7 个关闭条件正式固化为 MVP 开发口径。

关闭状态：

| 编号 | 补齐项 | 状态 | 主文档位置 |
| --- | --- | --- | --- |
| C-01 | P01-P10 页面状态表 | 已关闭 | 本文第 1 节；`docs/design/screen-spec.md` |
| C-02 | 唯一状态机映射表 | 已关闭 | 本文第 2 节；`docs/engineering/state-transition-table.md` |
| C-03 | MVP 身份方案 | 已关闭 | 本文第 3 节；`docs/decisions/development-decisions-addendum.md` |
| C-04 | 证据照片 MVP 规则 | 已关闭 | 本文第 4 节；`docs/safety/privacy-and-retention.md` |
| C-05 | AI/Kimi MVP 策略 | 已关闭 | 本文第 5 节；`docs/decisions/development-decisions-addendum.md` |
| C-06 | P09/P10 延期、修复、见证提醒分支 | 已关闭 | 本文第 6 节；`docs/design/screen-spec.md` |
| C-07 | 奖励池字段级校验与禁用文案 | 已关闭 | 本文第 7 节；`docs/design/copywriting.md` |

## 1. C-01：P01-P10 页面状态表

所有 MVP 页面必须实现以下通用状态。页面规格已有基础描述，开发实现以本表作为统一验收口径。

| 页面 | 默认态 | 空态 | 加载态 | 错误态 | 提交中 | 禁用态 | 无权限态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P01 家长欢迎 | 展示定位、价值点、创建入口 | 无家庭时展示创建入口；已有家庭时展示继续入口 | 加载家庭与 mock actor | 家庭状态加载失败，可重试 | 创建家庭按钮显示处理中 | 必填家庭信息缺失时禁用 | 非 parent 只允许进入预览或切换角色 |
| P02 原则确认 | 展示 5 条原则与勾选项 | 无家庭时返回 P01 | 加载原则确认状态 | 保存失败保留勾选 | 继续按钮显示保存中 | 未全选 5 条原则时禁用 | 非 parent 不允许确认原则 |
| P03 奖励池初始化 | 展示小/中/大奖励边界与禁用类型 | 无原则确认时返回 P02 | 加载已有 RewardPool 草稿 | 保存失败保留选择 | 生成奖励池显示处理中 | 无可用小愿望时禁用继续 | 非 parent 不允许编辑奖励池 |
| P04 创建小契约 | 展示愿望、任务、证据、奖励、兑现时间 | 奖励池为空时返回 P03 | 加载 RewardPool 与草稿 | 保存失败保留草稿；不安全内容提示替代表达 | 生成契约显示处理中 | 缺少任务、证据规则、奖励或兑现时间时禁用 | child/witness 不允许编辑契约 |
| P05 邀请孩子 | 展示邀请链接、邀请码、孩子可见摘要 | 无待确认契约时返回 P04 | 生成邀请信息中 | 邀请码生成失败可重试 | 刷新邀请码显示处理中 | 邀请过期或契约状态不匹配时禁用复制 | witness 不可访问；child 只可使用邀请入口 |
| P06 孩子后院 | 展示愿望卡、小院、猫咪占位、任务摘要 | 无待确认/进行中契约时展示等待下个愿望 | 加载小院和当前契约 | 契约已变更提示刷新 | 确认契约显示处理中 | 契约未准备好时禁用开始 | parent/witness 不可查看 ChildNote 入口内容 |
| P07 猫咪番茄钟 | 展示倒计时、任务目标、暂停/完成/退出 | 无 active contract 时返回 P06 | 创建或恢复 TaskSession | 计时状态冲突提示刷新 | 完成/退出显示保存中 | 退出原因缺失时禁用退出提交 | 非 child 不允许操作计时 |
| P08 完成提交 | 展示复盘输入、可选照片、隐私提示 | 未完成 TaskSession 时返回 P07 | 提交复盘和 Evidence metadata | 提交失败保留复盘；照片失败可跳过 | 提交按钮显示处理中 | 复盘为空时禁用提交 | 非 child 不允许提交完成记录 |
| P09 家长回应 | 展示完成摘要、证据摘要、原规则、回应选项 | 无待回应契约时展示无待办 | 加载完成记录和契约版本 | 状态被更新时提示刷新 | 保存回应显示处理中 | 延期缺少原因/新时间时禁用 | child/witness 不允许写回应 |
| P10 亲子日记 | 展示愿望、努力、回应、猫咪来访、纪念 | 未生成日记时展示等待回应完成 | 生成或加载 DiaryEntry | 生成失败可重试且不丢复盘 | 保存纪念显示处理中 | 缺少 diaryEntryId 时禁用保存纪念 | witness 只能看被授权摘要，不能看 ChildNote/证据/争议 |

通用规则：

- 所有写操作失败必须保留用户已输入内容。
- 所有主按钮必须有 loading 和 disabled 状态。
- 无权限不能只靠隐藏按钮处理，API 和 domain 层也必须拒绝。
- 所有无权限文案必须中性，不使用羞辱、控制、惩罚、裁判语气。

## 2. C-02：唯一状态机映射表

状态机唯一真相：domain 层状态机函数。UI 和 API 不允许直接拼接或跳转业务状态。

### 2.1 Contract 状态映射

| 业务中文状态 | 代码枚举 | 触发事件 | 允许角色 | 主要审计事件 |
| --- | --- | --- | --- | --- |
| 草稿 | `draft` | `family.create` 后创建草稿或 parent 保存契约草稿 | parent | `contract_version_created` |
| 待孩子确认 | `pending_child_confirm` | `contract.submit_for_child` | parent | `contract_submitted` |
| 已确认 | `confirmed` | `contract.child_confirm` | child | `contract_child_confirmed` |
| 进行中 | `active` | `contract.activate` | system | `contract_activated` |
| 已完成待整理 | `completed` | `contract.mark_completed` | system | `contract_completed` |
| 待家长回应 | `fulfillment_pending` | `contract.request_parent_response` | system | `parent_response_requested` |
| 已兑现 | `fulfilled` | `fulfillment.mark_fulfilled` | parent | `fulfillment_marked_fulfilled` |
| 已延期 | `delayed` | `fulfillment.mark_delayed` | parent | `fulfillment_marked_delayed` |
| 待复盘 | `pending_repair` | `fulfillment.request_repair` | parent | `repair_requested` |
| 日记已生成 | `diary_generated` | `diary.generate` 或 `diary.generate_repair_memory` | system | `diary_generated` |
| 已封存 | `archived` | `contract.archive` | parent/system | `contract_archived` |

### 2.2 Task 状态映射

| 业务中文状态 | 代码枚举 | 触发事件 | 允许角色 | 主要审计事件 |
| --- | --- | --- | --- | --- |
| 未开始 | `not_started` | active contract ready | system | 无 |
| 进行中 | `running` | `task.start` / `task.resume` | child | `task_started` / `task_resumed` |
| 暂停 | `paused` | `task.pause` | child | `task_paused` |
| 中途退出 | `exited` | `task.exit` | child | `task_exited` |
| 已提交完成 | `submitted` | `task.complete` | child/system | `task_completed` |
| 已进入家长查看 | `accepted_for_review` | `task.accept_for_parent_review` | system | `task_submitted_for_review` |

### 2.3 Fulfillment 状态映射

| 业务中文状态 | 代码枚举 | 触发事件 | 允许角色 | 主要审计事件 |
| --- | --- | --- | --- | --- |
| 未请求 | `none` | 尚无完成记录 | system | 无 |
| 待回应 | `pending` | `fulfillment.request` | system | `fulfillment_requested` |
| 已兑现 | `fulfilled` | `fulfillment.fulfill` | parent | `fulfillment_fulfilled` |
| 已延期 | `delayed` | `fulfillment.delay` | parent | `fulfillment_delayed` |
| 待复盘 | `pending_repair` | `fulfillment.repair` | parent | `fulfillment_repair_requested` |
| 已关闭 | `closed` | `fulfillment.close` | system | `fulfillment_closed` |

## 3. C-03：MVP 身份方案

MVP 第一版采用 mock role switcher，不接真实登录。

### 3.1 角色

- `parent`：创建家庭、确认原则、配置奖励池、创建契约、发起邀请、回应兑现。
- `child`：通过邀请或 mock 切换进入孩子端，确认契约、使用猫咪番茄钟、提交复盘与可选证据。
- `witness`：只能查看被授权的契约摘要和纪念摘要，不能访问金额、证据、ChildNote、争议详情和修复过程。
- `system`：执行状态推进、模拟通知、日记生成、提醒模拟。

### 3.2 邀请码规则

| 项 | MVP 决策 |
| --- | --- |
| 生成时机 | P04 契约提交给孩子后，由 P05 生成 |
| 绑定对象 | `familyId + contractId + child mock actor` |
| 有效期 | 默认 24 小时；本地开发可通过测试 helper 重置 |
| 使用次数 | 同一孩子可重复打开；不同 mock child 使用时提示已绑定 |
| 过期处理 | P05 可刷新邀请码；旧码立即失效 |
| 防误入 | 邀请页只展示孩子可见摘要，不展示证据、奖励敏感信息、ChildNote、争议内容 |
| 真实登录迁移 | 后续以同一 InviteToken 模型接入真实账号，不改变契约状态机 |

### 3.3 Mock role switcher 限制

- 仅用于本地开发、电脑端验收和内部 Demo。
- UI 可以切换角色，但每个 API 仍必须按当前 actor role 校验权限。
- 不允许通过前端隐藏字段绕过权限。
- 测试必须覆盖 parent/child/witness 的拒绝路径。

## 4. C-04：证据照片 MVP 规则

MVP 不上传真实家庭照片到对象存储；只保存本地/mock evidence metadata。照片能力可以展示 UI 和本地预览，但不得作为正式云端持久化能力宣传。

### 4.1 允许内容

- 任务成果局部，例如整理好的书桌一角、完成的手工作品、阅读页局部。
- 不包含人脸、学校、住址、证件、聊天记录、医疗信息和其他儿童隐私。
- 照片是可选项，孩子可以只提交一句复盘。

### 4.2 禁止或提醒内容

| 类型 | MVP 行为 | 推荐文案 |
| --- | --- | --- |
| 人脸 | 上传前提示避免；真实上传阶段必须拦截或人工复核 | 只拍任务成果局部，尽量避开人脸。 |
| 住址/门牌 | 提示并禁止正式保存 | 这张照片可能包含住址信息，先换一张更安全的照片。 |
| 学校标识 | 提示并禁止正式保存 | 这张照片可能包含学校信息，先换一张更安全的照片。 |
| 其他孩子 | 禁止正式保存 | 这张照片里可能有其他小朋友，先不要放进契约记录。 |
| 证件/票据/聊天 | 禁止正式保存 | 这类信息不适合放进家庭契约记录。 |

### 4.3 删除、封存与保留

- MVP mock 证据可以由 parent 在本地 Demo 数据重置中清空。
- 真实上传前必须补齐删除、封存、导出和保留策略。
- DiaryEntry 默认不展示原图，只展示“已提交可选证据”或安全缩略摘要。
- witness 永远不能查看 Evidence 原图或详细 metadata。

## 5. C-05：AI/Kimi MVP 策略

MVP 默认使用规则模板和 mock AI，不默认调用 Kimi 真实 API。

### 5.1 默认策略

| 能力 | MVP 默认 | 真实 Kimi 接入前条件 |
| --- | --- | --- |
| 契约文案建议 | 规则模板 | API Key 走环境变量；用户输入脱敏 |
| 不可建模内容改写 | 本地规则和禁用词 | 模型只给建议，不自动决策 |
| 日记生成 | 模板生成 | 失败可降级模板；不得包含 ChildNote 私密内容 |
| 风险提醒 | 本地规则 | AI 不触发自动报警，不替代人工判断 |

### 5.2 Kimi 接入边界

- 必须通过 provider adapter 接入，不能在页面组件中直接调用。
- 必须支持 `AI_PROVIDER=mock` 和 `AI_PROVIDER=kimi` 切换。
- API Key 只能放在 `.env`，不得提交仓库。
- 发送给 Kimi 的内容必须最小化，不包含孩子真实姓名、住址、学校、照片、ChildNote。
- 调用失败必须降级到本地模板，不阻断主流程。
- 日志不得记录 prompt 全文、API Key 或未脱敏儿童数据。

## 6. C-06：P09/P10 分支交互

### 6.1 P09 家长回应分支

| 分支 | 家长操作 | 必填 | 状态结果 | 孩子可见反馈 | witness 可见 |
| --- | --- | --- | --- | --- | --- |
| 已兑现 | 选择“已兑现”并写一句回应 | 可选留言 | `fulfilled` -> `diary_generated` | 看到回应和小院更新 | 只可见纪念摘要 |
| 延期 | 选择“需要延期” | 延期原因、新兑现时间 | `delayed` -> `diary_generated` | 看到中性延期说明和新时间 | 默认不可见；若被授权仅见“已更新回应时间” |
| 待复盘 | 选择“这个愿望需要商量一下” | 中性说明 | `pending_repair` -> repair snapshot/diary | 看到“需要一起商量”，不显示裁判语气 | 不可见修复细节 |
| 无回应关闭 | 不允许 | 不适用 | 拒绝 | 不适用 | 不适用 |

P09 禁用规则：

- 延期缺少原因或新时间时，保存按钮禁用。
- 待复盘说明包含羞辱、威胁、惩罚、裁判类表达时，提示替代表达。
- 已兑现后不能改写原契约版本，只能生成回应和日记。

### 6.2 P10 亲子日记分支

| 来源状态 | P10 展示 | 可操作 | 不展示 |
| --- | --- | --- | --- |
| `fulfilled` | 愿望、任务、孩子复盘、家长回应、猫咪来访 | 保存纪念、返回小院、创建下一个契约 | ChildNote 私密内容、原始敏感照片 |
| `delayed` | 愿望、孩子努力记录、家长延期说明、新时间 | 保存“这次努力被记录”纪念 | 责备、失信、惩罚标签 |
| `pending_repair` | 努力记录和“稍后一起商量”摘要 | 返回小院、稍后复盘 | 争议细节、裁判结果、见证人评价 |

### 6.3 见证提醒

- MVP 见证人是轻量纪念见证，不是裁判。
- 见证人可以看到：契约摘要、完成纪念、家庭授权的一句祝福入口。
- 见证人不能看到：奖励金额/敏感奖励、证据照片、ChildNote、延期原因全文、修复对话、AuditLog。
- 见证提醒只允许中性表达：`这个小约定有了新的纪念。`

## 7. C-07：奖励池字段级校验与禁用文案

### 7.1 字段级规则

| 字段 | 规则 | 拦截条件 | 推荐提示 |
| --- | --- | --- | --- |
| rewardTitle | 1-40 字，具体、可兑现 | 空值或过长 | 先写一个孩子能看懂的小愿望。 |
| rewardLevel | `small` / `medium` / `large` | MVP 首个契约选择 `large` | 第一个约定先从小愿望开始。 |
| rewardType | 陪伴、活动、物品、选择权、体验 | 现金、充值、盲盒、抽卡、赌博、成人内容 | 这个奖励先不放进家庭愿望池，可以换成一次陪伴或体验。 |
| estimatedValue | MVP 建议低价值 | 明显高价电子产品或高消费 | 这个愿望对第一份小约定有点大，先换成更轻的版本。 |
| screenTimeMinutes | 小愿望建议 0-30 分钟 | 过长屏幕时间 | 屏幕时间先放轻一点，让愿望更容易兑现。 |
| fulfillmentDueAt | 必须明确 | 空值或早于当前时间 | 先写清楚完成后什么时候回应。 |
| delayRule | 必须存在 | 空值 | 先约好如果当天不方便，怎么温和延期。 |
| evidenceType | 文本必选，照片可选 | 强制人脸/视频/实时定位 | 证据只需要记录努力，不需要人脸、视频或定位。 |

### 7.2 禁用奖励类型

MVP 必须拦截：

- 现金、转账、红包、充值、游戏点券、虚拟币。
- 盲盒、抽卡、概率奖励、稀有度奖励。
- 高价电子产品、明显超出家庭边界的大额消费。
- 过长屏幕时间或以沉迷性应用为核心的奖励。
- 基础照顾、爱、陪伴、安全、吃饭、睡觉等不能作为奖励或惩罚筹码。
- 学校排名、成绩攀比、公开比较、朋友圈施压。

### 7.3 推荐替代表达

| 被拦截表达 | 替代表达 |
| --- | --- |
| 充 100 元游戏 | 周末一起玩 20 分钟已约好的游戏 |
| 买最新平板 | 一起挑一个小文具或一次小体验 |
| 考第一就奖励 | 完成今天约好的练习后，一起做一件喜欢的小事 |
| 不完成就取消陪伴 | 陪伴不是奖励或惩罚，我们把任务换小一点 |
| 拍视频证明 | 写一句刚才做了什么，照片也可以跳过 |

## 8. 后续执行要求

- 开发新页面时，必须回查本文第 1 节页面状态表。
- 涉及状态变更时，必须回查本文第 2 节状态映射和 `docs/engineering/state-transition-table.md`。
- 涉及角色、邀请、证据、AI、奖励校验时，必须引用本文对应规则。
- 测试计划需要覆盖每个 C 项至少一个正向用例和一个拒绝用例。
