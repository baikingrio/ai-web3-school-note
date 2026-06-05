# WCB 任务提交预览｜2026-06-05

> 状态：仅整理提交草稿，尚未通过 WCB API 提交。  
> 隐私检查：以下 proof 只使用公开学习仓库 / 项目仓库链接，不包含 `.env`、API Key、私钥、助记词、真实资金信息或未公开会议链接。  
> 当前项目主线：YieldAgent Collective / YieldAgent。PactTrader 方向已放弃，后续 Hackathon 材料以 YieldAgent 为准。

## 可直接提交的任务清单

### 1. Week 3｜最低完成路径｜Hackathon Direction Card

- Task ID：`cmptce5knoiq5po01bbv9i29l`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 Hackathon Direction Card，并将项目主线确定为 YieldAgent Collective。

YieldAgent 是一个 Pact-first DeFi 收益策略 Agent 控制台：用户先通过 Cobo CAW Pact 设置最大支出、允许 Recipe、网络、期限和收益分账规则，Agent 只能在这些边界内执行测试网收益策略、复投和分账。项目重点不是夸大 APY，而是让评委快速看清楚：Agent 被允许做什么、实际做了什么、证据在哪里。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/yield-agent-direction-card.md

项目仓库：
https://github.com/baikingrio/yield-agent
```

### 2. Week 3｜最低完成路径｜赛道选择说明

- Task ID：`cmptce5rhoiq8po01tgv5p2my`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我选择 Cobo｜Agentic Economy × Cobo Agentic Wallet 作为 YieldAgent 的主赛道。

原因是 YieldAgent 的核心是让 Agent 在 Cobo CAW Pact 权限边界内执行 DeFi 收益策略。用户先批准预算、网络、允许 Recipe、期限和分账比例，Agent 只能在这个范围内执行，并把 tx hash、状态和审计日志展示出来。这比普通 AI trading bot 更能体现 Agentic Economy 与 CAW 的价值。

公开提交可 tag：@Cobo_Global @aiweb3school @LXDAO_Official @ETHPanda_Org @web3careerbuild

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#2-%E8%B5%9B%E9%81%93%E9%80%89%E6%8B%A9%E8%AF%B4%E6%98%8E
```

### 3. Week 3｜最低完成路径｜项目一句话说明

- Task ID：`cmptce609oiqbpo01b8y6xks2`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
YieldAgent 不是让 AI Agent 无限制地操作钱包，而是让 Agent 在用户预先批准的 Pact 边界内执行收益策略，并把权限、交易和分账过程透明展示出来。

Week 4 最小 Demo 要跑通：创建策略 → Pact preview → 用户审批 / 状态变更 → Agent 执行允许 Recipe → Dashboard / History 展示日志、tx hash 和分账记录。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#3-%E9%A1%B9%E7%9B%AE%E4%B8%80%E5%8F%A5%E8%AF%9D%E8%AF%B4%E6%98%8E
```

### 4. Week 3｜最低完成路径｜组队 / 单人参赛状态确认

- Task ID：`cmptce670oiqepo01dfx7npyt`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
当前按单人参赛路径推进 YieldAgent Collective。

我负责产品定义、前端实现、Agent 逻辑、Cobo CAW / Pact 接入、审计展示和提交材料整理。Week 3 每天约 2–3 小时，Week 4 预计每天 3–4 小时。后续如遇到合适队友，也可以把 UI、CAW 接入或 Demo 录屏拆出去协作。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#4-%E7%BB%84%E9%98%9F--%E5%8D%95%E4%BA%BA%E5%8F%82%E8%B5%9B%E7%8A%B6%E6%80%81%E7%A1%AE%E8%AE%A4
```

### 5. Week 3｜最低完成路径｜Repo Skeleton

- Task ID：`cmptce6d8oiqhpo01m9dxkdwt`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
YieldAgent 项目仓库已建立，并已从默认 Nuxt 模板整理为项目 README。

当前包含 Nuxt 4 / Vue 3 / TypeScript / Tailwind 前端，Dashboard、Wallet、Create Strategy、Pacts、History、Settings 页面，Nitro mock API，demo fixtures，以及 PRODUCT / DESIGN / PRD / 技术架构文档。README 已说明 problem、track、MVP flow、tech stack、risks、validation plan 和目录结构。

项目仓库：
https://github.com/baikingrio/yield-agent

Proof：
https://github.com/baikingrio/yield-agent/blob/main/README.md
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#5-repo-skeleton
```

### 6. Week 3｜最低完成路径｜Week 4 Sprint Plan

- Task ID：`cmptce6lqoiqkpo01inlgt10w`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 YieldAgent 的 Week 4 Sprint Plan。

计划按 7 天推进：先统一 README 和项目叙事，验证前端 / mock API；再梳理 CAW SDK / Pact / Recipe adapter；补齐 Strategy / Executor / Revenue Agent 的最小服务层；完善 Pact 状态、拒绝路径和 audit trail；最后部署、录屏并整理提交包。真实 CAW 接入不稳定时，fallback 为 Pact payload preview + dry-run 状态机。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#6-week-4-sprint-plan
```

### 7. Week 3｜推荐完成｜Proposal Memo

- Task ID：`cmptce70ooiqqpo01hkycnu6p`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已把 Week 2 的方向选择整理成 YieldAgent Proposal Memo。

项目目标用户包括 DeFi yield farmer、DAO / 小型 treasury 管理者、AI Agent builder 和 Hackathon 评委。真实场景是用户输入保守收益目标，系统生成 Pact preview，用户确认后 Agent 只能在 CAW Pact 边界内执行允许 Recipe，并把日志、tx hash、分账和拒绝路径展示出来。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#7-proposal-memo
```

### 8. Week 3｜推荐完成｜Scope Review

- Task ID：`cmptce76zoiqtpo019i68zfo4`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 YieldAgent 的 Scope Review，明确 v0.1 不做的内容，避免 Week 4 范围膨胀。

当前不做：不承诺真实收益率，不做主网真实资金，不让 Agent 持有 owner 私钥 / 助记词 / 无限授权，不做复杂多链收益聚合器，不做高风险 leverage / LP / 衍生品策略，不做完整 A2A 市场，也不把夸张 APY 当核心卖点。MVP 优先展示 Pact 权限和审计证据。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#8-scope-review
```

### 9. Week 3｜推荐完成｜Risk / Assumption Memo

- Task ID：`cmptce7msoiqzpo01o85a15ou`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 YieldAgent 的 Risk / Assumption Memo。

关键假设包括：CAW / Pact / Recipe 能支持最小测试网 demo，Nuxt 前端足以承载评委演示，mock API / dry-run 可以作为接真实 CAW 前的 fallback。主要风险是 CAW SDK / Recipe 测试环境不稳定、真实测试网交易准备时间不足、多 Agent 和收益分账范围膨胀。fallback 是 Pact payload preview + dry-run 状态机、测试网模拟 tx hash，并明确标注 demo fixture。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#9-risk--assumption-memo
```

### 10. Week 3｜推荐完成｜Sponsor / Mentor 问题清单

- Task ID：`cmptce7d7oiqwpo01nvvvpuyf`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已整理 Sponsor / Mentor 问题清单，重点围绕 Cobo CAW 与 YieldAgent 的实现路径。

主要问题包括：YieldAgent Demo 应该优先展示真实 Recipe 执行，还是 Pact approval / denial / audit log；如果 Week 4 只能完成 Pact payload preview + dry-run，是否足够作为 CAW integration plan；收益策略场景应先接 Aave / Compound supply，还是先演示 transfer / revenue share。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#10-sponsor--mentor-%E9%97%AE%E9%A2%98%E6%B8%85%E5%8D%95
```

### 11. Week 3｜Sponsor Workshop｜Cobo 赛道对齐任务

- Task ID：`cmptce81yoir5po01wm6ipm2o`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
YieldAgent 与 Cobo 赛道的对齐点已经整理完成。

项目中 CAW 是 Agent 的执行边界：用户先看 Pact 权限，再看收益；Agent 只能在预算、网络、Recipe、期限和分账比例内行动；每次执行都记录 tx hash 和 audit log；Pact 状态包含 awaiting approval、active、terminated、denied。收益分账也能体现 Agentic Commerce / A2A Economy。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#11-cobo-%E8%B5%9B%E9%81%93%E5%AF%B9%E9%BD%90%E4%BB%BB%E5%8A%A1
```

### 12. Week 3｜Sponsor Workshop｜Sponsor SDK / API Integration Plan

- Task ID：`cmptce9ucoirbpo019dsf3okp`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 Cobo Agentic Wallet SDK / API Integration Plan。

计划接入 Cobo Agentic Wallet TypeScript SDK / API，在 YieldAgent server API 中封装 CAW adapter，先做 health / wallet 只读检查和 Pact payload preview，再做 dry-run 创建策略与 Pact 状态流转，凭证可用后测试 Recipe 执行，并把 audit logs / tx hash 回填 dashboard。所有真实提交必须显式确认，公开仓库只保存 `.env.example` 和说明，不保存任何凭证。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#12-sponsor-sdk--api-integration-plan
```

### 13. Week 3｜加分挑战｜技术验证计划

- Task ID：`cmptceaf1oirkpo01l4q1maea`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 Week 4 技术验证计划。

验证点包括：Nuxt 4 前端可运行并展示完整页面流；创建策略表单能生成 Pact preview；Pact 状态能从 awaiting approval 到 active / terminated；mock / dry-run logs 能进入 dashboard 和 history；CAW adapter 至少支持 payload preview；README、PRD、Direction Card、Demo script 能让评委理解安全边界；build / lint / smoke test 作为提交前检查。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md#13-%E6%8A%80%E6%9C%AF%E9%AA%8C%E8%AF%81%E8%AE%A1%E5%88%92
```

### 14. Week 3｜加分挑战｜完整 Week 4 Ready Pack

- Task ID：`cmptceamsoirnpo01hv5yo16a`
- 状态：NOT_STARTED，可提交
- Proof 草稿：

```text
我已完成 YieldAgent 的完整 Week 4 Ready Pack。

材料包括：Hackathon Direction Card、Proposal Memo、Repo Skeleton、Week 4 Sprint Plan、Risk / Assumption Memo、Sponsor / Mentor 问题清单、Cobo 赛道对齐说明、Sponsor SDK / API Integration Plan、技术验证计划。当前项目仓库也已经有 Nuxt 4 / Vue / TypeScript / Tailwind 前端 MVP 和 README / PRD / 产品文档。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-yield-agent-ready-pack.md

项目仓库：
https://github.com/baikingrio/yield-agent
```

### 15. Week 1｜AI 向任务｜整理 AI 基础概念卡片

- Task ID：`cmp3jyq4x07s6n301xzm2cmds`
- 状态：NOT_STARTED，可提交（需先把新增文件推送到公开仓库）
- Proof 草稿：

```text
我已整理 AI 基础概念卡片，包含 LLM、prompt、context window、workflow、agent、tool use、guardrails、human-in-the-loop 等概念。

每个概念都用自己的话说明了一句话解释、具体例子和常见误区，并把这些概念映射到 YieldAgent：LLM / Agent 负责理解目标和生成 proposal，Workflow 负责拆解流程，Tool Use 负责调用 CAW / Pact / Risk Engine，Guardrails 负责限制预算和权限，Human-in-the-loop 负责关键授权。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week1-ai-basic-concept-cards.md
```

### 16. Week 1｜Web3 向任务｜整理 Web3 基础概念卡片

- Task ID：`cmp3jyqq507scn3016sd7iflf`
- 状态：NOT_STARTED，可提交（需先把新增文件推送到公开仓库）
- Proof 草稿：

```text
我已整理 Web3 基础概念卡片，包含 account、address、wallet、private key、seed phrase、signature、transaction、gas、smart contract、testnet、block explorer、EOA / smart account / multisig 等概念。

每个概念都包含一句话解释、具体例子和常见误区，并结合 YieldAgent 说明：用户 EOA 负责人工确认和资金准备，Agent Wallet 只持有主动转入的小额测试网资金，Pact / Policy 限制 Agent 权限，Block Explorer / Audit Log 用于验证执行结果。

Proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week1-web3-basic-concept-cards.md
```

## 暂不建议提交的任务

- Week 3｜项目流程图：当前 Ready Pack 中有文字版 MVP Flow，但还没有单独的流程图文件，建议补一张 Mermaid / SVG 后再提交。
- Week 3｜深度研究包：当前材料涉及 Cobo / CAW / Pact，但未形成 2–3 个标准、协议、SDK 的独立阅读摘要。
- Week 3｜黑客松报名网站 Bug / PR 反馈：没有真实 bug / issue / PR 证据，不建议硬凑。
- Week 3｜寻找 Hackathon 队友：当前是单人参赛，没有实际组队动作证据，不建议提交。
- 线上活动实时参加 / 回放任务：需要确认是否实际参加或观看回放，不建议凭空提交。

## 提交前动作

1. 确认是否允许把新增的 Week 1 概念卡片和本预览文件提交 / 推送到公开学习仓库。
2. 确认是否允许我通过 WCB API 提交以上 16 个任务的 proof。
3. 提交后用 `tasks.myTaskHistory` 验证每个任务状态和 submission ID。
