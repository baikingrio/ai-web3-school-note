# 2026-06-07｜YieldAgent Pact 生命周期闭环学习笔记

## 1. 今天先解决 / 理解的问题

今天同步 YieldAgent 最新代码后，最明显的变化是：项目从“可以创建策略”进一步推进到“可以管理 Pact 生命周期”。

一个收益策略 Agent 如果只停留在表单和 mock 数据，其实很难体现 Agentic Wallet 的价值。YieldAgent 真正要讲清楚的是：

```text
用户给出目标
  -> Agent 生成收益策略提案
  -> Pact 定义预算、资产、协议、期限、分账和动作边界
  -> CAW 只在边界内执行
  -> 执行、拒绝、赎回、终止都有记录
```

今天代码里新增和强化的部分，正好是在补这个闭环。

## 2. 一句话收获

> Agentic Wallet 的重点不是“AI 可以自动交易”，而是“AI 只能在用户定义的 Pact 边界内执行，并且用户随时能看见、拒绝、终止和赎回”。

这也是 YieldAgent 当前最适合对外表达的一句话：

> Pact before profit.

先定义 Agent 能做什么，再让 Agent 执行；先展示边界，再展示收益。

## 3. 从策略创建到 Pact 生命周期

今天复盘后，我把 YieldAgent 的主流程理解成 6 个阶段。

### 3.1 资金准备

用户先连接自己的 EOA 钱包，然后创建 / 导入 CAW Agent Wallet，并把测试网 USDC 转入 Agent Wallet。

这里的关键不是“转账”本身，而是资产控制边界发生了变化：

- Agent 不直接控制用户完整 EOA；
- Agent 只能操作用户转入 Agent Wallet 的小额测试网资金；
- Agent Wallet 即使有余额，也还要继续受 Pact 限制。

### 3.2 策略创建

用户可以通过表单填写策略，也可以用自然语言描述，比如：

```text
在 Base 链保守耕作 500 USDC，支出上限 500，目标 APY 8%。
```

代码里对应的是：

- 前端：`app/components/create-strategy/StrategyForm.vue`
- 组合逻辑：`app/composables/useCreateStrategy.ts`
- API：`server/api/strategy-agent/parse.post.ts`
- 解析器：`server/utils/hermes-strategy-parser.ts`
- 校验器：`server/utils/strategy-validator.ts`

我比较喜欢这里的设计：自然语言可以提高体验，但最后不能只相信 LLM 输出。解析结果还要进入 deterministic validation，比如：

- maxSpend 不能超过可用余额；
- network 必须和 Agent Wallet 注资网络一致；
- fee / user split 必须在合理范围；
- APY 输入必须能被安全解释。

这说明 Agent 层负责“理解意图”，但产品和执行层仍然要负责“约束意图”。

### 3.3 Pact 提交与审批

策略创建后，会生成 Pact，并尝试提交到 Cobo / CAW。

这里的产品重点是：Pact 不是一个普通配置项，而是 Agent 执行权限的边界。它约束：

- 预算上限；
- 资产类型；
- 可用网络；
- 可执行的协议 / Recipe；
- 有效期限；
- 分账比例；
- 可审计记录。

前端现在会引导用户到 Cobo App 审批，并在 `/pacts` 页面轮询状态。这个流程让用户明确知道：Agent 不是自己偷偷拿到了权限，而是用户通过 Cobo App 明确批准了一个有边界的 Pact。

### 3.4 Pact 激活后执行首次 Recipe

Pact 变成 `active` 后，YieldAgent 会尝试执行首次 Recipe。

相关代码集中在：

- `server/api/pacts/[id]/execute.post.ts`
- `server/utils/cobo-execution.ts`
- `server/utils/yield-execution.ts`

今天我重点理解了这里的分层：

```text
Pact active
  -> resolve pact-scoped api key
  -> 检查 Agent Wallet 是否有 Gas
  -> 选择 Aave / Compound supply route
  -> 生成 approve / supply calldata
  -> 通过 CAW contractCall 提交
  -> 等待 tx result
  -> 写入 firstExecutionTxHash 和 audit log
```

这比 mock 一个收益数字更有意义。因为它体现的是：Agent 的动作最终会变成一笔可追踪的链上 / CAW 交易，并且 request id、tx hash、状态都能进入审计路径。

### 3.5 仓位查看

今天代码新增了收益仓位读取能力：

- API：`server/api/pacts/[id]/position.get.ts`
- 工具：`server/utils/yield-position.ts`

这个功能让用户不只是看到“执行成功”，还可以看到当前 supplied amount / position snapshot。

对产品叙事来说，这一步很重要：

```text
执行前：我授权了什么？
执行中：Agent 做了什么？
执行后：我的仓位在哪里？
```

如果没有仓位查看，用户只能相信页面上的状态；有了 position API，demo 更容易讲成一个真实的资金闭环。

### 3.6 赎回和终止

今天最关键的新功能之一是 redeem：

- API：`server/api/pacts/[id]/redeem.post.ts`
- 凭证：`server/utils/pact-redeem-credentials.ts`
- 执行逻辑：`server/utils/cobo-execution.ts` + `server/utils/yield-execution.ts`
- 测试：`tests/pact-redeem-credentials.test.ts`、`tests/yield-execution.test.ts`

为什么 redeem 很重要？因为 Agentic Wallet 产品如果只展示“把钱放进去”，会让人担心控制权不完整。赎回能力能补上这句话：

> 用户不仅可以授权 Agent 在边界内执行，也可以退出策略，把资产从收益协议里取回。

此外，terminate 也很重要：

- redeem 更像“退出仓位”；
- terminate 更像“撤销 / 结束权限”。

两个功能一起，才更像完整的用户控制权。

## 4. SQLite 在这个项目里的角色

今天代码里 SQLite 的角色也更清楚了。它不是简单“记日志”，而是 demo 状态底座。

相关代码：

- `server/db/client.ts`
- `server/db/schema.ts`
- `server/db/repository.ts`

SQLite 目前承载：

- wallet summary；
- wallet preparation；
- settings；
- strategies；
- pacts；
- execution logs；
- yield series；
- pact-scoped credentials。

我对这个设计的理解是：Hackathon MVP 不一定需要复杂后端，但必须有一个稳定的 server-side state。否则页面刷新、重新部署、重新打开后，策略和 Pact 状态就很难连续展示。

SQLite 的好处是：

- 足够轻；
- 适合 MVP；
- 便于本地 demo；
- 可以清楚展示 audit log；
- 后续如果要迁移到 Postgres，也有明确的数据边界。

## 5. Pact 管理页面的产品意义

今天 `app/composables/usePactManagement.ts` 的变化让我意识到，`/pacts` 页面其实是 YieldAgent 的核心页面之一。

它不只是列表页，而是一个控制台：

```text
查看 Pact 状态
  -> awaiting approval / active / terminated / completed
筛选状态
  -> active / awaiting approval / all
轮询 Cobo App 审批
  -> 每 4 秒同步
Gas 检查
  -> Agent Wallet Gas 不足时提示
执行 Recipe
  -> active 后自动或手动触发
查看仓位
  -> position snapshot
模拟越权拒绝
  -> denial log
赎回 / 终止
  -> 用户拿回控制权
```

从 Hackathon demo 角度看，这个页面可以承担一段非常关键的演示：

> 这里不是普通策略列表，而是用户查看和管理 Agent 权限边界的地方。

## 6. 今天验证结果

今天同步代码后，我做了本地验证：

```bash
pnpm test
pnpm build
```

结果：

- `pnpm test`：通过。
  - 27 个 test files；
  - 26 个通过，1 个跳过；
  - 90 个测试通过，1 个跳过。
- `pnpm build`：通过。
  - Nuxt / Nitro 生产构建成功。

构建仍有一些 warning 值得后续处理：

- duplicated imports；
- BigInt literals target environment 是 es2019；
- `node:sqlite` 被作为 external dependency；
- 这些 warning 当前不阻断构建，但如果要部署到 Vercel，需要继续确认运行环境是否支持。

## 7. 今天的工程理解：不要把 Agent 做成黑盒

今天最大的学习点是：YieldAgent 的产品信任感来自“可解释边界”，而不是“AI 自动化”四个字。

一个普通交易 bot 可能会说：

```text
我帮你自动执行收益策略。
```

但 YieldAgent 应该说：

```text
你先定义预算、资产、协议、期限和动作边界；
Agent 只能在这些边界内执行；
每次执行、拒绝、赎回、终止都有记录。
```

这两句话的差别很大。前者强调自动化，后者强调授权和审计。

在 Web3 场景里，后者更重要。

## 8. 后续可以继续推进的方向

### 8.1 Demo script

下一步应该把 demo script 写出来，建议路径：

```text
1. 打开 landing page，讲 Pact before profit。
2. 进入 wallet，展示 EOA -> Agent Wallet 的资金边界。
3. 创建策略，用自然语言解析成参数。
4. 展示 Pact Preview：预算、协议、期限、分账、拒绝边界。
5. 进入 Cobo App 审批 Pact。
6. 回到 /pacts，展示 active 和首次执行。
7. 查看 tx hash / audit logs。
8. 模拟越权请求被拒绝。
9. 查看 position。
10. redeem 或 terminate，展示用户拿回控制权。
```

### 8.2 部署风险

需要继续确认：

- Vercel 不能假设本机有 TSS Node；
- Vercel 不能直接调用 localhost Hermes CLI；
- TSS Node 和 Hermes / Strategy runtime 应该放在当前 Hermes Agent 主机；
- 前端 / Vercel API 通过远程 API 或 tunnel 调用；
- `.env`、API Key、pact-scoped credentials 只能保存在服务端。

### 8.3 构建 warning 清理

虽然今天构建通过，但后续最好处理：

- duplicated imports，避免 Nitro auto-import 解析混乱；
- BigInt target，从 es2019 调整或改写 BigInt literal；
- `node:sqlite` external 在部署环境的可用性。

## 9. 今日总结

今天的 YieldAgent 进展让我感觉项目从“能讲概念”更接近“能演示完整产品”。

最重要的不是多了一个 redeem 按钮，而是产品逻辑更闭环了：

```text
授权前有边界
执行时有校验
执行后有记录
风险动作会拒绝
用户可以赎回
权限可以终止
```

这正好对应 Agentic Wallet 的核心价值：让 AI Agent 有能力执行，但不让它无限制执行。
