# Reward 软件开发提示词文档

> 目标：把 Reward 项目的产品思路、MVP 边界、Codex 工作流与 Skill 建设方案，整理成一套可以直接复制给 Codex 的开发提示词。  
> 使用方式：每次只给 Codex 一个阶段任务，不要一次性让它“开发完整 App”。每条提示词都要求它读取指定文件、遵守边界、输出指定文档或代码，并给出验收标准。

---

## 0. 总原则

Reward 不是一个普通任务打卡软件，也不是家长控制软件。开发时必须始终遵守以下原则：

1. Reward 是**家庭愿望契约系统**。
2. 产品角色是：**家庭契约教练、温柔史官、协商主持人、孩子努力保护者**。
3. MVP 只做一个闭环：
   
   ```text
   家长创建家庭
   → 初始化奖池
   → 创建小约定
   → 孩子确认愿望
   → 孩子开始愿望番茄钟
   → 孩子提交复盘/轻证据
   → 家长确认兑现/延期/复盘
   → 生成亲子日记和愿望后院变化
   ```

4. 第一阶段不要做：学校路径、机构路径、商家导购、支付托管、视频监督、默认强锁、开放儿童社交、同校/班级数据池、抽卡式惊喜。
5. 所有契约必须有状态机和版本记录。
6. 家长不能单方删除孩子努力记录。
7. 孩子树洞/私密小纸条默认不可被家长查看。
8. AI 只做建议、拆解、转译和提醒，不能裁判、不能自动发送、不能替任何一方决定。

---

## 1. 推荐仓库结构

先让 Codex 创建或整理为以下结构：

```text
reward-app/
  AGENTS.md
  README.md
  docs/
    product/
      prd.md
      18-questions-archive.md
      mvp-scope.md
      user-flows.md
      product-boundaries.md
    design/
      screens.md
      copywriting.md
      design-system.md
      prototype-review.md
    engineering/
      architecture.md
      data-model.md
      api-contract.md
      permissions-matrix.md
      state-machines.md
      security-privacy.md
      testing-plan.md
    codex/
      task-prompts.md
      skill-plan.md
  .codex/
    skills/
      reward-mvp-planner/
      reward-state-machine-designer/
      reward-data-modeler/
      reward-privacy-safety-reviewer/
      reward-copywriter/
      reward-acceptance-tester/
  apps/
    web/
  packages/
    shared/
```

---

## 2. 启动前资料清单

请把以下资料放进仓库的 `docs/product/` 或 `docs/source/`：

```text
Reward_家庭愿望契约系统_完整PRD_v2.1.docx
Reward_18个问题逐条完整归档版.docx
reward_html_prototype.html
Reward_产品设计总纲与18问题完整归档.docx
```

如果 Codex 无法直接读取 docx，可先让它把 docx 转成 Markdown，再做梳理。

---

# 第一部分：项目初始化提示词

## Prompt 1：整理项目资料并生成开发资料目录

```text
你是 Reward 项目的研发准备助手。现在请先不要写业务代码。

目标：把现有产品资料整理成 Codex 后续开发可以稳定读取的文档结构。

请读取以下文件：
- docs/source/Reward_家庭愿望契约系统_完整PRD_v2.1.docx
- docs/source/Reward_18个问题逐条完整归档版.docx
- docs/source/reward_html_prototype.html

如果 docx 无法读取，请先把它们转换成 markdown 或纯文本。

请创建/更新以下文件：
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md
- docs/design/prototype-review.md

要求：
1. prd.md 只保留对开发有用的产品信息：定位、用户、角色、MVP、V1/V2、功能模块、数据边界。
2. 18-questions-archive.md 保留 18 个问题的完整归档，不要压缩成只有摘要。
3. product-boundaries.md 单独列出本项目长期不做清单。
4. prototype-review.md 从 HTML 原型中提取页面、交互和信息架构。

禁止：
- 不要开始实现前端页面。
- 不要自行新增学校、机构、商家导购、支付托管、视频监督、强锁、开放社交等功能。

完成标准：
- 上述 4 个文件存在。
- 每个文件开头有“本文用途”。
- product-boundaries.md 中明确写入长期不做清单。
- 你最后输出你整理出的文件列表和每个文件的作用。
```

---

## Prompt 2：创建 AGENTS.md 项目规则

```text
请在仓库根目录创建 AGENTS.md，用于约束 Codex 在 Reward 项目中的所有开发行为。

请先读取：
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md

AGENTS.md 要简短、准确、可执行，不要写成长篇产品宣言。

必须包含以下规则：
1. Reward 是家庭愿望契约系统，不是家长控制软件、学校管理系统、机构工具、奖励商城。
2. MVP 只做家庭端小约定闭环。
3. 禁止实现：支付托管、商品导购、视频监督、默认强锁、开放儿童社交、学校/机构路径、同校/班级数据池。
4. 所有契约相关数据必须有状态机、版本记录和审计日志。
5. 家长不能单方删除孩子努力记录。
6. 孩子树洞/私密内容默认不可被家长查看。
7. AI 只做建议、拆解、转译、提醒，不做裁判，不自动发送。
8. 开发任何新功能前，先检查 docs/product/product-boundaries.md。
9. 每次修改代码必须补充或说明测试。

同时补充：
- 推荐安装命令
- 本地运行命令
- 测试命令
- 代码风格要求
- PR/提交前检查清单

如果当前仓库还没有技术栈，请先用 TODO 占位，不要虚构已存在命令。

完成标准：
- 根目录存在 AGENTS.md。
- 文件不超过 120 行。
- 文件包含“Hard Product Boundaries”小节。
- 文件包含“Before Coding Checklist”小节。
```

---

# 第二部分：Skill 建设提示词

建议先建 6 个 Reward 专属 Skill。

| Skill | 用途 |
|---|---|
| reward-mvp-planner | 控制 MVP 范围，防止范围膨胀 |
| reward-state-machine-designer | 设计契约、任务、兑现、修复状态机 |
| reward-data-modeler | 生成数据模型、Prisma schema、DTO |
| reward-privacy-safety-reviewer | 检查儿童隐私、安全边界、不可建模清单 |
| reward-copywriter | 管理产品文案气质，避免审判/控制语气 |
| reward-acceptance-tester | 生成验收剧本和 E2E 测试 |

---

## Prompt 3：创建 Skill 总目录和 Skill 规划文件

```text
请为 Reward 项目创建 Codex Skills 目录结构。

请读取：
- AGENTS.md
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md

请创建：
- docs/codex/skill-plan.md
- .codex/skills/reward-mvp-planner/
- .codex/skills/reward-state-machine-designer/
- .codex/skills/reward-data-modeler/
- .codex/skills/reward-privacy-safety-reviewer/
- .codex/skills/reward-copywriter/
- .codex/skills/reward-acceptance-tester/

skill-plan.md 需要说明：
1. 每个 skill 的用途。
2. 什么情况下调用。
3. 读取哪些参考文件。
4. 输出哪些文件。
5. 它必须遵守哪些 Reward 产品边界。

本步骤只创建目录和 skill-plan.md，不要写代码。

完成标准：
- 6 个 skill 目录存在。
- skill-plan.md 写清楚每个 skill 的职责。
```

---

## Prompt 4：构建 `reward-mvp-planner` Skill

```text
请构建 .codex/skills/reward-mvp-planner/SKILL.md。

这个 Skill 的目标：
把 Reward 的完整产品设计压缩成可开发的 MVP 范围，防止 Codex 误做大而全产品。

请读取：
- AGENTS.md
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md

SKILL.md 必须包含：
1. Skill 名称和描述。
2. Reward 产品定位。
3. MVP 唯一核心闭环。
4. MVP 必做清单。
5. MVP 明确不做清单。
6. 输出格式要求。
7. 验收标准模板。

这个 Skill 被调用时，应该输出：
- docs/product/mvp-scope.md
- docs/product/mvp-user-flows.md
- docs/product/mvp-acceptance-criteria.md

MVP 必须包含：
- 家长注册/家庭创建
- 原则确认
- 简版奖池初始化
- 创建首个小约定
- 孩子确认愿望
- 愿望番茄钟
- 一句话复盘/轻证据
- 家长兑现/延期/复盘
- 亲子日记
- 愿望后院最小反馈
- 1 个免费纪念见证人占位

MVP 不得包含：
- 学校/机构
- 支付托管
- 商品导购
- 视频监督
- 默认强锁
- 开放儿童社交
- 同校/班级数据池
- 抽卡式惊喜

完成标准：
- SKILL.md 存在。
- 文件中有明确的“Required MVP Loop”和“Out of Scope”章节。
- 文件中包含调用时的输出模板。
```

---

## Prompt 5：构建 `reward-state-machine-designer` Skill

```text
请构建 .codex/skills/reward-state-machine-designer/SKILL.md。

这个 Skill 的目标：
设计和校验 Reward 中所有与家庭契约相关的状态机。

请读取：
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md

SKILL.md 必须包含：
1. 适用场景。
2. 必须考虑的状态机类型。
3. 状态机输出格式。
4. 角色权限检查。
5. 通知触发检查。
6. 不可逆状态检查。
7. TypeScript enum 输出要求。

必须覆盖这些状态机：
- Contract 契约状态机
- Task 任务状态机
- Fulfillment 兑现状态机
- RepairCase 约定修复状态机
- FamilyTrust 家庭契约信用状态机
- Archive / TimeCapsule 封存状态机

硬规则：
- 已确认契约不能被覆盖，只能生成新版本。
- 家长不能单方删除孩子努力记录。
- 孩子不能单方修改已确认契约。
- AI 不能裁判。
- 争议是修复，不是判案。
- 与孩子私密内容相关的状态必须默认保护孩子隐私。
- 不得引入学校、机构、托管、视频监督、默认强锁或儿童社交排名。

完成标准：
- SKILL.md 存在。
- 文件中提供状态机输出模板：状态列表、转换表、角色权限、通知、边界场景、验收标准、TypeScript enum。
```

---

## Prompt 6：构建 `reward-data-modeler` Skill

```text
请构建 .codex/skills/reward-data-modeler/SKILL.md。

这个 Skill 的目标：
把 Reward 的产品对象转化为数据库模型、Prisma schema、DTO 和 API 数据契约。

请读取：
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/engineering/state-machines.md 如果存在
- docs/product/product-boundaries.md

SKILL.md 必须要求每次建模时覆盖：
- User
- Family
- FamilyMember
- Role
- RewardPool
- Wish
- Contract
- ContractVersion
- Task
- FocusSession
- Evidence
- Fulfillment
- RepairCase
- Witness
- DiaryEntry
- ChildNote
- Notification
- AuditLog
- Membership

硬规则：
1. ContractVersion 必须存在，防止家长事后改规则。
2. AuditLog 必须存在，记录关键行为。
3. ChildNote 和 Evidence 必须分开。
4. ChildNote 默认孩子私密。
5. Evidence 按契约权限可见。
6. 删除优先设计为封存/软删除，不做单方硬删除。
7. 数据模型必须支持多家长、共同签署人、见证人权限。

调用该 Skill 时应输出：
- docs/engineering/data-model.md
- docs/engineering/permissions-matrix.md
- prisma/schema.prisma 或等价 schema 草案
- packages/shared/types.ts 或等价 DTO 草案

完成标准：
- SKILL.md 存在。
- 文件中包含建模 checklist。
- 文件中明确 ChildNote 与 Evidence 的区别。
```

---

## Prompt 7：构建 `reward-privacy-safety-reviewer` Skill

```text
请构建 .codex/skills/reward-privacy-safety-reviewer/SKILL.md。

这个 Skill 的目标：
每次开发新功能或评审 PR 时，检查是否违反 Reward 的儿童隐私、安全和产品边界。

请读取：
- AGENTS.md
- docs/product/product-boundaries.md
- docs/product/18-questions-archive.md

SKILL.md 必须包含以下检查项：
1. 是否出现学校/机构路径。
2. 是否出现支付托管、奖励钱包、资金池。
3. 是否出现商品导购、商家赞助、孩子端商业推荐。
4. 是否出现视频监督、全天候监控、默认强锁。
5. 是否出现开放儿童社交、排行榜、同校/班级数据池。
6. 是否让家长查看孩子树洞/私密小纸条。
7. 是否允许家长单方删除孩子努力记录。
8. 是否把基础照顾、爱、安全、尊严、医疗、睡眠建模成奖励或惩罚。
9. 是否让 AI 自动裁判、自动发送、自动报警。
10. 是否有必要的 AuditLog、权限判断和状态机。

该 Skill 输出格式：
- Summary
- Blocking issues
- Major concerns
- Minor suggestions
- Required changes
- Safe-to-merge verdict

完成标准：
- SKILL.md 存在。
- 文件中包含“不可建模清单”。
- 文件中包含 PR Review Checklist。
```

---

## Prompt 8：构建 `reward-copywriter` Skill

```text
请构建 .codex/skills/reward-copywriter/SKILL.md。

这个 Skill 的目标：
保证 Reward 的产品文案符合“家庭契约教练 + 温柔史官 + 协商主持人”的气质，避免审判、威胁、控制、羞辱。

请读取：
- docs/product/18-questions-archive.md
- docs/design/copywriting.md 如果存在
- docs/product/product-boundaries.md

SKILL.md 必须包含：
1. Reward 文案人格。
2. 家长端文案原则。
3. 孩子端文案原则。
4. 见证人端文案原则。
5. 约定修复文案原则。
6. 禁用词与替代表达。

禁用或慎用表达：
- 你违约了
- 孩子投诉你
- 家长失信
- 监督家长
- 锁住孩子
- 任务失败
- 你没有完成
- 系统判定你错了
- AI 判定
- 惩罚
- 执法

推荐表达：
- 这个约定正在等待回应
- 孩子已经提交完成记录
- 你的努力已经被记录下来了
- 如果今天不方便兑现，可以说明原因并设置新的兑现时间
- 这个愿望需要一起商量一下
- 我们先回到当初说好的规则
- 这段记录已经放进时间胶囊

调用该 Skill 时，应输出：
- 产品文案修改建议
- 替代表达
- 风险语气标注
- 最终可用文案

完成标准：
- SKILL.md 存在。
- 文件中包含 forbidden words 与 approved copy。
```

---

## Prompt 9：构建 `reward-acceptance-tester` Skill

```text
请构建 .codex/skills/reward-acceptance-tester/SKILL.md。

这个 Skill 的目标：
把 Reward 的产品需求转化为验收剧本、单元测试、E2E 测试和回归检查清单。

请读取：
- docs/product/mvp-scope.md
- docs/engineering/state-machines.md
- docs/engineering/data-model.md
- docs/product/18-questions-archive.md

必须覆盖 5 个验收剧本：
1. 正常家庭：孩子完成任务，家长兑现。
2. 延期家庭：孩子完成，家长设置延期。
3. 单方加码：孩子完成后，家长想临时提高标准，系统阻止。
4. 证据争议：孩子提交照片，家长认为不完整，进入约定修复。
5. 树洞隐私：孩子写私密小纸条，家长不能查看。

输出格式必须包含：
- Given 初始状态
- When 用户操作
- Then 状态变化
- And 谁可以看到什么
- And 谁不能做什么
- Expected notification
- Expected audit log

调用该 Skill 时应输出：
- docs/engineering/testing-plan.md
- tests/e2e/contract-flow.spec.ts
- tests/e2e/privacy-boundary.spec.ts
- tests/e2e/fulfillment-flow.spec.ts

完成标准：
- SKILL.md 存在。
- 文件中有测试剧本模板。
- 文件中要求每个测试必须验证权限边界。
```

---

# 第三部分：开发前置文档提示词

## Prompt 10：冻结 MVP 范围

```text
请使用 reward-mvp-planner Skill，生成 Reward MVP 开发范围文档。

请读取：
- AGENTS.md
- docs/product/prd.md
- docs/product/18-questions-archive.md
- docs/product/product-boundaries.md
- docs/design/prototype-review.md

请输出：
- docs/product/mvp-scope.md
- docs/product/mvp-user-flows.md
- docs/product/mvp-acceptance-criteria.md

mvp-scope.md 必须包含：
1. MVP 唯一目标。
2. MVP 用户角色。
3. MVP 必做功能。
4. MVP 不做功能。
5. MVP 十个核心页面。
6. MVP 成功指标。
7. MVP 验收标准。

MVP 必须做：
- 家长注册/创建家庭
- 原则确认
- 简版奖池初始化
- 创建首个小约定
- 孩子确认愿望
- 愿望番茄钟
- 提交复盘/轻证据
- 家长回应：已兑现/延期/待复盘
- 亲子日记
- 愿望后院最小反馈

MVP 不做：
- 学校/机构
- 支付托管
- 商品导购
- 视频监督
- 默认强锁
- 开放儿童社交
- 同校/班级数据池
- 完整 AI
- 完整见证人系统
- 完整约定修复中心

完成标准：
- 3 个文件生成。
- 每个文件有清晰的 Done When。
- 最后输出 MVP 范围摘要和不做清单。
```

---

## Prompt 11：设计状态机

```text
请使用 reward-state-machine-designer Skill，设计 Reward MVP/V1 状态机。

请读取：
- AGENTS.md
- docs/product/mvp-scope.md
- docs/product/18-questions-archive.md

请输出：
- docs/engineering/state-machines.md
- docs/engineering/state-transition-table.md
- packages/shared/state-machine.ts

必须设计：
1. Contract 契约状态机
2. Task 任务状态机
3. Fulfillment 兑现状态机
4. RepairCase 约定修复状态机
5. FamilyTrust 家庭信用状态机
6. Archive/TimeCapsule 封存状态机

每个状态机必须包含：
- State list
- Transition table
- Allowed actors
- Forbidden transitions
- Notification triggers
- Audit log requirements
- Edge cases
- TypeScript enum
- Acceptance criteria

硬规则：
- 已确认契约不能被覆盖，只能创建 ContractVersion。
- 家长不能单方删除孩子努力记录。
- 孩子不能单方修改已确认契约。
- AI 不能裁判。
- 争议只能修复，不能判案。

完成标准：
- state-machines.md 可被产品和研发共同阅读。
- state-machine.ts 包含所有 enum 和基础 transition 类型。
- 输出 3 个最容易出错的状态边界。
```

---

## Prompt 12：建立数据模型与权限矩阵

```text
请使用 reward-data-modeler Skill，建立 Reward MVP 数据模型和权限矩阵。

请读取：
- docs/product/mvp-scope.md
- docs/engineering/state-machines.md
- docs/product/18-questions-archive.md

请输出：
- docs/engineering/data-model.md
- docs/engineering/permissions-matrix.md
- prisma/schema.prisma
- packages/shared/types.ts

必须包含这些对象：
- User
- Family
- FamilyMember
- RewardPool
- Wish
- Contract
- ContractVersion
- Task
- FocusSession
- Evidence
- Fulfillment
- RepairCase
- Witness
- DiaryEntry
- ChildNote
- Notification
- AuditLog
- Membership

重点要求：
1. ContractVersion 必须存在。
2. AuditLog 必须存在。
3. ChildNote 和 Evidence 必须分开。
4. ChildNote 默认孩子私密。
5. Evidence 按契约权限可见。
6. 所有删除先做 soft delete / archive。
7. 多家长、共同签署人、见证人要有角色模型。

权限矩阵必须回答：
- 谁可以查看契约？
- 谁可以修改契约草稿？
- 谁可以确认契约？
- 谁可以查看证据？
- 谁可以查看树洞？
- 谁可以发起约定修复？
- 谁可以封存记录？
- 谁可以导出数据？

完成标准：
- Prisma schema 可以通过格式化。
- types.ts 和 schema 字段命名一致。
- permissions-matrix.md 明确“家长不能查看 ChildNote 默认内容”。
```

---

## Prompt 13：设计 API Contract

```text
请基于已有数据模型和状态机，设计 Reward MVP API Contract。

请读取：
- docs/engineering/data-model.md
- docs/engineering/state-machines.md
- docs/engineering/permissions-matrix.md
- docs/product/mvp-user-flows.md

请输出：
- docs/engineering/api-contract.md
- packages/shared/api-types.ts

API 至少覆盖：
1. Auth / 当前用户身份模拟
2. Family 创建和成员邀请
3. RewardPool 初始化
4. Wish 选择
5. Contract 创建、确认、查看
6. Task 开始、提交、查看
7. FocusSession 开始、完成、中途退出
8. Evidence 提交
9. Fulfillment 已兑现/延期/待复盘
10. DiaryEntry 生成和查看
11. ChildNote 创建和查看
12. Witness 纪念见证邀请占位
13. Notification 读取
14. AuditLog 写入

每个接口必须写：
- Method
- Path
- Request DTO
- Response DTO
- Required role
- Permission checks
- State transition
- Audit log
- Error cases

禁止：
- 不要设计支付、学校、机构、商品导购、视频监督、开放社交接口。

完成标准：
- api-contract.md 能直接指导 Next API Routes 或后端服务实现。
- api-types.ts 只包含类型，不写业务逻辑。
```

---

## Prompt 14：建立测试计划

```text
请使用 reward-acceptance-tester Skill，建立 Reward MVP 测试计划。

请读取：
- docs/product/mvp-acceptance-criteria.md
- docs/engineering/state-machines.md
- docs/engineering/permissions-matrix.md
- docs/engineering/api-contract.md

请输出：
- docs/engineering/testing-plan.md
- tests/e2e/contract-flow.spec.ts
- tests/e2e/fulfillment-flow.spec.ts
- tests/e2e/privacy-boundary.spec.ts

必须覆盖以下剧本：
1. 正常家庭：孩子完成任务，家长兑现。
2. 延期家庭：孩子完成，家长设置延期。
3. 单方加码：孩子完成后，家长想临时提高标准，系统阻止。
4. 证据争议：孩子提交照片，家长认为不完整，进入待复盘。
5. 树洞隐私：孩子写私密小纸条，家长不能查看。

每个测试必须验证：
- 状态是否正确变化。
- 权限是否正确。
- 通知是否正确。
- 审计日志是否写入。
- 禁止行为是否被阻止。

完成标准：
- testing-plan.md 包含 Given/When/Then 剧本。
- E2E 测试文件存在，哪怕先用 TODO 或 mock。
```

---

# 第四部分：软件开发实施提示词

## Prompt 15：初始化技术项目

```text
请初始化 Reward MVP Web/PWA 项目。

请读取：
- AGENTS.md
- docs/product/mvp-scope.md
- docs/engineering/data-model.md
- docs/engineering/api-contract.md

建议技术栈：
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL 或 SQLite 本地开发
- Playwright 或 Vitest

如果当前仓库已有技术栈，请遵循现有技术栈，不要强行替换。

请完成：
1. 创建 apps/web。
2. 配置 TypeScript。
3. 配置 Tailwind。
4. 配置基础路由。
5. 配置 Prisma。
6. 创建 packages/shared。
7. 建立 lint/test 脚本。
8. 更新 README.md。

不要实现复杂业务逻辑。
不要接真实 AI。
不要接支付。
不要接学校/机构。

完成标准：
- npm/pnpm install 成功。
- dev server 可以启动。
- lint/test 命令存在。
- README.md 写明启动方式。
```

---

## Prompt 16：实现基础数据模型和 Seed 数据

```text
请实现 Reward MVP 的基础数据模型和 seed 数据。

请读取：
- docs/engineering/data-model.md
- docs/engineering/permissions-matrix.md
- prisma/schema.prisma

请完成：
1. 完成 Prisma schema。
2. 创建迁移。
3. 创建 seed 脚本。
4. seed 包含 1 个家庭、1 个家长、1 个孩子、1 个小愿望、1 个契约草稿、1 个孩子私密小纸条。
5. 创建基础 repository 或 service 层。

必须确保：
- ContractVersion 存在。
- AuditLog 存在。
- ChildNote 和 Evidence 分开。
- ChildNote 默认不可被家长读取。

完成标准：
- 数据库迁移成功。
- seed 成功。
- 运行测试或至少脚本验证数据存在。
```

---

## Prompt 17：实现角色切换和权限检查基础层

```text
请实现 Reward MVP 的角色和权限检查基础层。

请读取：
- docs/engineering/permissions-matrix.md
- docs/engineering/data-model.md
- AGENTS.md

MVP 可以先用 mock auth / role switcher，不必接真实登录。

请完成：
1. 创建当前用户上下文。
2. 支持切换角色：parent、child、witness。
3. 实现 canViewContract、canEditContractDraft、canViewEvidence、canViewChildNote、canCreateFulfillment 等基础权限函数。
4. 每个权限函数写单元测试。
5. 在页面上显示当前角色。

硬规则：
- parent 默认不能查看 child 的 ChildNote。
- witness 只能看摘要，不能看证据和金额。
- child 不能修改已确认契约。

完成标准：
- 权限函数有测试。
- UI 可以模拟家长/孩子/见证人视角。
```

---

## Prompt 18：实现家长端 Onboarding

```text
请实现 Reward MVP 的家长端 onboarding。

请读取：
- docs/product/mvp-user-flows.md
- docs/design/copywriting.md 如果存在
- docs/product/product-boundaries.md

页面包括：
1. 欢迎页
2. 家庭创建页
3. 原则确认页
4. 奖池初始化页

原则确认必须包含：
- 签约后不能单方修改验收标准。
- 孩子完成约定后，应兑现或协商延期。
- 基础照顾、爱、陪伴和安全不能作为奖励或惩罚。
- 本 App 不是控制孩子的工具，而是帮助家庭建立清楚规则。
- 孩子有权对不公平的约定提出反馈。

奖池初始化必须包含：
- 小任务奖励投入
- 中任务奖励投入
- 大任务奖励投入
- 禁止奖励类型

完成标准：
- 家长可以完成 onboarding。
- 完成后生成 RewardPool。
- 未完成原则确认不能创建正式契约。
- 文案不得出现“监督家长”“锁住孩子”“惩罚”等词。
```

---

## Prompt 19：实现首个小约定创建流程

```text
请实现 Reward MVP 的首个小约定创建流程。

请读取：
- docs/product/mvp-scope.md
- docs/engineering/state-machines.md
- docs/engineering/data-model.md
- docs/design/copywriting.md 如果存在

页面包括：
1. 创建小约定页
2. 契约预览页
3. 孩子确认页

默认模板：
- 愿望：从小愿望池选择
- 任务：完成 1 个 25 分钟愿望番茄钟
- 证据：番茄钟 + 一句话复盘
- 奖励：小愿望池奖励
- 兑现时间：当天或 24 小时内
- 补救：可重新开始 1 次

必须实现：
- Contract 创建
- ContractVersion 创建
- Contract 状态从 draft 到 pending_confirmation 到 active
- AuditLog 写入

禁止：
- 不要支持大愿望复杂契约。
- 不要支持支付。
- 不要支持学校/机构/商家。

完成标准：
- 家长可以创建首个小约定。
- 孩子确认后契约进入 active。
- 修改契约时创建新版本，不覆盖原版本。
```

---

## Prompt 20：实现孩子端愿望后院和愿望番茄钟

```text
请实现 Reward MVP 的孩子端愿望后院和愿望番茄钟。

请读取：
- docs/product/mvp-user-flows.md
- docs/design/prototype-review.md
- docs/engineering/state-machines.md
- docs/design/copywriting.md 如果存在

页面包括：
1. 孩子愿望后院首页
2. 当前愿望卡片
3. 愿望番茄钟页
4. 中途退出原因弹窗
5. 完成复盘页
6. 猫猫来访/纪念卡最小反馈

要求：
- 孩子必须主动点击“开始守约”。
- 番茄钟可以先用较短时间调试，但产品文案显示 25 分钟。
- 中途退出必须填写或选择原因。
- 完成后提交一句复盘。
- 完成后 Task 状态更新，FocusSession 写入，Evidence/复盘写入。
- 愿望后院出现“安静猫来了”的最小反馈。

禁止：
- 不要做强锁。
- 不要做视频。
- 不要做排行榜。
- 不要做抽卡。

完成标准：
- 孩子能完成一次愿望番茄钟。
- 家长端能看到任务已达成。
- 亲子日记生成所需数据完整。
```

---

## Prompt 21：实现家长兑现回应和亲子日记

```text
请实现 Reward MVP 的家长兑现回应和亲子日记。

请读取：
- docs/engineering/state-machines.md
- docs/engineering/api-contract.md
- docs/design/copywriting.md 如果存在

页面包括：
1. 家长首页待回应卡片
2. 兑现回应页
3. 延期说明页
4. 待复盘入口
5. 亲子日记页

家长回应选项：
- 已兑现
- 需要延期
- 需要一起复盘

延期必须填写：
- 原因
- 新兑现时间

亲子日记必须包含：
- 愿望
- 任务
- 孩子复盘
- 家长回应
- 完成时间
- 安静猫来访文案

文案要求：
- 不说“你违约了”。
- 使用“这个约定正在等待回应”。
- 使用“如果今天不方便兑现，可以说明原因并设置新的兑现时间”。

完成标准：
- 孩子完成后，家长首页出现待回应。
- 家长选择已兑现后，Contract/Fulfillment 状态正确变化。
- 系统生成 DiaryEntry。
- 选择延期后进入 delayed 状态并记录新时间。
- 选择复盘后进入 pending_repair 或 equivalent 状态。
```

---

## Prompt 22：实现孩子小纸条/树洞最小版本

```text
请实现孩子端私密小纸条的 MVP 版本。

请读取：
- docs/engineering/permissions-matrix.md
- docs/engineering/data-model.md
- docs/product/18-questions-archive.md 中问题 2、问题 11

功能要求：
1. 孩子可以写一条“写给自己的小纸条”。
2. 小纸条保存为 ChildNote。
3. 默认只有孩子可以查看。
4. 家长端不能看到 ChildNote 内容。
5. 平台/管理员视角暂不做前台页面。
6. 不做 AI 分析，不做风险提示，只保留字段预留。

必须写测试：
- child 可以读取自己的 ChildNote。
- parent 不能读取 ChildNote。
- witness 不能读取 ChildNote。

完成标准：
- UI 可以创建和查看孩子自己的小纸条。
- 权限测试通过。
```

---

## Prompt 23：实现免费 1 个纪念见证人占位

```text
请实现 Reward MVP 的 1 个免费纪念见证人占位功能。

请读取：
- docs/product/18-questions-archive.md 中问题 9
- docs/engineering/permissions-matrix.md
- docs/engineering/data-model.md

MVP 只做纪念见证人，不做提醒见证人、协商见证人、裁定见证人。

功能要求：
1. 家长可以生成一个见证人邀请链接或邀请码。
2. 见证人只能查看契约摘要和完成纪念。
3. 见证人不能查看奖励金额、证据、树洞、争议详情。
4. 见证人可以发送一句祝福。

完成标准：
- witness 角色登录/切换后，只看到摘要。
- 权限测试证明 witness 不能访问 Evidence 和 ChildNote。
- UI 文案明确“只见证，不裁判”。
```

---

## Prompt 24：进行隐私与产品边界审查

```text
请使用 reward-privacy-safety-reviewer Skill，对当前 Reward MVP 代码和文档做一次隐私、安全和产品边界审查。

请读取：
- AGENTS.md
- docs/product/product-boundaries.md
- docs/engineering/permissions-matrix.md
- 当前代码

请检查：
1. 是否出现学校/机构路径。
2. 是否出现支付托管/钱包。
3. 是否出现商品导购/商家推荐。
4. 是否出现视频监督/强锁。
5. 是否出现开放儿童社交/排行榜。
6. 家长是否能看到 ChildNote。
7. 家长是否能单方删除孩子努力记录。
8. 是否存在基础照顾被建模为奖励/惩罚。
9. AI 是否被设计成裁判。
10. 是否缺少 AuditLog。

请输出：
- Blocking issues
- Major concerns
- Minor suggestions
- Required changes
- Safe-to-merge verdict

如果发现阻断问题，请不要修复代码，先输出修复计划，等待确认。
```

---

## Prompt 25：完成 MVP Demo 验收

```text
请使用 reward-acceptance-tester Skill，对当前 Reward MVP 做完整验收。

请读取：
- docs/engineering/testing-plan.md
- docs/product/mvp-acceptance-criteria.md
- 当前代码

请运行或补齐以下测试：
1. 正常家庭：孩子完成任务，家长兑现，生成亲子日记。
2. 延期家庭：孩子完成，家长设置延期。
3. 单方加码：家长想修改已确认契约，系统必须阻止或生成新版本。
4. 证据争议：任务进入待复盘。
5. 树洞隐私：家长不能查看孩子私密小纸条。

请输出：
- 测试命令
- 测试结果
- 失败用例
- 修复建议
- MVP 是否达到 demo 标准

Demo 标准：
一个家庭能在 5 分钟内创建第一个小约定，并在当天完成、确认、兑现、留下纪念。
```

---

# 第五部分：常用纠偏提示词

## Prompt 26：当 Codex 做偏了，要求它回到产品边界

```text
你当前的实现偏离了 Reward 产品边界。

请立刻停止继续编码，重新读取：
- AGENTS.md
- docs/product/product-boundaries.md
- docs/product/mvp-scope.md

请检查你刚才的方案是否违反以下边界：
- 学校/机构路径
- 支付托管/奖励钱包
- 商品导购/商家推荐
- 视频监督/默认强锁
- 开放儿童社交/排行榜
- 同校/班级数据池
- 家长查看孩子树洞
- 家长单方删除孩子努力记录
- AI 裁判/自动发送

请输出：
1. 违反了哪些边界。
2. 为什么违反。
3. 如何改回 MVP 范围。
4. 哪些代码需要撤回或重写。

在我确认之前，不要继续写代码。
```

---

## Prompt 27：让 Codex 把某个大任务拆成小 PR

```text
请把这个任务拆成 3-6 个小 PR，不要一次性实现。

任务：<填写任务名称>

请读取：
- docs/product/mvp-scope.md
- docs/engineering/state-machines.md
- docs/engineering/data-model.md
- docs/engineering/testing-plan.md

每个 PR 必须包含：
- PR 名称
- 目标
- 涉及文件
- 不做什么
- 验收标准
- 测试要求
- 风险点

拆分原则：
1. 每个 PR 都可以独立 review。
2. 每个 PR 不超过一个主要业务主题。
3. 先模型和状态机，再页面，再联调，再测试。
4. 涉及权限和隐私的 PR 必须先写测试。
```

---

## Prompt 28：让 Codex 做代码审查

```text
请对当前改动做一次 Reward 项目代码审查。

请读取：
- AGENTS.md
- docs/product/product-boundaries.md
- docs/engineering/permissions-matrix.md
- docs/engineering/state-machines.md

请按以下维度审查：
1. 是否符合 MVP 范围。
2. 是否违反长期不做清单。
3. 状态机是否正确。
4. 权限是否正确。
5. 是否有审计日志。
6. 是否保护 ChildNote 隐私。
7. 文案是否符合温柔史官语气。
8. 是否有测试。
9. 是否有潜在数据删除风险。
10. 是否有后续迁移风险。

输出格式：
- Summary
- Blocking issues
- Major issues
- Minor issues
- Suggested tests
- Merge verdict
```

---

# 第六部分：建议启动顺序

建议按以下顺序让 Codex 执行：

```text
1. Prompt 1：整理项目资料
2. Prompt 2：创建 AGENTS.md
3. Prompt 3-9：创建 6 个 Reward Skills
4. Prompt 10：冻结 MVP 范围
5. Prompt 11：设计状态机
6. Prompt 12：建立数据模型与权限矩阵
7. Prompt 13：设计 API Contract
8. Prompt 14：建立测试计划
9. Prompt 15：初始化技术项目
10. Prompt 16：实现数据模型和 seed
11. Prompt 17：实现角色/权限
12. Prompt 18：家长端 onboarding
13. Prompt 19：首个小约定
14. Prompt 20：孩子端愿望番茄钟
15. Prompt 21：家长兑现与亲子日记
16. Prompt 22：孩子小纸条/树洞最小版
17. Prompt 23：纪念见证人占位
18. Prompt 24：隐私与边界审查
19. Prompt 25：MVP Demo 验收
```

---

## 最终验收标准

当以下事项全部满足时，才算 Reward MVP 可以进入第一轮真实家庭测试：

1. 家长能完成创建家庭、原则确认、奖池初始化。
2. 家长能创建首个小约定。
3. 孩子能确认愿望并开始愿望番茄钟。
4. 孩子能提交一句复盘。
5. 家长能选择已兑现、延期或待复盘。
6. 系统能生成亲子日记。
7. 愿望后院能出现最小反馈，例如“安静猫来了”。
8. 家长不能查看孩子私密小纸条。
9. 已确认契约不能被覆盖，只能生成新版本。
10. 所有关键操作有 AuditLog。
11. 没有学校/机构/商家/托管/视频/强锁/开放社交功能。
12. 5 个验收剧本通过。

---

## 一句话提醒

**不要让 Codex 开发“完整产品”。先让它把 Reward 的灵魂变成一个可运行的小闭环。**
