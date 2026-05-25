# Reward Skill Plan

本文用途：规划 Reward 项目的 6 个专属 Codex Skills。Skills 不能替代源文档；每次使用都必须先读取 `AGENTS.md` 和对应 `docs/` 文档。

## Skills

| Skill | 用途 | 触发场景 | 必读文档 | 典型输出 |
|---|---|---|---|---|
| `reward-mvp-planner` | 控制 MVP 范围，防止把 V1/V2 做进首版 | 冻结范围、拆任务、判断功能归属 | `AGENTS.md`, `docs/product/product-freeze.md`, `docs/product/product-boundaries.md`, `docs/decisions/open-questions.md` | `docs/product/mvp-scope.md`, `docs/product/mvp-user-flows.md`, `docs/product/mvp-acceptance-criteria.md` |
| `reward-state-machine-designer` | 设计和校验契约、任务、兑现、修复状态机 | 状态设计、状态变更代码、状态测试 | `AGENTS.md`, `docs/engineering/state-machines.md`, `docs/product/product-freeze.md`, `docs/engineering/architecture.md` | 状态表、转换表、审计事件、TypeScript enum |
| `reward-data-modeler` | 把产品对象转成数据模型、Prisma、DTO、权限矩阵 | 建模、schema、seed、API DTO | `AGENTS.md`, `docs/engineering/data-model.md`, `docs/engineering/permissions-matrix.md`, `docs/safety/data-classification.md` | 数据模型、Prisma schema、DTO、权限矩阵 |
| `reward-privacy-safety-reviewer` | 检查儿童隐私、安全和产品边界 | 新功能评审、PR review、上线前审查 | `AGENTS.md`, `docs/product/product-boundaries.md`, `docs/safety/*`, `docs/analytics/event-taxonomy.md` | Blocking/Major/Minor/Required changes/Safe-to-merge |
| `reward-copywriter` | 生成或审查 Reward 文案语气 | 页面文案、错误文案、通知、访谈文本 | `AGENTS.md`, `docs/design/copywriting.md`, `docs/product/product-boundaries.md` | 文案建议、禁用词替换、端侧文案 |
| `reward-acceptance-tester` | 生成验收剧本、单元测试、E2E 和回归清单 | 测试计划、验收、PR 拆分 | `AGENTS.md`, `docs/engineering/testing-plan.md`, `docs/design/screen-spec.md`, `docs/safety/threat-model.md` | Given/When/Then 剧本、测试清单、验收结论 |

## Shared Boundaries

所有 Reward skills 必须遵守：

- 只做家庭端 MVP 小约定闭环。
- 不做学校/机构、支付托管、商家导购、视频监督、默认强锁、开放儿童社交、同校/班级数据池、抽卡式惊喜。
- AI 不裁判、不自动发送、不自动报警。
- ChildNote 默认孩子私密。
- 家长不能单方删除孩子努力记录。
- 已确认 Contract 不可覆盖，必须生成 ContractVersion。
- 关键写操作必须有 AuditLog。

## Usage Rule

当 skill 与源文档冲突时，以 `docs/product/product-freeze.md`、`docs/product/product-boundaries.md`、`docs/safety/data-classification.md` 和 `AGENTS.md` 为准。
