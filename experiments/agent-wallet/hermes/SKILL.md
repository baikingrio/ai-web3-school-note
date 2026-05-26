---
name: agentscoope-wallet
description: >-
  AgentScoope Wallet tools for Sepolia Safe + Zodiac Roles — query policy,
  spending status, simulate and execute bounded USDC transfers. Use when the
  user asks to pay, transfer USDC, check wallet limits, or run agent wallet demos.
---

# AgentScoope Wallet (Sepolia)

Agent **restricted execution** wallet. Agent EOA is **not** Safe owner. All writes go through `npm run tool` in `experiments/agent-wallet/`.

## Security (mandatory)

- **Never** ask for or store owner private keys, seed phrases, or `.env` contents.
- **Never** bypass policy by inventing calldata or calling contracts directly.
- **Never** broadcast L2 amounts (≥ `ownerSignatureAboveAmount`, default 5 USDC) — refuse and explain owner must sign.
- On violation: **reject** with reason; do not ask the user to "continue anyway".

## Working directory

Always `cd` to the agent-wallet package before tools:

```bash
cd experiments/agent-wallet
```

Requires `config.json` and `.env` (testnet `AGENT_PRIVATE_KEY`, `SEPOLIA_RPC_URL`).

## Tool commands (JSON on stdout)

| Step | Command |
|------|---------|
| Read policy | `npm run tool -- get-policy` |
| 24h spending | `npm run tool -- get-spending-status` |
| Safe USDC balance | `npm run tool -- get-balance` |
| Simulate pay | `npm run tool -- simulate --to <addr> --amount <human>` |
| Execute pay | `npm run tool -- pay --to <addr> --amount <human>` |
| Execute (dry) | add `--dry` |
| L1 confirm | add `--confirm` when amount ≥ `confirmAboveAmount` (default 0.8) |

Parse **one JSON line** from stdout. Errors exit code 1 with `{ "ok": false, "error": "..." }`.

## Required flow for payments

1. `get-policy` — confirm whitelist and limits.
2. `get-spending-status` — show 24h used / remaining.
3. `simulate --to ... --amount ...` — show simulation summary.
4. If amount ≥ confirm threshold: **ask user to confirm in chat**, then `pay ... --confirm`.
5. If amount ≥ owner threshold: **stop** — `requires_owner_signature`.
6. Otherwise: `pay --to ... --amount ...` (or `--dry` first).

## Example user intents

- "Pay 0.5 USDC to the whitelisted agent address" → simulate then pay (L0).
- "Send 0.9 USDC" → simulate, ask confirm, then `pay --confirm`.
- "Send 6 USDC" → refuse (L2).
- "What's my daily budget left?" → `get-spending-status`.

## Demos (CLI, no LLM)

```bash
npm run demo:e2e
npm run demo:human-confirm
npm run demo:daily-budget
```

See [HERMES.md](../HERMES.md) and [demo-prompts.md](./demo-prompts.md).
