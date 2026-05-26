# Reward Pilot Launch Checklist

日期：2026-05-26  
阶段：第一批测试家庭发送邀请前

## 1. 工程验收

- [x] `npm.cmd run typecheck` 通过
- [x] `npm.cmd test` 通过，18 passed
- [x] `npm.cmd run build` 通过
- [x] Playwright Chromium E2E 通过，15 passed
- [x] Seed / E2E reset 可重复运行
- [x] Admin console E2E 覆盖访问控制、状态更新、note 必填和审计验证

## 2. 产品范围

- [x] Web/PWA 首版范围已冻结
- [x] 不做真实照片上传
- [x] 不做真实 AI/Kimi
- [x] 不做真实推送
- [x] 不做支付、排名、开放儿童社交、学校/机构场景
- [x] 猫猫番茄钟低刺激体验可运行
- [x] 奖励小票数据边界已定义

## 3. 隐私与安全

- [x] 家长测试告知与同意文本已落地
- [x] 儿童友好说明已落地
- [x] ChildNote 默认孩子私密
- [x] Witness 只看安全摘要
- [x] 数据导出、删除、封存、退出请求入口可用
- [x] Account-level operations 使用 `OperationalEvent` 留痕
- [x] Family-linked operations 使用 `AuditLog` 留痕
- [ ] 法律/隐私负责人复核正式隐私政策与未成年人数据说明

## 4. 运营准备

- [x] `/admin/pilot` 可供 allowlist admin 使用
- [x] `/feedback` 可收集家长/孩子/见证人反馈
- [x] Safety feedback 可进入人工风险队列
- [x] 测试邀请模板已完成：`docs/research/pilot-test-invite-template.md`
- [ ] 指定第一批测试运营负责人
- [ ] 指定数据请求处理负责人
- [ ] 指定异常情绪/安全风险人工复核负责人

## 5. 视觉验收

- [x] 桌面端视觉截图已归档
- [x] 移动端 390px / 430px 窄屏截图已归档：`docs/reviews/2026.05.26 Reward移动端视觉验收记录.md`
- [ ] 测试地址上线后做一次真实 URL 冒烟截图

## 6. 发布前最后确认

- [ ] 设置 `REWARD_ADMIN_EMAILS`
- [ ] 确认测试环境 `DATABASE_URL` 指向 PostgreSQL
- [ ] 确认 `AI_PROVIDER_MODE=mock` 或 `template`
- [ ] 确认 mock role switcher 在测试用户环境关闭
- [ ] 确认 `/api/health` 正常
- [ ] 确认可暂停新邀请
- [ ] 确认回滚负责人和回滚说明

## 7. 当前结论

当前代码和文档已具备受控测试家庭邀请前的主体条件。真实发送邀请前，仍需完成移动端窄屏截图、测试环境真实 URL 冒烟、运营负责人指定、以及法律/隐私负责人复核。
