# Reward Codex 产品开发提示词设计方案 v2

本文用途：在现有《Reward 软件开发提示词文档》的基础上，补齐开发前冻结层、提示词执行规范、前置决策、隐私安全审查和分阶段交付规则。本文不是 PRD，也不是代码任务；它是后续让 Codex 稳定开发 Reward MVP 的操作手册。

## 1. 总体判断

现有提示词方案已经具备三件很重要的能力：

1. 产品边界明确：Reward 是家庭愿望契约系统，不是家长控制、学校管理、商家导购、支付托管或儿童社交产品。
2. 任务拆分合理：从资料整理、AGENTS、Skills、MVP 范围、状态机、数据模型、API、测试，再到代码实现，顺序基本正确。
3. 验收意识强：大多数 Prompt 都写了输入文件、输出文件、禁止事项和完成标准。

需要补强的部分主要在开发前：

1. 原始资料还在 Downloads，仓库内没有稳定的 `docs/source` 和 Markdown 版本。
2. 当前方案缺少“产品冻结”和“开放问题冻结”步骤，后续开发容易边做边改。
3. 技术栈只给了建议，没有形成技术决策记录。
4. 未成年人数据、照片证据、树洞、异常情绪、导出/删除/封存，需要在编码前形成数据治理文档。
5. 缺少指标埋点和灰度测试计划到工程任务的映射。
6. 缺少 Prompt 统一格式，后续每条提示词可能粒度不一致。

结论：不建议直接从 Prompt 15 初始化技术项目开始。应先补一个 Sprint 0：资料入库、产品冻结、技术决策、隐私安全、设计规格、测试指标。

## 2. Prompt 统一格式

以后每条给 Codex 的开发提示词都建议采用同一结构：

```text
你是 Reward 项目的 <角色>。

目标：
- <这次任务唯一目标>

必须先读取：
- <文件 1>
- <文件 2>

本次必须输出：
- <文件或代码路径 1>
- <文件或代码路径 2>

硬性产品边界：
- Reward 是家庭愿望契约系统，不是家长控制软件。
- 不做学校/机构、支付托管、商家导购、视频监督、默认强锁、开放儿童社交、同校/班级数据池、抽卡式惊喜。
- AI 只能建议、拆解、转译、提醒，不裁判、不自动发送、不替任何一方决定。
- 契约必须有状态机、版本记录和审计日志。
- 家长不能单方删除孩子努力记录。
- ChildNote / 树洞默认孩子私密。

工程限制：
- 不要做本次目标之外的功能。
- 不要重构无关文件。
- 如果发现缺少前置文档，先补文档或列出阻塞项。
- 每次代码改动必须说明测试，涉及权限/隐私必须补测试。

验收标准：
- <可检查的完成标准>

最后输出：
- 修改了哪些文件。
- 如何验证。
- 尚未解决的风险或开放问题。
```

## 3. 建议仓库结构微调

现有结构可以保留，建议补充几个前置目录：

```text
docs/
  source/
    originals/
    extracted/
  decisions/
    product-decisions.md
    technical-decisions.md
    open-questions.md
  research/
    pilot-plan.md
    interview-script.md
  safety/
    data-classification.md
    privacy-and-retention.md
    child-safety-sop.md
    threat-model.md
  analytics/
    mvp-metrics.md
    event-taxonomy.md
  codex/
    reward-codex-prompt-plan-v2.md
    task-prompts.md
    skill-plan.md
```

原因：`docs/product` 放产品定稿，`docs/source` 放原始资料和转换文本，`docs/decisions` 记录“为什么这么做”，`docs/safety` 单独承载儿童隐私和合规底线。

## 4. 新增 Sprint 0 提示词

以下提示词应插入到现有 Prompt 1 之前或作为 Prompt 1A-1F 执行。

### Prompt 0A：原始资料入库与转换

```text
你是 Reward 项目的研发资料管理员。现在不要写业务代码。

目标：
把原始产品资料复制到仓库内，并转换成 Codex 后续可稳定读取的 Markdown / 纯文本资料。

原始资料来源：
- C:/Users/fungAI/Downloads/Reward_Codex软件开发提示词文档.md
- C:/Users/fungAI/Downloads/Reward_家庭愿望契约系统_完整PRD_v2.1.docx
- C:/Users/fungAI/Downloads/Reward_18个问题逐条完整归档版.docx
- C:/Users/fungAI/Downloads/reward_html_prototype.html

请创建：
- docs/source/originals/
- docs/source/extracted/

请输出：
- docs/source/originals/README.md
- docs/source/extracted/prd-v2.1.md
- docs/source/extracted/18-questions-archive.md
- docs/source/extracted/html-prototype-notes.md

要求：
1. 原始文件保留在 originals 或记录其绝对路径。
2. docx 转换后的 Markdown 要保留标题、表格和问题编号。
3. html-prototype-notes.md 提取页面、信息架构、交互、视觉方向，不要复制整段 CSS。
4. 不要开始写代码。

验收标准：
- docs/source/extracted 下 3 个可读文件存在。
- 每个文件开头写明来源、转换时间、用途。
- 最后输出资料索引和可能的转换损失。
```

### Prompt 0B：产品冻结与开放问题清单

```text
你是 Reward 项目的产品冻结助手。现在不要写代码。

目标：
基于 PRD、18 问题归档和 HTML 原型，产出一份“可进入研发”的产品冻结稿，并把仍未确定的问题单独列出。

必须读取：
- docs/source/extracted/prd-v2.1.md
- docs/source/extracted/18-questions-archive.md
- docs/source/extracted/html-prototype-notes.md

请输出：
- docs/product/product-freeze.md
- docs/decisions/open-questions.md
- docs/decisions/product-decisions.md

product-freeze.md 必须包含：
- 一句话定位
- MVP 唯一闭环
- MVP 用户角色
- MVP 十个页面
- MVP 必做功能
- MVP 不做功能
- 数据与隐私底线
- AI 能力边界
- Demo 成功标准

open-questions.md 必须按 Blocking / Before Coding / Before Pilot / Later 四级分类。

product-decisions.md 必须记录：
- 为什么只做家庭端
- 为什么不做支付托管
- 为什么不做视频监督/强锁
- 为什么树洞默认私密
- 为什么见证人默认弱权限
- 为什么商业化只从订阅开始

验收标准：
- 所有“是否进入 MVP”的问题都有明确结论或开放问题编号。
- 不允许把 V1/V2 功能偷偷放进 MVP。
```

### Prompt 0C：技术决策记录

```text
你是 Reward 项目的技术方案负责人。现在不要实现业务功能。

目标：
把 Reward MVP 的技术栈、运行方式和关键工程约束固化成 ADR，避免后续边写边换。

必须读取：
- docs/product/product-freeze.md
- docs/product/product-boundaries.md 如果存在
- docs/source/extracted/html-prototype-notes.md

请输出：
- docs/decisions/technical-decisions.md
- docs/engineering/architecture.md

必须决策：
1. MVP 是 Web/PWA、移动端壳、还是纯原生；如暂用 Web/PWA，说明原因和限制。
2. 前端框架、样式方案、状态管理方案。
3. 数据库选择：本地开发 SQLite 还是 PostgreSQL。
4. ORM / migration 方案。
5. 登录策略：MVP mock role switcher 还是真实 auth。
6. 图片/证据存储策略：MVP 是否只做本地 mock，正式版对象存储如何预留。
7. 通知策略：MVP 用站内通知还是真实推送。
8. AI 策略：MVP 不接真实 AI，还是接可关闭的 mock AI。
9. 测试策略：unit / integration / e2e 的最小集合。
10. 部署策略和环境变量命名。

验收标准：
- 每个技术决策都有“选择 / 不选择 / 原因 / 后续可迁移路径”。
- 不因为技术便利突破产品边界。
```

### Prompt 0D：隐私、安全与未成年人数据治理

```text
你是 Reward 项目的儿童隐私和安全审查助手。现在不要写代码。

目标：
把未成年人数据、树洞、证据照片、风险信号、导出/删除/封存策略写成工程可执行文档。

必须读取：
- docs/product/product-freeze.md
- docs/source/extracted/18-questions-archive.md
- docs/decisions/product-decisions.md

请输出：
- docs/safety/data-classification.md
- docs/safety/privacy-and-retention.md
- docs/safety/child-safety-sop.md
- docs/safety/threat-model.md

必须覆盖：
- A/B/C/D/E 数据分级
- Contract / Evidence / ChildNote / DiaryEntry / AuditLog 的默认权限
- 家长能看什么、不能看什么
- 家长能导出什么、不能单方删除什么
- 照片证据最小化采集原则
- 树洞普通情绪、持续异常、明确安全风险的处理方式
- AI 不自动报警、不泄露树洞原文
- 安全风险人工复核入口如何预留
- 关键威胁：越权访问、误分享、数据误删、证据泄露、见证人越权、AI 自动裁判

验收标准：
- 每类数据都有默认可见性、保存策略、导出策略、删除/封存策略。
- threat-model.md 至少列出 10 个风险和对应缓解措施。
- 文档明确：这不是法律意见，正式上线前需要目标市场法务审查。
```

### Prompt 0E：设计规格与页面状态表

```text
你是 Reward MVP 的产品设计整理助手。现在不要写前端代码。

目标：
把 HTML 原型转成可研发的页面规格、状态表、文案表和设计系统草案。

必须读取：
- docs/source/extracted/html-prototype-notes.md
- docs/product/product-freeze.md
- docs/source/extracted/18-questions-archive.md

请输出：
- docs/design/screen-spec.md
- docs/design/user-flows.md
- docs/design/copywriting.md
- docs/design/design-system.md

screen-spec.md 必须覆盖 MVP 十页：
- P01 家长欢迎页
- P02 原则确认页
- P03 奖池初始化页
- P04 创建首个小约定页
- P05 孩子邀请页
- P06 孩子愿望后院首页
- P07 愿望番茄钟页
- P08 完成提交页
- P09 家长兑现提醒页
- P10 亲子日记页

每页必须写：
- 页面目标
- 主要用户
- 入口和出口
- 默认状态 / 空状态 / 加载状态 / 错误状态
- 必填数据
- 操作按钮
- 禁用文案
- 验收标准

copywriting.md 必须包含：
- 产品人格
- 家长端文案原则
- 孩子端文案原则
- 见证人端文案原则
- 禁用词与替代表达

验收标准：
- 研发可以按 screen-spec.md 建页面，不需要回头看 HTML。
- 文案不得出现审判、控制、羞辱、强迫语气。
```

### Prompt 0F：指标与灰度测试计划

```text
你是 Reward MVP 的增长与验证设计助手。现在不要写代码。

目标：
把 PRD 中的 MVP 成败指标转成埋点事件、灰度测试方案和访谈脚本。

必须读取：
- docs/product/product-freeze.md
- docs/source/extracted/prd-v2.1.md

请输出：
- docs/analytics/mvp-metrics.md
- docs/analytics/event-taxonomy.md
- docs/research/pilot-plan.md
- docs/research/interview-script.md

mvp-metrics.md 必须包含：
- 首次设置完成率
- 首个小约定创建率
- 孩子开始守约率
- 首个约定完成率
- 家长回应率
- 亲子日记生成率
- 第二个约定创建率
- 7 日家庭留存率

event-taxonomy.md 每个事件必须写：
- event_name
- 触发时机
- 角色
- 必要属性
- 禁止采集的属性
- 是否涉及儿童数据

pilot-plan.md 必须包含：
- 第一轮 10-20 组家庭测试方式
- 测试前告知与同意
- 每日观察重点
- 中止测试条件
- 数据删除/封存说明

验收标准：
- 埋点不采集学校、精确位置、真实姓名、无关人脸。
- 访谈问题能判断家长是否觉得被审判、孩子是否觉得被管理。
```

## 5. 对现有 Prompt 的关键修订建议

### Prompt 1 修订

当前 Prompt 1 负责整理资料。建议改为读取 `docs/source/extracted/`，不要直接读 docx。这样后续任务稳定，不会被 Word 转换或编码问题卡住。

新增输出：
- `docs/product/product-freeze.md`
- `docs/decisions/open-questions.md`

### Prompt 2 修订

AGENTS.md 里建议额外加入：

```text
Before Coding Checklist:
- 已读取 product-freeze.md。
- 已检查 product-boundaries.md。
- 涉及角色/隐私时已读取 permissions-matrix.md 和 data-classification.md。
- 涉及状态变化时已读取 state-machines.md。
- 涉及文案时已读取 copywriting.md。
- 涉及儿童数据时已读取 child-safety-sop.md。
```

### Prompt 3-9 修订

Skills 可以做，但不要让 Skill 替代源文档。每个 Skill 必须要求先读取 `AGENTS.md` 和对应 `docs/` 文档，并且输出时必须引用依据文件。

建议新增一个 Skill：

```text
reward-preflight-reviewer
```

用途：每次大任务开始前检查前置资料是否齐全，包括产品冻结、技术决策、数据治理、设计规格、测试计划。

### Prompt 10 修订

冻结 MVP 范围时，必须把 “MVP / V1 / V2 / 永久不做” 分成四列，避免把 V1 功能误塞进 MVP。

### Prompt 11 修订

状态机输出应额外包含：

- 幂等性规则
- 并发冲突规则
- 失败重试规则
- 审计事件名
- 角色可见性

原因：Reward 的核心不是页面，而是“契约状态可信”。

### Prompt 12 修订

数据模型必须显式区分：

- 业务事实：Contract、ContractVersion、Task、Fulfillment
- 用户表达：Evidence、ChildNote、DiaryEntry
- 系统治理：AuditLog、Notification、RiskSignal
- 权限关系：FamilyMember、Membership、WitnessInvite

新增对象建议：

- `ConsentRecord`：记录家长原则确认、隐私确认、试用同意。
- `RiskSignal`：只存风险摘要和等级，不泄露树洞原文。
- `DataExportRequest`：导出和封存请求。
- `SoftDeleteRecord` 或 `ArchiveRecord`：记录封存/隐藏/删除原因。

### Prompt 13 修订

API Contract 需要补：

- 所有接口的权限错误码。
- 所有状态转换的非法操作错误码。
- 所有写操作的 AuditLog。
- ChildNote 接口必须单独列出 parent/witness 禁止访问。
- Evidence 上传接口必须声明照片最小化提示。

### Prompt 14 修订

测试计划必须分层：

1. Domain unit tests：状态机、权限、数据访问。
2. API tests：角色和错误码。
3. E2E tests：10 页核心流程。
4. Safety regression tests：禁止功能和禁用文案。

### Prompt 15 修订

初始化技术项目前必须读取：

- `docs/decisions/technical-decisions.md`
- `docs/safety/data-classification.md`
- `docs/design/screen-spec.md`
- `docs/analytics/event-taxonomy.md`

并明确：技术项目初始化只搭壳，不做业务逻辑。

### Prompt 16-23 修订

每个实现 Prompt 都要增加：

```text
必须先写或补齐测试：
- 涉及权限：先写权限测试。
- 涉及状态：先写状态机测试。
- 涉及 ChildNote：先写 parent/witness 不可读测试。
- 涉及 Evidence：先写最小权限测试。
```

### Prompt 24 修订

隐私与产品边界审查要同时扫：

- 代码
- 文案
- 测试
- 数据模型
- API contract
- 埋点事件

尤其检查埋点里是否采集了学校、精确位置、真实姓名、无关人脸、孩子私密表达。

### Prompt 25 修订

MVP Demo 验收除了 5 个剧本，还应有 3 个“反向验收”：

1. 尝试让家长查看 ChildNote，必须失败。
2. 尝试修改已确认契约原版本，必须失败或生成新版本。
3. 尝试创建高风险/不可建模契约，必须被拦截。

## 6. 推荐执行顺序 v2

```text
Sprint 0 / 开发前冻结
1. Prompt 0A：原始资料入库与转换
2. Prompt 0B：产品冻结与开放问题清单
3. Prompt 0C：技术决策记录
4. Prompt 0D：隐私、安全与未成年人数据治理
5. Prompt 0E：设计规格与页面状态表
6. Prompt 0F：指标与灰度测试计划

研发准备
7. Prompt 1：整理项目资料并生成开发资料目录
8. Prompt 2：创建 AGENTS.md 项目规则
9. Prompt 3-9：创建 Reward Skills
10. Prompt 10：冻结 MVP 范围
11. Prompt 11：设计状态机
12. Prompt 12：建立数据模型与权限矩阵
13. Prompt 13：设计 API Contract
14. Prompt 14：建立测试计划

代码实现
15. Prompt 15：初始化技术项目
16. Prompt 16：实现数据模型和 seed
17. Prompt 17：实现角色/权限基础层
18. Prompt 18：家长端 onboarding
19. Prompt 19：首个小约定创建流程
20. Prompt 20：孩子端愿望后院和番茄钟
21. Prompt 21：家长兑现回应和亲子日记
22. Prompt 22：孩子小纸条/树洞最小版
23. Prompt 23：免费 1 个纪念见证人占位

验收
24. Prompt 24：隐私与产品边界审查
25. Prompt 25：MVP Demo 验收
26. Prompt 27：把后续大任务拆成小 PR
27. Prompt 28：代码审查
```

## 7. 开发前必须确认的开放问题

这些问题不全部确认也能启动 Sprint 0，但在 Prompt 15 写代码前最好有结论。

### Blocking

1. MVP 第一版到底采用 Web/PWA、移动端壳，还是原生 App？
2. 首轮 Demo 是否必须支持真实登录，还是允许 mock role switcher？
3. 证据照片 MVP 是否真实上传，还是先本地 mock？
4. 通知 MVP 是否真实推送，还是站内通知/模拟通知？
5. 是否接入真实 AI，还是先用规则模板和 mock AI？

### Before Coding

1. 数据库使用 SQLite 本地开发还是 PostgreSQL 优先？
2. Contract 状态机是否以代码库 domain 层为唯一真相？
3. AuditLog 需要覆盖哪些第一版操作？
4. ChildNote 是否进入 MVP 主流程，还是作为信任底线单独入口？
5. 免费见证人是 MVP 必做，还是 Demo 后补？
6. 家长未回应 24h/72h 的真实时间在开发环境如何模拟？

### Before Pilot

1. 试用家庭的告知与同意文本。
2. 未成年人数据处理和隐私政策草案。
3. 证据照片是否允许拍人脸、住址、学校标识。
4. 数据导出、封存、删除的人工处理流程。
5. 异常情绪和明确安全风险的人工复核流程。
6. 测试家庭退出后的数据处理。

### Later

1. 家庭会员/Pro 是否在 MVP Demo 出现入口。
2. 低攀比灵感库何时进入。
3. 能力归档何时进入。
4. 时光邮局何时进入。
5. 自愿专注护盾是否进入 V2。

## 8. 前期准备工作清单

### 产品准备

- [x] 把原始 PRD、18 问题归档、HTML 原型放进 `docs/source/originals/` 或记录绝对路径。
- [x] 转换出稳定 Markdown，后续 Prompt 不再直接依赖 docx。
- [x] 生成 `product-freeze.md`。
- [x] 生成 `product-boundaries.md`。
- [x] 生成 `open-questions.md`。
- [x] 明确 MVP / V1 / V2 / 永久不做。

### 设计准备

- [x] 10 个 MVP 页面有页面规格。
- [x] 每个页面有默认、空、加载、错误、权限不足状态。
- [x] 有产品文案库和禁用词清单。
- [x] 有基础设计系统：颜色、字号、间距、组件、儿童端与家长端差异。
- [x] HTML 原型被转成研发规格，而不是直接当最终 UI。

### 工程准备

- [x] 有技术决策记录。
- [x] 有架构文档。
- [x] 有状态机文档。
- [x] 有数据模型和权限矩阵。
- [x] 有 API Contract。
- [x] 有测试计划。
- [x] 有 seed personas：1 家长、1 孩子、1 见证人、1 个首约定。

### 隐私安全准备

- [x] A/B/C/D/E 数据分级完成。
- [x] ChildNote 和 Evidence 明确分离。
- [x] 家长不可查看 ChildNote 默认内容写入权限矩阵。
- [x] 家长不可单方硬删除孩子努力记录写入数据策略。
- [x] 照片证据最小化采集原则明确。
- [x] 异常情绪和安全风险 SOP 有草案。
- [x] 正式上线前安排目标市场法务审查。

### 验证准备

- [x] MVP 指标和事件字典完成。
- [x] 10-20 组家庭灰度计划完成。
- [x] 访谈脚本完成。
- [x] Demo 成功标准明确：一个家庭 5 分钟内创建首个小约定，并完成守约、回应、日记闭环。
- [x] 反向验收完成：不能看树洞、不能改原契约、不能创建不可建模契约。

## 9. 最小可开工条件

只要以下文件存在，就可以进入 Prompt 15 初始化技术项目：

```text
AGENTS.md
docs/product/product-freeze.md
docs/product/product-boundaries.md
docs/design/screen-spec.md
docs/design/copywriting.md
docs/decisions/technical-decisions.md
docs/safety/data-classification.md
docs/engineering/state-machines.md
docs/engineering/data-model.md
docs/engineering/permissions-matrix.md
docs/engineering/api-contract.md
docs/engineering/testing-plan.md
```

## 10. Alpha / Pilot 后续开发提示词补充

本节用于承接已经完成 MVP Demo、P0-P8 测试用户版本准备之后的后续开发。后续仍然以本文作为主体开发提示词方案，不再单独维护零散提示词。

### 当前阶段判断

截至 2026-05-26，Reward 已完成 MVP 主闭环、P0-P8 Alpha / Pilot Readiness、P1-P4 评审修复终审、桌面端与移动端视觉验收、测试邀请模板和 Pilot launch checklist。当前阶段进入：

```text
P9：Pilot Launch & Controlled Test Ops
```

核心目标不再是扩大功能，而是让第一批测试家庭可以在受控、可回滚、可观察的条件下试用。

### Prompt P9：Pilot Launch & Controlled Test Ops

```text
你是 Reward 项目的试点发布与受控运营负责人。

目标：
把当前已通过 P8 的 Reward Alpha/Pilot 版本，从“本地验收完成”推进到“可发送给第一批测试家庭”的受控试点准备状态。

必须先读取：
- docs/research/pilot-launch-checklist.md
- docs/research/pilot-test-invite-template.md
- docs/research/before-pilot-gate.md
- docs/research/pilot-readiness-checklist.md
- docs/safety/pilot-consent-text.md
- docs/safety/privacy-and-retention.md
- docs/safety/child-safety-sop.md
- docs/reviews/2026.05.26 Reward P1-P4修复终审报告.md

本次必须输出或更新：
- docs/research/pilot-ops-responsibility-matrix.md
- docs/research/pilot-family-test-pack.md
- docs/research/pilot-daily-observation-template.md
- docs/research/pilot-launch-checklist.md
- 如果已有真实测试环境 URL：docs/reviews/<date> Reward测试环境冒烟验收记录.md

任务：
1. 创建试点运营责任矩阵：运营负责人、数据请求处理负责人、异常情绪/安全风险复核负责人、技术回滚负责人、测试家庭沟通负责人。
2. 创建第一批测试家庭执行包：测试前发送话术、测试步骤说明、家长反馈问题清单、孩子友好说明、退出测试说明、数据请求说明。
3. 创建上线前人工检查清单：测试环境 URL、admin allowlist、AI_PROVIDER_MODE、mock role switcher 是否关闭、health check、数据库环境、反馈入口、数据请求入口、回滚方式。
4. 创建试点期间每日观察模板：登录、邀请、孩子番茄钟、家长回应、隐私/安全反馈、数据请求、是否暂停新邀请。
5. 如果已有测试环境 URL：跑一次真实 URL 冒烟验收，归档桌面端和移动端截图，并更新 pilot-launch-checklist。

硬性边界：
- 不新增业务功能。
- 不接真实 AI/Kimi。
- 不开启真实照片上传。
- 不接真实推送。
- 不做支付、排名、开放儿童社交、学校/机构场景。

验收标准：
- 第一批测试家庭不需要开发者口头解释，也能按测试包完成流程。
- 运营人员知道谁处理反馈、数据请求、安全风险和回滚。
- 所有真实试点前剩余项都被标记为已完成、负责人待确认或明确后置。
- 如已有真实 URL，必须有桌面端和移动端冒烟截图。
```

### Prompt P10：Pilot Feedback Iteration

```text
你是 Reward 项目的试点反馈迭代负责人。

目标：
在第一批测试家庭开始使用后，把反馈、bug、隐私担忧和体验问题转化为可执行的修复队列，并完成第一轮高优先级修复。

必须先读取：
- docs/research/pilot-daily-observation-template.md
- docs/research/pilot-family-test-pack.md
- docs/research/pilot-operations-runbook.md
- docs/safety/child-safety-sop.md
- docs/engineering/testing-plan.md
- docs/reviews/最近一次验收或复审报告

本次必须输出或更新：
- docs/research/pilot-feedback-log.md
- docs/research/pilot-feedback-triage.md
- docs/reviews/<date> Reward Pilot反馈迭代报告.md
- 必要的代码、测试和文档修复

任务：
1. 汇总测试家庭反馈：登录/邀请、孩子理解、番茄钟体验、家长回应、隐私和信任担忧、数据请求和退出、bug 和性能问题。
2. 按 P0-P4 分级：P0 立即暂停试点，P1 继续邀请前必须修复，P2 本轮必须修复，P3 体验优化，P4 观察项。
3. 对 P0/P1/P2 做修复：能通过文案或配置解决的，不扩大功能；涉及权限、隐私、状态机的，必须补测试；涉及 UI 的，必须补截图或人工验收记录。
4. 更新测试家庭说明：如果流程或边界有变化，同步 pilot-family-test-pack。
5. 运行必要验证：typecheck、unit test、build、受影响 E2E。

硬性边界：
- 不因为单个反馈直接扩大到 V1/V2 功能。
- 不接真实 AI、真实照片上传、真实推送或支付。
- 不为了“效率”绕过 ChildNote、witness、DataRequest 边界。

验收标准：
- 所有 P0/P1 反馈有明确关闭或暂停决策。
- P2 反馈有修复、测试或明确排期。
- 反馈日志可追踪：来源、角色、影响、处理结果、验证方式。
- 没有引入新的隐私、权限或状态机回归。
```

### Prompt P11：Pilot Hardening

```text
你是 Reward 项目的试点稳定性加固负责人。

目标：
基于第一轮真实试点反馈和运行情况，加固部署、日志、数据处理、权限边界、移动端体验和运营流程，让 Pilot 可以稳定扩大到下一小批家庭。

必须先读取：
- docs/research/pilot-feedback-triage.md
- docs/research/pilot-launch-checklist.md
- docs/engineering/deployment-runbook.md
- docs/engineering/observability-plan.md
- docs/engineering/rollback-plan.md
- docs/engineering/env-vars.md
- docs/safety/privacy-and-retention.md
- docs/safety/data-request-runbook.md

本次必须输出或更新：
- docs/engineering/pilot-hardening-plan.md
- docs/research/pilot-ops-retrospective.md
- docs/reviews/<date> Reward Pilot稳定性加固验收报告.md
- 必要的代码、测试和文档修复

任务：
1. 加固部署和运行：环境变量模板、health check、日志最小化、错误记录和回滚说明。
2. 加固数据处理：数据请求处理时限、导出/删除/封存人工流程、account-level 与 family-linked 审计一致性。
3. 加固权限边界：parent / child / witness / admin 负向访问、ChildNote 默认私密、witness 不能看到证据、小票原文、金额、修复细节。
4. 加固移动端体验：关键路径窄屏截图、按钮可点区域、表单错误文案、长列表性能边界。
5. 加固运营流程：暂停新邀请机制、风险信号人工复核机制、每日观察节奏、退出测试处理闭环。

硬性边界：
- 只加固当前 Pilot 范围，不打开 V1 新功能。
- 不引入复杂监控 SDK，除非已经明确供应商和隐私边界。
- 不采集学校、精确位置、真实姓名、无关人脸、ChildNote 私密原文等非必要数据。

验收标准：
- Pilot 可以稳定扩大到下一小批家庭。
- 回滚、暂停邀请、数据请求、安全复核都有明确负责人和流程。
- 单测、typecheck、build、核心 E2E 通过。
- 新增的监控或日志不违反数据最小化原则。
```

### Prompt P12：V1 Scope Reopen

```text
你是 Reward 项目的 V1 范围重开评审负责人。

目标：
在 Alpha / Pilot 跑通并完成至少一轮反馈迭代后，基于真实数据和反馈重新评估 V1 范围，而不是凭想象扩功能。

必须先读取：
- docs/research/pilot-feedback-log.md
- docs/research/pilot-feedback-triage.md
- docs/research/pilot-ops-retrospective.md
- docs/analytics/mvp-metrics.md
- docs/analytics/event-taxonomy.md
- docs/product/product-freeze.md
- docs/product/pilot-non-goals.md
- docs/decisions/open-questions.md
- docs/source/extracted/prd-v2.1.md
- docs/source/extracted/18-questions-archive.md

本次必须输出：
- docs/product/v1-scope-candidates.md
- docs/product/v1-not-now.md
- docs/decisions/v1-scope-decisions.md
- docs/reviews/<date> Reward V1范围重开评审报告.md

任务：
1. 汇总 Pilot 证据：哪些主流程跑通、哪些家庭卡住、哪些反馈高频、哪些功能被用户主动请求、哪些能力仍然没有证据支持。
2. 重新评估 V1 候选：真实照片上传、真实推送、AI/Kimi 文案辅助、更完整见证人、低攀比灵感库、能力归档、时光邮局、多孩子 / 多家长、会员/Pro。
3. 每个候选都必须写：用户证据、解决的问题、数据和隐私影响、技术复杂度、运营复杂度、是否会破坏 Reward 的非控制原则、V1 / V2 / Later / 永久不做。
4. 更新 open questions：已关闭、继续观察、新增问题。
5. 产出 V1 推荐路线：必做、可做、暂缓、禁止。

硬性边界：
- 不因为“看起来高级”就加入 V1。
- 不默认打开真实 AI、真实照片、支付、排名、开放儿童社交、学校/机构场景。
- 涉及未成年人数据的新能力必须先写隐私和安全评审，再进入实现。

验收标准：
- V1 范围基于 Pilot 证据，而不是功能愿望清单。
- 每个候选都有明确取舍理由。
- 不再把 V2/Later 功能混入 V1。
- 输出可以直接用于下一轮 PRD 和开发计划。
```

### P9-P12 推荐执行顺序

```text
Alpha / Pilot 发布与迭代
29. Prompt P9：Pilot Launch & Controlled Test Ops
30. Prompt P10：Pilot Feedback Iteration
31. Prompt P11：Pilot Hardening
32. Prompt P12：V1 Scope Reopen
```

执行规则：

- P9 必须在真实测试家庭邀请前完成。
- P10 必须在收到第一批测试反馈后执行。
- P11 必须在扩大第二批测试家庭前执行。
- P12 必须在 Pilot 至少完成一轮反馈迭代后执行，不能提前打开 V1 范围。

如果这些文件还没有，先不要让 Codex 写业务代码。Reward 这个项目最怕的不是开发慢，而是过早写出一个“看起来能跑、但产品灵魂跑偏”的 App。
