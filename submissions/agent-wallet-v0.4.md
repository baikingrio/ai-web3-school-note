# AgentScoope Wallet v0.4 PoW

> Hermes Skill + JSON tools + Human Check + 24h daily budget

## 入口

| 材料 | 链接 |
|------|------|
| 项目 README（v0.4） | [experiments/agent-wallet/README.md](../experiments/agent-wallet/README.md) |
| Hermes 集成 | [experiments/agent-wallet/HERMES.md](../experiments/agent-wallet/HERMES.md) |
| Skill | [experiments/agent-wallet/hermes/SKILL.md](../experiments/agent-wallet/hermes/SKILL.md) |
| 审计样例 v0.4 | [experiments/agent-wallet/logs/pow-audit-v0.4.jsonl](../experiments/agent-wallet/logs/pow-audit-v0.4.jsonl) |

## 版本

`agentscoope-wallet@0.4.0`

## 新增能力

1. **Tools CLI** — `npm run tool -- get-policy | get-spending-status | simulate | pay`（单行 JSON）
2. **24h 日累计** — `exceeds_daily_budget`（读 `audit.jsonl` 中 `executed`）
3. **Human Check** — L1 `human_confirm_required`、L2 `requires_owner_signature`
4. **端到端** — `npm run demo:e2e`（无 LLM）

## 验证命令

```bash
cd experiments/agent-wallet
npm test
npm run demo:e2e
npm run demo:human-confirm
npm run demo:owner-required
```

## v0.3 链上 PoW（仍有效）

成功 tx：[0x70583881…](https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5)

## 隐私

不含私钥、`.env` 或 API Key。
