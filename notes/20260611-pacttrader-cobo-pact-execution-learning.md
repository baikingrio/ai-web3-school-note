# 2026-06-11｜PactTrader Cobo Pact 执行凭证学习笔记

## 1. 今天先解决 / 理解的问题

今天围绕 PactTrader 排查一个很关键的执行问题：

> 已经 active 的 Cobo Pact，在执行首次 Recipe 时为什么会因为 API Key 授权不匹配而失败？

表面上它表现为接口 502，但真正值得学习的是背后的权限模型：

- Agent 是否可以直接用主 Key 操作 Agent Wallet？
- 用户批准 Pact 后，Cobo 返回的 pact-scoped key 应该在哪里使用？
- 如果线上 serverless 环境丢了本地 credential 缓存，应用应该怎么处理？
- 错误信息应该提示“去配置主 Key”，还是提示“缺少 Pact 子 Key”？

今天的结论是：

> active Pact 的执行不应该 fallback 到 Agent 主 Key，而应该要求使用对应 Pact 的 pact-scoped 执行凭证。

这不是一个单纯的 bugfix，而是 PactTrader 安全模型的一部分。

## 2. 一句话收获

> Agentic Wallet 的核心不是“让 Agent 拿到更大的权限”，而是“让 Agent 只能拿到当前 Pact 允许的最小权限”。

换成 PactTrader 的产品表达就是：

> Agent 可以提出策略，但执行必须落在用户批准的 CAW / Pact 边界里。

如果代码在缺少 Pact 子 Key 时自动换成 Agent 主 Key，哪怕最后被 Cobo 拒绝，也会让产品语义变得不稳。正确做法是：

```text
有 Pact 子 Key -> 执行
没有 Pact 子 Key -> 刷新 / 提示 / 停止
不要 silent fallback 到主 Key
```

## 3. Agent 主 Key 和 Pact 子 Key的区别

今天把两个容易混淆的概念重新拆开了。

### 3.1 Agent 主 Key

Agent 主 Key 更像 Agent 在 Cobo / CAW 系统里的管理身份。它可以用于：

- 创建或导入 Agent Wallet；
- 提交 Pact；
- 同步 Pact 状态；
- 读取部分 Agent / Wallet / Pact 信息；
- 在某些管理流程里刷新状态。

但它不应该被当成“执行某个 active Pact 交易”的万能凭证。

### 3.2 Pact 子 Key / pact-scoped key

Pact 子 Key 是用户审批某个 Pact 后，Cobo 返回给这个 Pact 的受限执行凭证。

它的含义更接近：

```text
这个 Agent 可以在这个 Pact 的范围内做允许的动作。
```

范围通常由这些条件限制：

- 允许的 token；
- 允许的 protocol / contract；
- 单次或总额度；
- 有效期；
- 交易次数或预算；
- Pact 是否 active / revoked / completed；
- 用户是否已经审批。

所以 Pact 子 Key 才符合 PactTrader 想表达的“受限执行”模型。

## 4. 这次失败链路怎么发生

今天排查的执行链路大致是：

```text
POST /api/pacts/:id/execute
  -> 同步 Cobo Pact 状态
  -> 查找本地缓存的 pact-scoped key
  -> 如果找不到，旧逻辑会 fallback 到 Agent 主 Key
  -> 用这个 key 创建 TransactionsApi
  -> 提交 contract call
  -> Cobo 返回授权不匹配错误
```

旧逻辑的问题不在于 Cobo 拒绝，而在于应用层不应该走到“用主 Key 执行 active Pact”的路径。

因为在 PactTrader 的模型里：

```text
Pact active
  -> 应该存在 Pact 子 Key
  -> 用 Pact 子 Key 执行
```

如果 Pact 子 Key 不存在，说明本地状态或线上持久化有问题，应该先恢复 credential，而不是换一个更大的 key 尝试继续。

## 5. Vercel / SQLite 对这个问题的影响

今天也重新理解了 Vercel serverless 环境里的状态问题。

项目使用 SQLite 保存状态和 pact credential。如果线上没有配置持久数据库，Vercel 默认只能写到类似 `/tmp` 的临时目录。这会带来一个问题：

```text
创建 / 审批 Pact 的请求里缓存了 pact-scoped key
  -> serverless 实例重启或换实例
  -> /tmp 里的 SQLite 状态可能丢失
  -> execute 时找不到 pact-scoped key
```

这时候应用有两个选择：

1. 错误选择：fallback 到 Agent 主 Key 执行。
2. 正确选择：尝试从 Cobo Pact 详情刷新 Pact 子 Key；如果刷新不到，就停止并提示。

今天的修复选择了第二条。

## 6. 今天的代码修复思路

### 6.1 `resolveExecutionCredentials` 不再对 active Pact fallback

旧思路大概是：

```text
先找 pact-scoped key
找不到 -> 用 getCoboApiKey(state)
```

今天改成：

```text
先找 pact-scoped key
如果是 active Cobo Pact 且找不到 -> 返回 null
其他非 active / 特殊场景 -> 再考虑 principal key
```

这样可以保证 active Pact 执行不会误用 Agent 主 Key。

### 6.2 `/execute` 缺 key 时统一尝试 refresh

旧逻辑在 Vercel 场景下可能因为 `preferEnvCoboApiKey()` 而跳过 refresh。

今天改成：

```text
如果当前没有 executionApiKey
  -> 尝试 refreshPactCredentialFromCobo
  -> persistCurrentState
  -> 再 resolveExecutionCredentials
```

这个更适合 serverless 场景，因为线上最容易丢的正是本地缓存。

### 6.3 错误信息要精确

之前错误信息容易让人误会成：

```text
配置 Agent 主 Key 就能执行
```

今天改成强调：

```text
缺少 active Pact 的 pact-scoped 执行凭证（Pact 子 Key）
```

这对调试和产品表达都更准确。

## 7. 关于 `src_addr` 的一个学习点

排查过程中也验证了一个细节：Cobo contract call schema 要求显式传 `src_addr`。

也就是说，执行合约调用时不能简单省略来源地址让 Cobo 自动选择。否则会得到参数校验错误：

```text
src_addr: Field required
```

所以今天最终保留了显式传 Agent Wallet 地址的做法。

这说明当接口报错时，需要区分两类问题：

- **参数问题**：例如缺 `src_addr`，通常是 422 validation error。
- **授权问题**：例如 key 对 wallet / pact 没权限，通常是 403 authorization error。

今天主要解决的是第二类。

## 8. 回归测试如何保护这个边界

今天补了 `tests/pact-credentials.test.ts` 的断言。

关键测试是：

```text
active Cobo Pact
+ Vercel split deploy
+ 存在 AGENT_WALLET_API_KEY
+ 没有 cached pact-scoped key
=> resolveExecutionCredentials 返回 null
```

也就是说，即使环境变量里有 Agent 主 Key，也不能用它来执行 active Pact。

这类测试很重要，因为它保护的是安全边界，不只是普通功能行为。

## 9. 对 PactTrader Demo 的影响

这个修复让 PactTrader 的 Demo 故事更一致：

```text
用户批准 Pact
  -> Cobo 返回 Pact 子 Key
  -> Agent 在 Pact 边界内提交动作
  -> 越界 / 缺凭证则停止
  -> SQLite / 审计日志记录结果
```

如果评审关心安全性，可以这样解释：

> PactTrader 不会在 active Pact 缺少受限执行凭证时，偷偷改用更大权限的 Agent 主 Key。它会先尝试恢复 Pact 子 Key；恢复失败就停止执行并提示。这和“AI 不能自由操作钱包，只能在 Pact 边界内执行”的设计一致。

## 10. 今天的 Proof-of-Work

代码仓库：`https://github.com/baikingrio/yield-agent`

关键提交：

```text
3bbdc01 fix: require pact scoped key for active execution
```

相关文件：

```text
server/utils/pact-credentials.ts
server/api/pacts/[id]/execute.post.ts
server/utils/cobo-execution.ts
tests/pact-credentials.test.ts
```

验证：

```text
npm test -- tests/pact-credentials.test.ts tests/cobo-transaction.test.ts tests/cobo-pact-submit.test.ts tests/local-draft-policy.test.ts
# 4 个 test files 通过，12 个测试通过

npm run build
# Nuxt / Nitro 生产构建成功
```

## 11. 之后还需要继续看的问题

今天修复的是“不要错误 fallback 到主 Key”这个代码边界。后面还需要继续确认：

1. 线上 Vercel 是否能稳定刷新并缓存 Pact 子 Key。
2. 如果 `/tmp` SQLite 导致 credential 丢失，是否需要换成更可靠的后端持久存储。
3. Cobo Pact 详情接口在什么条件下会返回 `api_key`，什么条件下不会返回。
4. 是否需要在 UI 上显示更明确的状态，例如：
   - Pact 已 active；
   - Pact 子 Key 已缓存；
   - 缺少 Pact 子 Key，需要重新同步；
   - 当前不能执行，避免用户误以为是普通失败。

## 12. 可以沉淀成的产品原则

今天这次 debugging 可以沉淀成 PactTrader 的一个产品原则：

> 权限缺失时，不扩大权限；只恢复原本被授权的最小权限。

对应到 Web3 Agent 产品里就是：

- 不因为 demo 方便就绕过授权边界；
- 不因为执行失败就用更大的 key 重试；
- 不把用户批准一个 Pact，解释成 Agent 可以操作整个钱包；
- 所有执行都必须能回到 Pact / policy / audit log 这条链路里。

这也是 PactTrader 和普通“自动交易机器人”的区别：它不是追求 Agent 自由度最大，而是追求 Agent 在明确边界里的可解释执行。

## 13. 隐私和公开边界

本笔记只记录公开安全内容：

- 架构理解；
- bug root cause；
- 代码文件路径；
- commit；
- 测试和构建结果；
- 产品安全原则。

不记录：

- API Key；
- `.env`；
- 钱包私钥或助记词；
- 真实资金细节；
- 未公开会议链接；
- 具体可复用的敏感执行凭证。
