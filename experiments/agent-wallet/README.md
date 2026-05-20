# AgentScoope Wallet｜Agent 受限执行钱包实验

> 目标：用最小可验证实验演示 AI Agent 如何在用户预先定义的链上权限边界内执行小额操作，并在越界时被明确拒绝。

## 背景

Agent Wallet 的核心不是“把主私钥交给 AI”，而是让 Agent 只能在可验证、可限制、可撤销的规则内行动。

本实验服务于 AI × Web3 School Hackathon 项目：**AgentScoope Wallet**。

## v0.1 实验目标

在 Sepolia 测试网上演示：

- 用户使用 Safe 作为主账户 / 控制账户。
- Agent 使用独立测试身份执行操作，不是 Safe owner。
- 权限由现成 Safe Module / Spending Limit / Roles Modifier / Policy 表达。
- 广播前进行 Simulation，并输出人类可读摘要。
- 每次执行或拒绝都留下审计日志。

## 安全边界

本实验明确不做：

- 不使用主网和真实资金。
- 不提交或记录私钥、助记词、API Key。
- 不让 Agent 持有 Safe owner 私钥。
- 不做无限 `approve`。
- 不允许任意合约、任意方法、任意地址转账。
- 不把 Policy 违规请求降级为“问 LLM 要不要继续”。

## 推荐技术路径

- Network：Sepolia
- Account：Safe 测试账户
- Permission：Safe 现成模块，优先调研 Spending Limit / Allowance / Zodiac Roles Modifier
- Client：viem
- Simulation：`simulateContract` / `simulateCalls`
- Logs：JSONL 或 Markdown 审计记录

## 四条 Demo 路径

1. **额度内成功**
   - 请求：向白名单地址支付小额测试代币。
   - 预期：Simulation 通过，Agent 执行成功，记录 tx hash。

2. **超额拒绝**
   - 请求：支付超过日限额或单笔限额的金额。
   - 预期：Policy / Module / Guard 拒绝，记录明确原因。

3. **非白名单拒绝**
   - 请求：向非白名单地址或未授权合约转账 / 调用。
   - 预期：拒绝执行，不广播危险交易。

4. **撤销后失败**
   - 请求：用户撤销 Agent 权限后再次请求执行。
   - 预期：Agent 无法继续执行，记录撤销后的失败原因。

## 目录结构

```text
experiments/agent-wallet/
  README.md
  config.example.json
  logs/
    .gitkeep
```

## 下一步

- [ ] 调研 Safe Sepolia 上可用的 Spending Limit / Allowance / Roles 模块。
- [ ] 创建 Sepolia Safe 测试账户。
- [ ] 准备白名单收款地址和测试代币。
- [ ] 写出 viem simulation 脚本。
- [ ] 记录第一条额度内成功和一条拒绝路径日志。

## 隐私提醒

本目录可以公开提交，但只能包含测试网地址、测试交易 hash、公开文档和脱敏日志。不要提交任何私钥、助记词、API Key 或真实资金相关敏感信息。
