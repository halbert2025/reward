# Reward MVP Demo Package

这是 Reward 家庭愿望契约系统的本地 MVP Demo 包。

## 环境要求

- Windows/macOS/Linux 均可
- Node.js 20+
- npm

## 启动步骤

在解压后的目录执行：

```powershell
npm install
Copy-Item .env.example .env
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
npm.cmd run dev
```

浏览器打开：

```text
http://localhost:3000
```

如果不是 Windows PowerShell，可把 `Copy-Item .env.example .env` 换成：

```bash
cp .env.example .env
```

## 电脑端验收文件

打开：

```text
docs/acceptance/reward-mvp-computer-acceptance.html
```

里面包含页面入口、验收脚本和通过标准。

## 推荐演示路径

1. 家长 onboarding：创建家庭、确认原则、初始化奖池。
2. 家长创建首个小约定。
3. 孩子确认约定。
4. 孩子进入猫咪愿望后院，启动猫咪番茄钟。
5. 孩子提交一句复盘。
6. 家长选择已兑现、延期或一起复盘。
7. 查看亲子日记。
8. 孩子写私密小纸条，确认家长和见证人看不到正文。
9. 家长生成纪念见证人邀请，见证人发送祝福。

## 验证命令

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd run verify:seed
```

## 注意事项

- 这是本地 demo，不包含真实登录。
- Kimi/AI 默认是 mock，不需要 API Key。
- 证据照片是 mock 占位，不做真实上传。
- 通知是站内/模拟通知，不做真实推送。
- 不包含 `node_modules`，接收者需要运行 `npm install`。
