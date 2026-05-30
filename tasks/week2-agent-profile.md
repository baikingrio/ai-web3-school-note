# Week 2｜Agent Identity｜Agent Profile 与能力声明草图

> WCB 任务：Week 2｜Agent Identity｜Agent Profile 与能力声明草图  
> Task ID：`cmpkl65aonbgdmu01wvheztth`  
> 学员：Quinn / baikingrio  
> 关联项目：AgentScoope Wallet｜Agent 受限执行钱包  
> 公开仓库：https://github.com/baikingrio/ai-web3-school-note

## 1. 任务目标

我这次选择自己的 Hackathon 项目 **AgentScoope Wallet** 来完成 Agent Profile 与能力声明草图。

AgentScoope Wallet 的定位不是“让 AI Agent 直接控制钱包”，而是让 Agent 只能在用户预先设定的预算、白名单、可调用合约 / 方法、人工确认和审计日志范围内执行链上动作。它更像一个受限执行的钱包 Agent，而不是一个拥有完整钱包权限的自动化机器人。

---

## 2. Agent 基本信息

### Agent 名称

**AgentScoope Wallet Assistant**

### 它是谁

AgentScoope Wallet Assistant 是一个面向 Web3 builder 和 Hackathon 实验场景的钱包执行助手。它可以理解用户的自然语言链上操作意图，把意图转成结构化执行计划，并在执行前检查权限、预算、白名单和风险等级。

### 它由谁维护

早期由项目开发者 / 用户自己维护。实际链上权限不依赖 Agent 自己“自觉遵守规则”，而是通过 Safe、Zodiac Roles、policy、预算限制、人工确认和审计日志共同约束。

---

## 3. 它能做什么

1. 解析用户的链上操作意图，例如“在 Sepolia 上向白名单服务支付 0.5 USDC”。
2. 生成结构化计划，包括链、token、合约、方法、收款方、金额和预期结果。
3. 检查 app policy，例如金额是否超预算、收款方是否在白名单、方法是否允许。
4. 在广播交易前执行 simulation / dry-run，并把结果转成用户能看懂的摘要。
5. 根据风险等级判断是自动执行、请求人工确认、升级到 owner / multisig 确认，还是直接拒绝。
6. 在允许范围内执行低风险测试网交易。
7. 记录每次成功或失败的 audit log，包括 tx hash、拒绝原因、policy snapshot 和风险等级。
8. 帮助用户复盘链上执行结果，给出 Etherscan 链接或公开 proof。

---

## 4. 它不能做什么

1. 不能接触私钥、助记词、API Key、RPC token 或 `.env` 文件。
2. 不能成为 Safe owner，只能作为受限 role member 或受限执行方。
3. 不能绕过用户设置的 policy、预算和白名单。
4. 不能执行无限 approve、`setApprovalForAll`、合约升级、治理投票等高风险动作。
5. 不能向未知地址或非白名单地址自动转账。
6. 不能自动修改 Safe、module、role、预算、白名单等权限配置。
7. 不能替用户在主网执行真实资金操作，除非有非常明确的人工确认和额外安全机制。

---

## 5. 输入与输出

### 输入

1. 用户自然语言意图。
2. 当前 policy 配置。
3. 预算限制。
4. 合约 / 方法 / 收款方白名单。
5. 当前链和钱包状态。
6. simulation 结果。
7. 用户确认或拒绝的反馈。

### 输出

1. 结构化执行计划。
2. 风险等级，例如 L0 / L1 / L2 / L3。
3. 是否需要人工确认。
4. 拒绝原因或执行摘要。
5. 链上交易哈希。
6. 审计日志。
7. 可提交给 reviewer 的 proof 链接或说明。

---

## 6. 能力声明草图

### Identity

AgentScoope Wallet Assistant 是一个受限钱包执行 Agent，用来帮助用户把链上操作意图转成可检查、可确认、可审计的执行计划。

### Capability

它可以做意图解析、执行计划生成、policy check、simulation 摘要、风险分级、低风险测试网执行、审计日志记录和结果解释。

### Interface

早期可以通过 CLI / script / agent tool calling workflow 调用。用户输入自然语言任务，Agent 输出结构化计划和确认请求。

### Payment / Business Model

当前阶段不以收费为重点，主要作为 Hackathon proof-of-work 和安全执行实验。后续如果接入 agent commerce，可以按任务执行、API 调用、成功交付或订阅收费。

### Verification

执行结果可以通过 Safe / Zodiac Roles 配置、policy snapshot、audit log、Sepolia Etherscan tx hash 和公开 GitHub 文档一起验证。Agent 不能只靠“我已经执行了”作为证明，必须留下可复盘记录。

### Failure Handling

如果 policy check 不通过，直接拒绝并说明原因；如果 simulation 失败，不广播交易；如果风险等级较高，要求人工确认；如果链上执行失败，记录失败原因和 tx / error；如果发现权限配置不安全，建议用户撤销 role 或降低预算。

---

## 7. 协作对象

1. **用户 / Safe owner**：负责设置授权边界和确认高风险动作。
2. **Agent**：负责理解、计划、解释和调用工具。
3. **App Policy**：负责第一层权限检查。
4. **Simulation / RPC / Etherscan**：负责执行前后验证。
5. **Safe / Zodiac Roles**：负责钱包层和链上层限制。
6. **Audit Log**：负责记录过程，方便复盘和提交 proof。
7. **WCB reviewer / Hackathon reviewer**：可以通过公开文档、交易哈希和日志验证结果。

---

## 8. 失败点

1. Prompt injection 诱导 Agent 改变收款方或金额。
2. 工具返回错误，导致 Agent 误判 simulation 或链上状态。
3. Policy 配置过宽，例如预算太高或白名单太松。
4. Agent 试图调用未知合约或高风险方法。
5. 审计日志缺失，导致无法复盘。
6. 用户把私钥、API Key 或 `.env` 暴露给 Agent。
7. 只依赖 prompt 约束，而没有 Safe / Roles / policy 等强约束。

---

## 9. 我的理解

这个 Agent Profile 让我更清楚地区分了“AI Agent 能力”和“钱包权限边界”。AI 适合做理解、计划、解释和协作，但不应该直接拥有完整资产控制权。Web3 / wallet 层提供的是权限、验证、撤销和审计机制。

AgentScoope Wallet 的核心价值就在于把两者结合起来：让 Agent 可以帮助用户执行链上任务，但执行范围必须被明确限制，而且每一步都能被验证和复盘。

---

## 10. 关联材料

- Week 2 问题地图与主方向选择：  
  https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-ai-web3-problem-map.md

- Agent 链上动作权限策略：  
  https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-permission-policy.md

- Agent Workflow Threat Model 与确认策略：  
  https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-threat-model.md

- AgentScoope Wallet 实验目录：  
  https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

---

## 11. 隐私与安全说明

本证明只包含公开学习材料、测试网实验和脱敏后的设计说明，不包含私钥、助记词、API Key、`.env`、真实资金操作或未公开的项目敏感信息。
