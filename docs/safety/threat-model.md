# Reward MVP 威胁模型

本文用途：列出 Reward MVP 的主要隐私、安全、合规和产品边界风险，以及对应缓解措施。本文不是法律意见；正式上线和真实家庭灰度前，必须由目标市场法务审查。

## 1. 资产和信任边界

核心资产：

- ChildNote / 树洞。
- Evidence / 照片证据。
- Contract / ContractVersion。
- TaskSession / Fulfillment / DiaryEntry。
- AuditLog / RiskSignal。
- family role 和 witness invite。

信任边界：

- parent、child、witness、system/safety 之间的权限边界。
- UI 与 API/Server Action 之间的边界。
- mock adapter 与未来真实服务之间的边界。
- 普通数据与受限安全数据之间的边界。

## 2. 威胁清单

| 编号 | 风险 | 场景 | 影响 | 缓解措施 | 必测/必审 |
|---|---|---|---|---|---|
| T-001 | parent 越权读 ChildNote | 家长通过 URL/API 请求树洞 | 孩子信任崩塌，隐私泄露 | permission 函数、DTO 分离、API 返回 FORBIDDEN | parent 读 ChildNote 测试必须失败 |
| T-002 | witness 越权读证据/金额/争议 | 见证人页面复用 parent DTO | 亲属施压，隐私泄露 | witness summary DTO 单独设计 | witness 只能看到摘要 |
| T-003 | 已确认 Contract 被覆盖 | 家长事后修改验收标准 | 破坏契约可信度 | ContractVersion 锁定、状态机禁止覆盖 | 修改已确认契约必须生成新版本 |
| T-004 | 孩子努力记录被硬删 | parent 删除不利记录 | 孩子努力被抹掉 | 封存/共同删除/依法删除，禁止单方硬删 | parent 删除已完成记录必须失败 |
| T-005 | Evidence 照片泄露隐私 | 上传人脸、学校、住址、其他孩子 | 未成年人隐私泄露 | 上传前提示、最小化采集、对象存储私有、访问审计 | 上传流程必须展示提示 |
| T-006 | AI 自动裁判 | AI 判断谁对谁错或自动生成处罚 | 权威错觉和错误伤害 | AI 只返回 suggestion，发送前确认 | AI 输出不得直接改状态 |
| T-007 | AI 泄露树洞原文 | AI 摘要把 ChildNote 原文发给 parent | 私密内容泄露 | AI service 不接收/不输出无授权原文，人工复核受限 | parent 提醒不得含原文 |
| T-008 | 自动报警误伤 | 模型误判后自动通知外部 | 家庭关系和法律风险 | AI 不自动报警，L4/L5 人工复核 | 无自动报警代码路径 |
| T-009 | 埋点过度采集 | event 记录学校、位置、原文、照片 URL | 二次泄露和合规风险 | event taxonomy 禁止敏感属性 | 埋点属性审查 |
| T-010 | 见证人变审判团 | 亲属看到争议并施压 | 加剧家庭冲突 | 默认纪念见证、弱权限、不看争议、不裁定 | witness 无争议入口 |
| T-011 | 不可建模契约绕过 | “不给饭”变体表达进入契约 | 儿童保护风险 | safety rules + 风险等级 + 人工复核入口 | L3/L4 文案拦截 |
| T-012 | 学校/机构路径混入 | 新增 teacher/class/org 字段 | 产品边界滑坡 | product-boundaries 审查，数据模型禁止 | schema 不含 school/class 必填 |
| T-013 | 商业导购混入 | 奖励推荐带商品链接或商家赞助 | 家长信任受损 | 订阅商业化原则，禁止商家 API | UI/API 无导购入口 |
| T-014 | 抽卡刺激混入 | 安静猫变稀有度、爆率、付费抽 | 未成年人概率刺激 | 进度式惊喜，不做概率池 | 无 SSR/爆率/付费随机 |
| T-015 | Mock auth 绕过权限 | role switcher 直接返回所有数据 | 测试误判安全 | mock actor 仍走 permission 函数 | mock 下权限测试必须通过 |
| T-016 | AuditLog 缺失 | 关键写操作无审计 | 无法追溯争议和误操作 | repository transaction 写 AuditLog | 写操作审计测试 |
| T-017 | 安全日志暴露 | RiskSignal 进入普通前台或导出 | 二次伤害 | E 类数据受限可见，普通导出排除 | parent 导出不含 E 类 |
| T-018 | 分享误配置 | 纪念卡公开包含金额/照片/孩子表达 | 对外泄露 | 分享默认关闭，字段预览和撤回 | 分享内容字段审查 |
| T-019 | 数据封存不完整 | 封存后仍提醒或可编辑 | 家庭退出不体面 | archived 状态只读、不提醒 | 封存后不可推进 |
| T-020 | 照片对象公开 | 未来对象存储桶公开或 URL 长期有效 | 证据泄露 | 私有桶、短期签名 URL、访问审计 | storage adapter 审查 |

## 3. 安全测试门槛

进入代码实现后，下列测试必须存在：

- parent 不能读取 ChildNote。
- witness 不能读取 Evidence、ChildNote、金额、争议详情。
- 已确认 Contract 不能覆盖。
- ContractVersion 创建可追溯。
- 所有关键写操作生成 AuditLog。
- L3/L4 不可建模内容被拦截。
- AI suggestion 不能直接写业务状态。
- parent 导出不包含 ChildNote 和 E 类 RiskSignal。
- 分享默认关闭。
- mock auth 不绕过 permission。

## 4. 代码审查阻断项

出现以下任一项，必须阻断合并：

- `parent` 默认读取 `ChildNote`。
- `witness` 读取 Evidence、金额、争议详情或 ChildNote。
- 用 update 覆盖已确认 Contract。
- 关键状态转换没有 AuditLog。
- AI 自动发送、自动裁决、自动报警。
- 普通埋点记录 ChildNote 原文、照片 URL、学校、精确位置。
- 对外分享默认开启。
- 加入学校、机构、托管、导购、视频、强锁、开放社交、抽卡主链路。

## 5. Pilot 前安全准备

- 完成目标市场法务审查。
- 完成隐私政策、儿童数据说明、用户协议、试用告知。
- 完成数据导出/封存/删除 SOP。
- 完成儿童安全人工复核 SOP。
- 完成对象存储私有访问方案。
- 完成安全事件响应联系人和流程。
