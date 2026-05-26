# WCB 提交证明草稿：Week 2｜Security / Privacy｜Agent Workflow Threat Model 与确认策略

- Task ID: `cmpkl65ninbgjmu01jek69nnf`
- Task Title: `Week 2｜Security / Privacy｜Agent Workflow Threat Model 与确认策略`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `20`
- Public proof link: https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-threat-model.md
- Audit log link: https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.4.jsonl

## 建议提交证明

我围绕 Hackathon 项目 AgentScoope Wallet，完成了一份 Agent Workflow Threat Model 与确认策略文档。分析对象是“AI Agent 根据用户意图生成链上执行计划，并通过 Safe / Zodiac Roles / app policy / simulation / audit log 进行受限执行”的工作流。

公开产出链接：

https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-agent-wallet-threat-model.md

我在文档中覆盖了任务要求的几个核心部分：

1. **资产与权限边界**：梳理 Safe owner 权限、Safe 账户资产、Agent role 权限、allowlist、budget / allowance、policy 配置、audit log、tx hash / simulation result 等资产，并区分高风险权限与可公开 proof 信息。
2. **敏感数据与隐私边界**：明确私钥、助记词、API Key、RPC token、`.env`、session token、真实主网资产和个人隐私信息不得进入 prompt、公开 repo 或 WCB proof。
3. **Agent Workflow 威胁场景**：拆解 prompt injection 诱导转账、伪造工具返回 / 污染 simulation、越权调用非白名单合约或方法、超预算或拆单绕过额度、绕过 app policy 直接调用链上执行、Agent 权限未及时撤销、敏感信息泄露、审计日志缺失等威胁。
4. **低风险自动执行 / 高风险人工确认策略**：将动作分成 L0 自动执行、L1 执行前人工确认、L2 Safe owner / 多签确认、L3 直接拒绝，并说明每一类触发条件。
5. **失败后果与拦截策略**：为不同攻击和失败路径设计 reason code 与 rejectLayer，例如 `transfer_to_unlisted_address`、`exceeds_allowance`、`requires_owner_signature`、`role_revoked`、`sensitive_secret_request` 等。
6. **与 AgentScoope Wallet v0.3 / v0.4 PoW 的对应**：把 threat model 连接到 Sepolia Safe + Zodiac Roles 实测路径，包括额度内执行、超额拒绝、非白名单拒绝、绕过 app policy 后链上仍拒绝、撤销 role 后拒绝，以及结构化 audit log。

我也准备了脱敏审计日志作为辅助证明：

https://github.com/baikingrio/ai-web3-school-note/blob/main/experiments/agent-wallet/logs/pow-audit-v0.4.jsonl

其中包含了以下安全/确认策略案例：

- L0：白名单地址 0.5 USDC Sepolia 转账成功执行，并记录 txHash；
- L1：0.9 USDC 触发 `human_confirm_required`，需要人工确认；
- L2：6 USDC 触发 `requires_owner_signature`，不允许 Agent 直接广播；
- L3 / policy reject：超过日额度、非白名单、撤销后执行等场景被拒绝，并记录 `reason` 与 `rejectLayer`。

我的结论是：Agent 链上工作流的安全关键不是让 AI “更聪明地控制钱包”，而是把 AI 的动作限制在结构化计划、最小权限、默认拒绝、链上权限约束、人工确认和可审计日志之内。低风险、测试网、白名单、预算内的动作可以自动化；涉及权限修改、提高预算、主网资金、未知合约/方法、secret、审计日志篡改等场景必须人工确认或直接拒绝。

隐私与安全说明：本证明不包含私钥、助记词、API Key、token、`.env`、RPC URL、真实资金账户信息或其他敏感内容。上述验证均基于公开学习笔记、脱敏日志和 Sepolia 测试网场景。
