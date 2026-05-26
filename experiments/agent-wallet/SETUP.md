# Sepolia 链上准备（Zodiac Roles 路径）

完成本清单后，复制 `config.example.json` 为 `config.json` 并填入真实地址。

## 1. 环境变量

```bash
cd experiments/agent-wallet
cp .env.example .env
# 编辑 .env：SEPOLIA_RPC_URL、AGENT_PRIVATE_KEY
```

## 2. 身份

| 角色 | 说明 |
|------|------|
| **Owner** | Safe owner；部署 Roles 实例、`enableModule`、执行 `roles:plan` 产生的 apply 交易 |
| **Agent** | Sepolia 专用 EOA → `AGENT_PRIVATE_KEY` |

```bash
npm run setup:info
```

## 3. 创建 Safe（1.4.1 可用）

1. [app.safe.global](https://app.safe.global/) → **Sepolia**
2. 1-of-1 Safe → `safeAddress`
3. 转入 Sepolia ETH

## 4. 测试 USDC

- `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- 领取后转入 Safe

## 5. 部署 Roles Modifier 实例

> **警告**：`rolesModAddress` 必须是**为本 Safe 新部署的 Roles 实例地址**，不是全局主合约 `0x9646…`。  
> [roles.gnosisguild.org](https://roles.gnosisguild.org) **只有 View instance**，不能在这里部署；部署在 **Safe UI** 完成。

### 在 Safe 里部署（推荐）

1. 打开 [app.safe.global](https://app.safe.global/) → 你的 **Sepolia** Safe
2. 左侧 **Apps** → 搜索并打开 **Zodiac**（Gnosis Guild）
3. 选择 **Roles Modifier** → 保持默认（avatar 即为当前 Safe）
4. 点击 **Add module** / **Add Module**，用 Owner 签名并 **Execute**
5. 交易确认后，在 Etherscan 该笔 tx 的 **Internal transactions** 或 **Logs** 里找到 **新创建的合约地址**（即 Roles 实例）
6. 写入 `config.json` 的 `rolesModAddress`，并到 roles.gnosisguild.org 用 `sep:0x…` **View instance** 核对

若 Apps 里没有 Zodiac：用 Safe **Transaction Builder** 调用 Zodiac 工厂部署（见 [Roles 文档](https://docs.roles.gnosisguild.org/)），或参考 [permissions-starter-kit](https://github.com/gnosisguild/permissions-starter-kit)。

## 6. Safe 启用 Roles 模块

在 Safe UI（Apps → Zodiac 或 Transaction Builder）对 Safe 执行：

```text
enableModule(rolesModAddress)
```

确认 Settings → Modules 中已列出该模块。

## 7. （推荐）停用 Allowance Module

若曾配置 Spending limits，在 Safe UI **Remove delegate** / disable，避免 Agent 仍走旧路径。

Allowance 模块地址（仅作识别，勿再 enable）：`0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`

## 8. 应用 `agent_payer` 权限

```bash
npm install
npm run roles:setup          # 生成 eth-sdk allow kit
npm run roles:plan           # 打印 Owner 需执行的 calldata
```

Owner 执行 apply 交易（二选一）：

- **本地脚本（1-of-1 Safe）**：`.env` 配置 `OWNER_PRIVATE_KEY` 后  
  `npm run roles:apply`（仅 Call 2–3：`npm run roles:apply -- --from 2`）  
- **Safe UI**：Transaction Builder 粘贴 `roles:plan` 的 `{ to, data }`

然后在 [roles app](https://roles.gnosisguild.org) 核对：

- 成员：仅 `agentAddress`
- 权限：USDC `transfer` → 白名单收款方；单笔 ≤ `maxPerTx`；日限额 ≤ `maxDaily`（24h）

权限定义见 `roles/agent_payer/permissions.ts`（与 `config.policy` 对齐）。

## 9. config.json

```bash
cp config.example.json config.json
```

填写：

| 字段 | 说明 |
|------|------|
| `executionPath` | 固定 `"zodiac_roles"` |
| `safeAddress` | Safe |
| `agentAddress` | Agent EOA |
| `rolesModAddress` | 第 5 步实例地址 |
| `roleKey` | 默认 `"agent_payer"` |
| `policy.allowedRecipients` | 白名单收款方 |
| `policy.enforcement` | `both`（默认）或 `app` |

## 10. 验证 Demo

```bash
npm run demo:success
npm run demo:over-limit
npm run demo:not-whitelisted
npm run demo:roles-only      # 跳过 app 白名单，链上 Roles 拒绝
npm run demo:after-revoke    # 先从 role 移除 agent 成员后再跑
```

### 已验证记录（2026-05-23）

| 步骤 | 结果 |
|------|------|
| `roles:apply` Call 1 / 2 | [0xe4a8bc…](https://sepolia.etherscan.io/tx/0xe4a8bc3354d7bd6de2f339450dfa78dd53aeb95a1180aad9b7118589cbbd4448) / [0x098b4f…](https://sepolia.etherscan.io/tx/0x098b4f3c49797eed7d3525cc0f94e3ba14c0fb7ab7a9ddebaf4a0695e5d20460) |
| `demo:success` | executed → [0x705838…](https://sepolia.etherscan.io/tx/0x70583881b975348b89609459dba6e2ab7c5c21a59c647291a541cc36646914b5) |
| `demo:over-limit` | rejected，`exceeds_allowance` / `zodiac_roles`（simulate） |
| `demo:not-whitelisted` | rejected，`app_policy` |
| `demo:roles-only` | rejected，`zodiac_roles` |
| `roles:revoke` | [0xfb587c…](https://sepolia.etherscan.io/tx/0xfb587c9b4cfb54adb5534aaf1954de0b72e6bfd7e34f0d3cf45d23ed0c69a14c) |
| `demo:after-revoke` | rejected，`role_revoked` / `NoMembership()`（simulate，无 tx） |
| `roles:apply`（恢复） | [0xa3e7d4…](https://sepolia.etherscan.io/tx/0xa3e7d41e341f2959376bace3b5d720e785693dbda8822153f401200867399cab) |

WCB 摘录（五条）：[`logs/pow-audit-v0.3.jsonl`](./logs/pow-audit-v0.3.jsonl)。完整表见 [README.md](./README.md) § Demo 记录。

### Demo 5：撤销成员

```bash
npm run roles:revoke          # Owner 签 Safe tx，清空 agent_payer 成员
npm run demo:after-revoke     # 应 simulate 拒绝（无链上 tx）
npm run roles:apply           # 恢复成员
```

若跳过 `roles:revoke`，`demo:after-revoke` 仍会成功转账（误跑：[0x1469cea…](https://sepolia.etherscan.io/tx/0x1469cea977846893376ad3a1cd88ad27ad2bc5b5cbd6035408954a9c2910ef79)）。

## 11. Hermes + v0.4 Tools（2026-05）

```bash
npm run tool -- get-policy
npm run demo:e2e
npm run demo:human-confirm
npm run demo:daily-budget
npm test
```

完整说明：**[HERMES.md](./HERMES.md)**。`config.json` 需包含 `humanCheck`（见 `config.example.json`）。

---

## 附录 A：旧路径 v0.1 Allowance Module

<details>
<summary>Spending limits + executeAllowanceTransfer（已弃用主路径）</summary>

1. Safe **Apps → Spending limits** → delegate = Agent
2. 建议 1 USDC 单笔 / 5 USDC 日限额
3. 模块：`0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`

`src/allowance.ts` 保留供参考，执行层已改为 `src/roles.ts`。

</details>

## 附录 B：旧路径 v0.2 Module Guard（Safe ≥ 1.5.0）

<details>
<summary>AgentScoopeModuleGuard + setModuleGuard</summary>

Safe **v1.4.1**（Sepolia 常见 `0x29fcB43b…`）**没有** `setModuleGuard`，无法使用本附录。

若你使用 Safe ≥ 1.5.0：

```bash
npm run guard:test
npm run guard:deploy
# Safe 上对自身调用 setModuleGuard(guardAddress)
npm run demo:guard-whitelist   # 已 deprecated，改用 demo:roles-only
```

合约：`contracts/src/AgentScoopeModuleGuard.sol`

</details>
