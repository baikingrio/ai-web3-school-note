# Week 3｜PactTrader Ready Pack｜WCB 任务提交材料

> 日期：2026-06-03  
> 项目主线：PactTrader  
> 主赛道：Cobo｜Agentic Economy × Cobo Agentic Wallet  
> Agent / 策略层：Z.AI API  
> 公开安全原则：本文不包含私钥、助记词、API Key、`.env`、真实资金地址、真实交易凭证或未公开会议链接。

## 0. 可复查链接

- 学习仓库：https://github.com/baikingrio/ai-web3-school-note
- PactTrader 项目仓库：https://github.com/baikingrio/pacttrader
- PRD：[`hackathon/pacttrader-prd.md`](../hackathon/pacttrader-prd.md)
- 技术架构文档：[`hackathon/pacttrader-technical-architecture.md`](../hackathon/pacttrader-technical-architecture.md)
- Cobo CAW SDK 最小接入实验：[`experiments/caw-sdk-minimal/README.md`](../experiments/caw-sdk-minimal/README.md)
- 今日 Daily Note：[`daily/2026-06-03.md`](../daily/2026-06-03.md)

## 1. Hackathon Direction Card

### 项目名

PactTrader

### 一句话说明

PactTrader 是一个基于 **Cobo CAW / Pact** 的受限组合再平衡 Agent：用户先设置 token 白名单、协议白名单、单笔上限、日预算、滑点、止损和有效期，Agent 只能在这些边界内生成结构化再平衡建议，并通过 CAW 执行层提交受限交易；越界动作会被拒绝或进入 pending approval，所有步骤写入 SQLite 审计日志。

英文版本：

> PactTrader is a policy-bound portfolio rebalancing agent that can only execute small USDC/WETH rebalance actions within user-approved Cobo CAW Pact boundaries.

### 目标用户

- AI/Web3 builder：想让 Agent 执行低风险、小额链上操作，但不愿意给 Agent 主私钥或无限授权。
- Hackathon 评委 / Cobo 赛道观察者：想看到 Agentic Wallet 如何真正进入执行层，而不是普通 AI 交易建议工具。
- 希望验证 AI Agent 自动化执行但仍有预算、白名单、拒绝原因和审计记录的开发者。

### 要解决的问题

AI Agent 可以读取市场、生成交易计划、调用钱包或合约，但链上交易不能把控制权直接交给概率系统。PactTrader 要解决的是：

1. Agent 可能幻觉、误判或被 prompt injection 诱导；
2. Agent 不能拥有 owner 私钥、无限 approve 或任意合约调用权限；
3. 用户需要可控的预算、白名单、滑点、止损和有效期；
4. 每次允许、拒绝、pending approval 都应该可复盘。

### 最小功能

- mock portfolio：默认 70% USDC / 30% WETH 目标组合；
- Strategy Agent：通过 Z.AI API 或 deterministic fallback 生成 `TradeProposal`；
- Local Risk Engine：先做 token、protocol、amount、daily budget、slippage、stop-loss 检查；
- CAW / Pact Execution：只把通过本地检查的动作交给 CAW / Pact；
- SQLite Audit Log：记录 proposal、risk decision、execution result 和 error / denial reason；
- Dashboard：展示 portfolio → proposal → policy decision → execution → audit log。

### 技术路径

- 前端：Nuxt.js、Vue、TypeScript、Tailwind CSS、shadcn-vue/ui；
- 执行层：Cobo Agentic Wallet（CAW）/ Pact；
- Agent / 策略层：Z.AI API + deterministic fallback；
- 数据库 / 日志：SQLite；
- 部署：Vercel；
- Demo fallback：CAW 凭证不可用时，使用 dry-run / mock portfolio 透明展示完整安全逻辑。

### 主要风险

- CAW 测试环境或凭证接入可能不稳定；
- swap / quote / calldata 如果太复杂，Week 4 内容易膨胀；
- LLM 输出不稳定，所以必须保留 deterministic fallback；
- Vercel serverless 文件系统不适合长期保存本地 SQLite，Demo 阶段可用，生产形态应迁移到托管 SQLite / Turso / libSQL。

## 2. 赛道选择说明

我选择 **Cobo｜Agentic Economy × Cobo Agentic Wallet** 作为 PactTrader 的主赛道。

原因：

1. PactTrader 的核心问题是“AI Agent 如何在可控边界内执行资金动作”，这正好需要 Cobo CAW / Pact 的 scoped authorization、policy evaluation、pending approval、denial 和 audit log。
2. 项目不是只做 AI 交易建议，而是强调 Agent proposal 和 wallet policy execution 的边界：Agent 只提建议，Policy / Pact 决定能不能执行。
3. Demo 可以直接展示 allowed、blocked、pending、audit log 等路径，比普通 chatbot 更能体现 Agentic Wallet 的必要性。
4. Z.AI API 会作为 Agent / 策略层，负责生成策略解释和结构化建议，但最终授权必须由本地 Risk Engine 与 Cobo CAW / Pact 共同完成。

公开提交文本可包含：@Cobo_Global @Zai_org @aiweb3school @LXDAO_Official @ETHPanda_Org @web3careerbuild

## 3. 项目一句话说明

非技术版：

> PactTrader 不是让 AI 自由炒币，而是让 AI 只能在用户预先设好的预算、白名单和风控边界内做小额组合再平衡。

技术评委版：

> PactTrader separates strategy generation from wallet authorization: the Agent outputs structured trade proposals, the local Risk Engine performs deterministic checks, and Cobo CAW / Pact executes only actions inside user-approved boundaries.

WCB 打卡版：

> 我把 Hackathon 项目收敛为 PactTrader：一个基于 Cobo CAW / Pact 的受限组合再平衡 Agent。它的重点不是预测收益，而是验证 AI Agent 在链上执行时如何被预算、白名单、滑点、止损和审计日志约束。

## 4. 组队 / 单人参赛状态确认

当前按 **单人参赛** 路径推进。

### 个人负责模块

- 产品定义：PactTrader PRD、目标用户、MVP 场景、风险边界；
- 前端实现：Nuxt.js / Vue / Tailwind / shadcn-vue 风格 dashboard；
- Agent / 策略层：Z.AI API 接入、deterministic fallback、结构化 `TradeProposal`；
- 风控层：local Risk Engine，检查 token、protocol、amount、daily budget、slippage、stop-loss；
- 执行层：Cobo CAW / Pact SDK wrapper、dry-run / fallback；
- 数据层：SQLite audit log；
- 提交材料：README、Demo script、WCB proof、演示录屏。

### 可投入时间

- Week 3：每天约 2–3 小时，重点是方向收敛和材料整理；
- Week 4：预计每天 3–4 小时，重点是实现、验证、录屏和提交。

### 沟通方式

- 课程 / WCB / Telegram / GitHub issue 或 repo 记录；
- Mentor / sponsor 问题会整理成公开安全的问题清单，不包含凭证或内部链接。

## 5. Repo Skeleton

PactTrader 项目仓库已建立：

- GitHub：https://github.com/baikingrio/pacttrader
- 技术栈：Nuxt.js、Vue、TypeScript、Tailwind CSS、shadcn-vue/ui、CAW、Z.AI API、SQLite、Vercel

当前 repo skeleton 已覆盖：

```text
app/
  components/
  pages/
server/
  api/
  services/
    strategy/
    risk/
    caw/
    audit/
    db/
shared/
  types/
tests/
```

README / 项目说明应持续覆盖：

- problem：Agent 不能拥有无限钱包权限；
- track：Cobo CAW / Pact 为主执行层；
- MVP flow：portfolio → proposal → risk decision → execution → audit log；
- tech stack：Nuxt / Vue / TS / Tailwind / shadcn-vue / Z.AI / CAW / SQLite / Vercel；
- risks：CAW 接入、LLM 不稳定、SQLite serverless 限制、真实资金风险；
- validation plan：allowed / blocked / pending / audit log 四条路径。

## 6. Week 4 Sprint Plan

### Day 1：稳定 Demo Skeleton

- 检查 dashboard 信息结构；
- 确认 mock portfolio、strategy proposal、risk decision、audit log 都能跑通；
- 修复阻塞 Demo 的错误。

### Day 2：Agent / Strategy

- 接入 Z.AI API 的策略建议路径；
- 保留 deterministic fallback，保证无 API Key 时仍可演示；
- 输出稳定的 `TradeProposal` JSON。

### Day 3：Policy / Risk Engine

- 完成 token allowlist、protocol allowlist、max trade amount、daily budget、slippage、stop-loss 检查；
- 准备超额交易、未知 token、撤销后失败等负向场景。

### Day 4：CAW / Pact Execution

- 完成 CAW SDK wrapper 的最小健康检查与 payload preview；
- 如果 CAW 凭证可用，尝试 pact / transfer / audit 只读或测试网调用；
- 如果不可用，透明使用 dry-run / mock execution。

### Day 5：SQLite Audit Log

- 统一记录 proposal、risk decision、execution result、error / denial reason；
- Dashboard 展示最近 audit events；
- 补充测试。

### Day 6：Demo Script / Recording

- 整理 3–5 分钟 Demo 讲稿；
- 录制 allowed / blocked / audit log 路径；
- 检查 README、提交链接和隐私安全。

### Day 7：Final Submission

- 最终验证 `npm test` / `npm run build`；
- 部署 Vercel；
- 提交 Hackathon 材料和 WCB proof；
- 再次确认没有提交 `.env`、API Key、私钥、助记词或真实资金信息。

## 7. Proposal Memo

### 项目背景

AI Agent 在 Web3 中如果只停留在“建议层”，价值有限；但如果直接接触钱包、合约和资产，又会带来明显安全风险。PactTrader 想验证一个中间形态：Agent 可以根据组合偏离提出再平衡建议，但资金执行必须受用户授权边界约束。

### 真实场景

用户有一个小额测试组合，例如 70% USDC / 30% WETH。当前组合偏离目标后，Agent 可以建议用 20 USDC 买入 WETH，但这笔操作必须满足：token 在白名单、协议在白名单、金额不超单笔上限、日预算足够、滑点不超限、未触发止损、Pact 未过期或撤销。

### 验证方式

Demo 只验证安全执行路径，不承诺收益：

1. 正常再平衡：policy pass，进入 CAW / dry-run execution；
2. 超额交易：本地 Risk Engine blocked；
3. 未知 token：token allowlist failed；
4. 审计记录：每一步写入 SQLite audit log。

### 可能赛道

主赛道是 Cobo，因为 CAW / Pact 正好对应 scoped authorization 和 Agentic Wallet。Z.AI API 作为策略层，用来展示 Agent 如何生成结构化建议和解释。

## 8. Scope Review

为了保证 Week 4 能交付，v0.1 明确不做：

1. **不做真实主网交易**：只使用测试网、mock 或 dry-run，避免真实资产风险。
2. **不做复杂量化策略**：只做最小 USDC / WETH 再平衡，不做套利、做市、收益挖矿。
3. **不做无限授权或任意合约调用**：只允许白名单 token / protocol / action。
4. **不做完整交易平台**：不做 K 线、订单簿、复杂资产管理或社交交易。
5. **不做长期生产数据库**：SQLite 用于 Demo 审计日志，Vercel 生产部署后可迁移到托管 SQLite。
6. **不让 Agent 持有 owner 私钥**：Agent 只输出 proposal，不直接拥有钱包最终控制权。

## 9. Risk / Assumption Memo

### 关键假设

- Cobo CAW / Pact 的 SDK 或 API 能支持最小 wallet、pact、transfer、audit flow；
- Z.AI API 能返回可解析的策略建议或解释；
- Nuxt server routes 足以承载 Demo 后端；
- SQLite 足以保存 Demo 级审计日志；
- 评委更关注安全边界和可解释执行，而不是收益率。

### 最可能失败点

1. CAW 凭证或测试环境无法在 Week 4 内完全打通；
2. LLM 输出不稳定，影响 Demo；
3. swap / quote / calldata 接入复杂度超过时间预算；
4. Dashboard 叙事不清楚，评委看不出 CAW / Pact 的必要性。

### Fallback Plan

- CAW 不可用：保留 CAW payload preview + dry-run execution，透明说明真实调用状态；
- Z.AI 不可用：使用 deterministic fallback 生成 trade proposal；
- swap 太复杂：先做 transfer / mock execution，重点展示 policy-bound execution；
- Vercel SQLite 限制：本地 SQLite + Demo seed data，生产迁移到 Turso / libSQL。

## 10. Sponsor / Mentor 问题清单

### 给 Cobo 的问题

1. 在 Hackathon Demo 中，PactTrader 更应该优先展示 CAW 的 allowed transfer，还是 pending approval / structured denial 更能体现 CAW 价值？
2. 如果 Week 4 只能完成 CAW payload preview + dry-run，是否可以作为有效的 CAW integration plan？还是必须展示真实测试网调用？
3. 对于 portfolio rebalance 场景，CAW Pact 更推荐先从 transfer policy 开始，还是直接做 contract call / swap router policy？

### 给 Z.AI 的问题

1. 对于交易建议类 Agent，Z.AI API 是否推荐使用严格 JSON schema / structured output 来减少幻觉？
2. 如果模型输出和本地 Risk Engine 冲突，是否有推荐的 trace / explanation 格式帮助用户理解为什么被拒绝？
3. Long-horizon task 评审更关注 Agent 自动拆解任务，还是更关注工具调用后的可验证交付物？

### 给 Mentor / 助教的问题

1. PactTrader 的 Demo 是否应该主打 “安全拒绝越界动作”，而不是追求更多交易功能？
2. Week 4 提交材料中，技术架构文档、repo、Vercel Demo、录屏哪一个最应该优先打磨？
3. 是否需要把 PactTrader 和原 AgentScoope Wallet 做清晰命名说明，避免评委混淆？

## 11. Cobo 赛道对齐任务

PactTrader 与 Cobo 赛道的匹配点：

- **可控钱包边界**：Agent 不能拿 owner 私钥，只能在 CAW / Pact 的 scoped authorization 下执行；
- **预算管理**：单笔上限、日预算、交易次数上限；
- **白名单控制**：token / protocol / router allowlist；
- **风险边界**：slippage、stop-loss、expiry、revoked；
- **执行结果**：allowed、pending approval、denied、failed；
- **审计记录**：proposal、policy decision、execution result 和 denial reason 全部写入 SQLite。

一句话：

> PactTrader uses Cobo CAW / Pact as the execution boundary for an AI trading agent, so the Agent can recommend but cannot bypass user-approved wallet policies.

## 12. Z.AI 赛道对齐任务

PactTrader 中 Z.AI API 的角色是 Agent / 策略层：

- 读取 portfolio snapshot 和用户 intent；
- 生成结构化 `TradeProposal`；
- 用自然语言解释为什么建议再平衡；
- 在被 Risk Engine 拒绝时，生成用户可理解的解释；
- 后续可扩展为 long-horizon workflow：读取组合 → 判断偏离 → 生成 proposal → 调工具检查 → 修复越界字段 → 重新提交 → 输出审计摘要。

安全边界：Z.AI 输出不能直接变成交易授权。所有模型输出必须经过本地确定性 Risk Engine 和 CAW / Pact 执行边界。

## 13. Sponsor SDK / API Integration Plan

### 要接入什么

- `@cobo/agentic-wallet` TypeScript SDK；
- CAW Health / Wallet / Balance / Pacts / Transactions / Audit API；
- PactTrader server services 中的 `cawClient` / `pactClient` / `dryRunExecutor`。

### 怎么接

1. 本地 `.env` 配置 `AGENT_WALLET_API_URL`、`AGENT_WALLET_API_KEY`、`AGENT_WALLET_WALLET_ID`；
2. 先做 health check、wallet list、balance list；
3. 再做 pact payload preview；
4. 如果凭证和测试环境可用，再尝试 submit pact / transfer；
5. 所有真实提交必须显式 `--execute`，默认只 preview / dry-run；
6. 读取 recent audit logs 回填 dashboard。

### Week 4 是否能做完

可完成的最小目标：

- CAW SDK wrapper；
- payload preview；
- dry-run allowed / denied；
- audit log UI；
- 若凭证可用，增加只读 inspect 或测试网 submit。

### 接不通 fallback

- 保留 CAW integration plan 和 payload preview；
- 使用 dry-run executor 展示 allowed / denied / pending；
- 透明说明真实 CAW 环境未打通，不包装成已完成真实执行。

## 14. 技术验证计划

Week 4 要验证的关键技术点：

1. **Agent structured output**：Z.AI API 或 deterministic fallback 能稳定输出 `TradeProposal` JSON；
2. **Risk Engine**：本地 hard-check 能拦截超额、非白名单、滑点过高和 stop-loss；
3. **CAW SDK**：能完成 health / wallet / pact / transfer / audit 的最小 wrapper 或 payload preview；
4. **Execution fallback**：CAW 不可用时，dry-run 仍能完整展示 allowed / denied / pending；
5. **SQLite audit**：每次 proposal、decision、execution result 都能写入并在 dashboard 读取；
6. **Vercel deployment**：无真实凭证时仍能部署 demo 模式；
7. **Testing**：`npm test` 和 `npm run build` 作为提交前门槛。

## 15. 完整 Week 4 Ready Pack 对照

- Hackathon Direction Card：见本文第 1 节 + `hackathon/pacttrader-prd.md`；
- Proposal Memo：见本文第 7 节；
- Repo Skeleton：见本文第 5 节 + https://github.com/baikingrio/pacttrader；
- Week 4 Sprint Plan：见本文第 6 节；
- Risk Memo：见本文第 9 节；
- Sponsor / Mentor 问题清单：见本文第 10 节；
- Sponsor SDK / API Integration Plan：见本文第 13 节；
- 技术验证计划：见本文第 14 节。

## 16. 可提交到 WCB 的简短 proof

```text
我已完成 PactTrader 的 Week 3 Ready Pack，并把项目主线、赛道选择、repo skeleton、Week 4 sprint plan、proposal memo、scope review、risk memo、sponsor / mentor 问题清单、Cobo / Z.AI 对齐说明、CAW SDK integration plan 和技术验证计划整理到公开学习仓库。

PactTrader 是一个基于 Cobo CAW / Pact 的受限组合再平衡 Agent：Agent 只生成结构化交易建议，真正能否执行由本地 Risk Engine 和 CAW / Pact 的授权边界决定。项目使用 Nuxt.js / Vue / TypeScript / Tailwind / shadcn-vue 做前端，Z.AI API 做策略层，CAW 做执行层，SQLite 做审计日志，Vercel 做部署。

Proof 链接：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-pacttrader-ready-pack.md

相关项目仓库：
https://github.com/baikingrio/pacttrader
```
