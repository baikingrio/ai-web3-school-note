# PactTrader｜3–5 分钟 Demo Story

> 日期：2026-06-10  
> 项目主线：PactTrader  
> Demo 目标：用一条主路径说明 Agent 如何在 CAW / Pact 边界内执行，而不是让 AI 自由操作资产。

## 1. Demo 一句话

PactTrader 是一个 **policy-bound portfolio / yield strategy agent**：

> Agent 可以提出策略建议，但只有在用户预先定义的 Pact / policy 边界内，CAW 才允许执行；越界动作会被拒绝并写入审计日志。

英文短句：

> Agent proposes. Policy decides. CAW executes only when allowed.

## 2. 演示前提

为了让 Hackathon 评审不被钱包插件、测试网资产或网络切换卡住，当前公开演示采用 **Try Demo-first** 路径：

```text
Landing Page
  -> Try Demo
  -> Dashboard
  -> 预置 CAW Agent Wallet / Demo State
  -> 策略与 Pact 边界
  -> 审计日志
```

说明边界：

- Try Demo 不是绕过安全模型，而是先展示安全模型。
- 真实 EOA 连接、CAW 配对和测试网执行保留为高级路径。
- Demo 不使用主网真实资产。
- API Key、私钥、助记词和真实资金地址不会出现在公开演示材料里。

## 3. 3–5 分钟演示脚本

### 0:00–0:30｜打开落地页：先讲问题

展示页面：`/`

讲法：

> 这是 PactTrader。它不是让 AI 自由炒币，而是把 AI Agent 放进明确的 Pact 边界里。用户先定义预算、资产范围、协议白名单、期限和审计要求，Agent 只能在这些边界内提出和执行策略。

指出落地页主按钮：

```text
Try Demo
```

讲法：

> 这里我把入口从“连接钱包”改成了 “Try Demo”。Hackathon 评审可以先看完整主流程，不需要一开始就准备钱包、切测试网或转测试币。

### 0:30–1:10｜进入 Dashboard：解释 Demo-first

操作：点击 `Try Demo` 进入 `/dashboard`。

讲法：

> 进入 Dashboard 后，系统使用预置 Demo state / CAW Agent Wallet 来展示最小主流程。这里的重点不是跳过钱包，而是先让用户理解：Agent 操作的不是用户完整 EOA 钱包，而是一块被隔离、被授权、被预算限制的 Agent Wallet 资金。

可展示内容：

- 预置 Agent Wallet 状态；
- 当前策略 / Pact 状态；
- 控制台 overview；
- 审计日志入口。

### 1:10–2:00｜创建或查看策略：Agent 只生成 proposal

展示页面：Dashboard / Create Strategy / Pact Preview。

讲法：

> 用户可以从模板或自然语言描述策略目标。Agent / Z.AI API 的角色是理解意图并生成结构化 proposal，例如：投入多少、使用哪个协议、持续多久、收益如何分配。

强调：

> 但 proposal 不是执行授权。LLM 输出必须经过 deterministic validation 和 policy check。

可以用这条最小策略描述：

```text
使用少量测试网 USDC，在允许的协议里执行保守收益策略，单笔和总预算都受 Pact 限制。
```

### 2:00–2:50｜展示 Pact / Policy：先裁决，再执行

展示页面：Pact 管理 / Pact Detail / Risk decision。

讲法：

> PactTrader 最关键的一层是 policy / Pact。它会检查：token 是否在白名单、protocol 是否允许、金额是否超过单笔上限、是否超过日预算、期限是否有效、是否触发 stop-loss 或 revoke。

用两条路径说明：

1. **允许路径**

```text
proposal 在预算和白名单范围内
  -> policy pass
  -> CAW / dry-run execute
  -> 写入 audit log
```

2. **拒绝路径**

```text
proposal 超过预算 / 使用未知 token / 非白名单协议
  -> policy blocked
  -> 不调用执行层
  -> 写入 audit log
```

讲法：

> 这就是 PactTrader 和普通“AI 交易 Bot”的区别：Agent 不是最终权力中心，Policy 和 CAW 才是执行边界。

### 2:50–3:40｜展示审计日志：结果可复查

展示页面：History / Audit Trail。

讲法：

> 无论动作是 allowed、blocked、pending 还是 failed，都应该进入 SQLite audit log。这样用户能复盘：Agent 提了什么建议，系统为什么允许或拒绝，执行层返回了什么结果。

强调：

> 对 Web3 Agent 来说，可审计性和可撤销性比“自动化程度”更重要。

### 3:40–4:30｜补充真实钱包路径与当前验证

讲法：

> 当前 Demo-first 路径先保证评审能看到完整机制。真实路径仍然保留：用户可以连接 EOA、创建或导入 CAW Agent Wallet、注入测试网 USDC，再进入真实测试网执行。线上部署时，Vercel 前端需要调用远程 Hermes / CAW runtime，而不是假设 localhost。

可展示 proof：

- Demo access tests；
- PactTrader demo wallet tests；
- full test suite；
- Nuxt / Nitro production build。

验证结果：

```text
3 个 Demo 相关 test files 通过，7 个测试通过
完整测试：164 个测试通过，1 个 skipped
pnpm build：Nuxt / Nitro 生产构建成功
```

## 4. Demo 中要避免讲错的地方

不要说：

- “AI 可以自动控制用户全部钱包”；
- “已经接入主网真实资产”；
- “所有 CAW 真实交易都已完成”；
- “无需用户授权也能执行”。

应该说：

- “Agent 只能提出或执行受 Pact 限制的动作”；
- “当前公开 Demo 使用测试网 / 预置状态 / dry-run 保证安全”；
- “真实执行路径需要 EOA、CAW 配对、测试网资金和明确授权”；
- “所有关键动作都应该写入 SQLite audit log”。

## 5. Demo Checklist

演示前检查：

- [ ] 落地页主按钮是 `Try Demo`。
- [ ] `/dashboard` 在 Demo preset 下可进入。
- [ ] 不连接浏览器钱包也能展示核心 Demo。
- [ ] 真实钱包连接路径仍然保留。
- [ ] Demo 里不展示 `.env`、API Key、私钥、助记词或真实资金地址。
- [ ] 测试和 build 结果已记录。

## 6. 关联 Proof

代码仓库：

- https://github.com/baikingrio/yield-agent

关键提交：

- https://github.com/baikingrio/yield-agent/commit/3a6a617
- https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0

学习笔记：

- https://github.com/baikingrio/ai-web3-school-note/blob/main/daily/2026-06-10.md
- https://github.com/baikingrio/ai-web3-school-note/blob/main/notes/20260610-pacttrader-demo-first-learning.md
- https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/pacttrader-week4-scope-freeze.md
