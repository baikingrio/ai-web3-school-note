# 2026-06-06｜YieldAgent Demo 稳定性学习笔记

## 1. 今天先解决的问题

今天主要解决的是 YieldAgent MVP 的一个现实问题：**Agentic Wallet demo 不能只在外部条件全部完美时才能跑通。**

YieldAgent 的目标链路是：

```text
User Strategy
  -> Agent Proposal
  -> Local Risk / Policy Check
  -> CAW / Pact Execution or Rejection
  -> SQLite Audit Log
  -> Dashboard
```

但在实际开发中，外部环境经常不是理想状态：

- Cobo API Key 可能还没配置；
- Cobo Pact 权限可能还没授权到当前 wallet；
- CAW CLI 可能能拿到本地 TSS 状态，但远端状态查询返回 403；
- dev server 页面可能因为一个后端接口报错而中断。

所以今天的学习重点不是“再加一个功能”，而是梳理：**哪些失败应该阻断流程，哪些失败应该透明降级，哪些失败应该写入 audit / message 给用户看。**

## 2. 一句话收获

> 一个 Agentic Wallet demo 的可信度，不只来自成功执行交易，也来自它能清楚处理“不允许执行、权限不足、凭证缺失、只能 dry-run”这些状态。

这和 YieldAgent 的定位是一致的：

> Agent proposes. Policy decides. CAW executes only when allowed.

今天我补充了一层理解：

> When CAW is not fully available, the product should degrade transparently, not pretend or crash.

## 3. 问题一：CAW / TSS 状态不能被 remote 失败误判

### 3.1 现象

在创建 Agent Wallet 的流程里，页面需要知道 TSS Node 是否在线。原来的风险是：

- `caw node status` 可能已经能返回本地 TSS running；
- 但 remote status 因为权限、wallet 状态或 API 问题返回错误；
- CLI 最终 exit code 非 0；
- 前端就把整个状态当成失败，显示 TSS Node 未在线 / wallet not active。

这会造成一个很糟糕的 demo 体验：本地执行环境其实已经准备好了，但页面仍然卡在创建钱包阶段。

### 3.2 今天的修正思路

今天的修正不是简单忽略错误，而是更细地看 CLI 输出：

```text
CLI exit code != 0
  -> stdout 是否仍然包含可解析 JSON？
      -> 是：best-effort parse
      -> local.running === true：认为本地 TSS 已在线
      -> remote 失败只作为状态信息，不直接判死
  -> 否：按失败处理
```

这样更符合实际情况：

- 本地 TSS running 是创建 / pairing 流程的重要前置条件；
- remote status 失败需要展示和记录，但不一定代表本地节点不可用；
- 页面不应该因为一个非关键 remote 查询失败就阻断全部流程。

### 3.3 学到的工程原则

在多组件系统里，不同状态的权重不一样：

- `local TSS running` 是 readiness 的强信号；
- `remote query failed` 是需要提示的警告；
- 两者不能简单合并成“整体失败”。

## 4. 问题二：Cobo Pact 权限不足时保留本地 draft

### 4.1 现象

在创建策略时，如果尝试提交到 Cobo Pact，但当前 API Key 对 wallet 没有 pact authorization，可能会出现类似错误：

```text
API key pact authorization is not authorized for this wallet
```

如果这里直接抛错，用户就无法创建策略，整个 Hackathon demo 主流程会断掉。

### 4.2 今天的修正思路

YieldAgent 的策略创建可以分成两层：

1. **产品层策略 / Pact draft**：用户选择资产、风险等级、最大额度、分成等，生成本地策略记录。
2. **Cobo Pact 真实提交**：把 Pact 提交到 CAW / Cobo 执行层。

如果第二层因为权限不足失败，第一层不一定要失败。更好的处理是：

```text
submit to Cobo Pact
  -> success：submissionMode = submitted
  -> unauthorized / unavailable：submissionMode = local-draft
  -> message 中说明 Cobo Pact 暂不可用和失败原因
```

这样页面仍然可以展示：

- strategy 已创建；
- pact draft 已生成；
- 当前处于 `local-draft`；
- 之后可以在权限恢复后重新提交。

### 4.3 学到的产品原则

对 Hackathon demo 来说，透明降级比“要么全真、要么全挂”更好：

- 真实 CAW 调用成功时，要明确显示 submitted；
- 权限不足时，要明确显示 local-draft；
- dry-run 时，要明确显示 dry-run；
- blocked 时，要明确显示 policy blocked。

不要把 mock / fallback 包装成真实执行，也不要因为真实执行暂时不可用就让整个产品不可用。

## 5. 问题三：Cobo API Key 未配置时钱包页面不能崩溃

### 5.1 现象

本地 dev server 启动后，页面请求 `/api/wallet`，后端会同步 Cobo 余额：

```text
/api/wallet
  -> syncWalletSummaryFromCobo
  -> fetchUsdcBalanceFromCobo
  -> createCoboBalanceApi
  -> getCoboApiKey
```

如果环境里没有 `AGENT_WALLET_API_KEY`，会抛出：

```text
COBO_NOT_CONFIGURED
```

结果就是 `/api/wallet` 500，页面不可用。

### 5.2 今天的修正思路

余额查询不是“页面能不能打开”的绝对前置条件。更合理的顺序是：

```text
fetch balance
  -> 优先使用 Cobo Balance API
  -> 如果 Cobo API 未配置 / 不可用：fallback 到链上余额查询
  -> 如果链上查询也失败：返回 0，保持页面可用
```

这样可以保持几个原则：

- 真实环境有 Cobo API Key 时，优先使用 Cobo 数据；
- 本地开发或 demo 环境没有 key 时，页面仍可打开；
- 余额为 0 或 fallback 状态可以被 UI / message 解释；
- 不泄露 key，也不要求把 `.env` 写进公开仓库。

### 5.3 学到的架构原则

外部 API 凭证缺失应该是“能力降级”，不应该默认是“应用崩溃”。尤其是 dashboard 页面，应该尽量做到：

```text
critical path：页面和核心 demo 可用
optional integration：外部真实数据可用时增强体验
```

## 6. 今天的测试和验证

今天补了几个回归测试，主要覆盖这些行为：

- CAW CLI 返回非 0 exit code 但 stdout 有可用 JSON 时，仍能解析本地 TSS running 状态；
- Cobo Pact 提交未授权时，策略创建降级为 local draft；
- Cobo API Key 未配置时，钱包 summary 接口不崩溃。

验证结果：

```text
pnpm test
-> Test Files 12 passed
-> Tests 45 passed

pnpm build
-> Build complete

GET /
-> 200

GET /api/wallet
-> 200
```

今日提交：

```text
18f9516（demo fallback / Cobo auth 容错修复）
```

## 7. 对 YieldAgent Demo 的影响

经过今天的修复，YieldAgent 的 MVP 可以更稳定地展示下面几种状态：

### 7.1 正常路径

```text
用户创建策略
  -> 生成 strategy
  -> 提交 Cobo Pact
  -> 返回 submitted
  -> 写入 audit / dashboard
```

### 7.2 Pact 权限不足

```text
用户创建策略
  -> 生成 strategy
  -> Cobo Pact submit unauthorized
  -> 保存 local-draft
  -> 页面继续可用，并提示原因
```

### 7.3 Cobo API Key 缺失

```text
钱包页面请求余额
  -> Cobo API unavailable
  -> fallback to on-chain balance
  -> 页面返回 200
```

### 7.4 TSS remote 状态异常

```text
caw node status
  -> local.running = true
  -> remote query failed
  -> 本地 TSS 仍视为 online
  -> remote 错误作为信息保留
```

这些状态对 demo 很重要，因为它们能体现 YieldAgent 不是一个“只有 happy path 的 AI 工具”，而是一个认真处理执行边界和失败状态的 Agentic Wallet 应用。

## 8. 后续开发任务拆解

### Phase A：UI 状态表达

- 在创建策略页面清楚显示 `submitted`、`local-draft`、`dry-run`、`blocked`。
- 给每种状态配一句自然语言解释。
- 不要让用户误以为 local draft 已经是 Cobo 上的真实 Pact。

### Phase B：Demo Script

准备一版评委视角的演示脚本：

1. 创建 / 导入 Agent Wallet；
2. 设置小额 USDC 策略；
3. 创建 YieldAgent strategy；
4. 展示 local risk decision；
5. 展示 Cobo Pact / local draft 状态；
6. 展示 audit log。

### Phase C：命名和 README 收敛

当前代码仓库叫 `yield-agent`，这与项目主线 YieldAgent 一致。后续需要检查：

- README 是否已经清楚表达 YieldAgent；
- 页面标题是否统一；
- package name / route / 文档是否仍残留历史命名；
- 清理历史命名时注意不要误删历史 proof。

### Phase D：真实 CAW / Z.AI 集成边界

- 有凭证时接真实 Cobo Pact / Balance；
- 无凭证时保持 fallback；
- Z.AI API 缺失时使用 deterministic fallback；
- 所有模式都要在 UI 中透明标注。

## 9. 今天的收获

今天最大的收获是：YieldAgent 的安全叙事不能只停留在“有 policy”。真正可信的 Agentic Wallet 产品，还要让用户和评委看见：

1. 哪些动作被允许；
2. 哪些动作被拒绝；
3. 哪些动作因为权限不足只能保存为 draft；
4. 哪些动作只是 dry-run；
5. 哪些外部 API 不可用但产品仍能稳定展示；
6. 每一步如何记录到 audit log。

这也是我后续打磨 YieldAgent demo 时要坚持的方向：**不夸大真实执行，不隐藏失败状态，把 Agent、Policy、CAW 和 Audit 的边界讲清楚。**

## 10. 隐私与公开边界

这份学习笔记只记录公开安全内容：

- 不记录私钥、助记词、API Key；
- 不记录 `.env` 内容；
- 不记录真实资金地址；
- 不记录未公开会议链接；
- 不把 local draft / dry-run 包装成真实 Cobo 执行结果。
