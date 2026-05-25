# Reward MVP 事件字典

本文用途：定义 MVP 埋点事件、触发时机、必要属性、禁止采集属性和儿童数据标记。事件设计必须服从 `docs/safety/data-classification.md`。

## 1. 全局禁止采集

所有事件都禁止采集：

- 学校、班级、老师、机构。
- 精确位置、家庭住址、实时定位。
- 真实姓名、身份证件、手机号原文。
- 无关人脸、照片 URL、照片原图。
- ChildNote 原文、树洞原文、未发送情绪。
- 高风险表达原文。
- 支付账号、钱包、资金流水。
- 商业导购偏好。
- 开放社交关系链。

## 2. 通用属性

所有事件可带：

- `event_id`
- `occurred_at`
- `actor_role`
- `family_id`
- `app_env`
- `session_id`

注意：

- `family_id`、`user_id`、`contract_id` 必须是内部 ID，不是姓名或手机号。
- child 相关事件只记录必要状态和枚举，不记录原文。

## 3. 事件列表

| event_name | 触发时机 | 角色 | 必要属性 | 禁止采集的属性 | 是否涉及儿童数据 |
|---|---|---|---|---|---|
| `family_created` | parent 创建家庭成功 | parent | `family_id` | 真实姓名、地址、学校、手机号原文 | 否 |
| `child_profile_created` | parent 创建 child 档案 | parent | `family_id`, `child_age_band` | child 真实姓名、学校、班级、精确生日 | 是 |
| `principles_confirmed` | parent 勾选 5 条原则并继续 | parent | `family_id`, `principle_version` | 自由文本备注 | 否 |
| `reward_pool_created` | parent 完成奖池初始化 | parent | `family_id`, `small_wish_count`, `disabled_reward_type_codes` | 具体高价值商品、商家、孩子偏好画像 | 可能涉及儿童数据 |
| `contract_created` | parent 创建首个小约定 | parent | `family_id`, `contract_id`, `contract_order`, `wish_level`, `task_type`, `evidence_type` | 契约原文、奖励金额明细、学校/机构信息 | 是 |
| `contract_blocked_by_safety` | 创建约定命中不可建模清单 | parent/system | `family_id`, `risk_level`, `category_code` | 高风险原文、ChildNote 原文 | 可能涉及儿童数据 |
| `invite_created` | parent 生成 child 邀请 | parent | `family_id`, `contract_id`, `invite_type` | 邀请链接完整 URL、手机号、微信号 | 是 |
| `contract_viewed_by_child` | child 打开待确认约定 | child | `family_id`, `contract_id` | 契约长文本原文以外的隐私、照片 | 是 |
| `contract_confirmed` | child 确认约定 | child | `family_id`, `contract_id` | child 自由反馈原文 | 是 |
| `focus_started` | child 点击开始守约 | child | `family_id`, `contract_id`, `task_session_id`, `duration_minutes` | 屏幕内容、摄像头、定位 | 是 |
| `focus_paused` | child 暂停计时 | child | `family_id`, `contract_id`, `task_session_id` | 暂停时的自由文本原文 | 是 |
| `focus_exited` | child 中途退出 | child | `family_id`, `contract_id`, `task_session_id`, `reason_type` | 详细情绪原文、责备对象 | 是 |
| `focus_completed` | 计时完成 | child/system | `family_id`, `contract_id`, `task_session_id`, `duration_minutes` | 屏幕监控、视频、实时行为轨迹 | 是 |
| `task_submitted` | child 提交复盘/可选证据 | child | `family_id`, `contract_id`, `task_session_id`, `reflection_length_bucket`, `evidence_type` | 复盘原文、照片 URL、照片内容、人脸 | 是 |
| `evidence_privacy_notice_accepted` | child/parent 确认证据隐私提示 | child/parent | `family_id`, `contract_id`, `notice_version` | 照片内容、设备相册信息 | 是 |
| `fulfillment_notification_created` | system 生成 parent 待回应提醒 | system | `family_id`, `contract_id`, `notification_type` | child 复盘原文、ChildNote 原文 | 是 |
| `fulfillment_responded` | parent 选择已兑现/延期/待复盘 | parent | `family_id`, `contract_id`, `response_type`, `delay_hours_bucket` | 延期自由文本原文、责备文本 | 是 |
| `diary_created` | system 生成亲子日记 | system | `family_id`, `contract_id`, `diary_id`, `has_parent_message`, `has_backyard_event` | 日记正文、留言原文、照片 URL | 是 |
| `backyard_event_created` | 安静猫来访/小院更新 | system | `family_id`, `child_age_band`, `event_type` | child 真实身份、付费/概率标签 | 是 |
| `second_contract_created` | family 创建第二个约定 | parent | `family_id`, `contract_id`, `days_since_first_contract` | 契约原文、奖励金额明细 | 是 |
| `child_note_created` | child 创建小纸条 | child | `family_id`, `note_id`, `note_length_bucket` | ChildNote 原文、情绪原文 | 是，D 类 |
| `child_note_access_denied` | parent/witness 越权访问 ChildNote 被拒 | parent/witness | `family_id`, `actor_role`, `target_type` | ChildNote 原文 | 是，隐私安全事件 |
| `witness_invite_created` | parent 创建纪念见证邀请 | parent | `family_id`, `contract_id`, `witness_role_type` | witness 手机号原文、金额、证据、争议 | 可能涉及儿童数据 |
| `witness_blessing_sent` | witness 发送祝福 | witness | `family_id`, `contract_id`, `blessing_length_bucket` | 祝福原文、联系方式 | 可能涉及儿童数据 |
| `data_export_requested` | parent/child 申请导出 | parent/child | `family_id`, `requester_role`, `export_scope` | 导出内容正文 | 是 |
| `archive_requested` | parent/child 申请封存 | parent/child | `family_id`, `requester_role`, `archive_scope` | 申请原因原文 | 是 |

## 4. 派生指标映射

| 指标 | 主要事件 |
|---|---|
| 首次设置完成率 | `family_created`, `principles_confirmed`, `reward_pool_created` |
| 首个小约定创建率 | `reward_pool_created`, `contract_created` |
| 孩子开始守约率 | `contract_confirmed`, `focus_started` |
| 首个约定完成率 | `focus_started`, `task_submitted` |
| 家长回应率 | `task_submitted`, `fulfillment_responded` |
| 亲子日记生成率 | `fulfillment_responded`, `diary_created` |
| 第二个约定创建率 | `diary_created`, `second_contract_created` |
| 7 日家庭留存率 | 任一有效行为事件 |

## 5. 审查规则

新增事件前必须回答：

- 是否涉及 child？
- 是否可能包含原文？
- 是否能用枚举、长度桶、数量代替原始内容？
- 是否包含学校、位置、真实姓名、人脸、树洞？
- 是否属于 E 类风险保护数据？

无法回答清楚时，不允许上线埋点。
