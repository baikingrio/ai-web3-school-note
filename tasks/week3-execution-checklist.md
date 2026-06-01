# Week 3｜执行清单｜Practice Deepening + Hackathon Kickoff

> 时间投入：Week 3 每天约 2–3 小时；Week 4 预计提高到每天 3–4 小时。  
> 本周主线：课程活动 + PoW 提交 + AgentScoope Wallet 赛道收敛。  
> 项目方向：Cobo 赛道｜Agent-Native Payments｜Agent Resource Procurement。  
> 隐私原则：公开仓库不记录会议密码、私钥、助记词、API Key、`.env`、内部链接或未确认的私密方案细节。

## 1. 本周目标

Week 3 不是大规模开发周，而是把 Hackathon 方向从「能讲清楚」推进到「能准备 Week 4 sprint」：

- [ ] 完成本周核心线上活动的参与或回放任务。
- [ ] 每场活动至少沉淀 3 条有效笔记，或 1 条明确 next action。
- [ ] 把 AgentScoope Wallet 对齐到 Cobo 赛道语言：Agent-Native Payments / Agent Resource Procurement / Cobo CAW scoped execution。
- [ ] 准备 Week 4 可执行 demo plan：allowed、blocked、pending / human confirmation、revoked 四类路径。
- [ ] 本周末产出一个 Week 3 总结 proof，能直接用于 WCB / 共学打卡。

## 2. 每天 2–3 小时默认节奏

如果当天有直播：

1. **活动前 20–30 分钟**
   - 打开 WCB 活动页，确认当天主题。
   - 准备 1 个与你的项目有关的问题。
   - 打开当前项目材料：`hackathon/week3-cobo-direction-card.md` 和 `hackathon/agent-wallet-permissions-brief.md`。

2. **直播 / 回放 60 分钟左右**
   - 重点听与 Hackathon、支付、Agent 执行、风控、Demo、项目叙事有关的内容。
   - 不追求全量摘抄，只记录能改变项目方案的点。

3. **沉淀 40–60 分钟**
   - 写 daily note。
   - 提炼 3 条有效笔记 / 1 条 next action。
   - 如果适合，更新 AgentScoope Wallet 的 brief、direction card 或 demo checklist。

4. **项目推进 40–60 分钟**
   - 每天只推进一个小 artifact：流程图、policy schema、demo script、README、提交草稿、问题清单等。

如果当天无法参加直播：

- [ ] 看回放。
- [ ] 截图或保存回放链接。
- [ ] 写 3 条有效笔记。
- [ ] 补充一个「这条内容如何影响 AgentScoope Wallet」的小段落。

## 3. Week 3 课程 / 活动执行清单

### 6.01｜从 VC 角度，如何更好打磨项目

任务选择：实时参加或观看回放二选一。

- [ ] 完成参与 / 回放。
- [ ] 记录至少 3 条笔记，重点关注：
  - 真实问题是否足够清楚；
  - 目标用户是否具体；
  - MVP scope 是否足够小；
  - Demo 是否能让评委快速理解价值。
- [ ] 输出项目动作：把 AgentScoope Wallet 的一句话说明改成非技术人也能懂的版本。
- [ ] 可提交 proof：截图 / 回放记录 + 3 条笔记 + 1 条 next action。

### 6.02｜Hackathon Openday

任务选择：实时参加或观看回放二选一。

- [ ] 完成参与 / 回放。
- [ ] 确认 Hackathon 规则、赛道、提交物、时间线。
- [ ] 重点记录：Cobo 赛道评价标准、提交要求、是否有 CAW SDK / API / 文档 / mentor 支持。
- [ ] 输出项目动作：确认 AgentScoope Wallet 最终赛道选择和 fallback 口径。
- [ ] 可提交 proof：截图 / 回放记录 + 3 条笔记 + 赛道选择说明。

### 6.03｜黑客松赛道实战

任务选择：实时参加或观看回放二选一。

- [ ] 完成参与 / 回放。
- [ ] 重点记录：如何拆赛道、如何定义可验证 MVP、如何规划 Week 4 冲刺。
- [ ] 准备可问 mentor 的问题：
  - AgentScoope Wallet 应该展示 CAW allowed transfer，还是 pending approval / denial 更能体现价值？
  - 如果 CAW 接入受阻，用 Safe + Zodiac Roles fallback 是否仍然能表达 Cobo 赛道方向？
  - Demo 里是否应该主打 API / 数据采购，而不是普通转账？
- [ ] 输出项目动作：形成 Week 4 demo script v0.1。
- [ ] 可提交 proof：截图 / 回放记录 + 3 条笔记 + demo script 链接或摘要。

### 6.04｜支付场景的探索和思考

任务选择：实时参加或观看回放二选一。

- [ ] 完成参与 / 回放。
- [ ] 重点记录：真实支付场景、用户痛点、风控边界、商业化路径。
- [ ] 把 AgentScoope Wallet 场景收敛成一个清晰支付故事：
  - 用户：builder / research agent 用户；
  - 任务：购买白名单 API / 数据 / 工具服务；
  - 风险：Agent 不能拿无限钱包权限；
  - 解法：预算 + 白名单 + policy hard-check + CAW scoped execution + audit log。
- [ ] 输出项目动作：补充 `Payment Scenario` 小节或 demo narrative。
- [ ] 可提交 proof：截图 / 回放记录 + 3 条笔记 + AgentScoope 支付场景说明。

### 6.05｜AI Agent 时代，重新审视区块链这项技术选择 & AI Agent 深度参与下的区块链应用开发实战

任务选择：实时参加或观看回放二选一。

- [ ] 完成参与 / 回放。
- [ ] 重点记录：哪些部分必须上链，哪些部分应该留在链下；Agent 如何参与应用开发；链上验证的最小边界是什么。
- [ ] 输出项目动作：明确 AgentScoope Wallet 的链上 / 链下边界：
  - 链下：Agent 生成建议、policy hard-check、simulation summary、audit index；
  - 链上 / 钱包执行层：CAW / Safe 执行被允许的付款或拒绝越界动作；
  - 公开 proof：tx hash、denial reason、audit log、README。
- [ ] 可提交 proof：截图 / 回放记录 + 3 条笔记 + 链上 / 链下边界说明。

### 6.05｜Week 3 例会

任务选择：实时参加或观看回放二选一；如果上麦分享，可做 Weekly Review Sharing 任务。

- [ ] 完成参与 / 回放。
- [ ] 准备 5 分钟分享稿，推荐主题：AgentScoope Wallet 的 Cobo 赛道方向。
- [ ] 分享结构：
  1. 我的问题定义：AI Agent 可以建议付款，但不能拿无限钱包权限。
  2. 我的项目方案：Agent recommends, Policy decides, Cobo executes only if allowed。
  3. Week 3 已完成：方向卡、Cobo 赛道对齐、fallback 口径。
  4. Week 4 要做：CAW 最小接入或 fallback demo，完成 allowed / blocked / pending / revoked 四类路径。
- [ ] 可提交 proof：会议截图 + 分享主题摘要 + direction card / repo 链接。

### Co-learning｜任务推进与答疑

本周可选择参加 1–3 场，不需要每场都作为主任务；更适合作为推进任务和问问题的时间块。

- [ ] 带着当前卡点参加：CAW 接入、demo script、WCB proof、README、录屏脚本。
- [ ] 每次参加后记录 1 条收获或 next action。
- [ ] 如果当天没有其他直播，可把 Co-learning 当作 60 分钟项目推进时段。

## 4. 项目推进清单｜AgentScoope Wallet

### A. 赛道叙事

- [ ] 确认主赛道：Cobo 赛道｜Agentic Economy × Cobo Agentic Wallet。
- [ ] 确认主方向：Agent-Native Payments。
- [ ] 确认 demo 场景：Agent Resource Procurement。
- [ ] 保留 fallback 口径：CAW 是目标执行层；Safe + Zodiac Roles 是已跑通 fallback，不包装成已完成 CAW 集成。
- [ ] 准备 3 个版本的一句话说明：
  - 非技术版；
  - 技术评委版；
  - WCB proof / 共学打卡版。

### B. Demo 路径

- [ ] Demo A：额度内成功 — 0.5 USDC / 白名单服务商 / policy 通过 / CAW 或 fallback 执行。
- [ ] Demo B：超额拒绝 — 10 USDC / 超预算 / 返回 `blocked` 或 `owner_required`。
- [ ] Demo C：非白名单拒绝 — recipient 不在 whitelist / 不执行付款。
- [ ] Demo D：撤销后失败 — Pact / session / role revoked 后再次执行失败。
- [ ] 每条 demo 都要有：输入、policy decision、执行结果、tx hash 或 denial reason、audit log。

### C. 文档与提交物

- [ ] `hackathon/week3-cobo-direction-card.md`：方向卡。
- [ ] `hackathon/agent-wallet-permissions-brief.md`：完整项目 brief。
- [ ] `README.md`：公开入口。
- [ ] `experiments/agent-wallet/`：fallback implementation。
- [ ] 新增或更新 demo script：建议 Week 4 再集中实现。
- [ ] 准备 Week 3 总结：本周课程笔记 + Hackathon 方向收敛 + Week 4 计划。

## 5. 本周优先级

### 必做

- [ ] 6.02 Hackathon Openday。
- [ ] 6.03 黑客松赛道实战。
- [ ] 6.04 支付场景的探索和思考。
- [ ] 6.05 Week 3 例会。
- [ ] Week 3 总结 proof。
- [ ] AgentScoope Wallet Cobo 方向卡与 brief 保持同步。

### 推荐做

- [ ] 6.01 从 VC 角度打磨项目。
- [ ] 6.05 AI Agent + 区块链应用开发实战。
- [ ] 至少参加 1 次 Co-learning 处理项目卡点。
- [ ] 准备 5 分钟上麦分享稿。

### 可以跳过或延后

- [ ] 非核心回放的精读。
- [ ] 大规模代码重构。
- [ ] 新增复杂合约或多 token 支持。
- [ ] 完整 marketplace / escrow / 多 Agent 协作场景。

## 6. Week 3 最终交付标准

到本周结束，至少应完成：

- [ ] 4–6 条课程 / 活动 proof 或笔记。
- [ ] 1 篇 Week 3 总结 daily / weekly note。
- [ ] 1 份 Hackathon direction card。
- [ ] 1 份 Week 4 sprint plan。
- [ ] 1 个可讲清楚的 5 分钟项目分享稿。
- [ ] 明确 Week 4 的第一天任务：尝试 CAW SDK / CLI / API 最小接入；如果受阻，立刻切 fallback demo。

## 7. Week 4 预告

Week 4 时间提高到每天 3–4 小时后，重点从“听课 + 方向收敛”切到“实现 + 录屏 + 提交”：

- Day 1：CAW onboarding / SDK / CLI / API 可用性确认。
- Day 2：policy hard-check 接执行层。
- Day 3：allowed / blocked / owner_required 路径。
- Day 4：pending approval / human confirmation / revoked 路径。
- Day 5：audit log、README、运行说明。
- Day 6：录屏和截图。
- Day 7：最终提交包与 WCB proof。
