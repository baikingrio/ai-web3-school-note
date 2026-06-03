# PRD｜PactTrader：基于 Cobo CAW 的受限组合再平衡 Agent

> 版本：v0.1  
> 日期：2026-06-02  
> 项目方向：Cobo 赛道｜Autonomous Trading / Agentic Wallet Application  
> 工作名：PactTrader  
> 保存原则：本文件只记录公开安全的产品与技术设计，不包含任何私钥、API Key、钱包助记词、真实资金地址或未确认提交信息。

## 1. 一句话

PactTrader 是一个基于 **Cobo Agentic Wallet（CAW）/ Pact** 的受限组合再平衡 Agent：用户先定义 token 白名单、协议白名单、单笔上限、日预算、滑点、止损与有效期，AI Agent 只能在这些边界内对小额 USDC / ETH 组合提出并执行再平衡动作，所有允许、拒绝、pending approval 都会留下审计记录。

英文一句话：

> PactTrader is a policy-bound portfolio rebalancing agent that can only execute small USDC/ETH rebalance actions within user-approved Cobo CAW Pact boundaries.

## 2. 背景与机会

AI Agent 可以读取市场、生成交易计划、调用钱包或合约，但交易场景不能把控制权直接交给概率系统。尤其在链上环境里，Agent 可能因为幻觉、市场噪音、prompt injection 或策略错误而：

- 购买未知 token；
- 调用非白名单合约；
- 过度交易；
- 忽略滑点或预算；
- 亏损后继续扩大风险；
- 在用户没有复核的情况下执行高风险动作。

Cobo CAW 提供 scoped authorization、Pact、policy evaluation、pending approval、denial 和 audit log，适合作为 Agent 资金执行层。PactTrader 不重复造钱包，而是做 CAW 上方的交易策略、风控解释和组合状态层。

## 3. 产品目标

### 3.1 核心目标

在黑客松 MVP 中证明：

1. Agent 可以根据组合偏离生成结构化交易建议；
2. 本地 Risk Engine 先做确定性硬检查；
3. 只有通过检查的动作才进入 Cobo CAW；
4. CAW Pact 再进行链上执行前的 policy evaluation；
5. 越界动作会被拒绝或进入 pending approval；
6. 每一步都有 audit log，可复盘、可撤销、可解释。

### 3.2 非目标

v0.1 不追求：

- 真实收益保证；
- 套利、做市、复杂收益挖矿；
- 主网真实资产；
- 无限 approve；
- 任意合约任意方法；
- Agent 持有 owner 私钥或助记词；
- 大额自动交易；
- 复杂量化策略或多资产投顾系统。

## 4. 目标用户

### 用户 A：AI/Web3 Builder

- 想让 Agent 自动完成低风险、小额链上操作；
- 但不愿意给 Agent 主私钥或无限授权；
- 希望看到明确的预算、白名单、拒绝原因和审计记录。

### 用户 B：黑客松评委 / Cobo 赛道观察者

- 关注 Agentic Wallet 是否真的进入执行层；
- 需要看到 CAW/Pact 的必要性，而不是一个普通 AI 交易建议工具；
- 需要清楚区分 “Agent 建议” 和 “Wallet/Policy 授权”。

## 5. 核心用户故事

1. 作为用户，我可以设置一个小额组合目标，例如 70% USDC / 30% ETH。
2. 作为用户，我可以限制 Agent 只能使用 USDC、WETH 和指定 DEX Router。
3. 作为用户，我可以限制单笔最多 20 USDC、24 小时最多 100 USDC、最多 3 笔交易。
4. 作为用户，我可以设置最大滑点、止损与有效期。
5. 作为 Agent，我只能输出结构化 trade proposal，不能绕过 policy 执行。
6. 作为用户，我可以看到每次交易为什么被允许、拒绝或要求人工确认。
7. 作为用户，我可以撤销 Pact，让 Agent 后续无法继续执行。

## 6. MVP 场景

### 6.1 默认组合

```text
目标组合：70% USDC / 30% ETH
当前组合：90% USDC / 10% ETH
总价值：100 USD（demo 可用 mock）
再平衡阈值：5%
建议动作：Swap 20 USDC to WETH
```

### 6.2 授权边界

```text
allowed_tokens: USDC, WETH
allowed_protocols: Uniswap V3 / approved swap router
max_trade_amount_usd: 20
max_daily_budget_usd: 100
max_trades_per_day: 3
max_slippage_bps: 100
stop_loss_percent: 5
pact_expiry: 24h
```

## 7. 关键流程

```text
User Trading Intent
  -> Portfolio State Reader
  -> Strategy Agent
  -> Trade Proposal JSON
  -> Local Risk Engine
  -> Cobo CAW Pact / Contract Call or Transfer
  -> Allowed / Pending Approval / Denied
  -> Audit Log + Portfolio Snapshot
```

### 7.1 Strategy Agent

输入：组合状态、目标比例、价格或 quote。  
输出：结构化 JSON。

示例：

```json
{
  "proposal_id": "trade_001",
  "strategy": "rebalance",
  "action": "swap",
  "from_token": "USDC",
  "to_token": "WETH",
  "amount_in": "20",
  "protocol": "Uniswap V3",
  "reason": "ETH allocation is 10%, below the 30% target by 20 percentage points.",
  "risk_level": "low",
  "expected_effect": {
    "before": { "USDC": "90%", "ETH": "10%" },
    "after_estimated": { "USDC": "70%", "ETH": "30%" }
  }
}
```

### 7.2 Local Risk Engine

必须检查：

- strategy 是否允许；
- from/to token 是否在白名单；
- protocol/router 是否在白名单；
- 单笔金额是否超限；
- 日预算是否足够；
- 交易次数是否超限；
- 滑点是否超限；
- 是否触发 stop-loss；
- 是否需要人工确认；
- 是否偏离原始用户 intent。

输出示例：

```json
{
  "decision": "auto_trade_allowed",
  "reason": "Trade is within local risk policy and Cobo Pact boundaries.",
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

## 8. CAW / Pact 设计草案

> 下面是产品层草案，最终字段需按 CAW SDK / OpenAPI schema 调整。

```json
{
  "intent": "Allow the agent to rebalance a small USDC/WETH portfolio for 24 hours.",
  "execution_plan": "The agent may swap USDC to WETH or WETH to USDC when portfolio allocation deviates from target by more than 5%.",
  "spec": {
    "policies": [
      {
        "name": "allow-small-rebalance-swap",
        "type": "contract_call",
        "rules": {
          "effect": "allow",
          "when": {
            "chain_in": ["BASE_ETH", "SETH"],
            "target_in": [
              {
                "chain_id": "BASE_ETH",
                "contract_addr": "0xApprovedSwapRouter",
                "function_id": "0x..."
              }
            ]
          },
          "deny_if": {
            "amount_usd_gt": "20"
          },
          "review_if": {
            "amount_usd_gt": "10"
          }
        }
      }
    ],
    "completion_conditions": [
      { "type": "time_elapsed", "threshold": "86400" },
      { "type": "tx_count", "threshold": "3" },
      { "type": "amount_spent_usd", "threshold": "100" }
    ]
  }
}
```

## 9. 功能范围

### P0：必须完成

- PRD / README / demo script；
- mock portfolio；
- rebalance calculation；
- trade proposal JSON；
- local risk checker；
- audit log；
- CAW SDK 最小接入示例；
- 至少展示 allowed / denied / pending 其中 1–2 个路径；
- 若 CAW 凭证或测试环境受限，则透明使用 Safe + Zodiac Roles fallback。

### P1：加分项

- 读取真实钱包余额；
- 调 Uniswap quote / Quoter；
- 生成 swap calldata preview；
- CAW contractCall 估费与提交；
- dashboard 展示 before/after allocation。

### P2：延期

- 真实主网交易；
- 多策略组合；
- DCA / yield / Polymarket / LP；
- 完整前端交易系统。

## 10. Demo 路径

### Demo A：正常再平衡成功

- 当前 ETH 低于目标；
- Agent 建议 20 USDC 买 ETH；
- local policy pass；
- CAW Pact pass；
- 执行或模拟执行；
- audit log 记录 tx / request id。

### Demo B：超额交易被拒绝

- Agent 建议 80 USDC 买 ETH；
- 单笔上限 20 USDC；
- local risk engine blocked；
- 不调用 CAW 执行。

### Demo C：未知 token 被拒绝

- Agent 被诱导买 PEPE；
- token 不在 allowlist；
- blocked；
- 不调用 CAW。

### Demo D：止损或撤销后停止

- 触发 stop-loss / max_failed_trades / pact revoked；
- Agent 再次提交交易被拒绝；
- audit log 展示停止原因。

## 11. 页面 / CLI 展示

MVP 可先 CLI，后续再做 dashboard。

必要展示区：

1. Strategy Setup：目标比例和授权边界；
2. Portfolio State：当前比例、目标比例、偏离；
3. Agent Proposal：交易建议；
4. Risk & Pact Check：pass / fail / pending；
5. Audit Log：时间、proposal、decision、tx hash / denial reason。

## 12. 技术架构

```text
src/
  portfolio/reader.ts          # mock 或真实余额读取
  strategy/rebalance.ts        # 再平衡计算
  risk/policy-checker.ts       # 硬风控
  caw/client.ts                # CAW SDK wrapper
  caw/pact.ts                  # Pact submit / poll / status
  caw/transactions.ts          # transfer / contractCall / estimate
  audit/logger.ts              # JSONL audit log
  cli.ts                       # demo 命令入口
```

## 13. 数据结构

### Trading Intent

```json
{
  "strategy": "rebalance",
  "target_allocation": { "USDC": 0.7, "ETH": 0.3 },
  "rebalance_threshold": 0.05,
  "max_trade_amount_usd": "20",
  "daily_budget_usd": "100",
  "max_trades_per_day": 3,
  "allowed_tokens": ["USDC", "WETH"],
  "allowed_protocols": ["Uniswap V3"],
  "max_slippage_bps": 100,
  "stop_loss_percent": 5,
  "expires_in_hours": 24
}
```

### Audit Log

```json
{
  "timestamp": "2026-06-02T00:00:00.000Z",
  "proposal_id": "trade_001",
  "decision": "auto_trade_allowed",
  "caw_status": "allowed",
  "tx_id": "optional",
  "transaction_hash": "optional",
  "denial_reason": null
}
```

## 14. 成功标准

黑客松 v0.1 成功标准：

- 评委能在 3 分钟内理解：Agent 不是无限交易，而是受 Pact 约束；
- 至少一条正常路径、一条拒绝路径可稳定演示；
- 所有交易建议都是结构化输出；
- 越界动作不会广播；
- CAW SDK 接入示例能说明如何 health check、list wallet/balance、submit pact、poll pact、transfer 或 contractCall；
- 所有公开材料不包含私钥、API Key、助记词、真实资金敏感信息。

## 15. 风险与应对

- **CAW 凭证 / 邀请码不可用**：保留 SDK 示例和 dry-run pact payload；执行层使用 Safe + Zodiac Roles fallback。
- **Uniswap 测试网流动性不足**：先 mock quote 或只做 calldata preview。
- **被误解成 AI 炒币**：Pitch 中强调 policy-bound、small mandate、auditability、revocation，不讲收益保证。
- **策略太简单**：把重点放在执行安全，而不是收益算法复杂度。

## 16. 推荐 Pitch 顺序

1. 问题：AI 交易 Agent 不能拥有无限钱包权限；
2. 场景：小额 USDC/ETH 组合再平衡；
3. 用户授权：token、protocol、amount、budget、slippage、stop-loss、expiry；
4. Agent 建议：结构化 proposal；
5. 风控裁决：local policy + CAW Pact；
6. Demo：allowed / blocked / revoked；
7. 总结：Cobo 让 Agent 交易可执行且受约束，PactTrader 让 Agent 交易可理解、可风控、可复盘。
