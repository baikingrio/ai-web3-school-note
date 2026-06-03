# Week 3｜YieldAgent Collective Ready Pack｜WCB 任务提交材料

> 日期：2026-06-03  
> 当前项目：YieldAgent Collective / Yield Agent  
> 项目仓库：https://github.com/baikingrio/yield-agent  
> 学习仓库：https://github.com/baikingrio/ai-web3-school-note  
> 说明：PactTrader 方向已放弃，以下材料以后续 Hackathon 项目 YieldAgent 为准。  
> 隐私原则：不包含私钥、助记词、API Key、token、`.env`、真实资金地址或未公开会议链接。

## 0. 可复查材料

- YieldAgent 项目仓库：https://github.com/baikingrio/yield-agent
- Direction Card：[`hackathon/yield-agent-direction-card.md`](../hackathon/yield-agent-direction-card.md)
- 项目 PRD：[`docs/YieldAgent_Collective_PRD.md`](https://github.com/baikingrio/yield-agent/blob/main/docs/YieldAgent_Collective_PRD.md)
- Product：[`PRODUCT.md`](https://github.com/baikingrio/yield-agent/blob/main/PRODUCT.md)
- Design：[`DESIGN.md`](https://github.com/baikingrio/yield-agent/blob/main/DESIGN.md)

## 1. Hackathon Direction Card

### 项目名

YieldAgent Collective / Yield Agent

### 一句话说明

YieldAgent Collective 是一个 Pact-first DeFi 收益策略 Agent 控制台：用户先通过 Cobo CAW Pact 设置资金上限、允许 Recipe、网络、期限和收益分账规则，多个 Agent 只能在这些边界内执行测试网收益策略、复投和分账，并把每次动作、状态和 tx hash 记录到审计日志里。

英文一句话：

> Pact before profit: YieldAgent lets AI agents run bounded DeFi yield strategies only inside user-approved Cobo CAW Pacts.

### 目标用户

- DeFi yield farmer：想让 Agent 自动执行收益策略，但不愿意给 Agent 无限钱包权限。
- DAO / 小型 treasury 管理者：希望用可控策略管理测试网或小额资金，并看到清晰审计记录。
- AI Agent builder：希望展示 Agent 不只是聊天，而是能在受限权限下完成可验证链上动作。
- Hackathon 评委：需要快速看懂权限边界和审计证据。

### 要解决的问题

AI Agent 可以发现机会、生成策略和调用工具，但直接接触钱包和 DeFi 协议会有越权、超预算、非白名单调用、分账错误和审计不可见等风险。YieldAgent 的切入点是：先把 Pact 权限边界展示清楚，再展示收益策略执行结果。

### 最小功能

- Strategy Agent：根据用户意图生成收益策略草案；
- Pact Preview：展示网络、最大支出、允许 Recipe、期限、绩效费和用户分成；
- Executor Agent：在 Pact 范围内执行允许的收益 Recipe；
- Revenue Agent：记录收益和分账；
- Dashboard：展示 wallet state、active pacts、logs、yield series、tx hash；
- Pact 管理：查看、审批模拟、终止 Pact；
- History：展示执行时间线和审计记录。

### 技术路径

- Nuxt 4 / Nitro；
- Vue 3；
- TypeScript；
- Tailwind CSS；
- Pinia；
- Chart.js / vue-chartjs；
- Zod；
- Cobo Agentic Wallet（CAW）/ Pact / Recipe；
- Vercel 或 Nuxt compatible hosting。

### 主要风险

- CAW SDK / Recipe 测试环境接入可能不稳定；
- 真实测试网交易需要凭证、测试 token 和安全确认；
- 收益策略如果做太复杂会超出 Hackathon 时间；
- 如果 UI 过度强调 APY，会削弱 Pact / 审计的核心价值。

## 2. 赛道选择说明

我选择 **Cobo｜Agentic Economy × Cobo Agentic Wallet** 作为 YieldAgent 的主赛道。

原因：

1. YieldAgent 的核心是让 Agent 在 Pact 权限边界内执行 DeFi 收益策略，Cobo CAW 是这个项目的执行和安全边界。
2. 项目天然需要 scoped authorization、Pact approval、Recipe execution、audit logs 和 tx hash，可直接展示 Cobo 的价值。
3. Demo 不是普通收益仪表盘，而是让评委看到 Agent 被允许做什么、实际做了什么、证据在哪里。
4. 收益分账和多 Agent 角色可以体现 Agentic Commerce / A2A Economy 的方向。

公开提交可包含：@Cobo_Global @aiweb3school @LXDAO_Official @ETHPanda_Org @web3careerbuild

## 3. 项目一句话说明

非技术版：

> YieldAgent 不是让 AI Agent 无限制地操作钱包，而是让 Agent 在用户预先批准的 Pact 边界内执行收益策略，并把权限、交易和分账过程透明展示出来。

技术评委版：

> YieldAgent Collective is a Pact-first agent console where Strategy, Executor, and Revenue agents can only run DeFi yield recipes inside user-approved Cobo CAW boundaries, with every action recorded as an auditable log and transaction hash.

WCB 打卡版：

> 我把 Hackathon 项目主线调整为 YieldAgent Collective：一个基于 Cobo CAW / Pact 的 DeFi 收益策略 Agent 控制台。它的重点不是夸大 APY，而是验证 AI Agent 如何在明确授权边界内执行、复投和分账。

## 4. 组队 / 单人参赛状态确认

当前按 **单人参赛** 路径推进。

我负责：

- 产品定义：YieldAgent PRD、目标用户、MVP flow、风险边界；
- 前端实现：Nuxt 4 / Vue 3 / TypeScript / Tailwind 控制台；
- Agent 逻辑：Strategy Agent、Executor Agent、Revenue Agent 的最小服务层；
- Cobo 集成：CAW Pact / Recipe adapter、dry-run payload preview、后续测试网调用；
- 审计展示：logs、tx hash、pact status、strategy status；
- 提交材料：README、Direction Card、Demo script、WCB proof、录屏。

时间安排：Week 3 每天约 2–3 小时，Week 4 预计每天 3–4 小时。

## 5. Repo Skeleton

YieldAgent 项目仓库已建立：

https://github.com/baikingrio/yield-agent

当前已观察到的结构：

```text
app/
  components/
    dashboard/
    create-strategy/
    pacts/
    history/
    settings/
    ui/
  pages/
    index.vue
    create-strategy.vue
    pacts.vue
    history.vue
    settings.vue
  stores/
  composables/
server/
  api/
    wallet.get.ts
    yield-series.get.ts
    strategies/
    pacts/
    logs/
    settings/
  fixtures/
  utils/
shared/
  types/
docs/
  YieldAgent_Collective_PRD.md
PRODUCT.md
DESIGN.md
```

当前已有：

- Nuxt 4 项目；
- Dashboard / create strategy / pacts / history / settings 页面；
- Nitro mock API；
- Demo fixture：wallet、strategies、pacts、logs、yield series；
- Product / Design / PRD 文档；
- 暗色、Pact-first、audit-first 的 UI 方向。

需要补齐：

- README 从 Nuxt 默认模板改为 YieldAgent 项目说明；
- CAW SDK / Recipe adapter；
- 测试 / build 验证；
- Demo script 和部署说明。

## 6. Week 4 Sprint Plan

### Day 1：项目叙事与 README

- 更新 README：problem、track、MVP flow、tech stack、risks、validation plan；
- 跑通当前前端和 mock API；
- 确认 Demo 入口和页面顺序。

### Day 2：CAW / Pact 接入计划

- 梳理 `@cobo/agentic-wallet` SDK 或 CAW API 的最小调用点；
- 定义 Pact payload preview；
- 暂时默认 dry-run，不在无确认时做真实提交。

### Day 3：Strategy / Executor / Revenue Agents

- Strategy Agent：从用户意图生成策略草案；
- Executor Agent：只执行 Pact 允许的 Recipe；
- Revenue Agent：记录收益与分账动作。

### Day 4：Pact 状态与拒绝路径

- 完善 awaiting approval、active、terminated、denied；
- 演示 max spend、非白名单 Recipe、expired / terminated 的拒绝路径。

### Day 5：Audit Trail

- 把 logs、tx hash、strategy status、pact status 作为核心展示；
- Dashboard 和 history 都能看到执行证据。

### Day 6：部署与录屏

- 部署 Vercel / Nuxt compatible hosting；
- 录制 3–5 分钟 Demo：创建策略 → Pact preview → 审批 / 执行 → 日志 / tx hash → 分账。

### Day 7：提交包

- 检查 README、PRD、Direction Card、Cobo integration notes、风险边界说明；
- 确认没有 `.env`、API Key、私钥、助记词或真实资金信息；
- 提交 Hackathon 和 WCB proof。

## 7. Proposal Memo

### 项目背景

AI Agent 如果只做建议，难以体现 Agentic Commerce 的执行价值；但如果直接操作钱包和 DeFi 协议，又会带来权限、预算和审计风险。YieldAgent 想验证一种更可控的方式：让 Agent 能执行收益策略，但必须先经过 Cobo CAW Pact 的授权边界。

### 真实场景

用户输入一个保守收益策略，例如“保守耕作 500 USDC 于 Base 链，目标 APY 8%+”。系统生成 Pact preview，展示最大支出、网络、允许 Recipe、期限、用户收益分成和 Agent 绩效费。用户确认后，Agent 只能执行允许的 Recipe，并把每一步写入日志和 tx hash。

### 验证方式

- 正常路径：创建策略 → Pact preview → awaiting approval → active → supply recipe → log / tx hash；
- 分账路径：收益产生 → 用户 85% / Agent 15%；
- 拒绝路径：超额、非白名单 Recipe、Pact terminated；
- 证据路径：Dashboard / History 展示状态、日志和 tx hash。

## 8. Scope Review

v0.1 明确不做：

1. 不承诺真实收益率；
2. 不做主网真实资金；
3. 不让 Agent 持有 owner 私钥、助记词或无限授权；
4. 不做复杂多链收益聚合器；
5. 不做高风险 leverage / LP / 衍生品策略；
6. 不做完整 A2A 市场，只保留收益分账和多 Agent 角色说明；
7. 不用夸张 APY 作为核心卖点，先展示 Pact 权限和审计证据。

## 9. Risk / Assumption Memo

关键假设：

- Cobo CAW / Pact / Recipe 能支持最小测试网 demo；
- 当前 Nuxt 4 前端足以承载评委演示；
- mock API / dry-run 可以作为接真实 CAW 前的可解释 fallback；
- 评委更看重 Pact 安全边界和审计证据，而不是真实收益。

最可能失败点：

1. CAW SDK / Recipe 测试环境或凭证接入不稳定；
2. 真实测试网交易准备时间不足；
3. 多 Agent 和收益分账如果做太完整会范围膨胀；
4. README 仍是 Nuxt 默认模板，影响评委理解。

Fallback：

- CAW 不可用：展示 Pact payload preview + dry-run 状态机；
- 真实交易不稳定：使用测试网模拟 tx hash + 明确标注 demo fixture；
- 多 Agent 来不及：先做 Strategy / Executor / Revenue 三个逻辑角色，不做复杂自治协作；
- 收益策略复杂：先做 USDC supply / revenue share 的最小闭环。

## 10. Sponsor / Mentor 问题清单

给 Cobo：

1. YieldAgent 的 Demo 应该优先展示真实 Recipe 执行，还是 Pact approval / denial / audit log 更能体现 CAW 价值？
2. 如果 Week 4 只能完成 Pact payload preview + dry-run，是否足够作为 CAW integration plan？
3. 对收益策略场景，Cobo 更推荐先接 Aave / Compound supply，还是先演示 transfer / revenue share？

给 Mentor / 助教：

1. YieldAgent 是否比 PactTrader 更适合作为 Cobo Agentic Commerce 项目主线？
2. 评委会更关注收益策略本身，还是 Agent 权限边界和审计证据？
3. Demo 中“多 Agent”应该做成真实模块，还是先作为 Strategy / Executor / Revenue 三个角色说明？

## 11. Cobo 赛道对齐任务

YieldAgent 对齐 Cobo 的重点：

- Agent 钱包执行必须通过 CAW Pact；
- 用户先看 Pact 权限，再看收益；
- Recipe 执行过程留下 tx hash 和 audit log；
- Pact 状态包括 awaiting approval、active、terminated、denied；
- 收益分账体现 Agentic Commerce / A2A Economy；
- UI 明确展示 “Where are the limits? Where is the proof?”。

## 12. Sponsor SDK / API Integration Plan

计划接入：

- Cobo Agentic Wallet TypeScript SDK / API；
- Wallet / Pact / Recipe / Audit 相关接口；
- YieldAgent server API 中的 CAW adapter。

接入步骤：

1. 本地 `.env` 配置 CAW API URL / API Key / Wallet ID，禁止提交；
2. 做 health / wallet 只读检查；
3. 生成 Pact payload preview；
4. dry-run 创建策略和 Pact 状态流转；
5. 凭证可用后测试 Recipe 执行；
6. 读取 audit logs / tx hash 回填 dashboard。

默认安全策略：所有真实提交必须显式确认；公开仓库只保存 `.env.example` 和说明，不保存任何凭证。

## 13. 技术验证计划

Week 4 验证点：

1. Nuxt 4 前端可运行并展示完整页面流；
2. 创建策略表单能生成 Pact preview；
3. Pact 状态能从 awaiting approval → active / terminated；
4. mock / dry-run logs 能进入 dashboard 和 history；
5. CAW adapter 至少支持 payload preview，凭证可用时做只读或测试网调用；
6. README、PRD、Direction Card、Demo script 都能让评委理解安全边界；
7. build / lint / smoke test 作为提交前检查。

## 14. 完整 Week 4 Ready Pack 对照

- Hackathon Direction Card：见 `hackathon/yield-agent-direction-card.md`；
- Proposal Memo：见本文第 7 节；
- Repo Skeleton：见本文第 5 节；
- Week 4 Sprint Plan：见本文第 6 节；
- Risk / Assumption Memo：见本文第 9 节；
- Sponsor / Mentor 问题清单：见本文第 10 节；
- Cobo 赛道对齐说明：见本文第 11 节；
- Sponsor SDK / API Integration Plan：见本文第 12 节；
- 技术验证计划：见本文第 13 节。

## 15. WCB 简短 proof 草稿

```text
我已将 Hackathon 项目主线从 PactTrader 调整为 YieldAgent Collective，并完成新的 Week 3 Ready Pack。

YieldAgent Collective 是一个 Pact-first DeFi 收益策略 Agent 控制台：用户先通过 Cobo CAW Pact 设置最大支出、允许 Recipe、网络、期限和收益分账规则，Agent 只能在这些边界内执行测试网收益策略、复投和分账。项目重点不是夸大 APY，而是让评委快速看清楚：Agent 被允许做什么、实际做了什么、证据在哪里。

当前项目仓库已建立前端 MVP：Nuxt 4、Vue 3、TypeScript、Tailwind、Pinia、Chart.js、Nitro mock API，并包含 Dashboard、创建策略、Pact 管理、交易历史和设置页面。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md

项目仓库：
https://github.com/baikingrio/yield-agent
```
