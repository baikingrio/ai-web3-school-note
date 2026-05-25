# Week 1 Proof-of-Work Pack｜Quinn · AI × Web3 School

> **总入口文档**（WCB 任务：`Week 1｜AI × Web3 综合任务｜提交 Week 1 Proof-of-Work Pack`）  
> 公开仓库：https://github.com/baikingrio/ai-web3-school-note  
> 最新 commit：提交后见 git log

---

## 1. 本周学了什么（AI）

- **Agent / Workflow / Tool Use**：Agent 不是无限自主聊天，而是在明确 workflow 里拆解任务、调用工具、检查结果、处理失败。
- **Hermes Learning Agent**：用于学习记录、任务拆解、PoW 整理（见 `daily/2026-05-19.md`）。
- **Tool Calling 设计**：钱包 Agent 应把「规划」与「受限执行」分离（见 `daily/2026-05-22.md`）。
- **Agentic Economy**：ERC-8004（身份/声誉/验证）与 ERC-8183（任务托管/评估/结算）强调可验证流程（见 `daily/2026-05-23.md`）。

详细文字总结：[`tasks/week1-learning-summary.md`](../tasks/week1-learning-summary.md)

---

## 2. Learning Agent / AI 工具实践

| 实践 | 链接 |
|------|------|
| 学习仓库初始化 | [`daily/2026-05-18.md`](../daily/2026-05-18.md) |
| Hermes 与工作流 | [`daily/2026-05-19.md`](../daily/2026-05-19.md) |
| Agent Wallet 实验目录 | [`daily/2026-05-20.md`](../daily/2026-05-20.md) |
| Week 1 学习总结 | [`tasks/week1-learning-summary.md`](../tasks/week1-learning-summary.md) |

---

## 3. Web3 学习与实践

| 主题 | 记录 |
|------|------|
| Web3 运行原理 | [`daily/2026-05-20.md`](../daily/2026-05-20.md) |
| Safe / 多签 / 模块权限 | [`daily/2026-05-22.md`](../daily/2026-05-22.md) |
| Sepolia 测试网交易 | 见下方链上证明 |

---

## 4. Hackathon 项目：AgentScoope Wallet v0.3

**方向**：Agent 受限执行钱包 — Agent 不持有 Safe owner 私钥，只在 Zodiac Roles 边界内执行 USDC 转账。

| 材料 | 链接 |
|------|------|
| 项目 brief | [`hackathon/agent-wallet-permissions-brief.md`](../hackathon/agent-wallet-permissions-brief.md) |
| 项目 README | [`experiments/agent-wallet/README.md`](../experiments/agent-wallet/README.md) |
| 链上 SETUP | [`experiments/agent-wallet/SETUP.md`](../experiments/agent-wallet/SETUP.md) |
| 版本 | `agentscoope-wallet@0.3.0` |

### 链上身份（Sepolia，公开地址）

| 角色 | 地址 |
|------|------|
| Safe | `0x6896DDd6E05bA19d3f2697Ebb231A60d6d2F23b7` |
| Agent EOA | `0x6Ab1a68c4a6Ba2384050Ed1411d9B91C30EC902E` |
| Roles 实例 | `0x37C7b7437B6Bd27A15b330e6585940DEE03d2667` |
| USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

### 链上证明（≥4 笔代表性交易）

| 步骤 | Etherscan |
|------|-----------|
| `roles:apply` Call 1 | [0xe4a8bc…](https://sepolia.etherscan.io/tx/0xe4a8bc3354d7bd6de2f339450dfa78dd53aeb95a1180aad9b7118589cbbd4448) |
| `roles:apply` Call 2 | [0x098b4f…](https://sepolia.etherscan.io/tx/0x098b4f3c49797eed7d3525cc0f94e3ba14c0fb7ab7a9ddebaf4a0695e5d20460) |
| `demo:success` | [0x705838…](https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5) |
| `roles:revoke` | [0xfb587c…](https://sepolia.etherscan.io/tx/0xfb587c9b4cfb54adb5534aaf1954de0b72e6bfd7e34f0d3cf45d23ed0c69a14c) |
| `roles:apply`（恢复成员） | [0xa3e7d4…](https://sepolia.etherscan.io/tx/0xa3e7d41e341f2959376bace3b5d720e785693dbda8822153f401200867399cab) |

### 五条 Demo 审计（JSONL）

[`experiments/agent-wallet/logs/pow-audit-v0.3.jsonl`](../experiments/agent-wallet/logs/pow-audit-v0.3.jsonl)

| scenario | decision | reason | rejectLayer |
|----------|----------|--------|-------------|
| demo_success | executed | — | — |
| demo_over_limit | rejected | exceeds_allowance | zodiac_roles |
| demo_not_whitelisted | rejected | transfer_to_unlisted_address | app_policy |
| demo_roles_only | rejected | transfer_to_unlisted_address | zodiac_roles |
| demo_after_revoke | rejected | role_revoked | zodiac_roles |

---

## 5. AI × Web3 最小交叉实验（流程）

```text
用户目标
  → Agent 生成计划（CLI / 未来 Tool Calling）
  → Policy 检查（app + 链上）
  → viem Simulation
  → Zodiac Roles execTransactionWithRole
  → executed 或 rejected（明确 reason + rejectLayer）
  → audit.jsonl 记录
  → Etherscan 验证
```

架构图见 [`experiments/agent-wallet/README.md`](../experiments/agent-wallet/README.md)。

---

## 6. 本周问题与人工修正（必填）

**问题**：Safe **1.4.1** 上 Allowance Module + Module Guard 主路径受阻；`demo:after-revoke` 在未先 `roles:revoke` 时误跑成功。

**修正**：

1. 改用 **Zodiac Roles Modifier** 作为 v0.3 主路径（Safe 1.4.1 可用，无需 Module Guard）。
2. 新增 `npm run roles:revoke`，先移除成员再跑 `demo:after-revoke`，正确得到 `NoMembership()` / `role_revoked`。
3. 文档与 `pow-audit-v0.3.jsonl` 同步五条 demo 证据。

记录：[`daily/2026-05-22.md`](../daily/2026-05-22.md)、[`daily/2026-05-23.md`](../daily/2026-05-23.md)

---

## 7. Week 1 每日学习记录索引

- [`daily/2026-05-18.md`](../daily/2026-05-18.md) — 仓库初始化、Hackathon 方向
- [`daily/2026-05-19.md`](../daily/2026-05-19.md) — Hermes Learning Agent
- [`daily/2026-05-20.md`](../daily/2026-05-20.md) — Web3 运行原理、Agent Wallet 实验
- [`daily/2026-05-21.md`](../daily/2026-05-21.md) — AI × Web3 应用场景
- [`daily/2026-05-22.md`](../daily/2026-05-22.md) — Tool Calling、Safe 方案调整
- [`daily/2026-05-23.md`](../daily/2026-05-23.md) — Agentic Economy、v0.3 PoW 整理

---

## 8. 隐私说明

本 Pack 不含私钥、助记词、API Key、`.env`、会议密码或真实资金信息。链上材料均为 **Sepolia 测试网** 公开记录。

---

## WCB 提交用短链（复制粘贴）

```text
Week 1 Proof-of-Work Pack 总入口：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week1-pow-pack.md

Hackathon 项目（AgentScoope Wallet v0.3）：
https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

链上成功执行：
https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5

审计 JSONL（五条 demo）：
https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.3.jsonl
```
