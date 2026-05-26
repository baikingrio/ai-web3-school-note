# WCB 提交证明草稿：Week 2｜线上活动｜观看回放 5.25｜Long-term Memory for AI Agents

- Task ID: `cmpla21ed3b1dmq01vf8ifdyj`
- Task Title: `Week 2｜线上活动｜观看回放 5.25｜Long-term Memory for AI Agents：如何让 Agent 拥有持续上下文与长期一致性`
- Status checked: `NOT_STARTED`, `available=true`
- Points: `10`
- 回放链接：<https://x.com/i/broadcasts/1mGPaLvzdLmJN>
- 回放截图：[`replay-screenshot.jpg`](./replay-screenshot.jpg)

## 建议提交证明

今天我回看了 5.25 的线上活动回放：

《Long-term Memory for AI Agents：如何让 Agent 拥有持续上下文与长期一致性》

回放链接：

https://x.com/i/broadcasts/1mGPaLvzdLmJN

回放观看截图：

https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/2026-05-26-long-term-memory-replay/replay-screenshot.jpg

本次回放中我重点关注 Agent Memory 的分类方式，以及长期记忆如何帮助 Agent 在多轮任务和跨天项目推进中保持上下文一致性。

有效笔记：

1. **Agent Memory 可以先按时间轴区分。**  
   截图中的 slide 提到 `Time axis`：需要先判断一段信息属于当前 working context，还是需要进入 long-lived / persistent continuity。对 Agent 来说，这个区分很重要，因为不是所有对话内容都应该长期保存，只有用户偏好、稳定项目背景、权限边界、长期目标等信息适合进入 persistent memory。

2. **长期记忆还可以按内容轴区分。**  
   slide 中的 `Content axis` 把 persistent state 进一步分成 episodic、semantic、procedural。我的理解是：episodic 更像具体经历或事件记录，semantic 是稳定事实和概念，procedural 是可复用流程。对应到我的 AI × Web3 学习和 AgentScoope Wallet 项目中，项目定位、权限原则、用户偏好更适合 semantic memory；WCB 提交流程、检查任务状态、生成 proof 的步骤更适合 procedural memory；某次活动或某次提交记录则更适合放在公开学习 repo，而不是永久记忆里。

3. **Scratchpad / working memory 不应该和长期记忆混在一起。**  
   slide 中提到 orthogonal axes，scratchpad 属于工作侧状态，不是第四类内容类型。这个点对 Agent 安全也很重要：临时推理、草稿、未确认信息、可能包含敏感上下文的中间结果，不应该默认写入长期记忆或公开 proof。长期记忆系统需要有明确的写入条件、隐私边界和可撤销机制。

4. **与我的 Hackathon 项目 AgentScoope Wallet 的关系。**  
   Agent Wallet 不只需要链上权限控制，也需要稳定记住用户的长期偏好和安全边界，例如：默认测试网优先、低风险自动执行、高风险人工确认、禁止读取私钥 / `.env`、所有执行和拒绝都要写 audit log。长期记忆如果设计不好，可能把临时授权误认为长期授权；如果设计得好，则可以帮助 Agent 在多天项目推进中保持一致的安全策略。

下一步行动：

- 我会把这次关于 Agent Memory 的分类思路映射到 AgentScoope Wallet v0.4：区分用户长期偏好 / 项目安全规则 / 临时执行计划 / 审计日志，避免 Agent 把一次性的上下文或临时授权错误地当成长期权限。

隐私说明：本证明只包含 X 回放截图、公开回放链接和学习笔记，不包含私钥、助记词、API Key、token、`.env` 内容、会议密码或其他敏感信息。
