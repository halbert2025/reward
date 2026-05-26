# 猫猫番茄钟素材治理清单

日期：2026-05-26  
范围：MVP / Pilot 静态运行时素材

## 1. 当前运行时素材

| 文件 | 用途 | 来源记录 | 版本 | 替换策略 |
| --- | --- | --- | --- | --- |
| `apps/web/public/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png` | 基础背景与降级图 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需重新跑番茄钟桌面截图。 |
| `apps/web/public/assets/pomodoro/coffee/guest_back_bar_scene_wide_01.png` | 计时过半客人来访状态 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需确认低刺激、不遮挡倒计时。 |
| `apps/web/public/assets/pomodoro/coffee/barista_idle_counter_close_01.png` | idle/focus 主猫状态 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需保持同构图，避免跳动。 |
| `apps/web/public/assets/pomodoro/coffee/barista_look_up_counter_close_01.png` | 点击画面后的轻反馈 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需不表达责备或紧张。 |
| `apps/web/public/assets/pomodoro/coffee/barista_serve_drink_counter_close_01.png` | 完成状态 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需保留递饮品语义。 |
| `apps/web/public/assets/pomodoro/coffee/drink_cat_latte_art_close_01.png` | 奖励小票与完成饮品 | PIC 生成素材，猫猫奶茶厅 MVP 组 | v1 | 替换需确认可作为小票封面重复使用。 |

## 2. 发布规则

- 素材进入 `apps/web/public/assets/pomodoro/coffee/` 前，必须有用途、版本和替换策略。
- 素材不能包含真实儿童、人脸、学校、住址、品牌商标或商业水印。
- 素材不能暗示系统会锁机、监控摄像头、识别孩子表情或自动评价专注质量。
- 替换主场景、完成状态或小票封面后，必须更新视觉验收截图。
- 大批量新增素材前，需要先补资源体积预算和懒加载策略。

## 3. 回滚规则

- 若新素材导致首屏空白、文字遮挡、加载过慢或风格偏离低刺激原则，回滚到 v1 素材。
- 回滚只替换 public asset，不改变证据、奖励小票或 FocusSession 数据。
- 素材问题不应阻断核心契约流；页面必须保留静态背景降级图。
