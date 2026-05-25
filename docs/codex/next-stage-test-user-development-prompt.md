# Reward 下一阶段开发提示词：从 MVP Demo 到测试用户可用版本

日期：2026-05-25  
适用阶段：MVP 逻辑已通过，准备做给测试用户可实际使用的 Alpha / Pilot 版本。  
目标：把当前内部 demo 版本改造成“可部署、可登录、可邀请、可回收反馈、可保护未成年人数据”的测试用户版本。

## 0. 阶段判断

当前 Reward MVP 的核心业务逻辑已经基本成立：

- 家长创建小约定。
- 孩子确认约定。
- 孩子完成猫猫番茄钟并提交复盘。
- 家长选择兑现、延期或待复盘。
- 系统生成家庭日记。
- ChildNote、witness、Kimi/AI 边界已有 MVP 级保护。

下一阶段不应优先扩新功能，而应优先完成“测试用户可用版本”的基础能力：

- 真实账号体系。
- 家庭邀请和角色绑定。
- 线上数据库与部署。
- 真实文件/证据处理策略。
- 数据删除、退出、导出与封存。
- 试点告知与同意。
- 运营后台或最小人工处理台。
- 错误监控、日志、反馈收集。
- 可重复发布和回滚。

## 1. 总目标 Prompt

```text
你是 Reward 项目的下一阶段研发负责人。当前 MVP demo 已通过内部验收，但仍不能直接给测试家庭使用。

请基于现有仓库和文档，把 Reward 从“内部 demo”推进到“可邀请少量测试用户使用的 Alpha/Pilot 版本”。

工作重点不是扩展玩法，而是补齐真实测试用户使用所需的工程、账号、部署、安全、数据、隐私、运营和验收能力。

所有开发必须遵守：
1. Reward 是家庭愿望契约系统，不是家长控制软件。
2. 不做学校/机构、支付托管、商家导购、视频监控、默认强锁、儿童开放社交、抽卡式惊喜。
3. 未成年人数据默认最小化采集。
4. ChildNote 默认孩子私密。
5. witness 默认弱权限。
6. AI/Kimi 默认 mock/template，真实接入前必须脱敏、可关闭、失败降级。
7. Contract 状态机、权限矩阵、审计日志继续作为业务安全底线。

请按阶段推进，每个阶段完成后必须：
- 更新对应文档。
- 写入验收标准。
- 补充必要测试。
- 运行 typecheck、unit test、build、必要 E2E。
- 给出风险和未完成项。
```

## 2. 必读上下文

每次执行下一阶段开发任务前，先读取：

```text
docs/development-index.md
docs/product/product-freeze.md
docs/product/product-boundaries.md
docs/decisions/open-questions.md
docs/engineering/architecture.md
docs/engineering/data-model.md
docs/engineering/permissions-matrix.md
docs/engineering/state-machines.md
docs/safety/data-classification.md
docs/safety/privacy-and-retention.md
docs/safety/child-safety-sop.md
docs/safety/threat-model.md
docs/research/before-pilot-gate.md
docs/reviews/2026.05.25 Reward最终验收报告.md
```

如果任务涉及猫猫番茄钟视觉，再读取：

```text
docs/design/cat-teahouse-pomodoro-ai-asset-prompts.md
```

## 3. 阶段路线图

建议按 P0-P8 执行，不要跳过 P0/P1/P2。

| 阶段 | 名称 | 目标 | 是否阻塞测试用户 |
| --- | --- | --- | --- |
| P0 | Pilot Readiness Freeze | 明确测试用户版本范围和不做什么 | 是 |
| P1 | Auth & Family Invite | 真实登录、家庭创建、儿童邀请码 | 是 |
| P2 | Production Data Layer | 线上数据库、迁移、seed 分离 | 是 |
| P3 | Privacy & Consent Gate | 告知同意、隐私、退出删除流程 | 是 |
| P4 | Evidence & Storage | 证据照片/本地 mock 的真实策略 | 是 |
| P5 | Pilot Operations | 反馈、人工复核、最小后台 | 是 |
| P6 | Deployment & Observability | 部署、环境变量、监控、回滚 | 是 |
| P7 | UX Polish for Test Users | 电脑端可用性和猫猫番茄钟优化 | 否，但强烈建议 |
| P8 | Pilot Acceptance | 测试用户版本验收与发布清单 | 是 |

## 4. Prompt P0：Pilot Readiness Freeze

目标：冻结测试用户版本范围，避免在可用性基础没补齐前继续扩功能。

```text
请执行 Prompt P0：Pilot Readiness Freeze。

任务：
1. 基于当前 MVP 验收报告和 Before Pilot Gate，创建测试用户版本范围文档。
2. 明确 Alpha/Pilot 版本只支持哪些平台、角色、流程和数据。
3. 明确仍不支持的功能：真实 AI 自动建议、真实推送、支付、学校场景、复杂会员、儿童开放社交等。
4. 输出测试用户使用的最小闭环：
   - 家长注册/登录
   - 创建家庭
   - 邀请孩子
   - 创建小约定
   - 孩子确认
   - 猫猫番茄钟
   - 孩子复盘
   - 家长回应
   - 家庭日记
   - 退出/删除申请
5. 更新或新增文档：
   - docs/product/pilot-scope.md
   - docs/product/pilot-non-goals.md
   - docs/research/pilot-readiness-checklist.md
6. 不写业务代码，除非发现文档入口缺失需要补索引。

验收标准：
- 文档明确测试用户版本范围。
- 文档明确真实试点前阻塞项。
- 文档明确哪些功能继续 mock/template。
- 没有引入新代码风险。
```

## 5. Prompt P1：真实登录与家庭邀请

目标：替换当前 mock role switcher，建立测试用户可用的真实身份方案。

```text
请执行 Prompt P1：Auth & Family Invite。

任务：
1. 设计并实现测试用户版身份方案：
   - 家长真实登录
   - 家庭创建
   - 儿童邀请码
   - 儿童加入家庭
   - witness 邀请链接
2. 保留开发环境 mock role switcher，但生产/测试用户环境默认关闭。
3. 儿童账号方案必须最小化：
   - 不强制邮箱
   - 可用家庭邀请码 + 昵称
   - 由家长创建或授权加入
4. 邀请码必须包含：
   - 创建者
   - 家庭
   - 角色
   - 过期时间
   - 使用次数限制
   - 防误入提示
5. 服务端 action/API 必须从当前 session 获取 actor，不再依赖 seed_parent/seed_child。
6. 增加权限测试：
   - child 不能创建家长回应
   - witness 不能看证据/ChildNote/金额/修复详情
   - parent 不能读取 ChildNote 原文
   - 未加入家庭的用户不能访问家庭数据
7. 更新文档：
   - docs/engineering/auth-and-invite.md
   - docs/engineering/permissions-matrix.md
   - docs/design/screen-spec.md

建议实现：
- 若当前仍是 Next.js，可优先使用轻量 session auth。
- 测试用户阶段可先用 email magic link 或用户名+一次性测试码。
- 不要在本阶段接复杂 OAuth，除非已有成熟方案。

验收标准：
- 真实 parent 可以创建家庭并邀请 child。
- child 通过邀请码进入自己的家庭。
- witness 只能看安全摘要。
- 生产模式没有 mock role switcher 入口。
- unit + E2E 覆盖核心越权路径。
```

## 6. Prompt P2：线上数据库与数据迁移

目标：从本地 demo 数据走向可部署数据层。

```text
请执行 Prompt P2：Production Data Layer。

任务：
1. 确认测试用户版本数据库策略：
   - 本地开发 SQLite 可保留。
   - 测试/生产环境优先 PostgreSQL。
2. 整理 Prisma schema，确认字段支持真实家庭、多用户、多邀请。
3. 将 seed 数据与真实数据隔离：
   - demo seed 只在 development/test 使用。
   - production 不允许自动写入 seed_family。
4. 增加环境变量校验：
   - DATABASE_URL
   - AUTH_SECRET
   - APP_BASE_URL
   - STORAGE_PROVIDER
   - AI_PROVIDER_MODE
5. 增加迁移和部署前检查脚本。
6. 更新文档：
   - docs/engineering/deployment-data-plan.md
   - docs/engineering/env-vars.md
   - docs/engineering/migration-runbook.md

验收标准：
- 本地测试仍可使用 seed。
- 测试环境可连接 PostgreSQL。
- production 构建不会依赖 seed 数据。
- 缺少关键 env 时应用明确失败或进入安全降级。
```

## 7. Prompt P3：隐私、同意与测试家庭退出流程

目标：关闭真实试点前最关键的合规门。

```text
请执行 Prompt P3：Privacy & Consent Gate。

任务：
1. 基于 docs/research/before-pilot-gate.md，补齐试点所需文本和流程。
2. 输出家长告知与同意页面：
   - 产品用途
   - 收集哪些数据
   - 不收集哪些数据
   - ChildNote 默认孩子私密
   - witness 可见范围
   - AI/Kimi 默认不真实接入或需单独同意
   - 退出测试方式
3. 输出儿童友好提示文案：
   - 简短
   - 不制造压力
   - 告诉孩子哪些内容是私密的
4. 实现退出/删除申请入口：
   - 家长申请退出
   - 数据导出请求
   - 数据删除请求
   - 数据封存请求
5. 增加人工处理状态：
   - requested
   - in_review
   - completed
   - rejected_with_reason
6. 更新文档：
   - docs/safety/pilot-consent-text.md
   - docs/safety/data-request-runbook.md
   - docs/safety/privacy-and-retention.md

验收标准：
- 家长首次进入测试版必须确认同意。
- 未同意不能创建家庭或邀请孩子。
- 有明确退出和数据处理入口。
- 不承诺无法自动完成的删除，需要标注人工处理时限。
```

## 8. Prompt P4：证据照片与存储策略

目标：确定 MVP 证据照片到底真实上传还是继续 mock，并让规则可执行。

```text
请执行 Prompt P4：Evidence & Storage。

任务：
1. 做出测试用户版本证据策略：
   - 方案 A：继续 mock，不上传真实照片。
   - 方案 B：允许上传，但强限制和可删除。
2. 如果采用真实上传：
   - 使用对象存储。
   - 限制文件大小、类型、数量。
   - 禁止人脸、住址、学校标识、证件、聊天截图、定位信息。
   - 上传前显示提示。
   - 保存前剥离 EXIF。
   - 支持家长删除申请和人工封存。
3. 如果继续 mock：
   - UI 明确“当前测试版只记录文字说明，不上传照片”。
   - 保留未来 StorageAdapter 接口。
4. 增加服务端校验，不只靠前端提示。
5. 更新文档：
   - docs/engineering/storage-adapter.md
   - docs/safety/evidence-photo-policy.md
   - docs/design/screen-spec.md

推荐：
- 第一批测试家庭建议采用 mock/文字说明，不上传真实照片。

验收标准：
- 证据策略明确。
- UI 文案和服务端规则一致。
- E2E 覆盖敏感内容拦截。
- 不会无提示收集儿童照片。
```

## 9. Prompt P5：试点运营与人工复核

目标：测试用户使用后，团队能看见问题、处理请求、保护风险。

```text
请执行 Prompt P5：Pilot Operations。

任务：
1. 实现最小运营后台或管理视图，仅内部管理员可访问。
2. 后台最少支持：
   - 查看测试家庭列表
   - 查看同意状态
   - 查看数据请求
   - 查看异常风险标记
   - 标记人工处理进度
3. 实现反馈入口：
   - 家长反馈
   - 孩子简短反馈
   - bug 反馈
4. 实现异常风险人工复核队列：
   - 明确安全风险词
   - 不做 AI 判罚
   - 只进入人工复核
5. 审计日志覆盖后台操作。
6. 更新文档：
   - docs/research/pilot-operations-runbook.md
   - docs/safety/child-safety-sop.md
   - docs/engineering/admin-permissions.md

验收标准：
- 只有 admin 能进入运营后台。
- 每个数据请求有状态和处理记录。
- 每个后台动作写 AuditLog。
- 异常风险不会自动通知孩子或自动处罚。
```

## 10. Prompt P6：部署、监控与回滚

目标：让测试用户可以稳定访问，出问题可以定位和回滚。

```text
请执行 Prompt P6：Deployment & Observability。

任务：
1. 选择并配置测试环境部署方式。
2. 建立环境变量模板。
3. 建立部署检查清单。
4. 接入最小监控：
   - server error
   - client error
   - slow route
   - failed action
   - failed login
5. 增加健康检查：
   - /api/health
   - database connectivity
   - storage connectivity if enabled
6. 建立回滚方案：
   - 回滚代码
   - 回滚数据库迁移注意事项
   - 暂停新用户邀请
7. 更新文档：
   - docs/engineering/deployment-runbook.md
   - docs/engineering/observability-plan.md
   - docs/engineering/rollback-plan.md

验收标准：
- 测试环境可部署。
- 部署后有 health check。
- 关键错误可被记录。
- 出问题可暂停邀请并回滚。
```

## 11. Prompt P7：测试用户体验打磨

目标：让外部测试家庭能自己走完流程，不需要开发者在旁边解释。

```text
请执行 Prompt P7：UX Polish for Test Users。

任务：
1. 梳理外部测试用户首次使用路径。
2. 优化页面空态、错误态、加载态、提交中、无权限态。
3. 将开发/乱码/内部文案全部替换为正式中文或清晰英文。
4. 优化猫猫番茄钟：
   - 使用猫猫森林饮品店素材。
   - 动画低刺激。
   - 点击反馈不鼓励反复点击。
   - 完成反馈温和。
5. 增加引导但不要做营销 landing page。
6. 更新：
   - docs/design/pilot-screen-spec.md
   - docs/design/copywriting.md
   - docs/product/pilot-user-flows.md

验收标准：
- 家长不看说明也能完成首次创建家庭和邀请。
- 孩子不看说明也能确认、专注、复盘。
- 所有主流程错误态可理解。
- 番茄钟不抢注意力。
- Playwright 截图验收覆盖核心页面。
```

## 12. Prompt P8：测试用户版本最终验收

目标：确认可以发给第一批测试家庭。

```text
请执行 Prompt P8：Pilot Acceptance。

任务：
1. 按 prd-review-gate 标准进行测试用户版本验收。
2. 检查：
   - 真实登录
   - 家庭邀请
   - 角色权限
   - 主业务闭环
   - ChildNote 隐私
   - witness 弱权限
   - 证据策略
   - 同意与退出
   - 数据请求
   - 部署和监控
   - 回滚方案
3. 运行完整测试：
   - unit
   - typecheck
   - build
   - E2E
   - 权限负向测试
   - 视觉截图验收
4. 输出：
   - docs/reviews/<date> Reward测试用户版本验收报告.md
   - docs/research/pilot-launch-checklist.md
   - docs/research/pilot-test-invite-template.md

验收标准：
- P0 = 0
- P1 = 0
- P2 <= 2
- 所有真实试点阻塞项关闭或明确不开放真实试点
- 可以生成测试邀请包
```

## 13. 技术建议

### 13.1 身份方案

第一批测试用户不建议一上来做复杂账号体系。推荐：

- parent：邮箱 magic link 或测试码登录。
- child：邀请码 + 昵称 + 家庭绑定。
- witness：一次性链接 + 只读安全摘要。
- admin：单独 allowlist。

### 13.2 数据库

推荐：

- local/test：SQLite 或本地 PostgreSQL。
- pilot/staging：PostgreSQL。
- production pilot：PostgreSQL + 自动备份。

### 13.3 AI/Kimi

推荐继续默认关闭真实接入：

- `AI_PROVIDER_MODE=mock`
- `AI_PROVIDER_MODE=template`
- `AI_PROVIDER_MODE=kimi` 只能在 staging 手动开启

真实接入前必须完成：

- 脱敏。
- 开关。
- 失败降级。
- 日志最小化。
- 不发送 ChildNote 原文。
- 不发送证据照片。

### 13.4 证据照片

第一批测试家庭建议不要真实上传照片。使用：

- 文字说明。
- 本地 mock placeholder。
- 后续再加 StorageAdapter。

理由：

- 未成年人隐私风险低。
- 产品闭环不依赖真实照片。
- 测试成本低。

## 14. 第一批测试用户发布前清单

- [ ] 测试用户范围冻结。
- [ ] 真实 parent 登录可用。
- [ ] child 邀请码可用。
- [ ] witness 链接可用。
- [ ] mock role switcher 在测试用户环境关闭。
- [ ] PostgreSQL 测试环境可用。
- [ ] seed 数据不会污染生产。
- [ ] 家长告知与同意完成。
- [ ] 儿童友好说明完成。
- [ ] 退出/删除/导出申请入口完成。
- [ ] 证据照片策略明确。
- [ ] AI/Kimi 默认 mock/template。
- [ ] 最小 admin/运营处理入口完成。
- [ ] 错误监控和 health check 完成。
- [ ] 部署与回滚文档完成。
- [ ] E2E 主链路通过。
- [ ] 权限负向测试通过。
- [ ] 视觉截图验收通过。
- [ ] prd-review-gate 最终验收通过。

## 15. 不建议现在做的事

下一阶段不要优先做：

- 会员/Pro 付费。
- 商家奖励池。
- 真实推送通知。
- 复杂 AI 对话。
- 家庭之外的社交。
- 排行榜。
- 学校/班级场景。
- 大规模数据分析。
- 复杂移动端原生壳。

这些会显著增加合规、隐私、运营和测试复杂度，不利于第一批测试家庭稳定试用。

## 16. 推荐实际执行顺序

最稳妥顺序：

1. P0 范围冻结。
2. P1 登录与邀请。
3. P2 线上数据库。
4. P3 同意与退出。
5. P4 证据策略。
6. P6 部署与监控。
7. P5 运营后台。
8. P7 UX 和猫猫番茄钟打磨。
9. P8 最终验收。

如果时间很紧，最小可发测试用户版本必须至少完成：

1. P1 登录与邀请。
2. P2 线上数据库。
3. P3 同意与退出。
4. P6 部署与监控。
5. P8 验收。

