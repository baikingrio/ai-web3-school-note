# Week 1｜AI 基础概念卡片

> 任务：整理至少 6 个 AI 基础概念  
> 日期：2026-06-04  
> 说明：用自己的话整理，作为后续理解 Agent、workflow、AI coding、工具调用和安全边界的基础。本文不包含任何 API Key、token 或私密项目资料。

## 1. LLM

- 一句话解释：LLM 是大语言模型，可以根据上下文预测并生成文本、代码、结构化数据或推理步骤。
- 具体例子：让模型根据用户需求生成一个 DeFi 收益策略草案，输出策略目标、风险说明和下一步动作。
- 常见误区：LLM 生成得像真的，不代表它一定正确；涉及资金、合约和权限时必须经过规则校验和人工确认。

## 2. Prompt

- 一句话解释：Prompt 是给模型的输入说明，决定模型要扮演什么角色、解决什么问题、输出什么格式。
- 具体例子：`请把用户的收益目标转成 JSON proposal，包含 asset、maxSpend、riskLevel、allowedProtocols。`
- 常见误区：Prompt 不能替代权限控制；不能只靠一句“不要越权”就让 Agent 安全执行链上动作。

## 3. Context Window

- 一句话解释：Context window 是模型一次能看到的上下文范围，包括用户输入、系统指令、工具结果和历史信息。
- 具体例子：如果 Agent 要判断一条策略是否安全，它需要看到用户授权边界、Pact 状态、资金余额和历史执行记录。
- 常见误区：模型看不到上下文之外的信息；不能假设它记得所有历史项目细节或链上状态。

## 4. Workflow

- 一句话解释：Workflow 是一组明确步骤，把复杂任务拆成可执行、可检查、可回滚的流程。
- 具体例子：YieldAgent 的流程可以是：用户输入目标 → Agent 生成 proposal → policy 检查 → CAW Pact 审批 → 执行 → 写入审计日志。
- 常见误区：Workflow 不是越复杂越好；Hackathon MVP 应该先跑通最小闭环。

## 5. Agent

- 一句话解释：Agent 是能根据目标选择步骤、调用工具并根据结果继续推进的 AI 系统。
- 具体例子：Strategy Agent 根据用户目标生成收益策略，Executor Agent 只在 Pact 允许范围内执行 Recipe。
- 常见误区：Agent 不等于完全自治；涉及钱包、支付、授权、交易时，Agent 必须被权限边界限制。

## 6. Tool Use

- 一句话解释：Tool use 是模型调用外部函数、API、数据库、钱包或浏览器等工具来完成任务。
- 具体例子：Agent 调用 Cobo CAW API 创建 Pact，或调用本地 Risk Engine 检查是否超出 max spend。
- 常见误区：工具返回结果也可能失败或被污染；需要校验返回值、记录日志，并区分 dry-run 和真实执行。

## 7. Guardrails

- 一句话解释：Guardrails 是系统层面的安全护栏，用来限制模型输出、工具调用和执行范围。
- 具体例子：只允许 USDC、只允许 Base Sepolia、单次最多 100 USDC、非白名单协议直接拒绝。
- 常见误区：Guardrails 不能只写在文案里，最好落到确定性规则、policy、Pact 或合约边界里。

## 8. Human-in-the-loop

- 一句话解释：Human-in-the-loop 是在关键步骤引入人工确认，避免模型或工具自动执行高风险动作。
- 具体例子：创建 Pact 前用户确认权限边界；高金额交易或非标准协议调用进入人工审批。
- 常见误区：人工确认不是低效，而是把风险集中到真正需要判断的节点。

## 和我的 AI × Web3 项目连接

这些概念可以直接映射到 YieldAgent：

```text
LLM / Agent 负责理解用户目标和生成 proposal
Workflow 负责拆解策略创建和执行路径
Tool Use 负责调用 CAW / Pact / Risk Engine
Guardrails 负责限制预算、资产、协议和期限
Human-in-the-loop 负责关键授权和高风险确认
Audit Log 负责让每一步可复盘
```

我现在对 AI Agent 的理解是：它不是一个“更聪明的聊天框”，而是一个会调用工具的执行系统。也正因为它能执行，才更需要边界、日志和确认机制。
