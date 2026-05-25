# Reward 技术决策记录

本文用途：冻结 Reward MVP 的技术栈、运行方式和关键工程约束。后续初始化项目、写 AGENTS.md、数据模型、状态机、API、测试与部署配置，都以本文为准。

来源依据：

- `docs/product/product-freeze.md`
- `docs/product/product-boundaries.md`
- `docs/source/extracted/html-prototype-notes.md`
- `docs/decisions/open-questions.md`

## ADR-001 平台形态：Web/PWA 首版

选择：MVP 采用 Web/PWA，使用响应式页面覆盖家长端、孩子端、见证人占位端。

不选择：

- 不做纯原生 iOS / Android。
- 不做移动端壳作为首版必需项。
- 不接手表、定位、后台常驻能力。

原因：

- MVP 只验证首个家庭小约定闭环，Web/PWA 能最快完成 10 页原型到可用 Demo。
- 家长、孩子、见证人都可通过链接进入，适合邀请和演示。
- 产品边界明确不做强锁、视频监督、实时定位，因此不需要原生端权限作为首版依赖。

限制：

- PWA 对系统级推送、后台计时、相册/相机权限的体验不如原生。
- 首版计时以页面内计时和服务端状态为准，不承诺后台常驻精度。

后续可迁移路径：

- 保持 API、domain、permission、persistence 与 UI 解耦。
- V1 可封装为移动端壳。
- V2 如评估设备接入，必须先通过产品边界和隐私安全审查。

## ADR-002 前端框架：Next.js + TypeScript

选择：使用 Next.js App Router + TypeScript。

不选择：

- 不使用纯静态 HTML 作为产品代码。
- 不使用多端重型框架作为 MVP 基座。
- 不在首版拆分独立前后端仓库。

原因：

- Next.js 能同时承载页面、Server Actions/API routes、PWA 配置和 Demo 部署。
- TypeScript 能把角色、状态机、权限、DTO、事件枚举约束提前暴露。
- 10 个 MVP 页面存在清晰流程，适合用 App Router 做 route 分组。

后续可迁移路径：

- 若后续需要独立后端，可把 domain、repositories、DTO 提取到 packages。
- 若需要原生端，复用 API contract、domain 类型和权限矩阵。

## ADR-003 样式方案：Tailwind CSS + 轻量设计 Token

选择：Tailwind CSS + CSS variables 管理颜色、间距、圆角、阴影、语义状态。

不选择：

- 不引入大型企业组件库作为视觉主导。
- 不直接照搬 HTML 原型的样式结构。
- 不使用高刺激游戏化 UI 框架。

原因：

- 原型视觉方向是暖萌、低刺激、纸感手账，需要较高定制性。
- Tailwind 便于快速搭建响应式页面和状态变体。
- CSS variables 方便未来主题、孩子端愿望后院和无障碍色彩调整。

后续可迁移路径：

- Prompt 0E 输出 design-system 后，把 token 固化到 `app/globals.css` 或 `packages/ui/tokens`。
- 若组件增多，再抽出 `packages/ui`，但 MVP 初期不提前过度抽象。

## ADR-004 状态管理：Server State 优先，局部 UI State 最小化

选择：

- 服务端数据通过 Server Components / Server Actions / API routes 获取。
- 表单和页面局部交互使用 React state。
- 跨页面业务状态以数据库和 domain 状态机为准。

不选择：

- 不引入 Redux、MobX、Zustand 作为默认全局业务状态。
- 不把 Contract 状态放在前端全局 store 中作为真相。

原因：

- Reward 的核心风险在状态、权限和审计，唯一真相必须在 domain + persistence。
- MVP 流程短，前端全局状态会增加同步复杂度。

后续可迁移路径：

- 若出现复杂客户端缓存，可引入 TanStack Query 管理 server state。
- 若孩子端愿望后院出现复杂动画状态，可局部引入轻量 store，不承载合同状态。

## ADR-005 数据库：开发 SQLite，生产预留 PostgreSQL

选择：本地开发和 MVP Demo 使用 SQLite；schema 命名、索引和关系保持 PostgreSQL 兼容。

不选择：

- 不在 MVP 本地开发强依赖远程 PostgreSQL。
- 不使用浏览器 LocalStorage 作为业务真相。
- 不使用无 schema 文档库作为首版主库。

原因：

- SQLite 降低本地开发和 Demo 门槛。
- Reward 需要清晰关系模型：Family、User、Contract、ContractVersion、Evidence、ChildNote、DiaryEntry、AuditLog、Notification。
- PostgreSQL 是后续上线、并发、审计和查询的稳妥迁移目标。

后续可迁移路径：

- 统一通过 Prisma schema 和 migrations 管理结构。
- 避免 SQLite 专有写法，时间、枚举、JSON 字段要兼容 PostgreSQL。
- 生产环境切换 `DATABASE_URL` 到 PostgreSQL 后跑迁移和集成测试。

## ADR-006 ORM 与 Migration：Prisma

选择：Prisma ORM + Prisma Migrate。

不选择：

- 不手写 SQL 作为默认数据访问层。
- 不使用无迁移的临时表结构。
- 不让 UI/API 直接拼装数据库写入。

原因：

- Prisma schema 对 TypeScript 友好，适合快速生成类型。
- migration 历史能支撑审计型产品的结构演进。
- repository 层可包裹 Prisma，避免 domain 依赖 ORM 细节。

后续可迁移路径：

- Prisma client 只在 persistence/repository 层使用。
- 若未来性能查询需要手写 SQL，可局部封装在 repository 内。

## ADR-007 登录策略：MVP Mock Role Switcher

选择：MVP 使用 mock auth / role switcher，角色包含 `parent`、`child`、`witness`。

不选择：

- 不接真实手机号、微信、邮箱或第三方登录。
- 不做真实家长身份验证。
- 不把 mock 权限写成绕过业务规则的后门。

原因：

- Prompt 0B 已关闭 B-002：首轮 Demo 允许 mock role switcher。
- MVP 重点是权限边界和闭环，不是账号系统。
- Mock 能快速验证 parent 不可读 ChildNote、witness 弱权限、child 主动守约。

后续可迁移路径：

- 所有权限函数以真实 `actorId`、`role`、`familyId`、`relationship` 为输入设计。
- Auth adapter 独立封装，未来替换为 NextAuth/Auth.js、Clerk、自建 auth 或微信登录。
- mock auth 只能存在于 `MOCK_AUTH_ENABLED=true` 的环境。

## ADR-008 图片/证据存储：MVP 本地 Mock 元数据

选择：MVP Evidence 只保存本地/mock 文件元数据和隐私提示确认记录，不接真实对象存储。

不选择：

- 不上传真实家庭照片到第三方对象存储。
- 不做摄像头监督或视频证据。
- 不把照片作为强制证据。

原因：

- 产品冻结要求照片可选、轻证据、隐私最小化。
- Pilot 前还需要完成照片证据采集边界和儿童数据说明。
- MVP 只需验证 Evidence 流程、权限和提示，不需要真实存储风险。

后续可迁移路径：

- Evidence 预留 `storageProvider`、`objectKey`、`mimeType`、`sizeBytes`、`redactionHintAcceptedAt`。
- 正式版可接 S3/R2/OSS 等对象存储，必须默认私有桶、短期签名 URL、访问审计。
- 图片上传前必须展示不要拍人脸、住址、学校标识、无关儿童信息的提示。

## ADR-009 通知策略：站内通知

选择：MVP 使用站内 Notification 表和页面提醒，不接真实推送、短信、邮件。

不选择：

- 不接 APNs/FCM/Web Push。
- 不接短信服务。
- 不做即时轰炸式提醒。

原因：

- 产品语气要求温和提醒，不审判家长。
- 首版闭环可通过站内待办和状态提示完成。
- 真实推送涉及权限、合规、频率控制和退订机制，后置更稳。

后续可迁移路径：

- Notification domain 先生成结构化事件：type、recipient、payload、scheduledAt、readAt。
- V1 可增加 channel adapter：in_app、email、push。
- 24h/72h 提醒用可配置时间倍率或测试 helper 模拟。

## ADR-010 AI 策略：规则模板 + Mock AI

选择：MVP 不接真实 AI；使用规则模板和 mock AI 输出。

不选择：

- 不调用真实模型生成契约、裁决争议或处理儿童安全。
- 不允许 AI 自动发送、自动报警、自动改写事实。
- 不把 AI 输出直接写入业务状态。

原因：

- 产品冻结明确 AI 只能建议、拆解、转译、润色，不能裁判。
- MVP 的核心是家庭闭环和边界，不是 AI 能力验证。
- mock AI 可保留未来交互形态，同时避免不稳定输出和合规风险。

后续可迁移路径：

- 定义 `AI_MODE=off|mock|provider`。
- AI service 只返回 suggestion DTO，必须经用户确认后才能进入业务写入。
- 真实 provider 接入前需要 Prompt 0D 的安全 SOP 和输出审计。

## ADR-011 测试策略：Domain 优先 + 核心 E2E

选择：

- unit：Vitest 覆盖状态机、权限函数、不可建模规则、数据转换。
- integration：repository + domain + API/Server Action 的关键写路径。
- e2e：Playwright 覆盖 10 页核心闭环和敏感权限。

不选择：

- 不只做快照测试。
- 不把权限、安全和状态机留给人工验收。
- 不在 MVP 阶段追求全量 UI 视觉回归。

原因：

- Reward 最大风险是错权限、错状态、错审计，而不是普通展示 bug。
- 产品边界必须通过测试阻止回归。

最小测试集：

- Contract 状态转换：draft -> pending_confirmation -> active -> achieved -> fulfilled/delayed/pending_repair。
- 已确认 Contract 修改必须生成 ContractVersion。
- parent 不能读取 ChildNote。
- witness 不能读取 Evidence、ChildNote、金额、争议详情。
- 所有关键写操作产生 AuditLog。
- 首个小约定完整闭环 E2E。
- 不可建模契约被拦截。
- mock auth 不绕过权限函数。

后续可迁移路径：

- Pilot 前补充数据保留、导出、封存、安全 SOP 测试。
- 接真实 auth、对象存储、AI、推送时分别增加 adapter contract tests。

## ADR-012 部署策略：单体 Web App，环境分层

选择：MVP 以单体 Next.js Web App 部署，环境分为 `local`、`demo`、`pilot`、`production`。

不选择：

- 不拆微服务。
- 不在 MVP 引入 Kubernetes 或复杂云架构。
- 不在 Demo 环境启用真实支付、真实 AI、真实推送。

原因：

- 单体更适合当前小团队和 Sprint 0 到 MVP 的速度。
- domain 边界清楚即可，不需要用部署拓扑制造复杂度。

后续可迁移路径：

- 将 AI、notification、file storage 都设计为 adapter。
- production 再切换 PostgreSQL、对象存储、真实 auth、日志监控。

## ADR-013 环境变量命名

选择：使用显式、可读、可关闭的环境变量。

必须预留：

| 变量 | 说明 | MVP 默认 |
|---|---|---|
| `APP_ENV` | `local/demo/pilot/production` | `local` |
| `APP_BASE_URL` | 应用访问地址 | `http://localhost:3000` |
| `DATABASE_URL` | Prisma 数据库连接 | SQLite file URL |
| `MOCK_AUTH_ENABLED` | 是否启用 mock role switcher | `true` |
| `EVIDENCE_STORAGE_MODE` | `mock/local/object` | `mock` |
| `EVIDENCE_MAX_MB` | 单个证据文件大小限制 | `5` |
| `NOTIFICATION_MODE` | `in_app/mock/push` | `in_app` |
| `AI_MODE` | `off/mock/provider` | `mock` |
| `TIME_ACCELERATION_FACTOR` | 测试提醒时间倍率 | `1` |
| `AUDIT_LOG_ENABLED` | 是否启用审计日志 | `true` |

不选择：

- 不使用含糊变量名，例如 `ENABLE_MAGIC`。
- 不在代码中硬编码 Demo 账号、对象存储密钥、AI key。

后续可迁移路径：

- 进入 pilot 前补齐 `.env.example`、密钥管理策略和环境差异表。

## ADR-014 不因技术便利突破产品边界

选择：技术实现必须服从产品边界。

禁止事项：

- 为了调试方便让 parent 默认读取 ChildNote。
- 为了演示方便让 witness 看到 Evidence、金额或争议详情。
- 为了简化实现覆盖已确认 Contract，而不是生成 ContractVersion。
- 为了快速上线接入真实照片上传而不做隐私提示和权限审计。
- 为了“更智能”让 AI 自动裁决、自动发送、自动报警。
- 为了“更像 App”加入强锁、视频、实时定位、开放社交或抽卡链路。

后续可迁移路径：

- 把这些禁止事项写入 AGENTS.md、测试计划和代码审查清单。
