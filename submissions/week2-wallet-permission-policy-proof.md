# WCB 提交证明草稿：Week 2｜Wallet / Permission｜Agent 链上动作权限策略

- Task ID: `cmpkl65h2nbggmu01i4egjtq6`
- Task Title: `Week 2｜Wallet / Permission｜Agent 链上动作权限策略`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `20`

## 建议提交证明

今天我围绕 Hackathon 项目 AgentScoope Wallet，完成了一组「Agent 链上动作权限策略」的设计与实测。这个项目的目标不是让 AI Agent 直接控制钱包，而是让 Agent 只能在 Safe、Zodiac Roles、应用层 policy、额度限制、白名单、simulate 和 audit log 的约束下执行链上动作。

公开学习记录：

https://github.com/baikingrio/ai-web3-school-note/blob/main/daily/2026-05-26.md

本次验证的核心权限策略：

1. 执行主体：Agent 通过 Safe + Zodiac Roles 的受限路径执行链上支付。
2. 资产范围：Sepolia 测试网 USDC。
3. 收款人限制：只允许向配置中的白名单地址转账。
4. 金额限制：单笔上限 `maxPerTx = 1.0 USDC`，24 小时额度 `maxDaily = 5.0 USDC`。
5. 人工确认阈值：`confirmAboveAmount = 0.8 USDC`，超过后进入 L1 human confirm。
6. Owner / 更高风险阈值：`ownerSignatureAboveAmount = 5.0 USDC`，大额请求不允许 Agent 直接广播。
7. 执行流程：所有请求都必须先 `get-policy`、`get-spending-status`、`simulate`，再根据风险等级决定 reject / ask confirmation / execute。
8. 审计机制：每次 simulate、reject、execute 都写入 audit log，成功交易会记录 txHash。

我按 Hermes demo prompts 跑了 5 类场景：

- Prompt B：非白名单地址转账被拒绝，reason 为 `transfer_to_unlisted_address`，没有广播交易。
- Prompt E：6 USDC 大额请求被 app policy 拦截，humanCheckLevel 为 L2，没有广播交易。
- Prompt D：3 USDC 请求因为超过单笔上限 `maxPerTx = 1.0` 被拒绝，没有广播交易。
- Prompt A：0.5 USDC 白名单小额转账通过 L0 流程，simulate 成功后，经人工确认在 Sepolia 执行。
- Prompt C：0.9 USDC 进入 L1 human confirm；未带 `--confirm` 的 pay 被 `human_confirm_required` 拒绝，经人工确认后 `pay --confirm` 成功执行。

链上执行证明：

- L0 success，0.5 USDC：
  https://sepolia.etherscan.io/tx/0x52976020a98f3558ea0e384291c8f42ff2a81e6218e335db73124f395aa37fbb

- L1 human confirm，0.9 USDC：
  https://sepolia.etherscan.io/tx/0xc5b63cb5ac78ede8ed17f337e7305b11d8d8e46cfc2a6196b652c56491e8682f

通过这次测试，我把 Agent 链上动作权限策略拆成了四层：

1. 意图层：用户提出支付需求，Agent 只能解析并形成结构化计划。
2. 应用 policy 层：检查收款人白名单、金额上限、daily budget、禁止操作类型。
3. 模拟与风险分级层：先 simulate，再分成 L0 自动执行、L1 人工确认、L2 owner/multisig 级别、L3 直接拒绝。
4. 链上与审计层：通过 Safe + Zodiac Roles 执行受限交易，并用 txHash / audit log 验证结果。

我的结论是：AI Agent 做链上支付时，关键不是“让 Agent 拥有钱包”，而是把 Agent 的能力约束在可撤销、可审计、有限额度、有限对象、有限方法的权限系统里。这样可以让 Agent 承担低风险的执行工作，同时把高风险动作保留给人或多签确认。

隐私与安全说明：本证明不包含私钥、助记词、API Key、token、`.env`、RPC URL、真实资金账户信息或其他敏感内容。上述交易均为 Sepolia 测试网验证。
