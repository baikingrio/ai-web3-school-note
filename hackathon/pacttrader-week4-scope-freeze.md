# PactTrader｜Week 4 Scope Freeze 与任务看板

> 日期：2026-06-10  
> 项目主线：PactTrader  
> 目标：Week 4 只保留一条最小可验证主流程，优先保证 Hackathon Demo 可讲、可跑、可复查。

## 1. Scope Freeze 原则

Week 4 不再继续扩大功能面，只做一条能清楚表达项目价值的主流程：

```text
Landing Page
  -> Try Demo
  -> Dashboard
  -> 预置 CAW Agent Wallet / Demo State
  -> 策略与 Pact 权限边界
  -> 允许 / 拒绝 / 审计日志
```

PactTrader 的 Demo 目标不是展示“AI 可以自由交易”，而是展示：

> Agent proposes. Policy decides. CAW executes only when allowed.

也就是说，Agent 可以提出策略建议，但真实执行必须被 Pact / policy / CAW 边界限制，并留下可复查审计记录。

## 2. Must-have：必须完成

### M1. Demo-first 入口

- Owner：Quinn
- Deadline：2026-06-10
- 状态：已完成
- 验证方式：
  - 落地页主 CTA 为 `Try Demo`。
  - Header 入口为 `Try Demo`。
  - 未连接浏览器钱包时，也可以进入预置 Demo Dashboard。
  - 测试：`tests/demo-access.test.ts` 通过。
- Proof：
  - https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0

### M2. 预置 CAW Agent Wallet / Demo state

- Owner：Quinn
- Deadline：2026-06-10
- 状态：已完成基础版
- 验证方式：
  - Demo wallet mode 可用。
  - `create-agent` API 在 demo preset 下能返回可用状态。
  - 测试：`tests/pacttrader-demo-wallet.test.ts`、`tests/pacttrader-demo-create-agent-api.test.ts` 通过。
- Proof：
  - https://github.com/baikingrio/yield-agent/commit/3a6a617

### M3. Dashboard route guard 支持 Demo 模式

- Owner：Quinn
- Deadline：2026-06-10
- 状态：已完成
- 验证方式：
  - `canEnterDashboard` 支持 browser wallet、ready preparation、demo/preset 状态。
  - 非 Demo 且无钱包状态时仍会被拦截。
  - targeted tests 通过。
- Proof：
  - https://github.com/baikingrio/yield-agent/blob/main/shared/utils/demo-access.ts
  - https://github.com/baikingrio/yield-agent/blob/main/tests/demo-access.test.ts

### M4. 一条 Demo Story

- Owner：Quinn
- Deadline：2026-06-10 / 2026-06-11
- 状态：已补充公开版
- 验证方式：
  - 有 3–5 分钟演示脚本。
  - 脚本只展示一条主路径，不扩散到所有高级功能。
  - 明确哪些是预置 Demo / dry-run，哪些是真实 CAW / wallet 路径。
- Proof：
  - https://github.com/baikingrio/ai-web3-school-note/blob/main/hackathon/pacttrader-demo-story.md

### M5. 可复查验证材料

- Owner：Quinn
- Deadline：2026-06-10
- 状态：已完成基础版
- 验证方式：
  - targeted tests 通过。
  - full test suite 通过。
  - Nuxt / Nitro production build 成功。
  - 公开 commit 可复查。
- Proof：
  - https://github.com/baikingrio/ai-web3-school-note/blob/main/notes/20260610-pacttrader-demo-first-learning.md

## 3. Should-have：应该完成，但不阻塞 Demo

### S1. README 命名与入口路径同步

- Owner：Quinn
- Deadline：2026-06-11
- 状态：进行中 / 已开始修正
- 验证方式：
  - README 说明 PactTrader 为当前 Demo 主线。
  - README 不再把“连接钱包”写成落地页第一步。
  - README 解释 Try Demo 与真实钱包路径的关系。

### S2. Vercel 部署验证

- Owner：Quinn
- Deadline：2026-06-11
- 状态：待验证
- 验证方式：
  - 线上 `/` 能进入。
  - 线上 `/dashboard` 可通过 Try Demo 进入预置 Demo。
  - 不依赖 Vercel 内部 localhost。
  - 关键 API 不暴露 secret。

### S3. 页面命名从旧 YieldAgent 收敛到 PactTrader

- Owner：Quinn
- Deadline：2026-06-11 / 2026-06-12
- 状态：待清理
- 验证方式：
  - Header / landing / README / docs 中的当前主线命名一致。
  - 历史 YieldAgent 材料保留为历史，不作为当前提交叙事。

## 4. Nice-to-have：有时间再做

### N1. Demo 视频 / GIF

- 目的：让 Final Submission Pack 更完整。
- 不阻塞原因：当前已有可复查代码、测试和学习笔记；视频可以在最终提交前补。

### N2. 更完整的 Agent Trace 展示

- 目的：在 UI 里展示 intent -> proposal -> policy decision -> execution / denial -> audit log。
- 不阻塞原因：MVP 先保证 Demo-first 路径和审计材料可复查。

### N3. 更真实的 CAW 测试网执行截图

- 目的：增强 sponsor 赛道 proof。
- 不阻塞原因：不能为了截图牺牲安全边界；真实执行必须在测试网和明确授权下完成。

## 5. Cut / Mock：本周明确不做或只做降级

### C1. 主网真实资金执行

- 决策：Cut。
- 原因：Hackathon Demo 当前只展示测试网 / dry-run / 预置 Demo，不触碰主网真实资产。

### C2. 多策略复杂收益优化

- 决策：Cut。
- 原因：本周只展示一条最小主流程；复杂策略会分散 Pact / CAW 权限边界表达。

### C3. 完整生产级风控系统

- 决策：Mock / Partial。
- 原因：MVP 只保留最关键的 token / protocol / amount / budget / duration / audit 边界。

### C4. 真实全自动支付 / 交易闭环

- 决策：Mock / Dry-run first。
- 原因：自动执行必须先证明授权边界和审计链路，不能为了 Demo 把 Agent 变成无限权限执行器。

## 6. 当前验证记录

截至 2026-06-10：

```text
pnpm test tests/demo-access.test.ts tests/pacttrader-demo-wallet.test.ts tests/pacttrader-demo-create-agent-api.test.ts -- --runInBand
# 3 个 test files 通过，7 个测试通过

pnpm test -- --runInBand
# 48 个 test files 通过，1 个 skipped；164 个测试通过，1 个 skipped

pnpm build
# Nuxt / Nitro 生产构建成功
```

## 7. 公开 / 私密边界

公开仓库可以记录：

- 产品路径；
- 技术架构；
- 任务看板；
- commit；
- 测试结果；
- Demo Story；
- 风险边界。

公开仓库不记录：

- `.env`；
- API Key；
- 私钥 / 助记词；
- 真实资金地址；
- 未公开会议链接；
- 未确认公开的 Hackathon 私密策略。
