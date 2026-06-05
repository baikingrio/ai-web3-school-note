# 2026-06-05｜PactTrader 技术架构学习笔记

## 1. 今天先解决的问题

今天主要解决一个问题：**PactTrader 到底要证明什么？**

如果只说“AI Agent 帮用户交易”，这个方向太宽，也容易变成高风险的 trading bot。今天重新整理后，我把 PactTrader 收敛成：

> 一个基于 Cobo CAW / Pact 的受限组合再平衡 Agent。

也就是：用户先定义授权边界，Agent 只在边界内提出小额再平衡建议，真正能不能执行要经过本地 Risk Engine 和 CAW / Pact 判断。每一步都写入审计日志。

## 2. 一句话定位

中文：

> PactTrader 不是让 AI 自由炒币，而是让 AI 在用户明确授权的 Pact 范围内执行小额、可解释、可撤销、可审计的组合再平衡。

英文：

> Agent proposes. Policy decides. CAW executes only when allowed.

这句话很重要，因为它把 Agent、Policy、CAW 三者的边界讲清楚了：

- Agent：理解目标，生成结构化建议；
- Policy / Risk Engine：判断建议是否越界；
- CAW / Pact：在授权范围内执行，或拒绝 / pending；
- SQLite：记录全过程，方便复盘。

## 3. 技术栈理解

### 3.1 前端：Nuxt.js / Vue / TypeScript / Tailwind / shadcn-vue/ui

前端不是简单做一个 landing page，而是做一个让评委能看懂安全链路的 dashboard。

需要展示：

- 用户设置的目标组合和授权边界；
- 当前组合和目标组合的偏离；
- Agent 生成的 proposal；
- 本地 risk check 的结果；
- CAW / dry-run 的执行结果；
- SQLite audit log。

我对前端的理解是：PactTrader 的 UI 要像一个“控制台”，而不是一个刺激交易欲望的 crypto trading 页面。重点是清楚、冷静、可审计。

### 3.2 Agent / 策略层：Z.AI API + deterministic fallback

策略层负责生成 `TradeProposal`，但不能直接执行交易。

一个安全的 proposal 应该是结构化的，例如：

```json
{
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

这里的关键不是让 LLM 自由发挥，而是让它输出可检查的 JSON。MVP 阶段还要保留 deterministic rebalance fallback，这样即使 Z.AI API 不稳定，也能演示完整流程。

### 3.3 Policy / Risk Engine：第一道硬风控

本地 Risk Engine 要先于 CAW 调用执行。它负责检查：

- strategy 是否允许；
- from / to token 是否在白名单；
- protocol / router 是否在白名单；
- 单笔金额是否超限；
- 日预算和交易次数是否超限；
- 滑点是否超限；
- stop-loss、revoked、expired 状态是否触发；
- 是否需要人工确认。

这层的意义是：明显越界的动作不应该进入 CAW 执行层，更不应该让 Agent 自己解释后放行。

### 3.4 执行层：Cobo Agentic Wallet / Pact

CAW 是 PactTrader 的执行层。我的理解是，它在项目里承担的是“受限授权”和“执行边界”，而不是普通钱包调用。

Demo 里可以先展示：

- Pact preview；
- allowed / pending / denied 状态；
- CAW SDK wrapper；
- dry-run fallback；
- 审计结果回填。

如果真实 CAW 凭证或测试环境暂时不稳定，要透明说明当前是 dry-run / preview，不能把 mock 包装成真实交易。

### 3.5 数据库 / 日志：SQLite

SQLite 在 MVP 里不是可有可无的工程细节，而是产品表达的一部分。

需要记录：

- user intent；
- portfolio snapshot；
- trade proposal；
- risk decision；
- execution result；
- audit event。

PactTrader 的安全感来自“每一步都能被解释和复盘”。所以 audit log 不是给开发者看的隐藏日志，而是 demo 中应该被用户 / 评委看到的功能。

### 3.6 部署：Vercel

Vercel 负责部署 Nuxt 前端和 server API。需要注意：

- `.env`、API Key、CAW credentials 只能放在本地或 Vercel 环境变量；
- public repo 只放 `.env.example` 和说明；
- SQLite 在 Vercel serverless 环境有文件系统限制，生产形态可以迁移到托管 SQLite / Turso / libSQL；
- Demo 模式可以用 mock portfolio + dry-run 保证可演示。

## 4. MVP 最小演示路径

今天把 demo 拆成四条路径，更适合 Hackathon 展示：

### Demo A：正常再平衡成功

- 当前 ETH 低于目标比例；
- Agent 建议小额 USDC -> WETH；
- 本地 policy pass；
- CAW / dry-run execute；
- audit log 记录 proposal、decision、execution result。

### Demo B：超额交易被拒绝

- Agent 或输入建议交易金额超过单笔上限；
- 本地 Risk Engine blocked；
- 不调用 CAW；
- audit log 记录拒绝原因。

### Demo C：未知 token / 非白名单协议被拒绝

- 输入被诱导购买非白名单 token；
- token allowlist / protocol allowlist 检查失败；
- proposal 被 blocked；
- 不进入执行层。

### Demo D：审计日志复盘

- 展示最近几次 allowed / blocked / pending / failed 记录；
- 用户能看到每次为什么允许或拒绝；
- 证明 PactTrader 不是黑盒 Agent。

## 5. 目录结构学习

PactTrader 的目录可以按功能分层理解：

```text
pacttrader/
  app/
    pages/                  # dashboard / setup / proposals / audit
    components/             # dashboard cards + shadcn-vue/ui
    composables/            # 前端调用 API 的 hooks

  server/
    api/                    # Nuxt server API routes
    services/
      portfolio/            # mock portfolio / portfolio reader
      strategy/             # Z.AI client / rebalance calculator / strategy agent
      risk/                 # local risk engine / policy fixtures
      caw/                  # CAW SDK wrapper / pact client / dry-run executor
      audit/                # audit logger / store
      db/                   # SQLite schema / migrations

  shared/
    types/                  # intent / portfolio / proposal / risk / caw / audit
    constants/              # demo policy / tokens / protocols

  docs/                     # PRD / architecture / demo script / CAW integration
  tests/                    # strategy / risk / integration tests
```

这个结构的好处是：每一层职责清楚，不会让 Agent 直接跨过 policy 去执行交易。

## 6. 开发任务拆解

### Phase 0：项目骨架

- 创建 Nuxt + TypeScript 项目；
- 接 Tailwind CSS 和 shadcn-vue/ui；
- 建立 app / server / shared / docs / tests 目录；
- 准备 README、PRD、技术架构文档。

### Phase 1：Portfolio + Strategy

- mock portfolio：默认 90% USDC / 10% WETH；
- target allocation：70% USDC / 30% WETH；
- rebalance calculator：计算是否需要 swap；
- Z.AI strategy agent：输出结构化 proposal；
- deterministic fallback：保证没有 API Key 时 demo 仍可跑。

### Phase 2：Risk Engine

- 定义 policy 类型；
- 检查 token / protocol / amount / budget / slippage / stop-loss；
- 输出 allowed / pending_required / blocked；
- 给每个拒绝结果生成清楚原因。

### Phase 3：CAW / Pact 执行层

- 封装 CAW SDK / API；
- 支持 health check；
- 支持 pact preview / active pact / dry-run；
- 只有 risk allowed 才进入 execute；
- 凭证不可用时透明走 dry-run。

### Phase 4：SQLite Audit Log

- 建表：intents、portfolio_snapshots、trade_proposals、risk_decisions、execution_results、audit_events；
- 每次 proposal / risk / execution 都写日志；
- 前端 audit 页面可查看。

### Phase 5：Dashboard Demo

- 首页说明项目定位；
- Dashboard 展示链路；
- Setup 设置策略和边界；
- Proposals 展示建议；
- Audit 展示日志；
- Demo A–D 一键运行。

### Phase 6：部署与提交材料

- 准备 Vercel 环境变量；
- 确认 `.env` 不进入仓库；
- 准备 demo script；
- 准备 WCB proof 草稿；
- 提交前运行 build / test / privacy check。

## 7. 今天的收获

今天最大的收获是：PactTrader 的价值不在于“AI 帮我赚钱”，而在于把 AI Agent 的资金动作变成一个可限制、可解释、可撤销、可审计的流程。

如果评委只看到一个 Agent 说“我建议买 ETH”，这个项目不够有 Web3 特点。真正有价值的是让评委看到：

1. 用户提前授权了什么；
2. Agent 提出了什么；
3. 哪些规则判断它能不能做；
4. CAW / Pact 如何执行或拒绝；
5. 所有结果如何进入 audit log。

这也是后续开发最应该坚持的主线。

## 8. 隐私与公开边界

这份学习笔记只记录公开安全内容：

- 不记录私钥、助记词、API Key；
- 不记录真实资金地址；
- 不记录 `.env` 内容；
- 不记录未公开会议链接；
- 不把 dry-run 或 mock 包装成真实执行。
