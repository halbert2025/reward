# Reward 测试用户版本准备清单

日期：2026-05-26  
阶段：Alpha / Pilot Readiness

## 1. P0 范围冻结

- [x] 测试用户版本范围文档已创建：`docs/product/pilot-scope.md`
- [x] 测试用户版本不做清单已创建：`docs/product/pilot-non-goals.md`
- [x] 最小测试用户闭环已明确
- [x] 默认不接真实 Kimi/AI 已明确
- [x] 第一批不上传真实照片已明确

## 2. P1 真实身份与邀请

- [x] parent 真实登录方案确定
- [x] child 邀请码方案确定
- [x] witness 邀请链接完成
- [x] 开发环境 mock role switcher 保留
- [x] pilot/production mock role switcher 默认关闭
- [x] parent 登录、创建家庭、child 邀请码加入 E2E 完成
- [x] 核心 server action/API 使用当前 actor，seed 仅作为 demo 兜底
- [x] 核心越权负向测试完成

## 3. P2 线上数据库

- [x] 本地 SQLite、pilot/production PostgreSQL 策略确定
- [x] Prisma migration 流程确定
- [x] seed 数据与真实数据隔离
- [x] production 不自动写入 seed 数据
- [x] 环境变量校验完成
- [x] 迁移和回滚说明完成
- [x] seed/test reset 已清理 seed 合约派生数据，E2E 可重复运行

## 4. P3 隐私、同意与退出

- [x] 家长告知与同意文本完成
- [x] 儿童友好隐私提示完成
- [x] 未同意不能创建家庭或邀请孩子
- [x] 退出测试入口完成
- [x] 数据导出、删除、封存请求入口完成
- [x] account-level request 使用 `OperationalEvent` 留痕
- [x] 人工处理状态和审计日志完成

## 5. P4 证据策略

- [x] 第一批证据策略为 mock/文字说明，不真实上传
- [x] 页面明确当前测试版不上传真实照片
- [x] 真实上传后置到独立 storage gate
- [x] 敏感内容提示完成
- [x] 服务端校验完成
- [x] 奖励小票作为 Evidence 派生对象的数据边界已补充
- [x] 奖励小票 / 复盘文本 MVP 不外发真实 AI

## 6. P5 试点运营

- [x] 最小 admin/运营视图完成
- [x] 测试家庭列表可查看
- [x] 同意状态可查看
- [x] 数据请求可处理
- [x] 异常风险人工复核队列完成
- [x] family-linked 后台操作写 `AuditLog`
- [x] account-level 后台操作写 `OperationalEvent`
- [x] 家长/孩子反馈入口完成
- [x] admin console E2E 覆盖访问控制、状态更新、note 必填和审计验证

## 7. P6 部署、监控与回滚

- [x] 测试环境部署流程完成
- [x] `/api/health` 可用
- [x] 数据库连接健康检查完成
- [x] 关键错误监控完成
- [x] 登录失败/Action 失败可记录
- [x] 回滚方案完成
- [x] 暂停新邀请方案完成

## 8. P7 体验打磨

- [x] 首次家长路径无需开发者解释，E2E 覆盖登录、同意、建家、邀请
- [x] 儿童加入路径清晰，E2E 覆盖邀请码加入
- [x] P01-P10 核心空态、错误态、提交态、无权限态已覆盖到主要流程
- [x] 页面文案无已知孩子端主链路乱码
- [x] 猫猫番茄钟低刺激视觉完成
- [x] 番茄钟 IP 状态机、触发、素材、降级和 QA 断言已补齐
- [x] `/child/rewards` 页面状态表已补充
- [x] 电脑端截图验收已归档：`docs/reviews/2026.05.26 Reward视觉验收记录.md`
- [x] 移动端窄屏截图验收已归档：`docs/reviews/2026.05.26 Reward移动端视觉验收记录.md`

## 9. P8 最终验收

- [x] unit test 通过：18 passed
- [x] typecheck 通过
- [x] build 通过
- [x] E2E 主链路通过：15 passed
- [x] 权限负向测试通过
- [x] 隐私边界测试通过
- [x] admin console E2E 通过
- [x] 视觉截图验收通过
- [x] `prd-review-gate` 二次复审通过：`docs/reviews/2026.05.26 Reward P1-P4修复终审报告.md`
- [x] 测试邀请模板完成：`docs/research/pilot-test-invite-template.md`
- [x] 测试用户发布清单完成：`docs/research/pilot-launch-checklist.md`

## 10. 当前判断

当前状态：测试用户版本的工程、文档、桌面端与移动端截图验收、邀请模板和发布清单均已准备好。真实测试家庭邀请前仍需由项目方指定运营/数据请求/安全复核负责人，并完成法律/隐私负责人复核。
