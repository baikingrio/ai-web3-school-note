# 2026-06-04 合约学习笔记：把智能合约理解成 Agent 的执行边界

## 一句话总结

今天对合约的理解是：

> 智能合约不是普通后端代码，而是一组可以被链上验证和执行的规则。在 AI Agent + Web3 钱包场景里，合约 / Pact / Policy 的价值，是给 Agent 的行动加上明确边界。

Agent 可以提出建议，但不能自己决定是否越权执行。真正的执行应该经过用户授权、策略检查和合约规则约束。

## 为什么 AI Agent 需要合约边界

如果一个 AI Agent 可以直接控制钱包，它可能会遇到几个问题：

- 理解错用户意图；
- 被 prompt injection 诱导；
- 生成错误交易；
- 调用不可信合约；
- approve 过大额度；
- 在用户没意识到的情况下重复操作。

所以 Web3 Agent 的关键不是“让 AI 更自由”，而是“让 AI 在明确边界里执行”。

我今天更认可这个结构：

```text
用户目标
  ↓
Agent 生成结构化建议 / Proposal
  ↓
Policy / Pact / Risk Engine 检查
  ↓
CAW / 合约执行允许的动作
  ↓
审计日志记录全过程
```

## 关键概念

### 1. 智能合约

智能合约是部署在链上的程序。它的特点是：

- 执行逻辑公开或可验证；
- 状态变化会记录在链上；
- 只要满足条件，调用结果是确定性的；
- 适合承载权限、资产流转、清算、分账、质押等规则。

对 Agent 项目来说，智能合约不是为了炫技，而是为了把“谁能做什么、最多做多少、什么时候能做”变成确定规则。

### 2. Approval

`approve` 本质上是允许某个合约或地址代为使用 token。

需要注意：

- 授权额度越大，风险越高；
- 授权对象越复杂，越需要检查；
- 对 Agent 来说，approval 也应该被审计；
- 最好能限制额度、有效期和目标合约。

所以在 Agentic Wallet 产品里，approval 不是一个隐藏步骤，而应该被清楚展示给用户。

### 3. Policy / Pact

Policy / Pact 可以理解成 Agent 的安全护栏。

它应该回答这些问题：

- 这个 token 在白名单里吗？
- 这个协议或合约地址允许交互吗？
- 单笔金额有没有超过上限？
- 今天累计额度有没有超过预算？
- 滑点、收益率、风险等级是否在可接受范围？
- 是否需要人工二次确认？

如果答案不满足条件，就不应该执行。

### 4. CAW 执行层

CAW 的角色可以理解成受限执行层：

- Agent 不直接拿私钥；
- 用户先配置授权边界；
- Agent 的动作要通过 Pact / policy；
- 只有被允许的动作才进入执行；
- 执行结果需要返回给前端和日志系统。

这对 Hackathon Demo 很重要，因为它把“AI 生成建议”和“链上执行资产操作”分成了两层。

## 映射到项目设计

今天的合约学习可以对应到项目里的几个模块：

### 前端

前端不只是展示按钮，而是要让用户看懂：

- 当前策略是什么；
- 授权边界是什么；
- Agent 建议做什么；
- Policy 判断结果是什么；
- 是否需要人工确认；
- 最终有没有执行成功。

### Agent / 策略层

Agent 负责理解目标和生成建议，但建议应该是结构化的，例如：

```text
action: deposit / rebalance / withdraw
asset: USDC
amount: 20
protocol: allowed protocol
reason: why this action is suggested
risk_notes: possible risks
```

这样后面的 policy 才能检查，而不是让 Agent 输出一段不可验证的自然语言。

### Risk Engine / Pact

这一层负责做确定性判断：

- allowed：符合规则，可以执行；
- blocked：违反规则，拒绝执行；
- pending：风险较高或金额较大，需要人工确认。

### SQLite 审计日志

SQLite 在 MVP 里也有价值，因为它可以记录：

- proposal；
- policy decision；
- denied reason；
- CAW submission；
- execution result；
- tx hash 或 dry-run result。

这让 Demo 更容易解释，也更接近真实产品。

## 今天的收获

今天最大的收获是，我不再把合约学习当成单独的 Solidity 知识点，而是把它放回 AI Agent 的执行链路里理解。

对 Hackathon 项目来说，真正要讲清楚的是：

> AI 可以参与决策和操作建议，但资产执行必须被用户授权、合约规则和审计日志约束。

这比单纯做一个“AI 帮我交易 / 理财”的 Demo 更安全，也更符合 Agentic Wallet 的方向。

## 后续要继续补的内容

- 继续理解智能合约账户和普通 EOA 的区别；
- 继续学习 token approval 的风险和最佳实践；
- 把 policy 字段设计得更具体；
- 在 Demo 中补齐 allowed / blocked / pending 三种状态；
- 把审计日志展示做得更像产品功能，而不是调试信息。
