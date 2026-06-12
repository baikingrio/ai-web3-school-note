# 2026-06-12｜YieldAgent Vercel 持久化与 Demo 稳定性学习笔记

## 1. 今天先解决 / 理解的问题

今天同步 YieldAgent 最新代码后，最明显的变化是：项目开始补齐 Vercel 部署下的状态持久化能力。

之前 Demo 里已经有 CAW Agent Wallet、Pact 提交、active Pact 执行、日志和 Dashboard 展示，但如果这些状态主要存在本地 SQLite，到了 Vercel serverless 环境就会有一个很现实的问题：

```text
serverless 实例可能变化
  -> /tmp/yieldagent.db 不一定稳定
  -> Pact credential / 钱包准备状态 / 执行日志可能丢失
  -> 前端看到的 Dashboard 状态和真实 Cobo 状态不一致
```

今天的代码把这个问题往前推进了一步：增加 Supabase Postgres 持久化能力，并把 Postgres 连接状态纳入 deployment check。

## 2. 一句话收获

> 对 Web3 Agent Demo 来说，持久化不是普通后端工程细节，而是安全叙事的一部分。

原因是：YieldAgent 想表达的是“Agent 在 Pact 边界内执行”。如果 Pact 状态、执行凭证、日志和钱包状态不稳定，用户就很难相信这个边界真的存在。

所以今天的学习可以概括为：

```text
CAW / Pact 负责限制 Agent 能做什么
Postgres / logs 负责保存 Agent 做过什么
Deployment check 负责解释当前环境能不能做
Dashboard 负责让用户看懂这些状态
```

## 3. 为什么 Vercel `/tmp` 不够

本地开发时，SQLite 很适合快速迭代：

- 无需额外服务；
- 适合保存策略、Pact、logs；
- 测试和 Demo 启动都很轻。

但在 Vercel 这类 serverless 部署里，`/tmp` 更像临时缓存，不适合作为关键业务状态来源。对 YieldAgent 来说，关键状态包括：

- Agent Wallet 是否创建、是否 active、EVM 地址是什么；
- 用户是否完成 funding；
- 策略创建后对应的 Pact 是什么；
- Cobo App 审批状态是否已经 active；
- active Pact 的执行凭证是否存在；
- 执行、pending、failed、denied 等日志是否可以回看。

这些状态如果丢失，表面上看是“页面数据不见了”，深层看是“安全边界和审计路径断了”。

## 4. 今天提交内容的技术主线

今天同步到 7 个主要提交：

```text
63489cc feat: improve dashboard polling and log fetching logic
439be45 feat: enhance deployment check with Postgres connection status
21e24c5 feat: add Supabase Postgres persistence for Vercel deployments
23825d8 feat: update strategy form to display available USDC balance
a0ee605 feat: enhance log fetching and dashboard experience
36deb47 feat: enhance agent wallet address handling and validation
6c9b1fe feat: improve wallet preparation and error handling for pact-scoped keys
```

我把它们理解成五条线。

### 4.1 Supabase Postgres 持久化

新增 Postgres client、runtime state、schema migration，并扩展 repository 层。这条线解决的是：

```text
本地 SQLite 可以继续用
生产 / Vercel 可以切到 Postgres
关键状态不再只依赖 serverless 临时文件
```

这对 Demo 很重要，因为评审打开公开链接时，不一定和上一次请求落到同一个 serverless 实例。如果状态只在 `/tmp`，就很容易出现“刚才创建的 Pact 下一次看不到”的问题。

### 4.2 Deployment Check 加入 Postgres

Settings 页和后端自检里加入 Postgres 连接状态。这让我意识到：部署自检不应该只检查 CAW API Key 或 TSS 节点，还应该检查数据库。

因为对 YieldAgent 来说：

- CAW 配置决定能不能创建 / 同步钱包与 Pact；
- TSS 节点决定能不能参与签名；
- Hermes runtime 决定能不能解析策略；
- Postgres 决定 Demo 状态和审计日志是否稳定保存。

少一个，Demo 都可能看起来“不稳定”。

### 4.3 Wallet 地址解析与校验

今天还有一条线是加强 Agent Wallet EVM 地址处理。这里的学习点是：Cobo wallet UUID、Agent Wallet EVM 地址、EOA 地址不是同一个东西。

如果地址解析不清楚，后续执行时可能会出现：

- `src_addr` 不存在；
- wallet UUID 和地址对应不上；
- API Key 对这个 wallet 没权限；
- 用户看到的地址和实际执行地址不一致。

所以地址校验不是小细节，而是 CAW 执行链路里的基础安全检查。

### 4.4 Log fetching 与 Dashboard 体验

Dashboard 和 History 的 log fetching 也继续增强。我的理解是：Agentic Wallet 产品里的日志不是“附加信息”，而是用户理解 Agent 行为的主要入口。

好的日志至少要回答：

- 这次动作是 allowed、denied、pending 还是 failed；
- 关联哪个策略 / Pact；
- 如果失败，是授权问题、参数问题、余额问题，还是部署环境问题；
- 如果成功，有没有 tx hash 或后续状态。

今天这部分改动让 Dashboard 更接近真实产品，而不是只展示静态 Demo 卡片。

### 4.5 策略表单显示可用 USDC

创建策略时显示可用 USDC 余额，是一个很小但很重要的 UX 改进。

YieldAgent 的策略不是普通表单，它最终会映射到 Pact 预算。用户在输入预算前看到当前 Agent Wallet 可用余额，可以减少明显越界的输入，也更容易理解：

```text
不是“我想让 Agent 做多少就做多少”
而是“Agent 只能在我放入 Agent Wallet 且 Pact 允许的范围内做”
```

## 5. 我对架构的重新理解

今天之后，我对 YieldAgent 的架构理解更像下面这样：

```text
Browser / Dashboard
  -> 展示钱包、策略、Pact、日志、收益状态

Nuxt / Nitro API
  -> 接收策略创建、Pact 同步、执行、赎回、日志查询

Postgres / SQLite
  -> 保存策略、钱包准备状态、Pact、执行凭证缓存、审计日志

Hermes runtime
  -> 解析自然语言策略，并交给 deterministic validation 校验

Cobo Agentic Wallet / Pact
  -> 管理 Agent Wallet、审批 Pact、限制执行权限

TSS / CAW execution
  -> 在授权边界内执行真实测试网动作
```

这比单纯说“AI 帮用户做收益策略”清楚得多。真正的产品价值不只是自动化，而是：

- 自动化前有授权边界；
- 自动化中有执行凭证；
- 自动化后有日志和状态；
- 出错时能解释是哪一层的问题。

## 6. 本地验证记录

同步代码后做了本地验证：

```bash
pnpm test
pnpm build
```

结果：

```text
pnpm test
- Test Files: 55 passed, 2 skipped, total 57
- Tests: 197 passed, 3 skipped, total 200

pnpm build
- Nuxt / Nitro production build succeeded
- 有 sourcemap warning，但不影响构建完成
```

测试中有 Node SQLite experimental warning，这是当前 Node SQLite 能力提示，不是失败。

## 7. 对 Hackathon Demo 的意义

今天的进展对 Demo 叙事有三个帮助：

1. **更稳定**  
   状态不再完全依赖 Vercel 临时文件，公开链接更适合被评审反复打开。

2. **更可解释**  
   deployment check 可以告诉用户 / 开发者：当前是 CAW、TSS、Hermes 还是数据库配置有问题。

3. **更可信**  
   Pact 状态、执行凭证和日志可以持久化，用户能追踪 Agent 到底做了什么，而不是只看一次性的前端反馈。

我觉得这也是 Web3 Agent 产品很重要的一点：信任不是靠一句“安全”建立的，而是靠授权边界、执行记录、错误解释和可恢复状态共同建立的。

## 8. 今日可复用表达

如果要向评审解释今天的方向，可以这样说：

> YieldAgent 不是让 AI 直接接管用户钱包，而是把用户授权、Agent Wallet、Pact、执行凭证和审计日志拆成明确层级。今天主要补强的是部署后的持久化和可观测性：即使在 Vercel 这种 serverless 环境里，策略、Pact、执行日志和钱包准备状态也应该能稳定保存和回读，这样 Demo 才能证明 Agent 的行为是受限、可追踪、可解释的。

## 9. 下一步

- 在线上环境验证 Postgres/Supabase 配置是否正常。
- 用 deployment check 检查 CAW、TSS、Hermes、Postgres 四条线。
- 走一遍从 Dashboard 到策略创建、Pact 审批、执行 / 拒绝、History 日志的完整 Demo。
- 继续统一公开材料中的项目名，全部使用 YieldAgent。
- 如果线上仍出现执行失败，优先排查 credential source、wallet 授权、Postgres 持久化，而不是先怀疑前端页面。

## 10. 隐私与公开边界

这份笔记只记录公开安全的学习内容：架构理解、提交摘要、测试结果和 Demo 稳定性复盘。

不记录：

- `.env` 内容；
- API Key / Bearer Token；
- 私钥、助记词；
- 真实资金细节；
- 会议链接或密码；
- 未确认公开的项目策略细节。
