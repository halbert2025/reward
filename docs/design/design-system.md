# Reward MVP 设计系统草案

本文用途：定义 MVP 的基础视觉方向、token、组件和端侧差异，供前端实现参考。本文是草案，后续可在真实 UI 中细化。

## 1. 视觉气质

关键词：

- 暖萌治愈。
- 低刺激。
- 纸感手账。
- 清楚可信。
- 愿望后院。

避免：

- 赛博炫光。
- 商业手游式高刺激动效。
- 强红点。
- 排行榜。
- 抽卡稀有度。
- 任务失败惩罚视觉。

## 2. 端侧视觉差异

| 端 | 气质 | 重点 |
|---|---|---|
| parent | 清楚、温和、可信 | 状态、规则、回应、下一步 |
| child | 轻、柔软、有空间感 | 愿望、小院、猫猫、能量、纪念 |
| witness | 极简、纪念感 | 摘要、祝福、边界说明 |

## 3. 色彩 Token

| Token | 用途 | 建议 |
|---|---|---|
| `--color-bg` | 页面背景 | `#FBF7EE` |
| `--color-surface` | 卡片/表面 | `#FFFDF8` |
| `--color-ink` | 主文本 | `#25332D` |
| `--color-muted` | 次文本 | `#7A756C` |
| `--color-line` | 边框 | `#E8DECC` |
| `--color-green` | 成长/完成 | `#77A978` |
| `--color-green-soft` | 成长浅底 | `#E7F1E6` |
| `--color-gold` | 愿望/纪念 | `#D7A94B` |
| `--color-gold-soft` | 愿望浅底 | `#F8EBC6` |
| `--color-rose` | 温和提醒 | `#D98A7C` |
| `--color-blue` | 信息提示 | `#7C9DB8` |

要求：

- 不要形成单一绿色或单一米色页面，需用 gold/blue/rose 做轻点缀。
- 错误态不用刺眼纯红，使用温和提醒色并配明确文案。

## 4. 字体与排版

- 字体：`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Microsoft YaHei`, sans-serif。
- 正文：14-16px。
- 工具页标题：20-28px。
- 孩子端关键按钮：16-18px。
- 行高：1.5-1.7。
- 字间距：0。
- 不用 viewport width 动态缩放字体。

## 5. 间距与形状

| Token | 用途 | 值 |
|---|---|---|
| `--radius-sm` | 输入、标签 | 6px |
| `--radius-md` | 卡片 | 8px |
| `--radius-lg` | 大面板/孩子端小院区 | 12px |
| `--space-1` | 极小间距 | 4px |
| `--space-2` | 小间距 | 8px |
| `--space-3` | 中间距 | 12px |
| `--space-4` | 常规间距 | 16px |
| `--space-6` | 区块间距 | 24px |
| `--space-8` | 页面区块 | 32px |

卡片圆角默认不超过 8px；孩子端小院展示区可使用 12px。

## 6. 核心组件

| 组件 | 用途 | 状态 |
|---|---|---|
| PrincipleCard | 5 条原则确认 | unchecked/checked/disabled |
| RewardPoolEditor | 小/中/大奖池和禁用奖励 | empty/editing/saved/error |
| ContractPreviewCard | 首个小约定预览 | draft/pending/active |
| InviteCodePanel | 邀请码/链接 | active/expired/copied |
| BackyardPanel | 孩子愿望后院 | empty/pending/active/fulfilled |
| WishCard | 当前愿望 | locked/available/active/completed |
| TimerControl | 愿望番茄钟 | idle/running/paused/completed/exited |
| ReflectionInput | 一句复盘 | empty/valid/error |
| EvidencePicker | 可选照片 | empty/selected/uploading/error/skipped |
| ParentResponseControl | 已兑现/延期/待复盘 | none/fulfilled/delayed/pending_repair |
| DiaryCard | 亲子日记 | generating/ready/error |
| WitnessSummaryCard | 见证人摘要 | invited/viewed/blessed |
| PermissionNotice | 权限不足提示 | child_private/witness_limited/version_locked |

## 7. 交互原则

- 主要流程每页只有一个最显著下一步。
- 危险或边界操作必须解释原因。
- 表单错误靠近字段展示。
- loading 不清空用户输入。
- 空状态给下一步，不给长篇教育。
- 所有角色切换仅用于 MVP mock，不作为正式 UI 宣传。

## 8. 动效原则

允许：

- 小院轻微变亮。
- 安静猫来访的低刺激淡入。
- 愿望能量条轻柔增长。
- 按钮轻微反馈。

禁止：

- 爆闪。
- 连续强震动。
- 抽卡揭晓。
- 稀有度特效。
- 强红点催促。
- 失败惩罚动画。

## 9. 可访问性

- 所有按钮可键盘访问。
- 颜色不能作为唯一状态表达。
- 表单错误必须有文本说明。
- 交互目标最小 40px 高。
- 移动端按钮文字不得截断。
- 图片证据必须有隐私提示文本，不只用图标。

## 10. 页面布局建议

- parent 页面：最大内容宽度 960-1120px，流程表单居中，右侧可放契约预览。
- child 页面：移动优先，主视图优先显示愿望和小院，任务信息放在下方。
- witness 页面：单列摘要，不展示复杂导航。
- P07 番茄钟：固定计时区域尺寸，避免倒计时数字导致布局跳动。
- P09 回应：segmented control 稳定宽度，延期字段在选择延期后展开。

## 11. 图像与资产

MVP 可先用简化插画/占位图，但需要表达真实状态：

- 小院空状态。
- 当前愿望卡。
- 安静猫来访。
- 纪念卡。

资产要求：

- 不使用商业手游素材。
- 不使用概率、稀有、抽奖视觉。
- 不使用学校、机构、商家导购素材。
- 猫猫是低刺激陪伴感，不是付费收集目标。
