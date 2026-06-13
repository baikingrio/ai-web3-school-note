# 2026-06-13｜YieldAgent Demo Day Readiness 学习笔记

## 1. 今天先解决 / 理解的问题

今天同步了 YieldAgent 和学习仓库，确认代码侧没有新的当天提交。本地 YieldAgent 已经是最新 `main`：

```text
63489cc feat: improve dashboard polling and log fetching logic
```

所以今天的学习重点不是继续罗列代码改动，而是从 Demo Day 视角重新看：

> YieldAgent 现在有哪些能力可以展示？哪些地方是 Demo 前最需要检查的风险点？

昨天的代码主线是 Vercel / Postgres / Dashboard 稳定性，今天则更像一次交付前复盘。

## 2. 一句话收获

> Demo Day 前最重要的不是证明“功能很多”，而是证明“关键路径稳定、边界清楚、失败可解释”。

对 YieldAgent 来说，评审真正需要看懂的是：

```text
用户为什么需要 Agent Wallet？
Agent 被允许做什么？
Pact 如何限制执行？
执行失败时怎么解释？
日志如何证明 Agent 没有越权？
```

如果这些问题能讲清楚，即使某些策略动作仍是测试网 / MVP，也能体现项目价值。

## 3. YieldAgent 当前 Demo 主线

我把当前 Demo 主线整理成下面这条：

```text
Landing / Try Demo
  -> Dashboard
  -> Agent Wallet ready / preset wallet
  -> Create Strategy
  -> available USDC + strategy parameters
  -> Pact Preview
  -> Cobo App approval / Pact status sync
  -> Execute or Deny
  -> History / Audit Log
  -> Deployment Check for environment diagnosis
```

这条主线里，每一步都对应一个产品问题：

- Landing：用户为什么要用 YieldAgent？
- Dashboard：当前钱包和策略状态是什么？
- Create Strategy：Agent 需要执行什么策略？预算是否越界？
- Pact Preview：用户实际授权了哪些边界？
- Approval / Execute：CAW 是否允许执行？
- History：执行后有什么证据？
- Deployment Check：如果失败，应该看哪一层？

## 4. Demo 前最需要检查的四类风险

### 4.1 状态持久化风险

Vercel `/tmp` 不适合保存长期状态。YieldAgent 里关键状态包括：

- 钱包准备进度；
- Agent Wallet UUID 与 EVM 地址；
- 策略与 Pact 绑定关系；
- pact-scoped execution credential；
- 执行、拒绝、失败、pending 日志。

如果这些状态丢失，Demo 就会表现为“刚才还在的 Pact 不见了”或“active 之后无法执行”。所以 Postgres/Supabase 持久化是 Demo 稳定性的关键。

### 4.2 授权边界风险

YieldAgent 最重要的安全表达是：Agent 不是拿着一个大权限随便交易。

需要反复检查：

```text
Agent 主 Key：管理 / 提交 / 同步
Pact 子 Key：active Pact 下的受限执行
```

active Pact 执行时，如果没有 pact-scoped key，系统应该停止并提示，而不是 fallback 到 Agent 主 Key。

### 4.3 地址与钱包对应关系风险

CAW wallet UUID、Agent Wallet EVM 地址、用户 EOA 地址不是同一个东西。

如果这几层混乱，后续会出现：

- `src_addr` 缺失；
- wallet UUID 和 EVM 地址不匹配；
- API Key 对当前 wallet 无权限；
- 前端展示的地址和真实执行地址不一致。

所以地址解析与校验看起来是后端细节，实际是执行安全的一部分。

### 4.4 可观测性风险

Demo 里只展示成功路径是不够的。Web3 Agent 产品必须能解释失败。

需要展示或准备讲清楚：

- allowed：动作在 Pact 边界内；
- denied：动作越权，被拒绝；
- pending：链上或 Cobo 侧还在处理中；
- failed：配置、授权、余额、地址或部署环境问题。

History / Audit Log 和 Recent Logs 的价值就在这里。

## 5. 我对“好 Demo”的重新理解

之前我容易把 Demo 理解成“跑通一条 happy path”。今天复盘后，我觉得 YieldAgent 这种 Web3 Agent 项目，好的 Demo 至少要有三层：

1. **Happy path**  
   用户创建策略，Pact 被批准，Agent 在边界内执行。

2. **Denied path**  
   Agent 尝试越界，Pact / CAW 拒绝，并留下日志。

3. **Diagnosable failure path**  
   如果环境不完整，比如 Postgres、TSS、Hermes、CAW Key 有问题，系统能告诉开发者问题在哪，而不是只返回一个模糊错误。

这三层合在一起，才能证明 YieldAgent 不是一个“AI 自动交易玩具”，而是一个有权限边界和审计意识的 Agentic Wallet 应用。

## 6. 可以用于 Demo 的表达

如果要在 Demo Day 里用很短的话介绍 YieldAgent，可以这样说：

> YieldAgent 是一个基于 Cobo Agentic Wallet 和 Pact 的测试网收益策略 Agent。它不是让 AI 直接接管用户钱包，而是让用户先把一小部分测试网资金放入 Agent Wallet，并通过 Pact 限定预算、协议、执行动作和期限。Agent 可以提出策略，但只有在 Pact 允许的范围内，CAW 才会执行；否则系统会拒绝并记录日志。

更短版：

> YieldAgent turns AI strategy suggestions into bounded wallet actions: Agent proposes, Pact decides, CAW executes only when allowed, and logs explain everything.

## 7. 今日检查结果

今天做了这些检查：

```text
YieldAgent repo: up to date
YieldAgent HEAD: 63489cc
Learning repo: up to date
Learning repo HEAD: 92d8f7a
WCB 2026-06-13 events: none found from API
```

今天没有新的 YieldAgent commit，所以学习笔记重点放在 Demo Readiness，而不是代码 diff 分析。

## 8. 下一步 Checklist

### 线上环境

- [ ] 确认 Vercel 环境变量完整。
- [ ] 确认 Postgres/Supabase 连接正常。
- [ ] 确认 CAW API Key 与 preset Agent Wallet 属于同一个 Agent。
- [ ] 确认 TSS Node 在线。
- [ ] 确认 Hermes API 可被 Vercel 访问。

### 产品主路径

- [ ] Dashboard 首屏显示正确钱包状态。
- [ ] Create Strategy 显示可用 USDC。
- [ ] Pact Preview 能清楚展示预算、协议、期限和执行动作。
- [ ] Pact 状态能从 Cobo 同步。
- [ ] active Pact 执行不 fallback 到 Agent 主 Key。
- [ ] History 能显示 allowed / denied / failed / pending。

### 公开材料

- [ ] README 项目名统一为 YieldAgent。
- [ ] 学习笔记和 daily 不混用旧项目名。
- [ ] 不公开会议链接、密码、API Key、私钥、`.env`。
- [ ] 最终提交材料能讲清：用户场景、Pact 边界、CAW 执行、日志审计。

## 9. 今日可复用打卡表达

今天没有新增代码提交，主要做 YieldAgent 的 Demo Day 前复盘。我把当前项目从“功能完成度”重新拆成“状态稳定性、授权边界、地址校验、日志可观测性”四个检查方向。

对我来说，今天最大的收获是：Web3 Agent 项目的 Demo 不只是展示 AI 能做什么，还要展示 AI 不能做什么，以及不能做的时候系统如何拒绝和记录。YieldAgent 的价值就在于把 Agent 的策略建议放进 CAW / Pact 的权限边界里，再通过 Dashboard 和 logs 让用户看懂执行过程。

接下来我会继续检查线上环境和最终提交材料，确保 Demo Day 讲解时可以稳定展示 happy path、denied path 和 deployment check。

## 10. 隐私与公开边界

这份笔记只记录公开安全的项目复盘和学习总结。

不记录：

- 会议链接和会议密码；
- API Key、Bearer Token、`.env`；
- 私钥、助记词、真实资金细节；
- 未确认公开的项目策略细节。
