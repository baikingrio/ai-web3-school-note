# PactTrader｜技术架构文档 + 目录结构 + 开发任务拆解

> 版本：v0.1  
> 日期：2026-06-03  
> 项目主线：PactTrader  
> 定位：基于 Cobo Agentic Wallet（CAW）/ Pact 的受限组合再平衡 Agent  
> 保存原则：本文只保存公开安全的架构设计，不包含任何私钥、API Key、助记词、真实资金地址或未确认提交信息。

---

## 1. 项目主线

PactTrader 是一个 **policy-bound portfolio rebalancing agent**：用户先设置交易授权边界，例如 token 白名单、协议白名单、单笔上限、日预算、滑点、止损和有效期；Agent 只能在这些边界内生成结构化再平衡建议，并通过 CAW 执行层提交受限交易。越界动作会被本地风控或 CAW Pact 拒绝 / 进入 pending approval，所有过程写入 SQLite 审计日志。

一句话：

> PactTrader 不是“让 AI 自由炒币”，而是让 AI 在用户明确授权的 Pact 范围内执行小额、可解释、可撤销、可审计的组合再平衡。

---

## 2. 技术栈确定

### 2.1 前端技术栈

- **Nuxt.js**：作为全栈前端框架，负责页面、API route、SSR / SPA 能力。
- **Vue**：页面组件和交互层。
- **TypeScript**：统一类型定义，减少交易 proposal / policy / audit log 字段不一致。
- **Tailwind CSS**：快速构建 dashboard 样式。
- **shadcn-vue/ui**：用于卡片、表单、按钮、弹窗、表格、Badge 等基础 UI。

### 2.2 执行层技术栈

- **CAW（Cobo Agentic Wallet）**：作为目标资金执行层。
- **Pact / policy evaluation**：用于 scoped authorization、pending approval、denial、执行边界验证。
- **CAW SDK / API wrapper**：封装 health check、wallet、balance、pact、transaction、contract call 等调用。
- **Fallback 原则**：若 CAW 凭证或测试环境受限，可以保留 Safe + Zodiac Roles dry-run / fallback，但对外说明必须透明，不能包装成已完成 CAW 集成。

### 2.3 Agent / 策略层技术栈

- **Z.AI API**：用于策略层 LLM 调用。
- **结构化输出**：Agent 不直接执行交易，只输出 `TradeProposal` JSON。
- **本地 deterministic strategy fallback**：MVP 阶段保留纯函数再平衡计算，避免演示完全依赖 LLM 不稳定输出。
- **Risk Engine**：本地硬风控，先于 CAW 调用执行，拒绝明显越界动作。

### 2.4 数据库 / 日志技术栈

- **SQLite**：保存策略输入、proposal、risk decision、CAW result、portfolio snapshot、audit log。
- **本地开发优先**：MVP 先用本地 SQLite 文件；部署到 Vercel 时需要注意 serverless 文件系统限制，生产形态可迁移到托管 SQLite / Turso / libSQL。
- **审计优先**：每次建议、拒绝、pending、执行结果都必须可复盘。

### 2.5 部署技术栈

- **Vercel**：部署 Nuxt.js 前端和 API routes。
- **环境变量**：Z.AI API Key、CAW credentials、RPC URL 等只放在 Vercel env / 本地 `.env`，不进入仓库。
- **Demo 模式**：Vercel 部署默认可以运行 mock portfolio + dry-run，真实 CAW 调用由环境变量控制开关。

---

## 3. 总体架构

```text
User / Demo Viewer
  -> Nuxt.js Dashboard
      -> Strategy Setup Form
      -> Portfolio State View
      -> Agent Proposal View
      -> Risk & Pact Decision View
      -> Audit Log View

Nuxt API Routes / Server Layer
  -> Portfolio Service
  -> Strategy Agent Service（Z.AI API）
  -> Local Risk Engine
  -> CAW Client / Pact Client
  -> SQLite Audit Store

Execution Flow
  User Intent
    -> Portfolio Snapshot
    -> Strategy Agent / Rebalance Calculator
    -> TradeProposal JSON
    -> Local Risk Engine
    -> CAW Pact / Transaction Submit or Dry-run
    -> Allowed / Pending Approval / Denied
    -> SQLite Audit Log
    -> Dashboard Update
```

核心原则：

1. **Agent 只提建议**：Agent 输出结构化 proposal，不拥有最终授权权力。
2. **Policy 先裁决**：本地 Risk Engine 做确定性硬检查，明显越界不调用 CAW。
3. **CAW 再执行**：只有本地检查通过的动作才进入 CAW / Pact。
4. **日志全记录**：无论成功、失败、pending、拒绝，都写入 SQLite。
5. **Demo 可降级**：CAW 不可用时，仍可用 mock / dry-run 展示完整安全逻辑。

---

## 4. 模块分层

### 4.1 Presentation Layer：前端展示层

职责：

- 展示目标组合、当前组合、偏离比例。
- 让用户设置授权边界：token、protocol、amount、budget、slippage、stop-loss、expiry。
- 展示 Agent proposal。
- 展示本地风控和 CAW Pact 裁决结果。
- 展示审计日志。

建议页面：

- `/`：项目首页 / Demo 入口。
- `/dashboard`：主控制台。
- `/setup`：策略和 Pact 边界设置。
- `/proposals`：交易建议列表。
- `/audit`：审计日志。

### 4.2 Strategy Layer：Agent / 策略层

职责：

- 读取 portfolio snapshot 和 user intent。
- 判断是否需要再平衡。
- 生成结构化 `TradeProposal`。
- 调用 Z.AI API 生成解释、摘要或策略建议。
- 保留 deterministic rebalance calculator，保证核心 demo 稳定。

输出示例：

```json
{
  "proposal_id": "trade_001",
  "strategy": "rebalance",
  "action": "swap",
  "from_token": "USDC",
  "to_token": "WETH",
  "amount_in_usd": "20",
  "protocol": "Uniswap V3",
  "max_slippage_bps": 100,
  "reason": "ETH allocation is below the target allocation.",
  "risk_level": "low"
}
```

### 4.3 Policy Layer：本地风控层

职责：

- 检查 strategy 是否允许。
- 检查 from/to token 是否在白名单。
- 检查 protocol / router 是否在白名单。
- 检查单笔金额上限。
- 检查日预算和日交易次数。
- 检查滑点上限。
- 检查 stop-loss / revoked / expired 状态。
- 输出 `allowed` / `pending_required` / `blocked`。

裁决示例：

```json
{
  "decision": "allowed",
  "reason": "Trade is within local policy boundaries.",
  "checks": {
    "strategy_allowed": "pass",
    "token_allowlist": "pass",
    "protocol_allowlist": "pass",
    "max_trade_amount": "pass",
    "daily_budget": "pass",
    "max_trades_per_day": "pass",
    "slippage_limit": "pass",
    "stop_loss": "pass"
  }
}
```

### 4.4 Execution Layer：CAW 执行层

职责：

- 封装 CAW SDK / API 调用。
- 提交 Pact / 查询 Pact 状态。
- 提交 transfer / contract call / swap calldata preview。
- 处理 allowed、pending approval、denied、failed。
- 在 CAW 不可用时支持 dry-run result。

注意：

- Agent 不接触 owner 私钥。
- API Key / credentials 只走环境变量。
- MVP 可以先展示 CAW payload + dry-run / minimal API result，再逐步接真实交易。

### 4.5 Data Layer：SQLite 数据和审计层

职责：

- 保存 user intent。
- 保存 portfolio snapshot。
- 保存 trade proposal。
- 保存 risk decision。
- 保存 CAW execution result。
- 保存 audit event。

最小数据表：

- `intents`
- `portfolio_snapshots`
- `trade_proposals`
- `risk_decisions`
- `execution_results`
- `audit_events`

---

## 5. 建议目录结构

```text
pacttrader/
  README.md
  package.json
  nuxt.config.ts
  tsconfig.json
  .env.example
  .gitignore

  app/
    app.vue
    assets/
      css/
        tailwind.css
    components/
      ui/                         # shadcn-vue/ui 生成组件
      dashboard/
        PortfolioCard.vue
        AllocationChart.vue
        StrategySetupForm.vue
        ProposalCard.vue
        RiskDecisionCard.vue
        AuditLogTable.vue
      layout/
        AppHeader.vue
        AppShell.vue
    composables/
      usePortfolio.ts
      useStrategy.ts
      useAuditLogs.ts
    pages/
      index.vue
      dashboard.vue
      setup.vue
      proposals.vue
      audit.vue

  server/
    api/
      health.get.ts
      portfolio/
        snapshot.get.ts
      strategy/
        propose.post.ts
      risk/
        check.post.ts
      caw/
        health.get.ts
        pact.post.ts
        execute.post.ts
      audit/
        events.get.ts
    services/
      portfolio/
        mockPortfolio.ts
        portfolioService.ts
      strategy/
        rebalanceCalculator.ts
        zAIClient.ts
        strategyAgent.ts
      risk/
        policyTypes.ts
        riskEngine.ts
        policyFixtures.ts
      caw/
        cawClient.ts
        pactClient.ts
        transactionClient.ts
        dryRunExecutor.ts
      audit/
        auditStore.ts
        auditLogger.ts
      db/
        sqlite.ts
        schema.ts
        migrations.ts
    utils/
      env.ts
      ids.ts
      money.ts

  shared/
    types/
      portfolio.ts
      intent.ts
      proposal.ts
      risk.ts
      caw.ts
      audit.ts
    constants/
      tokens.ts
      protocols.ts
      demoPolicy.ts

  data/
    pacttrader.sqlite             # 本地开发生成，不提交
    audit-demo.jsonl              # 可选 demo 导出，不含敏感信息

  docs/
    architecture.md
    demo-script.md
    caw-integration-notes.md
    risk-policy.md

  tests/
    unit/
      rebalanceCalculator.test.ts
      riskEngine.test.ts
    integration/
      strategyFlow.test.ts
      auditStore.test.ts
```

如果继续保存在当前学习仓库中，可先放在：

```text
/home/workspace/ai-web3-school-note/hackathon/pacttrader-technical-architecture.md
```

后续真正创建项目时，再把上面的 `pacttrader/` 作为独立 Nuxt 项目目录。

---

## 6. 核心类型设计

### 6.1 UserIntent

```ts
export type UserIntent = {
  id: string
  strategy: 'rebalance'
  targetAllocation: Record<'USDC' | 'WETH', number>
  rebalanceThreshold: number
  allowedTokens: string[]
  allowedProtocols: string[]
  maxTradeAmountUsd: string
  dailyBudgetUsd: string
  maxTradesPerDay: number
  maxSlippageBps: number
  stopLossPercent: number
  expiresAt: string
  status: 'active' | 'expired' | 'revoked'
}
```

### 6.2 PortfolioSnapshot

```ts
export type PortfolioSnapshot = {
  id: string
  intentId: string
  totalValueUsd: string
  balances: Array<{
    token: 'USDC' | 'WETH'
    amount: string
    valueUsd: string
    allocation: number
  }>
  createdAt: string
}
```

### 6.3 TradeProposal

```ts
export type TradeProposal = {
  id: string
  intentId: string
  strategy: 'rebalance'
  action: 'swap'
  fromToken: string
  toToken: string
  amountInUsd: string
  protocol: string
  maxSlippageBps: number
  reason: string
  riskLevel: 'low' | 'medium' | 'high'
  status: 'draft' | 'checked' | 'submitted' | 'blocked'
  createdAt: string
}
```

### 6.4 RiskDecision

```ts
export type RiskDecision = {
  id: string
  proposalId: string
  decision: 'allowed' | 'pending_required' | 'blocked'
  reason: string
  checks: Record<string, 'pass' | 'fail' | 'warning'>
  createdAt: string
}
```

### 6.5 ExecutionResult

```ts
export type ExecutionResult = {
  id: string
  proposalId: string
  provider: 'caw' | 'dry_run' | 'fallback_safe_roles'
  status: 'allowed' | 'pending' | 'denied' | 'submitted' | 'failed'
  requestId?: string
  transactionHash?: string
  denialReason?: string
  raw?: unknown
  createdAt: string
}
```

---

## 7. MVP 开发任务拆解

### Phase 0：项目初始化

#### Task 0.1 创建 Nuxt 项目

目标：创建 PactTrader Nuxt + TypeScript 项目骨架。

交付：

- `package.json`
- `nuxt.config.ts`
- `tsconfig.json`
- Tailwind CSS 初始化
- shadcn-vue/ui 初始化

验收：

- `npm run dev` 可以启动。
- 首页能显示 PactTrader 标题。

#### Task 0.2 建立基础目录和共享类型

目标：创建 `shared/types`、`server/services`、`app/components` 等目录。

交付：

- `shared/types/intent.ts`
- `shared/types/portfolio.ts`
- `shared/types/proposal.ts`
- `shared/types/risk.ts`
- `shared/types/audit.ts`

验收：

- TypeScript 类型可被 server 和 app 同时 import。

---

### Phase 1：Mock Portfolio + 再平衡计算

#### Task 1.1 创建 mock portfolio service

目标：先不用真实钱包余额，固定演示 `90% USDC / 10% WETH`。

交付：

- `server/services/portfolio/mockPortfolio.ts`
- `server/api/portfolio/snapshot.get.ts`

验收：

- 请求 `/api/portfolio/snapshot` 返回 mock 组合数据。

#### Task 1.2 实现 rebalance calculator

目标：根据目标组合和当前组合计算是否需要 swap。

交付：

- `server/services/strategy/rebalanceCalculator.ts`
- `tests/unit/rebalanceCalculator.test.ts`

核心逻辑：

- 当前 ETH 低于目标超过阈值 → 建议 USDC swap to WETH。
- 单次建议金额不超过 policy max trade amount。
- 偏离低于阈值 → 不生成交易。

验收：

- 90/10 → 70/30 场景生成 `Swap 20 USDC to WETH`。
- 偏离小于 5% 时返回 no-op。

---

### Phase 2：Z.AI Agent 策略层

#### Task 2.1 封装 Z.AI client

目标：把 Z.AI API 调用隔离在单独 service 中。

交付：

- `server/services/strategy/zAIClient.ts`
- `.env.example` 增加 `ZAI_API_KEY=`

验收：

- 没有 `ZAI_API_KEY` 时自动降级到 deterministic strategy。
- 有 `ZAI_API_KEY` 时可以生成自然语言 reason 或结构化 proposal。

#### Task 2.2 创建 strategy proposal API

目标：前端点击按钮后生成交易建议。

交付：

- `server/services/strategy/strategyAgent.ts`
- `server/api/strategy/propose.post.ts`

验收：

- POST `/api/strategy/propose` 返回 `TradeProposal`。
- proposal 字段完整，不包含执行权限。

---

### Phase 3：本地 Risk Engine

#### Task 3.1 定义 policy 类型和 demo policy

目标：把授权边界写成明确配置。

交付：

- `server/services/risk/policyTypes.ts`
- `shared/constants/demoPolicy.ts`

默认 policy：

```text
allowed_tokens: USDC, WETH
allowed_protocols: Uniswap V3
max_trade_amount_usd: 20
max_daily_budget_usd: 100
max_trades_per_day: 3
max_slippage_bps: 100
stop_loss_percent: 5
expiry: 24h
```

验收：

- policy 可被前端展示，也可被后端 risk engine 使用。

#### Task 3.2 实现 risk engine

目标：对 proposal 做 deterministic hard-check。

交付：

- `server/services/risk/riskEngine.ts`
- `server/api/risk/check.post.ts`
- `tests/unit/riskEngine.test.ts`

必须覆盖：

- 正常 20 USDC swap → allowed。
- 80 USDC swap → blocked。
- PEPE / unknown token → blocked。
- unknown protocol → blocked。
- slippage 超限 → blocked 或 pending。
- revoked / expired intent → blocked。

验收：

- 每个拒绝都有明确 `reason`。
- blocked 状态不会继续调用 CAW。

---

### Phase 4：SQLite 审计日志

#### Task 4.1 初始化 SQLite schema

目标：创建最小数据表。

交付：

- `server/services/db/sqlite.ts`
- `server/services/db/schema.ts`
- `server/services/db/migrations.ts`

表：

- `intents`
- `portfolio_snapshots`
- `trade_proposals`
- `risk_decisions`
- `execution_results`
- `audit_events`

验收：

- 本地启动时自动创建数据库。
- 数据库文件不提交到 git。

#### Task 4.2 实现 audit logger

目标：每一步都写日志。

交付：

- `server/services/audit/auditLogger.ts`
- `server/services/audit/auditStore.ts`
- `server/api/audit/events.get.ts`

验收：

- proposal 创建、risk decision、execution result 都有 audit event。
- `/api/audit/events` 可以按时间倒序返回日志。

---

### Phase 5：CAW 执行层

#### Task 5.1 封装 CAW health / client

目标：建立 CAW SDK / API wrapper，不把 CAW 调用散落在业务代码里。

交付：

- `server/services/caw/cawClient.ts`
- `server/api/caw/health.get.ts`
- `.env.example` 增加 CAW 相关变量占位，不写真实值。

验收：

- CAW 未配置时返回 `configured: false`。
- CAW 配置后可做 health check 或最小 API 调用。

#### Task 5.2 实现 dry-run executor

目标：即使 CAW 暂不可用，也能稳定演示 allowed / denied / pending。

交付：

- `server/services/caw/dryRunExecutor.ts`
- `server/api/caw/execute.post.ts`

验收：

- allowed proposal 返回 dry-run allowed result。
- blocked proposal 不进入 executor。
- pending 场景可以返回 pending result。

#### Task 5.3 接入 Pact / transaction submit

目标：把通过本地 risk 的 proposal 转换为 CAW Pact / transaction 请求。

交付：

- `server/services/caw/pactClient.ts`
- `server/services/caw/transactionClient.ts`

验收：

- 至少能生成 CAW request payload。
- 如果真实 CAW 环境可用，能提交并记录 request id / status。
- 如果不可用，清楚返回 dry-run / not configured，不伪造真实执行。

---

### Phase 6：前端 Dashboard

#### Task 6.1 构建 Dashboard 布局

目标：让评委 3 分钟内看懂项目。

交付：

- `app/pages/dashboard.vue`
- `app/components/layout/AppShell.vue`
- `app/components/dashboard/PortfolioCard.vue`
- `app/components/dashboard/StrategySetupForm.vue`

验收：

- 页面展示项目一句话、组合状态、授权边界。

#### Task 6.2 展示 proposal 和 risk decision

目标：把 Agent 建议和 policy 裁决分开展示。

交付：

- `app/components/dashboard/ProposalCard.vue`
- `app/components/dashboard/RiskDecisionCard.vue`

验收：

- 用户可以清楚看到：Agent recommends，Policy decides。
- blocked / pending / allowed 用不同颜色 Badge 展示。

#### Task 6.3 展示 audit log

目标：让每次动作可复盘。

交付：

- `app/pages/audit.vue`
- `app/components/dashboard/AuditLogTable.vue`

验收：

- 展示 timestamp、proposal id、decision、status、reason、tx hash / request id。

---

### Phase 7：Demo Script + Vercel 部署

#### Task 7.1 编写 Demo Script

目标：固定演示路线，避免现场跑偏。

交付：

- `docs/demo-script.md`

必须包含：

1. 正常再平衡 allowed。
2. 超额交易 blocked。
3. 未知 token blocked。
4. stop-loss / revoked 后 blocked。

验收：

- 按脚本 3 分钟内可以讲完。

#### Task 7.2 Vercel 部署配置

目标：让 demo 可在线访问。

交付：

- Vercel project setup
- env var 配置说明
- `README.md` 部署说明

验收：

- Vercel 页面可打开。
- mock / dry-run demo 可用。
- 没有任何 secret 出现在前端 bundle、日志或 repo。

---

## 8. MVP 优先级

### P0：必须完成

- Nuxt.js 项目骨架。
- Dashboard 基础页面。
- Mock portfolio。
- Rebalance calculator。
- TradeProposal JSON。
- Local Risk Engine。
- SQLite audit log。
- CAW wrapper / dry-run executor。
- 至少 1 条 allowed 路径和 1 条 blocked 路径。
- Demo script。

### P1：加分项

- Z.AI API 生成更自然的 reason / explanation。
- CAW health check / wallet list / balance list。
- CAW Pact payload 真实提交或 request id 记录。
- Pending approval 展示。
- 简单 allocation chart。

### P2：延期

- 真实主网交易。
- 多 token / 多策略。
- 实时 price feed。
- Uniswap quote / calldata 完整生成。
- 用户登录和多用户隔离。
- 生产级托管数据库。

---

## 9. 风险与应对

### 风险 1：CAW 凭证或测试环境受限

应对：

- 保留 CAW wrapper 和 payload 设计。
- Demo 使用 dry-run executor。
- 若使用 fallback，明确说明是 Safe + Zodiac Roles fallback，不冒充 CAW 实盘。

### 风险 2：Z.AI API 输出不稳定

应对：

- 核心金额和风控用 deterministic calculator。
- LLM 只负责 reason、summary、strategy explanation。
- 对 LLM 输出做 schema validation。

### 风险 3：Vercel + SQLite 持久化限制

应对：

- 本地开发使用 SQLite 文件。
- Vercel demo 可用 mock / in-memory / read-only seeded demo。
- 后续迁移到 Turso / libSQL。

### 风险 4：被误解成 AI 炒币工具

应对：

- Pitch 强调 policy-bound、small mandate、auditability、revocation。
- 不承诺收益。
- Demo 重点展示拒绝路径和权限边界。

---

## 10. 推荐开发顺序

```text
1. Nuxt + Tailwind + shadcn-vue/ui 项目初始化
2. shared types + demo policy
3. mock portfolio API
4. rebalance calculator + unit tests
5. strategy proposal API
6. risk engine + blocked/allowed tests
7. SQLite audit log
8. dry-run executor
9. dashboard UI
10. CAW wrapper / health check
11. demo script
12. Vercel deployment
```

最小闭环优先级：

```text
mock portfolio
  -> proposal
  -> risk decision
  -> dry-run execution
  -> audit log
  -> dashboard display
```

只要这条链路稳定，PactTrader 的核心价值就能讲清楚：

> AI 可以生成交易建议，但执行必须受 Pact / Policy 约束；越界不会广播，所有动作都可复盘。
