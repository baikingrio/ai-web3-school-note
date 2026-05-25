# Week 2｜方向研究｜AI × Web3 问题地图与主方向选择

> WCB 任务：Week 2｜方向研究｜AI × Web3 问题地图与主方向选择  
> 学员：Quinn / baikingrio  
> 关联项目：AgentScoope Wallet｜Agent 受限执行钱包  
> 公开仓库：https://github.com/baikingrio/ai-web3-school-note

## 1. 本任务目标

Week 2 的核心不是继续堆工具，而是判断：哪些问题真的需要 AI 和 Web3 同时出现，哪些只是把两个概念拼在一起。

我用同一组问题来观察不同方向：

1. 如果没有 AI，这个问题是否仍然成立？AI 到底承担什么能力？
2. 如果没有 Web3，这个问题是否仍然成立？Web3 到底提供什么机制？
3. 谁发起任务、谁执行、谁付款、谁验收、谁承担失败成本？
4. 哪些动作可以自动化，哪些动作必须人工确认？
5. 结果如何验证？验证成本是否低于人工协调成本？
6. 主要风险是需求不存在、信任不可建立、成本过高、接口不成熟、权限风险，还是用户不愿改变流程？

本周我希望把 Week 1 已完成的 AgentScoope Wallet v0.3 demo，从“能执行一笔受限链上动作”推进到“能解释为什么这个方向值得继续做，以及风险边界在哪里”。

---

## 2. AI × Web3 问题地图

### 方向 A：Payment / Commerce / Settlement

**核心问题：**  
当 AI Agent 可以代表用户调用 API、购买数据、购买推理服务或完成链上任务时，如何处理报价、预算授权、交付、验收、付款、退款、争议和结算？

**AI 的作用：**

- 理解用户想购买什么服务；
- 比较服务、报价和交付条件；
- 自动发起请求、读取付款要求、整理交付结果；
- 在预算范围内执行低风险支付或生成待确认付款计划。

**Web3 的机制：**

- 链上支付和结算；
- 可验证 receipt / tx record；
- escrow、evaluator、reputation、settlement layer；
- x402、MPP、ERC-8004、ERC-8183 等 machine payment / agent commerce 相关协议。

**为什么不是纯 AI 问题：**  
AI 可以理解任务和生成付款计划，但它不能单独提供可信结算、公开收据、资金托管和争议处理机制。

**为什么不是纯 Web3 问题：**  
单纯链上支付只能解决“转账成功”，不能理解用户意图、选择服务、读取服务返回、判断交付是否满足需求。

**典型场景：**  
用户授权 Agent 在 5 USDC 预算内购买一个付费 API / 数据查询 / AI 推理结果，Agent 在付款后获取结果并记录 receipt。

**主要风险：**

- Agent 被诱导购买错误服务；
- 服务交付质量无法自动验证；
- 预算或付款条件表达不清；
- 只做“自动点支付按钮”，没有交付、验收、争议和审计，价值不足。

---

### 方向 B：Identity / Reputation / Capability / Interoperability

**核心问题：**  
Agent 如何被发现、描述、调用、验证和协作？如果一个 Agent 声称自己能做某件事，其他系统如何知道它是谁、能做什么、过去做得怎么样、失败由谁负责？

**AI 的作用：**

- 将自然语言任务转换为可声明的 capability；
- 根据上下文选择工具或其他 Agent；
- 生成任务结果、报告和交付说明；
- 参与 agent-to-agent 协作流程。

**Web3 的机制：**

- 去中心化身份、profile、registry；
- 链上 / 链下 attestation；
- 历史任务记录和 reputation；
- stake、slashing、evaluator 或第三方证明。

**为什么不是纯 AI 问题：**  
AI 可以描述能力，但不能仅靠自己建立跨平台可信身份、历史交付记录和可验证 reputation。

**为什么不是纯 Web3 问题：**  
Web3 可以记录身份和证明，但不能自动理解任务、生成交付物、调用工具和完成协作。

**典型场景：**  
一个 Agent Profile 写明：它可以解释交易、生成 Safe 执行计划、做 simulation，但不能签名、不能接触私钥、不能越权执行。

**主要风险：**

- 只有 NFT 名片或 DID，没有真实 capability；
- capability 声明不可验证；
- reputation 容易刷；
- 不同协议层级混淆，例如把 MCP、A2A、ERC-8004、MPP 当成同一种东西。

---

### 方向 C：Wallet / Permission / Safe Execution

**核心问题：**  
当 Agent 参与链上动作时，如何限制它能调用什么、能花多少钱、能在什么时间窗口内执行、哪些动作必须人工确认，以及失败后如何撤销和审计？

**AI 的作用：**

- 理解用户目标；
- 生成结构化执行计划；
- 解释交易参数和 simulation 结果；
- 调用受限工具；
- 在失败时输出原因和下一步建议。

**Web3 的机制：**

- Safe / 多签 / 智能账户；
- Zodiac Roles / Guard / Policy；
- ERC-4337 / 账户抽象；
- session key / delegated permission；
- 链上交易记录和区块浏览器验证；
- 撤销、暂停和审计日志。

**为什么不是纯 AI 问题：**  
AI 不能只靠提示词保证资金安全。真正的边界必须由钱包、智能账户、policy、guard、模块权限和链上执行结果共同约束。

**为什么不是纯 Web3 问题：**  
单纯钱包权限系统无法理解用户的自然语言目标，也无法把“帮我完成一个低风险链上任务”拆成计划、模拟、解释、确认和执行记录。

**典型场景：**  
Agent 代表用户在 Sepolia Safe 中执行一笔 0.5 USDC 测试网支付，但只能调用白名单 USDC `transfer`，超过额度、非白名单地址或撤销角色后必须拒绝。

**主要风险：**

- Agent 接触主私钥或 owner 权限；
- 无限 `approve` 或任意合约任意方法；
- prompt injection 诱导转错地址；
- 工具返回被伪造；
- 只有执行，没有拒绝、撤销和审计；
- “越界后再问用户要不要继续”会弱化 policy 边界。

---

### 方向 D：Privacy / Security / Sovereignty

**核心问题：**  
当 Agent 持有上下文、API Key、session token、交易权限、预算或用户数据时，如何避免 prompt injection、tool abuse、敏感信息泄露、越权执行和不可审计操作？

**AI 的作用：**

- 读取网页、文档和工具返回；
- 总结风险；
- 识别异常指令；
- 帮助生成 threat model 和确认策略；
- 在低风险场景中自动执行检查。

**Web3 的机制：**

- 最小权限授权；
- 链上公开记录和可验证执行；
- 钱包确认和撤销；
- 多签、guard、policy；
- 可审计日志和用户主权控制。

**为什么不是纯 AI 问题：**  
AI 可以识别风险，但不能保证自己不会被注入、不会误判、不会绕过权限。安全边界必须有外部可验证机制。

**为什么不是纯 Web3 问题：**  
Web3 权限可以限制链上动作，但不能自动理解恶意文本、污染文档、伪造工具返回和复杂上下文攻击。

**典型场景：**  
Agent 读取一个网页里的付款说明，但网页中隐藏 prompt injection，诱导 Agent 把资金转到攻击者地址。系统需要通过 allowlist、预算上限、simulation、人工确认和 audit log 拦截。

**主要风险：**

- prompt injection；
- indirect tool injection；
- sensitive information disclosure；
- excessive agency；
- 供应商锁定和黑盒执行；
- 用户无法导出数据、撤销授权或迁移执行环境。

---

### 方向 E：Dev Tooling / Agent Workflow

**核心问题：**  
AI 能不能真正改善 Web3 builder 的工作流，例如读文档、解释合约、生成测试、检查交易、维护 repo，而不是只生成看起来像代码的文本？

**AI 的作用：**

- 阅读文档和代码；
- 生成脚本、测试和 README；
- 解释交易、ABI、calldata、错误日志；
- 维护学习仓库和 proof-of-work；
- 生成 checklists 和复盘材料。

**Web3 的机制：**

- 合约地址、ABI、交易哈希、区块浏览器；
- 测试网交易和链上状态；
- 开源 repo 和可复现实验；
- CI / 测试 / simulation。

**为什么不是纯 AI 问题：**  
AI 生成的解释和代码必须通过真实 repo、测试网交易、区块浏览器和审计日志验证。

**为什么不是纯 Web3 问题：**  
纯 Web3 工具通常无法主动解释上下文、生成学习路径、整理错误原因和维护项目文档。

**典型场景：**  
一个 Agent 帮 builder 从 Safe / Zodiac Roles 文档生成权限配置脚本，并根据 Etherscan tx 和本地日志生成 WCB proof。

**主要风险：**

- AI 生成错误代码或不存在的 API；
- 工具调用参数错误；
- 没有测试和链上验证；
- Agent 自动改 repo / push / submit，缺少人工确认。

---

### 方向 F：Governance / Coordination / Public Goods

**核心问题：**  
AI 如何辅助 DAO、公共物品项目和社区进行提案总结、会议行动项、贡献记录和预算执行 checklist，同时不替代人类做价值判断和治理决策？

**AI 的作用：**

- 总结提案和讨论；
- 从会议中提取 action items；
- 生成预算执行 checklist；
- 整理贡献记录和未解决问题；
- 辅助社区成员理解治理材料。

**Web3 的机制：**

- 公开提案、投票和执行记录；
- Snapshot / Governor；
- 多签金库；
- 公共物品资助和贡献证明；
- 可验证 accountability。

**为什么不是纯 AI 问题：**  
AI 可以总结和提醒，但不能替代社区做价值判断、预算批准、惩罚或最终治理决策。

**为什么不是纯 Web3 问题：**  
Web3 治理工具可以记录投票和资金流，但无法自动整理复杂讨论、提炼行动项和降低参与门槛。

**典型场景：**  
Agent 自动总结一次 DAO 会议，生成行动项和预算影响说明，但所有预算动作都必须经过公开讨论和多签确认。

**主要风险：**

- AI 总结偏差影响治理判断；
- 自动生成并推动预算提案；
- 缺少来源链接和不确定性标注；
- 贡献记录只看数量，不看质量。

---

## 3. 两个候选方向比较

### 候选方向 1：Wallet / Permission / Safe Execution

**真实用户：**  
希望让 Agent 帮自己完成低风险链上操作，但不愿把主私钥、无限授权或完整资产控制权交给 Agent 的 builder、团队、多签用户和 Web3 power user。

**如果没有 AI，为什么难以解决：**  
用户需要手动理解意图、生成交易参数、检查 calldata、判断风险、解释失败原因。流程复杂，普通用户很难安全完成。

**如果没有 Web3，为什么缺一块：**  
没有链上权限、交易记录、智能账户、可撤销授权和公开验证，就无法证明 Agent 是否在权限边界内执行。

**适合形式：**  
产品 demo + developer tooling + risk model。

**一周内可验证：**  
可以基于已有 AgentScoope Wallet v0.3，继续输出流程图、权限策略、threat model、审计日志格式和 v0.4 tool calling 计划。

---

### 候选方向 2：Payment / Commerce / Settlement

**真实用户：**  
希望让 Agent 自动购买 API、数据、推理服务或工具服务，并保留付款和交付证明的用户 / builder / agent 服务方。

**如果没有 AI，为什么难以解决：**  
用户需要人工发现服务、理解报价、下单、验收结果和处理失败，自动化程度低。

**如果没有 Web3，为什么缺一块：**  
缺少开放支付、可验证 receipt、跨平台 settlement、escrow 和争议处理机制。

**适合形式：**  
流程设计 + 协议比较 + 后续 demo。

**一周内可验证：**  
可以设计 x402 / MPP / CAW 相关流程，但真实闭环实现成本较高，容易超出本周 1 小时 / 天的学习预算。

---

## 4. 本周主方向选择

我选择 **Wallet / Permission / Safe Execution** 作为 Week 2 主线。

原因是：

1. 它与我 Week 1 已经完成的 AgentScoope Wallet v0.3 直接连续。v0.3 已经验证 Sepolia Safe + Zodiac Roles Modifier 可以做到额度内成功、超额拒绝、非白名单拒绝、跳过 app policy 后链上拒绝、撤销 role 后拒绝。
2. 它能明确回答 AI × Web3 的交叉价值：AI 负责理解、规划、解释和调用工具；Web3 负责权限、执行、拒绝、撤销和验证。
3. 它有清晰的风险边界：私钥、签名、授权、转账、合约写入、预算、白名单、撤销和 audit log 都可以具体拆解。
4. 它可以自然进入 Week 3 / Hackathon：把 v0.3 脚本 demo 继续推进为 v0.4 的 Agent Tool Calling Flow。
5. 它不是“让 AI 自动控制钱包”，而是探索如何让 Agent 在可验证权限边界内执行任务。

我的 Week 2 主问题是：

> 如何设计一个让 AI Agent 可以执行链上动作，但不能越权、不能绕过人工确认、可以被审计和撤销的 Agent Wallet？

---

## 5. 主方向初步拆解：AgentScoope Wallet

### 目标用户

- 使用 AI Agent 的 Web3 builder；
- 希望自动执行小额链上任务的用户；
- 想让 Agent 帮忙支付 API / 工具费但不想交出主私钥的人；
- 需要可审计、可撤销执行流程的团队或多签用户。

### 真实场景

用户授权一个 Agent 在 24 小时内、最多 5 USDC 测试网额度内，只能向白名单地址或合约发起指定操作。Agent 根据用户意图生成计划，先做 policy check 和 simulation，再通过 Safe / Zodiac Roles 执行。越界请求直接拒绝，并记录原因。

### 参与方

- 用户 / Safe Owner：设定授权边界，负责高风险确认和撤销；
- Agent：理解任务、生成计划、调用受限工具；
- App Policy：做应用层预检，检查金额、地址、方法、频率；
- Safe / Zodiac Roles：做链上权限裁决；
- 区块浏览器 / Audit Log：提供验证和复盘材料；
- Reviewer / WCB：检查 proof-of-work 和风险边界是否清楚。

### 最小执行流程

```text
用户目标
  → Agent 解析意图
  → 生成结构化执行计划
  → App Policy 检查
  → Simulation / 参数解释
  → Safe / Zodiac Roles 权限检查
  → 额度内执行 / 越界拒绝 / 高风险人工确认
  → Etherscan 验证
  → Audit Log 记录
  → 必要时撤销 role 或停用权限
```

### 自动化边界

可以自动化：

- 读取公开资料；
- 生成执行计划；
- 做本地 policy check；
- 做 simulation；
- 在白名单、额度内、方法允许、时间窗口内执行低风险测试网操作；
- 写入 audit log。

必须人工确认或直接拒绝：

- 主网真实资产；
- 超过预算；
- 非白名单地址；
- 非允许合约 / 方法；
- 无限 `approve`；
- `setApprovalForAll`；
- 合约升级；
- 治理投票；
- 修改授权策略；
- 接触私钥、助记词、API Key、token 或 `.env`。

### 验证方式

- Sepolia tx hash；
- Etherscan 交易状态；
- Safe / Roles 配置；
- simulation 输出；
- `logs/pow-audit-v0.3.jsonl`；
- rejected case 的 reason 和 rejectLayer；
- 公开 GitHub repo 中的说明、脚本和日志样例。

---

## 6. 暂不选择的方向与原因

### Payment / Commerce / Settlement

暂不作为主线，但保留为 backlog。

原因：它很适合 AgentScoope Wallet 的后续扩展，但本周如果同时研究 x402、MPP、ERC-8004、ERC-8183、CAW 和 escrow，会分散注意力。当前更重要的是先把 wallet permission 和 safe execution 讲清楚。

### Identity / Reputation / Capability

暂不作为主线，但可以作为 Agent Profile 任务的延展。

原因：AgentScoope Wallet 未来确实需要 capability manifest，但当前项目最关键的风险不是“别人如何发现这个 Agent”，而是“这个 Agent 被发现后能不能安全执行链上动作”。

### Governance / Coordination / Public Goods

暂不作为主线。

原因：我对 DAO 协作和公共物品有兴趣，但它和当前 Hackathon 项目 AgentScoope Wallet 的直接关系较弱，短期内不如 wallet permission 方向更可验证。

---

## 7. Week 2 下一步计划

1. 完成 `Week 2｜Wallet / Permission｜Agent 链上动作权限策略`：画出 Agent 链上动作执行流程图，写清预算、白名单、人工确认、撤销和日志策略。
2. 完成 `Week 2｜Security / Privacy｜Agent Workflow Threat Model 与确认策略`：列出 prompt injection、伪造工具返回、越权指令、超预算执行等风险。
3. 整理 `Week 2｜总交付｜方向深挖包与项目初步 Proposal`：把问题地图、主方向选择、流程图、threat model、参考资料和 Week 3 计划汇总成总入口。
4. 准备 Week 3 / Hackathon v0.4：把 v0.3 的 Safe + Zodiac Roles 脚本 demo 推进到 Agent Tool Calling Flow：intent → plan → policy → simulate → confirm / execute / reject → audit log。

---

## 8. 隐私与安全说明

本文件只包含公开学习笔记、方向分析、公开项目链接和测试网场景说明，不包含私钥、助记词、API Key、token、`.env` 文件、会议密码或任何敏感信息。
