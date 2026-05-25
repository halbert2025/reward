# Reward MVP 工程架构

本文用途：描述 Reward MVP 的模块边界、数据流、目录规划、Mock 边界、测试边界和部署约束。本文不实现业务功能，只给后续工程任务提供结构。

## 1. 架构目标

Reward MVP 是一个单体 Web/PWA 应用，目标是稳定跑通首个家庭小约定闭环：

```text
parent 设置家庭与奖池
-> parent 创建首个小约定
-> child 确认并主动开始愿望番茄钟
-> child 完成并提交复盘/可选证据
-> parent 回应兑现/延期/待复盘
-> 系统生成亲子日记和安静猫来访
```

工程架构必须保护以下边界：

- Contract 状态机是契约状态变化的唯一入口。
- Permission 函数是读取敏感数据的唯一入口。
- 已确认 Contract 不可覆盖，只能生成 ContractVersion。
- 写操作必须产生 AuditLog。
- ChildNote、Evidence、DiaryEntry 必须分域。
- Mock auth、mock AI、mock storage、mock notification 不得绕过真实权限规则。

## 2. 推荐目录结构

```text
reward/
  app/
    (parent)/
    (child)/
    (witness)/
    api/
    globals.css
    layout.tsx
  components/
    parent/
    child/
    witness/
    shared/
  domain/
    contract/
    reward-pool/
    permission/
    safety/
    notification/
    diary/
    audit/
  persistence/
    prisma/
    repositories/
    seed/
  services/
    auth/
    ai/
    storage/
    notification/
    clock/
  lib/
    env/
    errors/
    result/
  tests/
    unit/
    integration/
    e2e/
  docs/
```

说明：

- `app/` 只处理路由、页面组装、Server Actions/API routes。
- `components/` 只处理展示和局部交互。
- `domain/` 保存纯业务规则，不依赖 React、Next.js、Prisma。
- `persistence/` 保存 Prisma schema、migration、repository。
- `services/` 保存外部能力 adapter；MVP 默认 mock。
- `tests/` 按风险组织，优先覆盖状态、权限、审计、闭环。

## 3. 模块职责

| 模块 | 职责 | 不允许做 |
|---|---|---|
| `app/(parent)` | 家长端 5 个页面、创建家庭、原则确认、奖池、契约、回应 | 直接改 Contract 状态 |
| `app/(child)` | 孩子端愿望后院、番茄钟、完成提交、ChildNote 最小入口 | 让 parent 可见 ChildNote |
| `app/(witness)` | 纪念见证人占位摘要和祝福 | 查看金额、证据、争议、树洞 |
| `domain/contract` | Contract 状态机、ContractVersion 规则、Fulfillment 规则 | 读取 session、写数据库 |
| `domain/permission` | `canViewContract`、`canViewEvidence`、`canViewChildNote` 等 | 根据 UI 路由临时放行 |
| `domain/safety` | 不可建模清单、风险等级、照片提示规则 | 自动报警、自动裁决 |
| `domain/audit` | 关键事件枚举和审计 payload 规则 | 允许关键写操作无日志 |
| `persistence/repositories` | 数据读写、事务边界、Prisma 调用 | 承载业务决策 |
| `services/auth` | mock role switcher 与未来 auth adapter | 绕过权限函数 |
| `services/ai` | mock AI / 规则模板 suggestion DTO | 直接写业务状态 |
| `services/storage` | mock Evidence metadata，未来对象存储 adapter | 默认公开文件 |
| `services/notification` | 站内通知、提醒队列、测试时间倍率 | 真实推送轰炸 |

## 4. 核心数据模型边界

MVP 至少需要以下概念，字段细化由 Prompt 0D/后续数据模型任务完成。

| 实体 | 作用 | MVP 关键约束 |
|---|---|---|
| `Family` | 家庭空间 | 不要求学校、真实姓名、精确位置 |
| `User` | 参与者 | 角色为 parent/child/witness/system |
| `RewardPool` | 家庭奖池 | child 只能从池中选择首个小愿望 |
| `Contract` | 当前契约聚合根 | 状态变化只走 domain 状态机 |
| `ContractVersion` | 契约版本 | 已确认契约修改必须生成新版本 |
| `TaskSession` | 愿望番茄钟执行记录 | 记录开始、退出、完成，不做实时监控 |
| `Evidence` | 轻证据 | 可选、最小化、按协议可见 |
| `ChildNote` | 孩子私密树洞/小纸条 | 默认只有 child 可见 |
| `Fulfillment` | 家长回应 | 已兑现、延期、待复盘 |
| `DiaryEntry` | 亲子日记 | parent/child 可见，不包含私密 ChildNote |
| `WitnessInvite` | 纪念见证 | 弱权限，只看摘要和完成纪念 |
| `Notification` | 站内提醒 | 结构化、可读、可测试 |
| `AuditLog` | 审计日志 | 所有关键写操作必须记录 |

## 5. 状态机边界

Contract MVP 状态：

```text
draft
-> pending_confirmation
-> active
-> achieved
-> fulfilled
```

分支：

```text
achieved -> delayed
achieved -> pending_repair
active -> archived
delayed -> fulfilled
pending_repair -> archived
```

规则：

- UI 不直接写 `contract.status`。
- API/Server Action 必须调用 `domain/contract` 的 transition。
- transition 返回：新状态、允许 side effects、AuditLog payload、Notification payload。
- 不允许从 `draft` 直接到 `fulfilled`。
- 不允许对已确认版本做覆盖更新。

## 6. 权限边界

所有读取敏感数据必须经过 permission 函数。

| 数据 | parent | child | witness |
|---|---|---|---|
| Contract 摘要 | 可见 | 可见 | 仅摘要 |
| 奖励金额/价值细节 | 可见 | 可见 | 不可见 |
| Evidence | 按验收协议可见 | 自己提交可见 | 不可见 |
| ChildNote | 不可见 | 自己可见 | 不可见 |
| DiaryEntry | 可见 | 可见 | 仅完成纪念摘要 |
| AuditLog | 后台/系统可见，普通前台不直接展示 | 普通前台不直接展示 | 不可见 |
| 争议详情 | MVP 不做完整争议 | MVP 不做完整争议 | 不可见 |

权限函数建议：

```text
canViewContract(actor, contract)
canEditDraftContract(actor, contract)
canTransitionContract(actor, contract, transition)
canViewEvidence(actor, evidence)
canCreateChildNote(actor, child)
canViewChildNote(actor, note)
canViewDiaryEntry(actor, diaryEntry)
canViewWitnessSummary(actor, witnessInvite)
```

## 7. 写操作数据流

标准写路径：

```text
UI event
-> Server Action / API route
-> auth adapter 获取 actor
-> input validation
-> permission check
-> domain command / transition
-> repository transaction
-> AuditLog write
-> Notification / DiaryEntry side effect
-> response DTO
```

禁止路径：

```text
UI event -> repository.update({ status })
UI event -> direct Prisma write without permission
AI suggestion -> direct business write
mock role switcher -> bypass permission
```

## 8. Mock 边界

| 能力 | MVP 实现 | 必须保留的真实边界 |
|---|---|---|
| Auth | mock role switcher | actor、role、familyId、relationship 结构与真实 auth 一致 |
| AI | 规则模板 / mock suggestion | 只返回建议，用户确认后才写业务 |
| Evidence storage | mock metadata / local placeholder | 权限、隐私提示、对象存储字段预留 |
| Notification | 站内通知表 | channel adapter 预留，提醒频率可控 |
| Clock | 当前时间 + 测试倍率 | 24h/72h 提醒可模拟 |

Mock 不是捷径，只是 adapter 的一种实现。

## 9. API / Server Action 设计约束

MVP 可以优先使用 Server Actions；需要跨端或 e2e 稳定调用的能力可提供 API routes。

命名原则：

- command 用动词：`createFamily`、`confirmPrinciples`、`createFirstContract`、`startTaskSession`、`submitTaskCompletion`、`respondFulfillment`。
- query 用名词：`getParentHome`、`getChildBackyard`、`getWitnessSummary`。
- 返回 DTO 不暴露数据库内部字段。

所有 command 都必须有：

- actor。
- input validation。
- permission check。
- domain command。
- AuditLog。
- 明确错误类型。

## 10. 测试架构

| 层级 | 工具 | 目标 |
|---|---|---|
| unit | Vitest | domain 状态机、permission、安全规则 |
| integration | Vitest + test database | repository transaction、AuditLog、Notification side effects |
| e2e | Playwright | 10 页 MVP 闭环、角色切换、敏感权限不可见 |

最低必须测试：

- parent 创建家庭、原则确认、奖池初始化。
- parent 创建首个小约定，child 确认。
- child 开始、退出原因、完成、提交复盘。
- parent 已兑现/延期/待复盘。
- 生成 DiaryEntry 和安静猫来访。
- parent 不能访问 ChildNote。
- witness 不能访问 Evidence、ChildNote、金额、争议详情。
- 已确认契约修改生成 ContractVersion。
- 不可建模契约被拦截。
- 关键写操作都有 AuditLog。

## 11. 部署和环境

环境：

| 环境 | 用途 | 数据 |
|---|---|---|
| local | 本地开发 | SQLite mock 数据 |
| demo | 演示 | SQLite 或轻量托管数据库，mock auth/AI/storage |
| pilot | 小范围试用 | PostgreSQL、真实 auth、对象存储需审查后开启 |
| production | 正式上线 | PostgreSQL、真实 auth、对象存储、监控、备份 |

MVP 默认：

- `MOCK_AUTH_ENABLED=true`
- `EVIDENCE_STORAGE_MODE=mock`
- `NOTIFICATION_MODE=in_app`
- `AI_MODE=mock`
- `AUDIT_LOG_ENABLED=true`

## 12. 迁移路线

| 现在 | 未来 | 迁移条件 |
|---|---|---|
| Web/PWA | 移动端壳或原生端 | MVP 闭环验证通过，推送/相机/离线体验成为关键问题 |
| SQLite | PostgreSQL | 进入 pilot 或多人并发测试 |
| mock auth | 真实 auth | Pilot 前需要家长同意和儿童账号策略 |
| mock storage | 对象存储 | 完成照片证据隐私文案、权限审计、生命周期策略 |
| 站内通知 | Push/email | 完成频率控制、退订、隐私文案 |
| mock AI | 真实 AI provider | 完成安全 SOP、输出审计、人工复核 |

## 13. 架构审查清单

合并代码前必须检查：

- 是否出现 parent 默认读取 ChildNote。
- 是否出现 witness 读取 Evidence、金额、争议或 ChildNote。
- 是否出现直接覆盖 ContractVersion。
- 是否出现关键写操作无 AuditLog。
- 是否出现学校、机构、托管、导购、视频、强锁、开放社交或抽卡主链路。
- 是否把 V1/V2 功能塞进 MVP。
- 是否让 AI 自动发送、裁决、报警或改写事实。
- 是否绕过 permission/domain 直接写数据库。
