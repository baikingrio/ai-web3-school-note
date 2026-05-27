# 2026-05-27｜残酷共学 / 打卡内容草稿

## 短版

今天的学习主线是继续打磨 Week 2 总交付和 Hackathon Proposal。我没有急着提交总交付，而是准备结合今天的 Co-learning 和 Privacy 主题活动，把 AgentScoope Wallet 的安全边界补充得更完整。

我的项目方向是 AgentScoope Wallet，也就是一个 Agent 受限执行钱包。它不是让 AI 直接控制钱包，而是让 Agent 只能在用户预先定义的预算、白名单、合约方法、人工确认和审计日志边界内执行链上动作。

今天我重点关注的问题是：Agent Wallet 的 privacy 和 security 不应该只理解成“不泄露私钥 / API Key”，还应该包括 context boundary、consent boundary、权限撤销和 auditability。用户需要知道 Agent 记住了什么、能调用什么、什么时候必须确认、如何撤销权限，以及执行或拒绝后如何复盘。

今日已有 PoW：

https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

我的阶段性结论是：Agent Wallet 的核心不是让 AI 更自由地花钱，而是把 AI 的执行能力限制在可授权、可撤销、可确认、可审计的边界里。

---

## 完整版

今天的学习主线是继续打磨 Week 2 总交付和 Hackathon Proposal。我没有急着提交总交付，而是准备结合今天的 Co-learning 和 Privacy 主题活动，把 AgentScoope Wallet 的安全边界补充得更完整。

我的项目方向是 AgentScoope Wallet，也就是一个 Agent 受限执行钱包。它不是让 AI 直接控制钱包，而是让 Agent 只能在用户预先定义的预算、白名单、合约方法、人工确认和审计日志边界内执行链上动作。

今天重点关注的问题是：Agent Wallet 的 privacy 和 security 不应该只理解成“不泄露私钥 / API Key”，还应该包括 context boundary、consent boundary、权限撤销和 auditability。也就是说，用户需要知道 Agent 记住了什么、能调用什么、什么时候必须确认、如何撤销权限，以及执行或拒绝后如何复盘。

今天准备参加 / 学习的内容：

1. 5.27 Co-learning：带着 Week 2 总交付和 AgentScoope Wallet Proposal 的问题去答疑，确认明天提交前还需要补哪些内容。
2. 5.27 Privacy 活动：重点记录 privacy、user sovereignty、consent、revocation、builder responsibility 这些概念如何影响 Agent Wallet 设计。
3. 活动后整理 3 条观察，明天补进 `submissions/week2-direction-deep-dive-and-proposal.md`，再提交 WCB 总交付任务。

今日已有 PoW：

- Week 2 总交付初稿已完成并推送：
  https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

我的阶段性结论：

> Agent Wallet 的核心不是让 AI 更自由地花钱，而是把 AI 的执行能力限制在可授权、可撤销、可确认、可审计的边界里。Privacy 对 Agent Wallet 来说，不只是数据隐藏问题，也是用户是否保留控制权和解释权的问题。
