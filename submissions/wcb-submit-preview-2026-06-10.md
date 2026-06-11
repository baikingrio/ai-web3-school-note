# WCB 任务可提交性检查预览 - 2026-06-10

> 只读检查时间：2026-06-10  
> Program：AI x Web3 School (`cmnx791nl008sru0167pzp4ki`)  
> 说明：本文件是提交前预览，不代表已经提交 WCB。WCB `tasks.submitEvidence` 需要用户再次明确确认。

## 1. 任务状态概览

通过 WCB Agent API 只读检查到课程任务共 **114** 个：

- `NOT_STARTED + available=true`：47 个
- `NOT_STARTED + available=false`：20 个
- `SUBMITTED + available=true`：17 个
- `SUBMITTED + available=false`：14 个
- `APPROVED + available=true`：8 个
- `APPROVED + available=false`：7 个
- `REJECTED + available=false`：1 个

本次只建议处理 `available=true` 且 `NOT_STARTED` 的任务；已 `SUBMITTED` / `APPROVED` 的任务不重复提交。

## 2. 本次认为“已有公开 proof，可直接准备提交”的任务

### A. Week 2｜进阶实践｜x402 Paywall + CAW Agent 自主支付闭环

- Task ID：`cmpkl6548nbg8mu01ufwogcau`
- 当前状态：`NOT_STARTED`
- 分值：40
- 可用：是
- 判断：**可提交**
- 依据：任务说明允许在无法完成真实 demo 时提交架构图、伪代码、交互流程、关键接口说明和风险边界。公开学习仓库已有 Payment / Commerce flow、x402 / MPP 对比、CAW / Agent Wallet 权限边界和 6.04 支付场景学习材料。

可用 proof 链接：

- https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-payment-commerce-flow.md
- https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-live-0604-payment-scenarios.md
- https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week2-direction-deep-dive-and-proposal.md

提交草稿：

```text
我完成了一个 x402 Paywall + CAW Agent 自主支付闭环的架构版设计，没有把它包装成真实自动付款 demo。材料里拆了一个 agent 购买受保护服务 / API 的 payment-commerce flow：服务方报价和交付，agent 识别付款条件，用户预先设置预算和权限边界，CAW / Pact 限制支付范围，最后把 payment / refund / dispute / audit log 都记录下来。

我也整理了 x402 和 MPP 在这个流程里的位置：它们更像 payment request / payment interface，不能单独替代完整 commerce workflow；真正关键的是预算授权、交付验收、失败处理和可审计记录。这个方向和我的 Agent Wallet / PactTrader 思路是一致的：Agent 可以发起支付或策略动作，但必须在明确授权、预算上限和审计边界内执行。

公开 proof：
https://github.com/baikingrio/ai-web3-school-note/blob/main/tasks/week2-payment-commerce-flow.md
https://github.com/baikingrio/ai-web3-school-note/blob/main/submissions/week3-live-0604-payment-scenarios.md
```

隐私检查：只引用公开学习材料，不包含 API Key、私钥、助记词、真实资金地址或未公开会议链接。

---

### B. Week 4｜MVP｜跑通最小可验证主流程

- Task ID：`cmq4n9whnvbywph01l9n9cpt3`
- 当前状态：`NOT_STARTED`
- 分值：30
- 可用：是
- 判断：**可提交**
- 依据：PactTrader / 当前代码仓库已经跑通 Demo-first 主路径：Landing -> Try Demo -> Dashboard -> 预置 CAW Agent Wallet / Demo state -> 策略 / Pact / 审计展示。今日提交包含 route guard、Demo access helper 和测试验证。

可用 proof 链接：

- https://github.com/baikingrio/yield-agent/tree/main
- https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0
- https://github.com/baikingrio/ai-web3-school-note/blob/main/daily/2026-06-10.md
- https://github.com/baikingrio/ai-web3-school-note/blob/main/notes/20260610-pacttrader-demo-first-learning.md

提交草稿：

```text
我今天跑通并验证了 PactTrader 的最小可验证主流程，重点是让 Hackathon Demo 不再卡在“先连接钱包”这一步，而是通过 Try Demo 直接进入控制台，先展示预置 CAW Agent Wallet、策略 Demo、Pact 权限边界和审计日志。

这条 MVP 主流程是：用户打开 Landing Page -> 点击 Try Demo -> 进入 Dashboard -> 查看预置 Agent Wallet / Demo state -> 查看策略与 Pact 边界 -> 通过审计日志复盘发生了什么。这个流程对应“输入 -> Agent / 策略处理 -> Web3 执行边界 -> 可验证结果”的最小闭环。

我补了 demo access 测试：Demo 模式下无浏览器钱包也可以进入 Dashboard；非 Demo 且无钱包状态仍会被拦截。验证结果是 targeted tests 通过、完整测试 164 个通过、Nuxt / Nitro 生产构建成功。

公开 proof：
https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0
https://github.com/baikingrio/ai-web3-school-note/blob/main/daily/2026-06-10.md
```

隐私检查：只引用公开 commit、测试结果和学习笔记，不包含任何密钥或真实资金信息。

---

### C. Week 4｜验证材料｜SDK / Agent Trace / 链上记录

- Task ID：`cmq4n9wxyvbyzph014e5gp5mu`
- 当前状态：`NOT_STARTED`
- 分值：20
- 可用：是
- 判断：**可提交**
- 依据：任务要求至少一种可复查验证材料。当前公开材料可提供：CAW demo wallet mode 相关代码、Demo access 测试、完整测试通过记录、Nuxt / Nitro build 成功记录、公开 commit。

可用 proof 链接：

- https://github.com/baikingrio/yield-agent/commit/3a6a617
- https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0
- https://github.com/baikingrio/yield-agent/blob/main/tests/demo-access.test.ts
- https://github.com/baikingrio/yield-agent/blob/main/tests/pacttrader-demo-wallet.test.ts
- https://github.com/baikingrio/ai-web3-school-note/blob/main/notes/20260610-pacttrader-demo-first-learning.md

提交草稿：

```text
我为 PactTrader / CAW Demo-first 路径整理了可复查验证材料，主要是公开代码、测试和构建结果，而不是口头描述。

验证材料包括：预置 PactTrader demo wallet mode 的代码提交、Try Demo 无需连接浏览器钱包即可进入 Dashboard 的 demo access 逻辑、对应的单元测试，以及完整测试 / 生产构建结果。今天本地验证结果是：demo access 相关 3 个 test files、7 个测试通过；完整测试 48 个 test files 通过、1 个 skipped，164 个测试通过；Nuxt / Nitro build 成功。

这些材料可以复查 PactTrader 的 Demo 主路径：Landing -> Try Demo -> Dashboard -> 预置 CAW Agent Wallet / Pact 边界 -> 审计日志。当前验证材料不包含真实主网资金，也不提交任何私钥或 API Key。

公开 proof：
https://github.com/baikingrio/yield-agent/commit/e880a80af6e442a7a8156d00316364d005c8c9c0
https://github.com/baikingrio/yield-agent/blob/main/tests/demo-access.test.ts
https://github.com/baikingrio/ai-web3-school-note/blob/main/notes/20260610-pacttrader-demo-first-learning.md
```

隐私检查：只引用公开代码和测试文件，不包含 `.env`、API Key、私钥或真实资金信息。

## 3. 本次认为“很接近，但建议先补一个公开材料再提交”的任务

### D. Week 4｜Build Sprint｜Scope Freeze 与任务看板

- Task ID：`cmq4n9vrmvbytph01j49pfo9v`
- 当前状态：`NOT_STARTED`
- 分值：10
- 可用：是
- 判断：**接近，但建议先补材料**
- 原因：已有架构文档和 daily 里有开发任务拆解，但任务明确要求 Must-have / Should-have / Nice-to-have / Cut / Mock，并且每个 Must-have 有 owner、deadline、验证方式。目前公开材料还不够像“Scope Freeze 看板”。
- 建议补充文件：`hackathon/pacttrader-week4-scope-freeze.md`

### E. Week 4｜README & Demo Story｜项目说明与演示脚本

- Task ID：`cmq4n9xetvbz2ph019qzppsor`
- 当前状态：`NOT_STARTED`
- 分值：30
- 可用：是
- 判断：**接近，但建议先补材料**
- 原因：代码仓库已有 README，学习笔记也有 Demo-first 路径，但 README 仍有旧 YieldAgent 命名和“连接钱包”入口描述；还缺一版 3–5 分钟 Demo Story。
- 建议补充 / 修改：更新项目 README 命名与 Try Demo 路径；新增 `docs/demo-story.md` 或学习仓库 `hackathon/pacttrader-demo-story.md`。

## 4. 本次不建议提交的任务

以下任务虽然是 `available=true + NOT_STARTED`，但缺少真实证据，暂不建议提交：

- `cmq4n9xvgvbz5ph01nuc1h80v`｜Week 4｜Final Submission Pack｜最终提交包  
  原因：还缺最终 demo link、Demo 视频 / 截图、最终赛道说明等完整提交包。

- `cmq6fn1nbyfrhph01dcfiqh0p`｜Week 4｜Z.AI 承接｜会后 Quote / 项目对齐更新  
  原因：需要 Z.AI 分享会后的 Quote / README / proposal 更新证据，目前未看到会后承接材料。

- `cmq6fn1g4yfrfph0156mex4nh`｜Week 4｜Z.AI 预热｜提交会前问题并做 X 预热  
  原因：需要 X 预热或会前问题提交证据，不能凭空补。

- `cmq0j81lkk660ph01mtukt931`｜Week 4｜线上活动｜实时参加 06.10 Co-learning  
  原因：需要实时参加证据或至少明确的共学收获；当前 daily 没有记录该活动参与。

- `cmp9vkvn40p1lmw016y80836d` / `cmp9vkvtb0p1omw01mtov51lw`｜6.11 Z.AI 分享会实时 / 回放  
  原因：需要真实参加或回看笔记；不能提前提交。

- `cmq4na0j8vbzhph015d2mve95`｜观看回放 6.8 Moven 分享会  
  原因：需要回放观看笔记和具体启发，目前没有证据。

- `cmpukyz7ys1dspo015ksh6u4u`｜黑客松报名网站 Bug / PR 反馈  
  原因：需要实际 bug 反馈、issue、PR、截图或复现步骤。

- `cmpuki5lqs05ppo01hr1zezey`｜寻找 Hackathon 队友  
  原因：需要社群招募、联系队友、加入团队或报名页团队动作的真实证据。

- 所有“实时参加”类历史活动任务  
  原因：如果没有当时实时参加证据，不应补交。

## 5. 建议下一步选项

1. **只提交已公开 proof 的 3 个任务**：A、B、C。  
   需要用户确认后，我再通过 WCB API 提交。

2. **先补材料，再提交 5 个任务**：A、B、C + Scope Freeze + README & Demo Story。  
   我会先补公开文件/README，再让你确认 push 和提交。

3. **只保存预览，不提交**：本文件作为本地检查记录。

4. **你先人工 review 文案**：我可以只把任务 ID、标题和 proof 草稿发给你逐条确认。
