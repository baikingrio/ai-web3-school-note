# Cobo CAW SDK 最小接入实验

> 目的：阅读并熟悉 `@cobo/agentic-wallet` TypeScript SDK，把 PactTrader / AgentScoope 后续接入 CAW 的最小调用方式保存成可复用实验。  
> 状态：已完成 SDK 研究与 dry-run 示例；真实 CAW 调用需要本地 `.env` 凭证，不能提交到公开仓库。

## 1. 已研究的 SDK 信息

通过 npm 包 `@cobo/agentic-wallet@0.1.7` 研究到：

- SDK 是 TypeScript / Node.js 的 axios-based HTTP client；
- OpenAPI 版本：`1.3.0`；
- 认证通过 `Configuration({ basePath, apiKey })` 注入；
- 默认 base path 是 `http://localhost`，实际使用时必须配置 `AGENT_WALLET_API_URL`；
- 核心理念：Agent 不直接持有 owner 私钥，而是通过 owner-approved Pact 获得 scoped API key；
- Pact 提交后可能进入 `pending approval`，owner 审批后变为 `active`；
- active pact 会返回 `api_key`，后续执行应切换到 pact-scoped API key；
- policy evaluation 会在 transfer / contractCall 提交前发生，deny 会返回结构化错误；
- transfer / contractCall 也可能返回 `pending_approval`，可通过 pending operation 继续追踪；
- audit log 可过滤 `allowed` / `denied` / `pending` / `error`。

相关仓库 / 包：

- npm: `@cobo/agentic-wallet`
- TypeScript SDK repo: `https://github.com/CoboGlobal/cobo-agentic-wallet-ts-sdk`
- Python SDK repo: `https://github.com/CoboGlobal/cobo-agentic-wallet-python-sdk`
- CLI repo: `https://github.com/CoboGlobal/cobo-agentic-wallet-cli`

## 2. 本实验覆盖的 CAW API

`src/caw-minimal.ts` 使用以下 SDK 类：

- `HealthApi`：健康检查；
- `WalletsApi`：读取 wallet 列表；
- `BalanceApi`：读取 wallet balance；
- `PactsApi`：提交 Pact、列出 Pact；
- `TransactionsApi`：提交 transfer；
- `AuditApi`：读取 audit log。

没有把真实提交设为默认行为，避免误操作。

## 3. 安装

```bash
cd /home/workspace/ai-web3-school-note/experiments/caw-sdk-minimal
npm install
```

## 4. 配置

复制示例 env：

```bash
cp .env.example .env
```

填写本地 CAW 凭证：

```bash
AGENT_WALLET_API_URL=...
AGENT_WALLET_API_KEY=...
AGENT_WALLET_WALLET_ID=...
```

注意：

- `.env` 不能提交；
- 不要在公开笔记里记录 API Key；
- 只使用测试网、小额测试 token；
- 真实提交前必须确认 scope。

## 5. 命令

### 5.1 dry-run：无网络、无广播

```bash
npm run dry-run
```

作用：

- 打印 Pact payload preview；
- 打印 allowed transfer payload；
- 打印 denied transfer payload；
- 不调用 CAW API；
- 不提交 Pact；
- 不广播交易。

### 5.2 inspect：只读检查

```bash
npm run inspect
```

作用：

- health check；
- list wallets；
- 如果配置了 `AGENT_WALLET_WALLET_ID`，读取 balances 和 pacts。

### 5.3 submit-pact：提交 Pact（需要显式 --execute）

预览 payload：

```bash
npm run submit-pact
```

真实提交：

```bash
npm run submit-pact -- --execute
```

提交后 owner 可能需要在 Cobo Agentic Wallet app 中审批。Pact active 后，返回的 `api_key` 应作为 pact-scoped API key 用于执行。

### 5.4 transfer：提交测试转账（需要显式 --execute）

预览 payload：

```bash
npm run transfer
```

真实提交：

```bash
npm run transfer -- --execute
```

如果 policy deny，脚本会打印结构化错误和 suggestion；如果通过，会继续读取 recent audit logs。

## 6. Pact 示例

当前 dry-run 生成的是一个 transfer policy，不是最终 PactTrader swap policy。它用于先熟悉 SDK 的 Pact 提交流程：

```json
{
  "wallet_id": "<AGENT_WALLET_WALLET_ID>",
  "intent": "PactTrader demo: allow a small testnet token transfer while blocking amounts above the configured threshold.",
  "spec": {
    "policies": [
      {
        "name": "pacttrader-small-transfer-limit",
        "type": "transfer",
        "rules": {
          "effect": "allow",
          "when": {
            "chain_in": ["SETH"],
            "token_in": [{ "chain_id": "SETH", "token_id": "SETH_USDC" }]
          },
          "deny_if": { "amount_gt": "0.002" }
        }
      }
    ],
    "completion_conditions": [
      { "type": "time_elapsed", "threshold": "86400" },
      { "type": "tx_count", "threshold": "3" }
    ]
  }
}
```

## 7. 和 PactTrader 的关系

PactTrader 最终需要的是 swap / contractCall 类型的 Pact，例如：

```text
Agent Proposal
  -> Local Risk Engine pass
  -> CAW contractCall estimate / submit
  -> CAW policy allowed / pending / denied
  -> Audit Log
```

当前实验先选 `transfer` 是为了降低接入不确定性：

- transfer payload 更简单；
- 更容易测试 deny_if；
- 能先熟悉 Configuration、PactsApi、TransactionsApi、AuditApi 的使用方式；
- 后续可把 `transferTokens` 替换为 `contractCall`。

`contractCall` 的关键字段包括：

```ts
{
  chain_id: 'BASE_ETH' | 'SETH',
  contract_addr: '0xApprovedSwapRouter',
  value: '0',
  calldata: '0x...',
  request_id: '...',
  sponsor: true,
  description: 'PactTrader rebalance swap'
}
```

## 8. 后续接入计划

1. 先用 `npm run inspect` 验证 API URL / API key / wallet id；
2. 用 `npm run submit-pact -- --execute` 创建一个小额测试 Pact；
3. owner 审批后切换到 pact-scoped API key；
4. 用 `npm run transfer -- --execute` 验证 allowed / denied / audit log；
5. 将 transfer demo 改造成 PactTrader 的 contractCall / swap calldata preview；
6. 如果 CAW 环境不可用，则保持 CAW-first 设计，执行层暂用 Safe + Zodiac Roles fallback，并在 README 中透明说明。

## 9. 安全边界

- 不提交 `.env`；
- 不打印 API Key；
- 不处理 owner 私钥或助记词；
- 没有 `--execute` 不做任何写操作；
- 默认 token / amount 都是测试网小额参数；
- 所有真实提交前都需要人工确认 scope。
