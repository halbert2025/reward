# Reward MVP 用户流程

本文用途：定义 MVP 首个小约定的端到端流程、角色切换、异常流程和退出路径。

## 1. 主闭环

```text
P01 parent 打开欢迎页
-> 创建家庭
-> P02 确认 5 条原则
-> P03 初始化简版奖池
-> P04 创建首个小约定
-> P05 邀请 child
-> P06 child 查看愿望后院并确认约定
-> P07 child 主动开始 25 分钟愿望番茄钟
-> P08 child 提交一句复盘和可选照片
-> P09 parent 收到待回应提醒
-> parent 选择已兑现 / 延期 / 待复盘
-> P10 已兑现后生成亲子日记和安静猫来访
```

## 2. Parent Flow

1. parent 从 P01 开始创建家庭。
2. parent 在 P02 勾选 5 条原则。
3. parent 在 P03 设置小/中/大奖池和禁用奖励。
4. parent 在 P04 选择小愿望，创建 25 分钟小约定。
5. parent 在 P05 复制邀请链接或切换 child 预览。
6. child 完成后，parent 在 P09 选择回应。
7. 已兑现后，parent 在 P10 查看亲子日记。

关键限制：

- 不确认原则不能创建正式契约。
- 不设置可用小愿望不能创建首个小约定。
- parent 不能查看 ChildNote。
- parent 不能覆盖已确认 ContractVersion。
- parent 不能无回应关闭已完成约定。

## 3. Child Flow

1. child 通过 P05 邀请进入 P06。
2. child 查看当前愿望、任务和奖励摘要。
3. child 确认约定。
4. child 点击开始守约进入 P07。
5. child 完成番茄钟后进入 P08。
6. child 写一句复盘，可选择上传照片。
7. child 回到愿望后院等待 parent 回应。
8. parent 已兑现后，child 在 P10 看到亲子日记和安静猫来访。

关键限制：

- child 不能自由开价，只能从家庭奖池选愿望。
- child 不能修改已确认契约。
- child 中途退出要写原因，但不显示羞辱性失败文案。
- ChildNote 默认只对 child 可见。

## 4. Witness Flow

MVP 只做纪念见证人占位。

1. parent 可在后续见证人入口邀请 1 个纪念见证人。
2. witness 只看到契约摘要和完成纪念。
3. witness 可发送一句祝福。

关键限制：

- witness 不看金额。
- witness 不看 Evidence。
- witness 不看 ChildNote。
- witness 不看争议详情。
- witness 不裁定。

## 5. 异常流程

| 场景 | 处理 |
|---|---|
| parent 未确认原则 | 停留 P02，继续按钮 disabled |
| 奖池没有小愿望 | P03 提示先添加近期可实现的小愿望 |
| 创建契约命中不可建模清单 | P04 拦截并给替代表达 |
| 邀请码过期 | P05 允许重新生成 |
| child 中途退出 | P07 要求填写/选择原因，记录为本轮未完成 |
| child 提交照片失败 | P08 可跳过照片，只提交复盘 |
| parent 延期 | P09 必填原因和新时间 |
| parent 选择待复盘 | Contract 进入 pending_repair，占位不做完整修复中心 |
| 状态被更新 | 当前页提示刷新，不直接覆盖 |
| 权限不足 | 显示角色边界说明，不暴露数据 |

## 6. 完成与二次约定

MVP 成功完成后，P10 应提供两个出口：

- 回到孩子愿望后院，看到小院更新。
- parent 创建下一个约定。

第二个约定创建率是核心验证指标，P10 不做强推销，只给温和入口。
