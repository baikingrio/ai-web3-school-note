# WCB 提交证明草稿：Week 1｜综合进阶｜设计一个受限 Web3 助手或小 workflow

- Task ID: `cmp9wlsuo0s4lmw01u8h0og3t`
- Task Title: `Week 1｜综合进阶｜设计一个受限 Web3 助手或小 workflow`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `40`

## 建议提交证明

我设计并实现了一个受限 Web3 助手 workflow：**AgentScoope Wallet**。

这个 workflow 的目标是解决一个具体问题：AI Agent 可以帮助用户规划、解释、模拟和执行低风险链上动作，但不能接触主私钥、助记词、API Key，也不能绕过人工确认自动完成高风险签名、授权、转账或合约写入。

公开设计文档 / workflow 图：

https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/agent-wallet-permissions-brief.md

实验 README：

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/README.md

v0.4 PoW 汇总：

https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/agent-wallet-v0.4.md

## 1. 要解决的问题

很多 Web3 Agent Demo 会走向两个极端：

1. Agent 只能给建议，无法执行任何链上动作；
2. Agent 权限过大，用户需要把私钥、主钱包或无限授权交给 Agent。

AgentScoope Wallet 选择中间路线：让 Agent 只能在用户预先定义的权限边界内执行小额、测试网、白名单、可审计、可撤销的操作；越界时由 app policy / Safe / Zodiac Roles 拒绝。

## 2. 输入和输出示例

输入示例：

> 帮我向白名单里的 API 服务地址支付 0.5 USDC 测试网费用。

Agent / workflow 输出：

1. 解析用户意图：目标链、token、金额、收款方；
2. 检查 policy：是否测试网、是否白名单、是否低于单笔额度和日额度；
3. 执行 simulation：展示要调用的合约、方法、金额和可能失败原因；
4. 根据风险等级决定自动执行、请求人工确认、强制 owner 确认或直接拒绝；
5. 执行后输出 tx hash / Etherscan 链接；
6. 将 executed / rejected 结果写入 audit log。

## 3. AI / Agent 可以做什么

AI 可以辅助：

- 理解用户自然语言目标；
- 生成结构化计划；
- 调用受限 tools，例如 `get-policy`、`get-spending-status`、`simulate`、`pay`；
- 解释 simulation 结果；
- 生成用户可读的风险摘要；
- 整理 audit log 和 proof；
- 在低风险、白名单、预算内、测试网条件下触发受限执行路径。

AI 不能做：

- 读取或保存私钥、助记词、API Key、token、`.env`；
- 成为 Safe owner；
- 绕过 policy / Safe / Zodiac Roles；
- 调用任意合约或任意 calldata；
- 自动执行主网真实资金操作；
- 自动修改白名单、提高额度、启用/禁用 module 或执行合约升级。

## 4. Web3 工具或链上步骤

这个 workflow 使用的 Web3 组件包括：

- Sepolia 测试网；
- Safe 智能账户；
- Zodiac Roles Modifier；
- 受限 Agent EOA / role member；
- USDC 测试网 token；
- app policy；
- viem simulation；
- Etherscan 链上验证；
- JSONL audit log。

简化流程：

```text
用户目标
  → Agent 生成计划
  → App Policy 检查
  → Simulation
  → Human Check 风险分级
  → Safe / Zodiac Roles 链上权限检查
  → 执行或拒绝
  → tx hash / audit log 验证
```

## 5. 人工确认点

我把确认策略分成 4 个等级：

- L0 自动执行：Sepolia、白名单地址、允许方法、小额、预算内、simulation 成功；
- L1 执行前人工确认：金额接近阈值或需要用户确认后再执行；
- L2 强制 Safe owner / 多签确认：提高额度、修改白名单、修改 role、启用/禁用 module、主网资金、治理或合约升级；
- L3 直接拒绝：请求私钥/助记词/API Key、非白名单地址、未允许方法、无限 approve、绕过 policy、伪造 audit log 等。

## 6. 至少 3 个风险或限制

1. Prompt injection 风险：外部内容可能诱导 Agent 转账到攻击者地址，因此收款方必须经过 allowlist 检查。
2. 权限过大风险：如果 Agent 成为 owner 或拥有任意 calldata 权限，就不再是“受限助手”，因此 Agent 只能是受限 role member。
3. 超预算风险：单笔小额也可能通过多次执行累计成大额，因此需要单笔额度和 24h daily budget。
4. 工具返回不可信风险：simulation / RPC / 工具输出可能出错，因此成功结果需要 tx hash 和链上浏览器验证。
5. 敏感信息泄露风险：任何私钥、助记词、API Key、`.env` 都不能进入 prompt、repo 或 WCB proof。

## 7. 如何验证结果

验证方式包括：

- 查看公开设计文档中的 workflow 图和 Human Check 设计；
- 查看实验 README 中的 demo 路径；
- 使用 Sepolia Etherscan 验证成功 tx；
- 查看 `pow-audit-v0.3.jsonl` / `pow-audit-v0.4.jsonl` 中 executed / rejected 的结构化记录；
- 对比不同场景：额度内成功、超额拒绝、非白名单拒绝、绕过 app policy 后链上仍拒绝、撤销 role 后拒绝、L1 human confirm、L2 owner required。

代表性链上成功交易：

https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5

审计日志：

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.3.jsonl

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.4.jsonl

## 8. 总结

这个任务要求的是“设计一个受限 Web3 助手或小 workflow”。我的 AgentScoope Wallet 正是围绕这个目标设计：让 AI Agent 在 Web3 中可以辅助计划、解释、模拟和执行低风险任务，但所有链上动作都必须受到最小权限、默认拒绝、人工确认、链上权限控制、可撤销和可审计机制约束。

隐私与安全说明：本证明不包含私钥、助记词、API Key、token、`.env` 内容、真实资金账户信息或其他敏感信息。所有链上验证均为 Sepolia 测试网场景。
