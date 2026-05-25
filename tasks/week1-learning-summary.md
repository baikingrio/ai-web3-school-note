# Week 1 学习总结｜AI × Web3 的关键不是自动化，而是受限执行

## 1. 本周重新理解的 AI 概念

Week 1 里，我对 **Agent / Workflow / Tool Use** 的理解更具体了。

以前我容易把 Agent 理解成“会聊天、会调用工具的 AI 助手”。但通过这一周的学习和实践，我更明确地意识到：真正可用的 Agent 不只是生成回答，而是要在一个明确的 workflow 中完成任务拆解、工具调用、结果检查和失败处理。

在 AI × Web3 场景里，Agent 的能力边界尤其重要。AI 可以帮助用户理解目标、生成执行计划、检查参数、解释交易结果，但它不应该绕过人类确认，也不应该直接接触私钥、助记词或无限制控制钱包。

我的理解是：

> Agent 的价值不是“替人做一切”，而是在明确权限和约束下，把复杂任务拆成可检查、可验证、可回滚或可拒绝的执行步骤。

## 2. 本周重新理解的 Web3 概念

本周我重新理解了 **钱包、签名、交易、智能账户、多签 / Safe、合约权限和区块浏览器验证** 之间的关系。

Web3 里的交易不是普通 API 调用。一次链上操作通常意味着：

1. 谁发起交易；
2. 谁拥有权限；
3. 调用了哪个合约 / 方法；
4. 是否涉及资产、授权或状态变更；
5. 交易是否成功；
6. 如何通过区块浏览器验证结果。

尤其是在钱包和 Agent 结合时，最核心的问题不是“Agent 能不能发交易”，而是：

> Agent 被授权到了什么程度？它能调用哪些方法？能转给谁？额度是多少？越界时谁来拒绝？执行后如何审计？

这也是我本周 Hackathon 项目 AgentScoope Wallet 的核心出发点。

## 3. 一个 AI × Web3 交叉问题：Agent 能不能发起支付？

我本周最关注的问题是：**AI Agent 是否可以发起链上支付或合约调用？**

我的阶段性答案是：可以，但不能无限制执行。

比较安全的路径不是让 Agent 直接控制用户资产，而是让它运行在用户预先定义的权限边界内：

```text
用户目标
  → Agent 生成计划
  → Policy 检查
  → Simulation / 参数检查
  → Safe / Zodiac Roles 权限裁决
  → 执行或拒绝
  → Etherscan 验证
  → 审计日志记录
```

这样做的重点是把 Agent 的“智能执行能力”和 Web3 的“可验证权限边界”结合起来：

- AI 负责理解目标、生成计划、解释结果；
- Policy 负责检查金额、地址、方法、频率等边界；
- Safe / Zodiac Roles 负责链上权限控制；
- Etherscan 和审计日志负责验证和复盘。

## 4. 本周 Proof-of-Work

> **WCB Week 1 Pack 总入口**：[`submissions/week1-pow-pack.md`](../submissions/week1-pow-pack.md)

### 公开学习仓库

https://github.com/baikingrio/ai-web3-school-note

### Week 1 学习记录

- `daily/2026-05-18.md`：学习仓库初始化与 Hackathon 方向确认
- `daily/2026-05-19.md`：Hermes Learning Agent 与学习工作流
- `daily/2026-05-20.md`：Web3 运行原理与 Agent Wallet 实验目录
- `daily/2026-05-21.md`：AI × Web3 应用场景与 AgentScoope Wallet 映射
- `daily/2026-05-22.md`：Week 1 例会、Safe 版本限制与权限方案调整
- `daily/2026-05-23.md`：Open Agentic Economy 学习与 AgentScoope Wallet v0.3 PoW

### Hackathon 项目：AgentScoope Wallet

项目目录：

https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

项目 brief：

https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/agent-wallet-permissions-brief.md

项目目标：

> 让 AI Agent 只能在用户预先定义的链上权限边界内执行小额、可审计、可撤销的操作；超出边界时由 Policy / Safe / Zodiac Roles 明确拒绝，而不是让 AI 直接控制用户资产。

### AgentScoope Wallet v0.3 关键进展

当前版本基于 **Sepolia Safe + Zodiac Roles Modifier** 做了一个 Agent 受限执行 demo，覆盖：

- Safe Owner 不把主私钥交给 Agent；
- Agent 只是受限 role member，不是 Safe owner；
- 只允许白名单 USDC `transfer`；
- 额度内交易可以执行；
- 超额交易会被拒绝；
- 非白名单地址会被拒绝；
- 撤销 role 后，Agent 再执行会失败；
- 每次执行 / 拒绝都会写入结构化审计日志。

链上成功执行证明：

https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5

审计日志：

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.3.jsonl

## 5. 本周最大的收获

Week 1 最大的收获是：AI × Web3 不是简单地把 AI 接到钱包、合约或链上工具上，而是要认真设计 **能力、权限、确认、验证、拒绝和审计**。

如果没有权限边界，Agentic Wallet 很容易变成高风险自动化钱包；但如果把 Safe、Zodiac Roles、Policy、Simulation 和 Audit Log 结合起来，Agent 就可以成为一个受限、可验证、可撤销的链上执行助手。

这让我对 Hackathon 项目的方向更清晰：AgentScoope Wallet 不追求“让 AI 自动花钱”，而是探索 **Agent 如何在 Web3 权限系统中安全执行任务**。

## 6. 还没解决的问题 / Week 2 继续探索方向

接下来我想继续探索：

1. 如何把自然语言用户目标转换成可检查的链上执行计划；
2. 如何在执行前做更可靠的 simulation 和 risk check；
3. 如何把 Safe / Zodiac Roles 的链上权限与应用层 policy 统一表达；
4. 如何设计更清晰的审计日志，让用户和 reviewer 都能理解每次执行或拒绝的原因；
5. 如何把 AgentScoope Wallet 从脚本 demo 扩展成更完整的 Agent Tool Calling flow。

## 7. 隐私与安全说明

本总结和相关 proof 不包含私钥、助记词、API Key、token、`.env` 文件或任何敏感信息。所有链上链接均为 Sepolia 测试网公开验证材料。
