# Week 3｜Hackathon Direction Card｜AgentScoope Wallet

> Track: Cobo 赛道｜Agentic Economy × Cobo Agentic Wallet  
> Main direction: 01｜Agent-Native Payments  
> Demo scenario: 03｜Agent Resource Procurement  
> Project status: Cobo CAW 最小接入为 Week 4 主路径；Safe + Zodiac Roles 为已跑通 fallback。

## 1. 项目一句话说明

AgentScoope Wallet 是一个面向 AI Agent 的受限执行钱包：让 Agent 可以通过 Cobo Agentic Wallet（CAW）在用户预设的预算、白名单、时间窗口和策略边界内完成小额支付 / 资源采购；超出边界的操作会被拒绝或进入人工确认，并留下完整审计记录。

一句话原则：

> Agent recommends. Policy decides. Cobo executes only if allowed.  
> Agent 负责建议，Policy 负责裁决，Cobo 只执行被允许的付款。

## 2. 目标用户

- 希望让 AI Agent 购买 API、数据、工具服务或执行低风险链上支付的 builder。
- 已经在使用 AI coding / research agent，但不敢给 Agent 主私钥、无限授权或真实资产权限的用户。
- 想探索 Agentic Commerce，但需要预算控制、权限边界、人工确认和审计记录的团队。

## 3. 要解决的问题

AI Agent 可以理解任务、生成计划、调用工具，但一旦进入链上支付、转账、授权或合约写入，就不能简单地把控制权交给概率系统。

当前常见问题：

1. Agent 只能给建议，无法完成真实资金动作。
2. 如果直接给 Agent 钱包权限，风险太高，用户不敢用。
3. 普通钱包转账缺少 Agent 场景下需要的预算、白名单、时间窗口、policy decision 和 audit log。
4. Demo 很容易停留在“概念钱包”或“静态流程图”，没有真实执行能力。

AgentScoope Wallet 的切入点是：让 Agent 只在明确授权范围内执行小额、可审计、可撤销的付款或资源采购。

## 4. 为什么适合 Cobo 赛道

Cobo 赛道关注 Agentic Commerce：让 AI Agent 不只是提出建议，而是真正具备可控的链上资金执行能力。

AgentScoope Wallet 与 Cobo 赛道的匹配点：

- **Agent 参与经济活动**：Agent 购买 API / 数据 / 工具服务，或执行小额付款。
- **CAW 是关键执行层**：Cobo Agentic Wallet 负责在 scoped permission / Pact 范围内执行、pending approval 或拒绝。
- **权限控制**：通过预算、白名单、token、chain、amount、time window 和 owner threshold 限制 Agent 行为。
- **安全隔离**：Agent 不持有 owner 私钥，不接触助记词，不拥有无限授权。
- **可审计记录**：记录 Agent 建议、policy hard-check、执行结果、tx hash 或 denial reason。
- **真实 Demo 路径**：目标是展示至少一条 allowed transfer / pending approval / structured denial；如果 CAW 接入受阻，则用已跑通的 Safe + Zodiac Roles fallback 证明同一安全边界。

## 5. 最小 Demo 链路

```text
用户任务 / 资源采购需求
  -> Agent 生成付款或采购建议
  -> AgentScoope policy hard-check
  -> Cobo CAW scoped execution / pending approval / structured denial
  -> audit log + tx hash or denial reason
```

### Demo A：额度内成功

- Agent 请求向白名单 API 服务商支付 0.5 USDC。
- Policy 检查通过。
- CAW 执行付款；或 fallback 通过 Safe + Zodiac Roles 执行测试网转账。
- Audit log 记录 recommendation id、policy decision、tx hash。

### Demo B：超额拒绝

- Agent 请求支付 10 USDC。
- Policy 判断超过预算或 owner threshold。
- 系统返回 `owner_required` / `blocked`。
- 不执行付款，audit log 记录拒绝原因。

### Demo C：非白名单拒绝

- Agent 请求向非白名单地址支付 0.5 USDC。
- Recipient whitelist check 失败。
- 系统返回 `blocked`。
- 不执行付款，audit log 记录拒绝原因。

### Demo D：撤销后失败

- 用户撤销 Pact / session / role。
- Agent 再次请求付款。
- 系统拒绝执行并记录 revoked / role_revoked / permission revoked。

## 6. 技术路径

### Week 4 主路径：Cobo CAW 最小接入

- Cobo Agentic Wallet / Pact 作为资金执行层。
- 本地保存 CAW credentials，仅用于开发环境，不提交到公开 repo。
- 目标至少跑通以下能力中的 1–2 个：
  - allowed transfer
  - pending approval
  - structured denial

### 已跑通 fallback：Safe + Zodiac Roles

当前已有 Sepolia Safe + Zodiac Roles + Hermes tool demo，可作为 fallback implementation：

- 白名单收款方。
- 单笔 / 日预算限制。
- `simulate` / `pay` 工具。
- L0 自动执行、L1 人工确认、L2 owner required。
- 撤销 role 后调用失败。
- 审计日志与测试网 tx hash。

Fallback 原则：如果 CAW SDK / API / 邀请码在提交前无法完全打通，提交材料会透明说明 CAW 是目标执行层，Safe + Zodiac Roles 是 fallback，不把 fallback 包装成已完成 CAW 集成。

## 7. 明确不做

为了保证 Week 4 能完成可演示 MVP，v0.1 暂不做：

- 主网和真实资产。
- Agent 持有 owner 私钥 / 助记词。
- 无限 `approve` 或任意合约任意方法。
- 大额自动转账、NFT 转出、合约升级。
- 自主交易策略、套利、做市、收益管理。
- 多 Agent 互雇、拍卖、分账、Treasury 管理。
- 完整 marketplace、escrow、仲裁系统。

## 8. 风险与假设

- 假设 Cobo CAW SDK / CLI / API 权限可以在 Week 4 内至少完成最小接入。
- 如果 CAW 接入受阻，fallback 是使用已跑通的 Safe + Zodiac Roles 证明相同的安全边界。
- Agent 的付款建议不等于授权；执行许可只能来自 policy hard-check。
- LLM 不能发明收款地址；recipient 必须来自可信输入或白名单。
- 中高风险动作必须进入人工确认或 owner required，不能用普通确认绕过。
- 所有演示均使用测试网和测试 token，不碰真实资产。

## 9. Week 4 Sprint Plan

- Day 1：整理 README / demo script，统一 Cobo 赛道语言。
- Day 2：尝试 CAW SDK / CLI onboarding，确认可用接口、凭证和测试环境。
- Day 3：把 AgentScoope policy hard-check 输出接到 CAW execution / pending / denial 流程。
- Day 4：补齐 fallback demo：额度内成功、超额拒绝、非白名单拒绝。
- Day 5：补齐撤销后失败、audit log、tx hash / denial reason。
- Day 6：录制 3–5 分钟 Demo 视频，整理截图和运行说明。
- Day 7：最终检查 README、提交包、安全边界和 Hackathon submission。

## 10. 公开 proof 链接

- Hackathon brief: [`hackathon/agent-wallet-permissions-brief.md`](./agent-wallet-permissions-brief.md)
- Existing implementation / fallback: [`experiments/agent-wallet/`](../experiments/agent-wallet/)
- Learning repo: https://github.com/baikingrio/ai-web3-school-note

## 11. 提交草稿

```text
AgentScoope Wallet 是一个面向 AI Agent 的受限执行钱包。我选择 Cobo 赛道，因为这个项目的核心问题是 Agent 如何在明确预算、白名单、时间窗口和审计记录约束下执行链上资金操作，而不是获得无限钱包权限。

项目主方向是 Agent-Native Payments，Demo 场景是 Agent Resource Procurement：Agent 在预算和白名单内购买 API / 数据 / 工具服务。流程是：用户任务 → Agent 生成付款建议 → AgentScoope policy hard-check → Cobo Agentic Wallet 执行 / pending approval / structured denial → audit log。

Week 4 我会优先尝试 Cobo CAW 最小接入；如果 SDK / API 权限在提交前无法完全打通，则使用已经跑通的 Sepolia Safe + Zodiac Roles fallback 演示同样的权限边界，包括额度内成功、超额拒绝、非白名单拒绝和撤销后失败。整个 demo 只使用测试网和测试 token，不提交私钥、助记词、API key 或真实资产信息。
```
