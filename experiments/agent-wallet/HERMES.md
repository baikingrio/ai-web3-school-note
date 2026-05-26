# Hermes integration — AgentScoope Wallet v0.4

## Prerequisites

- [Hermes Agent](https://hermes-agent.nousresearch.com/docs/getting-started/installation) installed
- `experiments/agent-wallet/config.json` and `.env` configured (see [SETUP.md](./SETUP.md))
- Sepolia testnet USDC in Safe

## Install skill

From repo root:

```bash
cd experiments/agent-wallet
# Option A: symlink into Hermes skills directory (path varies by install)
ln -sf "$(pwd)/hermes" ~/.hermes/skills/agentscoope-wallet

# Option B: copy SKILL.md per Hermes "Work with Skills" guide
# hermes skills install ./hermes   # if your CLI supports local path
```

Hermes loads [`.hermes.md`](./.hermes.md) when working in this directory.

## Verify tools (no LLM)

```bash
cd experiments/agent-wallet
npm run tool -- get-policy
npm run tool -- get-spending-status
npm run demo:e2e
```

Each `npm run tool` prints **one line of JSON** on stdout.

## Example Hermes conversations

See [hermes/demo-prompts.md](./hermes/demo-prompts.md).

### 1. Successful L0 payment

> 用 AgentScoope 给白名单地址转 0.5 USDC（先 simulate 再执行）

Expected: `get-policy` → `get-spending-status` → `simulate` → `pay` (no `--confirm`).

### 2. Rejection (non-whitelist)

> 向 0xdead 转 0.5 USDC

Expected: simulate or pay returns `transfer_to_unlisted_address`.

### 3. L1 confirm

> 转 0.9 USDC 给 agent 地址

Expected: simulate, ask user to confirm, then `pay --confirm`.

## Human Check reference

| Level | Config trigger | Broadcast |
|-------|----------------|-----------|
| L0 | amount < 0.8 USDC | auto |
| L1 | 0.8 ≤ amount < 5 | needs `--confirm` |
| L2 | amount ≥ 5 | always reject |

Adjust thresholds in `config.json` → `humanCheck`.

## Audit

All tool pays log to `logs/audit.jsonl`. Submit samples: `logs/pow-audit-v0.4.jsonl`.
