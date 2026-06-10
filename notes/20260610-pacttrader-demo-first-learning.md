# 2026-06-10｜PactTrader Demo-first 入口学习笔记

## 1. 今天先解决 / 理解的问题

今天围绕 PactTrader 做了一个看似很小、但对 Hackathon Demo 很重要的调整：

> 落地页不再要求用户先连接钱包，而是改成 **Try Demo**。

这背后其实是一个产品判断：PactTrader 是一个 Web3 Agent 项目，但用户第一次打开页面时，最需要理解的不是“怎么连接钱包”，而是：

- Agent 被什么边界限制？
- Pact / policy 如何保护用户资产？
- CAW 在执行层负责什么？
- 越界动作会不会被拒绝？
- 审计日志能不能复盘整个过程？

如果第一步就让用户连接钱包，体验会变成“钱包工具优先”；如果第一步是 Try Demo，体验会变成“先理解产品价值”。今天的改动就是把入口从前者调整成后者。

## 2. 一句话收获

> Hackathon Demo 的第一目标不是证明用户会连接钱包，而是让用户尽快看懂项目解决了什么问题。

对 PactTrader 来说，这句话可以展开成：

> 先让用户看到 Agent 如何在 Pact 边界内生成、检查和执行策略，再让用户进入真实钱包 / CAW 配对路径。

## 3. 为什么落地页不应该强制连接钱包

真实 Web3 产品常见路径是：

```text
打开网站
  -> Connect Wallet
  -> 读取账户状态
  -> 进入产品功能
```

但 Hackathon Demo 的场景不同：

- 评委可能没有准备对应钱包插件。
- 钱包可能不在正确测试网。
- 测试网资产可能不足。
- 浏览器环境可能限制钱包弹窗。
- 连接钱包之前，评委还不知道这个产品值不值得继续看。

所以对 PactTrader 来说，Demo 入口更适合变成：

```text
打开落地页
  -> Try Demo
  -> Dashboard
  -> 预置 Agent Wallet / Demo State
  -> 策略 proposal
  -> Pact / policy decision
  -> CAW execution / dry-run result
  -> SQLite audit log
```

这样用户先看到完整故事，再决定是否进入真实钱包路径。

## 4. PactTrader 的 Demo-first 产品路径

今天调整后的路径可以理解为三层：

### 4.1 Public Landing：先讲价值

落地页负责回答：

- PactTrader 是什么？
- 为什么不是让 AI 自由操作资产？
- CAW / Pact 如何限制 Agent 权限？
- 用户为什么可以先试 Demo？

主 CTA：

```text
Try Demo
```

而不是：

```text
连接钱包
```

### 4.2 Demo Dashboard：先看完整流程

Dashboard 负责让用户直接看到：

- 预置 Agent Wallet 状态；
- 当前策略或 portfolio 状态；
- Agent proposal；
- Pact / policy 边界；
- 执行结果或 dry-run 结果；
- 审计日志。

这一步可以不依赖浏览器钱包，重点是把 PactTrader 的核心机制跑通。

### 4.3 Advanced / Real Wallet Path：再连接真实钱包

真实钱包连接仍然重要，但它应该出现在更后面：

- 用户想创建自己的 Agent Wallet；
- 用户想绑定自己的 EOA；
- 用户想导入 / 配对真实 CAW；
- 用户想做真实测试网执行；
- 用户想重置或管理钱包状态。

这条路径保留，但不再阻塞 Demo 第一印象。

## 5. 今天的技术实现拆解

### 5.1 抽出 Demo access helper

新增共享逻辑：

```text
shared/utils/demo-access.ts
```

它把“能不能进入 Dashboard”的判断从页面 / middleware 里抽出来，避免不同地方各自写一套条件。

核心思路：

```text
如果浏览器钱包已连接 -> 可以进入
如果 preparation 已 ready -> 可以进入
如果预置 Demo / Agent Wallet 状态可用 -> 可以进入
否则 -> 不能进入
```

这样 Dashboard 路由守卫和落地页导航都可以复用同一个判断。

### 5.2 Route guard 从 wallet-first 改成 demo-aware

原来的逻辑更像：

```text
访问 /dashboard
  -> 检查 EOA connected
  -> 检查 wagmi isConnected
  -> 都没有则返回首页
```

今天改成：

```text
访问 /dashboard
  -> 读取 preparation
  -> 调用 canEnterDashboard
  -> Demo / ready / wallet 任一满足即可进入
  -> 否则返回首页
```

这让 Demo 入口能直接进入 Dashboard，同时仍然保留非 Demo 状态下的保护。

### 5.3 Landing CTA 改成 Try Demo

`app/pages/index.vue` 里删除了落地页主 CTA 对钱包连接状态的依赖。

之前：

```text
未连接 -> 显示“连接钱包”按钮
已连接 -> 显示“进入控制台”
```

现在：

```text
始终显示 Try Demo -> /dashboard
```

这会让落地页的用户路径更稳定，也更适合公开 Demo。

### 5.4 Header / How it works / Footer 文案同步

今天还同步调整了：

- Header：直接显示 Try Demo。
- How it works：第一步改为“进入 Demo 环境”，而不是“连接 EOA”。
- Footer：Dashboard 链接显示逻辑复用 Demo access helper。
- 落地页底部 CTA：强调先体验预置 Demo，再进入真实钱包配对路径。

这些改动的目标是避免页面不同区域出现互相矛盾的引导。

## 6. 测试设计：不要只改按钮，要验证行为

今天新增了：

```text
tests/demo-access.test.ts
```

测试覆盖三个关键行为：

1. **Demo 访客无浏览器钱包也能进入 Dashboard**

```text
preparation.ready = true
browserWalletConnected = false
=> canEnterDashboard = true
```

2. **非 Demo 且无钱包仍然被拦截**

```text
preparation.ready = false
browserWalletConnected = false
=> canEnterDashboard = false
```

3. **落地页主 CTA 是 Try Demo**

```text
landingPrimaryCta().label = "Try Demo"
landingPrimaryCta().href = "/dashboard"
```

这个测试很重要，因为它防止后续不小心又把落地页改回 wallet-first。

## 7. 和 CAW / Pact 架构的关系

Try Demo 并不是绕过安全模型，而是为了更好地解释安全模型。

PactTrader 的实际架构仍然是：

```text
User Intent
  -> Agent / Z.AI Strategy Layer
  -> TradeProposal JSON
  -> Local Risk Engine
  -> Pact / CAW Execution Boundary
  -> Execution Result or Denial
  -> SQLite Audit Log
```

Demo-first 只是改变“用户先看到什么”：

- 先看到 proposal、policy、Pact、audit；
- 再理解真实钱包如何接入；
- 最后才进入真实 CAW 执行路径。

这对 Agentic Wallet 项目尤其重要，因为用户最担心的不是按钮能不能点，而是：

- Agent 会不会越权？
- 钱会不会被随便动？
- 用户是否能撤销或限制权限？
- 出问题后能否复盘？

Try Demo 能更快回答这些问题。

## 8. 今天的验证结果

今天完成后跑了三层验证。

### 8.1 Targeted tests

```text
pnpm test tests/demo-access.test.ts tests/pacttrader-demo-wallet.test.ts tests/pacttrader-demo-create-agent-api.test.ts -- --runInBand
```

结果：

```text
3 个 test files 通过
7 个 tests 通过
```

### 8.2 Full test suite

```text
pnpm test -- --runInBand
```

结果：

```text
48 个 test files 通过
1 个 skipped
164 个 tests 通过
1 个 skipped
```

### 8.3 Production build

```text
pnpm build
```

结果：

```text
Nuxt / Nitro 生产构建成功
```

## 9. 今天的 Proof-of-Work

代码提交：

```text
e880a80 feat: make landing enter demo without wallet
```

相关文件：

```text
app/pages/index.vue
app/components/AppNav.vue
app/components/landing/LandingHowItWorks.vue
app/components/landing/LandingSiteFooter.vue
app/middleware/require-wallet.global.ts
shared/utils/demo-access.ts
tests/demo-access.test.ts
```

前置相关提交：

```text
3a6a617 feat: add preset PactTrader demo wallet mode
86ba942 feat: enhance wallet preparation and reset process
```

这些提交合在一起，让 PactTrader 的 Demo 路径变成：

```text
预置 Demo Wallet / Agent State
  + Try Demo Landing Entry
  + Demo-aware Dashboard Guard
  + Tests
  + Build Verification
```

## 10. 我对今天改动的产品理解

今天这个改动让我更明确一个点：

> Web3 Agent 的安全感不是靠“先连接钱包”建立的，而是靠清晰的权限边界、可验证的拒绝逻辑和可复盘的审计日志建立的。

连接钱包只是入口手段，不是核心价值。

PactTrader 的核心价值应该通过 Demo 先被看见：

- Agent 能提出建议；
- Policy 能判断边界；
- CAW / Pact 能限制执行；
- SQLite 能记录全过程；
- 用户最终仍然保留授权和撤销能力。

如果用户先看懂这些，再去连接真实钱包，信任感会更强。

## 11. 下一步可以继续做什么

1. **整理 Demo Script**  
   按 `Landing -> Try Demo -> Dashboard -> Strategy -> Pact -> Audit` 写一版 2–3 分钟演示脚本。

2. **部署后验证**  
   在 Vercel 环境确认 `/dashboard` 能稳定进入预置 Demo，不依赖 localhost 或本地钱包状态。

3. **统一项目命名**  
   继续检查页面和文档里是否还有旧 YieldAgent 命名，逐步收敛到 PactTrader 当前主线。

4. **准备 WCB proof**  
   把今天的工程结果整理成自然中文 proof，但提交前先确认 WCB 任务状态。

## 12. 公开笔记边界

本学习笔记只记录公开安全内容：

- 产品路径思考；
- 技术实现方向；
- commit 和测试结果；
- 架构学习总结。

不记录：

- `.env`；
- API Key；
- 私钥 / 助记词；
- 真实资金地址；
- 未公开会议链接；
- 未确认公开的 Hackathon 私密策略。
