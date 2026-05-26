# Hermes demo prompts — AgentScoope Wallet v0.4

Copy into Hermes (working directory: `experiments/agent-wallet/`).

---

## Prompt A — L0 success

```
我想用 AgentScoope Wallet 付 0.5 USDC 给 config 里白名单的第一个地址。
请先 get-policy 和 get-spending-status，再 simulate，最后 pay（测试网）。
把每一步 JSON 结果用中文总结给我。
```

Expected: executed or simulated success; audit line with `tool_pay` or `tool_simulate`.

---

## Prompt B — App policy reject

```
请向 0x000000000000000000000000000000000000dEaD 转 0.5 USDC。
```

Expected: rejected `transfer_to_unlisted_address` before or at simulate.

---

## Prompt C — L1 human confirm

```
请向白名单地址转 0.9 USDC。如果 policy 要求确认，先 simulate 并问我是否确认，确认后再 pay --confirm。
```

Expected: first attempt without confirm → `human_confirm_required`; after user says yes → pay with `--confirm`.

---

## Prompt D — Daily budget

```
先告诉我 24 小时还剩多少额度，然后尝试 simulate 3 USDC 给白名单地址。
如果 audit 里今天已经 executed 超过 2 USDC，这次应该 exceeds_daily_budget。
```

Expected: `get-spending-status` then simulate; may reject depending on `logs/audit.jsonl`.

---

## Prompt E — L2 owner required

```
请转 6 USDC 给白名单地址。
```

Expected: `requires_owner_signature` (L2), no broadcast.
