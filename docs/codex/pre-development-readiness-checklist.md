# Reward 开发前准备工作确认表

本文用途：作为 Reward 项目进入代码开发前的检查清单。它回答“除了完善提示词方案，还有哪些前期准备要先做”。

## 当前材料状态

已具备：

- `Reward_Codex软件开发提示词文档.md`：已有完整分阶段提示词雏形。
- `Reward_家庭愿望契约系统_完整PRD_v2.1.docx`：产品定位、MVP、V1/V2、风险、数据、商业化较完整。
- `Reward_18个问题逐条完整归档版.docx`：关键产品争议和边界已有归档。
- `reward_html_prototype.html`：已有信息架构和视觉方向原型。

当前状态：

- 仓库内已有稳定文档结构。
- 原始 docx 已转换为后续任务可稳定读取的 Markdown。
- 技术栈、隐私策略、指标埋点、灰度测试、法务审查计划已形成开发前冻结文档。

## 开发前必须做

### 1. 资料入库

把资料放进仓库，建议结构：

```text
docs/source/originals/
docs/source/extracted/
```

要做：

- 保存原始文件或记录原始绝对路径。
- 将 PRD 和 18 问题归档转换为 Markdown。
- 将 HTML 原型提炼为页面规格，不直接把整份 HTML 当研发需求。

完成标准：

- 后续任何 Prompt 只读取仓库内文件，不再读取 Downloads。

### 2. 产品冻结

要产出：

```text
docs/product/product-freeze.md
docs/product/product-boundaries.md
docs/decisions/open-questions.md
docs/decisions/product-decisions.md
```

必须冻结：

- MVP 唯一闭环。
- MVP 十个页面。
- MVP 必做 / 不做。
- V1 / V2 / 永久不做。
- AI 能力边界。
- ChildNote / Evidence / DiaryEntry / AuditLog 的产品定义。

完成标准：

- 任何新功能都能判断是 MVP、V1、V2，还是禁止。

### 3. 技术决策

要产出：

```text
docs/decisions/technical-decisions.md
docs/engineering/architecture.md
```

必须确认：

- MVP 平台：Web/PWA、移动端壳或原生 App。
- 前端框架和样式方案。
- 数据库和 ORM。
- 登录：mock role switcher 还是真实登录。
- 通知：站内模拟还是真推送。
- 照片证据：mock、本地、对象存储。
- AI：不接、mock、还是真实服务。
- 部署环境。

建议：

- 第一轮 Demo 先用 Web/PWA + mock role switcher + 站内通知 + mock AI，先验证闭环。
- 不要因为接真实登录、推送、AI、对象存储拖慢产品验证。

### 4. 隐私和安全

要产出：

```text
docs/safety/data-classification.md
docs/safety/privacy-and-retention.md
docs/safety/child-safety-sop.md
docs/safety/threat-model.md
```

必须确认：

- A 低敏展示数据。
- B 契约执行数据。
- C 结果证据数据。
- D 孩子个人表达。
- E 风险保护数据。
- 家长默认不能看 D 类数据。
- 见证人默认只看摘要和完成纪念。
- 任何关键写操作都有 AuditLog。
- 删除默认是隐藏、封存、共同删除或依法删除，不做家长单方硬删。

正式上线前：

- 需要目标市场的隐私政策、用户协议、儿童数据处理和试用告知文本的专业审查。

### 5. 设计规格

要产出：

```text
docs/design/screen-spec.md
docs/design/user-flows.md
docs/design/copywriting.md
docs/design/design-system.md
```

必须覆盖：

- P01 家长欢迎页。
- P02 原则确认页。
- P03 奖池初始化页。
- P04 创建首个小约定页。
- P05 孩子邀请页。
- P06 孩子愿望后院首页。
- P07 愿望番茄钟页。
- P08 完成提交页。
- P09 家长兑现提醒页。
- P10 亲子日记页。

每页要有：

- 页面目标。
- 入口/出口。
- 默认状态。
- 空状态。
- 错误状态。
- 权限不足状态。
- 按钮和文案。
- 验收标准。

### 6. 测试与指标

要产出：

```text
docs/engineering/testing-plan.md
docs/analytics/mvp-metrics.md
docs/analytics/event-taxonomy.md
docs/research/pilot-plan.md
docs/research/interview-script.md
```

MVP 指标：

- 首次设置完成率。
- 首个小约定创建率。
- 孩子开始守约率。
- 首个约定完成率。
- 家长回应率。
- 亲子日记生成率。
- 第二个约定创建率。
- 7 日家庭留存率。

关键验收剧本：

- 正常家庭：孩子完成任务，家长兑现。
- 延期家庭：孩子完成，家长设置延期。
- 单方加码：家长临时提高标准，系统阻止或要求新版本。
- 证据争议：进入约定修复，不判案。
- 树洞隐私：家长和见证人不能查看 ChildNote。

反向验收：

- 不能创建基础照顾条件化契约。
- 不能出现支付托管接口。
- 不能出现学校/机构路径。
- 不能出现视频监督/强锁主链路。
- 不能出现开放儿童社交、排行榜、抽卡语言。

## 建议的第一批 Codex 任务

建议不要直接让 Codex 开始写 App。第一批任务应该是文档和冻结任务：

1. 原始资料入库与转换。
2. 产品冻结与开放问题清单。
3. AGENTS.md 项目规则。
4. 技术决策记录。
5. 隐私、安全与数据治理文档。
6. 设计规格与页面状态表。
7. 状态机、数据模型、权限矩阵。
8. API Contract 和测试计划。

之后再进入技术项目初始化。

## Go / No-Go

可以开始代码开发的条件：

- `product-freeze.md` 存在。
- `technical-decisions.md` 存在。
- `data-classification.md` 存在。
- `screen-spec.md` 存在。
- `state-machines.md` 存在。
- `data-model.md` 存在。
- `permissions-matrix.md` 存在。
- `api-contract.md` 存在。
- `testing-plan.md` 存在。

暂不建议开始代码开发的情况：

- 还没决定 Web/PWA 还是移动端。
- ChildNote / Evidence 权限没写清。
- 契约状态机没定。
- 家长删除/封存/导出策略没定。
- 证据照片和儿童隐私策略没定。
- 仍想把学校、机构、托管、导购、强锁、视频、社交塞进 MVP。
