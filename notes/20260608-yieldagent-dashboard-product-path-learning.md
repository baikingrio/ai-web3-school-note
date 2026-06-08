# 2026-06-08｜YieldAgent Dashboard 产品路径学习笔记

## 1. 今天先解决 / 理解的问题

今天同步 YieldAgent 最新代码后，最明显的变化是：项目开始从“分散的 demo 页面”收敛成“有入口、有门禁、有 onboarding、有控制台结构”的产品。

这对 Hackathon 很重要。一个 Agentic Wallet 项目如果只是把很多页面堆出来，评委或用户很难马上理解：

- 我应该先做什么？
- 我的 EOA 钱包和 Agent Wallet 是什么关系？
- Agent 到底什么时候有权限？
- Pact 边界在哪里？
- Dashboard 上的策略、Pact、日志和收益图分别回答什么问题？

今天的代码变化主要是在回答这些问题。

## 2. 一句话收获

> YieldAgent 的产品体验不能从“AI 帮你执行策略”开始，而应该从“用户先连接钱包、准备 Agent Wallet、定义 Pact 边界”开始。

换句话说：

> 好的 Agentic Wallet demo，要先让用户看懂控制权在哪里，再让用户看见自动化执行。

这和 YieldAgent 的核心表达一致：

> Pact before profit.

## 3. 路由结构：从多个页面到一个 dashboard

之前 YieldAgent 的页面更像一组平行页面：

```text
/
/wallet
/create-strategy
/pacts
/history
/settings
```

今天代码把主路径收敛成：

```text
/
/dashboard
/dashboard/create-strategy
/dashboard/pacts
/dashboard/history
/dashboard/settings
```

旧路径仍然保留为薄重定向，这样不会破坏已有链接，但产品主线会更清晰。

我对这个调整的理解是：

- `/` 负责讲产品定位和价值；
- `/dashboard` 负责承载用户操作；
- `/dashboard/*` 是控制台内的具体功能；
- `/wallet` 不再是孤立页面，而是 dashboard onboarding 的一部分。

这对 demo 叙事很有帮助。后续演示时可以按一条线讲：

```text
Landing page
  -> Connect wallet
  -> Dashboard onboarding
  -> Agent Wallet setup
  -> Create strategy
  -> Review Pact
  -> Execute / audit / redeem
```

## 4. Dashboard layout 的意义

新增的 `app/layouts/dashboard.vue` 很短，但它表达了一个重要产品逻辑：

```vue
<AppNav variant="dashboard" />
<DashboardSidebar v-if="preparationReady" />
<slot />
```

这里有一个关键点：**只有 Agent Wallet 准备好后，才显示 dashboard sidebar。**

这不是纯 UI 选择，而是产品顺序：

1. 先连接 EOA；
2. 再创建 / 导入 Agent Wallet；
3. 再注入测试网 USDC；
4. 然后才进入策略、Pact、历史、设置这些页面。

如果一开始就展示完整侧栏，用户可能会跳到创建策略或 Pact 页面，但还没有钱包和资金，这会让 demo 路径混乱。现在 dashboard layout 把“准备状态”变成了产品门槛。

## 5. 钱包连接门禁：先有用户上下文，再进入控制台

新增的 `app/middleware/require-wallet.global.ts` 会在进入 `/dashboard` 时检查：

```text
是否访问 /dashboard
  -> 获取 preparation 状态
  -> 检查 store 中 EOA 是否 connected
  -> 检查 wagmi 当前钱包是否 connected
  -> 如果都没有，回到首页
```

这一步让我意识到：钱包连接不只是一个按钮状态，而是整个 Web3 产品的用户上下文。

对于 YieldAgent 来说：

- 没有 EOA，就没有“谁在授权”；
- 没有 Agent Wallet，就没有“Agent 操作哪一小块资金”；
- 没有 Pact，就没有“Agent 被允许做什么”。

所以 dashboard 的门禁逻辑，其实是在产品层强调：先确认用户身份和钱包上下文，再谈 Agent 执行。

## 6. AppWalletStatus：把钱包状态放到产品入口

新增的 `AppWalletStatus.vue` 把钱包连接放到 Header 里：

- 未连接时显示“连接钱包”；
- 已连接时显示简短地址；
- 显示当前网络；
- 网络不一致时用状态提示；
- 支持断开钱包。

这让钱包状态不再藏在某个设置页面，而是成为全局产品入口。

这个设计对 Agentic Wallet 很自然：用户在任何页面都应该知道当前是不是连接了钱包、连接的是哪个地址、网络是否正确。否则创建策略、审批 Pact、注资、执行这些动作都会失去上下文。

## 7. DashboardOnboarding：把 Agent Wallet 准备流程变成主路径

今天新增的 `DashboardOnboarding.vue` 是我觉得很关键的一个组件。

它把 Agent Wallet 设置流程整合到 dashboard 入口：

```text
EOA 已连接
  -> 创建 / 导入 Agent Wallet
  -> 注入测试网 USDC
  -> 展示准备状态 summary
  -> ready 后进入创建策略
```

这个流程让 YieldAgent 的安全边界更容易被讲清楚：

- EOA 是用户自己的完整钱包；
- Agent Wallet 是用户主动准备给 Agent 的小额测试网资金账户；
- Agent 只能在 Agent Wallet + Pact 约束下执行；
- 控制台只有在这个准备流程完成后才进入完整功能。

这比直接让用户填写策略要更可信。

## 8. 从 demo 命名到 app 命名

今天代码里有一组重命名很值得注意：

```text
app/stores/demo.ts        -> app/stores/app.ts
shared/types/demo.ts      -> shared/types/app.ts
server/utils/demo-store.ts -> server/utils/app-store.ts
```

这类改动看起来像代码清理，但实际上是项目阶段变化：

- `demo` 更像一次性演示；
- `app` 更像可以持续迭代的产品。

YieldAgent 当然目前还是 Hackathon MVP，但从工程组织上减少 demo 命名，可以让后续迭代更自然：策略、Pact、日志、钱包状态、收益曲线都属于 app state，而不只是 demo state。

## 9. 自然语言策略解析：LLM 可以理解，规则必须兜底

今天 `server/utils/hermes-strategy-parser.ts` 的变化很有学习价值。

一个典型输入是：

```text
在 Base Sepolia 测试网，每日投入最多 1 USDC 买入 ETH，可以采用策略分批买入，累计买入一周。
```

新逻辑会理解：

- “每日 1 USDC”；
- “一周”；
- 所以总预算 `maxSpend = 7`；
- “买入 ETH / swap” 属于更高风险动作；
- riskLevel 不能简单按 conservative 处理。

更重要的是，Hermes / LLM 输出后仍然要经过 deterministic validation：

- maxSpend 必须在范围内；
- maxSpend 不能超过 Agent Wallet 可用余额；
- fee 必须在 0–30%；
- user split 必须在 0–100%；
- APY 输入要能安全解析；
- 网络要和 Agent Wallet 注资网络一致。

这让我更清楚地理解 Agent 产品的分层：

```text
LLM / Agent：理解用户意图
Deterministic validator：检查参数边界
Pact：限制执行权限
CAW：真正执行或拒绝动作
SQLite logs：记录发生了什么
```

如果只靠 LLM 解析，很容易出现“听起来合理但越界”的参数；如果只靠表单，又少了 Agent 产品的体验。两者结合才更适合 YieldAgent。

## 10. 收益快照：让收益图从静态展示走向状态同步

今天新增的 `server/utils/yield-snapshot.ts` 让 dashboard 收益曲线更接近真实产品。

它的核心逻辑是：

```text
读取当前 supplied amount
  -> 和上一次 supplied amount 比较
  -> 如果增加，计算 delta
  -> 累加到 cumulative yield
  -> 写入 yieldSeries7d
```

这说明 YieldAgent 的 dashboard 不只是展示静态 chart，而是开始从链上 / 协议仓位中同步状态。

这对收益策略 Agent 很重要，因为用户最终关心的不只是：

- Agent 有没有执行？
- tx hash 是什么？

还包括：

- 现在仓位是多少？
- 收益曲线有没有变化？
- 赎回前后状态是否能解释？

当然，目前这仍然是测试网 MVP 逻辑，但方向是对的：把执行结果和 dashboard 数据连接起来。

## 11. 今天的测试验证

今天同步代码后，我做了本地验证：

```bash
pnpm test
pnpm build
```

结果：

- `pnpm test`：通过。
  - 32 个 test files；
  - 31 个通过，1 个跳过；
  - 112 个测试通过，1 个跳过。
- `pnpm build`：通过。
  - Nuxt / Nitro 生产构建成功。

新增或相关测试包括：

- `tests/hermes-strategy-parser.test.ts`：自然语言解析、周预算、风险等级、Hermes 返回参数校验。
- `tests/strategy-validator.test.ts`：数值解析和边界校验。
- `tests/strip-legacy-prep.test.ts`：清理历史 preparation 状态。
- `tests/yield-snapshot.test.ts`：收益快照增量和 7 日曲线更新。
- `tests/pact-lookup.test.ts`：Pact 查找逻辑。

构建仍然有一些 warning：

- duplicated imports；
- BigInt literals target 是 es2019；
- `node:sqlite` 被 external；
- 这些目前不阻断本地 build，但部署到 Vercel 前需要继续确认。

## 12. 产品叙事上的变化

今天之前，YieldAgent 已经可以讲：

```text
Agent 在 Pact 边界内执行收益策略。
```

今天之后，可以讲得更像真实产品：

```text
用户打开首页理解产品定位；
连接 EOA 钱包；
进入 dashboard 完成 Agent Wallet 设置；
注入小额测试网 USDC；
用自然语言或表单创建策略；
策略被转换成 Pact 边界；
Pact 激活后 Agent 执行；
执行、拒绝、收益、赎回都在 dashboard 中可见。
```

这条路径更适合 Hackathon 演示，因为它不是单点功能，而是一条完整用户旅程。

## 13. 后续可以继续推进的方向

### 13.1 Demo script 重写

需要按新的 dashboard 路由重写演示路径：

```text
1. 打开首页，讲 Pact before profit。
2. 点击连接钱包，展示 AppWalletStatus。
3. 进入 /dashboard，展示 Agent Wallet onboarding。
4. 完成 Agent Wallet 设置和测试网 USDC 注资。
5. 进入 /dashboard/create-strategy，用自然语言生成策略。
6. 展示 Pact Preview 和 deterministic validation。
7. 进入 /dashboard/pacts，展示 Pact 状态、执行、拒绝、赎回。
8. 进入 /dashboard/history，展示 audit trail。
9. 回到 dashboard overview，展示收益曲线和策略状态。
```

### 13.2 部署边界继续确认

后续仍然要注意：

- Vercel 不能假设有本地 TSS Node；
- Vercel 不能直接调用本机 Hermes CLI；
- CAW TSS Node 和 Hermes / Strategy runtime 应该放在当前 Hermes Agent 主机；
- Vercel server/API 需要通过公网 API 或 tunnel 调用远程 runtime；
- `.env`、API Key、pact-scoped credentials 只能保存在服务端。

### 13.3 构建 warning 清理

本地 build 通过，但后续最好处理：

- duplicated imports：避免 Nitro auto-import 选择错来源；
- BigInt target：确认 Vercel / Nitro 目标环境；
- `node:sqlite`：确认线上 runtime 是否可用，或准备替代存储方案。

## 14. 今日总结

今天的 YieldAgent 进展让我更清楚地看到：一个 Agentic Wallet Hackathon 项目，不能只做“执行交易”的功能，而要把用户控制权、钱包准备、权限边界、状态可见性和审计记录连成一条产品路径。

今天的关键词是：

```text
Landing
Wallet connection
Dashboard onboarding
Agent Wallet readiness
Pact-bound strategy
Deterministic validation
Yield snapshot
Auditability
```

这条路径让 YieldAgent 更像一个真实产品，而不只是一个技术 demo。
