# YieldAgent / PactTrader 黑客松项目信息草稿

> 日期：2026-06-11  
> 用途：黑客松项目信息提交草稿  
> 状态：待用户确认后提交  
> 代码仓库：https://github.com/baikingrio/yield-agent

## 1. 团队信息

### 团队名称

建议填写：

```text
YieldAgent Team
```

备选：

```text
PactTrader Team
```

如果表单更偏项目品牌，建议用 `YieldAgent Team`；如果表单更偏当前 Demo 品牌，也可以用 `PactTrader Team`。

### 团队成员

```text
Quinn / baikingrio
```

### 团队角色分工

```text
Quinn：项目负责人 / 全栈开发 / 产品设计 / CAW & Pact 集成 / Demo 与文档整理
```

如表单支持更详细分工，可填写：

- 产品与 Demo 设计：Quinn
- 前端与交互实现：Quinn
- 后端 API 与状态管理：Quinn
- Cobo Agentic Wallet / Pact 集成：Quinn
- 测试、部署与项目文档：Quinn

### 联系方式

```text
GitHub: https://github.com/baikingrio
Email: baikingrio@gmail.com
```

> 如果提交表单不要求邮箱，可以只填 GitHub，避免公开过多联系方式。

## 2. 项目名称

建议提交名称：

```text
YieldAgent
```

英文副标题 / 说明：

```text
A Pact-bound DeFi yield strategy agent powered by Cobo Agentic Wallet
```

如果允许填写展示名，可以写：

```text
YieldAgent / PactTrader
```

解释：当前代码仓库和历史项目名是 YieldAgent，最新 Demo 叙事里使用 PactTrader 来强调 “Pact-first / policy-bound” 的产品定位。

## 3. 项目一句话介绍

中文：

```text
YieldAgent 是一个基于 Cobo Agentic Wallet 和 Pact 权限边界的 DeFi 收益策略 Agent，让 AI 只能在用户预先授权的预算、资产、协议和期限范围内执行策略动作。
```

英文：

```text
YieldAgent is a Pact-bound DeFi yield strategy agent that lets AI propose and execute actions only within user-approved Cobo Agentic Wallet policies.
```

更短版本：

```text
Agent proposes. Policy decides. CAW executes only when allowed.
```

## 4. 项目描述

### 中文版

```text
YieldAgent 是一个面向 Cobo Agentic Commerce Hackathon 的 DeFi 策略 Agent 原型。它不是让 AI Agent 自由控制用户钱包，而是通过 Cobo Agentic Wallet（CAW）和 Pact 权限边界，把 Agent 的执行能力限制在用户明确授权的范围内。

用户可以在 Demo 中创建或查看一个收益策略，系统会把自然语言策略转成结构化 proposal，并生成 Pact Preview，包括预算上限、允许资产、允许协议、执行期限、收益分配和审计要求。只有当 proposal 符合 Pact / policy 边界时，CAW 才允许继续执行；如果动作超出预算、使用未知 token、调用非白名单协议，系统会拒绝执行并写入审计日志。

当前版本采用 Try Demo-first 路径，评审无需一开始连接钱包，也可以直接进入 Dashboard 查看预置 CAW Agent Wallet、策略、Pact 边界、执行状态和审计日志。真实 EOA 连接、CAW 配对、测试网资金注入和真实测试网执行保留为高级路径。

项目重点展示的是 Web3 Agent 的安全执行模型：AI 可以提出策略，但不能绕过用户授权；执行必须经过 Pact / policy 检查；每次允许、拒绝、pending 或失败的动作都应该可解释、可撤销、可审计。
```

### 英文版

```text
YieldAgent is a DeFi yield strategy agent prototype built for the Cobo Agentic Commerce Hackathon. Instead of giving an AI agent unrestricted control over a user wallet, YieldAgent uses Cobo Agentic Wallet (CAW) and Pact policies to restrict execution within explicit user-approved boundaries.

Users can create or inspect a yield strategy in the demo. The system turns natural-language intent into a structured proposal and generates a Pact Preview, including budget caps, allowed assets, allowlisted protocols, duration, revenue split, and audit requirements. CAW only proceeds when the proposal stays within the Pact / policy boundary. Out-of-scope actions such as exceeding budget, using unknown tokens, or calling non-allowlisted protocols are denied and recorded in the audit trail.

The current version uses a Try Demo-first flow so judges can enter the dashboard without being blocked by wallet setup. The dashboard shows a preset CAW Agent Wallet, strategy state, Pact boundaries, execution status, and audit logs. Real EOA connection, CAW pairing, testnet funding, and real testnet execution remain available as advanced paths.

The core idea is a safer Web3 agent execution model: AI can propose, but cannot bypass authorization; every action must pass policy checks; and every allowed, denied, pending, or failed action should be explainable, revocable, and auditable.
```

## 5. 解决的问题

```text
Web3 Agent 如果直接拿到钱包权限，会带来很高的安全风险：用户很难知道 Agent 能花多少钱、能调用哪些协议、是否会越界执行，以及失败后如何追踪。

YieldAgent 解决的是“AI Agent 如何在受限授权边界内执行 DeFi 策略”的问题。它通过 CAW / Pact 把策略执行前置为可检查的 policy：先定义预算、资产、协议、期限和审计要求，再允许 Agent 在这个范围内执行。越界动作不会执行，而是被明确拒绝并记录原因。
```

## 6. 核心功能

- **Try Demo-first 入口**：评审点击 Try Demo 即可进入 Dashboard，不被钱包插件、测试网网络和测试币准备卡住。
- **策略创建 / 策略展示**：支持模板和自然语言策略意图，生成结构化 proposal。
- **Pact Preview**：展示预算上限、允许资产、允许协议、期限、收益分配和执行边界。
- **CAW / Pact 执行边界**：Agent 只能在用户批准的 Pact 范围内执行。
- **拒绝路径**：超预算、未知 token、非白名单协议、过期 / 撤销 Pact 等动作会被拒绝。
- **审计日志**：记录 proposal、policy decision、execution result、denial reason、tx hash / pending 状态。
- **真实钱包高级路径**：保留 EOA 连接、CAW Agent Wallet 创建 / 导入、测试网注资和真实测试网执行路径。

## 7. 技术实现 / 技术栈

```text
Frontend: Nuxt 4, Vue 3, TypeScript, Tailwind CSS, shadcn-vue style components
Wallet / Chain: wagmi, viem, Base Sepolia testnet
Execution Layer: Cobo Agentic Wallet (CAW), Pact
Agent / Strategy Layer: Hermes runtime for natural-language strategy parsing and risk explanation
Database / Logs: SQLite
Deployment: Vercel frontend + remote Hermes / CAW runtime
Testing: Vitest
```

## 8. Cobo / CAW 使用方式

```text
YieldAgent 使用 Cobo Agentic Wallet 作为 Agent Wallet / 执行层，并使用 Pact 作为 Agent 执行策略动作前的权限边界。

用户资金不会直接交给 AI 控制完整 EOA 钱包，而是进入受限制的 CAW Agent Wallet。Agent 提出的策略必须符合 Pact 中定义的预算、资产、协议、期限和执行范围。active Pact 执行时使用 Cobo 返回的 pact-scoped key / Pact 子 Key，而不是用 Agent 主 Key 直接执行，从而保持最小权限原则。
```

## 9. Demo 流程

```text
Landing Page
  -> Try Demo
  -> Dashboard
  -> Preset CAW Agent Wallet / Demo State
  -> Strategy Proposal
  -> Pact / Policy Decision
  -> Execution / Pending / Denial
  -> SQLite Audit Log
```

3–5 分钟讲解顺序：

1. 打开首页：说明 YieldAgent 不是让 AI 自由操作钱包，而是把 Agent 放进 Pact 边界。
2. 点击 Try Demo：无需先连接钱包，直接进入 Dashboard 看主流程。
3. 展示策略 / Pact Preview：Agent 只生成 proposal，不等于执行授权。
4. 展示 policy 决策：预算内和白名单协议允许；超预算或非白名单动作拒绝。
5. 展示审计日志：allowed / denied / pending / failed 都可复查。
6. 补充真实路径：EOA 连接、CAW 配对、测试网资金和真实测试网执行保留在高级路径。

## 10. 项目亮点

- **Pact-first，而不是 profit-first**：先展示权限边界，再展示收益动作。
- **最小权限执行**：active Pact 执行必须使用 pact-scoped key，不把 Agent 主 Key 当成交易执行凭证。
- **拒绝也是产品能力**：越界动作被拒绝并记录，证明 policy 真的生效。
- **评审友好的 Demo-first 体验**：不用一开始连接钱包也能理解核心机制。
- **可解释、可撤销、可审计**：每个关键动作都有状态、原因和日志。
- **真实 CAW 路径可扩展**：Demo-first 不绕过安全模型，真实钱包 / CAW 配对作为高级路径保留。

## 11. 当前进度 / Proof of Work

代码仓库：

```text
https://github.com/baikingrio/yield-agent
```

最新同步到本地的 commit：

```text
ed23d20 feat: enhance demo wallet functionality and synchronization
```

近期关键提交：

```text
ed23d20 feat: enhance demo wallet functionality and synchronization
3bbdc01 fix: require pact scoped key for active execution
911fea3 fix: improve error messaging for wallet address validation
fb40f42 fix: send source address with pact scoped execution
b4b539f fix: let Cobo select pact source address
```

本地验证：

```text
npm test -- tests/pacttrader-demo-wallet.test.ts tests/wallet-api.test.ts tests/pact-credentials.test.ts
# 3 个 test files 通过，11 个测试通过
```

## 12. 项目链接

### GitHub 仓库

```text
https://github.com/baikingrio/yield-agent
```

### 在线 Demo

```text
https://yield-agent-eta.vercel.app/
```

> 提交前建议再打开确认 Vercel 最新部署是否已经完成。

### 学习 / Proof 记录

```text
https://github.com/baikingrio/ai-web3-school-note
```

## 13. 适合表单短描述版本

如果表单限制字数，可以用这一版：

```text
YieldAgent is a Pact-bound DeFi yield strategy agent built with Cobo Agentic Wallet. It lets AI propose yield actions, but execution is only allowed within user-approved Pact boundaries such as budget, assets, protocols, duration, and audit requirements. Out-of-scope actions are denied and recorded. The demo uses a Try Demo-first dashboard with preset CAW Agent Wallet state, while real EOA connection, CAW pairing, testnet funding, and execution remain available as advanced paths.
```

中文版短描述：

```text
YieldAgent 是一个基于 Cobo Agentic Wallet / Pact 的 DeFi 收益策略 Agent。AI 可以提出策略，但只有在用户预先授权的预算、资产、协议和期限范围内才允许执行；越界动作会被拒绝并写入审计日志。当前 Demo 提供 Try Demo-first 控制台，方便评审直接查看 CAW Agent Wallet、Pact 边界、执行状态和审计路径。
```

## 14. 提交前待确认

- [ ] 最终项目名称用 `YieldAgent` 还是 `YieldAgent / PactTrader`。
- [ ] 在线 Demo 链接是否使用 `https://yield-agent-eta.vercel.app/`。
- [ ] 是否需要填写视频链接 / PPT 链接。
- [ ] 团队成员是否只写 Quinn / baikingrio。
- [ ] 表单是否要求英文描述，如果要求可直接使用上面的英文版。
