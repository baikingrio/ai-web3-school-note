# 2026-05-27｜残酷共学 / 打卡内容草稿

## 短版

今天的学习主线是继续打磨 Week 2 总交付和 Hackathon Proposal。我参加了 5.27 Co-learning 和 Privacy 主题直播，重点把 AgentScoope Wallet 的安全边界从“权限控制”继续往 privacy、context boundary、consent、revocation 和 auditability 这些方向扩展。

我的项目方向是 AgentScoope Wallet，也就是一个 Agent 受限执行钱包。它不是让 AI 直接控制钱包，而是让 Agent 只能在用户预先定义的预算、白名单、合约方法、人工确认和审计日志边界内执行链上动作。

今天最大的收获是：privacy 对 Agent Wallet 来说，不只是“不泄露私钥 / API Key”。它还包括用户是否知道 Agent 记住了什么、能调用什么、什么时候必须确认、如何撤销权限，以及执行或拒绝后能否被解释和复盘。

今日已有 PoW：

- 5.26 Cobo Agentic Wallet 回放任务已提交，Submission ID：`cmpnk46sm3lpypo01yhnru3vo`
- Week 2 总交付初稿：
  https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

我的阶段性结论是：Agent Wallet 的核心不是让 AI 更自由地花钱，而是把 AI 的执行能力限制在可授权、可撤销、可确认、可审计的边界里。

---

## 完整版

今天的学习主线是继续打磨 Week 2 总交付和 Hackathon Proposal。我参加了 5.27 Co-learning 和 Privacy 主题直播，重点把 AgentScoope Wallet 的安全边界从“权限控制”继续往 privacy、context boundary、consent、revocation 和 auditability 这些方向扩展。

我的项目方向是 AgentScoope Wallet，也就是一个 Agent 受限执行钱包。它不是让 AI 直接控制钱包，而是让 Agent 只能在用户预先定义的预算、白名单、合约方法、人工确认和审计日志边界内执行链上动作。

Co-learning 给我的提醒是，Week 2 总交付不应该只是“学习笔记合集”，而应该更像一个 Hackathon proposal：清楚说明问题、目标用户、场景、MVP 边界、可验证 proof 和下一步 demo。对 AgentScoope Wallet 来说，我需要把“受限执行”讲得更产品化：不是简单说 Agent 可以调用钱包，而是说明用户为什么需要它、哪些动作可以自动执行、哪些动作必须人工确认、越界时如何拒绝。

Privacy 主题活动让我进一步意识到：Agent Wallet 的 privacy 和 security 不应该只理解成“不泄露私钥 / API Key”。它还包括用户是否知道 Agent 记住了什么、被授权做什么、什么时候会自动执行、什么时候必须停下来确认，以及用户如何撤销授权。

这也让我准备把 AgentScoope Wallet 的边界从单纯的 permission boundary 扩展成：

```text
Agent 受限执行
  = permission boundary
  + context boundary
  + consent boundary
  + revocation
  + auditability
```

今天整理出的 3 条观察：

1. Privacy 不只是隐藏信息。对 builder 来说，privacy 还包括用户是否拥有控制权、知情权和撤销权。放在 Agent Wallet 里，就是用户要知道 Agent 被授权了什么、记住了什么、什么时候会自动执行、什么时候必须停下来确认。
2. Agentic 产品里的 privacy 和安全边界会互相影响。如果 Agent 把一次临时授权误当成长期授权，或者把 working context 里的信息写进长期记忆，就可能产生风险。所以 AgentScoope Wallet 需要区分长期偏好、临时授权、执行计划和审计日志。
3. Audit log 本身也要考虑 privacy。公开 proof 可以展示执行结果、拒绝原因和测试网 tx，但不应该暴露私钥、API Key、敏感收款方、内部会议链接或过细的个人信息。对外 proof 和本地审计记录应该分层。

今日已有 PoW：

- 5.26 Cobo Agentic Wallet 回放任务已提交，Submission ID：`cmpnk46sm3lpypo01yhnru3vo`
- Week 2 总交付初稿：
  https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

我的阶段性结论：

> Agent Wallet 的核心不是让 AI 更自由地花钱，而是把 AI 的执行能力限制在可授权、可撤销、可确认、可审计的边界里。Privacy 对 Agent Wallet 来说，不只是数据隐藏问题，也是用户是否保留控制权、知情权、撤销权和解释权的问题。
