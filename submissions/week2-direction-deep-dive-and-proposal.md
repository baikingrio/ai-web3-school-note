# WCB 提交证明草稿：Week 2｜总交付｜方向深挖包与项目初步 Proposal

- Task ID: `cmpkl6652nbgpmu012os75zfg`
- Task Title: `Week 2｜总交付｜方向深挖包与项目初步 Proposal`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `40`
- 学员：Quinn / baikingrio
- 公开仓库：https://github.com/baikingrio/ai-web3-school-note
- 关联项目：AgentScoope Wallet｜Agent 受限执行钱包

## 1. 本次总交付说明

Week 2 我围绕 AI × Web3 的几个方向做了问题地图、主方向选择、权限策略和安全威胁模型整理。最后选择的主线是：

> **Wallet / Permission / Safe Execution**

我把它和自己的 Hackathon 项目 **AgentScoope Wallet** 对齐。这个项目想解决的问题不是“让 AI Agent 直接控制钱包”，而是让 Agent 只能在用户预先定义的预算、收款人白名单、合约 / 方法白名单、人工确认、链上权限和审计日志边界内执行链上动作。

本文件是 Week 2 的总交付汇总，包含方向深挖和项目初步 Proposal，可作为 WCB 任务提交证明。

---

## 2. 已完成的 Week 2 基础材料

### 2.1 AI × Web3 问题地图与主方向选择

公开文档：

https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-ai-web3-problem-map.md

这份材料中，我横向比较了 6 个 AI × Web3 方向：

1. Payment / Commerce / Settlement
2. Identity / Reputation / Capability / Interoperability
3. Wallet / Permission / Safe Execution
4. Privacy / Security / Sovereignty
5. Dev Tooling / Agent Workflow
6. Governance / Coordination / Public Goods

我主要用几个问题来判断方向是否成立：

- 如果没有 AI，这个问题是否仍然成立？AI 到底提供什么能力？
- 如果没有 Web3，这个问题是否仍然成立？Web3 到底提供什么机制？
- 谁发起任务、谁执行、谁付款、谁验收、谁承担失败成本？
- 哪些动作可以自动化，哪些动作必须人工确认？
- 结果如何验证？验证成本是否低于人工协调成本？

最后我选择 `Wallet / Permission / Safe Execution` 作为主线，因为它最能承接 Week 1 已完成的 Safe + Zodiac Roles 实验，也最贴近 Hackathon 项目 AgentScoope Wallet。

### 2.2 Agent 链上动作权限策略

公开文档：

https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-permission-policy.md

这份材料把 Agent 的链上执行拆成四层：

1. **意图层**：用户提出支付或链上操作目标，Agent 只负责理解和生成结构化计划。
2. **应用 policy 层**：检查收款人白名单、金额上限、daily budget、合约和方法是否允许。
3. **模拟与风险分级层**：先 simulation，再判断是 L0 自动执行、L1 人工确认、L2 owner / multisig 级别，还是 L3 直接拒绝。
4. **链上与审计层**：通过 Safe + Zodiac Roles 执行受限交易，并用 txHash、rejection reason 和 audit log 验证结果。

### 2.3 Agent Workflow Threat Model 与确认策略

公开文档：

https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-threat-model.md

这份材料重点分析了 Agent 链上工作流中的安全和隐私风险，包括：

- prompt injection 诱导转账；
- 伪造工具返回 / 污染 simulation；
- 越权调用非白名单合约或方法；
- 超预算或拆单绕过额度；
- 绕过 app policy 直接调用链上执行；
- Agent 权限未及时撤销；
- 私钥、API Key、`.env` 等敏感信息泄露；
- 审计日志缺失或不可复盘。

对应的控制策略是：最小权限、默认拒绝、链上权限约束、人工确认、撤销机制和结构化 audit log。

---

## 3. 方向深挖：为什么是 Wallet / Permission / Safe Execution

### 3.1 问题定义

随着 AI Agent 可以调用工具、读取网页、生成交易计划、执行 API 请求，下一步很自然会遇到一个问题：

> Agent 能不能代表用户做链上动作？如果可以，它能做什么、不能做什么，边界由谁来保证？

如果只是让 Agent 帮用户写交易说明，风险较低；但如果 Agent 可以真正发起链上交易，就会遇到资金安全、权限控制、责任归属和审计问题。

我认为这个方向的核心不是“AI 钱包”，而是：

> **Agent 受限执行系统。**

也就是让 Agent 只在用户预先定义的范围内行动，任何超出范围的请求都必须被拒绝或转为人工确认。

### 3.2 为什么不是纯 AI 问题

AI 可以做很多事情：理解自然语言、生成执行计划、解释 simulation、总结交易风险。但 AI 本身不能保证资金安全。

原因是：

- prompt 可以被注入；
- 工具返回可能出错；
- 模型可能误解用户意图；
- AI 不能只靠“承诺遵守规则”来保护资产；
- 一旦它拿到 owner 私钥或无限权限，错误执行的后果会很严重。

所以安全边界不能只写在 prompt 里，而必须落到钱包、智能账户、policy、Safe、Zodiac Roles、Guard、session key 或其他可验证的权限系统里。

### 3.3 为什么不是纯 Web3 问题

Web3 的钱包、多签、权限模块可以限制“谁能调用什么”，但它们不能自动理解用户目标。

例如用户说：

> 帮我在预算内支付这个 API 服务的费用，但不要超过 1 USDC。

纯钱包系统不会自动完成：

- 理解用户意图；
- 把自然语言转换为结构化计划；
- 判断任务是不是低风险；
- 解释 simulation；
- 在失败时告诉用户为什么失败；
- 把执行结果整理成可读的 proof。

所以这个方向需要 AI 和 Web3 同时出现：AI 负责理解、计划、解释和协作；Web3 负责权限、结算、验证、撤销和审计。

---

## 4. AgentScoope Wallet 初步 Proposal

### 4.1 项目一句话

**AgentScoope Wallet 是一个 Agent 受限执行钱包，让 AI Agent 只能在用户预设的预算、白名单、方法限制、人工确认和审计规则内执行链上动作。**

### 4.2 目标用户

早期目标用户不是普通散户，而是：

- Web3 builder；
- Hackathon 项目开发者；
- 想实验 Agent 自动执行链上任务的人；
- 需要让 Agent 处理小额付款、工具调用、测试网任务或自动化 workflow 的团队。

这些用户不一定需要一个完整消费级钱包，而是需要一个可验证的实验框架：证明 Agent 可以执行低风险链上动作，同时不能越权。

### 4.3 使用场景

一个典型场景是：

1. 用户创建或使用一个 Safe；
2. 用户给 Agent 配置一个受限 role；
3. role 只允许调用指定 token 的 `transfer`；
4. 收款人必须在白名单里；
5. 单笔和每日预算有限制；
6. Agent 每次执行前必须先 policy check 和 simulation；
7. 低风险动作可以自动执行；
8. 高风险动作需要人工确认或 owner / multisig 确认；
9. 每次执行或拒绝都写入 audit log。

### 4.4 当前 PoW 基础

当前 `experiments/agent-wallet/` 已经完成了一个可验证基础：

公开实验目录：

https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

已验证能力包括：

- Sepolia Safe + Zodiac Roles 受限执行路径；
- Agent 不是 Safe owner，只是受限 role member；
- 白名单 USDC `transfer`；
- 额度内交易可执行；
- 超额交易被拒绝；
- 非白名单地址被拒绝；
- 跳过 app policy 后，链上 Roles 仍然拒绝；
- 撤销 role 后 Agent 无法继续执行；
- 执行和拒绝都有结构化 audit log。

辅助审计日志：

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.4.jsonl

链上执行证明示例：

- L0 success，0.5 USDC：
  https://sepolia.etherscan.io/tx/0x52976020a98f3558ea0e384291c8f42ff2a81e6218e335db73124f395aa37fbb

- L1 human confirm，0.9 USDC：
  https://sepolia.etherscan.io/tx/0xc5b63cb5ac78ede8ed17f337e7305b11d8d8e46cfc2a6196b652c56491e8682f

---

## 5. 核心设计：L0 / L1 / L2 / L3 确认策略

我把 Agent 的链上动作分成四类：

### L0：低风险自动执行

适用条件：

- 测试网；
- 金额低于阈值；
- 收款地址在白名单；
- 合约和方法在 allowlist；
- 不涉及权限修改；
- simulation 成功；
- audit log 正常记录。

这类动作可以由 Agent 自动执行。

### L1：执行前人工确认

适用条件：

- 金额接近上限；
- 仍然在白名单和预算内；
- 不是 owner 级别权限；
- 但需要用户明确确认后再广播。

例如当前策略中，0.9 USDC 会触发 `human_confirm_required`。

### L2：Owner / 多签确认

适用条件：

- 提高预算；
- 修改白名单；
- 修改 role；
- 调整 Safe / module 配置；
- 大额支付；
- 未来如果进入主网或真实资产，也应进入这一层。

这类动作不应该让 Agent 直接执行，必须由 Safe owner 或多签确认。

### L3：直接拒绝

适用条件：

- 请求私钥、助记词、API Key、`.env`；
- 非白名单地址；
- 未授权合约或方法；
- 无限 `approve`；
- 绕过 policy；
- prompt injection 要求忽略规则；
- 审计日志缺失或状态不一致。

这类动作不是“问用户要不要继续”，而是直接拒绝，并记录 reason code。

---

## 6. Hackathon 后续计划

### 6.1 Week 3 / v0.4-v0.5 方向

下一步我希望把当前脚本 demo 继续推进为更完整的 Agent Tool Calling Flow：

```text
user intent
  → intent parser
  → structured plan
  → policy check
  → simulation summary
  → risk classification
  → human confirmation if needed
  → execute or reject
  → audit log
```

重点不是做一个“看起来会聊天的钱包”，而是把每一步都变成可检查、可拒绝、可审计的流程。

### 6.2 可能增加的功能

1. **更清晰的 intent parser**  
   把用户自然语言转换成标准 JSON plan。

2. **更完整的 policy schema**  
   包括 chain、token、recipient、method、maxPerTx、maxDaily、confirmAboveAmount、ownerSignatureAboveAmount。

3. **更多 demo 场景**  
   例如多 token、小额服务付款、工具服务订阅、失败重试、撤销后恢复。

4. **更好的审计页面或 proof 输出**  
   把 txHash、reason、rejectLayer、policy snapshot 变成 reviewer 更容易看的 proof。

5. **与 agent commerce / x402 / payment flow 连接**  
   未来可以把“Agent 受限支付”接到 API 付费、数据购买或小额服务结算场景。

---

## 7. 本周结论

Week 2 之后，我对 AgentScoope Wallet 的定位更清楚了：

它不是一个“让 AI 替人保管钱包”的项目，而是一个“让 AI 在可验证权限边界内执行动作”的项目。

我认为 AI × Web3 在这个方向里的结合点是：

- AI 负责理解任务、生成计划、解释风险和组织 workflow；
- Web3 负责权限边界、链上执行、公开验证、撤销和审计；
- 用户保留 owner / multisig / 高风险确认权；
- Agent 只承担低风险、可限制、可复盘的执行工作。

这个方向接下来可以继续进入 Hackathon，因为它有明确问题、已有测试网 PoW、能用链上交易和 audit log 验证，也能自然延展到 Agent Payment、Agent Commerce 和受限 DeFi 执行。

---

## 8. 建议 WCB 提交证明

我已完成 Week 2「方向深挖包与项目初步 Proposal」总交付，并把本周的方向研究、权限策略、安全威胁模型和 Hackathon 项目 Proposal 整理到公开 GitHub 仓库中。

公开仓库：

https://github.com/baikingrio/ai-web3-school-note

本次总交付文件：

https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

关联材料：

1. AI × Web3 问题地图与主方向选择：
   https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-ai-web3-problem-map.md

2. Agent 链上动作权限策略：
   https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-permission-policy.md

3. Agent Workflow Threat Model 与确认策略：
   https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-threat-model.md

4. AgentScoope Wallet 实验目录：
   https://github.com/baikingrio/ai-web3-school-note/tree/main/experiments/agent-wallet

5. 脱敏 audit log：
   https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.4.jsonl

本周我最终选择的主线是 `Wallet / Permission / Safe Execution`。我认为 Agent Wallet 的重点不是让 AI 直接控制钱包，而是让 Agent 在用户预先定义的预算、白名单、合约方法、人工确认和审计日志约束下执行链上动作。

在方向深挖中，我说明了为什么这个问题不是纯 AI 问题：AI 可以理解意图和生成计划，但不能只靠 prompt 保证资金安全；真正的边界必须由 Safe、Zodiac Roles、policy、simulation、撤销机制和 audit log 一起约束。

我也说明了为什么它不是纯 Web3 问题：钱包和权限模块可以限制调用，但不能自动理解用户自然语言目标、生成执行计划、解释 simulation、整理失败原因和形成 proof。因此这个方向需要 AI 和 Web3 同时参与。

我的初步 Proposal 是继续推进 AgentScoope Wallet：让 Agent 通过 `user intent → structured plan → policy check → simulation → risk classification → human confirmation → execute / reject → audit log` 的流程，在低风险范围内自动执行，在高风险范围内请求人工确认或直接拒绝。

当前已有的 PoW 包括：

- Sepolia Safe + Zodiac Roles 受限执行；
- Agent 不是 Safe owner，只是受限 role member；
- USDC `transfer` 白名单；
- 单笔和每日预算限制；
- L0 自动执行、L1 人工确认、L2 owner 级别拒绝、L3 policy reject；
- 成功交易 txHash；
- 失败场景 reason / rejectLayer；
- 结构化 audit log。

链上执行证明示例：

- L0 success，0.5 USDC：
  https://sepolia.etherscan.io/tx/0x52976020a98f3558ea0e384291c8f42ff2a81e6218e335db73124f395aa37fbb

- L1 human confirm，0.9 USDC：
  https://sepolia.etherscan.io/tx/0xc5b63cb5ac78ede8ed17f337e7305b11d8d8e46cfc2a6196b652c56491e8682f

我的 Week 3 / Hackathon 下一步计划是继续把脚本 demo 推进为更完整的 Agent Tool Calling Flow，并完善 intent parser、policy schema、simulation summary、human confirmation 和 audit proof。

隐私与安全说明：本次提交只包含公开学习笔记、测试网交易、脱敏 audit log 和项目设计说明，不包含私钥、助记词、API Key、token、`.env`、RPC URL、真实资金信息或其他敏感内容。
