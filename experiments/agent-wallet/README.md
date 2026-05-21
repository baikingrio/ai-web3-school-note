# AgentScoope Wallet｜Agent 受限执行钱包实验

> 目标：用最小可验证实验演示 AI Agent 如何在用户预先定义的链上权限边界内执行小额操作，并在越界时被明确拒绝。

## 背景

Agent Wallet 的核心不是“把主私钥交给 AI”，而是让 Agent 只能在可验证、可限制、可撤销的规则内行动。

本实验服务于 AI × Web3 School Hackathon 项目：**AgentScoope Wallet**。

## v0.1 实验目标

在 Sepolia 测试网上演示：

- 用户使用 Safe 作为主账户 / 控制账户。
- Agent 使用独立测试身份执行操作，不是 Safe owner。
- 权限由 **Safe Allowance Module**（Spending Limits）表达额度；白名单由应用层 Policy 校验。
- 广播前进行 Simulation，并输出人类可读摘要。
- 每次执行或拒绝都留下审计日志。

## 模块选型（v0.1）

| 项 | 选择 |
|----|------|
| 链 | Sepolia (`chainId` 11155111) |
| 账户 | Safe 1-of-1（测试） |
| 权限模块 | **Allowance Module v0.1.0** |
| 模块地址 | `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` |
| 测试 USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| 客户端 | viem + `@safe-global/safe-modules-deployments` |

**分工：**

- **链上**：delegate 额度、周期重置、`removeDelegate` 撤销（见 [Safe AI Agent Quickstart](https://docs.safe.global/home/ai-agent-quickstarts/agent-with-spending-limit)）。
- **应用层**（`src/policy.ts`）：收款白名单、`maxPerTx` / `maxDaily` 预检、`onViolation: reject`（不询问 LLM）。
- **v0.2 计划**：[Zodiac Roles Modifier](https://docs.roles.gnosisguild.org/) 或 Safe Guard，把白名单迁到链上。

> 模块地址务必用 `npm run setup:info` 或 deployments 包解析，避免误用仅在小链部署的 v0.1.1 地址。

## 安全边界

本实验明确不做：

- 不使用主网和真实资金。
- 不提交或记录私钥、助记词、API Key。
- 不让 Agent 持有 Safe owner 私钥。
- 不做无限 `approve`。
- 不允许任意合约、任意方法、任意地址转账（白名单 v0.1 在应用层 enforce）。
- 不把 Policy 违规请求降级为“问 LLM 要不要继续”。

## 快速开始

```bash
cd experiments/agent-wallet
npm install
cp .env.example .env          # SEPOLIA_RPC_URL, AGENT_PRIVATE_KEY
cp config.example.json config.json   # 填入 Safe / Agent / 白名单地址
```

链上准备步骤见 **[SETUP.md](./SETUP.md)**。

```bash
npm run setup:info            # 打印 Sepolia 模块 / USDC 地址
npm run demo:success          # 额度内支付（需已完成 SETUP）
npm run demo:over-limit       # 链上超额 simulate 失败
npm run demo:not-whitelisted  # 应用层白名单拒绝（无需 RPC）
npm run demo:after-revoke     # 撤销 delegate 后失败
```

自定义支付：

```bash
npm run pay -- --to 0xYourRecipient --amount 0.5
DRY_RUN=true npm run pay -- --to 0x... --amount 0.5   # 仅 simulate
```

## 四条 Demo 路径

| # | 命令 | 预期 | 拒绝层 |
|---|------|------|--------|
| 1 | `npm run demo:success` | simulate + 链上成功，有 tx hash | — |
| 2 | `npm run demo:over-limit` | simulate 失败，`exceeds_allowance` | Allowance Module |
| 3 | `npm run demo:not-whitelisted` | 不广播，`transfer_to_unlisted_address` | `src/policy.ts` |
| 4 | `npm run demo:after-revoke` | 失败，`delegate_revoked` | 模块（需先在 Safe UI 移除 delegate） |

## Demo 记录（Sepolia 实测）

| 场景 | tx hash | Etherscan | 审计 `reason` |
|------|---------|-----------|----------------|
| demo_success | `0x39575a02…950b961` | [查看交易](https://sepolia.etherscan.io/tx/0x39575a02d0bef794476ef53c60b39bce08ebd5127c3fb8717db2b5ad6950b961) | `executed` |
| demo_over_limit | 无（simulate 拒绝） | — | `exceeds_allowance` |
| demo_not_whitelisted | 无 | — | `transfer_to_unlisted_address` |
| demo_after_revoke | 无 | — | 见下方说明 |

**测试网地址（可公开）**

- Safe：`0x6896DDd6E05bA19d3f2697Ebb231A60d6d2F23b7`
- Agent delegate：`0x6Ab1a68c4a6Ba2384050Ed1411d9B91C30EC902E`

**链上 revert 解读**

- `demo_over_limit`（2 USDC）：模块 revert `newSpent > allowance.spent && newSpent <= allowance.amount` → 额度超限，审计应为 `exceeds_allowance`（旧版脚本误标为 `delegate_revoked`，因错误信息里含有 ABI 参数名 `delegate`）。
- `demo_after_revoke`：若仍出现上述 **同一** revert，说明 delegate 可能仍在，或 **日额度已用尽**（success 已花 0.5/1 USDC）。正确流程：在 Safe UI **Remove delegate** 后重跑；审计应出现 `delegate_revoked`。若需先恢复额度，在 UI 重新添加 Spending limit 再测。

脱敏样例见 [`logs/sample.jsonl`](./logs/sample.jsonl)。

## 目录结构

```text
experiments/agent-wallet/
  README.md
  SETUP.md
  package.json
  config.example.json
  config.json          # gitignore，本地填写
  .env.example
  src/
    config.ts
    policy.ts
    audit.ts
    allowance.ts
    pay.ts
    cli.ts
    scripts/print-setup-info.ts
  logs/
    sample.jsonl
    audit.jsonl        # gitignore，本地运行生成
```

## Agent 不能做什么（v0.1）

- 不能作为 Safe owner 签任意交易。
- 不能超出 Allowance Module 配置的 token 额度。
- 不能向 `config.json` 白名单以外的地址付款（应用层；私钥泄露仍可能绕过，见 v0.2 Guard）。
- 不能在 Policy 过期后继续执行。
- 不能在用户 `removeDelegate` 后继续花费。

## 下一步（已完成项）

- [x] 调研 Safe Sepolia Allowance Module 地址与用法
- [x] 写出 viem simulation + 执行脚本与四条 demo CLI
- [x] 审计 JSONL 与 `logs/sample.jsonl`
- [x] 创建 Sepolia Safe、启用 Spending limits、填入 `config.json`
- [x] 跑通四条 demo（成功 tx 已记录；可选：撤销前重跑 `demo:over-limit` 以捕获 `exceeds_allowance`）

## 隐私提醒

本目录可以公开提交，但只能包含测试网地址、测试交易 hash、公开文档和脱敏日志。不要提交任何私钥、助记词、API Key 或真实资金相关敏感信息。
