# Reward 开发资料目录

本文用途：作为 Reward 后续研发 Prompt 的资料入口。除非特别说明，后续任务应优先读取本文列出的稳定 Markdown 文档，不再直接读取 Downloads、docx 或 HTML 原型。

## 1. 必读入口

每个研发任务默认先读：

- `docs/product/product-freeze.md`
- `docs/product/product-boundaries.md`
- `docs/decisions/open-questions.md`

按任务类型追加读取：

| 任务类型 | 必读文档 |
|---|---|
| 技术选型/初始化 | `docs/decisions/technical-decisions.md`, `docs/engineering/architecture.md` |
| 状态机 | `docs/engineering/state-machines.md`, `docs/product/product-freeze.md` |
| 数据模型/权限 | `docs/engineering/data-model.md`, `docs/engineering/permissions-matrix.md`, `docs/safety/data-classification.md` |
| API | `docs/engineering/api-contract.md`, `docs/engineering/state-machines.md`, `docs/engineering/permissions-matrix.md` |
| 页面/交互 | `docs/design/screen-spec.md`, `docs/design/user-flows.md`, `docs/design/design-system.md` |
| 文案 | `docs/design/copywriting.md`, `docs/product/product-boundaries.md` |
| 隐私/儿童安全 | `docs/safety/data-classification.md`, `docs/safety/privacy-and-retention.md`, `docs/safety/child-safety-sop.md`, `docs/safety/threat-model.md` |
| 埋点/灰度 | `docs/analytics/event-taxonomy.md`, `docs/analytics/mvp-metrics.md`, `docs/research/pilot-plan.md` |
| 测试 | `docs/engineering/testing-plan.md`, `docs/safety/threat-model.md`, `docs/design/screen-spec.md` |

## 2. Canonical 文档

| 类别 | 文件 | 用途 |
|---|---|---|
| 原始资料索引 | `docs/source/originals/README.md` | 记录原始文件来源 |
| PRD 抽取版 | `docs/source/extracted/prd-v2.1.md` | PRD 稳定 Markdown 来源 |
| 18 问题抽取版 | `docs/source/extracted/18-questions-archive.md` | 产品边界和争议依据 |
| HTML 原型提炼 | `docs/source/extracted/html-prototype-notes.md` | 页面、交互、视觉方向依据 |
| 产品冻结 | `docs/product/product-freeze.md` | MVP 范围唯一产品真相 |
| 产品边界 | `docs/product/product-boundaries.md` | 长期不做和代码审查底线 |
| 产品决策 | `docs/decisions/product-decisions.md` | 关键产品选择及原因 |
| 技术决策 | `docs/decisions/technical-decisions.md` | ADR 风格技术选型 |
| 开放问题 | `docs/decisions/open-questions.md` | Blocking/Before Coding/Before Pilot/Later |
| 架构 | `docs/engineering/architecture.md` | 模块、数据流、Mock 边界 |
| 状态机 | `docs/engineering/state-machines.md` | Contract/Task/Fulfillment 等状态 |
| 数据模型 | `docs/engineering/data-model.md` | 核心实体和字段 |
| 权限矩阵 | `docs/engineering/permissions-matrix.md` | parent/child/witness/system 可见性 |
| API Contract | `docs/engineering/api-contract.md` | API/Server Action 约束 |
| 测试计划 | `docs/engineering/testing-plan.md` | unit/integration/e2e/safety 测试 |
| 页面规格 | `docs/design/screen-spec.md` | P01-P10 可实现规格 |
| 用户流程 | `docs/design/user-flows.md` | 主流程和异常流程 |
| 文案 | `docs/design/copywriting.md` | 产品语气、禁用词、替代表达 |
| 设计系统 | `docs/design/design-system.md` | token、组件、视觉边界 |
| 数据分级 | `docs/safety/data-classification.md` | A/B/C/D/E 数据权限和保留 |
| 隐私保留 | `docs/safety/privacy-and-retention.md` | 导出、删除、封存、照片最小化 |
| 儿童安全 SOP | `docs/safety/child-safety-sop.md` | L0-L5 风险和人工复核 |
| 威胁模型 | `docs/safety/threat-model.md` | 20 个隐私/安全/边界风险 |
| 指标 | `docs/analytics/mvp-metrics.md` | MVP 成败指标 |
| 事件字典 | `docs/analytics/event-taxonomy.md` | 埋点事件和禁止采集属性 |
| 灰度计划 | `docs/research/pilot-plan.md` | 10-20 组家庭测试方案 |
| 访谈脚本 | `docs/research/interview-script.md` | 家长/孩子访谈问题 |

## 3. 旧 Prompt 路径兼容

早期提示词会引用以下旧路径，现已保留为稳定入口：

- `docs/product/prd.md`：指向 `docs/source/extracted/prd-v2.1.md` 和产品冻结文档。
- `docs/product/18-questions-archive.md`：指向 `docs/source/extracted/18-questions-archive.md`。
- `docs/design/prototype-review.md`：指向 `docs/source/extracted/html-prototype-notes.md` 和设计规格。

后续新 Prompt 应优先使用 canonical 文档，不再复制原始资料。

## 4. 硬边界速查

- Reward 是家庭愿望契约系统，不是家长控制软件。
- 不做学校/机构、支付托管、商家导购、视频监督、默认强锁、开放儿童社交、同校/班级数据池、抽卡式惊喜。
- AI 只能建议、拆解、转译、提醒，不裁判、不自动发送、不替任何一方决定。
- 契约必须有状态机、版本记录和审计日志。
- 家长不能单方删除孩子努力记录。
- ChildNote / 树洞默认孩子私密。
- witness 默认弱权限，不看金额、证据、树洞、争议详情。

## 5. 下一步研发顺序

1. Prompt 2：创建 `AGENTS.md` 项目规则。
2. Prompt 3-9：创建 Reward Skills，或先跳过直接进入结构化前置文档复核。
3. Prompt 10：基于已冻结文档生成 MVP 范围兼容文档。
4. Prompt 11-14：复核/细化状态机、数据模型、API、测试计划。
5. Prompt 15：初始化技术项目，只搭壳，不做业务逻辑。
