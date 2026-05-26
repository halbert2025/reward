# 猫猫奶茶厅番茄钟 IP 状态机

日期：2026-05-26  
代码来源：`apps/web/lib/pomodoro-ip-states.ts`  
页面入口：`/child/pomodoro/[taskId]`

## 1. 设计原则

- IP 是状态反馈，不是装饰图层。
- 动作必须低刺激：不闪烁、不强提醒、不打断孩子。
- 状态只反馈当前节奏，不评价孩子好坏。
- 失败、暂停、退出都不使用惩罚文案。
- 素材加载失败时必须能退回到同主题静态画面。

## 2. 状态表

| 状态 | 触发条件 | 主素材 | 降级素材 | 孩子端文案 | 可测断言 |
| --- | --- | --- | --- | --- | --- |
| idle 待机 | 任务可开始但孩子尚未主动开始 | `barista_idle_counter_close_01.png` | `scene_teahouse_empty_wide_01.png` | 猫猫在擦杯子，等你准备好。 | 未运行状态显示开始按钮，不出现催促、排行或锁机承诺。 |
| focus 专注 | 孩子点击开始后进入计时 | `barista_idle_counter_close_01.png` | `scene_teahouse_empty_wide_01.png` | 猫猫安静做饮品，不催促。 | 运行态显示倒计时和低刺激画面，完成按钮在计时结束前禁用。 |
| guest 来访 | 计时过半后出现安静客人背影 | `guest_back_bar_scene_wide_01.png` | `scene_teahouse_empty_wide_01.png` | 有猫猫坐下，空间仍然安静。 | 过半后客人素材可见，但不出现强提醒或动效干扰。 |
| look_up 抬头 | 孩子在计时未结束前点击画面 | `barista_look_up_counter_close_01.png` | `barista_idle_counter_close_01.png` | 猫猫看了你一眼，又继续做饮品。 | 点击画面只改变轻反馈，不中断计时，不产生惩罚文案。 |
| complete 完成 | 倒计时结束且孩子点击完成 | `barista_serve_drink_counter_close_01.png` | `drink_cat_latte_art_close_01.png` | 递上一杯猫猫笑脸拉花。 | 完成按钮可用，提交后进入反思页并生成奖励小票数据。 |
| exit 暂停 | 孩子选择先停一下 | `barista_look_up_counter_close_01.png` | `scene_teahouse_empty_wide_01.png` | 写一句原因就好，不会变成惩罚。 | 退出必须选择原因，保存后回到孩子后院，不写入完成证据。 |

## 3. 验收映射

| 验收项 | 覆盖方式 |
| --- | --- |
| 运行态桌面截图 | `docs/reviews/assets/2026-05-26-visual/pomodoro-running.png` |
| 完成后反思页截图 | `docs/reviews/assets/2026-05-26-visual/pomodoro-reflect.png` |
| E2E 主链路 | `tests/e2e/contract-flow.spec.ts` |
| 视觉主链路 | `tests/e2e/visual-acceptance.spec.ts` |
| 配置入口 | `apps/web/lib/pomodoro-ip-states.ts` |

## 4. 暂不进入 MVP 的状态

- 节日皮肤自动发布。
- 背景音乐、白噪音真实音频。
- 锁屏、网站屏蔽、系统层专注模式。
- AI 自动评价本次专注质量。
