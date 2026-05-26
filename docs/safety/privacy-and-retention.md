# Reward 隐私、导出、封存与保留策略

本文用途：定义 Reward MVP 的隐私边界、家长可见范围、导出范围、封存/删除策略和照片证据最小化原则。本文不是法律意见；正式上线和真实家庭灰度前，必须完成目标市场法务审查。

## Pilot consent and request entry

- Guardian pilot consent is versioned in `docs/safety/pilot-consent-text.md` and implemented at `/pilot/consent`.
- Parent family creation is blocked until current-version guardian consent exists.
- Data handling requests are captured at `/privacy/requests`.
- Request handling follows `docs/safety/data-request-runbook.md`.
- Evidence photo handling follows `docs/safety/evidence-photo-policy.md`; first pilot stores mock descriptions only, not real photo files.

## Reward ticket privacy boundary

Reward tickets are the child-facing collection presentation of completion `Evidence`.

- They may show the child reflection, wish title, task title, completion date, mock photo label, and diary status.
- They are visible to the child and authorized parent/family views only.
- Witnesses must not see reward tickets, raw reflection text, evidence metadata, or ChildNote content.
- Reward tickets are included in export, deletion review, sealing, and pilot exit handling because they contain child-authored content.
- A sealed family or sealed contract should hide reward tickets from normal collection pages while preserving the minimum audit trail.
- Current pilot does not export reward ticket images; only structured data and text are in scope.
- AI/Kimi boundary: reward ticket reflection text is not sent to a real external model in MVP. See `docs/safety/reward-ticket-ai-boundary.md`.

## 1. 家长能查看什么

parent 默认可查看：

- 家庭基础资料：家庭空间、孩子昵称、年龄段、邀请码状态。
- 契约相关数据：RewardPool、Contract、ContractVersion、任务目标、奖励说明、验收协议、兑现时间。
- 执行数据：TaskSession 开始/完成/退出原因、完成状态、一句话复盘。
- 按验收协议可见的 Evidence。
- Fulfillment：已兑现、延期、待复盘、延期原因、新兑现时间。
- DiaryEntry：愿望、任务、孩子提交的复盘、家长留言、安静猫来访。
- 站内通知和自己产生的操作记录摘要。

## 2. 家长不能默认查看什么

parent 默认不可查看：

- ChildNote / 树洞原文。
- 未发送情绪、草稿、小纸条、给未来自己的私密话。
- RiskSignal 评分、平台安全判断细节。
- witness 私下祝福草稿。
- 其他家庭成员未授权分享的私密内容。

任何“为了帮助家长理解孩子”而泄露 ChildNote 原文的设计都禁止。

## 3. 家长能导出什么

parent 可申请导出：

- 家庭契约列表与版本。
- 任务执行记录。
- 兑现回应与延期记录。
- parent 可见的 Evidence。
- parent/child 共同可见的 DiaryEntry。
- 纪念摘要。

parent 不能导出：

- ChildNote 原文，除非 child 主动分享给家庭日记。
- E 类风险保护数据。
- witness 不可见或 child 私密内容。
- 普通后台审计日志全文。

## 4. 家长不能单方删除什么

parent 不能单方彻底删除：

- child 已完成的 TaskSession。
- 已确认的 ContractVersion。
- Fulfillment 和延期记录。
- child 的复盘与努力记录。
- 与争议、封存、安全流程相关的 AuditLog。

原因：Reward 是温柔史官，不是帮任何一方重写历史。

## 5. 删除、隐藏、封存、共同删除、依法删除

| 操作 | 适用对象 | 谁可发起 | 处理规则 |
|---|---|---|---|
| 隐藏 | 前台展示项、纪念卡 | parent/child 按权限 | 仅影响展示，不删除底层记录 |
| 封存 | Contract、DiaryEntry、家庭空间 | parent/child 可申请 | 不再推进，不再提醒，保留只读记录 |
| 共同删除 | 家庭共享契约和日记 | parent + child 共同确认 | 删除或匿名化展示内容，保留最小审计摘要 |
| child 删除草稿 | ChildNote 草稿、未发送内容 | child | 可删除，除非已触发安全流程摘要 |
| 依法删除 | 依法可删除的数据 | 监护人/本人依法申请 | 按目标市场法律和平台 SOP 处理 |

所有请求都必须记录：

- 请求人、角色、时间。
- 请求对象。
- 请求原因。
- 处理人/处理方式。
- 处理结果。

## 6. 保留策略

MVP 默认策略：

- B 类契约执行数据：长期保存或随家庭封存。
- C 类证据文件：MVP mock metadata；正式版应有生命周期策略。
- D 类 ChildNote：默认 child 私密保存，child 可隐藏/删除草稿。
- E 类风险保护：按安全 SOP 受限保留，不进入普通导出。
- AuditLog：至少保留到对应契约生命周期结束后，Pilot 前再由法务确认期限。

## 7. 照片证据最小化采集

上传前必须提示：

- 只拍任务成果局部。
- 避免人脸、学校、住址、门牌、校服、证件、屏幕隐私。
- 避免拍到其他孩子或无关人员。
- 不上传与验收无关内容。
- 不上传让自己不舒服或暴露隐私的照片。

工程要求：

- Evidence 默认可选，不强制。
- MVP 可只保存 mock metadata。
- 未来真实上传必须默认私有存储、短期签名 URL、访问审计。
- 证据争议应回到原始验收协议，不把产品做成侦查系统。

## 8. 分享默认关闭

默认关闭：

- 对外分享纪念卡。
- witness 查看详情。
- 数据池/推荐。
- 小院名片。
- 任何公开链接。

任何分享必须展示：

- 分享给谁。
- 分享什么字段。
- 是否包含照片、金额、孩子表达。
- 如何撤回。

## 9. Pilot 前必须补齐

- 试用家庭告知与同意文本。
- 隐私政策。
- 儿童数据处理说明。
- 用户协议。
- 数据导出/封存/删除请求流程。
- 照片证据采集提示文案。
- 安全风险人工复核 SOP。
