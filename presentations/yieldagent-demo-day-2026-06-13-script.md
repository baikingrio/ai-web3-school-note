# YieldAgent Demo Day 4–5 分钟介绍稿

> 项目：YieldAgent  
> 场景：AI Web3 School / Cobo Agentic Commerce Hackathon Demo Day  
> 建议总时长：4 分 30 秒左右  
> 讲法原则：先讲清问题，再展示安全边界，最后进入 Demo；不要把重点放在“AI 自动赚钱”，而是放在“AI 只能在用户授权范围内执行”。

## 0:00–0:25 开场

大家好，我是 Quinn。今天展示的项目叫 **YieldAgent**。

一句话介绍：**YieldAgent 是一个基于 Cobo Agentic Wallet 和 Pact 权限边界的 DeFi 收益策略 Agent。它让 AI 可以提出策略，但执行必须被用户预先授权的预算、资产、协议和期限限制住。**

我对这个项目的核心理解是：Web3 Agent 不应该只是“更自动化”，更重要的是它必须“可限制、可拒绝、可审计”。

## 0:25–1:05 问题：为什么需要受限的钱包 Agent

现在很多 Agent 产品会说：让 AI 帮用户做链上操作、做收益策略、自动执行交易。

但这里有一个很大的风险：如果 AI Agent 直接拿到完整钱包权限，用户很难回答几个问题：

- Agent 最多能花多少钱？
- 它能调用哪些协议？
- 它能不能换成别的 token？
- 它执行失败或越权时，用户能不能知道原因？
- 它做过什么，后面能不能追踪？

所以 YieldAgent 想解决的问题不是“让 AI 随便交易”，而是：**AI Agent 如何在用户明确授权的边界里执行 DeFi 策略。**

## 1:05–1:55 方案：Agent proposes, Pact decides, CAW executes

YieldAgent 的设计可以拆成三层：

第一层是 **Agent proposes**。用户输入一个收益策略意图，比如用一部分测试网 USDC 尝试一个低风险策略。Agent 会把自然语言变成结构化 proposal。

第二层是 **Pact decides**。系统会生成 Pact Preview，明确预算上限、允许资产、允许协议、执行期限、收益分配和审计要求。这里的重点是：proposal 不等于授权，只有 Pact 允许的范围才可以继续。

第三层是 **CAW executes only when allowed**。Cobo Agentic Wallet 作为执行层，只有在 active Pact 的边界内才允许执行。超预算、未知 token、非白名单协议、过期或撤销的 Pact，都会被拒绝并记录日志。

所以这里的产品原则是：**不是把钱包交给 AI，而是把 AI 放进一个可检查的权限盒子里。**

## 1:55–3:20 Demo 主流程

接下来我展示一下 Demo。

第一步，从首页点击 **Try Demo**。这个入口是专门为评审设计的，不要求一开始先连接钱包、切测试网、准备测试币，而是直接进入 Dashboard，先理解完整流程。

第二步，在 Dashboard 里可以看到预置的 CAW Agent Wallet 状态、策略状态、余额和最近日志。这里强调的是：Agent 操作的不是用户完整 EOA 钱包，而是一个受限的 Agent Wallet。

第三步，进入创建策略页面。用户可以选择或输入策略意图，系统会显示可用 USDC，并把策略转换成结构化参数。比如预算、目标协议、期限和风险偏好。

第四步，看 Pact Preview。这里是我认为最重要的页面：它告诉用户这次授权到底允许什么、不允许什么。用户不是盲目相信 AI，而是在执行前看到边界。

第五步，Pact active 后执行 recipe。如果动作在边界内，系统会进入执行或 pending；如果越界，比如预算超了、协议不在 allowlist、地址不匹配，系统会拒绝。

第六步，看 History / Audit Log。每一次 allowed、denied、pending、failed 都会留下原因和状态。这样即使 Demo 中出现失败，也不是黑盒错误，而是能解释是授权、余额、地址、部署环境还是链上状态的问题。

## 3:20–4:05 技术实现

技术上，YieldAgent 使用 Nuxt 4、Vue 3、TypeScript 和 Tailwind 构建前端控制台；链和钱包交互使用 wagmi、viem 和 Base Sepolia。

执行层接入 **Cobo Agentic Wallet 和 Pact**。active Pact 执行时使用 pact-scoped key，也就是 Pact 子 Key，而不是直接用 Agent 主 Key 去执行交易，这样可以保持最小权限原则。

策略层使用 Hermes runtime 做自然语言策略解析和风险解释，再用 deterministic validation 做确定性校验。

状态和日志层本地使用 SQLite，Vercel 部署下可以接 Supabase Postgres，用来保存策略、Pact、执行凭证和审计日志。因为对 Web3 Agent 来说，持久化不是普通工程细节，而是信任和审计的一部分。

## 4:05–4:35 项目亮点

我认为 YieldAgent 的亮点有三个：

第一，**Pact-first，不是 profit-first**。先讲清权限边界，再讲收益动作。

第二，**拒绝也是产品能力**。一个安全的 Web3 Agent 不只要展示成功，也要能展示不能做什么，以及为什么不能做。

第三，**Demo-first 但不绕过安全模型**。评审可以直接进入 Demo Dashboard，但背后的产品模型仍然保留真实 CAW、Pact、执行凭证和审计日志路径。

## 4:35–4:50 结束语

最后总结一下：

**YieldAgent 的目标不是做一个“AI 自动交易玩具”，而是探索一种更安全的 Web3 Agent 执行模型：Agent 可以提出策略，但不能绕过用户授权；Pact 定义边界；CAW 只在允许时执行；日志解释每一步。**

谢谢大家。

---

## 如果现场只给 60 秒，可以用这个版本

YieldAgent 是一个基于 Cobo Agentic Wallet 和 Pact 的 DeFi 收益策略 Agent。它解决的问题是：AI Agent 如果直接拿到钱包权限，风险太高，用户很难知道 Agent 能花多少钱、能调用哪些协议、有没有越界。

所以 YieldAgent 的核心原则是：**Agent proposes, Pact decides, CAW executes only when allowed.** 用户先把一小部分测试网资金放入 Agent Wallet，再通过 Pact 限定预算、资产、协议、期限和审计要求。Agent 可以提出策略，但只有符合 Pact 边界时，Cobo Agentic Wallet 才会执行；否则系统会拒绝并记录原因。

Demo 里评审可以直接点击 Try Demo 进入 Dashboard，查看预置 CAW Agent Wallet、策略 proposal、Pact Preview、执行状态和 History / Audit Log。项目重点不是证明 AI 能“随便做交易”，而是证明 AI 在 Web3 里应该被限制、被解释、被审计。

---

## 现场兜底表达

如果真实执行链路现场不稳定，可以这样说：

> 这里如果因为测试网、Cobo 授权或部署环境出现 pending / failed，我不会把它伪装成成功。YieldAgent 的设计里，失败也是需要被解释和记录的状态。我们可以在 History 和 Deployment Check 里看到失败来自哪一层：是 Pact credential、wallet 授权、余额、地址，还是后端部署环境。这个可诊断能力本身也是 Web3 Agent 安全模型的一部分。
