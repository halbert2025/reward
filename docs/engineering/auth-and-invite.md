# Reward 测试用户版身份与邀请方案

日期：2026-05-25  
阶段：P1 Auth & Family Invite  
状态：实现前设计

## 1. 目标

把当前 demo 的 mock role switcher 推进为测试用户可用的真实身份与邀请体系，同时保留开发环境 mock 能力。

本阶段目标：

- parent 可以登录并创建家庭。
- parent 可以生成 child 邀请码。
- child 可以通过邀请码加入家庭。
- parent 可以生成 witness 链接。
- production/pilot 环境默认关闭 mock role switcher。
- server action/API 从当前 session 获取 actor，不再依赖 seed actor。

## 2. 当前基线

现有模型已经具备：

- `User`
- `Family`
- `FamilyMember`
- `Witness`
- `AuditLog`

现有缺口：

- 缺少登录 session。
- 缺少一次性登录码或 magic link token。
- 缺少 child 邀请码模型。
- 缺少 invite 过期、使用次数和撤销字段。
- 大量 server action 仍使用 `seed_parent` / `seed_child`。

## 3. 推荐身份策略

### Parent

第一批测试用户建议使用轻量邮箱登录：

- parent 输入邮箱。
- 系统生成一次性测试码或 magic link token。
- 测试阶段可先在页面上展示测试码，正式发邀请前再接邮件服务。
- 登录后写入 httpOnly session cookie。

### Child

child 不强制邮箱或手机号：

- parent 创建 child invite code。
- child 输入邀请码和昵称。
- 系统创建或绑定 child user。
- child 加入对应 family。
- child session 只绑定该 child user。

### Witness

witness 使用弱身份链接：

- parent 生成 witness token。
- witness 访问 token 链接。
- 只显示 safe summary。
- 不建立完整账号，除非后续需要。

### Admin

admin 使用 allowlist：

- 通过 env 配置 admin email。
- admin 只能访问运营后台。
- admin 操作必须写 AuditLog。

## 4. 建议新增 Prisma 模型

```prisma
enum InviteRole {
  child
  witness
}

enum InviteStatus {
  active
  used
  expired
  revoked
}

model AuthSession {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
  revokedAt DateTime?
  user      User     @relation(fields: [userId], references: [id])
}

model LoginToken {
  id        String   @id @default(cuid())
  email     String
  tokenHash String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
  usedAt    DateTime?
}

model FamilyInvite {
  id          String       @id @default(cuid())
  familyId    String
  createdById String
  role        InviteRole
  tokenHash   String       @unique
  displayCode String?      @unique
  maxUses     Int          @default(1)
  usedCount   Int          @default(0)
  status      InviteStatus @default(active)
  createdAt   DateTime     @default(now())
  expiresAt   DateTime
  revokedAt   DateTime?
  family      Family       @relation(fields: [familyId], references: [id])
  createdBy   User         @relation(fields: [createdById], references: [id])
}
```

实现时需要同步补：

- `User.authSessions`
- `Family.invites`
- `User.createdInvites`

## 5. Cookie 与环境变量

建议 cookie：

- `reward_session`
- httpOnly
- sameSite=lax
- secure 在 production 开启
- maxAge 建议 7 天

建议环境变量：

- `AUTH_SECRET`
- `APP_BASE_URL`
- `REWARD_ENABLE_MOCK_ROLE_SWITCHER`
- `ADMIN_EMAIL_ALLOWLIST`

默认：

- development：可以开启 mock role switcher。
- test：可以开启 mock role switcher。
- production/pilot：关闭 mock role switcher。

## 6. Server Actor 解析

新增统一入口：

```ts
getCurrentActor()
```

解析顺序：

1. 如果存在有效 `reward_session`，从 session 查真实 user 和 family member。
2. 如果没有 session，且环境允许 mock role switcher，则回退 `getCurrentMockActor()`。
3. 如果都没有，返回 unauthenticated 或 redirect login。

后续 server action 不再直接调用 `getCurrentMockActor()`，而是逐步替换为 `getCurrentActor()`。

## 7. 新增页面

建议新增：

- `/auth/login`：parent 邮箱登录入口。
- `/auth/verify`：测试码或 token 验证。
- `/family/new`：创建家庭。
- `/invite/child/[code]`：child 输入昵称加入家庭。
- `/parent/invites`：家长管理 child/witness 邀请。

后续可合并部分页面，但初期拆开更利于测试。

## 8. 权限规则

必须满足：

- 未登录 parent 不能创建家庭。
- 未加入 family 的用户不能访问 family 数据。
- child 只能访问自己所属 family。
- child 不能创建 parent response。
- witness 不能访问 ChildNote、Evidence、金额、RepairCase detail。
- parent 不能读取 ChildNote 原文。
- admin 不能伪装 child 修改家庭业务数据，除非通过明确人工处理流程。

## 9. 审计日志

以下事件必须写 AuditLog：

- `parent_logged_in`
- `family_created`
- `child_invite_created`
- `child_joined_family`
- `witness_invite_created`
- `invite_revoked`
- `session_revoked`

## 10. P1 实现顺序

1. 增加 Prisma 模型与迁移。
2. 增加 session/token helper。
3. 实现 parent 登录。
4. 实现 family 创建入口改为当前 actor。
5. 实现 child invite 创建与加入。
6. 实现 mock role switcher 环境开关。
7. 将关键 server action 从 seed actor 替换为 `getCurrentActor()`。
8. 补 unit/integration/E2E。

## 11. P1 验收标准

- parent 可登录并创建 family。
- parent 可生成 child invite code。
- child 可用 invite code + nickname 加入 family。
- production/pilot 环境不显示 mock role switcher。
- child 越权创建 parent response 被拒绝。
- witness 不能看隐私数据。
- 关键身份和邀请事件写 AuditLog。

