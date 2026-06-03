# Week 3｜Hackathon Direction Card｜YieldAgent Collective

> 日期：2026-06-03  
> 项目主线：YieldAgent Collective / Yield Agent  
> 项目仓库：https://github.com/baikingrio/yield-agent  
> 赛道：Cobo｜Agentic Economy × Cobo Agentic Wallet  
> 状态：PactTrader 方向已放弃，后续 Hackathon 以 YieldAgent 为准。  
> 隐私原则：本文只记录公开安全的项目设计，不包含私钥、助记词、API Key、`.env`、真实资金地址或未公开会议链接。

## 1. 项目一句话

YieldAgent Collective 是一个 **Pact-first DeFi 收益策略 Agent 控制台**：用户先通过 Cobo CAW Pact 设置资金上限、允许 Recipe、网络、期限和收益分账规则，多个 Agent 只能在这些边界内执行测试网收益策略、复投和分账，并把每次动作、状态和 tx hash 记录到审计日志里。

更短版本：

> Pact before profit: YieldAgent lets AI agents run bounded DeFi yield strategies only inside user-approved Cobo CAW Pacts.

中文打卡版：

> YieldAgent 不是让 AI Agent 无限制地操作钱包，而是让 Agent 在用户预先批准的 Pact 边界内执行收益策略，并把权限、交易和分账过程透明展示出来。

## 2. 为什么放弃 PactTrader，改成 YieldAgent

PactTrader 的方向更偏“组合再平衡交易 Agent”，容易让项目看起来像普通 AI trading bot。YieldAgent 更适合作为 Hackathon 项目主线，原因是：

1. **更贴合 Cobo Agentic Commerce**：收益策略、复投、分账更能体现 Agent 参与链上经济活动。
2. **更容易突出 CAW Pact 的必要性**：用户关心的不是 APY，而是 Agent 到底被允许做什么、做了什么、是否可审计。
3. **Demo 叙事更完整**：创建策略 → 生成 Pact → 等待审批 → 执行 Recipe → 展示日志 / tx hash → 收益分账。
4. **当前仓库已有前端 MVP**：`yield-agent` 已有 Nuxt 4 / TypeScript / Tailwind / Pinia 的控制台页面和 Nitro mock API。

## 3. 目标用户

- DeFi yield farmer：希望自动执行收益策略，但不愿意给 Agent 无限钱包权限。
- DAO / 小型 treasury 管理者：希望用可控策略管理测试网或小额资金，并看到清晰审计记录。
- AI Agent builder：希望展示 Agent 不只是聊天，而是能在受限权限下完成可验证链上动作。
- Hackathon 评委：需要在 1 分钟内看懂“权限在哪里，证据在哪里”。

## 4. 要解决的问题

AI Agent 可以发现机会、生成策略和调用工具，但如果直接接触钱包和 DeFi 协议，会出现几个风险：

1. Agent 可能越权调用非白名单协议；
2. Agent 可能超出预算或期限继续执行；
3. Agent 可能把收益分账比例搞错；
4. 用户无法快速确认一条策略到底允许哪些动作；
5. Demo 如果只展示高 APY，会忽略安全边界和可审计性。

YieldAgent 的切入点是：**先把 Pact 权限边界展示清楚，再展示收益策略结果**。

## 5. 最小 MVP Flow

```text
用户输入收益策略意图
  -> Strategy Agent 生成策略草案
  -> Pact Preview 展示权限边界
  -> 用户确认 / Cobo 审批
  -> Executor Agent 执行 Recipe（如 Aave / Compound supply）
  -> Revenue Agent 记录收益与分账
  -> Dashboard 展示 wallet、active pacts、logs、tx hash
```

当前前端 MVP 已覆盖：

- Dashboard：钱包状态、策略列表、收益曲线、近期日志；
- 创建策略：自然语言意图、网络、风险、最大支出、绩效费、分账比例、Pact preview；
- Pact 管理：查看 active / awaiting approval Pact；
- 交易历史：timeline 和 tx hash；
- 设置：网络、API Key 配置状态、默认绩效费和分账比例；
- Nitro mock API：wallet、strategies、pacts、logs、settings、yield-series。

## 6. 技术栈

- 前端 / 全栈框架：Nuxt 4 / Nitro
- UI：Vue 3、TypeScript、Tailwind CSS
- 状态管理：Pinia
- 图表：Chart.js / vue-chartjs
- 数据验证：Zod
- 执行层：Cobo Agentic Wallet（CAW）/ Pact / Recipe
- Agent 层：Strategy Agent、Executor Agent、Revenue Agent
- Demo 数据：Nitro mock API + fixtures
- 部署：Vercel 或 Nuxt compatible hosting

## 7. Cobo 赛道对齐

YieldAgent 与 Cobo 赛道的核心匹配点：

- **Cobo CAW 是执行边界**：Agent 不能直接拿 owner 私钥，只能在 Pact 范围内执行。
- **Pact 可视化**：每条策略先展示 intent、max spend、allowed recipes、duration、fee split。
- **Recipe 执行**：后续接入 Aave Supply、Compound Supply、Swap、Revenue Share 等 Recipe。
- **审计日志**：每次执行记录 action、status、tx hash 和时间线。
- **Agentic Commerce**：Agent 不只是建议，而是在受限授权下参与链上收益活动和分账。

## 8. Demo 场景

### Demo A：创建保守型 USDC 收益策略

- 用户输入：“保守耕作 500 USDC 于 Base 链，目标 APY 8%+”。
- 系统生成 Pact preview：网络、最大支出、允许 Recipe、期限、Agent 绩效费、用户收益分成。
- 状态进入 `awaiting approval`。

### Demo B：审批后执行 Aave / Compound Supply

- Pact 变为 `active`。
- Executor Agent 执行允许的 supply recipe。
- Dashboard 展示 tx hash 和执行日志。

### Demo C：收益分账

- Revenue Agent 记录收益。
- 按设定比例分账，例如用户 85%，Agent 15%。
- 日志展示 revenue share 动作。

### Demo D：越界 / 终止

- 如果超出 max spend、非白名单 Recipe、Pact expired / terminated，则拒绝执行。
- UI 展示拒绝原因和审计记录。

## 9. 当前仓库观察

仓库：`/home/workspace/yield-agent`

当前已有：

- Nuxt 4 项目骨架；
- `PRODUCT.md` 和 `DESIGN.md`；
- `docs/YieldAgent_Collective_PRD.md`；
- 多个页面：`index.vue`、`create-strategy.vue`、`pacts.vue`、`history.vue`、`settings.vue`；
- Nitro mock API：wallet、strategies、pacts、logs、settings、yield-series；
- Demo fixture：wallet、strategies、pacts、logs、收益曲线；
- UI 原则：精准、克制、可信；Pact before profit；Show the audit trail。

需要尽快补齐：

- README 从 Nuxt 默认模板改成 YieldAgent 项目说明；
- 明确 CAW SDK / Recipe 接入计划；
- 增加真实或 dry-run 的 Pact / Recipe adapter；
- 加测试和 build 验证；
- 准备 3–5 分钟 Demo script。

## 10. 明确不做

为了保证 Hackathon MVP 可完成，v0.1 不做：

- 不承诺真实收益率；
- 不做主网真实资金；
- 不让 Agent 持有 owner 私钥、助记词或无限授权；
- 不做复杂多链收益聚合器；
- 不做高风险 leverage / LP / 衍生品策略；
- 不做完整 A2A 市场，只保留收益分账和多 Agent 角色说明；
- 不用夸张 APY 作为核心卖点，先展示 Pact 权限和审计证据。

## 11. Week 4 Sprint Plan

- Day 1：改 README，统一项目叙事；验证当前前端和 mock API 可运行。
- Day 2：梳理 CAW SDK / Recipe adapter 接口，先做 dry-run payload preview。
- Day 3：完善 Pact preview、approval、terminate、reject reason 四类状态。
- Day 4：补齐 Strategy Agent / Executor Agent / Revenue Agent 的最小 TypeScript 服务层。
- Day 5：打通 dashboard 的 audit trail：logs、tx hash、strategy status、pact status。
- Day 6：部署 Vercel，录制 3–5 分钟 Demo 视频。
- Day 7：整理提交材料：README、PRD、demo link、video、Cobo integration notes、风险边界说明。

## 12. WCB Proof 草稿

```text
我已将 Hackathon 项目主线从 PactTrader 调整为 YieldAgent Collective，并完成新的 Direction Card。

YieldAgent Collective 是一个 Pact-first DeFi 收益策略 Agent 控制台：用户先通过 Cobo CAW Pact 设置最大支出、允许 Recipe、网络、期限和收益分账规则，Agent 只能在这些边界内执行测试网收益策略、复投和分账。项目重点不是夸大 APY，而是让评委快速看清楚：Agent 被允许做什么、实际做了什么、证据在哪里。

当前项目仓库已建立前端 MVP：Nuxt 4、Vue 3、TypeScript、Tailwind、Pinia、Chart.js、Nitro mock API，并包含 Dashboard、创建策略、Pact 管理、交易历史和设置页面。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/yield-agent-direction-card.md

项目仓库：
https://github.com/baikingrio/yield-agent
```
